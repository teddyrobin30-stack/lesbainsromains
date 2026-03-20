import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useSiteData } from './hooks/useSiteData';
import MainWebsite from './components/MainWebsite';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { THEME, categories } from './data/constants';

const App = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  const {
    loading,
    contactInfo, setContactInfo,
    openingHours, setOpeningHours,
    services, setServices,
    events, setEvents,
    reservations, setReservations,
    blockedSlots, setBlockedSlots,
    siteContent, setSiteContent,
  } = useSiteData();

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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e',
        color: '#c9a96e',
        fontFamily: 'serif',
        fontSize: '1.2rem'
      }}>
        Chargement...
      </div>
    );
  }

  if (isAdminMode) {
    if (!authChecked) return null;

    if (!adminUser) {
      return <AdminLogin onCancel={() => setIsAdminMode(false)} />;
    }

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
        onExit={() => { signOut(auth); setIsAdminMode(false); }}
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
