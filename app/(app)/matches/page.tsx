"use client";

import { useState, useRef, useEffect } from "react";

import {
  FaFutbol,
  FaMapMarkerAlt,
  FaClock,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCalendarAlt
} from "react-icons/fa";

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

type Match = {
  id:any;
  opponent:string;
  date:string;
  time:string;
  location:string;
};


//  GET COORDINATES FROM LOCATION

const getCoordinates = async (location:string) => {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) return null;

    return {
      lat: data.results[0].latitude,
      lon: data.results[0].longitude,
    };
  } catch {
    return null;
  }
};

//   WEATHER FUNCTION (LOCATION BASED)

const getWeather = async (date: string, location:string) => {
  try {
    const coords = await getCoordinates(location);
    if (!coords) return null;

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weathercode,temperature_2m_max,windspeed_10m_max&timezone=auto`
    );

    const data = await res.json();

    let index = data.daily.time.indexOf(date);

    if (index === -1) index = 0;

    return {
      temp: data.daily.temperature_2m_max[index],
      wind: data.daily.windspeed_10m_max[index],
      code: data.daily.weathercode[index],
    };

  } catch {
    return null;
  }
};
const calculateReadiness = async (match: Match, user:any, weatherData:any) => {
  try {
    if (!user) return 50;

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const workoutsSnap = await getDocs(
  query(
    collection(db,"workouts"),
    where("userId","==",user.uid)
  )
);

const recentWorkouts = workoutsSnap.docs.filter(doc=>{
  const d = doc.data();
  return new Date(d.date) >= sevenDaysAgo;
});

const recoverySnap = await getDocs(
  query(
    collection(db,"recoveryLogs"),
    where("userId","==",user.uid)
  )
);

const recentRecovery = recoverySnap.docs.filter(doc=>{
  const d = doc.data();
  return new Date(d.date) >= sevenDaysAgo;
});

let workoutScore = recentWorkouts.length * 5;
let recoveryScore = recentRecovery.length * 10;

let score = 50 + workoutScore + recoveryScore;

    const weather = weatherData[match.id];

    if (weather?.temp > 30) score -= 10;
    if (weather?.wind > 20) score -= 5;

    return Math.max(0, Math.min(100, score));
  } catch {
    return 50;
  }
};

export default function MatchesPage(){

  const { user } = useAuth();

  const [matches,setMatches] = useState<Match[]>([]);
  const [showForm,setShowForm] = useState(false);
  const [editingMatch,setEditingMatch] = useState<Match | null>(null);

  const [form,setForm] = useState({
    opponent:"",
    date:"",
    time:"",
    location:""
  });

  const [weatherData,setWeatherData] = useState<any>({});
  const [readinessMap,setReadinessMap] = useState<Record<string,number>>({});
  const updateField = (key:string,value:string)=>{
    setForm(prev=>({...prev,[key]:value}));
  };

  const openAddForm = ()=>{
    setEditingMatch(null);
    setForm({opponent:"",date:"",time:"",location:""});
    setShowForm(true);
  };

  // FETCH MATCHES

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;

      const q = query(
        collection(db,"matches"),
        where("userId","==",user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMatches(data as any);
    };

    fetchMatches();
  }, [user]);


  // FETCH WEATHER (UPDATED)

  useEffect(() => {
    const loadWeather = async () => {
      const data:any = {};

      for (let match of matches) {
        const w = await getWeather(match.date, match.location); 
        if (w) data[match.id] = w;
      }

      setWeatherData(data);
    };

    if(matches.length > 0){
      loadWeather();
    }
  }, [matches]);

useEffect(() => {
  const loadReadiness = async () => {
    if (!user) return;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const workoutsSnap = await getDocs(
      query(collection(db,"workouts"), where("userId","==",user.uid))
    );

    const recoverySnap = await getDocs(
      query(collection(db,"recoveryLogs"), where("userId","==",user.uid))
    );

    const recentWorkouts = workoutsSnap.docs.filter(doc=>{
      return new Date(doc.data().date) >= sevenDaysAgo;
    });

    const recentRecovery = recoverySnap.docs.filter(doc=>{
      return new Date(doc.data().date) >= sevenDaysAgo;
    });

    const baseScore =
      50 +
      recentWorkouts.length * 5 +
      recentRecovery.length * 10;

    const map:any = {};

    for (let m of matches) {
      let score = baseScore;

      const weather = weatherData[m.id];

      if (weather?.temp > 30) score -= 10;
      if (weather?.wind > 20) score -= 5;

      map[m.id] = Math.max(0, Math.min(100, score));
    }

    setReadinessMap(map);
  };

  if(matches.length) loadReadiness();
}, [matches, weatherData, user]);

  // SAVE MATCH
 
  const saveMatch = async ()=>{
    if(!form.opponent || !form.date || !user) return;

    if(editingMatch){
      await updateDoc(doc(db,"matches",editingMatch.id),{
        ...form
      });

      setMatches(matches.map(m =>
        m.id === editingMatch.id ? { ...form, id:m.id } : m
      ));

      setEditingMatch(null);
    } 
    else {
      const docRef = await addDoc(collection(db,"matches"),{
        ...form,
        userId:user.uid,
        createdAt:new Date()
      });

      setMatches([...matches,{...form,id:docRef.id}]);
    }

    setShowForm(false);
  };


  // DELETE MATCH
 
  const deleteMatch = async (id:any)=>{
    await deleteDoc(doc(db,"matches",id));
    setMatches(matches.filter(m=>m.id!==id));
  };

  const editMatch = (match:Match)=>{
    setEditingMatch(match);
    setForm(match);
    setShowForm(true);
  };

  const dateRef = useRef<HTMLInputElement>(null);

  const getWeatherIcon = (code:number)=>{
    if([0].includes(code)) return "☀️";
    if([1,2,3].includes(code)) return "⛅";
    if([45,48].includes(code)) return "🌫";
    if([51,53,55,61,63,65].includes(code)) return "🌧";
    if([71,73,75].includes(code)) return "❄️";
    if([95,96,99].includes(code)) return "⛈";
    return "🌤";
  };

  return(
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Matches</h1>
          <p className="text-gray-400 mt-1">
            Track upcoming fixtures and match readiness
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold"
        >
          <FaPlus/> Add Match
        </button>
      </div>

      {/* FORM */}
      {showForm && (
      <div className="relative bg-[#0B0F1A]/80 p-6 rounded-3xl border border-white/10 grid md:grid-cols-4 gap-4">

    <button
      onClick={() => setShowForm(false)}
      className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-xl"
    >
      ✕
    </button>

          <input
            placeholder="Opponent Team"
            value={form.opponent}
            onChange={e=>updateField("opponent",e.target.value)}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          />

          <div className="relative">
            <FaCalendarAlt
              onClick={()=>dateRef.current?.showPicker()}
              className="absolute right-3 top-4 text-gray-400 cursor-pointer"
            />
            <input
              ref={dateRef}
              type="date"
              value={form.date}
              onChange={e=>updateField("date",e.target.value)}
              className="p-3 w-full rounded-xl bg-white/5 border border-white/10"
            />
          </div>

          <input
            type="time"
            value={form.time}
            onChange={e=>updateField("time",e.target.value)}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          />

          <input
            placeholder="Location / Stadium"
            value={form.location}
            onChange={e=>updateField("location",e.target.value)}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          />

          <button
            onClick={saveMatch}
            className="col-span-4 py-3 rounded-xl bg-purple-600 font-semibold"
          >
            {editingMatch ? "Update Match" : "Save Match"}
          </button>
        </div>
      )}

      {matches.length === 0 && (
        <div className="bg-[#0B0F1A]/70 border border-dashed border-white/10 rounded-3xl p-10 text-center">
          <p className="text-xl text-gray-400">No matches scheduled</p>
        </div>
      )}


      <div className="grid md:grid-cols-2 gap-6">
        {matches.map((match)=>{
          const readiness = readinessMap[match.id] ?? 50;
          const weather = weatherData[match.id];

          return(
          <div key={match.id} className="bg-[#0B0F1A]/80 p-6 rounded-3xl border border-white/10 hover:border-purple-500 transition">

            <div className="flex justify-between">
              <div className="flex items-center gap-3 text-purple-400">
                <FaFutbol/>
                <p className="font-semibold">vs {match.opponent}</p>
              </div>

              <div className="flex gap-4 text-sm">
                <button onClick={()=>editMatch(match)} className="text-purple-400 hover:text-purple-300">
                  <FaEdit/>
                </button>
                <button onClick={()=>deleteMatch(match.id)} className="text-red-400 hover:text-red-300">
                  <FaTrash/>
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-gray-400">
              <p className="flex items-center gap-2">
                <FaClock/> {match.date} • {match.time}
              </p>

              <p className="flex items-center gap-2">
                <FaMapMarkerAlt/> {match.location || "Location TBD"}
              </p>
            </div>

            {weather && (
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-purple-600/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getWeatherIcon(weather.code)}
                    </span>

                    <div>
                      <p className="text-sm text-gray-400">Match Day Weather</p>
                      <p className="font-semibold text-white">
                        {weather.temp}°C • {weather.wind} km/h
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-400">
                    <p>Condition</p>
                    <p className="text-purple-400 font-medium">
                      Code {weather.code}
                    </p>
                  </div>

                </div>
              </div>
            )}

           

<div className="mt-4 p-4 rounded-2xl bg-purple-600/10 border border-purple-500/30">
  <p className="text-sm text-gray-400">Match Readiness</p>

  <div className="flex items-center justify-between">
    <p className="text-3xl font-bold text-white">{readiness}%</p>

    <div className="w-24 h-2 bg-white/10 rounded-full">
      <div
        className="h-2 rounded-full bg-purple-500"
        style={{ width: `${readiness}%` }}
      />
    </div>
  </div>

  <p className="text-xs text-purple-400 mt-1">
    {readiness > 75
      ? "Peak Condition"
      : readiness > 50
      ? "Match Ready"
      : "Needs Recovery"}
  </p>
</div>

          </div>
        )})}
      </div>

    </div>
  );
}