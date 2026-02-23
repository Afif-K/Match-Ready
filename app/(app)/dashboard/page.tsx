import DashboardHero from "./DashboardHero";
import Stats from "./Stats";
import MatchesPreview from "./MatchesPreview";
import RecoveryPreview from "./RecoveryPreview";
import TodayWorkouts from "./TodayWorkouts";
export default function DashboardPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <DashboardHero />
      <Stats />
      <MatchesPreview />
      <RecoveryPreview />
      <TodayWorkouts />
    </div>
  );
}
