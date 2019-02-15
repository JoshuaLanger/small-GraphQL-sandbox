const express = require('express');
const expressGraphQL = require('express-graphql');

const app = express();

// Do this when the URL ends in '/graphql'
app.use('/graphql', expressGraphQL({
    graphiql: true  // Dev tool for client-side GraphQL queries
}))

app.listen(4000, () => {
  console.log('Listening...');
});
