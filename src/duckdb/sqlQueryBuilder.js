const getColumnsQuery = (filesUrls) => {
  const filesAsString = getUrlsArrayForSQLQuery(
    filesUrls,
  );
  return `SELECT * FROM read_parquet(${filesAsString}) LIMIT 0`;
};

const getStationsNamesAndIdsQuery = (filesUrls) => {
  const filesAsString = getUrlsArrayForSQLQuery(
    filesUrls,
  );
  //   return `SELECT NOM_USUEL, NUM_POSTE FROM read_parquet(${filesAsString}) GROUP BY NUM_POSTE, NOM_USUEL ORDER BY NOM_USUEL`;
  return `SELECT DISTINCT NOM_USUEL FROM read_parquet(${filesAsString}) NOM_USUEL`;
};

const getUrlsArrayForSQLQuery = (array) => {
  const urlsAsString = `['${array.join("', '")}']`;
  return urlsAsString;
};

const getColumnsForSQLQuery = (array) => {
  const columnsStr = `"${array.join('","')}"`;
  return columnsStr;
};

const getDatesConditionForSQLQuery = (dateColumn, startDate, endDate) => {
  const dateLength = dateColumn.length;

  const formattedStartDateValue = startDate.replaceAll("-", "").slice(
    0,
    dateLength,
  );
  const startDateCondition = `${dateColumn}>=${formattedStartDateValue}`;

  const formattedEndDateValue = endDate.replaceAll("-", "").slice(
    0,
    dateLength,
  );
  const endDateCondition = `${dateColumn}<=${formattedEndDateValue}`;

  const datesCondition = `${startDateCondition} AND ${endDateCondition}`;
  return datesCondition;
};

export default {
  getColumnsQuery,
  getUrlsArrayForSQLQuery,
  getColumnsForSQLQuery,
  getDatesConditionForSQLQuery,
  getStationsNamesAndIdsQuery,
};
