import * as React from "react";
import type { AlertProps } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export interface SnackbarMessage {
  message: string;
  key?: string | number;
  severity?: "error" | "warning" | "info" | "success";
  duration?: number;
  secondaryAction?: React.ReactNode;
}

export interface SnackbarState {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

export default function ConsecutiveSnackbars(props: {
  snackbar: readonly SnackbarMessage[];
  setSnackbar: React.Dispatch<React.SetStateAction<readonly SnackbarMessage[]>>;
}) {
  const { snackbar, setSnackbar } = props;
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<
    SnackbarMessage | undefined
  >(undefined);

  React.useEffect(() => {
    if (snackbar.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      snackbar[0] && setMessageInfo({ ...snackbar[0] });
      const newSnackPack = snackbar.slice(1);
      setSnackbar(newSnackPack);
      setOpen(true);
    } else if (snackbar.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackbar, messageInfo, open, setSnackbar]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const action = (
    <React.Fragment>
      {messageInfo?.secondaryAction}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        key={messageInfo?.key}
        open={open}
        autoHideDuration={messageInfo?.duration ?? 2000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        action={action}
      >
        <Alert
          onClose={handleClose}
          severity={messageInfo?.severity}
          sx={{ width: "100%" }}
        >
          {messageInfo?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
