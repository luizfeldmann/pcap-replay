import { TableCell } from "@mui/material";
import type { AddressRemap } from "shared";

// Renders the to/from cells in the source or destination remap columns
export const AddressRemapCells = (props: { value?: AddressRemap }) => (
  <>
    <TableCell>{props.value?.from}</TableCell>
    <TableCell>{props.value?.to}</TableCell>
  </>
);
