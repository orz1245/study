// Schema.org 结构化数据（JSON-LD）构造器
import { SITE_ORIGIN as SITE, SITE_NAME } from '../utils/seo.js'

export function jsonLdSafe(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function breadcrumbJsonLd(items) {
  return jsonLdSafe({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: SITE + it.url } : {}),
    })),
  })
}

export function articleJsonLd({ title, canonical, section, dateModified }) {
  return jsonLdSafe({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    articleSection: section || SITE_NAME,
    mainEntityOfPage: canonical,
    ...(dateModified ? { dateModified } : {}),
  })
}

export function courseJsonLd({ title, description, canonical, totalLessons }) {
  return jsonLdSafe({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    url: canonical,
    inLanguage: 'zh-CN',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      sameAs: SITE + '/',
    },
    ...(totalLessons ? { numberOfCredits: totalLessons } : {}),
  })
}

export function qaJsonLd({ question, answerText, canonical, category, dateModified }) {
  return jsonLdSafe({
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question,
      text: question,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answerText,
        ...(dateModified ? { dateModified } : {}),
      },
      ...(category ? { keywords: category } : {}),
    },
    url: canonical,
  })
}

export function webSiteJsonLd({ description }) {
  return jsonLdSafe({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Frontend Learning',
    description,
    url: SITE + '/',
    inLanguage: 'zh-CN',
    publisher: { '@type': 'Organization', name: SITE_NAME },
  })
}

export function itemListJsonLd({ name, items }) {
  return jsonLdSafe({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: SITE + it.url,
    })),
  })
}
