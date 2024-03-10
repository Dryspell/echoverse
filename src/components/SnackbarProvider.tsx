import type { SnackbarMessage } from "./ConsecutiveSnackbars";
import React from "react";
import ConsecutiveSnackbars from "./ConsecutiveSnackbars";

export const SnackbarContext = React.createContext<{
  snack: (message: SnackbarMessage) => void;
}>({
  snack: (message: SnackbarMessage) => {
    return;
  },
});

const notifier = (
  setSnackbar: React.Dispatch<React.SetStateAction<readonly SnackbarMessage[]>>,
) => {
  return (message: SnackbarMessage) => {
    console.log(
      `[${message.severity?.toUpperCase() ?? "INFO"}] ${message.message}`,
    );
    setSnackbar((prev) => [
      ...prev,
      {
        key: new Date().getTime(),
        ...message,
      },
    ]);
  };
};

export const SnackbarProvider = (props: { children: React.ReactNode }) => {
  const [snackbar, setSnackbar] = React.useState(
    [] as readonly SnackbarMessage[],
  );

  const snack = React.useMemo(() => notifier(setSnackbar), [setSnackbar]);

  return (
    <SnackbarContext.Provider value={{ snack }}>
      {props.children}
      <ConsecutiveSnackbars snackbar={snackbar} setSnackbar={setSnackbar} />
    </SnackbarContext.Provider>
  );
};
