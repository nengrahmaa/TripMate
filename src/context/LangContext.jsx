import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const { i18n } = useTranslation();

  const normalizeLang = (lang) => {
    if (!lang) return "en";
    const lower = lang.toLowerCase();
    if (lower.includes("id")) return "id";
    if (lower.includes("en")) return "en";
    return "en"; 
  };

  const [language, setLanguage] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const savedLang = user
      ? localStorage.getItem(`lang_${user.id}`)
      : null;
    return normalizeLang(savedLang || i18n.language || "en");
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const normalized = normalizeLang(language);
    i18n.changeLanguage(normalized);
    if (user) {
      localStorage.setItem(`lang_${user.id}`, normalized);
    }
  }, [language, i18n]);

  const changeLanguage = (lang) => {
    setLanguage(normalizeLang(lang));
  };

  return (
    <LangContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
