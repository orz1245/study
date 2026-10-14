// 框架相关面试题 — 35 题
export const frameworkQuestions = [
  // ========== React 基础与 Hooks ==========
  {
    id: 'fw-001',
    category: 'react',
    module: 'framework',
    difficulty: 'easy',
    tags: ['React', 'JSX', '虚拟DOM'],
    question: 'React 的虚拟 DOM 是什么？它解决了什么问题？',
    answer: `**虚拟 DOM** 是一个 JavaScript 对象树，是真实 DOM 的轻量级副本。

### 工作流程

\`\`\`
状态变化 → 生成新虚拟DOM → 与旧虚拟DOM对比（Diff） → 最小化更新真实DOM
\`\`\`

### 为什么需要虚拟 DOM

1. **减少直接 DOM 操作**：DOM 操作昂贵（涉及重排重绘），虚拟 DOM 在内存中操作 JS 对象更快
2. **批量更新**：状态变化先在虚拟 DOM 中合并，最后一次性更新真实 DOM
3. **跨平台**：虚拟 DOM 是 JS 对象，可以渲染到不同平台（浏览器、Native、SSR）

### 简化实现

\`\`\`jsx
// 虚拟 DOM 节点
const vdom = {
  type: 'div',
  props: { className: 'container' },
  children: [
    { type: 'h1', props: {}, children: 'Hello' },
    { type: 'p', props: {}, children: 'World' }
  ]
}

// 渲染为真实 DOM
function render(vdom) {
  if (typeof vdom === 'string') return document.createTextNode(vdom)
  const el = document.createElement(vdom.type)
  Object.entries(vdom.props).forEach(([k, v]) => el.setAttribute(k, v))
  vdom.children.forEach(child => el.appendChild(render(child)))
  return el
}
\`\`\`

### Diff 算法

React 的 Diff 算法有三个假设：
1. **不同类型的元素产生不同的树**（div → span 会销毁重建）
2. **通过 key 标识同一层级的子元素**
3. **只比较同一层级**（不跨层级比较）

### 虚拟 DOM 的代价
- 首次渲染需要构建虚拟 DOM 树，有额外开销
- 不是所有场景都比直接 DOM 操作快（简单更新场景不如原生）
- Svelte 等框架编译时优化，跳过虚拟 DOM

### 面试要点
- 虚拟 DOM 不是为了"比直接操作 DOM 快"，而是为了**声明式编程**和**跨平台**
- 性能优势来自于**批量更新**和**最小化 DOM 操作**`
  },
  {
    id: 'fw-002',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'Hooks', 'useState'],
    question: 'React Hooks 有哪些常用的？各自的作用是什么？',
    answer: `### 常用 Hooks

**1. useState — 状态管理**
\`\`\`jsx
const [count, setCount] = useState(0)
// 函数式更新（推荐）
setCount(prev => prev + 1)
\`\`\`

**2. useEffect — 副作用**
\`\`\`jsx
// 挂载时执行
useEffect(() => { fetchData() }, [])

// 依赖变化时执行
useEffect(() => { subscribe(id) }, [id])

// 清理副作用
useEffect(() => {
  const timer = setInterval(tick, 1000)
  return () => clearInterval(timer) // 卸载时执行
}, [])
\`\`\`

**3. useRef — 引用（不触发重渲染）**
\`\`\`jsx
const inputRef = useRef(null)
inputRef.current.focus()
\`\`\`

**4. useMemo — 缓存计算结果**
\`\`\`jsx
const sorted = useMemo(() => expensiveSort(data), [data])
\`\`\`

**5. useCallback — 缓存函数引用**
\`\`\`jsx
const handleClick = useCallback(() => doSomething(id), [id])
\`\`\`

**6. useContext — 跨组件共享状态**
\`\`\`jsx
const theme = useContext(ThemeContext)
\`\`\`

**7. useReducer — 复杂状态管理**
\`\`\`jsx
const [state, dispatch] = useReducer(reducer, initialState)
\`\`\`

### 其他 Hooks

| Hook | 作用 |
|------|------|
| \`useLayoutEffect\` | 同步执行副作用（DOM 更新后，浏览器绘制前）|
| \`useImperativeHandle\` | 自定义 ref 暴露给父组件的实例值 |
| \`useId\` | 生成唯一 ID |
| \`useDeferredValue\` | 延迟更新（React 18）|
| \`useTransition\` | 标记非紧急更新（React 18）|

### Hooks 规则
1. **只在顶层调用**，不能在循环/条件/嵌套函数中调用
2. **只在 React 函数组件或自定义 Hook 中调用**

### 为什么有这些规则
Hooks 依赖调用顺序的索引来对应内部状态。如果在条件语句中调用，顺序可能变化，导致状态错乱。`
  },
  {
    id: 'fw-003',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'useEffect', '副作用'],
    question: 'useEffect 和 useLayoutEffect 的区别？',
    answer: `### 执行时机

| Hook | 执行时机 | 阻塞渲染 | 适合场景 |
|------|----------|----------|----------|
| \`useEffect\` | DOM 更新后**异步**执行 | ❌ | 数据请求、订阅、日志 |
| \`useLayoutEffect\` | DOM 更新后**同步**执行（绘制前） | ✅ | 读取/修改 DOM 布局 |

### 执行流程

\`\`\`
状态变化 → React 渲染 → DOM 更新
  → useLayoutEffect 同步执行 ← 此时浏览器还未绘制
  → 浏览器绘制到屏幕
  → useEffect 异步执行 ← 此时用户已看到画面
\`\`\`

### useLayoutEffect 使用场景

**需要读取 DOM 布局并同步修改时使用**，避免闪烁：

\`\`\`jsx
function Tooltip({ children }) {
  const ref = useRef()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
    // 读取 DOM 位置
    const rect = ref.current.getBoundingClientRect()
    // 同步更新位置，避免闪烁
    setPosition({
      x: rect.x + rect.width,
      y: rect.y
    })
  }, [children])

  return (
    <div ref={ref} style={{ transform: \`translate(\${position.x}px, \${position.y}px)\` }}>
      {children}
    </div>
  )
}
\`\`\`

### 如果用 useEffect 会怎样

\`\`\`jsx
// ❌ 用户会先看到 tooltip 在错误位置，然后跳到正确位置（闪烁）
useEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  setPosition({ x: rect.x + rect.width, y: rect.y })
}, [children])
\`\`\`

### useEffect 常见用法

\`\`\`jsx
// 数据请求（异步，不阻塞渲染）
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => setData(data))
}, [])

// 事件监听
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// 依赖变化重新执行
useEffect(() => {
  if (userId) fetchUser(userId)
}, [userId])
\`\`\`

### SSR 注意
\`useLayoutEffect\` 在 SSR 中会报警告（服务端没有 DOM），可用 \`useIsomorphicLayoutEffect\` 兼容：

\`\`\`jsx
const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
\`\`\``
  },
  {
    id: 'fw-004',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', '依赖数组', 'useEffect'],
    question: 'useEffect 的依赖数组为空、有值、不传分别是什么效果？',
    answer: `### 三种情况

\`\`\`jsx
// 1. 不传依赖数组 → 每次渲染后都执行
useEffect(() => {
  console.log('每次渲染都执行')
})

// 2. 空数组 [] → 只在挂载后执行一次
useEffect(() => {
  console.log('只在挂载后执行一次')
}, [])

// 3. 有依赖值 [a, b] → 依赖变化时执行
useEffect(() => {
  console.log('a 或 b 变化时执行')
}, [a, b])
\`\`\`

### 详细对比

| 依赖数组 | 执行时机 | 清理函数执行时机 |
|----------|----------|-----------------|
| 不传 | 每次渲染后 | 下次 effect 执行前 + 卸载时 |
| \`[]\` | 挂载后一次 | 卸载时 |
| \`[dep]\` | 挂载后 + dep 变化时 | 下次 effect 执行前 + 卸载时 |

### 常见陷阱

**1. 闭包陷阱（Stale Closure）**
\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count) // ❌ 永远是 0（闭包捕获了初始值）
      setCount(count + 1) // ❌ 每次都设置成 1
    }, 1000)
    return () => clearInterval(timer)
  }, []) // count 不在依赖中

  // ✅ 解决方案 1：函数式更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1) // 使用函数式更新
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // ✅ 解决方案 2：添加依赖
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [count]) // 每次都清除并重建定时器
}
\`\`\`

**2. 对象/数组依赖**
\`\`\`jsx
// ❌ 每次渲染都是新对象，effect 每次都执行
useEffect(() => { /* ... */ }, [{ a: 1 }])

// ✅ 使用原始值
useEffect(() => { /* ... */ }, [obj.a])

// ✅ 或用 useMemo
const dep = useMemo(() => ({ a: 1 }), [a])
useEffect(() => { /* ... */ }, [dep])
\`\`\`

**3. 函数依赖**
\`\`\`jsx
// ❌ 每次渲染都是新函数
useEffect(() => { handleClick() }, [handleClick])

// ✅ 用 useCallback 包裹
const handleClick = useCallback(() => { /* ... */ }, [dep])
useEffect(() => { handleClick() }, [handleClick])
\`\`\`

### ESLint 规则
\`react-hooks/exhaustive-deps\` 会自动检测缺失的依赖，建议开启。`
  },
  {
    id: 'fw-005',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'useMemo', 'useCallback', '性能'],
    question: 'useMemo 和 useCallback 的区别？什么时候该用？',
    answer: `### 区别

- \`useMemo\` 缓存**计算结果**（值）
- \`useCallback\` 缓存**函数引用**

\`\`\`jsx
// useMemo：缓存值
const sortedData = useMemo(() => {
  return data.sort((a, b) => a - b)
}, [data])

// useCallback：缓存函数
const handleClick = useCallback(() => {
  console.log(id)
}, [id])

// useCallback 本质是 useMemo 的语法糖
const handleClick = useMemo(() => () => {
  console.log(id)
}, [id])
\`\`\`

### 什么时候用

**useMemo 适用场景：**

1. **昂贵的计算**
\`\`\`jsx
const result = useMemo(() => {
  return heavyComputation(data) // 计算耗时 > 1ms
}, [data])
\`\`\`

2. **稳定引用对象**（作为其他 Hook 的依赖或子组件的 prop）
\`\`\`jsx
const config = useMemo(() => ({ endpoint: '/api', timeout: 5000 }), [])
\`\`\`

**useCallback 适用场景：**

1. **传递给被 React.memo 包裹的子组件**
\`\`\`jsx
const Child = React.memo(({ onClick }) => {
  console.log('Child render')
  return <button onClick={onClick}>Click</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ✅ 使用 useCallback，count 变化时 Child 不会重新渲染
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  return <Child onClick={handleClick} />
}
\`\`\`

2. **作为 useEffect 的依赖**
\`\`\`jsx
const fetchData = useCallback(() => {
  api.get(id)
}, [id])

useEffect(() => {
  fetchData()
}, [fetchData])
\`\`\`

### 什么时候不用

\`\`\`jsx
// ❌ 简单计算不需要 useMemo
const doubled = useMemo(() => count * 2, [count])
// 直接写就行
const doubled = count * 2

// ❌ 不传递给子组件的函数不需要 useCallback
const handleLocalClick = useCallback(() => { ... }, [])
// 直接定义即可
const handleLocalClick = () => { ... }
\`\`\`

### 性能权衡
- useMemo/useCallback 本身有**内存开销**和**依赖比较开销**
- 对于简单计算和不被引用的函数，使用它们反而更慢
- **不要过度优化**：只在真正需要时使用

### React 19 变化
React 19 编译器（React Compiler）可以自动优化 memo，未来可能不需要手动使用 useMemo/useCallback。`
  },
  {
    id: 'fw-006',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'useRef', '引用'],
    question: 'useRef 和 useState 的区别？useRef 有哪些使用场景？',
    answer: `### 核心区别

| 特性 | useState | useRef |
|------|----------|--------|
| 修改是否触发重渲染 | ✅ | ❌ |
| 值的持久化 | ✅ | ✅ |
| 读取方式 | 通过 state 变量 | \`.current\` 属性 |
| 适用场景 | 需要渲染的数据 | 不需要渲染的数据 |

\`\`\`jsx
// useState：修改触发重渲染
const [count, setCount] = useState(0)
setCount(1) // 触发重渲染

// useRef：修改不触发重渲染
const timerRef = useRef(null)
timerRef.current = setInterval(...) // 不触发重渲染
\`\`\`

### useRef 使用场景

**1. 访问 DOM 元素**
\`\`\`jsx
function Input() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return <input ref={inputRef} />
}
\`\`\`

**2. 存储定时器/订阅的 ID**
\`\`\`jsx
function Timer() {
  const timerRef = useRef(null)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const stop = () => clearInterval(timerRef.current)

  return <div>{seconds} <button onClick={stop}>Stop</button></div>
}
\`\`\`

**3. 保存最新值（避免闭包陷阱）**
\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  // 保持 ref 始终是最新的
  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    const timer = setInterval(() => {
      // 读取最新值，不会有闭包问题
      console.log(countRef.current)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
\`\`\`

**4. 标记组件是否首次渲染**
\`\`\`jsx
function Component() {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return // 首次渲染不执行
    }
    // 后续依赖变化时执行
    doSomething()
  }, [dep])
}
\`\`\`

**5. 保存可变值且不触发渲染**
\`\`\`jsx
function Map() {
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    mapInstanceRef.current = new MapSDK(container)
  }, [])

  const zoomIn = () => {
    mapInstanceRef.current.zoomIn()
  }
}
\`\`\`

### 注意事项
- 不要在渲染期间读写 ref.current（除了初始化），应在事件处理函数或 effect 中操作
- ref.current 的修改不会触发重渲染，所以渲染依赖的数据不能用 ref 存储`
  },
  {
    id: 'fw-007',
    category: 'react',
    module: 'framework',
    difficulty: 'hard',
    tags: ['React', 'Fiber', '调度', '并发'],
    question: 'React Fiber 架构是什么？它解决了什么问题？',
    answer: `### React 15 的问题

React 15 使用**递归**方式更新组件树（Stack Reconciler），一旦开始就无法中断，如果组件树很深，长任务会阻塞主线程，导致掉帧。

### Fiber 是什么

**Fiber** 是 React 16 引入的新架构，将组件树更新工作拆分为**可中断、可恢复的小任务**（Fiber 节点）。

### Fiber 节点

每个组件对应一个 Fiber 节点，包含：

\`\`\`javascript
{
  type: 'div',              // 组件类型
  key: null,
  child: Fiber | null,      // 第一个子节点
  sibling: Fiber | null,    // 下一个兄弟节点
  return: Fiber | null,     // 父节点
  pendingProps: {},         // 待处理的 props
  memoizedProps: {},        // 上次使用的 props
  memoizedState: {},        // 上次的 state
  updateQueue: {},          // 更新队列
  flags: 0,                 // 副作用标记（插入/更新/删除）
  alternate: Fiber | null,  // 指向上一次的 Fiber（双缓冲）
}
\`\`\`

### 工作流程

\`\`\`
1. Render Phase（可中断）
   - 遍历 Fiber 树
   - 计算变更（Diff）
   - 标记副作用（flags）
   - 使用 requestIdleCallback / MessageChannel 分片执行

2. Commit Phase（不可中断）
   - 将变更应用到 DOM
   - 执行生命周期/useEffect
\`\`\`

### 链表结构

Fiber 树采用**链表**结构（child + sibling + return），而非树形递归，可以随时暂停和恢复：

\`\`\`
      App
     / 
   div
  / \
h1   ul
    / | \
  li  li  li
\`\`\`

遍历顺序：App → div → h1 → (回到 div) → ul → li → li → li

### 时间分片（Time Slicing）

\`\`\`javascript
// 简化的调度逻辑
function workLoop(deadline) {
  let shouldYield = false
  while (nextFiber && !shouldYield) {
    nextFiber = performUnitOfWork(nextFiber)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (nextFiber) {
    requestIdleCallback(workLoop)
  }
}
requestIdleCallback(workLoop)
\`\`\`

### React 18 并发特性

基于 Fiber 架构，React 18 引入：
- **useTransition**：标记非紧急更新，可被中断
- **useDeferredValue**：延迟更新值
- **Suspense**：异步组件加载
- **自动批处理**：多个状态更新合并

### 关键意义
- **可中断渲染**：高优先级任务（用户输入）可以打断低优先级渲染
- **渐进式渲染**：将大任务拆分到多个帧中执行
- **并发更新**：同一时间可以准备多个版本的 UI`
  },
  {
    id: 'fw-008',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'setState', '批量更新'],
    question: 'React 中 setState 是同步还是异步的？',
    answer: `### 结论

- **React 17 及之前**：在 React 管理的事件处理函数中是"异步"的，在 setTimeout/原生事件中是同步的
- **React 18+**：所有更新都是"异步"的（自动批处理）

### React 17 行为

\`\`\`jsx
// React 17
function handleClick() {
  console.log(count)      // 0
  setCount(count + 1)
  console.log(count)      // 0（异步，未立即更新）

  setTimeout(() => {
    setCount(count + 1)
    console.log(count)    // 1（同步，在 setTimeout 中）
  }, 0)
}
\`\`\`

### React 18 自动批处理

\`\`\`jsx
// React 18
function handleClick() {
  setCount(c => c + 1)    // 不会立即重渲染
  setCount(c => c + 1)    // 合并
  setName('Tom')           // 合并
  // 一次重渲染，count = 2, name = 'Tom'
}

// setTimeout 中也批处理
setTimeout(() => {
  setCount(c => c + 1)
  setName('Tom')
  // 一次重渲染
}, 0)

// Promise 中也批处理
fetch().then(() => {
  setCount(c => c + 1)
  setName('Tom')
  // 一次重渲染
})
\`\`\`

### 批处理原理

React 将多个 setState 收集到更新队列，在当前事件循环结束后统一处理：

\`\`\`javascript
// 简化原理
let isBatching = false
let updateQueue = []

function setState(update) {
  if (isBatching) {
    updateQueue.push(update) // 加入队列
  } else {
    // 立即应用
  }
}

function batch(fn) {
  isBatching = true
  fn()
  isBatching = false
  flushQueue() // 统一处理队列
}
\`\`\`

### 函数式更新

\`\`\`jsx
// ❌ 基于当前 count 值，连续调用会覆盖
setCount(count + 1)
setCount(count + 1)
// 结果：count + 1（只增加了 1）

// ✅ 函数式更新，基于前一个状态
setCount(prev => prev + 1)
setCount(prev => prev + 1)
// 结果：count + 2（正确增加了 2）
\`\`\`

### flushSync 强制同步

\`\`\`jsx
import { flushSync } from 'react-dom'

function handleClick() {
  flushSync(() => {
    setCount(1)  // 立即重渲染
  })
  // 此时 DOM 已更新
  flushSync(() => {
    setName('Tom')  // 再次立即重渲染
  })
}
\`\`\`

### 总结
- React 18 中 setState 都是批处理的（异步的）
- 使用函数式更新 \`setCount(prev => prev + 1)\` 避免状态覆盖
- 需要 DOM 同步更新时使用 \`flushSync\``
  },
  {
    id: 'fw-009',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', '组件通信', 'Context'],
    question: 'React 组件之间有哪些通信方式？',
    answer: `### 1. 父子通信（props）

\`\`\`jsx
// 父 → 子
function Parent() {
  return <Child name="Tom" />
}
function Child({ name }) {
  return <div>{name}</div>
}

// 子 → 父（回调函数）
function Parent() {
  const [msg, setMsg] = useState('')
  return <Child onSend={setMsg} />
}
function Child({ onSend }) {
  return <button onClick={() => onSend('hello')}>Send</button>
}
\`\`\`

### 2. Context（跨层级）

\`\`\`jsx
const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Deeply />
    </ThemeContext.Provider>
  )
}

function Deeply() {
  const theme = useContext(ThemeContext)
  return <div>{theme}</div>
}
\`\`\`

### 3. useRef + useImperativeHandle（父调子方法）

\`\`\`jsx
const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => setInput('')
  }))
  return <input ref={inputRef} />
})

function Parent() {
  const childRef = useRef()
  return <>
    <Child ref={childRef} />
    <button onClick={() => childRef.current.focus()}>Focus</button>
  </>
}
\`\`\`

### 4. 状态提升（兄弟通信）

\`\`\`jsx
function Parent() {
  const [value, setValue] = useState('')
  return (
    <>
      <A value={value} />
      <B onChange={setValue} />
    </>
  )
}
\`\`\`

### 5. 事件总线（非推荐，但简单）

\`\`\`jsx
// mitt 库
import mitt from 'mitt'
const emitter = mitt()

// 组件 A
emitter.emit('event', data)

// 组件 B
emitter.on('event', (data) => { ... })
\`\`\`

### 6. 全局状态管理（Redux/Zustand/Jotai）

\`\`\`jsx
// Zustand
const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}))

// 任何组件
const count = useStore(state => state.count)
\`\`\`

### 各方案对比

| 方案 | 适用场景 | 复杂度 |
|------|----------|--------|
| props | 父子 | 低 |
| Context | 跨层级共享 | 中 |
| 状态提升 | 兄弟 | 低 |
| ref | 父调子方法 | 中 |
| 全局状态 | 大型应用 | 高 |
| 事件总线 | 简单解耦 | 低 |

### 选择建议
- 父子 → props
- 跨层级 → Context（适合低频更新）
- 全局状态 → Zustand / Jotai（比 Redux 更轻量）
- 复杂业务 → Redux Toolkit`
  },
  {
    id: 'fw-010',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', '高阶组件', 'HOC', 'render props'],
    question: 'React 高阶组件（HOC）和 render props 模式是什么？',
    answer: `### 高阶组件（HOC）

HOC 是一个函数，接收组件返回新组件，用于逻辑复用。

\`\`\`jsx
// HOC 示例：添加 loading 状态
function withLoading(WrappedComponent) {
  return function WithLoading({ isLoading, ...props }) {
    if (isLoading) return <Spinner />
    return <WrappedComponent {...props} />
  }
}

// 使用
const UserList = withLoading(UserListComponent)
<UserList isLoading={true} />
\`\`\`

**常见 HOC：**
- \`withRouter\`（React Router）
- \`connect\`（Redux）
- \`withStyles\`（Material UI）

### Render Props

通过 prop 传递渲染函数，实现逻辑复用。

\`\`\`jsx
// Render Props 组件
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  )
}

// 使用
<MouseTracker render={({ x, y }) => (
  <div>Mouse at {x}, {y}</div>
)} />
\`\`\`

### Hooks 时代的替代方案

React Hooks 出现后，大多数 HOC 和 render props 可以用自定义 Hook 替代：

\`\`\`jsx
// 自定义 Hook
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = e => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}

// 使用
function Component() {
  const { x, y } = useMousePosition()
  return <div>Mouse at {x}, {y}</div>
}
\`\`\`

### 对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| HOC | 可组合 | 嵌套地狱、props 冲突、ref 传递问题 |
| Render Props | 灵活、清晰 | 回调地狱 |
| Hooks | 简洁、组合自由 | 不能用于 class 组件 |

### HOC 注意事项
1. 不要在渲染函数内创建 HOC（每次渲染创建新组件）
2. 透传 props：\`{...props}\`
3. 透传 ref：需要 \`forwardRef\`
4. 复制静态方法`
  },

  // ========== React 性能优化 ==========
  {
    id: 'fw-011',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', '性能优化', 'memo'],
    question: 'React 中如何避免不必要的重渲染？',
    answer: `### 1. React.memo（组件级记忆）

\`\`\`jsx
const Child = React.memo(({ data }) => {
  console.log('Child render')
  return <div>{data.name}</div>
})

// 只有 data 变化时才重渲染
\`\`\`

### 2. useMemo / useCallback

\`\`\`jsx
function Parent({ items }) {
  const [filter, setFilter] = useState('')

  // ✅ 缓存计算结果
  const filtered = useMemo(() => {
    return items.filter(item => item.includes(filter))
  }, [items, filter])

  // ✅ 缓存函数引用
  const handleClick = useCallback(() => {
    setFilter('')
  }, [])

  return <Child data={filtered} onClick={handleClick} />
}
\`\`\`

### 3. 状态下放

将频繁变化的状态隔离到小组件中：

\`\`\`jsx
// ❌ input 变化导致整个组件重渲染
function App() {
  const [text, setText] = useState('')
  const [data, setData] = useState([])
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ExpensiveList data={data} />
    </>
  )
}

// ✅ 隔离状态
function App() {
  const [data, setData] = useState([])
  return (
    <>
      <SearchInput />
      <ExpensiveList data={data} />
    </>
  )
}

const SearchInput = React.memo(() => {
  const [text, setText] = useState('')
  return <input value={text} onChange={e => setText(e.target.value)} />
})
\`\`\`

### 4. 虚拟列表

\`\`\`jsx
// react-window
import { FixedSizeList } from 'react-window'

const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
)

<FixedSizeList height={600} itemCount={10000} itemSize={35}>
  {Row}
</FixedSizeList>
\`\`\`

### 5. 懒加载

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
\`\`\`

### 6. key 优化

\`\`\`jsx
// ❌ 用 index 做 key（列表变化时性能差）
{items.map((item, index) => <Item key={index} data={item} />)}

// ✅ 用唯一 ID 做 key
{items.map(item => <Item key={item.id} data={item} />)}
\`\`\`

### 7. CSS 替代条件渲染

\`\`\`jsx
// ❌ 频繁挂载/卸载
{isVisible && <HeavyComponent />}

// ✅ 用 CSS 隐藏（保持挂载状态）
<HeavyComponent style={{ display: isVisible ? 'block' : 'none' }} />
\`\`\`

### 8. React 18 并发特性

\`\`\`jsx
// useTransition：将低优先级更新标记为可中断
const [isPending, startTransition] = useTransition()

const handleChange = (e) => {
  setInputValue(e.target.value) // 高优先级：立即更新输入框
  startTransition(() => {
    setSearchResults(search(e.target.value)) // 低优先级：可中断
  })
}
\`\`\`

### 性能检测
- React DevTools → Profiler
- \`<Profiler>\` 组件
- Chrome DevTools → Performance`
  },
  {
    id: 'fw-012',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'key', 'Diff'],
    question: 'React 中 key 的作用是什么？为什么不能用 index 做 key？',
    answer: `### key 的作用

key 是 React Diff 算法识别列表项的唯一标识，帮助 React 判断哪些元素变化了。

### Diff 过程

React 将新旧虚拟 DOM 对比：
1. 相同 key 的元素视为同一项，复用 DOM 节点
2. 不同 key 的元素视为不同项，销毁重建
3. key 不变但位置变化，只移动 DOM 而不重建

### 为什么不能用 index 做 key

**场景：列表头部插入新元素**

\`\`\`jsx
// 初始列表
// index 0: 'Apple'
// index 1: 'Banana'
// index 2: 'Cherry'

// 头部插入 'Orange'
// index 0: 'Orange' ← key 没变但内容变了
// index 1: 'Apple'  ← key 没变但内容变了
// index 2: 'Banana' ← key 没变但内容变了
// index 3: 'Cherry' ← 新增
\`\`\`

React 认为前 3 个 key 没变，会复用它们的 DOM 节点并更新内容。**所有元素都需要重新渲染**，而不是只渲染新元素。

### 正确做法

\`\`\`jsx
// ✅ 用唯一 ID 做 key
{items.map(item => <Item key={item.id} data={item} />)}
\`\`\`

### index 做 key 导致的 bug

**1. 输入框错位**
\`\`\`jsx
// 列表项包含输入框，头部插入新项时，输入框内容会跟着错位
{items.map((item, index) => (
  <div key={index}>
    <input defaultValue={item.value} />
  </div>
))}
// 第一个输入框的内容会变成第二个的
\`\`\`

**2. 动画异常**
\`\`\`jsx
// CSS transition 基于 DOM 元素身份，index 做 key 会导致动画绑定到错误元素
\`\`\`

**3. 组件状态混乱**
\`\`\`jsx
// 有状态的子组件，状态会绑定到错误的列表项
{items.map((item, index) => (
  <ExpandableItem key={index} data={item} /> // 展开状态会错位
))}
\`\`\`

### 什么时候可以用 index
- 列表纯展示，无增删排序操作
- 列表项是无状态组件
- 列表项不需要动画

\`\`\`jsx
// 静态列表可以用 index
{staticOptions.map((opt, i) => <option key={i}>{opt}</option>)}
\`\`\`

### 总结
- key 应该**稳定、唯一、可预测**
- 用业务 ID 做 key
- 避免 index 做 key（除非列表完全静态）`
  },
  {
    id: 'fw-013',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', '生命周期', 'Hooks'],
    question: 'React 类组件的生命周期有哪些？对应 Hooks 怎么写？',
    answer: `### 类组件生命周期

\`\`\`
挂载阶段：
  constructor → getDerivedStateFromProps → render → componentDidMount

更新阶段：
  getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate

卸载阶段：
  componentWillUnmount
\`\`\`

### 生命周期详解

\`\`\`jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    // 初始化 state、绑定方法
  }

  static getDerivedStateFromProps(props, state) {
    // 从 props 派生 state
    return null
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 返回 false 阻止重渲染
    return true
  }

  componentDidMount() {
    // 挂载后：数据请求、订阅、DOM 操作
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // DOM 更新前读取信息（如滚动位置）
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 更新后：DOM 操作、网络请求
  }

  componentWillUnmount() {
    // 卸载前：清除定时器、取消订阅
  }

  render() {
    return <div />
  }
}
\`\`\`

### Hooks 对应关系

| 类组件生命周期 | Hooks 等价 |
|---------------|-----------|
| constructor | useState / useMemo 初始化 |
| componentDidMount | \`useEffect(() => {}, [])\` |
| componentDidUpdate | \`useEffect(() => {}, [dep])\` |
| componentWillUnmount | \`useEffect(() => { return cleanup }, [])\` |
| shouldComponentUpdate | React.memo |
| getDerivedStateFromProps | 渲染期间直接计算 |
| getSnapshotBeforeUpdate | useLayoutEffect |
| forceUpdate | useReducer（强制触发） |

### 代码对照

\`\`\`jsx
// 类组件
class User extends React.Component {
  componentDidMount() {
    fetchUser(this.props.id)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      fetchUser(this.props.id)
    }
  }
  componentWillUnmount() {
    this.controller.abort()
  }
  render() { return <div>{this.state.user}</div> }
}

// Hooks 等价
function User({ id }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchUser(id, { signal: controller.signal })
      .then(setUser)
    return () => controller.abort() // cleanup = componentWillUnmount
  }, [id]) // 依赖变化 = componentDidUpdate

  return <div>{user}</div>
}
\`\`\`

### 废弃的生命周期（React 17+）
- \`componentWillMount\`
- \`componentWillReceiveProps\`
- \`componentWillUpdate\`

被废弃的原因是这些生命周期在 Fiber 异步渲染模式下可能被多次调用，导致不安全。`
  },
  {
    id: 'fw-014',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', '受控组件', '表单'],
    question: 'React 中受控组件和非受控组件的区别？',
    answer: `### 受控组件

表单数据由 React state 管理，每次输入都更新 state。

\`\`\`jsx
function ControlledForm() {
  const [value, setValue] = useState('')

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}
\`\`\`

### 非受控组件

表单数据由 DOM 自己管理，React 通过 ref 获取值。

\`\`\`jsx
function UncontrolledForm() {
  const inputRef = useRef()

  const handleSubmit = () => {
    console.log(inputRef.current.value)
  }

  return (
    <>
      <input ref={inputRef} defaultValue="initial" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  )
}
\`\`\`

### 对比

| 特性 | 受控组件 | 非受控组件 |
|------|----------|-----------|
| 数据源 | React state | DOM |
| 值获取 | state 变量 | ref.current.value |
| 实时验证 | ✅ 每次 onChange | ❌ 需手动获取 |
| 默认值 | value 属性 | defaultValue |
| 性能 | 每次输入触发渲染 | 不触发渲染 |
| 推荐度 | ⭐⭐⭐ | ⭐ |

### 受控组件示例

\`\`\`jsx
function Form() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'user'
  })

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form>
      <input name="username" value={form.username} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </form>
  )
}
\`\`\`

### 什么时候用非受控组件

1. **简单表单，不需要实时验证**
2. **文件上传**（\`<input type="file">\` 必须非受控）
3. **集成非 React 代码**
4. **大型表单性能优化**

\`\`\`jsx
// 文件上传必须非受控
const fileRef = useRef()
<input type="file" ref={fileRef} />
\`\`\`

### 推荐做法
- 默认使用**受控组件**（数据流清晰）
- 简单场景或性能敏感时用**非受控组件**
- 大型表单考虑使用 **React Hook Form** 等库（底层是非受控 + 按需更新）`
  },
  {
    id: 'fw-015',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'Suspense', '懒加载'],
    question: 'React.lazy 和 Suspense 如何使用？原理是什么？',
    answer: `### 基本用法

\`\`\`jsx
import { lazy, Suspense } from 'react'

// 懒加载组件
const Dashboard = lazy(() => import('./Dashboard'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  )
}
\`\`\`

### 路由级懒加载

\`\`\`jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
\`\`\`

### 原理

1. \`React.lazy\` 返回一个特殊组件，内部状态为 \`pending\`
2. 触发 \`import()\` 动态加载模块（返回 Promise）
3. React 渲染时发现组件处于 \`pending\`，**抛出 Promise**
4. 最近的 \`Suspense\` 边界捕获 Promise，渲染 \`fallback\`
5. Promise resolve 后（模块加载完成），React 重新渲染，显示真实组件

\`\`\`javascript
// React.lazy 简化实现
function lazy(loader) {
  let Component = null
  return function LazyComponent(props) {
    if (!Component) {
      // 抛出 Promise，Suspense 会捕获
      throw loader().then(mod => {
        Component = mod.default
      })
    }
    return <Component {...props} />
  }
}
\`\`\`

### 多个懒加载组件

\`\`\`jsx
<Suspense fallback={<Loader />}>
  <Header />   {/* 先加载完 */}
  <Main />     {/* 后加载完 */}
  <Footer />   {/* 最后加载完 */}
</Suspense>
// 三个都加载完才隐藏 fallback

// 嵌套 Suspense：各部分独立加载
<Suspense fallback={<PageLoader />}>
  <Header />
  <Suspense fallback={<MainLoader />}>
    <Main />
  </Suspense>
  <Footer />
</Suspense>
\`\`\`

### React 18 服务端 Suspense

\`\`\`jsx
// 服务端也可以用 Suspense 流式渲染
// HTML 分块发送，先发送框架，后发送数据
<Suspense fallback={<Spinner />}>
  <Comments /> {/* 数据加载完成后流式注入 */}
</Suspense>
\`\`\`

### 与 Error Boundary 配合

\`\`\`jsx
// 加载失败时的处理
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loader />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
\`\`\`

### 优势
- **按需加载**：减小首屏包体积
- **声明式**：不需要手动管理 loading 状态
- **可组合**：Suspense 可嵌套`
  },

  // ========== Vue3 ==========
  {
    id: 'fw-016',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', 'Composition API', 'Options API'],
    question: 'Vue3 Composition API 和 Options API 的区别？为什么要有 Composition API？',
    answer: `### Options API（选项式）

\`\`\`vue
<script>
export default {
  data() {
    return { count: 0, name: '' }
  },
  computed: {
    double() { return this.count * 2 }
  },
  methods: {
    increment() { this.count++ }
  },
  mounted() {
    console.log('mounted')
  }
}
</script>
\`\`\`

### Composition API（组合式）

\`\`\`vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const name = ref('')
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('mounted')
})
</script>
\`\`\`

### 为什么需要 Composition API

**1. 逻辑复用更灵活**

\`\`\`javascript
// 自定义 Hook（composable）
function useCounter(initial = 0) {
  const count = ref(initial)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}

// 任何组件中使用
const { count, increment } = useCounter(10)
\`\`\`

Options API 的复用靠 mixin，有命名冲突、来源不清晰的问题。

**2. 逻辑组织更好**

Options API 中相关逻辑分散在 data、methods、computed、watch 中：
\`\`\`javascript
// 搜索功能分散在各处
export default {
  data() { return { keyword: '', results: [] } },
  computed() { return { filtered() { /*...*/ } } },
  methods: { search() { /*...*/ } },
  watch: { keyword() { /*...*/ } }
}
\`\`\`

Composition API 可以将相关逻辑放在一起：
\`\`\`javascript
function useSearch() {
  const keyword = ref('')
  const results = ref([])
  const filtered = computed(...)
  const search = () => {...}
  watch(keyword, search)
  return { keyword, results, filtered, search }
}
\`\`\`

**3. 更好的 TypeScript 支持**
- Options API 的 \`this\` 类型推断复杂
- Composition API 天然友好，类型推断更准确

### 对比

| 特性 | Options API | Composition API |
|------|-------------|-----------------|
| 代码组织 | 按选项分组 | 按逻辑分组 |
| 逻辑复用 | mixin | composable 函数 |
| this | 需要理解 this | 无 this |
| TS 支持 | 一般 | 优秀 |
| 学习曲线 | 低 | 中 |
| 适合 | 小项目 | 中大型项目 |

### 并非取代
- Vue3 仍然支持 Options API
- 可以混用
- \`<script setup>\` 是 Composition API 的编译宏语法糖，推荐使用`
  },
  {
    id: 'fw-017',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', 'ref', 'reactive', '响应式'],
    question: 'Vue3 中 ref 和 reactive 的区别？什么时候用哪个？',
    answer: `### ref

将**任何类型**的值变成响应式，通过 \`.value\` 访问。

\`\`\`javascript
const count = ref(0)
const name = ref('Tom')
const obj = ref({ a: 1 })

count.value++         // 修改
console.log(count.value)  // 1
obj.value.a = 2       // 修改对象属性
\`\`\`

### reactive

将**对象**变成响应式（Proxy 代理），直接访问属性。

\`\`\`javascript
const state = reactive({
  count: 0,
  name: 'Tom'
})

state.count++         // 直接修改
console.log(state.count)  // 1
\`\`\`

### 核心区别

| 特性 | ref | reactive |
|------|-----|----------|
| 支持类型 | 所有类型（原始+对象） | 仅对象/数组 |
| 访问方式 | \`.value\` | 直接访问属性 |
| 解构 | ❌ 失去响应式 | ❌ 失去响应式 |
| 模板中 | 自动解包，不需要 .value | 直接使用 |
| 重新赋值 | ✅ \`ref.value = newVal\` | ❌ 直接赋值失去响应式 |
| 深层响应 | ✅ | ✅ |

### reactive 的陷阱

**1. 解构丢失响应式**
\`\`\`javascript
const state = reactive({ count: 0, name: 'Tom' })
const { count } = state  // ❌ count 不再是响应式
count++  // 不触发更新

// ✅ 解决：toRefs
const { count, name } = toRefs(state)
count.value++  // 响应式
\`\`\`

**2. 重新赋值丢失响应式**
\`\`\`javascript
let state = reactive({ list: [] })
state = reactive({ list: [1, 2] })  // ❌ 新对象不是代理

// ✅ 解决：修改属性
state.list = [1, 2]

// ✅ 或用 ref
const state = ref({ list: [] })
state.value = { list: [1, 2] }  // ✅
\`\`\`

### 什么时候用 ref

\`\`\`javascript
// 原始类型
const count = ref(0)
const text = ref('')

// 需要整体替换的对象
const user = ref(null)
user.value = await fetchUser()  // ✅

// DOM 引用
const inputRef = ref(null)
\`\`\`

### 什么时候用 reactive

\`\`\`javascript
// 一组相关的状态
const form = reactive({
  username: '',
  password: '',
  remember: false
})

// 不需要整体替换的对象
const config = reactive({
  api: '/api/v1',
  timeout: 5000
})
\`\`\`

### 最佳实践
- **简单值（数字、字符串、布尔）** → ref
- **需要替换的对象（如 API 返回的数据）** → ref
- **一组相关状态** → reactive + toRefs
- **不确定** → ref（更安全、更一致）

### 模板中的自动解包
\`\`\`vue
<template>
  <!-- ref 自动解包，不需要 .value -->
  <div>{{ count }}</div>
  <div>{{ state.count }}</div>
</template>
\`\`\``
  },
  {
    id: 'fw-018',
    category: 'vue',
    module: 'framework',
    difficulty: 'hard',
    tags: ['Vue3', '响应式', 'Proxy', '原理'],
    question: 'Vue3 响应式系统的原理是什么？和 Vue2 有什么区别？',
    answer: `### Vue3 响应式原理

Vue3 使用 \`Proxy\` 实现响应式，核心流程：

\`\`\`
读取属性 → track(收集依赖)
修改属性 → trigger(触发更新)
\`\`\`

### reactive 实现（简化版）

\`\`\`javascript
const targetMap = new WeakMap() // 存储依赖关系
let activeEffect = null

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (dep) dep.forEach(effect => effect())
}

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    }
  })
}
\`\`\`

### effect 实现

\`\`\`javascript
function effect(fn) {
  activeEffect = fn
  fn() // 执行时触发 get → track
  activeEffect = null
}

// 使用
const state = reactive({ count: 0 })
effect(() => {
  console.log('count:', state.count) // 首次执行，track 收集依赖
})
state.count = 1 // trigger → 重新执行 effect → 输出 'count: 1'
\`\`\`

### ref 实现

\`\`\`javascript
function ref(value) {
  return {
    get value() {
      track(this, 'value')
      return value
    },
    set value(newVal) {
      value = newVal
      trigger(this, 'value')
    }
  }
}
\`\`\`

### Vue2 vs Vue3

| 特性 | Vue2 (Object.defineProperty) | Vue3 (Proxy) |
|------|---------------------------|--------------|
| 监听新增属性 | ❌ 需要 \`Vue.set\` | ✅ 自动 |
| 监听删除属性 | ❌ 需要 \`Vue.delete\` | ✅ 自动 |
| 监听数组索引 | ❌ 需要 hack | ✅ 自动 |
| 监听数组长度 | ❌ | ✅ |
| Map/Set 支持 | ❌ | ✅ |
| 深层监听 | 初始化时递归 | 懒代理（访问时才代理） |
| 性能 | 初始化慢 | 初始化快 |
| 兼容性 | IE9+ | 不支持 IE |

### Vue2 的数组 hack
\`\`\`javascript
// Vue2 需要重写数组方法
const arrayMethods = Object.create(Array.prototype)
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = Array.prototype[method].apply(this, args)
    // 手动触发更新
    notifyChange(this)
    return result
  }
})
\`\`\`

### Vue3 深层响应式（懒代理）

\`\`\`javascript
// Vue3 只有在访问深层属性时才创建代理
const state = reactive({ user: { name: 'Tom' } })
// state.user 在首次访问时才被 reactive 包装
// 比 Vue2 初始化时递归遍历所有属性更高效
\`\`\`

### Vue3 的优势
1. Proxy 原生支持新增/删除属性
2. 原生支持数组操作
3. 支持 Map/Set/WeakMap
4. 懒代理，性能更好
5. 代码更简洁`
  },
  {
    id: 'fw-019',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', 'computed', 'watch', 'watchEffect'],
    question: 'Vue3 中 computed、watch、watchEffect 的区别？',
    answer: `### computed（计算属性）

基于其他响应式数据派生新值，**有缓存**，只有依赖变化时才重新计算。

\`\`\`javascript
const count = ref(0)
const double = computed(() => count.value * 2)
// 只有 count 变化时 double 才重新计算
// 多次访问 double 只计算一次（缓存）

// 可写 computed
const fullName = computed({
  get: () => \`\${first.value} \${last.value}\`,
  set: (val) => {
    [first.value, last.value] = val.split(' ')
  }
})
\`\`\`

### watch（侦听器）

监听响应式数据变化，执行副作用。**需要明确指定监听目标**，有旧值和新值。

\`\`\`javascript
// 监听 ref
watch(count, (newVal, oldVal) => {
  console.log(\`count: \${oldVal} → \${newVal}\`)
})

// 监听 reactive 属性（需要 getter 函数）
watch(() => state.count, (newVal, oldVal) => {
  console.log(newVal)
})

// 监听多个
watch([count, () => state.name], ([newCount, newName]) => {
  console.log(newCount, newName)
})

// 配置选项
watch(count, callback, {
  immediate: true,  // 立即执行一次
  deep: true,       // 深度监听
  flush: 'post'     // DOM 更新后执行
})
\`\`\`

### watchEffect（立即执行侦听器）

**自动收集依赖**，不需要指定监听目标。**立即执行一次**，然后依赖变化时重新执行。

\`\`\`javascript
// 自动追踪 count 和 name
watchEffect(() => {
  console.log(count.value, name.value)
})

// 清理副作用
watchEffect((onCleanup) => {
  const timer = setInterval(() => {
    console.log(count.value)
  }, 1000)
  onCleanup(() => clearInterval(timer))
})
\`\`\`

### 对比

| 特性 | computed | watch | watchEffect |
|------|----------|-------|-------------|
| 返回值 | ✅ 返回新值 | ❌ | ❌ |
| 缓存 | ✅ | ❌ | ❌ |
| 立即执行 | ❌ | 默认❌（可 immediate） | ✅ |
| 指定监听 | 自动收集 | ✅ 手动指定 | 自动收集 |
| 获取旧值 | ❌ | ✅ | ❌ |
| 适合 | 派生数据 | 需要旧值的副作用 | 简单副作用 |

### 使用场景

\`\`\`javascript
// computed：派生数据
const filteredList = computed(() => 
  list.value.filter(item => item.includes(keyword.value))
)

// watch：需要旧值或精确控制
watch(selectedId, (newId, oldId) => {
  if (newId !== oldId) fetchData(newId)
}, { immediate: true })

// watchEffect：简单副作用
watchEffect(() => {
  document.title = \`\${count.value} items\`
})
\`\`\`

### 性能注意
- computed 有缓存，优先使用
- watch 的 \`deep: true\` 性能开销大，谨慎使用
- watchEffect 自动追踪依赖，但不够显式`
  },
  {
    id: 'fw-020',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', '生命周期', 'onMounted'],
    question: 'Vue3 的生命周期钩子有哪些？和 Vue2 有什么变化？',
    answer: `### Vue3 生命周期（Composition API）

\`\`\`javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onActivated,
  onDeactivated
} from 'vue'
\`\`\`

### 完整流程

\`\`\`
挂载阶段：
  setup() → onBeforeMount → DOM 挂载 → onMounted

更新阶段：
  数据变化 → onBeforeUpdate → DOM 更新 → onUpdated

卸载阶段：
  onBeforeUnmount → onUnmounted

KeepAlive：
  onActivated（激活）/ onDeactivated（停用）

错误处理：
  onErrorCaptured
\`\`\`

### Vue2 vs Vue3 对比

| Vue2 | Vue3 (Composition API) | 说明 |
|------|----------------------|------|
| beforeCreate | setup() | 已被 setup 取代 |
| created | setup() | 已被 setup 取代 |
| beforeMount | onBeforeMount | 挂载前 |
| mounted | onMounted | 挂载后 |
| beforeUpdate | onBeforeUpdate | 更新前 |
| updated | onUpdated | 更新后 |
| beforeDestroy | onBeforeUnmount | 卸载前（改名） |
| destroyed | onUnmounted | 卸载后（改名） |
| activated | onActivated | KeepAlive 激活 |
| deactivated | onDeactivated | KeepAlive 停用 |
| errorCaptured | onErrorCaptured | 错误捕获 |

### 使用示例

\`\`\`javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
\`\`\`

### 关键变化
1. \`beforeCreate\` / \`created\` → 直接在 \`setup()\` 中编写
2. \`destroy\` 相关改名为 \`unmount\`（语义更准确）
3. 生命周期函数在 \`setup\` 中**同步**调用
4. 可以在同一组件中多次调用同一钩子：
\`\`\`javascript
onMounted(() => console.log('first'))
onMounted(() => console.log('second')) // ✅ 合法
\`\`\`

### 新增钩子
- \`onServerPrefetch\`：SSR 专用，服务端预取数据
- \`onRenderTracked\`：调试用，渲染时追踪依赖（开发模式）
- \`onRenderTriggered\`：调试用，触发渲染时调用（开发模式）`
  },
  {
    id: 'fw-021',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', '组件通信', 'provide/inject'],
    question: 'Vue3 组件通信有哪些方式？',
    answer: `### 1. Props / Emits（父子）

\`\`\`vue
<!-- Parent -->
<template>
  <Child :message="msg" @update="handleUpdate" />
</template>

<!-- Child -->
<script setup>
const props = defineProps(['message'])
const emit = defineEmits(['update'])

emit('update', newValue)
</script>
\`\`\`

### 2. v-model（双向绑定）

\`\`\`vue
<!-- Vue3 支持多个 v-model -->
<Child v-model:title="title" v-model:content="content" />

<!-- Child -->
<script setup>
const props = defineProps(['title', 'content'])
const emit = defineEmits(['update:title', 'update:content'])
</script>
\`\`\`

### 3. provide / inject（跨层级）

\`\`\`javascript
// 祖先组件
import { provide, ref } from 'vue'

const theme = ref('dark')
provide('theme', theme)  // 提供响应式数据

// 任意后代组件
import { inject } from 'vue'
const theme = inject('theme')  // 接收

// 带默认值
const config = inject('config', { default: true })

// 只读
import { readonly } from 'vue'
provide('theme', readonly(theme))
\`\`\`

### 4. ref（父调子方法）

\`\`\`vue
<!-- Parent -->
<template>
  <Child ref="childRef" />
  <button @click="childRef.focus()">Focus</button>
</template>

<!-- Child -->
<script setup>
import { ref } from 'vue'
const inputRef = ref(null)

// 暴露方法给父组件
defineExpose({
  focus: () => inputRef.value?.focus(),
  clear: () => { /* ... */ }
})
</script>
\`\`\`

### 5. mitt（事件总线）

\`\`\`javascript
// eventBus.js
import mitt from 'mitt'
export const bus = mitt()

// 组件 A
bus.emit('custom-event', data)

// 组件 B
import { onMounted, onUnmounted } from 'vue'
onMounted(() => bus.on('custom-event', handler))
onUnmounted(() => bus.off('custom-event', handler))
\`\`\`

### 6. Pinia（全局状态管理）

\`\`\`javascript
// store/user.js
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const setName = (n) => name.value = n
  return { name, setName }
})

// 任何组件
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
userStore.setName('Tom')
\`\`\`

### 对比

| 方式 | 场景 | 复杂度 |
|------|------|--------|
| Props/Emits | 父子 | 低 |
| v-model | 父子双向 | 低 |
| provide/inject | 跨层级 | 中 |
| ref + defineExpose | 父调子 | 中 |
| mitt | 任意组件 | 低 |
| Pinia | 全局状态 | 中 |

### Vue3 变化
- 移除了 \`$children\`（改用 ref）
- 移除了 \`$on\` / \`$off\` / \`$once\`（实例不再实现事件接口）
- \`defineExpose\` 替代 Vue2 的直接访问子组件方法`
  },
  {
    id: 'fw-022',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', '插槽', 'slot'],
    question: 'Vue3 中插槽（Slot）有哪些类型？如何使用？',
    answer: `### 1. 默认插槽

\`\`\`vue
<!-- 子组件 Card.vue -->
<template>
  <div class="card">
    <slot></slot> <!-- 父组件传入的内容渲染在这里 -->
  </div>
</template>

<!-- 父组件 -->
<Card>
  <p>这是卡片内容</p>
</Card>
\`\`\`

### 2. 具名插槽

\`\`\`vue
<!-- 子组件 Layout.vue -->
<template>
  <div>
    <header><slot name="header"></slot></header>
    <main><slot></slot></main>  <!-- 默认插槽 -->
    <footer><slot name="footer"></slot></footer>
  </div>
</template>

<!-- 父组件 -->
<Layout>
  <template #header>
    <h1>标题</h1>
  </template>

  <p>主要内容</p>  <!-- 默认插槽 -->

  <template #footer>
    <p>底部信息</p>
  </template>
</Layout>
\`\`\`

### 3. 作用域插槽（子传父数据）

\`\`\`vue
<!-- 子组件 List.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<!-- 父组件 -->
<List :items="users">
  <template #default="{ item, index }">
    <span>{{ index }}. {{ item.name }}</span>
  </template>
</List>

<!-- 或简写 -->
<List :items="users">
  <template="{ item }">
    <span>{{ item.name }}</span>
  </template>
</List>
\`\`\`

### 4. 动态插槽名

\`\`\`vue
<template #[dynamicSlotName]>
  <p>动态插槽内容</p>
</template>
\`\`\`

### 5. 插槽默认内容

\`\`\`vue
<!-- 子组件 -->
<template>
  <slot>默认内容，父组件不传时显示</slot>
</template>
\`\`\`

### 使用 useSlots()

\`\`\`vue
<script setup>
import { useSlots } from 'vue'
const slots = useSlots()

// 判断插槽是否存在
if (slots.header) {
  // 有 header 插槽
}
</script>
\`\`\`

### 实际应用：可复用表格组件

\`\`\`vue
<!-- Table.vue -->
<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <td v-for="col in columns" :key="col.key">
          <!-- 每列都可以自定义渲染 -->
          <slot :name="col.key" :row="row" :value="row[col.key]">
            {{ row[col.key] }}  <!-- 默认显示值 -->
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<!-- 使用 -->
<Table :columns="columns" :data="list">
  <template #status="{ row }">
    <span :class="row.status">{{ row.status }}</span>
  </template>
  <template #action="{ row }">
    <button @click="edit(row)">编辑</button>
  </template>
</Table>
\`\`\``
  },
  {
    id: 'fw-023',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', 'keep-alive', '缓存'],
    question: 'Vue 中 keep-alive 的作用和使用方式？',
    answer: `\`<keep-alive>\` 用于缓存组件实例，避免重复渲染，保留组件状态。

### 基本用法

\`\`\`vue
<template>
  <!-- 缓存动态组件 -->
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>

  <!-- 配合路由 -->
  <keep-alive>
    <router-view />
  </keep-alive>
</template>
\`\`\`

### 属性

\`\`\`vue
<!-- include：只缓存匹配的组件 -->
<keep-alive :include="['UserList', 'Dashboard']">
  <router-view />
</keep-alive>

<!-- exclude：不缓存匹配的组件 -->
<keep-alive :exclude="['Login']">
  <router-view />
</keep-alive>

<!-- max：最多缓存数量（LRU 算法） -->
<keep-alive :max="10">
  <router-view />
</keep-alive>
\`\`\`

### 生命周期

被 keep-alive 缓存的组件有额外的生命周期：

\`\`\`javascript
import { onActivated, onDeactivated } from 'vue'

// 组件从缓存激活时调用
onActivated(() => {
  console.log('组件被激活')
  // 恢复滚动位置、重新请求数据等
})

// 组件被缓存（停用）时调用
onDeactivated(() => {
  console.log('组件被缓存')
  // 暂停定时器、保存状态等
})
\`\`\`

### 实际应用

**1. 列表页 → 详情页 → 返回列表页（保持滚动位置和筛选状态）**

\`\`\`vue
<!-- App.vue -->
<keep-alive :include="cachedViews">
  <router-view />
</keep-alive>
\`\`\`

\`\`\`javascript
// 通过路由 meta 控制
const routes = [
  {
    path: '/list',
    component: List,
    meta: { keepAlive: true }  // 需要缓存
  },
  {
    path: '/detail/:id',
    component: Detail,
    meta: { keepAlive: false }
  }
]
\`\`\`

**2. 标签页切换保持状态**

\`\`\`vue
<keep-alive>
  <component :is="activeTab" />
</keep-alive>
\`\`\`

### 注意事项

1. **keep-alive 只缓存有 name 的组件**
\`\`\`vue
<script setup>
// 需要 defineOptions 设置 name
defineOptions({ name: 'UserList' })
</script>
\`\`\`

2. **内存管理**：缓存的组件保留在内存中，\`max\` 属性限制数量

3. **数据更新问题**：缓存后再次激活不会触发 \`onMounted\`，需要在 \`onActivated\` 中处理数据刷新

\`\`\`javascript
onActivated(() => {
  // 每次激活时检查是否需要刷新数据
  if (needRefresh.value) {
    fetchData()
  }
})
\`\`\`

4. **Vue3 变化**：\`<keep-alive>\` 的 \`include/exclude\` 支持字符串、正则、数组`
  },
  {
    id: 'fw-024',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', 'nextTick', 'DOM更新'],
    question: 'Vue 中 nextTick 的作用是什么？原理是什么？',
    answer: `### 作用

Vue 的 DOM 更新是**异步**的（批量处理），\`nextTick\` 用于在 DOM 更新完成后执行回调。

\`\`\`javascript
import { ref, nextTick } from 'vue'

const message = ref('')

async function updateMessage() {
  message.value = 'updated'
  console.log(document.getElementById('msg').textContent) // '' （DOM 还没更新）

  await nextTick()
  console.log(document.getElementById('msg').textContent) // 'updated' （DOM 已更新）
}
\`\`\`

### 为什么需要 nextTick

Vue 将数据变化后的 DOM 更新放到**微任务队列**中批量执行，避免频繁操作 DOM：

\`\`\`
数据变化 → 加入更新队列 → 当前同步代码继续执行 → 微任务执行 → DOM 更新
\`\`\`

所以数据变化后立即读取 DOM 拿到的是旧值，需要 \`nextTick\` 等待 DOM 更新。

### 使用场景

**1. 数据变化后操作 DOM**
\`\`\`javascript
const showInput = ref(false)

async function toggleAndFocus() {
  showInput.value = true
  await nextTick()
  // DOM 更新后才能获取到 input 元素
  inputRef.value.focus()
}
\`\`\`

**2. 获取更新后的元素尺寸**
\`\`\`javascript
const items = ref([])

async function addItem() {
  items.value.push(newItem)
  await nextTick()
  // 获取列表最新高度
  const height = listEl.value.scrollHeight
  listEl.value.scrollTop = height  // 滚动到底部
}
\`\`\`

**3. 确保子组件已更新**
\`\`\`javascript
const data = ref([])

async function refresh() {
  data.value = await fetchData()
  await nextTick()
  // 子组件已用新数据渲染完成
  childRef.value.doSomething()
}
\`\`\`

### 原理

Vue 的更新机制使用微任务（Promise.then）：

\`\`\`javascript
// 简化版
const callbacks = []
let pending = false

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice()
  callbacks.length = 0
  copies.forEach(cb => cb())
}

function nextTick(cb) {
  callbacks.push(cb)
  if (!pending) {
    pending = true
    Promise.resolve().then(flushCallbacks) // 微任务
  }
}

// Vue 内部数据变化时也会调用 nextTick 安排更新
function queueUpdate() {
  nextTick(flushUpdateQueue)
}
\`\`\`

### Vue 的异步更新策略

\`\`\`javascript
// 多次修改数据，只触发一次更新
state.count = 1
state.count = 2
state.count = 3
// 最终只渲染一次，count = 3
\`\`\`

### Vue2 vs Vue3
- Vue2：优先 \`Promise.then\` → \`MutationObserver\` → \`setImmediate\` → \`setTimeout\`
- Vue3：直接使用 \`Promise.resolve().then()\`（不再降级，需要支持 Promise）`
  },
  {
    id: 'fw-025',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', '指令', 'directive'],
    question: 'Vue 中自定义指令如何编写？有哪些常用场景？',
    answer: `### 自定义指令

\`\`\`javascript
// 全局注册
const app = createApp(App)

app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 局部注册
<script setup>
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<!-- 使用 -->
<input v-focus />
\`\`\`

### 指令钩子

\`\`\`javascript
app.directive('my-directive', {
  // 元素挂载前
  created(el, binding, vnode) {},
  // 元素挂载前（CSS 已确定）
  beforeMount(el, binding) {},
  // 挂载后
  mounted(el, binding) {},
  // 更新前
  beforeUpdate(el, binding) {},
  // 更新后
  updated(el, binding) {},
  // 卸载前
  beforeUnmount(el, binding) {},
  // 卸载后
  unmounted(el, binding) {}
})
\`\`\`

### binding 对象

\`\`\`javascript
{
  value: '传递的值',       // v-my="value"
  oldValue: '旧值',         // 更新时的旧值
  arg: 'foo',              // v-my:foo
  modifiers: { lazy: true }, // v-my.lazy
  dir: { /* 指令定义对象 */ }
}
\`\`\`

### 常用自定义指令示例

**1. v-loading（加载中）**
\`\`\`javascript
app.directive('loading', {
  mounted(el, binding) {
    el.style.position = 'relative'
    const mask = document.createElement('div')
    mask.className = 'loading-mask'
    mask.style.display = binding.value ? 'flex' : 'none'
    el.appendChild(mask)
    el._loadingMask = mask
  },
  updated(el, binding) {
    if (el._loadingMask) {
      el._loadingMask.style.display = binding.value ? 'flex' : 'none'
    }
  }
})
\`\`\`

**2. v-debounce（防抖点击）**
\`\`\`javascript
app.directive('debounce', {
  mounted(el, binding) {
    let timer = null
    el.addEventListener('click', () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
      }, 500)
    })
  }
})
// <button v-debounce="handleClick">Click</button>
\`\`\`

**3. v-permission（权限控制）**
\`\`\`javascript
app.directive('permission', {
  mounted(el, binding) {
    if (!hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
})
// <button v-permission="'admin'">删除</button>
\`\`\`

**4. v-copy（复制到剪贴板）**
\`\`\`javascript
app.directive('copy', {
  mounted(el, binding) {
    el.style.cursor = 'pointer'
    el.addEventListener('click', () => {
      navigator.clipboard.writeText(binding.value)
      showToast('已复制')
    })
  }
})
// <span v-copy="text">{{ text }}</span>
\`\`\`

**5. v-lazy（图片懒加载）**
\`\`\`javascript
app.directive('lazy', {
  mounted(el, binding) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.src = binding.value
        observer.unobserve(el)
      }
    })
    observer.observe(el)
    el._observer = observer
  },
  unmounted(el) {
    el._observer?.disconnect()
  }
})
// <img v-lazy="imageSrc" />
\`\`\`

### Vue3 变化
- 钩子名称改变：\`bind\` → \`beforeMount\`，\`unbind\` → \`unmounted\`
- \`<script setup>\` 中以 \`v\` 开头的变量自动识别为指令`
  },

  // ========== 状态管理 ==========
  {
    id: 'fw-026',
    category: 'state-management',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Redux', '状态管理', 'React'],
    question: 'Redux 的工作流程是什么？Redux Toolkit 有什么改进？',
    answer: `### Redux 三大原则

1. **单一数据源**：整个应用只有一个 store
2. **状态只读**：只能通过 dispatch action 修改
3. **纯函数修改**：reducer 必须是纯函数

### 工作流程

\`\`\`
View dispatch(action) → Reducer(state, action) → New State → View 更新
\`\`\`

### 传统 Redux

\`\`\`javascript
// Action Types
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

// Action Creators
const increment = () => ({ type: INCREMENT })
const decrement = () => ({ type: DECREMENT })

// Reducer
function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case INCREMENT: return { ...state, count: state.count + 1 }
    case DECREMENT: return { ...state, count: state.count - 1 }
    default: return state
  }
}

// Store
const store = createStore(counter)

// 使用
store.dispatch(increment())
\`\`\`

### Redux Toolkit（RTK）

RTK 是官方推荐的编写方式，大幅简化代码：

\`\`\`javascript
import { createSlice, configureStore } from '@reduxjs/toolkit'

// 一个 slice 包含 reducer + actions
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    // RTK 内部使用 Immer，可以直接"修改"状态
    increment: (state) => { state.count += 1 },
    decrement: (state) => { state.count -= 1 },
    incrementBy: (state, action) => { state.count += action.payload }
  }
})

// 自动生成 actions
export const { increment, decrement, incrementBy } = counterSlice.actions

// 配置 store
const store = configureStore({
  reducer: { counter: counterSlice.reducer }
})
\`\`\`

### React 中使用

\`\`\`jsx
import { useSelector, useDispatch } from 'react-redux'

function Counter() {
  const count = useSelector(state => state.counter.count)
  const dispatch = useDispatch()

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementBy(5))}>+5</button>
    </div>
  )
}
\`\`\`

### RTK 的改进

| 特性 | 传统 Redux | Redux Toolkit |
|------|-----------|----------------|
| 样板代码 | 多 | 少 |
| 不可变更新 | 手动展开 | Immer 自动处理 |
| Action Creator | 手动写 | 自动生成 |
| 异步处理 | redux-thunk/saga | createAsyncThunk |
| TypeScript | 需要大量类型 | 自动推断 |

### createAsyncThunk（异步）

\`\`\`javascript
const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  const res = await api.getUser(id)
  return res.data
})

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.status = 'loading' })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchUser.rejected, (state) => { state.status = 'failed' })
  }
})
\`\`\`

### 什么时候用 Redux
- 大型应用，状态复杂
- 需要时间旅行调试
- 多个不相关组件共享状态
- 中小型项目可以考虑 Zustand / Jotai 等更轻量的方案`
  },
  {
    id: 'fw-027',
    category: 'state-management',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Pinia', '状态管理', 'Vue3'],
    question: 'Pinia 和 Vuex 的区别？为什么 Vue3 推荐用 Pinia？',
    answer: `### Pinia 基本用法

\`\`\`javascript
// stores/counter.js
import { defineStore } from 'pinia'

// 组合式写法（推荐）
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, double, increment }
})
\`\`\`

\`\`\`javascript
// 组件中使用
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
console.log(counter.count)
counter.increment()

// 解构需要 storeToRefs 保持响应式
import { storeToRefs } from 'pinia'
const { count, double } = storeToRefs(counter)
const { increment } = counter // 方法不需要 storeToRefs
\`\`\`

### Pinia vs Vuex

| 特性 | Vuex 4 | Pinia |
|------|--------|-------|
| 模块 | 需要 modules 嵌套 | 每个 store 独立平级 |
| Mutations | 需要（修改状态） | ❌ 不需要，直接修改 |
| TypeScript | 支持差 | 优秀（类型自动推断）|
| Composition API | 有限支持 | 原生支持 |
| 体积 | 较大 | ~1KB |
| 开发者工具 | 支持 | 支持（更好）|
| 学习成本 | 中 | 低 |
| SSR | 复杂 | 简单 |

### 为什么不用 Mutations

Vuex 要求通过 mutations 修改状态，因为要配合 devtools 追踪：

\`\`\`javascript
// Vuex
mutations: {
  SET_COUNT(state, payload) { state.count = payload }
}
actions: {
  increment({ commit }) { commit('SET_COUNT', count + 1) }
}

// Pinia：直接修改
const increment = () => { count.value++ }
// Pinia 仍然可以被 devtools 追踪
\`\`\`

### Pinia 的 Store 模块化

\`\`\`javascript
// 每个文件一个 store，不需要 modules
// stores/user.js
export const useUserStore = defineStore('user', () => { ... })

// stores/cart.js
export const useCartStore = defineStore('cart', () => { ... })

// stores/settings.js
export const useSettingsStore = defineStore('settings', () => { ... })

// 互相调用
const userStore = useUserStore()
const cartStore = useCartStore()
\`\`\`

### 异步操作

\`\`\`javascript
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)

  async function fetchUser(id) {
    loading.value = true
    try {
      user.value = await api.getUser(id)
    } finally {
      loading.value = false
    }
  }

  return { user, loading, fetchUser }
})
\`\`\`

### 持久化

\`\`\`javascript
import { persist } from 'pinia-plugin-persistedstate'

export const useUserStore = defineStore('user', () => {
  // ...
}, {
  persist: true  // 自动同步到 localStorage
})
\`\`\`

### 总结
- Pinia 是 Vue3 官方推荐的状态管理库
- 更简洁、更好的 TS 支持、更小的体积
- 如果项目从 Vuex 迁移，可以逐步迁移（Pinia 和 Vuex 可以共存）`
  },
  {
    id: 'fw-028',
    category: 'state-management',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Zustand', '状态管理', 'React'],
    question: 'Zustand 是什么？相比 Redux 有什么优势？',
    answer: `\`Zustand\` 是一个轻量级 React 状态管理库，API 简洁，不需要 Provider 包裹。

### 基本用法

\`\`\`javascript
import { create } from 'zustand'

const useStore = create((set, get) => ({
  count: 0,
  name: 'Tom',
  
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  
  // 可以获取当前 state
  reset: () => set({ count: 0, name: 'Tom' }),
  
  // 异步操作不需要额外中间件
  fetchUser: async (id) => {
    const user = await api.getUser(id)
    set({ user })
  }
}))

// 组件中使用
function Counter() {
  const count = useStore(state => state.count)
  const increment = useStore(state => state.increment)
  
  return <button onClick={increment}>{count}</button>
}

// 也可以解构（不会重渲染问题）
const { count, increment } = useStore()
\`\`\`

### 选择性订阅（性能优化）

\`\`\`javascript
// 只订阅 count，name 变化不触发重渲染
const count = useStore(state => state.count)

// 多个值
const { count, name } = useStore(state => ({
  count: state.count,
  name: state.name
}), shallow) // 需要 shallow 比较

// 使用 selector
const doubleCount = useStore(state => state.count * 2)
\`\`\`

### 中间件

\`\`\`javascript
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

const useStore = create(
  devtools(  // Redux DevTools 支持
    persist(  // localStorage 持久化
      (set) => ({
        theme: 'light',
        toggleTheme: () => set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        }))
      }),
      { name: 'app-storage' }
    )
  )
)
\`\`\`

### 跨组件共享

\`\`\`javascript
// 不需要 Provider，直接使用
// 任何组件都能访问
function Header() {
  const theme = useStore(state => state.theme)
  return <header className={theme}>...</header>
}

function Settings() {
  const toggleTheme = useStore(state => state.toggleTheme)
  return <button onClick={toggleTheme}>Toggle</button>
}
\`\`\`

### 对比 Redux

| 特性 | Redux | Zustand |
|------|-------|---------|
| 样板代码 | 多 | 极少 |
| Provider | 需要 | 不需要 |
| 不可变更新 | 必须 | 可选（可用 Immer）|
| 异步 | 需要 thunk/saga | 直接 async/await |
| 包体积 | ~2KB + RTK | ~1KB |
| TypeScript | 好（RTK） | 优秀 |
| 学习成本 | 中 | 低 |

### 对比 Context

\`\`\`javascript
// Context：任何 context 值变化，所有消费者都重渲染
const AppContext = createContext()
// ❌ 大量组件订阅同一个 context 会有性能问题

// Zustand：精确订阅
const count = useStore(state => state.count) // 只有 count 变化才重渲染
\`\`\`

### 什么时候用 Zustand
- 中小型 React 项目
- 不想用 Redux 的样板代码
- 需要全局状态但不想用 Context
- 需要精确的状态订阅

### 与其他轻量方案对比
- **Jotai**：原子化状态，适合细粒度
- **Valtio**：Proxy 代理，类似 Vue 的响应式
- **Zustand**：类似 Redux 的单一 store，但更简洁`
  },
  {
    id: 'fw-029',
    category: 'state-management',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'Context', '性能'],
    question: 'React Context 的原理和性能问题是什么？如何优化？',
    answer: `### Context 基本用法

\`\`\`jsx
const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  )
}

function Child() {
  const theme = useContext(ThemeContext)
  return <div>{theme}</div> // 'dark'
}
\`\`\`

### 原理

1. Provider 的 value 变化时，React 会**重新渲染所有消费该 Context 的组件**
2. 即使子组件被 \`React.memo\` 包裹，Context 变化也会**跳过 memo 直接渲染**

### 性能问题

**问题：Provider value 每次渲染都是新对象，导致所有消费者重渲染**

\`\`\`jsx
// ❌ 每次渲染都创建新对象
function App() {
  const [count, setCount] = useState(0)
  
  return (
    <UserContext.Provider value={{ user, logout }}>
      {/* count 变化时，即使用户信息没变，消费 UserContext 的组件也会重渲染 */}
      <ExpensiveTree />
    </UserContext.Provider>
  )
}
\`\`\`

### 优化方案

**1. useMemo 缓存 value**

\`\`\`jsx
function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)

  const value = useMemo(() => ({ user, logout }), [user])

  return (
    <UserContext.Provider value={value}>
      <ExpensiveTree />
    </UserContext.Provider>
  )
}
\`\`\`

**2. 拆分 Context**

\`\`\`jsx
// 将频繁变化的和不变的分开
const UserContext = createContext()      // 不常变化
const ThemeContext = createContext()     // 偶尔变化
const CartContext = createContext()      // 频繁变化

// 各自独立 Provider
<UserContext.Provider value={userValue}>
  <ThemeContext.Provider value={themeValue}>
    <CartContext.Provider value={cartValue}>
      <App />
    </CartContext.Provider>
  </ThemeContext.Provider>
</UserContext.Provider>
\`\`\`

**3. use-context-selector（第三方库）**

\`\`\`jsx
import { createContext, useContextSelector } from 'use-context-selector'

const UserContext = createContext()

function Name() {
  // 只订阅 user.name，其他属性变化不触发
  const name = useContextSelector(UserContext, state => state.name)
  return <div>{name}</div>
}
\`\`\`

**4. 状态下放**

\`\`\`jsx
// ❌ count 在 Provider 外面，变化不影响 Provider
function App() {
  return (
    <UserContext.Provider value={value}>
      <Counter /> {/* count 变化不影响其他消费者 */}
    </UserContext.Provider>
  )
}

const Counter = React.memo(() => {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
})
\`\`\`

### 什么时候用 Context
- ✅ 主题、用户信息、语言等**低频变化**的全局状态
- ✅ 依赖注入（如路由、Store）
- ❌ 频繁变化的状态（购物车、实时数据）→ 用 Zustand/Jotai

### 替代方案对比

| 方案 | 适合场景 | 性能 |
|------|----------|------|
| Context | 低频全局状态 | 中（需优化）|
| Zustand | 通用全局状态 | 好 |
| Jotai | 细粒度原子状态 | 优秀 |
| Redux | 大型复杂应用 | 好 |`
  },
  {
    id: 'fw-030',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'Router', '路由'],
    question: 'React Router v6 的核心概念和常用 API？',
    answer: `### 基本路由配置

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
\`\`\`

### 导航

\`\`\`jsx
// 声明式导航
<Link to="/about">About</Link>
<NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
  About
</NavLink>

// 编程式导航
function Component() {
  const navigate = useNavigate()
  
  navigate('/about')
  navigate(-1)        // 后退
  navigate('/users/1', { replace: true })  // 替换历史
}
\`\`\`

### 获取路由参数

\`\`\`jsx
import { useParams, useSearchParams, useLocation } from 'react-router-dom'

function UserDetail() {
  const { id } = useParams()  // /users/:id → { id: '123' }
  const [searchParams] = useSearchParams()  // ?name=Tom → { name: 'Tom' }
  const location = useLocation()  // { pathname, search, hash }
  
  return <div>User {id}</div>
}
\`\`\`

### 嵌套路由（Outlet）

\`\`\`jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Dashboard() {
  return (
    <div>
      <nav>
        <Link to="/dashboard">Home</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
      <Outlet /> {/* 子路由渲染在这里 */}
    </div>
  )
}
\`\`\`

### 路由守卫

\`\`\`jsx
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

<Route path="/admin" element={
  <ProtectedRoute><Admin /></ProtectedRoute>
} />
\`\`\`

### 懒加载路由

\`\`\`jsx
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

<Routes>
  <Route path="/" element={
    <Suspense fallback={<Loader />}><Home /></Suspense>
  } />
</Routes>
\`\`\`

### v5 vs v6 变化

| 特性 | v5 | v6 |
|------|-----|-----|
| 路由组件 | \`<Switch>\` | \`<Routes>\` |
| 路由匹配 | \`<Route component>\` | \`<Route element>\` |
| 嵌套路由 | 配置复杂 | \`<Outlet>\` 简洁 |
| 编程式导航 | \`useHistory\` | \`useNavigate\` |
| 路由参数 | \`useParams\` | \`useParams\`（相同）|
| 路径匹配 | 宽松 | 严格（更精确）|

### 高级特性

\`\`\`jsx
// useLoaderData（React Router 6.4+ 数据加载）
const data = useLoaderData()

// useOutlet 获取当前 outlet
const outlet = useOutlet()

// useMatch 匹配当前路径
const match = useMatch('/users/:id')
\`\`\``
  },

  // ========== 更多框架面试题 ==========
  {
    id: 'fw-031',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue', 'Diff', '虚拟DOM', '原理'],
    question: 'Vue 的虚拟 DOM Diff 算法是怎样的？',
    answer: `### Vue Diff 策略

Vue 的 Diff 算法基于**同层比较**，使用**双端比较**（Vue2）和**最长递增子序列**（Vue3）优化。

### Vue2 双端比较

使用 4 个指针：旧头、旧尾、新头、新尾

\`\`\`
旧：[A, B, C, D]
     ↑head    ↑tail
新：[D, A, B, C]
     ↑head    ↑tail

比较过程：
1. 旧头 vs 新头 → A vs D ✗
2. 旧尾 vs 新尾 → D vs C ✗
3. 旧头 vs 新尾 → A vs C ✗
4. 旧尾 vs 新头 → D vs D ✓ → 移动 D 到前面
重复直到完成
\`\`\`

### Vue3 快速 Diff + 最长递增子序列

Vue3 改进了 Diff 算法：

1. **从头同步**：从头部开始，遇到不同的就停止
2. **从尾同步**：从尾部开始，遇到不同的就停止
3. **处理中间部分**：
   - 如果新节点多 → 挂载新节点
   - 如果旧节点多 → 卸载旧节点
   - 如果都有 → 使用**最长递增子序列**最小化 DOM 移动

\`\`\`
旧：[A, B, C, D, E]
新：[A, D, C, B, E]

头部同步：A ✓
尾部同步：E ✓
中间：旧 [B, C, D] → 新 [D, C, B]

新中间在旧中间的位置：[3, 2, 1]（D=3, C=2, B=1）
最长递增子序列：[2, 1]（C, B 不需要移动）
只需移动 D
\`\`\`

### Key 的作用

\`\`\`javascript
// 有 key：精确匹配，最小化 DOM 操作
// 旧：[{key:1, v:A}, {key:2, v:B}]
// 新：[{key:2, v:B}, {key:1, v:A}]
// 结果：移动节点，不销毁重建

// 无 key：按位置比较，内容不同就更新
// 旧：[A, B]
// 新：[B, A]
// 结果：A→B（更新DOM），B→A（更新DOM），2次DOM操作
\`\`\`

### Vue vs React Diff

| 特性 | Vue | React |
|------|-----|-------|
| 同层比较 | ✅ | ✅ |
| Key | ✅ 必须 | ✅ 必须 |
| 算法 | 双端/最长递增子序列 | 右侧遍历 |
| 移动优化 | 最小移动 | 按需移动 |
| 复杂度 | O(n) | O(n) |

### Vue3 的优化
1. **静态提升**：静态节点只创建一次
2. **PatchFlag**：编译时标记动态节点，Diff 时只比较动态部分
3. **Block Tree**：将动态节点拍平为数组，跳过静态节点
4. **缓存事件处理器**：内联函数只创建一次

\`\`\`javascript
// 编译后的渲染函数带有 PatchFlag
createVNode('div', { class: 'static' }, 'hello', PatchFlags.TEXT)
// Diff 时只比较 text，跳过 class
\`\`\``
  },
  {
    id: 'fw-032',
    category: 'ssr-ssg',
    module: 'render',
    difficulty: 'medium',
    tags: ['React', 'SSR', 'Next.js', '服务端渲染'],
    question: '什么是 SSR（服务端渲染）？React 中如何实现？',
    answer: `### CSR vs SSR vs SSG

| 方式 | 说明 | 优势 | 劣势 |
|------|------|------|------|
| **CSR** | 客户端渲染 | 交互流畅 | 首屏慢、SEO 差 |
| **SSR** | 服务端渲染 | 首屏快、SEO 好 | 服务器负载高 |
| **SSG** | 静态生成 | 最快、CDN 友好 | 内容固定 |
| **ISR** | 增量静态生成 | 兼顾速度和动态性 | 配置复杂 |

### React SSR 基本流程

\`\`\`
1. 服务器接收请求
2. 执行 React 组件 → 生成 HTML 字符串
3. 返回 HTML（包含初始数据）
4. 浏览器显示 HTML（首屏可见）
5. 浏览器加载 JS
6. Hydration：JS 接管页面，变成可交互
\`\`\`

### 原生 React SSR

\`\`\`javascript
// server.js
import { renderToString } from 'react-dom/server'

app.get('/', (req, res) => {
  const data = await fetchData()
  const html = renderToString(
    <App initialData={data} />
  )
  res.send(\`
    <html>
      <body>
        <div id="root">\${html}</div>
        <script>window.__INITIAL_DATA__ = \${JSON.stringify(data)}</script>
        <script src="/client.js"></script>
      </body>
    </html>
  \`)
})
\`\`\`

### Next.js（推荐方案）

\`\`\`javascript
// App Router (Next.js 13+)
// app/page.js
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()
  return <div>{json.title}</div>
}

// 动态路由
// app/posts/[id]/page.js
export default async function Post({ params }) {
  const post = await getPost(params.id)
  return <article>{post.content}</article>
}

// 客户端组件
'use client'
import { useState } from 'react'
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
\`\`\`

### Hydration（水合）

\`\`\`javascript
// 客户端代码
import { hydrateRoot } from 'react-dom/client'

// 不是 createRoot（会重新渲染），而是 hydrateRoot（复用 DOM）
hydrateRoot(document.getElementById('root'), <App initialData={window.__INITIAL_DATA__} />)
\`\`\`

### Hydration Mismatch

如果服务端和客户端渲染结果不一致，React 会警告并重新渲染：

\`\`\`javascript
// ❌ 服务端和客户端可能不同
function Time() {
  return <div>{new Date().toLocaleTimeString()}</div>
}

// ✅ 先渲染占位，客户端挂载后再显示
function Time() {
  const [time, setTime] = useState(null)
  useEffect(() => {
    setTime(new Date().toLocaleTimeString())
  }, [])
  return <div>{time || 'Loading...'}</div>
}
\`\`\`

### 何时用 SSR
- ✅ 内容型网站（博客、电商、新闻）→ SEO 重要
- ✅ 首屏性能要求高的页面
- ❌ 后台管理系统 → CSR 足够
- ❌ 高交互应用（如编辑器）→ CSR 更合适

### React Server Components（RSC）
React 18 引入的服务端组件：
- 在服务端渲染，不发送到客户端
- 可以直接访问数据库/文件系统
- 0 KB 客户端 JS 体积
- Next.js App Router 默认就是 RSC`
  },
  {
    id: 'fw-033',
    category: 'nuxtjs',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue', 'SSR', 'Nuxt'],
    question: 'Vue 的 SSR（Nuxt.js）原理和适用场景？',
    answer: `### Nuxt 3 基本结构

\`\`\`
pages/
  index.vue       → /
  about.vue       → /about
  users/[id].vue  → /users/:id

server/
  api/            → API 路由

nuxt.config.ts    → 配置
\`\`\`

### 自动路由

\`\`\`vue
<!-- pages/index.vue -->
<template>
  <div>Home Page</div>
</template>

<!-- pages/users/[id].vue -->
<script setup>
const route = useRoute()
const { id } = route.params
</script>
\`\`\`

### 数据获取

\`\`\`javascript
// useFetch — 自动序列化、去重、缓存
const { data: users } = await useFetch('/api/users')

// useAsyncData — 自定义数据获取
const { data } = await useAsyncData('users', () => {
  return $fetch('/api/users')
})

// 服务端获取数据，客户端水合
\`\`\`

### 渲染模式

\`\`\`javascript
// nuxt.config.ts
export default defineNuxtConfig({
  // 默认 SSR
  ssr: true,
  
  // 或混合渲染
  routeRules: {
    '/': { prerender: true },          // 静态生成
    '/blog/**': { ssr: true },         // 服务端渲染
    '/admin/**': { ssr: false },       // SPA 模式
    '/api/**': { cors: true }          // API 路由
  }
})
\`\`\`

### Vue SSR 原理

\`\`\`javascript
// server-entry.js
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

export async function render(url) {
  const app = createSSRApp(App)
  const router = createRouter({ history: createMemoryHistory() })
  app.use(router)
  
  await router.push(url)
  await router.isReady()
  
  const html = await renderToString(app)
  return html
}
\`\`\`

### Hydration

\`\`\`javascript
// client-entry.js
import { createSSRApp } from 'vue'

const app = createSSRApp(App)
app.use(router)
app.mount('#app')
// Vue 自动检测已有 DOM，进行 hydration（复用 DOM 而非重新渲染）
\`\`\`

### Nuxt vs Next 对比

| 特性 | Nuxt 3 | Next 13+ |
|------|--------|----------|
| 框架 | Vue 3 | React 18 |
| 路由 | 文件系统 | 文件系统 |
| 数据获取 | useFetch/useAsyncData | server components |
| API 路由 | server/api | app/api |
| 渲染模式 | 混合 | 混合 |
| 开发体验 | 零配置 | 零配置 |

### 适用场景
- ✅ 内容网站（博客、电商、文档）
- ✅ 需要 SEO 的应用
- ✅ 首屏性能要求高
- ❌ 后台管理系统
- ❌ 需要复杂客户端交互的应用`
  },
  {
    id: 'fw-034',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', 'Vue', '对比'],
    question: 'React 和 Vue 的设计理念有什么不同？',
    answer: `### 核心理念对比

| 维度 | React | Vue |
|------|-------|-----|
| 编程范式 | 函数式 | 响应式 + 声明式 |
| 数据流 | 单向 | 双向绑定（v-model）|
| 模板 vs JSX | JSX | 模板 + JSX（可选）|
| 状态管理 | 不可变 | 可变（Proxy 代理）|
| 组件抽象 | 函数 + Hooks | SFC（单文件组件）|
| 编译优化 | 运行时（React Compiler 改善中）| 编译时（静态提升、PatchFlag）|

### 数据变化检测

**React — 不可变 + 虚拟 DOM Diff**
\`\`\`jsx
// React：创建新对象触发更新
const [list, setList] = useState([])
setList([...list, newItem]) // 必须创建新引用

// React 不知道什么变了，需要 Diff 整棵树
\`\`\`

**Vue — 响应式 + 精确追踪**
\`\`\`javascript
// Vue：直接修改触发更新
const list = ref([])
list.value.push(newItem) // 直接修改

// Vue 知道具体哪个属性变了，精确更新
\`\`\`

### 模板 vs JSX

**Vue 模板** — 受限语法，编译时优化：
\`\`\`vue
<template>
  <div>{{ message }}</div>
  <button @click="handleClick">Click</button>
</template>
\`\`\`
- 编译时可以做静态分析、静态提升、PatchFlag
- 更接近 HTML，学习门槛低
- 灵活性有限

**React JSX** — JavaScript 表达力：
\`\`\`jsx
<div>
  {condition && <Child />}
  {list.map(item => <Item key={item.id} {...item} />)}
</div>
\`\`\`
- 完整的 JavaScript 能力
- 编译时优化困难（JSX 太灵活）
- React Compiler 正在改善

### 编译时优化

**Vue3 的编译优化：**
\`\`\`javascript
// 编译器知道哪些是动态的
// 静态节点只创建一次
const _hoisted_1 = createElementVNode("div", null, "静态文本")

// PatchFlag 标记动态部分
createVNode("div", null, msg, 1 /* TEXT */)
// Diff 时只比较 text，跳过其他
\`\`\`

**React** — 运行时 Diff（React Compiler 改善中）：
\`\`\`jsx
// React 需要运行时比较整个虚拟 DOM 树
// React 19 的 Compiler 会自动 memo 化
\`\`\`

### 组件复用

**React — Hooks**
\`\`\`jsx
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => { /* ... */ }, [])
  return pos
}
// 简洁、组合灵活
\`\`\`

**Vue — Composables**
\`\`\`javascript
function useMouse() {
  const pos = reactive({ x: 0, y: 0 })
  onMounted(() => { /* ... */ })
  return pos
}
// 类似 Hooks，但基于响应式系统
\`\`\`

### 总结
- **React**：函数式、JSX、不可变、灵活、生态大
- **Vue**：响应式、模板、渐进式、编译优化、上手快
- 两者都在互相借鉴：React 学编译优化，Vue 学 Hooks`
  },
  {
    id: 'fw-035',
    category: 'micro-frontend',
    module: 'render',
    difficulty: 'medium',
    tags: ['微前端', '架构', 'qiankun'],
    question: '什么是微前端？有哪些实现方案？',
    answer: `**微前端**是将大型前端应用拆分为多个独立的小应用，各自开发、部署、运行。

### 为什么需要微前端

- **巨石应用难以维护**：一个项目几百万行代码
- **独立部署**：各团队独立发布
- **技术栈无关**：不同子应用可以用不同框架
- **增量迁移**：逐步从旧框架迁移到新框架

### 实现方案

### 1. qiankun（基于 single-spa）

\`\`\`javascript
// 主应用
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container: '#sub-app',
    activeRule: '/react'
  },
  {
    name: 'vue-app',
    entry: '//localhost:7101',
    container: '#sub-app',
    activeRule: '/vue'
  }
])

start()
\`\`\`

**原理**：通过 JS 沙箱加载子应用，路由匹配时挂载子应用。

### 2. Module Federation（Webpack 5）

\`\`\`javascript
// 子应用 webpack.config.js
new ModuleFederationPlugin({
  name: 'remoteApp',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/Button'
  },
  shared: ['react', 'react-dom']
})

// 主应用
new ModuleFederationPlugin({
  name: 'hostApp',
  remotes: {
    remoteApp: 'remoteApp@http://localhost:7100/remoteEntry.js'
  }
})

// 使用远程组件
const RemoteButton = React.lazy(() => import('remoteApp/Button'))
\`\`\`

### 3. iframe（最简单但最隔离）

\`\`\`html
<iframe src="http://localhost:7100" />
\`\`\`
- ✅ 完全隔离（JS、CSS、路由）
- ❌ 性能差、通信困难、UX 差（弹窗被限制在 iframe 内）

### 4. Web Components

\`\`\`javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = \`<style>:host { color: red }</style><div>Custom</div>\`
  }
}
customElements.define('my-component', MyComponent)
\`\`\`

### 5. NPM 包（组件级微前端）

\`\`\`javascript
// 将组件发布为 npm 包
import SharedButton from '@team/button'
\`\`\`
- ✅ 简单、类型安全
- ❌ 需要重新构建发布、不能独立部署

### 方案对比

| 方案 | 隔离性 | 独立部署 | 通信 | 性能 | 复杂度 |
|------|--------|----------|------|------|--------|
| qiankun | JS 沙箱 | ✅ | postMessage | 中 | 中 |
| Module Federation | 部分 | ✅ | 直接调用 | 好 | 中 |
| iframe | 完全 | ✅ | postMessage | 差 | 低 |
| Web Components | Shadow DOM | ✅ | 属性/事件 | 好 | 高 |
| NPM 包 | 无 | ❌ | 直接调用 | 最好 | 最低 |

### 什么场景用微前端
- ✅ 大型企业应用，多团队协作
- ✅ 需要技术栈迁移（Vue2 → Vue3）
- ✅ 多个独立产品需要整合为一个门户
- ❌ 中小型项目（过度设计）
- ❌ 简单的组件复用（用 NPM 包即可）

### 常见问题
1. **CSS 隔离**：Shadow DOM 或 CSS Modules
2. **JS 沙箱**：Proxy 代理 window
3. **通信**：CustomEvent、postMessage、全局状态
4. **路由**：基座应用统一管理路由`,
  },
  {
    id: 'fw-036',
    category: 'react',
    module: 'framework',
    difficulty: 'medium',
    tags: ['React', '主题切换', '暗黑模式', 'Context', 'CSS变量'],
    question: '在 React 中如何实现亮色 / 暗色主题切换？',
    answer: `推荐「**CSS 变量 + Context + 根节点 class**」的方案，性能好、可动态换肤。

### 1. 用 CSS 变量定义两套主题

\`\`\`css
:root { --bg: #fff; --text: #111; }
:root.dark { --bg: #111; --text: #fff; }
.app { background: var(--bg); color: var(--text); }
\`\`\`

### 2. 用 Context 管理主题状态并切换根节点 class

\`\`\`jsx
const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  )

  useEffect(() => {
    document.documentElement.className = theme  // 切换到 <html class="dark">
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme,
      toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light')
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
\`\`\`

### 其他方案
- **CSS-in-JS（styled-components）**：用 \`ThemeProvider\` 注入 theme 对象，适合动态主题。
- **next-themes**：Next.js 项目直接用，处理 SSR 闪烁（FOUC）很方便。

### 注意点
- **避免 SSR 闪烁**：在 \`<head>\` 内联一段脚本提前设置 \`html\` 的 class（next-themes 已处理）。
- 切换时加 \`transition\` 可做平滑过渡，但注意性能。
- 组件内不要写死颜色，统一用 CSS 变量，否则换肤不生效。`
  },
  {
    id: 'fw-037',
    category: 'vue',
    module: 'framework',
    difficulty: 'medium',
    tags: ['Vue3', '主题切换', '暗黑模式', 'provide/inject', 'CSS变量'],
    question: '在 Vue3 中如何实现亮色 / 暗色主题切换？',
    answer: `Vue3 同样推荐「**CSS 变量 + 根节点 class + provide/inject**」。

### 1. CSS 变量定义主题（同 React 思路）

\`\`\`css
:root { --bg: #fff; --text: #111; }
:root.dark { --bg: #111; --text: #fff; }
\`\`\`

### 2. 用 Composition API + provide/inject 管理

\`\`\`js
// useTheme.js
import { ref, watch } from 'vue'

export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'light')

  watch(theme, (val) => {
    document.documentElement.className = val
    localStorage.setItem('theme', val)
  }, { immediate: true })

  const toggle = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  return { theme, toggle }
}
\`\`\`

\`\`\`vue
<!-- App.vue -->
<script setup>
import { provide } from 'vue'
import { useTheme } from './useTheme'
const { theme, toggle } = useTheme()
provide('theme', theme)
provide('toggleTheme', toggle)
</script>

<template>
  <button @click="toggle">切换主题（当前：{{ theme }}）</button>
  <slot />
</template>
\`\`\`

### 注意
- 子组件通过 \`inject('theme')\` 读取，无需逐层传 props。
- 组件样式全部走 CSS 变量，不要在 \`<style>\` 里写死颜色，否则换肤失效。
- 若用 scoped 样式，CSS 变量仍作用在根作用域，不受影响。`
  },
]
