import {
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import { useReplaysList } from "../../api/replays/useReplaysList";
import { useTranslation } from "react-i18next";
import { TableVirtuoso } from "react-virtuoso";
import { Icons } from "../../utils/Icons";
import { TableCellHeader } from "./ReplayJobsTable.styles";
import {
  useColumnNames,
  type ReplayColumnId,
} from "../ReplayColumnsFilter/useReplayColumnsFilter";
import {
  ReplayJobsTableRow,
  type ReplayJobTablePrimaryRow,
  type ReplayJobTableSecondaryRow,
} from "./ReplayJobsTableRow";
import { useMemo } from "react";
import { useReplayContextMenu } from "../ReplayContextMenu/useReplayContextMenu";
import { ReplayContextMenu } from "../ReplayContextMenu/ReplayContextMenu";

export const ReplayJobsTable = (props: {
  visibility: Record<ReplayColumnId, boolean>;
}) => {
  const { t } = useTranslation();
  const columnNames = useColumnNames();

  // Query the items from API
  const jobs = useReplaysList();

  // Single context menu for all items
  const { open: openContextMenu, ...contextMenu } = useReplayContextMenu();

  // Flatten the pages into a single list
  const data = useMemo(
    () =>
      jobs.data?.pages
        .flatMap((p) => p.items)
        .flatMap((item) => {
          // Count number of rows needed for spanning
          const srcRows =
            (props.visibility.sourceremap && item.srcRemap?.length) || 0;
          const destRows =
            (props.visibility.destremap && item.dstRemap?.length) || 0;
          const portRows =
            (props.visibility.portremap && item.portRemap?.length) || 0;
          const rowSpan = Math.max(1, srcRows, destRows, portRows);

          // Produce primary and secondary rows
          return Array.from({ length: rowSpan }, (_, i) => {
            const common = {
              key: `${item.id}-${i}`,
              srcRemap: item.srcRemap?.at(i),
              dstRemap: item.dstRemap?.at(i),
              portRemap: item.portRemap?.at(i),
            };

            return i == 0
              ? ({
                  rowSpan,
                  type: "primary",
                  onMore: (e) =>
                    openContextMenu(
                      item.id,
                      item.name,
                      item.status,
                      e.currentTarget,
                    ),
                  ...item,
                  ...common,
                } satisfies ReplayJobTablePrimaryRow)
              : ({
                  type: "secondary",
                  ...common,
                } satisfies ReplayJobTableSecondaryRow);
          });
        }),
    [jobs.data?.pages, props.visibility, openContextMenu],
  );

  // Decide spanning layout from visibility
  const isHeaderMultiRow =
    props.visibility.sourceremap ||
    props.visibility.destremap ||
    props.visibility.portremap;
  const rowSpan = isHeaderMultiRow ? 2 : 1;

  // Replace table with error if failed to fetch
  if (jobs.isError) return <Alert severity="error">{jobs.error.message}</Alert>;

  // Show the actual table
  return (
    <>
      {jobs.isLoading && <LinearProgress />}
      <ReplayContextMenu
        actions={contextMenu.actions}
        state={contextMenu.state}
      />
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
              {props.visibility.name && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.Name />
                  {columnNames.name}
                </TableCellHeader>
              )}
              {props.visibility.status && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.Status />
                  {columnNames.status}
                </TableCellHeader>
              )}
              {props.visibility.createdTime && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.Created />
                  {columnNames.createdTime}
                </TableCellHeader>
              )}
              {props.visibility.startedTime && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.Started />
                  {columnNames.startedTime}
                </TableCellHeader>
              )}
              {props.visibility.finishedTime && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.Finished />
                  {columnNames.finishedTime}
                </TableCellHeader>
              )}
              {props.visibility.interface && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.Network />
                  {columnNames.interface}
                </TableCellHeader>
              )}
              {props.visibility.file && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.FileItem />
                  {columnNames.file}
                </TableCellHeader>
              )}
              {props.visibility.repeat && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.Loop />
                  {columnNames.repeat}
                </TableCellHeader>
              )}
              {props.visibility.speed && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.Speed />
                  {columnNames.speed}
                </TableCellHeader>
              )}
              {props.visibility.length && (
                <TableCellHeader rowSpan={rowSpan}>
                  <Icons.LoadLimit />
                  {columnNames.length}
                </TableCellHeader>
              )}
              {props.visibility.sourceremap && (
                <TableCellHeader colSpan={2}>
                  <Icons.Source />
                  {columnNames.sourceremap}
                </TableCellHeader>
              )}
              {props.visibility.destremap && (
                <TableCellHeader colSpan={2}>
                  <Icons.Destination />
                  {columnNames.destremap}
                </TableCellHeader>
              )}
              {props.visibility.portremap && (
                <TableCellHeader colSpan={2}>
                  <Icons.PortRemap />
                  {columnNames.portremap}
                </TableCellHeader>
              )}
              <TableCellHeader rowSpan={rowSpan} sx={{ width: 64 }}>
                {/** Actions button column */}
              </TableCellHeader>
            </TableRow>
            {isHeaderMultiRow && (
              <TableRow>
                {props.visibility.sourceremap && (
                  <>
                    <TableCellHeader>
                      {t("replays.table.sourceremap.from")}
                    </TableCellHeader>
                    <TableCellHeader>
                      {t("replays.table.sourceremap.to")}
                    </TableCellHeader>
                  </>
                )}
                {props.visibility.destremap && (
                  <>
                    <TableCellHeader>
                      {t("replays.table.destremap.from")}
                    </TableCellHeader>
                    <TableCellHeader>
                      {t("replays.table.destremap.to")}
                    </TableCellHeader>
                  </>
                )}
                {props.visibility.portremap && (
                  <>
                    <TableCellHeader>
                      {t("replays.table.portremap.from")}
                    </TableCellHeader>
                    <TableCellHeader>
                      {t("replays.table.portremap.to")}
                    </TableCellHeader>
                  </>
                )}
              </TableRow>
            )}
          </>
        )}
        itemContent={(_, data) => (
          <ReplayJobsTableRow
            key={data.key}
            data={data}
            visibility={props.visibility}
          />
        )}
      />
    </>
  );
};
