// Node.js 面试题（15 题）
export const nodejsQuestions = [
  {
    id: 'node-001',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['事件循环', 'Event Loop', 'libuv'],
    question: 'Node.js 的事件循环（Event Loop）是怎样的？宏任务与微任务的执行顺序？',
    answer: `Node.js 基于 **libuv** 实现事件循环，把回调按阶段（phase）依次执行，每个阶段有自己的 FIFO 队列：

\`\`\`text
┌───────────────────────┐
│        timers         │  setInterval / setTimeout 回调
│     I/O callbacks     │  上一轮 I/O 的延迟回调（如 TCP 错误）
│     idle, prepare     │  内部使用
│       poll            │  取回新的 I/O 事件（文件/网络）
│       check           │  setImmediate 回调
│    close callbacks    │  close 事件（如 socket.destroy）
└───────────────────────┘
\`\`\`

**微任务**在两个节点之间、每个阶段切换前清空（全清空，不是只取一个）：

- \`process.nextTick\` 队列：**优先级最高**，独立于微任务，会在每次阶段切换、甚至 I/O 之前执行
- \`Promise.then / queueMicrotask\` 属于微任务

**执行顺序口诀**：同一圈里，先跑完当前阶段的宏任务队列 → 清空 \`nextTick\` 队列 → 清空微任务队列 → 进入下一阶段。

\`\`\`js
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))
Promise.resolve().then(() => console.log('promise'))
process.nextTick(() => console.log('nextTick'))
// 输出：nextTick → promise → (timeout 与 immediate 顺序不定，取决于事件循环启动耗时)
\`\`\`

> 注意：\`setTimeout(fn,0)\` 实际最小约 1ms；在主模块里 \`setImmediate\` 通常早于 \`setTimeout\`，但在 I/O 回调内部则相反。`
  },
  {
    id: 'node-002',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['模块系统', 'CommonJS', 'ESM'],
    question: 'Node.js 中使用 CommonJS 和 ESM 有什么区别？如何开启 ESM？',
    answer: `**CommonJS（CJS）**：同步 \`require\`，模块是对象，运行时加载，可动态条件引入。

\`\`\`js
// CJS
const fs = require('fs')
module.exports = { a: 1 }
\`\`\`

**ESM**：静态 \`import/export\`，编译期分析，支持 Tree Shaking，顶层 \`this\` 为 \`undefined\`。

\`\`\`js
// ESM
import fs from 'fs'
export const a = 1
\`\`\`

**开启方式（任选其一）**：

1. \`package.json\` 写 \`"type": "module"\` → 所有 \`.js\` 视为 ESM
2. 文件后缀用 \`.mjs\`（ESM） / \`.cjs\`（CJS）显式声明

**坑**：CJS 与 ESM 不能直接 \`require\` 一个 ESM 模块（需动态 \`import()\`）；ESM 里没有 \`__dirname\`，可用 \`import.meta.url\` + \`fileURLToPath\` 代替。`
  },
  {
    id: 'node-003',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['Stream', '流', '大文件'],
    question: '什么是 Stream（流）？为什么说处理大文件必须用流？',
    answer: `\`Stream\` 是**边读边处理**的数据抽象，不用把整份数据一次性载入内存。四种类型：

- \`Readable\`（可读，如文件读取）
- \`Writable\`（可写，如下载落盘）
- \`Duplex\`（双向，如 socket）
- \`Transform\`（转换，如压缩、加密）

**大文件必须流式**：一次 \`fs.readFile\` 会把整个文件读进内存，几百 MB 就容易 OOM；用流可以「边读边写」恒定内存。

\`\`\`js
// 文件复制：内存占用恒定
import { createReadStream, createWriteStream } from 'fs'
createReadStream('big.iso')
  .pipe(createWriteStream('copy.iso'))
  .on('finish', () => console.log('done'))
\`\`\`

常用 \`pipe\` 串联多个流；\`pipeline\`（来自 \`stream/promises\`）更优雅，自动处理错误与清理。`
  },
  {
    id: 'node-004',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['Buffer', '二进制', '编码'],
    question: 'Buffer 是什么？和 String 有什么不同？',
    answer: `\`Buffer\` 是 Node 对**二进制数据**的直接内存视图（类似 Uint8Array），用于处理网络包、文件、图片等非文本字节。

\`\`\`js
const buf = Buffer.from('你好', 'utf8')  // <Buffer e4 bd a0 e5 a5 bd>
console.log(buf.length)                  // 6（UTF-8 下中文占 3 字节）
console.log(buf.toString('utf8'))        // '你好'
\`\`\`

**区别**：

- \`String\` 是字符序列（UTF-16），关心「语义字符」
- \`Buffer\` 是字节序列，关心「物理字节」，能精确控制编码/截断

> 坑：\`Buffer.toString('utf8')\` 若字节在边界被截断会出现乱码，处理流式文本应用 \`StringDecoder\` 自动补帧。`
  },
  {
    id: 'node-005',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['异步', 'fs/promises', '错误处理'],
    question: 'Node.js 有哪些异步写法？现在推荐哪种？',
    answer: `演进：回调 → Promise → async/await。

\`\`\`js
// 1) 回调（旧 API，易回调地狱）
fs.readFile('a.txt', 'utf8', (err, data) => { if (err) throw err })

// 2) Promise 版（推荐）
import { readFile } from 'fs/promises'
const data = await readFile('a.txt', 'utf8')

// 3) 事件回调（Stream / EventEmitter）
stream.on('data', chunk => {})
\`\`\`

**现在推荐 \`fs/promises\` + \`async/await\`**，可读性好、便于 try/catch 统一错误处理。回调式 API（\`fs.readFile\` 无 promises 后缀）只在极低层或事件场景使用。

> 注意：\`await\` 必须在 \`async\` 函数里；顶层可用 \`top-level await\`（ESM + Node 14.8+）。`
  },
  {
    id: 'node-006',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['cluster', '多进程', '负载'],
    question: 'Node.js 是单线程的，如何利用多核 CPU？cluster 和 worker_threads 有什么区别？',
    answer: `Node 主线程单线程，但可通过**多进程/多线程**利用多核：

- **cluster**：\`fork\` 出多个子进程（每个进程一个 Event Loop），共享同一端口，主进程做负载均衡。适合 CPU 密集的 HTTP 服务。
- **worker_threads**：同一进程内开多个**工作线程**（各有一个独立的 V8 实例 + Event Loop），线程间可共享 \`SharedArrayBuffer\`，通信开销低于进程。
- **child_process**：\`spawn/exec/fork\` 启动独立子进程，常用于调用外部命令。

\`\`\`js
import cluster from 'cluster'
import os from 'os'
if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork())
} else {
  // 每个 worker 启动同一份服务器代码
}
\`\`\`

**选择**：I/O 密集首选 cluster；计算密集且需频繁传大数据用 worker_threads（避免进程间序列化成本）。`
  },
  {
    id: 'node-007',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['process', '环境变量', '信号'],
    question: 'process 对象有哪些常用能力？如何优雅退出进程？',
    answer: `\`process\` 是全局对象，提供环境信息与控制：

- \`process.env\`：环境变量（\`NODE_ENV\` 等），生产环境务必读取
- \`process.argv\`：命令行参数（\`argv[2]\` 起是自定义参数）
- \`process.cwd()\`：当前工作目录
- \`process.exit(code)\`：立即退出（0 成功，非 0 失败）
- \`process.on('uncaughtException' / 'unhandledRejection')\`：兜底未捕获错误
- \`process.on('SIGINT' / 'SIGTERM')\`：监听 Ctrl+C / 终止信号

**优雅退出**：收到 \`SIGTERM\` 后停止接收新请求、等待进行中任务完成、释放连接再退出。

\`\`\`js
process.on('SIGTERM', async () => {
  server.close()
  await drainQueues()
  process.exit(0)
})
\`\`\``
  },
  {
    id: 'node-008',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'hard',
    tags: ['内存泄漏', '排查', 'heapdump'],
    question: 'Node.js 如何排查内存泄漏？常见原因有哪些？',
    answer: `**常见原因**：

1. 全局变量 / 闭包长期引用大对象
2. 忘记清理的监听器（\`EventEmitter\` 反复 \`on\` 不 \`off\`）
3. 缓存（Map/数组）只增不删，无上限
4. 定时器（\`setInterval\`）引用未释放
5. 队列堆积（消费速度 < 生产速度）

**排查流程**：

\`\`\`bash
# 1) 启动时限制内存上限并暴露诊断
node --max-old-space-size=2048 --inspect app.js

# 2) 抓取堆快照（需 heapdump / clinic 或 SIGUSR2）
node -e "require('heapdump').writeSnapshot('before.heapsnapshot')"
# 触发操作后再抓一次 after.heapsnapshot，对比差异
\`\`\`

用 Chrome DevTools → Memory → 对比两次快照，按「Retainers」找持续增长的引用链。生产可用 \`clinic.js\` / \`@risingstack/trace\` 自动化分析。`
  },
  {
    id: 'node-009',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['child_process', 'spawn', 'exec'],
    question: 'child_process 的 spawn、exec、execFile 有什么区别？',
    answer: `三者都用于启动子进程，差异在**流式 vs 缓冲、是否走 shell**：

- \`exec(cmd, cb)\`：通过 **shell** 执行整条命令，输出**缓冲**到内存（默认 1MB 上限），适合短输出命令；回调拿 \`(err, stdout, stderr)\`
- \`execFile(file, args, cb)\`：直接执行可执行文件，**不走 shell**，更安全、略快，参数以数组传入
- \`spawn(cmd, args)\`：不走 shell，返回 **Stream**（\`stdout/stderr\` 可读流），适合大输出 / 实时处理，不会撑爆内存

\`\`\`js
import { spawn } from 'child_process'
const ls = spawn('ls', ['-lh', '/usr'])
ls.stdout.on('data', d => process.stdout.write(d))
\`\`\`

**建议**：需要实时/大输出用 \`spawn\`；简单拿结果用 \`execFile\`；避免把用户输入拼进 \`exec\`（命令注入风险）。`
  },
  {
    id: 'node-010',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['错误处理', '异常', '兜底'],
    question: 'Node.js 有哪些必须处理的错误？如何避免进程崩溃？',
    answer: `**必须兜底的两类**：

- \`uncaughtException\`：同步代码未捕获异常
- \`unhandledRejection\`：Promise 拒绝未被 catch

\`\`\`js
process.on('uncaughtException', (err) => {
  logger.error(err)
  // 仅做日志/上报，不要在这里继续跑业务（状态可能已损坏）
  process.exit(1)  // 交给进程管理器（pm2/k8s）重启
})
process.on('unhandledRejection', (reason) => {
  logger.error(reason)
})
\`\`\`

**最佳实践**：监听只是最后防线，**真正的修复**是在业务里显式 try/catch + 在 async 边界 await 处 catch。生产用 \`pm2\` / \`k8s\` 做进程守护与自动重启。`
  },
  {
    id: 'node-011',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['require', '缓存', '循环依赖'],
    question: 'Node 的 require 缓存机制是怎样的？循环依赖会怎样？',
    answer: `\`require\` 加载模块后会把 \`module.exports\` 缓存到 \`require.cache\` 中，**同进程内第二次 require 直接返回缓存**（不会重复执行文件），因此模块顶层代码只跑一次。

\`\`\`js
delete require.cache[require.resolve('./x.js')] // 强制重新加载
\`\`\`

**循环依赖**：Node 在加载 A（A 引用 B）时会先执行 A，遇到 \`require(B)\` 转去执行 B，若 B 又 \`require(A)\`，此时 A 尚未执行完，拿到的是**不完整的 \`module.exports\`（通常是个空对象或已导出的部分）**。

\`\`\`js
// a.js
exports.done = false
const b = require('./b')   // b 此时 require(a) 拿到 { done: false }
exports.done = true
// 结论：循环依赖下拿到的是「半截导出」，应避免，或改用函数/延迟引用
\`\`\`

> ESM 对循环依赖处理更优（用 live binding，能拿到最终值）。`
  },
  {
    id: 'node-012',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['性能', 'perf_hooks', 'profiling'],
    question: '如何对 Node.js 做性能分析（Profiling）？',
    answer: `常用手段：

1. **perf_hooks**：在代码内埋点测耗时
\`\`\`js
import { performance, PerformanceObserver } from 'perf_hooks'
const obs = new PerformanceObserver(list => console.log(list.getEntries()))
obs.observe({ entryTypes: ['measure'] })
performance.mark('start')
// ...业务...
performance.mark('end')
performance.measure('task', 'start', 'end')
\`\`\`

2. **CPU Profiling**：\`node --prof app.js\` 生成 \`*-v8.log\`，用 \`--prof-process\` 或 \`chrome://tracing\` 分析热点函数
3. **clinic.js**：\`clinic doctor/bubbleprof/heapprofiler\` 一站式诊断
4. **async_hooks**：追踪异步资源生命周期（调试异步泄漏）

生产环境建议采样（不一直开），避免 profiling 本身拖慢服务。`
  },
  {
    id: 'node-013',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['事件', 'EventEmitter', '发布订阅'],
    question: 'EventEmitter 的原理是什么？有哪些注意点？',
    answer: `\`EventEmitter\` 本质是**发布-订阅**：内部维护 \`事件名 → 回调数组\` 的 Map，\`on\` 注册、\`emit\` 触发、\`off\` 移除。

\`\`\`js
import { EventEmitter } from 'events'
class MyBus extends EventEmitter {}
const bus = new MyBus()
bus.on('data', (x) => console.log(x))
bus.emit('data', 42)
\`\`\`

**注意点**：

- **内存泄漏高发区**：\`on\` 后若不再 \`off\`，且 emitter 长期存活，回调与其闭包引用无法回收
- 同一事件监听器超过 10 个会告警（\`setMaxListeners\` 调整）
- \`once\` 注册只触发一次的监听（内部用 \`off\` 自动移除）
- \`emit\` 抛出的异常需自行 catch，否则冒泡成 \`uncaughtException\``
  },
  {
    id: 'node-014',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['定时器', 'setTimeout', 'setImmediate'],
    question: 'Node 的定时器精度如何？setTimeout、setInterval 有什么坑？',
    answer: `- \`setTimeout(fn, 0)\` 实际延迟约 1ms（小于 1 会被提升到 1），且受 Event Loop 阶段调度影响，不准
- \`setInterval\` 的回调**不会累加排队**：若单次执行超过间隔，下一次会「紧随」执行甚至丢帧；长时间任务建议用「递归 setTimeout」替代以保证间隔
- 未清理的 \`setInterval\` 会阻止进程退出（持有事件循环），必须在不再需要时 \`clearInterval\`
- \`setImmediate\` 在 poll 阶段之后、\`setTimeout\` 之前（I/O 回调内）触发

\`\`\`js
// 更稳定：递归 setTimeout 保证「完成后才等下一个间隔」
function tick() {
  doWork()
  setTimeout(tick, 1000)
}
\`\`\``
  },
  {
    id: 'node-015',
    category: 'nodejs',
    module: 'algo-node',
    difficulty: 'hard',
    tags: ['HTTP', '原生服务', '框架'],
    question: '用 Node 原生 http 模块写一个服务，和用 Express/Koa 比有什么差异？',
    answer: `\`http\` 原生模块只提供底层请求/响应对象，路由、body 解析、中间件全要自己写：

\`\`\`js
import http from 'http'
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
  } else {
    res.statusCode = 404
    res.end('Not Found')
  }
})
server.listen(3000)
\`\`\`

**对比框架**：

- **Express**：基于回调的中间件队列（\`app.use\`），生态最大，但洋葱模型不彻底
- **Koa**：基于 async 的中间件**洋葱模型**，用 \`ctx\` 统一封装 req/res，更轻、更现代
- 原生胜在零依赖、可控性高、性能略好；缺点是样板代码多、安全（防注入/限流）需自实现

> 选型：内部小工具可原生；业务服务用 Express/Koa/Fastify 提升效率，Fastify 在性能上更优。`
  }
]
