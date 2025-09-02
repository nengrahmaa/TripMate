import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth(); 
  const guestKey = "theme_guest";

  const [theme, setTheme] = useState(null);

  useEffect(() => {
    let key;
    if (user) {
      key = `theme_${user.id}`;
    } else {
      key = guestKey;
    }

    const savedTheme = localStorage.getItem(key) || "light";
    setTheme(savedTheme);
  }, [user]);

  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    const key = user ? `theme_${user.id}` : guestKey;
    localStorage.setItem(key, newTheme);
  };

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
