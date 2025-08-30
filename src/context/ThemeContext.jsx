import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user")); // ambil user yang login
    if (user) {
      return localStorage.getItem(`theme_${user.id}`) || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem(`theme_${user.id}`, theme); // simpan per user
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
