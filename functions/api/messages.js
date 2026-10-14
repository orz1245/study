// Cloudflare Pages Function: 留言板读写
// GET  /api/messages  -> 返回留言列表（最新在前，最多 200 条）—— **绝不返回 contact**
// POST /api/messages  -> 新增留言，body: { name?, contact?, content, hp?, t0? }
//
// 隐私约定（重要）：
//   contact 是「访客留给站长」的联系方式，只存进 KV 给站长看，**不得出现在任何公开响应里**。
//   此前 GET 直接返回整个数组（含 contact），前端还把它渲染在页面上，等于把访客的
//   微信/邮箱公开展示并可被任意抓取。现在改为出口处统一脱敏 —— 历史存量数据也一并生效。

const KV_KEY = 'messages'
const MAX_CONTENT = 500
const MAX_NAME = 30
const MAX_CONTACT = 100
const MAX_STORE = 500
const MAX_RETURN = 200

// 限流：同一 IP 在 RATE_WINDOW_SEC 秒内最多 RATE_MAX 次提交
const RATE_WINDOW_SEC = 60
const RATE_MAX = 5
// 表单渲染到提交的最短间隔：低于这个值几乎不可能是真人（配合蜜罐字段使用）
const MIN_FILL_MS = 2500

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
}

function sanitize(str, max) {
  return String(str == null ? '' : str)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

// 出口脱敏：只保留可以公开的字段，contact 永不出现在响应里
function publicView(m) {
  return {
    id: m && m.id,
    name: (m && m.name) || '匿名访客',
    content: (m && m.content) || '',
    createdAt: m && m.createdAt
  }
}

function clientIp(request) {
  const h = request.headers
  const direct = h.get('cf-connecting-ip')
  if (direct) return direct
  const xff = h.get('x-forwarded-for') || ''
  return xff.split(',')[0].trim() || 'unknown'
}

// KV 是按最终一致设计的，计数在极端并发下可能少算几次 —— 这里的目标是拦住脚本刷量，
// 不是做精确配额，所以「宁可漏、不误伤」：读失败/写失败都放行。
async function overRateLimit(env, request) {
  const key = `rl:${clientIp(request)}`
  let n = 0
  try {
    const cur = await env.GUESTBOOK.get(key)
    n = cur ? parseInt(cur, 10) || 0 : 0
  } catch {
    return false
  }
  if (n >= RATE_MAX) return true
  try {
    await env.GUESTBOOK.put(key, String(n + 1), { expirationTtl: RATE_WINDOW_SEC })
  } catch {
    // 计数写不进去不该拦住真实访客
  }
  return false
}

export async function onRequestGet({ env }) {
  try {
    const raw = await env.GUESTBOOK.get(KV_KEY)
    const list = raw ? JSON.parse(raw) : []
    const safe = Array.isArray(list) ? list.slice(0, MAX_RETURN).map(publicView) : []
    return new Response(JSON.stringify({ messages: safe }), { headers: JSON_HEADERS })
  } catch (e) {
    return new Response(JSON.stringify({ messages: [], error: '读取失败' }), {
      status: 500,
      headers: JSON_HEADERS
    })
  }
}

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: JSON_HEADERS
    })
  }

  // 蜜罐 + 填写耗时：命中就当作机器人，返回一个「看起来成功」的响应但不落库，
  // 这样脚本拿不到反馈、不会去调整策略。
  // 时钟偏差容差：t0 是客户端时钟，访客本机比服务器快时 elapsed 会变成负数，
  // 正常人会被误判成机器人（留言永远「提交成功」却不出现）。负数一律视为真人；
  // 只有正的极短耗时（<2.5s，表单都没填完）才判机器人。
  const honeypot = sanitize(body.hp, 20)
  const rawElapsed = Number(body.t0) ? Date.now() - Number(body.t0) : Number.POSITIVE_INFINITY
  const elapsed = rawElapsed < 0 ? Number.POSITIVE_INFINITY : rawElapsed
  const looksLikeBot = honeypot !== '' || elapsed < MIN_FILL_MS
  if (looksLikeBot) {
    return new Response(
      JSON.stringify({
        message: {
          id: Date.now() + '-dropped',
          name: '匿名访客',
          content: sanitize(body.content, MAX_CONTENT),
          createdAt: new Date().toISOString()
        }
      }),
      { status: 201, headers: JSON_HEADERS }
    )
  }

  if (await overRateLimit(env, request)) {
    return new Response(JSON.stringify({ error: '提交太频繁，请稍后再试' }), {
      status: 429,
      headers: { ...JSON_HEADERS, 'retry-after': String(RATE_WINDOW_SEC) }
    })
  }

  const name = sanitize(body.name, MAX_NAME) || '匿名访客'
  const contact = sanitize(body.contact, MAX_CONTACT)
  const content = sanitize(body.content, MAX_CONTENT)

  if (!content) {
    return new Response(JSON.stringify({ error: '留言内容不能为空' }), {
      status: 400,
      headers: JSON_HEADERS
    })
  }

  const record = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    name,
    contact,
    content,
    createdAt: new Date().toISOString()
  }

  try {
    const raw = await env.GUESTBOOK.get(KV_KEY)
    const list = raw ? JSON.parse(raw) : []
    list.unshift(record)
    if (list.length > MAX_STORE) list.length = MAX_STORE
    await env.GUESTBOOK.put(KV_KEY, JSON.stringify(list))
    // 响应里同样走脱敏视图：contact 不回传给提交者以外的人，也不回传给自己
    return new Response(JSON.stringify({ message: publicView(record) }), {
      status: 201,
      headers: JSON_HEADERS
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: '保存失败' }), {
      status: 500,
      headers: JSON_HEADERS
    })
  }
}
