import Grid from "@mui/material/Unstable_Grid2";
import ChatMessage from "./ChatMessage";
import SendIcon from "@mui/icons-material/Send";
import { Divider, Fab, TextField } from "@mui/material";
import { usePaginatedQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { type Doc } from "convex/_generated/dataModel";
import useStableDbUser from "~/hooks/useStableDbUser";
import NewChatMessageInput from "./NewChatMessageInput";

export default function ChatBox({ roomId }: { roomId: string }) {
  const { results: messages } = usePaginatedQuery(
    api.messages.getByRoomId,
    { roomId },
    {
      initialNumItems: 10,
    },
  );

  const user = useStableDbUser();

  const messageChunks = messages.reduce(
    (acc, message, i) => {
      if (message.userId === messages[i - 1]?.userId) {
        acc[acc.length - 1]!.push(message);
      } else {
        acc.push([message]);
      }
      return acc;
    },
    [] as (typeof messages)[],
  );

  return (
    <Grid>
      <div>
        {messageChunks.map((chunk, i) => {
          return (
            <ChatMessage
              key={i}
              avatar={chunk[0]?.user?.pictureUrl ?? ""}
              messages={chunk}
              side={chunk[0]?.userId === user?.id ? "left" : "right"}
            />
          );
        })}
      </div>

      <Divider />
      <NewChatMessageInput roomId={roomId} />
    </Grid>
  );
}
