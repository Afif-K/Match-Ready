/* This component represents the main dashboard page of the application. It acts as a layout container that organizes and displays all major
dashboard sections in a structured format.
*/

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
