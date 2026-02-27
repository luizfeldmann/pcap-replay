import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import type { ListGridOption } from "./useToggleListGrid";
import { Icons } from "../../utils/Icons";
import { useTranslation } from "react-i18next";

export const ToggleListGrid = (props: {
  value: ListGridOption;
  setValue(newState: ListGridOption): void;
}) => {
  const { t } = useTranslation();

  return (
    <ToggleButtonGroup
      value={props.value}
      onChange={(_, newValue) => props.setValue(newValue)}
      exclusive
    >
      <Tooltip title={t("app.general.viewlist")}>
        <ToggleButton value="list" aria-label="list">
          <Icons.List />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={t("app.general.viewgrid")}>
        <ToggleButton value="grid" aria-label="grid">
          <Icons.Grid />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};
