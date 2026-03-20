import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  DEFAULT_CONTACT_INFO,
  DEFAULT_OPENING_HOURS,
  DEFAULT_SERVICES_DATA,
  DEFAULT_EVENTS,
  DEFAULT_SITE_CONTENT,
} from '../data/constants';

const configDoc = (name) => doc(db, 'config', name);

const mergeContent = (parsed) => ({
  ...DEFAULT_SITE_CONTENT,
  ...parsed,
  hero: { ...DEFAULT_SITE_CONTENT.hero, ...parsed.hero },
  philosophy: { ...DEFAULT_SITE_CONTENT.philosophy, ...parsed.philosophy },
  spaces: parsed.spaces || DEFAULT_SITE_CONTENT.spaces,
  reservation: { ...DEFAULT_SITE_CONTENT.reservation, ...parsed.reservation },
  footer: { ...DEFAULT_SITE_CONTENT.footer, ...parsed.footer },
});

export const useSiteData = () => {
  const [loading, setLoading] = useState(true);

  const [contactInfo, _setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [openingHours, _setOpeningHours] = useState(DEFAULT_OPENING_HOURS);
  const [services, _setServices] = useState(DEFAULT_SERVICES_DATA);
  const [events, _setEvents] = useState(DEFAULT_EVENTS);
  const [reservations, _setReservations] = useState([]);
  const [blockedSlots, _setBlockedSlots] = useState([]);
  const [siteContent, _setSiteContent] = useState(DEFAULT_SITE_CONTENT);

  // Refs so functional setters always see the latest state
  const refs = {
    contactInfo: useRef(contactInfo),
    openingHours: useRef(openingHours),
    services: useRef(services),
    events: useRef(events),
    reservations: useRef(reservations),
    blockedSlots: useRef(blockedSlots),
    siteContent: useRef(siteContent),
  };
  useEffect(() => { refs.contactInfo.current = contactInfo; });
  useEffect(() => { refs.openingHours.current = openingHours; });
  useEffect(() => { refs.services.current = services; });
  useEffect(() => { refs.events.current = events; });
  useEffect(() => { refs.reservations.current = reservations; });
  useEffect(() => { refs.blockedSlots.current = blockedSlots; });
  useEffect(() => { refs.siteContent.current = siteContent; });

  useEffect(() => {
    let loaded = 0;
    const total = 7;
    const onLoad = () => { if (++loaded >= total) setLoading(false); };

    const unsubs = [
      onSnapshot(configDoc('contactInfo'), (snap) => {
        if (snap.exists()) _setContactInfo(snap.data());
        onLoad();
      }),
      onSnapshot(configDoc('openingHours'), (snap) => {
        if (snap.exists()) _setOpeningHours(snap.data());
        onLoad();
      }),
      onSnapshot(configDoc('services'), (snap) => {
        if (snap.exists()) _setServices(snap.data().items);
        onLoad();
      }),
      onSnapshot(configDoc('events'), (snap) => {
        if (snap.exists()) _setEvents(snap.data().items);
        onLoad();
      }),
      onSnapshot(configDoc('reservations'), (snap) => {
        if (snap.exists()) _setReservations(snap.data().items);
        onLoad();
      }),
      onSnapshot(configDoc('blockedSlots'), (snap) => {
        if (snap.exists()) _setBlockedSlots(snap.data().items);
        onLoad();
      }),
      onSnapshot(configDoc('siteContent'), (snap) => {
        if (snap.exists()) _setSiteContent(mergeContent(snap.data()));
        onLoad();
      }),
    ];

    return () => unsubs.forEach((u) => u());
  }, []);

  // Firestore-backed setters (support both value and functional updates)
  const makeSimpleSetter = (refKey, docName) => (valueOrFn) => {
    const next = typeof valueOrFn === 'function' ? valueOrFn(refs[refKey].current) : valueOrFn;
    setDoc(configDoc(docName), next).catch(console.error);
  };

  const makeArraySetter = (refKey, docName) => (valueOrFn) => {
    const next = typeof valueOrFn === 'function' ? valueOrFn(refs[refKey].current) : valueOrFn;
    setDoc(configDoc(docName), { items: next }).catch(console.error);
  };

  return {
    loading,
    contactInfo,    setContactInfo:  makeSimpleSetter('contactInfo', 'contactInfo'),
    openingHours,   setOpeningHours: makeSimpleSetter('openingHours', 'openingHours'),
    services,       setServices:     makeArraySetter('services', 'services'),
    events,         setEvents:       makeArraySetter('events', 'events'),
    reservations,   setReservations: makeArraySetter('reservations', 'reservations'),
    blockedSlots,   setBlockedSlots: makeArraySetter('blockedSlots', 'blockedSlots'),
    siteContent,    setSiteContent:  makeSimpleSetter('siteContent', 'siteContent'),
  };
};
