---
title: 'Next.js - 1. Install & overview'
date: '2022-09-30'
slug: 'nextjs-install-and-overview'
description: 'In this article, I discuss how to install Next.js and give a brief overview of the framework.'
hero: '/images/hero/nextjs-cover-dark.png'
tags: ['nextjs']
---

## Install

Before creating a Next.js app, you must first install [Node.js](https://nodejs.org/en/). I recommend installing the latest Long Term Support (LTS) version as it is the most stable and well-supported.

To create a new Next.js app, enter the following in your terminal:

```bash
npx create-next-app@latest
```

{% callout type="note" title="" %}
You can also use [Yarn](https://yarnpkg.com/) or [PNPM](https://pnpm.io/) and even configure Next.js to use [TypeScript](https://www.typescriptlang.org/) if you would like. Please check out their [docs](https://nextjs.org/docs/getting-started).
{% /callout %}

The CLI will ask you to name your project and install all the dependencies. Next, `cd` into your Next.js app.

```bash
cd my-app
```

Next, to run the local dev server enter the following into your terminal:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser, and you should see the following:

![nextjs-welcome-screen-bg.png](/images/nextjs/install-and-overview/nextjs-welcome-screen-bg.webp)

## File structure

Now that we have created our Next.js app let's look at the file structure.

![next-file-structure.png](/images/nextjs/install-and-overview/next-file-structure.webp)

- The `.next` directory is a special folder specifically for Next.js. You should never need to touch any files here, as the framework automatically generates them.
- The `node_modules` directory is where all your NPM packages and dependencies get installed.
- The `pages` directory is a special directory in Next.js, which we will discuss in greater detail in another article. This directory is how Next.js handles "file base routing," which means that JS files placed into this directory become their own route. For example, `pages/about.js` will become `/about` in your application's URL.
- The `pages/api` directory allows you to create API routes for your app. We will discuss these in greater detail in another article, but if you are curious now, you can read more about them [here](https://nextjs.org/docs/api-routes/introduction).
- The `public` directory is where you can store static assets like images, fonts, icons, etc.
- The `styles` directory is where you put all of your custom CSS.

## NPM scripts

If you open up the `package.json` file, you will see the following:

![package.json.png](/images/nextjs/install-and-overview/package.json.webp)

I briefly want to discuss the four scripts, so you have a better understanding of them.

### dev

- runs the Next.js development server.
- You can read more about this command [here](https://nextjs.org/docs/api-reference/cli#development).

### build

- builds the production application.
- You can read more about this command [here](https://nextjs.org/docs/api-reference/cli#build).

### start

- starts the Next.js production server and serves the contents created by the `build` command. The `start` script is an excellent way to check your production builds before shipping them into production.
- You can read more about this command [here](https://nextjs.org/docs/api-reference/cli#production).

### lint

- runs ESLint to check for any linting errors.
- You can read more about this command [here](https://nextjs.org/docs/api-reference/cli#lint).

## Wrap up

In this article, you learned the following:

- How to create a new Next.js application.
- The basic file structure of a Next.js app.
- The four npm scripts or commands for developing and building a Next.js app.
