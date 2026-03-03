/* This component is for daily workouts by choosing the type, duration, calroies, time and date. It helps the user paln his workouts
effectivly and makes sure that no workout coincides with another. The workouts can be planned for future ones. s
*/




"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { FaRunning, FaDumbbell, FaHeartbeat, FaFutbol } from "react-icons/fa";

type Workout = {
  id:any;
  title:string;
  type:string;
  duration:string;
  calories:string;
  time:string;
  date:string;
};

export default function TodayWorkouts() {

  const { user } = useAuth();
  const [workouts,setWorkouts] = useState<Workout[]>([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchToday = async () => {
      if (!user) return;

      const q = query(
        collection(db,"workouts"),
        where("userId","==",user.uid),
        where("date","==",today)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }));

      setWorkouts(data as any);
    };

    fetchToday();
  }, [user]);

  const order = ["Morning","Afternoon","Evening","Night"];

  const sorted = [...workouts].sort(
    (a,b)=> order.indexOf(a.time) - order.indexOf(b.time)
  );

  const getIcon = (type:string)=>{
    switch(type.toLowerCase()){
      case "cardio": return <FaRunning className="text-pink-400 text-xl"/>;
      case "strength": return <FaDumbbell className="text-purple-400 text-xl"/>;
      case "recovery": return <FaHeartbeat className="text-green-400 text-xl"/>;
      default: return <FaFutbol className="text-blue-400 text-xl"/>;
    }
  };

  return (
    <div className="bg-[#0B0F1A]/80 p-8 rounded-3xl border border-white/10 space-y-6">

      <h2 className="text-2xl font-semibold">Today’s Plan</h2>

      {sorted.length === 0 && (
        <p className="text-gray-500">No sessions today</p>
      )}

      <div className="space-y-4">
        {sorted.map(w=>(
          <div
            key={w.id}
            className="flex justify-between items-center border-b border-white/10 pb-4"
          >

            {/* LEFT SIDE (ICON + INFO) */}
            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-500/20 flex items-center justify-center border border-white/10">
                {getIcon(w.type)}
              </div>

              <div>
                <p className="text-sm text-gray-400">{w.time}</p>
                <p className="font-semibold">{w.title}</p>
                <p className="text-xs text-gray-500">{w.type}</p>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="text-right text-sm text-gray-400">
              <p>{w.duration} min</p>
              <p>{w.calories} kcal</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}