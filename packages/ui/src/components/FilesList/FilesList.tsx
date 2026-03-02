import { useTranslation } from "react-i18next";
import { useFilesList } from "../../api/files/useFilesList";
import {
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { FileSize } from "../FileSize/FileSize";

import { FileContextButton } from "../FileContextMenu/FileContextButton";
import { TableCellHeader } from "./FileList.style";
import { FileIconLink } from "./FileIconLink";
import { useFileContextMenu } from "../FileContextMenu/useFileContextMenu";
import { FileContextMenu } from "../FileContextMenu/FileContextMenu";
import { LocaleDateTime } from "../LocaleDateTime/LocaleDateTime";
import { FileRenameDialog } from "../FileRenameDialog/FileRenameDialog";

export const FilesList = () => {
  const { t } = useTranslation();
  const filesMenu = useFileContextMenu();
  const filesQuery = useFilesList();
  const rows = filesQuery.data?.pages.flatMap((p) => p.items) ?? [];

  if (filesQuery.isError)
    return <Alert severity="error">{filesQuery.error.message}</Alert>;

  return (
    <>
      {filesQuery.isLoading && <LinearProgress />}
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
            <TableCellHeader>{t("files.name")}</TableCellHeader>
            <TableCellHeader>{t("files.size")}</TableCellHeader>
            <TableCellHeader>{t("files.timeUploaded")}</TableCellHeader>
            <TableCellHeader sx={{ width: 64 }}>
              <FileContextMenu
                state={filesMenu.state}
                actions={filesMenu.actions}
              />
              <FileRenameDialog {...filesMenu.fileRename} />
            </TableCellHeader>
          </TableRow>
        )}
        itemContent={(_, rowData) => (
          <>
            <TableCell>
              <FileIconLink id={rowData.id} name={rowData.name} />
            </TableCell>
            <TableCell>
              <FileSize size={rowData.size} />
            </TableCell>
            <TableCell>
              <LocaleDateTime
                iso={rowData.time}
                options={{
                  dateStyle: "medium",
                  timeStyle: "medium",
                }}
              />
            </TableCell>
            <TableCell>
              <FileContextButton
                onClick={(e) =>
                  filesMenu.onOpen(e, { id: rowData.id, name: rowData.name })
                }
              />
            </TableCell>
          </>
        )}
      />
    </>
  );
};
