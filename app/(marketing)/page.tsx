import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center space-y-8 py-16 md:py-24">
          <div className="space-y-6 max-w-4xl mx-auto px-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-emerald-200">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-emerald-700">O'zbekistonning №1 tibbiy platformasi</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-clip-text text-transparent">
                Shifokor va
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-clip-text text-transparent">
                klinikalarni{' '}
              </span>
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                toping
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                onlayn bron qiling
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
              O&apos;zbekistonda eng yaxshi shifokorlar va klinikalar. 
              Mutaxassislik, tajriba va xizmatlar bo&apos;yicha qidiring.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center items-center flex-wrap px-4">
            <Link 
              href="/doctors" 
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
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
              className="px-8 py-4 rounded-2xl border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span>🏥</span>
                <span>Klinikalar</span>
              </span>
            </Link>
            <Link 
              href="/blog" 
              className="px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md font-semibold transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span>📝</span>
                <span>Blog</span>
              </span>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 px-4">
            <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">500+</div>
              <div className="text-sm text-slate-500 font-medium mt-2">Shifokorlar</div>
            </div>
            <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">100+</div>
              <div className="text-sm text-slate-500 font-medium mt-2">Klinikalar</div>
            </div>
            <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">10k+</div>
              <div className="text-sm text-slate-500 font-medium mt-2">Bemorlar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Nima uchun <span className="text-emerald-600">CareZone.uz</span>?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tibbiy xizmatlarni topish va bron qilishni osonlashtiruvchi zamonaviy platforma
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative text-center space-y-4 p-8 rounded-2xl bg-white border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">🔍 Oson Qidiruv</h3>
              <p className="text-slate-600 leading-relaxed">
                Mutaxassislik, hudud va tajriba bo&apos;yicha shifokorlarni bir necha soniyada toping
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative text-center space-y-4 p-8 rounded-2xl bg-white border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">📅 Onlayn Bron</h3>
              <p className="text-slate-600 leading-relaxed">
                Mavjud vaqtlarni ko&apos;ring va uchrashuvni bir necha klik bilan bron qiling
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative text-center space-y-4 p-8 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">✅ Ishonchli Ma&apos;lumot</h3>
              <p className="text-slate-600 leading-relaxed">
                To&apos;liq profil, narxlar, tajriba va boshqa bemorlarning sharhlari
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                ⚠️ Muhim eslatma
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Ushbu sayt tibbiy maslahat bermaydi. Ma&apos;lumotlar faqat umumiy ma&apos;lumot berish maqsadida taqdim etilgan. 
                Har qanday tibbiy muammo bo&apos;lsa, albatta malakali shifokor bilan shaxsan maslahatlashing. 
                O&apos;z-o&apos;zini davolash xavfli bo&apos;lishi mumkin.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-amber-200 text-sm font-medium text-amber-800">
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
