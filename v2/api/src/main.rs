#[macro_use] extern crate rocket;
extern crate rusqlite;

mod db;
use db::get_data_from_db;

use rocket::{Rocket, serde::{Serialize, json::Json}, Build};


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

#[launch]
fn rocket() -> Rocket<Build> {
    rocket::build().mount("/", routes![get_data])
}