import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Web3Provider } from "@/config/Web3Provider";
import { FarcasterProvider } from "@/providers/FarcasterProvider";
import GameView from "./pages/GameView";
import LeaderboardView from "./pages/LeaderboardView";
import ProfileView from "./pages/ProfileView";
import RulesView from "./pages/RulesView";
import NotFound from "./pages/NotFound";

const App = () => (
  <FarcasterProvider>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<GameView />} />
              <Route path="/leaderboard" element={<LeaderboardView />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/rules" element={<RulesView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </FarcasterProvider>
);

export default App;
