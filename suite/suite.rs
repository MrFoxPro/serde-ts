#![allow(unused)]

use std::{collections::HashMap, error::Error, fs, io::Write};
use indoc::{formatdoc, writedoc};
use serde::{Deserialize, Serialize};
use bincode::{Encode, Decode};
use serde_reflection::{Tracer, TracerConfig};
use serde_generate::{CodeGeneratorConfig, Encoding};
use serde_generate_ts::CodeGenerator as TsCodeGenerator;

type AResult<T> = Result<T, Box<dyn Error>>;
const ROOT: &str = env!("CARGO_MANIFEST_DIR");

fn main() -> AResult<()> {
	println!("printing registry");
	print_registry()?;

	println!("printing tests");
	print_tests()?;

	Ok(())
}

fn print_tests() -> AResult<()> {
	let mut out = fs::OpenOptions::new()
		.create(true).truncate(true).write(true)
		.open(format!("{ROOT}/suite/generated/bincode/test.ts"))?;

	writedoc!(out, r#"
		import {{ test, suite }} from "node:test"
		import * as assert from "node:assert/strict"
		import * as RegistryV1 from "./registry_v1.ts"
		import * as RegistryV2 from "./registry_v2.ts"
		import {{ BinaryWriter as BinaryWriterV1 }} from "../../../runtime/bincode_v1.ts"
		import {{ BinaryWriter as BinaryWriterV2 }} from "../../../runtime/bincode_v2.ts"

		let writer1 = new BinaryWriterV1()
		let writer2 = new BinaryWriterV2()
	"#);
	writeln!(out);

	fn add_test(file: &mut fs::File, item: impl Encode + std::fmt::Debug, js_obj: &'static str) -> AResult<()> {
		let name = std::any::type_name_of_val(&item).split_once("::").unwrap().1;
		let id = format!("{item:?}");
		let (bytes_v1, bytes_v2) = (
			bincode::encode_to_vec(&item, bincode::config::legacy())?,
			bincode::encode_to_vec(&item, bincode::config::standard())?
		);
		writedoc!(file, r#"
			test(`{id}`, async t => {{
				await t.test("v1", async t => {{
					let as_object: RegistryV1.{name} = {js_obj}
					let encoded = Uint8Array.from({bytes_v1:?})
					await t.test("encode", () => assert.deepEqual(RegistryV1.{name}.encode(as_object, writer1), encoded))
					writer1.reset()
					await t.test("decode", () => assert.deepEqual(RegistryV1.{name}.decode(encoded), as_object))
				}})
				await t.test("v2", async t => {{
					let as_object: RegistryV2.{name} = {js_obj}
					let encoded = Uint8Array.from({bytes_v2:?})
					await t.test("encode", () => assert.deepEqual(RegistryV2.{name}.encode(as_object, writer2), encoded))
					writer2.reset()
					await t.test("decode", () => assert.deepEqual(RegistryV2.{name}.decode(encoded), as_object))
				}})
			}})
		"#)?;
		Ok(())
	}

	let simple_struct = SimpleStruct { a: 42, b: "Hello".into() };
	add_test(&mut out, &simple_struct, r#"{ a: 42, b: "Hello" }"#)?;

	let multienum_variantc = MultiEnum::VariantC { x: 5, y: 3.14 };
	add_test(&mut out, &multienum_variantc, r#"{ $: "variant_c", x: 5, y: 3.14 }"#)?;

	let multienum_unit = MultiEnum::UnitVariant;
	add_test(&mut out, &multienum_unit, r#"{ $: "unit_variant", $0: null }"#)?;

	let complex_instance = ComplexStruct {
		inner: simple_struct,
		flag: true,
		items: vec![MultiEnum::VariantA(10), MultiEnum::VariantB("World".into())],
		unit: UnitStruct,
		newtype: NewtypeStruct(99),
		tuple: TupleStruct(123, 45.67, "Test".into()),
		tupple_inline: ("SomeString".into(), 777),
		map: HashMap::from_iter([(3, 7)])
	};
	add_test(&mut out, &complex_instance,
		r#"{
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
		}"#
	)?;

	Ok(())
}

#[derive(Clone, Debug, Serialize, Deserialize, Encode, Decode)]
struct SimpleStruct {
	a: u32,
	b: String,
}

#[derive(Debug, Serialize, Deserialize, Encode, Decode)]
enum MultiEnum {
	VariantA(i32),
	VariantB(String),
	VariantC { x: u8, y: f64 },
	UnitVariant,
}

#[derive(Debug, Serialize, Deserialize, Encode, Decode)]
struct UnitStruct;

#[derive(Debug, Serialize, Deserialize, Encode, Decode)]
struct NewtypeStruct(i32);

#[derive(Debug, Serialize, Deserialize, Encode, Decode)]
struct TupleStruct(i32, f64, String);

#[derive(Debug, Serialize, Deserialize, Encode, Decode)]
struct ComplexStruct {
	inner: SimpleStruct,
	flag: bool,
	items: Vec<MultiEnum>,
	unit: UnitStruct,
	newtype: NewtypeStruct,
	tuple: TupleStruct,
	tupple_inline: (String, i32),
	map: HashMap<i32, i64>
}

fn print_registry() -> AResult<()> {
	let mut tracer = Tracer::new(TracerConfig::default());

	tracer.trace_simple_type::<SimpleStruct>()?;
	tracer.trace_simple_type::<MultiEnum>()?;
	tracer.trace_simple_type::<UnitStruct>()?;
	tracer.trace_simple_type::<NewtypeStruct>()?;
	tracer.trace_simple_type::<TupleStruct>()?;
	tracer.trace_simple_type::<ComplexStruct>()?;

	let registry = tracer.registry()?;
	let config = CodeGeneratorConfig::new(Default::default()).with_encodings(vec![Encoding::Bincode]);

	let mut out = fs::OpenOptions::new()
		.create(true).truncate(true).write(true)
		.open(format!("{ROOT}/suite/generated/bincode/registry_v1.ts"))?;

	writeln!(out, r#"import type * as $t from "../../../runtime/serde.ts""#);
	writeln!(out, r#"import {{ BinaryReader, BinaryWriter }} from "../../../runtime/bincode_v1.ts""#);

	TsCodeGenerator::new(&config).output(&mut out, &registry)?;

	let mut out = fs::OpenOptions::new()
		.create(true).truncate(true).write(true)
		.open(format!("{ROOT}/suite/generated/bincode/registry_v2.ts"))?;

	writeln!(out, r#"import type * as $t from "../../../runtime/serde.ts""#);
	writeln!(out, r#"import {{ BinaryReader, BinaryWriter }} from "../../../runtime/bincode_v2.ts""#);

	TsCodeGenerator::new(&config).output(&mut out, &registry)?;

	Ok(())
}
