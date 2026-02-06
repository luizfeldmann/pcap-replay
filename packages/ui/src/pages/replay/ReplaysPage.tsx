import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ReplaysPage = () => {
  const { t } = useTranslation();
  return <Typography variant="h6">{t("nav.tabs.replays")}</Typography>;
};
