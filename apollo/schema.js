import gql from "graphql-tag"
import {makeExecutableSchema} from "graphql-tools"
import {typeDefs as accountTypedefs, resolvers as accountResolvers} from "./account"

let typedefs = gql`
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
  typeDefs: [typedefs, accountTypedefs],
  resolvers: [resolvers, accountResolvers],
})
