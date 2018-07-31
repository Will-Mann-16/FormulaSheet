import { createApolloServer } from "meteor/apollo";
import { makeExecutableSchema } from "graphql-tools";
import merge from "lodash/merge";

import UsersSchema from "../../api/users/Users.graphql";
import UsersResolver from "../../api/users/resolvers";
import QuestionsSchema from "../../api/questions/Questions.graphql";
import QuestionsResolver from "../../api/questions/resolvers";
import EquationsSchema from "../../api/equations/Equations.graphql";
import EquationsResolver from "../../api/equations/resolvers";


// 24

const typeDefs = [
    QuestionsSchema,
    UsersSchema,
    EquationsSchema
  ];

const resolvers = merge(UsersResolver, QuestionsResolver, EquationsResolver);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

createApolloServer({schema});
