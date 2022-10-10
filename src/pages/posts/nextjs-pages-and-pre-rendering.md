---
title: "Next.js - 2. Pages and pre-rendering"
date: "2022-10-03"
slug: "nextjs-pages-and-pre-rendering"
description: "In this article, I discuss how pages work in Next.js. I also discuss the two different types of pre-rendering and how to fetch data within pages."
hero: "/images/hero/nextjs-cover-dark.png"
tags: ["nextjs"]
---

This article will teach you how pages and pre-rendering work in Next.js.

## Pages

A page in Next.js is a React component placed inside of the `/pages` directory. To understand how this works, within the app you created in the [previous article](/posts/nextjs-install-and-overview), create a file called `posts.js` inside the `pages/directory`.

![posts-file.png](/images/nextjs/nextjs-pages-and-pre-rendering/posts-file.webp)

Inside this file, add the following:

```jsx
function Posts() {
  return <h1>Posts</h1>
}

export default Posts
```

Start up the local dev server with:

```bash
npm run dev
```

Then open [`http://localhost:3000/posts`](http://localhost:3000/posts) in your browser.

You should see the following:

![posts-page.png](/images/nextjs/nextjs-pages-and-pre-rendering/posts-page.webp)

That’s how easy it is to create pages in Next.js. All you have to do is export a React component from the `/pages` directory!

## Dynamic routes

Our posts page is perfectly fine, but what happens when we want to render pages dynamically? For example, if we were building a blog with Next.js, how would we dynamically generate a page for each blog post?

This is where [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes) come in.

You can create pages that support dynamic routes by using a special bracket syntax in the filename of your page. For example, `pages/posts/[id].js`. This special syntax, `[id]` , allows users to access posts with the following URLs.

- `posts/1`
- `posts/2`
- `posts/3`
- etc.

:::info
You can use whatever name you like within the brackets. I am using “id” in this example, but you can use anything you want.
:::

You will see a working example of dynamic routes shortly.

## Pre-rendering

Next.js handles two types of pre-rendering, static generation and Server-side rendering or SSR.

- Static generation - means that the HTML is generated at build time. Think of this as being similar to what a static site generator does.
- SSR - means that the HTML is generated upon each request.

What makes Next.js unique and incredibly powerful is that you can choose the type of pre-rendering you would like to use **per page**! This means you can have some pages that are statically generated and others that are SSR.

The creators of Next.js recommend static whenever possible because static pages load faster and are better for SEO. If you have highly dynamic pages that change on each request, SSR is the better choice.

The beauty here is that you can pick and choose which rendering method you want on a per-page level which means a _better experience for your users_.

## Dynamic routes in action

Dynamic routes can be tricky to wrap your head around, so let’s see an example. We will create a simple blog by fetching some dummy post data from [JSON Placeholder](https://jsonplaceholder.typicode.com/).

First, create a new folder inside of the `/pages` directory called `posts`

![posts directory.png](/images/nextjs/nextjs-pages-and-pre-rendering/posts_directory.webp)

Next, move the `posts.js` file inside the `pages/posts` directory and rename it to `index.js`.

![posts-index.png](/images/nextjs/nextjs-pages-and-pre-rendering/posts-index.webp)

Everything should be working the same, so when you go to [http://localhost:3000/posts](http://localhost:3000/posts), you should see the following still:

![posts-page.png](/images/nextjs/nextjs-pages-and-pre-rendering/posts-page.webp)

Next, create a file called `[id].js` inside of the `pages/posts` directory.

![id-page.png](/images/nextjs/nextjs-pages-and-pre-rendering/id-page.webp)

## Static generation and data

We want to dynamically create our pages based on the id of each post. To do this, we are going to use two functions provided to us by Next.js called `getStaticPaths()` and `getStaticProps()`.

I will show you the code first, and then we will break down everything line by line.

```jsx
function Post({ post }) {
  return (
    <>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </>
  )
}

export async function getStaticPaths() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  )
  const post = await res.json()

  return { props: { post } }
}

export default Post
```

First, let’s take a look at the `Post` function.

```jsx
function Post({ post }) {
  return (
    <>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </>
  )
}
```

This function is solely responsible for displaying the post data returned from the API. It receives a post parameter from the `getStaticProps()` function. More on that in a moment.

## getStaticPaths

Next, we have the `getStaticPaths()` function.

```jsx
export async function getStaticPaths() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }))

  return { paths, fallback: false }
}
```

:::info
It can be helpful to use `console.log()` to log out the variables to better understand what is happening.
:::

Inside this function, we are fetching the posts from our API.

```jsx
const res = await fetch("https://jsonplaceholder.typicode.com/posts")
```

Then, we convert the response into a JS object.

```jsx
const posts = await res.json()
```

Next, we [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) over all of the posts and return an array of objects. Each object has a `params` property and the `id` of the post.

```jsx
const paths = posts.map((post) => ({
  params: { id: post.id.toString() },
}))
```

If you `console.log()` the paths variable, you will see the following in your terminal.

```jsx
export async function getStaticPaths() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }))

  console.log(paths)

  return { paths, fallback: false }
}
```

![paths-variable.png](/images/nextjs/nextjs-pages-and-pre-rendering/paths-variable.webp)

Finally, we are returning the `paths` variable and `fallback: false`. Remember that the `paths` variable is an array containing a bunch of objects with a `params` property. This is then passed into `getStaticProps()` to fetch the data for each post.

`fallback: false` means that any other routes or paths will throw a 404 error.

```jsx
return { paths, fallback: false }
```

## getStaticProps

Finally, within the `getStaticProps()` function, we have the following:

```jsx
export async function getStaticProps({ params }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  )
  const post = await res.json()

  return { props: { post } }
}
```

We are getting the post data from our API just like in the `getStaticPaths()` function, only this time, we are returning an object with the property of `props` which contains the post data for each of our posts. If you `console.log()` the `post` variable, you should see the following in your terminal.

![post-props.png](/images/nextjs/nextjs-pages-and-pre-rendering/post-props.webp)

If you open the following URL in your browser, [http://localhost:3000/posts/1](http://localhost:3000/posts/1), you should see the following:

![post-1.png](/images/nextjs/nextjs-pages-and-pre-rendering/post-1.webp)

Now, if you change the URL to `/posts/2` or `/posts/3` etc., you will see the respective post.

![post-2.png](/images/nextjs/nextjs-pages-and-pre-rendering/post-2.webp)

## Server-side rendering

If you are rendering content server-side, then instead of using `getStaticProps()`, you use `getServerSideProps()` instead. Since they work similarly, I won’t cover it in this tutorial. You can read more about server-side rendering [here](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props).

## Wrap up

In this article, you learned how pages work in Next.js. You also learned about dynamic routes and the two different ways you can pre-render content with Next, static generation, and SSR. Finally, you learned how to generate static pages with data using the `getStaticPaths()` and `getStaticProps()` functions.
