/*The side bar is the navigation bar of the page that is on the left side of the page that contains acess to all the pages, with small icons
that represent eah page and also has the log out button. 
 */


"use client";
import {
  LayoutDashboard,
  CalendarDays,
  Activity,
  User,
  LogOut,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Planner", icon: CalendarDays, href: "/planner" },
    { name: "Matches", href: "/matches", icon: Trophy },
    { name: "Recovery", icon: Activity, href: "/recovery" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-[#05070E] border-r border-white/10 flex flex-col justify-between py-10 px-6">

      {/* TOP SECTION */}
      <div>

        <div className="mb-14 pl-2">
          <Link href="/dashboard" className="inline-block group">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] cursor-pointer">
              MatchReady
            </h1>
          </Link>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-3">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = path === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                flex items-center gap-4 px-6 py-4 rounded-2xl
                transition-all duration-300 ease-out group
                ${
                  active
                    ? "bg-gradient-to-r from-purple-600/30 to-pink-500/30 text-white shadow-lg shadow-purple-900/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-2"
                }`}
              >
                <Icon
                  size={22}
                  className={`transition-all duration-300 ${
                    active ? "text-purple-400" : "group-hover:text-purple-400"
                  }`}
                />
                <span className="text-lg font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM PROFILE (REAL USER) */}
      <div className="border-t border-white/10 pt-8">

        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.photoURL || "/avatar.png"}
            alt="user"
            className="w-11 h-11 rounded-full"
          />

          <div>
            <p className="font-semibold text-white">
              {user?.displayName || "Athlete"}
            </p>
            <p className="text-gray-400 text-sm">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="ml-8 flex items-center gap-3 text-gray-400 hover:text-red-400 transition-all duration-300 hover:translate-x-1"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>
    </aside>
  );
}
