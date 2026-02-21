import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Icons } from "../../utils/Icons";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRenameFile } from "../../api/files/useRenameFile";

// Characters not allowed in the file name
const INVALID_CHARS = /[\\/:*?"<>|]/;

export const FileRenameDialog = (props: {
  file?: { id: string; name: string };
  close(): void;
}) => {
  const { t } = useTranslation();
  const mutation = useRenameFile();
  const { reset, handleSubmit, control } = useForm<{ name: string }>({
    defaultValues: {
      name: props.file?.name,
    },
  });

  // Reset the form if the dialog is open on a different file
  useEffect(() => {
    reset({ name: props.file?.name });
  }, [props.file?.name, reset]);

  // Invoke mutation API
  const submit = ({ name }: { name: string }) => {
    if (!props.file) return props.close();
    mutation.mutate(
      { id: props.file.id, patch: { name } },
      {
        // Close form on success, otherwise keep open to show error
        onSuccess: () => props.close(),
      },
    );
  };

  return (
    <Dialog open={Boolean(props.file)} onClose={props.close}>
      <form onSubmit={(e) => void handleSubmit(submit)(e)}>
        <DialogTitle>{t("files.dialog.rename.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mutation.isPending && <LinearProgress />}
            {mutation.isError && (
              <Alert severity="error">{mutation.error.message}</Alert>
            )}
          </DialogContentText>
          <Controller
            name="name"
            control={control}
            rules={{
              required: t("files.dialog.rename.validate.required"),
              validate: {
                validChars: (v) =>
                  !INVALID_CHARS.test(v) ||
                  t("files.dialog.rename.validate.invalidchars"),
                extension: (v) =>
                  v.toLowerCase().endsWith(".pcap") ||
                  t("files.dialog.rename.validate.extension"),
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                autoFocus
                required
                fullWidth
                variant="standard"
                margin="dense"
                type="text"
                label={t("files.dialog.rename.label.name")}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onFocus={(e) => {
                  // Preselect the file's base name (not extension)
                  const input = e.target as HTMLInputElement;
                  const dotIndex = input.value.lastIndexOf(".");
                  const selRange = dotIndex > 0 ? dotIndex : input.value.length;
                  input.setSelectionRange(0, selRange);
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Icons.Cancel />} onClick={props.close}>
            {t("files.dialog.rename.cancel")}
          </Button>
          <Button startIcon={<Icons.Confirm />} type="submit">
            {t("files.dialog.rename.confirm")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
