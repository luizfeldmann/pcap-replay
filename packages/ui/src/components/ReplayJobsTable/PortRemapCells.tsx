import { TableCell } from "@mui/material";
import type { PortRemap } from "shared";

// Renders the to/from port numbers in the port remap
export const PortRemapCells = (props: { value?: PortRemap }) => (
  <>
    <TableCell>
      {typeof props.value?.from === "number" && props.value.from}
      {typeof props.value?.from === "object" &&
        `${props.value.from.start} - ${props.value.from.end}`}
    </TableCell>
    <TableCell>{props.value?.to}</TableCell>
  </>
);
