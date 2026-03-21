import { useState, useEffect, useRef } from 'react';
import { doc, collection, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import {
  DEFAULT_CONTACT_INFO,
  DEFAULT_OPENING_HOURS,
  DEFAULT_SERVICES_DATA,
  DEFAULT_EVENTS,
  DEFAULT_SITE_CONTENT,
} from '../data/constants';

const configDoc = (name) => doc(db, 'config', name);
const reservationDoc = (id) => doc(db, 'reservations', String(id));

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

  const refs = {
    contactInfo: useRef(DEFAULT_CONTACT_INFO),
    openingHours: useRef(DEFAULT_OPENING_HOURS),
    services: useRef(DEFAULT_SERVICES_DATA),
    events: useRef(DEFAULT_EVENTS),
    reservations: useRef([]),
    blockedSlots: useRef([]),
    siteContent: useRef(DEFAULT_SITE_CONTENT),
  };
  useEffect(() => { refs.contactInfo.current = contactInfo; });
  useEffect(() => { refs.openingHours.current = openingHours; });
  useEffect(() => { refs.services.current = services; });
  useEffect(() => { refs.events.current = events; });
  useEffect(() => { refs.reservations.current = reservations; });
  useEffect(() => { refs.blockedSlots.current = blockedSlots; });
  useEffect(() => { refs.siteContent.current = siteContent; });

  // Config publique (6 docs)
  useEffect(() => {
    let loaded = 0;
    const total = 6;
    const onLoad = () => { if (++loaded >= total) setLoading(false); };
    const onErr = (err) => { console.error('Firestore config:', err); onLoad(); };
    const timeout = setTimeout(() => setLoading(false), 8000);

    const unsubs = [
      onSnapshot(configDoc('contactInfo'),  (s) => { if (s.exists()) _setContactInfo(s.data()); onLoad(); }, onErr),
      onSnapshot(configDoc('openingHours'), (s) => { if (s.exists()) _setOpeningHours(s.data()); onLoad(); }, onErr),
      onSnapshot(configDoc('services'),     (s) => { if (s.exists()) _setServices(s.data().items); onLoad(); }, onErr),
      onSnapshot(configDoc('events'),       (s) => { if (s.exists()) _setEvents(s.data().items); onLoad(); }, onErr),
      onSnapshot(configDoc('blockedSlots'), (s) => { if (s.exists()) _setBlockedSlots(s.data().items); onLoad(); }, onErr),
      onSnapshot(configDoc('siteContent'),  (s) => { if (s.exists()) _setSiteContent(mergeContent(s.data())); onLoad(); }, onErr),
    ];

    return () => { clearTimeout(timeout); unsubs.forEach((u) => u()); };
  }, []);

  // Réservations : uniquement quand l'utilisateur est authentifié (admin)
  // Le listener se recrée automatiquement à chaque changement d'état d'auth
  useEffect(() => {
    let unsubReservations = () => {};

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      unsubReservations(); // Annule le listener précédent
      if (user) {
        unsubReservations = onSnapshot(
          collection(db, 'reservations'),
          (snap) => {
            const items = snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
            _setReservations(items);
          },
          (err) => console.error('Firestore reservations:', err)
        );
      } else {
        _setReservations([]);
      }
    });

    return () => { unsubAuth(); unsubReservations(); };
  }, []);

  // Setters config
  const makeSimpleSetter = (refKey, docName, setState) => (valueOrFn) => {
    const next = typeof valueOrFn === 'function' ? valueOrFn(refs[refKey].current) : valueOrFn;
    setState(next);
    setDoc(configDoc(docName), next).catch(console.error);
  };

  const makeArraySetter = (refKey, docName, setState) => (valueOrFn) => {
    const next = typeof valueOrFn === 'function' ? valueOrFn(refs[refKey].current) : valueOrFn;
    setState(next);
    setDoc(configDoc(docName), { items: next }).catch(console.error);
  };

  // Setter réservations admin : détecte ajouts, modifications, suppressions
  const setReservations = (valueOrFn) => {
    const oldArray = refs.reservations.current;
    const newArray = typeof valueOrFn === 'function' ? valueOrFn(oldArray) : valueOrFn;
    _setReservations(newArray);

    const newIds = new Set(newArray.map(r => String(r.id)));
    for (const r of oldArray) {
      if (!newIds.has(String(r.id))) {
        deleteDoc(reservationDoc(r.id)).catch(console.error);
      }
    }
    for (const r of newArray) {
      const old = oldArray.find(x => String(x.id) === String(r.id));
      if (!old || JSON.stringify(old) !== JSON.stringify(r)) {
        const { _docId, ...data } = r;
        setDoc(reservationDoc(r.id), data).catch(console.error);
      }
    }
  };

  // Ajout visiteur (sans auth)
  const addReservation = (newRes) => {
    _setReservations(prev => [...prev, newRes]);
    const { _docId, ...data } = newRes;
    setDoc(reservationDoc(newRes.id), data).catch(console.error);
  };

  return {
    loading,
    contactInfo,    setContactInfo:  makeSimpleSetter('contactInfo',  'contactInfo',  _setContactInfo),
    openingHours,   setOpeningHours: makeSimpleSetter('openingHours', 'openingHours', _setOpeningHours),
    services,       setServices:     makeArraySetter ('services',     'services',     _setServices),
    events,         setEvents:       makeArraySetter ('events',       'events',       _setEvents),
    reservations,   setReservations,
    addReservation,
    blockedSlots,   setBlockedSlots: makeArraySetter ('blockedSlots', 'blockedSlots', _setBlockedSlots),
    siteContent,    setSiteContent:  makeSimpleSetter('siteContent',  'siteContent',  _setSiteContent),
  };
};
