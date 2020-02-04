import {useMutation, useApolloClient} from "@apollo/react-hooks"
import gql from "graphql-tag"
import Link from "next/link"
import {useRouter} from "next/router"
import React, {useEffect} from "react"
import {withApollo} from "../apollo/client"
import Field from "../components/field"
import {getErrorMessage} from "../lib"

let SignInMutation = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(input: {email: $email, password: $password}) {
      account {
        id
        email
      }
    }
  }`

let SignGithubMutation = gql`
  mutation SignGithubMutation($code: String!) {
    signGithub(code: $code) {
      account {
        id
        email
      }
    }
  }`

function SignIn() {
  let client = useApolloClient()
  let [signIn] = useMutation(SignInMutation)
  let [signGithub] = useMutation(SignGithubMutation)
  let [errorMsg, setErrorMsg] = React.useState()
  let router = useRouter()

  async function handleSignIn(elements) {
    try {
      await client.resetStore()
      let {data} = await signIn({
        variables: {
          email: elements.email.value,
          password: elements.password.value,
        },
      })
      if (data.signIn.account) {
        await router.push("/")
      }
    } catch (err) {
      setErrorMsg(getErrorMessage(err))
    }
  }

  async function handleSignGithub(code) {
    try {
      let {data} = await signGithub({
        variables: {
          code: code,
        }
      })
      if (data.signGithub.account) {
        await router.push("/")
      }
    } catch (err) {
      setErrorMsg(getErrorMessage(err))
    }
  }

  useEffect(() => {
    let searchParams = new URLSearchParams(window.location.search)
    let code = searchParams.get("code")
    if (code) {
      handleSignGithub(code)
    }
  }, [])

  let githubAuthParams = new URLSearchParams({
    client_id: process.env.GITHUB_APP_ID,
    // redirect_uri: "http://localhost:3000/api/github/login", ??? TODO need?
    // state: ??? TODO CSRF protection
    scope: "user:email",
  })

  return <>
    <h1>Sign In</h1>
    <form onSubmit={(event) => { event.preventDefault(); handleSignIn(event.currentTarget.elements) }}>
      {errorMsg && <p>{errorMsg}</p>}
      <Field
        name="email"
        type="email"
        autoComplete="email"
        required
        label="Email"
      />
      <Field
        name="password"
        type="password"
        autoComplete="password"
        required
        label="Password"
      />
      <button type="submit">Sign in</button> or{" "}
      <Link href="signup">
        <a>Sign up</a>
      </Link>
    </form>
    <hr/>
    <h2>With GitHub</h2>
    <a href={"https://github.com/login/oauth/authorize?" + githubAuthParams.toString()}>
      Login
    </a>
  </>
}

export default withApollo(SignIn)
