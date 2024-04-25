import { DuckDbFactory } from "./duckdb.js";

export const runQuery = (query) => {
  // Create a new connection
  let conn = null;
  return DuckDbFactory.getInstance().then((db) => {
    return db.connect();
  }).then((res) => {
    conn = res;
    // Either materialize the query result
    return conn.query(query);
  }).then((result) => {
    const dataRR = [];
    const dataTN = [];
    const dataTX = [];
    const dates = [];
    result.toArray().map((row) => {
      const r = row.toJSON();
      console.log(r);
      const { RR, TN, TX, AAAAMMJJ } = r;
      dataRR.push(RR);
      dataTN.push(TN);
      dataTX.push(TX);

      const year = ("" + AAAAMMJJ).slice(0, 4);
      const month = ("" + AAAAMMJJ).slice(4, 6) - 1;
      const day = ("" + AAAAMMJJ).slice(6, 8);
      const date = new Date(year, month, day);
      dates.push(date);
    });
    console.log(dates);
    console.log(dataRR);

    // Close the connection to release memory
    conn.close();
    return {
      dates,
      dataTN,
      dataTX,
    };
  });
};
