import { LocaleDateTime } from "../LocaleDateTime/LocaleDateTime";

export const ReplayDateTime = (props: { iso?: string }) => (
  <LocaleDateTime
    iso={props.iso}
    options={{
      dateStyle: "short",
      timeStyle: "short",
    }}
  />
);
