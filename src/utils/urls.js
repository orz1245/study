// 语义化 URL 构造层（纯 JS，SPA 与 SSG 共用）
// 原则：内部数据 id（brw-l1 / alg-001 等）一律不动，本层只负责 id ↔ URL 的双向转换。
// URL 规范见 REFACTOR-SEO-PLAN.md 第二节：
//   课程 landing  /course/<course-slug>/
//   课时          /course/<course-slug>/l<N>/
//   分类聚合页    /interview/<category-slug>/
//   题目          /interview/<category-slug>/<question-slug>/
import { COURSE_SLUGS, SLUG_TO_COURSE_ID } from '../data/slugs.js'
import { QUESTION_SLUGS, SLUG_TO_QUESTION_ID } from '../data/question-slugs.js'

// 分类 key 本身已语义化，直接作 slug；如需个别调整只改这里
const CATEGORY_SLUGS = {}
const SLUG_TO_CATEGORY = {}

export function courseSlug(courseId) {
  return COURSE_SLUGS[courseId] || courseId
}

export function courseIdFromSlug(slug) {
  return SLUG_TO_COURSE_ID[slug] || slug
}

export function categorySlug(category) {
  return CATEGORY_SLUGS[category] || category
}

export function categoryFromSlug(slug) {
  return SLUG_TO_CATEGORY[slug] || slug
}

export function questionSlug(questionId) {
  return QUESTION_SLUGS[questionId] || questionId
}

export function questionIdFromSlug(slug) {
  return SLUG_TO_QUESTION_ID[slug] || null
}

// ---------- 正向构造 ----------
export const courseUrl = (courseId) => `/course/${courseSlug(courseId)}/`
export const lessonUrl = (courseId, lessonIndex) => `/course/${courseSlug(courseId)}/l${lessonIndex + 1}/`
export const categoryUrl = (category) => `/interview/${categorySlug(category)}/`
export const questionUrl = (question) => `/interview/${categorySlug(question.category)}/${questionSlug(question.id)}/`

// ---------- 反向解析（SPA 路由用） ----------
// 解析 /course/<slug>/l<N>/ → { courseId, lessonIndex }；兼容旧 /course/<id>/<lessonId> 由 router 层处理
export function parseCoursePath(slug, lessonToken) {
  const courseId = courseIdFromSlug(slug)
  if (!lessonToken) return { courseId, lessonIndex: null }
  // 路由写成 `/course/:courseSlug/l:lessonNum` 时，静态前缀 l 已被吃掉，lessonToken 是纯数字 "2"；
  // 而 URL 语义上又是 l2。两种写法都接受，否则每个课时深链都定位不到、一律停在第一节。
  const m = /^l?(\d+)$/.exec(String(lessonToken))
  if (m) return { courseId, lessonIndex: Math.max(0, parseInt(m[1], 10) - 1) }
  return { courseId, lessonIndex: null, legacyLessonId: lessonToken }
}

// 解析 /interview/<cat>/<slug>/ → { category, questionId }（questionSlug 解析失败返回 null id）
export function parseInterviewPath(catSlug, qSlug) {
  const category = categoryFromSlug(catSlug)
  if (!qSlug) return { category, questionId: null }
  return { category, questionId: questionIdFromSlug(qSlug) }
}
