import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, Target, TrendingUp, Award } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserActivity {
  id: string;
  difficulty: string;
  attempts: number;
  time: number;
  won: boolean;
  date: Date;
}

const mockUserActivities: UserActivity[] = [
  {
    id: "1",
    difficulty: "Hard",
    attempts: 7,
    time: 245,
    won: true,
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: "2",
    difficulty: "Normal",
    attempts: 10,
    time: 412,
    won: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    difficulty: "Expert",
    attempts: 5,
    time: 189,
    won: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "4",
    difficulty: "Easy",
    attempts: 8,
    time: 320,
    won: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
  {
    id: "5",
    difficulty: "Hard",
    attempts: 8,
    time: 390,
    won: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
  },
];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function ProfileView() {
  const totalGames = mockUserActivities.length;
  const gamesWon = mockUserActivities.filter((a) => a.won).length;
  const winRate = Math.round((gamesWon / totalGames) * 100);
  const avgTime = Math.round(
    mockUserActivities.reduce((acc, a) => acc + a.time, 0) / totalGames
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and achievements
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">Total Games</p>
              </div>
              <p className="text-2xl font-bold">{totalGames}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-green-500" />
                <p className="text-xs text-muted-foreground">Games Won</p>
              </div>
              <p className="text-2xl font-bold text-green-500">{gamesWon}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
              <p className="text-2xl font-bold text-accent">{winRate}%</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-secondary" />
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </div>
              <p className="text-2xl font-bold text-secondary">{formatTime(avgTime)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="won">Won</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Game History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {mockUserActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              activity.won
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {activity.difficulty} Mode
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {activity.won ? "Won" : "Lost"}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{activity.attempts} attempts</span>
                            <span>•</span>
                            <span>{formatTime(activity.time)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="won" className="mt-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-500" />
                  Victories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {mockUserActivities
                      .filter((a) => a.won)
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-green-500/5 border border-green-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                              <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {activity.difficulty} Mode
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(activity.date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{activity.attempts} attempts</span>
                              <span>•</span>
                              <span>{formatTime(activity.time)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lost" className="mt-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Defeats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {mockUserActivities
                      .filter((a) => !a.won)
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                              <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {activity.difficulty} Mode
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(activity.date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{activity.attempts} attempts</span>
                              <span>•</span>
                              <span>{formatTime(activity.time)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
