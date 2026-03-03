/* The recovery page holds the secetors for the sleep. hydrations and soreness. Also has a series of recovery technques that the user can tik off
to enhance his recovery socre. The user can then save the recovery score and track his revoery progress. 

*/ 



"use client";

import { useState, useEffect } from "react";
import {
  FaBed,
  FaTint,
  FaRunning,
  FaChartLine,
  FaCheckCircle,
  FaSave
} from "react-icons/fa";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

type ActivityKey = "stretch" | "ice" | "massage" | "foam";

type RecoveryLog = {
  id?:string;
  date:string;
  score:number;
  sleep:number;
  water:number;
  soreness:number;
};

export default function RecoveryPage() {

  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  const [sleep,setSleep] = useState(7);
  const [water,setWater] = useState(2);
  const [soreness,setSoreness] = useState(3);
  const [savedToday,setSavedToday] = useState(false);

  const [activities,setActivities] = useState<Record<ActivityKey, boolean>>({
    stretch:false,
    ice:false,
    massage:false,
    foam:false
  });

  const [logs,setLogs] = useState<RecoveryLog[]>([]);
  const [docId,setDocId] = useState<string | null>(null);

  const toggleActivity = (key:ActivityKey)=>{
    setActivities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sleepScore = (sleep / 10) * 40;
  const waterScore = (water / 5) * 30;
  const sorenessScore = ((5 - soreness) / 5) * 30;
  const recoveryScore = Math.round(sleepScore + waterScore + sorenessScore);

  // FETCH DATA
  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;

      const q = query(
        collection(db,"recoveryLogs"),
        where("userId","==",user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }));

      setLogs(data as any);

      // check today's log
      const todayLog:any = data.find((l:any)=> l.date === today);

      if(todayLog){
        setSleep(todayLog.sleep);
        setWater(todayLog.water);
        setSoreness(todayLog.soreness);
        setDocId(todayLog.id);
        setSavedToday(true);
      }
    };

    fetchLogs();
  }, [user]);

  // SAVE / UPDATE
  const saveRecovery = async ()=>{

    if (!user) return;

    const newLog = {
      userId:user.uid,
      date: today,
      score: recoveryScore,
      sleep,
      water,
      soreness,
      activities
    };

    if(docId){
      await updateDoc(doc(db,"recoveryLogs",docId), newLog);

      setLogs(logs.map(l =>
        l.id === docId ? { ...newLog, id:docId } : l
      ));
    } else {
      const docRef = await addDoc(collection(db,"recoveryLogs"), newLog);

      setLogs([{...newLog,id:docRef.id}, ...logs]);
      setDocId(docRef.id);
    }

    setSavedToday(true);
  };

  const editLog = (log:RecoveryLog)=>{
    setSleep(log.sleep);
    setWater(log.water);
    setSoreness(log.soreness);
    setSavedToday(false);
    setDocId(log.id || null);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const activityList:{key:ActivityKey,label:string}[] = [
    {key:"stretch",label:"Stretching"},
    {key:"ice",label:"Ice Bath"},
    {key:"massage",label:"Massage"},
    {key:"foam",label:"Foam Rolling"}
  ];

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-4xl font-bold">Recovery</h1>
        <p className="text-gray-400 mt-1">
          Track sleep, hydration and muscle recovery
        </p>
      </div>

      <div className="bg-[#0B0F1A]/80 p-8 rounded-3xl border border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FaChartLine className="text-3xl text-purple-400" />
          <div>
            <p className="text-gray-400">Recovery Score</p>
            <h2 className="text-5xl font-bold mt-1">{recoveryScore}%</h2>
          </div>
        </div>

        <button
          onClick={saveRecovery}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
          ${savedToday
            ? "bg-green-600"
            : "bg-gradient-to-r from-purple-600 to-pink-500"}
          `}
        >
          <FaSave/>
          {savedToday ? "Saved" : "Save Today"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-[#0B0F1A]/80 p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <FaBed className="text-purple-400"/>
            <h3 className="text-xl font-semibold">Sleep</h3>
          </div>
          <input type="range" min="3" max="10" value={sleep}
            onChange={e=>{setSleep(Number(e.target.value));setSavedToday(false);}}
            className="w-full"/>
          <p className="text-gray-400 mt-2">{sleep} hours</p>
        </div>

        <div className="bg-[#0B0F1A]/80 p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <FaTint className="text-purple-400"/>
            <h3 className="text-xl font-semibold">Hydration</h3>
          </div>
          <input type="range" min="1" max="5" step="0.5" value={water}
            onChange={e=>{setWater(Number(e.target.value));setSavedToday(false);}}
            className="w-full"/>
          <p className="text-gray-400 mt-2">{water} Liters</p>
        </div>

        <div className="bg-[#0B0F1A]/80 p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <FaRunning className="text-purple-400"/>
            <h3 className="text-xl font-semibold">Soreness</h3>
          </div>
          <input type="range" min="1" max="5" value={soreness}
            onChange={e=>{setSoreness(Number(e.target.value));setSavedToday(false);}}
            className="w-full"/>
          <p className="text-gray-400 mt-2">Level {soreness}/5</p>
        </div>

      </div>

      <div className="bg-[#0B0F1A]/80 p-6 rounded-3xl border border-white/10">
        <h3 className="text-xl font-semibold mb-6">Recovery Activities</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {activityList.map(item=>(
            <button
              key={item.key}
              onClick={()=>toggleActivity(item.key)}
              className={`p-4 rounded-xl border flex items-center gap-3 transition
              ${activities[item.key]
                ? "border-purple-500 bg-purple-600/20"
                : "border-white/10 hover:border-purple-500"}
              `}
            >
              <FaCheckCircle className="text-purple-400"/>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0B0F1A]/80 p-6 rounded-3xl border border-white/10">
        <h3 className="text-xl font-semibold mb-6">Recent Recovery Logs</h3>

        {logs.length === 0 && (
          <p className="text-gray-500">No logs saved yet.</p>
        )}

        <div className="space-y-3">
          {logs.map(log=>(
            <div key={log.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
              
              <div>
                <p>{log.date}</p>
                <p className="text-sm text-gray-400">
                  Sleep {log.sleep}h • Water {log.water}L • Soreness {log.soreness}/5
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-purple-400 font-semibold">{log.score}%</span>
                <button
                  onClick={()=>editLog(log)}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Edit
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}