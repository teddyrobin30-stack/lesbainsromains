import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Droplets } from 'lucide-react';
import { FadeIn } from './UIComponents';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={onClick}
        className="w-full py-8 flex justify-between items-center text-left group hover:text-[#D4AF37] transition-colors focus:outline-none"
      >
        <span className="text-lg font-serif text-stone-800 group-hover:text-[#D4AF37] transition-colors pr-8">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronRight size={20} className="text-[#D4AF37]" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-stone-500 font-light leading-relaxed flex gap-4">
              <Droplets size={16} className="text-[#D4AF37]/40 shrink-0 mt-1" />
              <p>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Quels équipements dois-je apporter ?",
      answer: "Le port du maillot de bain est obligatoire (shorts de bain autorisés). Nous vous fournissons peignoirs, serviettes et chaussons pour votre confort dès votre arrivée."
    },
    {
      question: "Quelle est la durée de l'accès Spa ?",
      answer: "L'accès à nos installations (piscine, hammam, sauna) est inclus pour une durée de 2 heures le jour de vos soins personnalisés."
    },
    {
      question: "Faut-il apporter son propre linge ?",
      answer: "Non, nous mettons gracieusement à votre disposition un peignoir, une serviette et des chaussons dès votre arrivée pour votre confort absolu."
    },
    {
      question: "Le spa est-il accessible aux enfants ?",
      answer: "Le spa est un lieu de calme réservé aux adultes et aux adolescents de plus de 16 ans accompagnés d'un adulte."
    }
  ];

  return (
    <section id="faq" className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-20">
          <FadeIn direction="up">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Aide</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-stone-800">Questions Fréquentes</h2>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto opacity-30"></div>
          </FadeIn>
        </div>

        <div className="mt-12">
          {faqs.map((faq, idx) => (
            <FadeIn key={idx} delay={idx * 100} direction="up" distance={20}>
              <FAQItem 
                {...faq} 
                isOpen={openIndex === idx} 
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
