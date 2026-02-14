import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const useLanguageSelector = () => {
  // Find connection between the language code and display name
  const { i18n } = useTranslation();
  const languageOptions = useMemo(
    () =>
      Object.keys(i18n.options.resources ?? {}).reduce<Record<string, string>>(
        (acc, name) => {
          acc[name] = i18n.getResource(name, "translation", "language");
          return acc;
        },
        {},
      ),
    [i18n],
  );

  // Context menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  return {
    isOpen,
    anchorEl,
    setAnchorEl,
    languageOptions,
    currentLanguage: i18n.language,
    changeLanguage: (lng: string) => void i18n.changeLanguage(lng),
  };
};
