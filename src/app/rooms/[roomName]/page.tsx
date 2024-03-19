"use client";
import { Box, Skeleton, useTheme } from "@mui/material";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import Chat from "~/components/Chat/Chat";
import ChatBox from "~/components/Chat/ChatBox";
import useDetailedQuery from "~/hooks/useDetailedQuery";
import usePresence from "~/hooks/usePresence";
import useStableDbUser from "~/hooks/useStableDbUser";

export default function GameRoomPage({
  params,
}: {
  params: { roomName: string };
}) {
  const router = useRouter();
  const user = useStableDbUser();
  const { data: room, isLoading: roomLoading } = useDetailedQuery(
    api.rooms.getByName,
    {
      name: params.roomName ?? "",
    },
  );
  const { presence } = usePresence(room?.id ?? "", user?.id ?? "", {});

  if (!params.roomName) {
    router.push("/rooms");
    return (
      <div>
        You seem lost, can you go back to the <a href="/rooms">Rooms</a> page?
      </div>
    );
  }

  return (
    <Box>
      <div className="border-2 border-sky-200">
        <pre>{JSON.stringify({ user }, null, 2)}</pre>
      </div>
      <div className="border-2 border-sky-200">
        <pre>{JSON.stringify({ presence }, null, 2)}</pre>
      </div>
      <div className="border-2 border-sky-200">
        <p>Room ID: {params.roomName}</p>
        <pre>{JSON.stringify({ room }, null, 2)}</pre>
      </div>

      <Chat room={room} roomLoading={roomLoading} />
    </Box>
  );
}
