This repository contains Serde <-> TypeScript code generator and typescript library for runtime encoding/decoding.
NOTE: Upstream serde-generate [wasn't properly tested for bincode 2](https://github.com/zefchain/serde-reflection/issues/69), use with caution

Example usage can be found in `suite` dir.

## JavaScript benchamrks.
Enter nix development shell and run
```sh
pnpm i
run:suite
```

## Results
### Encode
```
┌─────────┬───────────────────────────────┬─────────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                     │ ops/sec     │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼───────────────────────────────┼─────────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:encode'     │ '717,309'   │ 1394.0992784144942 │ '±0.31%' │ 1075964 │
│ 1       │ 'JSON:encode'                 │ '384,683'   │ 2599.5422867295706 │ '±0.05%' │ 577025  │
│ 2       │ 'protobuf-js-ts-proto:encode' │ '1,049,439' │ 952.8891828025206  │ '±0.50%' │ 1574160 │
└─────────┴───────────────────────────────┴─────────────┴────────────────────┴──────────┴─────────┘
```
### Decode
```
┌─────────┬───────────────────────────────┬───────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                     │ ops/sec   │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼───────────────────────────────┼───────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:decode'     │ '894,259' │ 1118.2439247680838 │ '±0.24%' │ 1341389 │
│ 1       │ 'JSON:decode'                 │ '460,448' │ 2171.7932150326965 │ '±0.14%' │ 690674  │
│ 2       │ 'protobuf-js-ts-proto:decode' │ '837,149' │ 1194.5301794026077 │ '±0.18%' │ 1255724 │
└─────────┴───────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
```
