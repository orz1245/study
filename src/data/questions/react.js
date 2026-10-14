export const reactQuestions = [
  {
    "id": "fw-001",
    "category": "react",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "React",
      "JSX",
      "虚拟DOM"
    ],
    "question": "React 的虚拟 DOM 是什么？它解决了什么问题？",
    "answer": "**虚拟 DOM** 是一个 JavaScript 对象树，是真实 DOM 的轻量级副本。\n\n### 工作流程\n\n```text\n状态变化 → 生成新虚拟DOM → 与旧虚拟DOM对比（Diff） → 最小化更新真实DOM\n```\n\n### 为什么需要虚拟 DOM\n\n1. **减少直接 DOM 操作**：DOM 操作昂贵（涉及重排重绘），虚拟 DOM 在内存中操作 JS 对象更快\n2. **批量更新**：状态变化先在虚拟 DOM 中合并，最后一次性更新真实 DOM\n3. **跨平台**：虚拟 DOM 是 JS 对象，可以渲染到不同平台（浏览器、Native、SSR）\n\n### 简化实现\n\n```jsx\n// 虚拟 DOM 节点\nconst vdom = {\n  type: 'div',\n  props: { className: 'container' },\n  children: [\n    { type: 'h1', props: {}, children: 'Hello' },\n    { type: 'p', props: {}, children: 'World' }\n  ]\n}\n\n// 渲染为真实 DOM\nfunction render(vdom) {\n  if (typeof vdom === 'string') return document.createTextNode(vdom)\n  const el = document.createElement(vdom.type)\n  Object.entries(vdom.props).forEach(([k, v]) => el.setAttribute(k, v))\n  vdom.children.forEach(child => el.appendChild(render(child)))\n  return el\n}\n```\n\n### Diff 算法\n\nReact 的 Diff 算法有三个假设：\n1. **不同类型的元素产生不同的树**（div → span 会销毁重建）\n2. **通过 key 标识同一层级的子元素**\n3. **只比较同一层级**（不跨层级比较）\n\n### 虚拟 DOM 的代价\n- 首次渲染需要构建虚拟 DOM 树，有额外开销\n- 不是所有场景都比直接 DOM 操作快（简单更新场景不如原生）\n- Svelte 等框架编译时优化，跳过虚拟 DOM\n\n### 面试要点\n- 虚拟 DOM 不是为了\"比直接操作 DOM 快\"，而是为了**声明式编程**和**跨平台**\n- 性能优势来自于**批量更新**和**最小化 DOM 操作**"
  },
  {
    "id": "fw-002",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "Hooks",
      "useState"
    ],
    "question": "React Hooks 有哪些常用的？各自的作用是什么？",
    "answer": "### 常用 Hooks\n\n**1. useState — 状态管理**\n```jsx\nconst [count, setCount] = useState(0)\n// 函数式更新（推荐）\nsetCount(prev => prev + 1)\n```\n\n**2. useEffect — 副作用**\n```jsx\n// 挂载时执行\nuseEffect(() => { fetchData() }, [])\n\n// 依赖变化时执行\nuseEffect(() => { subscribe(id) }, [id])\n\n// 清理副作用\nuseEffect(() => {\n  const timer = setInterval(tick, 1000)\n  return () => clearInterval(timer) // 卸载时执行\n}, [])\n```\n\n**3. useRef — 引用（不触发重渲染）**\n```jsx\nconst inputRef = useRef(null)\ninputRef.current.focus()\n```\n\n**4. useMemo — 缓存计算结果**\n```jsx\nconst sorted = useMemo(() => expensiveSort(data), [data])\n```\n\n**5. useCallback — 缓存函数引用**\n```jsx\nconst handleClick = useCallback(() => doSomething(id), [id])\n```\n\n**6. useContext — 跨组件共享状态**\n```jsx\nconst theme = useContext(ThemeContext)\n```\n\n**7. useReducer — 复杂状态管理**\n```jsx\nconst [state, dispatch] = useReducer(reducer, initialState)\n```\n\n### 其他 Hooks\n\n| Hook | 作用 |\n|------|------|\n| `useLayoutEffect` | 同步执行副作用（DOM 更新后，浏览器绘制前）|\n| `useImperativeHandle` | 自定义 ref 暴露给父组件的实例值 |\n| `useId` | 生成唯一 ID |\n| `useDeferredValue` | 延迟更新（React 18）|\n| `useTransition` | 标记非紧急更新（React 18）|\n\n### Hooks 规则\n1. **只在顶层调用**，不能在循环/条件/嵌套函数中调用\n2. **只在 React 函数组件或自定义 Hook 中调用**\n\n### 为什么有这些规则\nHooks 依赖调用顺序的索引来对应内部状态。如果在条件语句中调用，顺序可能变化，导致状态错乱。"
  },
  {
    "id": "fw-003",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "useEffect",
      "副作用"
    ],
    "question": "useEffect 和 useLayoutEffect 的区别？",
    "answer": "### 执行时机\n\n| Hook | 执行时机 | 阻塞渲染 | 适合场景 |\n|------|----------|----------|----------|\n| `useEffect` | DOM 更新后**异步**执行 | ❌ | 数据请求、订阅、日志 |\n| `useLayoutEffect` | DOM 更新后**同步**执行（绘制前） | ✅ | 读取/修改 DOM 布局 |\n\n### 执行流程\n\n```text\n状态变化 → React 渲染 → DOM 更新\n  → useLayoutEffect 同步执行 ← 此时浏览器还未绘制\n  → 浏览器绘制到屏幕\n  → useEffect 异步执行 ← 此时用户已看到画面\n```\n\n### useLayoutEffect 使用场景\n\n**需要读取 DOM 布局并同步修改时使用**，避免闪烁：\n\n```jsx\nfunction Tooltip({ children }) {\n  const ref = useRef()\n  const [position, setPosition] = useState({ x: 0, y: 0 })\n\n  useLayoutEffect(() => {\n    // 读取 DOM 位置\n    const rect = ref.current.getBoundingClientRect()\n    // 同步更新位置，避免闪烁\n    setPosition({\n      x: rect.x + rect.width,\n      y: rect.y\n    })\n  }, [children])\n\n  return (\n    <div ref={ref} style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>\n      {children}\n    </div>\n  )\n}\n```\n\n### 如果用 useEffect 会怎样\n\n```jsx\n// ❌ 用户会先看到 tooltip 在错误位置，然后跳到正确位置（闪烁）\nuseEffect(() => {\n  const rect = ref.current.getBoundingClientRect()\n  setPosition({ x: rect.x + rect.width, y: rect.y })\n}, [children])\n```\n\n### useEffect 常见用法\n\n```jsx\n// 数据请求（异步，不阻塞渲染）\nuseEffect(() => {\n  fetch('/api/data')\n    .then(res => res.json())\n    .then(data => setData(data))\n}, [])\n\n// 事件监听\nuseEffect(() => {\n  window.addEventListener('resize', handleResize)\n  return () => window.removeEventListener('resize', handleResize)\n}, [])\n\n// 依赖变化重新执行\nuseEffect(() => {\n  if (userId) fetchUser(userId)\n}, [userId])\n```\n\n### SSR 注意\n`useLayoutEffect` 在 SSR 中会报警告（服务端没有 DOM），可用 `useIsomorphicLayoutEffect` 兼容：\n\n```jsx\nconst useIsomorphicLayoutEffect = \n  typeof window !== 'undefined' ? useLayoutEffect : useEffect\n```"
  },
  {
    "id": "fw-004",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "依赖数组",
      "useEffect"
    ],
    "question": "useEffect 的依赖数组为空、有值、不传分别是什么效果？",
    "answer": "### 三种情况\n\n```jsx\n// 1. 不传依赖数组 → 每次渲染后都执行\nuseEffect(() => {\n  console.log('每次渲染都执行')\n})\n\n// 2. 空数组 [] → 只在挂载后执行一次\nuseEffect(() => {\n  console.log('只在挂载后执行一次')\n}, [])\n\n// 3. 有依赖值 [a, b] → 依赖变化时执行\nuseEffect(() => {\n  console.log('a 或 b 变化时执行')\n}, [a, b])\n```\n\n### 详细对比\n\n| 依赖数组 | 执行时机 | 清理函数执行时机 |\n|----------|----------|-----------------|\n| 不传 | 每次渲染后 | 下次 effect 执行前 + 卸载时 |\n| `[]` | 挂载后一次 | 卸载时 |\n| `[dep]` | 挂载后 + dep 变化时 | 下次 effect 执行前 + 卸载时 |\n\n### 常见陷阱\n\n**1. 闭包陷阱（Stale Closure）**\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0)\n\n  useEffect(() => {\n    const timer = setInterval(() => {\n      console.log(count) // ❌ 永远是 0（闭包捕获了初始值）\n      setCount(count + 1) // ❌ 每次都设置成 1\n    }, 1000)\n    return () => clearInterval(timer)\n  }, []) // count 不在依赖中\n\n  // ✅ 解决方案 1：函数式更新\n  useEffect(() => {\n    const timer = setInterval(() => {\n      setCount(c => c + 1) // 使用函数式更新\n    }, 1000)\n    return () => clearInterval(timer)\n  }, [])\n\n  // ✅ 解决方案 2：添加依赖\n  useEffect(() => {\n    const timer = setInterval(() => {\n      setCount(count + 1)\n    }, 1000)\n    return () => clearInterval(timer)\n  }, [count]) // 每次都清除并重建定时器\n}\n```\n\n**2. 对象/数组依赖**\n```jsx\n// ❌ 每次渲染都是新对象，effect 每次都执行\nuseEffect(() => { /* ... */ }, [{ a: 1 }])\n\n// ✅ 使用原始值\nuseEffect(() => { /* ... */ }, [obj.a])\n\n// ✅ 或用 useMemo\nconst dep = useMemo(() => ({ a: 1 }), [a])\nuseEffect(() => { /* ... */ }, [dep])\n```\n\n**3. 函数依赖**\n```jsx\n// ❌ 每次渲染都是新函数\nuseEffect(() => { handleClick() }, [handleClick])\n\n// ✅ 用 useCallback 包裹\nconst handleClick = useCallback(() => { /* ... */ }, [dep])\nuseEffect(() => { handleClick() }, [handleClick])\n```\n\n### ESLint 规则\n`react-hooks/exhaustive-deps` 会自动检测缺失的依赖，建议开启。"
  },
  {
    "id": "fw-005",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "useMemo",
      "useCallback",
      "性能"
    ],
    "question": "useMemo 和 useCallback 的区别？什么时候该用？",
    "answer": "### 区别\n\n- `useMemo` 缓存**计算结果**（值）\n- `useCallback` 缓存**函数引用**\n\n```jsx\n// useMemo：缓存值\nconst sortedData = useMemo(() => {\n  return data.sort((a, b) => a - b)\n}, [data])\n\n// useCallback：缓存函数\nconst handleClick = useCallback(() => {\n  console.log(id)\n}, [id])\n\n// useCallback 本质是 useMemo 的语法糖\nconst handleClick = useMemo(() => () => {\n  console.log(id)\n}, [id])\n```\n\n### 什么时候用\n\n**useMemo 适用场景：**\n\n1. **昂贵的计算**\n```jsx\nconst result = useMemo(() => {\n  return heavyComputation(data) // 计算耗时 > 1ms\n}, [data])\n```\n\n2. **稳定引用对象**（作为其他 Hook 的依赖或子组件的 prop）\n```jsx\nconst config = useMemo(() => ({ endpoint: '/api', timeout: 5000 }), [])\n```\n\n**useCallback 适用场景：**\n\n1. **传递给被 React.memo 包裹的子组件**\n```jsx\nconst Child = React.memo(({ onClick }) => {\n  console.log('Child render')\n  return <button onClick={onClick}>Click</button>\n})\n\nfunction Parent() {\n  const [count, setCount] = useState(0)\n  // ✅ 使用 useCallback，count 变化时 Child 不会重新渲染\n  const handleClick = useCallback(() => {\n    console.log('clicked')\n  }, [])\n  return <Child onClick={handleClick} />\n}\n```\n\n2. **作为 useEffect 的依赖**\n```jsx\nconst fetchData = useCallback(() => {\n  api.get(id)\n}, [id])\n\nuseEffect(() => {\n  fetchData()\n}, [fetchData])\n```\n\n### 什么时候不用\n\n```jsx\n// ❌ 简单计算不需要 useMemo\nconst doubled = useMemo(() => count * 2, [count])\n// 直接写就行\nconst doubled = count * 2\n\n// ❌ 不传递给子组件的函数不需要 useCallback\nconst handleLocalClick = useCallback(() => { ... }, [])\n// 直接定义即可\nconst handleLocalClick = () => { ... }\n```\n\n### 性能权衡\n- useMemo/useCallback 本身有**内存开销**和**依赖比较开销**\n- 对于简单计算和不被引用的函数，使用它们反而更慢\n- **不要过度优化**：只在真正需要时使用\n\n### React 19 变化\nReact 19 编译器（React Compiler）可以自动优化 memo，未来可能不需要手动使用 useMemo/useCallback。"
  },
  {
    "id": "fw-006",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "useRef",
      "引用"
    ],
    "question": "useRef 和 useState 的区别？useRef 有哪些使用场景？",
    "answer": "### 核心区别\n\n| 特性 | useState | useRef |\n|------|----------|--------|\n| 修改是否触发重渲染 | ✅ | ❌ |\n| 值的持久化 | ✅ | ✅ |\n| 读取方式 | 通过 state 变量 | `.current` 属性 |\n| 适用场景 | 需要渲染的数据 | 不需要渲染的数据 |\n\n```jsx\n// useState：修改触发重渲染\nconst [count, setCount] = useState(0)\nsetCount(1) // 触发重渲染\n\n// useRef：修改不触发重渲染\nconst timerRef = useRef(null)\ntimerRef.current = setInterval(...) // 不触发重渲染\n```\n\n### useRef 使用场景\n\n**1. 访问 DOM 元素**\n```jsx\nfunction Input() {\n  const inputRef = useRef(null)\n\n  useEffect(() => {\n    inputRef.current.focus()\n  }, [])\n\n  return <input ref={inputRef} />\n}\n```\n\n**2. 存储定时器/订阅的 ID**\n```jsx\nfunction Timer() {\n  const timerRef = useRef(null)\n  const [seconds, setSeconds] = useState(0)\n\n  useEffect(() => {\n    timerRef.current = setInterval(() => {\n      setSeconds(s => s + 1)\n    }, 1000)\n    return () => clearInterval(timerRef.current)\n  }, [])\n\n  const stop = () => clearInterval(timerRef.current)\n\n  return <div>{seconds} <button onClick={stop}>Stop</button></div>\n}\n```\n\n**3. 保存最新值（避免闭包陷阱）**\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0)\n  const countRef = useRef(count)\n\n  // 保持 ref 始终是最新的\n  useEffect(() => {\n    countRef.current = count\n  }, [count])\n\n  useEffect(() => {\n    const timer = setInterval(() => {\n      // 读取最新值，不会有闭包问题\n      console.log(countRef.current)\n    }, 1000)\n    return () => clearInterval(timer)\n  }, [])\n\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>\n}\n```\n\n**4. 标记组件是否首次渲染**\n```jsx\nfunction Component() {\n  const isFirstRender = useRef(true)\n\n  useEffect(() => {\n    if (isFirstRender.current) {\n      isFirstRender.current = false\n      return // 首次渲染不执行\n    }\n    // 后续依赖变化时执行\n    doSomething()\n  }, [dep])\n}\n```\n\n**5. 保存可变值且不触发渲染**\n```jsx\nfunction Map() {\n  const mapInstanceRef = useRef(null)\n\n  useEffect(() => {\n    mapInstanceRef.current = new MapSDK(container)\n  }, [])\n\n  const zoomIn = () => {\n    mapInstanceRef.current.zoomIn()\n  }\n}\n```\n\n### 注意事项\n- 不要在渲染期间读写 ref.current（除了初始化），应在事件处理函数或 effect 中操作\n- ref.current 的修改不会触发重渲染，所以渲染依赖的数据不能用 ref 存储"
  },
  {
    "id": "fw-007",
    "category": "react",
    "module": "framework",
    "difficulty": "hard",
    "tags": [
      "React",
      "Fiber",
      "调度",
      "并发"
    ],
    "question": "React Fiber 架构是什么？它解决了什么问题？",
    "answer": "### React 15 的问题\n\nReact 15 使用**递归**方式更新组件树（Stack Reconciler），一旦开始就无法中断，如果组件树很深，长任务会阻塞主线程，导致掉帧。\n\n### Fiber 是什么\n\n**Fiber** 是 React 16 引入的新架构，将组件树更新工作拆分为**可中断、可恢复的小任务**（Fiber 节点）。\n\n### Fiber 节点\n\n每个组件对应一个 Fiber 节点，包含：\n\n```javascript\n{\n  type: 'div',              // 组件类型\n  key: null,\n  child: Fiber | null,      // 第一个子节点\n  sibling: Fiber | null,    // 下一个兄弟节点\n  return: Fiber | null,     // 父节点\n  pendingProps: {},         // 待处理的 props\n  memoizedProps: {},        // 上次使用的 props\n  memoizedState: {},        // 上次的 state\n  updateQueue: {},          // 更新队列\n  flags: 0,                 // 副作用标记（插入/更新/删除）\n  alternate: Fiber | null,  // 指向上一次的 Fiber（双缓冲）\n}\n```\n\n### 工作流程\n\n```text\n1. Render Phase（可中断）\n   - 遍历 Fiber 树\n   - 计算变更（Diff）\n   - 标记副作用（flags）\n   - 使用 requestIdleCallback / MessageChannel 分片执行\n\n2. Commit Phase（不可中断）\n   - 将变更应用到 DOM\n   - 执行生命周期/useEffect\n```\n\n### 链表结构\n\nFiber 树采用**链表**结构（child + sibling + return），而非树形递归，可以随时暂停和恢复：\n\n```text\n      App\n     / \n   div\n  / h1   ul\n    / |   li  li  li\n```\n\n遍历顺序：App → div → h1 → (回到 div) → ul → li → li → li\n\n### 时间分片（Time Slicing）\n\n```javascript\n// 简化的调度逻辑\nfunction workLoop(deadline) {\n  let shouldYield = false\n  while (nextFiber && !shouldYield) {\n    nextFiber = performUnitOfWork(nextFiber)\n    shouldYield = deadline.timeRemaining() < 1\n  }\n  if (nextFiber) {\n    requestIdleCallback(workLoop)\n  }\n}\nrequestIdleCallback(workLoop)\n```\n\n### React 18 并发特性\n\n基于 Fiber 架构，React 18 引入：\n- **useTransition**：标记非紧急更新，可被中断\n- **useDeferredValue**：延迟更新值\n- **Suspense**：异步组件加载\n- **自动批处理**：多个状态更新合并\n\n### 关键意义\n- **可中断渲染**：高优先级任务（用户输入）可以打断低优先级渲染\n- **渐进式渲染**：将大任务拆分到多个帧中执行\n- **并发更新**：同一时间可以准备多个版本的 UI"
  },
  {
    "id": "fw-008",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "setState",
      "批量更新"
    ],
    "question": "React 中 setState 是同步还是异步的？",
    "answer": "### 结论\n\n- **React 17 及之前**：在 React 管理的事件处理函数中是\"异步\"的，在 setTimeout/原生事件中是同步的\n- **React 18+**：所有更新都是\"异步\"的（自动批处理）\n\n### React 17 行为\n\n```jsx\n// React 17\nfunction handleClick() {\n  console.log(count)      // 0\n  setCount(count + 1)\n  console.log(count)      // 0（异步，未立即更新）\n\n  setTimeout(() => {\n    setCount(count + 1)\n    console.log(count)    // 1（同步，在 setTimeout 中）\n  }, 0)\n}\n```\n\n### React 18 自动批处理\n\n```jsx\n// React 18\nfunction handleClick() {\n  setCount(c => c + 1)    // 不会立即重渲染\n  setCount(c => c + 1)    // 合并\n  setName('Tom')           // 合并\n  // 一次重渲染，count = 2, name = 'Tom'\n}\n\n// setTimeout 中也批处理\nsetTimeout(() => {\n  setCount(c => c + 1)\n  setName('Tom')\n  // 一次重渲染\n}, 0)\n\n// Promise 中也批处理\nfetch().then(() => {\n  setCount(c => c + 1)\n  setName('Tom')\n  // 一次重渲染\n})\n```\n\n### 批处理原理\n\nReact 将多个 setState 收集到更新队列，在当前事件循环结束后统一处理：\n\n```javascript\n// 简化原理\nlet isBatching = false\nlet updateQueue = []\n\nfunction setState(update) {\n  if (isBatching) {\n    updateQueue.push(update) // 加入队列\n  } else {\n    // 立即应用\n  }\n}\n\nfunction batch(fn) {\n  isBatching = true\n  fn()\n  isBatching = false\n  flushQueue() // 统一处理队列\n}\n```\n\n### 函数式更新\n\n```jsx\n// ❌ 基于当前 count 值，连续调用会覆盖\nsetCount(count + 1)\nsetCount(count + 1)\n// 结果：count + 1（只增加了 1）\n\n// ✅ 函数式更新，基于前一个状态\nsetCount(prev => prev + 1)\nsetCount(prev => prev + 1)\n// 结果：count + 2（正确增加了 2）\n```\n\n### flushSync 强制同步\n\n```jsx\nimport { flushSync } from 'react-dom'\n\nfunction handleClick() {\n  flushSync(() => {\n    setCount(1)  // 立即重渲染\n  })\n  // 此时 DOM 已更新\n  flushSync(() => {\n    setName('Tom')  // 再次立即重渲染\n  })\n}\n```\n\n### 总结\n- React 18 中 setState 都是批处理的（异步的）\n- 使用函数式更新 `setCount(prev => prev + 1)` 避免状态覆盖\n- 需要 DOM 同步更新时使用 `flushSync`"
  },
  {
    "id": "fw-009",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "组件通信",
      "Context"
    ],
    "question": "React 组件之间有哪些通信方式？",
    "answer": "### 1. 父子通信（props）\n\n```jsx\n// 父 → 子\nfunction Parent() {\n  return <Child name=\"Tom\" />\n}\nfunction Child({ name }) {\n  return <div>{name}</div>\n}\n\n// 子 → 父（回调函数）\nfunction Parent() {\n  const [msg, setMsg] = useState('')\n  return <Child onSend={setMsg} />\n}\nfunction Child({ onSend }) {\n  return <button onClick={() => onSend('hello')}>Send</button>\n}\n```\n\n### 2. Context（跨层级）\n\n```jsx\nconst ThemeContext = createContext('light')\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\"dark\">\n      <Deeply />\n    </ThemeContext.Provider>\n  )\n}\n\nfunction Deeply() {\n  const theme = useContext(ThemeContext)\n  return <div>{theme}</div>\n}\n```\n\n### 3. useRef + useImperativeHandle（父调子方法）\n\n```jsx\nconst Child = forwardRef((props, ref) => {\n  useImperativeHandle(ref, () => ({\n    focus: () => inputRef.current.focus(),\n    clear: () => setInput('')\n  }))\n  return <input ref={inputRef} />\n})\n\nfunction Parent() {\n  const childRef = useRef()\n  return <>\n    <Child ref={childRef} />\n    <button onClick={() => childRef.current.focus()}>Focus</button>\n  </>\n}\n```\n\n### 4. 状态提升（兄弟通信）\n\n```jsx\nfunction Parent() {\n  const [value, setValue] = useState('')\n  return (\n    <>\n      <A value={value} />\n      <B onChange={setValue} />\n    </>\n  )\n}\n```\n\n### 5. 事件总线（非推荐，但简单）\n\n```jsx\n// mitt 库\nimport mitt from 'mitt'\nconst emitter = mitt()\n\n// 组件 A\nemitter.emit('event', data)\n\n// 组件 B\nemitter.on('event', (data) => { ... })\n```\n\n### 6. 全局状态管理（Redux/Zustand/Jotai）\n\n```jsx\n// Zustand\nconst useStore = create((set) => ({\n  count: 0,\n  increment: () => set(state => ({ count: state.count + 1 }))\n}))\n\n// 任何组件\nconst count = useStore(state => state.count)\n```\n\n### 各方案对比\n\n| 方案 | 适用场景 | 复杂度 |\n|------|----------|--------|\n| props | 父子 | 低 |\n| Context | 跨层级共享 | 中 |\n| 状态提升 | 兄弟 | 低 |\n| ref | 父调子方法 | 中 |\n| 全局状态 | 大型应用 | 高 |\n| 事件总线 | 简单解耦 | 低 |\n\n### 选择建议\n- 父子 → props\n- 跨层级 → Context（适合低频更新）\n- 全局状态 → Zustand / Jotai（比 Redux 更轻量）\n- 复杂业务 → Redux Toolkit"
  },
  {
    "id": "fw-010",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "高阶组件",
      "HOC",
      "render props"
    ],
    "question": "React 高阶组件（HOC）和 render props 模式是什么？",
    "answer": "### 高阶组件（HOC）\n\nHOC 是一个函数，接收组件返回新组件，用于逻辑复用。\n\n```jsx\n// HOC 示例：添加 loading 状态\nfunction withLoading(WrappedComponent) {\n  return function WithLoading({ isLoading, ...props }) {\n    if (isLoading) return <Spinner />\n    return <WrappedComponent {...props} />\n  }\n}\n\n// 使用\nconst UserList = withLoading(UserListComponent)\n<UserList isLoading={true} />\n```\n\n**常见 HOC：**\n- `withRouter`（React Router）\n- `connect`（Redux）\n- `withStyles`（Material UI）\n\n### Render Props\n\n通过 prop 传递渲染函数，实现逻辑复用。\n\n```jsx\n// Render Props 组件\nfunction MouseTracker({ render }) {\n  const [pos, setPos] = useState({ x: 0, y: 0 })\n  return (\n    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>\n      {render(pos)}\n    </div>\n  )\n}\n\n// 使用\n<MouseTracker render={({ x, y }) => (\n  <div>Mouse at {x}, {y}</div>\n)} />\n```\n\n### Hooks 时代的替代方案\n\nReact Hooks 出现后，大多数 HOC 和 render props 可以用自定义 Hook 替代：\n\n```jsx\n// 自定义 Hook\nfunction useMousePosition() {\n  const [pos, setPos] = useState({ x: 0, y: 0 })\n  useEffect(() => {\n    const handler = e => setPos({ x: e.clientX, y: e.clientY })\n    window.addEventListener('mousemove', handler)\n    return () => window.removeEventListener('mousemove', handler)\n  }, [])\n  return pos\n}\n\n// 使用\nfunction Component() {\n  const { x, y } = useMousePosition()\n  return <div>Mouse at {x}, {y}</div>\n}\n```\n\n### 对比\n\n| 方案 | 优点 | 缺点 |\n|------|------|------|\n| HOC | 可组合 | 嵌套地狱、props 冲突、ref 传递问题 |\n| Render Props | 灵活、清晰 | 回调地狱 |\n| Hooks | 简洁、组合自由 | 不能用于 class 组件 |\n\n### HOC 注意事项\n1. 不要在渲染函数内创建 HOC（每次渲染创建新组件）\n2. 透传 props：`{...props}`\n3. 透传 ref：需要 `forwardRef`\n4. 复制静态方法"
  },
  {
    "id": "fw-011",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "性能优化",
      "memo"
    ],
    "question": "React 中如何避免不必要的重渲染？",
    "answer": "### 1. React.memo（组件级记忆）\n\n```jsx\nconst Child = React.memo(({ data }) => {\n  console.log('Child render')\n  return <div>{data.name}</div>\n})\n\n// 只有 data 变化时才重渲染\n```\n\n### 2. useMemo / useCallback\n\n```jsx\nfunction Parent({ items }) {\n  const [filter, setFilter] = useState('')\n\n  // ✅ 缓存计算结果\n  const filtered = useMemo(() => {\n    return items.filter(item => item.includes(filter))\n  }, [items, filter])\n\n  // ✅ 缓存函数引用\n  const handleClick = useCallback(() => {\n    setFilter('')\n  }, [])\n\n  return <Child data={filtered} onClick={handleClick} />\n}\n```\n\n### 3. 状态下放\n\n将频繁变化的状态隔离到小组件中：\n\n```jsx\n// ❌ input 变化导致整个组件重渲染\nfunction App() {\n  const [text, setText] = useState('')\n  const [data, setData] = useState([])\n  return (\n    <>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <ExpensiveList data={data} />\n    </>\n  )\n}\n\n// ✅ 隔离状态\nfunction App() {\n  const [data, setData] = useState([])\n  return (\n    <>\n      <SearchInput />\n      <ExpensiveList data={data} />\n    </>\n  )\n}\n\nconst SearchInput = React.memo(() => {\n  const [text, setText] = useState('')\n  return <input value={text} onChange={e => setText(e.target.value)} />\n})\n```\n\n### 4. 虚拟列表\n\n```jsx\n// react-window\nimport { FixedSizeList } from 'react-window'\n\nconst Row = ({ index, style }) => (\n  <div style={style}>Row {index}</div>\n)\n\n<FixedSizeList height={600} itemCount={10000} itemSize={35}>\n  {Row}\n</FixedSizeList>\n```\n\n### 5. 懒加载\n\n```jsx\nconst LazyComponent = React.lazy(() => import('./HeavyComponent'))\n\n<Suspense fallback={<Spinner />}>\n  <LazyComponent />\n</Suspense>\n```\n\n### 6. key 优化\n\n```jsx\n// ❌ 用 index 做 key（列表变化时性能差）\n{items.map((item, index) => <Item key={index} data={item} />)}\n\n// ✅ 用唯一 ID 做 key\n{items.map(item => <Item key={item.id} data={item} />)}\n```\n\n### 7. CSS 替代条件渲染\n\n```jsx\n// ❌ 频繁挂载/卸载\n{isVisible && <HeavyComponent />}\n\n// ✅ 用 CSS 隐藏（保持挂载状态）\n<HeavyComponent style={{ display: isVisible ? 'block' : 'none' }} />\n```\n\n### 8. React 18 并发特性\n\n```jsx\n// useTransition：将低优先级更新标记为可中断\nconst [isPending, startTransition] = useTransition()\n\nconst handleChange = (e) => {\n  setInputValue(e.target.value) // 高优先级：立即更新输入框\n  startTransition(() => {\n    setSearchResults(search(e.target.value)) // 低优先级：可中断\n  })\n}\n```\n\n### 性能检测\n- React DevTools → Profiler\n- `<Profiler>` 组件\n- Chrome DevTools → Performance"
  },
  {
    "id": "fw-012",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "key",
      "Diff"
    ],
    "question": "React 中 key 的作用是什么？为什么不能用 index 做 key？",
    "answer": "### key 的作用\n\nkey 是 React Diff 算法识别列表项的唯一标识，帮助 React 判断哪些元素变化了。\n\n### Diff 过程\n\nReact 将新旧虚拟 DOM 对比：\n1. 相同 key 的元素视为同一项，复用 DOM 节点\n2. 不同 key 的元素视为不同项，销毁重建\n3. key 不变但位置变化，只移动 DOM 而不重建\n\n### 为什么不能用 index 做 key\n\n**场景：列表头部插入新元素**\n\n```jsx\n// 初始列表\n// index 0: 'Apple'\n// index 1: 'Banana'\n// index 2: 'Cherry'\n\n// 头部插入 'Orange'\n// index 0: 'Orange' ← key 没变但内容变了\n// index 1: 'Apple'  ← key 没变但内容变了\n// index 2: 'Banana' ← key 没变但内容变了\n// index 3: 'Cherry' ← 新增\n```\n\nReact 认为前 3 个 key 没变，会复用它们的 DOM 节点并更新内容。**所有元素都需要重新渲染**，而不是只渲染新元素。\n\n### 正确做法\n\n```jsx\n// ✅ 用唯一 ID 做 key\n{items.map(item => <Item key={item.id} data={item} />)}\n```\n\n### index 做 key 导致的 bug\n\n**1. 输入框错位**\n```jsx\n// 列表项包含输入框，头部插入新项时，输入框内容会跟着错位\n{items.map((item, index) => (\n  <div key={index}>\n    <input defaultValue={item.value} />\n  </div>\n))}\n// 第一个输入框的内容会变成第二个的\n```\n\n**2. 动画异常**\n```jsx\n// CSS transition 基于 DOM 元素身份，index 做 key 会导致动画绑定到错误元素\n```\n\n**3. 组件状态混乱**\n```jsx\n// 有状态的子组件，状态会绑定到错误的列表项\n{items.map((item, index) => (\n  <ExpandableItem key={index} data={item} /> // 展开状态会错位\n))}\n```\n\n### 什么时候可以用 index\n- 列表纯展示，无增删排序操作\n- 列表项是无状态组件\n- 列表项不需要动画\n\n```jsx\n// 静态列表可以用 index\n{staticOptions.map((opt, i) => <option key={i}>{opt}</option>)}\n```\n\n### 总结\n- key 应该**稳定、唯一、可预测**\n- 用业务 ID 做 key\n- 避免 index 做 key（除非列表完全静态）"
  },
  {
    "id": "fw-013",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "生命周期",
      "Hooks"
    ],
    "question": "React 类组件的生命周期有哪些？对应 Hooks 怎么写？",
    "answer": "### 类组件生命周期\n\n```text\n挂载阶段：\n  constructor → getDerivedStateFromProps → render → componentDidMount\n\n更新阶段：\n  getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate\n\n卸载阶段：\n  componentWillUnmount\n```\n\n### 生命周期详解\n\n```jsx\nclass MyComponent extends React.Component {\n  constructor(props) {\n    super(props)\n    // 初始化 state、绑定方法\n  }\n\n  static getDerivedStateFromProps(props, state) {\n    // 从 props 派生 state\n    return null\n  }\n\n  shouldComponentUpdate(nextProps, nextState) {\n    // 返回 false 阻止重渲染\n    return true\n  }\n\n  componentDidMount() {\n    // 挂载后：数据请求、订阅、DOM 操作\n  }\n\n  getSnapshotBeforeUpdate(prevProps, prevState) {\n    // DOM 更新前读取信息（如滚动位置）\n    return null\n  }\n\n  componentDidUpdate(prevProps, prevState, snapshot) {\n    // 更新后：DOM 操作、网络请求\n  }\n\n  componentWillUnmount() {\n    // 卸载前：清除定时器、取消订阅\n  }\n\n  render() {\n    return <div />\n  }\n}\n```\n\n### Hooks 对应关系\n\n| 类组件生命周期 | Hooks 等价 |\n|---------------|-----------|\n| constructor | useState / useMemo 初始化 |\n| componentDidMount | `useEffect(() => {}, [])` |\n| componentDidUpdate | `useEffect(() => {}, [dep])` |\n| componentWillUnmount | `useEffect(() => { return cleanup }, [])` |\n| shouldComponentUpdate | React.memo |\n| getDerivedStateFromProps | 渲染期间直接计算 |\n| getSnapshotBeforeUpdate | useLayoutEffect |\n| forceUpdate | useReducer（强制触发） |\n\n### 代码对照\n\n```jsx\n// 类组件\nclass User extends React.Component {\n  componentDidMount() {\n    fetchUser(this.props.id)\n  }\n  componentDidUpdate(prevProps) {\n    if (prevProps.id !== this.props.id) {\n      fetchUser(this.props.id)\n    }\n  }\n  componentWillUnmount() {\n    this.controller.abort()\n  }\n  render() { return <div>{this.state.user}</div> }\n}\n\n// Hooks 等价\nfunction User({ id }) {\n  const [user, setUser] = useState(null)\n\n  useEffect(() => {\n    const controller = new AbortController()\n    fetchUser(id, { signal: controller.signal })\n      .then(setUser)\n    return () => controller.abort() // cleanup = componentWillUnmount\n  }, [id]) // 依赖变化 = componentDidUpdate\n\n  return <div>{user}</div>\n}\n```\n\n### 废弃的生命周期（React 17+）\n- `componentWillMount`\n- `componentWillReceiveProps`\n- `componentWillUpdate`\n\n被废弃的原因是这些生命周期在 Fiber 异步渲染模式下可能被多次调用，导致不安全。"
  },
  {
    "id": "fw-014",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "受控组件",
      "表单"
    ],
    "question": "React 中受控组件和非受控组件的区别？",
    "answer": "### 受控组件\n\n表单数据由 React state 管理，每次输入都更新 state。\n\n```jsx\nfunction ControlledForm() {\n  const [value, setValue] = useState('')\n\n  return (\n    <input\n      value={value}\n      onChange={e => setValue(e.target.value)}\n    />\n  )\n}\n```\n\n### 非受控组件\n\n表单数据由 DOM 自己管理，React 通过 ref 获取值。\n\n```jsx\nfunction UncontrolledForm() {\n  const inputRef = useRef()\n\n  const handleSubmit = () => {\n    console.log(inputRef.current.value)\n  }\n\n  return (\n    <>\n      <input ref={inputRef} defaultValue=\"initial\" />\n      <button onClick={handleSubmit}>Submit</button>\n    </>\n  )\n}\n```\n\n### 对比\n\n| 特性 | 受控组件 | 非受控组件 |\n|------|----------|-----------|\n| 数据源 | React state | DOM |\n| 值获取 | state 变量 | ref.current.value |\n| 实时验证 | ✅ 每次 onChange | ❌ 需手动获取 |\n| 默认值 | value 属性 | defaultValue |\n| 性能 | 每次输入触发渲染 | 不触发渲染 |\n| 推荐度 | ⭐⭐⭐ | ⭐ |\n\n### 受控组件示例\n\n```jsx\nfunction Form() {\n  const [form, setForm] = useState({\n    username: '',\n    email: '',\n    role: 'user'\n  })\n\n  const handleChange = (e) => {\n    setForm(prev => ({\n      ...prev,\n      [e.target.name]: e.target.value\n    }))\n  }\n\n  return (\n    <form>\n      <input name=\"username\" value={form.username} onChange={handleChange} />\n      <input name=\"email\" value={form.email} onChange={handleChange} />\n      <select name=\"role\" value={form.role} onChange={handleChange}>\n        <option value=\"user\">User</option>\n        <option value=\"admin\">Admin</option>\n      </select>\n    </form>\n  )\n}\n```\n\n### 什么时候用非受控组件\n\n1. **简单表单，不需要实时验证**\n2. **文件上传**（`<input type=\"file\">` 必须非受控）\n3. **集成非 React 代码**\n4. **大型表单性能优化**\n\n```jsx\n// 文件上传必须非受控\nconst fileRef = useRef()\n<input type=\"file\" ref={fileRef} />\n```\n\n### 推荐做法\n- 默认使用**受控组件**（数据流清晰）\n- 简单场景或性能敏感时用**非受控组件**\n- 大型表单考虑使用 **React Hook Form** 等库（底层是非受控 + 按需更新）"
  },
  {
    "id": "fw-015",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "Suspense",
      "懒加载"
    ],
    "question": "React.lazy 和 Suspense 如何使用？原理是什么？",
    "answer": "### 基本用法\n\n```jsx\nimport { lazy, Suspense } from 'react'\n\n// 懒加载组件\nconst Dashboard = lazy(() => import('./Dashboard'))\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <Dashboard />\n    </Suspense>\n  )\n}\n```\n\n### 路由级懒加载\n\n```jsx\nimport { lazy, Suspense } from 'react'\nimport { BrowserRouter, Routes, Route } from 'react-router-dom'\n\nconst Home = lazy(() => import('./pages/Home'))\nconst About = lazy(() => import('./pages/About'))\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Suspense fallback={<PageLoader />}>\n        <Routes>\n          <Route path=\"/\" element={<Home />} />\n          <Route path=\"/about\" element={<About />} />\n        </Routes>\n      </Suspense>\n    </BrowserRouter>\n  )\n}\n```\n\n### 原理\n\n1. `React.lazy` 返回一个特殊组件，内部状态为 `pending`\n2. 触发 `import()` 动态加载模块（返回 Promise）\n3. React 渲染时发现组件处于 `pending`，**抛出 Promise**\n4. 最近的 `Suspense` 边界捕获 Promise，渲染 `fallback`\n5. Promise resolve 后（模块加载完成），React 重新渲染，显示真实组件\n\n```javascript\n// React.lazy 简化实现\nfunction lazy(loader) {\n  let Component = null\n  return function LazyComponent(props) {\n    if (!Component) {\n      // 抛出 Promise，Suspense 会捕获\n      throw loader().then(mod => {\n        Component = mod.default\n      })\n    }\n    return <Component {...props} />\n  }\n}\n```\n\n### 多个懒加载组件\n\n```jsx\n<Suspense fallback={<Loader />}>\n  <Header />   {/* 先加载完 */}\n  <Main />     {/* 后加载完 */}\n  <Footer />   {/* 最后加载完 */}\n</Suspense>\n// 三个都加载完才隐藏 fallback\n\n// 嵌套 Suspense：各部分独立加载\n<Suspense fallback={<PageLoader />}>\n  <Header />\n  <Suspense fallback={<MainLoader />}>\n    <Main />\n  </Suspense>\n  <Footer />\n</Suspense>\n```\n\n### React 18 服务端 Suspense\n\n```jsx\n// 服务端也可以用 Suspense 流式渲染\n// HTML 分块发送，先发送框架，后发送数据\n<Suspense fallback={<Spinner />}>\n  <Comments /> {/* 数据加载完成后流式注入 */}\n</Suspense>\n```\n\n### 与 Error Boundary 配合\n\n```jsx\n// 加载失败时的处理\n<ErrorBoundary fallback={<Error />}>\n  <Suspense fallback={<Loader />}>\n    <LazyComponent />\n  </Suspense>\n</ErrorBoundary>\n```\n\n### 优势\n- **按需加载**：减小首屏包体积\n- **声明式**：不需要手动管理 loading 状态\n- **可组合**：Suspense 可嵌套"
  },
  {
    "id": "fw-030",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "Router",
      "路由"
    ],
    "question": "React Router v6 的核心概念和常用 API？",
    "answer": "### 基本路由配置\n\n```jsx\nimport { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/about\" element={<About />} />\n        <Route path=\"/users/:id\" element={<UserDetail />} />\n        <Route path=\"/dashboard/*\" element={<Dashboard />} />\n        <Route path=\"*\" element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  )\n}\n```\n\n### 导航\n\n```jsx\n// 声明式导航\n<Link to=\"/about\">About</Link>\n<NavLink to=\"/about\" className={({ isActive }) => isActive ? 'active' : ''}>\n  About\n</NavLink>\n\n// 编程式导航\nfunction Component() {\n  const navigate = useNavigate()\n  \n  navigate('/about')\n  navigate(-1)        // 后退\n  navigate('/users/1', { replace: true })  // 替换历史\n}\n```\n\n### 获取路由参数\n\n```jsx\nimport { useParams, useSearchParams, useLocation } from 'react-router-dom'\n\nfunction UserDetail() {\n  const { id } = useParams()  // /users/:id → { id: '123' }\n  const [searchParams] = useSearchParams()  // ?name=Tom → { name: 'Tom' }\n  const location = useLocation()  // { pathname, search, hash }\n  \n  return <div>User {id}</div>\n}\n```\n\n### 嵌套路由（Outlet）\n\n```jsx\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path=\"/dashboard\" element={<Dashboard />}>\n          <Route index element={<DashboardHome />} />\n          <Route path=\"settings\" element={<Settings />} />\n          <Route path=\"analytics\" element={<Analytics />} />\n        </Route>\n      </Routes>\n    </BrowserRouter>\n  )\n}\n\nfunction Dashboard() {\n  return (\n    <div>\n      <nav>\n        <Link to=\"/dashboard\">Home</Link>\n        <Link to=\"/dashboard/settings\">Settings</Link>\n      </nav>\n      <Outlet /> {/* 子路由渲染在这里 */}\n    </div>\n  )\n}\n```\n\n### 路由守卫\n\n```jsx\nfunction ProtectedRoute({ children }) {\n  const { user } = useAuth()\n  if (!user) return <Navigate to=\"/login\" replace />\n  return children\n}\n\n<Route path=\"/admin\" element={\n  <ProtectedRoute><Admin /></ProtectedRoute>\n} />\n```\n\n### 懒加载路由\n\n```jsx\nimport { lazy, Suspense } from 'react'\n\nconst Home = lazy(() => import('./pages/Home'))\nconst About = lazy(() => import('./pages/About'))\n\n<Routes>\n  <Route path=\"/\" element={\n    <Suspense fallback={<Loader />}><Home /></Suspense>\n  } />\n</Routes>\n```\n\n### v5 vs v6 变化\n\n| 特性 | v5 | v6 |\n|------|-----|-----|\n| 路由组件 | `<Switch>` | `<Routes>` |\n| 路由匹配 | `<Route component>` | `<Route element>` |\n| 嵌套路由 | 配置复杂 | `<Outlet>` 简洁 |\n| 编程式导航 | `useHistory` | `useNavigate` |\n| 路由参数 | `useParams` | `useParams`（相同）|\n| 路径匹配 | 宽松 | 严格（更精确）|\n\n### 高级特性\n\n```jsx\n// useLoaderData（React Router 6.4+ 数据加载）\nconst data = useLoaderData()\n\n// useOutlet 获取当前 outlet\nconst outlet = useOutlet()\n\n// useMatch 匹配当前路径\nconst match = useMatch('/users/:id')\n```"
  },
  {
    "id": "fw-034",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "Vue",
      "对比"
    ],
    "question": "React 和 Vue 的设计理念有什么不同？",
    "answer": "### 核心理念对比\n\n| 维度 | React | Vue |\n|------|-------|-----|\n| 编程范式 | 函数式 | 响应式 + 声明式 |\n| 数据流 | 单向 | 双向绑定（v-model）|\n| 模板 vs JSX | JSX | 模板 + JSX（可选）|\n| 状态管理 | 不可变 | 可变（Proxy 代理）|\n| 组件抽象 | 函数 + Hooks | SFC（单文件组件）|\n| 编译优化 | 运行时（React Compiler 改善中）| 编译时（静态提升、PatchFlag）|\n\n### 数据变化检测\n\n**React — 不可变 + 虚拟 DOM Diff**\n```jsx\n// React：创建新对象触发更新\nconst [list, setList] = useState([])\nsetList([...list, newItem]) // 必须创建新引用\n\n// React 不知道什么变了，需要 Diff 整棵树\n```\n\n**Vue — 响应式 + 精确追踪**\n```javascript\n// Vue：直接修改触发更新\nconst list = ref([])\nlist.value.push(newItem) // 直接修改\n\n// Vue 知道具体哪个属性变了，精确更新\n```\n\n### 模板 vs JSX\n\n**Vue 模板** — 受限语法，编译时优化：\n```vue\n<template>\n  <div>{{ message }}</div>\n  <button @click=\"handleClick\">Click</button>\n</template>\n```\n- 编译时可以做静态分析、静态提升、PatchFlag\n- 更接近 HTML，学习门槛低\n- 灵活性有限\n\n**React JSX** — JavaScript 表达力：\n```jsx\n<div>\n  {condition && <Child />}\n  {list.map(item => <Item key={item.id} {...item} />)}\n</div>\n```\n- 完整的 JavaScript 能力\n- 编译时优化困难（JSX 太灵活）\n- React Compiler 正在改善\n\n### 编译时优化\n\n**Vue3 的编译优化：**\n```javascript\n// 编译器知道哪些是动态的\n// 静态节点只创建一次\nconst _hoisted_1 = createElementVNode(\"div\", null, \"静态文本\")\n\n// PatchFlag 标记动态部分\ncreateVNode(\"div\", null, msg, 1 /* TEXT */)\n// Diff 时只比较 text，跳过其他\n```\n\n**React** — 运行时 Diff（React Compiler 改善中）：\n```jsx\n// React 需要运行时比较整个虚拟 DOM 树\n// React 19 的 Compiler 会自动 memo 化\n```\n\n### 组件复用\n\n**React — Hooks**\n```jsx\nfunction useMouse() {\n  const [pos, setPos] = useState({ x: 0, y: 0 })\n  useEffect(() => { /* ... */ }, [])\n  return pos\n}\n// 简洁、组合灵活\n```\n\n**Vue — Composables**\n```javascript\nfunction useMouse() {\n  const pos = reactive({ x: 0, y: 0 })\n  onMounted(() => { /* ... */ })\n  return pos\n}\n// 类似 Hooks，但基于响应式系统\n```\n\n### 总结\n- **React**：函数式、JSX、不可变、灵活、生态大\n- **Vue**：响应式、模板、渐进式、编译优化、上手快\n- 两者都在互相借鉴：React 学编译优化，Vue 学 Hooks"
  },
  {
    "id": "fw-036",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React",
      "主题切换",
      "暗黑模式",
      "Context",
      "CSS变量"
    ],
    "question": "在 React 中如何实现亮色 / 暗色主题切换？",
    "answer": "推荐「**CSS 变量 + Context + 根节点 class**」的方案，性能好、可动态换肤。\n\n### 1. 用 CSS 变量定义两套主题\n\n```css\n:root { --bg: #fff; --text: #111; }\n:root.dark { --bg: #111; --text: #fff; }\n.app { background: var(--bg); color: var(--text); }\n```\n\n### 2. 用 Context 管理主题状态并切换根节点 class\n\n```jsx\nconst ThemeContext = createContext()\n\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = useState(\n    () => localStorage.getItem('theme') || 'light'\n  )\n\n  useEffect(() => {\n    document.documentElement.className = theme  // 切换到 <html class=\"dark\">\n    localStorage.setItem('theme', theme)\n  }, [theme])\n\n  return (\n    <ThemeContext.Provider value={{\n      theme,\n      toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light')\n    }}>\n      {children}\n    </ThemeContext.Provider>\n  )\n}\n```\n\n### 其他方案\n- **CSS-in-JS（styled-components）**：用 `ThemeProvider` 注入 theme 对象，适合动态主题。\n- **next-themes**：Next.js 项目直接用，处理 SSR 闪烁（FOUC）很方便。\n\n### 注意点\n- **避免 SSR 闪烁**：在 `<head>` 内联一段脚本提前设置 `html` 的 class（next-themes 已处理）。\n- 切换时加 `transition` 可做平滑过渡，但注意性能。\n- 组件内不要写死颜色，统一用 CSS 变量，否则换肤不生效。"
  },
  {
    "id": "react-001",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "useReducer",
      "状态管理",
      "Context"
    ],
    "question": "useReducer 是什么？和 useState 怎么选？如何配合 Context 做全局状态？",
    "answer": "`useReducer` 用 `(state, action) => newState` 的 reducer 管理复杂状态，适合**多子状态、状态转移逻辑复杂**的场景（比一堆 useState 更清晰）。\n\n```js\nconst [state, dispatch] = useReducer(reducer, initialState)\ndispatch({ type: 'increment' })\n```\n\n**和 useState 选型**：简单值用 `useState`；状态间有依赖/多种操作/需要可预测更新时用 `useReducer`。\n\n**配合 Context 做全局状态**（轻量替代 Redux）：\n\n```js\nconst Ctx = createContext()\n<Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>\n// 子组件 const { dispatch } = useContext(Ctx)\n```\n\n> 注意：Context value 变化会让所有消费组件重渲染，宜拆细或用 `useMemo` 包裹 value。\n\n### React 渲染生命周期与生产环境避坑准则\n\n| 核心环节 | 底层约束机制 | 常见生产 Bug 与修复方案 |\n| :--- | :--- | :--- |\n| **Render 纯函数阶段** | 在并发模式下可能被多次调用或中断重来 | 严禁在组件函数顶层直接修改外部变量、发起网络请求或读写 DOM，所有副作用必须放入 `useEffect` 或事件处理器 |\n| **闭包陷阱（Stale Closure）** | 每次渲染都有独立的词法作用域快照，漏写依赖项会读到旧状态 | 开启 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则，使用函数式更新 `setCount(c => c + 1)` 或 `useEffectEvent` |\n| **并发与服务端水合** | 服务端 HTML 与客户端首帧渲染输出必须 100% 匹配 | 避免在 JSX 中直接渲染 `Math.random()`、`new Date()` 或直接读取 `localStorage` |\n\n```jsx\nimport { useState, useEffect } from 'react'\n\n// 标准实践：解决 useEffect 异步请求竞态（Race Condition）与闭包过期问题\nexport function UserProfile({ userId }) {\n  const [user, setUser] = useState(null)\n\n  useEffect(() => {\n    let cancelled = false\n    const controller = new AbortController()\n\n    async function load() {\n      try {\n        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal })\n        const data = await res.json()\n        if (!cancelled) setUser(data)\n      } catch (err) {\n        if (err.name !== 'AbortError' && !cancelled) console.error(err)\n      }\n    }\n    load()\n\n    // 清理函数：当 userId 快速切换或组件卸载时，丢弃旧请求响应，杜绝后发先至覆盖新数据！\n    return () => {\n      cancelled = true\n      controller.abort()\n    }\n  }, [userId])\n\n  return <div>{user ? user.name : '加载中...'}</div>\n}\n```"
  },
  {
    "id": "react-002",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "useTransition",
      "useDeferredValue",
      "防抖与节流",
      "并发渲染",
      "时间切片"
    ],
    "question": "React 并发特性实战对比：useTransition、useDeferredValue 与传统防抖（Debounce）/ 节流（Throttle）有何本质区别？",
    "answer": "`useTransition` 与 `useDeferredValue` 都是 React 18+ 用于将**低优先级 UI 更新（如大列表筛选、图表重绘）从高优先级用户交互（如输入框打字）中解耦**的并发原语，但二者的触发入口不同，且与传统的防抖（Debounce）有本质机制差异。\n\n### 一、 `useTransition` vs `useDeferredValue` vs 防抖（Debounce）核心对比\n\n| 维度 | `useTransition` | `useDeferredValue` | 传统防抖（`debounce`） |\n| :--- | :--- | :--- | :--- |\n| **控制的目标** | 包裹**状态更新动作（Setter 函数）** | 包裹**派生的值或接收到的 Props** | 延迟**回调函数本身的触发时机** |\n| **快设备上的延迟** | **0ms 人为延迟**：CPU 空闲时立即开始渲染 | **0ms 人为延迟**：紧随紧急更新之后立即启动后台渲染 | **固定硬编码延迟**（如必须干等 300ms 才开始渲染） |\n| **慢设备上的可中断性** | **可中断**：渲染到一半用户继续打字，立即丢弃半成品优先响应输入 | **可中断**：后台渲染可随时让位给主线程输入 | **不可中断**：一旦 300ms 到期开始执行重型渲染，主线程依然会被卡死 |\n| **过渡态指示器** | 原生返回 `[isPending, startTransition]` | 通过比较 `deferredVal !== val` 判断是否滞后 | 需手动维护额外 loading 状态 |\n\n### 二、 代码对照：何时用 `useTransition`，何时用 `useDeferredValue`？\n\n```jsx\nimport { useState, useTransition, useDeferredValue, memo } from 'react'\n\n// 场景 A：手握 setState 控制权 -> 用 useTransition\nfunction SearchWithTransition() {\n  const [input, setInput] = useState('')\n  const [query, setQuery] = useState('')\n  const [isPending, startTransition] = useTransition()\n\n  const handleChange = (e) => {\n    const val = e.target.value\n    setInput(val) // 1. 紧急更新（SyncLane）：保证输入框光标与回显零延迟！\n    startTransition(() => {\n      setQuery(val) // 2. 非紧急过渡更新（TransitionLane）：随时可被打断\n    })\n  }\n\n  return (\n    <div>\n      <input value={input} onChange={handleChange} />\n      {isPending && <span>正在刷新结果…</span>}\n      <HeavyResultList query={query} />\n    </div>\n  )\n}\n\n// 场景 B：只拿到单一状态值或上游 Props，配合 memo 跳过昂贵子树重渲染 -> 用 useDeferredValue\nconst HeavyResultList = memo(function HeavyResultList({ query }) {\n  const items = computeThousandsOfItems(query)\n  return <ul>{items.map((it) => <li key={it.id}>{it.text}</li>)}</ul>\n})\n```\n\n### 三、 关键工程结论\n\n- **不要用 `useTransition` 替代网络请求的 `debounce`**：`useTransition` 只会让 React 组件渲染变可中断，但 `startTransition` 内部的同步函数体仍会每次立即执行；网络请求防抖仍需用 `debounce` + `AbortController`。"
  },
  {
    "id": "react-003",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "错误边界",
      "error boundary",
      "容错"
    ],
    "question": "React 错误边界（Error Boundary）是什么？函数组件能做错误边界吗？",
    "answer": "错误边界是**捕获子组件渲染/生命周期抛出的错误、避免整棵应用崩溃**的类组件，通过两个静态方法实现：\n\n```js\nclass ErrorBoundary extends React.Component {\n  state = { hasError: false }\n  static getDerivedStateFromError(err) { return { hasError: true } }\n  componentDidCatch(err, info) { logError(err, info) }\n  render() {\n    return this.state.hasError ? <Fallback /> : this.props.children\n  }\n}\n```\n\n**关键点**：\n\n- **只能捕获渲染期错误**，捕获不到事件回调、异步（`setTimeout`/Promise）、SSR 中的错误\n- **函数组件本身不能做错误边界**（React 规定必须是类组件）；但可以用社区库（如 `react-error-boundary`）的 Hook 简易封装\n- 错误边界本身崩溃了就无能为力，所以建议分层包裹\n\n### React 渲染生命周期与生产环境避坑准则\n\n| 核心环节 | 底层约束机制 | 常见生产 Bug 与修复方案 |\n| :--- | :--- | :--- |\n| **Render 纯函数阶段** | 在并发模式下可能被多次调用或中断重来 | 严禁在组件函数顶层直接修改外部变量、发起网络请求或读写 DOM，所有副作用必须放入 `useEffect` 或事件处理器 |\n| **闭包陷阱（Stale Closure）** | 每次渲染都有独立的词法作用域快照，漏写依赖项会读到旧状态 | 开启 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则，使用函数式更新 `setCount(c => c + 1)` 或 `useEffectEvent` |\n| **并发与服务端水合** | 服务端 HTML 与客户端首帧渲染输出必须 100% 匹配 | 避免在 JSX 中直接渲染 `Math.random()`、`new Date()` 或直接读取 `localStorage` |\n\n```jsx\nimport { useState, useEffect } from 'react'\n\n// 标准实践：解决 useEffect 异步请求竞态（Race Condition）与闭包过期问题\nexport function UserProfile({ userId }) {\n  const [user, setUser] = useState(null)\n\n  useEffect(() => {\n    let cancelled = false\n    const controller = new AbortController()\n\n    async function load() {\n      try {\n        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal })\n        const data = await res.json()\n        if (!cancelled) setUser(data)\n      } catch (err) {\n        if (err.name !== 'AbortError' && !cancelled) console.error(err)\n      }\n    }\n    load()\n\n    // 清理函数：当 userId 快速切换或组件卸载时，丢弃旧请求响应，杜绝后发先至覆盖新数据！\n    return () => {\n      cancelled = true\n      controller.abort()\n    }\n  }, [userId])\n\n  return <div>{user ? user.name : '加载中...'}</div>\n}\n```"
  },
  {
    "id": "react-004",
    "category": "react",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "useId",
      "SSR",
      "唯一ID"
    ],
    "question": "React 的 useId 有什么用？为什么不能用 Math.random / Date 生成 id？",
    "answer": "`useId` 生成**跨服务端/客户端一致的唯一 ID**，专为 SSR/SSG 设计。\n\n**为什么不能用 random/Date**：\n- 服务端渲染时生成的 id 与客户端 hydration 时对不上 → 水合不匹配（hydration mismatch）警告\n- 每次渲染都不稳定，导致无障碍属性（`htmlFor` / `aria-*`）关联错乱\n\n```js\nconst id = useId()  // 如 \":r0:\"\n<label htmlFor={id} /><input id={id} />\n```\n\n> 在列表里需要多个 id 时，用 `const base = useId(); const ids = items.map((_, i) => base + '-' + i)`。\n\n### React 渲染生命周期与生产环境避坑准则\n\n| 核心环节 | 底层约束机制 | 常见生产 Bug 与修复方案 |\n| :--- | :--- | :--- |\n| **Render 纯函数阶段** | 在并发模式下可能被多次调用或中断重来 | 严禁在组件函数顶层直接修改外部变量、发起网络请求或读写 DOM，所有副作用必须放入 `useEffect` 或事件处理器 |\n| **闭包陷阱（Stale Closure）** | 每次渲染都有独立的词法作用域快照，漏写依赖项会读到旧状态 | 开启 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则，使用函数式更新 `setCount(c => c + 1)` 或 `useEffectEvent` |\n| **并发与服务端水合** | 服务端 HTML 与客户端首帧渲染输出必须 100% 匹配 | 避免在 JSX 中直接渲染 `Math.random()`、`new Date()` 或直接读取 `localStorage` |\n\n```jsx\nimport { useState, useEffect } from 'react'\n\n// 标准实践：解决 useEffect 异步请求竞态（Race Condition）与闭包过期问题\nexport function UserProfile({ userId }) {\n  const [user, setUser] = useState(null)\n\n  useEffect(() => {\n    let cancelled = false\n    const controller = new AbortController()\n\n    async function load() {\n      try {\n        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal })\n        const data = await res.json()\n        if (!cancelled) setUser(data)\n      } catch (err) {\n        if (err.name !== 'AbortError' && !cancelled) console.error(err)\n      }\n    }\n    load()\n\n    // 清理函数：当 userId 快速切换或组件卸载时，丢弃旧请求响应，杜绝后发先至覆盖新数据！\n    return () => {\n      cancelled = true\n      controller.abort()\n    }\n  }, [userId])\n\n  return <div>{user ? user.name : '加载中...'}</div>\n}\n```"
  },
  {
    "id": "react-005",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "自定义 Hook",
      "复用",
      "模式"
    ],
    "question": "如何写一个自定义 Hook？有哪些最佳实践？",
    "answer": "自定义 Hook 是以 `use` 开头的函数，内部可调用其他 Hook，用于**抽取组件间可复用的状态逻辑**（而非 UI）。\n\n```js\nfunction useLocalStorage(key, initial) {\n  const [val, setVal] = useState(() => localStorage.getItem(key) ?? initial)\n  useEffect(() => localStorage.setItem(key, val), [key, val])\n  return [val, setVal]\n}\n```\n\n**最佳实践**：\n1. 命名必须以 `use` 开头（让 React 的 Hooks 规则检查器能识别）\n2. 只调用其他 Hook，不直接返回 JSX\n3. 返回数组（可解构命名）或对象（避免顺序耦合）\n4. 把「状态值 + 操作函数」一起返回，像 `[value, setValue]`\n\n> 区别于普通函数：Hook 可以\"挂\"在组件生命周期上（用 useState/useEffect）。\n\n### React 渲染生命周期与生产环境避坑准则\n\n| 核心环节 | 底层约束机制 | 常见生产 Bug 与修复方案 |\n| :--- | :--- | :--- |\n| **Render 纯函数阶段** | 在并发模式下可能被多次调用或中断重来 | 严禁在组件函数顶层直接修改外部变量、发起网络请求或读写 DOM，所有副作用必须放入 `useEffect` 或事件处理器 |\n| **闭包陷阱（Stale Closure）** | 每次渲染都有独立的词法作用域快照，漏写依赖项会读到旧状态 | 开启 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则，使用函数式更新 `setCount(c => c + 1)` 或 `useEffectEvent` |\n| **并发与服务端水合** | 服务端 HTML 与客户端首帧渲染输出必须 100% 匹配 | 避免在 JSX 中直接渲染 `Math.random()`、`new Date()` 或直接读取 `localStorage` |\n\n```jsx\nimport { useState, useEffect } from 'react'\n\n// 标准实践：解决 useEffect 异步请求竞态（Race Condition）与闭包过期问题\nexport function UserProfile({ userId }) {\n  const [user, setUser] = useState(null)\n\n  useEffect(() => {\n    let cancelled = false\n    const controller = new AbortController()\n\n    async function load() {\n      try {\n        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal })\n        const data = await res.json()\n        if (!cancelled) setUser(data)\n      } catch (err) {\n        if (err.name !== 'AbortError' && !cancelled) console.error(err)\n      }\n    }\n    load()\n\n    // 清理函数：当 userId 快速切换或组件卸载时，丢弃旧请求响应，杜绝后发先至覆盖新数据！\n    return () => {\n      cancelled = true\n      controller.abort()\n    }\n  }, [userId])\n\n  return <div>{user ? user.name : '加载中...'}</div>\n}\n```"
  },
  {
    "id": "react-006",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "forwardRef",
      "useImperativeHandle",
      "ref"
    ],
    "question": "forwardRef 和 useImperativeHandle 有什么用？",
    "answer": "默认函数组件**不能接收 ref**（React 把 ref 当特殊属性）。\n\n- **forwardRef**：让函数组件能接收父组件传来的 ref，转发到内部某个 DOM/组件\n- **useImperativeHandle**：限制父组件通过 ref 能访问到的「实例 API」（只暴露想暴露的方法/属性）\n\n```js\nconst Input = forwardRef((props, ref) => {\n  const inner = useRef()\n  useImperativeHandle(ref, () => ({\n    focus: () => inner.current.focus(),\n    clear: () => (inner.current.value = '')\n  }))\n  return <input ref={inner} />\n})\n```\n\n> 父组件 `<Input ref={r} />` 只能调用 `r.current.focus()/clear()`，拿不到原始 DOM 的全部能力。React 19 引入 `ref` 作为普通 prop，forwardRef 将逐渐被取代。\n\n### React 渲染生命周期与生产环境避坑准则\n\n| 核心环节 | 底层约束机制 | 常见生产 Bug 与修复方案 |\n| :--- | :--- | :--- |\n| **Render 纯函数阶段** | 在并发模式下可能被多次调用或中断重来 | 严禁在组件函数顶层直接修改外部变量、发起网络请求或读写 DOM，所有副作用必须放入 `useEffect` 或事件处理器 |\n| **闭包陷阱（Stale Closure）** | 每次渲染都有独立的词法作用域快照，漏写依赖项会读到旧状态 | 开启 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则，使用函数式更新 `setCount(c => c + 1)` 或 `useEffectEvent` |\n| **并发与服务端水合** | 服务端 HTML 与客户端首帧渲染输出必须 100% 匹配 | 避免在 JSX 中直接渲染 `Math.random()`、`new Date()` 或直接读取 `localStorage` |\n\n```jsx\nimport { useState, useEffect } from 'react'\n\n// 标准实践：解决 useEffect 异步请求竞态（Race Condition）与闭包过期问题\nexport function UserProfile({ userId }) {\n  const [user, setUser] = useState(null)\n\n  useEffect(() => {\n    let cancelled = false\n    const controller = new AbortController()\n\n    async function load() {\n      try {\n        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal })\n        const data = await res.json()\n        if (!cancelled) setUser(data)\n      } catch (err) {\n        if (err.name !== 'AbortError' && !cancelled) console.error(err)\n      }\n    }\n    load()\n\n    // 清理函数：当 userId 快速切换或组件卸载时，丢弃旧请求响应，杜绝后发先至覆盖新数据！\n    return () => {\n      cancelled = true\n      controller.abort()\n    }\n  }, [userId])\n\n  return <div>{user ? user.name : '加载中...'}</div>\n}\n```"
  },
  {
    "id": "react-007",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "React.memo",
      "useMemo陷阱",
      "useCallback",
      "ReactCompiler",
      "引用相等性"
    ],
    "question": "React.memo / useMemo / useCallback 性能优化有哪些失效陷阱？React 19 Compiler 如何从编译期解决？",
    "answer": "在手写 `React.memo`、`useMemo` 与 `useCallback` 时，开发者最常犯的错误是**“只加了一半缓存，反而多付出了缓存比对成本却完全没拦住重渲染”**。\n\n### 一、 手写记忆化失效的三大经典反例与修复\n\n```jsx\n// 反例 1：子组件未用 React.memo 包裹，父组件单独写 useCallback 完全是负优化！\nfunction ParentBad() {\n  const [count, setCount] = useState(0)\n  // 误区：NormalChild 不是 React.memo 组件，ParentBad 重渲染时 NormalChild 必然重渲染\n  const handleClick = useCallback(() => console.log('clicked'), [])\n  return <NormalChild onClick={handleClick} />\n}\n\n// 反例 2：子组件用了 React.memo，但传入了内联对象或 JSX children 导致瞬间破功！\nconst MemoChart = React.memo(function Chart({ config, onSelect, children }) {\n  return <div>{children}</div>\n})\n\nfunction DashboardBad() {\n  const onSelect = useCallback((id) => console.log(id), [])\n  // 破功原因 A：config={{ theme: 'dark' }} 每次渲染都创建全新对象引用（{} !== {}）\n  // 破功原因 B：<MemoChart><span>标题</span></MemoChart> 中的 children 本质是每次新建的 ReactElement 对象！\n  return (\n    <MemoChart config={{ theme: 'dark' }} onSelect={onSelect}>\n      <span>实时图表</span>\n    </MemoChart>\n  )\n}\n```\n\n### 二、 什么时候不该用 `useMemo` / `useCallback`？\n\n| 场景 | 是否应该使用 | 原因说明 |\n| :--- | :--- | :--- |\n| 简单原始值计算（如 `const fullName = first + ' ' + last`） | **不该用** | 创建依赖数组与执行 `Object.is` 遍历的开销远大于一次字符串拼接 |\n| 传给原生 DOM 节点的事件（如 `<button onClick={fn}>`） | **不该用** | 原生 DOM 节点不会因为函数引用变化而触发子树协调 |\n| 作为 `useEffect` 的依赖项，或传给 `React.memo` 重型子组件 | **必须用** | 防止每次渲染引用变化导致 `useEffect` 无限重跑或重型子树重渲染 |\n\n### 三、 React 19 Compiler 如何从编译期根治？\n\nReact 19 引入的 **React Compiler** 通过编译期静态数据流分析，自动在函数组件内部插入精细到语句级别的缓存槽位（`useMemoCache / _c(size)`）：\n\n```javascript\nimport { c as _c } from 'react/compiler-runtime'\n\nfunction ProductCard(props) {\n  const $ = _c(4) // 编译器自动分配 4 个记忆槽位\n  let filtered\n  if ($[0] !== props.items) {\n    filtered = props.items.filter((x) => x.inStock)\n    $[0] = props.items\n    $[1] = filtered\n  } else {\n    filtered = $[1]\n  }\n  let vdom\n  if ($[2] !== filtered) {\n    vdom = <ItemList data={filtered} />\n    $[2] = filtered\n    $[3] = vdom\n  } else {\n    vdom = $[3]\n  }\n  return vdom\n}\n```"
  },
  {
    "id": "react-008",
    "category": "react",
    "module": "framework",
    "difficulty": "hard",
    "tags": [
      "Fiber双缓存",
      "workInProgress",
      "Lanes模型",
      "时间切片",
      "Reconciliation"
    ],
    "question": "React 双缓存 Fiber 树（current 与 workInProgress）与 Lanes 优先级调度模型是怎样协作的？",
    "answer": "在理解了 Fiber 节点链表结构的基础上，React 并发渲染引擎的核心在于**双缓存 Fiber 树（Double Buffering）交替机制**与**基于 31 位二进制位掩码的 Lanes 优先级模型**。\n\n### 一、 双缓存 Fiber 树（current 与 workInProgress）架构\n\nReact 在内存中同时维护两棵 Fiber 树：\n- **`current` 树**：代表当前屏幕上已经完成渲染、用户正在看到的 UI 状态，由根容器 `FiberRootNode.current` 指向。\n- **`workInProgress`（WIP）树**：在后台内存中正在构建与协调（Reconcile）的新一帧 Fiber 树。两棵树对应的同名节点通过 `alternate` 指针互相引用。\n\n```javascript\n// FiberRootNode 与双缓存树切换伪代码（对应 ReactFiberWorkLoop.js）\nfunction createWorkInProgress(current, pendingProps) {\n  let wip = current.alternate\n  if (wip === null) {\n    // 首屏渲染（Mount）或首次创建 alternate 节点\n    wip = createFiber(current.tag, pendingProps, current.key, current.mode)\n    wip.stateNode = current.stateNode\n    wip.alternate = current\n    current.alternate = wip\n  } else {\n    // 更新阶段（Update）：直接复用 alternate 节点对象，减少 GC 分配开销\n    wip.pendingProps = pendingProps\n    wip.flags = NoFlags\n    wip.subtreeFlags = NoFlags\n    wip.deletions = null\n  }\n  wip.child = current.child\n  wip.memoizedProps = current.memoizedProps\n  wip.memoizedState = current.memoizedState\n  wip.lanes = current.lanes\n  wip.childLanes = current.childLanes\n  return wip\n}\n\n// Commit 阶段完成 DOM 变更后，仅需一行指针切换即完成整树翻页\nfunction commitRootImpl(root) {\n  const finishedWork = root.finishedWork\n  commitMutationEffects(root, finishedWork)\n  // 指针原子切换：原来的 workInProgress 瞬间转正成为新的 current 树！\n  root.current = finishedWork\n  commitLayoutEffects(finishedWork, root)\n}\n```\n\n### 二、 Lanes 31 位位运算优先级模型（取代早期 expirationTime）\n\nReact 18+ 使用 31 位二进制位（Bitmask）表示不同更新车道的优先级，越低位代表优先级越高，支持用按位或（`|`）合并批次、按位与（`&`）筛查交集、以及 `lanes & -lanes` O(1) 提取最高优先级车道：\n\n| 车道名称（Lane） | 二进制位掩码示例 | 触发源与调度行为 |\n| :--- | :--- | :--- |\n| **`SyncLane`** | `0b0001` | 离散用户交互（`click`、`keydown`、`input`），同步微任务立即冲刷 |\n| **`InputContinuousLane`** | `0b0100` | 连续事件（`scroll`、`mousemove`、`drag`），高优连续调度 |\n| **`DefaultLane`** | `0b10000` | 网络请求 `fetch` 回调、`setTimeout` 触发的常规 `setState` |\n| **`TransitionLanes`** | `0b1111100000` | `startTransition` / `useTransition` 标记的非紧急 UI 过渡更新，可被高优车道打断 |\n| **`IdleLane`** | `0b100000000000` | 离屏渲染（Offscreen）与空闲预热任务 |\n\n```javascript\nconst SyncLane = 0b0001\nconst TransitionLane1 = 0b1000\n\n// 1. 合并多个更新车道（Batching）\nlet pendingLanes = SyncLane | TransitionLane1\n\n// 2. 提取最高优先级车道（最低位的 1：补码按位与技巧）\nfunction getHighestPriorityLane(lanes) {\n  return lanes & -lanes\n}\nconsole.log(getHighestPriorityLane(pendingLanes) === SyncLane) // true\n```\n\n### 三、 生产环境饥饿防卫与撕裂防护\n\n1. **饥饿问题（Starvation）防卫**：如果低优先级的 `TransitionLane` 持续被高频 `SyncLane` 打断，React 内部通过 `markStarvedLanesAsExpired` 检查等待时长；一旦超过过期阈值，会将该低优车道强制升级为同步执行，防止界面永远不更新。\n2. **撕裂问题（Tearing）**：由于并发渲染阶段可中断，外部状态库必须使用 `useSyncExternalStore` 在并发切片期间校验状态快照一致性。"
  },
  {
    "id": "react-009",
    "category": "react",
    "module": "framework",
    "difficulty": "hard",
    "tags": [
      "合成事件",
      "事件委托",
      "机制"
    ],
    "question": "React 的合成事件（SyntheticEvent）是什么？和原生事件有什么区别？",
    "answer": "**合成事件（SyntheticEvent）** 是 React 基于浏览器的原生 DOM 事件封装的**跨浏览器一致性事件包装器**，并配合**根容器事件委托（Event Delegation）**实现了统一的事件优先级调度。\n\n### 一、 合成事件与原生 DOM 事件的核心区别\n\n| 维度 | React 合成事件（`SyntheticEvent`） | 浏览器原生事件（`NativeEvent`） |\n| :--- | :--- | :--- |\n| **事件挂载位置** | **React 17+ 统一委托挂载在根容器 `rootNode`**（`createRoot(container)` 的节点；React 16 曾挂载在 `document`） | 直接绑定在具体的目标 DOM 元素上（或手动委托） |\n| **命名与触发时机** | 驼峰命名（`onClick`、`onChange`）；捕获阶段用 `onClickCapture` | 全小写（`onclick`、`addEventListener('click', fn, true)`） |\n| **表单 `onChange` 行为** | React 的 `onChange` 底层对齐了原生 **`input` 事件**（每次按键输入实时触发） | 原生 `change` 事件在输入框**失去焦点（blur）且值改变时**才触发 |\n| **阻止冒泡方法** | 必须调用 `e.stopPropagation()`（调用 `return false` 在 React 中完全无效） | `e.stopPropagation()` 或传统 `onclick` 中 `return false` |\n| **访问底层原生事件** | 通过 **`e.nativeEvent`** 属性访问底层浏览器原生事件对象 | 本身即为原生事件对象 |\n\n### 二、 为什么 React 17 把事件委托从 `document` 改到了 `rootNode`？\n\n在微前端或多版本 React 共存页面中，如果全部挂载在全局 `document` 上，一个子应用里调用 `e.stopPropagation()` 无法阻止另一个挂在 `document` 上的监听器触发，且容易和外部原生 `document.addEventListener` 发生执行顺序冲突。改为挂载在各自的 `#root` 容器后，每个 React 应用拥有独立封闭的事件作用域。\n\n```jsx\nimport { useEffect, useRef } from 'react'\n\nexport function ModalWithOutsideClick({ onClose }) {\n  const boxRef = useRef(null)\n\n  useEffect(() => {\n    const handleDocClick = (nativeEv) => {\n      // 原生 document 监听：点击弹窗外部时关闭\n      if (boxRef.current && !boxRef.current.contains(nativeEv.target)) {\n        onClose()\n      }\n    }\n    document.addEventListener('click', handleDocClick)\n    return () => document.removeEventListener('click', handleDocClick)\n  }, [onClose])\n\n  return (\n    <div\n      ref={boxRef}\n      onClick={(syntheticEv) => {\n        // React 17+ 中，合成事件挂在 #root 上（位于 document 内层），\n        // 若在此处调用 syntheticEv.stopPropagation()，会同时阻止事件继续向原生 document 冒泡！\n        console.log('底层原生事件对象:', syntheticEv.nativeEvent)\n      }}\n    >\n      弹窗内容\n    </div>\n  )\n}\n```"
  },
  {
    "id": "react-010",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "startTransition",
      "并发渲染",
      "优先级"
    ],
    "question": "React 18 的并发渲染（Concurrent Rendering）是什么？startTransition 如何使用？",
    "answer": "并发渲染让 React 可以**同时维护多个版本的 UI**，根据优先级调度，保证用户输入等紧急更新优先响应。\n\n**startTransition** 把某个更新标记为「可中断的低优先级更新」：\n\n```js\nconst [isPending, startTransition] = useTransition()\nfunction handleChange(e) {\n  setValue(e.target.value)              // 紧急：立即更新输入框\n  startTransition(() => {                // 非紧急：可被中断\n    setSearchResults(compute(e.target.value))\n  })\n}\n```\n\n**要点**：\n- transition 更新过程中 React 可暂停、复用、丢弃旧渲染结果\n- 与 `useDeferredValue` 互补：一个控制「动作包裹」，一个控制「值延迟」\n- 这是 React 从「同步不可中断」到「可中断调度」的范式升级\n\n### React 渲染生命周期与生产环境避坑准则\n\n| 核心环节 | 底层约束机制 | 常见生产 Bug 与修复方案 |\n| :--- | :--- | :--- |\n| **Render 纯函数阶段** | 在并发模式下可能被多次调用或中断重来 | 严禁在组件函数顶层直接修改外部变量、发起网络请求或读写 DOM，所有副作用必须放入 `useEffect` 或事件处理器 |\n| **闭包陷阱（Stale Closure）** | 每次渲染都有独立的词法作用域快照，漏写依赖项会读到旧状态 | 开启 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则，使用函数式更新 `setCount(c => c + 1)` 或 `useEffectEvent` |\n| **并发与服务端水合** | 服务端 HTML 与客户端首帧渲染输出必须 100% 匹配 | 避免在 JSX 中直接渲染 `Math.random()`、`new Date()` 或直接读取 `localStorage` |\n\n```jsx\nimport { useState, useEffect } from 'react'\n\n// 标准实践：解决 useEffect 异步请求竞态（Race Condition）与闭包过期问题\nexport function UserProfile({ userId }) {\n  const [user, setUser] = useState(null)\n\n  useEffect(() => {\n    let cancelled = false\n    const controller = new AbortController()\n\n    async function load() {\n      try {\n        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal })\n        const data = await res.json()\n        if (!cancelled) setUser(data)\n      } catch (err) {\n        if (err.name !== 'AbortError' && !cancelled) console.error(err)\n      }\n    }\n    load()\n\n    // 清理函数：当 userId 快速切换或组件卸载时，丢弃旧请求响应，杜绝后发先至覆盖新数据！\n    return () => {\n      cancelled = true\n      controller.abort()\n    }\n  }, [userId])\n\n  return <div>{user ? user.name : '加载中...'}</div>\n}\n```"
  },
  {
    "id": "react-011",
    "category": "react",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "复合组件",
      "HeadlessUI",
      "设计模式",
      "组件库架构",
      "CustomHooks"
    ],
    "question": "React 复合组件（Compound Components）与无头组件（Headless UI）设计模式如何实现？与自定义 Hook 如何配合？",
    "answer": "在现代 React 组件库（如 Radix UI、Headless UI、Shadcn UI）架构中，工业界标准是**“自定义 Hook 抽离状态逻辑 + Compound Components（复合组件）声明式组合 + Headless UI（状态与样式彻底解耦）”**。\n\n### 一、 四种组件复用与封装模式演进对比\n\n| 模式名称 | 核心职责 | 典型代表 | 优势与局限性 |\n| :--- | :--- | :--- | :--- |\n| **自定义 Hook（Custom Hook）** | 纯状态与副作用逻辑复用（不返回 JSX） | `useQuery`、`useDebounce` | 零 DOM 嵌套层级、TS 类型推导极佳；但不能直接封装 DOM 语义与无障碍属性（ARIA）绑定 |\n| **复合组件（Compound Components）** | 通过隐式 Context 在父子组件间共享状态，消灭巨型配置 Props | `<Select.Root>` + `<Select.Trigger>` + `<Select.Item>` | 布局自由度极高，彻底告别 30 个属性的“配置地狱（Props Apocalypse）” |\n| **无头组件（Headless UI）** | 封装完整状态机、键盘导航与 WAI-ARIA 无障碍规范，零内置 CSS | Radix Primitives、Downshift | UI 视觉 100% 由业务方通过 Tailwind / CSS 控制，同时跨团队复用焦点管理与键盘交互 |\n| **Render Props** | 在渲染作用域内向子函数注入局部状态或 DOM 引用 | `<Controller render={({field}) => ...}>` | 适合在特定子节点局部隔离高频重渲染（如 React Hook Form 精细化字段订阅） |\n\n### 二、 实战代码：基于 Context + 自定义 Hook 实现工业级复合 Tabs 组件\n\n```jsx\nimport { createContext, useContext, useState, useId } from 'react'\n\nconst TabsContext = createContext(null)\n\nfunction useTabsContext() {\n  const ctx = useContext(TabsContext)\n  if (!ctx) throw new Error('Tabs 子组件必须包裹在 <Tabs.Root> 内部使用')\n  return ctx\n}\n\nfunction TabsRoot({ defaultValue, onValueChange, children }) {\n  const [activeTab, setActiveTab] = useState(defaultValue)\n  const baseId = useId()\n  const selectTab = (val) => {\n    setActiveTab(val)\n    onValueChange?.(val)\n  }\n  return (\n    <TabsContext.Provider value={{ activeTab, selectTab, baseId }}>\n      <div className=\"tabs-root\">{children}</div>\n    </TabsContext.Provider>\n  )\n}\n\nfunction TabsTrigger({ value, children }) {\n  const { activeTab, selectTab, baseId } = useTabsContext()\n  const isSelected = activeTab === value\n  return (\n    <button\n      type=\"button\"\n      role=\"tab\"\n      id={`${baseId}-tab-${value}`}\n      aria-controls={`${baseId}-panel-${value}`}\n      aria-selected={isSelected}\n      onClick={() => selectTab(value)}\n    >\n      {children}\n    </button>\n  )\n}\n\nfunction TabsContent({ value, children }) {\n  const { activeTab, baseId } = useTabsContext()\n  if (activeTab !== value) return null\n  return (\n    <div role=\"tabpanel\" id={`${baseId}-panel-${value}`} aria-labelledby={`${baseId}-tab-${value}`}>\n      {children}\n    </div>\n  )\n}\n\nexport const Tabs = { Root: TabsRoot, Trigger: TabsTrigger, Content: TabsContent }\n```\n\n### 三、 选型决策准则\n\n1. **纯数据/生命周期逻辑**（如请求轮询、窗口尺寸监听）：100% 优先写 **自定义 Hook**。\n2. **高交互复杂度通用基础组件**（如带键盘导航、焦点陷阱的 Combobox / Dialog）：采用 **Headless 复合组件模式**。"
  },
  {
    "id": "react-012",
    "category": "react",
    "module": "framework",
    "difficulty": "hard",
    "tags": [
      "useSyncExternalStore",
      "外部存储",
      "订阅"
    ],
    "question": "useSyncExternalStore 是什么？为什么 Redux/Zustand 等外部状态库需要它？",
    "answer": "`useSyncExternalStore` 是 React 18 官方提供的 Hook，让组件**安全订阅外部可变数据源**（如 Redux store、浏览器 API、第三方状态库），并在数据变化时正确重渲染，且**兼容并发渲染**。\n\n```js\nconst snapshot = useSyncExternalStore(\n  subscribe,          // (cb) => unsubscribe，数据源变化通知 React\n  () => store.getState(),  // 返回当前快照（必须稳定引用，否则死循环）\n  () => serverState   // SSR 用的服务端快照\n)\n```\n\n**为什么需要**：\n1. 自己用 `useState + useEffect` 订阅外部 store 在并发下会出现「撕裂（tearing）」——同一时刻 UI 不同部分显示不同数据\n2. 它保证**读取的快照与渲染一致**，并触发正确的重渲染\n3. Redux 的 `useSelector`、Zustand 的 `useStore` 底层都基于它\n\n### React 渲染生命周期与生产环境避坑准则\n\n| 核心环节 | 底层约束机制 | 常见生产 Bug 与修复方案 |\n| :--- | :--- | :--- |\n| **Render 纯函数阶段** | 在并发模式下可能被多次调用或中断重来 | 严禁在组件函数顶层直接修改外部变量、发起网络请求或读写 DOM，所有副作用必须放入 `useEffect` 或事件处理器 |\n| **闭包陷阱（Stale Closure）** | 每次渲染都有独立的词法作用域快照，漏写依赖项会读到旧状态 | 开启 `eslint-plugin-react-hooks` 的 `exhaustive-deps` 规则，使用函数式更新 `setCount(c => c + 1)` 或 `useEffectEvent` |\n| **并发与服务端水合** | 服务端 HTML 与客户端首帧渲染输出必须 100% 匹配 | 避免在 JSX 中直接渲染 `Math.random()`、`new Date()` 或直接读取 `localStorage` |\n\n```jsx\nimport { useState, useEffect } from 'react'\n\n// 标准实践：解决 useEffect 异步请求竞态（Race Condition）与闭包过期问题\nexport function UserProfile({ userId }) {\n  const [user, setUser] = useState(null)\n\n  useEffect(() => {\n    let cancelled = false\n    const controller = new AbortController()\n\n    async function load() {\n      try {\n        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal })\n        const data = await res.json()\n        if (!cancelled) setUser(data)\n      } catch (err) {\n        if (err.name !== 'AbortError' && !cancelled) console.error(err)\n      }\n    }\n    load()\n\n    // 清理函数：当 userId 快速切换或组件卸载时，丢弃旧请求响应，杜绝后发先至覆盖新数据！\n    return () => {\n      cancelled = true\n      controller.abort()\n    }\n  }, [userId])\n\n  return <div>{user ? user.name : '加载中...'}</div>\n}\n```"
  },
  {
    "id": "react-013",
    "category": "react",
    "difficulty": "hard",
    "question": "React 19 核心新特性全解：Actions（useActionState / useOptimistic）、use() API 与 ref 架构简化是如何协同的？",
    "tags": [
      "React19",
      "useActionState",
      "useOptimistic",
      "useAPI",
      "ServerActions"
    ],
    "answer": "React 19 围绕 **异步数据突变（Actions）状态自动化**、**一等公民 Promise 读取原语 `use()`** 以及 **消除历史样板代码（如 `forwardRef`）** 进行了全面升级。\n\n### 一、 React 18 手写异步表单 vs React 19 Actions 原语对比\n\n在 React 18 中处理一次表单提交，开发者必须手动维护 `isPending`、`error`、`optimisticData` 三个状态；React 19 将支持 `async` 函数的过渡更新统称为 **Actions**，并提供了三大配套 Hook：\n\n| React 19 新 API | 核心职责与解决的痛点 |\n| :--- | :--- |\n| **`useActionState(fn, initialState)`** | 自动接管 Action 的 `pending` 状态、上一次返回值 `state` 及包裹后的提交函数 `formAction`，可直接绑定到 `<form action={formAction}>` |\n| **`useFormStatus()`** | 在表单内部的深层子组件（如通用 `<SubmitButton />`）中直接读取外层 `<form>` 的 `{ pending, data }`，无需层层透传 `loading` Prop |\n| **`useOptimistic(state, updateFn)`** | 在异步 Action 进行期间立即渲染乐观状态；一旦异步 Action 结束或失败，**自动无感回退或对齐真实状态** |\n| **`use(resource)`** | 可在组件渲染期间（甚至**支持写在 `if` 条件分支和循环内部**！）直接读取 Promise（配合 `<Suspense>`）或读取 `Context` |\n| **`ref` 作为普通 Prop** | 函数组件直接通过 `function MyInput({ placeholder, ref })` 接收 `ref`，**彻底淘汰 `React.forwardRef` 包装器** |\n\n### 二、 React 19 完整代码实战：Actions + 乐观更新 + `use()`\n\n```tsx\nimport { useActionState, useOptimistic, use } from 'react'\nimport { useFormStatus } from 'react-dom'\n\n// 1. 通用提交按钮：自动感知所属 <form> 的提交状态，无需父组件传 loading\nfunction SubmitButton() {\n  const { pending } = useFormStatus()\n  return <button type=\"submit\" disabled={pending}>{pending ? '发布中...' : '发表评论'}</button>\n}\n\n// 2. 使用 useActionState + useOptimistic 实现零样板代码的乐观评论列表\nexport function CommentSection({ commentsPromise }: { commentsPromise: Promise<string[]> }) {\n  // use() 直接解包父级传入的 Promise（并支持写在条件判断后！）\n  const initialComments = use(commentsPromise)\n\n  const [comments, formAction] = useActionState(\n    async (prevComments: string[], formData: FormData) => {\n      const text = String(formData.get('comment') || '').trim()\n      await saveCommentToServer(text) // 真实异步请求\n      return [...prevComments, text]\n    },\n    initialComments\n  )\n\n  const [optimisticComments, addOptimistic] = useOptimistic(\n    comments,\n    (state, newComment: string) => [...state, `${newComment} (发送中...)`]\n  )\n\n  return (\n    <div>\n      <ul>{optimisticComments.map((c, i) => <li key={i}>{c}</li>)}</ul>\n      <form\n        action={async (formData) => {\n          addOptimistic(String(formData.get('comment') || ''))\n          await formAction(formData)\n        }}\n      >\n        <input name=\"comment\" required />\n        <SubmitButton />\n      </form>\n    </div>\n  )\n}\n```"
  }
]
