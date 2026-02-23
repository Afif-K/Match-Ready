import "./globals.css";
import ScrollToTop from "./ScrollToTop";
import { AuthProvider } from "../context/AuthContext";
export const metadata = {
  title: "MatchReady",
  description: "AI Performance Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#03050B] text-white min-h-screen">
        <AuthProvider>
          <ScrollToTop />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
