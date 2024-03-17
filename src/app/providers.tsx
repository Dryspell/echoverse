"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ThemeProvider } from "~/components/NextThemeProvider";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { type PropsWithChildren, Suspense } from "react";
import { env } from "~/env";
import { SnackbarProvider } from "~/components/SnackbarProvider";
import MuiTheme from "~/components/MuiThemeProvider";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <MuiTheme>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SnackbarProvider>{children}</SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </MuiTheme>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </Suspense>
  );
}
