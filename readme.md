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
│ 0       │ 'serdegen-bincode:v1:encode'  │ '790,592'   │ 1264.8743558631327 │ '±0.36%' │ 1185889 │
│ 1       │ 'serdegen-bincode:v2:encode'  │ '212,812'   │ 4698.965340518016  │ '±0.32%' │ 319220  │
│ 2       │ 'JSON:encode'                 │ '414,526'   │ 2412.390591678346  │ '±0.13%' │ 621790  │
│ 3       │ 'protobuf-js-ts-proto:encode' │ '1,099,613' │ 909.4104719170042  │ '±0.44%' │ 1649421 │
└─────────┴───────────────────────────────┴─────────────┴────────────────────┴──────────┴─────────┘
┌─────────┬───────────────────────────────┬───────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                     │ ops/sec   │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼───────────────────────────────┼───────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:v1:decode'  │ '825,030' │ 1212.0765999798027 │ '±0.20%' │ 1237546 │
│ 1       │ 'serdegen-bincode:v2:decode'  │ '777,856' │ 1285.5835783076327 │ '±0.19%' │ 1166786 │
│ 2       │ 'JSON:decode'                 │ '482,663' │ 2071.834779473597  │ '±0.14%' │ 723996  │
│ 3       │ 'protobuf-js-ts-proto:decode' │ '876,146' │ 1141.36162666827   │ '±0.20%' │ 1314220 │
└─────────┴───────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
```
