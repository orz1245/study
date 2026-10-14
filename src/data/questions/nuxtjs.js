// Nuxt.js 面试题（8 题）
export const nuxtjsQuestions = [
  {
    id: 'nuxt-001',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'easy',
    tags: ['Nuxt3', '核心特性', '约定式'],
    question: 'Nuxt3 有哪些核心特性？和 Nuxt2 的主要区别？',
    answer: `**Nuxt3 核心特性**：

- **约定式路由**：\`pages/\` 目录自动生成路由，无需手写配置
- **自动导入（auto-imports）**：\`composables/\`、\`utils/\`、Vue/API 自动可用，无需 import
- **Nitro 引擎**：统一的服务端运行时，可部署到任意平台（Node/Serverless/Edge）
- **文件路由 + 布局 + 中间件**约定
- **Vue3 + Vite**：基于 Composition API、更快的构建

**与 Nuxt2 区别**：Nuxt2 基于 Vue2 + Webpack，手动 import 多；Nuxt3 基于 Vue3 + Vite + Nitro，全面自动导入、跨平台部署、TypeScript 一等公民。`
  },
  {
    id: 'nuxt-002',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'easy',
    tags: ['自动导入', 'composables', 'utils'],
    question: 'Nuxt 的自动导入（auto-imports）是怎么回事？',
    answer: `Nuxt 会在编译时扫描特定目录，**自动把导出注册为全局可用**，无需手写 import：

- \`composables/\` 下的 \`useXxx\` 函数：自动导入
- \`utils/\` 下的工具函数：自动导入
- Vue 的 \`ref\` / \`computed\`、Nuxt 的 \`useRoute\` / \`useRouter\` / \`useFetch\` 等内置 API：自动导入

\`\`\`ts
// composables/useCounter.ts
export const useCounter = () => {
  const count = ref(0)
  return { count, inc: () => count.value++ }
}
// 页面里直接用，无需 import
const { count, inc } = useCounter()
\`\`\`

> 好处：代码更干净；注意 IDE 可能报"未定义"，装 Nuxt 官方插件即可获得类型提示。`
  },
  {
    id: 'nuxt-003',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'easy',
    tags: ['文件路由', '页面', '嵌套'],
    question: 'Nuxt 的文件路由是如何工作的？',
    answer: `\`pages/\` 目录下的文件结构**自动映射为路由**（与 Next 类似）：

\`\`\`text
pages/
  index.vue          ->  /
  about.vue          ->  /about
  users/[id].vue     ->  /users/:id  (动态路由)
  users/[...slug].vue->  /users/a/b  (全捕获)
\`\`\`

- 动态参数用方括号 \`[id].vue\`，页面里通过 \`route.params.id\` 获取
- \`layouts/\` 提供布局，页面用 \`definePageMeta({ layout: 'admin' })\` 选择
- 无 \`pages/\` 目录则关闭文件路由（适合纯 SPA）

> Nuxt3 还支持 \`pages/\` 下的 \`.vue\` 文件直接作为路由组件，并自动套用布局。`
  },
  {
    id: 'nuxt-004',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['server', 'Nitro', 'API 路由'],
    question: 'Nuxt 的 server 目录（Nitro）能做什么？如何写服务端 API？',
    answer: `\`server/\` 目录基于 **Nitro** 引擎，可写服务端路由、API、中间件，编译后能在 Node/Serverless/Edge 跑：

\`\`\`ts
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  return await db.users.findMany()   // 直接访问数据库
})
// 前端调用：await $fetch('/api/users')
\`\`\`

**能力**：

- \`server/api/**\`：自动暴露为 \`/api/**\` 接口
- \`server/routes/**\`：更灵活的路由（含自定义 method/path）
- \`server/middleware/**\`：请求中间件
- \`server/utils/**\`：服务端复用工具

> Nitro 让同一份代码部署到 Vercel/Netlify/Cloudflare/Node 等，无需改业务代码。`
  },
  {
    id: 'nuxt-005',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['数据获取', 'useFetch', 'useAsyncData'],
    question: 'Nuxt 的 useFetch / useAsyncData / $fetch 有什么区别？',
    answer: `- **\`useAsyncData\`**：通用异步数据获取，传入一个**返回 Promise 的函数**（适合调用自己的 \`$fetch\` 或第三方 SDK）
- **\`useFetch\`**：\`useAsyncData\` 的语法糖，直接传 URL，内部用 \`$fetch\`
- **\`$fetch\`**：底层 HTTP 客户端（基于 ofetch），可在任何地方调用（包括 server 目录），但**不带响应式/生命周期管理**

\`\`\`ts
// 组件内
const { data, pending, error, refresh } = await useFetch('/api/users')
// 等价
const { data } = useAsyncData('users', () => $fetch('/api/users'))
\`\`\`

**关键**：\`useFetch/useAsyncData\` 在服务端会**预取并随 HTML 注水**（hydration），客户端不会重复请求，避免瀑布流；\`$fetch\` 纯客户端请求。`
  },
  {
    id: 'nuxt-006',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['SSR', 'SSG', 'nuxt.config'],
    question: 'Nuxt 如何配置 SSR 与 SSG？',
    answer: `Nuxt 默认**通用渲染（Universal，即 SSR）**，可一行切换为纯静态：

\`\`\`ts
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,                 // true=SSR+注水；false=纯客户端 SPA
  // 纯静态站点（SSG / 预渲染）：
  // 用 \`nuxt generate\` 构建，或
  routeRules: {
    '/blog/**': { prerender: true }   // 这些路由构建时预渲染成静态
  }
})
\`\`\`

- \`ssr: true\`：服务端渲染首屏 + 客户端注水（默认）
- \`ssr: false\`：纯 SPA，无服务端渲染
- \`nuxi generate\` / \`routeRules.prerender\`：构建期把页面预渲染成静态 HTML（SSG）

> Nuxt 的「混合渲染」可按路由分别指定 SSR/SSG/缓存，非常灵活。`
  },
  {
    id: 'nuxt-007',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['模块', 'modules', '生态'],
    question: 'Nuxt 的模块（Modules）系统是什么？有哪些常用模块？',
    answer: `Nuxt 模块是**可插拔的功能扩展**，在构建时向项目注入插件、组件、composables、配置。

\`\`\`ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',   // 集成 Tailwind
    '@nuxt/content',         // 读取 Markdown 内容
    '@pinia/nuxt',           // 集成 Pinia
    '@nuxtjs/i18n'           // 国际化
  ]
})
\`\`\`

**常用**：\`@nuxtjs/tailwindcss\`、\`@pinia/nuxt\`（状态管理）、\`@nuxt/content\`（CMS 式内容）、\`@nuxtjs/color-mode\`（暗色）、\`@nuxtjs/seo\`。

> 模块在 \`nuxt.config\` 的 \`modules\` 数组声明即可自动生效，无需手动注册插件。`
  },
  {
    id: 'nuxt-008',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['部署', 'Nitro', '跨平台'],
    question: 'Nuxt3 如何部署？Nitro 有什么优势？',
    answer: `\`nuxi build\` 后，Nitro 会把服务端打包成**自包含产物**，可部署到几乎所有平台：

- **Node 服务**：\`node .output/server/index.mjs\`
- **Serverless**：Vercel / Netlify / AWS Lambda（自动输出对应格式）
- **Edge**：Cloudflare Workers / Deno Deploy
- **静态**：\`nuxi generate\` 产出纯静态

\`\`\`bash
NITRO_PRESET=vercel nuxi build   # 指定部署目标
\`\`\`

**Nitro 优势**：同一份源码 → 多平台部署（无需改业务代码）；内置缓存、路由、错误处理；冷启动快。这是 Nuxt3 相比 Nuxt2（强绑定 Node）最大的部署灵活性提升。`
  }
]
