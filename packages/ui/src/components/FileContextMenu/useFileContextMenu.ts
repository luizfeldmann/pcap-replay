import type { PopoverPosition } from "@mui/material";
import { useState } from "react";

export const useFileContextMenu = () => {
  const [anchor, setAnchor] = useState<undefined | PopoverPosition>(undefined);
  const [selectedRow, setSelectedRow] = useState<string | undefined>(undefined);

  const onOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchor({ left: event.clientX, top: event.clientY });
    setSelectedRow(id);
  };

  const onClose = () => {
    setAnchor(undefined);
    setSelectedRow(undefined);
  };

  const onDelete = () => {
    // TODO
    console.log("Delete", selectedRow);
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
