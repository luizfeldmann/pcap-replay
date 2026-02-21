import {
  ClickAwayListener,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { AddressRemap } from "shared";
import { HeaderCell } from "./AddressRemapEdit.style";
import { AddressRemapEditRow } from "./AddressRemapEditRow";
import { Icons } from "../../utils/Icons";
import { AddressRemapConstRow } from "./AddressRemapConstRow";

export const AddressRemapEdit = (props: {
  value?: AddressRemap[];
  onChange(value?: AddressRemap[]): void;
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<{ editRow?: number; newRow: boolean }>({
    newRow: false,
  });

  //! Indicates no edit or creation is in progress
  const noCurrentOperation = !state.newRow && state.editRow === undefined;

  // Stop current edits if clicked away from table
  const onClickAway = () => setState({ newRow: false, editRow: undefined });

  // Enable editor to click create new row
  const onClickNew = () => setState({ newRow: true, editRow: undefined });

  // New row was created
  const onSaveNewRow = (row: AddressRemap) => {
    // Start new collection or append to end of existing collection
    if (props.value) props.onChange([...props.value, row]);
    else props.onChange([row]);

    // Stop current edit mode
    onClickAway();
  };

  // Click to delete the hovering row
  const onDeleteRow = (row: number) =>
    props.onChange(props.value?.filter((_, i) => i !== row));

  // Click to put the hovering row in edit mode
  const onEditRow = (i: number) => setState({ newRow: false, editRow: i });

  // Save the modified row from the editor
  const onApplyEditRow = (applyIndex: number, applyData: AddressRemap) => {
    // Apply state to parent
    props.onChange(
      props.value?.map((row, i) => (i === applyIndex ? applyData : row)),
    );
    // Finish the edit
    onClickAway();
  };

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 256 }} size="small">
          <TableHead>
            <TableRow>
              <HeaderCell>{t("replays.form.addressremap.proto")}</HeaderCell>
              <HeaderCell>{t("replays.form.addressremap.from")}</HeaderCell>
              <HeaderCell>{t("replays.form.addressremap.to")}</HeaderCell>
              <HeaderCell></HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.value?.map((item, i) => {
              // Show the editor mode row
              if (i === state.editRow)
                return (
                  <AddressRemapEditRow
                    key={i}
                    value={item}
                    setValue={(v) => onApplyEditRow(i, v)}
                  />
                );
              // Show the const, display-only row
              return (
                <AddressRemapConstRow
                  key={i}
                  value={item}
                  isEditable={noCurrentOperation}
                  onEdit={() => onEditRow(i)}
                  onDelete={() => onDeleteRow(i)}
                />
              );
            })}
            {state.newRow && <AddressRemapEditRow setValue={onSaveNewRow} />}
            {noCurrentOperation && (
              <IconButton color="primary" onClick={onClickNew}>
                <Icons.Add />
              </IconButton>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ClickAwayListener>
  );
};
