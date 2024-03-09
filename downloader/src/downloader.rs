use std::fs::File;
use std::io::Cursor;
use std::path::Path;
use std::time::{SystemTime, Duration};
use crate::scraper::ScrappedInfo;

pub async fn download_list(
    target_folder: &str,
    files: &Vec<ScrappedInfo>

    ) -> Result<Vec<String>, Box<dyn std::error::Error>> {

    let mut to_ret = Vec::new();
    let download_dir = Path::new(target_folder);

    for file_info in files {
        let save_path = download_dir.join(&file_info.name);

        let downloaded_file : String = 
            download_file(&file_info.link, &save_path)
            .await
            .unwrap();

        to_ret.push(downloaded_file);
    }
    return Ok(to_ret);
}

fn is_recent_download(local_file_path: &Path) -> bool {
    let now = SystemTime::now();
    let last_modified_timestamp = match local_file_path.metadata() {
        Ok(metadata) => metadata.modified().unwrap(),
        _ => return false,
    };

    let time_elapsed = now.duration_since(last_modified_timestamp).unwrap();
    let max_age = Duration::from_secs(3600 * 24 * 30); // Check for updates every 30 days

    time_elapsed < max_age
}

async fn download_file(url: &String, save_path: &Path) -> Result<String, Box<dyn std::error::Error>> {
    if save_path.exists() && is_recent_download(save_path) {
        println!("File {} already downloaded recently, skipping.", save_path.display());
        return Ok(url.clone());
    }

    println!("File {} not found, downloading from url {}", save_path.display(), url);
    let resp = reqwest::Client::new()
        .get(url.as_str())
        .send()
        .await?;


    let mut out = File::create(save_path)?;
    let mut content =  Cursor::new(resp.bytes().await?);

    std::io::copy(&mut content, &mut out)?;
    Ok(url.clone())
}

