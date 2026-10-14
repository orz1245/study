export const vueQuestions = [
  {
    "id": "fw-016",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "Composition API",
      "Options API"
    ],
    "question": "Vue3 Composition API 和 Options API 的区别？为什么要有 Composition API？",
    "answer": "### Options API（选项式）\n\n```vue\n<script>\nexport default {\n  data() {\n    return { count: 0, name: '' }\n  },\n  computed: {\n    double() { return this.count * 2 }\n  },\n  methods: {\n    increment() { this.count++ }\n  },\n  mounted() {\n    console.log('mounted')\n  }\n}\n</script>\n```\n\n### Composition API（组合式）\n\n```vue\n<script setup>\nimport { ref, computed, onMounted } from 'vue'\n\nconst count = ref(0)\nconst name = ref('')\nconst double = computed(() => count.value * 2)\n\nfunction increment() {\n  count.value++\n}\n\nonMounted(() => {\n  console.log('mounted')\n})\n</script>\n```\n\n### 为什么需要 Composition API\n\n**1. 逻辑复用更灵活**\n\n```javascript\n// 自定义 Hook（composable）\nfunction useCounter(initial = 0) {\n  const count = ref(initial)\n  const increment = () => count.value++\n  const decrement = () => count.value--\n  return { count, increment, decrement }\n}\n\n// 任何组件中使用\nconst { count, increment } = useCounter(10)\n```\n\nOptions API 的复用靠 mixin，有命名冲突、来源不清晰的问题。\n\n**2. 逻辑组织更好**\n\nOptions API 中相关逻辑分散在 data、methods、computed、watch 中：\n```javascript\n// 搜索功能分散在各处\nexport default {\n  data() { return { keyword: '', results: [] } },\n  computed() { return { filtered() { /*...*/ } } },\n  methods: { search() { /*...*/ } },\n  watch: { keyword() { /*...*/ } }\n}\n```\n\nComposition API 可以将相关逻辑放在一起：\n```javascript\nfunction useSearch() {\n  const keyword = ref('')\n  const results = ref([])\n  const filtered = computed(...)\n  const search = () => {...}\n  watch(keyword, search)\n  return { keyword, results, filtered, search }\n}\n```\n\n**3. 更好的 TypeScript 支持**\n- Options API 的 `this` 类型推断复杂\n- Composition API 天然友好，类型推断更准确\n\n### 对比\n\n| 特性 | Options API | Composition API |\n|------|-------------|-----------------|\n| 代码组织 | 按选项分组 | 按逻辑分组 |\n| 逻辑复用 | mixin | composable 函数 |\n| this | 需要理解 this | 无 this |\n| TS 支持 | 一般 | 优秀 |\n| 学习曲线 | 低 | 中 |\n| 适合 | 小项目 | 中大型项目 |\n\n### 并非取代\n- Vue3 仍然支持 Options API\n- 可以混用\n- `<script setup>` 是 Composition API 的编译宏语法糖，推荐使用"
  },
  {
    "id": "fw-017",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "ref",
      "reactive",
      "响应式"
    ],
    "question": "Vue3 中 ref 和 reactive 的区别？什么时候用哪个？",
    "answer": "### ref\n\n将**任何类型**的值变成响应式，通过 `.value` 访问。\n\n```javascript\nconst count = ref(0)\nconst name = ref('Tom')\nconst obj = ref({ a: 1 })\n\ncount.value++         // 修改\nconsole.log(count.value)  // 1\nobj.value.a = 2       // 修改对象属性\n```\n\n### reactive\n\n将**对象**变成响应式（Proxy 代理），直接访问属性。\n\n```javascript\nconst state = reactive({\n  count: 0,\n  name: 'Tom'\n})\n\nstate.count++         // 直接修改\nconsole.log(state.count)  // 1\n```\n\n### 核心区别\n\n| 特性 | ref | reactive |\n|------|-----|----------|\n| 支持类型 | 所有类型（原始+对象） | 仅对象/数组 |\n| 访问方式 | `.value` | 直接访问属性 |\n| 解构 | ❌ 失去响应式 | ❌ 失去响应式 |\n| 模板中 | 自动解包，不需要 .value | 直接使用 |\n| 重新赋值 | ✅ `ref.value = newVal` | ❌ 直接赋值失去响应式 |\n| 深层响应 | ✅ | ✅ |\n\n### reactive 的陷阱\n\n**1. 解构丢失响应式**\n```javascript\nconst state = reactive({ count: 0, name: 'Tom' })\nconst { count } = state  // ❌ count 不再是响应式\ncount++  // 不触发更新\n\n// ✅ 解决：toRefs\nconst { count, name } = toRefs(state)\ncount.value++  // 响应式\n```\n\n**2. 重新赋值丢失响应式**\n```javascript\nlet state = reactive({ list: [] })\nstate = reactive({ list: [1, 2] })  // ❌ 新对象不是代理\n\n// ✅ 解决：修改属性\nstate.list = [1, 2]\n\n// ✅ 或用 ref\nconst state = ref({ list: [] })\nstate.value = { list: [1, 2] }  // ✅\n```\n\n### 什么时候用 ref\n\n```javascript\n// 原始类型\nconst count = ref(0)\nconst text = ref('')\n\n// 需要整体替换的对象\nconst user = ref(null)\nuser.value = await fetchUser()  // ✅\n\n// DOM 引用\nconst inputRef = ref(null)\n```\n\n### 什么时候用 reactive\n\n```javascript\n// 一组相关的状态\nconst form = reactive({\n  username: '',\n  password: '',\n  remember: false\n})\n\n// 不需要整体替换的对象\nconst config = reactive({\n  api: '/api/v1',\n  timeout: 5000\n})\n```\n\n### 最佳实践\n- **简单值（数字、字符串、布尔）** → ref\n- **需要替换的对象（如 API 返回的数据）** → ref\n- **一组相关状态** → reactive + toRefs\n- **不确定** → ref（更安全、更一致）\n\n### 模板中的自动解包\n```vue\n<template>\n  <!-- ref 自动解包，不需要 .value -->\n  <div>{{ count }}</div>\n  <div>{{ state.count }}</div>\n</template>\n```"
  },
  {
    "id": "fw-018",
    "category": "vue",
    "module": "framework",
    "difficulty": "hard",
    "tags": [
      "Vue3",
      "响应式",
      "Proxy",
      "原理"
    ],
    "question": "Vue3 响应式系统的原理是什么？和 Vue2 有什么区别？",
    "answer": "### Vue3 响应式原理\n\nVue3 使用 `Proxy` 实现响应式，核心流程：\n\n```text\n读取属性 → track(收集依赖)\n修改属性 → trigger(触发更新)\n```\n\n### reactive 实现（简化版）\n\n```javascript\nconst targetMap = new WeakMap() // 存储依赖关系\nlet activeEffect = null\n\nfunction track(target, key) {\n  if (!activeEffect) return\n  let depsMap = targetMap.get(target)\n  if (!depsMap) targetMap.set(target, (depsMap = new Map()))\n  let dep = depsMap.get(key)\n  if (!dep) depsMap.set(key, (dep = new Set()))\n  dep.add(activeEffect)\n}\n\nfunction trigger(target, key) {\n  const depsMap = targetMap.get(target)\n  if (!depsMap) return\n  const dep = depsMap.get(key)\n  if (dep) dep.forEach(effect => effect())\n}\n\nfunction reactive(target) {\n  return new Proxy(target, {\n    get(target, key, receiver) {\n      track(target, key)\n      return Reflect.get(target, key, receiver)\n    },\n    set(target, key, value, receiver) {\n      const result = Reflect.set(target, key, value, receiver)\n      trigger(target, key)\n      return result\n    }\n  })\n}\n```\n\n### effect 实现\n\n```javascript\nfunction effect(fn) {\n  activeEffect = fn\n  fn() // 执行时触发 get → track\n  activeEffect = null\n}\n\n// 使用\nconst state = reactive({ count: 0 })\neffect(() => {\n  console.log('count:', state.count) // 首次执行，track 收集依赖\n})\nstate.count = 1 // trigger → 重新执行 effect → 输出 'count: 1'\n```\n\n### ref 实现\n\n```javascript\nfunction ref(value) {\n  return {\n    get value() {\n      track(this, 'value')\n      return value\n    },\n    set value(newVal) {\n      value = newVal\n      trigger(this, 'value')\n    }\n  }\n}\n```\n\n### Vue2 vs Vue3\n\n| 特性 | Vue2 (Object.defineProperty) | Vue3 (Proxy) |\n|------|---------------------------|--------------|\n| 监听新增属性 | ❌ 需要 `Vue.set` | ✅ 自动 |\n| 监听删除属性 | ❌ 需要 `Vue.delete` | ✅ 自动 |\n| 监听数组索引 | ❌ 需要 hack | ✅ 自动 |\n| 监听数组长度 | ❌ | ✅ |\n| Map/Set 支持 | ❌ | ✅ |\n| 深层监听 | 初始化时递归 | 懒代理（访问时才代理） |\n| 性能 | 初始化慢 | 初始化快 |\n| 兼容性 | IE9+ | 不支持 IE |\n\n### Vue2 的数组 hack\n```javascript\n// Vue2 需要重写数组方法\nconst arrayMethods = Object.create(Array.prototype)\n['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {\n  arrayMethods[method] = function (...args) {\n    const result = Array.prototype[method].apply(this, args)\n    // 手动触发更新\n    notifyChange(this)\n    return result\n  }\n})\n```\n\n### Vue3 深层响应式（懒代理）\n\n```javascript\n// Vue3 只有在访问深层属性时才创建代理\nconst state = reactive({ user: { name: 'Tom' } })\n// state.user 在首次访问时才被 reactive 包装\n// 比 Vue2 初始化时递归遍历所有属性更高效\n```\n\n### Vue3 的优势\n1. Proxy 原生支持新增/删除属性\n2. 原生支持数组操作\n3. 支持 Map/Set/WeakMap\n4. 懒代理，性能更好\n5. 代码更简洁"
  },
  {
    "id": "fw-019",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "computed",
      "watch",
      "watchEffect"
    ],
    "question": "Vue3 中 computed、watch、watchEffect 的区别？",
    "answer": "### computed（计算属性）\n\n基于其他响应式数据派生新值，**有缓存**，只有依赖变化时才重新计算。\n\n```javascript\nconst count = ref(0)\nconst double = computed(() => count.value * 2)\n// 只有 count 变化时 double 才重新计算\n// 多次访问 double 只计算一次（缓存）\n\n// 可写 computed\nconst fullName = computed({\n  get: () => `${first.value} ${last.value}`,\n  set: (val) => {\n    [first.value, last.value] = val.split(' ')\n  }\n})\n```\n\n### watch（侦听器）\n\n监听响应式数据变化，执行副作用。**需要明确指定监听目标**，有旧值和新值。\n\n```javascript\n// 监听 ref\nwatch(count, (newVal, oldVal) => {\n  console.log(`count: ${oldVal} → ${newVal}`)\n})\n\n// 监听 reactive 属性（需要 getter 函数）\nwatch(() => state.count, (newVal, oldVal) => {\n  console.log(newVal)\n})\n\n// 监听多个\nwatch([count, () => state.name], ([newCount, newName]) => {\n  console.log(newCount, newName)\n})\n\n// 配置选项\nwatch(count, callback, {\n  immediate: true,  // 立即执行一次\n  deep: true,       // 深度监听\n  flush: 'post'     // DOM 更新后执行\n})\n```\n\n### watchEffect（立即执行侦听器）\n\n**自动收集依赖**，不需要指定监听目标。**立即执行一次**，然后依赖变化时重新执行。\n\n```javascript\n// 自动追踪 count 和 name\nwatchEffect(() => {\n  console.log(count.value, name.value)\n})\n\n// 清理副作用\nwatchEffect((onCleanup) => {\n  const timer = setInterval(() => {\n    console.log(count.value)\n  }, 1000)\n  onCleanup(() => clearInterval(timer))\n})\n```\n\n### 对比\n\n| 特性 | computed | watch | watchEffect |\n|------|----------|-------|-------------|\n| 返回值 | ✅ 返回新值 | ❌ | ❌ |\n| 缓存 | ✅ | ❌ | ❌ |\n| 立即执行 | ❌ | 默认❌（可 immediate） | ✅ |\n| 指定监听 | 自动收集 | ✅ 手动指定 | 自动收集 |\n| 获取旧值 | ❌ | ✅ | ❌ |\n| 适合 | 派生数据 | 需要旧值的副作用 | 简单副作用 |\n\n### 使用场景\n\n```javascript\n// computed：派生数据\nconst filteredList = computed(() => \n  list.value.filter(item => item.includes(keyword.value))\n)\n\n// watch：需要旧值或精确控制\nwatch(selectedId, (newId, oldId) => {\n  if (newId !== oldId) fetchData(newId)\n}, { immediate: true })\n\n// watchEffect：简单副作用\nwatchEffect(() => {\n  document.title = `${count.value} items`\n})\n```\n\n### 性能注意\n- computed 有缓存，优先使用\n- watch 的 `deep: true` 性能开销大，谨慎使用\n- watchEffect 自动追踪依赖，但不够显式"
  },
  {
    "id": "fw-020",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "生命周期",
      "onMounted"
    ],
    "question": "Vue3 的生命周期钩子有哪些？和 Vue2 有什么变化？",
    "answer": "### Vue3 生命周期（Composition API）\n\n```javascript\nimport {\n  onBeforeMount,\n  onMounted,\n  onBeforeUpdate,\n  onUpdated,\n  onBeforeUnmount,\n  onUnmounted,\n  onErrorCaptured,\n  onActivated,\n  onDeactivated\n} from 'vue'\n```\n\n### 完整流程\n\n```text\n挂载阶段：\n  setup() → onBeforeMount → DOM 挂载 → onMounted\n\n更新阶段：\n  数据变化 → onBeforeUpdate → DOM 更新 → onUpdated\n\n卸载阶段：\n  onBeforeUnmount → onUnmounted\n\nKeepAlive：\n  onActivated（激活）/ onDeactivated（停用）\n\n错误处理：\n  onErrorCaptured\n```\n\n### Vue2 vs Vue3 对比\n\n| Vue2 | Vue3 (Composition API) | 说明 |\n|------|----------------------|------|\n| beforeCreate | setup() | 已被 setup 取代 |\n| created | setup() | 已被 setup 取代 |\n| beforeMount | onBeforeMount | 挂载前 |\n| mounted | onMounted | 挂载后 |\n| beforeUpdate | onBeforeUpdate | 更新前 |\n| updated | onUpdated | 更新后 |\n| beforeDestroy | onBeforeUnmount | 卸载前（改名） |\n| destroyed | onUnmounted | 卸载后（改名） |\n| activated | onActivated | KeepAlive 激活 |\n| deactivated | onDeactivated | KeepAlive 停用 |\n| errorCaptured | onErrorCaptured | 错误捕获 |\n\n### 使用示例\n\n```javascript\nimport { ref, onMounted, onUnmounted } from 'vue'\n\nexport function useMousePosition() {\n  const x = ref(0)\n  const y = ref(0)\n\n  const update = (e) => {\n    x.value = e.pageX\n    y.value = e.pageY\n  }\n\n  onMounted(() => {\n    window.addEventListener('mousemove', update)\n  })\n\n  onUnmounted(() => {\n    window.removeEventListener('mousemove', update)\n  })\n\n  return { x, y }\n}\n```\n\n### 关键变化\n1. `beforeCreate` / `created` → 直接在 `setup()` 中编写\n2. `destroy` 相关改名为 `unmount`（语义更准确）\n3. 生命周期函数在 `setup` 中**同步**调用\n4. 可以在同一组件中多次调用同一钩子：\n```javascript\nonMounted(() => console.log('first'))\nonMounted(() => console.log('second')) // ✅ 合法\n```\n\n### 新增钩子\n- `onServerPrefetch`：SSR 专用，服务端预取数据\n- `onRenderTracked`：调试用，渲染时追踪依赖（开发模式）\n- `onRenderTriggered`：调试用，触发渲染时调用（开发模式）"
  },
  {
    "id": "fw-021",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "组件通信",
      "provide/inject"
    ],
    "question": "Vue3 组件通信有哪些方式？",
    "answer": "### 1. Props / Emits（父子）\n\n```vue\n<!-- Parent -->\n<template>\n  <Child :message=\"msg\" @update=\"handleUpdate\" />\n</template>\n\n<!-- Child -->\n<script setup>\nconst props = defineProps(['message'])\nconst emit = defineEmits(['update'])\n\nemit('update', newValue)\n</script>\n```\n\n### 2. v-model（双向绑定）\n\n```vue\n<!-- Vue3 支持多个 v-model -->\n<Child v-model:title=\"title\" v-model:content=\"content\" />\n\n<!-- Child -->\n<script setup>\nconst props = defineProps(['title', 'content'])\nconst emit = defineEmits(['update:title', 'update:content'])\n</script>\n```\n\n### 3. provide / inject（跨层级）\n\n```javascript\n// 祖先组件\nimport { provide, ref } from 'vue'\n\nconst theme = ref('dark')\nprovide('theme', theme)  // 提供响应式数据\n\n// 任意后代组件\nimport { inject } from 'vue'\nconst theme = inject('theme')  // 接收\n\n// 带默认值\nconst config = inject('config', { default: true })\n\n// 只读\nimport { readonly } from 'vue'\nprovide('theme', readonly(theme))\n```\n\n### 4. ref（父调子方法）\n\n```vue\n<!-- Parent -->\n<template>\n  <Child ref=\"childRef\" />\n  <button @click=\"childRef.focus()\">Focus</button>\n</template>\n\n<!-- Child -->\n<script setup>\nimport { ref } from 'vue'\nconst inputRef = ref(null)\n\n// 暴露方法给父组件\ndefineExpose({\n  focus: () => inputRef.value?.focus(),\n  clear: () => { /* ... */ }\n})\n</script>\n```\n\n### 5. mitt（事件总线）\n\n```javascript\n// eventBus.js\nimport mitt from 'mitt'\nexport const bus = mitt()\n\n// 组件 A\nbus.emit('custom-event', data)\n\n// 组件 B\nimport { onMounted, onUnmounted } from 'vue'\nonMounted(() => bus.on('custom-event', handler))\nonUnmounted(() => bus.off('custom-event', handler))\n```\n\n### 6. Pinia（全局状态管理）\n\n```javascript\n// store/user.js\nimport { defineStore } from 'pinia'\nexport const useUserStore = defineStore('user', () => {\n  const name = ref('')\n  const setName = (n) => name.value = n\n  return { name, setName }\n})\n\n// 任何组件\nimport { useUserStore } from '@/stores/user'\nconst userStore = useUserStore()\nuserStore.setName('Tom')\n```\n\n### 对比\n\n| 方式 | 场景 | 复杂度 |\n|------|------|--------|\n| Props/Emits | 父子 | 低 |\n| v-model | 父子双向 | 低 |\n| provide/inject | 跨层级 | 中 |\n| ref + defineExpose | 父调子 | 中 |\n| mitt | 任意组件 | 低 |\n| Pinia | 全局状态 | 中 |\n\n### Vue3 变化\n- 移除了 `$children`（改用 ref）\n- 移除了 `$on` / `$off` / `$once`（实例不再实现事件接口）\n- `defineExpose` 替代 Vue2 的直接访问子组件方法"
  },
  {
    "id": "fw-022",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "插槽",
      "slot"
    ],
    "question": "Vue3 中插槽（Slot）有哪些类型？如何使用？",
    "answer": "### 1. 默认插槽\n\n```vue\n<!-- 子组件 Card.vue -->\n<template>\n  <div class=\"card\">\n    <slot></slot> <!-- 父组件传入的内容渲染在这里 -->\n  </div>\n</template>\n\n<!-- 父组件 -->\n<Card>\n  <p>这是卡片内容</p>\n</Card>\n```\n\n### 2. 具名插槽\n\n```vue\n<!-- 子组件 Layout.vue -->\n<template>\n  <div>\n    <header><slot name=\"header\"></slot></header>\n    <main><slot></slot></main>  <!-- 默认插槽 -->\n    <footer><slot name=\"footer\"></slot></footer>\n  </div>\n</template>\n\n<!-- 父组件 -->\n<Layout>\n  <template #header>\n    <h1>标题</h1>\n  </template>\n\n  <p>主要内容</p>  <!-- 默认插槽 -->\n\n  <template #footer>\n    <p>底部信息</p>\n  </template>\n</Layout>\n```\n\n### 3. 作用域插槽（子传父数据）\n\n```vue\n<!-- 子组件 List.vue -->\n<template>\n  <ul>\n    <li v-for=\"item in items\" :key=\"item.id\">\n      <slot :item=\"item\" :index=\"index\"></slot>\n    </li>\n  </ul>\n</template>\n\n<!-- 父组件 -->\n<List :items=\"users\">\n  <template #default=\"{ item, index }\">\n    <span>{{ index }}. {{ item.name }}</span>\n  </template>\n</List>\n\n<!-- 或简写 -->\n<List :items=\"users\">\n  <template=\"{ item }\">\n    <span>{{ item.name }}</span>\n  </template>\n</List>\n```\n\n### 4. 动态插槽名\n\n```vue\n<template #[dynamicSlotName]>\n  <p>动态插槽内容</p>\n</template>\n```\n\n### 5. 插槽默认内容\n\n```vue\n<!-- 子组件 -->\n<template>\n  <slot>默认内容，父组件不传时显示</slot>\n</template>\n```\n\n### 使用 useSlots()\n\n```vue\n<script setup>\nimport { useSlots } from 'vue'\nconst slots = useSlots()\n\n// 判断插槽是否存在\nif (slots.header) {\n  // 有 header 插槽\n}\n</script>\n```\n\n### 实际应用：可复用表格组件\n\n```vue\n<!-- Table.vue -->\n<template>\n  <table>\n    <thead>\n      <tr>\n        <th v-for=\"col in columns\" :key=\"col.key\">\n          {{ col.title }}\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr v-for=\"row in data\" :key=\"row.id\">\n        <td v-for=\"col in columns\" :key=\"col.key\">\n          <!-- 每列都可以自定义渲染 -->\n          <slot :name=\"col.key\" :row=\"row\" :value=\"row[col.key]\">\n            {{ row[col.key] }}  <!-- 默认显示值 -->\n          </slot>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</template>\n\n<!-- 使用 -->\n<Table :columns=\"columns\" :data=\"list\">\n  <template #status=\"{ row }\">\n    <span :class=\"row.status\">{{ row.status }}</span>\n  </template>\n  <template #action=\"{ row }\">\n    <button @click=\"edit(row)\">编辑</button>\n  </template>\n</Table>\n```"
  },
  {
    "id": "fw-023",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "keep-alive",
      "缓存"
    ],
    "question": "Vue 中 keep-alive 的作用和使用方式？",
    "answer": "`<keep-alive>` 用于缓存组件实例，避免重复渲染，保留组件状态。\n\n### 基本用法\n\n```vue\n<template>\n  <!-- 缓存动态组件 -->\n  <keep-alive>\n    <component :is=\"currentComponent\" />\n  </keep-alive>\n\n  <!-- 配合路由 -->\n  <keep-alive>\n    <router-view />\n  </keep-alive>\n</template>\n```\n\n### 属性\n\n```vue\n<!-- include：只缓存匹配的组件 -->\n<keep-alive :include=\"['UserList', 'Dashboard']\">\n  <router-view />\n</keep-alive>\n\n<!-- exclude：不缓存匹配的组件 -->\n<keep-alive :exclude=\"['Login']\">\n  <router-view />\n</keep-alive>\n\n<!-- max：最多缓存数量（LRU 算法） -->\n<keep-alive :max=\"10\">\n  <router-view />\n</keep-alive>\n```\n\n### 生命周期\n\n被 keep-alive 缓存的组件有额外的生命周期：\n\n```javascript\nimport { onActivated, onDeactivated } from 'vue'\n\n// 组件从缓存激活时调用\nonActivated(() => {\n  console.log('组件被激活')\n  // 恢复滚动位置、重新请求数据等\n})\n\n// 组件被缓存（停用）时调用\nonDeactivated(() => {\n  console.log('组件被缓存')\n  // 暂停定时器、保存状态等\n})\n```\n\n### 实际应用\n\n**1. 列表页 → 详情页 → 返回列表页（保持滚动位置和筛选状态）**\n\n```vue\n<!-- App.vue -->\n<keep-alive :include=\"cachedViews\">\n  <router-view />\n</keep-alive>\n```\n\n```javascript\n// 通过路由 meta 控制\nconst routes = [\n  {\n    path: '/list',\n    component: List,\n    meta: { keepAlive: true }  // 需要缓存\n  },\n  {\n    path: '/detail/:id',\n    component: Detail,\n    meta: { keepAlive: false }\n  }\n]\n```\n\n**2. 标签页切换保持状态**\n\n```vue\n<keep-alive>\n  <component :is=\"activeTab\" />\n</keep-alive>\n```\n\n### 注意事项\n\n1. **keep-alive 只缓存有 name 的组件**\n```vue\n<script setup>\n// 需要 defineOptions 设置 name\ndefineOptions({ name: 'UserList' })\n</script>\n```\n\n2. **内存管理**：缓存的组件保留在内存中，`max` 属性限制数量\n\n3. **数据更新问题**：缓存后再次激活不会触发 `onMounted`，需要在 `onActivated` 中处理数据刷新\n\n```javascript\nonActivated(() => {\n  // 每次激活时检查是否需要刷新数据\n  if (needRefresh.value) {\n    fetchData()\n  }\n})\n```\n\n4. **Vue3 变化**：`<keep-alive>` 的 `include/exclude` 支持字符串、正则、数组"
  },
  {
    "id": "fw-024",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "nextTick",
      "DOM更新"
    ],
    "question": "Vue 中 nextTick 的作用是什么？原理是什么？",
    "answer": "### 作用\n\nVue 的 DOM 更新是**异步**的（批量处理），`nextTick` 用于在 DOM 更新完成后执行回调。\n\n```javascript\nimport { ref, nextTick } from 'vue'\n\nconst message = ref('')\n\nasync function updateMessage() {\n  message.value = 'updated'\n  console.log(document.getElementById('msg').textContent) // '' （DOM 还没更新）\n\n  await nextTick()\n  console.log(document.getElementById('msg').textContent) // 'updated' （DOM 已更新）\n}\n```\n\n### 为什么需要 nextTick\n\nVue 将数据变化后的 DOM 更新放到**微任务队列**中批量执行，避免频繁操作 DOM：\n\n```text\n数据变化 → 加入更新队列 → 当前同步代码继续执行 → 微任务执行 → DOM 更新\n```\n\n所以数据变化后立即读取 DOM 拿到的是旧值，需要 `nextTick` 等待 DOM 更新。\n\n### 使用场景\n\n**1. 数据变化后操作 DOM**\n```javascript\nconst showInput = ref(false)\n\nasync function toggleAndFocus() {\n  showInput.value = true\n  await nextTick()\n  // DOM 更新后才能获取到 input 元素\n  inputRef.value.focus()\n}\n```\n\n**2. 获取更新后的元素尺寸**\n```javascript\nconst items = ref([])\n\nasync function addItem() {\n  items.value.push(newItem)\n  await nextTick()\n  // 获取列表最新高度\n  const height = listEl.value.scrollHeight\n  listEl.value.scrollTop = height  // 滚动到底部\n}\n```\n\n**3. 确保子组件已更新**\n```javascript\nconst data = ref([])\n\nasync function refresh() {\n  data.value = await fetchData()\n  await nextTick()\n  // 子组件已用新数据渲染完成\n  childRef.value.doSomething()\n}\n```\n\n### 原理\n\nVue 的更新机制使用微任务（Promise.then）：\n\n```javascript\n// 简化版\nconst callbacks = []\nlet pending = false\n\nfunction flushCallbacks() {\n  pending = false\n  const copies = callbacks.slice()\n  callbacks.length = 0\n  copies.forEach(cb => cb())\n}\n\nfunction nextTick(cb) {\n  callbacks.push(cb)\n  if (!pending) {\n    pending = true\n    Promise.resolve().then(flushCallbacks) // 微任务\n  }\n}\n\n// Vue 内部数据变化时也会调用 nextTick 安排更新\nfunction queueUpdate() {\n  nextTick(flushUpdateQueue)\n}\n```\n\n### Vue 的异步更新策略\n\n```javascript\n// 多次修改数据，只触发一次更新\nstate.count = 1\nstate.count = 2\nstate.count = 3\n// 最终只渲染一次，count = 3\n```\n\n### Vue2 vs Vue3\n- Vue2：优先 `Promise.then` → `MutationObserver` → `setImmediate` → `setTimeout`\n- Vue3：直接使用 `Promise.resolve().then()`（不再降级，需要支持 Promise）"
  },
  {
    "id": "fw-025",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "指令",
      "directive"
    ],
    "question": "Vue 中自定义指令如何编写？有哪些常用场景？",
    "answer": "### 自定义指令\n\n```javascript\n// 全局注册\nconst app = createApp(App)\n\napp.directive('focus', {\n  mounted(el) {\n    el.focus()\n  }\n})\n\n// 局部注册\n<script setup>\nconst vFocus = {\n  mounted: (el) => el.focus()\n}\n</script>\n\n<!-- 使用 -->\n<input v-focus />\n```\n\n### 指令钩子\n\n```javascript\napp.directive('my-directive', {\n  // 元素挂载前\n  created(el, binding, vnode) {},\n  // 元素挂载前（CSS 已确定）\n  beforeMount(el, binding) {},\n  // 挂载后\n  mounted(el, binding) {},\n  // 更新前\n  beforeUpdate(el, binding) {},\n  // 更新后\n  updated(el, binding) {},\n  // 卸载前\n  beforeUnmount(el, binding) {},\n  // 卸载后\n  unmounted(el, binding) {}\n})\n```\n\n### binding 对象\n\n```javascript\n{\n  value: '传递的值',       // v-my=\"value\"\n  oldValue: '旧值',         // 更新时的旧值\n  arg: 'foo',              // v-my:foo\n  modifiers: { lazy: true }, // v-my.lazy\n  dir: { /* 指令定义对象 */ }\n}\n```\n\n### 常用自定义指令示例\n\n**1. v-loading（加载中）**\n```javascript\napp.directive('loading', {\n  mounted(el, binding) {\n    el.style.position = 'relative'\n    const mask = document.createElement('div')\n    mask.className = 'loading-mask'\n    mask.style.display = binding.value ? 'flex' : 'none'\n    el.appendChild(mask)\n    el._loadingMask = mask\n  },\n  updated(el, binding) {\n    if (el._loadingMask) {\n      el._loadingMask.style.display = binding.value ? 'flex' : 'none'\n    }\n  }\n})\n```\n\n**2. v-debounce（防抖点击）**\n```javascript\napp.directive('debounce', {\n  mounted(el, binding) {\n    let timer = null\n    el.addEventListener('click', () => {\n      clearTimeout(timer)\n      timer = setTimeout(() => {\n        binding.value()\n      }, 500)\n    })\n  }\n})\n// <button v-debounce=\"handleClick\">Click</button>\n```\n\n**3. v-permission（权限控制）**\n```javascript\napp.directive('permission', {\n  mounted(el, binding) {\n    if (!hasPermission(binding.value)) {\n      el.parentNode?.removeChild(el)\n    }\n  }\n})\n// <button v-permission=\"'admin'\">删除</button>\n```\n\n**4. v-copy（复制到剪贴板）**\n```javascript\napp.directive('copy', {\n  mounted(el, binding) {\n    el.style.cursor = 'pointer'\n    el.addEventListener('click', () => {\n      navigator.clipboard.writeText(binding.value)\n      showToast('已复制')\n    })\n  }\n})\n// <span v-copy=\"text\">{{ text }}</span>\n```\n\n**5. v-lazy（图片懒加载）**\n```javascript\napp.directive('lazy', {\n  mounted(el, binding) {\n    const observer = new IntersectionObserver(([entry]) => {\n      if (entry.isIntersecting) {\n        el.src = binding.value\n        observer.unobserve(el)\n      }\n    })\n    observer.observe(el)\n    el._observer = observer\n  },\n  unmounted(el) {\n    el._observer?.disconnect()\n  }\n})\n// <img v-lazy=\"imageSrc\" />\n```\n\n### Vue3 变化\n- 钩子名称改变：`bind` → `beforeMount`，`unbind` → `unmounted`\n- `<script setup>` 中以 `v` 开头的变量自动识别为指令"
  },
  {
    "id": "fw-031",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue",
      "Diff",
      "虚拟DOM",
      "原理"
    ],
    "question": "Vue 的虚拟 DOM Diff 算法是怎样的？",
    "answer": "### Vue Diff 策略\n\nVue 的 Diff 算法基于**同层比较**，使用**双端比较**（Vue2）和**最长递增子序列**（Vue3）优化。\n\n### Vue2 双端比较\n\n使用 4 个指针：旧头、旧尾、新头、新尾\n\n```text\n旧：[A, B, C, D]\n     ↑head    ↑tail\n新：[D, A, B, C]\n     ↑head    ↑tail\n\n比较过程：\n1. 旧头 vs 新头 → A vs D ✗\n2. 旧尾 vs 新尾 → D vs C ✗\n3. 旧头 vs 新尾 → A vs C ✗\n4. 旧尾 vs 新头 → D vs D ✓ → 移动 D 到前面\n重复直到完成\n```\n\n### Vue3 快速 Diff + 最长递增子序列\n\nVue3 改进了 Diff 算法：\n\n1. **从头同步**：从头部开始，遇到不同的就停止\n2. **从尾同步**：从尾部开始，遇到不同的就停止\n3. **处理中间部分**：\n   - 如果新节点多 → 挂载新节点\n   - 如果旧节点多 → 卸载旧节点\n   - 如果都有 → 使用**最长递增子序列**最小化 DOM 移动\n\n```text\n旧：[A, B, C, D, E]\n新：[A, D, C, B, E]\n\n头部同步：A ✓\n尾部同步：E ✓\n中间：旧 [B, C, D] → 新 [D, C, B]\n\n新中间在旧中间的位置：[3, 2, 1]（D=3, C=2, B=1）\n最长递增子序列：[2, 1]（C, B 不需要移动）\n只需移动 D\n```\n\n### Key 的作用\n\n```javascript\n// 有 key：精确匹配，最小化 DOM 操作\n// 旧：[{key:1, v:A}, {key:2, v:B}]\n// 新：[{key:2, v:B}, {key:1, v:A}]\n// 结果：移动节点，不销毁重建\n\n// 无 key：按位置比较，内容不同就更新\n// 旧：[A, B]\n// 新：[B, A]\n// 结果：A→B（更新DOM），B→A（更新DOM），2次DOM操作\n```\n\n### Vue vs React Diff\n\n| 特性 | Vue | React |\n|------|-----|-------|\n| 同层比较 | ✅ | ✅ |\n| Key | ✅ 必须 | ✅ 必须 |\n| 算法 | 双端/最长递增子序列 | 右侧遍历 |\n| 移动优化 | 最小移动 | 按需移动 |\n| 复杂度 | O(n) | O(n) |\n\n### Vue3 的优化\n1. **静态提升**：静态节点只创建一次\n2. **PatchFlag**：编译时标记动态节点，Diff 时只比较动态部分\n3. **Block Tree**：将动态节点拍平为数组，跳过静态节点\n4. **缓存事件处理器**：内联函数只创建一次\n\n```javascript\n// 编译后的渲染函数带有 PatchFlag\ncreateVNode('div', { class: 'static' }, 'hello', PatchFlags.TEXT)\n// Diff 时只比较 text，跳过 class\n```"
  },
  {
    "id": "fw-037",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue3",
      "主题切换",
      "暗黑模式",
      "provide/inject",
      "CSS变量"
    ],
    "question": "在 Vue3 中如何实现亮色 / 暗色主题切换？",
    "answer": "Vue3 同样推荐「**CSS 变量 + 根节点 class + provide/inject**」。\n\n### 1. CSS 变量定义主题（同 React 思路）\n\n```css\n:root { --bg: #fff; --text: #111; }\n:root.dark { --bg: #111; --text: #fff; }\n```\n\n### 2. 用 Composition API + provide/inject 管理\n\n```js\n// useTheme.js\nimport { ref, watch } from 'vue'\n\nexport function useTheme() {\n  const theme = ref(localStorage.getItem('theme') || 'light')\n\n  watch(theme, (val) => {\n    document.documentElement.className = val\n    localStorage.setItem('theme', val)\n  }, { immediate: true })\n\n  const toggle = () => {\n    theme.value = theme.value === 'light' ? 'dark' : 'light'\n  }\n  return { theme, toggle }\n}\n```\n\n```vue\n<!-- App.vue -->\n<script setup>\nimport { provide } from 'vue'\nimport { useTheme } from './useTheme'\nconst { theme, toggle } = useTheme()\nprovide('theme', theme)\nprovide('toggleTheme', toggle)\n</script>\n\n<template>\n  <button @click=\"toggle\">切换主题（当前：{{ theme }}）</button>\n  <slot />\n</template>\n```\n\n### 注意\n- 子组件通过 `inject('theme')` 读取，无需逐层传 props。\n- 组件样式全部走 CSS 变量，不要在 `<style>` 里写死颜色，否则换肤失效。\n- 若用 scoped 样式，CSS 变量仍作用在根作用域，不受影响。"
  },
  {
    "id": "vue-001",
    "category": "vue",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "Vue Router",
      "路由守卫",
      "权限"
    ],
    "question": "Vue Router 的导航守卫有哪些？如何实现登录权限控制？",
    "answer": "守卫分三类：\n\n- **全局**：`beforeEach`（最常用，做权限）、`beforeResolve`、`afterEach`（不拦截，做埋点）\n- **路由级**：在路由配置里写 `beforeEnter`\n- **组件级**：`beforeRouteEnter` / `beforeRouteUpdate` / `beforeRouteLeave`\n\n```js\nrouter.beforeEach((to, from, next) => {\n  if (to.meta.requiresAuth && !store.isLogin) {\n    next('/login')          // 未登录跳登录\n  } else {\n    next()                  // 必须调用 next() 放行\n  }\n})\n```\n\n**登录权限**：把需要鉴权的路由标记 `meta.requiresAuth`，在全局 `beforeEach` 里判断是否登录，未登录 `next('/login')`。注意 Vue Router 4 中 `next` 可省略，直接 `return` 路径即可。\n\n### Vue 3 响应式底层细节与生产避坑指南\n\n| 场景维度 | 常见误区写法 | 推荐工程最佳实践 |\n| :--- | :--- | :--- |\n| **响应式解构** | 在 Vue 3.4 之前直接解构 `reactive` 对象导致丢失响应式连接 | 统一使用 `ref()`，或使用 `toRefs(state)`；Vue 3.5+ 已原生支持 `defineProps` 响应式解构 |\n| **副作用清理** | 在 `watch` / `onMounted` 中开启定时器或异步请求未做失效清理 | 使用 `onWatcherCleanup()`（Vue 3.5+）或 `onCleanup` 回调配合 `AbortController` 取消过期请求 |\n| **大列表/不可变数据渲染** | 用 `ref()` 深度代理包含上万条只读数据的图表或表格数组 | 改用 **`shallowRef()`**，避免递归创建数万个 `Proxy` 实例，仅在整体替换 `.value` 时触发更新 |\n\n```vue\n<script setup>\nimport { shallowRef, watch } from 'vue'\n\n// 1. 大数据量列表使用 shallowRef 跳过深层 Proxy 劫持，大幅降低内存与初始化耗时\nconst tableRows = shallowRef([])\n\n// 2. 带竞态取消（Race Condition Prevention）的异步侦听器\nconst searchQuery = shallowRef('')\nwatch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {\n  const controller = new AbortController()\n  onCleanup(() => controller.abort()) // 当用户快速连续输入时，立即中止上一次未完成的请求\n\n  const res = await fetch(`/api/list?q=${encodeURIComponent(newQuery)}`, {\n    signal: controller.signal\n  })\n  tableRows.value = await res.json()\n})\n</script>\n```"
  },
  {
    "id": "vue-002",
    "category": "vue",
    "module": "framework",
    "difficulty": "easy",
    "tags": [
      "路由",
      "history",
      "hash",
      "懒加载"
    ],
    "question": "Vue Router 的 history 模式与 hash 模式区别？路由懒加载怎么做？",
    "answer": "- **hash 模式**：URL 带 `#`，如 `/foo#/bar`，改动不刷新、不请求服务器，兼容好、无需服务端配置\n- **history 模式**：URL 干净（`/foo/bar`），但刷新/直接访问会 404，需服务端把所有路径 fallback 到 `index.html`\n\n```js\nconst routes = [\n  { path: '/about', component: () => import('./About.vue') }  // 懒加载\n]\n```\n\n**路由懒加载**用动态 `import()`，配合 Webpack/Vite 自动拆分成独立 chunk，首屏只加载当前路由代码，大幅减小主包。\n\n### Vue 3 响应式底层细节与生产避坑指南\n\n| 场景维度 | 常见误区写法 | 推荐工程最佳实践 |\n| :--- | :--- | :--- |\n| **响应式解构** | 在 Vue 3.4 之前直接解构 `reactive` 对象导致丢失响应式连接 | 统一使用 `ref()`，或使用 `toRefs(state)`；Vue 3.5+ 已原生支持 `defineProps` 响应式解构 |\n| **副作用清理** | 在 `watch` / `onMounted` 中开启定时器或异步请求未做失效清理 | 使用 `onWatcherCleanup()`（Vue 3.5+）或 `onCleanup` 回调配合 `AbortController` 取消过期请求 |\n| **大列表/不可变数据渲染** | 用 `ref()` 深度代理包含上万条只读数据的图表或表格数组 | 改用 **`shallowRef()`**，避免递归创建数万个 `Proxy` 实例，仅在整体替换 `.value` 时触发更新 |\n\n```vue\n<script setup>\nimport { shallowRef, watch } from 'vue'\n\n// 1. 大数据量列表使用 shallowRef 跳过深层 Proxy 劫持，大幅降低内存与初始化耗时\nconst tableRows = shallowRef([])\n\n// 2. 带竞态取消（Race Condition Prevention）的异步侦听器\nconst searchQuery = shallowRef('')\nwatch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {\n  const controller = new AbortController()\n  onCleanup(() => controller.abort()) // 当用户快速连续输入时，立即中止上一次未完成的请求\n\n  const res = await fetch(`/api/list?q=${encodeURIComponent(newQuery)}`, {\n    signal: controller.signal\n  })\n  tableRows.value = await res.json()\n})\n</script>\n```"
  },
  {
    "id": "vue-003",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Teleport",
      "传送",
      "弹窗"
    ],
    "question": "Vue 的 Teleport 是什么？解决什么场景？",
    "answer": "`<Teleport>` 把组件内部的 DOM **渲染到 DOM 树的其它位置**（如 `body` 末尾），但**逻辑/状态仍属于原组件**。\n\n```vue\n<Teleport to=\"body\">\n  <div v-if=\"show\" class=\"modal\">弹窗内容</div>\n</Teleport>\n```\n\n**典型场景**：\n\n- 全局弹窗 / Toast / 抽屉：避免被父级 `overflow:hidden`、`z-index`、`transform` 层叠上下文影响\n- 需要突破父容器样式隔离的浮层\n\n> 注意：`to=\"body\"` 后元素脱离了组件模板 DOM，但事件、响应式数据、生命周期仍受原组件控制，卸载组件时 Teleport 内容也会一并销毁。\n\n### Vue 3 响应式底层细节与生产避坑指南\n\n| 场景维度 | 常见误区写法 | 推荐工程最佳实践 |\n| :--- | :--- | :--- |\n| **响应式解构** | 在 Vue 3.4 之前直接解构 `reactive` 对象导致丢失响应式连接 | 统一使用 `ref()`，或使用 `toRefs(state)`；Vue 3.5+ 已原生支持 `defineProps` 响应式解构 |\n| **副作用清理** | 在 `watch` / `onMounted` 中开启定时器或异步请求未做失效清理 | 使用 `onWatcherCleanup()`（Vue 3.5+）或 `onCleanup` 回调配合 `AbortController` 取消过期请求 |\n| **大列表/不可变数据渲染** | 用 `ref()` 深度代理包含上万条只读数据的图表或表格数组 | 改用 **`shallowRef()`**，避免递归创建数万个 `Proxy` 实例，仅在整体替换 `.value` 时触发更新 |\n\n```vue\n<script setup>\nimport { shallowRef, watch } from 'vue'\n\n// 1. 大数据量列表使用 shallowRef 跳过深层 Proxy 劫持，大幅降低内存与初始化耗时\nconst tableRows = shallowRef([])\n\n// 2. 带竞态取消（Race Condition Prevention）的异步侦听器\nconst searchQuery = shallowRef('')\nwatch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {\n  const controller = new AbortController()\n  onCleanup(() => controller.abort()) // 当用户快速连续输入时，立即中止上一次未完成的请求\n\n  const res = await fetch(`/api/list?q=${encodeURIComponent(newQuery)}`, {\n    signal: controller.signal\n  })\n  tableRows.value = await res.json()\n})\n</script>\n```"
  },
  {
    "id": "vue-004",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Transition",
      "动画",
      "过渡"
    ],
    "question": "Vue 的 <Transition> 如何做进出场动画？有哪些钩子和类名？",
    "answer": "`<Transition>` 给**单个元素/组件**的插入、更新、移除自动添加 CSS 过渡类名：\n\n```text\nv-enter-from → v-enter-active → v-enter-to   (进入)\nv-leave-from → v-leave-active → v-leave-to   (离开)\n```\n\n```vue\n<Transition name=\"fade\">\n  <p v-if=\"show\">hello</p>\n</Transition>\n<style>\n.fade-enter-active, .fade-leave-active { transition: opacity .3s }\n.fade-enter-from, .fade-leave-to { opacity: 0 }\n</style>\n```\n\n多个元素用 `<TransitionGroup>`（需 `key`）。也可配合 JS 钩子 `@enter` / `@leave` 用 GSAP 等库做复杂动画。列表整体过渡注意 FLIP 动画。\n\n### Vue 3 响应式底层细节与生产避坑指南\n\n| 场景维度 | 常见误区写法 | 推荐工程最佳实践 |\n| :--- | :--- | :--- |\n| **响应式解构** | 在 Vue 3.4 之前直接解构 `reactive` 对象导致丢失响应式连接 | 统一使用 `ref()`，或使用 `toRefs(state)`；Vue 3.5+ 已原生支持 `defineProps` 响应式解构 |\n| **副作用清理** | 在 `watch` / `onMounted` 中开启定时器或异步请求未做失效清理 | 使用 `onWatcherCleanup()`（Vue 3.5+）或 `onCleanup` 回调配合 `AbortController` 取消过期请求 |\n| **大列表/不可变数据渲染** | 用 `ref()` 深度代理包含上万条只读数据的图表或表格数组 | 改用 **`shallowRef()`**，避免递归创建数万个 `Proxy` 实例，仅在整体替换 `.value` 时触发更新 |\n\n```vue\n<script setup>\nimport { shallowRef, watch } from 'vue'\n\n// 1. 大数据量列表使用 shallowRef 跳过深层 Proxy 劫持，大幅降低内存与初始化耗时\nconst tableRows = shallowRef([])\n\n// 2. 带竞态取消（Race Condition Prevention）的异步侦听器\nconst searchQuery = shallowRef('')\nwatch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {\n  const controller = new AbortController()\n  onCleanup(() => controller.abort()) // 当用户快速连续输入时，立即中止上一次未完成的请求\n\n  const res = await fetch(`/api/list?q=${encodeURIComponent(newQuery)}`, {\n    signal: controller.signal\n  })\n  tableRows.value = await res.json()\n})\n</script>\n```"
  },
  {
    "id": "vue-005",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "Vue插件",
      "app.use",
      "自定义指令",
      "WeakMap",
      "内存泄漏防治"
    ],
    "question": "Vue3 插件机制（app.use）与高内聚自定义指令架构如何设计？如何避免指令引发的内存泄漏？",
    "answer": "在大型 Vue3 工程中，零散地编写自定义指令极易导致**全局变量污染、SSR 服务端渲染报错（`getSSRProps` 缺失）以及未清理 DOM 监听器/观察器引发的内存泄漏**。\n\n### 一、 `app.use(plugin, options)` 插件机制底层原理\n\n`app.use` 本质上维护了一个已安装插件集合 `installedPlugins = new Set()`（防止同一插件被重复注册），并支持传入包含 `install(app, ...options)` 方法的对象或直接传入安装函数：\n\n```javascript\nconst installedPlugins = new Set()\nconst app = {\n  use(plugin, ...options) {\n    if (installedPlugins.has(plugin)) {\n      console.warn('Plugin has already been applied to target app.')\n    } else if (plugin && typeof plugin.install === 'function') {\n      installedPlugins.add(plugin)\n      plugin.install(app, ...options)\n    } else if (typeof plugin === 'function') {\n      installedPlugins.add(plugin)\n      plugin(app, ...options)\n    }\n    return app // 支持链式调用\n  }\n}\n```\n\n### 二、 企业级自定义指令设计范式：用 `WeakMap` 替代 `el._xxx` 挂载并兼容 SSR\n\n生产级写法应使用 `WeakMap<Element, Context>` 存储观察器实例，并实现 `getSSRProps` 避免 Nuxt3/SSR 编译报错：\n\n```javascript\nconst observerMap = new WeakMap()\n\nexport const vIntersect = {\n  mounted(el, binding) {\n    const { value, modifiers } = binding\n    if (typeof value !== 'function') return\n\n    const observer = new IntersectionObserver((entries) => {\n      const entry = entries[0]\n      if (entry && entry.isIntersecting) {\n        value(entry)\n        if (modifiers.once) {\n          observer.unobserve(el)\n          observer.disconnect()\n          observerMap.delete(el)\n        }\n      }\n    }, { threshold: 0.2 })\n\n    observer.observe(el)\n    observerMap.set(el, observer)\n  },\n  unmounted(el) {\n    const observer = observerMap.get(el)\n    if (observer) {\n      observer.disconnect()\n      observerMap.delete(el)\n    }\n  },\n  // SSR 服务端渲染安全钩子（服务端无 DOM，返回空属性对象避免崩溃）\n  getSSRProps() {\n    return {}\n  }\n}\n```"
  },
  {
    "id": "vue-006",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "mixins",
      "composables",
      "复用"
    ],
    "question": "mixins 和 composables 有什么区别？为什么 Vue3 推荐组合式函数？",
    "answer": "**mixins（Vue2 遗产）**：\n\n- 多个 mixin 的同名选项会**合并**（data 浅合并、方法覆盖），来源不清晰 → 命名冲突、来源难追溯（\"属性从哪来\"）\n- 不接收参数，复用性差\n\n**composables（Vue3 组合式函数）**：\n\n- 普通函数返回响应式状态，复用清晰、可传参、可读性强\n- 来源明确（import 进来），无隐式合并\n\n```js\n// composables/useCounter.js\nexport function useCounter(initial = 0) {\n  const count = ref(initial)\n  const inc = () => count.value++\n  return { count, inc }\n}\n```\n\n> 结论：新项目一律用 composables；mixins 仅用于维护老 Vue2 代码。\n\n### Vue 3 响应式底层细节与生产避坑指南\n\n| 场景维度 | 常见误区写法 | 推荐工程最佳实践 |\n| :--- | :--- | :--- |\n| **响应式解构** | 在 Vue 3.4 之前直接解构 `reactive` 对象导致丢失响应式连接 | 统一使用 `ref()`，或使用 `toRefs(state)`；Vue 3.5+ 已原生支持 `defineProps` 响应式解构 |\n| **副作用清理** | 在 `watch` / `onMounted` 中开启定时器或异步请求未做失效清理 | 使用 `onWatcherCleanup()`（Vue 3.5+）或 `onCleanup` 回调配合 `AbortController` 取消过期请求 |\n| **大列表/不可变数据渲染** | 用 `ref()` 深度代理包含上万条只读数据的图表或表格数组 | 改用 **`shallowRef()`**，避免递归创建数万个 `Proxy` 实例，仅在整体替换 `.value` 时触发更新 |\n\n```vue\n<script setup>\nimport { shallowRef, watch } from 'vue'\n\n// 1. 大数据量列表使用 shallowRef 跳过深层 Proxy 劫持，大幅降低内存与初始化耗时\nconst tableRows = shallowRef([])\n\n// 2. 带竞态取消（Race Condition Prevention）的异步侦听器\nconst searchQuery = shallowRef('')\nwatch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {\n  const controller = new AbortController()\n  onCleanup(() => controller.abort()) // 当用户快速连续输入时，立即中止上一次未完成的请求\n\n  const res = await fetch(`/api/list?q=${encodeURIComponent(newQuery)}`, {\n    signal: controller.signal\n  })\n  tableRows.value = await res.json()\n})\n</script>\n```"
  },
  {
    "id": "vue-007",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "provide",
      "inject",
      "跨层通信"
    ],
    "question": "Vue 的 provide / inject 怎么用？有什么坑？",
    "answer": "`provide/inject` 实现**跨层级**传递（祖先 → 后代），跳过中间的 props 透传。\n\n```js\n// 祖先\nimport { provide, ref } from 'vue'\nprovide('theme', ref('dark'))\n// 后代\nconst theme = inject('theme', 'light')  // 第二个参数是默认值\n```\n\n**坑**：\n\n1. **不是响应式透传的银弹**：provide 普通值，后代改了祖先感知不到；要响应式必须 provide 一个 `ref` / `reactive`\n2. **耦合**：后代依赖祖先注入了某个 key，组件独立性变差（建议用 Symbol 作 key 避免命名冲突）\n3. 不要用于常规父子通信，那该用 props/emits\n\n> Vue3 里常配合 `inject` 做组件库的「上下文」能力（如 Form 与 FormItem 通信）。\n\n### Vue 3 响应式底层细节与生产避坑指南\n\n| 场景维度 | 常见误区写法 | 推荐工程最佳实践 |\n| :--- | :--- | :--- |\n| **响应式解构** | 在 Vue 3.4 之前直接解构 `reactive` 对象导致丢失响应式连接 | 统一使用 `ref()`，或使用 `toRefs(state)`；Vue 3.5+ 已原生支持 `defineProps` 响应式解构 |\n| **副作用清理** | 在 `watch` / `onMounted` 中开启定时器或异步请求未做失效清理 | 使用 `onWatcherCleanup()`（Vue 3.5+）或 `onCleanup` 回调配合 `AbortController` 取消过期请求 |\n| **大列表/不可变数据渲染** | 用 `ref()` 深度代理包含上万条只读数据的图表或表格数组 | 改用 **`shallowRef()`**，避免递归创建数万个 `Proxy` 实例，仅在整体替换 `.value` 时触发更新 |\n\n```vue\n<script setup>\nimport { shallowRef, watch } from 'vue'\n\n// 1. 大数据量列表使用 shallowRef 跳过深层 Proxy 劫持，大幅降低内存与初始化耗时\nconst tableRows = shallowRef([])\n\n// 2. 带竞态取消（Race Condition Prevention）的异步侦听器\nconst searchQuery = shallowRef('')\nwatch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {\n  const controller = new AbortController()\n  onCleanup(() => controller.abort()) // 当用户快速连续输入时，立即中止上一次未完成的请求\n\n  const res = await fetch(`/api/list?q=${encodeURIComponent(newQuery)}`, {\n    signal: controller.signal\n  })\n  tableRows.value = await res.json()\n})\n</script>\n```"
  },
  {
    "id": "vue-008",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "defineModel",
      "双向绑定",
      "v-model",
      "单向数据流",
      "跨层级通信"
    ],
    "question": "Vue 3.4+ defineModel 双向绑定宏的实现原理是什么？跨层级状态穿透有哪些工程避坑准则？",
    "answer": "在掌握了常规父子 `props / emits`、`provide / inject` 与 Pinia 通信后，深入理解 **Vue 3.4 正式转正的 `defineModel()` 编译器宏原理** 以及 **复杂表单与跨层级通信中的单向数据流边界**，是区分熟练工与架构师的关键考点。\n\n### 一、 `defineModel` 宏的底层编译展开原理\n\n在 Vue 3.4 之前，子组件实现一个支持 `v-model` 的受控属性，必须手动写 `defineProps(['modelValue'])` + `defineEmits(['update:modelValue'])` + `computed({ get, set })` 三段模板代码。`defineModel()` 在编译期将其合三为一，并在内部维护了一个与父级属性同步的本地 `ref`（底层调用 `useModel`）：\n\n```vue\n<!-- 1. 开发者编写的简洁代码（Vue 3.4+） -->\n<script setup>\nconst [keyword, modifiers] = defineModel({\n  type: String,\n  default: '',\n  set(value) {\n    return modifiers.trim ? value.trim() : value\n  }\n})\nconst visible = defineModel('visible', { type: Boolean, default: false })\n</script>\n\n<template>\n  <input v-model=\"keyword\" />\n</template>\n```\n\n```javascript\n// 2. Vue 编译器对上述 defineModel 的真实编译展开产物\nimport { useModel as _useModel } from 'vue'\n\nexport default {\n  props: {\n    modelValue: { type: String, default: '' },\n    modelModifiers: { default: () => ({}) },\n    visible: { type: Boolean, default: false },\n    visibleModifiers: { default: () => ({}) },\n  },\n  emits: ['update:modelValue', 'update:visible'],\n  setup(__props) {\n    // _useModel 内部用 customRef + watchSyncEffect：\n    // 即使父组件根本没传 v-model（作为非受控组件使用），本地 ref 也能独立工作！\n    const keyword = _useModel(__props, 'modelValue')\n    const visible = _useModel(__props, 'visible')\n    return { keyword, visible }\n  }\n}\n```\n\n### 二、 跨层级组件通信的三大工程避坑准则\n\n1. **严禁直接修改引用类型 Prop 的内部属性（打破单向数据流）**：当父组件传入 `<UserForm :form=\"formData\" />` 时，子组件直接 `props.form.name = 'Bob'` 会导致数据变更源头不可追踪。正确做法是通过 `defineModel` 按字段修改或触发事件。\n2. **`provide / inject` 必须配合 `Symbol` InjectionKey 与 `readonly` 包装**：祖先组件向后代提供响应式状态时，应使用 `provide(ThemeSymbol, readonly(state))` 并单独暴露修改方法，防止任意深层孙组件直接篡改全局上下文。"
  },
  {
    "id": "vue-009",
    "category": "vue",
    "module": "framework",
    "difficulty": "hard",
    "tags": [
      "Vue3.4响应式",
      "双向链表",
      "版本计数",
      "computed优化",
      "alien-signals"
    ],
    "question": "Vue 3.4+ 响应式系统做了哪些底层重构？基于双向链表与版本计数（Version Counting）的依赖收集是如何工作的？",
    "answer": "在掌握了 Vue2 `Object.defineProperty` 与 Vue3 `Proxy` 基础差异后，深入理解 **Vue 3.4 / 3.5（受 Preact Signals 与 `alien-signals` 启发）对 `@vue/reactivity` 的底层重写**，是高级前端面试中的高分利器。\n\n### 一、 早期 Vue 3.0~3.3 响应式引擎的三大性能痛点\n\n在 Vue 3.0~3.3 中，每个属性依赖桶 `Dep` 是一个 `Set<ReactiveEffect>`，每次副作用函数重新执行前都要先调用 `cleanupEffect` 把自己从所有 `Set` 中删除再重新收集，存在三个开销瓶颈：\n1. **频繁的 `Set` 内存分配与增删开销**：每次组件更新都要反复清空并重建 `Set`。\n2. **`computed` 假阳性重触发（Dirty 级联传染）**：当上游 `ref` 发生改变但 `computed` 计算出的新值与旧值实际上相等（如 `count.value = 2 -> 4`，而 `isEven = computed(() => count.value % 2 === 0)` 依然是 `true`）时，旧版依然会无脑唤醒下游的组件 `effect`。\n3. **深层计算属性链路的重复求值**：在菱形依赖图（`A -> B & C -> D`）中，更改 `A` 容易导致 `D` 被多次标记或冗余计算。\n\n### 二、 Vue 3.4 / 3.5+ 的核心重构：版本计数（Version Counting）+ 双向链表（Doubly-Linked List）\n\nVue 3.4+ 与 3.5 引入了**全局/局部递增版本号（`version`）**与**`Link` 双向十字链表节点**，彻底消除了每次渲染清空 `Set` 的开销：\n\n```javascript\n// Vue 3.5 响应式双向链表与版本计数核心数据结构简化实现\nclass Dep {\n  version = 0\n  subs = undefined // 订阅该 Dep 的链表尾节点\n  notify() {\n    this.version++\n    for (let link = this.subs; link; link = link.prevSub) {\n      link.sub.notify()\n    }\n  }\n}\n\nclass ComputedRefImpl {\n  _value = undefined\n  dep = new Dep()\n  deps = undefined // 依赖的上游链表头\n  dirty = true\n\n  get value() {\n    trackRefValue(this)\n    // 通过 O(1) 比对上游每个 Dep 的 version 与 Link 记录的 version，\n    // 只有当上游真实值变化导致 version 不一致时，才重新执行 getter！\n    if (this.dirty && checkDirty(this.deps)) {\n      const newValue = this.fn()\n      // 只有当计算出的新旧值不相等（!Object.is）时，才递增自身 dep.version！\n      if (!Object.is(this._value, newValue)) {\n        this._value = newValue\n        this.dep.version++\n      }\n      this.dirty = false\n    }\n    return this._value\n  }\n}\n```\n\n### 三、 重构前后的核心指标对比\n\n| 优化维度 | Vue 3.2（Set 模型） | Vue 3.4 / 3.5+（链表 + 版本号模型） |\n| :--- | :--- | :--- |\n| **依赖收集数据结构** | 每个属性创建 `new Set()`，每次更新销毁重建 | 复用双向链表节点 `Link`，仅在动态分支切换时裁剪尾部失效节点 |\n| **内存占用** | 基准值（100%） | **降低约 50%**（消除海量小对象 `Set` 实例） |\n| **`computed` 值未变时的下游更新** | 会误触发下游 `watchEffect` / 组件重渲染 | **完全静默拦截**：`Object.is(oldVal, newVal)` 相同时不递增 `dep.version` |"
  },
  {
    "id": "vue-010",
    "category": "vue",
    "module": "framework",
    "difficulty": "hard",
    "tags": [
      "性能优化",
      "编译优化",
      "PatchFlag"
    ],
    "question": "Vue3 做了哪些编译期/运行时性能优化？",
    "answer": "Vue 3 相比 Vue 2 的巨大性能飞跃源于**“编译器深度静态分析（Compiler-informed Virtual DOM）+ 运行时 Proxy 惰性代理与最长递增子序列 Diff”**的双重协同。\n\n### 一、 编译期四大核心优化（把传统全量树遍历降维成靶向数组遍历）\n\n1. **补丁标记（PatchFlags）**：编译器在解析模板时，为带有动态绑定的节点打上二进制位标记（如 `1 /* TEXT */`、`2 /* CLASS */`、`8 /* PROPS */`），运行时 Diff 只需按位与（`patchFlag & 1`）直接更新文本或指定属性，跳过其它全量属性对比。\n2. **靶向更新块树（Block Tree / `dynamicChildren`）**：这是最关键的优化！传统虚拟 DOM 必须按树层级逐层递归比对所有子节点；Vue 3 将根节点或 `v-if`/`v-for` 节点作为 `Block`，将内部所有带 `PatchFlag` 的动态后代直接拍平收集到 `block.dynamicChildren` 数组中，更新时**直接遍历这个一维动态数组，彻底跳过所有静态子树**。\n3. **静态提升（`hoistStatic`）与预字符串化（`cacheStatic`）**：纯静态节点被提升到 `render()` 函数外部只创建一次 VNode；当连续静态节点达到阈值（如 20 个）时，编译器直接将其压成一段静态 HTML 字符串（`_createStaticVNode(\"<div>...</div>\", 20)`），通过 `innerHTML` 一次性挂载。\n4. **内联事件处理函数缓存（`cacheHandlers`）**：将 `@click=\"count++\"` 自动缓存到 `_cache[0]` 中，避免每次重渲染产生新函数引用导致子组件无意义更新。\n\n### 二、 编译产物真实代码对比（直观看到 PatchFlags 与 Block Tree）\n\n```html\n<!-- 原始 Vue 模板 -->\n<template>\n  <div class=\"card\">\n    <h2>静态标题（永远不会变）</h2>\n    <p :class=\"{ active: isActive }\">{{ message }}</p>\n    <button @click=\"onClick\">点我</button>\n  </div>\n</template>\n```\n\n```javascript\n// Vue 3 模板编译器生成的真实渲染函数产物\nimport { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, openBlock as _openBlock, createElementBlock as _createElementBlock } from 'vue'\n\n// 1. 静态提升：<h2> 节点被提升到 render 函数外部，全局只分配一次内存！\nconst _hoisted_1 = /*#__PURE__*/ _createElementVNode(\"h2\", null, \"静态标题（永远不会变）\", -1 /* HOISTED */)\n\nexport function render(_ctx, _cache) {\n  // 2. openBlock + createElementBlock 收集所有动态后代到 dynamicChildren 一维数组\n  return (_openBlock(), _createElementBlock(\"div\", { class: \"card\" }, [\n    _hoisted_1,\n    // 3. PatchFlag = 3 (1 TEXT | 2 CLASS)：更新时只比对 textContent 和 class，绝不碰其它属性！\n    _createElementVNode(\"p\", {\n      class: _normalizeClass({ active: _ctx.isActive })\n    }, _toDisplayString(_ctx.message), 3 /* TEXT, CLASS */),\n    // 4. 事件缓存：_cache[0] 复用同一个内联函数引用\n    _createElementVNode(\"button\", {\n      onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.onClick && _ctx.onClick(...args)))\n    }, \"点我\")\n  ]))\n}\n```\n\n### 三、 运行时三大优化\n\n1. **惰性响应式代理（Lazy Reactive）**：Vue 2 启动时必须递归 `Object.defineProperty` 遍历整个深层对象；Vue 3 的 `reactive(obj)` 仅代理最外层，只有当深层属性真正被访问（`get` 拦截触发）时才按需递归转为响应式。\n2. **基于最长递增子序列（LIS）的快速 Diff 算法**：在同层列表比对时，先做头尾双端预处理剔除相同前后缀，再对乱序区间求解最长递增子序列，将真实 DOM 的 `insertBefore` 移动次数降到数学理论最小值。\n3. **SSR 编译优化**：在服务端渲染时，直接将模板编译为高效的字符串拼接（String Buffer Pushing），绕过大部分虚拟 DOM 节点创建。"
  },
  {
    "id": "vue-011",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "异步组件",
      "Suspense",
      "defineAsyncComponent"
    ],
    "question": "Vue 的异步组件和 Suspense 怎么用？",
    "answer": "**异步组件**：用 `defineAsyncComponent` 懒加载，常配合 loading/error 状态：\n\n```js\nimport { defineAsyncComponent } from 'vue'\nconst AsyncComp = defineAsyncComponent({\n  loader: () => import('./Heavy.vue'),\n  loadingComponent: Loading,\n  errorComponent: ErrorComp,\n  delay: 200, timeout: 3000\n})\n```\n\n**Suspense**：等待其下「异步 setup / async 组件」就绪后再渲染，提供 `#fallback` 插槽：\n\n```vue\n<Suspense>\n  <template #default><AsyncUser /></template>\n  <template #fallback><Spinner /></template>\n</Suspense>\n```\n\n> 异步组件的 `loader` 返回 Promise（通常是动态 `import`）；Suspense 负责统一\"等待多个异步依赖\"。\n\n### Vue 3 响应式底层细节与生产避坑指南\n\n| 场景维度 | 常见误区写法 | 推荐工程最佳实践 |\n| :--- | :--- | :--- |\n| **响应式解构** | 在 Vue 3.4 之前直接解构 `reactive` 对象导致丢失响应式连接 | 统一使用 `ref()`，或使用 `toRefs(state)`；Vue 3.5+ 已原生支持 `defineProps` 响应式解构 |\n| **副作用清理** | 在 `watch` / `onMounted` 中开启定时器或异步请求未做失效清理 | 使用 `onWatcherCleanup()`（Vue 3.5+）或 `onCleanup` 回调配合 `AbortController` 取消过期请求 |\n| **大列表/不可变数据渲染** | 用 `ref()` 深度代理包含上万条只读数据的图表或表格数组 | 改用 **`shallowRef()`**，避免递归创建数万个 `Proxy` 实例，仅在整体替换 `.value` 时触发更新 |\n\n```vue\n<script setup>\nimport { shallowRef, watch } from 'vue'\n\n// 1. 大数据量列表使用 shallowRef 跳过深层 Proxy 劫持，大幅降低内存与初始化耗时\nconst tableRows = shallowRef([])\n\n// 2. 带竞态取消（Race Condition Prevention）的异步侦听器\nconst searchQuery = shallowRef('')\nwatch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {\n  const controller = new AbortController()\n  onCleanup(() => controller.abort()) // 当用户快速连续输入时，立即中止上一次未完成的请求\n\n  const res = await fetch(`/api/list?q=${encodeURIComponent(newQuery)}`, {\n    signal: controller.signal\n  })\n  tableRows.value = await res.json()\n})\n</script>\n```"
  },
  {
    "id": "vue-012",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "宏",
      "defineProps",
      "defineEmits",
      "defineExpose"
    ],
    "question": "Vue3 <script setup> 里的 defineProps / defineEmits / defineExpose 分别做什么？",
    "answer": "这三个是 `<script setup>` 的**编译器宏**（无需 import，编译期处理）：\n\n- `defineProps`：声明接收的 props（类型 + 默认值），返回一个对象可直接解构（需用 `toRefs` 保持响应性）\n- `defineEmits`：声明可触发的事件，返回 `emit` 函数\n- `defineExpose`：默认 `<script setup>` 的变量是**私有**的，用 `defineExpose({...})` 显式暴露给父组件（父通过 `ref` 访问）\n\n```vue\n<script setup>\nconst props = defineProps({ msg: String })\nconst emit = defineEmits(['change'])\ndefineExpose({ reset })\n</script>\n```\n\n> 区别于 Options API：组合式更简洁，且宏在编译期被擦除，不会出现在运行时。\n\n### Vue 3 响应式底层细节与生产避坑指南\n\n| 场景维度 | 常见误区写法 | 推荐工程最佳实践 |\n| :--- | :--- | :--- |\n| **响应式解构** | 在 Vue 3.4 之前直接解构 `reactive` 对象导致丢失响应式连接 | 统一使用 `ref()`，或使用 `toRefs(state)`；Vue 3.5+ 已原生支持 `defineProps` 响应式解构 |\n| **副作用清理** | 在 `watch` / `onMounted` 中开启定时器或异步请求未做失效清理 | 使用 `onWatcherCleanup()`（Vue 3.5+）或 `onCleanup` 回调配合 `AbortController` 取消过期请求 |\n| **大列表/不可变数据渲染** | 用 `ref()` 深度代理包含上万条只读数据的图表或表格数组 | 改用 **`shallowRef()`**，避免递归创建数万个 `Proxy` 实例，仅在整体替换 `.value` 时触发更新 |\n\n```vue\n<script setup>\nimport { shallowRef, watch } from 'vue'\n\n// 1. 大数据量列表使用 shallowRef 跳过深层 Proxy 劫持，大幅降低内存与初始化耗时\nconst tableRows = shallowRef([])\n\n// 2. 带竞态取消（Race Condition Prevention）的异步侦听器\nconst searchQuery = shallowRef('')\nwatch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {\n  const controller = new AbortController()\n  onCleanup(() => controller.abort()) // 当用户快速连续输入时，立即中止上一次未完成的请求\n\n  const res = await fetch(`/api/list?q=${encodeURIComponent(newQuery)}`, {\n    signal: controller.signal\n  })\n  tableRows.value = await res.json()\n})\n</script>\n```"
  },
  {
    "id": "vue-013",
    "category": "vue",
    "module": "framework",
    "difficulty": "medium",
    "tags": [
      "路由",
      "keep-alive",
      "滚动恢复",
      "SPA",
      "popstate"
    ],
    "question": "SPA 中：首页加载帖子列表，点击某帖跳转详情页（URL 变化），点击浏览器后退返回首页时，如何让列表内容保持原状、无需重新请求也无需重新渲染？请从路由机制、组件缓存、滚动恢复三方面说明原理，并分别给出 Vue 与 React 的实现。",
    "answer": "核心矛盾：SPA 路由切换本质是**组件卸载/挂载**。默认情况下返回列表页 = 重新 mount = 重新发请求、重新渲染、滚动回到顶部。要做到\"原样保留\"，需要**三件套**：组件实例缓存 + 数据状态外提 + 滚动位置恢复。\n\n## 一、底层机制：URL 变化如何驱动视图\n\n- 浏览器后退/前进触发 `popstate` 事件，URL 变化后路由库（vue-router / react-router）监听它，解析出新路由并**切换对应组件**。\n- 路由库只负责\"切组件\"，**不负责保存旧页面的状态**——状态丢失是\"切组件\"的天然副作用，不是路由的错。\n- 因此解决方案都围绕：让\"切走\"的组件不被真正销毁，或让数据不依赖组件生命周期。\n\n## 二、方案 A：组件缓存（Vue 推荐）\n\nVue 的 `<keep-alive>` 会**缓存组件实例**（连同 DOM 子树、data、滚动的 DOM 位置）：\n\n```vue\n<router-view v-slot=\"{ Component }\">\n  <keep-alive :include=\"['Home']\" :max=\"10\">\n    <component :is=\"Component\" />\n  </keep-alive>\n</router-view>\n```\n\n- 切走时组件不销毁，而是 `deactivated`；返回时**不重新 mount**，`onMounted` 不再执行 → 自然不发请求、不重新渲染。\n- `onActivated` 里可做\"增量刷新\"（如静默拉最新数据但保留旧列表），配合 `include`/`exclude` 精确控制缓存哪些路由，`max` 限制缓存上限。\n\n## 三、方案 B：状态外提（React 常用）\n\nReact Router 默认**没有 keep-alive**，返回列表页必然重新 mount。常见做法：\n\n1. **把列表数据 + 筛选分页 + 滚动位置提升到全局 store**（Redux / Zustand / Pinia），组件重新挂载时从 store 直接恢复，不发请求。\n2. **\"有缓存则不请求\"约定**：`useEffect` 里 `if (store.list.length) return; fetch()`。\n3. 想彻底保 DOM 可用第三方库 `react-activation`（KeepAlive 包裹），或手动维护一个\"离屏容器\"缓存列表 DOM。\n\n## 四、滚动位置恢复\n\n- **Vue Router**：内置 `scrollBehavior`，返回 `savedPosition` 即恢复原位置：\n\n```js\nscrollBehavior(to, from, savedPosition) {\n  return savedPosition || { top: 0 }\n}\n```\n\n- **React Router v6**：无内置，手动 `window.history.scrollRestoration = 'manual'` + 在路由切换时保存/恢复 `scrollTop`，或监听 `popstate` 恢复。\n- 底层都依赖浏览器 `history.scrollRestoration`（'auto' | 'manual'）。\n\n## 五、常见坑\n\n- 后退但组件被 `keep-alive` 排除 → 仍会重新请求。\n- 缓存无上限 → 内存泄漏，务必 `max`。\n- 依赖 `onMounted` 发请求的组件，缓存后 `onMounted` 只执行一次，第二次进入要写进 `onActivated`。\n- `keep-alive` 不能包\"每次都要全新的页面\"（如编辑页），用 `include` 白名单更安全。"
  },
  {
    "id": "vue-014",
    "category": "vue",
    "difficulty": "hard",
    "question": "Vue 3.5+ 响应式 Props 解构、useTemplateRef 与 Vapor Mode（无虚拟 DOM 编译模式）底层原理是什么？",
    "tags": [
      "Vue3.5",
      "Props响应式解构",
      "useTemplateRef",
      "VaporMode",
      "无虚拟DOM"
    ],
    "answer": "Vue 3.5 及正在落地的 **Vapor Mode（无虚拟 DOM 编译模式）** 标志着 Vue 编译器与响应式系统进入了更加简洁、极速的新阶段。\n\n### 一、 Vue 3.5+ 三大高价值开发体验升级\n\n1. **响应式 Props 解构（Reactive Props Destructure 正式转正）**：\n   在 Vue 3.2 中，`const { count = 0 } = defineProps(['count'])` 解构出的 `count` 会沦为普通死常量，必须用繁琐的 `withDefaults` + `toRefs`。在 Vue 3.5+ 中，**编译器在 AST 扫描阶段识别所有来自 `defineProps` 解构出的标识符，并将组件内部对该变量的读取自动重写为 `__props.count` 访问**，既拥有原生 JS 默认值语法，又 100% 保持响应式追踪！\n2. **`useTemplateRef('inputEl')` 专用模板引用 API**：\n   取代了过去既用于响应式数据又用于 DOM 引用的同名 `const inputEl = ref(null)` 混淆写法，支持动态字符串 ref 键名且类型推导更清晰。\n3. **`onWatcherCleanup()` 副作用清理函数**：\n   无需再通过 `watch(id, (val, oldVal, onCleanup) => ...)` 的第三个参数获取清理钩子，可在同步执行期间任意辅助函数内直接调用 `onWatcherCleanup(() => controller.abort())`。\n\n```vue\n<!-- Vue 3.5+ 现代化标准组件写法 -->\n<script setup lang=\"ts\">\nimport { watch, useTemplateRef, onWatcherCleanup } from 'vue'\n\n// 1. 原生响应式 Props 解构 + 原生默认值（编译后读取 count 自动转化为 __props.count）\nconst { count = 1, apiUrl } = defineProps<{ count?: number; apiUrl: string }>()\n\n// 2. 语义明确的模板 DOM 引用\nconst chartEl = useTemplateRef<HTMLDivElement>('chartContainer')\n\n// 3. 直接侦听解构出的响应式变量（编译器自动包装为 getter: () => __props.count）\nwatch(() => count, (newCount) => {\n  const timer = setTimeout(() => console.log('Updated:', newCount, chartEl.value), 300)\n  onWatcherCleanup(() => clearTimeout(timer))\n})\n</script>\n\n<template>\n  <div ref=\"chartContainer\">当前计数：{{ count }}</div>\n</template>\n```\n\n### 二、 Vue Vapor Mode（无虚拟 DOM 模式）是如何工作的？\n\n传统 Vue 3 组件将 `<template>` 编译为生成虚拟 DOM（VNode）的 `render()` 函数；而 **Vapor Mode（灵感源自 SolidJS）在编译期直接将 `<template>` 编译为：1. 一次性克隆静态 `<template>` HTML 字符串生成真实 DOM；2. 使用 `renderEffect` 将响应式信号直接绑定到具体真实 DOM 节点的 `.textContent` 或 `.setAttribute` 上**！\n\n```javascript\n// Vapor Mode 编译产物示意：彻底消灭 VNode 创建与 Patch Diff 开销！\nimport { template as _template, renderEffect as _renderEffect, setText as _setText } from 'vue/vapor'\n\nconst t0 = _template('<div class=\"card\"><span></span></div>')\n\nexport function render(_ctx) {\n  const n0 = t0() // 直接 cloneNode(true) 一次性生成真实 DOM 树\n  const n1 = n0.firstChild\n  // 细粒度直连：当 _ctx.count 改变时，直接修改真实 DOM n1 的文本，零 VDOM 参与！\n  _renderEffect(() => _setText(n1, _ctx.count))\n  return n0\n}\n```"
  }
]
