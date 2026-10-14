// 算法面试题（15 题）
export const algorithmQuestions = [
  {
    id: 'alg-001',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['复杂度', '大O', '基础'],
    question: '什么是时间复杂度和空间复杂度？如何分析大 O 表示法？',
    answer: `**时间复杂度**描述算法运行时间随输入规模 \`n\` 增长的趋势；**空间复杂度**描述额外内存随 \`n\` 增长的趋势。\`O()\` 只保留最高阶项并忽略常数系数。

分析步骤：

1. 找出随输入规模变化最频繁的操作（基本语句）
2. 用 \`n\` 表达其执行次数
3. 取最高阶、去常数

常见量级（由快到慢）：

\`\`\`text
O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)
\`\`\`

\`\`\`js
// O(1)：与 n 无关
function first(arr) { return arr[0] }

// O(n)：线性扫描
function sum(arr) {
  let s = 0
  for (const x of arr) s += x   // 执行 n 次
  return s
}

// O(n^2)：嵌套循环
function bubble(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length; j++) { /* ... */ }
}
\`\`\`

**注意**：大 O 是「渐进上界」，最坏情况分析最常见；实际还要关注平均情况与常数因子（如 Quick Sort 常数优于 Merge Sort）。`
  },
  {
    id: 'alg-002',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['数组', '哈希表', 'Two Sum'],
    question: '两数之和：给定数组 nums 与目标 target，返回和为 target 的两个元素下标。',
    answer: `**思路**：用哈希表存「值 → 下标」，遍历时查互补值是否存在，把 \`O(n^2)\` 降到 \`O(n)\`。

\`\`\`js
function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (map.has(need)) return [map.get(need), i]
    map.set(nums[i], i)
  }
  return []
}
\`\`\`

- 时间 \`O(n)\`，空间 \`O(n)\`
- 只遍历一次，边走边查；找到了立即返回
- 变体：三数之和用排序 + 双指针（需去重）`
  },
  {
    id: 'alg-003',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['链表', '反转', '递归'],
    question: '如何反转一个单链表？给出迭代和递归两种写法。',
    answer: `**迭代**：三指针（prev / cur / next）逐个反转指向。

\`\`\`js
function reverseIter(head) {
  let prev = null, cur = head
  while (cur) {
    const next = cur.next
    cur.next = prev
    prev = cur
    cur = next
  }
  return prev
}
\`\`\`

**递归**：先反转后续，再让后一个节点指向自己。

\`\`\`js
function reverseRec(head, prev = null) {
  if (!head) return prev
  const next = head.next
  head.next = prev
  return reverseRec(next, head)
}
\`\`\`

- 时间 \`O(n)\`，空间：迭代 \`O(1)\`，递归 \`O(n)\`（调用栈）
- 易错点：反转前先保存 \`next\`，否则链表断裂`
  },
  {
    id: 'alg-004',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['栈', '括号匹配'],
    question: '有效的括号：判断字符串中的 () [] {} 是否成对且顺序正确。',
    answer: `**思路**：左括号入栈，遇右括号弹栈检查是否匹配；最后栈须为空。

\`\`\`js
function isValid(s) {
  const map = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const ch of s) {
    if (!map[ch]) stack.push(ch)        // 左括号
    else {
      if (stack.pop() !== map[ch]) return false
    }
  }
  return stack.length === 0
}
\`\`\`

- 时间 \`O(n)\`，空间 \`O(n)\`
- 常见变体：最长有效括号（用栈存下标）、删除最少字符使括号有效`
  },
  {
    id: 'alg-005',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['二叉树', '遍历', '栈'],
    question: '二叉树的前序、中序、后序遍历，分别给出递归与迭代写法。',
    answer: `**递归**（结构清晰）：

\`\`\`js
function preorder(root, out = []) {
  if (!root) return out
  out.push(root.val)          // 前：根左右
  preorder(root.left, out)
  preorder(root.right, out)
  return out
}
// 中序：左根右；后序：左右根（调整三行顺序即可）
\`\`\`

**迭代**（用栈模拟）：以前序为例，先压右再压左，保证出栈顺序为根→左→右。

\`\`\`js
function preorderIter(root) {
  if (!root) return []
  const stack = [root], out = []
  while (stack.length) {
    const n = stack.pop()
    out.push(n.val)
    if (n.right) stack.push(n.right)
    if (n.left) stack.push(n.left)
  }
  return out
}
\`\`\`

- 递归空间 \`O(h)\`（h 为树高），最坏 \`O(n)\`
- 中序遍历 + BST 可得升序序列，常用于「验证 BST / 第 K 小」`
  },
  {
    id: 'alg-006',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['二叉树', 'BFS', '层序遍历'],
    question: '二叉树的层序遍历（按层输出），如何用队列实现？',
    answer: `**思路**：广度优先（BFS），用队列「逐层」处理，每层先记录长度再统一出队。

\`\`\`js
function levelOrder(root) {
  if (!root) return []
  const queue = [root], res = []
  while (queue.length) {
    const size = queue.length   // 当前层节点数
    const level = []
    for (let i = 0; i < size; i++) {
      const n = queue.shift()
      level.push(n.val)
      if (n.left) queue.push(n.left)
      if (n.right) queue.push(n.right)
    }
    res.push(level)
  }
  return res
}
\`\`\`

- 时间 \`O(n)\`，空间 \`O(n)\`（队列最坏存满一层）
- 变体：之字形层序（偶数层反转）、求树的最大深度`
  },
  {
    id: 'alg-007',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['排序', '分治', '快速排序'],
    question: '快速排序的核心思想与实现？最坏情况是什么？',
    answer: `**思想**：分治法。选「基准 pivot」，把小于基准的放左、大于的放右，再递归处理左右两半。

\`\`\`js
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr
  const pivot = arr[hi]
  let i = lo
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) { [arr[i], arr[j]] = [arr[j], arr[i]]; i++ }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]]   // pivot 归位
  quickSort(arr, lo, i - 1)
  quickSort(arr, i + 1, hi)
  return arr
}
\`\`\`

- 平均 \`O(n log n)\`，最坏（已排序 + 取末位 pivot）\`O(n^2)\`
- 优化：随机选 pivot / 三数取中，避免最坏
- 原地、常数空间 \`O(log n)\`（递归栈）；不稳定`
  },
  {
    id: 'alg-008',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['排序', '归并排序', '分治'],
    question: '归并排序的原理与实现？和快排的区别？',
    answer: `**思想**：分治 + 合并。先递归拆到单元素，再「两路有序合并」。

\`\`\`js
function mergeSort(arr) {
  if (arr.length <= 1) return arr
  const mid = arr.length >> 1
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}
function merge(a, b) {
  const out = []
  let i = 0, j = 0
  while (i < a.length && j < b.length)
    out.push(a[i] < b[j] ? a[i++] : b[j++])
  return out.concat(a.slice(i), b.slice(j))
}
\`\`\`

| 对比 | 快排 | 归并 |
|---|---|---|
| 平均 | \`O(n log n)\` | \`O(n log n)\` |
| 最坏 | \`O(n^2)\` | \`O(n log n)\`（稳定） |
| 空间 | \`O(log n)\` | \`O(n)\` |
| 稳定性 | 不稳定 | 稳定 |

归并适合链表排序（无需额外空间改指针）。`
  },
  {
    id: 'alg-009',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['二分查找', '有序数组'],
    question: '在有序数组中二分查找目标值，并支持查找插入位置（lower_bound）。',
    answer: `**思想**：每次取中点，比较后丢弃一半区间，直到命中或区间为空。

\`\`\`js
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (nums[mid] === target) return mid
    else if (nums[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}

// 查找第一个 ≥ target 的位置（插入位置）
function lowerBound(nums, target) {
  let lo = 0, hi = nums.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (nums[mid] < target) lo = mid + 1
    else hi = mid
  }
  return lo
}
\`\`\`

- 时间 \`O(log n)\`，空间 \`O(1)\`
- 边界易错：\`lo/hi\` 更新与循环条件要配套（闭区间用 \`<=\`；左闭右开用 \`<\`）`
  },
  {
    id: 'alg-010',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['滑动窗口', '双指针', '字符串'],
    question: '滑动窗口：求字符串中「不含重复字符的最长子串」长度。',
    answer: `**思路**：维护一个窗口 \`[left, right]\`，用哈希/集合记录窗口内字符；遇重复就右移 left 直到无重复。

\`\`\`js
function lengthOfLongestSubstring(s) {
  const set = new Set()
  let left = 0, max = 0
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left])
      left++
    }
    set.add(s[right])
    max = Math.max(max, right - left + 1)
  }
  return max
}
\`\`\`

- 时间 \`O(n)\`（每个字符进出窗口各一次），空间 \`O(min(n, m))\`（m 为字符集）
- 滑动窗口通用套路：右扩 → 不满足条件时左缩 → 更新答案`
  },
  {
    id: 'alg-011',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['双指针', '数组', '盛水容器'],
    question: '双指针：盛最多水的容器（给定高度数组，选两条线使面积最大）。',
    answer: `**思路**：左右指针夹逼。面积 = 短边 × 距离。每次移动较短的那一端（移动长边不可能增大面积）。

\`\`\`js
function maxArea(height) {
  let left = 0, right = height.length - 1, max = 0
  while (left < right) {
    const h = Math.min(height[left], height[right])
    max = Math.max(max, h * (right - left))
    if (height[left] < height[right]) left++
    else right--
  }
  return max
}
\`\`\`

- 时间 \`O(n)\`，空间 \`O(1)\`
- 经典贪心 + 双指针：证明「移动短板才可能变优」是关键`
  },
  {
    id: 'alg-012',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'easy',
    tags: ['动态规划', '斐波那契', '空间优化'],
    question: '爬楼梯：一次可走 1 或 2 阶，n 阶共有多少种走法？用 DP 并优化空间。',
    answer: `\`dp[i] = dp[i-1] + dp[i-2]\`（第 i 阶要么从 i-1 跨 1 步，要么从 i-2 跨 2 步），本质斐波那契。

\`\`\`js
// 自底向上 + 滚动变量，空间 O(1)
function climbStairs(n) {
  let a = 1, b = 1           // dp[0], dp[1]
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
}
\`\`\`

- 时间 \`O(n)\`，空间 \`O(1)\`
- DP 五步：定义状态 → 转移方程 → 初始化 → 遍历顺序 → 举例推导
- 变体：可走 1/2/3 阶、最小花费爬楼梯（取 min）`
  },
  {
    id: 'alg-013',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'hard',
    tags: ['动态规划', 'LIS', '最长递增子序列'],
    question: '最长递增子序列（LIS）：求数组中最长严格递增子序列长度。',
    answer: `**法一 DP**：\`dp[i]\` = 以 \`nums[i]\` 结尾的 LIS 长度，\`O(n^2)\`。

**法二 贪心 + 二分**（最优）：维护「tails」数组存各长度递增子序列的最小结尾，用二分插入。

\`\`\`js
function lengthOfLIS(nums) {
  const tails = []
  for (const x of nums) {
    let lo = 0, hi = tails.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (tails[mid] < x) lo = mid + 1
      else hi = mid
    }
    tails[lo] = x
  }
  return tails.length
}
\`\`\`

- 时间 \`O(n log n)\`，空间 \`O(n)\`
- tails 长度即 LIS 长度（tails 本身不一定是真实子序列，但长度正确）`
  },
  {
    id: 'alg-014',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'medium',
    tags: ['回溯', '全排列', '递归'],
    question: '回溯：生成数组的所有全排列。',
    answer: `\`\`\`js
function permute(nums) {
  const res = []
  const path = []
  const used = new Array(nums.length).fill(false)
  function backtrack() {
    if (path.length === nums.length) {
      res.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      used[i] = true
      path.push(nums[i])
      backtrack()
      path.pop()          // 撤销选择
      used[i] = false
    }
  }
  backtrack()
  return res
}
\`\`\`

- 时间 \`O(n · n!)\`，空间 \`O(n)\`
- 回溯三要素：路径、选择列表、结束条件；核心是「做选择 → 递归 → 撤销选择」
- 变体：含重复元素需先排序并「同层去重」`
  },
  {
    id: 'alg-015',
    category: 'algorithm',
    module: 'algo-node',
    difficulty: 'hard',
    tags: ['图', '拓扑排序', 'DFS', '环检测'],
    question: '如何判断有向图是否有环？并给出拓扑排序。',
    answer: `**DFS + 三色标记**：白（未访问）/ 灰（递归中）/ 黑（已完成）。遇到灰节点即存在环。

\`\`\`js
function topoSort(n, edges) {
  const adj = Array.from({ length: n }, () => [])
  for (const [u, v] of edges) adj[u].push(v)
  const color = new Array(n).fill(0)   // 0白 1灰 2黑
  const order = []
  let hasCycle = false

  function dfs(u) {
    color[u] = 1
    for (const v of adj[u]) {
      if (color[v] === 1) { hasCycle = true; return }
      if (color[v] === 0) dfs(v)
    }
    color[u] = 2
    order.push(u)            // 后序入栈
  }
  for (let i = 0; i < n; i++) if (color[i] === 0) dfs(i)
  return hasCycle ? [] : order.reverse()  // 逆后序 = 拓扑序
}
\`\`\`

- 时间 \`O(V + E)\`
- 应用：课程表（207）、依赖构建顺序、任务调度
- Kahn 算法（入度+BFS）也能做，更适合「边处理」场景`
  }
]
