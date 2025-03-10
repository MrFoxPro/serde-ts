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
┌─────────┬──────────────────────────────────────┬───────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                            │ ops/sec   │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼──────────────────────────────────────┼───────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:v1:encode'         │ '807,298' │ 1238.6986281006757 │ '±0.75%' │ 1210949 │
│ 1       │ 'serdegen-bincode:v2:encode'         │ '660,554' │ 1513.8803833544134 │ '±0.18%' │ 990832  │
│ 2       │ 'JSON:encode'                        │ '420,332' │ 2379.0664282310972 │ '±0.10%' │ 630500  │
│ 3       │ '@bufbuild/protobuf-ts-proto:encode' │ '85,076'  │ 11754.151706306136 │ '±4.57%' │ 127615  │
└─────────┴──────────────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
┌─────────┬──────────────────────────────────────┬───────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                            │ ops/sec   │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼──────────────────────────────────────┼───────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:v1:decode'         │ '802,321' │ 1246.3828803561225 │ '±0.32%' │ 1203483 │
│ 1       │ 'serdegen-bincode:v2:decode'         │ '771,840' │ 1295.6051836260453 │ '±0.24%' │ 1157761 │
│ 2       │ 'JSON:decode'                        │ '472,623' │ 2115.8488114579113 │ '±0.22%' │ 708936  │
│ 3       │ '@bufbuild/protobuf-ts-proto:decode' │ '719,423' │ 1390.0009201800447 │ '±0.26%' │ 1079136 │
└─────────┴──────────────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
```
