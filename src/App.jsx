import React, { useState, useEffect, useRef } from 'react';
import MainWebsite from './components/MainWebsite';
import AdminPanel from './components/AdminPanel';
import { 
  DEFAULT_CONTACT_INFO, 
  DEFAULT_OPENING_HOURS, 
  DEFAULT_SERVICES_DATA, 
  DEFAULT_EVENTS, 
  DEFAULT_SITE_CONTENT,
  THEME, 
  categories 
} from './data/constants';

const App = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // --- PERSISTENT STATES ---
  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem("lb_contactInfo");
    return saved ? JSON.parse(saved) : DEFAULT_CONTACT_INFO;
  });

  const [openingHours, setOpeningHours] = useState(() => {
    const saved = localStorage.getItem("lb_openingHours");
    return saved ? JSON.parse(saved) : DEFAULT_OPENING_HOURS;
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("lb_services");
    return saved ? JSON.parse(saved) : DEFAULT_SERVICES_DATA;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("lb_events");
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem("lb_reservations");
    return saved ? JSON.parse(saved) : [];
  });

  const [blockedSlots, setBlockedSlots] = useState(() => {
    const saved = localStorage.getItem("lb_blockedSlots");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [siteContent, setSiteContent] = useState(() => {
    const saved = localStorage.getItem("lb_siteContent");
    if (!saved) return DEFAULT_SITE_CONTENT;
    
    // Merge logic to ensure new fields (like 'spaces') exist even if older state is in localStorage
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...parsed.hero },
      philosophy: { ...DEFAULT_SITE_CONTENT.philosophy, ...parsed.philosophy },
      spaces: parsed.spaces || DEFAULT_SITE_CONTENT.spaces
    };
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem("lb_contactInfo", JSON.stringify(contactInfo));
  }, [contactInfo]);

  useEffect(() => {
    localStorage.setItem("lb_openingHours", JSON.stringify(openingHours));
  }, [openingHours]);

  useEffect(() => {
    localStorage.setItem("lb_services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("lb_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("lb_reservations", JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem("lb_blockedSlots", JSON.stringify(blockedSlots));
  }, [blockedSlots]);

  useEffect(() => {
    localStorage.setItem("lb_siteContent", JSON.stringify(siteContent));
  }, [siteContent]);

  // --- HANDLERS ---
  const handleAddReservation = (newRes) => {
    setReservations(prev => [...prev, newRes]);
  };

  const logoClicks = useRef(0);
  const handleLogoClick = () => {
    logoClicks.current += 1;
    if (logoClicks.current >= 3) {
      setIsAdminMode(true);
      logoClicks.current = 0;
    }
    setTimeout(() => { logoClicks.current = 0; }, 2000);
  };

  if (isAdminMode) {
    return (
      <AdminPanel 
        contactInfo={contactInfo}
        setContactInfo={setContactInfo}
        services={services}
        setServices={setServices}
        openingHours={openingHours}
        setOpeningHours={setOpeningHours}
        events={events}
        setEvents={setEvents}
        reservations={reservations}
        setReservations={setReservations}
        blockedSlots={blockedSlots}
        setBlockedSlots={setBlockedSlots}
        siteContent={siteContent}
        setSiteContent={setSiteContent}
        onExit={() => setIsAdminMode(false)}
        categories={categories}
      />
    );
  }

  return (
    <MainWebsite 
      contactInfo={contactInfo}
      services={services}
      openingHours={openingHours}
      events={events}
      onAddReservation={handleAddReservation}
      blockedSlots={blockedSlots}
      onAdminAccess={handleLogoClick}
      categories={categories}
      THEME={THEME}
      siteContent={siteContent}
    />
  );
};

export default App;