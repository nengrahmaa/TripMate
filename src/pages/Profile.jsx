import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Edit, LogOut, Heart, Star, Plane } from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [counts, setCounts] = useState({ wishlist: 0, trips: 0, reviews: 0 });

  if (!user) return null;

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
    const trips = JSON.parse(localStorage.getItem(`trips_${user.id}`) || "[]");

    let reviewsCount = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("reviews_")) {
        const reviews = JSON.parse(localStorage.getItem(key) || "[]");
        reviewsCount += reviews.filter((r) => r.id_user === user.id).length;
      }
    });

    setCounts({
      wishlist: wishlist.length,
      trips: trips.length,
      reviews: reviewsCount,
    });
  }, [user.id]);

  const handleLogout = () => {
    if (window.confirm(t("profile.confirm_logout"))) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-serif pb-8">
      <div className="relative w-full h-47 sm:h-55 md:h-60 lg:h-72 overflow-hidden shadow-md border border-gray-300 dark:border-gray-700">
        <img
          src="https://wallpaperaccess.com/full/4632386.jpg"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl mx-auto px-3 sm:px-4 md:px-6 -mt-16 sm:-mt-24 md:-mt-28 lg:-mt-32 z-10"
      >
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-300 dark:border-gray-700">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-300 dark:bg-gray-700 p-4 sm:p-6 pt-16 sm:pt-20 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-600">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-200 dark:border-gray-600 shadow-lg overflow-hidden -mt-12 sm:-mt-16 bg-white">
              <img
                src="https://i.pinimg.com/736x/ee/c5/cf/eec5cf10cb80af4e4b1c6674445be559.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-1 right-1 bg-gray-200 dark:bg-gray-800 rounded-full shadow p-1 sm:p-2 border border-gray-400 dark:border-gray-600"
                onClick={() => alert(t("profile.alert_edit"))}
              >
                <Edit size={16} className="text-gray-700 dark:text-gray-200" />
              </motion.button>
            </div>

            <h2 className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide text-center">
              {user.username}
            </h2>
            
            <div className="mt-4 sm:mt-6 w-full flex flex-col gap-2">
              {[
                { icon: Heart, label: t("profile.wishlist"), count: counts.wishlist, path: "/favorites" },
                { icon: Plane, label: t("profile.my_trips"), count: counts.trips, path: "/trips" },
                { icon: Star, label: t("profile.my_reviews"), count: counts.reviews, path: "/reviews" }
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg shadow border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200 w-full text-sm sm:text-base"
                >
                  <item.icon size={18} className="text-teal-600" />
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-auto font-bold">{item.count}</span>
                </motion.button>
              ))}
            </div>

            <div className="w-full mt-4 sm:mt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
              >
                <LogOut size={14} />
                {t("profile.logout")}
              </motion.button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 md:p-8">
            <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-2 uppercase tracking-wide">
              {t("profile.title")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: Heart, label: t("profile.wishlist"), count: counts.wishlist },
                { icon: Plane, label: t("profile.my_trips"), count: counts.trips },
                { icon: Star, label: t("profile.my_reviews"), count: counts.reviews }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 sm:p-5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow flex flex-col items-center w-full"
                >
                  <item.icon className="text-teal-600 mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{item.count}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-200 italic text-center">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
