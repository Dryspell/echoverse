import React from "react";
import {
  type ConnectionLineComponentProps,
  getStraightPath,
  useStore,
  type ReactFlowState,
} from "reactflow";

const connectionStartHandleSelector = (state: ReactFlowState) =>
  state.connectionStartHandle;
const nodesSelector = (state: ReactFlowState) => state.getNodes;

function MinionConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}: ConnectionLineComponentProps) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  const connectionStartHandle = useStore(connectionStartHandleSelector);
  const getNodes = useStore(nodesSelector);

  if (!connectionStartHandle) {
    return null;
  }
  const node = getNodes().find((n) => n.id === connectionStartHandle.nodeId);
  if (!node) {
    return null;
  }

  return (
    <g>
      <path
        strokeWidth={3}
        style={connectionLineStyle}
        stroke={node.type === "minion" ? "#f13" : "#222"}
        fill="none"
        className="animated"
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="white"
        r={3}
        stroke="white"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default MinionConnectionLine;
