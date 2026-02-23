"use client";

import { FaChartLine, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

type Recovery = {
  score:number;
  sleep:number;
  water:number;
  soreness:number;
};

export default function RecoveryPreview() {

  const { user } = useAuth();

  const [recovery,setRecovery] = useState<Recovery>({
    score: 0,
    sleep: 0,
    water: 0,
    soreness: 0
  });

  // MATCH FIRESTORE DATE FORMAT
  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    const fetchRecovery = async () => {
      if (!user) return;

      const q = query(
        collection(db,"recoveryLogs"), // ✅ FIXED NAME
        where("userId","==",user.uid),
        where("date","==",today)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data:any = snapshot.docs[0].data();

        setRecovery({
          score: data.score || 0,
          sleep: data.sleep || 0,
          water: data.water || 0,
          soreness: data.soreness || 0
        });
      }
    };

    fetchRecovery();
  }, [user]);

  return (
    <div className="bg-[#0B0F1A]/80 p-8 rounded-3xl border border-white/10">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Today's Recovery</h2>
        <FaChartLine className="text-purple-400 text-xl"/>
      </div>

      <div className="grid grid-cols-2 gap-6 text-gray-300">

        <div>
          <p className="text-sm text-gray-400">Score</p>
          <p className="text-3xl font-bold text-purple-400">
            {recovery.score}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Sleep</p>
          <p className="text-xl">
            {recovery.sleep} hrs
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Hydration</p>
          <p className="text-xl">
            {recovery.water} L
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Soreness</p>
          <p className="text-xl">
            {recovery.soreness}/5
          </p>
        </div>

      </div>

      <Link
        href="/recovery"
        className="mt-6 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
      >
        Update Recovery <FaArrowRight/>
      </Link>

    </div>
  );
}