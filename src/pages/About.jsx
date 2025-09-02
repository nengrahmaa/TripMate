import { useState } from "react";
import { useTranslation } from "react-i18next";
import aboutData from "../json/about.json";
import { MapPin, Heart, Edit3, Moon, UserCheck } from "lucide-react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import ScrollReveal from "../components/ScrollReveal";

export default function About() {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const { about } = aboutData;
  const [openFAQ, setOpenFAQ] = useState(null);

  const servicesIcons = {
    MapPin: <MapPin size={26} className="text-green-600" />,
    Heart: <Heart size={26} className="text-red-500" />,
    Edit3: <Edit3 size={26} className="text-blue-500" />,
    Moon: <Moon size={26} className="text-gray-700" />,
    UserCheck: <UserCheck size={26} className="text-purple-500" />,
  };

  const { scrollY } = useViewportScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <div className="bg-gray-200 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-20 space-y-6 sm:space-y-10">
        {/* Title */}
        <ScrollReveal>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-cyan-900 dark:text-cyan-600 bg-clip-text transition-colors duration-500">
            {about?.title?.[lang]}
          </h1>
        </ScrollReveal>

        {/* Image with Parallax */}
        {about?.image && (
          <motion.div
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl shadow-xl motion-safe:transform-gpu relative transition-colors duration-500"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: yImage }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.img
              src={about.image}
              alt="About"
              className="w-full h-full object-cover object-center transition-transform duration-500"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-black/0 dark:bg-black/30 pointer-events-none transition-opacity duration-500"></div>
          </motion.div>
        )}

        {/* Description */}
        <ScrollReveal delay={0.2}>
          <p className="text-xs sm:text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300 text-justify transition-colors duration-500">
            {about?.description?.[lang]}
          </p>
        </ScrollReveal>

        {/* Services */}
        <ScrollReveal>
          <h2 className="text-md sm:text-xl md:text-xl font-bold mb-6 sm:mb-8 text-center text-cyan-700 dark:text-cyan-500 transition-colors duration-500">
            {about?.services_title?.[lang]}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {Array.isArray(about?.services) &&
            about.services.map((service, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <motion.div
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 border rounded-2xl shadow-lg 
                             bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 cursor-pointer
                             transition-colors duration-500"
                  whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
                  whileTap={{ scale: 0.95, y: 0, rotate: 0 }}
                >
                  <div>{servicesIcons[service.icon]}</div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 transition-colors duration-500">
                    {service?.[lang]}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
        </div>

        {/* FAQ */}
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-cyan-700 dark:text-cyan-500 transition-colors duration-500">
            {about?.faq_title?.[lang]}
          </h2>
        </ScrollReveal>
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          {Array.isArray(about?.faq) &&
            about.faq.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.2}>
                <motion.div className="border rounded-xl overflow-hidden border-gray-200 dark:border-gray-700 transition-colors duration-500">
                  <button
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 
                               hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center 
                               text-xs sm:text-sm md:text-sm font-medium transition-colors duration-500"
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  >
                    <span>{item?.question?.[lang]}</span>
                    <span className="text-base sm:text-lg">{openFAQ === idx ? "-" : "+"}</span>
                  </button>
                  {openFAQ === idx && (
                    <motion.div
                      className="px-3 sm:px-4 py-2 sm:py-3 dark:bg-gray-900 text-gray-700 dark:text-gray-300
                                 text-xs sm:text-sm md:text-sm transition-colors duration-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {item?.answer?.[lang]}
                    </motion.div>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
        </div>
      </div>
    </div>
  );
}
