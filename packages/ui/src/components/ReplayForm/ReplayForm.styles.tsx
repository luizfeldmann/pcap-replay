import {
  AccordionSummary,
  Box,
  type AccordionSummaryProps,
} from "@mui/material";
import { Icons } from "../../constants/Icons";

export const SectionHeader = ({
  children,
  ...props
}: AccordionSummaryProps) => (
  <AccordionSummary {...props} expandIcon={<Icons.ExpandChevron />}>
    <Box
      sx={{
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {children}
    </Box>
  </AccordionSummary>
);
