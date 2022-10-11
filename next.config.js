const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md'],
  swcMinify: true,
  experimental: {
    newNextLinkBehavior: true,
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: '/books',
        destination: '/posts/free-books',
        permanent: true,
      },
      {
        source: '/courses',
        destination: '/posts/free-courses',
        permanent: true,
      },
      {
        source: '/tutorials',
        destination: '/',
        permanent: true,
      },
      {
        source: '/newsletter',
        destination: 'https://www.getrevue.co/profile/howtocode_io',
        permanent: true,
      },
      {
        source: '/podcast',
        destination: 'https://anchor.fm/how-to-code',
        permanent: true,
      },
      {
        source: '/posts',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = withMarkdoc()(nextConfig)
