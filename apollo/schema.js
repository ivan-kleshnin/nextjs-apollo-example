import gql from "graphql-tag"
import {makeExecutableSchema} from "graphql-tools"
import * as account from "./account"

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
  typeDefs: [typeDefs, account.typeDefs],
  resolvers: [resolvers, account.resolvers],
})
