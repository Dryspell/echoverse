import React, { memo } from "react";
import { Handle, Position, type ReactFlowState, useStore } from "reactflow";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function DestinationNode({
  // id,
  data,
}: {
  id: string;
  data: { label: string };
}) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;
  // const isTarget = connectionNodeId && connectionNodeId !== id;

  return (
    <div
      style={{
        background: "#FF7",
        color: "#000",
        borderRadius: "50%",
        display: "flex",
        position: "relative",
        alignItems: "center",
        textAlign: "center",
        padding: 10,
        // width: 100,
        // height: 50,
        opacity: 0.8,
      }}
    >
      <GpsFixedIcon />
      {/* {data.label} */}
      {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
      {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
      {!isConnecting && (
        <Handle
          style={{
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
          }}
          className="minionHandle"
          position={Position.Right}
          type="source"
        />
      )}

      <Handle
        style={{
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
        }}
        className="minionHandle"
        position={Position.Left}
        type="target"
        isConnectableStart={false}
      />
    </div>
  );
}

export default memo(DestinationNode);
