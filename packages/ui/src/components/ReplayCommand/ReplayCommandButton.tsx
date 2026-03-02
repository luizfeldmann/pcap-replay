import type { ReplayStatus } from "shared";
import { ReplayCommandTransitions } from "./ReplayCommandTransitions";
import { ReplayCommandStyles } from "./ReplayCommandStyles";
import { Button, type ButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useReplayCommandWithSnack } from "./useReplayCommandWithSnack";

export type ReplayCommandButtonProps = Omit<ButtonProps, "onClick"> & {
  replayId: string;
  replayName: string;
  currentStatus: ReplayStatus;
};

export const ReplayCommandButton = ({
  replayId,
  replayName,
  currentStatus,
  disabled,
  ...props
}: ReplayCommandButtonProps) => {
  const { t } = useTranslation();

  // Api invokation
  const mutation = useReplayCommandWithSnack(replayId);

  // Use the current state to find the transition command
  const command = ReplayCommandTransitions[currentStatus];
  const style = ReplayCommandStyles[command];

  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        ...props.sx,
        color: "white",
        backgroundColor: style.color,
      }}
      disabled={disabled || mutation.isMutating > 0}
      startIcon={<style.icon />}
      onClick={() => mutation.mutate({ name: replayName, command })}
    >
      {t(style.label)}
    </Button>
  );
};
