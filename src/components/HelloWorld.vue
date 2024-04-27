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


const formParametersColumns = defineModel('formParametersColumns',{
  default:[]
})
const formStationName = defineModel('formStationName',{
  default:null
})
const formStartDate = defineModel('formStartDate',{
  default:null
})
const formEndDate = defineModel('formEndDate',{
  default:null
})

formStartDate.value = defaultStartDateStr;
formEndDate.value = defaultEndDateStr;


const emit = defineEmits({
  submit: (form) => {
    console.log("form", form)
    return true
  }
})

function onSubmit() {
  console.log("onSubmit")
  const defaultColumns = ["AAAAMMJJ"]
  const columnsStr = defaultColumns.concat(formParametersColumns.value).join(", ");
  const filesStr = sqlClient.getUrlsArrayForSQLQuery(parquetFilesUrls)
  console.log({filesStr})
  const stationNameWhere = `NOM_USUEL='${formStationName.value}'`;
  const datesWhere = `AAAAMMJJ>=${formStartDate.value.replaceAll("-","")} AND AAAAMMJJ<=${formEndDate.value.replaceAll("-","")}`;
  
  const fullQuery = `SELECT ${columnsStr} from read_parquet(${filesStr}) WHERE ${stationNameWhere} AND ${datesWhere} ORDER BY AAAAMMJJ`
  console.log(fullQuery)

  emit('submit', { query: fullQuery })
}
</script>

<template>
  <div class="greetings">

    <form @submit.prevent="onSubmit">
      <div>
        <ul>
          <li v-for="item in formParametersColumns" :key="item">{{ item }}</li>
        </ul>
        <select name="formParametersColumns" v-model="formParametersColumns" multiple size="10">
          <option  v-for="item in parametersColumns" :value="item" :key="item" >{{item}}</option>
        </select>
      </div>

      <div>
        <input type="text" v-model="formStationName" name="stationsNames" id="stationsNames" list="stationsNamesList"/>
        <!-- <select name="stationsNames" v-model="query.stationName"> -->
          <datalist id="stationsNamesList">
            
            <option v-for="item in stationsNames" :value="item" :key="item">{{item}}</option>
          </datalist>
          <!-- </select> -->
      </div>

      <div>
        <input type="date" v-model="formStartDate"/>
        <input type="date" v-model="formEndDate"/>
      </div>

      <button>Go </button>
    </form>
  </div>
</template>

