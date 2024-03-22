"use client";

import React, {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useRef,
  type TouchEvent as ReactTouchEvent,
} from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Connection,
  type Edge,
  useStore,
  useReactFlow,
  type OnConnectStartParams,
  OnConnectEnd,
  getOutgoers,
  getIncomers,
  getConnectedEdges,
} from "reactflow";
import "reactflow/dist/style.css";

import "../utils/styles.css";
import {
  createCircularArrayOfNodes,
  createMinionNodes,
  getNormalizedDirection,
} from "../utils/utils";
import FloatingEdge from "./FloatingEdge";
import FloatingConnectionLine from "./FloatingConnection";
import MinionNode from "./MinionNode";
import PlayerNode from "./PlayerNode";
import MinionConnectionLine from "./MinionConnectionLine";
import DestinationNode from "./DestinationNode";

const edgeTypes = {
  floating: FloatingEdge,
};
const nodeTypes = {
  minion: MinionNode,
  player: PlayerNode,
  destination: DestinationNode,
};

const initialNodes = () => {
  const playerNodes = createCircularArrayOfNodes({
    nodesCount: 8,
  });

  const minionNodes = createMinionNodes({
    minionCount: 3,
    nodesCount: playerNodes.length,
  });

  return [...playerNodes, ...minionNodes];
};

type NodeData = { label: string; toDelete?: boolean };
const movementSpeed = 3;

const Flow = ({ tick }: { tick: number }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] =
    useNodesState<NodeData>(initialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [destinationCount, setDestinationCount] = React.useState(0);

  //? This handles updates for each tick
  React.useEffect(() => {
    let newEdges = [...edges];
    let hasDeleted = false;

    setNodes(
      nodes
        .map((node) => {
          if (node.type === "minion") {
            const existingDestinationNode = getOutgoers(node, nodes, edges)[0];
            if (existingDestinationNode) {
              const normalizedDirection = getNormalizedDirection(
                node.position,
                existingDestinationNode.position,
              );
              if (normalizedDirection.length <= movementSpeed) {
                existingDestinationNode.data.toDelete = true;
                hasDeleted = true;
                const incomers = getIncomers(
                  existingDestinationNode,
                  nodes,
                  edges,
                );
                const outgoers = getOutgoers(
                  existingDestinationNode,
                  nodes,
                  edges,
                );
                const connectedEdges = getConnectedEdges(
                  [existingDestinationNode],
                  edges,
                );
                const remainingEdges = newEdges.filter(
                  (edge) => !connectedEdges.includes(edge),
                );

                const createdEdges = incomers.flatMap(({ id: source }) =>
                  outgoers.map(({ id: target }) => ({
                    id: `${source}->${target}`,
                    source,
                    target,
                    type: "floating",
                    style: { stroke: "#f13", strokeWidth: 3 },
                    markerEnd: { type: MarkerType.Arrow },
                  })),
                );
                newEdges = [...remainingEdges, ...createdEdges];
              }
              return {
                ...node,
                position: {
                  x: Math.round(
                    node.position.x + normalizedDirection.x * movementSpeed,
                  ),
                  y: Math.round(
                    node.position.y + normalizedDirection.y * movementSpeed,
                  ),
                },
              };
            }
          }
          return node;
        })
        .filter((node) => !node.data.toDelete),
    );
    hasDeleted && setEdges(newEdges);
  }, [tick]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      connectingNodeId.current = null;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "floating",
            markerEnd: { type: MarkerType.Arrow },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const onConnectStart = useCallback(
    (
      _: ReactMouseEvent<Element, MouseEvent> | ReactTouchEvent<Element>,
      { nodeId }: OnConnectStartParams,
    ) => {
      connectingNodeId.current = nodeId;
    },
    [],
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) return;
      const currentConnectingNode = nodes.find(
        (node) => node.id === connectingNodeId.current,
      );
      if (!currentConnectingNode) return;

      const targetIsPane = // @ts-expect-error has classlist
        (event.target?.classList as string[]).contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position

        const existingDestinationNode = getOutgoers(
          currentConnectingNode,
          nodes,
          edges,
        )[0];

        const id =
          existingDestinationNode?.id ?? `destination-${destinationCount + 1}`;

        const newNode = {
          id,
          position: screenToFlowPosition({
            // @ts-expect-error missing clientX and clientY for TouchEvent
            x: event.clientX,
            // @ts-expect-error missing clientX and clientY for TouchEvent
            y: event.clientY,
          }),
          data: {
            label:
              existingDestinationNode?.data?.label ??
              `${id}_${connectingNodeId.current}`,
          },
          type: "destination",
          origin: [0.5, 0.0],
        };

        setNodes((nodes) =>
          nodes
            .filter((node) => node.id !== existingDestinationNode?.id)
            .concat(newNode),
        );
        setEdges((edges) =>
          edges
            .filter((edge) => edge.target !== existingDestinationNode?.id)
            .concat({
              id: `${connectingNodeId.current}<>${id}`,
              source: connectingNodeId.current!,
              target: id,
              type: "floating",
              style: { stroke: "#f13", strokeWidth: 3 },
              markerEnd: { type: MarkerType.Arrow },
            }),
        );
        if (!existingDestinationNode) {
          setDestinationCount((count) => count + 1);
        }
      }
    },
    [screenToFlowPosition, setNodes, setEdges, destinationCount],
  );

  return (
    <div
      className="reactflow-wrapper floatingedges"
      ref={reactFlowWrapper}
      style={{ width: "80vw", height: "80vh" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={MinionConnectionLine}
      >
        {/* <Background /> */}
      </ReactFlow>
    </div>
  );
};

export default React.memo(Flow);
