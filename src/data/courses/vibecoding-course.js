export const vibeCourseMeta = {
  "id": "vibe-course",
  "title": "Vibe Coding 实战",
  "subtitle": "AI 能写代码之后，工程师的核心价值变成了提出正确的问题：围绕 Prompt 设计与真实案例，沉淀一套可复用的人机协作工作流。",
  "level": "入门 → 进阶",
  "icon": "🚀",
  "color": "#ec4899",
  "practiceCategory": "browser-engineering",
  "chapters": [
    {
      "key": "concept",
      "name": "第一章 · 认知篇：Vibe Coding 到底是什么",
      "lessons": [
        "vibc-l1",
        "vibc-l2"
      ]
    },
    {
      "key": "workflow",
      "name": "第二章 · 工作流篇：AI 时代的编码闭环",
      "lessons": [
        "vibc-l3",
        "vibc-l4"
      ]
    },
    {
      "key": "prompt",
      "name": "第三章 · Prompt 实战篇",
      "lessons": [
        "vibc-l5",
        "vibc-l6"
      ]
    },
    {
      "key": "cases",
      "name": "第四章 · 真实案例篇（重头戏）",
      "lessons": [
        "vibc-l7",
        "vibc-l8",
        "vibc-l9",
        "vibc-l10"
      ]
    },
    {
      "key": "quality",
      "name": "第五章 · 质量与安全篇",
      "lessons": [
        "vibc-l11",
        "vibc-l12",
        "vibc-l13"
      ]
    },
    {
      "key": "team",
      "name": "第六章 · 团队落地篇",
      "lessons": [
        "vibc-l14",
        "vibc-l15",
        "vibc-l16"
      ]
    }
  ]
}

export const vibeLessons = [
  {
    "id": "vibc-l1",
    "chapter": "concept",
    "title": "Vibe Coding 的由来与核心理念",
    "minutes": 35,
    "content": "### 本节目标\n- 知道「Vibe Coding」是谁、何时提出的\n- 理解它的字面含义与工程含义\n- 建立对「AI 时代工程师角色变化」的正确认知\n\n**来源**：2025 年 2 月，OpenAI 联合创始人 **Andrej Karpathy** 在 X 上提出 *vibe coding* 一词。他的原话大意是：\n\n> 有一种新的编程方式，我把它叫 vibe coding。你不完全理解代码，你只是看到东西、说出东西、运行东西、复制粘贴东西，大部分代码其实是 LLM 写的。我只看结果对不对，靠「感觉（vibe）」来判断，看到报错就把报错丢给 AI 让它修。\n\n注意：他本人也强调这是「为了好玩 / 原型」，不是生产系统的标准做法。\n\n**三个核心理念**：\n\n```text\n① 自然语言即代码：把「说需求」当作主要编程动作\n② 人管意图，AI 管实现：你聚焦「做什么」，AI 负责「怎么做」\n③ 快速试错循环：跑起来 → 看现象 → 反馈给 AI → 迭代\n```\n\n**它处在光谱的哪个位置**：\n\n```text\n传统手写代码 ── IDE 补全(Copilot) ── AI 编辑器(Cursor) ── Vibe Coding（几乎不读代码）\n  完全掌控          半掌控               辅助生成                结果导向\n```\n\n### 名词解释\n- **Vibe Coding**：一种「以自然语言描述意图、由 LLM 生成并修改代码、人只看结果反馈」的编程方式，强调结果导向而非逐行理解。\n- **LLM（大语言模型）**：能理解和生成自然语言的神经网络模型（如 GPT、Claude）。它是 Vibe Coding 的\"代码生成引擎\"。\n- **光谱模型（Spectrum）**：把多种编程方式按\"人掌控度\"排成连续谱，帮助判断某任务该用哪种方式，而非非黑即白。\n\n### 课后练习\n1. Karpathy 提出 vibe coding 时，强调了什么重要边界？\n   - 答案：他明确说这是\"为了好玩 / 原型（for fun / prototypes）\"，不是生产系统的标准做法——提醒我们它不是银弹，关键系统仍需严肃工程。\n2. 「人管意图，AI 管实现」这句话在团队里意味着什么？\n   - 答案：人的价值从\"写每一行\"上移到\"定义清楚要什么、判断对不对\"，对需求理解和验收能力的要求反而更高了。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\nVibe Coding 不是一个新语言或新框架，而是一次\"人机分工\"的重新定义。它把编程动作从\"逐行敲击\"变成\"用自然语言描述意图、让模型产出、用结果反推修正\"。很多人误解它是\"放弃理解代码\"，但 Karpathy 的原意恰恰有边界：原型可以 vibe，生产系统仍需严肃对待。我认为这门课真正的价值不在于教你\"怎么偷懒\"，而在于逼你厘清一个更本质的问题——当 AI 能写代码，工程师的核心竞争力到底是什么？答案是\"定义问题、判断优劣、把控风险\"的能力。理解了这点，Vibe Coding 才不是玩具，而是杠杆。"
  },
  {
    "id": "vibc-l2",
    "chapter": "concept",
    "title": "Vibe Coding vs 传统编程 vs Copilot 补全",
    "minutes": 35,
    "content": "### 本节目标\n- 对比三种写码方式的能力边界\n- 知道什么场景该用哪种\n- 破除\"Vibe Coding 会取代程序员\"的焦虑\n\n**三方对比**：\n\n```text\n维度            传统手写          Copilot 补全         Vibe Coding\n─────────────────────────────────────────────────────────────\n谁写代码        人               人+AI 提示           AI 为主\n掌控粒度        每行             函数/语句级         任务/结果级\n适合             性能/底层/算法    日常业务/样板       原型/脚本/探索\n风险             低               低（人把关）         高（易产生幻觉）\n学习曲线         熟悉语言即可      熟悉语言即可         要会提问与验收\n```\n\n**关键认知**：三者不是替代关系，而是**层级递进的工具箱**。补全是\"自行车\"，Vibe 是\"自动驾驶\"，但方向盘还在你手里——只是你从踩油门变成设目的地。\n\n**破除焦虑**：AI 不取代\"会定义问题的人\"，它取代的是\"只会把需求翻译成代码、却不理解为什么\"的搬运工。Vibe Coding 抬高了\"判断力\"的权重。\n\n### 名词解释\n- **Copilot 补全**：IDE 里的 AI 结对编程，按你已写的上下文预测下一句/下一段代码，人始终在回路中把关。\n- **掌控粒度（Granularity）**：你介入代码的最小单位。粒度越粗（任务级），你对细节的可见性越低，风险越高。\n- **判断层能力（Judgment Layer）**：定义需求、评估结果、识别风险的能力。AI 越强，这层越值钱——这是人类不可替代的部分。\n\n### 课后练习\n1. 什么场景不适合用 Vibe Coding？\n   - 答案：对正确性/安全极度敏感的生产核心（支付、权限、底层算法）、需要深度性能调优、或你完全无法验收结果的场景，都应回到\"人主导\"的方式。\n2. 为什么说 Vibe Coding 反而抬高了\"判断力\"的权重？\n   - 答案：AI 产出变容易后，瓶颈从\"写得出\"变成\"判断对不对、会不会有坑\"，这恰恰需要领域知识与审阅能力。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n把 Vibe Coding、Copilot、传统手写并列对比，你会发现它们从来不是\"谁取代谁\"，而是一套可随时切换的工具光谱。真正成熟的工程师不会迷信某一种，而是像选扳手一样按场景取用：底层算法上手动刀，样板代码用补全，原型验证用 Vibe。\"AI 会取代程序员\"的焦虑，本质是把\"写代码\"误当成工程师的全部价值。当生成代码的边际成本趋近零，定义问题、判断对错、控制风险这些\"判断层\"能力才真正稀缺。所以这一课的结论是：别焦虑被替代，去练那些 AI 替不了的——提问、验收、担责。"
  },
  {
    "id": "vibc-l3",
    "chapter": "workflow",
    "title": "黄金闭环：需求拆解 → 提示 → 生成 → 验证 → 验收",
    "minutes": 40,
    "content": "### 本节目标\n- 掌握 Vibe Coding 的 5 步黄金闭环\n- 理解每一步的关键产出与常见塌方点\n- 能把这个闭环画成可执行的清单\n\n**5 步闭环**：\n\n```text\n① 需求拆解：把模糊目标切成\"小、可验证\"的子任务\n② 提示（Prompt）：给 AI 明确上下文 + 约束 + 期望输出\n③ 生成：AI 产出代码（初版往往不完美，正常）\n④ 验证：跑测试/手测，拿到客观反馈（报错、截图、日志）\n⑤ 验收：确认满足需求，否则带着反馈回到②\n```\n\n**每一步的塌方点**：\n- ① 没拆解 → AI 一次生成一大坨，错了难定位。\n- ② 上下文缺失 → AI 凭空编造接口。\n- ④ 不验证 → \"看起来对\"埋下隐患。\n- ⑤ 不验收 → 累积技术债。\n\n**一个可落地的子任务模板**：\n\n```text\n任务：实现登录表单\n输入：用户名/密码字段 + 客户端校验\n约束：用 Vue3 <script setup>，不引第三方表单库\n验证：npm run dev 后手动输入空值/格式错误能看到提示\n```\n\n### 名词解释\n- **黄金闭环（Golden Loop）**：Vibe Coding 的核心工作流——拆需求、给提示、生成、验证、验收，循环往复直到达标。\n- **子任务（Sub-task）**：把大需求切成\"小且可独立验证\"的单元，便于 AI 精准生成、也便于你定位错误。\n- **验收（Acceptance）**：以\"是否满足既定需求与约束\"为标准的通过判定，区别于\"能跑起来\"——能跑不等于正确。\n\n### 课后练习\n1. 为什么\"需求拆解\"必须排在第一步、且要\"可验证\"？\n   - 答案：不拆就一次生成大块代码，出错后难以定位；\"可验证\"让每一步都有客观判据，避免\"感觉差不多\"的模糊通过。\n2. \"能跑起来\"和\"验收通过\"有什么区别？\n   - 答案：能跑只是无语法/运行错误；验收还要求行为符合需求与约束（如校验规则、边界处理），是质量闸门。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n黄金闭环是 Vibe Coding 的\"操作系统\"。大多数人用 AI 写代码翻车，不是模型不行，而是跳过了闭环里的某一步——最常见的是\"不验证就当完成\"。我反复强调：AI 的产出是\"待验证的假设\"，不是\"已交付的成果\"。把\"生成\"和\"验收\"用一道明确的判据隔开，是你与\"看着能跑其实全是坑\"之间唯一的防火墙。这个闭环还揭示了一个反直觉的事实：Vibe Coding 对纪律的要求其实更高，因为生成太容易，你更容易偷懒不验证。真正的高手，是把闭环刻进肌肉记忆的人——他们让 AI 飞快产出，自己牢牢把住验证与验收两道关。"
  },
  {
    "id": "vibc-l4",
    "chapter": "workflow",
    "title": "工具选型地图：Cursor / Claude Code / Copilot / Aider",
    "minutes": 40,
    "content": "### 本节目标\n- 了解主流 Vibe 工具的能力层级（L1/L2/L3）\n- 能按任务复杂度选对工具\n- 知道各自适合的场景与边界\n\n**能力层级**：\n\n```text\nL1 补全型：GitHub Copilot、IDE 内联补全\n     —— 你写，它补。适合日常样板、熟悉代码库。\nL2 编辑型：Cursor、VS Code + Copilot Chat\n     —— 你说\"改这个函数\"，它在上下文里改。适合重构、加功能。\nL3 Agent 型：Claude Code、Aider\n     —— 你给目标，它自主读仓库、改多文件、跑命令自测。适合从0搭建、跨文件任务。\n```\n\n**选型速查**：\n\n```text\n只想加速写已知代码        → Copilot（L1）\n在已有项目里改/加功能    → Cursor（L2）\n从空目录搭一个服务/脚本  → Claude Code / Aider（L3）\n```\n\n**注意边界**：L3 Agent 能力强但\"自主\"意味着它可能改你没想到的文件。务必：① 用 git 提交基线；② 限定工作目录；③ 跑测试确认。\n\n### 名词解释\n- **Agent 型工具（L3）**：能自主读代码、跨文件修改、执行命令并自测的 AI 工具。它接近\"给目标就拿结果\"，但自主度越高越需要护栏。\n- **工作目录（Working Directory）**：工具被允许读写的文件范围。限定它能触达的目录，是防止 AI 误改系统文件的第一道墙。\n- **基线（Baseline）**：开始 AI 操作前的 git 提交点。一旦改坏，可 `git diff`/`git stash` 回退，是 AI 协作的\"安全气囊\"。\n\n### 课后练习\n1. 用 L3 Agent 从空目录搭服务前，为什么一定要先 `git init` 并提交基线？\n   - 答案：Agent 会自主改多文件，出错时基线让你一键回退、用 diff 看清它动了什么，避免不可逆破坏。\n2. 为什么\"在已有项目加功能\"优先选 L2 而不是 L3？\n   - 答案：L2 在显式上下文里改，你全程可控、改动局部；L3 自主度高，对小改动反而容易\"过度发挥\"改到别处。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n工具选型是 Vibe Coding 的\"省钱省命\"第一步。我的经验法则很简单：让工具的能力刚好覆盖任务，不要杀鸡用牛刀。日常样板用 L1 补全最顺手；在熟悉项目里加功能，L2 编辑型既高效又可控；只有\"从零搭建\"或\"跨文件大改\"才值得上 L3 Agent——而且一上 L3 就必须配套 git 基线和目录护栏。很多人觉得\"越自动越好\"，结果 Agent 自作主张改了一堆文件，反而更难收拾。记住：自主度越高，你越要用流程（基线、限定目录、跑测试）把风险锁死。选对工具 + 设好护栏，Vibe Coding 才是生产力，而不是灾难。"
  },
  {
    "id": "vibc-l5",
    "chapter": "prompt",
    "title": "写好写码 Prompt 的 6 条铁律",
    "minutes": 45,
    "content": "### 本节目标\n- 掌握写码 Prompt 的 6 条铁律\n- 能改写一段\"烂 prompt\"成\"好 prompt\"\n- 理解为什么\"上下文 + 约束 + 输出格式\"如此关键\n\n**6 条铁律**：\n\n```text\n① 给上下文：贴相关文件/接口/报错，别让 AI 凭空猜\n② 定约束：语言/框架/风格/禁止项，越具体越好\n③ 说清输出：要\"完整文件\"还是\"只给 diff\"？要测试吗？\n④ 拆小步：一次只做一件事，避免大杂烩\n⑤ 要可验证：明确要求\"附带运行/测试方式\"\n⑥ 给样例：用\"输入→期望输出\"锚定行为\n```\n\n**烂 vs 好**：\n\n```text\n烂： \"帮我写个排序\"\n好： \"用 JavaScript 写一个稳定的归并排序函数 mergeSort(arr)，\n     输入 number[]，返回新数组不修改原数组；\n     附 3 个调用示例与 node 可直接运行的完整文件。\"\n```\n\n**为什么有效**：铁律①~③ 消除\"歧义\"（AI 最怕模糊），④~⑤ 把\"生成\"和\"验证\"绑死，⑥ 用样例把行为钉死，避免自由发挥。\n\n### 名词解释\n- **Prompt（提示词）**：你给 AI 的指令与上下文。质量直接决定产出质量——\"垃圾进垃圾出\"在 LLM 上尤其明显。\n- **约束（Constraint）**：明确限制条件（框架、风格、禁止做的事）。它把 AI 的\"创作空间\"收窄到你要的范围，减少跑偏。\n- **可验证输出（Verifiable Output）**：要求 AI 同时给出\"怎么运行/测试\"，让产出从\"看起来对\"变成\"可证伪\"——这是质量控制核心。\n\n### 课后练习\n1. 把\"写个登录页\"改写成符合铁律的好 prompt。\n   - 答案：\"用 Vue3 `<script setup>` 写一个登录页组件 LoginView.vue，含用户名/密码两个字段与必填+邮箱格式客户端校验；不引第三方表单库；给出在已有 Vue 项目里引用它并 `npm run dev` 验证空值/错误格式提示的步骤。\"\n2. 为什么\"给样例（输入→输出）\"能显著提质量？\n   - 答案：样例把抽象需求变成具体行为锚点，AI 据此对齐你的真实期望，避免它按自己假设的语义自由发挥。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n写好 Prompt 不是\"文采比赛\"，而是\"消除歧义 + 绑定验证\"的工程训练。六条铁律背后只有一个逻辑：LLM 是概率生成器，模糊的指令会放大随机性，精确的约束能把它锁在你想要的分布里。我特别看重铁律⑤\"要可验证\"——它把 AI 的产出从\"我猜你满意\"变成\"你跑一下就知道对不对\"。很多人抱怨 AI 写代码不行，其实是自己的 prompt 像在许愿。这一课的底层心智是：把 AI 当成一个能力极强但缺乏上下文、且不爱追问的初级工程师——你要做的，是把 brief 写得像给靠谱同事那样清楚。Prompt 写得好，Vibe Coding 就成功了一半。"
  },
  {
    "id": "vibc-l6",
    "chapter": "prompt",
    "title": "实战 Prompt 模板库（组件/脚本/重构/SQL/正则/调试）",
    "minutes": 45,
    "content": "### 本节目标\n- 掌握 6 类高频任务的 Prompt 模板\n- 能直接套用并微调\n- 体会\"模板化\"如何把 prompt 工程变成填空题\n\n**模板库（复制即改）**：\n\n```text\n【组件】用 <框架> 写 <组件名>，功能：<...>，约束：<...>，\n        输出完整文件 + 在 <项目> 中引用的步骤 + 验证方式。\n【脚本】用 <语言> 写脚本：输入 <...>，输出 <...>，处理 <边界>，\n        给出可直接 `xxx 运行` 的完整文件。\n【重构】重构下面代码：目标 <可读性/性能/类型安全>，保持外部行为不变，\n        给出 diff 并说明每处改动理由。\n【SQL】 根据表结构 <...> 写查询：需求 <...>，注意 <索引/注入/性能>。\n【正则】写正则匹配 <模式>，附 3 个匹配示例 + 2 个不应匹配的示例 + 测试代码。\n【调试】下面代码报错 <信息>，相关上下文 <...>，先给原因再给最小修复，\n        并解释为什么这样修。\n```\n\n**套用要点**：把 `<...>` 换成具体信息即可。模板的价值是**不漏项**——每次都自动带上上下文、约束、验证。\n\n### 名词解释\n- **Prompt 模板（Template）**：把高频任务的提示词固化为带占位符的骨架，用时填空。它把\"每次重新想怎么问\"变成\"填空\"，稳定产出质量。\n- **Diff（差异）**：代码改动的前后对比。重构/审查场景要求\"给 diff\"，便于你精准审阅而非全盘接受。\n- **可复现（Reproducible）**：要求 AI 附\"运行/测试方式\"，让结果在任何环境都能复现验证，而非只给一段孤立代码。\n\n### 课后练习\n1. 用\"调试\"模板描述一个真实 bug：页面点击按钮无反应。\n   - 答案：\"下面代码点击按钮无反应：`<button @click=\"submit\">提交</button>`，脚本里 `function submit(){...}` 定义在 `<script setup>` 外/未暴露。报错：控制台无信息。先给原因再给最小修复并解释。\"（提示：setup 内需 `const submit=...` 或 `defineExpose`）\n2. 为什么\"重构\"模板强调\"保持外部行为不变\"？\n   - 答案：防止 AI 在优化的同时偷偷改了功能语义，用\"行为不变\"作为验收红线，重构才安全。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n模板库是 Prompt 工程从\"艺术\"走向\"工程\"的关键一步。当你把六类高频任务的提问方式固化成带占位符的骨架，你就不再每次从零构思\"怎么问\"，而是做填空题——这既省脑力，又保证每次都不漏掉上下文、约束、验证这三件套。我特别建议把这套模板存进你的笔记或 IDE 片段，遇到对应任务直接调出。模板的本质是\"把成功经验标准化\"，这和工程师把常用脚本写成脚手架是同一思路。等你套用几十次后会发现：好的模板不是限制创造力，而是把注意力从\"怎么问\"释放到\"问什么\"——后者才是真正体现你专业判断的地方。"
  },
  {
    "id": "vibc-l7",
    "chapter": "cases",
    "title": "案例1 · 用 Cursor 从 0 搭一个带搜索的待办 Vue 组件",
    "minutes": 50,
    "content": "### 本节目标\n- 完整走一遍\"Vibe 搭 Vue 组件\"的真实流程\n- 得到一个可运行、带搜索过滤的待办组件\n- 学会用三件事验证它真的可用\n\n**目标**：一个 `TodoList.vue`，支持增删、完成态切换、按关键字搜索过滤。\n\n**给 Cursor 的 Prompt（铁律版）**：\n\n```text\n用 Vue3 <script setup> + TypeScript 写 TodoList.vue：\n- props 无，内部维护 todos: {id,text,done}[]\n- 功能：添加（回车）、删除、切换完成态、顶部搜索框按 text 过滤\n- 样式用 scoped CSS，简洁即可\n- 输出完整单文件组件；并说明在父组件如何引用、npm run dev 后怎么验证三件事：\n  (1) 回车能加 (2) 勾选变 done (3) 搜索能过滤\n```\n\n**关键产物（节选）**：\n\n```vue\n<script setup lang=\"ts\">\nimport { ref, computed } from 'vue'\ninterface Todo { id: number; text: string; done: boolean }\nconst todos = ref<Todo[]>([])\nconst keyword = ref('')\nconst filtered = computed(() =>\n  todos.value.filter(t => t.text.includes(keyword.value))\n)\nconst add = () => {\n  if (!keyword.value.trim()) return\n  todos.value.push({ id: Date.now(), text: keyword.value, done: false })\n  keyword.value = ''\n}\nconst remove = (id: number) => { todos.value = todos.value.filter(t => t.id !== id) }\nconst toggle = (id: number) => {\n  const t = todos.value.find(t => t.id === id); if (t) t.done = !t.done\n}\n</script>\n```\n\n**运行方式**：保存为 `TodoList.vue`，在任意 Vue3 项目里 `import TodoList from './TodoList.vue'` 使用，`npm run dev` 启动后用浏览器打开验证上述三件事。\n\n### 名词解释\n- **单文件组件（SFC, .vue）**：Vue 把模板/脚本/样式封装在一个 `.vue` 文件里。Vibe 生成组件时通常直接产出完整 SFC，方便你整文件落地。\n- **computed（计算属性）**：依赖变化时自动重算的派生值。`filtered` 随 `todos`/`keyword` 自动更新，是搜索过滤的天然载体。\n- **验证三件事**：把\"能用\"拆成 3 个具体可观测行为（加/改/查），逐一手动确认，比\"看起来没问题\"可靠。\n\n### 课后练习\n1. 为什么搜索过滤用 `computed` 而不是在 add 时手动维护一个过滤数组？\n   - 答案：`computed` 让过滤与源数据自动同步，任何增删改都会即时反映，避免手动维护两份数据的不一致。\n2. 验证\"组件可用\"时，为什么强调\"三件具体行为\"而不是\"能跑起来\"？\n   - 答案：能跑只说明无报错；三件具体行为是功能正确性证据，能暴露\"能渲染但交互失效\"的隐性 bug。\n\n### 总结\n这个案例把前面所有方法论落到了一个真实产物上。你会发现 Vibe Coding 搭 UI 组件特别顺：你描述\"要什么功能 + 约束（TS/scoped/单文件） + 怎么验证\"，模型给出的 SFC 通常就能直接用。但案例真正的教学重点在最后一步——\"用三件事验证\"。太多人拿到 AI 给的组件，看它渲染出来就以为完了，结果交互逻辑是坏的。我坚持要求\"回车能加、勾选能改、搜索能滤\"三件具体行为逐一确认，因为这是把\"AI 的猜测\"变成\"我确认的事实\"的必经之路。Vibe Coding 产出的组件不是圣旨，是待验收的草稿；你省下的是写代码的时间，多花的是用具体行为验证的时间——这笔账怎么算都值。"
  },
  {
    "id": "vibc-l8",
    "chapter": "cases",
    "title": "案例2 · 用 Claude Code CLI 生成 Express 接口并自动自测",
    "minutes": 50,
    "content": "### 本节目标\n- 体验 L3 Agent 自主\"读仓库 + 改多文件 + 跑命令\"\n- 得到一个带测试的 Express 接口\n- 理解 Agent 模式下\"你该把哪些事交给它、哪些自己把\"\n\n**场景**：在空目录里让 Agent 生成一个 `GET /api/todos` 与 `POST /api/todos` 的 Express 服务，并自带测试。\n\n**给 Agent 的目标（不是步骤）**：\n\n```text\n在当前目录初始化一个最小 Express 服务：\n- GET /api/todos 返回内存中的待办列表\n- POST /api/todos body={text} 新增一条，返回创建结果\n- 用 Node 内置 test runner 写 2 个测试覆盖上述接口\n- 跑通 npm test 后再告诉我怎么 npm start\n```\n\n**Agent 会自主做的事**：`npm init`、`npm i express`、`写 app.js`、`写 test.js`、`npm test`。你要做的：**先看它改了哪些文件、再跑测试确认**。\n\n**一个最小可运行产物（节选）**：\n\n```js\n// app.js（由 Agent 生成，可直接 node app.js 启动）\nconst express = require('express')\nconst app = express()\napp.use(express.json())\nconst todos = []\napp.get('/api/todos', (req, res) => res.json(todos))\napp.post('/api/todos', (req, res) => {\n  const item = { id: todos.length + 1, text: req.body.text }\n  todos.push(item); res.status(201).json(item)\n})\napp.listen(3000, () => console.log('on :3000'))\n```\n\n**运行方式**：`npm init -y && npm i express && node app.js`，另开终端 `curl localhost:3000/api/todos`。\n\n### 名词解释\n- **L3 Agent 模式**：你给\"目标\"，AI 自主规划步骤、读写多文件、执行命令。适合从零搭建，但务必审阅它的改动。\n- **内置 test runner（Node）**：Node 18+ 自带 `node --test`，无需额外框架即可写测试，适合让 Agent 顺手补测试。\n- **内存存储（In-memory）**：数据存在进程变量里，重启即丢。仅用于演示/原型；真实服务要接数据库。\n\n### 课后练习\n1. 用 L3 Agent 生成服务后，你第一件该做的事是什么？\n   - 答案：用 `git diff` 或文件列表看清它新建/改了哪些文件，确认没有越界改动，再跑测试。\n2. 这个例子的 `todos` 用内存数组，上线会有什么问题？\n   - 答案：进程重启数据全丢、多实例不共享、无并发保护；生产须换数据库（如 SQLite/Postgres）并加持久化。\n\n### 总结\n这个案例展示了 Vibe Coding 最\"爽\"的形态：L3 Agent 接管了从初始化到自测的全流程，你只给了\"目标\"而非\"步骤\"。但爽的背后是责任转移——Agent 自主改多文件，你不能再假装\"代码都是我写的所以我知道它干嘛\"。我的铁律是：Agent 跑完，第一件事永远是 `git diff` 看清它动了什么，再跑测试确认行为。很多人被 Agent \"自动搞定\"的丝滑迷惑，直接上线，结果踩到它自作主张加的依赖或改坏的配置。记住，自主度越高，审阅的权重越大。把\"搭建交给它、把关留给你\"，L3 才是杠杆；把\"搭建和把关都交给它\"，L3 就是地雷。"
  },
  {
    "id": "vibc-l9",
    "chapter": "cases",
    "title": "案例3 · 把报错信息丢给 AI，3 轮迭代修好生产 bug",
    "minutes": 45,
    "content": "### 本节目标\n- 掌握\"报错驱动\"的 3 轮迭代修 bug 打法\n- 学会把错误信息组织成 AI 能用的上下文\n- 理解\"修完要补回归测试\"为什么是闭环最后一环\n\n**3 轮打法**：\n\n```text\n第1轮：把 完整报错栈 + 相关代码 + 复现步骤 丢给 AI，要\"先讲原因再给最小修复\"\n第2轮：AI 给修复后你跑，若还报错，把 新报错 + 你试过的 反馈回去\n第3轮：仍不对，提供 最小复现片段（能稳定触发 bug 的 10 行），逼出根因\n```\n\n**组织上下文的要点**（决定 AI 能不能一次命中）：\n\n```text\n- 报错全文（别只截最后一行）\n- 出错文件的相关 10~20 行\n- 你用的版本/环境\n- 你已经排除过的假设（\"不是空指针，因为 x 有值\"）\n```\n\n**修完必须补回归测试**：把触发 bug 的输入写成一条测试，确保\"下次同样的错不再发生\"。这是闭环的收口。\n\n### 名词解释\n- **报错栈（Stack Trace）**：程序崩溃时打印的\"调用链 + 出错行\"。把全文给 AI，比只给最后一行命中率高得多。\n- **最小复现（Minimal Repro）**：能稳定触发 bug 的最短代码。它是定位根因的利器——复杂项目里先\"隔离\"再\"修复\"。\n- **回归测试（Regression Test）**：针对已修复 bug 写的测试，防止该问题复发。是\"修 bug\"和\"修好 bug\"的分界。\n\n### 课后练习\n1. 为什么第 1 轮就要把\"已排除的假设\"也告诉 AI？\n   - 答案：避免 AI 重复你已否定的方向，把算力集中在真正可能的根因上，减少来回。\n2. 修完 bug 不补回归测试，长期会怎样？\n   - 答案：同样的错可能在别处或未来重构中复发且无人察觉，技术债累积；回归测试把\"这次修好\"变成\"永久修好\"。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n\"把报错丢给 AI\"是 Vibe Coding 最日常的动作，但丢得有没有章法，效果天差地别。我总结的 3 轮打法，核心是把模糊的\"它报错了帮修\"升级成结构化的\"报错栈 + 上下文 + 已排除假设\"输入。AI 不是算命的，你给的上下文质量直接决定它一次命中的概率。而这一课真正容易被忽略的，是最后一步——补回归测试。很多人修完 bug 松口气就走了，结果同样的问题三个月后换了个位置又出现。把触发输入固化成一条测试，才是把\"临时修好\"升级成\"永久免疫\"。所以\"报错驱动\"的闭环不是\"AI 修了就行\"，而是\"AI 修、我验证、我锁死\"——三件事缺一不可。"
  },
  {
    "id": "vibc-l10",
    "chapter": "cases",
    "title": "案例4 · 用 AI 给遗留代码补单测，覆盖率从 0 到 80%",
    "minutes": 50,
    "content": "### 本节目标\n- 掌握\"让 AI 读懂旧代码并补测试\"的协作方式\n- 理解测试即文档、测试即安全网\n- 得到一个覆盖率显著提升的测试套件\n\n**给 AI 的指令（强调\"先读后写\"）**：\n\n```text\n读 src/legacy/calc.js（一个无测试的计算模块），先列出它的公开函数与边界，\n再为每个公开函数写单元测试，覆盖：正常值、边界值（0/负数/空）、异常输入。\n用 Node 内置 test runner，最终 npm test 通过且覆盖率>=80%。\n```\n\n**AI 产出的测试样例（节选）**：\n\n```js\n// test/calc.test.js（由 AI 生成，node --test 运行）\nconst test = require('node:test')\nconst assert = require('node:assert')\nconst { add, divide } = require('../src/legacy/calc.js')\n\ntest('add 正常相加', () => { assert.equal(add(2, 3), 5) })\ntest('add 处理负数', () => { assert.equal(add(-1, 1), 0) })\ntest('divide 正常', () => { assert.equal(divide(6, 3), 2) })\ntest('divide 除零抛错', () => { assert.throws(() => divide(1, 0)) })\n```\n\n**运行方式**：`npm install --save-dev`（若需覆盖率工具）后 `node --test`；要看覆盖率可加 `c8` 之类工具。AI 难以一下到 100%，但 0→80% 的安全网已是质变。\n\n**为什么值**：测试既是\"回归安全网\"，也是\"活文档\"——后人读测试比读注释更快懂函数意图。\n\n### 名词解释\n- **遗留代码（Legacy Code）**：长期存在、缺测试、无人敢动的旧代码。给它补测试是降低改动风险的标准动作。\n- **覆盖率（Coverage）**：被测试执行到的代码比例。80% 是常见工程门槛（不是越高越好，边际成本递增）。\n- **边界值测试（Boundary Test）**：针对 0、负数、空、极大值等临界输入的测试，最容易暴露隐藏 bug。\n\n### 课后练习\n1. 为什么给遗留代码补测试要先\"列公开函数与边界\"再写？\n   - 答案：先理解接口与边界，测试才覆盖真实行为；否则 AI 可能基于错误假设写测试，覆盖率虚高却无保护。\n2. 覆盖率是不是越高越好？\n   - 答案：不是。超过某阈值后每提升 1% 成本陡增，且 getter/纯样板代码的覆盖收益低；80% 左右常是性价比拐点。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n给遗留代码补测试，是 Vibe Coding 最\"功德无量\"的应用之一。旧系统没人敢动，根因是\"没有安全网\"——而 AI 恰好擅长\"读懂旧代码、按接口批量生成测试\"。这一步让覆盖率从 0 跳到 80%，本质是把\"无人敢碰\"变成\"改了能立刻发现坏没坏\"。我特别想强调测试的双重身份：它既是回归安全网，也是可读性最强的活文档。新人读测试，三秒就懂一个函数该干嘛、边界在哪。但也要警惕覆盖率崇拜——100% 不是目标，80% 的关键路径覆盖远比 100% 的样板覆盖有价值。用 AI 补测试的正确姿势是\"先读后写、聚焦边界、跑通为准\"，而不是让它闭眼刷数字。"
  },
  {
    "id": "vibc-l11",
    "chapter": "quality",
    "title": "AI 代码的 Code Review 清单",
    "minutes": 40,
    "content": "### 本节目标\n- 建立一套针对 AI 代码的 Review 清单\n- 能逐条审查 AI 产出\n- 把\"信任但验证\"落到可执行的检查项\n\n**4 类审查清单**：\n\n```text\n【正确性】是否处理了边界/异常？是否有隐藏的 off-by-one、空值？\n【安全】  有没有硬编码密钥、SQL 拼接、eval、危险依赖？\n【性能】  有没有 O(n²) 循环、无限制的数组增长、N+1 查询？\n【可维护】命名清楚吗？有魔法数字吗？结构和你项目一致吗？\n```\n\n**逐条打法**：把 AI 给的代码逐段过这 4 类，每条要么\"通过\"要么\"记下要改\"。不要整体扫一眼就合并。\n\n**示例红旗**：\n\n```js\n// ⚠️ 红旗：SQL 拼接（注入风险）\ndb.query(`SELECT * FROM u WHERE name='${name}'`)\n// ✅ 改为参数化\ndb.query('SELECT * FROM u WHERE name=?', [name])\n```\n\n### 名词解释\n- **Code Review（代码审查）**：他人/AI 写完后，逐条检查正确性、安全、性能、可维护性的过程。AI 代码更该 Review，因为它可能\"跑通但埋雷\"。\n- **SQL 注入（Injection）**：把用户输入直接拼进 SQL 字符串，攻击者可篡改语义。参数化查询（占位符）是唯一正解。\n- **信任但验证（Trust but Verify）**：对 AI 产出保持\"可用但不可全信\"的态度——它大概率对，但你必须独立验证关键路径。\n\n### 课后练习\n1. 为什么 AI 生成的代码\"能跑\"也仍需 Review？\n   - 答案：能跑只说明无语法/运行错误，不保证安全（注入）、正确（边界）、可维护；AI 会\"自信地\"写出带隐患的代码。\n2. 上面 SQL 拼接除了注入，还有什么问题？\n   - 答案：单引号、特殊字符会直接破坏语句导致报错；参数化同时解决安全性和健壮性。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n\"AI 写的代码也要 Review\"是这一章的灵魂。很多人以为 Vibe Coding 省掉了审查环节，恰恰相反——正因为代码不是你逐行写的，你更该用清单把它\"盯\"一遍。我给出的 4 类清单（正确/安全/性能/可维护）不是新发明，而是把资深工程师脑内的审视外化成可勾选的项。特别要警惕\"能跑的假象\"：AI 特别擅长产出\"语法正确、逻辑埋雷\"的代码，比如一句 SQL 拼接就让整个系统门户洞开。所以请把\"信任但验证\"刻进流程：AI 大大降低了写的成本，但把\"把关\"的责任更重地压回你肩上。审查不是不信任 AI，而是对自己交付的系统负责。"
  },
  {
    "id": "vibc-l12",
    "chapter": "quality",
    "title": "安全与版权风险与规避",
    "minutes": 40,
    "content": "### 本节目标\n- 认清 AI 代码的三类主要风险\n- 知道每类风险的规避手段\n- 能写一份团队 AI 编程\"红绿灯\"清单\n\n**三类风险**：\n\n```text\n① 安全：硬编码密钥、危险函数(eval)、依赖投毒\n② 版权：训练数据含未授权代码，产出可能\"撞脸\"某 GPL 项目\n③ 合规：某些行业（金融/医疗）对\"AI 生成代码\"有审计要求\n```\n\n**规避手段**：\n\n```text\n安全 → 密钥走环境变量；禁 eval/exec 未过滤输入；依赖用 lockfile + 审计\n版权 → 不把涉密代码喂给公有云模型；自训/本地模型处理敏感；产出做相似度自查\n合规 → 保留\"人类审阅记录\"；关键系统强制 Code Review + 测试\n```\n\n**团队红绿灯示例**：\n\n```text\n🟢 允许：用 AI 写样板、单测、重构建议（须 Review）\n🟡 谨慎：AI 写涉及密钥/权限的代码（须安全 Review）\n🔴 禁止：把客户数据/源码明文喂公有模型；AI 直接上生产不改审\n```\n\n### 名词解释\n- **依赖投毒（Dependency Poisoning）**：恶意包混入依赖树。AI 可能推荐不知名包，须用 lockfile 锁定并做审计。\n- **GPL 传染性（Copyleft）**：GPL 类协议要求衍生作品也开源。若 AI 产出\"撞脸\"GPL 代码，商用有合规风险。\n- **红绿灯清单（RAG List）**：团队对\"AI 能做什么\"的允许/谨慎/禁止分级，把模糊的\"能用 AI 吗\"变成明确规则。\n\n### 课后练习\n1. 为什么\"把公司源码明文喂给公有云模型\"是 🔴 禁止项？\n   - 答案：可能违反数据保密协议、把知识产权暴露给第三方，且模型方可能将输入用于训练；敏感代码应走本地/授权模型。\n2. 依赖投毒如何防范？\n   - 答案：锁定 lockfile、只装可信源、用 `npm audit` 等工具审计、警惕 AI 推荐的冷门包。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n安全和版权是 Vibe Coding 不能回避的成人话题。AI 让写代码变容易的同时，也让\"不小心引入风险\"变容易——一句硬编码密钥、一个冷门依赖、一段喂给公有模型的源码，都可能酿成事故。我的立场很明确：效率红利要拿，但红线不能碰。把风险分成安全/版权/合规三类，再落成团队\"红绿灯清单\"，是把个人谨慎变成组织能力的做法。特别要提醒：版权风险常被忽视——AI 产出可能无意间\"撞脸\"某开源协议，商用前做相似度自查是底线。Vibe Coding 的成熟标志，不是你用得多溜，而是你知道哪里绝对不能让它碰。负责任的 AI 协作，才是能长期跑下去的协作。"
  },
  {
    "id": "vibc-l13",
    "chapter": "quality",
    "title": "识别与应对 AI 的「幻觉」",
    "minutes": 40,
    "content": "### 本节目标\n- 认识 AI 幻觉在代码场景的 4 种表现\n- 掌握\"三招拦截幻觉\"的实操\n- 建立\"凡 AI 说的 API，先查官方文档\"的反射\n\n**4 种幻觉表现**：\n\n```text\n① 编造不存在的 API / 函数名（如 fs.readAllSync）\n② 给过时的用法（旧版本签名、已废弃方法）\n③ 逻辑看似合理但边界错（off-by-one、漏处理 null）\n④ 引用不存在的库或版本\n```\n\n**三招拦截**：\n\n```text\n招1 类型守卫：用 TypeScript，编译期就能抓出\"不存在的函数\"\n招2 官方文档：凡 AI 提到的 API，先去官方文档/类型定义核对\n招3 自证运行：让 AI 给\"能跑的最小验证\"，你自己跑一遍\n```\n\n**示例**：AI 写了 `fs.readAllSync('a.txt')`，你一查 Node 文档发现没有这个函数（应为 `fs.readFileSync`）——这就是典型幻觉，TS 也会立刻标红。\n\n### 名词解释\n- **幻觉（Hallucination）**：AI 生成看似合理但实际不存在/错误的内容。代码幻觉尤危险，因为它\"像真的\"却跑不通或行为错。\n- **类型守卫（TS）**：用 TypeScript 的类型系统在编译期校验函数/字段是否存在，能在运行前抓出大量\"编造 API\"类幻觉。\n- **官方文档核对**：把 AI 提及的 API 名去官方文档/`.d.ts` 类型定义里验证存在性与签名，是拦截幻觉的黄金动作。\n\n### 课后练习\n1. 为什么 TypeScript 能拦住很多\"编造 API\"的幻觉？\n   - 答案：TS 编译时查类型定义，调用不存在的函数/字段会直接报错，把\"运行时才炸\"提前到\"写代码时就红\"。\n2. 招3\"自证运行\"具体怎么做？\n   - 答案：让 AI 给一段能直接 `node`/浏览器跑的最小验证（含输入与期望输出），你亲自跑，跑不通即证明有诈。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n幻觉是 Vibe Coding 必须直面的\"原罪\"。AI 生成代码时，会自信地写出根本不存在的函数名、过时的 API、看似对实则错的边界处理——而且它\"说\"得理直气壮，让你容易轻信。我的三条拦截招里，最该养成的是\"反射性查官方文档\"：凡 AI 抛出一个 API，先去文档或 `.d.ts` 里确认它真的存在、签名正确。TypeScript 是免费的第一道防线，它把一堆幻觉在编译期就红给你看。招3\"自证运行\"则把信任建立在\"我亲眼跑过\"而非\"AI 说能跑\"。请记住：AI 不会因为你信任它就变准确。对它的每个具体断言保持轻微怀疑、用验证收口，是你与幻觉之间最稳的防火墙。"
  },
  {
    "id": "vibc-l14",
    "chapter": "team",
    "title": "把 AI 安全融入研发工作流",
    "minutes": 40,
    "content": "### 本节目标\n- 把前面所学沉淀成团队可执行的流程\n- 画出\"人 + AI\"协作的研发流程图\n- 知道哪些节点必须\"人在回路\"\n\n**协作流程图（人在回路的关键节点打 ★）**：\n\n```text\n需求 → ★拆解(人) → 提示(AI) → 生成(AI) → ★验证(人跑测试)\n     → 审查(人/AI互审) → ★验收(人) → 合并 → 监控\n```\n\n**必须\"人在回路\"的节点**：\n- 需求拆解（人定方向）\n- 验证（人跑测试/手测，AI 不替你担责）\n- 验收与合并（人最终签字）\n\n**落地动作**：\n- 模板化 Prompt 进团队知识库\n- 强制 AI 代码走 PR + Review\n- CI 里跑测试与基础安全扫描\n\n### 名词解释\n- **人在回路（Human-in-the-loop）**：关键决策点必须由人确认，AI 不自动拍板。是可控 AI 协作的核心原则。\n- **PR（Pull Request）**：代码合并前的评审单元。强制 AI 代码走 PR，等于强制一道人审关卡。\n- **CI（持续集成）**：每次提交自动跑测试/扫描。把\"验证\"从人肉变成自动关卡，防 AI 代码带病合并。\n\n### 课后练习\n1. 为什么\"验证\"节点不能交给 AI 自己说自己通过？\n   - 答案：AI 可能基于错误前提自证\"通过\"；客观验证（测试/手测）须由人或独立工具执行，才能形成真实质量闸门。\n2. CI 在 AI 协作流程里起什么作用？\n   - 答案：把测试与安全扫描自动化为合并闸门，任何 AI 代码想进主干都必须先过客观检查，降低人为疏漏。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n把 AI 安全融入团队流程，是把个人最佳实践升级成组织能力的关键一跃。单打独斗时你靠自觉，团队协作时必须靠\"流程\"把自觉固化下来。我画的那张图只有一个核心思想：AI 可以承包\"生成\"，但\"拆解、验证、验收\"这三个节点必须永远留给人。这不是不信任 AI，而是权责清晰——AI 不替你对生产事故负责，签字的人是你。落地上，模板化 Prompt 进知识库、AI 代码强制走 PR、CI 自动跑测试扫描，这三件事成本不高却能把风险压到最低。Vibe Coding 在团队里能不能用好，不取决于工具多强，而取决于你有没有把\"人该在哪儿把关\"写进流程。流程到位，AI 是倍增器；流程缺位，AI 是放大器（放大错误）。"
  },
  {
    "id": "vibc-l15",
    "chapter": "team",
    "title": "常见 anti-pattern 与避坑清单",
    "minutes": 40,
    "content": "### 本节目标\n- 识别 8 个 Vibe Coding 常见反模式\n- 知道每个反模式的修正动作\n- 把\"踩过的坑\"变成团队的\"禁做清单\"\n\n**8 个 anti-pattern**：\n\n```text\n1. 不验证就合并        → 修：AI 代码必须跑测试/手测后才合\n2. 一次生成大杂烩      → 修：拆小步，一次一件事\n3. 无 git 基线就上 Agent → 修：先提交，出事可回退\n4. 把机密喂公有模型    → 修：敏感走本地/授权模型\n5. 盲信 AI 的 API      → 修：查官方文档+TS 守卫\n6. 不写测试            → 修：关键路径补单测，修 bug 补回归\n7. 直接上生产不审      → 修：强制 PR + Code Review\n8. 把 AI 当架构师      → 修：架构/选型由人定，AI 做实现\n```\n\n**使用方式**：把这张表贴进团队 wiki，作为\"AI 协作禁做清单\"，Review 时逐条对照。\n\n### 名词解释\n- **Anti-pattern（反模式）**：看似方便实则有害的做法。识别它们比记住\"正确做法\"更实用，因为错误往往重复出现。\n- **禁做清单（Don't-do List）**：把高频错误显式列成\"不要做\"，比正面规范更易在评审时快速对照。\n- **架构决策权**：系统结构、技术选型等\"方向性\"决定必须由人做；AI 适合\"在既定方向上实现细节\"。\n\n### 课后练习\n1. 为什么\"把 AI 当架构师\"是反模式？\n   - 答案：架构关乎长期可演进性、成本与风险权衡，需要领域判断与担责；AI 缺乏全局上下文与问责，不宜主导方向性决策。\n2. \"一次生成大杂烩\"的危害是什么？\n   - 答案：大块代码出错难定位、难 Review，且 AI 容易在长生成里前后不一致；拆小步更可控、更易验证。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\nanti-pattern 清单是这门课最\"防身\"的一页。正面教\"该怎么做\"往往记不牢，但\"别踩这些坑\"会因为痛过而刻骨铭心。我列的 8 条，每一条都对应一个真实翻车现场：没基线就上 Agent 结果改崩全栈、盲信 API 上线即 500、不写测试修东漏西……把它们贴在团队 wiki 当\"禁做清单\"，评审时逐条打勾，比任何口号都管用。特别想强调第 8 条\"别把 AI 当架构师\"——这是最隐蔽的陷阱：AI 很会\"侃架构\"，但架构是权衡与担责的艺术，需要你对业务和未来的判断。让 AI 在既定方向上实现细节，把方向性决策留给自己，这个边界守住了，Vibe Coding 才是助力而非负债。"
  },
  {
    "id": "vibc-l16",
    "chapter": "team",
    "title": "工程师能力迁移：从「写代码」到「定义 + 验收」",
    "minutes": 45,
    "content": "### 本节目标\n- 梳理 AI 时代工程师的\"判断层\"能力清单\n- 理解\"写代码\"技能让位、\"定义与验收\"升值\n- 用本课方法论收官，形成个人 AI 协作手册\n\n**能力迁移地图**：\n\n```text\n贬值（仍要会，但不再是核心竞争力）：\n  逐行写样板、记忆 API 拼写、手写重复 CRUD\n升值（AI 越强越值钱）：\n  把模糊需求拆成可验证子任务\n  写清楚约束与样例的 Prompt 能力\n  独立验证与 Code Review 的判断力\n  对安全/版权的风险嗅觉\n  定架构与选型的决策力\n```\n\n**个人 AI 协作手册（收官模板）**：\n\n```text\n我的 Vibe 工作流：\n1. 拆：把需求切成小、可验证的子任务\n2. 选：按复杂度选 L1/L2/L3 工具 + 设 git 基线\n3. 提：用模板化 Prompt（上下文+约束+验证）\n4. 验：自己跑测试/手测，三件具体行为确认\n5. 审：过 4 类 Review 清单（正确/安全/性能/可维护）\n6. 锁：修 bug 补回归测试，敏感不喂公有模型\n```\n\n### 名词解释\n- **判断层能力（Judgment Layer）**：定义问题、评估结果、识别风险的能力。AI 接管实现后，这层成为人类工程师的核心价值。\n- **能力迁移（Skill Shift）**：技术变革中，某些技能重要性下降、另一些上升的现象。主动迁移到\"AI 替不了的\"能力是职业护城河。\n- **AI 协作手册**：把适合自己的一套流程（拆/选/提/验/审/锁）固化成文，形成可复用的方法论，而非每次临场发挥。\n\n### 课后练习\n1. 为什么\"记忆 API 拼写\"这类能力在贬值？\n   - 答案：AI 补全/生成让拼写与样板不再消耗人力；价值转向\"知道该用什么、为什么、对不对\"的判断力。\n2. 收官手册里\"锁\"这一步为什么不可或缺？\n   - 答案：补回归测试把修复固化，敏感不喂模型守住安全；没有\"锁\"，前面的努力会因复发或泄密而失效。\n\n### 工业级工程落地模板与可复用代码范式\n\n为了将本节方法论真正转化为团队日常研发生产力，需要在项目仓库中固化**上下文声明文件（Project Rules）**与**自动化验证闭环脚本（Verification Harness）**，避免每次对话都重复口述背景约束：\n\n```javascript\n// 自动化 AI 产出验收守卫（Verification Gate）：在接收 AI 生成或重构的代码后，\n// 自动串联执行语法静态检查、边界单测与性能基线比对，只有 100% 通过才写入工作区\nexport async function verifyAiPatch({ targetFile, testSuite, maxBundleDeltaKb = 10 }) {\n  const report = { syntaxOk: false, testsPassed: false, regressions: [] }\n\n  // 1. 静态契约检查：禁止遗留 TODO 占位符、禁止吞掉 catch 异常、禁止隐式 any\n  const source = await readSourceFile(targetFile)\n  if (/\\/\\/\\s*TODO|\\/\\/\\s*\\.\\.\\.rest of code/i.test(source)) {\n    report.regressions.push('检测到未展开的代码省略占位符（Lazy Ellipsis）')\n  }\n\n  // 2. 运行确定性单元测试集（含正常路径、空值边界、并发竞态与异常分支）\n  const testResult = await testSuite.runAll()\n  report.syntaxOk = true\n  report.testsPassed = testResult.failed === 0\n  if (!report.testsPassed) {\n    report.regressions.push(...testResult.failures)\n  }\n\n  return report\n}\n```\n\n### 生产环境执行检查表（Checklist）\n\n| 验收阶段 | 关键检查动作 | 阻断标准（出现即打回重生成） |\n| :--- | :--- | :--- |\n| **1. 上下文对齐** | 显式提供目标文件完整导出签名、依赖版本与禁止修改的公共契约 | 凭空捏造不存在的第三方 API 或修改了未授权的公共接口 |\n| **2. 边界防御** | 检查空数组、网络超时、`AbortController` 取消、大输入量时间复杂度 | 仅覆盖 Happy Path，缺少异常捕获或存在 `O(n²)` 嵌套遍历 |\n| **3. 自动化回归** | 执行 `npm run check`（构建 + 路由断言 + 单测）验证零回归 | 任何存量测试用例失败或破坏现有 SEO / 类型契约 |\n\n## 总结\n这一课是整门 Vibe Coding 的收官，也是视角最大的一次升维：当 AI 能写代码，工程师的价值不是\"会不会写\"，而是\"会不会定义与验收\"。我给出的能力迁移地图，把\"贬值项\"（样板、拼写、重复 CRUD）和\"升值项\"（拆解、Prompt、验证、审查、风险嗅觉、架构决策）分得清清楚楚——你的职业护城河，要主动挖在升值那一侧。最后那张\"拆/选/提/验/审/锁\"的个人手册，是把整门课从\"知识\"变成\"习惯\"的关键一步：别让方法论停留在笔记里，固化成你每次开工前的 Checklist，它才真正为你所用。Vibe Coding 的终点不是\"不用学编程\"，而是\"以更高维度用编程\"——你从代码的书写者，成长为系统的定义者与把关人。"
  }
]

export const vibePlan = [
  {
    "day": 1,
    "theme": "认知建立",
    "lessonIds": [
      "vibc-l1",
      "vibc-l2"
    ],
    "practice": [
      "vib-001",
      "vib-003"
    ],
    "goal": "能 30 秒讲清 Vibe Coding 是什么，并说清三种写码方式的边界"
  },
  {
    "day": 2,
    "theme": "工作流闭环",
    "lessonIds": [
      "vibc-l3",
      "vibc-l4"
    ],
    "practice": [
      "vib-006"
    ],
    "goal": "画出 5 步闭环，能按任务选对工具层级（L1/L2/L3）"
  },
  {
    "day": 3,
    "theme": "Prompt 实战",
    "lessonIds": [
      "vibc-l5",
      "vibc-l6"
    ],
    "practice": [
      "vib-007"
    ],
    "goal": "掌握 6 条铁律，能改写烂 prompt，套用 6 类模板"
  },
  {
    "day": 4,
    "theme": "案例1 · Vue 组件",
    "lessonIds": [
      "vibc-l7"
    ],
    "practice": [
      "vib-004"
    ],
    "goal": "用 Cursor 从 0 搭一个待办组件，跑通三件事验证"
  },
  {
    "day": 5,
    "theme": "案例2 · CLI 闭环",
    "lessonIds": [
      "vibc-l8"
    ],
    "practice": [],
    "goal": "用 Claude Code 让 Agent 自主生成接口并自测通过"
  },
  {
    "day": 6,
    "theme": "案例3 · 报错驱动",
    "lessonIds": [
      "vibc-l9"
    ],
    "practice": [
      "vib-005"
    ],
    "goal": "用 3 轮打法修一个真实 bug，并补回归测试"
  },
  {
    "day": 7,
    "theme": "案例4 · 补测试",
    "lessonIds": [
      "vibc-l10"
    ],
    "practice": [
      "vib-004"
    ],
    "goal": "用 AI 给遗留代码补单测，覆盖率冲到 80%"
  },
  {
    "day": 8,
    "theme": "代码审查",
    "lessonIds": [
      "vibc-l11"
    ],
    "practice": [
      "vib-005"
    ],
    "goal": "建立 4 类审查清单，能逐条 review AI 代码"
  },
  {
    "day": 9,
    "theme": "安全与版权",
    "lessonIds": [
      "vibc-l12"
    ],
    "practice": [
      "vib-008"
    ],
    "goal": "认清 3 类风险，能写一份团队 AI 编程红绿灯清单"
  },
  {
    "day": 10,
    "theme": "应对幻觉",
    "lessonIds": [
      "vibc-l13"
    ],
    "practice": [
      "vib-008"
    ],
    "goal": "识别 4 种幻觉，用 TS+文档+自证三招拦截"
  },
  {
    "day": 11,
    "theme": "团队落地",
    "lessonIds": [
      "vibc-l14",
      "vibc-l15"
    ],
    "practice": [
      "vib-009",
      "vib-010"
    ],
    "goal": "画出团队 AI 协作流程图，列出 8 条 anti-pattern"
  },
  {
    "day": 12,
    "theme": "能力迁移收官",
    "lessonIds": [
      "vibc-l16"
    ],
    "practice": [
      "vib-002",
      "vib-003"
    ],
    "goal": "梳理判断层能力清单，整门课收官形成 AI 协作方法论"
  },
  {
    "day": 1,
    "lessonId": "vibc-l1",
    "title": "Vibe Coding 的由来与核心理念",
    "goal": "掌握「Vibe Coding 的由来与核心理念」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 2,
    "lessonId": "vibc-l2",
    "title": "Vibe Coding vs 传统编程 vs Copilot 补全",
    "goal": "掌握「Vibe Coding vs 传统编程 vs Copilot 补全」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 3,
    "lessonId": "vibc-l3",
    "title": "黄金闭环：需求拆解 → 提示 → 生成 → 验证 → 验收",
    "goal": "掌握「黄金闭环：需求拆解 → 提示 → 生成 → 验证 → 验收」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 4,
    "lessonId": "vibc-l4",
    "title": "工具选型地图：Cursor / Claude Code / Copilot / Aider",
    "goal": "掌握「工具选型地图：Cursor / Claude Code / Copilot / Aider」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 5,
    "lessonId": "vibc-l5",
    "title": "写好写码 Prompt 的 6 条铁律",
    "goal": "掌握「写好写码 Prompt 的 6 条铁律」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 6,
    "lessonId": "vibc-l6",
    "title": "实战 Prompt 模板库（组件/脚本/重构/SQL/正则/调试）",
    "goal": "掌握「实战 Prompt 模板库（组件/脚本/重构/SQL/正则/调试）」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 7,
    "lessonId": "vibc-l7",
    "title": "案例1 · 用 Cursor 从 0 搭一个带搜索的待办 Vue 组件",
    "goal": "掌握「案例1 · 用 Cursor 从 0 搭一个带搜索的待办 Vue 组件」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 8,
    "lessonId": "vibc-l8",
    "title": "案例2 · 用 Claude Code CLI 生成 Express 接口并自动自测",
    "goal": "掌握「案例2 · 用 Claude Code CLI 生成 Express 接口并自动自测」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 9,
    "lessonId": "vibc-l9",
    "title": "案例3 · 把报错信息丢给 AI，3 轮迭代修好生产 bug",
    "goal": "掌握「案例3 · 把报错信息丢给 AI，3 轮迭代修好生产 bug」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 10,
    "lessonId": "vibc-l10",
    "title": "案例4 · 用 AI 给遗留代码补单测，覆盖率从 0 到 80%",
    "goal": "掌握「案例4 · 用 AI 给遗留代码补单测，覆盖率从 0 到 80%」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 11,
    "lessonId": "vibc-l11",
    "title": "AI 代码的 Code Review 清单",
    "goal": "掌握「AI 代码的 Code Review 清单」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 12,
    "lessonId": "vibc-l12",
    "title": "安全与版权风险与规避",
    "goal": "掌握「安全与版权风险与规避」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 13,
    "lessonId": "vibc-l13",
    "title": "识别与应对 AI 的「幻觉」",
    "goal": "掌握「识别与应对 AI 的「幻觉」」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 14,
    "lessonId": "vibc-l14",
    "title": "把 AI 安全融入研发工作流",
    "goal": "掌握「把 AI 安全融入研发工作流」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 15,
    "lessonId": "vibc-l15",
    "title": "常见 anti-pattern 与避坑清单",
    "goal": "掌握「常见 anti-pattern 与避坑清单」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  },
  {
    "day": 16,
    "lessonId": "vibc-l16",
    "title": "工程师能力迁移：从「写代码」到「定义 + 验收」",
    "goal": "掌握「工程师能力迁移：从「写代码」到「定义 + 验收」」的核心工作流与验收清单，并在真实工程代码中完成演练。",
    "minutes": 25
  }
]
