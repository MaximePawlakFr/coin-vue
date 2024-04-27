import { DuckDbFactory } from "./duckdb.js";

export const runQuery = async (form) => {
  const { query, columns } = form;
  // Create a new connection
  const db = await DuckDbFactory.getInstance(); //.then((db) => {
  const conn = await db.connect();
  // Either materialize the query result
  const result = await conn.query(query);
  const data = {};
  columns.map((column) => {
    data[column] = [];
  });

  const dataRR = [];
  const dataTN = [];
  const dataTX = [];
  const dates = [];
  result.toArray().map((row) => {
    const r = row.toJSON();
    const { AAAAMMJJ } = r;
    columns.map((column) => {
      data[column].push(r[column]);
    });

    const year = ("" + AAAAMMJJ).slice(0, 4);
    const month = ("" + AAAAMMJJ).slice(4, 6) - 1;
    const day = ("" + AAAAMMJJ).slice(6, 8);
    const date = new Date(year, month, day);
    dates.push(date);
  });

  // Close the connection to release memory
  conn.close();
  return {
    dates,
    data,
  };
  // });
};
