import { Card, CardContent } from "@/components/ui/card";
import { Upload, ShoppingBag, Coins, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload & Tokenize",
      description:
        "Artists upload tracks and mint them as ERC-721 NFTs on the blockchain with IPFS storage.",
    },
    {
      icon: ShoppingBag,
      title: "Buy & Own",
      description:
        "Fans purchase music NFTs and become verifiable owners with full ownership rights.",
    },
    {
      icon: Coins,
      title: "Automatic Royalties",
      description:
        "Smart contracts distribute 90% to artists and 10% to platform automatically on each sale.",
    },
    {
      icon: Shield,
      title: "Transparent & Secure",
      description:
        "All transactions and ownership records are stored immutably on the blockchain.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How Museed Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A decentralized platform connecting artists directly with fans
            through blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-card border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
