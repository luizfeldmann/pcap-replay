import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useFileUpload } from "../../api/files";

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
    upload.mutate(file);
  };

  return { onChangeFileUpload, isPending: upload.isPending };
};
