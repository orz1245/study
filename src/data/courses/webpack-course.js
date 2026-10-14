// ============================================================
// Webpack 打包器实战（统一重写至本站标准：可运行配置+命令、函数注释、名词通俗解释、课后练习(附答案)、总结）
// 模板字符串内反引号转义 \`，\${ 转义 \${，反斜杠已加倍保护正则
// ============================================================

export const webpackCourseMeta = {'id': 'webpack', 'title': 'Webpack 打包器实战', 'subtitle': '每个前端项目都在用它，但很少有人说得清它做了什么：从「为什么需要打包器」讲起，亲手配置并拆解 Webpack 的核心机制。', 'level': '入门 → 进阶', 'icon': '📦', 'color': '#8ed1fc', 'practiceCategory': 'webpack', 'chapters': [{'key': 'intro', 'name': '第一章 · 认识 Webpack', 'lessons': ['wp-l1', 'wp-l2']}, {'key': 'config', 'name': '第二章 · 配置与 Loader', 'lessons': ['wp-l3', 'wp-l4']}, {'key': 'plugin', 'name': '第三章 · 插件机制与自定义插件', 'lessons': ['wp-l5', 'wp-l6', 'wp-l7']}, {'key': 'optimize', 'name': '第四章 · 优化与实战', 'lessons': ['wp-l8']}]}

export const webpackChapters = [{'key': 'intro', 'name': '第一章 · 认识 Webpack', 'lessons': ['wp-l1', 'wp-l2']}, {'key': 'config', 'name': '第二章 · 配置与 Loader', 'lessons': ['wp-l3', 'wp-l4']}, {'key': 'plugin', 'name': '第三章 · 插件机制与自定义插件', 'lessons': ['wp-l5', 'wp-l6', 'wp-l7']}, {'key': 'optimize', 'name': '第四章 · 优化与实战', 'lessons': ['wp-l8']}]

export const webpackLessons = [
  {
    id: 'wp-l1',
    chapter: 'intro',
    title: '认识 Webpack：为什么前端需要打包器',
    minutes: 25,
    content: `### 本节目标

- 说清楚「模块化打包」到底解决什么痛点
- 区分「浏览器原生 ESM」与「打包器产物」的差异
- 能说出 bundle / chunk / module 分别是什么

现代前端不再是「几个 \`<script>\` 标签」能搞定的。一个真实项目动辄几百个文件：你的业务代码、从 npm 装来的依赖（react、lodash…）、CSS、图片、字体。浏览器原生只认识 \`<script src="...">\` 和 \`<link>\`，它并不知道什么是「import 一个 npm 包」。

Webpack 做的事，就是当** bundler（打包器）**：从你指定的入口出发，顺着 \`import\`/\`require\` 把整张**依赖图**全部收进来，再把它们「翻译 + 拼装」成浏览器能直接跑的几个文件（bundle）。

\`\`\`bash
# 运行环境：Node.js 16+；项目里先装 webpack 与 webpack-cli
# npm init -y
# npm i -D webpack webpack-cli

# 一个最简单的项目结构
# my-app/
# ├─ src/
# │  └─ index.js          // 入口：import 了 sayHello
# └─ package.json

# src/index.js
import { sayHello } from './utils.js'
sayHello('Webpack')

# src/utils.js
export function sayHello(name) {
  console.log('Hello, ' + name)
}

# 在 my-app 目录直接跑（不写配置也能打包，webpack 会按默认 entry=./src/index.js）
npx webpack
# 产物默认输出到 dist/main.js —— 这就是浏览器能直接 <script> 引用的 bundle
\`\`\`

打包后，\`dist/main.js\` 里已经把 \`utils.js\` 的内容「内联」了进来，浏览器不再需要理解 \`import\`——它拿到的就是一段自包含的脚本。这就是打包器存在的根本理由：**把「人类写的多文件模块世界」翻译成「浏览器能跑的单文件世界」**。

### 名词解释

**模块（Module）**：一个独立的代码单元，通常是 \`import\`/\`export\` 的一个文件。你的 \`utils.js\` 就是一个模块。

**依赖图（Dependency Graph）**：从入口出发、顺着 import 找到的所有模块及其依赖关系，画出来像一张图。Webpack 就是按这张图来打包的。

**打包（Bundle）**：打包的最终产物文件，里面包含了一个或多个模块拼接后的代码，浏览器可直接加载。

**分块（Chunk）**：构建过程中 Webpack 内部的中间代码块，最终会被输出成一个或多个 bundle。代码分割时你会看到多个 chunk 对应多个 bundle。

### 课后练习

**练习 1**：浏览器原生支持 \`<script type="module">\` 了，为什么还需要 Webpack？

> 答案：原生 ESM 有两个硬伤——① 它只能加载「浏览器能直接 fetch 的 URL」，无法直接 \`import 'react'\`（npm 包不在你的服务器上）；② 模块一多，浏览器就要发几十上百个请求，加载慢。Webpack 把 npm 依赖、各种资源全打进 bundle，既解决了「import 包」的问题，也合并了请求、还能顺手做压缩/兼容转换。

**练习 2**：bundle 和 chunk 是一回事吗？

> 答案：不是。chunk 是 Webpack 构建过程中的「中间分块」，bundle 是最终写到磁盘的文件。一个 chunk 通常会对应一个 bundle，但「代码分割」时一个 chunk 可能拆出多个 bundle，二者概念层次不同。

### 总结

我的判断很直接：**只要你在写「多文件 + 用 npm 依赖」的前端项目，就需要打包器**。Webpack 的价值不是「发明模块」，而是把散落各处的模块和依赖，按依赖图收拢成浏览器能跑的自包含文件。入门第一课你只需记住三件事——入口（从哪开始）、依赖图（顺着 import 收集什么）、bundle（最终吐出什么）。下一节我们写第一个真正的 \`webpack.config.js\`，把 entry/output/mode 配明白。`
  },
  {
    id: 'wp-l2',
    chapter: 'intro',
    title: '核心概念：entry / output / mode 配置你的第一次构建',
    minutes: 30,
    content: `### 本节目标

- 写第一个 \`webpack.config.js\`
- 理解 \`entry\`、\`output\`、\`mode\` 三个核心配置项
- 会配「多入口」项目

不写配置时 Webpack 也能跑（默认入口 \`./src/index.js\`、输出 \`./dist/main.js\`）。但真实项目一定需要一份 \`webpack.config.js\` 来明确「入口是谁、产物放哪、按什么模式构建」。

\`\`\`js
// webpack.config.js
// 运行环境：Node.js 16+；执行 npx webpack（它会自动读取本文件）
const path = require('path')

module.exports = {
  // 入口：Webpack 从哪个文件开始「顺藤摸瓜」收集依赖
  entry: './src/index.js',

  // 输出：打包产物写到哪、叫什么
  output: {
    path: path.resolve(__dirname, 'dist'), // 必须是绝对路径
    filename: 'bundle.js',                 // 产物文件名
    clean: true,                           // 每次构建先清空 dist（webpack5 支持）
  },

  // 模式：development（不压缩、带注释，便于调试）/ production（压缩优化）/ none
  mode: 'development',
}
\`\`\`

跑 \`npx webpack\`，你会在 \`dist/bundle.js\` 看到打包结果。\`mode: 'production'\` 会自动开启压缩（Terser）和大量优化，文件更小但更难读；\`development\` 相反，适合本地看产物。

**多入口**也很常见——比如一个后台页、一个前台页：

\`\`\`js
// 多入口：key 是「入口名」，value 是入口文件
module.exports = {
  entry: {
    home: './src/home.js',
    admin: './src/admin.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // [name] 会替换成入口名 home / admin，避免文件名冲突
    filename: '[name].bundle.js',
    clean: true,
  },
  mode: 'production',
}
\`\`\`

用 \`[name]\` 占位符，Webpack 会为每个入口生成 \`home.bundle.js\` 和 \`admin.bundle.js\`。

### 名词解释

**入口（Entry）**：Webpack 构建的起点文件，它及其所有 import 构成了这张依赖图的根。

**输出（Output）**：规定产物「文件名叫什么、放哪个目录」。\`filename\` 支持 \`[name]\`/\`[contenthash]\` 等占位符。

**模式（Mode）**：\`development\`/\`production\`/\`none\` 三选一。它会自动帮你打开/关闭一系列内置优化，是最重要的「一键开关」。

**ContentHash（内容哈希）**：把文件内容算成一段哈希放进文件名（如 \`bundle.[contenthash].js\`）。内容不变则文件名不变，浏览器可长期缓存；内容一变文件名就变，自动破缓存。

### 课后练习

**练习 1**：\`output.path\` 一定要写绝对路径吗？能不能写 \`'./dist'\`？

> 答案：强烈建议绝对路径。\`path.resolve(__dirname, 'dist')\` 是标准写法；写相对路径在有些环境下会解析到错误目录，踩坑概率高。\`__dirname\` 是当前配置文件所在目录。

**练习 2**：\`mode: 'production'\` 和手动开 \`optimization.minimize: true\` 是什么关系？

> 答案：设置为 \`production\` 时，Webpack 会自动把 \`optimization.minimize\` 打开（用 Terser 压缩）。你也可以显式写 \`optimization.minimize\`，但日常直接用 \`mode\` 更省事，它是「一揽子优化预设」。

### 总结

\`webpack.config.js\` 的核心三角就是 **entry（从哪收）、output（吐到哪）、mode（怎么优化）**。绝大多数项目这几行就能跑起来；多入口用「对象形式的 entry + \`[name]\` 占位符」即可优雅解决。我的经验：**先让 \`mode: 'development'\` 跑通，确认产物正确，再切 \`production\` 看优化结果**——别一上来就 debug 压缩后的代码。下一节我们引入 loader，让 Webpack 能处理 JS 以外的世界。`
  },
  {
    id: 'wp-l3',
    chapter: 'config',
    title: '配置文件与常用 Loader：让 Webpack 听懂 TS/CSS',
    minutes: 30,
    content: `### 本节目标

- 理解 loader 是什么、为什么需要它
- 会用 \`module.rules\` 配置 loader
- 用 \`ts-loader\` 让 Webpack 打包 TypeScript

Webpack 默认只认识 JavaScript（和 JSON）。但你的项目里有 \`.ts\`、\`.css\`、\`.png\`、\`.vue\`……这些它统统不认。这时候就需要 **loader（加载器）**——你可以把它想成「翻译官」：每种 loader 负责把某一类文件，转译成 Webpack 能理解的 JS 模块。

\`\`\`js
// webpack.config.js（片段）
module.exports = {
  entry: './src/index.ts',
  module: {
    // rules 是一组「遇到某种文件，用哪些 loader 处理」的规则
    rules: [
      {
        test: /\\.ts$/,        // 匹配以 .ts 结尾的文件
        use: 'ts-loader',     // 用 ts-loader 把它转成 JS
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // import 时不写后缀也能解析
  },
  mode: 'development',
}
\`\`\`

配套依赖与 \`tsconfig.json\`：

\`\`\`bash
# 安装：ts-loader 依赖 typescript 本体
# npm i -D webpack webpack-cli typescript ts-loader
\`\`\`

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true
  }
}
\`\`\`

\`test\` 是正则、\`use\` 是 loader 名。Webpack 遇到 \`import './a.ts'\` 时，命中 \`test: /\\.ts$/\`，于是调用 \`ts-loader\` 把 TS 编译成 JS，再继续参与打包。这就是「非 JS 资源进入依赖图」的机制。

### 名词解释

**Loader（加载器）**：Webpack 的「文件翻译官」，把某种类型的资源（TS、CSS、图片…）转成 JS 模块，从而能进入依赖图被打包。

**\`module.rules\`**：配置 loader 的地方，每条规则是一个 \`{ test, use, exclude }\` 对象，表示「匹配到的文件用某 loader 处理」。

**\`test\` / \`use\`**：\`test\` 是正则，决定「哪些文件」命中；\`use\` 是 loader 列表（从右到左、从下到上执行）。

**Source Map（源码映射）**：把压缩/转译后的代码「映射回」原始源码的对照表，让你在浏览器 DevTools 里能直接调试 \`.ts\` 源码而不是看编译产物。

### 课后练习

**练习 1**：\`use: ['style-loader', 'css-loader']\` 两个 loader 谁先执行？

> 答案：数组从右到左执行，所以先 \`css-loader\`（把 CSS 解析成 JS 字符串/模块），再 \`style-loader\`（把样式注入到页面的 \`<style>\` 里）。顺序写反就废了。

**练习 2**：为什么 \`exclude: /node_modules/\` 几乎是 loader 的标配？

> 答案：node_modules 里的包通常是「已经编译好的发布版」，再让 ts-loader/babel 转一遍既慢又可能出错。排除它能大幅加快构建，也避免破坏第三方包。

### 总结

loader 是 Webpack「能处理一切」的秘密武器：**\`test\` 决定命中谁，\`use\` 决定用什么翻译，规则从右往左执行**。本节省下的关键认知是——任何非 JS 资源，本质都是「找一个 loader 把它变成 JS 模块」，然后它就能像普通模块一样被 \`import\`、被打包。下一节具体到「样式与图片」，把 CSS、图片、字体这些「前端日常」全部接进依赖图。`
  },
  {
    id: 'wp-l4',
    chapter: 'config',
    title: '用 Loader 处理 CSS / 图片 / 资源模块',
    minutes: 30,
    content: `### 本节目标

- 用 \`css-loader\` + \`style-loader\` 把样式接进打包
- 用 Webpack 5 的「资源模块」处理图片，替代老式 file-loader
- 理解「抽取 CSS 成独立文件」的插件思路

**样式**是前端刚需。Webpack 处理 CSS 需要两个 loader 配合：

\`\`\`js
// webpack.config.js（片段）
module.exports = {
  module: {
    rules: [
      {
        test: /\\.css$/,
        // 先 css-loader 解析 CSS 为模块，再 style-loader 注入 <style>
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
\`\`\`

\`\`\`js
// src/index.js
import './style.css' // 现在 CSS 像模块一样被 import，页面会立刻有样式
console.log('样式已注入')
\`\`\`

开发中 \`style-loader\` 把 CSS 塞进 \`<style>\` 标签最方便（改完热更新）。但**生产环境**更推荐把 CSS 抽成独立 \`.css\` 文件（并行加载、缓存更好），这时用 \`mini-css-extract-plugin\` 替代 \`style-loader\`：

\`\`\`js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  module: {
    rules: [
      { test: /\\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' })],
}
\`\`\`

**图片 / 字体**在 Webpack 5 不用再装 file-loader/url-loader，内置「资源模块（Asset Modules）」搞定：

\`\`\`js
module.exports = {
  module: {
    rules: [
      {
        test: /\\.(png|jpe?g|gif|svg)$/,
        type: 'asset',          // 自动：小于 8KB 转 base64 内联，否则输出文件
        parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
      },
    ],
  },
}
\`\`\`

\`\`\`js
import logo from './logo.png' // logo 是打包后的 URL 字符串
document.querySelector('#app').innerHTML = \`<img src="\${logo}">\`
\`\`\`

\`type: 'asset'\` 让 Webpack 自己决定「小图内联成 base64、大图输出成文件」，一句配置替代了过去两个 loader，非常省心。

### 名词解释

**\`css-loader\`**：把 CSS 文件解析成 Webpack 能理解的模块（处理 \`@import\`、url() 等），但不负责把它显示出来。

**\`style-loader\`**：把 \`css-loader\` 处理完的样式，以 \`<style>\` 标签形式注入到 HTML \`<head>\`，让页面真正生效。

**MiniCssExtractPlugin**：生产环境用的「CSS 抽取器」，把 CSS 从 JS 里剥离、生成独立 \`.css\` 文件，利于缓存与并行加载。

**资源模块（Asset Modules）**：Webpack 5 内置能力，\`type: 'asset'\` 自动处理图片/字体，小资源内联 base64、大资源输出文件，替代老式的 file-loader/url-loader。

### 课后练习

**练习 1**：开发环境用 \`style-loader\`、生产用 \`MiniCssExtractPlugin.loader\`，为什么分两套？

> 答案：开发时要「改 CSS 即时热更新」，style-loader 注入 \`<style>\` 最快；生产时要「CSS 独立成文件便于浏览器并行下载 + 长缓存」，抽取更优。两套是「开发体验 vs 线上性能」的取舍。

**练习 2**：\`type: 'asset'\` 里 \`maxSize: 8 * 1024\` 控制什么？

> 答案：控制「资源内联与否的临界值」。小于 8KB 的图片会被转成 base64 字符串内联进 JS/CSS（省一次请求），大于等于的则输出成独立文件（避免 JS 体积膨胀）。

### 总结

样式与图片这两类「前端日常」，本质都是「用对 loader / 模块类型把它变成可 import 的资源」：**CSS 走 \`css-loader\`+\`style-loader\`（开发）或 MiniCssExtract（生产），图片走 Webpack5 的 \`asset\` 资源模块**。我的建议——新手先用 style-loader 跑通，等要做生产优化了再切抽取插件，别在开发阶段就给自己加复杂度。下一节进入 Webpack 最迷人的部分：**插件机制**，以及你一直想学的「自己写一个插件」。`
  },
  {
    id: 'wp-l5',
    chapter: 'plugin',
    title: '插件机制：Tapable、compiler 与 compilation 的生命周期',
    minutes: 30,
    content: `### 本节目标

- 分清 loader 与 plugin 的根本区别
- 理解 Tapable 钩子、compiler 与 compilation 对象
- 知道常见内置/第三方插件（HtmlWebpackPlugin 等）挂在哪个阶段

前面 loader 管「单个文件怎么转译」，而 **plugin（插件）** 管的是「整个构建过程的某个时机做什么事」——比如：打包后自动生成 HTML、把 CSS 抽出去、注入版权 banner、生成资源清单。

Webpack 内部用 **Tapable** 这套「钩子（Hook）系统」来调度。你可以把它理解成一根时间轴上的许多「事件节点」，每个节点上可以「挂」你的逻辑。两个核心对象：

- **compiler**：一次构建的「总指挥」，从启动到结束只有一个，掌管全局配置和生命周期。
- **compilation**：一次「编译」的对象，代表当前这次打包的模块、chunk、资源。每次构建（或 watch 下的每次重编）都会有一个新的 compilation。

一个最简单的「使用插件」例子——自动生成引入 bundle 的 HTML：

\`\`\`bash
# npm i -D html-webpack-plugin
\`\`\`

\`\`\`js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.js', path: __dirname + '/dist', clean: true },
  plugins: [
    new HtmlWebpackPlugin({ title: '我的应用' }), // 自动生成 dist/index.html 并注入 bundle
  ],
  mode: 'development',
}
\`\`\`

插件怎么「挂」到钩子上？看一个插件内部长这样（概念示意）：

\`\`\`js
// 插件是一个有 apply(compiler) 方法的类/对象
class MyPlugin {
  apply(compiler) {
    // compiler.hooks.emit 是「即将输出文件前」这个时机
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      console.log('当前要输出的资源有:', Object.keys(compilation.assets))
    })
  }
}
\`\`\`

\`compiler.hooks.emit.tap('名字', 回调)\` 就是「在 emit 这个钩子上，注册一个监听」。Tapable 提供多种钩子：\`tap\`（同步）、\`tapAsync\`（异步回调）、\`tapPromise\`（异步 Promise）。HtmlWebpackPlugin 正是在 \`emit\`/资源生成阶段往 \`compilation.assets\` 里加了一个 \`index.html\`。

### 名词解释

**Plugin（插件）**：在构建生命周期的某个钩子上「做事」的扩展点。它能操作整体产物（加文件、改内容、统计），能力比 loader 大得多。

**Tapable**：Webpack 内部基于「发布-订阅」的钩子系统，提供了 SyncHook、AsyncSeriesHook 等钩子类型，是插件机制的底层引擎。

**Hook（钩子）**：构建时间轴上的一个事件节点（如 \`compile\`、\`make\`、\`emit\`、\`done\`），插件通过 \`.tap()\` 把逻辑挂上去。

**Compiler / Compilation**：compiler 是构建全程唯一的「总控」；compilation 是单次编译的「快照」，包含本次的模块、chunk、资源（assets）。

### 课后练习

**练习 1**：loader 和 plugin 的根本区别一句话怎么讲？

> 答案：loader 是「文件级翻译官」，只负责把单个源文件转成 JS 模块；plugin 是「流程级参与者」，能在构建的任意钩子上影响整体产物（增删改文件、读统计）。前者管「内容」，后者管「流程」。

**练习 2**：为什么插件用 \`.tap()\` 而不是普通函数调用注册？

> 答案：因为 Tapable 钩子本质是「监听器列表」。\`.tap(name, fn)\` 把你的函数注册进该钩子的队列，到对应时机 Webpack 会依次调用所有监听器——这是标准的事件订阅模型。

### 总结

插件机制的灵魂就一句话：**Webpack 把构建拆成一条带钩子的时间轴，插件在钩子上 \`.tap\` 自己的逻辑**。compiler 管全局、compilation 管单次编译的 resources，\`HtmlWebpackPlugin\` 之类就是挂在 \`emit\` 阶段往产物里塞 HTML。理解到这一层，下一步写你自己的插件就只是「选对钩子 + 写对逻辑」。这正是下一节的实操主题。`
  },
  {
    id: 'wp-l6',
    chapter: 'plugin',
    title: '写自己的插件（一）：注册钩子并在 emit 阶段生成文件',
    minutes: 35,
    content: `### 本节目标

- 写出一个最小可运行的 Webpack 插件类
- 在 \`emit\`（或 processAssets）阶段往产物里加一个新文件
- 理解 \`compilation.assets\` 就是「最终输出清单」

现在动手。一个 Webpack 插件，就是一个**含有 \`apply(compiler)\` 方法的类**（或对象）。我们在「即将输出文件」的钩子上，往 \`compilation.assets\` 里追加一个文件，就完成了「生成文件」。

下面这个插件会在每次构建后，自动生成一个 \`build-info.txt\`，记录构建时间与入口数量：

\`\`\`js
// my-first-plugin.js
class BuildInfoPlugin {
  apply(compiler) {
    // 推荐用 thisCompilation + processAssets（webpack5 官方推荐写法）
    compiler.hooks.thisCompilation.tap('BuildInfoPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'BuildInfoPlugin',
          // 声明本插件在「优化资产之后、 Seal 之前」执行
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_REPORT,
        },
        () => {
          const info = [
            '构建时间: ' + new Date().toLocaleString(),
            '产物文件数: ' + Object.keys(compilation.assets).length,
          ].join('\\n')

          // 往最终输出清单里加一个文件
          compilation.assets['build-info.txt'] = {
            source: () => info,       // 文件内容
            size: () => info.length,  // 文件大小（字节）
          }
        }
      )
    })
  }
}

module.exports = BuildInfoPlugin
\`\`\`

在配置里用起来：

\`\`\`js
// webpack.config.js
const BuildInfoPlugin = require('./my-first-plugin.js')
module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.js', path: __dirname + '/dist', clean: true },
  plugins: [new BuildInfoPlugin()],
  mode: 'development',
}
\`\`\`

跑 \`npx webpack\`，\`dist/\` 里除了 \`bundle.js\` 还会多一个 \`build-info.txt\`。**关键点**：\`compilation.assets\` 就是「最终要写到磁盘的资源清单」，你往里塞一个 \`{ source, size }\` 对象，它就会被输出成文件。就这么简单。

> 兼容性说明：旧教程常写 \`compiler.hooks.emit.tap(...)\` 直接改 \`compilation.assets\`，webpack4/5 都能跑；但 webpack5 官方更推荐 \`processAssets\`（在资源已生成、尚未封存时操作，更安全可控）。本例用 \`processAssets\`，是「现代正确姿势」。

### 名词解释

**\`apply(compiler)\`**：插件必须实现的方法，Webpack 在初始化插件时调用它，把 \`compiler\` 传进来，你在这里挂钩子。

**\`processAssets\`**：compilation 上的钩子，时机是「所有资产已生成、准备封存输出前」，是往产物里加/改文件的最佳干预点。

**\`compilation.assets\`**：本次构建的「最终资源清单」对象，key 是文件名，value 是带 \`source()\`/\`size()\` 的资源对象。改它就是改产物。

**\`PROCESS_ASSETS_STAGE_*\`**：webpack5 给 processAssets 划分的执行阶段常量（REPORT / OPTIMIZE / SUMMARIZE 等），用来控制插件间的先后。

### 课后练习

**练习 1**：为什么「往 \`compilation.assets\` 加对象」就能生成文件，而不是直接写磁盘？

> 答案：Webpack 是「先收集资产、最后统一写盘」的模型。\`assets\` 是输出前的「清单」，Webpack 写完所有钩子后，才按这份清单把每个资源的 \`source()\` 写到磁盘。你改清单而非直接 IO，既统一又可控（还能被后续插件再加工）。

**练习 2**：\`emit\` 钩子和 \`processAssets\` 都能加文件，选哪个？

> 答案：优先 \`processAssets\`（webpack5 官方推荐，处在「资产已就绪」阶段，语义清晰、可声明 stage 控制顺序）；\`emit\` 也可用且更「老派」，但它在更靠后的时机，部分资产细节已定型，灵活度略低。

### 总结

你的第一个插件已经能「自动生成文件」了。核心套路三步走：**① 写个带 \`apply(compiler)\` 的类；② 在 \`processAssets\` 钩子上 \`.tap\`；③ 往 \`compilation.assets\` 塞 \`{ source, size }\`**。记住 \`assets\` 即「输出清单」这个心智模型，后面所有「加文件/改文件」的魔法都源于此。下一节把它升级成两个实战插件：注入版权 banner、生成依赖清单。`
  },
  {
    id: 'wp-l7',
    chapter: 'plugin',
    title: '写自己的插件（二）：实战——注入 Banner 与生成版本清单',
    minutes: 35,
    content: `### 本节目标

- 写出一个「支持 options 参数」的可配置插件
- 给每个 bundle 顶部注入版权 banner
- 生成一份 \`manifest.json\` 列出所有输出文件与版本号

真实插件几乎都要「可配置」。我们把上一节升级：写一个 \`ReportPlugin\`，接收 \`options\`（如版本号、作者），做两件事——① 在 JS bundle 顶部加 banner；② 生成 \`manifest.json\`。

\`\`\`js
// report-plugin.js
class ReportPlugin {
  // options 由 new ReportPlugin({...}) 传入
  constructor(options = {}) {
    this.version = options.version || '0.0.0'
    this.author = options.author || 'anonymous'
  }

  apply(compiler) {
    const { version, author } = this
    compiler.hooks.thisCompilation.tap('ReportPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ReportPlugin',
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        },
        () => {
          // ① 给每个 .js 文件顶部注入 banner
          for (const filename of Object.keys(compilation.assets)) {
            if (!filename.endsWith('.js')) continue
            const asset = compilation.assets[filename]
            const raw = asset.source().toString()
            const banner = \`/* \${author} · v\${version} · \${new Date().toISOString()} */\\n\`
            // 用新字符串内容覆盖原 asset
            compilation.assets[filename] = {
              source: () => banner + raw,
              size: () => banner.length + raw.length,
            }
          }

          // ② 生成 manifest.json：列出所有产物
          const manifest = {
            version,
            author,
            generatedAt: new Date().toISOString(),
            files: Object.keys(compilation.assets),
          }
          const json = JSON.stringify(manifest, null, 2)
          compilation.assets['manifest.json'] = {
            source: () => json,
            size: () => json.length,
          }
        }
      )
    })
  }
}

module.exports = ReportPlugin
\`\`\`

配置里传入参数：

\`\`\`js
// webpack.config.js
const ReportPlugin = require('./report-plugin.js')
module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.js', path: __dirname + '/dist', clean: true },
  plugins: [
    new ReportPlugin({ version: '1.2.0', author: 'laowen' }),
  ],
  mode: 'production',
}
\`\`\`

跑完你会看到：\`bundle.js\` 第一行为 \`/* laowen · v1.2.0 · ... */\`，\`dist/manifest.json\` 列出了全部产出文件。**这只是一个起点**——你完全可以把「注入 banner」换成「注入环境变量」「按文件名加 hash 校验」「统计每个 chunk 体积」，思路完全一致：在 \`processAssets\` 读 \`asset.source()\`、改完写回 \`assets[文件名]\`。

### 名词解释

**Options（插件参数）**：通过构造函数 \`new Plugin({...})\` 传入的配置对象，让同一个插件在不同项目里表现不同，是插件「可复用」的关键。

**Banner（版权头）**：加到文件顶部的一行注释，常用来声明版权、版本、构建时间。Webpack 官方也有 \`BannerPlugin\`，这里我们亲手实现一遍以理解原理。

**覆盖 Asset（source/asset 替换）**：通过 \`asset.source().toString()\` 读出内容、拼接新内容、再写回 \`compilation.assets[文件名]\`，是「修改已有文件」的标准手法。

**Manifest（清单）**：描述构建产物元信息的文件（本例列出所有输出文件名 + 版本），常用于做「产物指纹」「发布审计」。

### 课后练习

**练习 1**：\`PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE\` 这个 stage 影响什么？

> 答案：它决定「你的插件在 processAssets 队列里的执行先后」。选 OPTIMIZE_INLINE 阶段，表示「在优化内联附近执行」，能保证 banner 注入发生在压缩之前/之间，顺序可预期。多个插件依赖同一资源时，stage 是唯一的排序依据。

**练习 2**：如果我想「统计每个 chunk 的体积并写进 manifest」，逻辑加在哪？

> 答案：同样在 \`processAssets\` 回调里，遍历 \`compilation.assets\`，对每个 \`.js\` 用 \`asset.size()\` 取体积，汇总进 manifest 对象再写入 \`manifest.json\`。核心是「asset 提供 source()/size()，你只管读和写」。

### 总结

你现在拥有了「写生产级插件」的全部骨架：**构造函数收 options → \`apply\` 里挂 \`processAssets\` → 读 \`asset.source()\`、改完写回 \`assets\`**。Banner 注入与 manifest 生成只是两个范例，这套模式能延伸出注入 env、体积分析、产物校验无数玩法。我的建议：写插件前先问「我要干预哪个阶段、改 assets 还是加 assets」——答案清晰了，代码自然就那三行。下一节跳出插件，回到工程全局：代码分割、Tree Shaking 与开发服务器。`
  },
  {
    id: 'wp-l8',
    chapter: 'optimize',
    title: '优化实战：代码分割、Tree Shaking、Dev Server 与生产构建',
    minutes: 35,
    content: `### 本节目标

- 用 \`optimization.splitChunks\` 拆出公共依赖
- 开启 Tree Shaking 去掉没用到的导出
- 配置 \`webpack-dev-server\` 做热更新开发

**代码分割（Code Splitting）**让「不会一起变的代码」分开打包，提升缓存命中。最常见的就是把 \`node_modules\` 里的第三方库单独拆成 \`vendors\` chunk：

\`\`\`js
// webpack.config.js（片段）
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // 对所有 chunk（含异步）做分割
      cacheGroups: {
        vendors: {
          test: /[\\\\/]node_modules[\\\\/]/, // 命中第三方依赖
          name: 'vendors',               // 单独打成一个 vendors.bundle.js
          chunks: 'all',
        },
      },
    },
  },
}
\`\`\`

这样业务代码改动时，\`vendors.bundle.js\`（react 等）因内容不变而文件名不变，浏览器直接读缓存，不用重新下载。

**Tree Shaking** 是「摇掉没被引用的导出」：

\`\`\`js
// math.js 里导出了 add 和 sub，但只用到 add
export function add(a, b) { return a + b }
export function sub(a, b) { return a - b } // 没被 import → 会被摇掉

// main.js
import { add } from './math.js'
console.log(add(1, 2))
\`\`\`

前提是：① 用 ESM（\`import\`/\`export\`）② \`package.json\` 里 \`"sideEffects": false\` ③ \`mode: 'production'\`（开发模式默认不摇）。满足条件后，\`sub\` 不会进最终 bundle。

**开发服务器**让你免手动刷新：

\`\`\`bash
# npm i -D webpack-dev-server
\`\`\`

\`\`\`js
module.exports = {
  devServer: {
    static: './dist',
    port: 3000,
    hot: true,        // 热更新（HMR）
    open: true,       // 自动打开浏览器
  },
}
\`\`\`

跑 \`npx webpack serve\` 即可边改边看。最后，**区分开发与生产**通常用两份配置或 \`mode\` 切换：开发用 \`webpack-dev-server\` + \`mode: 'development'\`，生产用 \`npx webpack\` + \`mode: 'production'\`（自动压缩 + tree-shaking + splitChunks）。

### 名词解释

**代码分割（Code Splitting）**：把代码按「变化频率 / 来源」拆成多个 bundle，让不常变的（如第三方库）能被长期缓存，提升加载性能。

**\`splitChunks\`**：Webpack 的自动拆包配置，\`cacheGroups\` 里用正则把 \`node_modules\` 等归到同一 chunk。

**Tree Shaking（摇树）**：基于 ESM 的静态分析，移除「从未被 import 的导出」，减小 bundle 体积。需 \`sideEffects: false\` + 生产模式。

**HMR（热模块替换）**：改代码后只局部刷新变化的模块，不整页刷新，开发体验飞起。\`devServer.hot: true\` 开启。

### 课后练习

**练习 1**：为什么 Tree Shaking 要求 ESM 而不是 CommonJS？

> 答案：ESM 的 \`import\`/\`export\` 是「静态、可在编译期确定谁引用了谁」；CommonJS 的 \`require()\` 是运行时动态调用，无法静态分析哪些导出被用了。所以摇树只能对 ESM 生效。

**练习 2**：\`splitChunks.chunks: 'all'\` 和 \`'async'\` 区别？

> 答案：\`'async'\` 只分割动态 \`import()\` 的异步 chunk；\`'all'\` 同时覆盖同步入口和异步 chunk，拆包更彻底。多数项目用 \`'all'\` 收益最大。

### 总结

Webpack 优化的三板斧——**splitChunks 拆公共依赖（缓存友好）、Tree Shaking 摇掉死代码（体积友好）、dev-server 热更新（体验友好）**。它们互不冲突，可以一起上：生产构建里 \`splitChunks + mode:production\` 自动带来拆包与摇树，开发时用 \`webpack-dev-server\` 提速。到这里，你从「为什么需要打包器」一路走到「手写插件 + 生产优化」，Webpack 的主干已经打通。下一步建议：挑一个真实小项目，把本课程的 8 节串起来完整跑一遍。`
  }
]

export const webpackPlan = [{'day': 1, 'title': '认识 Webpack：为什么前端需要打包器', 'lessons': ['wp-l1']}, {'day': 2, 'title': '核心概念：entry / output / mode 配置你的第一次构建', 'lessons': ['wp-l2']}, {'day': 3, 'title': '配置文件与常用 Loader：让 Webpack 听懂 TS/CSS', 'lessons': ['wp-l3']}, {'day': 4, 'title': '用 Loader 处理 CSS / 图片 / 资源模块', 'lessons': ['wp-l4']}, {'day': 5, 'title': '插件机制：Tapable、compiler 与 compilation 的生命周期', 'lessons': ['wp-l5']}, {'day': 6, 'title': '写自己的插件（一）：注册钩子并在 emit 阶段生成文件', 'lessons': ['wp-l6']}, {'day': 7, 'title': '写自己的插件（二）：实战——注入 Banner 与生成版本清单', 'lessons': ['wp-l7']}, {'day': 8, 'title': '优化实战：代码分割、Tree Shaking、Dev Server 与生产构建', 'lessons': ['wp-l8']}]
