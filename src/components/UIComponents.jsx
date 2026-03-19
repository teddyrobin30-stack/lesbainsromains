import React, { useState, useEffect, useRef } from 'react';
import { Star, Gift, Phone, Mail, X } from 'lucide-react';

export const PromoBanner = ({ events }) => {
  const activeEvents = events.filter(e => e.isActive);
  if (activeEvents.length === 0) return null;

  return (
    <div className="bg-[#D4AF37] text-white overflow-hidden relative group py-3">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {[...activeEvents, ...activeEvents, ...activeEvents].map((event, i) => (
          <div key={i} className="flex items-center mx-10">
            <Star size={14} className="mr-3 fill-white" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              {event.tag}: {event.title} <span className="ml-2 bg-white text-[#D4AF37] px-2 py-0.5 rounded-sm">{event.discount}</span> — {event.description}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, className = "", direction = "up", distance = 40 }) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: delay / 1000,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const GiftCardModal = ({ isOpen, onClose, contactInfo }) => {
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
            Pour offrir un bon cadeau personnalisé, nous vous invitons à nous contacter directement. Nous préparerons pour vous une attention sur-mesure.
          </p>
          
          <div className="space-y-4 mb-8">
            <a href={`tel:${contactInfo.phone.replace(/ /g, '')}`} className="flex items-center justify-center gap-3 text-stone-700 hover:text-[#D4AF37] transition group border border-stone-200 rounded-lg p-3 hover:border-[#D4AF37]">
              <Phone size={20} className="text-[#D4AF37]" />
              <span className="font-serif tracking-wide">{contactInfo.phone}</span>
            </a>
            <a href={`mailto:${contactInfo.email}`} className="flex items-center justify-center gap-3 text-stone-700 hover:text-[#D4AF37] transition group border border-stone-200 rounded-lg p-3 hover:border-[#D4AF37]">
              <Mail size={20} className="text-[#D4AF37]" />
              <span className="font-serif tracking-wide text-sm">{contactInfo.email}</span>
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
