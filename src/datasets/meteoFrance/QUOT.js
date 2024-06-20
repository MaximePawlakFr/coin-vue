export default {
  id: "6569b51ae64326786e4e8e1a",
  name: "Données climatologiques de base - quotidiennes",
  url:
    "https://www.data.gouv.fr/fr/datasets/donnees-climatologiques-de-base-quotidiennes",
  documentationUrl:
    "https://www.data.gouv.fr/fr/datasets/r/6a8df7e9-45ff-445d-9260-6c65475dda86",
  columns: {
    date: "AAAAMMJJ",
    station: [
      "NOM_USUEL",
      "NUM_POSTE",
      "LAT",
      "LON",
      "ALTI",
    ],
    parameters: [
      { label: "precipitation", value: "RR" },
      { label: "temperatureMin", value: "TN" },
      { label: "temperatureMax", value: "TX" },
      { label: "temperatureAvg", value: "TM" },
      { label: "windSpeedAt10m", value: "FFM" },
      { label: "windSpeedAt2m", value: "FF2M" },
      // { label: "humidityMin", value: "UN" },
      // { label: "humidityMax", value: "UX" },
      // { label: "humidityAvg", value: "UM" },
      // { label: "vaporPressureAvg", value: "TSVM" },
    ],
    // -- WIP --
    // Enable 'Export Mode'
    // rawParameters: [
    //   { label: "RR", value: "RR" },
    //   { label: "TN", value: "TN" },
    //   { label: "TX", value: "TX" },
    //   { label: "TM", value: "TM" },
    //   { label: "FFM", value: "FFM" },
    //   { label: "FF2M", value: "FF2M" },
    // ],
  },
  parquet_urls: [
    // previous-1950
    "https://www.data.gouv.fr/fr/datasets/r/9a200903-bb38-401b-a305-30c04af8ddfd",
    // 1950-2022
    "https://www.data.gouv.fr/fr/datasets/r/dad90fd9-8a0e-4a85-9f3c-8bfb31fc9d5f",
    // 2023-2024
    "https://www.data.gouv.fr/fr/datasets/r/3a8757ad-81b0-4ac7-a19d-d0e160a086df",
    // -- WIP --
    // Optimize HOR requests
    // {
    //   url:
    //     "https://www.data.gouv.fr/fr/datasets/r/3a8757ad-81b0-4ac7-a19d-d0e160a086df",
    //   startDate: "2023-01-01T00:00:00Z",
    //   endDate: "2025-01-01T00:00:00Z",
    //   startDepartment: 1,
    //   endDepartment: 999,
    // },
  ],
  available: true,
};
