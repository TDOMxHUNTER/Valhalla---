import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NftCard from "@/components/nft-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Nft } from "@shared/schema";

export default function Collection() {
  return (
    <section className="py-20 min-h-screen page-background">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="/image-39.ico" 
            alt="Valhalla NFT" 
            className="h-32 w-auto mx-auto mb-8 opacity-80"
          />
        </div>
        <h1 className="font-cinzel font-bold text-6xl md:text-8xl text-nordic-gold mb-6 animate-pulse">
          COMING SOON
        </h1>
        <p className="text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          The Viking Warriors collection is being forged in the fires of creation
        </p>
        <div className="text-gray-400">
          <p>Prepare for battle. The greatest NFT collection awaits.</p>
        </div>
      </div>
    </section>
  );
}