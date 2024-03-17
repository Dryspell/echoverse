import Grid from "@mui/material/Unstable_Grid2";
import SendIcon from "@mui/icons-material/Send";
import { Fab, TextField } from "@mui/material";
import useDetailedMutation from "~/hooks/useDetailedMutation";
import { api } from "convex/_generated/api";

export default function NewChatMessageInput({ roomId }: { roomId: string }) {
  const { mutate: postMessage } = useDetailedMutation(
    api.messages.postMessage,
    {
      onSuccess: () => {
        console.log("Message sent");
      },
    },
  );

  return (
    <Grid container>
      <Grid xs={11}>
        <TextField
          label="Type Something"
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
      <Grid
        xs={1}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        direction="row"
      >
        <Fab
          color="primary"
          aria-label="send message"
          size="small"
          onClick={() => {
            postMessage({ roomId, message: "Hello" });
          }}
        >
          <SendIcon />
        </Fab>
      </Grid>
    </Grid>
  );
}
