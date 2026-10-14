// React 进阶面试题（12 题）
export const reactQuestions = [
  {
    id: 'react-001',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['useReducer', '状态管理', 'Context'],
    question: 'useReducer 是什么？和 useState 怎么选？如何配合 Context 做全局状态？',
    answer: `\`useReducer\` 用 \`(state, action) => newState\` 的 reducer 管理复杂状态，适合**多子状态、状态转移逻辑复杂**的场景（比一堆 useState 更清晰）。

\`\`\`js
const [state, dispatch] = useReducer(reducer, initialState)
dispatch({ type: 'increment' })
\`\`\`

**和 useState 选型**：简单值用 \`useState\`；状态间有依赖/多种操作/需要可预测更新时用 \`useReducer\`。

**配合 Context 做全局状态**（轻量替代 Redux）：

\`\`\`js
const Ctx = createContext()
<Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
// 子组件 const { dispatch } = useContext(Ctx)
\`\`\`

> 注意：Context value 变化会让所有消费组件重渲染，宜拆细或用 \`useMemo\` 包裹 value。`
  },
  {
    id: 'react-002',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['并发', 'useTransition', 'useDeferredValue'],
    question: 'React 18 的并发特性：useTransition 和 useDeferredValue 解决什么问题？',
    answer: `两者都是**让低优先级更新不阻塞 UI 响应**（并发渲染的一部分）：

- **useTransition**：把"非紧急"更新标记为 transition，期间紧急更新（如输入）优先渲染，紧急更新完成后再提交过渡更新
- **useDeferredValue**：返回一个"延迟版"的值，React 会在有更高优先级任务时推迟它的重渲染

\`\`\`js
const [isPending, startTransition] = useTransition()
const [deferred] = useDeferredValue(value)
// 输入时保持响应，列表用 deferred 值渲染（可能滞后一帧）
\`\`\`

**场景**：大列表筛选、Tab 切换、搜索联想——避免"输入卡顿、整个页面冻结"。`
  },
  {
    id: 'react-003',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['错误边界', 'error boundary', '容错'],
    question: 'React 错误边界（Error Boundary）是什么？函数组件能做错误边界吗？',
    answer: `错误边界是**捕获子组件渲染/生命周期抛出的错误、避免整棵应用崩溃**的类组件，通过两个静态方法实现：

\`\`\`js
class ErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError(err) { return { hasError: true } }
  componentDidCatch(err, info) { logError(err, info) }
  render() {
    return this.state.hasError ? <Fallback /> : this.props.children
  }
}
\`\`\`

**关键点**：

- **只能捕获渲染期错误**，捕获不到事件回调、异步（\`setTimeout\`/Promise）、SSR 中的错误
- **函数组件本身不能做错误边界**（React 规定必须是类组件）；但可以用社区库（如 \`react-error-boundary\`）的 Hook 简易封装
- 错误边界本身崩溃了就无能为力，所以建议分层包裹`
  },
  {
    id: 'react-004',
    category: 'react',
    module: 'framework',
    difficulty: 'easy',
    tags: ['useId', 'SSR', '唯一ID'],
    question: 'React 的 useId 有什么用？为什么不能用 Math.random / Date 生成 id？',
    answer: '`useId` 生成**跨服务端/客户端一致的唯一 ID**，专为 SSR/SSG 设计。\n\n**为什么不能用 random/Date**：\n- 服务端渲染时生成的 id 与客户端 hydration 时对不上 → 水合不匹配（hydration mismatch）警告\n- 每次渲染都不稳定，导致无障碍属性（\`htmlFor\` / \`aria-*\`）关联错乱\n\n```js\nconst id = useId()  // 如 ":r0:"\n<label htmlFor={id} /><input id={id} />\n```\n\n> 在列表里需要多个 id 时，用 \`const base = useId(); const ids = items.map((_, i) => base + \'-\' + i)\`。'
  },
  {
    id: 'react-005',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['自定义 Hook', '复用', '模式'],
    question: '如何写一个自定义 Hook？有哪些最佳实践？',
    answer: '自定义 Hook 是以 \`use\` 开头的函数，内部可调用其他 Hook，用于**抽取组件间可复用的状态逻辑**（而非 UI）。\n\n```js\nfunction useLocalStorage(key, initial) {\n  const [val, setVal] = useState(() => localStorage.getItem(key) ?? initial)\n  useEffect(() => localStorage.setItem(key, val), [key, val])\n  return [val, setVal]\n}\n```\n\n**最佳实践**：\n1. 命名必须以 \`use\` 开头（让 React 的 Hooks 规则检查器能识别）\n2. 只调用其他 Hook，不直接返回 JSX\n3. 返回数组（可解构命名）或对象（避免顺序耦合）\n4. 把「状态值 + 操作函数」一起返回，像 \`[value, setValue]\`\n\n> 区别于普通函数：Hook 可以"挂"在组件生命周期上（用 useState/useEffect）。'
  },
  {
    id: 'react-006',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['forwardRef', 'useImperativeHandle', 'ref'],
    question: 'forwardRef 和 useImperativeHandle 有什么用？',
    answer: '默认函数组件**不能接收 ref**（React 把 ref 当特殊属性）。\n\n- **forwardRef**：让函数组件能接收父组件传来的 ref，转发到内部某个 DOM/组件\n- **useImperativeHandle**：限制父组件通过 ref 能访问到的「实例 API」（只暴露想暴露的方法/属性）\n\n```js\nconst Input = forwardRef((props, ref) => {\n  const inner = useRef()\n  useImperativeHandle(ref, () => ({\n    focus: () => inner.current.focus(),\n    clear: () => (inner.current.value = \'\')\n  }))\n  return <input ref={inner} />\n})\n```\n\n> 父组件 \`<Input ref={r} />\` 只能调用 \`r.current.focus()/clear()\`，拿不到原始 DOM 的全部能力。React 19 引入 \`ref\` 作为普通 prop，forwardRef 将逐渐被取代。'
  },
  {
    id: 'react-007',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['性能', 'memo', 'useMemo', '陷阱'],
    question: 'React.memo / useMemo / useCallback 的性能优化有哪些常见误区？',
    answer: '**它们不是银弹，用错反而更慢**（记忆化本身有成本）：\n\n- **React.memo**：对 props 做浅比较，props 不变则跳过重渲染。但**每次父渲染都新建函数/对象传给子组件** → 浅比较永远不等 → memo 失效\n- **useCallback**：缓存函数引用，需配合 memo 使用才有意义；无依赖数组变化时才返回同一函数\n- **useMemo**：缓存计算结果，适合**昂贵计算**或作为 memo 子组件的 props\n\n**误区**：\n1. 给所有组件包 memo —— 多数组件重渲染成本极低，反而增加比对开销\n2. 在 useMemo 里返回新对象/数组却没缓存依赖 → 依旧每次新建\n3. 忘记用 useCallback 包裹传给 memo 子组件的函数\n\n> 优化前先用 React DevTools Profiler 定位真正昂贵的重渲染。'
  },
  {
    id: 'react-008',
    category: 'react',
    module: 'framework',
    difficulty: 'hard',
    tags: ['Fiber', 'reconciliation', '调度'],
    question: 'React 的 Fiber 架构与 reconciliation（协调）过程是怎样的？',
    answer: '**Fiber** 是 React 16 引入的**虚拟栈帧**，把渲染任务拆成可中断/恢复的小单元。\n\n**reconciliation 两阶段**：\n1. **render 阶段**（可中断）：从根开始，对比新旧 Virtual DOM，生成 Fiber 树上的「副作用标记」（增/删/改），这个过程叫 diff。采用**同层比较**，用 \`key\` 识别元素身份，列表无 key 会退化为逐位对比（性能差）\n2. **commit 阶段**（不可中断）：把标记好的副作用一次性同步到真实 DOM，触发 \`useLayoutEffect\` / \`useEffect\`\n\n**Fiber 的价值**：render 阶段可被高优先级任务（如用户输入）打断并恢复，避免长任务卡住主线程（这是并发渲染的基础）。'
  },
  {
    id: 'react-009',
    category: 'react',
    module: 'framework',
    difficulty: 'hard',
    tags: ['合成事件', '事件委托', '机制'],
    question: 'React 的合成事件（SyntheticEvent）是什么？和原生事件有什么区别？',
    answer: 'React 在**根节点（React 17 起为容器根，17 前为 document）**上统一委托监听原生事件，再**派发到自己模拟的事件系统**，所有 \`onClick\` 等拿到的是跨浏览器统一的 \`SyntheticEvent\`。\n\n**区别/注意点**：\n- **统一接口**：自动做了浏览器兼容（如 \`e.target\`、\`e.preventDefault\` 行为一致）\n- **池化（旧版本）**：React 17 前事件对象会被复用，异步中访问需 \`e.persist()\`；17+ 已废弃池化\n- **不能混用阻止冒泡逻辑**：在子组件 \`stopPropagation\` 阻止的是 React 合成事件冒泡，不影响原生；若同时绑了原生 \`addEventListener\`，注意两者触发顺序（原生在根，合成也在捕获/冒泡阶段由根派发）\n- **事件名用驼峰**：\`onClick\` 而非 \`onclick\`'
  },
  {
    id: 'react-010',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['startTransition', '并发渲染', '优先级'],
    question: 'React 18 的并发渲染（Concurrent Rendering）是什么？startTransition 如何使用？',
    answer: '并发渲染让 React 可以**同时维护多个版本的 UI**，根据优先级调度，保证用户输入等紧急更新优先响应。\n\n**startTransition** 把某个更新标记为「可中断的低优先级更新」：\n\n```js\nconst [isPending, startTransition] = useTransition()\nfunction handleChange(e) {\n  setValue(e.target.value)              // 紧急：立即更新输入框\n  startTransition(() => {                // 非紧急：可被中断\n    setSearchResults(compute(e.target.value))\n  })\n}\n```\n\n**要点**：\n- transition 更新过程中 React 可暂停、复用、丢弃旧渲染结果\n- 与 \`useDeferredValue\` 互补：一个控制「动作包裹」，一个控制「值延迟」\n- 这是 React 从「同步不可中断」到「可中断调度」的范式升级'
  },
  {
    id: 'react-011',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['复用模式', 'HOC', 'render props', 'Hook'],
    question: 'HOC、Render Props、自定义 Hook 三种复用模式怎么选？',
    answer: '三者都解决「逻辑复用」，各有取舍：\n\n| 模式 | 优点 | 缺点 |\n| --- | --- | --- |\n| **HOC** | 包裹清晰、可组合 | 嵌套地狱、props 来源不明、命名冲突 |\n| **Render Props** | 灵活、状态可见 | JSX 嵌套深、回调难复用 |\n| **自定义 Hook** | 最简洁、无额外组件树、可传参 | 仅状态逻辑，UI 要自己写 |\n\n**结论**：\n- 纯状态/行为逻辑 → **自定义 Hook（首选）**\n- 需要把"渲染控制权"交给使用方 → Render Props\n- 需要给组件加横向能力（如 \`withRouter\`）且无法改源码 → HOC（渐被 Hook 取代）\n\n> 现代 React 项目基本用 Hook 替代 HOC/Render Props。'
  },
  {
    id: 'react-012',
    category: 'react',
    module: 'framework',
    difficulty: 'hard',
    tags: ['useSyncExternalStore', '外部存储', '订阅'],
    question: 'useSyncExternalStore 是什么？为什么 Redux/Zustand 等外部状态库需要它？',
    answer: '`useSyncExternalStore` 是 React 18 官方提供的 Hook，让组件**安全订阅外部可变数据源**（如 Redux store、浏览器 API、第三方状态库），并在数据变化时正确重渲染，且**兼容并发渲染**。\n\n```js\nconst snapshot = useSyncExternalStore(\n  subscribe,          // (cb) => unsubscribe，数据源变化通知 React\n  () => store.getState(),  // 返回当前快照（必须稳定引用，否则死循环）\n  () => serverState   // SSR 用的服务端快照\n)\n```\n\n**为什么需要**：\n1. 自己用 \`useState + useEffect\` 订阅外部 store 在并发下会出现「撕裂（tearing）」——同一时刻 UI 不同部分显示不同数据\n2. 它保证**读取的快照与渲染一致**，并触发正确的重渲染\n3. Redux 的 \`useSelector\`、Zustand 的 \`useStore\` 底层都基于它'
  }
]
