import { LocaleDateTime } from "../LocaleDateTime/LocaleDateTime";

// Display text for the cells containing a date-time
export const TimestampCell = (props: { iso?: string }) => (
  <LocaleDateTime
    iso={props.iso}
    options={{
      dateStyle: "short",
      timeStyle: "short",
    }}
  />
);
