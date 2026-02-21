import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  type PopoverPosition,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Icons } from "../../utils/Icons";

export const FileContextMenu = (props: {
  anchor?: PopoverPosition;
  onClose(): void;
  onRename(): void;
  onDelete(): void;
}) => {
  const { t } = useTranslation();

  return (
    <Menu
      anchorReference="anchorPosition"
      anchorPosition={props.anchor}
      open={Boolean(props?.anchor)}
      onClose={props.onClose}
    >
      <MenuItem onClick={props.onRename}>
        <ListItemIcon>
          <Icons.Rename />
        </ListItemIcon>
        <ListItemText>{t("files.rename")}</ListItemText>
      </MenuItem>
      <MenuItem onClick={props.onDelete}>
        <ListItemIcon>
          <Icons.Delete />
        </ListItemIcon>
        <ListItemText>{t("files.delete")}</ListItemText>
      </MenuItem>
    </Menu>
  );
};
