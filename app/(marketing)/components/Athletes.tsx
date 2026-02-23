export default function Athletes() {
  return (
    <section id="athletes" className="relative py-32 bg-black overflow-hidden">
      {/* Content container */}
      <div className="relative max-w-6xl mx-auto px-10">

        <div className="max-w-xl">
          <h2 className="text-4xl font-bold mb-6">
            Built for Athletes
          </h2>

          <p className="text-gray-400 mb-12 text-lg">
            From beginners to professionals, MatchReady helps athletes
            track progress, improve performance, and reach peak fitness faster.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-12">
            <div>
              <p className="text-4xl font-bold text-purple-500">2x</p>
              <p className="text-gray-400">Faster Progress</p>
            </div>

            <div>
              <p className="text-4xl font-bold text-purple-500">50K+</p>
              <p className="text-gray-400">Workouts Tracked</p>
            </div>

            <div>
              <p className="text-4xl font-bold text-purple-500">98%</p>
              <p className="text-gray-400">User Satisfaction</p>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Athlete Image (Premium Style) */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[400px]">

        {/* Purple glow */}
        <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-3xl" />

        {/* Image card */}
        <img
          src="/images/Athelete.jpg"
          alt="Athlete"
          className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10 brightness-110 contrast-110"
        />

      </div>

    </section>
  )
}
