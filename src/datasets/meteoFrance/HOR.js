export default {
  id: "6569b4473bedf2e7abad3b72",
  name: "Données climatologiques de base - horaires",
  url:
    "https://www.data.gouv.fr/fr/datasets/donnees-climatologiques-de-base-horaires",
  documentationUrl:
    "https://www.data.gouv.fr/fr/datasets/r/5d0f9af9-149b-463a-9472-445dafb698d9",
  columns: {
    date: "AAAAMMJJHH",
    station: [
      "NOM_USUEL",
      "NUM_POSTE",
      "LAT",
      "LON",
      "ALTI",
    ],
    parameters: [
      { label: "precipitation", value: "RR1" },
      { label: "temperatureMin", value: "TN" },
      { label: "temperatureMax", value: "TX" },
      { label: "temperatureAvg", value: "T" },
      { label: "windSpeedAt10m", value: "FF" },
      // { label: "windDirectionAt10m", value: "DD" },
      { label: "windSpeedAt2m", value: "FF2" },
      // { label: "windDirectionAt2m", value: "DD2" },
      // { label: "humidityMin", value: "UN" },
      // { label: "humidityMax", value: "UX" },
      // { label: "humidityAvg", value: "U" },
      // { label: "vaporPressureAvg", value: "TSV" },
      // New
      // { label: "UVIndex", value: "UV_INDICE" },
      // { label: "globalRadiation", value: "GLO" },
    ],
  },
  parquet_urls: [
    // 1700-1989
    "https://www.data.gouv.fr/fr/datasets/r/cc46c13e-1b3a-48b9-b1f6-43cdb4963185",
    // 1990-2019
    "https://www.data.gouv.fr/fr/datasets/r/66f9acc9-81f2-42d9-852f-150a00ff58ed", // 01-09
    "https://www.data.gouv.fr/fr/datasets/r/ead64cb5-02c5-44f7-8c6f-eed416d67ff7", // 10-19
    "https://www.data.gouv.fr/fr/datasets/r/8edba419-6fbc-40e4-ad48-9896e431cf04",
    "https://www.data.gouv.fr/fr/datasets/r/2e347ce0-d507-4c37-9534-7767ffd21b6e",
    "https://www.data.gouv.fr/fr/datasets/r/4583a570-3087-4145-b844-37a77ab09e73",
    "https://www.data.gouv.fr/fr/datasets/r/f4446ad2-83d0-4ae4-a941-465efb640b2e",
    "https://www.data.gouv.fr/fr/datasets/r/7a33c852-de13-4bd7-b2c3-ebf9f40b9196",
    "https://www.data.gouv.fr/fr/datasets/r/37e173eb-1375-4483-9cdb-ed28a83bd5f5",
    "https://www.data.gouv.fr/fr/datasets/r/f097a48a-bcc0-4820-b6a5-4c4dc5d65c7f",
    "https://www.data.gouv.fr/fr/datasets/r/d13884a9-96c5-46db-9014-8d033a89572a", // 90-999
    // 2020-2022
    "https://www.data.gouv.fr/fr/datasets/r/e455db3e-f86b-4672-aa37-55478cac7372",
    // 2023-2024
    "https://www.data.gouv.fr/fr/datasets/r/5a5342a4-1a0d-4ded-b043-d4a112222ac0",
    // -- WIP --
    // Optimize HOR requests
    // {
    //   url:
    //     "https://www.data.gouv.fr/fr/datasets/r/247e6afc-0e24-4cb9-abbd-7181b8d003d9",
    //   startDate: "1990-01-01T00:00:00Z",
    //   endDate: "2019-12-31-T23:59:59Z",
    //   startDepartment: 1,
    //   endDepartment: 9,
    // },
  ],
  available: false,
};
