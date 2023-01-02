import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const SUBSCRIPTION_URL = process.env
  .NEXT_PUBLIC_HASURA_SUBSCRIPTION_URL as string;
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_URL as string;

// WorkAround?
console.log(process.env.HASURA_SUBSCRIPTION_URL);
const wsLink = () => new GraphQLWsLink(createClient({ url: SUBSCRIPTION_URL }));
const httpLink = new HttpLink({ uri: HASURA_URL });

const client = new ApolloClient({
  link: typeof window === "undefined" ? httpLink : wsLink(),
  cache: new InMemoryCache(),
});

export default client;
