"use client";
import Navbar from "@/components/Navbar";
import NFTCard from "@/components/NFTCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArtistTracks } from "@/hooks/useArtistTracks";
import { useFanTracks } from "@/hooks/useFanTracks";
import { getIPFSUrl } from "@/lib/pinata";
import { parseBigInt } from "@/lib/utils";
import {
  DollarSign,
  Music,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useAccount } from "wagmi";

const Dashboard = () => {
  // Mock data

  const { isConnected } = useAccount();
  const {
    tracks: myTracks,
    totalEarnings,
    isLoading,
    error,
  } = useArtistTracks();

  const {
    ownedTracks,
    totalSpent,
    isLoading: fanLoading,
    error: errorFan,
  } = useFanTracks();
  const stats = [
    {
      title: "Total Earnings",
      value: `${parseBigInt(totalEarnings)} ETH`,
      icon: DollarSign,
    },
    {
      title: "Total Spent",
      value: `${parseBigInt(totalSpent)} ETH`,
      icon: TrendingDown,
    },
    {
      title: "Tracks Minted",
      value: myTracks.length,
      icon: Music,
    },
    {
      title: "Revenue This Month",
      value: `${parseBigInt(totalEarnings)} ETH`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Manage your music NFTs and track your performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs for My Tracks and Owned Tracks */}
          <Tabs defaultValue="my-tracks" className="space-y-8">
            <TabsList className="bg-card/50">
              <TabsTrigger value="my-tracks">My Tracks</TabsTrigger>
              <TabsTrigger value="owned">Owned Tracks</TabsTrigger>
              <TabsTrigger value="transactions">
                Transaction History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-tracks">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myTracks.map((track) => (
                  <NFTCard
                    key={track.tokenId}
                    artist={track.artist}
                    coverUrl={
                      track.metadata?.image
                        ? getIPFSUrl(track.metadata.image)
                        : "/music-cover.jpg"
                    }
                    tokenId={track.tokenId.toString()}
                    genre={
                      track.metadata?.attributes.find(
                        (i) => i.trait_type === "genre"
                      )?.value ?? ""
                    }
                    price={`${parseBigInt(track.price)}`}
                    title={track.metadata?.name ?? "awikwok"}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="owned">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ownedTracks.map((track) => (
                  <NFTCard
                    key={track.tokenId}
                    artist={track.artist}
                    coverUrl={
                      track.metadata?.image
                        ? getIPFSUrl(track.metadata.image)
                        : "/music-cover.jpg"
                    }
                    tokenId={track.tokenId.toString()}
                    genre={
                      track.metadata?.attributes.find(
                        (i) => i.trait_type === "genre"
                      )?.value ?? ""
                    }
                    price={`${parseBigInt(track.price)}`}
                    title={track.metadata?.name ?? "awikwok"}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="glass-card border-border/50">
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">
                    Transaction history will appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
