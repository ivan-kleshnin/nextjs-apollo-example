import {useQuery, useMutation} from "@apollo/react-hooks"
import {withApollo} from "apollo/client"
import gql from "graphql-tag"
import Head from "next/head"
import {useRouter} from "next/router"
import React, {useState} from "react"
import {Error, Field, Loading, TopMenu} from "components"
import {getErrorMessage} from "lib"

let DataQuery = gql`
  query {
    me {
      id
      email
    }
  }`

let SignUpMutation = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(input: {email: $email, password: $password}) {
      account {
        id
        email
      }
    }
  }`

function Page() {
  let router = useRouter()

  let {data, error, loading} = useQuery(DataQuery, {
    ssr: false,
  })

  let [signUp] = useMutation(SignUpMutation)
  let [alert, setAlert] = useState()

  async function handleSubmit(elements) {
    try {
      let {data} = await signUp({
        variables: {
          email: elements.email.value,
          password: elements.password.value,
        },
      })
      // TODO can possibly do auto signin (or should?!)
      if (data.signUp.account) {
        await router.push("/signin")
      }
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

  return <>
    <Meta/>

    <TopMenu me={data.me}/>

    <h1>SignUp</h1>
    <form onSubmit={(event) => { event.preventDefault(); handleSubmit(event.currentTarget.elements) }}>
      {alert && <p>{alert}</p>}
      <Field
        name="email"
        type="email"
        autoComplete="Email"
        label="Email"
        required
      />
      <Field
        name="password"
        type="password"
        autoComplete="Password"
        label="Password"
        required
      />
      <button type="submit">Submit</button>
    </form>
  </>
}

function Meta() {
  return <Head>
    <title>SignUp</title>
  </Head>
}

export default withApollo(Page)
