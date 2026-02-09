import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNetworkInterfaces } from "../../api/networkInterfaces";
import type { NetworkInterface, NetworkInterfaceAddress } from "shared";
import { useMemo, useState } from "react";
import { Icons } from "../../constants/Icons";
import { useTranslation } from "react-i18next";

const TagChip = (props: { label: string }) => (
  <Chip size="small" color="default" label={props.label} />
);

const DetailHeader = (props: { label: string }) => (
  <Typography variant="body2" color="text.secondary">
    {props.label}
  </Typography>
);

const DetailContent = (props: { label: string }) => (
  <Typography variant="body2">{props.label}</Typography>
);

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
        <DetailHeader label={t("network.nic.ip")} />
        <DetailContent label={props.data.address} />
        <DetailHeader label={t("network.nic.netmask")} />
        <DetailContent label={props.data.netmask} />
        <DetailHeader label={t("network.nic.cidr")} />
        <DetailContent label={props.data.cidr} />
        <DetailHeader label={t("network.nic.mac")} />
        <DetailContent label={props.data.mac} />
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
    <Stack spacing={1} marginTop={2}>
      {interfaces.isLoading && <LinearProgress />}
      {interfaces.data?.map((item) => (
        <InterfaceCard key={item.name} data={item} />
      ))}
    </Stack>
  );
};
