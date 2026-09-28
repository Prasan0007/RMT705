import { getLeaderboard, getRecentBigPulls } from "@/lib/leaderboard";
import { LeaderboardBrowser } from "@/components/leaderboard/LeaderboardBrowser";

export default async function LeaderboardPage() {
  const [today, week, bigPulls] = await Promise.all([
    getLeaderboard("today"),
    getLeaderboard("week"),
    getRecentBigPulls(10),
  ]);

  return <LeaderboardBrowser today={today} week={week} bigPulls={bigPulls} />;
}
