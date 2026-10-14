// SSG 构建主入口 —— 协调静态资源拷贝、各模块页面预渲染、301 重定向表与 Sitemap 生成
import { writeFileSync, mkdirSync, readdirSync, existsSync, rmSync, cpSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { courses } from '../src/data/courses.js'
import { allQuestions } from '../src/data/index.js'
import { loadStyles, createPageShell } from '../src/ssg/layout.js'
import { buildCoursePages } from '../src/ssg/pages/courses.js'
import { buildInterviewPages } from '../src/ssg/pages/interview.js'
import { buildStaticPages } from '../src/ssg/pages/static-pages.js'
import { createLastmodResolver, writeRedirects, writeSitemaps } from '../src/ssg/sitemap.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist')
const PUBLIC = join(ROOT, 'public')
const CSS_DIR = join(ROOT, 'src', 'styles')

function writePage(relDir, html) {
  const full = join(DIST, relDir, 'index.html')
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, html, 'utf-8')
}

// 1. 准备 dist 目录并同步 public/ 静态资源
mkdirSync(DIST, { recursive: true })
for (const name of readdirSync(PUBLIC)) {
  cpSync(join(PUBLIC, name), join(DIST, name), { recursive: true })
}
for (const dir of ['course', 'interview', 'progress', 'guestbook', 'donate', 'assets']) {
  rmSync(join(DIST, dir), { recursive: true, force: true })
}
rmSync(join(DIST, 'sitemap.xml'), { force: true })
rmSync(join(DIST, 'sitemap-index.xml'), { force: true })

// 2. 加载并校验内联 CSS 外壳与真实源文件修改日期
const styles = loadStyles(CSS_DIR)
const pageShell = createPageShell(styles)
const lastmodResolver = createLastmodResolver(ROOT)

// 3. 分模块渲染全部静态页面
const courseResult = buildCoursePages({
  writePage,
  pageShell,
  getCourseLastmod: lastmodResolver.getCourseLastmod,
  latestCourseLastmod: lastmodResolver.latestCourseLastmod,
})

const interviewResult = buildInterviewPages({
  writePage,
  pageShell,
  getCategoryLastmod: lastmodResolver.getCategoryLastmod,
  latestQuestionLastmod: lastmodResolver.latestQuestionLastmod,
})

const staticResult = buildStaticPages({
  distDir: DIST,
  writePage,
  pageShell,
  byCategory: interviewResult.byCategory,
  siteLastmod: lastmodResolver.siteLastmod,
})

// 4. 产出 _redirects、sitemap.xml 与 sitemap-index.xml
const allRedirects = [...courseResult.redirectLines, ...interviewResult.redirectLines]
const oldRedirectCount = writeRedirects(DIST, allRedirects)

const allSitemapEntries = [
  ...staticResult.sitemapEntries,
  ...courseResult.sitemapEntries,
  ...interviewResult.sitemapEntries,
]
const sitemapCount = writeSitemaps(DIST, allSitemapEntries, lastmodResolver.siteLastmod)

const totalFiles = courseResult.fileCount + interviewResult.fileCount + staticResult.fileCount
console.log('[ssg] 静态页文件数 =', totalFiles)
console.log('[ssg] sitemap <loc> 数 =', sitemapCount, '（课程', courses.length, '· 分类', interviewResult.byCategory.size, '· 题目', allQuestions.length, '）')
console.log('[ssg] 301 旧 URL 数 =', oldRedirectCount)
console.log('[ssg] 首页 =', existsSync(join(DIST, 'index.html')) ? '已直出' : '缺失')
console.log('[ssg] 前端框架 = 无（模块化静态 HTML + 原生 JS 小岛）')
