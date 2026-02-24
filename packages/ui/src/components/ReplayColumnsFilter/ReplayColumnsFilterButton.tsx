import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Icons } from "../../utils/Icons";
import { useState } from "react";
import { ReplayColumnsFilterMenu } from "./ReplayColumnsFilterMenu";
import type { ReplayColumnId } from "./useReplayColumnsFilter";

export const ReplayColumnsFilterButton = (props: {
  visibility: Record<ReplayColumnId, boolean>;
  setVisibility(id: ReplayColumnId, visible: boolean): void;
}) => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement>();
  return (
    <>
      <Tooltip title={t("replays.table.selectcolumns")}>
        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
          <Icons.SelectColumn />
        </IconButton>
      </Tooltip>
      <ReplayColumnsFilterMenu
        anchor={anchor}
        close={() => setAnchor(undefined)}
        visibility={props.visibility}
        setVisibility={props.setVisibility}
      />
    </>
  );
};
