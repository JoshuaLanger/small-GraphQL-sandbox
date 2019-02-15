const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// Do this when the URL ends in '/graphql'
app.use(
  '/graphql',
  expressGraphQL({
    schema, // Use root query defined in schema.js
    graphiql: true // Dev tool for client-side GraphQL queries
  })
);

app.listen(4000, () => {
  console.log('Listening...');
});
