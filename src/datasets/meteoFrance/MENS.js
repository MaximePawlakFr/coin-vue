export default {
  id: "6569b3d7d193b4daf2b43edc",
  name: "Données climatologiques de base - mensuelles",
  url:
    "https://www.data.gouv.fr/fr/datasets/donnees-climatologiques-de-base-mensuelles",
  documentationUrl:
    "https://www.data.gouv.fr/fr/datasets/r/6d4ac560-8f7c-477f-9a3f-3c33137fc04e",
  columns: {
    date: "AAAAMM",
    station: ["NOM_USUEL", "NUM_POSTE", "LAT", "LON", "ALTI"],
    defaultParameters: ["RR", "TN", "TX", "TM"],
    parameters: [
      { label: "precipitation", value: "RR" },
      { label: "temperatureMin", value: "TN" },
      { label: "temperatureMax", value: "TX" },
      { label: "temperatureAvg", value: "TMM" },
      { label: "windSpeedAt10m", value: "FFM" },
      // { label: "humidityMin", value: "UNAB" },
      // { label: "humidityMax", value: "UXAB" },
      // { label: "humidityAvg", value: "UMM" },
      // { label: "vaporPressureAvg", value: "TSVM" },
    ],
  },
  parquet_urls: [
    "https://www.data.gouv.fr/fr/datasets/r/298e8ecf-3cbd-4a44-a0d3-b1442f4aa723",
    "https://www.data.gouv.fr/fr/datasets/r/71960ec6-97d8-41c8-8629-2571c29d8d45",
    "https://www.data.gouv.fr/fr/datasets/r/f87e7854-a7a5-4cc8-b721-7d9fec04a7f4",
  ],
  available: true,
};

// Cols starting with ""
// ' PMERM',
// ' TN',
// ' TAMPLIM',
// ' UNAB',
// ' FXIAB',
// ' FXYAB',
// ' INST',
// ' HNEIGEFTOT',
// ' NEIGETOTAB'
