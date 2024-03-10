"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../components/ui/mode-toggle";
import Link from "next/link";
import useStableDbUser from "@/hooks/useStoreUserEffect";
import { useRouter } from "next/navigation";
import UpgradeSubscriptionButton from "@/components/UpgradeButton";

export function Header() {
  const user = useStableDbUser();

  const isSubscribed = user?.subscriptionId;

  // const getPaymentUrl = useAction(api.stripe.getPaymentUrl);

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link className="link" href="/">
          Thumbnail Rater
        </Link>

        <div className="flex gap-8">
          <SignedIn>
            <Link className="link" href="/create">
              Create Test
            </Link>
            <Link className="link" href="/dashboard">
              Dashboard
            </Link>
            <Link className="link" href="/explore">
              Explore
            </Link>
          </SignedIn>
          <SignedOut>
            <Link className="link" href="/about">
              About
            </Link>
            <Link className="link" href="pricing">
              Pricing
            </Link>
          </SignedOut>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            {!isSubscribed && <UpgradeSubscriptionButton />}
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
