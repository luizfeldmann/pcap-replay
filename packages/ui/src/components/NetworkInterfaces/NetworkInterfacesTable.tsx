import {
  Alert,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNetworkInterfaces } from "../../api/networkInterfaces";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { HeaderCell } from "./NetworkInterfacesTable.style";

export const NetworkInterfacesTable = () => {
  const { t } = useTranslation();
  const interfaces = useNetworkInterfaces();

  const flatData = useMemo(
    () =>
      interfaces.data?.flatMap((iface) =>
        iface.addr.map((addr) => ({ name: iface.name, ...addr })),
      ),
    [interfaces.data],
  );

  return (
    <>
      {interfaces.isLoading && <LinearProgress />}
      {interfaces.isError && (
        <Alert severity="error">{interfaces.error.message}</Alert>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <HeaderCell>{t("network.nic.name")}</HeaderCell>
              <HeaderCell>{t("network.nic.family")}</HeaderCell>
              <HeaderCell>{t("network.nic.internal")}</HeaderCell>
              <HeaderCell>{t("network.nic.ip")}</HeaderCell>
              <HeaderCell>{t("network.nic.netmask")}</HeaderCell>
              <HeaderCell>{t("network.nic.cidr")}</HeaderCell>
              <HeaderCell>{t("network.nic.mac")}</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flatData?.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item.family === "IPv4"
                    ? t("network.nic.v4")
                    : t("network.nic.v6")}
                </TableCell>
                <TableCell>
                  {item.internal && t("network.nic.internal")}
                </TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.netmask}</TableCell>
                <TableCell>{item.cidr}</TableCell>
                <TableCell>{item.mac}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
