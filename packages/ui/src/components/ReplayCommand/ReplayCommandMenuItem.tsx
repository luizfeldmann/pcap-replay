import {
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { JobCommand, ReplayStatus } from "shared";
import { ReplayCommandTransitions } from "./ReplayCommandTransitions";
import { ReplayCommandStyles } from "./ReplayCommandStyles";

export type ReplayCommandMenuItemProps = Omit<MenuItemProps, "onClick"> & {
  currentStatus: ReplayStatus;
  isLoading?: boolean;
  onClick(command: JobCommand): void;
};

export const ReplayCommandMenuItem = ({
  currentStatus,
  isLoading,
  onClick,
  disabled,
  ...props
}: ReplayCommandMenuItemProps) => {
  const { t } = useTranslation();
  const command = ReplayCommandTransitions[currentStatus];
  const style = ReplayCommandStyles[command];

  return (
    <MenuItem
      {...props}
      disabled={disabled || isLoading}
      onClick={() => onClick(command)}
    >
      <ListItemIcon>
        {isLoading ? <CircularProgress size="small" /> : <style.icon />}
      </ListItemIcon>
      <ListItemText>{t(style.label)}</ListItemText>
    </MenuItem>
  );
};
