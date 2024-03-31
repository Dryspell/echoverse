import { createTRPCRouter, publicProcedure } from "../trpc";
import { wrap } from "@typeschema/valibot";
import { object, string } from "valibot";
import { env } from "~/env";
import { OpenAI } from "openai";

export const openaiRouter = createTRPCRouter({
  generateImages: publicProcedure
    .input(wrap(object({ text: string() })))
    .mutation(async ({ input }) => {
      if (!env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

      const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

      const images = await openai.images
        .generate({
          model: "dall-e-3",
          prompt: input.text,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        })
        .catch((e: Error) => {
          console.error(e);
          throw e;
        });
      return {
        images,
      };
    }),
});
