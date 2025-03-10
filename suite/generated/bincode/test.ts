import { test, suite } from "node:test"
import * as assert from "node:assert/strict"
import * as RegistryV1 from "./registry_v1.ts"
import * as RegistryV2 from "./registry_v2.ts"
import { BinaryWriter as BinaryWriterV1 } from "../../../runtime/bincode_v1.ts"
import { BinaryWriter as BinaryWriterV2 } from "../../../runtime/bincode_v2.ts"

let writer1 = new BinaryWriterV1()
let writer2 = new BinaryWriterV2()

test(`SimpleStruct { a: 42, b: "Hello" }`, async t => {
	await t.test("v1", async t => {
		let as_object: RegistryV1.SimpleStruct = { a: 42, b: "Hello" }
		let encoded = Uint8Array.from([42, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 72, 101, 108, 108, 111])
		await t.test("encode", () => assert.deepEqual(RegistryV1.SimpleStruct.encode(as_object, writer1), encoded))
		writer1.reset()
		await t.test("decode", () => assert.deepEqual(RegistryV1.SimpleStruct.decode(encoded), as_object))
	})
	await t.test("v2", async t => {
		let as_object: RegistryV2.SimpleStruct = { a: 42, b: "Hello" }
		let encoded = Uint8Array.from([42, 5, 72, 101, 108, 108, 111])
		await t.test("encode", () => assert.deepEqual(RegistryV2.SimpleStruct.encode(as_object, writer2), encoded))
		writer2.reset()
		await t.test("decode", () => assert.deepEqual(RegistryV2.SimpleStruct.decode(encoded), as_object))
	})
})
test(`VariantC { x: 5, y: 3.14 }`, async t => {
	await t.test("v1", async t => {
		let as_object: RegistryV1.MultiEnum = { $: "variant_c", x: 5, y: 3.14 }
		let encoded = Uint8Array.from([2, 0, 0, 0, 5, 31, 133, 235, 81, 184, 30, 9, 64])
		await t.test("encode", () => assert.deepEqual(RegistryV1.MultiEnum.encode(as_object, writer1), encoded))
		writer1.reset()
		await t.test("decode", () => assert.deepEqual(RegistryV1.MultiEnum.decode(encoded), as_object))
	})
	await t.test("v2", async t => {
		let as_object: RegistryV2.MultiEnum = { $: "variant_c", x: 5, y: 3.14 }
		let encoded = Uint8Array.from([2, 5, 31, 133, 235, 81, 184, 30, 9, 64])
		await t.test("encode", () => assert.deepEqual(RegistryV2.MultiEnum.encode(as_object, writer2), encoded))
		writer2.reset()
		await t.test("decode", () => assert.deepEqual(RegistryV2.MultiEnum.decode(encoded), as_object))
	})
})
test(`UnitVariant`, async t => {
	await t.test("v1", async t => {
		let as_object: RegistryV1.MultiEnum = { $: "unit_variant", $0: null }
		let encoded = Uint8Array.from([3, 0, 0, 0])
		await t.test("encode", () => assert.deepEqual(RegistryV1.MultiEnum.encode(as_object, writer1), encoded))
		writer1.reset()
		await t.test("decode", () => assert.deepEqual(RegistryV1.MultiEnum.decode(encoded), as_object))
	})
	await t.test("v2", async t => {
		let as_object: RegistryV2.MultiEnum = { $: "unit_variant", $0: null }
		let encoded = Uint8Array.from([3])
		await t.test("encode", () => assert.deepEqual(RegistryV2.MultiEnum.encode(as_object, writer2), encoded))
		writer2.reset()
		await t.test("decode", () => assert.deepEqual(RegistryV2.MultiEnum.decode(encoded), as_object))
	})
})
test(`ComplexStruct { inner: SimpleStruct { a: 42, b: "Hello" }, flag: true, items: [VariantA(10), VariantB("World")], unit: UnitStruct, newtype: NewtypeStruct(99), tuple: TupleStruct(123, 45.67, "Test"), tupple_inline: ("SomeString", 777), map: {3: 7} }`, async t => {
	await t.test("v1", async t => {
		let as_object: RegistryV1.ComplexStruct = {
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
		let encoded = Uint8Array.from([42, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 72, 101, 108, 108, 111, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 87, 111, 114, 108, 100, 99, 0, 0, 0, 123, 0, 0, 0, 246, 40, 92, 143, 194, 213, 70, 64, 4, 0, 0, 0, 0, 0, 0, 0, 84, 101, 115, 116, 10, 0, 0, 0, 0, 0, 0, 0, 83, 111, 109, 101, 83, 116, 114, 105, 110, 103, 9, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0])
		await t.test("encode", () => assert.deepEqual(RegistryV1.ComplexStruct.encode(as_object, writer1), encoded))
		writer1.reset()
		await t.test("decode", () => assert.deepEqual(RegistryV1.ComplexStruct.decode(encoded), as_object))
	})
	await t.test("v2", async t => {
		let as_object: RegistryV2.ComplexStruct = {
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
		let encoded = Uint8Array.from([42, 5, 72, 101, 108, 108, 111, 1, 2, 0, 20, 1, 5, 87, 111, 114, 108, 100, 198, 246, 246, 40, 92, 143, 194, 213, 70, 64, 4, 84, 101, 115, 116, 10, 83, 111, 109, 101, 83, 116, 114, 105, 110, 103, 251, 18, 6, 1, 6, 14])
		await t.test("encode", () => assert.deepEqual(RegistryV2.ComplexStruct.encode(as_object, writer2), encoded))
		writer2.reset()
		await t.test("decode", () => assert.deepEqual(RegistryV2.ComplexStruct.decode(encoded), as_object))
	})
})
