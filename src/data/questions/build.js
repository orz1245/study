export const buildQuestions = [
  {
    "id": "be-016",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Webpack",
      "构建工具",
      "打包"
    ],
    "question": "Webpack 的核心概念是什么？常用配置有哪些？",
    "answer": "### 核心概念\n\n| 概念 | 说明 |\n|------|------|\n| Entry | 入口文件 |\n| Output | 输出配置 |\n| Loader | 处理非 JS 文件（CSS、图片等）|\n| Plugin | 扩展功能（压缩、HTML 生成等）|\n| Mode | development/production |\n| Module | 一切皆模块 |\n\n### 基本配置\n\n```javascript\nconst path = require('path')\nconst HtmlWebpackPlugin = require('html-webpack-plugin')\n\nmodule.exports = {\n  mode: 'production',\n  entry: './src/index.js',\n  output: {\n    path: path.resolve(__dirname, 'dist'),\n    filename: '[name].[contenthash:8].js',\n    clean: true\n  },\n  \n  // Loader\n  module: {\n    rules: [\n      {\n        test: /.css$/,\n        use: ['style-loader', 'css-loader', 'postcss-loader']\n      },\n      {\n        test: /.js$/,\n        exclude: /node_modules/,\n        use: {\n          loader: 'babel-loader',\n          options: { presets: ['@babel/preset-env'] }\n        }\n      },\n      {\n        test: /.(png|jpg|svg)$/,\n        type: 'asset/resource'  // Webpack 5 内置\n      }\n    ]\n  },\n  \n  // Plugin\n  plugins: [\n    new HtmlWebpackPlugin({ template: './index.html' })\n  ],\n  \n  // 优化\n  optimization: {\n    splitChunks: {\n      chunks: 'all',\n      cacheGroups: {\n        vendor: {\n          test: /[\\/]node_modules[\\/]/,\n          name: 'vendors',\n          chunks: 'all'\n        }\n      }\n    }\n  },\n  \n  // 开发服务器\n  devServer: {\n    hot: true,\n    port: 3000,\n    proxy: {\n      '/api': 'http://localhost:8080'\n    }\n  }\n}\n```\n\n### Loader 执行顺序\n\n从右到左、从下到上：\n```javascript\nuse: ['style-loader', 'css-loader', 'postcss-loader']\n// 执行顺序: postcss-loader → css-loader → style-loader\n```\n\n### 常用 Plugin\n\n| Plugin | 作用 |\n|--------|------|\n| HtmlWebpackPlugin | 自动生成 HTML 并引入 JS |\n| MiniCssExtractPlugin | 提取 CSS 到单独文件 |\n| CssMinimizerPlugin | 压缩 CSS |\n| DefinePlugin | 定义环境变量 |\n| CopyWebpackPlugin | 复制静态文件 |\n| BundleAnalyzerPlugin | 分析包体积 |\n\n### Webpack 5 新特性\n\n1. **模块联邦**（Module Federation）：微前端\n2. **资源模块**：内置图片/字体处理\n3. **缓存**：持久化文件系统缓存\n4. **Node Polyfill 移除**：不再自动 polyfill\n\n### 构建优化\n\n```javascript\n// 持久化缓存\nmodule.exports = {\n  cache: {\n    type: 'filesystem'\n  }\n}\n\n// 代码分割\noptimization: {\n  splitChunks: {\n    chunks: 'all'\n  }\n}\n\n// Tree Shaking（生产模式自动）\n// 副作用标记\n// package.json: \"sideEffects\": false\n```\n\n### 与 Vite 对比\n\n| 特性 | Webpack | Vite |\n|------|---------|------|\n| 开发启动 | 慢（全量打包）| 快（ESM 原生）|\n| HMR | 快 | 极快 |\n| 构建 | Webpack 打包 | Rollup 打包 |\n| 生态 | 最丰富 | 快速增长 |\n| 配置 | 复杂 | 简单 |"
  },
  {
    "id": "be-017",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Vite",
      "构建工具",
      "ESM"
    ],
    "question": "Vite 的工作原理是什么？和 Webpack 有什么区别？",
    "answer": "### Vite 的核心优势\n\n**开发阶段**：利用浏览器原生 ESM，按需加载模块，无需打包。\n\n### 开发阶段原理\n\n```javascript\n浏览器请求 index.html\n  → Vite 拦截 <script type=\"module\" src=\"/src/main.js\">\n  → 按需编译每个模块\n  → 浏览器通过 ESM import 链按需加载\n  → 修改文件时只热更新对应模块\n```\n\n```javascript\n// Vite dev server 拦截请求\n// 请求 /src/main.js → Vite 编译 → 返回 ESM 格式\nimport { createApp } from 'vue'  // → /node_modules/.vite/vue.js\nimport App from './App.vue'      // → 编译 SFC 为 JS\n```\n\n### 依赖预构建\n\nVite 使用 esbuild 预构建依赖（CJS → ESM）：\n\n```javascript\n首次启动：\n  1. 扫描 import 语句找到依赖\n  2. esbuild 预构建（比 Webpack 快 10-100 倍）\n  3. 缓存到 node_modules/.vite\n  4. 后续请求直接用缓存\n```\n\n### 生产构建\n\n开发用 ESM，但生产环境用 Rollup 打包：\n```javascript\n// vite.config.js\nimport { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({\n  plugins: [vue()],\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: ['vue', 'vue-router'],\n          ui: ['element-plus']\n        }\n      }\n    }\n  }\n})\n```\n\n### 为什么开发用 ESM 而生产用打包？\n\n- **开发**：ESM 按需加载，启动快，HMR 精准\n- **生产**：打包减少请求数、Tree Shaking、代码压缩\n\n### HMR 原理\n\n```text\n1. 文件修改 → Vite 监听变化\n2. 找到受影响的模块\n3. 通过 WebSocket 通知浏览器\n4. 浏览器重新请求变化的模块\n5. 替换模块，保留应用状态\n```\n\n### Vite 配置\n\n```javascript\nimport { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({\n  plugins: [vue()],\n  \n  // 路径别名\n  resolve: {\n    alias: {\n      '@': '/src'\n    }\n  },\n  \n  // 开发服务器\n  server: {\n    port: 3000,\n    proxy: {\n      '/api': {\n        target: 'http://localhost:8080',\n        changeOrigin: true\n      }\n    }\n  },\n  \n  // CSS 预处理器\n  css: {\n    preprocessorOptions: {\n      scss: { additionalData: '@import \"@/styles/variables.scss\";' }\n    }\n  },\n  \n  // 环境变量\n  define: {\n    __APP_VERSION__: JSON.stringify('1.0.0')\n  }\n})\n```\n\n### Webpack vs Vite\n\n| 特性 | Webpack | Vite |\n|------|---------|------|\n| 开发启动 | 全量打包，慢 | ESM 按需，极快 |\n| 大项目启动 | 30s-2min | < 1s |\n| HMR | 全模块链 | 精准单模块 |\n| 配置 | 复杂 | 简单 |\n| 生产打包 | Webpack | Rollup |\n| 生态 | 最丰富 | 足够 |\n| 学习曲线 | 高 | 低 |\n\n### Vite 插件生态\n\n```javascript\nimport vue from '@vitejs/plugin-vue'        // Vue SFC\nimport react from '@vitejs/plugin-react'     // React Fast Refresh\nimport legacy from '@vitejs/plugin-legacy'   // 旧浏览器兼容\nimport { visualizer } from 'rollup-plugin-visualizer' // 包分析\n```\n\n### 什么时候选 Vite\n- 新项目（Vue/React/纯 TS）\n- 追求开发体验\n- 不需要兼容旧浏览器\n\n### 什么时候选 Webpack\n- 老项目迁移成本高\n- 依赖 Webpack 特有插件\n- 复杂的 Module Federation 场景"
  },
  {
    "id": "be-018",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Babel",
      "转译",
      "polyfill"
    ],
    "question": "Babel 的作用是什么？preset 和 plugin 的关系？",
    "answer": "### Babel 是什么\n\nBabel 是 JavaScript 编译器，将 ES6+ 代码转译为兼容旧浏览器的 ES5 代码。\n\n### 工作流程\n\n```text\n源代码 → Parse(解析AST) → Transform(转换AST) → Generate(生成代码)\n```\n\n### preset 和 plugin\n\n**plugin**：单个转换功能\n**preset**：一组 plugin 的集合\n\n```json\n// .babelrc / babel.config.json\n{\n  \"presets\": [\n    \"@babel/preset-env\",      // 根据 browserslist 自动选择 plugin\n    \"@babel/preset-react\",     // JSX → JS\n    \"@babel/preset-typescript\" // TS → JS\n  ],\n  \"plugins\": [\n    \"@babel/plugin-proposal-optional-chaining\", // ?.\n    [\"@babel/plugin-proposal-decorators\", { \"legacy\": true }]\n  ]\n}\n```\n\n### @babel/preset-env\n\n```json\n{\n  \"presets\": [\n    [\n      \"@babel/preset-env\",\n      {\n        \"targets\": {\n          \"chrome\": \"60\",\n          \"firefox\": \"60\",\n          \"safari\": \"11\"\n        },\n        \"useBuiltIns\": \"usage\",  // 按需 polyfill\n        \"corejs\": 3\n      }\n    ]\n  ]\n}\n```\n\n**useBuiltIns 选项：**\n- `false`：不注入 polyfill\n- `entry`：在入口文件全量引入\n- `usage`：按代码使用情况按需引入（推荐）\n\n### 转译示例\n\n```javascript\n// 源代码\nconst fn = (a = 1, ...rest) => ({ a, ...rest })\nclass Person { #name = 'Tom' }\n\n// 转译后（简化）\nvar fn = function fn() {\n  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1\n  // ...\n}\nfunction _defineProperties(target, props) { /*...*/ }\nvar Person = function Person() {\n  Object.defineProperty(this, '_name', { value: 'Tom', writable: true })\n}\n```\n\n### polyfill vs transform\n\n| 方式 | 作用 | 示例 |\n|------|------|------|\n| transform | 语法转译 | 箭头函数 → function |\n| polyfill | API 补丁 | Promise、Array.includes |\n\n```javascript\n// transform：语法转译\nconst fn = () => {}  →  var fn = function() {}\n\n// polyfill：API 补丁（需要额外引入 core-js）\nArray.prototype.includes  →  需要安装 polyfill\nPromise                   →  需要安装 polyfill\n```\n\n### Babel 配置最佳实践\n\n```javascript\n// babel.config.js\nmodule.exports = {\n  presets: [\n    ['@babel/preset-env', {\n      targets: '> 0.25%, not dead',\n      useBuiltIns: 'usage',\n      corejs: 3\n    }],\n    '@babel/preset-react',\n    '@babel/preset-typescript'\n  ],\n  plugins: [\n    // Stage 3+ 提案\n    ['@babel/plugin-proposal-decorators', { legacy: true }],\n    '@babel/plugin-proposal-class-properties'\n  ]\n}\n```\n\n### browserslist\n\n```text\n# .browserslistrc\n> 0.5%\nlast 2 versions\nnot dead\nnot ie 11\n```\n\nBabel、Autoprefixer、ESLint 等工具共用此配置。\n\n### 现代替代方案\n- **esbuild**：Go 编写，速度极快，但功能不如 Babel 全面\n- **SWC**：Rust 编写，Next.js 默认使用\n- Babel 仍然是生态最丰富的方案，但速度上不如 esbuild/SWC"
  },
  {
    "id": "be-019",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Tree Shaking",
      "摇树优化",
      "构建"
    ],
    "question": "什么是 Tree Shaking？如何确保它生效？",
    "answer": "### Tree Shaking\n\n**摇树优化**：打包时移除未使用的代码（死代码），减小包体积。\n\n```javascript\n// math.js\nexport function add(a, b) { return a + b }\nexport function subtract(a, b) { return a - b }\nexport function multiply(a, b) { return a * b }\n\n// app.js\nimport { add } from './math.js'\nconsole.log(add(1, 2))\n\n// 打包后：subtract 和 multiply 被移除\n```\n\n### 工作原理\n\n1. 依赖 **ESM 的静态结构**（import/export 在编译时确定）\n2. 打包工具分析模块依赖关系\n3. 标记未被导入的 export 为\"未使用\"\n4. 压缩阶段移除未使用的代码\n\n### 为什么 CommonJS 不能 Tree Shake\n\n```javascript\n// CommonJS — 动态加载，无法静态分析\nconst math = require('./math')\nconst fn = process.env.TEST ? math.add : math.subtract  // 运行时决定\n\n// ESM — 静态结构，编译时确定\nimport { add } from './math'  // 明确只用了 add\n```\n\n### 确保 Tree Shaking 生效\n\n**1. 使用 ESM**\n\n```javascript\n// ✅ ES Module\nimport { debounce } from 'lodash-es'\n\n// ❌ CommonJS（不触发 Tree Shaking）\nimport { debounce } from 'lodash'\n```\n\n**2. package.json 配置 sideEffects**\n\n```json\n{\n  \"name\": \"my-lib\",\n  \"sideEffects\": false  // 所有文件都没有副作用，可安全 Tree Shake\n}\n```\n\n或指定有副作用的文件：\n```json\n{\n  \"sideEffects\": [\"*.css\", \"*.scss\", \"./src/polyfills.js\"]\n}\n```\n\n**什么是副作用？**\n```javascript\n// 有副作用：修改了全局状态\nwindow.myGlobal = 'hello'\nArray.prototype.myMethod = function() {}\n\n// 无副作用：纯导入导出\nexport function add(a, b) { return a + b }\n```\n\n**3. 生产模式**\n\n```javascript\n// Webpack\nmode: 'production'  // 自动开启 Tree Shaking\n\n// Vite/Rollup\n// 生产构建自动开启\n```\n\n**4. 避免整包导入**\n\n```javascript\n// ❌ 导入整个 lodash\nimport _ from 'lodash'\n_.debounce(fn, 300)\n\n// ✅ 按需导入\nimport debounce from 'lodash/debounce'\n// 或\nimport { debounce } from 'lodash-es'  // 配合 Tree Shaking\n```\n\n### 验证 Tree Shaking\n\n```bash\n# Webpack\nnpx webpack --analyze\n\n# Vite\nvite build --mode production\n# 查看包大小变化\n```\n\n### 常见问题\n\n**1. 函数有副作用导致无法摇除**\n```javascript\n// ❌ 有副作用（访问了全局变量）\nexport function init() {\n  console.log('init')  // 副作用\n}\n\n// ✅ 纯函数\nexport function add(a, b) {\n  return a + b\n}\n```\n\n**2. 类的方法不会被摇除**\n```javascript\nexport class MyClass {\n  unusedMethod() {}  // 不会被摇除（可能有副作用）\n}\n```\n\n**3. 动态导入无法静态分析**\n```javascript\nconst lib = await import(dynamicPath)  // ❌ 无法 Tree Shake\n```\n\n### Webpack vs Vite Tree Shaking\n\n两者都支持 Tree Shaking，Vite（Rollup）在 Tree Shaking 上通常更激进。"
  },
  {
    "id": "build-001",
    "category": "build",
    "module": "build",
    "difficulty": "easy",
    "tags": [
      "Webpack",
      "核心概念",
      "Loader"
    ],
    "question": "Webpack 的核心概念有哪些（entry / output / loader / plugin）？",
    "answer": "- **entry**：打包入口（可单/多入口），从它开始递归构建依赖图\n- **output**：产物输出路径、文件名（可带 `[contenthash]` 做缓存）\n- **loader**：让 Webpack 能处理非 JS 资源（如 `.css`、`.ts`、图片），**作用于单个文件的转换**\n- **plugin**：在生命周期钩子里做更广的事（打包优化、资源注入、压缩），**作用于整个构建过程**\n- **mode**：`development` / `production` / `none`，预设不同优化\n\n```js\n// webpack.config.js 片段\nmodule.exports = {\n  entry: './src/main.js',\n  output: { filename: '[contenthash].js', path: __dirname + '/dist' },\n  module: { rules: [{ test: /\\.css$/, use: ['style-loader', 'css-loader'] }] },\n  plugins: [new HtmlWebpackPlugin({ template: './index.html' })]\n}\n```\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-002",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "loader",
      "plugin",
      "区别"
    ],
    "question": "loader 和 plugin 的区别？如何写一个自定义 loader？",
    "answer": "**区别**：\n\n- loader 是**转换器**，对匹配到的单个文件做内容转换（返回新源码字符串），链式的（从右到左执行）\n- plugin 是**扩展器**，监听 Webpack 生命周期钩子做更全局的事（生成文件、注入变量、分包）\n\n**自定义 loader**（本质是一个函数，接收源码返回转换后源码）：\n\n```js\n// my-loader.js\nmodule.exports = function (source) {\n  // this 为 loader context，可拿到 query、emitFile 等\n  return source.replace(/TODO/g, 'DONE')\n}\n// 使用：{ test: /\\.js$/, use: ['./my-loader.js'] }\n```\n\n> 注意 loader 应是**纯函数**、无副作用，复杂逻辑用 `this.async()` 支持异步。\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-003",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Tree Shaking",
      "ESM",
      "sideEffects"
    ],
    "question": "什么是 Tree Shaking？为什么必须要用 ESM 才能生效？",
    "answer": "Tree Shaking 是**在打包时移除未被引用的代码（dead code elimination）**，减小产物体积。\n\n**为什么依赖 ESM**：ESM 是**静态**的（`import/export` 在编译期就确定依赖关系，不能动态拼接），打包器能静态分析出「哪些导出从未被 import」并剔除。而 CommonJS 的 `require(变量)` 是动态的，无法静态判定。\n\n```js\n// util.js 只导出 a 和 b\nexport const a = 1\nexport const b = 2\n// main.js 只用了 a\nimport { a } from './util'\n// 打包后 b 被摇掉\n```\n\n**生效条件**：\n\n1. 用 ESM（`import/export`），不用 CJS\n2. `mode: 'production'`（开发模式不做压缩也就不摇）\n3. `package.json` 设 `\"sideEffects\": false`（或数组声明有副作用的文件），否则打包器为保险不敢删\n\n> 副作用：如 `import './polyfill'` 只执行不导出，这类需保留，要在 sideEffects 里声明。\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-004",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Code Splitting",
      "splitChunks",
      "分包"
    ],
    "question": "什么是 Code Splitting（代码分割）？splitChunks 怎么配？",
    "answer": "代码分割把大包拆成多个小文件，**按需加载 / 并行加载 / 缓存复用**，避免首屏下载整个应用。\n\n三种方式：\n\n1. **入口分割**：多 `entry`\n2. **动态 `import()`**：路由/组件懒加载，自动成独立 chunk\n3. **splitChunks**：把公共依赖（如 react、lodash）抽成 vendor chunk\n\n```js\n// 路由懒加载（React）\nconst Home = React.lazy(() => import('./Home'))\n\n// webpack 公共提取\noptimization: {\n  splitChunks: {\n    chunks: 'all',\n    cacheGroups: {\n      vendor: { test: /[\\\\/]node_modules[\\\\/]/, name: 'vendors' }\n    }\n  }\n}\n```\n\n> 经验：把稳定不变的第三方库单独成 `vendors` chunk，业务代码更新时它因内容哈希不变可走强缓存。\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-005",
    "category": "build",
    "module": "build",
    "difficulty": "easy",
    "tags": [
      "HMR",
      "热更新",
      "原理"
    ],
    "question": "什么是 HMR（热模块替换）？它的原理是什么？",
    "answer": "HMR 让代码改动后**只更新变化的模块，不刷新整页**，保留应用状态，极大提升开发体验。\n\n**原理**：\n\n1. 启动一个 **WebSocket** 连接，服务端监听文件变化\n2. 文件改动 → 服务端用 webpack 重新编译出该模块的**补丁（diff）**\n3. 通过 WS 把补丁 hash + 模块代码推给浏览器\n4. 浏览器端的 **HMR runtime** 用新模块替换旧模块，并执行该模块的 `module.hot.accept` 回调做局部更新\n\n```js\n// 模块自我接受热更新\nif (module.hot) {\n  module.hot.accept('./component.js', () => render())\n}\n```\n\n> 若没有 accept 回调或更新无法局部应用，HMR 会回退为整页刷新。\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-006",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Vite",
      "原理",
      "esbuild"
    ],
    "question": "Vite 为什么比 Webpack 快？开发模式和生产模式有什么区别？",
    "answer": "**开发模式（no-bundle）**：Vite 利用浏览器原生 **ESM**，启动时不打包，按需对请求的文件用 **esbuild**（Go 写，比 JS 快 10-100x）即时转译。所以**冷启动与改动都是毫秒级**，与项目大小无关；而 Webpack 要先把整个依赖图打包完才能起服务。\n\n**生产模式**：为兼容性与优化（如 Rollup 的成熟 Tree Shaking），Vite 仍用 **Rollup** 打包，并自动做代码分割、压缩、预构建依赖（`optimizeDeps` 用 esbuild 预打包 node_modules 成 ESM）。\n\n```text\n开发：浏览器 ESM + esbuild 即时编译（快）\n生产：Rollup 打包（成熟优化）\n```\n\n> 对比 Webpack：Webpack 全程打包，项目越大越慢；Vite 解决了「启动慢/热更新慢」，但生态/插件成熟度 Webpack 仍占优。\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-007",
    "category": "build",
    "module": "build",
    "difficulty": "hard",
    "tags": [
      "Vite vs Webpack",
      "对比",
      "选型"
    ],
    "question": "Vite 和 Webpack 怎么选？各自适用场景？",
    "answer": "Vite 与 Webpack 的核心差异源于**开发期的构建模型不同**：Webpack 采用 **Bundle-based（先全量递归打包模块图、再启动开发服务器）**，而 Vite 采用 **Native ESM-based（秒起服务器、按浏览器请求的路由模块动态按需编译）**。\n\n### 一、 Vite vs Webpack 全方位选型对比矩阵\n\n| 对比维度 | Vite（现代原生 ESM + Rollup/Rolldown） | Webpack 5（传统全功能 Bundler） |\n| :--- | :--- | :--- |\n| **开发冷启动速度** | **`O(1)` 极速（毫秒级）**：仅用 esbuild/Oxc 预构建第三方 `node_modules` 依赖，源码按需编译 | **`O(N)` 随项目规模线性变慢**：启动前必须从 entry 遍历全量模块构建 Bundle |\n| **HMR 热更新延迟** | **始终保持毫秒级**：仅使变更模块及导入链失活，不随项目总文件数退化 | 中大型项目（数千模块）HMR 重新构建 Chunk 往往需要 1～5 秒 |\n| **配置复杂度** | 开箱即用（内置 TS、CSS Modules、PostCSS、静态资源支持），配置极简 | 需组合配置 `babel-loader`、`css-loader`、`MiniCssExtractPlugin` 等大量加载器与插件 |\n| **生产环境打包** | Rollup（正全面演进至基于 Rust 的 **Rolldown**），产物体积更小、Tree Shaking 更干净 | 内置高度成熟的 `SplitChunksPlugin` 与 **Module Federation（模块联邦）** |\n| **遗留生态兼容性** | 强依赖 ESM 生态；若存量代码混杂大量非标 CommonJS / RequireContext 需额外改造 | 兼容一切历史模块化规范（CJS / AMD / UMD / `require.context`）与老旧浏览器 |\n\n### 二、 架构选型建议与 Vite 按需预构建配置示例\n\n```javascript\n// vite.config.js：针对大型项目解决原生 ESM 过多小文件瀑布流请求（Network Waterfall）的优化配置\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({\n  optimizeDeps: {\n    // 强制将深层按需导入的大型 CJS/ESM 组件库提前合并预构建为单个模块，消除首屏数百个并发请求\n    include: ['lodash-es', 'echarts', 'antd > @ant-design/icons']\n  },\n  build: {\n    target: 'es2020',\n    rollupOptions: {\n      output: {\n        // 生产环境手动拆包策略，对标 Webpack splitChunks\n        manualChunks: {\n          vendor: ['vue', 'vue-router', 'pinia'],\n          charts: ['echarts']\n        }\n      }\n    }\n  }\n})\n```\n\n- **优先选 Vite 的场景**：所有新建的 Vue 3、React、Svelte、SSR（Nuxt 3 / SvelteKit）以及追求极致研发体验的中大型现代前端项目。\n- **保留 Webpack（或平滑迁移至 Rspack）的场景**：重度依赖 Webpack 专属 Loader/Plugin 生态、重度使用 Webpack 5 Module Federation 或包含大量历史 CommonJS 遗留代码的超大型存量巨石应用。"
  },
  {
    "id": "build-008",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "缓存",
      "contenthash",
      "长效缓存"
    ],
    "question": "如何利用文件名 hash 做长效缓存（Long-term Caching）？",
    "answer": "浏览器靠文件名区分资源版本。**内容哈希**能让「内容没变的文件文件名不变 → 走强缓存；变了才更新」。\n\n- `[hash]`：每次构建都变（整个构建共享），不推荐单独用\n- `[chunkhash]`：按 chunk 变，同一 chunk 内容不变则不变\n- **`[contenthash]`（最佳）**：按文件内容算，最精确地隔离变化\n\n```js\noutput: { filename: '[name].[contenthash:8].js' }\n```\n\n配合：\n\n- 把第三方库用 `splitChunks` 抽成 `vendors`，它内容基本不变 → 永远命中缓存\n- 服务器对带 hash 的资源设 `Cache-Control: max-age=31536000, immutable`\n- `index.html` 不哈希、不缓存，保证能拿到最新的资源引用\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-009",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Source Map",
      "调试",
      "安全"
    ],
    "question": "Source Map 是什么？不同 devtool 配置有什么取舍？",
    "answer": "Source Map 是**把压缩/转译后的代码映射回原始源码**的索引文件，让浏览器 DevTools 能显示你写的 TS/JSX 而非打包产物，便于断点调试。\n\n```js\ndevtool: 'source-map'  // 生成独立 .map，最完整但慢\ndevtool: 'eval-cheap-module-source-map'  // 开发推荐：快、行级、含原始列\ndevtool: 'hidden-source-map' // 生产：生成 map 但不引用，可上传 Sentry 但不暴露给用户\n```\n\n**取舍**：\n\n- 开发：要快且准 → `eval-cheap-module-source-map`\n- 生产：一般不暴露源码，用 `hidden-source-map` 私下给错误监控平台（Sentry）用\n- 切勿把带 `sourceMappingURL` 的 map 直接部署到公网（泄露源码）\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-010",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "懒加载",
      "import()",
      "性能"
    ],
    "question": "前端路由/组件懒加载如何实现？对首屏有什么帮助？",
    "answer": "用动态 `import()` 让非首屏代码**按需加载**：\n\n```js\n// Vue Router 懒加载\nconst routes = [{ path: '/about', component: () => import('./About.vue') }]\n\n// React.lazy + Suspense\nconst About = React.lazy(() => import('./About'))\n```\n\n构建时每个 `import()` 会被拆成独立 chunk，访问对应路由才下载。\n\n**首屏收益**：\n\n- 首屏只下载当前页面所需代码，**JS 体积大幅变小**\n- 主包（vendor）更小 → 解析/执行更快 → FCP/LCP 提升\n- 配合 `prefetch`（如 Vite 的 `<link rel=\"prefetch\">`）可在空闲预取下个页面\n\n> 反例：把整个应用 import 进主包，用户首屏就要下载全部代码。\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-011",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "体积分析",
      "打包优化",
      "分析工具"
    ],
    "question": "如何分析并优化打包体积？有哪些常见手段？",
    "answer": "**分析**：\n\n- Webpack：`webpack-bundle-analyzer` 可视化每个模块占比\n- Vite：`rollup-plugin-visualizer` 生成 treemap\n\n**常见优化**：\n\n1. **按需引入**：`import { debounce } from 'lodash-es'` 而非整包 lodash（Tree Shaking）\n2. **替换更轻量库**：dayjs 替 moment、npm 包体积扫描 `bundlephobia`\n3. **压缩**：Terser（JS）、esbuild/CssMinimizer（CSS）、`gzip/brotli`\n4. **externals + CDN**：把 react 等大库用 `<script>` 引入、配置 `externals` 不打包\n5. **拆 vendor / 路由懒加载**（见上）\n6. **图片/字体**：压缩、转 WebP、用精灵图或 base64 小图\n\n```js\n// 把 react 排除出打包，改用全局变量（需 index.html 先引入 CDN）\nexternals: { react: 'React', 'react-dom': 'ReactDOM' }\n```\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-012",
    "category": "build",
    "module": "build",
    "difficulty": "hard",
    "tags": [
      "Babel",
      "SWC",
      "Terser",
      "编译"
    ],
    "question": "Babel、SWC、Terser、esbuild 各自负责什么？为什么现在推崇 SWC/esbuild？",
    "answer": "在现代前端工程化流水线中，**Babel、SWC、Terser、esbuild（以及新一代 Oxc / Rolldown）** 分别处于编译（Transpilation）、代码压缩混淆（Minification）与模块打包（Bundling）的不同环节，用 **Rust / Go 原生编译型语言替代单线程 JavaScript** 是构建工具提速 10～100 倍的核心原因。\n\n### 一、 四大工具职责与底层架构对比表\n\n| 工具名称 | 实现语言 | 核心职责定位 | 性能量级 | 典型应用场景 |\n| :--- | :--- | :--- | :--- | :--- |\n| **Babel** | JavaScript | **语法转译器（Transpiler）**：解析 AST 将 ES6+/TS/JSX 转换为向后兼容的 JS，并注入 `core-js` Polyfill | 1x（基准，单线程受制于 V8 JIT 与 GC） | 需定制复杂私有 AST 插件、或需极细粒度 `useBuiltIns: 'usage'` 兼容低版本浏览器 |\n| **SWC** | **Rust** | **极速转译器 + 压缩器（Babel + Terser 的 Rust 替代品）** | **20x ～ 70x**（零 GC + 原生多线程并行） | Next.js、Rspack、Parcel 默认编译器，以及 `@vitejs/plugin-react-swc` |\n| **Terser** | JavaScript | **JS 代码压缩与混淆器（Minifier）**：执行死代码消除（DCE）、作用域变量名缩短（Mangling）与常量折叠 | 1x（在生产构建最后一步往往耗时最长） | Webpack 5 默认生产压缩器（`TerserPlugin`） |\n| **esbuild** | **Go** | **一体化极速打包器 + 转译器 + 压缩器（Bundler & Minifier）** | **10x ～ 100x**（Go 协程高并发 + 内存紧凑 AST 共享） | Vite 开发期依赖预构建（Deps Pre-bundling）与生产环境默认 JS/CSS 压缩器 |\n\n### 二、 为什么 SWC / esbuild 能比 Babel / Terser 快几十倍？\n\n1. **AOT 原生机器码 vs JIT 解释预热与 GC 停顿**：Babel/Terser 用 JS 编写，处理十万行源码时会创建数百万个短生命周期的 AST 节点对象，频繁触发 V8 垃圾回收（Stop-The-World GC）；而 Rust（SWC）和 Go（esbuild）编译为原生机器码且内存布局连续。\n2. **真正的多核 CPU 并行（Parallelism）**：JS 主线程是单线程的，而 esbuild 和 SWC 天然利用操作系统的全部 CPU 核心并行解析、转换和生成各个文件。\n3. **减少 AST 重复序列化次数**：传统 Webpack + Babel + Terser 流水线中，代码要经历 `源码 → Babel AST → 代码字符串 → Webpack Acorn AST → 代码字符串 → Terser AST → 最终产物` 至少 **3 次完整 AST 解析与序列化**；而 esbuild 从头到尾在内存中复用同一棵紧凑 AST。\n\n```javascript\n// Webpack 5 生产构建提速实战：将慢速的 babel-loader + Terser 替换为 swc-loader + esbuild 压缩\nconst TerserPlugin = require('terser-webpack-plugin')\n\nmodule.exports = {\n  module: {\n    rules: [\n      {\n        test: /\\.[jt]sx?$/,\n        exclude: /node_modules/,\n        use: {\n          loader: 'swc-loader', // 用 Rust SWC 替代 babel-loader，转译提速 20 倍\n          options: { jsc: { parser: { syntax: 'typescript', tsx: true }, target: 'es2020' } }\n        }\n      }\n    ]\n  },\n  optimization: {\n    minimizer: [\n      new TerserPlugin({\n        minify: TerserPlugin.esbuildMinify, // 用 esbuild 替代默认 Terser 压缩，构建收尾阶段提速 10 倍\n      })\n    ]\n  }\n}\n```"
  },
  {
    "id": "build-013",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "多入口",
      "多页应用",
      "MPA"
    ],
    "question": "如何配置多入口（Multi-page / MPA）构建？",
    "answer": "多页应用（如后台 + 官网共用一套工程）需要多个 HTML 入口：\n\n```js\n// webpack\nconst path = require('path')\nmodule.exports = {\n  entry: {\n    main: './src/main.js',\n    admin: './src/admin.js'\n  },\n  output: { filename: '[name].[contenthash].js' },\n  plugins: [\n    new HtmlWebpackPlugin({ filename: 'index.html', chunks: ['main'] }),\n    new HtmlWebpackPlugin({ filename: 'admin.html', chunks: ['admin'] })\n  ]\n}\n```\n\n**要点**：\n\n- 每个入口配一个 `HtmlWebpackPlugin` 并指定 `chunks`（只引入对应 JS）\n- 公共依赖仍可用 `splitChunks` 抽成共享 chunk\n- Vite 用 `build.rollupOptions.input` 配置多入口对象\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-014",
    "category": "build",
    "module": "build",
    "difficulty": "hard",
    "tags": [
      "构建缓存",
      "CI",
      "速度"
    ],
    "question": "如何在 CI / 本地加速构建？构建缓存有哪些层？",
    "answer": "在大型前端工程中，将本地与 CI/CD 构建时间从 10 分钟压降到 1 分钟以内，核心在于构建一套涵盖**“包管理器缓存 → 编译与打包持久化缓存 → Monorepo 远程计算缓存 → 产物增量部署”**的四层缓存体系。\n\n### 一、 构建提速与四层缓存架构矩阵\n\n| 缓存层级 | 本地开发配置 | CI/CD 流水线配置 | 提速原理与关键路径 |\n| :--- | :--- | :--- | :--- |\n| **1. 依赖安装层** | `pnpm` 全局内容寻址 Store | 缓存 `~/.pnpm-store`（勿直接缓存庞大的 `node_modules`） | 基于 `pnpm-lock.yaml` 哈希命中硬链接，依赖安装从 90s 降至 **5s** |\n| **2. 打包器持久化缓存** | Webpack 5 `cache: { type: 'filesystem' }` / Vite `.vite` 预构建缓存 | 将 `node_modules/.cache/webpack` 挂载至 CI Cache | 仅重编译文件 Hash 发生变化的模块，二次构建提速 **70%～90%** |\n| **3. 转译与 Lint 层** | `swc-loader` / `esbuild` + ESLint `--cache` | 缓存 `.eslintcache` 与 `tsconfig.tsbuildinfo` | 跳过未改动文件的语法检查与 TS 增量类型检查（`incremental: true`） |\n| **4. Monorepo 任务层** | Turborepo / Nx 本地 `.turbo` 缓存 | 开启 **Remote Cache（远程构件缓存）** | 根据输入文件 Hash 直接从云端下载其他同事或上次 CI 已算好的 `dist/` |\n\n### 二、 Webpack 5 文件系统缓存与 GitHub Actions CI 缓存配置实战\n\n```javascript\n// 1. webpack.config.js：开启磁盘级持久化缓存，并将配置文件自身纳入 buildDependencies\nconst path = require('path')\n\nmodule.exports = {\n  cache: {\n    type: 'filesystem',\n    buildDependencies: {\n      // 当 webpack 配置或 package-lock 变更时，自动使旧缓存失效重建\n      config: [__filename, path.resolve(__dirname, 'package-lock.json')]\n    },\n    name: `${process.env.NODE_ENV || 'development'}-cache`\n  }\n}\n```\n\n```yaml\n# 2. .github/workflows/ci.yml：CI 环境标准 pnpm Store + Webpack/Turbo 缓存配置\nsteps:\n  - uses: actions/checkout@v4\n  - uses: pnpm/action-setup@v4\n  - uses: actions/setup-node@v4\n    with:\n      node-version: 22\n      cache: 'pnpm' # 自动按 pnpm-lock.yaml 缓存 pnpm store\n\n  - name: Restore Bundler & Turbo Cache\n    uses: actions/cache@v4\n    with:\n      path: |\n        node_modules/.cache\n        .turbo\n      key: ${{ runner.os }}-build-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ github.sha }}\n      restore-keys: |\n        ${{ runner.os }}-build-${{ hashFiles('**/pnpm-lock.yaml') }}-\n\n  - run: pnpm install --frozen-lockfile\n  - run: pnpm run build\n```"
  },
  {
    "id": "build-015",
    "category": "build",
    "module": "build",
    "difficulty": "medium",
    "tags": [
      "Module Federation",
      "微前端",
      "共享"
    ],
    "question": "什么是 Module Federation（模块联邦）？解决什么问题？",
    "answer": "Module Federation 是 Webpack5 的特性，让**多个独立构建的应用在运行时互相加载对方导出的模块**，实现「运行时共享代码」，是微前端的主流方案之一。\n\n```js\n// app1 (remote)\nnew ModuleFederationPlugin({\n  name: 'app1',\n  filename: 'remoteEntry.js',\n  exposes: { './Button': './src/Button' }\n})\n// app2 (host) 远程消费\nremotes: { app1: 'app1@https://app1.com/remoteEntry.js' }\nimport Button from 'app1/Button'  // 运行时从 app1 拉取\n```\n\n**解决的问题**：\n\n- 多个团队独立开发部署，却能在运行时拼装成一个产品\n- **共享依赖**（如都依赖的 react）只加载一份，避免重复打包\n- 独立部署：某个微应用更新不必重新构建整个巨石应用\n\n> 注意：版本/运行时一致性需治理；Vite 生态有 `vite-plugin-federation` 提供类似能力。\n\n### 构建产物分析与生产环境调优清单\n\n| 优化阶段 | 核心指标 | 关键配置与工程手段 |\n| :--- | :--- | :--- |\n| **编译转译阶段** | 冷启动与增量构建耗时 | 使用 `swc-loader` / `esbuild` 替代单线程 Babel，开启 `cache: { type: 'filesystem' }` 持久化缓存 |\n| **依赖摇树（Tree Shaking）** | 死代码剔除率 | 确保第三方库提供 ESM 产物（`module` / `exports.import`），并在 `package.json` 声明 `\"sideEffects\": [\"*.css\"]` |\n| **分包与长效缓存** | 首屏 JS 体积与缓存命中率 | 拆分为 `runtime` + `framework`（React/Vue）+ `vendor` + 按路由动态 `import()` 异步 Chunk，配合 `[contenthash:8]` |\n\n```javascript\n// 工程构建产物大小预算守卫与拆包配置示例\nexport const performanceBudgetConfig = {\n  performance: {\n    hints: 'warning',\n    maxEntrypointSize: 250 * 1024, // 首屏入口包不超过 250KB\n    maxAssetSize: 200 * 1024,      // 单个静态资源不超过 200KB\n  },\n  optimization: {\n    runtimeChunk: 'single',        // 抽离运行时清单，防止新增模块导致 vendor hash 级联失效\n    moduleIds: 'deterministic',    // 固化数字模块 ID，保证长效强缓存命中率\n  }\n}\n```"
  },
  {
    "id": "build-016",
    "category": "build",
    "difficulty": "hard",
    "question": "下一代前端构建演进：Vite 6 Environment API 与 Rolldown / Oxc 如何统一开发与生产双引擎架构？",
    "tags": [
      "Vite6",
      "Rolldown",
      "Oxc",
      "EnvironmentAPI",
      "Rust构建工具链"
    ],
    "answer": "早期 Vite（v2～v5）采用 **“开发期 esbuild（预构建与转译）+ 生产期 Rollup（打包）+ Terser/esbuild（压缩）”** 的多引擎拼装架构。随着 **Vite 6 Environment API** 与基于 Rust 的 **Rolldown + Oxc 工具链** 落地，前端构建正在迈入统一单引擎时代。\n\n### 一、 传统 Vite 双引擎架构的痛点与 Rolldown + Oxc 的破局\n\n| 架构痛点 | 早期 Vite（esbuild + Rollup 双引擎） | 新一代 Vite（Rolldown + Oxc 统一 Rust 引擎） |\n| :--- | :--- | :--- |\n| **开发与生产行为不一致** | 开发期用 esbuild 预构建，生产期用 Rollup 打包，偶发“本地 `npm run dev` 正常、上线 `npm run build` 报错或循环依赖表现不一致” | 开发期预构建与生产期打包**全部统一由 Rolldown 驱动**，消除了双引擎语义鸿沟 |\n| **多次 AST 解析与跨语言开销** | JS 插件与 Rollup/esbuild 之间频繁序列化源码字符串，重复解析 AST | Rolldown 内置 **Oxc（目前最快的 Rust 词法/语法解析器、转换器与压缩器）**，一次解析全程共享 AST，生产构建提速 **10～30 倍** |\n| **多运行时环境配置割裂** | 过去只区分 `client` 与 `ssr` 两个硬编码环境，难以在同一个 Vite 实例中同时跑浏览器客户端、Node SSR 与 Cloudflare Workers Edge | **Vite 6 Environment API** 支持在同一台 Dev Server 中声明任意多个具有独立模块图（ModuleGraph）与解析规则的自定义运行环境 |\n\n### 二、 Vite 6 Environment API 多环境配置代码示例\n\n```javascript\n// vite.config.js：使用 Vite 6 Environment API 在单次开发中同时编排浏览器客户端、Node API 与 Edge Worker\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({\n  environments: {\n    client: {\n      build: { outDir: 'dist/client' }\n    },\n    ssr: {\n      resolve: { conditions: ['node', 'import'] },\n      build: { outDir: 'dist/server', ssr: 'src/entry-server.ts' }\n    },\n    edge_worker: {\n      // 针对 Cloudflare Workers / Web 边缘运行时的独立模块图与条件导出解析\n      resolve: { conditions: ['workerd', 'worker', 'browser'], noExternal: true },\n      build: { outDir: 'dist/edge' }\n    }\n  }\n})\n```"
  }
]
