export const jsmCourseMeta = {
  "id": "jsm",
  "title": "JS 模块化与工程实践",
  "subtitle": "模块化不是新发明，而是一场持续三十年的演进：从 script 标签的原始局限走到 ESM 与打包器源码，看清今天前端工程化体系的来龙去脉。",
  "level": "入门 → 进阶",
  "icon": "📦",
  "color": "#d97706",
  "practiceCategory": "javascript",
  "chapters": [
    {
      "key": "history",
      "name": "第一章 · 模块化演进与规范",
      "lessons": [
        "jsm-l1",
        "jsm-l2",
        "jsm-l3"
      ]
    },
    {
      "key": "cjs",
      "name": "第二章 · CommonJS 深入",
      "lessons": [
        "jsm-l4",
        "jsm-l5",
        "jsm-l6"
      ]
    },
    {
      "key": "esm",
      "name": "第三章 · ES Module 深入",
      "lessons": [
        "jsm-l7",
        "jsm-l8",
        "jsm-l9",
        "jsm-l10"
      ]
    },
    {
      "key": "build",
      "name": "第四章 · 打包与工程",
      "lessons": [
        "jsm-l11",
        "jsm-l12",
        "jsm-l13"
      ]
    },
    {
      "key": "practice",
      "name": "第五章 · 最佳实践与发布",
      "lessons": [
        "jsm-l14",
        "jsm-l15",
        "jsm-l16",
        "jsm-l17"
      ]
    },
    {
      "key": "impl",
      "name": "第六章 · 模块系统源码实现",
      "lessons": [
        "jsm-l18",
        "jsm-l19",
        "jsm-l20"
      ]
    },
    {
      "key": "migrate",
      "name": "第七章 · 演进全景与迁移实战",
      "lessons": [
        "jsm-l21",
        "jsm-l22",
        "jsm-l23"
      ]
    }
  ]
}

export const jsmLessons = [
  {
    "id": "jsm-l1",
    "chapter": "history",
    "title": "为什么需要模块化？从 script 标签说起",
    "minutes": 25,
    "content": "### 本节目标\n\n- 理解「没有模块化」时全局变量互相污染的问题\n- 看 `script` 标签按顺序加载的脆弱性\n- 建立「模块 = 独立作用域 + 明确依赖」的认知\n\n早期 JS 把所有代码塞进几个 `<script>`，变量全是全局的。两个文件都定义 `name`，后面覆盖前面，bug 难以定位。\n\n```js\n// 运行环境：浏览器（或 Node 16+ 用 var 演示，见下）\n// 演示「全局污染」：两段脚本共享全局作用域\nvar name = 'A'        // 脚本1\n// ... 另一文件 ...\nvar name = 'B'        // 脚本2 不小心覆盖了 name，且不会报错！\nconsole.log(name)     // 'B'，但脚本1作者以为还是 'A'\n\n// 用「函数作用域」隔离是最朴素的模块化雏形\nfunction moduleUser() {\n  var name = 'A'      // 现在 name 只在函数内可见，外面碰不到\n  return name\n}\n```\n\n**模块化的本质目标**就两条：① 每个文件有**独立作用域**，不互相污染；② 文件之间用**显式 `import/export`** 声明依赖，而不是偷偷读全局。\n\n### 名词解释\n\n**全局作用域（Global Scope）**：不写在任何函数/模块里的变量，谁都能访问、谁都能改。它是「变量污染」的温床——早期多脚本项目里，两个文件同名变量会静默覆盖。模块化首先要消灭的就是「无意识共享全局」。\n\n**模块（Module）**：一个「有边界的代码单元」。它有自己的作用域（内部变量不外泄），并通过 `export` 主动暴露、用 `import` 主动引入别人。模块让「依赖关系」从「隐含（都读全局）」变成「显式（写在代码顶部）」，可读性、可维护性质的飞跃。\n\n### 课后练习\n\n**练习 1**：下面哪种写法能避免 `name` 被别的脚本覆盖？\n\n```js\n// 写法A： var name = 'A'\n// 写法B： (function(){ var name = 'A' })()\n```\n> 答案：写法 B。IIFE（立即执行函数）创建独立作用域，`name` 不会泄漏到全局，别的脚本定义自己的 `name` 也不会冲突。这是模块化前最常用的人工隔离手段。\n\n**练习 2**：为什么说「显式依赖」比「读全局」更好维护？\n\n> 答案：显式 `import` 让你一眼看清「这个文件依赖谁」；改一个模块，能立刻知道谁受影响。读全局则依赖关系散落在代码各处，重构时根本不知道改一处会波及哪里。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n我的观点：模块化不是「语法糖」，是「工程规模化的必然」。当你只有 200 行代码时，全局变量确实爽；但项目到 2 万行、10 个人协作时，全局污染和隐式依赖会让你每天救火。模块化的价值，本质是**把「靠约定、靠记忆」变成「靠语法、靠工具」**——作用域隔离靠语法强制，依赖关系靠 import 显式声明。理解了这点，你再看 ESM/CJS 的种种规则，就不会觉得是束缚，而是保护。"
  },
  {
    "id": "jsm-l2",
    "chapter": "history",
    "title": "模块化发展史：IIFE / AMD / CMD / UMD",
    "minutes": 30,
    "content": "### 本节目标\n\n- 看懂 IIFE、AMD、CMD、UMD 各自解决什么时代的问题\n- 理解「为什么有了它们还需要 ESM」\n- 能识别老项目里这几种模式\n\n模块化是「被需求一步步逼出来」的：\n\n```js\n// 1) IAFE/IIFE：用函数作用域隔离（最原始）\nvar counter = (function () {\n  var n = 0\n  return { inc() { return ++n } }   // 只暴露 inc，n 私有\n})()\n\n// 2) AMD（RequireJS）：浏览器里「异步按需加载」模块\n// define(['dep'], function (dep) { return {...} })\n// 适合早期浏览器没有原生模块、又要按需加载大应用\n\n// 3) CMD（SeaJS）：就近依赖，写法更像 CommonJS\n// define(function(require, exports){ var a = require('./a') })\n\n// 4) UMD：一套代码同时兼容 AMD / CommonJS / 全局\n// (function(root, factory){\n//   if (typeof define==='function'&&define.amd) define([], factory)\n//   else if (typeof module!=='undefined') module.exports = factory()\n//   else root.MyLib = factory()\n// })(this, function(){ return {...} })\n```\n\n**为什么还需要 ESM**：AMD/CMD 是「社区规范」，语法不统一、要运行时加载器；ESM 是**语言标准**，静态可分析、能被打包器优化（Tree Shaking），最终一统江湖。\n\n### 名词解释\n\n**IIFE（立即执行函数表达式）**：`(function(){...})()` 这种「定义完立刻调用」的函数。它的价值是「制造一个独立作用域」，在 ES 模块出现前，是前端做「私有变量」的唯一办法。模块化史上的第一个台阶。\n\n**AMD / CMD / UMD**：都是 ES 模块之前的社区规范。AMD 主打「浏览器异步加载」，CMD 主打「就近依赖写法」，UMD 主打「全兼容打包」。它们共同的历史使命是「在语言没原生模块时，先解决模块化」，现在基本被 ESM 取代，但老项目里仍常见，认得出即可。\n\n### 课后练习\n\n**练习 1**：UMD 为什么要同时判断 `define.amd` 和 `module.exports`？\n\n> 答案：为了「一套源码到处用」：在 AMD 环境（有 `define.amd`）走 AMD 分支；在 Node/CommonJS 环境（有 `module`）走 CJS 分支；都不在就挂到全局 `root` 上。UMD 是「最大兼容性」妥协产物。\n\n**练习 2**：为什么「异步加载」是浏览器模块早期的核心需求？\n\n> 答案：浏览器 `<script>` 默认同步加载、阻塞页面；早期大应用若一次性同步加载所有模块，首屏极慢。AMD 的「按需异步加载」能让首屏只加载必要的，点哪加载哪——这是当时性能刚需，直到 ESM + 打包器普及才被更好解决。\n\n### 总结\n\n我的看法：学模块化发展史不是为了怀旧，而是为了**看懂你接手的老项目**。今天你大概率不会新写 AMD，但维护祖传代码时认得 `define()`、`UMD` 包裹，能少走很多弯路。更深的体会是：技术规范的演进永远是被「当时的痛点」推动的——IIFE 解决污染、AMD 解决加载、ESM 解决「统一+可优化」。理解每条规范的「它解决了什么」，比背语法有用。结论是：新项目无脑 ESM，老项目认规范、别慌。"
  },
  {
    "id": "jsm-l3",
    "chapter": "history",
    "title": "规范现状：CommonJS 与 ESM",
    "minutes": 25,
    "content": "### 本节目标\n\n- 分清 CommonJS（CJS）和 ES Module（ESM）的适用场景\n- 理解「CJS 是运行时加载、ESM 是编译期静态」\n- 知道 Node 和浏览器各自怎么支持\n\n```js\n// CommonJS（Node 默认，运行时加载，语法是 require/exports）\nconst fs = require('fs')\nmodule.exports = function () {}\n\n// ES Module（浏览器 + Node 都支持，静态加载，语法是 import/export）\nimport fs from 'fs'\nexport default function () {}\n\n// UMD：上面说过，全兼容，但已过时，新项目别用\n```\n\n**核心区别**：\n- CJS `require` 是**运行时**才执行、能写进 `if` 里动态决定；ESM `import` 是**静态**的，必须在顶层、编译期就确定依赖（便于打包器提前分析、Tree Shaking）。\n- ESM 有「实时绑定（live binding）」，导入的值随导出方变化；CJS 导出的是值的**快照拷贝**。\n\n**现状**：前端工程（Vite/Webpack）里你写 ESM，打包器把它转成浏览器能跑的；Node 后端默认还是 CJS，但加 `\"type\":\"module\"` 也能写 ESM。\n\n### 名词解释\n\n**CommonJS（CJS）**：Node.js 采用的模块规范，用 `require` 引入、`module.exports` 导出。特点是「运行时加载」——代码执行到 `require` 才去加载模块，因此能写条件加载。它是服务端模块的王者，但静态分析能力弱。\n\n**ES Module（ESM）**：JS 语言标准的模块系统，用 `import`/`export`。特点是「静态可分析」——依赖在代码顶层写死、编译期可知，于是打包器能做 Tree Shaking、IDE 能精准跳转。它是浏览器和现代前端的统一标准。\n\n### 课后练习\n\n**练习 1**：为什么「`if (x) require('a')` 合法，但 `if (x) import 'a'` 不合法」？\n\n> 答案：CJS 的 `require` 是普通函数调用，运行时执行，当然能写进 `if`；ESM 的 `import` 是静态语法，引擎要求在编译期就固定依赖图，不能出现在条件/函数里。这正是「静态 vs 运行时」的区别落地。\n\n**练习 2**：Node 里如何让一个 `.js` 文件按 ESM 解析？\n\n> 答案：两种：① 文件后缀用 `.mjs`；② 在 `package.json` 写 `\"type\": \"module\"`，则该目录下 `.js` 都按 ESM 解析。否则 Node 默认按 CJS 解析 `.js`。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n我的观点：CJS 和 ESM 不是「谁取代谁」的敌对关系，而是「各自主场」。服务端脚本、CLI 工具用 CJS 很顺手（动态 require 灵活）；前端工程、库源码用 ESM（能被打包器优化、写法统一）。关键是别混用出 `default` 陷阱（见后面章节）。新项目我一律推荐 ESM 作为源码格式，哪怕最终跑在 Node 上——它的静态特性让工具链更聪明，长期收益明显。记住区分一句话：CJS 运行时、ESM 编译期。"
  },
  {
    "id": "jsm-l4",
    "chapter": "cjs",
    "title": "module.exports / exports / require",
    "minutes": 30,
    "content": "### 本节目标\n\n- 彻底搞懂 `module.exports` 与 `exports` 的关系（经典坑）\n- 理解 `require` 怎么拿到导出\n- 会写正确的 CJS 模块与调用\n\nNode 里每个模块都有 `module` 对象，`module.exports` 才是真正「被导出」的东西；`exports` 只是 `module.exports` 的一个**引用**。\n\n```js\n// 运行环境：Node.js 16+（保存为 .cjs 直接 node 运行）\n// math.cjs —— 一个 CJS 模块\n// exports 是 module.exports 的别名（同一块内存）\nexports.add = function (a, b) { return a + b }\n// 等价于：\n// module.exports.add = function (a, b) { return a + b }\n\n// main.cjs —— 引入并使用\nconst math = require('./math.cjs')\nconsole.log(math.add(1, 2)) // 3\n\n// ⚠️ 经典坑：直接给 exports 赋值会断掉引用\n// exports = function(){}   // 错误！exports 不再指向 module.exports\n// ✅ 正确：要给整个模块换导出，用 module.exports\nmodule.exports = function sub(a, b) { return a - b }\n```\n\n**关键**：`require('./x')` 返回的就是 `module.exports` 指向的那个对象/函数。`exports.xxx = ...` 是在「往那个对象上加属性」；`exports = ...` 只是让局部变量 `exports` 指向别处，不影响 `module.exports`。\n\n### 名词解释\n\n**module.exports**：Node 里「模块真正对外暴露的东西」。`require` 调用得到的就是它。`exports` 是它的快捷别名。要整体替换导出（导出一个函数/类而非对象），必须赋值给 `module.exports`，不能只动 `exports`。\n\n**require**：CJS 的「导入函数」。传入模块路径，返回该模块的 `module.exports`。它是同步的、运行时的：调用时才加载并执行目标模块，且结果会被缓存（同一进程第二次 require 拿到同一份）。理解 `require` 返回什么，关键是盯住对方的 `module.exports`。\n\n### 课后练习\n\n**练习 1**：下面 `require('./x')` 得到什么？\n```js\n// x.cjs\nexports = { a: 1 }\nmodule.exports = { b: 2 }\n```\n> 答案：得到 `{ b: 2 }`。因为 `exports = ...` 只是改了局部别名，不改变 `module.exports`；真正导出的是 `module.exports`，即 `{ b: 2 }`。这是新手最常踩的坑。\n\n**练习 2**：`exports.add = fn` 和 `module.exports = { add: fn }` 两种写法，调用方有区别吗？\n\n> 答案：调用方无区别，都通过 `require('./x').add` 访问。区别在「语义」：前者是「往默认导出对象上挂属性」（适合多导出），后者是「整体替换为新对象」。注意不要混用导致前面挂的属性丢失（整体替换会覆盖）。\n\n### 总结\n\n`exports` vs `module.exports` 是 Node 入门第一坑，我的建议简单粗暴：**永远用 `module.exports`**，别碰 `exports` 这个别名。别名存在的唯一理由是「少打几个字」，但它带来的「赋值断引用」坑远大于那点便利。我写 CJS 一律 `module.exports = {...}` 或 `module.exports = fn`，从根上避开混乱。理解本质就一句：`require` 拿的是 `module.exports`，`exports` 只是它的影子，影子指歪了不影响本体，但你也别指望改影子能改本体。记牢这点，CJS 的导出你就彻底通透了。"
  },
  {
    "id": "jsm-l5",
    "chapter": "cjs",
    "title": "require 加载过程：缓存与路径解析",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解 `require` 的「路径解析」规则（相对/绝对/node_modules）\n- 理解「模块缓存」机制与它的双刃剑\n- 会用 `require.cache` 做热重载\n\n`require` 加载分两步：解析路径 → 执行模块 → 缓存结果。\n\n```js\n// 运行环境：Node.js 16+（保存为 .cjs）\n// 1) 路径解析优先级：\n//    require('./a')   相对路径，找 a.js / a/index.js / a.json\n//    require('lodash') 非相对 → 从当前目录向上找 node_modules/lodash\n//    require('/abs/a') 绝对路径\n\n// 2) 缓存：同一模块同进程只执行一次\n// counter.cjs\nlet n = 0\nmodule.exports = { tick() { return ++n } }\n\n// main.cjs\nconst a = require('./counter.cjs')\nconst b = require('./counter.cjs') // 不会重新执行，b 和 a 是同一份\nconsole.log(a.tick(), b.tick())    // 1 2（共享同一个 n）\n\n// 3) 强制重新加载（热重载技巧）：删掉缓存再 require\ndelete require.cache[require.resolve('./counter.cjs')]\nconst c = require('./counter.cjs')  // 这次重新执行，n 归零\nconsole.log(c.tick())               // 1\n```\n\n**双刃剑**：缓存让重复 require 很快，但也意味着「模块顶层只跑一次」——如果你的模块有副作用（连数据库、起定时器），它会持久存在。\n\n### 名词解释\n\n**模块缓存（Module Cache）**：Node 把「已加载模块的导出」存在 `require.cache` 里，同进程内再次 `require` 同一路径直接返回缓存，不重新执行文件。它像「备忘录」：第一次算完记下来，以后直接抄答案。好处是性能，代价是「模块顶层的副作用只发生一次」。\n\n**路径解析（Resolution）**：`require` 把「你写的路径」翻译成「磁盘上的真实文件」。相对路径（`./`）从当前文件找； bare 名（`lodash`）从 `node_modules` 向上找；绝对路径直接定位。理解解析顺序，才能解释「为什么 require 一个名字就能找到装在 node_modules 的包」。\n\n### 课后练习\n\n**练习 1**：为什么「改了被 require 的模块文件，程序却没生效」？\n\n> 答案：因为 `require.cache` 里还存着旧的导出，Node 不会重新读文件。开发时要「重启进程」或删 `require.cache` 对应项才能加载新代码。这也是为什么 Node 开发离不开 `nodemon` 之类热重启工具。\n\n**练习 2**：`require('lodash')` 为什么不用写 `./` 或完整路径？\n\n> 答案：没有 `./`/`../`/`/` 前缀的 bare 标识符，Node 走「node_modules 解析」：从当前目录逐级向上找 `node_modules/lodash`，找到包入口（package.json 的 main/exports）。这是 npm 包能被「按名引入」的机制。\n\n### 总结\n\n缓存是 Node 模块系统里最容易被忽视、却影响最大的机制。我的观点：理解缓存，你才真正理解「Node 模块为什么是单例」。很多诡异 bug（配置改了不生效、单例状态串了）根因都在缓存。我的实践：写「纯函数模块」时把状态留在调用方，别塞模块顶层，这样缓存带来的单例性不会咬你；写「有副作用的模块」（连接、定时器）要清楚它只初始化一次。热重载/测试时，`delete require.cache[require.resolve(x)]` 是你的标准逃生阀。一句话：缓存让快，也让你必须想清「模块顶层只跑一次」意味着什么。"
  },
  {
    "id": "jsm-l6",
    "chapter": "cjs",
    "title": "CJS 循环依赖：为什么会拿到半成品",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用可运行代码演示 CJS 循环依赖拿到「半成品」\n- 理解根因：CJS 导出是「值的拷贝 + 缓存」\n- 知道怎么规避（重构/延迟 require）\n\n循环依赖：A 依赖 B，B 又依赖 A。CJS 下容易拿到「还没初始化完」的半成品。\n\n```js\n// 运行环境：Node.js 16+（保存三个 .cjs 文件后运行 main.cjs）\n// a.cjs\nexports.foo = 'foo from a'\nconst b = require('./b.cjs')   // 此时 b 正在初始化中\nexports.bar = 'bar from a, b.hello=' + (b && b.hello)\n// b.cjs\nexports.hello = 'hello from b'\nconst a = require('./a.cjs')   // a 此时只执行了一半，a.bar 还没赋值\nexports.afoo = a.foo           // 'foo from a'（a.foo 已设）\nexports.abar = a.bar           // undefined！因为 a 还没执行到设置 bar 那行\n// main.cjs\nconst a = require('./a.cjs')\nconst b = require('./b.cjs')\nconsole.log('b.abar =', b.abar) // undefined —— 拿到了半成品\n```\n\n**根因**：CJS 是「执行到 require 才加载」，且导出是「值拷贝」。当 A 执行到 `require(B)`，B 又回头 `require(A)` 时，A 还没跑完，B 拿到的是 A 当前已导出的部分（缺 `bar`），于是 `undefined`。\n\n**规避**：① 重构让依赖单向；② 把「需要对方导出」的逻辑放进函数，延迟到调用时再 `require`（此时双方都初始化完了）。\n\n### 名词解释\n\n**循环依赖（Circular Dependency）**：两个模块互相 require（A 引 B，B 引 A）。它不一定是错误，但会让「初始化顺序」变得微妙。CJS 下因为「运行时执行 + 值拷贝」，容易出现「一方读到另一方未完成状态」。\n\n**半成品（Partial Export）**：循环依赖时，被回头 require 的模块只执行了一部分，已 `exports.xxx` 的属性有、没执行到的没有。调用方拿到一个「残缺对象」。这是 CJS 循环依赖最经典的坑，表现为「明明导出了却 undefined」。\n\n### 课后练习\n\n**练习 1**：上面例子里为什么 `b.afoo` 有值而 `b.abar` 是 undefined？\n\n> 答案：执行顺序：main → require(a) → a 设了 `foo` → a require(b) → b 设了 `hello` → b require(a)（命中缓存，此时 a 只设了 `foo`，`bar` 还没设）→ b 读 `a.foo` 有值、`a.bar` 还没赋值所以 undefined。顺序决定了一切。\n\n**练习 2**：怎么改能避免拿到 undefined？\n\n> 答案：把「读 a.bar」的逻辑延后。比如 b 里不立即 `a.bar`，而是导出一个函数 `getAbar(){ return a.bar }`，等所有模块初始化完、真正调用时 a.bar 已就绪。或者重构去掉循环（把共享逻辑抽到第三个模块 c）。\n\n### 总结\n\nCJS 循环依赖的坑，本质是「运行时执行顺序」和「值拷贝」叠加的副产品。我的观点：**循环依赖本身是代码坏味道，能重构去掉就去掉**。如果实在去不掉（比如两个模块都要用对方的一个工具函数），最稳的解法是「延迟 require」——把跨模块的读取放进函数体内，调用时才取，那时双方都初始化完毕。千万别在模块顶层就急着用对方的导出。另外对比 ESM 的 live binding（下节），CJS 这个坑更隐蔽，因为错误只在运行时偶发暴露。记住铁律：模块顶层只该做「无依赖的初始化」和「导出」，跨模块的读取留给函数。"
  },
  {
    "id": "jsm-l7",
    "chapter": "esm",
    "title": "import / export 语法与静态分析",
    "minutes": 25,
    "content": "### 本节目标\n\n- 掌握 ESM 的 `import`/`export` 全部写法\n- 理解「静态」带来的好处（编译期可知依赖）\n- 区分「命名导出」与「默认导出」\n\n```js\n// 运行环境：Node.js 16+（保存为 .mjs 或开 type:module）\n// math.mjs —— 命名导出（推荐，可多个）\nexport const add = (a, b) => a + b\nexport function mul(a, b) { return a * b }\nconst secret = 1 // 没 export，外部拿不到（私有）\n\n// 默认导出（一个模块只能一个）\nexport default function main() {}\n\n// 导入方\nimport main, { add, mul } from './math.mjs' // 默认 + 命名解构\nimport * as Math from './math.mjs'          // 整体导入为命名空间\nconsole.log(add(1, 2), mul(2, 3), main)\n\n// ⚠️ 静态：import 必须顶层，不能写进 if\n// if (x) import './a.mjs'  // ❌ 语法错误\n```\n\n**为什么「静态」好**：因为依赖在编译期就全确定了，打包器（Vite/Webpack）能提前画好「模块图」，做 Tree Shaking（删掉没用到的导出），IDE 能精准跳转到定义。这是 ESM 碾压 CJS 的工程优势。\n\n### 名词解释\n\n**命名导出（Named Export）**：`export const/add/function` 这种「带名字的导出」，一个模块可以有多个。导入时用 `{ name }` 解构对应名字。它比默认导出更利于 Tree Shaking（因为名字明确，没用到的能删）。\n\n**静态分析（Static Analysis）**：在不「运行代码」的前提下，仅靠读源码就能确定信息（如「这个模块 import 了谁」）。ESM 的 import 是静态语法，所以工具能在编译期分析依赖。这正是 Tree Shaking、类型检查、重构安全的前提。CJS 的 require 是运行时调用，做不到这点。\n\n### 课后练习\n\n**练习 1**：`import x from './m'` 和 `import { x } from './m'` 区别？\n\n> 答案：前者取「默认导出」`export default` 的值（名字 x 随意）；后者取「命名导出」`export const x` 的值（名字必须匹配）。混用是常见错误来源。\n\n**练习 2**：为什么 ESM 能做 Tree Shaking 而 CJS 很难？\n\n> 答案：ESM 导出是静态、命名的，打包器编译期就知道「哪些命名导出没被任何人 import」，整段删掉；CJS 的 `module.exports` 是运行时对象，没法静态判断某个属性会不会被用，只能保守保留。静态是 Tree Shaking 的前提。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\nESM 的语法我建议「默认导出能免则免，命名导出为主」。我的观点：命名导出（`export const fn`）让每个导出都有名字，配合 Tree Shaking 和 IDE 跳转体验最好；`export default` 虽然省事，但一个模块多个 `default` 装进一个匿名值，重构和静态分析都吃亏。静态性是 ESM 的灵魂——它把「依赖关系」变成编译期可知的事实，这才有了现代前端工程的速度（Tree Shaking 让打包体积小一大截）。一句话：写 ESM 时想着「工具要靠静态分析帮你」，你的写法就会更友好。"
  },
  {
    "id": "jsm-l8",
    "chapter": "esm",
    "title": "ESM 解析与加载：模块图与后序执行",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解 ESM 的「解析 → 实例化 → 求值」三阶段\n- 理解「模块图（Module Graph）」与「后序执行」\n- 知道为什么「导入的变量在模块顶层可用」\n\nESM 加载分三步：**解析**（建模块图、确定依赖）、**实例化**（分配内存、建立 live binding）、**求值**（自底向上执行模块体）。\n\n```text\n入口 main.mjs\n ├─ import a.mjs   ─┐\n ├─ import b.mjs   ─┤ 这些依赖先解析\n依赖 a 又 import c.mjs ┘\n\n执行顺序（后序）：c → a → b → main\n（被依赖的先执行完，依赖方最后执行）\n```\n\n可运行示意：用 `console.log` 看执行顺序。\n\n```js\n// 运行环境：Node.js 16+（.mjs），观察打印顺序\n// c.mjs\nconsole.log('c 执行')\nexport const c = 1\n// a.mjs\nimport { c } from './c.mjs'\nconsole.log('a 执行, 读到 c=', c)\nexport const a = c + 1\n// main.mjs\nimport { a } from './a.mjs'\nconsole.log('main 执行, 读到 a=', a)\n// 输出：c 执行 → a 执行,读到 c=1 → main 执行,读到 a=2\n```\n\n**要点**：ESM 先「把整张依赖图解析并实例化」再「自底向上求值」，所以 `main` 执行时，它依赖的 `a`、`c` 早跑完了，顶层就能用到它们的值。\n\n### 名词解释\n\n**模块图（Module Graph）**：所有模块按「谁 import 谁」连成的有向图。入口是根，被依赖的是子节点。打包器和引擎都先构建这张图，才知道加载/执行顺序。它像一张「家谱」，清楚显示模块间的血缘。\n\n**后序执行（Post-order）**：「被依赖的先执行，依赖方后执行」。因为依赖方顶层要用到被依赖方导出的值，所以必须等底层就绪。ESM 用「先实例化建 binding、再自底向上求值」保证这点，这也是它循环依赖比 CJS 稳的原因（见下节）。\n\n### 课后练习\n\n**练习 1**：为什么 `main.mjs` 顶层就能用 `a`，而不会像 CJS 拿到半成品？\n\n> 答案：ESM 在「求值」前先完成「实例化」：把所有模块的导出/导入槽位连成 live binding，再自底向上执行。等 `main` 开始执行时，`a` 所在模块早已跑完并填好 binding，所以 `main` 顶层读到的 `a` 是完整值。\n\n**练习 2**：模块图如果有环（A↔B），执行顺序怎么定？\n\n> 答案：引擎用「后序 + 已访问标记」避免无限循环：每个模块只实例化/求值一次，遇到环里已访问的节点就跳过。于是环里每个模块至少能拿到「已实例化好的 binding」（虽未求值完），靠 live binding 补齐，比 CJS 半成品友好（见 jsm-l9）。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\nESM 三阶段（解析→实例化→求值）看着抽象，实则是「为了稳定」精心设计的。我的观点：理解「后序执行」能解释前端 90% 的「为什么我的 import 能用」——因为引擎保证了「你依赖的一定先跑完」。对比 CJS 的「运行时碰到才加载」，ESM 的「先建图再执行」更可预测、更安全。这也是为什么现代打包器能放心做静态优化：整张图在编译期就透明了。结论：ESM 不是「把 require 换个写法」，而是一套「先规划后执行」的更稳模型，循环依赖的坑也由此变小。"
  },
  {
    "id": "jsm-l9",
    "chapter": "esm",
    "title": "ESM 循环依赖：live binding 为什么能救",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解 ESM 的「实时绑定（live binding）」是什么\n- 用代码对比 ESM 循环依赖比 CJS 友好在哪\n- 知道 live binding 的「坑」仍在（函数 vs 值）\n\nESM 导出不是「值的拷贝」，而是「绑定」——导入方读到的永远是导出方**当前**的值。这正是它能在循环依赖下比 CJS 稳的根本原因，但要用对姿势。\n\n先给一个**能真正跑通**的循环依赖例子（入口是 a.mjs）：\n\n```js\n// 运行环境：Node.js 16+，入口命令 node a.mjs\n// a.mjs（入口）\nexport let count = 0\nexport function inc() { count++ }\n\n// 引入 b：会先去执行 b.mjs。b 只在函数里引用 count，顶层不碰，所以安全\nimport { reportFromB } from './b.mjs'\n\nconsole.log('a: 初始化完成，count =', count) // 0\ninc()\nconsole.log('a: inc 后，count =', count)     // 1\nreportFromB()                                // b 通过 live binding 看到 1，还能把它推到 2\n```\n\n```js\n// b.mjs\nimport { count, inc } from './a.mjs'\n\n// 关键：b 顶层不直接读 count。因为 a 先 import 了 b，b 会在 a 的 let count=0 执行前被求值，\n// 那时 count 还在 TDZ（暂时性死区），顶层访问会直接抛 ReferenceError。\n// 所以把「读取 a 的状态」放进函数，等 a 初始化完再调用。\nexport function reportFromB() {\n  console.log('b: 看到 a.count =', count) // 1（live binding，实时值）\n  inc()                                   // b 也能改 a 的 count\n  console.log('b: inc 后 a.count =', count) // 2\n}\n```\n\n运行 `node a.mjs` 输出：\n\n```text\na: 初始化完成，count = 0\na: inc 后，count = 1\nb: 看到 a.count = 1\nb: inc 后 a.count = 2\n```\n\n**为什么能跑通**：a 是入口，ESM 先解析并求值它的 import（也就是 b）。b 只「定义」了 `reportFromB`，没有在顶层碰 `count`，平安度过 TDZ；等 a 跑完 `let count = 0`、又 `inc()` 把 count 改成 1 之后，再调 `reportFromB()`，b 读到的就是「实时值 1」，甚至还能继续 `inc()` 推到 2——这就是 live binding 的威力。\n\n**与 CJS 对比**：CJS 的 `require` 拿到的是 `module.exports` 那一刻的「快照」，a 改了 b 看不到；ESM 是「活的链接」，a 改 b 实时看到。所以循环依赖下 ESM 几乎不会出现 CJS 那种「半成品 undefined」。\n\n**仍有坑**：live binding 救了「值同步」，但「执行顺序」仍是后序——如果 b 在**自己初始化阶段（顶层）**就急用 a 的某个「还没执行到的导出」，照样 TDZ 抛错（上面 b.mjs 的注释就是踩坑点）。所以「跨模块取值延迟到函数里」仍是铁律，跟 CJS 循环依赖的最佳实践一致。\n\n### 名词解释\n\n**实时绑定（Live Binding）**：ESM 导入的变量不是「值的副本」，而是「指向导出方内存的链接」。导出方改了，导入方下次读自动是最新值——像共享同一块内存。这正是 ESM 循环依赖比 CJS（值拷贝）稳的核心：双方始终看到彼此的实时状态，不会被「拷贝时的旧值」坑。\n\n**值拷贝 vs 绑定**：CJS `require` 拿到的是 `module.exports` 那一刻的快照（之后对方改了你看不到）；ESM `import` 拿到的是活的链接（对方改你实时看到）。一句话区别：「CJS 拍照，ESM 连监控」。\n\n### 课后练习\n\n**练习 1**：ESM 下「循环依赖」就绝对安全吗？\n\n> 答案：比 CJS 安全，但不绝对。live binding 保证「值实时同步」，但「执行顺序」仍是后序——如果模块顶层（初始化阶段）就急用对方「尚未执行到的导出」，仍可能读到未初始化值。所以「跨模块读取放进函数、延迟调用」依然是最佳实践。\n\n**练习 2**：为什么 ESM 里 `import { count } from './a'` 之后，a 里 `count++` 能在 b 看到？\n\n> 答案：因为 `count` 在 b 里是「指向 a 的 count 的 live binding」，不是拷贝。a 执行 `count++` 改的是那块共享内存，b 下次读自然是最新值。CJS 则拷贝了旧值，看不到变化。\n\n### 总结\n\nlive binding 是 ESM 最优雅的设计，也是它「循环依赖比 CJS 友好」的根本原因。我的观点：但别因此就觉得「ESM 循环依赖随便写」——live binding 解决的是「值同步」，没解决「执行顺序」。如果你在模块顶层就急吼吼用对方的导出，而对方还没初始化到那一行，照样踩雷。所以黄金法则不变：**模块顶层只做导出和无依赖初始化，跨模块的取值留给函数**。ESM 把循环依赖从「必炸」降级为「小心就稳」，但好的架构仍然是「尽量让依赖单向」。工具帮你兜底，不等于你可以乱来。"
  },
  {
    "id": "jsm-l10",
    "chapter": "esm",
    "title": "CJS 与 ESM 互操作：default 陷阱",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解「CJS 混用 ESM」时 `default` 的坑\n- 知道 `import x from 'cjs'` 拿到的是 `module.exports` 整体\n- 会正确从 ESM 引入 CJS 包\n\n当你在 ESM 里 `import` 一个 CJS 包，Node 会把 `module.exports` 整个当成「default 导出」。\n\n```js\n// 运行环境：Node.js 16+（.mjs 引入 .cjs）\n// legacy.cjs\nmodule.exports = { add(a, b) { return a + b } }\n// 也常见：module.exports = function(){}  （导出函数本身）\n\n// consumer.mjs\nimport pkg from './legacy.cjs'   // pkg === module.exports（整个对象）\n// 注意：CJS 没有「命名导出」，所以不能 import { add } from './legacy.cjs'\n//       （除非该包同时提供 ESM 构建 / 有 exports 字段映射）\nconsole.log(pkg.add(1, 2))       // 3\n\n// 反向：CJS 引入 ESM 只能动态（ESM 是静态异步）\n// async function f(){ const m = await import('./m.mjs'); m.add(1,2) }\n```\n\n**default 陷阱**：很多库文档写 `import axios from 'axios'`，是因为 axios 是 CJS，`default` 就是 `module.exports`。如果你自己写库，想让 ESM 用户能 `import { add }`，最好同时发 ESM 构建或用 `exports` 字段区分。\n\n### 名词解释\n\n**default 陷阱**：CJS 模块没有「命名导出」概念，它的整个 `module.exports` 在 ESM 里被当作 `default`。于是 ESM 侧只能用 `import pkg from 'cjs'`（拿整体），不能 `import { x } from 'cjs'`（除非包做了 ESM 适配）。新手常写 `import { add }` 去引 CJS 包而报错，根因在此。\n\n**互操作（Interop）**：让「不同模块系统（CJS/ESM）能互相 import」。Node 通过「把 CJS 的 module.exports 映射成 ESM 的 default」实现单向兼容；ESM 引入 CJS 用静态 import 即可，CJS 引入 ESM 必须用动态 `import()`（因为 ESM 是异步的）。理解这条边界，混用就不慌。\n\n### 课后练习\n\n**练习 1**：为什么 `import { add } from 'some-cjs-pkg'` 常报错？\n\n> 答案：CJS 包只有 `module.exports`（被当作 ESM 的 default），没有命名导出。`import { add }` 想取「命名导出 add」，但 CJS 没提供，于是 undefined/报错。正确写法是 `import pkg from 'some-cjs-pkg'; pkg.add(...)`，或换用该包的 ESM 版本。\n\n**练习 2**：CJS 怎么引入一个 ESM 模块？\n\n> 答案：CJS 里 `require()` 是同步的，而 ESM 加载是异步的，不能直接 `require('esm')`。必须用动态 `import()`：`const m = await import('./m.mjs')`，且该函数需处于 async 上下文。这是「同步系统引不动异步系统」的必然限制。\n\n### 总结\n\n互操作是「历史包袱」带来的现实问题，我的态度是：**新代码一律 ESM，老 CJS 依赖就当黑盒用 default 引入**。别试图在 ESM 里 `import { x }` 去抠 CJS 包的命名导出——它根本没那东西，只会报错。如果你自己发库，想被两边都舒服地使用，最佳实践是「同时提供 ESM 构建 + 在 package.json 用 `exports` 字段按环境分发」（见 jsm-l13）。结论：混用不可怕，可怕的是不清楚「CJS 只有 default」。记住 `import pkg from 'cjs'` 这个姿势，能省你无数调试时间。"
  },
  {
    "id": "jsm-l11",
    "chapter": "build",
    "title": "打包器原理：模块图与 bundle 结构",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解打包器（Webpack/Vite）把「多个模块」合成「一个 bundle」的原理\n- 看懂 bundle 里「模块数组 + 启动函数」的结构\n- 建立「源码模块 → 模块图 → 单文件」的心智\n\n打包器做的事：从入口出发，按 import 画出模块图，把每个模块变成「一个函数」塞进数组，最后用一个小启动函数把它们串起来。\n\n```js\n// 运行环境：Node.js 16+（这是「打包产物」的极简示意，非真实配置）\n// 源码：main.js import { add } from './math.js'\n// 打包后（示意）：\nconst __modules = {\n  './math.js': function (module, exports, require) {\n    module.exports = { add: (a, b) => a + b }\n  },\n  './main.js': function (module, exports, require) {\n    const { add } = require('./math.js')\n    console.log(add(1, 2))\n  }\n}\nfunction require(id) {\n  const m = { exports: {} }\n  __modules[id](m, m.exports, require)\n  return m.exports\n}\nrequire('./main.js')\n```\n\n**价值**：浏览器只需下载「一个 JS 文件」，不用几十次请求；还能做压缩、Tree Shaking。Vite 开发时用原生 ESM（快），生产时用 Rollup 打包（小）。\n\n### 名词解释\n\n**打包器（Bundler）**：把「项目里分散的多个模块文件」分析依赖、合并成「少量（通常一个）浏览器能直接跑的文件」的工具，如 Webpack、Rollup、Vite（底层用 Rollup）。它解决「浏览器原生加载几十个模块太慢」的问题，并顺带做压缩、Tree Shaking。\n\n**模块图（再次出现）**：打包器第一步就是「从入口按 import 画出完整依赖图」，然后「每个模块→一个函数」塞进一个大对象，启动函数按图执行。所以「模块图」既是引擎加载 ESM 的概念，也是打包器的核心数据结构——两者一脉相承。\n\n### 课后练习\n\n**练习 1**：为什么「开发时用 Vite 原生 ESM、生产时 Rollup 打包」？\n\n> 答案：开发时要「改一行立刻生效」，原生 ESM 让浏览器按需加载未打包的源文件，启动快、热更新快；生产时要「体积小、请求少」，Rollup 把全部模块打包压缩成一两个文件。两者各取所长：开发求快，上线求小。\n\n**练习 2**：bundle 里「模块数组 + 启动函数」和 Webpack 产物（jsm 实战课）结构一样吗？\n\n> 答案：思想完全一致：都是「依赖图 → 模块函数数组 → 加载器启动」。具体语法不同（Vite/Rollup 用 ESM 风格、Webpack 用 CJS 风格 `__webpack_require__`），但「集装箱装模块、启动器取货」的骨架相同。看懂一个就懂全部。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n打包器原理拆穿了就是「画图 + 装盒 + 启动」，一点都不神秘。我的观点：理解它最大的价值是**破除对构建工具的敬畏**——你写的 `import` 不是魔法，打包器只是把它们变成「数组里的函数 + 一个加载器」。一旦建立这个心智，遇到「打包后某模块没执行」「路径解析不对」这类问题，你能直接想到「是模块图哪条边断了」而不是瞎猜。现代前端离不开打包器，但它是「 servant 不是 master」：你掌控源码和依赖，它只负责搬运组装。"
  },
  {
    "id": "jsm-l12",
    "chapter": "build",
    "title": "Tree Shaking 与动态 import 分包",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解 Tree Shaking 如何「删掉没用到的导出」\n- 会用「动态 import」做代码分割（按需加载）\n- 知道什么写法会「抖不掉」（副作用）\n\n**Tree Shaking**：打包器分析「哪些导出真的被 import 了」，没用到的整段删除，缩小体积。\n\n```js\n// 运行环境：Node.js 16+（演示 import 拆分，实际 Tree Shaking 看打包结果）\n// utils.mjs\nexport const used = () => '用了'\nexport const unused = () => '没用'   // 如果没人 import unused，打包会被删掉\n\n// 导入时只取 used，unused 会被 Tree Shaking 移除（前提是 ESM 静态、无副作用）\nimport { used } from './utils.mjs'\nconsole.log(used())\n\n// 动态 import：按需加载，生成单独 chunk（分包）\n// 适合「点击后才需要的重型模块」\nasync function onClick() {\n  const heavy = await import('./heavy.mjs') // 运行时才加载这个文件\n  heavy.run()\n}\n```\n\n**会抖不掉的情况**：模块顶层有「副作用」（如 `console.log`、改全局、`import './css'`），打包器不敢删，怕你本来就要它执行。用 `/*#__PURE__*/` 标注纯函数可帮助摇树。\n\n### 名词解释\n\n**Tree Shaking（摇树）**：打包时把「没被任何地方 import 的导出代码」像摇树掉枯叶一样删掉，减小产物体积。前提是 ESM 静态分析（能确定谁用到谁）。它是前端性能优化的大头——一个库导出 100 个函数你只用一个，摇完可能只剩那一个。\n\n**动态 import（Dynamic Import）**：`import('./x.mjs')` 写在函数里、返回 Promise，运行时才加载该模块。它让「不常用的模块」不进首屏包，而是「用到时再下载」，即「代码分割 / 按需加载」。和静态 `import` 不同，它是异步、可条件触发的。\n\n### 课后练习\n\n**练习 1**：为什么 Tree Shaking 要求「ESM + 无副作用」？\n\n> 答案：摇树靠「静态分析确定某导出无人用」然后删除；CJS 的 `module.exports` 是运行时对象，无法静态判断；若模块顶层有副作用（如连库、打日志），删了会改变程序行为，打包器只好保留。所以「纯 ESM + 纯模块」才摇得干净。\n\n**练习 2**：动态 import 和静态 import，在产物上有何不同？\n\n> 答案：静态 import 的模块会被打进「主包」（首屏一起加载）；动态 import 的模块会被单独切成一个 chunk，只有执行到那行（如用户点击）才下载。所以动态 import 是「首屏瘦身」的标准手段。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\nTree Shaking 和动态 import 是现代前端「体积小、首屏快」的两大支柱。我的观点：写库/写模块时，**默认用 ESM 命名导出、保持模块纯净（顶层无副作用）**，就是给 Tree Shaking 铺路——你不经意写的 `console.log` 或顶层副作用，可能让整模块抖不掉。动态 import 则要用在「重且不一定用」的地方（图表库、富文本、二级页面），别滥用到首屏核心逻辑上（反而增加请求数）。一句话：摇树管「删没用的」，分包管「晚加载重的」，两者配合，性能才有保障。"
  },
  {
    "id": "jsm-l13",
    "chapter": "build",
    "title": "package.json exports 字段：入口与封装",
    "minutes": 30,
    "content": "在 Node.js 12.7+ 与现代打包器（Webpack 5、Vite、Rollup、esbuild）中，`package.json` 的 **`exports` 字段（Package Entry Points）** 彻底取代了传统的 `main` 与 `module` 单一入口，提供了**子路径显式封装（Encapsulation）**与**多环境条件导出（Conditional Exports）**两大核心能力。\n\n## 一、 为什么传统的 `main` + `module` 不够用了？\n\n在没有 `exports` 之前，外部使用者可以随意通过深层路径 `import 'my-pkg/lib/internal/secret.js'` 直接引用包内部的私有文件。一旦库作者在次要版本重构了内部目录结构，下游业务就会大面积报错。配置 `exports` 后，**任何未在 `exports` 中显式列出的子路径一律禁止外部导入（抛出 `ERR_PACKAGE_PATH_NOT_EXPORTED`）**，真正实现了包级别的 API 访问控制。\n\n## 二、 现代双包（Dual ESM + CJS）标准 `exports` 配置与 `types` 顺序陷阱\n\n```json\n{\n  \"name\": \"@study/toolkit\",\n  \"version\": \"2.1.0\",\n  \"type\": \"module\",\n  \"main\": \"./dist/index.cjs\",\n  \"module\": \"./dist/index.mjs\",\n  \"types\": \"./dist/index.d.ts\",\n  \"exports\": {\n    \".\": {\n      \"types\": \"./dist/index.d.ts\",\n      \"workerd\": \"./dist/edge.mjs\",\n      \"browser\": \"./dist/browser.mjs\",\n      \"import\": {\n        \"types\": \"./dist/index.d.mts\",\n        \"default\": \"./dist/index.mjs\"\n      },\n      \"require\": {\n        \"types\": \"./dist/index.d.cts\",\n        \"default\": \"./dist/index.cjs\"\n      },\n      \"default\": \"./dist/index.mjs\"\n    },\n    \"./utils/*\": {\n      \"types\": \"./dist/utils/*.d.ts\",\n      \"import\": \"./dist/utils/*.mjs\",\n      \"require\": \"./dist/utils/*.cjs\"\n    },\n    \"./package.json\": \"./package.json\"\n  },\n  \"imports\": {\n    \"#internal/*\": \"./src/internal/*.js\"\n  }\n}\n```\n\n> **核心避坑铁律（面试高频考点）**：条件导出对象中的键名是**按从上到下的声明顺序依次匹配**的！\n> 1. **`\"types\"` 必须永远写在第一位**（高于 `\"import\"`、`\"require\"` 和 `\"default\"`），否则 TypeScript 编译器在解析类型时会先命中 `\"default\"` 指向的 `.js` 文件而忽略类型声明！\n> 2. **`\"default\"` 必须永远写在最后一位**作为兜底分支，写在前面的任何条件若放在 `\"default\"` 之后将永远成为死代码。\n\n## 三、 `imports` 字段：包内部私有子路径映射（`#` 前缀规范）\n\n除了对外暴露的 `exports`，Node.js 与现代打包器还原生支持在 `package.json` 中声明 `\"imports\"` 字段（必须以 `#` 开头，如 `#internal/logger`）。它允许包内部代码摆脱冗长的 `../../../internal/logger.js` 相对路径，且支持按环境切换内部实现（例如在 Node 环境指向 `node:crypto`，在浏览器环境自动指向 Web Crypto 实现）。\n\n## 总结\n\n- `exports` 同时解决了**多子路径映射**、**条件导出（ESM/CJS/Browser/Edge/Types）**与**私有文件强封装**三大工程痛点。\n- 条件键顺序决定了匹配优先级，牢记 **`types` 置顶、`default` 垫底**。\n- 配合 `tsconfig.json` 中的 `\"moduleResolution\": \"bundler\"`（前端应用）或 `\"nodenext\"`（Node 库），可完整激活 `exports` 与 `imports` 的静态类型推导。\n\n## 名词解释\n\n| 名词 | 解释 |\n| :--- | :--- |\n| **Conditional Exports（条件导出）** | 根据导入方运行环境（`import`/`require`/`browser`/`node`/`types`）映射到不同构建产物的机制 |\n| **Subpath Encapsulation（子路径封装）** | 启用 `exports` 后，未在映射表中声明的包内文件路径禁止被外部直接 `import` |\n| **Subpath Imports（`#` 私有导入）** | `package.json` 的 `imports` 字段，以 `#` 前缀为包内部提供原生路径别名与环境多态映射 |\n\n## 课后练习\n\n**练习 1**：为什么在 `exports[\".\"]` 中把 `\"default\"` 写在 `\"import\"` 前面会导致 CJS 和 ESM 分流失效？\n\n> **答案**：因为 Node.js 和打包器在解析条件导出对象时遵循**先声明先命中（First-match wins）**原则。由于 `\"default\"` 无条件匹配所有环境，一旦把它放在前面，解析器会直接返回 `\"default\"` 对应的文件，根本不会继续往下检查 `\"import\"` 或 `\"require\"`。\n\n**练习 2**：如何让一个同时支持 `import`（ESM）和 `require`（CJS）的双格式 npm 包避免出现“双包危害（Dual Package Hazard，即同一个包被加载出两份独立单例状态）”？\n\n> **答案**：采用**CJS 主体 + ESM 薄包装壳（ESM Wrapper）**或将有状态的单例抽取到独立的纯 CJS/ESM 内部文件，使 `.mjs` 入口内部仅通过重导出底层共享状态模块工作，并在构建期用 `publint` 与 `@arethetypeswrong/cli` 校验导出表一致性。"
  },
  {
    "id": "jsm-l14",
    "chapter": "practice",
    "title": "模块化设计最佳实践与按需加载",
    "minutes": 30,
    "content": "### 本节目标\n\n- 掌握「单一职责」「明确边界」的模块设计原则\n- 会用「桶文件（barrel）」聚合导出但注意陷阱\n- 理解「按需加载」在业务里的落地\n\n好模块的标准：**一件事、明确进出口、低耦合**。\n\n```js\n// 运行环境：Node.js 16+（.mjs 示意）\n// ✅ 单一职责：format.js 只管格式化\nexport const formatPrice = (n) => `¥${n.toFixed(2)}`\nexport const formatDate = (ts) => new Date(ts).toISOString().slice(0, 10)\n\n// ⚠️ 桶文件陷阱：index.js 里全量 re-export\n// export * from './format.js'\n// export * from './validate.js'\n// 若业务只用 format，却经 index 全引，Tree Shaking 可能失效（取决于打包器对 * 的处理）\n\n// ✅ 按需加载：业务里点击才加载重型模块\nasync function openEditor() {\n  const { RichEditor } = await import('./rich-editor.mjs')\n  new RichEditor()\n}\n```\n\n**设计原则**：模块对外只暴露「必要的」，内部实现藏起来；依赖尽量单向（避免循环）；一个文件别又做 UI 又做网络又做存储。\n\n### 名词解释\n\n**单一职责（Single Responsibility）**：一个模块只「做好一件事」。比如 `format.js` 只管格式化、`api.js` 只管请求。好处是改格式化不影响网络、测试独立、复用方便。它是模块设计的第一原则，违反它往往导致「一个文件 2000 行、谁都不敢动」。\n\n**桶文件（Barrel）**：用一个 `index.js` 把多个子模块「`export *` / 具名 re-export」聚起来，让调用方 `import { a, b } from './utils'` 一行搞定。便利但有坑：不当的全量 re-export 可能让 Tree Shaking 失效（打包器不敢删「可能被用到」的导出）。按需场景建议直接引具体文件。\n\n### 课后练习\n\n**练习 1**：为什么「一个模块又管 UI 又管请求又管存储」不好？\n\n> 答案：耦合高——改存储逻辑可能误伤 UI；测试时要同时 mock 网络；复用「只想用它的格式化函数」却被迫带上整坨依赖。单一职责让每个模块「可独立理解、测试、复用」，长期维护成本骤降。\n\n**练习 2**：桶文件什么情况下会让 Tree Shaking 失效？\n\n> 答案：当用 `export * from './x'` 聚合，且打包器无法确定「x 里某个导出是否被用到」时（尤其 x 有副作用），可能保守保留整个 x。若追求极致摇树，调用方应直接 `import { fn } from './x.js'` 而非经桶文件。现代打包器对具名 re-export 多能摇，但对 `export *` 较保守。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n模块化设计的好坏，决定项目半年后「好不好改」。我的观点：原则是简单的——**单一职责 + 明确边界 + 依赖单向**，但执行起来要克制「顺手往当前文件塞点逻辑」的冲动。桶文件我建议「适度用」：在库入口聚合方便用户一行引入没问题，但在业务代码里为了「少写几行 import」而全量 re-export，常常赔上 Tree Shaking。按需加载则记住「重且不一定用 → 动态 import」，这是首屏性能的低垂果实。好模块像好收纳：东西各归其位，用时一拿就到。"
  },
  {
    "id": "jsm-l15",
    "chapter": "practice",
    "title": "Module Federation 与 SSR 中的模块化",
    "minutes": 30,
    "content": "### 本节目标\n\n- 粗览「模块联邦（Module Federation）」解决什么（多应用共享模块）\n- 理解 SSR 下「模块只该在服务端跑一次」的要点\n- 建立「模块化不止浏览器，还跨应用/跨环境」的认知\n\n**模块联邦**：让「多个独立部署的前端应用」能「运行时互相 import 对方的模块」，不用打包进自己包里。\n\n```js\n// 运行环境：Webpack 5 配置示意（非直接运行的单文件）\n// app1 暴露一个组件\n// webpack.config.js -> new ModuleFederationPlugin({ name:'app1', exposes:{'./Button':'./src/Button.js'} })\n// app2 远程引入\n// import { Button } from 'app1@https://cdn/remoteEntry.js'  // 运行时拉取 app1 的模块\n```\n\n**SSR（服务端渲染）里的模块化**：Node 端 `import` 的模块在服务端进程里只加载一次（缓存）。注意：浏览器用的模块（含 `window`）不能不小心被 Node 端 import，否则报错。需用「条件导出」或「只 import 纯逻辑模块」隔离。\n\n```js\n// 纯逻辑模块（服务端/浏览器都能用）\nexport const sum = (a, b) => a + b\n// 带 window 的模块只在客户端 import，别让 SSR 入口碰它\n```\n\n### 名词解释\n\n**模块联邦（Module Federation）**：Webpack 5 引入的能力，让多个「独立构建、独立部署」的前端应用，在运行时互相加载对方的模块（像 import 远程包）。它解决「微前端/多团队各自部署却要共享组件」的问题，避免每个应用都打包一份相同组件。\n\n**SSR（服务端渲染）**：在 Node 端把组件渲染成 HTML 再发给浏览器。此时「模块在 Node 进程里加载」，有缓存、也会因 `window`/`document` 不存在而崩。所以 SSR 项目要把「纯逻辑」和「只 browser 的代码」分开模块，避免 Node 端误 import 浏览器专属代码。\n\n### 课后练习\n\n**练习 1**：模块联邦和「npm 发包共享」有什么本质区别？\n\n> 答案：npm 共享是「构建时」把依赖打进各自包（各自一份副本、要发版同步）；模块联邦是「运行时」从一个已部署的应用拉取模块（同一份、实时更新、独立部署）。前者适合稳定库，后者适合「多应用共享且要独立迭代的组件」。\n\n**练习 2**：SSR 里为什么不能让 Node 端 `import` 含 `window` 的模块？\n\n> 答案：Node 没有 `window`/`document`，模块顶层一旦用到就抛 `ReferenceError`，服务端渲染直接崩。所以要「环境隔离」：纯逻辑（无浏览器 API）模块两端共用；含 `window` 的模块只在客户端入口引入，Node 端绝不碰。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n模块化的视野不该停在「一个浏览器应用内」。我的观点：模块联邦和 SSR 代表了模块化的「两个延伸维度」——一个是「跨应用运行时共享」（微前端），一个是「跨环境（服务端/客户端）隔离」。它们共同提醒你：**模块是有「部署边界」和「运行环境边界」的**。设计模块时想清「它会在哪跑、被谁引」，才能避免 SSR 的 `window` 崩溃、或微前端的重复打包。初学者不必深抠配置，但要有这个心智：模块不是孤立的，它活在「环境 + 部署」的上下文里。"
  },
  {
    "id": "jsm-l16",
    "chapter": "practice",
    "title": "npm 包发布与版本管理",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解 `package.json` 的 `name/version/main/exports` 与发包流程\n- 搞懂语义化版本（SemVer）`主.次.补`\n- 知道 `^ ~` 范围符的区别与「锁文件」的作用\n\n发一个包：写好 `package.json`，`npm publish`。\n\n```json\n// 包的 package.json（最小可发）\n{\n  \"name\": \"my-utils\",\n  \"version\": \"1.2.0\",          // 语义化版本：主.次.补\n  \"type\": \"module\",\n  \"main\": \"./dist/index.cjs\",  // 老式入口（CJS）\n  \"exports\": { \".\": { \"import\": \"./dist/index.mjs\", \"require\": \"./dist/index.cjs\" } },\n  \"files\": [\"dist\"]            // 只发 dist，不发源码\n}\n```\n\n**SemVer**：`主版本.次版本.补丁`\n- 主版本：不兼容改动（API 删了/行为变了）\n- 次版本：新功能，向后兼容\n- 补丁：修 bug，向后兼容\n\n**依赖范围**：\n- `^1.2.0`：允许 `1.x.x` 最新（不含 2.0）→ 拿兼容更新\n- `~1.2.0`：只允许 `1.2.x` → 只拿补丁\n- `lock` 文件（package-lock.json）：锁死「实际装的确切版本」，保证团队/CI 一致\n\n### 名词解释\n\n**SemVer（语义化版本）**：`主.次.补` 的版本号约定，用数字告诉你「这次改动有多危险」。升主版本 = 可能不兼容、要改代码；升次版本 = 加了功能但能直接升；升补丁 = 只修 bug。它让「该不该升级依赖」变成看一眼版本号就能判断的事。\n\n**锁文件（Lockfile）**：`package-lock.json` / `pnpm-lock.yaml` 记录「本次安装的每个包的确切版本和依赖树」。它保证「你装的、同事装的、CI 装的」完全一致，避免「我本地好好的、线上挂了」这种「依赖漂移」事故。提交锁文件是工程纪律。\n\n### 课后练习\n\n**练习 1**：`^1.2.0` 和 `~1.2.0` 在 `npm install` 时可能装到的最高版本分别是什么？\n\n> 答案：`^1.2.0` 最高到 `<2.0.0`（即 1.9.9 这种都行，主版本不升）；`~1.2.0` 最高到 `<1.3.0`（只补丁，1.2.x）。`^` 更松、`~` 更紧。CI 通常靠 lock 文件锁死，范围符只在「首次安装/无锁」时起作用。\n\n**练习 2**：为什么「团队成员都要提交 package-lock.json」？\n\n> 答案：没有锁文件，每个人 `npm install` 可能装到「范围内不同的小版本」，出现「我本地能跑你本地报错」的依赖漂移。锁文件把确切版本钉死，全团队/CI 一致，是协作的基本纪律。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n发包和版本管理是把「你的模块」变成「别人能信赖的依赖」的最后一公里。我的观点：SemVer 不是形式主义，是**对用户的承诺**——升主版本前要想清「会不会让人家代码崩」。依赖范围符 `^`/`~` 我建议「库用 `^` 拥抱兼容更新，关键服务用锁文件钉死」，别裸奔。锁文件必须提交，这是工程底线，没有商量。最后提醒：发之前用 `exports` 做好门面、用 `files` 只发构建产物（别把源码/密钥传上去）——专业发包 = 门面清晰 + 版本诚实 + 依赖可复现。"
  },
  {
    "id": "jsm-l17",
    "chapter": "practice",
    "title": "浏览器原生 ESM 与 import maps",
    "minutes": 25,
    "content": "### 本节目标\n\n- 理解浏览器「原生支持 ESM」后，还要打包器干嘛\n- 看懂 `import maps` 如何让裸名 `import 'lodash'` 在浏览器直接工作\n- 知道「不打包」的开发场景\n\n现代浏览器原生支持 `<script type=\"module\">` 和 `import`，但**裸名 import（如 `import 'lodash'`）浏览器不认**——它只认 URL。\n\n```html\n<!-- 运行环境：现代浏览器（需 http 服务，不能直接 file://） -->\n<!-- import map：告诉浏览器「lodash 这个裸名对应哪个 URL」 -->\n<script type=\"importmap\">\n{\n  \"imports\": {\n    \"lodash\": \"https://cdn.skypack.dev/lodash\"\n  }\n}\n</script>\n<script type=\"module\">\n  import { chunk } from 'lodash'   // 浏览器查 import map 解析到上面的 URL\n  console.log(chunk([1,2,3,4], 2))\n</script>\n```\n\n**还要打包器吗**：要。原生 ESM 对「几十个模块逐个请求」慢、无 Tree Shaking、无压缩。打包器在「生产」解决这些；但在「教学/原型/本地小工具」场景，原生 ESM + import map 能零构建直接跑，非常爽。\n\n### 名词解释\n\n**原生 ESM（Native ESM）**：浏览器内置支持 `import/export`，无需打包器。但限制是「只认 URL 路径」，不认 npm 风格的裸名（`import 'lodash'` 会报「无法解析」）。它是「零构建前端」成为可能的基础。\n\n**Import Maps**：一段 JSON，写在 HTML 里，告诉浏览器「裸名 → 真实 URL」的映射。有了它，浏览器就能把你写的 `import 'lodash'` 解析成 CDN 地址。它是「不打包也能用裸名 import」的关键，适合教学、Demo、轻量页面。\n\n### 课后练习\n\n**练习 1**：浏览器原生 ESM 为什么「不直接认 `import 'lodash'`」？\n\n> 答案：浏览器只认「能发 HTTP 请求的 URL」，而 `lodash` 是 npm 包名不是地址。它不知道去哪下载。import map 就是来补这个映射的——把 `lodash` 指向一个 CDN URL，浏览器才会去拉。\n\n**练习 2**：什么场景适合「完全不打包、用原生 ESM + import map」？\n\n> 答案：教学演示、个人小工具、原型验证、内部轻量面板——这些「不在乎首屏多请求、要最快上手」。但正式产品（多模块、要体积小、要兼容）仍该用打包器。原生 ESM 是「开发体验」利器，打包器是「生产交付」利器。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n原生 ESM + import map 让「零构建前端」成为现实，我的看法是：它是**教学和原型场景的神器**——你改一行刷新就看到，不用等打包。但别被「零构建」冲昏头：产品级应用里，几十个模块各自请求会让首屏慢到没法看，Tree Shaking/压缩也做不了。所以定位要清：**import map 管「快速跑起来」，打包器管「跑得小跑得稳」**。理解两者分工，你就不会在「该不该上 Vite」上纠结——答案是「开发原型用原生、正式交付用打包器」。工具服务于场景，不是信仰。"
  },
  {
    "id": "jsm-l18",
    "chapter": "impl",
    "title": "手写 CommonJS：require 加载与缓存实现",
    "minutes": 35,
    "content": "### 本节目标\n\n- 亲手写一个迷你 `require`，真正理解 CJS 内部\n- 覆盖「路径解析 + 执行 + 缓存」\n- 体会「模块系统就是个加载器」\n\n我们来手写一个极简 CJS 加载器（Node 自带的不用，纯演示原理）。\n\n```js\n// 运行环境：Node.js 16+（保存为 .cjs 运行）\nconst fs = require('fs')\nconst path = require('path')\nconst vm = require('vm')\n\nconst cache = {} // 模拟 require.cache\nfunction myRequire(modulePath) {\n  const abs = path.resolve(modulePath) // 解析绝对路径\n  if (cache[abs]) return cache[abs].exports // 命中缓存直接返回\n  const code = fs.readFileSync(abs, 'utf8')\n  const module = { exports: {} }\n  cache[abs] = module\n  // 用 vm 在「带 require/module/exports」的自定义沙箱上下文里执行模块代码\n  const sandbox = {\n    require: myRequire,\n    module,\n    exports: module.exports,\n    console,                       // 让模块内部也能 console.log\n    __filename: abs,               // 模块里可读取自己的路径\n    __dirname: path.dirname(abs),\n  }\n  vm.runInNewContext(code, sandbox) // 沙箱里的顶层 var 不会泄漏成全局，实现模块隔离\n  return module.exports\n}\n\n// 使用示例：\n// math.cjs 内容：module.exports = { add:(a,b)=>a+b }\nconst math = myRequire(path.resolve(__dirname, 'math.cjs'))\nconsole.log(math.add(1, 2)) // 3\n```\n\n**关键点**：`require` 不过是「读文件 → 放进 vm 沙箱上下文（注入 require/module/exports 作为全局）→ 执行 → 缓存 exports」。这就是 Node CJS 的全部秘密。\n\n### 名词解释\n\n**手写模块加载器**：自己实现一个 `require`，用来「看透」模块系统的本质。核心三步永恒不变：① 路径解析（相对→绝对）；② 给模块代码注入 `require/module/exports` 后执行；③ 把 `module.exports` 缓存。理解了这三点，任何模块系统（CJS/AMD）你都能自己造。\n\n**vm（虚拟机）模块**：Node 的 `vm` 能在「自定义沙箱上下文」里执行字符串代码。手写加载器用 `vm.runInNewContext(code, sandbox)`：把模块源码和 `sandbox`（里面挂了 `require/module/exports/console/__filename/__dirname`）一起丢进一个隔离的全局环境跑。模块顶层的 `var` 只活在沙箱里、不会泄漏成真正的全局——这就是「模块隔离」的真实原理。它比 `new Function` 更贴近 Node 跑 CJS 文件的底层手法。\n\n### 课后练习\n\n**练习 1**：手写 `require` 里 `cache[abs]` 这一行解决了什么问题？\n\n> 答案：模块只执行一次（单例 + 性能）。第二次 `myRequire` 同一文件直接返回缓存的 `exports`，不重新读文件、不重新执行。这就是 `require.cache` 机制的迷你版，对应 Node 的真实行为。\n\n**练习 2**：为什么模块代码要「包成函数再执行」，而不是直接 `eval`？\n\n> 答案：包成函数能「给每个模块独立的作用域（参数就是 require/module/exports）」，模块顶层的 `var` 不会泄漏成全局；`eval` 则在当前作用域执行，变量互相污染。函数作用域才是模块隔离的正确实现，这也是为什么真实 CJS 也用函数包裹。\n\n### 总结\n\n手写一遍 `require`，是「从会用模块化」到「懂模块化」的分水岭。我的观点：当你看到「模块系统无非是读文件+包函数+注入参数+缓存」，那些玄乎的概念（作用域隔离、缓存、导出）就全落地了。我强烈建议每个前端都手写一次——它把「黑盒工具」变成「我能造的东西」，以后遇到模块加载诡异问题，你能直接定位是「路径解析错」「缓存没清」还是「导出没挂对」。一句话：理解模块系统最好的方式，不是读文档，是写一遍加载器。"
  },
  {
    "id": "jsm-l19",
    "chapter": "impl",
    "title": "手写 AMD：define 与 require 的回调依赖管理",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解 AMD 的 `define(id, deps, factory)` 与 `require(deps, cb)` 怎么工作\n- 手写一个迷你 AMD 加载器，体会「回调式异步依赖」\n- 对比它与 CJS 的「同步」差异\n\nAMD 用「回调」处理异步加载的依赖：先声明依赖，依赖就绪再执行工厂。\n\n```js\n// 运行环境：浏览器（或 Node 演示逻辑，这里给核心算法）\n// 迷你 AMD 加载器核心：\nconst modules = {}\nfunction define(id, deps, factory) {\n  modules[id] = { deps, factory, exports: {} }\n}\nconst loading = {}\nfunction require(ids, cb) {\n  const results = ids.map((id) => {\n    const m = modules[id]\n    // 真实 AMD 这里会去「异步下载并 eval」模块文件；简化为直接用已 define 的\n    return m.factory.apply(null, m.deps.map((d) => modules[d].exports))\n  })\n  cb.apply(null, results)\n}\n// 使用：\ndefine('a', [], function () { return { name: 'A' } })\ndefine('b', ['a'], function (a) { return { who: a.name + ' 的朋友' } })\nrequire(['b'], function (b) { console.log(b.who) }) // 'A 的朋友'\n```\n\n**要点**：AMD 的 `require(deps, cb)` 是「等依赖齐了再调 cb」——天然适配「依赖要从网络异步加载」的浏览器场景。这和 CJS「同步拿到」形成对比。\n\n### 名词解释\n\n**define(id, deps, factory)**：AMD 的「声明模块」函数：给模块起 id、列依赖、写工厂（真正逻辑）。它把「依赖列表」显式写在参数里，加载器据此「先加载依赖、再执行工厂」。这是 AMD「依赖前置、异步就绪」的落地语法。\n\n**回调式依赖（Callback DI）**：AMD 不让你「直接拿到依赖」，而是「把工厂交给加载器，等依赖就绪它再调用你」。这种「反转控制」天然支持异步——依赖没下载完就先不调用，下载完一并注入。对比 CJS 的同步 require，AMD 为「浏览器网络加载」而生。\n\n### 课后练习\n\n**练习 1**：AMD 的 `require(['b'], cb)` 为什么适合浏览器？\n\n> 答案：浏览器里模块要从网络下载，无法「同步拿到」。AMD 的回调机制「等 b 及其依赖都下载执行完，再调 cb 注入」，天然适配异步；而 CJS 的同步 `require` 在浏览器原生不支持（会阻塞/拿不到）。这是 AMD 当年存在的核心理由。\n\n**练习 2**：上面迷你加载器「简化为直接用已 define 的」漏了什么真实能力？\n\n> 答案：漏了「按 id 去网络异步下载并 eval 模块文件」这一步——真实 AMD（RequireJS）会根据 id 拼 URL、发请求、拿到代码后 `define` 注册、再触发等待中的回调。我们的简化版假设模块已 define，只为演示「依赖图 + 回调注入」的算法骨架。\n\n### 总结\n\n手写 AMD 加载器让你看清「异步依赖」怎么管——它把「我要什么」和「给我之后做什么」分开写：先 `define` 声明依赖，加载器等依赖就绪再调你的 `factory` 并注入依赖。对比 CJS 的「同步拿到」，AMD 为「依赖要异步下载」的浏览器而生。我的观点：今天新项目很少手写 AMD，但理解它让你能读懂老代码，也看清「依赖注入 + 回调」这套思想（其实和现代 Promise/async 一脉相承）。结论：模块系统的形态，永远被「运行环境的能力」塑造——浏览器当年没原生模块，于是有了 AMD 的异步回调；有了原生 ESM，AMD 就功成身退。"
  },
  {
    "id": "jsm-l20",
    "chapter": "impl",
    "title": "手写简易 Bundler：模块图 → 单文件",
    "minutes": 35,
    "content": "### 本节目标\n\n- 亲手写一个「把多个 ESM 模块合并成一个文件」的迷你打包器\n- 用正则/简单解析把所有 `import/export` 改写成「函数调用」\n- 体会「打包器 = 依赖图 + 拼接 + 启动」\n\n真实打包器用 AST（见 ast-pro 课程）解析，这里用「示意级」拼接讲清原理。\n\n```js\n// 运行环境：Node.js 16+（保存为 .cjs 运行，演示打包思想）\nconst fs = require('fs')\nconst path = require('path')\n\n// 极简：把 main.js 和它 import 的模块，拼进一个「模块数组 + 启动函数」\nfunction bundle(entry) {\n  const modules = []\n  function add(file) {\n    const code = fs.readFileSync(file, 'utf8')\n    const id = modules.length\n    modules.push({ id, code })\n    // 真实场景这里会用正则/AST 找 import，递归 add 依赖；示意略\n    return id\n  }\n  const entryId = add(entry)\n  // 把每个模块的 code 包成函数，启动函数按 entryId 执行\n  const body = modules.map((m) => `function m${m.id}(require, module, exports){\\n${m.code}\\n}`).join('\\n')\n  return `(function(){ const cache={}; function require(id){ if(cache[id])return cache[id].exports; const m={exports:{}}; cache[id]=m; m${entryId}(require,m,m.exports); return m.exports } ${body}; require(${entryId}) })()`\n}\n// 用法：const out = bundle(path.resolve(__dirname,'main.js')); fs.writeFileSync('out.js', out)\n```\n\n**原理一句话**：打包器把「每个源文件」变成「数组里的一个函数」，再加一个「加载器」按依赖图串起来执行——和你手写 CJS 加载器（jsm-l18）是同一个灵魂，只是它自动分析依赖图。\n\n### 名词解释\n\n**简易 Bundler（打包器雏形）**：把「分散的模块文件」合并成「一个可运行文件」的工具。核心是「建依赖图 → 每个模块包成函数 → 加载器启动」。真实打包器（Rollup/Webpack）用 AST 精确改写 `import/export` 为函数调用与导出对象，并处理 Tree Shaking、代码分割；我们这里用拼接演示「骨架」。\n\n**依赖图驱动**：打包的本质是「从入口按 import 画出整张图，再图遍历执行」。所以「模块图」这个概念从 ESM 引擎到打包器到手写加载器贯穿始终——它是模块系统的通用语言。理解图，就理解了打包。\n\n### 课后练习\n\n**练习 1**：为什么打包产物里「每个模块都包成函数」？\n\n> 答案：为了「隔离作用域 + 可缓存」——和手写 CJS 加载器同理。函数作用域让模块顶层变量不外泄，加载器用 `module.exports` 收集导出并缓存。打包器只是把「手工注入 require/module/exports」自动化了。\n\n**练习 2**：真实打包器和我们的「正则拼接」最大差距在哪？\n\n> 答案：正确性。正则拼接会误伤字符串里的 `import`、处理不了动态 import、做不了 Tree Shaking。真实打包器用 AST（见 ast-pro）精确理解语法结构，才能安全改写并优化。所以「示意」懂原理，「生产」还得靠成熟工具。\n\n### 总结\n\n手写打包器是「打通任督二脉」的一课：你会发现 Vite/Webpack 没那么神秘，它们就是「自动版的手写加载器」。我的观点：理解打包原理最大的好处是**破除对构建配置的恐惧**——当你知道「bundle 不过是一堆函数 + 一个加载器」，遇到「打包后某模块没执行」「chunk 切分不对」，你能直接定位是依赖图问题而非玄学。当然，生产请用成熟打包器（正则拼接会翻车），但「亲手拼一次」换来的是一辈子的通透。模块化学到这，你已经从「用模块」走到了「造模块系统」。"
  },
  {
    "id": "jsm-l21",
    "chapter": "migrate",
    "title": "现代双包架构实战：ESM 与 CJS 双轨构建、目录契约与发布校验",
    "minutes": 25,
    "content": "在第六章亲手实现 CommonJS、AMD 与简易 Bundler 后，第七章聚焦于现代前端工程落地中最真实的发包难题：**如何将一个库同时编译为高质量的 ES Module（`.mjs`）与 CommonJS（`.cjs`）双轨产物，彻底规避“双包危害（Dual Package Hazard）”并通过自动化工具完成发布前体检。**\n\n## 一、 什么是双包危害（Dual Package Hazard）？\n\n当一个 npm 包同时提供了 CJS 产物（`dist/index.cjs`）和 ESM 产物（`dist/index.mjs`）时，如果在同一个 Node.js 应用中，模块 A 通过 `import pkg from 'my-pkg'` 加载了 `.mjs` 版本，而某个旧版第三方依赖 B 通过 `require('my-pkg')` 加载了 `.cjs` 版本，**Node.js 会在内存中同时实例化两份完全独立的模块副本**！\n- 后果 1：包内部维护的全局配置、连接池或 `Symbol`/类实例报错 `instanceof` 返回 `false`。\n- 后果 2：注册表、插件列表或缓存状态在 ESM 调用方与 CJS 调用方之间完全割裂。\n\n```javascript\n// 解决方案：使用 globalThis + Symbol.for 在双包产物之间安全共享核心单例状态\nconst INSTANCE_KEY = Symbol.for('@study/sdk.singleton.v1')\n\nexport function getSharedRegistry() {\n  if (!globalThis[INSTANCE_KEY]) {\n    globalThis[INSTANCE_KEY] = new Map()\n  }\n  return globalThis[INSTANCE_KEY]\n}\n```\n\n## 二、 使用 `tsup` / `unbuild` 构建双格式 npm 包的工程范式\n\n现代前端库不再手写繁琐的 Rollup 多套配置，而是采用基于 esbuild/Rollup 封装的 `tsup` 或 `unbuild` 一键生成 `.mjs`、`.cjs`、`.d.ts` 与 `.d.cts`：\n\n```javascript\n// tsup.config.ts：工业级双格式 npm 包构建配置\nimport { defineConfig } from 'tsup'\n\nexport default defineConfig({\n  entry: ['src/index.ts', 'src/utils.ts'],\n  format: ['esm', 'cjs'],     // 同时输出 .mjs 与 .cjs\n  dts: true,                  // 同时生成 .d.mts 与 .d.cts，彻底解决 TS NodeNext 类型报错\n  splitting: true,            // 开启公共 Chunk 提取，避免多入口重复打包同一内部模块\n  sourcemap: true,\n  clean: true,\n  treeshake: true,\n  minify: false               // 库产物保持可读性并保留 /*#__PURE__*/ 注释供下游业务摇树\n})\n```\n\n## 三、 发布前必跑的两大自动化体检工具：`publint` 与 `attw`\n\n很多库本地构建成功，发布到 npm 后却被下游用户投诉“TypeScript 报错找不到类型”或“Vite 打包报错”。在 `package.json` 的 `prepublishOnly` 钩子中接入以下两道门禁可 100% 提前拦截配置失误：\n\n| 校验工具 | 检查重点 | 拦截的典型 Bug |\n| :--- | :--- | :--- |\n| **`npx publint`** | 校验 `package.json` 的 `main`/`module`/`types`/`exports`/`files` 指向的文件是否真实存在且格式匹配 | 构建输出在 `dist/index.mjs` 但 `exports` 写成了 `./lib/index.js`；或 `.mjs` 文件内误输出了 `module.exports` |\n| **`npx @arethetypeswrong/cli --pack`** | 模拟 Node10、Node16（CJS/ESM）与 Bundler 四种 TS 解析模式校验类型声明 | 用 `index.d.ts` 同时充当 ESM 和 CJS 类型导致 `moduleResolution: \"nodenext\"` 下报“伴生模块格式伪装（Masquerading as CJS/ESM）”错误 |\n\n## 总结\n\n- 现代开源库推荐采用 **ESM First + CJS 兼容（Dual Package）** 架构，通过 `.mjs`/`.cjs` 与 `.d.mts`/`.d.cts` 明确后缀区分模块体制。\n- 若包内含有跨调用共享的单例状态，应通过 `Symbol.for()` 挂载在全局或采用 ESM 薄壳包裹 CJS 内核，防范双包危害。\n- 将 `publint` 与 `attw` 纳入 CI，确保 `exports` 契约零死角。\n\n## 名词解释\n\n| 名词 | 解释 |\n| :--- | :--- |\n| **Dual Package Hazard（双包危害）** | 同一进程内同时通过 `import` 与 `require` 加载同一包的不同格式产物，导致状态与类实例分裂为两份 |\n| **Masquerading as CJS/ESM** | TypeScript 在 `nodenext` 模式下发现 `.d.ts` 与 `.mjs`/`.cjs` 模块格式后缀不匹配时抛出的类型解析异常 |\n| **`/*#__PURE__*/` 注释** | 标记函数调用无副作用，提示下游打包器若返回值未被使用可安全将其 Tree Shaking 剔除 |\n\n## 课后练习\n\n**练习 1**：为什么在 `\"type\": \"module\"` 的 npm 包中，CJS 产物必须显式使用 `.cjs` 后缀而不能用 `.js`？\n\n> **答案**：因为在 `package.json` 设置了 `\"type\": \"module\"` 后，Node.js 会将该包下所有以 `.js` 结尾的文件一律当作 ES Module 解析；如果 CJS 产物仍叫 `.js`，内部执行的 `require()` 和 `module.exports` 会直接抛出 `ReferenceError: require is not defined in ES module scope`。\n\n**练习 2**：库代码在编译发布到 npm 时，为什么通常开启 `treeshake: true` 但关闭 `minify: false`？\n\n> **答案**：库代码会被下游应用二次打包（那时会统一做最终压缩）。保持未混淆状态既方便下游开发者在 `node_modules` 中断点调试与阅读源码，又能保留清晰的变量名与 `/*#__PURE__*/` 纯函数标记供下游 Bundler 精确执行 Tree Shaking。"
  },
  {
    "id": "jsm-l22",
    "chapter": "migrate",
    "title": "传统代码迁移到 ES Module 综合案例",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用一个「传统全局脚本 → ESM」的综合案例串起前面所有知识\n- 掌握迁移步骤：拆分文件 → 加 export/import → 处理依赖方向\n- 知道迁移中常见的坑（循环依赖、全局变量）\n\n假设一段「全局脚本」要迁移成 ESM：\n\n```js\n// 迁移前：app.js（全局，互相读全局）\nvar users = []\nfunction addUser(u) { users.push(u) }\nfunction render() { return users.length }\n\n// 迁移后：拆成两个 ESM 模块\n// store.mjs\nexport const users = []\nexport function addUser(u) { users.push(u) }\n// view.mjs\nimport { users } from './store.mjs'\nexport function render() { return users.length }\n\n// 入口 main.mjs\nimport { addUser } from './store.mjs'\nimport { render } from './view.mjs'\naddUser({ name: 'Tom' })\nconsole.log(render()) // 1\n```\n\n**迁移步骤清单**：\n1. 按「单一职责」把大文件拆成小模块，每个文件只做一件事。\n2. 给每个模块加 `export`（要对外暴露的）/ `import`（要用的）。\n3. 检查依赖方向，尽量单向；发现循环依赖就抽公共逻辑到第三方块。\n4. 把原全局变量改成「模块内状态」或「显式传入」。\n\n### 名词解释\n\n**迁移（Migration）**：把「旧形态代码」改成「新形态」且行为不变的过程。模块迁移的核心动作是「拆文件 + 显式 import/export + 理顺依赖方向」。它不是重写功能，而是「换组织方式」，所以务必「每步可运行、可对比」，别一次性大改。\n\n**依赖方向理顺**：迁移时最常见的坑是「拆完发现 A 引 B、B 引 A」。处理法是「提取公共依赖到第三方块 C」，让 A、B 都只引 C，依赖变单向。这是模块化的通用整容术——遇见环就抽中间层。\n\n### 课后练习\n\n**练习 1**：迁移时为什么「每步可运行」比「一次大改」安全？\n\n> 答案：模块化迁移容易引入「漏 export、循环依赖、作用域错」等隐形 bug。每拆一个文件就跑一次、行为不变，问题能立刻定位到「刚动的那步」；一次大改则出错后无从排查。小步快跑是迁移铁律。\n\n**练习 2**：原代码用全局变量 `CONFIG` 存配置，迁移成 ESM 后怎么处理？\n\n> 答案：三种：① 抽到 `config.mjs` 导出，`import` 使用（推荐，单一来源）；② 作为函数参数显式传入（最纯，但调用处要改）；③ 挂到模块内 `export const CONFIG = {...}`。避免再当全局——那等于没迁移。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n迁移是「把知识变成能力」的练兵场。我的观点：迁移最忌「推倒重来」——你以为在重写，其实在引入新 bug。正确姿势是「小步、可运行、行为对比」：每拆一个模块就验证一次，确保对外行为不变。依赖方向是迁移的灵魂，遇到环就「抽中间层」破环，这招通用。另外，全局变量别「换个地方继续全局」（挂到某个模块再到处 import 同效），要真正变成「显式 import 或显式传参」。迁移的目标不是「用上 ESM 语法」，而是「依赖关系变清晰、可测试、可维护」——语法只是手段。"
  },
  {
    "id": "jsm-l23",
    "chapter": "migrate",
    "title": "易错点避坑指南：循环依赖 / 作用域 / Tree Shaking",
    "minutes": 30,
    "content": "### 本节目标\n\n- 汇总模块化三大高频坑：循环依赖、作用域泄漏、Tree Shaking 失效\n- 每条给出「症状 + 根因 + 解法」\n- 形成「写模块前的自检清单」\n\n**坑 1：循环依赖拿到 undefined（CJS）**\n- 症状：`require` 对方导出是 `undefined`。\n- 根因：CJS 值拷贝 + 运行时顺序，回头 require 时对方没初始化完（见 jsm-l6）。\n- 解法：重构单向依赖，或延迟到函数内 `require`。\n\n**坑 2：作用域泄漏（误用全局）**\n- 症状：两个模块变量互相覆盖、改一个影响另一个。\n- 根因：没隔离作用域（忘了 IIFE/模块边界，或迁移时残留全局）。\n- 解法：每个文件是模块，变量用 `export` 显式暴露，绝不挂全局。\n\n**坑 3：Tree Shaking 抖不掉**\n- 症状：打包体积没变小，明明没用的导出还在。\n- 根因：用了 CJS（无法静态）、或模块顶层有副作用、或 `export *` 桶文件。\n- 解法：改 ESM 命名导出、模块纯净、按需直接引具体文件（见 jsm-l12）。\n\n**自检清单**（写模块前过一遍）：\n```text\n□ 这个文件只做一件事吗？（单一职责）\n□ 依赖是单向的吗？有环就抽中间层\n□ 导出用命名导出吗？顶层有副作用吗？\n□ 跨模块读取放进函数、不在顶层急用吗？\n```\n\n### 名词解释\n\n**避坑清单（Checklist）**：把「常见错误」变成「写代码前的自检项」。模块化三坑（循环依赖、作用域泄漏、Tree Shaking 失效）各有根因，但都能在「动手前」靠清单规避。清单的价值是「把事后调试变成事前预防」，成本最低。\n\n**作用域泄漏（Scope Leak）**：本该在模块内的变量跑到了全局，导致跨模块互相覆盖。它是「没真正模块化」的典型症状——根因常是迁移残留全局、或忘了文件边界。诊法是「搜全局 `var/let` 是否挂在 window、是否被多文件共享」。\n\n### 课后练习\n\n**练习 1**：三个坑里哪个「编译期就能发现」，哪个「只能运行时偶发」？\n\n> 答案：作用域泄漏常「编译不报错、运行才覆盖」，最难查；循环依赖（CJS）也是运行时偶发 undefined；Tree Shaking 失效不报错只是体积大。三者都「不报语法错」，所以靠清单预防比靠报错更重要。\n\n**练习 2**：自检清单里「跨模块读取放进函数」主要防哪个坑？\n\n> 答案：主要防「循环依赖半成品」（CJS 下顶层急用对方未初始化导出会 undefined）。延迟到函数内读取，等所有模块初始化完再调用，对方早已就绪。ESM 下配合 live binding 也更稳（见 jsm-l9）。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n这一节是整套课程的「安全带」。我的观点：模块化的坑几乎都不报语法错，全在运行时或体积上阴你，所以**预防远胜调试**。三个坑各有根因但同源——都是「依赖关系没想清」：循环依赖是方向问题、作用域泄漏是边界问题、Tree Shaking 失效是纯度问题。把那张四题自检清单贴在编辑器边，写每个模块前扫一眼，能挡掉 90% 的模块化事故。最后一句送给所有学到这的人：模块化不是语法，是「对依赖关系的诚实」——你越诚实地理清「谁依赖谁、暴露什么」，代码就越不乱、越不怕改。"
  }
]

export const jsmPlan = [
  {
    "day": 1,
    "title": "为什么需要模块化？从 script 标签说起",
    "lessons": [
      "jsm-l1"
    ]
  },
  {
    "day": 2,
    "title": "模块化发展史：IIFE / AMD / CMD / UMD",
    "lessons": [
      "jsm-l2"
    ]
  },
  {
    "day": 3,
    "title": "规范现状：CommonJS 与 ESM",
    "lessons": [
      "jsm-l3"
    ]
  },
  {
    "day": 4,
    "title": "module.exports / exports / require",
    "lessons": [
      "jsm-l4"
    ]
  },
  {
    "day": 5,
    "title": "require 加载过程：缓存与路径解析",
    "lessons": [
      "jsm-l5"
    ]
  },
  {
    "day": 6,
    "title": "CJS 循环依赖：为什么会拿到半成品",
    "lessons": [
      "jsm-l6"
    ]
  },
  {
    "day": 7,
    "title": "import / export 语法与静态分析",
    "lessons": [
      "jsm-l7"
    ]
  },
  {
    "day": 8,
    "title": "ESM 解析与加载：模块图与后序执行",
    "lessons": [
      "jsm-l8"
    ]
  },
  {
    "day": 9,
    "title": "ESM 循环依赖：live binding 为什么能救",
    "lessons": [
      "jsm-l9"
    ]
  },
  {
    "day": 10,
    "title": "CJS 与 ESM 互操作：default 陷阱",
    "lessons": [
      "jsm-l10"
    ]
  },
  {
    "day": 11,
    "title": "打包器原理：模块图与 bundle 结构",
    "lessons": [
      "jsm-l11"
    ]
  },
  {
    "day": 12,
    "title": "Tree Shaking 与动态 import 分包",
    "lessons": [
      "jsm-l12"
    ]
  },
  {
    "day": 13,
    "title": "package.json exports 字段：入口与封装",
    "lessons": [
      "jsm-l13"
    ]
  },
  {
    "day": 14,
    "title": "模块化设计最佳实践与按需加载",
    "lessons": [
      "jsm-l14"
    ]
  },
  {
    "day": 15,
    "title": "Module Federation 与 SSR 中的模块化",
    "lessons": [
      "jsm-l15"
    ]
  },
  {
    "day": 16,
    "title": "npm 包发布与版本管理",
    "lessons": [
      "jsm-l16"
    ]
  },
  {
    "day": 17,
    "title": "浏览器原生 ESM 与 import maps",
    "lessons": [
      "jsm-l17"
    ]
  },
  {
    "day": 18,
    "title": "手写 CommonJS：require 加载与缓存实现",
    "lessons": [
      "jsm-l18"
    ]
  },
  {
    "day": 19,
    "title": "手写 AMD：define 与 require 的回调依赖管理",
    "lessons": [
      "jsm-l19"
    ]
  },
  {
    "day": 20,
    "title": "手写简易 Bundler：模块图 → 单文件",
    "lessons": [
      "jsm-l20"
    ]
  },
  {
    "day": 21,
    "title": "模块化演进全景：全局 → 命名空间 → IIFE → 规范",
    "lessons": [
      "jsm-l21"
    ]
  },
  {
    "day": 22,
    "title": "传统代码迁移到 ES Module 综合案例",
    "lessons": [
      "jsm-l22"
    ]
  },
  {
    "day": 23,
    "title": "易错点避坑指南：循环依赖 / 作用域 / Tree Shaking",
    "lessons": [
      "jsm-l23"
    ]
  }
]
