import { init } from "./duckdb.js";

export const runQuery = () => {
  // Create a new connection
  let conn = null;
  return init().then((db) => {
    return db.connect();
  }).then((res) => {
    conn = res;
    // Either materialize the query result
    return conn.query(
      `SELECT AAAAMMJJ, NOM_USUEL, NUM_POSTE, RR, TN, TX
        FROM read_parquet([
          'https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240420-144451/q-previous-1950-rr-t-vent.prepared.parquet',
          'https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240414-164916/q-1950-2022-rr-t-vent.parquet',
          'https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240420-142828/q-2023-2024-rr-t-vent.prepared.parquet']
          )
        WHERE NOM_USUEL='ABBEVILLE' ORDER BY AAAAMMJJ`,
    );
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
