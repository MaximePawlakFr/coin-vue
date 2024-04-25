<script setup>
import {useDailyDataStore} from '../stores/dailyData'
import { storeToRefs } from 'pinia'
import CONSTANTS from '../constants'
import sqlClient from "../duckdb/sqlClient"

defineProps({
  msg: {
    type: String,
    required: true
  }
})
const dailyDataStore = useDailyDataStore()
const { columns, stationsNames } = storeToRefs(dailyDataStore)
console.log("columns", columns)
console.log("stationsNames", stationsNames)
// ` SELECT AAAAMMJJ, NOM_USUEL, NUM_POSTE, RR, TN, TX
//         FROM read_parquet()
//         WHERE NOM_USUEL='ABBEVILLE' ORDER BY AAAAMMJJ`})
const parquetFilesUrls = CONSTANTS.DAILY_DATA.PARQUET_FILES_URLS
console.log({parquetFilesUrls})

const query = defineModel({
  default: { columns: null, stationName: null, startDate: null, endDate: null }
});
const emit = defineEmits({
  submit: (form) => {
    console.log("form", form)
    return true
  }
})

function onSubmit() {
  console.log("onSubmit", query.value)
  const {columns, stationName, startDate, endDate} = query.value;
  const columnsStr = columns.join(", ");
  const filesStr = sqlClient.getUrlsArrayForSQLQuery(parquetFilesUrls)
  console.log({filesStr})
  const stationNameWhere = `NOM_USUEL='${stationName}'`;
  const datesWhere = `AAAAMMJJ>=${startDate.replaceAll("-","")} AND AAAAMMJJ<=${endDate.replaceAll("-","")}`;
  
  const fullQuery = `SELECT ${columnsStr} from read_parquet(${filesStr}) WHERE ${stationNameWhere} AND ${datesWhere} ORDER BY AAAAMMJJ`
  console.log(fullQuery)

//  const q= "SELECT AAAAMMJJ, NOM_USUEL, NUM_POSTE, RR, TX, TN from read_parquet(['https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240420-144451/q-previous-1950-rr-t-vent.prepared.parquet','https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240414-164916/q-1950-2022-rr-t-vent.parquet','https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240420-142828/q-2023-2024-rr-t-vent.prepared.parquet']) WHERE NOM_USUEL='ABBEVILLE' AND AAAAMMJJ>=20240101 AND AAAAMMJJ<=20240410 ORDER BY AAAAMMJJ" 

  // const q = `SELECT AAAAMMJJ, NOM_USUEL, NUM_POSTE, RR, TX, TN from read_parquet([(https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240420-144451/q-previous-1950-rr-t-vent.prepared.parquet","https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240414-164916/q-1950-2022-rr-t-vent.parquet","https://static.data.gouv.fr/resources/parquet-donnees-climatologiques-de-base-quotidiennes-format-parquet/20240420-142828/q-2023-2024-rr-t-vent.prepared.parquet"]) WHERE NOM_USEL='ABBEVILLE' AND AAAAMMJJ>=20240102 AND AAAAMMJJ<=20240403 ORDER BY AAAAMMJJ` 
  emit('submit', { query: fullQuery })
}
</script>

<template>
  <div class="greetings">

    <form @submit.prevent="onSubmit">
      <select name="columns" v-model="query.columns" multiple>
        <option  v-for="item in columns" :value="item" :key="item">{{item}}</option>
      </select>
      <p>{{ columns }}</p>
      <p>{{ stationsNames }}</p>
      <select name="columns" v-model="query.stationName">
        <option value="AAAAMMJJ">AAAAMMJJ</option>
        <option value="ABBEVILLE">ABBEVILLE</option>
      </select>
      <input type="date" value="2020-01-01"  v-model="query.startDate"/>
      <input type="date" value="2024-01-01"  v-model="query.endDate"/>

      <button>Go </button>
    </form>
  </div>
</template>

