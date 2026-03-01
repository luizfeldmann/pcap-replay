import type { ReplayStatus } from "shared";
import { ReplayCommandTransitions } from "./ReplayCommandTransitions";
import { ReplayCommandStyles } from "./ReplayCommandStyles";
import { Button, CircularProgress, type ButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";

export type ReplayCommandButtonProps = ButtonProps & {
  currentStatus: ReplayStatus;
  isLoading?: boolean;
};

export const ReplayCommandButton = ({
  currentStatus,
  isLoading,
  ...props
}: ReplayCommandButtonProps) => {
  const { t } = useTranslation();
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
      startIcon={isLoading ? <CircularProgress size="small" /> : <style.icon />}
    >
      {t(style.label)}
    </Button>
  );
};
