// CSS 与布局面试题 — 30 题
export const cssQuestions = [
  // ========== 盒模型与定位 ==========
  {
    id: 'css-001',
    category: 'css',
    module: 'lang',
    difficulty: 'easy',
    tags: ['盒模型', 'box-sizing'],
    question: 'CSS 盒模型有哪些？box-sizing 的作用是什么？',
    answer: `### 两种盒模型

**1. 标准盒模型（content-box）**
- \`width/height\` = 内容区域
- 实际宽度 = width + padding + border + margin

**2. 怪异盒模型（border-box）**
- \`width/height\` = 内容 + padding + border
- 实际宽度 = width + margin（width 已包含 padding 和 border）

\`\`\`css
/* 标准盒模型 */
.box1 {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  border: 1px solid;
  /* 实际宽度 = 100 + 20 + 2 = 122px */
}

/* 怪异盒模型 */
.box2 {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 1px solid;
  /* 实际宽度 = 100px（padding和border被包含在内） */
}
\`\`\`

### 全局推荐

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

\`border-box\` 更符合直觉，计算尺寸更方便，是现代开发的主流选择。`
  },
  {
    id: 'css-002',
    category: 'css',
    module: 'lang',
    difficulty: 'easy',
    tags: ['选择器', '优先级', '权重'],
    question: 'CSS 选择器优先级是如何计算的？',
    answer: `### 优先级权重

从高到低：

| 等级 | 类型 | 权重 | 示例 |
|------|------|------|------|
| 1 | \`!important\` | 最高 | \`color: red !important\` |
| 2 | 内联样式 | 1000 | \`style="color: red"\` |
| 3 | ID 选择器 | 100 | \`#header\` |
| 4 | 类/伪类/属性 | 10 | \`.nav\`、\`:hover\`、\`[type]\` |
| 5 | 元素/伪元素 | 1 | \`div\`、\`::before\` |
| 6 | 通配符 | 0 | \`*\` |

### 计算示例

\`\`\`css
#nav .item { }        /* 100 + 10 = 110 */
div .item:hover { }    /* 1 + 10 + 10 = 21 */
#nav > div.item { }    /* 100 + 1 + 10 = 111 */
\`\`\`

### 注意事项

1. **权重不可进位**：11 个类选择器（110）依然低于 1 个 ID（100）
2. **相同权重**：后写的覆盖先写的
3. **\`!important\`**：尽量不用，只在覆盖第三方库时使用
4. **继承的样式**：优先级最低，甚至低于通配符

\`\`\`css
* { color: black; }     /* 0 权重 */
div { color: blue; }    /* 1 权重 */
/* 如果 div 继承了 * 的 color，但 div 自己的 color:blue 生效 */
\`\`\`

### 实用技巧
- 避免使用 ID 选择器（优先级太高，难以覆盖）
- 使用 CSS 变量代替复杂优先级管理
- BEM 命名规范可以避免优先级冲突`
  },
  {
    id: 'css-003',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['BFC', '块级格式化上下文'],
    question: '什么是 BFC？如何创建 BFC？有什么应用？',
    answer: `**BFC**（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素的布局不会影响外部。

### 创建 BFC 的条件

- \`float\` 不为 \`none\`
- \`position\` 为 \`absolute\` 或 \`fixed\`
- \`display\` 为 \`inline-block\`、\`flex\`、\`grid\`、\`table-cell\`、\`flow-root\` 等
- \`overflow\` 不为 \`visible\`（如 \`hidden\`、\`auto\`、\`scroll\`）
- 根元素 \`<html>\` 本身就是 BFC

### BFC 的特性

1. **内部的 Box 垂直方向上一个接一个放置**
2. **属于同一个 BFC 的两个相邻 Box 的 margin 会发生折叠**
3. **BFC 区域不会与浮动元素重叠**
4. **计算 BFC 高度时，浮动元素也参与计算**

### 应用场景

**1. 清除浮动**
\`\`\`css
.container {
  overflow: hidden; /* 或 display: flow-root; */
}
\`\`\`

**2. 防止 margin 折叠**
\`\`\`css
.parent {
  overflow: hidden; /* 创建 BFC，阻止子元素 margin 溢出 */
}
\`\`\`

**3. 实现两栏布局（左浮动 + 右 BFC）**
\`\`\`css
.left { float: left; width: 200px; }
.right { overflow: hidden; /* BFC 不与浮动重叠 */ }
\`\`\`

**4. 防止文字环绕浮动元素**

### 推荐方式

\`display: flow-root\` 是最干净的创建 BFC 方式，没有副作用（不会像 \`overflow: hidden\` 那样裁剪内容或显示滚动条）。`
  },
  {
    id: 'css-004',
    category: 'css',
    module: 'lang',
    difficulty: 'easy',
    tags: ['居中', 'Flex', '布局'],
    question: '如何实现元素水平垂直居中？有哪些方法？',
    answer: `### 方法 1：Flex（推荐）

\`\`\`css
.parent {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;      /* 垂直居中 */
}
\`\`\`

### 方法 2：Grid

\`\`\`css
.parent {
  display: grid;
  place-items: center; /* 同时水平垂直居中 */
}
\`\`\`

### 方法 3：绝对定位 + transform

\`\`\`css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\`

### 方法 4：绝对定位 + margin auto

\`\`\`css
.child {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: auto;
  width: 200px;   /* 需要固定宽高 */
  height: 100px;
}
\`\`\`

### 方法 5：绝对定位 + 负 margin

\`\`\`css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 100px;
  margin-top: -50px;  /* 高度的一半 */
  margin-left: -100px; /* 宽度的一半 */
}
\`\`\`

### 方法 6：table-cell

\`\`\`css
.parent {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.child { display: inline-block; }
\`\`\`

### 方法 7：line-height（单行文本）

\`\`\`css
.parent {
  text-align: center;
  line-height: 200px; /* 等于容器高度 */
}
\`\`\`

### 各方法适用场景

| 方法 | 需要固定宽高 | 代码量 | 兼容性 |
|------|-------------|--------|--------|
| Flex | ❌ | 少 | IE10+ |
| Grid | ❌ | 最少 | IE 不支持 |
| transform | ❌ | 少 | IE9+ |
| margin auto | ✅ | 中 | 好 |
| 负 margin | ✅ | 中 | 好 |`
  },
  {
    id: 'css-005',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['position', '定位', 'sticky'],
    question: 'CSS position 的值有哪些？各有什么特点？',
    answer: `### 五种定位

| 值 | 脱离文档流 | 定位参照 | 适用场景 |
|------|-----------|----------|----------|
| \`static\` | ❌ | 默认流 | 默认值 |
| \`relative\` | ❌ | 自身原始位置 | 微调位置 |
| \`absolute\` | ✅ | 最近的非 static 祖先 | 脱离文档流定位 |
| \`fixed\` | ✅ | 视口 | 固定导航/弹窗 |
| \`sticky\` | ❌ | 滚动容器 | 粘性导航 |

### 详细说明

**1. static（默认）**
- 按照正常文档流排列
- \`top/right/bottom/left/z-index\` 无效

**2. relative（相对定位）**
- 相对自身原始位置偏移
- 不脱离文档流，原位置保留
- 常作为 absolute 的定位参照

**3. absolute（绝对定位）**
- 脱离文档流，原位置不保留
- 相对最近的**非 static** 祖先元素定位
- 如果没有非 static 祖先，则相对 \`<html>\`

**4. fixed（固定定位）**
- 脱离文档流
- 相对**浏览器视口**定位
- 滚动时位置不变

**5. sticky（粘性定位）**（CSS3）
- 在可见区域内表现为 \`relative\`
- 滚动到阈值后表现为 \`fixed\`
- 不会脱离文档流

\`\`\`css
/* 粘性导航：滚动到顶部时吸顶 */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
}
\`\`\`

### z-index 注意事项
- 只在 \`position\` 非 static 时有效
- 同一**层叠上下文**内比较 z-index
- 创建层叠上下文的条件：position 非 static + z-index 非 auto、opacity < 1、transform 非 none 等

### sticky 的坑
- 父元素不能有 \`overflow: hidden\`，否则 sticky 失效
- 父元素高度不够时 sticky 效果不明显`
  },

  // ========== Flex 布局 ==========
  {
    id: 'css-006',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Flex', '弹性布局', '主轴'],
    question: 'Flex 布局的主轴和交叉轴是什么？常用属性有哪些？',
    answer: `Flex 布局有两个轴：**主轴**（main axis）和**交叉轴**（cross axis），由 \`flex-direction\` 决定。

### 容器属性

**flex-direction** — 主轴方向
\`\`\`css
flex-direction: row | row-reverse | column | column-reverse
\`\`\`

**justify-content** — 主轴对齐
\`\`\`css
justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly
\`\`\`

**align-items** — 交叉轴对齐
\`\`\`css
align-items: stretch | flex-start | flex-end | center | baseline
\`\`\`

**flex-wrap** — 换行
\`\`\`css
flex-wrap: nowrap | wrap | wrap-reverse
\`\`\`

**align-content** — 多行对齐（需要 flex-wrap: wrap）
\`\`\`css
align-content: flex-start | flex-end | center | space-between | stretch
\`\`\`

### 项目属性

**flex** — 缩写（flex-grow, flex-shrink, flex-basis）
\`\`\`css
flex: 1;          /* 1 1 0%  → 等比放大缩小 */
flex: 0 0 200px;  /* 不放大不缩小，固定 200px */
flex: auto;       /* 1 1 auto */
flex: none;       /* 0 0 auto → 不伸缩 */
\`\`\`

**order** — 排序
\`\`\`css
order: -1;  /* 越小越靠前，默认 0 */
\`\`\`

**align-self** — 单独对齐
\`\`\`css
align-self: center;  /* 覆盖父级的 align-items */
\`\`\`

### flex: 1 的含义

\`\`\`css
flex: 1;
/* 等价于 */
flex-grow: 1;    /* 放大比例：占满剩余空间 */
flex-shrink: 1;  /* 缩小比例：等比缩小 */
flex-basis: 0%;  /* 基准大小：不占初始空间 */
\`\`\`

### 常见布局

\`\`\`css
/* 水平垂直居中 */
.center { display: flex; justify-content: center; align-items: center; }

/* 两端对齐 */
.between { display: flex; justify-content: space-between; }

/* 左固定右自适应 */
.layout { display: flex; }
.left { flex: 0 0 200px; }
.right { flex: 1; }
\`\`\``
  },
  {
    id: 'css-007',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Flex', 'flex-grow', 'flex-shrink'],
    question: 'flex-grow 和 flex-shrink 是如何计算空间分配的？',
    answer: `### flex-grow（放大）

当容器有**剩余空间**时，按比例分配。

\`\`\`css
.container { display: flex; width: 600px; }
.item1 { flex-grow: 1; width: 100px; }
.item2 { flex-grow: 2; width: 100px; }
.item3 { flex-grow: 1; width: 100px; }
\`\`\`

计算过程：
1. 初始总宽度 = 100 + 100 + 100 = 300px
2. 剩余空间 = 600 - 300 = 300px
3. 总份数 = 1 + 2 + 1 = 4
4. 分配：item1 = 300 × 1/4 = 75px → 最终 175px
5. item2 = 300 × 2/4 = 150px → 最终 250px
6. item3 = 300 × 1/4 = 75px → 最终 175px

### flex-shrink（缩小）

当容器**空间不足**时，按比例缩小。

\`\`\`css
.container { display: flex; width: 400px; }
.item1 { flex-shrink: 1; width: 200px; }
.item2 { flex-shrink: 2; width: 300px; }
.item3 { flex-shrink: 1; width: 200px; }
\`\`\`

计算过程：
1. 初始总宽度 = 200 + 300 + 200 = 700px
2. 溢出空间 = 700 - 400 = 300px
3. 加权总份数 = 1×200 + 2×300 + 1×200 = 1000
4. item1 缩小 = 300 × (1×200)/1000 = 60px → 最终 140px
5. item2 缩小 = 300 × (2×300)/1000 = 180px → 最终 120px
6. item3 缩小 = 300 × (1×200)/1000 = 60px → 最终 140px

### 关键区别
- **flex-grow** 按 flex-basis 之外的**剩余空间**分配
- **flex-shrink** 按 **flex-shrink × item-width** 的加权比例缩小（宽度大的缩小更多）

### flex-basis
设置项目的初始大小，优先级高于 width：
\`\`\`css
.item {
  flex-basis: 200px;  /* 优先于 width */
  width: 100px;       /* 被 flex-basis 覆盖 */
}
\`\`\``
  },
  {
    id: 'css-008',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Flex', '面试题', '布局'],
    question: '用 Flex 实现以下布局：三栏布局（左固定200px，中间自适应，右固定150px）',
    answer: `\`\`\`css
.container {
  display: flex;
  min-height: 100vh;
}

.left {
  flex: 0 0 200px;  /* 不伸缩，固定 200px */
  background: #f0f0f0;
}

.main {
  flex: 1;           /* 占满剩余空间 */
  background: #fff;
}

.right {
  flex: 0 0 150px;  /* 不伸缩，固定 150px */
  background: #f0f0f0;
}
\`\`\`

\`\`\`html
<div class="container">
  <aside class="left">左侧栏</aside>
  <main class="main">中间内容</main>
  <aside class="right">右侧栏</aside>
</div>
\`\`\`

### 进阶：圣杯布局（中间优先加载）

\`\`\`html
<!-- HTML 顺序：main 先于 left/right -->
<div class="container">
  <main class="main">中间内容</main>
  <aside class="left">左侧栏</aside>
  <aside class="right">右侧栏</aside>
</div>
\`\`\`

\`\`\`css
.container {
  display: flex;
}
.main { flex: 1; order: 2; }
.left { flex: 0 0 200px; order: 1; }
.right { flex: 0 0 150px; order: 3; }
\`\`\`

### 其他方案对比

**Grid 方案（更简洁）：**
\`\`\`css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 150px;
}
\`\`\`

**float 方案（传统）：**
\`\`\`css
.left { float: left; width: 200px; }
.right { float: right; width: 150px; }
.main { margin: 0 150px 0 200px; }
\`\`\``
  },
  {
    id: 'css-009',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Flex', 'align-items', '交叉轴'],
    question: 'Flex 中 align-items 和 align-content 的区别？',
    answer: `### 区别

| 属性 | 作用对象 | 需要 flex-wrap | 场景 |
|------|----------|---------------|------|
| \`align-items\` | **单行**项目 | ❌ | 控制每行项目在交叉轴的对齐 |
| \`align-content\` | **多行**之间的间距 | ✅ 需要 wrap | 控制行与行之间的空间分布 |

### 图示

\`\`\`
align-items: center（单行）
┌─────────────────────────┐
│      ┌──┐ ┌──┐ ┌──┐      │  ← 每个项目垂直居中
│      │  │ │  │ │  │      │
│      └──┘ └──┘ └──┘      │
└─────────────────────────┘

align-content: space-between（多行）
┌─────────────────────────┐
│ ┌──┐ ┌──┐ ┌──┐          │  ← 第一行贴顶
│ └──┘ └──┘ └──┘          │
│                          │  ← 空间
│ ┌──┐ ┌──┐ ┌──┐          │  ← 第二行贴底
│ └──┘ └──┘ └──┘          │
└─────────────────────────┘
\`\`\`

### 示例

\`\`\`css
.container {
  display: flex;
  flex-wrap: wrap;        /* 必须换行 */
  height: 400px;
  align-items: center;     /* 每行内项目垂直居中 */
  align-content: space-between;  /* 行间距均匀分布 */
}
\`\`\`

### 注意事项
- \`align-content\` 只在 \`flex-wrap: wrap\` 且有多行时生效
- 单行时 \`align-content\` 无效
- \`align-items\` 对每一行都生效`
  },
  {
    id: 'css-010',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Flex', 'gap', '间距'],
    question: 'Flex 布局中如何设置项目间距？gap 属性的兼容性如何？',
    answer: `### gap 属性（推荐）

\`\`\`css
.container {
  display: flex;
  gap: 16px;              /* 行和列间距都是 16px */
  /* 或分别设置 */
  row-gap: 16px;
  column-gap: 24px;
}
\`\`\`

\`gap\` 是 \`row-gap\` 和 \`column-gap\` 的简写，Flex、Grid 都支持。

### 兼容性
- Chrome 84+、Firefox 63+、Safari 14.1+
- IE 完全不支持
- 现代项目可放心使用

### 替代方案（旧方案）

**1. margin + 负 margin**
\`\`\`css
.container {
  display: flex;
  margin: -8px;  /* 抵消最外层多出来的 margin */
}
.item {
  margin: 8px;
}
\`\`\`

**2. margin + last-child / first-child**
\`\`\`css
.item {
  margin-right: 16px;
}
.item:last-child {
  margin-right: 0;
}
\`\`\`

**3. justify-content: space-between（固定数量）**
\`\`\`css
/* 仅适用于固定数量的项目 */
.container {
  display: flex;
  justify-content: space-between;
}
\`\`\`

**4. 使用选择器**
\`\`\`css
.item + .item {
  margin-left: 16px;
}
\`\`\`

### 最佳实践
现代项目直接用 \`gap\`，简单优雅：
\`\`\`css
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;  /* 行间距 16px，列间距 24px */
}
\`\`\``
  },

  // ========== Grid 布局 ==========
  {
    id: 'css-011',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Grid', '网格布局', 'fr'],
    question: 'CSS Grid 布局的基本概念和常用属性？',
    answer: `Grid 是二维布局系统，可以同时控制行和列。

### 容器属性

\`\`\`css
.grid {
  display: grid;
  /* 定义列 */
  grid-template-columns: 200px 1fr 150px;  /* 固定+自适应+固定 */
  grid-template-columns: repeat(3, 1fr);    /* 三等分 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 自适应列数 */

  /* 定义行 */
  grid-template-rows: 100px auto 100px;

  /* 间距 */
  gap: 16px;
  row-gap: 16px;
  column-gap: 24px;

  /* 对齐 */
  justify-items: start | end | center | stretch;  /* 水平 */
  align-items: start | end | center | stretch;    /* 垂直 */
  justify-content: center | space-between | ...;  /* 整体水平 */
  align-content: center | space-between | ...;    /* 整体垂直 */
}
\`\`\`

### 项目属性

\`\`\`css
.item {
  /* 基于线定位 */
  grid-column: 1 / 3;    /* 从第1条线到第3条线（占2列）*/
  grid-row: 1 / 2;       /* 占第1行 */
  
  /* 跨越 */
  grid-column: span 2;   /* 跨2列 */
  
  /* 区域命名 */
  grid-area: header;     /* 放在名为 header 的区域 */
  
  /* 对齐 */
  justify-self: center;
  align-self: center;
}
\`\`\`

### fr 单位

\`fr\`（fraction）是比例单位：
\`\`\`css
grid-template-columns: 1fr 2fr 1fr;  /* 1:2:1 比例 */
\`\`\`

### repeat 和 auto-fill

\`\`\`css
/* 固定3列 */
grid-template-columns: repeat(3, 1fr);

/* 自适应：容器足够宽时自动增加列数 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* 每列最小200px，空间富余时等比增大 */
\`\`\`

### grid-template-areas（命名区域）

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

### Grid vs Flex
- **Flex**：一维（行或列），适合组件内布局
- **Grid**：二维（行和列），适合页面整体布局`
  },
  {
    id: 'css-012',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Grid', '响应式', 'auto-fill'],
    question: '如何用 Grid 实现响应式卡片布局（自动调整列数）？',
    answer: `\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
\`\`\`

### 原理

- \`auto-fill\`：自动填充尽可能多的列
- \`minmax(280px, 1fr)\`：每列最小 280px，最大等分剩余空间
- 当容器宽度 < 280px 时，自动变为单列
- 当容器宽度增加时，自动增加列数

### 效果
\`\`\`
宽屏（1200px）：4列
┌──┐ ┌──┐ ┌──┐ ┌──┐
│  │ │  │ │  │ │  │
└──┘ └──┘ └──┘ └──┘

中屏（800px）：3列
┌──┐ ┌──┐ ┌──┐
│  │ │  │ │  │
└──┘ └──┘ └──┘

窄屏（500px）：1列
┌──┐
│  │
└──┘
\`\`\`

### auto-fill vs auto-fit

\`\`\`css
/* auto-fill：创建空的网格轨道 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* 只有1个卡片时，卡片宽度 = 200px，右侧留空 */

/* auto-fit：拉伸现有项目填满空间 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
/* 只有1个卡片时，卡片拉伸占满整个容器 */
\`\`\`

### 完整响应式示例

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
  padding: 20px;
}

/* min(100%, 280px) 确保在极窄屏幕下不会溢出 */
\`\`\`

### 适合场景
- 产品列表
- 图片画廊
- 卡片墙
- 仪表盘布局`
  },
  {
    id: 'css-013',
    category: 'css',
    module: 'lang',
    difficulty: 'hard',
    tags: ['Grid', '布局', 'template-areas'],
    question: '用 Grid 实现一个完整的页面布局（Header/Sidebar/Main/Right/Footer）',
    answer: `\`\`\`css
.layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 200px 1fr 250px;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header  header  header"
    "sidebar main    right"
    "footer  footer  footer";
  gap: 1px;
  background: #e0e0e0; /* gap 颜色作为分割线 */
}

.header  { grid-area: header;  background: #fff; }
.sidebar { grid-area: sidebar; background: #fff; }
.main    { grid-area: main;    background: #fff; }
.right   { grid-area: right;   background: #fff; }
.footer  { grid-area: footer;  background: #fff; }
\`\`\`

### 响应式调整

\`\`\`css
/* 平板：隐藏右侧栏 */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header  header"
      "sidebar main"
      "footer  footer";
  }
  .right { display: none; }
}

/* 手机：单列 */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }
  .sidebar, .right { display: none; }
}
\`\`\`

### HTML

\`\`\`html
<div class="layout">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main Content</main>
  <aside class="right">Right Panel</aside>
  <footer class="footer">Footer</footer>
</div>
\`\`\`

### 优势
- 使用 \`grid-template-areas\` 布局极其直观
- 响应式只需修改 grid-template 定义
- DOM 顺序可以任意排列，通过 grid-area 定位
- 比传统的 float/flex 实现更简洁`
  },
  {
    id: 'css-014',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Grid', 'Flex', '对比'],
    question: 'Grid 和 Flex 的区别？什么时候用哪个？',
    answer: `### 核心区别

| 特性 | Flex | Grid |
|------|------|------|
| 维度 | **一维**（行或列） | **二维**（行和列） |
| 设计思路 | 内容优先 | 布局优先 |
| 适合 | 组件内布局 | 页面整体布局 |
| 项目排列 | 自动流式排列 | 精确定位到网格 |
| 重叠 | 不支持 | 支持（z 轴层叠） |

### 什么时候用 Flex

- **导航栏**：水平排列菜单项
- **按钮组**：一行按钮
- **卡片内容**：图标+文字+操作
- **表单行**：标签+输入框
- **居中**：水平垂直居中最简方案

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

### 什么时候用 Grid

- **页面骨架**：Header/Sidebar/Main/Footer
- **图片画廊**：行列网格
- **表单布局**：标签和输入框对齐
- **仪表盘**：多区域仪表盘布局
- **需要行列同时控制**：任何需要二维定位的布局

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
\`\`\`

### 组合使用（最佳实践）

页面用 Grid，组件内用 Flex：

\`\`\`css
/* 页面骨架用 Grid */
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* 组件内部用 Flex */
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

### 选择原则
- 需要行列同时控制 → Grid
- 只需控制一个方向 → Flex
- 不确定 → 先试 Flex（更简单），不够再换 Grid`
  },
  {
    id: 'css-015',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Grid', 'span', '合并'],
    question: 'Grid 中如何实现跨行跨列（合并单元格）？',
    answer: `### 方法 1：基于网格线

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 100px);
}

.item-a {
  grid-column: 1 / 4;  /* 从第1条线到第4条线，跨3列 */
  grid-row: 1 / 2;     /* 跨1行 */
}

.item-b {
  grid-column: 1 / 3;  /* 跨2列 */
  grid-row: 2 / 4;     /* 跨2行 */
}
\`\`\`

### 方法 2：span 关键字

\`\`\`css
.item {
  grid-column: span 2;   /* 跨2列 */
  grid-row: span 3;       /* 跨3行 */
}

/* 也可以指定起始位置 */
.item {
  grid-column: 2 / span 2;  /* 从第2条线开始，跨2列 */
}
\`\`\`

### 方法 3：grid-area（简写）

\`\`\`css
.item {
  /* grid-row-start / grid-column-start / grid-row-end / grid-column-end */
  grid-area: 1 / 1 / 3 / 4;  /* 行1到3，列1到4 */
}
\`\`\`

### 实际示例：仪表盘布局

\`\`\`css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 16px;
}

.widget-large {
  grid-column: span 2;
  grid-row: span 2;
}

.widget-wide {
  grid-column: span 2;
}

.widget-tall {
  grid-row: span 2;
}

.widget-normal {
  /* 默认 1×1 */
}
\`\`\`

\`\`\`
┌──────────┬──────────┬──┐
│          │          │  │
│  large   │  wide    ├──┤
│          ├──────────┤  │
│          │  │  │    │  │
├──────────┴──┴───────┴──┘
\`\`\`

### 注意事项
- 网格线编号从 1 开始
- 也可以用负数从后往前数：\`grid-column: -2\` 表示倒数第2条线
- 使用 \`span\` 更直观，推荐使用`
  },

  // ========== 响应式设计 ==========
  {
    id: 'css-016',
    category: 'css',
    module: 'lang',
    difficulty: 'easy',
    tags: ['响应式', '媒体查询', 'viewport'],
    question: '如何实现响应式设计？有哪些常用方案？',
    answer: `### 1. 媒体查询（Media Query）

\`\`\`css
/* 基础样式（移动端优先） */
.container {
  padding: 16px;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
  }
}
\`\`\`

### 2. viewport meta 标签

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

### 3. 相对单位

\`\`\`css
/* rem：相对根字号 */
html { font-size: 16px; }
.title { font-size: 2rem; }  /* 32px */

/* vw/vh：视口百分比 */
.hero { height: 100vh; }
.sidebar { width: 20vw; }

/* clamp()：响应式字号 */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* 最小 1.5rem，理想 4vw，最大 3rem */
}
\`\`\`

### 4. 响应式图片

\`\`\`css
img {
  max-width: 100%;
  height: auto;
}

/* 根据屏幕加载不同图片 */
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="responsive image">
</picture>
\`\`\`

### 5. Container Queries（CSS新特性）

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
  }
}
\`\`\`

### 断点建议

\`\`\`css
/* 移动端优先策略 */
/* 手机：默认 < 768px */
/* 平板：768px - 1024px */
/* 桌面：> 1024px */
/* 大屏：> 1440px */
\`\`\`

### 最佳实践
- **移动端优先**：基础样式为移动端，媒体查询逐步增强
- **使用相对单位**：rem、vw、%、clamp
- **Grid/Flex 自适应**：结合 auto-fill/auto-fit 减少媒体查询
- **优先使用 CSS 特性**：min()、max()、clamp() 比媒体查询更流畅`
  },
  {
    id: 'css-017',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['响应式', 'rem', 'em', 'vw'],
    question: 'px、em、rem、vw/vh 的区别？如何选择？',
    answer: `### 单位对比

| 单位 | 相对于 | 特点 |
|------|--------|------|
| \`px\` | 绝对像素 | 固定不变，不随用户设置缩放 |
| \`em\` | 父元素字体大小 | 嵌套时会**累积** |
| \`rem\` | 根元素（html）字体大小 | 全局统一，不会累积 |
| \`vw\` | 视口宽度的 1% | 随窗口变化 |
| \`vh\` | 视口高度的 1% | 随窗口变化 |
| \`%\` | 父元素对应属性 | 相对父元素 |
| \`vmin\` | vw 和 vh 中较小的 | 取小值 |
| \`vmax\` | vw 和 vh 中较大的 | 取大值 |

### em 的累积问题

\`\`\`css
.parent { font-size: 20px; }
.child { font-size: 1.2em; }    /* 24px */
.grandchild { font-size: 1.2em; } /* 28.8px（相对 child） */
\`\`\`

### rem 优势

\`\`\`css
html { font-size: 16px; }
h1 { font-size: 2rem; }     /* 32px */
p { font-size: 1rem; }      /* 16px */
.small { font-size: 0.875rem; } /* 14px */
\`\`\`

所有 rem 都相对 html 的 font-size，修改一处即可全局缩放。

### 响应式根字号

\`\`\`css
/* 方案 1：媒体查询 */
@media (max-width: 768px) {
  html { font-size: 14px; }
}

/* 方案 2：calc + vw（推荐） */
html {
  font-size: calc(14px + 0.4vw);
}

/* 方案 3：clamp */
html {
  font-size: clamp(14px, 2vw, 18px);
}
\`\`\`

### 选择建议

| 场景 | 推荐单位 |
|------|----------|
| 字体大小 | \`rem\`（统一缩放） |
| 间距/边距 | \`rem\` 或 \`px\` |
| 容器宽度 | \`%\` 或 \`vw\` |
| 全屏高度 | \`vh\` 或 \`dvh\` |
| 响应式字体 | \`clamp()\` |
| 边框 | \`px\` |
| 图标大小 | \`em\`（跟随文字大小） |

### 注意事项
- 用户可能在浏览器设置中修改默认字号，使用 \`rem\` 可以尊重用户设置
- \`vh\` 在移动端有 100vh 问题（地址栏伸缩），建议用 \`dvh\`（dynamic viewport height）
- \`px\` 不会随用户缩放变化，无障碍性较差`
  },
  {
    id: 'css-018',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['移动端', '1px', '高清屏'],
    question: '移动端 1px 边框问题的原因和解决方案？',
    answer: `### 问题原因

在 Retina 高清屏上，设备像素比（DPR）通常为 2 或 3，CSS 的 1px 实际显示为 2~3 个物理像素，看起来偏粗。

### 解决方案

**1. transform 缩放（推荐）**

\`\`\`css
.border-1px {
  position: relative;
}
.border-1px::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 200%;
  border: 1px solid #ccc;
  border-radius: 4px; /* 如需圆角 */
  transform: scale(0.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
}

/* DPR 3 的设备 */
@media (-webkit-min-device-pixel-ratio: 3) {
  .border-1px::after {
    width: 300%;
    height: 300%;
    transform: scale(0.333);
  }
}
\`\`\`

**2. 使用 0.5px（Safari/iOS 支持）**

\`\`\`css
.border {
  border: 0.5px solid #ccc;
}
/* 仅 iOS 8+ 和部分现代浏览器支持 */
\`\`\`

**3. viewport 缩放**

\`\`\`javascript
// 根据 DPR 动态设置 viewport
const dpr = window.devicePixelRatio || 1
const scale = 1 / dpr
document.querySelector('meta[name="viewport"]')
  .setAttribute('content', \`width=device-width, initial-scale=\${scale}, user-scalable=no\`)
\`\`\`

**4. box-shadow 模拟**

\`\`\`css
.border-1px {
  box-shadow: 0 0 0 0.5px #ccc;
}
\`\`\`

**5. border-image / background-image**

\`\`\`css
.border-1px {
  border-width: 1px;
  border-image: url('data:image/svg+xml,...') 2 stretch;
}
\`\`\`

### 推荐方案
- **通用性最强**：transform 缩放（方案 1）
- **最简单**：0.5px（方案 2，在支持的设备上）
- **整体缩放**：viewport 缩放（方案 3，适用于所有 1px 问题，但会影响整体布局）`
  },
  {
    id: 'css-019',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['移动端', '触摸', '适配'],
    question: '移动端开发有哪些常见的适配问题？',
    answer: `### 1. 1px 边框问题
（详见 CSS-018）

### 2. 100vh 问题

移动端浏览器的地址栏伸缩会导致 \`100vh\` 不准确：

\`\`\`css
/* ❌ 旧方案 */
.fullscreen { height: 100vh; }

/* ✅ 新方案 */
.fullscreen { height: 100dvh; }  /* dynamic viewport height */
\`\`\`

### 3. 点击延迟（300ms）

移动端 click 事件有 300ms 延迟（等待双击缩放判断）：

\`\`\`html
<!-- 解决方案：禁用缩放 -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
\`\`\`

### 4. iOS 输入框内阴影

\`\`\`css
input {
  -webkit-appearance: none;  /* 去除默认样式 */
  appearance: none;
}
\`\`\`

### 5. iOS 安全区域适配

\`\`\`css
/* iPhone X+ 底部安全区 */
.bottom-bar {
  padding-bottom: env(safe-area-inset-bottom);
  /* 或 */
  padding-bottom: constant(safe-area-inset-bottom); /* iOS < 11.2 */
  padding-bottom: env(safe-area-inset-bottom);       /* iOS >= 11.2 */
}
\`\`\`

### 6. 文字溢出

\`\`\`css
/* 长单词/URL 不换行 */
.word-break {
  word-break: break-all;
  overflow-wrap: break-word;
}

/* 多行省略 */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
\`\`\`

### 7. 禁止选中文本/图片

\`\`\`css
.no-select {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none; /* iOS 长按不弹菜单 */
}
\`\`\`

### 8. 软键盘遮挡

\`\`\`javascript
// 监听输入框聚焦，滚动到可见区域
input.addEventListener('focus', () => {
  setTimeout(() => {
    input.scrollIntoView({ behavior: 'smooth' })
  }, 300)
})
\`\`\`

### 9. 横屏适配

\`\`\`css
@media (orientation: landscape) {
  .layout { flex-direction: row; }
}
@media (orientation: portrait) {
  .layout { flex-direction: column; }
}
\`\`\`

### 10. Retina 图片

\`\`\`css
/* 使用 srcset */
<img src="photo.jpg" srcset="photo@2x.jpg 2x, photo@3x.jpg 3x">
\`\`\``
  },

  // ========== 动画与过渡 ==========
  {
    id: 'css-020',
    category: 'css',
    module: 'lang',
    difficulty: 'easy',
    tags: ['transition', '过渡', '动画'],
    question: 'CSS transition 和 animation 的区别？',
    answer: `### transition（过渡）

状态变化时平滑过渡，需要**触发条件**（如 :hover、class 切换）。

\`\`\`css
.btn {
  background: blue;
  transition: background 0.3s ease, transform 0.3s ease;
}
.btn:hover {
  background: red;
  transform: scale(1.05);
}
\`\`\`

### animation（动画）

自动执行，无需触发，可设循环次数、方向等。

\`\`\`css
.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
\`\`\`

### 对比

| 特性 | transition | animation |
|------|-----------|-----------|
| 触发方式 | 需要状态变化 | 自动执行 |
| 关键帧 | 只有起止两帧 | 支持 @keyframes 多帧 |
| 循环 | ❌ | ✅ |
| 暂停 | ❌ | ✅ \`animation-play-state\` |
| 方向 | ❌ | ✅ \`alternate\` |
| 适用 | 交互反馈 | 加载动画、持续动画 |

### transition 常用属性

\`\`\`css
transition: property duration timing-function delay;
/* 例 */
transition: all 0.3s ease 0.1s;
transition: width 0.3s, height 0.5s ease-in;

/* timing-function */
ease        /* 先快后慢 */
linear      /* 匀速 */
ease-in     /* 先慢后快 */
ease-out    /* 先快后慢 */
cubic-bezier(0.4, 0, 0.2, 1)  /* 自定义贝塞尔曲线 */
\`\`\`

### animation 常用属性

\`\`\`css
animation: name duration timing-function delay iteration-count direction fill-mode play-state;

/* 例 */
animation: fadeIn 0.5s ease 0s 1 normal forwards;

@keyframes fadeIn {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
\`\`\`

### 选择建议
- 悬停/点击反馈 → transition
- 加载/持续动画 → animation
- 复杂多帧动画 → animation + @keyframes`
  },
  {
    id: 'css-021',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['动画', '性能', 'transform'],
    question: '如何实现高性能 CSS 动画？哪些属性会触发重排？',
    answer: `### 重排（Reflow）vs 重绘（Repaint）vs 合成

| 操作 | 性能 | 属性示例 |
|------|------|----------|
| **重排** | 最差 | width、height、margin、top、left |
| **重绘** | 中等 | color、background、box-shadow |
| **合成** | 最好 | transform、opacity |

### 高性能动画原则

**只动画 transform 和 opacity**，它们只触发合成层，不引起重排/重绘。

\`\`\`css
/* ❌ 差：触发重排 */
.move {
  transition: left 0.3s, top 0.3s;
}
.move:hover {
  left: 100px;
  top: 100px;
}

/* ✅ 好：只触发合成 */
.move {
  transition: transform 0.3s;
}
.move:hover {
  transform: translate(100px, 100px);
}
\`\`\`

### 常见属性性能分级

| 级别 | 属性 |
|------|------|
| ✅ 合成层 | \`transform\`、\`opacity\`、\`filter\` |
| ⚠️ 重绘 | \`color\`、\`background\`、\`border-color\`、\`box-shadow\` |
| ❌ 重排 | \`width\`、\`height\`、\`margin\`、\`padding\`、\`top\`、\`left\`、\`font-size\` |

### will-change 提示浏览器

\`\`\`css
.animated {
  will-change: transform, opacity;
  /* 提前告知浏览器这些属性会变化，提前优化 */
}

/* 动画结束后移除 */
.animated.done {
  will-change: auto;
}
\`\`\`

### requestAnimationFrame

JS 动画使用 \`requestAnimationFrame\` 而非 \`setInterval\`：

\`\`\`javascript
function animate(element, target) {
  let current = 0
  function step() {
    current += (target - current) * 0.1
    if (Math.abs(target - current) < 0.1) {
      element.style.transform = \`translateX(\${target}px)\`
      return
    }
    element.style.transform = \`translateX(\${current}px)\`
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
\`\`\`

### 最佳实践
1. **优先 CSS 动画**：比 JS 动画性能好（在合成线程执行）
2. **只动 transform/opacity**：避免重排
3. **用 will-change**：对即将动画的元素提前优化
4. **避免过多动画元素**：每个合成层都消耗内存
5. **减少同时动画的元素数量**：尤其在低端设备上`
  },
  {
    id: 'css-022',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['动画', 'keyframes', '加载动画'],
    question: '实现一个常见的加载动画（旋转 + 淡入淡出）',
    answer: `### 1. 旋转加载（最常见）

\`\`\`css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
\`\`\`

### 2. 三点跳动

\`\`\`css
.dots {
  display: flex;
  gap: 8px;
}
.dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3498db;
  animation: bounce 1.4s ease-in-out infinite;
}
.dots span:nth-child(2) { animation-delay: 0.2s; }
.dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}
\`\`\`

### 3. 脉冲效果

\`\`\`css
.pulse {
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%   { transform: scale(0.8); opacity: 1; }
  50%  { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(0.8); opacity: 1; }
}
\`\`\`

### 4. 骨架屏

\`\`\`css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
\`\`\`

### 5. 淡入上滑

\`\`\`css
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 逐个延迟出现 */
.item:nth-child(1) { animation-delay: 0.1s; }
.item:nth-child(2) { animation-delay: 0.2s; }
.item:nth-child(3) { animation-delay: 0.3s; }
\`\`\`

### 6. prefers-reduced-motion 适配

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\``
  },
  {
    id: 'css-023',
    category: 'css',
    module: 'lang',
    difficulty: 'hard',
    tags: ['动画', 'cubic-bezier', '缓动函数'],
    question: 'cubic-bezier 缓动函数的原理是什么？如何自定义？',
    answer: `\`cubic-bezier()\` 定义动画的速度曲线，通过两个控制点决定贝塞尔曲线的形状。

### 语法

\`\`\`css
transition-timing-function: cubic-bezier(x1, y1, x2, y2);
\`\`\`

- \`(x1, y1)\`：第一个控制点
- \`(x2, y2)\`：第二个控制点
- 起点固定为 (0, 0)，终点固定为 (1, 1)
- **x 轴表示时间进度（0~1），y 轴表示动画进度（0~1）**
- x1 和 x2 必须在 0~1 范围内，y 可以超出（产生回弹效果）

### 内置缓动函数对应

\`\`\`css
ease        = cubic-bezier(0.25, 0.1, 0.25, 1)
linear      = cubic-bezier(0, 0, 1, 1)
ease-in     = cubic-bezier(0.42, 0, 1, 1)
ease-out    = cubic-bezier(0, 0, 0.58, 1)
ease-in-out = cubic-bezier(0.42, 0, 0.58, 1)
\`\`\`

### 常用自定义曲线

\`\`\`css
/* 弹性效果（轻微回弹） */
.bounce {
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 苹果风格弹性 */
.apple-ease {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 快速开始，缓慢结束 */
.quick-start {
  transition: all 0.3s cubic-bezier(0.1, 0.9, 0.3, 1);
}

/* Material Design 标准缓动 */
.material-standard {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Material 加速缓动 */
.material-accelerate {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

/* Material 减速缓动 */
.material-decelerate {
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
}
\`\`\`

### y 值超出 [0,1] 的效果

当 y1 或 y2 小于 0 或大于 1 时，动画进度会超出目标值，产生**回弹/弹性**效果：

\`\`\`css
/* y1 = -0.55，动画先超过目标再回弹 */
transform: translateY(-10px);
transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
\`\`\`

### 调试工具
- Chrome DevTools → Animations 面板可以可视化调整贝塞尔曲线
- 在线工具：cubic-bezier.com

### 选择建议
- **UI 交互反馈**：ease-out（快速响应，缓慢结束）
- **入场动画**：cubic-bezier(0.34, 1.56, 0.64, 1)（弹性入场）
- **退场动画**：ease-in（缓慢开始，快速消失）
- **Material Design**：\`cubic-bezier(0.4, 0, 0.2, 1)\``
  },

  // ========== 选择器与优先级 ==========
  {
    id: 'css-024',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['伪类', '伪元素', '::before'],
    question: '伪类和伪元素的区别？常见的有哪些？',
    answer: `### 区别

- **伪类**（:）：选择处于特定**状态**的元素，单冒号
- **伪元素**（::）：创建不存在于 DOM 的**虚拟元素**，双冒号

### 常见伪类

**交互状态：**
\`\`\`css
:hover          /* 鼠标悬停 */
:active         /* 点击瞬间 */
:focus          /* 获得焦点 */
:focus-visible  /* 键盘获得焦点（区分鼠标/键盘） */
:visited        /* 已访问的链接 */
\`\`\`

**结构选择：**
\`\`\`css
:first-child     /* 第一个子元素 */
:last-child      /* 最后一个子元素 */
:nth-child(n)    /* 第 n 个 */
:nth-child(odd)  /* 奇数 */
:nth-child(even) /* 偶数 */
:nth-of-type(n)  /* 同类型第 n 个 */
:only-child      /* 唯一子元素 */
:not(selector)   /* 不匹配的 */
:empty           /* 没有子元素 */
\`\`\`

**表单伪类：**
\`\`\`css
:checked     /* 选中的复选框/单选 */
:disabled    /* 禁用的表单元素 */
:valid       /* 通过验证 */
:invalid     /* 未通过验证 */
:placeholder-shown /* 正在显示 placeholder */
\`\`\`

### 常见伪元素

\`\`\`css
::before     /* 元素内容前插入 */
::after      /* 元素内容后插入 */
::first-letter /* 首字母 */
::first-line   /* 首行 */
::selection    /* 选中的文字 */
::placeholder  /* placeholder 样式 */
::marker       /* 列表标记 */
\`\`\`

### ::before / ::after 使用示例

\`\`\`css
/* 清除浮动 */
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

/* 自定义引号 */
.quote::before { content: '\u201C'; }  /* 左引号 */
.quote::after  { content: '\u201D'; }  /* 右引号 */

/* 工具提示 */
.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  background: black;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip:hover::after { opacity: 1; }

/* 装饰性图标 */
.icon::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('icon.svg');
}
\`\`\`

### 关键点
- 伪元素必须设置 \`content\` 属性才能显示
- 伪元素默认是 \`inline\`，可修改 \`display\`
- 伪类选择的是真实存在的元素，伪元素创建的是虚拟元素
- CSS3 规范伪元素用双冒号 \`::\`，但浏览器也兼容单冒号`
  },
  {
    id: 'css-025',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['CSS变量', '自定义属性', '主题'],
    question: 'CSS 自定义属性（CSS 变量）的用法和优势？',
    answer: `### 基本用法

\`\`\`css
:root {
  --primary-color: #4f46e5;
  --text-size: 16px;
  --spacing: 1rem;
}

.button {
  background: var(--primary-color);
  font-size: var(--text-size);
  padding: var(--spacing);
}

/* 带回退值 */
.text { color: var(--undefined-var, #333); }
\`\`\`

### 优势（vs Sass/Less 变量）

| 特性 | CSS 变量 | Sass/Less 变量 |
|------|----------|----------------|
| 运行时修改 | ✅ | ❌ 编译后固定 |
| JS 读写 | ✅ | ❌ |
| 作用域 | DOM 层级 | 文件层级 |
| 媒体查询内修改 | ✅ | ❌ |
| 继承 | ✅ | ❌ |

### JS 操作 CSS 变量

\`\`\`javascript
// 读取
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary-color')

// 设置
document.documentElement.style.setProperty('--primary-color', '#ff0000')
\`\`\`

### 主题切换

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --border: #e0e0e0;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #ffffff;
  --border: #333333;
}

body {
  background: var(--bg);
  color: var(--text);
}
\`\`\`

\`\`\`javascript
// 切换主题
function toggleTheme() {
  const current = document.documentElement.dataset.theme
  document.documentElement.dataset.theme = current === 'dark' ? 'light' : 'dark'
}
\`\`\`

### 响应式调整

\`\`\`css
:root {
  --font-size: 16px;
}

@media (max-width: 768px) {
  :root {
    --font-size: 14px;
  }
}

/* 所有使用 var(--font-size) 的地方自动响应 */
\`\`\`

### 组件级作用域

\`\`\`css
.card {
  --card-padding: 16px;
  --card-bg: #fff;
  padding: var(--card-padding);
  background: var(--card-bg);
}

.card--highlight {
  --card-bg: #fffbeb;  /* 仅影响此组件 */
}
\`\`\`

### 注意事项
- 变量名大小写敏感：\`--color\` 和 \`--Color\` 不同
- 不能用于属性名，只能用于值
- 空格处理：\`--shadow: 0 2px 4px rgba(0,0,0,.1)\` 正确`
  },

  // ========== BFC/IFC ==========
  {
    id: 'css-026',
    category: 'css',
    module: 'lang',
    difficulty: 'hard',
    tags: ['BFC', 'IFC', '格式化上下文'],
    question: 'BFC、IFC、FFC、GFC 分别是什么？',
    answer: `CSS 中有四种格式化上下文（Formatting Context）：

### BFC — 块级格式化上下文

**Block Formatting Context**

- 块级盒子参与布局的上下文
- 内部盒子垂直排列
- 相邻 BFC 的 margin 不重叠
- BFC 不与浮动重叠

**触发条件：**
\`\`\`css
overflow: hidden | auto | scroll;
display: flex | grid | inline-block | table-cell | flow-root;
position: absolute | fixed;
float: left | right;
\`\`\`

### IFC — 行内格式化上下文

**Inline Formatting Context**

- 行内级盒子参与布局的上下文
- 内部盒子水平排列
- 行内盒子会自动换行

**触发条件：** 块级容器中只包含行内级元素时自动创建。

\`\`\`css
/* IFC 的常见现象 */
.text-container {
  /* 默认就是 IFC */
  /* 行内元素水平排列，高度由 line-height 决定 */
}
\`\`\`

**应用：**
- 文本垂直对齐：\`vertical-align\` 只在 IFC 中生效
- 行内元素居中：\`text-align: center\` 对行内元素生效

### FFC — 弹性格式化上下文

**Flex Formatting Context**

- \`display: flex\` 或 \`display: inline-flex\` 创建
- 子元素成为 flex item
- 弹性盒子参与布局

### GFC — 网格格式化上下文

**Grid Formatting Context**

- \`display: grid\` 或 \`display: inline-grid\` 创建
- 子元素成为 grid item
- 网格项目参与布局

### 对比总结

| 类型 | 触发 | 排列方式 | 典型应用 |
|------|------|----------|----------|
| BFC | overflow/flex 等 | 垂直 | 清除浮动、margin 折叠 |
| IFC | 默认（行内内容） | 水平 | 文本对齐 |
| FFC | display: flex | 弹性 | 一维布局 |
| GFC | display: grid | 网格 | 二维布局 |

### 其他上下文

- **脱离正常流**：\`position: absolute/fixed\` 创建的上下文
- **层叠上下文**（Stacking Context）：z-index 生效的上下文

\`\`\`css
/* 创建层叠上下文 */
.element {
  position: relative;
  z-index: 1;  /* 非 auto */
}
/* 或 */
.element {
  opacity: 0.9;
  transform: translateZ(0);
  filter: blur(0);
}
\`\`\``
  },
  {
    id: 'css-027',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['margin', '折叠', '间距'],
    question: 'margin 折叠（合并）的规则是什么？如何避免？',
    answer: `### margin 折叠规则

相邻的**垂直方向** margin 会合并（取较大值），**水平方向**不折叠。

### 三种折叠场景

**1. 相邻兄弟元素**
\`\`\`css
.box1 { margin-bottom: 20px; }
.box2 { margin-top: 30px; }
/* 间距 = max(20, 30) = 30px，不是 50px */
\`\`\`

**2. 父元素与第一个/最后一个子元素**
\`\`\`css
.parent { margin-top: 20px; }
.child { margin-top: 30px; }
/* parent 的上 margin = max(20, 30) = 30px */
\`\`\`

**3. 空块元素自身的上下 margin**
\`\`\`css
.empty {
  margin-top: 20px;
  margin-bottom: 30px;
  /* 如果没有内容、padding、border，上下 margin 合并为 30px */
}
\`\`\`

### 折叠条件
- 都是**块级元素**（非浮动、非绝对定位）
- 在**正常的文档流**中
- 在**垂直方向**上相邻

### 如何避免

**1. 父元素创建 BFC**
\`\`\`css
.parent {
  overflow: hidden;
  /* 或 display: flow-root; */
}
\`\`\`

**2. 添加 border 或 padding**
\`\`\`css
.parent {
  border-top: 1px solid transparent;
  /* 或 */
  padding-top: 1px;
}
\`\`\`

**3. 使用 Flex/Grid 布局**
\`\`\`css
.parent {
  display: flex;
  flex-direction: column;
}
/* Flex/Grid 中不存在 margin 折叠 */
\`\`\`

**4. 使用 gap 代替 margin**
\`\`\`css
.parent {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
\`\`\`

**5. 浮动或绝对定位**
\`\`\`css
.child {
  float: left;
  /* 或 position: absolute; */
  /* 浮动/绝对定位元素不参与 margin 折叠 */
}
\`\`\`

### 负 margin 折叠
\`\`\`css
.box1 { margin-bottom: 20px; }
.box2 { margin-top: -10px; }
/* 间距 = 20 + (-10) = 10px（正负取和） */

.box1 { margin-bottom: -20px; }
.box2 { margin-top: -10px; }
/* 间距 = min(-20, -10) = -20px（都是负值取绝对值较大的） */
\`\`\``
  },
  {
    id: 'css-028',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['层叠上下文', 'z-index', '层级'],
    question: '什么是层叠上下文？z-index 的层叠规则是什么？',
    answer: `**层叠上下文**（Stacking Context）是 CSS 中决定元素在 z 轴上渲染顺序的概念。

### 创建层叠上下文的条件

1. **根元素** \`<html>\`（天然是层叠上下文）
2. **position** 非 static + **z-index** 非 auto
3. **opacity** < 1
4. **transform** 非 none
5. **filter** 非 none
6. **will-change** 设为上述属性
7. **isolation: isolate**
8. **mix-blend-mode** 非 normal
9. \`display: flex/grid\` 子项 + z-index 非 auto

### 层叠顺序（从低到高）

\`\`\`
1. 层叠上下文的背景和边框
2. 负 z-index
3. 块级盒子（正常流）
4. 浮动盒子
5. 行内盒子（正常流）
6. z-index: 0 / auto
7. 正 z-index
\`\`\`

### 关键规则

**z-index 只在同一层叠上下文内比较！**

\`\`\`html
<div style="position:relative; z-index:1">
  <div style="position:relative; z-index:9999">A</div>
</div>
<div style="position:relative; z-index:2">
  <div style="position:relative; z-index:1">B</div>
</div>
\`\`\`

- 父1 (z-index:1) vs 父2 (z-index:2) → 父2 在上
- 虽然 A 的 z-index:9999 很大，但它只在父1内部生效
- **B 在 A 之上**（因为父2 > 父1）

### 常见问题

**1. 弹窗被遮挡**
\`\`\`css
/* 如果父元素创建了层叠上下文，子元素的 z-index 再大也出不去 */
.parent {
  transform: translateZ(0);  /* 创建了层叠上下文 */
  z-index: 1;
}
.modal {
  z-index: 9999;  /* 只在 parent 内部有效 */
}
\`\`\`

**2. 解决方案**
- 将弹窗移到父元素外面（Portal）
- 移除父元素创建层叠上下文的属性
- 提升父元素的 z-index

### 调试技巧
- Chrome DevTools → Elements 面板可查看层叠上下文
- 避免滥用 z-index，用 DOM 顺序和 flex/grid 的 order 代替`
  },
  {
    id: 'css-029',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['清除浮动', 'float', '布局'],
    question: '为什么需要清除浮动？有哪些清除浮动的方法？',
    answer: `### 问题原因

子元素设置 \`float\` 后脱离文档流，父元素高度不会包含浮动子元素，导致父元素高度塌陷。

\`\`\`css
/* 父元素高度为 0 */
.container {
  border: 1px solid #ccc;
}
.float-child {
  float: left;
  width: 100px;
  height: 100px;
}
\`\`\`

### 清除浮动的方法

**1. display: flow-root（推荐，最简洁）**

\`\`\`css
.container {
  display: flow-root;
}
\`\`\`

**2. overflow: hidden（经典方案）**

\`\`\`css
.container {
  overflow: hidden;
  /* 或 auto / scroll */
}
\`\`\`
⚠️ 缺点：可能裁剪定位元素或显示不必要的滚动条

**3. clearfix 伪元素（最通用）**

\`\`\`css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

/* 更完整的版本 */
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
}
.clearfix::after {
  clear: both;
}
\`\`\`

**4. 额外标签法（不推荐）**

\`\`\`html
<div class="container">
  <div class="float-child">浮动元素</div>
  <div style="clear: both"></div>
</div>
\`\`\`

**5. 父元素也浮动（不推荐）**

\`\`\`css
.container {
  float: left;
  /* 缺点：影响父元素自身的布局 */
}
\`\`\`

### 方法对比

| 方法 | 代码量 | 副作用 | 兼容性 |
|------|--------|--------|--------|
| flow-root | 最少 | 无 | Chrome 57+、Firefox 53+ |
| overflow: hidden | 少 | 可能裁剪内容 | 全兼容 |
| clearfix 伪元素 | 中 | 无 | 全兼容 |
| 额外标签 | 少 | 多余 DOM | 全兼容 |

### 现代开发建议
- **Flex/Grid 布局基本不需要清除浮动**
- 如果必须用 float，使用 \`display: flow-root\` 或 clearfix 伪元素
- float 的正当用途：文字环绕图片

\`\`\`css
/* float 的正确用途 */
.article img {
  float: left;
  margin-right: 16px;
}
\`\`\``
  },
  {
    id: 'css-030',
    category: 'css',
    module: 'lang',
    difficulty: 'hard',
    tags: ['CSS架构', 'BEM', 'CSS Modules', 'Tailwind'],
    question: 'CSS 命名和架构方案有哪些？BEM、CSS Modules、CSS-in-JS、Tailwind 的优缺点？',
    answer: `### 1. BEM（Block Element Modifier）

\`\`\`css
/* 块__元素--修饰符 */
.card { }
.card__title { }
.card__body { }
.card--featured { }
.card__title--large { }
\`\`\`

- ✅ 语义清晰、避免冲突
- ❌ 名称冗长、需要手动维护

### 2. CSS Modules

\`\`\`css
/* Button.module.css */
.button { background: blue; }
.active { background: red; }
\`\`\`

\`\`\`jsx
import styles from './Button.module.css'
<button className={styles.button}>Click</button>
\`\`\`

- ✅ 编译时自动生成唯一类名，天然隔离
- ✅ 配合构建工具零配置
- ❌ 不能动态切换样式（需要条件 className）

### 3. CSS-in-JS（styled-components / Emotion）

\`\`\`jsx
const Button = styled.button\`
  background: \${props => props.primary ? 'blue' : 'gray'};
  padding: 8px 16px;
\`
<Button primary>Click</Button>
\`\`\`

- ✅ 动态样式、组件级隔离、JS 变量复用
- ❌ 运行时开销、调试困难、增加包体积
- ❌ SSR 处理复杂

### 4. Tailwind CSS（原子化 CSS）

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Click
</button>
\`\`\`

- ✅ 不用命名、开发速度快、包体积小（PurgeCSS）
- ✅ 统一设计系统
- ❌ HTML 结构臃肿、学习曲线
- ❌ 复杂动画和特殊样式不便

### 5. Scoped CSS（Vue）

\`\`\`vue
<style scoped>
.button { background: blue; }
</style>
\`\`\`

- ✅ Vue 原生支持、简单
- ❌ 子组件穿透需要 :deep()

### 对比总结

| 方案 | 隔离性 | 动态样式 | 开发速度 | 包体积 | 适合场景 |
|------|--------|----------|----------|--------|----------|
| BEM | 依赖命名 | ❌ | 中 | 小 | 传统项目 |
| CSS Modules | ✅ 编译时 | ❌ | 快 | 小 | React 项目 |
| CSS-in-JS | ✅ 运行时 | ✅ | 快 | 大 | 动态主题 |
| Tailwind | ❌ | ❌ | 最快 | 最小 | 快速开发 |
| Scoped | ✅ | ❌ | 快 | 小 | Vue 项目 |

### 选择建议
- **Vue 项目**：Scoped CSS 或 CSS Modules
- **React 项目**：CSS Modules 或 Tailwind
- **设计系统**：CSS-in-JS（动态主题）
- **快速原型**：Tailwind
- **遗留项目**：BEM + Sass`,
  },
  {
    id: 'css-031',
    category: 'css',
    module: 'lang',
    difficulty: 'medium',
    tags: ['调试', 'CSS', '优先级', '排查'],
    question: '给页面新增了一段 CSS 样式，但页面没有任何变化，你会如何系统性地排查？',
    answer: `按「从外到内、从存在到生效」的顺序排查：

### 1. 样式文件是否真的加载了
- 打开 DevTools -> Network，确认 CSS 文件 **200** 且内容包含你写的规则（排除路径写错、被缓存、构建未生效）。
- 确认引入位置：\`<link>\` 在 \`<head>\`，或 \`import\` 被打包进产物。

### 2. 选择器是否真的命中元素
- 在 Elements 面板选中目标元素，看右边 **Styles** 里有没有你的规则；没有则说明**选择器没匹配上**。
- 常见原因：类名拼错、动态 class（Vue \`:class\` / React \`className\`）、伪类写错、后代层级不对。

### 3. 被更高优先级覆盖（最常见）
- 同面板里被划掉的样式（line-through）就是被覆盖的规则。
- 优先级：\`!important\` > 行内 style > ID > 类/属性/伪类 > 元素。
- 检查是否有重复选择器、后写的同名规则、或 UI 库 / Scoped 样式干扰。

### 4. 属性是否真的会生效
- 目标元素是否为 \`display: inline\`（\`width/height/margin-top\` 不生效）。
- 父元素 \`overflow: hidden\` 把内容裁掉、\`opacity: 0\`、\`visibility: hidden\`、\`z-index\` 被遮挡。
- 动画/过渡未触发、\`@media\` 条件不满足（如宽度断点没命中）。

### 5. 缓存与构建
- 强制刷新（Ctrl/Cmd + Shift + R）排除浏览器缓存。
- 确认构建工具（Vite/Webpack）重新编译，Sass/Less 变量未覆盖。

> 口诀：**先确认加载 -> 再确认命中 -> 再看是否被覆盖 -> 最后看属性本身是否生效**。`
  },
  {
    id: 'css-032',
    category: 'css',
    module: 'lang',
    difficulty: 'easy',
    tags: ['text-overflow', '省略号', '文本截断', '布局'],
    question: '如何实现单行、多行文本超长时显示省略号（...）？',
    answer: `### 单行省略号（三件套，缺一不可）

\`\`\`css
.ellipsis {
  white-space: nowrap;          /* 不换行 */
  overflow: hidden;             /* 超出隐藏 */
  text-overflow: ellipsis;      /* 省略号 */
  width: 200px;                 /* 必须有宽度限制 */
}
\`\`\`

### 多行省略号（WebKit 方案，-webkit-line-clamp）

\`\`\`css
.clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;        /* 最多显示 2 行 */
  overflow: hidden;
}
\`\`\`

> 注意：\`-webkit-line-clamp\` 依赖 \`-webkit-box\`，现代浏览器（Chrome/Edge/Safari）普遍支持，Firefox 较新版本也已支持。

### 常见误区
- 忘记设 \`width\` 或 \`max-width\`：弹性布局里元素可能被内容撑开，省略号不触发。
- 父级 \`display: flex\` 时，子项要加 \`min-width: 0\` 才能让省略号生效（flex 子项默认 \`min-width: auto\` 不收缩）。`
  },
]
