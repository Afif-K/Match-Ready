"use client";
import { useEffect, useState } from "react";

type Workout = {
  title: string;
  type: string;
  duration: string;
  calories: string;
  time: string;
};

export default function AddWorkoutModal({
  isOpen,
  onClose,
  onSave,
  editingWorkout
}: any) {

  const emptyForm = {
    title: "",
    type: "",
    duration: "",
    calories: "",
    time: "Morning"
  };

  const [form, setForm] = useState<Workout>(emptyForm);

  // Autofill when editing
  useEffect(() => {
    if (editingWorkout) setForm(editingWorkout);
    else setForm(emptyForm);
  }, [editingWorkout, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.title) return;
    onSave(form);
    setForm(emptyForm);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-[#0B0F1A] p-8 rounded-3xl w-[420px] border border-white/10">

        <h2 className="text-2xl font-bold mb-6">
          {editingWorkout ? "Edit Workout" : "Add Workout"}
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Workout title"
            className="w-full p-3 rounded-xl bg-black border border-white/10 focus:border-purple-500 outline-none"
            value={form.title}
            onChange={(e)=>setForm({...form,title:e.target.value})}
          />

          <select
            className="w-full p-3 rounded-xl bg-black border border-white/10 focus:border-purple-500 outline-none"
            value={form.type}
            onChange={(e)=>setForm({...form,type:e.target.value})}
          >
            <option value="">Select workout type</option>
            <option>Strength Training</option>
            <option>Cardio</option>
            <option>HIIT</option>
            <option>Mobility</option>
            <option>Recovery</option>
            <option>Field Training</option>
          </select>

          <input
            placeholder="Duration (minutes)"
            className="w-full p-3 rounded-xl bg-black border border-white/10 focus:border-purple-500 outline-none"
            value={form.duration}
            onChange={(e)=>setForm({...form,duration:e.target.value})}
          />

          <input
            placeholder="Calories burned"
            className="w-full p-3 rounded-xl bg-black border border-white/10 focus:border-purple-500 outline-none"
            value={form.calories}
            onChange={(e)=>setForm({...form,calories:e.target.value})}
          />

          <select
            className="w-full p-3 rounded-xl bg-black border border-white/10 focus:border-purple-500 outline-none"
            value={form.time}
            onChange={(e)=>setForm({...form,time:e.target.value})}
          >
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>

        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition"
          >
            {editingWorkout ? "Update Workout" : "Save Workout"}
          </button>
        </div>

      </div>
    </div>
  );
}
