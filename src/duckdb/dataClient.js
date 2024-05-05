import { DuckDbFactory } from "./duckdb.js";

export const runQuery = async (form) => {
  const { query, columns, dataset } = form;

  // Create a new connection
  const db = await DuckDbFactory.getInstance(); //.then((db) => {
  const conn = await db.connect();

  const result = await conn.query(query);

  const data = {};
  columns.map((column) => {
    data[column] = [];
  });

  const dates = [];
  result.toArray().map((row) => {
    const r = row.toJSON();

    const dateColumn = dataset.columns.date;
    const dateStr = r[dateColumn];
    columns.map((column) => {
      data[column].push(r[column]);
    });

    const year = ("" + dateStr).slice(0, 4);
    const month = ("" + dateStr).slice(4, 6) - 1;
    const day = ("" + dateStr).slice(6, 8) || "0";
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
