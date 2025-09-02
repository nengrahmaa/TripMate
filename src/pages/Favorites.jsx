import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, ArrowLeft } from "lucide-react";
import placesData from "../json/data/data.json";
import StarRating from "../components/StarRating";
import { motion } from "framer-motion";

export default function Favorites() {
  const [places, setPlaces] = useState([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    if (!userId) return;

    const favoriteNames =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];

    const matchedPlaces = favoriteNames
      .map((fav) => {
        const [cityName, ...placeParts] = fav.split("-");
        const placeName = placeParts.join("-").trim();

        const cityData = placesData.find(
          (city) => city.city.trim() === cityName.trim()
        );
        if (!cityData) return null;

        const foundPlace = cityData.places.find(
          (place) =>
            place.name.en === placeName || place.name.id === placeName
        );

        return foundPlace ? { city: cityName.trim(), ...foundPlace } : null;
      })
      .filter(Boolean);

    setPlaces(matchedPlaces);
  }, [userId]);

  const handleExplore = (place) => {
    navigate(
      `/detail/${encodeURIComponent(
        `${place.city}-${place.name?.en || place.name?.id}`
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">

        <div className="flex items-center justify-start mb-8 gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-cyan-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-700 dark:text-gray-100" />
          </motion.button>

          <h1 className="text-2xl md:text-3xl font-bold text-cyan-700 dark:text-gray-100 truncate">
            {t("favorites.title")}
          </h1>
        </div>

        {places.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base">
            {t("favorites.empty", "You have no favorite places yet.")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {places.map((place, i) => (
              <article
                key={i}
                className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl overflow-hidden group transition-colors"
              >
                {/* Favorite Heart */}
                <div className="absolute top-3 right-3 bg-pink-100 dark:bg-gray-700 p-2 rounded-full shadow-md z-10">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </div>

                <img
                  src={place.image}
                  alt={place.name?.[i18n.language] || place.name?.en || place.name?.id}
                  className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                  <h2 className="text-gray-100 font-bold text-sm sm:text-base md:text-lg truncate">
                    {place.name?.[i18n.language] || place.name?.en || place.name?.id}
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm truncate">
                    {place.category?.[i18n.language] || place.category?.en || place.category?.id}
                  </p>

                  <div className="flex items-center mt-1 sm:mt-2">
                    <StarRating rating={place.rating} />
                    <span className="ml-2 text-gray-100 text-xs sm:text-sm">{place.rating}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleExplore(place)}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-100 font-semibold cursor-pointer px-4 text-center"
                >
                  <span className="text-sm sm:text-base md:text-lg">
                    {t("favorites.discover", "Discover")}
                  </span>
                  <span className="mt-2 block h-[2px] bg-gray-100 w-0 group-hover:w-16 transition-all duration-500 ease-out"></span>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
