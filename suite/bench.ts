import { Bench } from "tinybench"
import * as ProtobufRegistry from "./generated/proto/main.ts"
import * as BincodeRegistryV1 from "./generated/bincode/registry_v1.ts"
import * as BincodeRegistryV2 from "./generated/bincode/registry_v2.ts"

const ComplexStruct_bc_obj: BincodeRegistryV1.ComplexStruct = {
	inner: { a: 42, b: "Hello" },
	flag: true,
	items: [
		{ $: "variant_a", $0: 10 },
		{ $: "variant_b", $0: "World" },
	],
	unit: null,
	newtype: 99,
	tuple: { $0: 123, $1: 45.67, $2: "Test" },
	tupple_inline: { $0: "SomeString", $1: 777 },
	map: new Map().set(3, 7n),
}
const ComplexStruct_pb_obj: ProtobufRegistry.ComplexStruct = {
	inner: { a: 42, b: "Hello" },
	flag: true,
	items: [
		{ variant: { $case: "variant_a", variant_a: { value: 10 } } },
		{ variant: { $case: "variant_b", variant_b: { value: "World" } } },
	],
	unit: {},
	newtype: 99,
	tuple: { first: 123, second: 45.67, third: "Test" },
	// @ts-ignore
	map: { 3: 7n }
}

await async function bench_encode() {
	let b = new Bench({ time: 1_500 })

	b.add("serdegen-bincode:v1:encode", () => {
		BincodeRegistryV1.ComplexStruct.encode(ComplexStruct_bc_obj)
	})
	b.add("serdegen-bincode:v2:encode", () => {
		BincodeRegistryV2.ComplexStruct.encode(ComplexStruct_bc_obj)
	})

	b.add("JSON:encode", () => {
		JSON.stringify(ComplexStruct_bc_obj)
	})
	
	b.add("protobuf-js-ts-proto:encode", () => {
		ProtobufRegistry.ComplexStruct.encode(ComplexStruct_pb_obj)
	})

	await b.warmup()
	await b.run()

	console.table(b.table())
}()

await async function bench_decode() {
	let b = new Bench({ time: 1_500 })

	let bincodec_encoded_v1 = BincodeRegistryV1.ComplexStruct.encode(ComplexStruct_bc_obj)
	b.add("serdegen-bincode:v1:decode", () => {
		BincodeRegistryV1.ComplexStruct.decode(bincodec_encoded_v1)
	})

	let bincodec_encoded_v2 = BincodeRegistryV2.ComplexStruct.encode(ComplexStruct_bc_obj)
	b.add("serdegen-bincode:v2:decode", () => {
		BincodeRegistryV2.ComplexStruct.decode(bincodec_encoded_v2)
	})

	let json_encoded = JSON.stringify(ComplexStruct_bc_obj)
	b.add("JSON:decode", () => {
		JSON.parse(json_encoded)
	})

	let pb_encoded = ProtobufRegistry.ComplexStruct.encode(ComplexStruct_pb_obj).finish()
	b.add("protobuf-js-ts-proto:decode", () => {
		ProtobufRegistry.ComplexStruct.decode(pb_encoded)
	})

	await b.warmup()
	await b.run()

	console.table(b.table())
}()

