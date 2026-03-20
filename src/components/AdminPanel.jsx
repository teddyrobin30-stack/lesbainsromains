import { useState } from 'react';
import {
  X,
  Trash2,
  Check,
  CheckCircle,
  Plus,
  Image as ImageIcon,
  FileText,
  Edit2,
  Send,
  MessageSquarePlus,
  CalendarClock,
  LayoutDashboard
} from 'lucide-react';

const AdminPanel = ({ 
  contactInfo, 
  setContactInfo, 
  services, 
  setServices, 
  openingHours, 
  setOpeningHours, 
  events, 
  setEvents,
  onExit,
  categories,
  blockedSlots = [],
  setBlockedSlots,
  reservations = [],
  setReservations,
  siteContent,
  setSiteContent
}) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editService, setEditService] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [viewMode, setViewMode] = useState("active"); // "active" or "archived" for reservations
  const [selectedSlotDate, setSelectedSlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [editReservation, setEditReservation] = useState(null); // { id, dateISO, time }

  const handleFileUpload = (e, section, field, spaceId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for Base64 storage
      alert("L'image est trop volumineuse. Veuillez utiliser une image de moins de 1Mo pour optimiser le site.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      if (spaceId) {
        setSiteContent(prev => ({
          ...prev,
          spaces: prev.spaces.map(s => s.id === spaceId ? { ...s, image: base64String } : s)
        }));
      } else {
        setSiteContent(prev => ({
          ...prev,
          [section]: { ...prev[section], [field]: base64String }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSpace = () => {
    const newId = `space-${Date.now()}`;
    const newSpace = {
      id: newId,
      title: "Nouvel Espace",
      image: "https://images.unsplash.com/photo-1540555700478-4be289a5090a?auto=format&fit=crop&q=80",
      desc: "Description de votre nouvel espace."
    };
    setSiteContent(prev => ({
      ...prev,
      spaces: [...prev.spaces, newSpace]
    }));
  };

  const handleDeleteSpace = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet espace ?")) {
      setSiteContent(prev => ({
        ...prev,
        spaces: prev.spaces.filter(s => s.id !== id)
      }));
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const handleContactUpdate = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleHoursUpdate = (e) => {
    setOpeningHours({ ...openingHours, [e.target.name]: e.target.value });
  };

  const saveService = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedService = {
      ...editService,
      title: formData.get("title"),
      price: formData.get("price"),
      duration: parseInt(formData.get("duration")),
      description: formData.get("description"),
      category: formData.get("category"),
      rawPrice: parseInt(formData.get("price").replace("€", "") || "0"),
    };

    if (editService.id === "new") {
      updatedService.id = Date.now();
      setServices(prev => [...prev, updatedService]);
    } else {
      setServices(prev => prev.map(s => s.id === editService.id ? updatedService : s));
    }
    setEditService(null);
  };

  const deleteService = (id) => {
    if (window.confirm("Supprimer ce soin ?")) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const saveEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedEvent = {
      ...editEvent,
      title: formData.get("title"),
      discount: formData.get("discount"),
      tag: formData.get("tag"),
      description: formData.get("description"),
      isActive: formData.get("isActive") === "on",
    };

    if (editEvent.id === "new") {
      updatedEvent.id = Date.now();
      setEvents(prev => [...prev, updatedEvent]);
    } else {
      setEvents(prev => prev.map(ev => ev.id === editEvent.id ? updatedEvent : ev));
    }
    setEditEvent(null);
  };

  const deleteEvent = (id) => {
    if (window.confirm("Supprimer cet évènement ?")) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
    }
  };

  // --- LOGIQUE RÉSERVATIONS ---
  const handleArchiveReservation = (id, action, motif = "") => {
    setReservations(prev => prev.map(res => {
      if (res.id === id) {
        return { 
          ...res, 
          status: action === 'process' ? 'Traîtée' : 'Déclinée',
          motif: motif,
          archived: true,
          archivedAt: new Date().toISOString()
        };
      }
      return res;
    }));
  };

  const deleteReservation = (id) => {
    if (window.confirm("Supprimer définitivement cette réservation ?")) {
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleUpdateAdminNote = (id, adminNote) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, adminNote } : r));
  };

  const handleUpdateDateTime = (id, dateISO, newTime) => {
    const dateObj = new Date(dateISO + 'T12:00:00');
    const formattedDate = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    setReservations(prev => prev.map(r => r.id === id ? { ...r, date: formattedDate, dateISO, time: newTime } : r));
    setEditReservation(null);
  };

  const buildConfirmationEmailHTML = (res) => {
    const service = services.find(s => s.id === res.serviceId);
    const duration = service ? (service.duration === 0 ? 'Accès libre' : `${service.duration} min`) : '';
    const price = service ? service.price : '';
    return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#3d3d3d;">
  <div style="background:#1a1a1a;padding:32px;text-align:center;">
    <h1 style="color:#D4AF37;font-size:28px;margin:0;letter-spacing:3px;">LES BAINS ROMAINS</h1>
    <p style="color:#888;font-size:11px;margin:8px 0 0;letter-spacing:4px;text-transform:uppercase;">Saint-Nectaire &middot; Spa &amp; Bien-être</p>
  </div>
  <div style="padding:40px 32px;background:#fff;">
    <p style="font-size:16px;color:#555;">Madame, Monsieur <strong>${res.firstName} ${res.lastName}</strong>,</p>
    <p style="font-size:15px;color:#555;line-height:1.7;">Nous avons le plaisir de vous confirmer votre réservation aux Bains Romains.</p>
    <div style="background:#f9f7f2;border-left:4px solid #D4AF37;padding:24px 28px;margin:28px 0;border-radius:2px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#999;text-transform:uppercase;letter-spacing:1px;font-size:11px;width:120px;">Prestation</td><td style="padding:8px 0;font-weight:bold;color:#3d3d3d;">${res.serviceTitle}</td></tr>
        <tr><td style="padding:8px 0;color:#999;text-transform:uppercase;letter-spacing:1px;font-size:11px;">Date</td><td style="padding:8px 0;color:#3d3d3d;text-transform:capitalize;">${res.date}</td></tr>
        <tr><td style="padding:8px 0;color:#999;text-transform:uppercase;letter-spacing:1px;font-size:11px;">Heure</td><td style="padding:8px 0;color:#3d3d3d;">${res.time}</td></tr>
        ${duration ? `<tr><td style="padding:8px 0;color:#999;text-transform:uppercase;letter-spacing:1px;font-size:11px;">Durée</td><td style="padding:8px 0;color:#3d3d3d;">${duration}</td></tr>` : ''}
        ${price ? `<tr><td style="padding:8px 0;color:#999;text-transform:uppercase;letter-spacing:1px;font-size:11px;">Tarif</td><td style="padding:8px 0;font-size:16px;color:#D4AF37;font-weight:bold;">${price}</td></tr>` : ''}
      </table>
    </div>
    <p style="font-size:14px;color:#777;line-height:1.7;">Nous vous attendons avec plaisir. Pour toute question ou modification, n'hésitez pas à nous contacter.</p>
  </div>
  <div style="background:#f0ece0;padding:24px 32px;text-align:center;border-top:1px solid #e0d8c8;">
    <p style="font-size:12px;color:#999;margin:4px 0;">📍 ${contactInfo.address}</p>
    <p style="font-size:12px;color:#999;margin:4px 0;">📞 ${contactInfo.phone} &nbsp;·&nbsp; ✉ ${contactInfo.email}</p>
  </div>
</div>`;
  };

  const handleSendConfirmation = (res) => {
    const emailPayload = {
      to: res.email,
      subject: `Confirmation de votre réservation — Les Bains Romains`,
      html: buildConfirmationEmailHTML(res)
    };
    // TODO: appel API Gmail
    console.log('[Gmail API] Payload prêt :', emailPayload);
    setReservations(prev => prev.map(r => r.id === res.id ? { ...r, confirmationSent: true } : r));
  };

  // --- LOGIQUE CRÉNEAUX ---
  const handleToggleSlot = (time) => {
    const isBlocked = blockedSlots.some(s => s.date === selectedSlotDate && s.time === time);
    if (isBlocked) {
      setBlockedSlots(blockedSlots.filter(s => !(s.date === selectedSlotDate && s.time === time)));
    } else {
      const newSlot = {
        id: Date.now(),
        date: selectedSlotDate,
        time: time,
        type: "time"
      };
      setBlockedSlots([...blockedSlots, newSlot]);
    }
  };

  const handleToggleDay = () => {
    const isDayBlocked = blockedSlots.some(s => s.date === selectedSlotDate && s.type === 'day');
    if (isDayBlocked) {
      setBlockedSlots(blockedSlots.filter(s => !(s.date === selectedSlotDate && s.type === 'day')));
    } else {
      const newSlot = {
        id: Date.now(),
        date: selectedSlotDate,
        time: "Journée entière",
        type: "day"
      };
      // On peut optionnellement nettoyer les créneaux individuels de ce jour si on bloque tout
      setBlockedSlots([...blockedSlots.filter(s => s.date !== selectedSlotDate), newSlot]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full font-sans">
          <h2 className="text-2xl font-serif text-stone-800 mb-6 text-center">Accès Administrateur</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-[#D4AF37]"
            />
            <button type="submit" className="w-full bg-[#D4AF37] text-white py-3 font-bold uppercase tracking-widest">Se connecter</button>
            <button type="button" onClick={onExit} className="w-full text-stone-400 text-xs uppercase tracking-widest mt-4">Retour au site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <nav className="bg-white shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-xl font-serif text-[#D4AF37]">Administration - Les Bains Romains</h1>
        <button onClick={onExit} className="text-stone-500 hover:text-stone-800 text-sm font-bold uppercase tracking-widest">Quitter</button>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="flex flex-wrap gap-4 md:gap-8 mb-12 border-b border-stone-200">
          <button onClick={() => setActiveTab("dashboard")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-stone-400 hover:text-stone-600'}`}>
            <LayoutDashboard size={13} /> Tableau de bord
          </button>
          <button onClick={() => setActiveTab("reservations")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'reservations' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-stone-400 hover:text-stone-600'}`}>
            Réservations
            {reservations.filter(r => !r.archived).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{reservations.filter(r => !r.archived).length}</span>
            )}
          </button>
          <button onClick={() => setActiveTab("slots")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'slots' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-stone-400 hover:text-stone-600'}`}>Gestion des Créneaux</button>
          <button onClick={() => setActiveTab("events")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'events' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-stone-400 hover:text-stone-600'}`}>Évènements</button>
          <button onClick={() => setActiveTab("services")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'services' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-stone-400 hover:text-stone-600'}`}>Soins & Tarifs</button>
          <button onClick={() => setActiveTab("contact")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'contact' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-stone-400 hover:text-stone-600'}`}>Contact & Horaires</button>
          <button onClick={() => setActiveTab("content")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'content' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-stone-400 hover:text-stone-600'}`}>Contenu Site</button>
        </div>

        {activeTab === "dashboard" && (() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const next7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return d;
          });
          const todayISO = today.toISOString().split('T')[0];
          const activeReservations = reservations.filter(r => !r.archived);

          return (
            <div className="space-y-10">

              {/* KPIs rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Aujourd'hui", value: activeReservations.filter(r => r.dateISO === todayISO).length, color: "text-[#D4AF37]", bg: "bg-amber-50 border-amber-200" },
                  { label: "Cette semaine", value: next7Days.reduce((acc, d) => acc + activeReservations.filter(r => r.dateISO === d.toISOString().split('T')[0]).length, 0), color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
                  { label: "Créneaux bloqués", value: blockedSlots.filter(s => s.date >= todayISO).length, color: "text-red-500", bg: "bg-red-50 border-red-200" },
                  { label: "Événements actifs", value: events.filter(e => e.isActive).length, color: "text-green-600", bg: "bg-green-50 border-green-200" },
                ].map(kpi => (
                  <div key={kpi.label} className={`bg-white border ${kpi.bg} rounded-xl p-5 shadow-sm`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">{kpi.label}</p>
                    <p className={`text-4xl font-serif font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Planning 7 jours */}
              <div>
                <h3 className="text-xl font-serif mb-5 flex items-center gap-2 text-stone-800">
                  <CalendarClock size={20} className="text-[#D4AF37]" /> Planning — 7 prochains jours
                </h3>
                <div className="space-y-2">
                  {next7Days.map(day => {
                    const dayISO = day.toISOString().split('T')[0];
                    const isToday = dayISO === todayISO;
                    const dayLabel = day.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
                    const dayResv = activeReservations
                      .filter(r => r.dateISO === dayISO)
                      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
                    const isDayBlocked = blockedSlots.some(s => s.date === dayISO && s.type === 'day');

                    return (
                      <div key={dayISO} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${isToday ? 'border-[#D4AF37]' : 'border-stone-200'}`}>
                        {/* En-tête du jour */}
                        <div className={`flex items-center justify-between px-5 py-3 ${isToday ? 'bg-[#D4AF37]/10' : 'bg-stone-50'}`}>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold uppercase tracking-wider capitalize ${isToday ? 'text-[#D4AF37]' : 'text-stone-500'}`}>
                              {dayLabel}
                            </span>
                            {isToday && <span className="text-[10px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full font-bold uppercase">Aujourd'hui</span>}
                            {isDayBlocked && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Journée bloquée</span>}
                          </div>
                          <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                            {dayResv.length} soin{dayResv.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Créneaux du jour */}
                        {dayResv.length > 0 ? (
                          <div className="divide-y divide-stone-50">
                            {dayResv.map(res => {
                              const svc = services.find(s => s.id === res.serviceId);
                              return (
                                <div key={res.id} className="flex items-center gap-4 px-5 py-3 hover:bg-stone-50 transition">
                                  <span className="text-sm font-bold text-[#D4AF37] w-14 shrink-0 tabular-nums">{res.time}</span>
                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium text-stone-800 text-sm">{res.serviceTitle}</span>
                                    {svc?.duration > 0 && (
                                      <span className="text-xs text-stone-400 ml-2">{svc.duration} mn</span>
                                    )}
                                  </div>
                                  <span className="text-sm text-stone-500 hidden md:block">{res.firstName} {res.lastName}</span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {res.confirmationSent && (
                                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold hidden sm:inline">Confirmé</span>
                                    )}
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                                      {res.status || 'En attente'}
                                    </span>
                                    {svc?.price && <span className="text-xs font-serif text-stone-600 hidden md:inline">{svc.price}</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="px-5 py-3 text-sm text-stone-300 italic">Aucun soin prévu</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ligne inférieure : créneaux bloqués + événements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Créneaux bloqués */}
                <div>
                  <h3 className="text-xl font-serif mb-4 flex items-center gap-2 text-stone-800">
                    <X size={18} className="text-red-400" /> Créneaux bloqués
                  </h3>
                  {blockedSlots.filter(s => s.date >= todayISO).length === 0 ? (
                    <div className="bg-white border border-stone-200 rounded-xl p-6 text-sm text-stone-300 italic shadow-sm">Aucun créneau bloqué à venir.</div>
                  ) : (
                    <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100 shadow-sm overflow-hidden">
                      {[...blockedSlots]
                        .filter(s => s.date >= todayISO)
                        .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
                        .map((slot, idx) => (
                          <div key={idx} className="flex items-center justify-between px-5 py-3">
                            <span className="text-sm text-stone-700 capitalize">
                              {new Date(slot.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${slot.type === 'day' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                              {slot.type === 'day' ? 'Journée entière' : slot.time}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Événements actifs */}
                <div>
                  <h3 className="text-xl font-serif mb-4 flex items-center gap-2 text-stone-800">
                    <FileText size={18} className="text-[#D4AF37]" /> Événements en cours
                  </h3>
                  {events.filter(e => e.isActive).length === 0 ? (
                    <div className="bg-white border border-stone-200 rounded-xl p-6 text-sm text-stone-300 italic shadow-sm">Aucun événement actif.</div>
                  ) : (
                    <div className="space-y-3">
                      {events.filter(e => e.isActive).map(ev => (
                        <div key={ev.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] font-bold uppercase tracking-wider px-2 py-0.5 rounded">{ev.tag || 'Promo'}</span>
                                {ev.discount && <span className="text-sm font-bold text-[#D4AF37]">{ev.discount}</span>}
                              </div>
                              <p className="font-serif text-stone-800 font-medium">{ev.title}</p>
                              <p className="text-sm text-stone-500 mt-1 leading-relaxed">{ev.description}</p>
                            </div>
                            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-green-400 mt-1" title="Actif" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })()}

        {activeTab === "contact" && (
          <div className="bg-white p-8 rounded-xl shadow-sm space-y-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-serif">Informations de contact</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Adresse</label>
                  <input name="address" value={contactInfo.address} onChange={handleContactUpdate} className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Téléphone</label>
                    <input name="phone" value={contactInfo.phone} onChange={handleContactUpdate} className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Email</label>
                    <input name="email" value={contactInfo.email} onChange={handleContactUpdate} className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-stone-100">
              <h3 className="text-2xl font-serif">Horaires d'ouverture</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Plage horaire (ex: Lun - Dim 09:00 - 18:00)</label>
                  <input name="weekdays" value={openingHours.weekdays} onChange={handleHoursUpdate} className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Note complémentaire (ex: Ouvert 7j/7)</label>
                  <input name="details" value={openingHours.details} onChange={handleHoursUpdate} className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none" />
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-400 italic">Les modifications sont enregistrées automatiquement dans votre navigateur.</p>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-serif">Gestion des soins</h3>
              <button 
                onClick={() => setEditService({ id: "new", title: "", price: "", duration: 30, description: "", category: "visage" })}
                className="bg-[#D4AF37] text-white px-6 py-2 text-xs font-bold uppercase tracking-widest"
              >
                Ajouter un soin
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-50 text-stone-400 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="p-4">Titre</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Durée</th>
                    <th className="p-4">Prix</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {services.map(s => (
                    <tr key={s.id} className="text-sm">
                      <td className="p-4 font-medium">{s.title}</td>
                      <td className="p-4 text-stone-500 uppercase text-[10px] tracking-wider">{s.category}</td>
                      <td className="p-4 text-stone-500">{s.duration} mn</td>
                      <td className="p-4 font-serif text-[#D4AF37]">{s.price}</td>
                      <td className="p-4">
                        <div className="flex gap-4">
                          <button onClick={() => setEditService(s)} className="text-blue-500 hover:underline">Modifier</button>
                          <button onClick={() => deleteService(s.id)} className="text-red-500 hover:underline">Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-serif">Gestion des évènements</h3>
              <button 
                onClick={() => setEditEvent({ id: "new", title: "", discount: "", tag: "", description: "", isActive: true })}
                className="bg-[#D4AF37] text-white px-6 py-2 text-xs font-bold uppercase tracking-widest"
              >
                Nouvel évènement
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-50 text-stone-400 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="p-4">Offre</th>
                    <th className="p-4">Réduction</th>
                    <th className="p-4">Tag</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {events.map(ev => (
                    <tr key={ev.id} className="text-sm">
                      <td className="p-4">
                        <div className="font-medium">{ev.title}</div>
                        <div className="text-xs text-stone-400">{ev.description}</div>
                      </td>
                      <td className="p-4 font-serif text-[#D4AF37] font-bold">{ev.discount}</td>
                      <td className="p-4">
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{ev.tag}</span>
                      </td>
                      <td className="p-4">
                        {ev.isActive ? (
                          <span className="text-green-600 flex items-center gap-1"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Actif</span>
                        ) : (
                          <span className="text-stone-400 flex items-center gap-1"><span className="w-2 h-2 bg-stone-300 rounded-full"></span> Inactif</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-4">
                          <button onClick={() => setEditEvent(ev)} className="text-blue-500 hover:underline">Modifier</button>
                          <button onClick={() => deleteEvent(ev.id)} className="text-red-500 hover:underline">Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {events.length === 0 && (
                <div className="p-12 text-center text-stone-400 italic">Aucun évènement configuré.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "reservations" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-serif">Demandes de Réservation</h3>
              <div className="flex bg-white rounded-lg shadow-sm p-1 border border-stone-200">
                <button 
                  onClick={() => setViewMode("active")}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition ${viewMode === 'active' ? 'bg-stone-800 text-white' : 'text-stone-400'}`}
                >
                  Actives
                </button>
                <button 
                  onClick={() => setViewMode("archived")}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition ${viewMode === 'archived' ? 'bg-stone-800 text-white' : 'text-stone-400'}`}
                >
                  Archives
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {reservations
                .filter(r => viewMode === 'active' ? !r.archived : r.archived)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(res => (
                  <div key={res.id} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:border-[#D4AF37]/30 transition-all">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${res.archived ? (res.status === 'Traîtée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') : 'bg-amber-100 text-[#D4AF37]'}`}>
                            {res.archived ? res.status : 'Nouvelle Demande'}
                          </span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                            {new Date(res.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Détails du soin</p>
                            <h4 className="font-serif text-lg text-stone-800">{res.serviceTitle}</h4>
                            <p className="text-sm text-[#D4AF37] font-medium">{res.date} — {res.time}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Client</p>
                            <h4 className="font-medium text-stone-800">{res.firstName} {res.lastName}</h4>
                            <div className="text-sm text-stone-500 flex flex-col">
                              <span>{res.phone}</span>
                              <span>{res.email}</span>
                            </div>
                          </div>
                        </div>

                        {res.notes && (
                          <div className="bg-stone-50 p-3 rounded text-sm text-stone-600 italic">
                            "{res.notes}"
                          </div>
                        )}

                        {res.motif && (
                          <div className="bg-red-50 p-3 rounded text-sm text-red-600">
                            <span className="font-bold">Motif du refus :</span> {res.motif}
                          </div>
                        )}

                        {/* Note interne admin */}
                        <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <MessageSquarePlus size={11} /> Note interne
                          </p>
                          <textarea
                            rows={2}
                            placeholder="Ajouter une note interne…"
                            value={res.adminNote || ''}
                            onChange={e => handleUpdateAdminNote(res.id, e.target.value)}
                            className="w-full text-sm text-stone-700 bg-amber-50 border border-amber-200 rounded p-2 focus:outline-none focus:border-[#D4AF37] resize-none placeholder-stone-300"
                          />
                        </div>
                      </div>

                      <div className="flex md:flex-col justify-end gap-3 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                        {/* Bouton confirmation Gmail */}
                        <button
                          onClick={() => handleSendConfirmation(res)}
                          disabled={res.confirmationSent}
                          title={res.confirmationSent ? 'Confirmation déjà envoyée' : 'Envoyer la confirmation par e-mail'}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition ${res.confirmationSent ? 'bg-blue-100 text-blue-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          <Send size={13} /> {res.confirmationSent ? 'Envoyée ✓' : 'Confirmation'}
                        </button>

                        {/* Modifier date/heure */}
                        <button
                          onClick={() => setEditReservation({ id: res.id, dateISO: res.dateISO || '', time: res.time })}
                          className="flex items-center justify-center gap-2 bg-stone-100 text-stone-600 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition"
                        >
                          <CalendarClock size={13} /> Date / Heure
                        </button>

                        {!res.archived ? (
                          <>
                            <button
                              onClick={() => handleArchiveReservation(res.id, 'process')}
                              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 transition"
                            >
                              <Check size={14} /> Traitée
                            </button>
                            <button
                              onClick={() => {
                                const motif = window.prompt("Motif du refus :");
                                if (motif !== null) handleArchiveReservation(res.id, 'decline', motif);
                              }}
                              className="flex items-center justify-center gap-2 bg-stone-100 text-stone-600 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition"
                            >
                              <X size={14} /> Décliner
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => deleteReservation(res.id)}
                            className="flex items-center justify-center gap-2 text-red-500 hover:text-red-700 transition px-4 py-2 text-[10px] font-bold uppercase tracking-widest"
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              
              {(viewMode === 'active' ? reservations.filter(r => !r.archived).length : reservations.filter(r => r.archived).length) === 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-400 italic shadow-sm">
                  {viewMode === 'active' ? 'Aucune demande en attente.' : 'Aucune archive.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODALE MODIFICATION DATE / HEURE */}
        {editReservation && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-stone-800 flex items-center gap-2">
                  <Edit2 size={18} className="text-[#D4AF37]" /> Modifier date &amp; heure
                </h3>
                <button onClick={() => setEditReservation(null)} className="text-stone-400 hover:text-stone-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Nouvelle date</label>
                  <input
                    type="date"
                    value={editReservation.dateISO}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setEditReservation(prev => ({ ...prev, dateISO: e.target.value }))}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Nouvel horaire</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setEditReservation(prev => ({ ...prev, time: slot }))}
                        className={`py-2 border rounded text-sm transition ${editReservation.time === slot ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'border-stone-200 text-stone-600 hover:border-[#D4AF37]'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setEditReservation(null)}
                  className="flex-1 border border-stone-200 text-stone-600 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition"
                >
                  Annuler
                </button>
                <button
                  disabled={!editReservation.dateISO || !editReservation.time}
                  onClick={() => handleUpdateDateTime(editReservation.id, editReservation.dateISO, editReservation.time)}
                  className="flex-1 bg-[#D4AF37] text-white py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#B5952F] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check size={14} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-8">
            <h3 className="text-2xl font-serif">Gestion du Contenu Site</h3>
            
            {/* Hero Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
              <h4 className="text-lg font-serif border-b border-stone-100 pb-4 flex items-center gap-2 text-[#D4AF37]">
                <ImageIcon size={20} /> Section Hero (Accueil)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Titre Principal</label>
                  <input
                    type="text"
                    value={siteContent.hero.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSiteContent(prev => ({ ...prev, hero: { ...prev.hero, title: val } }));
                    }}
                    className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Sous-titre / Ville</label>
                  <input
                    type="text"
                    value={siteContent.hero.subtitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSiteContent(prev => ({ ...prev, hero: { ...prev.hero, subtitle: val } }));
                    }}
                    className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={siteContent.hero.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSiteContent(prev => ({ ...prev, hero: { ...prev.hero, description: val } }));
                    }}
                    className="w-full border border-stone-200 p-3 rounded-lg focus:border-[#D4AF37] outline-none h-24 resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Image de fond</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={siteContent.hero.image}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSiteContent(prev => ({ ...prev, hero: { ...prev.hero, image: val } }));
                      }}
                      className="flex-1 border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none font-mono text-xs"
                      placeholder="URL de l'image"
                    />
                    <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                      Télécharger
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero', 'image')} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Philosophy Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
              <h4 className="text-lg font-serif border-b border-stone-100 pb-4 flex items-center gap-2 text-[#D4AF37]">
                <FileText size={20} /> Section Philosophie
              </h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Titre</label>
                  <input
                    type="text"
                    value={siteContent.philosophy.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSiteContent(prev => ({ ...prev, philosophy: { ...prev.philosophy, title: val } }));
                    }}
                    className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Paragraphe 1</label>
                    <textarea
                      value={siteContent.philosophy.desc1}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSiteContent(prev => ({ ...prev, philosophy: { ...prev.philosophy, desc1: val } }));
                      }}
                      className="w-full border border-stone-200 p-3 rounded-lg focus:border-[#D4AF37] outline-none h-32 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Paragraphe 2</label>
                    <textarea
                      value={siteContent.philosophy.desc2}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSiteContent(prev => ({ ...prev, philosophy: { ...prev.philosophy, desc2: val } }));
                      }}
                      className="w-full border border-stone-200 p-3 rounded-lg focus:border-[#D4AF37] outline-none h-32 resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Citation</label>
                  <input
                    type="text"
                    value={siteContent.philosophy.quote}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSiteContent(prev => ({ ...prev, philosophy: { ...prev.philosophy, quote: val } }));
                    }}
                    className="w-full border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none italic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Image</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={siteContent.philosophy.image}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSiteContent(prev => ({ ...prev, philosophy: { ...prev.philosophy, image: val } }));
                      }}
                      className="flex-1 border-b border-stone-200 py-2 focus:border-[#D4AF37] outline-none font-mono text-xs"
                      placeholder="URL de l'image"
                    />
                    <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                      Télécharger
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'philosophy', 'image')} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Spaces Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
              <h4 className="text-lg font-serif border-b border-stone-100 pb-4 flex items-center gap-2 text-[#D4AF37]">
                <ImageIcon size={20} /> Espaces Détente
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {siteContent.spaces.map((space, idx) => (
                  <div key={space.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4 relative group">
                    <button 
                      onClick={() => handleDeleteSpace(space.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Supprimer l'espace"
                    >
                      <X size={14} />
                    </button>
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Espace {idx + 1}</p>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Nom</label>
                      <input
                        type="text"
                        value={space.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSiteContent(prev => {
                            const newSpaces = [...prev.spaces];
                            newSpaces[idx] = { ...space, title: val };
                            return { ...prev, spaces: newSpaces };
                          });
                        }}
                        className="w-full bg-white border border-stone-200 p-2 rounded text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Image</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={space.image}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiteContent(prev => {
                              const newSpaces = [...prev.spaces];
                              newSpaces[idx] = { ...space, image: val };
                              return { ...prev, spaces: newSpaces };
                            });
                          }}
                          className="w-full bg-white border border-stone-200 p-2 rounded text-[10px] font-mono focus:border-[#D4AF37] outline-none"
                          placeholder="URL"
                        />
                        <label className="cursor-pointer bg-white border border-stone-200 hover:bg-stone-50 p-2 rounded text-[10px] font-bold text-center transition-colors">
                          Uploader une photo
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'spaces', 'image', space.id)} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Description</label>
                      <textarea
                        value={space.desc}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSiteContent(prev => {
                            const newSpaces = [...prev.spaces];
                            newSpaces[idx] = { ...space, desc: val };
                            return { ...prev, spaces: newSpaces };
                          });
                        }}
                        className="w-full bg-white border border-stone-200 p-2 rounded text-sm focus:border-[#D4AF37] outline-none h-20 resize-none"
                      />
                    </div>
                  </div>
                ))}

                <button 
                  onClick={handleAddSpace}
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 hover:bg-stone-100 hover:border-[#D4AF37] text-stone-400 hover:text-[#D4AF37] transition-all group min-h-[300px]"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md mb-4 transition-all">
                    <Plus size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Ajouter un Espace</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "slots" && (
          <div className="bg-white p-8 rounded-xl shadow-sm space-y-8">
            <div className="flex justify-between items-center border-b border-stone-100 pb-6">
              <div>
                <h3 className="text-2xl font-serif">Gestion des Disponibilités</h3>
                <p className="text-sm text-stone-400 mt-1">Sélectionnez une date puis cliquez sur un créneau pour le bloquer/débloquer.</p>
              </div>
              <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-lg border border-stone-100">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Date :</label>
                <input 
                  type="date" 
                  value={selectedSlotDate} 
                  onChange={(e) => setSelectedSlotDate(e.target.value)}
                  className="bg-transparent font-bold text-stone-800 outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Grille des horaires</h4>
                  <button 
                    onClick={handleToggleDay}
                    className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                      blockedSlots.some(s => s.date === selectedSlotDate && s.type === 'day')
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {blockedSlots.some(s => s.date === selectedSlotDate && s.type === 'day') ? 'Débloquer la journée' : 'Bloquer la journée'}
                  </button>
                </div>

                {blockedSlots.some(s => s.date === selectedSlotDate && s.type === 'day') ? (
                  <div className="bg-red-50 border border-red-100 p-12 text-center rounded-xl">
                    <CheckCircle className="text-red-500 mx-auto mb-4" size={32} />
                    <p className="text-red-600 font-medium font-serif text-lg">Journée entièrement bloquée</p>
                    <p className="text-red-400 text-sm mt-1">Aucune réservation possible pour ce jour.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {timeSlots.map(time => {
                      const isBlocked = blockedSlots.some(s => s.date === selectedSlotDate && s.time === time);
                      return (
                        <button
                          key={time}
                          onClick={() => handleToggleSlot(time)}
                          className={`py-4 border rounded-lg text-sm font-medium transition-all ${
                            isBlocked
                              ? 'bg-red-50 border-red-200 text-red-600 shadow-inner'
                              : 'bg-white border-stone-100 text-stone-600 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-md'
                          }`}
                        >
                          <div className={isBlocked ? 'line-through opacity-50' : ''}>{time}</div>
                          {isBlocked && <div className="text-[8px] uppercase font-bold mt-1">Bloqué</div>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Tous les créneaux bloqués</h4>
                <div className="bg-stone-50 rounded-xl p-6 border border-stone-100 max-h-[400px] overflow-y-auto">
                  <div className="divide-y divide-stone-200">
                    {blockedSlots
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map(slot => (
                        <div key={slot.id} className="py-4 flex justify-between items-center group">
                          <div>
                            <div className="font-serif text-stone-800 text-sm">
                              {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${slot.type === 'day' ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-600'}`}>
                                {slot.time}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => setBlockedSlots(blockedSlots.filter(s => s.id !== slot.id))}
                            className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    {blockedSlots.length === 0 && (
                      <p className="py-8 text-center text-stone-400 italic text-sm">Aucun créneau bloqué actuellement.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODALS (STAY SAME) */}
        {editEvent && (
          <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full font-sans">
              <h4 className="text-2xl font-serif mb-6">{editEvent.id === 'new' ? 'Nouvel évènement' : 'Modifier évènement'}</h4>
              <form onSubmit={saveEvent} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Titre de l'offre (ex: Vente Flash)</label>
                  <input name="title" defaultValue={editEvent.title} required className="w-full border-b border-stone-200 py-2 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Tag (ex: OFFRE LIMITÉE)</label>
                    <input name="tag" defaultValue={editEvent.tag} required className="w-full border-b border-stone-200 py-2 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Réduction (ex: -20%)</label>
                    <input name="discount" defaultValue={editEvent.discount} required className="w-full border-b border-stone-200 py-2 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Description courte (pour la bannière)</label>
                  <input name="description" defaultValue={editEvent.description} required className="w-full border-b border-stone-200 py-2 outline-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" defaultChecked={editEvent.isActive} className="w-4 h-4 accent-[#D4AF37]" id="isActive" />
                  <label htmlFor="isActive" className="text-sm text-stone-600">Offre active et visible sur le site</label>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setEditEvent(null)} className="text-stone-400 font-bold uppercase tracking-widest text-xs transition-colors hover:text-stone-600">Annuler</button>
                  <button type="submit" className="bg-[#D4AF37] text-white px-8 py-3 font-bold uppercase tracking-widest text-xs shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editService && (
          <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full font-sans">
              <h4 className="text-2xl font-serif mb-6">{editService.id === 'new' ? 'Nouveau soin' : 'Modifier le soin'}</h4>
              <form onSubmit={saveService} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Titre du soin</label>
                  <input name="title" defaultValue={editService.title} required className="w-full border-b border-stone-200 py-2 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Prix (ex: 75€)</label>
                    <input name="price" defaultValue={editService.price} required className="w-full border-b border-stone-200 py-2 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Durée (minutes)</label>
                    <input type="number" name="duration" defaultValue={editService.duration} required className="w-full border-b border-stone-200 py-2 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Catégorie</label>
                  <select name="category" defaultValue={editService.category} className="w-full border-b border-stone-200 py-2 outline-none bg-transparent">
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea name="description" defaultValue={editService.description} required className="w-full border-b border-stone-200 py-2 outline-none h-24 resize-none" />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setEditService(null)} className="text-stone-400 font-bold uppercase tracking-widest text-xs transition-colors hover:text-stone-600">Annuler</button>
                  <button type="submit" className="bg-[#D4AF37] text-white px-8 py-3 font-bold uppercase tracking-widest text-xs shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
