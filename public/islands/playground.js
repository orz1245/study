/* =============================================================================
   演练场小岛（题目详情页）
   -----------------------------------------------------------------------------
   按 REFACTOR-SEO-PLAN.md §3.2 定稿交互实现，原型 redesign/方案A-题目详情页.html：
     · 右下角常驻的「打开演练场」悬浮按钮调起右下角悬浮窗（无遮罩，不挡正文）
     · 折叠 / 关闭 / Esc 关闭；原生 resize 缩放（尺寸交给 CSS，脚本不管）
     · 编辑器空启动、无预置示例 —— 让用户边看题边验证思路
     · 「运行」用 (0, eval) 在页面上下文里执行，临时接管 console.log 收集输出
   窗口骨架（含“当前题目”）由构建期直出，这里只补行为与内容替换，所以
   脚本被禁时页面上不会出现一个空壳浮层（.pg 默认 display:none）。
   ========================================================================== */
(function () {
  'use strict'

  var pg = document.getElementById('pg')
  var openBtn = document.getElementById('pg-open')
  if (!pg || !openBtn) return

  var editor = pg.querySelector('.pg-editor')
  var out = pg.querySelector('.pg-out-body')
  var PLACEHOLDER = out ? out.textContent : ''

  function show() {
    pg.classList.add('on')
    // 按钮和浮层抢同一个右下角，打开时把按钮收起来（关闭时再放回来）
    openBtn.hidden = true
    openBtn.setAttribute('aria-expanded', 'true')
    if (editor) editor.focus()
  }

  function hide() {
    pg.classList.remove('on')
    // 先放回按钮再 focus：隐藏元素拿不到焦点，顺序反了键盘用户会「掉焦点」
    openBtn.hidden = false
    openBtn.setAttribute('aria-expanded', 'false')
    openBtn.focus()
  }

  function setOut(text) {
    if (out) out.textContent = text
  }

  function describe(v) {
    if (typeof v === 'string') return v
    try {
      return JSON.stringify(v)
    } catch (e) {
      return String(v)
    }
  }

  function run() {
    if (!editor) return
    var code = editor.value
    if (!code.trim()) {
      setOut('（编辑器为空，请先输入代码）')
      return
    }
    var logs = []
    var nativeLog = console.log
    try {
      // 只接管同步执行期间的 log；用户代码里的异步回调不会进 logs，
      // 这是原型定稿时的取舍（避免长期改写全局 console）
      console.log = function () {
        var parts = []
        for (var i = 0; i < arguments.length; i++) parts.push(describe(arguments[i]))
        logs.push(parts.join(' '))
      }
      var result = (0, eval)(code)
      console.log = nativeLog

      var body = logs.length ? logs.join('\n') : ''
      // 有 log 且返回值是 undefined 时不再补一行「⇒ undefined」，否则噪音很大
      if (result !== undefined || !logs.length) {
        body += (body ? '\n' : '') + '⇒ ' + describe(result)
      }
      setOut(body || '（没有输出）')
    } catch (err) {
      console.log = nativeLog
      setOut('✗ ' + (err && err.message ? err.message : err))
    }
  }

  function clear() {
    if (editor) editor.value = ''
    setOut(PLACEHOLDER)
    if (editor) editor.focus()
  }

  openBtn.addEventListener('click', function () {
    if (pg.classList.contains('on')) hide()
    else show()
  })

  pg.addEventListener('click', function (e) {
    var t = e.target
    var act = t && t.getAttribute ? t.getAttribute('data-pg') : null
    if (act === 'close') hide()
    else if (act === 'run') run()
    else if (act === 'clear') clear()
  })

  // 收起只有两条路：Esc，或点到浮层外面（头部不再放 -/× 按钮，用户明确要求）。
  // 点浮层内部（编辑器、运行、清空）不能误关；悬浮按钮打开时已 hidden，无冲突。
  document.addEventListener('pointerdown', function (e) {
    if (!pg.classList.contains('on')) return
    var t = e.target
    if (pg.contains(t) || t === openBtn) return
    hide()
  })

  // 缩放：面板锚定右下角，手柄放在左上角 —— 向左上拖 = 变大，向右下拖 = 变小。
  // 拖拽监听挂 document（move/up），不依赖 setPointerCapture —— 后者在部分
  // 浏览器/触控组合下会静默失效，是之前「手柄拖不动」的根因。
  var grip = pg.querySelector('.pg-grip')
  if (grip) {
    grip.addEventListener('pointerdown', function (e) {
      e.preventDefault()
      var startX = e.clientX, startY = e.clientY
      var w = pg.offsetWidth, h = pg.offsetHeight
      var prevSelect = document.body.style.userSelect
      document.body.style.userSelect = 'none' // 拖拽期间锁住文本选择
      function onMove(ev) {
        var maxW = Math.floor(window.innerWidth * 0.94)
        var maxH = Math.floor(window.innerHeight * 0.86)
        var nw = Math.min(Math.max(w + (startX - ev.clientX), 320), maxW)
        var nh = Math.min(Math.max(h + (startY - ev.clientY), 200), maxH)
        pg.style.width = nw + 'px'
        pg.style.height = nh + 'px'
      }
      function onUp() {
        document.body.style.userSelect = prevSelect
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.removeEventListener('pointercancel', onUp)
      }
      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onUp)
      document.addEventListener('pointercancel', onUp)
    })
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pg.classList.contains('on')) hide()
  })

  // Ctrl/Cmd + Enter 直接运行，写代码时不用离开键盘
  if (editor) {
    editor.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        run()
      }
    })
  }
})()
