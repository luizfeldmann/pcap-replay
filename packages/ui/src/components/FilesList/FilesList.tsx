import { useTranslation } from "react-i18next";
import type { FileListItem } from "shared";
import { useFilesList } from "../../api/files";
import {
  Alert,
  Box,
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { FileSize } from "../FileSize/FileSize";
import type { TFunction } from "i18next";
import { Icons } from "../../constants/Icons";
import endpoint from "../../constants/endpoints.json";

type ColumnSpec = {
  label(t: TFunction): string;
  content(t: TFunction, rowData: FileListItem): React.ReactNode;
};

const columns: ColumnSpec[] = [
  {
    label: (t) => t("files.name"),
    content: (_t, rowData) => (
      <Box
        component={Link}
        target="_blank"
        underline="none"
        href={`${endpoint.downloadFile}/${rowData.id}`}
        download={rowData.name}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Icons.FileItem color="primary" />
        {rowData.name}
      </Box>
    ),
  },
  {
    label: (t) => t("files.size"),
    content: (_t, rowData) => <FileSize size={rowData.size} />,
  },
  {
    label: (t) => t("files.timeUploaded"),
    content: (_t, rowData) => rowData.time,
  },
];

export const FilesList = () => {
  const { t } = useTranslation();
  const filesQuery = useFilesList();
  const rows = filesQuery.data?.pages.flatMap((p) => p.items) ?? [];

  if (filesQuery.isLoading) return <LinearProgress />;
  else if (filesQuery.isError)
    return <Alert severity="error">{filesQuery.error.message}</Alert>;
  return (
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
              sx={{ fontWeight: "bold", backgroundColor: "background.paper" }}
            >
              {column.label(t)}
            </TableCell>
          ))}
        </TableRow>
      )}
      itemContent={(_, rowData) => (
        <>
          {columns.map((col, idx) => (
            <TableCell key={idx}>{col.content(t, rowData)}</TableCell>
          ))}
        </>
      )}
    />
  );
};
