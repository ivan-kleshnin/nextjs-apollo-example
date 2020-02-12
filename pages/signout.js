import {useApolloClient, useMutation} from "@apollo/client"
import {withApollo} from "apollo/client"
import gql from "graphql-tag"
import Head from "next/head"
import {useRouter} from "next/router"
import React, {useEffect} from "react"

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
