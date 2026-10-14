/* =============================================================================
   导航全局搜索（方案A 的搜索胶囊，2026-10-07 补上）
   -----------------------------------------------------------------------------
   · Enter：跳 /interview/?q=<关键词>，题库页的小岛会自动填入并过滤
   · Cmd/Ctrl + K：聚焦搜索框
   全站每页都加载（pageShell 固定引入），体积不到 1KB，无任何依赖。
   ========================================================================== */
(function () {
  'use strict'

  var input = document.getElementById('nav-search')
  if (!input) return

  input.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return
    var q = (input.value || '').trim()
    location.href = q ? '/interview/?q=' + encodeURIComponent(q) : '/interview/'
  })

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      // 输入框自己获焦时再按 Cmd+K 应全选，方便整体替换关键词
      e.preventDefault()
      input.focus()
      input.select()
    }
  })
})()
