// ============================================================
// Vite 现代前端构建工具（统一重写至本站标准：可运行配置+命令、函数注释、名词通俗解释、课后练习(附答案)、总结）
// 模板字符串内反引号转义 \`，\${ 转义 \${，反斜杠已加倍保护正则
// ============================================================

export const viteCourseMeta = {'id': 'vite', 'title': 'Vite 现代前端构建工具', 'subtitle': '开发时秒开不是魔法，而是 Vite 对构建流程的重新设计：拆解按需编译与预构建背后的思路，掌握它在新项目中的配置与扩展。', 'level': '入门 → 进阶', 'icon': '⚡', 'color': '#646cff', 'practiceCategory': 'vite', 'chapters': [{'key': 'intro', 'name': '第一章 · 认识 Vite', 'lessons': ['vt-l1', 'vt-l2']}, {'key': 'config', 'name': '第二章 · 基础配置', 'lessons': ['vt-l3', 'vt-l4']}, {'key': 'plugin', 'name': '第三章 · 插件机制与自定义插件', 'lessons': ['vt-l5', 'vt-l6']}, {'key': 'optimize', 'name': '第四章 · 构建优化与实战', 'lessons': ['vt-l7', 'vt-l8']}]}

export const viteChapters = [{'key': 'intro', 'name': '第一章 · 认识 Vite', 'lessons': ['vt-l1', 'vt-l2']}, {'key': 'config', 'name': '第二章 · 基础配置', 'lessons': ['vt-l3', 'vt-l4']}, {'key': 'plugin', 'name': '第三章 · 插件机制与自定义插件', 'lessons': ['vt-l5', 'vt-l6']}, {'key': 'optimize', 'name': '第四章 · 构建优化与实战', 'lessons': ['vt-l7', 'vt-l8']}]

export const viteLessons = [
  {
    id: 'vt-l1',
    chapter: 'intro',
    title: '认识 Vite：为什么开发体验这么快',
    minutes: 25,
    content: `### 本节目标

- 理解 Vite 的「开箱即用」与「开发快」从何而来
- 区分 Vite 与传统打包器（如 Webpack）的启动差异
- 能跑起一个最小的 Vite 项目

传统打包器（Webpack 早期）启动时要**先把整个项目打包一遍**才能起开发服务器——项目一大，冷启动等几十秒是常态。Vite 的思路完全不同：它利用**浏览器原生 ESM**，开发时「不打包」，只按需编译浏览器真正请求到的模块。

\`\`\`bash
# 运行环境：Node.js 18+；用官方脚手架 30 秒起一个项目
# npm create vite@latest my-vite-app -- --template vanilla
# cd my-vite-app
# npm install
# npm run dev        # 启动开发服务器（默认 http://localhost:5173）
\`\`\`

启动后，浏览器直接请求 \`/src/main.js\`，Vite 才「即时」把它和依赖编译成浏览器能跑的 ESM 返回。首次请求可能稍慢（要编译），但**之后改动只重新编译那一个文件**，热更新几乎瞬时。

对比一下心智模型：

\`\`\`text
传统打包器：启动 = 打包整个应用（慢）→ 起服务 → 改文件 = 重新打包相关部分
Vite：启动 = 只起一个轻服务（快）→ 浏览器请求谁，才编译谁 → 改文件 = 只编译那一个
\`\`\`

所以 Vite 的「快」不是魔法，而是**把「打包」从「启动时」推迟到了「按需时」**，并依赖浏览器原生 ESM 省掉了大量兼容转换。生产构建时 Vite 仍会用 Rollup 完整打包（保证产物最优），开发时则靠 ESM 跳过这步。

### 名词解释

**原生 ESM（Native ES Modules）**：浏览器内置的 \`import\`/\`export\` 模块能力，无需打包就能加载模块。Vite 开发服务器正是把模块以 ESM 形式直接发给浏览器。

**按需编译（On-demand Compile）**：浏览器请求哪个模块，Vite 才编译哪个，而不是一次性全量编译。这是开发快的核心。

**冷启动（Cold Start）**：项目第一次启动开发服务器到可访问的耗时。Vite 因为不预打包，冷启动极快。

**Rollup**：Vite 生产构建底层使用的打包器，以「产出体积小、Tree Shaking 强」著称。

### 课后练习

**练习 1**：Vite 开发时不打包，那第三方依赖（如 react）几十上百个文件，浏览器不会发几十个请求吗？

> 答案：会，但 Vite 用「依赖预构建」把它化解了——首次启动时把 \`node_modules\` 里的 CJS 依赖（如 react）用 esbuild 预打包成少数几个 ESM 文件并强缓存，浏览器只需请求这几个，不会爆量。详见下一节。

**练习 2**：既然开发不打包，为什么生产构建还要用 Rollup 完整打包？

> 答案：开发追求「快和即时」，生产追求「小和兼容」。Rollup 能做更彻底的 Tree Shaking、代码分割、兼容降级，产出最优静态资源；这些优化在开发时做会拖慢反馈，所以只在构建时做。

### 总结

Vite 的快，本质是**「开发靠浏览器原生 ESM 跳过打包，生产靠 Rollup 兜底优化」**的分工。入门你只需记住：它把最重的「全量打包」从启动时挪走了，所以冷启动和改文件都飞快。下一节我们拆开看「原生 ESM + 依赖预构建」这套组合拳到底怎么运作。`
  },
  {
    id: 'vt-l2',
    chapter: 'intro',
    title: '核心机制：原生 ESM + 依赖预构建',
    minutes: 30,
    content: `### 本节目标

- 看清 dev 时模块是如何被浏览器直接加载的
- 理解「依赖预构建（Pre-bundling）」为何必要、由谁做
- 会简单配置 \`optimizeDeps\`

跑起 \`npm run dev\` 后打开页面，看 Network 面板，你会发现浏览器真的在请求 \`/src/main.js\`、\`/src/App.jsx\` 这样的「源码路径」——Vite 把它们即时编译成 ESM 返回。

但 \`node_modules\` 里的依赖通常是 **CommonJS（CJS）** 写的，浏览器不认 \`require\`。于是 Vite 在「首次启动」时用 **esbuild**（一个极快的 Go 写的打包器）把这些依赖**预构建**成 ESM，并缓存到 \`node_modules/.vite\`。这带来两个好处：

1. 把「成百上千个小文件」合成「几个 ESM 文件」，避免浏览器请求爆炸；
2. CJS → ESM 转换，让浏览器能 \`import\`。

\`\`\`js
// vite.config.js 中可干预预构建行为
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    // 强制预构建这些依赖（即使 Vite 没自动探测到）
    include: ['some-cjs-pkg'],
    // 跳过某些不需要预构建的依赖
    exclude: ['already-esm-pkg'],
  },
})
\`\`\`

\`\`\`bash
# 预构建产物被缓存；当你改了依赖或想强制重算时
# npx vite optimize   # 手动触发一次预构建
# 或删除 node_modules/.vite 缓存目录
\`\`\`

一个直观示意：当你的代码写 \`import React from 'react'\`，浏览器实际拿到的是 Vite 预先打包好的 \`/node_modules/.vite/deps/react.js\`（ESM 版），而不是去读 \`react\` 源码里的几百个 CJS 文件。

### 名词解释

**依赖预构建（Pre-bundling）**：Vite 在启动时用 esbuild 把 \`node_modules\` 里的依赖（尤其 CJS）转成 ESM 并合并缓存，解决「浏览器不认 CJS + 请求过多」的问题。

**esbuild**：用 Go 编写的超快 JS/TS 打包与转译工具，Vite 用它做依赖预构建和 TS/JSX 转译，速度比传统工具快一个量级。

**CJS → ESM 转换**：把 \`module.exports\`/\`require\` 写法的包，改写成浏览器能 \`import\` 的 ESM 形式，是预构建的核心动作之一。

**\`optimizeDeps\`**：Vite 配置项，控制哪些依赖要/不要被预构建（\`include\`/\`exclude\`），以及预构建的 esbuild 选项。

### 课后练习

**练习 1**：预构建缓存放在哪？改了依赖版本后要怎么让它重新生效？

> 答案：缓存在 \`node_modules/.vite\`。改了依赖后删掉这个目录（或 \`npx vite optimize\` 重新预构建），Vite 下次启动会按新依赖重新生成，否则会用到旧的预构建结果。

**练习 2**：为什么预构建用 esbuild 而不是 Rollup？

> 答案：预构建追求「快」，esbuild 是 Go 写的、速度极快，适合「启动期一次性把 node_modules 转成 ESM」；而 Rollup 追求「产出最优」，适合生产构建。两者各司其职。

### 总结

Vite 的「快」由两个齿轮咬合：**原生 ESM 让开发时免打包，依赖预构建（esbuild）把 CJS 依赖变 ESM 并合并缓存**。理解这一点，你就不会被「为什么有的包要配 optimizeDeps.include」这类问题难住——本质就是「确保该预构建的被正确预构建」。下一节我们写第一份 \`vite.config.js\`，把入口、别名、静态资源配明白。`
  },
  {
    id: 'vt-l3',
    chapter: 'config',
    title: '基础配置：vite.config、入口、别名、静态资源',
    minutes: 30,
    content: `### 本节目标

- 写第一份 \`vite.config.js\`
- 配置 \`resolve.alias\` 路径别名
- 理解 \`public\` 目录与「import 资源」两种静态资源管理方式

Vite 大多「零配置」就能跑，但真实项目一定需要一份 \`vite.config.js\`。它用 \`defineConfig\` 包裹以获得类型提示：

\`\`\`js
// vite.config.js
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // 项目根目录（默认当前目录）
  root: '.',
  // 部署时的基础路径：部署到子目录 /my-app/ 时设 '/my-app/'
  base: '/',
  resolve: {
    // 路径别名：之后可 import '@/utils' 而非 '../../utils'
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 不需要构建、直接原样拷贝到 dist 根的文件（如 favicon、robots.txt）
  publicDir: 'public',
})
\`\`\`

**静态资源**有两条路：

\`\`\`js
// 方式一：import 资源（会被 Vite 处理、加 hash、返回最终 URL）
import logoUrl from './logo.png'
document.querySelector('#app').innerHTML = \`<img src="\${logoUrl}">\`

// 方式二：放 public/ 目录，用绝对路径引用，构建时原样拷贝
// public/logo.png → 构建后位于 dist/logo.png，引用写 '/logo.png'
\`\`\`

\`\`\`bash
# 开发：npm run dev（vite）
# 生产构建：把产物输出到 dist/
# npm run build     # 等价于 npx vite build
# npm run preview   # 本地预览构建产物
\`\`\`

\`import\` 方式适合「会被打包优化」的资源（图片、字体），\`public\` 适合「必须保持原文件名/路径」的文件（robots.txt、根 favicon）。

### 名词解释

**\`defineConfig\`**：Vite 提供的配置包裹函数，仅用于「获得 TS 类型提示」，运行时不改变行为，是写配置的标准入口。

**\`resolve.alias\`**：路径别名，把 \`@\` 映射到 \`src\` 等目录，避免深层 \`../../\` 相对路径，重构时尤其省心。

**\`base\`**：部署基础路径。若站点挂在 \`https://x.com/my-app/\`，\`base\` 必须设 \`/my-app/\`，否则资源路径会 404。

**\`publicDir\`**：存放「无需处理、原样拷贝」的静态文件目录，默认 \`public\`。

### 课后练习

**练习 1**：\`import logo from './logo.png'\` 得到的 \`logo\` 是什么类型的值？

> 答案：是一个字符串 URL（开发时是 \`/src/logo.png\` 之类的路径，构建后变成带 hash 的 \`/assets/logo-xxxx.png\`）。你可以直接把它当 \`src\` 用。

**练习 2**：什么时候该用 \`public/\` 而不是 \`import\`？

> 答案：当文件「必须保持原文件名和路径、不能被加 hash 或处理」时，比如 \`robots.txt\`、\`manifest.json\`、根目录 \`favicon.ico\`、需要按固定 URL 访问的资源。其余图片/字体优先用 \`import\`。

### 总结

\`vite.config.js\` 的核心配置就三样：**\`resolve.alias\` 解决路径、静态资源「import vs public」二选一、\`base\` 决定部署位置**。它比 Webpack 配置轻得多——这正是 Vite「约定优于配置」的体现。下一节我们处理「CSS / 图片 / TypeScript / JSX」，看 Vite 开箱即用的能力到底多强。`
  },
  {
    id: 'vt-l4',
    chapter: 'config',
    title: '处理 CSS / 图片 / TypeScript / JSX',
    minutes: 30,
    content: `### 本节目标

- 用 Vite 原生能力处理样式与 TS，无需额外 loader
- 理解 CSS 预处理（SCSS）与 CSS Modules
- 知道图片 import 返回的是 URL

Webpack 要配一堆 loader，Vite 则「默认就懂」大部分事情：

\`\`\`js
// src/main.js
import './style.css'          // ✅ 原生支持，Vite 自动注入
import { greet } from './util' // ✅ .ts 也能直接被 esbuild 转译

console.log(greet('Vite'))
\`\`\`

\`\`\`ts
// src/util.ts
export function greet(name: string): string {
  return 'Hello, ' + name
}
\`\`\`

CSS 更进一步——**CSS Modules** 用 \`.module.css\` 文件名约定自动开启局部作用域：

\`\`\`css
/* src/button.module.css */
.btn { color: #3178c6; padding: 8px 16px; }
\`\`\`

\`\`\`js
import styles from './button.module.css'
// styles.btn 是一个唯一的哈希类名，避免全局污染
document.querySelector('#app').innerHTML = \`<button class="\${styles.btn}">点我</button>\`
\`\`\`

需要 **SCSS** 只要装一个包：

\`\`\`bash
# npm i -D sass
\`\`\`

\`\`\`css
/* src/style.scss —— Vite 检测到 sass 会自动处理 */
$primary: #3178c6;
body { color: $primary; }
\`\`\`

\`\`\`js
import './style.scss' // 直接 import 即可
\`\`\`

图片/字体 import 返回 URL（见上节），HMR 对 CSS 是**即时无刷新更新**——改样式页面秒变，不用整页重载。JSX/TSX 也靠 esbuild 即时转译（配合框架插件，下节讲）。

### 名词解释

**CSS Modules**：一种「局部作用域 CSS」方案，类名被编译成唯一哈希，杜绝全局样式冲突。Vite 用 \`*.module.css\` 文件名约定自动开启。

**SCSS（Sass）**：CSS 的超集，支持变量、嵌套、mixin。Vite 检测到安装了 \`sass\` 就会自动编译 \`.scss\`/\`.sass\`。

**esbuild 转译**：Vite 用 esbuild 在「毫秒级」把 TS/TSX/JSX 转成 JS，无需像 babel 那样配一堆 preset。

**HMR（热更新）**：Vite 对 CSS 的 HMR 是「无刷新替换样式」，比 Webpack 的 style-loader 注入更丝滑。

### 课后练习

**练习 1**：为什么 Vite 处理 TS 不用像 Webpack 那样配 \`ts-loader\`？

> 答案：Vite 内置 esbuild，启动时就接管了 TS/JSX 的转译，开箱即用；Webpack 本身不懂 TS，必须靠 loader 扩展。Vite 的代价是 esbuild 不做「类型检查」（只转译），类型错误要靠 \`tsc --noEmit\` 单独跑。

**练习 2**：CSS Modules 的 \`styles.btn\` 在运行时是什么？

> 答案：一个字符串，是编译后的唯一类名（如 \`_btn_abc12\`）。把它作为 \`class\` 用，就能命中 CSS Modules 生成的局部样式，且不会和别处的 \`.btn\` 冲突。

### 总结

Vite 的「开箱即用」在资源处理上体现得最彻底：**CSS 原生支持、TS/JSX 由 esbuild 即时转译、SCSS 装个包即可、图片 import 即 URL、CSS Modules 用文件名约定开启**。你几乎不写构建配置就能覆盖 90% 的前端日常。唯一要记住的坑：esbuild 只转译不做类型检查，类型安全还得靠 \`tsc\`。下一节进插件机制——Vite 插件 = 兼容 Rollup 插件 + 几个 Vite 专属钩子。`
  },
  {
    id: 'vt-l5',
    chapter: 'plugin',
    title: '插件机制：Rollup 插件接口 + Vite 专属钩子',
    minutes: 30,
    content: `### 本节目标

- 理解「Vite 插件本质是一个对象（兼容 Rollup 插件）」
- 知道 Vite 在 serve / build 两阶段分别用哪些钩子
- 认识几个 Vite 专属钩子（transform / config / transformIndexHtml）

Vite 的插件系统**直接复用 Rollup 的插件接口**——一个插件就是「一个带 \`name\` 和若干钩子方法的对象」。这让你写的插件在「开发服务器」和「生产构建」里都能工作（构建阶段走 Rollup）。

\`\`\`js
// 一个最小 Vite 插件骨架
export default function myPlugin() {
  return {
    name: 'my-plugin',        // 插件名（必填，Rollup 要求唯一）
    // —— Rollup 通用钩子 ——
    transform(code, id) {
      // code: 文件源码；id: 文件绝对路径
      // 返回修改后的代码（或不返回表示不动）
      if (id.endsWith('.txt')) {
        return \`export default \${JSON.stringify(code)}\`
      }
    },
    // —— Vite 专属钩子（serve 阶段）——
    configureServer(server) {
      // 在开发服务器上加自定义中间件
      server.middlewares.use((req, res, next) => {
        if (req.url === '/ping') { res.end('pong'); return }
        next()
      })
    },
    // —— Vite 专属钩子：改 index.html ——
    transformIndexHtml(html) {
      return html.replace('<title>', '<title>[DEV] ')
    },
  }
}
\`\`\`

关键心智点：

1. **serve 阶段**（开发）：Vite 用自己的中间件管线，插件可用 \`configureServer\`、\`transform\`、\`transformIndexHtml\` 等钩子干预请求与响应。
2. **build 阶段**（生产）：Vite 调用 Rollup，插件用 Rollup 标准钩子（\`resolveId\`、\`load\`、\`transform\`、\`generateBundle\` 等）工作。
3. 同一个 \`transform\` 钩子，在两边都有效——这正是「一套插件通吃开发和生产」的原因。

\`\`\`js
// vite.config.js 里挂载插件
import { defineConfig } from 'vite'
import myPlugin from './my-plugin.js'

export default defineConfig({
  plugins: [myPlugin()],
})
\`\`\`

### 名词解释

**Rollup 插件接口**：Vite 插件遵循 Rollup 的插件规范（一个含 \`name\` + 钩子的对象）。这意味着大量 Rollup 生态插件可直接用于 Vite。

**\`transform\` 钩子**：最常用的钩子，接收「文件源码 + 路径」，返回「修改后的代码」。可用于改写、注入、转译任意模块。

**\`configureServer\`**：Vite 专属钩子，只在开发服务器里执行，用来挂自定义中间件（如 mock 接口、特殊路由）。

**\`transformIndexHtml\`**：Vite 专属钩子，用来在开发/构建时改写 \`index.html\`（注入脚本、改 title 等）。

### 课后练习

**练习 1**：为什么说「Vite 插件能复用 Rollup 生态」？

> 答案：因为 Vite 插件接口直接兼容 Rollup 插件规范。生产构建时 Vite 底层就是 Rollup，所以那些为 Rollup 写的插件（只要不涉及 Vite 专属钩子之外的冲突）大多能直接在 Vite 里用。

**练习 2**：\`configureServer\` 钩子会在生产构建时执行吗？

> 答案：不会。它是 Vite 专属的「开发服务器」钩子，只在 \`vite dev\`（serve 阶段）触发；生产构建走 Rollup，不会启动 dev server，所以该钩子不执行。

### 总结

Vite 插件的灵魂是**「一个对象 = Rollup 插件 + Vite 专属钩子」**，serve 阶段用 \`configureServer\`/\`transformIndexHtml\` 干预服务器，build 阶段用 Rollup 钩子（\`transform\`/\`load\`…）参与打包，而 \`transform\` 在两阶段通用。理解了这套「双阶段钩子」模型，写插件就只是「选对钩子」。下一节我们亲手写一个：虚拟模块 + 注入环境变量。`
  },
  {
    id: 'vt-l6',
    chapter: 'plugin',
    title: '写自己的 Vite 插件：虚拟模块与环境变量注入',
    minutes: 35,
    content: `### 本节目标

- 用 \`resolveId\` + \`load\` 实现一个「虚拟模块」
- 在 \`transform\` 里注入自定义 \`import.meta.env\` 变量
- 写出一个可运行的完整插件

**虚拟模块**是 Vite 插件的经典玩法：它不像普通文件那样存在于磁盘，而是「凭空」提供一个可被 \`import\` 的模块。常用于「把构建时信息（版本号、git hash）暴露给前端代码」。

\`\`\`js
// version-plugin.js
export default function versionPlugin(options = {}) {
  const virtualId = 'virtual:app-version'
  const resolvedId = '\\0' + virtualId // 加 \\0 前缀避免和真实文件冲突

  return {
    name: 'app-version-plugin',
    // ① 解析阶段：把 import 'virtual:app-version' 认领下来
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    // ② 加载阶段：为该虚拟 id 返回「代码字符串」作为模块内容
    load(id) {
      if (id === resolvedId) {
        return \`export const version = \${JSON.stringify(options.version || '0.0.0')}
export const builtAt = \${JSON.stringify(new Date().toISOString())}\`
      }
    },
    // ③ 注入自定义环境变量：把 import.meta.env.VITE_BUILD_TIME 填进代码
    transform(code, id) {
      if (id.endsWith('.js') || id.endsWith('.ts')) {
        return code.replace(
          /import\\.meta\\.env\\.VITE_BUILD_TIME/g,
          JSON.stringify(options.builtAt || new Date().toISOString())
        )
      }
    },
  }
}
\`\`\`

用法：

\`\`\`js
// vite.config.js
import { defineConfig } from 'vite'
import versionPlugin from './version-plugin.js'

export default defineConfig({
  plugins: [
    versionPlugin({ version: '1.3.0' }),
  ],
})
\`\`\`

\`\`\`js
// src/main.js —— 像普通模块一样 import 虚拟模块
import { version, builtAt } from 'virtual:app-version'
console.log('当前版本:', version, '构建于:', builtAt)

// 这段代码里的 import.meta.env.VITE_BUILD_TIME 会被插件替换成真实时间字符串
const t = import.meta.env.VITE_BUILD_TIME
\`\`\`

跑 \`npm run dev\`，控制台会打出 \`当前版本: 1.3.0\` 和真实构建时间。**核心套路**：\`resolveId\` 把虚拟 id 认领 → \`load\` 返回它的「源码字符串」→ 浏览器 import 时拿到这份内容。而 \`transform\` 钩子则演示了「编译期替换代码中的标记」这一通用能力（注入 env、注入常量都靠它）。

### 名词解释

**虚拟模块（Virtual Module）**：不对应磁盘文件、由插件「凭空生成」的模块，可被正常 \`import\`。常用于把构建时信息（版本、git hash）注入前端。

**\`resolveId\` / \`load\`**：Rollup 钩子对。\`resolveId\` 决定「这个 import 指到哪个内部 id」，\`load\` 决定「这个 id 的内容是什么」；配合实现虚拟模块。

**\`\\0\` 前缀**：Vite/Rollup 约定用 \`\\0\` 标记「内部虚拟模块 id」，防止它和真实文件路径冲突。

**\`import.meta.env\`**：Vite 注入的「环境变量对象」，\`import.meta.env.VITE_XXX\` 对应 \`VITE_XXX\` 环境变量，是前后端共享配置的标准通道。

### 课后练习

**练习 1**：虚拟模块为什么要在 id 前加 \`\\0\`？

> 答案：\`\\0\` 是 Rollup/Vite 约定的「内部模块」标记，普通文件路径不会以它开头，加前缀能确保虚拟 id 不会误匹配到磁盘上的真实文件，也不会被当作普通文件去读。

**练习 2**：\`transform\` 里用 \`code.replace(...)\` 注入常量，有什么风险？

> 答案：简单字符串替换可能误伤——比如字符串字面量里恰好出现同样的子串也会被替换。生产级插件应先判断「这是不是目标标识符的引用」再替换（或用更精确的 AST 改写）。本课示例为讲清原理用 replace，实战要更严谨。

### 总结

你写出了第一个「生产可用」的 Vite 插件：**\`resolveId\`+\`load\` 造虚拟模块，\`transform\` 注入构建期变量**。这俩模式覆盖了大部分 Vite 插件需求——「凭空造模块」和「改写代码」。我的建议：写插件先想清「是改已有文件（transform）还是造新模块（resolveId/load）」，再选钩子，思路立刻清晰。下一节进入优化：依赖预构建调优、代码分割与生产构建。`
  },
  {
    id: 'vt-l7',
    chapter: 'optimize',
    title: '构建优化：依赖预构建调优、代码分割、生产构建',
    minutes: 30,
    content: `### 本节目标

- 调优 \`optimizeDeps\`（include/exclude）
- 用 \`build.rollupOptions\` 做代码分割（manualChunks）
- 理解 lib 模式与压缩/minify 选项

**依赖预构建调优**：默认 Vite 会自动探测并预构建依赖，但有些包需要你显式声明：

\`\`\`js
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    include: ['lodash-es', 'axios'], // 明确要预构建的
    exclude: ['@scope/already-esm'], // 已是 ESM、无需预构建的
  },
})
\`\`\`

**代码分割**：生产构建用 Rollup 的 \`manualChunks\` 把第三方库拆成独立 vendor chunk，提升缓存：

\`\`\`js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // 这些包打进 vendor.js
        },
      },
    },
    // 压缩器：'esbuild'（默认，快）或 'terser'（更彻底）
    minify: 'esbuild',
    target: 'es2020', // 输出语法的目标浏览器
  },
})
\`\`\`

\`\`\`bash
# 生产构建；产物在 dist/
# npm run build
\`\`\`

**Lib 模式**（打包「库」而非「应用」）：

\`\`\`js
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLib',
      fileName: 'my-lib',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'], // 把 vue 标为外部依赖，不打进包
    },
  },
})
\`\`\`

\`external\` 让「用户环境里已有」的包（如 vue）不进你的库产物，避免重复打包。

### 名词解释

**\`manualChunks\`**：Rollup 的代码分割配置，手动指定「哪些模块合并成一个 chunk」，常用于把第三方库拆成 vendor，利于长期缓存。

**Lib 模式（\`build.lib\`）**：Vite 打包「可发布的库」的模式，产出 ESM/UMD 等多种格式，适合发 npm 包而非网页应用。

**\`external\`**：声明「这些依赖不打进产物」，由使用者自行提供。发库时必须把 peer 依赖（如框架）标 external。

**\`minify\`**：压缩器选项。\`esbuild\`（默认，快）或 \`terser\`（更优体积，更慢）。

### 课后练习

**练习 1**：\`optimizeDeps.include\` 和 \`build.rollupOptions.manualChunks\` 分别在哪个阶段起作用？

> 答案：\`optimizeDeps.include\` 作用于**开发预构建**（让依赖变成 ESM 缓存）；\`manualChunks\` 作用于**生产构建**（控制产物如何拆 chunk）。两者阶段不同、目的不同，不要混淆。

**练习 2**：发一个 Vue 组件库时，为什么要把 \`vue\` 设为 \`external\`？

> 答案：因为使用你库的项目自己已经装了 vue。若把 vue 打进你的库，会出现「两份 vue」导致实例不共享、体积翻倍。标 external 让库「假定宿主环境提供 vue」，只发布你自己的代码。

### 总结

Vite 优化三件事：**\`optimizeDeps\` 调好开发预构建、\`manualChunks\` 拆好生产 vendor、lib 模式 + external 发好库**。它们分别落在「开发」「构建」「发库」三个场景，互不干扰。记住 Vite 的哲学——「开发极简、构建交给 Rollup 深挖」——优化时顺着这条线找配置项就不会乱。最后一节我们做实战整合：接入框架、dev server 代理与部署。`
  },
  {
    id: 'vt-l8',
    chapter: 'optimize',
    title: '实战：与框架集成、Dev Server 代理与部署',
    minutes: 30,
    content: `### 本节目标

- 用官方插件接入 Vue / React
- 配置 \`server.proxy\` 解决开发跨域
- 知道 Vite 产物的部署方式

**接入框架**只需装对应官方插件：

\`\`\`bash
# Vue 项目
# npm i -D @vitejs/plugin-vue
# React 项目
# npm i -D @vitejs/plugin-react
\`\`\`

\`\`\`js
// Vue 的 vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()], // 让 Vite 认识 .vue 单文件组件
})
\`\`\`

\`\`\`js
// React 的 vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // 支持 JSX + Fast Refresh
})
\`\`\`

**开发跨域**：前端 \`fetch('/api/users')\` 要打到后端 \`http://localhost:8080\`，用 \`server.proxy\` 转发，免配 CORS：

\`\`\`js
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      // 以 /api 开头的请求，转发到后端 8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 若后端路径不带 /api 前缀，可重写掉
        // rewrite: (p) => p.replace(/^\\/api/, ''),
      },
    },
  },
})
\`\`\`

**部署**：\`npm run build\` 后 \`dist/\` 是一份**纯静态资源**（HTML/CSS/JS），可托管到任意静态服务器（Nginx、Cloudflare Pages、GitHub Pages、对象存储…）。SPA 路由记得配「兜底回退到 index.html」：

\`\`\`js
// 若用 Vite 自身的 preview 或某些平台，SPA fallback 通常已内置
// Nginx 示例：
// location / { try_files $uri $uri/ /index.html; }
\`\`\`

注意 \`base\` 配置要和部署路径一致（挂在子目录时设为对应前缀）。

### 名词解释

**官方插件（@vitejs/plugin-*）**：Vite 团队维护的框架集成插件，\`plugin-vue\` 支持 \`.vue\` 单文件组件，\`plugin-react\` 支持 JSX 与 Fast Refresh。

**\`server.proxy\`**：开发服务器的请求代理配置，把特定前缀的请求转发到真实后端，开发期绕过浏览器跨域限制。

**SPA 兜底（Fallback）**：对于前端路由（如 \`/user/123\`），刷新时服务器要把未知路径回退到 \`index.html\`，否则 404。静态托管需显式配置。

**静态托管**：把 \`dist/\` 当作普通静态文件提供服务的部署方式，Vite 产物天然适配任意静态服务器/CDN。

### 课后练习

**练习 1**：开发时 \`server.proxy\` 转发 \`/api\`，为什么不用在代码里写完整后端地址？

> 答案：因为浏览器请求的是同源的 \`/api/...\`，由 Vite dev server 在本地把它「代理」到 \`target\` 后端。对前端代码而言请求仍是同源，天然没有跨域；生产环境则由真正的反向代理（Nginx 等）承担同样的转发。

**练习 2**：Vite 的 \`dist/\` 和 Webpack 的 \`dist/\` 在部署上有区别吗？

> 答案：没有本质区别，都是「纯静态资源目录」，可托管到任意静态服务器。区别只在「构建工具与产物优化手段」不同，部署侧完全一致。

### 总结

Vite 实战的三件事——**官方插件接入框架、\`server.proxy\` 解开发跨域、\`dist/\` 纯静态托管 + SPA 兜底**。它把「开发爽」和「部署简」都做到了极致：配置少、心智负担小。到这里，你从「为什么快」走到「手写插件 + 生产优化 + 框架集成」，Vite 主干已打通。建议挑一个小项目（比如 Vue/React 的 todo）把 8 节串起来跑一遍，体会它和 Webpack 在工作流上的差异。`
  }
]

export const vitePlan = [{'day': 1, 'title': '认识 Vite：为什么开发体验这么快', 'lessons': ['vt-l1']}, {'day': 2, 'title': '核心机制：原生 ESM + 依赖预构建', 'lessons': ['vt-l2']}, {'day': 3, 'title': '基础配置：vite.config、入口、别名、静态资源', 'lessons': ['vt-l3']}, {'day': 4, 'title': '处理 CSS / 图片 / TypeScript / JSX', 'lessons': ['vt-l4']}, {'day': 5, 'title': '插件机制：Rollup 插件接口 + Vite 专属钩子', 'lessons': ['vt-l5']}, {'day': 6, 'title': '写自己的 Vite 插件：虚拟模块与环境变量注入', 'lessons': ['vt-l6']}, {'day': 7, 'title': '构建优化：依赖预构建调优、代码分割、生产构建', 'lessons': ['vt-l7']}, {'day': 8, 'title': '实战：与框架集成、Dev Server 代理与部署', 'lessons': ['vt-l8']}]
