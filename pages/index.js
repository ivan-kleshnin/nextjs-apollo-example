import {useQuery} from "@apollo/react-hooks"
import gql from "graphql-tag"
import Link from "next/link"
import {useRouter} from "next/router"
import {withApollo} from "../apollo/client"

let MeQuery = gql`
  query MeQuery {
    me {
      id
      email
    }
  }`

let Index = () => {
  let router = useRouter()
  let {data, loading} = useQuery(MeQuery, {
    // fetchPolicy: "network-only"
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return null
  }

  if (!data.me && typeof window != "undefined") {
    router.push("/signin")
  }

  if (data && data.me) {
    return <div>
      You're signed in as {data.me.email} goto{" "}
      <Link href="/about">
        <a>static</a>
      </Link>{" "}
      page. or{" "}
      <Link href="/signout">
        <a>signout</a>
      </Link>
    </div>
  } else {
    return <div>
      Hi guest!
    </div>
  }
}

export default withApollo(Index)
