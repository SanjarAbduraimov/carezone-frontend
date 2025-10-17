import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40 -z-10"></div>
        
        <div className="text-center space-y-8 py-16 md:py-24">
          <div className="space-y-6 max-w-4xl mx-auto px-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-full shadow-md">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-white">O'zbekistonning №1 tibbiy platformasi</span>
            </div>
            
            {/* Main Heading - High Contrast */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="text-slate-900">
                Shifokor va
              </span>
              <br />
              <span className="text-slate-900">
                klinikalarni{' '}
              </span>
              <span className="text-emerald-600">
                toping
              </span>
              <br />
              <span className="text-emerald-600">
                onlayn bron qiling
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed max-w-3xl mx-auto font-medium">
              O&apos;zbekistonda eng yaxshi shifokorlar va klinikalar. 
              Mutaxassislik, tajriba va xizmatlar bo&apos;yicha qidiring.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center items-center flex-wrap px-4">
            <Link 
              href="/doctors" 
              className="group px-8 py-4 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span>👨‍⚕️</span>
                <span>Shifokorlarni ko'rish</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link 
              href="/clinics" 
              className="px-8 py-4 rounded-2xl border-2 border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold transition-all hover:scale-105 shadow-md"
            >
              <span className="flex items-center gap-2">
                <span>🏥</span>
                <span>Klinikalar</span>
              </span>
            </Link>
            <Link 
              href="/blog" 
              className="px-8 py-4 rounded-2xl bg-slate-100 border-2 border-slate-300 text-slate-900 hover:bg-slate-200 hover:border-slate-400 font-bold transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span>📝</span>
                <span>Blog</span>
              </span>
            </Link>
          </div>
          
          {/* Stats - High Contrast */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 px-4">
            <div className="group text-center p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl hover:border-emerald-400 hover:shadow-md transition-all">
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-700">500+</div>
              <div className="text-sm text-slate-700 font-semibold mt-2">Shifokorlar</div>
            </div>
            <div className="group text-center p-6 bg-teal-50 border-2 border-teal-200 rounded-2xl hover:border-teal-400 hover:shadow-md transition-all">
              <div className="text-3xl md:text-4xl font-extrabold text-teal-700">100+</div>
              <div className="text-sm text-slate-700 font-semibold mt-2">Klinikalar</div>
            </div>
            <div className="group text-center p-6 bg-cyan-50 border-2 border-cyan-200 rounded-2xl hover:border-cyan-400 hover:shadow-md transition-all">
              <div className="text-3xl md:text-4xl font-extrabold text-cyan-700">10k+</div>
              <div className="text-sm text-slate-700 font-semibold mt-2">Bemorlar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 bg-slate-50 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Nima uchun <span className="text-emerald-600">CareZone.uz</span>?
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium">
            Tibbiy xizmatlarni topish va bron qilishni osonlashtiruvchi zamonaviy platforma
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="group text-center space-y-4 p-8 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:shadow-xl">
            <div className="w-16 h-16 mx-auto bg-emerald-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">🔍 Oson Qidiruv</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              Mutaxassislik, hudud va tajriba bo&apos;yicha shifokorlarni bir necha soniyada toping
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group text-center space-y-4 p-8 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl">
            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">📅 Onlayn Bron</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              Mavjud vaqtlarni ko&apos;ring va uchrashuvni bir necha klik bilan bron qiling
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group text-center space-y-4 p-8 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl">
            <div className="w-16 h-16 mx-auto bg-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">✅ Ishonchli Ma&apos;lumot</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              To&apos;liq profil, narxlar, tajriba va boshqa bemorlarning sharhlari
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4">
        <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                ⚠️ Muhim eslatma
              </h3>
              <p className="text-slate-900 leading-relaxed font-medium">
                Ushbu sayt tibbiy maslahat bermaydi. Ma&apos;lumotlar faqat umumiy ma&apos;lumot berish maqsadida taqdim etilgan. 
                Har qanday tibbiy muammo bo&apos;lsa, albatta malakali shifokor bilan shaxsan maslahatlashing. 
                O&apos;z-o&apos;zini davolash xavfli bo&apos;lishi mumkin.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-amber-600 text-sm font-bold text-slate-900">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Faqat ma&apos;lumot maqsadida
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
