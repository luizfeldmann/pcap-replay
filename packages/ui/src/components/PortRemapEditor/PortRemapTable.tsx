import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { HeaderCell } from "./PortRemapTable.styles";
import type { PortRemap } from "shared";

export const PortRemapTable = (props: {
  data?: PortRemap[];
  selected?: number;
  setSelected(selected?: number): void;
}) => {
  const { t } = useTranslation();

  return (
    <TableContainer
      component={Paper}
      onClick={() => props.setSelected(undefined)}
    >
      <Table sx={{ minWidth: 256 }} size="small">
        <TableHead>
          <TableRow>
            <HeaderCell>{t("replays.form.portremap.from")}</HeaderCell>
            <HeaderCell>{t("replays.form.portremap.to")}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data?.map((item, i) => (
            <TableRow
              key={i}
              role="listitem"
              hover
              selected={props.selected === i}
              onClick={(e) => {
                e.stopPropagation();
                props.setSelected(props.selected !== i ? i : undefined);
              }}
            >
              <TableCell>
                {typeof item.from === "number" && <>{item.from}</>}
                {typeof item.from === "object" && (
                  <>{`${item.from.start} - ${item.from.end}`}</>
                )}
              </TableCell>
              <TableCell>{item.to}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
