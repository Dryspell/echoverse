import { useCallback } from "react";
import { useStore, getBezierPath, type EdgeProps, getStraightPath } from "reactflow";

import { getEdgeParams } from "../utils/utils";

function FloatingEdge({ id, source, target, markerEnd, style }: EdgeProps) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  // const [edgePath] = getBezierPath({
  //   sourceX: sx,
  //   sourceY: sy,
  //   sourcePosition: sourcePos,
  //   targetPosition: targetPos,
  //   targetX: tx,
  //   targetY: ty,
  // });

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      markerEnd={markerEnd}
      style={style}
      d={edgePath}
    />
  );
}

export default FloatingEdge;
