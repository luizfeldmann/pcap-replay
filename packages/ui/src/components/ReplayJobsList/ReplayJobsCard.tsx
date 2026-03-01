import { useState } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Stack,
  Typography,
  CardActionArea,
  Collapse,
  CardContent,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Box,
  Tooltip,
  TableBody,
} from "@mui/material";
import type {
  AddressRemap,
  LengthSettings,
  LoadSettings,
  PortRemap,
  RepeatSettings,
  ReplayListItem,
} from "shared";
import { StatusStyles } from "../ReplayStatus/ReplayStatusStyles";
import { Icons } from "../../utils/Icons";
import { useTranslation } from "react-i18next";
import { useSingleFile } from "../../api/files/useSingleFile";
import { ReplayCommandButton } from "../ReplayCommand/ReplayCommandButton";
import { ReplayDateTime } from "./ReplayJobsCard.style";
import { RepeatSettingsText } from "../ReplayJobsTable/RepeatSettingsText";
import { LengthSettingsText } from "../ReplayJobsTable/LengthSettingsText";
import { LoadSettingsText } from "../ReplayJobsTable/LoadSettingsText";
import { AddressRemapCells } from "../ReplayJobsTable/AddressRemapCells";
import { PortRemapCells } from "../ReplayJobsTable/PortRemapCells";

// Renders creation, start and finish times
const TimesInfo = (props: {
  createdTime: string;
  startTime?: string;
  endTime?: string;
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        rowGap: 0.5,
        columnGap: 1,
      }}
    >
      {t("replays.table.createdtime")}
      <ReplayDateTime iso={props.createdTime} />
      {t("replays.table.startedtime")}
      <ReplayDateTime iso={props.startTime} />
      {t("replays.table.finishedtime")}
      <ReplayDateTime iso={props.endTime} />
    </Box>
  );
};

// Settings for repeating, duration and speed
export const SettingsInfo = (props: {
  load?: LoadSettings;
  length?: LengthSettings;
  repeat?: RepeatSettings;
}) => {
  const { t } = useTranslation();

  // If no settings, return nothing
  if (!props.load && !props.length && !props.repeat) return <></>;

  // Return table
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        rowGap: 0.5,
        columnGap: 1,
      }}
    >
      {t("replays.table.repeat.label")}
      <RepeatSettingsText value={props.repeat} />
      {t("replays.table.speed.label")}
      <LoadSettingsText value={props.load} />
      {t("replays.table.length.label")}
      <LengthSettingsText value={props.length} />
    </Box>
  );
};

export const SourceRemapTable = (props: { srcRemap?: AddressRemap[] }) => {
  const { t } = useTranslation();

  if (!props.srcRemap) return <></>;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            {t("replays.table.sourceremap.label")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("replays.table.sourceremap.from")}</TableCell>
          <TableCell>{t("replays.table.sourceremap.to")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.srcRemap.map((item, i) => (
          <TableRow>
            <AddressRemapCells key={i} value={item} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const DestRemapTable = (props: { dstRemap?: AddressRemap[] }) => {
  const { t } = useTranslation();

  if (!props.dstRemap) return <></>;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            {t("replays.table.destremap.label")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("replays.table.destremap.from")}</TableCell>
          <TableCell>{t("replays.table.destremap.to")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.dstRemap.map((item, i) => (
          <TableRow>
            <AddressRemapCells key={i} value={item} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const PortRemapTable = (props: { portRemap?: PortRemap[] }) => {
  const { t } = useTranslation();

  if (!props.portRemap) return <></>;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            {t("replays.table.portremap.label")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("replays.table.portremap.from")}</TableCell>
          <TableCell>{t("replays.table.portremap.to")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.portRemap.map((item, i) => (
          <TableRow>
            <PortRemapCells key={i} value={item} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const ReplayJobsCard = (props: {
  data: ReplayListItem;
  onMore(anchor: HTMLElement): void;
}) => {
  const { t } = useTranslation();

  // Handle expander icon
  const [expanded, setExpanded] = useState(false);

  // Query dname of the used file
  const fileInfo = useSingleFile({
    id: props.data.fileId,
    refetchOnMount: false,
  });

  // Get status for the avatar
  const statusStyle = StatusStyles[props.data.status];

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography fontWeight="bold">{props.data.name}</Typography>}
        avatar={
          <Tooltip title={t(statusStyle.label)}>
            <Avatar sx={{ backgroundColor: statusStyle.color }}>
              <statusStyle.icon />
            </Avatar>
          </Tooltip>
        }
        subheader={
          <Stack direction="row" spacing={2}>
            <Stack direction="column">
              <Typography fontWeight="bold">
                {t("replays.table.interface")}
              </Typography>
              {props.data.interface}
            </Stack>
            <Stack direction="column">
              <Typography fontWeight="bold">
                {t("replays.table.file")}
              </Typography>
              {fileInfo.data?.name}
            </Stack>
          </Stack>
        }
        action={
          <Stack>
            <IconButton onClick={(e) => props.onMore(e.currentTarget)}>
              <Icons.MoreContext />
            </IconButton>
            <IconButton onClick={() => setExpanded((v) => !v)}>
              <Icons.ExpandChevron
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            </IconButton>
          </Stack>
        }
      />
      <Collapse in={expanded}>
        <CardContent component={Stack} direction="row" gap={2}>
          <TimesInfo
            createdTime={props.data.createdTime}
            startTime={props.data.startTime}
            endTime={props.data.endTime}
          />
          <SettingsInfo
            load={props.data.load}
            length={props.data.limit}
            repeat={props.data.repeat}
          />
          <SourceRemapTable srcRemap={props.data.srcRemap} />
          <DestRemapTable dstRemap={props.data.dstRemap} />
          <PortRemapTable portRemap={props.data.portRemap} />
        </CardContent>
      </Collapse>
      <CardActionArea>
        <ReplayCommandButton
          sx={{ m: 2 }}
          size="small"
          currentStatus={props.data.status}
          onClick={() => {}}
        />
      </CardActionArea>
    </Card>
  );
};
