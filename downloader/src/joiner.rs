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
        let path = file_path.to_str()
            .expect("Error getting file path");

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

            let nombre = fix_name_encoding(fields[1]);

            // Map of column names to field values
            let record = vec![fields[0], nombre.as_str(), fields[2], fields[3], fields[4]];

            // Write to CSV
            csv_writer.write_record(&record)?;

            // Write to JSON
            let json = json!({
                "ruc": fields[0],
                "nombre": nombre,
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

/// SET's source export can't represent 'Ñ' and drops it as a literal '?'
/// (e.g. "NU?EZ" instead of "NUÑEZ"). Restore it when the '?' sits between
/// two letters, since a real '?' never appears mid-word in a name. Any '?'
/// that doesn't fit that pattern is left alone and logged, since it may be a
/// different, not-yet-identified encoding loss (other accented letters).
fn fix_name_encoding(name: &str) -> String {
    let chars: Vec<char> = name.chars().collect();
    let mut result = String::with_capacity(name.len());

    for (i, &c) in chars.iter().enumerate() {
        if c == '?' {
            let prev_is_letter = i > 0 && chars[i - 1].is_alphabetic();
            let next_is_letter = i + 1 < chars.len() && chars[i + 1].is_alphabetic();

            if prev_is_letter && next_is_letter {
                result.push('Ñ');
                continue;
            }

            println!(
                "Warning: unresolved '?' in name '{}' at position {}, left as-is",
                name, i
            );
        }
        result.push(c);
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn replaces_question_mark_between_letters_with_enye() {
        assert_eq!(fix_name_encoding("NU?EZ ROJAS, IVAN DARIO"), "NUÑEZ ROJAS, IVAN DARIO");
        assert_eq!(fix_name_encoding("MU?OZ"), "MUÑOZ");
        assert_eq!(fix_name_encoding("IBA?EZ"), "IBAÑEZ");
    }

    #[test]
    fn leaves_names_without_question_marks_untouched() {
        assert_eq!(fix_name_encoding("PEREZ GONZALEZ, MARIA"), "PEREZ GONZALEZ, MARIA");
    }

    #[test]
    fn leaves_edge_question_marks_untouched() {
        assert_eq!(fix_name_encoding("?ROJAS"), "?ROJAS");
        assert_eq!(fix_name_encoding("ROJAS?"), "ROJAS?");
    }
}
