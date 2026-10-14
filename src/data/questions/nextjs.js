export const nextjsQuestions = [
  {
    "id": "next-001",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "App Router",
      "Pages Router",
      "对比"
    ],
    "question": "Next.js 的 App Router 和 Pages Router 有什么区别？",
    "answer": "Next.js 有两套路由：\n\n- **Pages Router**（传统）：基于 `pages/` 目录，每个文件是一个路由；用 `getServerSideProps` / `getStaticProps` 做数据获取\n- **App Router**（Next 13+ 推荐）：基于 `app/` 目录，支持**React Server Components**、嵌套布局、更细的加载/错误边界；用 `async` 组件 + `fetch` 直接取数\n\n```text\napp/\n  layout.tsx        // 根布局（必需）\n  page.tsx          // / 路由\n  dashboard/\n    layout.tsx      // 嵌套布局\n    page.tsx\n```\n\n**选型**：新项目用 App Router；老项目继续 Pages Router 或渐进迁移。App Router 的 Server Component 能减少客户端 JS 体积。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-002",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "文件路由",
      "约定",
      "动态路由"
    ],
    "question": "Next.js 的文件路由约定是怎样的？动态路由怎么写？",
    "answer": "**App Router（app/ 目录）**：\n\n- `app/page.tsx` → `/`\n- `app/about/page.tsx` → `/about`\n- `app/blog/[slug]/page.tsx` → 动态路由 `/blog/:slug`\n- `app/shop/[...all]/page.tsx` → 全捕获（catch-all）`/shop/a/b/c`\n\n动态参数在组件里通过 `params` 接收（App Router）：\n\n```tsx\n// app/blog/[slug]/page.tsx\nexport default async function Page({ params }: { params: { slug: string } }) {\n  const post = await getPost(params.slug)\n  return <article>{post.title}</article>\n}\n```\n\n> Pages Router 用 `[slug].js`，参数在 `router.query` 里。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-003",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Server Components",
      "Client Components",
      "RSC"
    ],
    "question": "什么是 React Server Components（RSC）？服务端组件和客户端组件如何区分？",
    "answer": "**RSC** 是在**服务端渲染、不发送到客户端**的组件，能直接访问数据库/文件系统，且**不增加客户端 JS 体积**。\n\n- **Server Component（默认）**：在 `app/` 下不加 `'use client'` 的组件，运行在服务端，可 `async`、可直接查库\n- **Client Component**：文件顶部写 `'use client'` 指令，运行在浏览器，可使用 `useState`/事件\n\n```tsx\n// 服务端组件（默认）\nexport default async function Page() {\n  const data = await db.query()   // 直接查库，不暴露给前端\n  return <ClientPart initial={data} />\n}\n// client.tsx\n'use client'\nexport default function ClientPart({ initial }) {\n  const [n, setN] = useState(initial)\n  return <button onClick={() => setN(n + 1)}>{n}</button>\n}\n```\n\n> 原则：能服务端的尽量服务端（减小包体）；需要交互/浏览器 API 才标 `'use client'`。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-004",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "数据获取",
      "fetch",
      "缓存"
    ],
    "question": "App Router 里怎么取数？fetch 的缓存策略有哪些？",
    "answer": "App Router 的 Server Component 里可直接 `await fetch`，Next 自动按**请求 memoization + 路由级缓存**处理：\n\n```tsx\nasync function getData() {\n  const res = await fetch('https://api.x.com/data', { next: { revalidate: 60 } }) // ISR：60s 再生\n  return res.json()\n}\nexport default async function Page() {\n  const data = await getData()   // 同一请求在渲染中只取一次\n  return <List data={data} />\n}\n```\n\n**缓存选项（`next` 字段）**：\n\n- `{ cache: 'no-store' }`：每次请求都拉最新（等同 SSR）\n- `{ next: { revalidate: 60 } }`：ISR，60 秒再生\n- `{ next: { tags: ['post'] } }` + `revalidateTag('post')`：按 tag 按需失效\n\n> Pages Router 用 `getStaticProps` / `getServerSideProps`；App Router 统一用 async 组件 + fetch 的 `next` 配置。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-005",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "SSG",
      "generateStaticParams",
      "静态生成"
    ],
    "question": "Next.js 如何实现 SSG（静态生成）？动态路由如何预渲染？",
    "answer": "**SSG** 在**构建时**把页面渲染成静态 HTML，访问极快、可上 CDN。\n\n- 不带参数的页面默认静态生成\n- 动态路由需配合 `generateStaticParams` 提供参数列表，Next 在构建时逐个预渲染\n\n```tsx\n// app/blog/[slug]/page.tsx\nexport async function generateStaticParams() {\n  const posts = await getAllPosts()       // 构建时拿到所有 slug\n  return posts.map(p => ({ slug: p.slug }))\n}\nexport default async function Page({ params }) {\n  const post = await getPost(params.slug)\n  return <article>{post.body}</article>\n}\n```\n\n> `dynamicParams = false` 时可禁止未预渲染的参数被按需生成（访问即 404）。Pages Router 用 `getStaticPaths` + `getStaticProps`。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-006",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "SSR",
      "getServerSideProps",
      "服务端渲染"
    ],
    "question": "Next.js 的 SSR（服务端渲染）怎么做？和 SSG 的区别？",
    "answer": "**SSR** 在**每次请求时**在服务端渲染页面，适合内容频繁变化、需实时数据的页面。\n\nApp Router：`fetch` 用 `{ cache: 'no-store' }` 或不缓存即走 SSR。\nPages Router：导出 `getServerSideProps`：\n\n```js\nexport async function getServerSideProps(ctx) {\n  const data = await fetchRealtime(ctx.req)\n  return { props: { data } }   // 每次请求都执行\n}\n```\n\n**SSR vs SSG**：\n\n- SSG：构建时生成，极快、可 CDN 缓存，但内容固定（可用 ISR 折中）\n- SSR：请求时生成，实时但每次有服务端开销、TTFB 略高\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-007",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "ISR",
      "增量静态再生",
      "缓存失效"
    ],
    "question": "什么是 ISR（增量静态再生）？解决什么问题？",
    "answer": "**ISR** 让 SSG 页面在**构建后也能按时间段后台重新生成**，兼顾「静态速度」与「内容新鲜度」。\n\n```tsx\n// App Router\nfetch(url, { next: { revalidate: 60 } })   // 60 秒后下次请求触发再生\n// Pages Router\nexport const getStaticProps = () => ({ props: {}, revalidate: 60 })\n```\n\n**解决的问题**：纯 SSG 内容发布后需重新构建全站；纯 SSR 每次请求都查库。ISR 让页面先返回旧的静态版本（毫秒级），后台异步用新数据再生，下一个请求拿到更新后的页面。\n\n> 适合博客、商品详情等「大体静态但偶尔更新」的场景。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-008",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "layout",
      "loading",
      "error",
      "约定文件"
    ],
    "question": "App Router 有哪些特殊约定文件（layout / loading / error / template）？",
    "answer": "App Router 用**同名文件**约定 UI 片段，自动套用：\n\n- `layout.tsx`：包裹子路由的布局，**状态持久**（切换子路由不重新挂载），可嵌套\n- `template.tsx`：类似 layout，但**每次导航都重新创建实例**（适合需要重挂载动画的场景）\n- `loading.tsx`：基于 Suspense，子路由加载中显示的骨架/Spinner\n- `error.tsx`：用错误边界捕获子路由渲染错误，需标 `'use client'`\n- `not-found.tsx`：404 页面\n- `global-error.tsx`：根级错误兜底\n\n```text\napp/\n  layout.tsx      (根布局，包 <html><body>)\n  error.tsx       (根错误边界)\n  loading.tsx     (根加载态)\n  dashboard/\n    layout.tsx\n    loading.tsx\n```\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-009",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Server Actions",
      "表单",
      "变更"
    ],
    "question": "Next.js 的 Server Actions 是什么？怎么用？",
    "answer": "**Server Actions** 是运行在服务端的异步函数，可在表单提交/交互中直接修改数据（如写库），**无需手写 API 路由**。在 App Router 中通过 `'use server'` 指令声明。\n\n```tsx\n// app/actions.ts\n'use server'\nexport async function createTodo(formData: FormData) {\n  await db.todo.create({ title: formData.get('title') })\n  revalidatePath('/todos')   // 重新验证缓存\n}\n\n// app/page.tsx\n<form action={createTodo}>\n  <input name=\"title\" />\n  <button type=\"submit\">添加</button>\n</form>\n```\n\n**优点**：减少前后端样板、天然支持流式/渐进增强、与服务端状态无缝。\n\n> 也可内联：`async function action() { 'use server'; ... }`。注意不要在客户端泄露敏感逻辑。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-010",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "middleware",
      "中间件",
      "鉴权"
    ],
    "question": "Next.js 的 middleware 是什么？用于哪些场景？",
    "answer": "`middleware.ts` 运行在**请求到达页面/API 之前**（Edge Runtime），可对请求做拦截/改写/重定向，性能极高。\n\n```ts\n// middleware.ts（根目录或 src/）\nimport { NextResponse } from 'next/server'\nexport function middleware(req: NextRequest) {\n  const token = req.cookies.get('token')\n  if (!token) return NextResponse.redirect(new URL('/login', req.url))\n  return NextResponse.next()\n}\nexport const config = { matcher: ['/dashboard/:path*'] }  // 只对匹配路径生效\n```\n\n**场景**：登录鉴权、A/B 测试分流、国际化（根据 `Accept-Language` 改写路径）、防盗链、请求头注入。\n\n> 注意 middleware 跑在 Edge（轻量、无 Node API），重计算应放页面/API 路由。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-011",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "next/image",
      "性能",
      "优化"
    ],
    "question": "next/image 解决了哪些图片性能问题？",
    "answer": "`next/image` 是优化后的 `<img>` 替代，自动：\n\n1. **懒加载**（默认 `loading=\"lazy\"`）\n2. **防止布局抖动**：要求显式 `width/height`（或用 `fill`）预留空间\n3. **自动优化格式/尺寸**：服务端按需转 WebP/AVIF、按设备分辨率提供 `srcset`\n4. **占位**：`placeholder=\"blur\"` 生成模糊预览\n\n```tsx\nimport Image from 'next/image'\n<Image src=\"/hero.png\" alt=\"hero\" width={1200} height={600} priority />  // priority 跳过懒加载（首屏大图）\n```\n\n> 远程图片需在 `next.config` 的 `images.remotePatterns` 里白名单。配 CDN 时图片优化由 Next 的 `/_next/image` 代理完成。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-012",
    "category": "nextjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "部署",
      "Vercel",
      "standalone"
    ],
    "question": "Next.js 应用如何部署？Vercel 之外怎么自建？",
    "answer": "**Vercel（官方）**：`git push` 即部署，自动识别 Next、配置 Serverless Function 与边缘缓存，最省心。\n\n**自建 / 容器**：\n\n- `next build` 产出 `.next/`\n- `next start` 启动 Node 服务（需 Node 运行时，支持 SSR/ISR）\n- 配置 `output: 'standalone'` 可产出**精简自包含服务**（含运行时依赖），极适合 Docker\n\n```dockerfile\nFROM node:18-alpine\nCOPY .next/standalone ./\nCOPY .next/static ./.next/static\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n```\n\n> 纯静态导出用 `output: 'export'`（但会失去 SSR/ISR/Server Actions，只剩 SSG）。\n\n### Next.js App Router 生产架构与缓存治理要点\n\n| 架构层次 | Next.js 机制说明 | 生产环境避坑与最佳实践 |\n| :--- | :--- | :--- |\n| **组件边界（RSC vs Client）** | 默认全部为 Server Components（零客户端 Bundle 体积） | 将 `'use client'` 边界尽可能向叶子节点（交互按钮、搜索框）下沉，通过 `children` 插槽在客户端组件内嵌套服务端组件 |\n| **四层缓存体系** | Request Memoization → Data Cache → Full Route Cache → Router Cache | Next.js 15+ 默认不再强制缓存 `fetch` 与 Route Handlers；需要静态化时显式声明 `cache: 'force-cache'` 或 `revalidate` |\n| **流式渲染与错误隔离** | `loading.tsx`（自动包裹 `Suspense`）与 `error.tsx`（自动包裹 `ErrorBoundary`） | 为慢速数据源拆分独立 `<Suspense>` 边界，避免单一慢接口阻塞整页 TTFB |\n\n```tsx\n// Next.js App Router 标准范式：在客户端交互外壳中通过 children 无缝插槽传入服务端组件（避免把重型服务端组件污染成客户端组件）\n// 1. ClientWrapper.tsx ('use client')\n'use client'\nimport { useState } from 'react'\nexport function CollapsiblePanel({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(true)\n  return (\n    <section>\n      <button onClick={() => setOpen(!open)}>{open ? '收起' : '展开'}</button>\n      {open && <div>{children}</div>}\n    </section>\n  )\n}\n\n// 2. page.tsx (Server Component)\nimport { CollapsiblePanel } from './ClientWrapper'\nimport { ServerDatabaseReport } from './ServerDatabaseReport'\nexport default function Page() {\n  return (\n    <CollapsiblePanel>\n      {/* ServerDatabaseReport 依然在服务端执行查库，不会打包进浏览器 JS！ */}\n      <ServerDatabaseReport />\n    </CollapsiblePanel>\n  )\n}\n```"
  },
  {
    "id": "next-013",
    "category": "nextjs",
    "difficulty": "hard",
    "question": "Next.js 15+ 异步请求 API、默认缓存策略反转与 PPR（部分预渲染）架构是如何工作的？",
    "tags": [
      "Next.js15",
      "PPR",
      "异步API",
      "缓存反转",
      "React19"
    ],
    "answer": "Next.js 15 是 App Router 架构走向成熟的分水岭版本，它彻底重构了 **请求上下文 API 的同步/异步契约**、**默认缓存（Caching）策略**，并引入了 **PPR（Partial Prerendering，部分预渲染）** 渲染模型。\n\n### 一、 为什么 Next.js 15 将 `cookies()`、`headers()`、`params` 和 `searchParams` 全部改为异步（Async）？\n\n在 Next.js 13/14 中，`cookies()`、`headers()` 和路由 `params` 是同步读取的，这迫使服务端必须等整个 HTTP 请求头与上下文解析完毕才能开始准备渲染。改为**返回 Promise（必须 `await`）**后：\n1. **为 PPR 部分预渲染铺平道路**：只要组件还没执行到 `await cookies()` 这一行，所有前置的静态组件外壳可以在构建期或请求到达的 0ms 瞬间直接从 CDN 流式发出！\n2. **明确的动态渲染边界**：一旦代码在 `<Suspense>` 内部执行了 `await cookies()` 或 `await headers()`，Next.js 就精确地只把该 `<Suspense>` 子树标记为动态流式空洞（Dynamic Hole），而不会连累整页退化为动态 SSR。\n\n### 二、 Next.js 14 vs Next.js 15 默认缓存策略反转对比表\n\n| 缓存场景 | Next.js 14 默认行为（激进缓存，易出陈旧数据坑） | Next.js 15+ 默认行为（显式Opt-in缓存，符合直觉） |\n| :--- | :--- | :--- |\n| **`fetch()` 请求** | 默认 `cache: 'force-cache'`（永久缓存） | 默认 **`no-store`（每次请求拉取最新数据）**；需缓存时显式传 `cache: 'force-cache'` 或 `next: { revalidate: N }` |\n| **`GET` Route Handlers (`app/api/**/route.ts`)** | 默认被当作静态文件在构建期缓存！ | 默认 **`dynamic`（每次动态执行）**；需静态化时显式声明 `export const dynamic = 'force-static'` |\n| **Client Router Cache（客户端路由缓存）** | 页面段默认在浏览器内存缓存 30 秒 | 页面段默认 **`staleTime: 0`**（导航前进时始终获取最新服务端数据，仅浏览器后退/前进复用缓存） |\n\n### 三、 Next.js 15 异步 API 与 `use cache` / PPR 代码实战\n\n```tsx\nimport { Suspense } from 'react'\nimport { cookies } from 'next/headers'\n\n// Next.js 15+：params 与 searchParams 均为 Promise，必须 await 解包\nexport default async function OrderPage({\n  params,\n  searchParams,\n}: {\n  params: Promise<{ id: string }>\n  searchParams: Promise<{ tab?: string }>\n}) {\n  const { id } = await params\n  const { tab = 'detail' } = await searchParams\n\n  return (\n    <section>\n      {/* 静态预渲染头部：构建期直接固化进 HTML 外壳 */}\n      <h1>订单详情 #{id}（当前页签：{tab}）</h1>\n\n      {/* 动态流式区域：仅此 Suspense 内部读取 Cookie，不阻塞外层静态壳秒开 */}\n      <Suspense fallback={<p>正在校验用户专属优惠...</p>}>\n        <UserDiscountBanner orderId={id} />\n      </Suspense>\n    </section>\n  )\n}\n\nasync function UserDiscountBanner({ orderId }: { orderId: string }) {\n  const cookieStore = await cookies()\n  const sessionToken = cookieStore.get('session_id')?.value\n  const discount = await fetchUserDiscount(orderId, sessionToken)\n  return <div className=\"banner\">专属抵扣：¥{discount}</div>\n}\n```"
  },
  {
    "id": "next-014",
    "category": "nextjs",
    "difficulty": "hard",
    "question": "React Server Components（RSC）Flight 协议负载格式与客户端选择性水合（Selective Hydration）底层原理是什么？",
    "tags": [
      "RSC原理",
      "Flight协议",
      "SelectiveHydration",
      "流式渲染",
      "Next.js底层"
    ],
    "answer": "很多开发者误以为 **React Server Components（RSC）** 等同于传统的 **SSR（服务端渲染 HTML）**。事实上，RSC 与 SSR 是互补的两套机制：**RSC 运行在 SSR 之前，其产出物不是 HTML 字符串，而是一种名为 React Flight 协议的流式行分隔序列化树（`text/x-component`）**。\n\n### 一、 RSC（Server Components）与传统 SSR 的本质区别\n\n| 维度 | React Server Components（RSC） | 传统 SSR（Server-Side Rendering） |\n| :--- | :--- | :--- |\n| **代码是否发送到浏览器** | **0 字节 JS 发往浏览器**（服务端组件内部引用的 `marked`、`highlight.js`、数据库驱动永远不进客户端 Bundle） | 组件代码必须同时打包进服务端与客户端 Bundle（以便客户端执行 Hydration 水合） |\n| **产出的数据格式** | **RSC Flight Payload**（含虚拟 DOM 结构描述、客户端组件 Module 引用占位符 `$L1` 与流式 Promise 槽位） | 纯 HTML 字符串流（`<!DOCTYPE html>...`） |\n| **客户端路由切换时** | 直接向服务端请求新页面的 **Flight Payload 流**，客户端 React 无缝合并更新虚拟 DOM 树，**不销毁当前页面状态（如输入框焦点、视频播放进度）** | 传统整页刷新或客户端被迫全量走 CSR 拉取 JSON |\n\n### 二、 RSC Flight 协议真实报文结构拆解\n\n当服务端渲染一棵包含客户端组件 `<LikeButton />` 与异步 `<Suspense>` 的 RSC 树时，发往客户端的 Flight 流（在首屏 HTML 底部的 `self.__next_f.push(...)` 中可见）长这样：\n\n```text\n// 第 1 行 (Chunk 1)：声明客户端组件模块引用表（告诉打包器去加载哪个客户端 JS chunk）\n1:I[\"app/components/LikeButton.tsx\", [\"app/page-chunk.js\"], \"LikeButton\"]\n\n// 第 2 行 (Chunk 0)：根组件树结构。注意：\n// - 服务端组件 <h1> 直接变成最终宿主标签 [\"$\",\"h1\",null,{\"children\":\"文章标题\"}]\n// - 客户端组件变成引用占位符 \"$L1\" 并附上序列化后的 Props {\"initialLikes\":42}\n// - 尚未完成的慢速 Suspense 子树变成挂起占位符 \"$2\"\n0:[\"$\",\"main\",null,{\"children\":[[\"$\",\"h1\",null,{\"children\":\"文章标题\"}],[\"$\",\"$L1\",null,{\"initialLikes\":42}],[\"$\",\"$react.suspense\",null,{\"fallback\":\"加载评论中...\",\"children\":\"$2\"}]]}]\n\n// 200ms 后慢接口返回，流式追加第 3 行 (Chunk 2)，客户端自动将 \"$2\" 替换为真实评论列表！\n2:[\"$\",\"ul\",null,{\"children\":[[\"$\",\"li\",null,{\"children\":\"第一条评论\"}]]}]\n```\n\n### 三、 客户端选择性水合（Selective Hydration）三大突破\n\n配合 React 18/19 的 `hydrateRoot` 与 `<Suspense>`，客户端水合不再是阻塞主线程的单次同步重操作：\n1. **分块流式水合**：HTML 流到达一块即可水合一块，无需等待底部的慢速 `<Suspense>` 块加载完成。\n2. **基于用户交互的优先级抢占（Interaction Re-prioritization）**：如果页面正在水合侧边栏 A，此时用户突然点击了评论区 B，React 捕获到原生点击事件后，会**立即中断 A 的水合，优先同步完成 B 的水合，并重放（Replay）刚才那次点击事件**！"
  }
]
