export const rteCourseMeta = {
  "id": "rte",
  "title": "富文本编辑器从零实现",
  "subtitle": "富文本编辑器是前端公认的硬骨头：从 contentEditable 的古怪行为讲起，一步步驯服 Selection 与 Range，最终从零做出一个可用的编辑器。",
  "level": "进阶 → 前端核心",
  "icon": "📝",
  "color": "#10b981",
  "practiceCategory": "browser-engineering",
  "chapters": [
    {
      "key": "basic",
      "name": "第一章 · contentEditable 与选区模型",
      "lessons": [
        "rte-l1",
        "rte-l2"
      ]
    },
    {
      "key": "format",
      "name": "第二章 · 命令式格式（去 execCommand）",
      "lessons": [
        "rte-l3",
        "rte-l6"
      ]
    },
    {
      "key": "model",
      "name": "第三章 · 数据模型与序列化",
      "lessons": [
        "rte-l4",
        "rte-l8"
      ]
    },
    {
      "key": "input",
      "name": "第四章 · 输入处理、历史与媒体",
      "lessons": [
        "rte-l5",
        "rte-l7",
        "rte-l9"
      ]
    },
    {
      "key": "adv",
      "name": "第五章 · 协同、性能与选型",
      "lessons": [
        "rte-l10",
        "rte-l11",
        "rte-l12"
      ]
    }
  ]
}

export const rteLessons = [
  {
    "id": "rte-l1",
    "chapter": "basic",
    "title": "contentEditable：浏览器原生的富文本能力",
    "minutes": 45,
    "content": "## 目标\n\n富文本编辑器的起点是浏览器提供的 `contentEditable`。本节课看透它的本质：它只是一个\"允许用户在页面上直接改 DOM\"的开关，所有格式都落在真实 DOM 上。理解这点，你就知道为什么自研编辑器既要利用它、又要管住它。\n\n**运行环境**：任意现代浏览器（Chrome / Edge / Firefox / Safari）。\n**运行方式**：把下面代码保存为 `index.html`，双击用浏览器打开，直接在框里输入、选中文字看效果。\n\n```html\n<!DOCTYPE html>\n<html lang=\"zh\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>最小富文本编辑器</title>\n  <style>\n    #editor { border: 1px solid #ccc; padding: 12px; min-height: 120px; outline: none; }\n    #editor:focus { border-color: #10b981; }\n  </style>\n</head>\n<body>\n  <div id=\"editor\" contenteditable=\"true\">在这里输入文字，选中后按 Ctrl+B 看浏览器自带效果</div>\n  <script>\n    const editor = document.getElementById('editor')\n    // 监听输入：每一次按键/格式变化都会触发\n    editor.addEventListener('input', () => {\n      console.log('当前 HTML =', editor.innerHTML)\n    })\n  </script>\n</body>\n</html>\n```\n\n打开后你会发现：回车会变成 `<div>` 或 `<br>`，按 Ctrl+B 浏览器会自动包 `<b>`。这些\"自动行为\"正是自研编辑器要精确控制的地方。\n\n## 名词解释\n\n**contentEditable**：HTML 全局属性。设成 `\"true\"` 后，该元素内的文字、图片可直接被用户编辑，改动直接写进 DOM。\n**DOM（文档对象模型）**：页面在内存里的树状结构。富文本编辑器操作的一切（文字、格式）最终都是这棵树上的节点。\n**input 事件**：用户在可编辑区做任何修改（输入、删除、格式）都会触发，是\"内容变了\"的统一信号。\n\n## 课后练习\n\n**练习**：给上面的编辑器加一个按钮，点击后把当前内容通过 `alert` 弹出来。\n\n**答案**：在 `<body>` 里加 `<button id=\"show\">显示 HTML</button>`，脚本里加：\n\n```js\ndocument.getElementById('show').addEventListener('click', () => {\n  alert(editor.innerHTML)\n})\n```\n\n## 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n`contentEditable` 是富文本编辑器的\"地基\"，但光有它远远不够。它的两个特点决定了你必须自己造一层：其一，格式是直接落在 DOM 上的，浏览器各内核生成的标签还不一致（Chrome 用 `<div>`、老 IE 用 `<p>`），导致同样的操作不同浏览器得到不同 HTML；其二，`Ctrl+B` 这类内置快捷键走的是已废弃的 `execCommand`，行为不可控、不可测。所以成熟编辑器的思路是：用 `contentEditable` 接收用户输入，但用一个**自定义数据模型**来决定\"真正该生成什么 DOM\"。第 1 节你只要记住一句话——`contentEditable` 给了你\"能改\"，没给你\"改得可控\"。"
  },
  {
    "id": "rte-l2",
    "chapter": "basic",
    "title": "Selection 与 Range：光标与选区的模型",
    "minutes": 50,
    "content": "## 目标\n\n要操作选区（加粗选中文字、在光标处插图），必须先懂 **Selection / Range** 这套 API。本节课讲清\"光标在哪、选中了哪段\"，并写一个小工具把它打印出来。\n\n**运行环境**：浏览器（建议打开 DevTools 控制台跟练）。\n**运行方式**：在 l1 的 `index.html` 里，把 `<script>` 换成下面内容，打开后在编辑器里选中一段文字，观察控制台。\n\n```html\n<script>\n  const editor = document.getElementById('editor')\n  editor.addEventListener('selectionchange', () => {})\n  document.addEventListener('selectionchange', () => {\n    const sel = window.getSelection()\n    if (!sel.rangeCount) return\n    const range = sel.getRangeAt(0)\n    console.log('是否折叠(光标无选中):', sel.isCollapsed)\n    console.log('起点容器:', range.startContainer.nodeName, '偏移:', range.startOffset)\n    console.log('终点容器:', range.endContainer.nodeName, '偏移:', range.endOffset)\n    console.log('选中文本:', sel.toString())\n  })\n</script>\n```\n\n`Range` 用\"起点容器 + 起点偏移\"和\"终点容器 + 终点偏移\"精确定位一段内容。`isCollapsed` 为 `true` 表示只是光标、没选中任何字。\n\n## 名词解释\n\n**Selection（选区）**：用户当前选中的范围，全局只有一个。通过 `window.getSelection()` 拿到；`getRangeAt(0)` 取第一个 Range。\n**Range（范围）**：一段连续的文档区间，由起点和终点（各是一个\"节点 + 偏移\"）描述。文本节点里偏移是字符序号；元素节点里偏移是子节点序号。\n**collapse（折叠）**：选区收缩成一个光标点（`isCollapsed === true`），此时起点终点重合。\n\n## 课后练习\n\n**练习**：写一个函数 `getSelectionText()`，返回当前选中的纯文本；若没有选中则返回空串。\n\n**答案**：\n\n```js\nfunction getSelectionText() {\n  const sel = window.getSelection()\n  return sel && sel.rangeCount ? sel.toString() : ''\n}\n```\n\n## 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\nSelection / Range 是富文本编辑器所有\"精准操作\"的坐标系。没有它，你只能在\"整篇 HTML\"层面字符串替换，一改就乱。它的难点在于\"偏移是相对节点的\"——同一段文字，可能在文本节点里偏移 5，也可能因为嵌套元素变成\"父节点偏移 2\"。所以编辑器框架（如 ProseMirror）会把选区也建模进自己的数据模型里，避免直接跟裸 DOM 的偏移纠缠。本课你只要建立直觉：选区 = 起点 + 终点，每个点 = 节点 + 偏移。后面所有\"在光标处插入\"\"给选中加粗\"都建立在这之上。"
  },
  {
    "id": "rte-l3",
    "chapter": "format",
    "title": "命令式加粗：不用 execCommand 手写 Bold",
    "minutes": 55,
    "content": "## 目标\n\n`document.execCommand('bold')` 已废弃、且生成标签不可控。本节课手写 `toggleBold()`：用 Range 把选中的内容取出来、包一层 `<strong>`，再放回去。\n\n**运行环境**：浏览器。**运行方式**：在 l1 的 `index.html` 里，把 `<script>` 换成下面内容，选中文字后点\"加粗\"按钮。\n\n```html\n<script>\n  const editor = document.getElementById('editor')\n  function toggleBold() {\n    const sel = window.getSelection()\n    if (!sel.rangeCount || sel.isCollapsed) return // 没选中就不处理\n    const range = sel.getRangeAt(0)\n    const bold = document.createElement('strong')\n    bold.appendChild(range.extractContents()) // 把选中内容\"抽\"出来\n    range.insertNode(bold)                     // 包一层 strong 放回去\n    sel.removeAllRanges()                      // 收起选区，避免残影\n  }\n  document.getElementById('bold').addEventListener('click', toggleBold)\n</script>\n```\n\n配套加一个按钮 `<button id=\"bold\">加粗</button>`。`extractContents()` 会剪切选区内容，`insertNode` 把包裹后的节点塞回原位——这就是\"命令式格式\"的最小骨架。\n\n## 名词解释\n\n**extractContents()**：Range 的方法，把选区范围内的节点\"剪切\"出来，返回一个 DocumentFragment。\n**insertNode(node)**：把节点插入到 Range 的起点位置。\n**命令式格式（Imperative Formatting）**：直接操作 DOM 来改格式（加粗=包一层标签），与\"声明式\"（改数据模型、由框架重渲染）相对。execCommand 是浏览器内置的命令式，已废弃。\n\n## 课后练习\n\n**练习**：仿照 `toggleBold`，写一个 `toggleItalic()` 用 `<em>` 包裹选中内容。\n\n**答案**：\n\n```js\nfunction toggleItalic() {\n  const sel = window.getSelection()\n  if (!sel.rangeCount || sel.isCollapsed) return\n  const range = sel.getRangeAt(0)\n  const em = document.createElement('em')\n  em.appendChild(range.extractContents())\n  range.insertNode(em)\n  sel.removeAllRanges()\n}\n```\n\n## 总结\n\n手写 `toggleBold` 是\"去 execCommand\"的第一课。你会发现它比想象中微妙：`extractContents()` 如果跨了多个元素（比如选中跨两段的文字），会把中间结构切碎，需要处理边界。这正是生产编辑器不直接操作裸 DOM 的原因——它们先在统一的数据模型里做\"标记一段加粗\"，再一次性算出该生成什么 DOM。但亲手写一遍的价值在于：你彻底理解了\"加粗\"在 DOM 层面就是\"用 `<strong>` 把一段内容包起来\"。理解了最小骨架，再看 ProseMirror 的 `addMark` 就不会觉得是黑魔法。"
  },
  {
    "id": "rte-l4",
    "chapter": "model",
    "title": "数据模型：HTML 与自定义 JSON 节点树互转",
    "minutes": 55,
    "content": "## 目标\n\n大型编辑器（ProseMirror / Slate）不用\"HTML 字符串\"当内部状态，而是用**自定义 JSON 节点树**。本节课手写一个受限的 HTML↔JSON 互转器，体会\"模型与视图分离\"——这一段**完全在 Node 里可运行**。\n\n**运行环境**：Node.js v18+（无需浏览器、无需依赖）。\n**运行方式**：保存为 `model.js`，执行 `node model.js`。\n\n```js\n// model.js —— 受限 HTML（b/i/u/p/div/br + 文本）与 JSON 节点树互转\nfunction htmlToJson(html) {\n  let i = 0\n  function parse() {\n    const children = []\n    while (i < html.length) {\n      if (html[i] === '<') {\n        if (html.startsWith('</', i)) return children // 遇到结束标签，交回上层\n        const end = html.indexOf('>', i)\n        const tag = html.slice(i + 1, end).split(' ')[0]\n        i = end + 1\n        if (tag === 'br') { children.push({ type: 'break' }); continue }\n        const node = { type: 'element', tag, children: parse() }\n        const close = '</' + tag + '>'\n        if (html.startsWith(close, i)) i += close.length\n        children.push(node)\n      } else {\n        const next = html.indexOf('<', i)\n        const text = html.slice(i, next === -1 ? html.length : next)\n        if (text) children.push({ type: 'text', value: text })\n        i = next === -1 ? html.length : next\n      }\n    }\n    return children\n  }\n  return parse()\n}\n\nfunction jsonToHtml(nodes) {\n  return nodes.map(n => {\n    if (n.type === 'text') return n.value\n    if (n.type === 'break') return '<br>'\n    if (n.type === 'element') return '<' + n.tag + '>' + jsonToHtml(n.children) + '</' + n.tag + '>'\n    return ''\n  }).join('')\n}\n\n// ===== 调用示例 =====\nconst html = '<p>你好<b>世界</b></p><p>第二行<br>换行</p>'\nconst json = htmlToJson(html)\nconsole.log('JSON 模型 =', JSON.stringify(json, null, 2))\nconsole.log('还原 HTML =', jsonToHtml(json))\n```\n\nJSON 模型是一棵\"结构清晰、好遍历、好 diff\"的树，比 HTML 字符串更适合做撤销、协同、校验。\n\n## 名词解释\n\n**数据模型（Data Model）**：编辑器内部用来描述内容的\"源数据\"，通常是节点树。视图（DOM）由它生成；用户操作先改模型，再重渲染视图。\n**模型与视图分离**：内容状态存在模型里，DOM 只是模型的一种\"投影\"。好处是同一份模型能渲染成不同视图（屏幕、PDF、纯文本），也能做精准 diff。\n**节点树（Node Tree）**：模型的基本形态，每个节点是\"文本 / 元素 / 换行\"等类型，元素可含子节点。\n\n## 课后练习\n\n**练习**：用上面的 `htmlToJson`，统计一段 HTML 里一共有多少个文本节点。\n\n**答案**：\n\n```js\nfunction countText(nodes) {\n  let n = 0\n  for (const node of nodes) {\n    if (node.type === 'text') n++\n    else if (node.type === 'element') n += countText(node.children)\n  }\n  return n\n}\nconsole.log('文本节点数 =', countText(htmlToJson('<p>你好<b>世界</b></p>'))) // 2\n```\n\n## 总结\n\n\"模型与视图分离\"是富文本编辑器的分水岭思想。直接用 HTML 字符串当状态，最大的痛点是：HTML 是\"为显示设计\"的，充满冗余与不一致（`<b>` 和 `<strong>` 同义、`<p><br></p>` 和空行等价），做撤销/协同/校验时极难精确比对。自定义 JSON 节点树把\"语义\"和\"显示\"拆开：模型只关心\"这里有一段加粗文字\"，DOM 只是它的一种渲染结果。本课你在 Node 里跑通了互转，证明模型可以完全脱离浏览器存在——这正是对接服务端存储、做协同编辑的前提。先有干净的模型，才有可控的视图。"
  },
  {
    "id": "rte-l5",
    "chapter": "input",
    "title": "输入处理：拦截粘贴，把富文本洗成纯文本",
    "minutes": 50,
    "content": "## 目标\n\n用户从网页/Word 粘贴内容时，会带进一堆杂乱样式和奇怪标签。本节课拦截 `paste` 事件，取出纯文本，用 Range 手动插入，杜绝脏 HTML。\n\n**运行环境**：浏览器。**运行方式**：在 l1 的 `index.html` 里，把 `<script>` 换成下面内容，从别处复制一段带格式文字粘贴进编辑器，会发现只进来纯文本。\n\n```html\n<script>\n  const editor = document.getElementById('editor')\n  editor.addEventListener('paste', (e) => {\n    e.preventDefault() // 阻止浏览器默认粘贴（默认会带格式）\n    const text = (e.clipboardData || window.clipboardData).getData('text/plain')\n    const sel = window.getSelection()\n    if (!sel.rangeCount) return\n    const range = sel.getRangeAt(0)\n    range.deleteContents()              // 删掉选中的（若有）\n    range.insertNode(document.createTextNode(text)) // 插入纯文本节点\n    range.setStartAfter(range.lastChild) // 把光标移到文本末尾\n    range.collapse(true)\n    sel.removeAllRanges()\n    sel.addRange(range)\n  })\n</script>\n```\n\n`clipboardData.getData('text/plain')` 只拿纯文本；`preventDefault` 让默认的\"带格式粘贴\"不发生，脏 HTML 根本进不来。\n\n## 名词解释\n\n**paste 事件**：粘贴时触发，事件对象带 `clipboardData`（剪贴板数据）。`preventDefault()` 可阻止默认粘贴行为。\n**clipboardData.getData(type)**：按 MIME 类型取剪贴板内容，`'text/plain'` 是纯文本，`'text/html'` 是带格式 HTML。\n**受控输入（Controlled Input）**：不让浏览器自由改 DOM，而是拦截每一次输入、由自己的逻辑决定最终写入什么——这是可控编辑器的核心。\n\n## 课后练习\n\n**练习**：改进粘贴处理，让纯文本里的换行 `\\n` 也保留为编辑器里的换行（用 `<br>` 或 `\\n` 均可，本例用 `\\n` 由 contentEditable 自行处理）。\n\n**答案**：上面的实现已经逐字插入纯文本，其中包含的 `\\n` 在 `contentEditable` 中通常会被保留。若想显式转成 `<br>`，可把 `text` 按 `\\n` 切分、用 `<br>` 连接后插入：\n\n```js\nconst parts = text.split('\\n')\nconst frag = document.createDocumentFragment()\nparts.forEach((line, idx) => {\n  if (idx) frag.appendChild(document.createElement('br'))\n  frag.appendChild(document.createTextNode(line))\n})\nrange.insertNode(frag)\n```\n\n## 总结\n\n粘贴是富文本编辑器\"脏数据\"的最大入口。Word/网页复制来的 HTML 充满 `style`、`font`、`span` 和无效标签，直接放进来会污染你的数据模型、还可能带来 XSS。拦截 `paste`、只取 `text/plain`、自己决定怎么插入，是把\"输入受控\"落到实处的范本。这背后是同一句话：浏览器想自由改 DOM，你要接管每一次修改。顺着这个思路，`beforeinput` 事件能拦截得比 `paste`/`input` 更早（在浏览器落 DOM 之前），是做\"受控编辑器\"的更彻底方案——下一节处理块级格式时就会用到这类思路。"
  },
  {
    "id": "rte-l6",
    "chapter": "format",
    "title": "块级格式：标题与列表的块节点操作",
    "minutes": 55,
    "content": "## 目标\n\n加粗是\"行内格式\"（包一层标签）；标题/列表是\"块级格式\"——整块节点换标签。本节课手写 `toggleHeading()`，把光标所在块换成 `<h2>`。\n\n**运行环境**：浏览器。**运行方式**：在 l1 的 `index.html` 里，把 `<script>` 换成下面内容，把光标放进某段，点\"转标题\"按钮。\n\n```html\n<script>\n  const editor = document.getElementById('editor')\n  function toggleHeading() {\n    const sel = window.getSelection()\n    if (!sel.rangeCount) return\n    let node = sel.getRangeAt(0).startContainer\n    if (node.nodeType === 3) node = node.parentElement // 文本节点取其父元素\n    const block = node.closest('p, div, h1, h2, h3')\n    if (!block) return\n    const h2 = document.createElement('h2')\n    h2.innerHTML = block.innerHTML // 保留块内文字与行内格式\n    block.replaceWith(h2)           // 整块替换\n    // 把光标移回新标题内\n    const range = document.createRange()\n    range.selectNodeContents(h2)\n    sel.removeAllRanges()\n    sel.addRange(range)\n  }\n  document.getElementById('h2').addEventListener('click', toggleHeading)\n</script>\n```\n\n配套加按钮 `<button id=\"h2\">转标题</button>`。`closest(...)` 向上找最近的块级祖先，是块级操作的关键。\n\n## 名词解释\n\n**块级格式（Block Format）**：作用在一整个\"块\"（段落/标题/列表项）上的格式，如标题、引用、列表。区别于\"行内格式\"（只作用于一段连续文字）。\n**closest(selector)**：从当前元素向上查找最近的、匹配选择器的祖先（含自身）。做块级操作时常用来定位\"光标在哪一段\"。\n**replaceWith(node)**：用新节点替换自身，是\"整块换标签\"的标准做法。\n\n## 课后练习\n\n**练习**：写 `toggleList()`，把光标所在块变成 `<ul><li>...</li></ul>` 无序列表。\n\n**答案**：\n\n```js\nfunction toggleList() {\n  const sel = window.getSelection()\n  if (!sel.rangeCount) return\n  let node = sel.getRangeAt(0).startContainer\n  if (node.nodeType === 3) node = node.parentElement\n  const block = node.closest('p, div, h1, h2, h3')\n  if (!block) return\n  const li = document.createElement('li')\n  li.innerHTML = block.innerHTML\n  const ul = document.createElement('ul')\n  ul.appendChild(li)\n  block.replaceWith(ul)\n}\n```\n\n## 总结\n\n块级格式和行内格式是两类不同的操作，对应模型里两类不同的节点：行内节点（加粗标记）挂在某段文字上，块级节点（段落/标题）是独立的结构单元。直接 `replaceWith` 换标签简单直观，但同样有边界问题：列表项里可能嵌套别的结构、跨多块的选择要逐块处理。这也是为什么框架用\"块节点 + 行内 mark\"分离建模——`toggleHeading` 在框架里变成\"把选中块节点的 type 从 `paragraph` 改成 `heading`\"，视图层再去渲染成 `<h2>`。你手写的版本抓住了本质：块级格式 = 找到块、换它的类型。剩下的复杂度，交给数据模型去统一管理。"
  },
  {
    "id": "rte-l7",
    "chapter": "input",
    "title": "撤销重做：基于历史栈的 Undo/Redo",
    "minutes": 55,
    "content": "## 目标\n\n`Ctrl+Z` 是编辑器标配。本节课写一个**基于快照的历史栈** `History`：每次改动压入新状态，撤销/重做只是移动指针。这一段**完全在 Node 里可运行**。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `history.js`，执行 `node history.js`。\n\n```js\n// history.js —— 基于快照的命令历史栈（也可用于编辑器内容）\nclass History {\n  constructor(initial) {\n    this.stack = [initial] // 快照数组\n    this.index = 0         // 当前指针\n  }\n  get current() { return this.stack[this.index] }\n  push(state) {\n    // 压新状态时，丢弃指针之后的\"重做分支\"\n    this.stack = this.stack.slice(0, this.index + 1)\n    this.stack.push(state)\n    this.index = this.stack.length - 1\n  }\n  undo() { if (this.index > 0) this.index--; return this.current }\n  redo() { if (this.index < this.stack.length - 1) this.index++; return this.current }\n}\n\n// ===== 调用示例 =====\nconst h = new History('')\nh.push('hello')\nh.push('hello world')\nconsole.log('当前:', h.current)       // hello world\nconsole.log('undo :', h.undo())       // hello\nconsole.log('redo :', h.redo())       // hello world\nh.push('hello world!')                // 分叉：旧的重做分支被丢弃\nconsole.log('分叉后 undo:', h.undo()) // hello world\nconsole.log('还能 redo?', h.redo())   // hello world!\n```\n\n指针法的精髓：撤销不是\"反向执行\"，而是\"回到上一个快照\"；在新状态上再编辑会丢掉 redo 分支（像真的编辑器一样）。\n\n## 名词解释\n\n**撤销（Undo）/ 重做（Redo）**：回到上一次 / 下一次编辑状态。`Ctrl+Z` 撤销，`Ctrl+Y` 或 `Ctrl+Shift+Z` 重做。\n**快照（Snapshot）**：某一时刻内容的完整副本。每次改动存一份快照，撤销就是切回旧快照。\n**历史栈指针**：用数组存快照、`index` 指当前位置。压新状态时截断 `index` 之后的分支，这正是\"编辑后旧重做失效\"的来源。\n\n## 课后练习\n\n**练习**：上面的 `History` 每次都存整份字符串，内容大时会很占内存。请说明一种改进思路（不用写代码）。\n\n**答案**：用\"命令模式\"替代整份快照——不存完整内容，而是存\"这次改了什么\"（如 `{type:'insert', pos:5, text:'ab'}` 与对应的反向命令）。撤销=执行反向命令，重做=执行正向命令。这样内存从 O(n×步数) 降到 O(步数×改动量)，ProseMirror 等就是这么做的（基于 step/transaction）。\n\n## 总结\n\nUndo/Redo 看似简单，却是编辑器工程里的经典难题。最朴素的\"整份快照\"法人人能写（本课就是），但它随内容变大越来越费内存。生产编辑器的进化方向是\"命令/事务（transaction）\"：不存结果，存\"变更本身\"，撤销就是反向应用变更。这带来两个好处——省内存，且天然支持协同（把变更广播给别人就能复现你的编辑）。本课你建立的指针模型是关键直觉：撤销 = 移动指针，不是倒放操作。这个直觉直接通向 OT/CRDT 协同（第10节）。"
  },
  {
    "id": "rte-l8",
    "chapter": "model",
    "title": "序列化：文档模型存盘与加载",
    "minutes": 50,
    "content": "## 目标\n\n内容要存数据库、要发给协同伙伴，必须能**序列化**成稳定格式。本节课把 l4 的模型升级成 ProseMirror 风格 `{type:'doc', content:[...]}`，并写 `toHTML / fromHTML`，在 Node 里可运行。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `serialize.js`，执行 `node serialize.js`（复用 l4 的解析思路）。\n\n```js\n// serialize.js —— 文档模型与 HTML 互转（Node 可运行）\nfunction htmlToDoc(html) {\n  let i = 0\n  function parse() {\n    const content = []\n    while (i < html.length) {\n      if (html[i] === '<') {\n        if (html.startsWith('</', i)) return content\n        const end = html.indexOf('>', i)\n        const tag = html.slice(i + 1, end).split(' ')[0]\n        i = end + 1\n        if (tag === 'br') { content.push({ type: 'break' }); continue }\n        const node = { type: 'element', tag, content: parse() }\n        const close = '</' + tag + '>'\n        if (html.startsWith(close, i)) i += close.length\n        content.push(node)\n      } else {\n        const next = html.indexOf('<', i)\n        const text = html.slice(i, next === -1 ? html.length : next)\n        if (text) content.push({ type: 'text', value: text })\n        i = next === -1 ? html.length : next\n      }\n    }\n    return content\n  }\n  return { type: 'doc', content: parse() }\n}\n\nfunction docToHtml(doc) {\n  return doc.content.map(n => {\n    if (n.type === 'text') return n.value\n    if (n.type === 'break') return '<br>'\n    if (n.type === 'element') return '<' + n.tag + '>' + docToHtml(n) + '</' + n.tag + '>'\n    return ''\n  }).join('')\n}\n\n// 简单 schema 校验：不允许孤立的 element 没有 content 字段\nfunction validate(doc) {\n  function walk(node) {\n    if (node.type === 'element' && !Array.isArray(node.content)) throw new Error('element 必须含 content 数组')\n    if (node.content) node.content.forEach(walk)\n  }\n  if (doc.type !== 'doc') throw new Error('根必须是 doc')\n  walk(doc)\n  return true\n}\n\n// ===== 调用示例 =====\nconst doc = htmlToDoc('<p>你好<b>世界</b></p>')\nconsole.log('文档模型 =', JSON.stringify(doc))\nconsole.log('校验通过 =', validate(doc))\nconsole.log('还原 HTML =', docToHtml(doc))\n```\n\n把模型统一成 `{type:'doc', content:[...]}`，存盘就是 `JSON.stringify(doc)`，加载就是 `JSON.parse`，协同时也只传这个 JSON。\n\n## 名词解释\n\n**序列化（Serialization）**：把内存里的对象转成可存储/传输的字符串（如 JSON、HTML）。反序列化是其逆过程。\n**Schema（模式）**：对模型结构的约定（哪些节点合法、能含什么子节点）。校验 schema 能在存盘前拦住非法结构。\n**文档模型（Document Model）**：编辑器内部\"一份内容\"的标准表示，如 ProseMirror 的 `{type:'doc', content:[...]}`。它是存储、协同、渲染的共同语言。\n\n## 课后练习\n\n**练习**：写一个 `cloneDoc(doc)`，深拷贝一份文档模型（不改变原对象）。\n\n**答案**：\n\n```js\nfunction cloneDoc(doc) {\n  return JSON.parse(JSON.stringify(doc)) // 模型是纯 JSON，直接结构化克隆最稳\n}\nconst a = htmlToDoc('<p>hi</p>')\nconst b = cloneDoc(a)\nb.content[0].tag = 'div'\nconsole.log('原 doc 未被改:', a.content[0].tag) // p\n```\n\n## 总结\n\n序列化决定了一门编辑器\"能不能落地\"：内容存不进数据库、发不到后端，再漂亮也没用。把模型定成纯 JSON 的 `{type:'doc', content:[...]}`，序列化就变成了 `JSON.stringify`，协同伙伴之间也只传这个 JSON，前后端一套结构。schema 校验是保险丝——在存盘/加载前拦掉非法节点，避免脏数据进入模型后把渲染搞崩。本课你跑通的 `htmlToDoc / docToHtml / validate`，正是 ProseMirror 里 `DOMParser` 与 `Schema` 的迷你版。记住：模型是真相之源，HTML 只是它的一种外衣。"
  },
  {
    "id": "rte-l9",
    "chapter": "input",
    "title": "插入图片与链接：在光标处注入节点",
    "minutes": 50,
    "content": "## 目标\n\n图片和链接是\"行内媒体节点\"。本节课用 Range 在光标处插入 `<img>` 与 `<a>`，并强调\"先校验 URL、再插入\"的安全习惯。\n\n**运行环境**：浏览器。**运行方式**：在 l1 的 `index.html` 里，把 `<script>` 换成下面内容，把光标放进编辑器，点按钮插入。\n\n```html\n<script>\n  const editor = document.getElementById('editor')\n  function insertImage(url) {\n    if (!/^https?:\\/\\//i.test(url)) { alert('仅允许 http(s) 图片'); return }\n    const sel = window.getSelection()\n    if (!sel.rangeCount) return\n    const img = document.createElement('img')\n    img.src = url; img.alt = 'image'\n    sel.getRangeAt(0).insertNode(img)\n  }\n  function insertLink(url, text) {\n    if (!/^https?:\\/\\//i.test(url)) { alert('仅允许 http(s) 链接'); return }\n    const sel = window.getSelection()\n    if (!sel.rangeCount) return\n    const range = sel.getRangeAt(0)\n    const a = document.createElement('a')\n    a.href = url\n    a.target = '_blank'\n    a.textContent = range.toString() || text\n    try { range.surroundContents(a) } catch (e) { range.insertNode(a) }\n  }\n  document.getElementById('img').addEventListener('click', () => insertImage(prompt('图片URL')))\n  document.getElementById('link').addEventListener('click', () => insertLink(prompt('链接URL'), '链接'))\n</script>\n```\n\n配套按钮 `<button id=\"img\">插图</button><button id=\"link\">插链</button>`。插入前用正则校验 `http(s)` 协议，是不让 `javascript:` 等危险 URL 进来的一道防线。\n\n## 名词解释\n\n**行内媒体节点（Inline Media）**：嵌在文字流里的非文本节点，如图片、链接、@提及、公式。它们和\"加粗\"一样是行内级别的。\n**surroundContents(node)**：把 Range 选中的内容用 `node` 包裹起来（如用 `<a>` 包住选中文字）。选区跨元素时会抛错，需用 `insertNode` 兜底。\n**URL 校验**：插入外部资源前检查协议（只允许 `http/https`），防止 `javascript:` 等脚本 URL 造成 XSS。\n\n## 课后练习\n\n**练习**：改进 `insertImage`，让插入后光标自动跳到图片之后，方便继续输入。\n\n**答案**：插入后用 Range 把光标移到图片后面：\n\n```js\nfunction insertImage(url) {\n  if (!/^https?:\\/\\//i.test(url)) return\n  const sel = window.getSelection()\n  if (!sel.rangeCount) return\n  const img = document.createElement('img')\n  img.src = url; img.alt = 'image'\n  const range = sel.getRangeAt(0)\n  range.insertNode(img)\n  range.setStartAfter(img)\n  range.collapse(true)\n  sel.removeAllRanges()\n  sel.addRange(range)\n}\n```\n\n## 总结\n\n插入图片/链接是\"在光标处注入节点\"的典型场景，技术上就是 Range 的 `insertNode` / `surroundContents`。本课更想强调的是安全：富文本编辑器是 XSS 高发地，因为用户内容最终要进 DOM。插入任何外部 URL 前校验协议、渲染时对 `href/src` 做白名单，是底线操作。生产框架（如 TipTap）把图片/链接做成\"带属性的节点\"，URL 作为节点属性存进模型、渲染时统一做转义，比直接拼 DOM 安全得多。你手写的版本点出了关键两步：定位光标（Range）+ 注入节点，以及\"先校验、再插入\"的安全意识。"
  },
  {
    "id": "rte-l10",
    "chapter": "adv",
    "title": "协同编辑基础：多标签页实时同步",
    "minutes": 55,
    "content": "## 目标\n\n协同编辑（多人同时改）是编辑器皇冠上的明珠。本节课先用 `BroadcastChannel` 做\"同浏览器多标签页实时同步\"，建立\"编辑=广播状态\"的直觉；再点明真实协同（OT/CRDT）要解决的核心难题。\n\n**运行环境**：浏览器（开两个标签页指向同一文件）。\n**运行方式**：在 l1 的 `index.html` 里，把 `<script>` 换成下面内容，打开两个标签页，在一个里输入，另一个会同步。\n\n```html\n<script>\n  const editor = document.getElementById('editor')\n  const channel = new BroadcastChannel('rte-sync') // 同源标签页间的通信通道\n  // 收到别的标签页发来的内容 -> 应用\n  channel.onmessage = (e) => {\n    if (document.activeElement !== editor) editor.innerHTML = e.data\n  }\n  // 本标签页内容变化 -> 广播\n  editor.addEventListener('input', () => {\n    channel.postMessage(editor.innerHTML)\n  })\n</script>\n```\n\n两个标签页通过 `rte-sync` 频道互发 HTML，实现\"一处改、处处变\"。这是\"状态广播\"的最简形态。\n\n## 名词解释\n\n**BroadcastChannel**：同源下不同标签页/Worker 之间的消息通道，`postMessage` 发、`onmessage` 收。适合做同浏览器多实例同步。\n**协同编辑（Collaborative Editing）**：多人同时编辑同一份文档且最终一致。难点是\"两人同时改同一处\"如何合并。\n**OT / CRDT**：协同合并的两大算法族。OT（操作变换）需中心服务器协调；CRDT（无冲突复制数据类型）让各端独立合并也不冲突（如 Yjs 用的就是 CRDT）。\n\n## 课后练习\n\n**练习**：上面的同步是\"整篇 HTML 覆盖\"，两人同时输入会互相覆盖。请说明真实协同用什么思路避免\"后到的覆盖先到的\"。\n\n**答案**：真实协同不传\"整篇结果\"，而是传\"编辑操作（在哪个位置插了什么 / 删了哪段）\"。当两人的操作同时到达，用 OT 把操作互相变换、或 CRDT 直接可交换合并，保证各端最终得到同一份内容，而不是简单覆盖。本课广播的是结果，仅用于演示\"状态要同步\"这一前提。\n\n## 进阶核心：当两个用户同时在同一位置输入时，如何避免互相覆盖？（OT 操作转换算法实现）\n\n仅靠 `BroadcastChannel` 广播整篇 HTML 字符串在真实生产环境中存在致命缺陷：**后到达的全量快照会直接覆盖先到达的修改，且重置远端用户的光标选区（Selection）**。工业界协同富文本编辑器（Google Docs / 飞书文档 / Notion）采用 **增量原子操作（Operation）+ OT（Operational Transformation，操作转换）或 CRDT（Yjs）** 解决并发冲突。\n\n下面我们用 35 行纯 JS 手写一个支持并发插入/删除位置自动偏移校准的 **OT 核心转换函数 `transform(opA, opB)`**：\n\n```javascript\n// 原子操作定义：\n// - 插入：{ type: 'insert', pos: number, text: string }\n// - 删除：{ type: 'delete', pos: number, len: number }\n\n// 当本地未确认操作 opClient 与远端同时发来的操作 opServer 并发冲突时，\n// 计算 opServer 在已经执行了 opClient 的文档上的等效转换操作 opServer'：\nexport function transformOperation(opServer, opClient) {\n  const transformed = { ...opServer }\n\n  // 场景 1：客户端在前面插入了文本 -> 远端操作若发生在插入点之后，其目标位置必须向后顺移！\n  if (opClient.type === 'insert') {\n    const shift = opClient.text.length\n    // tie-break 规则：若同在完全相同的 pos 插入，按客户端 ID 字典序决定谁先谁后\n    if (opClient.pos < opServer.pos || (opClient.pos === opServer.pos && opClient.siteId < opServer.siteId)) {\n      transformed.pos += shift\n    }\n  }\n\n  // 场景 2：客户端在前面删除了文本 -> 远端操作若发生在删除区间之后，其目标位置必须向前收缩！\n  if (opClient.type === 'delete') {\n    if (opClient.pos + opClient.len <= opServer.pos) {\n      transformed.pos -= opClient.len\n    } else if (opClient.pos < opServer.pos) {\n      // 删除区间跨越了远端操作起点：将起点拉回删除起点\n      transformed.pos = opClient.pos\n    }\n  }\n\n  return transformed\n}\n\n// 顺带同步转换本地用户的光标位置（Cursor Preservation），实现“别人打字时我的光标不乱跳”！\nexport function transformCursorIndex(cursorPos, remoteOp) {\n  if (remoteOp.type === 'insert' && remoteOp.pos <= cursorPos) {\n    return cursorPos + remoteOp.text.length\n  }\n  if (remoteOp.type === 'delete' && remoteOp.pos < cursorPos) {\n    return Math.max(remoteOp.pos, cursorPos - remoteOp.len)\n  }\n  return cursorPos\n}\n```\n\n### OT 与 CRDT（Yjs / Automerge）选型对比\n\n| 协同算法 | 核心原理 | 服务端要求 | 典型代表 |\n| :--- | :--- | :--- | :--- |\n| **OT（操作转换）** | 基于整数下标偏移（Index-based），依赖中心服务器定序（Total Order）后做位置加减变换 | **强依赖中心化定序服务器** | Google Docs、ProseMirror `prosemirror-collab` |\n| **CRDT（无冲突复制数据类型）** | 为每个字符/节点分配全局唯一的逻辑时钟 ID（`(clientId, clock)`），通过链表相对偏序定位而非易变的数组下标 | **无需中心定序**，天然支持离线编辑、P2P 与 WebRTC 合并 | **Yjs**（配合 TipTap / Lexical / BlockSuite）、Automerge |\n\n## 总结\n\n协同编辑听起来高大上，本质是先建立\"编辑=产生变更、变更要广播、各端合并\"的闭环。本课用 `BroadcastChannel` 把\"同步\"这件事跑通了，但它传的是\"整篇结果\"，所以两人同时打字会互相覆盖——这只是演示。真正的协同（Google Docs、飞书文档）传的是\"操作\"而非\"结果\"：你插了一个字，广播的是\"在第 5 位插 A\"；对方同时插字，算法把两条操作变换/合并，最终两边一致。OT 靠服务器当裁判，CRDT（如 Yjs）让各端数学上必然收敛。理解本课，你就站在了协同编辑的门口；下一步是把\"广播结果\"升级成\"广播操作 + 冲突合并\"。"
  },
  {
    "id": "rte-l11",
    "chapter": "adv",
    "title": "性能：大文档的节流渲染与增量更新",
    "minutes": 50,
    "content": "## 目标\n\n几百页的文档，每次 `input` 都全量重渲染会卡。本节课写一个**节流（throttle）**工具（Node 可运行），理解\"高频事件要限流\"；再讲编辑器真正的性能法宝：增量更新。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `throttle.js`，执行 `node throttle.js`。\n\n```js\n// throttle.js —— 限流高频事件：最多每 ms 毫秒执行一次\nfunction throttle(fn, ms) {\n  let last = 0\n  let timer = null\n  return (...args) => {\n    const now = Date.now()\n    const remain = ms - (now - last)\n    if (remain <= 0) {\n      last = now\n      fn(...args)\n    } else if (!timer) {\n      timer = setTimeout(() => { last = Date.now(); timer = null; fn(...args) }, remain)\n    }\n  }\n}\n\n// ===== 调用示例：模拟 1 秒内狂触发 20 次，渲染只跑几次 =====\nlet count = 0\nconst render = throttle(() => { count++; console.log('渲染第', count, '次 @', Date.now()) }, 200)\nfor (let i = 0; i < 20; i++) render()\nsetTimeout(() => console.log('1 秒后共渲染', count, '次（被节流）'), 1000)\n```\n\n`throttle` 保证 `render` 在 200ms 内最多执行一次，把\"狂触发\"压成\"按节奏跑\"。\n\n## 名词解释\n\n**节流（Throttle）**：限制函数在一段时间窗口内最多执行一次，用于驯服高频事件（输入、滚动、缩放）。\n**防抖（Debounce）**：与节流不同，防抖是\"停止触发 N 毫秒后才执行一次\"（适合搜索框）。本课用的是节流（适合持续渲染）。\n**增量更新（Incremental Update）**：只重渲染\"变了的那部分 DOM\"，而非整篇。是大型编辑器不卡的根本原因，比节流更彻底。\n\n## 课后练习\n\n**练习**：写一句区分\"节流\"和\"防抖\"的话，并各举一个适用场景。\n\n**答案**：节流=匀速限流（每 200ms 最多一次），适合持续渲染/滚动打点；防抖=静默后才跑（停下 200ms 才执行），适合搜索联想、窗口 resize 后的布局重算。一句话：节流管\"频率上限\"，防抖管\"静默触发\"。\n\n## 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n性能是编辑器\"能不能用\"的硬指标。节流是最低成本的优化——把高频 `input` 压成匀速渲染，立竿见影。但它只是\"限流\"，不是\"少做\"：每次仍然可能全量渲染。大型编辑器（Google Docs、Notion）的真正法宝是**增量更新**：模型变了，只把\"变化的节点\"对应的 DOM 局部更新，未变的子树纹丝不动。这要求模型是结构化的（回到第4/8节的 JSON 模型）——只有能精确 diff\"哪里变了\"，才能精确只更新那里。所以性能不是孤立的一节，它是前面\"模型与视图分离\"的自然回报：有了干净模型，增量更新才成为可能。"
  },
  {
    "id": "rte-l12",
    "chapter": "adv",
    "title": "总览与选型：自研 vs ProseMirror/Slate/Lexical/TipTap",
    "minutes": 60,
    "content": "## 目标\n\n走到这里你已经具备自研编辑器的全部零件。最后一节做**选型总览**：什么时候该自己造、什么时候用框架，并给一个用 TipTap（基于 ProseMirror）10 行搭编辑器的对照。\n\n**运行环境**：浏览器（需联网加载 CDN）。\n**运行方式**：保存为下面的 `tiptap.html`，用浏览器打开即可看到带工具栏的编辑器。\n\n```html\n<!DOCTYPE html>\n<html lang=\"zh\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>TipTap 最小编辑器</title>\n  <script src=\"https://unpkg.com/@tiptap/core@2/dist/tiptap.umd.js\"></script>\n  <script src=\"https://unpkg.com/@tiptap/starter-kit@2/dist/starter-kit.umd.js\"></script>\n</head>\n<body>\n  <div id=\"app\"></div>\n  <script>\n    const editor = Tiptap.Editor.create({\n      element: document.getElementById('app'),\n      extensions: [Tiptap.StarterKit],\n      content: '<p>你好，这是 TipTap 编辑器</p>',\n    })\n    // 加粗：editor.chain().focus().toggleBold().run()\n  </script>\n</body>\n</html>\n```\n\n同样\"加粗\"，自研要手写 `toggleBold`（第3节），框架一行 `toggleBold().run()` 搞定——因为框架已经把\"模型 + 命令 + 渲染 + 撤销 + 协同\"全打包了。\n\n## 名词解释\n\n**ProseMirror**：老牌编辑器框架，核心是\"严格 schema 的文档模型 + 插件式状态管理\"，Notion、Atlassian 系常用。TipTap 是它的上层封装。\n**Slate**：React 友好的\"完全可定制\"框架，模型就是普通 JSON，适合深度定制 UI。\n**Lexical**：Meta 出品，性能优先、细粒度可插拔，Facebook/Comment 场景常见。\n**自研 vs 框架**：内容简单、要极致控制 → 自研（你已会）；复杂富文本、要协同/多端 → 用框架省下数年工程。\n\n## 课后练习\n\n**练习**：假设你要做一个\"只支持加粗、斜体、标题\"的内部公告编辑器，且团队用 React。请给出选型建议并说理由。\n\n**答案**：用 TipTap（基于 ProseMirror）+ React 封装最稳：三个格式 StarterKit 已内置，撤销/协同/可访问性开箱即用；自研要自己处理跨浏览器 DOM 差异、撤销栈、schema 校验，投入大且易出 bug。除非有强定制或离线特殊需求，否则不推荐从零自研。\n\n## 总结\n\n12 节走完，你已经亲手实现了富文本编辑器的每一个核心零件：contentEditable 接收输入、Selection/Range 定位、命令式格式、JSON 数据模型、受控粘贴、块级格式、撤销栈、序列化、媒体插入、协同直觉、节流与增量更新。这正是所有框架内部在做的事——区别只在于它们把这些零件打磨成了\"严格 schema + 插件系统 + 协同内核\"。选型时记住：框架不是黑盒，是你已经理解的那些概念的工业化封装。简单场景自研可控、零依赖；复杂场景（协同、多端、强 schema）用 ProseMirror/TipTap/Slate/Lexical，把省下的工程力用在业务上。你现在的底气是：哪怕用框架，也知道它每一层在干什么，不会被\"开箱即用\"蒙住眼睛。"
  }
]

export const rtePlan = [
  {
    "day": 1,
    "theme": "contentEditable",
    "lessonIds": [
      "rte-l1"
    ],
    "practice": [],
    "goal": "理解浏览器原生富文本能力与坑"
  },
  {
    "day": 2,
    "theme": "选区模型",
    "lessonIds": [
      "rte-l2"
    ],
    "practice": [],
    "goal": "吃透 Selection / Range：光标与选中"
  },
  {
    "day": 3,
    "theme": "加粗斜体",
    "lessonIds": [
      "rte-l3"
    ],
    "practice": [],
    "goal": "不用 execCommand 手写 toggleBold"
  },
  {
    "day": 4,
    "theme": "数据模型",
    "lessonIds": [
      "rte-l4"
    ],
    "practice": [],
    "goal": "HTML 与自定义 JSON 节点树互转（Node 可运行）"
  },
  {
    "day": 5,
    "theme": "输入清洗",
    "lessonIds": [
      "rte-l5"
    ],
    "practice": [],
    "goal": "拦截粘贴，把富文本洗成纯文本"
  },
  {
    "day": 6,
    "theme": "块级格式",
    "lessonIds": [
      "rte-l6"
    ],
    "practice": [],
    "goal": "标题/列表的块节点操作"
  },
  {
    "day": 7,
    "theme": "撤销重做",
    "lessonIds": [
      "rte-l7"
    ],
    "practice": [],
    "goal": "基于历史栈的 undo/redo（Node 可运行）"
  },
  {
    "day": 8,
    "theme": "序列化",
    "lessonIds": [
      "rte-l8"
    ],
    "practice": [],
    "goal": "toHTML / fromJSON 存盘加载"
  },
  {
    "day": 9,
    "theme": "媒体",
    "lessonIds": [
      "rte-l9"
    ],
    "practice": [],
    "goal": "在光标处插入图片与链接"
  },
  {
    "day": 10,
    "theme": "协同基础",
    "lessonIds": [
      "rte-l10"
    ],
    "practice": [],
    "goal": "BroadcastChannel 多标签页同步"
  },
  {
    "day": 11,
    "theme": "性能",
    "lessonIds": [
      "rte-l11"
    ],
    "practice": [],
    "goal": "大文档节流渲染思路"
  },
  {
    "day": 12,
    "theme": "选型",
    "lessonIds": [
      "rte-l12"
    ],
    "practice": [],
    "goal": "自研 vs ProseMirror/Slate/Lexical/TipTap"
  }
]
