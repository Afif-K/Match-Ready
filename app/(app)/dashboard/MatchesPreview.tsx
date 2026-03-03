/* This component is how the user can add a match and then view it. Here there is a use of two API's , one for the upcoming matches and the 
other one is for the weather based on where the game is. So the user inouts his team and then he will get a list of the teams he will play
against, and the weather comditions for the game. It will give him a heads up on what to use as cleats and how to tailer is warmup and recovery.
Uses React hooks (useState/useEffect) and AuthContext.
*/ 



"use client";

import { FaFutbol, FaClock, FaCloudSun } from "react-icons/fa";
import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

type Match = {
  id: any;
  opponent: string;
  date: string;
  time: string;
  location: string;
};

type Weather = {
  temp: number;
  wind: number;
};

export default function MatchesPreview() {

  const { user } = useAuth();

  const [matches, setMatches] = useState<Match[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<string, Weather>>({});
  const [apiMatches, setApiMatches] = useState<any[]>([]);

  const today = new Date().toISOString().split("T")[0];


  // FETCH USER MATCHES

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;

      const q = query(
        collection(db, "matches"),
        where("userId", "==", user.uid)
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


  // FETCH LIVE / TODAY MATCHES (API)

  useEffect(() => {

    const fetchLiveMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();

        const today = new Date().toISOString().split("T")[0];

        let filtered = data.matches?.filter((m:any) =>
          ["LIVE", "IN_PLAY", "PAUSED"].includes(m.status)
        );

        if (!filtered || filtered.length === 0) {
          filtered = data.matches?.filter((m:any) =>
            m.utcDate?.startsWith(today)
          );
        }

        setApiMatches(filtered || []);

      } catch (err) {
        console.log(err);
      }
    };

    fetchLiveMatches();

    //  AUTO REFRESH EVERY 30 SEC
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);

  }, []);


  // GET COORDINATES

  const getCoordinates = async (location: string) => {
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


  // WEATHER

  const getWeather = async (date: string, location: string) => {
    try {
      const coords = await getCoordinates(location);
      if (!coords) return null;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,windspeed_10m_max&timezone=auto`
      );

      const data = await res.json();

      const index = data.daily.time.indexOf(date);
      if (index === -1) return null;

      return {
        temp: data.daily.temperature_2m_max[index],
        wind: data.daily.windspeed_10m_max[index],
      };

    } catch {
      return null;
    }
  };


  // FETCH WEATHER

  useEffect(() => {
    const loadWeather = async () => {
      const map: any = {};

      for (let m of matches) {
        const w = await getWeather(m.date, m.location);
        if (w) map[m.id] = w;
      }

      setWeatherMap(map);
    };

    if (matches.length) loadWeather();
  }, [matches]);


  // UPCOMING MATCHES

  const upcomingMatches = matches
    .filter(m => new Date(m.date) >= new Date(today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-[#0B0F1A]/80 p-8 rounded-3xl border border-white/10">

      {/* UPCOMING */}
      <h2 className="text-2xl font-bold mb-6">Upcoming Matches</h2>

      {upcomingMatches.length === 0 ? (
        <p className="text-gray-400">No matches scheduled yet.</p>
      ) : (
        <div className="space-y-4">
          {upcomingMatches.map(match => {

            const weather = weatherMap[match.id];

            return (
              <div key={match.id}
                className="flex justify-between items-center bg-white/5 p-4 rounded-xl hover:bg-white/10 transition">

                <div className="flex items-center gap-3">
                  <FaFutbol className="text-purple-400" />
                  <span className="font-semibold">
                    vs {match.opponent}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">

                  <div className="flex items-center gap-2">
                    <FaClock />
                    {match.date} • {match.time}
                  </div>

                  {weather && (
                    <div className="flex items-center gap-1 text-purple-400">
                      <FaCloudSun />
                      {weather.temp}°C
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* LIVE / TODAY MATCHES */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Matches</h3>

        {apiMatches.length > 0 ? (
          <div className="space-y-4">
            {apiMatches.slice(0, 3).map((m: any, i: number) => (

              <div key={i}
                className="flex justify-between items-center bg-gradient-to-r from-white/5 to-white/10 p-4 rounded-xl border border-white/10 hover:scale-105 transition">

                <div>
                  <p className="font-semibold text-lg">
                    {m.homeTeam.name} vs {m.awayTeam.name}
                  </p>

                  <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                    <FaClock />
                    {new Date(m.utcDate).toLocaleString()}
                  </p>

                  <p className="text-xs mt-1 flex items-center gap-2">
                    <span className="text-purple-400">{m.competition.name}</span>

                    {["LIVE","IN_PLAY"].includes(m.status) && (
                      <span className="text-red-500 animate-pulse font-semibold">
                        ● LIVE
                      </span>
                    )}
                  </p>

                  {m.score?.fullTime && (
                    <p className="text-lg font-bold text-white mt-1">
                      {m.score.fullTime.home} : {m.score.fullTime.away}
                    </p>
                  )}
                </div>

                <FaFutbol className="text-purple-400 text-xl" />

              </div>

            ))}
          </div>
        ) : (
          <p className="text-gray-400">No matches available</p>
        )}
      </div>

    </div>
  );
}