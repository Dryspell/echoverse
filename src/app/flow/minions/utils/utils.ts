import {
  Position as FlowPosition,
  MarkerType,
  type Node,
  type Edge,
} from "reactflow";
import { randFirstName } from "@ngneat/falso";

type Position = { x: number; y: number };
export const getSquareDistance = (
  startPosition: Position,
  endPosition: Position,
) => {
  return (
    (endPosition.x - startPosition.x) ** 2 +
    (endPosition.y - startPosition.y) ** 2
  );
};
export const getNormalizedDirection = (
  startPosition: Position,
  endPosition: Position,
) => {
  const direction = {
    x: endPosition.x - startPosition.x,
    y: endPosition.y - startPosition.y,
  };
  const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
  return {
    x: direction.x / length,
    y: direction.y / length,
    length,
  };
};

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode: Node, targetNode: Node) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;

  if (!intersectionNodePosition) return { x: 0, y: 0 };
  const targetPosition = targetNode.positionAbsolute;
  if (!targetPosition) return { x: 0, y: 0 };

  const w = (intersectionNodeWidth ?? 0) / 2;
  const h = (intersectionNodeHeight ?? 0) / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + (targetNode.width ?? 0) / 2;
  const y1 = targetPosition.y + (targetNode.height ?? 0) / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(
  node: Node,
  intersectionPoint: { x: number; y: number },
) {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x ?? 0);
  const ny = Math.round(n.y ?? 0);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return FlowPosition.Left;
  }
  if (px >= nx + (n.width ?? 0) - 1) {
    return FlowPosition.Right;
  }
  if (py <= ny + 1) {
    return FlowPosition.Top;
  }
  if (py >= (n.y ?? 0) + (n.height ?? 0) - 1) {
    return FlowPosition.Bottom;
  }

  return FlowPosition.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node, target: Node) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

export function createCircularArrayOfNodes({
  nodesCount = 8,
  center = defaultCenter(),
  distanceFromCenter = 400,
}: {
  nodesCount?: number;
  center?: { x: number; y: number };
  distanceFromCenter?: number;
}) {
  const nodes: Node[] = Array.from({ length: nodesCount }, (_, i) => {
    const degrees = i * (360 / nodesCount);
    const radians = degrees * (Math.PI / 180);
    const x = distanceFromCenter * Math.cos(radians) + center.x;
    const y = distanceFromCenter * Math.sin(radians) + center.y;
    return {
      id: `${i}`,
      data: { label: randFirstName() },
      position: { x, y },
      type: "player",
    };
  });
  return nodes;
}

const defaultCenter = () =>
  typeof window !== "undefined"
    ? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }
    : {
        x: 400,
        y: 300,
      };

export function createMinionNodes({
  minionCount,
  center = defaultCenter(),
  nodesCount = 8,
  distanceFromCenter = 400,
  parentOffset = 75,
}: {
  minionCount: number;
  nodesCount?: number;
  center?: { x: number; y: number };
  distanceFromCenter?: number;
  parentOffset?: number;
}) {
  const maxDistance = (minionCount - 1) / minionCount;
  // [0, 1 / 3, 2 / 3].map((i) => (i - maxDistance) / 2) === [-1/6, 0, 1/6];

  const centeredAroundMiddle = Array.from(
    { length: minionCount },
    (_, i) => (i / minionCount - maxDistance / 2) / 2,
  );
  // console.log({ maxDistance, centeredAroundMiddle });

  const nodes: Node[] = Array.from({ length: nodesCount }, (_, i) => {
    return centeredAroundMiddle.map((offset, minionIndex) => {
      const degrees = (i + offset) * (360 / nodesCount);
      const radians = degrees * (Math.PI / 180);
      const x =
        (distanceFromCenter - parentOffset) * Math.cos(radians) + center.x;
      const y =
        (distanceFromCenter - parentOffset) * Math.sin(radians) + center.y;

      return {
        id: `minion_${i}_${minionIndex}`,
        data: { label: randFirstName() },
        position: { x, y },
        type: "minion",
      };
    });
  }).flat();

  return nodes;
}
