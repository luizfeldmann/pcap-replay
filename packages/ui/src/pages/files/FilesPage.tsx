import {
  Alert,
  Box,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { useTranslation } from "react-i18next";
import { useFilesList } from "../../api/files";
import type { FileListItem } from "shared";
import { FileSize } from "../../components/FileSize/FileSize";
import { UploadButton } from "../../components/UploadButton/UploadButton";

type ColumnSpec = {
  label: string;
  content(rowData: FileListItem): React.ReactNode;
};

export const FilesPage = () => {
  const { t } = useTranslation();
  const filesQuery = useFilesList();
  const rows = filesQuery.data?.pages.flatMap((p) => p.items) ?? [];

  const columns: ColumnSpec[] = [
    {
      label: t("files.name"),
      content: (rowData) => rowData.name,
    },
    {
      label: t("files.size"),
      content: (rowData) => <FileSize size={rowData.size} />,
    },
    {
      label: t("files.timeUploaded"),
      content: (rowData) => rowData.time,
    },
  ];

  return (
    <Stack spacing={1} component={Paper} sx={{ height: 600, width: "100%" }}>
      {filesQuery.isLoading && <LinearProgress />}
      {filesQuery.isError && (
        <Alert severity="error">{filesQuery.error.message}</Alert>
      )}
      <TableVirtuoso
        data={rows}
        endReached={() =>
          filesQuery.hasNextPage && void filesQuery.fetchNextPage()
        }
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
      <UploadButton />
    </Stack>
  );
};
