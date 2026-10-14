// 全站 SEO 的单一真源（Node 与浏览器共用，不依赖 DOM）。
//
// 为什么要有这个文件：此前 head 有「两个真源」—— 构建期 scripts/ssg.mjs 直出一套
// title/description/canonical，运行时 App.vue 的 useHead 又写一套，两边不一致。
// 实测后果：同一页在爬虫眼里和用户挂载后是两个 head；基础页的 canonical 有两个值；
// 14 个分类页挂载后退化成同一个标题。现在两边都只调用本文件，head 只有一份定义，
// scripts/verify-routes.mjs 会逐页断言「静态 head === 运行时 head」。
//
// 文案原则：
//   1. title / description 是写给人看的有意义文案，自然把核心关键词带出来，不做关键词堆砌；
//   2. 核心关键词集中放在 keywords；
//   3. description 只讲「内容是什么」，不讲界面功能（不写答案可展开、掌握度标记、进度看板这类交互）。

import { courses } from '../data/courses.js'
import { allQuestions, categories } from '../data/index.js'
import { courseUrl, lessonUrl, categoryUrl, questionUrl, courseIdFromSlug, categoryFromSlug, questionIdFromSlug } from './urls.js'
import { flatLessons } from './course-structure.js'

export const SITE_ORIGIN = 'https://study.791860.xyz'
export const SITE_NAME = '前端学习网'

export const TOTAL_COURSES = courses.length
export const TOTAL_LESSONS = courses.reduce((s, c) => s + flatLessons(c).length, 0)
export const TOTAL_QUESTIONS = allQuestions.length
export const TOTAL_CATEGORIES = categories.length

export { courseUrl, lessonUrl, categoryUrl, questionUrl }

// ---------- URL 规范 ----------
// canonical 必须带尾斜杠：站内导航一度用无斜杠形式（/progress），而静态页与 sitemap
// 是带斜杠的（/progress/），不归一化就会给同一页写出两个 canonical，等于没声明。
export function normalizePath(p = '/') {
  let s = String(p || '/').split('?')[0].split('#')[0]
  if (!s.startsWith('/')) s = '/' + s
  if (/\/[^/]*\.[a-z0-9]+$/i.test(s)) return s // 静态文件（.html/.png/.xml…）不补斜杠
  return s.endsWith('/') ? s : s + '/'
}

export function canonicalFor(p) {
  return SITE_ORIGIN + normalizePath(p)
}

// ---------- 文案裁剪 ----------
// 两端共用同一个裁剪函数，否则静态页与挂载后的 description 会出现长度差。
export function clip(text, max) {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1) + '…'
}

// 题目标题截断长度：实测 289 道题在 30 字处前缀唯一（24 字会碰撞），
// 且加后缀后仍在搜索结果可完整展示的长度内。这里必须是「确定性」规则，
// 构建期与运行期才能算出同一个标题。
const QUESTION_TITLE_MAX = 30

const DIFFICULTY_LABEL = { easy: '基础', medium: '进阶', hard: '高阶' }

// ---------- 核心关键词表 ----------
// 分类的「搜索展示名」与核心关键词。展示名用于 h1/title/面包屑（此前误用了内部 key，
// 于是出现了 "algorithm 面试题" 这种把内部编号当用户可见文案的情况）。
const CATEGORY_SEO = {
  javascript: {
    name: 'JavaScript',
    keywords: ['JavaScript面试题', 'JS面试题', 'JavaScript面试题及答案', '闭包', '原型链', '事件循环', 'this指向', 'Promise', 'async/await', 'ES6', 'JavaScript八股文'],
  },
  css: {
    name: 'CSS',
    keywords: ['CSS面试题', 'CSS面试题及答案', 'Flex布局', 'Grid布局', 'BFC', 'CSS居中', '响应式布局', '选择器权重', 'CSS动画'],
  },
  typescript: {
    name: 'TypeScript',
    keywords: ['TypeScript面试题', 'TS面试题', 'TypeScript泛型', '条件类型', 'infer', '类型体操', 'TypeScript类型系统'],
  },
  'browser-engineering': {
    name: '浏览器与网络',
    keywords: ['浏览器面试题', 'HTTP面试题', '浏览器缓存', '跨域', '浏览器渲染原理', '前端性能优化', 'HTTPS', 'HTTP2', '前端安全', 'XSS', 'CSRF'],
  },
  build: {
    name: '前端工程化',
    keywords: ['前端工程化面试题', 'Webpack面试题', 'Vite面试题', 'Tree Shaking', '代码分割', '前端构建优化', '前端CI CD'],
  },
  react: {
    name: 'React',
    keywords: ['React面试题', 'React Hooks', 'useEffect', 'React Fiber', 'React并发模式', 'React性能优化', 'React Router', '虚拟DOM'],
  },
  vue: {
    name: 'Vue',
    keywords: ['Vue面试题', 'Vue3面试题', 'Vue响应式原理', '组合式API', 'Vue Router', 'Pinia', 'Vue diff算法', 'Vue性能优化'],
  },
  'state-management': {
    name: '状态管理',
    keywords: ['状态管理面试题', 'Redux面试题', 'Pinia面试题', 'Zustand', 'React Context', '状态管理选型'],
  },
  nextjs: {
    name: 'Next.js',
    keywords: ['Next.js面试题', 'App Router', 'React Server Components', 'SSR', 'SSG', 'ISR', 'Server Actions'],
  },
  nuxtjs: {
    name: 'Nuxt.js',
    keywords: ['Nuxt.js面试题', 'Nuxt3', '自动导入', 'Nitro', 'Nuxt SSR'],
  },
  'ssr-ssg': {
    name: 'SSR 与 SSG',
    keywords: ['SSR面试题', 'SSG', '服务端渲染原理', '同构渲染', '水合Hydration', '流式渲染'],
  },
  'micro-frontend': {
    name: '微前端',
    keywords: ['微前端面试题', 'qiankun', 'Module Federation', '微前端沙箱', '微前端通信'],
  },
  algorithm: {
    name: '前端算法',
    keywords: ['前端算法题', '算法面试题', '时间复杂度', '数组算法', '链表', '二叉树', '排序算法', '动态规划', '手写代码'],
  },
  nodejs: {
    name: 'Node.js',
    keywords: ['Node.js面试题', 'Node事件循环', 'Node Stream', 'cluster', 'Node多进程', 'Node性能排查'],
  },
}

const SITE_KEYWORDS = ['前端面试题', '前端面试题库', '前端面试题及答案', '前端八股文', '前端学习网']

function categoryMeta(key) {
  return categories.find((c) => c.key === key) || null
}

export function categorySeoName(key) {
  return CATEGORY_SEO[key]?.name || categoryMeta(key)?.name || key
}

export function categoryKeywords(key) {
  return CATEGORY_SEO[key]?.keywords || []
}

function mergeKeywords(...lists) {
  const seen = new Set()
  const out = []
  for (const list of lists) {
    for (const raw of list || []) {
      const term = String(raw || '').trim()
      if (!term) continue
      const k = /[A-Za-z]/.test(term) ? term.toLowerCase() : term
      if (seen.has(k)) continue
      seen.add(k)
      out.push(term)
    }
  }
  return out.slice(0, 18)
}

// 题目/文章里的头几个小标题，用来给分类页写一句「有实感」的描述
function sampleQuestions(list, n = 2) {
  return list.slice(0, n).map((q) => clip(q.question, 22))
}

// ---------- 各类页面的 head ----------

export function homeSeo() {
  const featured = courses.slice(0, 4).map((c) => c.meta.title).join('、')
  return {
    title: `${SITE_NAME} - 前端面试题库与前端系统课程`,
    description: `${TOTAL_QUESTIONS} 道前端面试题按 JavaScript、CSS、TypeScript、React、Vue、浏览器原理、工程化、算法与 Node 等 ${TOTAL_CATEGORIES} 个方向整理，每题附完整答案；另有 ${TOTAL_COURSES} 门前端系统课程（${featured} 等）共 ${TOTAL_LESSONS} 节，每节都配可运行的代码和课后练习。`,
    keywords: mergeKeywords(
      ['前端学习网', '前端面试题库', '前端系统课程', '前端教程', '前端学习路线'],
      SITE_KEYWORDS,
      ['JavaScript面试题', 'TypeScript面试题', 'CSS面试题', '浏览器原理', '前端工程化', '前端算法题', '手写代码']
    ),
  }
}

export function courseIndexSeo() {
  return {
    title: `全部课程 - ${TOTAL_COURSES} 门前端系统课程 | ${SITE_NAME}`,
    description: `这里收录了 ${TOTAL_COURSES} 门前端系统课程，共 ${TOTAL_LESSONS} 节：浏览器渲染原理、手写一门编程语言、富文本编辑器、TypeScript 类型系统、JS 逆向、AST、数据结构与算法、Webpack、Vite、Monorepo 与微前端等，都是能跟着敲下来的实战内容。`,
    keywords: mergeKeywords(
      ['前端课程', '前端系统课程', '前端教程', '前端进阶', '前端学习路线'],
      SITE_KEYWORDS,
      courses.map((c) => c.meta.title)
    ),
  }
}

export function courseSeo(course) {
  const n = flatLessons(course).length
  const chapters = (course.meta.chapters || []).length
  return {
    title: `${course.meta.title}教程（${n} 节）| ${SITE_NAME}`,
    description: clip(`${course.meta.title}共 ${n} 节课、分 ${chapters} 章：${course.meta.subtitle || ''}`, 150),
    keywords: mergeKeywords(
      [course.meta.title, `${course.meta.title}教程`, '前端教程', '前端实战'],
      SITE_KEYWORDS
    ),
  }
}

export function lessonSeo(course, lessonIndex) {
  const list = flatLessons(course)
  const lesson = list[lessonIndex]
  if (!lesson) return notFoundSeo()
  const chapter = lesson.chapterName ? ` · ${lesson.chapterName}` : ''
  return {
    title: `${lesson.title} - ${course.meta.title}第 ${lessonIndex + 1} 节 | ${SITE_NAME}`,
    description: clip(`${lesson.title}。${course.meta.title} 第 ${lessonIndex + 1} 节${chapter}——这一节讲清楚它是什么、为什么需要它，以及怎么在自己的代码里用起来。`, 150),
    keywords: mergeKeywords(
      [lesson.title, course.meta.title, lesson.chapterName, '前端教程', '前端实战'],
      SITE_KEYWORDS
    ),
  }
}

export function interviewSeo() {
  return {
    title: `前端面试题库 - ${TOTAL_QUESTIONS} 道前端面试题及答案 | ${SITE_NAME}`,
    description: `${TOTAL_QUESTIONS} 道前端面试题，按 JavaScript、CSS、TypeScript、React、Vue、浏览器与网络、工程化、算法与 Node 等 ${TOTAL_CATEGORIES} 个方向整理。每道题都给出完整答案和代码示例，既可以顺着一个方向系统复习，也可以在面试前临时来查漏补缺。`,
    keywords: mergeKeywords(
      // 先放跨方向的核心词，保证它们不会因为 18 条上限被前排分类挤掉
      [
        '前端面试题库',
        '前端面试题',
        '前端面试题及答案',
        '前端八股文',
        'JavaScript面试题',
        'CSS面试题',
        'HTML面试题',
        'React面试题',
        'Vue面试题',
        'TypeScript面试题',
        '浏览器面试题',
        '前端工程化面试题',
        '前端算法题',
        '手写代码',
        'HTTP面试题',
        '前端性能优化',
        '前端场景题',
      ],
      categories.flatMap((c) => categoryKeywords(c.key))
    ),
  }
}

export function categorySeo(categoryKey) {
  const key = categoryFromSlug(categoryKey)
  const meta = categoryMeta(key)
  const list = allQuestions.filter((q) => q.category === key)
  if (!meta || !list.length) return notFoundSeo()
  const name = categorySeoName(key)
  const [q1, q2] = sampleQuestions(list)
  const examples = [q1, q2].filter(Boolean).map((t) => `「${t}」`).join('')
  return {
    title: `${name}面试题及答案 - ${list.length} 道高频题 | ${SITE_NAME}`,
    description: clip(`${name}面试题共 ${list.length} 道，覆盖 ${meta.description} 等考点，${examples}这类高频题都给出了完整答案和代码示例。`, 150),
    keywords: mergeKeywords(categoryKeywords(key), [`${name}面试题`, `${name}面试题及答案`], SITE_KEYWORDS),
  }
}

export function questionSeo(question) {
  const name = categorySeoName(question.category)
  const qTitle = question.question.length > QUESTION_TITLE_MAX
    ? question.question.slice(0, QUESTION_TITLE_MAX) + '…'
    : question.question
  const diff = DIFFICULTY_LABEL[question.difficulty] || ''
  return {
    title: `${qTitle} - ${name}面试题及答案`,
    description: clip(`「${clip(question.question, 40)}」——${name}方向的一道${diff}前端面试题，回答里给出完整思路和代码示例，可以对照着检查自己的理解有没有遗漏。`, 150),
    keywords: mergeKeywords(
      // 关键词里不能塞整道题（有的长达 100+ 字），截到 24 字保留长尾检索价值
      [clip(question.question, 24), `${name}面试题`, `${name}面试题及答案`],
      question.tags || [],
      SITE_KEYWORDS
    ),
  }
}

// 学习仪表盘（路由 /progress/）。
// 这一页的内容全部来自浏览器 localStorage（做题掌握度），爬虫拿到的是空页面——
// 典型的 thin content。处理方式：保留导航入口、照常生成静态页，但显式 noindex。
// 这样既不占用搜索结果的收录名额、不拉低整站质量判断，用户也照常能点进来用。
// 注意不要改用 robots.txt 的 Disallow：那样爬虫读不到这里的 noindex，反而可能被登记。
export function progressSeo() {
  return {
    title: `学习仪表盘 - ${SITE_NAME}`,
    description: '按方向看自己在前端面试题库里的做题情况：哪些已经掌握、哪些还在学、哪些还没碰过，以及每个方向还差多少。进度保存在你自己的浏览器里，不会上传。',
    keywords: mergeKeywords(['前端学习进度', '前端刷题', '前端面试复习', '前端面试题库'], SITE_KEYWORDS),
    robots: 'noindex, follow',
  }
}

export function guestbookSeo() {
  return {
    title: `留言板 - ${SITE_NAME}`,
    description: '对前端面试题或课程内容有疑问、发现错误、想要补充，都可以在这里留言。留下问题后我会尽量回复，其他人的提问也可能对你有帮助。',
    keywords: ['前端留言板', '前端学习交流', '前端面试题答疑'],
  }
}

export function donateSeo() {
  return {
    title: `支持我们 - ${SITE_NAME}`,
    description: `前端学习网的 ${TOTAL_COURSES} 门课程与 ${TOTAL_QUESTIONS} 道面试题全部免费开放，每道题都附完整答案。如果觉得有帮助，可以在这里请作者喝杯咖啡，支持服务器与后续更新。`,
    keywords: ['支持前端学习网', '打赏'],
  }
}

export function notFoundSeo() {
  return {
    title: `页面不存在 - ${SITE_NAME}`,
    description: '你访问的页面不存在，可能链接已经变更或者输入有误。',
    keywords: [],
    robots: 'noindex, follow',
    noCanonical: true, // 错误页不能自指一个规范地址，否则等于告诉搜索引擎这是个正常页面
  }
}

// 默认允许收录；只有错误页与纯客户端页面（/progress/）显式 noindex
export function robotsOf(seo) {
  return seo?.robots || 'index, follow'
}

// ---------- 路由 → head ----------
// App.vue 与回归脚本都调用它，保证「运行时 head」只有一处实现。
export function seoForRoute(route) {
  const name = route?.name
  const params = route?.params || {}

  if (name === 'home') return homeSeo()
  if (name === 'course-index') return courseIndexSeo()
  if (name === 'progress') return progressSeo()
  if (name === 'guestbook') return guestbookSeo()
  if (name === 'donate') return donateSeo()

  if (name === 'course' || name === 'course-lesson') {
    const slug = params.courseSlug || params.courseKey || ''
    const course = courses.find((c) => c.id === courseIdFromSlug(slug) || c.id === slug)
    if (!course) return notFoundSeo()
    if (name === 'course-lesson') {
      // 路由是 `/course/:courseSlug/l:lessonNum`，静态前缀 l 已被吃掉，这里拿到的是纯数字
      const m = /^l?(\d+)$/.exec(String(params.lessonNum || ''))
      const index = m ? Math.max(0, parseInt(m[1], 10) - 1) : 0
      return lessonSeo(course, index)
    }
    return courseSeo(course)
  }

  if (name === 'interview') return interviewSeo()
  if (name === 'interview-category') return categorySeo(params.catSlug)
  if (name === 'interview-question') {
    const id = questionIdFromSlug(params.qSlug)
    const question = id ? allQuestions.find((q) => q.id === id) : null
    return question ? questionSeo(question) : notFoundSeo()
  }

  return notFoundSeo()
}
