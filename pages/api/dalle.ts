import { gql } from "@apollo/client";
const cloudinary = require("cloudinary").v2;

import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import client from "../../lib/client";

type Data = { success: boolean };

const configuration = new Configuration({ apiKey: process.env.DALLE_API_KEY });
const openai = new OpenAIApi(configuration);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const item = req.body.event.data.new;
  const { title, id } = item;

  const imageUrl = await generateImage(title);
  const cloudinaryResponse = await cloudinary.v2.uploader.upload(imageUrl);
  const url = cloudinaryResponse.url;

  const response = await client.mutate({
    mutation: ADD_IMAGE,
    variables: { id, imageUrl: url },
  });

  const success = response?.errors != undefined;
  return res.status(200).json({ success });
}

const generateImage = async (title: string) => {
  const prompt = `A photo of ${title.toLowerCase()}`;
  const size = "512x512";
  const n = 1;
  const image = await openai.createImage({ prompt, n, size });

  return image.data.data[0].url ?? "";
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
