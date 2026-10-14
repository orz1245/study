# 前端学习网（study.791860.xyz）教程与面试题内容审查及优化深度报告

## 一、 全站内容资产全景与核心诊断结论

[前端学习网](https://study.791860.xyz/)目前构建了一套由 **14 门前端系统课程（共 75 个章节、205 节课时）** 与 **14 个技术方向的前端面试题库（共 289 道题目）** 组成的知识体系，全站通过静态生成（SSG）直出 529 个静态 HTML 页面。通过对 [课程数据源目录](file:///Users/wen/Dev/cloudflare/study/src/data/courses) 与 [题库数据源目录](file:///Users/wen/Dev/cloudflare/study/src/data/questions) 的全量文本扫描、代码块语法树解析、标签重合度比对及教学法审阅，整套内容资产呈&#x73B0;**“底层硬核课程质量极高，但工程化与 AI 课程篇幅偏薄；第一批核心题库详实深入，但第二批扩充题库存在明显缩水与跨文件同题重复”**&#x7684;二元分化特征。

从搜索引擎优化（SEO）与用户深度阅读体验的双重维度审视，当前内容层面的核心矛盾并非基础框架缺失，而是**内容颗粒度不均衡导致的“薄弱页面（Thin Content）”风险**与**历史模块拆分遗留的“同义词内耗（Keyword Cannibalization）”问题**。具体而言，全站 289 道面试题中，早期编写的 167 道核心题目（涵盖 JavaScript、CSS、浏览器工程、模块化与早期框架题）平均字数达 1,812 字符，逻辑严密且代码完备；而后期的 122 道扩充题目（涵盖 SSR/SSG、微前端、Next.js、Nuxt.js、算法、Node.js、工程化构建及新增 React/Vue 题）平均字数骤降至 471 字符，其中 **81 道题目的答案正文不足 500 字符**，31 道题目不足 400 字符，17 道题目完全没有代码块支撑。与此同时，由于早期综合文件 [framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) 中的题目未按分类彻底迁移至独立模块，导致 React、Vue、微前端、SSR 与 Nuxt.js 分类下出现了 **10 组高度重合的“双胞胎题目”**。

| 审查维度          | 系统课程模块（14 门课）                                                                   | 面试题库模块（14 个分类）                                | 综合评估与风险等级                                   |
| :------------ | :------------------------------------------------------------------------------ | :-------------------------------------------- | :------------------------------------------ |
| **内容总量**      | 75 章 · 205 节课时（总计约 46.8 万字符）                                                    | 6 大模块 · 14 个分类 · 289 道题（总计约 35.8 万字符）         | 规模充足，覆盖前端主流知识域                              |
| **单篇平均篇幅**    | 2,283 字符/节（区间：1,004 ～ 8,596 字符）                                                 | 1,239 字符/题（区间：252 ～ 4,318 字符）                 | 题库首尾篇幅相差 **17.1 倍**，方差过大                    |
| **薄弱内容占比**    | 20 节课低于 1,500 字符（占总课时 **9.8%**，集中于 2 门课）                                        | 81 道题低于 500 字符（占总题数 **28.0%**，31 道低于 400 字符）  | **高风险**：短答案独立成页易被 Google 判定为低质薄弱页           |
| **代码示例覆盖率**   | 205 节课 100% 包含代码块（共 862 个代码块）                                                   | 272 道题包含代码块，**17 道题完全无代码块**（共 1,898 个代码块）     | 中风险：部分核心原理题缺乏代码或伪代码佐证                       |
| **代码块无语言标记数** | **442 个代码块**未声明语言（占课程代码块 **51.3%**）                                             | **1,054 个代码块**未声明语言（占题库代码块 **55.5%**）         | 中风险：触发 `highlightAuto` 自动猜测，常导致高亮染色错乱       |
| **内容重复与结构错位** | [JS 模块化课程](https://study.791860.xyz/course/js-modules/) 第七章与第一章演进史重复；2 门课学习计划缺项 | 跨文件存在 **10 组同考点重复题**；3 道题题干缺失上下文              | **高风险**：同分类下双 URL 竞争同一关键词，稀释搜索权重            |
| **难度梯度分布**    | 入门→进阶（9 门）、进阶→核心/造轮子（4 门）、硬核（1 门）                                               | 入门 41 题（14.2%）、中等 206 题（71.3%）、进阶 42 题（14.5%） | 状态管理、Next.js、Nuxt.js 三个分类的 **进阶（Hard）题为 0** |

## 二、 十四门系统课程（205 节）深度审查与优化建议

全站 14 门系统课程在整体体裁上遵循了统一的编辑规范：每一节课均包含正文推导、可复制代码块、`## 总结`（或 `### 总结`）、`## 名词解释` 表格以及 `## 课后练习`（含问题与折叠/引用答案）。这种高度标准化的结构赋予了站点极佳的阅读一致性。然而，深入到各门课程的章节编排、知识深度与代码可运行性时，不同课程之间呈现出显著的梯队落差。

### 2.1 十四门课程量化指标全景对比

通过对 [src/data/courses/](file:///Users/wen/Dev/cloudflare/study/src/data/courses) 下全部 14 个课程模块的逐节扫描，各门课程的章节容量、篇幅分布与薄弱课时统计如下表所示：

| 课程名称与线上入口                                                        | 源文件模块                                                                                                  | 章节数 | 课时数  | 平均字数/节 | 最短课时字数 | 最长课时字数 | 低于 1,500 字课时数 | 质量梯队评级     |
| :--------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :-- | :--- | :----- | :----- | :----- | :------------ | :--------- |
| [AST 实战图解教程](https://study.791860.xyz/course/ast/)               | [ast-pro-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/ast-pro-course.js)         | 5 章 | 10 节 | 4,082  | 3,019  | 7,827  | 0 节           | 第一梯队（标杆级）  |
| [用 JS 手写一门编程语言](https://study.791860.xyz/course/interpreter/)    | [lang-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/lang-course.js)               | 5 章 | 12 节 | 3,606  | 1,615  | 8,596  | 0 节           | 第一梯队（标杆级）  |
| [JS 浏览器原理](https://study.791860.xyz/course/browser/)             | [browser-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/browser-course.js)         | 5 章 | 17 节 | 3,535  | 2,410  | 4,877  | 0 节           | 第一梯队（标杆级）  |
| [JS 手撕底层系统](https://study.791860.xyz/course/js-internals/)       | [advanced-js-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/advanced-js-course.js) | 7 章 | 22 节 | 2,437  | 1,646  | 3,975  | 0 节           | 第一梯队（优良）   |
| [Webpack 打包器实战](https://study.791860.xyz/course/webpack/)        | [webpack-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/webpack-course.js)         | 4 章 | 8 节  | 2,397  | 1,939  | 3,384  | 0 节           | 第二梯队（课时偏少） |
| [JS 数据结构与算法](https://study.791860.xyz/course/data-structures/)   | [dsa-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/dsa-course.js)                 | 8 章 | 26 节 | 2,382  | 1,824  | 3,118  | 0 节           | 第一梯队（优良）   |
| [TypeScript 类型系统入门](https://study.791860.xyz/course/typescript/) | [ts-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/ts-course.js)                   | 6 章 | 20 节 | 2,286  | 1,536  | 4,782  | 0 节           | 第一梯队（优良）   |
| [Monorepo 单体仓库工程实践](https://study.791860.xyz/course/monorepo/)   | [monorepo-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/monorepo-course.js)       | 3 章 | 6 节  | 2,148  | 1,907  | 2,362  | 0 节           | 第二梯队（体量单薄） |
| [Vite 现代前端构建工具](https://study.791860.xyz/course/vite/)           | [vite-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/vite-course.js)               | 4 章 | 8 节  | 2,019  | 1,517  | 2,643  | 0 节           | 第二梯队（课时偏少） |
| [微前端实战](https://study.791860.xyz/course/micro-frontend/)         | [microfe-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/microfe-course.js)         | 4 章 | 8 节  | 2,006  | 1,665  | 2,604  | 0 节           | 第二梯队（课时偏少） |
| [富文本编辑器从零实现](https://study.791860.xyz/course/rich-text-editor/)  | [rte-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/rte-course.js)                 | 5 章 | 12 节 | 1,910  | 1,406  | 2,890  | 1 节           | 第二梯队（后段略简） |
| [JS 逆向基础入门](https://study.791860.xyz/course/js-reverse/)         | [js-reverse-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/js-reverse-course.js)   | 5 章 | 17 节 | 1,773  | 1,543  | 2,176  | 0 节           | 第二梯队（点到即止） |
| [JS 模块化与工程实践](https://study.791860.xyz/course/js-modules/)       | [js-modules-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/js-modules-course.js)   | 7 章 | 23 节 | 1,656  | 1,017  | 2,507  | 5 节           | 第三梯队（结构回潮） |
| [Vibe Coding 实战](https://study.791860.xyz/course/vibe-coding/)   | [vibecoding-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/vibecoding-course.js)   | 6 章 | 16 节 | 1,271  | 1,004  | 1,903  | **14 节**      | 第三梯队（亟待扩充） |

### 2.2 课程内容的核心问题剖析

#### 2.2.1 Vibe Coding 实战课程篇幅过短，停留在概念提纲而非真实工程流

[Vibe Coding 实战](https://study.791860.xyz/course/vibe-coding/) 是全站平均字数最低的课程（平均仅 1,271 字符/节，16 节课中有 14 节不足 1,500 字符）。其中 [第 14 节：把 AI 安全融入研发工作流](https://study.791860.xyz/course/vibe-coding/l14/) 全文仅 1,004 字符，[第 9 节：案例3 · 把报错信息丢给 AI，3 轮迭代修好生产 bug](https://study.791860.xyz/course/vibe-coding/l9/) 仅 1,076 字符，[第 15 节：常见 anti-pattern 与避坑清单](https://study.791860.xyz/course/vibe-coding/l15/) 仅 1,108 字符。审查具体文本可以发现，该课程大量篇幅使用三四行伪对话或简短注释代替真实代码，缺少以下核心工程细节：

- **项目级上下文约束文件缺失**：未深入讲解 `.cursorrules`、`CLAUDE.md`、`AGENTS.md` 的结构化编写范式（如何声明技术栈红线、目录契约、测试回归命令与禁止修改区域）。
- **MCP（Model Context Protocol）与工具链集成空白**：[第 4 节：工具选型地图](https://study.791860.xyz/course/vibe-coding/l4/) 仅作表面对比，未涉及如何通过 MCP 让 AI Agent 直接读取本地数据库 Schema、Git 历史、浏览器控制台日志或运行自动化验证脚本。
- **实战案例代码过度简化**：例如 [第 10 节：用 AI 给遗留代码补单测](https://study.791860.xyz/course/vibe-coding/l10/) 仅展示了最简单的纯函数单测生成，未覆盖前端工程中最棘手的异步请求 Mock、定时器假时钟（Fake Timers）、DOM 状态断言以及边界分支覆盖率提升。

#### 2.2.2 JS 模块化课程章节叙事倒置，首尾章节内容高度重叠

[JS 模块化与工程实践](https://study.791860.xyz/course/js-modules/) 共设 7 章 23 节，但在课程大纲编排上出现了明显的“拼合痕迹”。第一章已经完整讲授了 [第 1 节：为什么需要模块化？从 script 标签说起](https://study.791860.xyz/course/js-modules/l1/)、[第 2 节：模块化发展史：IIFE / AMD / CMD / UMD](https://study.791860.xyz/course/js-modules/l2/) 与 [第 3 节：规范现状：CommonJS 与 ESM](https://study.791860.xyz/course/js-modules/l3/)，并在第六章完成了手写 CommonJS、AMD 与简易 Bundler 的高阶实践；然而第七章却再次退回基础概念，设立了 [第 21 节：模块化演进全景：全局 → 命名空间 → IIFE → 规范](https://study.791860.xyz/course/js-modules/l21/)（仅 1,246 字符）。读者在学完 AST 与打包器实现后，第 21 节却重新演示 `window.count = 0` 全局变量污染与 IIFE 闭包，造成严重的阅读割裂感。

此外，该课程第四章的 [第 13 节：package.json exports 字段：入口与封装](https://study.791860.xyz/course/js-modules/l13/) 全文仅 1,017 字符，是全站第二短的课时。作为现代 npm 包工程化的核心机制，该节仅给出了最基础的 `"."` 与 `"./utils"` 映射示例，完全遗漏了 **TypeScript 类型条件导出顺序陷阱（`"types"` 条件必须写在 `"import"` 和 `"require"` 之前，否则 TS 编译器无法命中类型声明）**、**`package.json` 的 `"imports"` 私有子路径别名（`#internal/*`）**，以及 **`moduleResolution: "node16" / "nodenext" / "bundler"` 对 `exports` 字段的解析差异**。

#### 2.2.3 四大工程化专题课（Monorepo / Webpack / Vite / 微前端）体量偏单薄

相较于动辄 17～26 节的语言与算法课程，工程化方向的四门课程仅设 6～8 节：

- **[Monorepo 单体仓库工程实践](https://study.791860.xyz/course/monorepo/)（6 节）**：目前止步于 `pnpm-workspace.yaml`、Turborepo 基础配置与 Changesets 发包，缺少工业界落地 Monorepo 最核心的三大课题：**Docker 容器化按需裁剪部署（`pnpm deploy` 与 `turbo prune --docker` 的原理与实践）**、**幽灵依赖（Phantom Dependencies）与符号链接隔离机制（`node-linker=isolated` vs `hoisted`）**，以及 **跨包 TypeScript Project References（`composite: true`）增量类型检查优化**。
- **[Vite 现代前端构建工具](https://study.791860.xyz/course/vite/)（8 节）**：[第 1 节：认识 Vite](https://study.791860.xyz/course/vite/l1/)（1,517 字符）与 [第 2 节：核心机制](https://study.791860.xyz/course/vite/l2/) 主要停留在 Vite 2/3 时代的“开发环境 esbuild 预构建 + 生产环境 Rollup 打包”双引擎叙事，未及时跟进 **Vite 6 Environment API** 以及 **Rolldown（基于 Rust 的统一打包器）与 Oxc 编译器取代 esbuild + Rollup 双引擎架构**的最新演进，也缺乏对大规模项目 ESM 瀑布流请求（Network Waterfall）导致首屏卡顿的深度治理方案。
- **[富文本编辑器从零实现](https://study.791860.xyz/course/rich-text-editor/)（12 节）**：前中期关于 `Selection`/`Range`、自研文档模型（Document Model）、事务（Transaction）与 Undo/Redo 历史栈的讲解非常扎实，但 [第 10 节：协同编辑基础：多标签页实时同步](https://study.791860.xyz/course/rich-text-editor/l10/)（仅 1,406 字符）仅用 `BroadcastChannel` 直接广播全量状态，未讲解真实协同编辑的核心算法——**OT（Operational Transformation，操作转换）位置偏移计算**或 **CRDT（Yjs / Automerge 无冲突复制数据类型）**，与课程“从零实现前端核心”的深度定位不匹配。

#### 2.2.4 全部 14 门课的 `plan`（学习计划）与 `practiceCategory` 沦为未渲染的死数据

代码审查发现，[src/data/courses.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses.js) 注册的每一门课程都导出了精心编写的 `plan` 数组（如 `tsPlan`、`brwPlan`、`dsaPlan`），其中包含每节课对应的学习阶段、重点任务与预计耗时，同时 `meta` 对象中定义了 `level`（如 `进阶 → 造轮子`）与 `practiceCategory`（关联的面试题分类 key）。然而，在去除旧版前端框架并切换为纯静态生成（SSG）后：

- 课程封面页（`/course/<slug>/`）与课时页均未展示 `meta.level` 难度定位，也未利用 `meta.practiceCategory` 在课程末尾生成“学完本课后推荐去刷对应的面试题分类”的双向导流入口。
- 14 份 `plan` 数组（合计约 1,200 行源码）在构建期与运行期均未被任何页面读取，且部分课程后续增补课时后未同步更新 `plan`，导致 [JS 浏览器原理](https://study.791860.xyz/course/browser/) 有 17 节课但 `brwPlan` 仅有 16 项、[Vibe Coding 实战](https://study.791860.xyz/course/vibe-coding/) 有 16 节课但 `vibePlan` 仅有 12 项。

## 三、 面试题库（14 个方向 289 题）深度审查与问题清单

面试题库是搜索引擎长尾流量进入站点的核心入口（占全站 Sitemap URL 总数的 **54.8%**）。对 [src/data/questions/](file:///Users/wen/Dev/cloudflare/study/src/data/questions) 下 15 个数据模块的逐题审查表明，题库在“分类容量分布”、“批次间内容深度”、“同义题去重”及“题干可检索性”四个方面存在亟待解决的结构性缺陷。

### 3.1 十四大面试题分类与底层数据源量化体检表

下表展示了全站 14 个面试题分类的题量分布、难度结构、平均篇幅与薄弱题目（正文少于 500 字符或缺失代码块）统计：

| 分类名称与线上入口                                                         | 对应数据模块                                                                                                                                                                                                         | 题量       | 难度分布（入门/中等/进阶）    | 平均字数  | 最短字数    | 低于 500 字题数 | 无代码块题数  | 诊断状态                                                 |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :---------------- | :---- | :------ | :--------- | :------ | :--------------------------------------------------- |
| [JavaScript 核心](https://study.791860.xyz/interview/javascript/)   | [javascript.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/javascript.js) + [js-modules.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/js-modules.js)                            | **65 题** | 6 / 47 / 12       | 1,682 | 703     | 0 题        | 0 题     | 题量过载（含 20 道模块化题），3 道题题干模糊                            |
| [CSS 与布局](https://study.791860.xyz/interview/css/)                | [css.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/css.js)                                                                                                                                     | 32 题     | 6 / 22 / 4        | 1,231 | 612     | 0 题        | 1 题     | 质量稳定，缺现代 CSS 新特性题                                    |
| [React 进阶](https://study.791860.xyz/interview/react/)             | [framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) (18) + [react.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/react.js) (12)                              | 30 题     | 2 / 24 / 4        | 1,216 | 353     | **9 题**    | **4 题** | **严重割裂**：`fw-*` 均字 1,734 vs `react-*` 均字 438，且 4 组重复 |
| [浏览器与网络](https://study.791860.xyz/interview/browser-engineering/) | [browser-engineering.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/browser-engineering.js)                                                                                                     | 27 题     | 1 / 22 / 4        | 2,190 | 759     | 0 题        | 1 题     | 全站质量最高分类之一，图文与代码详实                                   |
| [Vue 进阶](https://study.791860.xyz/interview/vue/)                 | [framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) (12) + [vue.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/vue.js) (13)                                  | 25 题     | 2 / 20 / 3        | 1,182 | 320     | **10 题**   | 1 题     | **严重割裂**：`fw-*` 均字 1,905 vs `vue-*` 均字 515，且 3 组重复   |
| [工程化与构建](https://study.791860.xyz/interview/build/)               | [browser-engineering.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/browser-engineering.js) (4) + [build.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/build.js) (15)           | 19 题     | 2 / 14 / 3        | 846   | 374     | **10 题**   | **3 题** | `build-*` 批次平均仅 460 字，多道题流于表面                        |
| [算法](https://study.791860.xyz/interview/algorithm/)               | [algorithm.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/algorithm.js)                                                                                                                         | 15 题     | 5 / 8 / 2         | 499   | 342     | **8 题**    | 0 题     | 仅给最终代码，缺复杂度推导与边界图解                                   |
| [Node.js](https://study.791860.xyz/interview/nodejs/)             | [nodejs.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/nodejs.js)                                                                                                                               | 15 题     | 5 / 8 / 2         | 514   | 376     | **10 题**   | 0 题     | 答案简短，缺 Node 20/22 现代特性与排查实战                          |
| [TypeScript](https://study.791860.xyz/interview/typescript/)      | [browser-engineering.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/browser-engineering.js) (1) + [typescript.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/typescript.js) (12) | 13 题     | 3 / 7 / 3         | 697   | 376     | **6 题**    | 1 题     | `ts-*` 批次平均仅 486 字，类型体操剖析过浅                          |
| [Next.js](https://study.791860.xyz/interview/nextjs/)             | [nextjs.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/nextjs.js)                                                                                                                               | 12 题     | 3 / 9 / **0**     | 485   | 345     | **7 题**    | 0 题     | **无进阶（Hard）题**，平均 485 字，停留于 Next 13/14 早期概念          |
| [微前端](https://study.791860.xyz/interview/micro-frontend/)         | [framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) (1) + [micro-frontend.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/micro-frontend.js) (11)             | 12 题     | 1 / 8 / 3         | 718   | 296     | **7 题**    | **3 题** | `mf-*` 批次平均仅 414 字，且 `fw-035` 与 `mf-001` 重复          |
| [SSR / SSG 原理](https://study.791860.xyz/interview/ssr-ssg/)       | [framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) (1) + [ssr-ssg.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/ssr-ssg.js) (10)                           | 11 题     | 2 / 7 / 2         | 561   | **252** | **9 题**    | 2 题     | **全站最薄弱分类**：`ssr-*` 10 道题平均仅 388 字                   |
| [Nuxt.js](https://study.791860.xyz/interview/nuxtjs/)             | [framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) (1) + [nuxtjs.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/nuxtjs.js) (8)                              | 9 题      | 3 / 6 / **0**     | 594   | 359     | **8 题**    | 1 题     | **无进阶（Hard）题**，`nuxt-*` 8 道题全部不足 500 字               |
| [状态管理](https://study.791860.xyz/interview/state-management/)      | [framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) (4)                                                                                                                     | **4 题**  | **0** / 4 / **0** | 2,476 | 2,299   | 0 题        | 0 题     | 单题质量高，但**总题量仅 4 道**，无入门与进阶梯度                         |


### 3.2 跨文件同质化重复题目清单（10 组“双胞胎题目”）

由于历史演进过程中，早期编写的 [framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) 包含了 React（18 题）、Vue（12 题）、状态管理（4 题）、SSR（1 题）、Nuxt（1 题）与微前端（1 题），而后期新增 [react.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/react.js)、[vue.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/vue.js)、[micro-frontend.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/micro-frontend.js)、[ssr-ssg.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/ssr-ssg.js) 与 [nuxtjs.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/nuxtjs.js) 时未对存量题目做去重归并，导致同一个分类列表页下同时渲染出两道高度重合的题目。

这不仅让用户在刷题时感到困惑（同一页看到两道几乎一样的题目，且掌握度状态彼此独立），更在 SEO 层面制造了典型的**同义页面内部竞争（Keyword Cannibalization）**——其中旧题（`fw-*`）往往长达 1,600～2,600 字，而新题仅 300～470 字。完整的 10 组重复题目清单及整合方案如下表所示：

| 所属分类          | 存量详实题目（保留主干）                                                                                                                                                                                                              | 后期重复短题（建议合并重定向或改写）                                                                                                                                     | 重合度分析与具体处置建议                                                                                                                                                                            |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 进阶**  | `fw-007` [React Fiber 架构是什么？它解决了什么问题？](https://study.791860.xyz/interview/react/react-fiber-architecture/)（1,630 字，含代码）                                                                                                   | `react-008` [React 的 Fiber 架构与 reconciliation 过程是怎样的？](https://study.791860.xyz/interview/react/fiber-reconciliation/)（353 字，无代码）                      | 两题均讲 Fiber 链表结构与双阶段协调；应将 `react-008` 改写为专讲 **“React 双缓存 Fiber 树（current 与 workInProgress）与 Lanes 优先级位运算模型”** 并补充源码级图解。                                                                  |
| **React 进阶**  | `fw-010` [React 高阶组件（HOC）和 render props 模式是什么？](https://study.791860.xyz/interview/react/hoc-vs-render-props/)（1,563 字，含代码）                                                                                               | `react-011` [HOC、Render Props、自定义 Hook 三种复用模式怎么选？](https://study.791860.xyz/interview/react/hoc-render-props-hook-choice/)（367 字，无代码）                  | `fw-010` 末尾已包含与自定义 Hook 的对比；建议将 `react-011` 彻底重构为 **“Compound Components（复合组件）与 Headless UI 无头组件设计模式实战”**。                                                                              |
| **React 进阶**  | `fw-005` [useMemo 和 useCallback 的区别？](https://study.791860.xyz/interview/react/usememo-vs-usecallback/)（1,651 字）与 `fw-011` [如何避免不必要的重渲染？](https://study.791860.xyz/interview/react/avoid-unnecessary-rerenders/)（2,304 字） | `react-007` [React.memo / useMemo / useCallback 的性能优化有哪些常见误区？](https://study.791860.xyz/interview/react/memo-optimization-pitfalls/)（393 字，无代码）        | `fw-005` 与 `fw-011` 已覆盖缓存失效场景；应为 `react-007` 补齐 **“内联对象/函数导致 React.memo 破功的反例代码”** 以及 **“React 19 Compiler（自动记忆化）如何从编译期消除手写 useMemo”** 的深度解析。                                           |
| **React 进阶**  | `react-010` [React 18 的并发渲染是什么？startTransition 如何使用？](https://study.791860.xyz/interview/react/concurrent-rendering-starttransition/)（479 字）                                                                              | `react-002` [React 18 的并发特性：useTransition 和 useDeferredValue 解决什么问题？](https://study.791860.xyz/interview/react/usetransition-usedeferredvalue/)（357 字） | 两题同在 `react.js` 中，均讲并发过渡更新且篇幅均不足 500 字；应将 `react-010` 定位为 **“并发渲染底层时间切片（MessageChannel 宏任务调度）原理”**，将 `react-002` 定位为 **“useTransition 与 useDeferredValue 实战对比与防抖节流差异”** 并扩充至 1,500 字以上。 |
| **Vue 进阶**    | `fw-018` [Vue3 响应式系统的原理是什么？和 Vue2 有什么区别？](https://study.791860.xyz/interview/vue/vue3-reactivity-vs-vue2/)（2,442 字，含手写实现）                                                                                                 | `vue-009` [Vue2 和 Vue3 的响应式原理有何不同？为什么 Vue3 用 Proxy？](https://study.791860.xyz/interview/vue/vue2-vs-vue3-reactivity/)（476 字）                           | **100% 同题重复**！题干与考点完全一致，且同处 `/interview/vue/` 列表下。建议将 `vue-009` 改写为 **“Vue 3.4+ 响应式重构：基于双向链表与版本计数（Version Counting）的依赖收集优化”**，消除同题冲突。                                                   |
| **Vue 进阶**    | `fw-021` [Vue3 组件通信有哪些方式？](https://study.791860.xyz/interview/vue/vue3-component-communication/)（2,217 字，详列 8 种方式）                                                                                                        | `vue-008` [Vue 组件之间有哪些通信方式？分别适用什么场景？](https://study.791860.xyz/interview/vue/vue-component-communication/)（368 字）                                      | **100% 同题重复**！`vue-008` 仅有 15 行简略文本。建议将 `vue-008` 改写为 **“Vue 3.4+ defineModel 双向绑定宏原理与跨层级状态穿透最佳实践”**。                                                                                   |
| **Vue 进阶**    | `fw-025` [Vue 中自定义指令如何编写？有哪些常用场景？](https://study.791860.xyz/interview/vue/custom-directives/)（2,647 字，含权限/防抖/懒加载完整代码）                                                                                                     | `vue-005` [如何写一个 Vue 自定义指令（directive）？常用钩子有哪些？](https://study.791860.xyz/interview/vue/custom-directive-hooks/)（438 字）                                 | **100% 同题重复**！`fw-025` 已完整包含生命周期钩子与实战案例。建议将 `vue-005` 改写为 **“Vue3 插件机制（app.use）与全局组件/指令自动注册架构设计”**。                                                                                     |
| **微前端**       | `fw-035` [什么是微前端？有哪些实现方案？](https://study.791860.xyz/interview/micro-frontend/micro-frontend-overview/)（2,149 字）                                                                                                           | `mf-001` [什么是微前端？它解决什么问题？](https://study.791860.xyz/interview/micro-frontend/micro-frontend-problem/)（296 字）                                           | 在 `/interview/micro-frontend/` 列表第 1 题和第 2 题连续出现两道“什么是微前端”！建议将 `mf-001` 深化为 **“微前端架构拆分边界与巨石应用渐进式迁移路线图”** 并扩充至 1,500 字以上。                                                                |
| **SSR / SSG** | `fw-032` [什么是 SSR（服务端渲染）？React 中如何实现？](https://study.791860.xyz/interview/ssr-ssg/ssr-in-react/)（2,291 字）                                                                                                                 | `ssr-001` [CSR、SSR、SSG、ISR 分别是什么？如何选型？](https://study.791860.xyz/interview/ssr-ssg/csr-ssr-ssg-isr-comparison/)（524 字）                                 | `fw-032` 包含 CSR vs SSR 对比与 Next.js 实现；建议在 `ssr-001` 中重点补充 **“PPR（Partial Prerendering，部分预渲染）与边缘流式渲染（Edge Streaming）选型决策树”**。                                                            |
| **Nuxt.js**   | `fw-033` [Vue 的 SSR（Nuxt.js）原理和适用场景？](https://study.791860.xyz/interview/nuxtjs/vue-ssr-nuxt/)（1,891 字）                                                                                                                   | `nuxt-001` [Nuxt3 有哪些核心特性？和 Nuxt2 的主要区别？](https://study.791860.xyz/interview/nuxtjs/nuxt3-core-features/)（359 字，无代码）                                   | `nuxt-001` 仅 359 字且无任何代码对比；建议补充 Nuxt 2 Options API（`asyncData`）与 Nuxt 3 Nitro 引擎 + `useAsyncData` + Hybrid Rendering（`routeRules`）的完整代码对照。                                              |

### 3.3 题干语义残缺与搜索不可达问题（3 道“盲盒题”）

在 [javascript.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/javascript.js) 中，存在 3 道“看代码说输出”的经典面试题，其 `question` 字段仅写了泛化指令，而将真正被考查的代码块放在了 `answer` 字段开头：

1. **`js-019`（[以下代码输出什么？解释原因。](https://study.791860.xyz/interview/javascript/predict-code-output/)）**：实际考查的是 **“对象方法、普通函数返回函数、箭头函数与 `.call()` 组合下的 `this` 指向输出分析”**。
2. **`js-025`（[以下代码的输出顺序是什么？解释原因。](https://study.791860.xyz/interview/javascript/async-output-order/)）**：实际考查的是 **“`async/await`、`Promise.then` 与 `setTimeout` 混合的宏任务/微任务事件循环输出顺序”**。
3. **`js-028`（[请分析以下代码的输出结果](https://study.791860.xyz/interview/javascript/code-output-analysis/)）**：实际考查的是 **“`Promise` 构造函数同步执行、链式 `.then` 返回值穿透与 `.catch` 错误捕获输出顺序”**。

这种写法在纯静态站架构下引发了三重负面效应：

- **列表页可读性丧失**：用户在 [JavaScript 面试题列表](https://study.791860.xyz/interview/javascript/) 中看到标题是 `请分析以下代码的输出结果`，摘要（`excerpt`）由于 `mdToText` 剥离了代码块，直接显示出 `输出顺序： p1 constructor p2 constructor start...` 的答案剧透，用户既不知道考什么代码，又在点进去之前直接看到了答案。
- **SEO `<title>` 与 `<h1>` 毫无检索价值**：Google 收录时看到页面标题为 `请分析以下代码的输出结果 - JavaScript面试题及答案`，没有任何用户会在搜索引擎里搜索“请分析以下代码的输出结果”，白白浪费了 3 个优质页面的长尾关键词排名机会。
- **同分类推荐卡片指代不明**：当这 3 道题出现在其他题目的“同分类其他题目”推荐位时，显示为 `› 以下代码输出什么？解释原因。`，缺少明确技术主题。

**修复方案**：将这 3 道题的 `question` 字段改写为包含明确技术考点的标题（例如将 `js-025` 改为 `事件循环经典输出题：async/await、Promise 与 setTimeout 混合执行顺序分析`），并在答案正文中使用 `### 题目代码` 与 `### 执行顺序与逐行解析` 进行结构化分层。

### 3.4 答案单薄（< 400 字）与缺失代码示例的重点题目清单

全站共有 **17 道题目完全不包含任何代码块**，另有 **31 道题目答案总长度不足 400 字符**（仅相当于三四句话的提纲）。在面试实战中，候选人如果只背诵这三四句话而无法写出配置片段、伪代码或说明底层数据结构，极易在追问环节失分；同时这类短页面也是 Google Search Console 中容易滞留于“已发现 - 尚未编入索引”或“已抓取 - 尚未编入索引”的重灾区。

| 题号          | 分类         | 题目名称与线上链接                                                                                                         | 当前字数  | 代码块数 | 核心缺失内容与扩充方向                                                                                                                                                                       |
| :---------- | :--------- | :---------------------------------------------------------------------------------------------------------------- | :---- | :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ssr-005`   | SSR / SSG  | [SSR 对 SEO 和首屏性能有什么帮助？](https://study.791860.xyz/interview/ssr-ssg/ssr-seo-first-screen/)                         | 252 字 | 0 个  | 缺少 CSR 空壳 HTML 与 SSR 直出 HTML 的报文对比、Core Web Vitals（FCP / LCP / TTFB / INP）量化影响分析及流式 SSR（`renderToPipeableStream`）对 TTFB 的改善机制。                                                    |
| `mf-001`    | 微前端        | [什么是微前端？它解决什么问题？](https://study.791860.xyz/interview/micro-frontend/micro-frontend-problem/)                      | 296 字 | 1 个  | 缺少基座（Main App）与微应用（Micro App）的生命周期协议（`bootstrap` / `mount` / `unmount`）代码示例及与 Monorepo 演进路线的对比表。                                                                                  |
| `ssr-010`   | SSR / SSG  | [SSR 的代价和适用边界是什么？什么时候不该用 SSR？](https://study.791860.xyz/interview/ssr-ssg/ssr-tradeoffs/)                         | 300 字 | 0 个  | 缺少服务端内存泄漏排查（模块级单例状态跨请求污染）、Node 端 CPU 密集型序列化瓶颈及高并发下的 CDN 边缘缓存降级（Stale-While-Revalidate / 降级 CSR）代码方案。                                                                              |
| `mf-008`    | 微前端        | [用 iframe 做微前端有什么优缺点？](https://study.791860.xyz/interview/micro-frontend/iframe-pros-cons/)                       | 301 字 | 0 个  | 缺少为什么“无界（wujie）”采用 **WebComponent + iframe 沙箱（JS 跑在同源空白 iframe、DOM 挂在主文档 ShadowRoot）** 破解传统 iframe 弹窗受限与路由丢失的架构图解与代码。                                                             |
| `vue-002`   | Vue 进阶     | [Vue Router 的 history 模式与 hash 模式区别？路由懒加载怎么做？](https://study.791860.xyz/interview/vue/history-vs-hash-lazy-load/) | 320 字 | 1 个  | 缺少 `HTML5 History API`（`pushState` / `replaceState` / `popstate`）最小手写实现，以及 Nginx `try_files $uri $uri/ /index.html;` 与 Cloudflare Pages 404 回退配置示例。                               |
| `mf-010`    | 微前端        | [微前端的部署与版本管理有什么要注意的？](https://study.791860.xyz/interview/micro-frontend/deployment-versioning/)                   | 336 字 | 0 个  | 缺少主应用动态拉取子应用 `manifest.json` 注册表的代码实现、子应用静态资源 `publicPath`（`__webpack_public_path__`）动态注入配置以及灰度回滚策略。                                                                              |
| `vue-010`   | Vue 进阶     | [Vue3 做了哪些编译期/运行时性能优化？](https://study.791860.xyz/interview/vue/vue3-performance-optimizations/)                   | 341 字 | 0 个  | **标记为 Hard 难度却无一行代码**！必须补充一段 Vue 模板编译后的渲染函数产物代码，直观展示 `PatchFlags`（如 `1 /* TEXT */`）、`hoisted` 静态提升变量与 `Block Tree`（`openBlock` / `createElementBlock`）的真实结构。                      |
| `ssr-009`   | SSR / SSG  | [SSR/SSG 应用的静态资源与缓存策略怎么设计？](https://study.791860.xyz/interview/ssr-ssg/static-assets-caching/)                    | 341 字 | 1 个  | 缺少针对 HTML（`s-maxage=60, stale-while-revalidate=86400`）、带 Hash 静态资产（`max-age=31536000, immutable`）与 API 数据的分层响应头完整配置矩阵。                                                            |
| `alg-012`   | 算法         | [爬楼梯：一次可走 1 或 2 阶，n 阶共有多少种走法？](https://study.791860.xyz/interview/algorithm/climbing-stairs-dp/)                  | 342 字 | 1 个  | 缺少从暴力递归（$O(2^n)$）→ 记忆化搜索（$O(n)$ 空间）→ DP 数组 → 滚动变量（$O(1)$ 空间）再到矩阵快速幂（$O(\log n)$）的递进推导与追问变体（如“每次可走 1, 2, ..., m 阶”）。                                                               |
| `next-007`  | Next.js    | [什么是 ISR（增量静态再生）？解决什么问题？](https://study.791860.xyz/interview/nextjs/isr-incremental-static-regeneration/)         | 345 字 | 1 个  | 缺少按需再验证（On-demand Revalidation：`revalidatePath` 与 `revalidateTag` 配合 Webhook 触发缓存精准失效）的代码示例与状态机时序图。                                                                               |
| `react-008` | React 进阶   | [React 的 Fiber 架构与 reconciliation 过程是怎样的？](https://study.791860.xyz/interview/react/fiber-reconciliation/)        | 353 字 | 0 个  | **标记为 Hard 难度却仅 353 字且无代码**！缺少 Fiber 节点核心指针（`child` / `sibling` / `return` / `alternate`）数据结构定义与 `workLoopConcurrent` 深度优先遍历伪代码。                                                  |
| `mf-003`    | 微前端        | [微前端如何做样式隔离（CSS 互不污染）？](https://study.791860.xyz/interview/micro-frontend/style-isolation/)                       | 354 字 | 0 个  | 缺少 qiankun 的 `strictStyleIsolation`（Shadow DOM）与 `experimentalStyleIsolation`（运行时重写 CSSRule 注入 `div[data-qiankun="subApp"]` 前缀）的实现代码及各自对弹窗样式丢失的修复方案。                              |
| `ts-001`    | TypeScript | [TypeScript 相比 JavaScript 有什么优势？什么场景值得上 TS？](https://study.791860.xyz/interview/typescript/ts-vs-js-benefits/)    | 376 字 | 1 个  | 缺少大型重构场景下接口契约变更、可辨识联合类型（Discriminated Unions）穷尽性检查（`never`）拦截线上 Bug 的具体对比案例。                                                                                                      |
| `build-005` | 工程化与构建     | [什么是 HMR（热模块替换）？它的原理是什么？](https://study.791860.xyz/interview/build/hmr-hot-module-replacement/)                   | 374 字 | 1 个  | 缺少 Webpack HMR（基于 JSONP 拉取 `[hash].hot-update.json`）与 Vite HMR（基于原生 ESM `import.meta.hot.accept` 边界冒泡）的机制对比与代码。                                                                   |
| `ts-011`    | TypeScript | [tsconfig.json 中有哪些关键配置？开启 strict 意味着什么？](https://study.791860.xyz/interview/typescript/tsconfig-strict/)         | 441 字 | 0 个  | 全文讨论 `tsconfig.json` 却无一段 JSON 配置代码块；应补充现代前端工程推荐的 `tsconfig.json` 完整注释模板（含 `strict` 家族 8 个子开关、`noUncheckedIndexedAccess`、`moduleResolution: "bundler"` 与 `verbatimModuleSyntax`）。 |


### 3.5 模块归属与分类架构错位分析

审查 [src/data/index.js](file:///Users/wen/Dev/cloudflare/study/src/data/index.js) 与各数据文件内部题目的 `category` 属性，可以发现三处数据组织与前台分类之间的错位：

1. **`js-modules.js`（20 道题）全部挤入 `javascript` 分类，导致首屏分类体量失衡**：  
   [js-modules.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/js-modules.js) 中的 `mod-001` 至 `mod-020`（平均字数高达 2,586 字，涵盖 Tree Shaking、Package Exports、Import Maps、Monorepo Workspace、循环依赖、手写模块加载器等深度内容）其 `category` 字段全部被设为 `'javascript'`。这导致 [JavaScript 核心分类](https://study.791860.xyz/interview/javascript/) 膨胀至 **65 道题**（同时也是 `/interview/` 题库首页默认直出的唯一分类列表），而更契合其中半数题目的 [工程化与构建分类](https://study.791860.xyz/interview/build/) 却只有 19 道题（且 15 道为不足 500 字的短题）。
2. **`browser-engineering.js` 与 `framework.js` 内部混杂了跨分类题目**：  
   [browser-engineering.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/browser-engineering.js) 共 33 道题，其中 27 道属于 `browser-engineering`，但中间夹杂了 4 道 `category: 'build'` 的题目（`be-014` Webpack 构建流程、`be-015` Tree Shaking、`be-016` Vite 为什么快、`be-017` Babel 原理）以及 1 道 `category: 'typescript'` 的题目（`be-018` TypeScript 泛型与工具类型）。同样，[framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js) 内部混放了 `react`、`vue`、`state-management`、`ssr-ssg`、`nuxtjs` 与 `micro-frontend` 六个不同分类的题目。将各题目物理归位到其真实所属的 `src/data/questions/<category>.js` 文件中，不仅能让代码维护更直观，也能让基于文件修改时间的 Sitemap `<lastmod>` 精确到单一分类。
3. **`state-management`（状态管理）分类仅有 4 道题，撑不起独立一级分类**：  
   [状态管理分类](https://study.791860.xyz/interview/state-management/) 目前仅有 `fw-026`（Redux）、`fw-027`（Pinia vs Vuex）、`fw-028`（Zustand）与 `fw-029`（React Context）4 道中等难度题。在现代前端面试中，状态管理早已不局限于 Redux/Pinia 基础用法，亟需补充 **服务端状态管理（TanStack Query / SWR 缓存失效与乐观更新机制）**、**细粒度信号状态（Signals / Jotai / MobX 原子化状态与 Proxy 的对比）**、**跨标签页/持久化状态同步（BroadcastChannel / IndexedDB）** 以及 **手写 30 行极简 Zustand（基于 `useSyncExternalStore` 与发布订阅）** 等 6～8 道高质量题目，使该分类达到 10～12 道题的健康体量。

## 四、 交互体验、代码块高亮与演练场（Playground）协同问题

除纯文本内容外，课程与题库内容在与站点的构建期渲染器（[markdown.js](file:///Users/wen/Dev/cloudflare/study/src/utils/markdown.js)）及客户端交互小岛（[playground.js](file:///Users/wen/Dev/cloudflare/study/public/islands/playground.js)）结合时，存在两项影响阅读与动手实操体验的技术细节：

### 4.1 超过半数代码块缺失语言标识符，引发自动高亮误判

在 [src/utils/markdown.js](file:///Users/wen/Dev/cloudflare/study/src/utils/markdown.js) 中，当 Markdown 代码块围栏（` ``` `）未指定语言（或指定的语言不在 `hljs` 注册表中）时，回退逻辑调用了 `hljs.highlightAuto(code).value`。经统计：

- 14 门课程的 862 个代码块中，有 **442 个（51.3%）** 未写语言标识（直接写了 ` ``` ` 而非 ` ```js ` 或 ` ```text `）。
- 289 道面试题的 1,898 个代码块中，有 **1,054 个（55.5%）** 未写语言标识。

这带来了两个显著副作用：一是 `highlight.js` 的 `highlightAuto` 会遍历所有已注册语言语法规则计算相关性得分，显著拖慢构建速度；二是对于 ASCII 架构流程图、目录树或简短配置片段，`highlightAuto` 常将其误判为 Makefile、Apache、Ruby 或 SQL 语法，从而给中文图解和普通文字套上杂乱的彩色 `<span class="hljs-keyword">` 标签。为所有纯文本流程图显式标上 ` ```text `、为 JS/TS 代码显式标上 ` ```js ` / ` ```ts `，并在 `markdown.js` 中将无语言标识的代码块默认按纯文本或 JS 处理（而非全语言盲猜），可彻底消除图解染色错乱。

### 4.2 右下角“代码演练场（Playground）”与非纯 JS 课程的运行断层

全站所有 14 门课程封面页、205 个课时页及 289 个题目详情页均挂载了右下角悬浮代码演练场（[playground.js](file:///Users/wen/Dev/cloudflare/study/public/islands/playground.js)），其底层执行引擎为浏览器端的 `new Function('console', code)( proxyConsole )`。然而：

- 在 [TypeScript 类型系统入门](https://study.791860.xyz/course/typescript/)（含 71 个 `ts` 代码块）与 [TypeScript 面试题](https://study.791860.xyz/interview/typescript/) 中，读者若将文中的 `interface User { id: number }` 或 `type Pick<T, K extends keyof T> = ...` 粘贴进演练场点击“运行 ▶”，会立即抛出 `SyntaxError: Unexpected identifier 'User'`，因为浏览器原生 `new Function` 不支持 TypeScript 类型注解。
- 在 [Node.js 面试题](https://study.791860.xyz/interview/nodejs/)、[Webpack 打包器实战](https://study.791860.xyz/course/webpack/) 与 [JS 手撕底层系统](https://study.791860.xyz/course/js-internals/) 的部分课时中，代码示例使用了 `const fs = require('fs')` 或 `Buffer.alloc()`，在浏览器端演练场运行会报 `ReferenceError: require is not defined` 或 `Buffer is not defined`。

**优化建议**：

1. 在 [playground.js](file:///Users/wen/Dev/cloudflare/study/public/islands/playground.js) 中增加轻量级预处理与友好错误提示：当捕获到 `SyntaxError` 且检测到代码内含 `interface `、`type `、`: string`、`: number` 等典型 TS 语法时，在演练场控制台给出明确提示（或集成轻量级类型擦除器）；当检测到 `require(`、`process.`、`Buffer` 时，注入最小浏览器端 Polyfill 桩对象（如基于 `Uint8Array` 的轻量 `Buffer` 模拟）或提示该段为 Node.js 服务端环境代码。
2. 在代码块右上角“复制”按钮旁增加一枚 **“送入演练场 ▶”** 快捷按钮（仅对标记为 `js` / `javascript` 的可执行代码块显示），让用户无需手动选中复制粘贴，一键即可将正文里的算法或手写题代码载入右下角演练场运行验证。

## 五、 面向 2025–2026 前沿技术演进的内容增补清单

结合当前（2026 年）前端工程界与大厂面试的真实考情，站内部分课程与题库仍停留在 2022–2023 年的技术水位（例如 React 停留在 React 18 初版、Vue 停留在 Vue 3.2、构建工具停留在 Webpack 5 与 Vite 3/4）。建议在下一阶段重点增补以下高价值前沿内容：

| 技术领域                     | 当前内容水位                                             | 建议新增或升级的 2025–2026 核心考点与课时                                                                                                                                                                                                                                           |
| :----------------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 生态**             | 停留在 React 16 Fiber 与 React 18 `useTransition` 基础概念 | 补充 **React 19 核心特性**：React Compiler（自动记忆化原理及如何替代手写 `useMemo`/`useCallback`）、Actions 与表单状态 Hooks（`useActionState`、`useFormStatus`、`useOptimistic`）、`use()` API 读取 Promise/Context 以及 `ref` 作为普通 Prop（废除 `forwardRef`）。                                                |
| **Vue 生态**               | 停留在 Vue 3.0/3.2 `ref`/`reactive` 与基础 `setup`       | 补充 **Vue 3.4 / 3.5+ 核心演进**：响应式系统基于版本计数的重写优化、Reactive Props Destructure（响应式 Props 解构原生支持）、`defineModel` 宏、`useTemplateRef()`、`useId()`、SSR Lazy Hydration（懒水合）以及 **Vue Vapor Mode（无虚拟 DOM 编译模式）** 原理对比。                                                               |
| **Next.js 与 SSR**        | `nextjs.js` 平均仅 485 字，停留于 App Router 概念罗列          | 补充 **Next.js 15+ 关键变更与深水区**：请求级 API 全面异步化（`await cookies()`、`await headers()`、`await params`）、`fetch` 与 Route Handlers 默认不再强制缓存的策略反转、**PPR（Partial Prerendering 部分预渲染）** 静态外壳 + 动态流式空洞架构、以及 Server Actions 安全校验与闭包变量加密机制。                                            |
| **CSS 与现代 UI**           | 集中于传统 Flex/Grid、BFC、浮动与旧版居中方案                      | 新增现代原生 CSS 高频题：**原生 CSS 嵌套（CSS Nesting）**、**父选择器 `:has()` 实战场景**、**容器查询（`@container` Container Queries）与媒体查询对比**、**层叠层 `@layer`（Cascade Layers）解决样式覆盖冲突**、**View Transitions API 原生视图过渡动画** 以及 `text-wrap: balance / pretty`。                                        |
| **构建与工程化**               | Webpack 5 基础与 Vite 原生 ESM + esbuild 预构建            | 在 [Vite 课程](https://study.791860.xyz/course/vite/) 与 [构建题库](https://study.791860.xyz/interview/build/) 中补充 **Rust 工具链生态与统一打包**：**Rolldown** 如何统一 Vite 开发与生产构建、**Oxc（Oxlint / Oxc Transformer）** 与 Biome 替代 ESLint + Prettier、以及 **Rspack** 在大型存量 Webpack 项目中的平滑迁移实践。 |
| **TypeScript**           | 基础泛型与 `Pick`/`Omit`/`ReturnType` 工具类型              | 在 [TypeScript 题库](https://study.791860.xyz/interview/typescript/) 中补充：`satisfies` 运算符与类型注解的本质区别、模板字面量类型（Template Literal Types）与递归类型体操、TS 5.5+ **自动类型谓词推断（Inferred Type Predicates）** 以及 Monorepo 构建加速利器 `isolatedDeclarations`。                                     |
| **AI 辅助工程（Vibe Coding）** | 16 节简短概念课（平均 1,271 字）                              | 将 [Vibe Coding 实战](https://study.791860.xyz/course/vibe-coding/) 每节扩充至 2,500 字以上，新增 **《项目级 Rules 工程（CLAUDE.md / Cursor Rules）》**、**《MCP（Model Context Protocol）服务器接入与自定义开发》**、**《基于 AST + 测试守护的 AI 大规模重构流水线》** 三个深度实战章节。                                             |

## 六、 分阶段落地优化路线图与结论

为确保内容优化工作在不破坏现有 URL 结构与 SEO 稳定性的前提下高效推进，建议按照 **“P0 止损去重与补强薄弱页 → P1 结构归位与交互打通 → P2 前沿体系扩充”** 三个阶段分步实施：

### 6.1 P0 阶段：消除 SEO 负面信号与修复“盲盒题”（预计 1～2 天）

1. **改写 3 道语义残缺题干（`js-019`、`js-025`、`js-028`）**：在不改变题目 `id` 与 URL Slug（保持现有 URL 不变）的前提下，将题干更新为包含明确考点关键词的完整标题（如 `js-019` 改为 `this 指向代码输出分析：普通函数、箭头函数、返回函数与 call 绑定`），并在答案正文顶部将测试代码块与解析过程分离。
2. **治理 10 组跨文件同质化重复题**：保持 10 道重复短题（`react-008`、`react-011`、`react-007`、`react-002`、`vue-009`、`vue-008`、`vue-005`、`mf-001`、`ssr-001`、`nuxt-001`）的既有 URL 不变，按本报告第三章表 3.2 的差异化选题方向重写其标题与答案正文，使其与 `fw-*` 中的基础题形成“基础概念 vs 进阶源码/新特性实战”的互补关系，彻底消除同分类下的重复感与关键词内耗。
3. **补强 31 道不足 400 字的极短答案与 17 道无代码题目**：优先针对 [SSR / SSG 原理](https://study.791860.xyz/interview/ssr-ssg/)（平均 388 字）、[微前端](https://study.791860.xyz/interview/micro-frontend/)（平均 414 字）、[Nuxt.js](https://study.791860.xyz/interview/nuxtjs/)（平均 432 字）和 [Next.js](https://study.791860.xyz/interview/nextjs/)（平均 485 字）四大薄弱分类，按“核心结论 → 底层机制/架构图解 → 完整代码示例 → 生产环境踩坑与边界权衡”的四段式结构将每道题扩充至 **1,200～1,800 字符**，消除 Google 索引层面的“薄弱内容（Thin Content）”判定。

### 6.2 P1 阶段：课程结构调优、数据激活与演练场增强（预计 2～3 天）

1. **重构 [JS 模块化与工程实践](https://study.791860.xyz/course/js-modules/) 第七章与 `jsm-l13`**：将与第一章重复的 [第 21 节：模块化演进全景](https://study.791860.xyz/course/js-modules/l21/) 升级为 **《双包发布实战：同时支持 ESM 与 CommonJS 的现代 npm 包构建（tsup / unbuild）》**，并将 [第 13 节：package.json exports 字段](https://study.791860.xyz/course/js-modules/l13/) 从 1,017 字扩充至 2,500 字以上（补齐条件导出优先级、`types` 陷阱与 `imports` 子路径映射）。
2. **激活沉没的课程元数据（`plan`、`level`、`practiceCategory`）**：
   - 补齐 `brwPlan`（第 17 节）与 `vibePlan`（第 13～16 节）缺失的计划条目；
   - 在课程封面页（[src/ssg/pages/courses.js](file:///Users/wen/Dev/cloudflare/study/src/ssg/pages/courses.js)）渲染建议学习周期/计划表，并在每门课程最后一节底部利用 `meta.practiceCategory` 自动生成“前往对应面试题分类巩固练习”的内部链接闭环。
3. **补齐代码块语言标记并升级演练场**：通过自动化脚本为全站 1,496 个未标注语言的围栏代码块补齐精确的 `js` / `ts` / `text` / `html` / `json` 标记；在代码块右上角增加“在演练场运行 ▶”按钮，并为演练场增加 TypeScript 类型擦除支持。

### 6.3 P2 阶段：扩充薄弱分类题量与前沿课程内容（持续迭代）

1. **扩充 [Vibe Coding 实战](https://study.791860.xyz/course/vibe-coding/) 与四大工程化课程**：将 `vibe-course` 中 14 节不足 1,500 字的课时全面扩写为包含真实 Prompt 对比、Rules 配置文件与 Agent 调试实录的深度教程；为 [Monorepo 课程](https://study.791860.xyz/course/monorepo/) 增补 Docker 镜像裁剪与 TypeScript Project References 章节。
2. **填补题库容量洼地与高阶（Hard）空白**：将 [状态管理分类](https://study.791860.xyz/interview/state-management/) 从 4 题扩充至 12 题（新增 TanStack Query、Signals、Jotai、手写 Zustand 等），并为 [Next.js](https://study.791860.xyz/interview/nextjs/)、[Nuxt.js](https://study.791860.xyz/interview/nuxtjs/) 与 [状态管理](https://study.791860.xyz/interview/state-management/) 各补充 3～4 道 Hard 难度的架构与源码级题目。

## 七、 参考资料与数据源索引

- **前端学习网线上站点**：[前端学习网首页](https://study.791860.xyz/)、[系统课程总览](https://study.791860.xyz/course/)、[前端面试题库总览](https://study.791860.xyz/interview/)、[站点地图 Sitemap](https://study.791860.xyz/sitemap.xml)
- **课程数据源模块（14 门）**：[courses.js 注册表](file:///Users/wen/Dev/cloudflare/study/src/data/courses.js)、[ts-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/ts-course.js)、[js-reverse-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/js-reverse-course.js)、[js-modules-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/js-modules-course.js)、[browser-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/browser-course.js)、[dsa-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/dsa-course.js)、[vibecoding-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/vibecoding-course.js)、[advanced-js-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/advanced-js-course.js)、[ast-pro-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/ast-pro-course.js)、[lang-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/lang-course.js)、[rte-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/rte-course.js)、[monorepo-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/monorepo-course.js)、[webpack-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/webpack-course.js)、[vite-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/vite-course.js)、[microfe-course.js](file:///Users/wen/Dev/cloudflare/study/src/data/courses/microfe-course.js)
- **面试题库数据源模块（15 个）**：[index.js 题库聚合表](file:///Users/wen/Dev/cloudflare/study/src/data/index.js)、[javascript.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/javascript.js)、[js-modules.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/js-modules.js)、[css.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/css.js)、[framework.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/framework.js)、[browser-engineering.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/browser-engineering.js)、[react.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/react.js)、[vue.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/vue.js)、[typescript.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/typescript.js)、[build.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/build.js)、[nextjs.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/nextjs.js)、[nuxtjs.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/nuxtjs.js)、[ssr-ssg.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/ssr-ssg.js)、[micro-frontend.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/micro-frontend.js)、[algorithm.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/algorithm.js)、[nodejs.js](file:///Users/wen/Dev/cloudflare/study/src/data/questions/nodejs.js)
- **渲染与校验核心模块**：[src/utils/seo.js](file:///Users/wen/Dev/cloudflare/study/src/utils/seo.js)、[src/utils/markdown.js](file:///Users/wen/Dev/cloudflare/study/src/utils/markdown.js)、[public/islands/playground.js](file:///Users/wen/Dev/cloudflare/study/public/islands/playground.js)、[scripts/verify-routes.mjs](file:///Users/wen/Dev/cloudflare/study/scripts/verify-routes.mjs)
