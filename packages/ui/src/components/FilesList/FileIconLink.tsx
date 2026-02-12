import { Box, Link } from "@mui/material";
import { Icons } from "../../constants/Icons";
import endpoint from "../../constants/endpoints.json";

export const FileIconLink = (props: { id: string; name: string }) => (
  <Box
    component={Link}
    target="_blank"
    underline="none"
    href={`${endpoint.downloadFile}/${props.id}`}
    download={props.name}
    sx={{ display: "flex", alignItems: "center", gap: 1 }}
  >
    <Icons.FileItem color="primary" />
    {props.name}
  </Box>
);
