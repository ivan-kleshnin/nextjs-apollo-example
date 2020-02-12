import {UserInputError} from "apollo-server-micro"
import cookie from "cookie"
import gql from "graphql-tag"
import JWT from "jsonwebtoken" // TODO too big, replace
import UUID from "uuid/v4"
import * as DB from "../db"
// import {fetchJSON} from "../lib"

function makePost(data) {
  return {
    id: UUID(),
    ...data,
  }
}

export let typeDefs = gql`
  type Post {
    id: ID!
    title: String!
  }

  input CreatePostInput {
    title: String!
  }

  input UpdatePostInput {
    title: String!
  }

  type PostPayload {
    post: Post!
  }

  extend type Query {
    post(id: ID!): Post!
    posts: [Post]!
  }

  extend type Mutation {
    createPost(input: CreatePostInput!): PostPayload!
    updatePost(id: ID!, input: UpdatePostInput!): PostPayload!
  }`

export let resolvers = {
  Query: {
    async me(_, {}, {visitor}) {
      return visitor
    },

    async post(_, {id}, {}) {
      let db = DB.read()
      return db.posts.find(post => post.id == id)
    },

    async posts(_, {}, {}) {
      let db = DB.read()
      return db.posts
    },
  },

  Mutation: {
    async createPost(_, {input}, {}) {
      let db = DB.read()

      let post = makePost(input)

      DB.write({posts: [...db.posts, post]})

      return {post}
    },

    async updatePost(_, {id, input}, {}) {
      let db = DB.read()
      let oldPost = db.posts.find(post => post.id == id)
      if (!oldPost) {
        throw new Error("Post not found") // TODO error type?
      }

      let newPost = {...oldPost, ...input}

      let posts = db.posts.map(post => post.id == newPost.id ? newPost : post)

      DB.write({posts})

      return {post: newPost}
    },
  },
}
