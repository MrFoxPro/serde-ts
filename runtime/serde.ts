export type Optional<T> = T | null
export type Seq<T> = T[]
export type Tuple<T extends any[]> = {
	[K in keyof T as `$${Exclude<K, keyof any[]> extends string ? Exclude<K, keyof any[]> : never}`]: T[K]
}
export type ListTuple<T extends any[]> = Tuple<T>[]
export type Map<K, V> = globalThis.Map<K, V>

export type unit = null
export type bool = boolean
export type i8 = number
export type i16 = number
export type i32 = number
export type i64 = bigint
export type i128 = bigint
export type u8 = number
export type u16 = number
export type u32 = number
export type u64 = bigint
export type u128 = bigint
export type f32 = number
export type f64 = number
export type char = string
export type str = string
export type bytes = Uint8Array

export interface Reader {
	read_string(): string
	read_bool(): boolean
	read_unit(): null
	read_char(): string
	read_f32(): number
	read_f64(): number
	read_u8(): number
	read_u16(): number
	read_u32(): number
	read_u64(): bigint
	read_u128(): bigint
	read_i8(): number
	read_i16(): number
	read_i32(): number
	read_i64(): bigint
	read_i128(): bigint
	read_length(): number
	read_variant_index(): number
	read_option_tag(): boolean
	read_list<T>(read_fn: () => T, length?: number): T[]
	read_map<K, V>(read_key: () => K, read_value: () => V): Map<K, V>
	check_that_key_slices_are_increasing(key1: [number, number], key2: [number, number]): void
}

export interface Writer {
	write_string(value: string): void
	write_bool(value: boolean): void
	write_unit(value: null): void
	write_char(value: string): void
	write_f32(value: number): void
	write_f64(value: number): void
	write_u8(value: number): void
	write_u16(value: number): void
	write_u32(value: number): void
	write_u64(value: bigint | number): void
	write_u128(value: bigint | number): void
	write_i8(value: number): void
	write_i16(value: number): void
	write_i32(value: number): void
	write_i64(value: bigint | number): void
	write_i128(value: bigint | number): void
	write_length(value: number): void
	write_variant_index(value: number): void
	write_option_tag(value: boolean): void
	write_map<K, V>(value: Map<K, V>, write_key: (key: K) => void, write_value: (value: V) => void): void
	get_bytes(): Uint8Array
	sort_map_entries(offsets: number[]): void
}

export const
	BIG_32 = 32n,
	BIG_64 = 64n,
	BIG_32Fs = 429967295n,
	BIG_64Fs = 18446744073709551615n

export const WRITE_DEFAULT_HEAP_SIZE = 128

export abstract class BinaryWriter implements Writer {
	public static readonly TEXT_ENCODER = new TextEncoder()

	public view = new DataView(new ArrayBuffer(WRITE_DEFAULT_HEAP_SIZE))
	public offset = 0

	protected alloc(alloc_length: number) {
		let wish_size = this.offset + alloc_length

		let current_length = this.view.buffer.byteLength
		if (wish_size > current_length) {
			let new_buffer_length = current_length
			while (new_buffer_length < wish_size) new_buffer_length = new_buffer_length << 1

			// TODO: there is new API for resizing buffer, but in Node it seems to be slower then allocating new
			// this.buffer.resize(newBufferLength)

			let new_buffer = new Uint8Array(new_buffer_length)
			new_buffer.set(new Uint8Array(this.view.buffer))

			this.view = new DataView(new_buffer.buffer)
		}
	}

	abstract write_length(value: number): void
	abstract write_variant_index(value: number): void
	abstract sort_map_entries(offsets: number[]): void

	// https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encodeInto#buffer_sizing
	public write_string(val: string) {
		// allocate space for string length marker and whole string
		this.alloc(8 + val.length * 3)

		// encode into buffer with space for string length (u64)
		let { written: length } = BinaryWriter.TEXT_ENCODER.encodeInto(val, new Uint8Array(this.view.buffer, this.offset + 8))

		let b_length = BigInt(length)
		this.view.setBigUint64(this.offset, b_length, true)
		this.offset += (8 + length)
	}

	public write_bool(val: boolean) {
		this.write_u8(val ? 1 : 0)
	}

	public write_unit(_val: null) {
		return
	}

	public write_u8(val: number) {
		this.alloc(1)
		this.view.setUint8(this.offset, val)
		this.offset += 1
	}

	public write_u16(val: number) {
		this.alloc(2)
		this.view.setUint16(this.offset, val, true)
		this.offset += 2
	}

	public write_u32(val: number) {
		this.alloc(4)
		this.view.setUint32(this.offset, val, true)
		this.offset += 4
	}

	public write_u64(val: bigint | number) {
		this.alloc(8)
		this.view.setBigUint64(this.offset, BigInt(val), true)
		this.offset += 8
	}

	public write_u128(val: bigint | number) {
		let low = BigInt(val) & BIG_64Fs, high = BigInt(val) >> BIG_64

		// write little endian number
		this.write_u64(low)
		this.write_u64(high)
	}

	public write_i8(val: number) {
		this.alloc(1)
		this.view.setInt8(this.offset, val)
		this.offset += 1
	}

	public write_i16(val: number) {
		this.alloc(2)
		this.view.setInt16(this.offset, val, true)
		this.offset += 2
	}

	public write_i32(val: number) {
		this.alloc(4)
		this.view.setInt32(this.offset, val, true)
		this.offset += 4
	}

	public write_i64(val: bigint | number) {
		this.alloc(8)
		this.view.setBigInt64(this.offset, BigInt(val), true)
		this.offset += 8
	}

	public write_i128(val: bigint | number) {
		let low = BigInt(val) & BIG_64Fs, high = BigInt(val) >> BIG_64

		// write little endian number
		this.write_i64(low)
		this.write_i64(high)
	}

	public write_option_tag(value: boolean) {
		this.write_bool(value)
	}

	public write_map<T, V>(map: Map<T, V>, write_key: (key: T) => void, write_value: (value: V) => void) {
		this.write_length(map.size)
		let offsets: number[] = []
		for (let [k, v] of map.entries()) {
			offsets.push(this.offset)
			write_key(k), write_value(v)
		}
		this.sort_map_entries(offsets)
	}

	public write_f32(val: number) {
		this.alloc(4)
		this.view.setFloat32(this.offset, val, true)
		this.offset += 4
	}

	public write_f64(val: number) {
		this.alloc(8)
		this.view.setFloat64(this.offset, val, true)
		this.offset += 8
	}

	public write_char(_val: string) {
		throw new Error("Method serializeChar not implemented.")
	}

	public get_bytes() {
		return new Uint8Array(this.view.buffer).subarray(0, this.offset)
	}

	public reset() {
		this.offset = 0
	}
}

export abstract class BinaryReader implements Reader {
	private static readonly TEXT_DECODER = new TextDecoder()

	public offset = 0
	public view: DataView

	constructor(data: Uint8Array) {
		this.view = new DataView(data.buffer)
	}

	abstract read_length(): number
	abstract read_variant_index(): number
	abstract check_that_key_slices_are_increasing(key1: [number, number], key2: [number, number]): void

	public read_string() {
		let length = this.read_length()
		if (length === 0) return ""
		let decoded = BinaryReader.TEXT_DECODER.decode(new DataView(this.view.buffer, this.offset, length))
		this.offset += length
		return decoded
	}

	public read_bool() {
		return this.read_u8() === 1
	}

	public read_unit() {
		return null
	}

	public read_u8() {
		let value = this.view.getUint8(this.offset)
		this.offset += 1
		return value
	}

	public read_u16() {
		let value = this.view.getUint16(this.offset, true)
		this.offset += 2
		return value
	}

	public read_u32() {
		let value = this.view.getUint32(this.offset, true)
		this.offset += 4
		return value
	}

	public read_u64() {
		let value = this.view.getBigUint64(this.offset, true)
		this.offset += 8
		return value
	}

	public read_u128() {
		let low = this.read_u64(), high = this.read_u64()
		return (high << BIG_64) | low
	}

	public read_i8() {
		let val = this.view.getInt8(this.offset)
		this.offset += 1
		return val
	}

	public read_i16() {
		let val = this.view.getInt16(this.offset, true)
		this.offset += 2
		return val
	}

	public read_i32() {
		let val = this.view.getInt32(this.offset, true)
		this.offset += 4
		return val
	}

	public read_i64() {
		let val = this.view.getBigInt64(this.offset, true)
		this.offset += 8
		return val
	}

	public read_i128() {
		let low = this.read_i64(), high = this.read_i64()
		return (high << BIG_64) | low
	}

	public read_option_tag = this.read_bool

	public read_list<T>(read_fn: () => T, list_len?: number) {
		let length = list_len ?? this.read_length(), list = new Array<T>(length)
		for (let i = 0; i < length; i++) list[i] = read_fn()
		return list
	}

	public read_map<K, V>(read_key: () => K, read_value: () => V) {
		let length = this.read_length(), map = new Map<K, V>()
		// let pkey_start = 0, pkey_end = 0
		for (let i = 0; i < length; i++) {
			// let key_start = this.offset, key = read_key(), key_end = this.offset
			// if (i > 0) this.check_that_key_slices_are_increasing([pkey_start, pkey_end], [key_start, key_end])
			// pkey_start = key_start, pkey_end = key_end
			map.set(read_key(), read_value())
		}
		return map
	}

	public read_char(): string {
		throw new Error("Method read_char not implemented.")
	}

	public read_f32() {
		let val = this.view.getFloat32(this.offset, true)
		this.offset += 4
		return val
	}

	public read_f64() {
		let val = this.view.getFloat64(this.offset, true)
		this.offset += 8
		return val
	}
}
