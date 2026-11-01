export const viteCourseMeta = {
  "id": "vite",
  "title": "Vite 现代前端构建工具",
  "subtitle": "开发时秒开不是魔法，而是 Vite 对构建流程的重新设计：拆解按需编译与预构建背后的思路，掌握它在新项目中的配置与扩展。",
  "level": "入门 → 进阶",
  "icon": "⚡",
  "color": "#646cff",
  "practiceCategory": "build",
  "chapters": [
    {
      "key": "intro",
      "name": "第一章 · 认识 Vite",
      "lessons": [
        "vt-l1",
        "vt-l2"
      ]
    },
    {
      "key": "config",
      "name": "第二章 · 基础配置",
      "lessons": [
        "vt-l3",
        "vt-l4"
      ]
    },
    {
      "key": "plugin",
      "name": "第三章 · 插件机制与自定义插件",
      "lessons": [
        "vt-l5",
        "vt-l6"
      ]
    },
    {
      "key": "optimize",
      "name": "第四章 · 构建优化与实战",
      "lessons": [
        "vt-l7",
        "vt-l8"
      ]
    }
  ]
}

export const viteLessons = [
  {
    "id": "vt-l1",
    "chapter": "intro",
    "title": "认识 Vite：为什么开发体验这么快",
    "minutes": 25,
    "content": "### 本节目标\n\n- 理解 Vite 的「开箱即用」与「开发快」从何而来\n- 区分 Vite 与传统打包器（如 Webpack）的启动差异\n- 能跑起一个最小的 Vite 项目\n\n传统打包器（Webpack 早期）启动时要**先把整个项目打包一遍**才能起开发服务器——项目一大，冷启动等几十秒是常态。Vite 的思路完全不同：它利用**浏览器原生 ESM**，开发时「不打包」，只按需编译浏览器真正请求到的模块。\n\n```bash\n# 运行环境：Node.js 18+；用官方脚手架 30 秒起一个项目\n# npm create vite@latest my-vite-app -- --template vanilla\n# cd my-vite-app\n# npm install\n# npm run dev        # 启动开发服务器（默认 http://localhost:5173）\n```\n\n启动后，浏览器直接请求 `/src/main.js`，Vite 才「即时」把它和依赖编译成浏览器能跑的 ESM 返回。首次请求可能稍慢（要编译），但**之后改动只重新编译那一个文件**，热更新几乎瞬时。\n\n对比一下心智模型：\n\n```text\n传统打包器：启动 = 打包整个应用（慢）→ 起服务 → 改文件 = 重新打包相关部分\nVite：启动 = 只起一个轻服务（快）→ 浏览器请求谁，才编译谁 → 改文件 = 只编译那一个\n```\n\n![Vite 架构与构建机制全景拓扑图](/diagrams/vite-build-phases.svg)\n\n所以 Vite 的「快」不是魔法，而是**把「打包」从「启动时」推迟到了「按需时」**，并依赖浏览器原生 ESM 省掉了大量兼容转换。生产构建时 Vite 仍会用 Rollup 完整打包（保证产物最优），开发时则靠 ESM 跳过这步。\n\n### 名词解释\n\n**原生 ESM（Native ES Modules）**：浏览器内置的 `import`/`export` 模块能力，无需打包就能加载模块。Vite 开发服务器正是把模块以 ESM 形式直接发给浏览器。\n\n**按需编译（On-demand Compile）**：浏览器请求哪个模块，Vite 才编译哪个，而不是一次性全量编译。这是开发快的核心。\n\n**冷启动（Cold Start）**：项目第一次启动开发服务器到可访问的耗时。Vite 因为不预打包，冷启动极快。\n\n**Rollup**：Vite 生产构建底层使用的打包器，以「产出体积小、Tree Shaking 强」著称。\n\n### 课后练习\n\n**练习 1**：Vite 开发时不打包，那第三方依赖（如 react）几十上百个文件，浏览器不会发几十个请求吗？\n\n> 答案：会，但 Vite 用「依赖预构建」把它化解了——首次启动时把 `node_modules` 里的 CJS 依赖（如 react）用 esbuild 预打包成少数几个 ESM 文件并强缓存，浏览器只需请求这几个，不会爆量。详见下一节。\n\n**练习 2**：既然开发不打包，为什么生产构建还要用 Rollup 完整打包？\n\n> 答案：开发追求「快和即时」，生产追求「小和兼容」。Rollup 能做更彻底的 Tree Shaking、代码分割、兼容降级，产出最优静态资源；这些优化在开发时做会拖慢反馈，所以只在构建时做。\n\n### Vite 与传统 Bundler 的底层架构演进与网络拓扑对比\n\n在现代前端工程体系中，理解 Vite 的速度优势不能停留在表面感官，必须从**开发服务器网络拓扑（Network Cascade Topology）**与**编译时间复杂度（Time Complexity）**进行本质拆解：\n\n| 架构维度 | 传统打包器（Webpack / Rollup 原生） | Vite 原生 ESM 开发服务器 |\n| :--- | :--- | :--- |\n| **服务器启动时间复杂度** | $O(N)$（与整个项目模块总数 $N$ 严格线性/超线性正相关） | $O(1)$（只启动一个极轻量的 HTTP Connect 中间件，与项目规模完全解耦） |\n| **依赖解析与模块图构建** | 启动前全量遍历 AST，计算深层依赖图并合并为 bundle 注入内存 | 惰性按需（Lazy Compilation）：仅当浏览器发出具体文件请求时即时单文件转译 |\n| **裸模块（Bare Imports）** | 由打包器在构建期通过 Node.js 模块解析算法内联重写为函数闭包 | 由 Vite 中间件动态重写（如将 'react' 重写为 '/@id/react'） |\n| **缓存与网络传输协议** | 内存文件系统缓存（MemoryFS），热更依赖全量/增量 diff patch | 强利用 HTTP 304 协商缓存（`ETag` / `If-None-Match`）与依赖强缓存（`Cache-Control: max-age=31536000,immutable`） |\n\n```javascript\n// 模拟 Vite 开发服务器拦截并即时重写 Bare Import 的核心中间件逻辑\nimport http from 'node:http'\n\nfunction createViteDevTransformMiddleware() {\n  return function viteMiddleware(req, res, next) {\n    if (!req.url.endsWith('.js')) return next()\n\n    // 假设从磁盘读取了源码：含有裸模块引用 import React from 'react'\n    const sourceCode = \"import React from 'react'; export const app = () => React.createElement('div', null, 'Hi');\"\n\n    // 浏览器无法直接解析 bare import 'react'，必须重写为可被 HTTP 寻址的 URL 路径\n    const transformedCode = sourceCode.replace(\n      /from\\s+['\"]([^'\"]+)['\"]/g,\n      (match, specifier) => {\n        if (!specifier.startsWith('.') && !specifier.startsWith('/')) {\n          // 将第三方裸模块重写为 Vite 预构建依赖缓存路径\n          return \"from '/@id/\" + specifier + \"'\"\n        }\n        return match\n      }\n    )\n\n    res.writeHead(200, {\n      'Content-Type': 'application/javascript; charset=utf-8',\n      'ETag': '\"vite-hash-demo-123\"',\n      'Cache-Control': 'no-cache'\n    })\n    res.end(transformedCode)\n  }\n}\n\nconsole.log('Vite 拦截转换中间件已就绪：裸模块已自动改写为浏览器合法 URL 路径')\n```\n\n## 总结\n\nVite 的快，本质是**「开发靠浏览器原生 ESM 跳过打包，生产靠 Rollup 兜底优化」**的分工。入门你只需记住：它把最重的「全量打包」从启动时挪走了，所以冷启动和改文件都飞快。下一节我们拆开看「原生 ESM + 依赖预构建」这套组合拳到底怎么运作。"
  },
  {
    "id": "vt-l2",
    "chapter": "intro",
    "title": "核心机制：原生 ESM + 依赖预构建",
    "minutes": 30,
    "content": "### 本节目标\n\n- 看清 dev 时模块是如何被浏览器直接加载的\n- 理解「依赖预构建（Pre-bundling）」为何必要、由谁做\n- 会简单配置 `optimizeDeps`\n\n跑起 `npm run dev` 后打开页面，看 Network 面板，你会发现浏览器真的在请求 `/src/main.js`、`/src/App.jsx` 这样的「源码路径」——Vite 把它们即时编译成 ESM 返回。\n\n但 `node_modules` 里的依赖通常是 **CommonJS（CJS）** 写的，浏览器不认 `require`。于是 Vite 在「首次启动」时用 **esbuild**（一个极快的 Go 写的打包器）把这些依赖**预构建**成 ESM，并缓存到 `node_modules/.vite`。这带来两个好处：\n\n1. 把「成百上千个小文件」合成「几个 ESM 文件」，避免浏览器请求爆炸；\n2. CJS → ESM 转换，让浏览器能 `import`。\n\n```js\n// vite.config.js 中可干预预构建行为\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({\n  optimizeDeps: {\n    // 强制预构建这些依赖（即使 Vite 没自动探测到）\n    include: ['some-cjs-pkg'],\n    // 跳过某些不需要预构建的依赖\n    exclude: ['already-esm-pkg'],\n  },\n})\n```\n\n```bash\n# 预构建产物被缓存；当你改了依赖或想强制重算时\n# npx vite optimize   # 手动触发一次预构建\n# 或删除 node_modules/.vite 缓存目录\n```\n\n一个直观示意：当你的代码写 `import React from 'react'`，浏览器实际拿到的是 Vite 预先打包好的 `/node_modules/.vite/deps/react.js`（ESM 版），而不是去读 `react` 源码里的几百个 CJS 文件。\n\n### 名词解释\n\n**依赖预构建（Pre-bundling）**：Vite 在启动时用 esbuild 把 `node_modules` 里的依赖（尤其 CJS）转成 ESM 并合并缓存，解决「浏览器不认 CJS + 请求过多」的问题。\n\n**esbuild**：用 Go 编写的超快 JS/TS 打包与转译工具，Vite 用它做依赖预构建和 TS/JSX 转译，速度比传统工具快一个量级。\n\n**CJS → ESM 转换**：把 `module.exports`/`require` 写法的包，改写成浏览器能 `import` 的 ESM 形式，是预构建的核心动作之一。\n\n**`optimizeDeps`**：Vite 配置项，控制哪些依赖要/不要被预构建（`include`/`exclude`），以及预构建的 esbuild 选项。\n\n### 课后练习\n\n**练习 1**：预构建缓存放在哪？改了依赖版本后要怎么让它重新生效？\n\n> 答案：缓存在 `node_modules/.vite`。改了依赖后删掉这个目录（或 `npx vite optimize` 重新预构建），Vite 下次启动会按新依赖重新生成，否则会用到旧的预构建结果。\n\n**练习 2**：为什么预构建用 esbuild 而不是 Rollup？\n\n> 答案：预构建追求「快」，esbuild 是 Go 写的、速度极快，适合「启动期一次性把 node_modules 转成 ESM」；而 Rollup 追求「产出最优」，适合生产构建。两者各司其职。\n\n### Vite 依赖预构建内部扫描器（Esbuild Scan）与缓存指纹校验\n\n很多开发者以为 Vite 预构建只是简单打包 `node_modules`，其实 Vite 在启动瞬间执行了一套高精度的静态语法扫描与**元数据指纹校验（Metadata Fingerprinting）**流水线：\n\n| 预构建阶段 | 核心任务与底层驱动 | 关键数据结构与产物 | 典型边界踩坑与对策 |\n| :--- | :--- | :--- | :--- |\n| **依赖预扫描（Scan）** | 调用 esbuild 启动多进程扫描，将 HTML、Vue SFC、TSX 统一作为 AST 入口提取 bare import | 发现所有形如 `import React from 'react'` 的三方包，生成扁平 entry 列表 | 动态拼接 import（如 `import('pkg/' + name)`）无法静态识别；必须配置 `optimizeDeps.include` |\n| **多包打包（Bundle）** | 用 esbuild 将 CJS 依赖转换为 ESM 规范产物，多小模块按需聚合为一个或多个 bundle | 输出至 `node_modules/.vite/deps/`，如 `react.js` 与 `react-dom.js` | 某些 CJS 库存在动态 `module.exports = ...` 导出未被识别为命名导出；需配置 `esbuildOptions` |\n| **缓存元数据记录** | 综合 lockfile、`vite.config` 及插件配置生成 SHA-256 哈希指纹 | 写入 `_metadata.json`，内含 `browserHash`、`hash` 与各个包的 chunk 映射 | 升级了 npm 包版本但 lockfile 没改导致缓存未自动刷新；需启动时加 `--force` 重新计算 |\n| **运行时动态补打（Re-bundle）** | 运行过程中若遇到懒加载路由引用的未登记新依赖，触发即时补打 | 动态向浏览器派发全页重载（Full Reload）并更新 `_metadata.json` | 页面由于突然动态补打导致正在填写的表单状态丢失；生产前建议完善 include 清单 |\n\n```javascript\n// 深度剖析：模拟 Vite _metadata.json 缓存指纹与动态 Hash 校验逻辑\nimport crypto from 'node:crypto'\nimport fs from 'node:fs'\n\nfunction computeViteDepHash(rootConfig, lockfilePath) {\n  const hash = crypto.createHash('sha256')\n  \n  // 1. 注入锁文件指纹（pnpm-lock.yaml / package-lock.json）\n  if (fs.existsSync(lockfilePath)) {\n    hash.update(fs.readFileSync(lockfilePath))\n  }\n  \n  // 2. 注入 vite.config 中可能影响依赖解析的配置项\n  const relevantConfig = {\n    resolve: rootConfig.resolve || {},\n    optimizeDeps: rootConfig.optimizeDeps || {},\n    mode: rootConfig.mode || 'development'\n  }\n  hash.update(JSON.stringify(relevantConfig))\n  \n  const depHash = hash.digest('hex').slice(0, 8)\n  \n  // 3. 生成 _metadata.json 结构\n  const metadata = {\n    hash: depHash,\n    browserHash: depHash,\n    optimized: {\n      'react': { src: '../../node_modules/react/index.js', file: 'react.js' },\n      'lodash-es': { src: '../../node_modules/lodash-es/lodash.js', file: 'lodash-es.js' }\n    }\n  }\n  \n  return metadata\n}\n\nconsole.log('Vite 预构建指纹比对机制已就绪：当 lockfile 或 optimizeDeps 变动时自动触发增量编译')\n```\n\n### 总结\n\nVite 的「快」由两个齿轮咬合：**原生 ESM 让开发时免打包，依赖预构建（esbuild）把 CJS 依赖变 ESM 并合并缓存**。理解这一点，你就不会被「为什么有的包要配 optimizeDeps.include」这类问题难住——本质就是「确保该预构建的被正确预构建」。下一节我们写第一份 `vite.config.js`，把入口、别名、静态资源配明白。"
  },
  {
    "id": "vt-l3",
    "chapter": "config",
    "title": "基础配置：vite.config、入口、别名、静态资源",
    "minutes": 30,
    "content": "### 本节目标\n\n- 写第一份 `vite.config.js`\n- 配置 `resolve.alias` 路径别名\n- 理解 `public` 目录与「import 资源」两种静态资源管理方式\n\nVite 大多「零配置」就能跑，但真实项目一定需要一份 `vite.config.js`。它用 `defineConfig` 包裹以获得类型提示：\n\n```js\n// vite.config.js\nimport { defineConfig } from 'vite'\nimport { fileURLToPath, URL } from 'node:url'\n\nexport default defineConfig({\n  // 项目根目录（默认当前目录）\n  root: '.',\n  // 部署时的基础路径：部署到子目录 /my-app/ 时设 '/my-app/'\n  base: '/',\n  resolve: {\n    // 路径别名：之后可 import '@/utils' 而非 '../../utils'\n    alias: {\n      '@': fileURLToPath(new URL('./src', import.meta.url)),\n    },\n  },\n  // 不需要构建、直接原样拷贝到 dist 根的文件（如 favicon、robots.txt）\n  publicDir: 'public',\n})\n```\n\n**静态资源**有两条路：\n\n```js\n// 方式一：import 资源（会被 Vite 处理、加 hash、返回最终 URL）\nimport logoUrl from './logo.png'\ndocument.querySelector('#app').innerHTML = `<img src=\"${logoUrl}\">`\n\n// 方式二：放 public/ 目录，用绝对路径引用，构建时原样拷贝\n// public/logo.png → 构建后位于 dist/logo.png，引用写 '/logo.png'\n```\n\n```bash\n# 开发：npm run dev（vite）\n# 生产构建：把产物输出到 dist/\n# npm run build     # 等价于 npx vite build\n# npm run preview   # 本地预览构建产物\n```\n\n`import` 方式适合「会被打包优化」的资源（图片、字体），`public` 适合「必须保持原文件名/路径」的文件（robots.txt、根 favicon）。\n\n### 名词解释\n\n**`defineConfig`**：Vite 提供的配置包裹函数，仅用于「获得 TS 类型提示」，运行时不改变行为，是写配置的标准入口。\n\n**`resolve.alias`**：路径别名，把 `@` 映射到 `src` 等目录，避免深层 `../../` 相对路径，重构时尤其省心。\n\n**`base`**：部署基础路径。若站点挂在 `https://x.com/my-app/`，`base` 必须设 `/my-app/`，否则资源路径会 404。\n\n**`publicDir`**：存放「无需处理、原样拷贝」的静态文件目录，默认 `public`。\n\n### 课后练习\n\n**练习 1**：`import logo from './logo.png'` 得到的 `logo` 是什么类型的值？\n\n> 答案：是一个字符串 URL（开发时是 `/src/logo.png` 之类的路径，构建后变成带 hash 的 `/assets/logo-xxxx.png`）。你可以直接把它当 `src` 用。\n\n**练习 2**：什么时候该用 `public/` 而不是 `import`？\n\n> 答案：当文件「必须保持原文件名和路径、不能被加 hash 或处理」时，比如 `robots.txt`、`manifest.json`、根目录 `favicon.ico`、需要按固定 URL 访问的资源。其余图片/字体优先用 `import`。\n\n### 总结\n\n`vite.config.js` 的核心配置就三样：**`resolve.alias` 解决路径、静态资源「import vs public」二选一、`base` 决定部署位置**。它比 Webpack 配置轻得多——这正是 Vite「约定优于配置」的体现。下一节我们处理「CSS / 图片 / TypeScript / JSX」，看 Vite 开箱即用的能力到底多强。"
  },
  {
    "id": "vt-l4",
    "chapter": "config",
    "title": "处理 CSS / 图片 / TypeScript / JSX",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用 Vite 原生能力处理样式与 TS，无需额外 loader\n- 理解 CSS 预处理（SCSS）与 CSS Modules\n- 知道图片 import 返回的是 URL\n\nWebpack 要配一堆 loader，Vite 则「默认就懂」大部分事情：\n\n```js\n// src/main.js\nimport './style.css'          // ✅ 原生支持，Vite 自动注入\nimport { greet } from './util' // ✅ .ts 也能直接被 esbuild 转译\n\nconsole.log(greet('Vite'))\n```\n\n```ts\n// src/util.ts\nexport function greet(name: string): string {\n  return 'Hello, ' + name\n}\n```\n\nCSS 更进一步——**CSS Modules** 用 `.module.css` 文件名约定自动开启局部作用域：\n\n```css\n/* src/button.module.css */\n.btn { color: #3178c6; padding: 8px 16px; }\n```\n\n```js\nimport styles from './button.module.css'\n// styles.btn 是一个唯一的哈希类名，避免全局污染\ndocument.querySelector('#app').innerHTML = `<button class=\"${styles.btn}\">点我</button>`\n```\n\n需要 **SCSS** 只要装一个包：\n\n```bash\n# npm i -D sass\n```\n\n```css\n/* src/style.scss —— Vite 检测到 sass 会自动处理 */\n$primary: #3178c6;\nbody { color: $primary; }\n```\n\n```js\nimport './style.scss' // 直接 import 即可\n```\n\n图片/字体 import 返回 URL（见上节），HMR 对 CSS 是**即时无刷新更新**——改样式页面秒变，不用整页重载。JSX/TSX 也靠 esbuild 即时转译（配合框架插件，下节讲）。\n\n### 名词解释\n\n**CSS Modules**：一种「局部作用域 CSS」方案，类名被编译成唯一哈希，杜绝全局样式冲突。Vite 用 `*.module.css` 文件名约定自动开启。\n\n**SCSS（Sass）**：CSS 的超集，支持变量、嵌套、mixin。Vite 检测到安装了 `sass` 就会自动编译 `.scss`/`.sass`。\n\n**esbuild 转译**：Vite 用 esbuild 在「毫秒级」把 TS/TSX/JSX 转成 JS，无需像 babel 那样配一堆 preset。\n\n**HMR（热更新）**：Vite 对 CSS 的 HMR 是「无刷新替换样式」，比 Webpack 的 style-loader 注入更丝滑。\n\n### 课后练习\n\n**练习 1**：为什么 Vite 处理 TS 不用像 Webpack 那样配 `ts-loader`？\n\n> 答案：Vite 内置 esbuild，启动时就接管了 TS/JSX 的转译，开箱即用；Webpack 本身不懂 TS，必须靠 loader 扩展。Vite 的代价是 esbuild 不做「类型检查」（只转译），类型错误要靠 `tsc --noEmit` 单独跑。\n\n**练习 2**：CSS Modules 的 `styles.btn` 在运行时是什么？\n\n> 答案：一个字符串，是编译后的唯一类名（如 `_btn_abc12`）。把它作为 `class` 用，就能命中 CSS Modules 生成的局部样式，且不会和别处的 `.btn` 冲突。\n\n### 总结\n\nVite 的「开箱即用」在资源处理上体现得最彻底：**CSS 原生支持、TS/JSX 由 esbuild 即时转译、SCSS 装个包即可、图片 import 即 URL、CSS Modules 用文件名约定开启**。你几乎不写构建配置就能覆盖 90% 的前端日常。唯一要记住的坑：esbuild 只转译不做类型检查，类型安全还得靠 `tsc`。下一节进插件机制——Vite 插件 = 兼容 Rollup 插件 + 几个 Vite 专属钩子。"
  },
  {
    "id": "vt-l5",
    "chapter": "plugin",
    "title": "插件机制：Rollup 插件接口 + Vite 专属钩子",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解「Vite 插件本质是一个对象（兼容 Rollup 插件）」\n- 掌握 Vite 在 serve 与 build 双阶段的钩子完整生命周期与执行时机\n- 深度剖析 Vite 专属钩子（`configureServer`、`transformIndexHtml`、`handleHotUpdate`）\n- 掌握 Vite HMR 协议状态机与模块依赖图（ModuleGraph）热更新冒泡机制\n\nVite 的插件系统**直接复用并扩展了 Rollup 的插件接口**——一个插件就是「一个带 `name` 和若干钩子方法的对象」。这使得开发者能够编写一套插件，同时在「开发模式（Connect 中间件 + 原生 ESM）」和「生产构建（Rollup 多 Bundle 优化）」中无缝工作。\n\n```js\n// 一个最小 Vite 插件骨架\nexport default function myPlugin() {\n  return {\n    name: 'my-plugin',        // 插件名（必填，Rollup 要求唯一）\n    // —— Rollup 通用钩子 ——\n    transform(code, id) {\n      // code: 文件源码；id: 文件绝对路径\n      // 返回修改后的代码（或不返回表示不动）\n      if (id.endsWith('.txt')) {\n        return `export default ${JSON.stringify(code)}`\n      }\n    },\n    // —— Vite 专属钩子（serve 阶段）——\n    configureServer(server) {\n      // 在开发服务器上加自定义中间件\n      server.middlewares.use((req, res, next) => {\n        if (req.url === '/ping') { res.end('pong'); return }\n        next()\n      })\n    },\n    // —— Vite 专属钩子：改 index.html ——\n    transformIndexHtml(html) {\n      return html.replace('<title>', '<title>[DEV] ')\n    },\n  }\n}\n```\n\n### Vite 插件生命周期与专属钩子全景矩阵\n\nVite 插件不仅继承了 Rollup 的构建钩子，还针对开发服务器引入了高阶生命周期：\n\n| 钩子名称 | 归属类型 | 执行时机与阶段 | 典型应用场景与核心能力 |\n| :--- | :--- | :--- | :--- |\n| **`config`** | Vite 专属 | 解析 Vite 配置前触发（serve + build） | 动态读取或合并用户 `vite.config.js`，返回修改后的配置对象 |\n| **`configResolved`** | Vite 专属 | 解析 Vite 配置完成之后触发（只读） | 获取解析后的最终只读配置（如解析别名、环境变量、插件顺序） |\n| **`configureServer`** | Vite 专属 | 创建 Vite Dev Server 中间件管线时（仅 serve） | 注入自定义 Connect 中间件（如 Mock API、静态资源重写、自定义 HTTP 路由） |\n| **`configurePreviewServer`** | Vite 专属 | 创建预览服务器时（仅 preview） | 注入 preview 阶段专用的鉴权或响应头中间件 |\n| **`transformIndexHtml`** | Vite 专属 | 处理 `index.html` 入口文件时 | 动态向 HTML `<head>` 或 `<body>` 注入 script/link 标签或替换模板变量 |\n| **`handleHotUpdate`** | Vite 专属 | 文件保存触发 HMR 时（仅 serve） | 拦截文件变动，自定义模块失效策略，或通过 WebSocket 发送自定义热更消息 |\n| **`resolveId` / `load`** | Rollup 通用 | 模块解析与加载源码时 | 拦截文件路径实现「虚拟模块（Virtual Modules）」或重定向第三方依赖 |\n| **`transform`** | Rollup 通用 | 模块源码转译前执行 | 单文件 AST 改写、代码宏注入、CSS 预编译、JSX/TS 语法转译 |\n\n### Vite HMR 底层协议状态机与边界冒泡判定算法\n\n很多开发者知道 HMR 是热更新，但并不清楚当在编辑器中保存一个模块时，Vite 的 Dev Server 和浏览器端究竟发生了什么：\n\n1. **文件变更监听与 ModuleNode 失效**：Dev Server 内置 `chokidar` 监听到文件变动，通过 `server.moduleGraph.getModulesByFile(file)` 检索出受影响的 `ModuleNode` 实例，将对应节点的 `transformResult` 标记为失效（Dirty）。\n2. **执行插件 `handleHotUpdate` 过滤**：如果插件定义了 `handleHotUpdate`，Vite 会将变动文件、失效模块列表以及只读的源码上下文传递给插件。插件可以剔除不需更新的模块，或者针对非 JS 资源（如 markdown、JSON）通过 `server.ws.send({ type: 'custom', ... })` 发送自定义消息并直接返回空数组阻止默认冒泡。\n3. **HMR 依赖图反向传播（Bubble-up）算法**：\n   - 从变动节点开始，检查其自身是否包含自接受（Self-accepting）声明 `import.meta.hot.accept()`。\n   - 若未自接受，则沿依赖图反向遍历其所有父引用模块（`importers`），询问父模块是否接受了子模块变更（`import.meta.hot.accept(['./child.js'], cb)`）。\n   - 若某条引用链路一路追溯至根节点（入口 `main.js`）仍没有任何模块声明 accept，则判定当前更新为**不可热更边界（Unaccepted Boundary）**，立即退化为全页重载：向浏览器派发 `{ type: 'full-reload' }`。\n   - 若所有路径均被各级 accept 捕获，则聚合出最小更新边界，向浏览器派发 `{ type: 'update', updates: [{ type: 'js-update', path: '/src/foo.js', acceptedPath: '/src/foo.js', timestamp: 1700000000 }] }`。\n\n```javascript\n// 生产级实战：编写一个结合 handleHotUpdate 与客户端热更新状态保留的完整插件\n\n// 1. 服务端插件定义 (vite-custom-hmr-plugin.js)\nexport function customHmrPlugin() {\n  return {\n    name: 'custom-hmr-plugin',\n    configureServer(server) {\n      // 监听客户端回传消息\n      server.ws.on('my-plugin:ping', (data, client) => {\n        console.log('[DevServer] 收到客户端心跳:', data)\n        client.send('my-plugin:pong', { ack: Date.now() })\n      })\n    },\n    handleHotUpdate({ file, server, modules }) {\n      if (file.endsWith('.config.json')) {\n        console.log('[HMR] 配置文件变动，向客户端发送自定义热更指令')\n        server.ws.send({\n          type: 'custom',\n          event: 'config-update',\n          data: { filename: file, updatedTime: Date.now() }\n        })\n        // 返回空数组表示拦截默认的 JS 重新加载\n        return []\n      }\n      // 其它文件按默认冒泡算法传播\n      return modules\n    }\n  }\n}\n\n// 2. 客户端业务代码中的 HMR 状态持久化与清理 (src/counter.js)\nlet count = 0\nlet timer = null\n\n// 利用 import.meta.hot.data 在模块多次热替换之间传递持久化内存状态\nif (import.meta.hot) {\n  if (import.meta.hot.data.prevCount !== undefined) {\n    count = import.meta.hot.data.prevCount\n    console.log('[HMR] 恢复先前的计数状态:', count)\n  }\n}\n\nexport function startCounter() {\n  timer = setInterval(() => {\n    count++\n    console.log('当前计数值:', count)\n  }, 1000)\n}\n\n// 声明自接受 (Self-accepting)\nif (import.meta.hot) {\n  // 注册清理回调：新模块加载前执行，用于注销旧事件监听、清除旧定时器，防止内存泄漏\n  import.meta.hot.dispose((data) => {\n    clearInterval(timer)\n    data.prevCount = count // 传递给新模块\n    console.log('[HMR] 旧模块卸载：清理定时器并暂存数据')\n  })\n\n  // 接受自身更新，避免页面整页刷新\n  import.meta.hot.accept((newModule) => {\n    if (newModule) {\n      console.log('[HMR] 模块已原地热替换完成')\n      newModule.startCounter()\n    }\n  })\n}\n```\n\n### 名词解释\n\n**Rollup 插件接口**：Vite 插件遵循 Rollup 的插件规范（一个含 `name` + 钩子的对象）。这意味着大量 Rollup 生态插件可直接用于 Vite。\n\n**`handleHotUpdate`**：Vite 专属插件钩子，在开发期文件变更时触发，接收 `{ file, timestamp, modules, read, server }`，可拦截、重排或自定义 HMR 更新流。\n\n**`import.meta.hot`**：Vite 在开发环境为 ESM 模块注入的客户端 HMR API 对象（生产环境构建时会被 Rollup Tree-Shaking 自动抹除为 `undefined`）。\n\n**自接受模块（Self-accepting Module）**：自身调用了 `import.meta.hot.accept()` 的模块，当自身代码改动时不需要父级刷新即可自我更新。\n\n### 课后练习\n\n**练习 1**：为什么在生产构建 `npm run build` 产物中，你看不到 `import.meta.hot` 相关的代码？\n\n> 答案：因为生产构建走的是 Rollup 优化管线，Vite 在构建期通过 `define` 宏或静态替换将 `import.meta.hot` 替换为 `false` 或 `undefined`。后续经过 Rollup 的 DCE（Dead Code Elimination / Tree-Shaking），包含 `if (import.meta.hot) { ... }` 的分支会被作为死代码彻底剪除，零污染生产运行时体积。\n\n**练习 2**：如果一个模块被修改，且该模块既没有写 `import.meta.hot.accept()`，其所有引用者也没有 accept 它，Vite 客户端会有什么表现？\n\n> 答案：Vite Dev Server 的 HMR 冒泡判定算法会沿着 `importers` 向上回溯；当冒泡到达最顶层的 HTML 入口依然找不到任何模块接受该更新时，服务端判定热更无法局部收敛，将向客户端发送 `{ type: 'full-reload' }` 指令，触发浏览器全页强制重载，导致临时 UI 状态丢失。\n\n### 总结\n\nVite 插件的灵魂是**「一个对象 = Rollup 插件 + Vite 专属钩子」**：`config` / `configureServer` / `transformIndexHtml` 接管开发服务器与配置，`handleHotUpdate` 接管 HMR 通信流水线，而 `resolveId` / `load` / `transform` 在开发与生产中保持一致的语义。下一节我们亲手写一个：虚拟模块 + 注入环境变量。"
  },
  {
    "id": "vt-l6",
    "chapter": "plugin",
    "title": "写自己的 Vite 插件：虚拟模块与环境变量注入",
    "minutes": 35,
    "content": "### 本节目标\n\n- 用 `resolveId` + `load` 实现一个「虚拟模块」\n- 在 `transform` 里注入自定义 `import.meta.env` 变量\n- 写出一个可运行的完整插件\n\n**虚拟模块**是 Vite 插件的经典玩法：它不像普通文件那样存在于磁盘，而是「凭空」提供一个可被 `import` 的模块。常用于「把构建时信息（版本号、git hash）暴露给前端代码」。\n\n```js\n// version-plugin.js\nexport default function versionPlugin(options = {}) {\n  const virtualId = 'virtual:app-version'\n  const resolvedId = '\\0' + virtualId // 加 \\0 前缀避免和真实文件冲突\n\n  return {\n    name: 'app-version-plugin',\n    // ① 解析阶段：把 import 'virtual:app-version' 认领下来\n    resolveId(id) {\n      if (id === virtualId) return resolvedId\n    },\n    // ② 加载阶段：为该虚拟 id 返回「代码字符串」作为模块内容\n    load(id) {\n      if (id === resolvedId) {\n        return `export const version = ${JSON.stringify(options.version || '0.0.0')}\nexport const builtAt = ${JSON.stringify(new Date().toISOString())}`\n      }\n    },\n    // ③ 注入自定义环境变量：把 import.meta.env.VITE_BUILD_TIME 填进代码\n    transform(code, id) {\n      if (id.endsWith('.js') || id.endsWith('.ts')) {\n        return code.replace(\n          /import\\.meta\\.env\\.VITE_BUILD_TIME/g,\n          JSON.stringify(options.builtAt || new Date().toISOString())\n        )\n      }\n    },\n  }\n}\n```\n\n用法：\n\n```js\n// vite.config.js\nimport { defineConfig } from 'vite'\nimport versionPlugin from './version-plugin.js'\n\nexport default defineConfig({\n  plugins: [\n    versionPlugin({ version: '1.3.0' }),\n  ],\n})\n```\n\n```js\n// src/main.js —— 像普通模块一样 import 虚拟模块\nimport { version, builtAt } from 'virtual:app-version'\nconsole.log('当前版本:', version, '构建于:', builtAt)\n\n// 这段代码里的 import.meta.env.VITE_BUILD_TIME 会被插件替换成真实时间字符串\nconst t = import.meta.env.VITE_BUILD_TIME\n```\n\n跑 `npm run dev`，控制台会打出 `当前版本: 1.3.0` 和真实构建时间。**核心套路**：`resolveId` 把虚拟 id 认领 → `load` 返回它的「源码字符串」→ 浏览器 import 时拿到这份内容。而 `transform` 钩子则演示了「编译期替换代码中的标记」这一通用能力（注入 env、注入常量都靠它）。\n\n### 名词解释\n\n**虚拟模块（Virtual Module）**：不对应磁盘文件、由插件「凭空生成」的模块，可被正常 `import`。常用于把构建时信息（版本、git hash）注入前端。\n\n**`resolveId` / `load`**：Rollup 钩子对。`resolveId` 决定「这个 import 指到哪个内部 id」，`load` 决定「这个 id 的内容是什么」；配合实现虚拟模块。\n\n**`\\0` 前缀**：Vite/Rollup 约定用 `\\0` 标记「内部虚拟模块 id」，防止它和真实文件路径冲突。\n\n**`import.meta.env`**：Vite 注入的「环境变量对象」，`import.meta.env.VITE_XXX` 对应 `VITE_XXX` 环境变量，是前后端共享配置的标准通道。\n\n### 课后练习\n\n**练习 1**：虚拟模块为什么要在 id 前加 `\\0`？\n\n> 答案：`\\0` 是 Rollup/Vite 约定的「内部模块」标记，普通文件路径不会以它开头，加前缀能确保虚拟 id 不会误匹配到磁盘上的真实文件，也不会被当作普通文件去读。\n\n**练习 2**：`transform` 里用 `code.replace(...)` 注入常量，有什么风险？\n\n> 答案：简单字符串替换可能误伤——比如字符串字面量里恰好出现同样的子串也会被替换。生产级插件应先判断「这是不是目标标识符的引用」再替换（或用更精确的 AST 改写）。本课示例为讲清原理用 replace，实战要更严谨。\n\n### 总结\n\n你写出了第一个「生产可用」的 Vite 插件：**`resolveId`+`load` 造虚拟模块，`transform` 注入构建期变量**。这俩模式覆盖了大部分 Vite 插件需求——「凭空造模块」和「改写代码」。我的建议：写插件先想清「是改已有文件（transform）还是造新模块（resolveId/load）」，再选钩子，思路立刻清晰。下一节进入优化：依赖预构建调优、代码分割与生产构建。"
  },
  {
    "id": "vt-l7",
    "chapter": "optimize",
    "title": "构建优化：依赖预构建调优、代码分割、生产构建",
    "minutes": 30,
    "content": "### 本节目标\n\n- 调优 `optimizeDeps`（include/exclude）\n- 用 `build.rollupOptions` 做代码分割（manualChunks）\n- 理解 lib 模式与压缩/minify 选项\n\n**依赖预构建调优**：默认 Vite 会自动探测并预构建依赖，但有些包需要你显式声明：\n\n```js\n// vite.config.js\nexport default defineConfig({\n  optimizeDeps: {\n    include: ['lodash-es', 'axios'], // 明确要预构建的\n    exclude: ['@scope/already-esm'], // 已是 ESM、无需预构建的\n  },\n})\n```\n\n**代码分割**：生产构建用 Rollup 的 `manualChunks` 把第三方库拆成独立 vendor chunk，提升缓存：\n\n```js\nexport default defineConfig({\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: ['react', 'react-dom'], // 这些包打进 vendor.js\n        },\n      },\n    },\n    // 压缩器：'esbuild'（默认，快）或 'terser'（更彻底）\n    minify: 'esbuild',\n    target: 'es2020', // 输出语法的目标浏览器\n  },\n})\n```\n\n```bash\n# 生产构建；产物在 dist/\n# npm run build\n```\n\n**Lib 模式**（打包「库」而非「应用」）：\n\n```js\nexport default defineConfig({\n  build: {\n    lib: {\n      entry: 'src/index.ts',\n      name: 'MyLib',\n      fileName: 'my-lib',\n      formats: ['es', 'umd'],\n    },\n    rollupOptions: {\n      external: ['vue'], // 把 vue 标为外部依赖，不打进包\n    },\n  },\n})\n```\n\n`external` 让「用户环境里已有」的包（如 vue）不进你的库产物，避免重复打包。\n\n### 名词解释\n\n**`manualChunks`**：Rollup 的代码分割配置，手动指定「哪些模块合并成一个 chunk」，常用于把第三方库拆成 vendor，利于长期缓存。\n\n**Lib 模式（`build.lib`）**：Vite 打包「可发布的库」的模式，产出 ESM/UMD 等多种格式，适合发 npm 包而非网页应用。\n\n**`external`**：声明「这些依赖不打进产物」，由使用者自行提供。发库时必须把 peer 依赖（如框架）标 external。\n\n**`minify`**：压缩器选项。`esbuild`（默认，快）或 `terser`（更优体积，更慢）。\n\n### 课后练习\n\n**练习 1**：`optimizeDeps.include` 和 `build.rollupOptions.manualChunks` 分别在哪个阶段起作用？\n\n> 答案：`optimizeDeps.include` 作用于**开发预构建**（让依赖变成 ESM 缓存）；`manualChunks` 作用于**生产构建**（控制产物如何拆 chunk）。两者阶段不同、目的不同，不要混淆。\n\n**练习 2**：发一个 Vue 组件库时，为什么要把 `vue` 设为 `external`？\n\n> 答案：因为使用你库的项目自己已经装了 vue。若把 vue 打进你的库，会出现「两份 vue」导致实例不共享、体积翻倍。标 external 让库「假定宿主环境提供 vue」，只发布你自己的代码。\n\n### 总结\n\nVite 优化三件事：**`optimizeDeps` 调好开发预构建、`manualChunks` 拆好生产 vendor、lib 模式 + external 发好库**。它们分别落在「开发」「构建」「发库」三个场景，互不干扰。记住 Vite 的哲学——「开发极简、构建交给 Rollup 深挖」——优化时顺着这条线找配置项就不会乱。最后一节我们做实战整合：接入框架、dev server 代理与部署。"
  },
  {
    "id": "vt-l8",
    "chapter": "optimize",
    "title": "实战：与框架集成、Dev Server 代理与部署",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用官方插件接入 Vue / React\n- 配置 `server.proxy` 解决开发跨域\n- 知道 Vite 产物的部署方式\n\n**接入框架**只需装对应官方插件：\n\n```bash\n# Vue 项目\n# npm i -D @vitejs/plugin-vue\n# React 项目\n# npm i -D @vitejs/plugin-react\n```\n\n```js\n// Vue 的 vite.config.js\nimport { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({\n  plugins: [vue()], // 让 Vite 认识 .vue 单文件组件\n})\n```\n\n```js\n// React 的 vite.config.js\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()], // 支持 JSX + Fast Refresh\n})\n```\n\n**开发跨域**：前端 `fetch('/api/users')` 要打到后端 `http://localhost:8080`，用 `server.proxy` 转发，免配 CORS：\n\n```js\nexport default defineConfig({\n  server: {\n    port: 5173,\n    proxy: {\n      // 以 /api 开头的请求，转发到后端 8080\n      '/api': {\n        target: 'http://localhost:8080',\n        changeOrigin: true,\n        // 若后端路径不带 /api 前缀，可重写掉\n        // rewrite: (p) => p.replace(/^\\/api/, ''),\n      },\n    },\n  },\n})\n```\n\n**部署**：`npm run build` 后 `dist/` 是一份**纯静态资源**（HTML/CSS/JS），可托管到任意静态服务器（Nginx、Cloudflare Pages、GitHub Pages、对象存储…）。SPA 路由记得配「兜底回退到 index.html」：\n\n```js\n// 若用 Vite 自身的 preview 或某些平台，SPA fallback 通常已内置\n// Nginx 示例：\n// location / { try_files $uri $uri/ /index.html; }\n```\n\n注意 `base` 配置要和部署路径一致（挂在子目录时设为对应前缀）。\n\n### 名词解释\n\n**官方插件（@vitejs/plugin-*）**：Vite 团队维护的框架集成插件，`plugin-vue` 支持 `.vue` 单文件组件，`plugin-react` 支持 JSX 与 Fast Refresh。\n\n**`server.proxy`**：开发服务器的请求代理配置，把特定前缀的请求转发到真实后端，开发期绕过浏览器跨域限制。\n\n**SPA 兜底（Fallback）**：对于前端路由（如 `/user/123`），刷新时服务器要把未知路径回退到 `index.html`，否则 404。静态托管需显式配置。\n\n**静态托管**：把 `dist/` 当作普通静态文件提供服务的部署方式，Vite 产物天然适配任意静态服务器/CDN。\n\n### 课后练习\n\n**练习 1**：开发时 `server.proxy` 转发 `/api`，为什么不用在代码里写完整后端地址？\n\n> 答案：因为浏览器请求的是同源的 `/api/...`，由 Vite dev server 在本地把它「代理」到 `target` 后端。对前端代码而言请求仍是同源，天然没有跨域；生产环境则由真正的反向代理（Nginx 等）承担同样的转发。\n\n**练习 2**：Vite 的 `dist/` 和 Webpack 的 `dist/` 在部署上有区别吗？\n\n> 答案：没有本质区别，都是「纯静态资源目录」，可托管到任意静态服务器。区别只在「构建工具与产物优化手段」不同，部署侧完全一致。\n\n### 总结\n\nVite 实战的三件事——**官方插件接入框架、`server.proxy` 解开发跨域、`dist/` 纯静态托管 + SPA 兜底**。它把「开发爽」和「部署简」都做到了极致：配置少、心智负担小。到这里，你从「为什么快」走到「手写插件 + 生产优化 + 框架集成」，Vite 主干已打通。建议挑一个小项目（比如 Vue/React 的 todo）把 8 节串起来跑一遍，体会它和 Webpack 在工作流上的差异。"
  }
]

export const vitePlan = [
  {
    "day": 1,
    "title": "认识 Vite：为什么开发体验这么快",
    "lessons": [
      "vt-l1"
    ]
  },
  {
    "day": 2,
    "title": "核心机制：原生 ESM + 依赖预构建",
    "lessons": [
      "vt-l2"
    ]
  },
  {
    "day": 3,
    "title": "基础配置：vite.config、入口、别名、静态资源",
    "lessons": [
      "vt-l3"
    ]
  },
  {
    "day": 4,
    "title": "处理 CSS / 图片 / TypeScript / JSX",
    "lessons": [
      "vt-l4"
    ]
  },
  {
    "day": 5,
    "title": "插件机制：Rollup 插件接口 + Vite 专属钩子",
    "lessons": [
      "vt-l5"
    ]
  },
  {
    "day": 6,
    "title": "写自己的 Vite 插件：虚拟模块与环境变量注入",
    "lessons": [
      "vt-l6"
    ]
  },
  {
    "day": 7,
    "title": "构建优化：依赖预构建调优、代码分割、生产构建",
    "lessons": [
      "vt-l7"
    ]
  },
  {
    "day": 8,
    "title": "实战：与框架集成、Dev Server 代理与部署",
    "lessons": [
      "vt-l8"
    ]
  }
]
