import {useQuery, useMutation} from "@apollo/react-hooks"
import {withApollo} from "apollo/client"
import gql from "graphql-tag"
import Head from "next/head"
import Link from "next/link"
import {useRouter} from "next/router"
import React, {useState} from "react"
import {Error, Field, Loading, TopMenu} from "components"
import {getErrorMessage} from "lib"
import {DataQuery as RefetchQuery} from "./index"

let DataQuery = gql`
  query {
    me {
      id
      email
    }
  }`

let CreatePostMutation = gql`
  mutation ($input: CreatePostInput!) {
    createPost(input: $input) {
      post {
        id
      }
    }
  }`

function Page() {
  let router = useRouter()

  let {data, error, loading} = useQuery(DataQuery, {
    ssr: false,
  })

  let [createPost] = useMutation(CreatePostMutation, {
    refetchQueries: [
      {query: RefetchQuery},
    ],
    // awaitRefetchQueries: true,
  })
  let [alert, setAlert] = useState()

  async function handleSubmit(elements) {
    try {
      let {data} = await createPost({
        variables: {
          input: {
            title: elements.title.value
          },
        },
      })
      // TODO always throw or return `{errors}`-like objects?
      // if (data.createPost.post) {
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

  let {me} = data

  return <>
    <Meta/>

    <TopMenu me={me}/>

    <h1>Create Post</h1>
    <form onSubmit={(event) => { event.preventDefault(); handleSubmit(event.currentTarget.elements) }}>
      {alert && <p>{alert}</p>}
      <Field
        caption="Title"
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
    <title>Create Post</title>
  </Head>
}

export default withApollo(Page)
