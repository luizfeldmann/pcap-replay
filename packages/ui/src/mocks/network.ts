import { HttpResponse, RequestHandler, http } from "msw";
import type { NetworkInterface, NetworkInterfaceAddress } from "shared";

const generateMockIntefaces = (): NetworkInterface[] => {
  // Total numver of interfaces to generate
  const NUM_IFACES = 10;

  // Sequence of number of addresses in each interface
  const NUM_ADDRS = [1, 2, 3];

  // Period of occurrence of IPv6 family
  const modFamily = 4;

  // Period of occurrence of internal network
  const modInternal = 5;

  // Generates a MAC address
  const mac = (i: number, j: number, k: number) =>
    [256 - i, 128 - j, 64 - k, i, j, k]
      .map((x) => (x % 256).toString(16).padStart(2, "0"))
      .join(":");

  // Generates a random looking IPv4
  const ipV4 = (i: number, j: number, k: number) => {
    const net = i % 255;
    const hh1 = (j % 254) + 1;
    const hh2 = (k % 254) + 1;
    return {
      address: `10.${net}.${hh1}.${hh2}`,
      cidr: `10.${net}.0.0/16`,
      netmask: "255.255.0.0",
    };
  };

  // Generates a random looking IPv6
  const ipV6 = (i: number, j: number, k: number) => {
    const hex16 = (x: number) => (x & 0xffff).toString(16).padStart(4, "0");
    const net = hex16(i & 0xff).slice(2);
    const part1 = hex16(j);
    const part2 = hex16(k);
    const host = hex16((j << 8) ^ k);

    return {
      address: `fd${net}:${part1}:${part2}:0000::${host}`,
      cidr: `fd${net}:${part1}:${part2}:0000::/64`,
      netmask: "ffff:ffff:ffff:ffff:0000:0000:0000:0000",
    };
  };

  // Procedurally generates fake interfaces
  return Array.from(
    { length: NUM_IFACES },
    (_, i): NetworkInterface => ({
      name: `eth${i}`,
      addr: Array.from(
        { length: NUM_ADDRS[i % NUM_ADDRS.length] },
        (_, j): NetworkInterfaceAddress => {
          const k = j + NUM_ADDRS.length * i;
          const family = k % modFamily === 0 ? "IPv6" : "IPv4";
          const { address, netmask, cidr } =
            family === "IPv4" ? ipV4(i, j, k) : ipV6(i, j, k);
          return {
            family,
            address,
            netmask,
            cidr,
            mac: mac(i, j, k),
            internal: k % modInternal === 0,
          };
        },
      ),
    }),
  );
};

// On first request, generate and cache a list of interfaces
let mockInterfacesCache: NetworkInterface[] | undefined;
const getNetworkInterfaces = http.get(`/api/network/interfaces`, () => {
  if (!mockInterfacesCache) mockInterfacesCache = generateMockIntefaces();
  return HttpResponse.json(mockInterfacesCache);
});

export const networkMocks: RequestHandler[] = [getNetworkInterfaces];
