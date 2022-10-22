import Head from 'next/head'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import * as ga from '@/utils/ga'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import { NextSeo, ArticleJsonLd } from 'next-seo'

import 'focus-visible'
import '@/styles/tailwind.css'

function getNodeText(node) {
  let text = ''
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

function collectHeadings(nodes, slugify = slugifyWithCounter()) {
  let sections = []

  for (let node of nodes) {
    if (node.name === 'h2' || node.name === 'h3') {
      let title = getNodeText(node)
      if (title) {
        let id = slugify(title)
        node.attributes.id = id
        if (node.name === 'h3') {
          if (!sections[sections.length - 1]) {
            throw new Error(
              'Cannot add `h3` to table of contents without a preceding `h2`'
            )
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          })
        } else {
          sections.push({ ...node.attributes, title, children: [] })
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  let title = pageProps.markdoc?.frontmatter.title

  let pageTitle =
    pageProps.markdoc?.frontmatter.pageTitle ||
    `${pageProps.markdoc?.frontmatter.title} | How to Code`

  let description = pageProps.markdoc?.frontmatter.description
  let date = pageProps.markdoc?.frontmatter.date
  let heroImage =
    pageProps.markdoc?.frontmatter.hero ||
    'https://howtocode.io/images/logo/HowToCode_OpenGraph_1200_630.png'

  let tableOfContents = pageProps.markdoc?.content
    ? collectHeadings(pageProps.markdoc.content)
    : []

  return (
    <>
      <NextSeo
        title={pageTitle}
        description={description}
        canonical="https://www.howtocode.io"
        openGraph={{
          url: `https://howtocode.io${router.route}`,
          title: { pageTitle },
          description: { description },
          images: [{ url: `https://howtocode.io${heroImage}` }],
          site_name: 'How to Code',
        }}
        twitter={{
          handle: '@howtocode_io',
          site: '@howtocode_io',
          cardType: 'summary_large_image',
        }}
      />
      <Layout title={title} tableOfContents={tableOfContents}>
        <Component {...pageProps} />
      </Layout>
      <ArticleJsonLd
        type="Blog"
        url={`https://howtocode.io${router.route}`}
        title={pageTitle}
        images={`https://howtocode.io${heroImage}`}
        datePublished={date}
        dateModified={date}
        authorName="Robert Guss"
        description={description}
      />
    </>
  )
}
