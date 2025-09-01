import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import StarRating from "../components/StarRating";

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const editingReview = location.state?.review || null;

  const [rating, setRating] = useState(0);
  const [visitTime, setVisitTime] = useState("");
  const [withWho, setWithWho] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setTitle(editingReview.title);
      setText(editingReview.text);
      setPhoto(editingReview.photo || null);
    }
  }, [editingReview]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!rating || !text.trim() || !title.trim() || !photo) {
      alert(t("review_page.complete_all_fields"));
      return;
    }

    const key = `reviews_${id}`;
    let existingReviews = JSON.parse(localStorage.getItem(key)) || [];

    if (editingReview) {
      existingReviews = existingReviews.map((rev) =>
        rev.id === editingReview.id && rev.date === editingReview.date
          ? { ...rev, rating, title, text, photo }
          : rev
      );
    } else {
      const newReview = {
        id: Date.now(),
        id_user: storedUser.id,
        user: storedUser.username,
        rating,
        title: title.trim(),
        text: text.trim(),
        date: new Date().toLocaleDateString(),
        photo,
      };
      existingReviews.push(newReview);
    }

    localStorage.setItem(key, JSON.stringify(existingReviews));
    navigate(-1);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-20 space-y-6 sm:space-y-10"
    >
      {/* Header */}
            <div className="flex items-center justify-start mb-8 gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-cyan-700 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-700" />
        </motion.button>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-700 dark:text-gray-200">
          {editingReview ? t("review_page.edit_title") : t("review_page.add_title")}
        </h1>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <p className="mb-2 font-semibold">{t("review_page.rating_label")}</p>
        <StarRating rating={rating} setRating={setRating} interactive />
      </div>

      {/* Waktu kunjungan */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          {t("review_page.visit_time")}
        </label>
        <input
          type="date"
          className="border rounded-lg p-3 w-full text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={visitTime}
          onChange={(e) => setVisitTime(e.target.value)}
        />
      </div>

      {/* Dengan siapa */}
      <div className="mb-6">
        <p className="mb-2 font-semibold">{t("review_page.with_who")}</p>
        <div className="flex gap-3 flex-wrap">
          {["Bisnis", "Pasangan", "Keluarga", "Teman", "Sendirian"].map((opt) => (
            <button
              key={opt}
              onClick={() => setWithWho(opt)}
              className={`px-4 py-2 rounded-full border text-sm sm:text-base transition ${withWho === opt
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {t(`review_page.with_options.${opt.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Judul ulasan */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">{t("review_page.review_title")}</label>
        <input
          type="text"
          className="border rounded-lg p-3 w-full text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
          placeholder={t("review_page.title_placeholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>


      {/* Teks ulasan */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">{t("review_page.review_text")}</label>
        <textarea
          className="border rounded-lg p-3 w-full h-32 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
          placeholder={t("review_page.text_placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Upload foto */}
      <div className="mb-8">
        <label className="block font-semibold mb-2">{t("review_page.upload_photo")}</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="block w-full text-sm"
        />
        {photo && (
          <img
            src={photo}
            alt="Preview"
            className="mt-3 w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg shadow-md"
          />
        )}
      </div>

      {/* Tombol aksi */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm sm:text-base hover:bg-blue-700 shadow-md transition"
        >
          {editingReview ? t("review_page.update_button") : t("review_page.submit_button")}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-full text-sm sm:text-base hover:bg-gray-400 shadow-md transition"
        >
          {t("review_page.cancel_button")}
        </button>
      </div>
    </motion.div>
    </div>
  );
}
