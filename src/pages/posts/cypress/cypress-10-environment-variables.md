---
title: 'How to use environment variables in Cypress 10'
date: '2022-11-09'
slug: 'how-to-use-environment-variables-in-cypress-10'
description: 'This tutorial will teach you how to use environment variables from a `.env` file within your Cypress 10 tests.'
hero: '/images/hero/real-world-app.png'
tags: ['cypress']
---

This tutorial will teach you how to use environment variables from a `.env` file within your Cypress 10 tests.

## .env file

Cypress’ [official docs](https://docs.cypress.io/guides/guides/environment-variables) contain several methods of using environment variables, except for the method I will be teaching you in this tutorial. Most JavaScript applications and frameworks import environment variables from a `.env` file that lives locally in your repo. This file is always added to `.gitignore` as you never want to check in sensitive information into version control.

This tutorial will use a `.env` file to hold the email and password necessary for logging in to our tests.

In the root of your repo, create the file `.env`

```bash
touch .env
```

Next, we will add the email and password environment variables like so:

```bash
LOGIN_EMAIL="jdoe@gmail.com"
LOGIN_PASSWORD="password123"
```

{% callout type="note" title="" %}
Notice how I wrap the values of each variable in double-quotes.
{% /callout %}

## cypress.config.js

Now that we have our environment variables inside of a `.env` file, we need to import them into Cypress. To do this, we will need to install an NPM package called [dotenv](https://www.npmjs.com/package/dotenv).

```bash
npm install dotenv --save
```

Next, inside of `cypress.config.js` you will need to require dotenv at the top of the file.

```js
require('dotenv').config()
```

Next, we need to make Cypress aware of these environment variables to use them within our tests.

```js
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      loginEmail: process.env.LOGIN_EMAIL,
      loginPassword: process.env.LOGIN_PASSWORD,
    },
  },
})
```

Here is how this works.

```js
loginEmail: process.env.LOGIN_EMAIL,
```

- `loginEmail` is the name of the variable we will use in our Cypress tests.
- `process.env.LOGIN_EMAIL` is the name of our environment variable from our `.env` file.

The entire file should look like this:

```js
const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      loginEmail: process.env.LOGIN_EMAIL,
      loginPassword: process.env.LOGIN_PASSWORD,
    },
  },
})
```

## Cypress tests

To use these environment variables within our Cypress tests, we need to use [Cypress.env](https://docs.cypress.io/api/cypress-api/env). For example, let’s say you have a [custom Cypress command](https://docs.cypress.io/api/cypress-api/custom-commands) called `cy.login()` that is responsible for logging into your application. This command takes both the email and password necessary to login.

We can use our environment variables with our `cy.login()` command like so:

```js
cy.login(Cypress.env('loginEmail'), Cypress.env('loginPassword'))
```

## Hiding Cypress logs

When you run your tests, Cypress will output the values you passed to the [type](https://docs.cypress.io/api/commands/type) command by default. This is usually not an issue, but if you are typing in sensitive information like a password, it will be logged to the command log like so:

![Cypress type log true](/images/cypress-10-environment-variables/cypress-type-log-true.webp)

To hide sensitive information passed to the `cy.type()` command, you can pass `{ log: false }` like so:

```js
cy.get('input[name=username]').type(email, { log: false })
cy.get('input[name=password]').type(password, { log: false })
```

![Cypress type log false](/images/cypress-10-environment-variables/cypress-type-log-false.webp)

## Cypress Real World App

You can see more examples of how to use environment variables in the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

## Wrap up

This tutorial taught you how to use environment variables from a `.env` file within your Cypress 10 tests. You also learned how to prevent Cypress from logging sensitive information passed to the [type](https://docs.cypress.io/api/commands/type) command.
