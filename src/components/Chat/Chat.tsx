import { Box, Skeleton } from "@mui/material";
import ChatBox from "./ChatBox";
import { type Doc } from "convex/_generated/dataModel";
import React from "react";

export default function Chat({
  room,
  roomLoading,
}: {
  room: Doc<"rooms"> | undefined;
  roomLoading: boolean;
}) {
  const lastMessageRef = React.useRef<HTMLDivElement>(null);

  return (
    <Box
      sx={(theme) => ({
        position: "fixed",
        display: "flex",
        flexDirection: "column-reverse",
        float: "right",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        padding: 2,
        maxWidth: "calc(40vw - 20px)", // Adjust as needed
        maxHeight: "calc(40vh - 20px)", // Adjust as needed
      })}
    >
      {roomLoading ? (
        <Skeleton />
      ) : (
        <>
          {room && <ChatBox roomId={room.id} lastMessageRef={lastMessageRef} />}
        </>
      )}
    </Box>
  );
}
