// ============================================================
// 课程注册表：学习模块下的全部课程
// 每门课 = meta（元信息 + 章节目录）+ lessons（课程内容）+ plan（学习计划）+ sourceFile（数据源路径）
// ============================================================
import { tsCourseMeta, tsLessons, tsPlan } from './courses/ts-course.js'
import { jsrCourseMeta, jsrLessons, jsrPlan } from './courses/js-reverse-course.js'
import { jsmCourseMeta, jsmLessons, jsmPlan } from './courses/js-modules-course.js'
import { brwCourseMeta, brwLessons, brwPlan } from './courses/browser-course.js'
import { dsaCourseMeta, dsaLessons, dsaPlan } from './courses/dsa-course.js'
import { vibeCourseMeta, vibeLessons, vibePlan } from './courses/vibecoding-course.js'
import { advCourseMeta, advLessons, advPlan } from './courses/advanced-js-course.js'
import { astProCourseMeta, astProLessons, astProPlan } from './courses/ast-pro-course.js'
import { langCourseMeta, langLessons, langPlan } from './courses/lang-course.js'
import { rteCourseMeta, rteLessons, rtePlan } from './courses/rte-course.js'
import { monorepoCourseMeta, monorepoLessons, monorepoPlan } from './courses/monorepo-course.js'
import { webpackCourseMeta, webpackLessons, webpackPlan } from './courses/webpack-course.js'
import { viteCourseMeta, viteLessons, vitePlan } from './courses/vite-course.js'
import { microfeCourseMeta, microfeLessons, microfePlan } from './courses/microfe-course.js'
import { agentCourseMeta, agentLessons, agentPlan } from './courses/agent-course.js'

export const courses = [
  { id: 'ts-course', meta: tsCourseMeta, lessons: tsLessons, plan: tsPlan, sourceFile: 'src/data/courses/ts-course.js' },
  { id: 'jsr', meta: jsrCourseMeta, lessons: jsrLessons, plan: jsrPlan, sourceFile: 'src/data/courses/js-reverse-course.js' },
  { id: 'jsm', meta: jsmCourseMeta, lessons: jsmLessons, plan: jsmPlan, sourceFile: 'src/data/courses/js-modules-course.js' },
  { id: 'browser', meta: brwCourseMeta, lessons: brwLessons, plan: brwPlan, sourceFile: 'src/data/courses/browser-course.js' },
  { id: 'dsa', meta: dsaCourseMeta, lessons: dsaLessons, plan: dsaPlan, sourceFile: 'src/data/courses/dsa-course.js' },
  { id: 'vibe-course', meta: vibeCourseMeta, lessons: vibeLessons, plan: vibePlan, sourceFile: 'src/data/courses/vibecoding-course.js' },
  { id: 'adv-js', meta: advCourseMeta, lessons: advLessons, plan: advPlan, sourceFile: 'src/data/courses/advanced-js-course.js' },
  { id: 'ast-pro', meta: astProCourseMeta, lessons: astProLessons, plan: astProPlan, sourceFile: 'src/data/courses/ast-pro-course.js' },
  { id: 'lang', meta: langCourseMeta, lessons: langLessons, plan: langPlan, sourceFile: 'src/data/courses/lang-course.js' },
  { id: 'rte', meta: rteCourseMeta, lessons: rteLessons, plan: rtePlan, sourceFile: 'src/data/courses/rte-course.js' },
  { id: 'monorepo', meta: monorepoCourseMeta, lessons: monorepoLessons, plan: monorepoPlan, sourceFile: 'src/data/courses/monorepo-course.js' },
  { id: 'webpack', meta: webpackCourseMeta, lessons: webpackLessons, plan: webpackPlan, sourceFile: 'src/data/courses/webpack-course.js' },
  { id: 'vite', meta: viteCourseMeta, lessons: viteLessons, plan: vitePlan, sourceFile: 'src/data/courses/vite-course.js' },
  { id: 'microfe', meta: microfeCourseMeta, lessons: microfeLessons, plan: microfePlan, sourceFile: 'src/data/courses/microfe-course.js' },
  { id: 'agent', meta: agentCourseMeta, lessons: agentLessons, plan: agentPlan, sourceFile: 'src/data/courses/agent-course.js' }
]

export function getCourse(id) {
  return courses.find((c) => c.id === id) || courses[0]
}
