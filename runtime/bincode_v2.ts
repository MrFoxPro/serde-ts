import * as Serde from "./serde.ts";

const
	SINGLE_BYTE_MAX = 250,
	U16_BYTE  = 251, U16_MAX = 65535,
	U32_BYTE  = 252, U32_MAX = 4294967295,
	U64_BYTE  = 253, U64_MAX = 18446744073709551615n,
	U128_BYTE = 254

export class BinaryWriter extends Serde.BinaryWriter {
	// using WRITE_HEAP cache in v2 causes weird runtime error `RangeError: Invalid DataView length 77687102186155120`
	constructor() {
		super()
		this.view = new DataView(new ArrayBuffer(128))
	}
	override write_length(value: number) {
		this.write_u64(value)
	}
	override write_variant_index(value: number) {
		this.write_u32(value)
	}
	override sort_map_entries(offsets: number[]) {
		return
	}
	override write_u16(val: number) {
		if (val <= SINGLE_BYTE_MAX) return super.write_u8(val)
		super.write_u16(val)
	}
	override write_u32(val: number) {
		if (val <= SINGLE_BYTE_MAX) return super.write_u8(val)
		if (val <= U16_MAX) return super.write_u8(U16_BYTE), super.write_u16(val)
		super.write_u8(U32_BYTE), super.write_u32(val)
	}
	override write_u64(val: number | bigint) {
		if (val <= SINGLE_BYTE_MAX) return super.write_u8(Number(val))
		if (val <= U16_MAX) return super.write_u8(U16_BYTE), super.write_u16(Number(val))
		if (val <= U32_MAX) return super.write_u8(U32_BYTE), super.write_u32(Number(val))
		super.write_u8(U64_BYTE), super.write_u64(val)
	}
	override write_u128(val: number | bigint) {
		if (val <= SINGLE_BYTE_MAX) return super.write_u8(Number(val))
		if (val <= U16_MAX) return super.write_u8(U16_BYTE), super.write_u16(Number(val))
		if (val <= U32_MAX) return super.write_u8(U32_BYTE), super.write_u32(Number(val))
		if (val <= U64_MAX) return super.write_u8(U64_BYTE), super.write_u64(val)
		super.write_u8(U128_BYTE), super.write_u128(val)
	}
	override write_i16(val: number) {
		this.write_u16(val < 0 ? (~val * 2 + 1) : (val * 2))
	}
	override write_i32(val: number) {
		this.write_u32(val < 0 ? (~val * 2 + 1) : (val * 2))
	}
	override write_i64(val: number | bigint) {
		val = BigInt(val)
		this.write_u64(val < 0 ? (~val * 2n + 1n) : (val * 2n))
	}
	override write_i128(val: number | bigint) {
		val = BigInt(val)
		this.write_u128(val < 0 ? (~val * 2n + 1n) : (val * 2n))
	}
	override write_string(value: string) {
		let bytes = BinaryWriter.TEXT_ENCODER.encode(value)
		this.write_u64(bytes.length)
		new Uint8Array(this.view.buffer, this.offset).set(bytes)
		this.offset += bytes.length
	}
}

export class BinaryReader extends Serde.BinaryReader {
	override read_length() {
		return Number(this.read_u64())
	}
	override read_variant_index() {
		return this.read_u32()
	}
	override check_that_key_slices_are_increasing(key1: [number, number], key2: [number, number]) {
		return
	}
	override read_u16() {
		let d = super.read_u8()
		if (d <= SINGLE_BYTE_MAX) return d
		if (d === U16_BYTE) return super.read_u16()
		throw new Error(`invalid discriminant ${d}`)
	}
	override read_u32() {
		let d = super.read_u8()
		if (d <= SINGLE_BYTE_MAX) return d
		if (d === U16_BYTE) return super.read_u16()
		if (d === U32_BYTE) return super.read_u32()
		throw new Error(`invalid discriminant ${d}`)
	}
	override read_u64() {
		let d = super.read_u8()
		if (d <= SINGLE_BYTE_MAX) return BigInt(d)
		if (d === U16_BYTE) return BigInt(super.read_u16())
		if (d === U32_BYTE) return BigInt(super.read_u32())
		if (d === U64_BYTE) return super.read_u64()
		throw new Error(`invalid discriminant ${d}`)
	}
	override read_u128() {
		let d = super.read_u8()
		if (d <= SINGLE_BYTE_MAX) return BigInt(d)
		if (d === U16_BYTE) return BigInt(super.read_u16())
		if (d === U32_BYTE) return BigInt(super.read_u32())
		if (d === U64_BYTE) return super.read_u64()
		if (d === U128_BYTE) return super.read_u128()
		throw new Error(`invalid discriminant ${d}`)
	}
	override read_i16() {
		let n = this.read_u16()
		return n % 2 === 0 ? n / 2 : ~(n >> 1)
	}
	override read_i32() {
		let n = this.read_u32()
		return n % 2 === 0 ? n / 2 : ~(n >> 1)
	}
	override read_i64() {
		let n = this.read_u64()
		return n % 2n === 0n ? n / 2n : ~(n >> 1n)
	}
	override read_i128() {
		let n = this.read_u128()
		return n % 2n === 0n ? n / 2n : ~(n >> 1n)
	}
}
