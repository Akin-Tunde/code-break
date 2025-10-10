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

  // Show the most recent 4 activities
  const recentFour = activities.slice(0, 4);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {recentFour.map((activity, index) => (
            <div
              key={activity.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      activity.won
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    <Trophy className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold truncate text-foreground">
                      {formatAddress(activity.player)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {activity.difficulty} • {activity.won ? "Won" : "Lost"}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(activity.time)}
                    </div>
                    <span>{activity.attempts} attempts</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Show total count if there are more activities */}
        {activities.length > 4 && (
          <div className="text-center mt-2">
            <p className="text-xs text-muted-foreground">
              Showing {recentFour.length} of {activities.length} recent activities
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
