import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import type {
  ReplayContextMenuActions,
  ReplayContextMenuState,
} from "./useReplayContextMenu";
import { useTranslation } from "react-i18next";
import { Icons } from "../../utils/Icons";
import { ReplayCommandMenuItem } from "../ReplayCommand/ReplayCommandMenuItem";
import { Link } from "react-router-dom";

export type ReplayContextMenuButtons = "startstop" | "edit" | "logs" | "delete";

export const ReplayContextMenu = (props: {
  actions: ReplayContextMenuActions;
  state: ReplayContextMenuState;
  disableItems?: ReplayContextMenuButtons[];
}) => {
  const { t } = useTranslation();

  const isEditable = props.state.selected?.status !== "RUNNING";

  return (
    <Menu
      anchorEl={props.state.anchor}
      open={!!props.state.anchor}
      onClose={props.actions.onClose}
    >
      {props.state.selected && !props.disableItems?.includes("startstop") && (
        <ReplayCommandMenuItem
          replayId={props.state.selected.id}
          replayName={props.state.selected.name}
          currentStatus={props.state.selected.status}
          onSettled={props.actions.onClose}
        />
      )}
      {!props.disableItems?.includes("edit") && (
        <MenuItem
          component={Link}
          to={props.actions.getEditUrl()}
          disabled={!isEditable}
        >
          <ListItemIcon>
            <Icons.Edit />
          </ListItemIcon>
          <ListItemText>{t("replays.context.edit")}</ListItemText>
        </MenuItem>
      )}
      {!props.disableItems?.includes("logs") && (
        <MenuItem component={Link} to={props.actions.getLogsUrl()}>
          <ListItemIcon>
            <Icons.WatchLogs />
          </ListItemIcon>
          <ListItemText>{t("replays.context.logs")}</ListItemText>
        </MenuItem>
      )}
      {!props.disableItems?.includes("delete") && (
        <MenuItem onClick={props.actions.onDelete} disabled={!isEditable}>
          <ListItemIcon>
            <Icons.Delete />
          </ListItemIcon>
          <ListItemText>{t("replays.context.delete")}</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
};
