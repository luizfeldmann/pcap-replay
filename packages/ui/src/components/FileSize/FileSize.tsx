import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const FileSize = (props: { size: number }) => {
  const { t, i18n } = useTranslation();

  const formatted = useMemo(() => {
    const units = [
      "files.units.b",
      "files.units.kb",
      "files.units.mb",
      "files.units.gb",
    ];

    let u = 0;
    let s = props.size;
    while (u < units.length - 1 && s >= 1024) {
      u++;
      s /= 1024;
    }

    const decimal = new Intl.NumberFormat(i18n.language, {
      style: "decimal",
      maximumFractionDigits: 2,
    }).format(s);

    return t(units[u], { size: decimal });
  }, [props.size, t, i18n.language]);

  return <>{formatted}</>;
};
