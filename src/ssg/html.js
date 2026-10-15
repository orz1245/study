// HTML 转义、Markdown 纯文本提取与课程正文后处理工具

export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function mdToText(md = '') {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// 卡片副标题只取第一句（到第一个句末标点为止）
export function firstSentence(s = '') {
  const t = String(s || '').trim()
  const m = t.match(/^.*?[。！？]/)
  return m ? m[0] : t.slice(0, 80)
}

// 内联 CSS 安全断言：防止注释或内容中出现 </style> 提前闭合标签
export function assertInlineSafe(name, css) {
  const bad = /<\s*\/?\s*(style|script)\b|<!--|-->/i.exec(css)
  if (bad) {
    throw new Error(
      `[ssg] ${name} 不能内联：发现 ${JSON.stringify(bad[0])}（位置 ${bad.index}）。\n` +
      `      style 是原始文本元素，标签字面量会提前把它收尾，导致整站样式失效。`
    )
  }
}

const LESSON_GAP = '<div class="sec-gap" aria-hidden="true">· · ·</div>'

export function lessonGap(html) {
  return html.replace(/<h([23])>课后练习<\/h\1>/g, LESSON_GAP + '<h$1>课后练习</h$1>')
}

export function styleExercise(html) {
  return html.replace(
    /(<h([23])>课后练习<\/h\2>)([\s\S]*?)(?=<h[23]|\s*$)/,
    (m, head, lv, seg) => head + seg
      .replace(/<p><strong>(练习( \d+)?)<\/strong>：/g, '<p class="ex-q"><strong>$1</strong>：')
      .replace(/<p>(?:<strong>)?答案(?:<\/strong>)?：/g, '<p class="ex-a"><strong>答案</strong>：')
      .replace(/<li>(?:<strong>)?答案(?:<\/strong>)?：/g, '<li class="ex-a"><strong>答案</strong>：')
      .replace(/<blockquote>\n<p class="ex-a">/g, '<blockquote class="ex-a">\n<p>')
      .replace(/<ol>\n<li>/g, '<ol class="ex-ol">\n<li>')
  )
}
