export const cssQuestions = [
  {
    "id": "css-001",
    "category": "css",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "盒模型",
      "box-sizing"
    ],
    "question": "CSS 盒模型有哪些？box-sizing 的作用是什么？",
    "answer": "CSS 盒模型（Box Model）是浏览器计算元素几何尺寸与布局占位的核心基础。每个文档流中的块级或行内块元素都由内向外分为四层：**内容区（Content）→ 内边距（Padding）→ 边框（Border）→ 外边距（Margin）**。\n\n### 一、 标准盒模型 vs IE（替代）盒模型对比\n\n| 盒模型类型 | `box-sizing` 属性值 | `width` / `height` 计算口径 | 实际布局占位总宽度 |\n| :--- | :--- | :--- | :--- |\n| **标准盒模型（默认）** | `content-box` | 仅包含 **Content** 区域 | `width + padding*2 + border*2` |\n| **替代盒模型（IE 盒模型）** | `border-box` | 包含 **Content + Padding + Border** | 直接等于声明的 `width`（内边距与边框向内挤压内容区） |\n\n### 二、 现代工程 Reset 与 DOM 尺寸测量代码\n\n```css\n/* 现代 CSS Reset 最佳实践：全站继承 border-box */\nhtml {\n  box-sizing: border-box;\n}\n*, *::before, *::after {\n  box-sizing: inherit;\n}\n\n.box-content {\n  box-sizing: content-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #333;\n  /* offsetWidth = 200 + 40 + 10 = 250px */\n}\n\n.box-border {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #333;\n  /* offsetWidth = 200px，内部内容可用宽度 = 150px */\n}\n```\n\n```javascript\n// DOM 四大尺寸测量 API 精确对比\nconst el = document.querySelector('.box-border')\nconsole.log(el.clientWidth)              // content + padding（不含 border 和滚动条）\nconsole.log(el.offsetWidth)              // content + padding + border + 滚动条\nconsole.log(el.scrollWidth)              // 含溢出隐藏区域的总滚动内容宽度\nconsole.log(el.getBoundingClientRect())  // 经过 CSS transform 变换后的视口精确浮点矩形\n```"
  },
  {
    "id": "css-002",
    "category": "css",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "选择器",
      "优先级",
      "权重"
    ],
    "question": "CSS 选择器优先级是如何计算的？",
    "answer": "### 优先级权重\n\n从高到低：\n\n| 等级 | 类型 | 权重 | 示例 |\n|------|------|------|------|\n| 1 | `!important` | 最高 | `color: red !important` |\n| 2 | 内联样式 | 1000 | `style=\"color: red\"` |\n| 3 | ID 选择器 | 100 | `#header` |\n| 4 | 类/伪类/属性 | 10 | `.nav`、`:hover`、`[type]` |\n| 5 | 元素/伪元素 | 1 | `div`、`::before` |\n| 6 | 通配符 | 0 | `*` |\n\n### 计算示例\n\n```css\n#nav .item { }        /* 100 + 10 = 110 */\ndiv .item:hover { }    /* 1 + 10 + 10 = 21 */\n#nav > div.item { }    /* 100 + 1 + 10 = 111 */\n```\n\n### 注意事项\n\n1. **权重不可进位**：11 个类选择器（110）依然低于 1 个 ID（100）\n2. **相同权重**：后写的覆盖先写的\n3. **`!important`**：尽量不用，只在覆盖第三方库时使用\n4. **继承的样式**：优先级最低，甚至低于通配符\n\n```css\n* { color: black; }     /* 0 权重 */\ndiv { color: blue; }    /* 1 权重 */\n/* 如果 div 继承了 * 的 color，但 div 自己的 color:blue 生效 */\n```\n\n### 实用技巧\n- 避免使用 ID 选择器（优先级太高，难以覆盖）\n- 使用 CSS 变量代替复杂优先级管理\n- BEM 命名规范可以避免优先级冲突"
  },
  {
    "id": "css-003",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "BFC",
      "块级格式化上下文"
    ],
    "question": "什么是 BFC？如何创建 BFC？有什么应用？",
    "answer": "**BFC**（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素的布局不会影响外部。\n\n### 创建 BFC 的条件\n\n- `float` 不为 `none`\n- `position` 为 `absolute` 或 `fixed`\n- `display` 为 `inline-block`、`flex`、`grid`、`table-cell`、`flow-root` 等\n- `overflow` 不为 `visible`（如 `hidden`、`auto`、`scroll`）\n- 根元素 `<html>` 本身就是 BFC\n\n### BFC 的特性\n\n1. **内部的 Box 垂直方向上一个接一个放置**\n2. **属于同一个 BFC 的两个相邻 Box 的 margin 会发生折叠**\n3. **BFC 区域不会与浮动元素重叠**\n4. **计算 BFC 高度时，浮动元素也参与计算**\n\n### 应用场景\n\n**1. 清除浮动**\n```css\n.container {\n  overflow: hidden; /* 或 display: flow-root; */\n}\n```\n\n**2. 防止 margin 折叠**\n```css\n.parent {\n  overflow: hidden; /* 创建 BFC，阻止子元素 margin 溢出 */\n}\n```\n\n**3. 实现两栏布局（左浮动 + 右 BFC）**\n```css\n.left { float: left; width: 200px; }\n.right { overflow: hidden; /* BFC 不与浮动重叠 */ }\n```\n\n**4. 防止文字环绕浮动元素**\n\n### 推荐方式\n\n`display: flow-root` 是最干净的创建 BFC 方式，没有副作用（不会像 `overflow: hidden` 那样裁剪内容或显示滚动条）。"
  },
  {
    "id": "css-004",
    "category": "css",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "居中",
      "Flex",
      "布局"
    ],
    "question": "如何实现元素水平垂直居中？有哪些方法？",
    "answer": "### 方法 1：Flex（推荐）\n\n```css\n.parent {\n  display: flex;\n  justify-content: center; /* 水平居中 */\n  align-items: center;      /* 垂直居中 */\n}\n```\n\n### 方法 2：Grid\n\n```css\n.parent {\n  display: grid;\n  place-items: center; /* 同时水平垂直居中 */\n}\n```\n\n### 方法 3：绝对定位 + transform\n\n```css\n.child {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n```\n\n### 方法 4：绝对定位 + margin auto\n\n```css\n.child {\n  position: absolute;\n  top: 0; right: 0; bottom: 0; left: 0;\n  margin: auto;\n  width: 200px;   /* 需要固定宽高 */\n  height: 100px;\n}\n```\n\n### 方法 5：绝对定位 + 负 margin\n\n```css\n.child {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 200px;\n  height: 100px;\n  margin-top: -50px;  /* 高度的一半 */\n  margin-left: -100px; /* 宽度的一半 */\n}\n```\n\n### 方法 6：table-cell\n\n```css\n.parent {\n  display: table-cell;\n  text-align: center;\n  vertical-align: middle;\n}\n.child { display: inline-block; }\n```\n\n### 方法 7：line-height（单行文本）\n\n```css\n.parent {\n  text-align: center;\n  line-height: 200px; /* 等于容器高度 */\n}\n```\n\n### 各方法适用场景\n\n| 方法 | 需要固定宽高 | 代码量 | 兼容性 |\n|------|-------------|--------|--------|\n| Flex | ❌ | 少 | IE10+ |\n| Grid | ❌ | 最少 | IE 不支持 |\n| transform | ❌ | 少 | IE9+ |\n| margin auto | ✅ | 中 | 好 |\n| 负 margin | ✅ | 中 | 好 |"
  },
  {
    "id": "css-005",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "position",
      "定位",
      "sticky"
    ],
    "question": "CSS position 的值有哪些？各有什么特点？",
    "answer": "### 五种定位\n\n| 值 | 脱离文档流 | 定位参照 | 适用场景 |\n|------|-----------|----------|----------|\n| `static` | ❌ | 默认流 | 默认值 |\n| `relative` | ❌ | 自身原始位置 | 微调位置 |\n| `absolute` | ✅ | 最近的非 static 祖先 | 脱离文档流定位 |\n| `fixed` | ✅ | 视口 | 固定导航/弹窗 |\n| `sticky` | ❌ | 滚动容器 | 粘性导航 |\n\n### 详细说明\n\n**1. static（默认）**\n- 按照正常文档流排列\n- `top/right/bottom/left/z-index` 无效\n\n**2. relative（相对定位）**\n- 相对自身原始位置偏移\n- 不脱离文档流，原位置保留\n- 常作为 absolute 的定位参照\n\n**3. absolute（绝对定位）**\n- 脱离文档流，原位置不保留\n- 相对最近的**非 static** 祖先元素定位\n- 如果没有非 static 祖先，则相对 `<html>`\n\n**4. fixed（固定定位）**\n- 脱离文档流\n- 相对**浏览器视口**定位\n- 滚动时位置不变\n\n**5. sticky（粘性定位）**（CSS3）\n- 在可见区域内表现为 `relative`\n- 滚动到阈值后表现为 `fixed`\n- 不会脱离文档流\n\n```css\n/* 粘性导航：滚动到顶部时吸顶 */\n.nav {\n  position: sticky;\n  top: 0;\n  z-index: 100;\n}\n```\n\n### z-index 注意事项\n- 只在 `position` 非 static 时有效\n- 同一**层叠上下文**内比较 z-index\n- 创建层叠上下文的条件：position 非 static + z-index 非 auto、opacity < 1、transform 非 none 等\n\n### sticky 的坑\n- 父元素不能有 `overflow: hidden`，否则 sticky 失效\n- 父元素高度不够时 sticky 效果不明显"
  },
  {
    "id": "css-006",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Flex",
      "弹性布局",
      "主轴"
    ],
    "question": "Flex 布局的主轴和交叉轴是什么？常用属性有哪些？",
    "answer": "Flex 布局有两个轴：**主轴**（main axis）和**交叉轴**（cross axis），由 `flex-direction` 决定。\n\n### 容器属性\n\n**flex-direction** — 主轴方向\n```css\nflex-direction: row | row-reverse | column | column-reverse\n```\n\n**justify-content** — 主轴对齐\n```css\njustify-content: flex-start | flex-end | center | space-between | space-around | space-evenly\n```\n\n**align-items** — 交叉轴对齐\n```css\nalign-items: stretch | flex-start | flex-end | center | baseline\n```\n\n**flex-wrap** — 换行\n```css\nflex-wrap: nowrap | wrap | wrap-reverse\n```\n\n**align-content** — 多行对齐（需要 flex-wrap: wrap）\n```css\nalign-content: flex-start | flex-end | center | space-between | stretch\n```\n\n### 项目属性\n\n**flex** — 缩写（flex-grow, flex-shrink, flex-basis）\n```css\nflex: 1;          /* 1 1 0%  → 等比放大缩小 */\nflex: 0 0 200px;  /* 不放大不缩小，固定 200px */\nflex: auto;       /* 1 1 auto */\nflex: none;       /* 0 0 auto → 不伸缩 */\n```\n\n**order** — 排序\n```css\norder: -1;  /* 越小越靠前，默认 0 */\n```\n\n**align-self** — 单独对齐\n```css\nalign-self: center;  /* 覆盖父级的 align-items */\n```\n\n### flex: 1 的含义\n\n```css\nflex: 1;\n/* 等价于 */\nflex-grow: 1;    /* 放大比例：占满剩余空间 */\nflex-shrink: 1;  /* 缩小比例：等比缩小 */\nflex-basis: 0%;  /* 基准大小：不占初始空间 */\n```\n\n### 常见布局\n\n```css\n/* 水平垂直居中 */\n.center { display: flex; justify-content: center; align-items: center; }\n\n/* 两端对齐 */\n.between { display: flex; justify-content: space-between; }\n\n/* 左固定右自适应 */\n.layout { display: flex; }\n.left { flex: 0 0 200px; }\n.right { flex: 1; }\n```"
  },
  {
    "id": "css-007",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Flex",
      "flex-grow",
      "flex-shrink"
    ],
    "question": "flex-grow 和 flex-shrink 是如何计算空间分配的？",
    "answer": "### flex-grow（放大）\n\n当容器有**剩余空间**时，按比例分配。\n\n```css\n.container { display: flex; width: 600px; }\n.item1 { flex-grow: 1; width: 100px; }\n.item2 { flex-grow: 2; width: 100px; }\n.item3 { flex-grow: 1; width: 100px; }\n```\n\n计算过程：\n1. 初始总宽度 = 100 + 100 + 100 = 300px\n2. 剩余空间 = 600 - 300 = 300px\n3. 总份数 = 1 + 2 + 1 = 4\n4. 分配：item1 = 300 × 1/4 = 75px → 最终 175px\n5. item2 = 300 × 2/4 = 150px → 最终 250px\n6. item3 = 300 × 1/4 = 75px → 最终 175px\n\n### flex-shrink（缩小）\n\n当容器**空间不足**时，按比例缩小。\n\n```css\n.container { display: flex; width: 400px; }\n.item1 { flex-shrink: 1; width: 200px; }\n.item2 { flex-shrink: 2; width: 300px; }\n.item3 { flex-shrink: 1; width: 200px; }\n```\n\n计算过程：\n1. 初始总宽度 = 200 + 300 + 200 = 700px\n2. 溢出空间 = 700 - 400 = 300px\n3. 加权总份数 = 1×200 + 2×300 + 1×200 = 1000\n4. item1 缩小 = 300 × (1×200)/1000 = 60px → 最终 140px\n5. item2 缩小 = 300 × (2×300)/1000 = 180px → 最终 120px\n6. item3 缩小 = 300 × (1×200)/1000 = 60px → 最终 140px\n\n### 关键区别\n- **flex-grow** 按 flex-basis 之外的**剩余空间**分配\n- **flex-shrink** 按 **flex-shrink × item-width** 的加权比例缩小（宽度大的缩小更多）\n\n### flex-basis\n设置项目的初始大小，优先级高于 width：\n```css\n.item {\n  flex-basis: 200px;  /* 优先于 width */\n  width: 100px;       /* 被 flex-basis 覆盖 */\n}\n```"
  },
  {
    "id": "css-008",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Flex",
      "面试题",
      "布局"
    ],
    "question": "用 Flex 实现以下布局：三栏布局（左固定200px，中间自适应，右固定150px）",
    "answer": "```css\n.container {\n  display: flex;\n  min-height: 100vh;\n}\n\n.left {\n  flex: 0 0 200px;  /* 不伸缩，固定 200px */\n  background: #f0f0f0;\n}\n\n.main {\n  flex: 1;           /* 占满剩余空间 */\n  background: #fff;\n}\n\n.right {\n  flex: 0 0 150px;  /* 不伸缩，固定 150px */\n  background: #f0f0f0;\n}\n```\n\n```html\n<div class=\"container\">\n  <aside class=\"left\">左侧栏</aside>\n  <main class=\"main\">中间内容</main>\n  <aside class=\"right\">右侧栏</aside>\n</div>\n```\n\n### 进阶：圣杯布局（中间优先加载）\n\n```html\n<!-- HTML 顺序：main 先于 left/right -->\n<div class=\"container\">\n  <main class=\"main\">中间内容</main>\n  <aside class=\"left\">左侧栏</aside>\n  <aside class=\"right\">右侧栏</aside>\n</div>\n```\n\n```css\n.container {\n  display: flex;\n}\n.main { flex: 1; order: 2; }\n.left { flex: 0 0 200px; order: 1; }\n.right { flex: 0 0 150px; order: 3; }\n```\n\n### 其他方案对比\n\n**Grid 方案（更简洁）：**\n```css\n.container {\n  display: grid;\n  grid-template-columns: 200px 1fr 150px;\n}\n```\n\n**float 方案（传统）：**\n```css\n.left { float: left; width: 200px; }\n.right { float: right; width: 150px; }\n.main { margin: 0 150px 0 200px; }\n```"
  },
  {
    "id": "css-009",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Flex",
      "align-items",
      "交叉轴"
    ],
    "question": "Flex 中 align-items 和 align-content 的区别？",
    "answer": "### 区别\n\n| 属性 | 作用对象 | 需要 flex-wrap | 场景 |\n|------|----------|---------------|------|\n| `align-items` | **单行**项目 | ❌ | 控制每行项目在交叉轴的对齐 |\n| `align-content` | **多行**之间的间距 | ✅ 需要 wrap | 控制行与行之间的空间分布 |\n\n### 图示\n\n```text\nalign-items: center（单行）\n┌─────────────────────────┐\n│      ┌──┐ ┌──┐ ┌──┐      │  ← 每个项目垂直居中\n│      │  │ │  │ │  │      │\n│      └──┘ └──┘ └──┘      │\n└─────────────────────────┘\n\nalign-content: space-between（多行）\n┌─────────────────────────┐\n│ ┌──┐ ┌──┐ ┌──┐          │  ← 第一行贴顶\n│ └──┘ └──┘ └──┘          │\n│                          │  ← 空间\n│ ┌──┐ ┌──┐ ┌──┐          │  ← 第二行贴底\n│ └──┘ └──┘ └──┘          │\n└─────────────────────────┘\n```\n\n### 示例\n\n```css\n.container {\n  display: flex;\n  flex-wrap: wrap;        /* 必须换行 */\n  height: 400px;\n  align-items: center;     /* 每行内项目垂直居中 */\n  align-content: space-between;  /* 行间距均匀分布 */\n}\n```\n\n### 注意事项\n- `align-content` 只在 `flex-wrap: wrap` 且有多行时生效\n- 单行时 `align-content` 无效\n- `align-items` 对每一行都生效"
  },
  {
    "id": "css-010",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Flex",
      "gap",
      "间距"
    ],
    "question": "Flex 布局中如何设置项目间距？gap 属性的兼容性如何？",
    "answer": "### gap 属性（推荐）\n\n```css\n.container {\n  display: flex;\n  gap: 16px;              /* 行和列间距都是 16px */\n  /* 或分别设置 */\n  row-gap: 16px;\n  column-gap: 24px;\n}\n```\n\n`gap` 是 `row-gap` 和 `column-gap` 的简写，Flex、Grid 都支持。\n\n### 兼容性\n- Chrome 84+、Firefox 63+、Safari 14.1+\n- IE 完全不支持\n- 现代项目可放心使用\n\n### 替代方案（旧方案）\n\n**1. margin + 负 margin**\n```css\n.container {\n  display: flex;\n  margin: -8px;  /* 抵消最外层多出来的 margin */\n}\n.item {\n  margin: 8px;\n}\n```\n\n**2. margin + last-child / first-child**\n```css\n.item {\n  margin-right: 16px;\n}\n.item:last-child {\n  margin-right: 0;\n}\n```\n\n**3. justify-content: space-between（固定数量）**\n```css\n/* 仅适用于固定数量的项目 */\n.container {\n  display: flex;\n  justify-content: space-between;\n}\n```\n\n**4. 使用选择器**\n```css\n.item + .item {\n  margin-left: 16px;\n}\n```\n\n### 最佳实践\n现代项目直接用 `gap`，简单优雅：\n```css\n.grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px 24px;  /* 行间距 16px，列间距 24px */\n}\n```"
  },
  {
    "id": "css-011",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Grid",
      "网格布局",
      "fr"
    ],
    "question": "CSS Grid 布局的基本概念和常用属性？",
    "answer": "Grid 是二维布局系统，可以同时控制行和列。\n\n### 容器属性\n\n```css\n.grid {\n  display: grid;\n  /* 定义列 */\n  grid-template-columns: 200px 1fr 150px;  /* 固定+自适应+固定 */\n  grid-template-columns: repeat(3, 1fr);    /* 三等分 */\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 自适应列数 */\n\n  /* 定义行 */\n  grid-template-rows: 100px auto 100px;\n\n  /* 间距 */\n  gap: 16px;\n  row-gap: 16px;\n  column-gap: 24px;\n\n  /* 对齐 */\n  justify-items: start | end | center | stretch;  /* 水平 */\n  align-items: start | end | center | stretch;    /* 垂直 */\n  justify-content: center | space-between | ...;  /* 整体水平 */\n  align-content: center | space-between | ...;    /* 整体垂直 */\n}\n```\n\n### 项目属性\n\n```css\n.item {\n  /* 基于线定位 */\n  grid-column: 1 / 3;    /* 从第1条线到第3条线（占2列）*/\n  grid-row: 1 / 2;       /* 占第1行 */\n  \n  /* 跨越 */\n  grid-column: span 2;   /* 跨2列 */\n  \n  /* 区域命名 */\n  grid-area: header;     /* 放在名为 header 的区域 */\n  \n  /* 对齐 */\n  justify-self: center;\n  align-self: center;\n}\n```\n\n### fr 单位\n\n`fr`（fraction）是比例单位：\n```css\ngrid-template-columns: 1fr 2fr 1fr;  /* 1:2:1 比例 */\n```\n\n### repeat 和 auto-fill\n\n```css\n/* 固定3列 */\ngrid-template-columns: repeat(3, 1fr);\n\n/* 自适应：容器足够宽时自动增加列数 */\ngrid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n/* 每列最小200px，空间富余时等比增大 */\n```\n\n### grid-template-areas（命名区域）\n\n```css\n.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: 60px 1fr 40px;\n  grid-template-areas:\n    \"header header\"\n    \"sidebar main\"\n    \"footer footer\";\n}\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main { grid-area: main; }\n.footer { grid-area: footer; }\n```\n\n### Grid vs Flex\n- **Flex**：一维（行或列），适合组件内布局\n- **Grid**：二维（行和列），适合页面整体布局"
  },
  {
    "id": "css-012",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Grid",
      "响应式",
      "auto-fill"
    ],
    "question": "如何用 Grid 实现响应式卡片布局（自动调整列数）？",
    "answer": "```css\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 20px;\n}\n```\n\n### 原理\n\n- `auto-fill`：自动填充尽可能多的列\n- `minmax(280px, 1fr)`：每列最小 280px，最大等分剩余空间\n- 当容器宽度 < 280px 时，自动变为单列\n- 当容器宽度增加时，自动增加列数\n\n### 效果\n```text\n宽屏（1200px）：4列\n┌──┐ ┌──┐ ┌──┐ ┌──┐\n│  │ │  │ │  │ │  │\n└──┘ └──┘ └──┘ └──┘\n\n中屏（800px）：3列\n┌──┐ ┌──┐ ┌──┐\n│  │ │  │ │  │\n└──┘ └──┘ └──┘\n\n窄屏（500px）：1列\n┌──┐\n│  │\n└──┘\n```\n\n### auto-fill vs auto-fit\n\n```css\n/* auto-fill：创建空的网格轨道 */\ngrid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n/* 只有1个卡片时，卡片宽度 = 200px，右侧留空 */\n\n/* auto-fit：拉伸现有项目填满空间 */\ngrid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n/* 只有1个卡片时，卡片拉伸占满整个容器 */\n```\n\n### 完整响应式示例\n\n```css\n.responsive-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));\n  gap: 20px;\n  padding: 20px;\n}\n\n/* min(100%, 280px) 确保在极窄屏幕下不会溢出 */\n```\n\n### 适合场景\n- 产品列表\n- 图片画廊\n- 卡片墙\n- 仪表盘布局"
  },
  {
    "id": "css-013",
    "category": "css",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "Grid",
      "布局",
      "template-areas"
    ],
    "question": "用 Grid 实现一个完整的页面布局（Header/Sidebar/Main/Right/Footer）",
    "answer": "```css\n.layout {\n  display: grid;\n  min-height: 100vh;\n  grid-template-columns: 200px 1fr 250px;\n  grid-template-rows: 60px 1fr 40px;\n  grid-template-areas:\n    \"header  header  header\"\n    \"sidebar main    right\"\n    \"footer  footer  footer\";\n  gap: 1px;\n  background: #e0e0e0; /* gap 颜色作为分割线 */\n}\n\n.header  { grid-area: header;  background: #fff; }\n.sidebar { grid-area: sidebar; background: #fff; }\n.main    { grid-area: main;    background: #fff; }\n.right   { grid-area: right;   background: #fff; }\n.footer  { grid-area: footer;  background: #fff; }\n```\n\n### 响应式调整\n\n```css\n/* 平板：隐藏右侧栏 */\n@media (max-width: 1024px) {\n  .layout {\n    grid-template-columns: 200px 1fr;\n    grid-template-areas:\n      \"header  header\"\n      \"sidebar main\"\n      \"footer  footer\";\n  }\n  .right { display: none; }\n}\n\n/* 手机：单列 */\n@media (max-width: 768px) {\n  .layout {\n    grid-template-columns: 1fr;\n    grid-template-areas:\n      \"header\"\n      \"main\"\n      \"footer\";\n  }\n  .sidebar, .right { display: none; }\n}\n```\n\n### HTML\n\n```html\n<div class=\"layout\">\n  <header class=\"header\">Header</header>\n  <aside class=\"sidebar\">Sidebar</aside>\n  <main class=\"main\">Main Content</main>\n  <aside class=\"right\">Right Panel</aside>\n  <footer class=\"footer\">Footer</footer>\n</div>\n```\n\n### 优势\n- 使用 `grid-template-areas` 布局极其直观\n- 响应式只需修改 grid-template 定义\n- DOM 顺序可以任意排列，通过 grid-area 定位\n- 比传统的 float/flex 实现更简洁"
  },
  {
    "id": "css-014",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Grid",
      "Flex",
      "对比"
    ],
    "question": "Grid 和 Flex 的区别？什么时候用哪个？",
    "answer": "### 核心区别\n\n| 特性 | Flex | Grid |\n|------|------|------|\n| 维度 | **一维**（行或列） | **二维**（行和列） |\n| 设计思路 | 内容优先 | 布局优先 |\n| 适合 | 组件内布局 | 页面整体布局 |\n| 项目排列 | 自动流式排列 | 精确定位到网格 |\n| 重叠 | 不支持 | 支持（z 轴层叠） |\n\n### 什么时候用 Flex\n\n- **导航栏**：水平排列菜单项\n- **按钮组**：一行按钮\n- **卡片内容**：图标+文字+操作\n- **表单行**：标签+输入框\n- **居中**：水平垂直居中最简方案\n\n```css\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\n### 什么时候用 Grid\n\n- **页面骨架**：Header/Sidebar/Main/Footer\n- **图片画廊**：行列网格\n- **表单布局**：标签和输入框对齐\n- **仪表盘**：多区域仪表盘布局\n- **需要行列同时控制**：任何需要二维定位的布局\n\n```css\n.page {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 60px 1fr 40px;\n  grid-template-areas:\n    \"header header\"\n    \"sidebar main\"\n    \"footer footer\";\n}\n```\n\n### 组合使用（最佳实践）\n\n页面用 Grid，组件内用 Flex：\n\n```css\n/* 页面骨架用 Grid */\n.page {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n}\n\n/* 组件内部用 Flex */\n.card {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.card-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\n### 选择原则\n- 需要行列同时控制 → Grid\n- 只需控制一个方向 → Flex\n- 不确定 → 先试 Flex（更简单），不够再换 Grid"
  },
  {
    "id": "css-015",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Grid",
      "span",
      "合并"
    ],
    "question": "Grid 中如何实现跨行跨列（合并单元格）？",
    "answer": "### 方法 1：基于网格线\n\n```css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(3, 100px);\n}\n\n.item-a {\n  grid-column: 1 / 4;  /* 从第1条线到第4条线，跨3列 */\n  grid-row: 1 / 2;     /* 跨1行 */\n}\n\n.item-b {\n  grid-column: 1 / 3;  /* 跨2列 */\n  grid-row: 2 / 4;     /* 跨2行 */\n}\n```\n\n### 方法 2：span 关键字\n\n```css\n.item {\n  grid-column: span 2;   /* 跨2列 */\n  grid-row: span 3;       /* 跨3行 */\n}\n\n/* 也可以指定起始位置 */\n.item {\n  grid-column: 2 / span 2;  /* 从第2条线开始，跨2列 */\n}\n```\n\n### 方法 3：grid-area（简写）\n\n```css\n.item {\n  /* grid-row-start / grid-column-start / grid-row-end / grid-column-end */\n  grid-area: 1 / 1 / 3 / 4;  /* 行1到3，列1到4 */\n}\n```\n\n### 实际示例：仪表盘布局\n\n```css\n.dashboard {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(3, auto);\n  gap: 16px;\n}\n\n.widget-large {\n  grid-column: span 2;\n  grid-row: span 2;\n}\n\n.widget-wide {\n  grid-column: span 2;\n}\n\n.widget-tall {\n  grid-row: span 2;\n}\n\n.widget-normal {\n  /* 默认 1×1 */\n}\n```\n\n```text\n┌──────────┬──────────┬──┐\n│          │          │  │\n│  large   │  wide    ├──┤\n│          ├──────────┤  │\n│          │  │  │    │  │\n├──────────┴──┴───────┴──┘\n```\n\n### 注意事项\n- 网格线编号从 1 开始\n- 也可以用负数从后往前数：`grid-column: -2` 表示倒数第2条线\n- 使用 `span` 更直观，推荐使用"
  },
  {
    "id": "css-016",
    "category": "css",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "响应式",
      "媒体查询",
      "viewport"
    ],
    "question": "如何实现响应式设计？有哪些常用方案？",
    "answer": "### 1. 媒体查询（Media Query）\n\n```css\n/* 基础样式（移动端优先） */\n.container {\n  padding: 16px;\n}\n\n/* 平板 */\n@media (min-width: 768px) {\n  .container {\n    padding: 24px;\n  }\n}\n\n/* 桌面 */\n@media (min-width: 1024px) {\n  .container {\n    padding: 32px;\n    max-width: 1200px;\n  }\n}\n```\n\n### 2. viewport meta 标签\n\n```html\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n```\n\n### 3. 相对单位\n\n```css\n/* rem：相对根字号 */\nhtml { font-size: 16px; }\n.title { font-size: 2rem; }  /* 32px */\n\n/* vw/vh：视口百分比 */\n.hero { height: 100vh; }\n.sidebar { width: 20vw; }\n\n/* clamp()：响应式字号 */\nh1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  /* 最小 1.5rem，理想 4vw，最大 3rem */\n}\n```\n\n### 4. 响应式图片\n\n```css\nimg {\n  max-width: 100%;\n  height: auto;\n}\n\n/* 根据屏幕加载不同图片 */\n<picture>\n  <source media=\"(min-width: 800px)\" srcset=\"large.jpg\">\n  <source media=\"(min-width: 400px)\" srcset=\"medium.jpg\">\n  <img src=\"small.jpg\" alt=\"responsive image\">\n</picture>\n```\n\n### 5. Container Queries（CSS新特性）\n\n```css\n.card-container {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n  }\n}\n```\n\n### 断点建议\n\n```css\n/* 移动端优先策略 */\n/* 手机：默认 < 768px */\n/* 平板：768px - 1024px */\n/* 桌面：> 1024px */\n/* 大屏：> 1440px */\n```\n\n### 最佳实践\n- **移动端优先**：基础样式为移动端，媒体查询逐步增强\n- **使用相对单位**：rem、vw、%、clamp\n- **Grid/Flex 自适应**：结合 auto-fill/auto-fit 减少媒体查询\n- **优先使用 CSS 特性**：min()、max()、clamp() 比媒体查询更流畅"
  },
  {
    "id": "css-017",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "响应式",
      "rem",
      "em",
      "vw"
    ],
    "question": "px、em、rem、vw/vh 的区别？如何选择？",
    "answer": "### 单位对比\n\n| 单位 | 相对于 | 特点 |\n|------|--------|------|\n| `px` | 绝对像素 | 固定不变，不随用户设置缩放 |\n| `em` | 父元素字体大小 | 嵌套时会**累积** |\n| `rem` | 根元素（html）字体大小 | 全局统一，不会累积 |\n| `vw` | 视口宽度的 1% | 随窗口变化 |\n| `vh` | 视口高度的 1% | 随窗口变化 |\n| `%` | 父元素对应属性 | 相对父元素 |\n| `vmin` | vw 和 vh 中较小的 | 取小值 |\n| `vmax` | vw 和 vh 中较大的 | 取大值 |\n\n### em 的累积问题\n\n```css\n.parent { font-size: 20px; }\n.child { font-size: 1.2em; }    /* 24px */\n.grandchild { font-size: 1.2em; } /* 28.8px（相对 child） */\n```\n\n### rem 优势\n\n```css\nhtml { font-size: 16px; }\nh1 { font-size: 2rem; }     /* 32px */\np { font-size: 1rem; }      /* 16px */\n.small { font-size: 0.875rem; } /* 14px */\n```\n\n所有 rem 都相对 html 的 font-size，修改一处即可全局缩放。\n\n### 响应式根字号\n\n```css\n/* 方案 1：媒体查询 */\n@media (max-width: 768px) {\n  html { font-size: 14px; }\n}\n\n/* 方案 2：calc + vw（推荐） */\nhtml {\n  font-size: calc(14px + 0.4vw);\n}\n\n/* 方案 3：clamp */\nhtml {\n  font-size: clamp(14px, 2vw, 18px);\n}\n```\n\n### 选择建议\n\n| 场景 | 推荐单位 |\n|------|----------|\n| 字体大小 | `rem`（统一缩放） |\n| 间距/边距 | `rem` 或 `px` |\n| 容器宽度 | `%` 或 `vw` |\n| 全屏高度 | `vh` 或 `dvh` |\n| 响应式字体 | `clamp()` |\n| 边框 | `px` |\n| 图标大小 | `em`（跟随文字大小） |\n\n### 注意事项\n- 用户可能在浏览器设置中修改默认字号，使用 `rem` 可以尊重用户设置\n- `vh` 在移动端有 100vh 问题（地址栏伸缩），建议用 `dvh`（dynamic viewport height）\n- `px` 不会随用户缩放变化，无障碍性较差"
  },
  {
    "id": "css-018",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "移动端",
      "1px",
      "高清屏"
    ],
    "question": "移动端 1px 边框问题的原因和解决方案？",
    "answer": "### 问题原因\n\n在 Retina 高清屏上，设备像素比（DPR）通常为 2 或 3，CSS 的 1px 实际显示为 2~3 个物理像素，看起来偏粗。\n\n### 解决方案\n\n**1. transform 缩放（推荐）**\n\n```css\n.border-1px {\n  position: relative;\n}\n.border-1px::after {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 200%;\n  height: 200%;\n  border: 1px solid #ccc;\n  border-radius: 4px; /* 如需圆角 */\n  transform: scale(0.5);\n  transform-origin: 0 0;\n  pointer-events: none;\n  box-sizing: border-box;\n}\n\n/* DPR 3 的设备 */\n@media (-webkit-min-device-pixel-ratio: 3) {\n  .border-1px::after {\n    width: 300%;\n    height: 300%;\n    transform: scale(0.333);\n  }\n}\n```\n\n**2. 使用 0.5px（Safari/iOS 支持）**\n\n```css\n.border {\n  border: 0.5px solid #ccc;\n}\n/* 仅 iOS 8+ 和部分现代浏览器支持 */\n```\n\n**3. viewport 缩放**\n\n```javascript\n// 根据 DPR 动态设置 viewport\nconst dpr = window.devicePixelRatio || 1\nconst scale = 1 / dpr\ndocument.querySelector('meta[name=\"viewport\"]')\n  .setAttribute('content', `width=device-width, initial-scale=${scale}, user-scalable=no`)\n```\n\n**4. box-shadow 模拟**\n\n```css\n.border-1px {\n  box-shadow: 0 0 0 0.5px #ccc;\n}\n```\n\n**5. border-image / background-image**\n\n```css\n.border-1px {\n  border-width: 1px;\n  border-image: url('data:image/svg+xml,...') 2 stretch;\n}\n```\n\n### 推荐方案\n- **通用性最强**：transform 缩放（方案 1）\n- **最简单**：0.5px（方案 2，在支持的设备上）\n- **整体缩放**：viewport 缩放（方案 3，适用于所有 1px 问题，但会影响整体布局）"
  },
  {
    "id": "css-019",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "移动端",
      "触摸",
      "适配"
    ],
    "question": "移动端开发有哪些常见的适配问题？",
    "answer": "### 1. 1px 边框问题\n（详见 CSS-018）\n\n### 2. 100vh 问题\n\n移动端浏览器的地址栏伸缩会导致 `100vh` 不准确：\n\n```css\n/* ❌ 旧方案 */\n.fullscreen { height: 100vh; }\n\n/* ✅ 新方案 */\n.fullscreen { height: 100dvh; }  /* dynamic viewport height */\n```\n\n### 3. 点击延迟（300ms）\n\n移动端 click 事件有 300ms 延迟（等待双击缩放判断）：\n\n```html\n<!-- 解决方案：禁用缩放 -->\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\">\n```\n\n### 4. iOS 输入框内阴影\n\n```css\ninput {\n  -webkit-appearance: none;  /* 去除默认样式 */\n  appearance: none;\n}\n```\n\n### 5. iOS 安全区域适配\n\n```css\n/* iPhone X+ 底部安全区 */\n.bottom-bar {\n  padding-bottom: env(safe-area-inset-bottom);\n  /* 或 */\n  padding-bottom: constant(safe-area-inset-bottom); /* iOS < 11.2 */\n  padding-bottom: env(safe-area-inset-bottom);       /* iOS >= 11.2 */\n}\n```\n\n### 6. 文字溢出\n\n```css\n/* 长单词/URL 不换行 */\n.word-break {\n  word-break: break-all;\n  overflow-wrap: break-word;\n}\n\n/* 多行省略 */\n.line-clamp {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n```\n\n### 7. 禁止选中文本/图片\n\n```css\n.no-select {\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none; /* iOS 长按不弹菜单 */\n}\n```\n\n### 8. 软键盘遮挡\n\n```javascript\n// 监听输入框聚焦，滚动到可见区域\ninput.addEventListener('focus', () => {\n  setTimeout(() => {\n    input.scrollIntoView({ behavior: 'smooth' })\n  }, 300)\n})\n```\n\n### 9. 横屏适配\n\n```css\n@media (orientation: landscape) {\n  .layout { flex-direction: row; }\n}\n@media (orientation: portrait) {\n  .layout { flex-direction: column; }\n}\n```\n\n### 10. Retina 图片\n\n```css\n/* 使用 srcset */\n<img src=\"photo.jpg\" srcset=\"photo@2x.jpg 2x, photo@3x.jpg 3x\">\n```"
  },
  {
    "id": "css-020",
    "category": "css",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "transition",
      "过渡",
      "动画"
    ],
    "question": "CSS transition 和 animation 的区别？",
    "answer": "### transition（过渡）\n\n状态变化时平滑过渡，需要**触发条件**（如 :hover、class 切换）。\n\n```css\n.btn {\n  background: blue;\n  transition: background 0.3s ease, transform 0.3s ease;\n}\n.btn:hover {\n  background: red;\n  transform: scale(1.05);\n}\n```\n\n### animation（动画）\n\n自动执行，无需触发，可设循环次数、方向等。\n\n```css\n.loading {\n  animation: spin 1s linear infinite;\n}\n\n@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n```\n\n### 对比\n\n| 特性 | transition | animation |\n|------|-----------|-----------|\n| 触发方式 | 需要状态变化 | 自动执行 |\n| 关键帧 | 只有起止两帧 | 支持 @keyframes 多帧 |\n| 循环 | ❌ | ✅ |\n| 暂停 | ❌ | ✅ `animation-play-state` |\n| 方向 | ❌ | ✅ `alternate` |\n| 适用 | 交互反馈 | 加载动画、持续动画 |\n\n### transition 常用属性\n\n```css\ntransition: property duration timing-function delay;\n/* 例 */\ntransition: all 0.3s ease 0.1s;\ntransition: width 0.3s, height 0.5s ease-in;\n\n/* timing-function */\nease        /* 先快后慢 */\nlinear      /* 匀速 */\nease-in     /* 先慢后快 */\nease-out    /* 先快后慢 */\ncubic-bezier(0.4, 0, 0.2, 1)  /* 自定义贝塞尔曲线 */\n```\n\n### animation 常用属性\n\n```css\nanimation: name duration timing-function delay iteration-count direction fill-mode play-state;\n\n/* 例 */\nanimation: fadeIn 0.5s ease 0s 1 normal forwards;\n\n@keyframes fadeIn {\n  0%   { opacity: 0; transform: translateY(20px); }\n  100% { opacity: 1; transform: translateY(0); }\n}\n```\n\n### 选择建议\n- 悬停/点击反馈 → transition\n- 加载/持续动画 → animation\n- 复杂多帧动画 → animation + @keyframes"
  },
  {
    "id": "css-021",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "动画",
      "性能",
      "transform"
    ],
    "question": "如何实现高性能 CSS 动画？哪些属性会触发重排？",
    "answer": "### 重排（Reflow）vs 重绘（Repaint）vs 合成\n\n| 操作 | 性能 | 属性示例 |\n|------|------|----------|\n| **重排** | 最差 | width、height、margin、top、left |\n| **重绘** | 中等 | color、background、box-shadow |\n| **合成** | 最好 | transform、opacity |\n\n### 高性能动画原则\n\n**只动画 transform 和 opacity**，它们只触发合成层，不引起重排/重绘。\n\n```css\n/* ❌ 差：触发重排 */\n.move {\n  transition: left 0.3s, top 0.3s;\n}\n.move:hover {\n  left: 100px;\n  top: 100px;\n}\n\n/* ✅ 好：只触发合成 */\n.move {\n  transition: transform 0.3s;\n}\n.move:hover {\n  transform: translate(100px, 100px);\n}\n```\n\n### 常见属性性能分级\n\n| 级别 | 属性 |\n|------|------|\n| ✅ 合成层 | `transform`、`opacity`、`filter` |\n| ⚠️ 重绘 | `color`、`background`、`border-color`、`box-shadow` |\n| ❌ 重排 | `width`、`height`、`margin`、`padding`、`top`、`left`、`font-size` |\n\n### will-change 提示浏览器\n\n```css\n.animated {\n  will-change: transform, opacity;\n  /* 提前告知浏览器这些属性会变化，提前优化 */\n}\n\n/* 动画结束后移除 */\n.animated.done {\n  will-change: auto;\n}\n```\n\n### requestAnimationFrame\n\nJS 动画使用 `requestAnimationFrame` 而非 `setInterval`：\n\n```javascript\nfunction animate(element, target) {\n  let current = 0\n  function step() {\n    current += (target - current) * 0.1\n    if (Math.abs(target - current) < 0.1) {\n      element.style.transform = `translateX(${target}px)`\n      return\n    }\n    element.style.transform = `translateX(${current}px)`\n    requestAnimationFrame(step)\n  }\n  requestAnimationFrame(step)\n}\n```\n\n### 最佳实践\n1. **优先 CSS 动画**：比 JS 动画性能好（在合成线程执行）\n2. **只动 transform/opacity**：避免重排\n3. **用 will-change**：对即将动画的元素提前优化\n4. **避免过多动画元素**：每个合成层都消耗内存\n5. **减少同时动画的元素数量**：尤其在低端设备上"
  },
  {
    "id": "css-022",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "动画",
      "keyframes",
      "加载动画"
    ],
    "question": "实现一个常见的加载动画（旋转 + 淡入淡出）",
    "answer": "### 1. 旋转加载（最常见）\n\n```css\n.spinner {\n  width: 40px;\n  height: 40px;\n  border: 4px solid #f3f3f3;\n  border-top: 4px solid #3498db;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n\n@keyframes spin {\n  0%   { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n```\n\n### 2. 三点跳动\n\n```css\n.dots {\n  display: flex;\n  gap: 8px;\n}\n.dots span {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background: #3498db;\n  animation: bounce 1.4s ease-in-out infinite;\n}\n.dots span:nth-child(2) { animation-delay: 0.2s; }\n.dots span:nth-child(3) { animation-delay: 0.4s; }\n\n@keyframes bounce {\n  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }\n  40% { transform: scale(1); opacity: 1; }\n}\n```\n\n### 3. 脉冲效果\n\n```css\n.pulse {\n  width: 40px;\n  height: 40px;\n  background: #3498db;\n  border-radius: 50%;\n  animation: pulse 1.5s ease-in-out infinite;\n}\n\n@keyframes pulse {\n  0%   { transform: scale(0.8); opacity: 1; }\n  50%  { transform: scale(1.2); opacity: 0.5; }\n  100% { transform: scale(0.8); opacity: 1; }\n}\n```\n\n### 4. 骨架屏\n\n```css\n.skeleton {\n  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\n  background-size: 200% 100%;\n  animation: shimmer 1.5s infinite;\n  border-radius: 4px;\n}\n\n@keyframes shimmer {\n  0%   { background-position: 200% 0; }\n  100% { background-position: -200% 0; }\n}\n```\n\n### 5. 淡入上滑\n\n```css\n.fade-in-up {\n  opacity: 0;\n  transform: translateY(20px);\n  animation: fadeInUp 0.6s ease forwards;\n}\n\n@keyframes fadeInUp {\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n/* 逐个延迟出现 */\n.item:nth-child(1) { animation-delay: 0.1s; }\n.item:nth-child(2) { animation-delay: 0.2s; }\n.item:nth-child(3) { animation-delay: 0.3s; }\n```\n\n### 6. prefers-reduced-motion 适配\n\n```css\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n```"
  },
  {
    "id": "css-023",
    "category": "css",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "动画",
      "cubic-bezier",
      "缓动函数"
    ],
    "question": "cubic-bezier 缓动函数的原理是什么？如何自定义？",
    "answer": "`cubic-bezier()` 定义动画的速度曲线，通过两个控制点决定贝塞尔曲线的形状。\n\n### 语法\n\n```css\ntransition-timing-function: cubic-bezier(x1, y1, x2, y2);\n```\n\n- `(x1, y1)`：第一个控制点\n- `(x2, y2)`：第二个控制点\n- 起点固定为 (0, 0)，终点固定为 (1, 1)\n- **x 轴表示时间进度（0~1），y 轴表示动画进度（0~1）**\n- x1 和 x2 必须在 0~1 范围内，y 可以超出（产生回弹效果）\n\n### 内置缓动函数对应\n\n```css\nease        = cubic-bezier(0.25, 0.1, 0.25, 1)\nlinear      = cubic-bezier(0, 0, 1, 1)\nease-in     = cubic-bezier(0.42, 0, 1, 1)\nease-out    = cubic-bezier(0, 0, 0.58, 1)\nease-in-out = cubic-bezier(0.42, 0, 0.58, 1)\n```\n\n### 常用自定义曲线\n\n```css\n/* 弹性效果（轻微回弹） */\n.bounce {\n  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);\n}\n\n/* 苹果风格弹性 */\n.apple-ease {\n  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n\n/* 快速开始，缓慢结束 */\n.quick-start {\n  transition: all 0.3s cubic-bezier(0.1, 0.9, 0.3, 1);\n}\n\n/* Material Design 标准缓动 */\n.material-standard {\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n/* Material 加速缓动 */\n.material-accelerate {\n  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);\n}\n\n/* Material 减速缓动 */\n.material-decelerate {\n  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n```\n\n### y 值超出 [0,1] 的效果\n\n当 y1 或 y2 小于 0 或大于 1 时，动画进度会超出目标值，产生**回弹/弹性**效果：\n\n```css\n/* y1 = -0.55，动画先超过目标再回弹 */\ntransform: translateY(-10px);\ntransition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);\n```\n\n### 调试工具\n- Chrome DevTools → Animations 面板可以可视化调整贝塞尔曲线\n- 在线工具：cubic-bezier.com\n\n### 选择建议\n- **UI 交互反馈**：ease-out（快速响应，缓慢结束）\n- **入场动画**：cubic-bezier(0.34, 1.56, 0.64, 1)（弹性入场）\n- **退场动画**：ease-in（缓慢开始，快速消失）\n- **Material Design**：`cubic-bezier(0.4, 0, 0.2, 1)`"
  },
  {
    "id": "css-024",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "伪类",
      "伪元素",
      "::before"
    ],
    "question": "伪类和伪元素的区别？常见的有哪些？",
    "answer": "### 区别\n\n- **伪类**（:）：选择处于特定**状态**的元素，单冒号\n- **伪元素**（::）：创建不存在于 DOM 的**虚拟元素**，双冒号\n\n### 常见伪类\n\n**交互状态：**\n```css\n:hover          /* 鼠标悬停 */\n:active         /* 点击瞬间 */\n:focus          /* 获得焦点 */\n:focus-visible  /* 键盘获得焦点（区分鼠标/键盘） */\n:visited        /* 已访问的链接 */\n```\n\n**结构选择：**\n```css\n:first-child     /* 第一个子元素 */\n:last-child      /* 最后一个子元素 */\n:nth-child(n)    /* 第 n 个 */\n:nth-child(odd)  /* 奇数 */\n:nth-child(even) /* 偶数 */\n:nth-of-type(n)  /* 同类型第 n 个 */\n:only-child      /* 唯一子元素 */\n:not(selector)   /* 不匹配的 */\n:empty           /* 没有子元素 */\n```\n\n**表单伪类：**\n```css\n:checked     /* 选中的复选框/单选 */\n:disabled    /* 禁用的表单元素 */\n:valid       /* 通过验证 */\n:invalid     /* 未通过验证 */\n:placeholder-shown /* 正在显示 placeholder */\n```\n\n### 常见伪元素\n\n```css\n::before     /* 元素内容前插入 */\n::after      /* 元素内容后插入 */\n::first-letter /* 首字母 */\n::first-line   /* 首行 */\n::selection    /* 选中的文字 */\n::placeholder  /* placeholder 样式 */\n::marker       /* 列表标记 */\n```\n\n### ::before / ::after 使用示例\n\n```css\n/* 清除浮动 */\n.clearfix::after {\n  content: '';\n  display: block;\n  clear: both;\n}\n\n/* 自定义引号 */\n.quote::before { content: '“'; }  /* 左引号 */\n.quote::after  { content: '”'; }  /* 右引号 */\n\n/* 工具提示 */\n.tooltip::after {\n  content: attr(data-tooltip);\n  position: absolute;\n  background: black;\n  color: white;\n  padding: 4px 8px;\n  border-radius: 4px;\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n.tooltip:hover::after { opacity: 1; }\n\n/* 装饰性图标 */\n.icon::before {\n  content: '';\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n  background: url('icon.svg');\n}\n```\n\n### 关键点\n- 伪元素必须设置 `content` 属性才能显示\n- 伪元素默认是 `inline`，可修改 `display`\n- 伪类选择的是真实存在的元素，伪元素创建的是虚拟元素\n- CSS3 规范伪元素用双冒号 `::`，但浏览器也兼容单冒号"
  },
  {
    "id": "css-025",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "CSS变量",
      "自定义属性",
      "主题"
    ],
    "question": "CSS 自定义属性（CSS 变量）的用法和优势？",
    "answer": "### 基本用法\n\n```css\n:root {\n  --primary-color: #4f46e5;\n  --text-size: 16px;\n  --spacing: 1rem;\n}\n\n.button {\n  background: var(--primary-color);\n  font-size: var(--text-size);\n  padding: var(--spacing);\n}\n\n/* 带回退值 */\n.text { color: var(--undefined-var, #333); }\n```\n\n### 优势（vs Sass/Less 变量）\n\n| 特性 | CSS 变量 | Sass/Less 变量 |\n|------|----------|----------------|\n| 运行时修改 | ✅ | ❌ 编译后固定 |\n| JS 读写 | ✅ | ❌ |\n| 作用域 | DOM 层级 | 文件层级 |\n| 媒体查询内修改 | ✅ | ❌ |\n| 继承 | ✅ | ❌ |\n\n### JS 操作 CSS 变量\n\n```javascript\n// 读取\nconst color = getComputedStyle(document.documentElement)\n  .getPropertyValue('--primary-color')\n\n// 设置\ndocument.documentElement.style.setProperty('--primary-color', '#ff0000')\n```\n\n### 主题切换\n\n```css\n:root {\n  --bg: #ffffff;\n  --text: #1a1a1a;\n  --border: #e0e0e0;\n}\n\n[data-theme=\"dark\"] {\n  --bg: #1a1a1a;\n  --text: #ffffff;\n  --border: #333333;\n}\n\nbody {\n  background: var(--bg);\n  color: var(--text);\n}\n```\n\n```javascript\n// 切换主题\nfunction toggleTheme() {\n  const current = document.documentElement.dataset.theme\n  document.documentElement.dataset.theme = current === 'dark' ? 'light' : 'dark'\n}\n```\n\n### 响应式调整\n\n```css\n:root {\n  --font-size: 16px;\n}\n\n@media (max-width: 768px) {\n  :root {\n    --font-size: 14px;\n  }\n}\n\n/* 所有使用 var(--font-size) 的地方自动响应 */\n```\n\n### 组件级作用域\n\n```css\n.card {\n  --card-padding: 16px;\n  --card-bg: #fff;\n  padding: var(--card-padding);\n  background: var(--card-bg);\n}\n\n.card--highlight {\n  --card-bg: #fffbeb;  /* 仅影响此组件 */\n}\n```\n\n### 注意事项\n- 变量名大小写敏感：`--color` 和 `--Color` 不同\n- 不能用于属性名，只能用于值\n- 空格处理：`--shadow: 0 2px 4px rgba(0,0,0,.1)` 正确"
  },
  {
    "id": "css-026",
    "category": "css",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "BFC",
      "IFC",
      "格式化上下文"
    ],
    "question": "BFC、IFC、FFC、GFC 分别是什么？",
    "answer": "CSS 中有四种格式化上下文（Formatting Context）：\n\n### BFC — 块级格式化上下文\n\n**Block Formatting Context**\n\n- 块级盒子参与布局的上下文\n- 内部盒子垂直排列\n- 相邻 BFC 的 margin 不重叠\n- BFC 不与浮动重叠\n\n**触发条件：**\n```css\noverflow: hidden | auto | scroll;\ndisplay: flex | grid | inline-block | table-cell | flow-root;\nposition: absolute | fixed;\nfloat: left | right;\n```\n\n### IFC — 行内格式化上下文\n\n**Inline Formatting Context**\n\n- 行内级盒子参与布局的上下文\n- 内部盒子水平排列\n- 行内盒子会自动换行\n\n**触发条件：** 块级容器中只包含行内级元素时自动创建。\n\n```css\n/* IFC 的常见现象 */\n.text-container {\n  /* 默认就是 IFC */\n  /* 行内元素水平排列，高度由 line-height 决定 */\n}\n```\n\n**应用：**\n- 文本垂直对齐：`vertical-align` 只在 IFC 中生效\n- 行内元素居中：`text-align: center` 对行内元素生效\n\n### FFC — 弹性格式化上下文\n\n**Flex Formatting Context**\n\n- `display: flex` 或 `display: inline-flex` 创建\n- 子元素成为 flex item\n- 弹性盒子参与布局\n\n### GFC — 网格格式化上下文\n\n**Grid Formatting Context**\n\n- `display: grid` 或 `display: inline-grid` 创建\n- 子元素成为 grid item\n- 网格项目参与布局\n\n### 对比总结\n\n| 类型 | 触发 | 排列方式 | 典型应用 |\n|------|------|----------|----------|\n| BFC | overflow/flex 等 | 垂直 | 清除浮动、margin 折叠 |\n| IFC | 默认（行内内容） | 水平 | 文本对齐 |\n| FFC | display: flex | 弹性 | 一维布局 |\n| GFC | display: grid | 网格 | 二维布局 |\n\n### 其他上下文\n\n- **脱离正常流**：`position: absolute/fixed` 创建的上下文\n- **层叠上下文**（Stacking Context）：z-index 生效的上下文\n\n```css\n/* 创建层叠上下文 */\n.element {\n  position: relative;\n  z-index: 1;  /* 非 auto */\n}\n/* 或 */\n.element {\n  opacity: 0.9;\n  transform: translateZ(0);\n  filter: blur(0);\n}\n```"
  },
  {
    "id": "css-027",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "margin",
      "折叠",
      "间距"
    ],
    "question": "margin 折叠（合并）的规则是什么？如何避免？",
    "answer": "### margin 折叠规则\n\n相邻的**垂直方向** margin 会合并（取较大值），**水平方向**不折叠。\n\n### 三种折叠场景\n\n**1. 相邻兄弟元素**\n```css\n.box1 { margin-bottom: 20px; }\n.box2 { margin-top: 30px; }\n/* 间距 = max(20, 30) = 30px，不是 50px */\n```\n\n**2. 父元素与第一个/最后一个子元素**\n```css\n.parent { margin-top: 20px; }\n.child { margin-top: 30px; }\n/* parent 的上 margin = max(20, 30) = 30px */\n```\n\n**3. 空块元素自身的上下 margin**\n```css\n.empty {\n  margin-top: 20px;\n  margin-bottom: 30px;\n  /* 如果没有内容、padding、border，上下 margin 合并为 30px */\n}\n```\n\n### 折叠条件\n- 都是**块级元素**（非浮动、非绝对定位）\n- 在**正常的文档流**中\n- 在**垂直方向**上相邻\n\n### 如何避免\n\n**1. 父元素创建 BFC**\n```css\n.parent {\n  overflow: hidden;\n  /* 或 display: flow-root; */\n}\n```\n\n**2. 添加 border 或 padding**\n```css\n.parent {\n  border-top: 1px solid transparent;\n  /* 或 */\n  padding-top: 1px;\n}\n```\n\n**3. 使用 Flex/Grid 布局**\n```css\n.parent {\n  display: flex;\n  flex-direction: column;\n}\n/* Flex/Grid 中不存在 margin 折叠 */\n```\n\n**4. 使用 gap 代替 margin**\n```css\n.parent {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n```\n\n**5. 浮动或绝对定位**\n```css\n.child {\n  float: left;\n  /* 或 position: absolute; */\n  /* 浮动/绝对定位元素不参与 margin 折叠 */\n}\n```\n\n### 负 margin 折叠\n```css\n.box1 { margin-bottom: 20px; }\n.box2 { margin-top: -10px; }\n/* 间距 = 20 + (-10) = 10px（正负取和） */\n\n.box1 { margin-bottom: -20px; }\n.box2 { margin-top: -10px; }\n/* 间距 = min(-20, -10) = -20px（都是负值取绝对值较大的） */\n```"
  },
  {
    "id": "css-028",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "层叠上下文",
      "z-index",
      "层级"
    ],
    "question": "什么是层叠上下文？z-index 的层叠规则是什么？",
    "answer": "**层叠上下文**（Stacking Context）是 CSS 中决定元素在 z 轴上渲染顺序的概念。\n\n### 创建层叠上下文的条件\n\n1. **根元素** `<html>`（天然是层叠上下文）\n2. **position** 非 static + **z-index** 非 auto\n3. **opacity** < 1\n4. **transform** 非 none\n5. **filter** 非 none\n6. **will-change** 设为上述属性\n7. **isolation: isolate**\n8. **mix-blend-mode** 非 normal\n9. `display: flex/grid` 子项 + z-index 非 auto\n\n### 层叠顺序（从低到高）\n\n```text\n1. 层叠上下文的背景和边框\n2. 负 z-index\n3. 块级盒子（正常流）\n4. 浮动盒子\n5. 行内盒子（正常流）\n6. z-index: 0 / auto\n7. 正 z-index\n```\n\n### 关键规则\n\n**z-index 只在同一层叠上下文内比较！**\n\n```html\n<div style=\"position:relative; z-index:1\">\n  <div style=\"position:relative; z-index:9999\">A</div>\n</div>\n<div style=\"position:relative; z-index:2\">\n  <div style=\"position:relative; z-index:1\">B</div>\n</div>\n```\n\n- 父1 (z-index:1) vs 父2 (z-index:2) → 父2 在上\n- 虽然 A 的 z-index:9999 很大，但它只在父1内部生效\n- **B 在 A 之上**（因为父2 > 父1）\n\n### 常见问题\n\n**1. 弹窗被遮挡**\n```css\n/* 如果父元素创建了层叠上下文，子元素的 z-index 再大也出不去 */\n.parent {\n  transform: translateZ(0);  /* 创建了层叠上下文 */\n  z-index: 1;\n}\n.modal {\n  z-index: 9999;  /* 只在 parent 内部有效 */\n}\n```\n\n**2. 解决方案**\n- 将弹窗移到父元素外面（Portal）\n- 移除父元素创建层叠上下文的属性\n- 提升父元素的 z-index\n\n### 调试技巧\n- Chrome DevTools → Elements 面板可查看层叠上下文\n- 避免滥用 z-index，用 DOM 顺序和 flex/grid 的 order 代替"
  },
  {
    "id": "css-029",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "清除浮动",
      "float",
      "布局"
    ],
    "question": "为什么需要清除浮动？有哪些清除浮动的方法？",
    "answer": "### 问题原因\n\n子元素设置 `float` 后脱离文档流，父元素高度不会包含浮动子元素，导致父元素高度塌陷。\n\n```css\n/* 父元素高度为 0 */\n.container {\n  border: 1px solid #ccc;\n}\n.float-child {\n  float: left;\n  width: 100px;\n  height: 100px;\n}\n```\n\n### 清除浮动的方法\n\n**1. display: flow-root（推荐，最简洁）**\n\n```css\n.container {\n  display: flow-root;\n}\n```\n\n**2. overflow: hidden（经典方案）**\n\n```css\n.container {\n  overflow: hidden;\n  /* 或 auto / scroll */\n}\n```\n⚠️ 缺点：可能裁剪定位元素或显示不必要的滚动条\n\n**3. clearfix 伪元素（最通用）**\n\n```css\n.clearfix::after {\n  content: '';\n  display: block;\n  clear: both;\n}\n\n/* 更完整的版本 */\n.clearfix::before,\n.clearfix::after {\n  content: '';\n  display: table;\n}\n.clearfix::after {\n  clear: both;\n}\n```\n\n**4. 额外标签法（不推荐）**\n\n```html\n<div class=\"container\">\n  <div class=\"float-child\">浮动元素</div>\n  <div style=\"clear: both\"></div>\n</div>\n```\n\n**5. 父元素也浮动（不推荐）**\n\n```css\n.container {\n  float: left;\n  /* 缺点：影响父元素自身的布局 */\n}\n```\n\n### 方法对比\n\n| 方法 | 代码量 | 副作用 | 兼容性 |\n|------|--------|--------|--------|\n| flow-root | 最少 | 无 | Chrome 57+、Firefox 53+ |\n| overflow: hidden | 少 | 可能裁剪内容 | 全兼容 |\n| clearfix 伪元素 | 中 | 无 | 全兼容 |\n| 额外标签 | 少 | 多余 DOM | 全兼容 |\n\n### 现代开发建议\n- **Flex/Grid 布局基本不需要清除浮动**\n- 如果必须用 float，使用 `display: flow-root` 或 clearfix 伪元素\n- float 的正当用途：文字环绕图片\n\n```css\n/* float 的正确用途 */\n.article img {\n  float: left;\n  margin-right: 16px;\n}\n```"
  },
  {
    "id": "css-030",
    "category": "css",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "CSS架构",
      "BEM",
      "CSS Modules",
      "Tailwind"
    ],
    "question": "CSS 命名和架构方案有哪些？BEM、CSS Modules、CSS-in-JS、Tailwind 的优缺点？",
    "answer": "### 1. BEM（Block Element Modifier）\n\n```css\n/* 块__元素--修饰符 */\n.card { }\n.card__title { }\n.card__body { }\n.card--featured { }\n.card__title--large { }\n```\n\n- ✅ 语义清晰、避免冲突\n- ❌ 名称冗长、需要手动维护\n\n### 2. CSS Modules\n\n```css\n/* Button.module.css */\n.button { background: blue; }\n.active { background: red; }\n```\n\n```jsx\nimport styles from './Button.module.css'\n<button className={styles.button}>Click</button>\n```\n\n- ✅ 编译时自动生成唯一类名，天然隔离\n- ✅ 配合构建工具零配置\n- ❌ 不能动态切换样式（需要条件 className）\n\n### 3. CSS-in-JS（styled-components / Emotion）\n\n```jsx\nconst Button = styled.button`\n  background: ${props => props.primary ? 'blue' : 'gray'};\n  padding: 8px 16px;\n`\n<Button primary>Click</Button>\n```\n\n- ✅ 动态样式、组件级隔离、JS 变量复用\n- ❌ 运行时开销、调试困难、增加包体积\n- ❌ SSR 处理复杂\n\n### 4. Tailwind CSS（原子化 CSS）\n\n```html\n<button class=\"bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded\">\n  Click\n</button>\n```\n\n- ✅ 不用命名、开发速度快、包体积小（PurgeCSS）\n- ✅ 统一设计系统\n- ❌ HTML 结构臃肿、学习曲线\n- ❌ 复杂动画和特殊样式不便\n\n### 5. Scoped CSS（Vue）\n\n```vue\n<style scoped>\n.button { background: blue; }\n</style>\n```\n\n- ✅ Vue 原生支持、简单\n- ❌ 子组件穿透需要 :deep()\n\n### 对比总结\n\n| 方案 | 隔离性 | 动态样式 | 开发速度 | 包体积 | 适合场景 |\n|------|--------|----------|----------|--------|----------|\n| BEM | 依赖命名 | ❌ | 中 | 小 | 传统项目 |\n| CSS Modules | ✅ 编译时 | ❌ | 快 | 小 | React 项目 |\n| CSS-in-JS | ✅ 运行时 | ✅ | 快 | 大 | 动态主题 |\n| Tailwind | ❌ | ❌ | 最快 | 最小 | 快速开发 |\n| Scoped | ✅ | ❌ | 快 | 小 | Vue 项目 |\n\n### 选择建议\n- **Vue 项目**：Scoped CSS 或 CSS Modules\n- **React 项目**：CSS Modules 或 Tailwind\n- **设计系统**：CSS-in-JS（动态主题）\n- **快速原型**：Tailwind\n- **遗留项目**：BEM + Sass"
  },
  {
    "id": "css-031",
    "category": "css",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "调试",
      "CSS",
      "优先级",
      "排查"
    ],
    "question": "给页面新增了一段 CSS 样式，但页面没有任何变化，你会如何系统性地排查？",
    "answer": "当新增或修改的 CSS 样式在页面上未生效时，不应盲目堆砌 `!important`，而应按照**“构建与网络层 → 选择器命中层 → 层叠与优先级层 → 盒模型与布局上下文层”**的四步法在 Chrome DevTools 中系统性定位。\n\n### 一、 四步系统性排查法与代码诊断\n\n1. **第一步：检查 Styles 面板中该规则是否出现**：\n   - 若完全未出现：排查选择器拼写（如后代 `.a .b` 误写为交集 `.a.b`）、伪元素漏写 `content: \"\"`、Vue `<style scoped>` 修改子组件未加 `:deep()`、或 Tailwind 动态拼接类名 `bg-${color}-500` 未被静态扫描。\n2. **第二步：规则出现但被划上删除线（Strikethrough）**：\n   - 打开 Computed 面板查看胜出规则：对比选择器特异性权重 `(inline, id, class, tag)`，或检查是否被更晚声明的 `@layer` 覆盖。\n   - 检查规则旁是否有黄色警告图标：例如 `calc(100%-20px)` 减号两侧未留空格导致语法解析失败被丢弃。\n3. **第三步：规则生效且无删除线，但页面视觉无变化（布局上下文限制）**：\n\n```css\n/* 常见场景 A：对 inline 行内元素（span / a）设置 width/height 或上下 margin 无效 */\nspan.tag {\n  width: 120px;          /* ✗ inline 元素忽略宽高 */\n  margin-top: 16px;      /* ✗ inline 元素忽略上下外边距 */\n  display: inline-block; /* ✔ 改为 inline-block 或 flex 后立即生效 */\n}\n\n/* 常见场景 B：设置 z-index: 9999 仍被遮挡 */\n.child-popup {\n  position: relative;    /* ✔ 必须是非 static 定位（或 flex/grid 子项）z-index 才生效 */\n  z-index: 9999;         /* 注意：若父容器有 transform / opacity < 1 / filter，会创建独立层叠上下文，子元素无法超越父容器层级 */\n}\n\n/* 常见场景 C：Vue Scoped 样式穿透子组件 */\n.form-wrap :deep(.input-inner) {\n  border-color: #2563eb;\n}\n```"
  },
  {
    "id": "css-032",
    "category": "css",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "text-overflow",
      "省略号",
      "文本截断",
      "布局"
    ],
    "question": "如何实现单行、多行文本超长时显示省略号（...）？",
    "answer": "文本超长显示省略号（`...`）分为**单行截断**与**多行截断**两类，在工程实践中还需重点处理 Flex 布局下省略号失效的经典边界问题。\n\n### 一、 单行与多行文本省略标准实现与 Flex 避坑\n\n```css\n/* 1. 单行文本超长省略 */\n.ellipsis-single {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/* 2. 多行文本超长省略（现代浏览器全兼容的 -webkit-line-clamp 方案） */\n.ellipsis-multi {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n  line-clamp: 3;\n  overflow: hidden;\n  word-break: break-word;\n}\n\n/* 3. 高频坑点：Flex 子项默认 min-width: auto 会被 nowrap 文本无限撑开导致省略号失效！ */\n.flex-item-text {\n  flex: 1;\n  min-width: 0; /* 关键：允许 Flex 子项收缩到小于其最小内容宽度 */\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n```\n\n### 二、 JS 动态检测文本是否发生真实截断（按需显示 Tooltip）\n\n```javascript\nfunction isTruncated(el) {\n  // 单行比较 scrollWidth > clientWidth，多行比较 scrollHeight > clientHeight\n  return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight\n}\n```"
  },
  {
    "id": "css-033",
    "category": "css",
    "difficulty": "medium",
    "question": "现代原生 CSS 四大变革：父选择器 :has()、容器查询 @container、层叠层 @layer 与 View Transitions API 实战",
    "tags": [
      ":has选择器",
      "ContainerQueries",
      "CSS层叠层@layer",
      "ViewTransitions",
      "现代CSS"
    ],
    "answer": "过去需要依赖 JavaScript 监听 DOM、ResizeObserver 或预处理器才能实现的布局与状态控制，随着 **`:has()`、容器查询（`@container`）、层叠层（`@layer`）和原生视图过渡（View Transitions API）** 在所有现代浏览器全量落地，已全面回归纯原生 CSS。\n\n### 一、 现代 CSS 四大核心特性作用与应用场景对比\n\n| 新特性 | 解决的历史痛点 | 核心语法与工程收益 |\n| :--- | :--- | :--- |\n| **父/前驱选择器 `:has()`** | CSS 只能向下选择子代，无法根据“是否包含某子元素或子表单状态”反向控制父容器样式 | `.card:has(img)`（有图卡片切换双列布局）、`form:has(:invalid) button[type=\"submit\"]`（纯 CSS 禁用提交态） |\n| **容器查询 `@container`** | `@media` 媒体查询只能看**整个浏览器视口宽度**，同一个组件放在窄侧边栏和宽主栏无法自适应 | 组件根据**自身父容器的实际可用宽度**（`container-type: inline-size`）独立切换横排/竖排，实现真正的组件级响应式 |\n| **层叠层 `@layer`** | 第三方 UI 库样式与业务自定义样式特异性权重冲突，被迫到处写 `!important` | 显式声明层叠顺序 `@layer reset, ui-lib, utilities, overrides;`——**后声明的层无条件优先于先声明的层，无视内部选择器权重高低**！ |\n| **View Transitions API** | 页面/状态切换时的平滑共享元素形变动画（FLIP）手写极度复杂 | 调用 `document.startViewTransition(() => updateDOM())`，浏览器自动截取前后帧快照并执行硬件加速交叉淡入淡出与位置补间 |\n\n### 二、 四大特性实战代码示范\n\n```css\n/* 1. @layer：彻底终结 !important 大战，base 层权重再高也赢不了 overrides 层 */\n@layer reset, third-party, components, utilities;\n\n@layer third-party {\n  #app .btn.btn-primary { background: gray; } /* 即使带 ID 选择器权重极高 */\n}\n@layer components {\n  .btn-primary { background: #2563eb; }       /* 依然胜出！因为 components 层排在 third-party 之后 */\n}\n\n/* 2. :has() 父选择器：当卡片内部包含勾选的复选框时，高亮整张卡片边框；当打开弹窗时锁死 body 滚动 */\n.task-card:has(input[type=\"checkbox\"]:checked) {\n  background-color: #f0fdf4;\n  border-color: #16a34a;\n}\nbody:has(dialog[open]) {\n  overflow: hidden; /* 零 JS 实现弹窗打开时锁定背景滚动！ */\n}\n\n/* 3. @container 容器查询：卡片根据所在容器宽度（而非屏幕宽度）自动切换布局 */\n.card-slot {\n  container-type: inline-size;\n  container-name: card-box;\n}\n@container card-box (min-width: 480px) {\n  .product-card {\n    display: grid;\n    grid-template-columns: 180px 1fr;\n  }\n}\n```"
  }
]
