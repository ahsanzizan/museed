import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-href-b from-background/95 via-background/80 href-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Own Music as
          <br />
          <span className="gradient-text">Digital Assets</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          The first decentralized marketplace where artists tokenize their music
          and fans truly own their favorite tracks through NFTs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/marketplace">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              Explore Marketplace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/upload">
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6"
            >
              <Play className="mr-2 h-5 w-5" />
              Upload Your Music
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-lg">
            <div className="text-4xl font-bold gradient-text mb-2">500+</div>
            <div className="text-muted-foreground">Tracks Minted</div>
          </div>
          <div className="glass-card p-6 rounded-lg">
            <div className="text-4xl font-bold gradient-text mb-2">200+</div>
            <div className="text-muted-foreground">Artists</div>
          </div>
          <div className="glass-card p-6 rounded-lg">
            <div className="text-4xl font-bold gradient-text mb-2">1K+</div>
            <div className="text-muted-foreground">Collectors</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
