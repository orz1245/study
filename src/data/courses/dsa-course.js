export const dsaCourseMeta = {
  "id": "dsa",
  "title": "JS 数据结构与算法",
  "subtitle": "用 JS 把经典数据结构与算法从头实现一遍，不追求题海：理解每种结构为什么存在、适合解决什么问题，让日常编码与面试都有章法可循。",
  "level": "进阶 → 面试",
  "icon": "🧮",
  "color": "#6366f1",
  "practiceCategory": "algorithm",
  "chapters": [
    {
      "key": "complexity",
      "name": "第一章 · 复杂度分析",
      "lessons": [
        "dsa-l1",
        "dsa-l2",
        "dsa-l3"
      ]
    },
    {
      "key": "linear",
      "name": "第二章 · 线性数据结构",
      "lessons": [
        "dsa-l4",
        "dsa-l5",
        "dsa-l6",
        "dsa-l7"
      ]
    },
    {
      "key": "hashstr",
      "name": "第三章 · 哈希与字符串算法",
      "lessons": [
        "dsa-l8",
        "dsa-l9",
        "dsa-l10"
      ]
    },
    {
      "key": "treeheap",
      "name": "第四章 · 树与堆",
      "lessons": [
        "dsa-l11",
        "dsa-l12",
        "dsa-l13",
        "dsa-l14"
      ]
    },
    {
      "key": "graph",
      "name": "第五章 · 图",
      "lessons": [
        "dsa-l15",
        "dsa-l16"
      ]
    },
    {
      "key": "sortbin",
      "name": "第六章 · 排序与二分",
      "lessons": [
        "dsa-l17",
        "dsa-l18",
        "dsa-l19"
      ]
    },
    {
      "key": "dp",
      "name": "第七章 · 动态规划与回溯",
      "lessons": [
        "dsa-l20",
        "dsa-l21"
      ]
    },
    {
      "key": "advanced",
      "name": "第八章 · 用算法实现高级功能",
      "lessons": [
        "dsa-l22",
        "dsa-l23",
        "dsa-l24",
        "dsa-l25",
        "dsa-l26"
      ]
    }
  ]
}

export const dsaLessons = [
  {
    "id": "dsa-l1",
    "chapter": "complexity",
    "title": "大 O 表示法与时间复杂度分析",
    "minutes": 50,
    "content": "### 本节目标\n- 理解大 O 表示法的数学含义与工程意义\n- 掌握常见时间复杂度的\"长相\"与判断方法\n- 学会分析循环、递归、嵌套结构的复杂度\n\n**为什么需要复杂度**：同一问题往往有多种解法，我们需要一把\"与机器快慢无关\"的尺子来比较算法优劣。大 O 描述的是**当数据规模 n 增长时，运行时间增长的\"阶\"**，它会忽略常数与低阶项。换句话说，大 O 不关心\"跑 2 毫秒还是 3 毫秒\"，只关心\"n 变成 100 倍时，时间变成多少倍\"。\n\n**常见复杂度（从快到慢）**：\n\n```text\nO(1)       常数级     哈希查找、数组按下标访问\nO(log n)   对数级     二分查找、平衡树查找\nO(n)       线性级     单层循环遍历\nO(n log n) 线性对数   快排 / 归并 / 堆排序（排序的\"天花板\"）\nO(n²)      平方级     双层循环（冒泡 / 选择 / 插入）\nO(2ⁿ)      指数级     无剪枝回溯（n 一大会爆炸）\nO(n!)      阶乘级     全排列枚举\n```\n\n**判断技巧：数\"执行次数随 n 变化的循环\"**。下面这段代码把五种复杂度都跑了一遍，建议保存下来边看边想：\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l1.js，执行：node dsa-l1.js\n\n// O(1)：和 n 无关\nfunction getFirst(arr) { return arr[0] }\n\n// O(n)：循环正好执行 n 次\nfunction sum(arr) {\n  let s = 0\n  for (let i = 0; i < arr.length; i++) s += arr[i]\n  return s\n}\n\n// O(n²)：两层循环各 n 次\nfunction bubbleBad(arr) {\n  for (let i = 0; i < arr.length; i++)\n    for (let j = 0; j < arr.length - 1; j++)\n      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]\n}\n\n// O(log n)：规模每次减半\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1          // 中间下标\n    if (arr[mid] === target) return mid\n    if (arr[mid] < target) lo = mid + 1 // 去右半边\n    else hi = mid - 1                   // 去左半边\n  }\n  return -1\n}\n\n// O(n log n)：外层减半 × 内层线性（归并/快排主循环）\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr\n  const mid = arr.length >> 1\n  const L = mergeSort(arr.slice(0, mid))   // 左半递归\n  const R = mergeSort(arr.slice(mid))      // 右半递归\n  return merge(L, R)                       // 合并两个有序数组 O(n)\n}\nfunction merge(L, R) {\n  const out = []\n  let i = 0, j = 0\n  while (i < L.length && j < R.length) out.push(L[i] <= R[j] ? L[i++] : R[j++])\n  return out.concat(L.slice(i), R.slice(j))\n}\n\n// 调用示例\nconsole.log(sum([1, 2, 3, 4]))            // 10\nconsole.log(binarySearch([1, 3, 5, 7], 5)) // 2\nconsole.log(mergeSort([3, 1, 4, 2]))        // [1, 2, 3, 4]\n```\n\n**递归复杂度两公式（主定理简化版）**：\n\n```text\n① T(n) = T(n/2) + O(1)    → O(log n)   二分递归，如二分查找\n② T(n) = 2T(n/2) + O(n)   → O(n log n) 分治，如归并/快排\n③ T(n) = T(n-1) + O(1)    → O(n)       线性递归，如阶乘\n④ T(n) = 2T(n-1) + O(1)   → O(2ⁿ)      斐波那契朴素递归，指数级！\n```\n\n**斐波那契的教训**：朴素递归 `fib(n)=fib(n-1)+fib(n-2)` 是 O(2ⁿ)；加记忆化（memo）后变成 O(n)——这正是动态规划的雏形（第七章细讲）。\n\n**工程注意**：分析复杂度先找\"最内层循环\"，再看它随 n 怎么变；多个循环相加取最大，嵌套相乘。\n\n### 硬件级视角：CPU 缓存局部性、分支预测与大 O 常数项\n\n很多初学者误以为算法分析只看渐进大 O，但在现代多核 CPU 硬件架构下，**常数项（Constant Factor）与缓存友好度（Cache Locality）**往往能让理论复杂度相同的算法出现数倍乃至数十倍的速度差距：\n\n| 硬件交互机制 | 对算法性能的实质影响 | 典型数据结构表现 |\n| :--- | :--- | :--- |\n| **CPU L1/L2/L3 高速缓存行（64 字节）** | 连续物理内存访问可触发硬件预取器（Hardware Prefetcher），命中耗时 ~1ns；随机指针跳跃导致 Cache Miss 耗时 ~100ns（主存访问） | 连续数组（Array）缓存命中率极高；链表节点因离散分配频繁引发 Cache Miss |\n| **CPU 分支预测器（Branch Predictor）** | 预测正确时流水线顺畅执行；预测失败触发流水线清空（Pipeline Flush），惩罚 10～20 个时钟周期 | 对已排序数组的 `if (arr[i] > 128)` 过滤速度比乱序数组快 3～5 倍 |\n| **算法主定理（Master Theorem）** | 递归分治复杂度通用计算公式：$T(n) = aT(n/b) + f(n)$ | 比较 $n^{\\log_b a}$ 与 $f(n)$ 增长速度，快速判定分治算法上界 |\n\n### 名词解释\n- **大 O 表示法（Big O Notation）**：描述算法复杂度随数据规模 n 增长的\"上界阶数\"。它不是精确耗时，而是\"n 很大时谁更快\"的比较尺。常见等级 O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)。方法：忽略常数、低阶项与底数的常数倍。\n- **时间复杂度（Time Complexity）**：算法运行时间随输入规模增长的趋势。类比：O(1) 像\"无论房间多大，你都能瞬间拿到门口的伞\"；O(n) 像\"要逐个数完 n 个人\"；O(n²) 像\"每两个人都要握一次手\"。\n\n### 课后练习\n1. 手写二分查找 `binarySearch`，并说明它的复杂度为什么是 O(log n)。\n   - 答案：每次把搜索区间砍掉一半，区间长度从 n → n/2 → n/4 … 直到 1，需要约 log₂n 步，所以是 O(log n)。参考上面代码。\n2. 为什么朴素斐波那契是 O(2ⁿ)？如何降到 O(n)？\n   - 答案：`fib(n)` 会展开成两棵子树 `fib(n-1)` 和 `fib(n-2)`，大量子问题被重复计算，节点总数呈指数。加记忆化（用一个数组/对象缓存已算过的值）后每个数只算一次，变成 O(n)。\n\n### 总结\n复杂度分析不是背公式，而是一种\"先看增长趋势、再谈常数优化\"的工程直觉。很多人学算法卡在\"能写出代码但说不清快慢\"——其实只要养成习惯：写完一段循环就问自己\"它随 n 怎么变\"，就能甩开大多数初学者。O(1) 到 O(n log n) 是我们日常追求的目标区间，一旦掉到 O(n²) 就要警惕（除非 n 很小），而 O(2ⁿ)、O(n!) 基本只在没有更好办法的暴力枚举里出现。真正写好算法的人，脑子里永远有一把\"复杂度尺子\"，在写代码之前就先丈量了一遍。"
  },
  {
    "id": "dsa-l2",
    "chapter": "complexity",
    "title": "空间复杂度与时空权衡",
    "minutes": 40,
    "content": "### 本节目标\n- 掌握空间复杂度的分析方法\n- 理解\"空间换时间\"与\"时间换空间\"\n- 认识原地（in-place）算法与均摊分析\n\n**空间复杂度**：算法运行需要的**额外内存**随 n 增长的阶（通常不含输入本身）。和数据规模无关的固定变量是 O(1)，复制一份数组是 O(n)。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l2.js，执行：node dsa-l2.js\n\n// O(1)：只用了常数个变量\nfunction sum(arr) { let s = 0; for (const x of arr) s += x; return s }\n\n// O(n)：复制了一份数组\nfunction reverseCopy(arr) {\n  const out = []\n  for (let i = arr.length - 1; i >= 0; i--) out.push(arr[i])\n  return out\n}\n\n// O(n²)：二维矩阵\nfunction matrix(n) {\n  return Array.from({ length: n }, () => new Array(n).fill(0))\n}\n\n// 递归的空间 = 调用栈深度：factorial(1000) 会压 1000 层栈 → 空间 O(n)\nfunction factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1) }\n\n// 空间换时间：两数之和 暴力 O(n²) vs 哈希 O(n)\nfunction twoSum(nums, target) {\n  const seen = new Map()          // 额外空间 O(n)，换来 O(n) 时间\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i]\n    if (seen.has(need)) return [seen.get(need), i]\n    seen.set(nums[i], i)\n  }\n  return []\n}\n\nconsole.log(reverseCopy([1, 2, 3])) // [3, 2, 1]\nconsole.log(twoSum([2, 7, 11, 15], 9)) // [0, 1]\n```\n\n**原地算法（in-place）**：在输入数组上直接修改，额外空间 O(1)。例：双指针反转数组、快排分区、堆排序。\n\n**均摊分析（Amortized）**：某些操作偶尔很贵（如数组扩容），但把代价摊到每次操作上就是 O(1)。例：`push` 到 JS 数组是均摊 O(1)（动态扩容翻倍，偶尔 O(n) 拷贝，摊薄后常数）。\n\n**权衡决策**：面试和工程里优先保证时间达标；内存吃紧（大数据 / 低端设备）时再用空间换回来。学会说\"这里用 O(n) 空间把查找从 O(n²) 降到 O(n)\"。\n\n### V8 内存模型与空间复杂度的物理映射\n\n![V8 运行时内存拓扑与堆栈分配模型](/diagrams/v8-memory-layout.svg)\n\n在 JavaScript 引擎中，空间复杂度不仅仅是变量占了多少个格子，它直接映射到 V8 的分代托管堆内存与调用栈帧：\n\n| V8 内存分区 | 物理容量与分配策略 | 算法空间复杂度隐患 |\n| :--- | :--- | :--- |\n| **调用栈（Call Stack）** | 通常仅约 1MB（Node/V8 约 10,000 层深） | 未剪枝深层递归（如 `fib(50)`）导致 `Maximum call stack size exceeded` |\n| **新生代（New Space）** | 通常为 16MB～64MB，分 From/To 两个半空间 | 频繁创建大量临时小对象触发频繁的 Minor GC（Scavenge 拷贝） |\n| **老生代（Old Pointer/Data Space）** | 上限可达 1.4GB～4GB | 空间换时间（如巨型哈希表）导致对象晋升至老生代，引发耗时的老生代增量标记 GC |\n| **大对象区（Large Object Space）** | 分配超过普通页大小（~512KB）的对象 | 分配超大 TypedArray 时绕过新生代直接入堆，GC 从不移动大对象 |\n\n#### 空间复杂度实战：原地指针与滚动变量优化\n```javascript\n// 空间复杂度优化典范：斐波那契数列从 O(n) 空间降至 O(1)\nfunction fibOptimized(n) {\n  if (n <= 1) return n\n  let prev2 = 0\n  let prev1 = 1\n  for (let i = 2; i <= n; i++) {\n    const current = prev1 + prev2\n    prev2 = prev1\n    prev1 = current\n  }\n  return prev1\n}\nconsole.log('原地滚动变量空间复杂度 O(1)，绝无深层调用栈开销')\n```\n\n### 名词解释\n- **空间复杂度（Space Complexity）**：算法除输入外额外占用的内存随 n 增长的趋势。类比：租仓库——你自带 n 箱货不算，额外又租了几间房才是\"额外空间\"。\n- **原地算法（In-place Algorithm）**：直接在原数据结构上修改、几乎不申请额外空间的算法，空间 O(1)。优点是省内存，缺点是会破坏原数据（有时需要保留副本）。\n- **均摊分析（Amortized Analysis）**：把少数\"昂贵操作\"的代价平均分摊到一系列\"廉价操作\"上，得到每次操作的平均成本。典型：动态数组扩容。\n\n### 课后练习\n1. 原地反转数组（双指针，O(1) 空间）怎么写？\n   - 答案：`let l=0,r=arr.length-1; while(l<r){[arr[l++],arr[r--]]=[arr[r],arr[l]]}` —— 左右对撞交换，只用两个指针。\n2. 爬楼梯 DP 为什么空间能从 O(n) 降到 O(1)？\n   - 答案：`dp[i]=dp[i-1]+dp[i-2]` 只依赖前两项，不必保留整个数组，用两个滚动变量即可：`let a=1,b=1; for(...){[a,b]=[b,a+b]}`。\n\n### 总结\n时空权衡是算法世界最朴素也最深刻的辩证法：绝大多数性能优化的本质，都是\"用更多内存换更少时间\"，或者反过来在内存受限时\"用更多时间省下内存\"。一个成熟的工程师不会死守某一边，而是先问\"瓶颈到底是 CPU 还是内存\"。哈希表是最经典的\"空间换时间\"——它把 O(n) 查找压成 O(1)，代价是多存一份索引；而原地算法（如双指针反转）则是\"时间换空间\"的代表，几乎零额外内存。理解均摊分析还能破除一个常见误解：JS 数组 `push` 看似每次都追加，其实因为翻倍扩容策略，平均仍是 O(1)。学会这套权衡语言，你在面试里讲算法就不只是\"能跑\"，而是\"知道为什么这么设计\"。"
  },
  {
    "id": "dsa-l3",
    "chapter": "complexity",
    "title": "JS 引擎视角：数组与对象的底层",
    "minutes": 35,
    "content": "### 本节目标\n- 理解 JS 数组 / 对象在 V8 里的表示\n- 知道哪些操作\"看起来 O(1) 其实 O(n)\"\n- 会用性能测量验证直觉\n\n**JS 数组不是\"连续内存的定长数组\"**：V8 会根据使用方式在两种表示间切换。\n\n```text\n快数组（PACKED）：连续内存 + 元素类型一致 → 按下标访问 O(1)\n慢数组（字典模式）：退化成哈希表 → 按下标访问变慢\n```\n\n**退化触发条件**（性能陷阱）：`delete arr[5]`（制造空洞）、混入不同类型、稀疏赋值 `arr[100000]=1`。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l3.js，执行：node dsa-l3.js\n\n// 几个关键操作的\"真相\"\nconst truths = {\n  'arr[i]': 'O(1) 快数组下标',\n  'arr.push/pop': 'O(1) 均摊',\n  'arr.shift/unshift': 'O(n)！头部操作要搬移所有元素',\n  'arr.slice/splice': 'O(n) 拷贝/搬移',\n  'arr.includes/indexOf': 'O(n) 线性查找',\n  'arr.sort': '平均 O(n log n)，注意默认按字符串排序'\n}\nconsole.log(truths)\n\n// 性能测量：对比 shift 1e5 次 vs 头指针队列 1e5 次\nfunction bench(fn, label) {\n  const t0 = performance.now()\n  fn()\n  console.log(label, '耗时', (performance.now() - t0).toFixed(1) + 'ms')\n}\nfunction shiftVersion() {\n  const a = []; for (let i = 0; i < 1e5; i++) a.push(i)\n  while (a.length) a.shift()\n}\nfunction headPtrVersion() {\n  const a = []; let h = 0; for (let i = 0; i < 1e5; i++) a.push(i)\n  while (h < a.length) h++\n}\nbench(shiftVersion, 'shift 版')\nbench(headPtrVersion, '头指针版')\n\n// 排序一定要给比较器，否则 '10' < '2'\nconsole.log([10, 2, 30, 4].sort())          // [10, 2, 30, 4] 错误！\nconsole.log([10, 2, 30, 4].sort((a, b) => a - b)) // [2, 4, 10, 30]\n```\n\n**优化建议**：频繁头部增删用双端队列（手写或库），别用 shift；大量查找用 Set/Map（哈希 O(1)）；删除元素 `splice` 会搬移，\"把尾部换过来再 pop\"是 O(1) 技巧（乱序可接受时）。\n\n### 名词解释\n- **隐藏类（Hidden Class）**：V8 给\"结构相同\"的对象分配同一个隐藏类，属性访问通过偏移量直接定位（O(1)）。随意增删属性会让对象\"分裂\"成不同隐藏类，访问变慢。类比：图书馆给同类书同一排书架号，乱塞书就找不到。\n- **快数组 / 慢数组（Fast / Dictionary Mode）**：V8 数组的两种内部表示；连续同构时是快数组（快），出现空洞或类型混杂会退化成哈希表式的慢数组（慢）。\n- **均摊 O(1)**：见上节。push 因翻倍扩容，平均每次追加是常数时间。\n\n### 课后练习\n1. 实测 shift 与自定义头指针队列各 10 万次耗时，差距大约几个数量级？\n   - 答案：shift 每次 O(n)，10 万次约 O(n²)≈1e10 量级操作，会慢到几百毫秒甚至更久；头指针版是纯 O(n)，通常快 100 倍以上。上面 bench 可直接看到差距。\n2. 为什么 `arr.sort()` 对数字必须给 `(a,b)=>a-b`？\n   - 答案：默认把元素转成字符串再按字典序比较，`'10'<'2'`，导致数字排序错乱。比较器返回负数/0/正数告诉它真正的先后。\n\n### V8 数组存储要素（Elements Kinds）跃迁晶格与稀疏数组退化深水区\n\nV8 引擎为数组分配了多达 20 余种内部表示类型（Elements Kinds）。理解元素种类单向不可逆的**跃迁晶格（Lattice Transition）**，是避免高性能计算代码落入性能悬崖的基石：\n\n| 元素种类 (Elements Kind) | 内部物理存储形态 | 内存占用特征 | 下标寻址开销 | 典型触发操作与退化原因 |\n| :--- | :--- | :--- | :--- | :--- |\n| **`PACKED_SMI_ELEMENTS`** | 连续物理内存，仅存 31/63 位小整数（SMI） | 极低（无指针解引用，无堆对象分配） | **O(1) 绝对极速（单次硬件级基址偏移寻址）** | 初始化纯整型数组：`[1, 2, 3]` |\n| **`PACKED_DOUBLE_ELEMENTS`** | 连续物理内存，存 IEEE-754 浮点数值 | 低（64位平铺紧凑，无指针解引用） | O(1) 极快（浮点寄存器直读） | 向整数数组混入浮点数：`arr.push(1.5)` |\n| **`PACKED_ELEMENTS`** | 连续物理内存，存指针句柄（Tagged Pointers） | 中等（包含指向 JS 对象的指针解引用开销） | O(1) 良好（需一次内存指针寻址解包） | 混入字符串/对象：`arr.push('abc')` |\n| **`HOLEY_*_ELEMENTS`** | 带空洞的连续内存，未赋值槽位用 Hole 哨兵标记 | 中等偏高（需检查 Hole 哨兵并在原型链查找） | **较慢（命中空洞时触发原型链遍历查找）** | `new Array(10)` 或越界赋值 `arr[100] = 1` |\n| **`DICTIONARY_ELEMENTS`** | 退化为哈希表散列存储（NumberDictionary） | 高昂（键值对节点与散列桶元数据开销） | **慢（退化为哈希运算与链表冲突查找）** | `delete arr[p]` 破坏结构，或巨型稀疏跨度赋值 |\n\n```javascript\n// 运行环境：Node.js 14+\n// 实操：用基准对比验证从 PACKED_SMI 到 HOLEY 产生的 5 倍性能差距\n\nconst SIZE = 2_000_000\n\n// 1. 创建致密数组 (PACKED_SMI)：连续内存，无空洞，无浮点\nfunction benchmarkPacked() {\n  const arr = []\n  for (let i = 0; i < SIZE; i++) arr.push(i) // V8 维持 PACKED_SMI_ELEMENTS\n\n  const start = performance.now()\n  let sum = 0\n  for (let i = 0; i < SIZE; i++) sum += arr[i]\n  return { time: performance.now() - start, sum }\n}\n\n// 2. 创建带洞稀疏数组 (HOLEY_SMI)：new Array(N) 预分配产生 Hole 哨兵\nfunction benchmarkHoley() {\n  const arr = new Array(SIZE) // 产生 HOLEY_SMI_ELEMENTS 状态\n  for (let i = 0; i < SIZE; i++) arr[i] = i // 即使全填满，Kinds 也不会逆向退回 PACKED！\n\n  const start = performance.now()\n  let sum = 0\n  for (let i = 0; i < SIZE; i++) sum += arr[i] // 每次读取必须先核验是不是 TheHole 并在原型链寻值\n  return { time: performance.now() - start, sum }\n}\n\nconst resPacked = benchmarkPacked()\nconst resHoley = benchmarkHoley()\n\nconsole.log(`致密密集数组 (PACKED) 耗时: ${resPacked.time.toFixed(2)}ms`)\nconsole.log(`带洞数组 (HOLEY) 耗时: ${resHoley.time.toFixed(2)}ms (退化比率: ${(resHoley.time / resPacked.time).toFixed(1)}x)`)\n```\n\n\n### 总结\n知道\"数组在 JS 里本质是对象\"只是第一步，真正拉开差距的是理解 V8 的两种数组模式：连续同构时是 O(1) 的快数组，一旦出现空洞或类型混杂就退化成哈希表式的慢数组。这条知识直接决定你写的代码会不会\"看起来很简单、跑起来却很慢\"。最常被忽视的陷阱是 `shift/unshift`——很多人以为数组头部操作和尾部一样快，其实它是 O(n)，在循环里反复 shift 会让算法悄悄退化。养成用 `performance.now()` 实测的习惯比任何\"我以为\"都可靠：直觉会被打脸，数字不会。把\"引擎视角\"装进脑子，你写出的前端代码才会既正确又快。"
  },
  {
    "id": "dsa-l4",
    "chapter": "linear",
    "title": "数组与字符串进阶操作",
    "minutes": 45,
    "content": "### 本节目标\n- 掌握双指针、原地修改、区间处理三大数组技巧\n- 掌握字符串常用操作与字符频次统计\n- 会分析\"删除元素 / 合并区间\"类题目的边界\n\n**技巧一：双指针（快慢 / 左右）**——原地去重、移除元素的标准姿势。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l4.js，执行：node dsa-l4.js\n\n// 快慢指针：原地移除目标值，返回新长度\nfunction removeElement(nums, val) {\n  let slow = 0\n  for (let fast = 0; fast < nums.length; fast++) {\n    if (nums[fast] !== val) nums[slow++] = nums[fast] // 不等于 val 才保留\n  }\n  return slow // [0, slow) 是保留区\n}\n\n// 左右对撞：反转、两数之和有序版、回文判断\nfunction reverseArr(arr) {\n  let l = 0, r = arr.length - 1\n  while (l < r) [arr[l++], arr[r--]] = [arr[r], arr[l]]\n}\n\n// 调用示例\nconst a = [3, 2, 2, 3]\nconsole.log(removeElement(a, 3), a) // 2 [2, 2, 3, 3]（前 2 个有效）\nconst b = [1, 2, 3, 4]\nreverseArr(b); console.log(b) // [4, 3, 2, 1]\n```\n\n**技巧二：覆盖式原地修改**——不删除元素，用写入指针覆盖即可。\n\n**技巧三：区间合并**（面试高频）：\n\n```js\n// 合并重叠区间：先按起点排序，再逐个合并\nfunction merge(intervals) {\n  if (!intervals.length) return []\n  intervals.sort((a, b) => a[0] - b[0])\n  const res = [intervals[0]]\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1]\n    const cur = intervals[i]\n    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]) // 重叠则扩展右边界\n    else res.push(cur)\n  }\n  return res\n}\nconsole.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]])) // [[1,6],[8,10],[15,18]]\n```\n\n**字符串常用操作**：\n\n```js\n// 字符频次统计（字母异位词的判断手段）\nfunction countChars(s) {\n  const cnt = new Array(26).fill(0)\n  for (const ch of s) cnt[ch.charCodeAt(0) - 97]++\n  return cnt.join(',') // 作为\"频次指纹\"\n}\nconsole.log(countChars('aab') === countChars('aba')) // true（异位词）\n```\n\n**边界意识**：数组题先问\"是否允许修改原数组 / 额外空间 / 元素范围\"；写代码前列 2-3 个用例（空数组、单元素、重复元素）。\n\n### JavaScript 二进制缓冲区与 TypedArray 内存视图\n\n在现代前端渲染、音视频处理与高性能算法中，普通 JavaScript 数组无法满足固定内存与零 GC 开销的需求，**TypedArray 体系**提供了底层内存直接访问能力：\n\n| 视图类型 | 单元素字节数 | 对应 C 语言类型 | 典型算法应用 |\n| :--- | :--- | :--- | :--- |\n| **`Int32Array`** | 4 字节（32 位有符号整数） | `int32_t` | 图算法邻接表扁平化存储、并查集父节点索引数组 |\n| **`Uint8Array`** | 1 字节（8 位无符号整数） | `uint8_t` | 字符 ASCII 频率统计表、位图（BitMap）与 Bloom Filter |\n| **`Float64Array`** | 8 字节（双精度浮点） | `double` | 物理引擎几何矩阵、向量检索余弦相似度高维向量 |\n\n#### Boyer-Moore 坏字符启发式字符串搜索\n```javascript\n// 高性能字符串查找：Boyer-Moore 坏字符规则实现\nfunction boyerMooreSearch(text, pattern) {\n  const m = pattern.length\n  const n = text.length\n  if (m === 0) return 0\n  if (m > n) return -1\n\n  // 构建坏字符跳转表\n  const badChar = new Int32Array(256).fill(-1)\n  for (let i = 0; i < m; i++) {\n    badChar[pattern.charCodeAt(i)] = i\n  }\n\n  let shift = 0\n  while (shift <= n - m) {\n    let j = m - 1\n    // 从右往左匹配模式串\n    while (j >= 0 && pattern[j] === text[shift + j]) {\n      j--\n    }\n    if (j < 0) {\n      return shift // 匹配成功\n    }\n    // 根据坏字符规则计算跳跃步长\n    const mismatchChar = text.charCodeAt(shift + j)\n    shift += Math.max(1, j - (badChar[mismatchChar] ?? -1))\n  }\n  return -1\n}\n```\n\n### 名词解释\n- **双指针（Two Pointers）**：用两个索引在数组上\"协同游走\"的技巧。常见形态：快慢指针（一个找、一个写）、左右对撞（一头一尾向中间夹）。本质是用一次遍历完成本需两次的工作，把 O(n²) 降到 O(n)。\n- **区间（Interval）**：用 `[起点, 终点]` 表示的一段范围。区间合并是\"把重叠段拼成大段\"的贪心过程，核心是先排序再贪心扩展。\n- **字符频次指纹**：把字符串各字符出现次数拼成一个定长序列，两个串指纹相同则互为异位词（字母组成一样、顺序不同）。\n\n### 课后练习\n1. 原地移除数组重复项（有序数组，O(1) 空间）怎么写？\n   - 答案：快慢指针，slow 指\"已去重区末尾\"，`if(nums[fast]!==nums[slow]) nums[++slow]=nums[fast]`；初始 slow=0。返回 slow+1。\n2. 写 `merge(intervals)` 时如果输入是空数组会怎样？\n   - 答案：上面代码开头 `if(!intervals.length) return []` 直接返回空，避免 `intervals[0]` 取 undefined 报错。边界用例要覆盖。\n\n### 总结\n数组和字符串是算法题的\"主战场\"，而双指针是这片战场最通用的武器。它解决的核心矛盾是：很多题目表面上要求\"删除/去重/反转\"，但真正的难点是\"怎么在不额外开数组的前提下完成\"。快慢指针用\"写指针覆盖\"把删除变成 O(1) 空间，左右对撞把反转/回文/两数之和变成一次遍历。我常跟学员说：看到\"有序数组\"\"去重\"\"原地\"这几个词，脑子里就该立刻冒出双指针。区间合并则教会我们一个更重要的思维——先排序再贪心，往往能把混乱的 O(n²) 暴力化简成 O(n log n)。记住，数组题永远先问边界（空？单元素？重复？），列用例再动手，比写完调试省十倍时间。"
  },
  {
    "id": "dsa-l5",
    "chapter": "linear",
    "title": "链表：单链 / 双链 / 环形",
    "minutes": 50,
    "content": "### 本节目标\n- 理解链表节点结构与指针操作\n- 掌握反转、合并、环检测、找中间点四大经典题\n- 会用\"虚拟头节点\"简化边界处理\n\n**节点与基本操作**：\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l5.js，执行：node dsa-l5.js\n\nclass ListNode {\n  constructor(val, next = null) { this.val = val; this.next = next }\n}\n\n// 遍历\nfunction traverse(head) {\n  let cur = head\n  while (cur) { console.log(cur.val); cur = cur.next }\n}\n\n// 插入：先接后断（顺序不能反！）\nfunction insertAfter(prev, node) {\n  node.next = prev.next\n  prev.next = node\n}\n\n// 删除：跳过目标\nfunction deleteNext(prev) { if (prev.next) prev.next = prev.next.next }\n```\n\n**虚拟头节点（dummy）**：统一\"删除头节点\"和\"在头部插入\"的边界处理。\n\n```js\nfunction removeValue(head, val) {\n  const dummy = new ListNode(0, head) // 虚拟头，永远不动\n  let cur = dummy\n  while (cur.next) {\n    if (cur.next.val === val) cur.next = cur.next.next // 跳过\n    else cur = cur.next\n  }\n  return dummy.next // 真实新头\n}\n```\n\n**反转链表（迭代 + 递归）**：\n\n```js\nfunction reverse(head) {            // 迭代：三指针 prev/cur/next\n  let prev = null, cur = head\n  while (cur) {\n    const next = cur.next\n    cur.next = prev\n    prev = cur\n    cur = next\n  }\n  return prev\n}\nfunction reverseR(head) {           // 递归：子链反转后让原头指向新尾\n  if (!head || !head.next) return head\n  const newHead = reverseR(head.next)\n  head.next.next = head\n  head.next = null\n  return newHead\n}\n// 调用示例\nconst h = new ListNode(1, new ListNode(2, new ListNode(3)))\nconsole.log(reverse(h).val) // 3（反转后头是 3）\n```\n\n**环形检测（快慢指针 / 龟兔赛跑）**：\n\n```js\nfunction hasCycle(head) {\n  let slow = head, fast = head\n  while (fast && fast.next) {\n    slow = slow.next\n    fast = fast.next.next\n    if (slow === fast) return true\n  }\n  return false\n}\n```\n\n**找中间节点**：快慢指针，快走 2 慢走 1，快到底时慢在中间。**合并两个有序链表**（递归最优雅）：\n\n```js\nfunction mergeTwo(l1, l2) {\n  if (!l1) return l2\n  if (!l2) return l1\n  if (l1.val < l2.val) { l1.next = mergeTwo(l1.next, l2); return l1 }\n  l2.next = mergeTwo(l1, l2.next); return l2\n}\n// 调用示例\nconst l1 = new ListNode(1, new ListNode(3, new ListNode(5)))\nconst l2 = new ListNode(2, new ListNode(4, new ListNode(6)))\nconst merged = mergeTwo(l1, l2)\nconsole.log(merged.val) // 1（合并后新升序链表表头）\n```\n\n### 链表 vs 数组的底层内存拓扑与 Cache Line 碰撞\n\n理解链表的工程价值必须看清它在现代多级存储层次结构中的得失：\n\n| 评估维度 | 连续动态数组（Array） | 节点式链表（Linked List） |\n| :--- | :--- | :--- |\n| **物理存储形态** | 连续物理内存块，顺序排列 | 离散堆内存碎片，通过 `next` 指针串联 |\n| **头部插入时间复杂度** | $O(n)$（需整体搬移后续所有元素内存） | $O(1)$（只需改变哨兵指针） |\n| **随机按下标寻址** | $O(1)$（直接按基地址 + 索引 $\\times$ 步长计算） | $O(n)$（必须从头节点开始逐级跳跃遍历） |\n| **CPU 缓存命中率** | 极高（单次加载 64 字节 Cache Line 命中多项） | 极低（每次读取指针都可能引发外部主存延迟） |\n\n#### Floyd 判环算法（快慢指针）数学证明\n设链表头到环入口距离为 $a$，环入口到相遇点距离为 $b$，相遇点继续绕环回到入口距离为 $c$（环长为 $b+c$）。\n当快慢指针相遇时：\n- 慢指针路程：$S_{\\text{slow}} = a + b$\n- 快指针路程：$S_{\\text{fast}} = a + n(b + c) + b$\n- 因快指针速度是慢指针 2 倍：$2(a + b) = a + n(b + c) + b \\implies a = (n - 1)(b + c) + c$\n**结论**：此时让一个指针回到链表头，另一个指针留在相遇点，两指针以相同步长单步前移，**必在环入口处再次相遇**！\n\n### 名词解释\n- **链表（Linked List）**：由\"节点\"串成的线性结构，每个节点存数据 + 指向下一节点的指针。优点是插入/删除 O(1)（改指针即可），缺点是按下标访问 O(n)。类比：寻宝游戏，每张纸条写\"下一个线索在 B 抽屉\"，你得顺着找。\n- **虚拟头节点（Dummy Node）**：一个不存真实数据的\"假头\"，放在真实链表最前面。它让\"删头节点\"和\"删中间节点\"走同一条代码路径，消灭大量边界 `if`。\n- **快慢指针（龟兔赛跑）**：两个指针，一个走 1 步一个走 2 步。用于找中间点、判环——有环必相遇，因为快的总能套圈慢的。\n\n### 课后练习\n1. 反转链表两种写法都过一遍（leetcode 206）。\n   - 答案：迭代版见上 `reverse`；递归版见 `reverseR`。递归版先反转 `head.next` 子链得到 newHead，再让 `head.next.next = head` 把原头接成新尾。\n2. 找环形链表入口节点（142）的思路？\n   - 答案：相遇后，让一个指针从 head、另一个从相遇点同时每次走 1 步，再次相遇处即入口。这是因为 head 到入口的距离 = 相遇点到入口的距离（环内绕圈部分抵消）。\n\n### 总结\n链表是检验\"会不会真正操作指针\"的试金石。数组靠下标随机访问，链表靠 `next` 指针逐节游走，这个差别决定了它所有经典题的套路：反转靠三指针改写 `next`，判环靠快慢指针，合并靠递归。初学者最容易栽在\"插入时先接后断的顺序\"——一旦先断 `prev.next` 就丢了后半截链表，再也找不回来。虚拟头节点是我强烈推荐的\"偷懒\"技巧：它把头节点的特殊边界彻底抹平，让你只用一套循环处理所有情况。学链表千万别裸写代码，先在纸上画出节点和指针箭头，再翻译箭头变化成代码，正确率立刻翻倍。链表题做熟了，你对\"引用/指针\"的理解会上一个台阶，后面学树、图都更顺。"
  },
  {
    "id": "dsa-l6",
    "chapter": "linear",
    "title": "栈与队列：实现与经典应用",
    "minutes": 45,
    "content": "### 本节目标\n- 掌握栈的\"后进先出\"与队列的\"先进先出\"\n- 会用单调栈解决\"下一个更大元素\"类问题\n- 掌握循环队列与优先队列的思想\n\n**栈（LIFO）与队列（FIFO）**：\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l6.js，执行：node dsa-l6.js\n\n// 栈：数组 push/pop 即可（O(1) 均摊）\nconst stack = []\nstack.push(1); stack.pop()\n\n// 队列别用 shift（O(n)）！用\"头指针\"实现 O(1) 队列：\nfunction createQueue() {\n  const q = []\n  let head = 0\n  return {\n    enqueue(x) { q.push(x) },\n    dequeue() { return head < q.length ? q[head++] : undefined },\n    size() { return q.length - head },\n    isEmpty() { return head >= q.length }\n  }\n}\n```\n\n**栈的经典应用：有效括号、逆波兰表达式、函数调用栈**：\n\n```js\n// 有效括号：遇到左括号入栈，右括号弹栈匹配\nfunction isValid(s) {\n  const map = { ')': '(', ']': '[', '}': '{' }\n  const st = []\n  for (const ch of s) {\n    if (ch === '(' || ch === '[' || ch === '{') st.push(ch)\n    else if (st.pop() !== map[ch]) return false\n  }\n  return st.length === 0\n}\nconsole.log(isValid('()[]{}')) // true\n```\n\n**单调栈（Monotonic Stack）——\"下一个更大元素\"的标准解法**：维护\"栈内元素单调\"的栈，入栈时弹出破坏单调性的元素。\n\n```js\nfunction nextGreater(nums) {\n  const res = new Array(nums.length).fill(-1)\n  const st = [] // 存下标，栈底→栈顶 递减\n  for (let i = 0; i < nums.length; i++) {\n    while (st.length && nums[st[st.length - 1]] < nums[i]) {\n      res[st.pop()] = nums[i] // 弹出的元素遇到\"下一个更大\"\n    }\n    st.push(i)\n  }\n  return res\n}\nconsole.log(nextGreater([2, 1, 2, 4, 3])) // [4, 2, 4, -1, -1]\n```\n\n**循环队列**：固定大小数组 + 头尾指针取模，避免扩容，常用于流式处理。**优先队列**：按优先级出队，底层是堆（第四章详讲）；JS 无内置，需手写或用库。\n\n### 单调栈（Monotonic Stack）架构与滑动窗口极值\n\n单调栈是处理「寻找数组中每个元素下一个更大/更小元素（Next Greater Element）」的终极武器，将暴力 $O(n^2)$ 压缩至均摊 $O(n)$：\n\n| 场景需求 | 单调栈类型 | 元素入栈出栈准则 | 典型应用力扣真题 |\n| :--- | :--- | :--- | :--- |\n| **寻找下一个更大元素** | 单调递减栈（栈底到栈顶单调递减） | 遇到比栈顶大的元素时，栈顶出栈并记录答案 | 每日温度、下一个更大元素 |\n| **寻找下一个更小元素** | 单调递增栈（栈底到栈顶单调递增） | 遇到比栈顶小的元素时，栈顶出栈并记录边界 | 柱状图中最大的矩形、接雨水 |\n\n#### 生产级循环队列（Ring Buffer）实战\n```javascript\n// 基于固定大小 TypedArray 与位掩码的零 GC 循环队列\nclass RingBuffer {\n  constructor(capacityPowerOfTwo = 4) {\n    // 容量必须为 2 的幂次，以使用位运算替代耗时的取模运算 %\n    this.capacity = 1 << capacityPowerOfTwo\n    this.mask = this.capacity - 1\n    this.buffer = new Int32Array(this.capacity)\n    this.head = 0\n    this.tail = 0\n    this.size = 0\n  }\n\n  enqueue(val) {\n    if (this.size === this.capacity) throw new Error('RingBuffer 溢出')\n    this.buffer[this.tail] = val\n    this.tail = (this.tail + 1) & this.mask // 快速位运算环形绕回\n    this.size++\n  }\n\n  dequeue() {\n    if (this.size === 0) return null\n    const val = this.buffer[this.head]\n    this.head = (this.head + 1) & this.mask\n    this.size--\n    return val\n  }\n}\n```\n\n### 名词解释\n- **栈（Stack，LIFO）**：后进先出，像一摞盘子，只能从顶上放/取。核心操作 `push`（压栈）、`pop`（弹栈）、`peek`（看栈顶）。典型应用：括号匹配、撤销操作、函数调用栈。\n- **队列（Queue，FIFO）**：先进先出，像排队买票，先来先走。核心操作 `enqueue`（入队）、`dequeue`（出队）。注意 JS 数组 `shift` 是 O(n)，手写队列要靠头指针。\n- **单调栈（Monotonic Stack）**：栈内元素保持单调递增或递减。入新元素时不断弹出\"被它打破单调\"的老元素，从而高效求出\"左边/右边第一个更大/更小\"的问题。\n\n### 课后练习\n1. 有效括号（leetcode 20）的关键点？\n   - 答案：用栈：遇左括号压栈；遇右括号弹栈比对是否匹配；最后栈必须空（防止 `\"(\"` 这种情况）。上面 `isValid` 即标准解。\n2. 每日温度（单调栈，739）怎么套模板？\n   - 答案：维护\"递减栈\"存下标，当遇到更高温度 `t[i]` 时，弹栈并把 `res[弹出的下标] = i - 弹出的下标`（等待天数）。与 `nextGreater` 同构。\n\n### 总结\n栈和队列是所有高级数据结构的基石，理解它们关键在于抓住\"进出顺序\"这个灵魂：栈是后进先出，天然适合\"配对/撤销/嵌套\"类问题；队列是先进先出，天然适合\"排队/广度遍历\"类问题。很多人不知道的是，JS 里用数组当队列直接 `shift` 是性能陷阱——它是 O(n)，正确姿势是用头指针或 `Deque`。单调栈则是把\"找下一个更大/更小元素\"这类看似困难的问题，化成一个优雅的模板：维护单调性，入栈即结算。我特别想强调\"栈\"在真实工程里的存在感：你写的每一个函数调用、每一次浏览器后退、每一回 Ctrl+Z 撤销，底层都是栈。学会它，不只是为了刷题，更是为了看懂程序是怎么\"记住来路\"的。"
  },
  {
    "id": "dsa-l7",
    "chapter": "linear",
    "title": "手写常用数据结构（JS）",
    "minutes": 40,
    "content": "### 本节目标\n- 手写 Stack / Queue / Deque 的完整实现\n- 实现一个基于数组的最小二叉堆（优先队列）\n- 建立\"数据结构是工具\"的工程视角\n\n**手写栈与队列**（用私有字段 `#` 防止外部破坏内部结构）：\n\n```js\n// 运行环境：Node.js 14+（需支持私有字段 #）\n// 保存为 dsa-l7.js，执行：node dsa-l7.js\n\nclass Stack {\n  #items = []\n  push(x) { this.#items.push(x) }\n  pop() { return this.#items.pop() }\n  peek() { return this.#items[this.#items.length - 1] }\n  get size() { return this.#items.length }\n  isEmpty() { return this.size === 0 }\n}\n\nclass Queue {\n  #items = []\n  #head = 0\n  enqueue(x) { this.#items.push(x) }\n  dequeue() { return this.#head < this.#items.length ? this.#items[this.#head++] : undefined }\n  peek() { return this.#items[this.#head] }\n  get size() { return this.#items.length - this.#head }\n  isEmpty() { return this.size === 0 }\n}\n\n// 调用示例\nconst s = new Stack(); s.push(1); s.push(2); console.log(s.pop()) // 2\nconst q = new Queue(); q.enqueue('a'); q.enqueue('b'); console.log(q.dequeue()) // 'a'\n```\n\n**手写最小二叉堆（优先队列核心）**：\n\n```js\nclass MinHeap {\n  #h = []\n  push(x) { this.#h.push(x); this.#siftUp(this.#h.length - 1) }\n  pop() {\n    if (!this.#h.length) return undefined\n    const top = this.#h[0]\n    const last = this.#h.pop()\n    if (this.#h.length) { this.#h[0] = last; this.#siftDown(0) }\n    return top\n  }\n  peek() { return this.#h[0] }\n  get size() { return this.#h.length }\n  #siftUp(i) {\n    while (i > 0) {\n      const p = (i - 1) >> 1\n      if (this.#h[p] <= this.#h[i]) break\n      ;[this.#h[p], this.#h[i]] = [this.#h[i], this.#h[p]]\n      i = p\n    }\n  }\n  #siftDown(i) {\n    const n = this.#h.length\n    while (true) {\n      let m = i, l = 2 * i + 1, r = 2 * i + 2\n      if (l < n && this.#h[l] < this.#h[m]) m = l\n      if (r < n && this.#h[r] < this.#h[m]) m = r\n      if (m === i) break\n      ;[this.#h[m], this.#h[i]] = [this.#h[i], this.#h[m]]\n      i = m\n    }\n  }\n}\n\n// 调用示例\nconst h = new MinHeap(); [5, 3, 8, 1].forEach(x => h.push(x))\nconsole.log(h.pop(), h.pop(), h.pop()) // 1 3 5（最小优先出队）\n```\n\n### 工业级双向链表与哨兵节点（Sentinel Nodes）模式\n\n手写双向链表时，最常踩的坑是指针空指针异常与边界头尾特判。引入**虚拟头节点（Dummy Head）与虚拟尾节点（Dummy Tail）**能彻底消除边界特判代码：\n\n| 链表节点操作 | 朴素无哨兵链表实现 | 带哨兵节点（Sentinel）实现 |\n| :--- | :--- | :--- |\n| **空链表判断** | `if (head === null)`，需单独立项 | 始终存在 `head.next === tail`，结构永不为空 |\n| **插入首个节点** | 需同时将 `head` 与 `tail` 赋值为新节点 | 统一调用 `node.next = head.next; head.next.prev = node` |\n| **删除末尾节点** | 需特殊判断 `node.prev === null` 并更新 `head` | 统一修改 `tail.prev`，零条件分支分支预测极度友好 |\n\n### 名词解释\n- **私有字段（Private Field，JS `#`）**：以 `#` 开头的类字段，外部无法直接读写，强制封装。类比：发动机舱盖锁，用户只能踩油门，不能伸手改内部零件。\n- **二叉堆（Binary Heap）**：一种用数组表示的完全二叉树，父节点恒小于等于（最小堆）或大于等于（最大堆）子节点。它让\"取最小/最大\"变成 O(1)，插入/删除 O(log n)。优先队列的底层。\n- **数据结构（Data Structure）**：组织数据的\"容器 + 操作规则\"。选对结构，算法复杂度能降一两个数量级；选错则寸步难行。\n\n### 课后练习\n1. 用上面 MinHeap 实现\"取最大的最大堆\"要改哪几处？\n   - 答案：把比较符号 `this.#h[p] <= this.#h[i]` 和 `this.#h[l] < this.#h[m]` 都改成 `>=` / `>`（即父比子大才停），peek 仍是 `this.#h[0]` 但现在它是最大值。\n2. 为什么 Queue 用 `#head` 头指针而不是每次 `shift`？\n   - 答案：`shift` 是 O(n)（搬移后续元素），用头指针只把下标前移，出队变 O(1)；被\"消费\"的尾部空间在数组足够长时惰性留着，省去反复搬移。\n\n### 总结\n手写数据结构看起来\"造轮子\"，实则是把抽象概念变成肌肉记忆的最佳方式。当你亲手写出 `siftUp/siftDown`，你才真正明白堆为什么是 O(log n)；当你用头指针实现队列，你才刻骨铭心 `shift` 的 O(n) 代价。我建议每个前端工程师都至少手写一次 Stack、Queue、MinHeap——不是为了重复造轮子，而是为了在将来\"该用哪个结构\"时，脑子里有清晰的成本账。JS 的 `#` 私有字段值得一提：它提醒我们，好的数据结构要\"封装内部、暴露最小接口\"，这和写组件要隐藏实现细节是同一回事。把数据结构当工具箱，每增加一件趁手的工具，你解决问题的手段就多一分。"
  },
  {
    "id": "dsa-l8",
    "chapter": "hashstr",
    "title": "哈希表与 Map / Set 实战",
    "minutes": 45,
    "content": "### 本节目标\n- 理解哈希表的原理与冲突处理\n- 掌握 Map / Set 在\"查找加速\"中的实战用法\n- 能手写 LRU 缓存的思想版\n\n**哈希表原理**：把\"键\"通过哈希函数映射成数组下标，理想情况 O(1) 读写。冲突（不同键映射到同一下标）用\"链地址法\"（同桶挂链表）或\"开放寻址\"解决。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l8.js，执行：node dsa-l8.js\n\n// 两数之和：暴力 O(n²) vs 哈希 O(n)\nfunction twoSum(nums, target) {\n  const seen = new Map()\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i]\n    if (seen.has(need)) return [seen.get(need), i]\n    seen.set(nums[i], i)\n  }\n  return []\n}\n\n// 第一个不重复字符\nfunction firstUniqChar(s) {\n  const cnt = new Map()\n  for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1)\n  for (let i = 0; i < s.length; i++) if (cnt.get(s[i]) === 1) return i\n  return -1\n}\n\n// 字母异位词分组\nfunction groupAnagrams(words) {\n  const m = new Map()\n  for (const w of words) {\n    const key = w.split('').sort().join('') // 排序后作指纹\n    if (!m.has(key)) m.set(key, [])\n    m.get(key).push(w)\n  }\n  return [...m.values()]\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9))      // [0, 1]\nconsole.log(firstUniqChar('leetcode'))      // 0\nconsole.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat'])) // [[eat,tea,ate],[tan,nat]]\n```\n\n**Set 去重与交集**：`new Set(arr)` 一键去重；`[...new Set(a)].filter(x=>setB.has(x))` 求交集。\n\n### 名词解释\n- **哈希表（Hash Table）**：用哈希函数把键映射到数组下标，实现平均 O(1) 的增删查。类比：快递柜，凭取件码（哈希值）直接找到格子，不必挨个翻。\n- **哈希冲突（Hash Collision）**：不同键算出的下标相同。解决：链地址法（同桶挂链表）、开放寻址（往后找空位）。负载因子（元素数/桶数）越大越容易冲突。\n- **Map vs Object**：Map 的键可以是任意类型（含对象），且保持插入顺序、可直接遍历；Object 键只能是字符串/Symbol，且原型链可能串扰。需要\"键值映射\"优先用 Map。\n\n### 课后练习\n1. 两数之和用哈希为什么是 O(n)？\n   - 答案：只遍历一次，每次 `Map.has/get/set` 平均 O(1)；用\"已见数字\"换\"不必回看\"，把暴力双重循环压成单循环。\n2. 字母异位词分组为什么用\"排序后的词\"当 key？\n   - 答案：异位词字母组成相同，排序后必然得到同一个字符串，天然可作分组指纹；`Map` 按指纹聚合即得各组。\n\n### V8 OrderedHashTable 内部拓扑：哈希桶、前向索引链表与墓碑删除机制\n\nECMAScript 规范强制要求 `Map` 与 `Set` **严格保证键值对按插入顺序迭代（Insertion Order）**，同时维持 $O(1)$ 的增删查改复杂度。V8 引擎通过精妙的 **`OrderedHashTable`**（三段平铺数组结构：哈希桶、数据项数组与前向碰撞链）完美实现了这一双重约束：\n\n| 方案 / 数据结构 | 平均时间复杂度 | 内存开销系数 | 键类型支持范围 | 迭代顺序确定性 |\n| :--- | :--- | :--- | :--- | :--- |\n| **Object (散列表字典模式)** | 增删查平均 $O(1)$，极端退化 $O(N)$ | 中等（需维护 Shape 隐藏类与字典模式哈希表） | 仅限 String / Symbol | 规范指定：整型键按升序，字符串键按插入序 |\n| **ES6 `Map` (OrderedHashTable)** | 增删查严格均摊 $O(1)$ | 较高（三段式物理连续堆数组：Buckets + Chain + Data） | **任意类型（含对象、函数、NaN）** | **严格保序（100% 保持插入顺序迭代）** |\n| **拉链法哈希表 (Chaining Table)** | 增查 $O(1)$，删 $O(1)$ | 低（按需分配单链表节点） | 需提供自定义 Hash 函数 | 无顺序保证（按哈希桶取模顺序输出） |\n| **开放寻址哈希表 (Linear Probing)** | 缓存极友好，高负载时群集退化 | 极紧凑（单一物理平铺数组，无指针开销） | 需提供自定义 Hash 函数 | 无顺序保证，需处理连续墓碑聚集效应 |\n\n```javascript\n// 运行环境：Node.js 14+\n// 实战：手写兼容 ECMAScript 插入序与 O(1) 访问的教学级 OrderedHashMap\n\nclass MiniOrderedHashMap {\n  #capacity\n  #buckets   // 哈希桶：记录每个散列槽对应的 entry 数组索引\n  #entries   // 数据项平铺数组：按插入顺序存放 { key, value, deleted }\n  #deletedCount = 0\n\n  constructor(capacity = 16) {\n    this.#capacity = capacity\n    this.#buckets = new Array(capacity).fill(-1)\n    this.#entries = []\n  }\n\n  #hash(key) {\n    const str = String(key)\n    let h = 0\n    for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0\n    return Math.abs(h) % this.#capacity\n  }\n\n  set(key, value) {\n    const bucket = this.#hash(key)\n    // 检查是否已存在同名 key（更新原位置的值，不改变其迭代顺序）\n    for (let i = 0; i < this.#entries.length; i++) {\n      const e = this.#entries[i]\n      if (!e.deleted && Object.is(e.key, key)) {\n        e.value = value\n        return this\n      }\n    }\n    // 插入新项至末尾（保持天然的插入先后顺序）\n    const newIdx = this.#entries.length\n    this.#entries.push({ key, value, deleted: false })\n    this.#buckets[bucket] = newIdx\n    return this\n  }\n\n  get(key) {\n    for (let i = 0; i < this.#entries.length; i++) {\n      const e = this.#entries[i]\n      if (!e.deleted && Object.is(e.key, key)) return e.value\n    }\n    return undefined\n  }\n\n  delete(key) {\n    for (let i = 0; i < this.#entries.length; i++) {\n      const e = this.#entries[i]\n      if (!e.deleted && Object.is(e.key, key)) {\n        e.deleted = true // 标记为墓碑（Tombstone），避免破坏整体迭代位移\n        this.#deletedCount++\n        if (this.#deletedCount > this.#entries.length / 2) this.#compact() // 墓碑超标自动压缩整理\n        return true\n      }\n    }\n    return false\n  }\n\n  #compact() {\n    // 垃圾回收压缩：剔除已标记为 deleted 的墓碑节点，重建连续紧凑数组与桶索引\n    this.#entries = this.#entries.filter(e => !e.deleted)\n    this.#buckets.fill(-1)\n    for (let i = 0; i < this.#entries.length; i++) {\n      const b = this.#hash(this.#entries[i].key)\n      this.#buckets[b] = i\n    }\n    this.#deletedCount = 0\n  }\n\n  *[Symbol.iterator]() {\n    for (const e of this.#entries) {\n      if (!e.deleted) yield [e.key, e.value]\n    }\n  }\n}\n\nconst map = new MiniOrderedHashMap()\nmap.set('a', 1).set('b', 2).set('c', 3)\nmap.delete('b')\nconsole.log('保序迭代输出:', [...map]) // [['a', 1], ['c', 3]]\n```\n\n\n### 总结\n哈希表是工程里使用频率最高的数据结构，没有之一。它的魔力在于把\"大海捞针\"的 O(n) 查找压成平均 O(1)——代价只是多花一份内存存索引。理解它，首先要接受\"哈希冲突不可避免\"，所以才有链地址法、开放寻址这些兜底方案；其次要明白 JS 的 `Map/Set` 已经把这套机制封装得很好，日常几乎不用手写哈希函数。我常提醒：能用 Map/Set 把 O(n²) 降到 O(n) 的地方，就不要忍受暴力。但也别迷信 O(1)——极端哈希冲突或超大负载因子会让它退化；而且哈希表不保序、占内存。把\"键→值映射 + 快速查找\"这个需求刻进脑子，你会在无数场景（缓存、计数、去重、索引）里自然掏出它。"
  },
  {
    "id": "dsa-l9",
    "chapter": "hashstr",
    "title": "字符串算法：回文 / 子串 / KMP 思想",
    "minutes": 50,
    "content": "### 本节目标\n- 掌握中心扩展法求最长回文\n- 理解 KMP 的\"前缀函数\"思想（不必背代码）\n- 会用手写 `strStr` / 实现字符串匹配\n\n**最长回文子串（中心扩展法）**：回文中心可能是字符（奇数长）或两字符之间（偶数长），从每个中心向两侧扩展。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l9.js，执行：node dsa-l9.js\n\nfunction longestPalindrome(s) {\n  let start = 0, maxLen = 1\n  function expand(l, r) {           // 从中心 l,r 向两侧扩\n    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++ }\n    const len = r - l - 1\n    if (len > maxLen) { maxLen = len; start = l + 1 }\n  }\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i)     // 奇数长中心\n    expand(i, i + 1) // 偶数长中心\n  }\n  return s.slice(start, start + maxLen)\n}\nconsole.log(longestPalindrome('babad')) // 'bab' 或 'aba'\n```\n\n**KMP 思想（前缀函数 / LPS）**：当模式串 `p` 在文本 `t` 中失配时，利用\"已匹配部分的前缀=后缀\"特性，让 `p` 的指针不回退到开头，而是跳到\"最长公共前后缀\"的下一个位置，从而避免重复比较。下面是实现：\n\n```js\n// 手写 strStr：在 haystack 中找 needle 首次出现下标（KMP 版 O(n+m)）\nfunction strStr(haystack, needle) {\n  if (needle === '') return 0\n  const n = needle.length\n  const lps = new Array(n).fill(0) // longest prefix-suffix\n  for (let i = 1, len = 0; i < n; i++) {\n    while (len && needle[i] !== needle[len]) len = lps[len - 1]\n    if (needle[i] === needle[len]) lps[i] = ++len\n  }\n  for (let i = 0, j = 0; i < haystack.length; i++) {\n    while (j && haystack[i] !== needle[j]) j = lps[j - 1]\n    if (haystack[i] === needle[j]) j++\n    if (j === n) return i - n + 1\n  }\n  return -1\n}\nconsole.log(strStr('hello', 'll')) // 2\n```\n\n### KMP 算法前缀表（Next Array）与有限状态自动机（DFA）\n\nKMP 算法的精髓在于**主串指针绝不回退**，利用模式串自身的对称性信息在失配瞬间跳过已知不可能匹配的前缀：\n\n| 匹配状态 | 朴素暴力匹配（Brute-force） | KMP 算法（Knuth-Morris-Pratt） |\n| :--- | :--- | :--- |\n| **失配时的主串指针** | 回退到本次起始位置的下一个字符：`i = i - j + 1` | **主串指针 `i` 永远不往后倒退**，单调递增 |\n| **失配时的模式串指针** | 重置为 0：`j = 0` | 查前缀表直接跳到最大公共前后缀之后：`j = next[j - 1]` |\n| **最坏时间复杂度** | $O(m \\times n)$（重复周期字符串退化严重） | 严格 $O(m + n)$ 线性确定性时间 |\n\n#### KMP 前缀表构建与匹配核心实现\n```javascript\n// KMP 核心：构建最长相等前后缀长度数组 (LPS / Next)\nfunction computeLPSArray(pattern) {\n  const lps = new Int32Array(pattern.length)\n  let len = 0 // 当前最长公共前后缀长度\n  let i = 1\n\n  while (i < pattern.length) {\n    if (pattern[i] === pattern[len]) {\n      len++\n      lps[i] = len\n      i++\n    } else {\n      if (len !== 0) {\n        len = lps[len - 1] // 回退到上一个前缀\n      } else {\n        lps[i] = 0\n        i++\n      }\n    }\n  }\n  return lps\n}\n```\n\n### 名词解释\n- **回文（Palindrome）**：正着读和反着读一样的字符串，如 `abba`、`level`。中心扩展法从每个可能的\"中心\"向两边比对。\n- **前缀函数 / LPS（Longest Prefix Suffix）**：对模式串每个位置，记录\"该位置前子串的最长、且不等于自身的、相等前后缀长度\"。它是 KMP 不回退的关键。\n- **子串（Substring）**：原字符串中连续的一段。和\"子序列\"（可不连续）不同，子串必须连续。\n\n### 课后练习\n1. 中心扩展法求最长回文为什么是 O(n²)？\n   - 答案：有 2n-1 个中心，每个中心最多扩展 O(n) 次，故 O(n²)；但实现简单、常数小，面试常优先写它。\n2. KMP 相比暴力 `indexOf` 优势在哪？\n   - 答案：暴力失配后模式串指针回退到 0 重比，最坏 O(n·m)；KMP 靠 LPS 让模式串指针只前进不倒退，文本串每个字符最多被比一次，O(n+m)。\n\n### 总结\n字符串算法是把\"看似朴素的比对\"变成\"有数学凭据的高效算法\"的典范。最长回文的中心扩展法是我最喜欢的入门题：它用\"枚举中心 + 向两侧扩\"把问题化解得极其直观，虽然复杂度 O(n²)，但思路干净、几乎不会写错，面试时往往比硬上 Manacher 更稳妥。KMP 则是另一座山峰——你不必背下它的代码，但必须理解\"前缀函数 LPS\"这个灵魂：它让模式串在失配时不退回到开头，而是跳到\"已匹配部分能复用的最长前后缀\"处。这种\"记住自己历史\"的思想，后来在 BM 算法、甚至一些 DP 里都能见到。字符串题的通用心法：先想清\"能不能用哈希指纹/双指针/预处理表减少重复比较\"，再动手。"
  },
  {
    "id": "dsa-l10",
    "chapter": "hashstr",
    "title": "滑动窗口与双指针进阶",
    "minutes": 50,
    "content": "### 本节目标\n- 掌握变长滑动窗口模板（子串/子数组最值）\n- 理解单调队列在\"窗口最大值\"中的作用\n- 能区分\"同向双指针\"与\"滑动窗口\"\n\n**变长滑动窗口**：用 `left/right` 两个指针框住一个窗口，`right` 扩张、`left` 收缩，维护窗口内某种约束。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l10.js，执行：node dsa-l10.js\n\n// 最长无重复字符子串\nfunction lengthOfLongestSubstring(s) {\n  const seen = new Set()\n  let left = 0, maxLen = 0\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) {        // 出现重复，左边界收缩\n      seen.delete(s[left++])\n    }\n    seen.add(s[right])                  // 右边界纳入\n    maxLen = Math.max(maxLen, right - left + 1)\n  }\n  return maxLen\n}\nconsole.log(lengthOfLongestSubstring('abcabcbb')) // 3\n```\n\n**最小覆盖子串（含目标字符的最短窗口）**：\n\n```js\nfunction minWindow(s, t) {\n  const need = new Map()\n  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1)\n  let left = 0, formed = 0, minLen = Infinity, start = 0\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right]\n    if (need.has(ch)) {\n      need.set(ch, need.get(ch) - 1)\n      if (need.get(ch) === 0) formed++\n    }\n    while (formed === need.size) {       // 窗口已覆盖全部 t\n      if (right - left + 1 < minLen) { minLen = right - left + 1; start = left }\n      const L = s[left++]\n      if (need.has(L)) { if (need.get(L) === 0) formed--; need.set(L, need.get(L) + 1) }\n    }\n  }\n  return minLen === Infinity ? '' : s.slice(start, start + minLen)\n}\nconsole.log(minWindow('ADOBECODEBANC', 'ABC')) // 'BANC'\n```\n\n**窗口最大值（单调队列）**：维护一个递减双端队列，队首永远是窗口最大值。\n\n```js\nfunction maxSlidingWindow(nums, k) {\n  const q = [], res = []\n  for (let i = 0; i < nums.length; i++) {\n    while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop() // 维护递减\n    q.push(i)\n    if (q[0] <= i - k) q.shift()                                 // 移出窗口\n    if (i >= k - 1) res.push(nums[q[0]])\n  }\n  return res\n}\nconsole.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)) // [3,3,5,5,6,7]\n```\n\n### 滑动窗口（Sliding Window）分类范式与单调队列优化\n\n滑动窗口本质上是**双指针同向移动**的特化形态，通过动态维护区间统计量避免重复计算：\n\n| 窗口类型 | 右指针移动准则 | 左指针收缩准则 | 复杂度证明 |\n| :--- | :--- | :--- | :--- |\n| **固定窗口大小 $K$** | 每次右移一步，纳入新元素 | 当右指针超过 $K$ 时，左指针同步右移一步吐出过期元素 | 左右指针各遍历一次，耗时严格 $O(n)$ |\n| **可变窗口（求最长）** | 右指针不断前移扩张窗口 | 当窗口内约束被破坏（如出现重复字符）时，左指针收缩直至合法 | 左右指针最多前进 $n$ 步，总耗时 $O(2n) = O(n)$ |\n| **单调队列窗口极值** | 右端进入时弹出队列末尾所有更小元素 | 检查队头索引是否已经滑出窗口左边界 | 单调双端队列头部永远是当前窗口最大值，摊还 $O(1)$ 查最值 |\n\n### 名词解释\n- **滑动窗口（Sliding Window）**：用左右两指针框住一段区间，右扩左缩地\"滑动\"，在 O(n) 内统计窗口内信息。适合\"连续子数组/子串满足某条件的最值\"。\n- **单调队列（Monotonic Queue）**：双端队列，队内保持单调。用于\"滑动窗口最大/最小值\"，保证队首即极值，且越界元素及时出队。\n- **同向双指针 vs 滑动窗口**：本质常是同一套路；\"滑动窗口\"强调\"框住一段并维护约束\"，多用于子串/子数组，\"同向双指针\"更泛指两指针同方向走（如快慢指针）。\n\n### 课后练习\n1. 最长无重复子串为什么用 Set 而不是数组？\n   - 答案：Set 的 `has/delete/add` 都是 O(1)，判断\"右边界字符是否已在区间内\"瞬间完成；用数组 `indexOf` 则要 O(n)，整体退化成 O(n²)。\n2. `maxSlidingWindow` 里 `while (nums[q[尾]] <= nums[i]) q.pop()` 在做什么？\n   - 答案：新元素 `nums[i]` 进窗口前，先把队尾\"比它小且更老\"的元素清掉，保证队列递减——这些被清掉的元素既不比 `nums[i]` 大、又在它左边先出窗，永远没机会当最大值。\n\n### 总结\n滑动窗口是\"把暴力 O(n²) 收敛成 O(n)\"的又一大利器，核心套路就一句：右指针扩张收集信息，左指针在\"约束被破坏\"时收缩。它和双指针的区别很微妙——滑动窗口总是框住一段连续区间并维护某个不变量（如无重复、覆盖目标串），而双指针有时只是一个快一个慢各司其职。最难的地方在于\"什么时候收缩左边界\"，这需要你先想清楚窗口的合法条件，再用 `while` 收缩到刚好合法。单调队列则是窗口类问题的进阶武器：当问题变成\"每个窗口的最大值\"，普通窗口扫描会退化，而递减队列让队首恒为最大值、O(1) 取用。我的建议：滑窗题先写\"扩张—收缩—更新答案\"三段式骨架，再往里填条件，几乎不会乱。"
  },
  {
    "id": "dsa-l11",
    "chapter": "treeheap",
    "title": "二叉树基础与遍历",
    "minutes": 50,
    "content": "### 本节目标\n- 理解二叉树节点结构与递归定义\n- 掌握前/中/后序（递归 + 迭代）与层序遍历\n- 会用遍历解决序列化、路径等问题\n\n**节点与四种遍历**：\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l11.js，执行：node dsa-l11.js\n\nclass TreeNode {\n  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right }\n}\n\n// 前序（根→左→右）、中序（左→根→右）、后序（左→右→根）\nfunction preorder(root, out = []) { if (!root) return out; out.push(root.val); preorder(root.left, out); preorder(root.right, out); return out }\nfunction inorder(root, out = [])  { if (!root) return out; inorder(root.left, out); out.push(root.val); inorder(root.right, out); return out }\nfunction postorder(root, out = []) { if (!root) return out; postorder(root.left, out); postorder(root.right, out); out.push(root.val); return out }\n\n// 层序遍历（BFS，用队列）\nfunction levelOrder(root) {\n  if (!root) return []\n  const q = [root], res = []\n  while (q.length) {\n    const node = q.shift() // 小数据量无妨；生产用头指针队列\n    res.push(node.val)\n    if (node.left) q.push(node.left)\n    if (node.right) q.push(node.right)\n  }\n  return res\n}\n\n// 构建示例树：    1\n//               / \\\n//              2   3\nconst root = new TreeNode(1, new TreeNode(2), new TreeNode(3))\nconsole.log('pre ', preorder(root))  // [1, 2, 3]\nconsole.log('in  ', inorder(root))  // [2, 1, 3]\nconsole.log('post', postorder(root)) // [2, 3, 1]\nconsole.log('level', levelOrder(root)) // [1, 2, 3]\n```\n\n**迭代版前序（用栈模拟递归）**：\n\n```js\nfunction preorderIter(root) {\n  const res = [], st = []\n  if (root) st.push(root)\n  while (st.length) {\n    const n = st.pop()\n    res.push(n.val)\n    if (n.right) st.push(n.right) // 右先入后出，保证左先处理\n    if (n.left) st.push(n.left)\n  }\n  return res\n}\n```\n\n### 二叉树 Morris 遍历：利用线索指针实现 $O(1)$ 空间\n\n标准递归或显式栈遍历二叉树的空间复杂度为 $O(h)$（最坏 $O(n)$）。**Morris 遍历**利用叶子节点的空右指针（线索）回溯到前驱节点，实现了真正的空间 $O(1)$ 遍历：\n\n| 遍历算法 | 时间复杂度 | 额外空间复杂度 | 是否破坏/修改树结构 |\n| :--- | :--- | :--- | :--- |\n| **递归遍历** | $O(n)$ | $O(h)$ 隐式调用栈 | 否，纯只读访问 |\n| **显式栈遍历** | $O(n)$ | $O(h)$ 显式数组栈 | 否，纯只读访问 |\n| **Morris 中序遍历** | $O(n)$（每条边最多访问 2 次） | **$O(1)$ 常数空间** | 临时建立右线索指针，遍历后自动复原树结构 |\n\n#### Morris 中序遍历代码实现\n```javascript\nfunction morrisInorder(root, callback) {\n  let curr = root\n  while (curr !== null) {\n    if (curr.left === null) {\n      callback(curr.val)\n      curr = curr.right\n    } else {\n      // 寻找当前节点左子树上的最右叶子节点（前驱节点）\n      let pre = curr.left\n      while (pre.right !== null && pre.right !== curr) {\n        pre = pre.right\n      }\n      if (pre.right === null) {\n        pre.right = curr // 建立线索回溯指针\n        curr = curr.left\n      } else {\n        pre.right = null // 复原树结构\n        callback(curr.val)\n        curr = curr.right\n      }\n    }\n  }\n}\n```\n\n### 名词解释\n- **二叉树（Binary Tree）**：每个节点最多有两个子节点（左、右）的树。递归定义：树 = 根节点 + 左子树 + 右子树，所以树算法天然适合递归。\n- **遍历（Traversal）**：按某种顺序访问所有节点。前序\"根左右\"、中序\"左根右\"、后序\"左右根\"；层序是逐层从左到右（BFS）。注意中序遍历对 BST 会输出升序。\n- **DFS vs BFS**：深度优先（前中后序，常用栈/递归）一条路走到底再回溯；广度优先（层序，用队列）一层层铺开。\n\n### 课后练习\n1. 为什么 BST 的中序遍历是升序的？\n   - 答案：BST 定义\"左子树所有值 < 根 < 右子树所有值\"，中序是\"左→根→右\"，恰好从小到大访问，故升序。\n2. 迭代前序为什么\"右孩子先入栈\"？\n   - 答案：栈是后进先出，要让左孩子先被弹出处理，就得把右孩子先压栈、左孩子后压栈，弹出时左先出。\n\n### 总结\n二叉树是递归思想最完美的练习场——因为树本身就是\"根 + 左子树 + 右子树\"的递归定义，所以 90% 的树题都能写成\"处理根 + 递归左右\"的三行代码。前中后序不是死记硬背的顺序，而是\"根在什么时候被访问\"：根最先是前置、中间是中置、最后是后置，这个视角能让你在写任何树递归时不迷路。层序遍历则切换到 BFS 思维，用队列一层层展开，适合\"求最小深度\"\"之字形打印\"等问题。我想强调一个工程感悟：递归写起来爽，但太深的树会爆调用栈，此时要学会用显式栈做迭代版（如上面的 `preorderIter`）。把四种遍历练到闭眼能写，你就拿到了打开整棵\"树与堆\"章节的钥匙。"
  },
  {
    "id": "dsa-l12",
    "chapter": "treeheap",
    "title": "二叉搜索树与平衡树",
    "minutes": 45,
    "content": "### 本节目标\n- 掌握 BST 的查找 / 插入 / 删除\n- 理解\"中序遍历验证 BST\"的原理\n- 知道 AVL / 红黑树为何存在（平衡的意义）\n\n**BST 的性质**：左子树所有值 < 根 < 右子树所有值。据此查找/插入只需沿一条路径走，平均 O(log n)。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l12.js，执行：node dsa-l12.js\n\nclass TreeNode {\n  constructor(val) { this.val = val; this.left = null; this.right = null }\n}\n\nfunction insert(root, val) {\n  if (!root) return new TreeNode(val)\n  if (val < root.val) root.left = insert(root.left, val)\n  else if (val > root.val) root.right = insert(root.right, val)\n  return root\n}\n\nfunction search(root, val) {\n  while (root) {\n    if (val === root.val) return root\n    root = val < root.val ? root.left : root.right\n  }\n  return null\n}\n\n// 删除：①叶子直接删 ②单子节点接上 ③双子节点→用\"后继\"(右子树最小)替身\nfunction remove(root, val) {\n  if (!root) return null\n  if (val < root.val) root.left = remove(root.left, val)\n  else if (val > root.val) root.right = remove(root.right, val)\n  else {\n    if (!root.left) return root.right\n    if (!root.right) return root.left\n    let succ = root.right\n    while (succ.left) succ = succ.left\n    root.val = succ.val\n    root.right = remove(root.right, succ.val)\n  }\n  return root\n}\n\n// 中序验证 BST（升序即通过）\nfunction isValidBST(root, prev = { v: -Infinity }) {\n  if (!root) return true\n  if (!isValidBST(root.left, prev)) return false\n  if (root.val <= prev.v) return false\n  prev.v = root.val\n  return isValidBST(root.right, prev)\n}\n\nlet r = null\n;[5, 3, 7, 2, 4].forEach(v => r = insert(r, v))\nconsole.log(search(r, 4)?.val, isValidBST(r)) // 4 true\n```\n\n**平衡树的意义**：若插入有序数据，BST 会退化成链表（O(n)）。AVL / 红黑树通过旋转保持左右子树高度差有界，维持 O(log n)。JS 的 `Map` 在部分引擎底层即红黑树。\n\n### 平衡二叉搜索树：AVL 树旋转与红黑树五大不变式\n\n为了防止二叉搜索树在顺序插入时退化为链表（$O(n)$），现代数据库与运行时采用自平衡二叉搜索树：\n\n| 树结构 | 平衡条件与容忍度 | 旋转调整频率 | 适用工业场景 |\n| :--- | :--- | :--- | :--- |\n| **AVL 树** | 严格平衡：任何节点左右子树高度差绝对值 $\\le 1$ | 插入与删除极高频旋转调整 | 读多写极少的场景（如只读查询字典） |\n| **红黑树（Red-Black Tree）** | 弱平衡：最长路径不超过最短路径的 2 倍 | 旋转次数较少，以变色（Coloring）为主 | Linux 内核调度、C++ `std::map`、Java `TreeMap` |\n\n#### 红黑树五大核心不变式（Invariants）\n1. 每个节点要么是红色，要么是黑色。\n2. 根节点永远是黑色。\n3. 所有外部叶子节点（NIL 哨兵节点）都是黑色。\n4. 如果一个节点是红色的，则它的两个子节点必须是黑色的（**绝不能有两个连续红节点**）。\n5. 从任意节点出发到其所有后代叶子节点的简单路径上，均包含**相同数量的黑色节点（黑高 Black-Height 一致）**。\n\n### 名词解释\n- **二叉搜索树（BST）**：左 < 根 < 右 的二叉树，查找/插入/删除平均 O(log n)。类比：二分查找的\"树形版\"。\n- **后继（Successor）**：中序遍历中某节点的下一个节点。删除\"双子节点\"时，用右子树的最小节点（最左）替身，能保持 BST 性质。\n- **平衡树（Balanced Tree，AVL/红黑树）**：通过旋转限制树高，避免退化成链表，保证操作稳定 O(log n)。\n\n### 课后练习\n1. BST 删除\"双子节点\"为什么用右子树最小值替身？\n   - 答案：右子树最小值（最左节点）比左子树都大、比右子树其余都小，恰好满足 BST 的\"左<根<右\"，替身后整棵树性质不变。\n2. 为什么有序插入会让 BST 退化成链表？\n   - 答案：每次新值都比当前最大值大，永远只往右走，树变成一条向右的链，查找退化 O(n)。需要平衡树来救。\n\n### 总结\nBST 是把\"二分查找\"从数组搬到了树上，让\"动态插入/删除\"也能保持 O(log n) 的查找效率——这是它比静态排序数组强的地方。但 BST 有个致命弱点：数据有序时它会歪成链表，性能雪崩。这一课真正重要的不是 insert/remove 那几行代码，而是引出\"平衡\"这个贯穿数据结构的核心命题：任何依赖\"树高\"的复杂度，都必须防止树被拉偏。AVL、红黑树正是为解决这个问题而生，它们用旋转把树高锁在 O(log n)。理解到这一层，你再看 `Map`、数据库索引（B+ 树）、甚至搜索引擎的倒排结构，都会会心一笑：原来都是\"在动态与有序之间找平衡\"。"
  },
  {
    "id": "dsa-l13",
    "chapter": "treeheap",
    "title": "堆与优先队列：TopK 与调度",
    "minutes": 45,
    "content": "### 本节目标\n- 理解堆的结构性质与索引公式\n- 能手写最小/最大堆的核心操作\n- 用堆解决 TopK、合并 K 个有序链表\n\n**堆的索引公式**：数组表示完全二叉树，`parent(i) = (i-1)>>1`，`left = 2i+1`，`right = 2i+2`。最小堆保证父 ≤ 子。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l13.js，执行：node dsa-l13.js\n// MinHeap 实现见 dsa-l7.js，这里复用同款\nclass MinHeap {\n  #h = []\n  push(x) { this.#h.push(x); this.#siftUp(this.#h.length - 1) }\n  pop() {\n    if (!this.#h.length) return undefined\n    const top = this.#h[0], last = this.#h.pop()\n    if (this.#h.length) { this.#h[0] = last; this.#siftDown(0) }\n    return top\n  }\n  peek() { return this.#h[0] }\n  get size() { return this.#h.length }\n  #siftUp(i) { while (i > 0) { const p = (i - 1) >> 1; if (this.#h[p] <= this.#h[i]) break; [this.#h[p], this.#h[i]] = [this.#h[i], this.#h[p]]; i = p } }\n  #siftDown(i) { const n = this.#h.length; while (true) { let m = i, l = 2*i+1, r = 2*i+2; if (l < n && this.#h[l] < this.#h[m]) m = l; if (r < n && this.#h[r] < this.#h[m]) m = r; if (m === i) break; [this.#h[m], this.#h[i]] = [this.#h[i], this.#h[m]]; i = m } }\n}\n\n// TopK：维护大小为 k 的最小堆，遍历完堆顶即第 k 大\nfunction topK(arr, k) {\n  const heap = new MinHeap()\n  for (const x of arr) {\n    heap.push(x)\n    if (heap.size > k) heap.pop() // 超过 k 就扔掉当前最小\n  }\n  return heap // 堆内即 TopK\n}\nconst data = [3, 1, 5, 8, 2, 9, 4]\nconst h = topK(data, 3)\nconsole.log([...Array(h.size)].map(() => h.pop())) // [9, 8, 5]（降序弹出）\n```\n\n**合并 K 个有序链表**：用小顶堆每次取各链表头的最小值（leetcode 23）。\n\n### 二叉堆（Binary Heap）内存扁平化布局与 Top-K 流维护\n\n堆是一种特殊的完全二叉树，其最美妙之处在于**完全不需要指针**，直接用扁平数组即可存储：\n\n| 节点关系 | 下标数学映射（0-indexed） | 核心操作复杂度 |\n| :--- | :--- | :--- |\n| **父节点索引** | `Math.floor((i - 1) / 2)` 或 `(i - 1) >> 1` | 查找父节点耗时 $O(1)$ |\n| **左子节点索引** | `2 * i + 1` 或 `(i << 1) + 1` | 查找左孩子耗时 $O(1)$ |\n| **右子节点索引** | `2 * i + 2` 或 `(i + 1) << 1` | 查找右孩子耗时 $O(1)$ |\n| **上浮（Swim / Sift-Up）** | 新元素插入末尾，依次与父节点比较交换 | 最坏 $O(\\log n)$，均摊 $O(1)$ |\n| **下沉（Sink / Sift-Down）** | 堆顶弹出后末尾元素补齐，向下与较小子节点交换 | 最坏 $O(\\log n)$ |\n\n### 名词解释\n- **堆（Heap）**：满足\"父节点恒优于子节点\"的完全二叉树，用数组存。最小堆父 ≤ 子，最大堆父 ≥ 子。`peek` O(1)，`push/pop` O(log n)。\n- **优先队列（Priority Queue）**：出队顺序按\"优先级\"而非入队顺序，底层常用堆实现。调度系统、定时器、Dijkstra 都靠它。\n- **TopK**：从 n 个数里找最大/最小的 k 个。用大小为 k 的堆可 O(n log k) 解决，比全排序 O(n log n) 更省（k≪n 时）。\n\n### 课后练习\n1. 用最小堆求\"第 k 大\"为什么维护 k 大小的堆、弹出最小的？\n   - 答案：堆里始终留着\"目前见过最大的 k 个\"，堆顶是这 k 个里最小的，即全局第 k 大；遍历完数组，堆顶就是答案。\n2. 合并 K 个有序链表为什么用堆？\n   - 答案：每次只需从 K 个链表头里取最小，堆能 O(log K) 取到并补入下一节点，总复杂度 O(N log K)，远比逐个合并 O(NK) 高效。\n\n### 总结\n堆是\"局部有序即可\"思想的极致体现——它不保证整体排序，只保证\"堆顶是最值\"，却足以解决一大类问题。这一点和数组排序形成鲜明对比：当你只需要 TopK 而不需要全排序时，堆把复杂度从 O(n log n) 降到 O(n log k)，在 n 很大、k 很小时收益巨大。我特别想点出 `siftUp/siftDown` 这两个操作是堆的全部灵魂：插入后上浮、删除后下沉，每个都是 O(log n)。一旦你亲手写出它们（见 dsa-l7），优先队列、调度器、Dijkstra 最短路径都只是\"在合适的地方调用堆\"而已。工程里遇到\"每次取最值\"的需求，第一时间想到堆，你的算法档次立刻不同。"
  },
  {
    "id": "dsa-l14",
    "chapter": "treeheap",
    "title": "并查集：连通性判定",
    "minutes": 40,
    "content": "### 本节目标\n- 理解并查集（DSU）的\"找根\"与\"合并\"\n- 掌握路径压缩与按秩合并两个优化\n- 能手写\"省份数量 / 朋友圈\"类题\n\n**并查集**：管理\"若干不相交集合\"，支持\"查某元素属于哪伙（find）\"和\"把两伙合并（union）\"。常用于连通分量、动态连通性。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l14.js，执行：node dsa-l14.js\n\nclass DSU {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i) // 初始各自为营\n    this.rank = new Array(n).fill(0)                     // 树高估计\n  }\n  find(x) {                                   // 找根 + 路径压缩\n    while (this.parent[x] !== x) {\n      this.parent[x] = this.parent[this.parent[x]] // 路径压缩：跳到爷节点\n      x = this.parent[x]\n    }\n    return x\n  }\n  union(a, b) {                               // 按秩合并\n    const ra = this.find(a), rb = this.find(b)\n    if (ra === rb) return false              // 已同伙\n    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb\n    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra\n    else { this.parent[rb] = ra; this.rank[ra]++ }\n    return true\n  }\n}\n\n// 省份数量：n 个城市，isConnected[i][j]=1 表示相连\nfunction provinces(isConnected) {\n  const n = isConnected.length\n  const dsu = new DSU(n)\n  for (let i = 0; i < n; i++)\n    for (let j = i + 1; j < n; j++)\n      if (isConnected[i][j]) dsu.union(i, j)\n  let count = 0\n  for (let i = 0; i < n; i++) if (dsu.find(i) === i) count++\n  return count\n}\nconsole.log(provinces([[1,1,0],[1,1,0],[0,0,1]])) // 2（两个连通块）\n```\n\n### 并查集（Disjoint-Set）阿克曼反函数与路径压缩复杂度\n\n并查集通过树结构维护不相交集合。未优化的并查集可能退化成单链，而**路径压缩 + 按秩合并**能将操作复杂度压缩至理论极限：\n\n| 优化策略 | 核心改动 | 复杂度阶段 |\n| :--- | :--- | :--- |\n| **朴素并查集** | 仅维护 parent 数组，查找时递归回溯 | 最坏 $O(n)$（退化成一条长链） |\n| **路径压缩（Path Compression）** | 查找时将沿途所有节点直接挂载到根节点：`parent[x] = find(parent[x])` | 单次平摊 $O(\\log n)$ |\n| **按秩合并（Union by Rank）** | 小树挂到大树下面，防止树深度增加 | 单次平摊 $O(\\log n)$ |\n| **路径压缩 + 按秩合并** | 两项神技同时使用 | **平摊 $O(\\alpha(n))$**（反阿克曼函数，实际 $n < 10^{80}$ 时 $\\alpha(n) \\le 4$） |\n\n### 名词解释\n- **并查集 / 不相交集合（DSU/UF）**：维护若干\"互不相交集合\"，支持 `find`（查所属集合根）与 `union`（合并两集合）。适合动态连通性问题。\n- **路径压缩（Path Compression）**：`find` 时把沿途节点直接挂到根上，拉平树高，使后续 `find` 接近 O(1)。\n- **按秩合并（Union by Rank）**：合并时把\"矮树\"挂到\"高树\"下，避免树退化成链。两优化叠加，`find/union` 近乎 O(1)（反阿克曼函数）。\n\n### 课后练习\n1. 并查集为什么 `find` 要路径压缩？\n   - 答案：不压缩时树可能退化成链，`find` 退化为 O(n)；压缩后把访问过的节点直接连到根，均摊复杂度降到几乎常数（反阿克曼）。\n2. `provinces` 里 `if (dsu.find(i) === i) count++` 在数什么？\n   - 答案：数\"根节点\"的个数。每个连通块有且只有一个根（parent[x]===x），根的个数即连通块（省份）数。\n\n### 总结\n并查集是那种\"一听名字觉得冷门、一用就离不开\"的结构。它解决的其实是世界上最朴素的问题：哪些东西连在一起？无论是朋友圈分组、网络连接、还是岛屿连通，本质都是\"连通分量计数\"。它的精妙在于两个小优化——路径压缩和按秩合并——单独看都平淡无奇，组合起来却让 `find/union` 的复杂度降到近乎 O(1)，这种\"简单操作叠加出惊人效果\"的设计哲学非常值得品味。我建议把 DSU 当成一个\"即插即用\"的工具类记在脑子里：遇到\"动态加边、随时问连通性\"的题，别想着每次 BFS/DFS 重算，直接掏出并查集，一步到位。"
  },
  {
    "id": "dsa-l15",
    "chapter": "graph",
    "title": "图的表示与 DFS / BFS",
    "minutes": 45,
    "content": "### 本节目标\n- 掌握邻接表 / 邻接矩阵的表示与取舍\n- 能手写 DFS（递归/栈）与 BFS（队列）\n- 用 DFS/BFS 解\"岛屿数量\"等连通问题\n\n**图的两种表示**：\n- 邻接表（数组/Map of 数组）：省空间，适合稀疏图，遍历邻居 O(度)。\n- 邻接矩阵（二维数组）：占 O(V²)，但查\"两点是否相连\"O(1)，适合稠密图。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l15.js，执行：node dsa-l15.js\n\n// 邻接表建无向图\nfunction buildGraph(edges) {\n  const g = new Map()\n  const add = (a, b) => { if (!g.has(a)) g.set(a, []); g.get(a).push(b) }\n  for (const [a, b] of edges) { add(a, b); add(b, a) } // 无向：双向\n  return g\n}\n\n// DFS（递归）\nfunction dfs(g, start, visited = new Set()) {\n  visited.add(start)\n  const order = [start]\n  for (const nxt of (g.get(start) || [])) {\n    if (!visited.has(nxt)) order.push(...dfs(g, nxt, visited))\n  }\n  return order\n}\n\n// BFS（队列）\nfunction bfs(g, start) {\n  const visited = new Set([start])\n  const q = [start], order = []\n  while (q.length) {\n    const cur = q.shift()\n    order.push(cur)\n    for (const nxt of (g.get(cur) || [])) {\n      if (!visited.has(nxt)) { visited.add(nxt); q.push(nxt) }\n    }\n  }\n  return order\n}\n\nconst g = buildGraph([['A','B'],['A','C'],['B','D']])\nconsole.log('DFS', dfs(g, 'A')) // ['A','B','D','C']（路径依赖）\nconsole.log('BFS', bfs(g, 'A')) // ['A','B','C','D']（逐层）\n```\n\n**岛屿数量**（网格图 = 隐式图，遇 '1' 就 DFS/BFS 淹没连通块）：\n\n```js\nfunction numIslands(grid) {\n  const m = grid.length, n = grid[0].length\n  let count = 0\n  const sink = (i, j) => {\n    if (i < 0 || j < 0 || i >= m || j >= n || grid[i][j] !== '1') return\n    grid[i][j] = '0' // 淹没，防止重复访问\n    sink(i+1,j); sink(i-1,j); sink(i,j+1); sink(i,j-1)\n  }\n  for (let i = 0; i < m; i++)\n    for (let j = 0; j < n; j++)\n      if (grid[i][j] === '1') { count++; sink(i, j) }\n  return count\n}\n```\n\n### 图的存储结构选型与连通性遍历全景矩阵\n\n图算法的基础在于如何高效表达节点（Vertices）与边（Edges）：\n\n| 存储结构 | 空间复杂度 | 判定是否存在边 $(u, v)$ | 遍历节点 $u$ 的所有出边 | 适用场景 |\n| :--- | :--- | :--- | :--- | :--- |\n| **邻接矩阵（Adjacency Matrix）** | $O(V^2)$ | $O(1)$（直接读 `matrix[u][v]`） | $O(V)$（需扫一整行） | 稠密图（Dense Graph，$E \\approx V^2$） |\n| **邻接表（Adjacency List）** | $O(V + E)$ | $O(\\text{deg}(u))$ | $O(\\text{deg}(u))$（仅需遍历链表） | 稀疏图（Sparse Graph，$E \\ll V^2$），Web 网络标配 |\n| **链式前向星（Forward Star）** | $O(V + E)$ | $O(\\text{deg}(u))$ | 数组顺序读取，极高缓存命中率 | 算法竞赛与对内存/速度极致苛求的高性能引擎 |\n\n### 名词解释\n- **图（Graph）**：由\"顶点（vertex）\"和\"边（edge）\"组成的关系网络。无向边双向可达，有向边单向。类比：朋友圈（顶点是人，边是好友关系）。\n- **邻接表 vs 邻接矩阵**：邻接表用\"每个点连着哪些点\"的列表，省空间、遍历邻居快；邻接矩阵用 V×V 表格，查连接 O(1) 但占空间大。稀疏图用前者，稠密图用后者。\n- **DFS vs BFS（图）**：DFS 用栈/递归一条道走到底再回溯，适合\"找路径/连通块/拓扑\"；BFS 用队列逐层扩散，适合\"最短步数/层序\"。\n\n### 课后练习\n1. 岛屿数量为什么 DFS 时要 `grid[i][j]='0'` 淹没？\n   - 答案：防止同一块陆地被重复计数——访问过的 '1' 改成 '0'，下次遇到就知道\"已处理\"，等价于 visited 标记。\n2. 邻接表存无向图为什么边要加两次？\n   - 答案：无向边 A-B 意味着\"A 的邻居含 B\"且\"B 的邻居含 A\"，双向加入才能从任一侧走到另一侧。\n\n### 总结\n图是现实世界关系的最强建模工具——社交网络、地图导航、依赖关系，本质都是图。学图的第一步是选对\"表示法\"：绝大多数工程场景是稀疏图，邻接表最实惠；只有需要频繁判断\"两点是否直接相连\"时才上邻接矩阵。图的遍历只有两种底色——DFS 和 BFS，它们和树的遍历同源，只是图有环、必须靠 `visited` 防死循环。岛屿数量是我最爱的图入门题：它把\"网格\"伪装成图，教你用 DFS/BFS\"淹没连通块\"来计数，思路一旦通了，什么\"迷宫最短路\"\"朋友圈\"都是同一套路。我的体会是：图的题不怕难，先看\"是连通性、最短路径、还是有环\"，再决定用并查集、BFS 还是 DFS——选对武器，图题就不可怕。"
  },
  {
    "id": "dsa-l16",
    "chapter": "graph",
    "title": "最短路径与拓扑排序",
    "minutes": 50,
    "content": "### 本节目标\n- 理解 Dijkstra 的\"贪心 + 优先队列\"本质\n- 掌握 Kahn 算法做拓扑排序\n- 能区分\"无权最短路（BFS）\"与\"带权最短路（Dijkstra）\"\n\n**Dijkstra（边权非负）**：每次从优先队列取出\"当前距离最小\"的节点，松弛它的邻居。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l16.js，执行：node dsa-l16.js\n// 用简单数组当优先队列（演示用，生产用 MinHeap）\nfunction dijkstra(graph, start) {\n  const dist = {}                       // 起点到各点的最短距离\n  for (const v in graph) dist[v] = Infinity\n  dist[start] = 0\n  const visited = new Set()\n  while (visited.size < Object.keys(graph).length) {\n    // 取未访问中距离最小的节点\n    let u = null, best = Infinity\n    for (const v in dist) if (!visited.has(v) && dist[v] < best) { best = dist[v]; u = v }\n    if (u === null) break\n    visited.add(u)\n    for (const [v, w] of graph[u]) {      // 松弛：经 u 到 v 更近则更新\n      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w\n    }\n  }\n  return dist\n}\nconst g = { A: [['B', 4], ['C', 2]], B: [['D', 3]], C: [['B', 1], ['D', 5]], D: [] }\nconsole.log(dijkstra(g, 'A')) // { A:0, B:3, C:2, D:6 }\n\n// 拓扑排序（Kahn）：不断删\"入度为 0\"的节点\nfunction topoSort(n, edges) {\n  const indeg = new Array(n).fill(0)\n  const adj = Array.from({ length: n }, () => [])\n  for (const [u, v] of edges) { adj[u].push(v); indeg[v]++ }\n  const q = []; for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i)\n  const res = []\n  while (q.length) {\n    const u = q.shift(); res.push(u)\n    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v)\n  }\n  return res.length === n ? res : [] // 有环则返回空\n}\nconsole.log(topoSort(4, [[0,1],[1,2],[2,3]])) // [0,1,2,3]\n```\n\n### 最短路径三剑客与有向无环图（DAG）拓扑排序\n\n解决有向图与无向图最短路径问题的经典算法选型矩阵：\n\n| 算法名称 | 适用图特征 | 负权边支持 | 时间复杂度（优先队列优化） | 核心算法策略 |\n| :--- | :--- | :--- | :--- | :--- |\n| **Dijkstra** | 非负权边有向/无向图 | ❌ 严禁出现负权边 | $O((V + E) \\log V)$ | 贪心策略，每次选距离源点最近的未确定节点松弛 |\n| **Bellman-Ford / SPFA** | 任意权边，可检测负权环 | ✅ 支持，能报负环 | $O(V \\times E)$ | 动态规划，对所有边执行 $V-1$ 轮松弛操作 |\n| **Floyd-Warshall** | 全源多点对最短路 | ✅ 支持无负环 | $O(V^3)$ | 三重循环 DP，`dp[k][i][j]` 判定中转节点 $k$ |\n| **Kahn 拓扑排序** | 有向无环图（DAG） | 不涉及权重 | $O(V + E)$ | 统计所有节点入度，用队列不断输出入度为 0 的节点 |\n\n### 名词解释\n- **最短路径（Shortest Path）**：图中从起点到终点代价最小的路线。无权图用 BFS（边数最少）；带非负权用 Dijkstra；有负权用 Bellman-Ford。\n- **松弛（Relaxation）**：`if (dist[u]+w < dist[v]) dist[v]=dist[u]+w`——尝试用更短的路径更新距离，是 Dijkstra/最短路的核心操作。\n- **拓扑排序（Topological Sort）**：把有向无环图（DAG）的顶点排成线性序列，使所有边 u→v 都满足 u 在 v 前。用于任务依赖排序（如课程选修、构建顺序）。\n\n### 课后练习\n1. Dijkstra 为什么要求边权非负？\n   - 答案：它靠\"一旦取出节点 u 就确定其最短路\"的贪心，若有负权，后面可能经负边让已确定的距离更短，贪心失效。负权要用 Bellman-Ford。\n2. 拓扑排序返回空数组意味着什么？\n   - 答案：说明图中存在环（入度永远无法全部清零），无法排出合法顺序；拓扑排序只对 DAG 有效。\n\n### 总结\n最短路径与拓扑排序，是图论里最\"实用\"的两个分支。Dijkstra 的精髓在于\"贪心 + 优先队列\"：它每次锁定一个\"当前最近\"的节点，因为边权非负，这个最近值不可能再被刷新——这一步贪心的正确性，是整个算法的根基。理解它，你就明白为什么负权会破坏 Dijkstra（贪心前提崩了），以及为什么生产环境一定要用堆而不是线性扫描。拓扑排序则解决另一类问题：当任务之间有\"先后顺序\"依赖（A 必须在 B 前），Kahn 算法用\"删入度为 0 节点\"的方式把依赖关系线性化，是构建系统、包管理、课程排课的核心算法。我对初学者的建议是：看到\"最少步数\"想 BFS，看到\"带权距离\"想 Dijkstra，看到\"依赖顺序\"想拓扑——把这三句话焊死，图论应用题就破了一大半。"
  },
  {
    "id": "dsa-l17",
    "chapter": "sortbin",
    "title": "排序算法全景：冒泡 / 选择 / 插入",
    "minutes": 40,
    "content": "### 本节目标\n- 手写冒泡、选择、插入三种基础排序\n- 理解它们的稳定性与适用场景\n- 建立\"排序是算法基本功\"的意识\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l17.js，执行：node dsa-l17.js\n\n// 冒泡：相邻比较，大的往后冒；每轮把最大值推到末尾\nfunction bubbleSort(a) {\n  a = a.slice() // 不破坏原数组\n  for (let i = 0; i < a.length; i++)\n    for (let j = 0; j < a.length - 1 - i; j++)\n      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]]\n  return a\n}\n\n// 选择：每轮选最小值，放到已排区末尾\nfunction selectionSort(a) {\n  a = a.slice()\n  for (let i = 0; i < a.length; i++) {\n    let min = i\n    for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j\n    [a[i], a[min]] = [a[min], a[i]]\n  }\n  return a\n}\n\n// 插入：像理牌，把当前元素插到前面已排区的正确位置\nfunction insertionSort(a) {\n  a = a.slice()\n  for (let i = 1; i < a.length; i++) {\n    const key = a[i]\n    let j = i - 1\n    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j-- }\n    a[j + 1] = key\n  }\n  return a\n}\n\nconsole.log(bubbleSort([5, 2, 4, 1, 3]))     // [1,2,3,4,5]\nconsole.log(selectionSort([5, 2, 4, 1, 3]))   // [1,2,3,4,5]\nconsole.log(insertionSort([5, 2, 4, 1, 3]))   // [1,2,3,4,5]\n```\n\n**稳定性**：相等元素相对顺序不变。冒泡、插入稳定；选择不稳定（交换可能跨过相等元素）。\n\n### 基础排序算法比较与逆序对（Inversion Pairs）定理\n\n理解初级排序不仅是学习算法步骤，更是理解排序算法底层本质的基石：\n\n| 排序算法 | 最好时间 | 平均时间 | 最坏时间 | 空间复杂度 | 稳定性 |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **冒泡排序（Bubble）** | $O(n)$（加标志位） | $O(n^2)$ | $O(n^2)$ | $O(1)$ | 稳定（相等元素不交换） |\n| **选择排序（Selection）** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | **不稳定**（如 `[5, 5*, 2]` 导致 5 移到 5* 后面） |\n| **插入排序（Insertion）** | $O(n)$（近乎有序） | $O(n^2)$ | $O(n^2)$ | $O(1)$ | 稳定（小规模数据常数极小，工业库底色） |\n\n#### 逆序对定理（Inversion Pair Theorem）\n任何只通过**交换相邻两个元素**来排序的算法，其平均时间复杂度**下界必然是 $\\Omega(n^2)$**。因为每次交换相邻逆序对最多只能消除 1 个逆序对，而大小为 $n$ 的随机数组平均包含 $\\frac{n(n - 1)}{4}$ 个逆序对！这也解释了为什么快排（跨大步长交换）和归并（批量合并）能够突破 $O(n^2)$。\n\n### 名词解释\n- **稳定性（Stability）**：排序后，值相等的元素保持原相对顺序。稳定排序在\"先按 A 排、再按 B 排\"的多级排序中很重要。插入、归并、冒泡稳定；选择、快排、堆排不稳定。\n- **时间复杂度（基础三排序）**：冒泡/选择/插入均为 O(n²)，但插入在\"近乎有序\"时接近 O(n)，实际最好用。\n- **原地排序（In-place）**：三者都只用到 O(1) 额外空间，都是原地排序。\n\n### 课后练习\n1. 为什么插入排序在\"基本有序\"的数组上很快？\n   - 答案：此时内层 `while` 几乎不执行（每个元素已在正确位置附近），比较/搬移极少，趋近 O(n)；而冒泡/选择仍要 O(n²)。\n2. 选择排序为什么不稳定？\n   - 答案：它把\"最小值\"与前面元素交换，可能把靠后的相等元素换到更前，打破相等元素的原顺序。例 [2a, 2b, 1] 排完变 [1, 2b, 2a]。\n\n### 总结\n基础三排序（冒泡、选择、插入）是算法世界的\"字母表\"——简单到谁都能看懂，却是理解\"比较排序\"思想的起点。它们的复杂度都是 O(n²)，看起来笨，但各自藏着教训：冒泡教会我们\"相邻交换把极值推到边界\"；选择用\"每轮选最小\"示范了贪心；插入则揭示\"维护一个已排区、把新元素插进去\"这个在归并/快排里反复出现的母题。我想纠正一个误区：很多人觉得基础排序没用，因为 `Array.sort` 一行搞定。但亲手写一遍，你才真正理解\"稳定性\"这种细微性质，也才接得住后面 O(n log n) 排序的升级。插入排序尤其值得记住：它虽是 O(n²)，却在小数组或近乎有序时比快排还快，很多语言的内置 sort 在小数组上就切换到插入排序。"
  },
  {
    "id": "dsa-l18",
    "chapter": "sortbin",
    "title": "进阶排序：快排 / 归并 / 堆排序",
    "minutes": 50,
    "content": "### 本节目标\n- 手写快速排序、归并排序、堆排序\n- 理解它们为何是 O(n log n) 及最坏情况\n- 知道工程里如何选排序算法\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l18.js，执行：node dsa-l18.js\n\n// 快速排序：选基准 pivot，分区使左小右大，递归两侧\nfunction quickSort(a) {\n  if (a.length <= 1) return a\n  const [pivot, ...rest] = a\n  const left = rest.filter(x => x < pivot)\n  const right = rest.filter(x => x >= pivot)\n  return [...quickSort(left), pivot, ...quickSort(right)]\n}\n// 原地版（更省空间，用双指针分区，经典写法）：\nfunction quickSortInPlace(a, lo = 0, hi = a.length - 1) {\n  if (lo >= hi) return a\n  let i = lo\n  for (let j = lo; j < hi; j++) if (a[j] < a[hi]) { [a[i], a[j]] = [a[j], a[i]]; i++ }\n  [a[i], a[hi]] = [a[hi], a[i]] // 基准归位\n  quickSortInPlace(a, lo, i - 1); quickSortInPlace(a, i + 1, hi)\n  return a\n}\n\n// 归并排序：分两半各自排好，再合并两个有序数组\nfunction mergeSort(a) {\n  if (a.length <= 1) return a\n  const mid = a.length >> 1\n  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)))\n}\nfunction merge(L, R) {\n  const out = []; let i = 0, j = 0\n  while (i < L.length && j < R.length) out.push(L[i] <= R[j] ? L[i++] : R[j++])\n  return out.concat(L.slice(i), R.slice(j))\n}\n\n// 堆排序：建最大堆，反复把堆顶（最大）换到末尾\nfunction heapSort(a) {\n  a = a.slice()\n  const n = a.length\n  const siftDown = (i, size) => {\n    while (true) {\n      let m = i, l = 2*i+1, r = 2*i+2\n      if (l < size && a[l] > a[m]) m = l\n      if (r < size && a[r] > a[m]) m = r\n      if (m === i) break\n      [a[m], a[i]] = [a[i], a[m]]; i = m\n    }\n  }\n  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(i, n) // 建堆\n  for (let end = n - 1; end > 0; end--) { [a[0], a[end]] = [a[end], a[0]]; siftDown(0, end) }\n  return a\n}\n\nconsole.log(quickSort([5,2,4,1,3]))        // [1,2,3,4,5]\nconsole.log(quickSortInPlace([5,2,4,1,3])) // [1,2,3,4,5]\nconsole.log(mergeSort([5,2,4,1,3]))        // [1,2,3,4,5]\nconsole.log(heapSort([5,2,4,1,3]))         // [1,2,3,4,5]\n```\n\n**复杂度与最坏**：快排平均 O(n log n)，最坏（已排序 + 选末位 pivot）O(n²)，可随机选 pivot 规避；归并稳定 O(n log n) 但需 O(n) 空间；堆排 O(n log n) 原地但不稳定。\n\n### 名词解释\n- **快速排序（Quick Sort）**：分治 + 分区，选基准把数组分成\"小/大\"两半再递归。平均 O(n log n)、原地、缓存友好，是很多语言默认排序的核心。\n- **归并排序（Merge Sort）**：先分后合，合并两个有序数组。稳定、确定 O(n log n)，代价是 O(n) 额外空间；常用于外部排序（数据太大放不下内存）。\n- **堆排序（Heap Sort）**：建堆 + 反复取堆顶。O(n log n)、原地、不需额外空间，但不稳定且缓存局部性较差。\n\n### 课后练习\n1. 快排最坏 O(n²) 怎么避免？\n   - 答案：随机选 pivot（或三数取中），让\"每次都取到极端值\"的概率降到可忽略，实际几乎总是 O(n log n)。\n2. 为什么归并排序稳定而快排不稳定？\n   - 答案：归并合并时遇到相等元素优先取左半的，保持原序；快排的分区交换会跨过相等元素，破坏原序。\n\n### 工业级混合排序算法演进：V8 TimSort 与 Pattern-Defeating Quicksort (pdqsort)\n\n在真实工业生产环境中，没有任何成熟编译器会使用“教科书式的纯快速排序”。自 ECMAScript 2019 规范明确要求 `Array.prototype.sort` **必须保证排序稳定性（Stable Sort）** 以来，各引擎纷纷引入高级混合排序策略（Hybrid Sorting）：\n\n| 排序算法 | 最佳时间复杂度 | 平均时间复杂度 | 最坏时间复杂度 | 额外空间复杂度 | 稳定性 | 现代工业界实际应用场景 |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| **经典快速排序 (QuickSort)** | $O(N \\log N)$ | $O(N \\log N)$ | **$O(N^2)$**（逆序/全相等退化） | $O(\\log N)$ 栈空间 | ❌ 不稳定 | 教学与简单内联场景 |\n| **自适应混合归并 (TimSort)** | **$O(N)$**（完全有序） | $O(N \\log N)$ | $O(N \\log N)$ | $O(N)$ 缓冲空间 | **✔ 严格稳定** | V8 引擎对象排序、Python/Java 官方标准库 |\n| **内省快速排序 (Introsort)** | $O(N \\log N)$ | $O(N \\log N)$ | $O(N \\log N)$（深层切堆排） | $O(\\log N)$ 栈空间 | ❌ 不稳定 | C++ `std::sort` 标配底层 |\n| **防退化快排 (pdqsort)** | **$O(N)$**（预有序/等值值域） | $O(N \\log N)$ | $O(N \\log N)$（三数取中+切片插入）| $O(\\log N)$ 栈空间 | ❌ 不稳定 | Modern V8 / Go 1.19+ 原始类型高性能排序核心 |\n\n```javascript\n// 运行环境：Node.js 14+\n// 实战：工业级双轴快速排序（Dual-Pivot Quicksort）带插入排序阈值截断优化\n\nfunction industrialSort(arr, left = 0, right = arr.length - 1) {\n  // 1. 小数组阈值截断（Threshold Cutoff）：当区间长度 <= 16 时，直接切插入排序避免递归开销\n  if (right - left <= 16) {\n    for (let i = left + 1; i <= right; i++) {\n      const temp = arr[i]\n      let j = i - 1\n      while (j >= left && arr[j] > temp) {\n        arr[j + 1] = arr[j]\n        j--\n      }\n      arr[j + 1] = temp\n    }\n    return arr\n  }\n\n  // 2. 双轴划分（Dual-Pivot Partitioning）：确立双支点 P1 与 P2 (P1 <= P2)\n  if (arr[left] > arr[right]) [arr[left], arr[right]] = [arr[right], arr[left]]\n  const p1 = arr[left]\n  const p2 = arr[right]\n\n  let less = left + 1    // [left+1, less) 存放 < p1 的元素\n  let great = right - 1  // (great, right-1] 存放 > p2 的元素\n  let k = less           // [less, k) 存放 p1 <= x <= p2 的元素\n\n  while (k <= great) {\n    if (arr[k] < p1) {\n      [arr[k], arr[less]] = [arr[less], arr[k]]\n      less++\n      k++\n    } else if (arr[k] > p2) {\n      while (k < great && arr[great] > p2) great--\n      [arr[k], arr[great]] = [arr[great], arr[k]]\n      great--\n      if (arr[k] < p1) {\n        [arr[k], arr[less]] = [arr[less], arr[k]]\n        less++\n      }\n      k++\n    } else {\n      k++\n    }\n  }\n\n  less--; great++\n  [arr[left], arr[less]] = [arr[less], arr[left]]\n  [arr[right], arr[great]] = [arr[great], arr[right]]\n\n  // 3. 递归求解被双轴分割出的三块区域\n  industrialSort(arr, left, less - 1)\n  industrialSort(arr, less + 1, great - 1)\n  industrialSort(arr, less, great) // 中间段\n  industrialSort(arr, great + 1, right)\n\n  return arr\n}\n\nconst data = [29, 10, 14, 37, 14, 25, 1, 88, 3, 50, 4, 18, 9, 33, 21, 6, 75]\nconsole.log('双轴混合排序结果:', industrialSort(data))\n```\n\n\n### 总结\n快排、归并、堆排是\"O(n log n) 三杰\"，理解了它们，排序这一关就真正过了。三者殊途同归都靠\"分治\"把问题拆小，却各有性格：快排最\"快\"——平均最快、缓存友好、原地，是工程默认；归并最\"稳\"——无论数据如何都是稳稳的 O(n log n) 且稳定，适合外部排序；堆排最\"省\"——原地零额外空间，但不稳定。这里有个重要工程认知：没有\"最好\"的排序，只有\"最合适\"的。V8 的 `Array.sort` 对短数组用插入、长数组用快排变体（TimSort 思路），正是这种\"混合策略\"的体现。我建议把快排的分区思想（选基准、小于的放左、大于的放右）当作核心套路反复练——它不只用于排序，还在\"第 k 大\"\"快速选择\"里大显身手。"
  },
  {
    "id": "dsa-l19",
    "chapter": "sortbin",
    "title": "二分查找全解",
    "minutes": 45,
    "content": "### 本节目标\n- 掌握三个二分查找模板（找等于 / 找左边界 / 找右边界）\n- 理解\"旋转数组中的二分\"与\"二分答案\"\n- 能写出不出错的 mid 与边界\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l19.js，执行：node dsa-l19.js\n\n// 模板一：在有序数组找 target（等于即返回）\nfunction binarySearch(a, target) {\n  let lo = 0, hi = a.length - 1\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1\n    if (a[mid] === target) return mid\n    if (a[mid] < target) lo = mid + 1\n    else hi = mid - 1\n  }\n  return -1\n}\n\n// 模板二：找 target 的\"最左\"位置（可不存在，返回插入点）\nfunction lowerBound(a, target) {\n  let lo = 0, hi = a.length\n  while (lo < hi) {\n    const mid = (lo + hi) >> 1\n    if (a[mid] < target) lo = mid + 1\n    else hi = mid\n  }\n  return lo\n}\n\n// 模板三：找 target 的\"最右\"位置\nfunction upperBound(a, target) {\n  let lo = 0, hi = a.length\n  while (lo < hi) {\n    const mid = (lo + hi) >> 1\n    if (a[mid] <= target) lo = mid + 1\n    else hi = mid\n  }\n  return lo\n}\n\n// 旋转数组中的最小值（含重复）：[3,4,5,1,2] -> 1\nfunction findMin(nums) {\n  let lo = 0, hi = nums.length - 1\n  while (lo < hi) {\n    const mid = (lo + hi) >> 1\n    if (nums[mid] > nums[hi]) lo = mid + 1 // 最小值在右半\n    else if (nums[mid] < nums[hi]) hi = mid // 在左半（含 mid）\n    else hi--                               // 相等时收缩右界去重\n  }\n  return nums[lo]\n}\n\n// 二分答案：x 的平方根（向下取整）\nfunction mySqrt(x) {\n  let lo = 0, hi = x\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1\n    if (mid * mid <= x) lo = mid + 1\n    else hi = mid - 1\n  }\n  return hi\n}\n\nconsole.log(binarySearch([1,3,5,7], 5))  // 2\nconsole.log(lowerBound([1,2,2,2,3], 2))  // 1\nconsole.log(upperBound([1,2,2,2,3], 2))  // 4\nconsole.log(findMin([3,4,5,1,2]))        // 1\nconsole.log(mySqrt(8))                   // 2\n```\n\n### 二分查找四大模板：边界闭合区间与单调解空间二分\n\n二分查找写错 90% 源于边界闭合与边界移动不一致。掌握统一的**左闭右闭区间规范**可保零 Bug：\n\n| 二分查找类型 | 退出循环条件 | 满足条件时指针移动 | 返回值含义 |\n| :--- | :--- | :--- | :--- |\n| **基础精确值匹配** | `lo <= hi` | `arr[mid] === target` 立即返回 `mid` | 找到目标下标，未找到返回 -1 |\n| **寻找左侧边界（Lower Bound）** | `lo <= hi` | `arr[mid] >= target` 时 `hi = mid - 1` | 第一个 $\\ge \\text{target}$ 的元素下标（插入位置） |\n| **寻找右侧边界（Upper Bound）** | `lo <= hi` | `arr[mid] <= target` 时 `lo = mid + 1` | 最后一个 $\\le \\text{target}$ 的元素下标 |\n| **单调答案空间二分** | `lo <= hi` | `check(mid)` 为 true 时压缩上界或下界 | 在连续或离散解空间上寻找最小/最大可行解 |\n\n### 名词解释\n- **二分查找（Binary Search）**：在\"有序/单调\"区间每次取中点砍掉一半，O(log n) 定位。前提是\"答案空间有序且可判定\"。\n- **下界 / 上界（lowerBound / upperBound）**：`lowerBound` 返回\"第一个 ≥ target\"的位置，`upperBound` 返回\"第一个 > target\"的位置；二者之差即 target 的出现次数。\n- **二分答案（Binary Search on Answer）**：不直接二分数据，而是二分\"答案的取值范围\"，用判定函数验证可行性。适合\"求最大/最小满足某条件的值\"。\n\n### 课后练习\n1. `binarySearch` 为什么用 `lo <= hi` 而 `lowerBound` 用 `lo < hi`？\n   - 答案：前者找\"确切值\"，区间空（lo>hi）即不存在返回 -1，故含等号；后者找\"边界位置\"，当 lo==hi 时即为答案，故不取等号、最后返回 lo。\n2. 旋转数组 `findMin` 里 `nums[mid] < nums[hi]` 为什么 `hi = mid` 而不是 `mid-1`？\n   - 答案：此时 `mid` 可能正好是最左的最小值（它 ≤ 右段所有值），不能排除，必须保留 `mid`，故 `hi=mid`；若写 `mid-1` 会漏掉它。\n\n### 总结\n二分查找是\"思路极简、写对极难\"的典型。它真正的难点不在\"每次砍一半\"，而在于边界和不变量的设计——`lo/hi` 是闭区间还是半开？`mid` 该不该被保留？一旦想清楚\"循环不变量\"（每轮循环后答案一定还在 `[lo,hi]` 里），三个模板就能统一推导出来。我强烈建议你把\"找等于 / 找左界 / 找右界\"三套模板背熟并理解其差异：前者用 `lo<=hi` 找确切值，后两者用 `lo<hi` 找插入边界。更进阶的是\"二分答案\"——它把二分从\"查数据\"升维到\"猜答案再验证\"，能解平方根、分配问题、最小最大值等一大类题。二分的最高心法就一句：只要\"答案空间单调且能判定\"，就可以二分，不必要求输入数组本身有序。"
  },
  {
    "id": "dsa-l20",
    "chapter": "dp",
    "title": "动态规划入门：状态与转移",
    "minutes": 50,
    "content": "### 本节目标\n- 理解 DP 的\"状态定义 + 转移方程 + 边界\"\n- 手写爬楼梯、打家劫舍、0-1 背包\n- 掌握\"一维 DP\"与\"滚动变量\"优化\n\n**DP 三要素**：① 定义状态 `dp[i]` 表示什么；② 写转移方程 `dp[i] = ...`；③ 定边界（初始值）。本质是\"把大问题拆成重叠子问题，记下来避免重复算\"。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l20.js，执行：node dsa-l20.js\n\n// 1) 爬楼梯：dp[i] = 到第 i 阶的方法数 = dp[i-1]+dp[i-2]\nfunction climbStairs(n) {\n  if (n <= 2) return n\n  let a = 1, b = 2 // dp[i-2], dp[i-1]\n  for (let i = 3; i <= n; i++) [a, b] = [b, a + b]\n  return b\n}\n\n// 2) 打家劫舍：dp[i] = max(不偷 i: dp[i-1], 偷 i: dp[i-2]+nums[i])\nfunction rob(nums) {\n  let prev = 0, cur = 0\n  for (const x of nums) [prev, cur] = [cur, Math.max(cur, prev + x)]\n  return cur\n}\n\n// 3) 0-1 背包：dp[j] = 容量 j 下最大价值；逆序更新避免重复装\nfunction knapsack(weights, values, W) {\n  const dp = new Array(W + 1).fill(0)\n  for (let i = 0; i < weights.length; i++) {\n    for (let j = W; j >= weights[i]; j--) {        // 必须逆序！\n      dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i])\n    }\n  }\n  return dp[W]\n}\n\nconsole.log(climbStairs(5))                    // 8\nconsole.log(rob([2, 7, 9, 3, 1]))              // 12\nconsole.log(knapsack([1, 3, 4], [15, 20, 30], 4)) // 35（选 1+3 重量 4 价值 35）\n```\n\n**为什么背包要逆序**：正序会让同一件物品被多次装入（变成完全背包）；逆序保证每件只用一次。\n\n### 动态规划（DP）本质：无后效性与 0-1 背包空间维度压缩\n\n动态规划不是公式，而是状态转移方程与最优子结构：\n\n| DP 核心要素 | 数学与工程定义 | 典型反例与验证准则 |\n| :--- | :--- | :--- |\n| **最优子结构（Optimal Substructure）** | 全局最优解必然包含局部子问题的最优解 | 最长简单路径问题不具备最优子结构（子图合并出现环） |\n| **无后效性（Markov Property）** | 「未来与过去无关，只取决于现在的状态」 | 若后面的决策受「之前是怎么走到这步」的影响，需将历史维度加入状态空间 |\n| **滚动数组空间压缩** | `dp[i][w]` 仅依赖 `dp[i-1][...]` | 逆序遍历内层循环，直接将二维数组压缩为一维数组，空间从 $O(nW)$ 降至 $O(W)$ |\n\n#### 0-1 背包一维滚动数组逆序遍历的核心原因\n```javascript\n// 0-1 背包一维空间优化模板\nfunction knapsack01(weights, values, W) {\n  const dp = new Int32Array(W + 1)\n  for (let i = 0; i < weights.length; i++) {\n    const w = weights[i]\n    const v = values[i]\n    // ⚠️ 必须逆序遍历！防止同一件物品在同一轮被多次累加计算（变为完全背包）\n    for (let j = W; j >= w; j--) {\n      dp[j] = Math.max(dp[j], dp[j - w] + v)\n    }\n  }\n  return dp[W]\n}\n```\n\n### 名词解释\n- **动态规划（Dynamic Programming, DP）**：把原问题拆成\"重叠子问题\"，用状态表记录子问题答案，避免重复计算。适合有\"最优子结构 + 无后效性\"的问题。\n- **状态（State）与转移（Transition）**：`dp[i]` 定义\"到第 i 步的答案\"，转移方程描述\"如何从已算出的状态推出新状态\"。\n- **滚动数组 / 滚动变量优化**：当 `dp[i]` 只依赖前一两项，不必保留整张表，用两三个变量滚动即可，把空间从 O(n) 降到 O(1)。\n\n### 课后练习\n1. 0-1 背包为什么内层循环必须逆序？\n   - 答案：正序更新时 `dp[j-weights[i]]` 已是\"本层（已装过第 i 件）\"的值，会重复装；逆序保证引用的是\"上一层\"状态，每件仅用一次。\n2. 爬楼梯为什么空间能降到 O(1)？\n   - 答案：`dp[i]` 只依赖 `dp[i-1]` 和 `dp[i-2]`，用 `a,b` 两个滚动变量即可递推，无需数组。\n\n### 总结\n动态规划是算法学习的一道分水岭——很多人能写递归，却在 DP 面前卡死，根因是没建立起\"状态思维\"。DP 不是某种固定套路，而是一种视角：把问题重新表述成\"dp[i] 表示什么\"，然后问\"dp[i] 能从哪些更小的 dp 推导出来\"。一旦状态定义和转移方程立住，代码往往就几行。我特别想强调\"最优子结构\"这个前提：如果子问题的最优解不能拼成全局最优解（比如带路径约束时），DP 就失效，得换思路。另一个容易踩的坑是\"更新顺序\"——0-1 背包逆序、完全背包正序，顺序错了答案天差地别。初学建议从一维 DP（爬楼梯、打家劫舍）入手，体会\"定义状态→写转移→定边界→优化空间\"这条主线，再进阶二维。"
  },
  {
    "id": "dsa-l21",
    "chapter": "dp",
    "title": "DP 进阶与回溯模板",
    "minutes": 55,
    "content": "### 本节目标\n- 掌握 LIS（最长递增子序列）与 LCS（最长公共子序列）\n- 理解回溯的\"选择—递归—撤销\"模板\n- 能手写全排列、子集等经典回溯题\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l21.js，执行：node dsa-l21.js\n\n// 最长递增子序列 LIS：dp[i]=以 i 结尾的 LIS 长度\nfunction lengthOfLIS(nums) {\n  const dp = new Array(nums.length).fill(1)\n  let max = 1\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++)\n      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1)\n    max = Math.max(max, dp[i])\n  }\n  return max\n}\n\n// 最长公共子序列 LCS（二维 DP）\nfunction longestCommonSubsequence(a, b) {\n  const m = a.length, n = b.length\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])\n  return dp[m][n]\n}\n\n// 回溯模板：选择 → 递归 → 撤销\nfunction permutations(nums) {\n  const res = [], path = [], used = new Array(nums.length).fill(false)\n  const backtrack = () => {\n    if (path.length === nums.length) { res.push([...path]); return }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue\n      used[i] = true; path.push(nums[i])  // 选择\n      backtrack()                          // 递归\n      path.pop(); used[i] = false          // 撤销\n    }\n  }\n  backtrack()\n  return res\n}\n\nconsole.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])) // 4 ([2,3,7,101])\nconsole.log(longestCommonSubsequence('abcde', 'ace'))   // 3\nconsole.log(permutations([1, 2, 3]).length)            // 6\n```\n\n### 最长递增子序列（LIS）二分贪心与状态压缩 DP\n\n将看似只能 $O(n^2)$ 的动态规划通过数学单调性提升至 $O(n \\log n)$ 的经典案例：\n\n| 求解算法 | 核心思想与数据结构 | 时间复杂度 | 空间复杂度 |\n| :--- | :--- | :--- | :--- |\n| **基础 DP 转移** | `dp[i] = max(dp[j] + 1)`（$j < i$ 且 $nums[j] < nums[i]$） | $O(n^2)$ | $O(n)$ |\n| **耐心排序 + 二分查找（Patience Sort）** | 维护一个单调递增数组 `tails`，`tails[k]` 存储长度为 $k+1$ 的递增子序列末尾最小可能值 | **$O(n \\log n)$** | $O(n)$ |\n| **位运算状态压缩 DP（Bitmask DP）** | 用整数二进制位（Bit）表达子集包含状态（如 `mask & (1 << i)`） | $O(2^n \\times n)$ | 解决旅行商（TSP）等 NP-Hard 问题的精确解 |\n\n### 名词解释\n- **最长递增子序列（LIS）**：在原序列中删掉若干元素后，得到的\"严格递增且最长\"的子序列。DP O(n²)，用二分可优化到 O(n log n)。\n- **最长公共子序列（LCS）**：两个序列都含有的、顺序一致（可不连续）的最长子序列。二维 DP 经典题，也是\"编辑距离\"的近亲。\n- **回溯（Backtracking）**：深度优先试探所有选择，走不通就\"撤销（回溯）\"回到上一步换条路。模板是\"选择→递归→撤销\"，适合排列/组合/子集/棋盘类穷举。\n\n### 课后练习\n1. 回溯为什么必须\"撤销\"（path.pop()）？\n   - 答案：递归返回后要恢复现场，否则 `path` 会残留上一条分支的元素，污染后续分支；`used` 也要复位，保证每个元素每分支只用一次。\n2. LCS 的转移 `a[i-1]===b[j-1] ? dp[i-1][j-1]+1 : max(...)` 含义？\n   - 答案：字符相等则接上对角（长度+1）；不等则取\"去掉 a 末位\"或\"去掉 b 末位\"两种情况的最大值，体现\"可不连续\"。\n\n### 总结\nDP 进阶与回溯，是算法\"内功\"的两座高峰，但思维截然不同：DP 是\"自底向上用状态表累积答案\"，回溯是\"自顶向下穷举所有选择再剪枝\"。LIS 和 LCS 是 DP 二维思维的入门——LIS 教你看\"以每个位置结尾\"，LCS 教你建二维表表示\"两序列前缀的关系\"。而回溯的精髓全在\"选择—递归—撤销\"这六字真言：它本质上是在解空间树上 DFS，靠 `used/path` 记录现场、靠撤销回退。很多人写回溯乱，是因为没把\"撤销\"当回事——记住，递归返回时世界必须和进入时一模一样。我的建议：DP 先练\"状态定义\"的语感，回溯先背熟模板再往里填\"选择条件\"，两套思维都熟了，你就能对付绝大多数中高难度题。"
  },
  {
    "id": "dsa-l22",
    "chapter": "advanced",
    "title": "并查集实现\"朋友圈\"与动态连通性",
    "minutes": 45,
    "content": "### 本节目标\n- 用并查集实现\"朋友圈分组\"统计\n- 支持\"动态加好友\"后实时查询连通性\n- 体会 DSU 从\"算法题\"到\"工程组件\"的跨越\n\n**场景**：社交 App 里，A 和 B 是好友、B 和 C 是好友，则 A/B/C 同属一个朋友圈。随着好友关系不断新增，要能随时回答\"某两人是否同圈\"\"当前共有几个圈\"。这正是并查集的用武之地。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l22.js，执行：node dsa-l22.js\n\nclass FriendCircle {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i)\n    this.rank = new Array(n).fill(0)\n    this.circles = n // 初始每人一个圈\n  }\n  find(x) {\n    while (this.parent[x] !== x) { this.parent[x] = this.parent[this.parent[x]]; x = this.parent[x] }\n    return x\n  }\n  addFriend(a, b) {                 // 动态加好友\n    const ra = this.find(a), rb = this.find(b)\n    if (ra === rb) return           // 本就同圈\n    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb\n    else { this.parent[rb] = ra; if (this.rank[ra] === this.rank[rb]) this.rank[ra]++ }\n    this.circles--                  // 合并→圈数减一\n  }\n  sameCircle(a, b) { return this.find(a) === this.find(b) }\n  countCircles() { return this.circles }\n}\n\n// 调用示例\nconst fc = new FriendCircle(5)      // 用户 0..4\nfc.addFriend(0, 1)\nfc.addFriend(1, 2)\nfc.addFriend(3, 4)\nconsole.log(fc.sameCircle(0, 2))    // true（0-1-2 同圈）\nconsole.log(fc.sameCircle(0, 3))    // false\nconsole.log(fc.countCircles())      // 2（{0,1,2} 与 {3,4}）\n```\n\n**工程映射**：把\"加好友\"换成\"网络连接\"\"文件去重\"\"图片连通区域\"，底层全是同一套 DSU。它比\"每次 BFS 重算连通\"高效得多——增边 O(α(n))，查询 O(α(n))。\n\n### 并查集扩展：维护连通分量大小与路径回滚机制\n\n并查集在真实社交网络关系或网络连通性判定中，往往需要实时知道某个节点所在集合的人数：\n\n| 并查集高级能力 | 实现技术 | 典型应用 |\n| :--- | :--- | :--- |\n| **连通分量计数** | 初始化 `count = n`，每次合法合并时 `count--` | 快速判断全图是否连通、连通岛屿个数 |\n| **连通集合大小（Size）** | 根节点维护 `size[root]`，合并时 `size[rootA] += size[rootB]` | 朋友圈最大圈子人数、病毒最大扩散范围 |\n| **路径回滚（Rollback）** | 禁用路径压缩，用栈记录每次合并前的指针修改 | 可撤销并查集（离线动态图连通性） |\n\n### 名词解释\n- **动态连通性（Dynamic Connectivity）**：图不断加边（或删边）的过程中，实时回答\"两点是否连通\"。并查集是加边场景下的最优解之一。\n- **朋友圈 / 连通分量（Connected Component）**：图中\"互相可达\"的顶点集合。整个图的连通分量个数 = 并查集里根节点的个数。\n- **几乎常数时间 α(n)**：反阿克曼函数，增长极慢，n 取宇宙原子数也小于 5，实际可视为常数。\n\n### 课后练习\n1. 为什么\"加好友\"用并查集比每加一个就 BFS 重算好？\n   - 答案：BFS 每次 O(V+E)，频繁加边会累积成 O(Q·(V+E))；并查集每次合并/查询近乎 O(1)，Q 次操作总代价 O(Q·α(n))，量级碾压。\n2. `addFriend` 里 `this.circles--` 为什么只在\"原本不同圈\"时减一？\n   - 答案：同圈合并不改变圈数（本来就是一伙）；只有把两个不同圈并在一起，圈的总数才减少 1。\n\n### 总结\n这一节是并查集从\"算法练习题\"走向\"工程组件\"的关键一跃。它告诉我们一个朴素真理：很多看似不同的业务问题（朋友圈、网络连通、图像分割、数据库去重），抽象到最后都是同一个数学模型——动态连通性。并查集之所以是这个问题的标准答案，是因为它在\"不断加边、随时查询\"的模式下，把每次操作压到几乎常数时间，这是任何\"重新遍历\"方案都做不到的。更妙的是，路径压缩 + 按秩合并这两个小技巧，让它的复杂度低到反阿克曼函数（实际等同常数）。我的体会是：当你学会把业务语言翻译成\"并查集操作\"（加边=union、查询=sameSet、计数=根数），你就拥有了解决一类分布式/图连通问题的通用钥匙，这种\"抽象能力\"比背代码值钱得多。"
  },
  {
    "id": "dsa-l23",
    "chapter": "advanced",
    "title": "Trie 实现搜索自动补全与敏感词过滤",
    "minutes": 45,
    "content": "### 本节目标\n- 理解 Trie（前缀树）的结构与用途\n- 手写 Trie 的插入 / 查找 / 前缀匹配\n- 用 Trie 实现搜索框自动补全与敏感词过滤\n\n**Trie（前缀树）**：每条边是一个字符，从根到某节点的路径构成一个前缀。适合\"大量字符串的前缀匹配\"。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l23.js，执行：node dsa-l23.js\n\nclass TrieNode {\n  constructor() { this.children = {}; this.isEnd = false }\n}\nclass Trie {\n  constructor() { this.root = new TrieNode() }\n  insert(word) {                         // 逐字符下钻，末尾标 end\n    let node = this.root\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode()\n      node = node.children[ch]\n    }\n    node.isEnd = true\n  }\n  startsWith(prefix) {                   // 前缀是否存在\n    let node = this.root\n    for (const ch of prefix) {\n      if (!node.children[ch]) return false\n      node = node.children[ch]\n    }\n    return true\n  }\n  collect(node, prefix, out) {           // 收集以 prefix 开头的所有词（自动补全）\n    if (node.isEnd) out.push(prefix)\n    for (const ch in node.children) this.collect(node.children[ch], prefix + ch, out)\n  }\n  autoComplete(prefix) {\n    let node = this.root\n    for (const ch of prefix) {\n      if (!node.children[ch]) return []   // 前缀不存在\n      node = node.children[ch]\n    }\n    const out = []\n    this.collect(node, prefix, out)\n    return out\n  }\n}\n\n// 调用示例：搜索框补全\nconst t = new Trie()\n;['app', 'apple', 'apply', 'apt', 'banana'].forEach(w => t.insert(w))\nconsole.log(t.autoComplete('ap'))   // ['app','apple','apply','apt']\nconsole.log(t.startsWith('ban'))    // true\n\n// 敏感词过滤：遍历文本，Trie 匹配到完整词则打码\nfunction filterSensitive(text, trie) {\n  let result = '', i = 0\n  while (i < text.length) {\n    let node = trie.root, j = i, matched = ''\n    while (j < text.length && node.children[text[j]]) {\n      node = node.children[text[j]]; matched += text[j]; j++\n      if (node.isEnd) break            // 命中完整敏感词\n    }\n    if (node.isEnd) { result += '***'; i = j } // 替换为 ***\n    else { result += text[i]; i++ }\n  }\n  return result\n}\nconst bad = new Trie(); ['垃圾', '广告'].forEach(w => bad.insert(w))\nconsole.log(filterSensitive('这是垃圾信息含广告', bad)) // '这是***信息含***'\n```\n\n### 多模式串匹配：AC 自动机（Aho-Corasick）与双数组 Trie 优化\n\n当面对几万个敏感词要在一篇文章中同时检索时，单纯用 Trie 树逐字重新匹配依然太慢。**AC 自动机（Trie + KMP 思想）** 实现了线性的多模匹配：\n\n| 匹配体系 | 树/图构建复杂度 | 文本检索时间复杂度 | 适用匹配词规模 |\n| :--- | :--- | :--- | :--- |\n| **多次 KMP 搜索** | $K$ 个词构建 $K$ 个前缀表 | $O(K \\times N)$（随敏感词数线性暴涨） | 模式串极少（1～2 个） |\n| **普通 Trie 树滑窗** | $O(\\text{总词长})$ | $O(N \\times \\text{最大词长})$ | 几百个词，文本短 |\n| **AC 自动机（Aho-Corasick）** | 在 Trie 树上通过 BFS 建立失败指针（Fail Pointer） | **严格 $O(N + \\text{匹配项总数})$** | 几十万量级敏感词秒级过滤 |\n\n### 名词解释\n- **Trie（前缀树 / 字典树）**：按字符分层组织的树，根到节点路径 = 一个前缀。插入/查找/前缀匹配都是 O(词长)，与词典大小无关。\n- **自动补全（Autocomplete）**：输入前缀后列出所有以它开头的候选词。Trie 沿前缀走到节点，再 DFS 收集子树所有 `isEnd` 词即可。\n- **敏感词过滤**：把敏感词建成 Trie，扫描文本时沿 Trie 走，命中 `isEnd` 即整词匹配，适合多模式串同时匹配（比逐个 includes 快）。\n\n### 课后练习\n1. 为什么自动补全用 Trie 而不是每次 `filter` 全词典？\n   - 答案：Trie 沿前缀 O(词长) 直达候选子树，只遍历相关词；`filter` 要扫描全部词、且每词做前缀判断，词典大时慢得多。\n2. 敏感词过滤里 `while` 内 `if(node.isEnd) break` 有什么用？\n   - 答案：命中较短敏感词（如\"广告\"）就立即停止延伸，避免被更长词前缀干扰，且保证最短匹配优先替换；若无此 break，会一直走到最长，可能漏掉中间短词。\n\n### 总结\nTrie 是\"用空间换查询效率\"的又一经典：它把一堆字符串按前缀铺成一棵树，使得\"是否以某前缀开头\"\"收集所有前缀匹配\"都变成沿树的线性游走，复杂度只和词长有关、和词典总量无关。这正是搜索框自动补全、输入法联想、路由前缀匹配背后的结构。我特别想点出它和哈希表的分工：哈希擅长\"完整键\"的 O(1) 查找，却对\"前缀\"\"通配\"无能为力；Trie 恰恰补上这块短板。敏感词过滤的例子则展示了 Trie 的\"多模式匹配\"威力——一个 Trie 同时装下所有词，扫一遍文本就能全数命中，远比\"对每个词调用 includes\"高效。学 Trie 的关键不是背节点结构，而是建立\"前缀共享\"的直觉：大量字符串有公共前缀时，Trie 能把重复部分合并存储，省空间又省时间。"
  },
  {
    "id": "dsa-l24",
    "chapter": "advanced",
    "title": "堆与优先队列实现实时排行榜 / TopK 流",
    "minutes": 45,
    "content": "### 本节目标\n- 用堆实现\"实时排行榜\"（支持插入与取 TopK）\n- 理解\"海量数据流 TopK\"的流式处理\n- 体会优先队列在调度 / 限流中的价值\n\n**场景**：直播弹幕实时打分，要随时给出\"当前分最高的前 10 名\"。用最大堆维护 TopK：新分数来了就入堆，堆超 K 就弹出当前最小（若用最小堆）或最大（若用最大堆保留 TopK 最小的）。下面用最小堆保留\"前 K 大\"：\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l24.js，执行：node dsa-l24.js\n\nclass MinHeap {\n  #h = []\n  push(x) { this.#h.push(x); this.#siftUp(this.#h.length - 1) }\n  pop() { if (!this.#h.length) return undefined; const t = this.#h[0], l = this.#h.pop(); if (this.#h.length) { this.#h[0] = l; this.#siftDown(0) } return t }\n  peek() { return this.#h[0] }\n  get size() { return this.#h.length }\n  toArray() { return [...this.#h] }\n  #siftUp(i) { while (i > 0) { const p = (i-1)>>1; if (this.#h[p] <= this.#h[i]) break; [this.#h[p], this.#h[i]] = [this.#h[i], this.#h[p]]; i = p } }\n  #siftDown(i) { const n = this.#h.length; while (true) { let m = i, l = 2*i+1, r = 2*i+2; if (l < n && this.#h[l] < this.#h[m]) m = l; if (r < n && this.#h[r] < this.#h[m]) m = r; if (m === i) break; [this.#h[m], this.#h[i]] = [this.#h[i], this.#h[m]]; i = m } }\n}\n\n// 实时排行榜：保留分数最高的 K 名\nclass Leaderboard {\n  constructor(k) { this.k = k; this.heap = new MinHeap() }\n  submit(score) {\n    this.heap.push(score)\n    if (this.heap.size > this.k) this.heap.pop() // 超出则扔掉当前最小\n  }\n  topK() {\n    const snapshot = this.heap.toArray()        // 复制堆数组\n    return snapshot.sort((a, b) => b - a)         // 降序展示\n  }\n}\n\n// 调用示例：模拟弹幕打分流\nconst lb = new Leaderboard(3)\n;[88, 95, 70, 99, 82, 91].forEach(s => lb.submit(s))\nconsole.log(lb.topK()) // [99, 95, 91]（前 3 高）\n```\n\n**流式 TopK**：数据量太大放不进内存时，不必存全部，只维护大小为 K 的堆，逐条处理，空间 O(K)、时间 O(N log K)。这是日志分析、实时监控的标配。\n\n### 双堆流式中位数追踪器与高频滑动排行榜\n\n在大数据流式计算中，新数据源源不断到来，如何在 $O(1)$ 时间内实时给出中位数？\n\n| 双堆架构设计 | 堆类型与职责 | 堆平衡不变式 |\n| :--- | :--- | :--- |\n| **大顶堆（MaxHeap）** | 存储数据流中**较小的一半**元素 | 维护堆顶为左半部分的最大值 |\n| **小顶堆（MinHeap）** | 存储数据流中**较大的一半**元素 | 维护堆顶为右半部分的最小值 |\n| **平衡规则** | 两堆大小之差不超过 1 | 当总数 $N$ 为奇数时中位数在大顶堆顶，偶数时为两堆顶均值 |\n\n### 名词解释\n- **实时排行榜（Leaderboard）**：动态维护\"当前最优的前 K 个\"。用堆可 O(log K) 插入、O(1) 看当前最小/最大，远快于每次全排序。\n- **数据流 / 流式处理（Streaming）**：数据像水流一样逐条到达，不能回头重算。算法必须\"边到边处理\"，内存只保留必要摘要（如 TopK 堆）。\n- **最大堆 vs 最小堆保留 TopK**：保留\"前 K 大\"用最小堆（堆顶是 K 个里最小的，新值比它大就替换）；保留\"前 K 小\"用最大堆。\n\n### 课后练习\n1. 流式 TopK 为什么只用 O(K) 内存而不是 O(N)？\n   - 答案：堆只保存\"目前见过最优的 K 个\"，新数据若不如堆顶就直接丢弃，无需保留全部 N 条，故内存恒定 O(K)。\n2. `Leaderboard.topK` 为什么先复制堆数组再排序，而不是直接弹堆？\n   - 答案：直接 `pop` 会破坏堆（清空它）；通过 `toArray()` 复制一份数组再排序只是为\"展示\"，不影响后续继续 `submit`。\n\n### 总结\n堆在这一节完成了从\"算法题\"到\"生产组件\"的转身。实时排行榜是几乎所有社交/直播/游戏产品的刚需，而它的内核就是一个 K 大小的堆——新分数入堆、超量就弹堆顶，全程 O(log K)。最打动我的是\"流式 TopK\"这个思想：当数据大到内存装不下（比如全站用户打分日志），你根本不需要存全部，只要维护一个 K 大小的堆边到边处理，内存恒定、结果正确。这背后是\"只需最优摘要、不必保留全集\"的工程智慧，在实时监控、异常检测、推荐候选召回里无处不在。优先队列还有更广的舞台：任务调度按优先级出队、限流器按过期时间弹出、Dijkstra 按距离取最小——凡是\"每次取最值\"的地方，堆都是默认答案。把堆用熟，你会发现一半的\"实时/调度\"问题都迎刃而解。"
  },
  {
    "id": "dsa-l25",
    "chapter": "advanced",
    "title": "图算法（Dijkstra / A*）实现最短路径与游戏寻路",
    "minutes": 50,
    "content": "### 本节目标\n- 用 Dijkstra 在网格图上做最短路径\n- 理解 A* 的\"启发式\"如何加速寻路\n- 体会图算法在游戏 / 地图中的真实应用\n\n**网格寻路**：把地图格子当作图节点，四连通（上下左右）为边，移动代价为 1。Dijkstra 在此退化为 BFS（边权相等）。A* 在此基础上加\"启发式\"——估算到终点的剩余代价，优先探索\"看起来更近\"的方向。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l25.js，执行：node dsa-l25.js\n\n// 0=可走 1=障碍；返回从 (0,0) 到 (m-1,n-1) 的最短步数（Dijkstra/BFS）\nfunction shortestPath(grid) {\n  const m = grid.length, n = grid[0].length\n  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity))\n  dist[0][0] = 0\n  const q = [[0, 0]]                       // 简单队列即可（边权=1）\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]]\n  while (q.length) {\n    const [x, y] = q.shift()\n    for (const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy\n      if (nx<0||ny<0||nx>=m||ny>=n||grid[nx][ny]===1) continue\n      if (dist[x][y] + 1 < dist[nx][ny]) { dist[nx][ny] = dist[x][y] + 1; q.push([nx, ny]) }\n    }\n  }\n  return dist[m-1][n-1]\n}\n\n// A*：加曼哈顿距离启发式 h，用\"f=g+h\"最小优先（演示用数组代替堆）\nfunction astar(grid) {\n  const m = grid.length, n = grid[0].length\n  const h = (x, y) => (m - 1 - x) + (n - 1 - y)   // 曼哈顿距离到终点\n  const g = Array.from({ length: m }, () => new Array(n).fill(Infinity))\n  g[0][0] = 0\n  const open = [{ x: 0, y: 0, f: h(0, 0) }]\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]]\n  while (open.length) {\n    let bi = 0; for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i\n    const { x, y } = open.splice(bi, 1)[0]          // 取 f 最小\n    if (x === m-1 && y === n-1) return g[x][y]\n    for (const [dx, dy] of dirs) {\n      const nx = x+dx, ny = y+dy\n      if (nx<0||ny<0||nx>=m||ny>=n||grid[nx][ny]===1) continue\n      const ng = g[x][y] + 1\n      if (ng < g[nx][ny]) { g[nx][ny] = ng; open.push({ x: nx, y: ny, f: ng + h(nx, ny) }) }\n    }\n  }\n  return Infinity\n}\n\nconst map = [\n  [0,0,0,0],\n  [1,1,0,1],\n  [0,0,0,0],\n  [0,1,1,0],\n]\nconsole.log('Dijkstra/BFS 步数:', shortestPath(map)) // 8\nconsole.log('A* 步数:', astar(map))                  // 8\n```\n\n**A* vs Dijkstra**：Dijkstra 盲目向四周扩散；A* 用启发式 `h` 引导方向，扩展节点更少、更快到达终点（只要 `h` 不高估真实代价）。\n\n### A* 启发式搜索算法与可采纳启发式函数（Admissible Heuristic）\n\nA* 算法是带启发函数的 Dijkstra，它通过评估函数 $f(n) = g(n) + h(n)$ 极大缩小了搜索空间：\n\n| 启发式距离度量 | 移动约束 | 数学计算公式 | 适用游戏/地图场景 |\n| :--- | :--- | :--- | :--- |\n| **曼哈顿距离（Manhattan）** | 仅允许上下左右 4 方向移动 | $h(n) = |x_1 - x_2| + |y_1 - y_2|$ | 网格迷宫、棋盘游戏、城市道路走廊 |\n| **切比雪夫距离（Chebyshev）** | 允许斜向 8 方向移动且对角代价相同 | $h(n) = \\max(|x_1 - x_2|, |y_1 - y_2|)$ | 国际象棋王移动、8 连通网格地图 |\n| **欧几里得距离（Euclidean）** | 允许任意角度直线穿行 | $h(n) = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$ | 开放世界三维寻路、机器人连续轨迹规划 |\n\n### 名词解释\n- **启发式函数（Heuristic）**：对\"从当前状态到目标还需多少代价\"的估算。A* 用 `f = g + h`（已花代价 + 预估剩余）决定下一步，h 越准越快；但 h 不能\"高估\"真实代价，否则可能错过最优解。\n- **曼哈顿距离（Manhattan Distance）**：网格中只能上下左右走时，两点距离 = |Δx| + |Δy|。是网格寻路最自然的启发式。\n- **A***：在 Dijkstra 基础上加启发式引导的寻路算法，是游戏 AI、地图导航的标配（如\"人物自动寻路避开障碍\"）。\n\n### 课后练习\n1. 为什么网格图（边权=1）Dijkstra 等价于 BFS？\n   - 答案：边权都相等时，最先出队的必是步数最少的节点，与 BFS\"逐层扩展\"完全一致，故可简单用队列代替优先队列。\n2. A* 的启发式 `h` 为什么不能高估？\n   - 答案：若 h 高估了剩余代价，A* 可能提前选\"看起来近但其实绕远\"的路径并锁定，从而得不到真正最短解；保持\"不高估\"（可采纳/ admissible）才能保证最优。\n\n### 总结\n图算法在这一节落地成了你能\"看得见\"的东西——游戏里小人对障碍绕行、地图 App 给你规划路线，内核都是最短路径。Dijkstra 在网格上会退化成 BFS，这本身是个很好的认知桥：当所有边权相等，\"最近优先\"就足够。而 A* 则是工程智慧的结晶：它在 Dijkstra 的\"盲目扩散\"上叠加了\"启发式引导\"，像人找路时会朝目的地方向走而不是乱转，从而大幅减少探索的节点。关键约束是启发式不能高估——这一点极具哲理，它提醒我们\"带着先验方向走\"能加速，但\"自以为是的方向\"会让你错过最优。从 Dijkstra 到 A*，你学到的不只是一个算法，而是\"如何在搜索中聪明地剪枝\"这一贯穿 AI、运筹、游戏的核心思想。"
  },
  {
    "id": "dsa-l26",
    "chapter": "advanced",
    "title": "位运算 + 滚动哈希实现轻量文本搜索引擎",
    "minutes": 50,
    "content": "### 本节目标\n- 理解位运算在\"集合表示 / 去重\"中的妙用\n- 手写滚动哈希（Rabin-Karp）做子串检索\n- 体会\"算法实现高级功能\"的整合思路\n\n**位运算妙用**：用一个整数的每一个 bit 表示\"某元素是否在集合\"，适合小规模去重/状态压缩。\n\n```js\n// 运行环境：Node.js 14+\n// 保存为 dsa-l26.js，执行：node dsa-l26.js\n\n// 用位掩码表示集合：第 i 位=1 表示元素 i 在集合内\nfunction setOps() {\n  let A = 0, B = 0\n  for (const i of [0, 2, 4]) A |= (1 << i) // 加入元素\n  for (const i of [1, 2, 3]) B |= (1 << i)\n  const union = A | B          // 并集\n  const inter = A & B          // 交集\n  const diff = A & ~B          // 差集（在 A 不在 B）\n  return { union, inter, diff }\n}\nconsole.log(setOps()) // { union: 31, inter: 4, diff: 21 }\n// 解释：A={0,2,4}=bits 10101=21, B={1,2,3}=bits 01110=14\n// union=31(11111), inter=4(00100=元素2), diff=21(10101=元素0,2,4)\n\n// 两个集合相似度（Jaccard）：交集大小 / 并集大小\nfunction jaccard(a, b) {\n  const inter = (a & b).toString(2).split('').filter(c => c === '1').length\n  const union = (a | b).toString(2).split('').filter(c => c === '1').length\n  return union ? inter / union : 0\n}\nconsole.log(jaccard(21, 14).toFixed(2)) // 0.20（交集1个/并集5个）\n```\n\n**滚动哈希（Rabin-Karp）**：把字符串当作\"_base 进制数\"求模，窗口滑动时 O(1) 更新哈希，高效多模式/子串检索。\n\n```js\n// 在文本 txt 中找出所有出现模式 pat 的起始下标\nfunction rabinKarp(txt, pat) {\n  const base = 131, mod = 1e9 + 7\n  const m = pat.length, n = txt.length\n  if (m > n) return []\n  const pow = (() => { let p = 1; for (let i = 0; i < m - 1; i++) p = (p * base) % mod; return p })()\n  const hash = s => { let h = 0; for (const ch of s) h = (h * base + ch.charCodeAt(0)) % mod; return h }\n  const ph = hash(pat)\n  let th = hash(txt.slice(0, m))\n  const res = []\n  if (th === ph && txt.slice(0, m) === pat) res.push(0)\n  for (let i = m; i < n; i++) {\n    // 滑出 txt[i-m]，滑入 txt[i]\n    th = (th - txt.charCodeAt(i - m) * pow % mod + mod) % mod\n    th = (th * base + txt.charCodeAt(i)) % mod\n    if (th === ph && txt.slice(i - m + 1, i + 1) === pat) res.push(i - m + 1)\n  }\n  return res\n}\nconsole.log(rabinKarp('abracadabra', 'abra')) // [0, 7]\n```\n\n### Rabin-Karp 滚动哈希与多项式哈希冲突防御\n\nRabin-Karp 算法利用滑动窗口在 $O(1)$ 时间内将哈希值「滚动推进」，是文本查重与版本控制的底层利器：\n\n| 哈希滚动手动步骤 | 数学运算式（模大质数 $P$） | 性能与冲突表现 |\n| :--- | :--- | :--- |\n| **滑入新字符** | $\\text{Hash} = (\\text{Hash} \\times B + \\text{code}(C_{\\text{new}})) \\pmod M$ | 均摊时间 $O(1)$ |\n| **剔除老字符** | $\\text{Hash} = (\\text{Hash} - \\text{code}(C_{\\text{old}}) \\times B^{K-1}) \\pmod M$ | 均摊时间 $O(1)$ |\n| **双哈希防御（Double Hash）** | 同时使用两组不同的底数与质数：$(B_1, M_1)$ 和 $(B_2, M_2)$ | 将哈希冲突碰撞概率压缩至 $10^{-18}$，彻底免疫哈希碰撞 DoS 攻击 |\n\n### 名词解释\n- **位运算（Bitwise）**：直接对整数的二进制位操作：`|` 或、`&` 与、`^` 异或、`~` 取反、`<<` 左移。用一个数的 bit 表示集合，是\"状态压缩\"的核心技巧。\n- **滚动哈希（Rolling Hash）**：把字符串视为进制数求模；窗口滑动时\"去掉最左字符贡献、加上最右字符贡献\"，O(1) 更新哈希。Rabin-Karp 借此把子串匹配均摊到 O(n)。\n- **Jaccard 相似度**：两集合相似度 = |交集| / |并集|，取值 [0,1]。常用于文本/推荐去重与近邻判断。\n\n### 课后练习\n1. 位掩码 `A | (1 << i)` 为什么能\"加入元素 i\"？\n   - 答案：`1 << i` 是第 i 位为 1 的掩码，`|` 或运算把 A 的第 i 位置 1，其余位不变，正好表示\"集合中加入 i\"。\n2. `rabinKarp` 里为什么哈希相等后还要 `txt.slice(...) === pat` 再确认？\n   - 答案：哈希可能因取模发生\"哈希冲突\"（不同串同余），所以哈希相等只是疑似匹配，必须用真实子串比对一次排除冲突，保证正确。\n\n### 总结\n这一节是整门课的\"收官彩蛋\"——它把前面零散的算法（位运算、哈希、字符串）缝合成一个能用的小工具，恰好说明\"高级功能=基础算法的组合\"。位运算最迷人之处是用一个整数的 32 个 bit 就能表示一个集合，状态压缩在棋盘/子集枚举里威力巨大；而滚动哈希则展示了\"如何把字符串比较从 O(模式长) 降成 O(1) 均摊\"，是多模式串检索、 plagiarism 检测、DNA 匹配的基石。我想强调 Rabin-Karp 里那个常被忽略的细节：哈希相等不等于真的相等，必须\"再比一次\"排除冲突——这是所有哈希类算法的通用纪律。整门 DSA 走到这里，希望你体会到的不是\"我又背了俩算法\"，而是\"我能用这些零件搭出真正有用的东西\"。算法学习的最终目的，从来不是刷题，而是拥有的这套\"把复杂问题拆成标准零件\"的思维肌肉。"
  }
]

export const dsaPlan = [
  {
    "day": 1,
    "theme": "时间复杂度",
    "lessonIds": [
      "dsa-l1"
    ],
    "practice": [
      "alg-001"
    ],
    "goal": "能分析任意循环/递归代码的复杂度，背出主定理四式"
  },
  {
    "day": 2,
    "theme": "空间复杂度",
    "lessonIds": [
      "dsa-l2"
    ],
    "practice": [],
    "goal": "能手写原地反转，讲清空间换时间案例"
  },
  {
    "day": 3,
    "theme": "JS 引擎与数组",
    "lessonIds": [
      "dsa-l3"
    ],
    "practice": [],
    "goal": "说出 V8 数组两种模式与 shift 的 O(n) 真相"
  },
  {
    "day": 4,
    "theme": "数组进阶",
    "lessonIds": [
      "dsa-l4"
    ],
    "practice": [],
    "goal": "熟练双指针去重/反转，会写区间合并"
  },
  {
    "day": 5,
    "theme": "链表",
    "lessonIds": [
      "dsa-l5"
    ],
    "practice": [
      "alg-003"
    ],
    "goal": "反转/环检测/中间点三题闭眼写"
  },
  {
    "day": 6,
    "theme": "栈与队列",
    "lessonIds": [
      "dsa-l6"
    ],
    "practice": [
      "alg-004"
    ],
    "goal": "有效括号 + 单调栈下一个更大元素"
  },
  {
    "day": 7,
    "theme": "手写结构与周复盘",
    "lessonIds": [
      "dsa-l7"
    ],
    "practice": [
      "alg-001",
      "alg-003",
      "alg-004"
    ],
    "goal": "手写 Stack/Queue/MinHeap，复习第一周"
  },
  {
    "day": 8,
    "theme": "哈希表",
    "lessonIds": [
      "dsa-l8"
    ],
    "practice": [
      "alg-002"
    ],
    "goal": "两数之和哈希版 + 最长无重复子串"
  },
  {
    "day": 9,
    "theme": "字符串算法",
    "lessonIds": [
      "dsa-l9"
    ],
    "practice": [],
    "goal": "中心扩展求最长回文，讲清 KMP 思想"
  },
  {
    "day": 10,
    "theme": "滑动窗口双指针",
    "lessonIds": [
      "dsa-l10"
    ],
    "practice": [
      "alg-010",
      "alg-011"
    ],
    "goal": "变长窗口模板 + 单调队列窗口最大值"
  },
  {
    "day": 11,
    "theme": "二叉树遍历",
    "lessonIds": [
      "dsa-l11"
    ],
    "practice": [
      "alg-005",
      "alg-006"
    ],
    "goal": "前中后序递归+迭代、层序遍历全掌握"
  },
  {
    "day": 12,
    "theme": "二叉搜索树",
    "lessonIds": [
      "dsa-l12"
    ],
    "practice": [],
    "goal": "BST 插入/删除三情况，中序验证 BST"
  },
  {
    "day": 13,
    "theme": "堆与 TopK",
    "lessonIds": [
      "dsa-l13"
    ],
    "practice": [],
    "goal": "手写二叉堆，解 TopK 与合并 K 链表"
  },
  {
    "day": 14,
    "theme": "并查集",
    "lessonIds": [
      "dsa-l14"
    ],
    "practice": [],
    "goal": "路径压缩+按秩合并，解省份数量"
  },
  {
    "day": 15,
    "theme": "图 DFS/BFS",
    "lessonIds": [
      "dsa-l15"
    ],
    "practice": [],
    "goal": "邻接表建图，岛屿数量模板题"
  },
  {
    "day": 16,
    "theme": "最短路与拓扑",
    "lessonIds": [
      "dsa-l16"
    ],
    "practice": [
      "alg-015"
    ],
    "goal": "Dijkstra + 入度法拓扑排序"
  },
  {
    "day": 17,
    "theme": "基础排序",
    "lessonIds": [
      "dsa-l17"
    ],
    "practice": [
      "alg-007"
    ],
    "goal": "冒泡/选择/插入三写，稳定性脱口而出"
  },
  {
    "day": 18,
    "theme": "进阶排序",
    "lessonIds": [
      "dsa-l18"
    ],
    "practice": [
      "alg-008"
    ],
    "goal": "快排+归并+堆排三写，说清最坏情况"
  },
  {
    "day": 19,
    "theme": "二分查找",
    "lessonIds": [
      "dsa-l19"
    ],
    "practice": [
      "alg-009"
    ],
    "goal": "三个二分模板 + 旋转数组 + 二分答案"
  },
  {
    "day": 20,
    "theme": "DP 入门",
    "lessonIds": [
      "dsa-l20"
    ],
    "practice": [
      "alg-012"
    ],
    "goal": "爬楼梯/打家劫舍/0-1背包三题"
  },
  {
    "day": 21,
    "theme": "DP 进阶回溯与收官",
    "lessonIds": [
      "dsa-l21"
    ],
    "practice": [
      "alg-013",
      "alg-014"
    ],
    "goal": "LIS/LCS + 全排列回溯，整门课收官形成算法地图"
  },
  {
    "day": 22,
    "theme": "并查集实战",
    "lessonIds": [
      "dsa-l22"
    ],
    "practice": [
      "alg-015"
    ],
    "goal": "用 DSU 实现朋友圈分组与动态连通查询"
  },
  {
    "day": 23,
    "theme": "Trie 实战",
    "lessonIds": [
      "dsa-l23"
    ],
    "practice": [],
    "goal": "Trie 实现搜索自动补全与敏感词过滤"
  },
  {
    "day": 24,
    "theme": "堆实战",
    "lessonIds": [
      "dsa-l24"
    ],
    "practice": [
      "alg-008"
    ],
    "goal": "堆实现实时排行榜与海量流 TopK"
  },
  {
    "day": 25,
    "theme": "图算法实战",
    "lessonIds": [
      "dsa-l25"
    ],
    "practice": [
      "alg-015"
    ],
    "goal": "Dijkstra/A* 实现最短路径与游戏寻路"
  },
  {
    "day": 26,
    "theme": "位运算与哈希实战",
    "lessonIds": [
      "dsa-l26"
    ],
    "practice": [],
    "goal": "位图相似度 + 滚动哈希检索，收官'用算法实现高级功能'"
  }
]
