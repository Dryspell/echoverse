"use client";

import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Connection,
  type Edge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import "./utils/styles.css";
import { createNodesAndEdges } from "./utils/utils";
import FloatingEdge from "./components/FloatingEdge";
import FloatingConnectionLine from "./components/FloatingConnection";

const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges({
  nodesCount: 4,
  center:
    typeof window !== "undefined"
      ? {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }
      : {
          x: 400,
          y: 300,
        },
});

const edgeTypes = {
  floating: FloatingEdge,
};

const NodeAsHandleFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "floating",
            markerEnd: { type: MarkerType.Arrow },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <ReactFlowProvider>
          <div
            className="reactflow-wrapper floatingedges"
            style={{ width: "80vw", height: "80vh" }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              edgeTypes={edgeTypes}
              connectionLineComponent={FloatingConnectionLine}
            >
              <Background />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </main>
  );
};

export default NodeAsHandleFlow;
