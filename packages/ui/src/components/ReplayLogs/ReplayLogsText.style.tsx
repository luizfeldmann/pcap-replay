import { Box, Paper, type BoxProps, type PaperProps } from "@mui/material";

export const LogTextContainer = ({ ...props }: PaperProps) => (
  <Paper
    {...props}
    variant="outlined"
    elevation={1}
    sx={{
      pl: 2,
      height: "100%",
      fontSize: 13,
      fontFamily: "monospace",
      bgcolor: "grey.900",
      color: "grey.100",
    }}
  />
);

export const LogTextPreformatted = ({ sx, ...props }: BoxProps<"pre">) => (
  <Box
    {...props}
    component="pre"
    sx={{
      ...sx,
      m: 0,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      fontFamily: "inherit",
    }}
  />
);
