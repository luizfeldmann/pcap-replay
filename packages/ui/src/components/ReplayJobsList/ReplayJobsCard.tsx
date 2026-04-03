import { useState } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Stack,
  Typography,
  Collapse,
  CardContent,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Box,
  Tooltip,
  TableBody,
  Chip,
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
import { hasSrcRemap, providerAttribs } from "../../utils/providers";

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
        flexGrow: 1,
        width: "fit-content",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        rowGap: 0.5,
        columnGap: 2,
      }}
    >
      <Typography color="text.secondary">
        {t("replays.table.createdtime")}
      </Typography>
      <ReplayDateTime iso={props.createdTime} />
      <Typography color="text.secondary">
        {t("replays.table.startedtime")}
      </Typography>
      <ReplayDateTime iso={props.startTime} />
      <Typography color="text.secondary">
        {t("replays.table.finishedtime")}
      </Typography>
      <ReplayDateTime iso={props.endTime} />
    </Box>
  );
};

// Settings for repeating, duration and speed
export const SettingsInfo = (props: {
  load: LoadSettings | null | undefined;
  length: LengthSettings | null | undefined;
  repeat: RepeatSettings | null | undefined;
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
        columnGap: 2,
      }}
    >
      <Typography color="text.secondary">
        {t("replays.table.repeat.label")}
      </Typography>
      <RepeatSettingsText value={props.repeat} />
      <Typography color="text.secondary">
        {t("replays.table.speed.label")}
      </Typography>
      <LoadSettingsText value={props.load} />
      <Typography color="text.secondary">
        {t("replays.table.length.label")}
      </Typography>
      <LengthSettingsText value={props.length} />
    </Box>
  );
};

export const SourceRemapTable = (props: { srcRemap?: AddressRemap[] }) => {
  const { t } = useTranslation();

  if (!props.srcRemap) return <></>;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            <Typography color="text.secondary">
              {t("replays.table.sourceremap.label")}
            </Typography>
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
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            <Typography color="text.secondary">
              {t("replays.table.destremap.label")}
            </Typography>
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
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            <Typography color="text.secondary">
              {t("replays.table.portremap.label")}
            </Typography>
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

  // Query the name of the used file
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
            {providerAttribs[props.data.settings.provider].interface
              .available && (
              <Stack direction="column">
                {t("replays.table.interface")}
                <Typography fontWeight="bold">
                  {props.data.settings.interface || t("replays.table.none")}
                </Typography>
              </Stack>
            )}
            <Stack direction="column">
              {t("replays.table.file")}
              <Typography fontWeight="bold">{fileInfo.data?.name}</Typography>
            </Stack>
            <Chip
              size="small"
              sx={{
                borderRadius: 1,
              }}
              label={props.data.settings.provider}
            />
            {props.data.settings.verbose && (
              <Tooltip title={t("replays.form.verbose")}>
                <Chip
                  size="small"
                  sx={{
                    borderRadius: 1,
                  }}
                  icon={<Icons.Verbose />}
                />
              </Tooltip>
            )}
          </Stack>
        }
        action={
          <Stack direction="column" gap={1} alignItems="end">
            <Stack direction="row" alignItems="center" gap={2}>
              <ReplayCommandButton
                size="small"
                replayId={props.data.id}
                replayName={props.data.name}
                currentStatus={props.data.status}
              />
              <IconButton
                size="small"
                onClick={(e) => props.onMore(e.currentTarget)}
              >
                <Icons.MoreContext />
              </IconButton>
            </Stack>
            <IconButton size="small" onClick={() => setExpanded((v) => !v)}>
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
        <CardContent
          component={Stack}
          direction="row"
          gap={4}
          alignItems="start"
        >
          <Box sx={{ flexGrow: 0 }}>
            <TimesInfo
              createdTime={props.data.createdTime}
              startTime={props.data.startTime}
              endTime={props.data.endTime}
            />
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <SettingsInfo
              load={props.data.settings.load}
              length={props.data.settings.limit}
              repeat={props.data.settings.repeat}
            />
          </Box>
          {hasSrcRemap(props.data.settings) && (
            <Box flexGrow={0}>
              <SourceRemapTable srcRemap={props.data.settings.srcRemap} />
            </Box>
          )}
          <Box flexGrow={0}>
            <DestRemapTable dstRemap={props.data.settings.dstRemap} />
          </Box>
          <Box flexGrow={0}>
            <PortRemapTable portRemap={props.data.settings.portRemap} />
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};
