import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import data from "../json/data/data.json";
import StarRating from "../components/StarRating";

export default function Detail() {
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const allPlaces = data.flatMap(city =>
    city.places.map(place => ({ ...place, city: city.city }))
  );

  const place = allPlaces.find(
    item => `${item.city}-${item.name.en}` === id
  );

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
    setIsFavorite(favorites.includes(id));

    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(storedReviews);
  }, [id, userId]);

  const toggleFavorite = () => {
    if (!userId || !place) return;

    const key = `favorites_${userId}`;
    const favorites = JSON.parse(localStorage.getItem(key)) || [];
    const placeKey = `${place.city}-${place.name.en}`;

    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav !== placeKey)
      : [...favorites, placeKey];

    localStorage.setItem(key, JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleClick = () => {
    const wasFavorite = isFavorite;
    toggleFavorite();
    setShowNotif(wasFavorite ? "removed" : "added");
    setTimeout(() => setShowNotif(false), 2000);
  };

  if (!place) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">{t("explore.no_data")}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-20">

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

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[40vh] sm:h-[60vh] md:h-[67vh] lg:h-[76vh] rounded-3xl overflow-hidden shadow-lg"
        >
          <img
            src={place.image}
            alt={place.name[i18n.language]}
            className="w-full h-full object-cover transform transition duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute top-1/3 w-full text-center px-4 sm:px-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
              {place.name[i18n.language]}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 mt-2 flex justify-center items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" /> {place.city}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col items-center mt-8 relative">
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-10 bg-black/70 text-gray-200 dark:bg-gray-200 dark:text-gray-900 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg"
              >
                {showNotif === "added"
                  ? t("detail.added_to_favorites")
                  : t("detail.removed_from_favorites")}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleClick}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg transition-all
              ${isFavorite
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90"
                : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
          >
            <Heart className={`w-4 sm:w-5 h-4 sm:h-5 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? t("saved") : t("save")}
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 sm:mt-10 text-sm sm:text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-2xl sm:max-w-3xl mx-auto px-3"
        >
          {place.description[i18n.language]}
        </motion.p>

        <h2 className="mt-12 sm:mt-16 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
          {t("detail.nearby_recommendations")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mt-8 sm:mt-10">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 text-center">
              {t("detail.hotel")}
            </h3>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {place.hotels?.length > 0 ? place.hotels.map((hotel, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg group"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-50 sm:h-60 object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                    <h4 className="font-semibold text-sm sm:text-lg">{hotel.name}</h4>
                    <div className="flex items-center mt-1">
                      <StarRating rating={hotel.rating} />
                    </div>
                    <p className="mt-1 text-xs sm:text-sm font-medium">{hotel.price[i18n.language]}</p>
                  </div>
                </motion.div>
              )) : (
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base">{t("detail.no_hotels")}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 text-center">
              {t("detail.restaurant")}
            </h3>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {place.restaurants?.length > 0 ? place.restaurants.map((resto, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg group"
                >
                  <img
                    src={resto.image}
                    alt={resto.name}
                    className="w-full h-45 sm:h-60 object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                    <h4 className="font-semibold text-sm sm:text-lg">{resto.name}</h4>
                    <div className="flex items-center mt-1">
                      <StarRating rating={resto.rating} />
                    </div>
                    <p className="mt-1 text-xs sm:text-sm font-medium">{resto.price[i18n.language]}</p>
                  </div>
                </motion.div>
              )) : (
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base">{t("detail.no_restaurants")}</p>
              )}
            </div>
          </div>

          <div className="mt-8 lg:mt-16 lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-200 text-center">
              {t("reviews.visitor_reviews")}
            </h2>
            <div className="flex justify-center mb-4 sm:mb-6">
              <button
                onClick={() => navigate(`/reviews/${id}`)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-md transition text-sm sm:text-sm cursor-pointer"
              >
                {t("reviews.add_review")}
              </button>
            </div>

            {Array.isArray(reviews) && reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white">
                          {review.user?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate">
                            {review.user || "Anonim"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{review.date || "-"}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating || 0} />
                    </div>

                    <h4 className="font-semibold text-base text-gray-800 dark:text-gray-100 mb-2 truncate">
                      {review.title || "Tanpa Judul"}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {review.text || "Tidak ada deskripsi ulasan."}
                    </p>

                    {review.photo && (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={review.photo}
                        alt="Review"
                        className="mt-3 w-full h-40 object-cover rounded-xl shadow"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base text-center">
                {t("reviews.no_data")}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
