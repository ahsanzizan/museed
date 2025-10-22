import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, Wallet } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";

const Navbar = () => {
  return (
    <nav className="fixed hrefp-0 left-0 right-0 z-50 border-b border-border/50 glass-card">
      <div className="container mx-auhref px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Museed</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/marketplace"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/upload"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Upload
            </Link>
            <Link
              href="/dashboard"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>

          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
