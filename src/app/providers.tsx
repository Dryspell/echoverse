"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { type PropsWithChildren, Suspense } from "react";
import { env } from "~/env";

const convex = new ConvexReactClient(
	env.NEXT_PUBLIC_CONVEX_URL,
);

export function Providers({ children }: PropsWithChildren) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClerkProvider
				publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
			>
				<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</ConvexProviderWithClerk>
			</ClerkProvider>
		</Suspense>
	);
}
