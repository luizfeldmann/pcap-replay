import {
  Checkbox,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  foreachColumn,
  useColumnNames,
  type ReplayColumnId,
} from "./useReplayColumnsFilter";

const readOnlyItems: ReplayColumnId[] = ["name", "status"];

export const ReplayColumnsFilterMenu = (props: {
  anchor?: HTMLElement;
  close(): void;
  visibility: Record<ReplayColumnId, boolean>;
  setVisibility(id: ReplayColumnId, visible: boolean): void;
}) => {
  // Names of the columns
  const columns = useColumnNames();

  // Zip the name, visibility, label
  const state = foreachColumn((id) => ({
    id,
    label: columns[id],
    visible: props.visibility[id],
    disabled: readOnlyItems.includes(id),
  }));

  return (
    <Menu
      anchorEl={props.anchor}
      open={!!props.anchor}
      onClose={props.close}
      sx={{ "& .MuiPaper-root": { padding: 0 } }}
    >
      {Object.values(state).map((item) => (
        <MenuItem key={item.id} sx={{ py: 0.5, px: 1, minHeight: 0 }}>
          <ListItemIcon>
            <Checkbox
              size="small"
              disabled={item.disabled}
              checked={item.visible}
              onChange={(e, value) => {
                e.stopPropagation();
                props.setVisibility(item.id, value);
              }}
            />
          </ListItemIcon>
          <ListItemText>{item.label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};
