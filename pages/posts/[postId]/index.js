import {useQuery} from "@apollo/react-hooks"
import {withApollo} from "apollo/client"
import gql from "graphql-tag"
import Head from "next/head"
import Link from "next/link"
import {useRouter} from "next/router"
import React from "react"
import {Error, Loading, TopMenu} from "components"

let DataQuery = gql`
  query ($postId: ID!) {
    me {
      id
      email
    }
    post(id: $postId) {
      id
      title
    }
  }`

function Page(props) {
  console.log("@ props", props)

  let router = useRouter()

  let {data, error, loading} = useQuery(DataQuery, {
    ssr: false,
    variables: {
      postId: router.query.postId,
    }
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

  let {me, post} = data

  return <>
    <Meta/>

    <TopMenu me={me}/>

    <h1>Post</h1>

    <Link href="/posts/[postId]/update" as={`/posts/${post.id}/update`}>
      <a>Update Post</a>
    </Link>

    <pre>
      <code>
        {JSON.stringify(post, null, 2)}
      </code>
    </pre>
  </>
}

function Meta() {
  return <Head>
    <title>View Post</title>
  </Head>
}

export default withApollo(Page)
