import Hero from "@/components/Hero";
import FeaturedNFTs from "@/components/FeaturedNFTs";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <FeaturedNFTs />
    </div>
  );
};

export default Index;
