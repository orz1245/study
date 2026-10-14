export const nuxtjsQuestions = [
  {
    "id": "fw-033",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue",
      "SSR",
      "Nuxt"
    ],
    "question": "Vue 的 SSR（Nuxt.js）原理和适用场景？",
    "answer": "### Nuxt 3 基本结构\n\n```text\npages/\n  index.vue       → /\n  about.vue       → /about\n  users/[id].vue  → /users/:id\n\nserver/\n  api/            → API 路由\n\nnuxt.config.ts    → 配置\n```\n\n### 自动路由\n\n```vue\n<!-- pages/index.vue -->\n<template>\n  <div>Home Page</div>\n</template>\n\n<!-- pages/users/[id].vue -->\n<script setup>\nconst route = useRoute()\nconst { id } = route.params\n</script>\n```\n\n### 数据获取\n\n```javascript\n// useFetch — 自动序列化、去重、缓存\nconst { data: users } = await useFetch('/api/users')\n\n// useAsyncData — 自定义数据获取\nconst { data } = await useAsyncData('users', () => {\n  return $fetch('/api/users')\n})\n\n// 服务端获取数据，客户端水合\n```\n\n### 渲染模式\n\n```javascript\n// nuxt.config.ts\nexport default defineNuxtConfig({\n  // 默认 SSR\n  ssr: true,\n  \n  // 或混合渲染\n  routeRules: {\n    '/': { prerender: true },          // 静态生成\n    '/blog/**': { ssr: true },         // 服务端渲染\n    '/admin/**': { ssr: false },       // SPA 模式\n    '/api/**': { cors: true }          // API 路由\n  }\n})\n```\n\n### Vue SSR 原理\n\n```javascript\n// server-entry.js\nimport { createSSRApp } from 'vue'\nimport { renderToString } from 'vue/server-renderer'\n\nexport async function render(url) {\n  const app = createSSRApp(App)\n  const router = createRouter({ history: createMemoryHistory() })\n  app.use(router)\n  \n  await router.push(url)\n  await router.isReady()\n  \n  const html = await renderToString(app)\n  return html\n}\n```\n\n### Hydration\n\n```javascript\n// client-entry.js\nimport { createSSRApp } from 'vue'\n\nconst app = createSSRApp(App)\napp.use(router)\napp.mount('#app')\n// Vue 自动检测已有 DOM，进行 hydration（复用 DOM 而非重新渲染）\n```\n\n### Nuxt vs Next 对比\n\n| 特性 | Nuxt 3 | Next 13+ |\n|------|--------|----------|\n| 框架 | Vue 3 | React 18 |\n| 路由 | 文件系统 | 文件系统 |\n| 数据获取 | useFetch/useAsyncData | server components |\n| API 路由 | server/api | app/api |\n| 渲染模式 | 混合 | 混合 |\n| 开发体验 | 零配置 | 零配置 |\n\n### 适用场景\n- ✅ 内容网站（博客、电商、文档）\n- ✅ 需要 SEO 的应用\n- ✅ 首屏性能要求高\n- ❌ 后台管理系统\n- ❌ 需要复杂客户端交互的应用"
  },
  {
    "id": "nuxt-001",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Nuxt3",
      "Nitro引擎",
      "AutoImports",
      "HybridRendering",
      "Vue3"
    ],
    "question": "Nuxt 3 核心架构与 Nuxt 2 有哪些代际变革？Nitro 引擎、自动导入与 Hybrid Rendering 是如何协同的？",
    "answer": "Nuxt 3 并非 Nuxt 2 的简单版本升级，而是基于 **Vue 3 Composition API + Vite / Rspack + Nitro 跨平台服务端引擎 + UnJS 工具链** 的彻底重写。\n\n### 一、 Nuxt 2 与 Nuxt 3 核心代际对比\n\n| 架构维度 | Nuxt 2 | Nuxt 3 | 工程收益说明 |\n| :--- | :--- | :--- | :--- |\n| **底层框架与响应式** | Vue 2（Options API + `Object.defineProperty`） | Vue 3.5+（`<script setup>` + `Proxy` 链表响应式） | SSR 渲染吞吐量提升 2～3 倍，内存占用减半 |\n| **服务端运行时引擎** | `connect` / Node.js 强耦合服务 | **Nitro 引擎（基于 `h3` 极简 HTTP 框架）** | 零配置编译为 Cloudflare Workers、Vercel Edge、Deno 或独立体积仅 ~1MB 的 `.output` 产物 |\n| **构建工具链** | Webpack 4 | **Vite（默认）** / Webpack 5 / Rspack | 开发环境冷启动从数十秒降至毫秒级原生 ESM 按需编译 |\n| **数据获取范式** | 组件级 `asyncData()` 与 `fetch()` 钩子 | **`useAsyncData` / `useFetch` 组合式函数** | 支持在任意 `composables/` 中复用同构取数逻辑，内置去重与自动序列化 |\n| **渲染策略颗粒度** | 全站统一 SSR 或全站统一静态化 | **路由级混合渲染（Route Rules / Hybrid Rendering）** | 同一项目内可按 URL 前缀分别指定 SSG、ISR、SWR、CSR 或 301 重定向 |\n\n### 二、 代码实战：Nuxt 3 路由级混合渲染与同构取数\n\n```typescript\n// nuxt.config.ts：声明式配置路由级混合渲染（Hybrid Rendering）\nexport default defineNuxtConfig({\n  routeRules: {\n    '/': { prerender: true },                   // 首页构建期预渲染（SSG）\n    '/blog/**': { isr: 3600 },                  // 博客文章每小时增量静态再生（ISR）\n    '/products/**': { swr: 600 },               // 商品页开启 10 分钟 Stale-While-Revalidate 边缘缓存\n    '/admin/**': { ssr: false },                // 管理后台完全关闭 SSR，作为纯 SPA (CSR) 运行\n  }\n})\n```\n\n```vue\n<script setup lang=\"ts\">\nconst route = useRoute()\n// useFetch 在服务端直接调用内部 Nitro 接口（零真实网络往返，直接函数调用！），\n// 并将响应序列化进 payload，客户端水合时直接读取缓存不发二次请求。\nconst { data: product } = await useFetch(() => `/api/products/${route.params.id}`, {\n  pick: ['id', 'title', 'price', 'stock']\n})\n</script>\n```"
  },
  {
    "id": "nuxt-002",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "自动导入",
      "composables",
      "utils"
    ],
    "question": "Nuxt 的自动导入（auto-imports）是怎么回事？",
    "answer": "Nuxt 会在编译时扫描特定目录，**自动把导出注册为全局可用**，无需手写 import：\n\n- `composables/` 下的 `useXxx` 函数：自动导入\n- `utils/` 下的工具函数：自动导入\n- Vue 的 `ref` / `computed`、Nuxt 的 `useRoute` / `useRouter` / `useFetch` 等内置 API：自动导入\n\n```ts\n// composables/useCounter.ts\nexport const useCounter = () => {\n  const count = ref(0)\n  return { count, inc: () => count.value++ }\n}\n// 页面里直接用，无需 import\nconst { count, inc } = useCounter()\n```\n\n> 好处：代码更干净；注意 IDE 可能报\"未定义\"，装 Nuxt 官方插件即可获得类型提示。\n\n### Nuxt 3 / Nitro 服务端渲染与同构开发避坑要点\n\n| 关键机制 | 核心原理 | 生产级避坑指南 |\n| :--- | :--- | :--- |\n| **同构代码执行环境** | `<script setup>` 会在 Node/Edge 服务端与浏览器客户端各执行一次 | 严禁在 `<script setup>` 顶层直接访问 `window` / `document` / `localStorage`，浏览器专属逻辑必须放入 `onMounted` 或 `import.meta.client` 分支 |\n| **数据去重与水合负载** | `useAsyncData` / `useFetch` 基于 `key` 在 `nuxtApp.payload.data` 中序列化 | 禁止在 `setup` 中裸调 `$fetch` 拉取首屏数据（会导致服务端拉一次、客户端水合再拉一次的“双重请求”），首屏取数一律用 `useFetch`，事件交互提交才用 `$fetch` |\n| **跨请求状态隔离** | `useState(key, init)` 绑定在当前请求的 `NuxtApp` 实例上下文中 | 绝不能在模块顶层用 `export const globalRef = ref()` 保存用户状态（会导致多用户 SSR 请求互相串号），跨组件共享状态必须用 `useState()` 或 Pinia |\n\n```typescript\n// composables/useCurrentUser.ts：Nuxt 3 SSR 安全的跨组件共享状态与请求头透传\nexport const useCurrentUser = () => {\n  // 1. useState 自动按请求隔离并序列化到客户端 payload，杜绝 SSR 跨用户串号\n  const user = useState<{ id: string; name: string } | null>('current-user', () => null)\n\n  const fetchUser = async () => {\n    // 2. SSR 期间自动将浏览器发来的 cookie 转发给后端接口\n    const headers = useRequestHeaders(['cookie'])\n    const { data } = await useFetch('/api/me', {\n      headers,\n      key: 'user-profile',\n    })\n    user.value = data.value\n  }\n\n  return { user, fetchUser }\n}\n```"
  },
  {
    "id": "nuxt-003",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "文件路由",
      "页面",
      "嵌套"
    ],
    "question": "Nuxt 的文件路由是如何工作的？",
    "answer": "`pages/` 目录下的文件结构**自动映射为路由**（与 Next 类似）：\n\n```text\npages/\n  index.vue          ->  /\n  about.vue          ->  /about\n  users/[id].vue     ->  /users/:id  (动态路由)\n  users/[...slug].vue->  /users/a/b  (全捕获)\n```\n\n- 动态参数用方括号 `[id].vue`，页面里通过 `route.params.id` 获取\n- `layouts/` 提供布局，页面用 `definePageMeta({ layout: 'admin' })` 选择\n- 无 `pages/` 目录则关闭文件路由（适合纯 SPA）\n\n> Nuxt3 还支持 `pages/` 下的 `.vue` 文件直接作为路由组件，并自动套用布局。\n\n### Nuxt 3 / Nitro 服务端渲染与同构开发避坑要点\n\n| 关键机制 | 核心原理 | 生产级避坑指南 |\n| :--- | :--- | :--- |\n| **同构代码执行环境** | `<script setup>` 会在 Node/Edge 服务端与浏览器客户端各执行一次 | 严禁在 `<script setup>` 顶层直接访问 `window` / `document` / `localStorage`，浏览器专属逻辑必须放入 `onMounted` 或 `import.meta.client` 分支 |\n| **数据去重与水合负载** | `useAsyncData` / `useFetch` 基于 `key` 在 `nuxtApp.payload.data` 中序列化 | 禁止在 `setup` 中裸调 `$fetch` 拉取首屏数据（会导致服务端拉一次、客户端水合再拉一次的“双重请求”），首屏取数一律用 `useFetch`，事件交互提交才用 `$fetch` |\n| **跨请求状态隔离** | `useState(key, init)` 绑定在当前请求的 `NuxtApp` 实例上下文中 | 绝不能在模块顶层用 `export const globalRef = ref()` 保存用户状态（会导致多用户 SSR 请求互相串号），跨组件共享状态必须用 `useState()` 或 Pinia |\n\n```typescript\n// composables/useCurrentUser.ts：Nuxt 3 SSR 安全的跨组件共享状态与请求头透传\nexport const useCurrentUser = () => {\n  // 1. useState 自动按请求隔离并序列化到客户端 payload，杜绝 SSR 跨用户串号\n  const user = useState<{ id: string; name: string } | null>('current-user', () => null)\n\n  const fetchUser = async () => {\n    // 2. SSR 期间自动将浏览器发来的 cookie 转发给后端接口\n    const headers = useRequestHeaders(['cookie'])\n    const { data } = await useFetch('/api/me', {\n      headers,\n      key: 'user-profile',\n    })\n    user.value = data.value\n  }\n\n  return { user, fetchUser }\n}\n```"
  },
  {
    "id": "nuxt-004",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "server",
      "Nitro",
      "API 路由"
    ],
    "question": "Nuxt 的 server 目录（Nitro）能做什么？如何写服务端 API？",
    "answer": "`server/` 目录基于 **Nitro** 引擎，可写服务端路由、API、中间件，编译后能在 Node/Serverless/Edge 跑：\n\n```ts\n// server/api/users.get.ts\nexport default defineEventHandler(async (event) => {\n  return await db.users.findMany()   // 直接访问数据库\n})\n// 前端调用：await $fetch('/api/users')\n```\n\n**能力**：\n\n- `server/api/**`：自动暴露为 `/api/**` 接口\n- `server/routes/**`：更灵活的路由（含自定义 method/path）\n- `server/middleware/**`：请求中间件\n- `server/utils/**`：服务端复用工具\n\n> Nitro 让同一份代码部署到 Vercel/Netlify/Cloudflare/Node 等，无需改业务代码。\n\n### Nuxt 3 / Nitro 服务端渲染与同构开发避坑要点\n\n| 关键机制 | 核心原理 | 生产级避坑指南 |\n| :--- | :--- | :--- |\n| **同构代码执行环境** | `<script setup>` 会在 Node/Edge 服务端与浏览器客户端各执行一次 | 严禁在 `<script setup>` 顶层直接访问 `window` / `document` / `localStorage`，浏览器专属逻辑必须放入 `onMounted` 或 `import.meta.client` 分支 |\n| **数据去重与水合负载** | `useAsyncData` / `useFetch` 基于 `key` 在 `nuxtApp.payload.data` 中序列化 | 禁止在 `setup` 中裸调 `$fetch` 拉取首屏数据（会导致服务端拉一次、客户端水合再拉一次的“双重请求”），首屏取数一律用 `useFetch`，事件交互提交才用 `$fetch` |\n| **跨请求状态隔离** | `useState(key, init)` 绑定在当前请求的 `NuxtApp` 实例上下文中 | 绝不能在模块顶层用 `export const globalRef = ref()` 保存用户状态（会导致多用户 SSR 请求互相串号），跨组件共享状态必须用 `useState()` 或 Pinia |\n\n```typescript\n// composables/useCurrentUser.ts：Nuxt 3 SSR 安全的跨组件共享状态与请求头透传\nexport const useCurrentUser = () => {\n  // 1. useState 自动按请求隔离并序列化到客户端 payload，杜绝 SSR 跨用户串号\n  const user = useState<{ id: string; name: string } | null>('current-user', () => null)\n\n  const fetchUser = async () => {\n    // 2. SSR 期间自动将浏览器发来的 cookie 转发给后端接口\n    const headers = useRequestHeaders(['cookie'])\n    const { data } = await useFetch('/api/me', {\n      headers,\n      key: 'user-profile',\n    })\n    user.value = data.value\n  }\n\n  return { user, fetchUser }\n}\n```"
  },
  {
    "id": "nuxt-005",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "数据获取",
      "useFetch",
      "useAsyncData"
    ],
    "question": "Nuxt 的 useFetch / useAsyncData / $fetch 有什么区别？",
    "answer": "- **`useAsyncData`**：通用异步数据获取，传入一个**返回 Promise 的函数**（适合调用自己的 `$fetch` 或第三方 SDK）\n- **`useFetch`**：`useAsyncData` 的语法糖，直接传 URL，内部用 `$fetch`\n- **`$fetch`**：底层 HTTP 客户端（基于 ofetch），可在任何地方调用（包括 server 目录），但**不带响应式/生命周期管理**\n\n```ts\n// 组件内\nconst { data, pending, error, refresh } = await useFetch('/api/users')\n// 等价\nconst { data } = useAsyncData('users', () => $fetch('/api/users'))\n```\n\n**关键**：`useFetch/useAsyncData` 在服务端会**预取并随 HTML 注水**（hydration），客户端不会重复请求，避免瀑布流；`$fetch` 纯客户端请求。\n\n### Nuxt 3 / Nitro 服务端渲染与同构开发避坑要点\n\n| 关键机制 | 核心原理 | 生产级避坑指南 |\n| :--- | :--- | :--- |\n| **同构代码执行环境** | `<script setup>` 会在 Node/Edge 服务端与浏览器客户端各执行一次 | 严禁在 `<script setup>` 顶层直接访问 `window` / `document` / `localStorage`，浏览器专属逻辑必须放入 `onMounted` 或 `import.meta.client` 分支 |\n| **数据去重与水合负载** | `useAsyncData` / `useFetch` 基于 `key` 在 `nuxtApp.payload.data` 中序列化 | 禁止在 `setup` 中裸调 `$fetch` 拉取首屏数据（会导致服务端拉一次、客户端水合再拉一次的“双重请求”），首屏取数一律用 `useFetch`，事件交互提交才用 `$fetch` |\n| **跨请求状态隔离** | `useState(key, init)` 绑定在当前请求的 `NuxtApp` 实例上下文中 | 绝不能在模块顶层用 `export const globalRef = ref()` 保存用户状态（会导致多用户 SSR 请求互相串号），跨组件共享状态必须用 `useState()` 或 Pinia |\n\n```typescript\n// composables/useCurrentUser.ts：Nuxt 3 SSR 安全的跨组件共享状态与请求头透传\nexport const useCurrentUser = () => {\n  // 1. useState 自动按请求隔离并序列化到客户端 payload，杜绝 SSR 跨用户串号\n  const user = useState<{ id: string; name: string } | null>('current-user', () => null)\n\n  const fetchUser = async () => {\n    // 2. SSR 期间自动将浏览器发来的 cookie 转发给后端接口\n    const headers = useRequestHeaders(['cookie'])\n    const { data } = await useFetch('/api/me', {\n      headers,\n      key: 'user-profile',\n    })\n    user.value = data.value\n  }\n\n  return { user, fetchUser }\n}\n```"
  },
  {
    "id": "nuxt-006",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "SSR",
      "SSG",
      "nuxt.config"
    ],
    "question": "Nuxt 如何配置 SSR 与 SSG？",
    "answer": "Nuxt 默认**通用渲染（Universal，即 SSR）**，可一行切换为纯静态：\n\n```ts\n// nuxt.config.ts\nexport default defineNuxtConfig({\n  ssr: true,                 // true=SSR+注水；false=纯客户端 SPA\n  // 纯静态站点（SSG / 预渲染）：\n  // 用 `nuxt generate` 构建，或\n  routeRules: {\n    '/blog/**': { prerender: true }   // 这些路由构建时预渲染成静态\n  }\n})\n```\n\n- `ssr: true`：服务端渲染首屏 + 客户端注水（默认）\n- `ssr: false`：纯 SPA，无服务端渲染\n- `nuxi generate` / `routeRules.prerender`：构建期把页面预渲染成静态 HTML（SSG）\n\n> Nuxt 的「混合渲染」可按路由分别指定 SSR/SSG/缓存，非常灵活。\n\n### Nuxt 3 / Nitro 服务端渲染与同构开发避坑要点\n\n| 关键机制 | 核心原理 | 生产级避坑指南 |\n| :--- | :--- | :--- |\n| **同构代码执行环境** | `<script setup>` 会在 Node/Edge 服务端与浏览器客户端各执行一次 | 严禁在 `<script setup>` 顶层直接访问 `window` / `document` / `localStorage`，浏览器专属逻辑必须放入 `onMounted` 或 `import.meta.client` 分支 |\n| **数据去重与水合负载** | `useAsyncData` / `useFetch` 基于 `key` 在 `nuxtApp.payload.data` 中序列化 | 禁止在 `setup` 中裸调 `$fetch` 拉取首屏数据（会导致服务端拉一次、客户端水合再拉一次的“双重请求”），首屏取数一律用 `useFetch`，事件交互提交才用 `$fetch` |\n| **跨请求状态隔离** | `useState(key, init)` 绑定在当前请求的 `NuxtApp` 实例上下文中 | 绝不能在模块顶层用 `export const globalRef = ref()` 保存用户状态（会导致多用户 SSR 请求互相串号），跨组件共享状态必须用 `useState()` 或 Pinia |\n\n```typescript\n// composables/useCurrentUser.ts：Nuxt 3 SSR 安全的跨组件共享状态与请求头透传\nexport const useCurrentUser = () => {\n  // 1. useState 自动按请求隔离并序列化到客户端 payload，杜绝 SSR 跨用户串号\n  const user = useState<{ id: string; name: string } | null>('current-user', () => null)\n\n  const fetchUser = async () => {\n    // 2. SSR 期间自动将浏览器发来的 cookie 转发给后端接口\n    const headers = useRequestHeaders(['cookie'])\n    const { data } = await useFetch('/api/me', {\n      headers,\n      key: 'user-profile',\n    })\n    user.value = data.value\n  }\n\n  return { user, fetchUser }\n}\n```"
  },
  {
    "id": "nuxt-007",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "模块",
      "modules",
      "生态"
    ],
    "question": "Nuxt 的模块（Modules）系统是什么？有哪些常用模块？",
    "answer": "Nuxt 模块是**可插拔的功能扩展**，在构建时向项目注入插件、组件、composables、配置。\n\n```ts\n// nuxt.config.ts\nexport default defineNuxtConfig({\n  modules: [\n    '@nuxtjs/tailwindcss',   // 集成 Tailwind\n    '@nuxt/content',         // 读取 Markdown 内容\n    '@pinia/nuxt',           // 集成 Pinia\n    '@nuxtjs/i18n'           // 国际化\n  ]\n})\n```\n\n**常用**：`@nuxtjs/tailwindcss`、`@pinia/nuxt`（状态管理）、`@nuxt/content`（CMS 式内容）、`@nuxtjs/color-mode`（暗色）、`@nuxtjs/seo`。\n\n> 模块在 `nuxt.config` 的 `modules` 数组声明即可自动生效，无需手动注册插件。\n\n### Nuxt 3 / Nitro 服务端渲染与同构开发避坑要点\n\n| 关键机制 | 核心原理 | 生产级避坑指南 |\n| :--- | :--- | :--- |\n| **同构代码执行环境** | `<script setup>` 会在 Node/Edge 服务端与浏览器客户端各执行一次 | 严禁在 `<script setup>` 顶层直接访问 `window` / `document` / `localStorage`，浏览器专属逻辑必须放入 `onMounted` 或 `import.meta.client` 分支 |\n| **数据去重与水合负载** | `useAsyncData` / `useFetch` 基于 `key` 在 `nuxtApp.payload.data` 中序列化 | 禁止在 `setup` 中裸调 `$fetch` 拉取首屏数据（会导致服务端拉一次、客户端水合再拉一次的“双重请求”），首屏取数一律用 `useFetch`，事件交互提交才用 `$fetch` |\n| **跨请求状态隔离** | `useState(key, init)` 绑定在当前请求的 `NuxtApp` 实例上下文中 | 绝不能在模块顶层用 `export const globalRef = ref()` 保存用户状态（会导致多用户 SSR 请求互相串号），跨组件共享状态必须用 `useState()` 或 Pinia |\n\n```typescript\n// composables/useCurrentUser.ts：Nuxt 3 SSR 安全的跨组件共享状态与请求头透传\nexport const useCurrentUser = () => {\n  // 1. useState 自动按请求隔离并序列化到客户端 payload，杜绝 SSR 跨用户串号\n  const user = useState<{ id: string; name: string } | null>('current-user', () => null)\n\n  const fetchUser = async () => {\n    // 2. SSR 期间自动将浏览器发来的 cookie 转发给后端接口\n    const headers = useRequestHeaders(['cookie'])\n    const { data } = await useFetch('/api/me', {\n      headers,\n      key: 'user-profile',\n    })\n    user.value = data.value\n  }\n\n  return { user, fetchUser }\n}\n```"
  },
  {
    "id": "nuxt-008",
    "category": "nuxtjs",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "部署",
      "Nitro",
      "跨平台"
    ],
    "question": "Nuxt3 如何部署？Nitro 有什么优势？",
    "answer": "`nuxi build` 后，Nitro 会把服务端打包成**自包含产物**，可部署到几乎所有平台：\n\n- **Node 服务**：`node .output/server/index.mjs`\n- **Serverless**：Vercel / Netlify / AWS Lambda（自动输出对应格式）\n- **Edge**：Cloudflare Workers / Deno Deploy\n- **静态**：`nuxi generate` 产出纯静态\n\n```bash\nNITRO_PRESET=vercel nuxi build   # 指定部署目标\n```\n\n**Nitro 优势**：同一份源码 → 多平台部署（无需改业务代码）；内置缓存、路由、错误处理；冷启动快。这是 Nuxt3 相比 Nuxt2（强绑定 Node）最大的部署灵活性提升。\n\n### Nuxt 3 / Nitro 服务端渲染与同构开发避坑要点\n\n| 关键机制 | 核心原理 | 生产级避坑指南 |\n| :--- | :--- | :--- |\n| **同构代码执行环境** | `<script setup>` 会在 Node/Edge 服务端与浏览器客户端各执行一次 | 严禁在 `<script setup>` 顶层直接访问 `window` / `document` / `localStorage`，浏览器专属逻辑必须放入 `onMounted` 或 `import.meta.client` 分支 |\n| **数据去重与水合负载** | `useAsyncData` / `useFetch` 基于 `key` 在 `nuxtApp.payload.data` 中序列化 | 禁止在 `setup` 中裸调 `$fetch` 拉取首屏数据（会导致服务端拉一次、客户端水合再拉一次的“双重请求”），首屏取数一律用 `useFetch`，事件交互提交才用 `$fetch` |\n| **跨请求状态隔离** | `useState(key, init)` 绑定在当前请求的 `NuxtApp` 实例上下文中 | 绝不能在模块顶层用 `export const globalRef = ref()` 保存用户状态（会导致多用户 SSR 请求互相串号），跨组件共享状态必须用 `useState()` 或 Pinia |\n\n```typescript\n// composables/useCurrentUser.ts：Nuxt 3 SSR 安全的跨组件共享状态与请求头透传\nexport const useCurrentUser = () => {\n  // 1. useState 自动按请求隔离并序列化到客户端 payload，杜绝 SSR 跨用户串号\n  const user = useState<{ id: string; name: string } | null>('current-user', () => null)\n\n  const fetchUser = async () => {\n    // 2. SSR 期间自动将浏览器发来的 cookie 转发给后端接口\n    const headers = useRequestHeaders(['cookie'])\n    const { data } = await useFetch('/api/me', {\n      headers,\n      key: 'user-profile',\n    })\n    user.value = data.value\n  }\n\n  return { user, fetchUser }\n}\n```"
  },
  {
    "id": "nuxt-009",
    "category": "nuxtjs",
    "difficulty": "hard",
    "question": "Nuxt 3 Hybrid Rendering（routeRules 混合渲染）与 Nitro 边缘缓存（SWR / ISR）底层架构如何工作？",
    "tags": [
      "HybridRendering",
      "Nitro缓存",
      "defineCachedEventHandler",
      "SWR",
      "ISR"
    ],
    "answer": "Nuxt 3 最核心的架构竞争力在于由 **Nitro 服务端引擎**驱动的 **Hybrid Rendering（混合渲染）** 与 **内置跨平台缓存层（Storage Layer）**，允许按路由规则甚至按单个服务端接口精确控制缓存生命周期。\n\n### 一、 `routeRules` 混合渲染策略矩阵\n\n在 `nuxt.config.ts` 中配置的 `routeRules` 会在构建期被 Nitro 编译为路由匹配表（基于 `radix3` 基数树高速路由匹配）以及对应的云平台（Cloudflare Pages / Vercel / Nginx）原生配置文件：\n\n| `routeRules` 配置项 | 底层渲染与缓存行为 | 典型应用场景 |\n| :--- | :--- | :--- |\n| `{ prerender: true }` | 构建期由 Nitro 爬虫预先静态渲染为 HTML 文件（SSG） | 营销落地页、关于我们、帮助文档 |\n| `{ swr: 600 }` | 开启 **Stale-While-Revalidate**：600 秒内直接返回 Nitro 缓存 HTML；过期后先秒回旧缓存，后台异步重新渲染更新缓存 | 课程详情页、题库列表页、高频访问门户 |\n| `{ isr: 3600 }` | 对齐平台原生 **增量静态再生（CDN Edge ISR）**，缓存持久化在边缘网络 | 电商商品库、新闻资讯页 |\n| `{ ssr: false }` | 仅输出 SPA 空壳 HTML，完全交由浏览器客户端渲染（CSR） | 强交互用户仪表盘、后台管理中心 |\n\n### 二、 Nitro 服务端函数级缓存：`defineCachedEventHandler` 与 `defineCachedFunction`\n\n除了整页 HTML 缓存外，Nitro 还支持对服务端 API 或昂贵的数据库聚合函数做细粒度 SWR 缓存，并可无缝切换内存、Redis 或 Cloudflare KV 存储驱动：\n\n```typescript\n// server/api/leaderboard.get.ts：使用 defineCachedEventHandler 实现高并发接口级 SWR 缓存\nexport default defineCachedEventHandler(\n  async (event) => {\n    const query = getQuery(event)\n    // 昂贵的数据库排行榜聚合查询（仅在缓存未命中或后台静默刷新时执行）\n    const list = await queryTopUsersFromDb(String(query.category || 'all'))\n    return { updatedAt: new Date().toISOString(), list }\n  },\n  {\n    maxAge: 60 * 5,              // 5 分钟缓存有效期\n    staleMaxAge: 60 * 60 * 24,   // 允许在后台重算期间继续返回最多 24 小时内的旧数据（绝不阻塞用户请求！）\n    swr: true,                   // 开启 Stale-While-Revalidate\n    name: 'leaderboard-cache',\n    getKey: (event) => {\n      const q = getQuery(event)\n      return `cat-${q.category || 'all'}` // 自定义缓存键生成规则\n    }\n  }\n)\n```"
  },
  {
    "id": "nuxt-010",
    "category": "nuxtjs",
    "difficulty": "hard",
    "question": "Nuxt 3 服务端渲染（SSR）高并发下的跨请求状态污染（Cross-Request State Pollution）与内存泄漏如何排查？",
    "tags": [
      "SSR内存泄漏",
      "跨请求状态污染",
      "AsyncLocalStorage",
      "unctx",
      "Nuxt3排障"
    ],
    "answer": "在 Nuxt 3 生产环境中，最严重的两类线上故障是 **跨请求状态污染（用户 A 刷出了用户 B 的登录态或订单数据）** 与 **SSR 内存持续上涨直至容器 OOM 重启**。深入理解 Nuxt 3 基于 `unctx` 的上下文隔离机制与内存泄漏排查手段是高级面试必考题。\n\n### 一、 为什么在 `<script setup>` 之外或 Composable 顶层定义 `ref` 会导致跨用户串号？\n\n在 Node.js 服务端，所有 ES Module（如 `composables/useAuth.ts`）在进程启动时**只会被加载和执行一次**。如果把 `const user = ref(null)` 写在模块顶层作用域，该 `ref` 就是所有并发 HTTP 请求共享的全局单例！\n\n```typescript\n// ✗ 严重线上事故写法：模块顶层 ref 在 Node.js 进程中是全局单例，并发请求会互相覆盖！\nimport { ref } from 'vue'\nconst leakedGlobalUser = ref(null) // 危险！所有访客共用同一个引用\n\nexport function useBadAuth() {\n  return { user: leakedGlobalUser }\n}\n\n// ✔ 正确写法：使用 Nuxt 3 的 useState(key, init) 或挂在每个请求独立的 Pinia 实例上\nexport function useSafeAuth() {\n  // useState 内部通过 useNuxtApp() 将状态存储在当前请求的 nuxtApp.payload.state[key] 中，\n  // 请求结束即随请求上下文一起被 GC 回收，100% 物理隔离！\n  const user = useState<{ id: string; role: string } | null>('auth-user', () => null)\n  return { user }\n}\n```\n\n### 二、 Nuxt 3 异步上下文丢失问题（`Nuxt instance is unavailable`）与 `unctx` 原理\n\nNuxt 3 依赖 `unctx` 在同步调用栈中自动传递当前的 `nuxtApp` 实例。如果在 Composable 内部执行了原生 `await fetch()`，在 `await` 恢复执行后，JavaScript 调用栈已经脱离了之前的同步上下文，此时再调用 `useRuntimeConfig()` 或 `useRouter()` 就会抛出 `Nuxt instance is unavailable`！\n\n```typescript\n// 解决 await 之后 Nuxt 上下文丢失的黄金法则：在第一个 await 之前同步获取所有组合式上下文！\nexport async function useOrderLoader(orderId: string) {\n  // ✔ 必须在第一个 await 之前同步调用所有 use* 函数\n  const config = useRuntimeConfig()\n  const router = useRouter()\n\n  const res = await $fetch(`${config.public.apiBase}/orders/${orderId}`)\n  if (!res) {\n    // 这里复用前面已拿到的 router 引用，安全无报错\n    await router.replace('/404')\n  }\n  return res\n}\n```\n\n### 三、 SSR 内存泄漏三步定位法\n\n1. **检查服务端是否意外启动了定时器或全局事件**：在 SSR 期间执行的代码绝不能调用未清理的 `setInterval` 或向全局 `process` / 单例 `EventEmitter` 持续 `on()` 添加监听。\n2. **检查第三方客户端插件**：将非 SSR 兼容的图表/动画插件标记为 `.client.ts`（如 `plugins/echarts.client.ts`），防止其在 Node 端模拟 DOM 堆积内存。\n3. **使用 `node --inspect` + `autocannon` 压测对比 Heap Snapshot**：压测 1,000 次请求并手动触发 GC 后，在 Chrome DevTools Memory 面板按 `Retained Size` 排序查找未释放的 `VueApp` 或闭包引用。"
  }
]
