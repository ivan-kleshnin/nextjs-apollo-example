import {useMutation} from "@apollo/react-hooks"
import gql from "graphql-tag"
import Link from "next/link"
import {useRouter} from "next/router"
import React from "react"
import {withApollo} from "../apollo/client"
import Field from "../components/field"
import {getErrorMessage} from "../lib"

let SignUpMutation = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    signUp(input: {email: $email, password: $password}) {
      account {
        id
        email
      }
    }
  }
`

function SignUp() {
  let [signUp] = useMutation(SignUpMutation)
  let [errorMsg, setErrorMsg] = React.useState()
  let router = useRouter()

  async function handleSubmit(elements) {
    try {
      await signUp({
        variables: {
          email: elements.email.value,
          password: elements.password.value,
        },
      }) // TODO can possibly contain auto signin (or should?!)
      await router.push("/signin")
    } catch (error) {
      setErrorMsg(getErrorMessage(error))
    }
  }

  return <>
    <h1>Sign Up</h1>
    <form onSubmit={(event) => { event.preventDefault(); handleSubmit(event.currentTarget.elements) }}>
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
      <button type="submit">Sign up</button> or{" "}
      <Link href="signin">
        <a>Sign in</a>
      </Link>
    </form>
  </>
}

export default withApollo(SignUp)
