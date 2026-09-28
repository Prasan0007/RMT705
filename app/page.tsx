import { getRecentPulls } from "@/lib/leaderboard";
import { LandingClient } from "@/components/landing/LandingClient";

export default async function LandingPage() {
  const recentPulls = await getRecentPulls(12);
  return <LandingClient recentPulls={recentPulls} />;
}
