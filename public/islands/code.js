/* =============================================================================
   代码块复制按钮小岛（课时页 / 题目详情页）
   -----------------------------------------------------------------------------
   按钮由构建期的 src/utils/markdown.js 直出成 HTML，但点击行为必须由浏览器
   端脚本承担（构建期无法访问 navigator.clipboard）。此前这段逻辑挂在旧 Vue
   应用上，拆框架后就断了——表现是「按钮在，点了没反应」，所以这里补回来。

   体积很小且与题库/仪表盘无关，故意不依赖 core.js：课时页只需这一个脚本。
   用事件委托绑在 document 上，一页里有几十个代码块也只有一个监听器。
   ========================================================================== */
(function () {
  'use strict'

  var IDLE = '复制'
  var OK = '已复制'
  var FAIL = '复制失败'

  // http: 或旧浏览器里 navigator.clipboard 不可用，退回隐藏 textarea + execCommand
  function legacyCopy(text) {
    var ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    var ok = false
    try {
      ok = document.execCommand('copy')
    } catch (e) {
      ok = false
    }
    document.body.removeChild(ta)
    return ok
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true },
        function () { return legacyCopy(text) }
      )
    }
    return Promise.resolve(legacyCopy(text))
  }

  function closestEl(node, sel) {
    if (!node) return null
    if (typeof node.closest === 'function') return node.closest(sel)
    return null
  }

  document.addEventListener('click', function (e) {
    var btn = closestEl(e.target, '.code-copy')
    if (!btn) return
    e.preventDefault()

    var block = closestEl(btn, '.code-block')
    var code = block ? block.querySelector('code') : null
    if (!code) return

    var text = code.textContent || ''

    copy(text).then(function (ok) {
      // 按钮内容是两个 SVG 图标（默认 copy / 成功后 check），只切类不碰内容
      if (ok) btn.classList.add('copied')
      else btn.classList.remove('copied')
      // 连点同一个按钮时只保留最后一个计时器，否则状态会提前跳回
      if (btn._copyTimer) clearTimeout(btn._copyTimer)
      btn._copyTimer = setTimeout(function () {
        btn.classList.remove('copied')
      }, 1500)
    })
  })
})()
