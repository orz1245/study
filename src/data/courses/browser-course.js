// ============================================================
// JS 浏览器原理（新版，统一重写至 ast-pro 同款标准）
// 每节含：可运行代码+运行步骤、函数注释+调用示例、名词通俗解释、课后练习(附答案)、总结
// 模板字符串内反引号转义 \`，\${ 转义 \${，反斜杠已加倍保护正则
// ============================================================

export const brwCourseMeta = {'id': 'browser', 'title': 'JS 浏览器原理', 'subtitle': '把浏览器当成一台拆开看的机器：多进程如何分工、一帧画面如何被画出来、事件循环怎样调度任务，以及缓存与安全机制各自扮演的角色。', 'level': '入门 → 进阶', 'icon': '🌐', 'color': '#e34c26', 'practiceCategory': 'browser-engineering', 'chapters': [{'key': 'arch', 'name': '第一章 · 浏览器架构与导航', 'lessons': ['brw-l1', 'brw-l2', 'brw-l3']}, {'key': 'render', 'name': '第二章 · 渲染原理', 'lessons': ['brw-l4', 'brw-l5', 'brw-l6']}, {'key': 'js', 'name': '第三章 · JS 运行机制', 'lessons': ['brw-l7', 'brw-l8', 'brw-l9', 'brw-l10']}, {'key': 'net', 'name': '第四章 · 网络与存储', 'lessons': ['brw-l11', 'brw-l12', 'brw-l13']}, {'key': 'perf', 'name': '第五章 · 安全与性能', 'lessons': ['brw-l14', 'brw-l15', 'brw-l16', 'brw-l17']}]}

export const brwChapters = [{'key': 'arch', 'name': '第一章 · 浏览器架构与导航', 'lessons': ['brw-l1', 'brw-l2', 'brw-l3']}, {'key': 'render', 'name': '第二章 · 渲染原理', 'lessons': ['brw-l4', 'brw-l5', 'brw-l6']}, {'key': 'js', 'name': '第三章 · JS 运行机制', 'lessons': ['brw-l7', 'brw-l8', 'brw-l9', 'brw-l10']}, {'key': 'net', 'name': '第四章 · 网络与存储', 'lessons': ['brw-l11', 'brw-l12', 'brw-l13']}, {'key': 'perf', 'name': '第五章 · 安全与性能', 'lessons': ['brw-l14', 'brw-l15', 'brw-l16', 'brw-l17']}]

export const brwLessons = [
  {
    id: 'brw-l1',
    chapter: 'arch',
    title: '浏览器多进程架构',
    minutes: 28,
    content: `### 本节目标

- 理解浏览器为什么是「多进程」而不是「单进程」
- 掌握浏览器进程 / 渲染进程 / GPU 进程 / 网络进程的分工
- 用一段可运行的 Node 代码，真正「看到」进程隔离带来的好处

**为什么要多进程**：早期浏览器是单进程的——一个页面卡死或崩溃，整个浏览器跟着死。多进程的核心价值是**隔离**：把不同职责、不同站点放进各自的「盒子」（进程），一个盒子炸了，别的盒子照常工作。

**Chrome 的主要进程**（来自浏览器架构）：

\`\`\`text
浏览器进程（Browser）   ：界面、地址栏、书签、网络调度、文件访问——全局只有一个
渲染进程（Renderer）   ：每个标签页（或每个站点）一个，负责解析 HTML/CSS、执行 JS、布局绘制
GPU 进程              ：把图层交给显卡做合成与绘制（硬件加速）
网络进程（Network）    ：统一处理所有网络请求
插件 / 工具进程        ：把扩展程序隔离出去，防止扩展拖垮浏览器
\`\`\`

**渲染进程内部还有线程**（这是后面事件循环、性能章节的伏笔）：

\`\`\`text
主线程（Main）     ：解析 HTML/CSS、执行 JS、计算布局、绘制——JS 和渲染共用它
合成线程（Compositor）：把图层拼成最终画面，滚动/动画常由它处理，不阻塞主线程
光栅线程（Raster）  ：把图层转成位图（像素）
\`\`\`

**关键认知**：JS 运行在**主线程**上，而主线程同时还要做解析、布局、绘制。所以一段很长的 JS 任务会「堵住」渲染——这正是后续「事件循环」与「性能优化」要解决的问题。

**站点隔离（Site Isolation）**：现代 Chrome 不是「一个标签页一个渲染进程」，而是「一个站点一个渲染进程」。即使一个标签页里嵌了多个不同站点的 iframe，它们也各自独立。这既能防 Spectre 这类侧信道攻击，也能避免恶意页面偷读兄弟页面的内存。

下面这段 Node 代码，用「多进程」真实演示上面的隔离思想：主进程开两个「子标签」，杀掉其中一个，另一个和主进程都还在。

\`\`\`js
// 运行环境：Node.js 14+（无需任何第三方依赖）
// 步骤：把下面内容存为 brw-l1.js，终端执行  node brw-l1.js
// 你会看到：tab2 崩溃被杀了，但 tab1 和主进程依然活着 —— 这就是「进程隔离」

const { spawn } = require('node:child_process')

// 模拟一个「标签页」子进程：spawn 开一个带 IPC 通道的独立 Node 进程
function openTab(name) {
  const child = spawn(process.execPath, ['-e',
    // 子进程启动后，监听主进程发来的「自杀」指令
    \`process.on('message', (m) => { if (m === 'crash') { console.log('[\${name}] 崩溃了，进程退出'); process.exit(1) } }); console.log('[\${name}] 正常工作中...'); setInterval(() => {}, 1000)\`
  ], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
  child.on('exit', (code) => {
    if (code !== 0) console.log(\`>>> 主进程收到：\${name} 已退出（但主进程和其他标签不受影响）\`)
  })
  return child
}

const tab1 = openTab('tab1')
const tab2 = openTab('tab2')

// 3 秒后，让 tab2「崩溃」
setTimeout(() => {
  console.log('--- 模拟 tab2 崩溃 ---')
  tab2.send('crash')
}, 3000)

// 再 2 秒后，证明主进程和 tab1 仍然健康
setTimeout(() => {
  console.log('主进程还活着，tab1 也还活着。隔离成功。')
  tab1.send('crash')
  process.exit(0)
}, 5500)
\`\`\`

**在真实浏览器里怎么看**：打开 Chrome → 右上角菜单 → 更多工具 → 任务管理器，你就能看到一个个独立的「进程」和它们各自占用的内存/CPU。

### 名词解释

**进程（Process）**：操作系统分配资源的最小单位，拥有独立的内存空间。你可以把它理解成「一个带围墙的院子」——院子之间不能直接翻墙互看内存。方法/能力：\`fork()\`（操作系统创建子进程）、进程间通过「进程间通信（IPC）」交换消息、一个进程崩溃不会直接拖垮另一个。

**线程（Thread）**：进程内部的「执行流」，同一进程里的线程**共享**同一块内存。可以看作「院子里的多个工人，共用院子里的材料」。方法：\`start()\`（启动线程）、\`join()\`（等它跑完）、\`yield()\`（主动让出 CPU）。JS 的主线程就是渲染进程里的一条线程。

**站点隔离（Site Isolation）**：浏览器把「不同源站点」放进不同渲染进程的安全策略。它的核心方法/手段是「按源分配进程」+「跨进程内存不可互访」，目的是把安全边界从「标签页」细化到「站点」。

### 课后练习

**练习 1**：为什么「一个标签页里打开的恶意 iframe」不会直接偷走同标签页里银行页面的内存数据？

> 答案：因为站点隔离后，每个站点（即使是同一标签页里的不同 iframe）都运行在**独立的渲染进程**中，进程之间有操作系统的内存隔离。恶意 iframe 的进程无法直接读取银行页面进程的内存，必须由浏览器按规则通过 IPC 跨进程传递数据，而这类跨源读取会被浏览器拦截。

**练习 2**：既然多进程更安全更稳定，为什么浏览器不把「每一个 JS 函数」都放进独立进程？

> 答案：进程隔离的代价是「创建慢 + 内存占用大 + 通信成本高」。如果每个函数都开进程，光创建进程的开销就拖垮性能。所以浏览器只在「进程级」做隔离（稳定性/安全），而「线程级」的细粒度调度（如把长任务拆分）交给 JS 运行时去优化——成本和收益要平衡。

### 总结

我认为初学者最容易把「多进程」当成一句口号背下来，但真正重要的是理解它背后的**取舍思维**：隔离换来稳定和安全，代价是内存和通信开销。浏览器把隔离放在「进程」这一层，而不是「函数」或「标签页」层，是一个精心权衡的结果——既挡住了「一个页面崩溃全死」和「跨站偷内存」这两类最致命的问题，又没让开销失控。学这一节，你其实是在学「大型系统如何划分边界」。后面你会反复看到同一个思想：JS 和渲染挤在「主线程」这条窄路上会堵车，而事件循环、Web Worker、合成线程，本质上都是「给主线程分流」的不同手段。`
  },
  {
    id: 'brw-l2',
    chapter: 'arch',
    title: '从输入 URL 到页面显示',
    minutes: 38,
    content: `### 本节目标

- 掌握「输入 URL 到页面显示」的完整链路
- 用一段真实发起网络请求的 Node 代码，实测每一阶段花了多少时间
- 建立「全链路性能优化」的视角，而不是死记流程

**完整流程（面试与实战都高频）**：

\`\`\`text
① 输入 URL：浏览器判断是「搜索词」还是「网址」
② DNS 解析：域名 → IP（有缓存就跳过这步）
③ 建立 TCP 连接（三次握手）
④ TLS 握手（HTTPS，协商出对称密钥）
⑤ 发送 HTTP 请求（带 cookie、缓存相关头）
⑥ 服务器响应 → 检查缓存 → 解析 HTML
⑦ 渲染进程解析 HTML/CSS/JS → 布局绘制（下一章详讲）
⑧ 页面显示，其余资源继续加载
\`\`\`

**几个关键细节**：

- **DNS 解析**：浏览器缓存 → 系统缓存 → 本地 hosts → 递归 DNS 服务器。一次解析通常几十到几百毫秒。
- **TCP 三次握手**：SYN → SYN+ACK → ACK；HTTPS 在此基础上还要 TLS 握手（1~2 个 RTT）。所以 **HTTPS 比 HTTP 慢在握手**，HTTP/2 的「连接复用」能大幅缓解。
- **资源加载顺序**：HTML 里遇到普通 \`<script>\` 会**阻塞解析**（必须下载并执行完才继续），\`<link>\` 的 CSS 会**阻塞首次绘制**。现代写法是用 \`defer\` 或把脚本放尾部。

下面这段 Node 代码会**真实发起一次请求**，并分别打印 DNS 解析、TCP 握手、TLS 握手、首字节、下载的耗时，让你「看见」链路每一步：

\`\`\`js
// 运行环境：Node.js 14+（仅用内置 https，无需装包）
// 步骤：把下面内容存为 brw-l2.js，执行  node brw-l2.js
// 它会真实请求 https://example.com，用 socket 事件精确打印 DNS/TCP/TLS/首字节/下载 各阶段耗时（毫秒）

const { performance } = require('node:perf_hooks')
const https = require('node:https')

// 发起一次 HTTPS 请求，用 socket 的 lookup/connect/secureConnect 事件把「链路」精确分段计时
function measure(url) {
  return new Promise((resolve) => {
    const timings = {}
    timings.start = performance.now()                          // ① 开始

    const req = https.request(url, (res) => {
      timings.ttfb = performance.now()                          // ⑤ 收到首字节（TTFB）
      res.resume()
      res.on('end', () => { timings.end = performance.now(); resolve({ timings, status: res.statusCode }) })
    })

    // socket 事件能拿到 fetch 拿不到的三个细分阶段：
    req.on('socket', (socket) => {
      socket.on('lookup', () => { timings.dns = performance.now() })        // ② DNS 解析完成
      socket.on('connect', () => { timings.tcp = performance.now() })       // ③ TCP 三次握手完成
      socket.on('secureConnect', () => { timings.tls = performance.now() }) // ④ TLS 握手完成
    })
    req.on('error', (e) => resolve({ error: e.message }))
    req.end()
  })
}

;(async () => {
  const { timings, status, error } = await measure('https://example.com/')
  if (error) { console.error('请求失败:', error); process.exit(1) }
  const ms = (a, b) => (b - a).toFixed(1)
  console.log(\`DNS 解析      : \${ms(timings.start, timings.dns)} ms\`)
  console.log(\`TCP 三次握手  : \${ms(timings.dns, timings.tcp)} ms\`)
  console.log(\`TLS 握手      : \${ms(timings.tcp, timings.tls)} ms\`)
  console.log(\`首字节(TTFB)  : \${ms(timings.tls, timings.ttfb)} ms（状态 \${status}）\`)
  console.log(\`下载完成      : \${ms(timings.ttfb, timings.end)} ms\`)
  console.log(\`总耗时        : \${ms(timings.start, timings.end)} ms\`)
})()
\`\`\`

**优化视角**（对应后面「首屏性能」章节）：

\`\`\`text
DNS 预解析（dns-prefetch）     → 提前把域名解析好，省去用户等待
HTTP/2 + CDN + 缓存           → 减少网络往返与传输耗时
关键 CSS/JS 内联或 defer       → 减少阻塞解析
压缩 + Tree Shaking           → 减少传输体积
\`\`\`

### 名词解释

**DNS（域名系统，Domain Name System）**：把人类好记的域名（example.com）翻译成机器用的 IP 地址（93.184.216.34）的分布式系统。它的「方法」可理解为：先查本地缓存（\`lookup\` 命中就返回）、未命中再向递归解析器查询。你可以把它类比成「电话簿」。

**RTT（往返时延，Round Trip Time）**：数据从你这里到服务器再回到你这里花的时间。握手每多一个 RTT，用户就多等一份。方法/手段：用「连接复用（HTTP/2）」「0-RTT（HTTP/3/QUIC）」来减少 RTT 次数。

**三次握手（Three-way Handshake）**：TCP 建立连接的三步确认（SYN → SYN+ACK → ACK），目的是双方都确认「我能发、你能收」。它不提供「方法调用」，而是一组**状态变迁**（CLOSED → SYN_SENT → ESTABLISHED）。

### 课后练习

**练习 1**：为什么第二次刷新同一个页面，往往比第一次快很多？请至少说出两个原因。

> 答案：① DNS 缓存：域名已解析过，浏览器/系统缓存了 IP，跳过 DNS 查询；② 网络/HTTP 缓存：静态资源命中强缓存（Cache-Control 未过期）直接读本地，或命中协商缓存拿到 304，不必重新下载。此外 TCP 连接也可能被复用（HTTP/2 多路复用）。

**练习 2**：把上面 \`brw-l2.js\` 里的 \`example.com\` 换成你常用的一个网站（如 https://www.baidu.com），运行后观察「建连+首字节」耗时。如果这一项特别高，最可能卡在哪？

> 答案：最可能卡在「网络往返（RTT）」或「服务器处理慢」。如果是跨地域/跨境访问，物理距离导致的 RTT 无法靠代码消除，只能靠 CDN（让用户就近访问边缘节点）来缓解；如果是服务器响应慢，那就是后端优化问题，前端爱莫能助。

### 总结

我觉得「输入 URL 到显示」这种题，背流程是最低级的学法，真正值钱的是建立**「耗时归因」的直觉**。当你看到页面慢，脑子里要能立刻拆出：是 DNS 慢？是握手 RTT 多？是首字节晚（后端慢）？还是下载体积大？每一种慢，解法完全不同——DNS 慢上 \`dns-prefetch\`，握手慢上 HTTP/2，体积大上压缩和分包。这一节你跑的那段 Node 代码，核心价值不是「发了个请求」，而是让你亲眼确认：慢，是慢在哪一个可测量的数字上。性能优化的全部艺术，就是「先测量、再归因、后对症」。`
  },
  {
    id: 'brw-l3',
    chapter: 'arch',
    title: 'HTTP 协议基础与版本演进',
    minutes: 34,
    content: `### 本节目标

- 掌握常见请求方法与状态码的真实含义
- 理解 HTTPS 的「非对称传密钥 + 对称传数据」机制
- 用一段 Node 代码实测 HTTP/1.1 与 HTTP/2 的建连差异

**请求方法**：\`GET\`（读取）、\`POST\`（新建/提交）、\`PUT\`（整体替换）、\`PATCH\`（局部更新）、\`DELETE\`（删除）、\`HEAD\`（只要响应头不要体）、\`OPTIONS\`（预检/探测）。注意：方法只是「语义约定」，服务器想怎么实现都行，但**大家都遵守约定**才有意义。

**常见状态码**（按首位记忆最轻松）：

\`\`\`text
2xx 成功    200 正常 | 201 已创建
3xx 重定向  301 永久 | 302 临时 | 304 缓存生效（没变）
4xx 客户端错 400 参数错 | 401 未认证 | 403 无权限 | 404 不存在 | 405 方法不允许
5xx 服务器错 500 内部错 | 502 网关错 | 503 不可用 | 504 网关超时
\`\`\`

**HTTPS 加密流程（TLS 握手，简化版）**：

\`\`\`text
① 客户端打招呼：带上支持的加密套件 + 随机数 A
② 服务器返回证书（含公钥）+ 随机数 B
③ 客户端验证证书（走 CA 信任链）→ 用公钥加密一个「预主密钥」发给服务器
④ 双方用 随机数A + 随机数B + 预主密钥 各自算出相同的「会话密钥」（对称密钥）
⑤ 之后所有通信都用这个对称密钥加密（快）
\`\`\`

要点：**非对称加密只用来安全地传「密钥」；真正传数据用对称加密（快）**；证书解决「你拿到的公钥到底是不是真的服务器」。

**版本演进对比**：

| 版本 | 痛点 | 改进 |
| --- | --- | --- |
| 1.1 | 队头阻塞（一个 TCP 连接同一时刻只处理一个请求） | 持久连接 + 管线化（有限） |
| 2 | 应用层队头阻塞 | 二进制分帧、多路复用、头部压缩、服务端推送 |
| 3 | TCP 层队头阻塞（丢包阻塞整条连接） | 基于 QUIC（UDP）、0-RTT 握手、连接迁移 |

**面试常问**：HTTP/2 都多路复用了，为什么还有队头阻塞？→ 因为多路复用是在**应用层**，底层还是一条 TCP；TCP 丢一个包，整条连接都要等重传，所以 HTTP/3 干脆换成 UDP 的 QUIC。

下面这段 Node 代码会**实测 HTTP/2 的多路复用建连**与 HTTP/1.1 的差异（需 Node 18+，HTTP/2 为内置模块）：

\`\`\`js
// 运行环境：Node.js 18+
// 步骤：node brw-l3.js
// 分别用 HTTP/1.1 和 HTTP/2 请求一个支持 h2 的站点，并演示 h2 的「单连接多路复用」

const https = require('node:https')
const http2 = require('node:http2')

const target = 'https://www.cloudflare.com'   // Cloudflare 同时支持 h1/h2/h3

let h1Done = false
let h2Done = false
const tryExit = () => { if (h1Done && h2Done) process.exit(0) }

// —— HTTP/1.1：每个请求通常新建一条连接（agent:false 让连接用完即关）——
https.get(target + '/', { agent: false }, (res) => {
  console.log('HTTP/1.1  协议版本:', res.httpVersion, '状态:', res.statusCode)
  res.resume()
  res.on('end', () => { h1Done = true; tryExit() })
}).on('error', (e) => { console.log('h1 失败:', e.message); h1Done = true; tryExit() })

// —— HTTP/2：多条请求复用同一条 TCP 连接（多路复用）——
const session = http2.connect(target)
session.on('error', (e) => { console.log('h2 会话失败:', e.message); h2Done = true; tryExit() })

const paths = ['/', '/cdn-cgi/trace', '/robots.txt']   // 同一连接上并发发 3 个请求
let done = 0
const finish = () => {
  if (++done === paths.length) session.close()   // 全部完成再关闭这条 h2 连接
}
for (const p of paths) {
  const req = session.request({ ':path': p })
  req.resume()   // 消费响应体，否则 'end' 不会触发、连接无法关闭
  req.on('response', (headers) => {
    console.log(
      'HTTP/2  协议: h2 | 路径', p, '| 状态:', headers[':status'],
      '（多路复用：单连接并发', paths.length, '个请求）'
    )
  })
  req.on('end', finish)
  req.on('error', (e) => { console.log('h2 请求失败:', e.message); finish() })
  req.end()
}
// h2 会话真正关闭后再标记完成，避免 h1 keep-alive 长连接吊住进程
session.on('close', () => { h2Done = true; tryExit() })
\`\`\`

### 名词解释

**状态码（Status Code）**：服务器用三位数字告诉客户端「这次请求结果如何」。它的「方法」就是按首位分类：2=成功、3=重定向、4=你（客户端）的问题、5=我（服务器）的问题。记住这个分类法，看到任意新状态码都能先猜出大致含义。

**对称加密（Symmetric Encryption）**：加密和解密用**同一把密钥**。优点是快，缺点是「怎么把密钥安全交给对方」是个难题。常见算法：AES。

**非对称加密（Asymmetric Encryption）**：有一对密钥——公钥（谁都能拿）和私钥（只有自己有）。用公钥加密的数据，只有私钥能解开。优点是「不用提前共享密钥」，缺点是慢。常见算法：RSA、ECC。HTTPS 用公钥加密传「会话密钥」，之后切到 AES 对称加密，是「扬长避短」的经典组合。

### 课后练习

**练习 1**：用户在浏览器地址栏输入 \`http://example.com/login\` 后回车，服务器返回 301 到 \`https://example.com/login\`。请描述浏览器接下来会怎么做，以及 301 和 302 的区别。

> 答案：浏览器收到 301（永久重定向）后，会自动用 \`https\` 重新请求目标地址；后续它甚至会「记住」这个永久跳转，下次直接发 HTTPS。区别：301 是「永久搬家」，浏览器/搜索引擎会更新书签和权重；302 是「临时去别处」，不会长期记住。对 \`http→https\` 强制升级，用 301 更合适。

**练习 2**：有人说「HTTPS 比 HTTP 慢，所以内网服务没必要上 HTTPS」。你同意吗？说说你的判断。

> 答案：要看场景。对内网、纯后端微服务间通信，若网络可信且没法律/合规要求，HTTP 确实少一次握手开销；但现代 TLS 握手成本已很低，且内网也未必「可信」（横向移动攻击）。更稳妥的做法是内网也上 TLS（或用服务网格自动 mTLS）。所以「没必要」这句话太绝对——是否上 HTTPS 应基于「威胁模型」而非「怕慢」。

### 总结

我越来越觉得，HTTP 协议的学习重点不是「背状态码数字」，而是理解**每一代协议都在和同一个敌人作战：延迟**。1.1 败给队头阻塞，2 在应用层赢了但底层 TCP 仍拖后腿，3 直接掀桌换 UDP。而 HTTPS 又叠加了一层「安全握手」的开销——安全和速度天然有张力。真正成熟的工程师不会简单地说「HTTPS 慢所以不用」，而是会算账：握手慢多少毫秒、值不值得换来的安全、能不能用连接复用/0-RTT 把这部分开销吃回来。协议演进史，本质上是一部「在延迟、安全、复杂性之间反复权衡」的历史。`
  },
  {
    id: 'brw-l4',
    chapter: 'render',
    title: 'HTML/CSS 解析与 DOM/CSSOM 构建',
    minutes: 34,
    content: `### 本节目标

- 理解 DOM 与 CSSOM 是怎么一步步构建出来的
- 搞清「哪三类资源会阻塞解析/渲染」
- 用一个浏览器里能直接打开的 HTML，亲眼验证 \`defer\` 与 \`async\` 的加载差异

**解析 HTML → DOM**：渲染进程的主线程逐字节读取 HTML，先做词法分析切成 token（标签、文本、属性），再按层级组装成节点树（DOM）。解析是**增量**的——边解析边可用，所以首屏能「逐步显示」，而不是等全部下载完。

**解析 CSS → CSSOM**：CSS 也会被构建成树（CSSOM）。**CSS 是阻塞渲染的**：CSSOM 没建完，页面不会做首次绘制（否则会出现「样式闪烁 FOUC」）。

**三类阻塞资源**：

\`\`\`text
① 普通 <script>  ：阻塞 HTML 解析 + 阻塞渲染——必须下载并执行完，才继续往下解析
② <link> 的 CSS  ：阻塞「首次绘制」（不阻塞解析，但没它就不画）
③ 图片 / iframe  ：既不阻塞解析，也不阻塞渲染（加载完再显示）
\`\`\`

**script 的三种加载方式**（这是工程里天天用的）：

\`\`\`html
<script src="a.js"></script>               <!-- 同步：下载+执行完才继续解析 -->
<script defer src="a.js"></script>         <!-- 下载不阻塞解析，HTML 解析完才按序执行 -->
<script async src="a.js"></script>         <!-- 下载不阻塞解析，下完立刻执行（顺序不定） -->
\`\`\`

- \`defer\`：多个 \`defer\` 脚本**按顺序**执行，适合有依赖关系的主逻辑。
- \`async\`：谁先下载完谁先执行，适合独立的统计/广告脚本（不依赖其他脚本、也不被依赖）。

**预加载提示**（提前告诉浏览器去拿关键资源）：

\`\`\`html
<link rel="preload" as="style" href="app.css">              <!-- 提前下载关键 CSS -->
<link rel="preconnect" href="https://cdn.example.com">      <!-- 提前完成 DNS/TCP/TLS 握手 -->
\`\`\`

下面这个 HTML 文件，**直接在浏览器打开**就能看到「同步脚本阻塞解析」与「defer 按序执行」的差异；而 \`async\` 的「谁先下载完谁先执行」需要真实网络延迟才能体现，所以用紧接其后的 \`brw-l4-server.js\` 演示：

\`\`\`html
<!-- 运行环境：任意现代浏览器 -->
<!-- 步骤：把下面内容存为 brw-l4.html，用浏览器打开，按 F12 看 Console 输出 -->
<!-- 你会看到：同步脚本立刻执行；defer 的脚本按 1→2→3→4 顺序、且都排在 HTML 解析完后才执行 -->

<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>defer vs 同步脚本演示</title>
  <!-- 同步脚本：会阻塞解析，放这里最糟；仅作对比 -->
  <script>
    console.log('[同步] 这一行在解析到它时立刻执行')
  </script>

  <!-- 三个 defer：下载不阻塞解析，HTML 解析完后按出现顺序 1→2→3 执行 -->
  <script defer src="data:text/javascript,console.log('[defer] 脚本 1')"></script>
  <script defer src="data:text/javascript,console.log('[defer] 脚本 2')"></script>
  <script defer src="data:text/javascript,console.log('[defer] 脚本 3')"></script>
</head>
<body>
  <h1>打开控制台看脚本执行顺序</h1>
  <p>defer 脚本永远按 1→2→3→4 顺序执行，且都排在 HTML 解析完之后（data: 链接没有网络延迟，但不影响 defer 的「按序」特性）。</p>
  <script defer src="data:text/javascript,console.log('[defer] 脚本 4（始终最后）')"></script>
  <p>想看 <b>async</b> 的「谁先下载完谁先执行」乱序，请用下面的 brw-l4-server.js（data: 链接无网络延迟，无法体现乱序）。</p>
</body>
</html>
\`\`\`

\`\`\`js
// 运行环境：Node.js 14+（仅用内置 http）
// 步骤：node brw-l4-server.js  → 浏览器打开 http://localhost:3000/，按 F12 看控制台，多刷新几次
// 说明：async 脚本「谁先下载完谁先执行」。这里给三个 async 脚本设置不同下载延迟，
//       你会看到「先下完的 b.js 先执行」，且每次刷新顺序可能不同（延迟有抖动）。

const http = require('node:http')

// 三个 async 脚本，故意设不同下载延迟：b(80ms) 最快，c(180ms) 次之，a(300ms) 最慢
const scripts = {
  '/a.js': { delay: 300, code: 'console.log("[async] 脚本 A（最慢，最后执行）")' },
  '/b.js': { delay: 80,  code: 'console.log("[async] 脚本 B（最快，先执行）")' },
  '/c.js': { delay: 180, code: 'console.log("[async] 脚本 C（第二快）")' },
}

http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(\`<!DOCTYPE html><html><head><meta charset="utf-8">
      <script async src="/a.js"></script>
      <script async src="/b.js"></script>
      <script async src="/c.js"></script>
    </head><body><h3>打开控制台看 async 脚本的执行顺序（刷新几次）</h3></body></html>\`)
    return
  }
  const s = scripts[req.url]
  if (s) {
    setTimeout(() => { res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' }); res.end(s.code) }, s.delay)
    return
  }
  res.writeHead(404); res.end()
}).listen(3000, () => console.log('http://localhost:3000  （多刷新几次看 async 顺序变化）'))
\`\`\`

### 名词解释

**DOM（文档对象模型，Document Object Model）**：HTML 被解析后形成的「树形结构」，每个标签是一个节点（element node），文字是文本节点。它提供了一组「方法」让 JS 操作页面：\`document.getElementById(id)\`（按 id 找节点）、\`element.appendChild(node)\`（加子节点）、\`element.remove()\`（删自己）、\`element.addEventListener(type, fn)\`（监听事件）。你可以把它想成「页面的骨架，JS 能伸手进去改」。

**CSSOM（CSS 对象模型）**：CSS 解析后形成的样式树，记录了「每个元素最终该长什么样」。JS 也能读写它（\`window.getComputedStyle(el)\` 拿到计算后的样式）。它和 DOM 是两棵树，渲染时会「合并」成真正的画面。

**FOUC（无样式内容闪烁，Flash of Unstyled Content）**：CSS 还没加载完，浏览器就先用默认样式画了页面，等 CSS 到了又重画，用户看到「闪一下」。这就是 CSS 要「阻塞首次绘制」的原因——宁可晚画一帧，也不让用户看到丑样子。

### 课后练习

**练习 1**：下面这段代码，用户最早可能在什么时候看到 \`<h1>\` 的文字？

\`\`\`html
<head>
  <link rel="stylesheet" href="slow.css">   <!-- 这个 CSS 要 3 秒才下载完 -->
</head>
<body>
  <h1>你好</h1>
  <script src="big.js"></script>            <!-- 这个 JS 要 2 秒 -->
</body>
\`\`\`

> 答案：要等 \`slow.css\` 下载并构建完 CSSOM 后，浏览器才会做首次绘制——所以 \`<h1>你好</h1>\` 最早也要等约 3 秒（CSS 阻塞渲染）。\`big.js\` 还会再阻塞解析 2 秒，但那影响的是 \`<script>\` 之后的内容，这里 \`<h1>\` 在 script 之前，所以首绘只被 CSS 卡住。

**练习 2**：把上面那个 \`big.js\` 改成 \`<script defer src="big.js"></script>\`，对首屏显示 \`<h1>\` 有影响吗？为什么？

> 答案：几乎没影响（甚至可能更快看到）。因为 \`defer\` 的脚本**不阻塞 HTML 解析**，浏览器能顺利解析完 \`<body>\` 并配合已就绪的 CSSOM 做首次绘制；\`big.js\` 会在 HTML 解析完成后才执行，不再挡着首屏。这正是「脚本放 \`defer\`/尾部」能提速的根本原因。

### 总结

这一节我想纠正一个常见误解：很多人以为「页面慢」就是 JS 写得烂。其实在解析阶段，**CSS 和脚本的摆放位置**往往比 JS 本身的性能更影响首屏。CSS 阻塞绘制、普通脚本阻塞解析，这两个事实决定了「关键 CSS 内联、脚本用 defer、资源预加载」这类看似琐碎的工程规范，本质是给渲染「让路」。我特别建议你亲手打开 \`brw-l4.html\` 看 defer 永远按序、再跑 \`brw-l4-server.js\` 看 async 乱序——当你亲眼确认这些时，这个知识点就从「我背过」变成「我见过」了。后面讲渲染管线时你会明白，所有这些「阻塞」最终都汇聚成一件事：主线程忙不忙。`
  },
  {
    id: 'brw-l5',
    chapter: 'render',
    title: '渲染管线：布局 / 绘制 / 合成',
    minutes: 38,
    content: `### 本节目标

- 掌握渲染管线的四个阶段：样式计算 → 布局 → 绘制 → 合成
- 理解「图层（Layer）」与合成线程的作用
- 用一个浏览器里能直接打开的 HTML，对比 \`left\` 动画与 \`transform\` 动画的性能差异

**渲染管线（Render Pipeline）**：当 DOM 和 CSSOM 都就绪，浏览器要把它们变成屏幕上的像素，要走过这几步：

\`\`\`text
DOM + CSSOM
  → ① 样式计算（Style）   ：匹配 CSS 选择器，算出每个节点的最终样式
  → ② 布局（Layout）      ：算出每个元素的几何位置与尺寸（盒模型）
  → ③ 绘制（Paint）       ：把可见内容画成「绘制指令」（分层）
  → ④ 合成（Composite）   ：合成线程把各图层拼成最终画面交给 GPU
\`\`\`

**图层（Layer）**：浏览器会把页面拆成多个图层（触发条件如：3D transform、will-change、video、canvas 等）。**合成线程**负责把图层拼合并交给 GPU——这就是「硬件加速」的本质。

**为什么 \`transform\`/\`opacity\` 动画流畅**：它们只影响「合成」这一步，不需要重算布局和重绘，由**合成线程 + GPU** 独立完成，主线程空闲着，所以不卡。

下面这个 HTML，打开后能**直接看到**两种动画的差异（右侧 \`transform\` 通常明显更顺滑）：

\`\`\`html
<!-- 运行环境：任意现代浏览器 -->
<!-- 步骤：存为 brw-l5.html，用浏览器打开，观察两个方块移动是否一样顺 -->
<!-- 左侧用 left（触发 布局→绘制→合成 整条管线），右侧用 transform（只走合成） -->

<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <style>
    .box { width: 60px; height: 60px; border-radius: 8px; position: absolute; }
    #a { background: #e34c26; top: 40px;  animation: moveLeft 2s linear infinite alternate; }
    #b { background: #3178c6; top: 140px; animation: moveTransform 2s linear infinite alternate; }
    /* 左侧：改 left —— 每次都要重新布局+绘制 */
    @keyframes moveLeft { from { left: 0; } to { left: 400px; } }
    /* 右侧：改 transform —— 只走合成线程 */
    @keyframes moveTransform { from { transform: translateX(0); } to { transform: translateX(400px); } }
    p { font-family: sans-serif; }
  </style>
</head>
<body>
  <p>左：改 left（整条管线）　右：改 transform（仅合成）</p>
  <div id="a" class="box"></div>
  <div id="b" class="box"></div>
</body>
</html>
\`\`\`

**哪些属性触发什么阶段**（优化时照这张表选属性）：

\`\`\`text
触发布局（Layout，最贵）：width / height / margin / padding / top / left / font-size
触发绘制（Paint，中等）：color / background / border-radius / box-shadow
只触发合成（Composite，最便宜）：transform / opacity / filter（部分）
\`\`\`

**\`will-change\` 提示**（提前告诉浏览器「这个元素要动」，让它先分层）：

\`\`\`css
.box { will-change: transform; }   /* 但不要滥用，图层多了内存也涨 */
\`\`\`

### 名词解释

**布局（Layout / Reflow）**：浏览器算出「每个元素该放在哪、多大」的过程。它消费 DOM 结构 + CSS 样式，产出每个节点的几何盒。你可以把它理解成「装修时先确定每件家具摆哪」。\`offsetWidth\`、\`getBoundingClientRect()\` 这类读取几何信息的「方法」，会强制浏览器立刻做一次布局（见下一节）。

**绘制（Paint）**：把元素的视觉内容（颜色、边框、阴影、文字）转成「绘制指令」，类似「按布局图给家具上色」。绘制本身不决定位置，只决定「长什么样」。

**合成（Composite）**：把已经画好的各个「图层」像叠透明胶片一样拼成最终画面，由合成线程交给 GPU。它的「方法」是 \`layerize()\`（分层）+ \`composite()\`（拼合）。关键点：合成**不依赖主线程**，所以 \`transform\`/\`opacity\` 动画能绕开主线程卡顿。

### 课后练习

**练习 1**：给一个元素加 \`transition: all 0.3s\`，然后 JS 里不断改它的 \`width\`。为什么动画会卡？该改成什么属性能丝滑？

> 答案：\`width\` 改变会触发布局（Layout）→ 绘制（Paint）→ 合成（Composite）整条管线，每一帧都重排重绘，主线程压力大，所以卡。应改用 \`transform: scale()\` 或 \`transform: translateX()\` 来做视觉变化——它们只走合成，由 GPU 完成，主线程空闲，动画丝滑。

**练习 2**：\`will-change: transform\` 是「写得越多越好」吗？会有什么副作用？

> 答案：不是。浏览器会为声明了 \`will-change\` 的元素**提前创建独立图层**，图层要占 GPU 内存。大量滥用会制造成百上千个图层，内存暴涨，反而拖慢合成甚至引发崩溃。正确做法：只在「确实要动、且动画期间」使用，动画结束可考虑移除（如动画 \`animationend\` 后清掉 \`will-change\`）。

### 总结

这一节的核心思想，我愿意把它概括成一句话：**动画顺不顺畅，取决于你「惊动了」管线的哪一段**。改 \`left\` 是把布局、绘制、合成全惊动一遍；改 \`transform\` 只是轻轻碰一下最末尾的合成。浏览器把「合成」单独丢给合成线程 + GPU，就是专门给动画留的一条「快车道」。但快车道不是免费的——\`will-change\` 提前分层要占显存，滥用会反噬。所以真正的工程智慧是：**默认走合成属性做动效，必要时才分层，且用完即收**。记住：你不是在「让动画变快」，而是在「别去惊动那条本就拥堵的主线程」。`
  },
  {
    id: 'brw-l6',
    chapter: 'render',
    title: '重排与重绘：触发条件与优化',
    minutes: 32,
    content: `### 本节目标

- 区分「重排（Reflow）」与「重绘（Repaint）」
- 认识最经典的陷阱「读改写分离」（强制同步布局 / Layout Thrashing）
- 用一段浏览器可运行的代码，实测「先读后写」与「读改写分离」的耗时差距

**重排（Reflow / Layout）**：元素的几何信息变了（位置、尺寸），浏览器必须**重新计算布局**。代价最大，且常常影响**子树甚至整页**。

**重绘（Repaint）**：只有外观变了（颜色、背景），几何没变，只需重新绘制。代价较小。

**触发重排的典型操作**：

\`\`\`js
el.style.width = '100px'        // 改几何 → 重排
const h = el.offsetHeight        // 读几何 → 强制浏览器先重排（同步布局）
// 增删 DOM、改 class、窗口 resize、字体加载完，都可能触发
\`\`\`

**经典陷阱：读改写分离（强制同步布局）**。下面这段代码在浏览器里能直接跑，并显示两种写法的耗时差：

\`\`\`html
<!-- 运行环境：任意现代浏览器 -->
<!-- 步骤：存为 brw-l6.html，用浏览器打开，看页面上打印的两种耗时 -->
<!-- 你会看到：循环里「改一下读一下」明显比「先全读再全改」慢 -->

<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <style>.item{width:50px;height:20px;background:#3178c6;margin:2px}</style>
</head>
<body>
  <div id="out"></div>
  <script>
    const box = document.createElement('div')
    document.body.appendChild(box)
    for (let i = 0; i < 200; i++) {
      const d = document.createElement('div')
      d.className = 'item'
      box.appendChild(d)
    }
    const list = [...box.children]

    // ❌ 错误写法：循环里「读→写」交错，每次读 offsetWidth 都会强制浏览器先重排上一轮的写
    let t1 = performance.now()
    for (const el of list) {
      el.style.width = (el.offsetWidth + 1) + 'px'   // 读 offsetWidth（触发同步布局）后写样式
    }
    const bad = performance.now() - t1

    // 重置
    list.forEach(el => el.style.width = '50px')

    // ✅ 正确写法：先全部读，再统一改（batch read then write）
    let t2 = performance.now()
    const widths = list.map(el => el.offsetWidth)
    list.forEach((el, i) => { el.style.width = (widths[i] + 1) + 'px' })
    const good = performance.now() - t2

    document.getElementById('out').innerHTML =
      '读改写混合(坏): ' + bad.toFixed(2) + ' ms<br>先读后写(好): ' + good.toFixed(2) + ' ms'
  </script>
</body>
</html>
\`\`\`

**优化手段清单**：

\`\`\`text
1. 批量改样式：合并成一次 class 切换，而不是逐个改 style
2. 读改写分离：先集中读几何，再集中写样式
3. rAF 批量写：把 DOM 写入放进 requestAnimationFrame 回调，浏览器下一帧前统一处理
4. 离线操作：用 DocumentFragment 批量插入、或用 display:none 包裹后再改
5. CSS containment：contain: layout paint 声明「本元素不影响外部」，限制重排范围
\`\`\`

**判断口诀**：属性影响**几何**→重排；只影响**外观**→重绘；只影响**图层/透明度**（transform/opacity）→只合成（见上一节）。

### 名词解释

**强制同步布局（Forced Synchronous Layout / Layout Thrashing）**：当你在 JS 里「写入样式后又立刻读取几何属性」时，浏览器为了给你准确的数值，必须**立刻停下手里的事、先完成一次布局计算**。如果这在循环里发生，每一轮都重排一次，性能雪崩。它的「触发方法」就是你刚刚跑的那段 \`el.style.width = ...; el.offsetWidth\`——写后立刻读。

**重排（Reflow）**：见上一节。这里补充它的「范围方法」：\`document.body.offsetHeight\` 这类读取会触发**整页**强制布局；而给某个元素加 \`contain: layout\` 能把它「圈」起来，重排只发生在它内部。

**requestAnimationFrame（rAF）**：浏览器提供的「下一帧绘制前」回调钩子。方法：\`requestAnimationFrame(callback)\` 返回一个 id，\`cancelAnimationFrame(id)\` 可取消。它用来把 DOM 写入「对齐到帧」，避免一帧内多次零散重排。

### 课后练习

**练习 1**：下面代码在一个 1000 个子元素的列表里跑，为什么可能很慢？怎么改？

\`\`\`js
for (const el of items) {
  el.style.height = el.scrollHeight + 10 + 'px'
}
\`\`\`

> 答案：循环里每次 \`el.scrollHeight\` 读取几何，都会触发一次强制同步布局（因为上一行刚改了 \`style.height\`）。1000 次就是 1000 次重排。改法：把读取和写入分开——先 \`const hs = items.map(el => el.scrollHeight)\`，再 \`items.forEach((el,i) => el.style.height = hs[i]+10+'px')\`，把 1000 次重排降到约 2 次。

**练习 2**：\`contain: layout paint\` 到底解决了什么？

> 答案：它告诉浏览器「这个元素内部的布局/绘制变化，不会影响到它外面的世界」。于是重排重绘被「圈」在该元素内部，浏览器不用去重新计算整页或父级，范围更小、更快。适合用在频繁变动的局部容器（如聊天列表、虚拟滚动区）上。

### 总结

我觉得「重排重绘」这一节最该刻进肌肉记忆的，不是定义，而是那句**「先读后写」**。绝大多数前端性能 bug 不是算法差，而是「在循环里改一下又读一下」，无意间触发了成百上千次强制同步布局。浏览器很老实：你问它「现在多宽」，它就真的先排一遍再回答你。所以优化的本质，往往是**调整你提问和改写的顺序**，让浏览器一次排完、批量改完。这背后还是那条主线：主线程上的同步布局是昂贵的，能合并就合并，能推迟到 rAF 就推迟。把这一节和上一节的「走合成」连起来看，你会发现性能优化的招式虽然多，根子就一个——**别让主线程做多余的重复劳动**。`
  },
  {
    id: 'brw-l7',
    chapter: 'js',
    title: 'V8 引擎与 JS 编译执行',
    minutes: 36,
    content: `### 本节目标

- 理解解释执行与 JIT（即时编译）的关系
- 用一段 Node 代码实测「隐藏类（Hidden Class）」对属性访问性能的影响
- 了解垃圾回收（GC）的基本机制与内存泄漏排查思路

**V8 执行流程（简化）**：

\`\`\`text
JS 源码
  → Parser 解析成 AST
  → Ignition 解释器：逐行解释执行（启动快）
  → 热点函数（执行多次）→ TurboFan 编译器：编译成机器码（执行快）
  → 运行中若假设不成立（如类型变了）→ 反优化回解释器
\`\`\`

**JIT（Just-In-Time）**：解释器先跑（启动快），把「跑得热」的函数编译成机器码（后续快）。这就是「JS 明明是解释型，却能越来越快」的原因。

**隐藏类（Hidden Class）与内联缓存（IC）**：V8 给每个对象背后偷偷建了一个「形状描述」（隐藏类），记录「有哪些属性、内存偏移在哪」。属性**添加顺序一致**的对象共享同一隐藏类，属性访问走内联缓存，极快；一旦顺序不一致或动态增删属性，隐藏类「分裂」，访问变慢。

下面这段 Node 代码会**真实测出**「形状一致」和「delete 破坏形状（字典模式）」的性能差：

\`\`\`js
// 运行环境：Node.js 14+
// 步骤：node brw-l7.js
// 它会分别用「形状一致的对象」和「被 delete 破坏形状（退化字典模式）的对象」大量访问属性，打印耗时

const N = 2_000_000

// ✅ 形状一致：所有对象都按 x→y 顺序添加，共享同一隐藏类，内联缓存命中，快
function makeNormal(n) {
  const arr = []
  for (let i = 0; i < n; i++) arr.push({ x: i, y: i })
  return arr
}

// ❌ 被 delete 破坏形状：先加 z 再删掉，V8 无法用固定偏移，退化「字典模式」，慢
function makeDictionary(n) {
  const arr = []
  for (let i = 0; i < n; i++) {
    const o = { x: i, y: i, z: i }
    delete o.z
    arr.push(o)
  }
  return arr
}

function read(arr) {
  let s = 0
  for (const p of arr) s += p.x + p.y
  return s
}

// 预热：让 JIT 编译热点函数，避免首轮冷启动干扰
makeNormal(100000); makeDictionary(100000)

for (let round = 1; round <= 2; round++) {
  const a = makeNormal(N), b = makeDictionary(N)
  const t1 = performance.now(); read(a); const normal = performance.now() - t1
  const t2 = performance.now(); read(b); const dict = performance.now() - t2
  console.log(\`第\${round}轮  形状一致: \${normal.toFixed(1)}ms  字典模式(delete): \${dict.toFixed(1)}ms\`)
}
\`\`\`

**补充说明**：现代 V8 对「两三种形状」也能通过多态内联缓存（polymorphic IC）保持不错的速度，所以「属性顺序略有不同」这类轻微差异往往不明显；真正让 V8 放弃优化、退化成字典查找的，是 \`delete\` 这种「破坏形状」的操作（或动态塞进过多不同属性）。上面的对比正是用 \`delete\` 把「形状分裂」放大到肉眼可见——这也是面试常问「为什么 \`delete obj.prop\` 对性能不友好」的直接依据。

**给 V8 的优化建议**：对象属性**初始化顺序保持一致**、不要随意增删属性、避免 \`delete obj.prop\`、函数参数类型尽量稳定。

**垃圾回收（GC）**：

\`\`\`text
分代收集：新生代（存活短，Scavenge 快速回收）+ 老生代（存活久，标记-清除/标记-整理）
可达性：从「根」（全局对象、调用栈）出发能到达的对象才存活，其余回收
Stop The World：GC 运行时 JS 暂停——大对象堆积会造成卡顿
\`\`\`

**内存泄漏排查**：Chrome DevTools 的 Performance 面板录内存曲线 + Memory 面板抓堆快照对比，找「本该消失却持续增长」的对象。

### 名词解释

**JIT（即时编译，Just-In-Time Compilation）**：边运行边把「热代码」编译成机器码的技术。它的「方法」是「解释执行 + 热点探测 + 编译加速 + 反优化回退」。你可以把它类比成「同声传译」：先口头翻（解释），发现某段话反复说（热点），就提前写好稿子（编译）念得更快。

**隐藏类（Hidden Class / Shape）**：V8 给对象「形状」建的幕后描述，记录属性名与内存偏移。方法/能力：\`getShape(obj)\`（概念上）查看形状；当属性按相同顺序添加，多个对象共享同一 Shape，访问走内联缓存（IC）极快；顺序不同则 Shape 分裂，退化为字典查找（慢）。

**可达性（Reachability）**：GC 判断「对象还该不该活着」的标准——从根（全局、调用栈上的变量）出发，沿着引用链能摸到的对象就是活的。方法/规则：\`标记(mark)\` 从根遍历打标，\`清除(sweep)\` 回收未打标的。闭包、未移除的监听器，常让本该死的对象的引用链不断，造成泄漏。

### 课后练习

**练习 1**：为什么 \`delete obj.prop\` 会被认为「对性能不友好」？

> 答案：\`delete\` 会破坏对象原有的隐藏类形状，V8 可能被迫把它转到「字典模式」存储，属性访问从「偏移直读」退化为「哈希查找」，明显变慢。相比之下，把属性设为 \`obj.prop = null\` 保留形状，性能更好（若只是想「清空值」的话）。

**练习 2**：下面代码为什么可能内存泄漏？怎么改？

\`\`\`js
function onResize() { /* 处理逻辑 */ }
window.addEventListener('resize', onResize)
// 组件销毁时只调用了 remove() 清了 DOM，却忘了移除监听器
\`\`\`

> 答案：监听器 \`onResize\` 持有对组件内部变量/函数的引用，DOM 虽被移除，但监听器仍挂在 \`window\` 上，引用链不断，组件对象无法被 GC 回收 → 泄漏。改法：组件销毁时显式 \`window.removeEventListener('resize', onResize)\`；或使用 \`AbortController\` 统一取消一批监听器（\`addEventListener('resize', fn, { signal })\`）。

### 总结

这一节能颠覆一个常见错觉：很多人以为「JS 慢」是语言本身的锅。其实 V8 已经把 JS 优化到了令人发指的程度——解释器保启动速度，JIT 把热代码编译成机器码保运行速度，隐藏类让属性访问接近 C 语言的直接内存寻址。所以「JS 慢」往往不是语法慢，而是**我们写的代码破坏了 V8 的优化假设**：属性顺序乱跳、类型反复横跳、闭包hold住大对象不放。我的观点是：高级语言把性能优化的责任从「写编译器的人」转移到了「写业务的人」身上——你越懂引擎怎么工作，它就越为你加速；你越随意，它就只能保守降级。学 V8 不是为了去手写编译器，而是为了「别亲手关掉引擎的涡轮」。`
  },
  {
    id: 'brw-l8',
    chapter: 'js',
    title: '执行上下文、作用域与调用栈',
    minutes: 30,
    content: `### 本节目标

- 理解「执行上下文」与「调用栈」的关系
- 用一段可运行代码「打印出调用栈」，看函数是怎么一层层压入、弹出的
- 搞清词法作用域与闭包的内存模型

**执行上下文（Execution Context）**：函数被调用时创建，包含「变量环境、作用域链、this」。全局有一个上下文，每调用一个函数就新建一个，全部压进**调用栈**。

下面这段 Node 代码会**真实打印调用栈**，让你看见 \`a→b→c\` 是怎么一层层叠上去又弹出来的：

\`\`\`js
// 运行环境：Node.js 14+（或浏览器控制台）
// 步骤：node brw-l8.js
// 重点看 c() 里打印的 error.stack —— 它展示了「当前调用栈」

function a() { b() }
function b() { c() }
function c() {
  console.log('--- 此刻的调用栈（从下往上看）---')
  console.log(new Error().stack)
}
a()
console.log('a 执行完后，栈已清空')
\`\`\`

**栈溢出（Stack Overflow）**：无限递归会让调用栈超过上限，抛出 \`RangeError: Maximum call stack size exceeded\`。

**词法作用域（Lexical Scope）**：作用域在**写代码的位置**就定了，与「在哪里被调用」无关——这是闭包的基础。

**闭包的内存模型**：内层函数引用了外层变量，外层函数即使返回了，那些变量也不会被回收：

\`\`\`js
function counter() {
  let n = 0                  // 被内层函数引用 → 进入「闭包环境」，外层返回也不释放
  return function () { return ++n }
}
const c = counter()
console.log(c())   // 1
console.log(c())   // 2
\`\`\`

**栈 vs 堆**：

\`\`\`text
调用栈（Stack）：存执行上下文、基本类型值 —— 后进先出，自动管理，快
堆（Heap）    ：存对象、函数等引用类型 —— 靠 GC 回收，慢但能任意大小
\`\`\`

**常见坑**：① 闭包 hold 住大对象 → 堆泄漏；② 递归过深 → 栈溢出；③ 事件监听器没移除 → 对象被引用无法回收。

### 名词解释

**调用栈（Call Stack）**：记录「现在正在执行哪些函数」的栈结构，每调用一个函数就「压栈（push）」，函数返回就「弹栈（pop）」。方法：\`console.trace()\` 也能打印当前调用栈。你可以把它想成「叠盘子」：最上面的盘子（栈顶）是当前正在洗的，洗完拿走，下面的露出来。栈满（无限递归）就「盘子塌了」——栈溢出。

**执行上下文（Execution Context）**：函数执行时的「运行环境快照」，包含变量、\`this\`、作用域链。它不像有显式方法调用，而是由引擎在函数被调用时**自动创建（create）**、执行完**自动销毁（destroy）**。可类比「每次进一个房间，房间里的陈设（变量）只在这趟访问期间有效」。

**闭包（Closure）**：「函数 + 它出生时的词法作用域」的组合。它的方法/能力：\`记住（capture）\`外层变量、\`延长（extend）\`变量生命周期。闭包不是「语法」，而是「当内层函数逃出外层函数作用域时，引擎被迫保留外层变量」这一行为的结果。

### 课后练习

**练习 1**：下面代码输出什么？为什么和「调用位置」无关？

\`\`\`js
const x = '全局'
function foo() { console.log(x) }
function bar() { const x = '局部'; foo() }
bar()
\`\`\`

> 答案：输出 \`全局\`。因为 JS 是词法作用域——\`foo\` 里的 \`x\` 在「写代码时」就绑定到了它定义处（全局）的 \`x\`，和它「被 \`bar\` 调用」这件事无关。\`bar\` 里的局部 \`x\` 不影响 \`foo\` 的查找。这正是「作用域看定义处，不看调用处」。

**练习 2**：下面这段代码会栈溢出吗？为什么？

\`\`\`js
function loop(n) {
  if (n <= 0) return
  return loop(n - 1)
}
loop(100000)
\`\`\`

> 答案：在默认调用栈深度下**很可能**溢出（\`RangeError: Maximum call stack size exceeded\`）。因为每次递归调用都会往调用栈压一层，10 万层远超浏览器/Node 默认的栈容量（通常几千到一万多层）。改法：改成循环（\`for\`），或确认环境支持尾调用优化（TCO，但多数 JS 引擎实际未开启）。递归适合「深度可控」的场景。

### 总结

这一节我想让你建立的一个画面是：**代码不是「平铺」执行的，而是「一层层叠起来又拆掉」的**。调用栈就是那个叠盘子的架子，函数进出有秩序；一旦递归失控，架子就塌了。而闭包则是另一个方向的智慧——它让「已经返回的函数」还能记住自己的出身环境，这是 JS 实现私有状态、模块封装、函数工厂的基石。但能力越大责任越大：闭包记住的东西，GC 不敢回收，于是「长期存活的闭包 + 大对象引用」就成了内存泄漏的高发地。我的建议是：把调用栈想成「临时工位」（用完即清），把闭包想成「带锁的储物柜」（开了就占着），写代码时心里有这本账，Bug 会少一大半。`
  },
  {
    id: 'brw-l9',
    chapter: 'js',
    title: '事件循环：宏任务 / 微任务 / 渲染时机',
    minutes: 40,
    content: `### 本节目标

- 掌握浏览器事件循环的「一轮」长什么样
- 用一段可运行代码，亲眼确认宏任务、微任务、渲染的先后顺序
- 搞清 \`setTimeout\` 与 \`requestAnimationFrame\` 的差别

**浏览器事件循环（每一轮）**：

\`\`\`text
① 从「宏任务队列」取一个任务执行（脚本、事件回调、setTimeout、I/O）
② 执行所有「微任务」（Promise.then、queueMicrotask、MutationObserver）
③ 是否需要渲染？（约每 16.6ms 一帧，或由浏览器决定）
   → 是：执行 requestAnimationFrame 回调 → 布局 → 绘制
④ 回到 ①
\`\`\`

**关键结论**：

1. **微任务在渲染前被清空**：\`Promise.then\` 不会等下一帧，当前宏任务一结束就立刻全跑完。
2. **宏任务之间才会插入渲染**：一个超长的宏任务会把渲染挤掉 → 页面卡顿。
3. **rAF 在渲染前执行**：适合「改 DOM，让浏览器一帧画一次」。
4. **setTimeout 最小延迟约 4ms（嵌套后）**，且时机不精确（被前面的任务拖延）。

下面这段 Node 代码（Node 与浏览器模型高度一致）会**真实输出** \`1 4 3 2\`：

\`\`\`js
// 运行环境：Node.js 14+ 或浏览器控制台
// 步骤：node brw-l9.js
// 输出顺序固定为：1 4 3 2（同步 → 微任务 → 宏任务）

console.log('1')                          // 同步代码，宏任务内立即执行
setTimeout(() => console.log('2'), 0)     // 宏任务：本轮宏任务后、下一轮才执行
Promise.resolve().then(() => console.log('3'))  // 微任务：当前宏任务结束后立刻执行
console.log('4')                          // 同步代码
\`\`\`

**为什么微任务先于渲染**：微任务被定义为「当前任务的延续」，浏览器保证它们在渲染前全部跑完，避免中间态闪烁。

**rAF vs setTimeout**：

\`\`\`js
// rAF：跟随屏幕刷新（通常 60fps），浏览器不渲染（如切到后台）就暂停 → 省电、平滑
function loop() { update(); requestAnimationFrame(loop) }

// setTimeout 倒计时：后台仍可能运行，但会被节流（嵌套后 ≥4ms，后台可能 1s/次）
\`\`\`

**任务拆分的伏笔**（下一节展开）：把长任务拆成多个宏任务（\`setTimeout(0)\` / \`postMessage\` / \`scheduler.yield\`），让渲染能插队，页面不卡。

### 名词解释

**宏任务（Macrotask / Task）**：事件循环里「一轮」处理一个的工作单元，包括：脚本执行、事件回调、\`setTimeout\`/\`setInterval\`、I/O、UI 渲染相关。它的「调度方法」是 \`setTimeout(fn, 0)\`（排到下一轮宏任务）、\`queueTask(fn)\`（概念上）。每一轮循环**只取一个**宏任务执行。

**微任务（Microtask）**：当前宏任务结束后、**渲染前**必须清空的任务队列，包括：\`Promise.then/catch/finally\`、\`queueMicrotask\`、\`MutationObserver\`。方法：\`queueMicrotask(fn)\` 把函数加入微任务队列。它的特点是「插队到本轮末尾、渲染之前」，所以微任务总在下一个宏任务之前跑完。

**requestAnimationFrame（rAF）**：「在浏览器下一次重绘之前调用我」的回调。方法：\`requestAnimationFrame(cb)\` 返回 id，\`cancelAnimationFrame(id)\` 取消。它和微任务不同：微任务在「渲染前立刻」，rAF 在「渲染这一帧前」——适合做动画和 DOM 批量更新，且切后台会自动暂停（省电）。

### 课后练习

**练习 1**：下面代码输出顺序是什么？

\`\`\`js
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
setTimeout(() => console.log('D'), 0)
Promise.resolve().then(() => console.log('E'))
console.log('F')
\`\`\`

> 答案：\`A F C E B D\`。执行过程：同步打印 \`A\`、\`F\`；当前宏任务结束，清空微任务队列 → \`C\`、\`E\`；然后进入下一轮宏任务，按顺序取 \`setTimeout\` → \`B\`，再下一轮 → \`D\`。微任务总在两个 setTimeout（不同宏任务）之间被清空。

**练习 2**：为什么「一个超长的同步 for 循环」会让页面完全卡住、连滚动都动不了？

> 答案：同步 for 循环属于当前宏任务的一部分，它没结束，「一轮循环」就走不到 ②清空微任务、③渲染 那一步。浏览器整整这一轮都没机会渲染和响应输入，于是页面假死。解决思路是把长循环切成多个宏任务（用 \`setTimeout(0)\` / \`scheduler.yield()\` 让出主线程），让每一小片执行完都能插入一次渲染。

### 总结

事件循环是前端「最该懂、却最常被背成八股」的知识点。我希望你记住的不是顺序口诀，而是**「为什么是这个顺序」**：微任务被设计成「本轮延续」，是为了保证 Promise 回调在渲染前全部落地，避免用户看到半成品；渲染被夹在宏任务之间，是为了让每帧都有机会刷新；rAF 紧贴渲染，是为了动画与屏幕同步。这套设计的底层目标只有一个——**让「响应用户」和「更新画面」永远有插入的机会**。所以当你写出「卡死页面」的代码时，本质就是你霸占了「一轮循环」不让它走到渲染。下一节我会教你怎么「主动让出」主线程，把这套理论变成不卡顿的实战。`
  },
  {
    id: 'brw-l10',
    chapter: 'js',
    title: '长任务、主线程占用与 Web Worker',
    minutes: 36,
    content: `### 本节目标

- 理解「长任务（Long Task）」为何造成卡顿，以及 50ms 阈值的由来
- 掌握把长任务拆片的几种手法
- 用 Node 的 \`worker_threads\` 实测「把重活丢给另一个线程」

**长任务（Long Task）**：主线程连续执行**超过 50ms** 的任务。浏览器在此期间无法渲染、无法响应输入 → 表现为卡顿。（TBT 这个性能指标就是长任务的累加。）

**为什么是 50ms**：一帧约 16.6ms，连续占满约 3 帧用户就感知到卡。50ms 是一个「留有余地」的经验阈值。

**拆分任务（让渲染插队）**：

\`\`\`js
// ❌ 一次性处理 10 万条（一个长任务，卡死）
bigList.forEach(process)

// ✅ 分片：每片让出一帧（配合 setTimeout(0) 或 postMessage）
const CHUNK = 1000
let i = 0
function step() {
  const end = Math.min(i + CHUNK, bigList.length)
  for (; i < end; i++) process(bigList[i])
  if (i < bigList.length) setTimeout(step, 0)   // 让渲染/交互插队
}
step()
\`\`\`

**现代方案 \`scheduler.yield()\`**（Chrome 支持）：\`await scheduler.yield()\` 主动让出主线程，比 \`setTimeout(0)\` 调度更合理（不会被压到最低优先级）。

**Web Worker（真正的并行）**：把重计算丢到独立线程，不占主线程。下面这段 **Node 版 Worker 示例**可真实运行，演示「主线程不被阻塞」：

\`\`\`js
// 运行环境：Node.js 14+（使用内置 worker_threads，无需装包）
// 步骤：把下面内容存为 brw-l10.js，执行  node brw-l10.js
// 你会看到：主线程持续打印 "主线程还在干活"，同时 Worker 在并行算斐波那契，直到 Worker 完成

const { Worker } = require('node:worker_threads')

// Worker 线程里跑的重活（这里是耗时递归）
const workerCode = \`
  const { parentPort } = require('node:worker_threads')  // eval 模式下 parentPort 不是全局，需手动引入
  function fib(n){ return n < 2 ? n : fib(n-1)+fib(n-2) }
  const start = Date.now()
  const r = fib(40)                 // 够重、又不会等太久（约 1 秒量级）
  parentPort.postMessage({ result: r, ms: Date.now()-start })
\`
const w = new Worker(workerCode, { eval: true })

// 主线程同时干别的事，不被 Worker 拖住（一直「有心跳」直到 Worker 完成）
let t = 0
const id = setInterval(() => {
  t += 100
  console.log('主线程还在干活...', t, 'ms')
}, 100)

w.on('message', (m) => {
  clearInterval(id)   // Worker 完成后停掉主线程的心跳
  console.log(\`Worker 算完 fib(40)=\${m.result}，耗时 \${m.ms}ms（主线程全程没被卡）\`)
  w.terminate()
})
\`\`\`

**Worker 的限制**（面试点）：没有 DOM（不能操作 \`document\`/\`window\`）；只能靠 \`postMessage\` 通信（结构化克隆，大对象可用 Transferable 零拷贝转移）；有同源限制；可开多个（受内存限制）。SharedWorker 多页面共享，Service Worker 是网络代理层（见存储章节）。

**适用场景**：图像处理、大数据计算、加密、音视频转码、大 JSON 解析。

### 名词解释

**长任务（Long Task）**：主线程连续占用的时长超过 50ms 的任务。它的「判定方法」是浏览器性能 API：\`new PerformanceObserver(list => {...}).observe({ type: 'longtask', buffered: true })\`，超过阈值的任务会被上报。长任务多 = 用户觉得「卡」，对应指标 TBT（总阻塞时间）。

**任务分片（Task Chunking）**：把一个大任务切成小块、块与块之间让出主线程的技术。方法：\`setTimeout(fn, 0)\`（排到下一轮宏任务）、\`postMessage\` 自派发、\`scheduler.yield()\`（现代 API 主动让出）。本质都是「别一次性霸占主线程」。

**Web Worker**：浏览器/Node 里的「独立线程」，能跑 JS 但不碰 DOM。方法：\`new Worker(url)\` 创建、\`worker.postMessage(data)\` 发消息、\`worker.onmessage\` 收消息、\`worker.terminate()\` 终止。它把「计算」和「界面」拆到不同线程，是前端对抗长任务最有效的大招（小活用分片，大活用 Worker）。

### 课后练习

**练习 1**：\`scheduler.yield()\` 和 \`setTimeout(fn, 0)\` 都能「让出主线程」，为什么前者更受推荐？

> 答案：语义和优先级不同。\`setTimeout(0)\` 把回调排到「下一个宏任务队列末尾」，可能被大量其他宏任务（如其他 setTimeout、I/O 回调）插队，导致分片后的活迟迟轮不到；\`scheduler.yield()\` 是专门设计的「让出控制信号」，告诉调度器「我主动让一下，但请把后续尽快排上」，对保持响应更友好，也不会被压到最低优先级。

**练习 2**：下面哪种场景适合用 Web Worker，哪种不适合？A) 实时搜索框输入联想（每次按键都要改 DOM 显示结果）；B) 前端压缩 500MB 用户上传的视频。

> 答案：A 不适合——搜索联想要频繁改 DOM，而 Worker 没有 DOM，且输入响应要求极低延迟，分片即可；B 适合——视频压缩是纯计算重活，放主线程会卡死整个页面，丢给 Worker 既能并行又不阻塞界面。判断标准：「要不要操作 DOM」「重不重」「能不能序列化传数据」。

### 总结

这一节是「事件循环」的实战落点。理论说了半天「让渲染插队」，到这里终于给出具体武器：**小活用任务分片（setTimeout/yield），大活用 Web Worker**。我的核心观点是——前端性能的很多痛苦，源于我们习惯性地把「所有事都堆在主线程这条单行道上」。主线程既要跑 JS、又要解析、又要布局绘制、还要响应点击，它已经够忙了。所以优秀的前端不是「把代码写得多快」，而是「懂得把主线程让出来」：能分片的别一把梭，能并行的丢给 Worker，连动画都走合成线程。记住 50ms 这个数字——它是用户感知「卡」与「不卡」的分水岭，也是你写每一段循环时该在心里拉响的警报。`
  },
  {
    id: 'brw-l11',
    chapter: 'net',
    title: '浏览器缓存机制与 CDN',
    minutes: 40,
    content: `### 本节目标

- 掌握「强缓存」与「协商缓存」的区别与流程
- 用一个可运行的 Node 小服务器，实测「304 协商缓存」是怎么发生的
- 理解「带 hash 的文件名」为什么是前端工程的关键

**两级缓存**：

\`\`\`text
① 强缓存：不请求服务器，直接用本地缓存
   Expires（绝对时间，老）/ Cache-Control（相对时间，推荐）
   → Cache-Control: max-age=31536000 表示一年内直接用
② 协商缓存：还是发请求，服务器说「没变」→ 返回 304，浏览器用本地副本
   Last-Modified / If-Modified-Since（秒级，可能不精确）
   ETag / If-None-Match（内容指纹，推荐）
\`\`\`

**优先级**：\`Cache-Control\` > \`Expires\`；协商缓存里 \`ETag\` 优先于 \`Last-Modified\`。

**流程**：

\`\`\`text
请求资源
  → 命中断言缓存（Cache-Control 未过期）？→ 直接 200(from cache)
  → 否则发请求带 If-None-Match / If-Modified-Since
      → 服务器 304 → 用本地缓存
      → 服务器 200 + 新资源 → 更新缓存
\`\`\`

下面这段 Node 代码**真实实现**了 ETag 协商缓存：第一次返回 200+ETag，第二次带 \`If-None-Match\` 请求时返回 304。

\`\`\`js
// 运行环境：Node.js 14+（仅用内置 http，无需装包）
// 步骤：node brw-l11.js  （一个文件搞定：先起服务，再自动连发两次请求）
//       第一次打印 200（带 ETag），第二次打印 304（命中协商缓存）

const http = require('node:http')
const crypto = require('node:crypto')
const DATA = 'hello cache'
const etag = '"' + crypto.createHash('md5').update(DATA).digest('hex') + '"'

const server = http.createServer((req, res) => {
  const clientETag = req.headers['if-none-match']
  if (clientETag === etag) {
    res.writeHead(304, { 'ETag': etag, 'Cache-Control': 'max-age=0' })
    return res.end()                      // 没响应体，浏览器用本地缓存
  }
  res.writeHead(200, { 'ETag': etag, 'Cache-Control': 'max-age=0' })
  res.end(DATA)
})

// 先等服务器真正启动成功，再发起请求（放进 listen 回调，避免「服务还没起来就请求」的竞态）
server.listen(3000, async () => {
  console.log('server on http://localhost:3000')
  const r1 = await fetch('http://localhost:3000/')
  const gotEtag = r1.headers.get('etag')
  console.log('第一次:', r1.status, 'ETag=', gotEtag)
  const r2 = await fetch('http://localhost:3000/', { headers: { 'If-None-Match': gotEtag } })
  console.log('第二次(带ETag):', r2.status, '=> 304 即命中协商缓存')
  server.close()
})
\`\`\`

**hash 命名与缓存策略（工程关键）**：

\`\`\`html
<!-- 文件名带内容 hash：内容变了 hash 变 → 强制走新文件 -->
<script src="/assets/index-CRw3c4JD.js"></script>
\`\`\`

\`\`\`text
静态资源（带 hash）：Cache-Control: max-age=31536000, immutable  （一年强缓存）
HTML（不带 hash）  ：Cache-Control: no-cache                    （每次协商，拿到最新引用）
\`\`\`

**CDN 原理**：用户 → 就近边缘节点（DNS 解析到最近 CDN）→ 命中缓存直接返，未命中回源站拉取并缓存。优势：就近省时、边缘扛流量、源站压力小；配合 hash 文件名可「更新即全网生效」。

### 名词解释

**强缓存（Strong / Force Cache）**：浏览器**根本不发起网络请求**，直接用本地副本。它的「判定方法」是看响应头 \`Cache-Control: max-age=N\` 或 \`Expires\` 是否还有效——有效就直接 200(from disk/memory cache)。优点：最快（零网络）；缺点：资源更新后用户可能拿到旧的（所以用 hash 文件名破局）。

**协商缓存（Conditional / Revalidation Cache）**：浏览器**还是会发请求**，但带上「我本地这份的版本标识」（ETag 或 Last-Modified），服务器判断「没变」就回 304（空体），浏览器继续用本地。方法：\`If-None-Match: <etag>\`（问「和这个指纹一样吗」）、\`If-Modified-Since: <时间>\`。它是「强缓存过期后」的第二道防线。

**CDN（内容分发网络，Content Delivery Network）**：把内容缓存到离用户近的「边缘节点」的网络。方法/能力：\`就近解析\`（DNS 把用户导向最近节点）、\`边缘缓存\`（节点存副本）、\`回源\`（未命中时去源站取）。你可以把它想成「在家门口开了个便利店，不用每次都跑总仓」。

### 课后练习

**练习 1**：你的网站把 \`app.js\` 设了 \`Cache-Control: max-age=3600\`，一小时后你改了代码重新部署，但用户反馈「还是旧逻辑」。可能原因和解决办法？

> 答案：强缓存一小时内未过期，浏览器直接用本地旧 \`app.js\`，不请求服务器，所以拿到旧的。若文件名不带 hash，用户得等一小时才更新。正确做法：构建时给文件名加**内容 hash**（\`app.ab12cd.js\`），改代码 hash 变 → URL 变 → 浏览器当新资源重新请求；同时 HTML 用 \`no-cache\` 保证每次拿到最新引用。

**练习 2**：\`ETag\` 和 \`Last-Modified\` 都能做协商，为什么更推荐 \`ETag\`？

> 答案：① \`Last-Modified\` 精度到「秒」，1 秒内多次改动会误判为未变；② 某些内容没变但修改时间变了（如定时重新生成），\`Last-Modified\` 会误判为变；③ \`ETag\` 是「内容指纹」（如 md5），内容一字未改就命中，最准确。所以规范推荐以 \`ETag\` 为准（两者可共存，ETag 优先）。

### 总结

缓存是前端性能里「投入产出比最高」的一环，但也是最容易被误解的一环。我的观点是：很多人把缓存当成「设个 max-age 就完事」，却没理解「强缓存和协商缓存是两套独立机制，且强缓存会让更新『失联』」。真正稳健的工程做法是「**带 hash 的资源用一年强缓存，HTML 用 no-cache 每次协商**」——让「不变的东西永不重下，变的东西永远最新」。CDN 则是把这个思路放大到地理尺度：把副本放到用户家门口。学完这节你应建立的直觉是：缓存不是「要不要」，而是「哪类资源用哪种策略」，这是每个上线项目都绕不开的硬功夫。`
  },
  {
    id: 'brw-l12',
    chapter: 'net',
    title: '同源策略与跨域：CORS 全解',
    minutes: 40,
    content: `### 本节目标

- 理解「同源策略」到底在防什么
- 用一个可运行的 Node 小服务器，实测「没配 CORS 头 vs 配了」的请求差异
- 搞清楚「预检（Preflight）」什么时候发生

**同源策略（SOP，Same-Origin Policy）**：协议 + 域名 + 端口三者相同才算「同源」。不同源时，浏览器**禁止前端 JS 读取**跨域响应（注意：请求其实可能发出了，只是结果被拦），且默认不带跨域 cookie。

**CORS（跨域资源共享）**：服务器通过响应头声明「允许谁访问」，浏览器据此放行。

**简单请求**（GET/POST + 简单头，且非自定义 Content-Type）：

\`\`\`text
响应头：
Access-Control-Allow-Origin: https://a.com   （或 * 表示任意）
Access-Control-Allow-Credentials: true        （需要带 cookie 时）
\`\`\`

**预检请求（Preflight）**：非简单请求（如 \`PUT\`/\`DELETE\`、\`application/json\`、自定义头）会**先发一个 \`OPTIONS\`** 探测：

\`\`\`text
请求(OPTIONS)：
  Access-Control-Request-Method: PUT
  Access-Control-Request-Headers: content-type
响应：
  Access-Control-Allow-Methods: PUT, DELETE
  Access-Control-Allow-Headers: content-type
  Access-Control-Max-Age: 86400     （预检结果缓存一天）
\`\`\`

下面这段 Node 代码**真实演示** CORS 的三种情况：同源成功、跨域配了 \`Access-Control-Allow-Origin: *\`（放行）、跨域没配 CORS（被浏览器拦截）。用浏览器打开页面即可见差异（Node 端只负责「服务器行为」，拦截由浏览器执行）：

\`\`\`js
// 运行环境：Node.js 14+（仅用内置 http）
// 步骤：node brw-l12-server.js  启动后，用浏览器打开 http://localhost:3000/ 看控制台
//       你会看到三种结果：① 同源成功；② 跨域+配了 CORS 成功；③ 跨域+没配 CORS 被浏览器拦截。

const http = require('node:http')

// 服务器 3000：返回一个含「跨域请求测试」的页面，并给自身接口配好 CORS
http.createServer((req, res) => {
  if (req.url === '/api/same') {
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*' })
    return res.end('来自同源 3000 的接口')
  }
  // 返回测试页
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(\`<h3>打开控制台看 CORS 效果</h3>
    <script>
      // ① 同源请求：成功（同源策略不限制自己）
      fetch('/api/same').then(r=>r.text()).then(t=>console.log('同源 OK:', t))
      // ② 跨域到 4000，但该接口配了 CORS 头：成功（服务器明确放行）
      fetch('http://localhost:4000/api/ok').then(r=>r.text())
        .then(t=>console.log('跨域+CORS OK:', t))
        .catch(e=>console.log('跨域+CORS 失败(意外):', e.message))
      // ③ 跨域到 4000，该接口没配 CORS 头：被浏览器拦截
      fetch('http://localhost:4000/api/other').then(r=>r.text())
        .then(t=>console.log('跨域无CORS OK:', t))
        .catch(e=>console.log('跨域无CORS 被拦截(预期):', e.message))
    </script>\`)
}).listen(3000, () => console.log('页面+同源接口: http://localhost:3000'))

// 服务器 4000：模拟「另一个源」，两个接口一个配 CORS、一个没配
http.createServer((req, res) => {
  if (req.url === '/api/ok') {
    // ✅ 配了 CORS 头：跨域也放行
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
    return res.end('来自 4000 的接口（配了 CORS，跨域也成功）')
  }
  // ❌ 没配 CORS 头：跨域会被浏览器拦截
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('来自 4000 的接口（但没配 CORS）')
}).listen(4000, () => console.log('跨域接口: http://localhost:4000（/api/ok 配了CORS，/api/other 没配）'))
\`\`\`

**带 cookie 的注意点**：\`credentials: 'include'\` 时，\`Allow-Origin\` **不能是 \`*\`**，必须明确写域名，且服务器要开 \`Access-Control-Allow-Credentials: true\`。

**其他跨域方案**：JSONP（\`<script>\` 不受同源限制，只支持 GET，已过时）、反向代理（开发期 \`/api\` → 后端，最省心）、\`postMessage\`（iframe 跨窗口）、\`document.domain\`（同主域子域旧方案，边缘化）。

**排查口诀**：看到 CORS 报错，先看「是不是预检没过（OPTIONS 404/缺响应头）」，再看 \`Allow-Origin\` 是否匹配、credentials 是否冲突。

### 名词解释

**同源策略（SOP）**：浏览器的安全基线，规定「不同源（协议/域名/端口任一不同）的页面，不能互相读取数据」。它的「能力」是：拦截跨源读取响应、限制跨源写 cookie。你可以把它想成「隔壁小区的人不能进你家翻抽屉」——但能站在门口喊话（请求可能发出）。它防的是「恶意网站偷读你已登录的别的网站数据」。

**CORS（跨域资源共享，Cross-Origin Resource Sharing）**：服务器用响应头**主动声明**「允许哪些源访问我」。方法/响应头：\`Access-Control-Allow-Origin\`（允许谁）、\`Access-Control-Allow-Methods\`（允许哪些方法）、\`Access-Control-Allow-Headers\`（允许哪些请求头）、\`Access-Control-Allow-Credentials\`（是否允许带 cookie）。它把「是否放行」的决定权交还给服务器。

**预检（Preflight）**：浏览器在发「非简单跨域请求」前，先自动发一个 \`OPTIONS\` 探测，问服务器「我打算用 PUT + 这个头，你允许吗」。方法：服务器回 \`Access-Control-Allow-Methods/Headers\` 表示同意，\`Access-Control-Max-Age\` 表示「这次探测结果我缓存多久，期间别再问」。它是 CORS 的「先问后做」安全机制。

### 课后练习

**练习 1**：前端用 \`fetch('https://api.b.com/data', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({a:1}) })\` 跨域请求，为什么浏览器会先发一个 \`OPTIONS\`？

> 答案：因为 \`Content-Type: application/json\` 不属于「简单请求头」（简单头只限 \`text/plain\`、\`application/x-www-form-urlencoded\`、\`multipart/form-data\` 等），于是该请求被判定为「非简单请求」，浏览器必须先发 \`OPTIONS\` 预检，确认服务器允许 \`application/json\` 和 \`POST\` 后，才发真正的 POST。

**练习 2**：前端带 \`credentials: 'include'\` 跨域，服务器返回 \`Access-Control-Allow-Origin: *\`，能拿到响应吗？为什么？

> 答案：不能。带凭据（cookie）的跨域请求，浏览器要求 \`Access-Control-Allow-Origin\` 必须是**具体的源**（不能是通配符 \`*\`），同时服务器还要返回 \`Access-Control-Allow-Credentials: true\`。用 \`*\` 会被浏览器直接拒绝，报 CORS 错误。这是为了防止「任意网站都能带着用户的 cookie 去访问目标接口」。

### 总结

跨域是前端新手最易卡住、也最容易被「前端背锅」的话题。我想澄清一个关键事实：**CORS 不是前端能「解决」的问题，而是后端该「配置」的响应头**。浏览器之所以拦你，恰恰是因为它在忠实地执行同源策略——这层保护挡住了「恶意网站偷读你已登录的银行数据」这类攻击。所以当你遇到 CORS 报错，正确动作是「找后端加响应头」，而不是在前端用什么奇技淫巧绕过（那往往意味着你在破坏安全模型）。唯一前端能独立搞定的跨域是「开发期反向代理」。记住这条边界：同源策略是浏览器给用户的铠甲，CORS 是服务器递出的「访客通行证」——你只能申请，不能自己造。`
  },
  {
    id: 'brw-l13',
    chapter: 'net',
    title: 'Web 存储与 Service Worker',
    minutes: 40,
    content: `### 本节目标

- 对比 cookie / localStorage / sessionStorage / IndexedDB 四种存储
- 用一个浏览器可打开的 HTML，亲手体验四种存储的读写与生命周期
- 理解 Service Worker 作为「网络代理」能做什么（离线、缓存优先）

**存储方案对比**：

| 方案 | 容量 | 持久性 | 作用域 | 典型场景 |
| --- | --- | --- | --- | --- |
| Cookie | ~4KB | 可设过期 | 域名 | 会话/认证（自动携带） |
| localStorage | ~5MB | 永久（手动清） | 源 | 偏好设置、缓存数据 |
| sessionStorage | ~5MB | 关标签页即清 | 标签页 | 临时表单草稿 |
| IndexedDB | 大（GB 级） | 永久 | 源 | 离线数据、大对象 |

**Cookie 要点**：\`HttpOnly\`（防 XSS 读）、\`Secure\`（仅 HTTPS 携带）、\`SameSite\`（防 CSRF：Lax/Strict/None）。每次请求自动携带 → 别往里塞大数据。

下面这个 HTML，**在浏览器打开**就能亲手读写四种存储，直观感受「谁关页面还在、谁刷新还在」：

\`\`\`html
<!-- 运行环境：任意现代浏览器 -->
<!-- 步骤：存为 brw-l13.html，用浏览器打开，按 F12 看 Console；再试「刷新」和「关掉重开标签页」对比差异 -->
<!-- ⚠️ 建议用本地服务打开（如 npx serve 或 VS Code Live Server）。直接用 file:// 打开时，
     cookie 可能被浏览器忽略、IndexedDB 在部分浏览器下也会受限——它们都依赖「源(origin)」 -->

<!DOCTYPE html>
<html lang="zh">
<head><meta charset="UTF-8"><title>四种存储演示</title></head>
<body>
  <h3>打开控制台看输出；刷新页面 / 关掉重开对比谁还在</h3>
  <script>
    // 1) localStorage：关页面、刷新都在（同源永久）
    localStorage.setItem('ls', '我关掉浏览器还在')
    console.log('localStorage:', localStorage.getItem('ls'))

    // 2) sessionStorage：只在这个标签页会话内，关标签页就没
    sessionStorage.setItem('ss', '我关标签页就消失')
    console.log('sessionStorage:', sessionStorage.getItem('ss'))

    // 3) cookie：随请求自动带，可设过期；这里用 document.cookie 写（非 HttpOnly）
    document.cookie = 'ck=hello; max-age=60'   // 60 秒后过期
    console.log('cookie:', document.cookie)

    // 4) IndexedDB：异步、容量大，适合存结构化/大数据
    const req = indexedDB.open('demoDB', 1)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv')
    }
    req.onsuccess = (e) => {
      const db = e.target.result
      const tx = db.transaction('kv', 'readwrite')
      tx.objectStore('kv').put('我存在IndexedDB', 'key1')
      tx.oncomplete = () => {
        db.transaction('kv').objectStore('kv').get('key1').onsuccess = (ev) =>
          console.log('IndexedDB:', ev.target.result)
      }
    }
  </script>
</body>
</html>
\`\`\`

**Service Worker（SW）**：运行在独立线程的**网络代理**，能拦截 \`fetch\` 请求并决定「走缓存 / 走网络 / 混合」。

\`\`\`js
// 注册 + 安装缓存 + 拦截 fetch（浏览器环境，放 sw.js + 主线程注册）
// 主线程：
navigator.serviceWorker.register('/sw.js')

// sw.js：
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('v1').then((c) => c.addAll(['/', '/app.js'])))
})
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))  // 缓存优先
  )
})
\`\`\`

**SW 关键点**：必须 HTTPS（或 localhost）；首次访问注册后**刷新一次**才接管；更新要 \`skipWaiting\` + \`clients.claim\` 并清理旧缓存。**PWA** = SW（离线/缓存优先）+ Manifest（可安装/图标）+ 推送，核心价值是离线可用、秒开、类原生体验。

### 名词解释

**localStorage**：同源下的「永久键值仓库」，容量约 5MB，关浏览器数据仍在，除非代码或用户手动清。方法：\`setItem(k,v)\`、\`getItem(k)\`、\`removeItem(k)\`、\`clear()\`。适合存「不敏感的用户偏好」（如主题、语言）。注意：它是**同步** API，存太大或频繁读写会阻塞主线程。

**sessionStorage**：和 localStorage 几乎一样，但**生命周期绑定于「标签页会话」**——关掉这个标签页数据就没了（刷新不丢，新开标签不算同一会话）。方法同 localStorage。适合存「本次访问的临时草稿」。

**IndexedDB**：浏览器内的「嵌入式数据库」，异步、容量大（GB 级）、支持事务和索引，适合存结构化数据和离线内容。方法：\`open(name, ver)\` 打开、\`objectStore\` 操作表、\`transaction\` 起事务、\`put/get\` 读写。它是 PWA 离线能力的存储底座。

**Service Worker（SW）**：浏览器里的「网络代理线程」，能拦截页面所有 \`fetch\`。方法：\`register()\` 注册、\`self.addEventListener('fetch', ...)\` 拦截、\`caches.open/addAll/match\` 管理缓存、\`skipWaiting()\`+\`clients.claim()\` 控制更新时机。它让「离线可用」「缓存优先」成为可能。

### 课后练习

**练习 1**：用户登录态 token 应该存 cookie、localStorage 还是 sessionStorage？各有什么权衡？

> 答案：若需要「每次请求自动带凭据给后端」且防 XSS 偷读，用 **HttpOnly + Secure + SameSite 的 cookie** 最稳（JS 读不到，天然抗 XSS）。若图方便放 \`localStorage\`，要自己手动塞进请求头，且一旦页面有 XSS 就会被偷走 token。sessionStorage 关标签页就清，不适合「记住登录」。结论：敏感凭证优先 HttpOnly cookie；纯前端态（如 UI 主题）才放 localStorage。

**练习 2**：Service Worker 为什么说「首次访问后需要刷新一次才生效」？

> 答案：SW 的注册和激活是异步的——首次访问时 SW 还在 \`install\`/\`activate\`，此时页面已经被旧的（或没有）SW 控制着；等 SW 激活后，必须等「下一次导航/刷新」浏览器才会让新 SW 接管当前页面。这就是为什么 SW 改动后常看到「刷新后生效」，或用 \`clients.claim()\` 主动让新 SW 立即控制已有页面。

### 总结

存储这一节，我愿你建立的认知是：**没有「最好的存储」，只有「最合场景的存储」**。Cookie 为「认证自动携带」而生但容量小；localStorage 简单永久却同步会卡；sessionStorage 临时但一关就没；IndexedDB 强大异步但 API 繁琐。选错存储，要么撑不下数据，要么悄悄拖慢主线程，要么把敏感 token 暴露在 XSS 面前。而 Service Worker 则是另一个维度的能力跃迁——它让网页从「必须联网才能用」变成「能离线、能缓存优先」。但 SW 也有代价：HTTPS 强制、更新心智负担、调试坑多。我的建议是：日常状态用对存储，离线/秒开需求才上 SW+PWA，别为了「听起来高级」而滥用。`
  },
  {
    id: 'brw-l14',
    chapter: 'perf',
    title: '前端安全：XSS / CSRF 与防御',
    minutes: 36,
    content: `### 本节目标

- 分清 XSS 的三种类型，并用一段 Node 代码演示「未转义用户输入」如何被注入
- 理解 CSRF 的攻击链路与防御
- 认识关键安全响应头

**XSS（跨站脚本攻击）**：把恶意脚本注入页面并执行。

\`\`\`text
存储型：恶意脚本存进服务器（如评论），所有人访问都中招
反射型：恶意脚本在 URL 参数里，诱导用户点击钓鱼链接触发
DOM 型：前端自己把不可信数据写进 DOM（innerHTML / v-html）触发
\`\`\`

下面这段 Node 代码**真实演示**「未过滤的用户输入」如何变成 XSS 注入点：

\`\`\`js
// 运行环境：Node.js 14+（仅用内置 http）
// 步骤：node brw-l14-server.js  启动在 3000
//       浏览器访问 http://localhost:3000/?name=<img src=x onerror=alert(1)>
//       若服务端直接把 name 拼进 HTML（漏洞版），浏览器会执行 onerror 里的脚本

const http = require('node:http')
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const name = url.searchParams.get('name') || '访客'

  // ❌ 漏洞版：直接拼接不可信输入（演示用，请勿在生产这么写）
  const unsafe = \`<h1>你好, \${name}</h1>\`

  // ✅ 安全版：做 HTML 转义（把 < > & " ' 转成实体）
  const escape = (s) => s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c])
  const safe = \`<h1>你好, \${escape(name)}</h1>\`

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  // 这里输出「安全版」，你可以把 safe 改成 unsafe 亲自看漏洞效果
  res.end(\`<p>安全版输出：</p>\${safe}<p>把上面 safe 换成 unsafe 再访问带恶意参数的 URL 即可复现 XSS</p>\`)
}).listen(3000, () => console.log('http://localhost:3000  （试 ?name=<img src=x onerror=alert(1)>）'))
\`\`\`

**XSS 防御**：① 输出转义（\`< > & " '\`）；② CSP（\`Content-Security-Policy: default-src 'self'\` 限制脚本来源兜底）；③ Cookie 设 \`HttpOnly\`（XSS 也读不到会话）；④ 输入白名单校验，富文本用白名单过滤。

**CSRF（跨站请求伪造）**：用户已登录，恶意网站诱导浏览器**自动带 cookie** 发请求：

\`\`\`text
用户登录银行 → 点开钓鱼页 → <img src="/api/transfer?to=hacker&amount=1000">
浏览器自动带 cookie 发出 → 银行以为是本人操作
\`\`\`

下面这段 Node 代码**真实演示** CSRF 的攻击链路（两个端口模拟「银行」和「钓鱼页」）：

\`\`\`js
// 运行环境：Node.js 14+（仅用内置 http）
// 步骤：node brw-l14-csrf.js  → 先访问 http://localhost:3000/login 登录（种 cookie），
//       再访问 http://localhost:4000 钓鱼页，点里面的链接，看银行是否「真的转了账」
// 注：CSRF 本质是「借你的 cookie 冒名办事」。这里用两个端口（同站不同源）让 demo 能在本地跑通；
//     真实攻击是跨「站点」（attacker.com → bank.com），那时才轮到 SameSite 出手拦截。

const http = require('node:http')

// ① 银行（3000）：/login 种一个「已登录」cookie，/transfer 校验 cookie 后转账
http.createServer((req, res) => {
  const loggedIn = (req.headers.cookie || '').includes('login=1')
  if (req.url.startsWith('/transfer')) {
    if (loggedIn) return res.end('⚠️ 银行真的执行了转账！因为请求自动带上了你的登录 cookie（CSRF 成功）')
    return res.end('银行：你未登录，拒绝转账')
  }
  if (req.url === '/login') {
    res.writeHead(200, { 'Set-Cookie': 'login=1' })
    return res.end('你已登录银行（cookie 已种下）。现在访问 http://localhost:4000 试试')
  }
  res.end('银行首页：先访问 /login 登录')
}).listen(3000, () => console.log('银行: http://localhost:3000/login'))

// ② 钓鱼页（4000）：诱导用户点一个指向银行的链接（浏览器会自动带上银行 cookie）
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(\`<h3>恭喜你中奖了！点我领取</h3>
    <p><a href="http://localhost:3000/transfer?to=hacker&amount=1000">点击领取奖金</a></p>
    <p>你在银行已登录的状态下点这个链接，浏览器会自动带上银行的 cookie，银行会以为是你本人操作。</p>\`)
}).listen(4000, () => console.log('钓鱼页: http://localhost:4000（先在 3000 登录，再来点链接）'))
\`\`\`

**CSRF 防御**：① \`SameSite\` Cookie（Lax/Strict，跨站不再自动带）；② 校验 \`Origin\`/\`Referer\`；③ CSRF Token（请求带随机 token，服务端校验）；④ 敏感操作二次验证。

**其他安全头**：\`X-Frame-Options: DENY\` / \`frame-ancestors\`（防点击劫持）、\`X-Content-Type-Options: nosniff\`（防 MIME 嗅探）、HSTS（强制 HTTPS）。

### 名词解释

**XSS（跨站脚本，Cross-Site Scripting）**：攻击者把恶意 JS 注入到别人会访问的页面里执行的攻击。它的「注入方法」常是：把脚本塞进评论/URL 参数/未转义的 DOM 写入。防御方法（对策）：输出转义、CSP、HttpOnly cookie、输入白名单。记住：XSS 的本质是「把数据当成了代码执行」。

**CSRF（跨站请求伪造，Cross-Site Request Forgery）**：攻击者借「用户已登录的浏览器」自动携带的 cookie，冒充用户发请求。它的「触发方法」是：诱导用户访问恶意页，页面自动发起跨站请求（\`<img>\`/表单自动提交）。防御方法：SameSite Cookie、CSRF Token、校验来源、二次验证。本质是「借你的身份办事」。

**CSP（内容安全策略，Content Security Policy）**：用响应头声明「页面允许从哪些来源加载脚本/样式/图片等」的安全策略。方法：\`Content-Security-Policy: default-src 'self'; script-src 'self'\`（只允许同源脚本）。它是 XSS 的「兜底网」——即使有注入，脚本来源不在白名单也会被拦。

### 课后练习

**练习 1**：下面 Vue 代码有什么安全隐患？怎么改？

\`\`\`vue
<div v-html="userComment"></div>
\`\`\`

> 答案：若 \`userComment\` 来自用户输入且未经白名单过滤，\`v-html\` 会把它当 HTML 插入并执行其中的 \`<script>\` 或 \`onerror\` 等事件，造成 DOM 型 XSS。改法：① 默认不要 \`v-html\`，用 \`{{ }}\` 文本插值（自动转义）；② 若必须渲染富文本（如文章），用 \`DOMPurify\` 等库做白名单净化后再 \`v-html\`。

**练习 2**：为什么光靠 \`HttpOnly\` cookie 还不足以完全防住 CSRF？

> 答案：\`HttpOnly\` 防的是「XSS 偷读 cookie 内容」，但 CSRF 根本不需要读 cookie——它利用的是「浏览器会自动把 cookie 附带在跨站请求上」这一机制。所以 \`HttpOnly\` 对 CSRF 无效。防 CSRF 要靠 \`SameSite\` Cookie（跨站不带）、CSRF Token（攻击者页面拿不到）、校验来源等手段。

### 总结

安全这节我想纠正一个心态：很多人把安全防护当成「上线前补一道」的附属品，但 XSS/CSRF 的可怕之处在于——它们攻击的不是「你的服务器」，而是「你用户的浏览器和身份」。XSS 偷的是用户的数据和会话，CSRF 借的是用户的身份去干坏事，受害者都是用户，锅却算在开发者头上。我的观点是：**安全头（CSP、HttpOnly、SameSite）是「低成本高收益」的兜底，必须默认开启**；而真正的核心纪律只有一条——「绝不信任任何外部输入，所有进入 DOM 的数据都要么转义、要么白名单净化」。框架的自动转义已经帮你挡了大部分，千万别用 \`v-html\`/\`innerHTML\` 亲手把门打开。安全不是功能，是底线。`
  },
  {
    id: 'brw-l15',
    chapter: 'perf',
    title: '核心性能指标与优化实践',
    minutes: 36,
    content: `### 本节目标

- 掌握 FCP / LCP / CLS / TBT / INP 五大核心指标的含义
- 用一段浏览器可运行的代码，亲手测量「首屏绘制」相关指标
- 形成一套「按指标对症下药」的优化清单

**五大核心指标**：

\`\`\`text
FCP 首次内容绘制  ：第一个文本/图片出现的时间点（"开始有东西了"）
LCP 最大内容绘制  ：视口内最大可见元素（首屏主体）绘制完成（衡量加载体验）
CLS 布局偏移      ：页面元素意外移动的总量（衡量稳定性）
TBT 总阻塞时间    ：主线程被长任务阻塞的累计时长（衡量交互准备）
INP 交互延迟      ：用户交互到浏览器响应的延迟（接替 FID，衡量交互响应）
\`\`\`

**优化目标参考**：LCP < 2.5s、INP < 200ms、CLS < 0.1。

下面这段 HTML，**在浏览器打开**就能用 Performance API 亲手测 FCP/LCP/CLS：

\`\`\`html
<!-- 运行环境：任意现代浏览器 -->
<!-- 步骤：存为 brw-l15.html，用浏览器打开（建议用无痕+慢速网络模拟），看控制台 -->

<!DOCTYPE html>
<html lang="zh">
<head><meta charset="UTF-8"><title>核心性能指标实测</title></head>
<body>
  <h1 id="main">我是首屏最大内容（LCP 候选）</h1>
  <p>打开控制台看 FCP / LCP / CLS 实测值</p>
  <script>
    // FCP：paint 类型里只有 first-paint / first-contentful-paint 两类条目
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.name === 'first-contentful-paint') console.log('FCP =', e.startTime.toFixed(1), 'ms')
      }
    }).observe({ type: 'paint', buffered: true })

    // LCP：是独立的 largest-contentful-paint 类型（paint 里没有 LCP 条目，必须单独监听）
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) console.log('LCP =', e.startTime.toFixed(1), 'ms')
    }).observe({ type: 'largest-contentful-paint', buffered: true })

    // CLS：累计布局偏移
    let cls = 0
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) cls += e.value
      console.log('CLS(累计) =', cls.toFixed(3))
    }).observe({ type: 'layout-shift', buffered: true })
  </script>
</body>
</html>
\`\`\`

**关键渲染路径（CRP，Critical Rendering Path）**：从 HTML 到首帧必需的资源链（HTML 解析 → CSS 阻塞渲染 → 脚本阻塞解析 → 首绘）。缩短 CRP = 减少关键资源数量 + 缩小体积 + 消除阻塞。

**按指标优化清单**：

\`\`\`text
LCP：图片 preload + 现代格式(AVIF/WebP) + 尺寸匹配 + 懒加载非首屏；字体 font-display:swap；首屏 SSR/流式
CLS：图片/广告位预留尺寸(width/height、aspect-ratio)；字体 swap 防跳；动态插入用占位
TBT/INP：拆分长任务(scheduler.yield/分片)；虚拟列表、防抖节流；Web Worker 扛重活
通用：缓存 + CDN + HTTP/2；gzip/br 压缩、Tree Shaking、代码分割
\`\`\`

**测量工具**：Lighthouse（审计打分）、Performance 面板（录制定位）、Core Web Vitals 真实用户监控（RUM）。

### 名词解释

**LCP（最大内容绘制，Largest Contentful Paint）**：视口内「最大那个可见元素」绘制完成的时间，代表用户感知的「主要内容加载好了吗」。它的「采集方法」是 Performance API 的 \`largest-contentful-paint\` 条目。优化手段：让这个元素（常是大图/大标题）尽早出现——预加载、压缩、SSR 直出。

**CLS（布局偏移，Cumulative Layout Shift）**：页面生命周期内「元素意外移动」的累计值（无用户输入时）。方法：\`layout-shift\` 条目累加，单个 shift 的 \`value = 影响面积 × 位移距离\`。优化手段：给图片/广告预留固定尺寸，避免字体加载后文字突然撑开。目标是 < 0.1。

**INP（交互延迟，Interaction to Next Paint）**：用户每次交互（点击/按键）到浏览器「画出下一帧响应」的延迟，取所有交互里的「最差情况」。它接替了旧指标 FID，更全面反映真实交互体验。优化手段：减少主线程长任务、拆分任务、用 Worker。目标是 < 200ms。

### 课后练习

**练习 1**：用户报「页面打开后文字突然向右跳了一下，图片才显示出来」。这主要伤哪个指标？怎么修？

> 答案：伤 **CLS（布局偏移）**。原因是图片没预留尺寸，加载完才把布局撑开，导致后面的文字移位。修法：给 \`<img>\` 写明确的 \`width\`/\`height\` 或 \`aspect-ratio\`，让浏览器提前占位；或用 \`min-height\` 容器占位，避免加载后回流。

**练习 2**：\`TBT\` 和 \`INP\` 都在衡量「卡顿」，有什么区别？为什么现在更看重 INP？

> 答案：TBT 衡量「页面加载阶段主线程被长任务阻塞的总时长」（偏加载期）；INP 衡量「用户真实交互到响应的延迟，取最差值」（覆盖整个使用期）。过去的 FID 只测「第一次交互的延迟头」，忽略了后续交互；INP 更全面反映「用户每次点按顺不顺」，所以 Google 用 INP 取代 FID 作为核心指标。

### 总结

性能这节，我最想让你带走的是「**指标是地图，不是终点**」。很多人一上来就背 FCP/LCP/CLS 的名词，却不知道它们分别指向「加载/稳定/交互」三个不同维度。真正有用的姿势是：先测量 → 定位是哪个指标超标 → 再对症优化。LCP 慢就攻「首屏资源」，CLS 跳就攻「占位尺寸」，INP 卡就攻「主线程长任务」。而这三大方向，恰好呼应了前面几章：缓存/CDN 管加载、渲染管线管稳定、事件循环/Worker 管交互。所以这一章不是孤立的知识，而是前面所有内容的「收口」——你之前学的每一样，最终都在为这几个指标服务。`
  },
  {
    id: 'brw-l16',
    chapter: 'perf',
    title: '性能调试实战：Performance / Lighthouse',
    minutes: 40,
    content: `### 本节目标

- 会用「火焰图」的思路定位耗时点（用一段 Node 代码模拟分析）
- 会用 Lighthouse 生成审计报告
- 建立「测量 → 定位 → 修复 → 复测」的闭环工作流

**Performance 面板（录制 → 分析）**：

\`\`\`text
① 打开 Performance，点录制，复现问题（交互/滚动/加载），停止
② 看主线程火焰图（Main）：长条色块 = 长任务（>50ms 标红）
③ 点击色块看是什么函数（JS 执行 / 样式 / 布局 / 绘制）
④ 结合 Network（请求瀑布）、Timings（指标时间线）判断瓶颈
\`\`\`

**火焰图怎么看**：X 轴=时间，Y 轴=调用栈（上层调用下层）；最宽的色块=最大耗时点，从它入手。颜色含义：蓝=HTML/CSS 解析、紫=JS 执行、绿=绘制、黄=布局。

**常见问题模式**：紫=JS 长任务（拆片/Worker）；黄=频繁布局（读改写分离）；绿=绘制过重（简化样式/分层）；网络等待长=请求慢（缓存/CDN/预加载）。

下面这段 Node 代码**模拟「分析火焰图」**：给你一堆带耗时的任务，找出「长任务」并定位最慢的那个——这正是 Performance 面板在背后干的事：

\`\`\`js
// 运行环境：Node.js 14+
// 步骤：node brw-l16.js
// 它会从一组任务中找出 >50ms 的长任务，并报告最耗时的是哪一个（模拟火焰图定位）

// 模拟某次录制的「主线程任务列表」：{ name, duration(ms) }
const tasks = [
  { name: 'parseHTML',   duration: 12 },
  { name: 'styleRecalc', duration: 8 },
  { name: 'bigJSON.parse', duration: 220 },   // 长任务！
  { name: 'layout',      duration: 35 },
  { name: 'paint',       duration: 18 },
  { name: 'eventHandler', duration: 95 },      // 长任务！
  { name: 'composite',   duration: 6 },
]

const LONG_TASK = 50
const longOnes = tasks.filter(t => t.duration > LONG_TASK)
console.log('检测到的长任务(>50ms):')
for (const t of longOnes) console.log(\`  ⚠️ \${t.name}: \${t.duration}ms\`)

const worst = tasks.reduce((a, b) => b.duration > a.duration ? b : a)
console.log('最耗时任务(优先优化):', worst.name, worst.duration + 'ms')
console.log('建议：把', worst.name, '这类重活用 Web Worker 或分片处理')
\`\`\`

**Lighthouse（一键审计）**：Performance / Accessibility / Best Practices / SEO 四维度打分，给出「机会」与「诊断」列表（未用预加载、图片未压缩、CLS 超限等）。适合整体体检，发现问题后再用 Performance 精确定位。

**内存泄漏排查**：录制堆快照 → 操作页面 → 再录快照 → 对比，找「该回收却还在增长」的对象（未移除监听器、闭包 hold 大对象、定时器未清、全局误挂）。

**实战工作流**：

\`\`\`text
1. Lighthouse 体检 → 拿到嫌疑点清单
2. Performance 录制 → 定位具体函数/阶段（火焰图最宽块）
3. 修复后复测对比（量化：LCP 3s → 1.8s）
4. 真实用户监控（RUM）长期观察
\`\`\`

### 名词解释

**火焰图（Flame Chart）**：把「调用栈随时间变化」画成高低错落的色块图，用来定位性能瓶颈。方法/读法：X 轴是时间（从左到右），Y 轴是调用栈深度（上调用下），**最宽的块 = 最耗时**，点进去看是哪个函数。它是 Performance 面板的核心视图，名字来源于「色块像火苗」。

**长任务（Long Task）**：见 brw-l10 名词卡。在调试语境下，它的「识别方法」就是火焰图里标红（>50ms）的色块，或 \`longtask\` 性能条目。定位到长任务后，下一步是「拆分」或「丢给 Worker」。

**Lighthouse**：Google 提供的「网页体检工具」，自动跑一遍并打出多维度分数 + 优化建议。方法：Chrome DevTools 里点 Lighthouse 标签 → 选维度 → 生成报告。它适合「先找问题」，不适合「精确定位到某行代码」（那要用 Performance）。

### 课后练习

**练习 1**：Performance 火焰图里，你看到某次交互后有一长条**黄色**密集小色块，紧随其后是一段卡顿。最可能是哪类问题？怎么查？

> 答案：黄色代表「布局（Layout）」，密集黄色小块常是**布局抖动（Layout Thrashing）**——在循环里反复「写样式又读几何」，每次读都强制同步布局。查法：在代码里搜循环中的 \`offset*\`/\`getBoundingClientRect\`/\`scrollHeight\` 等读取，配合「先读后写」原则重构（见 brw-l6）。Performance 面板里这类操作会显示大量紫色/黄色交错的强制布局标记。

**练习 2**：为什么「修完性能问题后必须复测」，而不能只凭感觉说「应该快了」？

> 答案：性能优化容易陷入「自欺」——你改了代码，主观觉得顺了，但可能只是某次偶然不卡。复测能给出**可量化的前后对比**（LCP 从 3s 到 1.8s、长任务从 5 个到 1 个），既验证有效，也避免「改了反而更慢」没发现。而且真实用户设备千差万别，单凭本地感觉不可靠，需要 RUM 长期监控。

### 总结

调试这节，我愿你建立的工作流不是「凭直觉改代码」，而是**「测量 → 定位 → 修复 → 复测」的闭环**。火焰图和 Lighthouse 不是装饰品：Lighthouse 负责「体检报告」（告诉你哪里可能病了），Performance 火焰图负责「精准开刀」（告诉你最宽的那个块是哪个函数）。很多人性能优化的悲剧，是「没测就改、改完没复测」——结果可能改对了，也可能改得更慢却浑然不知。把性能当成工程问题而非玄学，靠的就是这套可量化、可复现的流程。前面你学的每一个优化点（缓存、合成、分片、Worker），最终都要在这套流程里被「证明有效」才算数。`
  },
  {
    id: 'brw-l17',
    chapter: 'perf',
    title: '现代渲染架构：流式 / 岛屿 / RSC',
    minutes: 36,
    content: `### 本节目标

- 理解「流式渲染（Streaming SSR）」与并发模式
- 了解「岛屿架构（Islands）」与组件级水合（Hydration）
- 用一段 Node 代码模拟「流式 SSR」与「岛屿水合」的思想

**从「整页水合」到「渐进增强」**：传统 SSR 是服务端产出整页 HTML，浏览器再一次性「水合」整个应用——首屏快，但「可交互时间」晚（要等整包 JS 下载+执行完）。

**流式渲染（Streaming SSR）**：服务端把 HTML **分块推送**，被 \`<Suspense>\` 包住的慢组件先出占位，数据到了再流式补上。

\`\`\`jsx
// React：Suspense 让慢组件不阻塞首屏
<Suspense fallback={<Spinner />}>
  <SlowCommentSection />
</Suspense>
\`\`\`

价值：TTFB 不变，但**关键内容更早到达**，对应 LCP/INP 优化。

**岛屿架构（Islands Architecture）**：页面大部分是**静态 HTML**，只有若干「岛屿」（交互组件）独立水合，其余不加载 JS。

\`\`\`text
┌──────────────────────────────────────┐
│  静态头部（无 JS）                      │
│  ┌─────────┐        ┌─────────┐      │
│  │ 计数器   │        │ 搜索框   │      │
│  │ (岛屿A)  │        │ (岛屿B)  │      │
│  └─────────┘        └─────────┘      │
│  静态内容（无 JS）                      │
└──────────────────────────────────────┘
JS 只发「岛屿」部分 → 体积小、水合快（代表：Astro）
\`\`\`

**React Server Components（RSC）**：组件默认在**服务端**运行（不进客户端 bundle），只有 \`'use client'\` 的才进浏览器。

下面这段 Node 代码**模拟**流式 SSR 与岛屿水合的核心思想：

\`\`\`js
// 运行环境：Node.js 14+
// 步骤：node brw-l17.js
// 它会「分块输出」HTML（模拟流式），并演示「只有岛屿组件才发送水合脚本」

function streamHTML() {
  // ① 先立刻发送静态外壳 + 首屏关键内容（不等慢数据）
  process.stdout.write('[流式-第1块] <header>静态头部(无JS)</header>\\n')
  process.stdout.write('[流式-第2块] <main>文章正文(直出, 立即可见)</main>\\n')

  // ② 慢数据到了，再补发这块内容（不阻塞前面的首屏）
  setTimeout(() => {
    process.stdout.write('[流式-第3块] <section>评论区数据(晚到也补上)</section>\\n')
    hydrateIslands()
    console.log('（观察：前两块立刻出现，第3块 0.5s 后才补上，符合流式+岛屿思想）')
  }, 500)

  // ③ 只给「岛屿」发水合脚本，静态部分不发
  function hydrateIslands() {
    const islands = ['计数器组件', '搜索框组件']
    console.log('[水合] 仅为岛屿发送 JS:', islands.join('、'))
    console.log('[水合] 静态头部/正文不发送 JS → 体积最小')
  }
}
streamHTML()
\`\`\`

**RSC 对模块化的启示**：

\`\`\`text
① 每个模块要声明自己的「运行环境」（server / client / universal）
② 环境边界错乱（client 引了 server 代码）→ 报错或包体积失控
③ 这些架构本质在解决「代码如何被分发到不同执行环境」
\`\`\`

**工程选型**：流式渲染注意水合匹配；岛屿架构适合内容站；RSC 适合数据密集应用——看交互密度与首屏诉求。

### 名词解释

**流式渲染（Streaming SSR）**：服务端把 HTML **分块、边生成边发送**给浏览器的渲染方式。方法：\`res.write(chunk)\` 多次发送、配合 \`<Suspense>\` 让慢组件延迟补发。它的价值是「首屏关键内容不等慢数据」，从而优化 LCP/INP。对比「整页渲染完才发」的传统 SSR，流式更早给到用户可见内容。

**岛屿架构（Islands Architecture）**：一种页面组织思路——默认页面是「静态 HTML」，只把少数交互组件作为「岛屿」单独加载 JS 并水合，其余部分零 JS。方法：\`<Island component={...} />\` 标记需要水合的岛屿，框架只对岛屿发脚本。代表框架 Astro。核心价值：JS 体积小、首屏快、可交互早。

**水合（Hydration）**：浏览器拿到服务端生成的 HTML 后，再「绑定」JS 事件、恢复组件状态的过 程，让静态页面变「可交互」。方法：框架在客户端重跑组件逻辑并 \`attach\` 事件监听。痛点：整页水合要下载整包 JS；岛屿/RSC 的思路就是「只水合必要的部分」来缩减它。

### 课后练习

**练习 1**：一个以「内容展示为主、只有搜索框和主题切换两个交互」的官网，用整页 SSR + 整页水合，和用岛屿架构，哪个更合适？为什么？

> 答案：岛屿架构更合适。官网绝大多数是静态内容，整页水合会把「整包 JS」下载执行一遍，只为两个交互组件，纯属浪费；岛屿架构只给搜索框、主题切换这两个「岛屿」发 JS，其余静态 HTML 零 JS，体积最小、首屏最快、可交互也早。这正是岛屿架构（如 Astro）的主场。

**练习 2**：RSC 里，如果一个标了 \`'use client'\` 的组件，不小心 \`import\` 了一个只在服务端能跑的 \`db.query()\` 模块，会发生什么？

> 答案：会出问题——因为 \`'use client'\` 组件会被打包进**客户端 bundle** 发到浏览器，而 \`db.query()\` 依赖服务端环境（数据库连接等），浏览器里根本没有，要么打包报错（导入了不该进客户端的模块），要么运行时报「找不到连接/未定义」。这正说明 RSC 的核心纪律：**明确模块的「运行环境边界」**，server 代码不能泄漏进 client bundle。

### 总结

这一节是整门课的「视野升华」。前面 16 节你一直在钻「浏览器内部怎么跑」，到这里我把镜头拉远，看「今天的前端架构在解决什么更大的问题」——本质上都是**「如何把代码合理地分发到不同执行环境，并最小化用户要下载和执行的 JS」**。流式渲染让「首屏不等慢数据」，岛屿架构让「静态内容零 JS」，RSC 让「服务端逻辑不进客户端包」。它们的共同敌人是「整包水合带来的体积与延迟」。我的观点是：理解这些架构，不是为了背名词，而是理解「运行环境的边界」正在成为新的模块化维度——就像当年从全局脚本进化到模块系统一样，未来你会越来越多地思考「这段代码该在服务端跑、还是在客户端跑」。这门浏览器原理课，正是这一切的地基。`
  }
]

export const brwPlan = [{'day': 1, 'theme': '浏览器架构与导航', 'lessonIds': ['brw-l1', 'brw-l2'], 'goal': '能画出多进程架构图，说出 URL→显示全流程的每一步'}, {'day': 2, 'theme': 'HTTP 与 HTTPS', 'lessonIds': ['brw-l3'], 'goal': '说清 HTTPS 握手流程与常见状态码语义'}, {'day': 3, 'theme': '解析与 DOM 构建', 'lessonIds': ['brw-l4'], 'goal': '说清 DOM/CSSOM 构建与三种阻塞资源'}, {'day': 4, 'theme': '渲染管线', 'lessonIds': ['brw-l5'], 'goal': '画出样式→布局→绘制→合成管线，解释 transform 为什么不重排'}, {'day': 5, 'theme': '重排与重绘', 'lessonIds': ['brw-l6'], 'goal': '说出重排触发条件，能手写读改写分离优化'}, {'day': 6, 'theme': 'V8 与 GC', 'lessonIds': ['brw-l7'], 'goal': '解释 JIT 与隐藏类，知道 GC 分代与内存泄漏排查'}, {'day': 7, 'theme': '第一周复盘', 'lessonIds': [], 'goal': '复述导航与渲染全链路，用题库自测'}, {'day': 8, 'theme': '上下文与事件循环', 'lessonIds': ['brw-l8', 'brw-l9'], 'goal': '能手画宏任务/微任务/渲染执行顺序，讲清 rAF 时机'}, {'day': 9, 'theme': '长任务与 Worker', 'lessonIds': ['brw-l10'], 'goal': '能写任务分片代码，用 Worker 做一次并行计算'}, {'day': 10, 'theme': '缓存与 CDN', 'lessonIds': ['brw-l11'], 'goal': '说清强/协商缓存流程，解释 hash 文件名策略'}, {'day': 11, 'theme': '跨域与 CORS', 'lessonIds': ['brw-l12'], 'goal': '能讲预检流程与常见跨域方案，会排 CORS 报错'}, {'day': 12, 'theme': '存储与 Service Worker', 'lessonIds': ['brw-l13'], 'goal': '对比四种存储方案，能写出 SW 缓存拦截代码'}, {'day': 13, 'theme': '前端安全', 'lessonIds': ['brw-l14'], 'goal': '说清 XSS/CSRF 原理与防御，列出关键安全头'}, {'day': 14, 'theme': '性能指标与收官', 'lessonIds': ['brw-l15'], 'goal': '五大指标脱口而出，给出针对 LCP/CLS/TBT 的优化清单'}, {'day': 15, 'theme': '性能调试实战', 'lessonIds': ['brw-l16'], 'goal': '用 Performance 定位一次真实卡顿，用 Lighthouse 出一份报告'}, {'day': 16, 'theme': '现代渲染架构收官', 'lessonIds': ['brw-l17'], 'goal': '说清流式/岛屿/RSC 三种架构的取舍，整门课收官'}]
