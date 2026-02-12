import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { UploadButton } from "../../components/UploadButton/UploadButton";
import { FilesList } from "../../components/FilesList/FilesList";

export const FilesPage = () => {
  const { t } = useTranslation();

  return (
    <Stack
      spacing={1}
      sx={{ display: "flex", flexGrow: 1, position: "relative" }}
    >
      <Typography variant="h6">{t("files.list")}</Typography>
      <UploadButton />
      <FilesList />
    </Stack>
  );
};
