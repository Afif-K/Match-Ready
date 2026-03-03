/* This component is the dashboard page where it has the general information on the users page. It shows the general view if the workouts,
calories burned, training score, and the upcoming matches and the plans for todays workouts.  
*/ 



import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardHero() {
  return (
    <section className="relative pt-12 pr-12 pb-2 pl-12">


      {/* glow background */}
      <div className="absolute -top-10 right-20 w-[350px] h-[350px] bg-purple-600/20 blur-3xl rounded-full" />
      <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-pink-500/20 blur-3xl rounded-full" />

      <div className="relative bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-purple-400" size={30} />
          <h1 className="text-5xl font-bold text-white">
            Welcome back, Athlete
          </h1>
        </div>

        <p className="text-gray-400 text-lg max-w-2xl">
          Track football performance, monitor training load, analyze recovery
          and stay match-ready every day.
        </p>

{/* Buttons */}
          <div className="flex justify-center mt-8 gap-6">
            <Link href="/planner">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-lg font-semibold hover:opacity-90 transition">
             Start Training
            </button>
            </Link>

            <Link href="/planner">
            <button className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition text-lg">
            View Planner
            </button>
          </Link>
        </div>


      </div>
    </section>
  );
}
