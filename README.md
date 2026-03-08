# PCAP REPLAY

Tool app to replay PCAP files inside a docker network.

---

## Troubleshooting

If you get permission errors running `tcpreplay-edit`,
such as `socket: Operation not permitted`,
give it permission for `CAP_NET_RAW`:

```bash
sudo setcap cap_net_raw,cap_net_admin=eip $(which tcpreplay-edit)
```
