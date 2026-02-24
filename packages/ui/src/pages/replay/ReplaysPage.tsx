import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useToggleListGrid } from "../../components/ToggleListGrid/useToggleListGrid";
import { ToggleListGrid } from "../../components/ToggleListGrid/ToggleListGrid";
import { ReplayJobsList } from "../../components/ReplayJobs/ReplayJobsList";
import { ReplayJobsTable } from "../../components/ReplayJobs/ReplayJobsTable";
import { NewReplayButton } from "../../components/NewReplayButton/NewReplayButton";
import { ReplayColumnsFilterButton } from "../../components/ReplayColumnsFilter/ReplayColumnsFilterButton";
import { useReplayColumnFilter } from "../../components/ReplayColumnsFilter/useReplayColumnsFilter";

export const ReplaysPage = () => {
  const { t } = useTranslation();
  const [toggleValue, toggleSet] = useToggleListGrid();
  const columnsSelect = useReplayColumnFilter();

  return (
    <Stack
      spacing={1}
      sx={{ display: "flex", flexGrow: 1, position: "relative" }}
    >
      <Typography variant="h6">{t("nav.tabs.replays")}</Typography>
      <NewReplayButton />
      <Stack direction="row" gap={2}>
        <ToggleListGrid value={toggleValue} setValue={toggleSet} />
        <ReplayColumnsFilterButton
          visibility={columnsSelect.state}
          setVisibility={columnsSelect.setColumn}
        />
      </Stack>
      {toggleValue === "list" && <ReplayJobsList />}
      {toggleValue === "grid" && (
        <ReplayJobsTable visibility={columnsSelect.state} />
      )}
    </Stack>
  );
};
