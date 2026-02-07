import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { useTranslation } from "react-i18next";
import { useFiles } from "../../api/files";
import type { FileListItem } from "shared";

type ColumnSpec = {
  label: string;
  content(rowData: FileListItem): string;
};

export const FilesPage = () => {
  const { t } = useTranslation();
  const { data, fetchNextPage, hasNextPage } = useFiles();
  const rows = data?.pages.flatMap((p) => p.items) ?? [];

  const columns: ColumnSpec[] = [
    {
      label: t("files.name"),
      content: (rowData) => rowData.name,
    },
    {
      label: t("files.size"),
      content: (rowData) => rowData.size.toString(),
    },
    {
      label: t("files.timeUploaded"),
      content: (rowData) => rowData.time,
    },
  ];

  return (
    <Paper sx={{ height: 600, width: "100%" }}>
      <TableVirtuoso
        data={rows}
        endReached={() => hasNextPage && void fetchNextPage()}
        overscan={100}
        components={{
          Table: (props) => (
            <Table
              {...props}
              sx={{
                borderCollapse: "separate",
                tableLayout: "fixed",
              }}
            />
          ),
          TableHead: TableHead,
          TableBody: TableBody,
        }}
        fixedHeaderContent={() => (
          <TableRow>
            {columns.map((column, idx) => (
              <TableCell
                key={idx}
                variant="head"
                sx={{ backgroundColor: "background.paper" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        )}
        itemContent={(_, rowData) => (
          <>
            {columns.map((col, idx) => (
              <TableCell key={idx}>{col.content(rowData)}</TableCell>
            ))}
          </>
        )}
      />
    </Paper>
  );
};
