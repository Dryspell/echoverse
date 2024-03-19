import Grid from "@mui/material/Unstable_Grid2";
import SendIcon from "@mui/icons-material/Send";
import { Box, Fab, TextField, useTheme } from "@mui/material";
import useDetailedMutation from "~/hooks/useDetailedMutation";
import { api } from "convex/_generated/api";
import React, { useRef } from "react";

export default function NewChatMessageInput({
  roomId,
}: {
  roomId: string;
}) {
  const theme = useTheme();
  const { mutate: postMessage } = useDetailedMutation(
    api.messages.postMessage,
    {
      onSuccess: () => {
        console.log("Message sent");
      },
    },
  );
  const [message, setMessage] = React.useState("");

  const handlePostMessage = async () => {
    postMessage({ roomId, message });
    setMessage("");
  };

 
  return (
    <Box component="form">
      <Grid container>
        <Grid xs={10}>
          <TextField
            name="message"
            label="Chat..."
            fullWidth
            multiline
            sx={(theme) => ({
              m: 2,
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.background.paper,
            })}
            value={message}
            rows={2}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePostMessage().catch((e) => console.error(e));
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>
        <Grid
          xs={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          direction="row"
        >
          <Fab
            type="submit"
            name="send-message"
            sx={{
              "&.MuiButtonBase-root": { bgcolor: theme.palette.primary.main },
            }}
            color="primary"
            aria-label="send message"
            size="medium"
            onClick={handlePostMessage}
          >
            <SendIcon />
          </Fab>
        </Grid>
      </Grid>
    </Box>
  );
}
