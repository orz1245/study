export const microfeCourseMeta = {
  "id": "microfe",
  "title": "微前端实战",
  "subtitle": "多个团队同写一个应用，微前端讲的就是如何化解这场冲突：讲清问题本质，再用 iframe、single-spa 与 qiankun 各自落地一遍，看清各自的取舍。",
  "level": "入门 → 进阶",
  "icon": "🧩",
  "color": "#ffd6a5",
  "practiceCategory": "microfe",
  "chapters": [
    {
      "key": "intro",
      "name": "第一章 · 认识微前端",
      "lessons": [
        "mf-l1",
        "mf-l2"
      ]
    },
    {
      "key": "qiankun",
      "name": "第二章 · 基座与子应用（qiankun）",
      "lessons": [
        "mf-l3",
        "mf-l4"
      ]
    },
    {
      "key": "isolation",
      "name": "第三章 · 隔离与通信",
      "lessons": [
        "mf-l5",
        "mf-l6"
      ]
    },
    {
      "key": "federation",
      "name": "第四章 · 模块联邦（Module Federation）",
      "lessons": [
        "mf-l7",
        "mf-l8"
      ]
    }
  ]
}

export const microfeLessons = [
  {
    "id": "mf-l1",
    "chapter": "intro",
    "title": "什么是微前端：浏览器里的「微服务」",
    "minutes": 25,
    "content": "### 本节目标\n\n- 用自己的话解释「微前端」解决了什么痛点\n- 区分「单体前端」与「微前端」的组织差异\n- 能说出基座应用、子应用、技术栈无关这三个关键词\n\n微前端（Micro-Frontend）是「微服务思想」在前端的落地：**把一个大应用拆成多个独立开发、独立部署、独立运行的小应用，再在浏览器里拼成一个完整页面**。它和微服务的对应关系很直白——后端把一个服务拆成多个可独立部署的「服务」，前端把一个页面拆成多个可独立部署的「子应用」。\n\n```text\n单体前端（一个团队、一套技术栈、一次发布）：\n  ┌──────────────────────────────┐\n  │  整个 SPA（React/Vue 混在一起） │\n  │  改一处 → 全量回归 → 整体发布   │\n  └──────────────────────────────┘\n\n微前端（多个团队、可异技术栈、各自发布）：\n  ┌──────────┐ ┌──────────┐ ┌──────────┐\n  │ 子应用 A  │ │ 子应用 B  │ │ 子应用 C  │  各自仓库 / 各自 CI / 各自上线\n  └──────────┘ └──────────┘ └──────────┘\n        \\            |           /\n         └──── 基座应用（壳）统一挂载 ────┘\n```\n\n什么场景真的需要它？典型三种：\n\n1. **巨石应用难维护**：一个跑了五年的后台，几千个组件、几十万行，新人改一行都怕炸。拆成子应用后，每个团队只管自己那一亩三分地。\n2. **技术栈要升级但不能推倒重来**：老系统用 AngularJS，新需求想用 Vue3。微前端允许「老模块原样保留、新模块用新框架」，渐进式替换，而不是一次赌博式重写。\n3. **多团队并行交付**：中台里订单、库存、客服是三个团队，各自有发布节奏。微前端让它们「各发各的」，互不等对方。\n\n### 名词解释\n\n**微前端（Micro-Frontend）**：把前端应用按业务边界拆成多个可独立开发、独立部署的子应用，在运行时由「基座」组合成一个页面的架构思想。\n\n**基座应用（Main / Shell App）**：微前端的「壳」，负责菜单、布局、路由分发，并按需加载/卸载子应用。它本身通常很薄。\n\n**子应用（Sub App / Micro App）**：被基座加载的业务模块，拥有自己的技术栈、仓库、构建和发布流程，对外只暴露约定的生命周期钩子。\n\n**技术栈无关（Tech-Stack Agnostic）**：微前端的理想目标——子应用用什么框架都行（React / Vue / Angular / 原生），基座不关心，只要它遵守「挂载/卸载」约定。\n\n### 课后练习\n\n**练习 1**：微前端和「组件库」是一回事吗？\n\n> 答案：不是。组件库是「同一个应用内的 UI 零件复用」；微前端是「把应用本身拆开，每个零件是一个可独立部署的完整应用」。前者解决「长得好看、别重复造按钮」，后者解决「组织怎么协作、怎么独立发布」。\n\n**练习 2**：哪些情况其实**不该**上微前端？\n\n> 答案：小团队小项目、只有一个技术栈、迭代不频繁——上微前端只会增加「基座/通信/隔离」的复杂度，得不偿失。一句话：先问「要不要独立部署」，要才考虑微前端，否则普通单体 SPA 就够了。\n\n### 总结\n\n我的判断很直接：微前端不是「更高级的写法」，而是「组织复杂度的解法」。它用「独立部署 + 运行时组合」换来团队自治和技术栈自由，代价是引入了隔离、通信、样式冲突等新麻烦。**先确认你有「多团队 / 要渐进升级 / 要独立发布」的真实诉求，再上**；否则单体 SPA 反而更省心。下一节我们横向对比 iframe、single-spa、qiankun、Module Federation 四种主流方案，帮你选对武器。"
  },
  {
    "id": "mf-l2",
    "chapter": "intro",
    "title": "主流方案对比：iframe / single-spa / qiankun / Module Federation",
    "minutes": 30,
    "content": "### 本节目标\n\n- 说出四种方案各自的隔离粒度和核心短板\n- 知道什么项目该选哪种方案\n- 理解「路由级拆分」与「模块级共享」是两条不同路线\n\n微前端落地有四条主流路线，隔离能力和开发体验是跷跷板的两端：\n\n```text\n方案            隔离粒度      独立部署   通信难度   适用场景\n─────────────────────────────────────────────────────────────\niframe          进程级(最彻底)  ✅        难(跨域/PostMessage)  最怕样式冲突、求稳的历史系统嵌入\nsingle-spa      路由级         ✅        中(需自己接通信)      只要路由组合、不要沙箱\nqiankun         路由级+沙箱    ✅        易(全局状态/事件)      中后台、要 JS/样式隔离\nModule Feder.   模块级         ✅        易(import 远程)   组件/函数级共享、现代构建链\n```\n\n**iframe**：最简单也最彻底——每个子应用跑在独立 `<iframe>` 里，JS、DOM、样式天然隔离，浏览器替你搞定。短板是通信只能靠 `postMessage`、路由难统一、弹窗/全屏体验割裂、SEO 差。适合「把老系统原样嵌进来、求稳」。\n\n**single-spa**：路由级组合的开山鼻祖。它只负责「按路由切换挂载哪个子应用」，不提供隔离——JS 全局变量、样式都会互相污染，沙箱和通信要自己接。轻，但坑得自己填。\n\n**qiankun**：基于 single-spa 封装，补齐了最关键的两块——**JS 沙箱**（Proxy 快照隔离全局变量）和**样式隔离**（Shadow DOM / scoped），还自带 `initGlobalState` 通信。中后台微前端的事实标准，开箱即用。\n\n**Module Federation（模块联邦）**：Webpack 5 / Rspack 的原生能力，粒度最细——不是「整页替换」，而是「运行时 import 对方的组件/函数」。子应用独立部署，主应用直接 `import('remote/Button')`。适合「组件级复用、共享依赖」，是现代最热的方向。\n\n### 名词解释\n\n**iframe 沙箱**：浏览器原生的隔离机制，每个 iframe 有独立的 window/document，天然互不污染。代价是通信和路由体验差。\n\n**路由级拆分**：按 URL 路径把页面切成不同子应用（如 `/order/*` 给订单团队、`/goods/*` 给商品团队），single-spa / qiankun 都走这条路线。\n\n**模块级共享**：不切整页，而是运行时直接加载对方的导出（组件、工具函数），Module Federation 走这条路线，粒度更细、复用更灵活。\n\n### 课后练习\n\n**练习 1**：为什么 qiankun 比裸 single-spa 更适合中后台？\n\n> 答案：中后台子应用常「不小心」往 window 挂全局变量、共用 CSS 类名，裸 single-spa 不做隔离会互相污染。qiankun 内置 JS 沙箱 + 样式隔离，把这些坑填平了，团队不用每人都懂沙箱原理也能安全并行。\n\n**练习 2**：Module Federation 和 qiankun 能一起用吗？\n\n> 答案：能，但通常是「二选一」为主。qiankun 解决「整页级组合 + 隔离」，Module Federation 解决「组件级共享」。有的架构用 qiankun 管页面壳、内部再靠 Module Federation 共享公共组件库，属于进阶玩法。\n\n### 总结\n\n选方案的口诀：**求稳嵌入老系统 → iframe；只要路由组合、自己能填沙箱 → single-spa；中后台要开箱隔离 → qiankun；组件/函数级共享、现代构建 → Module Federation**。记住一条主线：iframe/single-spa/qiankun 是「路由级整页组合」，Module Federation 是「模块级细粒度共享」，这是两条本质不同的路线。下两节我们实打实写一遍 qiankun 的基座与子应用。"
  },
  {
    "id": "mf-l3",
    "chapter": "qiankun",
    "title": "基座与子应用：qiankun 接入实战",
    "minutes": 35,
    "content": "### 本节目标\n\n- 写一个 qiankun 基座，注册并启动子应用\n- 让子应用导出 bootstrap / mount / unmount 生命周期\n- 理解 entry 和 props 的作用\n\nqiankun 的核心是「基座注册子应用，子应用暴露生命周期」。基座用 `registerMicroApps` 声明「哪个路由挂哪个子应用、去哪加载它的入口 HTML」，再 `start()` 启动。\n\n```js\n// 运行环境：基座是 Vue3 或 React 项目；先装 qiankun\n// npm i qiankun\n// src/micro.js（基座主文件）\nimport { registerMicroApps, start } from 'qiankun'\n\nregisterMicroApps([\n  {\n    name: 'orderApp',                 // 子应用唯一名\n    entry: '//localhost:7100',        // 子应用跑起来的地址（开发期用端口）\n    container: '#subapp',             // 基座里用于挂载子应用的 DOM 容器\n    activeRule: '/order',             // 访问 /order* 时加载 orderApp\n    props: { token: 'xxx', theme: 'dark' } // 传给子应用的初始化数据\n  },\n  {\n    name: 'goodsApp',\n    entry: '//localhost:7200',\n    container: '#subapp',\n    activeRule: '/goods'\n  }\n])\n\nstart() // 启动 qiankun，之后路由命中 activeRule 就自动挂载对应子应用\n```\n\n子应用这边，要做的只是「把入口改造成导出生命周期」，并把自己挂到 `window.__POWERED_BY_QIANKUN__` 时由基座控制挂载：\n\n```js\n// 运行环境：子应用（以 Vue3 为例）；先装 qiankun（基座子应用都要 qiankun）\n// src/micro-entry.js\nimport { createApp } from 'vue'\nimport App from './App.vue'\n\nlet app = null\nfunction render(props = {}) {\n  app = createApp(App)\n  app.mount('#app') // 注意：容器 id 要和子应用自己 index.html 的挂载点一致\n}\n\n// 关键：导出三个生命周期钩子，基座在对应时机调用\nexport async function bootstrap() {\n  console.log('[orderApp] bootstraped')\n}\nexport async function mount(props) {\n  console.log('[orderApp] props from 基座:', props.token) // 拿到基座传的 props\n  render(props)\n}\nexport async function unmount() {\n  if (app) app.unmount() // 卸载时清掉 Vue 实例，避免内存泄漏/事件残留\n}\n// 独立运行时（直接 npm run dev 不被基座加载）也要能跑\nif (!window.__POWERED_BY_QIANKUN__) {\n  render()\n}\n```\n\n子应用的 `vue.config.js` 还要配 `webpack` 的 `publicPath` 为 `'./'`，让基座能正确加载它的静态资源——这是 qiankun 接入最常见的坑之一。\n\n### 名词解释\n\n**registerMicroApps**：qiankun 基座的注册函数，传入「子应用清单」（名字、入口、容器、激活路由、props）。\n\n**生命周期钩子（bootstrap / mount / unmount）**：子应用必须导出的三个函数。基座在「首次加载 / 每次进入路由 / 离开路由」时分别调用，控制子应用的创建与销毁。\n\n**entry**：子应用对外暴露的入口 HTML 地址（开发期通常是 `localhost:端口`，生产期是子应用自己部署的域名）。基座通过它拉取子应用的 JS/CSS。\n\n**props**：基座在注册时通过 `props` 传给子应用的数据（如登录 token、主题），子应用在 `mount(props)` 里接收。\n\n### 课后练习\n\n**练习 1**：子应用为什么要判 `window.__POWERED_BY_QIANKUN__`？\n\n> 答案：为了让子应用「既能被基座加载、也能自己单独 `npm run dev` 跑」。被基座加载时由基座调用 `mount` 来 `render`；独立运行时没有基座，就要自己直接 `render()`。这个判断就是区分这两种模式。\n\n**练习 2**：`container: '#subapp'` 和子应用自己的挂载点冲突会怎样？\n\n> 答案：qiankun 会把子应用挂载到基座的 `#subapp` 容器里；若子应用 `render()` 又 `mount('#app')` 且基座里没有 `#app`，会找不到节点挂载失败。约定上子应用挂载点 id 要存在，且不要和基座其它节点重名。\n\n### 总结\n\nqiankun 接入就三件事：**基座 `registerMicroApps` + `start`、子应用导出 `bootstrap/mount/unmount`、子应用配 `publicPath`**。props 是把基座数据喂给子应用的通道。最容易踩的坑是子应用 `publicPath` 没设 `./` 导致静态资源 404——记住「子应用对自己的资源要用相对路径」。下一节讲主子和路由怎么共存不打架。"
  },
  {
    "id": "mf-l4",
    "chapter": "qiankun",
    "title": "路由与生命周期：主子和路由如何共存",
    "minutes": 25,
    "content": "### 本节目标\n\n- 理解 activeRule 如何决定「何时挂哪个子应用」\n- 会给子应用设置 base，避免路由冲突\n- 知道子应用卸载时为什么要清状态\n\n微前端的路由是个核心矛盾：**基座有路由，子应用也有路由，两者怎么不打架？** qiankun 的解法是「基座管一级路由（activeRule），子应用在自己的命名空间内管二级路由」。\n\n```js\n// 基座：用 history 模式路由，activeRule 决定子应用边界\n// 访问 /order/list → 命中 activeRule '/order' → 挂载 orderApp\nregisterMicroApps([\n  { name: 'orderApp', entry: '//localhost:7100', container: '#subapp', activeRule: '/order' },\n  { name: 'goodsApp', entry: '//localhost:7200', container: '#subapp', activeRule: '/goods' }\n])\n```\n\n```js\n// 子应用（Vue Router）：必须把自己「钉」在 /order 命名空间下\n// src/router.js\nimport { createRouter, createWebHistory } from 'vue-router'\nconst router = createRouter({\n  // base 要和基座 activeRule 一致，否则子应用内部跳转会跑到基座根路径\n  history: createWebHistory('/order'),\n  routes: [\n    { path: '/list', component: OrderList },  // 实际访问 /order/list\n    { path: '/detail/:id', component: OrderDetail }\n  ]\n})\n```\n\n为什么必须设 `base`？如果子应用用根路径 `/`，它内部的 `/list` 会和基座的 `/` 冲突，浏览器地址会乱跳。把子应用「钉」在 `/order` 下，基座和子应用的路由各管一段，井水不犯河水。\n\n生命周期还要注意**卸载清理**：用户从 `/order` 切到 `/goods` 时，qiankun 调用 orderApp 的 `unmount`。你必须在 `unmount` 里 `app.unmount()`、移除全局监听、清理定时器，否则子应用的 DOM 事件/定时器会残留在基座里，造成内存泄漏或「幽灵事件」。\n\n### 名词解释\n\n**activeRule**：基座注册子应用时写的「激活规则」，通常是路径前缀（如 `/order`）。当前 URL 匹配它，基座就挂载对应子应用。\n\n**base（路由基路径）**：子应用路由的命名空间前缀，要和基座的 activeRule 对齐，保证子应用内部跳转落在自己的区间内。\n\n**卸载清理（unmount cleanup）**：子应用离开时，必须销毁框架实例、移除监听、清定时器，否则会污染基座。\n\n### 课后练习\n\n**练习 1**：activeRule 写成 `'/order'` 和 `'/order/'` 有区别吗？\n\n> 答案：有。qiankun 默认按下标匹配，`'/order'` 能命中 `/order` 和 `/order/list`；具体匹配行为还受 `exactMatch` 等参数影响。一般写不带尾斜杠的前缀最稳，配合子应用 base 一致即可。\n\n**练习 2**：子应用 unmount 里不清理 setInterval 会怎样？\n\n> 答案：定时器仍在跑，且因为闭包持有子应用状态，DOM 已被卸载，定时器回调里操作已不存在的节点会报错，同时造成内存泄漏。所以 `unmount` 里一定要 `clearInterval` 并 `app.unmount()`。\n\n### 总结\n\n路由共存的口诀：**基座用 activeRule 划地盘，子应用用 `base` 把自己钉进同一块地盘**。两者路径前缀对齐，主子和路由各管一段、互不覆盖。别忘了 `unmount` 里做清理——这是微前端「切走还留坑」的头号来源。下一节进入更深的水：JS 沙箱和样式隔离。"
  },
  {
    "id": "mf-l5",
    "chapter": "isolation",
    "title": "JS 沙箱与样式隔离：为什么子应用不能互相污染",
    "minutes": 35,
    "content": "### 本节目标\n\n- 说清「JS 隔离」和「样式隔离」分别解决什么\n- 理解快照沙箱和 Proxy 沙箱的原理差异\n- 知道 qiankun 怎么隔离样式（Shadow DOM / scoped）\n\n微前端最大的隐患是「共享一个 window、共享一张 DOM」。子应用 A 往 `window` 挂了个 `chart`，子应用 B 也挂了同名的，后者覆盖前者——这就是污染。隔离就是给每个子应用「造一个独立运行环境」。\n\n**JS 隔离（沙箱）**。qiankun 早期用「快照沙箱」：\n\n```js\n// 快照沙箱思路（理解用，qiankun 已默认用 Proxy 沙箱）\n// 挂载子应用前：拍下 window 的快照\nconst windowSnapshot = { ...window }\n// 子应用运行，随便改 window.xxx\nwindow.chart = 'A 的图表'\n// 卸载子应用时：恢复快照，把 window 还原成子应用进来前的样子\nfor (const k in windowSnapshot) window[k] = windowSnapshot[k]\n```\n\n问题：快照沙箱**不支持多个子应用同时运行**（还原快照会互相踩）。现代 qiankun 用 **Proxy 沙箱**：给每个子应用造一个假的 `window`（Proxy），子应用读写全局变量都落在自己的 Proxy 上，互不可见、还能同时跑多个。\n\n**样式隔离**。CSS 没有作用域，子应用 A 写了 `.btn { color: red }`，子应用 B 的 `.btn` 就被染红。qiankun 两种手段：\n\n1. **严格样式隔离（实验性）**：用 Shadow DOM 包住子应用，CSS 天然作用域限定在影子树内。\n2. **scoped（默认推荐）**：qiankun 给子应用所有选择器加前缀（如 `div[data-qiankun=\"orderApp\"] .btn`），把样式局限在自己容器内。\n\n```js\n// 基座 start 时开启隔离\nimport { start } from 'qiankun'\nstart({\n  sandbox: { strictStyleIsolation: true } // 用 Shadow DOM 严格隔离（实验性）\n  // 不开启 strictStyleIsolation 时，qiankun 默认走 scoped 加前缀方案\n})\n```\n\n### 名词解释\n\n**沙箱（Sandbox）**：给子应用造的「独立运行空间」，让它对全局变量（window）的读写不影响别的子应用。微前端靠沙箱实现 JS 隔离。\n\n**快照沙箱（Snapshot Sandbox）**：挂载前记录 window 快照、卸载时还原。简单但有「不能多应用并存」的硬伤。\n\n**Proxy 沙箱**：用 `Proxy` 伪造每个子应用专属的 window，读写都落在各自副本上，支持多子应用同时运行，是 qiankun 现代默认方案。\n\n**Shadow DOM 样式隔离**：把子应用装进 Shadow DOM，CSS 作用域天然封闭在影子树内，外部样式进不来、内部样式出不去（实验性特性，有兼容性取舍）。\n\n### 课后练习\n\n**练习 1**：为什么快照沙箱不支持「两个子应用同时显示」？\n\n> 答案：它靠「还原 window 快照」来隔离，但 window 全局只有一份。A 挂载改了 window、还没卸载，B 又挂载再还原快照，会把 A 的改动抹掉。Proxy 沙箱给每个子应用独立副本才解决这个问题。\n\n**练习 2**：strictStyleIsolation（Shadow DOM）有什么代价？\n\n> 答案：Shadow DOM 会挡住「穿透样式」和某些依赖全局 DOM 的第三方库（如弹窗挂在 body 的组件可能失效），所以 qiankun 标它实验性。多数项目用默认的 scoped 加前缀方案更稳。\n\n### 总结\n\n隔离是微前端不「互相污染」的命门：**JS 隔离靠沙箱**（快照简单但不支持并存，Proxy 现代默认、各子应用独立 window）；**样式隔离靠 Shadow DOM 或 scoped 加前缀**（默认 scoped 更稳，strictStyleIsolation 实验性但有兼容代价）。记住：能选 scoped 就别急着上 Shadow DOM。下一节讲子应用之间怎么通信。"
  },
  {
    "id": "mf-l6",
    "chapter": "isolation",
    "title": "应用间通信：全局状态、事件与共享 store",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用 qiankun 的 initGlobalState 做主子通信\n- 理解「自定义事件」作为轻量通信手段\n- 知道什么数据该放共享 store、什么该走 props\n\n子应用各自独立，但业务上常要互通：基座登录后要把 `token` 给子应用；子应用下单成功要通知基座刷新角标。三种常用手段：\n\n**1. qiankun 全局状态 initGlobalState**（最常用）。基座建一个全局 store，主子和都能读能改：\n\n```js\n// 基座\nimport { initGlobalState } from 'qiankun'\nconst actions = initGlobalState({ user: null, cartCount: 0 })\nactions.onGlobalStateChange((state, prev) => {\n  console.log('全局状态变了:', state, '上一个:', prev)\n})\n// 子应用 mount 时拿到 actions，读写全局状态\nexport async function mount(props) {\n  props.onGlobalStateChange((state) => {\n    console.log('子应用收到 user:', state.user)\n  })\n  props.setGlobalState({ cartCount: 3 }) // 子应用改全局状态\n}\n```\n\n**2. 自定义事件（轻量、解耦）**。不想引入 qiankun 耦合时，用浏览器原生 `CustomEvent` 在 window 上广播：\n\n```js\n// 子应用广播\nwindow.dispatchEvent(new CustomEvent('order:paid', { detail: { id: 88 } }))\n// 基座（或任意子应用）监听\nwindow.addEventListener('order:paid', (e) => {\n  console.log('收到支付事件:', e.detail.id)\n})\n```\n\n**3. 共享 store（重场景）**。若多个子应用共用同一套状态（如都用同一个 Vuex/Redux 实例），可把 store 实例通过 props 注入各子应用，实现「真·共享同一份状态」。\n\n数据怎么分？**一次性初始化数据（token、theme）走 props**；**需要跨应用响应式同步的状态（用户信息、购物车角标）走 initGlobalState**；**一次性通知（下单成功）走自定义事件**。\n\n### 名词解释\n\n**initGlobalState**：qiankun 提供的全局状态机制，基座创建后，主子和应用都能通过 `onGlobalStateChange` 监听、`setGlobalState` 修改，实现响应式互通。\n\n**onGlobalStateChange**：订阅全局状态变化的回调，状态被任意一方修改都会触发，拿到「新值 + 旧值」。\n\n**CustomEvent（自定义事件）**：浏览器原生事件机制，适合「一次性通知」型通信，不依赖任何框架，解耦最彻底。\n\n### 课后练习\n\n**练习 1**：props 和 initGlobalState 该分别传什么？\n\n> 答案：props 传「初始化就定好、不常变」的数据（token、theme、用户 id）；initGlobalState 传「运行中会变化、多方要同步」的状态（购物车数量、登录态）。前者像构造参数，后者像响应式 store。\n\n**练习 2**：自定义事件通信最大的坑是什么？\n\n> 答案：监听要在 `unmount` 时 `removeEventListener` 移除，否则子应用切走后事件还在监听，再次进入会「重复绑定」导致回调触发多次。这是微前端事件通信最常见的内存泄漏点。\n\n### 总结\n\n通信三件套：**initGlobalState 做响应式共享（主子互通）、CustomEvent 做一次性通知（解耦）、共享 store 做重场景的同份状态**。口诀——「不变的走 props、变的走全局状态、通知走事件」，且事件监听务必在 unmount 清理。下一节进入现代最热的方向：Module Federation。"
  },
  {
    "id": "mf-l7",
    "chapter": "federation",
    "title": "Module Federation：独立部署、运行时共享组件",
    "minutes": 35,
    "content": "### 本节目标\n\n- 理解 Module Federation 是「模块级」而非「页面级」共享\n- 写出一个 remote（暴露组件）和 host（消费组件）的配置\n- 知道 remotes / exposes 分别干什么\n\nModule Federation（模块联邦，Webpack 5 / Rspack 原生支持）是微前端的「现代派」：**它不切整页，而是让应用之间运行时直接 `import` 对方的组件/函数**，像 import 本地模块一样。每个应用独立部署，谁也不阻塞谁。\n\n设想：组件库团队把 `Button` 暴露在 `remoteLib`，业务团队直接 `import('remoteLib/Button')` 用，业务上线不用等组件库发 npm 包。\n\n```js\n// remote 端（组件库项目 webpack.config.js）：暴露模块给外界\nconst { ModuleFederationPlugin } = require('webpack').container\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'remoteLib',\n      filename: 'remoteEntry.js',      // 对外暴露的入口文件\n      exposes: {\n        './Button': './src/Button.jsx', // 外界可 import('remoteLib/Button')\n        './Modal': './src/Modal.jsx'\n      },\n      shared: ['react', 'react-dom']     // 共享 react，避免重复打包（先占位，下节细讲）\n    })\n  ]\n}\n```\n\n```js\n// host 端（业务项目 webpack.config.js）：消费 remote 暴露的模块\nconst { ModuleFederationPlugin } = require('webpack').container\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'hostApp',\n      remotes: {\n        // key 是 import 时的前缀，value 是 remote 的入口地址\n        remoteLib: 'remoteLib@https://cdn.example.com/remoteEntry.js'\n      },\n      shared: ['react', 'react-dom']\n    })\n  ]\n}\n```\n\n```js\n// host 业务代码：像 import 本地一样 import 远程组件（运行时按需加载）\nimport Button from 'remoteLib/Button'\nfunction Page() {\n  return <Button>来自远程组件库的按钮</Button>\n}\n```\n\n关键点：**remote 和 host 各自独立构建、独立部署**。host 运行时去拉 `remoteEntry.js`，拿到 remote 暴露的组件定义，再动态加载。哪边先发都行（只要 remoteEntry 地址可达）。这就是它比 qiankun「整页组合」灵活的地方——粒度细到「一个组件」。\n\n### 名词解释\n\n**Module Federation（模块联邦）**：Webpack 5 / Rspack 的能力，让多个独立构建的应用在运行时互相 `import` 对方的模块，实现「独立部署 + 模块级共享」。\n\n**exposes**：remote 端声明「我要对外暴露哪些模块、对应什么路径」（如 `./Button`），外界据此路径 import。\n\n**remotes**：host 端声明「我要消费哪些远程应用、它们的入口在哪」（如 `remoteLib@https://.../remoteEntry.js`），是消费方的「地址簿」。\n\n**remoteEntry.js**：remote 端构建产出的「入口清单」文件，里面描述了它暴露了哪些模块、依赖了什么，host 通过这个文件才知道怎么加载。\n\n### 课后练习\n\n**练习 1**：Module Federation 和 qiankun 的隔离思路有何不同？\n\n> 答案：qiankun 是「运行时挂载整页 + 沙箱隔离」，解决页面组合；Module Federation 是「构建期声明共享、运行时 import 模块」，没有沙箱概念，靠构建链保证依赖一致。前者偏「页面自治」，后者偏「组件复用」。\n\n**练习 2**：host import 一个还没部署的 remote 会怎样？\n\n> 答案：运行时去拉 `remoteEntry.js` 会 404 / 网络失败，那个动态 import 的组件加载不出来（通常表现为页面报错或加载中）。所以 Module Federation 要求 remote 的入口地址稳定可达，部署顺序上 remote 先就位更稳。\n\n### 总结\n\nModule Federation 的核心是「**构建期 `exposes`/`remotes` 声明，运行时 `import` 远程模块**」。粒度细到组件级、各应用独立部署、互不阻塞——这是它相对 qiankun「整页组合」的最大优势。代价是依赖一致性要自己管好（下节的 `shared`）。下一节讲 shared 依赖与那些容易翻车的坑。"
  },
  {
    "id": "mf-l8",
    "chapter": "federation",
    "title": "共享依赖与避坑：shared / singleton / 何时别用微前端",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解 shared 如何避免 React 被打包两份\n- 知道 singleton 解决「多份 React 状态不互通」的坑\n- 能列出微前端的常见翻车点与不适用场景\n\nModule Federation 最易翻车的就是「共享依赖」。如果 remote 和 host 都打包了 React，浏览器会加载两份 React——不仅体积翻倍，更严重的是**两份 React 各有各的上下文（Context/Hooks 状态），组件间状态不通、报错频发**。\n\n`shared` 配置就是解决这个：声明「这些依赖由一方提供、各方复用同一份」。\n\n```js\n// host 和 remote 的 webpack.config.js 都配 shared\nnew ModuleFederationPlugin({\n  // ...\n  shared: {\n    react: { singleton: true, requiredVersion: '^18.0.0' },\n    'react-dom': { singleton: true, requiredVersion: '^18.0.0' }\n  }\n})\n```\n\n`singleton: true` 的意思是「全局只允许一份 React」——无论谁先加载，后续方复用这同一份，避免双实例。`requiredVersion` 约定版本范围，版本差太多会告警。\n\n常见翻车点清单：\n\n1. **React 双实例**：没配 `singleton`，状态不互通、Hooks 报错 → 必配 `shared.singleton`。\n2. **remote 先发、host 缓存了旧 remoteEntry**：host 拉的是 CDN 缓存的旧地址 → 给 remoteEntry 加版本查询或「改 URL / 加 `?v=N`」绕缓存。\n3. **循环依赖**：A 消费 B、B 又消费 A → 运行时死锁，重构边界。\n4. **公共依赖版本不一致**：remote 用 lodash@4、host 用 lodash@5，shared 协商失败 → 统一版本或 `shared` 锁定。\n\n最后回到第一课的灵魂一问：**什么时候别用微前端？**\n\n- 团队就一个、技术栈统一、发布节奏一致 → 普通单体 SPA 最省心；\n- 项目小、迭代慢 → 微前端的基座/隔离/通信复杂度是纯负担；\n- 没有「独立部署」诉求 → 那只是普通模块拆分，用 monorepo + 包管理就够了。\n\n### 名词解释\n\n**shared（共享依赖）**：Module Federation 里声明「哪些依赖由应用间共用同一份」，避免每个应用都打包一份（如 React 被打包两次）。\n\n**singleton（单例）**：shared 的一个选项，强制「该依赖全局只有一份实例」，防止双 React 导致状态不通、Hooks 报错。\n\n**版本协商（Version Negotiation）**：remote 和 host 对 shared 依赖版本不一致时，Module Federation 按 `requiredVersion` 尝试匹配，匹配不上会告警或回退，常需手动对齐版本。\n\n### 课后练习\n\n**练习 1**：只写 `shared: ['react']` 不写 singleton 够吗？\n\n> 答案：不够稳。只列名字时 Module Federation 仍可能加载多份 React（不同构建各自带一份），只是「允许共享」。要彻底避免双实例必须加 `singleton: true`，这是生产环境必选项。\n\n**练习 2**：微前端能解决「团队沟通差」吗？\n\n> 答案：不能，反而放大。微前端解决的是「技术/部署层面的自治」，但接口契约、版本对齐、依赖共享仍需团队约定。组织问题不能靠架构甩锅——契约不清，微前端只会让 bug 分布得更散。\n\n### 总结\n\nModule Federation 的避坑核心就一句：**shared 必配 `singleton`，否则双 React 状态不通**。再加三道防线——remoteEntry 防缓存（改 URL/加 `?v=N`）、避免循环依赖、统一公共依赖版本。最后把第一课的结论钉死：**微前端是「独立部署诉求」的解法，没有这诉求就别上**。八节课走完，你已能从「为什么」到「qiankun 接入」再到「Module Federation 共享」完整选型落地了。"
  }
]

export const microfePlan = [
  {
    "day": 1,
    "title": "什么是微前端：浏览器里的「微服务」",
    "lessons": [
      "mf-l1"
    ]
  },
  {
    "day": 2,
    "title": "主流方案对比：iframe / single-spa / qiankun / Module Federation",
    "lessons": [
      "mf-l2"
    ]
  },
  {
    "day": 3,
    "title": "基座与子应用：qiankun 接入实战",
    "lessons": [
      "mf-l3"
    ]
  },
  {
    "day": 4,
    "title": "路由与生命周期：主子和路由如何共存",
    "lessons": [
      "mf-l4"
    ]
  },
  {
    "day": 5,
    "title": "JS 沙箱与样式隔离：为什么子应用不能互相污染",
    "lessons": [
      "mf-l5"
    ]
  },
  {
    "day": 6,
    "title": "应用间通信：全局状态、事件与共享 store",
    "lessons": [
      "mf-l6"
    ]
  },
  {
    "day": 7,
    "title": "Module Federation：独立部署、运行时共享组件",
    "lessons": [
      "mf-l7"
    ]
  },
  {
    "day": 8,
    "title": "共享依赖与避坑：shared / singleton / 何时别用微前端",
    "lessons": [
      "mf-l8"
    ]
  }
]
