import CONSTANTS from "../constants";

const getColumnsQuery = () => {
  const filesAsString = getUrlsArrayForSQLQuery(
    CONSTANTS.DAILY_DATA.PARQUET_FILES_URLS,
  );
  return `SELECT * FROM read_parquet(${filesAsString}) LIMIT 0`;
};

const getStationsNamesAndIdsQuery = () => {
  const filesAsString = getUrlsArrayForSQLQuery(
    CONSTANTS.DAILY_DATA.PARQUET_FILES_URLS,
  );
  //   return `SELECT NOM_USUEL, NUM_POSTE FROM read_parquet(${filesAsString}) GROUP BY NUM_POSTE, NOM_USUEL ORDER BY NOM_USUEL`;
  return `SELECT DISTINCT NOM_USUEL FROM read_parquet(${filesAsString}) NOM_USUEL`;
};

const getUrlsArrayForSQLQuery = (array) => {
  const urlsAsString = `['${array.join("', '")}']`;
  return urlsAsString;
};

export default {
  getColumnsQuery,
  getUrlsArrayForSQLQuery,
  getStationsNamesAndIdsQuery,
};
