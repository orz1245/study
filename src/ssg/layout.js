// 页面全局外壳（Navigation / Breadcrumb / PageShell / Playground / Footer）
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { SITE_ORIGIN as SITE, SITE_NAME } from '../utils/seo.js'
import { esc, assertInlineSafe } from './html.js'

export const PROGRESS_BAR = '<div class="progress"><div class="bar"><i id="pb"></i></div><span id="pstat">掌握度统计加载中…</span></div>'
export const INTERVIEW_SCRIPTS = ['/islands/core.js', '/islands/interview.js']
export const PAGE_SCRIPTS = ['/islands/code.js', '/islands/playground.js']

export const BAIDU_ANALYTICS = `<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?ef54e175435f499aedc22058eacd95f2";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>`

export function loadStyles(cssDir) {
  const readCss = (f) => readFileSync(join(cssDir, f), 'utf-8').trim()
  const shellCss = [readCss('tokens.css'), readCss('shell.css'), readCss('pub.css')].join('\n')
  const islandCss = readCss('islands.css')
  const playgroundCss = readCss('playground.css')
  assertInlineSafe('tokens.css + shell.css + pub.css', shellCss)
  assertInlineSafe('islands.css', islandCss)
  assertInlineSafe('playground.css', playgroundCss)
  return { shellCss, islandCss, playgroundCss }
}

export function navHtml(active = '') {
  const navLink = (href, label, key) =>
    `<a class="nav-a${active === key ? ' on' : ''}" href="${href}">${label}</a>`
  return `<nav class="top"><div class="wrap nav-in">
  <a class="logo" href="/">前端<em>学习网</em></a>
  <div class="nav-links">${navLink('/course/', '课程', 'course')}${navLink('/interview/', '面试题库', 'interview')}${navLink('/progress/', '学习仪表盘', 'progress')}${navLink('/guestbook/', '留言板', 'guestbook')}${navLink('/donate/', '支持我们', 'donate')}</div>
  <div class="nav-right"><input id="nav-search" class="nav-search" type="search" placeholder="搜索课程与题目…" aria-label="搜索课程与题目" autocomplete="off"></div>
</div></nav>`
}

export function crumbHtml(items) {
  return items
    .map((it, i) =>
      it.url && i < items.length - 1
        ? `<a href="${it.url}">${esc(it.name)}</a><span class="sep">/</span>`
        : `<span>${esc(it.name)}</span>`
    )
    .join('')
}

export function pageHeadHtml({ title, desc, bar = '' }) {
  return `<header class="head">
<h1>${esc(title)}</h1>
<p class="desc">${esc(desc)}</p>
${bar}
</header>`
}

export function footNavHtml({ prev, next, up, down }) {
  const prevA = prev
    ? `<a href="${prev.href}"><div class="t">${esc(prev.title)}</div><span class="dir">← ${up}</span></a>`
    : `<a class="dis"><div class="t">已到开头</div><span class="dir">← ${up}</span></a>`
  const nextA = next
    ? `<a class="next" href="${next.href}"><div class="t">${esc(next.title)}</div><span class="dir">${down} →</span></a>`
    : `<a class="next dis"><div class="t">已到结尾</div><span class="dir">${down} →</span></a>`
  return `<nav class="footnav">${prevA}${nextA}</nav>`
}

export function playgroundHtml({ refLabel, refText }) {
  return `<button class="pg-open" id="pg-open" type="button" aria-expanded="false" aria-controls="pg">演练场</button>
<aside class="pg" id="pg" role="dialog" aria-label="代码演练场">
<div class="pg-grip" title="拖动调整大小"></div>
<div class="pg-head"><b>演练场</b><span class="pg-ref">${esc(refLabel)}：${esc(refText)}</span>
<button class="ctl" type="button" data-pg="close" aria-label="关闭演练场">×</button>
</div>
<textarea class="pg-editor" spellcheck="false" aria-label="代码编辑器" placeholder="// 在此写下你的思路，运行后即可验证"></textarea>
<div class="pg-out"><div class="lbl">CONSOLE</div><div class="pg-out-body">运行结果将显示在这里</div></div>
<div class="pg-foot"><button class="run" type="button" data-pg="run">运行 ▶</button><button class="clr" type="button" data-pg="clear">清空</button></div>
</aside>`
}

export function createPageShell({ shellCss, islandCss, playgroundCss }) {
  return function pageShell({
    title,
    description,
    keywords,
    canonical,
    jsonLd = [],
    breadcrumbHtml,
    bodyHtml,
    active = '',
    robots = 'index, follow',
    islands = false,
    playground = false,
    scripts = [],
    mainClass = 'article',
    headExtra = '',
    ogType = '',
  }) {
    const kw = (keywords || []).join(', ')
    const resolvedOgType = ogType || (active === 'home' ? 'website' : 'article')
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${kw ? `<meta name="keywords" content="${esc(kw)}">` : ''}
<meta name="robots" content="${robots}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<meta name="theme-color" content="#FAF9F6">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:image" content="${SITE}/og-image.png">
<meta name="twitter:image" content="${SITE}/og-image.png">
<meta property="og:type" content="${resolvedOgType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:locale" content="zh_CN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
${jsonLd.map((j) => `<script type="application/ld+json">${j}</script>`).join('\n')}
${headExtra}
<style>${shellCss}${islands ? '\n' + islandCss : ''}${playground ? '\n' + playgroundCss : ''}</style>
</head>
<body>
${navHtml(active)}
<div class="wrap">
${breadcrumbHtml ? `<nav class="crumb">${breadcrumbHtml}</nav>` : ''}
<main class="${mainClass}">${bodyHtml}</main>
</div>
<footer class="colophon">© 2026 前端学习网</footer>
${['/islands/nav-search.js'].concat(scripts).map((s) => `<script src="${s}" defer></script>`).join('\n')}
</body>
</html>`
  }
}
