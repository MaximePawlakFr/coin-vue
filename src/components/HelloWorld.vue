<script setup>
import { useDailyDataStore } from "../stores/dailyData"
import { storeToRefs } from "pinia"
import CONSTANTS from "../constants"
import sqlClient from "../duckdb/sqlQueryBuilder"
import { ref, toRaw, computed } from "vue"

const dailyDataStore = useDailyDataStore()
const { stations, stationsNames, parametersColumns, stationsColumns, stationsIds, isFetchingData } =
  storeToRefs(dailyDataStore)

const parquetFilesUrls = CONSTANTS.DAILY_DATA.PARQUET_FILES_URLS
console.log({ parquetFilesUrls })

const defaultStartDate = new Date()
defaultStartDate.setDate(defaultStartDate.getDate() - 365)

const defaultStartDateStr = defaultStartDate.toISOString().slice(0, 10) //{...defaultStartDate.toISOString().slice(0, 10)};
const defaultEndDateStr = new Date().toISOString().slice(0, 10)

const formDatasetId = defineModel("formDatasetId", {
  default: ""
})

const formParametersColumns = defineModel("formParametersColumns", {
  default: ["RR", "TN", "TX", "TM"]
})
const formStationName = defineModel("formStationName", {
  default: ""
})
const formStartDate = defineModel("formStartDate", {
  default: null
})
const formEndDate = defineModel("formEndDate", {
  default: null
})

const stationsNamesDatalist = ref(null)

const filteredStationsNames = ref(toRaw(stations.value))

const showStationsNamesDatalist = ref(false)

const isFormReadyToSubmit = computed(() => {
  const errors = []
  if (isFetchingData.value) {
    errors.push("isFetchingData")
  }
  if (formParametersColumns.value.length <= 0) {
    errors.push("formParametersColumns")
  }
  if (!formStationName.value) {
    errors.push("formStationName")
  }
  if (!formStartDate.value || !formEndDate.value) {
    errors.push("formStartDate")
  }
  console.log("errors", errors)
  if (errors.length > 0) {
    return false
  }
  return true
})

formStartDate.value = defaultStartDateStr
formEndDate.value = defaultEndDateStr
console.log({ parametersColumns })
const onClickAllButton = () => {
  formParametersColumns.value = parametersColumns.value
}

const onClickNoneButton = () => {
  formParametersColumns.value = []
}

const onClickExampleButton = () => {
  formDatasetId.value = "6569b51ae64326786e4e8e1a"
  formParametersColumns.value = ["RR", "TN", "TX"]
  formStationName.value = "TOULOUSE-BLAGNAC"
}

const emit = defineEmits({
  submit: (form) => {
    console.log("form", form)
    return true
  }
})

function onSubmit() {
  console.log("onSubmit")
  if (!isFormReadyToSubmit.value) {
    return
  }
  const defaultColumns = ["AAAAMMJJ"]

  const columns = defaultColumns.concat(formParametersColumns.value)
  const columnsStr = columns.join(", ")
  const filesStr = sqlClient.getUrlsArrayForSQLQuery(parquetFilesUrls)
  console.log({ filesStr })
  const stationNameWhere = `NOM_USUEL='${formStationName.value}'`
  const datesWhere = `AAAAMMJJ>=${formStartDate.value.replaceAll("-", "")} AND AAAAMMJJ<=${formEndDate.value.replaceAll("-", "")}`

  const fullQuery = `SELECT ${columnsStr} from read_parquet(${filesStr}) WHERE ${stationNameWhere} AND ${datesWhere} ORDER BY AAAAMMJJ`
  console.log(fullQuery)

  dailyDataStore.setIsFetchingData(true)

  emit("submit", {
    query: fullQuery,
    columns: columns,
    stationName: formStationName.value,
    startDate: formStartDate.value,
    endDate: formEndDate.value
  })
}

const datasetsGroups = [
  {
    id: "clim-base",
    name: "Données climatologiques de base",
    datasets: [
      {
        id: "6569b51ae64326786e4e8e1a",
        name: "Données climatologiques de base - quotidiennes",
        url: "https://www.data.gouv.fr/fr/datasets/donnees-climatologiques-de-base-quotidiennes",
        available: true
      },
      {
        id: "6569ad61106d1679c93cdf77",
        name: "Données climatologiques de base - 6 minutes",
        url: "https://meteo.data.gouv.fr/datasets/donnees-climatologiques-de-base-6-minutes/",
        available: false
      },
      {
        id: "6569b4473bedf2e7abad3b72",
        name: "Données climatologiques de base - horaires",
        url: "  https://www.data.gouv.fr/fr/datasets/donnees-climatologiques-de-base-horaires",
        available: false
      },
      {
        id: "6569b3d7d193b4daf2b43edc",
        name: "Données climatologiques de base - mensuelles",
        url: "https://www.data.gouv.fr/fr/datasets/donnees-climatologiques-de-base-mensuelles",
        available: false
      },
      {
        id: "6569b4a48a4161faec6b2779",
        name: "Données climatologiques de base - décadaires",
        url: "https://meteo.data.gouv.fr/datasets/6569b4a48a4161faec6b2779",
        available: false
      },
      {
        id: "6569af36ba0c3d2f9d4bf98c",
        name: "Données climatologiques de base - décadaires agro",
        url: "https://meteo.data.gouv.fr/datasets/6569af36ba0c3d2f9d4bf98c",
        available: false
      }
    ]
  },
  {
    id: "chgt-clim",
    name: "Données changement climatique",
    datasets: [
      {
        id: "6569b2c4f1937611d4c8b1a3",
        name: "LSH (Longues Séries Homogénéisées)",
        url: "https://meteo.data.gouv.fr/datasets/6569b2c4f1937611d4c8b1a3",
        available: false
      },
      {
        id: "6569b00fe24fc9e1e482f74e",
        name: "SQR (Séries Quotidiennes de Référence)",
        url: "https://meteo.data.gouv.fr/datasets/6569b00fe24fc9e1e482f74e",
        available: false
      },
      {
        id: "6569b27598256cc583c917a7",
        name: "SIM quotidienne",
        url: "https://meteo.data.gouv.fr/datasets/6569b27598256cc583c917a7",
        available: false
      },
      {
        id: "65e04035010927c797072b29",
        name: "SIM décadaire",
        url: "https://meteo.data.gouv.fr/datasets/65e04035010927c797072b29"
      }
    ]
  },
  {
    id: "etp",
    name: "Données ETP spatialisées",
    datasets: [
      {
        id: "661d079b6357625e12013241",
        name: "Données ETP spatialisées quotidiennes",
        url: "https://meteo.data.gouv.fr/datasets/661d079b6357625e12013241",
        available: false
      },
      {
        id: "661d0762109ece6f985e9857",
        name: "Données ETP spatialisées décadaires",
        url: "https://meteo.data.gouv.fr/datasets/661d0762109ece6f985e9857",
        available: false
      }
    ]
  },
  {
    id: "arpege",
    name: "Paquets Arpège",
    datasets: [
      {
        id: "65bd13b2eb9e79ab309f6e63",
        name: "Paquets Arpège - Résolution 0,1°",
        url: "https://meteo.data.gouv.fr/datasets/65bd13b2eb9e79ab309f6e63",
        available: false
      },
      {
        id: "65bd13e557b26b467363b521",
        name: "Paquets Arpège - Résolution 0,25°",
        url: "https://meteo.data.gouv.fr/datasets/65bd13e557b26b467363b521",
        available: false
      }
    ]
  },
  {
    id: "arome",
    name: "Paquets Arome",
    datasets: [
      {
        id: "65bd1247a6238f16e864fa80",
        name: "Paquets Arome - Résolution 0,01°",
        url: "https://meteo.data.gouv.fr/datasets/65bd1247a6238f16e864fa80",
        available: false
      },
      {
        id: "65bd12d7bfd26e26804204cb",
        name: "Paquets Arome - Résolution 0,025°",
        url: "https://meteo.data.gouv.fr/datasets/65bd12d7bfd26e26804204cb",
        available: false
      },
      {
        id: "65e0bd4b88e4fd88b989ba46",
        name: "Paquets Arome Outre-Mer - Guyane - Résolution 0,025°",
        url: "https://meteo.data.gouv.fr/datasets/65e0bd4b88e4fd88b989ba46",
        available: false
      },
      {
        id: "65bd162b9dc0d31edfabc2b9",
        name: "Paquets Arome Outre-Mer - Antilles - Résolution 0,025°",
        url: "https://meteo.data.gouv.fr/datasets/65bd162b9dc0d31edfabc2b9",
        available: false
      }
    ]
  },
  {
    id: "vagues",
    name: "Paquets de modèle de vagues",
    datasets: [
      {
        id: "65bd1a505a5b412989a84ca7",
        name: "Paquets de modèle de vagues - MFWAM - Résolution 0.025°",
        url: "https://meteo.data.gouv.fr/datasets/65bd1a505a5b412989a84ca7",
        available: false
      },
      {
        id: "65bd1a2957e1cc7c9625e7b5",
        name: "Paquets de modèle de vagues - MFWAM - Résolution 0.1°",
        url: "https://meteo.data.gouv.fr/datasets/65bd1a2957e1cc7c9625e7b5",
        available: false
      },
      {
        id: "65bd19a20a9351d1cbe9a090",
        name: "Paquets de modèle de vagues haute résolution - WW3-MARP - Résolution 0.1°",
        url: "https://meteo.data.gouv.fr/datasets/65bd19a20a9351d1cbe9a090",
        available: false
      }
    ]
  }
]

const updateFilteredStationsNames = (showAll = false) => {
  if (showAll) {
    filteredStationsNames.value = stations.value
  } else {
    filteredStationsNames.value = stations.value.filter((station) => {
      const fullName = (station.department + " " + station.name).toLowerCase()
      return fullName.includes(formStationName.value.toLowerCase())
    })
  }

  toggleStationsNamesDatalist(true)
}
const onClickStationNameOption = (item) => {
  formStationName.value = toRaw(item).name
  toggleStationsNamesDatalist(false)
}

const toggleStationsNamesDatalist = (show) => {
  if (show === undefined) {
    showStationsNamesDatalist.value = !showStationsNamesDatalist.value
  } else {
    showStationsNamesDatalist.value = show
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="">
      <div class="text-center">
        <button type="button" @click="onClickExampleButton" class="rounded duration-500 px-8">
          Show me an example
        </button>
      </div>

      <fieldset>
        <div>
          <label for="formDataset" class="mr-2">Dataset</label>
        </div>
        <select
          name="formDataset"
          id="formDataset"
          class="w-full rounded duration-500"
          v-model="formDatasetId"
          required
        >
          <option value="" disabled>▼ Select a dataset</option>
          <optgroup v-for="group in datasetsGroups" :label="group.name" :key="group.id">
            <option
              v-for="item in group.datasets"
              :value="item.id"
              :key="item.id"
              :disabled="!item.available"
            >
              {{ item.name }}
            </option>
          </optgroup>
        </select>
      </fieldset>
      <p v-show="formDatasetId">
        <a
          href="https://www.data.gouv.fr/fr/datasets/donnees-climatologiques-de-base-quotidiennes/"
          target="_blank"
          class="underline text-sm"
        >
          Dataset source
        </a>
      </p>

      <div v-show="formDatasetId" class="my-6">
        <p>Parameters</p>
        <div class="flex gap-x-2 items-baseline">
          <button type="button" @click="onClickAllButton" class="rounded duration-500">All</button>
          <button type="button" @click="onClickNoneButton" class="rounded duration-500">
            None
          </button>
          <a
            href="https://www.data.gouv.fr/fr/datasets/r/6a8df7e9-45ff-445d-9260-6c65475dda86"
            target="_blank"
            class="underline text-sm"
          >
            Parameters definition</a
          >
        </div>
        <fieldset class="flex flex-wrap">
          <template v-for="item in parametersColumns" :key="item">
            <div class="mx-1">
              <input
                type="checkbox"
                name="formParametersColumns"
                :id="item"
                :value="item"
                v-model="formParametersColumns"
                class="rounded"
              />
              <label :for="item" class="mx-2">{{ item }}</label>
            </div>
          </template>
        </fieldset>
      </div>

      <div v-show="formDatasetId" class="flex flex-wrap justify-between lg:justify-around gap-y-4">
        <fieldset class="grow sm:grow-0">
          <div class="flex">
            <label for="stationsNames" class="mr-2">Station</label>
            <input
              type="text"
              v-model="formStationName"
              name="stationsNames"
              id="stationsNames"
              list="stationsNamesList"
              autocomplete="off"
              class="rounded grow"
              placeholder="▼ Select a station"
              @click="updateFilteredStationsNames(true)"
              @focus="updateFilteredStationsNames(true)"
              @keyup="updateFilteredStationsNames(false)"
            />
          </div>
          <div
            ref="stationsNamesDatalist"
            class="datalist rounded"
            v-show="showStationsNamesDatalist"
            @mouseleave="toggleStationsNamesDatalist(false)"
          >
            <div
              class="datalist-option"
              v-for="item in filteredStationsNames"
              :key="item.id"
              @click="onClickStationNameOption(item)"
            >
              {{ item.department }} - {{ item.name }}
            </div>
          </div>
        </fieldset>

        <div class="flex gap-x-6">
          <fieldset>
            <label for="" class="mr-2">From</label>

            <input type="date" v-model="formStartDate" class="rounded" />
          </fieldset>

          <fieldset>
            <label for="" class="mr-2">To</label>
            <input type="date" v-model="formEndDate" class="rounded" />
          </fieldset>
        </div>
      </div>

      <button
        role="submit"
        v-show="formDatasetId"
        class="w-full my-6 py-4 text-xl rounded duration-500"
        :disabled="!isFormReadyToSubmit"
      >
        Fetch data
      </button>
    </form>
  </div>
</template>

<style computed>
.datalist {
  background-color: white;
  color: #006076;
  padding: 4px;
  max-height: 200px;
  overflow-y: scroll;

  margin-top: 0.125rem;
  position: absolute;
  z-index: 1;
}

@media (width <= 640px) {
  .datalist {
    left: 4px;
    width: calc(100% - 8px);
  }
}

.datalist .datalist-option {
  padding: 0px 4px;
}
.datalist .datalist-option:hover {
  background-color: #006076;
  color: white;
  cursor: pointer;
}
</style>
