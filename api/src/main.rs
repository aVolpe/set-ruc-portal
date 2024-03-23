#[macro_use] extern crate rocket;
extern crate rusqlite;

mod db;
use db::get_data_from_db;

use rocket::http::Method;
use rocket::{Rocket, serde::{Serialize, json::Json}, Build, get, routes};
use rocket_cors::AllowedOrigins;


#[derive(Debug, Serialize)] // Add the Responder derive attribute
#[serde(crate = "rocket::serde")]
struct Data {
    ruc: String,
    nombre: String,
    dv: String,
    old: String,
    estado: String,
}

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
    let allowed_origins = AllowedOrigins::some_exact(&["https://set.volpe.com.py/", "http://localhost:5173/", "https://ruc.volpe.com.py"]);

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
