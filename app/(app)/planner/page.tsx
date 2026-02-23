"use client";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import AddWorkoutModal from "../dashboard/AddWorkoutModal";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

type Workout = {
  id: any;
  title:string;
  type:string;
  duration:string;
  calories:string;
  time:string;
  date:string;
};

export default function PlannerPage() {

  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate,setSelectedDate] = useState(today);
  const [weekOffset,setWeekOffset] = useState(0);

  const [openModal,setOpenModal] = useState(false);
  const [editingWorkout,setEditingWorkout] = useState<Workout | null>(null);
  const [workouts,setWorkouts] = useState<Workout[]>([]);


  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;

      const q = query(
        collection(db, "workouts"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setWorkouts(data as any);
    };

    fetchWorkouts();
  }, [user]);

  const getWeekDates = () => {
    const start = new Date();
    start.setDate(start.getDate() + weekOffset * 7);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));

    return Array.from({ length:7 }).map((_,i)=>{
      const d = new Date(monday);
      d.setDate(monday.getDate()+i);
      return d;
    });
  };

  const weekDates = getWeekDates();


  const saveWorkout = async (workout:any) => {

    if (!user) return;

    const exists = workouts.some(
      w =>
        w.date === selectedDate &&
        w.time === workout.time &&
        w.id !== editingWorkout?.id
    );

    if(exists){
      alert("You already have a session in this time slot");
      return;
    }

    if(editingWorkout){
      await updateDoc(doc(db, "workouts", editingWorkout.id), {
        ...workout,
        date:selectedDate
      });

      setWorkouts(workouts.map(w =>
        w.id === editingWorkout.id ? { ...workout, id:w.id, date:selectedDate } : w
      ));

      setEditingWorkout(null);
    } 
    else {
      const docRef = await addDoc(collection(db, "workouts"), {
        ...workout,
        date:selectedDate,
        userId:user.uid,
        createdAt:new Date()
      });

      setWorkouts([...workouts,{...workout,id:docRef.id,date:selectedDate}]);
    }

    setOpenModal(false);
  };

  const deleteWorkout = async (id:any)=>{
    await deleteDoc(doc(db, "workouts", id));
    setWorkouts(workouts.filter(w => w.id !== id));
  }

  const editWorkout = (workout:Workout)=>{
    setEditingWorkout(workout);
    setOpenModal(true);
  }

  const order = ["Morning","Afternoon","Evening","Night"];

  const filteredWorkouts = workouts
    .filter(w => w.date === selectedDate)
    .sort((a,b)=> order.indexOf(a.time) - order.indexOf(b.time));

  const selectedDayName = new Date(selectedDate)
    .toLocaleDateString("en-US",{ weekday:"long" });

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Training Planner</h1>
          <p className="text-gray-400 mt-1">
            Plan and manage your weekly workouts
          </p>
        </div>

        <button
          onClick={()=>{setOpenModal(true);setEditingWorkout(null);}}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold hover:opacity-90"
        >
          <Plus size={20} />
          Add Workout
        </button>
      </div>

      <AddWorkoutModal
        isOpen={openModal}
        onClose={()=>{setOpenModal(false);setEditingWorkout(null);}}
        onSave={saveWorkout}
        editingWorkout={editingWorkout}
      />

      <div className="bg-[#0B0F1A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10">

        <div className="flex justify-between mb-6">
          <button
            onClick={()=>setWeekOffset(weekOffset-1)}
            className="px-4 py-2 rounded-lg border border-white/10 hover:border-purple-500"
          >
            ← Previous
          </button>

          <button
            onClick={()=>setWeekOffset(weekOffset+1)}
            className="px-4 py-2 rounded-lg border border-white/10 hover:border-purple-500"
          >
            Next →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 text-center">
          {weekDates.map((dateObj)=>{
            const dateStr = dateObj.toISOString().split("T")[0];
            const isSelected = selectedDate === dateStr;

            return(
              <button
                key={dateStr}
                onClick={()=>setSelectedDate(dateStr)}
                className={`p-4 rounded-xl border transition-all duration-300
                ${isSelected
                  ? "bg-gradient-to-br from-purple-600/30 to-pink-500/30 border-pink-500 shadow-lg shadow-pink-500/20"
                  : "border-white/10 text-gray-400 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20"
                }`}
              >
                <p className="font-semibold">
                  {dateObj.toLocaleDateString("en-US",{weekday:"short"})}
                </p>
                <p className="text-sm mt-1">{dateObj.getDate()}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          {selectedDayName} Sessions
        </h2>

        {filteredWorkouts.length === 0 && (
          <div className="bg-[#0B0F1A]/70 border border-dashed border-white/10 rounded-3xl p-10 text-center">
            <p className="text-xl text-gray-400">Rest day </p>
            <p className="text-sm text-gray-500 mt-2">
              No sessions planned. Add a workout to stay consistent.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {filteredWorkouts.map(w=>(
            <div key={w.id} className="bg-[#0B0F1A]/80 p-6 rounded-3xl border border-white/10 hover:border-purple-500 transition">
              
              <div className="flex justify-between">
                <p className="text-gray-400">{w.time}</p>

                <div className="flex gap-4 text-sm">
                  <button onClick={()=>editWorkout(w)} className="text-purple-400 hover:text-purple-300">
                    Edit
                  </button>
                  <button onClick={()=>deleteWorkout(w.id)} className="text-red-400 hover:text-red-300">
                    Delete
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mt-1">{w.title}</h3>
              <p className="text-gray-500 mt-2">{w.type}</p>

              <div className="mt-6 flex justify-between text-sm text-gray-400">
                <span>⏱ {w.duration} min</span>
                <span>{w.calories} kcal</span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}