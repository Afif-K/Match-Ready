"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./dashboard/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Loading screen while Firebase checks auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#03050B] text-white">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  // Prevent rendering dashboard before redirect
  if (!user) return null;

  return (
    <div className="flex bg-[#03050B] text-white min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT AREA */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}
