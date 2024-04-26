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
const { 
    stationsNames,
    parametersColumns,
    stationsColumns,
    stationsIds } = storeToRefs(dailyDataStore)

    const parquetFilesUrls = CONSTANTS.DAILY_DATA.PARQUET_FILES_URLS
console.log({parquetFilesUrls})

const defaultStartDate = new Date()
defaultStartDate.setDate(defaultStartDate.getDate() - 15);

const defaultStartDateStr = defaultStartDate.toISOString().slice(0, 10);//{...defaultStartDate.toISOString().slice(0, 10)};
const defaultEndDateStr = new Date().toISOString().slice(0, 10);

const query = defineModel({
  default: { parametersColumns: null, stationName: null, startDate: null, endDate:null}
});

query.value = {
  ...query.value,
  startDate:defaultStartDateStr,
  endDate:defaultEndDateStr
}
// console.log(query.value)
const emit = defineEmits({
  submit: (form) => {
    console.log("form", form)
    return true
  }
})

function onSubmit() {
  console.log("onSubmit", query.value)
  const {parametersColumns, stationName, startDate, endDate} = query.value;
  const defaultColumns = ["AAAAMMJJ"]
  const columnsStr = defaultColumns.concat(parametersColumns).join(", ");
  const filesStr = sqlClient.getUrlsArrayForSQLQuery(parquetFilesUrls)
  console.log({filesStr})
  const stationNameWhere = `NOM_USUEL='${stationName}'`;
  const datesWhere = `AAAAMMJJ>=${startDate.replaceAll("-","")} AND AAAAMMJJ<=${endDate.replaceAll("-","")}`;
  
  const fullQuery = `SELECT ${columnsStr} from read_parquet(${filesStr}) WHERE ${stationNameWhere} AND ${datesWhere} ORDER BY AAAAMMJJ`
  console.log(fullQuery)

  emit('submit', { query: fullQuery })
}
</script>

<template>
  <div class="greetings">

    <form @submit.prevent="onSubmit">
      <select name="columns" v-model="query.parametersColumns" multiple>
        <option  v-for="item in parametersColumns" :value="item" :key="item">{{item}}</option>
      </select>
      <select name="columns" v-model="query.stationName">
        <option v-for="item in stationsNames" :value="item" :key="item">{{item}}</option>
      </select>
      <input type="date" value="2020-01-01"  v-model="query.startDate"/>
      <input type="date" value="2024-01-01"  v-model="query.endDate"/>

      <button>Go </button>
    </form>
  </div>
</template>

