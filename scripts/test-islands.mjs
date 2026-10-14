// 小岛脚本单元测试（零依赖，手写最小 DOM shim）。
//
// 为什么需要它：站点去掉前端框架后，三块交互（题库筛选/搜索/掌握度、仪表盘、留言板）
// 全在 public/islands/*.js 里，而它们依赖真实 DOM —— 构建期的 verify-routes.mjs 只能
// 断言「挂点在、脚本在」，断言不了「脚本真的能跑通」。这里用一个够用的 DOM 假实现把
// 脚本跑一遍，任何运行时异常、文案错位、过滤结果不对都会在这里暴露。
//
// 用法：node scripts/test-islands.mjs
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(process.cwd())
const ISL = join(ROOT, 'public', 'islands')
const read = (f) => readFileSync(join(ISL, f), 'utf-8')

const origSetTimeout = globalThis.setTimeout
let failCount = 0
const bad = []
function ok(cond, msg) {
  if (!cond) { failCount++; bad.push('✗ ' + msg) }
}

// ---------- 最小 DOM ----------
function makeEl(tag = 'div') {
  const el = {
    tagName: tag,
    hidden: false,
    className: '',
    title: '',
    value: '',
    disabled: false,
    style: {},
    attrs: {},
    listeners: {},
    _text: '',
    _html: '',
    get textContent() { return this._text },
    // 与真实 DOM 语义一致：赋值 textContent 会替换全部子节点，
    // innerHTML 随之变成转义后的纯文本（否则高亮还原这类断言会读到脏 _html）
    set textContent(v) {
      this._text = String(v)
      this._html = String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
    },
    get innerHTML() { return this._html },
    // 与真实 DOM 语义一致：赋值 innerHTML 后 textContent 是剥掉标签的纯文本
    // （interview.js 的统计行用 <b class="ps-done"> 上色，断言读 textContent）
    set innerHTML(v) {
      this._html = String(v)
      this._text = String(v).replace(/<[^>]*>/g, '')
    },
    getAttribute(k) { return k in this.attrs ? this.attrs[k] : null },
    setAttribute(k, v) { this.attrs[k] = String(v) },
    removeAttribute(k) { delete this.attrs[k] },
    addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn) },
    fire(type, ev) { (this.listeners[type] || []).forEach((fn) => fn.call(this, ev)) },
    insertAdjacentHTML(_pos, h) { this._html = h + this._html },
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c) },
      remove(c) { this._set.delete(c) },
      // 必须支持两种调用：toggle('x', cond) 与 toggle('x')（后者取反并返回新状态）。
      // 早期 shim 只按真值判断第二个参数，导致 toggle('x') 被当成「删除」，
      // 演练场的折叠逻辑会静默失效。
      toggle(c, on) {
        const next = on === undefined ? !this._set.has(c) : !!on
        if (next) this._set.add(c)
        else this._set.delete(c)
        return next
      },
      contains(c) { return this._set.has(c) },
    },
    children: [],
    appendChild(c) { this.children.push(c); return c },
    removeChild(c) { this.children = this.children.filter((x) => x !== c); return c },
    querySelector: () => null,
    querySelectorAll: () => [],
    scrollIntoView() {},
    focus() {},
    select() {},
    closest: () => null,
    // 演练场的「点浮层外部收起」用 contains 判断目标是否在面板内。
    // 按真实语义沿 children 递归找；测试里想构造树就用 appendChild 串起来。
    contains(other) {
      const seen = [this]
      while (seen.length) {
        const cur = seen.pop()
        if (cur === other) return true
        seen.push(...cur.children)
      }
      return false
    },
  }
  return el
}

function makeStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
    _dump: () => Object.fromEntries(m),
  }
}

// 假计时器：让「1.5 秒后文案复位」这类断言不必真的睡 1.5 秒
function makeClock() {
  let seq = 0
  const pending = new Map()
  return {
    setTimeout(fn) { const id = ++seq; pending.set(id, fn); return id },
    clearTimeout(id) { pending.delete(id) },
    tick() { const fns = [...pending.values()]; pending.clear(); fns.forEach((f) => f()) },
    size: () => pending.size,
  }
}

// 在一个全新的 window/document 里执行若干小岛脚本
function runIsland(files, {
  els = {}, queryAll = {}, storage = makeStorage(), fetchImpl = null,
  clock = null, secure = true, clipboard = null,
} = {}) {
  const docListeners = {}
  const created = []
  const body = makeEl('body')
  const win = {
    localStorage: storage,
    confirm: () => true,
    isSecureContext: secure,
    setTimeout: clock ? clock.setTimeout : setTimeout,
    clearTimeout: clock ? clock.clearTimeout : clearTimeout,
    fetch: fetchImpl,
  }
  const doc = {
    getElementById: (id) => els[id] || null,
    querySelectorAll: (sel) => queryAll[sel] || [],
    querySelector: (sel) => (queryAll[sel] || [])[0] || null,
    createElement: (tag) => { const e = makeEl(tag); created.push(e); return e },
    execCommand: () => true,
    addEventListener(type, fn) { (docListeners[type] = docListeners[type] || []).push(fn) },
    body,
  }
  globalThis.window = win
  globalThis.document = doc
  globalThis.localStorage = storage
  globalThis.setTimeout = win.setTimeout
  globalThis.clearTimeout = win.clearTimeout
  globalThis.fetch = fetchImpl
  globalThis.location = { search: '' }
  globalThis.URLSearchParams = URLSearchParams
  globalThis.console = console
  // Node 21+ 自带 navigator（只读访问器），必须用 defineProperty 覆盖
  Object.defineProperty(globalThis, 'navigator', {
    value: { clipboard }, configurable: true, writable: true,
  })
  for (const f of files) {
    // 用 indirect eval 让脚本作用域挂在 globalThis 上（等价于浏览器里的 <script>）
    ;(0, eval)(read(f))
  }
  // 给测试用例留的触发口：document 上的 keydown 等监听无法从外部直接调用
  win.__fireDoc = (type, ev) => (docListeners[type] || []).forEach((fn) => fn(ev))
  win.__created = created
  win.__body = body
  return win
}

// =====================================================================
// 1) 题库小岛：筛选 / 搜索 / 掌握度 / 深链
// =====================================================================
{
  const mkRow = (id, diff, title, tags) => {
    const r = makeEl('div')
    r.attrs['data-qid'] = id
    r.attrs['data-diff'] = diff
    r.attrs['data-title'] = title
    r.attrs['data-tags'] = tags
    const btn = makeEl('button')
    btn.attrs['data-mastery'] = id
    btn.className = 'm-dot m-none'
    btn._text = '○ 未做'
    btn.closest = (sel) => (sel === '.m-dot' ? btn : null)
    r._btn = btn
    r.closest = () => null
    return r
  }
  const rows = [
    mkRow('a1', 'easy', '闭包是什么', 'closure scope'),
    mkRow('a2', 'medium', '事件循环', 'event loop'),
    mkRow('a3', 'hard', 'PWA service worker', 'pwa sw'),
  ]

  const list = makeEl('div')
  list.querySelectorAll = (sel) => (sel === '.row' ? rows : sel === '.m-dot' ? rows.map((r) => r._btn) : [])
  list.querySelector = (sel) => {
    const m = /data-qid="([^"]+)"/.exec(sel)
    return m ? rows.find((r) => r.attrs['data-qid'] === m[1]) || null : null
  }

  const chip = (kind, value, on) => {
    const c = makeEl('span')
    c.attrs['data-filter'] = kind
    c.attrs['data-value'] = value
    if (on) c.classList.add('on')
    return c
  }
  const chips = [
    chip('diff', 'all', true), chip('diff', 'easy'), chip('diff', 'medium'), chip('diff', 'hard'),
    chip('mastery', 'all', true), chip('mastery', 'unseen'), chip('mastery', 'learning'), chip('mastery', 'mastered'),
  ]

  const input = makeEl('input')
  const count = makeEl('span')
  const bar = makeEl('i')
  const stat = makeEl('span')
  const empty = makeEl('div')
  const reset = makeEl('button')

  // 2026-10-07 搜索交互升级的测试载体：a2 行带真实 h3（高亮断言用）
  const h3a2 = makeEl('h3')
  h3a2._text = '事件循环'
  rows[1].querySelector = (sel) => (sel === 'h3' ? h3a2 : null)

  const clock = makeClock()
  // runIsland 会把 globalThis.setTimeout 换成 clock 版本，跑完本块必须还原，
  // 否则后面留言板块的「await setTimeout(r, 0)」会永远挂起。
  const realSetTimeout = globalThis.setTimeout
  const realClearTimeout = globalThis.clearTimeout
  const win = runIsland(['core.js', 'interview.js'], {
    els: {
      'q-list': list, 'q-search': input, 'q-count': count, 'pb': bar,
      'pstat': stat, 'q-empty': empty, 'q-reset': reset,
    },
    queryAll: { '[data-filter]': chips },
    clock,
    // 搜索命中答案正文时会拉索引，测试里给个空索引即可
    fetchImpl: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  })

  ok(!!win.STUDY, 'core.js 应挂上 window.STUDY')
  ok(stat.textContent === '已掌握 0 · 模糊 0 · 未做 3', `初始统计错误：${stat.textContent}`)
  ok(rows.every((r) => r.hidden === false), '初始应显示全部 3 行')

  // 难度筛选
  chips.find((c) => c.attrs['data-value'] === 'hard').fire('click')
  ok(rows[0].hidden && rows[1].hidden && !rows[2].hidden, '按「进阶」筛选后应只剩第 3 行')
  ok(count.textContent === '1 / 3 题', `筛选后计数错误：${count.textContent}`)

  // 重置
  reset.fire('click')
  ok(rows.every((r) => !r.hidden), '重置后应恢复全部')

  // 掌握度循环：未做 → 模糊 → 已掌握 → 未做
  const btn = rows[0]._btn
  list.fire('click', { target: btn, preventDefault() {} })
  ok(win.STUDY.mastery.get('a1') === 'learning', '点一次应变成 learning')
  ok(btn.textContent === '◐ 模糊', `按钮文案未更新：${btn.textContent}`)
  list.fire('click', { target: btn, preventDefault() {} })
  ok(win.STUDY.mastery.get('a1') === 'mastered', '点两次应变成 mastered')
  ok(stat.textContent === '已掌握 1 · 模糊 0 · 未做 2', `统计未跟随：${stat.textContent}`)
  ok(bar.style.width === '33%', `进度条宽度错误：${bar.style.width}`)

  // 掌握度筛选
  chips.find((c) => c.attrs['data-value'] === 'mastered').fire('click')
  ok(!rows[0].hidden && rows[1].hidden && rows[2].hidden, '按「已掌握」筛选应只剩第 1 行')

  // local 存储键名必须与旧版一致，否则老用户的标记全部丢失
  const stored = JSON.parse(win.localStorage.getItem('interview-mastery') || '{}')
  ok(stored.a1 === 'mastered', `存储内容不对：${JSON.stringify(stored)}`)

  // —— 2026-10-07 搜索交互升级：关键词高亮 / Esc 清空 / / 聚焦 ——
  // 先复位筛选（上面的用例把掌握度筛成了已掌握）
  reset.fire('click')

  input.value = '循环'
  input.fire('input')
  clock.tick()
  await new Promise((r) => origSetTimeout(r, 0)) // 答案索引的 Promise 链走完
  ok(h3a2._html.includes('事件<mark>循环</mark>'), `命中关键词应在标题里高亮，实际：${h3a2._html}`)
  ok(count.classList.contains('on'), '搜索生效时计数应加 .on 强调')
  ok(count.textContent === '1 / 3 题', `搜索计数错误：${count.textContent}`)

  input.fire('keydown', { key: 'Escape' })
  ok(input.value === '', 'Esc 应清空搜索框')
  ok(h3a2._text === '事件循环' && !h3a2._html.includes('<mark>'), 'Esc 后标题应还原为纯文本')
  ok(count.textContent === '3 题', `Esc 后计数应复位，实际：${count.textContent}`)
  ok(!count.classList.contains('on'), '复位后计数应去掉 .on')

  let focused = false
  input.focus = () => { focused = true }
  win.__fireDoc('keydown', { key: '/', target: { tagName: 'BODY' }, preventDefault() {} })
  ok(focused, '非输入位置按 / 应聚焦题库搜索框')
  focused = false
  win.__fireDoc('keydown', { key: '/', target: { tagName: 'INPUT' }, preventDefault() {} })
  ok(!focused, '已在输入框里时按 / 不应抢焦点')

  globalThis.setTimeout = realSetTimeout
  globalThis.clearTimeout = realClearTimeout
}

// =====================================================================
// 2) 仪表盘小岛：读内联 JSON 渲染分类与难度
// =====================================================================
{
  const dash = makeEl('div')
  const data = makeEl('script')
  data.textContent = JSON.stringify({
    mods: [{ k: 'lang', n: '语言基础', cats: ['javascript', 'css'] }],
    cats: [
      { k: 'javascript', n: 'JavaScript 核心', ids: ['q1', 'q2', 'q3'] },
      { k: 'css', n: 'CSS 与布局', ids: ['q4'] },
    ],
    diffs: [
      { k: 'easy', n: '入门', ids: ['q1', 'q4'] },
      { k: 'medium', n: '中等', ids: ['q2'] },
      { k: 'hard', n: '进阶', ids: ['q3'] },
    ],
  })
  const resetBtn = makeEl('button')

  const storage = makeStorage()
  storage.setItem('interview-mastery', JSON.stringify({ q1: 'mastered', q4: 'learning' }))

  runIsland(['core.js', 'progress.js'], {
    els: { dash, 'dash-data': data, 'dash-reset': resetBtn },
    storage,
  })

  ok(dash.innerHTML.includes('33%'), '总体掌握度应为 1/3 = 33%')
  ok(dash.innerHTML.includes('JavaScript 核心'), '应渲染出分类名')
  ok(dash.innerHTML.includes('1 / 3 · 33%'), '分类进度文案不对')
  ok(dash.innerHTML.includes('1 / 2 已掌握'), '难度分布文案不对')
  ok(dash.innerHTML.includes('class="cb-num"'), '缺少 cat-block 结构')
  // 清空按钮：静态壳里 hidden，渲染后应解除并安排到总览行（进度条后的槽位）
  ok(dash.innerHTML.includes('id="dash-slot"'), '总览行应有清空按钮槽位')
  ok(resetBtn.hidden === false, '渲染后应解除清空按钮的 hidden')
}

// =====================================================================
// 3) 留言板小岛：拉列表 + 提交（不真的发请求）
// =====================================================================
{
  const form = makeEl('form')
  const nameEl = makeEl('input'); const contactEl = makeEl('input')
  const hpEl = makeEl('input'); const contentEl = makeEl('textarea')
  const byName = { name: nameEl, contact: contactEl, hp: hpEl, content: contentEl }
  const countEl = makeEl('div'); const errEl = makeEl('p'); const submitEl = makeEl('button')
  const items = makeEl('ul'); const state = makeEl('div')
  // 小岛在乐观插入后会问一句「列表里到底有没有内容」来决定要不要重新拉取。
  // shim 必须如实回答，否则会走成「再拉一次」，把刚插进去的那条覆盖掉。
  items.querySelector = (sel) => (items.innerHTML.includes(sel.replace(/^\./, '')) ? {} : null)

  // 注意：必须按 [name="x"] 精确取字段。用 includes('name') 之类的宽松匹配会把
  // [name="content"] 也判成 name 字段（测试 shim 自己会先踩这个坑）。
  form.querySelector = (sel) => {
    const nm = /\[name="([^"]+)"\]/.exec(sel)
    if (nm) return byName[nm[1]] || null
    if (sel.includes('.gb-count')) return countEl
    if (sel.includes('error')) return errEl
    if (sel.includes('submit')) return submitEl
    return null
  }
  contentEl.value = ''

  const calls = []
  const fetchImpl = (url, opt) => {
    calls.push({ url, opt })
    if (!opt || opt.method !== 'POST') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ messages: [{ id: '1', name: '阿伟', content: '沙发', createdAt: '2026-10-06T10:00:00Z' }] }) })
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ message: { id: '2', name: '', content: '新留言', createdAt: '2026-10-06T11:00:00Z' } }) })
  }

  runIsland(['core.js', 'guestbook.js'], {
    els: { 'gb-form': form, 'gb-items': items, 'gb-state': state },
    fetchImpl,
  })

  // 等 load() 的 promise 落地
  await new Promise((r) => setTimeout(r, 0))
  ok(items.innerHTML.includes('阿伟'), '应把拉到的留言渲染出来')
  ok(items.innerHTML.includes('2026-10-06'), '时间应被格式化')
  ok(!items.innerHTML.includes('contact'), '列表里绝不能渲染联系方式')

  // 提交：表单未填内容时按钮应是 disabled
  contentEl.value = '你好'
  contentEl.fire('input')
  ok(submitEl.disabled === false, '有内容后提交按钮应可用')
  ok(countEl.textContent === '2/500', '字数统计不对')

  form.fire('submit', { preventDefault() {} })
  await new Promise((r) => setTimeout(r, 0))
  const post = calls.find((c) => c.opt && c.opt.method === 'POST')
  ok(!!post, '应发出 POST 请求')
  const body = JSON.parse(post.opt.body)
  ok(typeof body.hp === 'string', 'POST 必须带蜜罐字段 hp')
  ok(typeof body.t0 === 'number', 'POST 必须带填写起始时刻 t0')
  ok(body.content === '你好', 'POST 内容不对')
  ok(contentEl.value === '', '提交成功后应清空输入框')
  ok(items.innerHTML.includes('新留言'), '新留言应被乐观插入')
}

// =====================================================================
// 4) 代码块复制小岛：事件委托 + 两种复制通道 + 图标状态复位
//    2026-10-07：按钮改成 SVG 图标（非文字），反馈只切 .copied 类。
// =====================================================================
{
  const clock = makeClock()
  const mkBlock = (text) => {
    const codeEl = makeEl('code')
    codeEl._text = text
    const block = makeEl('div')
    block.querySelector = (sel) => (sel === 'code' ? codeEl : null)
    const btn = makeEl('button')
    btn.closest = (sel) => (sel === '.code-copy' ? btn : sel === '.code-block' ? block : null)
    return { block, btn, codeEl }
  }

  const copied = []
  const clip = { writeText: (t) => { copied.push(t); return Promise.resolve() } }
  const a = mkBlock('const a = 1\nconsole.log(a)')

  const win = runIsland(['code.js'], { clock, clipboard: clip })
  win.__fireDoc('click', { target: a.btn, preventDefault() {} })
  await new Promise((r) => origSetTimeout(r, 0))

  ok(copied.length === 1, '点复制按钮应调用 clipboard.writeText')
  ok(copied[0] === 'const a = 1\nconsole.log(a)', `复制的文本不对：${JSON.stringify(copied[0])}`)
  ok(a.btn.classList.contains('copied'), '复制成功应加上 .copied 类（切到对勾图标）')

  clock.tick()
  ok(!a.btn.classList.contains('copied'), '到点后应移除 .copied（图标复位）')

  // 命中不到 .code-copy 的点击必须被忽略（比如点正文）
  const before = copied.length
  win.__fireDoc('click', { target: makeEl('p'), preventDefault() {} })
  ok(copied.length === before, '非复制按钮的点击不应触发复制')

  // 非安全上下文 + 无 clipboard → textarea + execCommand 回退
  const b = mkBlock('let x = 2')
  const win2 = runIsland(['code.js'], { clock, clipboard: null, secure: false })
  win2.__fireDoc('click', { target: b.btn, preventDefault() {} })
  await new Promise((r) => origSetTimeout(r, 0))
  const ta = win2.__created.find((e) => e.tagName === 'textarea')
  ok(!!ta, '无 clipboard 时应创建 textarea 回退')
  ok(ta && ta.value === 'let x = 2', `回退复制的文本不对：${ta && ta.value}`)
  ok(win2.__body.children.length === 0, '回退用的 textarea 用完必须移除，不能留在 body 里')
  ok(b.btn.classList.contains('copied'), '回退通道成功时也应加上 .copied 类')
}

// =====================================================================
// 5) 演练场小岛：开合 / 头部 × 关闭 / Esc / 点外部关闭 / 运行 / 清空
//    2026-10-07：折叠（pg-min）下线；× 关闭按钮恢复（用户要求）。
// =====================================================================
{
  const pg = makeEl('aside')
  const openBtn = makeEl('button')
  const editor = makeEl('textarea')
  const out = makeEl('div')
  out._text = '运行结果将显示在这里'
  const closeBtn = makeEl('button'); closeBtn.attrs['data-pg'] = 'close'
  const runBtn = makeEl('button'); runBtn.attrs['data-pg'] = 'run'
  const clrBtn = makeEl('button'); clrBtn.attrs['data-pg'] = 'clear'
  pg.querySelector = (sel) => {
    if (sel === '.pg-editor') return editor
    if (sel === '.pg-out-body') return out
    return null
  }

  const nativeLog = console.log
  const win = runIsland(['playground.js'], { els: { pg, 'pg-open': openBtn } })

  ok(!pg.classList.contains('on'), '演练场初始应收起（脚本被禁时不留空壳）')
  ok(openBtn.hidden === false, '初始悬浮按钮应可见')

  openBtn.fire('click')
  ok(pg.classList.contains('on'), '点「打开演练场」应展开')
  ok(openBtn.attrs['aria-expanded'] === 'true', 'aria-expanded 应同步为 true')
  ok(openBtn.hidden === true, '浮层打开后按钮应让位（两者抢同一个右下角）')

  // 收起方式 1：头部 × 按钮
  pg.fire('click', { target: closeBtn })
  ok(!pg.classList.contains('on'), '点头部 × 应关闭演练场')
  ok(openBtn.hidden === false, '关闭后悬浮按钮应回到右下角')

  // 收起方式 2：点到浮层外面（pointerdown 委托在 document 上）
  win.__fireDoc('pointerdown', { target: makeEl('p') })
  ok(!pg.classList.contains('on'), '点浮层外部应收起')
  ok(openBtn.hidden === false, '收起后悬浮按钮应回到右下角')

  // 对照：点浮层内部（编辑器、运行按钮等）绝不能收起
  openBtn.fire('click')
  pg.children.push(runBtn)
  win.__fireDoc('pointerdown', { target: runBtn })
  ok(pg.classList.contains('on'), '点浮层内部不应收起')

  openBtn.fire('click')
  win.__fireDoc('keydown', { key: 'Escape' })
  ok(!pg.classList.contains('on'), 'Esc 应关闭演练场')
  ok(openBtn.hidden === false, 'Esc 关闭后按钮也应回来')

  // 空编辑器
  openBtn.fire('click')
  pg.fire('click', { target: runBtn })
  ok(out.textContent.includes('为空'), `空编辑器应给提示，实际：${out.textContent}`)

  // 捕获 console.log 并回显返回值
  editor.value = 'console.log("hi")\n1 + 2'
  pg.fire('click', { target: runBtn })
  ok(out.textContent.includes('hi'), `应捕获 console.log 输出，实际：${out.textContent}`)
  ok(out.textContent.includes('⇒ 3'), `应回显表达式结果，实际：${out.textContent}`)

  // 运行时报错不能把异常抛到全局
  editor.value = 'throw new Error("boom")'
  pg.fire('click', { target: runBtn })
  ok(out.textContent.startsWith('✗') && out.textContent.includes('boom'), `应展示错误信息，实际：${out.textContent}`)

  // 清空：编辑器归零 + 控制台回到占位文案
  pg.fire('click', { target: clrBtn })
  ok(editor.value === '', '清空应清掉编辑器内容')
  ok(out.textContent === '运行结果将显示在这里', `清空应恢复占位文案，实际：${out.textContent}`)

  // TypeScript 类型剥离运行支持
  editor.value = 'interface User { name: string; age?: number }\nconst greet = (u: User): string => u.name;\nconsole.log(greet({ name: "TS_OK" }));'
  pg.fire('click', { target: runBtn })
  ok(out.textContent.includes('TS_OK'), `应剥离 TS 类型并成功执行，实际：${out.textContent}`)

  ok(console.log === nativeLog, 'console.log 必须被还原，不能永久改写全局')
}

if (bad.length) console.log(bad.join('\n'))
console.log(failCount ? `\n小岛测试失败 ${failCount} 项` : '\n小岛测试全部通过 ✔（题库 15 项 / 仪表盘 5 项 / 留言板 10 项 / 复制按钮 10 项 / 演练场 23 项）')
process.exit(failCount ? 1 : 0)
