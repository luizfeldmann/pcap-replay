import { useTranslation } from "react-i18next";
import type { RepeatSettings } from "shared";

// Text displayed in the repetitions setting cell
export const RepeatSettingsText = (props: { value?: RepeatSettings }) => {
  const { t } = useTranslation();

  let text: string = "";
  if (props.value?.type === "loop") {
    text = t("replays.table.repeat.loop");
  } else if (props.value?.type === "times") {
    text = t("replays.table.repeat.times", { n: props.value.times });
  }

  return <span>{text}</span>;
};
