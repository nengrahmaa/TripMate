import { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login({ isModal = true, onClose }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      login(user); // Update global state
      alert(t("login.success"));
      if (isModal && onClose) onClose();
      navigate("/");
    } else {
      alert(t("login.invalid_credentials"));
    }
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
        {isModal && (
          <button
            onClick={() => {
              if (onClose) onClose();
              navigate("/");
            }}
            className="absolute top-4 right-4 z-10 text-black dark:text-white hover:text-gray-400 cursor-pointer"
          >
            <X size={28} />
          </button>
        )}

        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-b from-cyan-500 to-cyan-700 text-white p-8">
          <h2 className="text-3xl font-bold mb-2">{t("login.welcome_back")}</h2>
          <p className="text-lg">{t("login.prompt_message")}</p>
        </div>

        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white dark:bg-gray-800 p-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {t("login.title")}
          </h1>
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" size={20} />
              <input
                type="text"
                placeholder={t("login.username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" size={20} />
              <input
                type="password"
                placeholder={t("login.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full border bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full font-medium transition"
            >
              {t("login.button")}
            </button>
          </form>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-5">
            {t("login.no_account")}{" "}
            <Link
              to="/register"
              className="text-cyan-600 hover:underline dark:text-cyan-400 cursor-pointer"
            >
              {t("login.register_link")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
