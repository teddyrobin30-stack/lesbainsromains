import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, Calendar, Euro } from 'lucide-react';

const MONTHS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
const MONTHS_FULL = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(String(priceStr).replace(/[€\s]/g, '')) || 0;
};

const AnimatedNumber = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    prev.current = value;
    if (start === end) return;
    const duration = 900;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display.toLocaleString('fr-FR')}{suffix}</>;
};

const KpiCard = ({ icon: Icon, label, value, suffix = '', color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
  >
    <div className="flex items-start justify-between mb-4">
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
    </div>
    <p className="text-3xl font-serif text-stone-800">
      <AnimatedNumber value={value} suffix={suffix} />
    </p>
  </motion.div>
);

export default function FinanceTab({ reservations, services }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const getPrice = (res) => {
    const service = services.find(s => s.id === res.serviceId || s.id === parseInt(res.serviceId));
    return service ? parsePrice(service.price) : 0;
  };

  const years = [...new Set(
    reservations.map(r => r.createdAt ? new Date(r.createdAt).getFullYear() : null).filter(Boolean)
  )].sort((a, b) => b - a);
  if (!years.includes(currentYear)) years.unshift(currentYear);

  const filtered = reservations.filter(r => {
    if (!r.createdAt) return false;
    return new Date(r.createdAt).getFullYear() === year;
  });

  const treated    = filtered.filter(r => r.archived && r.status === 'Traîtée');
  const allForCA   = filtered; // CA estimé sur toutes les réservations

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthRes = allForCA.filter(r => new Date(r.createdAt).getMonth() === i);
    const treatedMonth = treated.filter(r => new Date(r.createdAt).getMonth() === i);
    const ca = monthRes.reduce((sum, r) => sum + getPrice(r), 0);
    return { month: MONTHS[i], monthFull: MONTHS_FULL[i], count: monthRes.length, treated: treatedMonth.length, ca };
  });

  const totalCA      = allForCA.reduce((sum, r) => sum + getPrice(r), 0);
  const totalTreated = treated.length;
  const avgBasket    = allForCA.length > 0 ? Math.round(totalCA / allForCA.length) : 0;
  const uniqueClients = new Set(allForCA.map(r => r.email).filter(Boolean)).size;
  const maxCA = Math.max(...monthlyData.map(m => m.ca), 1);

  const bestMonth = monthlyData.reduce((best, m) => m.ca > best.ca ? m : best, monthlyData[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif text-stone-800">Finances</h3>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">Chiffre d'affaires estimé · Toutes réservations</p>
        </div>
        <div className="flex items-center gap-2">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg border transition ${year === y ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-white text-stone-400 border-stone-200 hover:border-[#D4AF37]'}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Euro}       label="CA annuel estimé"   value={totalCA}        suffix=" €" color="bg-[#D4AF37]" delay={0} />
        <KpiCard icon={ShoppingBag} label="Panier moyen"       value={avgBasket}      suffix=" €" color="bg-stone-700"  delay={0.08} />
        <KpiCard icon={Users}       label="Clients uniques"    value={uniqueClients}              color="bg-blue-500"   delay={0.16} />
        <KpiCard icon={TrendingUp}  label="Réservations traitées" value={totalTreated}           color="bg-green-500"  delay={0.24} />
      </div>

      {/* Meilleur mois */}
      {totalCA > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 flex items-center gap-3"
        >
          <Calendar size={16} className="text-[#D4AF37]" />
          <p className="text-sm text-stone-700">
            Meilleur mois : <strong className="text-[#D4AF37]">{bestMonth.monthFull}</strong> avec{' '}
            <strong>{bestMonth.ca.toLocaleString('fr-FR')} €</strong> sur {bestMonth.count} réservation{bestMonth.count > 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Graphique mensuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-xl border border-stone-200 shadow-sm p-6"
      >
        <h4 className="text-sm font-bold text-stone-700 uppercase tracking-widest mb-6">CA mensuel estimé</h4>
        <div className="space-y-3">
          {monthlyData.map((m, i) => (
            <div key={m.month} className="flex items-center gap-4">
              <span className="text-[11px] text-stone-400 w-10 text-right shrink-0">{m.month}</span>
              <div className="flex-1 h-7 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: m.ca > 0 ? `${(m.ca / maxCA) * 100}%` : '0%' }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
                  className="h-full rounded-full flex items-center justify-end pr-3"
                  style={{ background: m.ca > 0 ? 'linear-gradient(90deg, #D4AF37, #B5952F)' : 'transparent' }}
                >
                  {m.ca > 0 && (
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">{m.ca.toLocaleString('fr-FR')} €</span>
                  )}
                </motion.div>
              </div>
              <span className="text-[11px] text-stone-400 w-16 shrink-0 text-right">{m.count} rés.</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tableau détaillé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left text-[10px] font-bold text-stone-400 uppercase tracking-widest px-6 py-3">Mois</th>
              <th className="text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest px-6 py-3">Réservations</th>
              <th className="text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest px-6 py-3">Traitées</th>
              <th className="text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest px-6 py-3">CA estimé</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((m, i) => (
              <motion.tr
                key={m.month}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.03 }}
                className={`border-b border-stone-100 ${m.count > 0 ? 'bg-white' : 'bg-stone-50/50'}`}
              >
                <td className="px-6 py-3 font-medium text-stone-700">{m.monthFull}</td>
                <td className="px-6 py-3 text-right text-stone-500">{m.count || '—'}</td>
                <td className="px-6 py-3 text-right">
                  {m.treated > 0
                    ? <span className="text-green-600 font-medium">{m.treated}</span>
                    : <span className="text-stone-300">—</span>}
                </td>
                <td className="px-6 py-3 text-right font-bold text-stone-800">
                  {m.ca > 0 ? `${m.ca.toLocaleString('fr-FR')} €` : <span className="text-stone-300 font-normal">—</span>}
                </td>
              </motion.tr>
            ))}
            <tr className="bg-amber-50 border-t-2 border-[#D4AF37]">
              <td className="px-6 py-4 font-bold text-stone-800 uppercase tracking-widest text-xs">Total {year}</td>
              <td className="px-6 py-4 text-right font-bold text-stone-800">{allForCA.length}</td>
              <td className="px-6 py-4 text-right font-bold text-green-600">{totalTreated}</td>
              <td className="px-6 py-4 text-right font-bold text-[#D4AF37] text-base">{totalCA.toLocaleString('fr-FR')} €</td>
            </tr>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
