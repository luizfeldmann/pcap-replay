# PCAP REPLAY

Tool app to replay PCAP files inside a docker network.

---

## Build & Run

To build the container image:

```bash
docker build . -t pcap-replay:latest
```

To run the image:

```bash
docker volume create pcap-replay-data
docker run \
    -p 3000:3000 \
    -v pcap-replay-data:/app/packages/server/data \
    --cap-add=NET_ADMIN \
    --cap-add=NET_RAW \
    pcap-replay:latest
```

## Troubleshooting

If you get permission errors running `tcpreplay-edit`,
such as `socket: Operation not permitted`,
give it permission for `CAP_NET_RAW`:

```bash
sudo setcap cap_net_raw,cap_net_admin=eip $(which tcpreplay-edit)
```
