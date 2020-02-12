import {gql, useQuery} from "@apollo/client"
import {withApollo} from "apollo/client"
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
      <Meta post={props.post}/>
      <Error error={error}/>
    </>
  }

  if (loading) { // <=> typeof window == "undefined"
    return <>
      <Meta post={props.post}/>
      <Loading/>
    </>
  }

  let {me, post} = data

  return <>
    <Meta post={data.post}/>

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

function Meta({post}) {
  return <Head>
    <title>View Post {post ? post.title : "..."}</title>
  </Head>
}

Page.getInitialProps = async function ({apolloClient, query}) {
  if (typeof window == "undefined") {
    let {data: {post}} = await apolloClient.query({
      query: gql`
        query ($id: ID!) {
          post(id: $id) {
            id
            title
          }
        }`,
      variables: {
        id: query.postId,
      }
    })
    return {post}
  }
  return {post: null}
}

export default withApollo(Page)
