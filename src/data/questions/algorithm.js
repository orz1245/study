export const algorithmQuestions = [
  {
    "id": "alg-001",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "复杂度",
      "大O",
      "基础"
    ],
    "question": "什么是时间复杂度和空间复杂度？如何分析大 O 表示法？",
    "answer": "**时间复杂度**描述算法运行时间随输入规模 `n` 增长的趋势；**空间复杂度**描述额外内存随 `n` 增长的趋势。`O()` 只保留最高阶项并忽略常数系数。\n\n分析步骤：\n\n1. 找出随输入规模变化最频繁的操作（基本语句）\n2. 用 `n` 表达其执行次数\n3. 取最高阶、去常数\n\n常见量级（由快到慢）：\n\n```text\nO(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)\n```\n\n```js\n// O(1)：与 n 无关\nfunction first(arr) { return arr[0] }\n\n// O(n)：线性扫描\nfunction sum(arr) {\n  let s = 0\n  for (const x of arr) s += x   // 执行 n 次\n  return s\n}\n\n// O(n^2)：嵌套循环\nfunction bubble(arr) {\n  for (let i = 0; i < arr.length; i++)\n    for (let j = 0; j < arr.length; j++) { /* ... */ }\n}\n```\n\n**注意**：大 O 是「渐进上界」，最坏情况分析最常见；实际还要关注平均情况与常数因子（如 Quick Sort 常数优于 Merge Sort）。\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-002",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "数组",
      "哈希表",
      "Two Sum"
    ],
    "question": "两数之和：给定数组 nums 与目标 target，返回和为 target 的两个元素下标。",
    "answer": "**思路**：用哈希表存「值 → 下标」，遍历时查互补值是否存在，把 `O(n^2)` 降到 `O(n)`。\n\n```js\nfunction twoSum(nums, target) {\n  const map = new Map()\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i]\n    if (map.has(need)) return [map.get(need), i]\n    map.set(nums[i], i)\n  }\n  return []\n}\n```\n\n- 时间 `O(n)`，空间 `O(n)`\n- 只遍历一次，边走边查；找到了立即返回\n- 变体：三数之和用排序 + 双指针（需去重）\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-003",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "链表",
      "反转",
      "递归"
    ],
    "question": "如何反转一个单链表？给出迭代和递归两种写法。",
    "answer": "**迭代**：三指针（prev / cur / next）逐个反转指向。\n\n```js\nfunction reverseIter(head) {\n  let prev = null, cur = head\n  while (cur) {\n    const next = cur.next\n    cur.next = prev\n    prev = cur\n    cur = next\n  }\n  return prev\n}\n```\n\n**递归**：先反转后续，再让后一个节点指向自己。\n\n```js\nfunction reverseRec(head, prev = null) {\n  if (!head) return prev\n  const next = head.next\n  head.next = prev\n  return reverseRec(next, head)\n}\n```\n\n- 时间 `O(n)`，空间：迭代 `O(1)`，递归 `O(n)`（调用栈）\n- 易错点：反转前先保存 `next`，否则链表断裂\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-004",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "栈",
      "括号匹配"
    ],
    "question": "有效的括号：判断字符串中的 () [] {} 是否成对且顺序正确。",
    "answer": "**思路**：左括号入栈，遇右括号弹栈检查是否匹配；最后栈须为空。\n\n```js\nfunction isValid(s) {\n  const map = { ')': '(', ']': '[', '}': '{' }\n  const stack = []\n  for (const ch of s) {\n    if (!map[ch]) stack.push(ch)        // 左括号\n    else {\n      if (stack.pop() !== map[ch]) return false\n    }\n  }\n  return stack.length === 0\n}\n```\n\n- 时间 `O(n)`，空间 `O(n)`\n- 常见变体：最长有效括号（用栈存下标）、删除最少字符使括号有效\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-005",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "二叉树",
      "遍历",
      "栈"
    ],
    "question": "二叉树的前序、中序、后序遍历，分别给出递归与迭代写法。",
    "answer": "**递归**（结构清晰）：\n\n```js\nfunction preorder(root, out = []) {\n  if (!root) return out\n  out.push(root.val)          // 前：根左右\n  preorder(root.left, out)\n  preorder(root.right, out)\n  return out\n}\n// 中序：左根右；后序：左右根（调整三行顺序即可）\n```\n\n**迭代**（用栈模拟）：以前序为例，先压右再压左，保证出栈顺序为根→左→右。\n\n```js\nfunction preorderIter(root) {\n  if (!root) return []\n  const stack = [root], out = []\n  while (stack.length) {\n    const n = stack.pop()\n    out.push(n.val)\n    if (n.right) stack.push(n.right)\n    if (n.left) stack.push(n.left)\n  }\n  return out\n}\n```\n\n- 递归空间 `O(h)`（h 为树高），最坏 `O(n)`\n- 中序遍历 + BST 可得升序序列，常用于「验证 BST / 第 K 小」\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-006",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "二叉树",
      "BFS",
      "层序遍历"
    ],
    "question": "二叉树的层序遍历（按层输出），如何用队列实现？",
    "answer": "**思路**：广度优先（BFS），用队列「逐层」处理，每层先记录长度再统一出队。\n\n```js\nfunction levelOrder(root) {\n  if (!root) return []\n  const queue = [root], res = []\n  while (queue.length) {\n    const size = queue.length   // 当前层节点数\n    const level = []\n    for (let i = 0; i < size; i++) {\n      const n = queue.shift()\n      level.push(n.val)\n      if (n.left) queue.push(n.left)\n      if (n.right) queue.push(n.right)\n    }\n    res.push(level)\n  }\n  return res\n}\n```\n\n- 时间 `O(n)`，空间 `O(n)`（队列最坏存满一层）\n- 变体：之字形层序（偶数层反转）、求树的最大深度\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-007",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "排序",
      "分治",
      "快速排序"
    ],
    "question": "快速排序的核心思想与实现？最坏情况是什么？",
    "answer": "**思想**：分治法。选「基准 pivot」，把小于基准的放左、大于的放右，再递归处理左右两半。\n\n```js\nfunction quickSort(arr, lo = 0, hi = arr.length - 1) {\n  if (lo >= hi) return arr\n  const pivot = arr[hi]\n  let i = lo\n  for (let j = lo; j < hi; j++) {\n    if (arr[j] < pivot) { [arr[i], arr[j]] = [arr[j], arr[i]]; i++ }\n  }\n  [arr[i], arr[hi]] = [arr[hi], arr[i]]   // pivot 归位\n  quickSort(arr, lo, i - 1)\n  quickSort(arr, i + 1, hi)\n  return arr\n}\n```\n\n- 平均 `O(n log n)`，最坏（已排序 + 取末位 pivot）`O(n^2)`\n- 优化：随机选 pivot / 三数取中，避免最坏\n- 原地、常数空间 `O(log n)`（递归栈）；不稳定\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-008",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "排序",
      "归并排序",
      "分治"
    ],
    "question": "归并排序的原理与实现？和快排的区别？",
    "answer": "**思想**：分治 + 合并。先递归拆到单元素，再「两路有序合并」。\n\n```js\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr\n  const mid = arr.length >> 1\n  const left = mergeSort(arr.slice(0, mid))\n  const right = mergeSort(arr.slice(mid))\n  return merge(left, right)\n}\nfunction merge(a, b) {\n  const out = []\n  let i = 0, j = 0\n  while (i < a.length && j < b.length)\n    out.push(a[i] < b[j] ? a[i++] : b[j++])\n  return out.concat(a.slice(i), b.slice(j))\n}\n```\n\n| 对比 | 快排 | 归并 |\n|---|---|---|\n| 平均 | `O(n log n)` | `O(n log n)` |\n| 最坏 | `O(n^2)` | `O(n log n)`（稳定） |\n| 空间 | `O(log n)` | `O(n)` |\n| 稳定性 | 不稳定 | 稳定 |\n\n归并适合链表排序（无需额外空间改指针）。\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-009",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "二分查找",
      "有序数组"
    ],
    "question": "在有序数组中二分查找目标值，并支持查找插入位置（lower_bound）。",
    "answer": "**思想**：每次取中点，比较后丢弃一半区间，直到命中或区间为空。\n\n```js\nfunction binarySearch(nums, target) {\n  let lo = 0, hi = nums.length - 1\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1\n    if (nums[mid] === target) return mid\n    else if (nums[mid] < target) lo = mid + 1\n    else hi = mid - 1\n  }\n  return -1\n}\n\n// 查找第一个 ≥ target 的位置（插入位置）\nfunction lowerBound(nums, target) {\n  let lo = 0, hi = nums.length\n  while (lo < hi) {\n    const mid = (lo + hi) >> 1\n    if (nums[mid] < target) lo = mid + 1\n    else hi = mid\n  }\n  return lo\n}\n```\n\n- 时间 `O(log n)`，空间 `O(1)`\n- 边界易错：`lo/hi` 更新与循环条件要配套（闭区间用 `<=`；左闭右开用 `<`）\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-010",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "滑动窗口",
      "双指针",
      "字符串"
    ],
    "question": "滑动窗口：求字符串中「不含重复字符的最长子串」长度。",
    "answer": "**思路**：维护一个窗口 `[left, right]`，用哈希/集合记录窗口内字符；遇重复就右移 left 直到无重复。\n\n```js\nfunction lengthOfLongestSubstring(s) {\n  const set = new Set()\n  let left = 0, max = 0\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left])\n      left++\n    }\n    set.add(s[right])\n    max = Math.max(max, right - left + 1)\n  }\n  return max\n}\n```\n\n- 时间 `O(n)`（每个字符进出窗口各一次），空间 `O(min(n, m))`（m 为字符集）\n- 滑动窗口通用套路：右扩 → 不满足条件时左缩 → 更新答案\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-011",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "双指针",
      "数组",
      "盛水容器"
    ],
    "question": "双指针：盛最多水的容器（给定高度数组，选两条线使面积最大）。",
    "answer": "**思路**：左右指针夹逼。面积 = 短边 × 距离。每次移动较短的那一端（移动长边不可能增大面积）。\n\n```js\nfunction maxArea(height) {\n  let left = 0, right = height.length - 1, max = 0\n  while (left < right) {\n    const h = Math.min(height[left], height[right])\n    max = Math.max(max, h * (right - left))\n    if (height[left] < height[right]) left++\n    else right--\n  }\n  return max\n}\n```\n\n- 时间 `O(n)`，空间 `O(1)`\n- 经典贪心 + 双指针：证明「移动短板才可能变优」是关键\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-012",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "easy",
    "tags": [
      "动态规划",
      "斐波那契",
      "空间优化"
    ],
    "question": "爬楼梯：一次可走 1 或 2 阶，n 阶共有多少种走法？用 DP 并优化空间。",
    "answer": "`dp[i] = dp[i-1] + dp[i-2]`（第 i 阶要么从 i-1 跨 1 步，要么从 i-2 跨 2 步），本质斐波那契。\n\n```js\n// 自底向上 + 滚动变量，空间 O(1)\nfunction climbStairs(n) {\n  let a = 1, b = 1           // dp[0], dp[1]\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b]\n  }\n  return b\n}\n```\n\n- 时间 `O(n)`，空间 `O(1)`\n- DP 五步：定义状态 → 转移方程 → 初始化 → 遍历顺序 → 举例推导\n- 变体：可走 1/2/3 阶、最小花费爬楼梯（取 min）\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-013",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "hard",
    "tags": [
      "动态规划",
      "LIS",
      "最长递增子序列"
    ],
    "question": "最长递增子序列（LIS）：求数组中最长严格递增子序列长度。",
    "answer": "**法一 DP**：`dp[i]` = 以 `nums[i]` 结尾的 LIS 长度，`O(n^2)`。\n\n**法二 贪心 + 二分**（最优）：维护「tails」数组存各长度递增子序列的最小结尾，用二分插入。\n\n```js\nfunction lengthOfLIS(nums) {\n  const tails = []\n  for (const x of nums) {\n    let lo = 0, hi = tails.length\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1\n      if (tails[mid] < x) lo = mid + 1\n      else hi = mid\n    }\n    tails[lo] = x\n  }\n  return tails.length\n}\n```\n\n- 时间 `O(n log n)`，空间 `O(n)`\n- tails 长度即 LIS 长度（tails 本身不一定是真实子序列，但长度正确）\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-014",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "medium",
    "tags": [
      "回溯",
      "全排列",
      "递归"
    ],
    "question": "回溯：生成数组的所有全排列。",
    "answer": "```js\nfunction permute(nums) {\n  const res = []\n  const path = []\n  const used = new Array(nums.length).fill(false)\n  function backtrack() {\n    if (path.length === nums.length) {\n      res.push([...path])\n      return\n    }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue\n      used[i] = true\n      path.push(nums[i])\n      backtrack()\n      path.pop()          // 撤销选择\n      used[i] = false\n    }\n  }\n  backtrack()\n  return res\n}\n```\n\n- 时间 `O(n · n!)`，空间 `O(n)`\n- 回溯三要素：路径、选择列表、结束条件；核心是「做选择 → 递归 → 撤销选择」\n- 变体：含重复元素需先排序并「同层去重」\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  },
  {
    "id": "alg-015",
    "category": "algorithm",
    "module": "algo-node",
    "difficulty": "hard",
    "tags": [
      "图",
      "拓扑排序",
      "DFS",
      "环检测"
    ],
    "question": "如何判断有向图是否有环？并给出拓扑排序。",
    "answer": "**DFS + 三色标记**：白（未访问）/ 灰（递归中）/ 黑（已完成）。遇到灰节点即存在环。\n\n```js\nfunction topoSort(n, edges) {\n  const adj = Array.from({ length: n }, () => [])\n  for (const [u, v] of edges) adj[u].push(v)\n  const color = new Array(n).fill(0)   // 0白 1灰 2黑\n  const order = []\n  let hasCycle = false\n\n  function dfs(u) {\n    color[u] = 1\n    for (const v of adj[u]) {\n      if (color[v] === 1) { hasCycle = true; return }\n      if (color[v] === 0) dfs(v)\n    }\n    color[u] = 2\n    order.push(u)            // 后序入栈\n  }\n  for (let i = 0; i < n; i++) if (color[i] === 0) dfs(i)\n  return hasCycle ? [] : order.reverse()  // 逆后序 = 拓扑序\n}\n```\n\n- 时间 `O(V + E)`\n- 应用：课程表（207）、依赖构建顺序、任务调度\n- Kahn 算法（入度+BFS）也能做，更适合「边处理」场景\n\n### 复杂度分析与边界条件校验\n\n| 指标维度 | 复杂度与工程说明 |\n| :--- | :--- |\n| **时间复杂度** | 最优线性/对数级扫描，避免嵌套暴力枚举导致的 $O(n^2)$ 退化 |\n| **空间复杂度** | 显式控制辅助栈/哈希表/递归调用栈深度，大数据量下防止 `RangeError: Maximum call stack size exceeded` |\n| **必测边界用例** | 空输入（`[]` / `\"\"` / `null`）、单元素极值、全重复元素、已严格有序或逆序数组、负数与整数溢出边界 |\n\n```javascript\n// 面试现场通用自测断言辅助框架（验证空集、单点与常规用例）\nfunction runAlgorithmSelfCheck(fn, cases) {\n  for (const { input, expected, desc } of cases) {\n    const actual = fn(...input)\n    const pass = JSON.stringify(actual) === JSON.stringify(expected)\n    console.log(pass ? '✔ PASS:' : '✗ FAIL:', desc, { actual, expected })\n  }\n}\n```\n\n### 面试追问与工程延伸\n\n在实际前端业务中（如虚拟列表二分查找锚点、AST 语法树深度/广度遍历、依赖图拓扑排序检测循环引用、大列表 Diff 最长递增子序列），应优先结合业务数据规模选择迭代写法或空间滚动优化，并主动向面试官说明时间与空间的权衡（Time-Space Tradeoff）。"
  }
]
