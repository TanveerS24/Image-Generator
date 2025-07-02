import * as dotenv from "dotenv";
import { createError } from "../error.js";
import axios from "axios";

dotenv.config();

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return next(createError(400, "Prompt is required"));
    }

    console.log("Generating image from Stability AI:", prompt);

    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7, // creativity/accuracy tradeoff
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
      }
    );

    const base64Image = response.data.artifacts[0].base64;
    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error("Stability API error:", error?.response?.data || error.message);
    next(
      createError(
        error.status || 500,
        error?.response?.data?.error?.message || error.message
      )
    );
  }
};