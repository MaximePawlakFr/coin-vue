import { DuckDbFactory } from "./duckdb.js";

/**
 * @param {*} form
 * @returns {
 * col1: [...],
 * col2: [...],
 * col3: [...],
 * ...
 * }
 */
export const runQuery = async (form) => {
  const { query, columns, dataset } = form;

  // Create a new connection
  const db = await DuckDbFactory.getInstance(); //.then((db) => {
  const conn = await db.connect();

  const result = await conn.query(query);

  const rawData = [];
  const data = {};
  columns.map((column) => {
    data[column] = [];
  });
  const dates = [];

  result.toArray().map((row) => {
    // { col1:..., col2:..., ...}
    const r = row.toJSON();
    rawData.push(r);
    columns.map((column) => {
      data[column].push(r[column]);
    });

    // Process date
    const dateColumn = dataset.columns.date;
    const dateStr = r[dateColumn];

    const year = ("" + dateStr).slice(0, 4);
    const month = ("" + dateStr).slice(4, 6) - 1;
    const day = ("" + dateStr).slice(6, 8) || "1";
    const hour = ("" + dateStr).slice(8, 10) || "0";

    const date = new Date(Date.UTC(year, month, day, hour));
    dates.push(date);
  });

  // Close the connection to release memory
  conn.close();
  return {
    dates,
    rawData,
    data,
  };
  // });
};
