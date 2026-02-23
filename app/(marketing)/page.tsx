import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import Athletes from "./components/Athletes"
import Coaches from "./components/Coaches"
import Pricing from "./components/Pricing"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <main className="bg-[#0B0B0F]">
      <Navbar />
      <Hero />
      <Features />
      <Athletes />
      <Coaches />
      <Footer />
    </main>
  )
}
