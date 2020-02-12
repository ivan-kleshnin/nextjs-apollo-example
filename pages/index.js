import {gql, useQuery} from "@apollo/client"
import {withApollo} from "apollo/client"
import Head from "next/head"
import {useRouter} from "next/router"
import React from "react"
import {Error, Loading, TopMenu} from "components"

let DataQuery = gql`
  query {
    me {
      id
      email
    }
  }`

function Page() {
  let router = useRouter()

  let {data, error, loading} = useQuery(DataQuery, {
    ssr: false,
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
