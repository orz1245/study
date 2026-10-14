import { marked } from 'marked'
import hljs from 'highlight.js/lib/common'

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 自定义 renderer：为代码块添加 hljs 高亮
const renderer = new marked.Renderer()

// 复制按钮用 SVG 图标（用户 2026-10-07 要求：不要文字）。两个图标都内联在按钮里，
// 默认显示 copy、复制成功后由 .copied 类切到 check——脚本只切类，不碰按钮内容。
const ICON_COPY =
  '<svg class="i-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const ICON_CHECK =
  '<svg class="i-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'

renderer.code = function ({ text, lang }) {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  let highlighted
  try {
    highlighted = hljs.highlight(text, { language }).value
  } catch {
    highlighted = text
  }
  // 代码块：外包一层 .code-block，右上角悬浮 SVG 复制按钮（不给 pre 预留空行）
  // 复制行为在 public/islands/code.js（这里是构建期模块，拿不到 navigator）
  return `<div class="code-block"><button class="code-copy" type="button" data-lang="${language}" aria-label="复制代码" title="复制代码">${ICON_COPY}${ICON_CHECK}</button><pre><code class="hljs language-${language}">${highlighted}</code></pre></div>`
}

marked.use({ renderer })

// 裸 URL 自动转链接的防吞噬处理（2026-10-07）：
// marked 的 GFM linkify 只按 ASCII 边界截断 URL，中文正文里的
// 「https://example.com），运行后观察…」会把从 ） 起的整行文字全部卷进链接。
// 处理：把裸 URL（仅 ASCII 合法字符）预先包成 <url> 角括号自动链接，
// 后面的全角字符自然留在正文。跳过代码块/行内代码，避免改动代码内容。
const BARE_URL = /(^|[\s（「『【])(https?:\/\/[A-Za-z0-9._~:/?#\[\]@!$&'*+,;=%-]+)/gm

function guardBareUrls(text) {
  return text.split(/(```[\s\S]*?(?:```|$)|`[^`\n]*`)/g).map((seg, i) => {
    if (i % 2 === 1) return seg // 代码段原样保留
    return seg.replace(BARE_URL, (m, lead, url) => `${lead}<${url}>`)
  }).join('')
}

export function renderMarkdown(text) {
  if (!text) return ''
  return marked.parse(guardBareUrls(text))
}
