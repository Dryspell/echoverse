import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getDbUserUtil } from "./utils";

export const getByRoomId = query({
  args: { roomId: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const messagesPage = await ctx.db
      .query("messages")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .paginate(args.paginationOpts);

    const users = await Promise.all(
      [...new Set(messagesPage.page.map((m) => m.userId))].map((userId) =>
        ctx.db
          .query("users")
          .withIndex("by_userid", (q) => q.eq("id", userId))
          .unique(),
      ),
    );

    return {
      ...messagesPage,
      page: messagesPage.page.map((message) => ({
        ...message,
        user: users.find((user) => user?.id === message.userId),
      })),
    };
  },
});

export const postMessage = mutation({
  args: {
    roomId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const { identity, user } = await getDbUserUtil(ctx);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("messages", {
      roomId: args.roomId,
      userId: user.id,
      message: args.message,
      timestamp: Date.now(),
    });
  },
});
