import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { getUsersByIdsUtil } from "./utils";

const FREE_CREDITS = 5;


export const setSubscriptionId = internalMutation({
	args: {
		userId: v.string(),
		subscriptionId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_userid", (q) => q.eq("id", args.userId))
			.unique();
		if (!user) {
			throw new Error("User not found");
		}

		return await ctx.db.patch(user._id, {
			subscriptionId: args.subscriptionId,
		});
	},
});

export const updateSubscriptionBySubId = internalMutation({
	args: {
		subscriptionId: v.string(),
		// subscriptionExpirey: v.number(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_subscriptionId", (q) =>
				q.eq("subscriptionId", args.subscriptionId)
			)
			.unique();
		if (!user) {
			throw new Error("User not found");
		}

		return await ctx.db.patch(user._id, {
			subscriptionId: args.subscriptionId,
			// subscriptionExpirey: args.subscriptionExpirey,
		});
	},
});

/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // Check if we've already stored this identity before.
    const user = await getUsersByIdsUtil(ctx, [identity.tokenIdentifier]).then(
      (res) => res[0],
    );

    if (user) {
      // If we've seen this identity before but the name has changed, patch the value.
      const patchData = {
        name: identity.name!,
        pictureUrl: identity.pictureUrl,
      };
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, patchData);
      }
      return { ...user, ...patchData };
    }
    // If it's a new identity, create a new `User`.
    const newUserData = {
      id: identity.subject,
      name: identity.name!,
      preferredUsername: identity.preferredUsername,
      pictureUrl: identity.pictureUrl,
      tokenIdentifier: identity.tokenIdentifier,
      credits: FREE_CREDITS,
    };
    await ctx.db.insert("users", newUserData);
    const createdUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    return createdUser;
  },
});
