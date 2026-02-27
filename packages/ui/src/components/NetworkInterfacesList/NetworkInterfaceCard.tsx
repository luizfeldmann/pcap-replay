import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NetworkInterface } from "shared";
import { Icons } from "../../utils/Icons";
import { TagChip } from "./NetworkInterfacesList.style";
import { NetworkInterfaceAddressDetails } from "./NetworkInterfaceAddressDetails";

export const NetworkInterfaceCard = (props: { data: NetworkInterface }) => {
  const { t } = useTranslation();
  const [isExpand, setExpand] = useState(false);

  // Analyze the characteristics of the addresses in this NIC
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
              <NetworkInterfaceAddressDetails key={i} data={data} />
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};
