import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import data from "../json/data/data.json";
import StarRating from "./StarRating";
import { motion } from "framer-motion";

export default function Recommendation() {
  const { t, i18n } = useTranslation();
  const [topDestinations, setTopDestinations] = useState([]);

  useEffect(() => {
    const allPlaces = data.flatMap(city => city.places);
    const sortedPlaces = allPlaces.sort((a, b) => b.rating - a.rating);
    setTopDestinations(sortedPlaces.slice(0, 5));
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: i => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: i * 0.15,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className=" w-full px-6 md:px-20 lg:px-32 py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-cyan-900 dark:text-gray-100 tracking-tight">
          {t("home.top_rated")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
          {i18n.language === "id"
            ? "Temukan destinasi menakjubkan pilihan terbaik"
            : "Discover the most amazing top-rated destinations"}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {topDestinations.map((place, idx) => (
          <motion.div
            key={idx}
            custom={idx}              
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            className="relative rounded-2xl overflow-hidden shadow-md bg-white dark:bg-gray-800 cursor-pointer"
          >
            <div className="relative h-[30vh] sm:h-[40vh] lg:h-[50vh]">
              <img
                src={place.image}
                alt={place.name[i18n.language]}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 z-10">
              <h3 className="text-base lg:text-lg font-semibold text-white">
                {place.name[i18n.language]}
              </h3>
              <p className="text-sm text-gray-300">
                {place.city} {place.category[i18n.language]}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={place.rating} />
                <span className="text-yellow-400 font-sm">
                  {place.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
