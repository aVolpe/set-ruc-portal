mod scraper;
mod downloader;

use std::{fs,process};
use crate::scraper::download_links;
use crate::downloader::download_list;

const LOCAL_FOLDER: &str = "./.downloaded_files";

#[tokio::main]
async fn main() {
    println!("Preparing folders");
    ensure_folder_exists(LOCAL_FOLDER)
        .unwrap();

    println!("Folders ready, fetching page");

    let download_result = download_links().await;
    if download_result.is_err() {
        let err = download_result.err().unwrap();
        eprintln!("Error downloading links: {}", err);
        process::exit(1);
    };
    let links = download_result.unwrap();

    for link in links.iter() {
        println!("Name: {}, Link: {}", link.name, link.link);
    }

    let downloaded_files = download_list(LOCAL_FOLDER, &links)
        .await
        .unwrap();

    for downloaded_file in downloaded_files {
        println!("Downloaded: {}", downloaded_file);
    }
}

fn ensure_folder_exists(folder_path: &str) -> Result<(), std::io::Error> {
    fs::create_dir_all(folder_path)?;
    Ok(())
}
