import { TableCell, type TableCellProps } from "@mui/material";

export const TableCellHeader = (props: TableCellProps) => (
  <TableCell
    variant="head"
    {...props}
    sx={{
      fontWeight: "bold",
      backgroundColor: "background.paper",
      ...props?.sx,
    }}
  />
);
