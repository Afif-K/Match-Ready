/* This page handles user sign up for the app. It supports two sign up methods: Google sign up using Firebase and email/password
  sign up using Firebase Auth. After a successful sign up, the user is redirected to the login. The UI includes a styled login card with 
  a background image, a Google button, and an email/password form. Loading state is used to prevent repeated submissions while authentication 
  is in progress.
  */



"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { auth, googleProvider } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Google signup
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (error) {
      alert("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Email signup
  const handleSignup = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black relative pt-10">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/background.png"
          alt="bg"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-[420px] bg-[#0B0B0F]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-center mb-8">Create Account</h1>

        {/* SOCIAL */}
        <div className="space-y-4 mb-6">

          {/* GOOGLE */}
          <button
            onClick={handleGoogleSignup}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-3"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          
          {/* <button
            disabled
            className="w-full py-3 rounded-xl bg-white/60 text-black font-semibold flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
          >
            <FaApple size={22} />
            Continue with Apple
            <span className="text-xs ml-2 text-gray-600">(coming soon)</span>
          </button> */}

         
          {/* <button
            disabled
            className="w-full py-3 rounded-xl bg-white/60 text-black font-semibold flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
          >
            <FaFacebookF size={20} className="text-blue-600" />
            Continue with Facebook
            <span className="text-xs ml-2 text-gray-600">(coming soon)</span>
          </button> */}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* EMAIL SIGNUP */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold hover:opacity-90 transition cursor-pointer"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </section>
  );
}
