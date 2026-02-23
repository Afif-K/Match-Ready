import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center pt-15">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.png')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 px-6">
        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
          Train Smarter.
          <br />
          Perform Better.
        </h1>

        <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
          AI-powered performance platform built for athletes and coaches.
        </p>

        <div className="mt-10 flex gap-6 justify-center">
        <Link
          href="/login"
          className="px-8 py-4 rounded-xl font-semibold text-lg 
          bg-gradient-to-r from-purple-600 to-pink-500 
          hover:opacity-90 transition cursor-pointer"
          >
          Get Started
          </Link>


          <button className="border border-white px-8 py-4 rounded-xl text-lg">
            Learn More
          </button>
        </div>
      </div>

    </section>
  );
}
