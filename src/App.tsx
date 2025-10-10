import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { FarcasterProvider } from "@/providers/FarcasterProvider";
import GameView from "./pages/GameView";
import LeaderboardView from "./pages/LeaderboardView";
import ProfileView from "./pages/ProfileView";
import RulesView from "./pages/RulesView";
import NotFound from "./pages/NotFound";

const App = () => (
  <FarcasterProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppShell>
        <Routes>
          <Route path="/" element={<GameView />} />
          <Route path="/leaderboard" element={<LeaderboardView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/rules" element={<RulesView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </TooltipProvider>
  </FarcasterProvider>
);

export default App;
