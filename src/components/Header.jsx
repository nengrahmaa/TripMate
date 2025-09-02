import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Search, ArrowLeft, Moon, Sun, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LangContext";
import data from "../json/data/data.json";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const { language, changeLanguage } = useLang();
  const [searchActive, setSearchActive] = useState(false);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchRef = useRef(null);

  // Auth-protected routes
  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      alert(t("header.login_required"));
      navigate("/login");
    } else {
      navigate(path);
    }
    setMenuOpen(false);
  };

  // Flatten data for search
  const flattenedData = data.flatMap((city) => {
    const cityEntry = {
      id: city.id,
      name: city.city,
      type: "city",
      image: city.places[0]?.image || "/default-city.jpg",
    };

    const placesEntries = city.places.map((place) => ({
      id: `${city.id}-${place.name.en}`,
      name: place.name[i18n.language] || place.name.en || place.name.id,
      type: "place",
      cityId: city.id,
      cityName: city.city,
      nameEn: place.name.en,
      image: place.image,
    }));

    return [cityEntry, ...placesEntries];
  });


  // Toggle language
  const toggleLanguage = () => {
    changeLanguage(language === "en" ? "id" : "en");
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      const trimmedQuery = query.trim().toLowerCase();

      const exactMatch = results.find(
        (item) => item.name.toLowerCase() === trimmedQuery
      );

      if (exactMatch) {
        handleClickResult(exactMatch);
      } else if (results.length === 1) {
        handleClickResult(results[0]);
      } else {
        console.log("No exact match or multiple results");
      }
    }
  };

  // Handle click on search result
  const handleClickResult = (item) => {
    if (item.type === "city") {
      navigate(`/cities/${item.id}`);
    } else {
      navigate(`/detail/${item.cityName}-${item.nameEn}?city=${item.cityName}`);
    }
    resetSearch();
  };

  // Reset 
  const resetSearch = () => {
    setSearchActive(false);
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleSearchInput = (keyword) => {
    setQuery(keyword);

    if (!keyword.trim()) {
      setResults([]);
      setIsFocused(false);
      return;
    }

    const filtered = flattenedData.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setResults(filtered);
    setIsFocused(true);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gray-200 dark:bg-gray-800 shadow-md transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
            alt="Logo"
            className="h-11 sm:h-10  w-auto" />
          <span className="hidden sm:inline text-xl font-bold text-cyan-800 dark:text-gray-200">
            TripMate
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div
            ref={searchRef}
            className="relative flex items-center bg-gray-200 dark:bg-gray-500 rounded-full px-3 py-1 w-72 shadow-md"
          >
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-200" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => query.trim() && setIsFocused(true)}
              placeholder={t("home.search_placeholder")}
              className="bg-transparent px-2 w-full focus:outline-none text-sm text-gray-900 dark:text-gray-200  dark:shadow-md cursor-pointer"
            />
            {isFocused && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 top-full mt-2 w-full bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-64 overflow-y-auto"
              >
                {results.length > 0 ? (
                  results.map((item) => (
                    <li
                      key={item.id}
                      tabIndex={0}
                      className="flex items-center gap-3 p-3 bg-dark-100 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
                      onClick={() => handleClickResult(item)}
                      onKeyDown={(e) => e.key === "Enter" && handleClickResult(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.name}
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {item.type === "city" ? "(City)" : "(Place)"}
                        </span>
                      </span>
                    </li>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    {t("header.no_result")}
                  </div>
                )}
              </motion.ul>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm font-medium text-cyan-800 dark:text-gray-200">
            <button
              onClick={() => handleProtectedRoute("/explore")}
              className={`cursor-pointer font-bold pb-1 ${isActive("/explore")
                ? "border-b-2 border-cyan-500 text-cyan-500"
                : "hover:text-cyan-600 dark:hover:text-cyan-700"
                }`}
            >
              {t("header.explore")}
            </button>
            <button
              onClick={() => navigate("/about")}
              className={`cursor-pointer font-bold pb-1 ${isActive("/about")
                ? "border-b-2 border-cyan-500 text-cyan-500"
                : "hover:text-cyan-600 dark:hover:text-cyan-700"
                }`}
            >
              {t("header.about")}
            </button>
          </nav>

          {/* Language & Theme */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-semibold text-cyan-700 dark:text-cyan-50 px-2 py-1 rounded-md hover:text-cyan-500 dark:hover:text-cyan-700 transition cursor-pointer"
          >
            <Globe className="h-5 w-5" /> {language.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 text-sm font-semibold text-cyan-700 dark:text-cyan-50 px-2 py-1 rounded-md hover:text-cyan-500 dark:hover:text-cyan-700 transition cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Profile / Login */}
          {isLoggedIn ? (
            <img
              src="https://i.pinimg.com/736x/ee/c5/cf/eec5cf10cb80af4e4b1c6674445be559.jpg"
              alt="Profile"
              className="h-9 w-9 rounded-full border-2 border-cyan-800 dark:border-gray-600 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleProtectedRoute("/profile")}
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-cyan-500 text-white px-4 py-1 rounded-full hover:bg-cyan-600 transition cursor-pointer"
            >
              {t("header.login")}
            </button>
          )}

        </div>

        <div className="flex lg:hidden items-center gap-3">
          {!searchActive ? (
            <Search
              className="h-5 w-5 text-gray-700 dark:text-gray-300 cursor-pointer"
              onClick={() => {
                setSearchActive(true);
                setIsFocused(true);
              }}
            />
          ) : (
            <div className="fixed top-0 left-0 w-full h-14 bg-gray-100 dark:bg-gray-900 flex items-center px-3 z-50 shadow-lg">
              {/* Tombol Back */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center"
              >
                <ArrowLeft
                  className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={resetSearch}
                />
              </motion.div>

              {/* Input Search */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex-1 mx-3"
              >
                <motion.input
                  type="text"
                  placeholder={t("home.search_placeholder")}
                  value={query}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  onFocus={() => query.trim() && setIsFocused(true)}
                  autoFocus
                  className="w-full h-11 px-4 rounded-4xl border border-gray-300 dark:border-gray-700bg-white dark:bg-gray-800text-gray-900 dark:text-gray-100 shadow-sm focus:shadow-md placeholder-gray-400 dark:placeholder-gray-500focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500transition-all duration-300"
                />
              </motion.div>

              {isFocused && query.trim() && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-0 top-full mt-2 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-mdrounded-2xl shadow-xl border border-gray-300 dark:border-gray-700 z-50 max-h-64 overflow-y-auto"
                >
                  {results.length > 0 ? (
                    results.map((item) => (
                      <li
                        key={item.id}
                        tabIndex={0}
                        className="flex items-center gap-3 p-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
                        onClick={() => handleClickResult(item)}
                        onKeyDown={(e) => e.key === "Enter" && handleClickResult(item)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {item.name}
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {item.type === "city" ? "(City)" : "(Place)"}
                          </span>
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      {t("header.no_result")}
                    </div>
                  )}
                </motion.ul>
              )}
            </div>
          )}
          <Menu
            className="h-7 w-7 text-gray-800 dark:text-gray-200 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "200%" }} 
            animate={{ x: 0 }}
            exit={{ x: "200%" }}    
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex justify-end" 
          >
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            ></div>

            <div className="relative z-50 bg-white dark:bg-gray-900 w-72 sm:w-80 h-full shadow-2xl flex flex-col p-6">
              {/* Close button */}
              <div className="flex justify-end">
                <X
                  className="h-6 w-6 text-gray-800 dark:text-gray-200 cursor-pointer hover:text-red-500 transition"
                  onClick={() => setMenuOpen(false)}
                />
              </div>

              <nav className="flex flex-col mt-6 gap-4 text-gray-800 dark:text-gray-200 font-medium text-base">
                <button
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  }}
                  className={`pb-1 ${isActive("/")
                    ? "border-b-2 border-cyan-500 text-cyan-500"
                    : "hover:text-cyan-600 dark:hover:text-cyan-400"
                    }`}
                >
                  {t("header.home")}
                </button>

                <button
                  onClick={() => {
                    handleProtectedRoute("/explore");
                    setMenuOpen(false);
                  }}
                  className={`pb-1 ${isActive("/explore")
                    ? "border-b-2 border-cyan-500 text-cyan-500"
                    : "hover:text-cyan-600 dark:hover:text-cyan-400"
                    }`}
                >
                  {t("header.explore")}
                </button>

                <button
                  onClick={() => {
                    navigate("/about");
                    setMenuOpen(false);
                  }}
                  className={`pb-1 ${isActive("/about")
                    ? "border-b-2 border-cyan-500 text-cyan-500"
                    : "hover:text-cyan-600 dark:hover:text-cyan-400"
                    }`}
                >
                  {t("header.about")}
                </button>
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className={`pb-1 ${isActive("/profile")
                      ? "border-b-2 border-cyan-500 text-cyan-500"
                      : "hover:text-cyan-600 dark:hover:text-cyan-400"
                      }`}
                  >
                    {t("header.profile")}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-cyan-500 text-white px-4 py-1 rounded-full hover:bg-cyan-600 transition"
                  >
                    {t("header.login")}
                  </button>
                )}

                <button onClick={toggleLanguage} className="flex items-center gap-2">
                  <Globe className="h-5 w-5" /> {language.toUpperCase()}
                </button>

                <button onClick={toggleTheme} className="flex items-center gap-2">
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header >
  );
}
