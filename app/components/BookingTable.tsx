'use client';
import { useState } from 'react';

export type Slot = { id: string; start: string; end: string; available: number };

export function BookingTable({ slots }: { slots: Slot[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  async function book(slotId: string) {
    if (!name.trim() || !phone.trim()) {
      alert('Iltimos, ism va telefon raqamingizni kiriting');
      return;
    }

    setLoading(slotId);
    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          slotId, 
          patientName: name.trim(), 
          patientPhone: phone.trim(), 
          patientEmail: email.trim() || undefined 
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('✅ Bron muvaffaqiyatli yaratildi!\n\nTez orada siz bilan bog&apos;lanamiz.');
        setName('');
        setPhone('');
        setEmail('');
        setSelectedSlot(null);
        window.location.reload();
      } else {
        alert(`❌ Xatolik: ${data.error || 'Noma&apos;lum xatolik'}`);
      }
    } catch (error) {
      alert('❌ Tarmoq xatolik. Iltimos, qayta urinib ko\'ring.');
      console.error('Booking error:', error);
    } finally {
      setLoading(null);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('uz-UZ', options);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Patient Info Form */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-slate-900">Ma&apos;lumotlaringizni kiriting</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ism <span className="text-red-500">*</span>
            </label>
            <input 
              placeholder="To'liq ismingiz" 
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telefon <span className="text-red-500">*</span>
            </label>
            <input 
              placeholder="+998 XX XXX XX XX" 
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input 
              type="email"
              placeholder="email@example.com" 
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Slots Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="p-3 text-left font-semibold text-slate-700">Sana va vaqt</th>
              <th className="p-3 text-left font-semibold text-slate-700">Davomiyligi</th>
              <th className="p-3 text-center font-semibold text-slate-700">Mavjud o&apos;rinlar</th>
              <th className="p-3 text-right font-semibold text-slate-700">Amal</th>
            </tr>
          </thead>
          <tbody>
            {slots.map(s => {
              const isSelected = selectedSlot === s.id;
              const isBooked = s.available < 1;
              const isLoading = loading === s.id;

              return (
                <tr 
                  key={s.id} 
                  className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                    isSelected ? 'bg-emerald-50 hover:bg-emerald-50' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-slate-900">{formatDate(s.start)}</div>
                        <div className="text-xs text-slate-500">{formatTime(s.start)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-700">
                    {formatTime(s.start)} - {formatTime(s.end)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isBooked 
                        ? 'bg-red-100 text-red-800' 
                        : s.available <= 2 
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isBooked ? 'Band' : `${s.available} ta`}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      disabled={isBooked || isLoading || (!name.trim() || !phone.trim())}
                      onClick={() => {
                        setSelectedSlot(s.id);
                        book(s.id);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isBooked 
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : isLoading
                          ? 'bg-emerald-400 text-white cursor-wait'
                          : (!name.trim() || !phone.trim())
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Yuklanmoqda...
                        </span>
                      ) : isBooked ? (
                        'Band'
                      ) : (
                        'Bron qilish'
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {slots.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-lg">
          <p className="text-slate-600">Hozirda mavjud vaqtlar yo&apos;q</p>
        </div>
      )}
    </div>
  );
}
