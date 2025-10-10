import { Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TreasuryPoolProps {
  amount: number;
}

export const TreasuryPool = ({ amount }: TreasuryPoolProps) => {
  return (
    <Card className="bg-gradient-primary border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background/10 backdrop-blur-sm">
              <Coins className="w-6 h-6 text-primary-glow" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Treasury Pool</p>
              <p className="text-2xl font-bold text-foreground">{amount.toLocaleString()} ETH</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Stakes</p>
            <p className="text-sm font-semibold text-primary-glow">Live</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
