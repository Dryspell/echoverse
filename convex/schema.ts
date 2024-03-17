import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    id: v.string(),
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    preferredUsername: v.optional(v.string()),
    email: v.optional(v.string()),
    pictureUrl: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    credits: v.optional(v.number()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_userid", ["id"])
    .index("by_subscriptionId", ["subscriptionId"]),

  rooms: defineTable({
    id: v.string(),
    name: v.string(),
    description: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
  })
    .index("by_roomId", ["id"])
    .index("by_name", ["name"]),

  presence: defineTable({
    user: v.string(),
    room: v.string(),
    updated: v.number(),
  })
    // Index for fetching presence data
    .index("room_updated", ["room", "updated"])
    // Index for updating presence data
    .index("user_room", ["user", "room"]),

  messages: defineTable({
    user: v.string(),
    room: v.string(),
    message: v.string(),
    timestamp: v.number(),
  }),
});
