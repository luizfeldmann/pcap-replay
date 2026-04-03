import { Alert, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ReplayForm } from "../../components/ReplayForm/ReplayForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { routes } from "../../utils/routes";
import { usePostReplay } from "../../api/replays/usePostReplay";
import { enqueueSnackbar } from "notistack";
import type { ReplayPost } from "shared";

export const ReplayFormPageCreate = () => {
  const { t } = useTranslation();
  const postMutation = usePostReplay();
  const navigate = useNavigate();

  // A pre-selected file may be given in the url
  const [searchParams] = useSearchParams();
  const file = searchParams.get(routes.replaysCreatePage.searchParams.file);

  // Handle submitting of the form
  const onSubmit = (formData: ReplayPost) => {
    // Invoke POST
    postMutation.mutate(formData, {
      onSuccess: (_data, variables) => {
        // Show a snackbar on success
        enqueueSnackbar(t("replays.create.success", { name: variables.name }), {
          variant: "success",
        });
        // Navigate to the replays page
        void navigate(routes.replaysViewPage.location);
      },
    });
  };

  return (
    <Stack spacing={1} sx={{ display: "flex" }}>
      <Typography variant="h6">{t("replays.create.title")}</Typography>
      <ReplayForm
        initState={{
          name: "",
          fileId: file || "",
          settings: { provider: "udpreplay" },
        }}
        labelSubmit={t("replays.form.button.create")}
        onSubmit={onSubmit}
        isLoading={postMutation.isPending}
      />
      {postMutation.isError && (
        <Alert severity="error">{postMutation.error.message}</Alert>
      )}
    </Stack>
  );
};
