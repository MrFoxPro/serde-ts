import * as Registry from "./generated/bincode/registry.ts"

export const SimpleStruct_obj: Registry.SimpleStruct = { a: 42, b: "Hello" }

export const MultiEnum_VariantC_obj: Registry.MultiEnum = {
	$: "variant_c",
	x: 5, y: 3.14
}

export const MultiEnum_Unit_obj: Registry.MultiEnum = { $: "unit_variant", $0: null }

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
