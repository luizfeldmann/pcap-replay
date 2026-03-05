import {
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type { RepeatSettings } from "shared";
import { Icons } from "../../utils/Icons";
import { useTranslation } from "react-i18next";
import type { ChangeEvent } from "react";

type RepeatButtonValues = "none" | RepeatSettings["type"];

export const ReplayRepetitionEdit = (props: {
  value: RepeatSettings | null | undefined;
  onChange(value: RepeatSettings | null): void;
}) => {
  const { t } = useTranslation();

  // Decide the selected button from the settings type
  const selected: RepeatButtonValues = props.value?.type || "none";

  // Sets the repetion count on changes to the number edit
  const onChangeRepeatTimes = (e: ChangeEvent<HTMLInputElement>) =>
    props.onChange({
      type: "times",
      times: Number(e.currentTarget.value),
    });

  // Set the new mode when clicking one of the toggle buttons
  const onChangeMode = (mode: RepeatButtonValues) => {
    if (mode === "none") props.onChange(null);
    else if (mode === "loop") props.onChange({ type: "loop" });
    else if (mode === "times") props.onChange({ type: "times", times: 1 });
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
        <ToggleButton value="loop">
          <Icons.Infinity sx={{ mr: 1 }} />
          {t("replays.form.repeat.loop")}
        </ToggleButton>
        <ToggleButton value="times">
          <Icons.RepeatTimes sx={{ mr: 1 }} />
          {t("replays.form.repeat.times")}
        </ToggleButton>
      </ToggleButtonGroup>
      {props.value?.type === "times" && (
        <TextField
          type="number"
          label={t("replays.form.repeat.count")}
          slotProps={{ htmlInput: { min: 1 } }}
          value={props.value.times}
          onChange={onChangeRepeatTimes}
        />
      )}
    </Stack>
  );
};
