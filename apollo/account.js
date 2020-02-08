import {UserInputError} from "apollo-server-micro"
import cookie from "cookie"
import gql from "graphql-tag"
import JWT from "jsonwebtoken"
import UUID from "uuid/v4"
import * as DB from "../db"
import {fetchJSON} from "../lib"

function makeAccount(data) {
  return {
    id: UUID(),
    ...data,
  }
}

function validPassword(account, password) {
  return password == account.password
  // return bcrypt.compareSync(password, account.hashedPassword)
}

export let typeDefs = gql`
  type Account {
    id: ID!
    email: String!
  }

  input SignUpInput {
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    account: Account!
  }

  extend type Query {
    account(id: ID!): Account!
    accounts: [Account]!
    me: Account
  }

  extend type Mutation {
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
    signGithub(code: String!): AuthPayload
    signOut: Boolean!
  }`

export let resolvers = {
  Query: {
    async me(_, args, {visitor}) {
      return visitor
    },
  },

  Mutation: {
    async signGithub(_, args, {req, res}) {
      // Step 1: get code (the request to GitHub occurs in browser)
      let {code} = args

      if (!code) {
        throw Error(`no code provided`)
      }

      // Step 2: ask GitHub auth for `accessToken`
      let accessToken
      try {
        let searchParams = new URLSearchParams({
          client_id: process.env.GITHUB_APP_ID,
          client_secret: process.env.GITHUB_APP_SECRET,
          code: code,
        })
        accessToken = await fetchJSON(`https://github.com/login/oauth/access_token?${searchParams.toString()}`, {
          method: "POST",
        }).then(({body}) => {
          if (body.error)         throw new Error(body.error_description)
          if (!body.access_token) throw new Error("empty `accessToken`")
          return body.access_token
        })
      } catch (err) {
        console.error(err)
        throw Error("failed to get `accessToken` from 'https://github.com/login/oauth'")
      }

      // Step 3: ask GitHub for `user`
      let githubAccount
      try {
        githubAccount = await fetchJSON(`https://api.github.com/user`, {
          headers: {
            Authorization: "token " + accessToken
          }
        })
        .then(({body}) => {
          if (body.error) throw new Error(body.error_description)
          return {
            username: body.login,
            fullname: body.name,
            email: body.email,
            title: body.bio,
            location: body.location,
            avatarUrl: body.avatar_url,
          }
        })
      } catch (err) {
        console.error(err)
        throw Error("failed to load `githubAccount` from 'https://api.github.com/user'")
      }

      // Step 4: try to find the account
      let db = DB.read()
      let account = db.accounts.find(account => account.email == githubAccount.email)

      // Step 5: if the account does not exist – create it
      if (!account) {
        account = makeAccount({...githubAccount, password: UUID()})
        DB.write({accounts: [...db.accounts, account]})
      }

      // Step 6: authenticate user
      let token = JWT.sign(
        {id: account.id},
        process.env.JWT_SECRET,
        {expiresIn: "6h"}
      )

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          maxAge: 6 * 60 * 60,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV == "production",
        })
      )

      return {account}
    },

    async signUp(_, args, {}) {
      let {input} = args

      let db = DB.read()
      if (db.accounts.find(account => account.email == input.email)) {
        throw new UserInputError("This email is already taken")
      }

      let account = makeAccount(input)

      DB.write({accounts: [...db.accounts, account]})

      return {account}
    },

    async signIn(_, args, {res}) {
      let {input} = args

      let db = DB.read()
      let account = db.accounts.find(account => account.email == input.email)

      if (account && validPassword(account, args.input.password)) {
        let token = JWT.sign(
          {id: account.id},
          process.env.JWT_SECRET,
          {expiresIn: "5m"}, // "7d"} // 7 days
        )

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV == "production",
          })
        )

        return {account}
      }

      throw new UserInputError("Invalid email and password combination")
    },

    async signOut(_, args, {res}) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", "", {
          httpOnly: true,
          maxAge: -1,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV == "production",
        })
      )

      return true
    },
  },
}
