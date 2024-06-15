import MENS from "./MENS.js";
import QUOT from "./QUOT.js";
import meteofranceFichesStations from "./fiches-stations.js";

export const stationsAsGeoJSON = meteofranceFichesStations;

export const datasetsGroups = [
  {
    id: "clim-base",
    name: "Données climatologiques de base",
    datasets: [
      {
        id: "6569ad61106d1679c93cdf77",
        name: "Données climatologiques de base - 6 minutes",
        url:
          "https://meteo.data.gouv.fr/datasets/donnees-climatologiques-de-base-6-minutes/",
        available: false,
      },
      {
        id: "6569b4473bedf2e7abad3b72",
        name: "Données climatologiques de base - horaires",
        url:
          "  https://www.data.gouv.fr/fr/datasets/donnees-climatologiques-de-base-horaires",
        available: false,
      },
      QUOT,
      MENS,
      {
        id: "6569b4a48a4161faec6b2779",
        name: "Données climatologiques de base - décadaires",
        url: "https://meteo.data.gouv.fr/datasets/6569b4a48a4161faec6b2779",
        available: false,
      },
      {
        id: "6569af36ba0c3d2f9d4bf98c",
        name: "Données climatologiques de base - décadaires agro",
        url: "https://meteo.data.gouv.fr/datasets/6569af36ba0c3d2f9d4bf98c",
        available: false,
      },
    ],
  },
  // {
  //   id: "chgt-clim",
  //   name: "Données changement climatique",
  //   datasets: [
  //     {
  //       id: "6569b2c4f1937611d4c8b1a3",
  //       name: "LSH (Longues Séries Homogénéisées)",
  //       url: "https://meteo.data.gouv.fr/datasets/6569b2c4f1937611d4c8b1a3",
  //       available: false,
  //     },
  //     {
  //       id: "6569b00fe24fc9e1e482f74e",
  //       name: "SQR (Séries Quotidiennes de Référence)",
  //       url: "https://meteo.data.gouv.fr/datasets/6569b00fe24fc9e1e482f74e",
  //       available: false,
  //     },
  //     {
  //       id: "6569b27598256cc583c917a7",
  //       name: "SIM quotidienne",
  //       url: "https://meteo.data.gouv.fr/datasets/6569b27598256cc583c917a7",
  //       available: false,
  //     },
  //     {
  //       id: "65e04035010927c797072b29",
  //       name: "SIM décadaire",
  //       url: "https://meteo.data.gouv.fr/datasets/65e04035010927c797072b29",
  //     },
  //   ],
  // },
  // {
  //   id: "etp",
  //   name: "Données ETP spatialisées",
  //   datasets: [
  //     {
  //       id: "661d079b6357625e12013241",
  //       name: "Données ETP spatialisées quotidiennes",
  //       url: "https://meteo.data.gouv.fr/datasets/661d079b6357625e12013241",
  //       available: false,
  //     },
  //     {
  //       id: "661d0762109ece6f985e9857",
  //       name: "Données ETP spatialisées décadaires",
  //       url: "https://meteo.data.gouv.fr/datasets/661d0762109ece6f985e9857",
  //       available: false,
  //     },
  //   ],
  // },
  // {
  //   id: "arpege",
  //   name: "Paquets Arpège",
  //   datasets: [
  //     {
  //       id: "65bd13b2eb9e79ab309f6e63",
  //       name: "Paquets Arpège - Résolution 0,1°",
  //       url: "https://meteo.data.gouv.fr/datasets/65bd13b2eb9e79ab309f6e63",
  //       available: false,
  //     },
  //     {
  //       id: "65bd13e557b26b467363b521",
  //       name: "Paquets Arpège - Résolution 0,25°",
  //       url: "https://meteo.data.gouv.fr/datasets/65bd13e557b26b467363b521",
  //       available: false,
  //     },
  //   ],
  // },
  // {
  //   id: "arome",
  //   name: "Paquets Arome",
  //   datasets: [
  //     {
  //       id: "65bd1247a6238f16e864fa80",
  //       name: "Paquets Arome - Résolution 0,01°",
  //       url: "https://meteo.data.gouv.fr/datasets/65bd1247a6238f16e864fa80",
  //       available: false,
  //     },
  //     {
  //       id: "65bd12d7bfd26e26804204cb",
  //       name: "Paquets Arome - Résolution 0,025°",
  //       url: "https://meteo.data.gouv.fr/datasets/65bd12d7bfd26e26804204cb",
  //       available: false,
  //     },
  //     {
  //       id: "65e0bd4b88e4fd88b989ba46",
  //       name: "Paquets Arome Outre-Mer - Guyane - Résolution 0,025°",
  //       url: "https://meteo.data.gouv.fr/datasets/65e0bd4b88e4fd88b989ba46",
  //       available: false,
  //     },
  //     {
  //       id: "65bd162b9dc0d31edfabc2b9",
  //       name: "Paquets Arome Outre-Mer - Antilles - Résolution 0,025°",
  //       url: "https://meteo.data.gouv.fr/datasets/65bd162b9dc0d31edfabc2b9",
  //       available: false,
  //     },
  //   ],
  // },
  // {
  //   id: "vagues",
  //   name: "Paquets de modèle de vagues",
  //   datasets: [
  //     {
  //       id: "65bd1a505a5b412989a84ca7",
  //       name: "Paquets de modèle de vagues - MFWAM - Résolution 0.025°",
  //       url: "https://meteo.data.gouv.fr/datasets/65bd1a505a5b412989a84ca7",
  //       available: false,
  //     },
  //     {
  //       id: "65bd1a2957e1cc7c9625e7b5",
  //       name: "Paquets de modèle de vagues - MFWAM - Résolution 0.1°",
  //       url: "https://meteo.data.gouv.fr/datasets/65bd1a2957e1cc7c9625e7b5",
  //       available: false,
  //     },
  //     {
  //       id: "65bd19a20a9351d1cbe9a090",
  //       name:
  //         "Paquets de modèle de vagues haute résolution - WW3-MARP - Résolution 0.1°",
  //       url: "https://meteo.data.gouv.fr/datasets/65bd19a20a9351d1cbe9a090",
  //       available: false,
  //     },
  //   ],
  // },
];
