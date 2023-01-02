import { gql, useMutation, useSubscription } from "@apollo/client";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const SUBSCRIPTION_QUERY = gql`
  subscription MySubscription {
    destinations(order_by: { votes: desc, created_at: desc }) {
      id
      imageUrl
      title
      votes
    }
  }
`;

const VOTE_MUTATION = gql`
  mutation AddVote($id: uuid!) {
    update_destinations_by_pk(pk_columns: { id: $id }, _inc: { votes: 1 }) {
      votes
    }
  }
`;

const ADD_DESTINATION_MUTATION = gql`
  mutation AddDestination($title: String!) {
    insert_destinations_one(object: { title: $title }) {
      id
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useSubscription(SUBSCRIPTION_QUERY);

  return (
    <>
      <Head>
        <title>Travel Ideation</title>
        <meta name="description" content="Travel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto">
        <div className="sticky top-0 bg-white/50 z-10 backdrop-blur-lg rounded-lg">
          <h1 className="text-5xl py-8 font-extrabold text-center ">
            Travel Ideas for 2023
          </h1>
        </div>

        <DestinationSubmission />

        <div className="grid lg:grid-cols-4 grid-cols-1 gap-16">
          {data?.destinations.map((destination: any) => (
            <Card key={destination.id} {...destination} />
          ))}
        </div>
      </main>
    </>
  );
}

const DestinationSubmission = () => {
  const [destination, setDestination] = useState("");
  const [addDestination] = useMutation(ADD_DESTINATION_MUTATION);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addDestination({
      variables: {
        title: destination,
      },
    });
    setDestination("");
  };

  return (
    <div className="my-16 flex items-center justify-center w-full">
      <form className="flex space-x-2" onSubmit={handleSubmit}>
        <input
          className="p-4 w-96 text-center text-3xl font-semibold border rounded"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where should I go?"
        />

        <button type="submit" className="text-3xl">
          🚀
        </button>
      </form>
    </div>
  );
};

type CardProps = {
  imageUrl: string;
  title: string;
  id: string;
  votes: number;
};

const Card = (props: CardProps) => {
  const { imageUrl, title, votes } = props;

  const [addVote] = useMutation(VOTE_MUTATION);
  const handleVote = () => addVote({ variables: { id: props.id } });

  return (
    <div>
      <div className="flex justify-between items-center pb-2">
        <h2 className="font-bold text-2xl">{title}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-right text-gray-400">{votes}</span>
          <button
            className="-rotate-90 text-blue-200 hover:text-blue-800 active:text-orange-600 text-3xl"
            onClick={handleVote}
          >
            ➤
          </button>
        </div>
      </div>

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Lake Tahoe"
          width={512}
          height={512}
          className="rounded-lg"
        />
      ) : (
        <div className="grid place-items-center animate-pulse">
          <span>Generating Image</span>
        </div>
      )}
    </div>
  );
};
