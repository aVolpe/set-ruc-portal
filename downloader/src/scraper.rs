use select::document::Document;
use select::predicate::Class;
use std::fs;
use chrono::{DateTime, Utc};
use std::io::Write;
use url::Url;

#[derive(Debug, Clone)]
pub struct ScrappedInfo {
    pub name: String,
    pub link: String,
}

const BASE_URL: &str = "https://www.set.gov.py/web/portal-institucional/listado-de-ruc-con-sus-equivalencias";

pub async fn download_links() -> Result<Vec<ScrappedInfo>, Box<dyn std::error::Error>> {

    let page = download_page().await;
    // Parse the HTML document
    let document = Document::from(page?.as_str());

    let mut to_ret = Vec::new();

    // Select links based on the specified CSS selector
    // div.list__item:nth-child(1) > div:nth-child(3) > a:nth-child(1)"
    for node in document.find(Class("list__item")) {
        let title = node.find(Class("item__title"))
            .next()
            .expect(&format!("Can't get 'item__title' from node: {:?}", node.html()))
            .text();
        println!("Found file: {}", title);

        let link_wrapper = node.find(Class("item__links"))
            .next()
            .expect(&format!("Can't get 'item__links' from node: {:?}", node.html()));    

        let link = link_wrapper.find(Class("link"))
            .next()
            .expect(&format!("Can't get 'link' from node: {:?}", link_wrapper.html()))
            .attr("href")
            .expect(&format!("Can't get 'href' from node: {:?}", link_wrapper.html()));

        to_ret.push(ScrappedInfo { 
            name: title, 
            link: make_absolute_url(BASE_URL, link)
        });
    }

    Ok(to_ret)
}

async fn download_page() -> Result<String, Box<dyn std::error::Error>> {

    let local_path = ".equivalencias.html";

    // Check if the local file exists and is not too old
    if let Ok(metadata) = fs::metadata(&local_path) {
        println!("Found file {}, checking if is recent", local_path);
        let last_modified: DateTime<Utc> = metadata.modified()?.into();
        let current_time: DateTime<Utc> = Utc::now();
        let age = current_time.signed_duration_since(last_modified);

        // Define a threshold for considering the file as too old (e.g., 1 day)
        let max_age = chrono::Duration::days(1);

        if age < max_age {
            // Read the HTML from the local file
            println!("Found recent file {}, using it", local_path);
            let html = fs::read_to_string(&local_path)?;
            return Ok(html);
        }
    }
    // Target URL

    println!("Calling url {}", BASE_URL);
    let client = reqwest::Client::new();
    // Make a GET request
    let response = client.get(BASE_URL)
        .send()
        .await?;

    println!("response: {}", response.status());
    let body = response
        .text()
        .await?;
    println!("Writing file to local cache {}", local_path);
    let mut file = fs::File::create(&local_path)?;
    file.write_all(body.as_bytes())?;
    return Ok(body);
}

fn make_absolute_url(base_url: &str, relative_url: &str) -> String {
    let base = Url::parse(base_url).expect("Failed to parse base URL");
    let absolute = base.join(relative_url).expect("Failed to join URLs");
    absolute.to_string()
}
