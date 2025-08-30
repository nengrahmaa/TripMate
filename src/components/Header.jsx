import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Search, Moon, Sun, Globe, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // <-- import ThemeContext

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // <-- ambil theme dari context

  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language.toUpperCase() || "ID");
  const [searchActive, setSearchActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "EN" ? "id" : "en";
    i18n.changeLanguage(newLang);
    setLanguage(newLang.toUpperCase());
    localStorage.setItem("language", newLang);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      alert(t("header.login_required"));
      navigate("/login");
    } else {
      navigate(path);
    }
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      if (query) {
        navigate(`/explore?search=${encodeURIComponent(query)}`);
        setSearchActive(false);
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 shadow-md transition-colors duration-300 ${
        isScrolled ? "bg-black/20 dark:bg-gray-900/50 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="TripMateID Logo" className="h-10 w-100%" />
          <span className="text-xl font-bold text-gray-200 dark:text-gray-500">TripMate</span>
        </div>

        {/* Mobile & Tablet */}
        <div className="flex items-center gap-3 lg:hidden">
          {!searchActive ? (
            <Search
              className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={() => setSearchActive(true)}
            />
          ) : (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "200px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              type="text"
              placeholder={t("home.search_placeholder")}
              className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-black dark:text-white focus:outline-none"
              onKeyDown={handleSearch}
              onBlur={() => setSearchActive(false)}
              autoFocus
            />
          )}
          <Menu
            className="h-7 w-7 text-gray-800 dark:text-gray-200 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Search */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 w-64">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-300" />
            <input
              type="text"
              placeholder={t("home.search_placeholder")}
              className="bg-transparent px-2 w-full focus:outline-none text-sm text-black dark:text-white"
              onKeyDown={handleSearch}
            />
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <button
              onClick={() => handleProtectedRoute("/explore")}
              className={`transition ${
                isActive("/explore")
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "hover:text-green-700 dark:hover:text-green-400"
              }`}
            >
              {t("header.explore")}
            </button>
            <button
              onClick={() => handleProtectedRoute("/about")}
              className={`transition ${
                isActive("/about")
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "hover:text-green-700 dark:hover:text-green-400"
              }`}
            >
              {t("header.about")}
            </button>
          </nav>

          {/* Language */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            <Globe className="h-5 w-5" /> {language}
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme} // <-- gunakan context
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            {theme === "dark" ?  <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            
          </button>

          {/* Profile or Login */}
          {isLoggedIn ? (
            <img
              src="/profile.png"
              alt="Profile"
              className="h-9 w-9 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
              onClick={() => handleProtectedRoute("/profile")}
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition"
            >
              {t("header.login")}
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4 }}
              className="fixed top-0 right-0 w-1/2 h-full bg-white dark:bg-[#0a1a2c] shadow-lg z-50 p-6 flex flex-col"
            >
              <div className="flex justify-end mb-6">
                <X
                  className="h-7 w-7 text-gray-800 dark:text-gray-200 cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                />
              </div>

              <nav className="flex flex-col gap-6 mt-4 text-gray-800 dark:text-gray-200 text-lg">
                <button
                  onClick={() => handleProtectedRoute("/explore")}
                  className={`text-left transition ${
                    isActive("/explore")
                      ? "border-l-4 border-green-600 pl-2 text-green-600 dark:text-green-400"
                      : "hover:text-green-600 dark:hover:text-green-400"
                  }`}
                >
                  {t("header.explore")}
                </button>
                <button
                  onClick={() => handleProtectedRoute("/about")}
                  className={`text-left transition ${
                    isActive("/about")
                      ? "border-l-4 border-green-600 pl-2 text-green-600 dark:text-green-400"
                      : "hover:text-green-600 dark:hover:text-green-400"
                  }`}
                >
                  {t("header.about")}
                </button>

                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleProtectedRoute("/profile")}
                      className="flex items-center gap-2 text-left"
                    >
                      <User className="h-5 w-5" /> {t("header.profile")}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-left text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-5 w-5" /> {t("header.logout")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="text-green-600 hover:underline text-left"
                  >
                    {t("header.login")}
                  </button>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
                <button
                  onClick={toggleTheme} 
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-left"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {/* {theme === "dark" ? t("header.light_mode") : t("header.dark_mode")} */}
                </button>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-left"
                >
                  <Globe className="h-5 w-5" /> {language}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
