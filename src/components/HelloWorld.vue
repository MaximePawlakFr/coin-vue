<script setup>
import { useDailyDataStore } from "../stores/dailyData"
import { storeToRefs } from "pinia"
import CONSTANTS from "../constants"
import sqlClient from "../duckdb/sqlClient"

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
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="">
      <div>
        <p>Parameters:</p>
        <button type="button">All</button><button type="button">None</button>
        <fieldset class="flex flex-wrap">
          <template v-for="item in parametersColumns" :key="item">
            <div class="mx-1">
              <input
                type="checkbox"
                name="formParametersColumns"
                :id="item"
                :value="item"
                v-model="formParametersColumns"
              />
              <label :for="item" class="mx-2">{{ item }}</label>
            </div>
          </template>
        </fieldset>
      </div>

      <fieldset>
        <label for="stationsNames">Station: </label>
        <input
          type="text"
          v-model="formStationName"
          name="stationsNames"
          id="stationsNames"
          list="stationsNamesList"
          autocomplete="off"
        />
        <datalist id="stationsNamesList">
          <option v-for="item in stations" :value="item.name" :key="item.id">
            {{ item.department }} - {{ item.name }}
          </option>
        </datalist>
      </fieldset>

      <div class="flex">
        <fieldset>
          <label for="">From</label>
          <input type="date" v-model="formStartDate" />
        </fieldset>

        <fieldset>
          <label for="">To</label>
          <input type="date" v-model="formEndDate" />
        </fieldset>
      </div>

      <button role="submit">Fetch data</button>
    </form>
  </div>
</template>
