import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React from "react";

export const MuiThemeModeContext = React.createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  toggleColorMode: (mode?: "light" | "dark") => {},
});

export default function MuiTheme({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: (mode?: "light" | "dark") => {
        setMode((prevMode) =>
          mode ?? prevMode === "light" ? "dark" : "light",
        );
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <MuiThemeModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </MuiThemeModeContext.Provider>
  );
}
