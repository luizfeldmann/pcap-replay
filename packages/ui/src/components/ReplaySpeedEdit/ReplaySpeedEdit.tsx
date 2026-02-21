import {
  InputAdornment,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Icons } from "../../utils/Icons";
import { useTranslation } from "react-i18next";
import { ReplayLoadLimits, type LoadSettings } from "shared";

//! Keys of the mode buttons
type SpeedModes = "none" | LoadSettings["type"];

//! Mapping of slider ranges for each mode
const rangeDefs: {
  [K in LoadSettings["type"]]: { min: number; max: number; step: number };
} = {
  multiplier: {
    min: ReplayLoadLimits.multiplier.min,
    max: ReplayLoadLimits.multiplier.max,
    step: 0.1,
  },
  mbps: {
    min: ReplayLoadLimits.mbps.min,
    max: ReplayLoadLimits.mbps.max,
    step: 0.1,
  },
  pps: {
    min: ReplayLoadLimits.pps.min,
    max: ReplayLoadLimits.pps.max,
    step: 1,
  },
};

// Rounds to given decimal places
const roundTo = (x: number, n: number = 2) => {
  const f = 10 ** n;
  return Math.round(x * f) / f;
};

export const ReplaySpeedEdit = (props: {
  value?: LoadSettings;
  onChange(value?: LoadSettings): void;
}) => {
  const { t } = useTranslation();

  // Decide the selected button
  const selected: SpeedModes = props.value?.type || "none";

  // Apply the value of each mode
  const onChangeMultiplier = (value: number) =>
    props.onChange({ type: "multiplier", speed: roundTo(value) });

  const onChangeDataRate = (value: number) =>
    props.onChange({ type: "mbps", dataRate: roundTo(value) });

  const onChangePacketRate = (value: number) =>
    props.onChange({ type: "pps", packetRate: roundTo(value) });

  // Change speed mode from button click
  const onChangeMode = (mode: SpeedModes) => {
    if (mode === "none") props.onChange(undefined);
    else if (mode === "multiplier") onChangeMultiplier(1);
    else if (mode === "pps") onChangePacketRate(1);
    else if (mode === "mbps") onChangeDataRate(1);
  };

  return (
    <Stack direction="column" spacing={2}>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={selected}
        onChange={(_, value) => onChangeMode(value)}
      >
        <ToggleButton value={"none"}>
          <Icons.Forbidden />
        </ToggleButton>
        <ToggleButton value={"multiplier"}>
          <Icons.SpeedMult sx={{ mr: 1 }} />
          {t("replays.form.speed.multipliershort")}
        </ToggleButton>
        <ToggleButton value={"mbps"}>
          <Icons.SpeedDataRate sx={{ mr: 1 }} />
          {t("replays.form.speed.datarateunit")}
        </ToggleButton>
        <ToggleButton value={"pps"}>
          <Icons.SpeedPackets sx={{ mr: 1 }} />
          {t("replays.form.speed.packetrateshort")}
        </ToggleButton>
      </ToggleButtonGroup>
      <Stack
        spacing={2}
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        {props.value?.type === "multiplier" && (
          <Slider
            {...rangeDefs["multiplier"]}
            value={props.value.speed}
            onChange={(_, v) => onChangeMultiplier(v)}
          />
        )}
        {props.value?.type === "multiplier" && (
          <TextField
            type="number"
            label={t("replays.form.speed.multiplier")}
            size="small"
            sx={{ minWidth: 140 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {t("replays.form.speed.multiplierunit")}
                  </InputAdornment>
                ),
              },
              htmlInput: rangeDefs["multiplier"],
            }}
            value={props.value.speed}
            onChange={(e) => onChangeMultiplier(Number(e.currentTarget.value))}
          />
        )}
        {props.value?.type === "mbps" && (
          <Slider
            {...rangeDefs["mbps"]}
            value={props.value.dataRate}
            onChange={(_, v) => onChangeDataRate(v)}
          />
        )}
        {props.value?.type === "mbps" && (
          <TextField
            type="number"
            label={t("replays.form.speed.datarate")}
            size="small"
            sx={{ minWidth: 140 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {t("replays.form.speed.datarateunit")}
                  </InputAdornment>
                ),
              },
              htmlInput: rangeDefs["mbps"],
            }}
            value={props.value.dataRate}
            onChange={(e) => onChangeDataRate(Number(e.currentTarget.value))}
          />
        )}
        {props.value?.type === "pps" && (
          <Slider
            {...rangeDefs["pps"]}
            value={props.value.packetRate}
            onChange={(_, v) => onChangePacketRate(v)}
          />
        )}
        {props.value?.type === "pps" && (
          <TextField
            type="number"
            label={t("replays.form.speed.packetrate")}
            size="small"
            sx={{ minWidth: 140 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {t("replays.form.speed.packetrateunit")}
                  </InputAdornment>
                ),
              },
              htmlInput: rangeDefs["pps"],
            }}
            value={props.value.packetRate}
            onChange={(e) => onChangePacketRate(Number(e.currentTarget.value))}
          />
        )}
      </Stack>
    </Stack>
  );
};
