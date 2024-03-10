import { useContext } from "react";
import { SnackbarContext } from "~/components/SnackbarProvider";

export default function useSnackbar() {
  const { snack } = useContext(SnackbarContext);
  return { snack };
}
