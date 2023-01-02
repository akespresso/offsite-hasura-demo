import type { AppProps } from "next/app";
import "../styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
