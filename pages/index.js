import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="p-10 bg-orange-100 text-orange-800 min-h-screen">
      <h1 className="text-3xl font-bold">Tailwind está funcionando 🧡</h1>
      <p>Si ves este texto naranja con fondo claro, ya está todo bien.</p>
    </div>
  )
}