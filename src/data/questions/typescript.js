// TypeScript 面试题（12 题）
export const typescriptQuestions = [
  {
    id: 'ts-001',
    category: 'typescript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['基础', '类型推断', 'any'],
    question: 'TypeScript 相比 JavaScript 解决了什么问题？类型推断是什么？',
    answer: `TS 在 JS 之上加了**静态类型系统**，核心价值：

- **编译期发现错误**（如调用未定义方法、传错参数类型）
- **IDE 智能提示 / 重构安全**（改名、跳转定义）
- **可读性**：类型即文档

**类型推断**：TS 能在不显式标注时自动推导类型：

\`\`\`ts
const n = 1            // 推断为 number
let s = 'hello'       // 推断为 string
const arr = [1, 2, 3] // 推断为 number[]
function add(a: number, b: number) { return a + b } // 返回值推断 number
\`\`\`

> 原则：变量初始化、返回值等能推断处就不写冗余标注；函数**参数**必须显式标注（无法推断）。`
  },
  {
    id: 'ts-002',
    category: 'typescript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['接口', '类型别名', '区别'],
    question: 'interface 和 type 有什么区别？什么时候用哪个？',
    answer: `两者都能描述对象/联合类型，主要差异：

| 维度 | interface | type |
| --- | --- | --- |
| 扩展方式 | \`extends\` 继承 | \`&\` 交叉类型 |
| 合并声明 | ✅ 同名自动合并 | ❌ 不可重复声明 |
| 联合/元组 | 不支持 | 支持 \`A \\| B\`、\`[string, number]\` |
| 实现类 | 可被 \`implements\` | 同样可 |

\`\`\`ts
interface User { name: string }
interface Admin extends User { role: string }

type ID = string | number
type Point = [number, number]
\`\`\`

**建议**：描述对象结构、需被类实现或要声明合并 → 用 \`interface\`；联合/交叉/元组/映射类型 → 用 \`type\`。现代项目二者越来越趋同，团队统一约定即可。`
  },
  {
    id: 'ts-003',
    category: 'typescript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['泛型', '约束', 'T'],
    question: '什么是泛型？写一个带约束的泛型函数。',
    answer: `泛型让类型**参数化**，在调用时才确定具体类型，兼顾复用与类型安全。

\`\`\`ts
// 无约束
function identity<T>(value: T): T { return value }

// 约束：T 必须有 length 属性
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}
longest('abc', 'de')      // ok
longest([1, 2, 3], [4])   // ok
// longest(1, 2)          // ❌ number 没有 length
\`\`\`

常见位置：容器类（\`Array<T>\`）、工具函数、React 组件 \`props\`。约束用 \`extends\` 限制 T 的形状。`
  },
  {
    id: 'ts-004',
    category: 'typescript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['联合类型', '交叉类型', '类型收窄'],
    question: '联合类型（Union）与交叉类型（Intersection）分别是什么？',
    answer: `- **联合 \`A | B\`**：取值可以是 A **或** B（满足任一即可）
- **交叉 \`A & B\`**：同时满足 A **和** B（属性合并）

\`\`\`ts
type Status = 'loading' | 'success' | 'error'   // 联合
type User = { name: string } & { age: number }   // 交叉 => { name, age }
\`\`\`

**收窄（narrowing）**：对联合类型，用 \`typeof\` / \`in\` / 类型守卫把宽泛类型缩到具体分支：

\`\`\`ts
function format(x: string | number) {
  if (typeof x === 'string') return x.toUpperCase()  // 此处 x 是 string
  return x.toFixed(2)                                 // 此处 x 是 number
}
\`\`\`

> 交叉若含 never 或属性类型冲突会变为 \`never\`（如 \`string & number\`）。`
  },
  {
    id: 'ts-005',
    category: 'typescript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['类型守卫', 'is', 'unknown'],
    question: '什么是类型守卫（Type Guard）？typeof / instanceof / in / 自定义守卫怎么用？',
    answer: `类型守卫是**运行时检查 + 编译期收窄**的手段：

\`\`\`ts
// 1) typeof：基本类型
function f(x: string | number) { if (typeof x === 'string') x.trim() }

// 2) instanceof：类实例
if (err instanceof TypeError) err.message

// 3) in：对象属性存在
if ('swim' in animal) animal.swim()

// 4) 自定义守卫：用 is 断言
function isFish(p: Fish | Bird): p is Fish {
  return (p as Fish).swim !== undefined
}
if (isFish(pet)) pet.swim()   // 此处 pet 收窄为 Fish
\`\`\`

\`p is Fish\` 告诉编译器：若返回 true，则参数就是 Fish，从而安全调用其特有方法。`
  },
  {
    id: 'ts-006',
    category: 'typescript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['any', 'unknown', 'never', 'void'],
    question: 'any、unknown、never、void 各自的语义和适用场景？',
    answer: `| 类型 | 含义 | 场景 |
| --- | --- | --- |
| \`any\` | 关闭类型检查，可做任何操作 | 迁移旧代码、确实未知时（**尽量少用**） |
| \`unknown\` | 类型未知但**安全**：使用前必须收窄 | 替代 any，接收任意输入（如 JSON.parse 返回值） |
| \`never\` | 永不出现的值 | 函数抛出异常/死循环；穷尽检查（exhaustive） |
| \`void\` | 函数无返回值 | 回调/事件处理函数返回占位 |

\`\`\`ts
const data: unknown = JSON.parse(raw)
if (typeof data === 'object') { /* 收窄后才可用 */ }

function fail(msg: string): never { throw new Error(msg) }
// 穷尽检查
function assertNever(x: never): never { throw new Error('unexpected ' + x) }
\`\`\`

> \`unknown\` 是更安全的 \`any\`：禁止未检查就操作。`
  },
  {
    id: 'ts-007',
    category: 'typescript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['映射类型', '工具类型', 'Mapped Types'],
    question: '映射类型（Mapped Types）是什么？Pick/Omit/Record/Partial 是怎么实现的？',
    answer: `映射类型用 \`in keyof\` 遍历已有类型的键，逐个变换：

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] }
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }
type MyRecord<K extends keyof any, V> = { [P in K]: V }

interface User { id: number; name: string; age: number }
type P = MyPartial<User>   // { id?: number; name?: string; age?: number }
type R = MyRecord<'a' | 'b', number>  // { a: number; b: number }
\`\`\`

配合 **key remapping** \`{ [K in keyof T as ...]: ... }\` 还能改名（如 \`Getters<T>\` 给每个属性生成 \`getX\`）。这些是 TS 内置工具类型的实现原理。`
  },
  {
    id: 'ts-008',
    category: 'typescript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['条件类型', 'infer', '类型体操'],
    question: '条件类型（Conditional Types）和 infer 关键字怎么用？',
    answer: `条件类型形如 \`T extends U ? X : Y\`，根据类型关系二选一；\`infer\` 用于在 \`extends\` 中**推断并捕获**子类型。

\`\`\`ts
type IsString<T> = T extends string ? true : false

// 提取数组元素类型
type ElementOf<T> = T extends (infer E)[] ? E : T
type A = ElementOf<string[]>   // string

// 提取函数返回值
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never
type R = ReturnOf(() => number)  // number

// 内置工具类型实现
type MyParameters<T> = T extends (...args: infer P) => any ? P : never
\`\`\`

**分发（distributive）**：裸类型参数（如 \`T\`）在联合类型上会逐成员分发：\`type T = IsString<string | number>\` 会变成 \`true | false\`。加 \`[T]\` 包裹可关闭分发。`
  },
  {
    id: 'ts-009',
    category: 'typescript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['装饰器', 'Decorator', '实验特性'],
    question: 'TypeScript 装饰器是什么？有哪些类型（以类装饰器为例）？',
    answer: `装饰器是**在不修改原代码前提下为类/方法/属性添加行为**的语法糖，本质是接收目标做加工并返回的函数。需在 \`tsconfig\` 开 \`experimentalDecorators: true\`。

\`\`\`ts
function Log(target: any, ctx: ClassDecoratorContext) {
  console.log('装饰了类', ctx.name)
}
@Log
class UserService {}

// 方法装饰器：记录调用耗时
function Measure(_t: any, _k: string, desc: PropertyDescriptor) {
  const fn = desc.value
  desc.value = function (...args: any[]) {
    const t = Date.now(); const r = fn.apply(this, args); console.log(Date.now() - t); return r
  }
}
\`\`\`

**类型**：类装饰器、方法/访问器装饰器、属性装饰器、参数装饰器；Angular 与（旧版）NestJS 大量使用。注意 **TC39 新装饰器标准**已与 TS 旧实现不同，新版用 \`ClassDecoratorContext\` 等，迁移时需注意。`
  },
  {
    id: 'ts-010',
    category: 'typescript',
    module: 'lang',
    difficulty: 'easy',
    tags: ['.d.ts', '声明文件', '第三方'],
    question: '声明文件 .d.ts 是做什么的？如何让 TS 识别没有类型的第三方库？',
    answer: `\`.d.ts\` 只含**类型声明、不含实现**，用来给 JS 代码或第三方库补充类型信息（不会生成运行时代码）。

\`\`\`ts
// 为无类型库写声明
declare module 'legacy-lib' {
  export function doThing(input: string): number
}
\`\`\`

**来源优先级**：

1. 库自带 \`types\` / \`@types/xxx\`（如 \`@types/lodash\`）
2. 项目 \`*.d.ts\`（全局 \`declare\` 或 \`declare module\`）
3. 找不到时把 \`noImplicitAny\` 放宽或临时 \`const x: any = require('lib')\`

\`@types\` 由 DefinitelyTyped 社区维护；自己写库时可用 \`tsc --declaration\` 自动生成 \`.d.ts\`。`
  },
  {
    id: 'ts-011',
    category: 'typescript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['tsconfig', '编译', 'strict'],
    question: 'tsconfig.json 中有哪些关键配置？开启 strict 意味着什么？',
    answer: `常用配置：

- \`strict\`：一键开启一系列严格检查（\`noImplicitAny\`、\`strictNullChecks\`、\`strictPropertyInitialization\` 等）
- \`target\` / \`module\`：编译到 ES 版本与模块格式
- \`moduleResolution\`：模块解析策略（\`node\` / \`bundler\`）
- \`baseUrl\` / \`paths\`：路径别名（\`@/*\` → \`src/*\`）
- \`include\` / \`exclude\`：参与编译的文件
- \`jsx\`：\`react-jsx\`
- \`isolatedModules\`：配合 Vite/esbuild 要求每个文件可独立转译

**\`strictNullChecks\`**（strict 之一）最重要：\`null/undefined\` 不再能赋给任意类型，必须显式处理，能挡掉大量「Cannot read property of null」运行时错误。`
  },
  {
    id: 'ts-012',
    category: 'typescript',
    module: 'lang',
    difficulty: 'hard',
    tags: ['类型体操', '递归类型', '模板字面量'],
    question: 'TypeScript 4.x 的模板字面量类型（Template Literal Types）能做什么？',
    answer: `模板字面量类型可在**类型层面拼接字符串**，配合 infer 能实现强大的字符串类型推导：

\`\`\`ts
type Greet<T extends string> = \`Hello, \${T}!\`
type G = Greet<'World'>   // 'Hello, World!'

// 把 'user.name' 风格的键反转成 getter 名
type Getter<T extends string> =
  T extends \`\${infer _}\` ? \`get\${Capitalize<T>}\` : never
type M = Getter<'name'>    // 'getName'

// 实战：约束路由路径、事件名，或 DeepReadonly 递归工具类型
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
\`\`\`

这类「类型体操」适合写通用库（如类型安全的路由、i18n key 校验），业务代码里不宜过度使用以免可读性下降。`
  }
]
