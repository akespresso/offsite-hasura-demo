import { gql, useMutation } from "@apollo/client";
import Image from "next/image";

const VOTE_MUTATION = gql`
  mutation AddVote($id: uuid!) {
    update_destinations_by_pk(pk_columns: { id: $id }, _inc: { votes: 1 }) {
      votes
    }
  }
`;

type CardProps = {
  imageUrl: string;
  title: string;
  id: string;
  votes: number;
};

export const Card = (props: CardProps) => {
  const { imageUrl, title, votes } = props;

  const [addVote] = useMutation(VOTE_MUTATION);
  const handleVote = () => addVote({ variables: { id: props.id } });

  const DestinationImage = () => {
    if (!imageUrl) {
      return (
        <div className="grid place-items-center animate-pulse">
          <span>Generating Image</span>
        </div>
      );
    }

    return (
      <Image
        src={imageUrl}
        alt={title}
        width={512}
        height={512}
        className="rounded-lg"
      />
    );
  };

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

      <DestinationImage />
    </div>
  );
};
