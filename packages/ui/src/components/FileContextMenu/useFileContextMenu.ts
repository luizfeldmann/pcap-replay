import type { PopoverPosition } from "@mui/material";
import { useState } from "react";
import { useDeleteFile } from "../../api/files";

export type FileContextSelection = {
  id: string;
  name: string;
};

export const useFileContextMenu = () => {
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
    if (selectedRow) fileDeletion.mutate(selectedRow);
    onClose();
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
