import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [visitTime, setVisitTime] = useState("");
  const [withWho, setWithWho] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!rating || !text.trim() || !title.trim()) return alert("Lengkapi semua data!");

    const newReview = {
      id: storedUser.id,
      user: storedUser.username,
      rating,
      title: title.trim(),
      text: text.trim(),
      date: new Date().toLocaleDateString(),
      photo,
    };

    const existingReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    existingReviews.push(newReview);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(existingReviews));
    localStorage.setItem(`reviews`, JSON.stringify(existingReviews));
    navigate(`/detail/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Beri tahu kami tentang kunjungan Anda
      </h1>

      {/* Rating */}
      <div className="mb-4">
        <p className="mb-2 font-medium">Bagaimana penilaian Anda?</p>
        <StarRating rating={rating} setRating={setRating} interactive />
      </div>

      {/* Kapan pergi */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Kapan Anda pergi?</label>
        <select
          className="border rounded p-2 w-full"
          value={visitTime}
          onChange={(e) => setVisitTime(e.target.value)}
        >
          <option value="">Pilih waktu</option>
          <option value="Januari 2025">Januari 2025</option>
          <option value="Februari 2025">Februari 2025</option>
          <option value="Maret 2025">Maret 2025</option>
        </select>
      </div>

      {/* Dengan siapa */}
      <div className="mb-4">
        <p className="mb-2 font-medium">Dengan siapa Anda pergi?</p>
        <div className="flex gap-3 flex-wrap">
          {["Bisnis", "Pasangan", "Keluarga", "Teman", "Sendirian"].map((opt) => (
            <button
              key={opt}
              onClick={() => setWithWho(opt)}
              className={`px-4 py-2 rounded-full border ${
                withWho === opt ? "bg-green-600 text-white" : "bg-gray-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Tulis ulasan */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Tulis ulasan</label>
        <textarea
          className="border rounded p-3 w-full h-32"
          placeholder="Ceritakan pengalaman Anda..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Judul ulasan */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Judul ulasan</label>
        <input
          type="text"
          className="border rounded p-3 w-full"
          placeholder="Beri judul ulasan Anda"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Upload foto */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Tambahkan foto (opsional)</label>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        {photo && <img src={photo} alt="Preview" className="mt-3 w-40 h-40 object-cover rounded-lg" />}
      </div>

      {/* Tombol Kirim */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
      >
        Kirim Ulasan
      </button>
    </div>
  );
}
