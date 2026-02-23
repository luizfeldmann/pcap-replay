import { Alert, Table, TableBody, TableHead, TableRow } from "@mui/material";
import { useReplaysList } from "../../api/replays/useReplaysList";
import { useTranslation } from "react-i18next";
import { TableVirtuoso } from "react-virtuoso";
import { Icons } from "../../utils/Icons";
import { TableCellHeader } from "./ReplayJobsTable.styles";

export const ReplayJobsTable = () => {
  const { t } = useTranslation();
  const jobs = useReplaysList();

  // Flatten the pages into a single list
  const data = jobs.data?.pages.flatMap((p) => p.items);

  // Replace table with error if failed to fetch
  if (jobs.isError) return <Alert severity="error">{jobs.error.message}</Alert>;

  // Show the actual table
  return (
    <TableVirtuoso
      data={data}
      endReached={() => jobs.hasNextPage && void jobs.fetchNextPage()}
      components={{
        Table: Table,
        TableHead: TableHead,
        TableBody: TableBody,
      }}
      fixedHeaderContent={() => (
        <>
          <TableRow>
            <TableCellHeader rowSpan={2}>
              <Icons.Name />
              {t("replays.table.name")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.Status />
              {t("replays.table.status")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.Created />
              {t("replays.table.createdtime")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.Started />
              {t("replays.table.startedtime")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.Finished />
              {t("replays.table.finishedtime")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.Network />
              {t("replays.table.interface")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.FileItem />
              {t("replays.table.file")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.Loop />
              {t("replays.table.repeat.label")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.Speed />
              {t("replays.table.speed.label")}
            </TableCellHeader>
            <TableCellHeader rowSpan={2}>
              <Icons.LoadLimit />
              {t("replays.table.length.label")}
            </TableCellHeader>
            <TableCellHeader colSpan={2}>
              <Icons.Source />
              {t("replays.table.sourceremap.label")}
            </TableCellHeader>
            <TableCellHeader colSpan={2}>
              <Icons.Destination />
              {t("replays.table.destremap.label")}
            </TableCellHeader>
            <TableCellHeader colSpan={2}>
              <Icons.PortRemap />
              {t("replays.table.portremap.label")}
            </TableCellHeader>
          </TableRow>
          <TableRow>
            <TableCellHeader>
              {t("replays.table.sourceremap.from")}
            </TableCellHeader>
            <TableCellHeader>
              {t("replays.table.sourceremap.to")}
            </TableCellHeader>
            <TableCellHeader>
              {t("replays.table.destremap.from")}
            </TableCellHeader>
            <TableCellHeader>{t("replays.table.destremap.to")}</TableCellHeader>
            <TableCellHeader>
              {t("replays.table.portremap.from")}
            </TableCellHeader>
            <TableCellHeader>{t("replays.table.portremap.to")}</TableCellHeader>
          </TableRow>
        </>
      )}
    />
  );
};
