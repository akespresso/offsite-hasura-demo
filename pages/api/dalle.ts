// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import client from "../../lib/client";

type Data = {
  imageUrl: string | undefined | null;
};

const configuration = new Configuration({ apiKey: process.env.DALLE_API_KEY });
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const item = req.body.event.data.new;
  const { title, id } = item;
  const prompt = `A photo of ${title.toLowerCase()}`;
  const image = await openai.createImage({
    prompt,
    n: 1,
    size: "512x512",
  });

  const imageUrl = image.data.data[0].url ?? null;

  await client.mutate({ mutation: ADD_IMAGE, variables: { id, imageUrl } });
  return res.status(200).json({ imageUrl });
}

const ADD_IMAGE = gql`
  mutation AddImage($id: uuid!, $imageUrl: String!) {
    update_destinations_by_pk(
      pk_columns: { id: $id }
      _set: { imageUrl: $imageUrl }
    ) {
      votes
    }
  }
`;
