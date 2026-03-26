import { useTranslation } from "react-i18next";
import type { LengthSettings } from "shared";

// Text displayed in the limit/length cell
export const LengthSettingsText = (props: {
  value: LengthSettings | null | undefined;
}) => {
  const { t } = useTranslation();

  let text = "";
  if (props.value?.type === "duration") {
    text = t("replays.table.length.duration", { x: props.value.maxDuration });
  } else if (props.value?.type === "packets") {
    text = t("replays.table.length.packets", { x: props.value.maxPackets });
  }
  return <span>{text}</span>;
};
