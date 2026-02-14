import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export type ReplayFormPageProps = {
  mode: "create" | "edit";
};

export const ReplayFormPage = (props: ReplayFormPageProps) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={1} sx={{ display: "flex", flexGrow: 1 }}>
      <Typography variant="h6">
        {props.mode === "create" && t("replays.create.title")}
        {props.mode === "edit" && t("replays.edit.title")}
      </Typography>
    </Stack>
  );
};
