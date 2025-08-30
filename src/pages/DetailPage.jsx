import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import data from "../data/data.json";
import StarRating from "../components/StarRating";
import { AnimatePresence } from "framer-motion";

export default function Detail() {
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const allPlaces = data.flatMap(city =>
    city.places.map(place => ({
      ...place,
      city: city.city,
    }))
  );

  const place = allPlaces.find(
    (item) => `${item.city}-${item.name.en}` === id
  );

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`))  || [];
    setIsFavorite(favorites.includes(id));

    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(storedReviews);

    // DEBUGING UNTUK FAVORITES
    // console.log("Current user ID:", userId);
    // console.log("Current favorites:", JSON.parse(localStorage.getItem(`favorites_${userId}`)) || []);
  }, [id, userId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }

    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleClick = () => {
    const wasFavorite = isFavorite; // simpan status sebelum diubah
    toggleFavorite();

    // Tampilkan notif sesuai aksi
    setShowNotif(wasFavorite ? "removed" : "added");
    setTimeout(() => setShowNotif(false), 2000);
  };

  if (!place) return <p className="text-center mt-10">{t("explore.no_data")}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        {t("detail.back")}
      </button>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[75vh] rounded-3xl overflow-hidden shadow-lg"
      >
        <img
          src={place.image}
          alt={place.name[i18n.language]}
          className="w-full h-full object-cover transform transition duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute top-1/3 w-full text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            {place.name[i18n.language]}
          </h1>
          <p className="text-lg text-gray-200 mt-2 flex justify-center items-center gap-2">
            <MapPin className="w-5 h-5" /> {place.city}
          </p>
        </div>
      </motion.div>

      {/* Favorite Button */}
      <div className="flex flex-col items-center mt-8 relative">
        {/* Notifikasi */}
        <AnimatePresence>
          {showNotif && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute -top-10 bg-black/80 text-white text-sm px-4 py-2 rounded-full shadow-lg"
            >
              {showNotif === "added"
                ? t("detail.added_to_favorites")
                : t("detail.removed_from_favorites")}
            </motion.div>
          )}
        </AnimatePresence>


        {/* Tombol */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleClick}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold shadow-lg transition-all ${isFavorite
            ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90" :
            "bg-white border text-gray-700 hover:bg-gray-50"
            }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          {isFavorite ? t("saved") : t("save")}
        </motion.button>
      </div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-10 text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto"
      >
        {place.description[i18n.language]}
      </motion.p>

      {/* Rekomendasi Terdekat */}
      <h2 className="mt-16 text-3xl font-bold text-gray-900 text-center">
        {t("detail.nearby_recommendations")}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
        {/* Hotels */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {t("detail.hotel")}
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {place.hotels?.length > 0 ? (
              place.hotels.map((hotel, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg group"
                >
                  {/* Gambar */}
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="font-semibold text-lg">{hotel.name}</h4>
                    <div className="flex items-center mt-1">
                      <StarRating rating={hotel.rating} />
                    </div>
                    <p className="mt-1 text-sm font-medium">{hotel.price[i18n.language]}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">{t("no_hotels")}</p>
            )}
          </div>
        </div>

        {/* Restaurants */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {t("detail.restaurant")}
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {place.restaurants?.length > 0 ? (
              place.restaurants.map((resto, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg group"
                >
                  {/* Gambar */}
                  <img
                    src={resto.image}
                    alt={resto.name}
                    className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="font-semibold text-lg">{resto.name}</h4>
                    <div className="flex items-center mt-1">
                      <StarRating rating={resto.rating} />
                    </div>
                    <p className="mt-1 text-sm font-medium">{resto.price[i18n.language]}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">{t("no_restaurants")}</p>
            )}
          </div>
        </div>
        {/* Bagian Ulasan */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ulasan Pengunjung
          </h2>

          {/* Tombol Tulis Ulasan */}
          <button
            onClick={() => navigate(`/reviews/${id}`)}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md transition"
          >
            Tulis Ulasan
          </button>

          {/* Daftar Ulasan */}
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-800">
                      {review.user?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold">{review.user || "Anonim"}</p>
                      <p className="text-xs text-gray-500">{review.date || "-"}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating || 0} />
                </div>
                <h4 className="font-semibold mb-1">{review.title || "Tanpa Judul"}</h4>
                <p className="text-gray-700">{review.text || "Tidak ada deskripsi ulasan."}</p>
                {review.photo && (
                  <img
                    src={review.photo}
                    alt="Review"
                    className="mt-3 w-40 h-40 object-cover rounded-lg"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada ulasan. Jadilah yang pertama!</p>
          )}

        </div>

      </div>
    </div>
  );
}
