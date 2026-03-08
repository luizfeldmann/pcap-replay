import { useParams } from "react-router-dom";
import { useSingleReplay } from "../../api/replays/useSingleReplay";
import { useTranslation } from "react-i18next";
import { Alert, LinearProgress, Stack, Typography } from "@mui/material";
import { ReplayLogsHeader } from "../../components/ReplayLogs/ReplayLogsHeader";
import { ReplayLogsText } from "../../components/ReplayLogs/ReplayLogsText";

export const ReplayLogsPage = () => {
  const { t } = useTranslation();

  // The path contains the ID of the replay job to edit
  const params = useParams();
  const replayId = params["id"] ?? "";

  // Query the replay item data
  const replayData = useSingleReplay({ id: replayId });

  return (
    <Stack
      spacing={1}
      sx={{ display: "flex", flexGrow: 1, position: "relative" }}
    >
      <Typography variant="h6">{t("replays.logs.title")}</Typography>
      {replayId === "" && (
        <Alert severity="error">{t("replays.error.notspecified")}</Alert>
      )}
      {replayData.isError && (
        <Alert severity="error">
          {t("replays.error.fetcherror", { message: replayData.error })}
        </Alert>
      )}
      {replayData.isLoading && <LinearProgress />}
      {replayData.isSuccess && (
        <>
          <ReplayLogsHeader data={replayData.data} />
          <ReplayLogsText id={replayData.data.id} />
        </>
      )}
    </Stack>
  );
};
