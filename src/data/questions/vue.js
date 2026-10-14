// Vue 进阶面试题（12 题）
export const vueQuestions = [
  {
    id: 'vue-001',
    category: 'vue',
    module: 'framework',
    difficulty: 'easy',
    tags: ['Vue Router', '路由守卫', '权限'],
    question: 'Vue Router 的导航守卫有哪些？如何实现登录权限控制？',
    answer: `守卫分三类：

- **全局**：\`beforeEach\`（最常用，做权限）、\`beforeResolve\`、\`afterEach\`（不拦截，做埋点）
- **路由级**：在路由配置里写 \`beforeEnter\`
- **组件级**：\`beforeRouteEnter\` / \`beforeRouteUpdate\` / \`beforeRouteLeave\`

\`\`\`js
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.isLogin) {
    next('/login')          // 未登录跳登录
  } else {
    next()                  // 必须调用 next() 放行
  }
})
\`\`\`

**登录权限**：把需要鉴权的路由标记 \`meta.requiresAuth\`，在全局 \`beforeEach\` 里判断是否登录，未登录 \`next('/login')\`。注意 Vue Router 4 中 \`next\` 可省略，直接 \`return\` 路径即可。`
  },
  {
    id: 'vue-002',
    category: 'vue',
    module: 'framework',
    difficulty: 'easy',
    tags: ['路由', 'history', 'hash', '懒加载'],
    question: 'Vue Router 的 history 模式与 hash 模式区别？路由懒加载怎么做？',
    answer: `- **hash 模式**：URL 带 \`#\`，如 \`/foo#/bar\`，改动不刷新、不请求服务器，兼容好、无需服务端配置
- **history 模式**：URL 干净（\`/foo/bar\`），但刷新/直接访问会 404，需服务端把所有路径 fallback 到 \`index.html\`

\`\`\`js
const routes = [
  { path: '/about', component: () => import('./About.vue') }  // 懒加载
]
\`\`\`

**路由懒加载**用动态 \`import()\`，配合 Webpack/Vite 自动拆分成独立 chunk，首屏只加载当前路由代码，大幅减小主包。`
  },
  {
    id: 'vue-003',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Teleport', '传送', '弹窗'],
    question: 'Vue 的 Teleport 是什么？解决什么场景？',
    answer: `\`<Teleport>\` 把组件内部的 DOM **渲染到 DOM 树的其它位置**（如 \`body\` 末尾），但**逻辑/状态仍属于原组件**。

\`\`\`vue
<Teleport to="body">
  <div v-if="show" class="modal">弹窗内容</div>
</Teleport>
\`\`\`

**典型场景**：

- 全局弹窗 / Toast / 抽屉：避免被父级 \`overflow:hidden\`、\`z-index\`、\`transform\` 层叠上下文影响
- 需要突破父容器样式隔离的浮层

> 注意：\`to="body"\` 后元素脱离了组件模板 DOM，但事件、响应式数据、生命周期仍受原组件控制，卸载组件时 Teleport 内容也会一并销毁。`
  },
  {
    id: 'vue-004',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Transition', '动画', '过渡'],
    question: 'Vue 的 <Transition> 如何做进出场动画？有哪些钩子和类名？',
    answer: `\`<Transition>\` 给**单个元素/组件**的插入、更新、移除自动添加 CSS 过渡类名：

\`\`\`text
v-enter-from → v-enter-active → v-enter-to   (进入)
v-leave-from → v-leave-active → v-leave-to   (离开)
\`\`\`

\`\`\`vue
<Transition name="fade">
  <p v-if="show">hello</p>
</Transition>
<style>
.fade-enter-active, .fade-leave-active { transition: opacity .3s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
\`\`\`

多个元素用 \`<TransitionGroup>\`（需 \`key\`）。也可配合 JS 钩子 \`@enter\` / \`@leave\` 用 GSAP 等库做复杂动画。列表整体过渡注意 FLIP 动画。`
  },
  {
    id: 'vue-005',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['自定义指令', 'directive', '钩子'],
    question: '如何写一个 Vue 自定义指令（directive）？常用钩子有哪些？',
    answer: `指令是复用 DOM 底层行为的手段（如自动聚焦、权限控制、懒加载）。

\`\`\`js
app.directive('focus', {
  mounted(el) { el.focus() },          // 绑定元素插入父节点后
  updated(el, binding) { /* 组件更新后 */ },
  unmounted(el) { /* 解绑 */ }
})
// 使用：<input v-focus />
\`\`\`

**钩子**：\`created\` / \`beforeMount\` / \`mounted\` / \`beforeUpdate\` / \`updated\` / \`beforeUnmount\` / \`unmounted\`。\`binding\` 含 \`value\`、\`arg\`、\`modifiers\` 等。

> 何时用指令 vs 组件：涉及**普通 DOM 操作**用指令；涉及结构/状态用组件。Vue3 中多数场景更推荐 composable。`
  },
  {
    id: 'vue-006',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['mixins', 'composables', '复用'],
    question: 'mixins 和 composables 有什么区别？为什么 Vue3 推荐组合式函数？',
    answer: `**mixins（Vue2 遗产）**：

- 多个 mixin 的同名选项会**合并**（data 浅合并、方法覆盖），来源不清晰 → 命名冲突、来源难追溯（"属性从哪来"）
- 不接收参数，复用性差

**composables（Vue3 组合式函数）**：

- 普通函数返回响应式状态，复用清晰、可传参、可读性强
- 来源明确（import 进来），无隐式合并

\`\`\`js
// composables/useCounter.js
export function useCounter(initial = 0) {
  const count = ref(initial)
  const inc = () => count.value++
  return { count, inc }
}
\`\`\`

> 结论：新项目一律用 composables；mixins 仅用于维护老 Vue2 代码。`
  },
  {
    id: 'vue-007',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['provide', 'inject', '跨层通信'],
    question: 'Vue 的 provide / inject 怎么用？有什么坑？',
    answer: `\`provide/inject\` 实现**跨层级**传递（祖先 → 后代），跳过中间的 props 透传。

\`\`\`js
// 祖先
import { provide, ref } from 'vue'
provide('theme', ref('dark'))
// 后代
const theme = inject('theme', 'light')  // 第二个参数是默认值
\`\`\`

**坑**：

1. **不是响应式透传的银弹**：provide 普通值，后代改了祖先感知不到；要响应式必须 provide 一个 \`ref\` / \`reactive\`
2. **耦合**：后代依赖祖先注入了某个 key，组件独立性变差（建议用 Symbol 作 key 避免命名冲突）
3. 不要用于常规父子通信，那该用 props/emits

> Vue3 里常配合 \`inject\` 做组件库的「上下文」能力（如 Form 与 FormItem 通信）。`
  },
  {
    id: 'vue-008',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['组件通信', '全方案', '选型'],
    question: 'Vue 组件之间有哪些通信方式？分别适用什么场景？',
    answer: `\`\`\`text
父子：  props 向下 / emits 向上        （最常用，清晰）
       v-model (语法糖，双向)
       ref + defineExpose（父拿子实例）
兄弟：  共享状态（Pinia / 简单 reactive 单例）/ 事件总线(mitt)
跨层：  provide / inject
全局：  Pinia / Vuex
模板：  slot（默认/具名/作用域插槽）
\`\`\`

**选型原则**：

- 简单的父子 → props/emits
- 中型应用共享状态 → Pinia（比 Vuex 轻、API 简单）
- 跨多层级且局部 → provide/inject
- 一次性结构复用 → slot

> 避免滥用事件总线（易失控、难追踪）；大型项目统一用 Pinia。`
  },
  {
    id: 'vue-009',
    category: 'vue',
    module: 'framework',
    difficulty: 'hard',
    tags: ['响应式', 'Proxy', 'Vue2差异'],
    question: 'Vue2 和 Vue3 的响应式原理有何不同？为什么 Vue3 用 Proxy？',
    answer: `- **Vue2**：用 \`Object.defineProperty\` 递归劫持每个属性的 \`get/set\`。**缺陷**：① 数组索引/长度变化监听不到（需重写数组方法）；② 新增/删除属性需 \`Vue.set\`；③ 初始化时递归遍历全对象，大对象成本高
- **Vue3**：用 \`Proxy\` 代理整个对象 + \`Reflect\`。**优势**：① 懒代理（访问到才递归）；② 天然监听新增/删除属性（\`deleteProperty\`）；③ 数组原生支持；④ 不需要 \`Vue.set\`

\`\`\`js
const p = new Proxy(obj, {
  get(t, k, r) { track(); return Reflect.get(t, k, r) },
  set(t, k, v, r) { const ok = Reflect.set(t, k, v, r); trigger(); return ok }
})
\`\`\`

> 代价：Proxy 无法 polyfill 到 IE，这也是 Vue3 放弃 IE 支持的原因。`
  },
  {
    id: 'vue-010',
    category: 'vue',
    module: 'framework',
    difficulty: 'hard',
    tags: ['性能优化', '编译优化', 'PatchFlag'],
    question: 'Vue3 做了哪些编译期/运行时性能优化？',
    answer: `**编译期（模板编译）**：

- **PatchFlag**：编译时给动态节点打标记（如 \`TEXT\`、\`CLASS\`），diff 时只比对打了标记的部分，跳过静态节点
- **静态提升（hoistStatic）**：把静态节点/属性提到渲染函数外，避免每次重建
- **缓存事件处理函数**：\`@click\` 等编译为缓存的 \`_cache\`，减少内联函数创建
- **Block Tree**：以 \`v-if/v-for\` 等结构指令为 block，快速跳过不变区块

**运行时**：Proxy 懒代理、更高效的组件实例结构、Tree-shaking 友好（API 按需引入）。

> 效果：同等场景下 Vue3 比 Vue2 运行时性能约快 1.2~2 倍，内存占用更低。`
  },
  {
    id: 'vue-011',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['异步组件', 'Suspense', 'defineAsyncComponent'],
    question: 'Vue 的异步组件和 Suspense 怎么用？',
    answer: `**异步组件**：用 \`defineAsyncComponent\` 懒加载，常配合 loading/error 状态：

\`\`\`js
import { defineAsyncComponent } from 'vue'
const AsyncComp = defineAsyncComponent({
  loader: () => import('./Heavy.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorComp,
  delay: 200, timeout: 3000
})
\`\`\`

**Suspense**：等待其下「异步 setup / async 组件」就绪后再渲染，提供 \`#fallback\` 插槽：

\`\`\`vue
<Suspense>
  <template #default><AsyncUser /></template>
  <template #fallback><Spinner /></template>
</Suspense>
\`\`\`

> 异步组件的 \`loader\` 返回 Promise（通常是动态 \`import\`）；Suspense 负责统一"等待多个异步依赖"。`
  },
  {
    id: 'vue-012',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['宏', 'defineProps', 'defineEmits', 'defineExpose'],
    question: 'Vue3 <script setup> 里的 defineProps / defineEmits / defineExpose 分别做什么？',
    answer: `这三个是 \`<script setup>\` 的**编译器宏**（无需 import，编译期处理）：

- \`defineProps\`：声明接收的 props（类型 + 默认值），返回一个对象可直接解构（需用 \`toRefs\` 保持响应性）
- \`defineEmits\`：声明可触发的事件，返回 \`emit\` 函数
- \`defineExpose\`：默认 \`<script setup>\` 的变量是**私有**的，用 \`defineExpose({...})\` 显式暴露给父组件（父通过 \`ref\` 访问）

\`\`\`vue
<script setup>
const props = defineProps({ msg: String })
const emit = defineEmits(['change'])
defineExpose({ reset })
</script>
\`\`\`

> 区别于 Options API：组合式更简洁，且宏在编译期被擦除，不会出现在运行时。`
  },
  {
    id: 'vue-013',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['路由', 'keep-alive', '滚动恢复', 'SPA', 'popstate'],
    question: 'SPA 中：首页加载帖子列表，点击某帖跳转详情页（URL 变化），点击浏览器后退返回首页时，如何让列表内容保持原状、无需重新请求也无需重新渲染？请从路由机制、组件缓存、滚动恢复三方面说明原理，并分别给出 Vue 与 React 的实现。',
    answer: `核心矛盾：SPA 路由切换本质是**组件卸载/挂载**。默认情况下返回列表页 = 重新 mount = 重新发请求、重新渲染、滚动回到顶部。要做到"原样保留"，需要**三件套**：组件实例缓存 + 数据状态外提 + 滚动位置恢复。

## 一、底层机制：URL 变化如何驱动视图

- 浏览器后退/前进触发 \`popstate\` 事件，URL 变化后路由库（vue-router / react-router）监听它，解析出新路由并**切换对应组件**。
- 路由库只负责"切组件"，**不负责保存旧页面的状态**——状态丢失是"切组件"的天然副作用，不是路由的错。
- 因此解决方案都围绕：让"切走"的组件不被真正销毁，或让数据不依赖组件生命周期。

## 二、方案 A：组件缓存（Vue 推荐）

Vue 的 \`<keep-alive>\` 会**缓存组件实例**（连同 DOM 子树、data、滚动的 DOM 位置）：

\`\`\`vue
<router-view v-slot="{ Component }">
  <keep-alive :include="['Home']" :max="10">
    <component :is="Component" />
  </keep-alive>
</router-view>
\`\`\`

- 切走时组件不销毁，而是 \`deactivated\`；返回时**不重新 mount**，\`onMounted\` 不再执行 → 自然不发请求、不重新渲染。
- \`onActivated\` 里可做"增量刷新"（如静默拉最新数据但保留旧列表），配合 \`include\`/\`exclude\` 精确控制缓存哪些路由，\`max\` 限制缓存上限。

## 三、方案 B：状态外提（React 常用）

React Router 默认**没有 keep-alive**，返回列表页必然重新 mount。常见做法：

1. **把列表数据 + 筛选分页 + 滚动位置提升到全局 store**（Redux / Zustand / Pinia），组件重新挂载时从 store 直接恢复，不发请求。
2. **"有缓存则不请求"约定**：\`useEffect\` 里 \`if (store.list.length) return; fetch()\`。
3. 想彻底保 DOM 可用第三方库 \`react-activation\`（KeepAlive 包裹），或手动维护一个"离屏容器"缓存列表 DOM。

## 四、滚动位置恢复

- **Vue Router**：内置 \`scrollBehavior\`，返回 \`savedPosition\` 即恢复原位置：

\`\`\`js
scrollBehavior(to, from, savedPosition) {
  return savedPosition || { top: 0 }
}
\`\`\`

- **React Router v6**：无内置，手动 \`window.history.scrollRestoration = 'manual'\` + 在路由切换时保存/恢复 \`scrollTop\`，或监听 \`popstate\` 恢复。
- 底层都依赖浏览器 \`history.scrollRestoration\`（'auto' | 'manual'）。

## 五、常见坑

- 后退但组件被 \`keep-alive\` 排除 → 仍会重新请求。
- 缓存无上限 → 内存泄漏，务必 \`max\`。
- 依赖 \`onMounted\` 发请求的组件，缓存后 \`onMounted\` 只执行一次，第二次进入要写进 \`onActivated\`。
- \`keep-alive\` 不能包"每次都要全新的页面"（如编辑页），用 \`include\` 白名单更安全。`
  }
]
