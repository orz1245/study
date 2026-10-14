// Sitemap（含真实源文件 <lastmod> 与 sitemap-index.xml）与 _redirects 生成模块
import { statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SITE_ORIGIN as SITE } from '../utils/seo.js'
import { courses } from '../data/courses.js'
import { CATEGORY_SOURCE_FILES } from '../data/index.js'

const FALLBACK_DATE = '2026-10-07'

export function createLastmodResolver(rootDir) {
  const fileDate = (relPath) => {
    try {
      const mtime = statSync(join(rootDir, relPath)).mtime
      return mtime.toISOString().slice(0, 10)
    } catch {
      return FALLBACK_DATE
    }
  }

  const maxDate = (dates) => {
    const valid = dates.filter(Boolean).sort()
    return valid.length ? valid[valid.length - 1] : FALLBACK_DATE
  }

  const getCourseLastmod = (course) =>
    course.sourceFile ? fileDate(course.sourceFile) : FALLBACK_DATE

  const getCategoryLastmod = (categoryKey) => {
    const files = CATEGORY_SOURCE_FILES[categoryKey] || []
    return maxDate(files.map(fileDate))
  }

  const latestCourseLastmod = maxDate(courses.map(getCourseLastmod))
  const latestQuestionLastmod = maxDate(Object.keys(CATEGORY_SOURCE_FILES).map(getCategoryLastmod))
  const siteLastmod = maxDate([latestCourseLastmod, latestQuestionLastmod])

  return {
    getCourseLastmod,
    getCategoryLastmod,
    latestCourseLastmod,
    latestQuestionLastmod,
    siteLastmod,
  }
}

export function writeRedirects(distDir, redirectLines) {
  const allLines = [
    ...redirectLines,
    '/study /progress/ 301',
    '/study/ /progress/ 301',
  ]
  const redirects = `# 由 scripts/ssg.mjs 自动生成（构建期）。旧 URL → 新语义 URL 全量 301。
# 百度验证文件：保持 .html 路径可访问，避免被 Pretty URLs 308 到无后缀地址
/baidu_verify_codeva-fyQwirCBsE.html /baidu_verify_codeva-fyQwirCBsE 200

${allLines.join('\n')}
`
  writeFileSync(join(distDir, '_redirects'), redirects, 'utf-8')
  return allLines.length / 2
}

export function writeSitemaps(distDir, entries, siteLastmod) {
  // 保持 BASE 入口排在最前，同时去重并保留每个 URL 的真实 <lastmod>
  const baseOrder = ['/', '/course/', '/interview/', '/guestbook/', '/donate/']
  const byLoc = new Map()
  for (const b of baseOrder) byLoc.set(b, siteLastmod)
  for (const item of entries) {
    if (!item || !item.loc) continue
    byLoc.set(item.loc, item.lastmod || siteLastmod)
  }

  const urlNodes = [...byLoc.entries()]
    .map(([loc, lastmod]) => `  <url><loc>${SITE}${loc}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>
`
  writeFileSync(join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8')

  // 同时产出符合 Google 规范的 sitemap-index.xml（对应 public/_headers 中的 /sitemap-index.xml 规则），
  // 便于在 Google Search Console 中作为备用索引提交，绕过单文件状态缓存延迟。
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE}/sitemap.xml</loc>
    <lastmod>${siteLastmod}</lastmod>
  </sitemap>
</sitemapindex>
`
  writeFileSync(join(distDir, 'sitemap-index.xml'), sitemapIndexXml, 'utf-8')

  return byLoc.size
}
