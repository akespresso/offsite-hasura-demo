import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";

const ADD_DESTINATION_MUTATION = gql`
  mutation AddDestination($title: String!) {
    insert_destinations_one(object: { title: $title }) {
      id
    }
  }
`;

export const DestinationSubmissionForm = () => {
  const [destination, setDestination] = useState("");
  const [addDestination] = useMutation(ADD_DESTINATION_MUTATION);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const variables = { title: destination };

    addDestination({ variables });
    setDestination("");
  };

  return (
    <div className="my-16 flex items-center justify-center w-full">
      <form
        className="flex lg:space-x-2 space-x-0 space-y-1 lg:space-y-0 lg:flex-row flex-col"
        onSubmit={handleSubmit}
      >
        <input
          className="p-4 lg:w-96 w-full text-center text-3xl font-semibold border rounded"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where should we go?"
        />

        <button type="submit" className="text-3xl">
          🚀
        </button>
      </form>
    </div>
  );
};
