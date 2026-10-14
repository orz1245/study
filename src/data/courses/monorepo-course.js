export const monorepoCourseMeta = {
  "id": "monorepo",
  "title": "Monorepo 单体仓库工程实践",
  "subtitle": "把多个包放进同一个仓库，收益是共享，代价是治理：围绕依赖共享、版本发布与构建提速，搭出一套可长期维护的 Monorepo 工作流。",
  "level": "入门 → 进阶",
  "icon": "📦",
  "color": "#f97316",
  "practiceCategory": "monorepo",
  "chapters": [
    {
      "key": "basic",
      "name": "第一章 · 认识 Monorepo",
      "lessons": [
        "mono-l1",
        "mono-l2"
      ]
    },
    {
      "key": "deps",
      "name": "第二章 · 工作区与共享",
      "lessons": [
        "mono-l3",
        "mono-l4"
      ]
    },
    {
      "key": "tooling",
      "name": "第三章 · 编排与发布",
      "lessons": [
        "mono-l5",
        "mono-l6"
      ]
    }
  ]
}

export const monorepoLessons = [
  {
    "id": "mono-l1",
    "chapter": "basic",
    "title": "认识 Monorepo：为什么多个包要放进一个仓库",
    "minutes": 25,
    "content": "### 本节目标\n\n- 说清楚 Monorepo 解决的是什么痛点\n- 区分 Monorepo 与 Multirepo（多仓）的本质差异\n- 知道「什么时候该用、什么时候别用」\n\n先从一个真实痛点说起。假设你有 3 个前端包：`web`（官网）、`admin`（后台）、`ui`（组件库）。如果用 **Multirepo（多个独立仓库）**，会出现三件糟心事：\n\n1. **依赖版本地狱**：`web` 装了 `lodash@4.17.20`，`admin` 装了 `4.17.21`，同一个 `bug` 在两个仓库表现不一样，排查到怀疑人生。\n2. **改一处要发三个 PR**：`ui` 组件库改了个 `Button` 的 props，你得先在 `ui` 发版，再去 `web`、`admin` 各提一个「升级 ui 版本」的 PR，等它们各自 CI 跑完——一整天就这么没了。\n3. **类型/工具无法共享**：公共 TS 类型、ESLint 配置、构建脚本，每个仓库复制一份，改规则时要同步 N 个仓库。\n\n**Monorepo** 就是反过来：把「多个相关包/应用」放在「同一个仓库」里统一管理。上面的问题迎刃而解——改 `ui` 的 `Button`，在同一个仓库里顺手改 `web`/`admin` 的调用，一次 commit 全搞定；依赖只有一份，版本天然统一。\n\n```ts\n// Monorepo 的目录长这样（一个仓库，多个包）\n// my-monorepo/\n// ├─ package.json          // 根：管理 workspace\n// ├─ pnpm-workspace.yaml   // 声明哪些目录是「包」\n// └─ packages/\n//    ├─ web/              // 应用 A\n//    ├─ admin/            // 应用 B\n//    └─ ui/              // 共享组件库\n```\n\n但要注意：**Monorepo 不是银弹**。它带来一个代价——「仓库很大、CI 很慢、工具链更复杂」。小团队只有一个包时，上 Monorepo 纯属自找麻烦。我的判断线很清晰：**当你的代码需要「跨包复用 + 频繁联动修改」时，才值得上 Monorepo**；否则一个普通仓库 + 一个 npm 私有包就够了。\n\n### 名词解释\n\n**Monorepo（单体仓库）**：把多个相关项目放在「同一个 Git 仓库」里管理，共享同一套依赖、配置与 CI。注意它和「巨石应用（Monolith）」不同——仓库是一个，但里面仍然是多个可独立构建/发布的包。\n\n**Multirepo（多仓库）**：每个项目一个独立 Git 仓库，各自有独立的依赖、版本与发版流程。隔离性好，但跨项目改动成本高。\n\n**Workspace（工作区）**：包管理器（pnpm/npm/yarn）提供的「把仓库内多个子包当成一个整体来安装、链接」的能力。它是 Monorepo 的底层机制。\n\n**幽灵依赖（Phantom Dependency）**：本该只在 A 包 `dependencies` 里的包，因为被 B 包提升到了仓库根 `node_modules`，导致 C 包没声明也能 `import` 到它。一旦 A 改了依赖，C 就莫名其妙崩了。Monorepo 工具优劣很大程度取决于能不能杜绝它。\n\n### 课后练习\n\n**练习 1**：团队只有一个 `web` 应用、没有共享组件库，要不要上 Monorepo？\n\n> 答案：不要。Monorepo 的价值来自「多包复用与联动」，单包场景下它只会增加工具链复杂度，用一个普通仓库足矣。\n\n**练习 2**：Monorepo 和「把所有代码塞进一个巨石应用」是一回事吗？\n\n> 答案：不是。Monorepo 是「一个仓库、多个独立包」，包之间仍边界清晰、可单独构建发布；巨石应用是「一个仓库、一个打包产物」，所有代码耦合在一起。前者治的是「协作与复用」，后者往往是技术债。\n\n### 总结\n\n我的立场很明确：**Monorepo 是「协作规模」的解药，不是「项目大小」的解药**。它用「统一仓库 + 统一依赖 + 原子化改动」换来了跨包联动的丝滑，代价是工具链与 CI 的复杂度。判断要不要上，只看一件事——你的包之间是否「经常要一起改、一起复用」。是，就上；否，别凑热闹。下一节我们直接动手，用 pnpm workspace 从零搭一个能跑的 Monorepo。"
  },
  {
    "id": "mono-l2",
    "chapter": "basic",
    "title": "用 pnpm workspace 从零搭一个 Monorepo",
    "minutes": 30,
    "content": "### 本节目标\n\n- 亲手搭出 pnpm 多包结构\n- 理解 `pnpm-workspace.yaml` 与根 `package.json` 的作用\n- 让子包之间互相引用（不再靠发 npm 包）\n\npnpm 是目前最主流的 Monorepo 方案，它对「幽灵依赖」的隔离做得最好。我们从空目录开始。\n\n```bash\n# 运行环境：Node.js 18+ + pnpm 8+；全局装一次 pnpm 即可\n# npm install -g pnpm\n\n# 1) 建仓库骨架\nmkdir my-monorepo && cd my-monorepo\npnpm init                 # 生成根 package.json\n\n# 2) 声明「哪些是工作区的包」\n# 根目录新建 pnpm-workspace.yaml\n```\n\n`pnpm-workspace.yaml` 告诉 pnpm：哪些目录算「包」。最常见写法：\n\n```yaml\n# pnpm-workspace.yaml\npackages:\n  - 'packages/*'          # packages 下的每个子目录都是一个包\n  - 'apps/*'              # 也可以拆 apps 和 packages\n  # - '!**/test'          # 感叹号 = 排除\n```\n\n然后建两个包：`ui`（组件库）和 `web`（应用），各自 `pnpm init` 起一个 `package.json`，`name` 用 `@my/ui`、`@my/web` 这种 scope 命名，避免和公共包撞名。\n\n```bash\n# 3) 建子包\nmkdir -p packages/ui packages/web\ncd packages/ui && pnpm init && cd ../..\ncd packages/web && pnpm init && cd ../..\n\n# 4) 关键一步：让 web「内部依赖」ui，不需要发 npm\ncd packages/web\npnpm add @my/ui@workspace:*    # workspace:* = 永远指向仓库里的本地 ui\ncd ../..\n```\n\n`workspace:*` 是 pnpm 的魔法：它让 `web` 的 `package.json` 里写 `\"@my/ui\": \"workspace:*\"`，安装时 pnpm 不会去 npm 拉，而是**直接把本地 `packages/ui` 软链（symlink）过来**。你改了 `ui` 的代码，`web` 立刻能看到，零发版。\n\n```bash\n# 5) 在仓库根目录一次性安装所有包\npnpm install\n\n# 6) 运行某个包的脚本（用 --filter 指定）\npnpm --filter @my/web dev\n```\n\n`pnpm install` 在根目录跑一次，会按 workspace 拓扑把所有子包装好、互相链接好。后续你在 `web` 里 `import { Button } from '@my/ui'` 就能直接用本地组件。\n\n### 名词解释\n\n**pnpm-workspace.yaml**：pnpm 的「工作区清单」文件，用 `packages` 字段声明哪些目录属于这个 Monorepo。它是 Monorepo 的「地图」。\n\n**`workspace:*` 协议**：声明「这个依赖指向仓库内的另一个本地包」，版本号用 `*` 表示「跟随本地最新」。安装时软链而非下载，实现跨包即时复用。\n\n**Symlink（软链接）**：pnpm 把本地包以链接形式放进依赖目录，逻辑上「像装了」、物理上「指向源码」。所以改源码即生效。\n\n**Scope（作用域）**：`@my/ui` 里的 `@my` 是组织名（scope），避免包名和 npm 公共包冲突，也方便统一发布到私有/公开 registry。\n\n### 课后练习\n\n**练习 1**：`web` 依赖 `@my/ui` 用了 `workspace:*`，如果把 `ui` 的版本从 `1.0.0` 升到 `2.0.0`，`web` 的 `package.json` 要不要跟着改？\n\n> 答案：不用。`workspace:*` 的 `*` 表示「永远用本地最新」，不锁具体版本，`ui` 改版本号 `web` 这边零改动即可联动。\n\n**练习 2**：`pnpm install` 应该在根目录跑，还是每个子包各跑一次？\n\n> 答案：在根目录跑一次即可。pnpm 会按 workspace 拓扑统一解析、安装并链接所有子包；进子包单独跑反而可能破坏链接关系。\n\n### 总结\n\n搭 Monorepo 的核心就三样东西：**根 `package.json` + `pnpm-workspace.yaml` 划包 + `workspace:*` 互链**。这套组合拳让「跨包引用」从「发 npm 包等 CI」退化成了「改代码即生效」，正是 Monorepo 丝滑感的来源。记住 `pnpm install` 永远在根目录跑一次。下一节我们深入「共享包」——把类型、工具函数、ESLint 配置抽成全仓复用的公共包。"
  },
  {
    "id": "mono-l3",
    "chapter": "deps",
    "title": "共享包与内部依赖：类型/工具一处定义全仓复用",
    "minutes": 30,
    "content": "### 本节目标\n\n- 把公共 TS 类型抽成独立包，全仓 import\n- 用 `import type` 只引类型不引运行时代码\n- 用 base tsconfig 统一全仓 TS 配置\n\nMonorepo 最实在的收益，是「公共东西只定义一次」。典型共享包有三种：\n\n1. **类型包**（如 `@my/types`）：全仓共用的领域模型、API 响应类型。\n2. **工具包**（如 `@my/utils`）：格式化、校验等纯函数。\n3. **配置包**（如 `@my/eslint-config`、`@my/tsconfig`）：统一的代码规范。\n\n以类型包为例，做法如下：\n\n```ts\n// packages/types/src/index.ts\n// 运行环境：Node.js 18+ + typescript；类型检查 pnpm --filter @my/types exec tsc --noEmit\n\nexport interface User {\n  id: number\n  name: string\n  role: 'admin' | 'user'\n}\n\nexport interface ApiResponse<T> {\n  code: number\n  data: T\n  message: string\n}\n```\n\n`web` 和 `admin` 都 `pnpm add @my/types@workspace:*`，然后：\n\n```ts\n// packages/web/src/api.ts\nimport type { User, ApiResponse } from '@my/types'   // 用 import type 只引类型\n\nasync function fetchUser(id: number): Promise<ApiResponse<User>> {\n  const res = await fetch(`/api/users/${id}`)\n  return res.json()\n}\n```\n\n注意这里用的是 **`import type`**：它明确告诉 TS「只导入类型、不导入值」。打包时这些导入会被完全抹掉，不会把类型包打进运行时代码，也不会造成循环依赖。`User` 定义改一处，所有引用它的包的类型检查立刻同步——这就是「类型单一来源」。\n\n配置也要统一。建一个 `@my/tsconfig` 包，导出共享的 `base.json`：\n\n```json\n// packages/tsconfig/base.json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"Bundler\",\n    \"strict\": true,\n    \"skipLibCheck\": true\n  }\n}\n```\n\n各子包只需 `extends` 它，规则全仓一致：\n\n```json\n// packages/web/tsconfig.json\n{\n  \"extends\": \"@my/tsconfig/base.json\",\n  \"compilerOptions\": { \"outDir\": \"dist\" }\n}\n```\n\n### 名词解释\n\n**类型单一来源（Single Source of Truth）**：同一个概念只定义一次，别处全部引用它。改一处全局生效，杜绝「复制十份类型、改了忘了同步」的漂移。\n\n**`import type`**：TS 的「仅类型导入」语法，导入的东西运行时不存在，打包器可安全删除，避免误打包与循环依赖。共享类型包的标配写法。\n\n**`tsconfig` extends**：子配置继承父配置（`compilerOptions` 合并），用来在 Monorepo 里统一 TS 编译规则。\n\n**Project References（项目引用）**：TS 的「包间依赖图」机制，子包用 `references` 声明依赖别的包，配合 `tsc --build` 实现「只重新编译变更及下游」的增量构建。大型 Monorepo 提速关键。\n\n### 课后练习\n\n**练习 1**：`Pick<User, 'id' | 'name'>` 和手写 `{ id: number; name: string }` 哪个更好？\n\n> 答案：用 `Pick` 更好。它派生自 `User`，`User` 加了字段 `UserPreview` 自动跟着变；手写副本日后极易忘记同步，是类型漂移的温床。\n\n**练习 2**：为什么从共享类型包导入要用 `import type` 而不是普通 `import`？\n\n> 答案：`import type` 明确「这是类型、无运行时值」，打包器可安全丢弃、避免误打包，还能防止「类型循环引用」变成「运行时循环依赖」。语义也更清晰。\n\n### 总结\n\nMonorepo 的「复用」不是口号，而是三件具体的事：**类型抽包、配置抽包、`import type` 只引类型**。当 `User` 只在一处定义、所有包都 `import type` 引用它时，你才真正拥有了「改一处、全仓类型检查同步」的安全感。再配一个 `@my/tsconfig` 统一编译规则，团队的 TS 行为就不再是各写各的。下一节我们谈一个躲不开的坑——循环依赖，以及如何治理它。"
  },
  {
    "id": "mono-l4",
    "chapter": "deps",
    "title": "循环依赖与依赖治理",
    "minutes": 25,
    "content": "### 本节目标\n\n- 识别循环依赖（A→B→A）及其危害\n- 用工具检测 Monorepo 里的循环依赖\n- 用「抽共享层」破解循环\n\nMonorepo 让跨包引用太方便了，方便到很容易造出**循环依赖**：`utils` 引用了 `ui` 的一个函数，`ui` 又引用了 `utils` 的一个函数，形成 `utils ⇄ ui` 的环。\n\n循环依赖的代价：\n\n```ts\n// 问题示意：a 依赖 b，b 又依赖 a\n// packages/a/src/index.ts\nimport { doB } from '@my/b'\nexport const doA = () => doB()\n\n// packages/b/src/index.ts\nimport { doA } from '@my/a'      // 循环！a 还没初始化完，doA 可能是 undefined\nexport const doB = () => doA()\n```\n\n在 ESM 下，这种环常常导致「导入到的是 `undefined`」或「初始化顺序错乱」，定位极难。更隐蔽的是**类型层面的环**：`A` 的 `interface` 引用 `B` 的 `interface`，`B` 又反过来——虽然运行时不崩，但 `tsc` 的类型推导会陷入迷宫。\n\n**第一步：检测。** 别靠肉眼，用工具扫：\n\n```bash\n# 用 madge 扫描整个仓库的依赖环\npnpm add -Dw madge\nnpx madge --circular --extensions ts packages/\n\n# 或用 dependency-cruiser 做更严格的「依赖方向守卫」\npnpm add -Dw dependency-cruiser\n```\n\n**第二步：破解。** 最稳妥的招数是「抽共享层」——把 `a` 和 `b` 都依赖的那部分逻辑，单独抽成一个新包 `@my/shared`，让 `a`、`b` 都只依赖 `shared`，`shared` 不依赖任何人：\n\n```ts\n// packages/shared/src/index.ts  ← 只被依赖，不依赖别人\nexport const helper = () => { /* a、b 共用 */ }\n\n// packages/a、packages/b 都改成 import { helper } from '@my/shared'\n```\n\n这样「环」被打破，依赖方向变成 `a/b → shared` 的树状结构，清晰可维护。\n\n### 名词解释\n\n**循环依赖（Circular Dependency）**：包 A 依赖 B、B 又依赖 A 的闭环。运行时常导致「未初始化值」，类型推导也会变慢变乱。\n\n**分层架构（Layered Architecture）**：把依赖方向规定成「上层依赖下层、下层不反向依赖」的单向树。共享逻辑沉到最底层，是破除循环依赖的设计原则。\n\n**依赖守卫（Dependency Guard）**：用 `dependency-cruiser` 这类工具写规则（如「`ui` 不得依赖 `web`」），CI 里自动拦截违规的跨包引用，把架构约束固化成代码。\n\n**Madge**：一款静态分析工具，能画出模块依赖图并检测出循环依赖，是 Monorepo 体检的常用手段。\n\n### 课后练习\n\n**练习 1**：类型层面的循环引用（`A` 接口引用 `B`，`B` 引用 `A`）会像运行时的循环依赖那样直接崩吗？\n\n> 答案：通常不会让程序运行时崩，但会让 `tsc` 的类型推导变慢、出现诡异报错。属于「不崩但难维护」的隐患，发现就该拆。\n\n**练习 2**：「抽共享层」为什么能破环？\n\n> 答案：环的本质是 A、B 互相需要对方的一部分。把这部分共性抽成第三包 `shared`，让 A、B 都只依赖 `shared` 且 `shared` 不依赖任何人，依赖图就从「环」变成「树」，方向单一清晰。\n\n### 总结\n\nMonorepo 把「跨包引用」变得太容易，反而让循环依赖成为高发坑。我的应对法则：**先用 `madge`/`dependency-cruiser` 把环查出来，再用「抽共享层」把环破成树**。更进一步，把依赖方向用 `dependency-cruiser` 写成 CI 守卫，让「禁止 `ui` 反向依赖 `web`」这类规则自动拦截——架构不该靠人自觉，要靠工具兜底。下一节进入工程化核心：用 Turborepo 编排所有包的构建与测试。"
  },
  {
    "id": "mono-l5",
    "chapter": "tooling",
    "title": "Turborepo 任务编排：缓存、并行与增量构建",
    "minutes": 35,
    "content": "### 本节目标\n\n- 用 `turbo.json` 声明任务依赖图\n- 理解 Turborepo 的「缓存」如何让第二次构建秒过\n- 用 `--filter` 只构建「受影响的包」\n\n当包变多（10 个、50 个），你在根目录跑 `pnpm build`，会傻乎乎地把**所有包**都重新构建一遍，哪怕你只改了其中一个。Turborepo（简称 Turbo）就是来解决这个问题——它给每个任务建「依赖图」，只跑该跑的，并且把结果缓存下来。\n\n先在根 `package.json` 装上 Turbo，并加几个「聚合脚本」：\n\n```json\n// 根 package.json\n{\n  \"scripts\": {\n    \"build\": \"turbo run build\",\n    \"test\": \"turbo run test\",\n    \"lint\": \"turbo run lint\"\n  },\n  \"devDependencies\": {\n    \"turbo\": \"^2.0.0\"\n  }\n}\n```\n\n核心是 `turbo.json`——它描述「每个任务依赖什么、怎么算缓存」：\n\n```json\n// turbo.json\n{\n  \"tasks\": {\n    \"build\": {\n      \"dependsOn\": [\"^build\"],   // 先构建「依赖的包」（^ 表示上游）\n      \"outputs\": [\"dist/**\"]      // 把 dist 目录作为缓存产物\n    },\n    \"test\": {\n      \"dependsOn\": [\"build\"],     // 测试前先确保构建好\n      \"outputs\": []               // 测试无产物，不缓存输出\n    },\n    \"lint\": {\n      \"outputs\": []\n    }\n  }\n}\n```\n\n`dependsOn: [\"^build\"]` 是关键：构建 `web` 时，Turbo 会先按拓扑把 `web` 依赖的 `ui`、`types` 都构建好（上游优先）。而 `outputs: [\"dist/**\"]` 让 Turbo 把 `dist` 哈希缓存——**第二次构建若源码没变，直接命中缓存、秒过**，不再重复编译。\n\n```bash\n# 全量构建（Turbo 自动并行 + 缓存）\npnpm build\n\n# 只构建「相对于上次 commit 改动的包」及其下游\npnpm build --filter=@my/web...\n\n# 只构建某个具体包\npnpm --filter @my/ui build\n```\n\n`--filter=@my/web...` 里的 `...` 表示「`web` 以及所有依赖/被依赖它的包」，非常适合「我只改了 web，别的全跳过」的场景。结合远程缓存（把缓存上传到云端），团队里任何人第一次构建也能秒级复用别人的结果。\n\n### 名词解释\n\n**Turborepo（Turbo）**：Monorepo 的任务编排器，按依赖图并行执行 `build`/`test`/`lint`，并用内容哈希做任务缓存，大幅缩短 CI 与本地构建时间。\n\n**Pipeline（任务管线）**：`turbo.json` 里定义的「任务清单 + 依赖关系」，告诉 Turbo 哪个任务依赖哪个、产物是什么。\n\n**任务缓存（Task Cache）**：Turbo 对「输入（源码+依赖）+ 输出（如 dist）」做哈希，命中则跳过执行直接复用结果，是「二次构建秒过」的原理。\n\n**`--filter` 与 `...` 语法**：Turbo/pnpm 的包选择器；`--filter=@my/web...` 选中 `web` 及其上下游相关包，实现「只动相关的」。\n\n### 课后练习\n\n**练习 1**：`dependsOn: [\"^build\"]` 里的 `^` 是什么意思？不加会怎样？\n\n> 答案：`^` 表示「上游依赖包」。`web` 的 `build` 会先确保它依赖的 `ui`/`types` 已构建。不加的话，可能 `web` 开始构建时 `ui` 还没好，导致找不到最新的 `ui` 产物而构建失败或用了旧版本。\n\n**练习 2**：为什么 `lint` 的 `outputs` 通常是空数组？\n\n> 答案：`lint` 不产出可复用的文件产物（只是检查报错误），没有「输出物」需要缓存，所以 `outputs: []`；它的「输入」仍是源码，`inputs` 变化时才会重跑。\n\n### 总结\n\nTurbo 解决的是 Monorepo 的「规模化」问题：**用 `turbo.json` 描述任务依赖图，靠哈希缓存让重复构建秒过，靠 `--filter` 让改动只触动相关包**。没有它，包一多构建就寸步难行；有了它，10 个包和 100 个包的体验差不了多少。记住 `dependsOn: [\"^build\"]` 是正确性的底线。最后一节我们谈「多包怎么发版」与那些绕不开的工程避坑。"
  },
  {
    "id": "mono-l6",
    "chapter": "tooling",
    "title": "版本发布与工程实践：Changesets、CI 与避坑",
    "minutes": 30,
    "content": "### 本节目标\n\n- 用 Changesets 管理多包版本与发版\n- 理解「原子变更」的发版流程\n- 知道 Monorepo 最常见的几个坑与对策\n\n多包各自维护版本号、各自发版，会乱套。`Changesets` 是社区主流方案——它把「要发版的变更」记成一个个 `changeset` 文件，发版时统一算版本、统一打 tag。\n\n```bash\n# 1) 初始化 changesets\npnpm add -Dw @changesets/cli\nnpx changeset init\n\n# 2) 你改了 @my/ui 的 Button，登记一次变更\nnpx changeset\n# 交互里选 @my/ui，选版本 bump 类型（patch/minor/major），写一句描述\n\n# 3) CI 里「版本确定」+「发布」两步\nnpx changeset version    # 根据所有 changeset 算出新版本号，更新各包 package.json，删掉 changeset 文件\nnpx changeset publish    # 把版本变更的包发到 npm（自动跳过没变的）\n```\n\n`changeset version` 的妙处是**原子化**：它一次性把所有相关包的版本号、依赖关系算对（比如 `ui` 升了 `minor`，依赖它的 `web` 也会跟着 `patch`），你不用手动对齐。通常把这两步放进 CI：有人合并变更就自动算版本，打 tag 后自动 publish。\n\n```yaml\n# .github/workflows/release.yml 片段（概念示意）\non:\n  push:\n    branches: [main]\njobs:\n  release:\n    steps:\n      - run: pnpm install\n      - run: npx changeset version\n      - run: npx changeset publish\n        env:\n          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}\n```\n\n最后，盘点 Monorepo 最常见的坑：\n\n| 坑 | 现象 | 对策 |\n|---|---|---|\n| 幽灵依赖 | 没声明却能 import 到别人的包 | 用 pnpm（严格隔离）；CI 跑 `pnpm dedupe --check` |\n| 构建慢 | 全量 `tsc` 好几分钟 | `tsc --build` 增量 + Turbo 缓存 + `include` 收窄 |\n| 循环依赖 | 导入到 `undefined` | `madge` 检测 + 抽共享层 |\n| 权限/secret 泄露 | CI 误发私有包 | `changeset publish` 配 `private: true` 包不发布；npm token 最小权限 |\n\n```bash\n# 增量编译：只重编「变更及下游」，大型 Monorepo 提速必备\npnpm --filter @my/web exec tsc --build\n```\n\n### 名词解释\n\n**Changesets**：多包版本管理工具。开发者用「changeset 文件」登记「哪个包、bump 什么版本、为什么」，发版时统一算版本号并 publish，避免手动对齐版本。\n\n**原子变更（Atomic Change）**：一次提交/发版整体生效或整体回滚，不会出现「A 升了 B 没跟上」的半成品状态。Changesets 的版本计算就是为保证原子性。\n\n**CI/CD**：持续集成（自动跑测试/构建）与持续交付（自动发布）的流水线，是 Monorepo 自动发版的承载。\n\n**增量编译（`tsc --build`）**：基于 Project References，只重新编译「改动及其下游包」，大型 Monorepo 把几分钟的 `tsc` 压到秒级的关键。\n\n### 课后练习\n\n**练习 1**：`changeset version` 和 `changeset publish` 分别干什么？顺序能反过来吗？\n\n> 答案：`version` 根据 changeset 算出新版本号、更新 `package.json`、删除 changeset 文件；`publish` 才真正把包发到 npm。必须先 version 再 publish——没算版本就发，发的还是旧版本号，且依赖关系对不齐。\n\n**练习 2**：为什么用 pnpm 能减少「幽灵依赖」？\n\n> 答案：pnpm 用「严格 node_modules 结构 + 软链接」，只有当包在自身 `dependencies`/`devDependencies` 显式声明时才能 import 到；没声明却能用的是幽灵依赖，pnpm 默认直接报「找不到模块」，从机制上堵死。\n\n### 总结\n\nMonorepo 的终点不是「能跑」，而是「能稳稳地规模化协作与发版」。`Changesets` 用「登记变更 → 原子算版本 → 自动 publish」把多包发版从手工地狱变成流水线；`tsc --build` + Turbo 把构建压进秒级；而幽灵依赖、循环依赖、secret 泄露这些坑，靠 pnpm 隔离、madge 检测、最小权限 token 来兜底。我的整体判断：**Monorepo 的复杂度不在「搭」，而在「治理」——工具链（pnpm + Turbo + Changesets）到位，它就是你团队协作的倍增器；反之则是另一座债务山。**"
  }
]

export const monorepoPlan = [
  {
    "day": 1,
    "title": "认识 Monorepo：为什么多个包要放进一个仓库",
    "lessons": [
      "mono-l1"
    ]
  },
  {
    "day": 2,
    "title": "用 pnpm workspace 从零搭一个 Monorepo",
    "lessons": [
      "mono-l2"
    ]
  },
  {
    "day": 3,
    "title": "共享包与内部依赖：类型/工具一处定义全仓复用",
    "lessons": [
      "mono-l3"
    ]
  },
  {
    "day": 4,
    "title": "循环依赖与依赖治理",
    "lessons": [
      "mono-l4"
    ]
  },
  {
    "day": 5,
    "title": "Turborepo 任务编排：缓存、并行与增量构建",
    "lessons": [
      "mono-l5"
    ]
  },
  {
    "day": 6,
    "title": "版本发布与工程实践：Changesets、CI 与避坑",
    "lessons": [
      "mono-l6"
    ]
  }
]
