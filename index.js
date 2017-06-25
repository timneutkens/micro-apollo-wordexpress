const { parse } = require('url')

const { microGraphql, microGraphiql } = require('graphql-server-micro')
const { makeExecutableSchema } = require('graphql-tools')
const { WordExpressDefinitions, WordExpressDatabase, WordExpressResolvers } = require('wordexpress-schema')

const settings = require('./settings')

//returns WordExpressDatabase object that has provides connectors to the database;
const Database = new WordExpressDatabase(settings);
const Connectors = Database.connectors;

//Reolving functions that use the database connections to resolve GraphQL queries
const Resolvers = WordExpressResolvers(Connectors, settings.publicSettings);

//GraphQL schema definitions
const Definitions = WordExpressDefinitions;

const schema = makeExecutableSchema({
  typeDefs: Definitions,
  resolvers: Resolvers
});

module.exports = (req, res) => {
    const url = parse(req.url)
    if(settings.privateSettings.graphiQL && url.pathname === '/graphiql') {
        return microGraphiql({endpointURL: '/'})(req, res)
    }

    return microGraphql({ schema })(req, res)
}