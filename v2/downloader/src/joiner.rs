use std::fs::File;
use std::io::{self, BufWriter, Read, Write};

pub fn unzip_and_concatenate(zip_folder_path: &str, output_file_path: &str) -> io::Result<()> {
    let output_file = File::create(output_file_path)?;
    let mut output_writer = BufWriter::new(output_file);

    for entry in std::fs::read_dir(zip_folder_path)? {
        let entry = entry?;
        let file_path = entry.path();

        // Assuming all files are zip archives
        if let Some(extension) = file_path.extension() {
            if extension == "zip" {
                unzip_file(&file_path, &mut output_writer)?;
            } else {
                return Err(io::Error::new(
                    io::ErrorKind::InvalidInput,
                    format!("File '{}' doesn't have a '.zip' extension", file_path.display()),
                ));
            }
        }
    }

    Ok(())
}

fn unzip_file(zip_file_path: &std::path::PathBuf, output_writer: &mut dyn Write) -> io::Result<()> {
    let zip_file = File::open(zip_file_path)?;
    let mut archive = zip::read::ZipArchive::new(zip_file)?;


    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        let mut buffer = Vec::new();
        file.read_to_end(&mut buffer)?;

        output_writer.write_all(&buffer)?;
    }

    Ok(())
}

