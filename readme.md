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
│ 0       │ 'serdegen-bincode:v1:encode'         │ '819,387' │ 1220.4230864987687 │ '±0.31%' │ 1229082 │
│ 1       │ 'serdegen-bincode:v2:encode'         │ '463,546' │ 2157.279167463407  │ '±0.20%' │ 695321  │
│ 2       │ 'JSON:encode'                        │ '428,883' │ 2331.636218651817  │ '±0.12%' │ 643326  │
│ 3       │ '@bufbuild/protobuf-ts-proto:encode' │ '148,860' │ 6717.719370686907  │ '±0.21%' │ 223291  │
└─────────┴──────────────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
┌─────────┬──────────────────────────────────────┬───────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                            │ ops/sec   │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼──────────────────────────────────────┼───────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:v1:decode'         │ '809,115' │ 1235.9176195579357 │ '±0.23%' │ 1213674 │
│ 1       │ 'serdegen-bincode:v2:decode'         │ '756,301' │ 1322.224157369496  │ '±0.66%' │ 1134453 │
│ 2       │ 'JSON:decode'                        │ '470,929' │ 2123.459247306691  │ '±0.14%' │ 706395  │
│ 3       │ '@bufbuild/protobuf-ts-proto:decode' │ '730,333' │ 1369.2379351889967 │ '±0.17%' │ 1095500 │
└─────────┴──────────────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
```
