// SSR / SSG 通用原理面试题（10 题）
export const ssrSsgQuestions = [
  {
    id: 'ssr-001',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'easy',
    tags: ['CSR', 'SSR', 'SSG', 'ISR', '对比'],
    question: 'CSR、SSR、SSG、ISR 四种渲染模式有什么区别？',
    answer: `\`\`\`text
CSR（客户端渲染）：浏览器下载空 HTML + JS，JS 渲染内容。首屏白屏久、SEO 差，但交互快。
SSR（服务端渲染）：每次请求时服务端渲染完整 HTML。首屏快、SEO 好，但有服务端开销。
SSG（静态生成）：构建时生成静态 HTML。最快、可 CDN，但内容固定。
ISR（增量静态再生）：SSG + 定时后台再生，兼顾速度与新鲜度。
\`\`\`

| 模式 | 渲染时机 | 首屏 | SEO | 服务端压力 |
| --- | --- | --- | --- | --- |
| CSR | 浏览器 | 慢 | 差 | 无 |
| SSR | 每次请求 | 快 | 好 | 高 |
| SSG | 构建时 | 极快 | 好 | 无 |
| ISR | 构建+定时再生 | 极快 | 好 | 低 |

> 选型：内容站/博客用 SSG/ISR；个性化/实时用 SSR；强交互后台用 CSR 或混合。`
  },
  {
    id: 'ssr-002',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'medium',
    tags: ['hydration', '注水', '脱水'],
    question: '什么是「注水」（Hydration）？注水过程是怎样的？',
    answer: `**注水**指 SSR 把 HTML 发给浏览器后，客户端 JS **接管已存在的 DOM 并绑定事件**，让它变成可交互的 React/Vue 应用。

过程：

1. 服务端渲染出带内容的 HTML，随页面返回
2. 浏览器先**快速显示**内容（首屏可见，但还不可交互）
3. 客户端 JS 加载，React/Vue 用同一套组件**重新渲染（不生成新 DOM，而是"复用"已有 DOM）**，并把事件监听器绑定上去
4. 注水完成 → 页面可交互

\`\`\`js
// 服务端
const html = renderToString(<App />)
// 客户端（React 18 createRoot）
hydrateRoot(document.getElementById('root'), <App />)
\`\`\`

> 注水是「让静态 HTML 活起来」的过程；若服务端/客户端渲染结构不一致会报 hydration mismatch。`
  },
  {
    id: 'ssr-003',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'medium',
    tags: ['同构', 'isomorphic', '一套代码'],
    question: '什么是「同构（Isomorphic / Universal）」渲染？',
    answer: `**同构**指**同一份代码/组件既能在服务端渲染、又能在客户端运行**，避免为两端各写一套。

\`\`\`text
服务端：renderToString(<App/>)  -> 生成 HTML 字符串
客户端：hydrateRoot(<App/>)      -> 复用 HTML 并注水
两者共用 <App/> 组件与大部分逻辑
\`\`\`

**好处**：首屏 SSR（快、SEO 好）+ 客户端交互（SPA 体验），代码只写一份。

**注意点（服务端特有坑）**：

- 服务端**没有 \`window\` / \`document\` / \`localStorage\`**，访问会报错 → 用 \`typeof window !== 'undefined'\` 守卫，或放到 \`useEffect/onMounted\` 等客户端生命周期
- 服务端代码会**常驻共享**，避免用模块级可变全局状态（会被并发请求串数据）`
  },
  {
    id: 'ssr-004',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'medium',
    tags: ['hydration mismatch', '水合不匹配', '排查'],
    question: '什么是 hydration mismatch（水合不匹配）？如何避免？',
    answer: `服务端渲染的 HTML 与客户端首次渲染的**结构/文本不一致**，React/Vue 会丢弃服务端 DOM 重新渲染，并报警告，严重时导致闪烁/状态错乱。

**常见原因**：

1. 直接使用 \`Date.now()\` / \`Math.random()\` 生成内容（两端值不同）
2. 依赖 \`window\` / \`localStorage\` 立即渲染（服务端无值）
3. 根据浏览器特性（如登录态）在服务端渲染了与客户端不同的 UI
4. ID 不一致（如用 random 生成 key/id，而非 \`useId\`）

\`\`\`js
// 错误：服务端/客户端随机数不同
<span>{Math.random()}</span>
// 正确：用 useId 或延迟到客户端副作用里生成
\`\`\`

**避免**：用 \`useId\` 生成 id；把依赖浏览器环境的值放到 \`useEffect/onMounted\` 里设置（先渲染占位，注水后再填）。`
  },
  {
    id: 'ssr-005',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'easy',
    tags: ['SEO', '首屏', '性能'],
    question: 'SSR 对 SEO 和首屏性能有什么帮助？',
    answer: `**SEO**：搜索引擎爬虫拿到的是**完整 HTML 文本**（而非空壳 + 等 JS 执行），抓取/收录更可靠，社交分享卡片（OG 标签）也能正确解析。纯 CSR 的 SPA 对部分爬虫不友好。

**首屏性能**：SSR 返回已渲染内容，用户**无需等 JS 下载执行完**就能看到文字/结构（FCP/LCP 更早），尤其弱网/低端机体验提升明显。

> 但 SSR 的 TTFB（首字节）可能更高（服务端要现渲染）；配合流式 SSR、CDN 缓存可缓解。CSR 首屏则依赖 JS 体积与设备性能。`
  },
  {
    id: 'ssr-006',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'hard',
    tags: ['流式 SSR', 'Streaming', 'Suspense'],
    question: '什么是流式 SSR（Streaming SSR）？和传统的整页 SSR 有什么区别？',
    answer: `传统 SSR **等整个页面渲染完**才把 HTML 一次性发给浏览器，慢组件会拖垮整页 TTFB。

**流式 SSR** 利用 HTTP 流式响应，**先发 shell（骨架/导航），再按组件就绪顺序分块发送内容**（借助 \`Suspense\` / 异步组件）：

\`\`\`js
// React 18：流式 + Suspense
renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js']
})
// 快的组件先到，慢的（如 <Suspense> 包裹的评论区）稍后到达并替换占位
\`\`\`

**好处**：

- 首屏可见时间更短（先看到布局）
- 一个慢的数据请求不会阻塞整页
- 配合 \`<Suspense fallback>\` 给用户即时反馈

> 注意：流式要求服务端/网关支持分块传输（chunked encoding）。`
  },
  {
    id: 'ssr-007',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'medium',
    tags: ['数据注水', 'INITIAL_STATE', '安全'],
    question: 'SSR 中如何把服务端数据「注水」到客户端，避免重复请求？',
    answer: `服务端取到的数据要**序列化进 HTML**，客户端注水时直接复用，避免再请求一次（防瀑布流/闪烁）。

\`\`\`js
// 服务端：把数据挂到 window 上
const data = await fetchData()
const html = \`<div id="root">\${renderToString(<App data={data}/>)}</div>
<script>window.__INITIAL_STATE__ = \${JSON.stringify(safeData)}</script>\`
// 客户端：直接读，不再请求
const data = window.__INITIAL_STATE__
hydrateRoot(document.getElementById('root'), <App data={data}/>)
\`\`\`

**注意安全**：

- 用 \`JSON.stringify\` 后要做 XSS 转义（\`<\` 等），防 \`<script>\` 注入
- 不要注入敏感信息（token、密码）
- React 18 的 Server Component / Next \`useFetch\` 已自动处理注水`
  },
  {
    id: 'ssr-008',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'medium',
    tags: ['SSG', '预渲染', '构建时'],
    question: 'SSG（静态生成）在构建时如何获取页面数据？有什么限制？',
    answer: `SSG 在**构建阶段**执行取数逻辑，把结果渲染进静态 HTML，之后所有请求都返回这份固定文件（可 CDN 缓存）。

\`\`\`js
// Next.js getStaticProps / Nuxt routeRules.prerender
export async function getStaticProps() {
  const posts = await getAllPosts()   // 构建时执行一次
  return { props: { posts } }
}
\`\`\`

**限制**：

- 数据在构建时固化，**不能依赖请求时的参数**（如用户 cookie、实时查询）
- 数据更新需**重新构建**（或用 ISR 折中）
- 页面数量极大时构建时间会变长（可用按需生成/ISR 缓解）

> 适合：营销页、文档、博客、商品详情等「大体不变」的内容。`
  },
  {
    id: 'ssr-009',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'medium',
    tags: ['静态资源', 'CDN', '缓存'],
    question: 'SSR/SSG 应用的静态资源与缓存策略怎么设计？',
    answer: `**静态资源**（JS/CSS/图片）：带内容哈希文件名 → \`Cache-Control: max-age=31536000, immutable\`，永远命中强缓存。

**HTML 页面**：

- SSG 页面：可长缓存（内容不变）
- SSR 页面：通常不缓存或短缓存（内容随请求变），用 CDN 边缘缓存 + \`Cache-Tag\`/\`Surrogate-Key\` 做精准失效
- ISR 页面：CDN 缓存一段时间，后台再生

\`\`\`text
浏览器 → CDN(边缘) → 命中则直接返回；未命中 → 源站 SSR/静态
\`\`\`

> 把「不变的资源」与「会变的内容」分离缓存是核心思想；配合 stale-while-revalidate 还能「先返回旧、后台更新」。`
  },
  {
    id: 'ssr-010',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'hard',
    tags: ['取舍', '适用场景', '成本'],
    question: 'SSR 的代价和适用边界是什么？什么时候不该用 SSR？',
    answer: `**SSR 的代价**：

- 需要服务端运行时（成本、运维、扩缩容）
- 每次请求都渲染，TTFB 可能更高、服务端 CPU 压力大
- 调试复杂（hydration mismatch、双端环境差异）
- 必须处理「服务端无浏览器 API」的坑

**不该用 SSR 的场景**：

- 纯后台管理系统（无需 SEO、内网、登录后）
- 强实时/重交互的应用（CSR 反而更简单）
- 团队无服务端运维能力、又不需要 SEO

**推荐**：用**混合渲染**——需要 SEO/首屏的页面（首页、商品、文章）走 SSR/SSG，后台/工具页走 CSR。框架（Next/Nuxt）都能按路由分别配置。`
  }
]
