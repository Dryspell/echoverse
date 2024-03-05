"use client";

import React, { useCallback } from "react";
import Flow from "./components/Flow";
import useInterval from "~/hooks/useInterval";
import { ReactFlowProvider } from "reactflow";

export default function MinionsPage() {
  const [tick, setTick] = React.useState(0);
  useInterval(() => {
    setTick(tick + 1);
  }, 16);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="relative right-2 top-2">{`Tick: ${tick}`}</div>
        <ReactFlowProvider>
          <Flow tick={tick} />
        </ReactFlowProvider>
      </div>
    </main>
  );
}
