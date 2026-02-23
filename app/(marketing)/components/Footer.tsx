export default function Footer() {
  return (
    <footer className="bg-[#0B0B0F] border-t border-white/10">

      <div className="max-w-6xl mx-auto px-10 py-16">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Logo + desc */}
          <div>
            <h2 className="text-2xl font-bold mb-4">MatchReady</h2>
            <p className="text-gray-400 max-w-sm">
              AI-powered performance platform for athletes and coaches.
              Train smarter. Perform better.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-gray-400">

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Updates</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-500">
          © {new Date().getFullYear()} MatchReady. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
