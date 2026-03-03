/* This page holds the users perosnal infromation. It has the users name, age, hieght woeght and his club and also could worte his goals. It 
also has his email which is fetched from Firestore. The user also has his recovery, calories and workouts present on his profile and also the 
upcoming football matches with the place and weather cinditions. 
*/ 



"use client";

import { useState, useEffect } from "react";
import {
  FaFutbol,
  FaRulerVertical,
  FaWeight,
  FaBullseye,
  FaSave,
  FaEdit
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

//  NEW IMPORTS
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfilePage() {

  const { user } = useAuth();

  const [profile,setProfile] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    age:"",
    height:"",
    weight:"",
    position:"Midfielder",
    foot:"Right",
    goals:""
  });

  const [saved,setSaved] = useState(false);
  const [editMode,setEditMode] = useState(true);

  const updateField = (key:string,value:string)=>{
    setSaved(false);
    setProfile(prev=>({...prev,[key]:value}));
  };

  //  LOAD PROFILE FROM FIRESTORE
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const docRef = doc(db, "profiles", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as any);
        setEditMode(false);
        setSaved(true);
      }
    };

    fetchProfile();
  }, [user]);

  //  SAVE PROFILE TO FIRESTORE
  const handleSaveProfile = async () => {
    if (!user) return;

    await setDoc(doc(db, "profiles", user.uid), profile);

    setSaved(true);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-gray-400 mt-1">
          Manage your athlete information
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-[#0B0F1A]/80 p-8 rounded-3xl border border-white/10 flex items-center gap-6">
        <img src={user?.photoURL || "/avatar.png"} className="w-24 h-24 rounded-full"/>
        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-gray-400">{profile.email}</p>
          <p className="text-sm text-purple-400 mt-1">Football Athlete</p>
        </div>
      </div>

      {/* SHOW PROFILE SUMMARY AFTER SAVE */}
      {!editMode && (
        <div className="bg-[#0B0F1A]/80 p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Athlete Details</h3>
            <button onClick={handleEdit} className="text-purple-400 flex items-center gap-2">
              <FaEdit/> Edit
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <p>Age: {profile.age}</p>
            <p>Height: {profile.height} cm</p>
            <p>Weight: {profile.weight} kg</p>
            <p>Position: {profile.position}</p>
            <p>Preferred Foot: {profile.foot}</p>
          </div>

          <div>
            <h4 className="text-lg mt-4 mb-2">Season Goals</h4>
            <p className="text-gray-400">{profile.goals}</p>
          </div>
        </div>
      )}

      {/* FORM */}
      {editMode && (
        <>
        <div className="bg-[#0B0F1A]/80 p-8 rounded-3xl border border-white/10 space-y-6">

          <h3 className="text-2xl font-semibold flex items-center gap-3">
            <FaFutbol className="text-purple-400"/> Athlete Info
          </h3>

          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label className="text-sm text-gray-400">Age</label>
              <input value={profile.age} onChange={e=>updateField("age",e.target.value)}
                className="mt-2 w-full p-3 rounded-xl bg-white/5 border border-white/10"/>
            </div>

            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <FaRulerVertical/> Height (cm)
              </label>
              <input value={profile.height} onChange={e=>updateField("height",e.target.value)}
                className="mt-2 w-full p-3 rounded-xl bg-white/5 border border-white/10"/>
            </div>

            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <FaWeight/> Weight (kg)
              </label>
              <input value={profile.weight} onChange={e=>updateField("weight",e.target.value)}
                className="mt-2 w-full p-3 rounded-xl bg-white/5 border border-white/10"/>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm text-gray-400">Position</label>
              <select value={profile.position} onChange={e=>updateField("position",e.target.value)}
                className="mt-2 w-full p-3 rounded-xl bg-white/5 border border-white/10">
                <option className="text-black">Goalkeeper</option>
                <option className="text-black">Defender</option>
                <option className="text-black">Midfielder</option>
                <option className="text-black">Winger</option>
                <option className="text-black">Striker</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400">Preferred Foot</label>
              <select value={profile.foot} onChange={e=>updateField("foot",e.target.value)}
                className="mt-2 w-full p-3 rounded-xl bg-white/5 border border-white/10">
                <option className="text-black">Right</option>
                <option className="text-black">Left</option>
                <option className="text-black">Both</option>
              </select>
            </div>

          </div>

        </div>

        <div className="bg-[#0B0F1A]/80 p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-2xl font-semibold flex items-center gap-3">
            <FaBullseye className="text-purple-400"/> Season Goals
          </h3>

          <textarea rows={5} value={profile.goals}
            onChange={e=>updateField("goals",e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10"/>

          <button onClick={handleSaveProfile}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold">
            <FaSave/> Save Profile
          </button>
        </div>
        </>
      )}

    </div>
  );
}