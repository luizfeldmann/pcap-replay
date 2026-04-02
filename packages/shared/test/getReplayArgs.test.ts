import { describe, it, expect } from "vitest";
import { getTcpReplayArgs } from "../src/utils/ReplayArgs";

describe("Get CLI flags for Replay job", () => {
  it("Interface name", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
    });

    expect(args).toStrictEqual(["--intf1=eth0"]);
  });

  it("Speed multiplier", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      load: {
        type: "multiplier",
        speed: 2,
      },
    });

    expect(args).toContain("--multiplier=2");
  });

  it("Data rate", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      load: {
        type: "mbps",
        dataRate: 100,
      },
    });

    expect(args).toContain("--mbps=100");
  });

  it("Packet throttle", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      load: {
        type: "pps",
        packetRate: 1000,
      },
    });

    expect(args).toContain("--pps=1000");
  });

  it("Limit duration", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      limit: {
        type: "duration",
        maxDuration: 60,
      },
    });

    expect(args).toContain("--duration=60");
  });

  it("Limit count", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      limit: {
        type: "packets",
        maxPackets: 1,
      },
    });

    expect(args).toContain("--limit=1");
  });

  it("Loop forever", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      repeat: {
        type: "loop",
      },
    });

    expect(args).toContain("--loop=0");
  });

  it("Loop N times", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      repeat: {
        type: "times",
        times: 10,
      },
    });

    expect(args).toContain("--loop=10");
  });

  it("Port remap single", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      portRemap: [
        {
          from: 80,
          to: 8080,
        },
      ],
    });

    expect(args).toContain("--portmap=80:8080");
  });

  it("Port remap multi", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      portRemap: [
        {
          from: 80,
          to: 8080,
        },
        {
          from: {
            start: 8000,
            end: 9000,
          },
          to: 8081,
        },
      ],
    });

    expect(args).toContain("--portmap=80:8080,8000-9000:8081");
  });

  it("Src remap IPv4 single", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      srcRemap: [
        {
          ip: "v4",
          from: "192.168.0.0/16",
          to: "10.11.0.0/16",
        },
      ],
    });

    expect(args).toContain("--srcipmap=192.168.0.0/16:10.11.0.0/16");
  });

  it("Dst remap IPv6 multi", () => {
    const args = getTcpReplayArgs({
      provider: "tcpreplay",
      interface: "eth0",
      dstRemap: [
        {
          ip: "v6",
          from: "2001:db8::/32",
          to: "dead::/16",
        },
        {
          ip: "v6",
          from: "2001:db8::/32",
          to: "::ffff:0:0/96",
        },
      ],
    });

    expect(args).toContain(
      "--dstipmap=[2001:db8::/32]:[dead::/16],[2001:db8::/32]:[::ffff:0:0/96]",
    );
  });
});
