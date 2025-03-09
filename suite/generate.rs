use std::{collections::HashMap, error::Error, fs, io::Write};
use serde::{Deserialize, Serialize};
use bincode::{Encode, Decode};
use serde_reflection::{Registry, Tracer, TracerConfig};
use serde_generate::{CodeGeneratorConfig, Encoding};
use serde_generate_ts::CodeGenerator as TsCodeGenerator;

fn main() -> Result<(), Box<dyn Error>> {
	let mut tracer = Tracer::new(TracerConfig::default());

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

	tracer.trace_simple_type::<SimpleStruct>()?;
	tracer.trace_simple_type::<MultiEnum>()?;
	tracer.trace_simple_type::<UnitStruct>()?;
	tracer.trace_simple_type::<NewtypeStruct>()?;
	tracer.trace_simple_type::<TupleStruct>()?;
	tracer.trace_simple_type::<ComplexStruct>()?;

	let simple_struct = SimpleStruct { a: 42, b: "Hello".into() };
	let multienum_variantc = MultiEnum::VariantC { x: 5, y: 3.14 };
	let multienum_unit = MultiEnum::UnitVariant;
	let complex_instance = ComplexStruct {
		inner: simple_struct.clone(),
		flag: true,
		items: vec![MultiEnum::VariantA(10), MultiEnum::VariantB("World".into())],
		unit: UnitStruct,
		newtype: NewtypeStruct(99),
		tuple: TupleStruct(123, 45.67, "Test".into()),
		tupple_inline: ("SomeString".into(), 777),
		map: HashMap::from_iter([(3, 7)])
	};

	let registry = tracer.registry()?;

	const ROOT: &str = env!("CARGO_MANIFEST_DIR");
	let mut bin_file = fs::OpenOptions::new().create(true).write(true).open(format!("{ROOT}/suite/generated/bincode/data_bin.ts"))?;

	fn add_bin_def(file: &mut fs::File, name: &'static str, item: impl Encode) -> Result<(), Box<dyn Error>> {
		let bytes = bincode::encode_to_vec(&item, bincode::config::legacy())?;
		writeln!(file, "export let {name}_bin = Uint8Array.from({bytes:?})")?;
		Ok(())
	}

	add_bin_def(&mut bin_file, "SimpleStruct", simple_struct)?;
	add_bin_def(&mut bin_file, "MultiEnum_VariantC", multienum_variantc)?;
	add_bin_def(&mut bin_file, "MultiEnum_Unit", multienum_unit)?;
	add_bin_def(&mut bin_file, "ComplexStruct", complex_instance)?;
	std::mem::drop(bin_file);

	let mut source = Vec::new();
	let config = CodeGeneratorConfig::new("".into()).with_encodings(vec![Encoding::Bincode]);
	TsCodeGenerator::new(&config, ".").output(&mut source, &registry)?;
	fs::write(format!("{ROOT}/suite/generated/bincode/registry.ts"), source)?;

	Ok(())
}
