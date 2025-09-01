import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import iconicData from "../translations/iconic.json";
import Recommendation from "../components/Recommendation";

export default function Home() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const iconicArray = iconicData.iconic_destinations || [];

  // auto slide setiap 5 detik
  useEffect(() => {
    if (iconicArray.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % iconicArray.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [iconicArray]);

  const activeItem = iconicArray[activeIndex] || { image: "", city: "" };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={activeItem.id}
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1 }}
          >
            <img
              src={activeItem.image}
              alt={activeItem.title || "background"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 -translate-y-35 sm:-translate-y-16">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {t("home.hero_title")}
          </motion.h1>
          <motion.p
            className="text-white text-sm sm:text-base md:text-lg max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {t("home.hero_subtitle")}
          </motion.p>
        </div>


        {/* Thumbnail Card */}
        <div className="relative z-10 mx-auto -translate-y-80 sm:-translate-y-20 md:-translate-y-40 lg:-translate-y-50 px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {iconicArray.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <motion.div
                  key={item.id}
                  className={`w-22 sm:w-26 md:w-30 lg:w-34 h-22 sm:h-26 md:h-30 lg:h-34 rounded-lg overflow-hidden cursor-pointer border-4 transition-all duration-300 ${isActive
                    ? "border-white shadow-xl scale-100"
                    : "border-transparent"
                    }`}
                  onClick={() => setActiveIndex(idx)}
                  whileHover={{ scale: 1.05 }}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <img
                    src={item?.image || "/default.jpg"}
                    alt={item?.city || "Kota"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendation Section */}
      <div>
        <Recommendation />
      </div>
    </div>
  );
}
