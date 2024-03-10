"use client";
// import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import { usePaginatedQuery } from "convex/react";
import Masonry from "@mui/lab/Masonry";
import {
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import React from "react";
import CreateRoomModal from "./CreateRoomModal";
import { api } from "convex/_generated/api";

const RoomCard = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Card
      sx={{
        width: 200,
        height: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardActionArea
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClick}
      >
        <CardContent sx={{ width: "90%", height: "90%" }}>
          {children}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default function RoomPage() {
  const [createRoomModalOpen, setCreateRoomModalOpen] = React.useState(false);

  const {
    results: rooms,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.rooms.list,
    {},
    {
      initialNumItems: 10,
    },
  );

  return (
    <Container>
      <Typography variant="h1">Rooms</Typography>
      <CreateRoomModal
        open={createRoomModalOpen}
        setOpen={setCreateRoomModalOpen}
      />
      <Masonry columns={4} spacing={2}>
        <RoomCard onClick={() => setCreateRoomModalOpen(true)}>
          <AddIcon sx={{ width: "100%", height: "100%" }} />
        </RoomCard>
        {rooms.map((room) => (
          <RoomCard key={room.id}>{room.name}</RoomCard>
        ))}
      </Masonry>
    </Container>
  );
}
