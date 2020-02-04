# Apollo Server and Client Auth Example

**Note**: this code is a revision of [api-routes-apollo-server-and-client-auth](https://github.com/zeit/next.js/tree/canary/examples/api-routes-apollo-server-and-client-auth) original example.
My goal is to make it more production-like.

---

[Apollo](https://www.apollographql.com/client/) is a GraphQL client that allows you to easily query the exact data you need from a GraphQL server. In addition to fetching and mutating data, Apollo analyzes your queries and their results to construct a client-side cache of your data, which is kept up to date as further queries and mutations are run, fetching more results from the server.

In this simple example, we integrate Apollo seamlessly with Next by wrapping our _pages/\_app.js_ inside a [higher-order component (HOC)](https://facebook.github.io/react/docs/higher-order-components.html). Using the HOC pattern we're able to pass down a central store of query result data created by Apollo into our React component hierarchy defined inside each page of our Next application.

On initial page load, while on the server and inside `getInitialProps`, we invoke the Apollo method, [`getDataFromTree`](https://www.apollographql.com/docs/react/api/react-ssr/#getdatafromtree). This method returns a promise; at the point in which the promise resolves, our Apollo Client store is completely initialized.

Note: Do not be alarmed that you see two renders being executed. Apollo recursively traverses the React render tree looking for Apollo query components. When it has done that, it fetches all these queries and then passes the result to a cache. This cache is then used to render the data on the server side (another React render).
https://www.apollographql.com/docs/react/api/react-ssr/#getdatafromtree

## How to use

1. Fetch repo

```
project-folder $ git init
project-folder $ git remote add origin git@github.com:ivan-kleshnin/nextjs-apollo-example.git
project-folder $ git pull origin master
```

2. Install deps

```
project-folder $ yarn install
```

3. Run

```
project-folder $ yarn dev
```
