export const frameworkQuestions = [
  {
    "id": "fw-026",
    "category": "state-management",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Redux",
      "状态管理",
      "React"
    ],
    "question": "Redux 的工作流程是什么？Redux Toolkit 有什么改进？",
    "answer": "### Redux 三大原则\n\n1. **单一数据源**：整个应用只有一个 store\n2. **状态只读**：只能通过 dispatch action 修改\n3. **纯函数修改**：reducer 必须是纯函数\n\n### 工作流程\n\n```text\nView dispatch(action) → Reducer(state, action) → New State → View 更新\n```\n\n### 传统 Redux\n\n```javascript\n// Action Types\nconst INCREMENT = 'INCREMENT'\nconst DECREMENT = 'DECREMENT'\n\n// Action Creators\nconst increment = () => ({ type: INCREMENT })\nconst decrement = () => ({ type: DECREMENT })\n\n// Reducer\nfunction counter(state = { count: 0 }, action) {\n  switch (action.type) {\n    case INCREMENT: return { ...state, count: state.count + 1 }\n    case DECREMENT: return { ...state, count: state.count - 1 }\n    default: return state\n  }\n}\n\n// Store\nconst store = createStore(counter)\n\n// 使用\nstore.dispatch(increment())\n```\n\n### Redux Toolkit（RTK）\n\nRTK 是官方推荐的编写方式，大幅简化代码：\n\n```javascript\nimport { createSlice, configureStore } from '@reduxjs/toolkit'\n\n// 一个 slice 包含 reducer + actions\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { count: 0 },\n  reducers: {\n    // RTK 内部使用 Immer，可以直接\"修改\"状态\n    increment: (state) => { state.count += 1 },\n    decrement: (state) => { state.count -= 1 },\n    incrementBy: (state, action) => { state.count += action.payload }\n  }\n})\n\n// 自动生成 actions\nexport const { increment, decrement, incrementBy } = counterSlice.actions\n\n// 配置 store\nconst store = configureStore({\n  reducer: { counter: counterSlice.reducer }\n})\n```\n\n### React 中使用\n\n```jsx\nimport { useSelector, useDispatch } from 'react-redux'\n\nfunction Counter() {\n  const count = useSelector(state => state.counter.count)\n  const dispatch = useDispatch()\n\n  return (\n    <div>\n      <span>{count}</span>\n      <button onClick={() => dispatch(increment())}>+</button>\n      <button onClick={() => dispatch(incrementBy(5))}>+5</button>\n    </div>\n  )\n}\n```\n\n### RTK 的改进\n\n| 特性 | 传统 Redux | Redux Toolkit |\n|------|-----------|----------------|\n| 样板代码 | 多 | 少 |\n| 不可变更新 | 手动展开 | Immer 自动处理 |\n| Action Creator | 手动写 | 自动生成 |\n| 异步处理 | redux-thunk/saga | createAsyncThunk |\n| TypeScript | 需要大量类型 | 自动推断 |\n\n### createAsyncThunk（异步）\n\n```javascript\nconst fetchUser = createAsyncThunk('user/fetch', async (id) => {\n  const res = await api.getUser(id)\n  return res.data\n})\n\nconst userSlice = createSlice({\n  name: 'user',\n  initialState: { data: null, status: 'idle' },\n  reducers: {},\n  extraReducers: (builder) => {\n    builder\n      .addCase(fetchUser.pending, (state) => { state.status = 'loading' })\n      .addCase(fetchUser.fulfilled, (state, action) => {\n        state.status = 'succeeded'\n        state.data = action.payload\n      })\n      .addCase(fetchUser.rejected, (state) => { state.status = 'failed' })\n  }\n})\n```\n\n### 什么时候用 Redux\n- 大型应用，状态复杂\n- 需要时间旅行调试\n- 多个不相关组件共享状态\n- 中小型项目可以考虑 Zustand / Jotai 等更轻量的方案"
  },
  {
    "id": "fw-027",
    "category": "state-management",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Pinia",
      "状态管理",
      "Vue3"
    ],
    "question": "Pinia 和 Vuex 的区别？为什么 Vue3 推荐用 Pinia？",
    "answer": "### Pinia 基本用法\n\n```javascript\n// stores/counter.js\nimport { defineStore } from 'pinia'\n\n// 组合式写法（推荐）\nexport const useCounterStore = defineStore('counter', () => {\n  const count = ref(0)\n  const double = computed(() => count.value * 2)\n\n  function increment() {\n    count.value++\n  }\n\n  return { count, double, increment }\n})\n```\n\n```javascript\n// 组件中使用\nimport { useCounterStore } from '@/stores/counter'\n\nconst counter = useCounterStore()\nconsole.log(counter.count)\ncounter.increment()\n\n// 解构需要 storeToRefs 保持响应式\nimport { storeToRefs } from 'pinia'\nconst { count, double } = storeToRefs(counter)\nconst { increment } = counter // 方法不需要 storeToRefs\n```\n\n### Pinia vs Vuex\n\n| 特性 | Vuex 4 | Pinia |\n|------|--------|-------|\n| 模块 | 需要 modules 嵌套 | 每个 store 独立平级 |\n| Mutations | 需要（修改状态） | ❌ 不需要，直接修改 |\n| TypeScript | 支持差 | 优秀（类型自动推断）|\n| Composition API | 有限支持 | 原生支持 |\n| 体积 | 较大 | ~1KB |\n| 开发者工具 | 支持 | 支持（更好）|\n| 学习成本 | 中 | 低 |\n| SSR | 复杂 | 简单 |\n\n### 为什么不用 Mutations\n\nVuex 要求通过 mutations 修改状态，因为要配合 devtools 追踪：\n\n```javascript\n// Vuex\nmutations: {\n  SET_COUNT(state, payload) { state.count = payload }\n}\nactions: {\n  increment({ commit }) { commit('SET_COUNT', count + 1) }\n}\n\n// Pinia：直接修改\nconst increment = () => { count.value++ }\n// Pinia 仍然可以被 devtools 追踪\n```\n\n### Pinia 的 Store 模块化\n\n```javascript\n// 每个文件一个 store，不需要 modules\n// stores/user.js\nexport const useUserStore = defineStore('user', () => { ... })\n\n// stores/cart.js\nexport const useCartStore = defineStore('cart', () => { ... })\n\n// stores/settings.js\nexport const useSettingsStore = defineStore('settings', () => { ... })\n\n// 互相调用\nconst userStore = useUserStore()\nconst cartStore = useCartStore()\n```\n\n### 异步操作\n\n```javascript\nexport const useUserStore = defineStore('user', () => {\n  const user = ref(null)\n  const loading = ref(false)\n\n  async function fetchUser(id) {\n    loading.value = true\n    try {\n      user.value = await api.getUser(id)\n    } finally {\n      loading.value = false\n    }\n  }\n\n  return { user, loading, fetchUser }\n})\n```\n\n### 持久化\n\n```javascript\nimport { persist } from 'pinia-plugin-persistedstate'\n\nexport const useUserStore = defineStore('user', () => {\n  // ...\n}, {\n  persist: true  // 自动同步到 localStorage\n})\n```\n\n### 总结\n- Pinia 是 Vue3 官方推荐的状态管理库\n- 更简洁、更好的 TS 支持、更小的体积\n- 如果项目从 Vuex 迁移，可以逐步迁移（Pinia 和 Vuex 可以共存）"
  },
  {
    "id": "fw-028",
    "category": "state-management",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Zustand",
      "状态管理",
      "React"
    ],
    "question": "Zustand 是什么？相比 Redux 有什么优势？",
    "answer": "`Zustand` 是一个轻量级 React 状态管理库，API 简洁，不需要 Provider 包裹。\n\n### 基本用法\n\n```javascript\nimport { create } from 'zustand'\n\nconst useStore = create((set, get) => ({\n  count: 0,\n  name: 'Tom',\n  \n  increment: () => set(state => ({ count: state.count + 1 })),\n  decrement: () => set(state => ({ count: state.count - 1 })),\n  \n  // 可以获取当前 state\n  reset: () => set({ count: 0, name: 'Tom' }),\n  \n  // 异步操作不需要额外中间件\n  fetchUser: async (id) => {\n    const user = await api.getUser(id)\n    set({ user })\n  }\n}))\n\n// 组件中使用\nfunction Counter() {\n  const count = useStore(state => state.count)\n  const increment = useStore(state => state.increment)\n  \n  return <button onClick={increment}>{count}</button>\n}\n\n// 也可以解构（不会重渲染问题）\nconst { count, increment } = useStore()\n```\n\n### 选择性订阅（性能优化）\n\n```javascript\n// 只订阅 count，name 变化不触发重渲染\nconst count = useStore(state => state.count)\n\n// 多个值\nconst { count, name } = useStore(state => ({\n  count: state.count,\n  name: state.name\n}), shallow) // 需要 shallow 比较\n\n// 使用 selector\nconst doubleCount = useStore(state => state.count * 2)\n```\n\n### 中间件\n\n```javascript\nimport { create } from 'zustand'\nimport { persist, devtools } from 'zustand/middleware'\n\nconst useStore = create(\n  devtools(  // Redux DevTools 支持\n    persist(  // localStorage 持久化\n      (set) => ({\n        theme: 'light',\n        toggleTheme: () => set(state => ({\n          theme: state.theme === 'light' ? 'dark' : 'light'\n        }))\n      }),\n      { name: 'app-storage' }\n    )\n  )\n)\n```\n\n### 跨组件共享\n\n```javascript\n// 不需要 Provider，直接使用\n// 任何组件都能访问\nfunction Header() {\n  const theme = useStore(state => state.theme)\n  return <header className={theme}>...</header>\n}\n\nfunction Settings() {\n  const toggleTheme = useStore(state => state.toggleTheme)\n  return <button onClick={toggleTheme}>Toggle</button>\n}\n```\n\n### 对比 Redux\n\n| 特性 | Redux | Zustand |\n|------|-------|---------|\n| 样板代码 | 多 | 极少 |\n| Provider | 需要 | 不需要 |\n| 不可变更新 | 必须 | 可选（可用 Immer）|\n| 异步 | 需要 thunk/saga | 直接 async/await |\n| 包体积 | ~2KB + RTK | ~1KB |\n| TypeScript | 好（RTK） | 优秀 |\n| 学习成本 | 中 | 低 |\n\n### 对比 Context\n\n```javascript\n// Context：任何 context 值变化，所有消费者都重渲染\nconst AppContext = createContext()\n// ❌ 大量组件订阅同一个 context 会有性能问题\n\n// Zustand：精确订阅\nconst count = useStore(state => state.count) // 只有 count 变化才重渲染\n```\n\n### 什么时候用 Zustand\n- 中小型 React 项目\n- 不想用 Redux 的样板代码\n- 需要全局状态但不想用 Context\n- 需要精确的状态订阅\n\n### 与其他轻量方案对比\n- **Jotai**：原子化状态，适合细粒度\n- **Valtio**：Proxy 代理，类似 Vue 的响应式\n- **Zustand**：类似 Redux 的单一 store，但更简洁"
  },
  {
    "id": "fw-029",
    "category": "state-management",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "Context",
      "性能"
    ],
    "question": "React Context 的原理和性能问题是什么？如何优化？",
    "answer": "### Context 基本用法\n\n```jsx\nconst ThemeContext = createContext('light')\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\"dark\">\n      <Child />\n    </ThemeContext.Provider>\n  )\n}\n\nfunction Child() {\n  const theme = useContext(ThemeContext)\n  return <div>{theme}</div> // 'dark'\n}\n```\n\n### 原理\n\n1. Provider 的 value 变化时，React 会**重新渲染所有消费该 Context 的组件**\n2. 即使子组件被 `React.memo` 包裹，Context 变化也会**跳过 memo 直接渲染**\n\n### 性能问题\n\n**问题：Provider value 每次渲染都是新对象，导致所有消费者重渲染**\n\n```jsx\n// ❌ 每次渲染都创建新对象\nfunction App() {\n  const [count, setCount] = useState(0)\n  \n  return (\n    <UserContext.Provider value={{ user, logout }}>\n      {/* count 变化时，即使用户信息没变，消费 UserContext 的组件也会重渲染 */}\n      <ExpensiveTree />\n    </UserContext.Provider>\n  )\n}\n```\n\n### 优化方案\n\n**1. useMemo 缓存 value**\n\n```jsx\nfunction App() {\n  const [count, setCount] = useState(0)\n  const [user, setUser] = useState(null)\n\n  const value = useMemo(() => ({ user, logout }), [user])\n\n  return (\n    <UserContext.Provider value={value}>\n      <ExpensiveTree />\n    </UserContext.Provider>\n  )\n}\n```\n\n**2. 拆分 Context**\n\n```jsx\n// 将频繁变化的和不变的分开\nconst UserContext = createContext()      // 不常变化\nconst ThemeContext = createContext()     // 偶尔变化\nconst CartContext = createContext()      // 频繁变化\n\n// 各自独立 Provider\n<UserContext.Provider value={userValue}>\n  <ThemeContext.Provider value={themeValue}>\n    <CartContext.Provider value={cartValue}>\n      <App />\n    </CartContext.Provider>\n  </ThemeContext.Provider>\n</UserContext.Provider>\n```\n\n**3. use-context-selector（第三方库）**\n\n```jsx\nimport { createContext, useContextSelector } from 'use-context-selector'\n\nconst UserContext = createContext()\n\nfunction Name() {\n  // 只订阅 user.name，其他属性变化不触发\n  const name = useContextSelector(UserContext, state => state.name)\n  return <div>{name}</div>\n}\n```\n\n**4. 状态下放**\n\n```jsx\n// ❌ count 在 Provider 外面，变化不影响 Provider\nfunction App() {\n  return (\n    <UserContext.Provider value={value}>\n      <Counter /> {/* count 变化不影响其他消费者 */}\n    </UserContext.Provider>\n  )\n}\n\nconst Counter = React.memo(() => {\n  const [count, setCount] = useState(0)\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>\n})\n```\n\n### 什么时候用 Context\n- ✅ 主题、用户信息、语言等**低频变化**的全局状态\n- ✅ 依赖注入（如路由、Store）\n- ❌ 频繁变化的状态（购物车、实时数据）→ 用 Zustand/Jotai\n\n### 替代方案对比\n\n| 方案 | 适合场景 | 性能 |\n|------|----------|------|\n| Context | 低频全局状态 | 中（需优化）|\n| Zustand | 通用全局状态 | 好 |\n| Jotai | 细粒度原子状态 | 优秀 |\n| Redux | 大型复杂应用 | 好 |"
  },
  {
    "id": "sm-001",
    "category": "state-management",
    "difficulty": "easy",
    "question": "组件局部状态与全局状态如何划分边界？哪些数据坚决不该放进 Redux / Pinia？",
    "tags": [
      "状态边界",
      "局部状态",
      "全局状态",
      "状态管理选型",
      "架构原则"
    ],
    "answer": "在大型前端项目中，最常见的反模式是**“把所有状态一股脑塞进全局 Store（Redux / Pinia / Zustand）”**，导致组件失去独立复用能力、单测难以编写且引发大面积无意义重渲染。科学划分状态边界需要遵循 **状态就近原则（State Colocation）** 与 **五维状态分类法**。\n\n### 一、 前端五大状态类型与归属位置决策表\n\n| 状态类型 | 典型数据举例 | 推荐归属位置与工具 | 为什么不该放进全局客户端 Store？ |\n| :--- | :--- | :--- | :--- |\n| **1. UI 局部交互状态** | 弹窗开关 `isOpen`、下拉菜单展开、输入框临时草稿、当前悬停项 | 组件内部 `useState` / `ref`（或提升至最近公共父组件） | 仅单个组件或父子组件关心，放全局会导致弹窗关闭后状态忘记重置（脏状态残留） |\n| **2. URL 路由与筛选状态** | 搜索关键词 `?q=`、分页页码 `?page=2`、当前激活 Tab、排序字段 | **URL Search Params**（`useSearchParams` / `useRoute().query`） | 放内存 Store 会导致用户刷新页面或复制链接发给同事时筛选条件全部丢失！ |\n| **3. 服务端远程缓存状态** | 商品列表、文章详情、订单记录等来自后端 API 的异步数据 | **TanStack Query (React Query) / SWR / Nuxt `useFetch`** | 手动在 Redux/Pinia 里写 `loading/error/data` 样板代码繁琐，且缺乏缓存过期（TTL）、竞态取消、窗口聚焦自动刷新能力 |\n| **4. 派生/计算状态** | 购物车已选商品总价、过滤后的列表计数、表单是否可提交 | **`useMemo` / Vue `computed` / Store Selector** | **严禁将派生数据存为独立状态**！双源同步极易引发数据不一致 Bug |\n| **5. 真正的全局客户端状态** | 当前登录用户信息、亮暗主题色、多语言 Locale、跨页面购物车草稿、全局音乐播放器进度 | **Zustand / Pinia / Redux Toolkit** | 跨多个不相邻路由页面共享，且生命周期与整个应用会话一致 |\n\n### 二、 状态就近下沉（State Colocation）性能优化代码对比\n\n```jsx\n// ✗ 反例：将高频变化的局部输入框状态放在顶层或全局 Store，导致整棵页面树每敲一个键都重渲染\nfunction PageBad() {\n  const [ draft, setDraft ] = useGlobalStore((s) => [s.draft, s.setDraft])\n  return (\n    <div>\n      <input value={draft} onChange={(e) => setDraft(e.target.value)} />\n      <VerySlowChart /> {/* 无辜受累：每次敲键盘都跟着重渲染！ */}\n    </div>\n  )\n}\n\n// ✔ 正例：状态就近下沉（Colocation）到最小叶子组件，或把 URL 状态交给 SearchParams\nfunction SearchInputLeaf({ onSubmit }) {\n  const [draft, setDraft] = useState('')\n  return (\n    <form onSubmit={(e) => { e.preventDefault(); onSubmit(draft) }}>\n      <input value={draft} onChange={(e) => setDraft(e.target.value)} />\n    </form>\n  )\n}\n```"
  },
  {
    "id": "sm-002",
    "category": "state-management",
    "difficulty": "medium",
    "question": "服务端状态管理（TanStack Query / SWR）与客户端状态库（Zustand / Pinia）有何本质区别？staleTime 与 gcTime 如何协同？",
    "tags": [
      "TanStackQuery",
      "ReactQuery",
      "SWR",
      "服务端状态",
      "缓存失效"
    ],
    "answer": "在现代前端架构中，**服务端状态（Server State）** 与 **客户端状态（Client State）** 被明确拆分为两个正交维度：把客户端全局 Store 从繁重的异步 API 缓存管理中解放出来，交由 **TanStack Query（React Query / Vue Query）或 SWR** 处理，通常能直接砍掉项目中 70% 以上的全局 Store 代码。\n\n### 一、 服务端状态 vs 客户端状态的本质差异\n\n| 对比维度 | 客户端状态（Zustand / Pinia / Redux） | 服务端状态（TanStack Query / SWR） |\n| :--- | :--- | :--- |\n| **数据所有权（Ownership）** | 前端独占、同步可控，修改即刻生效且永远是最新的 | 存储在远端数据库，只是前端在某一时刻拿到的**异步快照**，随时可能被其他用户修改而过期（Stale） |\n| **核心痛点** | 跨组件通信、精确控制重渲染、持久化到 `localStorage` | **请求去重（Deduplication）**、缓存保鲜期（`staleTime`）、垃圾回收（`gcTime`）、失败指数退避重试、分页与无限滚动缓存合并 |\n\n### 二、 高频考点：`staleTime`（保鲜期）与 `gcTime`（原 `cacheTime`，垃圾回收时间）如何协同？\n\n很多候选人混淆这两个时间参数，它们实际控制着缓存生命周期的两个不同阶段：\n1. **`staleTime`（数据保鲜期，默认 `0ms`）**：决定数据从“新鲜（Fresh）”变为“陈旧（Stale）”的时间。只要数据处于 **Fresh** 状态，组件重新挂载、窗口重新聚焦或网络重连时，**100% 直接返回内存缓存，绝不发起任何网络请求**。\n2. **`gcTime`（非活跃缓存垃圾回收期，默认 `5 分钟`）**：当使用该 `queryKey` 的**所有组件都已卸载（Unmount，引用计数归零）**后，缓存数据在内存中保留多久才被彻底清除。在 `gcTime` 到期前若用户再次切回该页面，会先立即展示旧缓存数据（零白屏），同时若已超过 `staleTime` 则在后台静默发起重验证（Stale-While-Revalidate）。\n\n```tsx\nimport { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'\n\nexport function useProjectDetail(projectId: string) {\n  const queryClient = useQueryClient()\n\n  // 1. 查询并配置保鲜期与垃圾回收期\n  const query = useQuery({\n    queryKey: ['project', projectId], // 数组依赖键，projectId 变化自动切换缓存槽位\n    queryFn: ({ signal }) =>\n      fetch(`/api/projects/${projectId}`, { signal }).then((r) => r.json()),\n    staleTime: 60 * 1000,     // 1 分钟内视为绝对新鲜，切页面不重发请求\n    gcTime: 10 * 60 * 1000,   // 组件卸载后缓存保留 10 分钟，后退秒开\n  })\n\n  // 2. 修改数据后精准使关联缓存失效（Invalidation），自动触发后台重新拉取\n  const updateMutation = useMutation({\n    mutationFn: (patch: { name: string }) =>\n      fetch(`/api/projects/${projectId}`, { method: 'PATCH', body: JSON.stringify(patch) }),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['project', projectId] })\n    }\n  })\n\n  return { ...query, updateProject: updateMutation.mutate }\n}\n```"
  },
  {
    "id": "sm-003",
    "category": "state-management",
    "difficulty": "medium",
    "question": "细粒度信号（Signals）与虚拟 DOM 重渲染模型有何差异？为什么 Preact / Solid / Vue 都在拥抱 Signals 思想？",
    "tags": [
      "Signals",
      "细粒度响应式",
      "虚拟DOM",
      "SolidJS",
      "TC39提案"
    ],
    "answer": "**Signals（细粒度响应式信号，目前也已进入 TC39 JavaScript 语言标准提案 Stage 1）** 代表了与 React 传统“组件级全量重渲染 + Virtual DOM Diff”截然不同的更新哲学：它将更新粒度从**组件树（Component Tree）**下沉到了**单个数据值与单个 DOM 文本/属性节点（Fine-grained Reactivity）**。\n\n### 一、 虚拟 DOM 模型（Pull-based）vs Signals 模型（Push-Pull 细粒度）对比\n\n| 维度 | React 传统模型（Component Re-render + VDOM） | Signals 细粒度模型（Solid / Preact Signals / Vue Vapor） |\n| :--- | :--- | :--- |\n| **状态变更时的执行范围** | 重新执行当前组件函数及其下属所有未 `memo` 的子组件函数，生成新 VDOM 树再 Diff | **组件函数仅在挂载时执行 1 次**！状态更新时仅精准执行订阅了该 Signal 的那一行 DOM 更新闭包 |\n| **更新复杂度决定因素** | 与**组件树总节点规模**成正比（$O(\\text{Tree Size})$） | 仅与**实际绑定了该状态的动态节点个数**成正比（$O(\\text{Changed Bindings})$） |\n| **心智负担** | 需时刻注意闭包过期（Stale Closure）、依赖数组遗漏与 `useMemo` 引用稳定 | 自动运行时追踪依赖（Auto-tracking），无依赖数组，无闭包过期问题 |\n\n### 二、 手写 25 行极简 Signals 引擎（含 `signal`、`computed` 与 `effect`）\n\nSignals 的核心原理是维护一个全局调用栈 `activeEffect`：读取 `sig.value`（Getter）时自动把当前正在运行的 `effect` 加入订阅集合；修改 `sig.value = newVal`（Setter）时精确通知订阅集合重跑。\n\n```javascript\nlet activeObserver = null\n\nexport function createSignal(initialValue) {\n  let value = initialValue\n  const subscribers = new Set()\n\n  const read = () => {\n    // 1. 依赖收集（Track）：若当前处于 effect 或 computed 求值上下文中，自动登记订阅\n    if (activeObserver) subscribers.add(activeObserver)\n    return value\n  }\n\n  const write = (nextValue) => {\n    if (Object.is(value, nextValue)) return\n    value = nextValue\n    // 2. 派发更新（Trigger）：克隆一份快照遍历执行，避免重收集死循环\n    for (const sub of [...subscribers]) sub()\n  }\n\n  return [read, write]\n}\n\nexport function createEffect(fn) {\n  const execute = () => {\n    activeObserver = execute\n    try {\n      fn()\n    } finally {\n      activeObserver = null\n    }\n  }\n  execute()\n}\n\n// 验证：细粒度自动追踪\nconst [count, setCount] = createSignal(1)\ncreateEffect(() => {\n  console.log('仅在 count 变化时精准打印:', count())\n})\nsetCount(2) // 自动输出: 仅在 count 变化时精准打印: 2\n```"
  },
  {
    "id": "sm-004",
    "category": "state-management",
    "difficulty": "medium",
    "question": "原子化状态（Jotai / Recoil）与单一 Store（Zustand / Redux）如何选型？各自解决什么渲染痛点？",
    "tags": [
      "Jotai",
      "Zustand",
      "原子化状态",
      "架构选型",
      "React状态管理"
    ],
    "answer": "在 React 现代状态管理生态中，**Zustand（代表自顶向下的单一外部 Store 模型）** 与 **Jotai（代表自底向上的原子化 Atomic 模型）** 是最主流的两套轻量方案，它们分别契合不同的业务数据结构与更新频率特征。\n\n### 一、 单一 Store（Zustand）vs 原子化状态（Jotai）核心对比\n\n| 评估维度 | 单一 Store 模型（Zustand / Redux） | 原子化状态模型（Jotai / Recoil） |\n| :--- | :--- | :--- |\n| **状态组织方式** | **自顶向下（Top-Down）**：状态集中在一个外部大对象树中，组件通过 Selector 函数切片订阅 | **自底向上（Bottom-Up）**：状态被打散为无数独立的微小 `atom`，通过组合派生出复杂 `derivedAtom` |\n| **组件外访问能力** | **极强**：可在 Axios 拦截器、普通工具函数中直接调用 `useStore.getState()` 与 `setState()` | 较弱：Atom 状态默认驻留在 React `Provider` 组件树内（需额外持有 `store` 实例才能在组件外读写） |\n| **动态高频点状更新性能** | 若大画布上有 5,000 个独立图元，每次更新大对象再跑 5,000 次 Selector 函数存在遍历开销 | **极佳**：每个图元独立对应一个 `atomFamily(id)`，修改单个图元仅唤醒订阅该 Atom 的那 1 个组件，复杂度 $O(1)$ |\n| **代码分割（Code Splitting）** | 全局 Store 通常随主包一起加载 | Atom 定义可随异步路由组件天然按需加载与销毁 |\n\n### 二、 代码对照：同一派生业务在 Zustand 与 Jotai 中的实现差异\n\n```tsx\n// 1. Zustand：外部单一 Store + 显式 Selector 订阅（适合全局用户态、购物车、播放器）\nimport { create } from 'zustand'\n\nconst useCartStore = create((set) => ({\n  items: [{ price: 100, qty: 2 }],\n  taxRate: 0.1,\n  addItem: (item) => set((state) => ({ items: [...state.items, item] })),\n}))\n\n// 组件内必须显式写 Selector 精确选取所需字段，否则无关字段变化也会重渲染\nfunction CartTotalZustand() {\n  const total = useCartStore((s) =>\n    s.items.reduce((sum, it) => sum + it.price * it.qty, 0) * (1 + s.taxRate)\n  )\n  return <span>总计：{total}</span>\n}\n\n// 2. Jotai：自底向上原子组合（适合可视化低代码画布、复杂联动电子表格、节点编辑器）\nimport { atom, useAtomValue } from 'jotai'\n\nconst itemsAtom = atom([{ price: 100, qty: 2 }])\nconst taxRateAtom = atom(0.1)\n// 派生原子（Derived Atom）：自动追踪依赖的原子，只有依赖项变化时才重算！\nconst totalAtom = atom((get) => {\n  const items = get(itemsAtom)\n  const tax = get(taxRateAtom)\n  return items.reduce((sum, it) => sum + it.price * it.qty, 0) * (1 + tax)\n})\n\nfunction CartTotalJotai() {\n  const total = useAtomValue(totalAtom)\n  return <span>总计：{total}</span>\n}\n```"
  },
  {
    "id": "sm-005",
    "category": "state-management",
    "difficulty": "hard",
    "question": "如何用 30 行代码手写一个支持选择器（Selector）与细粒度重渲染控制的 Zustand 状态库？",
    "tags": [
      "手写Zustand",
      "useSyncExternalStore",
      "状态管理源码",
      "发布订阅",
      "性能优化"
    ],
    "answer": "Zustand 的源码极其精炼，其核心架构由两部分组成：**1. 与框架无关的 Vanilla 发布订阅状态容器（`createStore`）**；**2. 基于 React 18 原生 `useSyncExternalStore` 桥接并支持 `selector` 切片比对的 React Hook（`create`）**。\n\n### 一、 完整手写实现（含 Vanilla 核心 + React Hook 桥接 + 浅比较优化）\n\n```javascript\nimport { useSyncExternalStore } from 'react'\n\n// 第一层：与 React 完全解耦的纯 JS 发布订阅状态机（可在任意 JS/TS 工具函数中直接调用）\nexport function createStore(createState) {\n  let state\n  const listeners = new Set()\n\n  const getState = () => state\n\n  const setState = (partial, replace = false) => {\n    const nextState = typeof partial === 'function' ? partial(state) : partial\n    // 使用 Object.is 拦截相同引用更新\n    if (!Object.is(nextState, state)) {\n      const previousState = state\n      state = replace ? nextState : Object.assign({}, state, nextState)\n      // 通知所有订阅者并传入新旧状态\n      listeners.forEach((listener) => listener(state, previousState))\n    }\n  }\n\n  const subscribe = (listener) => {\n    listeners.add(listener)\n    return () => listeners.delete(listener) // 返回优雅退订函数\n  }\n\n  // 初始化状态：将 setState、getState 注入给用户的定义函数\n  state = createState(setState, getState)\n  return { getState, setState, subscribe }\n}\n\n// 第二层：桥接 React 并发渲染安全原语 useSyncExternalStore\nconst identity = (s) => s\n\nexport function create(createState) {\n  const api = createStore(createState)\n\n  const useBoundStore = (selector = identity) => {\n    return useSyncExternalStore(\n      api.subscribe,\n      () => selector(api.getState()), // 客户端读取切片快照（React 内部自动用 Object.is 比对切片返回值决定是否重渲染！）\n      () => selector(api.getState())  // SSR 服务端渲染读取初始快照\n    )\n  }\n\n  // 将 getState / setState / subscribe 静态方法直接挂载到 Hook 函数上，支持组件外调用\n  Object.assign(useBoundStore, api)\n  return useBoundStore\n}\n```\n\n### 二、 面试深挖：当 Selector 返回新对象时为什么会无限重渲染？如何用 `useShallow` 解决？\n\n在 React 18+ 中，`useSyncExternalStore` 会对 `getSnapshot`（即 `() => selector(api.getState())`）的返回值做严格的 `Object.is(prevSlice, nextSlice)` 比对。如果用户写成：\n`const { a, b } = useStore(s => ({ a: s.a, b: s.b }))`\n由于每次调用 `selector` 都返回一个**全新的对象字面量引用 `{}`**，`Object.is` 永远为 `false`，会立即触发 React 报错 `Maximum update depth exceeded`！\n\n```javascript\n// 手写 Zustand 必备伴侣：useShallow 浅比较包装器（当新旧对象第一层属性值未变时复用上一次的对象引用）\nimport { useRef } from 'react'\n\nexport function useShallow(selector) {\n  const prev = useRef()\n  return (state) => {\n    const next = selector(state)\n    if (prev.current && shallowEqual(prev.current, next)) {\n      return prev.current // 关键：属性浅相等时返回上一次缓存的旧引用，让 useSyncExternalStore 的 Object.is 通过！\n    }\n    prev.current = next\n    return next\n  }\n}\n```"
  },
  {
    "id": "sm-006",
    "category": "state-management",
    "difficulty": "hard",
    "question": "多标签页实时状态同步（BroadcastChannel）与乐观更新（Optimistic UI）回滚架构如何设计？",
    "tags": [
      "BroadcastChannel",
      "跨标签页同步",
      "乐观更新",
      "OptimisticUI",
      "状态回滚"
    ],
    "answer": "在现代复杂 Web 应用（如多标签页协作后台、即时通讯、电商购物车与点赞收藏）中，**多标签页实时状态同步**与**网络慢速环境下的乐观更新（Optimistic UI）及失败事务回滚**是高级状态架构的核心能力。\n\n### 一、 跨浏览器标签页状态同步方案对比與防环路设计\n\n| 同步通道 | 通信范围 | 消息体积与格式 | 核心机制与优缺点 |\n| :--- | :--- | :--- | :--- |\n| **`BroadcastChannel` API** | 同源所有 Window / Tab / Worker | 支持结构化克隆对象（无需手动 JSON 序列化） | **首选方案**：语义清晰、延迟亚毫秒级；需注意附带 `tabId` 或版本号防止收到自己广播的消息造成死循环 |\n| **`storage` 事件** | 同源其他 Tab（**当前触发写入的 Tab 自己不触发**） | 仅限字符串（受制于 `localStorage` 5MB 上限） | 兼容性好，同时完成持久化与通知；但同步读写大 JSON 会阻塞主线程 |\n| **`SharedWorker`** | 同源所有 Tab 共享同一个后台线程 | 结构化克隆 | 适合多标签页共享同一条 WebSocket 长连接或统一维护内存状态主本 |\n\n```javascript\n// 1. 生产级 Zustand / Pinia 跨标签页状态同步中间件（带防回环锁 isApplyingRemote）\nexport function createCrossTabSync(channelName, store) {\n  if (typeof BroadcastChannel === 'undefined') return\n  const channel = new BroadcastChannel(channelName)\n  let isApplyingRemote = false\n\n  // 监听当前 Tab 状态变化并广播给其他同源 Tab\n  store.subscribe((state) => {\n    if (isApplyingRemote) return // 关键防线：由远端广播触发的本地更新绝不再次二次广播，杜绝乒乓死循环！\n    channel.postMessage({ type: 'SYNC_STATE', payload: state, ts: Date.now() })\n  })\n\n  // 接收其他 Tab 广播的状态并合并入本地 Store\n  channel.onmessage = (event) => {\n    if (event.data?.type === 'SYNC_STATE') {\n      isApplyingRemote = true\n      try {\n        store.setState(event.data.payload)\n      } finally {\n        isApplyingRemote = false\n      }\n    }\n  }\n}\n```\n\n### 二、 乐观更新（Optimistic Update）与并发竞态回滚架构\n\n乐观更新要求在用户点击“点赞/收藏/排序”的 **0ms 瞬间直接修改 UI 状态**，不等后端返回；一旦后端接口报错，则必须精准回滚到乐观更新前的快照，且需防止并发多次点击时旧请求覆盖新状态：\n\n```javascript\n// 2. 带快照栈与事务 ID 的安全乐观更新控制器\nexport async function executeOptimisticMutation({ store, optimisticPatch, apiCall }) {\n  // 记录修改前的不可变状态快照\n  const snapshot = structuredClone(store.getState())\n  // 立即应用乐观更新，用户侧 0ms 感知响应\n  store.setState(optimisticPatch)\n\n  try {\n    const serverConfirmed = await apiCall()\n    // 以服务端最终确权数据为准对齐状态\n    store.setState(serverConfirmed)\n  } catch (error) {\n    // 接口失败：原子回滚至修改前快照并弹出错误提示\n    store.setState(snapshot, true)\n    throw error\n  }\n}\n```"
  }
]
