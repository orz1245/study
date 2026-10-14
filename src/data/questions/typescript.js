export const typescriptQuestions = [
  {
    "id": "be-028",
    "category": "typescript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "TypeScript",
      "类型系统",
      "泛型"
    ],
    "question": "TypeScript 相比 JavaScript 有什么优势？常用类型有哪些？",
    "answer": "### TS 优势\n\n1. **类型安全**：编译时发现错误\n2. **智能提示**：IDE 自动补全更准确\n3. **代码可读性**：类型即文档\n4. **重构友好**：改类型后编译器报错引导修改\n5. **大型项目协作**：接口契约清晰\n\n### 常用类型\n\n```typescript\n// 基本类型\nlet name: string = 'Tom'\nlet age: number = 25\nlet isReady: boolean = true\n\n// 数组\nlet nums: number[] = [1, 2, 3]\nlet strs: Array<string> = ['a', 'b']\n\n// 元组\nlet tuple: [string, number] = ['Tom', 25]\n\n// 联合类型\nlet id: string | number = 123\n\n// 字面量类型\nlet status: 'idle' | 'loading' | 'success' | 'error'\n\n// 枚举\nenum Color { Red, Green, Blue }\nlet c: Color = Color.Green\n\n// any / unknown / never\nlet a: any = 1         // 不检查（避免使用）\nlet b: unknown = 1     // 安全的 any，使用前需类型检查\nfunction f(): never { throw new Error() }  // 永不返回\n\n// void\nfunction log(msg: string): void { console.log(msg) }\n```\n\n### 接口与类型别名\n\n```typescript\n// interface\ninterface User {\n  id: number\n  name: string\n  age?: number           // 可选属性\n  readonly email: string  // 只读属性\n}\n\n// type\ntype Status = 'idle' | 'loading' | 'success'\ntype Point = { x: number; y: number }\n\n// interface 可合并（声明合并）\ninterface Window { myProp: string }  // 扩展全局\n```\n\n### 泛型\n\n```typescript\n// 泛型函数\nfunction identity<T>(value: T): T {\n  return value\n}\nidentity<string>('hello')  // T = string\nidentity(123)              // 自动推断 T = number\n\n// 泛型约束\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key]\n}\nconst user = { name: 'Tom', age: 25 }\ngetProperty(user, 'name')  // string\ngetProperty(user, 'age')   // number\n\n// 泛型默认值\ninterface ApiResponse<T = any> {\n  code: number\n  data: T\n}\n\n// 泛型在类中\nclass Stack<T> {\n  private items: T[] = []\n  push(item: T) { this.items.push(item) }\n  pop(): T | undefined { return this.items.pop() }\n}\n```\n\n### 工具类型\n\n```typescript\n// Partial：所有属性可选\ntype PartialUser = Partial<User>\n// { id?: number; name?: string; age?: number; email?: string }\n\n// Required：所有属性必填\ntype RequiredUser = Required<User>\n\n// Pick：选取部分属性\ntype UserBasic = Pick<User, 'id' | 'name'>\n// { id: number; name: string }\n\n// Omit：排除部分属性\ntype UserWithoutId = Omit<User, 'id'>\n\n// Record：键值对\ntype UserMap = Record<string, User>\n\n// ReturnType：获取函数返回类型\nfunction fetchData() { return { name: 'Tom' } }\ntype Data = ReturnType<typeof fetchData>  // { name: string }\n\n// Parameters：获取函数参数类型\ntype Params = Parameters<typeof fetchData>\n\n// Awaited：获取 Promise 返回类型\ntype Result = Awaited<Promise<User>>  // User\n```\n\n### 类型断言与类型守卫\n\n```typescript\n// 类型断言\nlet el = document.querySelector('#app') as HTMLDivElement\nlet value = someValue as string\n\n// 类型守卫\nfunction process(value: string | number) {\n  if (typeof value === 'string') {\n    value.toUpperCase()  // string\n  } else {\n    value.toFixed(2)     // number\n  }\n}\n\n// instanceof\nclass Dog { bark() {} }\nclass Cat { meow() {} }\nfunction speak(animal: Dog | Cat) {\n  if (animal instanceof Dog) animal.bark()\n  else animal.meow()\n}\n\n// in\ninterface Fish { swim() }\ninterface Bird { fly() }\nfunction move(animal: Fish | Bird) {\n  if ('swim' in animal) animal.swim()\n  else animal.fly()\n}\n\n// 自定义类型守卫\nfunction isUser(obj: any): obj is User {\n  return obj && typeof obj.id === 'number' && typeof obj.name === 'string'\n}\nif (isUser(data)) {\n  data.name  // User 类型\n}\n```\n\n### 最佳实践\n- 严格模式：`\"strict\": true`\n- 避免 `any`，用 `unknown` 代替\n- 接口定义 API 响应\n- 泛型提高复用性\n- 善用工具类型"
  },
  {
    "id": "ts-001",
    "category": "typescript",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "基础",
      "类型推断",
      "any"
    ],
    "question": "TypeScript 相比 JavaScript 解决了什么问题？类型推断是什么？",
    "answer": "TS 在 JS 之上加了**静态类型系统**，核心价值：\n\n- **编译期发现错误**（如调用未定义方法、传错参数类型）\n- **IDE 智能提示 / 重构安全**（改名、跳转定义）\n- **可读性**：类型即文档\n\n**类型推断**：TS 能在不显式标注时自动推导类型：\n\n```ts\nconst n = 1            // 推断为 number\nlet s = 'hello'       // 推断为 string\nconst arr = [1, 2, 3] // 推断为 number[]\nfunction add(a: number, b: number) { return a + b } // 返回值推断 number\n```\n\n> 原则：变量初始化、返回值等能推断处就不写冗余标注；函数**参数**必须显式标注（无法推断）。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-002",
    "category": "typescript",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      "接口",
      "类型别名",
      "区别"
    ],
    "question": "interface 和 type 有什么区别？什么时候用哪个？",
    "answer": "两者都能描述对象/联合类型，主要差异：\n\n| 维度 | interface | type |\n| --- | --- | --- |\n| 扩展方式 | `extends` 继承 | `&` 交叉类型 |\n| 合并声明 | ✅ 同名自动合并 | ❌ 不可重复声明 |\n| 联合/元组 | 不支持 | 支持 `A \\| B`、`[string, number]` |\n| 实现类 | 可被 `implements` | 同样可 |\n\n```ts\ninterface User { name: string }\ninterface Admin extends User { role: string }\n\ntype ID = string | number\ntype Point = [number, number]\n```\n\n**建议**：描述对象结构、需被类实现或要声明合并 → 用 `interface`；联合/交叉/元组/映射类型 → 用 `type`。现代项目二者越来越趋同，团队统一约定即可。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-003",
    "category": "typescript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "泛型",
      "约束",
      "T"
    ],
    "question": "什么是泛型？写一个带约束的泛型函数。",
    "answer": "泛型让类型**参数化**，在调用时才确定具体类型，兼顾复用与类型安全。\n\n```ts\n// 无约束\nfunction identity<T>(value: T): T { return value }\n\n// 约束：T 必须有 length 属性\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b\n}\nlongest('abc', 'de')      // ok\nlongest([1, 2, 3], [4])   // ok\n// longest(1, 2)          // ❌ number 没有 length\n```\n\n常见位置：容器类（`Array<T>`）、工具函数、React 组件 `props`。约束用 `extends` 限制 T 的形状。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-004",
    "category": "typescript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "联合类型",
      "交叉类型",
      "类型收窄"
    ],
    "question": "联合类型（Union）与交叉类型（Intersection）分别是什么？",
    "answer": "- **联合 `A | B`**：取值可以是 A **或** B（满足任一即可）\n- **交叉 `A & B`**：同时满足 A **和** B（属性合并）\n\n```ts\ntype Status = 'loading' | 'success' | 'error'   // 联合\ntype User = { name: string } & { age: number }   // 交叉 => { name, age }\n```\n\n**收窄（narrowing）**：对联合类型，用 `typeof` / `in` / 类型守卫把宽泛类型缩到具体分支：\n\n```ts\nfunction format(x: string | number) {\n  if (typeof x === 'string') return x.toUpperCase()  // 此处 x 是 string\n  return x.toFixed(2)                                 // 此处 x 是 number\n}\n```\n\n> 交叉若含 never 或属性类型冲突会变为 `never`（如 `string & number`）。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-005",
    "category": "typescript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "类型守卫",
      "is",
      "unknown"
    ],
    "question": "什么是类型守卫（Type Guard）？typeof / instanceof / in / 自定义守卫怎么用？",
    "answer": "类型守卫是**运行时检查 + 编译期收窄**的手段：\n\n```ts\n// 1) typeof：基本类型\nfunction f(x: string | number) { if (typeof x === 'string') x.trim() }\n\n// 2) instanceof：类实例\nif (err instanceof TypeError) err.message\n\n// 3) in：对象属性存在\nif ('swim' in animal) animal.swim()\n\n// 4) 自定义守卫：用 is 断言\nfunction isFish(p: Fish | Bird): p is Fish {\n  return (p as Fish).swim !== undefined\n}\nif (isFish(pet)) pet.swim()   // 此处 pet 收窄为 Fish\n```\n\n`p is Fish` 告诉编译器：若返回 true，则参数就是 Fish，从而安全调用其特有方法。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-006",
    "category": "typescript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "any",
      "unknown",
      "never",
      "void"
    ],
    "question": "any、unknown、never、void 各自的语义和适用场景？",
    "answer": "| 类型 | 含义 | 场景 |\n| --- | --- | --- |\n| `any` | 关闭类型检查，可做任何操作 | 迁移旧代码、确实未知时（**尽量少用**） |\n| `unknown` | 类型未知但**安全**：使用前必须收窄 | 替代 any，接收任意输入（如 JSON.parse 返回值） |\n| `never` | 永不出现的值 | 函数抛出异常/死循环；穷尽检查（exhaustive） |\n| `void` | 函数无返回值 | 回调/事件处理函数返回占位 |\n\n```ts\nconst data: unknown = JSON.parse(raw)\nif (typeof data === 'object') { /* 收窄后才可用 */ }\n\nfunction fail(msg: string): never { throw new Error(msg) }\n// 穷尽检查\nfunction assertNever(x: never): never { throw new Error('unexpected ' + x) }\n```\n\n> `unknown` 是更安全的 `any`：禁止未检查就操作。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-007",
    "category": "typescript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "映射类型",
      "工具类型",
      "Mapped Types"
    ],
    "question": "映射类型（Mapped Types）是什么？Pick/Omit/Record/Partial 是怎么实现的？",
    "answer": "映射类型用 `in keyof` 遍历已有类型的键，逐个变换：\n\n```ts\ntype MyPartial<T> = { [K in keyof T]?: T[K] }\ntype MyReadonly<T> = { readonly [K in keyof T]: T[K] }\ntype MyPick<T, K extends keyof T> = { [P in K]: T[P] }\ntype MyRecord<K extends keyof any, V> = { [P in K]: V }\n\ninterface User { id: number; name: string; age: number }\ntype P = MyPartial<User>   // { id?: number; name?: string; age?: number }\ntype R = MyRecord<'a' | 'b', number>  // { a: number; b: number }\n```\n\n配合 **key remapping** `{ [K in keyof T as ...]: ... }` 还能改名（如 `Getters<T>` 给每个属性生成 `getX`）。这些是 TS 内置工具类型的实现原理。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-008",
    "category": "typescript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "条件类型",
      "infer",
      "类型体操"
    ],
    "question": "条件类型（Conditional Types）和 infer 关键字怎么用？",
    "answer": "条件类型形如 `T extends U ? X : Y`，根据类型关系二选一；`infer` 用于在 `extends` 中**推断并捕获**子类型。\n\n```ts\ntype IsString<T> = T extends string ? true : false\n\n// 提取数组元素类型\ntype ElementOf<T> = T extends (infer E)[] ? E : T\ntype A = ElementOf<string[]>   // string\n\n// 提取函数返回值\ntype ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never\ntype R = ReturnOf(() => number)  // number\n\n// 内置工具类型实现\ntype MyParameters<T> = T extends (...args: infer P) => any ? P : never\n```\n\n**分发（distributive）**：裸类型参数（如 `T`）在联合类型上会逐成员分发：`type T = IsString<string | number>` 会变成 `true | false`。加 `[T]` 包裹可关闭分发。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-009",
    "category": "typescript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "装饰器",
      "Decorator",
      "实验特性"
    ],
    "question": "TypeScript 装饰器是什么？有哪些类型（以类装饰器为例）？",
    "answer": "装饰器是**在不修改原代码前提下为类/方法/属性添加行为**的语法糖，本质是接收目标做加工并返回的函数。需在 `tsconfig` 开 `experimentalDecorators: true`。\n\n```ts\nfunction Log(target: any, ctx: ClassDecoratorContext) {\n  console.log('装饰了类', ctx.name)\n}\n@Log\nclass UserService {}\n\n// 方法装饰器：记录调用耗时\nfunction Measure(_t: any, _k: string, desc: PropertyDescriptor) {\n  const fn = desc.value\n  desc.value = function (...args: any[]) {\n    const t = Date.now(); const r = fn.apply(this, args); console.log(Date.now() - t); return r\n  }\n}\n```\n\n**类型**：类装饰器、方法/访问器装饰器、属性装饰器、参数装饰器；Angular 与（旧版）NestJS 大量使用。注意 **TC39 新装饰器标准**已与 TS 旧实现不同，新版用 `ClassDecoratorContext` 等，迁移时需注意。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-010",
    "category": "typescript",
    "module": "lang",
    "difficulty": "easy",
    "tags": [
      ".d.ts",
      "声明文件",
      "第三方"
    ],
    "question": "声明文件 .d.ts 是做什么的？如何让 TS 识别没有类型的第三方库？",
    "answer": "`.d.ts` 只含**类型声明、不含实现**，用来给 JS 代码或第三方库补充类型信息（不会生成运行时代码）。\n\n```ts\n// 为无类型库写声明\ndeclare module 'legacy-lib' {\n  export function doThing(input: string): number\n}\n```\n\n**来源优先级**：\n\n1. 库自带 `types` / `@types/xxx`（如 `@types/lodash`）\n2. 项目 `*.d.ts`（全局 `declare` 或 `declare module`）\n3. 找不到时把 `noImplicitAny` 放宽或临时 `const x: any = require('lib')`\n\n`@types` 由 DefinitelyTyped 社区维护；自己写库时可用 `tsc --declaration` 自动生成 `.d.ts`。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-011",
    "category": "typescript",
    "module": "lang",
    "difficulty": "medium",
    "tags": [
      "tsconfig",
      "编译",
      "strict"
    ],
    "question": "tsconfig.json 中有哪些关键配置？开启 strict 意味着什么？",
    "answer": "`tsconfig.json` 是 TypeScript 项目的编译与类型检查中枢，理解 **编译目标与模块解析配置** 以及 **`strict` 严格模式家族的 8 个核心子开关** 是工程化配置的重点。\n\n### 一、 现代前端工程推荐 `tsconfig.json` 完整配置模板\n\n```json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"lib\": [\"ES2023\", \"DOM\", \"DOM.Iterable\"],\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"bundler\",\n    \"verbatimModuleSyntax\": true,\n    \"isolatedModules\": true,\n    \"noEmit\": true,\n\n    /* 严格模式全家桶 */\n    \"strict\": true,\n    \"noUncheckedIndexedAccess\": true,\n    \"noImplicitOverride\": true,\n    \"noFallthroughCasesInSwitch\": true,\n    \"skipLibCheck\": true,\n    \"paths\": {\n      \"@/*\": [\"./src/*\"]\n    }\n  },\n  \"include\": [\"src\"]\n}\n```\n\n### 二、 开启 `\"strict\": true` 自动激活的 8 大核心检查项\n\n| 子开关名称 | 防御的运行时隐患与作用说明 |\n| :--- | :--- |\n| **`strictNullChecks`** | 最核心开关：将 `null` 和 `undefined` 从所有类型中剥离，强制在使用前做判空收窄，消灭 90% 的 `Cannot read properties of undefined` 线上崩溃 |\n| **`noImplicitAny`** | 禁止变量或函数参数在无法推断类型时静默退化为 `any` |\n| **`strictFunctionTypes`** | 对函数参数启用严格的**逆变（Contravariance）**检查，防止不安全的回调类型赋值 |\n| **`strictBindCallApply`** | 严格校验 `bind`、`call`、`apply` 调用时的实参类型是否与原函数签名匹配 |\n| **`strictPropertyInitialization`** | 强制 `class` 的实例属性必须在声明时或 `constructor` 构造函数内完成初始化（或显式加 `!` 断言） |\n| **`noImplicitThis`** | 当函数内部的 `this` 类型无法确定（隐式为 `any`）时直接报错 |\n| **`useUnknownInCatchVariables`** | 将 `catch (err)` 中的异常变量默认类型从 `any` 升级为更安全的 `unknown` |\n| **`alwaysStrict`** | 以严格模式解析所有源码并为编译产物自动注入 `\"use strict\"` |\n\n> **工程进阶建议**：由于 `\"strict\": true` 默认不包含数组/字典下标越界检查（即 `arr[99]` 的类型仍是 `T` 而非 `T | undefined`），强烈建议额外开启 **`\"noUncheckedIndexedAccess\": true`**，将下标访问类型强制收紧为 `T | undefined`。"
  },
  {
    "id": "ts-012",
    "category": "typescript",
    "module": "lang",
    "difficulty": "hard",
    "tags": [
      "类型体操",
      "递归类型",
      "模板字面量"
    ],
    "question": "TypeScript 4.x 的模板字面量类型（Template Literal Types）能做什么？",
    "answer": "模板字面量类型可在**类型层面拼接字符串**，配合 infer 能实现强大的字符串类型推导：\n\n```ts\ntype Greet<T extends string> = `Hello, ${T}!`\ntype G = Greet<'World'>   // 'Hello, World!'\n\n// 把 'user.name' 风格的键反转成 getter 名\ntype Getter<T extends string> =\n  T extends `${infer _}` ? `get${Capitalize<T>}` : never\ntype M = Getter<'name'>    // 'getName'\n\n// 实战：约束路由路径、事件名，或 DeepReadonly 递归工具类型\ntype DeepReadonly<T> = {\n  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]\n}\n```\n\n这类「类型体操」适合写通用库（如类型安全的路由、i18n key 校验），业务代码里不宜过度使用以免可读性下降。\n\n### TypeScript 类型系统底层机制与工程实践\n\n| 类型特性 | 编译期行为（Type Space） | 运行时行为（Value Space） |\n| :--- | :--- | :--- |\n| **类型擦除（Type Erasure）** | `interface`、`type`、泛型参数在编译期做完结构化子类型（Structural Subtyping）校验后完全擦除 | 零运行时字节码开销（`enum` 与 `namespace` 除外，现代工程推荐用 `as const` 替代 `enum`） |\n| **类型收窄（Control Flow Narrowing）** | 编译器沿 `if/switch` 分支自动收窄联合类型，未穷尽分支可赋给 `never` 触发编译期报错 | 配合自定义类型守卫（`x is Type`）保障运行时动态数据（如 API 响应）与静态类型一致 |\n\n```typescript\n// 工程实战：使用可辨识联合类型（Discriminated Unions）+ never 穷尽性检查防止漏处理分支\ntype AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error }\n\nfunction assertNever(x: never): never {\n  throw new Error(`未处理的分支状态: ${JSON.stringify(x)}`)\n}\n\nexport function formatState<T>(state: AsyncState<T>): string {\n  switch (state.status) {\n    case 'idle': return '等待开始'\n    case 'loading': return '加载中...'\n    case 'success': return `成功: ${JSON.stringify(state.data)}`\n    case 'error': return `失败: ${state.error.message}`\n    default: return assertNever(state) // 一旦新增状态而未在此处理，编译期立即报错！\n  }\n}\n```"
  },
  {
    "id": "ts-013",
    "category": "typescript",
    "difficulty": "hard",
    "question": "TypeScript 进阶特性：satisfies 运算符、TS 5.5 自动类型谓词推断与 isolatedDeclarations 并行构建优化",
    "tags": [
      "satisfies运算符",
      "类型谓词推断",
      "isolatedDeclarations",
      "TypeScript5.5",
      "类型收窄"
    ],
    "answer": "在现代 TypeScript（TS 4.9 ～ TS 5.6+）工程实践中，**`satisfies` 运算符**、**自动类型谓词推断（Inferred Type Predicates）** 与 **`isolatedDeclarations` 独立声明生成** 是解决“类型校验与字面量精确推导鱼和熊掌不可兼得”及“大型 Monorepo 类型构建慢”的三大核心特性。\n\n### 一、 为什么需要 `satisfies` 运算符？（对比 `: Type` 显式注解与 `as const`）\n\n当我们需要校验一个配置对象符合某个宽泛接口（如 `Record<string, string | [number, number, number]>`），但同时又希望保留每个属性**最精确的字面量/具体类型**以便后续直接调用字符串或数组方法时，传统 `: Type` 显式注解会把具体类型“抹平（Widen）”成联合类型：\n\n```typescript\ntype ColorValue = string | [number, number, number]\ntype ThemePalette = Record<'primary' | 'secondary', ColorValue>\n\n// ✗ 痛点：使用 : ThemePalette 显式注解会丢失属性的具体类型！\nconst badTheme: ThemePalette = {\n  primary: '#2563eb',\n  secondary: [37, 99, 235],\n}\n// badTheme.primary.toUpperCase() -> ✗ 编译报错！因为 TS 认为 primary 是 string | [number, number, number]\n\n// ✔ 破局：使用 satisfies 既严格校验键名拼写与值约束，又 100% 保留每个属性的精确推断类型！\nconst goodTheme = {\n  primary: '#2563eb',\n  secondary: [37, 99, 235],\n} satisfies ThemePalette\n\ngoodTheme.primary.toUpperCase() // ✔ 完美通过！TS 精确知道 goodTheme.primary 是 string\ngoodTheme.secondary.map((n) => n) // ✔ 完美通过！TS 精确知道 goodTheme.secondary 是元组\n```\n\n### 二、 TS 5.5+ 自动类型谓词推断（告别手写 `x is NonNullable<T>`）\n\n在 TS 5.5 之前，`[1, null, 2].filter(x => x !== null)` 的返回类型仍然是 `(number | null)[]`，必须手动写类型守卫 `(x): x is number => x !== null`。TS 5.5+ 编译器现已能自动分析函数体控制流并自动推断出类型谓词（Type Predicate）：\n\n```typescript\nconst rawList: Array<string | null | undefined> = ['vue', null, 'react', undefined]\n\n// TS 5.5+ 自动推断该箭头函数返回类型为 (item: string | null | undefined) => item is string\n// 因此 validList 的类型直接收窄为 string[]！\nconst validList = rawList.filter((item) => item != null)\n```\n\n### 三、 `isolatedDeclarations`：让 Monorepo `.d.ts` 生成提速 10 倍\n\n在大型 Monorepo 中，`tsc` 之所以慢，是因为子包 B 必须等待子包 A 完成跨文件全量类型推导生成 `.d.ts` 后才能开始检查。开启 `\"isolatedDeclarations\": true` 后，TypeScript 强制要求所有模块导出的公开函数和变量必须显式标注返回类型，从而允许 **Oxc / SWC / Babel 等极速单文件转译器无需运行 `tsc` 类型检查器，即可按单文件并行直出 `.d.ts` 声明文件**！"
  }
]
