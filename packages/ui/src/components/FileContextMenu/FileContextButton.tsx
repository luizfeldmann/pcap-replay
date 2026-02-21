import { IconButton, type IconButtonProps } from "@mui/material";
import { Icons } from "../../utils/Icons";

export const FileContextButton = (props: IconButtonProps) => (
  <IconButton size="small" {...props}>
    <Icons.MoreContext />
  </IconButton>
);
