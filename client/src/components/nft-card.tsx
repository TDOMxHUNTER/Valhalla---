import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Nft } from "@shared/schema";

interface NftCardProps {
  nft: Nft;
  onViewDetails?: (nft: Nft) => void;
}

export default function NftCard({ nft, onViewDetails }: NftCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'bg-yellow-500 text-black';
      case 'epic':
        return 'bg-purple-500 text-white';
      case 'rare':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-viking-dark rounded-2xl overflow-hidden border border-nordic-gold/20 hover:border-nordic-gold/50 transition-all transform hover:-translate-y-2 hover:shadow-2xl">
      <img
        src={nft.imageUrl}
        alt={nft.name}
        className="w-full h-64 object-cover"
        data-testid={`img-nft-${nft.tokenId}`}
      />
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 
            className="font-cinzel font-bold text-xl text-white"
            data-testid={`text-nft-name-${nft.tokenId}`}
          >
            {nft.name}
          </h3>
          <Badge 
            className={getRarityColor(nft.rarity)}
            data-testid={`badge-rarity-${nft.tokenId}`}
          >
            {nft.rarity}
          </Badge>
        </div>
        <p 
          className="text-gray-400 mb-4"
          data-testid={`text-category-${nft.tokenId}`}
        >
          {nft.category}
        </p>
        <div className="flex justify-between items-center">
          <span 
            className="text-nordic-gold font-bold text-lg"
            data-testid={`text-price-${nft.tokenId}`}
          >
            {nft.price} ETH
          </span>
          <Button
            onClick={() => onViewDetails?.(nft)}
            className="bg-nordic-gold text-black hover:bg-yellow-500 font-semibold"
            data-testid={`button-view-details-${nft.tokenId}`}
          >
            View Details
          </Button>
        </div>
        {nft.isStaked && (
          <Badge 
            variant="secondary" 
            className="mt-2 bg-green-600 text-white"
            data-testid={`badge-staked-${nft.tokenId}`}
          >
            STAKED
          </Badge>
        )}
      </div>
    </div>
  );
}
