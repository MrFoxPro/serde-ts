import { test, suite } from "node:test"
import * as assert from "node:assert/strict"
import * as Data from "./data.ts"
import * as DataBin from "./generated/bincode/data_bin.ts"
import * as Registry from "./generated/bincode/registry.ts"

suite("encode", () => {
	test("SimpleStruct", () => {
		const simple_instance = Registry.SimpleStruct.encode(Data.SimpleStruct_obj)
		assert.deepEqual(simple_instance, DataBin.SimpleStruct_bin)
	})
	test("MultiEnum_VariantC", () => {
		const enum_instance = Registry.MultiEnum.encode(Data.MultiEnum_VariantC_obj)
		assert.deepEqual(enum_instance, DataBin.MultiEnum_VariantC_bin)
	})
	test("MultiEnum unit variant", () => {
		const unit_variant = Registry.MultiEnum.encode(Data.MultiEnum_Unit_obj)
		assert.deepEqual(unit_variant, DataBin.MultiEnum_Unit_bin)
	})
	test("ComplexStruct", () => {
		const complex_instance = Registry.ComplexStruct.encode(Data.ComplexStruct_obj)
		assert.deepEqual(complex_instance, DataBin.ComplexStruct_bin)
	})

	test("ComplexStruct", () => {
		const complex_instance = Registry.ComplexStruct.encode(Data.ComplexStruct_obj)
		assert.deepEqual(complex_instance, DataBin.ComplexStruct_bin)
	})

	test("MultiEnum unit variant", () => {
		const bin = Registry.MultiEnum.encode({ $: "unit_variant" })
		assert.deepEqual(bin, DataBin.MultiEnum_Unit_bin)
	})
})

suite("decode", () => {
	test("MultiEnum", () => {
		const enum_instance = Registry.MultiEnum.decode(DataBin.MultiEnum_VariantC_bin)
		assert.deepEqual(enum_instance, Data.MultiEnum_VariantC_obj)
	})

	test("MultiEnum unit variant", () => {
		const unit_variant = Registry.MultiEnum.decode(DataBin.MultiEnum_Unit_bin)
		assert.deepEqual(unit_variant, Data.MultiEnum_Unit_obj)
	})

	test("ComplexStruct", () => {
		const complex_instance = Registry.ComplexStruct.decode(DataBin.ComplexStruct_bin)
		assert.deepEqual(complex_instance, Data.ComplexStruct_obj)
	})
})
