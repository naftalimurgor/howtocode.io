---
title: 'Next.js - 3. API routes'
date: '2022-10-13'
description: 'In this article, you will learn how to create API routes in Next.js and how to use them inside of Next.js pages.'
hero: '/images/hero/nextjs-cover-dark.png'
tags: ['nextjs']
---

{% callout type="note" title="What you'll learn" %}
In this article you will learn the following:

- How to create API routes in Next.js
- How to respond to different HTTP methods and requests
- How to use API routes inside of Next.js pages
- How to create dynamic API routes

{% /callout %}

## API routes

API routes allow you to build APIs with Next.js.

If you open `pages/api/hello.js` you will see the following:

```jsx
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

Start up the Next.js dev server with:

```bash
npm run dev
```

Then open [http://localhost:3000/api/hello](http://localhost:3000/api/hello) in your browser. You should see the following:

![hello-api-route.png](/images/nextjs/next-api-routes/hello-api-route.webp)

Since we have a file called `hello.js` inside of `pages/api` Next.js will create a route for this API at `/api/hello`. API routes can also be [dynamic](https://nextjs.org/docs/api-routes/dynamic-api-routes) just like dynamic pages which we covered in the previous lesson. We will cover how to create dynamic API routes later in this article.

## Code breakdown

Let’s take a deeper look into the `hello.js` file.

```jsx
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

This file contains a single exported function called `handler()` . The name of this function is not important, you can name it whatever you want, but handler is a common convention. The function has two parameters `req` and `res`.

- The `req` parameter is an instance of [http.IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage) from Node.js
- The `res` parameter is an instance of [http.ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse) from Node.js

Next.js also provides some built in [middlewares](https://nextjs.org/docs/api-routes/request-helpers) and [helper functions](https://nextjs.org/docs/api-routes/response-helpers) to make it easier to work with the request and response objects.

The body of our `handler()` function contains the following:

```jsx
res.status(200).json({ name: 'John Doe' })
```

This returns a response status code of 200 and then it returns a JSON object with a name property and “John Doe” as its value.

## HTTP request methods

Our handler method will currently respond to any HTTP request method, but what if we want to have different responses for different requests? We can do this by detecting which type of HTTP method our API route is receiving using the `req` object.

Let’s update our `handler()` function to only respond to HTTP Get requests.

```jsx
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ name: 'John Doe' })
  }
}
```

By using a simple `if()` statement we can detect different HTTP request methods our API route receives and respond accordingly.

Let’s update our `handler()` to throw a 400 status code if it receives any HTTP method other than GET.

```jsx
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ name: 'John Doe' })
  } else {
    res.status(400).json({ error: 'Your request could not be processed.' })
  }
}
```

## API routes & getStaticProps

Now that we have a better understanding of API routes, let’s see how we can use them inside of Next.js pages. Inside of our `pages/posts/[id].js` we are making an API call to an external API to get our post data.

```jsx
export async function getStaticProps({ params }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  )
  const post = await res.json()

  console.log(post)

  return { props: { post } }
}
```

Let’s create a new API route for our posts and use that inside of the `getStaticProps()` function.

## Posts API route

First, create a new file called `posts.js` inside of `/pages/api` like so.

![posts-file.png](/images/nextjs/next-api-routes/posts-file.webp)

Next, we will create our `handler()` function.

```jsx
export default function handler(req, res) {}
```

Next we will need to return our posts data. To do this, we will copy the JSON from [https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts) into a new file and use that inside of our `handler()`.

Create a new folder called `data` at the root of our Next.js project. Then create a file called `posts.json` inside of it.

![posts-json.png](/images/nextjs/next-api-routes/posts-json.webp)

Copy and paste all of the posts from [https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts) into the `posts.json` file.

![posts-json-data.png](/images/nextjs/next-api-routes/posts-json-data.webp)

Next, we will need to import this file into our `pages/api/posts.js` file like so:

```jsx
import posts from '../../data/posts.json'

export default function handler(req, res) {}
```

Now all we have to do is return our posts from our `handler()` function like so:

```jsx
import posts from '../../data/posts.json'

export default function handler(req, res) {
  res.status(200).json(posts)
}
```

Now if you go to the URL [http://localhost:3000/api/posts](http://localhost:3000/api/posts) in your web browser you should see the following:

![api-posts-route.png](/images/nextjs/next-api-routes/api-posts-route.webp)

Now that we have our API route returning our posts, we need to update the `getStaticProps()` and `getStaticPaths()` functions to our API route like so:

Here is the entire contents of `pages/posts/[id].js`

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
  const res = await fetch('http://localhost:3000/api/posts')
  const posts = await res.json()

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/posts/${params.id}`)
  const post = await res.json()

  console.log(post)

  return { props: { post } }
}

export default Post
```

You should be getting an error.

Let’s try and get one of our posts by visiting [http://localhost:3000/posts/1](http://localhost:3000/posts/1) you should see the following error:

![invalid-json-response-error.png](/images/nextjs/next-api-routes/invalid-json-response-error.webp)

So what exactly is going on here? Well, if you look closely, inside of `getStaticProps()` we are trying to fetch each post by an ID number:

```jsx
const res = await fetch(`http://localhost:3000/api/posts/${params.id}`)
```

The problem is that we only created an API route for `/api/posts` not for `/api/posts/1`. In order for this to work, we need to create a [dynamic API route](https://nextjs.org/docs/api-routes/dynamic-api-routes).

## Dynamic API routes

Create a folder called `posts` inside of `/pages/api` like so:

![posts-folder.png](/images/nextjs/next-api-routes/posts-folder.webp)

Next, move `/pages/api/posts.js` inside of the `/pages/api/posts` folder and rename it to `index.js`

![posts-index-js.png](/images/nextjs/next-api-routes/posts-index-js.webp)

Now create a file named `/api/posts/[id].js` like so:

![posts-id-file.png](/images/nextjs/next-api-routes/posts-id-file.webp)

Next copy and paste the following into `pages/api/[id].js`.

```jsx
import posts from '../../../data/posts.json'

export default function handler(req, res) {
  res.status(200).json(posts)
}
```

![posts-id-file-contents.png](/images/nextjs/next-api-routes/posts-id-file-contents.webp)

Now if you go to the URL [http://localhost:3000/api/posts/1](http://localhost:3000/api/posts/1) you should see the following:

![api-posts-1-route.png](/images/nextjs/next-api-routes/api-posts-1-route.webp)

Our dynamic API route is currently returning all of the posts data instead of just a single post with the ID of 1. Let’s write some logic inside of our `handler()` function to filter this data and return the correct post based upon the ID in the URL.

The first thing we will need to do is get the ID number from the request.

```jsx
export default function handler(req, res) {
  const { id } = req.query
  res.status(200).json(posts)
}
```

We are using [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to grab the ID off of the request object.

```jsx
const { id } = req.query
```

We can verify this by passing the `id` variable into our `res` like so:

```jsx
export default function handler(req, res) {
  const { id } = req.query
  res.status(200).json(id)
}
```

Now if you visit [http://localhost:3000/api/posts/1](http://localhost:3000/api/posts/1) you should see the following:

![post-id-json-response.png](/images/nextjs/next-api-routes/post-id-json-response.webp)

Now that we are getting the ID from the response we can use it to filter through all of the posts data and return the post with the correct ID.

```jsx
export default function handler(req, res) {
  const { id } = req.query
  const post = posts.filter((post) => id == post.id)

  res.status(200).json(post)
}
```

Now when we visit [http://localhost:3000/api/posts/1](http://localhost:3000/api/posts/1) we should see only the post data for that ID.

![api-post-1-data.png](/images/nextjs/next-api-routes/api-post-1-data.webp)

Each time you change the ID in the URL you should get back a different post.

Now if you try to visit [http://localhost:3000/posts/1](http://localhost:3000/posts/1) you will notice that the screen is blank!?! If you look closely at the JSON data returned from each post, you will see that the post data is nested inside of an array.

Inside of `pages/posts/[id].js` at the top of our file, our `Post` function is the following:

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

We are not expecting the data to be nested inside of an array which is why the post is not being displayed. We have two options to fix this.

First option is to update the `Post()` like so:

```jsx
function Post({ post }) {
  console.log(post)
  return (
    <>
      <h1>{post[0].title}</h1>
      <p>{post[0].body}</p>
    </>
  )
}
```

![post-function-array-updates.png](/images/nextjs/next-api-routes/post-function-array-updates.webp)

The second option and better option in my opinion is to use destructuring again. Update the `getStaticProps()` to the following:

```jsx
function Post({ post }) {
  console.log(post)
  return (
    <>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </>
  )
}

// ...

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/posts/${params.id}`)
  const [post] = await res.json() // this is destructuring

  return { props: { post } }
}
```

<aside>
💡 Notice that we do not need to update anything within the `Post` function at the top, since we are now sending it the correct data.

</aside>

On this line here:

```jsx
const [post] = await res.json()
```

we are destructuring the post object from the array it is nested inside.

## Wrap up

In this article you learned the following:

- How to create API routes in Next.js
- How to respond to different HTTP methods and requests
- How to use API routes inside of Next.js pages
- How to create dynamic API routes
