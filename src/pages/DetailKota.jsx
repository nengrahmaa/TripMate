import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import data from "../json/data/data.json";
import StarRating from "../components/StarRating";

export default function DetailKota() {
  const { t, i18n } = useTranslation();
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const foundCity = data.find((c) => c.id === cityId);
    setCity(foundCity || null);
  }, [cityId]);

  if (!city) return <p className="text-center mt-20 text-gray-700 dark:text-gray-300">{t("city_not_found")}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-26 space-y-12">

        {/* Back Button */}
        <div className="flex items-center justify-start mb-8 gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-cyan-700 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-700 dark:text-white" />
          </motion.button>

          <h1 className="text-2xl md:text-3xl font-bold text-cyan-700 dark:text-white truncate">
            {t("header.explore")}
          </h1>
        </div>

        {/* Hero Slider */}
        <div className="relative w-full h-64 sm:h-80 md:h-[70vh] lg:h-[80vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg mb-10">
          {city.places.map((place, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex === idx ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={place.image}
                alt={place.name[i18n.language]}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute top-1/3 w-full px-4 sm:px-6 text-center">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                  {place.name[i18n.language]}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-2 flex justify-center items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" /> {city.city}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Dots Navigation */}
          <div className="absolute bottom-4 w-full flex justify-center gap-2 sm:gap-3">
            {city.places.map((_, idx) => (
              <button
                key={idx}
                className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 ${idx === activeIndex ? "bg-white" : "bg-gray-400 dark:bg-gray-600"
                  }`}
                onClick={() => setActiveIndex(idx)}
              ></button>
            ))}
          </div>
        </div>

        {/* Description Kota */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-4xl mx-auto px-2"
        >
          {city.description[i18n.language]}
        </motion.p>

        {/* Daftar Destinasi */}
        <h2 className="mt-16 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
          {t("explore.destinations_in", { city: city.city })}
        </h2>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
          {city.places.length > 0 ? (
            city.places.map((place, index) => (
              <div
                key={index}
                className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                onClick={() =>
                  navigate(`/detail/${city.city}-${place.name.en}?city=${city.city}`)
                }
              >
                {/* Gambar */}
                <img
                  src={place.image}
                  alt={place.name[i18n.language]}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay bawah untuk info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 sm:p-4 flex flex-col justify-end">
                  <div className="transition-opacity duration-300 group-hover:opacity-0">
                    <h3 className="text-white font-bold text-sm sm:text-base md:text-lg">
                      {place.name[i18n.language]}
                    </h3>
                    <p className="text-gray-300 font-medium text-xs sm:text-sm">
                      {place.category[i18n.language]}
                    </p>
                    <div className="flex items-center mt-1">
                      <StarRating rating={place.rating} />
                      <span className="ml-2 text-white text-xs sm:text-sm">{place.rating}</span>
                    </div>
                  </div>

                  <button
                    className="cursor-pointer absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm sm:text-base md:text-lg font-semibold"
                  >
                    <span>{t("explore.show_more")}</span>
                    <span className="mt-2 block h-[2px] bg-white w-0 group-hover:w-24 transition-all duration-500 ease-out"></span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-1 sm:col-span-2 md:col-span-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {t("explore.no_data")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
