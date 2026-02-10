import {
  Chip,
  Typography,
  type ChipProps,
  type TypographyProps,
} from "@mui/material";

export const TagChip = (props: ChipProps) => (
  <Chip size="small" color="default" {...props} />
);

export const DetailHeader = (props: TypographyProps) => (
  <Typography variant="body2" color="text.secondary" {...props} />
);

export const DetailContent = (props: TypographyProps) => (
  <Typography variant="body2" {...props} />
);
