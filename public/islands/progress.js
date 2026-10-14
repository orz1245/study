/* =============================================================================
   学习仪表盘小岛（/progress/）
   -----------------------------------------------------------------------------
   页面本身是静态壳，真正的数字全部来自浏览器 localStorage 里的掌握度标记，
   所以只能由这段脚本算出来。题目元数据（分类 / 难度 / 每题 id）由构建期
   内联在页面的 #dash-data 里，不额外发请求。
   ========================================================================== */
(function () {
  'use strict'

  var S = window.STUDY
  var root = document.getElementById('dash')
  var dataEl = document.getElementById('dash-data')
  if (!S || !root || !dataEl) return

  var data
  try {
    data = JSON.parse(dataEl.textContent)
  } catch (e) {
    return
  }

  var catOf = {}
  var allIds = []
  data.cats.forEach(function (c) {
    c.ids.forEach(function (id) { catOf[id] = c.k })
    allIds = allIds.concat(c.ids)
  })

  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0 }

  function bar(w, color) {
    return '<div class="bar"><i style="width:' + w + '%;' + (color ? 'background:' + color : '') + '"></i></div>'
  }

  function render() {
    var all = S.mastery.counts(allIds)
    var total = allIds.length
    var overall = pct(all.mastered, total)

    var html = ''

    // —— 总览 ——
    html += '<section class="panel">'
    html += '<div class="dash-top">'
    html += '<div class="dash-num"><b>' + overall + '%</b><span>总体掌握度</span></div>'
    html += bar(overall)
    // 「清空掌握度」按钮的落位：静态壳里它在 #dash 前面且 hidden，
    // 这里挖一个槽位，渲染后把真实按钮节点搬进来（节点搬移不丢事件绑定）
    html += '<span id="dash-slot"></span>'
    html += '</div>'
    html += '<div class="dash-stats">'
    html += '<div class="stat"><b>' + total + '</b><span>总题数</span></div>'
    html += '<div class="stat s-done"><b>' + all.mastered + '</b><span>已掌握</span></div>'
    html += '<div class="stat s-mid"><b>' + all.learning + '</b><span>模糊</span></div>'
    html += '<div class="stat"><b>' + all.unseen + '</b><span>未做</span></div>'
    html += '</div>'
    html += '</section>'

    // —— 分类掌握进度（按模块分组）——
    html += '<section class="panel"><h2 class="panel-title">分类掌握进度</h2>'
    data.mods.forEach(function (m) {
      var cats = data.cats.filter(function (c) { return m.cats.indexOf(c.k) >= 0 })
      if (!cats.length) return
      html += '<div class="mod-group"><div class="mod-title">' + S.esc(m.n) + '</div>'
      cats.forEach(function (c) {
        var s = S.mastery.counts(c.ids)
        var p = pct(s.mastered, c.ids.length)
        html += '<div class="cat-block">'
        html += '<div class="cb-head"><h3>' + S.esc(c.n) + '</h3>'
        html += '<span class="cb-num">' + s.mastered + ' / ' + c.ids.length + ' · ' + p + '%</span></div>'
        html += bar(p)
        html += '<div class="links">已掌握 ' + s.mastered + ' · 模糊 ' + s.learning + ' · 未做 ' + s.unseen +
          '　<a href="/interview/' + c.k + '/">进入分类 →</a></div>'
        html += '</div>'
      })
      html += '</div>'
    })
    html += '</section>'

    // —— 难度分布 ——
    html += '<section class="panel"><h2 class="panel-title">难度分布</h2>'
    data.diffs.forEach(function (d) {
      var s = S.mastery.counts(d.ids)
      var p = pct(s.mastered, d.ids.length)
      html += '<div class="cat-block">'
      html += '<div class="cb-head"><h3>' + S.esc(d.n) + '</h3>'
      html += '<span class="cb-num">' + s.mastered + ' / ' + d.ids.length + ' 已掌握 · ' + p + '%</span></div>'
      html += bar(p)
      html += '</div>'
    })
    html += '</section>'

    root.innerHTML = html

    // 把静态壳里的按钮搬进总览行（进度条之后），并解除 hidden
    if (resetBtn) {
      var slot = document.getElementById('dash-slot')
      if (slot && slot.parentNode) slot.parentNode.replaceChild(resetBtn, slot)
      resetBtn.hidden = false
    }
  }

  var resetBtn = document.getElementById('dash-reset')
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (window.confirm('确定要清空所有掌握度标记吗？此操作不可撤销。')) {
        S.mastery.reset()
        render()
      }
    })
  }

  render()
})()
