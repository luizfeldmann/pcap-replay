import type {
  AddressRemap,
  LengthSettings,
  LoadSettings,
  PortRemap,
  RepeatSettings,
  ReplayListItem,
} from "shared";
import type { ReplayColumnId } from "../ReplayColumnsFilter/useReplayColumnsFilter";
import { TableCell } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LocaleDateTime } from "../LocaleDateTime/LocaleDateTime";
import { ReplayStatusChip } from "../ReplayStatus/ReplayStatusChip";

// Text displayed in the repetitions setting cell
const RepeatCell = (props: { value?: RepeatSettings }) => {
  const { t } = useTranslation();
  if (props.value?.type === "loop") {
    return <>{t("replays.table.repeat.loop")}</>;
  } else if (props.value?.type === "times") {
    return <>{t("replays.table.repeat.times", { n: props.value.times })}</>;
  }
  return <></>;
};

// Text displayed in the load/speed settings cell
const LoadCell = (props: { value?: LoadSettings }) => {
  const { t } = useTranslation();
  if (props.value?.type === "multiplier") {
    return <>{t("replays.table.speed.multiplier", { x: props.value.speed })}</>;
  } else if (props.value?.type === "mbps") {
    return <>{t("replays.table.speed.mbps", { x: props.value.dataRate })}</>;
  } else if (props.value?.type === "pps") {
    return <>{t("replays.table.speed.pps", { x: props.value.packetRate })}</>;
  }
  return <></>;
};

// Text displayed in the limit/length cell
const LengthCell = (props: { value?: LengthSettings }) => {
  const { t } = useTranslation();
  if (props.value?.type === "duration") {
    return (
      <>{t("replays.table.length.duration", { x: props.value.maxDuration })}</>
    );
  } else if (props.value?.type === "packets") {
    return (
      <>{t("replays.table.length.packets", { x: props.value.maxPackets })}</>
    );
  }
  return <></>;
};

// Display text for the cells containing a date-time
const TimestampCell = (props: { iso?: string }) => {
  if (!props.iso) return <></>;
  return (
    <LocaleDateTime
      iso={props.iso}
      options={{
        dateStyle: "short",
        timeStyle: "short",
      }}
    />
  );
};

// Renders the to/from cells in the source or destination remap columns
const AddressRemapCell = (props: { value?: AddressRemap }) => (
  <>
    <TableCell>{props.value?.from}</TableCell>
    <TableCell>{props.value?.to}</TableCell>
  </>
);

// Renders the to/from port numbers in the port remap
const PortRemapCell = (props: { value?: PortRemap }) => (
  <>
    <TableCell>
      {typeof props.value?.from === "number" && props.value.from}
      {typeof props.value?.from === "object" &&
        `${props.value.from.start} - ${props.value.from.end}`}
    </TableCell>
    <TableCell>{props.value?.to}</TableCell>
  </>
);

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
              {props.data.fileId}
            </TableCell>
          )}
          {props.visibility.repeat && (
            <TableCell rowSpan={props.data.rowSpan}>
              <RepeatCell value={props.data.repeat} />
            </TableCell>
          )}
          {props.visibility.speed && (
            <TableCell rowSpan={props.data.rowSpan}>
              <LoadCell value={props.data.load} />
            </TableCell>
          )}
          {props.visibility.length && (
            <TableCell rowSpan={props.data.rowSpan}>
              <LengthCell value={props.data.limit} />
            </TableCell>
          )}
        </>
      )}
      {props.visibility.sourceremap && (
        <AddressRemapCell value={props.data.srcRemap} />
      )}
      {props.visibility.destremap && (
        <AddressRemapCell value={props.data.dstRemap} />
      )}
      {props.visibility.portremap && (
        <PortRemapCell value={props.data.portRemap} />
      )}
    </>
  );
};
