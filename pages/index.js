import {useQuery} from "@apollo/react-hooks"
import {withApollo} from "apollo/client"
import gql from "graphql-tag"
import Head from "next/head"
import {useRouter} from "next/router"
import {TopMenu, Loading, Error} from "components"
import React from "react"

let MeQuery = gql`
  query MeIndex {
    me {
      id
      email
    }
  }`

function Page() {
  let router = useRouter()

  let {data, error, loading} = useQuery(MeQuery, {
    // fetchPolicy: "network-only"
  })

  if (error) {
    return <>
      <Meta/>
      <Error error={error}/>
    </>
  }

  if (loading) {
    return <>
      <Meta/>
      <Loading/>
    </>
  }

  return <>
    <Meta/>

    <TopMenu me={data.me}/>

    <h1>Home</h1>

    <>
      <pre><code>
        {JSON.stringify(data.me || {role: "guest"}, null, 2)}
      </code></pre>
    </>
  </>
}

function Meta() {
  return <Head>
    <title>Home</title>
  </Head>
}

export default withApollo(Page)
