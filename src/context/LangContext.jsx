import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return localStorage.getItem(`lang_${user.id}`) || i18n.language || "en";
    }
    return i18n.language || "en";
  });

  // Sync ke i18n dan localStorage saat language berubah
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    i18n.changeLanguage(language);
    if (user) {
      localStorage.setItem(`lang_${user.id}`, language);
    }
  }, [language, i18n]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LangContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
