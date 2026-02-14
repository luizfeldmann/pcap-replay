import { Box, Stack } from "@mui/material";
import {
  DetailContent,
  DetailHeader,
  TagChip,
} from "./NetworkInterfacesList.style";
import type { NetworkInterfaceAddress } from "shared";
import { useTranslation } from "react-i18next";

export const NetworkInterfaceAddressDetails = (props: {
  data: NetworkInterfaceAddress;
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      spacing={1}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1,
      }}
    >
      {props.data.family === "IPv4" && <TagChip label={t("network.nic.v4")} />}
      {props.data.family === "IPv6" && <TagChip label={t("network.nic.v6")} />}
      {props.data.internal && <TagChip label={t("network.nic.internal")} />}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          rowGap: 0.5,
          columnGap: 1,
        }}
      >
        <DetailHeader>{t("network.nic.ip")}</DetailHeader>
        <DetailContent>{props.data.address}</DetailContent>
        <DetailHeader>{t("network.nic.netmask")}</DetailHeader>
        <DetailContent>{props.data.netmask}</DetailContent>
        <DetailHeader>{t("network.nic.cidr")}</DetailHeader>
        <DetailContent>{props.data.cidr}</DetailContent>
        <DetailHeader>{t("network.nic.mac")}</DetailHeader>
        <DetailContent>{props.data.mac}</DetailContent>
      </Box>
    </Stack>
  );
};
