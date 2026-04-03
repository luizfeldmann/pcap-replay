import { useTranslation } from "react-i18next";
import type { LoadSettings } from "shared";

// Text displayed in the load/speed settings cell
export const LoadSettingsText = (props: {
  value: LoadSettings | null | undefined;
}) => {
  const { t } = useTranslation();

  let text = "";
  if (props.value?.type === "multiplier") {
    text = t("replays.table.speed.multiplier", { x: props.value.speed });
  } else if (props.value?.type === "mbps") {
    text = t("replays.table.speed.mbps", { x: props.value.dataRate });
  } else if (props.value?.type === "pps") {
    text = t("replays.table.speed.pps", { x: props.value.packetRate });
  }

  return <span>{text}</span>;
};
