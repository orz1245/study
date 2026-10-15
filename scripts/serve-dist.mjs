// 本地静态预览：模拟 Cloudflare Pages 的解析行为，用来在部署前检查 dist/。
//
// 为什么不能直接双击 dist/index.html：构建产物里资源是绝对路径（/assets/index-xxx.css），
// 且入口是 <script type="module">。file:// 下前者会解析成 file:///assets/... 而 404，
// 后者会被浏览器的模块 CORS 策略拦掉 —— 于是页面完全没有样式、也没有交互。
// 必须用 HTTP 提供，这个脚本就是干这个的。
//
// 行为对齐 Pages（顺序很重要：先跑 _redirects，再找静态资源）：
//   _redirects 301 → 返回 301 + Location
//   _redirects 200 → 内部改写目标，不再重定向
//   /x/  → dist/x/index.html
//   /x   → dist/x/index.html；再退到 dist/x.html（Pretty URLs 的 .html 兜底）
//   /a.b → 作为文件找，找不到就 404
//   其它 → dist/404.html，状态码 404（这样 unknown URL 不会被当成正常页面）
import { createServer } from 'node:http'
import { readFile, stat } from 'fs/promises'
import { readFileSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const DIST = process.argv[2] || 'dist'
const PORT = Number(process.env.PORT || 4173)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
}

// ---------- _redirects ----------
// 支持两种形态：精确路径、以及 `/prefix/*` 这类通配（可用 :splat 引用被匹配到的尾部）。
function loadRedirects() {
  let text = ''
  try {
    text = readFileSync(join(DIST, '_redirects'), 'utf-8')
  } catch {
    return []
  }
  const rules = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const [from, to, statusRaw] = line.split(/\s+/)
    if (!from || !to || !to.startsWith('/')) continue
    const status = Number(statusRaw || 302)
    if (status === 200 || (status >= 301 && status <= 308)) rules.push({ from, to, status })
  }
  return rules
}

const REDIRECTS = loadRedirects()

function matchTarget(rule, path) {
  if (rule.from.endsWith('/*')) {
    const prefix = rule.from.slice(0, -1) // 保留结尾的斜杠
    if (!path.startsWith(prefix)) return null
    const splat = path.slice(prefix.length)
    return rule.to.replace(':splat', splat)
  }
  return rule.from === path ? rule.to : null
}

function applyRedirects(path) {
  for (const rule of REDIRECTS) {
    const target = matchTarget(rule, path)
    if (target !== null) return { target, status: rule.status }
  }
  return null
}

async function exists(p) {
  try {
    const st = await stat(p)
    return st.isFile() ? st : null
  } catch {
    return null
  }
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])

  // 0) 本地预览开发环境 mock：留言板读写 API (/api/messages)
  if (urlPath === '/api/messages') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      return res.end(JSON.stringify({
        messages: [
          {
            id: 'demo-1',
            name: '站长',
            content: '欢迎各位博主与前端开发者在此申请友情链接，请留下您的网站名称、链接及一句话简介。',
            createdAt: Date.now() - 3600000 * 24
          }
        ]
      }))
    }
    if (req.method === 'POST') {
      let bodyStr = ''
      req.on('data', (chunk) => { bodyStr += chunk })
      req.on('end', () => {
        try {
          const data = JSON.parse(bodyStr || '{}')
          const newMsg = {
            id: 'local-' + Date.now(),
            name: data.name || '匿名访客',
            content: data.content || '',
            createdAt: Date.now()
          }
          res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify({ ok: true, message: newMsg }))
        } catch {
          res.writeHead(400, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ error: '无效请求数据' }))
        }
      })
      return
    }
  }

  // 1) 先跑 _redirects（与 Pages 一致）
  const hit = applyRedirects(urlPath)
  if (hit && hit.status !== 200) {
    res.writeHead(hit.status, { location: hit.target, 'cache-control': 'no-store' })
    return res.end()
  }
  const target = hit ? hit.target : urlPath

  // 2) 再找静态资源
  const rel = normalize(target).replace(/^(\.\.[/\\])+/, '')
  const isFile = extname(rel) !== ''
  let file = isFile ? join(DIST, rel) : join(DIST, rel, 'index.html')
  let status = 200

  if (!isFile && !(await exists(file))) {
    const alt = join(DIST, rel.replace(/\/$/, ''), 'index.html')
    const altHtml = join(DIST, rel.replace(/\/$/, '') + '.html') // Pretty URLs 的 .html 兜底
    if (await exists(alt)) file = alt
    else if (await exists(altHtml)) file = altHtml
    else {
      file = join(DIST, '404.html')
      status = 404
    }
  }

  const found = await exists(file)
  if (!found) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    return res.end('404 Not Found')
  }

  const body = await readFile(file)
  res.writeHead(status, {
    'content-type': MIME[extname(file)] || 'application/octet-stream',
    'cache-control': 'no-store',
  })
  res.end(body)
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`dist 预览：http://127.0.0.1:${PORT}/  （Ctrl+C 结束 · 已加载 ${REDIRECTS.length} 条 _redirects 规则）`)
})
