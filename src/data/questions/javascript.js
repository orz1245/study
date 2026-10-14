// JavaScript 核心面试题 — 40 题
export const javascriptQuestions = [
  // ========== 数据类型与类型转换 ==========
  {
    id: 'js-001',
    category: 'javascript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['数据类型', '类型判断'],
    question: 'JavaScript 有哪些数据类型？如何判断一个变量的类型？',
    answer: `JavaScript 共有 **8 种数据类型**，分为两大类：

### 原始类型（7种）
- \`number\` — 数字
- \`string\` — 字符串
- \`boolean\` — 布尔值
- \`undefined\` — 未定义
- \`null\` — 空值
- \`symbol\` — 唯一值（ES6）
- \`bigint\` — 大整数（ES2020）

### 引用类型（1种）
- \`object\` — 对象（包括 Array、Function、Date、RegExp 等）

### 类型判断方法

| 方法 | 说明 | 缺点 |
|------|------|------|
| \`typeof\` | 判断原始类型 | \`typeof null === 'object'\`，无法区分数组/对象 |
| \`instanceof\` | 判断引用类型 | 不能跨 iframe，不能判断原始类型 |
| \`Object.prototype.toString.call()\` | 最准确 | 写法繁琐 |
| \`Array.isArray()\` | 判断数组 | 仅用于数组 |

\`\`\`javascript
typeof 'hello'        // 'string'
typeof 123            // 'number'
typeof null           // 'object'  ⚠️ 历史遗留 bug
typeof []             // 'object'
typeof function(){}   // 'function'

[] instanceof Array   // true
Object.prototype.toString.call(null)       // '[object Null]'
Object.prototype.toString.call([1,2])      // '[object Array]'
Object.prototype.toString.call(new Date()) // '[object Date]'
\`\`\`

> **面试技巧**：万能类型判断封装：\`Object.prototype.toString.call(val).slice(8, -1)\``
  },
  {
    id: 'js-002',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['类型转换', '隐式转换'],
    question: '说说 == 和 === 的区别，以及隐式类型转换规则',
    answer: `### == vs ===

- \`===\`（严格相等）：不进行类型转换，类型不同直接返回 \`false\`
- \`==\`（宽松相等）：会先进行类型转换再比较

### == 的转换规则

1. **null == undefined** → \`true\`（二者相等，但不与其他值相等）
2. **number == string** → 字符串转数字再比较
3. **boolean == 其他** → boolean 先转数字（true→1, false→0）
4. **object == 原始类型** → object 先转原始类型（调用 \`valueOf\` / \`toString\`）

\`\`\`javascript
null == undefined   // true
null == 0           // false
'' == 0             // true  ('' → 0)
'1' == 1            // true  ('1' → 1)
true == 1           // true  (true → 1)
[] == false         // true  ([] → '' → 0, false → 0)
[] == 0             // true
[1] == 1            // true  ([1] → '1' → 1)

// 经典面试题
let a = {}
a.toString = () => '1'
a == 1   // true (a → '1' → 1)
\`\`\`

### 建议
- 日常开发一律用 \`===\`，只有判断 \`null/undefined\` 时可用 \`== null\`
- \`==\` 的转换规则复杂，容易出错`
  },
  {
    id: 'js-003',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['类型转换', 'valueOf', 'toString'],
    question: '对象转原始类型的过程是怎样的？',
    answer: `对象转原始类型会调用内部方法 \`ToPrimitive\`，过程如下：

### 转换流程

1. 调用 \`Symbol.toPrimitive()\`（如果存在）
2. 否则根据上下文调用 \`valueOf()\` 和 \`toString()\`：
   - **数字上下文**（如 \`-a\`, \`a - 1\`）：先 \`valueOf()\`，再 \`toString()\`
   - **字符串上下文**（如 \`String(a)\`, \`a + ''\`）：先 \`toString()\`，再 \`valueOf()\`

### Symbol.toPrimitive 优先级最高

\`\`\`javascript
let obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return 10
    if (hint === 'string') return 'hello'
    return 'default'
  }
}
+obj        // 10       (hint = 'number')
\`\${obj}\`  // 'hello'  (hint = 'string')
obj + ''    // 'default'(hint = 'default')
\`\`\`

### 默认行为

\`\`\`javascript
let arr = [1, 2, 3]
arr.toString()  // '1,2,3'
arr.valueOf()   // [1, 2, 3]（返回自身）

arr + ''        // '1,2,3'（字符串上下文，调 toString）
arr - 1         // NaN（数字上下文，valueOf 返回数组 → toString → '1,2,3' → 1,2,3 → NaN）
\`\`\`

> \`+[]\` 结果是 \`0\`：\`[]\` → \`toString()\` → \`''\` → \`Number('')\` → \`0\``
  },
  {
    id: 'js-004',
    category: 'javascript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['数据类型', '堆栈'],
    question: '原始类型和引用类型在内存中的区别是什么？',
    answer: `### 核心区别

| 特性 | 原始类型 | 引用类型 |
|------|----------|----------|
| 存储位置 | **栈内存**（Stack） | **堆内存**（Heap） |
| 存储内容 | 值本身 | 指向堆内存的引用地址 |
| 赋值行为 | 值拷贝（深拷贝） | 引用拷贝（浅拷贝） |
| 大小 | 固定，占空间小 | 不固定，可动态变化 |
| 生命周期 | 函数结束自动回收 | 由 GC 管理 |

### 赋值行为对比

\`\`\`javascript
// 原始类型 — 值拷贝
let a = 10
let b = a
b = 20
console.log(a)  // 10（互不影响）

// 引用类型 — 引用拷贝
let obj1 = { name: 'Tom' }
let obj2 = obj1
obj2.name = 'Jerry'
console.log(obj1.name)  // 'Jerry'（指向同一对象）
\`\`\`

### 函数参数传递

JavaScript **只有值传递**，但引用类型传递的是地址的副本：

\`\`\`javascript
function modify(obj) {
  obj.name = 'modified'   // 修改同一对象，外部可见
  obj = { name: 'new' }   // 重新赋值，不影响外部
}
let data = { name: 'original' }
modify(data)
console.log(data.name)  // 'modified'
\`\`\``
  },
  {
    id: 'js-005',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['类型转换', '运算符'],
    question: '解释以下表达式的结果：[] + {}、{} + []、true + true + "1"',
    answer: `\`\`\`javascript
[] + {}          // '' + '[object Object]' = '[object Object]'
{} + []          // 0 （注意：{} 被解析为代码块，实际执行 +[] → 0）
true + true + '1' // '21' （true+true=2, 2+'1'='21'）
\`\`\`

### 逐个分析

**1. \`[] + {}\`**
- \`+\` 运算符：左右都转原始类型
- \`[]\` → \`ToPrimitive('default')\` → \`toString()\` → \`''\`
- \`{}\` → \`ToPrimitive('default')\` → \`toString()\` → \`'[object Object]'\`
- \`'' + '[object Object]'\` = \`'[object Object]'\`

**2. \`{} + []\`**
- 在语句开头 \`{}\` 被解析为**代码块**（空块），不是对象字面量
- 实际执行的是 \`+[]\`（一元正号）
- \`[]\` → \`''\` → \`0\`
- 结果：\`0\`
- 如果用括号 \`({}) + []\` 则结果为 \`'[object Object]'\`

**3. \`true + true + '1'\`**
- 从左到右：\`true + true\` → \`1 + 1\` = \`2\`
- \`2 + '1'\` → \`'2' + '1'\` = \`'21'\`（数字 + 字符串 → 字符串拼接）

### 核心规则
- \`+\` 两边有字符串时 → 字符串拼接
- \`+\` 两边都是数字/布尔 → 算术加法
- 对象参与 \`+\` → 先 \`ToPrimitive\` 转原始类型`
  },

  // ========== 作用域与闭包 ==========
  {
    id: 'js-006',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['闭包', '作用域', '应用场景'],
    question: '什么是闭包？请举例说明其应用场景和潜在问题',
    answer: `**闭包**是指一个函数能够访问其外部函数作用域中的变量，即使外部函数已经执行完毕。

### 形成条件
1. 函数嵌套
2. 内部函数引用外部函数的变量
3. 内部函数被返回或传递到外部

### 经典示例

\`\`\`javascript
function createCounter() {
  let count = 0  // 外部变量
  return {
    increment() { return ++count },
    decrement() { return --count },
    getCount() { return count }
  }
}
const counter = createCounter()
counter.increment()  // 1
counter.increment()  // 2
counter.getCount()   // 2
\`\`\`

### 应用场景

1. **数据私有化**（模块模式）
2. **函数柯里化**
3. **防抖/节流**
4. **缓存（记忆化函数）**

\`\`\`javascript
// 记忆化函数
function memoize(fn) {
  const cache = {}
  return function (...args) {
    const key = JSON.stringify(args)
    if (key in cache) return cache[key]
    return cache[key] = fn.apply(this, args)
  }
}
\`\`\`

### 潜在问题

1. **内存泄漏**：闭包引用的变量不会被 GC 回收
2. **变量共享**：循环中的闭包共享同一变量

\`\`\`javascript
// 经典问题：循环中的闭包
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)  // 3, 3, 3
}
// 解决方案 1：let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)  // 0, 1, 2
}
// 解决方案 2：IIFE
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 0))(i)
}
\`\`\``
  },
  {
    id: 'js-007',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['作用域', '变量提升', 'let', 'const'],
    question: 'var、let、const 有什么区别？什么是变量提升和暂时性死区？',
    answer: `### var vs let vs const

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | ✅ 提升且初始化为 undefined | ✅ 提升但不初始化 | ✅ 提升但不初始化 |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 允许 | 允许 | 不允许 |
| 挂载到 window | ✅ | ❌ | ❌ |

### 变量提升（Hoisting）

\`\`\`javascript
console.log(a)  // undefined（已提升，已初始化）
var a = 1

console.log(b)  // ReferenceError（已提升，但未初始化）
let b = 2
\`\`\`

\`var\` 声明会在编译阶段被提升到作用域顶部并初始化为 \`undefined\`。

### 暂时性死区（TDZ）

\`let\` / \`const\` 声明的变量虽然也会提升，但在**到达声明语句之前**处于暂时性死区，访问会抛出 \`ReferenceError\`。

\`\`\`javascript
{
  // TDZ 开始
  console.log(x)  // ReferenceError
  let x = 10       // TDZ 结束
}
\`\`\`

\`const\` 必须在声明时初始化：
\`\`\`javascript
const a          // SyntaxError
const b = 1      // ✅
b = 2            // TypeError
\`\`\`

> **注意**：\`const\` 不可重新赋值，但对象/数组的**内容**可以修改：
> \`\`\`javascript
> const arr = [1, 2]
> arr.push(3)     // ✅ 允许修改内容
> arr = [4, 5]    // ❌ 不可重新赋值
> \`\`\`

### 最佳实践
- 默认用 \`const\`，需要重新赋值时用 \`let\`，不再使用 \`var\``
  },
  {
    id: 'js-008',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['闭包', '内存泄漏', '垃圾回收'],
    question: '闭包会导致内存泄漏吗？如何避免？',
    answer: `闭包**本身不是**内存泄漏，它只是让变量的生命周期延长到与闭包一致。但如果闭包长期存在且不再需要引用的变量，就会造成**实际的内存泄漏**。

### 什么情况下闭包会导致内存泄漏

\`\`\`javascript
// 1. 意外引用：闭包引用了大对象但不使用
function createHandler() {
  const hugeData = new Array(1000000).fill('*')
  return function () {
    console.log('handler')  // 没用到 hugeData，但它被闭包引用了
  }
}
const handler = createHandler()  // hugeData 无法被回收

// 2. 定时器未清除
function startTimer() {
  const data = getData()
  setInterval(() => {
    console.log(data)  // data 一直被引用
  }, 1000)
}

// 3. DOM 事件监听未移除
function bindEvent() {
  const element = document.getElementById('btn')
  const heavyData = { /* ... */ }
  element.addEventListener('click', () => {
    console.log(heavyData)
  })
  // 如果 element 被移除但监听器未移除 → 泄漏
}
\`\`\`

### 如何避免

1. **及时清除引用**：用完后将变量设为 \`null\`
2. **清除定时器**：\`clearInterval()\` / \`clearTimeout()\`
3. **移除事件监听**：\`removeEventListener()\`
4. **使用 WeakMap / WeakSet**：不阻止 GC 回收

\`\`\`javascript
// WeakMap 解决方案
const cache = new WeakMap()
function process(obj) {
  if (!cache.has(obj)) {
    cache.set(obj, expensiveCompute(obj))
  }
  return cache.get(obj)
}
// 当 obj 被回收，cache 中的条目也会被自动清除
\`\`\`

### 现代浏览器
现代 V8 引擎已经能优化未使用的闭包变量，但在以下场景仍需注意：
- 长生命周期的 SPA 应用
- 频繁创建闭包的循环/递归
- 旧版浏览器（IE）的 DOM 循环引用`
  },
  {
    id: 'js-009',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['作用域', '执行上下文'],
    question: '解释 JavaScript 的作用域链是如何工作的',
    answer: `**作用域链**是 JavaScript 在查找变量时，从内到外依次查找的作用域链表。

### 执行上下文与作用域

每个函数在创建时会保存一个 **[[Environment]]** 内部属性，指向定义时的词法环境。函数调用时创建执行上下文，其作用域链 = **函数自身作用域 → 外层作用域 → ... → 全局作用域**。

\`\`\`javascript
const globalVar = 'global'

function outer() {
  const outerVar = 'outer'

  function inner() {
    const innerVar = 'inner'
    // 作用域链：inner → outer → global
    console.log(innerVar)   // 'inner'  （自身）
    console.log(outerVar)   // 'outer'  （外层）
    console.log(globalVar)  // 'global' （全局）
  }

  inner()
}
\`\`\`

### 词法作用域（静态作用域）

JavaScript 采用**词法作用域**：函数的作用域在**定义时**确定，而非调用时。

\`\`\`javascript
const value = 'outer'

function foo() {
  console.log(value)  // 'outer'（定义时决定）
}

function bar() {
  const value = 'inner'
  foo()  // foo 依然访问外层的 'outer'
}
bar()  // 输出 'outer'
\`\`\`

### 作用域链查找过程

1. 在当前作用域查找变量
2. 找不到 → 沿作用域链向上查找
3. 找到则使用，未找到则 \`ReferenceError\`

### 欺骗词法作用域（不推荐）

- \`eval()\`：动态执行代码，可修改作用域
- \`with\`：创建临时作用域（严格模式禁用）

> **面试要点**：作用域链在函数**定义时**确定（词法作用域），\`this\` 在函数**调用时**确定（动态绑定）。`
  },
  {
    id: 'js-010',
    category: 'javascript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['IIFE', '模块化', '作用域'],
    question: '什么是 IIFE（立即执行函数）？有什么用途？',
    answer: `**IIFE**（Immediately Invoked Function Expression）是在定义后立即执行的函数表达式。

### 语法

\`\`\`javascript
// 常见写法
;(function () {
  console.log('executed immediately')
})()

// 箭头函数
;(() => {
  console.log('also works')
})()

// 带参数
;(function (name) {
  console.log('Hello, ' + name)
})('World')
\`\`\`

### 用途

1. **创建独立作用域**（避免污染全局）
2. **模块模式**（ES6 前的模块化方案）
3. **闭包陷阱**（循环中保存变量值）

\`\`\`javascript
// 模块模式
const Counter = (function () {
  let count = 0  // 私有变量
  return {
    increment() { return ++count },
    getCount() { return count }
  }
})()

// 解决循环闭包问题
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0)
  })(i)
}
// 输出 0, 1, 2
\`\`\`

### 现代开发中
ES6 的 \`let\` / \`const\` 和模块系统（\`import\` / \`export\`）已基本取代 IIFE 的用途，但在一些库的打包产物中仍常见。`
  },

  // ========== 原型与继承 ==========
  {
    id: 'js-011',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['原型链', 'prototype', '继承'],
    question: '请描述 JavaScript 的原型链',
    answer: `**原型链**是 JavaScript 实现继承的机制。每个对象都有一个 \`__proto__\`（即 [[Prototype]]）指向其构造函数的 \`prototype\` 对象。

### 原型链结构

\`\`\`
实例对象
  └─ __proto__ → 构造函数.prototype
                   ├─ constructor → 构造函数本身
                   └─ __proto__ → 父构造函数.prototype
                                   └─ ... → Object.prototype
                                              └─ __proto__ → null
\`\`\`

### 具体示例

\`\`\`javascript
function Person(name) {
  this.name = name
}
Person.prototype.sayHi = function () {
  console.log('Hi, ' + this.name)
}

const p = new Person('Tom')

p.sayHi()              // 'Hi, Tom'（通过原型链找到）
p.__proto__            // Person.prototype
p.__proto__.__proto__  // Object.prototype
p.__proto__.__proto__.__proto__  // null（原型链终点）
\`\`\`

### 属性查找过程

访问 \`p.toString()\` 时：
1. 查找 \`p\` 自身 → 没有 \`toString\`
2. 查找 \`p.__proto__\`（Person.prototype）→ 没有
3. 查找 \`p.__proto__.__proto__\`（Object.prototype）→ 找到 \`toString\`

### 常见判断方法

\`\`\`javascript
p.constructor === Person              // true
Person.prototype.isPrototypeOf(p)     // true
Object.getPrototypeOf(p) === Person.prototype  // true
Object.prototype.toString.call(p)     // '[object Object]'
\`\`\`

### 注意事项
- \`__proto__\` 是非标准属性，生产环境应使用 \`Object.getPrototypeOf()\` / \`Object.setPrototypeOf()\`
- 修改原型链（\`Object.setPrototypeOf\`）性能差，应在创建时通过 \`Object.create()\` 设置`
  },
  {
    id: 'js-012',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['new', '构造函数', '实例化'],
    question: 'new 操作符做了哪些事情？如何手写一个 new？',
    answer: `### new 做了 4 件事

1. **创建一个新的空对象**
2. **将新对象的 \`__proto__\` 指向构造函数的 \`prototype\`**
3. **将构造函数的 \`this\` 绑定到新对象并执行**
4. **如果构造函数返回对象，则返回该对象；否则返回新对象**

### 手写 new

\`\`\`javascript
function myNew(Constructor, ...args) {
  // 1. 创建新对象，原型指向构造函数的 prototype
  const obj = Object.create(Constructor.prototype)

  // 2. 执行构造函数，绑定 this
  const result = Constructor.apply(obj, args)

  // 3. 如果返回值是对象则使用该对象，否则返回新创建的对象
  return result instanceof Object ? result : obj
}

// 测试
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.sayHi = function () {
  console.log('Hi, ' + this.name)
}

const p = myNew(Person, 'Tom', 25)
p.sayHi()  // 'Hi, Tom'
\`\`\`

### 构造函数返回值的影响

\`\`\`javascript
function Foo() {
  this.name = 'foo'
  return { name: 'bar' }  // 返回对象 → 使用该对象
}
new Foo().name  // 'bar'

function Bar() {
  this.name = 'bar'
  return 'string'  // 返回原始值 → 忽略，使用 this
}
new Bar().name  // 'bar'
\`\`\``
  },
  {
    id: 'js-013',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['继承', '原型链', 'ES6'],
    question: 'JavaScript 有哪些继承方式？各有什么优缺点？',
    answer: `### 1. 原型链继承

\`\`\`javascript
function Parent() { this.colors = ['red'] }
Parent.prototype.sayHi = function () {}

function Child() {}
Child.prototype = new Parent()
\`\`\`
- ✅ 简单，能继承原型方法
- ❌ 引用类型属性被所有实例共享，无法传参

### 2. 构造函数继承（call/apply）

\`\`\`javascript
function Parent(name) { this.name = name; this.colors = ['red'] }
function Child(name) { Parent.call(this, name) }
\`\`\`
- ✅ 解决引用类型共享问题，可传参
- ❌ 无法继承原型上的方法

### 3. 组合继承（最常用）

\`\`\`javascript
function Parent(name) { this.name = name; this.colors = ['red'] }
Parent.prototype.sayHi = function () {}

function Child(name, age) {
  Parent.call(this, name)   // 第二次调用 Parent
  this.age = age
}
Child.prototype = new Parent()  // 第一次调用 Parent
Child.prototype.constructor = Child
\`\`\`
- ✅ 结合两者优点
- ❌ Parent 被调用了两次

### 4. 寄生组合继承（最优方案）

\`\`\`javascript
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype)
  Child.prototype.constructor = Child
}

function Parent(name) { this.name = name }
Parent.prototype.sayHi = function () {}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
inherit(Child, Parent)
\`\`\`
- ✅ 只调用一次 Parent，原型链正确
- ✅ 最理想的继承方案

### 5. ES6 class 继承

\`\`\`javascript
class Parent {
  constructor(name) { this.name = name }
  sayHi() { console.log(this.name) }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
\`\`\`
- ✅ 语法简洁，本质是寄生组合继承的语法糖
- ✅ 推荐使用`
  },
  {
    id: 'js-014',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['class', 'ES6', '继承'],
    question: 'ES6 class 与 ES5 构造函数有什么区别？',
    answer: `\`class\` 是构造函数的语法糖，但有一些关键区别：

### 主要区别

| 特性 | ES5 构造函数 | ES6 class |
|------|-------------|-----------|
| 声明提升 | ✅ 有提升 | ❌ 无提升（TDZ） |
| 不加 new 调用 | 作为普通函数执行 | 报错 |
| 原型方法可枚举 | ✅ 可枚举 | ❌ 不可枚举 |
| 静态方法 | \`Foo.staticMethod = fn\` | \`static method()\` |
| 私有字段 | 闭包模拟 | \`#field\` 语法 |
| 多继承 | 不支持 | 不支持（但可用 mixin） |

### 代码对比

\`\`\`javascript
// ES5
function Person(name) {
  this.name = name
}
Person.prototype.sayHi = function () {}
Person.create = function () { return new Person('default') }

// ES6
class Person {
  #age = 0  // 私有字段

  constructor(name) {
    this.name = name
  }

  sayHi() {}  // 不可枚举

  static create() {
    return new Person('default')
  }

  get age() { return this.#age }
}
\`\`\`

### class 的特殊行为
- \`class\` 声明存在**暂时性死区**，不能在声明前使用
- \`class\` 内部默认使用严格模式
- \`class\` 的方法定义在 \`prototype\` 上，且 \`enumerable: false\``
  },
  {
    id: 'js-015',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['Object.create', '原型', '继承'],
    question: 'Object.create(null) 和 {} 有什么区别？什么时候用 Object.create(null)？',
    answer: `### 核心区别

\`\`\`javascript
const obj1 = {}
const obj2 = Object.create(null)

obj1.__proto__            // Object.prototype
obj2.__proto__            // undefined
Object.getPrototypeOf(obj2)  // null
\`\`\`

- \`{}\`：原型指向 \`Object.prototype\`，继承了 \`toString\`、\`hasOwnProperty\` 等方法
- \`Object.create(null)\`：原型为 \`null\`，是一个**纯净对象**，没有任何原型方法

### 使用场景

1. **字典/Map**：避免原型链上的属性干扰

\`\`\`javascript
// 问题：原型属性干扰
const dict = {}
dict.constructor  // ƒ Object() {...]（原型链上的属性）

// 解决：纯净对象
const pureDict = Object.create(null)
pureDict.constructor  // undefined
pureDict.hasOwnProperty  // undefined
\`\`\`

2. **防止原型污染**

\`\`\`javascript
// 作为缓存对象时，避免 __proto__ 等特殊属性名冲突
const cache = Object.create(null)
cache['__proto__'] = 'value'  // 安全，不会污染原型链
\`\`\`

3. **Vue 源码中的使用**：Vue 内部大量使用 \`Object.create(null)\` 创建无原型的对象作为缓存映射表，性能更好。

### 注意事项
- \`Object.create(null)\` 创建的对象没有 \`toString\`，某些操作会出错：
\`\`\`javascript
const obj = Object.create(null)
obj + ''           // TypeError: Cannot convert object to primitive value
\`\${obj}\`          // TypeError
JSON.stringify(obj) // '{}'  ✅ 正常
\`\`\``
  },

  // ========== this 指向 ==========
  {
    id: 'js-016',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['this', '绑定规则'],
    question: 'JavaScript 中 this 的指向规则是什么？',
    answer: `\`this\` 的指向取决于**函数的调用方式**，有 4 种绑定规则：

### 1. 默认绑定（独立调用）

\`\`\`javascript
function foo() { console.log(this) }
foo()  // 非严格模式：window；严格模式：undefined
\`\`\`

### 2. 隐式绑定（作为对象方法）

\`\`\`javascript
const obj = {
  name: 'Tom',
  sayHi() { console.log(this.name) }
}
obj.sayHi()  // 'Tom'（this → obj）

// 隐式丢失
const fn = obj.sayHi
fn()  // undefined（this → window/undefined）
\`\`\`

### 3. 显式绑定（call/apply/bind）

\`\`\`javascript
function greet(greeting) {
  console.log(greeting + ', ' + this.name)
}
const person = { name: 'Tom' }

greet.call(person, 'Hi')     // 'Hi, Tom'
greet.apply(person, ['Hi'])  // 'Hi, Tom'
const bound = greet.bind(person, 'Hi')
bound()  // 'Hi, Tom'
\`\`\`

### 4. new 绑定

\`\`\`javascript
function Person(name) {
  this.name = name  // this → 新创建的对象
}
new Person('Tom')
\`\`\`

### 优先级

\`new\` > 显式绑定 > 隐式绑定 > 默认绑定

### 箭头函数（特殊）

箭头函数**没有自己的 this**，继承外层作用域的 \`this\`，且不可被 \`call/apply/bind\` 修改：

\`\`\`javascript
const obj = {
  name: 'Tom',
  arrow: () => console.log(this.name),
  normal() { console.log(this.name) }
}
obj.arrow()   // undefined 或 '' （this → 外层 window）
obj.normal()  // 'Tom'
\`\`\``
  },
  {
    id: 'js-017',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['call', 'apply', 'bind'],
    question: 'call、apply、bind 的区别？如何手写实现？',
    answer: `### 三者对比

| 方法 | 参数 | 执行时机 | 返回值 |
|------|------|----------|--------|
| \`call\` | \`(thisArg, arg1, arg2, ...)\` | 立即执行 | 函数返回值 |
| \`apply\` | \`(thisArg, [argsArray])\` | 立即执行 | 函数返回值 |
| \`bind\` | \`(thisArg, arg1, ...)\` | 返回新函数 | 新函数 |

### 手写 call

\`\`\`javascript
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx == null ? globalThis : Object(ctx)
  const key = Symbol('fn')
  ctx[key] = this
  const result = ctx[key](...args)
  delete ctx[key]
  return result
}
\`\`\`

### 手写 apply

\`\`\`javascript
Function.prototype.myApply = function (ctx, args = []) {
  ctx = ctx == null ? globalThis : Object(ctx)
  const key = Symbol('fn')
  ctx[key] = this
  const result = ctx[key](...args)
  delete ctx[key]
  return result
}
\`\`\`

### 手写 bind

\`\`\`javascript
Function.prototype.myBind = function (ctx, ...outerArgs) {
  const fn = this
  return function (...innerArgs) {
    // 支持 new 调用
    if (new.target) {
      return new fn(...outerArgs, ...innerArgs)
    }
    return fn.apply(ctx, [...outerArgs, ...innerArgs])
  }
}
\`\`\`

### 核心原理
利用 \`对象.方法()\` 的隐式绑定规则，将函数作为对象的属性临时调用，使 \`this\` 指向该对象。用 \`Symbol\` 避免属性名冲突。`
  },
  {
    id: 'js-018',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['this', '箭头函数'],
    question: '箭头函数和普通函数有哪些区别？',
    answer: `### 核心区别

| 特性 | 普通函数 | 箭头函数 |
|------|----------|----------|
| \`this\` | 动态绑定，由调用方式决定 | **词法 this**，继承外层作用域 |
| \`arguments\` | 有自己的 \`arguments\` | 没有，用 \`...args\` 代替 |
| \`new\` | 可作为构造函数 | ❌ 不能用 \`new\` |
| \`prototype\` | 有 | ❌ 没有 |
| \`super\` | ❌ | ✅ 可访问外层的 \`super\` |
| \`yield\` | 可用作 generator | ❌ 不能 |
| 严格模式 | 需声明 \`'use strict'\` | 内部默认严格模式 |

### this 的差异

\`\`\`javascript
const obj = {
  count: 0,
  // 普通函数：this → obj
  normalIncrement() {
    setInterval(function () {
      this.count++  // ❌ this → window
    }, 1000)
  },
  // 箭头函数：this → obj（继承外层）
  arrowIncrement() {
    setInterval(() => {
      this.count++  // ✅ this → obj
    }, 1000)
  }
}
\`\`\`

### 不能使用箭头函数的场景

1. **对象方法**（需要动态 this）
2. **原型方法**
3. **构造函数**
4. **事件监听器**（需要 \`this\` 指向 DOM 元素）
5. **Vue 选项式 API 的 methods**

\`\`\`javascript
// ❌ 不适合
const obj = {
  name: 'Tom',
  sayHi: () => console.log(this.name)  // this → window
}

// ✅ 适合
const obj = {
  name: 'Tom',
  sayHi() { console.log(this.name) }
}
\`\`\``
  },
  {
    id: 'js-019',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['this', '执行上下文'],
    question: '以下代码输出什么？解释原因。',
    answer: `\`\`\`javascript
var name = 'window'
var obj = {
  name: 'obj',
  fn1: function () { console.log(this.name) },
  fn2: () => console.log(this.name),
  fn3: function () {
    return function () { console.log(this.name) }
  },
  fn4: function () {
    return () => console.log(this.name)
  }
}

obj.fn1()        // 'obj'
obj.fn2()        // 'window'
obj.fn1()()      // ❌ fn1 不返回函数，这里报错
var f3 = obj.fn3()
f3()             // 'window'
var f4 = obj.fn4()
f4()             // 'obj'
\`\`\`

### 逐行分析

**obj.fn1() → 'obj'**
普通函数，隐式绑定，\`this → obj\`

**obj.fn2() → 'window'**
箭头函数没有自己的 \`this\`，继承外层作用域（全局），\`this → window\`

**obj.fn3()() → 先 var f3 = obj.fn3()，f3() → 'window'**
\`fn3\` 返回一个普通函数，赋值给 \`f3\` 后独立调用，默认绑定 \`this → window\`

**obj.fn4()() → 先 var f4 = obj.fn4()，f4() → 'obj'**
\`fn4\` 返回箭头函数，箭头函数的 \`this\` 继承 \`fn4\` 的 \`this\`。\`fn4\` 通过 \`obj.fn4()\` 调用，\`this → obj\`，所以箭头函数的 \`this → obj\`

### 核心规律
- 普通函数：看**调用方式**（谁调用就指向谁）
- 箭头函数：看**定义位置**（继承外层 this）`
  },
  {
    id: 'js-020',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['this', '面试题'],
    question: '手写一个函数，将任意函数转换为 this 永远绑定的版本',
    answer: `这是一个增强版 \`bind\`，确保即使在后续被 \`call/apply\` 或作为方法调用时，\`this\` 仍然不变：

\`\`\`javascript
function hardBind(fn, ctx) {
  const bound = function (...args) {
    return fn.apply(ctx, args)
  }
  // 让 bound 的原型指向 fn 的原型，支持 new
  Object.setPrototypeOf(bound, fn)
  return bound
}

// 测试
function greet(greeting) {
  console.log(greeting + ', ' + this.name)
}
const person = { name: 'Tom' }
const bound = hardBind(greet, person)

bound('Hi')                    // 'Hi, Tom'
bound.call({ name: 'Jerry' }, 'Hello')  // 'Hi, Tom'（this 不变）
\`\`\`

### 进阶版：支持 new 调用

\`\`\`javascript
function hardBind(fn, ctx, ...presetArgs) {
  const bound = function (...args) {
    // 如果是 new 调用，this 指向新实例，不用 ctx
    return fn.apply(
      this instanceof bound ? this : ctx,
      [...presetArgs, ...args]
    )
  }
  // 维持原型链
  bound.prototype = Object.create(fn.prototype)
  return bound
}
\`\`\`

### 实际应用
- React 早期（class 组件）在 constructor 中 \`this.handleClick = this.handleClick.bind(this)\` 就是 hardBind 的应用
- \`Function.prototype.bind\` 的原生实现就是这种模式`
  },

  // ========== 异步编程 ==========
  {
    id: 'js-021',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['事件循环', '宏任务', '微任务'],
    question: '请详细描述 JavaScript 的事件循环（Event Loop）机制',
    answer: `JavaScript 是**单线程**语言，通过**事件循环**实现异步非阻塞。

### 执行栈与任务队列

1. **执行栈**（Call Stack）：同步代码按顺序入栈执行
2. **微任务队列**（Microtask Queue）：\`Promise.then\`、\`queueMicrotask\`、\`MutationObserver\`
3. **宏任务队列**（Macrotask Queue）：\`setTimeout\`、\`setInterval\`、\`I/O\`、\`UI rendering\`

### 事件循环流程

\`\`\`
1. 执行同步代码（执行栈清空）
2. 执行所有微任务（清空微任务队列）
3. 执行一个宏任务
4. 回到步骤 2
\`\`\`

### 经典示例

\`\`\`javascript
console.log('1')                        // 同步

setTimeout(() => console.log('2'), 0)   // 宏任务

Promise.resolve().then(() => {
  console.log('3')                       // 微任务
}).then(() => {
  console.log('4')                       // 微任务
})

console.log('5')                        // 同步

// 输出：1 → 5 → 3 → 4 → 2
\`\`\`

### 执行过程
1. 同步代码：\`1\`、\`5\` 先输出
2. 微任务队列：\`3\`、\`4\` 输出
3. 宏任务队列：\`2\` 输出

### Node.js 中的事件循环

Node.js 有更复杂的阶段模型：
\`\`\`
timers → pending callbacks → idle, prepare → poll → check → close callbacks
\`\`\`
- \`process.nextTick\` 优先级高于所有微任务
- \`setImmediate\` 在 check 阶段执行

### 关键点
- **微任务在每次宏任务后全部执行完**，不是只执行一个
- \`async/await\` 本质是 Promise 的语法糖，\`await\` 后的代码相当于 \`.then()\``
  },
  {
    id: 'js-022',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Promise', '异步'],
    question: 'Promise 的状态有哪些？常用方法有哪些？',
    answer: `### 三种状态

- **pending**（等待中）→ 初始状态
- **fulfilled**（已成功）→ \`resolve()\` 触发
- **rejected**（已失败）→ \`reject()\` 触发

状态一旦改变就**不可逆**：pending → fulfilled 或 pending → rejected

### 实例方法

\`\`\`javascript
promise
  .then((result) => {})    // 成功回调
  .catch((error) => {})     // 失败回调
  .finally(() => {})        // 无论成功失败都执行
\`\`\`

### 静态方法

| 方法 | 说明 |
|------|------|
| \`Promise.resolve(value)\` | 返回已成功的 Promise |
| \`Promise.reject(reason)\` | 返回已失败的 Promise |
| \`Promise.all([...])\` | 全部成功才成功，一个失败即失败 |
| \`Promise.allSettled([...])\` | 等待全部完成，返回每个结果 |
| \`Promise.race([...])\` | 返回第一个完成的（无论成功/失败） |
| \`Promise.any([...])\` | 返回第一个成功的 |

\`\`\`javascript
// all：全部成功
Promise.all([fetchA(), fetchB()])
  .then(([a, b]) => console.log(a, b))
  .catch(err => console.log('任一失败'))

// allSettled：等待全部完成
Promise.allSettled([fetchA(), fetchB()])
  .then(results => {
    results.forEach(r => {
      console.log(r.status)  // 'fulfilled' 或 'rejected'
    })
  })

// race：第一个完成
Promise.race([
  fetch(url),
  new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))
])

// any：第一个成功
Promise.any([fetchA(), fetchB(), fetchC()])
  .then(first => console.log('第一个成功:', first))
\`\`\`

### 链式调用

\`\`\`javascript
Promise.resolve(1)
  .then(v => v + 1)       // 2
  .then(v => Promise.resolve(v + 1))  // 3（支持返回 Promise）
  .then(v => console.log(v))  // 3
\`\`\`

> **注意**：\`.then\` 返回的值会被 \`Promise.resolve()\` 包装，所以可以返回普通值或 Promise。`
  },
  {
    id: 'js-023',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['Promise', '手写'],
    question: '手写一个符合 Promise/A+ 规范的 Promise',
    answer: `\`\`\`javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state !== 'pending') return
      if (value instanceof MyPromise) {
        value.then(resolve, reject)
        return
      }
      this.state = 'fulfilled'
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn())
    }

    const reject = (reason) => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn())
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledTask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }

      const rejectedTask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }

      if (this.state === 'fulfilled') fulfilledTask()
      else if (this.state === 'rejected') rejectedTask()
      else {
        this.onFulfilledCallbacks.push(fulfilledTask)
        this.onRejectedCallbacks.push(rejectedTask)
      }
    })

    return promise2
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle'))
    }
    if (x instanceof MyPromise) {
      x.then(resolve, reject)
    } else if (x !== null && typeof x === 'object' || typeof x === 'function') {
      let then
      try {
        then = x.then
      } catch (err) {
        return reject(err)
      }
      if (typeof then === 'function') {
        let called = false
        try {
          then.call(
            x,
            y => {
              if (called) return
              called = true
              this.resolvePromise(promise2, y, resolve, reject)
            },
            r => {
              if (called) return
              called = true
              reject(r)
            }
          )
        } catch (err) {
          if (called) return
          reject(err)
        }
      } else {
        resolve(x)
      }
    } else {
      resolve(x)
    }
  }

  catch(fn) { return this.then(null, fn) }

  finally(fn) {
    return this.then(
      v => MyPromise.resolve(fn()).then(() => v),
      r => MyPromise.resolve(fn()).then(() => { throw r })
    )
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = []
      let count = 0
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(v => {
          results[i] = v
          if (++count === promises.length) resolve(results)
        }, reject)
      })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => MyPromise.resolve(p).then(resolve, reject))
    })
  }
}
\`\`\``
  },
  {
    id: 'js-024',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['async/await', '异步'],
    question: 'async/await 的原理是什么？相比 Promise 有什么优势？',
    answer: `\`async/await\` 是 Generator + Promise 的**语法糖**，让异步代码看起来像同步代码。

### 原理

\`async\` 函数返回一个 Promise，\`await\` 暂停函数执行直到 Promise 完成：

\`\`\`javascript
// async/await
async function fetchData() {
  const res = await fetch('/api')     // 暂停，等 Promise resolve
  const data = await res.json()
  return data                          // 返回值被 Promise.resolve 包装
}

// 等价的 Promise 写法
function fetchData() {
  return fetch('/api')
    .then(res => res.json())
    .then(data => data)
}
\`\`\`

### 本质：Generator 自动执行

\`\`\`javascript
// Generator 版本
function* fetchDataGen() {
  const res = yield fetch('/api')
  const data = yield res.json()
  return data
}

// 自动执行器（简化版）
function run(gen) {
  const it = gen()
  function step(val) {
    const { value, done } = it.next(val)
    if (done) return value
    return value.then(step)
  }
  return step()
}
run(fetchDataGen)
\`\`\`

### 优势

1. **可读性好**：代码结构像同步，没有回调嵌套
2. **错误处理**：可以用 \`try/catch\` 捕获异步错误
3. **调试方便**：可以在 \`await\` 后打断点

\`\`\`javascript
// Promise 链式调用
function process() {
  return fetchA()
    .then(a => fetchB(a))
    .then(b => fetchC(b))
    .catch(err => console.log(err))
}

// async/await 更清晰
async function process() {
  try {
    const a = await fetchA()
    const b = await fetchB(a)
    const c = await fetchC(b)
    return c
  } catch (err) {
    console.log(err)
  }
}
\`\`\`

### 注意事项
- \`await\` 只能在 \`async\` 函数内使用（顶层 await 需要 ES2022）
- \`await\` 后的代码相当于 \`.then()\` 的回调，是微任务
- 并发请求时不要用 \`await\` 串行，应该用 \`Promise.all\`：
\`\`\`javascript
// ❌ 串行，慢
const a = await fetchA()
const b = await fetchB()

// ✅ 并行，快
const [a, b] = await Promise.all([fetchA(), fetchB()])
\`\`\``
  },
  {
    id: 'js-025',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['事件循环', '面试题', '输出题'],
    question: '以下代码的输出顺序是什么？解释原因。',
    answer: `\`\`\`javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

async1()

new Promise((resolve) => {
  console.log('promise start')
  resolve()
}).then(() => {
  console.log('promise then')
})

console.log('script end')
\`\`\`

### 输出结果

\`\`\`
script start
async1 start
async2
promise start
script end
async1 end
promise then
setTimeout
\`\`\`

### 详细分析

**1. 同步代码执行**
- \`script start\` — 同步
- \`async1()\` 调用：
  - \`async1 start\` — 同步
  - \`await async2()\` — \`async2\` 输出 \`async2\`（同步），\`await\` 之后的代码 \`async1 end\` 进入微任务队列
- \`new Promise\`：
  - \`promise start\` — 同步（executor 立即执行）
  - \`.then\` 回调 \`promise then\` 进入微任务队列
- \`script end\` — 同步

**2. 微任务队列执行**
- \`async1 end\` — await 后的代码
- \`promise then\` — then 回调

**3. 宏任务队列执行**
- \`setTimeout\`

### 核心规则
- \`await\` 之后的代码等价于 \`.then()\` 回调，是**微任务**
- \`new Promise\` 的 executor 是**同步**执行的
- \`.then\` 回调是**微任务**`
  },
  {
    id: 'js-026',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['并发控制', 'Promise', '异步'],
    question: '如何实现并发请求控制（限制同时发起的请求数量）？',
    answer: `### 方案：维护一个执行队列

\`\`\`javascript
async function concurrentLimit(tasks, limit) {
  const results = []
  const executing = new Set()

  for (const task of tasks) {
    // 创建 Promise 并加入执行集合
    const p = task().then(result => {
      executing.delete(p)
      return result
    })
    executing.add(p)
    results.push(p)

    // 当并发数达到上限，等待最快的一个完成
    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  return Promise.all(results)
}
\`\`\`

### 使用示例

\`\`\`javascript
// 模拟 10 个请求，限制并发 3
const urls = Array.from({ length: 10 }, (_, i) => \`/api/\${i}\`)
const tasks = urls.map(url => () =>
  fetch(url).then(r => r.json())
)

concurrentLimit(tasks, 3).then(results => {
  console.log('全部完成:', results)
})
\`\`\`

### 进阶版：支持回调通知

\`\`\`javascript
class ConcurrentPool {
  constructor(limit) {
    this.limit = limit
    this.queue = []
    this.active = 0
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this.run()
    })
  }

  run() {
    while (this.active < this.limit && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift()
      this.active++
      task()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.active--
          this.run()
        })
    }
  }
}

// 使用
const pool = new ConcurrentPool(3)
urls.forEach(url => pool.add(() => fetch(url)))
\`\`\`

### 实际应用场景
- 批量上传文件
- 爬虫控制并发
- 大量 API 请求需要限流`
  },
  {
    id: 'js-027',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Promise', '重试', '容错'],
    question: '如何实现一个带重试机制的请求函数？',
    answer: `\`\`\`javascript
function retryRequest(requestFn, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      requestFn()
        .then(resolve)
        .catch((err) => {
          if (n <= 0) {
            reject(err)
          } else {
            console.log(\`重试第 \${retries - n + 1} 次...\`)
            setTimeout(() => attempt(n - 1), delay)
          }
        })
    }
    attempt(retries)
  })
}
\`\`\`

### 使用示例

\`\`\`javascript
function fetchUser() {
  return fetch('/api/user').then(r => {
    if (!r.ok) throw new Error('请求失败')
    return r.json()
  })
}

retryRequest(fetchUser, 3, 1000)
  .then(user => console.log('成功:', user))
  .catch(err => console.log('重试 3 次后仍失败:', err))
\`\`\`

### 进阶：指数退避

\`\`\`javascript
function retryWithBackoff(fn, retries = 3, baseDelay = 1000) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (n <= 0) {
            reject(err)
          } else {
            const delay = baseDelay * Math.pow(2, retries - n)
            console.log(\`第 \${retries - n + 1} 次重试，等待 \${delay}ms\`)
            setTimeout(() => attempt(n - 1), delay)
          }
        })
    }
    attempt(retries)
  })
}
// 延迟：1s → 2s → 4s
\`\`\`

### async/await 版

\`\`\`javascript
async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn()
  } catch (err) {
    if (retries <= 0) throw err
    await new Promise(r => setTimeout(r, delay))
    return retry(fn, retries - 1, delay)
  }
}
\`\`\``
  },
  {
    id: 'js-028',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['事件循环', '宏任务', '微任务', '面试题'],
    question: '请分析以下代码的输出结果',
    answer: `\`\`\`javascript
const p1 = new Promise((resolve) => {
  console.log('p1 constructor')
  resolve(1)
})

const p2 = new Promise((resolve) => {
  console.log('p2 constructor')
  setTimeout(() => resolve(2), 0)
})

console.log('start')

p1.then(v => console.log('p1 then:', v))
p2.then(v => console.log('p2 then:', v))

queueMicrotask(() => console.log('microtask'))

console.log('end')
\`\`\`

### 输出结果

\`\`\`
p1 constructor
p2 constructor
start
end
p1 then: 1
microtask
p2 then: 2
\`\`\`

### 分析

**同步阶段：**
1. \`new Promise\` 的 executor **同步执行** → \`p1 constructor\`
2. \`p2\` 的 executor 同步执行 → \`p2 constructor\`，\`setTimeout\` 放入宏任务队列
3. \`start\`
4. \`p1.then\` 回调放入微任务队列（p1 已 resolve）
5. \`p2.then\` 回调暂不放入队列（p2 还在 pending）
6. \`queueMicrotask\` 放入微任务队列
7. \`end\`

**微任务阶段：**
8. \`p1 then: 1\` — 先注册的先执行
9. \`microtask\`

**宏任务阶段：**
10. \`setTimeout\` 回调执行，\`p2\` resolve
11. \`p2\` resolve 触发 \`p2.then\` → 放入微任务队列
12. 本轮宏任务结束后执行微任务 → \`p2 then: 2\`

### 关键点
- \`new Promise\` 的 executor 是**同步**执行的
- \`then\` 回调只有当 Promise 状态变为 fulfilled/rejected 后才会进入微任务队列
- \`queueMicrotask\` 显式添加微任务`
  },

  // ========== ES6+ 特性 ==========
  {
    id: 'js-029',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['解构', '展开', 'ES6'],
    question: 'ES6 中有哪些常用特性？请列举并说明',
    answer: `### 常用 ES6+ 特性

**1. let / const** — 块级作用域变量声明

**2. 箭头函数** — \`(a, b) => a + b\`

**3. 解构赋值**
\`\`\`javascript
const { name, age = 18 } = person    // 对象解构 + 默认值
const [first, ...rest] = arr          // 数组解构 + 剩余元素
function foo({ x, y } = {}) {}        // 函数参数解构
\`\`\`

**4. 模板字符串**
\`\`\`javascript
const html = \`<div>\${name}</div>\`
\`\`\`

**5. 展开运算符**
\`\`\`javascript
const merged = { ...obj1, ...obj2 }   // 对象合并
const combined = [...arr1, ...arr2]   // 数组合并
foo(...args)                           // 函数参数展开
\`\`\`

**6. 默认参数**
\`\`\`javascript
function foo(a = 1, b = 2) {}
\`\`\`

**7. Promise + async/await**

**8. Class**
\`\`\`javascript
class Person {
  #private = 'secret'   // 私有字段
  static create() {}
}
\`\`\`

**9. 模块系统**
\`\`\`javascript
import { foo } from './module.js'
export const bar = 123
export default function() {}
\`\`\`

**10. Map / Set / WeakMap / WeakSet**
\`\`\`javascript
const map = new Map([['key', 'value']])
const set = new Set([1, 2, 3])
\`\`\`

**11. 迭代器与生成器**
\`\`\`javascript
function* gen() { yield 1; yield 2 }
for (const v of gen()) console.log(v)
\`\`\`

**12. 可选链与空值合并（ES2020）**
\`\`\`javascript
const name = user?.profile?.name ?? 'anonymous'
\`\`\`

**13. 其他**
- \`Symbol\` — 唯一标识
- \`Proxy\` / \`Reflect\` — 元编程
- \`BigInt\` — 大整数
- \`Array.flat()\` / \`Array.flatMap()\`
- \`Object.fromEntries()\``
  },
  {
    id: 'js-030',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Proxy', 'Reflect', '响应式'],
    question: 'Proxy 和 Reflect 是什么？有什么应用场景？',
    answer: `### Proxy

\`Proxy\` 用于创建一个对象的代理，可以拦截对该对象的基本操作（属性查找、赋值、枚举、函数调用等）。

\`\`\`javascript
const handler = {
  get(target, key, receiver) {
    console.log(\`读取 \${key}\`)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log(\`设置 \${key} = \${value}\`)
    return Reflect.set(target, key, value, receiver)
  }
}

const proxy = new Proxy({ name: 'Tom', age: 25 }, handler)
proxy.name       // 打印: 读取 name
proxy.age = 26   // 打印: 设置 age = 26
\`\`\`

### 常用拦截器（Trap）

| Trap | 拦截操作 |
|------|----------|
| \`get\` | 属性读取 \`obj.key\` |
| \`set\` | 属性设置 \`obj.key = val\` |
| \`has\` | \`in\` 操作符 |
| \`deleteProperty\` | \`delete\` 操作符 |
| \`ownKeys\` | \`Object.keys()\` |
| \`apply\` | 函数调用 |
| \`construct\` | \`new\` 操作符 |

### Reflect

\`Reflect\` 提供与 Proxy trap 对应的静态方法，使操作更加规范：

\`\`\`javascript
Reflect.has(obj, 'key')     // 等同于 'key' in obj
Reflect.get(obj, 'key')     // 等同于 obj.key
Reflect.set(obj, 'key', v)  // 等同于 obj.key = v
Reflect.ownKeys(obj)        // 等同于 Object.keys(obj)
Reflect.deleteProperty(obj, 'key')  // 等同于 delete obj.key
\`\`\`

### 应用场景

**1. Vue 3 响应式系统**
\`\`\`javascript
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)  // 收集依赖
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)  // 触发更新
      return result
    }
  })
}
\`\`\`

**2. 数据校验**
\`\`\`javascript
const validator = new Proxy({}, {
  set(target, key, value) {
    if (key === 'age' && (value < 0 || value > 150)) {
      throw new RangeError('无效年龄')
    }
    return Reflect.set(target, key, value)
  }
})
\`\`\`

**3. 私有属性保护**

### Proxy vs Object.defineProperty
- Proxy 能监听**新增属性**，defineProperty 不能
- Proxy 能监听**数组操作**，defineProperty 不能（需要 hack）
- Proxy 性能更好，是 Vue 3 的核心改进`
  },
  {
    id: 'js-031',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['Map', 'Set', 'WeakMap', '数据结构'],
    question: 'Map/Set 和 WeakMap/WeakSet 的区别？使用场景是什么？',
    answer: `### 对比表

| 特性 | Map | WeakMap | Set | WeakSet |
|------|-----|---------|-----|---------|
| 键类型 | 任意 | **仅对象** | — | — |
| 值类型 | 任意 | 任意 | — | **仅对象** |
| 可遍历 | ✅ | ❌ | ✅ | ❌ |
| 强引用 | ✅ | ❌（弱引用） | ✅ | ❌（弱引用） |
| size 属性 | ✅ | ❌ | ✅ | ❌ |
| GC 回收 | 不会 | **会** | 不会 | **会** |

### Map

\`\`\`javascript
const map = new Map()
map.set('name', 'Tom')
map.set(1, 'number key')     // 任意类型键
map.set({ id: 1 }, 'object key')

map.get('name')   // 'Tom'
map.has('name')   // true
map.size          // 3
map.forEach((v, k) => console.log(k, v))
\`\`\`

### Set

\`\`\`javascript
const set = new Set([1, 2, 2, 3, 3])
set.size          // 3（自动去重）
set.add(4)
set.has(2)        // true
set.delete(1)

// 数组去重
const unique = [...new Set([1, 1, 2, 3, 3])]
\`\`\`

### WeakMap — 弱引用映射

\`\`\`javascript
const wm = new WeakMap()
let obj = { name: 'Tom' }
wm.set(obj, 'metadata')

// 当 obj 被回收，wm 中的条目也会被自动清除
obj = null  // 触发 GC 后，wm 中对应条目消失
\`\`\`

### 使用场景

**WeakMap：**
1. **DOM 节点关联数据**（节点被移除时数据自动清理）
\`\`\`javascript
const elementData = new WeakMap()
elementData.set(domElement, { listeners: [], state: {} })
\`\`\`
2. **私有属性存储**
\`\`\`javascript
const privateFields = new WeakMap()
class Person {
  constructor(name) {
    privateFields.set(this, { _name: name })
  }
  getName() { return privateFields.get(this)._name }
}
\`\`\`
3. **缓存**（对象被回收时缓存自动失效）

**WeakSet：**
1. **对象标记**（标记某对象是否被处理过）
\`\`\`javascript
const processed = new WeakSet()
function handle(obj) {
  if (processed.has(obj)) return
  // 处理 obj...
  processed.add(obj)
}
\`\`\``
  },
  {
    id: 'js-032',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['迭代器', '生成器', 'Iterator'],
    question: '什么是迭代器（Iterator）和生成器（Generator）？',
    answer: `### Iterator（迭代器）

迭代器是一个对象，实现了 \`next()\` 方法，返回 \`{ value, done }\`。

\`\`\`javascript
function createIterator(arr) {
  let index = 0
  return {
    next() {
      return index < arr.length
        ? { value: arr[index++], done: false }
        : { value: undefined, done: true }
    }
  }
}

const it = createIterator([1, 2, 3])
it.next()  // { value: 1, done: false }
it.next()  // { value: 2, done: false }
it.next()  // { value: 3, done: false }
it.next()  // { value: undefined, done: true }
\`\`\`

### 可迭代协议（Iterable）

实现了 \`[Symbol.iterator]\` 方法的对象可被 \`for...of\` 遍历：

\`\`\`javascript
const obj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => {
        return index < this.data.length
          ? { value: this.data[index++], done: false }
          : { value: undefined, done: true }
      }
    }
  }
}

for (const v of obj) console.log(v)  // 1, 2, 3
\`\`\`

### Generator（生成器）

\`function*\` 声明生成器函数，\`yield\` 暂停执行：

\`\`\`javascript
function* gen() {
  yield 1
  yield 2
  yield 3
}

const g = gen()
g.next()  // { value: 1, done: false }
g.next()  // { value: 2, done: false }
g.next()  // { value: 3, done: false }
g.next()  // { value: undefined, done: true }

for (const v of gen()) console.log(v)  // 1, 2, 3
\`\`\`

### yield 委托

\`\`\`javascript
function* gen1() { yield 1; yield 2 }
function* gen2() { yield* gen1(); yield 3 }

for (const v of gen2()) console.log(v)  // 1, 2, 3
\`\`\`

### 应用场景

1. **自定义数据结构遍历**
2. **惰性求值**（按需生成值，节省内存）
3. **状态机**
4. **async/await 的底层实现**（Generator + 自动执行器）

\`\`\`javascript
// 无限序列
function* naturalNumbers() {
  let n = 1
  while (true) yield n++
}
const numbers = naturalNumbers()
numbers.next().value  // 1
numbers.next().value  // 2
// 不会内存溢出
\`\`\``
  },
  {
    id: 'js-033',
    category: 'javascript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['可选链', '空值合并', 'ES2020'],
    question: '可选链（?.）和空值合并（??）运算符的作用是什么？',
    answer: `### 可选链 ?.

安全地访问深层嵌套的属性，遇到 \`null/undefined\` 时短路返回 \`undefined\`，不会报错。

\`\`\`javascript
// ❌ 旧写法：层层判断
const name = user && user.profile && user.profile.name

// ✅ 可选链
const name = user?.profile?.name
// 如果 user 或 user.profile 为 null/undefined → 返回 undefined

// 函数调用
const result = obj?.method?.()

// 数组索引
const first = arr?.[0]

// 动态属性名
const value = obj?.[dynamicKey]
\`\`\`

### 空值合并 ??

当左侧为 \`null\` 或 \`undefined\` 时返回右侧值。**注意与 \`||\` 的区别**：

\`\`\`javascript
// || 会将 falsy 值（0, '', false, null, undefined, NaN）都视为假
0 || 'default'     // 'default'  ❌ 不是期望的
'' || 'default'    // 'default'  ❌
false || 'default' // 'default'  ❌

// ?? 只将 null 和 undefined 视为空
0 ?? 'default'     // 0          ✅
'' ?? 'default'    // ''         ✅
false ?? 'default' // false      ✅
null ?? 'default'  // 'default'  ✅
undefined ?? 'default'  // 'default' ✅
\`\`\`

### 组合使用

\`\`\`javascript
// 获取用户名，如果不存在则使用匿名
const name = user?.profile?.name ?? '匿名'

// 获取配置，提供默认值
const port = config?.server?.port ?? 3000
\`\`\`

### 注意事项
- 不能在赋值语句左侧使用可选链：\`obj?.name = 'Tom'\` ❌ 语法错误
- 优先级：\`??\` 不能与 \`||\` / \`&&\` 直接混用，需要括号：\`(a ?? b) || c\``
  },
  {
    id: 'js-034',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['装饰器', '高阶函数', 'ES6'],
    question: '什么是装饰器模式？在 JavaScript 中如何实现？',
    answer: `**装饰器模式**：在不修改原函数的前提下，动态扩展其功能。

### 函数装饰器（高阶函数）

\`\`\`javascript
// 日志装饰器
function withLog(fn) {
  return function (...args) {
    console.log(\`调用 \${fn.name}，参数: \`, args)
    const result = fn.apply(this, args)
    console.log(\`返回: \`, result)
    return result
  }
}

// 性能装饰器
function withTimer(fn) {
  return function (...args) {
    console.time(fn.name)
    const result = fn.apply(this, args)
    console.timeEnd(fn.name)
    return result
  }
}

// 缓存装饰器
function withCache(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

// 组合使用
const enhancedFn = withCache(withTimer(withLog(complexCalc)))
\`\`\`

### 类装饰器（TC39 提案 / TypeScript）

\`\`\`javascript
// TypeScript 中的装饰器
function log(target, key, descriptor) {
  const original = descriptor.value
  descriptor.value = function (...args) {
    console.log(\`调用 \${key}\`)
    return original.apply(this, args)
  }
  return descriptor
}

class Service {
  @log
  fetchData() { /* ... */ }
}
\`\`\`

### 实际应用

**防抖 / 节流**本质上就是装饰器：

\`\`\`javascript
function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      return fn.apply(this, args)
    }
  }
}

// 使用
window.addEventListener('resize', debounce(handleResize, 300))
window.addEventListener('scroll', throttle(handleScroll, 100))
\`\`\`

### 核心思想
- **开闭原则**：对扩展开放，对修改封闭
- 装饰器比继承更灵活，避免类爆炸`
  },

  // ========== 数组/对象方法 ==========
  {
    id: 'js-035',
    category: 'javascript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['数组方法', 'map', 'filter', 'reduce'],
    question: '数组方法 map、filter、reduce 的区别和用法？',
    answer: `### map — 映射

对每个元素执行函数，返回**新数组**，长度不变。

\`\`\`javascript
const nums = [1, 2, 3]
const doubled = nums.map(n => n * 2)  // [2, 4, 6]

// 提取对象属性
const users = [{ name: 'Tom' }, { name: 'Jerry' }]
const names = users.map(u => u.name)  // ['Tom', 'Jerry']
\`\`\`

### filter — 过滤

返回满足条件的元素组成的新数组。

\`\`\`javascript
const nums = [1, 2, 3, 4, 5]
const evens = nums.filter(n => n % 2 === 0)  // [2, 4]

// 去重
const arr = [1, 2, 2, 3, 3, 3]
const unique = arr.filter((v, i, a) => a.indexOf(v) === i)  // [1, 2, 3]
\`\`\`

### reduce — 归约

将数组归约为单个值，最灵活但也最复杂。

\`\`\`javascript
// 求和
const sum = [1, 2, 3].reduce((acc, cur) => acc + cur, 0)  // 6

// 求最大值
const max = [1, 5, 3].reduce((a, b) => Math.max(a, b))  // 5

// 数组转对象
const users = [{ id: 1, name: 'Tom' }, { id: 2, name: 'Jerry' }]
const userMap = users.reduce((map, u) => {
  map[u.id] = u
  return map
}, {})  // { 1: {...}, 2: {...} }

// 扁平化
const nested = [[1, 2], [3, 4], [5]]
const flat = nested.reduce((acc, cur) => acc.concat(cur), [])  // [1, 2, 3, 4, 5]

// 分组
const people = [
  { name: 'Tom', age: 20 },
  { name: 'Jerry', age: 20 },
  { name: 'Spike', age: 30 }
]
const grouped = people.reduce((groups, p) => {
  const key = p.age
  ;(groups[key] ||= []).push(p)
  return groups
}, {})  // { 20: [...], 30: [...] }
\`\`\`

### 对比

| 方法 | 返回值 | 用途 |
|------|--------|------|
| map | 新数组（同长度） | 转换每个元素 |
| filter | 新数组（可能更短） | 筛选元素 |
| reduce | 任意值 | 聚合/归约 |

### 链式调用

\`\`\`javascript
const result = users
  .filter(u => u.age >= 18)
  .map(u => u.name)
  .reduce((acc, name) => acc + name.length, 0)
\`\`\``
  },
  {
    id: 'js-036',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['深拷贝', '浅拷贝', '引用'],
    question: '深拷贝和浅拷贝的区别？如何实现深拷贝？',
    answer: `### 区别

- **浅拷贝**：只复制第一层，嵌套的引用类型仍共享地址
- **深拷贝**：递归复制所有层级，完全独立

\`\`\`javascript
const obj = { a: 1, b: { c: 2 } }

// 浅拷贝
const shallow = { ...obj }
shallow.b.c = 99
console.log(obj.b.c)  // 99（共享引用）

// 深拷贝
const deep = structuredClone(obj)
deep.b.c = 99
console.log(obj.b.c)  // 2（独立）
\`\`\`

### 浅拷贝方法

\`\`\`javascript
const copy1 = { ...obj }              // 展开运算符
const copy2 = Object.assign({}, obj)   // Object.assign
const arrCopy = [...arr]               // 数组浅拷贝
const arrCopy2 = arr.slice()           // 数组浅拷贝
\`\`\`

### 深拷贝方法

**1. structuredClone（推荐，现代浏览器原生支持）**
\`\`\`javascript
const clone = structuredClone(obj)
// 支持循环引用、Date、RegExp、Map、Set 等
// 不支持函数、Symbol、DOM 节点
\`\`\`

**2. JSON 序列化（简单但有局限）**
\`\`\`javascript
const clone = JSON.parse(JSON.stringify(obj))
// ❌ 不支持：undefined、function、Symbol、循环引用、Date→字符串、RegExp→空对象
\`\`\`

**3. 手写深拷贝**

\`\`\`javascript
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Map) {
    const clone = new Map()
    map.set(obj, clone)
    obj.forEach((v, k) => clone.set(deepClone(k, map), deepClone(v, map)))
    return clone
  }
  if (obj instanceof Set) {
    const clone = new Set()
    map.set(obj, clone)
    obj.forEach(v => clone.add(deepClone(v, map)))
    return clone
  }

  // 处理循环引用
  if (map.has(obj)) return map.get(obj)

  const clone = Array.isArray(obj) ? [] : {}
  map.set(obj, clone)

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], map)
  }
  return clone
}
\`\`\`

### 各方法对比

| 方法 | 循环引用 | 函数 | Date/RegExp | 性能 |
|------|----------|------|-------------|------|
| structuredClone | ✅ | ❌ | ✅ | 好 |
| JSON.parse/stringify | ❌ | ❌ | ❌ | 中 |
| 手写 deepClone | ✅ | ✅ | ✅ | 可控 |`
  },
  {
    id: 'js-037',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['防抖', '节流', '性能优化'],
    question: '手写防抖（debounce）和节流（throttle）函数',
    answer: `### 防抖（Debounce）

事件停止触发 **n 秒后**执行，如果在 n 秒内再次触发则重新计时。

\`\`\`javascript
function debounce(fn, delay, immediate = false) {
  let timer = null

  return function (...args) {
    if (timer) clearTimeout(timer)

    if (immediate && !timer) {
      fn.apply(this, args)
    }

    timer = setTimeout(() => {
      if (!immediate) fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 使用
input.addEventListener('input', debounce(search, 300))
window.addEventListener('resize', debounce(updateLayout, 200))
\`\`\`

**应用场景**：搜索框输入、窗口 resize、表单验证

### 节流（Throttle）

每 **n 秒最多执行一次**，在此期间的触发被忽略。

\`\`\`javascript
// 时间戳版（第一次立即执行，最后一次不执行）
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// 定时器版（第一次不执行，最后一次会执行）
function throttle(fn, interval) {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, interval)
    }
  }
}

// 组合版（第一次和最后一次都执行）
function throttle(fn, interval) {
  let lastTime = 0
  let timer = null
  return function (...args) {
    const now = Date.now()
    const remaining = interval - (now - lastTime)

    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null }
      lastTime = now
      fn.apply(this, args)
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now()
        timer = null
        fn.apply(this, args)
      }, remaining)
    }
  }
}
\`\`\`

**应用场景**：滚动加载、按钮防重复点击、鼠标拖拽

### 对比

| | 防抖 | 节流 |
|--|------|------|
| 原理 | 重置计时器 | 固定频率执行 |
| 类比 | 电梯等人 | 电梯定时发车 |
| 场景 | 搜索联想 | 滚动监听 |`
  },

  // ========== 错误处理 ==========
  {
    id: 'js-038',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['错误处理', 'try-catch', 'Error'],
    question: 'JavaScript 中有哪些错误类型？如何正确处理异常？',
    answer: `### JavaScript 内置错误类型

\`\`\`
Error                  — 基类
├── SyntaxError        — 语法错误
├── ReferenceError     — 引用不存在的变量
├── TypeError          — 类型错误
├── RangeError         — 值超出有效范围
├── URIError           — URI 编解码错误
├── EvalError          — eval 相关（已废弃）
└── AggregateError     — 多个错误聚合（ES2021）
\`\`\`

\`\`\`javascript
console.log(a)         // ReferenceError: a is not defined
null.foo()              // TypeError: Cannot read properties of null
new Array(-1)           // RangeError: Invalid array length
decodeURIComponent('%') // URIError: URI malformed
\`\`\`

### 异常处理

\`\`\`javascript
try {
  // 可能出错的代码
  JSON.parse(invalidJson)
} catch (error) {
  // 捕获错误
  console.error(error.message)
  console.error(error.stack)
} finally {
  // 无论是否出错都执行
  cleanup()
}
\`\`\`

### 自定义错误

\`\`\`javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('邮箱不能为空', 'email')
  }
}
\`\`\`

### Promise 错误处理

\`\`\`javascript
// .catch 捕获
fetch('/api')
  .then(res => res.json())
  .catch(err => console.error('请求失败:', err))

// async/await + try/catch
async function fetchData() {
  try {
    const res = await fetch('/api')
    return await res.json()
  } catch (err) {
    console.error('请求失败:', err)
    // 可以选择重试或返回默认值
    return null
  }
}
\`\`\`

### 全局错误捕获

\`\`\`javascript
// 同步错误
window.onerror = (message, source, lineno, colno, error) => {
  console.error('全局错误:', error)
}

// Promise 未捕获的 rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 拒绝:', event.reason)
})
\`\`\`

### 最佳实践
1. **不要吞掉错误**：\`catch\` 中至少要有日志
2. **区分错误类型**：自定义错误类便于分类处理
3. **优雅降级**：出错时返回默认值或显示友好提示
4. **异步错误必须处理**：Promise 链必须有 \`catch\``
  },
  {
    id: 'js-039',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['垃圾回收', '内存管理', 'V8'],
    question: 'V8 引擎的垃圾回收机制是怎样的？',
    answer: `### V8 垃圾回收策略

V8 采用**分代回收**机制，将堆内存分为**新生代**和**老生代**。

### 新生代（Scavenge 算法）

- 存放存活时间短的对象（1~8MB）
- 分为 **From 空间** 和 **To 空间**

**回收过程：**
1. 从 GC Root 遍历，标记 From 空间中存活的对象
2. 将存活对象**复制**到 To 空间
3. 清空 From 空间
4. From 和 To 角色互换

**特点**：空间换时间，适合存活率低的场景

### 老生代（Mark-Sweep + Mark-Compact）

- 存放存活时间长、体积大的对象
- 经历过 **2 次 Scavenge 回收仍存活**的对象晋升到老生代

**Mark-Sweep（标记清除）：**
1. **标记阶段**：从 GC Root 遍历，标记所有可达对象
2. **清除阶段**：清除未标记的对象

**问题**：产生内存碎片

**Mark-Compact（标记整理）：**
1. 标记存活对象
2. 将存活对象向一端移动，紧凑排列
3. 清除边界以外的内存

**特点**：解决碎片问题，但移动对象有开销

### 增量标记与并发回收

- **增量标记**（Incremental）：将标记任务拆分成小步骤，穿插在 JS 执行之间，避免长时间停顿
- **并发回收**（Concurrent）：GC 在后台线程执行，主线程不暂停

### 引用计数（已弃用）

V8 早期尝试过引用计数，但有**循环引用**问题：
\`\`\`javascript
let a = {}
let b = {}
a.ref = b
b.ref = a
// 引用计数永远不为 0，无法回收
\`\`\`
现代 V8 使用可达性分析，彻底解决此问题。

### 常见内存泄漏场景

1. **意外的全局变量**：\`function foo() { bar = 1 }\`（未用 let/var）
2. **被遗忘的定时器**：\`setInterval\` 未清除
3. **闭包引用**：不必要的大对象被闭包持有
4. **DOM 引用**：元素被移除但 JS 变量仍引用

### 调试工具
- Chrome DevTools → Memory 面板 → Heap snapshot
- \`performance.memory\`（非标准 API）
- \`--trace-gc\` V8 启动参数`
  },
  {
    id: 'js-040',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['EventLoop', 'Node.js', '浏览器'],
    question: '浏览器和 Node.js 的事件循环有什么区别？',
    answer: `### 浏览器事件循环

\`\`\`
同步代码 → 微任务全部执行 → 一个宏任务 → 微任务全部执行 → 一个宏任务 → ...
\`\`\`

**微任务**：Promise.then、queueMicrotask、MutationObserver
**宏任务**：setTimeout、setInterval、I/O、UI 渲染

### Node.js 事件循环

\`\`\`
┌───────────────────────────┐
┌─>│         timers             │  ← setTimeout/setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks      │  ← 系统级回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare        │  ← 内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll             │  ← I/O 事件
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check             │  ← setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks       │  ← close 事件
│  └───────────────────────────┘
│
└── 每个阶段之间执行微任务
\`\`\`

### 关键区别

| 特性 | 浏览器 | Node.js |
|------|--------|---------|
| 微任务执行时机 | 每个宏任务后 | 每个阶段切换时 |
| process.nextTick | 无 | 有，优先级最高 |
| setImmediate | 无 | 有，check 阶段执行 |
| 微任务类型 | Promise.then 等 | + process.nextTick |

### 经典面试题：setTimeout vs setImmediate

\`\`\`javascript
// 顺序不确定（取决于事件循环启动时间）
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))

// 但在 I/O 回调中，setImmediate 一定先于 setTimeout
fs.readFile('file.txt', () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immediate'))
  // 总是输出: immediate → timeout
})
\`\`\`

### process.nextTick

\`\`\`javascript
Promise.resolve().then(() => console.log('promise'))
process.nextTick(() => console.log('nextTick'))
// 输出: nextTick → promise
// nextTick 优先级高于所有微任务
\`\`\`

### Node.js 11+ 的变化
Node.js 11 开始，浏览器和 Node.js 的微任务执行时机趋于一致：**每个宏任务后立即执行微任务**，而非等到当前阶段所有宏任务都执行完。`,
  },
  {
    id: 'js-041',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['fetch', '错误处理', 'HTTP', '网络请求'],
    question: '为什么用 fetch 发送 PATCH 请求返回 404 / 500，代码却没有进入 catch？正确的错误处理应该怎么写？',
    answer: `这是 fetch 最容易踩的坑之一。

### 原因：fetch 只在「网络层失败」时才 reject

\`fetch\` 的设计是：**只有在网络请求本身失败（断网、DNS 解析失败、CORS 被拦截、请求被 abort）时才会 reject 并进入 \`catch\`**。

而 HTTP 状态码 \`404\` / \`500\` 属于「请求成功到达服务器并拿到了响应」，只是响应状态码表示业务失败——这种情况 fetch 认为请求是「成功完成」的，会正常 resolve，\`Promise\` 进入 \`then\`，而不会进入 \`catch\`。

\`\`\`javascript
// ❌ 错误写法：以为 404/500 会进 catch
fetch('/api/user', { method: 'PATCH', body: JSON.stringify(data) })
  .then(res => {
    // 404/500 也会走到这里！
    return res.json()
  })
  .catch(err => {
    // 只有网络错误才进这里
  })
\`\`\`

### 正确做法：手动检查响应状态

\`\`\`javascript
fetch('/api/user', { method: 'PATCH', body: JSON.stringify(data) })
  .then(res => {
    if (!res.ok) {
      // res.ok 为 false 表示状态码 >= 400
      throw new Error('请求失败：' + res.status + ' ' + res.statusText)
    }
    return res.json()
  })
  .then(data => { /* 业务成功 */ })
  .catch(err => { /* 网络错误 + 主动抛出的 HTTP 错误都到这里 */ })

// 或更推荐的 async/await 写法
async function patchUser(data) {
  const res = await fetch('/api/user', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('HTTP ' + res.status)
  }
  return res.json()
}
\`\`\`

### 常见误区
- **误区**：axios 会对 4xx/5xx 自动 reject，于是把 axios 习惯套到 fetch 上。
- **注意**：axios 在 4xx/5xx 时确实会 reject；但 \`fetch\` 不会，二者行为不同。
- 可用 \`res.status >= 400\` 判断，但 \`res.ok\` 语义更清晰（等价于 \`200 <= status < 300\`）。`
  },
  {
    id: 'js-042',
    category: 'javascript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['requestAnimationFrame', 'setTimeout', 'setInterval', '动画', '事件循环'],
    question: 'requestAnimationFrame 和 setTimeout / setInterval 有什么区别？为什么页面动画优先用 rAF，而倒计时 / 轮询有时反而用 setTimeout？',
    answer: `### 三者的本质区别

| 维度 | requestAnimationFrame | setTimeout | setInterval |
|------|----------------------|-----------|-------------|
| 触发时机 | 浏览器**每次重绘前**（与刷新率同步，通常 60fps） | 至少等待指定毫秒后（宏任务） | 每隔指定毫秒（宏任务） |
| 后台标签页 | **自动暂停**（省电、不空转） | 被节流到 >=1s | 被节流到 >=1s |
| 精度 | 与渲染帧对齐，动画最顺滑 | 受事件循环阻塞、易抖动 | 同上，且可能「丢帧堆叠」 |
| 适合场景 | 视觉动画、滚动、逐帧渲染 | 单次延时、轮询、倒计时 | 固定间隔重复（不推荐做动画） |

### 为什么动画优先用 rAF

\`\`\`javascript
// ✅ 平滑动画：每帧根据时间戳计算进度，与屏幕刷新同步
function animate(el) {
  let start
  function step(ts) {
    if (!start) start = ts
    const p = (ts - start) / 1000        // 已过去秒数
    el.style.transform = 'translateX(' + (p * 200) + 'px)'
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
\`\`\`

如果用 \`setInterval(fn, 16)\`，定时器与渲染帧不一定对齐，容易掉帧卡顿，且在后台标签页仍持续运行浪费资源。

### 为什么倒计时 / 轮询有时用 setTimeout

- **打字机效果**：希望「每隔固定字符间隔」出现下一个字，是**时间驱动**而非帧驱动，用 \`setInterval\` 更直观。
- **倒计时器**：用 \`setTimeout\` 递归可做到**切到后台仍在计时**（rAF 会暂停），适合真实计时场景（如考试倒计时）。
- **轮询**：用 \`setTimeout\` 递归（上一次请求回来再排下一次）比 \`setInterval\` 更安全，避免请求堆积。

> 关键判断：**视觉动画 → rAF；真实时间 / 轮询 / 与帧无关的节奏 → setTimeout / setInterval**。

### 注意事项
- \`setInterval\` 回调执行时间若超过间隔，回调会「堆叠」排队，可能导致逻辑错乱，业务轮询建议用递归 \`setTimeout\`。
- 后台标签页中 \`setTimeout\` / \`setInterval\` 最小间隔被浏览器限制为 >=1000ms。`
  },
  {
    id: 'js-043',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['倒计时', 'requestAnimationFrame', 'setTimeout', '手写代码', '业务题'],
    question: '手写一个高精度倒计时器，分别用 setTimeout 递归 和 requestAnimationFrame 实现，并说明两者差异（参考 PDD 前端笔试题）。',
    answer: `### 基于 setTimeout 递归（后台仍可计时）

用**时间戳**计算剩余时间，而不是简单递减，避免定时器漂移：

\`\`\`javascript
function countdownByTimeout(duration, onTick, onEnd) {
  const endTime = Date.now() + duration
  function loop() {
    const remain = endTime - Date.now()
    if (remain <= 0) {
      onTick(0)
      onEnd && onEnd()
      return
    }
    onTick(remain)
    // 越接近结束，间隔调小，减少「跳秒」误差
    const delay = remain < 1000 ? 100 : 250
    setTimeout(loop, delay)
  }
  loop()
}

countdownByTimeout(60000, (ms) => {
  console.log((ms / 1000).toFixed(1) + 's')
}, () => console.log('时间到'))
\`\`\`

### 基于 requestAnimationFrame（与渲染帧同步，后台暂停）

\`\`\`javascript
function countdownByRAF(duration, onTick, onEnd) {
  const endTime = performance.now() + duration
  function loop(now) {
    const remain = endTime - now
    if (remain <= 0) {
      onTick(0)
      onEnd && onEnd()
      return
    }
    onTick(remain)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
\`\`\`

### 两者差异

| 维度 | setTimeout 递归 | requestAnimationFrame |
|------|----------------|----------------------|
| 后台标签页 | 继续计时 | 暂停计时 |
| 精度 | 依赖时间戳，误差小 | 随帧，丝滑 |
| 适合 | 真实倒计时（考试、抢购） | 页面 UI 展示倒计时 |

> 关键：**用 \`Date.now()\` / \`performance.now()\` 算剩余时间，而不是靠计数器递减**——这样即使两次回调间隔不准，显示依然准确。`
  },
  {
    id: 'js-044',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['SKU', '电商', '算法', '业务题', '手写代码'],
    question: '实现一个电商 SKU 规格禁用逻辑：已选部分规格后，如何计算哪些未选规格选项应当置灰（不可点击）？',
    answer: `### 思路

给定 SKU 列表（每个 SKU 是一组规格的组合）和**当前已选规格**，对每一个**未选中的规格维度**的选项，模拟把它加入已选集合，看是否能匹配到某个存在的 SKU；匹配不到就禁用。

\`\`\`javascript
// skus: 所有可选商品，每个是规格值映射，如 { 颜色: '黑色', 容量: '256G' }
// selected: 已选规格，如 { 颜色: '黑色', 容量: undefined }
function getAvailableOptions(skus, selected, allOptions) {
  const result = {}
  for (const dimension of Object.keys(selected)) {
    if (selected[dimension]) continue           // 已选中的维度跳过
    const options = new Set()
    for (const opt of allOptions[dimension]) {
      const trial = { ...selected, [dimension]: opt }
      if (hasMatch(skus, trial)) options.add(opt) // 选了它之后整体还有货才保留
    }
    result[dimension] = options                  // 不在集合中的就是不可选
  }
  return result
}

// trial 是否能匹配某个 SKU（未选维度不参与匹配）
function hasMatch(skus, trial) {
  return skus.some(sku =>
    Object.entries(trial).every(([dim, val]) =>
      val === undefined || sku[dim] === val
    )
  )
}
\`\`\`

### 关键点
- **未选维度不参与匹配**：只看已选维度能否对应到有效 SKU。
- 用「临时加入 → 校验是否存在」的方式，时间复杂度可接受（SKU 数量通常不大）。
- 实际项目可把 \`allOptions\` 和 \`skus\` 预处理成映射表提升性能。

> 这是经典电商面试题，核心是「**穷举 + 反向校验**」：不是单纯判断单个选项，而是判断「选了它之后整体还有没有货」。`
  },
  {
    id: 'js-045',
    category: 'javascript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['动画', 'requestAnimationFrame', '缓动', '手写代码', 'Promise'],
    question: '手写一个通用的 animate 动画工具函数：支持多属性插值、动画时长、缓动函数、每帧回调，可被手动中断，并返回 Promise（参考 PDD 前端笔试题）。',
    answer: `### 实现

\`\`\`javascript
function animate({ duration, easing = t => t, onUpdate, onAbort }) {
  let startTime = null
  let aborted = false
  let rafId = null

  const promise = new Promise((resolve) => {
    function step(now) {
      if (aborted) {
        onAbort && onAbort()
        resolve({ done: false, aborted: true })
        return
      }
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1) // 0~1
      const eased = easing(progress)                    // 缓动后进度
      onUpdate && onUpdate(eased, progress)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        resolve({ done: true, aborted: false })
      }
    }
    rafId = requestAnimationFrame(step)
  })

  return {
    finished: promise,
    abort() { aborted = true; cancelAnimationFrame(rafId) },
  }
}
\`\`\`

### 使用示例

\`\`\`javascript
const anim = animate({
  duration: 1000,
  easing: t => 1 - Math.pow(1 - t, 3), // easeOutCubic
  onUpdate: (eased) => {
    box.style.opacity = eased
    box.style.transform = 'translateX(' + (eased * 200) + 'px)'
  },
})

setTimeout(() => anim.abort(), 500) // 中途中断
await anim.finished
console.log('动画结束或被中断')
\`\`\`

### 考察点
- **时间戳驱动**：用 \`now - startTime\` 算进度，避免依赖固定帧间隔，切后台也不会错乱。
- **缓动函数**：把线性进度 \`t\` 映射成非线性，实现加速 / 减速。
- **可中断**：用 \`cancelAnimationFrame\` + 标志位，防止动画重复执行和内存泄漏。
- **返回 Promise**：调用方可用 \`await\` 等待结束或中断。`
  },
]
