import type { PopoverPosition } from "@mui/material";
import { useState } from "react";
import { useDeleteFile } from "../../api/files/useDeleteFile";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export type FileContextSelection = {
  id: string;
  name: string;
};

export const useFileContextMenu = () => {
  const { t } = useTranslation();
  // Mutation to delete the file
  const fileDeletion = useDeleteFile();

  // Stores location where the context was opened
  const [anchor, setAnchor] = useState<undefined | PopoverPosition>(undefined);

  // On which row the context was opened
  const [selectedRow, setSelectedRow] = useState<
    FileContextSelection | undefined
  >(undefined);

  const [renameFile, setRenameFile] = useState<
    FileContextSelection | undefined
  >(undefined);

  const onOpen = (
    event: React.MouseEvent<HTMLElement>,
    row: FileContextSelection,
  ) => {
    setAnchor({ left: event.clientX, top: event.clientY });
    setSelectedRow(row);
  };

  const onClose = () => {
    setAnchor(undefined);
    setSelectedRow(undefined);
  };

  const onDelete = () => {
    onClose();
    if (!selectedRow) return;
    fileDeletion.mutate(selectedRow, {
      onError: (err, variables) => {
        enqueueSnackbar(
          t("files.error.delete", {
            name: variables.name,
            message: err.message,
          }),
          {
            variant: "error",
          },
        );
      },
      onSuccess: (_data, variables) => {
        enqueueSnackbar(t("files.success.delete", { name: variables.name }), {
          variant: "success",
        });
      },
    });
  };

  const onRename = () => {
    setRenameFile(selectedRow);
    onClose();
  };

  const onCloseRename = () => {
    setRenameFile(undefined);
  };

  return {
    anchor,
    onOpen,
    onClose,
    onRename,
    onDelete,
    fileRename: {
      file: renameFile,
      close: onCloseRename,
    },
  };
};
