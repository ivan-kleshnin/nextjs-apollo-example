import {makeExecutableSchema} from "graphql-tools"
import {typeDefs as accountTypeDefs, resolvers as accountResolvers} from "./account"

export let schema = makeExecutableSchema({
  typeDefs: [accountTypeDefs],
  resolvers: [accountResolvers],
})
