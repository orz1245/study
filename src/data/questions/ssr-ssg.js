export const ssrSsgQuestions = [
  {
    "id": "fw-032",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "React",
      "SSR",
      "Next.js",
      "服务端渲染"
    ],
    "question": "什么是 SSR（服务端渲染）？React 中如何实现？",
    "answer": "### CSR vs SSR vs SSG\n\n| 方式 | 说明 | 优势 | 劣势 |\n|------|------|------|------|\n| **CSR** | 客户端渲染 | 交互流畅 | 首屏慢、SEO 差 |\n| **SSR** | 服务端渲染 | 首屏快、SEO 好 | 服务器负载高 |\n| **SSG** | 静态生成 | 最快、CDN 友好 | 内容固定 |\n| **ISR** | 增量静态生成 | 兼顾速度和动态性 | 配置复杂 |\n\n### React SSR 基本流程\n\n```text\n1. 服务器接收请求\n2. 执行 React 组件 → 生成 HTML 字符串\n3. 返回 HTML（包含初始数据）\n4. 浏览器显示 HTML（首屏可见）\n5. 浏览器加载 JS\n6. Hydration：JS 接管页面，变成可交互\n```\n\n### 原生 React SSR\n\n```javascript\n// server.js\nimport { renderToString } from 'react-dom/server'\n\napp.get('/', (req, res) => {\n  const data = await fetchData()\n  const html = renderToString(\n    <App initialData={data} />\n  )\n  res.send(`\n    <html>\n      <body>\n        <div id=\"root\">${html}</div>\n        <script>window.__INITIAL_DATA__ = ${JSON.stringify(data)}</script>\n        <script src=\"/client.js\"></script>\n      </body>\n    </html>\n  `)\n})\n```\n\n### Next.js（推荐方案）\n\n```javascript\n// App Router (Next.js 13+)\n// app/page.js\nexport default async function Page() {\n  const data = await fetch('https://api.example.com/data')\n  const json = await data.json()\n  return <div>{json.title}</div>\n}\n\n// 动态路由\n// app/posts/[id]/page.js\nexport default async function Post({ params }) {\n  const post = await getPost(params.id)\n  return <article>{post.content}</article>\n}\n\n// 客户端组件\n'use client'\nimport { useState } from 'react'\nexport default function Counter() {\n  const [count, setCount] = useState(0)\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>\n}\n```\n\n### Hydration（水合）\n\n```javascript\n// 客户端代码\nimport { hydrateRoot } from 'react-dom/client'\n\n// 不是 createRoot（会重新渲染），而是 hydrateRoot（复用 DOM）\nhydrateRoot(document.getElementById('root'), <App initialData={window.__INITIAL_DATA__} />)\n```\n\n### Hydration Mismatch\n\n如果服务端和客户端渲染结果不一致，React 会警告并重新渲染：\n\n```javascript\n// ❌ 服务端和客户端可能不同\nfunction Time() {\n  return <div>{new Date().toLocaleTimeString()}</div>\n}\n\n// ✅ 先渲染占位，客户端挂载后再显示\nfunction Time() {\n  const [time, setTime] = useState(null)\n  useEffect(() => {\n    setTime(new Date().toLocaleTimeString())\n  }, [])\n  return <div>{time || 'Loading...'}</div>\n}\n```\n\n### 何时用 SSR\n- ✅ 内容型网站（博客、电商、新闻）→ SEO 重要\n- ✅ 首屏性能要求高的页面\n- ❌ 后台管理系统 → CSR 足够\n- ❌ 高交互应用（如编辑器）→ CSR 更合适\n\n### React Server Components（RSC）\nReact 18 引入的服务端组件：\n- 在服务端渲染，不发送到客户端\n- 可以直接访问数据库/文件系统\n- 0 KB 客户端 JS 体积\n- Next.js App Router 默认就是 RSC"
  },
  {
    "id": "ssr-001",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "CSR",
      "SSR",
      "SSG",
      "ISR",
      "PPR",
      "渲染选型"
    ],
    "question": "CSR、SSR、SSG、ISR 与 PPR（部分预渲染）五种渲染模式的核心指标对比与架构选型决策树",
    "answer": "现代 Web 渲染架构已从早期的“CSR vs SSR 二选一”演进为涵盖 **CSR、SSG、ISR、流式 SSR 与 PPR（Partial Prerendering，部分预渲染）** 的五维光谱。\n\n### 一、 五大渲染模式核心指标全景对比表\n\n| 渲染模式 | HTML 生成时机 | TTFB（首字节时间） | FCP / LCP 首屏速度 | SEO 友好度 | 服务端计算成本 | 典型适用业务场景 |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| **CSR（客户端渲染）** | 浏览器下载 JS 后动态生成 | 极快（仅返回空壳 HTML） | 慢（受制于 JS 包下载与 API 瀑布流） | 差（爬虫需等待 JS 执行） | 极低（纯静态 CDN 托管） | 强交互后台管理系统、SaaS 仪表盘、Web IDE |\n| **SSG（静态站点生成）** | `npm run build` 构建期一次性生成 | 极快（CDN 边缘节点直接命中） | 极快（直出完整 HTML） | 极佳 | 极低（构建完即纯静态文件） | 技术文档站、博客、课程题库（如本站全量静态直出） |\n| **ISR（增量静态再生）** | 构建期生成 + 运行期按 TTL 或 Webhook 后台重生成 | 极快（始终先返回缓存静态页） | 极快 | 极佳 | 低（仅在缓存过期后后台触发单次重算） | 百万级商品详情页、新闻门户（兼顾静态速度与分钟级更新） |\n| **SSR（服务端实时渲染）** | 每次用户请求到达服务端时动态生成 | 中～慢（取决于后端查库与模板渲染耗时） | 快（无需等客户端 JS 拉取首屏数据） | 极佳 | 高（需 Node/Edge 运行时抗并发峰值） | 千人千面的个性化推荐信息流、实时机票搜索页 |\n| **PPR（部分预渲染）** | 构建期预渲染静态外壳 + 动态区域通过 Suspense 流式注入 | 极快（CDN 0ms 先返回静态外壳 HTML） | 极快（静态主干秒开，动态孤岛流式补齐） | 极佳 | 中低（仅动态 Suspense 空洞消耗算力） | 电商首页（静态导航/大促框架 + 动态个人购物车与猜你喜欢） |\n\n### 二、 代码架构示意：PPR（静态外壳 + 动态流式空洞）\n\n```jsx\nimport { Suspense } from 'react'\nimport { StaticProductInfo, ProductSkeleton } from './components'\nimport { DynamicUserCart, PersonalizedRecommendations } from './dynamic-parts'\n\n// 构建期自动将 StaticProductInfo 和 ProductSkeleton 预渲染为静态 HTML 推入 CDN；\n// 运行期用户请求瞬间收到静态外壳（TTFB < 30ms），同时同一条 HTTP 连接流式追加动态购物车！\nexport default function ProductPage({ params }) {\n  return (\n    <main className=\"product-layout\">\n      <StaticProductInfo id={params.id} />\n      <Suspense fallback={<ProductSkeleton />}>\n        <DynamicUserCart />\n        <PersonalizedRecommendations productId={params.id} />\n      </Suspense>\n    </main>\n  )\n}\n```"
  },
  {
    "id": "ssr-002",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "hydration",
      "注水",
      "脱水"
    ],
    "question": "什么是「注水」（Hydration）？注水过程是怎样的？",
    "answer": "**注水**指 SSR 把 HTML 发给浏览器后，客户端 JS **接管已存在的 DOM 并绑定事件**，让它变成可交互的 React/Vue 应用。\n\n过程：\n\n1. 服务端渲染出带内容的 HTML，随页面返回\n2. 浏览器先**快速显示**内容（首屏可见，但还不可交互）\n3. 客户端 JS 加载，React/Vue 用同一套组件**重新渲染（不生成新 DOM，而是\"复用\"已有 DOM）**，并把事件监听器绑定上去\n4. 注水完成 → 页面可交互\n\n```js\n// 服务端\nconst html = renderToString(<App />)\n// 客户端（React 18 createRoot）\nhydrateRoot(document.getElementById('root'), <App />)\n```\n\n> 注水是「让静态 HTML 活起来」的过程；若服务端/客户端渲染结构不一致会报 hydration mismatch。\n\n### 同构渲染（SSR / SSG）核心时序与生产检查表\n\n| 阶段名称 | 执行环境 | 核心任务与性能/稳定性风险点 |\n| :--- | :--- | :--- |\n| **1. 服务端数据预取** | Node.js / Edge Runtime | 并行拉取路由所需数据，必须设置超时熔断（如 1500ms 超时自动降级为客户端 CSR 拉取，防止慢接口拖垮 SSR 进程） |\n| **2. 组件树脱水（Dehydration）** | 服务端内存 | 将组件树渲染为 HTML 流，同时将状态序列化为安全的 JSON（必须转义 `<` 为 `\\u003c` 防止 XSS 闭合 `</script>`） |\n| **3. 客户端注水（Hydration）** | 用户浏览器 | 复用已有 DOM 节点并挂载事件监听器；若双端 DOM 结构不一致则触发 Hydration Mismatch 警告并被迫销毁重建 |\n\n```javascript\n// SSR 状态安全序列化（Dehydrate）与客户端注水（Hydrate）标准防 XSS 实现\nexport function serializeSsrState(state) {\n  // 关键安全防线：若用户昵称包含 \"</script><script>alert(1)</script>\"，\n  // 直接 JSON.stringify 注入 HTML 会导致严重的存储型 XSS！必须转义 < > &\n  return JSON.stringify(state)\n    .replace(/</g, '\\u003c')\n    .replace(/>/g, '\\u003e')\n    .replace(/&/g, '\\u0026')\n}\n\nexport function readHydratedState(scriptId = '__SSR_STATE__') {\n  if (typeof document === 'undefined') return null\n  const el = document.getElementById(scriptId)\n  return el ? JSON.parse(el.textContent || 'null') : null\n}\n```"
  },
  {
    "id": "ssr-003",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "同构",
      "isomorphic",
      "一套代码"
    ],
    "question": "什么是「同构（Isomorphic / Universal）」渲染？",
    "answer": "**同构**指**同一份代码/组件既能在服务端渲染、又能在客户端运行**，避免为两端各写一套。\n\n```text\n服务端：renderToString(<App/>)  -> 生成 HTML 字符串\n客户端：hydrateRoot(<App/>)      -> 复用 HTML 并注水\n两者共用 <App/> 组件与大部分逻辑\n```\n\n**好处**：首屏 SSR（快、SEO 好）+ 客户端交互（SPA 体验），代码只写一份。\n\n**注意点（服务端特有坑）**：\n\n- 服务端**没有 `window` / `document` / `localStorage`**，访问会报错 → 用 `typeof window !== 'undefined'` 守卫，或放到 `useEffect/onMounted` 等客户端生命周期\n- 服务端代码会**常驻共享**，避免用模块级可变全局状态（会被并发请求串数据）\n\n### 同构渲染（SSR / SSG）核心时序与生产检查表\n\n| 阶段名称 | 执行环境 | 核心任务与性能/稳定性风险点 |\n| :--- | :--- | :--- |\n| **1. 服务端数据预取** | Node.js / Edge Runtime | 并行拉取路由所需数据，必须设置超时熔断（如 1500ms 超时自动降级为客户端 CSR 拉取，防止慢接口拖垮 SSR 进程） |\n| **2. 组件树脱水（Dehydration）** | 服务端内存 | 将组件树渲染为 HTML 流，同时将状态序列化为安全的 JSON（必须转义 `<` 为 `\\u003c` 防止 XSS 闭合 `</script>`） |\n| **3. 客户端注水（Hydration）** | 用户浏览器 | 复用已有 DOM 节点并挂载事件监听器；若双端 DOM 结构不一致则触发 Hydration Mismatch 警告并被迫销毁重建 |\n\n```javascript\n// SSR 状态安全序列化（Dehydrate）与客户端注水（Hydrate）标准防 XSS 实现\nexport function serializeSsrState(state) {\n  // 关键安全防线：若用户昵称包含 \"</script><script>alert(1)</script>\"，\n  // 直接 JSON.stringify 注入 HTML 会导致严重的存储型 XSS！必须转义 < > &\n  return JSON.stringify(state)\n    .replace(/</g, '\\u003c')\n    .replace(/>/g, '\\u003e')\n    .replace(/&/g, '\\u0026')\n}\n\nexport function readHydratedState(scriptId = '__SSR_STATE__') {\n  if (typeof document === 'undefined') return null\n  const el = document.getElementById(scriptId)\n  return el ? JSON.parse(el.textContent || 'null') : null\n}\n```"
  },
  {
    "id": "ssr-004",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "hydration mismatch",
      "水合不匹配",
      "排查"
    ],
    "question": "什么是 hydration mismatch（水合不匹配）？如何避免？",
    "answer": "服务端渲染的 HTML 与客户端首次渲染的**结构/文本不一致**，React/Vue 会丢弃服务端 DOM 重新渲染，并报警告，严重时导致闪烁/状态错乱。\n\n**常见原因**：\n\n1. 直接使用 `Date.now()` / `Math.random()` 生成内容（两端值不同）\n2. 依赖 `window` / `localStorage` 立即渲染（服务端无值）\n3. 根据浏览器特性（如登录态）在服务端渲染了与客户端不同的 UI\n4. ID 不一致（如用 random 生成 key/id，而非 `useId`）\n\n```js\n// 错误：服务端/客户端随机数不同\n<span>{Math.random()}</span>\n// 正确：用 useId 或延迟到客户端副作用里生成\n```\n\n**避免**：用 `useId` 生成 id；把依赖浏览器环境的值放到 `useEffect/onMounted` 里设置（先渲染占位，注水后再填）。\n\n### 同构渲染（SSR / SSG）核心时序与生产检查表\n\n| 阶段名称 | 执行环境 | 核心任务与性能/稳定性风险点 |\n| :--- | :--- | :--- |\n| **1. 服务端数据预取** | Node.js / Edge Runtime | 并行拉取路由所需数据，必须设置超时熔断（如 1500ms 超时自动降级为客户端 CSR 拉取，防止慢接口拖垮 SSR 进程） |\n| **2. 组件树脱水（Dehydration）** | 服务端内存 | 将组件树渲染为 HTML 流，同时将状态序列化为安全的 JSON（必须转义 `<` 为 `\\u003c` 防止 XSS 闭合 `</script>`） |\n| **3. 客户端注水（Hydration）** | 用户浏览器 | 复用已有 DOM 节点并挂载事件监听器；若双端 DOM 结构不一致则触发 Hydration Mismatch 警告并被迫销毁重建 |\n\n```javascript\n// SSR 状态安全序列化（Dehydrate）与客户端注水（Hydrate）标准防 XSS 实现\nexport function serializeSsrState(state) {\n  // 关键安全防线：若用户昵称包含 \"</script><script>alert(1)</script>\"，\n  // 直接 JSON.stringify 注入 HTML 会导致严重的存储型 XSS！必须转义 < > &\n  return JSON.stringify(state)\n    .replace(/</g, '\\u003c')\n    .replace(/>/g, '\\u003e')\n    .replace(/&/g, '\\u0026')\n}\n\nexport function readHydratedState(scriptId = '__SSR_STATE__') {\n  if (typeof document === 'undefined') return null\n  const el = document.getElementById(scriptId)\n  return el ? JSON.parse(el.textContent || 'null') : null\n}\n```"
  },
  {
    "id": "ssr-005",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "easy",
    "tags": [
      "SEO",
      "首屏",
      "性能"
    ],
    "question": "SSR 对 SEO 和首屏性能有什么帮助？",
    "answer": "服务端渲染（SSR）相比客户端渲染（CSR），在 **搜索引擎抓取（SEO）** 与 **首屏性能指标（FCP / LCP）** 上具有结构性优势，其核心原理是将“HTML 组装与首屏数据获取”从不稳定的用户终端网络前移到了低延迟的云服务器内网。\n\n### 一、 CSR vs SSR 首屏渲染时序与网络瀑布流对比\n\n```text\n【CSR 客户端渲染瀑布流（白屏等待长）】\n浏览器请求 HTML ──(100ms)──> 收到 <div id=\"app\"></div> 空壳（仍白屏）\n                              └──> 下载并解析 bundle.js (400ms)\n                                    └──> 执行 JS 发起 fetch('/api/data') (300ms)\n                                          └──> 渲染出首屏内容 (FCP/LCP ≈ 850ms+)\n\n【SSR 服务端渲染 / 流式渲染时序（首屏直出）】\n浏览器请求 HTML ──(内网查库 40ms + 渲染 15ms)──> 收到含完整正文与 meta 的 HTML\n                                                ├──> 浏览器立即绘制首屏文字与排版 (FCP/LCP ≈ 180ms!)\n                                                └──> 后台并行下载 JS 完成事件水合 (Hydration)\n```\n\n### 二、 SSR 对 SEO 与社交分享的三大决定性作用\n\n1. **爬虫零等待直读完整语义标签**：尽管 Googlebot 具备二阶段无头浏览器渲染能力，但 JS 渲染队列延迟往往长达数天甚至数周，且百度、搜狗、Bing 及各类 AI 检索爬虫对重度 CSR 页面极易抓取到空壳；SSR 直接返回完整的 `<title>`、`<meta name=\"description\">`、`<h1>` 正文与 Schema.org `JSON-LD` 结构化数据。\n2. **社交媒体卡片（Open Graph / Twitter Card）100% 依赖静态直出**：微信、Slack、飞书、Twitter（X）、Telegram 的链接预览爬虫**完全不执行任何 JavaScript**。若采用纯 CSR，动态修改的 `<meta property=\"og:title\">` 永远无法被分享卡片读取。\n3. **利用内网低延迟消除客户端 API 瀑布流**：在 SSR 期间，Node 服务端与数据库/微服务通常位于同一机房（RTT < 2ms），相比用户手机通过移动网络跨越公网串行请求多个接口，首屏内容到达时间（LCP）可缩短 50%～70%。\n\n```html\n<!-- SSR 直出 HTML 示例：爬虫与社交分享机器人在第一个 TCP 包即可读到完整元数据与正文 -->\n<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n  <title>深入理解流式 SSR - 前端学习网</title>\n  <meta name=\"description\" content=\"完整解析 SSR 对 FCP、LCP 与爬虫收录的核心优化机制。\">\n  <meta property=\"og:title\" content=\"深入理解流式 SSR\">\n  <meta property=\"og:image\" content=\"https://study.791860.xyz/og-image.png\">\n</head>\n<body>\n  <main id=\"app\">\n    <h1>深入理解流式 SSR</h1>\n    <article>这里是服务端直接渲染出的完整正文内容，无需等待 JS 下载即可呈现并被索引……</article>\n  </main>\n  <script id=\"__SSR_DATA__\" type=\"application/json\">{\"articleId\":101}</script>\n  <script src=\"/client-entry.js\" defer></script>\n</body>\n</html>\n```"
  },
  {
    "id": "ssr-006",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "hard",
    "tags": [
      "流式 SSR",
      "Streaming",
      "Suspense"
    ],
    "question": "什么是流式 SSR（Streaming SSR）？和传统的整页 SSR 有什么区别？",
    "answer": "传统 SSR **等整个页面渲染完**才把 HTML 一次性发给浏览器，慢组件会拖垮整页 TTFB。\n\n**流式 SSR** 利用 HTTP 流式响应，**先发 shell（骨架/导航），再按组件就绪顺序分块发送内容**（借助 `Suspense` / 异步组件）：\n\n```js\n// React 18：流式 + Suspense\nrenderToPipeableStream(<App />, {\n  bootstrapScripts: ['/main.js']\n})\n// 快的组件先到，慢的（如 <Suspense> 包裹的评论区）稍后到达并替换占位\n```\n\n**好处**：\n\n- 首屏可见时间更短（先看到布局）\n- 一个慢的数据请求不会阻塞整页\n- 配合 `<Suspense fallback>` 给用户即时反馈\n\n> 注意：流式要求服务端/网关支持分块传输（chunked encoding）。\n\n### 同构渲染（SSR / SSG）核心时序与生产检查表\n\n| 阶段名称 | 执行环境 | 核心任务与性能/稳定性风险点 |\n| :--- | :--- | :--- |\n| **1. 服务端数据预取** | Node.js / Edge Runtime | 并行拉取路由所需数据，必须设置超时熔断（如 1500ms 超时自动降级为客户端 CSR 拉取，防止慢接口拖垮 SSR 进程） |\n| **2. 组件树脱水（Dehydration）** | 服务端内存 | 将组件树渲染为 HTML 流，同时将状态序列化为安全的 JSON（必须转义 `<` 为 `\\u003c` 防止 XSS 闭合 `</script>`） |\n| **3. 客户端注水（Hydration）** | 用户浏览器 | 复用已有 DOM 节点并挂载事件监听器；若双端 DOM 结构不一致则触发 Hydration Mismatch 警告并被迫销毁重建 |\n\n```javascript\n// SSR 状态安全序列化（Dehydrate）与客户端注水（Hydrate）标准防 XSS 实现\nexport function serializeSsrState(state) {\n  // 关键安全防线：若用户昵称包含 \"</script><script>alert(1)</script>\"，\n  // 直接 JSON.stringify 注入 HTML 会导致严重的存储型 XSS！必须转义 < > &\n  return JSON.stringify(state)\n    .replace(/</g, '\\u003c')\n    .replace(/>/g, '\\u003e')\n    .replace(/&/g, '\\u0026')\n}\n\nexport function readHydratedState(scriptId = '__SSR_STATE__') {\n  if (typeof document === 'undefined') return null\n  const el = document.getElementById(scriptId)\n  return el ? JSON.parse(el.textContent || 'null') : null\n}\n```"
  },
  {
    "id": "ssr-007",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "数据注水",
      "INITIAL_STATE",
      "安全"
    ],
    "question": "SSR 中如何把服务端数据「注水」到客户端，避免重复请求？",
    "answer": "服务端取到的数据要**序列化进 HTML**，客户端注水时直接复用，避免再请求一次（防瀑布流/闪烁）。\n\n```js\n// 服务端：把数据挂到 window 上\nconst data = await fetchData()\nconst html = `<div id=\"root\">${renderToString(<App data={data}/>)}</div>\n<script>window.__INITIAL_STATE__ = ${JSON.stringify(safeData)}</script>`\n// 客户端：直接读，不再请求\nconst data = window.__INITIAL_STATE__\nhydrateRoot(document.getElementById('root'), <App data={data}/>)\n```\n\n**注意安全**：\n\n- 用 `JSON.stringify` 后要做 XSS 转义（`<` 等），防 `<script>` 注入\n- 不要注入敏感信息（token、密码）\n- React 18 的 Server Component / Next `useFetch` 已自动处理注水\n\n### 同构渲染（SSR / SSG）核心时序与生产检查表\n\n| 阶段名称 | 执行环境 | 核心任务与性能/稳定性风险点 |\n| :--- | :--- | :--- |\n| **1. 服务端数据预取** | Node.js / Edge Runtime | 并行拉取路由所需数据，必须设置超时熔断（如 1500ms 超时自动降级为客户端 CSR 拉取，防止慢接口拖垮 SSR 进程） |\n| **2. 组件树脱水（Dehydration）** | 服务端内存 | 将组件树渲染为 HTML 流，同时将状态序列化为安全的 JSON（必须转义 `<` 为 `\\u003c` 防止 XSS 闭合 `</script>`） |\n| **3. 客户端注水（Hydration）** | 用户浏览器 | 复用已有 DOM 节点并挂载事件监听器；若双端 DOM 结构不一致则触发 Hydration Mismatch 警告并被迫销毁重建 |\n\n```javascript\n// SSR 状态安全序列化（Dehydrate）与客户端注水（Hydrate）标准防 XSS 实现\nexport function serializeSsrState(state) {\n  // 关键安全防线：若用户昵称包含 \"</script><script>alert(1)</script>\"，\n  // 直接 JSON.stringify 注入 HTML 会导致严重的存储型 XSS！必须转义 < > &\n  return JSON.stringify(state)\n    .replace(/</g, '\\u003c')\n    .replace(/>/g, '\\u003e')\n    .replace(/&/g, '\\u0026')\n}\n\nexport function readHydratedState(scriptId = '__SSR_STATE__') {\n  if (typeof document === 'undefined') return null\n  const el = document.getElementById(scriptId)\n  return el ? JSON.parse(el.textContent || 'null') : null\n}\n```"
  },
  {
    "id": "ssr-008",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "SSG",
      "预渲染",
      "构建时"
    ],
    "question": "SSG（静态生成）在构建时如何获取页面数据？有什么限制？",
    "answer": "SSG 在**构建阶段**执行取数逻辑，把结果渲染进静态 HTML，之后所有请求都返回这份固定文件（可 CDN 缓存）。\n\n```js\n// Next.js getStaticProps / Nuxt routeRules.prerender\nexport async function getStaticProps() {\n  const posts = await getAllPosts()   // 构建时执行一次\n  return { props: { posts } }\n}\n```\n\n**限制**：\n\n- 数据在构建时固化，**不能依赖请求时的参数**（如用户 cookie、实时查询）\n- 数据更新需**重新构建**（或用 ISR 折中）\n- 页面数量极大时构建时间会变长（可用按需生成/ISR 缓解）\n\n> 适合：营销页、文档、博客、商品详情等「大体不变」的内容。\n\n### 同构渲染（SSR / SSG）核心时序与生产检查表\n\n| 阶段名称 | 执行环境 | 核心任务与性能/稳定性风险点 |\n| :--- | :--- | :--- |\n| **1. 服务端数据预取** | Node.js / Edge Runtime | 并行拉取路由所需数据，必须设置超时熔断（如 1500ms 超时自动降级为客户端 CSR 拉取，防止慢接口拖垮 SSR 进程） |\n| **2. 组件树脱水（Dehydration）** | 服务端内存 | 将组件树渲染为 HTML 流，同时将状态序列化为安全的 JSON（必须转义 `<` 为 `\\u003c` 防止 XSS 闭合 `</script>`） |\n| **3. 客户端注水（Hydration）** | 用户浏览器 | 复用已有 DOM 节点并挂载事件监听器；若双端 DOM 结构不一致则触发 Hydration Mismatch 警告并被迫销毁重建 |\n\n```javascript\n// SSR 状态安全序列化（Dehydrate）与客户端注水（Hydrate）标准防 XSS 实现\nexport function serializeSsrState(state) {\n  // 关键安全防线：若用户昵称包含 \"</script><script>alert(1)</script>\"，\n  // 直接 JSON.stringify 注入 HTML 会导致严重的存储型 XSS！必须转义 < > &\n  return JSON.stringify(state)\n    .replace(/</g, '\\u003c')\n    .replace(/>/g, '\\u003e')\n    .replace(/&/g, '\\u0026')\n}\n\nexport function readHydratedState(scriptId = '__SSR_STATE__') {\n  if (typeof document === 'undefined') return null\n  const el = document.getElementById(scriptId)\n  return el ? JSON.parse(el.textContent || 'null') : null\n}\n```"
  },
  {
    "id": "ssr-009",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "medium",
    "tags": [
      "静态资源",
      "CDN",
      "缓存"
    ],
    "question": "SSR/SSG 应用的静态资源与缓存策略怎么设计？",
    "answer": "**静态资源**（JS/CSS/图片）：带内容哈希文件名 → `Cache-Control: max-age=31536000, immutable`，永远命中强缓存。\n\n**HTML 页面**：\n\n- SSG 页面：可长缓存（内容不变）\n- SSR 页面：通常不缓存或短缓存（内容随请求变），用 CDN 边缘缓存 + `Cache-Tag`/`Surrogate-Key` 做精准失效\n- ISR 页面：CDN 缓存一段时间，后台再生\n\n```text\n浏览器 → CDN(边缘) → 命中则直接返回；未命中 → 源站 SSR/静态\n```\n\n> 把「不变的资源」与「会变的内容」分离缓存是核心思想；配合 stale-while-revalidate 还能「先返回旧、后台更新」。\n\n### 同构渲染（SSR / SSG）核心时序与生产检查表\n\n| 阶段名称 | 执行环境 | 核心任务与性能/稳定性风险点 |\n| :--- | :--- | :--- |\n| **1. 服务端数据预取** | Node.js / Edge Runtime | 并行拉取路由所需数据，必须设置超时熔断（如 1500ms 超时自动降级为客户端 CSR 拉取，防止慢接口拖垮 SSR 进程） |\n| **2. 组件树脱水（Dehydration）** | 服务端内存 | 将组件树渲染为 HTML 流，同时将状态序列化为安全的 JSON（必须转义 `<` 为 `\\u003c` 防止 XSS 闭合 `</script>`） |\n| **3. 客户端注水（Hydration）** | 用户浏览器 | 复用已有 DOM 节点并挂载事件监听器；若双端 DOM 结构不一致则触发 Hydration Mismatch 警告并被迫销毁重建 |\n\n```javascript\n// SSR 状态安全序列化（Dehydrate）与客户端注水（Hydrate）标准防 XSS 实现\nexport function serializeSsrState(state) {\n  // 关键安全防线：若用户昵称包含 \"</script><script>alert(1)</script>\"，\n  // 直接 JSON.stringify 注入 HTML 会导致严重的存储型 XSS！必须转义 < > &\n  return JSON.stringify(state)\n    .replace(/</g, '\\u003c')\n    .replace(/>/g, '\\u003e')\n    .replace(/&/g, '\\u0026')\n}\n\nexport function readHydratedState(scriptId = '__SSR_STATE__') {\n  if (typeof document === 'undefined') return null\n  const el = document.getElementById(scriptId)\n  return el ? JSON.parse(el.textContent || 'null') : null\n}\n```"
  },
  {
    "id": "ssr-010",
    "category": "ssr-ssg",
    "module": "render",
    "difficulty": "hard",
    "tags": [
      "取舍",
      "适用场景",
      "成本"
    ],
    "question": "SSR 的代价和适用边界是什么？什么时候不该用 SSR？",
    "answer": "SSR 并非银弹。将渲染逻辑从免费的“用户浏览器 CPU”转移到“企业自己的服务端 CPU”，会带来显著的**运维成本、TTFB 恶化风险、同构代码约束以及跨请求内存泄漏隐患**。\n\n### 一、 SSR 的四大核心代价与生产事故高发区\n\n1. **服务端 CPU 算力瓶颈与高并发雪崩风险**：\n   `renderToString` 是同步 CPU 密集型操作（单次耗时 5～30ms 会直接阻塞 Node.js 事件循环）。在突发流量洪峰下，若缺少 CDN 边缘缓存保护，Node 进程 CPU 瞬间打满会导致所有请求的 TTFB 飙升至数秒甚至超时 502。\n2. **跨请求状态污染（Cross-Request State Pollution）与内存泄漏**：\n   在 CSR 中，每个用户独占一个浏览器标签页，模块顶层的单例对象（如全局 `store` 或 `axios` 实例）是安全的；但在 SSR 中，**同一个 Node 进程同时处理成千上万个不同用户的请求**，若在模块顶层保存用户状态，会导致 A 用户刷出 B 用户的个人隐私数据！\n3. **双端环境差异与 Hydration Mismatch 调试成本**：\n   服务端没有 `window`、`document`、`localStorage`、`navigator`，任何第三方 UI 库若在顶层直接访问 `window.innerWidth` 会直接导致服务端崩溃。\n\n```javascript\n// ✗ 致命反例：在 SSR 模块顶层定义单例状态，导致多用户并发时互相串号（状态污染）！\nlet currentUser = null\nexport async function renderSharedBad(req) {\n  currentUser = await fetchUserByCookie(req.headers.cookie)\n  // 若在 await 期间另一个用户请求进来覆盖了 currentUser，下面渲染出的就是别人的数据！\n  return renderToString(<App user={currentUser} />)\n}\n\n// ✔ 正确做法：使用工厂函数为每个请求创建完全独立的 App / Store / Router 实例（或使用 Node AsyncLocalStorage）\nimport { AsyncLocalStorage } from 'node:async_hooks'\nconst requestContext = new AsyncLocalStorage()\n\nexport function handleSsrRequest(req, res) {\n  const store = createFreshStoreInstance() // 每次请求独立实例化\n  requestContext.run({ req, store }, async () => {\n    const html = await renderAppWithStore(store)\n    res.send(html)\n  })\n}\n```\n\n### 二、 什么时候坚决不该用 SSR？（适用边界决策）\n\n- **需要登录后才能访问的中后台管理系统（Admin / ERP / CRM）、Web IDE、在线画布工具**：此类应用完全不需要搜索引擎收录，且重度依赖浏览器端 DOM / Canvas / WebGL API，使用纯 CSR（配合 Service Worker / 强缓存静态壳）体验更好、成本更低。\n- **静态内容可枚举或变更不频繁的站点（文档、题库、博客、官网）**：应优先采用 **SSG（静态站点生成）** 或 **ISR（增量静态再生）**，构建期算好 HTML 推上 CDN，兼具 SSR 的秒开/SEO 优势与 CSR 的零服务器运维成本。"
  }
]
