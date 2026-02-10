import {
  Alert,
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useNetworkInterfaces } from "../../api/networkInterfaces";
import type { NetworkInterface, NetworkInterfaceAddress } from "shared";
import { useMemo, useState } from "react";
import { Icons } from "../../constants/Icons";
import { useTranslation } from "react-i18next";
import {
  DetailHeader,
  TagChip,
  DetailContent,
} from "./NetworkInterfacesList.style";

const AddrDetails = (props: { data: NetworkInterfaceAddress }) => {
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

const InterfaceCard = (props: { data: NetworkInterface }) => {
  const { t } = useTranslation();
  const [isExpand, setExpand] = useState(false);

  const tags = useMemo(
    () => ({
      v4: props.data.addr.some((item) => item.family === "IPv4"),
      v6: props.data.addr.some((item) => item.family === "IPv6"),
      internal: props.data.addr.some((item) => item.internal),
    }),
    [props.data],
  );

  return (
    <Card variant="outlined">
      <CardHeader
        sx={{}}
        avatar={
          <Badge
            badgeContent={props.data.addr.length}
            color="primary"
            overlap="circular"
          >
            <Avatar>{<Icons.Network />}</Avatar>
          </Badge>
        }
        title={props.data.name}
        subheader={
          <Stack spacing={1} direction="row">
            {tags.internal && <TagChip label={t("network.nic.internal")} />}
            {tags.v4 && <TagChip label={t("network.nic.v4")} />}
            {tags.v6 && <TagChip label={t("network.nic.v6")} />}
          </Stack>
        }
        action={
          <IconButton onClick={() => setExpand((curr) => !curr)}>
            <Icons.ExpandChevron
              sx={{
                transform: isExpand ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.2s",
              }}
            />
          </IconButton>
        }
      />

      <Collapse in={isExpand}>
        <CardContent>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {props.data.addr.map((data, i) => (
              <AddrDetails key={i} data={data} />
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export const NetworkInterfacesList = () => {
  const interfaces = useNetworkInterfaces();

  return (
    <>
      {interfaces.isLoading && <LinearProgress />}
      {interfaces.isError && (
        <Alert severity="error">{interfaces.error.message}</Alert>
      )}
      {interfaces.data?.map((item) => (
        <InterfaceCard key={item.name} data={item} />
      ))}
    </>
  );
};
