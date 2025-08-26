import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccount, useBalance } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Coins, Shield, Wallet } from "lucide-react";
import { CustomConnectButton } from "@/components/web3-provider";

const faucetSchema = z.object({
  walletAddress: z.string()
    .min(1, "Wallet address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
});

type FaucetForm = z.infer<typeof faucetSchema>;

export default function Faucet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const [claimStatus, setClaimStatus] = useState<{
    canClaim: boolean;
    timeLeft?: string;
    message: string;
  }>({ canClaim: false, message: "Discord verification required" });
  const [discordVerified, setDiscordVerified] = useState(false);

  const form = useForm<FaucetForm>({
    resolver: zodResolver(faucetSchema),
    defaultValues: {
      walletAddress: "",
    },
  });

  // Get wallet balance
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    chainId: 10143, // Monad Testnet
  });

  // Auto-fill wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      form.setValue("walletAddress", address);
    }
  }, [isConnected, address, form]);

  // Get user balance if wallet is provided
  const walletAddress = form.watch("walletAddress");
  const { data: user } = useQuery({
    queryKey: ["/api/users/wallet", walletAddress],
    enabled: !!walletAddress && faucetSchema.safeParse({ walletAddress }).success,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: (userData) => {
      if (userData?.discordVerified) {
        setDiscordVerified(true);
        setClaimStatus({ canClaim: true, message: "Ready to claim" });
      }
    },
  });

  // Get faucet stats
  const { data: faucetStats } = useQuery({
    queryKey: ["/api/faucet/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Discord verification mutation
  const discordVerifyMutation = useMutation({
    mutationFn: async () => {
      // Start Discord OAuth flow
      const clientId = "1399414587086078023";
      const currentUrl = window.location.href.split('?')[0]; // Remove query params
      const redirectUri = encodeURIComponent(currentUrl);
      const scope = "identify%20guilds";
      const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      
      window.location.href = discordOAuthUrl;
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: "Failed to start Discord verification", 
        variant: "destructive" 
      });
    },
  });

  const faucetMutation = useMutation({
    mutationFn: async (data: FaucetForm) => {
      const response = await apiRequest("POST", "/api/faucet/claim", {
        userId: "demo-user", // In real app, get from auth
        walletAddress: data.walletAddress,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/faucet/stats"] });
      setClaimStatus({
        canClaim: false,
        timeLeft: "23h 59m",
        message: "Claimed successfully! Next claim available in 24 hours."
      });
      toast({ 
        title: "Success!", 
        description: `Claimed ${data.amount} MON tokens!` 
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to claim tokens";
      if (errorMessage.includes("Discord verification")) {
        setClaimStatus({
          canClaim: false,
          message: "Discord verification required"
        });
        setDiscordVerified(false);
      } else if (errorMessage.includes("cooldown")) {
        setClaimStatus({
          canClaim: false,
          timeLeft: "23h 45m",
          message: "Faucet claim on cooldown"
        });
      }
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: FaucetForm) => {
    faucetMutation.mutate(data);
  };

  return (
    <section className="py-20 min-h-screen page-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel font-bold text-4xl md:text-6xl text-white mb-6">
            MON <span className="text-nordic-gold" data-testid="text-faucet-title">Faucet</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-faucet-description">
            Claim free MON tokens for testing and exploring the Monad ecosystem
          </p>
        </div>

        {/* Faucet Interface */}
        <Card className="bg-viking-dark/90 backdrop-blur-sm border-nordic-gold/30 max-w-2xl mx-auto shadow-2xl">
          <CardContent className="p-8">
            {/* Hero Image */}
            <div className="mb-8 relative rounded-xl overflow-hidden">
              <img
                src="/background.png"
                alt="Aurora borealis over Nordic landscape"
                className="w-full h-48 object-cover"
                data-testid="img-faucet-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-viking-dark to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-nordic-gold text-6xl animate-float">
                  <Coins className="h-16 w-16" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="font-cinzel font-bold text-3xl text-white mb-4">Claim Your MON</h2>
              <p className="text-gray-300 mb-6" data-testid="text-faucet-instructions">
                Get 0.05 free MON tokens every 24 hours for testing purposes
              </p>

              {/* Discord Verification Status */}
              <div className={`p-4 rounded-lg border mb-6 ${
                discordVerified 
                  ? 'bg-green-900/20 border-green-500/30' 
                  : 'bg-yellow-900/20 border-yellow-500/30'
              }`}>
                <div className="flex items-center justify-center">
                  <Shield className={`mr-2 h-5 w-5 ${discordVerified ? 'text-green-400' : 'text-yellow-400'}`} />
                  <span className={discordVerified ? 'text-green-400' : 'text-yellow-400'}>
                    {discordVerified ? '✓ Discord Verified' : '⚠ Discord Verification Required'}
                  </span>
                </div>
                {!discordVerified && (
                  <Button
                    onClick={() => discordVerifyMutation.mutate()}
                    disabled={discordVerifyMutation.isPending}
                    className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {discordVerifyMutation.isPending ? "Redirecting..." : "Verify with Discord"}
                  </Button>
                )}
              </div>

              {/* Current Balance */}
              <div className="bg-rune-gray rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-400 mb-1">
                  {isConnected ? "Connected Wallet Balance" : "Your Current Balance"}
                </div>
                <div className="text-2xl font-bold text-nordic-gold" data-testid="text-current-balance">
                  {isConnected && balance 
                    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
                    : (user?.odinBalance || "0") + " MON"
                  }
                </div>
                {isConnected && address && (
                  <div className="text-xs text-gray-500 mt-1 break-all">
                    {address}
                  </div>
                )}
              </div>
            </div>

            {/* Wallet Connection */}
            {!isConnected && (
              <div className="text-center mb-6">
                <p className="text-gray-300 mb-4">Connect your wallet to auto-fill address</p>
                <CustomConnectButton />
              </div>
            )}

            {/* Faucet Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold">Wallet Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="0x... or connect wallet to auto-fill"
                            className="bg-rune-gray border-nordic-gold/30 text-white focus:border-nordic-gold pr-12"
                            data-testid="input-wallet-address"
                            {...field}
                          />
                          {isConnected && address && (
                            <Button
                              type="button"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2 bg-nordic-gold text-black hover:bg-yellow-500"
                              onClick={() => form.setValue("walletAddress", address)}
                            >
                              <Wallet className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Claim Status */}
                <div className={`p-4 rounded-lg border ${
                  claimStatus.canClaim 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-yellow-900/20 border-yellow-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={claimStatus.canClaim ? 'text-green-400' : 'text-yellow-400'}>
                      {claimStatus.canClaim ? '✓' : '⏱'} {claimStatus.message}
                    </span>
                    {claimStatus.timeLeft && (
                      <span className="text-gray-400 text-sm" data-testid="text-time-left">
                        Next claim in: {claimStatus.timeLeft}
                      </span>
                    )}
                  </div>
                </div>

                {/* Claim Button */}
                <Button
                  type="submit"
                  disabled={faucetMutation.isPending || !claimStatus.canClaim || !discordVerified}
                  className="w-full bg-nordic-gold text-black hover:bg-yellow-500 transition-all transform hover:scale-105 animate-glow font-bold text-lg py-4 rounded-xl disabled:opacity-50"
                  data-testid="button-claim-tokens"
                >
                  {faucetMutation.isPending ? (
                    "Claiming..."
                  ) : !discordVerified ? (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Discord Verification Required
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-5 w-5" />
                      Claim 0.05 MON Tokens
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Faucet Rules */}
            <div className="bg-rune-gray/50 rounded-lg p-4 mt-6">
              <h3 className="font-cinzel font-bold text-white mb-2">Faucet Rules</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Discord verification required</li>
                <li>• Must be member of our Discord server</li>
                <li>• Maximum 0.05 MON per claim</li>
                <li>• 24-hour cooldown between claims</li>
                <li>• Valid wallet address required</li>
                <li>• For testing purposes only</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Faucet Stats */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-total-claimed">
              {parseFloat(faucetStats?.totalClaimed || "0").toLocaleString()}
            </div>
            <div className="text-gray-400">Total Tokens Distributed</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-unique-claimers">
              {faucetStats?.totalClaimers?.toLocaleString() || "0"}
            </div>
            <div className="text-gray-400">Unique Claimers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
