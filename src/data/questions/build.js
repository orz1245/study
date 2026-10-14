// 工程构建与优化面试题（Webpack / Vite / 打包优化，15 题）
export const buildQuestions = [
  {
    id: 'build-001',
    category: 'build',
    module: 'build',
    difficulty: 'easy',
    tags: ['Webpack', '核心概念', 'Loader'],
    question: 'Webpack 的核心概念有哪些（entry / output / loader / plugin）？',
    answer: `- **entry**：打包入口（可单/多入口），从它开始递归构建依赖图
- **output**：产物输出路径、文件名（可带 \`[contenthash]\` 做缓存）
- **loader**：让 Webpack 能处理非 JS 资源（如 \`.css\`、\`.ts\`、图片），**作用于单个文件的转换**
- **plugin**：在生命周期钩子里做更广的事（打包优化、资源注入、压缩），**作用于整个构建过程**
- **mode**：\`development\` / \`production\` / \`none\`，预设不同优化

\`\`\`js
// webpack.config.js 片段
module.exports = {
  entry: './src/main.js',
  output: { filename: '[contenthash].js', path: __dirname + '/dist' },
  module: { rules: [{ test: /\\.css$/, use: ['style-loader', 'css-loader'] }] },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })]
}
\`\`\``
  },
  {
    id: 'build-002',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['loader', 'plugin', '区别'],
    question: 'loader 和 plugin 的区别？如何写一个自定义 loader？',
    answer: `**区别**：

- loader 是**转换器**，对匹配到的单个文件做内容转换（返回新源码字符串），链式的（从右到左执行）
- plugin 是**扩展器**，监听 Webpack 生命周期钩子做更全局的事（生成文件、注入变量、分包）

**自定义 loader**（本质是一个函数，接收源码返回转换后源码）：

\`\`\`js
// my-loader.js
module.exports = function (source) {
  // this 为 loader context，可拿到 query、emitFile 等
  return source.replace(/TODO/g, 'DONE')
}
// 使用：{ test: /\\.js$/, use: ['./my-loader.js'] }
\`\`\`

> 注意 loader 应是**纯函数**、无副作用，复杂逻辑用 \`this.async()\` 支持异步。`
  },
  {
    id: 'build-003',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Tree Shaking', 'ESM', 'sideEffects'],
    question: '什么是 Tree Shaking？为什么必须要用 ESM 才能生效？',
    answer: `Tree Shaking 是**在打包时移除未被引用的代码（dead code elimination）**，减小产物体积。

**为什么依赖 ESM**：ESM 是**静态**的（\`import/export\` 在编译期就确定依赖关系，不能动态拼接），打包器能静态分析出「哪些导出从未被 import」并剔除。而 CommonJS 的 \`require(变量)\` 是动态的，无法静态判定。

\`\`\`js
// util.js 只导出 a 和 b
export const a = 1
export const b = 2
// main.js 只用了 a
import { a } from './util'
// 打包后 b 被摇掉
\`\`\`

**生效条件**：

1. 用 ESM（\`import/export\`），不用 CJS
2. \`mode: 'production'\`（开发模式不做压缩也就不摇）
3. \`package.json\` 设 \`"sideEffects": false\`（或数组声明有副作用的文件），否则打包器为保险不敢删

> 副作用：如 \`import './polyfill'\` 只执行不导出，这类需保留，要在 sideEffects 里声明。`
  },
  {
    id: 'build-004',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Code Splitting', 'splitChunks', '分包'],
    question: '什么是 Code Splitting（代码分割）？splitChunks 怎么配？',
    answer: `代码分割把大包拆成多个小文件，**按需加载 / 并行加载 / 缓存复用**，避免首屏下载整个应用。

三种方式：

1. **入口分割**：多 \`entry\`
2. **动态 \`import()\`**：路由/组件懒加载，自动成独立 chunk
3. **splitChunks**：把公共依赖（如 react、lodash）抽成 vendor chunk

\`\`\`js
// 路由懒加载（React）
const Home = React.lazy(() => import('./Home'))

// webpack 公共提取
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: { test: /[\\\\/]node_modules[\\\\/]/, name: 'vendors' }
    }
  }
}
\`\`\`

> 经验：把稳定不变的第三方库单独成 \`vendors\` chunk，业务代码更新时它因内容哈希不变可走强缓存。`
  },
  {
    id: 'build-005',
    category: 'build',
    module: 'build',
    difficulty: 'easy',
    tags: ['HMR', '热更新', '原理'],
    question: '什么是 HMR（热模块替换）？它的原理是什么？',
    answer: `HMR 让代码改动后**只更新变化的模块，不刷新整页**，保留应用状态，极大提升开发体验。

**原理**：

1. 启动一个 **WebSocket** 连接，服务端监听文件变化
2. 文件改动 → 服务端用 webpack 重新编译出该模块的**补丁（diff）**
3. 通过 WS 把补丁 hash + 模块代码推给浏览器
4. 浏览器端的 **HMR runtime** 用新模块替换旧模块，并执行该模块的 \`module.hot.accept\` 回调做局部更新

\`\`\`js
// 模块自我接受热更新
if (module.hot) {
  module.hot.accept('./component.js', () => render())
}
\`\`\`

> 若没有 accept 回调或更新无法局部应用，HMR 会回退为整页刷新。`
  },
  {
    id: 'build-006',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Vite', '原理', 'esbuild'],
    question: 'Vite 为什么比 Webpack 快？开发模式和生产模式有什么区别？',
    answer: `**开发模式（no-bundle）**：Vite 利用浏览器原生 **ESM**，启动时不打包，按需对请求的文件用 **esbuild**（Go 写，比 JS 快 10-100x）即时转译。所以**冷启动与改动都是毫秒级**，与项目大小无关；而 Webpack 要先把整个依赖图打包完才能起服务。

**生产模式**：为兼容性与优化（如 Rollup 的成熟 Tree Shaking），Vite 仍用 **Rollup** 打包，并自动做代码分割、压缩、预构建依赖（\`optimizeDeps\` 用 esbuild 预打包 node_modules 成 ESM）。

\`\`\`text
开发：浏览器 ESM + esbuild 即时编译（快）
生产：Rollup 打包（成熟优化）
\`\`\`

> 对比 Webpack：Webpack 全程打包，项目越大越慢；Vite 解决了「启动慢/热更新慢」，但生态/插件成熟度 Webpack 仍占优。`
  },
  {
    id: 'build-007',
    category: 'build',
    module: 'build',
    difficulty: 'hard',
    tags: ['Vite vs Webpack', '对比', '选型'],
    question: 'Vite 和 Webpack 怎么选？各自适用场景？',
    answer: `| 维度 | Vite | Webpack |
| --- | --- | --- |
| 开发启动 | 极快（原生 ESM） | 慢（全量打包，项目大更明显） |
| 生态/插件 | 较新，Rollup 插件为主 | 极成熟，loader/plugin 海量 |
| 生产打包 | Rollup（Tree Shaking 好） | 自研（更可控、功能全） |
| 微前端/复杂构建 | 偏弱 | 强（Module Federation 等） |
| 学习成本 | 低 | 高 |

**选型**：

- 新项目 / SPA / 重开发体验 → **Vite**（Vue/React 默认推荐）
- 老项目、复杂定制（微前端、细粒度拆包、特殊 loader）→ **Webpack**
- 库打包 → Rollup（Vite 生产底层也是它）或 tsup/esbuild`
  },
  {
    id: 'build-008',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['缓存', 'contenthash', '长效缓存'],
    question: '如何利用文件名 hash 做长效缓存（Long-term Caching）？',
    answer: `浏览器靠文件名区分资源版本。**内容哈希**能让「内容没变的文件文件名不变 → 走强缓存；变了才更新」。

- \`[hash]\`：每次构建都变（整个构建共享），不推荐单独用
- \`[chunkhash]\`：按 chunk 变，同一 chunk 内容不变则不变
- **\`[contenthash]\`（最佳）**：按文件内容算，最精确地隔离变化

\`\`\`js
output: { filename: '[name].[contenthash:8].js' }
\`\`\`

配合：

- 把第三方库用 \`splitChunks\` 抽成 \`vendors\`，它内容基本不变 → 永远命中缓存
- 服务器对带 hash 的资源设 \`Cache-Control: max-age=31536000, immutable\`
- \`index.html\` 不哈希、不缓存，保证能拿到最新的资源引用`
  },
  {
    id: 'build-009',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Source Map', '调试', '安全'],
    question: 'Source Map 是什么？不同 devtool 配置有什么取舍？',
    answer: `Source Map 是**把压缩/转译后的代码映射回原始源码**的索引文件，让浏览器 DevTools 能显示你写的 TS/JSX 而非打包产物，便于断点调试。

\`\`\`js
devtool: 'source-map'  // 生成独立 .map，最完整但慢
devtool: 'eval-cheap-module-source-map'  // 开发推荐：快、行级、含原始列
devtool: 'hidden-source-map' // 生产：生成 map 但不引用，可上传 Sentry 但不暴露给用户
\`\`\`

**取舍**：

- 开发：要快且准 → \`eval-cheap-module-source-map\`
- 生产：一般不暴露源码，用 \`hidden-source-map\` 私下给错误监控平台（Sentry）用
- 切勿把带 \`sourceMappingURL\` 的 map 直接部署到公网（泄露源码）`
  },
  {
    id: 'build-010',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['懒加载', 'import()', '性能'],
    question: '前端路由/组件懒加载如何实现？对首屏有什么帮助？',
    answer: `用动态 \`import()\` 让非首屏代码**按需加载**：

\`\`\`js
// Vue Router 懒加载
const routes = [{ path: '/about', component: () => import('./About.vue') }]

// React.lazy + Suspense
const About = React.lazy(() => import('./About'))
\`\`\`

构建时每个 \`import()\` 会被拆成独立 chunk，访问对应路由才下载。

**首屏收益**：

- 首屏只下载当前页面所需代码，**JS 体积大幅变小**
- 主包（vendor）更小 → 解析/执行更快 → FCP/LCP 提升
- 配合 \`prefetch\`（如 Vite 的 \`<link rel="prefetch">\`）可在空闲预取下个页面

> 反例：把整个应用 import 进主包，用户首屏就要下载全部代码。`
  },
  {
    id: 'build-011',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['体积分析', '打包优化', '分析工具'],
    question: '如何分析并优化打包体积？有哪些常见手段？',
    answer: `**分析**：

- Webpack：\`webpack-bundle-analyzer\` 可视化每个模块占比
- Vite：\`rollup-plugin-visualizer\` 生成 treemap

**常见优化**：

1. **按需引入**：\`import \{ debounce \} from 'lodash-es'\` 而非整包 lodash（Tree Shaking）
2. **替换更轻量库**：dayjs 替 moment、npm 包体积扫描 \`bundlephobia\`
3. **压缩**：Terser（JS）、esbuild/CssMinimizer（CSS）、\`gzip/brotli\`
4. **externals + CDN**：把 react 等大库用 \`<script>\` 引入、配置 \`externals\` 不打包
5. **拆 vendor / 路由懒加载**（见上）
6. **图片/字体**：压缩、转 WebP、用精灵图或 base64 小图

\`\`\`js
// 把 react 排除出打包，改用全局变量（需 index.html 先引入 CDN）
externals: { react: 'React', 'react-dom': 'ReactDOM' }
\`\`\``
  },
  {
    id: 'build-012',
    category: 'build',
    module: 'build',
    difficulty: 'hard',
    tags: ['Babel', 'SWC', 'Terser', '编译'],
    question: 'Babel、SWC、Terser、esbuild 各自负责什么？为什么现在推崇 SWC/esbuild？',
    answer: `| 工具 | 语言 | 职责 |
| --- | --- | --- |
| **Babel** | JS | 语法降级（ESNext→ES5）、polyfill、JSX 转换，**插件生态极丰富** |
| **SWC** | Rust | 同 Babel 的转译能力，但快 10-100x，Next.js 默认用它 |
| **Terser** | JS | 代码压缩/混淆（生产 JS 压缩） |
| **esbuild** | Go | 转译+打包+压缩一体，极快，Vite 开发期用它 |

**为什么推崇 Rust/Go 系**：Babel 是 JS 写的，单线程、慢；SWC（Rust）/esbuild（Go）编译速度数量级提升，大型项目构建/启动从分钟级降到秒级。

> 现状：Vite 开发用 esbuild、Next.js 用 SWC 做转译；生产压缩仍常用 Terser（压缩率略好）或 esbuild 的压缩（更快）。`
  },
  {
    id: 'build-013',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['多入口', '多页应用', 'MPA'],
    question: '如何配置多入口（Multi-page / MPA）构建？',
    answer: `多页应用（如后台 + 官网共用一套工程）需要多个 HTML 入口：

\`\`\`js
// webpack
const path = require('path')
module.exports = {
  entry: {
    main: './src/main.js',
    admin: './src/admin.js'
  },
  output: { filename: '[name].[contenthash].js' },
  plugins: [
    new HtmlWebpackPlugin({ filename: 'index.html', chunks: ['main'] }),
    new HtmlWebpackPlugin({ filename: 'admin.html', chunks: ['admin'] })
  ]
}
\`\`\`

**要点**：

- 每个入口配一个 \`HtmlWebpackPlugin\` 并指定 \`chunks\`（只引入对应 JS）
- 公共依赖仍可用 \`splitChunks\` 抽成共享 chunk
- Vite 用 \`build.rollupOptions.input\` 配置多入口对象`
  },
  {
    id: 'build-014',
    category: 'build',
    module: 'build',
    difficulty: 'hard',
    tags: ['构建缓存', 'CI', '速度'],
    question: '如何在 CI / 本地加速构建？构建缓存有哪些层？',
    answer: `构建慢主要来自「重复解析/转译」。可叠加多层缓存：

1. **文件系统缓存**：Webpack5 \`cache: { type: 'filesystem' }\` 缓存模块图；Vite 用 \`node_modules/.vite\` 缓存预构建依赖
2. **依赖预构建**：Vite 的 \`optimizeDeps\` 把 CJS 包转 ESM 并缓存
3. **CI 缓存**：GitHub Actions / GitLab 缓存 \`node_modules\`、\`dist\`、\`.vite\`，避免每次重装重编译
4. **并行/分布式**：\`thread-loader\`（Webpack）、Terser 并行压缩（\`parallel: true\`）
5. **模块联邦（Module Federation）**：多应用共享构建产物，避免重复打包
6. **增量构建**：只重建变化的模块（Vite 天生增量；Webpack 用缓存近似）

> 经验：CI 里务必要缓存 \`node_modules\` 和构建缓存目录，否则每次都是全量冷构建。`
  },
  {
    id: 'build-015',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Module Federation', '微前端', '共享'],
    question: '什么是 Module Federation（模块联邦）？解决什么问题？',
    answer: `Module Federation 是 Webpack5 的特性，让**多个独立构建的应用在运行时互相加载对方导出的模块**，实现「运行时共享代码」，是微前端的主流方案之一。

\`\`\`js
// app1 (remote)
new ModuleFederationPlugin({
  name: 'app1',
  filename: 'remoteEntry.js',
  exposes: { './Button': './src/Button' }
})
// app2 (host) 远程消费
remotes: { app1: 'app1@https://app1.com/remoteEntry.js' }
import Button from 'app1/Button'  // 运行时从 app1 拉取
\`\`\`

**解决的问题**：

- 多个团队独立开发部署，却能在运行时拼装成一个产品
- **共享依赖**（如都依赖的 react）只加载一份，避免重复打包
- 独立部署：某个微应用更新不必重新构建整个巨石应用

> 注意：版本/运行时一致性需治理；Vite 生态有 \`vite-plugin-federation\` 提供类似能力。`
  }
]
