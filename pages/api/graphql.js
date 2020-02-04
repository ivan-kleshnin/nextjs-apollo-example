import {ApolloServer, AuthenticationError} from "apollo-server-micro"
import cookie from "cookie"
import {schema} from "../../apollo/schema"
import * as DB from "../../db"

let apolloServer = new ApolloServer({
  schema,

  context(ctx) {
    let {token} = cookie.parse(ctx.req.headers.cookie || "")

    let visitor = null
    if (token) {
      try {
        let id = token
        // let {id, email} = jwt.verify(token, process.env.JWT_SECRET)
        let db = DB.read()
        visitor = db.accounts.find(account => account.id == id)
      } catch {
        throw new AuthenticationError("Authentication token is invalid, please log in")
      }
    }

    return {
      ...ctx,
      visitor,
    }
  },
})

export let config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({
  path: "/api/graphql"
})
