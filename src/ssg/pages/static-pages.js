// 静态基础页生成：首页（/）、学习仪表盘（/progress/）、留言板（/guestbook/）、支持我们（/donate/）、友情链接（/links/）、404 页与搜索索引
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { courses } from '../../data/courses.js'
import { allQuestions, categories, modules } from '../../data/index.js'
import { friendLinks } from '../../data/friend-links.js'
import { courseUrl, categoryUrl } from '../../utils/urls.js'
import {
  homeSeo,
  progressSeo,
  guestbookSeo,
  donateSeo,
  linksSeo,
  notFoundSeo,
  categorySeoName,
  robotsOf,
  canonicalFor,
} from '../../utils/seo.js'
import { esc, mdToText, firstSentence } from '../html.js'
import { breadcrumbJsonLd, articleJsonLd, webSiteJsonLd } from '../jsonld.js'
import { pageHeadHtml, BAIDU_ANALYTICS } from '../layout.js'
import { DIFF_LABEL } from './interview.js'

export function buildStaticPages({ distDir, writePage, pageShell, byCategory, siteLastmod }) {
  const sitemapEntries = []
  let fileCount = 0

  // —— 学习仪表盘（/progress/，noindex, follow，不进 Sitemap）——
  const progressMeta = progressSeo()
  const mods = modules.map((m) => ({ k: m.key, n: m.name, cats: m.categories }))
  const cats = [...byCategory.entries()].map(([k, qs]) => ({
    k,
    n: categorySeoName(k),
    ids: qs.map((q) => q.id),
  }))
  const diffs = ['easy', 'medium', 'hard'].map((d) => ({
    k: d,
    n: DIFF_LABEL[d],
    ids: allQuestions.filter((q) => q.difficulty === d).map((q) => q.id),
  }))
  writePage('progress', pageShell({
    ...progressMeta,
    canonical: canonicalFor('/progress/'),
    robots: robotsOf(progressMeta),
    jsonLd: [],
    bodyHtml: `${pageHeadHtml({
      title: '学习仪表盘',
      desc: '按方向显示你在面试题库里的做题情况：哪些已经掌握、哪些还在模糊、哪些还没碰过，以及每个方向还差多少。进度保存在你自己的浏览器里，不会上传。',
    })}
<button class="btn-line btn-danger" id="dash-reset" type="button" data-tip="掌握度可在题库列表中点击方框标记" hidden>清空掌握度</button>
<div id="dash"></div>
<script type="application/json" id="dash-data">${JSON.stringify({ mods, cats, diffs })}</script>`,
    active: 'progress',
    islands: true,
    mainClass: 'island',
    scripts: ['/islands/core.js', '/islands/progress.js'],
  }))
  fileCount++

  // —— 留言板（/guestbook/）——
  const guestbookMeta = guestbookSeo()
  writePage('guestbook', pageShell({
    ...guestbookMeta,
    canonical: canonicalFor('/guestbook/'),
    robots: robotsOf(guestbookMeta),
    jsonLd: [
      breadcrumbJsonLd([{ name: '首页', url: '/' }, { name: '留言板' }]),
      articleJsonLd({ title: '留言板', canonical: canonicalFor('/guestbook/'), section: '留言板', dateModified: siteLastmod }),
    ],
    bodyHtml: `<section class="gb-head"><h1>留言板</h1>
<p class="gb-sub">对面试题或课程内容有疑问、发现错误或想要补充，都可以在这里留言。其他人的提问同样值得参考。</p>
</section>
<div class="gb-layout">
<section class="gb-list">
<div class="gb-state" id="gb-state">加载中…</div>
<ul class="gb-items" id="gb-items" hidden></ul>
<noscript><p class="gb-state">留言板需要浏览器执行脚本才能加载与提交。</p></noscript>
</section>
<aside class="gb-side">
<section class="gb-form">
<h2>写留言</h2>
<form id="gb-form" novalidate>
  <div class="gb-field"><input class="gb-input" type="text" name="name" maxlength="30" placeholder="昵称（选填，默认「匿名访客」）"></div>
  <div class="gb-field"><input class="gb-input" type="text" name="contact" maxlength="100" placeholder="联系方式（选填，仅站长可见，不会公开展示）"></div>
  <input class="gb-hp" type="text" name="hp" tabindex="-1" autocomplete="off" aria-hidden="true" placeholder="请勿填写">
  <div class="gb-field">
    <textarea class="gb-textarea" name="content" rows="4" maxlength="500" placeholder="写下你的问题或补充（最多 500 字）"></textarea>
    <div class="gb-count">0/500</div>
  </div>
  <p class="gb-form-error" hidden></p>
  <div class="gb-actions"><button class="gb-submit" type="submit" disabled>发表留言</button></div>
</form>
<p class="gb-hint">提交后即可见，无需注册。</p>
</section>
</aside>
</div>`,
    active: 'guestbook',
    islands: true,
    mainClass: 'island',
    scripts: ['/islands/core.js', '/islands/guestbook.js'],
  }))
  fileCount++
  sitemapEntries.push({ loc: '/guestbook/', lastmod: siteLastmod })

  // —— 支持我们（/donate/）——
  const donateMeta = donateSeo()
  writePage('donate', pageShell({
    ...donateMeta,
    canonical: canonicalFor('/donate/'),
    robots: robotsOf(donateMeta),
    jsonLd: [
      breadcrumbJsonLd([{ name: '首页', url: '/' }, { name: '支持我们' }]),
      articleJsonLd({ title: '支持我们', canonical: canonicalFor('/donate/'), section: '支持我们', dateModified: siteLastmod }),
    ],
    bodyHtml: `<h1 class="page">支持我们</h1>
<p class="page-sub">站内 ${courses.length} 门课程、${allQuestions.length} 道面试题全部免费开放。如果觉得有帮助，欢迎请作者喝杯咖啡。</p>
<div class="donate-qrs">
  <figure class="qr-card"><img src="/qr-wechat.jpg" alt="微信收款码" loading="lazy"><figcaption><span class="qr-badge wechat">微信</span></figcaption></figure>
  <figure class="qr-card"><img src="/qr-alipay.jpg" alt="支付宝收款码" loading="lazy"><figcaption><span class="qr-badge alipay">支付宝</span></figcaption></figure>
</div>
<p class="donate-thanks">收到的支持会用在服务器开销和后续内容上。</p>`,
    active: 'donate',
  }))
  fileCount++
  sitemapEntries.push({ loc: '/donate/', lastmod: siteLastmod })

  // —— 首页（/）——
  const lessonTotal = courses.reduce((n, c) => n + (c.lessons || []).length, 0)
  const homeMeta = homeSeo()
  const homeBody = `<header class="hero">
<h1>打穿底层链路，通透技术面试</h1>
<p class="lead">一边是以真实工业场景为蓝本的系统级进阶课程，一边是附带深度解析与掌握度标记的高频真题库。告别碎片化八股，用纯原生可运行代码和底层系统原理，建立你不可替代的核心技术壁垒。</p>
<div class="hero-meta">
  <div><b>${courses.length}</b><span>门系统课程</span></div>
  <div><b>${lessonTotal}</b><span>节课</span></div>
  <div><b>${allQuestions.length}</b><span>道面试题</span></div>
</div>
</header>
<div class="sec-head"><h2>前端课程<span class="n">（${courses.length}）</span></h2></div>
<div class="card-grid">
${courses
    .map(
      (c) =>
        `<a href="${courseUrl(c.id)}"><h3>${esc(c.meta.title)}</h3><p>${esc(firstSentence(c.meta.subtitle))}</p><div class="f">${(c.meta.chapters || []).length} 章 · ${(c.lessons || []).length} 节课</div></a>`
    )
    .join('\n')}
</div>
<div class="sec-head"><h2>面试题库<span class="n">（${allQuestions.length}）</span></h2><a href="/interview/">进入题库 →</a></div>
<p class="page-sub">每题附完整答案与代码示例，可标记掌握度、按分类与难度筛选，也支持关键词搜索。</p>
<div class="chips">
${[...byCategory.keys()]
    .map((c) => {
      const meta = categories.find((x) => x.key === c)
      return `<a href="${categoryUrl(c)}">${esc(meta ? meta.name : c)}</a>`
    })
    .join('\n')}
</div>`

  writeFileSync(join(distDir, 'index.html'), pageShell({
    ...homeMeta,
    canonical: canonicalFor('/'),
    robots: robotsOf(homeMeta),
    jsonLd: [webSiteJsonLd({ description: homeMeta.description })],
    bodyHtml: homeBody,
    active: 'home',
    ogType: 'website',
    headExtra: BAIDU_ANALYTICS,
  }), 'utf-8')
  fileCount++
  sitemapEntries.push({ loc: '/', lastmod: siteLastmod })

  // —— 友情链接（/links/）——
  // 2026-10-31 之前本站没有独立友链页，友链只在页脚渲染，交换申请没有可提交的落点页。
  // 本页与页脚读同一份 src/data/friend-links.js，未确认的交换目标不写进来（见 docs/links-outreach.md）。
  const linksMeta = linksSeo()
  writePage('links', pageShell({
    ...linksMeta,
    canonical: canonicalFor('/links/'),
    robots: robotsOf(linksMeta),
    jsonLd: [
      breadcrumbJsonLd([{ name: '首页', url: '/' }, { name: '友情链接' }]),
      articleJsonLd({ title: '友情链接', canonical: canonicalFor('/links/'), section: '友情链接', dateModified: siteLastmod }),
    ],
    bodyHtml: `<h1 class="page">友情链接</h1>
<p class="page-sub">这里只收录已确认互换链接的前端与开发者生态站点。申请友链前请先在贵站添加本站链接（前端学习网，https://study.791860.xyz/），然后通过留言板附上站点名称、地址与简介，站长会人工审核，审核通过后才会出现在这里。</p>
<div class="card-grid">
${friendLinks
    .map(
      (fl) =>
        `<a href="${fl.url}" target="_blank" rel="noopener"><h3>${esc(fl.name)}</h3><p>${esc(fl.title || fl.name)}</p></a>`
    )
    .join('\n')}
</div>
<p class="cta-line"><a href="/guestbook/?ref=friendlink">申请友链 →</a></p>`,
    active: 'links',
  }))
  fileCount++
  sitemapEntries.push({ loc: '/links/', lastmod: siteLastmod })

  // —— 404.html ——
  const nfMeta = notFoundSeo()
  writeFileSync(
    join(distDir, '404.html'),
    pageShell({
      ...nfMeta,
      canonical: '',
      robots: robotsOf(nfMeta),
      jsonLd: [],
      bodyHtml: `<h1 class="page">没有这个页面</h1>
<p class="page-sub">链接可能已失效或输入有误。可返回首页，或前往面试题库。</p>
<p class="cta-line"><a href="/">回到首页 →</a></p>`,
      active: '',
    }),
    'utf-8'
  )
  fileCount++

  // —— 题库搜索索引（search-index.json）——
  const index = {}
  for (const q of allQuestions) index[q.id] = mdToText(q.answer).slice(0, 600)
  writeFileSync(join(distDir, 'search-index.json'), JSON.stringify(index), 'utf-8')

  return { fileCount, sitemapEntries }
}
