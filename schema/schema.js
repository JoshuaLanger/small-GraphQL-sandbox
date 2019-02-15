const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// RIP temp hard-coded users DB, 2019-2019
// [...]

// This tells GraphQL what a 'company' object looks like
const CompanyType = new GraphQLObjectType({
  // 'name' and 'fields' are required
  name: 'Company',
  // This closure scope is not executed until later, meaning it won't throw an error that "UserType is not defined"
  fields: () => ({
    id: { type: GraphQLString }, // 'id' is of type 'string'
    name: { type: GraphQLString },
    tag: { type: GraphQLString },
    users: {
      // Returns a list of users
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
});

// This tells GraphQL what a 'user' object looks like
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }, // 'age' is of type 'int'
    company: {
      type: CompanyType,
      // This function returns the company object associated with this user
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
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
        // Return JSON from independent database
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      // Type of data that the mutation will RETURN
      type: UserType,
      args: {
        // GraphQLNonNull is like 'required' in that the data must be provided
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyID: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        axios
          .post('http://localhost:3000/users', { firstName, age })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        axios.delete(`http://localhost:3000/users/${id}`).then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
