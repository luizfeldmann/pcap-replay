import type { AddressRemap, PortRemap, ReplayListItem } from "shared";
import type { ReplayColumnId } from "../ReplayColumnsFilter/useReplayColumnsFilter";
import { CircularProgress, TableCell } from "@mui/material";
import { ReplayStatusChip } from "../ReplayStatus/ReplayStatusChip";
import { useSingleFile } from "../../api/files/useSingleFile";
import { Icons } from "../../utils/Icons";
import { TimestampCell } from "./ReplayJobsTableRow.styles";
import { RepeatSettingsText } from "./RepeatSettingsText";
import { LoadSettingsText } from "./LoadSettingsText";
import { LengthSettingsText } from "./LengthSettingsText";
import { AddressRemapCells } from "./AddressRemapCells";
import { PortRemapCells } from "./PortRemapCells";

// Renders the file name and link
const FileCell = (props: { id: string }) => {
  const query = useSingleFile({ id: props.id, refetchOnMount: false });
  if (query.isLoading) return <CircularProgress size="small" />;
  else if (query.isError) return <Icons.StatusError />;
  return <>{query.data?.name}</>;
};

// Data present in both primary and secondary rows
type RowCommon = {
  srcRemap?: AddressRemap;
  dstRemap?: AddressRemap;
  portRemap?: PortRemap;
};

// Row containing the full replay job item
export type ReplayJobTablePrimaryRow = {
  type: "primary";
  rowSpan: number;
} & Omit<ReplayListItem, "srcRemap" | "dstRemap" | "portRemap"> &
  RowCommon;

// Row containing only extra list items where the main cells where merged
export type ReplayJobTableSecondaryRow = {
  type: "secondary";
} & RowCommon;

//! Data regarding one row of the table
export type ReplayJobTableRowData =
  | ReplayJobTablePrimaryRow
  | ReplayJobTableSecondaryRow;

// One row in the replays table
export const ReplayJobsTableRow = (props: {
  data: ReplayJobTableRowData;
  visibility: Record<ReplayColumnId, boolean>;
}) => {
  return (
    <>
      {props.data.type === "primary" && (
        <>
          {props.visibility.name && (
            <TableCell rowSpan={props.data.rowSpan}>
              {props.data.name}
            </TableCell>
          )}
          {props.visibility.status && (
            <TableCell rowSpan={props.data.rowSpan}>
              <ReplayStatusChip value={props.data.status} />
            </TableCell>
          )}
          {props.visibility.createdTime && (
            <TableCell rowSpan={props.data.rowSpan}>
              <TimestampCell iso={props.data.createdTime} />
            </TableCell>
          )}
          {props.visibility.startedTime && (
            <TableCell rowSpan={props.data.rowSpan}>
              <TimestampCell iso={props.data.startTime} />
            </TableCell>
          )}
          {props.visibility.finishedTime && (
            <TableCell rowSpan={props.data.rowSpan}>
              <TimestampCell iso={props.data.endTime} />
            </TableCell>
          )}
          {props.visibility.interface && (
            <TableCell rowSpan={props.data.rowSpan}>
              {props.data.interface}
            </TableCell>
          )}
          {props.visibility.file && (
            <TableCell rowSpan={props.data.rowSpan}>
              <FileCell id={props.data.fileId} />
            </TableCell>
          )}
          {props.visibility.repeat && (
            <TableCell rowSpan={props.data.rowSpan}>
              <RepeatSettingsText value={props.data.repeat} />
            </TableCell>
          )}
          {props.visibility.speed && (
            <TableCell rowSpan={props.data.rowSpan}>
              <LoadSettingsText value={props.data.load} />
            </TableCell>
          )}
          {props.visibility.length && (
            <TableCell rowSpan={props.data.rowSpan}>
              <LengthSettingsText value={props.data.limit} />
            </TableCell>
          )}
        </>
      )}
      {props.visibility.sourceremap && (
        <AddressRemapCells value={props.data.srcRemap} />
      )}
      {props.visibility.destremap && (
        <AddressRemapCells value={props.data.dstRemap} />
      )}
      {props.visibility.portremap && (
        <PortRemapCells value={props.data.portRemap} />
      )}
    </>
  );
};
