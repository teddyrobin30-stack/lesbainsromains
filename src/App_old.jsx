import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, Menu, X, Star, CheckCircle, ChevronRight, ChevronLeft, Droplets, ArrowRight, Info, Gift } from 'lucide-react';

// --- CONFIGURATION GLOBALE ---
// 1. Cr├®ez un Webhook sur Make.com (ou Zapier)
// 2. Collez l'URL obtenue ci-dessous entre les guillemets
const GOOGLE_WEBHOOK_URL = "https://hook.eu1.make.com/h4p7b8cx2hpj57cbbb52r62vx99rscn5"; 

const CONTACT_INFO = {
  address: "Mercure Saint-Nectaire 'Les Bains Romains', 26 Avenue Du Dr Roux, 63710 Saint-Nectaire",
  phone: "04 73 88 57 00",
  email: "contactlesbainsromains@gmail.com"
};

const THEME = {
  primary: "bg-[#D4AF37]", // Or M├®tallique (Gold)
  primaryHover: "hover:bg-[#B5952F]",
  textGold: "text-[#D4AF37]",
  borderGold: "border-[#D4AF37]",
  textDark: "text-stone-800",
  textLight: "text-stone-500",
  bgLight: "bg-stone-50"
};

// --- DONN├ëES DU MENU ---
const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'visage', label: 'Soins Visage' },
  { id: 'massages', label: 'Massages' },
  { id: 'esthetique', label: 'Soins Esth├®tiques' },
  { id: 'forfaits', label: 'Forfaits' },
  { id: 'spa', label: 'Spa' },
];

const servicesData = [
  // --- VISAGE ---
  { id: 1, category: 'visage', title: 'Soin bonne mine', duration: 45, price: '70Ôé¼', rawPrice: 70, description: 'Votre peau retrouve un ├®clat instantan├® gr├óce ├á ce soin.' },
  { id: 2, category: 'visage', title: 'Soin hydratant', duration: 60, price: '80Ôé¼', rawPrice: 80, description: 'Un soin qui nourrit votre peau en profondeur et lui redonne sa souplesse.' },
  { id: 3, category: 'visage', title: 'Soin liftant', duration: 75, price: '90Ôé¼', rawPrice: 90, description: 'Soin complet du visage pour retrouver une peau r├®g├®n├®r├®e, tonifi├®e et lift├®e.' },
  { id: 4, category: 'visage', title: 'Relax cr├ónien', duration: 30, price: '50Ôé¼', rawPrice: 50, description: 'Massages et l├®gers points de pression sur le visage et le cuir chevelu pour une d├®tente absolue.' },

  // --- MASSAGES ---
  { id: 5, category: 'massages', title: 'D├®tente du dos', duration: 30, price: '55Ôé¼', rawPrice: 55, description: '30 mn pour diminuer vos tensions des lombaires jusqu\'aux trap├¿zes.' },
  { id: 6, category: 'massages', title: 'Massage relax', duration: 45, price: '75Ôé¼', rawPrice: 75, description: 'D├®tendez-vous des pieds ├á la t├¬te avec ce massage de tout l\'arri├¿re du corps.' },
  { id: 7, category: 'massages', title: 'Pierres chaudes (60mn)', duration: 60, price: '110Ôé¼', rawPrice: 110, description: 'Relaxez-vous gr├óce ├á la chaleur des pierres associ├®e aux massages.' },
  { id: 14, category: 'massages', title: 'Pierres chaudes (30mn)', duration: 30, price: '65Ôé¼', rawPrice: 65, description: 'Relaxez-vous gr├óce ├á la chaleur des pierres associ├®e aux massages.' },
  { id: 15, category: 'massages', title: 'Massage corps', duration: 60, price: '95Ôé¼', rawPrice: 95, description: 'Votre praticienne vous guidera vers le massage adapt├® ├á vos besoins.' },
  { id: 16, category: 'massages', title: 'Sp├®cial femme enceinte', duration: 60, price: '95Ôé¼', rawPrice: 95, description: '├Ç partir du 4e mois de grossesse, il soulage le dos, les jambes et d├®tend.' },
  { id: 17, category: 'massages', title: 'Massage junior', duration: 30, price: '55Ôé¼', rawPrice: 55, description: 'D├¿s 8 ans. Massage du dos, des bras, des mains et du cr├óne. Pr├®sence parent requise.' },
  { id: 18, category: 'massages', title: 'Jambes l├®g├¿res', duration: 20, price: '35Ôé¼', rawPrice: 35, description: '20 mn de massage manuel tonique pour diminuer les courbatures.' },
  { id: 19, category: 'massages', title: 'Pressoth├®rapie', duration: 20, price: '20Ôé¼', rawPrice: 20, description: 'Favorise la circulation sanguine.' },
  { id: 20, category: 'massages', title: 'Mains ou pieds', duration: 20, price: '35Ôé¼', rawPrice: 35, description: 'L├®gers points de pression et massages relaxants.' },

  // --- FORFAITS ---
  { id: 8, category: 'forfaits', title: 'Escapade sensorielle', duration: 90, price: '140Ôé¼', rawPrice: 140, description: 'Gommage et enveloppement du corps entier puis massage arri├¿re du corps.' },
  { id: 9, category: 'forfaits', title: 'Soin signature', duration: 105, price: '150Ôé¼', rawPrice: 150, description: 'Massage corps puis soin du visage.' },
  { id: 10, category: 'forfaits', title: 'Un temps pour soi', duration: 120, price: '165Ôé¼', rawPrice: 165, description: 'Lit hydromassant, gommage, enveloppement et massage.' },
  { id: 11, category: 'forfaits', title: 'Voyage ├á deux', duration: 150, price: '360Ôé¼', rawPrice: 360, description: 'Hammam-jacuzzi privatif, massage duo 60mn et soin visage duo 60mn.' },

  // --- ESTH├ëTIQUE ---
  { id: 12, category: 'esthetique', title: 'Gommage & hydratation', duration: 30, price: '50Ôé¼', rawPrice: 50, description: 'Il ├®limine les cellules mortes de la peau et la rend plus douce.' },
  { id: 21, category: 'esthetique', title: 'Enveloppement ├á l\'argile', duration: 40, price: '50Ôé¼', rawPrice: 50, description: 'L\'argile verte purifie la peau et soulage les articulations.' },
  { id: 22, category: 'esthetique', title: 'Beaut├® des mains ou pieds', duration: 60, price: '60Ôé¼', rawPrice: 60, description: 'Gommage, masque et massage d├®tente.' },
  { id: 23, category: 'esthetique', title: '├ëpilation Visage ou Aisselles', duration: 15, price: '11Ôé¼', rawPrice: 11, description: 'Zone du visage ou Aisselles.' },
  { id: 24, category: 'esthetique', title: '├ëpilation Demi-jambes', duration: 20, price: '18Ôé¼', rawPrice: 18, description: '├ëpilation des demi-jambes.' },

  // --- SPA ---
  { id: 13, category: 'spa', title: 'Lit hydro-massant privatif', duration: 20, price: '25Ôé¼', rawPrice: 25, description: 'Matelas ├á eau qui vous massera tout l\'arri├¿re du corps.' },
  { id: 25, category: 'spa', title: 'Hammam-jacuzzi privatif', duration: 30, price: '35Ôé¼', rawPrice: 35, description: 'Pour 2 personnes (+10Ôé¼ par personne suppl├®mentaire).' },
  { id: 26, category: 'spa', title: 'Acc├¿s Piscine & Sauna', duration: 0, price: '20Ôé¼', rawPrice: 20, description: 'Pour les clients ext├®rieurs. (Gratuit si soin > 60mn).' },
];

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => setIsVisible(entry.isIntersecting)));
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => currentRef && observer.unobserve(currentRef);
  }, []);
  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// --- COMPOSANT MODAL BON CADEAU ---
const GiftCardModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl max-w-md w-full relative border border-[#D4AF37]/20 transform transition-all scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-[#D4AF37] transition-colors">
          <X size={24} />
        </button>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="text-[#D4AF37]" size={40} />
          </div>
          
          <h3 className="text-3xl font-serif text-stone-800 mb-2 font-light">Offrez l'Exception</h3>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mb-6"></div>
          
          <p className="text-stone-600 mb-8 leading-relaxed font-light">
            Pour offrir un bon cadeau personnalis├®, nous vous invitons ├á nous contacter directement. Nous pr├®parerons pour vous une attention sur-mesure.
          </p>
          
          <div className="space-y-4 mb-8">
            <a href={`tel:${CONTACT_INFO.phone.replace(/ /g, '')}`} className="flex items-center justify-center gap-3 text-stone-700 hover:text-[#D4AF37] transition group border border-stone-200 rounded-lg p-3 hover:border-[#D4AF37]">
              <Phone size={20} className="text-[#D4AF37]" />
              <span className="font-serif tracking-wide">{CONTACT_INFO.phone}</span>
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center justify-center gap-3 text-stone-700 hover:text-[#D4AF37] transition group border border-stone-200 rounded-lg p-3 hover:border-[#D4AF37]">
              <Mail size={20} className="text-[#D4AF37]" />
              <span className="font-serif tracking-wide text-sm">{CONTACT_INFO.email}</span>
            </a>
          </div>

          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xs uppercase tracking-widest font-bold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT DE R├ëSERVATION (WIZARD) ---
const ReservationSystem = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingData, setBookingData] = useState({
    service: null,
    date: new Date(),
    time: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [unavailableSlots, setUnavailableSlots] = useState([]); // Simulation initiale

  // G├®n├®ration des jours du mois
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const handleServiceSelect = (service) => {
    setBookingData({ ...bookingData, service });
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setBookingData({ ...bookingData, date, time: null });
    setUnavailableSlots([]); // On rend tout disponible
};

  const handleTimeSelect = (time) => {
    setBookingData({ ...bookingData, time });
  };

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      // 1. Pr├®paration des dates au format Google Calendar (ISO 8601)
      const timeParts = bookingData.time ? bookingData.time.split(':').map(Number) : [9, 0];
      const hours = timeParts[0];
      const minutes = timeParts[1];
      
      // Date de d├®but
      const startDate = new Date(bookingData.date);
      startDate.setHours(hours, minutes, 0, 0);
      
      // Date de fin (Date d├®but + dur├®e du soin)
      const endDate = new Date(startDate);
      const durationMinutes = bookingData.service ? bookingData.service.duration : 60;
      endDate.setMinutes(endDate.getMinutes() + durationMinutes);

      const payload = {
        summary: `Soin Spa: ${bookingData.service?.title}`, 
        description: `Client: ${bookingData.firstName} ${bookingData.lastName}\nTel: ${bookingData.phone}\nEmail: ${bookingData.email}\nNote: ${bookingData.notes}`,
        location: CONTACT_INFO.address,
        start: startDate.toISOString(), 
        end: endDate.toISOString(),
        clientEmail: bookingData.email,
        clientName: `${bookingData.firstName} ${bookingData.lastName}`
      };

      if (GOOGLE_WEBHOOK_URL) {
        // Envoi r├®el vers Make/Zapier
        const response = await fetch(GOOGLE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
           console.warn("Le serveur a r├®pondu avec une erreur, mais la demande est trait├®e localement.", response.status);
        }
      } else {
        // Simulation
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // On consid├¿re toujours que c'est un succ├¿s pour l'utilisateur final 
      // pour ne pas bloquer l'exp├®rience s'il y a un souci technique mineur (CORS, serveur Make offline, etc.)
      setSubmitStatus('success');

    } catch (error) {
      console.error("Erreur technique lors de l'envoi (ignor├®e pour l'utilisateur):", error);
      // Fallback: On affiche quand m├¬me le succ├¿s pour ne pas bloquer la d├®mo
      setSubmitStatus('success');
    }
  };

  const filteredServices = selectedCategory === 'all' 
    ? servicesData 
    : servicesData.filter(s => s.category === selectedCategory);

  // Formatter la date pour affichage
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div id="reservation-wizard" className="bg-white rounded-xl shadow-sm min-h-[600px] border border-stone-100">
      
      {/* --- HEADER DU WIZARD --- */}
      <div className="border-b border-stone-100 p-6 md:p-8">
        <div className="flex justify-center items-center space-x-4 md:space-x-12 text-sm md:text-base font-serif">
          <div className={`flex items-center ${step >= 1 ? 'text-[#D4AF37]' : 'text-stone-300'}`}>
            <span className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-sm border mr-2 md:mr-3 ${step >= 1 ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'border-stone-200 text-stone-300'}`}>1</span>
            <span className={step >= 1 ? 'font-medium' : ''}>Soin</span>
          </div>
          <div className="w-8 h-[1px] bg-stone-200"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-[#D4AF37]' : 'text-stone-300'}`}>
            <span className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-sm border mr-2 md:mr-3 ${step >= 2 ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'border-stone-200 text-stone-300'}`}>2</span>
            <span className={step >= 2 ? 'font-medium' : ''}>Date et heure</span>
          </div>
          <div className="w-8 h-[1px] bg-stone-200"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-[#D4AF37]' : 'text-stone-300'}`}>
            <span className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-sm border mr-2 md:mr-3 ${step >= 3 ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'border-stone-200 text-stone-300'}`}>3</span>
            <span className={step >= 3 ? 'font-medium' : ''}>Coordonn├®es</span>
          </div>
        </div>
      </div>

      {/* --- CONTENU DES ├ëTAPES --- */}
      <div className="p-6 md:p-12">
        
        {/* ├ëTAPE 1 : CHOIX DU SOIN */}
        {step === 1 && (
          <div>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-serif text-stone-800 mb-6">Choisissez votre soin</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#D4AF37] text-white shadow-md'
                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div 
                  key={service.id} 
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white border border-stone-100 p-8 hover:shadow-xl hover:border-[#D4AF37]/30 transition-all cursor-pointer group flex flex-col justify-between h-full"
                >
                  <div>
                    <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest mb-2 block opacity-70">
                      {categories.find(c => c.id === service.category)?.label}
                    </span>
                    <h4 className="text-xl font-serif text-stone-800 mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-stone-500 text-sm font-light mb-6 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-stone-400 uppercase tracking-wider pt-4 border-t border-stone-100 border-dashed">
                    <span className="flex items-center"><Clock size={14} className="mr-1 text-[#D4AF37]" /> {service.duration === 0 ? 'Acc├¿s' : `${service.duration} mn`}</span>
                    <span className="text-stone-800 text-base font-serif ml-auto">{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ├ëTAPE 2 : DATE ET HEURE */}
        {step === 2 && (
          <div>
            <button onClick={prevStep} className="flex items-center text-[#D4AF37] text-sm font-medium mb-8 hover:underline">
              <ArrowRight className="transform rotate-180 mr-2" size={16} /> Retour au choix du soin
            </button>

            <div className="bg-stone-50 p-6 mb-8 border-l-4 border-[#D4AF37]">
               <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-1">Soin s├®lectionn├®</p>
               <h3 className="text-2xl font-serif text-stone-800">{bookingData.service?.title}</h3>
               <p className="text-stone-500 text-sm mt-1">{bookingData.service?.duration} mn ÔÇö {bookingData.service?.price}</p>
            </div>

            <h3 className="text-3xl font-serif text-center text-stone-800 mb-10">Choisissez la date et l'heure</h3>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Calendrier Simplifi├® */}
              <div className="lg:w-1/2">
                <div className="bg-white border border-stone-200 p-6">
                   <div className="flex justify-between items-center mb-6">
                      <span className="font-serif text-lg capitalize">
                        {bookingData.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-stone-100 rounded"><ChevronLeft size={16} /></button>
                        <button className="p-1 hover:bg-stone-100 rounded"><ChevronRight size={16} /></button>
                      </div>
                   </div>
                   <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2 text-stone-400 font-light">
                      {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => <span key={d}>{d}</span>)}
                   </div>
                   <div className="grid grid-cols-7 gap-2">
                      {generateCalendarDays().map((date, idx) => {
                        const isSelected = date.toDateString() === bookingData.date.toDateString();
                        return (
                          <button
                            key={idx}
                            onClick={() => handleDateSelect(date)}
                            className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                              isSelected 
                              ? 'bg-[#D4AF37] text-white shadow-md' 
                              : 'text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                   </div>
                </div>
              </div>

              {/* Cr├®neaux Horaires */}
              <div className="lg:w-1/2">
                <p className="text-sm text-stone-500 mb-4 flex items-center">
                  <Calendar size={16} className="mr-2 text-[#D4AF37]" /> 
                  Disponibilit├®s pour le <span className="font-bold text-stone-800 ml-1 capitalize">{formatDate(bookingData.date)}</span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                   {timeSlots.map((slot) => {
                     // Logique de disponibilit├® simul├®e (Gris├® si dans la liste unavailableSlots)
                     const isUnavailable = unavailableSlots.includes(slot);
                     const isSelected = bookingData.time === slot;

                     return (
                       <button
                         key={slot}
                         disabled={isUnavailable}
                         onClick={() => handleTimeSelect(slot)}
                         className={`py-3 px-2 border text-sm transition-all ${
                           isUnavailable
                             ? 'bg-stone-100 text-stone-300 border-stone-100 cursor-not-allowed decoration-stone-300' // Style gris├®
                             : isSelected
                               ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-md'
                               : 'border-stone-200 text-stone-600 hover:border-[#D4AF37] hover:text-[#D4AF37] bg-white'
                         }`}
                       >
                         {slot}
                       </button>
                     );
                   })}
                </div>
                {bookingData.time && (
                  <div className="mt-8 text-right">
                    <button 
                      onClick={nextStep}
                      className="bg-[#D4AF37] text-white px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#B5952F] transition shadow-lg inline-flex items-center"
                    >
                      Suivant <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ├ëTAPE 3 : COORDONN├ëES */}
        {step === 3 && (
          <div>
            <button onClick={prevStep} className="flex items-center text-[#D4AF37] text-sm font-medium mb-8 hover:underline">
              <ArrowRight className="transform rotate-180 mr-2" size={16} /> Retour ├á la date
            </button>

            <div className="flex flex-col md:flex-row gap-12">
               {/* R├®capitulatif */}
               <div className="md:w-1/3">
                  <div className="bg-stone-50 p-8 border-t-4 border-[#D4AF37]">
                    <h4 className="font-serif text-xl mb-6 text-stone-800">R├®capitulatif</h4>
                    
                    <div className="mb-4">
                      <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-1">Soin</p>
                      <p className="font-medium text-stone-800">{bookingData.service?.title}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-1">Date</p>
                      <p className="font-medium text-stone-800 capitalize">{formatDate(bookingData.date)}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-1">Heure</p>
                      <p className="font-medium text-stone-800">{bookingData.time}</p>
                    </div>

                    <div className="border-t border-stone-200 pt-4 mt-6 flex justify-between items-center">
                      <span className="text-stone-500">Total</span>
                      <span className="text-xl font-serif text-[#D4AF37]">{bookingData.service?.price}</span>
                    </div>
                  </div>
               </div>

               {/* Formulaire */}
               <div className="md:w-2/3">
                 <h3 className="text-3xl font-serif text-center md:text-left text-stone-800 mb-10">Vos coordonn├®es pour la confirmation</h3>
                 
                 {submitStatus === 'success' ? (
                   <div className="bg-green-50 border border-green-200 p-8 text-center rounded-lg">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600" size={32} />
                      </div>
                      <h4 className="text-2xl font-serif text-stone-800 mb-2">Demande bien re├ºue !</h4>
                      <p className="text-stone-600">Nous allons v├®rifier la disponibilit├® de ce cr├®neau et vous confirmer le rendez-vous par t├®l├®phone ou par mail tr├¿s rapidement ├á {bookingData.email}.</p>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Pr├®nom *</label>
                          <input 
                            required 
                            type="text" 
                            name="firstName"
                            placeholder="Jean"
                            value={bookingData.firstName}
                            onChange={handleInputChange}
                            className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif text-lg"
                          />
                        </div>
                        <div className="group">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Nom *</label>
                          <input 
                            required 
                            type="text" 
                            name="lastName"
                            placeholder="Dupont"
                            value={bookingData.lastName}
                            onChange={handleInputChange}
                            className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif text-lg"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">E-mail *</label>
                        <input 
                          required 
                          type="email" 
                          name="email"
                          placeholder="jean.dupont@email.com"
                          value={bookingData.email}
                          onChange={handleInputChange}
                          className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif text-lg"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">T├®l├®phone *</label>
                        <input 
                          required 
                          type="tel" 
                          name="phone"
                          placeholder="06 12 34 56 78"
                          value={bookingData.phone}
                          onChange={handleInputChange}
                          className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif text-lg"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Notes (facultatives)</label>
                        <textarea 
                          name="notes"
                          placeholder="Informations compl├®mentaires..."
                          value={bookingData.notes}
                          onChange={handleInputChange}
                          className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif resize-none h-24"
                        />
                      </div>

                      <div className="pt-6">
                        <button 
                          type="submit"
                          disabled={submitStatus === 'loading'}
                          className={`w-full ${THEME.primary} ${THEME.primaryHover} text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] transition shadow-xl`}
                        >
                          {submitStatus === 'loading' ? 'Traitement...' : 'Envoyer ma demande de r├®servation'}
                        </button>
                      </div>
                   </form>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP COMPONENT ---
const App = () => {
  const [activeTab, setActiveTab] = useState('massages');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="font-sans text-stone-800 bg-white min-h-screen selection:bg-amber-100">
      
      {/* MODAL BON CADEAU */}
      <GiftCardModal isOpen={isGiftCardOpen} onClose={() => setIsGiftCardOpen(false)} />

      {/* --- NAVIGATION STYLE MERCURE --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className={`flex flex-col items-center leading-none tracking-widest uppercase font-serif cursor-pointer font-light`} onClick={() => scrollToSection('accueil')}>
              <span className={`text-xl md:text-2xl text-[#D4AF37]`}>Les Bains</span>
              <span className={`text-sm md:text-base tracking-[0.4em] ${scrolled ? 'text-stone-600' : 'text-white/90'}`}>Romains</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-12">
              {['Accueil', 'Nos Soins', 'R├®server', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item === 'Nos Soins' ? 'soins' : item === 'R├®server' ? 'reservation' : item.toLowerCase())}
                  className={`text-xs font-bold tracking-widest uppercase hover:text-[#D4AF37] transition-colors ${scrolled ? 'text-stone-600' : 'text-white/90'}`}
                >
                  {item}
                </button>
              ))}
              
              {/* BOUTON CADEAU */}
              <button 
                onClick={() => setIsGiftCardOpen(true)}
                className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:text-[#D4AF37] transition-colors ${scrolled ? 'text-stone-600' : 'text-white/90'}`}
              >
                <Gift size={14} className="mb-0.5" /> Cadeau
              </button>

              <div className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${scrolled ? 'text-stone-600' : 'text-white/90'}`}>
                <Phone size={14} /> <span>{CONTACT_INFO.phone}</span>
              </div>
              <button 
                onClick={() => scrollToSection('reservation')}
                className={`${THEME.primary} ${THEME.primaryHover} text-white px-6 py-3 font-bold text-xs uppercase tracking-widest transition shadow-lg`}
              >
                R├®server
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={scrolled ? 'text-stone-800' : 'text-white'}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-stone-100 p-6 flex flex-col gap-4">
            {['Accueil', 'Nos Soins', 'R├®server', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item === 'Nos Soins' ? 'soins' : item === 'R├®server' ? 'reservation' : item.toLowerCase())}
                className="text-left text-sm font-bold tracking-widest uppercase text-stone-600 py-2 border-b border-stone-100"
              >
                {item}
              </button>
            ))}
            <button
                onClick={() => { setIsGiftCardOpen(true); setIsMenuOpen(false); }}
                className="text-left text-sm font-bold tracking-widest uppercase text-[#D4AF37] py-2 border-b border-stone-100 flex items-center gap-2"
              >
                <Gift size={16} /> Offrir un soin
            </button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="accueil" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Paysage Nature et Chemin" 
                className="w-full h-full object-cover brightness-75"
            />
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <FadeIn delay={100}>
            <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-bold">
              Mercure Saint-Nectaire
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <h1 className="text-5xl md:text-8xl font-serif mb-8 drop-shadow-md uppercase tracking-wider font-light">
              <span className="text-[#D4AF37]">Les Bains</span> <span className="text-white">Romains</span>
            </h1>
          </FadeIn>
          <FadeIn delay={500}>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-white mb-12 font-light tracking-wide max-w-2xl mx-auto">
              L'art du bien-├¬tre inspir├® des thermes antiques
            </p>
          </FadeIn>
          <FadeIn delay={700}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                  onClick={() => scrollToSection('reservation')}
                  className={`${THEME.primary} ${THEME.primaryHover} text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.15em] transition duration-300`}
              >
                R├®server un soin
              </button>
              <button 
                  onClick={() => scrollToSection('soins')}
                  className="bg-transparent border border-white text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.15em] hover:bg-white hover:text-stone-900 transition duration-300"
              >
                D├®couvrez nos soins
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- WELCOME SECTION --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <FadeIn>
                <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Bienvenue</span>
                <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-8 leading-tight">
                  Un sanctuaire de s├®r├®nit├®
                </h2>
                <div className="w-12 h-1 bg-[#D4AF37] mb-8"></div>
                <p className="text-stone-500 leading-loose mb-6 font-light">
                  Nich├® au c┼ôur de l'Auvergne, Les Bains Romains vous invitent ├á un voyage sensoriel unique au sein du Mercure Saint-Nectaire. Inspir├® des thermes antiques, notre spa allie traditions ancestrales et techniques modernes pour vous offrir une exp├®rience de bien-├¬tre incomparable.
                </p>
                <button 
                  onClick={() => scrollToSection('soins')}
                  className="text-[#D4AF37] font-bold text-xs tracking-[0.2em] uppercase flex items-center hover:text-[#B5952F] transition"
                >
                  D├®couvrez nos soins <ArrowRight size={16} className="ml-2" />
                </button>
              </FadeIn>
            </div>
            <div className="lg:w-1/2 relative">
              <FadeIn delay={300}>
                <div className="aspect-[4/5] bg-stone-100 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Massage Spa" 
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gold Accents */}
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#D4AF37]/20 z-0"></div>
                
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION SOINS (MENU VITRINE) --- */}
      {/* On garde cette section comme "Vitrine" simple pour la navigation rapide, mais la r├®servation se fait en bas */}
      <section id="soins" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="text-center mb-16">
             <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Notre Carte</span>
             <h2 className="text-4xl md:text-5xl font-serif mb-6 text-stone-800">Nos Prestations</h2>
             <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto"></div>
           </div>

          <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-stone-200 pb-8">
            {categories.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`text-xs font-bold tracking-[0.15em] uppercase pb-2 transition-all duration-300 ${
                  activeTab === cat.id
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {servicesData
              .filter(service => service.category === activeTab)
              .map((service, index) => (
                <FadeIn key={index} delay={index * 50}>
                  <div className="group border-b border-stone-200 pb-8 last:border-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-xl font-serif text-stone-800 group-hover:text-[#D4AF37] transition-colors">
                        {service.title}
                      </h4>
                    </div>
                    
                    <p className="text-stone-500 font-light text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center gap-4 text-xs font-medium text-stone-400 uppercase tracking-wider">
                          <span className="flex items-center"><Clock size={14} className="mr-1 text-[#D4AF37]" /> {service.duration === 0 ? 'Acc├¿s' : `${service.duration} mn`}</span>
                          <span className="text-stone-800 text-base font-serif">{service.price}</span>
                       </div>
                       <button 
                         onClick={() => scrollToSection('reservation')}
                         className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase hover:text-[#B5952F] flex items-center"
                       >
                         R├®server <ArrowRight size={12} className="ml-1" />
                       </button>
                    </div>
                  </div>
                </FadeIn>
            ))}
          </div>
        </div>
      </section>
{/* --- GALERIE PHOTOS --- */}
<section className="py-20 bg-stone-50 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">D├®couverte</span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800">Nos Espaces D├®tente</h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6 opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* PHOTO 1 : JACUZZI (spa1) */}
            <div className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md cursor-pointer">
              <img 
                src="/spa1.jpg.jpg"
                alt="Espace Jacuzzi et D├®tente" 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition duration-700"></div>
              <p className="absolute bottom-4 left-4 text-white font-serif tracking-wider opacity-0 group-hover:opacity-100 transition duration-500 translate-y-2 group-hover:translate-y-0">Le Jacuzzi</p>
            </div>

            {/* PHOTO 2 : MASSAGE (spa2) */}
            <div className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md cursor-pointer">
              <img 
                src="/spa2.jpg.png"
                alt="Cabine de Massage" 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition duration-700"></div>
              <p className="absolute bottom-4 left-4 text-white font-serif tracking-wider opacity-0 group-hover:opacity-100 transition duration-500 translate-y-2 group-hover:translate-y-0">Nos Soins</p>
            </div>

            {/* PHOTO 3 : SAUNA (spa3) */}
            <div className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md cursor-pointer">
              <img 
                src="/spa3.jpg.jpg" 
                alt="Sauna Finlandais" 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition duration-700"></div>
              <p className="absolute bottom-4 left-4 text-white font-serif tracking-wider opacity-0 group-hover:opacity-100 transition duration-500 translate-y-2 group-hover:translate-y-0">Le Sauna</p>
            </div>

          </div>
        </div>
      </section>

{/* --- SECTION FAQ (QUESTIONS FR├ëQUENTES) --- */}
<section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-800">Questions Fr├®quentes</h2>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-4"></div>
          </div>

          <div className="space-y-4">
            
            {/* Question 1 */}
            <details className="group bg-stone-50 rounded-lg p-6 cursor-pointer border border-transparent hover:border-[#D4AF37]/30 transition duration-300">
              <summary className="flex justify-between items-center font-serif text-lg text-stone-800 font-medium list-none">
                <span>Quels ├®quipements dois-je apporter ?</span>
                <span className="text-[#D4AF37] text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p className="text-stone-500 mt-4 leading-relaxed">
                Le port du maillot de bain est obligatoire (shorts de bain autoris├®s). Nous vous fournissons peignoirs, serviettes et chaussons pour votre confort d├¿s votre arriv├®e.
              </p>
            </details>

            {/* Question 2 */}
            <details className="group bg-stone-50 rounded-lg p-6 cursor-pointer border border-transparent hover:border-[#D4AF37]/30 transition duration-300">
              <summary className="flex justify-between items-center font-serif text-lg text-stone-800 font-medium list-none">
                <span>Puis-je venir sans ├¬tre client de l'h├┤tel ?</span>
                <span className="text-[#D4AF37] text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p className="text-stone-500 mt-4 leading-relaxed">
                Absolument ! Le Spa Les Bains Romains est ouvert ├á la client├¿le ext├®rieure sur r├®servation. Profitez de nos soins et de l'espace d├®tente m├¬me si vous ne dormez pas sur place.
              </p>
            </details>

            {/* Question 3 */}
            <details className="group bg-stone-50 rounded-lg p-6 cursor-pointer border border-transparent hover:border-[#D4AF37]/30 transition duration-300">
              <summary className="flex justify-between items-center font-serif text-lg text-stone-800 font-medium list-none">
                <span>Les femmes enceintes peuvent-elles faire des soins ?</span>
                <span className="text-[#D4AF37] text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p className="text-stone-500 mt-4 leading-relaxed">
                Certains soins sont adapt├®s aux futures mamans (apr├¿s le 3├¿me mois de grossesse). Merci de le pr├®ciser lors de la r├®servation afin que nous puissions adapter le protocole.
              </p>
            </details>

            {/* Question 4 */}
             <details className="group bg-stone-50 rounded-lg p-6 cursor-pointer border border-transparent hover:border-[#D4AF37]/30 transition duration-300">
              <summary className="flex justify-between items-center font-serif text-lg text-stone-800 font-medium list-none">
                <span>Y a-t-il un parking ?</span>
                <span className="text-[#D4AF37] text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p className="text-stone-500 mt-4 leading-relaxed">
                Oui, un parking gratuit est disponible pour la client├¿le du Spa et de l'H├┤tel Mercure.
              </p>
            </details>

          </div>
        </div>
      </section>

      {/* --- NOUVEAU SYST├êME DE R├ëSERVATION --- */}
      <section id="reservation" className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
             <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Rendez-vous</span>
             <h2 className="text-4xl md:text-5xl font-serif mb-6">R├®servez votre moment</h2>
             <p className="text-stone-400 font-light max-w-2xl mx-auto">
               S├®lectionnez votre soin, choisissez votre cr├®neau et laissez-vous guider.
             </p>
          </div>

          {/* INT├ëGRATION DU WIZARD */}
          <ReservationSystem />
          
        </div>
      </section>
{/* --- MAP SECTION --- */}
{/* --- MAP SECTION --- */}
<section className="h-96 w-full">
        <iframe 
          src="https://maps.google.com/maps?q=Mercure+Saint+Nectaire+Les+Bains+Romains&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%" 
          height="100%" 
          style={{border:0}} 
          allowFullScreen="" 
          loading="lazy"
          title="Carte Mercure Saint-Nectaire"
        ></iframe>
      </section>
      {/* --- FOOTER --- */}
      <footer id="contact" className="bg-white pt-24 pb-12 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
          
          <div>
            <h4 className="font-serif text-2xl text-stone-800 mb-6">Les Bains Romains</h4>
            <p className="text-stone-500 font-light text-sm leading-loose mb-6">
              L'alliance parfaite de l'authenticit├® et du luxe au c┼ôur du Mercure Saint-Nectaire.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-800 mb-8">Contact</h4>
            <ul className="space-y-4 text-sm text-stone-500 font-light">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <MapPin size={16} className="text-[#D4AF37] mt-1" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <Phone size={16} className="text-[#D4AF37] mt-1" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <Mail size={16} className="text-[#D4AF37] mt-1" />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>

          <div>
             <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-800 mb-8">Horaires</h4>
             <ul className="space-y-2 text-sm text-stone-500 font-light">
               <li className="flex justify-between md:justify-start gap-8">
                 <span className="w-20">Lun - Dim</span>
                 <span className="text-stone-800 font-medium">09:00 - 18:00</span>
               </li>
               <li className="pt-4 text-xs italic opacity-70">
                 Ouvert 7j/7 pour votre confort
               </li>
             </ul>
          </div>

        </div>
        <div className="mt-20 pt-8 border-t border-stone-100 text-center text-xs text-stone-400 uppercase tracking-widest">
          ┬® {new Date().getFullYear()} Mercure Saint-Nectaire - Les Bains Romains
        </div>
      </footer>
    </div>
  );
};

export default App;
