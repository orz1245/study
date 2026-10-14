// 面试题库页面生成：题库总览页（/interview/）、分类聚合页（/interview/<cat>/）与题目详情页（/interview/<cat>/<q-slug>/）
import { allQuestions, categories } from '../../data/index.js'
import { renderMarkdown } from '../../utils/markdown.js'
import { categoryUrl, questionUrl } from '../../utils/urls.js'
import {
  SITE_ORIGIN as SITE,
  interviewSeo,
  categorySeo,
  categorySeoName,
  questionSeo,
  robotsOf,
  canonicalFor,
} from '../../utils/seo.js'
import { esc, mdToText } from '../html.js'
import { breadcrumbJsonLd, articleJsonLd, qaJsonLd } from '../jsonld.js'
import {
  crumbHtml,
  footNavHtml,
  pageHeadHtml,
  playgroundHtml,
  PROGRESS_BAR,
  INTERVIEW_SCRIPTS,
  PAGE_SCRIPTS,
} from '../layout.js'

export const DIFF_LABEL = { easy: '入门', medium: '中等', hard: '进阶' }
const DIFF_STAR = { easy: '★☆☆', medium: '★★☆', hard: '★★★' }
const DIFF_CLS = { easy: 'd1', medium: 'd2', hard: 'd3' }

function questionRowHtml(q, no) {
  const text = mdToText(q.answer)
  const excerpt = text.length > 100 ? text.slice(0, 100) + '…' : text
  const dcls = DIFF_CLS[q.difficulty] || ''
  return `<div class="row" data-qid="${esc(q.id)}" data-diff="${esc(q.difficulty)}" data-title="${esc(q.question)}" data-tags="${esc((q.tags || []).join(' '))}">
<span class="no">${String(no).padStart(2, '0')}</span>
<a class="body" href="${questionUrl(q)}">
<h3>${esc(q.question)}</h3>
<p class="ex">${esc(excerpt)}</p>
<div class="tags"><span class="tag-d ${dcls}">${DIFF_STAR[q.difficulty] || ''}</span></div>
</a>
<span class="mastery"><button class="m-dot m-none" type="button" data-mastery="${esc(q.id)}" title="点击切换掌握状态">○ 未做</button></span>
</div>`
}

function questionListHtml(qs, offset = 0) {
  return `<div class="list" id="q-list">
${qs.map((q, i) => questionRowHtml(q, i + 1 + offset)).join('\n')}
</div>
<div class="empty" id="q-empty" hidden>没有匹配的题目。请更换关键词，或清除筛选条件。</div>`
}

function categoryChipLinksHtml(activeKey = '') {
  return categories
    .map((c) => `<a class="chip${c.key === activeKey ? ' on' : ''}" href="${categoryUrl(c.key)}">${esc(c.name)}</a>`)
    .join('')
}

function filterBarHtml(activeCat = '') {
  const chip = (kind, value, label) =>
    `<button class="chip${value === 'all' ? ' on' : ''}" type="button" data-filter="${kind}" data-value="${value}">${label}</button>`
  return `<div class="filters">
${categoryChipLinksHtml(activeCat)}
</div>
<div class="filters">
${chip('diff', 'all', '全部难度')}${chip('diff', 'easy', '入门')}${chip('diff', 'medium', '中等')}${chip('diff', 'hard', '进阶')}
<div class="divider"></div>
<div class="mfilter">掌握度：${chip('mastery', 'all', '全部')}${chip('mastery', 'unseen', '未做')}${chip('mastery', 'learning', '模糊')}${chip('mastery', 'mastered', '已掌握')}</div>
</div>`
}

function searchBarHtml() {
  return `<div class="search-wrap">
<input id="q-search" class="search-input" type="search" placeholder="搜索题目、标签或答案…" autocomplete="off" aria-label="搜索题目">
<span class="search-count" id="q-count"></span>
<button class="btn-line" id="q-reset" type="button">清除筛选</button>
</div>`
}

// 环形轮转 + 标签重合度选取「同分类其他题目」：
// 旧逻辑用 qs.filter(x => x.id !== q.id).slice(0, 4)，导致每个分类下所有题目只链接前 4 题，
// 第 5 题之后的深层页面缺乏内链权重传递。改为从当前题向后环形轮转并优先匹配共享标签，
// 确保分类内每一道题都能均匀获得内链入口，显著改善爬虫抓取深度与内链权重分布。
export function pickRelatedQuestions(qs, currentIdx, count = 4) {
  const n = qs.length
  if (n <= 1) return []
  const current = qs[currentIdx]
  const currentTags = new Set(current.tags || [])
  const candidates = []
  for (let offset = 1; offset < n; offset++) {
    const candidate = qs[(currentIdx + offset) % n]
    let sharedTags = 0
    for (const t of candidate.tags || []) {
      if (currentTags.has(t)) sharedTags++
    }
    candidates.push({ question: candidate, sharedTags, offset })
  }
  candidates.sort((a, b) => b.sharedTags - a.sharedTags || a.offset - b.offset)
  return candidates.slice(0, count).map((c) => c.question)
}

export function buildInterviewPages({ writePage, pageShell, getCategoryLastmod, latestQuestionLastmod }) {
  const sitemapEntries = []
  const redirectLines = []
  let fileCount = 0

  const byCategory = new Map()
  for (const q of allQuestions) {
    if (!byCategory.has(q.category)) byCategory.set(q.category, [])
    byCategory.get(q.category).push(q)
  }

  for (const [category, qs] of byCategory) {
    const catHref = categoryUrl(category)
    const catUrl = SITE + catHref
    const lastmod = getCategoryLastmod(category)
    sitemapEntries.push({ loc: catHref, lastmod })

    const catName = categorySeoName(category)
    const catSeo = categorySeo(category)
    const catBody = `${pageHeadHtml({
      title: `${catName} 面试题`,
      desc: `共 ${qs.length} 道 ${catName} 方向的面试题，每题附完整答案与代码示例。点击右侧方框可标记掌握度。`,
      bar: PROGRESS_BAR,
    })}
${searchBarHtml()}
${filterBarHtml(category)}
${questionListHtml(qs)}`

    writePage(catHref.replace(/^\//, ''), pageShell({
      ...catSeo,
      canonical: catUrl,
      robots: robotsOf(catSeo),
      jsonLd: [
        breadcrumbJsonLd([{ name: '首页', url: '/' }, { name: '面试题库', url: '/interview/' }, { name: catName }]),
        articleJsonLd({ title: `${catName} 面试题`, canonical: catUrl, section: '面试题库', dateModified: lastmod }),
      ],
      breadcrumbHtml: crumbHtml([{ name: '首页', url: '/' }, { name: '面试题库', url: '/interview/' }, { name: catName }]),
      bodyHtml: catBody,
      active: 'interview',
      islands: true,
      mainClass: 'island',
      scripts: INTERVIEW_SCRIPTS,
    }))
    fileCount++

    // —— 题目详情页 ——
    qs.forEach((q, idx) => {
      const qHref = questionUrl(q)
      const qUrl = SITE + qHref
      redirectLines.push(`/interview/question/${q.id} ${qHref} 301`)
      redirectLines.push(`/interview/question/${q.id}/ ${qHref} 301`)
      const prev = idx > 0 ? { href: questionUrl(qs[idx - 1]), title: qs[idx - 1].question } : null
      const next = idx < qs.length - 1 ? { href: questionUrl(qs[idx + 1]), title: qs[idx + 1].question } : null
      const qSeo = questionSeo(q)
      const related = pickRelatedQuestions(qs, idx, 4)
      const body = `<h1 class="page">${esc(q.question)}</h1>
${renderMarkdown(q.answer)}
${related.length ? `<h2>同分类其他题目</h2><div class="lesson-list">${related
      .map((r) => `<a href="${questionUrl(r)}"><span class="lid">›</span><span class="t">${esc(r.question)}</span></a>`)
      .join('')}</div>` : ''}
${footNavHtml({ prev, next, up: '上一题', down: '下一题' })}
${playgroundHtml({ refLabel: '当前题目', refText: q.question })}`

      writePage(qHref.replace(/^\//, ''), pageShell({
        ...qSeo,
        canonical: qUrl,
        robots: robotsOf(qSeo),
        jsonLd: [
          qaJsonLd({
            question: q.question,
            answerText: mdToText(q.answer).slice(0, 8000),
            canonical: qUrl,
            category: catName,
            dateModified: lastmod,
          }),
          breadcrumbJsonLd([
            { name: '首页', url: '/' },
            { name: '面试题库', url: '/interview/' },
            { name: catName, url: catHref },
            { name: q.question },
          ]),
        ],
        breadcrumbHtml: crumbHtml([
          { name: '首页', url: '/' },
          { name: '面试题库', url: '/interview/' },
          { name: catName, url: catHref },
        ]),
        bodyHtml: body,
        active: 'interview',
        playground: true,
        scripts: PAGE_SCRIPTS,
      }))
      fileCount++
      sitemapEntries.push({ loc: qHref, lastmod })
    })
  }

  // —— 题库总览页 /interview/ ——
  const interviewMeta = interviewSeo()
  const firstCat = categories[0].key
  const firstQs = byCategory.get(firstCat) || []
  writePage('interview', pageShell({
    ...interviewMeta,
    canonical: canonicalFor('/interview/'),
    robots: robotsOf(interviewMeta),
    jsonLd: [
      breadcrumbJsonLd([{ name: '首页', url: '/' }, { name: '面试题库' }]),
      articleJsonLd({ title: '前端面试题库', canonical: canonicalFor('/interview/'), section: '面试题库', dateModified: latestQuestionLastmod }),
    ],
    bodyHtml: `${pageHeadHtml({
      title: '前端面试题库',
      desc: `按 ${byCategory.size} 个方向整理，每题附完整答案与代码示例。点击右侧方框可标记掌握度（仅保存在你自己的浏览器中）。`,
      bar: PROGRESS_BAR,
    })}
${searchBarHtml()}
${filterBarHtml(firstCat)}
${questionListHtml(firstQs)}`,
    active: 'interview',
    islands: true,
    mainClass: 'island',
    scripts: INTERVIEW_SCRIPTS,
  }))
  fileCount++
  sitemapEntries.push({ loc: '/interview/', lastmod: latestQuestionLastmod })

  return { fileCount, sitemapEntries, redirectLines, byCategory }
}
