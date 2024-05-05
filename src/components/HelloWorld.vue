<script setup>
import { useDailyDataStore } from "../stores/dailyData"
import { storeToRefs } from "pinia"
import CONSTANTS from "../constants"
import sqlClient from "../duckdb/sqlQueryBuilder"
import { ref, toRaw, computed } from "vue"
import { datasetsGroups } from "../datasets/meteoFrance/index.js"

const dailyDataStore = useDailyDataStore()
const { stations, stationsNames, parametersColumns, stationsColumns, stationsIds, isFetchingData } =
  storeToRefs(dailyDataStore)

const parquetFilesUrls = CONSTANTS.DAILY_DATA.PARQUET_FILES_URLS
console.log({ parquetFilesUrls })

const formDataset = defineModel("formDataset", {
  default: null
})

const formParametersColumns = defineModel("formParametersColumns", {
  default: ["RR", "TX", "TM", "TN"]
})
const formStationName = defineModel("formStationName", {
  default: ""
})
const formStartDate = defineModel("formStartDate", {
  default: null
})
const defaultStartDate = new Date()
defaultStartDate.setDate(defaultStartDate.getDate() - 365)
const defaultStartDateStr = defaultStartDate.toISOString().slice(0, 10)

formStartDate.value = defaultStartDateStr

const formEndDate = defineModel("formEndDate", {
  default: null
})
const defaultEndDateStr = new Date().toISOString().slice(0, 10)
formEndDate.value = defaultEndDateStr

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

const onClickAllButton = () => {
  formParametersColumns.value = formDataset?.value.columns.parameters
}

const onClickNoneButton = () => {
  formParametersColumns.value = []
}

const onClickExampleButton = () => {
  formDataset.value = datasetsGroups[0].datasets[3] //BASE > MENS
  formParametersColumns.value = ["RR", "TN", "TX", "TM"]
  formStationName.value = "TOULOUSE-BLAGNAC"
  formStartDate.value = "2010-01-01"
  formEndDate.value = "2020-01-01"
}

const emit = defineEmits({
  submit: () => {
    return true
  }
})

function onSubmit() {
  console.log("onSubmit")
  if (!isFormReadyToSubmit.value) {
    return
  }
  const dateColumn = formDataset.value.columns.date
  const defaultColumns = [dateColumn]
  const dateLength = dateColumn.length
  const columns = defaultColumns.concat(formParametersColumns.value)
  const columnsStr = `"${columns.join('","')}"`
  const filesStr = sqlClient.getUrlsArrayForSQLQuery(formDataset.value.parquet_urls)

  const stationNameWhere = `NOM_USUEL='${formStationName.value}'`
  const datesWhere = `${dateColumn}>=${formStartDate.value.replaceAll("-", "").slice(0, dateLength)} AND ${dateColumn}<=${formEndDate.value.replaceAll("-", "").slice(0, dateLength)}`

  const fullQuery = `SELECT ${columnsStr} from read_parquet(${filesStr}) WHERE ${stationNameWhere} AND ${datesWhere} ORDER BY ${dateColumn}`

  dailyDataStore.setIsFetchingData(true)

  emit("submit", {
    dataset: formDataset.value,
    query: fullQuery,
    columns: columns,
    stationName: formStationName.value,
    startDate: formStartDate.value,
    endDate: formEndDate.value
  })
}

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
          v-model="formDataset"
          required
        >
          <option value="" disabled>▼ Select a dataset</option>
          <optgroup v-for="group in datasetsGroups" :label="group.name" :key="group.id">
            <option
              v-for="item in group.datasets"
              :value="item"
              :key="item.id"
              :disabled="!item.available"
            >
              {{ item.name }} {{ item.available ? "" : "  (bientôt)" }}
            </option>
          </optgroup>
        </select>
      </fieldset>
      <p v-show="formDataset">
        <a :href="formDataset?.url" target="_blank" class="underline text-sm"> Dataset source </a>
      </p>

      <div v-show="formDataset" class="my-6">
        <p>Parameters</p>
        <div class="flex gap-x-2 items-baseline">
          <button type="button" @click="onClickAllButton" class="rounded duration-500">All</button>
          <button type="button" @click="onClickNoneButton" class="rounded duration-500">
            None
          </button>
          <a :href="formDataset?.url" target="_blank" class="underline text-sm">
            Parameters definition</a
          >
        </div>
        <fieldset class="flex flex-wrap">
          <template v-for="item in formDataset?.columns.parameters" :key="item">
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

      <div v-show="formDataset" class="flex flex-wrap justify-between lg:justify-around gap-y-4">
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
        v-show="formDataset"
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
