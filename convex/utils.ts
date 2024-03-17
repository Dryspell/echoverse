import { type MutationCtx, type QueryCtx } from "./_generated/server";

export const getUsersByIdsUtil = async (
  ctx: QueryCtx | MutationCtx,
  userIds: string[],
) => {
  const users = await Promise.all(
    userIds.map((userId) =>
      ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
        .unique(),
    ),
  );
  return users;
};

export const getDbUserUtil = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Called storeUser without authentication present");
  }

  // Check if we've already stored this identity before.
  const user = await getUsersByIdsUtil(ctx, [identity.tokenIdentifier]).then(
    (res) => res[0],
  );
  return { identity, user };
};
