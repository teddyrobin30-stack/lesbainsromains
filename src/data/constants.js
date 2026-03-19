export const DEFAULT_CONTACT_INFO = {
  address: "Mercure Saint-Nectaire 'Les Bains Romains', 26 Avenue Du Dr Roux, 63710 Saint-Nectaire",
  phone: "04 73 88 57 00",
  email: "contactlesbainsromains@gmail.com"
};

export const DEFAULT_OPENING_HOURS = {
  weekdays: "09:00 - 18:00",
  details: "Ouvert 7j/7 pour votre confort"
};

export const DEFAULT_EVENTS = [
  { id: 1, title: "Vente Flash - Détente du dos", discount: "-20%", description: "Profitez d'un massage de 30mn à prix réduit ce weekend.", isActive: true, tag: "Offre Limitée" }
];

export const DEFAULT_SITE_CONTENT = {
  hero: {
    title: "Les Bains Romains",
    subtitle: "Saint-Nectaire",
    description: "L'art du bien-être inspiré des thermes antiques",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    badge: "Mercure Saint-Nectaire"
  },
  philosophy: {
    badge: "Notre Vision",
    title: "L'Héritage des Thermes Romains",
    desc1: "Au cœur de l'Hôtel Mercure Saint-Nectaire, notre spa est un sanctuaire dédié à la sérénité. Nous allions les techniques ancestrales aux soins contemporains les plus raffinés.",
    desc2: "Chaque geste est pensé pour libérer votre esprit et régénérer votre corps, dans un cadre confidentiel et apaisant où le temps semble suspendu.",
    quote: "L'art de l'équilibre parfait.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  spaces: [
    {
      id: "space-1",
      title: "Piscine Chauffée",
      image: "spa1.jpg.jpg",
      desc: "Une eau à 31°C sous des voûtes séculaires."
    },
    {
      id: "space-2",
      title: "Hammam & Sauna",
      image: "spa2.jpg.png",
      desc: "Chaleur purifiante et vapeurs apaisantes."
    },
    {
      id: "space-3",
      title: "Espace Repos",
      image: "spa3.jpg.jpg",
      desc: "Sérénité absolue après vos soins."
    }
  ],
  reservation: {
    badge: "Rendez-vous",
    title: "Réservez votre Instant",
    description: "Sélectionnez votre soin, choisissez votre créneau et laissez-vous guider."
  },
  footer: {
    description: "L'alliance parfaite de l'authenticité et du luxe au cœur du Mercure Saint-Nectaire."
  }
};

export const THEME = {
  primary: "bg-[#D4AF37]",
  primaryHover: "hover:bg-[#B5952F]",
  textGold: "text-[#D4AF37]",
  borderGold: "border-[#D4AF37]",
  textDark: "text-stone-800",
  textLight: "text-stone-500",
  bgLight: "bg-stone-50"
};

export const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'visage', label: 'Soins Visage' },
  { id: 'massages', label: 'Massages' },
  { id: 'esthetique', label: 'Soins Esthétiques' },
  { id: 'forfaits', label: 'Forfaits' },
  { id: 'spa', label: 'Spa' },
];

export const DEFAULT_SERVICES_DATA = [
  { id: 1, category: 'visage', title: 'Soin bonne mine', duration: 45, price: '70€', description: 'Votre peau retrouve un éclat instantané grâce à ce soin.' },
  { id: 2, category: 'visage', title: 'Soin hydratant', duration: 60, price: '80€', description: 'Un soin qui nourrit votre peau en profondeur et lui redonne sa souplesse.' },
  { id: 3, category: 'visage', title: 'Soin liftant', duration: 75, price: '90€', description: 'Soin complet du visage pour retrouver une peau régénérée, tonifiée et liftée.' },
  { id: 4, category: 'visage', title: 'Relax crânien', duration: 30, price: '50€', description: 'Massages et légers points de pression sur le visage et le cuir chevelu pour une détente absolue.' },
  { id: 5, category: 'massages', title: 'Détente du dos', duration: 30, price: '55€', description: '30 mn pour diminuer vos tensions des lombaires jusqu\'aux trapèzes.' },
  { id: 6, category: 'massages', title: 'Massage relax', duration: 45, price: '75€', description: 'Détendez-vous des pieds à la tête avec ce massage de tout l\'arrière du corps.' },
  { id: 7, category: 'massages', title: 'Pierres chaudes (60mn)', duration: 60, price: '110€', description: 'Relaxez-vous grâce à la chaleur des pierres associée aux massages.' },
  { id: 14, category: 'massages', title: 'Pierres chaudes (30mn)', duration: 30, price: '65€', description: 'Relaxez-vous grâce à la chaleur des pierres associée aux massages.' },
  { id: 15, category: 'massages', title: 'Massage corps', duration: 60, price: '95€', description: 'Votre praticienne vous guidera vers le massage adapté à vos besoins.' },
  { id: 16, category: 'massages', title: 'Spécial femme enceinte', duration: 60, price: '95€', description: 'À partir du 4e mois de grossesse, il soulage le dos, les jambes et détend.' },
  { id: 17, category: 'massages', title: 'Massage junior', duration: 30, price: '55€', description: 'Dès 8 ans. Massage du dos, des bras, des mains et du crâne. Présence parent requise.' },
  { id: 18, category: 'massages', title: 'Jambes légères', duration: 20, price: '35€', description: '20 mn de massage manuel tonique pour diminuer les courbatures.' },
  { id: 19, category: 'massages', title: 'Pressothérapie', duration: 20, price: '20€', description: 'Favorise la circulation sanguine.' },
  { id: 20, category: 'massages', title: 'Mains ou pieds', duration: 20, price: '35€', description: 'Légers points de pression et massages relaxants.' },
  { id: 8, category: 'forfaits', title: 'Escapade sensorielle', duration: 90, price: '140€', description: 'Gommage et enveloppement du corps entier puis massage arrière du corps.' },
  { id: 9, category: 'forfaits', title: 'Soin signature', duration: 105, price: '150€', description: 'Massage corps puis soin du visage.' },
  { id: 10, category: 'forfaits', title: 'Un temps pour soi', duration: 120, price: '165€', description: 'Lit hydromassant, gommage, enveloppement et massage.' },
  { id: 11, category: 'forfaits', title: 'Voyage à deux', duration: 150, price: '360€', description: 'Hammam-jacuzzi privatif, massage duo 60mn et soin visage duo 60mn.' },
  { id: 12, category: 'esthetique', title: 'Gommage & hydratation', duration: 30, price: '50€', description: 'Il élimine les cellules mortes de la peau et la rend plus douce.' },
  { id: 21, category: 'esthetique', title: 'Enveloppement à l\'argile', duration: 40, price: '50€', description: 'L\'argile verte purifie la peau et soulage les articulations.' },
  { id: 22, category: 'esthetique', title: 'Beauté des mains ou pieds', duration: 60, price: '60€', description: 'Gommage, masque et massage détente.' },
  { id: 23, category: 'esthetique', title: 'Épilation Visage ou Aisselles', duration: 15, price: '11€', description: 'Zone du visage ou Aisselles.' },
  { id: 24, category: 'esthetique', title: 'Épilation Demi-jambes', duration: 20, price: '18€', description: 'Épilation des demi-jambes.' },
  { id: 13, category: 'spa', title: 'Lit hydro-massant privatif', duration: 20, price: '25€', description: 'Matelas à eau qui vous massera tout l\'arrière du corps.' },
  { id: 25, category: 'spa', title: 'Hammam-jacuzzi privatif', duration: 30, price: '35€', description: 'Pour 2 personnes (+10€ par personne supplémentaire).' },
  { id: 26, category: 'spa', title: 'Accès Piscine & Sauna', duration: 0, price: '20€', description: 'Pour les clients extérieurs. (Gratuit si soin > 60mn).' },
];
