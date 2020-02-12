import {useQuery} from "@apollo/client"
import {withApollo} from "apollo/client"
import gql from "graphql-tag"
import Head from "next/head"
import Link from "next/link"
import {useRouter} from "next/router"
import React from "react"
import {Error, Loading, TopMenu} from "components"

export let DataQuery = gql`
  query {
    me {
      id
      email
    }
    posts {
      id
      title
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

  let {me, posts} = data

  return <>
    <Meta/>

    <TopMenu me={me}/>

    <h1>Blog</h1>

    <Link href="/posts/create">
      <a>Create Post</a>
    </Link>

    {posts.map(post => {
      return <pre key={post.id}>
        <code>
          {JSON.stringify(post, null, 2)}
        </code>
        <p>
          <Link href="/posts/[postId]" as={`/posts/${post.id}`}>
            <a>Read</a>
          </Link>
          {" "}
          <Link href="/posts/[postId]/update" as={`/posts/${post.id}/update`}>
            <a>Update</a>
          </Link>
        </p>
      </pre>
    })}
  </>
}

function Meta() {
  return <Head>
    <title>Blog</title>
  </Head>
}

export default withApollo(Page)
