import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ReplayForm } from "../../components/ReplayForm/ReplayForm";

export const ReplayFormPageCreate = () => {
  const { t } = useTranslation();
  return (
    <Stack spacing={1} sx={{ display: "flex" }}>
      <Typography variant="h6">{t("replays.create.title")}</Typography>
      <ReplayForm
        initState={{ name: "", fileId: "", interface: "" }}
        labelSubmit={t("replays.form.button.create")}
      />
    </Stack>
  );
};
