"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface NFTCardProps {
  title: string;
  artist: string;
  genre: string;
  price: string;
  coverUrl: string;
  tokenId: string;
}

const NFTCard = ({
  title,
  artist,
  genre,
  price,
  coverUrl,
  tokenId,
}: NFTCardProps) => {
  const router = useRouter();
  return (
    <Card className="glass-card nft-card-hover border-border/50 overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {/* <Button
            size="icon"
            className="rounded-full bg-primary/90 hover:bg-primary"
          >
            <Play className="h-6 w-6" />
          </Button> */}
        </div>
        <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
          {genre}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{`${artist.slice(0, 5)}...${artist.slice(-4)}`}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-bold text-primary">{price} ETH</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Token ID</p>
            <p className="text-xs font-mono">#{tokenId}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => router.push(`/track/${tokenId}`)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          NFT Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
