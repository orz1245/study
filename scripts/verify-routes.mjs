// 静态站回归。全站已经没有任何前端框架，所以这里不再做 SSR 渲染 ——
// 改为直接断言「构建产物 dist/」本身，也就是线上真正被访问的东西。
//
// 覆盖七类断言：
//   1. sitemap 里的 URL 与磁盘上的静态页**双向零差集**（少一个页、多一个孤儿页都会报）
//   2. 每个页面的 head 与 src/utils/seo.js 算出的一致（title/description/keywords/robots/canonical）
//   3. 每个页面都有 h1、顶部导航、页脚（外壳完整性）
//   4. 每个页面的正文里确实出现它该有的内容（课时标题、题目行数、题库列表）
//   5. 小岛页面引用的脚本存在，且脚本要用的 DOM 挂点也在（防止「页面在、交互全废」）
//   6. 全站没有残留的 Vue 挂载点 / bundle 引用
//   7. 标题与描述全站唯一；负例 URL 没有对应页面（线上会拿真实 404）
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { allQuestions, categories } from '../src/data/index.js'
import { courses } from '../src/data/courses.js'
import { flatLessons } from '../src/utils/course-structure.js'
import { seoForRoute, canonicalFor, robotsOf, SITE_ORIGIN as SITE } from '../src/utils/seo.js'
import { courseIdFromSlug, categoryFromSlug } from '../src/utils/urls.js'

const ROOT = resolve(process.cwd())
const DIST = join(ROOT, 'dist')

if (!existsSync(join(DIST, 'sitemap.xml'))) {
  console.log('缺少 dist/sitemap.xml —— 先跑 npm run build')
  process.exit(1)
}

const bad = []
let failCount = 0
function report(msg) { failCount++; bad.push(msg) }

const unesc = (s = '') =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

function parseHead(html) {
  const pick = (re) => {
    const m = re.exec(html)
    return m ? unesc(m[1]) : ''
  }
  return {
    title: pick(/<title>([\s\S]*?)<\/title>/),
    description: pick(/<meta name="description" content="([^"]*)">/),
    keywords: pick(/<meta name="keywords" content="([^"]*)">/),
    robots: pick(/<meta name="robots" content="([^"]*)">/),
    canonical: pick(/<link rel="canonical" href="([^"]*)">/),
  }
}

function fileFor(path) {
  return path === '/' ? join(DIST, 'index.html') : join(DIST, path.replace(/^\/|\/$/g, ''), 'index.html')
}

// ---------- URL → 路由对象（与 src/routes.js 的路径形状一一对应） ----------
// 刻意不引入 vue-router：站点没有客户端路由了，验证脚本也不需要。若 routes.js 改了 URL 形状，
// 下面的 unmatched 计数会立刻不为 0，从而把这段映射暴露出来。
function matchRoute(path) {
  if (path === '/') return { name: 'home', params: {} }
  if (path === '/course/') return { name: 'course-index', params: {} }
  if (path === '/interview/') return { name: 'interview', params: {} }
  if (path === '/progress/') return { name: 'progress', params: {} }
  if (path === '/guestbook/') return { name: 'guestbook', params: {} }
  if (path === '/donate/') return { name: 'donate', params: {} }

  let m = /^\/course\/([^/]+)\/l(\d+)\/$/.exec(path)
  if (m) return { name: 'course-lesson', params: { courseSlug: m[1], lessonNum: m[2] } }
  m = /^\/course\/([^/]+)\/$/.exec(path)
  if (m) return { name: 'course', params: { courseSlug: m[1] } }
  m = /^\/interview\/([^/]+)\/([^/]+)\/$/.exec(path)
  if (m) return { name: 'interview-question', params: { catSlug: m[1], qSlug: m[2] } }
  m = /^\/interview\/([^/]+)\/$/.exec(path)
  if (m) return { name: 'interview-category', params: { catSlug: m[1] } }
  return null
}

// ---------- 1. sitemap ↔ 磁盘静态页 ----------
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf-8')
const targets = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/')
const NOINDEX_TARGETS = ['/progress/'] // 故意不进 sitemap，但必须存在且 noindex

const onDisk = new Set()
;(function walk(dir, prefix) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name === 'islands') continue // 小岛脚本目录，不是页面
      walk(join(dir, e.name), prefix + '/' + e.name)
    } else if (e.name === 'index.html') {
      onDisk.add(prefix + '/')
    }
  }
})(DIST, '')

const sitemapSet = new Set(targets)
for (const p of sitemapSet) if (!onDisk.has(p)) report(`NOFILE ${p} 在 sitemap 里但磁盘上没有静态页`)
for (const p of onDisk) {
  if (!sitemapSet.has(p) && !NOINDEX_TARGETS.includes(p)) report(`ORPHAN ${p} 有静态页但不在 sitemap（也没声明 noindex）`)
}

// ---------- 2~6. 逐页断言 ----------
const titles = new Map()
const descs = new Map()
let headChecked = 0
let contentChecked = 0
let codeCopyPages = 0
let pgPages = 0
let unmatched = 0

const NOFRAME_RE = /id="app"|<script type="module"/
const ALL_URLS = [...targets, ...NOINDEX_TARGETS]

for (const path of ALL_URLS) {
  const file = fileFor(path)
  if (!existsSync(file)) { report(`NOFILE ${path}`); continue }
  const html = readFileSync(file, 'utf-8')
  const head = parseHead(html)

  // —— head 与 seo.js 一致 ——
  const route = matchRoute(path)
  if (!route) { unmatched++; report(`ROUTE ${path} 没有对应的路由映射（verify 里的 matchRoute 需要同步）`); continue }
  const seo = seoForRoute(route)
  const expect = {
    title: seo.title,
    description: seo.description,
    keywords: (seo.keywords || []).join(', '),
    robots: robotsOf(seo),
    canonical: seo.noCanonical ? '' : canonicalFor(path),
  }
  for (const k of ['title', 'description', 'keywords', 'robots', 'canonical']) {
    if (head[k] !== expect[k]) {
      report(`HEAD ${path} [${k}] 静态="${String(head[k]).slice(0, 70)}" ≠ 期望="${String(expect[k]).slice(0, 70)}"`)
    }
  }
  headChecked++

  // —— 外壳完整性 ——
  if (!/<h1[\s>]/.test(html)) report(`H1   ${path} 页面里没有 h1`)
  if (!html.includes('<nav class="top"')) report(`NAV  ${path} 缺少顶部导航`)
  // 页头 GitHub 图标（2026-10-15 用户要求：移到页头右上角高频区）
  if (!/<a class="nav-gh" href="https:\/\/github\.com\/orz1245\/study"[^>]*><svg/.test(html)) {
    report(`NAV  ${path} 页头缺少 GitHub 图标链接`)
  }
  // 页脚重新设计（2026-10-15 用户要求：友情链接设置在页脚小位置 + 站名链回本站 + 版权声明）。
  // 允许且仅允许 colophon 这一个 footer；内部导航由顶部 sticky 导航承担。
  if (!/<footer class="colophon">[\s\S]*?<div class="colophon-links">[\s\S]*?<a class="cp-site" href="[^"]*\/">前端学习网<\/a>/.test(html)) {
    report(`FOOT ${path} 页脚缺站名链接或友情链接模块`)
  }
  const footers = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/g) || []
  if (footers.length !== 1) report(`FOOT ${path} footer 元素应有且仅有 1 个（colophon），实际 ${footers.length}`)
  if (/site-foot|foot-nav|foot-grid|foot-col|fdesc|flogo/.test(html)) {
    report(`FOOT ${path} 仍残留页脚类名或样式`)
  }
  // kicker 栏目名（INTERVIEW · 题库 / DASHBOARD · 进度 这类）与页头黑线都已下线
  if (html.includes('class="kicker"')) report(`KICK ${path} 仍有已下线的 kicker 栏目名`)
  // 四个列表/功能页不放面包屑：层级只有「首页 / 本页」，与顶部导航重复（2026-10-07 用户要求）
  if (/^\/(course\/?|interview\/?|guestbook\/?|donate\/?)$/.test(path) && html.includes('class="crumb"')) {
    report(`CRUMB ${path} 列表页不应再有面包屑`)
  }
  if (/<div class="meta-row"/.test(html)) report(`HEAD ${path} 仍有已下线的页头黑线行`)
  // ⌨ 等装饰符号在部分系统渲染成豆腐块（用户看不懂），按钮文案只用纯文字
  if (html.includes('⌨')) report(`GLYPH ${path} 出现装饰符号 ⌨（已下线）`)

  // —— 导航全局搜索（方案A）：每页都必须有 ——
  if (!html.includes('<input id="nav-search"')) report(`SRCH ${path} 导航缺少全局搜索框`)
  if (!html.includes('/islands/nav-search.js')) report(`SRCH ${path} 缺少 nav-search.js`)

  // —— sticky 导航遮挡：标题必须有 scroll-margin-top（导航高 58px）——
  // 导航高 64px，锚点落点留 80px 余量，标题必须停在导航下方而不是被盖住
  if (!/scroll-margin-top:\s*80px/.test(html)) report(`SCRL ${path} 缺少 h1/h2/h3 的 scroll-margin-top`)

  // —— 内联样式必须完整落在同一个 style 元素里 ——
  // style 是原始文本元素：内容里只要出现一次结束标签，浏览器就在那里收尾，
  // 剩下的 CSS 会变成正文文本、整站无样式（2026-10-06 真实踩过，构建日志无感）。
  const styleOpens = (html.match(/<style>/g) || []).length
  const styleCloses = (html.match(/<\/style>/g) || []).length
  const styleBlock = /<style>([\s\S]*?)<\/style>/.exec(html)
  if (styleOpens !== 1 || styleCloses !== 1) {
    report(`CSS  ${path} style 标签数异常（${styleOpens} 开 / ${styleCloses} 闭），样式表可能被截断`)
  } else if (!styleBlock || styleBlock[1].length < 3000) {
    report(`CSS  ${path} 内联样式只有 ${styleBlock ? styleBlock[1].length : 0} 字符，疑似被提前收尾`)
  } else {
    for (const k of [':root', '.article h2', '.footnav']) {
      if (!styleBlock[1].includes(k)) report(`CSS  ${path} 内联样式缺少 ${k}（样式表不完整）`)
    }
    // 全站分割线下线（2026-10-07）：任何页面都不该再有横向分隔线（表格/引用条不算，
    // 那是 1px 全边框与左侧竖条，不是「分割线」）。留着这条断言防止样式表回潮。
    const lines = styleBlock[1].match(/border-(?:top|bottom)\s*:/g)
    if (lines) report(`CSS  ${path} 仍有横向分隔线 ${lines.join(' ')}（全站已下线）`)
  }

  // —— 无框架残留 ——
  if (NOFRAME_RE.test(html)) report(`FRAME ${path} 仍有 Vue 挂载点或 module bundle 引用`)

  // 7. 站内链接完整性校验（防止死链导致 Google Search Console 报 404 抓取错误）
  for (const mLink of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = mLink[1]
    if (href.startsWith('//')) continue
    const asDir = join(DIST, href.replace(/^\//, ''), 'index.html')
    const asFile = join(DIST, href.replace(/^\//, ''))
    if (!existsSync(asDir) && !existsSync(asFile)) {
      report(`LINK_BROKEN ${path} 存在指向不存在路径的死链 href="${href}"`)
    }
  }

  // —— 代码块复制：凡是渲染了复制按钮的页面，样式与脚本必须同时到位 ——
  // 少任何一样都会退化成「按钮跑到代码上方」或「点了没反应」，
  // 而这正是拆掉 Vue 之后踩过的坑，所以固化成构建期断言。
  if (/<button class="code-copy"/.test(html)) {
    if (!html.includes('/islands/code.js')) report(`CODE ${path} 有复制按钮但没有引入 code.js（点了没反应）`)
    if (!html.includes('.code-block { position: relative }')) report(`CODE ${path} 缺少 .code-block 定位样式（按钮会跑到代码上方）`)
    if (!html.includes('.code-copy {')) report(`CODE ${path} 缺少 .code-copy 定位样式（按钮会跑到代码上方）`)
    if (!html.includes('i-copy') || !html.includes('i-check')) report(`CODE ${path} 复制按钮应是 SVG 图标（copy + check 两枚）`)
    if (/class="code-copy"[^>]*>\s*复制/.test(html)) report(`CODE ${path} 复制按钮不应是文字`)
    codeCopyPages++
  }

  // —— 章节标题不得再带 01/02 数字徽标（章节名里已有「第二章」）——
  if (/^\/course\/[^/]+\/$/.test(path) && /<div class="chap"><span class="no">/.test(html)) {
    report(`CHAP ${path} 章节标题仍带数字徽标`)
  }

  // —— 课程封面页：课时数跟在 h1 后方；底部不再有「开始学习」按钮 ——
  if (/^\/course\/[^/]+\/$/.test(path)) {
    if (!/<h1 class="page">[^<]*<span class="n">（\d+ 节课）<\/span><\/h1>/.test(html)) {
      report(`LAND ${path} h1 后应跟「（N 节课）」`)
    }
    if (html.includes('class="tag"')) report(`LAND ${path} 仍在用已下线的 .tag 胶囊`)
    if (html.includes('开始学习 →')) report(`LAND ${path} 底部仍有「开始学习」按钮`)
    if (/<span class="lid">/.test(html)) report(`LAND ${path} 节行不应再有 l1/l2 编号`)
    // 课程说明必须是提炼后的自然文案：禁「N 节…」开头与「通俗课/实战课」模板（用户 2026-10-07）
    const sub = /<p class="page-sub">([^<]*)<\/p>/.exec(html)
    if (!sub) report(`LAND ${path} 缺少课程说明 page-sub`)
    else if (/^\d+\s*节/.test(sub[1]) || /通俗课|实战课|系统课/.test(sub[1])) {
      report(`LAND ${path} 课程说明仍是机械模板：「${sub[1].slice(0, 30)}…」`)
    }
  }

  // —— 演练场（REFACTOR-SEO-PLAN §3.2）：题目详情页 / 课时页 / 课程封面页都挂 ——
  // 2026-10-07 起从「只有题目页」扩到三门课程页面，所以断言按页面类型分别校验引用文案。
  {
    const isQ = /^\/interview\/[^/]+\/[^/]+\/$/.test(path)
    const isL = /^\/course\/[^/]+\/l\d+\/$/.test(path)
    const isC = /^\/course\/[^/]+\/$/.test(path)
    if (isQ || isL || isC) {
      const refLabel = isQ ? '当前题目' : isL ? '当前课时' : '当前课程'
      const pgNeed = [
        'id="pg-open"',                       // 右下角悬浮调起按钮
        '<aside class="pg" id="pg"',          // 浮层骨架（构建期直出）
        '<textarea class="pg-editor"',        // 编辑器
        'data-pg="run"',                      // 运行
        '/islands/playground.js',             // 行为
        '.pg-open {',                         // 样式已内联
        'bottom: 22px',                       // 按钮/浮层钉在右下角
        '.pg-open[hidden] {',                 // 浮层打开时按钮让位
        `${refLabel}：`,                       // 构建期直出的引用文案
      ]
      for (const k of pgNeed) if (!html.includes(k)) report(`PG   ${path} 缺少演练场元素 ${k}`)
      // 头部 -（折叠）按钮已下线；× 关闭按钮 2026-10-07 按用户要求恢复
      if (html.includes('data-pg="min"')) report(`PG   ${path} 演练场不应再有折叠按钮`)
      if (!html.includes('data-pg="close"')) report(`PG   ${path} 缺少头部 × 关闭按钮`)
      if (!html.includes('class="pg-grip"')) report(`PG   ${path} 缺少左上角缩放手柄`)
      if (pgNeed.every((k) => html.includes(k))) pgPages++
    }
  }

  // 非演练场页不得内联演练场样式（只按需内联，不污染其他 300+ 页）
  if (!/^\/(interview\/[^/]+\/[^/]+|course\/[^/]+(\/l\d+)?)\/$/.test(path) && html.includes('.pg-open {')) {
    report(`PG   ${path} 不需要演练场，却内联了它的样式`)
  }

  // —— 正文内容 ——
  let m = /^\/course\/([^/]+)\/l(\d+)\/$/.exec(path)
  if (m) {
    const course = courses.find((c) => c.id === courseIdFromSlug(m[1]))
    const lesson = course ? flatLessons(course)[Number(m[2]) - 1] : null
    if (!course || !lesson) report(`LESSON ${path} URL 无法映射到课时（slug=${m[1]} l${m[2]}）`)
    else if (!unesc(html).includes(lesson.title)) {
      report(`LESSON ${path} 正文未出现该节标题「${lesson.title.slice(0, 30)}」`)
    } else contentChecked++
    // 课时页：课程/章节信息由面包屑承担，不再重复 page-sub；课后练习不写（附答案），
    // 且与正文之间必须有 ··· 间隔元素（用户 2026-10-07）
    if (/<p class="page-sub">/.test(html)) report(`LESSON ${path} 课时页不应再有副标题`)
    if (html.includes('（附答案）')) report(`LESSON ${path} 课后练习不应写「（附答案）」`)
    if (!html.includes('class="sec-gap"')) report(`LESSON ${path} 课后练习前缺少 ··· 间隔元素`)
    // 练习/答案分样式（2026-10-07）：有练习就必须有问题块和答案块两种类。
    // 问题形态两种：p.ex-q（「练习 N：」行）或 ol.ex-ol（编号卡列表）；答案统一 ex-a。
    if (html.includes('课后练习')) {
      if (!html.includes('class="ex-q"') && !html.includes('class="ex-ol"')) {
        report(`LESSON ${path} 练习问题块缺少 ex-q/ex-ol 样式类`)
      }
      if (!html.includes('class="ex-a"')) report(`LESSON ${path} 答案块缺少 ex-a 样式类`)
    }
    // 「核心讲解」小标题已下线（2026-10-06），正文里不该再出现
    if (html.includes('核心讲解')) report(`LESSON ${path} 正文仍出现「核心讲解」小标题`)
  }
  if (path === '/') {
    // 首页栏目标题带数量（前端课程（N）/ 面试题库（N）），数量放小标题里；
    // 课程在下方已经全部列出，所以不再有「查看全部 →」这类指向重复列表的链接（用户 2026-10-07 要求）。
    if (!/<h2>前端课程<span class="n">（\d+）<\/span><\/h2>/.test(html)) {
      report(`HOME ${path} 小标题应为「前端课程（N）」`)
    }
    if (!/<h2>面试题库<span class="n">（\d+）<\/span><\/h2>/.test(html)) {
      report(`HOME ${path} 面试题库小标题应带题目数量（N）`)
    }
    if (/查看全部/.test(html)) report(`HOME ${path} 课程已列全，不该再有「查看全部」入口`)
  }
  if (path === '/interview/') {
    // 2026-10-07 用户要求：/interview/ 不再全量直出，只展示第一个分类的题
    const firstQs = allQuestions.filter((q) => q.category === categories[0].key)
    const n = (html.match(/class="row" data-qid/g) || []).length
    if (n !== firstQs.length) report(`ROWS ${path} 题目行数 ${n} ≠ 第一个分类的 ${firstQs.length} 题`)
    if (/全部<\/a>/.test(html)) report(`CHIPS ${path} 分类里不该再有「全部」入口`)
    else contentChecked++
  }
  m = /^\/interview\/([^/]+)\/$/.exec(path)
  if (m) {
    const cat = categoryFromSlug(m[1])
    const want = cat ? allQuestions.filter((q) => q.category === cat).length : 0
    const n = (html.match(/class="row" data-qid/g) || []).length
    if (!cat || !want) report(`ROWS ${path} 分类 slug「${m[1]}」无法映射或该类无题`)
    else if (n !== want) report(`ROWS ${path} 题目行数 ${n} ≠ ${want}`)
    else contentChecked++
  }

  // —— 小岛页面：脚本存在 + DOM 挂点存在 ——
  const scripts = [...html.matchAll(/<script src="(\/islands\/[^"]+)" defer><\/script>/g)].map((x) => x[1])
  for (const s of scripts) {
    if (!existsSync(join(DIST, s.replace(/^\//, '')))) report(`ISLE ${path} 引用了不存在的脚本 ${s}`)
  }
  const need = {
    '/interview/': ['id="q-list"', 'id="q-search"', 'id="pb"', 'id="pstat"', 'id="q-empty"'],
    '/progress/': ['id="dash"', 'id="dash-data"', 'id="dash-reset"', 'data-tip="掌握度可在题库列表中点击方框标记"'],
    '/guestbook/': ['id="gb-form"', 'id="gb-items"', 'id="gb-state"'],
  }[path] || (m ? ['id="q-list"', 'id="q-search"', 'id="pb"'] : [])
  for (const k of need) {
    if (!html.includes(k)) report(`ISLE ${path} 缺少脚本依赖的挂点 ${k}`)
  }
  if (need.length && !scripts.length) report(`ISLE ${path} 有挂点但没有引入任何小岛脚本`)
  if (path === '/progress/') {
    const j = /<script type="application\/json" id="dash-data">([\s\S]*?)<\/script>/.exec(html)
    if (!j) report('DATA /progress/ 缺少 dash-data')
    else {
      try {
        const d = JSON.parse(j[1])
        const total = d.cats.reduce((n, c) => n + c.ids.length, 0)
        if (total !== allQuestions.length) report(`DATA /progress/ 内联元数据题数 ${total} ≠ ${allQuestions.length}`)
      } catch (e) {
        report('DATA /progress/ 内联 JSON 无法解析')
      }
    }
  }

  // —— head 唯一性 ——
  titles.set(head.title, [...(titles.get(head.title) || []), path])
  descs.set(head.description, [...(descs.get(head.description) || []), path])
}

// ---------- 7. 404 与负例 ----------
if (!existsSync(join(DIST, '404.html'))) report('NOFILE dist/404.html 缺失')
else {
  const h = parseHead(readFileSync(join(DIST, '404.html'), 'utf-8'))
  if (h.canonical) report('HEAD 404.html 不应该有 canonical')
  if (!/noindex/.test(h.robots)) report('HEAD 404.html 应该带 noindex')
}

const negatives = ['/no-such-page/', '/course/does-not-exist/', '/interview/javascript/no-such-question/']
for (const p of negatives) {
  if (existsSync(fileFor(p))) report(`NEG  ${p} 竟然有静态页（应该由 404.html 返回真实 404）`)
}

for (const [k, list] of titles) if (list.length > 1) report(`DUP-TITLE "${k.slice(0, 50)}" ← ${list.join(' , ')}`)
for (const [k, list] of descs) if (list.length > 1) report(`DUP-DESC  "${k.slice(0, 50)}" ← ${list.join(' , ')}`)

// ---------- 其他产物 ----------
const redirects = readFileSync(join(DIST, '_redirects'), 'utf-8')
const redirectCount = redirects.split('\n').filter((l) => / 301$/.test(l.trim())).length / 2 // 每条旧 URL 有无斜杠两行
if (!redirects.includes('/study /progress/ 301')) report('REDIRECT 缺少 /study → /progress/ 的 301')
if (!/^\/\* /m.test(redirects) && /index\.html 200/.test(redirects)) report('REDIRECT 又出现了 index.html 200 全量回退')

// 校验 sitemap.xml 每条 <url> 均包含合法 <lastmod>YYYY-MM-DD</lastmod>
const lastmodMatches = [...sitemap.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)]
if (lastmodMatches.length !== targets.length) {
  report(`SITEMAP <lastmod> 数量 ${lastmodMatches.length} ≠ <loc> 数量 ${targets.length}`)
}
if (!existsSync(join(DIST, 'sitemap-index.xml'))) {
  report('SITEMAP 缺少 dist/sitemap-index.xml')
}
for (const p of ['/robots.txt', '/_headers', '/search-index.json', '/favicon.svg', '/sitemap-index.xml']) {
  if (!existsSync(join(DIST, p.replace(/^\//, '')))) report(`ASSET 缺少 ${p}`)
}
const si = JSON.parse(readFileSync(join(DIST, 'search-index.json'), 'utf-8'))
if (Object.keys(si).length !== allQuestions.length) {
  report(`INDEX search-index.json 条目 ${Object.keys(si).length} ≠ ${allQuestions.length}`)
}

if (bad.length) console.log(bad.slice(0, 30).join('\n'))
console.log(`\n静态页 ${onDisk.size} 个 · sitemap ${targets.length} 条 · 301 ${redirectCount} 条`)
console.log(`head 逐字段比对 ${headChecked} 页 × 5 字段 = ${headChecked * 5} 项 · 正文内容断言 ${contentChecked} 页`)
console.log(`代码块复制断言 ${codeCopyPages} 页 · 演练场断言 ${pgPages} 页`)
console.log(`路由映射未命中 ${unmatched} 条`)
console.log(failCount ? `失败 ${failCount} 条` : '全部通过 ✔')
process.exit(failCount ? 1 : 0)
