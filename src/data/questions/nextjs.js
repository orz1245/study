// Next.js 面试题（12 题）
export const nextjsQuestions = [
  {
    id: 'next-001',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'easy',
    tags: ['App Router', 'Pages Router', '对比'],
    question: 'Next.js 的 App Router 和 Pages Router 有什么区别？',
    answer: `Next.js 有两套路由：

- **Pages Router**（传统）：基于 \`pages/\` 目录，每个文件是一个路由；用 \`getServerSideProps\` / \`getStaticProps\` 做数据获取
- **App Router**（Next 13+ 推荐）：基于 \`app/\` 目录，支持**React Server Components**、嵌套布局、更细的加载/错误边界；用 \`async\` 组件 + \`fetch\` 直接取数

\`\`\`text
app/
  layout.tsx        // 根布局（必需）
  page.tsx          // / 路由
  dashboard/
    layout.tsx      // 嵌套布局
    page.tsx
\`\`\`

**选型**：新项目用 App Router；老项目继续 Pages Router 或渐进迁移。App Router 的 Server Component 能减少客户端 JS 体积。`
  },
  {
    id: 'next-002',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'easy',
    tags: ['文件路由', '约定', '动态路由'],
    question: 'Next.js 的文件路由约定是怎样的？动态路由怎么写？',
    answer: `**App Router（app/ 目录）**：

- \`app/page.tsx\` → \`/\`
- \`app/about/page.tsx\` → \`/about\`
- \`app/blog/[slug]/page.tsx\` → 动态路由 \`/blog/:slug\`
- \`app/shop/[...all]/page.tsx\` → 全捕获（catch-all）\`/shop/a/b/c\`

动态参数在组件里通过 \`params\` 接收（App Router）：

\`\`\`tsx
// app/blog/[slug]/page.tsx
export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <article>{post.title}</article>
}
\`\`\`

> Pages Router 用 \`[slug].js\`，参数在 \`router.query\` 里。`
  },
  {
    id: 'next-003',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Server Components', 'Client Components', 'RSC'],
    question: '什么是 React Server Components（RSC）？服务端组件和客户端组件如何区分？',
    answer: `**RSC** 是在**服务端渲染、不发送到客户端**的组件，能直接访问数据库/文件系统，且**不增加客户端 JS 体积**。

- **Server Component（默认）**：在 \`app/\` 下不加 \`'use client'\` 的组件，运行在服务端，可 \`async\`、可直接查库
- **Client Component**：文件顶部写 \`'use client'\` 指令，运行在浏览器，可使用 \`useState\`/事件

\`\`\`tsx
// 服务端组件（默认）
export default async function Page() {
  const data = await db.query()   // 直接查库，不暴露给前端
  return <ClientPart initial={data} />
}
// client.tsx
'use client'
export default function ClientPart({ initial }) {
  const [n, setN] = useState(initial)
  return <button onClick={() => setN(n + 1)}>{n}</button>
}
\`\`\`

> 原则：能服务端的尽量服务端（减小包体）；需要交互/浏览器 API 才标 \`'use client'\`。`
  },
  {
    id: 'next-004',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['数据获取', 'fetch', '缓存'],
    question: 'App Router 里怎么取数？fetch 的缓存策略有哪些？',
    answer: `App Router 的 Server Component 里可直接 \`await fetch\`，Next 自动按**请求 memoization + 路由级缓存**处理：

\`\`\`tsx
async function getData() {
  const res = await fetch('https://api.x.com/data', { next: { revalidate: 60 } }) // ISR：60s 再生
  return res.json()
}
export default async function Page() {
  const data = await getData()   // 同一请求在渲染中只取一次
  return <List data={data} />
}
\`\`\`

**缓存选项（\`next\` 字段）**：

- \`{ cache: 'no-store' }\`：每次请求都拉最新（等同 SSR）
- \`{ next: { revalidate: 60 } }\`：ISR，60 秒再生
- \`{ next: { tags: ['post'] } }\` + \`revalidateTag('post')\`：按 tag 按需失效

> Pages Router 用 \`getStaticProps\` / \`getServerSideProps\`；App Router 统一用 async 组件 + fetch 的 \`next\` 配置。`
  },
  {
    id: 'next-005',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['SSG', 'generateStaticParams', '静态生成'],
    question: 'Next.js 如何实现 SSG（静态生成）？动态路由如何预渲染？',
    answer: `**SSG** 在**构建时**把页面渲染成静态 HTML，访问极快、可上 CDN。

- 不带参数的页面默认静态生成
- 动态路由需配合 \`generateStaticParams\` 提供参数列表，Next 在构建时逐个预渲染

\`\`\`tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts()       // 构建时拿到所有 slug
  return posts.map(p => ({ slug: p.slug }))
}
export default async function Page({ params }) {
  const post = await getPost(params.slug)
  return <article>{post.body}</article>
}
\`\`\`

> \`dynamicParams = false\` 时可禁止未预渲染的参数被按需生成（访问即 404）。Pages Router 用 \`getStaticPaths\` + \`getStaticProps\`。`
  },
  {
    id: 'next-006',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['SSR', 'getServerSideProps', '服务端渲染'],
    question: 'Next.js 的 SSR（服务端渲染）怎么做？和 SSG 的区别？',
    answer: `**SSR** 在**每次请求时**在服务端渲染页面，适合内容频繁变化、需实时数据的页面。

App Router：\`fetch\` 用 \`{ cache: 'no-store' }\` 或不缓存即走 SSR。
Pages Router：导出 \`getServerSideProps\`：

\`\`\`js
export async function getServerSideProps(ctx) {
  const data = await fetchRealtime(ctx.req)
  return { props: { data } }   // 每次请求都执行
}
\`\`\`

**SSR vs SSG**：

- SSG：构建时生成，极快、可 CDN 缓存，但内容固定（可用 ISR 折中）
- SSR：请求时生成，实时但每次有服务端开销、TTFB 略高`
  },
  {
    id: 'next-007',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['ISR', '增量静态再生', '缓存失效'],
    question: '什么是 ISR（增量静态再生）？解决什么问题？',
    answer: `**ISR** 让 SSG 页面在**构建后也能按时间段后台重新生成**，兼顾「静态速度」与「内容新鲜度」。

\`\`\`tsx
// App Router
fetch(url, { next: { revalidate: 60 } })   // 60 秒后下次请求触发再生
// Pages Router
export const getStaticProps = () => ({ props: {}, revalidate: 60 })
\`\`\`

**解决的问题**：纯 SSG 内容发布后需重新构建全站；纯 SSR 每次请求都查库。ISR 让页面先返回旧的静态版本（毫秒级），后台异步用新数据再生，下一个请求拿到更新后的页面。

> 适合博客、商品详情等「大体静态但偶尔更新」的场景。`
  },
  {
    id: 'next-008',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'easy',
    tags: ['layout', 'loading', 'error', '约定文件'],
    question: 'App Router 有哪些特殊约定文件（layout / loading / error / template）？',
    answer: `App Router 用**同名文件**约定 UI 片段，自动套用：

- \`layout.tsx\`：包裹子路由的布局，**状态持久**（切换子路由不重新挂载），可嵌套
- \`template.tsx\`：类似 layout，但**每次导航都重新创建实例**（适合需要重挂载动画的场景）
- \`loading.tsx\`：基于 Suspense，子路由加载中显示的骨架/Spinner
- \`error.tsx\`：用错误边界捕获子路由渲染错误，需标 \`'use client'\`
- \`not-found.tsx\`：404 页面
- \`global-error.tsx\`：根级错误兜底

\`\`\`text
app/
  layout.tsx      (根布局，包 <html><body>)
  error.tsx       (根错误边界)
  loading.tsx     (根加载态)
  dashboard/
    layout.tsx
    loading.tsx
\`\`\``
  },
  {
    id: 'next-009',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Server Actions', '表单', '变更'],
    question: 'Next.js 的 Server Actions 是什么？怎么用？',
    answer: `**Server Actions** 是运行在服务端的异步函数，可在表单提交/交互中直接修改数据（如写库），**无需手写 API 路由**。在 App Router 中通过 \`'use server'\` 指令声明。

\`\`\`tsx
// app/actions.ts
'use server'
export async function createTodo(formData: FormData) {
  await db.todo.create({ title: formData.get('title') })
  revalidatePath('/todos')   // 重新验证缓存
}

// app/page.tsx
<form action={createTodo}>
  <input name="title" />
  <button type="submit">添加</button>
</form>
\`\`\`

**优点**：减少前后端样板、天然支持流式/渐进增强、与服务端状态无缝。

> 也可内联：\`async function action() { 'use server'; ... }\`。注意不要在客户端泄露敏感逻辑。`
  },
  {
    id: 'next-010',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['middleware', '中间件', '鉴权'],
    question: 'Next.js 的 middleware 是什么？用于哪些场景？',
    answer: `\`middleware.ts\` 运行在**请求到达页面/API 之前**（Edge Runtime），可对请求做拦截/改写/重定向，性能极高。

\`\`\`ts
// middleware.ts（根目录或 src/）
import { NextResponse } from 'next/server'
export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')
  if (!token) return NextResponse.redirect(new URL('/login', req.url))
  return NextResponse.next()
}
export const config = { matcher: ['/dashboard/:path*'] }  // 只对匹配路径生效
\`\`\`

**场景**：登录鉴权、A/B 测试分流、国际化（根据 \`Accept-Language\` 改写路径）、防盗链、请求头注入。

> 注意 middleware 跑在 Edge（轻量、无 Node API），重计算应放页面/API 路由。`
  },
  {
    id: 'next-011',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['next/image', '性能', '优化'],
    question: 'next/image 解决了哪些图片性能问题？',
    answer: `\`next/image\` 是优化后的 \`<img>\` 替代，自动：

1. **懒加载**（默认 \`loading="lazy"\`）
2. **防止布局抖动**：要求显式 \`width/height\`（或用 \`fill\`）预留空间
3. **自动优化格式/尺寸**：服务端按需转 WebP/AVIF、按设备分辨率提供 \`srcset\`
4. **占位**：\`placeholder="blur"\` 生成模糊预览

\`\`\`tsx
import Image from 'next/image'
<Image src="/hero.png" alt="hero" width={1200} height={600} priority />  // priority 跳过懒加载（首屏大图）
\`\`\`

> 远程图片需在 \`next.config\` 的 \`images.remotePatterns\` 里白名单。配 CDN 时图片优化由 Next 的 \`/_next/image\` 代理完成。`
  },
  {
    id: 'next-012',
    category: 'nextjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['部署', 'Vercel', 'standalone'],
    question: 'Next.js 应用如何部署？Vercel 之外怎么自建？',
    answer: `**Vercel（官方）**：\`git push\` 即部署，自动识别 Next、配置 Serverless Function 与边缘缓存，最省心。

**自建 / 容器**：

- \`next build\` 产出 \`.next/\`
- \`next start\` 启动 Node 服务（需 Node 运行时，支持 SSR/ISR）
- 配置 \`output: 'standalone'\` 可产出**精简自包含服务**（含运行时依赖），极适合 Docker

\`\`\`dockerfile
FROM node:18-alpine
COPY .next/standalone ./
COPY .next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

> 纯静态导出用 \`output: 'export'\`（但会失去 SSR/ISR/Server Actions，只剩 SSG）。`
  }
]
