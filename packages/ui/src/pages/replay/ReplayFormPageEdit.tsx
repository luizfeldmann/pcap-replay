import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ReplayForm } from "../../components/ReplayForm/ReplayForm";

export const ReplayFormPageEdit = () => {
  const { t } = useTranslation();
  return (
    <Stack spacing={1} sx={{ display: "flex" }}>
      <Typography variant="h6">{t("replays.edit.title")}</Typography>
      <ReplayForm
        initState={{ name: "", fileId: "", interface: "" }}
        labelSubmit={t("replays.form.button.edit")}
      />
    </Stack>
  );
};
