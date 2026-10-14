export const microFrontendQuestions = [
  {
    "id": "fw-035",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "微前端",
      "架构",
      "qiankun"
    ],
    "question": "什么是微前端？有哪些实现方案？",
    "answer": "**微前端**是将大型前端应用拆分为多个独立的小应用，各自开发、部署、运行。\n\n### 为什么需要微前端\n\n- **巨石应用难以维护**：一个项目几百万行代码\n- **独立部署**：各团队独立发布\n- **技术栈无关**：不同子应用可以用不同框架\n- **增量迁移**：逐步从旧框架迁移到新框架\n\n### 实现方案\n\n### 1. qiankun（基于 single-spa）\n\n```javascript\n// 主应用\nimport { registerMicroApps, start } from 'qiankun'\n\nregisterMicroApps([\n  {\n    name: 'react-app',\n    entry: '//localhost:7100',\n    container: '#sub-app',\n    activeRule: '/react'\n  },\n  {\n    name: 'vue-app',\n    entry: '//localhost:7101',\n    container: '#sub-app',\n    activeRule: '/vue'\n  }\n])\n\nstart()\n```\n\n**原理**：通过 JS 沙箱加载子应用，路由匹配时挂载子应用。\n\n### 2. Module Federation（Webpack 5）\n\n```javascript\n// 子应用 webpack.config.js\nnew ModuleFederationPlugin({\n  name: 'remoteApp',\n  filename: 'remoteEntry.js',\n  exposes: {\n    './Button': './src/Button'\n  },\n  shared: ['react', 'react-dom']\n})\n\n// 主应用\nnew ModuleFederationPlugin({\n  name: 'hostApp',\n  remotes: {\n    remoteApp: 'remoteApp@http://localhost:7100/remoteEntry.js'\n  }\n})\n\n// 使用远程组件\nconst RemoteButton = React.lazy(() => import('remoteApp/Button'))\n```\n\n### 3. iframe（最简单但最隔离）\n\n```html\n<iframe src=\"http://localhost:7100\" />\n```\n- ✅ 完全隔离（JS、CSS、路由）\n- ❌ 性能差、通信困难、UX 差（弹窗被限制在 iframe 内）\n\n### 4. Web Components\n\n```javascript\nclass MyComponent extends HTMLElement {\n  connectedCallback() {\n    const shadow = this.attachShadow({ mode: 'open' })\n    shadow.innerHTML = `<style>:host { color: red }</style><div>Custom</div>`\n  }\n}\ncustomElements.define('my-component', MyComponent)\n```\n\n### 5. NPM 包（组件级微前端）\n\n```javascript\n// 将组件发布为 npm 包\nimport SharedButton from '@team/button'\n```\n- ✅ 简单、类型安全\n- ❌ 需要重新构建发布、不能独立部署\n\n### 方案对比\n\n| 方案 | 隔离性 | 独立部署 | 通信 | 性能 | 复杂度 |\n|------|--------|----------|------|------|--------|\n| qiankun | JS 沙箱 | ✅ | postMessage | 中 | 中 |\n| Module Federation | 部分 | ✅ | 直接调用 | 好 | 中 |\n| iframe | 完全 | ✅ | postMessage | 差 | 低 |\n| Web Components | Shadow DOM | ✅ | 属性/事件 | 好 | 高 |\n| NPM 包 | 无 | ❌ | 直接调用 | 最好 | 最低 |\n\n### 什么场景用微前端\n- ✅ 大型企业应用，多团队协作\n- ✅ 需要技术栈迁移（Vue2 → Vue3）\n- ✅ 多个独立产品需要整合为一个门户\n- ❌ 中小型项目（过度设计）\n- ❌ 简单的组件复用（用 NPM 包即可）\n\n### 常见问题\n1. **CSS 隔离**：Shadow DOM 或 CSS Modules\n2. **JS 沙箱**：Proxy 代理 window\n3. **通信**：CustomEvent、postMessage、全局状态\n4. **路由**：基座应用统一管理路由"
  },
  {
    "id": "be-030",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "低代码",
      "前端架构",
      "趋势"
    ],
    "question": "前端架构有哪些常见模式？微前端、低代码、BFF 是什么？",
    "answer": "### 前端架构演进\n\n```text\n单体应用 → 组件化 → 模块化 → 微前端 → 低代码\n```\n\n### 1. BFF（Backend for Frontend）\n\n为前端定制的后端层，聚合多个微服务的数据。\n\n```text\n前端 → BFF → 微服务A、微服务B、微服务C\n      ↑\n   数据聚合、格式转换、缓存\n```\n\n**优势：**\n- 前端只需一次请求获取所有数据\n- 避免前端直接依赖多个服务\n- 可以做数据裁剪和格式转换\n\n**技术栈：** Node.js (Nest.js / Express)、GraphQL\n\n```javascript\n// BFF 示例\napp.get('/dashboard', async (req, res) => {\n  const [user, orders, notifications] = await Promise.all([\n    userService.getUser(req.userId),\n    orderService.getOrders(req.userId),\n    notificationService.getNotifications(req.userId)\n  ])\n  res.json({ user, orders, notifications })\n})\n```\n\n### 2. Monorepo（单仓库多项目）\n\n```text\nmy-project/\n├── packages/\n│   ├── ui/          # 共享 UI 组件库\n│   ├── utils/       # 共享工具函数\n│   ├── types/       # 共享类型定义\n│   ├── web/         # Web 应用\n│   ├── mobile/      # 移动应用\n│   └── admin/       # 管理后台\n├── package.json\n└── turbo.json       # Turborepo 配置\n```\n\n**工具：** Turborepo、Nx、pnpm workspaces\n\n### 3. 低代码（Low-Code）\n\n通过可视化拖拽生成页面，减少手写代码。\n\n**核心能力：**\n- 可视化编辑器\n- 组件物料库\n- 属性配置面板\n- 代码生成/运行时渲染\n- 数据源绑定\n\n```javascript\n// 页面 Schema\n{\n  \"type\": \"page\",\n  \"children\": [\n    {\n      \"type\": \"form\",\n      \"props\": { \"title\": \"用户信息\" },\n      \"children\": [\n        { \"type\": \"input\", \"props\": { \"label\": \"姓名\", \"field\": \"name\" } },\n        { \"type\": \"select\", \"props\": { \"label\": \"角色\", \"field\": \"role\", \"options\": [...] } }\n      ]\n    }\n  ]\n}\n\n// 渲染器\nfunction renderSchema(node) {\n  const Component = componentMap[node.type]\n  return (\n    <Component {...node.props}>\n      {node.children?.map(renderSchema)}\n    </Component>\n  )\n}\n```\n\n### 4. 微前端\n\n（详见 FW-035）\n\n### 5. 组件库设计\n\n```javascript\n// 设计系统\n├── tokens/          # 设计变量（颜色、间距、字体）\n├── primitives/      # 原子组件（Button、Input）\n├── components/      # 业务组件（Form、Table）\n├── templates/       # 页面模板\n└── theme/           # 主题配置\n```\n\n**Headless UI 趋势：**\n```javascript\n// 逻辑与 UI 分离\n// Headless Hooks（如 @tanstack/react-table）\nconst table = useTable({ columns, data })\n// table.getRowModel() 等纯逻辑 API\n// 你自己写 UI\n```\n\n### 架构选择\n\n| 场景 | 推荐架构 |\n|------|----------|\n| 小型项目 | 组件化 + Vite |\n| 中型项目 | 模块化 + 状态管理 |\n| 大型项目 | Monorepo + 微前端 |\n| 中后台 | 低代码平台 |\n| 多端统一 | Taro / uni-app / React Native |\n\n### 前端趋势\n1. **AI 辅助开发**：AI 生成代码、组件\n2. **边缘计算**：Edge Functions（Vercel/Cloudflare Workers）\n3. **Server Components**：React RSC\n4. **WebAssembly**：高性能前端应用\n5. **跨端统一**：Flutter / Taro / uni-app"
  },
  {
    "id": "mf-001",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "微前端边界",
      "巨石拆解",
      "渐进式迁移",
      "架构治理"
    ],
    "question": "微前端架构拆分边界如何划定？巨石前端应用（Monolith）渐进式拆解为微前端的落地路线图是怎样的？",
    "answer": "在明确微前端基本概念后，架构设计面试最关心的问题是：**“什么时候绝对不该上微前端？如果决定拆解一个百万行代码的存量巨石应用（Monolith），如何保证业务不停服地完成渐进式迁移？”**\n\n### 一、 微前端拆分边界决策矩阵（何时拆 vs 何时用 Monorepo）\n\n| 评估维度 | 适合采用 **Monorepo + 组件/模块共享** | 适合采用 **微前端（Runtime 独立部署）** |\n| :--- | :--- | :--- |\n| **团队组织架构** | 单一团队或紧密协作的 2～3 个小组，技术栈统一 | 跨部门多团队自治，或历史并购导致 React / Vue2 / Vue3 多代技术栈并存 |\n| **发布频率耦合度** | 各业务模块可跟随统一发布火车（Release Train）同步发版 | 核心底座追求极高稳定性，而营销/报表子模块需每天独立高频热发版 |\n| **运行时隔离诉求** | 低，共用同一套构建流水线与全局路由 | 极高，单个子模块崩溃或内存泄漏不能拖垮整个工作台底座 |\n\n### 二、 巨石应用（Monolith）渐进式拆解路线图（绞杀者模式 Strangler Fig）\n\n1. **阶段一：路由与状态解耦（在巨石内部划清防腐层）**：先在存量巨石应用内部按一级业务域（如 `/crm/*`、`/billing/*`）收敛路由，禁止跨业务域直接 `import` 内部 Store 状态。\n2. **阶段二：抽离轻薄基座（App Shell）**：构建极简基座，仅保留 **“统一登录鉴权（SSO Token）+ 顶部/侧边导航栏 + 子应用注册表加载器”**，严禁在基座中写具体业务页面。\n3. **阶段三：新业务先行外挂 + 存量模块按路由灰度切流**：\n\n```javascript\nasync function bootstrapMicroApps() {\n  const registry = await fetch('/api/micro-apps-manifest.json').then((r) => r.json())\n\n  const apps = registry.map((app) => ({\n    name: app.name,\n    entry: app.canaryEntry && isCanaryUser() ? app.canaryEntry : app.entry,\n    container: '#subapp-viewport',\n    activeRule: app.activeRule,\n    props: {\n      authToken: getAuthToken(),\n      onNavigate: (path) => window.history.pushState(null, '', path),\n    }\n  }))\n\n  registerMicroApps(apps)\n  start({ prefetch: 'all', sandbox: { experimentalStyleIsolation: true } })\n}\n```"
  },
  {
    "id": "mf-002",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "qiankun",
      "基座",
      "子应用"
    ],
    "question": "qiankun 的实现原理是怎样的？",
    "answer": "qiankun 是阿里开源、基于 **single-spa** 的微前端方案，采用「**主应用（基座）+ 子应用**」模式：\n\n1. **注册子应用**：主应用用 `registerMicroApps` 声明子应用的入口（HTML entry 或 JS entry）、激活路由、挂载容器\n2. **路由劫持**：监听 URL 变化，命中某子应用路由时加载它\n3. **资源加载**：拉取子应用 HTML，解析出 JS/CSS，做 JS 沙箱 + 样式隔离后执行\n4. **生命周期**：依次调用子应用的 `bootstrap / mount / unmount`\n\n```js\nimport { registerMicroApps, start } from 'qiankun'\nregisterMicroApps([\n  { name: 'sub-vue', entry: '//localhost:7100', container: '#subapp', activeRule: '/vue' }\n])\nstart()\n```\n\n> qiankun 的核心价值是**帮我们处理了沙箱隔离、样式隔离、资源加载**这些脏活。\n\n### 微前端生产环境稳定性与隔离治理清单\n\n| 治理维度 | 常见线上故障现象 | 根治方案与架构规范 |\n| :--- | :--- | :--- |\n| **JS 沙箱逃逸与内存泄漏** | 子应用卸载后 `window.addEventListener('resize')` 或 `setInterval` 仍在后台狂跑 | 在沙箱层重写 `window.addEventListener` 与 `setInterval` 记录句柄，子应用 `unmount` 时自动批量清除 |\n| **路由冲突与死循环** | 主子应用同时监听 `popstate` 互相重定向导致浏览器卡死 | 主应用按一级路由前缀（`/app-a/*`）分发，子应用 Router 配置对应的 `base: '/app-a'`，跨应用跳转统一调用主应用下发的 `navigate` |\n| **静态资源相对路径 404** | 子应用图片/字体/异步 Chunk 请求到了主应用域名下 | 构建期图片转 Base64 或配置完整 CDN 域名，入口第一行注入 `__webpack_public_path__` |\n\n```javascript\n// 微前端带副作用自动回收能力的增强型 Proxy 沙箱（支持自动清理未解绑的事件与定时器）\nexport class CleanableProxySandbox {\n  constructor() {\n    this.fakeWindow = Object.create(null)\n    this.intervals = new Set()\n    this.listeners = []\n\n    const rawWindow = window\n    this.proxy = new Proxy(this.fakeWindow, {\n      get: (target, prop) => {\n        if (prop === 'setInterval') {\n          return (fn, delay, ...args) => {\n            const id = rawWindow.setInterval(fn, delay, ...args)\n            this.intervals.add(id)\n            return id\n          }\n        }\n        if (prop === 'addEventListener') {\n          return (type, listener, options) => {\n            this.listeners.push({ type, listener, options })\n            return rawWindow.addEventListener(type, listener, options)\n          }\n        }\n        const val = prop in target ? target[prop] : rawWindow[prop]\n        return typeof val === 'function' ? val.bind(rawWindow) : val\n      },\n      set: (target, prop, value) => {\n        target[prop] = value\n        return true\n      }\n    })\n  }\n\n  inactive() {\n    // 子应用卸载时，一键回收所有遗留定时器与全局事件监听，彻底杜绝内存泄漏！\n    for (const id of this.intervals) window.clearInterval(id)\n    this.intervals.clear()\n    for (const { type, listener, options } of this.listeners) {\n      window.removeEventListener(type, listener, options)\n    }\n    this.listeners.length = 0\n  }\n}\n```"
  },
  {
    "id": "mf-003",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "样式隔离",
      "Shadow DOM",
      "scoped"
    ],
    "question": "微前端如何做样式隔离（CSS 互不污染）？",
    "answer": "在微前端架构中，多个子应用（可能分别使用 Tailwind、Ant Design、Element Plus 或全局 Reset 样式）同屏或切换运行时，极易发生**全局类名冲突与样式覆盖污染**。工业界主流有四套递进的样式隔离方案。\n\n### 一、 四种微前端样式隔离方案对比\n\n| 隔离方案 | 隔离强度 | 实现原理 | 核心优势 | 致命短板与踩坑点 |\n| :--- | :--- | :--- | :--- | :--- |\n| **1. 动态样式表卸载（Dynamic Stylesheet）** | 仅主/子切换隔离（同屏不隔离） | 子应用激活（mount）时插入其 `<link>`/`<style>`，卸载（unmount）时从 DOM 移除 | 零改造成本 | 主应用与当前激活子应用之间、或两个同屏挂载的子应用之间仍会互相污染 |\n| **2. 运行时 CSS Scoped 重写（`experimentalStyleIsolation`）** | 强（选择器级隔离） | qiankun 在运行时解析子应用 `<style>` 的 `CSSRule`，自动为每条规则前置加上 `div[data-qiankun=\"subApp\"]` 属性选择器 | 兼容性好，不改变 DOM 结构 | 子应用挂在 `document.body` 下的弹窗（Modal / Tooltip / Dropdown）脱离了容器，导致弹窗样式全部丢失！ |\n| **3. Shadow DOM 硬件级隔离（`strictStyleIsolation` / 无界 wujie）** | **最强（浏览器原生隔离）** | 将子应用完整挂载在 `attachShadow({ mode: 'open' })` 的 Shadow Root 内部 | 内部样式绝对不外泄，外部样式（除继承属性外）不穿透 | 同样存在 `body.appendChild` 逃逸问题，且部分旧版 React 16 事件委托或字体图标（`@font-face` 必须挂在主文档）需特殊适配 |\n| **4. 构建期工程规范（CSS Modules / Scoped / 统一前缀）** | 强（零运行时开销） | 构建期开启 CSS Modules、Vue `<style scoped>`，并配置组件库 `prefixCls`（如 `ant-` → `crm-ant-`） | 零运行时解析损耗，弹窗挂在 `body` 也不会丢样式 | 需子应用构建配置配合改造 |\n\n### 二、 核心代码：手写 qiankun 运行时 CSS 选择器前缀重写器与弹窗修复\n\n```javascript\n// 1. 模拟 qiankun experimentalStyleIsolation：运行时为子应用样式规则自动注入容器前缀\nfunction scopeCssText(cssText, prefix = 'div[data-qiankun=\"sub-crm\"]') {\n  return cssText.replace(\n    /([^\r\n,{}]+)(,(?=[^}]*{)|\\s*{)/g,\n    (match, selector, delimiter) => {\n      const trimmed = selector.trim()\n      // 跳过 @keyframes / @media 等规则头，将 html / body 替换为子应用容器选择器\n      if (trimmed.startsWith('@') || trimmed.startsWith('from') || trimmed.startsWith('to') || /%$/.test(trimmed)) {\n        return match\n      }\n      if (/^(html|body|:root)$/i.test(trimmed)) {\n        return `${prefix}${delimiter}`\n      }\n      return `${prefix} ${trimmed}${delimiter}`\n    }\n  )\n}\n\n// 2. 生产级必配：修复子应用 Modal / Select 弹窗挂载到 document.body 导致样式丢失的问题\n// 以 Ant Design ConfigProvider 为例，强制将所有浮层挂载回子应用自己的隔离容器内，并定制专属类名前缀：\n// <ConfigProvider prefixCls=\"sub-crm-ant\" getPopupContainer={() => document.getElementById('sub-crm-root')}>\n```"
  },
  {
    "id": "mf-004",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "hard",
    "tags": [
      "JS沙箱",
      "Snapshot",
      "Proxy"
    ],
    "question": "微前端的 JS 沙箱（Sandbox）是怎么实现的？快照沙箱 vs Proxy 沙箱？",
    "answer": "JS 沙箱让多个子应用**互不污染全局变量（window）**。\n\n- **快照沙箱（Snapshot）**：子应用挂载前记录 window 快照，卸载时还原、挂载时恢复各自的增改。实现简单，但**不支持多个子应用同时激活**（会互相覆盖快照）\n\n```js\n// 伪代码\nconst snapshot = {}\nfunction mount() { for (k in window) snapshot[k] = window[k] /* 保存 */; applyAppGlobals() }\nfunction unmount() { for (k in window) delete window[k]; restore(snapshot) }\n```\n\n- **Proxy 沙箱（主流）**：用 `new Proxy(window, {...})` 为每个子应用创建**独立的 fakeWindow**，读写都落在自己的沙箱对象上，原 window 不动。支持**多实例并发**、更安全\n\n> qiankun 现代版本默认用 Proxy 沙箱（兼容降级到快照）；iframe 方案则天然靠浏览器的同源隔离。\n\n### 微前端生产环境稳定性与隔离治理清单\n\n| 治理维度 | 常见线上故障现象 | 根治方案与架构规范 |\n| :--- | :--- | :--- |\n| **JS 沙箱逃逸与内存泄漏** | 子应用卸载后 `window.addEventListener('resize')` 或 `setInterval` 仍在后台狂跑 | 在沙箱层重写 `window.addEventListener` 与 `setInterval` 记录句柄，子应用 `unmount` 时自动批量清除 |\n| **路由冲突与死循环** | 主子应用同时监听 `popstate` 互相重定向导致浏览器卡死 | 主应用按一级路由前缀（`/app-a/*`）分发，子应用 Router 配置对应的 `base: '/app-a'`，跨应用跳转统一调用主应用下发的 `navigate` |\n| **静态资源相对路径 404** | 子应用图片/字体/异步 Chunk 请求到了主应用域名下 | 构建期图片转 Base64 或配置完整 CDN 域名，入口第一行注入 `__webpack_public_path__` |\n\n```javascript\n// 微前端带副作用自动回收能力的增强型 Proxy 沙箱（支持自动清理未解绑的事件与定时器）\nexport class CleanableProxySandbox {\n  constructor() {\n    this.fakeWindow = Object.create(null)\n    this.intervals = new Set()\n    this.listeners = []\n\n    const rawWindow = window\n    this.proxy = new Proxy(this.fakeWindow, {\n      get: (target, prop) => {\n        if (prop === 'setInterval') {\n          return (fn, delay, ...args) => {\n            const id = rawWindow.setInterval(fn, delay, ...args)\n            this.intervals.add(id)\n            return id\n          }\n        }\n        if (prop === 'addEventListener') {\n          return (type, listener, options) => {\n            this.listeners.push({ type, listener, options })\n            return rawWindow.addEventListener(type, listener, options)\n          }\n        }\n        const val = prop in target ? target[prop] : rawWindow[prop]\n        return typeof val === 'function' ? val.bind(rawWindow) : val\n      },\n      set: (target, prop, value) => {\n        target[prop] = value\n        return true\n      }\n    })\n  }\n\n  inactive() {\n    // 子应用卸载时，一键回收所有遗留定时器与全局事件监听，彻底杜绝内存泄漏！\n    for (const id of this.intervals) window.clearInterval(id)\n    this.intervals.clear()\n    for (const { type, listener, options } of this.listeners) {\n      window.removeEventListener(type, listener, options)\n    }\n    this.listeners.length = 0\n  }\n}\n```"
  },
  {
    "id": "mf-005",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "通信",
      "props",
      "全局状态"
    ],
    "question": "微前端应用之间如何通信？",
    "answer": "常见方式：\n\n1. **主应用下发 props**：qiankun 在注册子应用时通过 `props` 传入共享状态/方法，子应用在 `mount(props)` 接收\n2. **全局状态（Shared State）**：主应用维护一个可被各子应用 import 的 store（如基于 `window` 沙箱共享、或发布订阅），qiankun 提供 `initGlobalState`\n3. **事件总线（Event Bus / mitt）**：各应用订阅同一总线发消息\n4. **URL / 路由参数**：通过 query/state 传递\n\n```js\n// 主应用\nconst actions = initGlobalState({ user: null })\nactions.onGlobalStateChange((state) => console.log(state))\n// 子应用\nprops.setGlobalState({ user: 'laowen' })\n```\n\n> 原则：通信应**最小化、显式化**，避免过度耦合（否则又回到巨石）。\n\n### 微前端生产环境稳定性与隔离治理清单\n\n| 治理维度 | 常见线上故障现象 | 根治方案与架构规范 |\n| :--- | :--- | :--- |\n| **JS 沙箱逃逸与内存泄漏** | 子应用卸载后 `window.addEventListener('resize')` 或 `setInterval` 仍在后台狂跑 | 在沙箱层重写 `window.addEventListener` 与 `setInterval` 记录句柄，子应用 `unmount` 时自动批量清除 |\n| **路由冲突与死循环** | 主子应用同时监听 `popstate` 互相重定向导致浏览器卡死 | 主应用按一级路由前缀（`/app-a/*`）分发，子应用 Router 配置对应的 `base: '/app-a'`，跨应用跳转统一调用主应用下发的 `navigate` |\n| **静态资源相对路径 404** | 子应用图片/字体/异步 Chunk 请求到了主应用域名下 | 构建期图片转 Base64 或配置完整 CDN 域名，入口第一行注入 `__webpack_public_path__` |\n\n```javascript\n// 微前端带副作用自动回收能力的增强型 Proxy 沙箱（支持自动清理未解绑的事件与定时器）\nexport class CleanableProxySandbox {\n  constructor() {\n    this.fakeWindow = Object.create(null)\n    this.intervals = new Set()\n    this.listeners = []\n\n    const rawWindow = window\n    this.proxy = new Proxy(this.fakeWindow, {\n      get: (target, prop) => {\n        if (prop === 'setInterval') {\n          return (fn, delay, ...args) => {\n            const id = rawWindow.setInterval(fn, delay, ...args)\n            this.intervals.add(id)\n            return id\n          }\n        }\n        if (prop === 'addEventListener') {\n          return (type, listener, options) => {\n            this.listeners.push({ type, listener, options })\n            return rawWindow.addEventListener(type, listener, options)\n          }\n        }\n        const val = prop in target ? target[prop] : rawWindow[prop]\n        return typeof val === 'function' ? val.bind(rawWindow) : val\n      },\n      set: (target, prop, value) => {\n        target[prop] = value\n        return true\n      }\n    })\n  }\n\n  inactive() {\n    // 子应用卸载时，一键回收所有遗留定时器与全局事件监听，彻底杜绝内存泄漏！\n    for (const id of this.intervals) window.clearInterval(id)\n    this.intervals.clear()\n    for (const { type, listener, options } of this.listeners) {\n      window.removeEventListener(type, listener, options)\n    }\n    this.listeners.length = 0\n  }\n}\n```"
  },
  {
    "id": "mf-006",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "公共依赖",
      "shared",
      "externals"
    ],
    "question": "微前端如何共享公共依赖（如 React、Vue）避免重复加载？",
    "answer": "每个子应用都打包一份 React/Vue 会**体积爆炸、且多份 React 实例导致状态不互通**。解决方案：\n\n1. **externals + CDN**：主应用通过 `<script>` 引入 React 并挂到 window，子应用 webpack 配 `externals: { react: 'React' }` 不打包，运行时复用\n2. **Module Federation 的 shared**：声明 `shared: { react: { singleton: true } }`，由运行时保证只加载一份且版本协商\n3. **qiankun 的 import-map / 共享依赖**：通过构建插件统一去重\n\n```js\n// webpack\nexternals: { react: 'React', 'react-dom': 'ReactDOM' }\n```\n\n> 关键：依赖要**单例（singleton）**，否则多个 React 实例会让 Context/hooks 失效。\n\n### 微前端生产环境稳定性与隔离治理清单\n\n| 治理维度 | 常见线上故障现象 | 根治方案与架构规范 |\n| :--- | :--- | :--- |\n| **JS 沙箱逃逸与内存泄漏** | 子应用卸载后 `window.addEventListener('resize')` 或 `setInterval` 仍在后台狂跑 | 在沙箱层重写 `window.addEventListener` 与 `setInterval` 记录句柄，子应用 `unmount` 时自动批量清除 |\n| **路由冲突与死循环** | 主子应用同时监听 `popstate` 互相重定向导致浏览器卡死 | 主应用按一级路由前缀（`/app-a/*`）分发，子应用 Router 配置对应的 `base: '/app-a'`，跨应用跳转统一调用主应用下发的 `navigate` |\n| **静态资源相对路径 404** | 子应用图片/字体/异步 Chunk 请求到了主应用域名下 | 构建期图片转 Base64 或配置完整 CDN 域名，入口第一行注入 `__webpack_public_path__` |\n\n```javascript\n// 微前端带副作用自动回收能力的增强型 Proxy 沙箱（支持自动清理未解绑的事件与定时器）\nexport class CleanableProxySandbox {\n  constructor() {\n    this.fakeWindow = Object.create(null)\n    this.intervals = new Set()\n    this.listeners = []\n\n    const rawWindow = window\n    this.proxy = new Proxy(this.fakeWindow, {\n      get: (target, prop) => {\n        if (prop === 'setInterval') {\n          return (fn, delay, ...args) => {\n            const id = rawWindow.setInterval(fn, delay, ...args)\n            this.intervals.add(id)\n            return id\n          }\n        }\n        if (prop === 'addEventListener') {\n          return (type, listener, options) => {\n            this.listeners.push({ type, listener, options })\n            return rawWindow.addEventListener(type, listener, options)\n          }\n        }\n        const val = prop in target ? target[prop] : rawWindow[prop]\n        return typeof val === 'function' ? val.bind(rawWindow) : val\n      },\n      set: (target, prop, value) => {\n        target[prop] = value\n        return true\n      }\n    })\n  }\n\n  inactive() {\n    // 子应用卸载时，一键回收所有遗留定时器与全局事件监听，彻底杜绝内存泄漏！\n    for (const id of this.intervals) window.clearInterval(id)\n    this.intervals.clear()\n    for (const { type, listener, options } of this.listeners) {\n      window.removeEventListener(type, listener, options)\n    }\n    this.listeners.length = 0\n  }\n}\n```"
  },
  {
    "id": "mf-007",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "路由",
      "劫持",
      "分发"
    ],
    "question": "微前端的路由是如何劫持与分发的？",
    "answer": "主应用需要**统一控制哪个子应用被激活**，因此要劫持路由：\n\n- **hash 路由**：监听 `hashchange`，根据 `#/sub-a/...` 前缀激活对应子应用（简单、不依赖服务端）\n- **history 路由**：监听 `popstate`（及拦截 `pushState/replaceState`），匹配 `activeRule`（如 `/sub-a`）激活\n\n```text\n用户访问 /sub-vue/list\n  → 主应用路由监听命中 activeRule '/sub-vue'\n  → 加载并挂载 Vue 子应用，把 /list 交给它内部路由处理\n```\n\n**注意**：子应用内部路由要基于「主应用分配的基路径」，否则会误触发主应用或其它子应用。qiankun 会在子应用配置 `base` 时自动处理。\n\n### 微前端生产环境稳定性与隔离治理清单\n\n| 治理维度 | 常见线上故障现象 | 根治方案与架构规范 |\n| :--- | :--- | :--- |\n| **JS 沙箱逃逸与内存泄漏** | 子应用卸载后 `window.addEventListener('resize')` 或 `setInterval` 仍在后台狂跑 | 在沙箱层重写 `window.addEventListener` 与 `setInterval` 记录句柄，子应用 `unmount` 时自动批量清除 |\n| **路由冲突与死循环** | 主子应用同时监听 `popstate` 互相重定向导致浏览器卡死 | 主应用按一级路由前缀（`/app-a/*`）分发，子应用 Router 配置对应的 `base: '/app-a'`，跨应用跳转统一调用主应用下发的 `navigate` |\n| **静态资源相对路径 404** | 子应用图片/字体/异步 Chunk 请求到了主应用域名下 | 构建期图片转 Base64 或配置完整 CDN 域名，入口第一行注入 `__webpack_public_path__` |\n\n```javascript\n// 微前端带副作用自动回收能力的增强型 Proxy 沙箱（支持自动清理未解绑的事件与定时器）\nexport class CleanableProxySandbox {\n  constructor() {\n    this.fakeWindow = Object.create(null)\n    this.intervals = new Set()\n    this.listeners = []\n\n    const rawWindow = window\n    this.proxy = new Proxy(this.fakeWindow, {\n      get: (target, prop) => {\n        if (prop === 'setInterval') {\n          return (fn, delay, ...args) => {\n            const id = rawWindow.setInterval(fn, delay, ...args)\n            this.intervals.add(id)\n            return id\n          }\n        }\n        if (prop === 'addEventListener') {\n          return (type, listener, options) => {\n            this.listeners.push({ type, listener, options })\n            return rawWindow.addEventListener(type, listener, options)\n          }\n        }\n        const val = prop in target ? target[prop] : rawWindow[prop]\n        return typeof val === 'function' ? val.bind(rawWindow) : val\n      },\n      set: (target, prop, value) => {\n        target[prop] = value\n        return true\n      }\n    })\n  }\n\n  inactive() {\n    // 子应用卸载时，一键回收所有遗留定时器与全局事件监听，彻底杜绝内存泄漏！\n    for (const id of this.intervals) window.clearInterval(id)\n    this.intervals.clear()\n    for (const { type, listener, options } of this.listeners) {\n      window.removeEventListener(type, listener, options)\n    }\n    this.listeners.length = 0\n  }\n}\n```"
  },
  {
    "id": "mf-008",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "hard",
    "tags": [
      "iframe",
      "隔离",
      "优劣"
    ],
    "question": "用 iframe 做微前端有什么优缺点？",
    "answer": "`iframe` 是浏览器最早提供的原生隔离容器，而新一代微前端框架（如腾讯开源的**无界 wujie**）正是通过**“保留 iframe 的 JS 沙箱优势 + 用 WebComponent Shadow DOM 接管渲染”**破解了传统 `iframe` 的体验顽疾。\n\n### 一、 传统 `iframe` 做微前端的优缺点全景对比\n\n| 维度 | 传统 `iframe` 的优势与劣势表现 |\n| :--- | :--- |\n| **核心优势（隔离天花板）** | **浏览器引擎级原生隔离**：每个 `iframe` 拥有完全独立的 `window` 全局上下文、`document` 文档树与 CSS 作用域，JS 全局变量与样式污染概率为 0；技术栈 100% 无关，接入零代码改造。 |\n| **致命痛点 1：UI 割裂与弹窗受限** | 子应用内部的遮罩层（Modal / Drawer）永远被限制在 `iframe` 矩形框内部，**无法全屏居中覆盖主应用的顶部导航栏与侧边栏**。 |\n| **致命痛点 2：路由状态刷新丢失** | 用户在 `iframe` 内部点击跳转了多层子路由，但外层浏览器地址栏 URL 不变；一旦按 F5 刷新页面，`iframe` 瞬间退回初始入口页。 |\n| **致命痛点 3：白屏慢与内存开销大** | 每次创建 `iframe` 都要重建完整的浏览器文档上下文并重新加载全套公共库，且跨帧通信只能靠异步序列化的 `window.postMessage`。 |\n\n### 二、 现代破局方案：“无界（wujie）”如何结合 `iframe` 与 `WebComponent`？\n\n无界（wujie）的核心创举是**将 JS 执行环境与 DOM 渲染容器分离开**：\n1. 创建一个同源的隐藏空白 `iframe`，把子应用的 **JavaScript 代码放在 `iframe.contentWindow` 里执行**（天然获得无懈可击的原生 JS 沙箱，无需像 qiankun 那样用 `Proxy` 拦截属性耗费性能）。\n2. 同时在主文档中创建一个 `<wujie-app>` **WebComponent（Shadow DOM）**，通过劫持 `iframe` 内部 `Document.prototype` 的 DOM 创建与挂载 API（如 `createElement`、`appendChild`、`querySelector`），将子应用产生的所有 DOM 节点**代理渲染到主文档的 ShadowRoot 中**！\n\n```javascript\n// 核心原理示意：将 iframe 内部的 DOM 操作代理转发到主文档的 ShadowRoot 容器\nfunction patchIframeDomToShadowRoot(iframeWindow, shadowRoot) {\n  const rawCreateElement = iframeWindow.Document.prototype.createElement\n  // 劫持 document.body / document.head 指向主文档 ShadowRoot 内的宿主节点\n  Object.defineProperty(iframeWindow.Document.prototype, 'body', {\n    get: () => shadowRoot.querySelector('body')\n  })\n  // 因为 iframe 与主应用同源，主子通信可直接通过 iframeWindow.parent 同步调用，无需 postMessage！\n}\n```"
  },
  {
    "id": "mf-009",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "hard",
    "tags": [
      "Module Federation",
      "Webpack5",
      "运行时共享"
    ],
    "question": "Module Federation 如何实现微前端？和 qiankun 有何区别？",
    "answer": "Module Federation（Webpack5/Vite 插件）让**多个独立构建的应用在运行时互相加载对方导出的模块**，天然适合微前端：\n\n```js\n// app1 暴露组件\nnew ModuleFederationPlugin({ name: 'app1', filename: 'remoteEntry.js', exposes: { './Button': './src/Button' }, shared: { react: { singleton: true } } })\n// app2 消费\nremotes: { app1: 'app1@https://app1.com/remoteEntry.js' }\nimport Button from 'app1/Button'\n```\n\n**与 qiankun 区别**：\n\n- qiankun：**基座模式**，主应用统一调度子应用（HTML entry、路由劫持、沙箱），子应用是「整站」\n- MF：**组件/模块级**共享，没有强制基座，更轻、更灵活，但需要自己处理加载/隔离；它解决的是「运行时共享代码/依赖」\n\n> 实践中两者可结合：用 MF 共享组件与依赖，用基座/路由做应用级编排。\n\n### 微前端生产环境稳定性与隔离治理清单\n\n| 治理维度 | 常见线上故障现象 | 根治方案与架构规范 |\n| :--- | :--- | :--- |\n| **JS 沙箱逃逸与内存泄漏** | 子应用卸载后 `window.addEventListener('resize')` 或 `setInterval` 仍在后台狂跑 | 在沙箱层重写 `window.addEventListener` 与 `setInterval` 记录句柄，子应用 `unmount` 时自动批量清除 |\n| **路由冲突与死循环** | 主子应用同时监听 `popstate` 互相重定向导致浏览器卡死 | 主应用按一级路由前缀（`/app-a/*`）分发，子应用 Router 配置对应的 `base: '/app-a'`，跨应用跳转统一调用主应用下发的 `navigate` |\n| **静态资源相对路径 404** | 子应用图片/字体/异步 Chunk 请求到了主应用域名下 | 构建期图片转 Base64 或配置完整 CDN 域名，入口第一行注入 `__webpack_public_path__` |\n\n```javascript\n// 微前端带副作用自动回收能力的增强型 Proxy 沙箱（支持自动清理未解绑的事件与定时器）\nexport class CleanableProxySandbox {\n  constructor() {\n    this.fakeWindow = Object.create(null)\n    this.intervals = new Set()\n    this.listeners = []\n\n    const rawWindow = window\n    this.proxy = new Proxy(this.fakeWindow, {\n      get: (target, prop) => {\n        if (prop === 'setInterval') {\n          return (fn, delay, ...args) => {\n            const id = rawWindow.setInterval(fn, delay, ...args)\n            this.intervals.add(id)\n            return id\n          }\n        }\n        if (prop === 'addEventListener') {\n          return (type, listener, options) => {\n            this.listeners.push({ type, listener, options })\n            return rawWindow.addEventListener(type, listener, options)\n          }\n        }\n        const val = prop in target ? target[prop] : rawWindow[prop]\n        return typeof val === 'function' ? val.bind(rawWindow) : val\n      },\n      set: (target, prop, value) => {\n        target[prop] = value\n        return true\n      }\n    })\n  }\n\n  inactive() {\n    // 子应用卸载时，一键回收所有遗留定时器与全局事件监听，彻底杜绝内存泄漏！\n    for (const id of this.intervals) window.clearInterval(id)\n    this.intervals.clear()\n    for (const { type, listener, options } of this.listeners) {\n      window.removeEventListener(type, listener, options)\n    }\n    this.listeners.length = 0\n  }\n}\n```"
  },
  {
    "id": "mf-010",
    "category": "micro-frontend",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "部署",
      "版本",
      "灰度"
    ],
    "question": "微前端的部署与版本管理有什么要注意的？",
    "answer": "微前端架构的核心价值在于**“子应用独立开发、独立构建、独立部署、运行时动态聚合”**。如果在子应用发版时仍需要重新构建或手动修改主应用代码，就退化成了伪微前端。\n\n### 一、 微前端独立部署与版本治理四大核心机制\n\n1. **主从解耦与动态入口注册表（Dynamic Manifest Registry）**：\n   - 子应用构建产物（含带 ContentHash 的 `.js`/`.css` 与不带 Hash 的 `index.html`）独立上传至各自的 CDN 目录或容器。\n   - 主应用绝不写死子应用的 JS 文件名，而是通过拉取服务端版本配置中心（或子应用固定路径的 `index.html` / `mf-manifest.json`）动态加载最新产物。\n2. **缓存策略铁律（HTML 禁强缓存，静态资产永久强缓存）**：\n   - 子应用的入口 `index.html` / `remoteEntry.js` **必须配置 `Cache-Control: no-cache`（或极短 `s-maxage=30`）**，确保子应用发版后主应用立即拉取到最新入口。\n   - 子应用的 `js/chunk-[contenthash].js` 则配置 `Cache-Control: public, max-age=31536000, immutable`。\n3. **动态运行时 `publicPath` 注入**：\n   - 子应用在主应用域名（如 `https://portal.com/crm/`）下被拉取执行时，若使用相对路径加载异步懒加载 Chunk 或图片，会错误地请求到主应用域名下导致 404。必须在子应用入口文件最顶部注入动态 `publicPath`。\n\n```javascript\n// 1. 子应用 src/public-path.js（必须在子应用 entry 最顶部第一行 import！）\nif (window.__POWERED_BY_QIANKUN__) {\n  // 将 Webpack 运行时异步 Chunk 的加载根路径动态指向子应用自己的线上 CDN 地址\n  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__\n}\n```\n\n```nginx\n# 2. 子应用 Nginx / CDN 缓存与跨域（CORS）标准配置\nlocation /subapp/crm/ {\n  # 关键 1：允许主应用域名通过 fetch 拉取子应用 HTML 与静态资源\n  add_header Access-Control-Allow-Origin \"https://portal.example.com\" always;\n\n  # 关键 2：入口 HTML 严禁强缓存，保证子应用发版秒级生效且支持秒级回滚\n  if ($request_filename ~* .*\\.(?:htm|html|json)$) {\n    add_header Cache-Control \"no-cache, no-store, must-revalidate\";\n  }\n}\n```\n\n4. **版本快照与秒级原子回滚**：\n   每次子应用 CI 构建产物归档至带版本号的对象存储目录（如 `s3://cdn/sub-crm/v1.4.2/`），发布平台仅需修改注册中心 JSON 中的 `entry: \"https://cdn.com/sub-crm/v1.4.2/index.html\"` 指针；一旦线上监控告警，1 秒内将指针切回 `v1.4.1` 即可完成回滚，无需重新走 CI 打包。"
  }
]
