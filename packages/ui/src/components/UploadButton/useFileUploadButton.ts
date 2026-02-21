import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useFileUpload } from "../../api/files/useFileUpload";

export const useFileUploadButton = () => {
  const { t } = useTranslation();
  const upload = useFileUpload();

  const onChangeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check a file has been selected
    const files = e.target.files;
    if (!files || !files.length) return;
    const file = files[0];

    // Check the file is valid
    if (!file.name.toLowerCase().endsWith(".pcap")) {
      enqueueSnackbar(t("files.error.badtype"), { variant: "error" });
      return;
    }

    // Send the mutation
    upload.mutate(file, {
      // Show a snackbar if an error ocurred
      onError: (err, variables) => {
        enqueueSnackbar(
          t("files.error.upload", {
            name: variables.name,
            message: err.message,
          }),
          {
            variant: "error",
          },
        );
      },
      onSuccess: (_data, variables) => {
        // Show a snackbar on upload success
        enqueueSnackbar(t("files.success.upload", { name: variables.name }), {
          variant: "success",
        });
      },
    });
  };

  return { onChangeFileUpload, isPending: upload.isPending };
};
