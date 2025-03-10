This repository contains Serde <-> TypeScript code generator and typescript library for runtime encoding/decoding.
NOTE: Upstream serde-generate [wasn't properly tested for bincode 2](https://github.com/zefchain/serde-reflection/issues/69), use with caution

Example usage can be found in `suite` dir.

## JavaScript benchamrks.
Enter nix development shell and run
```sh
pnpm i
run:suite
```

## Benchmarks
```
┌─────────┬───────────────────────────────┬─────────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                     │ ops/sec     │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼───────────────────────────────┼─────────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:v1:encode'  │ '829,907'   │ 1204.953512919587  │ '±0.33%' │ 1244862 │
│ 1       │ 'serdegen-bincode:v2:encode'  │ '457,656'   │ 2185.0445297422993 │ '±0.21%' │ 686485  │
│ 2       │ 'JSON:encode'                 │ '429,324'   │ 2329.2402967757653 │ '±0.12%' │ 643987  │
│ 3       │ 'protobuf-js-ts-proto:encode' │ '1,094,153' │ 913.9485843252978  │ '±0.27%' │ 1641231 │
└─────────┴───────────────────────────────┴─────────────┴────────────────────┴──────────┴─────────┘
┌─────────┬───────────────────────────────┬───────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                     │ ops/sec   │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼───────────────────────────────┼───────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:v1:decode'  │ '831,039' │ 1203.3118052878929 │ '±0.20%' │ 1246560 │
│ 1       │ 'serdegen-bincode:v2:decode'  │ '699,786' │ 1429.0070259504294 │ '±0.83%' │ 1049680 │
│ 2       │ 'JSON:decode'                 │ '381,936' │ 2618.2358069834886 │ '±0.23%' │ 572905  │
│ 3       │ 'protobuf-js-ts-proto:decode' │ '855,621' │ 1168.7404632739124 │ '±0.24%' │ 1283433 │
└─────────┴───────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
```
