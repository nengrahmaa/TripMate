import { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ isModal = true, onClose }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // ambil user yang sudah ada
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // cek username sudah ada atau belum
    if (users.find((u) => u.username === username)) {
      alert(t("register.username_exists"));
      return;
    }

    // cek password sama/tidak
    if (password !== confirmPassword) {
      alert(t("register.password_mismatch"));
      return;
    }

    // buat user baru dengan id unik
    const newUser = {
      id: crypto.randomUUID(), // id unik
      username,
      password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert(t("register.success"));
    navigate("/login");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isModal ? "bg-black/50 backdrop-blur-sm" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="relative flex w-[90%] max-w-4xl rounded-2xl overflow-hidden shadow-lg"
      >
        {/* Tombol close */}
        {isModal && (
          <button
            onClick={() => {
              if (onClose) onClose();
              navigate("/");
            }}
            className="absolute top-4 right-4 z-10 text-black hover:text-red-400"
          >
            <X size={28} />
          </button>
        )}

        {/* Bagian kiri (Welcome) */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-b from-green-500 to-green-700 text-white p-8">
          <h2 className="text-3xl font-bold mb-2">{t("register.welcome")}</h2>
          <p className="text-lg">{t("register.prompt_message")}</p>
        </div>

        {/* Bagian kanan (Form) */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white dark:bg-gray-900 p-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {t("register.title")}
          </h1>

          <form onSubmit={handleRegister} className="w-full space-y-4">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" size={20} />
              <input
                type="text"
                placeholder={t("register.username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" size={20} />
              <input
                type="password"
                placeholder={t("register.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Konfirmasi Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" size={20} />
              <input
                type="password"
                placeholder={t("register.confirm_password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Tombol daftar */}
            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition"
            >
              {t("register.button")}
            </button>
          </form>

          {/* Link login */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-5">
            {t("register.have_account")}{" "}
            <Link
              to="/login"
              className="text-green-600 hover:underline dark:text-green-400"
            >
              {t("register.login_link")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
