import React from "react";
import { Typography, Avatar, Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { type Doc } from "convex/_generated/dataModel";

export default function ChatMessage({
  avatar = "",
  messages = [],
  side = "left",
}: {
  avatar: string;
  messages: Doc<"messages">[];
  side: "left" | "right";
}) {
  return (
    <Grid
      container
      spacing={1}
      sx={{ justify: side === "right" ? "flex-end" : "flex-start" }}
    >
      {side === "left" && (
        <Grid xs={1}>
          <Avatar
            src={avatar}
            sx={(theme) => ({
              width: theme.spacing(4),
              height: theme.spacing(4),
            })}
          />
        </Grid>
      )}
      <Grid xs={11}>
        {messages.map((msg, i) => {
          return (
            <Box
              key={msg._id || i}
              sx={{
                textAlign: side,
              }}
            >
              <Typography
                align={side}
                sx={(theme) => ({
                  padding: theme.spacing(1, 2),
                  borderRadius: 4,
                  marginBottom: 4,
                  display: "inline-block",
                  wordBreak: "break-word",
                  fontFamily:
                    // eslint-disable-next-line max-len
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  fontSize: "14px",
                  ...(side === "left"
                    ? {
                        borderTopRightRadius: theme.spacing(2.5),
                        borderBottomRightRadius: theme.spacing(2.5),
                        backgroundColor: theme.palette.grey[100],
                        color: theme.palette.text.secondary,
                      }
                    : {
                        borderTopLeftRadius: theme.spacing(2.5),
                        borderBottomLeftRadius: theme.spacing(2.5),
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white,
                      }),
                  ...(i === 0 && side === "left"
                    ? { borderTopLeftRadius: theme.spacing(2.5) }
                    : {}),
                  ...(i === messages.length - 1 && side === "left"
                    ? { borderBottomLeftRadius: theme.spacing(2.5) }
                    : {}),
                  ...(i === 0 && side === "right"
                    ? { borderTopRightRadius: theme.spacing(2.5) }
                    : {}),
                  ...(i === messages.length - 1 && side === "right"
                    ? { borderBottomRightRadius: theme.spacing(2.5) }
                    : {}),
                })}
              >
                {msg.message}
              </Typography>
            </Box>
          );
        })}
      </Grid>
      {side === "right" && (
        <Grid xs={1}>
          <Avatar src={avatar} />
        </Grid>
      )}
    </Grid>
  );
}
