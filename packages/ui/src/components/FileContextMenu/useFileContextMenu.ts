import type { PopoverPosition } from "@mui/material";
import { useState } from "react";
import { useDeleteFile } from "../../api/files/useDeleteFile";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export type FileContextSelection = {
  id: string;
  name: string;
};

export type FileContextState = {
  selected?: FileContextSelection;
  anchor?: PopoverPosition;
};

export type FileContextActions = {
  onClose(): void;
  onRename(): void;
  onDelete(): void;
};

export const useFileContextMenu = () => {
  const { t } = useTranslation();
  // Mutation to delete the file
  const fileDeletion = useDeleteFile();

  // Stores location where the context was opened and the associated file
  const [state, setState] = useState<FileContextState>({});

  // Stores the file being renamed
  const [renameFile, setRenameFile] = useState<
    FileContextSelection | undefined
  >(undefined);

  // Opens the context menu when the file is clicked
  const onOpen = (
    event: React.MouseEvent<HTMLElement>,
    row: FileContextSelection,
  ) =>
    setState({
      anchor: { left: event.clientX, top: event.clientY },
      selected: row,
    });

  // Closes the context menu
  const onClose = () => setState({});

  //! Callback to delete a file
  const onDelete = () => {
    // Close the context
    onClose();
    // Sanity
    if (!state.selected) return;

    // Invoke API
    fileDeletion.mutate(state.selected, {
      // Show error message
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
      // Show success message
      onSuccess: (_data, variables) => {
        enqueueSnackbar(t("files.success.delete", { name: variables.name }), {
          variant: "success",
        });
      },
    });
  };

  // Sets this file as being renamed
  const onRename = () => {
    setRenameFile(state.selected);
    onClose();
  };

  // Close the file renaming
  const onCloseRename = () => {
    setRenameFile(undefined);
  };

  return {
    // Passed to the parent to open the context on a given file
    onOpen,
    // Passed to the menu for rendering of the action buttons
    state,
    actions: {
      onClose,
      onRename,
      onDelete,
    } satisfies FileContextActions,
    // Passed to the renaming dialog
    fileRename: {
      file: renameFile,
      close: onCloseRename,
    },
  };
};
