import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Icons } from "../../utils/Icons";
import { routes } from "../../utils/routes";
import type {
  FileContextActions,
  FileContextState,
} from "./useFileContextMenu";
import { endpoints } from "../../utils/endpoints";
import { Link } from "react-router-dom";

export const FileContextMenu = (props: {
  state: FileContextState;
  actions: FileContextActions;
}) => {
  const { t } = useTranslation();

  return (
    <Menu
      anchorReference="anchorPosition"
      anchorPosition={props.state.anchor}
      open={Boolean(props.state.anchor)}
      onClose={props.actions.onClose}
    >
      <MenuItem
        component={Link}
        to={routes.replaysCreatePage.location(props.state.selected?.id)}
      >
        <ListItemIcon>
          <Icons.FileAddToJob />
        </ListItemIcon>
        <ListItemText>{t("files.newreplay")}</ListItemText>
      </MenuItem>
      <MenuItem
        component={Link}
        target="_blank"
        download={props.state.selected?.name}
        to={endpoints.downloadFile.path(props.state.selected?.id || "")}
      >
        <ListItemIcon>
          <Icons.DownloadFile />
        </ListItemIcon>
        <ListItemText>{t("files.download")}</ListItemText>
      </MenuItem>
      <MenuItem onClick={props.actions.onRename}>
        <ListItemIcon>
          <Icons.Rename />
        </ListItemIcon>
        <ListItemText>{t("files.rename")}</ListItemText>
      </MenuItem>
      <MenuItem onClick={props.actions.onDelete}>
        <ListItemIcon>
          <Icons.Delete />
        </ListItemIcon>
        <ListItemText>{t("files.delete")}</ListItemText>
      </MenuItem>
    </Menu>
  );
};
