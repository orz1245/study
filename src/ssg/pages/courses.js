// 课程模块页面生成：课程总览页（/course/）、课程封面页（/course/<slug>/）与课时页（/course/<slug>/l<N>/）
import { courses } from '../../data/courses.js'
import { renderMarkdown } from '../../utils/markdown.js'
import { courseUrl, lessonUrl } from '../../utils/urls.js'
import { flatLessons } from '../../utils/course-structure.js'
import {
  SITE_ORIGIN as SITE,
  courseIndexSeo,
  courseSeo,
  lessonSeo,
  robotsOf,
  canonicalFor,
} from '../../utils/seo.js'
import { esc, firstSentence, lessonGap, styleExercise } from '../html.js'
import { breadcrumbJsonLd, articleJsonLd, courseJsonLd, itemListJsonLd } from '../jsonld.js'
import { categoryUrl } from '../../utils/urls.js'
import { categories } from '../../data/index.js'
import { crumbHtml, footNavHtml, playgroundHtml, PAGE_SCRIPTS } from '../layout.js'

export function buildCoursePages({ writePage, pageShell, getCourseLastmod, latestCourseLastmod }) {
  const sitemapEntries = []
  const redirectLines = []
  let fileCount = 0

  for (const course of courses) {
    const meta = course.meta
    const key = course.id
    const landHref = courseUrl(key)
    const landUrl = SITE + landHref
    const lastmod = getCourseLastmod(course)

    // 旧 URL 301：landing + 全部课时（旧课时 id → 新 l<N>）；slug 未变的课程跳过（防自环）
    if (`/course/${key}` !== landHref.replace(/\/$/, '')) {
      redirectLines.push(`/course/${key} ${landHref} 301`)
      redirectLines.push(`/course/${key}/ ${landHref} 301`)
    }

    const ordered = flatLessons(course)

    // —— 课程封面页 ——
    const landSeo = courseSeo(course)
    const matchedCat = categories.find((c) => c.key === meta.practiceCategory)
    const practiceLink = matchedCat
      ? `<p class="page-sub" style="margin-top:-6px"><a href="${categoryUrl(matchedCat.key)}" style="color:var(--accent);text-decoration:none;font-weight:500">配套题库：前往巩固 ${esc(matchedCat.name)} 高频面试真题 &rarr;</a></p>\n`
      : ''
    const planHtml = Array.isArray(course.plan) && course.plan.length
      ? `<section class="sec-gap"><h2 class="sec-title">阶段学习计划（${course.plan.length} 步）</h2><ol class="ex-ol">${course.plan.map(p => `<li><strong>Day ${esc(String(p.day || ''))} · ${esc(p.title || '')}</strong>：${esc(p.goal || p.tasks || '')}</li>`).join('')}</ol></section>\n`
      : ''
    const landBody = `<h1 class="page">${esc(meta.title)}<span class="n">（${ordered.length} 节课）</span></h1>
<p class="page-sub">${esc(meta.subtitle || '')}</p>
${practiceLink}
<div class="lesson-list">
${(meta.chapters || [])
      .map((ch) => {
        const rows = ch.lessons
          .map((lid) => {
            const idx = ordered.findIndex((x) => x.id === lid)
            const l = ordered[idx]
            return l ? `<a href="${lessonUrl(key, idx)}"><span class="t">${esc(l.title)}</span></a>` : ''
          })
          .join('')
        return `<div class="chap">${esc(ch.name)}<span class="n">${ch.lessons.length} 节</span></div>${rows}`
      })
      .join('\n')}
</div>
${planHtml}${playgroundHtml({ refLabel: '当前课程', refText: meta.title })}`

    const landHtml = pageShell({
      ...landSeo,
      canonical: landUrl,
      robots: robotsOf(landSeo),
      jsonLd: [
        courseJsonLd({
          title: meta.title,
          description: landSeo.description,
          canonical: landUrl,
          totalLessons: ordered.length,
        }),
        articleJsonLd({ title: meta.title, canonical: landUrl, section: '课程', dateModified: lastmod }),
        breadcrumbJsonLd([{ name: '首页', url: '/' }, { name: '课程', url: '/course/' }, { name: meta.title }]),
      ],
      breadcrumbHtml: crumbHtml([{ name: '首页', url: '/' }, { name: '课程', url: '/course/' }, { name: meta.title }]),
      bodyHtml: landBody,
      active: 'course',
      playground: true,
      scripts: PAGE_SCRIPTS,
    })
    writePage(landHref.replace(/^\//, ''), landHtml)
    fileCount++
    sitemapEntries.push({ loc: landHref, lastmod })

    // —— 课时页 ——
    ordered.forEach((lesson, idx) => {
      const href = lessonUrl(key, idx)
      const url = SITE + href
      redirectLines.push(`/course/${key}/${lesson.id} ${href} 301`)
      redirectLines.push(`/course/${key}/${lesson.id}/ ${href} 301`)
      const prev = idx > 0 ? { href: lessonUrl(key, idx - 1), title: ordered[idx - 1].title } : null
      const next = idx < ordered.length - 1 ? { href: lessonUrl(key, idx + 1), title: ordered[idx + 1].title } : null
      const lessonMeta = lessonSeo(course, idx)
      const html = pageShell({
        ...lessonMeta,
        canonical: url,
        robots: robotsOf(lessonMeta),
        jsonLd: [
          articleJsonLd({ title: lesson.title, canonical: url, section: lesson.chapterName, dateModified: lastmod }),
          breadcrumbJsonLd([
            { name: '首页', url: '/' },
            { name: '课程', url: '/course/' },
            { name: meta.title, url: landHref },
            { name: lesson.title },
          ]),
        ],
        breadcrumbHtml: crumbHtml([
          { name: '首页', url: '/' },
          { name: '课程', url: '/course/' },
          { name: meta.title, url: landHref },
        ]),
        bodyHtml:
          `<h1 class="page">${esc(lesson.title)}</h1>` +
          lessonGap(styleExercise(renderMarkdown(lesson.content))) +
          footNavHtml({ prev, next, up: '上一节', down: '下一节' }) +
          playgroundHtml({ refLabel: '当前课时', refText: lesson.title }),
        active: 'course',
        playground: true,
        scripts: PAGE_SCRIPTS,
      })
      writePage(href.replace(/^\//, ''), html)
      fileCount++
      sitemapEntries.push({ loc: href, lastmod })
    })
  }

  // —— 课程总览页 /course/ ——
  const courseIndexBody = `<h1 class="page">系统课程</h1>
<p class="page-sub">每门课按章节组织，课时内含可运行代码、名词解释与课后练习。</p>
<div class="card-grid">
${courses
    .map((c) => {
      const n = (c.lessons || []).length
      const ch = (c.meta.chapters || []).length
      const sub = firstSentence(c.meta.subtitle)
      return `<a href="${courseUrl(c.id)}"><h3>${esc(c.meta.title)}</h3><p>${esc(sub)}</p><div class="f">${ch} 章 · ${n} 节课</div></a>`
    })
    .join('\n')}
</div>`
  const courseIdxSeo = courseIndexSeo()
  writePage('course', pageShell({
    ...courseIdxSeo,
    canonical: canonicalFor('/course/'),
    robots: robotsOf(courseIdxSeo),
    jsonLd: [
      breadcrumbJsonLd([{ name: '首页', url: '/' }, { name: '课程' }]),
      articleJsonLd({ title: '系统课程', canonical: SITE + '/course/', section: '课程', dateModified: latestCourseLastmod }),
      itemListJsonLd({ name: '前端系统课程列表', items: courses.map((c) => ({ name: c.meta.title, url: courseUrl(c.id) })) }),
    ],
    bodyHtml: courseIndexBody,
    active: 'course',
  }))
  fileCount++
  sitemapEntries.push({ loc: '/course/', lastmod: latestCourseLastmod })

  return { fileCount, sitemapEntries, redirectLines }
}
