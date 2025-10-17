import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { ToastContainer } from "./components/ToastContainer";
import { AuthButton } from "./components/AuthButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "carezone.uz — Shifokor va Klinika katalogi",
  description: "O'zbekistonda shifokor va klinikalarni topish, profillar, xizmatlar, narxlar, va onlayn bron qilish.",
  metadataBase: new URL("https://carezone.uz"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <QueryProvider>
          <div className="min-h-dvh flex flex-col">
          <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl leading-none text-slate-900">
                      carezone<span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">.uz</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Sog&apos;liq platformasi</span>
                  </div>
                </Link>
                
                <nav className="hidden md:flex items-center gap-2">
                  <Link 
                    href="/doctors" 
                    className="relative px-4 py-2.5 rounded-xl text-slate-700 hover:text-emerald-700 font-semibold transition-all group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center gap-1.5">
                      <span>👨‍⚕️</span>
                      Shifokorlar
                    </span>
                  </Link>
                  <Link 
                    href="/clinics" 
                    className="relative px-4 py-2.5 rounded-xl text-slate-700 hover:text-blue-700 font-semibold transition-all group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center gap-1.5">
                      <span>🏥</span>
                      Klinikalar
                    </span>
                  </Link>
                  <Link 
                    href="/blog" 
                    className="relative px-4 py-2.5 rounded-xl text-slate-700 hover:text-purple-700 font-semibold transition-all group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center gap-1.5">
                      <span>📰</span>
                      Blog
                    </span>
                  </Link>
                  <a 
                    href="https://t.me/SanjarAbduraimov" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                      </svg>
                      Telegram
                    </span>
                  </a>
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2.5 rounded-xl hover:bg-emerald-50 transition-colors">
                  <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8">
            {process.env.SHOW_DOMAIN_FOR_SALE_BANNER === "true" && (
              <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-amber-900">Domain sotiladi</span>
                    <span className="text-amber-800"> — bog&#39;lanish: </span>
                    <a 
                      className="underline text-amber-900 font-medium hover:text-amber-700" 
                      href={`https://t.me/${process.env.DOMAIN_FOR_SALE_CONTACT?.replace('@','')}`}
                    >
                      {process.env.DOMAIN_FOR_SALE_CONTACT}
                    </a>
                  </div>
                </div>
              </div>
            )}
            {children}
          </main>

          <footer className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/20">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            <div className="relative mx-auto max-w-7xl px-4 py-12">
              <div className="grid gap-8 md:grid-cols-4">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="font-bold text-xl text-slate-900">
                      carezone<span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">.uz</span>
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm max-w-md mb-4 leading-relaxed font-medium">
                    O&apos;zbekistondagi eng yaxshi shifokorlar va klinikalar. Sog&apos;liq va salomatlik uchun ishonchli manbangiz.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 border-2 border-amber-400 rounded-xl">
                    <svg className="w-4 h-4 text-amber-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-xs font-bold text-slate-900">Tibbiy maslahat emas — faqat ma&apos;lumot uchun</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Havolalar
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/doctors" className="text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-2 group font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-emerald-600 transition-colors"></span>
                        Shifokorlar
                      </Link>
                    </li>
                    <li>
                      <Link href="/clinics" className="text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-2 group font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-emerald-600 transition-colors"></span>
                        Klinikalar
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog" className="text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-2 group font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-emerald-600 transition-colors"></span>
                        Blog
                      </Link>
                    </li>
                    <li>
                      <a href="/privacy" className="text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-2 group font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-emerald-600 transition-colors"></span>
                        Maxfiylik
                      </a>
                    </li>
                    <li>
                      <a href="/terms" className="text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-2 group font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-emerald-600 transition-colors"></span>
                        Foydalanish shartlari
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Bog&apos;lanish
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <a 
                        href="https://t.me/SanjarAbduraimov" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                          </svg>
                        </div>
                        <span className="text-slate-800 font-bold group-hover:text-blue-700">Telegram</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://x.com/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </div>
                        <span className="text-slate-800 font-bold group-hover:text-slate-900">X (Twitter)</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://instagram.com/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </div>
                        <span className="text-slate-800 font-bold group-hover:text-pink-700">Instagram</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-200 mt-10 pt-8 text-center">
                <p className="text-sm text-slate-700 font-semibold">
                  © 2024 <span className="font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">carezone.uz</span>. Barcha huquqlar himoyalangan.
                </p>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Toast Notifications */}
        <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
