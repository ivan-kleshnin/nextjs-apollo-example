import {gql, useApolloClient, useQuery, useMutation} from "@apollo/client"
import {withApollo} from "apollo/client"
import Head from "next/head"
import {useRouter} from "next/router"
import React, {useEffect, useState} from "react"
import {Error, Field, Loading, TopMenu} from "components"
import {getErrorMessage} from "lib"

let DataQuery = gql`
  query {
    me {
      id
      email
    }
  }`

let SignInMutation = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(input: {email: $email, password: $password}) {
      account {
        id
        email
      }
    }
  }`

// let SignGithubMutation = gql`
//   mutation SignGithubMutation($code: String!) {
//     signGithub(code: $code) {
//       account {
//         id
//         email
//       }
//     }
//   }`

function Page() {
  let router = useRouter()

  let {data, error, loading} = useQuery(DataQuery, {
    ssr: false,
  })

  let apollo = useApolloClient()
  let [signIn] = useMutation(SignInMutation)
  let [alert, setAlert] = useState()
  // let [signGithub] = useMutation(SignGithubMutation)

  async function handleSubmit(elements) {
    try {
      let {data} = await signIn({
        variables: {
          email: elements.email.value,
          password: elements.password.value,
        },
      })
      await apollo.resetStore() // Has to be after `signIn`, otherwise `me {..}` is immediately fired
      // if (data.signIn.account) {
      await router.push("/")
      // }
    } catch (error) {
      setAlert(getErrorMessage(error))
    }
  }

  // async function handleSignGithub(code) {
  //   try {
  //     let {data} = await signGithub({
  //       variables: {
  //         code: code,
  //       }
  //     })
  //     if (data.signGithub.account) {
  //       await router.push("/")
  //     }
  //   } catch (err) {
  //     setErrorMsg(getErrorMessage(err))
  //   }
  // }

  // useEffect(() => {
  //   let searchParams = new URLSearchParams(window.location.search)
  //   let code = searchParams.get("code")
  //   if (code) {
  //     handleSignGithub(code)
  //   }
  // }, [])

  // let githubAuthParams = new URLSearchParams({
  //   client_id: process.env.GITHUB_APP_ID,
  //   // redirect_uri: "http://localhost:3000/api/github/login", ??? TODO need?
  //   // state: ??? TODO CSRF protection
  //   scope: "user:email",
  // })

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

    <h1>SignIn</h1>
    <form onSubmit={(event) => { event.preventDefault(); handleSubmit(event.currentTarget.elements) }}>
      {alert && <p>{alert}</p>}
      <Field
        caption="Email"
        defaultValue=""
        name="email"
        required
        type="email"
      />
      <Field
        caption="Password"
        defaultValue=""
        name="password"
        required
        type="password"
      />
      <button type="submit">Submit</button>
    </form>
    {/*<hr/>
    <h2>With GitHub</h2>
    <a href={"https://github.com/login/oauth/authorize?" + githubAuthParams.toString()}>
      Sign In
    </a>*/}
  </>
}

function Meta() {
  return <Head>
    <title>SignIn</title>
  </Head>
}

export default withApollo(Page)
