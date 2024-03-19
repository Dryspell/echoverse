import Grid from "@mui/material/Unstable_Grid2";
import ChatMessage from "./ChatMessage";
import SendIcon from "@mui/icons-material/Send";
import { Box, Divider, Fab, TextField } from "@mui/material";
import { usePaginatedQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { type Doc } from "convex/_generated/dataModel";
import useStableDbUser from "~/hooks/useStableDbUser";
import NewChatMessageInput from "./NewChatMessageInput";
import React from "react";

export default function ChatBox({
  roomId,
  lastMessageRef,
}: {
  roomId: string;
  lastMessageRef: React.RefObject<HTMLDivElement>;
}) {
  const { results: messages } = usePaginatedQuery(
    api.messages.getByRoomId,
    { roomId },
    {
      initialNumItems: 10,
    },
  );

  const user = useStableDbUser();

  const messageChunks = messages
    .sort((a, b) => a.timestamp - b.timestamp)
    .reduce(
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

  const scrollToBottom = React.useCallback(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [lastMessageRef]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <Box sx={{ maxHeight: "100%" }}>
      <Grid>
        <Box
          sx={{
            position: "relative",
            paddingX: 4,
            maxHeight: "calc(35vh - 20px)",
            overflowY: "scroll",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              outline: "1px solid slategrey",
            },
          }}
        >
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
          <div ref={lastMessageRef} />
        </Box>

        <Divider />
        <Box>
          <NewChatMessageInput
            roomId={roomId}
          />
        </Box>
      </Grid>
    </Box>
  );
}
