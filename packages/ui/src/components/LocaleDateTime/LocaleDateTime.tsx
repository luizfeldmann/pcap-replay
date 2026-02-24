import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const LocaleDateTime = (props: {
  iso: string;
  options: Intl.DateTimeFormatOptions;
}) => {
  const { i18n } = useTranslation();
  const text = useMemo(
    () =>
      Intl.DateTimeFormat(i18n.language, props.options).format(
        new Date(props.iso),
      ),
    [props.iso, props.options, i18n.language],
  );

  return <span>{text}</span>;
};
