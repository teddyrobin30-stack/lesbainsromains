import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './UIComponents';

const RelaxationSpaces = ({ siteContent }) => {
  const spaces = siteContent.spaces;

  return (
    <section id="espaces" className="py-32 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <FadeIn direction="up">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Découverte</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-stone-800">Nos Espaces Détente</h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-30"></div>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spaces.map((space, idx) => (
            <FadeIn key={idx} delay={idx * 150} direction="up" distance={30}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="relative group overflow-hidden rounded-sm shadow-xl aspect-[3/4] cursor-pointer"
              >
                <motion.img 
                  src={(space.image.startsWith('http') || space.image.startsWith('data:')) ? space.image : `/${space.image}`} 
                  alt={space.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-[#D4AF37] font-serif text-2xl mb-2">{space.title}</h3>
                  <p className="text-white/80 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 italic">
                    {space.desc}
                  </p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelaxationSpaces;
