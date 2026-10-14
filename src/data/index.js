import { javascriptQuestions } from './questions/javascript.js'
import { cssQuestions } from './questions/css.js'
import { frameworkQuestions } from './questions/framework.js'
import { browserEngineeringQuestions } from './questions/browser-engineering.js'
import { jsModulesQuestions } from './questions/js-modules.js'
import { algorithmQuestions } from './questions/algorithm.js'
import { nodejsQuestions } from './questions/nodejs.js'
import { typescriptQuestions } from './questions/typescript.js'
import { buildQuestions } from './questions/build.js'
import { vueQuestions } from './questions/vue.js'
import { reactQuestions } from './questions/react.js'
import { nextjsQuestions } from './questions/nextjs.js'
import { nuxtjsQuestions } from './questions/nuxtjs.js'
import { ssrSsgQuestions } from './questions/ssr-ssg.js'
import { microFrontendQuestions } from './questions/micro-frontend.js'

// 各分类对应的源数据文件（用于按文件真实修改时间计算 Sitemap <lastmod>）
export const CATEGORY_SOURCE_FILES = {
  javascript: ['src/data/questions/javascript.js', 'src/data/questions/js-modules.js'],
  css: ['src/data/questions/css.js'],
  typescript: ['src/data/questions/typescript.js'],
  'browser-engineering': ['src/data/questions/browser-engineering.js'],
  build: ['src/data/questions/build.js'],
  react: ['src/data/questions/react.js'],
  vue: ['src/data/questions/vue.js'],
  'state-management': ['src/data/questions/framework.js'],
  nextjs: ['src/data/questions/nextjs.js'],
  nuxtjs: ['src/data/questions/nuxtjs.js'],
  'ssr-ssg': ['src/data/questions/ssr-ssg.js'],
  'micro-frontend': ['src/data/questions/micro-frontend.js'],
  algorithm: ['src/data/questions/algorithm.js'],
  nodejs: ['src/data/questions/nodejs.js'],
}

// 模块（二级结构：模块 -> 分类）
export const modules = [
  {
    key: 'lang',
    name: '语言基础',
    icon: '📜',
    color: '#ca8a04',
    categories: ['javascript', 'css', 'typescript']
  },
  {
    key: 'browser',
    name: '浏览器与网络',
    icon: '🌐',
    color: '#e34c26',
    categories: ['browser-engineering']
  },
  {
    key: 'build',
    name: '工程化与构建',
    icon: '📦',
    color: '#ffa657',
    categories: ['build']
  },
  {
    key: 'framework',
    name: '框架生态',
    icon: '🧩',
    color: '#42b883',
    categories: ['react', 'vue', 'state-management', 'nextjs', 'nuxtjs']
  },
  {
    key: 'render',
    name: '渲染与架构',
    icon: '🌊',
    color: '#0ea5e9',
    categories: ['ssr-ssg', 'micro-frontend']
  },
  {
    key: 'algo-node',
    name: '算法与 Node',
    icon: '🧮',
    color: '#6366f1',
    categories: ['algorithm', 'nodejs']
  }
]

// 类别元数据（扁平，供统计 / 筛选使用）
export const categories = [
  {
    key: 'javascript',
    name: 'JavaScript 核心',
    icon: '⚡',
    color: '#f7df1e',
    colorBg: '#fefce8',
    description: '数据类型、闭包、原型链、异步、ES6+、模块化'
  },
  {
    key: 'css',
    name: 'CSS 与布局',
    icon: '🎨',
    color: '#1572b6',
    colorBg: '#eff6ff',
    description: 'Flex、Grid、BFC、响应式、动画'
  },
  {
    key: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    color: '#3178c6',
    colorBg: '#eff6ff',
    description: '类型系统、泛型、条件类型、类型体操'
  },
  {
    key: 'browser-engineering',
    name: '浏览器与网络',
    icon: '🌐',
    color: '#e34c26',
    colorBg: '#fff7ed',
    description: 'HTTP、缓存、跨域、安全、渲染、性能'
  },
  {
    key: 'build',
    name: '工程化与构建',
    icon: '📦',
    color: '#ffa657',
    colorBg: '#fff7ed',
    description: 'Webpack、Vite、Tree Shaking、代码分割、缓存、CI'
  },
  {
    key: 'react',
    name: 'React 进阶',
    icon: '⚛️',
    color: '#61dafb',
    colorBg: '#ecfeff',
    description: 'Hooks、并发、Fiber、性能优化、Router'
  },
  {
    key: 'vue',
    name: 'Vue 进阶',
    icon: '💚',
    color: '#42b883',
    colorBg: '#f0fdf4',
    description: '响应式、组合式、Router、性能'
  },
  {
    key: 'state-management',
    name: '状态管理',
    icon: '🔄',
    color: '#a855f7',
    colorBg: '#faf5ff',
    description: 'Redux、Pinia、Zustand、Context'
  },
  {
    key: 'nextjs',
    name: 'Next.js',
    icon: '▲',
    color: '#000000',
    colorBg: '#f4f4f5',
    description: 'App Router、RSC、SSR/SSG/ISR、Server Actions'
  },
  {
    key: 'nuxtjs',
    name: 'Nuxt.js',
    icon: '🟩',
    color: '#00dc82',
    colorBg: '#ecfdf5',
    description: 'Nuxt3、自动导入、Nitro、SSR/SSG'
  },
  {
    key: 'ssr-ssg',
    name: 'SSR / SSG 原理',
    icon: '🌊',
    color: '#0ea5e9',
    colorBg: '#f0f9ff',
    description: '同构、注水、水合、流式、缓存'
  },
  {
    key: 'micro-frontend',
    name: '微前端',
    icon: '🧩',
    color: '#a855f7',
    colorBg: '#faf5ff',
    description: 'qiankun、Module Federation、沙箱、通信'
  },
  {
    key: 'algorithm',
    name: '算法',
    icon: '🧮',
    color: '#6366f1',
    colorBg: '#eef2ff',
    description: '复杂度、数组、链表、树、排序、DP、图'
  },
  {
    key: 'nodejs',
    name: 'Node.js',
    icon: '🟢',
    color: '#83cd29',
    colorBg: '#f7fee7',
    description: '事件循环、Stream、多进程、性能与排查'
  }
]

// 所有题目聚合
export const allQuestions = [
  ...javascriptQuestions,
  ...cssQuestions,
  ...frameworkQuestions,
  ...browserEngineeringQuestions,
  ...jsModulesQuestions,
  ...algorithmQuestions,
  ...nodejsQuestions,
  ...typescriptQuestions,
  ...buildQuestions,
  ...vueQuestions,
  ...reactQuestions,
  ...nextjsQuestions,
  ...nuxtjsQuestions,
  ...ssrSsgQuestions,
  ...microFrontendQuestions
]

// 按 ID 索引
export const questionMap = allQuestions.reduce((map, q) => {
  map[q.id] = q
  return map
}, {})

export function getCategory(key) {
  return categories.find((c) => c.key === key)
}

export function getModule(key) {
  return modules.find((m) => m.key === key)
}

export function getQuestionsByCategory(key) {
  return allQuestions.filter((q) => q.category === key)
}
