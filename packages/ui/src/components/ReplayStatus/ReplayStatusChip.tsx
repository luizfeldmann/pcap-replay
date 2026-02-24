import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ReplayStatus } from "shared";
import { StatusStyles } from "./ReplayStatusStyles";

export const ReplayStatusChip = (props: { value: ReplayStatus }) => {
  const { t } = useTranslation();
  const style = StatusStyles[props.value];
  return (
    <Chip
      label={t(style.label)}
      icon={<style.icon color="inherit" />}
      sx={{
        color: "white",
        backgroundColor: style.color,
      }}
    />
  );
};
