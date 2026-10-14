// 课程 id → URL slug 映射（内部数据 id 不变，仅 URL 层使用）
// 定稿见 REFACTOR-SEO-PLAN.md 第二节
export const COURSE_SLUGS = {
  'ts-course': 'typescript',
  jsr: 'js-reverse',
  jsm: 'js-modules',
  browser: 'browser',
  dsa: 'data-structures',
  'vibe-course': 'vibe-coding',
  'adv-js': 'js-internals',
  'ast-pro': 'ast',
  lang: 'interpreter',
  rte: 'rich-text-editor',
  monorepo: 'monorepo',
  webpack: 'webpack',
  vite: 'vite',
  microfe: 'micro-frontend',
}

// 反查：slug → 课程 id
export const SLUG_TO_COURSE_ID = Object.fromEntries(
  Object.entries(COURSE_SLUGS).map(([id, slug]) => [slug, id])
)
