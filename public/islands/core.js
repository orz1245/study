/* =============================================================================
   小岛共享核心（零依赖原生 JS）
   -----------------------------------------------------------------------------
   站点已经没有任何前端框架：「静态 HTML + 少量原生 JS」就是全部运行时。
   这里放三个小岛（题库 / 仪表盘 / 留言板）都要用到的东西：
     1. 掌握度的读写（localStorage，键名沿用旧版的 interview-mastery，
        老用户已有的标记不会丢；数据只存在本机，不上传）
     2. 转义与时间格式化的公共实现
   ========================================================================== */
(function () {
  'use strict'

  var KEY = 'interview-mastery'
  // 三档状态。键名与旧版一致（unseen / learning / mastered），只改了显示文案。
  var ORDER = ['unseen', 'learning', 'mastered']
  var LABEL = { unseen: '未做', learning: '模糊', mastered: '已掌握' }
  var MARK = { unseen: '○', learning: '◐', mastered: '✓' }
  var CLS = { unseen: 'm-none', learning: 'm-mid', mastered: 'm-done' }

  var cache = null

  function all() {
    if (cache) return cache
    try {
      var raw = window.localStorage.getItem(KEY)
      cache = raw ? JSON.parse(raw) : {}
      if (!cache || typeof cache !== 'object') cache = {}
    } catch (e) {
      cache = {}
    }
    return cache
  }

  function save() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(all()))
    } catch (e) {
      /* 隐私模式 / 存储被禁用：静默降级为「本次会话有效」 */
    }
  }

  function get(id) {
    var v = all()[id]
    return ORDER.indexOf(v) >= 0 ? v : 'unseen'
  }

  function set(id, status) {
    var m = all()
    if (status === 'unseen') delete m[id]
    else m[id] = status
    save()
  }

  // 未做 → 模糊 → 已掌握 → 未做
  function cycle(id) {
    var next = ORDER[(ORDER.indexOf(get(id)) + 1) % ORDER.length]
    set(id, next)
    return next
  }

  function reset() {
    cache = {}
    save()
  }

  function counts(ids) {
    var m = all()
    var out = { mastered: 0, learning: 0, unseen: 0 }
    for (var i = 0; i < ids.length; i++) {
      var v = m[ids[i]]
      if (v === 'mastered') out.mastered++
      else if (v === 'learning') out.learning++
      else out.unseen++
    }
    return out
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  function fmtTime(iso) {
    var d = new Date(iso)
    if (isNaN(d.getTime())) return ''
    var p = function (n) { return String(n).padStart(2, '0') }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
  }

  window.STUDY = {
    LABEL: LABEL,
    MARK: MARK,
    CLS: CLS,
    ORDER: ORDER,
    mastery: { all: all, get: get, set: set, cycle: cycle, reset: reset, counts: counts },
    esc: esc,
    fmtTime: fmtTime
  }
})()
