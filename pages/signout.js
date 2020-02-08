import {useMutation, useApolloClient} from "@apollo/react-hooks"
import gql from "graphql-tag"
import {useRouter} from "next/router"
import React, {useEffect} from "react"
import {withApollo} from "apollo/client"

let SignOutMutation = gql`
  mutation SignOut {
    signOut
  }`

function Page() {
  let apollo = useApolloClient()
  let router = useRouter()
  let [signOut] = useMutation(SignOutMutation)

  useEffect(() => {
    signOut().then(() => {
      apollo.resetStore().then(() => {
        router.push("/signin")
      })
    })
  }, [signOut, router, apollo])

  return <div>
    <p>
      Signing out...
    </p>
  </div>
}

export default withApollo(Page)
