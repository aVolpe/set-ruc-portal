mod scraper;
mod downloader;
mod joiner;

use std::{fs,process};
use crate::scraper::download_links;
use crate::downloader::download_list;
use crate::joiner::unzip_and_concatenate;

const LOCAL_FOLDER: &str = "./.downloaded_files";
const OUTPUT_FILE_PATH: &str = "./output/data.csv";
const OUTPUT_FILE_PATH_JSON: &str = "./output/data.json";

#[tokio::main]
async fn main() {
    println!("Preparing folders");
    let folders = vec![LOCAL_FOLDER, "./output"];
    ensure_folder_exists(&folders)
        .unwrap();

    println!("Folders '{:?}' ready, fetching page", folders);

    let links = match download_links().await {
        Ok(list) => list,
        Err(err) => { 
            eprintln!("Error fetching links: {:?}", err); 
            process::exit(1);
        }
    };

    for link in links.iter() {
        println!("Name: {}, Link: {}", link.name, link.link);
    }


    let downloaded_files = match download_list(LOCAL_FOLDER, &links).await {
        Ok(list) => list,
        Err(err) => { 
            eprintln!("Error downloading files: {:?}", err); 
            process::exit(1);
        }
    };

    for downloaded_file in downloaded_files {
        println!("Downloaded: {}", downloaded_file);
    }

    match unzip_and_concatenate(LOCAL_FOLDER, OUTPUT_FILE_PATH, OUTPUT_FILE_PATH_JSON) {
        Ok(()) => println!("Files successfully concatenated to: {}", OUTPUT_FILE_PATH),
        Err(err) => { 
            eprintln!("Error unzipping files: {:?}", err); 
            process::exit(1);
        }
    }
}

fn ensure_folder_exists(folder_path: &Vec<&str>) -> Result<(), std::io::Error> {
    for dir in folder_path {
        fs::create_dir_all(dir)?;
    }
    Ok(())
}
