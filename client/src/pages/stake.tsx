import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Coins, Crown } from "lucide-react";
import type { Nft } from "@shared/schema";
import { CustomConnectButton } from "@/components/CustomConnectButton"; // Assuming CustomConnectButton is in this path

// Mock user ID for demo - in real app this would come from auth
const DEMO_USER_ID = "demo-user";

interface StakedNft extends Nft {
  earnedRewards?: string;
  daysSinceStaked?: number;
}

export default function Stake() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  // Get user's NFTs and staking data
  const { data: userNfts, isLoading: nftsLoading } = useQuery({
    queryKey: ["/api/users", DEMO_USER_ID, "nfts"],
  });

  const { data: stakedNfts, isLoading: stakedLoading } = useQuery({
    queryKey: ["/api/users", DEMO_USER_ID, "staked"],
  });

  // Stake NFT mutation
  const stakeMutation = useMutation({
    mutationFn: async (nftId: string) => {
      return await apiRequest("POST", `/api/nfts/${nftId}/stake`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID] });
      toast({ title: "Success", description: "NFT staked successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to stake NFT",
        variant: "destructive"
      });
    },
  });

  // Unstake NFT mutation
  const unstakeMutation = useMutation({
    mutationFn: async (nftId: string) => {
      return await apiRequest("POST", `/api/nfts/${nftId}/unstake`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID] });
      toast({ title: "Success", description: "NFT unstaked successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unstake NFT",
        variant: "destructive"
      });
    },
  });

  // Claim rewards mutation
  const claimMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/users/${DEMO_USER_ID}/claim-rewards`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID] });
      toast({
        title: "Success",
        description: `Claimed ${data.amount} $ODIN tokens!`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to claim rewards",
        variant: "destructive"
      });
    },
  });

  const availableNfts = userNfts?.filter((nft: Nft) => !nft.isStaked) || [];
  const totalPendingRewards = stakedNfts?.reduce((sum: number, nft: StakedNft) =>
    sum + parseFloat(nft.earnedRewards || "0"), 0
  ) || 0;

  const isLoading = nftsLoading || stakedLoading;

  return (
    <section className="py-20 min-h-screen page-background">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80">
        <div className="text-center">
          <h1 className="font-cinzel font-bold text-6xl md:text-8xl text-nordic-gold mb-4 animate-pulse">
            COMING SOON
          </h1>
          <p className="text-xl text-gray-300">
            The staking feature is under development
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 blur-md">
        <div className="text-center mb-16">
          <h1 className="font-cinzel font-bold text-4xl md:text-6xl text-white mb-6">
            Stake Your <span className="text-nordic-gold" data-testid="text-stake-title">Warriors</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-stake-description">
            Send your Viking warriors to Valhalla's training grounds and earn $ODIN tokens
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Staking Stats */}
          <Card className="bg-viking-dark border-nordic-gold/20">
            <CardHeader>
              <CardTitle className="font-cinzel font-bold text-2xl text-white">
                Staking Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                    <Skeleton className="h-6 w-16 bg-gray-700" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                    <Skeleton className="h-6 w-24 bg-gray-700" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Your Staked Warriors</span>
                    <span className="text-nordic-gold font-bold text-xl" data-testid="text-staked-count">
                      {stakedNfts?.length || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pending Rewards</span>
                    <span className="text-nordic-gold font-bold text-xl" data-testid="text-pending-rewards">
                      {totalPendingRewards.toFixed(1)} $ODIN
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Daily Reward Rate</span>
                    <span className="text-nordic-gold font-bold text-xl" data-testid="text-daily-rate">
                      {(stakedNfts?.length || 0) * 5.2} $ODIN/day
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Staked (Global)</span>
                    <span className="text-nordic-gold font-bold text-xl" data-testid="text-global-staked">
                      6,743
                    </span>
                  </div>
                </>
              )}

              <div className="space-y-4 pt-4">
                <Button
                  onClick={() => claimMutation.mutate()}
                  disabled={claimMutation.isPending || totalPendingRewards === 0}
                  className="w-full bg-nordic-gold text-black hover:bg-yellow-500 font-semibold"
                  data-testid="button-claim-rewards"
                >
                  {claimMutation.isPending
                    ? "Claiming..."
                    : `Claim Rewards (${totalPendingRewards.toFixed(1)} $ODIN)`
                  }
                </Button>
                <Button
                  variant="outline"
                  disabled={!stakedNfts?.length}
                  className="w-full border-2 border-nordic-gold text-nordic-gold hover:bg-nordic-gold hover:text-black font-semibold"
                  data-testid="button-unstake-all"
                >
                  Unstake All Warriors
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Your NFTs */}
          <Card className="bg-viking-dark border-nordic-gold/20">
            <CardHeader>
              <CardTitle className="font-cinzel font-bold text-2xl text-white">
                Your Vikings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between bg-rune-gray p-4 rounded-lg">
                    <Skeleton className="w-16 h-16 rounded-lg bg-gray-700" />
                    <div className="flex-1 ml-4 space-y-2">
                      <Skeleton className="h-4 w-32 bg-gray-700" />
                      <Skeleton className="h-3 w-24 bg-gray-700" />
                    </div>
                    <Skeleton className="h-8 w-16 bg-gray-700" />
                  </div>
                ))
              ) : (
                <>
                  {/* Staked NFTs */}
                  {stakedNfts?.map((nft: StakedNft) => (
                    <div
                      key={nft.id}
                      className="flex items-center justify-between bg-rune-gray p-4 rounded-lg border-l-4 border-nordic-gold"
                      data-testid={`staked-nft-${nft.tokenId}`}
                    >
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        data-testid={`staked-img-${nft.tokenId}`}
                      />
                      <div className="flex-1 ml-4">
                        <h3 className="font-semibold text-white" data-testid={`staked-name-${nft.tokenId}`}>
                          {nft.name}
                        </h3>
                        <p className="text-sm text-nordic-gold">
                          STAKED • {nft.daysSinceStaked || 0} days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-nordic-gold font-bold" data-testid={`earned-rewards-${nft.tokenId}`}>
                          {parseFloat(nft.earnedRewards || "0").toFixed(1)} $ODIN
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => unstakeMutation.mutate(nft.id)}
                          disabled={unstakeMutation.isPending}
                          className="text-gray-400 hover:text-white"
                          data-testid={`button-unstake-${nft.tokenId}`}
                        >
                          Unstake
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Available NFTs */}
                  {availableNfts.map((nft: Nft) => (
                    <div
                      key={nft.id}
                      className="flex items-center justify-between bg-rune-gray/50 p-4 rounded-lg"
                      data-testid={`available-nft-${nft.tokenId}`}
                    >
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        data-testid={`available-img-${nft.tokenId}`}
                      />
                      <div className="flex-1 ml-4">
                        <h3 className="font-semibold text-white" data-testid={`available-name-${nft.tokenId}`}>
                          {nft.name}
                        </h3>
                        <p className="text-sm text-gray-400">Available to stake</p>
                      </div>
                      <Button
                        onClick={() => stakeMutation.mutate(nft.id)}
                        disabled={stakeMutation.isPending}
                        className="bg-nordic-gold text-black hover:bg-yellow-500 font-semibold"
                        data-testid={`button-stake-${nft.tokenId}`}
                      >
                        {stakeMutation.isPending ? "Staking..." : "Stake"}
                      </Button>
                    </div>
                  ))}

                  {/* Empty States */}
                  {!stakedNfts?.length && !availableNfts.length && (
                    <div className="text-center py-8">
                      <p className="text-gray-400" data-testid="text-no-nfts">
                        You don't own any Viking warriors yet.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Staking Info */}
        <Card className="mt-16 bg-rune-gray border-nordic-gold/20">
          <CardContent className="p-8">
            <h2 className="font-cinzel font-bold text-2xl text-white mb-6 text-center">
              How Staking Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-nordic-gold text-4xl mb-4 flex justify-center">
                  <Shield className="h-12 w-12" />
                </div>
                <h3 className="font-cinzel font-bold text-xl text-white mb-2">Stake Warriors</h3>
                <p className="text-gray-300">Send your Viking warriors to Valhalla's training grounds to begin earning rewards</p>
              </div>

              <div className="text-center">
                <div className="text-nordic-gold text-4xl mb-4 flex justify-center">
                  <Coins className="h-12 w-12" />
                </div>
                <h3 className="font-cinzel font-bold text-xl text-white mb-2">Earn $ODIN</h3>
                <p className="text-gray-300">Accumulate $ODIN tokens daily. Longer staking periods yield higher rewards</p>
              </div>

              <div className="text-center">
                <div className="text-nordic-gold text-4xl mb-4 flex justify-center">
                  <Crown className="h-12 w-12" />
                </div>
                <h3 className="font-cinzel font-bold text-xl text-white mb-2">Unlock Benefits</h3>
                <p className="text-gray-300">Use $ODIN for governance, exclusive access, and future game features</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}