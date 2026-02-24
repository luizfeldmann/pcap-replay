import type {
  AddressRemap,
  LengthSettings,
  LoadSettings,
  PortRemap,
  RepeatSettings,
  ReplayListItem,
} from "shared";
import type { ReplayColumnId } from "../ReplayColumnsFilter/useReplayColumnsFilter";
import { TableCell, TableRow } from "@mui/material";
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

const AddressRemapCell = (props: { value?: AddressRemap }) => (
  <>
    <TableCell>{props.value?.from}</TableCell>
    <TableCell>{props.value?.to}</TableCell>
  </>
);

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

// One row in the replays table
export const ReplayJobsTableRow = (props: {
  data: ReplayListItem;
  visibility: Record<ReplayColumnId, boolean>;
}) => {
  // Count number of rows needed for spanning
  const sourceremapRows =
    (props.visibility.sourceremap && props.data.srcRemap?.length) || 0;
  const destremapRows =
    (props.visibility.destremap && props.data.dstRemap?.length) || 0;
  const portremapRows =
    (props.visibility.portremap && props.data.portRemap?.length) || 0;

  const rowSpan = Math.max(1, sourceremapRows, destremapRows, portremapRows);

  return (
    <>
      {Array.from({ length: rowSpan }, (_, i) => (
        <TableRow key={i}>
          {i === 0 && props.visibility.name && (
            <TableCell rowSpan={rowSpan}>{props.data.name}</TableCell>
          )}
          {i === 0 && props.visibility.status && (
            <TableCell rowSpan={rowSpan}>
              <ReplayStatusChip value={props.data.status} />
            </TableCell>
          )}
          {i === 0 && props.visibility.createdTime && (
            <TableCell rowSpan={rowSpan}>
              <TimestampCell iso={props.data.createdTime} />
            </TableCell>
          )}
          {i === 0 && props.visibility.startedTime && (
            <TableCell rowSpan={rowSpan}>
              <TimestampCell iso={props.data.startTime} />
            </TableCell>
          )}
          {i === 0 && props.visibility.finishedTime && (
            <TableCell rowSpan={rowSpan}>
              <TimestampCell iso={props.data.endTime} />
            </TableCell>
          )}
          {i === 0 && props.visibility.interface && (
            <TableCell rowSpan={rowSpan}>{props.data.interface}</TableCell>
          )}
          {i === 0 && props.visibility.file && (
            <TableCell rowSpan={rowSpan}>{props.data.fileId}</TableCell>
          )}
          {i === 0 && props.visibility.repeat && (
            <TableCell rowSpan={rowSpan}>
              <RepeatCell value={props.data.repeat} />
            </TableCell>
          )}
          {i === 0 && props.visibility.speed && (
            <TableCell rowSpan={rowSpan}>
              <LoadCell value={props.data.load} />
            </TableCell>
          )}
          {i === 0 && props.visibility.length && (
            <TableCell rowSpan={rowSpan}>
              <LengthCell value={props.data.limit} />
            </TableCell>
          )}
          {props.visibility.sourceremap && (
            <AddressRemapCell value={props.data.srcRemap?.at(i)} />
          )}
          {props.visibility.destremap && (
            <AddressRemapCell value={props.data.dstRemap?.at(i)} />
          )}
          {props.visibility.portremap && (
            <PortRemapCell value={props.data.portRemap?.at(i)} />
          )}
        </TableRow>
      ))}
    </>
  );
};
