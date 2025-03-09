import * as Registry from "./generated/bincode/registry.ts"

export const SimpleStruct_obj: Registry.SimpleStruct = { a: 42, b: "Hello" }
export const SimpleStruct_bin = Uint8Array.from([42, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 72, 101, 108, 108, 111])

export const MultiEnum_VariantC_obj: Registry.MultiEnum = {
	$: "variant_c",
	x: 5, y: 3.14
}
export const MultiEnum_VariantC_bin = Uint8Array.from([2, 0, 0, 0, 5, 31, 133, 235, 81, 184, 30, 9, 64])

export const MultiEnum_Unit_obj: Registry.MultiEnum = { $: "unit_variant", $0: null }
export const MultiEnum_Unit_bin = Uint8Array.from([3, 0, 0, 0])

export const ComplexStruct_obj: Registry.ComplexStruct = {
	inner: { a: 42, b: "Hello" },
	flag: true,
	items: [
		{ $: "variant_a", $0: 10 },
		{ $: "variant_b", $0: "World" }
	],
	unit: null,
	newtype: 99,
	tuple: { $0: 123, $1: 45.67, $2: "Test" },
	tupple_inline: { $0: "SomeString", $1: 777 },
	map: new Map().set(3, 7n)
}
export const ComplexStruct_bin = Uint8Array.from([42, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 72, 101, 108, 108, 111, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 87, 111, 114, 108, 100, 99, 0, 0, 0, 123, 0, 0, 0, 246, 40, 92, 143, 194, 213, 70, 64, 4, 0, 0, 0, 0, 0, 0, 0, 84, 101, 115, 116, 10, 0, 0, 0, 0, 0, 0, 0, 83, 111, 109, 101, 83, 116, 114, 105, 110, 103, 9, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0])
