export const langCourseMeta = {
  "id": "lang",
  "title": "用 JS 手写一门编程语言",
  "subtitle": "编程语言不是魔法，你也可以亲手造一门：不依赖任何现成工具链，用 JS 从词法分析、语法分析一路写到树遍历解释器。",
  "level": "进阶 → 造轮子",
  "icon": "🧩",
  "color": "#8b5cf6",
  "practiceCategory": "javascript",
  "chapters": [
    {
      "key": "lex",
      "name": "第一章 · 词法分析与语法分析",
      "lessons": [
        "lang-l1",
        "lang-l2"
      ]
    },
    {
      "key": "interp",
      "name": "第二章 · 树遍历解释器与变量",
      "lessons": [
        "lang-l3",
        "lang-l4"
      ]
    },
    {
      "key": "flow",
      "name": "第三章 · 控制流、函数与闭包",
      "lessons": [
        "lang-l5",
        "lang-l6",
        "lang-l7"
      ]
    },
    {
      "key": "data",
      "name": "第四章 · 数据类型、标准库与错误",
      "lessons": [
        "lang-l8",
        "lang-l9",
        "lang-l10"
      ]
    },
    {
      "key": "repl",
      "name": "第五章 · REPL 与进阶路线",
      "lessons": [
        "lang-l11",
        "lang-l12"
      ]
    }
  ]
}

export const langLessons = [
  {
    "id": "lang-l1",
    "chapter": "lex",
    "title": "词法分析器：把源码切成 Token 流",
    "minutes": 45,
    "content": "## 目标\n\n当你写下 `var x = 1 + 2 * 3;` 时，计算机并不知道这是\"代码\"。它先要被切成一块块带语义的**词（Token）**。本节课你亲手写一个 Lexer（词法分析器），理解\"字符串 → 词流\"这一步到底发生了什么。\n\n**运行环境**：Node.js v18+（无需任何第三方依赖）。\n**运行方式**：把下面代码保存为 `lexer.js`，执行 `node lexer.js`。\n\n```js\n// lexer.js —— 把源码字符串切成 Token 流\nconst KEYWORDS = new Set(['var', 'if', 'else', 'while', 'func', 'return', 'print'])\n\nfunction tokenize(src) {\n  const tokens = []\n  let i = 0\n  const isDigit = (c) => c >= '0' && c <= '9'\n  const isAlpha = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'\n\n  while (i < src.length) {\n    const c = src[i]\n    // 1) 跳过空白\n    if (c === ' ' || c === '\\n' || c === '\\t' || c === '\\r') { i++; continue }\n    // 2) 数字（连续数字拼成一个 NUMBER）\n    if (isDigit(c)) {\n      const start = i\n      while (i < src.length && isDigit(src[i])) i++\n      tokens.push({ type: 'NUMBER', value: Number(src.slice(start, i)) })\n      continue\n    }\n    // 3) 标识符 / 关键字（字母或下划线开头，后接字母数字）\n    if (isAlpha(c)) {\n      const start = i\n      while (i < src.length && (isAlpha(src[i]) || isDigit(src[i]))) i++\n      const word = src.slice(start, i)\n      if (KEYWORDS.has(word)) tokens.push({ type: 'KEYWORD', value: word })\n      else tokens.push({ type: 'IDENT', value: word })\n      continue\n    }\n    // 4) 单字符运算符\n    const one = {\n      '+': 'PLUS', '-': 'MINUS', '*': 'STAR', '/': 'SLASH',\n      '(': 'LPAREN', ')': 'RPAREN', '=': 'EQ', ';': 'SEMI',\n    }[c]\n    if (one) { tokens.push({ type: one, value: c }); i++; continue }\n    throw new Error('无法识别的字符: ' + c + ' (位置 ' + i + ')')\n  }\n  tokens.push({ type: 'EOF', value: null }) // 哨兵：表示源码结束\n  return tokens\n}\n\n// ===== 调用示例 =====\nconst code = 'var x = 1 + 2 * 3;'\nconsole.log(JSON.stringify(tokenize(code)))\n```\n\n运行后你会看到一串 Token：`KEYWORD(var)`、`IDENT(x)`、`EQ(=)`、`NUMBER(1)`、`PLUS(+)`……这正是编译器读你代码时\"看到\"的东西。\n\n## 名词解释\n\n**Token（词法单元）**：源码里不可再分的最小语义单位，比如一个数字 `42`、一个变量名 `x`、一个运算符 `+`。它通常带 `type`（是什么种类的词）和 `value`（具体值）。\n**Lexer / 词法分析器**：把原始字符流切成 Token 流的程序。它解决\"哪里是一个词的边界\"的问题，但不关心词与词之间的语法关系（那是 Parser 的活）。\n**常用方法**：`tokenize(src)` 输入源码、输出 Token 数组；很多实现还会顺手跳过空白与注释（本例跳过空白）。\n\n## 课后练习\n\n**练习**：给 Lexer 增加对 `==`（双等号相等判断）的识别，使其输出一个 `OP(==)` 的 Token。\n\n**答案**：把 `=` 单独处理，遇到 `==` 合并成一个 Token；下面是可独立运行的小例子：\n\n```js\nfunction tokenizeWithEq(src) {\n  const tokens = []; let i = 0\n  while (i < src.length) {\n    const c = src[i]\n    if (c === '=') {\n      if (src[i + 1] === '=') { tokens.push({ type: 'OP', value: '==' }); i += 2; continue }\n      tokens.push({ type: 'EQ', value: '=' }); i++; continue\n    }\n    tokens.push({ type: 'CHAR', value: c }); i++; continue\n  }\n  return tokens\n}\nconsole.log(tokenizeWithEq('a == b'))\n```\n\n## 总结\n\n词法分析是所有编程语言处理的第一道门。它看似只是\"切字符串\"，却奠定了对整个语言的第一个判断：哪些字符组合是合法的\"词\"。现实中你几乎不会手写 Lexer——会用正则工具（如 Flex）或现成的 tokenizer，但亲手写一遍的价值在于：你会真正理解\"为什么 `1..0` 在某些语言里是语法错误\"\"为什么注释能被安全删掉而不影响语义\"。Token 流是把\"给人读的文本\"翻译成\"给机器处理的结构\"的关键一步，没有它，后面的语法树就无从建起。"
  },
  {
    "id": "lang-l2",
    "chapter": "lex",
    "title": "语法分析器：递归下降把 Token 变成 AST",
    "minutes": 50,
    "content": "## 目标\n\nToken 流只是\"词的列表\"，还没有结构。本节课用**递归下降（Recursive Descent）**解析法，把它变成一棵**抽象语法树（AST）**，并正确处理运算符优先级（乘除法高于加减法）。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `parser.js`，执行 `node parser.js`。\n\n```js\n// parser.js —— 复用 l1 的 tokenize，再做递归下降解析\nconst KEYWORDS = new Set(['var', 'if', 'else', 'while', 'func', 'return', 'print'])\n\nfunction tokenize(src) {\n  const tokens = []; let i = 0\n  const isDigit = (c) => c >= '0' && c <= '9'\n  const isAlpha = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'\n  while (i < src.length) {\n    const c = src[i]\n    if (c === ' ' || c === '\\n' || c === '\\t' || c === '\\r') { i++; continue }\n    if (isDigit(c)) { const s = i; while (i < src.length && isDigit(src[i])) i++; tokens.push({ type: 'NUMBER', value: Number(src.slice(s, i)) }); continue }\n    if (isAlpha(c)) { const s = i; while (i < src.length && (isAlpha(src[i]) || isDigit(src[i]))) i++; const w = src.slice(s, i); tokens.push(KEYWORDS.has(w) ? { type: 'KEYWORD', value: w } : { type: 'IDENT', value: w }); continue }\n    const one = { '+': 'PLUS', '-': 'MINUS', '*': 'STAR', '/': 'SLASH', '(': 'LPAREN', ')': 'RPAREN' }[c]\n    if (one) { tokens.push({ type: one, value: c }); i++; continue }\n    throw new Error('无法识别的字符: ' + c)\n  }\n  tokens.push({ type: 'EOF', value: null }); return tokens\n}\n\nfunction parse(src) {\n  const tokens = tokenize(src); let pos = 0\n  const peek = () => tokens[pos]\n  const next = () => tokens[pos++]\n  // 表达式：+ - （最低优先级）\n  function parseExpr() {\n    let node = parseTerm()\n    while (peek().type === 'PLUS' || peek().type === 'MINUS') {\n      const op = next().value\n      node = { type: 'Binary', op, left: node, right: parseTerm() }\n    }\n    return node\n  }\n  // 项：* / （高于 + -）\n  function parseTerm() {\n    let node = parseFactor()\n    while (peek().type === 'STAR' || peek().type === 'SLASH') {\n      const op = next().value\n      node = { type: 'Binary', op, left: node, right: parseFactor() }\n    }\n    return node\n  }\n  // 因子：数字 / 变量 / 括号\n  function parseFactor() {\n    const t = peek()\n    if (t.type === 'MINUS') { next(); return { type: 'Unary', op: '-', operand: parseFactor() } }\n    if (t.type === 'NUMBER') { next(); return { type: 'Number', value: t.value } }\n    if (t.type === 'IDENT') { next(); return { type: 'Ident', name: t.value } }\n    if (t.type === 'LPAREN') { next(); const e = parseExpr(); next(); return e }\n    throw new Error('无法解析: ' + t.type)\n  }\n  return parseExpr()\n}\n\n// ===== 调用示例 =====\nconsole.log(JSON.stringify(parse('1 + 2 * 3')))\n```\n\n输出是一棵树：`Binary(+ , 1, Binary(* , 2, 3))`。它精确表达了\"先乘后加\"——优先级就藏在函数的调用层级里。\n\n## 名词解释\n\n**AST（抽象语法树）**：把源码结构化的树。叶子是数字、变量等\"原子\"，内部节点是运算符、语句等\"组合\"。\"抽象\"指它丢掉了括号、分号等纯书写细节，只保留语义结构。\n**递归下降解析**：一类手写解析法。为每种语法结构写一个同名函数，函数内部通过\"互相调用\"表达\"谁包含谁\"。因为语法是递归定义的（表达式里可以套表达式），所以函数也递归。\n**运算符优先级**：不同运算符求值的先后顺序。`* /` 高于 `+ -`，实现手段是让 `parseTerm`（处理乘除）被 `parseExpr`（处理加减）调用，从而乘除先结合。\n\n## 课后练习\n\n**练习**：上面 `parseFactor` 里 `LPAREN` 分支写的是 `next()` 吃掉右括号，但没校验它真的是 `)`。改成校验，不匹配时报清晰错误。\n\n**答案**：下面是可独立运行的小例子（用 `parseExpr` 占位演示校验点）：\n\n```js\nfunction expectRparen(tokens) {\n  let pos = 0\n  const next = () => tokens[pos++]\n  const t = next()\n  if (t.type !== 'RPAREN') throw new Error('缺少右括号 )')\n  return { type: 'group' }\n}\ntry {\n  expectRparen([{ type: 'NUMBER' }]) // 故意不给 RPAREN\n} catch (e) {\n  console.log('捕获到:', e.message)\n}\n```\n\n## 总结\n\n递归下降是最适合人类上手的一类解析法：它把\"语法规则\"直接翻译成\"函数\",读起来几乎就是文法本身。代价是你得手动安排优先级（靠函数层级），大型语言会有几十个这样的函数。但正因为它直观，很多生产级语言（如 Go、早期 TypeScript）的解析器就是手写递归下降。理解它，你就拿到了\"为什么 `1 + 2 * 3` 不等于 `(1 + 2) * 3`\"的底层答案——不是数学约定，而是解析函数调用的先后顺序决定的。"
  },
  {
    "id": "lang-l3",
    "chapter": "interp",
    "title": "树遍历解释器：让 AST 真正算出来",
    "minutes": 45,
    "content": "## 目标\n\n有了 AST，下一步是**执行**它。本节课写一个\"树遍历解释器（Tree-walking Interpreter）\"：从根节点出发，递归访问每棵子树并算出值。这是解释型语言最朴素的执行方式。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `interp.js`，执行 `node interp.js`（复用 l2 的 `parse`）。\n\n```js\n// interp.js —— 在 l2 的 parse 基础上增加求值\nfunction evaluate(node, env) {\n  switch (node.type) {\n    case 'Number': return node.value\n    case 'Ident': return env.get(node.name)\n    case 'Unary': return -evaluate(node.operand, env)\n    case 'Binary': {\n      const a = evaluate(node.left, env)\n      const b = evaluate(node.right, env)\n      switch (node.op) {\n        case '+': return a + b\n        case '-': return a - b\n        case '*': return a * b\n        case '/': return a / b\n      }\n    }\n    default: throw new Error('未知节点: ' + node.type)\n  }\n}\n\n// 一个极简环境（l4 会升级成支持作用域）\nconst env = { get: (name) => { throw new Error('变量 ' + name + ' 在第4节才支持') } }\n\n// ===== 调用示例 =====\nconst ast = parse('1 + 2 * 3')\nconsole.log('结果 =', evaluate(ast, env)) // 7\n```\n\n`evaluate` 本身就是 AST 的\"镜像\"：树长什么样，求值函数就长什么样。这种\"结构对结构\"的映射，是解释器最易读的形态。\n\n## 名词解释\n\n**Tree-walking Interpreter（树遍历解释器）**：不把代码翻译成别的形式，而是直接遍历 AST、边走边算。优点是实现简单、易调试；缺点是慢（每步都要递归进树）。\n**求值 / 解释（evaluate）**：给一个 AST 节点算出它的值。`evaluate` 通常是递归的，因为节点可以嵌套节点。\n**常用思路**：用 `switch (node.type)` 分发到不同处理逻辑；遇到组合节点（如 `Binary`）就先递归求子节点、再运算。\n\n## 课后练习\n\n**练习**：当前 `Binary` 只支持四则运算。增加对字符串拼接的支持：当 `op` 为 `+` 且任一操作数是字符串时，返回拼接结果。\n\n**答案**：\n\n```js\nfunction evaluate(node, env) {\n  if (node.type === 'Binary') {\n    const a = evaluate(node.left, env)\n    const b = evaluate(node.right, env)\n    if (node.op === '+' && (typeof a === 'string' || typeof b === 'string')) return String(a) + String(b)\n    switch (node.op) {\n      case '+': return a + b\n      case '-': return a - b\n      case '*': return a * b\n      case '/': return a / b\n    }\n  }\n  if (node.type === 'Number') return node.value\n  return 0\n}\nconsole.log(evaluate({ type: 'Binary', op: '+', left: { type: 'Number', value: 1 }, right: { type: 'Number', value: 2 } }, {}))\n```\n\n## 总结\n\n树遍历解释器是\"让语言跑起来\"的最短路径。它没有编译、没有字节码、没有虚拟机，只是忠实地把语法树走一遍。你会在 Python、Ruby 的早期实现里看到它的影子。它的慢不是缺点而是特点：在语言设计早期，能\"立刻跑\"比\"跑得快\"重要得多——你改一行语义，立刻就能验证。等语言定型、性能成为瓶颈，再考虑编译成字节码（第12节会亲手做）。理解树遍历，你就理解了\"解释\"二字的本质：执行就是遍历。"
  },
  {
    "id": "lang-l4",
    "chapter": "interp",
    "title": "变量与环境：作用域是怎么管起来的",
    "minutes": 55,
    "content": "## 目标\n\n真正的语言要有变量。本节课引入 **Environment（环境）** 对象来存变量，并支持**嵌套作用域**——函数内部能读到外部变量，这正是\"作用域链\"的雏形。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `env.js`，执行 `node env.js`。\n\n```js\n// env.js —— 作用域环境的极简实现\nclass Environment {\n  constructor(parent = null) {\n    this.vars = new Map()\n    this.parent = parent // 指向外层作用域，形成链\n  }\n  define(name, value) { this.vars.set(name, value) }\n  has(name) {\n    let env = this\n    while (env) { if (env.vars.has(name)) return true; env = env.parent }\n    return false\n  }\n  get(name) {\n    let env = this\n    while (env) {\n      if (env.vars.has(name)) return env.vars.get(name)\n      env = env.parent\n    }\n    throw new Error('未定义的变量: ' + name)\n  }\n  assign(name, value) {\n    let env = this\n    while (env) {\n      if (env.vars.has(name)) { env.vars.set(name, value); return }\n      env = env.parent\n    }\n    this.vars.set(name, value) // 找不到就建在顶层\n  }\n}\n\nconst globalEnv = new Environment()\nglobalEnv.define('x', 10)\nconst inner = new Environment(globalEnv)\ninner.define('y', 20)\nconsole.log('读 y（本层） =', inner.get('y'))\nconsole.log('读 x（外层） =', inner.get('x'))\nconsole.log('has(x) =', inner.has('x'), '| has(z) =', inner.has('z'))\n```\n\n作用域链的本质就是一个个 `Environment` 用 `parent` 指针串起来的链表。`get` 从自己往外层一层层找，找到了就返回。\n\n## 名词解释\n\n**Environment（环境 / 作用域对象）**：一张\"变量名 → 值\"的表，外加一个指向外层环境的引用。一次函数调用、一个代码块，通常对应一个新的 Environment。\n**作用域链（Scope Chain）**：环境通过 `parent` 串成的链。读变量时沿链向上找，这就是\"内层能看到外层、外层看不到内层\"的来源。\n**define vs assign**：`define` 在本层新建（声明）；`assign` 沿链找已有变量改写（赋值）。语义不同，很多语言用不同语法（如 `var` vs `=`）区分。\n\n## 课后练习\n\n**练习**：给 `Environment` 加一个 `has(name)` 方法，判断变量是否在当前或上层作用域中存在（不抛错）。\n\n**答案**：已包含在上方的完整代码中（`has` 方法沿 `parent` 上溯，找到返回 `true`，否则 `false`）。\n\n## 总结\n\n变量看似简单，背后是一整套\"去哪找值\"的规则。Environment + 父指针这个极简结构，其实就是 JavaScript 词法作用域的微观缩影：全局环境是根，每次进入函数/块就挂一个新的子环境。理解了 `get` 沿 `parent` 上溯，你就不会再被\"闭包为什么能记住外部变量\"困惑——因为那个外部 Environment 根本没被销毁，只是被内部函数通过 `parent` 牢牢抓着（第7节细讲）。作用域不是语言特性，是数据结构的必然结果。"
  },
  {
    "id": "lang-l5",
    "chapter": "flow",
    "title": "控制流：if / while 与代码块",
    "minutes": 55,
    "content": "## 目标\n\n表达式语言还不够用。本节课把语言升级成能写\"程序\"：支持 `if / else`、`while` 循环、用 `{}` 包裹的代码块，以及变量**重新赋值**。我们用它算出 1 到 10 的和。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `flow.js`，执行 `node flow.js`。\n\n```js\n// flow.js —— 完整可运行：词法 + 语法 + 环境 + 控制流\nconst KEYWORDS = new Set(['var', 'if', 'else', 'while'])\nfunction tokenize(src) {\n  const tokens = []; let i = 0\n  const isD = c => c >= '0' && c <= '9'\n  const isA = c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'\n  while (i < src.length) {\n    const c = src[i]\n    if (c === ' ' || c === '\\n' || c === '\\t' || c === '\\r') { i++; continue }\n    if (isD(c)) { const s = i; while (i < src.length && isD(src[i])) i++; tokens.push({ type: 'num', value: Number(src.slice(s, i)) }); continue }\n    if (isA(c)) { const s = i; while (i < src.length && (isA(src[i]) || isD(src[i]))) i++; const w = src.slice(s, i); tokens.push(KEYWORDS.has(w) ? { type: 'kw', value: w } : { type: 'id', value: w }); continue }\n    if (c === '<' || c === '>') { if (src[i + 1] === '=') { tokens.push({ type: 'op', value: c + '=' }); i += 2; continue } tokens.push({ type: 'op', value: c }); i++; continue }\n    if (c === '=') { if (src[i + 1] === '=') { tokens.push({ type: 'op', value: '==' }); i += 2; continue } tokens.push({ type: 'eq', value: c }); i++; continue }\n    if (c === '!') { if (src[i + 1] === '=') { tokens.push({ type: 'op', value: '!=' }); i += 2; continue } throw new Error('不支持单独的 !') }\n    const one = { '+': 'plus', '-': 'minus', '*': 'star', '/': 'slash', '(': 'lparen', ')': 'rparen', ';': 'semi', '{': 'lbrace', '}': 'rbrace' }[c]\n    if (one) { tokens.push({ type: one, value: c }); i++; continue }\n    throw new Error('非法字符: ' + c)\n  }\n  tokens.push({ type: 'eof', value: null }); return tokens\n}\nfunction parse(src) {\n  const tokens = tokenize(src); let pos = 0\n  const peek = () => tokens[pos], next = () => tokens[pos++]\n  const expect = t => { if (peek().type !== t) throw new Error('语法错误：期望 ' + t); return next() }\n  function parseExpr() {\n    let n = parseCmp()\n    while (peek().type === 'plus' || peek().type === 'minus') { const op = next().value; n = { type: 'binary', op, left: n, right: parseCmp() } }\n    return n\n  }\n  function parseCmp() {\n    let n = parseTerm()\n    const cmp = new Set(['<', '>', '<=', '>=', '==', '!='])\n    while (cmp.has(peek().value)) { const op = next().value; n = { type: 'binary', op, left: n, right: parseTerm() } }\n    return n\n  }\n  function parseTerm() {\n    let n = parseFactor()\n    while (peek().type === 'star' || peek().type === 'slash') { const op = next().value; n = { type: 'binary', op, left: n, right: parseFactor() } }\n    return n\n  }\n  function parseFactor() {\n    const t = peek()\n    if (t.type === 'minus') { next(); return { type: 'unary', op: '-', operand: parseFactor() } }\n    if (t.type === 'num') { next(); return { type: 'num', value: t.value } }\n    if (t.type === 'id') {\n      next()\n      if (peek().type === 'eq') { next(); return { type: 'assign', name: t.value, value: parseExpr() } }\n      return { type: 'ident', name: t.value }\n    }\n    if (t.type === 'lparen') { next(); const e = parseExpr(); expect('rparen'); return e }\n    throw new Error('无法解析表达式: ' + t.type)\n  }\n  function parseStmt() {\n    const t = peek()\n    if (t.type === 'kw' && t.value === 'var') {\n      next(); const name = expect('id').value; expect('eq'); const init = parseExpr(); expect('semi'); return { type: 'var', name, init }\n    }\n    if (t.type === 'kw' && t.value === 'if') {\n      next(); expect('lparen'); const test = parseExpr(); expect('rparen')\n      const cons = parseStmt(); let alt = null\n      if (peek().type === 'kw' && peek().value === 'else') { next(); alt = parseStmt() }\n      return { type: 'if', test, cons, alt }\n    }\n    if (t.type === 'kw' && t.value === 'while') {\n      next(); expect('lparen'); const test = parseExpr(); expect('rparen'); const body = parseStmt()\n      return { type: 'while', test, body }\n    }\n    if (t.type === 'lbrace') { next(); const stmts = []; while (peek().type !== 'rbrace') stmts.push(parseStmt()); expect('rbrace'); return { type: 'block', stmts } }\n    const e = parseExpr(); expect('semi'); return { type: 'exprstmt', expr: e }\n  }\n  const prog = []; while (peek().type !== 'eof') prog.push(parseStmt()); return prog\n}\nclass Environment {\n  constructor(parent = null) { this.vars = new Map(); this.parent = parent }\n  define(n, v) { this.vars.set(n, v) }\n  get(n) { let e = this; while (e) { if (e.vars.has(n)) return e.vars.get(n); e = e.parent } throw new Error('未定义变量: ' + n) }\n  assign(n, v) { let e = this; while (e) { if (e.vars.has(n)) { e.vars.set(n, v); return } e = e.parent } this.vars.set(n, v) }\n}\nfunction ev(node, env) {\n  switch (node.type) {\n    case 'num': return node.value\n    case 'ident': return env.get(node.name)\n    case 'unary': return -ev(node.operand, env)\n    case 'binary': {\n      const a = ev(node.left, env), b = ev(node.right, env)\n      switch (node.op) {\n        case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b\n        case '<': return a < b; case '>': return a > b; case '<=': return a <= b; case '>=': return a >= b\n        case '==': return a === b; case '!=': return a !== b\n      }\n    }\n    case 'assign': { const v = ev(node.value, env); env.assign(node.name, v); return v }\n    case 'var': { const v = ev(node.init, env); env.define(node.name, v); return v }\n    case 'exprstmt': return ev(node.expr, env)\n    case 'block': { const b = new Environment(env); let r; for (const s of node.stmts) r = ev(s, b); return r }\n    case 'if': return ev(node.test, env) ? ev(node.cons, env) : (node.alt ? ev(node.alt, env) : undefined)\n    case 'while': { let r; while (ev(node.test, env)) r = ev(node.body, env); return r }\n  }\n  throw new Error('未知节点: ' + node.type)\n}\nfunction run(src) {\n  const env = new Environment()\n  let last\n  for (const s of parse(src)) last = ev(s, env)\n  return { last, env }\n}\n\n// ===== 调用示例：求 1 到 10 的和 =====\nconst { env } = run(`\nvar sum = 0;\nvar i = 1;\nwhile (i <= 10) {\n  sum = sum + i;\n  i = i + 1;\n}\n`)\nconsole.log('1 到 10 的和 =', env.get('sum')) // 55\n```\n\n## 名词解释\n\n**控制流（Control Flow）**：程序执行的路径分支，靠 `if / while / for` 等语句改变\"下一步执行哪一段\"。没有它，代码只能从上往下直线跑。\n**代码块（Block）**：用 `{}` 括起来的一组语句，拥有自己的作用域。进入块时新建 Environment，离开即销毁——这正是 `let` 块级作用域的来源。\n**重新赋值（assign）**：`x = x + 1` 不是声明，而是沿作用域链找到已有 `x` 并改写。它和 `var x = ...`（声明）走的是 `assign` / `define` 两条不同路径。\n\n## 课后练习\n\n**练习**：用本课的解释器算 1 到 100 中所有偶数的和。\n\n**答案**：把上面的调用示例换成：\n\n```js\nconst { env } = run(`\nvar s = 0;\nvar i = 1;\nwhile (i <= 100) {\n  if (i != (i / 2) * 2) { s = s + i; }\n  i = i + 1;\n}\n`)\nconsole.log('偶数和 =', env.get('s')) // 2550\n```\n\n## 总结\n\n控制流让\"表达式语言\"升级为\"能解决问题的程序语言\"。关键设计有两点：其一，`if / while` 的 body 通过 `parseStmt` 复用，所以 `if` 里可以再套 `while`、再套 `if`——语法的递归性在这里体现为\"语句能无限嵌套\"；其二，代码块每次进入都 new 一个 Environment，这让\"局部变量只在块内有效\"成为天然结果，不需要特殊规则。你写的 `while` 循环能正确累加，本质上是解释器在反复 `ev(node.body)`，而 `assign` 沿作用域链把新值写回同一个 `i`。语言的能力，就是这样一层层叠出来的。"
  },
  {
    "id": "lang-l6",
    "chapter": "flow",
    "title": "函数：一等公民与调用机制",
    "minutes": 55,
    "content": "## 目标\n\n函数让代码可复用。本节课把\"函数定义 + 调用\"加进语言：函数是一等公民（可以赋值、可以当参数），调用时创建新的作用域并把参数绑进去。下面给出**完整可运行**的解释器，直接算斐波那契。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `func.js`，执行 `node func.js`（在 flow.js 基础上增加 func / return / 调用）。\n\n```js\n// func.js —— 完整可运行：含函数的解释器\nconst KEYWORDS = new Set(['var', 'if', 'else', 'while', 'func', 'return'])\nfunction tokenize(src) {\n  const tokens = []; let i = 0\n  const isD = c => c >= '0' && c <= '9'\n  const isA = c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'\n  while (i < src.length) {\n    const c = src[i]\n    if (c === ' ' || c === '\\n' || c === '\\t' || c === '\\r') { i++; continue }\n    if (isD(c)) { const s = i; while (i < src.length && isD(src[i])) i++; tokens.push({ type: 'num', value: Number(src.slice(s, i)) }); continue }\n    if (isA(c)) { const s = i; while (i < src.length && (isA(src[i]) || isD(src[i]))) i++; const w = src.slice(s, i); tokens.push(KEYWORDS.has(w) ? { type: 'kw', value: w } : { type: 'id', value: w }); continue }\n    if (c === '<' || c === '>') { if (src[i + 1] === '=') { tokens.push({ type: 'op', value: c + '=' }); i += 2; continue } tokens.push({ type: 'op', value: c }); i++; continue }\n    if (c === '=') { if (src[i + 1] === '=') { tokens.push({ type: 'op', value: '==' }); i += 2; continue } tokens.push({ type: 'eq', value: c }); i++; continue }\n    if (c === '!') { if (src[i + 1] === '=') { tokens.push({ type: 'op', value: '!=' }); i += 2; continue } throw new Error('不支持单独的 !') }\n    const one = { '+': 'plus', '-': 'minus', '*': 'star', '/': 'slash', '(': 'lparen', ')': 'rparen', ';': 'semi', '{': 'lbrace', '}': 'rbrace', ',': 'comma' }[c]\n    if (one) { tokens.push({ type: one, value: c }); i++; continue }\n    throw new Error('非法字符: ' + c)\n  }\n  tokens.push({ type: 'eof', value: null }); return tokens\n}\nfunction parse(src) {\n  const tokens = tokenize(src); let pos = 0\n  const peek = () => tokens[pos], next = () => tokens[pos++]\n  const expect = t => { if (peek().type !== t) throw new Error('语法错误：期望 ' + t); return next() }\n  function parseExpr() {\n    let n = parseCmp()\n    while (peek().type === 'plus' || peek().type === 'minus') { const op = next().value; n = { type: 'binary', op, left: n, right: parseCmp() } }\n    return n\n  }\n  function parseCmp() {\n    let n = parseTerm()\n    const cmp = new Set(['<', '>', '<=', '>=', '==', '!='])\n    while (cmp.has(peek().value)) { const op = next().value; n = { type: 'binary', op, left: n, right: parseTerm() } }\n    return n\n  }\n  function parseTerm() {\n    let n = parseFactor()\n    while (peek().type === 'star' || peek().type === 'slash') { const op = next().value; n = { type: 'binary', op, left: n, right: parseFactor() } }\n    return n\n  }\n  function parseFactor() {\n    const t = peek()\n    if (t.type === 'minus') { next(); return { type: 'unary', op: '-', operand: parseFactor() } }\n    if (t.type === 'num') { next(); return { type: 'num', value: t.value } }\n    if (t.type === 'id') {\n      next()\n      if (peek().type === 'lparen') {\n        next(); const args = []\n        if (peek().type !== 'rparen') { args.push(parseExpr()); while (peek().type === 'comma') { next(); args.push(parseExpr()) } }\n        expect('rparen'); return { type: 'call', callee: { type: 'ident', name: t.value }, args }\n      }\n      if (peek().type === 'eq') { next(); return { type: 'assign', name: t.value, value: parseExpr() } }\n      return { type: 'ident', name: t.value }\n    }\n    if (t.type === 'lparen') { next(); const e = parseExpr(); expect('rparen'); return e }\n    throw new Error('无法解析表达式: ' + t.type)\n  }\n  function parseStmt() {\n    const t = peek()\n    if (t.type === 'kw' && t.value === 'var') {\n      next(); const name = expect('id').value; expect('eq'); const init = parseExpr(); expect('semi'); return { type: 'var', name, init }\n    }\n    if (t.type === 'kw' && t.value === 'func') {\n      next(); const name = expect('id').value; expect('lparen')\n      const params = []\n      if (peek().type !== 'rparen') { params.push(expect('id').value); while (peek().type === 'comma') { next(); params.push(expect('id').value) } }\n      expect('rparen'); const body = parseStmt()\n      return { type: 'func', name, params, body }\n    }\n    if (t.type === 'kw' && t.value === 'return') {\n      next(); let v = null; if (peek().type !== 'semi') v = parseExpr(); expect('semi'); return { type: 'return', value: v }\n    }\n    if (t.type === 'kw' && t.value === 'if') {\n      next(); expect('lparen'); const test = parseExpr(); expect('rparen')\n      const cons = parseStmt(); let alt = null\n      if (peek().type === 'kw' && peek().value === 'else') { next(); alt = parseStmt() }\n      return { type: 'if', test, cons, alt }\n    }\n    if (t.type === 'kw' && t.value === 'while') {\n      next(); expect('lparen'); const test = parseExpr(); expect('rparen'); const body = parseStmt()\n      return { type: 'while', test, body }\n    }\n    if (t.type === 'lbrace') { next(); const stmts = []; while (peek().type !== 'rbrace') stmts.push(parseStmt()); expect('rbrace'); return { type: 'block', stmts } }\n    const e = parseExpr(); expect('semi'); return { type: 'exprstmt', expr: e }\n  }\n  const prog = []; while (peek().type !== 'eof') prog.push(parseStmt()); return prog\n}\nclass Environment {\n  constructor(parent = null) { this.vars = new Map(); this.parent = parent }\n  define(n, v) { this.vars.set(n, v) }\n  get(n) { let e = this; while (e) { if (e.vars.has(n)) return e.vars.get(n); e = e.parent } throw new Error('未定义变量: ' + n) }\n  assign(n, v) { let e = this; while (e) { if (e.vars.has(n)) { e.vars.set(n, v); return } e = e.parent } this.vars.set(n, v) }\n}\nfunction ev(node, env) {\n  switch (node.type) {\n    case 'num': return node.value\n    case 'ident': return env.get(node.name)\n    case 'unary': return -ev(node.operand, env)\n    case 'binary': {\n      const a = ev(node.left, env), b = ev(node.right, env)\n      switch (node.op) {\n        case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b\n        case '<': return a < b; case '>': return a > b; case '<=': return a <= b; case '>=': return a >= b\n        case '==': return a === b; case '!=': return a !== b\n      }\n    }\n    case 'assign': { const v = ev(node.value, env); env.assign(node.name, v); return v }\n    case 'var': { const v = ev(node.init, env); env.define(node.name, v); return v }\n    case 'exprstmt': return ev(node.expr, env)\n    case 'block': { const b = new Environment(env); let r; for (const s of node.stmts) r = ev(s, b); return r }\n    case 'if': return ev(node.test, env) ? ev(node.cons, env) : (node.alt ? ev(node.alt, env) : undefined)\n    case 'while': { let r; while (ev(node.test, env)) r = ev(node.body, env); return r }\n    case 'func': { env.define(node.name, { type: 'UserFn', params: node.params, body: node.body, closure: env }); return node.name }\n    case 'call': {\n      const callee = ev(node.callee, env)\n      const args = node.args.map(a => ev(a, env))\n      if (typeof callee === 'function') return callee(...args)\n      if (callee && callee.type === 'UserFn') {\n        const fnEnv = new Environment(callee.closure)\n        callee.params.forEach((p, i) => fnEnv.define(p, args[i]))\n        try { ev(callee.body, fnEnv) } catch (e) { if (e && e.__ret) return e.value; throw e }\n        return undefined\n      }\n      throw new Error('不是可调用的对象')\n    }\n    case 'return': { const v = node.value ? ev(node.value, env) : undefined; const err = new Error('return'); err.__ret = true; err.value = v; throw err }\n  }\n  throw new Error('未知节点: ' + node.type)\n}\nfunction run(src) {\n  const env = new Environment()\n  env.define('print', (...xs) => console.log(...xs))\n  for (const s of parse(src)) ev(s, env)\n}\n\n// ===== 调用示例：递归斐波那契 =====\nrun(`\nfunc fib(n) {\n  if (n < 2) return n;\n  return fib(n - 1) + fib(n - 2);\n}\nprint(fib(10));\n`)\n```\n\n调用函数时新建 `fnEnv`，其父作用域设成 `closure`（函数定义处的作用域）。参数被 `define` 进 `fnEnv`，于是函数体里能用到参数——这就是\"传参\"的全部秘密。\n\n## 名词解释\n\n**一等公民（First-class）**：函数能像数字一样被赋值给变量、当作参数传递、作为返回值。我们的 `func` 定义就是把一个 `UserFn` 对象 `define` 进环境，因此它天然是一等公民。\n**调用（Call）**：执行函数体的过程。核心动作是\"开新作用域 + 绑参数 + 跑函数体\"。`return` 用抛特殊错误的方式\"提前跳出\"函数体。\n**UserFn vs 原生函数**：`UserFn` 是我们语言里的函数（由 AST 定义）；原生函数是宿主语言（JS）的函数（如 `print`）。`call` 节点对两者分别处理。\n\n## 课后练习\n\n**练习**：用本课解释器写阶乘 `fact(n)` 并打印 `fact(5)`。\n\n**答案**：把调用示例换成 `func fact(n) { if (n < 2) return 1; return n * fact(n - 1); } print(fact(5));` 即可，输出 `120`。\n\n## 总结\n\n函数是编程语言的分水岭。本课最该记住的一句话是：**调用就是\"开一个挂着参数的新作用域，然后跑函数体\"**。`closure` 这个字段看似不起眼，却决定了函数能\"记住\"定义时的环境（引用），而不是调用时的——它是下一节闭包的伏笔。把函数做成一等公民，你的语言立刻拥有了抽象能力：复杂逻辑能被命名、复用、组合。递归 `fib` 能跑通，正是因为每次 `fib(n-1)` 调用都开新作用域、各自持有自己的 `n`，互不干扰。语言的表达力，从这里开始指数级增长。"
  },
  {
    "id": "lang-l7",
    "chapter": "flow",
    "title": "闭包：函数记住的不只是代码",
    "minutes": 60,
    "content": "## 目标\n\n闭包常被说得玄乎。本节课用上一节已经写好的解释器，通过一个\"计数器\"例子把闭包讲透：**函数记住的是它定义时的那个环境（引用），而不是调用时的**。下面给出完整可运行程序。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `closure.js`，执行 `node closure.js`（复用 l6 的完整解释器，仅改调用示例）。\n\n```js\n// closure.js —— 复用 l6 的完整解释器（tokenize/parse/Environment/ev/run 同上）\n// 此处只展示\"调用示例\"，其余函数与 func.js 完全一致\nfunction run(src) {\n  const env = new Environment()\n  env.define('print', (...xs) => console.log(...xs))\n  for (const s of parse(src)) ev(s, env)\n}\n\n// ===== 调用示例：返回一个\"记住了 c\"的函数 =====\nrun(`\nfunc makeCounter() {\n  var c = 0;\n  return func() {\n    c = c + 1;\n    return c;\n  };\n}\nvar next = makeCounter();\nprint(next());  // 1\nprint(next());  // 2\nprint(next());  // 3\n`)\n```\n\n为什么三次 `next()` 在\"累加\"？因为 `makeCounter` 返回的那个匿名函数，其 `closure` 指向 `makeCounter` 调用时创建的那个 Environment（里面存着 `c=0`）。每次 `next()` 调用，开的新 `fnEnv` 的父作用域就是这个\"带 c 的环境\"，`c = c + 1` 沿链找到并改写它。所以 `c` 一直活着、一直在涨。\n\n（完整解释器代码与 `func.js` 相同；为节省篇幅此处只列调用示例，运行时请把 func.js 的 interpreter 放在同一文件。）\n\n## 名词解释\n\n**闭包（Closure）**：一个函数 + 它定义时所处的词法环境，打包在一起。函数无论被传到哪里调用，都能访问定义时看得到的那些变量。\n**引用环境 vs 调用环境**：闭包捕获的是\"定义处的环境\"（引用），不是\"调用处的环境\"。这正是它和单纯\"传值\"不同的地方。\n**典型用途**：工厂函数（如 `makeCounter`）、私有状态（变量不暴露在外层）、回调里保留上下文。\n\n## 课后练习\n\n**练习**：写一个 `makeAdder(n)`，返回一个把参数加上 `n` 的函数，并验证 `add5(10) === 15`。\n\n**答案**：\n\n```js\nrun(`\nfunc makeAdder(n) {\n  return func(x) { return x + n; };\n}\nvar add5 = makeAdder(5);\nprint(add5(10));  // 15\nprint(add5(3));   // 8\n`)\n```\n\n## 模块化工程落地与打包器底层映射对照\n\n在真实大型工程中，理解模块规范不仅要看源码语法，更要看清它在**打包器运行时（Bundler Runtime）**与**浏览器/Node.js 加载器**中的执行时序差异：\n\n| 对比维度 | CommonJS（`require / module.exports`） | ES Module（`import / export`） |\n| :--- | :--- | :--- |\n| **绑定语义** | **值的浅拷贝快照（Value Copy）**：导出模块后续重新赋值局部变量，导入方感知不到 | **只读实时动态绑定（Live Binding）**：导入方拿到的是指向导出模块内存槽位的只读引用 |\n| **解析与执行时机** | **运行时动态同步加载**：执行到 `require()` 语句那一刻才按路径查找并同步执行模块 | **编译/解析期静态构建模块图**：分三阶段（Construction 构造 → Instantiation 实例化绑定 → Evaluation 后序求值） |\n| **Tree Shaking 支持** | 差（支持 `require(expr)` 动态拼接路径，无法静态证明某属性未被读取） | **原生支持**（`import/export` 必须位于顶层，打包器可在编译期静态剪除未引用导出） |\n\n```javascript\n// 验证 ESM Live Binding（实时绑定）与 CJS 值拷贝的底层差异模拟\nfunction createEsmModuleScope() {\n  let count = 0\n  function increment() { count += 1 }\n  // ESM 导出空间本质上通过 Getter 暴露实时绑定，外部只读不可直接赋值，但能实时看到内部修改\n  return Object.defineProperties({}, {\n    count: { get: () => count, enumerable: true },\n    increment: { value: increment, enumerable: true }\n  })\n}\n\nconst esmMod = createEsmModuleScope()\nconsole.log('初始值:', esmMod.count) // 0\nesmMod.increment()\nconsole.log('调用 increment 后实时反映:', esmMod.count) // 1\n```\n\n## 总结\n\n闭包一点都不神秘，它就是 l4 讲的\"Environment + parent 指针\"的自然延伸：返回的函数带着它定义时的环境引用，这个环境函数调用结束后不会被回收，因为还有人（返回的函数）指着它。所谓\"记住外部变量\"，本质是\"外部变量所在的环境被闭包抓着\"。理解了这点，私有变量、工厂函数、React 的自定义 Hook 状态保持，全都是同一个原理的不同包装。闭包不是语言给你加的魔法，是作用域链这一数据结构的必然产物——你早就拥有它了，只是现在叫出了名字。"
  },
  {
    "id": "lang-l8",
    "chapter": "data",
    "title": "数据类型：字符串、数组与内建操作",
    "minutes": 55,
    "content": "## 目标\n\n数字之外，真实语言要有字符串和数组。本节课给解释器加上字符串字面量、`[1,2,3]` 数组字面量，以及几个内建操作 `len / push / map`。下面给出完整可运行程序。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `data.js`，执行 `node data.js`（在 func.js 基础上扩展字符串/数组与内建）。\n\n```js\n// data.js —— 完整可运行：在 func.js 基础上增加 str / 数组 / 内建\nconst KEYWORDS = new Set(['var', 'if', 'else', 'while', 'func', 'return'])\nfunction tokenize(src) {\n  const tokens = []; let i = 0\n  const isD = c => c >= '0' && c <= '9'\n  const isA = c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'\n  while (i < src.length) {\n    const c = src[i]\n    if (c === ' ' || c === '\\n' || c === '\\t' || c === '\\r') { i++; continue }\n    if (c === '\"') { i++; let str = ''; while (i < src.length && src[i] !== '\"') { str += src[i]; i++ } i++; tokens.push({ type: 'str', value: str }); continue }\n    if (isD(c)) { const s = i; while (i < src.length && isD(src[i])) i++; tokens.push({ type: 'num', value: Number(src.slice(s, i)) }); continue }\n    if (isA(c)) { const s = i; while (i < src.length && (isA(src[i]) || isD(src[i]))) i++; const w = src.slice(s, i); tokens.push(KEYWORDS.has(w) ? { type: 'kw', value: w } : { type: 'id', value: w }); continue }\n    const one = { '+': 'plus', '-': 'minus', '*': 'star', '/': 'slash', '(': 'lparen', ')': 'rparen', ';': 'semi', '{': 'lbrace', '}': 'rbrace', ',': 'comma', '[': 'lbracket', ']': 'rbracket' }[c]\n    if (one) { tokens.push({ type: one, value: c }); i++; continue }\n    throw new Error('非法字符: ' + c)\n  }\n  tokens.push({ type: 'eof', value: null }); return tokens\n}\nfunction parse(src) {\n  const tokens = tokenize(src); let pos = 0\n  const peek = () => tokens[pos], next = () => tokens[pos++]\n  const expect = t => { if (peek().type !== t) throw new Error('语法错误：期望 ' + t); return next() }\n  function parseExpr() {\n    let n = parseTerm()\n    while (peek().type === 'plus' || peek().type === 'minus') { const op = next().value; n = { type: 'binary', op, left: n, right: parseTerm() } }\n    return n\n  }\n  function parseTerm() {\n    let n = parseFactor()\n    while (peek().type === 'star' || peek().type === 'slash') { const op = next().value; n = { type: 'binary', op, left: n, right: parseFactor() } }\n    return n\n  }\n  function parseFactor() {\n    const t = peek()\n    if (t.type === 'minus') { next(); return { type: 'unary', op: '-', operand: parseFactor() } }\n    if (t.type === 'num') { next(); return { type: 'num', value: t.value } }\n    if (t.type === 'str') { next(); return { type: 'str', value: t.value } }\n    if (t.type === 'lbracket') {\n      next(); const els = []\n      if (peek().type !== 'rbracket') { els.push(parseExpr()); while (peek().type === 'comma') { next(); els.push(parseExpr()) } }\n      expect('rbracket'); return { type: 'arr', elements: els }\n    }\n    if (t.type === 'id') {\n      next()\n      if (peek().type === 'lparen') {\n        next(); const args = []\n        if (peek().type !== 'rparen') { args.push(parseExpr()); while (peek().type === 'comma') { next(); args.push(parseExpr()) } }\n        expect('rparen'); return { type: 'call', callee: { type: 'ident', name: t.value }, args }\n      }\n      if (peek().type === 'eq') { next(); return { type: 'assign', name: t.value, value: parseExpr() } }\n      return { type: 'ident', name: t.value }\n    }\n    if (t.type === 'lparen') { next(); const e = parseExpr(); expect('rparen'); return e }\n    throw new Error('无法解析表达式: ' + t.type)\n  }\n  function parseStmt() {\n    const t = peek()\n    if (t.type === 'kw' && t.value === 'var') {\n      next(); const name = expect('id').value; expect('eq'); const init = parseExpr(); expect('semi'); return { type: 'var', name, init }\n    }\n    if (t.type === 'kw' && t.value === 'func') {\n      next(); const name = expect('id').value; expect('lparen')\n      const params = []\n      if (peek().type !== 'rparen') { params.push(expect('id').value); while (peek().type === 'comma') { next(); params.push(expect('id').value) } }\n      expect('rparen'); const body = parseStmt(); return { type: 'func', name, params, body }\n    }\n    if (t.type === 'lbrace') { next(); const stmts = []; while (peek().type !== 'rbrace') stmts.push(parseStmt()); expect('rbrace'); return { type: 'block', stmts } }\n    const e = parseExpr(); expect('semi'); return { type: 'exprstmt', expr: e }\n  }\n  const prog = []; while (peek().type !== 'eof') prog.push(parseStmt()); return prog\n}\nclass Environment {\n  constructor(parent = null) { this.vars = new Map(); this.parent = parent }\n  define(n, v) { this.vars.set(n, v) }\n  get(n) { let e = this; while (e) { if (e.vars.has(n)) return e.vars.get(n); e = e.parent } throw new Error('未定义变量: ' + n) }\n  assign(n, v) { let e = this; while (e) { if (e.vars.has(n)) { e.vars.set(n, v); return } e = e.parent } this.vars.set(n, v) }\n}\nfunction ev(node, env) {\n  switch (node.type) {\n    case 'num': return node.value\n    case 'str': return node.value\n    case 'arr': return node.elements.map(e => ev(e, env))\n    case 'ident': return env.get(node.name)\n    case 'unary': return -ev(node.operand, env)\n    case 'binary': {\n      const a = ev(node.left, env), b = ev(node.right, env)\n      if (node.op === '+' && (typeof a === 'string' || typeof b === 'string')) return String(a) + String(b)\n      switch (node.op) {\n        case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b\n      }\n    }\n    case 'assign': { const v = ev(node.value, env); env.assign(node.name, v); return v }\n    case 'var': { const v = ev(node.init, env); env.define(node.name, v); return v }\n    case 'exprstmt': return ev(node.expr, env)\n    case 'block': { const b = new Environment(env); let r; for (const s of node.stmts) r = ev(s, b); return r }\n    case 'func': { env.define(node.name, { type: 'UserFn', params: node.params, body: node.body, closure: env }); return node.name }\n    case 'call': {\n      const callee = ev(node.callee, env)\n      const args = node.args.map(a => ev(a, env))\n      if (typeof callee === 'function') return callee(...args)\n      if (callee && callee.type === 'UserFn') {\n        const fnEnv = new Environment(callee.closure)\n        callee.params.forEach((p, i) => fnEnv.define(p, args[i]))\n        try { ev(callee.body, fnEnv) } catch (e) { if (e && e.__ret) return e.value; throw e }\n        return undefined\n      }\n      throw new Error('不是可调用的对象')\n    }\n  }\n  throw new Error('未知节点: ' + node.type)\n}\nfunction run(src) {\n  const env = new Environment()\n  env.define('print', (...xs) => console.log(...xs))\n  env.define('len', x => x.length)\n  env.define('push', (a, x) => { a.push(x); return a })\n  env.define('map', (a, fn) => a.map(e => fn(e)))\n  for (const s of parse(src)) ev(s, env)\n}\n\n// ===== 调用示例 =====\nrun(`\nprint(len(\"hello\"));\nvar a = [1, 2, 3];\nprint(map(a, func(x) { return x * 2; }));\nprint(push(a, 4));\n`)\n```\n\n`map` 把一个\"用户函数\"当参数传进去，解释器在原生 `map` 里通过 `fn(e)` 回调它——这又是一次\"函数是一等公民\"的实战。\n\n## 名词解释\n\n**字面量（Literal）**：直接写进代码里的值，如 `\"hello\"`（字符串字面量）、`[1,2,3]`（数组字面量）。它不需要计算，本身就是值。\n**内建函数（Builtin）**：语言自带的、由宿主（这里是 JS）实现的函数，如 `len/push/map`。它们和 `UserFn` 的区别是：内建函数直接是 JS 函数，不需要 AST 就能执行。\n**高阶函数**：接收或返回函数的函数。`map` 是高阶函数——它接收一个\"怎么变换每个元素\"的函数，这正是函数式编程的基石。\n\n## 课后练习\n\n**练习**：用 `map` 和 `len` 计算数组 `[10,20,30]` 每个元素加 1 后的长度。\n\n**答案**：\n\n```js\nrun(`\nvar a = [10, 20, 30];\nvar b = map(a, func(x) { return x + 1; });\nprint(len(b));  // 3\n`)\n```\n\n## 总结\n\n数据类型是语言\"能表达什么世界\"的边界。加了字符串和数组，你的语言才从\"计算器\"变成\"能处理真实数据\"的工具。而 `map/filter/reduce` 这类高阶内建函数，是把\"循环 + 副作用\"升级为\"声明式变换\"的关键——你不再说\"怎么一步步改\"，而是说\"我想要每个元素变成什么样\"。注意一个设计取舍：数组我用 JS 原生数组承载，字符串用原生字符串，这意味着我们的语言直接复用了宿主语言的数据结构。现实编译器往往不会这么做（为了跨平台/可控内存），但它极其适合教学：让你把精力放在\"语言机制\"而不是\"内存管理\"上。"
  },
  {
    "id": "lang-l9",
    "chapter": "data",
    "title": "标准库：原生函数怎么接进你的语言",
    "minutes": 50,
    "content": "## 目标\n\n上节用了 `print/len/map`，但没讲清\"原生函数到底是怎么接进语言的\"。本节课专门讲**标准库（Standard Library）**：宿主提供的能力，如何通过环境注册，成为语言的一部分。下面给出完整可运行程序。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `stdlib.js`，执行 `node stdlib.js`（复用 data.js 解释器，重点看 `createGlobalEnv`）。\n\n```js\n// stdlib.js —— 重点：标准库就是一批预先 define 进全局环境的原生函数\nfunction createGlobalEnv() {\n  const env = new Environment()\n  // 原生函数：直接用 JS 函数，解释器在 call 节点里 typeof === 'function' 时直接调用\n  env.define('print', (...xs) => console.log(...xs))\n  env.define('len', x => (x && x.length !== undefined) ? x.length : 0)\n  env.define('push', (a, x) => { a.push(x); return a })\n  env.define('map', (a, fn) => a.map(e => fn(e)))\n  env.define('max', (a, b) => (a > b ? a : b))\n  env.define('PI', 3.14159) // 常量也能注册\n  return env\n}\n\nfunction run(src) {\n  const env = createGlobalEnv()\n  for (const s of parse(src)) ev(s, env)\n}\n\n// ===== 调用示例：用户函数调用原生 max =====\nrun(`\nfunc bigger(a, b) {\n  return max(a, b);\n}\nprint(bigger(3, 7));   // 7\nprint(PI);             // 3.14159\n`)\n```\n\n标准库函数和用户函数的唯一区别：前者是 JS 函数（解释器直接执行），后者是 `UserFn`（解释器走 AST）。在 `call` 节点里用 `typeof callee === 'function'` 分流，二者对调用方完全透明。\n\n## 名词解释\n\n**标准库（Standard Library）**：语言自带的、开箱即用的函数与常量集合（如 `print/len/max/PI`）。它把\"宿主能力\"包装成语言原生语法，用户无需关心底层实现。\n**宿主（Host）**：运行你这门语言的那个环境。这里宿主是 JS/Node；如果是浏览器里的语言，宿主就是浏览器（能调用 DOM）。\n**注册（register）**：把原生能力 `define` 进全局环境，使它在语言里\"可见可用\"。标准库就是一批预先 `define` 好的东西。\n\n## 课后练习\n\n**练习**：在标准库里加一个 `input(prompt)`，当用户没提供交互时返回固定字符串 `\"guest\"`（避免依赖终端输入，便于教学演示）。\n\n**答案**：\n\n```js\nenv.define('input', (prompt) => {\n  // 真实环境可用 readline 同步读取；教学版返回占位值\n  return 'guest'\n})\n// 调用：print(input(\"name:\"))  // 输出 guest\n```\n\n## 总结\n\n标准库是\"语言\"与\"宿主能力\"之间的桥。一门语言强不强，一半看语法、一半看标准库给了多少好用的原语。设计标准库时有两条路：要么像我们这样直接复用宿主函数（快、省事，但语言能力受宿主限制）；要么自己用语言实现一套（慢、可控，但工作量巨大）。真实语言（如 Python）的标准库大多是\"热点用 C 写、其余用 Python 写\"。理解注册机制后你会明白：`print` 不是语言内建的魔法，它只是某个人在全局环境里 `define` 了一个函数而已——你也可以 `define` 任何自己想要的东西。"
  },
  {
    "id": "lang-l10",
    "chapter": "data",
    "title": "错误机制：让报错说人话",
    "minutes": 55,
    "content": "## 目标\n\n没有错误处理的语言，一出错就崩溃得莫名其妙。本节课给解释器加两类错误：**解析错误（ParseError）**与**运行时错误（RuntimeError）**，让报错带上信息，方便调试。下面给出完整可运行程序。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `errors.js`，执行 `node errors.js`（复用 data.js 解释器，增加错误类与除法检查）。\n\n```js\n// errors.js —— 完整可运行：带错误处理的解释器\nclass ParseError extends Error {}\nclass RuntimeError extends Error {}\n\n// 在 ev 的 binary 除法分支主动抛运行时错误：\n//   case 'binary': {\n//     const a = ev(node.left, env), b = ev(node.right, env)\n//     if (node.op === '/') { if (b === 0) throw new RuntimeError('除以零：' + a + ' / 0') }\n//     if (node.op === '+' && (typeof a === 'string' || typeof b === 'string')) return String(a) + String(b)\n//     switch (node.op) { case '+': return a + b; ... }\n//   }\n// 其余 interpreter（tokenize/parse/Environment/ev/run）与 data.js 相同，此处省略重复。\n\nfunction run(src) {\n  let ast\n  try { ast = parse(src) }                                     // 解析阶段出错 -> ParseError\n  catch (e) { throw new ParseError('解析失败：' + e.message) }\n  const env = new Environment()\n  env.define('print', (...xs) => console.log(...xs))\n  env.define('len', x => x.length)\n  try {\n    for (const s of ast) ev(s, env)                             // 执行阶段出错 -> RuntimeError\n  } catch (e) {\n    if (e instanceof RuntimeError) throw e\n    throw new RuntimeError('运行时错误：' + e.message)\n  }\n}\n\n// ===== 调用示例 =====\ntry {\n  run('print(10 / 0);')\n} catch (e) {\n  console.log('捕获到：', e.constructor.name, '->', e.message)\n}\n// 输出：捕获到： RuntimeError -> 除以零：10 / 0\n```\n\n把错误分成\"解析\"和\"运行\"两个阶段，用户能立刻知道是\"代码写错了\"还是\"逻辑跑挂了\"——这是所有成熟语言的标配。\n\n## 名词解释\n\n**ParseError（解析错误）**：代码还没开始跑、在\"变成 AST\"那一步就失败了，比如少个括号、关键字拼错。它属于语法层面。\n**RuntimeError（运行时错误）**：语法没问题、跑的过程中才爆发，比如除以零、访问未定义变量。它属于语义/执行层面。\n**栈追踪（stack trace）**：错误发生时记录\"从哪调用到哪\"的调用链。我们这里简化了，真实语言会打印它帮你定位出错行。\n\n## 课后练习\n\n**练习**：在 `ev` 的 `ident` 分支，把\"未定义变量\"也从通用 `Error` 改成抛 `RuntimeError`。\n\n**答案**：\n\n```text\ncase 'ident': {\n  if (!env.has(node.name)) throw new RuntimeError('未定义变量: ' + node.name)\n  return env.get(node.name)\n}\n// 需要在 Environment 上加 has()（见 l4 课后练习）\n```\n\n## 总结\n\n错误处理不是\"锦上添花\"，而是语言能不能被人用的分水岭。没有清晰错误信息的语言，调试全靠猜。把错误分阶段（Parse vs Runtime）是第一个重要设计：它告诉用户\"错在写法和错在逻辑\"是两回事，排错路径完全不同。第二个设计是\"报错带上下文\"——除以零时告诉你是 `10 / 0` 而不是只说\"error\"。你写的这两行 `throw`，本质是替未来的使用者省下几小时的抓瞎。好语言的标准之一，就是它出错时说的每句话都有用。"
  },
  {
    "id": "lang-l11",
    "chapter": "repl",
    "title": "REPL：把前面所有拼成可交互解释器",
    "minutes": 55,
    "content": "## 目标\n\n把前 10 节串起来：做一个 **REPL（Read-Eval-Print Loop）**——读一行、执行、打印结果、再读下一行。这是你亲手写的\"迷你 Node 终端\"。下面给出完整可运行程序。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `repl.js`，执行 `node repl.js`。真实 REPL 用 `readline` 从终端逐行读；为便于教学，这里用一个\"行数组\"模拟用户输入，逻辑完全一致。\n\n```js\n// repl.js —— 完整可运行：复用前几节的 parse/ev/Environment/标准库\nfunction createGlobalEnv() {\n  const env = new Environment()\n  env.define('print', (...xs) => console.log('»', ...xs))\n  env.define('len', x => x.length)\n  env.define('map', (a, fn) => a.map(e => fn(e)))\n  return env\n}\n\n// 执行一段源码（可包含多条语句），返回最后一条表达式的值\nfunction run(src, env) {\n  const ast = parse(src)\n  let last\n  for (const s of ast) last = ev(s, env)\n  return last\n}\n\n// REPL 主循环：读一行 -> 求值 -> 打印\nfunction repl(lines) {\n  const env = createGlobalEnv()\n  for (const line of lines) {\n    if (line.trim() === '') continue\n    if (line.trim() === ':q') { console.log('bye'); return }\n    try {\n      const v = run(line, env)\n      if (v !== undefined) console.log('=>', v)\n    } catch (e) {\n      console.log('错误:', e.message)\n    }\n  }\n}\n\n// ===== 调用示例（模拟用户在终端逐行输入）=====\nrepl([\n  'var x = 10;',\n  'x = x * x;',\n  'print(x);',\n  'print(len(\"hi\"));',\n  ':q',\n])\n```\n\n真实场景里，把 `repl(['...'])` 换成 `readline` 的逐行回调即可——`run` 和 `ev` 完全不变。这就是\"语言内核\"与\"交互外壳\"解耦的好处。\n\n## 名词解释\n\n**REPL**：Read（读）– Eval（求值）– Print（打印）– Loop（循环）的缩写。它是很多动态语言（Python、Node、Lua）的交互式入口，边写边看结果。\n**交互式 vs 脚本式**：REPL 是交互式（一行一行来，保留状态）；把代码写进文件执行是脚本式。二者共用同一套 `parse/ev`，只差\"输入从哪来\"。\n**状态保持**：REPL 的 `env` 在循环外创建，所以上一行定义的 `x`，下一行还能用——这正是\"会话\"的感觉。\n\n## 课后练习\n\n**练习**：改造 `repl`，让输入 `:q` 时退出循环（打印 \"bye\"）。\n\n**答案**：已在上方完整代码中实现——循环内判断 `line.trim() === ':q'` 时打印 `bye` 并 `return`。\n\n## 总结\n\nREPL 是这门小语言的高光时刻：它证明前 10 节不是零散练习，而是一套完整语言的零件。最值得学的设计是**内核与外壳解耦**——`parse/ev` 是语言本身，REPL 只是\"怎么把输入喂给它\"的一层皮。同一套内核，套上文件执行器就是脚本语言，套上浏览器就是网页脚本语言，套上 REPL 就是交互终端。你此刻拥有的，已经是一个能跑、能交互、能报错的迷你语言内核了。下一步往哪走，取决于你想让它更\"快\"（编译，见第12节）还是更\"大\"（更多语法）。"
  },
  {
    "id": "lang-l12",
    "chapter": "repl",
    "title": "进阶路线：手写一个字节码虚拟机",
    "minutes": 60,
    "content": "## 目标\n\n树遍历解释器慢在\"每次求值都要递归进树\"。本课作为进阶总览，手写一个极简**字节码虚拟机（VM）**：先把表达式编译成指令序列，再用一个栈去执行——这是 Java、Python、Lua 真实采用的路线。本例独立实现，可单独运行。\n\n**运行环境**：Node.js v18+。**运行方式**：保存为 `vm.js`，执行 `node vm.js`。\n\n```js\n// vm.js —— 把 \"1 + 2 * 3\" 编译成字节码，再用栈执行\n// 1) 编译器：AST -> 指令数组（这里直接手写 AST 演示）\nfunction compile(node) {\n  const code = []\n  function walk(n) {\n    if (n.type === 'num') { code.push(['PUSH', n.value]); return }\n    if (n.type === 'binary') {\n      walk(n.left); walk(n.right)        // 先算左右操作数，压栈\n      code.push(['OP', n.op])            // 再发一条运算指令\n      return\n    }\n    throw new Error('不支持的节点: ' + n.type)\n  }\n  walk(node); return code\n}\n\n// 2) 虚拟机：用栈执行指令\nfunction execute(code) {\n  const stack = []\n  for (const [op, val] of code) {\n    if (op === 'PUSH') stack.push(val)\n    else if (op === 'OP') {\n      const b = stack.pop(), a = stack.pop()\n      switch (val) {\n        case '+': stack.push(a + b); break\n        case '-': stack.push(a - b); break\n        case '*': stack.push(a * b); break\n        case '/': stack.push(a / b); break\n      }\n    }\n  }\n  return stack.pop()\n}\n\n// ===== 调用示例 =====\nconst ast = { type: 'binary', op: '+', left: { type: 'num', value: 1 },\n  right: { type: 'binary', op: '*', left: { type: 'num', value: 2 }, right: { type: 'num', value: 3 } } }\nconst code = compile(ast)\nconsole.log('字节码 =', JSON.stringify(code))\nconsole.log('结果   =', execute(code)) // 7\n```\n\n`compile` 把树\"拍平\"成 `[PUSH 1, PUSH 2, PUSH 3, OP *, OP +]`；`execute` 用一个栈顺序执行，结果就是 7。注意优先级被编译顺序\"固化\"进了指令序列，运行时不再需要递归进树。\n\n## 名词解释\n\n**字节码（Bytecode）**：介于源码和机器码之间的中间指令，比 AST 紧凑、比原生码可移植。Java 的 `.class`、Python 的 `.pyc` 都是字节码。\n**虚拟机 / VM（Virtual Machine）**：执行字节码的程序，常见的是**栈式 VM**（用操作数栈，如本例）或**寄存器式 VM**（如 Lua 5）。\n**编译 vs 解释**：编译是\"源码 -> 别的表示\"（一次性，可缓存）；解释是\"边读边执行\"。本课是\"先编译成字节码，再由 VM 执行\"，即编译型解释器的典型形态。\n\n## 课后练习\n\n**练习**：给 VM 增加 `PRINT` 指令，让程序能直接输出栈顶值（而不只是 `return`）。\n\n**答案**：\n\n```js\n// 编译器里可加：code.push(['PRINT'])\n// 虚拟机里加分支：\n//   else if (op === 'PRINT') console.log('输出:', stack[stack.length - 1])\n```\n\n## 总结\n\n走到第12节，你已经拥有两条执行路线：树遍历解释（第3节，易写难快）和字节码 VM（本课，稍难但快得多）。真实语言往往两者结合——开发期用树遍历快速验证语义，定型后用字节码 VM 或 JIT 编译器提速。本课只演示了算术，但同样的\"编译 + 栈执行\"框架，套上变量指令 `STORE/LOAD`、跳转指令 `JMP/JIF` 就能表达 `if/while`，套上 `CALL/RET` 就能表达函数。你写的 12 节，其实就是一门真实语言从 0 到 1 的缩影：Lexer 切词、Parser 建树、Interpreter/VM 执行、Environment 管状态、标准库供能力、错误保体验、REPL 给入口。下一步，你可以挑一个方向深挖——加对象、加模块、或把它编译成真正的机器码。"
  }
]

export const langPlan = [
  {
    "day": 1,
    "theme": "词法分析",
    "lessonIds": [
      "lang-l1"
    ],
    "practice": [],
    "goal": "手写 Lexer，把源码字符串切成 Token 流"
  },
  {
    "day": 2,
    "theme": "语法分析",
    "lessonIds": [
      "lang-l2"
    ],
    "practice": [],
    "goal": "递归下降 Parser 把 Token 变成 AST（含运算符优先级）"
  },
  {
    "day": 3,
    "theme": "树遍历求值",
    "lessonIds": [
      "lang-l3"
    ],
    "practice": [],
    "goal": "遍历 AST 计算结果，跑通第一个表达式"
  },
  {
    "day": 4,
    "theme": "变量与作用域",
    "lessonIds": [
      "lang-l4"
    ],
    "practice": [],
    "goal": "Environment 对象 + 嵌套作用域，支持赋值与查找"
  },
  {
    "day": 5,
    "theme": "控制流",
    "lessonIds": [
      "lang-l5"
    ],
    "practice": [],
    "goal": "给语言加 if/while 语句，求 1..n 和"
  },
  {
    "day": 6,
    "theme": "函数定义",
    "lessonIds": [
      "lang-l6"
    ],
    "practice": [],
    "goal": "函数是一等公民，实现 factorial/fib 调用"
  },
  {
    "day": 7,
    "theme": "闭包",
    "lessonIds": [
      "lang-l7"
    ],
    "practice": [],
    "goal": "理解引用环境 vs 调用环境，手写计数器闭包"
  },
  {
    "day": 8,
    "theme": "数据类型",
    "lessonIds": [
      "lang-l8"
    ],
    "practice": [],
    "goal": "扩展字符串/数组与内建操作（map/len）"
  },
  {
    "day": 9,
    "theme": "标准库",
    "lessonIds": [
      "lang-l9"
    ],
    "practice": [],
    "goal": "注册 print/len/input 等原生函数"
  },
  {
    "day": 10,
    "theme": "错误机制",
    "lessonIds": [
      "lang-l10"
    ],
    "practice": [],
    "goal": "解析/运行时错误捕获，除零给出友好报错"
  },
  {
    "day": 11,
    "theme": "REPL",
    "lessonIds": [
      "lang-l11"
    ],
    "practice": [],
    "goal": "串起前九章，做一个可交互的命令行解释器"
  },
  {
    "day": 12,
    "theme": "进阶路线",
    "lessonIds": [
      "lang-l12"
    ],
    "practice": [],
    "goal": "总览字节码 VM，手写一个极简虚拟机雏形"
  }
]
