
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from 'viem'
import { useToast } from "@/hooks/use-toast"

// Define Monad Testnet chain
const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com/',
    },
  },
  testnet: true,
});

// 1. Get projectId from https://cloud.reown.com
const projectId = 'cd1470d72dea13504ebf2c8699ace66f'

// 2. Set up Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [monadTestnet, mainnet, arbitrum],
  projectId,
  ssr: false
})

// 3. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [monadTestnet, mainnet, arbitrum],
  projectId,
  metadata: {
    name: 'Valhalla NFT',
    description: 'Viking Warriors NFT Collection',
    url: 'https://valhallanft.vercel.app',
    icons: ['https://valhallanft.vercel.app/valhalla-logo.png']
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#CE8946',
    '--w3m-color-mix': '#CE8946',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family': 'Cinzel, serif',
    '--w3m-font-size-master': '14px',
    '--w3m-z-index': 1000
  },
  features: {
    analytics: false,
    email: false,
    socials: []
  }
})

// Custom Connect Button Component
export function CustomConnectButton() {
  const { toast } = useToast();

  const handleConnectClick = () => {
    toast({
      title: "Coming Soon!",
      description: "Web3 wallet connection will be available soon.",
      duration: 3000,
    });
  };

  return (
    <w3m-button />
  );
}

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
