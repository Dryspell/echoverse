import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Functions related to reading & writing presence data.
 *
 * Note: this file does not currently implement authorization.
 * That is left as an exercise to the reader. Some suggestions for a production
 * app:
 * - Use Convex `auth` to authenticate users rather than passing up a "user"
 * - Check that the user is allowed to be in a given room.
 */

const LIST_LIMIT = 20;

/**
 * Overwrites the presence data for a given user in a room.
 *
 * It will also set the "updated" timestamp to now, and create the presence
 * document if it doesn't exist yet.
 *
 * @param room - The location associated with the presence data. Examples:
 * page, chat channel, game instance.
 * @param user - The user associated with the presence data.
 */
export const update = mutation({
  args: { room: v.string(), user: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("user_room", (q) =>
        q.eq("user", args.user).eq("room", args.room),
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        updated: Date.now(),
      });
    } else {
      await ctx.db.insert("presence", {
        user: args.user,
        room: args.room,
        updated: Date.now(),
      });
    }
  },
});

/**
 * Updates the "updated" timestamp for a given user's presence in a room.
 *
 * @param room - The location associated with the presence data. Examples:
 * page, chat channel, game instance.
 * @param user - The user associated with the presence data.
 */
export const heartbeat = mutation({
  args: { room: v.string(), user: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("user_room", (q) =>
        q.eq("user", args.user).eq("room", args.room),
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { updated: Date.now() });
    }
  },
});

/**
 * Lists the presence data for N users in a room, ordered by recent update.
 *
 * @param room - The location associated with the presence data. Examples:
 * page, chat channel, game instance.
 * @returns A list of presence objects, ordered by recent update, limited to
 * the most recent N.
 */
export const list = query({
  args: { room: v.string() },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("room_updated", (q) => q.eq("room", args.room))
      .order("desc")
      .take(LIST_LIMIT);
    return presence.map(({ _creationTime, updated, user }) => ({
      created: _creationTime,
      updated,
      user,
    }));
  },
});
