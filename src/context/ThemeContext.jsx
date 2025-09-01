import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // asumsi ada AuthContext

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth(); // ambil user dari auth
  const guestKey = "theme_guest";

  // state tema awal null, agar tidak langsung render
  const [theme, setTheme] = useState(null);

  // inisialisasi tema saat mount dan saat user berubah
  useEffect(() => {
    let key;
    if (user) {
      // jika user login, pakai tema user
      key = `theme_${user.id}`;
    } else {
      // jika belum login, pakai tema guest
      key = guestKey;
    }

    const savedTheme = localStorage.getItem(key) || "light";
    setTheme(savedTheme);
  }, [user]);

  // fungsi toggle theme
  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    const key = user ? `theme_${user.id}` : guestKey;
    localStorage.setItem(key, newTheme);
  };

  // jangan render children sebelum theme siap
  if (!theme) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark" : "light"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
