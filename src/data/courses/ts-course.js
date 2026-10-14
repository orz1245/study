export const tsCourseMeta = {
  "id": "ts-course",
  "title": "TypeScript 类型系统入门",
  "subtitle": "类型系统值得当成一门语言来学：从最基本的注解出发，逐层深入泛型与类型体操，让 TypeScript 真正为工程质量服务。",
  "level": "入门 → 进阶",
  "icon": "🔷",
  "color": "#3178c6",
  "practiceCategory": "typescript",
  "chapters": [
    {
      "key": "start",
      "name": "第一章 · 快速上手",
      "lessons": [
        "ts-l1",
        "ts-l2"
      ]
    },
    {
      "key": "basic",
      "name": "第二章 · 类型系统基础",
      "lessons": [
        "ts-l3",
        "ts-l4",
        "ts-l5",
        "ts-l6",
        "ts-l7"
      ]
    },
    {
      "key": "adv",
      "name": "第三章 · 类型进阶",
      "lessons": [
        "ts-l8",
        "ts-l9",
        "ts-l10",
        "ts-l11",
        "ts-l12"
      ]
    },
    {
      "key": "practice",
      "name": "第四章 · 工程实践",
      "lessons": [
        "ts-l13",
        "ts-l14",
        "ts-l15"
      ]
    },
    {
      "key": "gym",
      "name": "第五章 · 类型体操实战",
      "lessons": [
        "ts-l16",
        "ts-l17",
        "ts-l18"
      ]
    },
    {
      "key": "typing",
      "name": "第六章 · 类型安全工程",
      "lessons": [
        "ts-l19",
        "ts-l20"
      ]
    }
  ]
}

export const tsLessons = [
  {
    "id": "ts-l1",
    "chapter": "start",
    "title": "TypeScript 是什么？为什么要用它",
    "minutes": 25,
    "content": "### 本节目标\n\n- 理解 TypeScript 与 JavaScript 的关系\n- 理解「类型系统」到底帮我们解决了什么痛点\n- 分清「编译期类型检查」与「运行时执行」\n\nTypeScript 是 JavaScript 的**超集（superset）**：任何合法的 JS 代码，都是合法的 TS 代码。它在 JS 之上加了一层**静态类型系统**，最终会被编译（更准确说是「转译」）回纯 JS 再运行。\n\n```text\nTS 源码（带类型标注）  --tsc / 构建工具-->  纯 JS  --Node / 浏览器-->  运行\n```\n\n类型系统主要帮我们解决三类痛点：\n\n1. **把低级错误挡在写代码阶段**：属性名拼错、给函数传了错误类型的参数，IDE 立刻标红，而不是等上线后用户报错。\n2. **工具链体验质变**：智能提示、自动补全、跳转定义、安全重构，全部建立在类型信息之上。\n3. **代码即文档**：函数签名直接表达「怎么用」，别人不用读函数体。\n\n下面这段代码**运行时其实什么都不会打印**，但它演示了「类型检查在编译期发生」这件事：\n\n```ts\n// 运行环境：需要 TypeScript（任何版本）\n// 运行 / 类型检查方式：把下面内容存为 ts-l1.ts，终端执行  npx tsc --noEmit ts-l1.ts\n// 你会看到编译器报错：Argument of type 'string' is not assignable to parameter of type 'number'\n\n// 给参数 a、b 标注了 number 类型\nfunction sum(a: number, b: number): number {\n  return a + b\n}\n\n// 故意传错类型：TS 在「写代码时」就拦住了，根本走不到运行\nsum('1', '2')\n```\n\n**关键认知**：类型检查只发生在**编译期**，编译成 JS 后类型信息会被「擦除」。所以 TS 不会让程序变慢，但也意味着**运行时出现的数据结构错误 TS 管不了**（比如接口返回的数据字段变了）。这一点是很多初学者栽跟头的地方。\n\n### 名词解释\n\n**类型（Type）**：对「这个值能是什么、能做什么」的一种描述。比如 `number` 类型表示「这是一个数字，可以做加减乘除」；`string` 表示「这是一段文字」。你可以把类型理解成给变量贴的「标签」，编译器靠这个标签判断你有没有用错。\n\n**静态类型检查（Static Type Checking）**：在代码**还没运行**的时候（写代码或编译时）就检查类型是否正确。对比「动态类型」语言（如纯 JS）要等运行时才可能报错，静态检查相当于「提前考试」，把 bug 挡在出厂前。\n\n### 课后练习\n\n**练习 1**：为什么说「TypeScript 是 JavaScript 的超集」？请举一个「合法 JS 但不依赖任何 TS 特性」的例子。\n\n> 答案：因为 TS 完全兼容 JS 语法。例如 `const x = 1; console.log(x)` 既是合法 JS，也是合法 TS——它不写任何类型标注也能通过 TS 编译。所谓「超集」就是：JS 的所有语法 TS 都认，TS 只是额外多了一套类型语法。\n\n**练习 2**：下面哪类错误 TS 能在编译期发现，哪类不能？\n（a）调用 `user.name` 但 `user` 其实是 `null`；\n（b）把 `fetch` 返回的 JSON 当成了你期望的 `{ id: number }` 结构，但其实接口返回了 `{ userId: number }`。\n\n> 答案：（a）如果你给 `user` 标注了 `User | null` 类型，TS 会强制你先判空，能在编译期发现；（b）TS 管不了。`fetch` 拿到的是运行时才确定的网络数据，类型在编译期是「猜」的——如果标注写错，TS 不会报错，这是 TS 的已知边界。\n\n### 总结\n\n我认为初学者最容易误解的一点是：以为学会 TS 就是「多写几个 `: type`」。其实 TypeScript 真正的价值不在语法，而在**它逼你和「数据的形状」较真**。当你给每个变量、每个函数参数都认真想清楚「它到底是什么」，你写的代码从根上就更不容易出 bug。但请记住：**TS 不是银弹**。它只在编译期有用，运行时的脏数据（接口返回、用户输入）仍然要靠运行时校验（如 zod）兜底。所以我的建议是：把 TS 当「编译期的好搭档」，别把它当成「运行时安全的保证书」。"
  },
  {
    "id": "ts-l2",
    "chapter": "start",
    "title": "环境搭建与 tsconfig.json 初识",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用 `tsc` 跑通第一个 TS 文件\n- 认识 `tsconfig.json` 里最常用、也最影响行为的字段\n- 搞清楚 Vite / Webpack 项目里「类型检查」和「打包」是两回事\n\n最简单的纯 Node 环境，只需要装一个 `typescript`：\n\n```bash\n# 运行环境：已安装 Node.js 16+\n# 在任意空文件夹执行：\nnpm init -y\nnpm i -D typescript\nnpx tsc --init          # 生成 tsconfig.json\nnpx tsc src/index.ts    # 把单个文件编译成 index.js\n```\n\n然后写一个能真正跑起来的文件：\n\n```ts\n// 运行环境：Node.js 16+ + typescript\n// 步骤：保存为 src/index.ts，执行  npx tsc src/index.ts  得到 src/index.js，再  node src/index.js\n// 或者直接  npx tsx src/index.ts（tsx 能直接跑 TS，无需先编译）\n\n// 一个带类型的函数\nfunction greeting(name: string): string {\n  return `Hello, ${name}`\n}\n\nconst msg = greeting('TS')\nconsole.log(msg) // 终端输出：Hello, TS\n```\n\n`tsconfig.json` 是 TS 项目的「总开关」。最影响行为的几个字段：\n\n```json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",        // 编译产物用哪个 JS 版本（影响是否降级语法）\n    \"module\": \"ESNext\",        // 用哪种模块规范（ESM / CommonJS）\n    \"strict\": true,            // 严格模式总开关，后面章节细讲，强烈建议开\n    \"moduleResolution\": \"bundler\",\n    \"outDir\": \"dist\",          // 编译产物放哪\n    \"rootDir\": \"src\",          // 源码从哪开始算\n    \"noEmitOnError\": true      // 有类型错误就不输出 JS\n  },\n  \"include\": [\"src\"]\n}\n```\n\n**一个关键认知盲区**：在 Vite 这类前端工程里，`.ts` 文件是交给 **esbuild** 转译的，esbuild **只做语法转译、不做类型检查**。类型检查是 `vue-tsc` / `tsc --noEmit` 单独干的事。所以「项目能 build 过」≠「类型没问题」。\n\n### 名词解释\n\n**tsconfig.json**：TypeScript 编译器的配置文件，告诉 `tsc`「编译哪些文件、按什么规则编译」。它就像项目的「交通规则」，没有它 `tsc` 不知道从哪下手。`include` 指定要编译的范围，`compilerOptions` 指定规则。\n\n**strict 模式**：`\"strict\": true` 是一个「总开关」，它一次性打开了一系列严格检查（`noImplicitAny`、`strictNullChecks` 等）。打开后 TS 会「更难糊弄」——很多之前默许的写法会报错。短期痛苦，长期极大提升代码质量。\n\n### 课后练习\n\n**练习 1**：把下面代码存成 `demo.ts` 并 `npx tsc --noEmit`，会报什么错？为什么？\n\n```ts\nfunction double(n: number) {\n  return n * 2\n}\ndouble('3')\n```\n\n> 答案：报 `Argument of type 'string' is not assignable to parameter of type 'number'`。因为 `double` 的参数被标注为 `number`，传入字符串 `'3'` 类型不匹配。这就是 strict 帮你拦下的典型错误。\n\n**练习 2**：为什么「Vite 项目 build 成功」不代表「类型没问题」？\n\n> 答案：Vite 默认用 esbuild 转译 TS，esbuild 为了快只去掉类型标注、不检查类型对错。类型检查需要 `tsc` / `vue-tsc` 单独跑。所以务必在 CI 或 `build` 脚本里加上 `vue-tsc --noEmit`（或 `tsc --noEmit`）做门禁。\n\n### 总结\n\n我的观点很明确：**`strict: true` 不是可选项，是必选项**。很多团队初期为了「好上手」把它关掉，结果后面写出来的 TS 和披着类型的 JS 没区别，该崩还是崩。类型系统最香的地方恰恰来自 strict 带来的强制判空、禁止隐式 any。另外请建立「检查 ≠ 构建」的心智：构建工具负责快，类型检查工具负责稳，二者要分开跑、都要跑。新手最该养成的习惯，就是每次提交前本地先 `tsc --noEmit` 一遍——这比任何 lint 规则都值钱。"
  },
  {
    "id": "ts-l3",
    "chapter": "basic",
    "title": "原始类型与类型注解",
    "minutes": 25,
    "content": "### 本节目标\n\n- 掌握 TS 的全部原始（基础）类型\n- 学会给变量、函数参数、返回值写类型注解\n- 理解「类型注解」和「类型推断」的配合\n\nTS 的原始类型基本对应 JS 的基础值：`string`、`number`、`boolean`、`null`、`undefined`、`symbol`、`bigint`，再加一个特殊的 `void`（常用于函数无返回值）。\n\n```ts\n// 运行环境：Node.js 16+ + typescript\n// 类型检查：npx tsc --noEmit ts-l3.ts\n\n// 1) 显式类型注解：用英文冒号写在变量名后面\nlet title: string = '前端学习网'\nlet count: number = 8\nlet isOnline: boolean = true\n\n// 2) 函数参数与返回值都标类型\nfunction add(a: number, b: number): number {\n  return a + b\n}\n\n// 调用时传错类型，编译器立刻报错\n// add('1', 2) // ❌ Argument of type 'string' is not assignable to 'number'\n\n// 3) 不写注解时，TS 会「推断」类型（这里推断 title2 为 string）\nlet title2 = '推断出来的字符串'\n// title2 = 123 // ❌ 推断为 string 后再赋数字会报错\n\n// 4) 特殊原始类型\nlet big: bigint = 9007199254740993n // 大整数，需要 ES2020+\nlet nothing: null = null\nlet notSet: undefined = undefined\n```\n\n**重要观念**：类型注解是「你主动告诉编译器」，类型推断是「编译器猜」。绝大多数时候你能省则省，让编译器推断；只有编译器猜不准（如函数参数、返回值、对象结构）时才显式写注解。\n\n### 名词解释\n\n**类型注解（Type Annotation）**：用 `变量名: 类型` 的语法「显式告诉 TS 这个东西应该是什么类型」。它像给变量发一张「身份证」，TS 之后就按这张证来查你。\n\n**类型推断（Type Inference）**：你不写注解时，TS 根据「初始值」自动猜出类型。比如 `let x = 5` 会被推断成 `number`。推断让代码更干净，但函数参数因为没有初始值，TS 推断不出，必须你写注解。\n\n### 课后练习\n\n**练习 1**：下面哪些行会报错？为什么？\n\n```ts\nlet a = 10\na = 'ten'\nlet b: number = 10\nb = 20\n```\n\n> 答案：第二行 `a = 'ten'` 报错。因为 `a` 没写注解，TS 从初始值 `10` 推断出 `a: number`，再赋字符串就类型冲突。`b` 显式标注 `number`，后面赋 `20` 合法。\n\n**练习 2**：写一个函数 `formatPrice`，接收 `number` 价格，返回带 `¥` 的字符串，并标注完整类型。\n\n> 答案：\n> ```ts\n> function formatPrice(price: number): string {\n>   return `¥${price.toFixed(2)}`\n> }\n> ```\n\n### 总结\n\n我的看法是：**类型注解要用在「边界」上，而不是处处都写**。函数的参数、返回值、对外暴露的接口，是最该写注解的地方——因为它们是「你和调用方之间的契约」。而函数内部的局部变量，交给推断更省心，代码也更易读。新手常犯两个极端：要么全不写（失去 TS 意义），要么每行都写（啰嗦且掩盖推断能力）。把握好「边界写、内部省」这个度，TS 才算真正用顺了。"
  },
  {
    "id": "ts-l4",
    "chapter": "basic",
    "title": "数组、元组与枚举",
    "minutes": 25,
    "content": "### 本节目标\n\n- 掌握数组的两种标注方式\n- 理解「元组」和普通数组的区别及适用场景\n- 搞懂 `enum` 是什么、什么时候用、有什么坑\n\n**数组**有两种写法，等价：\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l4.ts\nlet nums: number[] = [1, 2, 3]\nlet nums2: Array<number> = [1, 2, 3] // 泛型写法，和上一行等价\n\n// 数组里放错类型直接报错\n// nums.push('x') // ❌ Argument of type 'string' is not assignable to 'number'\n```\n\n**元组（Tuple）**是「长度固定、每个位置类型已知」的数组，适合表达「有明确结构的一对小值」：\n\n```ts\n// 表示「用户名 + 年龄」这样一对固定结构\nlet user: [string, number] = ['Laowen', 30]\n// user = ['Laowen']        // ❌ 少一个元素报错\n// user = [30, 'Laowen']    // ❌ 顺序错了也报错\n\n// 实际应用：React 的 useState 返回的就是 [值, 设值函数] 元组\nfunction useFakeState<T>(init: T): [T, (v: T) => void] {\n  let value = init\n  const setter = (v: T) => { value = v }\n  return [value, setter]\n}\nconst [name, setName] = useFakeState('guest')\nconsole.log(name) // guest\n```\n\n**枚举（enum）**给一组相关常量起名字：\n\n```ts\n// 用 enum 表达「订单状态」\nenum OrderStatus {\n  Pending = 'pending',\n  Paid = 'paid',\n  Shipped = 'shipped',\n}\nconst status: OrderStatus = OrderStatus.Paid\nconsole.log(status) // 'paid'\n```\n\n⚠️ **坑**：`enum` 在编译后会生成一段「运行时代码」（不是纯类型），而且默认数字枚举会「反向映射」。现代 TS 更推荐用 `as const` 对象或联合类型替代枚举（见下一节），更轻量、更透明。\n\n### 名词解释\n\n**元组（Tuple）**：一种「定长且每格类型固定」的数组。普通数组 `number[]` 要求每个元素都是 number 且个数不限；元组 `[string, number]` 要求「第 0 个是 string、第 1 个是 number、且只有 2 个」。它适合表达「成对出现的结构化数据」，好比一张两列的表格的一行。\n\n**枚举（Enum）**：把一组「有意义的名字」映射到「值」的工具，让代码里不出现魔法字符串/数字。比如用 `OrderStatus.Paid` 比直接写 `'paid'` 更安全、更易读。但要记住它会在运行时真实存在。\n\n### 课后练习\n\n**练习 1**：用元组表示一个「经纬度坐标 `[number, number]`」，并写一个函数判断它是否在原点。\n\n> 答案：\n> ```ts\n> type Point = [number, number]\n> function isOrigin(p: Point): boolean {\n>   return p[0] === 0 && p[1] === 0\n> }\n> ```\n\n**练习 2**：既然 `enum` 有运行时开销，如何用「联合类型 + as const」表达订单状态更安全？\n\n> 答案：\n> ```ts\n> const OrderStatus = {\n>   Pending: 'pending',\n>   Paid: 'paid',\n>   Shipped: 'shipped',\n> } as const\n> type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus] // 'pending' | 'paid' | 'shipped'\n> ```\n\n### 总结\n\n我认为元组是被低估的类型：凡是「两个或三个相关值、且位置有意义」的场景（坐标、键值对、useState 返回值），用元组比用对象更简洁，而且解构赋值读起来很舒服。至于枚举，我的态度是**能不用就不用**——数字枚举的反向映射和运行时体积常常带来惊喜（贬义）。现在社区主流做法是用 `as const` 对象 + 从它推导出的联合类型，零运行时成本、IDE 提示还一样好。只有在和既有 JS/第三方库强绑定时，才退而用 `enum`。"
  },
  {
    "id": "ts-l5",
    "chapter": "basic",
    "title": "对象类型与接口 interface",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用「内联对象类型」和 `interface` 描述对象结构\n- 区分 `interface` 与 `type` 的取舍\n- 掌握「可选属性 `?`」「只读属性 `readonly`」\n\n描述一个对象长什么样，最直观是「内联写法」：\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l5.ts\n\n// 内联对象类型：直接写在注解位置\nfunction printUser(user: { name: string; age: number }): void {\n  console.log(`${user.name} / ${user.age}`)\n}\nprintUser({ name: 'Laowen', age: 30 })\n```\n\n但当结构要复用时，用 `interface` 给它起个名字：\n\n```ts\n// 用 interface 定义「用户」结构，全项目复用\ninterface User {\n  name: string\n  age: number\n  email?: string      // ? 表示可选：可以有也可以没有\n  readonly id: number // readonly：创建后不能改\n}\n\nconst u: User = { name: 'A', age: 20, id: 1 }\n// u.id = 2            // ❌ Cannot assign to 'id' because it is read-only\n// const u2: User = { name: 'B', id: 2 } // ❌ 缺少必填的 age\n\nfunction greet(user: User): string {\n  return `Hi ${user.name}`\n}\n```\n\n`interface` 和 `type` 大部分场景等价，区别在：**`interface` 可以「声明合并」**（同名的 interface 会自动合并字段），`type` 更灵活（能描述联合、元组、基础类型别名）。经验法则：描述「对象/类结构」优先 `interface`；做类型运算（联合、交叉、映射）用 `type`。\n\n```ts\n// type 能做到 interface 做不到的：\ntype ID = string | number          // 联合\ntype Point = { x: number; y: number }\ntype Point3D = Point & { z: number } // 交叉，合并出三维点\n```\n\n### 名词解释\n\n**接口（interface）**：给「对象的形状」起的名字。它只描述「这个对象应该有哪些字段、各是什么类型」，不关心值从哪来。你可以把它理解成「对象的体检表」——TS 拿它去核对每个对象合不合格。\n\n**可选属性（?）/ 只读属性（readonly）**：`age?: number` 表示「这个字段可能缺席」，访问前要判空；`readonly id` 表示「出生时定好、之后不能再改」，编译期保护你不被意外覆盖。它们都是从「代码意图」层面帮你少犯错。\n\n### 课后练习\n\n**练习 1**：定义一个 `Book` 接口，含 `title`（必填 string）、`author`（必填 string）、`year`（可选 number），并写一个函数返回书名。\n\n> 答案：\n> ```ts\n> interface Book {\n>   title: string\n>   author: string\n>   year?: number\n> }\n> function getTitle(b: Book): string { return b.title }\n> ```\n\n**练习 2**：`interface` 和 `type` 在描述对象时最大的「能力差异」是什么？\n\n> 答案：`interface` 支持同名声明合并（多次声明同名字段会合并），适合被第三方扩展（如给 `Window` 加字段）；`type` 能做联合、交叉、映射类型等类型运算，表达能力更强。描述纯对象结构时二者几乎等价。\n\n### 总结\n\n我的观点：`interface` 和 `type` 之争在团队里常常被过度讨论，其实**90% 的场景二者随便选都不会错**。我个人的默认是——凡是「描述一个东西长什么样」（对象、类）就用 `interface`，因为可读性更好、能被合并；凡是「做类型层面的计算」（联合、交叉、提取）才用 `type`。比「选哪个」更重要的是：**给复用三次以上的结构起名字**，别让 `{ name: string; age: number }` 这种内联类型在代码里复制粘贴十遍——那才是真正拖慢维护的坏习惯。"
  },
  {
    "id": "ts-l6",
    "chapter": "basic",
    "title": "函数类型：参数、返回值与重载",
    "minutes": 30,
    "content": "### 本节目标\n\n- 完整标注函数参数、返回值、可选参数、默认参数\n- 理解「函数类型」本身如何表达（变量存函数时）\n- 了解函数重载（overload）解决什么问题\n\n函数类型标注涵盖：参数类型、返回值类型、可选 `?`、默认参数。\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l6.ts\n\n// 完整标注：参数 + 返回值\nfunction divide(a: number, b: number): number {\n  return a / b\n}\n\n// 可选参数用 ?；默认参数自带「可选」语义且能推断类型\nfunction greet(name: string, prefix = 'Hello'): string {\n  return `${prefix}, ${name}`\n}\ngreet('Tom')        // 'Hello, Tom'\ngreet('Tom', 'Hi')  // 'Hi, Tom'\n\n// 把「函数」本身存进变量时，要写「函数类型」\ntype MathFn = (x: number, y: number) => number\nconst add: MathFn = (x, y) => x + y\nconsole.log(add(1, 2)) // 3\n```\n\n**函数重载**：同一个函数根据参数不同返回不同类型。TS 用「多个声明 + 一个实现」表达：\n\n```ts\n// 重载签名（只声明，不实现）\nfunction reverse(x: string): string\nfunction reverse(x: number): number\n// 实现签名（真正逻辑，参数要兼容上面所有声明）\nfunction reverse(x: string | number): string | number {\n  if (typeof x === 'string') return x.split('').reverse().join('')\n  return Number(String(x).split('').reverse().join(''))\n}\nconst r1 = reverse('abc')  // 推断为 string -> 'cba'\nconst r2 = reverse(123)    // 推断为 number -> 321\n```\n\n### 名词解释\n\n**函数类型（Function Type）**：函数在 TS 里也是一种「值」，所以它也有类型——长这样 `(参数) => 返回值`。当你把函数塞进变量、当参数传、当返回值返回时，就要用函数类型去描述它。它相当于「函数的身份证」，说明「这个函数长啥样、能吃啥、吐啥」。\n\n**函数重载（Overload）**：允许一个函数名根据「传入参数不同」表现出不同行为/返回不同类型。TS 的重载是「编译期的假象」——运行时只有一个实现，但编译期 TS 会按你写的多个签名分别检查调用是否合法。\n\n### 课后练习\n\n**练习 1**：写一个 `createId` 函数，传入 `string` 返回大写 ID，传入 `number` 返回字符串化 ID，用重载实现。\n\n> 答案：\n> ```ts\n> function createId(input: string): string\n> function createId(input: number): string\n> function createId(input: string | number): string {\n>   return String(input).toUpperCase()\n> }\n> ```\n\n**练习 2**：默认参数 `function f(a = 1)` 中 `a` 的类型被推断成什么？\n\n> 答案：推断为 `number`，因为默认值 `1` 是 number；同时 `a` 自动成为可选参数，调用 `f()` 合法。\n\n### 总结\n\n我觉得函数类型是 TS 里「性价比最高」的知识点之一：一旦你习惯给「回调函数」「事件处理器」「高阶函数」标函数类型，编辑器提示会准得吓人，重构也敢下手。至于重载，我的态度是**别滥用**——它主要解决「同一个 API 因参数不同而语义不同」的场景（如 `reverse`）。如果你的函数只是「参数可选」，用 `?` 或联合类型往往更直白；硬上重载反而让实现签名变得难读。记住：重载是给「调用方」看的友好界面，不是给「实现」增加难度的。"
  },
  {
    "id": "ts-l7",
    "chapter": "basic",
    "title": "联合、交叉与字面量类型",
    "minutes": 25,
    "content": "### 本节目标\n\n- 用联合类型 `A | B` 表达「多种可能」\n- 用交叉类型 `A & B` 合并结构\n- 理解字面量类型与「字面量收窄」\n\n**联合类型**表示「值可以是这些类型之一」：\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l7.ts\n\n// 一个值可能是 string 也可能是 number\nfunction formatId(id: string | number): string {\n  return `ID:${id}`\n}\nformatId('a1')   // OK\nformatId(100)    // OK\n\n// 字面量联合：比「string」更精确，只允许这几个值\ntype Direction = 'up' | 'down' | 'left' | 'right'\nfunction move(dir: Direction): void {\n  console.log(`move ${dir}`)\n}\nmove('up')     // OK\n// move('top') // ❌ Argument of type '\"top\"' is not assignable to 'Direction'\n```\n\n**交叉类型**把多个结构「合并」成一个拥有全部字段的类型：\n\n```ts\ntype HasName = { name: string }\ntype HasAge = { age: number }\ntype Person = HasName & HasAge // 同时拥有 name 和 age\nconst p: Person = { name: 'Tom', age: 18 }\n```\n\n**字面量类型 + 收窄**：TS 会根据「运行时的判断」自动把宽泛类型收窄成具体类型，这叫「类型守卫」：\n\n```ts\nfunction print(v: string | number): void {\n  if (typeof v === 'string') {\n    console.log(v.toUpperCase()) // 这里 v 被收窄为 string，能用字符串方法\n  } else {\n    console.log(v.toFixed(2))    // 这里 v 被收窄为 number\n  }\n}\n```\n\n### 名词解释\n\n**联合类型（Union）**：「或」的关系，写法是 `A | B`，表示「这个值要么是 A，要么是 B」。它精准表达了现实里大量「不一定」的情况（比如接口字段可能是 `string | null`）。比一刀切写 `any` 安全太多。\n\n**字面量类型（Literal Type）**：把「具体的值」当类型用，如 `'up'` 这个字符串本身就是一种类型（不是泛指 string）。配合联合 `'up' | 'down'` 能做出「只允许这几个固定值」的枚举级约束，是 TS 强大的来源之一。\n\n### 课后练习\n\n**练习 1**：定义类型 `Theme = 'light' | 'dark'`，写一个 `applyTheme` 函数，非法的主题要编译报错。\n\n> 答案：\n> ```ts\n> type Theme = 'light' | 'dark'\n> function applyTheme(t: Theme): void { console.log(t) }\n> applyTheme('light') // OK；applyTheme('blue') 报错\n> ```\n\n**练习 2**：`type A = { x: number }; type B = { x: string }; type C = A & B`，`C` 的 `x` 是什么类型？为什么？\n\n> 答案：`C` 的 `x` 是 `number & string`，即「既是 number 又是 string」——这是不可能的空类型（never 的近亲）。说明交叉了两个「同名字段但类型冲突」的结构会得到不可能满足的类型，编译期就会提示矛盾。\n\n### 总结\n\n我的观点：联合类型是「诚实」的类型——它逼你承认「这里可能不止一种情况」，从而逼你在代码里 `if` 判断处理每种可能，这正是少 bug 的核心。交叉类型则像「拼乐高」，把小结构组合成大结构，特别适合「配置对象 + 必填项」这类场景。但要警惕：交叉类型遇到「同名字段类型冲突」会产生不可能类型，这往往是你设计出错的信号，而不是 TS 的 bug。善用字面量联合替代魔数字符串，是我能给新手最有用的一个建议——它几乎零成本却能让一整类拼写错误消失。"
  },
  {
    "id": "ts-l8",
    "chapter": "adv",
    "title": "类型推断与类型断言",
    "minutes": 25,
    "content": "### 本节目标\n\n- 理解 TS 在哪些地方会自动推断\n- 掌握类型断言 `as` 的写法与「何时该用、何时危险」\n- 区分 `as` 与「非空断言 `!`」\n\nTS 推断能力很强：变量初始化、返回值、解构都能推断。\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l8.ts\n\n// 推断：从初始值推出 number\nconst n = 42\n// 推断：从返回值推出 string\nfunction getName() { return 'Tom' }\n\n// 类型断言 as：你比编译器更清楚类型时，主动「告诉」它\nconst input = document.getElementById('name') as HTMLInputElement\n// 上面若不加 as，getElementById 返回的是 HTMLElement | null，没有 .value\nconsole.log(input.value)\n\n// 断言的另一种写法（JSX 里只能用 as，避免和泛型语法冲突）\nconst val = (<HTMLInputElement>document.getElementById('name')).value\n```\n\n⚠️ **危险信号**：`as` 是「你向编译器保证没错」，编译器不再检查。乱用 `as` 会把类型系统的保护全关掉。\n\n```ts\n// 非空断言 !：告诉编译器「这里绝对不是 null/undefined」\nfunction first<T>(arr: T[]): T {\n  return arr[0]! // 你保证数组非空；若实际为空，运行时直接崩\n}\n```\n\n**原则**：能不用断言就不用；非用不可时，优先用「类型守卫」替代 `as`（见 ts-l12）。\n\n### 名词解释\n\n**类型断言（Type Assertion，`as`）**：相当于你对编译器说「相信我，我知道它实际是什么类型」。它只在编译期改变 TS 的看法，运行时什么都不做、不做任何转换。就像给编译器戴上一副你指定的眼镜，但眼镜不会真的改变物体本身。\n\n**非空断言（Non-null Assertion，`!`）**：`x!` 表示「我保证 `x` 不是 `null`/`undefined`」。它是 `as` 的一个特例，专治「可能为空的变量」。风险极高：一旦你保证错了，运行时就是真正的 `TypeError`。\n\n### 课后练习\n\n**练习 1**：下面哪行用了断言后可能运行时崩溃？\n\n```ts\nconst el = document.querySelector('.btn') as HTMLButtonElement\nel.click()\n```\n\n> 答案：如果页面上根本没有 `.btn` 这个元素，`querySelector` 返回 `null`，`as` 强行当成按钮，调 `.click()` 会在运行时抛 `Cannot read properties of null`。正确做法是用 `if (el) el.click()` 守卫，而不是断言。\n\n**练习 2**：`as` 和类型转换（如 `Number('1')`）有什么本质区别？\n\n> 答案：`as` 只是编译期的「看法调整」，零运行时开销、不改变值；`Number('1')` 是真正的运行时转换，把字符串变成数字。很多人把 `as` 误当成「转换」，这是大坑。\n\n### 总结\n\n我的态度很鲜明：**`as` 和 `!` 是「逃生舱」，不是「日常交通工具」**。每写一次断言，你就亲手拆掉了一块 TS 的安全护栏。我见过太多项目因为滥用 `as any` 把整个 TS 价值归零。正确顺序是：先尝试用类型守卫、泛型、精确标注来解决；实在绕不过（比如接第三方库、DOM 查询）才用 `as`，而且窄到最小范围。非空断言 `!` 我几乎从不主动写——它等于在赌运行时，而赌运气的代码最不可靠。"
  },
  {
    "id": "ts-l9",
    "chapter": "adv",
    "title": "泛型基础：让函数「通吃」多种类型",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解「泛型」解决什么问题\n- 掌握函数、接口、类型的泛型写法 `<T>`\n- 写出一个能「通吃类型又不丢类型」的通用函数\n\n没有泛型时，想写「返回第一个元素」会丢失类型信息：\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l9.ts\n\n// 不用泛型：返回 any，调用方拿不到元素真实类型，TS 保护失效\nfunction firstBad(arr: any[]): any {\n  return arr[0]\n}\n\n// 用泛型 <T>：T 是「占位类型」，调用时由实参推断\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0]\n}\nconst a = first([1, 2, 3])      // T 推断为 number，a: number | undefined\nconst b = first(['x', 'y'])     // T 推断为 string\nconst c = first([{ id: 1 }])    // T 推断为 { id: number }\nconsole.log(a, b, c)\n```\n\n泛型也能用在 `interface` / `type` 上，做出「参数化的容器」：\n\n```ts\n// 一个「可能有值、可能加载中、可能出错」的通用状态\ninterface RemoteData<T> {\n  loading: boolean\n  data: T | null\n  error: string | null\n}\nconst userState: RemoteData<{ name: string }> = {\n  loading: false,\n  data: { name: 'Tom' },\n  error: null,\n}\n```\n\n**一句话理解泛型**：它让类型「也变成参数」。就像函数参数让「值」可变，泛型让「类型」可变——于是你写一次逻辑，能安全服务无数种类型。\n\n### 名词解释\n\n**泛型（Generics）**：把「类型」也变成函数/接口的参数。写法 `<T>` 里的 `T` 是个占位符（Type 的缩写），调用时才被具体类型替换。它解决的问题是：既要「复用同一段逻辑」，又要「保留每种调用具体的类型信息」。没有它，你只能退回 `any`，丢掉全部类型安全。\n\n**类型参数（Type Parameter）**：`<T>`、`<T, U>` 里的 `T`、`U` 就叫类型参数。约定俗成 `T`=第一个、`U`=第二个、`K`=键、`V`=值、`R`=返回值。它们和函数参数一样，本质是把「未知」推迟到调用时决定。\n\n### 课后练习\n\n**练习 1**：写一个泛型函数 `last<T>(arr: T[]): T | undefined` 返回最后一个元素。\n\n> 答案：\n> ```ts\n> function last<T>(arr: T[]): T | undefined {\n>   return arr[arr.length - 1]\n> }\n> ```\n\n**练习 2**：为什么 `first([1,2,3])` 返回类型不是 `number` 而是 `number | undefined`？\n\n> 答案：因为空数组 `[]` 也合法，`arr[0]` 可能取不到，所以 TS 诚实地把「可能不存在」也编进类型。这恰恰是 TS 比人靠谱的地方——它逼你想「数组为空怎么办」。\n\n### 总结\n\n泛型是 TS 从「能写」跨到「写得好」的分水岭。我的观点：新手不要被 `<T>` 吓到，它本质就是「类型的参数」——你早就会函数的 `x` 参数了，`T` 只是把同一个思想搬到类型维度。最大的收益是：**泛型函数既通用又不丢类型**。以前为了复用只能写 `any`，调用方得到一堆 `any` 等于自废武功；泛型让你「一次编写，处处保留具体类型」。建议从 `first`/`last`/`identity` 这种小工具练手，体会「T 由调用方决定」的感觉，再去看标准库 `Array.map` 的签名就会豁然开朗。"
  },
  {
    "id": "ts-l10",
    "chapter": "adv",
    "title": "泛型约束、默认与条件类型入门",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用 `extends` 给泛型加约束\n- 给泛型设默认类型\n- 初识「条件类型」`T extends U ? X : Y`\n\n**约束 `extends`**：限制 T「至少得长这样」，否则不让你传不相关的类型。\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l10.ts\n\n// 要求 T 必须有 length 属性（如 string、数组）\ninterface HasLength { length: number }\nfunction logLength<T extends HasLength>(v: T): T {\n  console.log(v.length)\n  return v\n}\nlogLength('hello') // string 有 length，OK\nlogLength([1, 2, 3]) // 数组有 length，OK\n// logLength(123)    // ❌ number 没有 length\n\n// 默认类型：不传 T 时用兜底\ninterface ApiResp<T = unknown> {\n  code: number\n  data: T\n}\nconst r1: ApiResp = { code: 0, data: null }      // data 是 unknown\nconst r2: ApiResp<string> = { code: 0, data: 'ok' }\n```\n\n**条件类型**：类型层面的「三元表达式」，根据类型关系选不同结果。\n\n```ts\n// 如果 T 是数组，取出元素类型；否则原样返回\ntype ElementOf<T> = T extends (infer E)[] ? E : T\ntype A = ElementOf<number[]> // number\ntype B = ElementOf<string>   // string\n```\n\n这里的 `infer` 表示「让 TS 自己推断这里用什么类型」。`infer` 是类型体操的标配，后面章节会大量用到。\n\n### 名词解释\n\n**泛型约束（extends on generics）**：给类型参数套上「最低门槛」，写法 `<T extends 某结构>`。意思是「T 可以是任意类型，但必须满足这个结构」。它解决了「泛型太自由导致内部用不了某些属性」的问题——约束后你就能在泛型函数里放心访问 `v.length` 之类的字段。\n\n**条件类型（Conditional Type）**：类型世界的 `条件 ? 真 : 假`，写法 `T extends U ? X : Y`。它让类型能「根据别的类型动态变化」，是高级类型运算（类型体操）的发动机。`infer` 则是「在条件类型里捕获某个未知类型」的关键字。\n\n### 课后练习\n\n**练习 1**：写泛型 `merge<T extends object>(a: T, b: T): T` 合并两个对象。\n\n> 答案：\n> ```ts\n> function merge<T extends object>(a: T, b: T): T {\n>   return { ...a, ...b }\n> }\n> ```\n\n**练习 2**：`type NotNull<T> = T extends null | undefined ? never : T`，求 `NotNull<string | null>`。\n\n> 答案：`string`。因为联合类型会「逐个分发」到条件类型上：`string extends null|undefined` 为假 → `string`；`null extends ...` 为真 → `never`；合并得 `string | never` = `string`。\n\n### 总结\n\n泛型约束和默认类型，是让泛型「既灵活又安全」的两道保险。我的看法：`extends` 约束不是限制自由，而是**划出你能安全使用的边界**——没有它，你在泛型函数体里连 `v.length` 都不敢用，因为编译器不知道 `v` 有没有。条件类型则是「类型编程」真正的开关，初学时觉得绕很正常，关键是记住它和 `?:` 三元长得像、想得也一样。我建议别一上来就钻 `infer` 黑魔法，先把「约束 + 默认」用熟，等你需要「根据输入类型算输出类型」时，条件类型会自然成为你的工具。"
  },
  {
    "id": "ts-l11",
    "chapter": "adv",
    "title": "keyof、索引访问与映射类型",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用 `keyof` 拿到对象的所有键\n- 用「索引访问类型」`T[K]` 取字段类型\n- 用「映射类型」批量改造对象类型的字段\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l11.ts\n\ninterface User { id: number; name: string; age: number }\n\n// keyof：把「所有键」变成一个联合类型\ntype UserKeys = keyof User // 'id' | 'name' | 'age'\n\n// 索引访问类型 T[K]：取「K 这个键对应的值类型」\ntype UserId = User['id']   // number\nfunction getField<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key] // 返回值类型精确跟随 key\n}\nconst u: User = { id: 1, name: 'Tom', age: 18 }\nconst idVal = getField(u, 'id')   // 推断为 number\nconst nameVal = getField(u, 'name') // 推断为 string\n\n// 映射类型：遍历键，批量改造\ntype ReadonlyUser = {\n  readonly [K in keyof User]: User[K]\n}\n// 等价于把所有字段都加 readonly\nconst ru: ReadonlyUser = { id: 1, name: 'Tom', age: 18 }\n// ru.id = 2 // ❌ readonly\n```\n\n`[K in keyof T]` 读作「对 T 的每个键 K」，这就是「映射类型」——像 for 循环一样遍历键并生成新结构。`Partial<T>`、`Required<T>`、`Readonly<T>` 这些内置工具类型，底层全是映射类型。\n\n### 名词解释\n\n**keyof**：「取键运算符」。`keyof User` 得到 `'id' | 'name' | 'age'` 这样的「键的联合类型」。它让你可以「在类型层面谈论对象的属性名」，是做通用工具类型的基石。\n\n**映射类型（Mapped Type）**：用 `[K in keyof T]` 语法「遍历一个类型的所有键，对每个键做同样改造」并生成新类型。类比：它是类型层面的 `for...of`。TS 内置的 `Partial`/`Readonly`/`Record` 都是它的产物——你写的映射类型能复用这种「批量改造」能力。\n\n### 课后练习\n\n**练习 1**：用映射类型写一个 `Nullable<T>`，把 T 每个字段都变成 `原类型 | null`。\n\n> 答案：\n> ```ts\n> type Nullable<T> = { [K in keyof T]: T[K] | null }\n> ```\n\n**练习 2**：`User['name' | 'age']` 是什么类型？\n\n> 答案：`string | number`。索引访问类型支持「传入键的联合」，结果就是「对应值类型的联合」。\n\n### 总结\n\n`keyof` + 索引访问 + 映射类型，合起来就是 TS 的「反射三件套」。我的观点：这是从「会用 TS」跃迁到「会造 TS 工具」的关键一跃。一旦你理解「键也能当成类型来运算」，很多重复的类型定义就能写成一个通用映射类型——比如全项目要加 `readonly`、`Partial`、或把所有字段改成可选，一行映射类型搞定，改一处全局生效。新手常卡在「`[K in keyof T]` 到底在干嘛」，我的记忆法是：把 `K` 想象成循环变量，`T[K]` 想象成「当前这个字段的类型」，整个结构就是「对每个字段做同样的事」。"
  },
  {
    "id": "ts-l12",
    "chapter": "adv",
    "title": "typeof、类型守卫与判别联合",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用 `typeof` 从「值」反推「类型」\n- 写自定义类型守卫 `isXXX`\n- 用「判别联合」让 TS 自动收窄分支\n\n**`typeof` 类型运算符**：从已有的值/变量推出它的类型，避免重复定义。\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l12.ts\n\nconst config = { timeout: 3000, retry: true }\ntype Config = typeof config // { timeout: number; retry: boolean }\n// 以后 config 改了字段，Config 自动跟着变，不用手写两遍\n```\n\n**自定义类型守卫**：返回值标注成 `参数 is 类型`，调用后 TS 会在 `if` 里自动收窄。\n\n```ts\ninterface Dog { kind: 'dog'; bark(): void }\ninterface Cat { kind: 'cat'; meow(): void }\ntype Animal = Dog | Cat\n\n// 守卫函数：返回 `v is Dog` 后，if 内 v 自动变 Dog\nfunction isDog(v: Animal): v is Dog {\n  return v.kind === 'dog'\n}\nfunction speak(a: Animal): void {\n  if (isDog(a)) a.bark() // 这里 a 被收窄为 Dog\n  else a.meow()          // 这里 a 是 Cat\n}\n```\n\n**判别联合（Discriminated Union）**：用一个「共同的可辨识字段」（如 `kind`）让 TS 精准区分联合成员——上面的 `Animal` 就是判别联合。`kind` 叫「判别属性」。\n\n### 名词解释\n\n**类型守卫（Type Guard）**：一个「返回值是 `x is T`」的函数。它告诉 TS：「如果我返回 true，那参数就是 T 类型」。调用它进入 `if` 分支后，TS 立刻把变量收窄成 T，于是你能用 T 的专属方法。它是「替代 `as` 断言」最安全的手段。\n\n**判别联合（Discriminated Union）**：一组联合类型，每个成员都带一个「相同的、字面量类型的标识字段」（如 `kind: 'dog'`）。有了它，TS 看到 `if (x.kind === 'dog')` 就能精确定位到对应成员，自动给全部分支正确类型。它是处理「多种形状数据」最优雅的模式。\n\n### 课后练习\n\n**练习 1**：写一个 `isString(v): v is string` 守卫并演示使用。\n\n> 答案：\n> ```ts\n> function isString(v: unknown): v is string {\n>   return typeof v === 'string'\n> }\n> function len(v: unknown) {\n>   if (isString(v)) return v.length // 这里 v 是 string\n>   return 0\n> }\n> ```\n\n**练习 2**：判别联合里「判别属性」必须满足什么条件？\n\n> 答案：必须是「字面量类型的联合」（如 `'dog' | 'cat'`），且每个联合成员都有这个同名字段。这样 TS 才能靠比较字面量值精确区分成员。\n\n### 总结\n\n类型守卫 + 判别联合，是我心中「告别 `as` 断言」的两把利器。我的观点非常明确：处理联合类型时，**永远优先用判别联合，而不是 `as` 强转**。判别联合妙在它把「类型的区分」编码进了「数据的形状」——你写一个 `kind` 字段，TS 就终身帮你盯着每个分支。自定义守卫则适合「判别属性不好加」的legacy 场景（比如接第三方数据）。这两者共同的目标只有一个：**让 TS 在编译期就替你走完所有 `if` 分支**，而不是把这些判断推给运行时去崩。"
  },
  {
    "id": "ts-l13",
    "chapter": "practice",
    "title": "类、继承与修饰器",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用 `class` 写类型 + 实现，理解 `implements` 与 `extends`\n- 掌握 `public / private / protected / readonly`\n- 初识「修饰器（Decorator）」做什么\n\nTS 的 class 同时是「类型」和「运行时代码」。\n\n```ts\n// 运行环境：Node.js 16+ + typescript（需开启 experimentalDecorators 或 TS 5.0+）；\n// 运行：npx tsc ts-l13.ts && node ts-l13.js\n\n// 用 interface 约束「类必须实现哪些方法」\ninterface Logger {\n  log(msg: string): void\n}\n\nclass FileLogger implements Logger {\n  private filePath: string // private：仅类内部可见\n  constructor(path: string) {\n    this.filePath = path\n  }\n  log(msg: string): void {\n    console.log(`[${this.filePath}] ${msg}`)\n  }\n}\n\n// 继承：复用 + 扩展\nclass TimestampLogger extends FileLogger {\n  log(msg: string): void {\n    super.log(`[${new Date().toISOString()}] ${msg}`)\n  }\n}\n\nconst logger = new TimestampLogger('app.log')\nlogger.log('启动') // [app.log] [2026-...] 启动\n```\n\n**修饰器**（TS 5 稳定特性）是「贴在类/方法上的注解」，编译期/运行期增强行为：\n\n```ts\n// 一个「方法耗时统计」修饰器\nfunction measure(target: any, key: string, desc: PropertyDescriptor) {\n  const fn = desc.value\n  desc.value = function (...args: any[]) {\n    const t = Date.now()\n    const r = fn.apply(this, args)\n    console.log(`${key} 耗时 ${Date.now() - t}ms`)\n    return r\n  }\n}\nclass Calc {\n  @measure\n  heavy(): number { return 1 + 1 }\n}\nnew Calc().heavy() // 打印耗时\n```\n\n### 名词解释\n\n**类（class）**：TS 里 class 同时身兼两职：既是「运行时创建对象的蓝图」（new 出实例），又是「类型」（能当注解用）。`implements` 表示「这个类承诺实现某个接口的所有成员」；`extends` 表示「继承另一个类，复用它的能力」。\n\n**修饰器（Decorator）**：一种「贴在类/属性/方法上的标签」，用来在不改动原代码的前提下给它加功能（日志、缓存、校验等）。它本质是「编译期/运行期的包裹函数」。NestJS、Angular 大量用它，是 TS 工程化的标志性特性。\n\n### 课后练习\n\n**练习 1**：写 `Animal` 基类（有 `name` 和 `eat()`），`Dog` 继承它并新增 `bark()`。\n\n> 答案：\n> ```ts\n> class Animal {\n>   constructor(public name: string) {}\n>   eat(): void { console.log(`${this.name} 吃`) }\n> }\n> class Dog extends Animal {\n>   bark(): void { console.log('汪') }\n> }\n> ```\n\n**练习 2**：`private` 和「不写修饰符（默认 public）」有什么区别？\n\n> 答案：默认 `public`，类外也能访问；`private` 仅在类内部可访问，类外访问会编译报错，是 TS 编译期的访问限制（运行时仍是普通属性）。`protected` 则允许子类访问、禁止外部。\n\n### 总结\n\n我的观点：TS 的 class 让「面向对象」在前端有了类型保障，但请记住**前端其实没那么需要继承**。很多初学者一上来就 `extends` 一大串，结果耦合得改不动。我的经验法则是：**能用组合（把小对象拼起来）就别用继承**；只有「确实是『是一种（is-a）』关系且要复用行为」才继承。修饰器则是「横切关注点」（日志、权限、缓存）的利器，能显著减少重复包裹代码，但别为了炫技而加——每个修饰器都要解决一个真实重复问题。最后提醒：`private` 只是编译期约定，不是运行时加密，别拿它当安全边界。"
  },
  {
    "id": "ts-l14",
    "chapter": "practice",
    "title": "模块、命名空间与 .d.ts 声明文件",
    "minutes": 30,
    "content": "### 本节目标\n\n- 理解 ESM `import/export` 在 TS 里的类型处理\n- 搞懂「声明文件 `.d.ts`」是干嘛的\n- 会为一个没有类型的 JS 库写最小声明\n\nTS 项目里 `import` 时，TS 会去「找类型」：优先找 `.ts`，没找到就找同名 `.d.ts`。\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l14.ts\n\n// 正常导入带类型的模块\nimport { sum } from './math' // 若 math.ts 导出 sum:number，这里就有提示\n\n// 给「没有类型的第三方 JS」补一个声明文件：math.d.ts\n// 内容示例（放在被导入文件同目录或 @types 下）：\n// declare function legacyAdd(a: number, b: number): number\n// declare module 'legacy-lib' { export function legacyAdd(a: number, b: number): number }\n```\n\n`.d.ts` 是「只有类型、没有实现」的文件，专门描述「某个 JS 长什么样」，让 TS 能给无类型库补上提示。\n\n```ts\n// 自己写的最简声明：告诉 TS 全局有个 formatDate 函数\ndeclare function formatDate(ts: number): string\n// 之后任何地方调用 formatDate 都有类型检查（实现由运行时 JS 提供）\n```\n\n**模块 vs 命名空间**：现代 TS 一律用 ES Module（`import/export`）；`namespace` 是老写法，新项目几乎不用，别碰。\n\n### 名词解释\n\n**声明文件（.d.ts）**：一种「只写类型、不写逻辑」的特殊文件。它像是给某个 JS 库的「说明书」：告诉 TS「这个库导出了什么、各长啥类型」。有了它，你 `import` 一个纯 JS 库也能享受类型提示。社区把常用库的声明集中放在 `@types/*` 包里（如 `@types/lodash`）。\n\n**模块（Module / ESM）**：用 `import`/`export` 把代码拆成「可复用、作用域隔离」的小文件。TS 原生支持 ES Module，`import` 时自动解析类型。它是现代前端组织的基石，替代了老式的「全局变量」和 `namespace`。\n\n### 课后练习\n\n**练习 1**：一个 JS 库只导出 `function slugify(s){...}`，怎么给它写 `.d.ts`？\n\n> 答案：新建 `slugify.d.ts`，写 `declare function slugify(s: string): string; export = slugify;`（或 `export default function slugify(s: string): string`）。之后 TS 就能识别它。\n\n**练习 2**：TS 导入一个模块时，类型解析的优先级是怎样的？\n\n> 答案：先找同名的 `.ts` 实现文件；找不到再找同名 `.d.ts` 声明；若是第三方包，还会查 `node_modules/@types/<包名>` 和包内 `types` 字段指向的 `.d.ts`。都不存在就报「找不到模块/类型」。\n\n### 总结\n\n我的看法：`.d.ts` 是 TS 生态能「兼容整个 JS 世界」的秘密武器——它让你既能用海量无类型 JS 库，又不丢了类型安全。新手最容易怕它，其实最小声明只要 `declare` 几行就能救命。关于 `namespace`，我的建议是**新代码一律不写**：它是 ES Module 普及前的过渡方案，现在用 `import/export` 既标准又清爽，工具链支持也最好。最后提醒：装第三方库时顺手 `npm i -D @types/xxx` 几乎成了肌肉记忆——类型提示的体验差距，用过就回不去。"
  },
  {
    "id": "ts-l15",
    "chapter": "practice",
    "title": "实战：写一个类型安全的 API 客户端",
    "minutes": 35,
    "content": "### 本节目标\n\n- 把前面学的接口、泛型、判别联合串起来\n- 写一个「请求有类型、响应有类型、错误也能区分」的 API 客户端\n- 体会 TS 在真实业务里的价值\n\n我们用泛型 + 判别联合做一个「类型安全」的 fetch 封装：\n\n```ts\n// 运行环境：Node.js 18+ + typescript；类型检查 npx tsc --noEmit ts-l15.ts\n// 说明：下面代码用浏览器/Node18 的 fetch；运行时直接跑需网络，类型部分不依赖网络\n\n// 统一的响应结构（判别联合：用 ok 字段区分成功/失败）\ntype ApiResult<T> =\n  | { ok: true; data: T }\n  | { ok: false; error: string }\n\n// 通用请求函数：传入「响应数据类型 T」，返回对应 ApiResult<T>\nasync function getJSON<T>(url: string): Promise<ApiResult<T>> {\n  try {\n    const res = await fetch(url)\n    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }\n    const data = (await res.json()) as T // 这里 as 是必要的：网络数据是 unknown\n    return { ok: true, data }\n  } catch (e) {\n    return { ok: false, error: String(e) }\n  }\n}\n\n// 使用示例：定义接口返回结构\ninterface User { id: number; name: string }\nasync function main() {\n  const r = await getJSON<User>('https://api.example.com/user/1')\n  if (r.ok) {\n    console.log(r.data.name) // 这里 data 是 User，有提示\n  } else {\n    console.error(r.error)    // 这里走错误分支\n  }\n}\n```\n\n注意：网络返回的是「运行时数据」，TS 只能「猜」成 `T`（用 `as`），真正的校验还需 `zod` 这类运行时库。但**至少调用方拿到了整齐的 `r.ok ? data : error` 分支**，不会漏处理错误。\n\n### 名词解释\n\n**判别联合实战（Result 类型）**：用 `{ ok: true; data } | { ok: false; error }` 这种结构，把「成功/失败」编码进类型。调用方必须 `if (r.ok)` 才能拿到 `data`，于是「忘了处理错误」在编译期就不可能发生。这是 Rust 的 `Result`、Go 的 `(值, err)` 思想在 TS 里的落地。\n\n**泛型封装（Generic Wrapper）**：把「变化的部分」（这里是响应数据类型 `T`）抽成泛型参数，于是 `getJSON<User>`、`getJSON<Order>` 复用同一套逻辑却各自保留精确类型。这是泛型最经典的实战价值。\n\n### 课后练习\n\n**练习 1**：如果 `getJSON` 不返回判别联合，而直接 `return data`，会有什么隐患？\n\n> 答案：调用方拿到的「可能是数据也可能是 undefined/抛错」，TS 无法强制你判空/判错，很容易写出 `data.name` 在失败时崩的代码。判别联合强制 `if (r.ok)` 才能用 `data`，把错误处理变成「编译期义务」。\n\n**练习 2**：为什么网络 JSON 仍需 `as T` 或运行时校验，TS 不能直接保证？\n\n> 答案：因为接口返回的是运行时字符串，TS 编译期不知道它真实结构。TS 只能「按你声明的 T 去理解」，但「声明是否和真实数据一致」需要 `zod` 等运行时校验来保证。`as` 是信任声明，`zod` 是验证声明。\n\n### 总结\n\n这一节是前面所有知识的「阅兵式」。我的核心观点：**TS 在业务里最大的价值，不是「写类型时爽」，而是「逼你把错误的可能性和数据的形状都显式建模出来」**。`ApiResult<T>` 这种判别联合，把「网络可能失败」从「藏在心里的事」变成「编译器盯着你的事」。新手常觉得「包一层 Result 好啰嗦」，但当你的接口从 1 个涨到 100 个、线上事故从「偶发白屏」变成「编译期就拦下」，你会感谢这层啰嗦。顺便强调：`as T` 只是信任，真要稳请用 `zod` 在边界做运行时校验——TS 管编译期，zod 管边界，各司其职。"
  },
  {
    "id": "ts-l16",
    "chapter": "gym",
    "title": "类型体操（一）：元组翻转与长度",
    "minutes": 35,
    "content": "### 本节目标\n\n- 理解「类型体操」到底在解决什么真实问题\n- 掌握元组相关的几个基础类型：`Length`、`First`、`Last`、`Reverse`\n- 会一步一步手推「递归条件类型」的展开过程，而不是背答案\n- 顺手攒一个「元组工具箱」：`Push` / `Unshift` / `Concat` / `TupleToUnion`\n\n#### 1. 为什么需要类型体操？\n\n先说清楚动机。假设你在写一个通用工具 `get`，它从数组里按索引取值：\n\n```ts\nfunction get<T extends any[]>(arr: T, i: number) {\n  return arr[i]\n}\n```\n\n`arr[i]` 的返回类型在 TS 里只能推断成 `T[number]`（所有元素类型的联合）。但如果 `T` 是 `[string, number]`，你取第 0 个明明是 `string`、取第 1 个明明是 `number`——「按位置精确取值」这件事，普通写法做不到，必须在**类型层面**根据索引算出结果类型。这就是类型体操的用武之地：它让你在编译期「算」出更精准的类型。\n\n一句话：类型体操 = 把原本要在运行时用代码做的运算，搬到类型层面提前算好，让编译器帮你查错。\n\n#### 2. 取元组长度：`Length<T>`\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l16.ts\n\n// 元组的 length 是一个具体的数字字面量类型\ntype Length<T extends readonly any[]> = T['length']\n\ntype L1 = Length<[1, 2, 3]>        // 3\ntype L2 = Length<[]>               // 0\n```\n\n关键点：`T['length']` 之所以能拿到字面量 `3`，是因为**元组（tuple）记录了每个位置的类型和总长度**，而普通数组 `number[]` 的 `length` 只是 `number`。试一下：\n\n```ts\ntype A = [string, number]['length'] // 2（字面量）\ntype B = string[]                  // 普通数组没有固定长度\n```\n\n所以 `Length` 只在元组上有意义——这也提醒我们：类型体操很多能力都依赖「元组」这个既有固定长度、又能被 `[infer Head, ...infer Tail]` 拆解的结构。\n\n#### 3. 翻转元组：`Reverse<T>`（重点）\n\n先放一个「新手常见错误版本」，看看它为什么不对：\n\n```ts\n// 辅助：取最后一个\ntype Last<T extends readonly any[]> =\n  T extends [...any[], infer L] ? L : never\n\n// ❌ 错误示范：试图一次性「把最后一个搬到最前」\ntype ReverseBad<T extends readonly any[]> =\n  T extends [infer First, ...infer Rest]\n    ? [Last<Rest>, First]   // 只搬一次，剩余部分 Rest 没继续处理！\n    : []\n```\n\n这个版本只对长度为 2 的元组「看起来对」，长度更长就丢数据。正确思路是**递归头插**：每次把「头」拿出来，放到「已翻转的尾巴」结果的前面。\n\n```ts\n// ✅ 正确版：每次把 Head 放到「Reverse(Tail) 的结果」后面\ntype Reverse<T extends readonly any[]> =\n  T extends [infer Head, ...infer Tail]\n    ? [...Reverse<Tail>, Head]\n    : []\n\ntype R1 = Reverse<[1, 2, 3]> // [3, 2, 1]\ntype R2 = Reverse<[]>        // []\n```\n\n**手推一遍 `Reverse<[1, 2, 3]>` 的展开过程**（这是最重要的能力，一定要自己推）：\n\n```text\nReverse<[1, 2, 3]>\n= [...Reverse<[2, 3]>, 1]            // Head=1, Tail=[2,3]\n= [...[...Reverse<[3]>, 2], 1]       // Head=2, Tail=[3]\n= [...[...[...Reverse<[]>, 3], 2], 1] // Head=3, Tail=[]\n= [...[...[...[], 3], 2], 1]         // Reverse<[]> = []\n= [...[...[3], 2], 1]\n= [...[3, 2], 1]\n= [3, 2, 1]\n```\n\n你发现没有：这就是类型层面的「循环」——靠 `T extends [infer Head, ...infer Tail]` 不断「剥头」，把 `Tail` 越剥越短，直到 `T` 变成 `[]`（递归基线，返回空元组）。每一层都把刚刚剥下的 `Head` 追加到结果末尾。\n\n#### 4. 顺手攒一个「元组工具箱」\n\n搞懂了递归套路，下面几个都是同一种思维，抄一遍就熟：\n\n```ts\n// 取第一个\ntype First<T extends readonly any[]> =\n  T extends [infer H, ...any[]] ? H : never\n\n// 取最后一个\ntype Last<T extends readonly any[]> =\n  T extends [...any[], infer L] ? L : never\n\n// 头部追加（类似 Array.unshift）\ntype Unshift<T extends readonly any[], V> = [V, ...T]\n\n// 尾部追加（类似 Array.push）\ntype Push<T extends readonly any[], V> = [...T, V]\n\n// 拼接两个元组（类似 Array.concat）\ntype Concat<A extends readonly any[], B extends readonly any[]> =\n  [...A, ...B]\n\n// 弹出最后一个（返回去掉末位的元组）\ntype Pop<T extends readonly any[]> =\n  T extends [...infer Rest, any] ? Rest : []\n\n// 把元组「摊平」成联合类型：[string, number] -> string | number\ntype TupleToUnion<T extends readonly any[]> =\n  T extends [infer H, ...infer R] ? H | TupleToUnion<R> : never\n```\n\n其中 `TupleToUnion` 很妙：它利用了**分布式条件类型**——`H | TupleToUnion<R>` 在递归展开时把每个元素「或」起来。你会在很多库（比如把 `keyof` 的结果做成联合）里见到这种写法。\n\n#### 5. 两个高频坑\n\n- **`readonly` 元组**：`Reverse<readonly [1, 2, 3]>` 会报错，因为 `readonly` 元组不能赋值给非 `readonly` 约束。解决办法是约束里写 `readonly any[]`（返回值 `[...Reverse<Tail>, Head]` 本身就兼容 readonly），这样 `Reverse<readonly [1,2,3]>` 也能正常工作。\n- **无限递归**：如果递归条件永远不收敛（比如 `Tail` 没变短），`tsc` 会报 `Type instantiation is excessively deep`。写递归类型时务必确认「每次递归参数都比上一层更小」，否则直接爆栈。\n\n### 名词解释\n\n**类型体操（Type Gymnastics）**：在「类型层面」写出的递归/条件运算，比如翻转元组、提取字段。它不改变运行时行为，只在编译期推导出更精准的类型。像健身一样练思维，所以叫「体操」。著名题库 `type-challenges` 就是一堆这类题目，分 easy/medium/hard。\n\n**infer**：条件类型里的「捕获关键字」。`T extends [infer Head, ...infer Tail]` 意思是「如果 T 能拆成『一个头 + 剩余尾巴』，就把头和尾巴的类型分别捕获到 `Head`、`Tail` 里」。它让类型能「拆包取值」，是类型递归的核心工具。\n\n**元组（Tuple） vs 数组（Array）**：元组是「长度固定、每个位置类型可不同」的数组（如 `[string, number]`），数组是「长度任意、元素同类型」（如 `number[]`）。类型体操大量依赖元组的「固定长度 + 可拆解」特性。\n\n### 课后练习\n\n**练习 1**：写 `First<T>` 取元组第一个元素。\n\n> 答案：\n> ```ts\n> type First<T extends readonly any[]> = T extends [infer H, ...any[]] ? H : never\n> ```\n\n**练习 2**：`Reverse<[]>` 是什么？为什么？\n\n> 答案：`[]`。递归基线：`T` 不匹配 `[Head, ...Tail]`（即空了），返回 `[]`，正确结束，不会无限递归。\n\n**练习 3**：写 `Concat<[1, 2], [3, 4]>` 让它得到 `[1, 2, 3, 4]`。\n\n> 答案：\n> ```ts\n> type Concat<A extends readonly any[], B extends readonly any[]> = [...A, ...B]\n> type C = Concat<[1, 2], [3, 4]> // [1, 2, 3, 4]\n> ```\n\n**练习 4**：`TupleToUnion<[1, 'a', true]>` 的结果是什么？\n\n> 答案：`1 | 'a' | true`（三个元素类型被「或」在一起）。提示：回顾分布式条件类型的展开。\n\n### 总结\n\n我的态度很实在：**类型体操是「思维训练」不是「日常必用」**。99% 的业务代码用不到 `Reverse<T>`，但练它的价值在于——当你哪天要写一个通用工具类型（比如「把后端蛇形字段转成前端驼峰」），你脑子里已经有「递归 + infer + 条件分发」这套肌肉记忆，不至于卡死。我建议把它当「智力操」每周刷两题（type-challenges 的 easy 起步），但**绝不在业务代码里炫技**：能用一个 `Pick`/`Map` 解决的问题，绝不手搓二十行递归类型。可读性永远优先于聪明。"
  },
  {
    "id": "ts-l17",
    "chapter": "gym",
    "title": "类型体操（二）：DeepReadonly 与递归映射",
    "minutes": 35,
    "content": "### 本节目标\n\n- 写一个「深层只读」类型 `DeepReadonly<T>`\n- 理解「递归映射类型」如何像 DFS 一样穿透嵌套对象\n- 顺手掌握它的几个兄弟：`DeepPartial` / `DeepRequired` / `Mutable`\n- 看清递归映射的边界（函数、数组、原始值、特殊内建对象）\n\n#### 1. `Readonly` 只防第一层\n\nTS 内置的 `Readonly<T>` 长这样：\n\n```ts\ntype Readonly<T> = {\n  readonly [K in keyof T]: T[K]\n}\n```\n\n它只让**第一层**字段只读。一旦对象嵌套，内层照样能改：\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l17.ts\n\ninterface Config {\n  db: { host: string; port: number }\n  debug: boolean\n}\ntype R = Readonly<Config>\nconst c: R = { db: { host: 'localhost', port: 5432 }, debug: false }\n// c.debug = true          // ❌ 第一层只读\n// c.db.host = '127.0.0.1' // ✅ 竟然还能改！内层没被保护\n```\n\n要让 `db.host` 也只读，就得「钻进嵌套对象递归处理」。\n\n#### 2. `DeepReadonly`：递归映射\n\n```ts\n// 递归映射：对每个字段，如果是「对象」就继续 DeepReadonly，否则加 readonly\ntype DeepReadonly<T> = {\n  readonly [K in keyof T]: T[K] extends object\n    ? T[K] extends Function\n      ? T[K]            // 函数本身不递归（避免把方法也 readonly 包裹出错）\n      : DeepReadonly<T[K]>\n    : T[K]\n}\n```\n\n**手推一遍 `DeepReadonly<Config>` 的展开**（重点看内层怎么被包住）：\n\n```typescript\nDeepReadonly<Config>\n=> {\n     readonly db: DeepReadonly<{ host: string; port: number }>  // db 是对象，递归\n     readonly debug: boolean                                    // 原始值，直接 readonly\n   }\n// 继续展开 db 那一层：\nDeepReadonly<{ host: string; port: number }>\n=> {\n     readonly host: string   // 原始值\n     readonly port: number   // 原始值\n   }\n// 最终：db.host / db.port 全部 readonly\n```\n\n这就完成了「逐层 DFS（深度优先遍历）+ 每层套 readonly」。对象的嵌套层级再深，也会被一层层钻进去锁死。\n\n#### 3. 它的几个兄弟类型\n\n同一种「递归映射」套路，换个动作就是另一个工具类型：\n\n```ts\n// 深层可选（每个字段及其子字段都变 ?）\ntype DeepPartial<T> = {\n  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]\n}\n\n// 深层必填（反向操作）\ntype DeepRequired<T> = {\n  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]\n}\n\n// 把 readonly 去掉（让不可变数据重新可变，常用来「拷贝后修改」）\ntype Mutable<T> = {\n  -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K]\n}\n```\n\n注意 `-?` 和 `-readonly` 这两个写法：映射类型里加 `-` 前缀就能「去掉」可选 / 只读修饰符，是 `Required`/`Mutable` 的实现核心。\n\n#### 4. 边界：哪些该递归、哪些该跳过\n\n`DeepReadonly` 里那句 `T[K] extends object ? ... : T[K]` 看似简单，其实藏着几个判断：\n\n- **为什么排除 `Function`？** 函数是「可调用的值」，不是「可遍历的属性容器」。若不排除，递归会把函数也当对象处理，导致 `() => void` 被错误地变成 `readonly (() => void)` 这类无意义甚至报错的形态。排除函数保证只处理「数据对象」。\n- **数组也是 `object`**：`T[K] extends object` 对数组同样成立，所以 `DeepReadonly` 会连数组元素一起锁死——这通常是你想要的（整个数据结构不可变）。如果你只想锁对象、放行数组，需要额外判断 `T[K] extends any[]`。\n- **`Date` / `Map` / `Set` 等特殊对象**：它们也是 `object`，递归进去会破坏其内部结构。工业级实现通常会加白名单跳过这些内建类型。\n\n#### 5. 实战：冻结一份配置\n\n```ts\nconst baseConfig: DeepReadonly<Config> = {\n  db: { host: 'localhost', port: 5432 },\n  debug: false,\n}\n// baseConfig.db.host = '1.2.3.4' // ❌ 编译期直接拦下，杜绝运行时误改\n```\n\n前端拿到「全局状态 / 配置」后常希望它不可被随意修改，`DeepReadonly` 把「不可变」变成硬约束而非口头约定。\n\n### 名词解释\n\n**递归映射类型（Recursive Mapped Type）**：在 `[K in keyof T]` 的「字段值」处再次调用自己（`DeepReadonly<T[K]>`），从而一层层钻进嵌套对象。它等价于对对象做「深度优先遍历」并在每层套上 `readonly`。是处理「嵌套结构批量改造」的终极手段。\n\n**`-?` 与 `-readonly` 修饰符**：映射类型里，`?` 表示可选、`readonly` 表示只读；前缀加 `-` 即可「移除」该修饰（`-?` 去可选 = `Required` 的核心，`-readonly` 去只读 = `Mutable` 的核心）。这是 TS 给映射类型的「反向开关」。\n\n**DeepReadonly 的应用场景**：前端拿到「全局状态 / 配置」后常希望它不可被随意修改，避免意外副作用。`DeepReadonly` 能在编译期禁止任何层级的赋值，把「不可变」变成硬约束而非口头约定。\n\n### 课后练习\n\n**练习 1**：写 `DeepPartial<T>`：把每一层字段都变成可选。\n\n> 答案：\n> ```ts\n> type DeepPartial<T> = {\n>   [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]\n> }\n> ```\n\n**练习 2**：为什么 `DeepReadonly` 里要单独排除 `Function`？\n\n> 答案：函数是「可调用的值」而非「可遍历的属性容器」。若不排除，递归会把函数也当对象处理，导致 `() => void` 被错误地变成 `readonly (() => void)` 这类无意义甚至报错的形态。排除函数保证只处理「数据对象」。\n\n**练习 3**：写 `Mutable<T>` 把任意深度的 `readonly` 全部去掉。\n\n> 答案：\n> ```ts\n> type Mutable<T> = {\n>   -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K]\n> }\n> ```\n\n**练习 4**：`DeepReadonly` 会连数组元素一起锁死，这总是你想要的吗？什么场景你可能**不**希望数组被递归？\n\n> 答案：通常是想要的（整个结构不可变）。但如果你希望「外层配置对象只读、内层是一个允许被替换 / 追加的数组」，就该在 `T[K] extends object` 里额外排除 `any[]`（即 `T[K] extends any[] ? T[K] : ...`），让数组保持原样。\n\n### 总结\n\n递归映射类型是「映射类型」的完全体。我的观点：它非常适合表达「不可变数据」「深合并配置」这类需求，但**写的时候一定要像上面那样处理边界（函数、数组、特殊内建对象），否则递归会咬到自己**。新手最容易写出「对 Function 也递归」导致类型爆掉。另一个经验：这类深度类型推导很吃编译性能，对象嵌套超过 5 层就要警惕 `tsc` 变慢。所以我的建议是——`DeepReadonly`/`DeepPartial` 这类工具类型「写好一次、全项目复用」即可，业务里直接 import，别每个文件手搓一遍。"
  },
  {
    "id": "ts-l18",
    "chapter": "gym",
    "title": "类型体操（三）：Promisify 与函数类型运算",
    "minutes": 35,
    "content": "### 本节目标\n\n- 写一个「把回调风格函数变成 Promise 风格」的类型 `Promisify<F>`\n- 综合运用「函数类型 + 条件类型 + infer」拆装函数签名\n- 认识一组 TS 内置的函数类型运算：`Parameters` / `ReturnType` / `ConstructorParameters` / `InstanceType`\n- 收尾：类型体操的能力边界\n\n#### 1. 问题：回调 → async/await\n\nNode 老 API 大量用回调：`(id, cb: (err, res) => void) => void`。我们要推导它的 Promise 版本返回类型——也就是「去掉最后一个回调参数，返回 `Promise<res>`」：\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l18.ts\n\ntype NodeFn = (id: number, cb: (err: Error | null, res: string) => void) => void\n// 期望推导成： (id: number) => Promise<string>\n```\n\n#### 2. `Promisify` 的拆解思路\n\n我们要做三件事：① 用 `infer` 把整个参数元组抓出来；② 去掉最后一个（回调）；③ 从回调签名里抠出 `res` 类型。\n\n```ts\n// 取「去掉最后一个」的参数（剥掉 cb）\ntype RemoveLast<T extends any[]> =\n  T extends [...infer Rest, any] ? Rest : []\n\n// cb 是 (err, res) => void，取 res（最后一个参数）\ntype LastCbResult<T extends any[]> =\n  T extends [...any[], (err: any, res: infer R) => void] ? R : never\n\n// Promisify：把 (...args, cb) => void 变成 (...args) => Promise<res>\ntype Promisify<F> =\n  F extends (...args: infer Args) => void\n    ? (...args: RemoveLast<Args>) => Promise<LastCbResult<Args>>\n    : never\n\ntype P = Promisify<NodeFn> // (id: number) => Promise<string> ✅\n```\n\n**手推一遍**（以 `NodeFn` 为例）：\n\n```typescript\nArgs = [number, (err, res) => void]        // infer 抓出整个参数元组\nRemoveLast<Args> = [number]                // 剥掉最后一个（回调）\nLastCbResult<Args> = string                // 从回调 (err, res)=>void 抠出 res\n=> (...args: [number]) => Promise<string>\n=> (id: number) => Promise<string>\n```\n\n这里把「函数参数用 `infer` 拆开、用条件类型重组」玩到了极致：`RemoveLast` 剥参数，`LastCbResult` 从回调签名里抠 `res`。\n\n#### 3. 一组内置函数类型运算\n\n你刚才手搓的 `Promisify`，底层用的思想 TS 早就封装好了。认识这几个内置工具类型，能省大量手搓：\n\n```ts\ntype Fn = (a: string, b: number) => boolean\n\ntype P0 = Parameters<Fn>        // [string, number]   参数元组\ntype R0 = ReturnType<Fn>        // boolean            返回值\ntype C0 = ConstructorParameters<typeof Date> // [number?] 构造函数的参数\ntype I0 = InstanceType<typeof Date>          // Date      实例类型\n\n// 用内置工具改写一个简化版 Promisify（只处理 res 无 err 的回调）\ntype PromisifySimple<F> =\n  F extends (cb: (res: infer R) => void) => void\n    ? () => Promise<R>\n    : never\n```\n\n`Parameters<T>` 本质是 `T extends (...args: infer A) => any ? A : never`；`ReturnType<T>` 本质是 `T extends (...args: any) => infer R ? R : never`。你写的 `Promisify` 其实就是这两个内置类型的「组合定制版」。\n\n#### 4. 进阶玩法：柯里化（Curry）\n\n函数类型运算不止 Promise 化，还能「把一个多参函数变成一连串单参函数」：\n\n```ts\n// Curry：把 (a, b, c) => R 变成 (a) => (b) => (c) => R\ntype Curry<F> =\n  F extends (...args: infer A) => infer R\n    ? A extends [infer H, ...infer Rest]\n      ? Rest extends []\n        ? (h: H) => R                 // 只剩一个参数，直接返回 R\n        : (h: H) => Curry<(...args: Rest) => R>\n      : () => R\n    : never\n\ndeclare function add(a: number, b: number, c: number): number\ntype CurriedAdd = Curry<typeof add> // (a: number) => (b: number) => (c: number) => number\n```\n\n这个例子综合了「参数元组拆解 + 递归返回函数」，是函数类型运算里比较烧脑的一类，但思路依然是「infer 拆开、条件类型重组」。\n\n#### 5. 能力边界（重要）\n\n类型体操再强，也**只能描述「应该是什么」，不能替你写运行时代码**。比如 `Promisify` 推导出了 `(id: number) => Promise<string>`，但真正把回调包成 Promise 还得靠 `util.promisify`（Node 自带）或你手写的包装函数。类型层算出来的签名，要由运行时实现去兑现。\n\n### 名词解释\n\n**函数类型运算**：把「函数的参数、返回值」当类型拆开再拼装。配合 `infer Args`（捕获参数元组）、条件类型，你能凭一个旧函数类型「推导出」它的变种（Promise 版、柯里化版、节流版……）。这是类型体操里最烧脑也最实用的一类。\n\n**Parameters / ReturnType**：TS 内置的两个函数类型运算工具。`Parameters<F>` 抓出参数元组，`ReturnType<F>` 抓出返回值。它们本质是「用 `infer` 在函数的 `(...args) => R` 结构里分别捕获 `args` 和 `R`」。几乎所有函数变换类型都建立在它们之上。\n\n**Promisify 的意义**：Node 旧 API 大量用回调 `(err, res)`，而现代代码用 `async/await`。`Promisify` 类型让你「包装函数时，返回类型自动变成 Promise」，调用方无需手动标注。TS 内置的 `Parameters<T>`、`ReturnType<T>` 就是这类运算的现成工具。\n\n### 课后练习\n\n**练习 1**：用内置 `Parameters<T>` 和 `ReturnType<T>` 改写 `Promisify` 的简化版（只处理无 err 的回调）。\n\n> 答案：\n> ```ts\n> type PromisifySimple<F> =\n>   F extends (cb: (res: infer R) => void) => void\n>     ? () => Promise<R>\n>     : never\n> ```\n\n**练习 2**：`Promisify` 类型推导再强，能保证运行时真的返回 Promise 吗？\n\n> 答案：不能。类型只描述「应该是什么」，真正把回调包成 Promise 要靠运行时代码（如 `util.promisify`）。类型体操负责「让调用方拿到正确类型」，实现得另外写。\n\n**练习 3**：用 `ReturnType` 写出「取一个函数的返回值类型」的式子（不要用 `infer` 手写，直接用内置工具）。给定 `type F = () => { ok: boolean }`，求结果类型。\n\n> 答案：`ReturnType<F>` → `{ ok: boolean }`。内置工具已经帮你 infer 好了，这就是用现成工具比手搓省事的地方。\n\n**练习 4**：`Curry` 在「只剩一个参数」时为什么直接返回 `R` 而不是继续 `(h: H) => ...`？\n\n> 答案：因为递归基线应该是「参数用完了」。当 `Rest` 为空数组（`[]`）时，说明没有更多参数要柯里化，直接返回原函数的最终返回值 `R` 即可；否则会多包一层无意义的 `(h) => R`。\n\n### 总结\n\n这一节是类型体操的「结业礼」，综合了函数类型、infer、条件分发。我的观点很明确：**这类高级类型「能推导」不代表「该手写」**。实际项目里 `util.promisify`（Node 自带）和库里的现成类型已经覆盖了 99% 场景，你很少需要手搓 `Promisify`。但练它的意义在于——你从此读懂了标准库 `Parameters`/`ReturnType`/`ThisParameterType` 的实现，也拥有了「当业务真需要定制函数变换类型时」的能力。一句话收尾类型体操：**它是锋利的刀，用在通用工具库里是神兵，用在业务组件里是自找麻烦**。"
  },
  {
    "id": "ts-l19",
    "chapter": "typing",
    "title": "strict 模式全解：把隐患挡在编译期",
    "minutes": 30,
    "content": "### 本节目标\n\n- 搞懂 `strict` 打开后具体有哪些子选项生效\n- 理解 `strictNullChecks` 为什么是最重要的一项\n- 学会「逐步开启 strict」的平滑迁移策略\n\n`\"strict\": true` 其实是下面这些子选项的「总开关」：\n\n```json\n{\n  \"compilerOptions\": {\n    \"strict\": true,\n    \"noImplicitAny\": true,        // 不允许隐式 any\n    \"strictNullChecks\": true,     // 禁止把 null/undefined 赋给非可空类型\n    \"strictFunctionTypes\": true,  // 函数参数逆变检查更严\n    \"strictBindCallApply\": true,  // bind/call/apply 也做类型检查\n    \"strictPropertyInitialization\": true, // 类属性必须初始化\n    \"noImplicitThis\": true,       // this 类型不明确时报错\n    \"alwaysStrict\": true          // 输出 \"use strict\"\n  }\n}\n```\n\n其中**最关键的是 `strictNullChecks`**。关掉时，`null` 能赋给任何类型，于是 `user.name` 在 `user` 为 `null` 时也不报错——这是 JS 里 `Cannot read 'x' of null` 的根源。\n\n```ts\n// 开启 strictNullChecks 后\nfunction getName(u: { name: string } | null): string {\n  // return u.name // ❌ u 可能是 null，必须先判空\n  return u ? u.name : '匿名'\n}\n\n// 渐进式迁移老项目：先不开总开关，单独开最关键的\n// \"strictNullChecks\": true  // 单独开这一项，收益最大、破坏最小\n```\n\n### 名词解释\n\n**strictNullChecks**：`strict` 家族里最重要的一项。开启后，`null` 和 `undefined` 不再是「能塞进任何类型的万能值」，而是必须被显式标注（`T | null`）并判空。它直接消灭了 JS 头号运行时错误「无法读取 null 的属性」。代价是老代码要补大量判空——但这是值得的。\n\n**渐进式严格化（Gradual Strictness）**：老项目不敢一次性开 `strict` 时，先单独开 `strictNullChecks`，再逐步开 `noImplicitAny` 等。像「先系安全带再提速」，既拿到最大收益（杜绝空指针），又不至于改动爆炸。\n\n### 课后练习\n\n**练习 1**：为什么 `strictNullChecks` 比 `noImplicitAny` 对运行时安全影响更大？\n\n> 答案：`noImplicitAny` 主要防止「类型信息丢失导致提示变弱」；而 `strictNullChecks` 直接防止「把 null 当对象用」这种会崩的运行时代码被编译通过。前者影响开发体验，后者影响线上稳定性，所以后者更关键。\n\n**练习 2**：类里 `strictPropertyInitialization` 报错「属性未初始化」怎么解？\n\n> 答案：三种方式：① 声明时给默认值 `name = ''`；② 构造函数里赋值；③ 确定运行时会赋值则用 `name!: string`（非空断言属性，谨慎用）。\n\n### 总结\n\n我的立场从不摇摆：**新项目直接 `\"strict\": true` 起步，没有商量余地**。它短期让你多写几行判空和注解，长期替你挡掉一整类最致命的线上事故。对老项目，我的迁移策略是「先开 `strictNullChecks` 单项」——这一项性价比最高、破坏最小，团队最容易接受；跑顺了再逐个加 `noImplicitAny`。千万别反过来「图省事先关 strict，以后再说」，因为「以后」永远不会来，欠的类型债越积越难还。记住：类型严格不是给编译器看的表演，是给你自己买的保险。"
  },
  {
    "id": "ts-l20",
    "chapter": "typing",
    "title": "工程实践：类型复用与编译性能",
    "minutes": 30,
    "content": "### 本节目标\n\n- 掌握「跨文件/跨包复用类型」的几种姿势\n- 知道「类型太多导致 tsc 慢」时的应对\n\n**复用类型**最常见两招：\n\n```ts\n// 运行环境：Node.js 16+ + typescript；类型检查 npx tsc --noEmit ts-l20.ts\n\n// 1) 导出 interface/type，别处 import\n// types.ts: export interface User { id: number; name: string }\n// import type { User } from './types' // 用 import type 只引类型，不引运行时值\n\n// 2) 用 utility types 组合，不重复定义\nimport type { User } from './types'\ntype UserPreview = Pick<User, 'id' | 'name'>      // 只取部分字段\ntype NewUser = Omit<User, 'id'>                    // 去掉 id（新建时还没有）\ntype UserMap = Record<string, User>               // 字符串到 User 的字典\n```\n\n**编译性能**：类型推导（尤其深层递归类型）会拖慢 `tsc`。\n\n```ts\n// 性能建议（类型检查慢时）：\n// - 用 tsconfig \"include\" 精确限定范围，别让 tsc 扫全仓\n// - CI 用 \"tsc --incremental\" 增量编译\n// - 超深递归类型（>5 层）考虑用运行时实现代替类型推导\n// - 大型项目用 \"project references\"（tsconfig references）拆分\n```\n\n### 名词解释\n\n**import type**：「只导入类型、不导入值」的导入语法。它告诉 TS「这个东西运行时不存在，只是类型」。好处：打包时 tree-shaking 更干净、避免「为了类型而误引了运行时代码」导致的循环依赖。是类型复用的最佳实践。\n\n### 课后练习\n\n**练习 1**：`Pick<User, 'id' | 'name'>` 和手写 `{ id: number; name: string }` 哪个更好？为什么？\n\n> 答案：用 `Pick` 更好。它「派生」自 `User`，`User` 字段改了 `UserPreview` 自动跟着变，避免两处定义漂移。手写副本日后极易忘记同步。\n\n**练习 2**：为什么建议用 `import type` 而不是普通 `import` 引类型？\n\n> 答案：`import type` 明确「这是类型、无运行时值」，打包器可安全丢弃、避免误打包；还能防止「类型循环引用」变成「运行时循环依赖」。语义也更清晰。\n\n### 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n到这里 TS 旅程告一段落，我的整体观点是：**TS 的终极价值是「让类型的真相只有一个来源」**。`Pick`/`Omit`/`Record` 这类工具类型，本质是「从单一 `User` 派生出所有变体」，改一处全局生效——这比复制粘贴十份类型定义健壮十倍。工程层面，把公共类型抽成共享包、用 `import type` 引入，是大型项目不失控的底线。最后关于性能：类型体操很酷，但「编译要 3 分钟」的代价是真金白银，深层递归类型该收手时就收手，用运行时逻辑补位。TS 是工具，不是炫技场——**写出团队敢改、tsc 秒过、线上少崩的代码，才是赢**。"
  }
]

export const tsPlan = [
  {
    "day": 1,
    "title": "TypeScript 是什么？为什么要用它",
    "lessons": [
      "ts-l1"
    ]
  },
  {
    "day": 2,
    "title": "环境搭建与 tsconfig.json 初识",
    "lessons": [
      "ts-l2"
    ]
  },
  {
    "day": 3,
    "title": "原始类型与类型注解",
    "lessons": [
      "ts-l3"
    ]
  },
  {
    "day": 4,
    "title": "数组、元组与枚举",
    "lessons": [
      "ts-l4"
    ]
  },
  {
    "day": 5,
    "title": "对象类型与接口 interface",
    "lessons": [
      "ts-l5"
    ]
  },
  {
    "day": 6,
    "title": "函数类型：参数、返回值与重载",
    "lessons": [
      "ts-l6"
    ]
  },
  {
    "day": 7,
    "title": "联合、交叉与字面量类型",
    "lessons": [
      "ts-l7"
    ]
  },
  {
    "day": 8,
    "title": "类型推断与类型断言",
    "lessons": [
      "ts-l8"
    ]
  },
  {
    "day": 9,
    "title": "泛型基础：让函数「通吃」多种类型",
    "lessons": [
      "ts-l9"
    ]
  },
  {
    "day": 10,
    "title": "泛型约束、默认与条件类型入门",
    "lessons": [
      "ts-l10"
    ]
  },
  {
    "day": 11,
    "title": "keyof、索引访问与映射类型",
    "lessons": [
      "ts-l11"
    ]
  },
  {
    "day": 12,
    "title": "typeof、类型守卫与判别联合",
    "lessons": [
      "ts-l12"
    ]
  },
  {
    "day": 13,
    "title": "类、继承与修饰器",
    "lessons": [
      "ts-l13"
    ]
  },
  {
    "day": 14,
    "title": "模块、命名空间与 .d.ts 声明文件",
    "lessons": [
      "ts-l14"
    ]
  },
  {
    "day": 15,
    "title": "实战：写一个类型安全的 API 客户端",
    "lessons": [
      "ts-l15"
    ]
  },
  {
    "day": 16,
    "title": "类型体操（一）：元组翻转与长度",
    "lessons": [
      "ts-l16"
    ]
  },
  {
    "day": 17,
    "title": "类型体操（二）：DeepReadonly 与递归映射",
    "lessons": [
      "ts-l17"
    ]
  },
  {
    "day": 18,
    "title": "类型体操（三）：Promisify 与函数类型运算",
    "lessons": [
      "ts-l18"
    ]
  },
  {
    "day": 19,
    "title": "strict 模式全解：把隐患挡在编译期",
    "lessons": [
      "ts-l19"
    ]
  },
  {
    "day": 20,
    "title": "工程实践：类型复用与编译性能",
    "lessons": [
      "ts-l20"
    ]
  }
]
