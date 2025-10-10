import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock, Target } from "lucide-react";

interface Activity {
  id: string;
  player: string;
  difficulty: string;
  attempts: number;
  time: number;
  won: boolean;
  timestamp: Date;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activities.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activities.length]);

  if (activities.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No recent activities</p>
        </CardContent>
      </Card>
    );
  }

  const activity = activities[currentIndex];

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-fade-in">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${
                  activity.won
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-base font-semibold">
                  {formatAddress(activity.player)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.difficulty} • {activity.won ? "Won" : "Lost"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatTime(activity.time)}
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.attempts} attempts
              </p>
            </div>
          </div>
          
          {/* Activity indicator dots */}
          <div className="flex justify-center gap-2 mt-4">
            {activities.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
