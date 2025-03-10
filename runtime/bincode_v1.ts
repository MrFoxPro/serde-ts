import * as Serde from "./serde.ts";

export class BinaryReader extends Serde.BinaryReader {
	read_length() {
		return Number(this.read_u64())
	}
	public read_variant_index() {
		return this.read_u32()
	}
	check_that_key_slices_are_increasing(key1: [number, number], key2: [number, number]) {
		return
	}
}

export class BinaryWriter extends Serde.BinaryWriter {
	write_length(value: number) {
		this.write_u64(value)
	}
	public write_variant_index(val: number) {
		this.write_u32(val)
	}
	public sort_map_entries(offsets: number[]) {
		return
	}
}
