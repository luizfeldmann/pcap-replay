import type { PopoverPosition } from "@mui/material";
import { useState } from "react";
import { useDeleteFile } from "../../api/files";

export type FileContextSelection = {
  id: string;
  name: string;
};

export const useFileContextMenu = () => {
  const fileDeletion = useDeleteFile();
  const [anchor, setAnchor] = useState<undefined | PopoverPosition>(undefined);
  const [selectedRow, setSelectedRow] = useState<
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
    // TODO
    console.log("Rename", selectedRow);
    onClose();
  };

  return {
    anchor,
    onOpen,
    onClose,
    onRename,
    onDelete,
  };
};
