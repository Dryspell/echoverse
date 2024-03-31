"use client";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import { Fragment, useState } from "react";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

const ImageDisplay = ({
  imageResponse,
}: {
  imageResponse: inferRouterOutputs<AppRouter>["openai"]["generateImages"]["images"];
}) => {
  return (
    <>
      <Typography>Images Generated</Typography>
      <>
        {imageResponse.data.map((datum, i) => (
          <div key={i}>
            <Typography>{datum.revised_prompt}</Typography>
            <Typography>{datum.url}</Typography>
            <div style={{ position: "relative", display: "flex" }}>
              {datum.url && (
                <Image
                  src={datum.url}
                  alt={datum.revised_prompt ?? "generated image"}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }} // optional
                />
              )}
            </div>
          </div>
        ))}
      </>
    </>
  );
};

export default function Dalle() {
  const [prompt, setPrompt] = useState<string>("");

  const { mutate: generateImages, isLoading: generateImagesLoading } =
    api.openai.generateImages.useMutation({
      onError: (error) => {
        console.error(error);
      },
      onSuccess: (data) => {
        setImageResponse(data.images);
      },
    });

  const [imageResponse, setImageResponse] =
    useState<
      inferRouterOutputs<AppRouter>["openai"]["generateImages"]["images"]
    >();

  return (
    <Box sx={{ p: 2, m: 2 }}>
      <Container>
        <Typography variant="h1">Dalle</Typography>
        <Box>
          <Stack spacing={2}>
            <TextField
              style={{ backgroundColor: "white" }}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                prompt && generateImages({ text: prompt });
              }}
            >
              Generate Images
            </Button>
            {generateImagesLoading && <LinearProgress />}
          </Stack>
        </Box>
      </Container>
      {!generateImagesLoading && imageResponse && (
        <ImageDisplay imageResponse={imageResponse} />
      )}
    </Box>
  );
}
