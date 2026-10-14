// ============================================================
// JS 逆向基础入门（新版，统一重写至 ast-pro 同款标准）
// 每节含：可运行代码+运行步骤、函数注释+调用示例、名词通俗解释、课后练习(附答案)、总结
// 模板字符串内反引号转义 \`，\${ 转义 \${，反斜杠已加倍保护正则
// ============================================================

export const jsrCourseMeta = {'id': 'jsr', 'title': 'JS 逆向基础入门', 'subtitle': '面对黑盒一样的前端代码，逆向有一套完整的分析套路：以真实站点为目标，从抓包与断点调试入手，逐步还原加密参数、反混淆代码。', 'level': '入门 → 实战', 'icon': '🔍', 'color': '#e11d48', 'practiceCategory': 'javascript', 'chapters': [{'key': 'start', 'name': '第一章 · 逆向基础入门', 'lessons': ['jsr-l1', 'jsr-l2', 'jsr-l3']}, {'key': 'lang', 'name': '第二章 · JS 语言底层', 'lessons': ['jsr-l4', 'jsr-l5', 'jsr-l6']}, {'key': 'crypto', 'name': '第三章 · 编码与加密', 'lessons': ['jsr-l7', 'jsr-l8', 'jsr-l9', 'jsr-l10']}, {'key': 'obf', 'name': '第四章 · 混淆与还原', 'lessons': ['jsr-l11', 'jsr-l12', 'jsr-l13', 'jsr-l14']}, {'key': 'practice', 'name': '第五章 · 实战与进阶', 'lessons': ['jsr-l15', 'jsr-l16', 'jsr-l17']}]}

export const jsrChapters = [{'key': 'start', 'name': '第一章 · 逆向基础入门', 'lessons': ['jsr-l1', 'jsr-l2', 'jsr-l3']}, {'key': 'lang', 'name': '第二章 · JS 语言底层', 'lessons': ['jsr-l4', 'jsr-l5', 'jsr-l6']}, {'key': 'crypto', 'name': '第三章 · 编码与加密', 'lessons': ['jsr-l7', 'jsr-l8', 'jsr-l9', 'jsr-l10']}, {'key': 'obf', 'name': '第四章 · 混淆与还原', 'lessons': ['jsr-l11', 'jsr-l12', 'jsr-l13', 'jsr-l14']}, {'key': 'practice', 'name': '第五章 · 实战与进阶', 'lessons': ['jsr-l15', 'jsr-l16', 'jsr-l17']}]

export const jsrLessons = [
  {
    id: 'jsr-l1',
    chapter: 'start',
    title: '什么是 JS 逆向？常见应用场景',
    minutes: 30,
    content: `### 本节目标

- 用大白话理解「JS 逆向」到底在干什么
- 看清最常见的四类应用场景与合规边界
- 建立「抓包 → 定位 → 断点 → 还原 → 复现」的总体流程感

**JS 逆向**说白了就是：网页/小程序的前端逻辑本质是 JavaScript，而 JS 是可以被查看、被执行的。所谓「逆向」，就是从「程序跑起来的行为」反推出「它内部是怎么算的」。最常见的诉求是：前端在发请求前，对参数做了加密/签名（比如 \`sign\`、\`token\`），外部程序不知道算法就发不出合法请求——逆向就是要**把这段算法还原出来，在你的 Python/Node 里复现**。

四类典型场景：

1. **参数加密**：请求里的 \`sign\` / \`token\` / \`ts\` 是前端算的，你外部发请求算不出 → 还原算法。
2. **数据加密**：接口返回的是密文，前端解密后再渲染 → 还原解密逻辑。
3. **风控**：滑块验证、行为指纹、频率限制 → 分析判定逻辑（务必在合规前提下）。
4. **代码混淆**：厂商用混淆工具把代码打乱不让你看懂 → 还原成可读逻辑。

**合规边界（请刻在脑子里）**：逆向只应用于**学习、安全研究、调试你自己的系统**。爬取他人数据要遵守 robots 与平台协议、相关法律。本课程只讲技术原理，请勿用于恶意用途。

总体流程（后面每节课都在填充其中一个环节）：

\`\`\`text
① 抓包：找到带加密参数的请求
  → ② 定位：在压缩 JS 里搜索关键字（sign / encrypt）
  → ③ 断点：跟调用栈，看算法在哪执行
  → ④ 还原：读代码 / 抽离函数，弄明白输入→输出
  → ⑤ 复现：用 Node/Python 重写并验证结果一致
\`\`\`

### 名词解释

**逆向（Reverse Engineering）**：从「成品」反推「设计」的过程。比如你看到一个加密后的字符串，去反推它「是用什么密钥、什么算法、从什么明文算出来的」。它和「正向开发」相反——正向是「写代码产生结果」，逆向是「看结果反推代码」。

**签名（Signature）**：把「请求参数 + 密钥」通过某种算法算出的一串校验值，随请求一起发给服务器。服务器用同样的密钥重算一遍，对得上才认。它用来「证明请求是你（持有密钥的一方）发出的、且没被篡改」。前端逆向里 \`sign\` 参数就是签名。

### 课后练习

**练习 1**：下面哪个场景「不适合」用纯前端 JS 逆向解决？为什么？
（a）某网站列表接口返回密文，前端能正常显示；
（b）某 App 的数据来自原生iOS代码，前端只是个壳。

> 答案：（b）不适合。逆向针对的是「运行在前端的 JS 逻辑」。如果数据根本不是由前端 JS 计算的（而是原生/服务端算的），前端 JS 里就没有可还原的算法，得去逆向原生层，超出本课程范围。

**练习 2**：为什么「还原算法后要用 Node/Python 复现并验证结果一致」这步不能省？

> 答案：因为你「以为看懂了」和「真的算对」是两回事。只有用同样的输入跑出和网站完全一样的输出，才能证明你还原的算法是对的。否则上线后请求还是被拒，等于白做。

### 总结

我的观点：JS 逆向最容易被神化，其实它的内核非常朴素——**就是「定位一段计算逻辑，然后复现它」**。真正拉开差距的不是「会不会用工具」，而是「有没有流程感」：先抓包、再定位、再断点、最后还原复现，一步都不能乱。新手最爱一头扎进混淆代码里硬读，结果越读越晕。我的建议永远是：先用浏览器/Charles 把「哪个请求、哪个参数被加密」钉死，再带着目标去找那一行算法，效率至少高十倍。另外务必守住合规底线——技术是中性的，用法决定它是学习还是麻烦。`
  },
  {
    id: 'jsr-l2',
    chapter: 'start',
    title: '抓包与网络请求分析',
    minutes: 30,
    content: `### 本节目标

- 理解「抓包」在逆向流程里的位置
- 掌握用浏览器 DevTools Network 面板定位加密请求
- 会区分「请求参数加密」和「返回数据加密」

抓包 = 拦截并查看 App/网页和服务器之间的通信。逆向里 90% 的起点都在浏览器的 **Network（网络）面板**。

\`\`\`text
打开 DevTools(F12) → Network → 勾选 Preserve log
→ 操作页面触发请求 → 在列表里看每一条请求的
   Request Headers / Query String / Request Payload / Response
\`\`\`

一个**可运行的最小演示**：用 Node 起一个本地接口，模拟「前端发带 sign 的请求」，你用代码去发同样的请求，体会「参数从哪来」：

\`\`\`js
// 运行环境：Node.js 18+（无需依赖）
// 运行：node jsr-l2.cjs
// 这是一个「服务端」视角：它要求请求带 sign，且 sign = md5(参数拼接+密钥)
const http = require('http')
const crypto = require('crypto')

function makeSign(obj, secret) {
  // 把参数按 key 排序后拼接，再拼密钥，做 md5
  const keys = Object.keys(obj).sort()
  const raw = keys.map((k) => k + '=' + obj[k]).join('&') + secret
  return crypto.createHash('md5').update(raw).digest('hex')
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const params = Object.fromEntries(url.searchParams)
  const sign = params.sign
  delete params.sign
  const expected = makeSign(params, 'MY_SECRET')
  if (sign !== expected) {
    res.end('签名错误')
    return
  }
  res.end('验签通过，返回数据: ' + JSON.stringify(params))
})
server.listen(3000, () => console.log('试访问 http://localhost:3000/?a=1&b=2&sign=' + makeSign({ a: '1', b: '2' }, 'MY_SECRET')))
\`\`\`

你访问时带上正确 \`sign\` 才通过——这就是「前端必须算 sign」的典型结构。逆向要做的，就是把 \`makeSign\` 的算法从前端 JS 里抠出来。

### 名词解释

**抓包（Packet Capture）**：拦截并查看网络通信内容的技术。浏览器 DevTools 的 Network 面板本质就是「抓包工具」，让你看到每一次请求发了什么、回了什么。它是逆向的「眼睛」——没有它你根本不知道要还原哪个参数。

**Query String / Request Payload**：请求的两种「携带数据」方式。Query String 是 URL 里 \`?a=1&b=2\` 这种（GET 常见）；Request Payload 是请求体里的一整段 JSON（POST 常见）。加密参数可能藏在两者任一位置，抓包时要都看。

### 课后练习

**练习 1**：怎么判断「是请求参数被加密」还是「返回数据被加密」？

> 答案：看 Network 面板。如果发出去的请求里某个参数值像乱码/长串（如 \`sign=8a3f...\`），是「请求参数加密」；如果服务器返回的内容是密文（如 \`{"data":"U2FsdGVk..."}\`），前端却能正常显示，是「返回数据加密」。两者还原方向不同。

**练习 2**：上面 \`makeSign\` 里为什么要「按 key 排序再拼接」？

> 答案：为了保证「参数顺序不同但内容相同」时算出的 sign 一致（否则前端拼参顺序一变，后端校验就失败）。这是签名算法的常见防坑设计，逆向时要注意服务器是否也做了排序。

### 总结

我的看法：抓包不是「技术活」，是「细心活」。大多数人逆向好几天没进展，问题不在看不懂代码，而在于**没在抓包阶段把目标钉死**——到底是哪一个请求、哪一个字段、值长什么样。我的方法是：先在 Network 里把「正常请求」和「缺参数的请求」对比，精确定位那个「看起来像加密」的字段，再带着这个字段名（如 \`sign\`、\`__token\`）去 JS 里全局搜索。搜索关键字选得准，定位时间能从一个小时缩短到一分钟。别急着读代码，先把「敌人」看清。`
  },
  {
    id: 'jsr-l3',
    chapter: 'start',
    title: '断点调试入门',
    minutes: 30,
    content: `### 本节目标

- 理解 DevTools 里「断点」怎么帮你卡住加密执行的那一刻
- 掌握 Sources 面板下 XHR/fetch 断点与条件断点
- 会看「调用栈（Call Stack）」顺藤摸瓜

当你在 JS 里搜到一个疑似加密函数，下一步就是**让程序在这里暂停**，看输入是什么、输出是什么。

\`\`\`text
DevTools → Sources → 在文件里点行号下断点
或在代码里写  debugger;  语句，运行到这自动停
\`\`\`

**XHR/fetch 断点**是逆向利器：让「任何发往某 URL 的请求」在发送前暂停，你直接停在「加密参数刚算完、准备发请求」的那一行。

\`\`\`js
// 运行环境：Node.js 18+（无需依赖）
// 运行：node jsr-l3.cjs
// 用代码演示「调用栈」概念：被加密函数调用的链条
function encrypt(value) {            // ③ 最终算密文的地方
  return 'ENC:' + Buffer.from(value).toString('base64')
}
function buildRequest(user) {        // ② 组装请求
  const token = encrypt(user.name)   // 调用 encrypt
  return { url: '/api', token }
}
function onClick() {                 // ① 入口（事件触发）
  const user = { name: 'Laowen' }
  return buildRequest(user)          // 调用 buildRequest
}
// 在 DevTools 里，从 onClick 一路点进 encrypt，Call Stack 会显示
// onClick → buildRequest → encrypt 这条链
console.log(onClick())
\`\`\`

**关键操作**：下断点后触发请求，DevTools 会在 Sources 面板高亮当前行，右侧 **Call Stack（调用栈）** 从上到下就是「谁调用了谁」。点上去就能跳到对应代码——这正是你从「加密结果」反推「加密函数」的路径。

### 名词解释

**断点（Breakpoint）**：让程序「运行到某一行时暂停」的标记。它像在代码里设了个路障，车开到这就停，让你能检查此刻所有变量的值。逆向里断点是「进入加密现场」的唯一门票。

**调用栈（Call Stack）**：记录「当前这行代码，是被谁一层层调用进来的」的列表。栈顶是正在执行的函数，往下是它的调用者。逆向时你常从一个「算完的结果」倒着点 Call Stack，就能找到「最初是谁发起这次计算的」。

### 课后练习

**练习 1**：XHR/fetch 断点和普通行号断点，在逆向「加密参数」时哪个更省事？

> 答案：XHR/fetch 断点更省事。它直接在「请求即将发出」那一刻暂停，你看到的是「所有参数都已算好」的最终状态，不用猜加密发生在哪一行。普通行号断点得你先猜对函数位置才能下。

**练习 2**：为什么 \`debugger;\` 语句在「生产环境压缩代码」里可能被移除或不生效？

> 答案：生产构建常开启「摇树/压缩」会删掉 \`debugger;\` 语句；且有些网站用 \`eval\` 动态执行、或做了反调试（检测 devtools 打开就卡死）。所以 \`debugger;\` 适合本地调试，线上逆向更多靠 XHR 断点和搜索关键字。

### 总结

断点调试是我认为「逆向里最该先练熟」的硬功夫。我的观点很直接：**不会用断点，等于蒙着眼睛找人**。很多人习惯「搜索关键字 → 通读整个函数」，但当函数被压缩成 \`function(a,b){...}\` 且嵌套十层时，通读既慢又容易迷路。正确姿势是：先下 XHR 断点「卡在请求发出前」，再顺着 Call Stack 一层层往上点，每一层只看「这一步干了啥」，很快就能定位到真正的加密函数。记住：断点让你「看现场」，搜索让你「找位置」，两者配合才是完整打法。`
  },
  {
    id: 'jsr-l4',
    chapter: 'lang',
    title: '作用域与闭包——压缩代码阅读基础',
    minutes: 30,
    content: `### 本节目标

- 搞懂「作用域」为什么决定你能不能读到某个变量
- 理解「闭包」在压缩代码里长什么样
- 能识别压缩后的 \`_0xabc\` 变量与闭包结构

压缩工具常把变量名改成 \`_0x1a2b\` 这种短名，但**作用域规则不变**。读懂作用域，才能在乱码里找到「加密函数到底用了哪些外部变量」。

\`\`\`js
// 运行环境：Node.js 16+（无需依赖）
// 运行：node jsr-l4.cjs
// 演示闭包：函数「记住」了它定义时所在的外部变量
function makeCounter() {
  let count = 0          // 这个变量被「包」在返回的函数里
  return function () {
    count += 1
    return count
  }
}
const next = makeCounter()
console.log(next()) // 1
console.log(next()) // 2  （count 被闭包保留，没被回收）

// 压缩后可能长这样（等价，只是名字短了）：
function a(){let b=0;return function(){return b+=1}}
\`\`\`

**闭包在逆向里的意义**：很多混淆会把「密钥」「配置」藏在闭包里，函数外部读不到，只能通过「调用这个返回的函数」间接使用。你下断点看闭包变量的值，就能拿到藏起来的密钥。

### 名词解释

**作用域（Scope）**：「变量在哪些地方能被访问」的规则。JS 有全局作用域、函数作用域、块级作用域。压缩代码名字虽乱，但「哪个变量在哪个花括号里可见」这套规则不变。读懂作用域，你才知道某个 \`_0xabc\` 是从哪来的。

**闭包（Closure）**：函数「记住了它诞生时周围的环境（变量）」，即使那个环境已经「执行完」了，函数仍能访问那些变量。它像函数随身带的一个小背包，里面装着定义时周边的变量。逆向里常用来「藏密钥」——你只能调函数，看不到包里的密钥，但断点能让你偷看背包。

### 课后练习

**练习 1**：下面 \`getKey\` 为什么能一直返回同一个 \`_key\` 的值？

\`\`\`js
function box(){ const _key='SECRET'; return { getKey(){ return _key } } }
\`\`\`

> 答案：\`getKey\` 是定义在 \`box\` 内部的闭包，它「记住」了外部的 \`_key\`。\`_key\` 外部访问不到，但通过 \`getKey\` 能间接读出来——这就是闭包「私有变量」的效果。

**练习 2**：压缩代码里 \`var _0x1a=require('crypto')\` 之后，为什么还能在别的函数里用 \`_0x1a\`？

> 答案：如果 \`_0x1a\` 定义在「这些函数共同的外层作用域」，它们就能共享它（闭包/外层作用域可见）。反之若定义在某函数内部，则只有该函数内可见。判断是否共享，看声明语句的「花括号层级」。

### 总结

作用域和闭包是「读得懂压缩代码」的地基。我的观点：新手看到 \`_0x1a2b\` 满屏飞就慌，其实**名字丑不影响结构美**——作用域怎么嵌套、闭包包了什么，压缩工具一概不动。我读压缩代码时根本不关心变量叫什么，只在乎「这个函数在哪个作用域、它闭包捕获了哪些外部变量」。一个小技巧：在 DevTools 里把压缩文件「美化格式化（Pretty Print）」一下，花括号层级立刻清晰，再配合断点看闭包里的真实值，乱码瞬间变 readable。别和变量名较劲，和结构较劲。`
  },
  {
    id: 'jsr-l5',
    chapter: 'lang',
    title: '原型链与 this——还原对象与方法调用',
    minutes: 30,
    content: `### 本节目标

- 理解「原型链」如何让对象共享方法
- 搞懂 \`this\` 在不同调用方式下的指向
- 能在混淆代码里还原「对象.方法」的真实调用

JS 的对象方法常通过「原型」共享。\`this\` 则指向「调用时的那个对象」——这是还原 \`obj.method()\` 时最易错的点。

\`\`\`js
// 运行环境：Node.js 16+（无需依赖）
// 运行：node jsr-l5.cjs

// 原型：Person 的所有实例共享 sayHi
function Person(name) { this.name = name }
Person.prototype.sayHi = function () {
  return 'Hi ' + this.name   // this 指向调用它的实例
}
const p = new Person('Tom')
console.log(p.sayHi())  // 'Hi Tom'（this === p）

// this 指向取决于「怎么调用」，不是「定义在哪」
const fn = p.sayHi
console.log(fn())        // 'Hi undefined'（this 丢了，指向全局/undefined）

// 混淆里常见：把方法挂到原型，调用时 this 才绑定
// 还原时你必须确认「调用点的那个对象」是谁，才能知道 this 取什么值
\`\`\`

**逆向要点**：压缩代码常把方法挂在原型或某个对象上，调用处写成 \`a.b.c()\`。还原算法时，要追「\`this\` 此刻是哪个对象」，否则算出来的结果会差之千里（尤其涉及「实例上存的密钥」时）。

### 名词解释

**原型链（Prototype Chain）**：JS 对象找属性时，如果自己没有，就顺着「原型」往上层对象找，一层层直到 \`null\`。它像「家族继承」：你找不到的东西，去你爸那找，再找不到去爷爷那找。方法挂在原型上，所有实例共享同一份，省内存。

**this**：函数执行时的「上下文对象」，即「这次是谁在调用我」。它不像普通变量在定义时定死，而是「调用时」才定。\`obj.method()\` 里 \`this\` 是 \`obj\`；裸调 \`method()\` 里 \`this\` 常是 \`undefined\`（严格模式）。逆向里算错 \`this\` 是结果对不上的常见原因。

### 课后练习

**练习 1**：\`const g = obj.fn; g()\` 和 \`obj.fn()\` 的 \`this\` 分别是什么？

> 答案：前者 \`this\` 是全局/\`undefined\`（裸调用，丢失绑定）；后者 \`this\` 是 \`obj\`。所以还原「方法内部用到 this.xxx」时，必须确认调用方式，否则复现时取不到正确值。

**练习 2**：原型链对逆向「共享配置」有什么影响？

> 答案：如果密钥/配置挂在原型或某个单例对象上，所有用到它的方法都读同一份。你还原其中一个方法时，要记得去那个共享对象里取密钥，而不是当成本地变量。

### 总结

\`this\` 是 JS 里最被低估的坑，也是逆向复现时「结果差一位」的高发地。我的观点：还原任何「对象方法」时，第一件事不是读算法，而是**先确定 \`this\` 是谁**。很多初学者把 \`obj.method()\` 里读到的 \`this.key\` 当成「某个局部变量」，复现时就漏了这层绑定，算出来自然对不上。原型链则提醒你：方法用的数据可能不在「当前函数里」，而在「它挂的那个对象/原型」上。养成习惯——看到 \`xxx.yyy()\` 先问「xxx 此刻是什么」，再去读 yyy 的算法，逆向会稳很多。`
  },
  {
    id: 'jsr-l6',
    chapter: 'lang',
    title: '事件循环与异步——加密链的断点时机',
    minutes: 30,
    content: `### 本节目标

- 理解「事件循环」决定代码执行的先后顺序
- 搞懂为什么加密结果「有时」才出现、断点要下对时机
- 会区分宏任务 / 微任务对逆向时序的影响

JS 是单线程，靠「事件循环」调度。网络请求、定时器都是**异步**，结果在「未来某个时刻」才就绪。逆向时如果算法依赖异步返回的数据（如先 fetch 一个 token 再加密），断点时机就很重要。

\`\`\`js
// 运行环境：Node.js 16+（无需依赖）
// 运行：node jsr-l6.cjs

console.log('A')                  // 同步，立刻执行
setTimeout(() => console.log('B'), 0)  // 宏任务，下一轮
Promise.resolve().then(() => console.log('C')) // 微任务，本轮末尾
console.log('D')                  // 同步
// 输出顺序：A D C B
// 因为：同步(A,D) → 微任务(C) → 宏任务(B)

// 逆向启示：如果加密依赖「先拿到服务器下发的随机数」，
// 那加密函数一定在「那个异步回调里」执行，断点要下在回调里
async function getTokenThenEncrypt() {
  const token = await fetchToken()   // 异步：等网络
  return encryptWith(token, 'data')  // token 到位后才加密
}
function fetchToken() { return Promise.resolve('SERVER_NONCE') }
function encryptWith(token, data) { return token + ':' + data }
getTokenThenEncrypt().then((r) => console.log(r))
\`\`\`

**断点时机**：下在 \`encryptWith\` 内部，触发请求后程序会「暂停在它真正执行的那一刻」，此时 \`token\` 已经就绪——这就是你要的现场。

### 名词解释

**事件循环（Event Loop）**：JS 单线程下，用来「排队执行任务」的机制。同步代码先跑，遇到异步（网络/定时器）就挂起，等主线程空了再按规则回来执行。它像银行柜台：先办完眼前人（同步），叫号的后台任务（异步）轮流上。

**宏任务 / 微任务**：异步的两类队列。微任务（Promise 回调）优先级高于宏任务（setTimeout），所以「本轮同步结束后、下一轮宏任务前」先清空微任务。知道这个顺序，你才能预判「加密结果到底在第几步出现」，从而把断点下对地方。

### 课后练习

**练习 1**：输出顺序是什么？
\`\`\`js
console.log(1); setTimeout(()=>console.log(2),0); Promise.resolve().then(()=>console.log(3)); console.log(4)
\`\`\`
> 答案：1 4 3 2（同步 1、4 → 微任务 3 → 宏任务 2）。

**练习 2**：为什么加密依赖「服务器下发的 nonce」时，断点要下在异步回调里而不是请求发出前？

> 答案：因为 nonce 是异步返回的，请求发出前它还没值。只有下在「拿到 nonce 之后、加密执行时」的回调里，才能看到完整的输入（nonce + 明文），否则断点早了看到的是 undefined。

### 总结

事件循环表面是「底层原理」，实则是「断点时机指南」。我的观点：逆向遇到「一会儿有值、一会儿没有」的诡异现象，十有八九是异步时序没理清。很多新手在「请求刚发出」时下断点，发现密钥还是空的，就以为算法没找到——其实是下早了。记住铁律：**加密依赖的每一个输入，都必须在断点那一刻已经就绪**。如果输入来自网络/定时器，断点就老老实实下在那个异步回调内部。把事件循环顺序画在纸上，逆向的时序问题能解决一大半。`
  },
  {
    id: 'jsr-l7',
    chapter: 'crypto',
    title: '常见编码与哈希：Base64 / MD5 / SHA',
    minutes: 30,
    content: `### 本节目标

- 分清「编码」「哈希」「加密」三件不同的事
- 用 Node 跑通 Base64 / MD5 / SHA 的可运行示例
- 知道逆向里怎么识别它们

先纠正一个常见误解：**Base64 不是加密，只是编码**（为了在不支持二进制的场景传输）；**MD5/SHA 是哈希（摘要）**，不可逆，常用来做签名/校验。

\`\`\`js
// 运行环境：Node.js 18+（无需依赖，用内置 crypto）
// 运行：node jsr-l7.cjs
const crypto = require('crypto')

// 1) Base64 编码（不是加密！）
const b64 = Buffer.from('hello').toString('base64')
console.log('base64:', b64, '-> 解码:', Buffer.from(b64, 'base64').toString())

// 2) MD5（哈希，32 位十六进制，不可逆）
const md5 = crypto.createHash('md5').update('hello').digest('hex')
console.log('md5:', md5)

// 3) SHA256（更安全的哈希，64 位）
const sha = crypto.createHash('sha256').update('hello').digest('hex')
console.log('sha256:', sha)

// 实战：前端常把 sign 算成 md5(参数拼接+密钥)
function sign(params, secret) {
  const raw = Object.keys(params).sort().map((k) => k + '=' + params[k]).join('&') + secret
  return crypto.createHash('md5').update(raw).digest('hex')
}
console.log('sign:', sign({ a: '1', b: '2' }, 'KEY'))
\`\`\`

**逆向识别**：看到参数值是 \`aGVsbG8=\`（含 \`=\`、字符集限定）多半 Base64；看到 32 位十六进制串想 MD5，64 位想 SHA256。但**光看长度不能 100% 确定**，要和代码逻辑对上。

### 名词解释

**编码（Encoding）**：把数据从一种「表示形式」换成另一种（如二进制 ↔ 文本），**可逆、无密钥**。Base64 只是为了让二进制能在文本协议里传输，它不是保密手段。逆向里 Base64 一解码就现原形。

**哈希 / 摘要（Hash）**：把任意长度输入「揉成」固定长度的输出，且**几乎不可逆**、输入微调输出大变。MD5/SHA 常用于「校验完整性」和「生成签名」。逆向里如果看到 \`createHash('md5')\` 或密文长度 32，基本就是它。

### 课后练习

**练习 1**：为什么「前端用 MD5 给密码做『加密』」其实不安全？

> 答案：MD5 是哈希不是加密，且前端代码任何人可见，密钥也暴露在 JS 里；再加上 MD5 已被证明可碰撞。真正密码保护应在服务端用「加盐慢哈希（bcrypt）」。前端 MD5 只适合「签名/校验」，不适合「保密」。

**练习 2**：一段值 \`5L2g5aW9\` 很可能是什么？怎么验证？

> 答案：长度 8、字符集像 Base64，大概率是 Base64 编码。验证：\`Buffer.from('5L2g5aW9','base64').toString()\` 解出 \`你好\` 即确认。Base64 的特点是「解码即明文」，所以一眼可疑就先试解码。

### 总结

「编码 / 哈希 / 加密」三件套是逆向的 ABC，但大多数人第一步就混。我的观点：Base64 千万别叫它加密——它连门锁都算不上，只是把东西换个盒子装，谁都能打开。MD5/SHA 是「指纹」不是「保险箱」：你能用它证明「这段数据没被改」，但还原不出原文（所以逆向遇到纯哈希通常只能「复现计算」，不能「反推明文」）。识别它们的口诀很简单：看到 \`=\` 结尾的长串先试 Base64 解码；看到 32/64 位十六进制就去找 \`createHash\`。先归类、再读码，逆向效率翻倍。`
  },
  {
    id: 'jsr-l8',
    chapter: 'crypto',
    title: '对称加密 AES / DES',
    minutes: 30,
    content: `### 本节目标

- 理解「对称加密」：加密和解密用同一把密钥
- 用 Node 跑通 AES（CBC/ECB）的可运行示例
- 搞懂「iv（偏移量）」「mode（模式）」「padding（填充）」

对称加密 = 一把钥匙开一把锁。前端常用 **AES**（先进、推荐）或老旧的 **DES**（已不安全）。复现 AES 时，必须同时拿到：**算法/模式、密钥、iv、填充方式**，缺一不可。

\`\`\`js
// 运行环境：Node.js 18+（无需依赖，用内置 crypto）
// 运行：node jsr-l8.cjs
const crypto = require('crypto')

function aesEncrypt(plain, key, iv) {
  // AES-128-CBC：密钥 16 字节，iv 16 字节，PKCS7 填充（Node 默认）
  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key), Buffer.from(iv))
  return Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]).toString('base64')
}
function aesDecrypt(b64, key, iv) {
  const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key), Buffer.from(iv))
  return Buffer.concat([decipher.update(Buffer.from(b64, 'base64')), decipher.final()]).toString('utf8')
}
const key = '1234567890abcdef' // 16 字节
const iv = 'abcdef1234567890'  // 16 字节
const enc = aesEncrypt('你好世界', key, iv)
console.log('密文:', enc)
console.log('明文:', aesDecrypt(enc, key, iv)) // 你好世界
\`\`\`

**逆向要点**：在 JS 里搜 \`createCipheriv\` / \`aes\` / \`CBC\`，找到 \`key\`、\`iv\` 的来源。它们可能硬编码、可能来自接口、也可能藏在闭包。四个要素必须对齐，否则解密出来是乱码。

### 名词解释

**对称加密（Symmetric Encryption）**：加密和解密用「同一把密钥」。优点快，缺点是要安全地把密钥给对方。AES 是目前标准（DES 因密钥太短已淘汰）。逆向里前端 JS 里的对称密钥通常是「公开的」（在代码里），所以对称加密在前端主要防「看得懂」而非「防复现」。

**IV（初始化向量）/ 模式 / 填充**：IV 是「让同一明文每次密文不同」的随机量（CBC 模式必须）；模式（ECB/CBC/...) 决定怎么分组；填充解决「明文不是块整数倍」的问题。复现 AES 时这三者必须和前端完全一致，否则解密失败。它们是 AES 的「四个拼图块」。

### 课后练习

**练习 1**：AES 的 key 和 iv 一般各多少字节（AES-128）？

> 答案：AES-128 的 key 是 16 字节（128 位）；CBC 模式的 iv 也是 16 字节（一个分组大小）。key 长度错会直接报错，iv 错会解出乱码。

**练习 2**：ECB 模式和 CBC 模式哪个更不安全？为什么？

> 答案：ECB 更不安全。ECB 不依赖 IV、相同明文块加密出相同密文块，容易从密文看出结构（如图片轮廓）。CBC 用 iv 把块串起来，相同明文不同密文，所以更抗分析。逆向看到 \`ecb\` 要警惕它「没藏住结构」。

### 总结

AES 是前端加密的「主力」，也是逆向复现里最容易「差一个参数就全错」的类型。我的观点：复现 AES 别急着写代码，先像查字典一样把**四个要素**（算法+模式、key、iv、padding）从 JS 里一个个抠出来列在纸上，再动手。新手 90% 的失败是「iv 没找全」或「padding 假设错了」。另外要认清一个现实：前端 JS 里的 AES 密钥基本是公开的，它防的是「人肉读代码」，不是「防你复现」——所以这类加密在逆向里通常能 100% 还原，只是要细心。把四个要素当 checklist，一项项打勾，稳。`
  },
  {
    id: 'jsr-l9',
    chapter: 'crypto',
    title: '非对称加密 RSA 与国密 SM 系列',
    minutes: 30,
    content: `### 本节目标

- 理解「非对称加密」：公钥加密、私钥解密（或反之）
- 用 Node 跑通 RSA 的可运行示例
- 初识国密 SM2 / SM3 / SM4 在逆向里的位置

非对称加密有**两把钥匙**：公钥（公开，用来加密/验签）和私钥（保密，用来解密/签名）。前端通常只持有**公钥**，所以常用来「用公钥加密，只有服务端私钥能解密」或「服务端用私钥签名，前端用公钥验签」。

\`\`\`js
// 运行环境：Node.js 18+（无需依赖，用内置 crypto）
// 运行：node jsr-l9.cjs
const crypto = require('crypto')
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
const data = '敏感数据'
// 公钥加密
const enc = crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64')
console.log('密文:', enc)
// 私钥解密
const dec = crypto.privateDecrypt(privateKey, Buffer.from(enc, 'base64')).toString('utf8')
console.log('明文:', dec)

// 常见逆向场景：前端用「硬编码的公钥」加密，你复现加密即可（解密在服务端）
// 识别：搜 'RSA' / 'encrypt' / 'PUBLIC KEY' / 'jsencrypt' 库
\`\`\`

**国密 SM 系列**：国内常用。**SM2**（非对称，类 RSA）、**SM3**（哈希，类 SHA256）、**SM4**（对称，类 AES）。逆向里遇到「sm2/sm3/sm4」「gmssl」「crypto-js 的 sm 扩展」要能认出来。Node 原生不直接支持 SM，需用 \`sm-crypto\` 等库复现。

### 名词解释

**非对称加密（Asymmetric Encryption）**：用「公钥 + 私钥」一对钥匙。公钥可公开，私钥必须藏好。典型用法：A 用 B 的公钥加密，只有 B 的私钥能解——适合「前端加密、服务端解密」。它解决了对称加密「密钥怎么安全传递」的难题，但速度慢，所以常和对称加密配合（用 RSA 传 AES 的密钥）。

**国密（SM 系列）**：中国自主设计的密码算法族。SM2≈RSA（非对称）、SM3≈SHA256（哈希）、SM4≈AES（对称）。在政务、金融、国内大厂接口里常见。逆向识别关键：看到 \`sm2/sm3/sm4\` 关键字或 \`sm-crypto\` 库，就知道要走国密复现路线，别拿 AES/RSA 的 API 硬套。

### 课后练习

**练习 1**：前端只有「公钥」能做什么、不能做什么？

> 答案：能用公钥「加密数据」（只有服务端私钥解）或用公钥「验签」（确认数据来自持有私钥的服务端）。不能「解密」别人发来的密文（没私钥），也不能「伪造签名」（没私钥）。所以前端逆向遇到 RSA，通常只需复现「公钥加密」或「公钥验签」。

**练习 2**：为什么 RSA 常和 AES 配合使用，而不是全程 RSA？

> 答案：RSA 算得慢，不适合加密大块数据。常见做法是「用 RSA 加密一把临时 AES 密钥，再用 AES 加密正文」——又快又安全。逆向时要注意：密文可能分两段，一段是 RSA 包着的密钥，一段是 AES 正文。

### 总结

非对称加密在逆向里的「角色」和对称加密完全不同，这点必须先想清。我的观点：前端若只持公钥，那它**根本不想防你复现加密**——它防的是「中间人」。所以你复现「公钥加密」几乎必然成功，难点只在「把公钥和参数对齐」。真正麻烦的是**国密 SM 系列**：Node 原生不支持，你得装 \`sm-crypto\` 这类库，而且 SM2/SM3/SM4 的调用方式和 RSA/AES 不一样，照着 AES 的 API 抄必错。我的建议是：遇到国密先确认具体是哪个（SM2/3/4），再去找对应库的「最小可运行示例」对照，别凭记忆硬写。`
  },
  {
    id: 'jsr-l10',
    chapter: 'crypto',
    title: '签名与防重放：时间戳 / nonce / 盐',
    minutes: 30,
    content: `### 本节目标

- 理解「签名」如何防篡改、「防重放」如何防复用
- 用 Node 跑通「时间戳 + nonce + 盐」的签名示例
- 知道逆向时这三样东西分别去哪找

**签名**防「请求被改」，**防重放**防「截获的请求被反复发」。常见组合：把「参数 + 时间戳 + 随机 nonce + 盐(密钥)」一起算签名。

\`\`\`js
// 运行环境：Node.js 18+（无需依赖，用内置 crypto）
// 运行：node jsr-l10.cjs
const crypto = require('crypto')

function makeRequestSign(params, salt) {
  const ts = Date.now()              // 时间戳：证明请求是「现在」的
  const nonce = Math.random().toString(36).slice(2) // 随机数：每次不同
  const raw = [ts, nonce, JSON.stringify(params), salt].join('|')
  const sign = crypto.createHash('md5').update(raw).digest('hex')
  return { ts, nonce, sign }         // 这三个都随请求发出
}
const salt = 'SERVER_SALT' // 盐：只有前后端知道的密钥
const req = makeRequestSign({ action: 'list' }, salt)
console.log(req)
// 服务端用同样的 ts/nonce/params/salt 重算 sign，对得上才处理；
// 且 ts 和上次太近/nonce 重复则拒绝（防重放）
\`\`\`

**逆向要点**：
- \`salt\`（盐/密钥）：最难找，可能在 JS 里硬编码、也可能从接口下发。
- \`ts\`：当前时间戳，复现时 \`Date.now()\` 即可，但要注意单位（秒/毫秒）。
- \`nonce\`：随机串，复现也要随机生成（或按它算法生成）。

### 名词解释

**防重放（Replay Attack Protection）**：防止「攻击者截获一个合法请求，原样重发无数次」的防护。做法通常是要求请求带「时间戳（过期作废）+ 唯一 nonce（用过即废）」，服务端记下来，重复或超时的直接拒。逆向时你要复现的不仅是 sign，还有「合法的 ts 和没用过的 nonce」。

**盐（Salt）**：加在签名/哈希原料里的「只有双方知道的秘密串」。它的作用是让同样的明文算出不同的签名（防彩虹表/防猜），也把「密钥」和「数据」分开。逆向里 salt 往往藏在 JS 某个常量或闭包里，是签名还原的「最后一块拼图」。

### 课后练习

**练习 1**：如果逆向时 \`salt\` 找不到，但 sign 算法其他都确认了，会怎样？

> 答案：算出的 sign 永远和网站不一致，请求被拒。salt 是签名还原的「最后一公里」，找不到就差这一步。常见藏身处：JS 顶层常量、webpack 模块导出、或某个接口返回的 \`appKey\`。要多处搜关键字（salt/secret/key/appKey）。

**练习 2**：\`ts\` 单位用错（秒 vs 毫秒）会有什么后果？

> 答案：服务端校验 \`now - ts < 60秒\` 时，如果你传的是秒级时间戳（如 1700000000）而它按毫秒比较（期望 1700000000000），差值巨大 → 判定「过期」直接拒绝。复现务必确认 ts 单位，常见坑。

### 总结

签名与防重放是「前端逆向最后一公里」最常卡住的地方，而卡点几乎永远是 **salt（盐）**。我的观点：很多人算法读得明明白白，却栽在「找不到那把盐」上。所以定位阶段就要有意识地去搜 \`salt/secret/appKey/key\` 这些关键字，别等最后才找。另外注意两个隐形坑：**时间戳单位**（秒还是毫秒）和 **nonce 是否要按它的算法生成**（有些站 nonce 不是纯随机，而是有规律的）。把「ts / nonce / salt / 拼接顺序」列成 checklist，逐项对齐，签名这关就能过。防重放机制本身也提醒你：复现时 nonce 要用新的，别傻傻复用抓包里的旧值。`
  },
  {
    id: 'jsr-l11',
    chapter: 'obf',
    title: '变量名 / 字符串混淆与还原',
    minutes: 30,
    content: `### 本节目标

- 理解「变量名混淆」和「字符串混淆」分别怎么坑你
- 会用浏览器「美化格式化」+ 搜索还原变量名
- 理解「字符串数组 + 下标取用」这种常见字符串混淆

**变量名混淆**：把 \`encrypt\` 改成 \`_0x1a2b\`。还原靠「格式化 + 重命名」或「直接搜函数体的特征代码」。

**字符串混淆**：把 \`"password"\` 藏进一个数组，代码里只写 \`_0xArr[12]\`，你看到的是数字不是明文。

\`\`\`js
// 运行环境：Node.js 16+（无需依赖）
// 运行：node jsr-l11.cjs
// 模拟「字符串数组混淆」：真实字符串被挪到数组，代码用下标取
const _0xStr = ['password', 'encrypt', 'hello']
function check(input) {
  // 代码里看到的是 _0xStr[0]，不是 'password'——这就是混淆
  return input === _0xStr[0] ? _0xStr[1] : _0xStr[2]
}
console.log(check('password')) // 'encrypt'

// 还原思路：在 DevTools 里给 _0xStr 下「数组取值」断点，
// 或写脚本把 \`check('password')\` 里出现的 _0xStr[0] 替换回 'password' 再读
\`\`\`

**实战手法**：
1. DevTools Sources 里点 \`{}\`「Pretty Print」美化压缩代码，结构立刻清楚。
2. 对字符串数组，下「条件断点」在「访问数组时打印下标和值」，快速建立「下标→真实字符串」映射表。
3. 用之前的 AST 知识（见 ast-pro 课程）写脚本批量替换下标为明文。

### 名词解释

**变量名混淆（Identifier Obfuscation）**：把有意义的名字（\`user\`、\`encrypt\`）换成无意义短名（\`_0x1a2b\`、\`a\`）。它不防「读逻辑」，只增加「阅读难度」。还原手段是「格式化 + 按函数重命名」或「直接读函数体行为」，名字丑不影响你理解它在算什么。

**字符串混淆（String Obfuscation）**：把写在代码里的明文（如 \`'password'\`、\`'AES_KEY'\`）抽到一个数组，代码改用「数组下标」引用。它让你搜关键字时搜不到——因为字面量不在原地了。还原方法是「建立下标→明文的映射表」，或下数组访问断点把值打印出来。

### 课后练习

**练习 1**：为什么「字符串数组混淆」会让「全局搜索 password 关键字」失效？

> 答案：因为 \`'password'\` 字面量被挪到了数组定义处，算法代码里只剩 \`_0xArr[0]\` 这样的下标。你搜 \`password\` 只能搜到数组那一行，搜不到「使用它的算法」——必须先把下标映射回明文，或断点观察数组访问。

**练习 2**：美化格式化（Pretty Print）能解决变量名混淆吗？

> 答案：不能解决「名字无意义」的问题，但能解决「压缩成一行的可读性」问题——它把一行几万字符的代码按结构换行缩进，让花括号层级清晰，配合人工重命名才能读懂。它是第一步，不是全部。

### 总结

混淆的存在不是为了「防住高手」，而是为了「拖慢你」。我的观点很明确：**变量名混淆基本是纸老虎**——名字再丑，函数体在那、调用关系在那、算法逻辑也还在，格式化后读懂只是时间问题。真正有点烦的是**字符串混淆**，因为它让你「搜不到关键字」，断了你最快的定位路径。应对字符串混淆，我有两个真招：一是下数组访问断点，运行时把「下标→真实值」打出来建表；二是直接用 AST 脚本批量替换（这正是前面 ast-pro 课程的价值落地）。记住：混淆改变的是「呈现」，改变不了「逻辑」，你只要把呈现还原，逻辑就现形。`
  },
  {
    id: 'jsr-l12',
    chapter: 'obf',
    title: '控制流平坦化与 AST 还原',
    minutes: 30,
    content: `### 本节目标

- 理解「控制流平坦化」把顺序逻辑打乱成「状态机」
- 看懂 \`while(switch)\` 这种典型平坦化结构
- 知道用 AST 把平坦化「反平」回正常顺序

控制流平坦化（Control Flow Flattening）把一个「顺序执行」的函数，改成「一个状态变量 + 一个 switch 分发」的死循环，执行顺序靠状态推进，读起来像一团乱麻。

\`\`\`js
// 运行环境：Node.js 16+（无需依赖）
// 运行：node jsr-l12.cjs
// 原始顺序逻辑：
function orig(a, b) { const s = a + b; const d = s * 2; return d }
// 平坦化后（等价，但难读）：
function flattened(a, b) {
  let state = 0
  let s, d
  while (true) {
    switch (state) {
      case 0: s = a + b; state = 1; break
      case 1: d = s * 2; state = 2; break
      case 2: return d
    }
  }
}
console.log(orig(1, 2), flattened(1, 2)) // 都是 6
\`\`\`

**AST 还原思路**（详见 ast-pro 课程）：用 \`@babel/parser\` 解析 → 识别 \`while(true){switch(state){...}}\` 模式 → 按 \`state\` 的跳转顺序把 case 里的语句「串」回原本的顺序 → 用 \`@babel/generator\` 重新生成干净代码。这比人肉读快得多。

### 名词解释

**控制流平坦化（Control Flow Flattening）**：一种代码混淆技术，把「自然顺序执行」的代码，伪装成「状态机 + switch 分发」的循环。原本第 1、2、3 步的顺序，变成「state=0 做第1步→state=1 做第2步→...」。读起来极乱，但「计算语义完全不变」。它是混淆里较高级的一种。

**反平坦化（De-fl_attention）**：把平坦化的代码「还原」回正常顺序。最可靠的做法是用 AST 工具解析出 \`switch\` 每个 case 的语句和 \`state\` 跳转关系，按跳转顺序重排，再生成新代码。它把「人肉苦读」变成「脚本自动重构」，是 AST 实战最有成就感的场景之一。

### 课后练习

**练习 1**：平坦化后的代码和原代码，运行结果一样吗？为什么逆向还要还原它？

> 答案：运行结果完全一样（混淆不改语义，只改结构）。还原是为了「人能读懂、能提取算法」——你不还原也能断点跟，但跟着 switch 跳来跳去极慢，且难把算法抄出来复现。还原是为了效率和可维护性。

**练习 2**：用 AST 反平坦化，关键要提取哪两类信息？

> 答案：① 每个 \`case\` 里「实际执行的语句」；② \`state\` 变量「从哪个 case 跳到哪个 case」的转移关系。有了这两样，按转移顺序把语句串起来，就是原始顺序。这正是 babel 遍历 + 路径替换能做的事。

### 总结

控制流平坦化是混淆里的「狠角色」，但本质是「纸老虎穿了迷彩」。我的观点：人肉读平坦化代码是性价比最低的事——你跟着 \`switch(state)\` 跳几十次，脑子就乱了，还容易漏语句。正确做法永远是**交给 AST**：解析 → 抓 case 与 state 跳转 → 重排生成。这也是为什么我强烈建议先把 ast-pro 课程吃透——反平坦化就是它最漂亮的应用。一句话：平坦化改的是「执行顺序的写法」，没改「每条语句本身」，AST 还原就是「按跳转把语句摆回原顺序」，逻辑零损失。别跟状态机搏斗，让脚本替你摆。`
  },
  {
    id: 'jsr-l13',
    chapter: 'obf',
    title: 'Webpack 打包代码与模块提取',
    minutes: 30,
    content: `### 本节目标

- 看懂 Webpack 打包后「模块数组 + 启动函数」的结构
- 会定位「某个功能在哪个模块」
- 能把目标模块抽出来独立运行/分析

Webpack 把很多文件打成一个 JS，结构是「一个超大的模块数组 + 一个 \`__webpack_require__\` 加载器」。

\`\`\`js
// 运行环境：Node.js 16+（无需依赖）
// 运行：node jsr-l13.cjs
// 简化的 webpack 产物结构：
const modules = {
  0: function (module, exports, require) { module.exports = function add(a, b) { return a + b } },
  1: function (module, exports, require) { const add = require(0); module.exports = add(1, 2) },
}
function __webpack_require__(id) {
  const m = { exports: {} }
  modules[id](m, m.exports, __webpack_require__)
  return m.exports
}
console.log(__webpack_require__(1)) // 3
\`\`\`

**逆向要点**：
1. 在打包文件里搜 \`modules\` / \`__webpack_require__\` 确认是 webpack。
2. 目标算法通常在「某个模块函数」里。定位方法：搜索算法特征字符串（如 \`createCipheriv\`），它会落在某个模块内。
3. 抽离：把那个模块函数复制出来，补上它 \`require\` 的依赖（或 mock），就能单独跑、单独分析。

### 名词解释

**Webpack 模块数组**：Webpack 把每个源文件编译成一个「函数」，所有函数塞进一个大对象（或数组），用数字 id 索引。运行时由 \`__webpack_require__(id)\` 按需执行。所以你看到的「一个巨大 JS」其实是「很多小模块的集装箱」。逆向要做的，是「在这个集装箱里找到装算法的那个格子」。

**模块提取（Module Extraction）**：把「包含目标算法的那个模块函数」从打包文件里抠出来，单独运行分析。因为模块之间靠 \`require(id)\` 关联，你抽出后只需把被依赖的模块也一并补上（或简单 mock 掉无关依赖），就能脱离整个包单独调试算法——这是逆向 webpack 产物的核心技法。

### 课后练习

**练习 1**：怎么判断一个 JS 是不是 Webpack 打包的？

> 答案：搜 \`__webpack_require__\`、\`webpackJsonp\`、\`modules\` 等关键字。出现 \`function __webpack_require__(id)\` 几乎可以确定。现代还可能用 Vite/Rollup，结构不同（Rollup 常用 \`createCommonjsRequire\` 之类），但「多模块合一」的本质类似。

**练习 2**：抽离模块时，若目标模块 \`require(5)\` 但 5 号模块是无关 UI，怎么处理？

> 答案：可以直接把 \`require(5)\` 的调用结果 mock 成一个空对象/桩函数，只要不影响你要的算法执行即可。只保留算法真正依赖的模块，其余剪枝，才能让抽离的代码最小、最可读。

### 总结

Webpack 打包让「找算法」变成「集装箱里找格子」，但结构非常规律，反而好办。我的观点：别被那个几万行的单文件吓到——它只是「很多小模块被胶水粘在一起」，你真正要的通常只是其中「一个模块函数」。定位靠「搜算法特征字符串」（如 \`createCipheriv\`、\`md5\`），一旦命中就锁定模块 id；抽离时用 \`require\` 依赖做剪枝，把无关 UI 模块 mock 掉，目标算法立刻清爽。一句话：webpack 的产物「看起来吓人、拆开很简单」，关键是敢下手抽模块，而不是通读整包。`
  },
  {
    id: 'jsr-l14',
    chapter: 'obf',
    title: 'Hook 技术与动态执行',
    minutes: 30,
    content: `### 本节目标

- 理解「Hook（钩子）」：在不动原代码前提下拦截函数调用
- 用 Node 演示「替换函数」实现 Hook
- 知道 Hook 在逆向里怎么帮你「偷看输入/输出」

Hook = 把目标函数「替换/包裹」掉，在它执行前后插入你的逻辑（比如打印参数、改返回值）。逆向里常用来「不打断点也能看到每次加密的输入输出」。

\`\`\`js
// 运行环境：Node.js 16+（无需依赖）
// 运行：node jsr-l14.cjs
// 假设目标函数（可能是某个库/闭包里的）
function encrypt(data) { return '密文:' + data }
// —— Hook：包裹原函数，偷看输入输出 ——
const _orig = encrypt
encrypt = function (data) {
  console.log('[HOOK] 输入:', data)      // 执行前打印输入
  const r = _orig(data)                  // 调用原实现
  console.log('[HOOK] 输出:', r)          // 执行后打印输出
  return r
}
encrypt('hello') // 你会看到输入 hello、输出 密文:hello
\`\`\`

**浏览器里的 Hook**：在 DevTools Console 里，对 \`window\` 上的目标函数或 \`XMLHttpRequest.prototype.send\` 直接赋值替换，页面后续调用就被你截获。还能 Hook \`crypto\` 的 \`createCipheriv\` 看 key/iv。

**动态执行**：把抠出来的算法函数，在 Node 里用真实输入跑一遍，验证和网站上算的一致——这就是「复现验证」。

### 名词解释

**Hook（钩子）**：在不修改原函数源码的前提下，「拦截」它的调用，在前后插入自己的逻辑。类比：你在水管上接了个透明旁路，水（数据）流过时你能看一眼、甚至改一改，再放回去。逆向里 Hook 用来「无侵入地观察」每次加密的输入输出，比断点更省事（不用每次手动暂停）。

**动态执行（Dynamic Execution）**：把从前端抽出的算法，拿到 Node/浏览器里「真正跑一遍」，喂入真实数据看输出。它是「复现验证」的关键一步——只有动态执行的结果和网站一致，才算还原成功。静态读代码永远不如动态跑一遍可靠。

### 课后练习

**练习 1**：Hook 和「直接改源码」比，优势在哪？

> 答案：Hook 不改原文件、不破坏其他逻辑，且能「持续观察每次调用」（断点每次要手动继续）。在浏览器里 Hook \`XMLHttpRequest.prototype.open\` 之类，能看到页面所有请求；改源码则得重新打包、容易出错。

**练习 2**：Hook \`crypto.createCipheriv\` 能看到什么关键信息？

> 答案：能看到每次加密调用的 **algorithm（如 aes-128-cbc）、key、iv**——这正是 AES 复现要的四个要素里的三个。Hook 它是「无痛提取加密参数」的利器，比读代码找 key/iv 快得多。

### 总结

Hook 是逆向里「性价比最高的观察手段」，没有之一。我的观点：与其在几千行混淆代码里苦找 \`key\`/\`iv\`，不如直接在浏览器里 Hook 住 \`crypto.createCipheriv\`，让程序「自己把密钥吐给你看」。它本质上是「让目标主动暴露」，而不是「你去猜」。但要注意：Hook 只能看到「运行时确实发生的调用」，如果某分支没走到就看不到——所以配合「触发对应操作」才能钓全参数。新手常低估动态执行：你把算法抽出来在 Node 跑通，比读十遍代码都踏实。Hook + 动态执行，是「从看懂到复现」的最短路径。`
  },
  {
    id: 'jsr-l15',
    chapter: 'practice',
    title: '逆向实战全流程与工具链',
    minutes: 35,
    content: `### 本节目标

- 把前面所有环节串成一条完整实战线
- 建立「自己的逆向工具链」清单
- 用一个虚构案例走完「定位 → 还原 → 复现」

我们走一遍虚构案例：某站列表接口带 \`sign\`，要还原它。

\`\`\`text
① 抓包：Network 看到 /api/list?page=1&sign=8a3f...
② 定位：全局搜 'sign' → 命中 makeSign(在模块 42)
③ 断点/Hook：Hook createHash('md5')，看到 sign = md5(sorted(params)+salt)
④ 还原：读 makeSign，确认拼接顺序、salt 常量 = 'APP_SALT'
⑤ 复现：Node 里重写 makeSign，用同样 page 算 sign，请求成功
\`\`\`

**自用工具链清单**（按使用频率）：

\`\`\`text
- 浏览器 DevTools（Network / Sources / Console）——日常 80% 工作
- Node.js + crypto——复现加密/哈希
- @babel/core——AST 反混淆（见 ast-pro）
- Charles / Fiddler——移动端抓包（可选）
- 一个「参数→sign」的本地验证脚本——随时自测
\`\`\`

可运行的最小复现骨架：

\`\`\`js
// 运行环境：Node.js 18+（无需依赖）
// 运行：node jsr-l15.cjs
const crypto = require('crypto')
function makeSign(params, salt) {
  const raw = Object.keys(params).sort().map((k) => k + '=' + params[k]).join('&') + salt
  return crypto.createHash('md5').update(raw).digest('hex')
}
// 复现：用任意 page 都能算出合法 sign
const params = { page: '1' }
const sign = makeSign(params, 'APP_SALT')
console.log('复现 sign:', sign, '-> 可拼成 /api/list?page=1&sign=' + sign)
\`\`\`

### 名词解释

**工具链（Toolchain）**：你做逆向时「固定使用的一组工具组合」。就像木匠的工具箱，不需要每次现找。成熟的逆向者都有一套「DevTools + Node + babel + 抓包工具」的固定搭配，遇到新目标直接套流程，而不是临场摸索。建立工具链 = 把「经验」固化成「肌肉记忆」。

**实战闭环（定位→还原→复现）**：逆向不是「读懂代码」就结束，而是「能在自己程序里复现出一致结果」才算完成。定位（找到算法）、还原（理解算法）、复现（写出来跑通）三步闭环，缺一步都不算赢。复现验证是整个流程的「验收标准」。

### 课后练习

**练习 1**：为什么「复现脚本」要能「用任意参数算出合法 sign」，而不只是复现某一次？

> 答案：因为真实场景你要批量/动态发请求，不能写死成某一次抓包的值。脚本必须对「任意输入」都算出合法 sign，才算真正还原了算法。只复现一次只是「抄答案」，不是「会做题」。

**练习 2**：工具链里为什么「本地验证脚本」很重要？

> 答案：它是你的「自测基准」——随时喂入参数看 sign 对不对，不用每次开浏览器抓包。把验证成本降到最低，才能快速迭代「我还原得对不对」。没有它，你会反复在浏览器里手动试，极慢。

### 总结

学完前面所有单点，真正的分水岭是「能不能把它们串成闭环」。我的观点：单点技术（抓包、断点、加密）很多人都会，但**能稳定走完「定位→还原→复现」全流程的人很少**，差距就在「有没有工具链、有没有验证脚本」。我的建议是：每搞定一个站点，就把「它的 sign 算法 + 你的复现脚本」存进工具箱，下次遇到同类结构直接复用。逆向不是每次从零开始的艺术，而是「模式识别 + 复用经验」的工程。最后强调：复现验证是不可省略的验收关——你以为懂了和真的算对，中间差的就是这一脚油门。`
  },
  {
    id: 'jsr-l16',
    chapter: 'practice',
    title: 'AST 反混淆实战：babel 写还原插件',
    minutes: 35,
    content: `### 本节目标

- 综合应用 AST 知识（见 ast-pro 课程）写「反混淆插件」
- 用 @babel/core 跑通「字符串数组还原」示例
- 体会「脚本替代人肉」的降维打击

我们写一个插件：把「\`_0xArr[2]\` 这种数组下标取用」还原成「真实字符串」（假设你已有下标→明文映射表）。

\`\`\`js
// 运行环境：Node.js 16+；需要依赖 @babel/core（项目已安装）
// 运行：node jsr-l16.cjs
const babel = require('@babel/core')
// 假设我们从断点得到的映射：下标 -> 明文
const map = { 0: 'password', 1: 'encrypt', 2: 'hello' }
const code = \`const _s=['password','encrypt','hello']; function f(x){ return x===_s[0]?_s[1]:_s[2] }\`
const out = babel.transformSync(code, {
  plugins: [{
    visitor: {
      MemberExpression(path) {
        // 命中 _s[数字] 形式
        const { object, property } = path.node
        if (object.name === '_s' && property.type === 'NumericLiteral') {
          const txt = map[property.value]
          if (txt !== undefined) {
            // 替换成字符串字面量，字符串混淆即被还原
            path.replaceWith(babel.types.stringLiteral(txt))
          }
        }
      }
    }
  }]
})
console.log(out.code)
// 输出：const _s=[...]; function f(x){ return x==="password"?"encrypt":"hello" }
\`\`\`

这正是「用 AST 把混淆代码自动还原」的缩影：你写一次 visitor，成千上万处 \`_s[n]\` 一次性还原。详细 AST 原理见 **ast-pro 课程**。

### 名词解释

**AST 反混淆插件**：用 babel 的 visitor 模式，自动遍历并改写代码里的混淆结构（如字符串数组下标、平坦化 switch）。它把「人肉读几千行」变成「写一次脚本自动改全文件」。这是 AST 知识在逆向里最直接的变现，也是「脚本替代人力」的典型。

**babel.transformSync**：babel 的「同步转换」API，传入代码和插件，返回改写后的代码字符串。逆向里它是「反混淆流水线」的发动机：解析成 AST → 你的插件改 AST → 生成干净代码。注意 babel 8 里 \`transform\` 变异步，旧教程的 \`babel.transform\` 要改成 \`transformSync\`（详见 ast-pro 课程踩坑）。

### 课后练习

**练习 1**：上面插件为什么只处理 \`MemberExpression\` 且 \`object.name==='_s'\`？

> 答案：因为字符串混淆的特征就是「数组名[数字]」这种成员表达式。限定 \`object.name==='_s'\` 避免误伤其他数组访问；\`property\` 是数字字面量才说明是「下标取字符串」。精准匹配特征，才能既还原又不破坏正常代码。

**练习 2**：如果映射表 \`map\` 不全（某些下标没值），插件会怎样？

> 答案：代码中 \`if (txt !== undefined)\` 守卫了——没值的下标保持原样不动，不会报错也不会误改。实际逆向里你常「先还原大部分、剩几个手动补」，这个守卫保证脚本可增量工作。

### 总结

这一节是 AST 课程在逆向里的「高光时刻」。我的观点：人肉反混淆是「用时间换理解」，AST 插件是「用脚本换时间」——当你面对上万行混淆代码，后者是唯一可持续的路。但别神话它：插件再强，也依赖你「先人工看懂混淆模式、建好映射表」（比如下标→明文那张表，往往得靠断点打印获得）。所以正确关系是「人定模式、脚本执行」：你负责分析出 \`_s[n]\` 这种规律并拿到映射，脚本负责把它铺满全文件。这也是为什么我把 ast-pro 课程摆在前面——没有 AST 底子，这一节的插件你写不出来。`
  },
  {
    id: 'jsr-l17',
    chapter: 'practice',
    title: '反调试与风控对抗基础',
    minutes: 30,
    content: `### 本节目标

- 认识常见的「反调试」手段（检测 DevTools、无限 debugger）
- 了解基础应对（条件断点、替换检测代码）
- 建立「风控是猫鼠游戏、合规为先」的认知

有些站点会「反调试」：检测到你开 DevTools 就卡死、或不停弹 \`debugger\`。

\`\`\`js
// 运行环境：Node.js 16+（无需依赖，仅演示逻辑）
// 运行：node jsr-l17.cjs（仅看逻辑，浏览器里另说）
// 常见反调试 1：无限 debugger
function antiDebug() {
  setInterval(() => { debugger }, 100) // 浏览器里会不停暂停
}
// 常见反调试 2：检测 DevTools 宽度差
function detect() {
  if (window.outerWidth - window.innerWidth > 200) console.log('DevTools 可能开了')
}
// 应对（浏览器）：对 debugger 那行下「条件断点 false」让它永远不暂停；
// 或直接用控制台把 antiDebug 函数置空覆盖

// 风控（如滑块、行为指纹）则更复杂，本质是「判断你是不是真人」
console.log('风控对抗属于进阶，且务必合规、仅用于自有系统调试')
\`\`\`

**合规提醒（再次强调）**：反调试/风控分析只用于学习原理、调试你自己的系统。绕过他人产品的风控可能违反其服务条款甚至法律，请勿越界。

### 名词解释

**反调试（Anti-Debug）**：网站主动检测「你是否开了开发者工具 / 是否在调试」，一旦检测到就干扰你（卡死、无限暂停、跳转）。常见手段：检测窗口宽高差、定时 \`debugger\`、检测 \`console\` 被 hook。它是「防守方」增加你分析成本的手段。

**风控（Risk Control）**：网站判断「这次请求/操作是不是真人、有没有风险」的整套机制（滑块验证、设备指纹、行为轨迹、频率限制）。它比单纯加密更难逆向，因为很多判断在服务端、且依赖「真人行为特征」。逆向风控往往吃力不讨好且易违规，学习原理即可。

### 课后练习

**练习 1**：浏览器里遇到「无限 \`debugger\`」循环，怎么让它能跑又不暂停？

> 答案：在 \`debugger\` 那行下「条件断点」并设为 \`false\`（条件永假，断点不触发），或用控制台把setter/\`debugger\` 所在函数覆盖为空。也可在 DevTools 的「Never pause here」选项。核心是「让那条 debugger 不真正暂停」。

**练习 2**：为什么「风控」比「参数加密」更难逆向？

> 答案：参数加密的算法在前端 JS 里，你能抠出来复现；风控很多判断在服务端，且依赖「真人实时行为特征」（鼠标轨迹、设备指纹），前端没有完整逻辑，你复现不了「像人」的行为，且绕过易违规。所以难度和合规风险都更高。

### 总结

反调试与风控是逆向的「深水区」，我的态度非常明确：**懂原理可以，动手越界不行**。无限 \`debugger\`、DevTools 检测这类反调试，本质是「低成本的骚扰」，应对手段（条件断点、函数覆盖）也低成本，了解即可。但风控——滑块、指纹、行为判定——往往判断逻辑在服务端、且依赖真人特征，你既复现不了也容易踩法律红线。我的建议是：把这一节当「认知边界」来学，知道世界上有这些手段、它们大致怎么工作，但真要做产品级对抗时，先问合规。技术能力越强，越要清楚「哪里不能碰」。逆向的价值在「理解与学习」，不在「突破一切」。`
  }
]

export const jsrPlan = [{'day': 1, 'title': '什么是 JS 逆向？常见应用场景', 'lessons': ['jsr-l1']}, {'day': 2, 'title': '抓包与网络请求分析', 'lessons': ['jsr-l2']}, {'day': 3, 'title': '断点调试入门', 'lessons': ['jsr-l3']}, {'day': 4, 'title': '作用域与闭包——压缩代码阅读基础', 'lessons': ['jsr-l4']}, {'day': 5, 'title': '原型链与 this——还原对象与方法调用', 'lessons': ['jsr-l5']}, {'day': 6, 'title': '事件循环与异步——加密链的断点时机', 'lessons': ['jsr-l6']}, {'day': 7, 'title': '常见编码与哈希：Base64 / MD5 / SHA', 'lessons': ['jsr-l7']}, {'day': 8, 'title': '对称加密 AES / DES', 'lessons': ['jsr-l8']}, {'day': 9, 'title': '非对称加密 RSA 与国密 SM 系列', 'lessons': ['jsr-l9']}, {'day': 10, 'title': '签名与防重放：时间戳 / nonce / 盐', 'lessons': ['jsr-l10']}, {'day': 11, 'title': '变量名 / 字符串混淆与还原', 'lessons': ['jsr-l11']}, {'day': 12, 'title': '控制流平坦化与 AST 还原', 'lessons': ['jsr-l12']}, {'day': 13, 'title': 'Webpack 打包代码与模块提取', 'lessons': ['jsr-l13']}, {'day': 14, 'title': 'Hook 技术与动态执行', 'lessons': ['jsr-l14']}, {'day': 15, 'title': '逆向实战全流程与工具链', 'lessons': ['jsr-l15']}, {'day': 16, 'title': 'AST 反混淆实战：babel 写还原插件', 'lessons': ['jsr-l16']}, {'day': 17, 'title': '反调试与风控对抗基础', 'lessons': ['jsr-l17']}]
