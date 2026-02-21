import { Box, IconButton, TableCell, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { AddressRemap } from "shared";
import { Icons } from "../../utils/Icons";

export const AddressRemapConstRow = (props: {
  value: AddressRemap;
  isEditable: boolean;
  onEdit(): void;
  onDelete(): void;
}) => {
  const { t } = useTranslation();
  return (
    <TableRow
      hover
      sx={{
        "& .row-actions": {
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.2s",
        },
        "&:hover .row-actions": {
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
    >
      <TableCell>
        {props.value.ip === "v4"
          ? t("replays.form.addressremap.proto4")
          : t("replays.form.addressremap.proto6")}
      </TableCell>
      <TableCell>{props.value.from}</TableCell>
      <TableCell>{props.value.to}</TableCell>
      <TableCell align="right">
        {props.isEditable && (
          <Box className="row-actions">
            <IconButton>
              <Icons.Edit onClick={props.onEdit} />
            </IconButton>
            <IconButton onClick={props.onDelete}>
              <Icons.Delete />
            </IconButton>
          </Box>
        )}
      </TableCell>
    </TableRow>
  );
};
