import { gql, useSubscription } from "@apollo/client";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

const SUBSCRIPTION_QUERY = gql`
  subscription DestinationsSubscriptions {
    destinations(order_by: { votes: desc, created_at: desc }) {
      id
      imageUrl
      title
      votes
    }
  }
`;

export const DestinationsGallery = () => {
  const { data, loading } = useSubscription(SUBSCRIPTION_QUERY);
  if (loading) return <Skeleton />;

  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-16">
      {data?.destinations.map((destination: any) => (
        <Card key={destination.id} {...destination} />
      ))}
    </div>
  );
};
