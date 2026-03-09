import { Alert, LinearProgress, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  ReplayForm,
  type ReplayFormData,
} from "../../components/ReplayForm/ReplayForm";
import { useNavigate, useParams } from "react-router-dom";
import { useSingleReplay } from "../../api/replays/useSingleReplay";
import { usePatchReplay } from "../../api/replays/usePatchReplay";
import type { ReplayPatch } from "shared";
import { routes } from "../../utils/routes";
import { useSingleReplayEvents } from "../../api/replays/useSingleReplayEvents";

export const ReplayFormPageEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // API to modify after the edit
  const patchMutation = usePatchReplay();

  // The path contains the ID of the replay job to edit
  const params = useParams();
  const replayId = params["id"] ?? "";

  // Query the replay item data via REST
  const replayData = useSingleReplay({ id: replayId });

  // Get SSE updates on the replay
  useSingleReplayEvents(replayId);

  // Handle submitting of the form
  const onSubmit = (formData: ReplayFormData) => {
    const patchData: ReplayPatch = { ...formData };
    patchMutation.mutate(
      { id: replayId, patch: patchData },
      {
        onSuccess: () => {
          // Navigate to the replays page
          void navigate(routes.replaysViewPage.location);
        },
      },
    );
  };

  return (
    <Stack spacing={1} sx={{ display: "flex" }}>
      <Typography variant="h6">{t("replays.edit.title")}</Typography>
      {replayId === "" && (
        <Alert severity="error">{t("replays.error.notspecified")}</Alert>
      )}
      {replayData.isError && (
        <Alert severity="error">
          {t("replays.error.fetcherror", { message: replayData.error })}
        </Alert>
      )}
      {replayData.isLoading && <LinearProgress />}
      {replayData.data?.status === "RUNNING" && (
        <Alert severity="warning">{t("replays.error.statecannotedit")}</Alert>
      )}
      {replayData.isSuccess && replayData.data.status !== "RUNNING" && (
        <ReplayForm
          initState={replayData.data}
          labelSubmit={t("replays.form.button.edit")}
          isLoading={patchMutation.isPending}
          onSubmit={onSubmit}
        />
      )}
      {patchMutation.isError && (
        <Alert severity="error">{patchMutation.error.message}</Alert>
      )}
    </Stack>
  );
};
