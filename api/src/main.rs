#[macro_use] extern crate rocket;
extern crate rusqlite;

mod db;
use db::get_data_from_db;

use std::env;
use rocket::http::Method;
use rocket::{Rocket, serde::json::Json, Build, get, routes};
use rocket_cors::AllowedOrigins;


#[get("/api/data?<query>&<page>&<per_page>")]
fn get_data(query: String, page: Option<usize>, per_page: Option<usize>) -> Json<Vec<db::Data>> {
    let per_page = per_page.unwrap_or(100).min(100);
    let offset = (page.unwrap_or(1) - 1) * per_page;

    Json(get_data_from_db(query, per_page, offset).expect("invalid params"))
}

#[get("/find?<query>&<page>&<per_page>")]
fn find(query: String, page: Option<usize>, per_page: Option<usize>) -> Json<Vec<db::Data>> {
    let per_page = per_page.unwrap_or(100).min(100);
    let offset = (page.unwrap_or(1) - 1) * per_page;

    Json(get_data_from_db(query, per_page, offset).expect("invalid params"))
}

#[launch]
fn rocket() -> Rocket<Build> {

    // get cors domains and print to console:
    let cors_domains = get_cors();
    println!("CORS_DOMAINS: {:?}", cors_domains);
    let allowed_origins = AllowedOrigins::some_exact(cors_domains.as_slice());

    // You can also deserialize this
    let cors = rocket_cors::CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get].into_iter().map(From::from).collect(),
        allow_credentials: false,
        ..Default::default()
    }
    .to_cors().expect("Invalid cors config");

    rocket::build()
        .attach(cors)
        .mount("/", routes![get_data, find])
}


// Returns a list of valid domains for cors,
// it uses the CORS_DOMAINS environment variable
fn get_cors() -> Vec<String> {
    let db_env_name = "CORS_DOMAINS";
    return match env::var(db_env_name) {
        Ok(val) => val.split(",")
            .map(|s| s.trim())
            .map(|s| s.to_string())
            .collect(),
        Err(_) => {
            // Fallback value if the environment variable doesn't exist
            println!("Environment variable '{}' not found, falling back to default value.", db_env_name);
            return vec!["https://set.volpe.com.py/".to_string(), "http://localhost:5173/".to_string(), "https://ruc.volpe.com.py".to_string()]
        }
    };
}
