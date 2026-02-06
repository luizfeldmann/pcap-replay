import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const NetworkPage = () => {
  const { t } = useTranslation();
  return <Typography variant="h6">{t("nav.tabs.network")}</Typography>;
};
