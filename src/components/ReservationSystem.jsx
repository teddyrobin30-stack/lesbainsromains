import React, { useState } from 'react';
import { Clock, Calendar, ArrowRight, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const ReservationSystem = ({ contactInfo, services, onReservationAdded, categories, THEME, blockedSlots = [] }) => {
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

  // Génération des jours du mois
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('loading');

    // Sauvegarde locale dans l'état global (Réservations de l'Admin)
    const newReservation = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      serviceId: bookingData.service?.id,
      serviceTitle: bookingData.service?.title,
      date: formatDate(bookingData.date),
      dateISO: bookingData.date.toISOString().split('T')[0],
      time: bookingData.time,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      email: bookingData.email,
      phone: bookingData.phone,
      notes: bookingData.notes,
      archived: false,
      status: 'En attente'
    };

    if (onReservationAdded) {
      onReservationAdded(newReservation);
    }

    // TODO: remplacer par l'appel à l'API Gmail
    setSubmitStatus('success');
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div id="reservation-wizard" className="bg-white rounded-xl shadow-sm min-h-[600px] border border-stone-100">
      {/* HEADER DU WIZARD */}
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
            <span className={step >= 3 ? 'font-medium' : ''}>Coordonnées</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-12">
        {step === 1 && (
          <div>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-serif text-stone-800 mb-6">Choisissez votre soin</h3>
              <p className="text-stone-500 text-sm italic -mt-6 mb-8 text-center">(La durée des soins inclut le temps de déshabillage, rhabillage et éventuelle douche)</p>
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
                    <p className="text-stone-500 text-sm font-light mb-6 leading-relaxed">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-stone-400 uppercase tracking-wider pt-4 border-t border-stone-100 border-dashed">
                    <span className="flex items-center"><Clock size={14} className="mr-1 text-[#D4AF37]" /> {service.duration === 0 ? 'Accès' : `${service.duration} mn`}</span>
                    <span className="text-stone-800 text-base font-serif ml-auto">{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <button onClick={prevStep} className="flex items-center text-[#D4AF37] text-sm font-medium mb-8 hover:underline">
              <ArrowRight className="transform rotate-180 mr-2" size={16} /> Retour au choix du soin
            </button>

            <div className="bg-stone-50 p-6 mb-8 border-l-4 border-[#D4AF37]">
               <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-1">Soin sélectionné</p>
               <h3 className="text-2xl font-serif text-stone-800">{bookingData.service?.title}</h3>
               <p className="text-stone-500 text-sm mt-1">{bookingData.service?.duration} mn — {bookingData.service?.price}</p>
            </div>

            <h3 className="text-3xl font-serif text-center text-stone-800 mb-10">Choisissez la date et l'heure</h3>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="bg-white border border-stone-200 p-6">
                   <div className="flex justify-between items-center mb-6">
                      <span className="font-serif text-lg capitalize">{bookingData.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
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
                        const dateString = date.toISOString().split('T')[0];
                        const isBlockedDay = blockedSlots.some(s => s.date === dateString && s.type === 'day');

                        return (
                          <button
                            key={idx}
                            disabled={isBlockedDay}
                            onClick={() => handleDateSelect(date)}
                            className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                              isBlockedDay
                                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                : isSelected 
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

              <div className="lg:w-1/2">
                <p className="text-sm text-stone-500 mb-4 flex items-center">
                  <Calendar size={16} className="mr-2 text-[#D4AF37]" /> 
                  Disponibilités pour le <span className="font-bold text-stone-800 ml-1 capitalize">{formatDate(bookingData.date)}</span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                   {timeSlots.map((slot) => {
                     const dateString = bookingData.date.toISOString().split('T')[0];
                     const isTimeBlocked = blockedSlots.some(s => s.date === dateString && s.time === slot);
                     const isUnavailable = unavailableSlots.includes(slot) || isTimeBlocked;
                     const isSelected = bookingData.time === slot;
                     return (
                       <button
                         key={slot}
                         disabled={isUnavailable}
                         onClick={() => handleTimeSelect(slot)}
                         className={`py-3 px-2 border text-sm transition-all ${
                           isUnavailable
                             ? 'bg-stone-100 text-stone-300 border-stone-100 cursor-not-allowed decoration-stone-300'
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
                    <button onClick={nextStep} className="bg-[#D4AF37] text-white px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#B5952F] transition shadow-lg inline-flex items-center">
                      Suivant <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <button onClick={prevStep} className="flex items-center text-[#D4AF37] text-sm font-medium mb-8 hover:underline">
              <ArrowRight className="transform rotate-180 mr-2" size={16} /> Retour à la date
            </button>

            <div className="flex flex-col md:flex-row gap-12">
               <div className="md:w-1/3">
                  <div className="bg-stone-50 p-8 border-t-4 border-[#D4AF37]">
                    <h4 className="font-serif text-xl mb-6 text-stone-800">Récapitulatif</h4>
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

               <div className="md:w-2/3">
                 <h3 className="text-3xl font-serif text-center md:text-left text-stone-800 mb-10">Vos coordonnées pour la confirmation</h3>
                 {submitStatus === 'success' ? (
                   <div className="bg-green-50 border border-green-200 p-8 text-center rounded-lg">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="text-green-600" size={32} /></div>
                      <h4 className="text-2xl font-serif text-stone-800 mb-2">Demande bien reçue !</h4>
                      <p className="text-stone-600">Nous allons vérifier la disponibilité de ce créneau et vous confirmer le rendez-vous par téléphone ou par mail très rapidement à {bookingData.email}.</p>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Prénom *</label>
                          <input required type="text" name="firstName" placeholder="Jean" value={bookingData.firstName} onChange={handleInputChange} className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif text-lg" />
                        </div>
                        <div className="group">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Nom *</label>
                          <input required type="text" name="lastName" placeholder="Dupont" value={bookingData.lastName} onChange={handleInputChange} className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif text-lg" />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">E-mail *</label>
                        <input required type="email" name="email" placeholder="jean.dupont@email.com" value={bookingData.email} onChange={handleInputChange} className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif text-lg" />
                      </div>
                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Téléphone *</label>
                        <input required type="tel" name="phone" placeholder="06 12 34 56 78" value={bookingData.phone} onChange={handleInputChange} className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif text-lg" />
                      </div>
                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Notes (facultatives)</label>
                        <textarea name="notes" placeholder="Informations complémentaires..." value={bookingData.notes} onChange={handleInputChange} className="w-full border-b border-stone-300 py-2 text-stone-800 placeholder-stone-200 focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent font-serif resize-none h-24" />
                      </div>
                      <div className="pt-6">
                        <button type="submit" disabled={submitStatus === 'loading'} className={`w-full text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] transition shadow-xl ${submitStatus === 'loading' ? 'bg-stone-300 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#B5952F]'}`}>
                          {submitStatus === 'loading' ? 'Traitement...' : 'Envoyer ma demande de réservation'}
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

export default ReservationSystem;
