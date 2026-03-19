import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, Droplets, MapPin, Phone, Mail, ChevronRight, Star } from 'lucide-react';
import { PromoBanner, FadeIn, GiftCardModal } from './UIComponents';
import ReservationSystem from './ReservationSystem';
import RelaxationSpaces from './RelaxationSpaces';
import FAQ from './FAQ';

const MainWebsite = ({ 
  contactInfo, 
  services, 
  openingHours, 
  events, 
  onAddReservation, 
  onAdminAccess,
  categories,
  THEME,
  blockedSlots,
  siteContent
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('visage');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
      {/* --- NAVIGATION --- */}
      <div className={`absolute top-0 left-0 w-full z-50 flex flex-col transition-all duration-500`}>
        <PromoBanner events={events} />
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full transition-all duration-500 ${
            scrolled 
              ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-stone-100 z-[60]' 
              : 'relative bg-transparent py-8'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div 
              className="flex items-center gap-4 cursor-pointer group" 
              onClick={onAdminAccess}
            >
              <div className={`w-10 h-10 ${THEME.primary} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <Droplets size={20} />
              </div>
              <div className="flex flex-col">
                <h1 className={`font-serif text-xl tracking-tighter leading-none transition-colors duration-500 ${scrolled ? 'text-black' : 'text-white drop-shadow-sm'}`}>
                  {siteContent.hero.title}
                </h1>
                <span className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${scrolled ? 'text-stone-900' : 'text-white drop-shadow-sm'}`}>
                  {siteContent.hero.subtitle}
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-10">
              {['philosophie', 'espaces', 'soins', 'faq', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className={`text-[11px] uppercase tracking-[0.28em] font-light transition-colors duration-500 relative group ${
                    scrolled ? 'text-stone-700 hover:text-[#D4AF37]' : 'text-white/90 hover:text-white drop-shadow-sm'
                  }`}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
              <button
                onClick={() => setIsGiftModalOpen(true)}
                className={`font-serif italic text-[13px] px-6 py-2.5 rounded-full transition-all duration-500 shadow-md hover:-translate-y-0.5 hover:shadow-lg ${
                  scrolled ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-white/95 text-stone-800 hover:bg-white'
                }`}
              >
                Offrir un soin
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollTo('reservation')}
                className={`hidden lg:block px-8 py-3 text-[11px] font-light uppercase tracking-[0.28em] border transition-all duration-500 rounded-sm ${
                  scrolled
                    ? 'bg-stone-800 text-white border-stone-800 hover:bg-[#D4AF37] hover:border-[#D4AF37]'
                    : 'bg-transparent text-white border-white/70 hover:bg-white hover:text-stone-800'
                }`}
              >
                Réserver
              </button>
              
              <button 
                onClick={() => setIsMenuOpen(true)}
                className={`md:hidden p-2 transition-colors duration-500 ${scrolled ? 'text-black' : 'text-white'}`}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-stone-900 md:hidden flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={32} />
            </button>
            
            <div className="flex flex-col items-center gap-8 text-white">
              {['philosophie', 'espaces', 'soins', 'faq', 'contact', 'reservation'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollTo(item)}
                  className="font-serif text-3xl hover:text-[#D4AF37] transition-colors tracking-widest capitalize"
                >
                  {item === 'reservation' ? 'Réserver' : item}
                </button>
              ))}
              <button 
                onClick={() => { setIsGiftModalOpen(true); setIsMenuOpen(false); }}
                className="mt-4 bg-[#D4AF37] text-white px-10 py-5 rounded-full shadow-2xl hover:scale-105 transition-all font-bold text-xs uppercase tracking-widest"
              >
                Offrir un soin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src={siteContent.hero.image} 
            className="w-full h-full object-cover brightness-75 scale-110"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20 text-white">
          <FadeIn delay={100}>
            <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-bold">
              {siteContent.hero.badge}
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <h1 className="text-5xl md:text-8xl font-serif mb-8 drop-shadow-md uppercase tracking-wider font-light">
              <span className="text-[#D4AF37]">{siteContent.hero.title.split(' ').slice(0, 2).join(' ')}</span> <span className="text-white">{siteContent.hero.title.split(' ').slice(2).join(' ')}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={500}>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-white mb-12 font-light tracking-wide max-w-2xl mx-auto">
              {siteContent.hero.description}
            </p>
          </FadeIn>
          <FadeIn delay={700}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => scrollTo('reservation')}
                className="bg-[#D4AF37] hover:bg-[#B5952F] text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.15em] transition duration-300 shadow-xl"
              >
                Réserver un soin
              </button>
              <button 
                onClick={() => scrollTo('soins')}
                className="bg-transparent border border-white text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.15em] hover:bg-white hover:text-stone-900 transition duration-300"
              >
                Découvrir nos soins
              </button>
            </div>
          </FadeIn>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
           <Droplets className="text-white" size={24} />
        </div>
      </section>

      {/* --- PHILOSOPHIE --- */}
      <section id="philosophie" className="py-32 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn>
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 border-l border-t border-[#D4AF37]/30"></div>
                <img 
                  src={siteContent.philosophy.image} 
                  className="rounded-sm shadow-2xl relative z-10"
                  alt="Spa Philosophy"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-8 shadow-xl z-20 hidden md:block border-l-4 border-[#D4AF37]">
                  <p className="text-[#D4AF37] font-serif text-xl italic line-clamp-2">"{siteContent.philosophy.quote}"</p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="flex flex-col">
                <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">{siteContent.philosophy.badge}</span>
                <h2 className="text-4xl md:text-5xl font-serif mb-10 text-stone-800 leading-tight">{siteContent.philosophy.title}</h2>
                <div className="space-y-6 text-stone-500 font-light leading-relaxed">
                  <p>{siteContent.philosophy.desc1}</p>
                  <p>{siteContent.philosophy.desc2}</p>
                </div>
                <div className="mt-12 border-t border-stone-200 pt-10">
                  <div>
                    <span className="text-2xl font-serif text-stone-800 block mb-2">100%</span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Produits Naturels</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- ESPACES DETENTE --- */}
      <RelaxationSpaces siteContent={siteContent} />

      {/* --- CARTE DES SOINS DYNAMIQUE --- */}
      <section id="soins" className="py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">La Carte</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-stone-800">Nos Rituels Beauté</h2>
            
            {/* TABS CATEGORIES */}
            <div className="flex flex-wrap justify-center gap-4 mt-12 bg-stone-50 p-2 rounded-full w-fit mx-auto border border-stone-100">
              {categories.filter(cat => cat.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat.id
                      ? 'bg-stone-900 text-white shadow-lg'
                      : 'text-stone-400 hover:text-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredServices.map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 100} direction="up" distance={20}>
                <motion.div 
                  layout
                  className="group bg-stone-50 p-10 border border-stone-100 hover:border-[#D4AF37]/30 transition-all hover:bg-white hover:shadow-2xl h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest opacity-60">
                        {categories.find(c => c.id === service.category)?.label}
                      </span>
                      <span className="font-serif text-xl group-hover:text-[#D4AF37] transition-colors">{service.price}</span>
                    </div>
                    <h4 className="text-2xl font-serif mb-4 text-stone-800">{service.title}</h4>
                    <p className="text-stone-500 font-light text-sm leading-loose mb-8">{service.description}</p>
                  </div>
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-stone-400 pt-6 border-t border-stone-100 group-hover:text-[#D4AF37] transition-colors">
                    <Droplets size={14} className="mr-2" />
                    {service.duration === 0 ? 'Accès illimité' : `${service.duration} minutes`}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </motion.div>
          
          <div className="mt-20 text-center">
             <button onClick={() => scrollTo('reservation')} className="text-[#D4AF37] font-bold text-xs uppercase tracking-[0.3em] border-b-2 border-[#D4AF37] pb-2 hover:opacity-70 transition-opacity inline-flex items-center">
               Réserver l'expérience complète <ChevronRight size={14} className="ml-2" />
             </button>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <FAQ />

      {/* --- RESERVATION --- */}
      <section id="reservation" className="py-32 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
             <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">{siteContent.reservation.badge}</span>
             <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">{siteContent.reservation.title}</h2>
             <p className="max-w-2xl mx-auto text-stone-400 font-light leading-relaxed">
               {siteContent.reservation.description}
             </p>
          </div>

          <div className="text-stone-800">
            <FadeIn delay={200}>
              <ReservationSystem 
                contactInfo={contactInfo} 
                services={services} 
                categories={categories}
                THEME={THEME}
                onReservationAdded={onAddReservation}
                blockedSlots={blockedSlots}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- MAP SECTION --- */}
      <section className="h-96 w-full grayscale hover:grayscale-0 transition-all duration-1000">
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
            <h4 className="font-serif text-2xl text-stone-800 mb-6 font-light">Les <br/><span className="text-[#D4AF37] italic">Bains Romains</span></h4>
            <p className="text-stone-500 font-light text-sm leading-loose mb-6">
              {siteContent.footer.description}
            </p>
            <div className="flex justify-center md:justify-start gap-4">
               {/* Placeholders for social icons if needed */}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-800 mb-8">Contact</h4>
            <ul className="space-y-6 text-sm text-stone-500 font-light">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <MapPin size={16} className="text-[#D4AF37] mt-1 shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone size={16} className="text-[#D4AF37] shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail size={16} className="text-[#D4AF37] shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>

          <div>
             <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-800 mb-8">Horaires</h4>
             <ul className="space-y-4 text-sm text-stone-500 font-light">
               <li className="flex justify-between md:justify-start gap-8">
                 <span className="w-20 font-medium">Lun - Dim</span>
                 <span className="text-stone-800 underline decoration-[#D4AF37]/30 decoration-2 underline-offset-4">{openingHours.weekdays}</span>
               </li>
               <li className="pt-4 text-xs italic opacity-70 leading-relaxed border-t border-stone-100 mt-4">
                 {openingHours.details}
               </li>
             </ul>
          </div>

        </div>
        <div className="mt-20 pt-8 border-t border-stone-100 text-center text-[10px] text-stone-400 uppercase tracking-[0.3em] font-bold">
          © {new Date().getFullYear()} Mercure Saint-Nectaire — Les Bains Romains
        </div>
      </footer>

      <GiftCardModal 
        isOpen={isGiftModalOpen} 
        onClose={() => setIsGiftModalOpen(false)} 
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default MainWebsite;
