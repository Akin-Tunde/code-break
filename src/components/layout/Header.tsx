import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useFarcasterAuth } from "@/hooks/useFarcasterAuth";
import { Badge } from "@/components/ui/badge";
import { truncateAddress } from "@/lib/utils";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { 
    isFarcasterEnvironment, 
    isFarcasterConnected
  } = useFarcasterAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center font-bold text-lg glow-primary">
              CB
            </div>
            <span className="hidden sm:inline text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ChainBreaker
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* AppKit Connect Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => open()}
              className="gradient-primary glow-primary px-3 sm:px-4"
            >
              <span className="hidden sm:inline">
                {isConnected && address ? truncateAddress(address) : "Connect Wallet"}
              </span>
              <span className="sm:hidden">
                {isConnected && address ? truncateAddress(address) : "Connect"}
              </span>
            </Button>
            
            {/* Farcaster Status Badge */}
            {isFarcasterConnected && isFarcasterEnvironment && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Farcaster
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
