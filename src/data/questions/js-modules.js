// JS 模块化面试题 — 20 题
export const jsModulesQuestions = [
  {
    id: 'mod-001',
    category: 'javascript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['CommonJS', 'ESM', '对比'],
    question: 'CommonJS 和 ES Modules 的区别是什么？',
    answer: `### 核心区别

| 特性 | CommonJS (CJS) | ES Modules (ESM) |
|------|----------------|-------------------|
| 语法 | \`require/module.exports\` | \`import/export\` |
| 加载方式 | **运行时**动态加载 | **编译时**静态分析 |
| 输出 | 值的**拷贝** | 值的**引用** |
| this | \`this === module.exports\` | \`this === undefined\` |
| 循环依赖 | 返回已执行部分 | 引用绑定 |
| 顶层 this | module.exports | undefined |
| 动态导入 | \`require()\` | \`import()\` |
| 适用 | Node.js 服务端 | 浏览器 + Node.js |

### 值拷贝 vs 值引用

**CommonJS — 值拷贝：**
\`\`\`javascript
// lib.js
let count = 0
function increment() { count++ }
module.exports = { count, increment }

// app.js
const { count, increment } = require('./lib')
increment()
console.log(count) // 0（拷贝，不受影响）
\`\`\`

**ESM — 值引用：**
\`\`\`javascript
// lib.mjs
export let count = 0
export function increment() { count++ }

// app.mjs
import { count, increment } from './lib.mjs'
increment()
console.log(count) // 1（引用，同步变化）
\`\`\`

### 动态加载

\`\`\`javascript
// CJS：require 是同步的
const lib = condition ? require('./a') : require('./b')

// ESM：import 是静态的，但可以用 import() 动态加载
const lib = await import(condition ? './a.mjs' : './b.mjs')
\`\`\`

### 导出方式

\`\`\`javascript
// CJS
module.exports = { add, sub }     // 对象导出
module.exports.add = add            // 单个导出
module.exports = function() {}      // 函数导出

// ESM
export { add, sub }                 // 命名导出
export default function() {}         // 默认导出
export const PI = 3.14              // 内联导出
\`\`\`

### 导入方式

\`\`\`javascript
// CJS
const { add } = require('./math')   // 解构导入
const math = require('./math')       // 整体导入

// ESM
import { add } from './math.mjs'     // 命名导入
import math from './math.mjs'        // 默认导入
import * as math from './math.mjs'   // 命名空间导入
import './polyfill.mjs'              // 副作用导入
\`\`\`

### Node.js 中的模块识别

\`\`\`json
// package.json
{
  "type": "module"   // .js 文件作为 ESM 处理
  // 或 "type": "commonjs"  // 默认
}

// 文件扩展名
.js   → 取决于 package.json type
.mjs  → 始终 ESM
.cjs  → 始终 CommonJS
\`\`\`

### 互操作

\`\`\`javascript
// ESM 中导入 CJS
import pkg from 'commonjs-package'  // pkg === module.exports

// CJS 中导入 ESM（异步）
const esm = await import('./esm-module.mjs')
\`\`\`

### Tree Shaking

- **CJS 不支持**：require 是动态的，无法静态分析
- **ESM 支持**：import/export 是静态的，打包工具可以分析依赖关系

### 最佳实践
- 新项目一律使用 ESM
- 发布库时提供 ESM 和 CJS 两种入口
- Node.js 用 \`.mjs\` 或 \`"type": "module"\``
  },
  {
    id: 'mod-002',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['CommonJS', 'require', '模块加载'],
    question: 'CommonJS 的 require 加载过程是怎样的？',
    answer: `### require 的执行过程

\`\`\`
require(X) 
  → 路径解析（Module._resolveFilename）
  → 检查缓存（Module._cache）
  → 创建模块实例
  → 编译执行（Module.prototype._compile）
  → 返回 module.exports
\`\`\`

### 1. 路径解析

\`\`\`javascript
require('express')     // 从 node_modules 查找
require('./lib')       // 相对路径
require('/abs/path')   // 绝对路径
require('path')        // 内置模块
\`\`\`

查找顺序：
\`\`\`
1. 内置模块（fs, path, http...）
2. node_modules/（从当前目录向上逐级查找）
   ./node_modules → ../node_modules → ../../node_modules → ...
3. 文件扩展名补全：.js → .json → .node
4. 目录：package.json 的 main 字段 → index.js
\`\`\`

### 2. 模块缓存

\`\`\`javascript
// 模块首次加载后缓存在 require.cache 中
const a1 = require('./lib')
const a2 = require('./lib')
console.log(a1 === a2)  // true（同一个实例）

// 清除缓存
delete require.cache[require.resolve('./lib')]
\`\`\`

### 3. 模块包装

Node.js 将模块代码包裹在函数中：

\`\`\`javascript
// 原始模块代码
const x = 1
module.exports = { x }

// Node.js 实际执行
(function(exports, require, module, __filename, __dirname) {
  const x = 1
  module.exports = { x }
})
\`\`\`

这解释了为什么模块中有 \`require\`、\`module\`、\`__dirname\` 等变量。

### 4. module.exports vs exports

\`\`\`javascript
// module.exports 和 exports 初始指向同一对象
exports === module.exports  // true

// ✅ 添加属性
exports.add = function() {}        // 等同于 module.exports.add = ...
module.exports.add = function() {} // 同上

// ✅ 整体替换
module.exports = { add: function() {} }

// ❌ 错误：exports 不再指向 module.exports
exports = { add: function() {} }  // 无效！require 返回空对象
\`\`\`

### 手写简化 require

\`\`\`javascript
function myRequire(filename) {
  // 1. 解析绝对路径
  const path = require.resolve(filename)
  
  // 2. 检查缓存
  if (myRequire.cache[path]) {
    return myRequire.cache[path].exports
  }
  
  // 3. 创建模块
  const module = { exports: {} }
  myRequire.cache[path] = module
  
  // 4. 包装执行
  const wrapper = Module.wrap(fs.readFileSync(path, 'utf-8'))
  const compiledFn = new Function('module', 'exports', 'require', wrapper)
  compiledFn(module, module.exports, myRequire)
  
  return module.exports
}
myRequire.cache = {}
\`\`\`

### 关键特性
- **同步加载**：require 会阻塞直到模块加载完成
- **单例模式**：模块只执行一次，后续 require 返回缓存
- **值的拷贝**：导出的是值的复制，不是引用`
  },
  {
    id: 'mod-003',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['ESM', 'import', '静态分析'],
    question: 'ESM 的 import 是如何解析和加载的？',
    answer: `### ESM 加载流程

\`\`\`
1. Construction（构造）：下载并解析模块文件，建立模块记录
2. Instantiation（实例化）：创建模块环境，建立导入导出绑定
3. Evaluation（求值）：执行模块顶层代码
\`\`\`

### 与 CommonJS 的关键区别

CommonJS 的步骤是**交织**的：加载→执行→导出，同步完成。
ESM 的步骤是**分离**的：先加载所有依赖，再建立绑定，最后执行。

### 1. Construction 阶段

\`\`\`javascript
// ESM 在执行前先解析整个依赖树
import a from './a.mjs'  // a.mjs 中可能还有 import
import b from './b.mjs'

// 1. 解析入口模块
// 2. 发现 import，递归解析依赖
// 3. 建立模块依赖图
// 4. 所有模块都下载并解析完成
\`\`\`

### 2. Instantiation 阶段

建立导入导出的**内存绑定**（不是拷贝）：

\`\`\`javascript
// lib.mjs
export let count = 0      // 在内存中分配
export function inc() { count++ }

// app.mjs
import { count, inc } from './lib.mjs'
// count 是对 lib.mjs 中 count 的引用绑定
inc()
console.log(count)  // 1（实时反映变化）
\`\`\`

### 3. Evaluation 阶段

按依赖顺序**从底向上**执行模块代码：

\`\`\`
app.mjs → 依赖 lib.mjs → 先执行 lib.mjs → 再执行 app.mjs
\`\`\`

### 静态 import 的限制

\`\`\`javascript
// ✅ 静态分析：import 路径必须是字符串字面量
import { add } from './math.mjs'

// ❌ 不能用变量
import { add } from variable  // 语法错误

// ❌ 不能在条件语句中
if (condition) {
  import { add } from './math.mjs'  // 语法错误
}

// ❌ 不能在函数中
function load() {
  import { add } from './math.mjs'  // 语法错误
}
\`\`\`

### 动态 import()

\`\`\`javascript
// import() 是异步的，返回 Promise
const module = await import('./math.mjs')
console.log(module.add(1, 2))

// 条件加载
if (feature === 'advanced') {
  const advanced = await import('./advanced.mjs')
  advanced.run()
}

// 按需加载（路由懒加载）
const Dashboard = lazy(() => import('./Dashboard'))
\`\`\`

### import.meta

\`\`\`javascript
// 获取当前模块的元信息
console.log(import.meta.url)  // 模块文件的 URL

// 在 Node.js 中
import { dirname } from 'path'
const __dirname = dirname(new URL(import.meta.url).pathname)
\`\`\`

### 导入导出的绑定

\`\`\`javascript
// Named export
export const PI = 3.14
export function add(a, b) { return a + b }

// Default export（每个模块只能一个）
export default class User {}

// Re-export
export { add } from './math.mjs'           // 重新导出
export { default as User } from './user.mjs' // 重命名默认导出
export * from './utils.mjs'                  // 导出全部（不含 default）

// Import 时重命名
import { add as plus } from './math.mjs'
import { default as User } from './user.mjs'
import User from './user.mjs'                // 简写
\`\`\`

### 浏览器中加载 ESM

\`\`\`html
<!-- 内联 ESM -->
<script type="module">
  import { add } from './math.mjs'
  console.log(add(1, 2))
</script>

<!-- 外部 ESM -->
<script type="module" src="./app.mjs"></script>

<!-- Nomodule 降级 -->
<script nomodule>
  alert('请使用支持 ESM 的浏览器')
</script>
\`\`\`

### 关键点
- ESM 默认**严格模式**（\`'use strict'\` 不需要手写）
- 顶层 \`this\` 是 \`undefined\`（CJS 是 \`module.exports\`）
- ESM 是**异步**加载的（Construction 阶段可以并行下载）`
  },
  {
    id: 'mod-004',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['CommonJS', 'ESM', '互操作'],
    question: 'CommonJS 和 ESM 如何互操作（互导）？有什么坑？',
    answer: `### ESM 导入 CJS

\`\`\`javascript
// CJS 模块 (math.cjs)
module.exports = { add: (a, b) => a + b, PI: 3.14 }

// ESM 导入
import math from './math.cjs'       // default 导入 = module.exports
console.log(math.add(1, 2))          // 3

// 命名导入（Node.js 支持，但有坑）
import { add } from './math.cjs'     // 可能可以，取决于环境
\`\`\`

### 坑 1：命名导入不一定可用

CJS 的 \`module.exports\` 是运行时确定的，ESM 的 \`import {}\` 是编译时确定的。Node.js 通过静态分析尝试提供命名导入，但不保证成功：

\`\`\`javascript
// CJS 动态导出（ESM 无法静态分析）
if (condition) {
  module.exports = { a: 1 }
} else {
  module.exports = { b: 2 }
}

// ESM 中命名导入可能失败
import { a } from './dynamic.cjs'  // 可能报错或 undefined
\`\`\`

**安全做法：**
\`\`\`javascript
import pkg from './math.cjs'
const { add, PI } = pkg  // 运行时解构
\`\`\`

### CJS 导入 ESM

CJS 不能用 \`require\` 加载 ESM（因为 ESM 是异步的），必须用 \`import()\`：

\`\`\`javascript
// CJS 中加载 ESM
async function load() {
  const mod = await import('./math.mjs')
  console.log(mod.add(1, 2))
}
load()
\`\`\`

### 坑 2：default 导出差异

\`\`\`javascript
// ESM 模块
export default { add: (a, b) => a + b }

// CJS 中 import()
const mod = await import('./math.mjs')
console.log(mod.default.add(1, 2))  // 需要通过 .default
console.log(mod.add)                 // undefined（没有命名导出 add）
\`\`\`

### 坑 3：__dirname 和 __filename

ESM 中没有 \`__dirname\` 和 \`__filename\`：

\`\`\`javascript
// CJS
console.log(__dirname)  // /path/to/dir
console.log(__filename) // /path/to/dir/file.js

// ESM 替代方案
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
\`\`\`

### 坑 4：JSON 导入

\`\`\`javascript
// CJS
const config = require('./config.json')  // ✅ 直接可用

// ESM（需要 assert 语法）
import config from './config.json' with { type: 'json' }
// 或旧语法
import config from './config.json' assert { type: 'json' }

// 兼容方案：读取文件
import { readFileSync } from 'fs'
const config = JSON.parse(readFileSync('./config.json', 'utf-8'))
\`\`\`

### 坑 5：require.resolve

\`\`\`javascript
// CJS
const path = require.resolve('./module')

// ESM 需要使用 import.meta.resolve（实验性）
const path = import.meta.resolve('./module')
\`\`\`

### 双格式包（Dual Package）

同时提供 CJS 和 ESM 两种入口：

\`\`\`json
// package.json
{
  "name": "my-lib",
  "exports": {
    "import": "./dist/index.mjs",   // ESM 入口
    "require": "./dist/index.cjs"    // CJS 入口
  }
}
\`\`\`

### 最佳实践
1. 新项目一律使用 ESM
2. 库项目提供双格式包
3. ESM 中导入 CJS 用 default import + 解构
4. 避免在 ESM 中依赖 \`require\``
  },
  {
    id: 'mod-005',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['循环依赖', 'CommonJS', 'ESM'],
    question: '模块循环依赖（Circular Dependency）是什么？CJS 和 ESM 如何处理？',
    answer: `### 循环依赖

模块 A 依赖 B，B 又依赖 A，形成循环。

\`\`\`
A → B → A → B → ...（循环）
\`\`\`

### CommonJS 的处理

CJS 返回**已执行部分**的导出：

\`\`\`javascript
// a.js
console.log('a 开始')
const b = require('./b')
console.log('b in a:', b)
module.exports = { a: 1 }

// b.js
console.log('b 开始')
const a = require('./a')  // a 尚未执行完，返回 {}
console.log('a in b:', a)  // {}
module.exports = { b: 2 }

// 执行 require('./a')
// 输出:
// a 开始
// b 开始
// a in b: {}        ← a 的 exports 是空对象（还没执行 module.exports）
// b in a: { b: 2 }
\`\`\`

### ESM 的处理

ESM 返回**引用绑定**，可以获取最终值：

\`\`\`javascript
// a.mjs
import { b } from './b.mjs'
export const a = 1
console.log('a 执行, b =', b)  // b 的值取决于加载顺序

// b.mjs
import { a } from './a.mjs'
export const b = 2
console.log('b 执行, a =', a)  // a 可能是 undefined（TDZ）
\`\`\`

ESM 的执行顺序：
1. 先解析所有模块
2. 建立 import/export 绑定
3. 从入口开始执行
4. 遇到循环时，被引用的变量处于 TDZ（暂时性死区），访问会报错

\`\`\`javascript
// ESM 循环依赖示例
// a.mjs
import { b } from './b.mjs'
export const a = b + 1  // ❌ ReferenceError: Cannot access 'b' before initialization

// b.mjs
import { a } from './a.mjs'
export const b = a + 1  // ❌ 同样报错
\`\`\`

### 解决方案

**1. 延迟访问（函数包装）**

\`\`\`javascript
// CJS 方案
// a.js
const b = require('./b')
function getB() { return b.value }  // 延迟到运行时访问
module.exports = { getB }

// ESM 方案
// a.mjs
import { b } from './b.mjs'
export function getB() { return b }  // 函数执行时 b 已初始化
\`\`\`

**2. 重构代码（推荐）**

将循环依赖的部分提取到第三个模块：

\`\`\`
// 原来: A ↔ B
// 重构: A → C ← B
\`\`\`

**3. 事件/回调模式**

\`\`\`javascript
// 用事件解耦
// a.js
const { EventBus } = require('./eventBus')
EventBus.on('b-ready', (b) => { /* 使用 b */ })

// b.js
const { EventBus } = require('./eventBus')
module.exports = { b: 2 }
EventBus.emit('b-ready', module.exports)
\`\`\`

### 对比

| 特性 | CJS | ESM |
|------|-----|-----|
| 循环时返回 | 已执行的部分（可能空对象）| 引用绑定（可能 TDZ）|
| 函数内访问 | ✅ 可以（延迟访问）| ✅ 可以 |
| 顶层访问 | 部分值 | 可能 TDZ 报错 |
| 最佳解决 | 延迟访问 / 重构 | 延迟访问 / 重构 |

### 最佳实践
- **避免循环依赖**（重构代码架构）
- 必要时用**延迟访问**（函数包装）
- 使用工具检测循环依赖（\`circular-dependency-plugin\`、\`madge\`）`
  },
  {
    id: 'mod-006',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['模块加载机制', 'Node.js', '路径解析'],
    question: 'Node.js 模块加载的路径解析规则是怎样的？',
    answer: `### require 路径解析

\`\`\`javascript
require('fs')           // 内置模块
require('express')      // node_modules 中的包
require('./lib')        // 相对路径
require('/abs/path')    // 绝对路径
\`\`\`

### 1. 内置模块

\`\`\`javascript
require('fs')       // 直接返回内置模块
require('path')     // 最高优先级，不查找 node_modules
\`\`\`

### 2. 相对/绝对路径

\`\`\`javascript
require('./lib')
// 解析为 /当前目录/lib
// 然后尝试：
// 1. /当前目录/lib（精确文件）
// 2. /当前目录/lib.js
// 3. /当前目录/lib.json
// 4. /当前目录/lib.node
// 5. /当前目录/lib/index.js（目录）
// 6. /当前目录/lib/package.json 的 main 字段
\`\`\`

### 3. node_modules 查找

\`\`\`javascript
require('express')
// 从当前目录向上逐级查找 node_modules：
// /home/user/project/node_modules/express
// /home/user/node_modules/express
// /home/node_modules/express
// /node_modules/express
\`\`\`

### 4. 目录加载

\`\`\`javascript
require('./utils')
// 如果 utils 是目录：
// 1. 读取 utils/package.json 的 main 字段
// 2. 如果没有 main，默认 index.js
// 3. 尝试 utils/index.js
\`\`\`

\`\`\`json
// package.json
{
  "name": "utils",
  "main": "./lib/index.js"  // require('./utils') 加载此文件
}
\`\`\`

### exports 字段（Node.js 12+）

\`\`\`json
// package.json
{
  "name": "my-pkg",
  "exports": {
    ".": "./dist/index.js",           // require('my-pkg')
    "./utils": "./dist/utils.js",      // require('my-pkg/utils')
    "./package.json": "./package.json"
  }
}
\`\`\`

exports 比 main 更强大：
- 可以定义子路径
- 可以区分 CJS/ESM
- 未在 exports 中定义的路径不可访问

### 条件导出

\`\`\`json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",    // ESM 入口
      "require": "./dist/index.cjs",   // CJS 入口
      "default": "./dist/index.cjs"    // 降级
    }
  }
}
\`\`\`

### ESM 的 import 解析

ESM 解析规则类似但有不同：

\`\`\`javascript
// ESM 必须写扩展名（浏览器中）
import './lib.js'     // ✅
import './lib'        // ❌（浏览器中报错，Node.js 中可以）

// Node.js 中 ESM 的解析
import './lib.mjs'    // 明确 ESM
import 'express'      // 从 node_modules 查找
\`\`\`

### 解析调试

\`\`\`javascript
// 查看模块解析路径
console.log(require.resolve.paths('express'))
// ['/home/user/project/node_modules', '/home/user/node_modules', ...]

// 查看实际加载的文件
console.log(require.resolve('express'))
// '/home/user/project/node_modules/express/index.js'

// require.resolve 的选项
require.resolve('./lib', {
  paths: ['/custom/path']  // 自定义查找路径
})
\`\`\`

### NODE_PATH

\`\`\`bash
# 环境变量指定额外查找路径（不推荐）
NODE_PATH=/custom/modules node app.js
\`\`\`

### 总结
1. 内置模块最高优先级
2. 相对/绝对路径直接解析
3. 包名从 node_modules 向上查找
4. 文件扩展名自动补全：.js → .json → .node
5. 目录默认加载 index.js 或 package.json 的 main
6. exports 字段提供更精细的控制`
  },
  {
    id: 'mod-007',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Tree Shaking', '副作用', '构建'],
    question: 'Tree Shaking 的原理和注意事项？（详见 BE-019 补充）',
    answer: `### Tree Shaking 前提条件

1. **使用 ESM**（CommonJS 不支持）
2. **生产模式构建**
3. **标记 sideEffects**

### sideEffects 详解

\`\`\`json
// package.json
{
  "sideEffects": false  // 所有文件都是纯的，可安全 Tree Shake
}
\`\`\`

什么算副作用：
\`\`\`javascript
// ✅ 无副作用：纯导出
export function add(a, b) { return a + b }

// ❌ 有副作用：修改全局状态
window.myGlobal = 'hello'

// ❌ 有副作用：修改原型
Array.prototype.myMethod = function() {}

// ❌ 有副作用：CSS（引入时执行了样式注入）
import './style.css'

// ❌ 有副作用：polyfill
import 'core-js/stable'
\`\`\`

指定有副作用的文件：
\`\`\`json
{
  "sideEffects": ["*.css", "*.scss", "./src/polyfills.js"]
}
\`\`\`

### Tree Shaking 实际效果

\`\`\`javascript
// math.js
export function add(a, b) { return a + b }      // 被使用
export function subtract(a, b) { return a - b }  // 未使用，被摇除
export function multiply(a, b) { return a * b }  // 未使用，被摇除

// app.js
import { add } from './math.js'
console.log(add(1, 2))

// 打包结果：只有 add，没有 subtract 和 multiply
\`\`\`

### 注意事项

1. **类的方法不会被摇除**
\`\`\`javascript
export class Calculator {
  used() { return 1 }
  unused() { return 2 }  // 不会被摇除
}
\`\`\`

2. **函数有副作用时不摇除**
\`\`\`javascript
export function init() {
  console.log('init')  // 副作用，不会被摇除
}
\`\`\`

3. **动态导入不摇除**
\`\`\`javascript
import(dynamicPath)  // 无法静态分析
\`\`\`

4. **整包导入不摇除**
\`\`\`javascript
import _ from 'lodash'  // 整个 lodash 被打包
import { debounce } from 'lodash-es'  // 只打包 debounce ✅
\`\`\``
  },
  {
    id: 'mod-008',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['动态导入', 'import()', '代码分割'],
    question: '动态 import() 的使用场景和注意事项？',
    answer: `\`import()\` 是 ESM 的动态加载语法，返回 Promise，用于按需加载模块。

### 基本用法

\`\`\`javascript
// 静态导入（编译时加载）
import { add } from './math.js'

// 动态导入（运行时加载）
const module = await import('./math.js')
console.log(module.add(1, 2))
\`\`\`

### 使用场景

**1. 路由懒加载**
\`\`\`javascript
// React
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

// Vue
const routes = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/about', component: () => import('./pages/About.vue') }
]
\`\`\`

**2. 条件加载**
\`\`\`javascript
if (featureFlags.advanced) {
  const advanced = await import('./features/advanced.js')
  advanced.init()
}
\`\`\`

**3. 按需加载大依赖**
\`\`\`javascript
// 只在需要时加载 PDF 库
async function exportPDF() {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  doc.text('Hello', 10, 10)
  doc.save()
}
\`\`\`

**4. 加载语言包**
\`\`\`javascript
async function setLanguage(lang) {
  const messages = await import(\`./locales/\${lang}.js\`)
  i18n.setLocaleMessage(lang, messages.default)
}
\`\`\`

### import() 与代码分割

构建工具遇到 \`import()\` 会自动创建单独的 chunk：

\`\`\`javascript
// 构建前
import('./heavy.js').then(module => {
  module.run()
})

// 构建后生成：
// main.js（入口 chunk）
// heavy.[hash].js（单独 chunk，按需加载）
\`\`\`

### 预加载提示

\`\`\`javascript
// Webpack magic comments
const module = import(
  /* webpackChunkName: "dashboard" */
  /* webpackPrefetch: true */  // 空闲时预加载
  './Dashboard'
)

/* webpackPreload: true */  // 与父 chunk 并行加载
\`\`\`

### prefetch vs preload

- **prefetch**：浏览器空闲时加载（将来可能用到）
- **preload**：与当前页面并行加载（马上会用到）

\`\`\`html
<!-- HTML 中的 prefetch/preload -->
<link rel="prefetch" href="/next-page.js">
<link rel="preload" href="/critical.js" as="script">
\`\`\`

### 动态导入的注意事项

**1. 模块路径**

\`\`\`javascript
// ✅ 静态字符串
import('./module.js')

// ✅ 模板字符串（有限制）
import(\`./locales/\${lang}.js\`)  // 构建工具会生成所有可能的 chunk

// ❌ 完全动态
import(variablePath)  // 不支持
\`\`\`

**2. 错误处理**

\`\`\`javascript
try {
  const module = await import('./optional.js')
} catch (e) {
  console.log('模块加载失败')
  // 降级处理
}
\`\`\`

**3. 缓存**

\`\`\`javascript
// 同一模块多次 import() 只加载一次
const a = await import('./math.js')
const b = await import('./math.js')
console.log(a === b)  // true（缓存的模块记录）
\`\`\`

### Vite 中的动态导入

\`\`\`javascript
// Vite 支持 glob 导入
const modules = import.meta.glob('./pages/*.vue')
// 返回: { './pages/Home.vue': () => import('./pages/Home.vue'), ... }

// Eager（立即加载）
const modules = import.meta.glob('./pages/*.vue', { eager: true })
\`\`\`

### 使用建议
- 路由组件一律懒加载
- 大依赖（图表、编辑器、PDF）按需加载
- 条件功能按需加载
- 搭配 prefetch 优化用户体验`
  },
  {
    id: 'mod-009',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['循环依赖', '解决方案', '架构'],
    question: '如何检测和解决项目中的循环依赖？',
    answer: `### 检测循环依赖

**1. madge 工具**
\`\`\`bash
# 安装
npm install -g madge

# 检测循环依赖
madge --circular src/

# 输出示例
# 2 circular dependencies found!
# 1) a.js → b.js → a.js
# 2) c.js → d.js → e.js → c.js
\`\`\`

**2. Webpack 插件**
\`\`\`javascript
const CircularDependencyPlugin = require('circular-dependency-plugin')

plugins: [
  new CircularDependencyPlugin({
    exclude: /node_modules/,
    failOnError: false,
    onStart({ compilation }) {
      console.log('start detecting circular dependencies')
    },
    onDetected({ module, paths, compilation }) {
      compilation.warnings.push(new Error(paths.join(' → ')))
    }
  })
]
\`\`\`

**3. ESLint 规则**
\`\`\`javascript
// eslint-plugin-import
'import/no-cycle': ['error', { maxDepth: 10 }]
\`\`\`

### 常见循环依赖模式

**1. 直接循环**
\`\`\`javascript
// a.js → b.js → a.js
// a.js
import { b } from './b.js'
// b.js
import { a } from './a.js'
\`\`\`

**2. 间接循环**
\`\`\`javascript
// a.js → b.js → c.js → a.js
// a.js
import { b } from './b.js'
// b.js
import { c } from './c.js'
// c.js
import { a } from './a.js'
\`\`\`

### 解决方案

**1. 提取共享模块（推荐）**

\`\`\`javascript
// 原来：A ↔ B
// a.js
import { getData } from './b.js'
export function processA() { return getData() }

// b.js
import { formatA } from './a.js'
export function getData() { return formatA(data) }

// 重构：提取共享部分
// shared.js
export function getData() { return data }
export function formatData(data) { return formatted }

// a.js → 只依赖 shared
// b.js → 只依赖 shared
\`\`\`

**2. 依赖注入**

\`\`\`javascript
// a.js
export function createA(b) {
  return {
    process() { return b.getData() }
  }
}

// b.js
export function createB(a) {
  return {
    getData() { return a.format() }
  }
}

// main.js
const a = createA(b)  // 先创建一个引用
const b = createB(a)
a.b = b  // 注入
\`\`\`

**3. 事件总线**

\`\`\`javascript
// eventBus.js（无依赖）
export const bus = new EventTarget()

// a.js
import { bus } from './eventBus.js'
bus.addEventListener('needData', (e) => {
  e.detail.callback(getData())
})

// b.js
import { bus } from './eventBus.js'
function getDataFromA() {
  return new Promise(resolve => {
    bus.dispatchEvent(new CustomEvent('needData', {
      detail: { callback: resolve }
    }))
  })
}
\`\`\`

**4. 延迟导入**

\`\`\`javascript
// a.js
export function processA() {
  // 运行时导入，避免循环
  const { getData } = require('./b.js')
  return getData()
}
\`\`\`

**5. 接口/类型提取**

\`\`\`javascript
// types.js（纯类型，无实现）
export interface IB { getData(): string }

// a.js
import type { IB } from './types.js'
export function processA(b: IB) { return b.getData() }

// b.js
import { processA } from './a.js'
export class BImpl implements IB {
  getData() { return 'data' }
}
\`\`\`

### 最佳实践
1. **单向依赖**：模块应该单向依赖，不互相引用
2. **分层架构**：上层依赖下层，下层不依赖上层
3. **提取公共模块**：循环部分提取到独立模块
4. **CI 检测**：在 CI 流程中加入循环依赖检测
5. **Code Review**：审查新增依赖关系`
  },
  {
    id: 'mod-010',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['模块规范', 'AMD', 'UMD', '历史'],
    question: '前端模块化的发展历程是怎样的？AMD、CMD、UMD 是什么？',
    answer: `### 模块化发展历程

\`\`\`
全局变量 → IIFE → CommonJS → AMD/CMD → UMD → ES Modules
\`\`\`

### 1. 全局变量（最早期）

\`\`\`javascript
// utils.js
var utils = { add: function(a, b) { return a + b } }

// app.js
utils.add(1, 2)
\`\`\`
- ❌ 命名冲突
- ❌ 依赖管理困难

### 2. IIFE（立即执行函数）

\`\`\`javascript
// utils.js
var utils = (function() {
  function add(a, b) { return a + b }
  return { add }
})()
\`\`\`
- ✅ 避免全局污染
- ❌ 依赖管理仍手动

### 3. CommonJS（Node.js）

\`\`\`javascript
// 同步加载，适合服务端
const fs = require('fs')
module.exports = { add: (a, b) => a + b }
\`\`\`
- ✅ Node.js 原生支持
- ❌ 不适合浏览器（同步加载阻塞）

### 4. AMD（Asynchronous Module Definition）

RequireJS 提出的浏览器异步模块规范：

\`\`\`javascript
// 定义模块
define('math', [], function() {
  return { add: function(a, b) { return a + b } }
})

// 引入模块
require(['math'], function(math) {
  math.add(1, 2)
})
\`\`\`
- ✅ 异步加载，适合浏览器
- ✅ 依赖前置
- ❌ 语法繁琐
- ❌ 已过时

### 5. CMD（Common Module Definition）

SeaJS 提出的规范，类似 AMD 但依赖就近：

\`\`\`javascript
define(function(require, exports, module) {
  var math = require('math')
  exports.add = function(a, b) { return a + b }
})
\`\`\`
- ✅ 依赖就近，按需加载
- ❌ 已过时

### 6. UMD（Universal Module Definition）

兼容 CommonJS、AMD 和全局变量的通用方案：

\`\`\`javascript
(function(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    // CommonJS
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory)
  } else {
    // 全局变量
    root.MyModule = factory()
  }
})(this, function() {
  return { add: function(a, b) { return a + b } }
})
\`\`\`
- ✅ 一套代码到处运行
- ❌ 代码冗长

### 7. ES Modules（ES6+）

\`\`\`javascript
// math.mjs
export function add(a, b) { return a + b }

// app.mjs
import { add } from './math.mjs'
\`\`\`
- ✅ 语言层面支持
- ✅ 静态分析（Tree Shaking）
- ✅ 浏览器 + Node.js 统一
- ✅ 异步加载（import()）

### 对比总结

| 规范 | 加载方式 | 适用 | 现状 |
|------|----------|------|------|
| CommonJS | 同步 | Node.js | 仍在使用 |
| AMD | 异步 | 浏览器 | 已过时 |
| CMD | 异步 | 浏览器 | 已过时 |
| UMD | 兼容 | 通用 | 库的降级 |
| ESM | 静态+异步 | 通用 | ✅ 推荐 |

### 为什么 ESM 是最终方案
1. **语言原生支持**，不需要库
2. **静态分析**：编译时确定依赖
3. **Tree Shaking**：摇除未使用代码
4. **浏览器原生支持**：\`<script type="module">\`
5. **Node.js 支持**：\`"type": "module"\``
  },
  {
    id: 'mod-011',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['模块打包', '构建', '原理'],
    question: '模块打包工具是如何工作的？',
    answer: `### 打包工具核心流程

\`\`\`
1. 入口解析 → 2. 依赖图构建 → 3. 转换编译 → 4. 代码生成 → 5. 输出
\`\`\`

### 1. 入口解析

从配置的 entry 开始，读取入口文件：

\`\`\`javascript
// webpack.config.js
entry: './src/index.js'

// vite.config.js
build.rollupOptions.input: 'src/index.html'
\`\`\`

### 2. 依赖图构建

递归分析 import/require，构建模块依赖图：

\`\`\`
index.js
  ├── import { add } from './math.js'
  │     └── import { calculator } from './utils.js'
  ├── import React from 'react'  → node_modules
  └── import './styles.css'
\`\`\`

简化实现：
\`\`\`javascript
function createDependencyGraph(entry) {
  const graph = {}
  
  function visit(filepath) {
    if (graph[filepath]) return  // 已访问
    
    const code = fs.readFileSync(filepath, 'utf-8')
    const deps = parseImports(code)  // 提取 import/require
    
    graph[filepath] = { code, deps }
    deps.forEach(dep => visit(resolve(dep, filepath)))
  }
  
  visit(entry)
  return graph
}
\`\`\`

### 3. 转换编译

对每个模块应用 loader/plugin：

\`\`\`javascript
// babel 转译
// .vue SFC 编译
// CSS → JS 模块
// 图片 → URL/Base64
\`\`\`

### 4. 代码生成

将模块图打包为可在浏览器运行的代码：

**Webpack 的模块包装：**
\`\`\`javascript
// Webpack 将每个模块包装为函数
__webpack_modules__ = {
  './src/math.js': function(module, exports, __webpack_require__) {
    exports.add = function(a, b) { return a + b }
  },
  './src/index.js': function(module, exports, __webpack_require__) {
    const { add } = __webpack_require__('./src/math.js')
    console.log(add(1, 2))
  }
}

// 运行时
function __webpack_require__(moduleId) {
  var module = { exports: {} }
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__)
  return module.exports
}

// 执行入口
__webpack_require__('./src/index.js')
\`\`\`

### 5. 代码分割

\`\`\`javascript
// 动态 import() 触发代码分割
import('./dashboard.js').then(module => {
  module.render()
})

// Webpack 生成：
// main.js（入口 chunk）
// dashboard.[hash].js（异步 chunk）
// 运行时按需加载 dashboard chunk
\`\`\`

### Webpack vs Rollup vs esbuild

| 特性 | Webpack | Rollup | esbuild |
|------|---------|--------|---------|
| 模块格式 | CJS + ESM | ESM | CJS + ESM |
| 代码分割 | ✅ 强大 | ✅ 基础 | ✅ 基础 |
| Tree Shaking | ✅ | ✅ 优秀 | ✅ |
| HMR | ✅ | ❌ | ✅（Vite 中）|
| 速度 | 慢 | 中 | 极快 |
| 适合 | 应用 | 库 | 开发 |

### Vite 的独特方式

**开发阶段**：不打包，浏览器原生 ESM 按需加载
\`\`\`javascript
// 浏览器直接请求 /src/main.js
// Vite 拦截请求，按需编译单个模块
// 浏览器通过 import 链自动加载依赖
\`\`\`

**生产构建**：用 Rollup 打包
\`\`\`javascript
// vite build → Rollup 打包
// 输出 dist/ 目录
\`\`\`

### 简化打包器实现

\`\`\`javascript
const fs = require('fs')
const path = require('path')
const { parse } = require('acorn')

function bundle(entry) {
  const modules = {}
  
  function analyze(filepath) {
    const code = fs.readFileSync(filepath, 'utf-8')
    const ast = parse(code, { sourceType: 'module' })
    const deps = []
    
    ast.body.forEach(node => {
      if (node.type === 'ImportDeclaration') {
        deps.push(node.source.value)
      }
    })
    
    modules[filepath] = { code, deps }
    deps.forEach(dep => {
      const depPath = path.resolve(path.dirname(filepath), dep)
      if (!modules[depPath]) analyze(depPath)
    })
  }
  
  analyze(entry)
  
  // 生成打包代码...
  return generateOutput(modules, entry)
}
\`\`\`

### 打包优化手段
1. **Tree Shaking**：移除未使用代码
2. **代码分割**：按路由/功能拆分 chunk
3. **压缩**：Terser/esbuild minify
4. **Scope Hoisting**：合并模块到同一作用域
5. **持久化缓存**：文件名 contenthash`
  },
  {
    id: 'mod-012',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['NPM', '包管理', 'package.json'],
    question: 'package.json 中的重要字段有哪些？exports 如何使用？',
    answer: `### package.json 核心字段

\`\`\`json
{
  "name": "my-lib",
  "version": "1.0.0",
  "description": "描述",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": { ... },
  "files": ["dist"],
  "sideEffects": false,
  "engines": { "node": ">=18" },
  "peerDependencies": { "vue": "^3.0.0" },
  "scripts": { ... }
}
\`\`\`

### 入口字段

| 字段 | 作用 | 优先级 |
|------|------|--------|
| \`main\` | CJS 入口 | 基础 |
| \`module\` | ESM 入口（打包工具识别）| 高于 main |
| \`browser\` | 浏览器入口 | 高于 main/module |
| \`types\` | TypeScript 类型文件 | — |
| \`exports\` | 现代入口定义（最高优先级）| 最高 |

### exports 字段详解

\`\`\`json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "default": "./dist/index.cjs"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    },
    "./styles/*": "./dist/styles/*",
    "./package.json": "./package.json"
  }
}
\`\`\`

**使用方式：**
\`\`\`javascript
import lib from 'my-lib'           // 匹配 "."
import utils from 'my-lib/utils'   // 匹配 "./utils"
import 'my-lib/styles/theme.css'   // 匹配 "./styles/*"
\`\`\`

**条件解析顺序：**
\`\`\`
import → require → default
\`\`\`

### exports 的好处

1. **子路径访问控制**：未列出的路径不可访问（封装内部模块）
2. **环境区分**：CJS/ESM/浏览器/Deno 不同入口
3. **类型安全**：\`types\` 条件提供类型文件

\`\`\`json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "deno": "./dist/index.deno.js",
      "browser": "./dist/index.browser.js",
      "node": "./dist/index.node.js",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "default": "./dist/index.cjs"
    }
  }
}
\`\`\`

### version 语义化版本

\`\`\`
1.2.3
│ │ │
│ │ └── patch：修复 bug
│ └──── minor：新增功能（向后兼容）
└────── major：破坏性变更
\`\`\`

**版本范围符号：**
\`\`\`
^1.2.3   → >=1.2.3 <2.0.0  （允许 minor 和 patch 更新，最常用）
~1.2.3   → >=1.2.3 <1.3.0  （只允许 patch 更新）
1.2.3    → 精确版本
>=1.2.3  → 大于等于
*        → 任意版本
\`\`\`

### 依赖类型

| 类型 | 说明 | 安装位置 |
|------|------|----------|
| \`dependencies\` | 运行时依赖 | 生产 |
| \`devDependencies\` | 开发依赖 | 开发 |
| \`peerDependencies\` | 同版本依赖（插件） | 宿主安装 |
| \`optionalDependencies\` | 可选依赖 | 可选 |
| \`bundleDependencies\` | 打包依赖 | 内联 |

### files 字段

\`\`\`json
{
  "files": ["dist", "README.md"]
}
\`\`\`
发布到 npm 时只包含这些文件（\`.npmignore\` 的反面）。

### scripts

\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint .",
    "prepare": "husky install",  // npm install 后自动执行
    "prepublishOnly": "npm run build"  // 发布前自动构建
  }
}
\`\`\`

### 发布库最佳实践

\`\`\`json
{
  "name": "my-lib",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "engines": { "node": ">=16" },
  "peerDependencies": { "vue": "^3.0.0" }
}
\`\`\``
  },
  {
    id: 'mod-013',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Monorepo', 'pnpm', 'workspace'],
    question: '什么是 Monorepo？pnpm workspace 如何使用？',
    answer: `### Monorepo

将多个项目/包放在同一个 Git 仓库中管理。

\`\`\`
my-monorepo/
├── packages/
│   ├── ui/          # UI 组件库
│   ├── utils/       # 工具库
│   ├── types/       # 类型定义
│   └── config/      # 共享配置
├── apps/
│   ├── web/         # Web 应用
│   └── admin/       # 管理后台
├── pnpm-workspace.yaml
└── package.json
\`\`\`

### Monorepo vs Polyrepo

| 特性 | Monorepo | Polyrepo |
|------|----------|----------|
| 仓库 | 单一仓库 | 多个仓库 |
| 代码共享 | 容易 | 需发布 npm 包 |
| 版本管理 | 统一 | 各自独立 |
| CI/CD | 统一管理 | 各自配置 |
| 权限 | 全部可见 | 按仓库控制 |
| 适合 | 关联度高的项目 | 独立项目 |

### pnpm workspace

\`\`\`yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
\`\`\`

### 常用命令

\`\`\`bash
# 安装所有依赖（自动链接内部包）
pnpm install

# 在特定包中运行命令
pnpm --filter @my/ui build
pnpm --filter web dev

# 在所有包中运行命令
pnpm -r build

# 添加内部依赖
pnpm --filter web add @my/ui  # web 包依赖 @my/ui

# 添加外部依赖到所有包
pnpm -r add lodash
\`\`\`

### 包间引用

\`\`\`json
// packages/ui/package.json
{
  "name": "@my/ui",
  "version": "1.0.0",
  "main": "./src/index.ts"
}

// apps/web/package.json
{
  "name": "@my/web",
  "dependencies": {
    "@my/ui": "workspace:*"  // 引用 workspace 内的包
  }
}
\`\`\`

\`workspace:*\` 表示使用 workspace 内的版本，发布时自动替换为实际版本号。

### Turborepo（构建加速）

\`\`\`json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],  // 先构建依赖的包
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
\`\`\`

\`\`\`bash
# 只构建变更影响的包
pnpm turbo build

# 并行运行 dev
pnpm turbo dev
\`\`\`

### Turborepo 优势

1. **增量构建**：只构建变更的包
2. **缓存**：相同输入不重复构建
3. **并行执行**：无依赖关系的任务并行
4. **远程缓存**：CI 和本地共享缓存

### 变更管理

\`\`\`bash
# 检测哪些包有变更
pnpm turbo run build --filter=...[origin/main]

# Changesets（版本管理）
npx changeset          # 记录变更
npx changeset version  # 更新版本
npx changeset publish  # 发布到 npm
\`\`\`

### Monorepo 最佳实践

1. **按职责分包**：ui / utils / types / config
2. **明确依赖方向**：apps → packages，packages 之间尽量不互相依赖
3. **统一工具链**：ESLint / Prettier / TS 配置共享
4. **使用 pnpm**：比 npm/yarn 更节省磁盘空间（硬链接）
5. **CI 优化**：只测试/构建变更的包

### 适合 Monorepo 的场景
- 设计系统（组件库 + 文档 + 示例）
- 多端应用（Web + Mobile + Admin）
- 公司内部多个关联项目
- 开源工具集

### 不适合的场景
- 完全独立的项目
- 不同团队、不同技术栈
- 需要严格权限控制`
  },
  {
    id: 'mod-014',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Polyfill', '兼容性', '降级'],
    question: '什么是 Polyfill？如何按需加载 Polyfill？',
    answer: `### Polyfill

**Polyfill**（填充物）：为旧浏览器提供新 API 的实现。

\`\`\`javascript
// 新 API：Array.prototype.includes（ES2016）
[1, 2, 3].includes(2)  // 旧浏览器不支持

// Polyfill
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement) {
    return this.indexOf(searchElement) !== -1
  }
}
\`\`\`

### Polyfill vs Transpile

| 方式 | 作用 | 示例 |
|------|------|------|
| **Transpile** | 语法转译 | 箭头函数 → function |
| **Polyfill** | API 补丁 | Promise、Array.includes |

\`\`\`javascript
// Transpile（Babel 处理语法）
const fn = () => {}  →  var fn = function() {}

// Polyfill（需要运行时补丁）
new Promise(resolve => resolve())  // 旧浏览器没有 Promise
\`\`\`

### core-js

最常用的 polyfill 库：

\`\`\`javascript
// 全量引入（不推荐）
import 'core-js'  // 引入所有 polyfill，体积大

// 按需引入
import 'core-js/stable/promise'
import 'core-js/stable/array/includes'
\`\`\`

### @babel/preset-env + useBuiltIns

\`\`\`json
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",  // 按代码使用情况自动引入
      "corejs": 3
    }]
  ]
}
\`\`\`

**useBuiltIns 选项：**
- \`false\`：不自动引入 polyfill
- \`entry\`：在入口文件全量引入（根据 browserslist 裁剪）
- \`usage\`：按代码实际使用情况按需引入（推荐）

\`\`\`javascript
// 源代码
const arr = [1, 2, 3]
arr.includes(2)
Promise.resolve(1)

// useBuiltIns: "usage" 自动注入
import "core-js/modules/es.array.includes.js"
import "core-js/modules/es.promise.js"
\`\`\`

### browserslist

\`\`\`
# .browserslistrc
> 0.5%
last 2 versions
not dead
not ie 11
\`\`\`

Babel、Autoprefixer、ESLint 等工具共用此配置，决定需要兼容哪些浏览器。

### 动态 Polyfill（CDN 服务）

不用打包 polyfill，而是根据浏览器 UA 动态返回：

\`\`\`html
<!-- polyfill.io -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es2015,es2016"></script>
\`\`\`

服务器根据 UA 返回该浏览器需要的 polyfill，减少不必要的下载。

> ⚠️ 2024 年 polyfill.io 被收购后出现过安全问题，建议使用替代方案：
> - \`cdn.polyfill.io\` → Cloudflare 镜像
> - 自建 polyfill 服务

### 模块/Nomodulule 模式

\`\`\`html
<!-- 现代浏览器加载 ESM -->
<script type="module" src="modern.js"></script>

<!-- 旧浏览器加载降级版本 -->
<script nomodule src="legacy.js"></script>
\`\`\`

### 构建时生成多版本

\`\`\`javascript
// Vite 配置（现代 + 降级）
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['ie >= 11'],
      modernPolyfills: true
    })
  ]
}
// 生成：
// modern.js（现代浏览器，更小）
// legacy.js（旧浏览器，含 polyfill）
\`\`\`

### Polyfill 加载策略对比

| 方案 | 体积 | 准确性 | 维护 |
|------|------|--------|------|
| 全量引入 | 大 | 100% | 简单 |
| useBuiltIns: usage | 小 | 高 | 自动 |
| 动态 CDN | 最小 | 高 | 依赖服务 |
| module/nomodule | 最优 | 高 | 需构建配置 |

### 最佳实践
1. 使用 \`useBuiltIns: "usage"\` 自动按需引入
2. 配置合理的 browserslist
3. 考虑 module/nomodule 双版本
4. 尽量不兼容 IE（2022年已退役）`
  },
  {
    id: 'mod-015',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['最佳实践', '模块设计', '架构'],
    question: '模块化设计的最佳实践有哪些？',
    answer: `### 1. 单一职责原则

每个模块只做一件事。

\`\`\`javascript
// ❌ 混合职责
// user.js
export function fetchUser() { ... }
export function formatUser() { ... }
export function validateUser() { ... }
export function sendEmail() { ... }

// ✅ 拆分
// userApi.js → fetchUser
// userFormat.js → formatUser
// userValidate.js → validateUser
// emailService.js → sendEmail
\`\`\`

### 2. 显式依赖

\`\`\`javascript
// ❌ 隐式依赖（全局变量）
function getUser() {
  return fetch(API_URL)  // API_URL 从哪来？
}

// ✅ 显式导入
import { API_URL } from './config.js'
function getUser() {
  return fetch(API_URL)
}
\`\`\`

### 3. 最小导出

只导出外部需要的 API，内部实现保持私有。

\`\`\`javascript
// ✅ 使用闭包或 # 私有字段
export class Stack {
  #items = []  // 私有
  
  push(item) { this.#items.push(item) }
  pop() { return this.#items.pop() }
  get size() { return this.#items.length }
}
\`\`\`

### 4. 统一导出入口

\`\`\`javascript
// utils/index.js（barrel file）
export { formatDate } from './date.js'
export { formatCurrency } from './currency.js'
export { debounce, throttle } from './function.js'

// 使用方只需一个 import
import { formatDate, debounce } from './utils'
\`\`\`

⚠️ Barrel file 可能影响 Tree Shaking，打包工具需要配置好。

### 5. 避免副作用

\`\`\`javascript
// ❌ 模块导入时有副作用
// global.js
window.myConfig = { ... }
document.title = 'My App'

// ✅ 显式调用
// global.js
export function init() {
  window.myConfig = { ... }
}

// app.js
import { init } from './global.js'
init()  // 显式调用
\`\`\`

### 6. 接口稳定

\`\`\`javascript
// ✅ 接口设计稳定、向后兼容
export function createLogger(options) {
  return {
    log: (msg) => { ... },
    error: (msg) => { ... },
    warn: (msg) => { ... }
  }
}

// ❌ 每次升级都改 API
// v1: export function log(msg) {}
// v2: export function log(level, msg) {}  // 破坏性变更
\`\`\`

### 7. 按功能分目录

\`\`\`
src/
├── api/            # API 请求
│   ├── user.js
│   └── order.js
├── components/     # UI 组件
│   ├── Button.vue
│   └── Input.vue
├── composables/    # 组合式函数
│   ├── useUser.js
│   └── useCart.js
├── utils/          # 工具函数
├── stores/         # 状态管理
├── types/          # TypeScript 类型
└── views/          # 页面
\`\`\`

### 8. 类型优先

\`\`\`typescript
// 定义清晰的接口
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export interface UserService {
  getUser(id: number): Promise<User>
  updateUser(id: number, data: Partial<User>): Promise<User>
}
\`\`\`

### 9. 依赖方向单一

\`\`\`
// ✅ 单向依赖
views → composables → api → utils

// ❌ 循环依赖
api → utils → api
\`\`\`

### 10. 可测试性

\`\`\`javascript
// ✅ 依赖注入，方便测试
export function createUserService(apiClient) {
  return {
    getUser: (id) => apiClient.get(\`/users/\${id}\`)
  }
}

// 测试时可以注入 mock
const mockApi = { get: jest.fn().mockResolvedValue({ id: 1, name: 'Tom' }) }
const service = createUserService(mockApi)
\`\`\`

### 11. 文件命名规范

\`\`\`
组件：PascalCase（Button.vue, UserList.vue）
工具：camelCase（formatDate.js, useUser.js）
常量：UPPER_SNAKE_CASE（API_CONFIG.js）
类型：PascalCase（User.ts, ApiResponse.ts）
\`\`\`

### 12. 合理使用默认导出和命名导出

\`\`\`javascript
// 组件/类 → 默认导出
export default class User { }

// 工具函数/常量 → 命名导出
export function formatDate() { }
export const API_URL = '/api'

// 混用时保持一致
export function helper() { }
export default function main() { }
\`\`\`

### 总结
好的模块化设计 = 高内聚 + 低耦合 + 单一职责 + 显式依赖`
  },
  {
    id: 'mod-016',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['NPM', '版本管理', 'lock文件'],
    question: 'npm、yarn、pnpm 有什么区别？lock 文件的作用？',
    answer: `### 包管理器对比

| 特性 | npm | yarn (v1) | pnpm |
|------|-----|-----------|------|
| 安装速度 | 中 | 快 | 最快 |
| 磁盘空间 | 多 | 多 | 最少（硬链接）|
| 幽灵依赖 | ❌ 有 | ❌ 有 | ✅ 无 |
| 并行安装 | ❌ | ✅ | ✅ |
| Workspaces | ✅ | ✅ | ✅ |
| 插件 | ❌ | ✅ (v2+) | ✅ |

### 幽灵依赖问题

npm/yarn 采用**扁平化** node_modules：

\`\`\`
node_modules/
├── express/      ← 直接依赖
├── body-parser/  ← express 的依赖，被提升到顶层
├── debug/        ← body-parser 的依赖，也被提升
└── ...
\`\`\`

问题：你的代码可以 import 未在 package.json 中声明的包（被提升的依赖），这就是幽灵依赖。

\`\`\`javascript
// package.json 只声明了 express
// 但代码中可以引用 express 的依赖（幽灵依赖）
import parse from 'body-parser'  // ✅ 能用但不应该
// 一天 express 不再依赖 body-parser，你的代码就崩了
\`\`\`

### pnpm 的解决方案

pnpm 使用**非扁平**结构 + 硬链接：

\`\`\`
node_modules/
├── .pnpm/                    ← 真实存储位置
│   ├── express@4.18.2/
│   │   └── node_modules/
│   │       ├── express/      ← 硬链接到全局 store
│   │       └── body-parser/  ← 软链接
│   └── body-parser@1.20.1/
│       └── node_modules/
│           └── body-parser/
└── express/                   ← 软链接到 .pnpm/express@4.18.2/...
\`\`\`

只有 package.json 中声明的依赖才出现在顶层 \`node_modules\` 中，彻底杜绝幽灵依赖。

### pnpm 的全局 store

\`\`\`
# 全局 store（内容寻址存储）
~/.pnpm-store/
└── v3/
    └── files/
        ├── ab/cdef123...  ← 文件按哈希存储
        └── ...

# 项目中的 node_modules 通过硬链接引用
# 多个项目共享同一份文件，节省磁盘空间
\`\`\`

### lock 文件

| 包管理器 | lock 文件 |
|----------|----------|
| npm | package-lock.json |
| yarn | yarn.lock |
| pnpm | pnpm-lock.yaml |

### lock 文件的作用

1. **版本锁定**：确保团队/CI 安装的依赖版本完全一致
2. **快速安装**：跳过版本解析，直接按 lock 安装
3. **安全性**：防止依赖被篡改

\`\`\`json
// package-lock.json（简化）
{
  "packages": {
    "node_modules/lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-..."  // 完整性校验
    }
  }
}
\`\`\`

### 安装命令对比

\`\`\`bash
# 安装
npm install          # 安装所有依赖
pnpm install         # 同上

# 添加依赖
npm install lodash   # 添加到 dependencies
pnpm add lodash

# 添加开发依赖
npm install -D vitest
pnpm add -D vitest

# 全局安装（不推荐）
npm install -g pkg
pnpm add -g pkg

# 删除依赖
npm uninstall lodash
pnpm remove lodash

# 更新
npm update
pnpm update
\`\`\`

### npm scripts 生命钩子

\`\`\`json
{
  "scripts": {
    "preinstall": "...",    // install 前
    "install": "...",
    "postinstall": "...",   // install 后
    "prepublishOnly": "..." // 发布前
  }
}
\`\`\`

### 推荐
- **新项目**：使用 pnpm（速度快、省空间、无幽灵依赖）
- **Monorepo**：pnpm workspace + Turborepo
- **老项目**：保持原有包管理器，迁移成本高时不必强换

### .npmrc 配置

\`\`\`ini
# .npmrc
registry=https://registry.npmmirror.com/  # 淘宝镜像
auto-install-peers=true
shamefully-hoist=true  # 临时兼容旧工具（谨慎使用）
\`\`\``
  },
  {
    id: 'mod-017',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['模块联邦', '微前端', 'Webpack5'],
    question: 'Webpack 5 Module Federation 是什么？如何使用？',
    answer: `### Module Federation

模块联邦允许**多个独立构建的应用在运行时共享模块**，是微前端的实现方案之一。

### 核心概念

| 概念 | 说明 |
|------|------|
| Host | 消费远程模块的应用（主应用）|
| Remote | 暴露模块的应用（子应用）|
| Shared | 共享依赖（如 react、vue）|

### Remote 配置（子应用）

\`\`\`javascript
// webpack.config.js (remote app)
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './utils': './src/utils'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
}
\`\`\`

### Host 配置（主应用）

\`\`\`javascript
// webpack.config.js (host app)
new ModuleFederationPlugin({
  name: 'hostApp',
  remotes: {
    remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
})
\`\`\`

### 使用远程模块

\`\`\`javascript
// 同步加载
import Button from 'remoteApp/Button'
function App() {
  return <Button>Click</Button>
}

// 异步加载（推荐）
const RemoteButton = React.lazy(() => import('remoteApp/Button'))
function App() {
  return (
    <Suspense fallback="Loading">
      <RemoteButton>Click</RemoteButton>
    </Suspense>
  )
}
\`\`\`

### shared 详解

\`\`\`javascript
shared: {
  react: {
    singleton: true,      // 只加载一个实例
    requiredVersion: '^18',
    eager: false,          // 是否同步加载
  }
}
// 如果 host 和 remote 都依赖 react，运行时只加载一个版本
\`\`\`

### 运行时加载 remote

\`\`\`javascript
// 动态加载远程模块
async function loadRemote(name, module) {
  // 初始化容器
  await __webpack_init_sharing__('default')
  const container = await loadRemoteContainer(name)
  await container.init(__webpack_share_scopes__.default)
  const factory = await container.get(module)
  return factory()
}

const Button = await loadRemote('remoteApp', './Button')
\`\`\`

### Module Federation 的优势

1. **运行时集成**：不需要构建时知道子应用
2. **依赖共享**：react 等公共依赖只加载一次
3. **独立部署**：子应用独立构建部署
4. **按需加载**：远程模块按需 import

### vs qiankun

| 特性 | Module Federation | qiankun |
|------|------------------|---------|
| 共享依赖 | ✅ 自动共享 | ❌ 各自加载 |
| 集成粒度 | 组件级 | 应用级 |
| JS 沙箱 | ❌ | ✅ |
| CSS 隔离 | ❌ | ✅ |
| 技术栈 | 需统一（shared）| 可不同 |

### Vite 中的 Module Federation

\`\`\`javascript
// 使用 vite-plugin-federation
import federation from '@originjs/vite-plugin-federation'

export default {
  plugins: [
    federation({
      name: 'host',
      remotes: {
        remote: 'http://localhost:3001/assets/remoteEntry.js'
      },
      shared: ['vue']
    })
  ]
}
\`\`\`

### 适用场景
- 大型应用拆分为多个独立部署的模块
- 共享组件库（设计系统）
- 不同团队协作开发同一应用

### 注意事项
1. 共享依赖的版本要兼容
2. 没有原生 JS/CSS 隔离
3. 调试时需要注意远程模块的 source map`
  },
  {
    id: 'mod-018',
    category: 'javascript',
    module: 'lang',
    'difficulty': 'medium',
    'tags': ['模块类型', 'ESM', 'Node.js'],
    'question': 'Node.js 中如何区分 ESM 和 CJS？有哪些方式？',
    answer: `### 区分方式

\`\`\`
1. package.json 的 type 字段
2. 文件扩展名 (.mjs / .cjs)
3. import 语句（ESM）vs require 函数（CJS）
\`\`\`

### 1. package.json type 字段

\`\`\`json
// "type": "module" → .js 文件作为 ESM
{
  "type": "module"
}
// app.js → ESM

// "type": "commonjs" 或不设置 → .js 文件作为 CJS
{
  "type": "commonjs"
}
// app.js → CJS
\`\`\`

### 2. 文件扩展名（覆盖 type 设置）

\`\`\`
.mjs → 始终 ESM（不管 type）
.cjs → 始终 CJS（不管 type）
.js  → 取决于 type 字段
\`\`\`

### 3. 代码中的判断

\`\`\`javascript
// ESM 的标志
import something from './module.js'
export const value = 1
export default {}
import.meta.url

// CJS 的标志
const something = require('./module')
module.exports = {}
__dirname
__filename
\`\`\`

### 环境差异

\`\`\`javascript
// CJS 环境
console.log(typeof require)       // 'function'
console.log(typeof module)        // 'object'
console.log(__dirname)            // '/path/to/dir'
console.log(this)                  // module.exports

// ESM 环境
console.log(typeof require)       // 'undefined'
console.log(__dirname)            // ReferenceError!
console.log(import.meta.url)      // 'file:///path/to/file.mjs'
console.log(this)                  // undefined
\`\`\`

### ESM 中使用 __dirname

\`\`\`javascript
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 等价于 CJS 的 __dirname / __filename
const configPath = join(__dirname, 'config.json')
\`\`\`

### ESM 中使用 require

\`\`\`javascript
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// 可以在 ESM 中使用 require
const cjsModule = require('./legacy.cjs')
\`\`\`

### 顶层 await

\`\`\`javascript
// ESM 支持顶层 await
const config = await fetch('/config').then(r => r.json())
export default config

// CJS 不支持顶层 await
// ❌ const config = await fetch(...)  // 语法错误
\`\`\`

### JSON 导入

\`\`\`javascript
// CJS
const config = require('./config.json')  // ✅ 原生支持

// ESM（需要 with 语法）
import config from './config.json' with { type: 'json' }
// 或旧语法
import config from './config.json' assert { type: 'json' }

// 或用 fs 读取
import { readFileSync } from 'fs'
const config = JSON.parse(readFileSync('./config.json', 'utf-8'))
\`\`\`

### 条件导出

\`\`\`json
// package.json
{
  "exports": {
    ".": {
      "node": {
        "import": "./dist/node/index.mjs",
        "require": "./dist/node/index.cjs"
      },
      "browser": {
        "import": "./dist/browser/index.mjs",
        "require": "./dist/browser/index.cjs"
      },
      "default": "./dist/index.cjs"
    }
  }
}
\`\`\`

### 判断当前是 ESM 还是 CJS

\`\`\`javascript
// 方法 1：检查 import.meta
if (typeof import.meta !== 'undefined') {
  console.log('ESM')
}

// 方法 2：检查 require
if (typeof require !== 'undefined') {
  console.log('CJS')
}

// 方法 3：try-catch
let isESM = false
try {
  // @ts-ignore
  await import('data:text/javascript,')
  isESM = true
} catch {
  isESM = false
}
\`\`\`

### 最佳实践
1. **新项目用 ESM**：\`"type": "module"\`
2. **库提供双格式**：\`exports\` 同时提供 import 和 require
3. **混合项目用 .mjs/.cjs**：明确区分
4. **避免混用**：同一项目尽量统一模块格式`
  },
  {
    id: 'mod-019',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['动态加载', '懒加载', '性能'],
    question: '前端按需加载有哪些实现方式和最佳实践？',
    answer: `### 按需加载维度

1. **路由级**：页面/路由按需加载
2. **组件级**：重组件按需加载
3. **依赖级**：大依赖按需加载
4. **资源级**：图片/字体按需加载

### 路由级懒加载

\`\`\`javascript
// React
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

const routes = [
  { path: '/', element: <Suspense fallback={<Loader />}><Home /></Suspense> },
  { path: '/about', element: <Suspense fallback={<Loader />}><About /></Suspense> }
]

// Vue
const routes = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/about', component: () => import('./pages/About.vue') }
]
\`\`\`

### 组件级懒加载

\`\`\`javascript
// React
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  const [showChart, setShowChart] = useState(false)
  return (
    <>
      <button onClick={() => setShowChart(true)}>显示图表</button>
      {showChart && (
        <Suspense fallback={<Loader />}>
          <HeavyChart />
        </Suspense>
      )}
    </>
  )
}

// Vue
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
// 或带配置
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: Loader,
  errorComponent: Error,
  delay: 200,
  timeout: 10000
})
\`\`\`

### 依赖级懒加载

\`\`\`javascript
// PDF 导出（jspdf 很大，只在需要时加载）
async function exportPDF() {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  doc.text('Hello', 10, 10)
  doc.save('output.pdf')
}

// 编辑器（monaco-editor 很大）
async function openEditor() {
  const monaco = await import('monaco-editor')
  monaco.editor.create(document.getElementById('container'))
}

// 图表库
async function renderChart() {
  const echarts = await import('echarts')
  const chart = echarts.init(document.getElementById('chart'))
  chart.setOption(option)
}
\`\`\`

### 资源级懒加载

\`\`\`javascript
// 图片懒加载
<img loading="lazy" src="image.jpg" />

// IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      observer.unobserve(img)
    }
  })
})
document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img))
\`\`\`

### 预加载策略

\`\`\`javascript
// 1. 用户 hover 链接时预加载
<Link 
  to="/dashboard"
  onMouseEnter={() => import('./pages/Dashboard')}
>

// 2. 空闲时预加载
function prefetchRoute(routeImport) {
  requestIdleCallback(() => routeImport())
}

// 3. Webpack magic comments
import(
  /* webpackChunkName: "dashboard" */
  /* webpackPrefetch: true */  // 浏览器空闲时加载
  './Dashboard'
)

// 4. HTML 标签
<link rel="prefetch" href="/dashboard.js">
<link rel="preload" href="/critical.js" as="script">
\`\`\`

### 代码分割策略

\`\`\`javascript
// Vite 手动分块
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['antd', '@emotion/react'],
          'chart-vendor': ['echarts', 'd3']
        }
      }
    }
  }
}

// 动态导入自动分割
const Dashboard = lazy(() => import('./Dashboard'))
// → 生成单独的 dashboard.[hash].js
\`\`\`

### 按需加载的 UI 优化

\`\`\`javascript
// 1. 骨架屏
<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>

// 2. 延迟显示 loading（避免快速加载时闪烁）
const LazyComp = defineAsyncComponent({
  loader: () => import('./HeavyComp.vue'),
  loadingComponent: Loader,
  delay: 200  // 200ms 后才显示 loading
})

// 3. 错误处理
const LazyComp = defineAsyncComponent({
  loader: () => import('./HeavyComp.vue'),
  errorComponent: ErrorComponent,
  timeout: 10000
})
\`\`\`

### 性能指标影响

| 策略 | 首屏 JS | 交互体验 | 复杂度 |
|------|---------|----------|--------|
| 全量加载 | 大 | 好 | 低 |
| 路由懒加载 | 小 | 首次进入需等待 | 中 |
| 路由 + 预加载 | 小 | 好 | 高 |
| 组件懒加载 | 最小 | 交互时需等待 | 高 |

### 最佳实践

1. **路由全部懒加载**：减小首屏体积
2. **大依赖动态导入**：图表、编辑器、PDF
3. **合理预加载**：hover/空闲时预加载下一页
4. **骨架屏**：提升加载感知速度
5. **按需加载第三方库**：lodash-es、antd 按需引入
6. **分析包体积**：\`vite-bundle-visualizer\` / \`webpack-bundle-analyzer\``
  },
  {
    id: 'mod-020',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['SSR', '模块', '同构'],
    question: '服务端渲染（SSR）中模块化有哪些注意事项？',
    answer: `### SSR 模块化挑战

1. **Node.js 和浏览器环境差异**
2. **CJS vs ESM 在 SSR 中的处理**
3. **模块副作用在服务端的行为**
4. **条件导出的服务端入口**

### 1. 环境差异

\`\`\`javascript
// ❌ 在服务端报错
import { DOMPurify } from 'dompurify'  // 依赖 window

// ✅ 条件加载
let DOMPurify
if (typeof window !== 'undefined') {
  DOMPurify = (await import('dompurify')).default
}

// 或使用 isomorphic 版本
import DOMPurify from 'isomorphic-dompurify'
\`\`\`

### 2. package.json 条件导出

\`\`\`json
{
  "exports": {
    ".": {
      "browser": "./dist/browser.js",   // 浏览器入口
      "node": "./dist/server.js",        // Node.js 入口
      "import": "./dist/index.mjs",      // ESM 入口
      "require": "./dist/index.cjs"      // CJS 入口
    }
  }
}
\`\`\`

### 3. SSR 中的模块副作用

\`\`\`javascript
// ❌ 模块加载时操作 DOM（服务端没有 DOM）
// theme.js
document.documentElement.classList.add('dark')

// ✅ 延迟到客户端执行
export function initTheme() {
  if (typeof window === 'undefined') return
  document.documentElement.classList.add('dark')
}

// 只在客户端调用
import { useEffect } from 'react'
useEffect(() => {
  initTheme()  // useEffect 只在客户端执行
}, [])
\`\`\`

### 4. 'use client' / 'use server'（React Server Components）

\`\`\`javascript
// React Server Components (Next.js App Router)

// 默认是 Server Component（服务端执行）
// app/page.js
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data.title}</div>
}

// 客户端组件
'use client'  // 标记为客户端组件
import { useState } from 'react'
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}

// Server Action
'use server'
export async function submitForm(formData) {
  // 在服务端执行
  await saveToDatabase(formData)
}
\`\`\`

### 5. Nuxt 中的模块处理

\`\`\`vue
<!-- Vue 组件默认在服务端和客户端都渲染 -->
<script setup>
// 服务端和客户端都会执行的代码
const { data } = await useFetch('/api/data')

// 只在客户端执行
onMounted(() => {
  window.scrollTo(0, 0)
})

// 只在服务端执行
if (import.meta.server) {
  // 服务端专用逻辑
}

// 只在客户端执行
if (import.meta.client) {
  // 客户端专用逻辑
}
</script>
\`\`\`

### 6. SSR 中的动态导入

\`\`\`javascript
// 某些库只能在客户端运行
import { defineAsyncComponent } from 'vue'

const ClientOnlyChart = defineAsyncComponent(() => 
  import('chart.js').then(mod => mod.default)
)

// React
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-chartjs-2'), {
  ssr: false  // 不在服务端渲染
})
\`\`\`

### 7. 服务器模块缓存

\`\`\`javascript
// ⚠️ 服务端模块是单例的，会在请求间共享
// 全局状态会导致数据泄露

// ❌ 危险：全局变量跨请求共享
let currentUser = null
export function setUser(user) { currentUser = user }

// ✅ 使用请求上下文
export function createAppContext(req) {
  return {
    user: req.user,
    // 每个请求独立
  }
}
\`\`\`

### 8. 序列化与水合

\`\`\`javascript
// 服务端获取的数据需要传给客户端
// app.js (server)
export async function getServerSideProps() {
  const data = await fetchData()
  return { props: { data } }  // 会被 JSON.stringify
}

// 客户端水合时使用相同的数据
// 避免客户端重新请求
\`\`\`

### 9. CSS 模块在 SSR 中

\`\`\`javascript
// CSS Modules 在 SSR 中需要特殊处理
import styles from './Button.module.css'
// 服务端：需要提取 CSS 到单独文件
// 客户端：正常加载

// Next.js / Nuxt.js 自动处理
\`\`\`

### 10. 第三方库兼容性

\`\`\`javascript
// 有些库不支持 SSR
// 检查 package.json 是否有 "browser" 字段
// 或使用条件导入

// next.config.js
export default {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,    // 不在客户端引入 Node.js 模块
      path: false,
    }
    return config
  }
}
\`\`\`

### SSR 模块化检查清单
- [ ] 模块加载时无 DOM 操作
- [ ] 无 window/document 的直接引用
- [ ] 条件导出区分 server/browser
- [ ] 无全局可变状态
- [ ] 大依赖支持动态导入
- [ ] CSS 模块正确处理
- [ ] 第三方库支持 SSR`
  }
]
