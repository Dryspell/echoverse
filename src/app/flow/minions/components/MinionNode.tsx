import React, { memo } from "react";
import { Handle, Position, type ReactFlowState, useStore } from "reactflow";
import Minion from "./Minion";

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function MinionNode({ id, data }: { id: string; data: { label: string } }) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;

  return (
    <div>
      <div
        style={{
          background: "#f32",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Minion style={{ scale: 0.1 }}>
          <div
            // className="minionNodeBody"
            style={{
              background: "#FF7A59",
              borderRadius: "50%",
              // position: "absolute",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              padding: 10,
              opacity: 0, // 0.8,
            }}
          >
            {data.label}
          </div>
        </Minion>
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
        {!isConnecting && (
          <Handle
            className="minionHandle"
            position={Position.Right}
            type="source"
          />
        )}

        <Handle
          className="minionHandle"
          position={Position.Left}
          type="target"
          isConnectableStart={false}
        />
      </div>
    </div>
  );
}

export default memo(MinionNode);
