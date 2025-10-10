import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, HelpCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Game" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/rules", icon: HelpCircle, label: "Rules" },
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-smooth",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive && "glow-primary"
                  )}
                />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
