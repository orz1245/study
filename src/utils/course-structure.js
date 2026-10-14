// 课程内部结构的唯一换算口径。
//
// 课时 URL 形如 /course/<slug>/l<N>/，其中 N 是「按 chapters 顺序展平后的位次」，
// 而不是 course.lessons 数组下标 —— 两者顺序并不一致（lessons 可能按生成顺序排，
// chapters 才是教学顺序）。任何需要「位次 ↔ 课时对象」互转的地方都必须走这里，
// 否则 SSG 写出的静态页、路由解析、head 三者会各算一套，出现 l3 页面标题是第 5 课这种错位。

export function flatLessons(course) {
  const out = []
  for (const ch of course.meta?.chapters || []) {
    for (const lessonId of ch.lessons || []) {
      const lesson = (course.lessons || []).find((l) => l.id === lessonId)
      if (lesson) out.push({ ...lesson, chapterName: ch.name })
    }
  }
  // chapters 未覆盖到的课时（数据缺失时的兜底），保持稳定性：按原数组顺序补在后面
  for (const lesson of course.lessons || []) {
    if (!out.some((l) => l.id === lesson.id)) out.push({ ...lesson, chapterName: '' })
  }
  return out
}

export function flatLessonCount(course) {
  return flatLessons(course).length
}

// 首页「开始」按钮指向的入门课：显式按 id 指定。
// 此前写的是 courses[3] —— 现在恰好是 browser，但课程注册表顺序一变就会指到别的课，
// 而且不会报错、也没人会察觉。这里做成「按 id 找 + 找不到退回首门课」的确定性规则。
export const START_COURSE_ID = 'browser'

export function startCourse(list = []) {
  return list.find((c) => c.id === START_COURSE_ID) || list[0] || null
}
