import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  odinBalance: decimal("odin_balance", { precision: 18, scale: 2 }).default("0"),
  lastFaucetClaim: timestamp("last_faucet_claim"),
  discordId: text("discord_id"),
  discordUsername: text("discord_username"),
  discordVerified: boolean("discord_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nfts = pgTable("nfts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: integer("token_id").notNull().unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  rarity: text("rarity").notNull(), // Legendary, Epic, Rare, Common
  category: text("category").notNull(), // Berserker, Valkyrie, Jarl, Shaman
  price: decimal("price", { precision: 18, scale: 4 }).notNull(),
  ownerId: varchar("owner_id").references(() => users.id),
  attributes: jsonb("attributes"), // JSON object for traits
  isStaked: boolean("is_staked").default(false),
  stakedAt: timestamp("staked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stakingRewards = pgTable("staking_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  nftId: varchar("nft_id").notNull().references(() => nfts.id),
  rewardsEarned: decimal("rewards_earned", { precision: 18, scale: 2 }).default("0"),
  lastClaimAt: timestamp("last_claim_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faucetClaims = pgTable("faucet_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  walletAddress: text("wallet_address").notNull(),
  claimedAt: timestamp("claimed_at").defaultNow(),
});

export const faucetStats = pgTable("faucet_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalClaimed: decimal("total_claimed", { precision: 18, scale: 2 }).default("0"),
  totalClaimers: integer("total_claimers").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertNftSchema = createInsertSchema(nfts).pick({
  tokenId: true,
  name: true,
  imageUrl: true,
  rarity: true,
  category: true,
  price: true,
  attributes: true,
});

export const insertStakingRewardSchema = createInsertSchema(stakingRewards).pick({
  userId: true,
  nftId: true,
  rewardsEarned: true,
});

export const insertFaucetClaimSchema = createInsertSchema(faucetClaims).pick({
  userId: true,
  amount: true,
  walletAddress: true,
});

export const insertFaucetStatsSchema = createInsertSchema(faucetStats).pick({
  totalClaimed: true,
  totalClaimers: true,
});

export const discordAuthSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  discordCode: z.string().min(1, "Discord authorization code required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertNft = z.infer<typeof insertNftSchema>;
export type InsertStakingReward = z.infer<typeof insertStakingRewardSchema>;
export type InsertFaucetClaim = z.infer<typeof insertFaucetClaimSchema>;
export type InsertFaucetStats = z.infer<typeof insertFaucetStatsSchema>;
export type DiscordAuth = z.infer<typeof discordAuthSchema>;

export type User = typeof users.$inferSelect;
export type Nft = typeof nfts.$inferSelect;
export type StakingReward = typeof stakingRewards.$inferSelect;
export type FaucetClaim = typeof faucetClaims.$inferSelect;
export type FaucetStats = typeof faucetStats.$inferSelect;
