const {Database} = require('sqlite3');

exports.DBHelper = class {

  constructor() {

    this.dbName = process.env.DB_PATH || './temp/db.db';
    this.maxResults = 100;
  }

  async getDB() {
    if (this.db) return this.db;
    this.db = new Database(this.dbName);
    return this.db;
  }

  /**
   * The callback receives true if the
   * database has elements, or else false.
   */
  async hasData() {

    const db = await this.getDB();


    return new Promise((res) => {
      db.get(`SELECT *
                    FROM rucs
                    LIMIT 1`,
        function (err) {
          if (err) res(false);
          else res(true);
        });
    })
  };

  /**
   * Queries the database with the given ruc
   */
  async findByRuc(ruc) {

    const db = await this.getDB();
    return new Promise((res, rej) => {
      db.all(`SELECT *
              FROM rucs
              WHERE doc LIKE $doc
              LIMIT $size`,
        {
          $doc: '%' + ruc + '%',
          $size: this.maxResults
        },
        (err, rows) => {
          if (!err) return res(rows);
          rej(err);
        });
    })
  };

  async findByName(query) {

    const db = await this.getDB();

    const names = query.match(/(?:[^\s"]+|"[^"]*")+/g);

    const finalNames = names.filter(n => n && n.trim())
      .map(n => n.toLocaleLowerCase());

    const parts = names.map((_, i) => ` name LIKE $param${i}`);

    const params = {
      $size: this.maxResults
    };
    finalNames.map((name, i) => {
      params[`$param${i}`] = `%${name}%`
    });

    const sql = `SELECT *
                    FROM rucs
                    WHERE ${parts.join(" AND ")}
                    ORDER BY doc ASC
                    LIMIT $size`;

    return new Promise((res, rej) => {
      db.all(sql, params, (err, rows) => {
        if (!err) return res(rows);
        rej(err);
      });
    });
  };

}
