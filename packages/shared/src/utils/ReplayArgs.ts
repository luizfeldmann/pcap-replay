import { AddressRemap, PortRemap, ReplaySettings } from "../dto/ReplaySettings";

const getPortRemap = (portRemap?: PortRemap[]) =>
  portRemap?.map((item) => {
    if (typeof item.from === "number") return `${item.from}:${item.to}`;
    else return `${item.from.start}-${item.from.end}:${item.to}`;
  });

const getAddressRemap = (addrRemap?: AddressRemap[]) =>
  addrRemap?.map((item) => {
    switch (item.ip) {
      case "v4":
        return `${item.from}:${item.to}`;
      case "v6":
        return `[${item.from}]:[${item.to}]`;
    }
  });

const getListArgs = (flag: string, args?: string[]) => {
  if (!args || args.length === 0) return [];
  return [`--${flag}=${args.join(",")}`];
};

export const GetReplayArgs = (settings: ReplaySettings): string[] => {
  const args: string[] = [
    `--intf1=${settings.interface}`,
    ...getListArgs("portmap", getPortRemap(settings.portRemap)),
    ...getListArgs("srcipmap", getAddressRemap(settings.srcRemap)),
    ...getListArgs("dstipmap", getAddressRemap(settings.dstRemap)),
  ];

  // Performance settings
  switch (settings?.load?.type) {
    case "multiplier":
      args.push(`--multiplier=${settings.load.speed}`);
      break;
    case "mbps":
      args.push(`--mbps=${settings.load.dataRate}`);
      break;
    case "pps":
      args.push(`--pps=${settings.load.packetRate}`);
      break;
  }

  // Duration or length limit settings
  switch (settings?.limit?.type) {
    case "duration":
      args.push(`--duration=${settings.limit.maxDuration}`);
      break;
    case "packets":
      args.push(`--limit=${settings.limit.maxPackets}`);
      break;
  }

  // Repetitions settings
  switch (settings?.repeat?.type) {
    case "loop":
      args.push(`--loop=0`);
      break;
    case "times":
      args.push(`--loop=${settings.repeat.times}`);
      break;
  }

  return args;
};
