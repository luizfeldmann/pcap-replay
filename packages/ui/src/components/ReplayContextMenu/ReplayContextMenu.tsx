import {
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import type {
  ReplayContextMenuActions,
  ReplayContextMenuState,
} from "./useReplayContextMenu";
import { useTranslation } from "react-i18next";
import { Icons } from "../../utils/Icons";
import { ReplayCommandMenuItem } from "../ReplayCommand/ReplayCommandMenuItem";

export const ReplayContextMenu = (props: {
  actions: ReplayContextMenuActions;
  state: ReplayContextMenuState;
}) => {
  const { t } = useTranslation();

  const isEditable = props.state.selected?.status !== "RUNNING";

  return (
    <Menu
      anchorEl={props.state.anchor}
      open={!!props.state.anchor}
      onClose={props.actions.onClose}
    >
      {props.state.selected && (
        <ReplayCommandMenuItem
          currentStatus={props.state.selected.status}
          onClick={props.actions.onCommand}
        />
      )}
      <MenuItem
        component={Link}
        underline="none"
        href={props.actions.getEditUrl()}
        disabled={!isEditable}
      >
        <ListItemIcon>
          <Icons.Edit />
        </ListItemIcon>
        <ListItemText>{t("replays.context.edit")}</ListItemText>
      </MenuItem>
      <MenuItem onClick={props.actions.onDelete} disabled={!isEditable}>
        <ListItemIcon>
          <Icons.Delete />
        </ListItemIcon>
        <ListItemText>{t("replays.context.delete")}</ListItemText>
      </MenuItem>
    </Menu>
  );
};
