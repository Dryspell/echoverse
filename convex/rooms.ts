import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { page: rooms, ...pagination } = await ctx.db
      .query("rooms")
      .order("desc")
      .paginate(args.paginationOpts);

    const roomPresence = await Promise.all(
      rooms.map((r) =>
        ctx.db
          .query("presence")
          .withIndex("room_updated", (q) => q.eq("room", r.id))
          .order("desc")
          .collect(),
      ),
    );

    return {
      ...pagination,
      page: rooms.map((r, i) => ({
        ...r,
        presence: roomPresence[i],
      })),
    };
  },
});

export const getbyId = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("id", args.id))
      .unique();
    return { ...room };
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (!room) throw new Error("Room not found");

    return room;
  },
});

export const createRoom = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const newRoomData = {
      id: `${Math.random().toString(36).substring(7)}_${Math.random().toString(36).substring(7)}`,
      ...args,
    };
    const newRoom = await ctx.db.insert("rooms", newRoomData);
    return { _id: newRoom, ...newRoomData };
  },
});
