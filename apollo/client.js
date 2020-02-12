import React from "react"
// import Head from "next/head"
import {ApolloClient, ApolloProvider, InMemoryCache, HttpLink} from "@apollo/client"
import fetch from "cross-fetch"

let globalApolloClient = null

export function withApollo(PageComponent, {ssr = true} = {}) {
  let WithApollo = ({apolloClient, ...pageProps}) => {
    let client = apolloClient || initApolloClient()
    return <ApolloProvider client={client}>
      <PageComponent {...pageProps} />
    </ApolloProvider>
  }

  // Set the correct displayName in development
  // if (process.env.NODE_ENV !== "production") {
  //   let displayName =
  //     PageComponent.displayName || PageComponent.name || "Component"
  //
  //   if (displayName == "App") {
  //     console.warn("This withApollo HOC only works with PageComponents.")
  //   }
  //
  //   WithApollo.displayName = `withApollo(${displayName})`
  // }

  if (PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async function (ctx) {
      ctx.apolloClient = initApolloClient(ctx)
      return PageComponent.getInitialProps(ctx)
    }
  } else {
    WithApollo.getInitialProps = function () {
      return {noop: null}
    }
  }

  // if (ssr || PageComponent.getInitialProps) {
  //   WithApollo.getInitialProps = async ctx => {
  //     let {AppTree} = ctx
  //
  //     // Initialize ApolloClient, add it to the ctx object so
  //     // we can use it in `PageComponent.getInitialProp`.
  //     let apolloClient = (ctx.apolloClient = initApolloClient({
  //       res: ctx.res,
  //       req: ctx.req,
  //     }))
  //
  //     // Run wrapped getInitialProps methods
  //     let pageProps = {}
  //     if (PageComponent.getInitialProps) {
  //       pageProps = await PageComponent.getInitialProps(ctx)
  //     }
  //
  //     // Only on the server:
  //     if (typeof window == "undefined") {
  //       // When redirecting, the response is finished.
  //       // No point in continuing to render
  //       if (ctx.res && ctx.res.finished) {
  //         return pageProps
  //       }
  //
  //       // Only if ssr is enabled
  //       if (ssr) {
  //         try {
  //           // Run all GraphQL queries
  //           let {getDataFromTree} = await import("@apollo/react-ssr")
  //           await getDataFromTree(
  //             <AppTree
  //               pageProps={{
  //                 ...pageProps,
  //                 apolloClient,
  //               }}
  //             />
  //           )
  //         } catch (error) {
  //           // Prevent Apollo Client GraphQL errors from crashing SSR.
  //           // Handle them in components via the data.error prop:
  //           // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
  //           console.error("Error while running `getDataFromTree`", error)
  //         }
  //
  //         // getDataFromTree does not call componentWillUnmount
  //         // head side effect therefore need to be cleared manually
  //         Head.rewind()
  //       }
  //     }
  //
  //     // Extract query data from the Apollo store
  //     let apolloState = apolloClient.cache.extract()
  //
  //     return {
  //       ...pageProps,
  //       apolloState,
  //     }
  //   }
  // }

  return WithApollo
}

function initApolloClient(ctx) {
  // Create a new client per request on server
  if (typeof window == "undefined") {
    return createApolloClient(ctx)
  }

  // Reuse the same client in browser
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(ctx)
  }

  return globalApolloClient
}

function createApolloClient(ctx = {}) {
  let ssr = typeof window == "undefined"

  let defaultOptions = {
    query: {
      fetchPolicy: ssr ? "no-cache" : "cache-first",
      errorPolicy: "none", // TODO compare "none" and "all" effects
    }
  }

  let cache = new InMemoryCache()

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: !ssr,
    ssrMode: ssr,
    // TODO or new SchemaLink({schema, context: ctx}) -- should not be present in client bundle
    link: new HttpLink({
      uri: "http://localhost:3000/api/graphql", // TODO more flexible URL, just "/api/graphql" causes problems
      credentials: "same-origin",
      fetch: fetch, // fetchWithCredentials(ctx.req?.headers?.cookie),
    }),
    cache,
  })
}

// function fetchWithCredentials(cookie) {
//   return function (url, options) {
//     return fetch(url, {
//       ...options,
//       credentials: "include", // "same-origin" TODO which one?
//       headers: {
//         ...options.headers,
//         ... typeof window != "undefined" ?  {} : {
//           "Cookie": cookie,
//         }
//       }
//     })
//   }
// }
