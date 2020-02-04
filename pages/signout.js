import {useMutation, useApolloClient} from "@apollo/react-hooks"
import gql from "graphql-tag"
import {useRouter} from "next/router"
import React from "react"
import {withApollo} from "../apollo/client"

let SignOutMutation = gql`
  mutation SignOutMutation {
    signOut
  }
`

function SignOut() {
  let client = useApolloClient()
  let router = useRouter()
  let [signOut] = useMutation(SignOutMutation)

  React.useEffect(() => {
    signOut().then(() => {
      client.resetStore().then(() => {
        router.push("/signin")
      })
    })
  }, [signOut, router, client])

  return <p>Signing out...</p>
}

export default withApollo(SignOut)
