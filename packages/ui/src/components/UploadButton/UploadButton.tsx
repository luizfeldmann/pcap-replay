import { Fab } from "@mui/material";
import { Icons } from "../../constants/Icons";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useFileUploadButton } from "./useFileUploadButton";

export const UploadButton = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upload = useFileUploadButton();

  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="upload"
      onClick={() => {
        fileInputRef.current?.click();
      }}
      disabled={upload.isPending}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        margin: 0,
        zIndex: 10,
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={upload.onChangeFileUpload}
      />
      {<Icons.UploadFile />}
      {t("files.upload")}
    </Fab>
  );
};
