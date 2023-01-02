import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import client from "../../lib/client";

type Data = { success: boolean };

const configuration = new Configuration({ apiKey: process.env.DALLE_API_KEY });
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const item = req.body.event.data.new;
  const { title, id } = item;

  const imageUrl = await generateImage(title);

  const response = await client.mutate({
    mutation: ADD_IMAGE,
    variables: { id, imageUrl },
  });

  const success = response?.errors != undefined;
  return res.status(200).json({ success });
}

const generateImage = async (title: string) => {
  const prompt = `A photo of ${title.toLowerCase()}`;
  const size = "512x512";
  const n = 1;
  const image = await openai.createImage({ prompt, n, size });

  return image.data.data[0].url ?? null;
};

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
