/*Here the stats page is in charge of the score for recovery. based on the the user's input, the value enteredd is then used in an equation
for each compenent which are then merged into calculating the recovery score. Also, it takes the values of the users inouts and saves them if no
calcuation must be done or if a simple one is done such as tracking the claores burned.  
*/



"use client";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const data = [
  { day: "Mon", load: 40 },
  { day: "Tue", load: 55 },
  { day: "Wed", load: 48 },
  { day: "Thu", load: 70 },
  { day: "Fri", load: 62 },
  { day: "Sat", load: 80 },
  { day: "Sun", load: 65 },
];

export default function Stats() {

  const { user } = useAuth();

  const [totalWorkouts,setTotalWorkouts] = useState(0);
  const [totalCalories,setTotalCalories] = useState(0);
  const [trainingScore,setTrainingScore] = useState(0);
  const [recoveryScore,setRecoveryScore] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // WORKOUT DATA
      const workoutQuery = query(
        collection(db,"workouts"),
        where("userId","==",user.uid)
      );

      const workoutSnap = await getDocs(workoutQuery);

      let workoutsCount = 0;
      let caloriesSum = 0;

      workoutSnap.docs.forEach(doc => {
        const d:any = doc.data();
        workoutsCount++;
        caloriesSum += Number(d.calories || 0);
      });

      setTotalWorkouts(workoutsCount);
      setTotalCalories(caloriesSum);

      //  RECOVERY DATA
      const recoveryQuery = query(
        collection(db,"recoveryLogs"),
        where("userId","==",user.uid)
      );

      const recoverySnap = await getDocs(recoveryQuery);

      let latestRecovery = 0;

      if (!recoverySnap.empty) {
        const sorted = recoverySnap.docs.sort((a,b)=>{
          return b.data().date.localeCompare(a.data().date);
        });

        latestRecovery = sorted[0].data().score || 0;
      }

      setRecoveryScore(latestRecovery);

      //  FINAL SCORE
      const workoutScore = Math.min(
        100,
        Math.round((workoutsCount * 5) + (caloriesSum / 100))
      );

      const finalScore = Math.round(
        (workoutScore * 0.7) + (latestRecovery * 0.3)
      );

      setTrainingScore(finalScore);
    };

    fetchStats();
  }, [user]);

  return (
    <section className="relative p-10 space-y-10 overflow-hidden">

      {/* TOP CARDS */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* WORKOUTS */}
        <div className="bg-[#0B0F1A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:border-purple-500 transition">
          <p className="text-gray-400">Workouts</p>
          <h2 className="text-4xl font-bold mt-2">{totalWorkouts}</h2>
          <p className="text-green-400 text-sm mt-1">Live data</p>
        </div>

        {/* CALORIES */}
        <div className="bg-[#0B0F1A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:border-purple-500 transition">
          <p className="text-gray-400">Calories Burned</p>
          <h2 className="text-4xl font-bold mt-2">
            {totalCalories.toLocaleString()}
          </h2>
          <p className="text-green-400 text-sm mt-1">Live data</p>
        </div>

        {/* SCORE */}
        <div className="bg-[#0B0F1A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:border-purple-500 transition">
          <p className="text-gray-400">Training Score</p>
          <h2 className="text-4xl font-bold mt-2 text-purple-500">
            {trainingScore}%
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Based on training + recovery
          </p>
        </div>

      </div>

    </section>
  );
}