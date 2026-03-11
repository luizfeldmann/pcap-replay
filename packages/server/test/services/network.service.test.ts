import { describe, it, expect, vi, afterEach, Mock } from "vitest";
import { NetworkService } from "../../src/services/network.js";
import { type NetworkInterfaceInfo } from "os";
import * as os from "os";

// Mock os.networkInterfaces
vi.mock("os", () => ({
  networkInterfaces: vi.fn(),
}));

describe("NetworkService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getInterfaces", () => {
    it("convert network interfaces to DTO", () => {
      const mockOsInterfaces: NodeJS.Dict<NetworkInterfaceInfo[]> = {
        // Interface with multiple addresses (one internal, one external)
        eth0: [
          {
            family: "IPv4",
            address: "192.168.1.100",
            netmask: "255.255.255.0",
            mac: "01:02:03:04:05:06",
            internal: false,
            cidr: "192.168.1.100/24",
            scopeid: undefined,
          },
          // Also test IPV4
          {
            family: "IPv6",
            address: "fe80::1",
            netmask: "ffff:ffff:ffff:ffff::",
            mac: "01:02:03:04:05:06",
            internal: true,
            cidr: null, // Missing CIDR
            scopeid: 0,
          },
        ],
        // Interface without any addresses
        docker0: [],
      };

      (os.networkInterfaces as Mock).mockReturnValue(mockOsInterfaces);

      // Invoke the service
      const interfaces = NetworkService.getInterfaces();

      // Verify we have all interfaces
      expect(interfaces).toHaveLength(2);

      // Verify eth0 with multiple addresses
      const eth0 = interfaces.find((i) => i.name === "eth0");
      expect(eth0).toBeDefined();
      expect(eth0?.addr).toHaveLength(2);
      expect(eth0?.addr[0]).toEqual({
        family: "IPv4",
        address: "192.168.1.100",
        netmask: "255.255.255.0",
        mac: "01:02:03:04:05:06",
        internal: false,
        cidr: "192.168.1.100/24",
      });
      expect(eth0?.addr[1]).toEqual({
        family: "IPv6",
        address: "fe80::1",
        netmask: "ffff:ffff:ffff:ffff::",
        mac: "01:02:03:04:05:06",
        internal: true,
        cidr: "", // CIDR was missing
      });

      // Verify it can handle nic with no addresses
      const docker0 = interfaces.find((i) => i.name === "docker0");
      expect(docker0).toBeDefined();
      expect(docker0?.addr).toEqual([]);
    });
  });
});
