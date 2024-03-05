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
} from "reactflow";
import "reactflow/dist/style.css";

import "../utils/styles.css";
import { createCircularArrayOfNodes, createMinionNodes } from "../utils/utils";
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

const Flow = ({ tick }: { tick: number }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<{ label: string }>(
    initialNodes(),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [destinationCount, setDestinationCount] = React.useState(0);

  React.useEffect(() => {
    setNodes(
      nodes.map((node) => {
        if (node.type === "minion")
          return {
            ...node,
            // position: {
            //   x: Math.round(node.position.x + (Math.random() - 0.5) * 5),
            //   y: Math.round(node.position.y + (Math.random() - 0.5) * 5),
            // },
          };
        return node;
      }),
    );
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

        setNodes((nds) =>
          nds
            .filter((node) => node.id !== existingDestinationNode?.id)
            .concat(newNode),
        );
        setEdges((eds) =>
          eds
            .filter((edge) => edge.target !== existingDestinationNode?.id)
            .concat({
              id,
              source: connectingNodeId.current!,
              target: id,
              type: "floating",
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
