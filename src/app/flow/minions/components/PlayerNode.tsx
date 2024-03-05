import React, { memo } from "react";

function PlayerNode({ data }: { data: { label: string } }) {
  return (
    <>
      <div
        style={{
          background: "#FFF",
          color: "#000",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          padding: 10,
          opacity: 0.8,
        }}
      >
        {data.label}
      </div>
    </>
  );
}

export default memo(PlayerNode);
