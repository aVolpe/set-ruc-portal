extern crate rusqlite;
extern crate serde;

use rusqlite::{params, params_from_iter, Connection, Error, Result};
use serde::Serialize;
use std::env;

#[derive(Debug, Serialize)]
pub struct Data {
    ruc: String,
    name: String,
    dv: String,
    old: String,
    state: String,
}

fn handle_string_case(
    query: String,
    per_page: usize,
    offset: usize,
    conn: &Connection,
) -> Result<Vec<Data>, rusqlite::Error> {
    let binding = query.to_uppercase();
    let words = binding.split_whitespace();

    let mut parameters = Vec::new();
    let mut sql = String::from("SELECT * FROM rucs WHERE ");
    for (i, word) in words.enumerate() {
        if i != 0 {
            sql.push_str(" AND ");
        }
        sql.push_str(&format!("name LIKE ?{}", i + 1));
        parameters.push(format!("%{}%", word));
    }
    
    sql.push_str("ORDER BY ruc ASC");

    sql.push_str(&format!(
        " LIMIT ?{} OFFSET ?{}",
        parameters.len() + 1,
        parameters.len() + 2
    ));

    parameters.push(per_page.to_string());
    parameters.push(offset.to_string());
    println!("sql: {}, params: {}", sql, parameters.join(", "));

    let mut stmt = conn.prepare(&sql)?;
    
    let data_iter = stmt.query_map(params_from_iter(parameters), map)
        .expect(&format!("Error doing query '{}'", sql));

    Ok(to_vec(data_iter))
}

fn handle_number_case(
    query: String,
    per_page: usize,
    offset: usize,
    conn: &Connection,
) -> Result<Vec<Data>, rusqlite::Error> {
    let sql = "SELECT * FROM rucs WHERE ruc LIKE ?1 LIMIT ?2 OFFSET ?3";
    let mut stmt = conn.prepare(sql)?;

    let params = params![format!("%{}%", query), per_page, offset];

    println!("Query: {}, params: query={}, per_page={}, offset={}", sql, format!("%{}%", query), per_page.to_string(), offset.to_string());
    let data_iter = stmt.query_map(
        params, 
        map
    ).expect(&format!("Error doing query '{}'", sql));


    Ok(to_vec(data_iter))
}

fn to_vec(iter: impl Iterator<Item = Result<Data, Error>>) -> Vec<Data> {
    let mut data = Vec::new();
    for data_result in iter {
        data.push(data_result.expect("Error extracting row"));
    }
    return data;
}


fn get_db_path() -> String {
    let db_env_name = "DB_PATH";
    return match env::var(db_env_name) {
        Ok(val) => val,
        Err(_) => {
            // Fallback value if the environment variable doesn't exist
            println!("Environment variable '{}' not found, falling back to default value.", db_env_name);
            "db.db".to_string()
        }
    };
}

fn map(row: &rusqlite::Row) -> Result<Data, rusqlite::Error> {
    Ok(Data {
        ruc: row.get(0)?,
        name: row.get(1)?,
        dv: row.get(2)?,
        old: row.get(3)?,
        state: row.get(4)?,
    })
}

pub fn get_data_from_db(
    query: String,
    per_page: usize,
    offset: usize,
) -> Result<Vec<Data>, rusqlite::Error> {
    let conn = Connection::open(get_db_path())?;

    if query.chars().all(char::is_numeric) {
        println!("Querying as number");
        handle_number_case(query, per_page, offset, &conn)
    } else {
        println!("Querying as name");
        handle_string_case(query, per_page, offset, &conn)
    }
}
