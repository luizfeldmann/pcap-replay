import {
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ReplayLengthLimits, type LengthSettings } from "shared";
import { Icons } from "../../utils/Icons";
import { useTranslation } from "react-i18next";
import type { ChangeEvent } from "react";

type LengthModes = "none" | LengthSettings["type"];

export const ReplayLengthEdit = (props: {
  value?: LengthSettings;
  onChange(value?: LengthSettings): void;
}) => {
  const { t } = useTranslation();

  // Decide the selected button from the settings
  const selected: LengthModes = props.value?.type || "none";

  // Set the new mode when clicking one of the toggle buttons
  const onChangeMode = (mode: LengthModes) => {
    if (mode === "none") props.onChange(undefined);
    else if (mode === "packets")
      props.onChange({ type: "packets", maxPackets: 1 });
    else if (mode === "duration")
      props.onChange({ type: "duration", maxDuration: 1 });
  };

  // Set the numerical limitation
  const onChangePackets = (e: ChangeEvent<HTMLInputElement>) =>
    props.onChange({
      type: "packets",
      maxPackets: Number(e.currentTarget.value),
    });

  const onChangeDuration = (e: ChangeEvent<HTMLInputElement>) =>
    props.onChange({
      type: "duration",
      maxDuration: Number(e.currentTarget.value),
    });

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
        <ToggleButton value={"packets"}>
          <Icons.Numbers sx={{ mr: 1 }} />
          {t("replays.form.limit.packets")}
        </ToggleButton>
        <ToggleButton value={"duration"}>
          <Icons.Duration sx={{ mr: 1 }} />
          {t("replays.form.limit.duration")}
        </ToggleButton>
      </ToggleButtonGroup>
      {props.value?.type === "packets" && (
        <TextField
          type="number"
          label={t("replays.form.limit.maxpackets")}
          slotProps={{
            htmlInput: {
              min: ReplayLengthLimits.packets.min,
            },
          }}
          value={props.value.maxPackets}
          onChange={onChangePackets}
        />
      )}
      {props.value?.type === "duration" && (
        <TextField
          type="number"
          label={t("replays.form.limit.maxduration")}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {t("replays.form.limit.durationunit")}
                </InputAdornment>
              ),
            },
            htmlInput: {
              min: ReplayLengthLimits.duration.min,
            },
          }}
          value={props.value.maxDuration}
          onChange={onChangeDuration}
        />
      )}
    </Stack>
  );
};
