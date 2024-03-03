const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();

const users = [
  { tokenId: 778, email: "firyal@gmail.com", memberNo: 3, name: "Firyal" },
  { tokenId: 879, email: "farhan@gmail.com", memberNo: 2, name: "Farhan" },
  { tokenId: 999, email: "elina@gmail.com", memberNo: 1, name: "Elina" },
];

const posts = [
  { id: 1, memberNo: 3, amount: 50000 },
  { id: 2, memberNo: 2, amount: 60000 },
  { id: 3, memberNo: 1, amount: 70000 },
  { id: 4, memberNo: 1, amount: 80000 },
  { id: 5, memberNo: 3, amount: 90000 },
];

const cors = require("cors");

app.use(cors());

const UserType = new GraphQLObjectType({
  name: "Users",
  description: "This represents Users",
  fields: () => ({
    tokenId: { type: new GraphQLNonNull(GraphQLInt) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    memberNo: { type: new GraphQLNonNull(GraphQLInt) },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user) => {
        return posts.filter((post) => post.memberNo === user.memberNo);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "This represents Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    memberNo: { type: new GraphQLNonNull(GraphQLInt) },
    users: {
      type: new GraphQLList(UserType),
      resolve: (post) => {
        return users.filter((user) => user.memberNo === post.memberNo);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    getAllUsers: {
      type: new GraphQLList(UserType),
      description: "List of the Users",
      resolve: () => users,
    },
    getUserById: {
      type: UserType,
      description: "A single user",
      args: {
        memberNo: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        users.find((user) => user.memberNo === args.memberNo),
    },
    getAllPosts: {
      type: new GraphQLList(PostType),
      description: "List of the Posts",
      resolve: () => posts,
    },
    getPostById: {
      type: PostType,
      description: "A Single Post",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => posts.find((post) => post.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addUser: {
      type: UserType,
      description: "Add a User",
      args: {
        // tokenId: { type: new GraphQLNonNull(GraphQLInt) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        // memberNo: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const user = {
          // tokenId: args.tokenId,
          name: args.name,
          email: args.email,
          memberNo: users.length + 1,
        };
        users.push(user);
        return user;
      },
    },
    addPosts: {
      type: PostType,
      description: "Add a Post",
      args: {
        amount: { type: new GraphQLNonNull(GraphQLInt) },
        memberNo: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const post = {
          id: posts.length + 1,
          amount: args.amount,
          memberNo: args.memberNo,
        };
        posts.push(post);
        return post;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => console.log("Server Running"));

// {
//   users{
//     email
//     memberNo
//     name
//     posts{
//       memberNo
//       amount
//       id
//     }
//   }

//   posts{
//     id
//     memberNo
//     amount
//     users{
//       memberNo
//       name
//     }
//   }
// }

// mutation{
//   addUser(name:"ilyas", email: "ilyas"){
//     name
//     memberNo
//     email
//   }
// }
