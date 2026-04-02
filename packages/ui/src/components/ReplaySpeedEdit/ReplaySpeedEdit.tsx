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
import {
  ReplayLoadLimits,
  type LoadSettings,
  type LoadSettingsType,
} from "shared";
import { useEffect, useMemo } from "react";

//! Keys of the mode buttons
type SpeedModes = "none" | LoadSettingsType;

//! Mapping of slider ranges for each mode
const rangeDefs: Record<
  LoadSettingsType,
  { min: number; max: number; step: number }
> = {
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

export const ReplaySpeedEdit = ({
  allowedTypes,
  value,
  onChange,
}: {
  allowedTypes: LoadSettingsType[];
  value: LoadSettings | null | undefined;
  onChange(value: LoadSettings | null): void;
}) => {
  const { t } = useTranslation();

  // Decide the selected button
  const selected: SpeedModes = value?.type || "none";

  // Memoize multiple callbacks
  const cb = useMemo(() => {
    // Apply the value of each mode
    const onChangeMultiplier = (value: number) =>
      onChange({ type: "multiplier", speed: roundTo(value) });

    const onChangeDataRate = (value: number) =>
      onChange({ type: "mbps", dataRate: roundTo(value) });

    const onChangePacketRate = (value: number) =>
      onChange({ type: "pps", packetRate: roundTo(value) });

    // Change speed mode from button click
    const onChangeMode = (mode: SpeedModes) => {
      if (mode === "none") onChange(null);
      else if (mode === "multiplier") onChangeMultiplier(1);
      else if (mode === "pps") onChangePacketRate(1);
      else if (mode === "mbps") onChangeDataRate(1);
    };

    return {
      onChangeMultiplier,
      onChangeDataRate,
      onChangePacketRate,
      onChangeMode,
    };
  }, [onChange]);

  // Reset the mode if changed to a type which is not allowed
  useEffect(() => {
    if (value && !allowedTypes.includes(value.type)) cb.onChangeMode("none");
  }, [allowedTypes, value, cb]);

  return (
    <Stack direction="column" spacing={2}>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={selected}
        onChange={(_, value) => cb.onChangeMode(value)}
      >
        <ToggleButton value={"none"}>
          <Icons.Forbidden />
        </ToggleButton>
        {allowedTypes.includes("multiplier") && (
          <ToggleButton value={"multiplier"}>
            <Icons.SpeedMult sx={{ mr: 1 }} />
            {t("replays.form.speed.multipliershort")}
          </ToggleButton>
        )}
        {allowedTypes.includes("mbps") && (
          <ToggleButton value={"mbps"}>
            <Icons.SpeedDataRate sx={{ mr: 1 }} />
            {t("replays.form.speed.datarateunit")}
          </ToggleButton>
        )}
        {allowedTypes.includes("pps") && (
          <ToggleButton value={"pps"}>
            <Icons.SpeedPackets sx={{ mr: 1 }} />
            {t("replays.form.speed.packetrateshort")}
          </ToggleButton>
        )}
      </ToggleButtonGroup>
      <Stack
        spacing={2}
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        {value?.type === "multiplier" && (
          <Slider
            {...rangeDefs["multiplier"]}
            value={value.speed}
            onChange={(_, v) => cb.onChangeMultiplier(v)}
          />
        )}
        {value?.type === "multiplier" && (
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
            value={value.speed}
            onChange={(e) =>
              cb.onChangeMultiplier(Number(e.currentTarget.value))
            }
          />
        )}
        {value?.type === "mbps" && (
          <Slider
            {...rangeDefs["mbps"]}
            value={value.dataRate}
            onChange={(_, v) => cb.onChangeDataRate(v)}
          />
        )}
        {value?.type === "mbps" && (
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
            value={value.dataRate}
            onChange={(e) => cb.onChangeDataRate(Number(e.currentTarget.value))}
          />
        )}
        {value?.type === "pps" && (
          <Slider
            {...rangeDefs["pps"]}
            value={value.packetRate}
            onChange={(_, v) => cb.onChangePacketRate(v)}
          />
        )}
        {value?.type === "pps" && (
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
            value={value.packetRate}
            onChange={(e) =>
              cb.onChangePacketRate(Number(e.currentTarget.value))
            }
          />
        )}
      </Stack>
    </Stack>
  );
};
