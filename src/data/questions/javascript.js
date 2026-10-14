export const javascriptQuestions = [
  {
    "id": "js-001",
    "category": "javascript",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "数据类型",
      "类型判断"
    ],
    "question": "JavaScript 有哪些数据类型？如何判断一个变量的类型？",
    "answer": "JavaScript 共有 **8 种数据类型**，分为两大类：\n\n### 原始类型（7种）\n- `number` — 数字\n- `string` — 字符串\n- `boolean` — 布尔值\n- `undefined` — 未定义\n- `null` — 空值\n- `symbol` — 唯一值（ES6）\n- `bigint` — 大整数（ES2020）\n\n### 引用类型（1种）\n- `object` — 对象（包括 Array、Function、Date、RegExp 等）\n\n### 类型判断方法\n\n| 方法 | 说明 | 缺点 |\n|------|------|------|\n| `typeof` | 判断原始类型 | `typeof null === 'object'`，无法区分数组/对象 |\n| `instanceof` | 判断引用类型 | 不能跨 iframe，不能判断原始类型 |\n| `Object.prototype.toString.call()` | 最准确 | 写法繁琐 |\n| `Array.isArray()` | 判断数组 | 仅用于数组 |\n\n```javascript\ntypeof 'hello'        // 'string'\ntypeof 123            // 'number'\ntypeof null           // 'object'  ⚠️ 历史遗留 bug\ntypeof []             // 'object'\ntypeof function(){}   // 'function'\n\n[] instanceof Array   // true\nObject.prototype.toString.call(null)       // '[object Null]'\nObject.prototype.toString.call([1,2])      // '[object Array]'\nObject.prototype.toString.call(new Date()) // '[object Date]'\n```\n\n> **面试技巧**：万能类型判断封装：`Object.prototype.toString.call(val).slice(8, -1)`"
  },
  {
    "id": "js-002",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "类型转换",
      "隐式转换"
    ],
    "question": "说说 == 和 === 的区别，以及隐式类型转换规则",
    "answer": "`==`（宽松相等）在比较前会对操作数执行**隐式类型转换（Abstract Equality Comparison）**，而 `===`（严格相等）要求**类型相同且值相等**，不进行任何隐式类型转换。\n\n### 一、 宽松相等 vs 严格相等 vs Object.is 对比表\n\n| 表达式 | `==` 结果 | `===` 结果 | `Object.is` 结果 | 规范机制说明 |\n| :--- | :--- | :--- | :--- | :--- |\n| `1 == \"1\"` | `true` | `false` | `false` | 字符串 `\"1\"` 通过 `ToNumber` 转为数字 `1` |\n| `0 == false` | `true` | `false` | `false` | 布尔值优先通过 `ToNumber(false)` 转为 `0` |\n| `null == undefined` | `true` | `false` | `false` | ECMA-262 规范硬编码互通特例，与其他值均不相等 |\n| `NaN == NaN` | `false` | `false` | **`true`** | IEEE 754 规定 `NaN` 不等于自身，`Object.is` 修正了该直觉差异 |\n| `+0 == -0` | `true` | `true` | **`false`** | `Object.is(+0, -0)` 可精确区分正负零符号位 |\n| `[] == ![]` | `true` | `false` | `false` | 右侧 `![]` 先求值为 `false`，随后两侧皆转为 `0 === 0` |\n\n### 二、 经典隐式转换推导与工程判空规范\n\n```javascript\n// 1. 为什么 [] == ![] 返回 true？四步拆解：\n// 第一步：逻辑非 ! 优先级高于 ==，[] 为真值，故 ![] -> false\n// 第二步：[] == false 触发布尔转数字规则 -> [] == 0\n// 第三步：[] 调用 ToPrimitive ([].toString()) -> \"\" == 0\n// 第四步：Number(\"\") -> 0 === 0 -> true\nconsole.log([] == ![]) // true\n\n// 2. 手写 Object.is Polyfill（深入理解 === 与 Object.is 的两处差异）\nfunction myObjectIs(x, y) {\n  if (x === y) {\n    // 处理 +0 !== -0：利用 1 / +0 === Infinity 而 1 / -0 === -Infinity\n    return x !== 0 || 1 / x === 1 / y\n  }\n  // 处理 NaN === NaN：只有 NaN 满足自身不等于自身\n  return x !== x && y !== y\n}\nconsole.log(myObjectIs(NaN, NaN), myObjectIs(+0, -0)) // true, false\n```\n\n在现代工程中，应启用 ESLint `eqeqeq: [\"error\", \"always\", { \"null\": \"ignore\" }]`，除 `val == null` 同时判空 `null | undefined` 外，一律使用 `===`；在 React Hooks 依赖比对（`areHookInputsEqual`）中则使用 `Object.is`。"
  },
  {
    "id": "js-003",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "类型转换",
      "valueOf",
      "toString"
    ],
    "question": "对象转原始类型的过程是怎样的？",
    "answer": "对象转原始类型会调用内部方法 `ToPrimitive`，过程如下：\n\n### 转换流程\n\n1. 调用 `Symbol.toPrimitive()`（如果存在）\n2. 否则根据上下文调用 `valueOf()` 和 `toString()`：\n   - **数字上下文**（如 `-a`, `a - 1`）：先 `valueOf()`，再 `toString()`\n   - **字符串上下文**（如 `String(a)`, `a + ''`）：先 `toString()`，再 `valueOf()`\n\n### Symbol.toPrimitive 优先级最高\n\n```javascript\nlet obj = {\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return 10\n    if (hint === 'string') return 'hello'\n    return 'default'\n  }\n}\n+obj        // 10       (hint = 'number')\n`${obj}`  // 'hello'  (hint = 'string')\nobj + ''    // 'default'(hint = 'default')\n```\n\n### 默认行为\n\n```javascript\nlet arr = [1, 2, 3]\narr.toString()  // '1,2,3'\narr.valueOf()   // [1, 2, 3]（返回自身）\n\narr + ''        // '1,2,3'（字符串上下文，调 toString）\narr - 1         // NaN（数字上下文，valueOf 返回数组 → toString → '1,2,3' → 1,2,3 → NaN）\n```\n\n> `+[]` 结果是 `0`：`[]` → `toString()` → `''` → `Number('')` → `0`"
  },
  {
    "id": "js-004",
    "category": "javascript",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "数据类型",
      "堆栈"
    ],
    "question": "原始类型和引用类型在内存中的区别是什么？",
    "answer": "JavaScript 数据类型分为 **7 种原始类型（`number`、`string`、`boolean`、`null`、`undefined`、`symbol`、`bigint`）** 与 **引用类型（`Object` 及其子类型 `Array`、`Function`、`Map`、`Set`、`Date` 等）**，二者在内存分配、可变性与参数传递上存在本质差异。\n\n### 一、 原始类型与引用类型核心机制对比\n\n| 维度 | 原始类型（Primitive Values） | 引用类型（Object References） |\n| :--- | :--- | :--- |\n| **值可变性** | **不可变（Immutable）**：任何字符串或数字运算都返回新值，原值只读 | **可变（Mutable）**：可直接原地修改对象属性或数组元素 |\n| **逻辑存储位置** | 按值直接存储在执行上下文栈帧槽位（V8 中 31 位小整数 Smi 直接内联，长字符串驻留堆常量池但语义不可变） | 对象本体分配在堆内存（Heap），栈帧变量仅存储指向堆内存的 **8 字节引用指针** |\n| **赋值行为（`b = a`）** | 复制完整的值副本，修改 `b` 与 `a` 毫无关联 | 仅复制引用地址指针，`a` 和 `b` 共享同一个堆对象 |\n| **函数参数传递** | 按值传递（Pass by Value） | **按共享传递（Call by Sharing）**：传递引用地址的拷贝 |\n\n### 二、 代码验证：为什么修改形参属性生效、但重新赋值形参不影响外部？\n\n```javascript\nfunction updateProfile(person) {\n  // 1. 顺着共享指针修改堆内存对象的属性 -> 外部实参同步可见\n  person.age = 30\n\n  // 2. 将形参局部变量 person 指向一个全新的堆对象地址 -> 外部实参仍指向原地址！\n  person = { name: 'Bob', age: 99 }\n}\n\nconst user = { name: 'Alice', age: 25 }\nupdateProfile(user)\nconsole.log(user) // { name: 'Alice', age: 30 }\n\n// 3. 现代深拷贝标准方案：使用原生 structuredClone 彻底断开深层引用共享（支持循环引用与 Map/Set/Date）\nconst deepCopy = structuredClone(user)\ndeepCopy.age = 18\nconsole.log(user.age, deepCopy.age) // 30, 18\n```"
  },
  {
    "id": "js-005",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "类型转换",
      "运算符"
    ],
    "question": "解释以下表达式的结果：[] + {}、{} + []、true + true + \"1\"",
    "answer": "`[] + {}`、`{} + []` 与 `true + true + \"1\"` 集中考察了 **`ToPrimitive` 对象转原始值规则**、**二元 `+` 运算符重载机制** 以及 **JS 语法解析器对行首 `{` 的空代码块歧义消解**。\n\n### 一、 表达式求值对比与底层解析表\n\n| 表达式 | 求值上下文 | 左操作数转换 | 右操作数转换 | 最终结果与核心原因 |\n| :--- | :--- | :--- | :--- | :--- |\n| `[] + {}` | 任意上下文 | `[].toString() -> \"\"` | `{}.toString() -> \"[object Object]\"` | **`\"[object Object]\"`**（任一侧为字符串即触发字符串拼接） |\n| `({} + [])` | 表达式上下文（如 `console.log({} + [])`） | `\"[object Object]\"` | `\"\"` | **`\"[object Object]\"`**（圆括号强制将 `{}` 解析为对象字面量） |\n| `{}; + []`（裸语句 `{} + []`） | 独立语句行首 | 行首 `{}` 被解析为空代码块忽略 | 一元正号 `+[] -> Number(\"\")` | **`0`**（等价于执行了一元数值转换 `+[]`） |\n| `true + true + \"1\"` | 任意上下文 | `1 + 1 = 2`（先算左侧数值相加） | `2 + \"1\"`（再触发字符串拼接） | **`\"21\"`**（左结合运算） |\n\n### 二、 `Symbol.toPrimitive` 接管对象转换规则代码实战\n\n```javascript\n// 对象转原始值的默认查找链：obj[Symbol.toPrimitive](hint) -> obj.valueOf() -> obj.toString()\nconst metric = {\n  value: 1024,\n  unit: 'MB',\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return this.value\n    if (hint === 'string') return `${this.value}${this.unit}`\n    return this.value // default（如 + 或 == 运算）\n  }\n}\n\nconsole.log(Number(metric)) // 1024 (hint: \"number\")\nconsole.log(`${metric}`)    // \"1024MB\" (hint: \"string\")\nconsole.log(metric + 512)   // 1536 (hint: \"default\")\n```"
  },
  {
    "id": "js-006",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "闭包",
      "作用域",
      "应用场景"
    ],
    "question": "什么是闭包？请举例说明其应用场景和潜在问题",
    "answer": "**闭包**是指一个函数能够访问其外部函数作用域中的变量，即使外部函数已经执行完毕。\n\n### 形成条件\n1. 函数嵌套\n2. 内部函数引用外部函数的变量\n3. 内部函数被返回或传递到外部\n\n### 经典示例\n\n```javascript\nfunction createCounter() {\n  let count = 0  // 外部变量\n  return {\n    increment() { return ++count },\n    decrement() { return --count },\n    getCount() { return count }\n  }\n}\nconst counter = createCounter()\ncounter.increment()  // 1\ncounter.increment()  // 2\ncounter.getCount()   // 2\n```\n\n### 应用场景\n\n1. **数据私有化**（模块模式）\n2. **函数柯里化**\n3. **防抖/节流**\n4. **缓存（记忆化函数）**\n\n```javascript\n// 记忆化函数\nfunction memoize(fn) {\n  const cache = {}\n  return function (...args) {\n    const key = JSON.stringify(args)\n    if (key in cache) return cache[key]\n    return cache[key] = fn.apply(this, args)\n  }\n}\n```\n\n### 潜在问题\n\n1. **内存泄漏**：闭包引用的变量不会被 GC 回收\n2. **变量共享**：循环中的闭包共享同一变量\n\n```javascript\n// 经典问题：循环中的闭包\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)  // 3, 3, 3\n}\n// 解决方案 1：let\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)  // 0, 1, 2\n}\n// 解决方案 2：IIFE\nfor (var i = 0; i < 3; i++) {\n  ((j) => setTimeout(() => console.log(j), 0))(i)\n}\n```"
  },
  {
    "id": "js-007",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "作用域",
      "变量提升",
      "let",
      "const"
    ],
    "question": "var、let、const 有什么区别？什么是变量提升和暂时性死区？",
    "answer": "### var vs let vs const\n\n| 特性 | var | let | const |\n|------|-----|-----|-------|\n| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |\n| 变量提升 | ✅ 提升且初始化为 undefined | ✅ 提升但不初始化 | ✅ 提升但不初始化 |\n| 重复声明 | 允许 | 不允许 | 不允许 |\n| 重新赋值 | 允许 | 允许 | 不允许 |\n| 挂载到 window | ✅ | ❌ | ❌ |\n\n### 变量提升（Hoisting）\n\n```javascript\nconsole.log(a)  // undefined（已提升，已初始化）\nvar a = 1\n\nconsole.log(b)  // ReferenceError（已提升，但未初始化）\nlet b = 2\n```\n\n`var` 声明会在编译阶段被提升到作用域顶部并初始化为 `undefined`。\n\n### 暂时性死区（TDZ）\n\n`let` / `const` 声明的变量虽然也会提升，但在**到达声明语句之前**处于暂时性死区，访问会抛出 `ReferenceError`。\n\n```javascript\n{\n  // TDZ 开始\n  console.log(x)  // ReferenceError\n  let x = 10       // TDZ 结束\n}\n```\n\n`const` 必须在声明时初始化：\n```javascript\nconst a          // SyntaxError\nconst b = 1      // ✅\nb = 2            // TypeError\n```\n\n> **注意**：`const` 不可重新赋值，但对象/数组的**内容**可以修改：\n> ```javascript\n> const arr = [1, 2]\n> arr.push(3)     // ✅ 允许修改内容\n> arr = [4, 5]    // ❌ 不可重新赋值\n> ```\n\n### 最佳实践\n- 默认用 `const`，需要重新赋值时用 `let`，不再使用 `var`"
  },
  {
    "id": "js-008",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "闭包",
      "内存泄漏",
      "垃圾回收"
    ],
    "question": "闭包会导致内存泄漏吗？如何避免？",
    "answer": "闭包**本身不是**内存泄漏，它只是让变量的生命周期延长到与闭包一致。但如果闭包长期存在且不再需要引用的变量，就会造成**实际的内存泄漏**。\n\n### 什么情况下闭包会导致内存泄漏\n\n```javascript\n// 1. 意外引用：闭包引用了大对象但不使用\nfunction createHandler() {\n  const hugeData = new Array(1000000).fill('*')\n  return function () {\n    console.log('handler')  // 没用到 hugeData，但它被闭包引用了\n  }\n}\nconst handler = createHandler()  // hugeData 无法被回收\n\n// 2. 定时器未清除\nfunction startTimer() {\n  const data = getData()\n  setInterval(() => {\n    console.log(data)  // data 一直被引用\n  }, 1000)\n}\n\n// 3. DOM 事件监听未移除\nfunction bindEvent() {\n  const element = document.getElementById('btn')\n  const heavyData = { /* ... */ }\n  element.addEventListener('click', () => {\n    console.log(heavyData)\n  })\n  // 如果 element 被移除但监听器未移除 → 泄漏\n}\n```\n\n### 如何避免\n\n1. **及时清除引用**：用完后将变量设为 `null`\n2. **清除定时器**：`clearInterval()` / `clearTimeout()`\n3. **移除事件监听**：`removeEventListener()`\n4. **使用 WeakMap / WeakSet**：不阻止 GC 回收\n\n```javascript\n// WeakMap 解决方案\nconst cache = new WeakMap()\nfunction process(obj) {\n  if (!cache.has(obj)) {\n    cache.set(obj, expensiveCompute(obj))\n  }\n  return cache.get(obj)\n}\n// 当 obj 被回收，cache 中的条目也会被自动清除\n```\n\n### 现代浏览器\n现代 V8 引擎已经能优化未使用的闭包变量，但在以下场景仍需注意：\n- 长生命周期的 SPA 应用\n- 频繁创建闭包的循环/递归\n- 旧版浏览器（IE）的 DOM 循环引用"
  },
  {
    "id": "js-009",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "作用域",
      "执行上下文"
    ],
    "question": "解释 JavaScript 的作用域链是如何工作的",
    "answer": "**作用域链**是 JavaScript 在查找变量时，从内到外依次查找的作用域链表。\n\n### 执行上下文与作用域\n\n每个函数在创建时会保存一个 **[[Environment]]** 内部属性，指向定义时的词法环境。函数调用时创建执行上下文，其作用域链 = **函数自身作用域 → 外层作用域 → ... → 全局作用域**。\n\n```javascript\nconst globalVar = 'global'\n\nfunction outer() {\n  const outerVar = 'outer'\n\n  function inner() {\n    const innerVar = 'inner'\n    // 作用域链：inner → outer → global\n    console.log(innerVar)   // 'inner'  （自身）\n    console.log(outerVar)   // 'outer'  （外层）\n    console.log(globalVar)  // 'global' （全局）\n  }\n\n  inner()\n}\n```\n\n### 词法作用域（静态作用域）\n\nJavaScript 采用**词法作用域**：函数的作用域在**定义时**确定，而非调用时。\n\n```javascript\nconst value = 'outer'\n\nfunction foo() {\n  console.log(value)  // 'outer'（定义时决定）\n}\n\nfunction bar() {\n  const value = 'inner'\n  foo()  // foo 依然访问外层的 'outer'\n}\nbar()  // 输出 'outer'\n```\n\n### 作用域链查找过程\n\n1. 在当前作用域查找变量\n2. 找不到 → 沿作用域链向上查找\n3. 找到则使用，未找到则 `ReferenceError`\n\n### 欺骗词法作用域（不推荐）\n\n- `eval()`：动态执行代码，可修改作用域\n- `with`：创建临时作用域（严格模式禁用）\n\n> **面试要点**：作用域链在函数**定义时**确定（词法作用域），`this` 在函数**调用时**确定（动态绑定）。"
  },
  {
    "id": "js-010",
    "category": "javascript",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "IIFE",
      "模块化",
      "作用域"
    ],
    "question": "什么是 IIFE（立即执行函数）？有什么用途？",
    "answer": "**IIFE（Immediately Invoked Function Expression，立即调用函数表达式）** 是指在定义函数表达式的同时立即执行它的 JavaScript 编码范式。\n\n### 一、 语法原理与前置分号防御规范\n\nJavaScript 语法规定以 `function` 关键字开头的独立语句会被解析为**函数声明（Function Declaration）**，不能直接跟 `()` 调用；用圆括号 `(function(){ ... })()` 包裹后，外层 `()` 将其切换为**表达式上下文（Expression Context）**，从而允许立即执行。\n\n```javascript\n// 1. 工业界标准写法：开头加防御性分号 ; 防止上一行漏写分号导致函数连调报错\n;(function (global) {\n  const privateToken = 'sec_9981'\n  global.AppSDK = {\n    getVersion: () => '1.0.0'\n  }\n})(globalThis)\n\n// 2. 经典用途：为异步回调锁定每次循环的独立词法快照（等价于现代 let 块级绑定）\nconst tasks = []\nfor (var i = 0; i < 3; i++) {\n  ;(function (lockedIndex) {\n    tasks.push(() => lockedIndex)\n  })(i)\n}\nconsole.log(tasks.map((fn) => fn())) // [0, 1, 2]\n```\n\n### 二、 IIFE 在现代前端工程中的四大角色\n\n| 应用场景 | 核心作用说明 |\n| :--- | :--- |\n| **1. 打包器产物隔离壳** | Webpack / Rollup / Vite 生产构建生成的 IIFE / UMD 格式产物，利用顶层 IIFE 隔离模块表，避免污染宿主页面的 `window` |\n| **2. 异步初始化入口** | 在不支持 Top-level `await` 的脚本环境中，使用 `;(async () => { await init() })()` 启动异步逻辑 |\n| **3. 单例与揭示模块模式** | 利用 IIFE 闭包创建全局唯一实例并隐藏私有状态（如小岛架构中的 `window.STUDY = (function(){ ... })()`） |\n| **4. 复杂状态一次性计算** | 在 JSX 或配置对象内部使用 `(() => { switch(...) })()` 替代多层嵌套三元表达式 |"
  },
  {
    "id": "js-011",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "原型链",
      "prototype",
      "继承"
    ],
    "question": "请描述 JavaScript 的原型链",
    "answer": "**原型链**是 JavaScript 实现继承的机制。每个对象都有一个 `__proto__`（即 [[Prototype]]）指向其构造函数的 `prototype` 对象。\n\n### 原型链结构\n\n```text\n实例对象\n  └─ __proto__ → 构造函数.prototype\n                   ├─ constructor → 构造函数本身\n                   └─ __proto__ → 父构造函数.prototype\n                                   └─ ... → Object.prototype\n                                              └─ __proto__ → null\n```\n\n### 具体示例\n\n```javascript\nfunction Person(name) {\n  this.name = name\n}\nPerson.prototype.sayHi = function () {\n  console.log('Hi, ' + this.name)\n}\n\nconst p = new Person('Tom')\n\np.sayHi()              // 'Hi, Tom'（通过原型链找到）\np.__proto__            // Person.prototype\np.__proto__.__proto__  // Object.prototype\np.__proto__.__proto__.__proto__  // null（原型链终点）\n```\n\n### 属性查找过程\n\n访问 `p.toString()` 时：\n1. 查找 `p` 自身 → 没有 `toString`\n2. 查找 `p.__proto__`（Person.prototype）→ 没有\n3. 查找 `p.__proto__.__proto__`（Object.prototype）→ 找到 `toString`\n\n### 常见判断方法\n\n```javascript\np.constructor === Person              // true\nPerson.prototype.isPrototypeOf(p)     // true\nObject.getPrototypeOf(p) === Person.prototype  // true\nObject.prototype.toString.call(p)     // '[object Object]'\n```\n\n### 注意事项\n- `__proto__` 是非标准属性，生产环境应使用 `Object.getPrototypeOf()` / `Object.setPrototypeOf()`\n- 修改原型链（`Object.setPrototypeOf`）性能差，应在创建时通过 `Object.create()` 设置"
  },
  {
    "id": "js-012",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "new",
      "构造函数",
      "实例化"
    ],
    "question": "new 操作符做了哪些事情？如何手写一个 new？",
    "answer": "### new 做了 4 件事\n\n1. **创建一个新的空对象**\n2. **将新对象的 `__proto__` 指向构造函数的 `prototype`**\n3. **将构造函数的 `this` 绑定到新对象并执行**\n4. **如果构造函数返回对象，则返回该对象；否则返回新对象**\n\n### 手写 new\n\n```javascript\nfunction myNew(Constructor, ...args) {\n  // 1. 创建新对象，原型指向构造函数的 prototype\n  const obj = Object.create(Constructor.prototype)\n\n  // 2. 执行构造函数，绑定 this\n  const result = Constructor.apply(obj, args)\n\n  // 3. 如果返回值是对象则使用该对象，否则返回新创建的对象\n  return result instanceof Object ? result : obj\n}\n\n// 测试\nfunction Person(name, age) {\n  this.name = name\n  this.age = age\n}\nPerson.prototype.sayHi = function () {\n  console.log('Hi, ' + this.name)\n}\n\nconst p = myNew(Person, 'Tom', 25)\np.sayHi()  // 'Hi, Tom'\n```\n\n### 构造函数返回值的影响\n\n```javascript\nfunction Foo() {\n  this.name = 'foo'\n  return { name: 'bar' }  // 返回对象 → 使用该对象\n}\nnew Foo().name  // 'bar'\n\nfunction Bar() {\n  this.name = 'bar'\n  return 'string'  // 返回原始值 → 忽略，使用 this\n}\nnew Bar().name  // 'bar'\n```"
  },
  {
    "id": "js-013",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "继承",
      "原型链",
      "ES6"
    ],
    "question": "JavaScript 有哪些继承方式？各有什么优缺点？",
    "answer": "### 1. 原型链继承\n\n```javascript\nfunction Parent() { this.colors = ['red'] }\nParent.prototype.sayHi = function () {}\n\nfunction Child() {}\nChild.prototype = new Parent()\n```\n- ✅ 简单，能继承原型方法\n- ❌ 引用类型属性被所有实例共享，无法传参\n\n### 2. 构造函数继承（call/apply）\n\n```javascript\nfunction Parent(name) { this.name = name; this.colors = ['red'] }\nfunction Child(name) { Parent.call(this, name) }\n```\n- ✅ 解决引用类型共享问题，可传参\n- ❌ 无法继承原型上的方法\n\n### 3. 组合继承（最常用）\n\n```javascript\nfunction Parent(name) { this.name = name; this.colors = ['red'] }\nParent.prototype.sayHi = function () {}\n\nfunction Child(name, age) {\n  Parent.call(this, name)   // 第二次调用 Parent\n  this.age = age\n}\nChild.prototype = new Parent()  // 第一次调用 Parent\nChild.prototype.constructor = Child\n```\n- ✅ 结合两者优点\n- ❌ Parent 被调用了两次\n\n### 4. 寄生组合继承（最优方案）\n\n```javascript\nfunction inherit(Child, Parent) {\n  Child.prototype = Object.create(Parent.prototype)\n  Child.prototype.constructor = Child\n}\n\nfunction Parent(name) { this.name = name }\nParent.prototype.sayHi = function () {}\n\nfunction Child(name, age) {\n  Parent.call(this, name)\n  this.age = age\n}\ninherit(Child, Parent)\n```\n- ✅ 只调用一次 Parent，原型链正确\n- ✅ 最理想的继承方案\n\n### 5. ES6 class 继承\n\n```javascript\nclass Parent {\n  constructor(name) { this.name = name }\n  sayHi() { console.log(this.name) }\n}\n\nclass Child extends Parent {\n  constructor(name, age) {\n    super(name)\n    this.age = age\n  }\n}\n```\n- ✅ 语法简洁，本质是寄生组合继承的语法糖\n- ✅ 推荐使用"
  },
  {
    "id": "js-014",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "class",
      "ES6",
      "继承"
    ],
    "question": "ES6 class 与 ES5 构造函数有什么区别？",
    "answer": "`class` 是构造函数的语法糖，但有一些关键区别：\n\n### 主要区别\n\n| 特性 | ES5 构造函数 | ES6 class |\n|------|-------------|-----------|\n| 声明提升 | ✅ 有提升 | ❌ 无提升（TDZ） |\n| 不加 new 调用 | 作为普通函数执行 | 报错 |\n| 原型方法可枚举 | ✅ 可枚举 | ❌ 不可枚举 |\n| 静态方法 | `Foo.staticMethod = fn` | `static method()` |\n| 私有字段 | 闭包模拟 | `#field` 语法 |\n| 多继承 | 不支持 | 不支持（但可用 mixin） |\n\n### 代码对比\n\n```javascript\n// ES5\nfunction Person(name) {\n  this.name = name\n}\nPerson.prototype.sayHi = function () {}\nPerson.create = function () { return new Person('default') }\n\n// ES6\nclass Person {\n  #age = 0  // 私有字段\n\n  constructor(name) {\n    this.name = name\n  }\n\n  sayHi() {}  // 不可枚举\n\n  static create() {\n    return new Person('default')\n  }\n\n  get age() { return this.#age }\n}\n```\n\n### class 的特殊行为\n- `class` 声明存在**暂时性死区**，不能在声明前使用\n- `class` 内部默认使用严格模式\n- `class` 的方法定义在 `prototype` 上，且 `enumerable: false`"
  },
  {
    "id": "js-015",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "Object.create",
      "原型",
      "继承"
    ],
    "question": "Object.create(null) 和 {} 有什么区别？什么时候用 Object.create(null)？",
    "answer": "### 核心区别\n\n```javascript\nconst obj1 = {}\nconst obj2 = Object.create(null)\n\nobj1.__proto__            // Object.prototype\nobj2.__proto__            // undefined\nObject.getPrototypeOf(obj2)  // null\n```\n\n- `{}`：原型指向 `Object.prototype`，继承了 `toString`、`hasOwnProperty` 等方法\n- `Object.create(null)`：原型为 `null`，是一个**纯净对象**，没有任何原型方法\n\n### 使用场景\n\n1. **字典/Map**：避免原型链上的属性干扰\n\n```javascript\n// 问题：原型属性干扰\nconst dict = {}\ndict.constructor  // ƒ Object() {...]（原型链上的属性）\n\n// 解决：纯净对象\nconst pureDict = Object.create(null)\npureDict.constructor  // undefined\npureDict.hasOwnProperty  // undefined\n```\n\n2. **防止原型污染**\n\n```javascript\n// 作为缓存对象时，避免 __proto__ 等特殊属性名冲突\nconst cache = Object.create(null)\ncache['__proto__'] = 'value'  // 安全，不会污染原型链\n```\n\n3. **Vue 源码中的使用**：Vue 内部大量使用 `Object.create(null)` 创建无原型的对象作为缓存映射表，性能更好。\n\n### 注意事项\n- `Object.create(null)` 创建的对象没有 `toString`，某些操作会出错：\n```javascript\nconst obj = Object.create(null)\nobj + ''           // TypeError: Cannot convert object to primitive value\n`${obj}`          // TypeError\nJSON.stringify(obj) // '{}'  ✅ 正常\n```"
  },
  {
    "id": "js-016",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "this",
      "绑定规则"
    ],
    "question": "JavaScript 中 this 的指向规则是什么？",
    "answer": "`this` 的指向取决于**函数的调用方式**，有 4 种绑定规则：\n\n### 1. 默认绑定（独立调用）\n\n```javascript\nfunction foo() { console.log(this) }\nfoo()  // 非严格模式：window；严格模式：undefined\n```\n\n### 2. 隐式绑定（作为对象方法）\n\n```javascript\nconst obj = {\n  name: 'Tom',\n  sayHi() { console.log(this.name) }\n}\nobj.sayHi()  // 'Tom'（this → obj）\n\n// 隐式丢失\nconst fn = obj.sayHi\nfn()  // undefined（this → window/undefined）\n```\n\n### 3. 显式绑定（call/apply/bind）\n\n```javascript\nfunction greet(greeting) {\n  console.log(greeting + ', ' + this.name)\n}\nconst person = { name: 'Tom' }\n\ngreet.call(person, 'Hi')     // 'Hi, Tom'\ngreet.apply(person, ['Hi'])  // 'Hi, Tom'\nconst bound = greet.bind(person, 'Hi')\nbound()  // 'Hi, Tom'\n```\n\n### 4. new 绑定\n\n```javascript\nfunction Person(name) {\n  this.name = name  // this → 新创建的对象\n}\nnew Person('Tom')\n```\n\n### 优先级\n\n`new` > 显式绑定 > 隐式绑定 > 默认绑定\n\n### 箭头函数（特殊）\n\n箭头函数**没有自己的 this**，继承外层作用域的 `this`，且不可被 `call/apply/bind` 修改：\n\n```javascript\nconst obj = {\n  name: 'Tom',\n  arrow: () => console.log(this.name),\n  normal() { console.log(this.name) }\n}\nobj.arrow()   // undefined 或 '' （this → 外层 window）\nobj.normal()  // 'Tom'\n```"
  },
  {
    "id": "js-017",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "call",
      "apply",
      "bind"
    ],
    "question": "call、apply、bind 的区别？如何手写实现？",
    "answer": "### 三者对比\n\n| 方法 | 参数 | 执行时机 | 返回值 |\n|------|------|----------|--------|\n| `call` | `(thisArg, arg1, arg2, ...)` | 立即执行 | 函数返回值 |\n| `apply` | `(thisArg, [argsArray])` | 立即执行 | 函数返回值 |\n| `bind` | `(thisArg, arg1, ...)` | 返回新函数 | 新函数 |\n\n### 手写 call\n\n```javascript\nFunction.prototype.myCall = function (ctx, ...args) {\n  ctx = ctx == null ? globalThis : Object(ctx)\n  const key = Symbol('fn')\n  ctx[key] = this\n  const result = ctx[key](...args)\n  delete ctx[key]\n  return result\n}\n```\n\n### 手写 apply\n\n```javascript\nFunction.prototype.myApply = function (ctx, args = []) {\n  ctx = ctx == null ? globalThis : Object(ctx)\n  const key = Symbol('fn')\n  ctx[key] = this\n  const result = ctx[key](...args)\n  delete ctx[key]\n  return result\n}\n```\n\n### 手写 bind\n\n```javascript\nFunction.prototype.myBind = function (ctx, ...outerArgs) {\n  const fn = this\n  return function (...innerArgs) {\n    // 支持 new 调用\n    if (new.target) {\n      return new fn(...outerArgs, ...innerArgs)\n    }\n    return fn.apply(ctx, [...outerArgs, ...innerArgs])\n  }\n}\n```\n\n### 核心原理\n利用 `对象.方法()` 的隐式绑定规则，将函数作为对象的属性临时调用，使 `this` 指向该对象。用 `Symbol` 避免属性名冲突。"
  },
  {
    "id": "js-018",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "this",
      "箭头函数"
    ],
    "question": "箭头函数和普通函数有哪些区别？",
    "answer": "### 核心区别\n\n| 特性 | 普通函数 | 箭头函数 |\n|------|----------|----------|\n| `this` | 动态绑定，由调用方式决定 | **词法 this**，继承外层作用域 |\n| `arguments` | 有自己的 `arguments` | 没有，用 `...args` 代替 |\n| `new` | 可作为构造函数 | ❌ 不能用 `new` |\n| `prototype` | 有 | ❌ 没有 |\n| `super` | ❌ | ✅ 可访问外层的 `super` |\n| `yield` | 可用作 generator | ❌ 不能 |\n| 严格模式 | 需声明 `'use strict'` | 内部默认严格模式 |\n\n### this 的差异\n\n```javascript\nconst obj = {\n  count: 0,\n  // 普通函数：this → obj\n  normalIncrement() {\n    setInterval(function () {\n      this.count++  // ❌ this → window\n    }, 1000)\n  },\n  // 箭头函数：this → obj（继承外层）\n  arrowIncrement() {\n    setInterval(() => {\n      this.count++  // ✅ this → obj\n    }, 1000)\n  }\n}\n```\n\n### 不能使用箭头函数的场景\n\n1. **对象方法**（需要动态 this）\n2. **原型方法**\n3. **构造函数**\n4. **事件监听器**（需要 `this` 指向 DOM 元素）\n5. **Vue 选项式 API 的 methods**\n\n```javascript\n// ❌ 不适合\nconst obj = {\n  name: 'Tom',\n  sayHi: () => console.log(this.name)  // this → window\n}\n\n// ✅ 适合\nconst obj = {\n  name: 'Tom',\n  sayHi() { console.log(this.name) }\n}\n```"
  },
  {
    "id": "js-019",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "this",
      "执行上下文"
    ],
    "question": "this 指向与 call 绑定输出分析：对象方法、返回函数与箭头函数组合调用",
    "answer": "本题综合考察 JavaScript 中**隐式绑定、显式绑定（`call`）、默认绑定（独立函数调用）以及箭头函数词法 `this` 捕获**的优先级关系。\n\n### 一、 题目代码\n\n```javascript\nvar name = 'window'\nvar obj = {\n  name: 'obj',\n  fn1: function () { console.log(this.name) },\n  fn2: () => console.log(this.name),\n  fn3: function () {\n    return function () { console.log(this.name) }\n  },\n  fn4: function () {\n    return () => console.log(this.name)\n  }\n}\nvar obj2 = { name: 'obj2' }\n\nobj.fn1()\nobj.fn1.call(obj2)\n\nobj.fn2()\nobj.fn2.call(obj2)\n\nobj.fn3()()\nobj.fn3().call(obj2)\nobj.fn3.call(obj2)()\n\nobj.fn4()()\nobj.fn4().call(obj2)\nobj.fn4.call(obj2)()\n```\n\n### 二、 完整输出结果对照表\n\n| 调用语句 | 输出结果 | 触发的绑定规则与核心原因 |\n| :--- | :--- | :--- |\n| `obj.fn1()` | `obj` | 隐式绑定：普通函数作为 `obj` 的方法调用，`this` 指向 `obj` |\n| `obj.fn1.call(obj2)` | `obj2` | 显式绑定：`call(obj2)` 优先级高于隐式绑定，`this` 指向 `obj2` |\n| `obj.fn2()` | `window` | 词法捕获：**对象字面量 `{}` 不构成作用域**，箭头函数 `fn2` 定义在全局作用域，捕获 `window` |\n| `obj.fn2.call(obj2)` | `window` | 箭头函数没有自己的 `this`，`call` / `apply` / `bind` 无法改变其词法绑定的 `window` |\n| `obj.fn3()()` | `window` | 默认绑定：先执行 `obj.fn3()` 返回内部普通函数，第二个 `()` 为无前缀独立调用，指向 `window` |\n| `obj.fn3().call(obj2)` | `obj2` | 显式绑定：对返回的内部普通函数显式调用 `.call(obj2)`，`this` 指向 `obj2` |\n| `obj.fn3.call(obj2)()` | `window` | 默认绑定：外层 `fn3` 的 `this` 虽变为 `obj2`，但内部普通函数仍是独立调用 `()`，不继承外层 `this` |\n| `obj.fn4()()` | `obj` | 词法捕获：外层 `obj.fn4()` 调用时 `this` 为 `obj`，返回的内部箭头函数永久捕获该 `obj` |\n| `obj.fn4().call(obj2)` | `obj` | 内部箭头函数在外层 `obj.fn4()` 执行时已锁死为 `obj`，后续 `.call(obj2)` 无效 |\n| `obj.fn4.call(obj2)()` | `obj2` | 外层 `fn4` 通过 `.call(obj2)` 将 `this` 设为 `obj2`，内部箭头函数创建时捕获到的外层 `this` 即为 `obj2` |\n\n### 三、 核心避坑总结\n\n1. **永远不要用对象字面量的花括号 `{}` 判断箭头函数的 `this`**：只有函数作用域或模块顶层才决定箭头函数的 `this`。\n2. **绑定优先级口诀**：`箭头函数词法锁死 > new 构造调用 > 显式绑定 (call/apply/bind) > 隐式绑定 (obj.fn) > 默认绑定 (window/undefined)`。"
  },
  {
    "id": "js-020",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "this",
      "面试题"
    ],
    "question": "手写一个函数，将任意函数转换为 this 永远绑定的版本",
    "answer": "这是一个增强版 `bind`，确保即使在后续被 `call/apply` 或作为方法调用时，`this` 仍然不变：\n\n```javascript\nfunction hardBind(fn, ctx) {\n  const bound = function (...args) {\n    return fn.apply(ctx, args)\n  }\n  // 让 bound 的原型指向 fn 的原型，支持 new\n  Object.setPrototypeOf(bound, fn)\n  return bound\n}\n\n// 测试\nfunction greet(greeting) {\n  console.log(greeting + ', ' + this.name)\n}\nconst person = { name: 'Tom' }\nconst bound = hardBind(greet, person)\n\nbound('Hi')                    // 'Hi, Tom'\nbound.call({ name: 'Jerry' }, 'Hello')  // 'Hi, Tom'（this 不变）\n```\n\n### 进阶版：支持 new 调用\n\n```javascript\nfunction hardBind(fn, ctx, ...presetArgs) {\n  const bound = function (...args) {\n    // 如果是 new 调用，this 指向新实例，不用 ctx\n    return fn.apply(\n      this instanceof bound ? this : ctx,\n      [...presetArgs, ...args]\n    )\n  }\n  // 维持原型链\n  bound.prototype = Object.create(fn.prototype)\n  return bound\n}\n```\n\n### 实际应用\n- React 早期（class 组件）在 constructor 中 `this.handleClick = this.handleClick.bind(this)` 就是 hardBind 的应用\n- `Function.prototype.bind` 的原生实现就是这种模式"
  },
  {
    "id": "js-021",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "事件循环",
      "宏任务",
      "微任务"
    ],
    "question": "请详细描述 JavaScript 的事件循环（Event Loop）机制",
    "answer": "JavaScript 是**单线程**语言，通过**事件循环**实现异步非阻塞。\n\n### 执行栈与任务队列\n\n1. **执行栈**（Call Stack）：同步代码按顺序入栈执行\n2. **微任务队列**（Microtask Queue）：`Promise.then`、`queueMicrotask`、`MutationObserver`\n3. **宏任务队列**（Macrotask Queue）：`setTimeout`、`setInterval`、`I/O`、`UI rendering`\n\n### 事件循环流程\n\n```text\n1. 执行同步代码（执行栈清空）\n2. 执行所有微任务（清空微任务队列）\n3. 执行一个宏任务\n4. 回到步骤 2\n```\n\n### 经典示例\n\n```javascript\nconsole.log('1')                        // 同步\n\nsetTimeout(() => console.log('2'), 0)   // 宏任务\n\nPromise.resolve().then(() => {\n  console.log('3')                       // 微任务\n}).then(() => {\n  console.log('4')                       // 微任务\n})\n\nconsole.log('5')                        // 同步\n\n// 输出：1 → 5 → 3 → 4 → 2\n```\n\n### 执行过程\n1. 同步代码：`1`、`5` 先输出\n2. 微任务队列：`3`、`4` 输出\n3. 宏任务队列：`2` 输出\n\n### Node.js 中的事件循环\n\nNode.js 有更复杂的阶段模型：\n```text\ntimers → pending callbacks → idle, prepare → poll → check → close callbacks\n```\n- `process.nextTick` 优先级高于所有微任务\n- `setImmediate` 在 check 阶段执行\n\n### 关键点\n- **微任务在每次宏任务后全部执行完**，不是只执行一个\n- `async/await` 本质是 Promise 的语法糖，`await` 后的代码相当于 `.then()`"
  },
  {
    "id": "js-022",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Promise",
      "异步"
    ],
    "question": "Promise 的状态有哪些？常用方法有哪些？",
    "answer": "### 三种状态\n\n- **pending**（等待中）→ 初始状态\n- **fulfilled**（已成功）→ `resolve()` 触发\n- **rejected**（已失败）→ `reject()` 触发\n\n状态一旦改变就**不可逆**：pending → fulfilled 或 pending → rejected\n\n### 实例方法\n\n```javascript\npromise\n  .then((result) => {})    // 成功回调\n  .catch((error) => {})     // 失败回调\n  .finally(() => {})        // 无论成功失败都执行\n```\n\n### 静态方法\n\n| 方法 | 说明 |\n|------|------|\n| `Promise.resolve(value)` | 返回已成功的 Promise |\n| `Promise.reject(reason)` | 返回已失败的 Promise |\n| `Promise.all([...])` | 全部成功才成功，一个失败即失败 |\n| `Promise.allSettled([...])` | 等待全部完成，返回每个结果 |\n| `Promise.race([...])` | 返回第一个完成的（无论成功/失败） |\n| `Promise.any([...])` | 返回第一个成功的 |\n\n```javascript\n// all：全部成功\nPromise.all([fetchA(), fetchB()])\n  .then(([a, b]) => console.log(a, b))\n  .catch(err => console.log('任一失败'))\n\n// allSettled：等待全部完成\nPromise.allSettled([fetchA(), fetchB()])\n  .then(results => {\n    results.forEach(r => {\n      console.log(r.status)  // 'fulfilled' 或 'rejected'\n    })\n  })\n\n// race：第一个完成\nPromise.race([\n  fetch(url),\n  new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))\n])\n\n// any：第一个成功\nPromise.any([fetchA(), fetchB(), fetchC()])\n  .then(first => console.log('第一个成功:', first))\n```\n\n### 链式调用\n\n```javascript\nPromise.resolve(1)\n  .then(v => v + 1)       // 2\n  .then(v => Promise.resolve(v + 1))  // 3（支持返回 Promise）\n  .then(v => console.log(v))  // 3\n```\n\n> **注意**：`.then` 返回的值会被 `Promise.resolve()` 包装，所以可以返回普通值或 Promise。"
  },
  {
    "id": "js-023",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "Promise",
      "手写"
    ],
    "question": "手写一个符合 Promise/A+ 规范的 Promise",
    "answer": "```javascript\nclass MyPromise {\n  constructor(executor) {\n    this.state = 'pending'\n    this.value = undefined\n    this.reason = undefined\n    this.onFulfilledCallbacks = []\n    this.onRejectedCallbacks = []\n\n    const resolve = (value) => {\n      if (this.state !== 'pending') return\n      if (value instanceof MyPromise) {\n        value.then(resolve, reject)\n        return\n      }\n      this.state = 'fulfilled'\n      this.value = value\n      this.onFulfilledCallbacks.forEach(fn => fn())\n    }\n\n    const reject = (reason) => {\n      if (this.state !== 'pending') return\n      this.state = 'rejected'\n      this.reason = reason\n      this.onRejectedCallbacks.forEach(fn => fn())\n    }\n\n    try {\n      executor(resolve, reject)\n    } catch (err) {\n      reject(err)\n    }\n  }\n\n  then(onFulfilled, onRejected) {\n    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v\n    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }\n\n    const promise2 = new MyPromise((resolve, reject) => {\n      const fulfilledTask = () => {\n        queueMicrotask(() => {\n          try {\n            const x = onFulfilled(this.value)\n            this.resolvePromise(promise2, x, resolve, reject)\n          } catch (err) {\n            reject(err)\n          }\n        })\n      }\n\n      const rejectedTask = () => {\n        queueMicrotask(() => {\n          try {\n            const x = onRejected(this.reason)\n            this.resolvePromise(promise2, x, resolve, reject)\n          } catch (err) {\n            reject(err)\n          }\n        })\n      }\n\n      if (this.state === 'fulfilled') fulfilledTask()\n      else if (this.state === 'rejected') rejectedTask()\n      else {\n        this.onFulfilledCallbacks.push(fulfilledTask)\n        this.onRejectedCallbacks.push(rejectedTask)\n      }\n    })\n\n    return promise2\n  }\n\n  resolvePromise(promise2, x, resolve, reject) {\n    if (promise2 === x) {\n      return reject(new TypeError('Chaining cycle'))\n    }\n    if (x instanceof MyPromise) {\n      x.then(resolve, reject)\n    } else if (x !== null && typeof x === 'object' || typeof x === 'function') {\n      let then\n      try {\n        then = x.then\n      } catch (err) {\n        return reject(err)\n      }\n      if (typeof then === 'function') {\n        let called = false\n        try {\n          then.call(\n            x,\n            y => {\n              if (called) return\n              called = true\n              this.resolvePromise(promise2, y, resolve, reject)\n            },\n            r => {\n              if (called) return\n              called = true\n              reject(r)\n            }\n          )\n        } catch (err) {\n          if (called) return\n          reject(err)\n        }\n      } else {\n        resolve(x)\n      }\n    } else {\n      resolve(x)\n    }\n  }\n\n  catch(fn) { return this.then(null, fn) }\n\n  finally(fn) {\n    return this.then(\n      v => MyPromise.resolve(fn()).then(() => v),\n      r => MyPromise.resolve(fn()).then(() => { throw r })\n    )\n  }\n\n  static resolve(value) {\n    if (value instanceof MyPromise) return value\n    return new MyPromise(resolve => resolve(value))\n  }\n\n  static reject(reason) {\n    return new MyPromise((_, reject) => reject(reason))\n  }\n\n  static all(promises) {\n    return new MyPromise((resolve, reject) => {\n      const results = []\n      let count = 0\n      promises.forEach((p, i) => {\n        MyPromise.resolve(p).then(v => {\n          results[i] = v\n          if (++count === promises.length) resolve(results)\n        }, reject)\n      })\n    })\n  }\n\n  static race(promises) {\n    return new MyPromise((resolve, reject) => {\n      promises.forEach(p => MyPromise.resolve(p).then(resolve, reject))\n    })\n  }\n}\n```"
  },
  {
    "id": "js-024",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "async/await",
      "异步"
    ],
    "question": "async/await 的原理是什么？相比 Promise 有什么优势？",
    "answer": "`async/await` 是 Generator + Promise 的**语法糖**，让异步代码看起来像同步代码。\n\n### 原理\n\n`async` 函数返回一个 Promise，`await` 暂停函数执行直到 Promise 完成：\n\n```javascript\n// async/await\nasync function fetchData() {\n  const res = await fetch('/api')     // 暂停，等 Promise resolve\n  const data = await res.json()\n  return data                          // 返回值被 Promise.resolve 包装\n}\n\n// 等价的 Promise 写法\nfunction fetchData() {\n  return fetch('/api')\n    .then(res => res.json())\n    .then(data => data)\n}\n```\n\n### 本质：Generator 自动执行\n\n```javascript\n// Generator 版本\nfunction* fetchDataGen() {\n  const res = yield fetch('/api')\n  const data = yield res.json()\n  return data\n}\n\n// 自动执行器（简化版）\nfunction run(gen) {\n  const it = gen()\n  function step(val) {\n    const { value, done } = it.next(val)\n    if (done) return value\n    return value.then(step)\n  }\n  return step()\n}\nrun(fetchDataGen)\n```\n\n### 优势\n\n1. **可读性好**：代码结构像同步，没有回调嵌套\n2. **错误处理**：可以用 `try/catch` 捕获异步错误\n3. **调试方便**：可以在 `await` 后打断点\n\n```javascript\n// Promise 链式调用\nfunction process() {\n  return fetchA()\n    .then(a => fetchB(a))\n    .then(b => fetchC(b))\n    .catch(err => console.log(err))\n}\n\n// async/await 更清晰\nasync function process() {\n  try {\n    const a = await fetchA()\n    const b = await fetchB(a)\n    const c = await fetchC(b)\n    return c\n  } catch (err) {\n    console.log(err)\n  }\n}\n```\n\n### 注意事项\n- `await` 只能在 `async` 函数内使用（顶层 await 需要 ES2022）\n- `await` 后的代码相当于 `.then()` 的回调，是微任务\n- 并发请求时不要用 `await` 串行，应该用 `Promise.all`：\n```javascript\n// ❌ 串行，慢\nconst a = await fetchA()\nconst b = await fetchB()\n\n// ✅ 并行，快\nconst [a, b] = await Promise.all([fetchA(), fetchB()])\n```"
  },
  {
    "id": "js-025",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "事件循环",
      "面试题",
      "输出题"
    ],
    "question": "事件循环经典输出题：async/await、Promise 与 setTimeout 混合执行顺序分析",
    "answer": "本题考察浏览器事件循环（Event Loop）中**同步调用栈、`async/await` 语法糖拆解、微任务队列（Microtask Queue）与宏任务队列（Macrotask Queue）**的执行时序。\n\n### 一、 题目代码\n\n```javascript\nasync function async1() {\n  console.log('async1 start')\n  await async2()\n  console.log('async1 end')\n}\n\nasync function async2() {\n  console.log('async2')\n}\n\nconsole.log('script start')\n\nsetTimeout(() => {\n  console.log('setTimeout')\n}, 0)\n\nasync1()\n\nnew Promise((resolve) => {\n  console.log('promise1')\n  resolve()\n}).then(() => {\n  console.log('promise2')\n})\n\nconsole.log('script end')\n```\n\n### 二、 逐阶段队列状态与输出演进表\n\n理解本题的铁律是：**`await async2()` 会同步执行 `async2()` 函数体本身，随后将 `await` 下方的代码（`console.log('async1 end')`）包装进 `Promise.resolve(undefined).then(...)` 推入微任务队列**。\n\n| 执行阶段 | 当前执行语句 | 控制台输出 | 微任务队列（FIFO） | 宏任务队列（FIFO） |\n| :--- | :--- | :--- | :--- | :--- |\n| **1. 同步主干** | `console.log('script start')` | `script start` | `[]` | `[]` |\n| **2. 注册定时器** | `setTimeout(..., 0)` | — | `[]` | `[setTimeout回调]` |\n| **3. 调用 async1** | 打印 `async1 start` → 同步执行 `async2()` 打印 `async2` → 遇 `await` 挂起后续语句 | `async1 start`<br>`async2` | `[async1 end]` | `[setTimeout回调]` |\n| **4. 构造 Promise** | `new Promise` 执行器同步打印 `promise1` → `resolve()` → `.then` 入微任务队尾 | `promise1` | `[async1 end, promise2]` | `[setTimeout回调]` |\n| **5. 同步收尾** | `console.log('script end')`（同步调用栈清空） | `script end` | `[async1 end, promise2]` | `[setTimeout回调]` |\n| **6. 清空微任务** | 依次出队执行全部微任务 | `async1 end`<br>`promise2` | `[]` | `[setTimeout回调]` |\n| **7. 下一轮宏任务** | 取出 `setTimeout` 宏任务回调执行 | `setTimeout` | `[]` | `[]` |\n\n### 三、 完整输出结果\n\n```text\nscript start\nasync1 start\nasync2\npromise1\nscript end\nasync1 end\npromise2\nsetTimeout\n```"
  },
  {
    "id": "js-026",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "并发控制",
      "Promise",
      "异步"
    ],
    "question": "如何实现并发请求控制（限制同时发起的请求数量）？",
    "answer": "### 方案：维护一个执行队列\n\n```javascript\nasync function concurrentLimit(tasks, limit) {\n  const results = []\n  const executing = new Set()\n\n  for (const task of tasks) {\n    // 创建 Promise 并加入执行集合\n    const p = task().then(result => {\n      executing.delete(p)\n      return result\n    })\n    executing.add(p)\n    results.push(p)\n\n    // 当并发数达到上限，等待最快的一个完成\n    if (executing.size >= limit) {\n      await Promise.race(executing)\n    }\n  }\n\n  return Promise.all(results)\n}\n```\n\n### 使用示例\n\n```javascript\n// 模拟 10 个请求，限制并发 3\nconst urls = Array.from({ length: 10 }, (_, i) => `/api/${i}`)\nconst tasks = urls.map(url => () =>\n  fetch(url).then(r => r.json())\n)\n\nconcurrentLimit(tasks, 3).then(results => {\n  console.log('全部完成:', results)\n})\n```\n\n### 进阶版：支持回调通知\n\n```javascript\nclass ConcurrentPool {\n  constructor(limit) {\n    this.limit = limit\n    this.queue = []\n    this.active = 0\n  }\n\n  add(task) {\n    return new Promise((resolve, reject) => {\n      this.queue.push({ task, resolve, reject })\n      this.run()\n    })\n  }\n\n  run() {\n    while (this.active < this.limit && this.queue.length) {\n      const { task, resolve, reject } = this.queue.shift()\n      this.active++\n      task()\n        .then(resolve)\n        .catch(reject)\n        .finally(() => {\n          this.active--\n          this.run()\n        })\n    }\n  }\n}\n\n// 使用\nconst pool = new ConcurrentPool(3)\nurls.forEach(url => pool.add(() => fetch(url)))\n```\n\n### 实际应用场景\n- 批量上传文件\n- 爬虫控制并发\n- 大量 API 请求需要限流"
  },
  {
    "id": "js-027",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Promise",
      "重试",
      "容错"
    ],
    "question": "如何实现一个带重试机制的请求函数？",
    "answer": "```javascript\nfunction retryRequest(requestFn, retries = 3, delay = 1000) {\n  return new Promise((resolve, reject) => {\n    const attempt = (n) => {\n      requestFn()\n        .then(resolve)\n        .catch((err) => {\n          if (n <= 0) {\n            reject(err)\n          } else {\n            console.log(`重试第 ${retries - n + 1} 次...`)\n            setTimeout(() => attempt(n - 1), delay)\n          }\n        })\n    }\n    attempt(retries)\n  })\n}\n```\n\n### 使用示例\n\n```javascript\nfunction fetchUser() {\n  return fetch('/api/user').then(r => {\n    if (!r.ok) throw new Error('请求失败')\n    return r.json()\n  })\n}\n\nretryRequest(fetchUser, 3, 1000)\n  .then(user => console.log('成功:', user))\n  .catch(err => console.log('重试 3 次后仍失败:', err))\n```\n\n### 进阶：指数退避\n\n```javascript\nfunction retryWithBackoff(fn, retries = 3, baseDelay = 1000) {\n  return new Promise((resolve, reject) => {\n    const attempt = (n) => {\n      fn()\n        .then(resolve)\n        .catch((err) => {\n          if (n <= 0) {\n            reject(err)\n          } else {\n            const delay = baseDelay * Math.pow(2, retries - n)\n            console.log(`第 ${retries - n + 1} 次重试，等待 ${delay}ms`)\n            setTimeout(() => attempt(n - 1), delay)\n          }\n        })\n    }\n    attempt(retries)\n  })\n}\n// 延迟：1s → 2s → 4s\n```\n\n### async/await 版\n\n```javascript\nasync function retry(fn, retries = 3, delay = 1000) {\n  try {\n    return await fn()\n  } catch (err) {\n    if (retries <= 0) throw err\n    await new Promise(r => setTimeout(r, delay))\n    return retry(fn, retries - 1, delay)\n  }\n}\n```"
  },
  {
    "id": "js-028",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "事件循环",
      "宏任务",
      "微任务",
      "面试题"
    ],
    "question": "Promise 构造函数同步执行、链式 then 值穿透与 catch 捕获输出顺序分析",
    "answer": "本题考察多个 `Promise` 实例并发时，**同步决议（Immediate Resolve）与异步延迟决议（Deferred Resolve）在微任务调度上的差异**，以及 **`.catch()` 捕获异常后恢复为 `fulfilled` 状态**的链式流转机制。\n\n### 一、 题目代码\n\n```javascript\nconst p1 = new Promise((resolve) => {\n  console.log('p1 constructor')\n  resolve(1)\n})\n\nconst p2 = new Promise((resolve) => {\n  console.log('p2 constructor')\n  setTimeout(() => resolve(2), 0)\n})\n\nconsole.log('start')\n\np1.then((v) => {\n  console.log('p1 then1:', v)\n  return v + 10\n})\n  .then((v) => {\n    console.log('p1 then2:', v)\n    throw new Error('boom')\n  })\n  .then(() => {\n    console.log('p1 then3 (skipped)')\n  })\n  .catch((err) => {\n    console.log('p1 catch:', err.message)\n    return 'recovered'\n  })\n  .then((v) => {\n    console.log('p1 after catch:', v)\n  })\n\np2.then((v) => {\n  console.log('p2 then:', v)\n})\n\nconsole.log('end')\n```\n\n### 二、 完整输出顺序与状态机流转表\n\n| 序号 | 输出内容 | 状态流转与调度机制解析 |\n| :--- | :--- | :--- |\n| **1** | `p1 constructor` | `new Promise` 执行器同步执行，`p1` 立即变为 `fulfilled(1)` |\n| **2** | `p2 constructor` | `p2` 执行器同步执行，注册宏任务定时器，此时 `p2` 仍处于 `pending` 状态 |\n| **3** | `start` | 主线程同步日志 |\n| **4** | `end` | `p1.then` 第一个回调进入微任务队列；`p2.then` 因 `p2` 尚在 `pending` 仅存入内部订阅列表；随后打印 `end` |\n| **5** | `p1 then1: 1` | 第一轮微任务：执行 `p1` 的第一个 `.then`，返回 `11` 使下一个链接点变为 `fulfilled(11)` |\n| **6** | `p1 then2: 11` | 第二轮微任务：打印 `11` 后 `throw new Error('boom')`，使返回的新 Promise 变为 `rejected` |\n| **—** | *(跳过 then3)* | 第三个 `.then` 未提供 `onRejected` 回调，触发**异常穿透（Error Bubbling）**直接顺延到 `.catch` |\n| **7** | `p1 catch: boom` | 执行 `.catch` 打印错误信息，并正常返回 `'recovered'`（未再抛错），新 Promise **恢复为 `fulfilled('recovered')`** |\n| **8** | `p1 after catch: recovered` | 微任务继续清空 `.catch` 之后的 `.then` |\n| **9** | `p2 then: 2` | 微任务全部清空后，执行 `setTimeout` 宏任务调用 `resolve(2)`，触发 `p2.then` 微任务输出 `2` |"
  },
  {
    "id": "js-029",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "解构",
      "展开",
      "ES6"
    ],
    "question": "ES6 中有哪些常用特性？请列举并说明",
    "answer": "### 常用 ES6+ 特性\n\n**1. let / const** — 块级作用域变量声明\n\n**2. 箭头函数** — `(a, b) => a + b`\n\n**3. 解构赋值**\n```javascript\nconst { name, age = 18 } = person    // 对象解构 + 默认值\nconst [first, ...rest] = arr          // 数组解构 + 剩余元素\nfunction foo({ x, y } = {}) {}        // 函数参数解构\n```\n\n**4. 模板字符串**\n```javascript\nconst html = `<div>${name}</div>`\n```\n\n**5. 展开运算符**\n```javascript\nconst merged = { ...obj1, ...obj2 }   // 对象合并\nconst combined = [...arr1, ...arr2]   // 数组合并\nfoo(...args)                           // 函数参数展开\n```\n\n**6. 默认参数**\n```javascript\nfunction foo(a = 1, b = 2) {}\n```\n\n**7. Promise + async/await**\n\n**8. Class**\n```javascript\nclass Person {\n  #private = 'secret'   // 私有字段\n  static create() {}\n}\n```\n\n**9. 模块系统**\n```javascript\nimport { foo } from './module.js'\nexport const bar = 123\nexport default function() {}\n```\n\n**10. Map / Set / WeakMap / WeakSet**\n```javascript\nconst map = new Map([['key', 'value']])\nconst set = new Set([1, 2, 3])\n```\n\n**11. 迭代器与生成器**\n```javascript\nfunction* gen() { yield 1; yield 2 }\nfor (const v of gen()) console.log(v)\n```\n\n**12. 可选链与空值合并（ES2020）**\n```javascript\nconst name = user?.profile?.name ?? 'anonymous'\n```\n\n**13. 其他**\n- `Symbol` — 唯一标识\n- `Proxy` / `Reflect` — 元编程\n- `BigInt` — 大整数\n- `Array.flat()` / `Array.flatMap()`\n- `Object.fromEntries()`"
  },
  {
    "id": "js-030",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Proxy",
      "Reflect",
      "响应式"
    ],
    "question": "Proxy 和 Reflect 是什么？有什么应用场景？",
    "answer": "### Proxy\n\n`Proxy` 用于创建一个对象的代理，可以拦截对该对象的基本操作（属性查找、赋值、枚举、函数调用等）。\n\n```javascript\nconst handler = {\n  get(target, key, receiver) {\n    console.log(`读取 ${key}`)\n    return Reflect.get(target, key, receiver)\n  },\n  set(target, key, value, receiver) {\n    console.log(`设置 ${key} = ${value}`)\n    return Reflect.set(target, key, value, receiver)\n  }\n}\n\nconst proxy = new Proxy({ name: 'Tom', age: 25 }, handler)\nproxy.name       // 打印: 读取 name\nproxy.age = 26   // 打印: 设置 age = 26\n```\n\n### 常用拦截器（Trap）\n\n| Trap | 拦截操作 |\n|------|----------|\n| `get` | 属性读取 `obj.key` |\n| `set` | 属性设置 `obj.key = val` |\n| `has` | `in` 操作符 |\n| `deleteProperty` | `delete` 操作符 |\n| `ownKeys` | `Object.keys()` |\n| `apply` | 函数调用 |\n| `construct` | `new` 操作符 |\n\n### Reflect\n\n`Reflect` 提供与 Proxy trap 对应的静态方法，使操作更加规范：\n\n```javascript\nReflect.has(obj, 'key')     // 等同于 'key' in obj\nReflect.get(obj, 'key')     // 等同于 obj.key\nReflect.set(obj, 'key', v)  // 等同于 obj.key = v\nReflect.ownKeys(obj)        // 等同于 Object.keys(obj)\nReflect.deleteProperty(obj, 'key')  // 等同于 delete obj.key\n```\n\n### 应用场景\n\n**1. Vue 3 响应式系统**\n```javascript\nfunction reactive(target) {\n  return new Proxy(target, {\n    get(target, key, receiver) {\n      track(target, key)  // 收集依赖\n      return Reflect.get(target, key, receiver)\n    },\n    set(target, key, value, receiver) {\n      const result = Reflect.set(target, key, value, receiver)\n      trigger(target, key)  // 触发更新\n      return result\n    }\n  })\n}\n```\n\n**2. 数据校验**\n```javascript\nconst validator = new Proxy({}, {\n  set(target, key, value) {\n    if (key === 'age' && (value < 0 || value > 150)) {\n      throw new RangeError('无效年龄')\n    }\n    return Reflect.set(target, key, value)\n  }\n})\n```\n\n**3. 私有属性保护**\n\n### Proxy vs Object.defineProperty\n- Proxy 能监听**新增属性**，defineProperty 不能\n- Proxy 能监听**数组操作**，defineProperty 不能（需要 hack）\n- Proxy 性能更好，是 Vue 3 的核心改进"
  },
  {
    "id": "js-031",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "Map",
      "Set",
      "WeakMap",
      "数据结构"
    ],
    "question": "Map/Set 和 WeakMap/WeakSet 的区别？使用场景是什么？",
    "answer": "### 对比表\n\n| 特性 | Map | WeakMap | Set | WeakSet |\n|------|-----|---------|-----|---------|\n| 键类型 | 任意 | **仅对象** | — | — |\n| 值类型 | 任意 | 任意 | — | **仅对象** |\n| 可遍历 | ✅ | ❌ | ✅ | ❌ |\n| 强引用 | ✅ | ❌（弱引用） | ✅ | ❌（弱引用） |\n| size 属性 | ✅ | ❌ | ✅ | ❌ |\n| GC 回收 | 不会 | **会** | 不会 | **会** |\n\n### Map\n\n```javascript\nconst map = new Map()\nmap.set('name', 'Tom')\nmap.set(1, 'number key')     // 任意类型键\nmap.set({ id: 1 }, 'object key')\n\nmap.get('name')   // 'Tom'\nmap.has('name')   // true\nmap.size          // 3\nmap.forEach((v, k) => console.log(k, v))\n```\n\n### Set\n\n```javascript\nconst set = new Set([1, 2, 2, 3, 3])\nset.size          // 3（自动去重）\nset.add(4)\nset.has(2)        // true\nset.delete(1)\n\n// 数组去重\nconst unique = [...new Set([1, 1, 2, 3, 3])]\n```\n\n### WeakMap — 弱引用映射\n\n```javascript\nconst wm = new WeakMap()\nlet obj = { name: 'Tom' }\nwm.set(obj, 'metadata')\n\n// 当 obj 被回收，wm 中的条目也会被自动清除\nobj = null  // 触发 GC 后，wm 中对应条目消失\n```\n\n### 使用场景\n\n**WeakMap：**\n1. **DOM 节点关联数据**（节点被移除时数据自动清理）\n```javascript\nconst elementData = new WeakMap()\nelementData.set(domElement, { listeners: [], state: {} })\n```\n2. **私有属性存储**\n```javascript\nconst privateFields = new WeakMap()\nclass Person {\n  constructor(name) {\n    privateFields.set(this, { _name: name })\n  }\n  getName() { return privateFields.get(this)._name }\n}\n```\n3. **缓存**（对象被回收时缓存自动失效）\n\n**WeakSet：**\n1. **对象标记**（标记某对象是否被处理过）\n```javascript\nconst processed = new WeakSet()\nfunction handle(obj) {\n  if (processed.has(obj)) return\n  // 处理 obj...\n  processed.add(obj)\n}\n```"
  },
  {
    "id": "js-032",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "迭代器",
      "生成器",
      "Iterator"
    ],
    "question": "什么是迭代器（Iterator）和生成器（Generator）？",
    "answer": "### Iterator（迭代器）\n\n迭代器是一个对象，实现了 `next()` 方法，返回 `{ value, done }`。\n\n```javascript\nfunction createIterator(arr) {\n  let index = 0\n  return {\n    next() {\n      return index < arr.length\n        ? { value: arr[index++], done: false }\n        : { value: undefined, done: true }\n    }\n  }\n}\n\nconst it = createIterator([1, 2, 3])\nit.next()  // { value: 1, done: false }\nit.next()  // { value: 2, done: false }\nit.next()  // { value: 3, done: false }\nit.next()  // { value: undefined, done: true }\n```\n\n### 可迭代协议（Iterable）\n\n实现了 `[Symbol.iterator]` 方法的对象可被 `for...of` 遍历：\n\n```javascript\nconst obj = {\n  data: [1, 2, 3],\n  [Symbol.iterator]() {\n    let index = 0\n    return {\n      next: () => {\n        return index < this.data.length\n          ? { value: this.data[index++], done: false }\n          : { value: undefined, done: true }\n      }\n    }\n  }\n}\n\nfor (const v of obj) console.log(v)  // 1, 2, 3\n```\n\n### Generator（生成器）\n\n`function*` 声明生成器函数，`yield` 暂停执行：\n\n```javascript\nfunction* gen() {\n  yield 1\n  yield 2\n  yield 3\n}\n\nconst g = gen()\ng.next()  // { value: 1, done: false }\ng.next()  // { value: 2, done: false }\ng.next()  // { value: 3, done: false }\ng.next()  // { value: undefined, done: true }\n\nfor (const v of gen()) console.log(v)  // 1, 2, 3\n```\n\n### yield 委托\n\n```javascript\nfunction* gen1() { yield 1; yield 2 }\nfunction* gen2() { yield* gen1(); yield 3 }\n\nfor (const v of gen2()) console.log(v)  // 1, 2, 3\n```\n\n### 应用场景\n\n1. **自定义数据结构遍历**\n2. **惰性求值**（按需生成值，节省内存）\n3. **状态机**\n4. **async/await 的底层实现**（Generator + 自动执行器）\n\n```javascript\n// 无限序列\nfunction* naturalNumbers() {\n  let n = 1\n  while (true) yield n++\n}\nconst numbers = naturalNumbers()\nnumbers.next().value  // 1\nnumbers.next().value  // 2\n// 不会内存溢出\n```"
  },
  {
    "id": "js-033",
    "category": "javascript",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "可选链",
      "空值合并",
      "ES2020"
    ],
    "question": "可选链（?.）和空值合并（??）运算符的作用是什么？",
    "answer": "### 可选链 ?.\n\n安全地访问深层嵌套的属性，遇到 `null/undefined` 时短路返回 `undefined`，不会报错。\n\n```javascript\n// ❌ 旧写法：层层判断\nconst name = user && user.profile && user.profile.name\n\n// ✅ 可选链\nconst name = user?.profile?.name\n// 如果 user 或 user.profile 为 null/undefined → 返回 undefined\n\n// 函数调用\nconst result = obj?.method?.()\n\n// 数组索引\nconst first = arr?.[0]\n\n// 动态属性名\nconst value = obj?.[dynamicKey]\n```\n\n### 空值合并 ??\n\n当左侧为 `null` 或 `undefined` 时返回右侧值。**注意与 `||` 的区别**：\n\n```javascript\n// || 会将 falsy 值（0, '', false, null, undefined, NaN）都视为假\n0 || 'default'     // 'default'  ❌ 不是期望的\n'' || 'default'    // 'default'  ❌\nfalse || 'default' // 'default'  ❌\n\n// ?? 只将 null 和 undefined 视为空\n0 ?? 'default'     // 0          ✅\n'' ?? 'default'    // ''         ✅\nfalse ?? 'default' // false      ✅\nnull ?? 'default'  // 'default'  ✅\nundefined ?? 'default'  // 'default' ✅\n```\n\n### 组合使用\n\n```javascript\n// 获取用户名，如果不存在则使用匿名\nconst name = user?.profile?.name ?? '匿名'\n\n// 获取配置，提供默认值\nconst port = config?.server?.port ?? 3000\n```\n\n### 注意事项\n- 不能在赋值语句左侧使用可选链：`obj?.name = 'Tom'` ❌ 语法错误\n- 优先级：`??` 不能与 `||` / `&&` 直接混用，需要括号：`(a ?? b) || c`"
  },
  {
    "id": "js-034",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "装饰器",
      "高阶函数",
      "ES6"
    ],
    "question": "什么是装饰器模式？在 JavaScript 中如何实现？",
    "answer": "**装饰器模式**：在不修改原函数的前提下，动态扩展其功能。\n\n### 函数装饰器（高阶函数）\n\n```javascript\n// 日志装饰器\nfunction withLog(fn) {\n  return function (...args) {\n    console.log(`调用 ${fn.name}，参数: `, args)\n    const result = fn.apply(this, args)\n    console.log(`返回: `, result)\n    return result\n  }\n}\n\n// 性能装饰器\nfunction withTimer(fn) {\n  return function (...args) {\n    console.time(fn.name)\n    const result = fn.apply(this, args)\n    console.timeEnd(fn.name)\n    return result\n  }\n}\n\n// 缓存装饰器\nfunction withCache(fn) {\n  const cache = new Map()\n  return function (...args) {\n    const key = JSON.stringify(args)\n    if (cache.has(key)) return cache.get(key)\n    const result = fn.apply(this, args)\n    cache.set(key, result)\n    return result\n  }\n}\n\n// 组合使用\nconst enhancedFn = withCache(withTimer(withLog(complexCalc)))\n```\n\n### 类装饰器（TC39 提案 / TypeScript）\n\n```javascript\n// TypeScript 中的装饰器\nfunction log(target, key, descriptor) {\n  const original = descriptor.value\n  descriptor.value = function (...args) {\n    console.log(`调用 ${key}`)\n    return original.apply(this, args)\n  }\n  return descriptor\n}\n\nclass Service {\n  @log\n  fetchData() { /* ... */ }\n}\n```\n\n### 实际应用\n\n**防抖 / 节流**本质上就是装饰器：\n\n```javascript\nfunction debounce(fn, delay) {\n  let timer\n  return function (...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn.apply(this, args), delay)\n  }\n}\n\nfunction throttle(fn, interval) {\n  let lastTime = 0\n  return function (...args) {\n    const now = Date.now()\n    if (now - lastTime >= interval) {\n      lastTime = now\n      return fn.apply(this, args)\n    }\n  }\n}\n\n// 使用\nwindow.addEventListener('resize', debounce(handleResize, 300))\nwindow.addEventListener('scroll', throttle(handleScroll, 100))\n```\n\n### 核心思想\n- **开闭原则**：对扩展开放，对修改封闭\n- 装饰器比继承更灵活，避免类爆炸"
  },
  {
    "id": "js-035",
    "category": "javascript",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "数组方法",
      "map",
      "filter",
      "reduce"
    ],
    "question": "数组方法 map、filter、reduce 的区别和用法？",
    "answer": "### map — 映射\n\n对每个元素执行函数，返回**新数组**，长度不变。\n\n```javascript\nconst nums = [1, 2, 3]\nconst doubled = nums.map(n => n * 2)  // [2, 4, 6]\n\n// 提取对象属性\nconst users = [{ name: 'Tom' }, { name: 'Jerry' }]\nconst names = users.map(u => u.name)  // ['Tom', 'Jerry']\n```\n\n### filter — 过滤\n\n返回满足条件的元素组成的新数组。\n\n```javascript\nconst nums = [1, 2, 3, 4, 5]\nconst evens = nums.filter(n => n % 2 === 0)  // [2, 4]\n\n// 去重\nconst arr = [1, 2, 2, 3, 3, 3]\nconst unique = arr.filter((v, i, a) => a.indexOf(v) === i)  // [1, 2, 3]\n```\n\n### reduce — 归约\n\n将数组归约为单个值，最灵活但也最复杂。\n\n```javascript\n// 求和\nconst sum = [1, 2, 3].reduce((acc, cur) => acc + cur, 0)  // 6\n\n// 求最大值\nconst max = [1, 5, 3].reduce((a, b) => Math.max(a, b))  // 5\n\n// 数组转对象\nconst users = [{ id: 1, name: 'Tom' }, { id: 2, name: 'Jerry' }]\nconst userMap = users.reduce((map, u) => {\n  map[u.id] = u\n  return map\n}, {})  // { 1: {...}, 2: {...} }\n\n// 扁平化\nconst nested = [[1, 2], [3, 4], [5]]\nconst flat = nested.reduce((acc, cur) => acc.concat(cur), [])  // [1, 2, 3, 4, 5]\n\n// 分组\nconst people = [\n  { name: 'Tom', age: 20 },\n  { name: 'Jerry', age: 20 },\n  { name: 'Spike', age: 30 }\n]\nconst grouped = people.reduce((groups, p) => {\n  const key = p.age\n  ;(groups[key] ||= []).push(p)\n  return groups\n}, {})  // { 20: [...], 30: [...] }\n```\n\n### 对比\n\n| 方法 | 返回值 | 用途 |\n|------|--------|------|\n| map | 新数组（同长度） | 转换每个元素 |\n| filter | 新数组（可能更短） | 筛选元素 |\n| reduce | 任意值 | 聚合/归约 |\n\n### 链式调用\n\n```javascript\nconst result = users\n  .filter(u => u.age >= 18)\n  .map(u => u.name)\n  .reduce((acc, name) => acc + name.length, 0)\n```"
  },
  {
    "id": "js-036",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "深拷贝",
      "浅拷贝",
      "引用"
    ],
    "question": "深拷贝和浅拷贝的区别？如何实现深拷贝？",
    "answer": "### 区别\n\n- **浅拷贝**：只复制第一层，嵌套的引用类型仍共享地址\n- **深拷贝**：递归复制所有层级，完全独立\n\n```javascript\nconst obj = { a: 1, b: { c: 2 } }\n\n// 浅拷贝\nconst shallow = { ...obj }\nshallow.b.c = 99\nconsole.log(obj.b.c)  // 99（共享引用）\n\n// 深拷贝\nconst deep = structuredClone(obj)\ndeep.b.c = 99\nconsole.log(obj.b.c)  // 2（独立）\n```\n\n### 浅拷贝方法\n\n```javascript\nconst copy1 = { ...obj }              // 展开运算符\nconst copy2 = Object.assign({}, obj)   // Object.assign\nconst arrCopy = [...arr]               // 数组浅拷贝\nconst arrCopy2 = arr.slice()           // 数组浅拷贝\n```\n\n### 深拷贝方法\n\n**1. structuredClone（推荐，现代浏览器原生支持）**\n```javascript\nconst clone = structuredClone(obj)\n// 支持循环引用、Date、RegExp、Map、Set 等\n// 不支持函数、Symbol、DOM 节点\n```\n\n**2. JSON 序列化（简单但有局限）**\n```javascript\nconst clone = JSON.parse(JSON.stringify(obj))\n// ❌ 不支持：undefined、function、Symbol、循环引用、Date→字符串、RegExp→空对象\n```\n\n**3. 手写深拷贝**\n\n```javascript\nfunction deepClone(obj, map = new WeakMap()) {\n  if (obj === null || typeof obj !== 'object') return obj\n  if (obj instanceof Date) return new Date(obj)\n  if (obj instanceof RegExp) return new RegExp(obj)\n  if (obj instanceof Map) {\n    const clone = new Map()\n    map.set(obj, clone)\n    obj.forEach((v, k) => clone.set(deepClone(k, map), deepClone(v, map)))\n    return clone\n  }\n  if (obj instanceof Set) {\n    const clone = new Set()\n    map.set(obj, clone)\n    obj.forEach(v => clone.add(deepClone(v, map)))\n    return clone\n  }\n\n  // 处理循环引用\n  if (map.has(obj)) return map.get(obj)\n\n  const clone = Array.isArray(obj) ? [] : {}\n  map.set(obj, clone)\n\n  for (const key of Reflect.ownKeys(obj)) {\n    clone[key] = deepClone(obj[key], map)\n  }\n  return clone\n}\n```\n\n### 各方法对比\n\n| 方法 | 循环引用 | 函数 | Date/RegExp | 性能 |\n|------|----------|------|-------------|------|\n| structuredClone | ✅ | ❌ | ✅ | 好 |\n| JSON.parse/stringify | ❌ | ❌ | ❌ | 中 |\n| 手写 deepClone | ✅ | ✅ | ✅ | 可控 |"
  },
  {
    "id": "js-037",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "防抖",
      "节流",
      "性能优化"
    ],
    "question": "手写防抖（debounce）和节流（throttle）函数",
    "answer": "### 防抖（Debounce）\n\n事件停止触发 **n 秒后**执行，如果在 n 秒内再次触发则重新计时。\n\n```javascript\nfunction debounce(fn, delay, immediate = false) {\n  let timer = null\n\n  return function (...args) {\n    if (timer) clearTimeout(timer)\n\n    if (immediate && !timer) {\n      fn.apply(this, args)\n    }\n\n    timer = setTimeout(() => {\n      if (!immediate) fn.apply(this, args)\n      timer = null\n    }, delay)\n  }\n}\n\n// 使用\ninput.addEventListener('input', debounce(search, 300))\nwindow.addEventListener('resize', debounce(updateLayout, 200))\n```\n\n**应用场景**：搜索框输入、窗口 resize、表单验证\n\n### 节流（Throttle）\n\n每 **n 秒最多执行一次**，在此期间的触发被忽略。\n\n```javascript\n// 时间戳版（第一次立即执行，最后一次不执行）\nfunction throttle(fn, interval) {\n  let lastTime = 0\n  return function (...args) {\n    const now = Date.now()\n    if (now - lastTime >= interval) {\n      lastTime = now\n      fn.apply(this, args)\n    }\n  }\n}\n\n// 定时器版（第一次不执行，最后一次会执行）\nfunction throttle(fn, interval) {\n  let timer = null\n  return function (...args) {\n    if (!timer) {\n      timer = setTimeout(() => {\n        fn.apply(this, args)\n        timer = null\n      }, interval)\n    }\n  }\n}\n\n// 组合版（第一次和最后一次都执行）\nfunction throttle(fn, interval) {\n  let lastTime = 0\n  let timer = null\n  return function (...args) {\n    const now = Date.now()\n    const remaining = interval - (now - lastTime)\n\n    if (remaining <= 0) {\n      if (timer) { clearTimeout(timer); timer = null }\n      lastTime = now\n      fn.apply(this, args)\n    } else if (!timer) {\n      timer = setTimeout(() => {\n        lastTime = Date.now()\n        timer = null\n        fn.apply(this, args)\n      }, remaining)\n    }\n  }\n}\n```\n\n**应用场景**：滚动加载、按钮防重复点击、鼠标拖拽\n\n### 对比\n\n| | 防抖 | 节流 |\n|--|------|------|\n| 原理 | 重置计时器 | 固定频率执行 |\n| 类比 | 电梯等人 | 电梯定时发车 |\n| 场景 | 搜索联想 | 滚动监听 |"
  },
  {
    "id": "js-038",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "错误处理",
      "try-catch",
      "Error"
    ],
    "question": "JavaScript 中有哪些错误类型？如何正确处理异常？",
    "answer": "### JavaScript 内置错误类型\n\n```text\nError                  — 基类\n├── SyntaxError        — 语法错误\n├── ReferenceError     — 引用不存在的变量\n├── TypeError          — 类型错误\n├── RangeError         — 值超出有效范围\n├── URIError           — URI 编解码错误\n├── EvalError          — eval 相关（已废弃）\n└── AggregateError     — 多个错误聚合（ES2021）\n```\n\n```javascript\nconsole.log(a)         // ReferenceError: a is not defined\nnull.foo()              // TypeError: Cannot read properties of null\nnew Array(-1)           // RangeError: Invalid array length\ndecodeURIComponent('%') // URIError: URI malformed\n```\n\n### 异常处理\n\n```javascript\ntry {\n  // 可能出错的代码\n  JSON.parse(invalidJson)\n} catch (error) {\n  // 捕获错误\n  console.error(error.message)\n  console.error(error.stack)\n} finally {\n  // 无论是否出错都执行\n  cleanup()\n}\n```\n\n### 自定义错误\n\n```javascript\nclass ValidationError extends Error {\n  constructor(message, field) {\n    super(message)\n    this.name = 'ValidationError'\n    this.field = field\n  }\n}\n\nfunction validateUser(user) {\n  if (!user.email) {\n    throw new ValidationError('邮箱不能为空', 'email')\n  }\n}\n```\n\n### Promise 错误处理\n\n```javascript\n// .catch 捕获\nfetch('/api')\n  .then(res => res.json())\n  .catch(err => console.error('请求失败:', err))\n\n// async/await + try/catch\nasync function fetchData() {\n  try {\n    const res = await fetch('/api')\n    return await res.json()\n  } catch (err) {\n    console.error('请求失败:', err)\n    // 可以选择重试或返回默认值\n    return null\n  }\n}\n```\n\n### 全局错误捕获\n\n```javascript\n// 同步错误\nwindow.onerror = (message, source, lineno, colno, error) => {\n  console.error('全局错误:', error)\n}\n\n// Promise 未捕获的 rejection\nwindow.addEventListener('unhandledrejection', (event) => {\n  console.error('未处理的 Promise 拒绝:', event.reason)\n})\n```\n\n### 最佳实践\n1. **不要吞掉错误**：`catch` 中至少要有日志\n2. **区分错误类型**：自定义错误类便于分类处理\n3. **优雅降级**：出错时返回默认值或显示友好提示\n4. **异步错误必须处理**：Promise 链必须有 `catch`"
  },
  {
    "id": "js-039",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "垃圾回收",
      "内存管理",
      "V8"
    ],
    "question": "V8 引擎的垃圾回收机制是怎样的？",
    "answer": "### V8 垃圾回收策略\n\nV8 采用**分代回收**机制，将堆内存分为**新生代**和**老生代**。\n\n### 新生代（Scavenge 算法）\n\n- 存放存活时间短的对象（1~8MB）\n- 分为 **From 空间** 和 **To 空间**\n\n**回收过程：**\n1. 从 GC Root 遍历，标记 From 空间中存活的对象\n2. 将存活对象**复制**到 To 空间\n3. 清空 From 空间\n4. From 和 To 角色互换\n\n**特点**：空间换时间，适合存活率低的场景\n\n### 老生代（Mark-Sweep + Mark-Compact）\n\n- 存放存活时间长、体积大的对象\n- 经历过 **2 次 Scavenge 回收仍存活**的对象晋升到老生代\n\n**Mark-Sweep（标记清除）：**\n1. **标记阶段**：从 GC Root 遍历，标记所有可达对象\n2. **清除阶段**：清除未标记的对象\n\n**问题**：产生内存碎片\n\n**Mark-Compact（标记整理）：**\n1. 标记存活对象\n2. 将存活对象向一端移动，紧凑排列\n3. 清除边界以外的内存\n\n**特点**：解决碎片问题，但移动对象有开销\n\n### 增量标记与并发回收\n\n- **增量标记**（Incremental）：将标记任务拆分成小步骤，穿插在 JS 执行之间，避免长时间停顿\n- **并发回收**（Concurrent）：GC 在后台线程执行，主线程不暂停\n\n### 引用计数（已弃用）\n\nV8 早期尝试过引用计数，但有**循环引用**问题：\n```javascript\nlet a = {}\nlet b = {}\na.ref = b\nb.ref = a\n// 引用计数永远不为 0，无法回收\n```\n现代 V8 使用可达性分析，彻底解决此问题。\n\n### 常见内存泄漏场景\n\n1. **意外的全局变量**：`function foo() { bar = 1 }`（未用 let/var）\n2. **被遗忘的定时器**：`setInterval` 未清除\n3. **闭包引用**：不必要的大对象被闭包持有\n4. **DOM 引用**：元素被移除但 JS 变量仍引用\n\n### 调试工具\n- Chrome DevTools → Memory 面板 → Heap snapshot\n- `performance.memory`（非标准 API）\n- `--trace-gc` V8 启动参数"
  },
  {
    "id": "js-040",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "EventLoop",
      "Node.js",
      "浏览器"
    ],
    "question": "浏览器和 Node.js 的事件循环有什么区别？",
    "answer": "### 浏览器事件循环\n\n```text\n同步代码 → 微任务全部执行 → 一个宏任务 → 微任务全部执行 → 一个宏任务 → ...\n```\n\n**微任务**：Promise.then、queueMicrotask、MutationObserver\n**宏任务**：setTimeout、setInterval、I/O、UI 渲染\n\n### Node.js 事件循环\n\n```text\n┌───────────────────────────┐\n┌─>│         timers             │  ← setTimeout/setInterval\n│  └─────────────┬─────────────┘\n│  ┌─────────────┴─────────────┐\n│  │     pending callbacks      │  ← 系统级回调\n│  └─────────────┬─────────────┘\n│  ┌─────────────┴─────────────┐\n│  │       idle, prepare        │  ← 内部使用\n│  └─────────────┬─────────────┘\n│  ┌─────────────┴─────────────┐\n│  │           poll             │  ← I/O 事件\n│  └─────────────┬─────────────┘\n│  ┌─────────────┴─────────────┐\n│  │           check             │  ← setImmediate\n│  └─────────────┬─────────────┘\n│  ┌─────────────┴─────────────┐\n│  │      close callbacks       │  ← close 事件\n│  └───────────────────────────┘\n│\n└── 每个阶段之间执行微任务\n```\n\n### 关键区别\n\n| 特性 | 浏览器 | Node.js |\n|------|--------|---------|\n| 微任务执行时机 | 每个宏任务后 | 每个阶段切换时 |\n| process.nextTick | 无 | 有，优先级最高 |\n| setImmediate | 无 | 有，check 阶段执行 |\n| 微任务类型 | Promise.then 等 | + process.nextTick |\n\n### 经典面试题：setTimeout vs setImmediate\n\n```javascript\n// 顺序不确定（取决于事件循环启动时间）\nsetTimeout(() => console.log('timeout'), 0)\nsetImmediate(() => console.log('immediate'))\n\n// 但在 I/O 回调中，setImmediate 一定先于 setTimeout\nfs.readFile('file.txt', () => {\n  setTimeout(() => console.log('timeout'), 0)\n  setImmediate(() => console.log('immediate'))\n  // 总是输出: immediate → timeout\n})\n```\n\n### process.nextTick\n\n```javascript\nPromise.resolve().then(() => console.log('promise'))\nprocess.nextTick(() => console.log('nextTick'))\n// 输出: nextTick → promise\n// nextTick 优先级高于所有微任务\n```\n\n### Node.js 11+ 的变化\nNode.js 11 开始，浏览器和 Node.js 的微任务执行时机趋于一致：**每个宏任务后立即执行微任务**，而非等到当前阶段所有宏任务都执行完。"
  },
  {
    "id": "js-041",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "fetch",
      "错误处理",
      "HTTP",
      "网络请求"
    ],
    "question": "为什么用 fetch 发送 PATCH 请求返回 404 / 500，代码却没有进入 catch？正确的错误处理应该怎么写？",
    "answer": "这是 fetch 最容易踩的坑之一。\n\n### 原因：fetch 只在「网络层失败」时才 reject\n\n`fetch` 的设计是：**只有在网络请求本身失败（断网、DNS 解析失败、CORS 被拦截、请求被 abort）时才会 reject 并进入 `catch`**。\n\n而 HTTP 状态码 `404` / `500` 属于「请求成功到达服务器并拿到了响应」，只是响应状态码表示业务失败——这种情况 fetch 认为请求是「成功完成」的，会正常 resolve，`Promise` 进入 `then`，而不会进入 `catch`。\n\n```javascript\n// ❌ 错误写法：以为 404/500 会进 catch\nfetch('/api/user', { method: 'PATCH', body: JSON.stringify(data) })\n  .then(res => {\n    // 404/500 也会走到这里！\n    return res.json()\n  })\n  .catch(err => {\n    // 只有网络错误才进这里\n  })\n```\n\n### 正确做法：手动检查响应状态\n\n```javascript\nfetch('/api/user', { method: 'PATCH', body: JSON.stringify(data) })\n  .then(res => {\n    if (!res.ok) {\n      // res.ok 为 false 表示状态码 >= 400\n      throw new Error('请求失败：' + res.status + ' ' + res.statusText)\n    }\n    return res.json()\n  })\n  .then(data => { /* 业务成功 */ })\n  .catch(err => { /* 网络错误 + 主动抛出的 HTTP 错误都到这里 */ })\n\n// 或更推荐的 async/await 写法\nasync function patchUser(data) {\n  const res = await fetch('/api/user', {\n    method: 'PATCH',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(data),\n  })\n  if (!res.ok) {\n    throw new Error('HTTP ' + res.status)\n  }\n  return res.json()\n}\n```\n\n### 常见误区\n- **误区**：axios 会对 4xx/5xx 自动 reject，于是把 axios 习惯套到 fetch 上。\n- **注意**：axios 在 4xx/5xx 时确实会 reject；但 `fetch` 不会，二者行为不同。\n- 可用 `res.status >= 400` 判断，但 `res.ok` 语义更清晰（等价于 `200 <= status < 300`）。"
  },
  {
    "id": "js-042",
    "category": "javascript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "requestAnimationFrame",
      "setTimeout",
      "setInterval",
      "动画",
      "事件循环"
    ],
    "question": "requestAnimationFrame 和 setTimeout / setInterval 有什么区别？为什么页面动画优先用 rAF，而倒计时 / 轮询有时反而用 setTimeout？",
    "answer": "### 三者的本质区别\n\n| 维度 | requestAnimationFrame | setTimeout | setInterval |\n|------|----------------------|-----------|-------------|\n| 触发时机 | 浏览器**每次重绘前**（与刷新率同步，通常 60fps） | 至少等待指定毫秒后（宏任务） | 每隔指定毫秒（宏任务） |\n| 后台标签页 | **自动暂停**（省电、不空转） | 被节流到 >=1s | 被节流到 >=1s |\n| 精度 | 与渲染帧对齐，动画最顺滑 | 受事件循环阻塞、易抖动 | 同上，且可能「丢帧堆叠」 |\n| 适合场景 | 视觉动画、滚动、逐帧渲染 | 单次延时、轮询、倒计时 | 固定间隔重复（不推荐做动画） |\n\n### 为什么动画优先用 rAF\n\n```javascript\n// ✅ 平滑动画：每帧根据时间戳计算进度，与屏幕刷新同步\nfunction animate(el) {\n  let start\n  function step(ts) {\n    if (!start) start = ts\n    const p = (ts - start) / 1000        // 已过去秒数\n    el.style.transform = 'translateX(' + (p * 200) + 'px)'\n    if (p < 1) requestAnimationFrame(step)\n  }\n  requestAnimationFrame(step)\n}\n```\n\n如果用 `setInterval(fn, 16)`，定时器与渲染帧不一定对齐，容易掉帧卡顿，且在后台标签页仍持续运行浪费资源。\n\n### 为什么倒计时 / 轮询有时用 setTimeout\n\n- **打字机效果**：希望「每隔固定字符间隔」出现下一个字，是**时间驱动**而非帧驱动，用 `setInterval` 更直观。\n- **倒计时器**：用 `setTimeout` 递归可做到**切到后台仍在计时**（rAF 会暂停），适合真实计时场景（如考试倒计时）。\n- **轮询**：用 `setTimeout` 递归（上一次请求回来再排下一次）比 `setInterval` 更安全，避免请求堆积。\n\n> 关键判断：**视觉动画 → rAF；真实时间 / 轮询 / 与帧无关的节奏 → setTimeout / setInterval**。\n\n### 注意事项\n- `setInterval` 回调执行时间若超过间隔，回调会「堆叠」排队，可能导致逻辑错乱，业务轮询建议用递归 `setTimeout`。\n- 后台标签页中 `setTimeout` / `setInterval` 最小间隔被浏览器限制为 >=1000ms。"
  },
  {
    "id": "js-043",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "倒计时",
      "requestAnimationFrame",
      "setTimeout",
      "手写代码",
      "业务题"
    ],
    "question": "手写一个高精度倒计时器，分别用 setTimeout 递归 和 requestAnimationFrame 实现，并说明两者差异（参考 PDD 前端笔试题）。",
    "answer": "### 基于 setTimeout 递归（后台仍可计时）\n\n用**时间戳**计算剩余时间，而不是简单递减，避免定时器漂移：\n\n```javascript\nfunction countdownByTimeout(duration, onTick, onEnd) {\n  const endTime = Date.now() + duration\n  function loop() {\n    const remain = endTime - Date.now()\n    if (remain <= 0) {\n      onTick(0)\n      onEnd && onEnd()\n      return\n    }\n    onTick(remain)\n    // 越接近结束，间隔调小，减少「跳秒」误差\n    const delay = remain < 1000 ? 100 : 250\n    setTimeout(loop, delay)\n  }\n  loop()\n}\n\ncountdownByTimeout(60000, (ms) => {\n  console.log((ms / 1000).toFixed(1) + 's')\n}, () => console.log('时间到'))\n```\n\n### 基于 requestAnimationFrame（与渲染帧同步，后台暂停）\n\n```javascript\nfunction countdownByRAF(duration, onTick, onEnd) {\n  const endTime = performance.now() + duration\n  function loop(now) {\n    const remain = endTime - now\n    if (remain <= 0) {\n      onTick(0)\n      onEnd && onEnd()\n      return\n    }\n    onTick(remain)\n    requestAnimationFrame(loop)\n  }\n  requestAnimationFrame(loop)\n}\n```\n\n### 两者差异\n\n| 维度 | setTimeout 递归 | requestAnimationFrame |\n|------|----------------|----------------------|\n| 后台标签页 | 继续计时 | 暂停计时 |\n| 精度 | 依赖时间戳，误差小 | 随帧，丝滑 |\n| 适合 | 真实倒计时（考试、抢购） | 页面 UI 展示倒计时 |\n\n> 关键：**用 `Date.now()` / `performance.now()` 算剩余时间，而不是靠计数器递减**——这样即使两次回调间隔不准，显示依然准确。"
  },
  {
    "id": "js-044",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "SKU",
      "电商",
      "算法",
      "业务题",
      "手写代码"
    ],
    "question": "实现一个电商 SKU 规格禁用逻辑：已选部分规格后，如何计算哪些未选规格选项应当置灰（不可点击）？",
    "answer": "### 思路\n\n给定 SKU 列表（每个 SKU 是一组规格的组合）和**当前已选规格**，对每一个**未选中的规格维度**的选项，模拟把它加入已选集合，看是否能匹配到某个存在的 SKU；匹配不到就禁用。\n\n```javascript\n// skus: 所有可选商品，每个是规格值映射，如 { 颜色: '黑色', 容量: '256G' }\n// selected: 已选规格，如 { 颜色: '黑色', 容量: undefined }\nfunction getAvailableOptions(skus, selected, allOptions) {\n  const result = {}\n  for (const dimension of Object.keys(selected)) {\n    if (selected[dimension]) continue           // 已选中的维度跳过\n    const options = new Set()\n    for (const opt of allOptions[dimension]) {\n      const trial = { ...selected, [dimension]: opt }\n      if (hasMatch(skus, trial)) options.add(opt) // 选了它之后整体还有货才保留\n    }\n    result[dimension] = options                  // 不在集合中的就是不可选\n  }\n  return result\n}\n\n// trial 是否能匹配某个 SKU（未选维度不参与匹配）\nfunction hasMatch(skus, trial) {\n  return skus.some(sku =>\n    Object.entries(trial).every(([dim, val]) =>\n      val === undefined || sku[dim] === val\n    )\n  )\n}\n```\n\n### 关键点\n- **未选维度不参与匹配**：只看已选维度能否对应到有效 SKU。\n- 用「临时加入 → 校验是否存在」的方式，时间复杂度可接受（SKU 数量通常不大）。\n- 实际项目可把 `allOptions` 和 `skus` 预处理成映射表提升性能。\n\n> 这是经典电商面试题，核心是「**穷举 + 反向校验**」：不是单纯判断单个选项，而是判断「选了它之后整体还有没有货」。"
  },
  {
    "id": "js-045",
    "category": "javascript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "动画",
      "requestAnimationFrame",
      "缓动",
      "手写代码",
      "Promise"
    ],
    "question": "手写一个通用的 animate 动画工具函数：支持多属性插值、动画时长、缓动函数、每帧回调，可被手动中断，并返回 Promise（参考 PDD 前端笔试题）。",
    "answer": "### 实现\n\n```javascript\nfunction animate({ duration, easing = t => t, onUpdate, onAbort }) {\n  let startTime = null\n  let aborted = false\n  let rafId = null\n\n  const promise = new Promise((resolve) => {\n    function step(now) {\n      if (aborted) {\n        onAbort && onAbort()\n        resolve({ done: false, aborted: true })\n        return\n      }\n      if (startTime === null) startTime = now\n      const elapsed = now - startTime\n      const progress = Math.min(elapsed / duration, 1) // 0~1\n      const eased = easing(progress)                    // 缓动后进度\n      onUpdate && onUpdate(eased, progress)\n\n      if (progress < 1) {\n        rafId = requestAnimationFrame(step)\n      } else {\n        resolve({ done: true, aborted: false })\n      }\n    }\n    rafId = requestAnimationFrame(step)\n  })\n\n  return {\n    finished: promise,\n    abort() { aborted = true; cancelAnimationFrame(rafId) },\n  }\n}\n```\n\n### 使用示例\n\n```javascript\nconst anim = animate({\n  duration: 1000,\n  easing: t => 1 - Math.pow(1 - t, 3), // easeOutCubic\n  onUpdate: (eased) => {\n    box.style.opacity = eased\n    box.style.transform = 'translateX(' + (eased * 200) + 'px)'\n  },\n})\n\nsetTimeout(() => anim.abort(), 500) // 中途中断\nawait anim.finished\nconsole.log('动画结束或被中断')\n```\n\n### 考察点\n- **时间戳驱动**：用 `now - startTime` 算进度，避免依赖固定帧间隔，切后台也不会错乱。\n- **缓动函数**：把线性进度 `t` 映射成非线性，实现加速 / 减速。\n- **可中断**：用 `cancelAnimationFrame` + 标志位，防止动画重复执行和内存泄漏。\n- **返回 Promise**：调用方可用 `await` 等待结束或中断。"
  }
]
