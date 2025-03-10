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
│ 0       │ 'serdegen-bincode:v1:encode'  │ '804,488'   │ 1243.0256510763065 │ '±0.29%' │ 1206733 │
│ 1       │ 'serdegen-bincode:v2:encode'  │ '449,884'   │ 2222.794216887965  │ '±0.22%' │ 674827  │
│ 2       │ 'JSON:encode'                 │ '425,753'   │ 2348.7770011160146 │ '±0.10%' │ 638631  │
│ 3       │ 'protobuf-js-ts-proto:encode' │ '1,081,099' │ 924.9845620102634  │ '±0.26%' │ 1621649 │
└─────────┴───────────────────────────────┴─────────────┴────────────────────┴──────────┴─────────┘
┌─────────┬───────────────────────────────┬───────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                     │ ops/sec   │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼───────────────────────────────┼───────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:v1:decode'  │ '838,843' │ 1192.1168226749398 │ '±0.19%' │ 1258266 │
│ 1       │ 'serdegen-bincode:v2:decode'  │ '752,926' │ 1328.1507566028467 │ '±0.16%' │ 1129390 │
│ 2       │ 'JSON:decode'                 │ '480,161' │ 2082.6328572448147 │ '±0.14%' │ 720243  │
│ 3       │ 'protobuf-js-ts-proto:decode' │ '934,359' │ 1070.2519421487436 │ '±0.19%' │ 1401540 │
└─────────┴───────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
```
