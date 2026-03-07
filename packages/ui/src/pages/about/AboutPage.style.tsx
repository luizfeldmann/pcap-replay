import {
  Paper,
  Typography,
  type PaperProps,
  type TypographyProps,
} from "@mui/material";

export const Section = (props: TypographyProps) => (
  <Typography {...props} variant="h6" color="text.secondary" />
);

export const VersionTypography = ({ sx, ...props }: TypographyProps) => (
  <Typography
    {...props}
    variant="body1"
    sx={{
      fontFamily: "Monospace",
    }}
  />
);

export const LicenseBox = ({ sx, ...props }: PaperProps) => (
  <Paper
    {...props}
    elevation={1}
    sx={{
      ...sx,
      p: 2,
      borderRadius: 2,
      backgroundColor: "grey.100",
      overflowX: "auto",
    }}
  />
);

export const LicenseTypography = ({
  ref,
  sx,
  ...props
}: TypographyProps<"pre">) => (
  <Typography
    {...props}
    ref={ref}
    component="pre"
    sx={{
      ...sx,
      m: 0,
      fontFamily: "Monospace",
      fontSize: "0.85rem",
      whiteSpace: "pre-wrap",
      lineHeight: 1.4,
    }}
  />
);
