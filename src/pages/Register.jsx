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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let message = "";

    if (name === "username") {
      if (!value.trim()) message = t("register.error_username_required");
      else if (value.length < 3) message = t("register.error_username_short");
    }

    if (name === "password") {
      if (!value) message = t("register.error_password_required");
      else if (value.length < 6) message = t("register.error_password_short");
    }

    if (name === "confirmPassword") {
      if (!value) message = t("register.error_confirm_required");
      else if (value !== password) message = t("register.password_mismatch");
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const isValid =
      validateField("username", username) &&
      validateField("password", password) &&
      validateField("confirmPassword", confirmPassword);

    if (!isValid) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.username === username)) {
      setErrors((prev) => ({ ...prev, username: t("register.username_exists") }));
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      username,
      password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert(t("register.success"));
    navigate("/login");
  };

  const getInputClass = (field, value) => {
    if (errors[field]) return "border-red-500 focus:ring-red-500";
    if (value && !errors[field]) return "border-green-500 focus:ring-green-500";
    return "border-gray-300 dark:border-gray-600 focus:ring-blue-500";
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
        className="relative flex w-[90%] max-w-3xl rounded-2xl overflow-hidden shadow-lg"
      >
        {isModal && (
          <button
            onClick={() => {
              if (onClose) onClose();
              navigate("/");
            }}
            className="absolute top-4 right-4 z-10 text-black dark:text-white hover:text-red-400"
          >
            <X size={28} />
          </button>
        )}

        {/* Bagian kiri */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-b from-blue-500 to-blue-700 text-white p-8">
          <h2 className="text-3xl font-bold mb-2">{t("register.welcome")}</h2>
          <p className="text-lg">{t("register.prompt_message")}</p>
        </div>

        {/* Bagian kanan */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white dark:bg-gray-900 p-8 transition-colors duration-500">
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
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateField("username", e.target.value);
                }}
                className={`w-full pl-10 pr-3 py-2 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 ${getInputClass(
                  "username",
                  username
                )}`}
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" size={20} />
              <input
                type="password"
                placeholder={t("register.password")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
                className={`w-full pl-10 pr-3 py-2 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 ${getInputClass(
                  "password",
                  password
                )}`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" size={20} />
              <input
                type="password"
                placeholder={t("register.confirm_password")}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField("confirmPassword", e.target.value);
                }}
                className={`w-full pl-10 pr-3 py-2 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 ${getInputClass(
                  "confirmPassword",
                  confirmPassword
                )}`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition"
            >
              {t("register.button")}
            </button>
          </form>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-5">
            {t("register.have_account")}{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("register.login_link")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
