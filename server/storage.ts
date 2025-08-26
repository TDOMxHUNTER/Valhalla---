import { type User, type InsertUser, type Nft, type InsertNft, type StakingReward, type InsertStakingReward, type FaucetClaim, type InsertFaucetClaim } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: string, balance: string): Promise<User | undefined>;

  // NFTs
  getNfts(limit?: number, offset?: number): Promise<Nft[]>;
  getNft(id: string): Promise<Nft | undefined>;
  getNftsByOwner(ownerId: string): Promise<Nft[]>;
  getStakedNftsByOwner(ownerId: string): Promise<Nft[]>;
  createNft(nft: InsertNft): Promise<Nft>;
  stakeNft(nftId: string): Promise<Nft | undefined>;
  unstakeNft(nftId: string): Promise<Nft | undefined>;

  // Staking Rewards
  getStakingReward(userId: string, nftId: string): Promise<StakingReward | undefined>;
  createStakingReward(reward: InsertStakingReward): Promise<StakingReward>;
  updateStakingReward(userId: string, nftId: string, rewardsEarned: string): Promise<StakingReward | undefined>;

  // Faucet
  getLastFaucetClaim(userId: string): Promise<FaucetClaim | undefined>;
  createFaucetClaim(claim: InsertFaucetClaim): Promise<FaucetClaim>;
  updateLastFaucetClaim(userId: string, claimTime: Date): Promise<User | undefined>;

  // Stats
  getGlobalStats(): Promise<{
    totalNfts: number;
    totalStaked: number;
    totalHolders: number;
    floorPrice: string;
    totalRewards: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private nfts: Map<string, Nft>;
  private stakingRewards: Map<string, StakingReward>;
  private faucetClaims: Map<string, FaucetClaim>;
  private faucetStats = new Map<string, { totalClaimed: string; totalClaimers: number }>();

  constructor() {
    this.users = new Map();
    this.nfts = new Map();
    this.stakingRewards = new Map();
    this.faucetClaims = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Create sample user
    const sampleUserId = randomUUID();
    const sampleUser: User = {
      id: sampleUserId,
      username: "viking_warrior",
      password: "password123",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      odinBalance: "450.25",
      lastFaucetClaim: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
      createdAt: new Date(),
    };
    this.users.set(sampleUserId, sampleUser);

    // Create sample NFTs
    const sampleNfts = [
      {
        tokenId: 1247,
        name: "Ragnar the Fierce #1247",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
        rarity: "Legendary",
        category: "Berserker",
        price: "2.5",
        ownerId: sampleUserId,
        isStaked: true,
        stakedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        attributes: { strength: 95, wisdom: 45, magic: 30, speed: 80 },
      },
      {
        tokenId: 892,
        name: "Freydis the Bold #892",
        imageUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=600&fit=crop",
        rarity: "Epic",
        category: "Valkyrie",
        price: "1.8",
        ownerId: sampleUserId,
        isStaked: false,
        stakedAt: null,
        attributes: { strength: 85, wisdom: 70, magic: 90, speed: 95 },
      },
      {
        tokenId: 456,
        name: "Olaf the Wise #456",
        imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=600&h=600&fit=crop",
        rarity: "Rare",
        category: "Jarl",
        price: "3.2",
        ownerId: sampleUserId,
        isStaked: false,
        stakedAt: null,
        attributes: { strength: 70, wisdom: 95, magic: 60, speed: 50 },
      },
    ];

    sampleNfts.forEach(nftData => {
      const nftId = randomUUID();
      const nft: Nft = {
        id: nftId,
        ...nftData,
        createdAt: new Date(),
      };
      this.nfts.set(nftId, nft);

      if (nft.isStaked) {
        const rewardId = randomUUID();
        const stakingReward: StakingReward = {
          id: rewardId,
          userId: sampleUserId,
          nftId: nftId,
          rewardsEarned: "78.0",
          lastClaimAt: new Date(),
          createdAt: new Date(),
        };
        this.stakingRewards.set(`${sampleUserId}_${nftId}`, stakingReward);
      }
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      odinBalance: "0",
      lastFaucetClaim: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(id: string, balance: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, odinBalance: balance };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getNfts(limit = 20, offset = 0): Promise<Nft[]> {
    const allNfts = Array.from(this.nfts.values());
    return allNfts.slice(offset, offset + limit);
  }

  async getNft(id: string): Promise<Nft | undefined> {
    return this.nfts.get(id);
  }

  async getNftsByOwner(ownerId: string): Promise<Nft[]> {
    return Array.from(this.nfts.values()).filter(nft => nft.ownerId === ownerId);
  }

  async getStakedNftsByOwner(ownerId: string): Promise<Nft[]> {
    return Array.from(this.nfts.values()).filter(nft => nft.ownerId === ownerId && nft.isStaked);
  }

  async createNft(insertNft: InsertNft): Promise<Nft> {
    const id = randomUUID();
    const nft: Nft = {
      ...insertNft,
      id,
      ownerId: null,
      isStaked: false,
      stakedAt: null,
      createdAt: new Date(),
    };
    this.nfts.set(id, nft);
    return nft;
  }

  async stakeNft(nftId: string): Promise<Nft | undefined> {
    const nft = this.nfts.get(nftId);
    if (!nft) return undefined;

    const updatedNft = {
      ...nft,
      isStaked: true,
      stakedAt: new Date(),
    };
    this.nfts.set(nftId, updatedNft);
    return updatedNft;
  }

  async unstakeNft(nftId: string): Promise<Nft | undefined> {
    const nft = this.nfts.get(nftId);
    if (!nft) return undefined;

    const updatedNft = {
      ...nft,
      isStaked: false,
      stakedAt: null,
    };
    this.nfts.set(nftId, updatedNft);
    return updatedNft;
  }

  async getStakingReward(userId: string, nftId: string): Promise<StakingReward | undefined> {
    return this.stakingRewards.get(`${userId}_${nftId}`);
  }

  async createStakingReward(insertReward: InsertStakingReward): Promise<StakingReward> {
    const id = randomUUID();
    const reward: StakingReward = {
      ...insertReward,
      id,
      lastClaimAt: new Date(),
      createdAt: new Date(),
    };
    this.stakingRewards.set(`${insertReward.userId}_${insertReward.nftId}`, reward);
    return reward;
  }

  async updateStakingReward(userId: string, nftId: string, rewardsEarned: string): Promise<StakingReward | undefined> {
    const key = `${userId}_${nftId}`;
    const reward = this.stakingRewards.get(key);
    if (!reward) return undefined;

    const updatedReward = {
      ...reward,
      rewardsEarned,
      lastClaimAt: new Date(),
    };
    this.stakingRewards.set(key, updatedReward);
    return updatedReward;
  }

  async getLastFaucetClaim(userId: string): Promise<FaucetClaim | undefined> {
    return Array.from(this.faucetClaims.values())
      .filter(claim => claim.userId === userId)
      .sort((a, b) => b.claimedAt.getTime() - a.claimedAt.getTime())[0];
  }

  async createFaucetClaim(insertClaim: InsertFaucetClaim): Promise<FaucetClaim> {
    const id = randomUUID();
    const claim: FaucetClaim = {
      ...insertClaim,
      id,
      claimedAt: new Date(),
    };
    this.faucetClaims.set(id, claim);

    // Update faucet stats
    const currentStats = this.faucetStats.get("global") || { totalClaimed: "0", totalClaimers: 0 };
    const claimAmount = parseFloat(insertClaim.amount);
    const newTotalClaimed = (parseFloat(currentStats.totalClaimed) + claimAmount).toString();
    const newTotalClaimers = currentStats.totalClaimers + (this.faucetClaims.has(id) ? 1 : 0); // This logic might need refinement to correctly count unique claimers
    this.faucetStats.set("global", { totalClaimed: newTotalClaimed, totalClaimers: newTotalClaimers });

    return claim;
  }

  async updateLastFaucetClaim(userId: string, claimTime: Date): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = { ...user, lastFaucetClaim: claimTime };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getGlobalStats() {
    const allNfts = Array.from(this.nfts.values());
    const stakedNfts = allNfts.filter(nft => nft.isStaked);
    const uniqueOwners = new Set(allNfts.map(nft => nft.ownerId).filter(Boolean));
    const allRewards = Array.from(this.stakingRewards.values());

    const faucetStats = this.faucetStats.get("global") || { totalClaimed: "0", totalClaimers: 0 };

    return {
      totalNfts: 10000, // Total supply
      totalStaked: stakedNfts.length,
      totalHolders: uniqueOwners.size,
      floorPrice: "0.5",
      totalRewards: allRewards.reduce((sum, reward) =>
        sum + parseFloat(reward.rewardsEarned || "0"), 0
      ).toString(),
      totalFaucetClaimed: faucetStats.totalClaimed,
      totalFaucetClaimers: faucetStats.totalClaimers,
    };
  }
}

export const storage = new MemStorage();