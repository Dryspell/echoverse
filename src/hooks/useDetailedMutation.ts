"use client";

import { type OptimisticUpdate } from "convex/browser";
import { useMutation } from "convex/react";
import {
  type FunctionArgs,
  type FunctionReference,
  type FunctionReturnType,
} from "convex/server";
import React from "react";

export default function useDetailedMutation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MutationType extends FunctionReference<"mutation", "public", any, any>,
>(
  mutation: Parameters<typeof useMutation<MutationType>>[0],
  options?: {
    onSuccess?: (result: FunctionReturnType<MutationType>) => void;
    onMutate?: (mutationParams: FunctionArgs<MutationType>) => void;
    onError?: (error: Error) => void;
    optimisticUpdate?: OptimisticUpdate<FunctionArgs<MutationType>>;
  },
) {
  const doMutation = useMutation(mutation).withOptimisticUpdate(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    options?.optimisticUpdate ?? (() => {}),
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] =
    React.useState<FunctionReturnType<MutationType>>(undefined);

  const mutate = React.useCallback(
    (mutationParams: FunctionArgs<MutationType>) => {
      options?.onMutate?.(mutationParams);
      setIsLoading(() => true);

      doMutation(mutationParams)
        .then((mutationResult) => {
          setData(() => mutationResult);
          options?.onSuccess?.(mutationResult);
          setIsLoading(() => false);
        })
        .catch((error: Error) => {
          options?.onError?.(error);
          setIsLoading(() => false);
        });
    },
    [doMutation, options?.onError, options?.onSuccess, options?.onMutate],
  );

  return { data: data, isLoading: isLoading, mutate };
}
