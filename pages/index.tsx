import Head from "next/head";
import { DestinationsGallery } from "../components/DestinationsGallery";
import { DestinationSubmissionForm } from "../components/DestinationSubmissionForm";
import { Header } from "../components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Travel Ideation</title>
        <meta name="description" content="Travel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="lg:container lg:mx-auto px-8">
        <Header />
        <DestinationSubmissionForm />
        <DestinationsGallery />
      </main>
    </>
  );
}
