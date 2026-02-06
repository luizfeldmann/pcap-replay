import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";

export const initI18n = async () =>
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
      },
      fallbackLng: "en",

      detection: {
        order: ["sessionStorage", "navigator"],
        caches: ["sessionStorage"],
      },

      interpolation: {
        escapeValue: false,
      },
    });
