import { useCallback, useState } from "react";
import { routes } from "../../utils/routes";
import type { ReplayStatus } from "shared";
import { useDeleteReplay } from "../../api/replays/useDeleteReplay";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";

export type ReplayContextMenuState = {
  selected?: {
    id: string;
    name: string;
    status: ReplayStatus;
  };
  anchor?: HTMLElement;
};

export type ReplayContextMenuActions = {
  onClose(): void;
  onDelete(): void;
  getEditUrl(): string;
};

export const useReplayContextMenu = () => {
  const { t } = useTranslation();

  // Stores selection and anchor element
  const [state, setState] = useState<ReplayContextMenuState>({});

  // Callback to open the context menu on the selected item
  const open = useCallback(
    (id: string, name: string, status: ReplayStatus, anchor: HTMLElement) =>
      setState({ selected: { id, name, status }, anchor }),
    [setState],
  );

  // To close the menu and clear the selection
  const onClose = () => setState({});

  // Delete the replay
  const deleteApi = useDeleteReplay();
  const onDelete = () => {
    // Sanity check
    if (!state.selected) return;

    // Invoke API
    deleteApi.mutate(
      { id: state.selected.id, name: state.selected.name },
      {
        onSuccess: (_, variables) =>
          enqueueSnackbar(
            t("replays.success.delete", {
              name: variables.name,
            }),
            {
              variant: "success",
            },
          ),
        onError: (error, variables) =>
          enqueueSnackbar(
            t("replays.error.delete", {
              name: variables.name,
              message: error.message,
            }),
            {
              variant: "error",
            },
          ),
      },
    );

    // Close menu on click
    onClose();
  };

  return {
    open,
    state,
    actions: {
      getEditUrl: () =>
        routes.replaysEditPage.location(state.selected?.id ?? ""),
      onDelete,
      onClose,
    } satisfies ReplayContextMenuActions,
  };
};
