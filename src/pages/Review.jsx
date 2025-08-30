import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import StarRating from "../components/StarRating";

export default function Reviews() {
  const { t } = useTranslation();
  const [userReviews, setUserReviews] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user")); // ambil user login

  useEffect(() => {
    if (!storedUser) return; // jika user belum login, hentikan

    const allReviews = [];

    // Loop semua key di localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Ambil hanya key yang diawali dengan 'reviews_'
      if (key.startsWith("reviews_")) {
        const reviewsForPlace = JSON.parse(localStorage.getItem(key)) || [];
        const userReviewsForPlace = reviewsForPlace.filter(
          (review) => review.id === storedUser.id
        );

        // Tambahkan info id tempat ke tiap review
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-4">{t("reviews.title")}</h1>

      {userReviews.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          {t("reviews.empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {userReviews.map((review, index) => (
            <li
              key={index}
              className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{review.user}</p>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-gray-500">{review.date}</p>
              <h3 className="text-lg font-bold mt-2">{review.title}</h3>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {review.text}
              </p>
              {review.photo && (
                <img
                  src={review.photo}
                  alt="Foto Ulasan"
                  className="mt-3 w-40 h-40 object-cover rounded-lg"
                />
              )}
              <p className="text-xs text-gray-500 mt-2">
                {t("reviews.place_id")}: {review.placeId}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
