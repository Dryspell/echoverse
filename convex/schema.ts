import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    id: v.string(),
    tokenIdentifier: v.string(),
    name: v.string(),
    preferredUsername: v.optional(v.string()),
    email: v.optional(v.string()),
    pictureUrl: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    credits: v.optional(v.number()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_userid", ["id"])
    .index("by_subscriptionId", ["subscriptionId"]),
});
