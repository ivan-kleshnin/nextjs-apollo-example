import {gql, useQuery, useMutation} from "@apollo/client"
import {withApollo} from "apollo/client"
import Head from "next/head"
import Link from "next/link"
import {useRouter} from "next/router"
import React, {useState} from "react"
import {Error, Field, Loading, TopMenu} from "components"
import {getErrorMessage} from "lib"

let postFields = "id title" // TODO fragments vs string interpolation in gql?

let DataQuery = gql`
  query ($postId: ID!) {
    me {
      id
      email
    }
    post(id: $postId) {
      ${postFields}
    }
  }`

let UpdatePostMutation = gql`
  mutation ($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      post {
        ${postFields}
      }
    }
  }`

function Page() {
  let router = useRouter()

  let {data, error, loading} = useQuery(DataQuery, {
    ssr: false,
    variables: {
      postId: router.query.postId,
    }
  })

  let [updatePost] = useMutation(UpdatePostMutation, {
    // refetchQueries: [
    //   {query: RefetchQuery},
    // ],
    // awaitRefetchQueries: true,
  })
  let [alert, setAlert] = useState()

  async function handleSubmit(elements) {
    try {
      let {data} = await updatePost({
        variables: {
          id: router.query.postId,
          input: {
            title: elements.title.value
          },
        },
      })
      // TODO always throw or return `{errors}`-like objects?
      // if (data.updatePost.post) {
      await router.push("/posts")
      // }
    } catch (error) {
      setAlert(getErrorMessage(error))
    }
  }

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

    <h1>Update Post</h1>

    <form onSubmit={(event) => { event.preventDefault(); handleSubmit(event.currentTarget.elements) }}>
      {alert && <p>{alert}</p>}
      <Field
        caption="Title"
        defaultValue={post.title}
        name="title"
        required
        type="text"
      />
      <button type="submit">Submit</button>
    </form>
  </>
}

function Meta() {
  return <Head>
    <title>Update Post</title>
  </Head>
}

export default withApollo(Page)
