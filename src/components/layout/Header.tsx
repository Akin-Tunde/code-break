import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Moon, Sun, ChevronDown, Copy, ExternalLink, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useWallet } from "@/hooks/useWallet";
import { useFarcasterAuth } from "@/hooks/useFarcasterAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { address, isConnected, isConnecting, balance, connect, disconnect, formatAddress, formatBalance } = useWallet();
  const { 
    isAutoConnecting, 
    isFarcasterEnvironment, 
    isFarcasterConnected,
    connectWithFarcaster
  } = useFarcasterAuth();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

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

          {!isConnected ? (
            <div className="flex gap-2">
              <Button
                onClick={connect}
                disabled={isConnecting || isAutoConnecting}
                className="gradient-primary glow-primary px-3 sm:px-4"
              >
                <Wallet className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {isConnecting || isAutoConnecting ? "Connecting..." : "Connect Wallet"}
                </span>
                <span className="sm:hidden">
                  {isConnecting || isAutoConnecting ? "..." : "Connect"}
                </span>
              </Button>
              {isFarcasterEnvironment && (
                <Button
                  onClick={connectWithFarcaster}
                  disabled={isConnecting || isAutoConnecting}
                  variant="secondary"
                  className="px-3 sm:px-4"
                >
                  <User className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Farcaster</span>
                  <span className="sm:hidden">FC</span>
                </Button>
              )}
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-3 sm:px-4">
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">
                      {formatAddress(address!)}
                    </span>
                    <span className="sm:hidden">
                      {formatAddress(address!)}
                    </span>
                    {isFarcasterConnected && (
                      <Badge variant="secondary" className="ml-2 text-xs px-1 py-0 bg-purple-500/20 text-purple-300">
                        FC
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">Connected Wallet</p>
                        {isFarcasterConnected && (
                          <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                            Farcaster
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs leading-none text-muted-foreground">
                        {formatAddress(address!)}
                      </p>
                    </div>
                    {balance && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {formatBalance(balance.value, balance.decimals)} {balance.symbol}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAddress}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy Address</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openExplorer}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>View on Explorer</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => disconnect()} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
