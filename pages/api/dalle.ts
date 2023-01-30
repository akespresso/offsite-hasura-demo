import { gql } from "@apollo/client";
import cloudinary from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, CreateImageRequest, OpenAIApi } from "openai";
import client from "../../lib/client";

type Data = { success: boolean };

const openAIConfig = new Configuration({ apiKey: process.env.DALLE_API_KEY });
const openai = new OpenAIApi(openAIConfig);
cloudinary.v2.config({ secure: true });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Parse the JSON submitted from a Hasura trigger
  const item = req.body.event.data.new;
  const { title, id } = item as { title: string; id: string };

  // Generate image based on submitted activity
  const prompt = `A photo of ${title.toLowerCase()}`;
  const dalleVars: CreateImageRequest = { prompt, n: 1, size: "512x512" };
  const dalleResult = await openai.createImage(dalleVars);
  const dalleUrl = dalleResult.data.data[0].url ?? "";

  // Upload image to cloudinary for permanent storage
  const { url } = await cloudinary.v2.uploader.upload(dalleUrl);

  // Prepare and send mutation to Hasura
  const variables = { id, imageUrl: url };
  const response = await client.mutate({ mutation: ADD_IMAGE, variables });

  const success = response?.errors != undefined;
  return res.status(200).json({ success });
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
