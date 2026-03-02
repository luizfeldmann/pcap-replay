import { useCallback, useState } from "react";
import { routes } from "../../utils/routes";
import type { JobCommand, ReplayStatus } from "shared";

export type ReplayContextMenuState = {
  selected?: {
    id: string;
    name: string;
    status: ReplayStatus;
  };
  anchor?: HTMLElement;
};

export type ReplayContextMenuActions = {
  onCommand(command: JobCommand): void;
  onClose(): void;
  onDelete(): void;
  getEditUrl(): string;
};

export const useReplayContextMenu = () => {
  const [state, setState] = useState<ReplayContextMenuState>({});

  const open = useCallback(
    (id: string, name: string, status: ReplayStatus, anchor: HTMLElement) =>
      setState({ selected: { id, name, status }, anchor }),
    [setState],
  );

  return {
    open,
    state,
    actions: {
      onCommand: () => {},
      getEditUrl: () =>
        routes.replaysEditPage.location(state.selected?.id ?? ""),
      onDelete: () => {},
      onClose: () => setState({}),
    } satisfies ReplayContextMenuActions,
  };
};
