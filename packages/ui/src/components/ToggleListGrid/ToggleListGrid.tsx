import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { ListGridOption } from "./useToggleListGrid";
import { Icons } from "../../utils/Icons";

export const ToggleListGrid = (props: {
  value: ListGridOption;
  setValue(newState: ListGridOption): void;
}) => (
  <ToggleButtonGroup
    value={props.value}
    onChange={(_, newValue) => props.setValue(newValue)}
    exclusive
  >
    <ToggleButton value="list" aria-label="list">
      <Icons.List />
    </ToggleButton>
    <ToggleButton value="grid" aria-label="grid">
      <Icons.Grid />
    </ToggleButton>
  </ToggleButtonGroup>
);
