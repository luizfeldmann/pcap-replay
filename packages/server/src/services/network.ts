import { networkInterfaces } from "os";
import { NetworkInterface } from "shared";

//! Reads the network interfaces and converts to DTO
const getInterfacesInternal = (): NetworkInterface[] => {
  const interfaces = networkInterfaces();
  return Object.entries(interfaces).map(
    ([name, info]): NetworkInterface => ({
      name,
      addr:
        info?.map((info) => ({
          family: info.family,
          mac: info.mac,
          internal: info.internal,
          address: info.address,
          netmask: info.netmask,
          cidr: info.cidr || "",
        })) || [],
    }),
  );
};

//! Cache network interfaces
let memoInterfaces: NetworkInterface[] | undefined = undefined;

// Get cached network interfaces info
const getInterfaces = (): NetworkInterface[] => {
  if (!memoInterfaces) memoInterfaces = getInterfacesInternal();
  return memoInterfaces;
};

export const NetworkService = { getInterfaces };
