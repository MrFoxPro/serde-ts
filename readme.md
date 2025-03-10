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
│ 0       │ 'serdegen-bincode:v1:encode'         │ '706,779' │ 1414.869171801931  │ '±0.25%' │ 1060169 │
│ 1       │ 'serdegen-bincode:v2:encode'         │ '637,338' │ 1569.0243585573778 │ '±0.18%' │ 956009  │
│ 2       │ 'JSON:encode'                        │ '420,885' │ 2375.942079327577  │ '±0.13%' │ 631329  │
│ 3       │ '@bufbuild/protobuf-ts-proto:encode' │ '84,756'  │ 11798.537326464035 │ '±5.19%' │ 127135  │
└─────────┴──────────────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
┌─────────┬──────────────────────────────────────┬───────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name                            │ ops/sec   │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼──────────────────────────────────────┼───────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'serdegen-bincode:v1:decode'         │ '804,489' │ 1243.0249524331743 │ '±0.33%' │ 1206736 │
│ 1       │ 'serdegen-bincode:v2:decode'         │ '705,857' │ 1416.7162422652912 │ '±0.28%' │ 1058787 │
│ 2       │ 'JSON:decode'                        │ '474,208' │ 2108.775826146241  │ '±0.24%' │ 711314  │
│ 3       │ '@bufbuild/protobuf-ts-proto:decode' │ '699,766' │ 1429.0488334198758 │ '±0.29%' │ 1049650 │
└─────────┴──────────────────────────────────────┴───────────┴────────────────────┴──────────┴─────────┘
```

Reference Rust formats benchmarks: https://david.kolo.ski/rust_serialization_benchmark
