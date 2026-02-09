import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ToggleListGrid } from "../../components/ToggleListGrid/ToggleListGrid";
import { useToggleListGrid } from "../../components/ToggleListGrid/useToggleListGrid";
import { NetworkInterfacesTable } from "../../components/NetworkInterfaces/NetworkInterfacesTable";
import { NetworkInterfacesList } from "../../components/NetworkInterfaces/NetworkInterfacesList";

export const NetworkPage = () => {
  const { t } = useTranslation();
  const [toggleValue, toggleSet] = useToggleListGrid();
  return (
    <Box>
      <Typography variant="h6">{t("network.interfaces")}</Typography>
      <ToggleListGrid value={toggleValue} setValue={toggleSet} />
      {toggleValue === "list" && <NetworkInterfacesList />}
      {toggleValue === "grid" && <NetworkInterfacesTable />}
    </Box>
  );
};
