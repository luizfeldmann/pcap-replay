import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const App = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h3">{t("app.title")}</Typography>
    </>
  );
};
