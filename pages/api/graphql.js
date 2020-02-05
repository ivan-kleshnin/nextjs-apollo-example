import {ApolloServer, AuthenticationError} from "apollo-server-micro"
import cookie from "cookie"
import JWT from "jsonwebtoken"
import {schema} from "../../apollo/schema"
import * as DB from "../../db"

let apolloServer = new ApolloServer({
  schema,

  context(ctx) {
    let {token} = cookie.parse(ctx.req.headers.cookie || "")

    // 1. Find optional visitor id
    let id = null
    if (token) {
      try {
        let obj = JWT.verify(token, process.env.JWT_SECRET)
        id = obj.id
      } catch (err) {
        console.error(err) // expired token, invalid token
        // TODO how to handle expired token?
        // remove cookie? In browser it's just "400 Error" a.t.m

        // TODO this does not prevent from seeing "400 Error" (requires page reload)
        // ctx.res.setHeader(
        //   "Set-Cookie",
        //   cookie.serialize("token", "", {
        //     httpOnly: true,
        //     maxAge: -1,
        //     path: "/",
        //     sameSite: "lax",
        //     secure: process.env.NODE_ENV == "production",
        //   })
        // )
        throw new AuthenticationError("Authentication token is invalid, please log in")
      }
    }

    // 2. Find optional visitor
    let visitor = null
    if (id) {
      let db = DB.read()
      visitor = db.accounts.find(account => account.id == id)
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
