import { Box, TableCell, type TableCellProps } from "@mui/material";

export const TableCellHeader = ({ sx, children, ...props }: TableCellProps) => (
  <TableCell
    sx={{
      color: "text.secondary",
      fontWeight: "bold",
      ...sx,
    }}
    {...props}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{children}</Box>
  </TableCell>
);
