export default function Coaches() {
  return (
    <section id="coaches" className="relative py-32 bg-black overflow-hidden">

      {/* LEFT floating image */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[500px] h-[360px]">

        {/* Purple glow */}
        <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-3xl" />

        {/* Image card */}
        <img
          src="/images/coach.jpg"
          alt="Coach"
          className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10 brightness-110 contrast-110"
        />

      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-10 flex justify-end">

        <div className="max-w-xl text-right">
          <h2 className="text-4xl font-bold mb-6">
            Built for Coaches
          </h2>

          <p className="text-gray-400 mb-12 text-lg">
            Monitor athletes, create training programs, and use AI insights
            to optimize performance and prevent injuries.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-12">
            <div>
              <p className="text-4xl font-bold text-purple-500">5x</p>
              <p className="text-gray-400">Faster Planning</p>
            </div>

            <div>
              <p className="text-4xl font-bold text-purple-500">100+</p>
              <p className="text-gray-400">Athletes Managed</p>
            </div>

            <div>
              <p className="text-4xl font-bold text-purple-500">24/7</p>
              <p className="text-gray-400">AI Insights</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
