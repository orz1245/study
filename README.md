# 前端学习网 (study.791860.xyz)

**线上站点：<https://study.791860.xyz/>**

前端学习网是一个专注于前端体系化进阶与面试准备的学习站点，包含 **15 门前端系统课程（共 220 节课时，100% 课时 ≥ 1,800 字）** 与 **14 个技术方向的前端面试题库（共 304 道高频真题，100% 题目 ≥ 950 字且均附可运行代码示例）**。

站点采用**构建期全量静态直出（SSG）+ 原生 JavaScript 小岛（Islands）**架构，无任何运行时前端框架依赖，兼顾首屏秒开体验与搜索引擎抓取友好性，并基于 Cloudflare Pages 与 Cloudflare KV 提供在线留言板服务。

## 目录结构

```text
study/
├── functions/
│   └── api/
│       └── messages.js          # Cloudflare Pages Function 留言板接口（绑定 KV: GUESTBOOK）
├── public/                      # 静态原样拷贝资源
│   ├── islands/                 # 浏览器端按需挂载的原生 JS 交互小岛
│   │   ├── core.js              # 公共工具与本地存储（interview-mastery）管理
│   │   ├── nav-search.js        # 顶部导航栏全局搜索与快捷键（Cmd/Ctrl + K）
│   │   ├── interview.js         # 题库列表筛选、关键词高亮搜索与掌握度标记
│   │   ├── progress.js          # 学习仪表盘统计渲染与进度重置
│   │   ├── guestbook.js         # 留言板列表拉取与表单提交
│   │   ├── code.js              # 代码块一键复制
│   │   └── playground.js        # 悬浮代码演练场（支持 JS 直接运行与 TypeScript 类型自动擦除执行）
│   ├── _headers                 # Cloudflare Pages 响应头、XML MIME 类型与边缘缓存策略
│   ├── _redirects               # 基础静态重写规则（构建期由 ssg.mjs 合并生成 536 条全量 301）
│   ├── robots.txt               # 爬虫抓取规则与 Sitemap 声明
│   └── ...                      # 站点图标、OG 分享图、搜索引擎验证文件与收款码
├── scripts/
│   ├── ssg.mjs                  # 静态站点构建主入口（产出 dist/ 下全部页面、索引与 Sitemap）
│   ├── serve-dist.mjs           # 本地静态产物预览服务器（默认端口 4173）
│   ├── verify-routes.mjs        # 构建产物全量回归校验（559 页 × 5 项 SEO Head、DOM 挂点、死链、Sitemap、301）
│   └── test-islands.mjs         # 原生 JS 小岛零依赖单元测试（共 63 项断言）
├── src/
│   ├── data/                    # 课程与面试题库数据源
│   │   ├── courses/             # 15 门系统课程内容模块（含新增 agent-course.js）
│   │   ├── questions/           # 15 个面试题库分类数据模块（按领域物理对齐归档）
│   │   ├── courses.js           # 课程注册表与源文件路径映射（15 门课程）
│   │   ├── index.js             # 题库模块、分类聚合与源文件路径映射
│   │   ├── slugs.js             # 课程 ID ↔ 语义化 URL Slug 映射（含 agent -> js-agent）
│   │   └── question-slugs.js    # 题目 ID ↔ 语义化 URL Slug 映射（含 304 道题目）
│   ├── ssg/                     # 模块化 SSG 渲染核心
│   │   ├── pages/               # 分模块页面生成器
│   │   │   ├── courses.js       # 课程总览页、课程封面页（含阶段学习计划与题库互链）及课时详情页生成
│   │   │   ├── interview.js     # 题库总览页、分类聚合页（含配套课程互链）与题目详情页生成
│   │   │   └── static-pages.js  # 首页、学习仪表盘、留言板、支持我们、404 页与搜索索引生成
│   │   ├── html.js              # HTML 转义、Markdown 纯文本提取与课后练习样式注入
│   │   ├── jsonld.js            # Schema.org 结构化数据（WebSite / Course / Article / QAPage / ItemList / BreadcrumbList）
│   │   ├── layout.js            # 全局页面外壳（PageShell / 导航栏 / 面包屑 / 演练场 / 内联样式安全校验）
│   │   └── sitemap.js           # 基于源文件修改时间的 Sitemap、Sitemap Index 与 301 重定向生成
│   ├── styles/                  # 全站唯一 CSS 样式真源（构建期内联注入各页面 <style>）
│   │   ├── tokens.css           # 设计变量（色彩、字体、间距）
│   │   ├── shell.css            # 顶部导航、面包屑、布局容器与响应式骨架
│   │   ├── pub.css              # 正文排版、代码块、卡片网格与课程练习样式
│   │   ├── islands.css          # 题库筛选栏、掌握度标记、学习仪表盘与留言板样式
│   │   └── playground.css       # 右下角悬浮代码演练场样式
│   └── utils/
│       ├── course-structure.js  # 课程章节与扁平化课时序号换算
│       ├── markdown.js          # 基于 marked + highlight.js 的确定性代码高亮与 Markdown 渲染
│       ├── seo.js               # 全站各路由 Title / Description / Keywords / Canonical / Robots 单一真源
│       └── urls.js              # 语义化 URL 正向构造与反向解析
├── CONTENT-REVIEW-REPORT.md     # 教程与面试题内容审查及优化落地报告
├── package.json
└── wrangler.toml                # Cloudflare Pages 与 KV 命名空间配置
```

## 快速开始

### 1. 环境要求

- **Node.js**：建议使用 Node.js 20+（或兼容 `node:` 标准内置模块的 Deno 2+）

### 2. 安装依赖

```bash
npm install
```

### 3. 常用命令

| 命令                | 说明                                                                                                                                      |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`   | 执行 `node scripts/ssg.mjs`，在 `dist/` 目录生成全站 **560 个静态文件**（含 559 个 HTML 页、`search-index.json`、`_redirects`、`sitemap.xml` 及 `sitemap-index.xml`） |
| `npm run verify`  | 运行 `verify-routes.mjs`（校验 **559 页 × 5 字段 = 2,795 项** SEO Head、235 页课程与列表正文、524 页代码复制、539 页演练场、全站 0 死链与 536 条 301 规则）及 `test-islands.mjs`（**63 项**小岛交互单测） |
| `npm run test`    | 单独运行 `node scripts/test-islands.mjs` 原生小岛单元测试（题库 15 项 / 仪表盘 5 项 / 留言板 10 项 / 复制按钮 10 项 / 演练场 23 项）                               |
| `npm run check`   | 一键串联执行 `npm run build && npm run verify`（发布前必跑校验）                                                                                       |
| `npm run preview` | 启动本地静态服务器预览 `dist/` 构建产物（默认访问 `http://127.0.0.1:4173`）                                                                                  |

## 架构、SEO 与内容设计要点

- **全量预渲染与按需内联样式**：构建期将 `src/styles/` 下的基础样式直接内联至 HTML `<head>`，消除外部 CSS 阻塞渲染；`islands.css` 与 `playground.css` 仅在用到的页面按需内联，并通过 `assertInlineSafe` 拦截任何可能提前闭合 `<style>` 的标签字面量。
- **单一 SEO 元数据真源与 `ItemList` 结构化数据**：全站所有页面的 `title`、`description`、`keywords`、`canonical` 与 `robots` 均由 `src/utils/seo.js` 统一计算；除详情页的 `Course`、`Article`、`QAPage`、`BreadcrumbList` 外，还在 `/course/`、`/interview/` 与 14 个分类聚合页注入 `ItemList` Schema.org JSON-LD，提升搜索引擎列表富结果展现与子页面发现速度。
- **真实源文件 `<lastmod>` 与双 Sitemap 入口**：基于各课程与题库分类源文件的真实修改时间为 `sitemap.xml` 中的 **558 条 URL** 生成差异化 `<lastmod>` 日期，并同步产出 `sitemap-index.xml`，配合 `public/_headers` 显式声明 `application/xml; charset=utf-8`，解决 Google Search Console 抓取与读取问题。
- **环形轮转内链 + 课程与题库双向互链 + 全站死链拦截**：
  - 题目详情页底部的「同分类其他题目」通过 `pickRelatedQuestions` 采用**标签重合度优先 + 环形偏移轮转**策略，确保每个分类下的所有深层题目都能均匀获得内链权重。
  - 课程封面页（`/course/<slug>/`）自动渲染配套题库分类入口与 `course.plan` 阶段学习计划；题库分类页（`/interview/<cat>/`）自动反向链接至对应的系统教程，形成站内双向权重闭环，并由 `verify-routes.mjs` 对全站 `href="/..."` 执行零死链断言。
- **确定性代码高亮与 TypeScript 演练场支持**：
  - 全站教程与题库代码块均标注明确语言标签（`js`、`ts`、`html`、`css`、`bash`、`json`、`text`），`src/utils/markdown.js` 禁用不稳定的 `highlightAuto` 盲猜，未识别语言统一回退至确定性的 `plaintext`。
  - 浏览器端悬浮演练场 `public/islands/playground.js` 内置轻量级 `stripTsTypes()` 类型剥离器，自动擦除 `interface`、`type`、`as`、`satisfies` 与函数参数/返回值类型注解，支持直接粘贴运行 TypeScript 教程与面试题代码。
- **无软 404（Soft 404）设计**：不配置全量 SPA 回退规则（`/* /index.html 200`），536 条历史旧路径通过 `_redirects` 精确 `301` 永久跳转至新语义化 URL，未知路径直接由 Cloudflare Pages 返回 `dist/404.html` 及真实 `404` 状态码。

## 内容体系概览

- **15 门系统课程（共 220 节课时）**：
  - **《JavaScript 开发 AI Agent》**（`/course/js-agent/`，5 章 15 节）：不调黑盒框架，用原生 JS 从零手写 Agent Loop、SSE 流式半包解析器、Schema 自愈校验器、Function Calling 并发注册表、Stdio MCP（Model Context Protocol）客户端、AST 门禁代码沙箱、ReAct 防死循环引擎、DAG 拓扑并发规划器、Reflexion 单测自愈闭环、Token 预算原子记忆压缩、Float32Array + BM25 RRF 混合检索 RAG、多跳知识图谱、Multi-Agent Handoff 编排、Prompt 注入防御与 HITL 人机协同审批，以及全栈自主研发 Coding Agent。
  - **其余 14 门核心课程**：TypeScript 类型编程（5.x `satisfies` / `const` 泛型）、JS 逆向工程、前端模块化（含 ESM/CJS 双格式包发布与动态 `import()`）、浏览器原理与渲染管线、数据结构与算法、Vibe Coding 实战、JavaScript 底层原理、AST 抽象语法树、手写解释器、富文本编辑器开发（含 OT 与 CRDT 协同编辑算法）、Monorepo 工程架构、Webpack 深度原理、Vite 原理与插件开发、微前端架构。
- **14 个面试题库方向（共 304 道真题）**：涵盖 JavaScript、CSS（含原生嵌套 / `@scope` / `@layer` / `:has()` / View Transitions）、TypeScript、浏览器与网络、前端工程化（Vite / Webpack / Rspack / Rolldown / Oxc）、React（含 React 19 Actions 与 React Compiler）、Vue（含 Vue 3.5 响应式链表重构与 Vapor）、状态管理（Zustand / Jotai / TanStack Query / Immer 原理与手写实现）、Next.js（含 App Router / PPR / Next 15 缓存模型）、Nuxt.js（含 Nitro H3 / Server Islands / 混合渲染）、SSR 与 SSG、微前端、前端算法与 Node.js。

## 部署说明

项目部署于 **Cloudflare Pages**（项目名：`study`，输出目录：`dist`）：

1. **构建与校验**：部署前先在本地执行 `npm run check`，确认全量 560 个静态文件与 63 项小岛单元测试全部通过。
2. **KV 绑定**：留言板接口 `functions/api/messages.js` 依赖 Cloudflare KV 命名空间绑定 `GUESTBOOK`（配置见 `wrangler.toml`）。
3. **发布命令**：
   ```bash
   npx wrangler pages deploy dist --project-name study
   ```
