// 微前端面试题（10 题）
export const microFrontendQuestions = [
  {
    id: 'mf-001',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'easy',
    tags: ['概念', '解决的问题', '场景'],
    question: '什么是微前端？它解决什么问题？',
    answer: `**微前端**是把前端应用**按业务/团队拆成多个独立开发、独立部署、运行时组合**的架构，类比后端的微服务。

**解决的问题**：

- 巨石应用（monolith）越来越大、构建慢、技术栈锁定
- 多个团队想用不同框架（React/Vue/Angular）共存
- 独立部署：某业务更新不必全量发布整个应用
- 老系统渐进式重构（新模块用新技术，旧模块保留）

\`\`\`text
单体应用  ──拆分──►  [团队A: React] [团队B: Vue] [团队C: 遗留jQuery]  ──运行时组合──► 一个产品
\`\`\`

> 不是银弹：带来通信、隔离、运维复杂度，小项目别上。`
  },
  {
    id: 'mf-002',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'medium',
    tags: ['qiankun', '基座', '子应用'],
    question: 'qiankun 的实现原理是怎样的？',
    answer: `qiankun 是阿里开源、基于 **single-spa** 的微前端方案，采用「**主应用（基座）+ 子应用**」模式：

1. **注册子应用**：主应用用 \`registerMicroApps\` 声明子应用的入口（HTML entry 或 JS entry）、激活路由、挂载容器
2. **路由劫持**：监听 URL 变化，命中某子应用路由时加载它
3. **资源加载**：拉取子应用 HTML，解析出 JS/CSS，做 JS 沙箱 + 样式隔离后执行
4. **生命周期**：依次调用子应用的 \`bootstrap / mount / unmount\`

\`\`\`js
import { registerMicroApps, start } from 'qiankun'
registerMicroApps([
  { name: 'sub-vue', entry: '//localhost:7100', container: '#subapp', activeRule: '/vue' }
])
start()
\`\`\`

> qiankun 的核心价值是**帮我们处理了沙箱隔离、样式隔离、资源加载**这些脏活。`
  },
  {
    id: 'mf-003',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'medium',
    tags: ['样式隔离', 'Shadow DOM', 'scoped'],
    question: '微前端如何做样式隔离（CSS 互不污染）？',
    answer: `几种隔离手段：

1. **Shadow DOM**（最强）：把子应用挂到 Shadow Root 内，样式天然不泄漏（但弹窗/全局样式会受限，且部分 UI 库兼容性差）
2. **动态样式表 + 作用域前缀**：qiankun 默认给子应用所有 CSS 选择器加前缀（如 \`div[data-qiankun=sub]\`），运行时切换时增删样式表
3. **CSS Modules / scoped**：子应用内部用局部作用域类名（Vue scoped、CSS Modules），降低冲突概率
4. **约定命名空间**：团队间用 BEM 风格前缀（如 \`app-a-*\`）

> 实践中 qiankun 的「动态样式表 + 前缀改写」是最常用、兼容性最好的方案；Shadow DOM 隔离最彻底但有局限性。`
  },
  {
    id: 'mf-004',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'hard',
    tags: ['JS沙箱', 'Snapshot', 'Proxy'],
    question: '微前端的 JS 沙箱（Sandbox）是怎么实现的？快照沙箱 vs Proxy 沙箱？',
    answer: `JS 沙箱让多个子应用**互不污染全局变量（window）**。

- **快照沙箱（Snapshot）**：子应用挂载前记录 window 快照，卸载时还原、挂载时恢复各自的增改。实现简单，但**不支持多个子应用同时激活**（会互相覆盖快照）

\`\`\`js
// 伪代码
const snapshot = {}
function mount() { for (k in window) snapshot[k] = window[k] /* 保存 */; applyAppGlobals() }
function unmount() { for (k in window) delete window[k]; restore(snapshot) }
\`\`\`

- **Proxy 沙箱（主流）**：用 \`new Proxy(window, {...})\` 为每个子应用创建**独立的 fakeWindow**，读写都落在自己的沙箱对象上，原 window 不动。支持**多实例并发**、更安全

> qiankun 现代版本默认用 Proxy 沙箱（兼容降级到快照）；iframe 方案则天然靠浏览器的同源隔离。`
  },
  {
    id: 'mf-005',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'medium',
    tags: ['通信', 'props', '全局状态'],
    question: '微前端应用之间如何通信？',
    answer: `常见方式：

1. **主应用下发 props**：qiankun 在注册子应用时通过 \`props\` 传入共享状态/方法，子应用在 \`mount(props)\` 接收
2. **全局状态（Shared State）**：主应用维护一个可被各子应用 import 的 store（如基于 \`window\` 沙箱共享、或发布订阅），qiankun 提供 \`initGlobalState\`
3. **事件总线（Event Bus / mitt）**：各应用订阅同一总线发消息
4. **URL / 路由参数**：通过 query/state 传递

\`\`\`js
// 主应用
const actions = initGlobalState({ user: null })
actions.onGlobalStateChange((state) => console.log(state))
// 子应用
props.setGlobalState({ user: 'laowen' })
\`\`\`

> 原则：通信应**最小化、显式化**，避免过度耦合（否则又回到巨石）。`
  },
  {
    id: 'mf-006',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'medium',
    tags: ['公共依赖', 'shared', 'externals'],
    question: '微前端如何共享公共依赖（如 React、Vue）避免重复加载？',
    answer: `每个子应用都打包一份 React/Vue 会**体积爆炸、且多份 React 实例导致状态不互通**。解决方案：

1. **externals + CDN**：主应用通过 \`<script>\` 引入 React 并挂到 window，子应用 webpack 配 \`externals: { react: 'React' }\` 不打包，运行时复用
2. **Module Federation 的 shared**：声明 \`shared: { react: { singleton: true } }\`，由运行时保证只加载一份且版本协商
3. **qiankun 的 import-map / 共享依赖**：通过构建插件统一去重

\`\`\`js
// webpack
externals: { react: 'React', 'react-dom': 'ReactDOM' }
\`\`\`

> 关键：依赖要**单例（singleton）**，否则多个 React 实例会让 Context/hooks 失效。`
  },
  {
    id: 'mf-007',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'medium',
    tags: ['路由', '劫持', '分发'],
    question: '微前端的路由是如何劫持与分发的？',
    answer: `主应用需要**统一控制哪个子应用被激活**，因此要劫持路由：

- **hash 路由**：监听 \`hashchange\`，根据 \`#/sub-a/...\` 前缀激活对应子应用（简单、不依赖服务端）
- **history 路由**：监听 \`popstate\`（及拦截 \`pushState/replaceState\`），匹配 \`activeRule\`（如 \`/sub-a\`）激活

\`\`\`text
用户访问 /sub-vue/list
  → 主应用路由监听命中 activeRule '/sub-vue'
  → 加载并挂载 Vue 子应用，把 /list 交给它内部路由处理
\`\`\`

**注意**：子应用内部路由要基于「主应用分配的基路径」，否则会误触发主应用或其它子应用。qiankun 会在子应用配置 \`base\` 时自动处理。`
  },
  {
    id: 'mf-008',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'hard',
    tags: ['iframe', '隔离', '优劣'],
    question: '用 iframe 做微前端有什么优缺点？',
    answer: `**优点（隔离最彻底）**：

- 浏览器原生隔离：JS 沙箱、样式隔离、DOM 隔离**天然成立**，几乎零冲突
- 独立部署、独立运行，技术栈完全无关

**缺点**：

- **通信麻烦**：父子/子子间靠 \`postMessage\`，类型不安全、调试难
- **体验割裂**：iframe 有独立滚动条、弹窗无法跨域溢出、路由/浏览器前进后退不同步
- **性能**：每个 iframe 是独立文档，内存/加载开销大
- SEO/可访问性差

> 适用：集成**第三方/遗留系统**（只求隔离、不求深度融合）。追求融合体验的产品级微前端多用 qiankun/Module Federation。`
  },
  {
    id: 'mf-009',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'hard',
    tags: ['Module Federation', 'Webpack5', '运行时共享'],
    question: 'Module Federation 如何实现微前端？和 qiankun 有何区别？',
    answer: `Module Federation（Webpack5/Vite 插件）让**多个独立构建的应用在运行时互相加载对方导出的模块**，天然适合微前端：

\`\`\`js
// app1 暴露组件
new ModuleFederationPlugin({ name: 'app1', filename: 'remoteEntry.js', exposes: { './Button': './src/Button' }, shared: { react: { singleton: true } } })
// app2 消费
remotes: { app1: 'app1@https://app1.com/remoteEntry.js' }
import Button from 'app1/Button'
\`\`\`

**与 qiankun 区别**：

- qiankun：**基座模式**，主应用统一调度子应用（HTML entry、路由劫持、沙箱），子应用是「整站」
- MF：**组件/模块级**共享，没有强制基座，更轻、更灵活，但需要自己处理加载/隔离；它解决的是「运行时共享代码/依赖」

> 实践中两者可结合：用 MF 共享组件与依赖，用基座/路由做应用级编排。`
  },
  {
    id: 'mf-010',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'medium',
    tags: ['部署', '版本', '灰度'],
    question: '微前端的部署与版本管理有什么要注意的？',
    answer: `微前端是**多应用独立部署**，需注意：

1. **入口解耦**：子应用独立构建部署到各自域名/CDN，主应用只配置入口 URL（不打包子应用代码）
2. **版本协商**：用 Module Federation 的 \`shared\` 做依赖版本兼容；基座与子应用 React/Vue 大版本要一致
3. **灰度/回滚**：子应用可按 URL/用户分桶灰度，单个子应用出问题只影响自己，回滚快
4. **入口可用性**：主应用要处理子应用加载失败（超时/404）的兜底 UI，避免整页崩溃
5. **CI/CD**：每个子应用独立流水线；基座变动需考虑与所有子应用的兼容

> 关键认知：微前端把「发布耦合」打散成「运行时耦合」，对**契约/接口的稳定性**要求更高。`
  }
]
