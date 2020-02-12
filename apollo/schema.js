import {gql} from "@apollo/client"
import {makeExecutableSchema} from "apollo-server-micro"
import * as account from "./account"
import * as post from "./post"

let typeDefs = gql`
  type Query {
    hello: String!
  }
  
  type Mutation {
    hello: String!
  }`

let resolvers = {
  Query: {
    hello: () => "HELLO",
  }
}

export let schema = makeExecutableSchema({
  typeDefs: [typeDefs, account.typeDefs, post.typeDefs],
  resolvers: [resolvers, account.resolvers, post.resolvers],
})
