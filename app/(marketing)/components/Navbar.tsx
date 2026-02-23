"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLink =
    "relative group cursor-pointer transition duration-300";

  const underline =
    "absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 transition-all duration-300 group-hover:w-full";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-lg border-b border-white/10 py-4"
          : "py-6"
      }`}
    >
      <div className="flex justify-between items-center px-10">

        {/* LOGO */}
        <Link
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-3xl font-bold hover:text-purple-400 transition duration-300"
        >
          MatchReady
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center space-x-8 text-lg">

          <a href="#features" className={navLink}>
            Features
            <span className={underline}></span>
          </a>

          <a href="#athletes" className={navLink}>
            Athletes
            <span className={underline}></span>
          </a>

          <a href="#coaches" className={navLink}>
            Coaches
            <span className={underline}></span>
          </a>

         {/* <a href="#pricing" className={navLink}>
           Pricing
            <span className={underline}></span>
          </a> */}

          {/* LOGIN BUTTON */}
          <Link
            href="/login"
            className="ml-4 px-6 py-2 rounded-lg font-semibold 
            bg-gradient-to-r from-purple-600 to-pink-500
            hover:scale-105 hover:shadow-2xl hover:shadow-purple-600/40
            transition-all duration-300"
          >
            Start Today
          </Link>

        </div>
      </div>
    </nav>
  );
}
