import { Box, Link } from "@mui/material";
import { Icons } from "../../utils/Icons";
import { endpoints } from "../../utils/endpoints";

export const FileIconLink = (props: { id: string; name: string }) => (
  <Box
    component={Link}
    target="_blank"
    underline="none"
    href={`${endpoints.downloadFile}/${props.id}`}
    download={props.name}
    sx={{ display: "flex", alignItems: "center", gap: 1 }}
  >
    <Icons.FileItem color="primary" />
    {props.name}
  </Box>
);
