import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ReplayForm } from "../../components/ReplayForm/ReplayForm";
import { useSearchParams } from "react-router-dom";
import { routes } from "../../utils/routes";

export const ReplayFormPageCreate = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const file = searchParams.get(routes.replaysCreatePage.searchParams.file);

  return (
    <Stack spacing={1} sx={{ display: "flex" }}>
      <Typography variant="h6">{t("replays.create.title")}</Typography>
      <ReplayForm
        initState={{ name: "", fileId: file || "", interface: "" }}
        labelSubmit={t("replays.form.button.create")}
      />
    </Stack>
  );
};
