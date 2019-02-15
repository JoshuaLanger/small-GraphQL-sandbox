const graphql = require('graphql');
const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

// Temp hardcoded database of users
const users = [
  {
    id: '1',
    firstName: 'BillyBob',
    age: 19
  },
  {
    id: '2',
    firstName: 'BobbyBill',
    age: 26
  },
  {
    id: '3',
    firstName: 'BillyJean',
    age: 43
  },
  {
    id: '4',
    firstName: 'SusieRay',
    age: 56
  },
  {
    id: '5',
    firstName: 'DollySue',
    age: 67
  }
];

// This tells GraphQL what a 'user' object looks like
const UserType = new GraphQLObjectType({
  // 'name' and 'fields' are required
  name: 'User',
  fields: {
    id: { type: GraphQLString }, // 'id' is of type 'string'
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt } // 'age' is of type 'int'
  }
});

// Root Query - starting point for query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // GraphQL will return a user query if given the ID
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      // This function reaches out to grab the data
      resolve(parentValue, args) {
        // Use lodash to walk through users object and return user object that matches given ID
        return _.find(users, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
