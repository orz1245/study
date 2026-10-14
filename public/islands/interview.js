/* =============================================================================
   题库小岛（/interview/ 与 /interview/<分类>/ 共用）
   -----------------------------------------------------------------------------
   页面上 289 行题目全部由构建期直出为静态 HTML（爬虫能完整读到），
   这段脚本只做三件静态 HTML 做不到的事：
     1. 按难度 / 掌握度 + 关键词过滤（标题、标签直接读 DOM；
        答案正文需要时再按需拉 /search-index.json —— 不输入关键词就不下载）
     2. 点击掌握度标记（存 localStorage，键名沿用旧版）
     3. ?id=<题目id> 深链定位
   ========================================================================== */
(function () {
  'use strict'

  var S = window.STUDY
  var list = document.getElementById('q-list')
  if (!S || !list) return

  var rows = Array.prototype.slice.call(list.querySelectorAll('.row'))
  if (!rows.length) return

  var allIds = rows.map(function (r) { return r.getAttribute('data-qid') })

  var state = { diff: 'all', mastery: 'all', kw: '' }
  var index = null // { 题目id: 答案纯文本 }，首次输入关键词时才请求
  var indexPromise = null

  var input = document.getElementById('q-search')
  var countEl = document.getElementById('q-count')
  var barEl = document.getElementById('pb')
  var statEl = document.getElementById('pstat')
  var emptyEl = document.getElementById('q-empty')
  var resetBtn = document.getElementById('q-reset')

  // ---------- 掌握度标记的绘制与统计 ----------
  function paint(btn, status) {
    btn.className = 'm-dot ' + S.CLS[status]
    btn.textContent = S.MARK[status] + ' ' + S.LABEL[status]
    btn.title = '点击切换掌握状态（当前：' + S.LABEL[status] + '）'
  }

  function initMastery() {
    var btns = list.querySelectorAll('.m-dot')
    for (var i = 0; i < btns.length; i++) {
      paint(btns[i], S.mastery.get(btns[i].getAttribute('data-mastery')))
    }
    updateStats()
  }

  function updateStats() {
    var c = S.mastery.counts(allIds)
    var pct = allIds.length ? Math.round((c.mastered / allIds.length) * 100) : 0
    if (barEl) barEl.style.width = pct + '%'
    if (statEl) {
      // 2026-10-07 用户要求：进度条统计上色（已掌握绿、模糊琥珀、未做灰）
      statEl.innerHTML = '<b class="ps-done">已掌握 ' + c.mastered + '</b> · <b class="ps-mid">模糊 ' + c.learning + '</b> · 未做 ' + c.unseen
    }
  }

  // ---------- 过滤 ----------
  // 答案正文的索引体积不小，只有用户真的开始搜索才下载（首屏零额外请求）
  function ensureIndex() {
    if (index || indexPromise) return indexPromise
    indexPromise = fetch('/search-index.json', { cache: 'force-cache' })
      .then(function (r) { return r.ok ? r.json() : {} })
      .then(function (data) { index = data || {}; return index })
      .catch(function () { index = {}; return index })
    return indexPromise
  }

  function hit(row) {
    if (state.diff !== 'all' && row.getAttribute('data-diff') !== state.diff) return false
    if (state.mastery !== 'all' && S.mastery.get(row.getAttribute('data-qid')) !== state.mastery) return false
    if (!state.kw) return true
    var qid = row.getAttribute('data-qid')
    var head = (row.getAttribute('data-title') || '') + ' ' + (row.getAttribute('data-tags') || '')
    if (head.toLowerCase().indexOf(state.kw) >= 0) return true
    return !!(index && index[qid] && index[qid].toLowerCase().indexOf(state.kw) >= 0)
  }

  function apply() {
    var shown = 0
    for (var i = 0; i < rows.length; i++) {
      var ok = hit(rows[i])
      rows[i].hidden = !ok
      if (ok) shown++
    }
    paintTitles()
    if (countEl) {
      countEl.textContent = state.kw || state.diff !== 'all' || state.mastery !== 'all'
        ? shown + ' / ' + rows.length + ' 题'
        : rows.length + ' 题'
      countEl.classList.toggle('on', !!state.kw || state.diff !== 'all' || state.mastery !== 'all')
    }
    if (emptyEl) emptyEl.hidden = shown !== 0
  }

  // ---------- 关键词高亮 ----------
  // 命中的关键词在标题里标成强调色（<mark>，样式在 islands.css）。
  // 原始标题存 data-raw；用 data-hl 记「正在高亮」——不能用 textContent 判断，
  // 真实 DOM 里 textContent 会剥掉 mark 标签，导致清空关键词后高亮永远洗不掉。
  function paintTitles() {
    var re = state.kw ? new RegExp(state.kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi') : null
    for (var i = 0; i < rows.length; i++) {
      var h3 = rows[i].querySelector ? rows[i].querySelector('h3') : null
      if (!h3) continue
      var raw = h3.getAttribute('data-raw')
      if (raw === null) {
        raw = h3.textContent
        h3.setAttribute('data-raw', raw)
      }
      if (re) {
        h3.innerHTML = escHtml(raw).replace(re, function (m) { return '<mark>' + m + '</mark>' })
        h3.setAttribute('data-hl', '1')
      } else if (h3.getAttribute('data-hl')) {
        h3.textContent = raw
        h3.removeAttribute('data-hl')
      }
    }
  }

  function escHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
    })
  }

  function rerun() {
    if (state.kw) {
      ensureIndex().then(apply)
    }
    apply()
  }

  // ---------- 控件绑定 ----------
  var chips = document.querySelectorAll('[data-filter]')
  for (var i = 0; i < chips.length; i++) {
    chips[i].addEventListener('click', function () {
      var kind = this.getAttribute('data-filter')
      state[kind] = this.getAttribute('data-value')
      for (var j = 0; j < chips.length; j++) {
        if (chips[j].getAttribute('data-filter') === kind) {
          chips[j].classList.toggle('on', chips[j] === this)
        }
      }
      rerun()
    })
  }

  var timer = 0
  if (input) {
    input.addEventListener('input', function () {
      var v = this.value.trim().toLowerCase()
      clearTimeout(timer)
      timer = setTimeout(function () {
        state.kw = v
        rerun()
      }, 220)
    })
    // Esc：一键清空搜索并复位列表（输入框留在原地，方便立刻输入新词）
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && input.value) {
        input.value = ''
        state.kw = ''
        apply()
      }
    })
    // / ：题库页内快捷键，随时把焦点交给搜索框（导航的 Cmd/Ctrl+K 仍指向全局搜索）
    document.addEventListener('keydown', function (e) {
      var tag = e.target && e.target.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        input.focus()
      }
    })
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      state.diff = 'all'
      state.mastery = 'all'
      state.kw = ''
      if (input) input.value = ''
      for (var j = 0; j < chips.length; j++) {
        chips[j].classList.toggle('on', chips[j].getAttribute('data-value') === 'all')
      }
      apply()
    })
  }

  // 掌握度按钮是 <a class="row"> 的兄弟节点，不是它的子节点，
  // 所以点按钮不会触发跳转，不需要额外的 preventDefault 兜底。
  list.addEventListener('click', function (e) {
    var t = e.target
    var btn = t && t.closest ? t.closest('.m-dot') : null
    if (!btn) return
    e.preventDefault()
    var qid = btn.getAttribute('data-mastery')
    paint(btn, S.mastery.cycle(qid))
    updateStats()
    if (state.mastery !== 'all') apply()
  })

  initMastery()

  // ---------- 导航搜索深链：/interview/?q=<关键词>（nav-search.js 跳转过来） ----------
  // 直接写 state.kw + input.value 并立即过滤，绕过 220ms 输入防抖；
  // ensureIndex 异步下载完答案索引后 apply 会再跑一次，无需在这里等它。
  try {
    var deepQ = (new URLSearchParams(location.search).get('q') || '').trim().toLowerCase()
    if (deepQ && input) {
      input.value = deepQ
      state.kw = deepQ
      rerun()
    }
  } catch (e) { /* 极老的浏览器没有 URLSearchParams，忽略即可 */ }

  apply()

  // ---------- ?id=<题目id> 深链定位 ----------
  var targetId = ''
  try {
    targetId = new URLSearchParams(location.search).get('id') || ''
  } catch (e) { /* 极老的浏览器没有 URLSearchParams，忽略即可 */ }
  if (targetId) {
    var target = list.querySelector('.row[data-qid="' + targetId.replace(/"/g, '') + '"]')
    if (target) {
      target.hidden = false
      target.classList.add('is-target')
      if (target.scrollIntoView) target.scrollIntoView({ block: 'center' })
    }
  }
})()
