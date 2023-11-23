mod scraper;

use std::process;
use crate::scraper::download_links;


#[tokio::main]
async fn main() {
    println!("Downloading links");
    let download_result = download_links().await;
    if download_result.is_err() {
        let err = download_result.err().unwrap();
        eprintln!("Error downloading links: {}", err);
        process::exit(1);
    };
    let links = download_result.unwrap();

    for link in links {
        println!("Name: {}, Link: {}", link.name, link.link);
    }
}
