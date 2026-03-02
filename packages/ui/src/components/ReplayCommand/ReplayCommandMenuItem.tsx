import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ReplayStatus } from "shared";
import { ReplayCommandTransitions } from "./ReplayCommandTransitions";
import { ReplayCommandStyles } from "./ReplayCommandStyles";
import { useReplayCommandWithSnack } from "./useReplayCommandWithSnack";

export type ReplayCommandMenuItemProps = Omit<MenuItemProps, "onClick"> & {
  replayId: string;
  replayName: string;
  currentStatus: ReplayStatus;
  onSettled(): void;
};

export const ReplayCommandMenuItem = ({
  replayId,
  replayName,
  currentStatus,
  disabled,
  onSettled,
  ...props
}: ReplayCommandMenuItemProps) => {
  const { t } = useTranslation();

  // Api invokation
  const mutation = useReplayCommandWithSnack(replayId);

  // Use the current state to find the transition command
  const command = ReplayCommandTransitions[currentStatus];
  const style = ReplayCommandStyles[command];

  return (
    <MenuItem
      {...props}
      disabled={disabled || mutation.isMutating > 0}
      onClick={() => {
        mutation.mutate({ name: replayName, command }, onSettled);
      }}
    >
      <ListItemIcon>
        <style.icon />
      </ListItemIcon>
      <ListItemText>{t(style.label)}</ListItemText>
    </MenuItem>
  );
};
