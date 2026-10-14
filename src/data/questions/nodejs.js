export const nodejsQuestions = [
  {
    "id": "node-001",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "事件循环",
      "Event Loop",
      "libuv"
    ],
    "question": "Node.js 的事件循环（Event Loop）是怎样的？宏任务与微任务的执行顺序？",
    "answer": "Node.js 基于 **libuv** 实现事件循环，把回调按阶段（phase）依次执行，每个阶段有自己的 FIFO 队列：\n\n```text\n┌───────────────────────┐\n│        timers         │  setInterval / setTimeout 回调\n│     I/O callbacks     │  上一轮 I/O 的延迟回调（如 TCP 错误）\n│     idle, prepare     │  内部使用\n│       poll            │  取回新的 I/O 事件（文件/网络）\n│       check           │  setImmediate 回调\n│    close callbacks    │  close 事件（如 socket.destroy）\n└───────────────────────┘\n```\n\n**微任务**在两个节点之间、每个阶段切换前清空（全清空，不是只取一个）：\n\n- `process.nextTick` 队列：**优先级最高**，独立于微任务，会在每次阶段切换、甚至 I/O 之前执行\n- `Promise.then / queueMicrotask` 属于微任务\n\n**执行顺序口诀**：同一圈里，先跑完当前阶段的宏任务队列 → 清空 `nextTick` 队列 → 清空微任务队列 → 进入下一阶段。\n\n```js\nsetTimeout(() => console.log('timeout'), 0)\nsetImmediate(() => console.log('immediate'))\nPromise.resolve().then(() => console.log('promise'))\nprocess.nextTick(() => console.log('nextTick'))\n// 输出：nextTick → promise → (timeout 与 immediate 顺序不定，取决于事件循环启动耗时)\n```\n\n> 注意：`setTimeout(fn,0)` 实际最小约 1ms；在主模块里 `setImmediate` 通常早于 `setTimeout`，但在 I/O 回调内部则相反。"
  },
  {
    "id": "node-002",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "模块系统",
      "CommonJS",
      "ESM"
    ],
    "question": "Node.js 中使用 CommonJS 和 ESM 有什么区别？如何开启 ESM？",
    "answer": "**CommonJS（CJS）**：同步 `require`，模块是对象，运行时加载，可动态条件引入。\n\n```js\n// CJS\nconst fs = require('fs')\nmodule.exports = { a: 1 }\n```\n\n**ESM**：静态 `import/export`，编译期分析，支持 Tree Shaking，顶层 `this` 为 `undefined`。\n\n```js\n// ESM\nimport fs from 'fs'\nexport const a = 1\n```\n\n**开启方式（任选其一）**：\n\n1. `package.json` 写 `\"type\": \"module\"` → 所有 `.js` 视为 ESM\n2. 文件后缀用 `.mjs`（ESM） / `.cjs`（CJS）显式声明\n\n**坑**：CJS 与 ESM 不能直接 `require` 一个 ESM 模块（需动态 `import()`）；ESM 里没有 `__dirname`，可用 `import.meta.url` + `fileURLToPath` 代替。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-003",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "Stream",
      "流",
      "大文件"
    ],
    "question": "什么是 Stream（流）？为什么说处理大文件必须用流？",
    "answer": "`Stream` 是**边读边处理**的数据抽象，不用把整份数据一次性载入内存。四种类型：\n\n- `Readable`（可读，如文件读取）\n- `Writable`（可写，如下载落盘）\n- `Duplex`（双向，如 socket）\n- `Transform`（转换，如压缩、加密）\n\n**大文件必须流式**：一次 `fs.readFile` 会把整个文件读进内存，几百 MB 就容易 OOM；用流可以「边读边写」恒定内存。\n\n```js\n// 文件复制：内存占用恒定\nimport { createReadStream, createWriteStream } from 'fs'\ncreateReadStream('big.iso')\n  .pipe(createWriteStream('copy.iso'))\n  .on('finish', () => console.log('done'))\n```\n\n常用 `pipe` 串联多个流；`pipeline`（来自 `stream/promises`）更优雅，自动处理错误与清理。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-004",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "Buffer",
      "二进制",
      "编码"
    ],
    "question": "Buffer 是什么？和 String 有什么不同？",
    "answer": "`Buffer` 是 Node 对**二进制数据**的直接内存视图（类似 Uint8Array），用于处理网络包、文件、图片等非文本字节。\n\n```js\nconst buf = Buffer.from('你好', 'utf8')  // <Buffer e4 bd a0 e5 a5 bd>\nconsole.log(buf.length)                  // 6（UTF-8 下中文占 3 字节）\nconsole.log(buf.toString('utf8'))        // '你好'\n```\n\n**区别**：\n\n- `String` 是字符序列（UTF-16），关心「语义字符」\n- `Buffer` 是字节序列，关心「物理字节」，能精确控制编码/截断\n\n> 坑：`Buffer.toString('utf8')` 若字节在边界被截断会出现乱码，处理流式文本应用 `StringDecoder` 自动补帧。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-005",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "异步",
      "fs/promises",
      "错误处理"
    ],
    "question": "Node.js 有哪些异步写法？现在推荐哪种？",
    "answer": "演进：回调 → Promise → async/await。\n\n```js\n// 1) 回调（旧 API，易回调地狱）\nfs.readFile('a.txt', 'utf8', (err, data) => { if (err) throw err })\n\n// 2) Promise 版（推荐）\nimport { readFile } from 'fs/promises'\nconst data = await readFile('a.txt', 'utf8')\n\n// 3) 事件回调（Stream / EventEmitter）\nstream.on('data', chunk => {})\n```\n\n**现在推荐 `fs/promises` + `async/await`**，可读性好、便于 try/catch 统一错误处理。回调式 API（`fs.readFile` 无 promises 后缀）只在极低层或事件场景使用。\n\n> 注意：`await` 必须在 `async` 函数里；顶层可用 `top-level await`（ESM + Node 14.8+）。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-006",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "cluster",
      "多进程",
      "负载"
    ],
    "question": "Node.js 是单线程的，如何利用多核 CPU？cluster 和 worker_threads 有什么区别？",
    "answer": "Node 主线程单线程，但可通过**多进程/多线程**利用多核：\n\n- **cluster**：`fork` 出多个子进程（每个进程一个 Event Loop），共享同一端口，主进程做负载均衡。适合 CPU 密集的 HTTP 服务。\n- **worker_threads**：同一进程内开多个**工作线程**（各有一个独立的 V8 实例 + Event Loop），线程间可共享 `SharedArrayBuffer`，通信开销低于进程。\n- **child_process**：`spawn/exec/fork` 启动独立子进程，常用于调用外部命令。\n\n```js\nimport cluster from 'cluster'\nimport os from 'os'\nif (cluster.isPrimary) {\n  os.cpus().forEach(() => cluster.fork())\n} else {\n  // 每个 worker 启动同一份服务器代码\n}\n```\n\n**选择**：I/O 密集首选 cluster；计算密集且需频繁传大数据用 worker_threads（避免进程间序列化成本）。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-007",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "process",
      "环境变量",
      "信号"
    ],
    "question": "process 对象有哪些常用能力？如何优雅退出进程？",
    "answer": "`process` 是全局对象，提供环境信息与控制：\n\n- `process.env`：环境变量（`NODE_ENV` 等），生产环境务必读取\n- `process.argv`：命令行参数（`argv[2]` 起是自定义参数）\n- `process.cwd()`：当前工作目录\n- `process.exit(code)`：立即退出（0 成功，非 0 失败）\n- `process.on('uncaughtException' / 'unhandledRejection')`：兜底未捕获错误\n- `process.on('SIGINT' / 'SIGTERM')`：监听 Ctrl+C / 终止信号\n\n**优雅退出**：收到 `SIGTERM` 后停止接收新请求、等待进行中任务完成、释放连接再退出。\n\n```js\nprocess.on('SIGTERM', async () => {\n  server.close()\n  await drainQueues()\n  process.exit(0)\n})\n```\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-008",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "hard",
    "tags": [
      "内存泄漏",
      "排查",
      "heapdump"
    ],
    "question": "Node.js 如何排查内存泄漏？常见原因有哪些？",
    "answer": "**常见原因**：\n\n1. 全局变量 / 闭包长期引用大对象\n2. 忘记清理的监听器（`EventEmitter` 反复 `on` 不 `off`）\n3. 缓存（Map/数组）只增不删，无上限\n4. 定时器（`setInterval`）引用未释放\n5. 队列堆积（消费速度 < 生产速度）\n\n**排查流程**：\n\n```bash\n# 1) 启动时限制内存上限并暴露诊断\nnode --max-old-space-size=2048 --inspect app.js\n\n# 2) 抓取堆快照（需 heapdump / clinic 或 SIGUSR2）\nnode -e \"require('heapdump').writeSnapshot('before.heapsnapshot')\"\n# 触发操作后再抓一次 after.heapsnapshot，对比差异\n```\n\n用 Chrome DevTools → Memory → 对比两次快照，按「Retainers」找持续增长的引用链。生产可用 `clinic.js` / `@risingstack/trace` 自动化分析。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-009",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "child_process",
      "spawn",
      "exec"
    ],
    "question": "child_process 的 spawn、exec、execFile 有什么区别？",
    "answer": "三者都用于启动子进程，差异在**流式 vs 缓冲、是否走 shell**：\n\n- `exec(cmd, cb)`：通过 **shell** 执行整条命令，输出**缓冲**到内存（默认 1MB 上限），适合短输出命令；回调拿 `(err, stdout, stderr)`\n- `execFile(file, args, cb)`：直接执行可执行文件，**不走 shell**，更安全、略快，参数以数组传入\n- `spawn(cmd, args)`：不走 shell，返回 **Stream**（`stdout/stderr` 可读流），适合大输出 / 实时处理，不会撑爆内存\n\n```js\nimport { spawn } from 'child_process'\nconst ls = spawn('ls', ['-lh', '/usr'])\nls.stdout.on('data', d => process.stdout.write(d))\n```\n\n**建议**：需要实时/大输出用 `spawn`；简单拿结果用 `execFile`；避免把用户输入拼进 `exec`（命令注入风险）。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-010",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "错误处理",
      "异常",
      "兜底"
    ],
    "question": "Node.js 有哪些必须处理的错误？如何避免进程崩溃？",
    "answer": "**必须兜底的两类**：\n\n- `uncaughtException`：同步代码未捕获异常\n- `unhandledRejection`：Promise 拒绝未被 catch\n\n```js\nprocess.on('uncaughtException', (err) => {\n  logger.error(err)\n  // 仅做日志/上报，不要在这里继续跑业务（状态可能已损坏）\n  process.exit(1)  // 交给进程管理器（pm2/k8s）重启\n})\nprocess.on('unhandledRejection', (reason) => {\n  logger.error(reason)\n})\n```\n\n**最佳实践**：监听只是最后防线，**真正的修复**是在业务里显式 try/catch + 在 async 边界 await 处 catch。生产用 `pm2` / `k8s` 做进程守护与自动重启。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-011",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "require",
      "缓存",
      "循环依赖"
    ],
    "question": "Node 的 require 缓存机制是怎样的？循环依赖会怎样？",
    "answer": "`require` 加载模块后会把 `module.exports` 缓存到 `require.cache` 中，**同进程内第二次 require 直接返回缓存**（不会重复执行文件），因此模块顶层代码只跑一次。\n\n```js\ndelete require.cache[require.resolve('./x.js')] // 强制重新加载\n```\n\n**循环依赖**：Node 在加载 A（A 引用 B）时会先执行 A，遇到 `require(B)` 转去执行 B，若 B 又 `require(A)`，此时 A 尚未执行完，拿到的是**不完整的 `module.exports`（通常是个空对象或已导出的部分）**。\n\n```js\n// a.js\nexports.done = false\nconst b = require('./b')   // b 此时 require(a) 拿到 { done: false }\nexports.done = true\n// 结论：循环依赖下拿到的是「半截导出」，应避免，或改用函数/延迟引用\n```\n\n> ESM 对循环依赖处理更优（用 live binding，能拿到最终值）。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-012",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "性能",
      "perf_hooks",
      "profiling"
    ],
    "question": "如何对 Node.js 做性能分析（Profiling）？",
    "answer": "常用手段：\n\n1. **perf_hooks**：在代码内埋点测耗时\n```js\nimport { performance, PerformanceObserver } from 'perf_hooks'\nconst obs = new PerformanceObserver(list => console.log(list.getEntries()))\nobs.observe({ entryTypes: ['measure'] })\nperformance.mark('start')\n// ...业务...\nperformance.mark('end')\nperformance.measure('task', 'start', 'end')\n```\n\n2. **CPU Profiling**：`node --prof app.js` 生成 `*-v8.log`，用 `--prof-process` 或 `chrome://tracing` 分析热点函数\n3. **clinic.js**：`clinic doctor/bubbleprof/heapprofiler` 一站式诊断\n4. **async_hooks**：追踪异步资源生命周期（调试异步泄漏）\n\n生产环境建议采样（不一直开），避免 profiling 本身拖慢服务。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-013",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "事件",
      "EventEmitter",
      "发布订阅"
    ],
    "question": "EventEmitter 的原理是什么？有哪些注意点？",
    "answer": "`EventEmitter` 本质是**发布-订阅**：内部维护 `事件名 → 回调数组` 的 Map，`on` 注册、`emit` 触发、`off` 移除。\n\n```js\nimport { EventEmitter } from 'events'\nclass MyBus extends EventEmitter {}\nconst bus = new MyBus()\nbus.on('data', (x) => console.log(x))\nbus.emit('data', 42)\n```\n\n**注意点**：\n\n- **内存泄漏高发区**：`on` 后若不再 `off`，且 emitter 长期存活，回调与其闭包引用无法回收\n- 同一事件监听器超过 10 个会告警（`setMaxListeners` 调整）\n- `once` 注册只触发一次的监听（内部用 `off` 自动移除）\n- `emit` 抛出的异常需自行 catch，否则冒泡成 `uncaughtException`\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-014",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "定时器",
      "setTimeout",
      "setImmediate"
    ],
    "question": "Node 的定时器精度如何？setTimeout、setInterval 有什么坑？",
    "answer": "- `setTimeout(fn, 0)` 实际延迟约 1ms（小于 1 会被提升到 1），且受 Event Loop 阶段调度影响，不准\n- `setInterval` 的回调**不会累加排队**：若单次执行超过间隔，下一次会「紧随」执行甚至丢帧；长时间任务建议用「递归 setTimeout」替代以保证间隔\n- 未清理的 `setInterval` 会阻止进程退出（持有事件循环），必须在不再需要时 `clearInterval`\n- `setImmediate` 在 poll 阶段之后、`setTimeout` 之前（I/O 回调内）触发\n\n```js\n// 更稳定：递归 setTimeout 保证「完成后才等下一个间隔」\nfunction tick() {\n  doWork()\n  setTimeout(tick, 1000)\n}\n```\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  },
  {
    "id": "node-015",
    "category": "nodejs",
    "module": "algo-node",
    "difficulty": "hard",
    "tags": [
      "HTTP",
      "原生服务",
      "框架"
    ],
    "question": "用 Node 原生 http 模块写一个服务，和用 Express/Koa 比有什么差异？",
    "answer": "`http` 原生模块只提供底层请求/响应对象，路由、body 解析、中间件全要自己写：\n\n```js\nimport http from 'http'\nconst server = http.createServer((req, res) => {\n  if (req.method === 'GET' && req.url === '/api') {\n    res.writeHead(200, { 'Content-Type': 'application/json' })\n    res.end(JSON.stringify({ ok: true }))\n  } else {\n    res.statusCode = 404\n    res.end('Not Found')\n  }\n})\nserver.listen(3000)\n```\n\n**对比框架**：\n\n- **Express**：基于回调的中间件队列（`app.use`），生态最大，但洋葱模型不彻底\n- **Koa**：基于 async 的中间件**洋葱模型**，用 `ctx` 统一封装 req/res，更轻、更现代\n- 原生胜在零依赖、可控性高、性能略好；缺点是样板代码多、安全（防注入/限流）需自实现\n\n> 选型：内部小工具可原生；业务服务用 Express/Koa/Fastify 提升效率，Fastify 在性能上更优。\n\n### Node.js 生产环境底层机制与监控实践\n\n| 核心维度 | 开发环境表现 | 生产环境高可用规范 |\n| :--- | :--- | :--- |\n| **事件循环与阻塞防御** | 单次同步计算耗时不敏感 | 严禁在主线程执行超过 10ms 的同步正则/大 JSON 序列化/加密，必须下放 `worker_threads` 或流式分块 |\n| **内存与流背压（Backpressure）** | 小数据量直接 `fs.readFile` | 必须使用 `stream.pipeline` 自动管理背压与异常销毁，防止 `highWaterMark` 缓冲区堆积引发 OOM |\n| **异常兜底与优雅停机** | 直接报错退出 | 监听 `SIGTERM` 停止接收新连接、等待在途请求完成（Drain）、关闭数据库连接池后再 `process.exit(0)` |\n\n```javascript\n// Node.js 生产级流式管道（自动处理背压 Backpressure 与错误清理）及优雅停机模板\nimport { pipeline } from 'node:stream/promises'\nimport { createReadStream, createWriteStream } from 'node:fs'\n\nexport async function safeStreamCopy(src, dest) {\n  await pipeline(\n    createReadStream(src, { highWaterMark: 64 * 1024 }),\n    createWriteStream(dest)\n  )\n}\n\nexport function setupGracefulShutdown(server, cleanupFn) {\n  const shutdown = async (signal) => {\n    console.info(`[Node] 收到 ${signal}，开始优雅停机...`)\n    server.close(async () => {\n      await cleanupFn?.()\n      process.exit(0)\n    })\n    setTimeout(() => process.exit(1), 10_000).unref()\n  }\n  process.on('SIGTERM', () => shutdown('SIGTERM'))\n  process.on('SIGINT', () => shutdown('SIGINT'))\n}\n```"
  }
]
