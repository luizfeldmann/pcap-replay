import {
  ReplaySettingsCommon,
  ReplaySettingsTcpReplay,
  ReplaySettingsUdpReplay,
  type AddressRemap,
  type PortRemap,
} from "../dto/replay/index.js";

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

const getCommonReplayArgs = (settings: ReplaySettingsCommon): string[] => {
  const args: string[] = [
    ...getListArgs("portmap", getPortRemap(settings.portRemap)),
    ...getListArgs("dstipmap", getAddressRemap(settings.dstRemap)),
  ];

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

  // Verbosity
  if (settings.verbose) args.push("--verbose");

  return args;
};

export const getTcpReplayArgs = (
  settings: ReplaySettingsTcpReplay,
): string[] => {
  const args = getCommonReplayArgs(settings);

  // interface name is mandatory
  args.push(`--intf1=${settings.interface}`);

  // only tcpreplay can rewrite sources, working on L2
  args.push(...getListArgs("srcipmap", getAddressRemap(settings.srcRemap)));

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

  return args;
};

export const getUdpReplayArgs = (
  settings: ReplaySettingsUdpReplay,
): string[] => {
  const args = getCommonReplayArgs(settings);

  // interface name is optional
  if (settings.interface) args.push(`--intf1=${settings.interface}`);

  // Performance settings
  switch (settings?.load?.type) {
    case "multiplier":
      args.push(`--multiplier=${settings.load.speed}`);
      break;
  }

  return args;
};
