<script setup>
import { useDailyDataStore } from "../stores/dailyData"
import { storeToRefs } from "pinia"
import CONSTANTS from "../constants"
import sqlClient from "../duckdb/sqlQueryBuilder"

defineProps({
  msg: {
    type: String,
    required: true
  }
})
const dailyDataStore = useDailyDataStore()
const { stations, stationsNames, parametersColumns, stationsColumns, stationsIds } =
  storeToRefs(dailyDataStore)

const parquetFilesUrls = CONSTANTS.DAILY_DATA.PARQUET_FILES_URLS
console.log({ parquetFilesUrls })

const defaultStartDate = new Date()
defaultStartDate.setDate(defaultStartDate.getDate() - 365)

const defaultStartDateStr = defaultStartDate.toISOString().slice(0, 10) //{...defaultStartDate.toISOString().slice(0, 10)};
const defaultEndDateStr = new Date().toISOString().slice(0, 10)

const formDatasetId = defineModel("formDatasetId", {
  default: null
})

const formParametersColumns = defineModel("formParametersColumns", {
  default: []
})
const formStationName = defineModel("formStationName", {
  default: null
})
const formStartDate = defineModel("formStartDate", {
  default: null
})
const formEndDate = defineModel("formEndDate", {
  default: null
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
  const defaultColumns = ["AAAAMMJJ"]
  const columns = defaultColumns.concat(formParametersColumns.value)
  const columnsStr = columns.join(", ")
  const filesStr = sqlClient.getUrlsArrayForSQLQuery(parquetFilesUrls)
  console.log({ filesStr })
  const stationNameWhere = `NOM_USUEL='${formStationName.value}'`
  const datesWhere = `AAAAMMJJ>=${formStartDate.value.replaceAll("-", "")} AND AAAAMMJJ<=${formEndDate.value.replaceAll("-", "")}`

  const fullQuery = `SELECT ${columnsStr} from read_parquet(${filesStr}) WHERE ${stationNameWhere} AND ${datesWhere} ORDER BY AAAAMMJJ`
  console.log(fullQuery)

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
        id: "6569b27598256cc583c917a7",
        name: "SIM quotidienne",
        url: "https://meteo.data.gouv.fr/datasets/6569b27598256cc583c917a7",
        available: false
      },
      {
        id: "6569b00fe24fc9e1e482f74e",
        name: "SQR (Séries Quotidiennes de Référence)",
        url: "https://meteo.data.gouv.fr/datasets/6569b00fe24fc9e1e482f74e",
        available: false
      }
    ]
  },
  {
    id: "etp",
    name: "Données ETP spatialisées",
    datasets: [
      {
        id: "661d079b6357625e12013241",
        name: "Quotidiennes",
        url: "https://meteo.data.gouv.fr/datasets/661d079b6357625e12013241",
        available: false
      },
      {
        id: "661d0762109ece6f985e9857",
        name: "Décadaires",
        url: "https://meteo.data.gouv.fr/datasets/661d0762109ece6f985e9857",
        available: false
      }
    ]
  }
]
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="">
      <div class="text-right">
        <button type="button" @click="onClickExampleButton" class="rounded duration-500">
          Example
        </button>
      </div>

      <fieldset>
        <div>
          <label for="formDataset" class="mr-2">Dataset</label>
        </div>
        <select
          name="formDataset"
          id="formDataset"
          class="rounded"
          v-model="formDatasetId"
          required
        >
          <option value="">-- Select a dataset --</option>
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

      <div v-show="formDatasetId" class="my-6">
        <p>Parameters</p>
        <button type="button" @click="onClickAllButton" class="rounded duration-500">All</button>
        <button type="button" @click="onClickNoneButton" class="rounded duration-500">None</button>

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

      <div v-show="formDatasetId" class="flex justify-around">
        <fieldset>
          <label for="stationsNames" class="mr-2">Station</label>
          <input
            type="text"
            v-model="formStationName"
            name="stationsNames"
            id="stationsNames"
            list="stationsNamesList"
            autocomplete="off"
            class="rounded"
          />
          <datalist id="stationsNamesList">
            <option v-for="item in stations" :value="item.name" :key="item.id">
              {{ item.department }} - {{ item.name }}
            </option>
          </datalist>
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
      >
        Fetch data
      </button>
    </form>
  </div>
</template>
