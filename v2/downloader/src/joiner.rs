use csv::Writer as CsvWriter;
use serde_json::json;
use std::fs::File;
use std::io::{BufRead, BufReader, BufWriter, Write};
use zip::read::ZipArchive;

pub fn unzip_and_concatenate(
    zip_folder_path: &str,
    csv_output_file_path: &str,
    json_output_file_path: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let csv_output_file = File::create(csv_output_file_path)?;
    let mut csv_writer = CsvWriter::from_writer(csv_output_file);

    let json_output_file = File::create(json_output_file_path)?;
    let mut json_writer = BufWriter::new(json_output_file);

    let entries: Vec<_> = std::fs::read_dir(zip_folder_path)?.collect();
    let total_files = entries.len();

    csv_writer.write_record(&["ruc", "nombre", "dv", "old", "estado"])?;
    write!(json_writer, "[\n")?;

    let mut is_first = true;
    for (index, entry) in entries.into_iter().enumerate() {
        let entry = entry?;
        let file_path = entry.path();
        let path = file_path.to_str().unwrap();

        println!("Processing file {} ({}) of {}", index + 1, path, total_files);

        // Assuming all files are zip archives
        unzip_file(&file_path, &mut csv_writer, &mut json_writer, &mut is_first)?;
    }

    write!(json_writer, "\n]")?;
    Ok(())
}

fn unzip_file(
    zip_file_path: &std::path::PathBuf,
    csv_writer: &mut CsvWriter<File>,
    json_writer: &mut BufWriter<File>,
    is_first: &mut bool
) -> Result<(), Box<dyn std::error::Error>> {
    let zip_file = File::open(zip_file_path)?;
    let mut archive = ZipArchive::new(zip_file)?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        let reader = BufReader::new(&mut file);
        let mut line_number = 0;
        for line in reader.lines() {
            line_number = line_number + 1;
            let line = line?;
            let fields: Vec<&str> = line.split('|').collect();

            if fields.len() < 5 {
                return Err(Box::new(std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    format!(
                        "Line {} does not have 5 fields, it has {} fiels. Row: '{}'",
                        line_number,
                        fields.len(),
                        line
                    ),
                )));
            }

            if line_number % 10000 == 0 {
                println!("Processing line: {}", line_number);
            }

            // Map of column names to field values
            let record = vec![fields[0], fields[1], fields[2], fields[3], fields[4]];

            // Write to CSV
            csv_writer.write_record(&record)?;

            // Write to JSON
            let json = json!({
                "ruc": fields[0],
                "nombre": fields[1],
                "dv": fields[2],
                "old": fields[3],
                "estado": fields[4]
            });

            // for the trailing comma
            if *is_first {
                *is_first = false;
            } else {
                write!(json_writer, ",\n")?;
            }
            write!(json_writer, "{}", json.to_string())?;
        }
        println!("Finishing file, {} lines writed", line_number);
    }

    Ok(())
}
