import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import StarRating from "../components/StarRating";
import { MoreVertical, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Reviews() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userReviews, setUserReviews] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!storedUser) return;

    const allReviews = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("reviews_")) {
        const reviewsForPlace = JSON.parse(localStorage.getItem(key)) || [];
        const userReviewsForPlace = reviewsForPlace.filter(
          (review) => review.id_user === storedUser.id
        );
        userReviewsForPlace.forEach((review) => {
          allReviews.push({
            ...review,
            placeId: key.replace("reviews_", ""),
          });
        });
      }
    }
    setUserReviews(allReviews);
  }, []);

  // Fungsi edit
  const handleEdit = (review) => {
    navigate(`/reviews/${review.placeId}`, { state: { review } });
  };

  // Fungsi delete
  const handleDelete = (review) => {
    if (confirm(t("reviews.confirm_delete"))) {
      const key = `reviews_${review.placeId}`;
      const reviewsForPlace = JSON.parse(localStorage.getItem(key)) || [];
      const updatedReviews = reviewsForPlace.filter(
        (r) => !(r.id === review.id && r.date === review.date)
      );
      localStorage.setItem(key, JSON.stringify(updatedReviews));
      setUserReviews(userReviews.filter((r) => r !== review));
      setOpenMenu(null);
    }
  };

  return (
        <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-500">

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-20 space-y-6 sm:space-y-10">


      <div className="flex items-center justify-start mb-8 gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-cyan-700 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-700" />
        </motion.button>

        <h1 className="text-2xl md:text-3xl font-bold dark:text-white truncate">
          {t("reviews.title")}
        </h1>
      </div>

      {/* Jika tidak ada ulasan */}
      {userReviews.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 dark:text-gray-300 text-center mt-20"
        >
          {t("reviews.empty")}
        </motion.p>
      ) : (
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {userReviews.map((review, index) => (
            <motion.li
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative p-4 sm:p-5 border rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition 
                 max-w-sm w-full mx-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[70%] text-sm sm:text-base">
                  {review.user}
                </p>
                <StarRating rating={review.rating} />
              </div>

              <p className="text-[11px] sm:text-xs text-gray-500">{review.date}</p>
              <h3 className="text-base sm:text-lg dark:text-gray-200 font-bold mt-2 truncate">{review.title}</h3>
              <p className="mt-1 text-sm sm:text-base text-gray-700 dark:text-gray-300 line-clamp-3">
                {review.text}
              </p>

              {/* Gambar review */}
              {review.photo && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={review.photo}
                  alt="Foto Ulasan"
                  className="mt-3 w-full h-32 sm:h-36 object-cover rounded-lg shadow-md"
                />
              )}

              <div className="flex justify-between items-center mt-4">
                <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                  {t("reviews.place_id")}: {review.placeId}
                </p>

                {/* Dropdown menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === index ? null : index)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                  </button>

                  <AnimatePresence>
                    {openMenu === index && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-32 sm:w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden"
                      >
                        <button
                          onClick={() => handleEdit(review)}
                          className="flex items-center px-3 sm:px-4 py-2 w-full dark:text-gray-200 text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          {t("reviews.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(review)}
                          className="flex items-center px-3 sm:px-4 py-2 w-full text-xs sm:text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("reviews.delete")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
    </div>
  );
}
