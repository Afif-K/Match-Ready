export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-black text-center">

      <div className="max-w-6xl mx-auto px-10">
        <h2 className="text-5xl font-bold mb-6">
          Simple Pricing
        </h2>

        <p className="text-gray-400 text-lg mb-16">
          Choose the plan that fits your training journey
        </p>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* BASIC */}
          <div className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-2xl font-semibold mb-4">Basic</h3>
            <p className="text-gray-400 mb-6">For individual athletes</p>

            <p className="text-5xl font-bold mb-6">$9<span className="text-lg text-gray-400">/mo</span></p>

            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✔ Workout Tracking</li>
              <li>✔ AI Insights</li>
              <li>✔ Progress Analytics</li>
            </ul>

            <button className="w-full border border-white/20 py-3 rounded-xl hover:bg-white/10 transition">
              Get Started
            </button>
          </div>

          {/* PRO (highlighted) */}
          <div className="p-10 rounded-3xl border border-purple-500 bg-gradient-to-b from-purple-600/20 to-black relative shadow-2xl">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-sm">
              MOST POPULAR
            </div>

            <h3 className="text-2xl font-semibold mb-4">Pro</h3>
            <p className="text-gray-300 mb-6">For serious athletes</p>

            <p className="text-5xl font-bold mb-6">$19<span className="text-lg text-gray-400">/mo</span></p>

            <ul className="space-y-3 text-gray-200 mb-8">
              <li>✔ Everything in Basic</li>
              <li>✔ Smart Training Planner</li>
              <li>✔ Recovery Tracking</li>
              <li>✔ Injury Prevention AI</li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition">
              Get Started
            </button>
          </div>

          {/* COACH */}
          <div className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-2xl font-semibold mb-4">Coach</h3>
            <p className="text-gray-400 mb-6">For teams & coaches</p>

            <p className="text-5xl font-bold mb-6">$39<span className="text-lg text-gray-400">/mo</span></p>

            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✔ Manage Athletes</li>
              <li>✔ Team Dashboard</li>
              <li>✔ Performance Reports</li>
              <li>✔ Priority Support</li>
            </ul>

            <button className="w-full border border-white/20 py-3 rounded-xl hover:bg-white/10 transition">
              Contact Sales
            </button>
          </div>

        </div>
      </div>

    </section>
  )
}
