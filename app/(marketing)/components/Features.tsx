import { Brain, BarChart3, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI Performance Analysis",
      desc: "Track every workout, analyze progress, and get AI insights to improve faster.",
      icon: BarChart3,
    },
    {
      title: "Smart Training Planner",
      desc: "Personalized training plans that adapt to your goals and performance.",
      icon: Brain,
    },
    {
      title: "Recovery & Injury Prevention",
      desc: "Optimize rest, reduce injury risk, and stay at peak performance.",
      icon: Zap,
    },
  ];

  return (
    <section id="features" className="py-28 px-10 bg-black">

      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
        <p className="text-gray-400 mb-16">
          Everything athletes and coaches need in one AI platform
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-[#0B0B0F] border border-white/10 p-10 rounded-3xl 
                 hover:border-purple-500 hover:-translate-y-2 hover:shadow-2xl 
                transition duration-300"

              >
                <div className="flex justify-center mb-6">
                  <Icon size={48} className="text-purple-500" />
                </div>

                <h3 className="text-2xl font-semibold mb-4">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
