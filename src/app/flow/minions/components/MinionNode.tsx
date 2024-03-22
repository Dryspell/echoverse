import React, { memo } from "react";
import { Handle, Position, type ReactFlowState, useStore } from "reactflow";
import Minion from "./Minion";

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function MinionNode({
  id,
  data,
}: {
  id: string;
  data: { label: string; headColor?: string; bodyColor?: string };
}) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;

  return (
    <div
      style={{
        position: "relative",
        alignItems: "center",
        textAlign: "center",
        borderRadius: "50%",
        opacity: 1,
        width: 35,
        height: 60,
      }}
    >
      <Minion
        headColor={data.headColor}
        bodyColor={data.bodyColor}
        style={{ scale: 0.1 }}
      />

      <div style={{ position: "absolute", top: 55 }}>{data.label}</div>
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

export default memo(MinionNode);
