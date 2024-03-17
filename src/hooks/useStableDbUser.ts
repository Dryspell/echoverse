import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { type Doc } from "../../convex/_generated/dataModel";

export default function useStableDbUser() {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();

  // When this state is set we know the server
  // has stored the user.
  const [dbUser, setDbUser] = useState<Doc<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      return;
    }
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUser() {
      const user = await storeUser();
      if (!user) throw new Error("User not found");
      setDbUser(user);
    }
    createUser().catch((e) => console.error(e));
    return () => setDbUser(null);
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [isAuthenticated, storeUser, user?.id]);
  return dbUser;
}
