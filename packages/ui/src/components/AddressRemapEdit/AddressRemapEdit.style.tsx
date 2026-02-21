import { TableCell, type TableCellProps } from "@mui/material";

export const HeaderCell = (props: TableCellProps) => (
  <TableCell sx={{ fontWeight: "bold" }} {...props} />
);
