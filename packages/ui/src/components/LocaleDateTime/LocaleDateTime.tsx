import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const LocaleDateTime = (props: { iso: string }) => {
  const { i18n } = useTranslation();
  const text = useMemo(
    () =>
      Intl.DateTimeFormat(i18n.language, {
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(new Date(props.iso)),
    [props.iso, i18n.language],
  );

  return <span>{text}</span>;
};
