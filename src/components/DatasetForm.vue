<script setup>
import { useDailyDataStore } from "../stores/dailyData.js"
import { storeToRefs } from "pinia"
import sqlClient from "../duckdb/sqlQueryBuilder.js"
import { ref, toRaw, computed } from "vue"
import { datasetsGroups } from "../datasets/meteoFrance/index.js"

const dailyDataStore = useDailyDataStore()
const { stations, stationsNames, parametersColumns, stationsColumns, stationsIds, isFetchingData } =
  storeToRefs(dailyDataStore)

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
const activeDataOptionId = ref(null)

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
  if (!isFormReadyToSubmit.value) {
    return
  }
  const dateColumn = formDataset.value.columns.date
  const defaultColumns = [dateColumn]

  const columns = defaultColumns.concat(formParametersColumns.value)

  const columnsStr = sqlClient.getColumnsForSQLQuery(columns)
  const urlsArray = sqlClient.getUrlsArrayForSQLQuery(formDataset.value.parquet_urls)

  const stationNameWhere = `NOM_USUEL='${formStationName.value}'`
  const datesWhereCondition = sqlClient.getDatesConditionForSQLQuery(
    dateColumn,
    formStartDate.value,
    formEndDate.value
  )

  const fullQuery = `SELECT ${columnsStr} from read_parquet(${urlsArray}) WHERE ${stationNameWhere} AND ${datesWhereCondition} ORDER BY ${dateColumn}`

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

const updateFilteredStationsNames = (event, showAll = false) => {
  if (event.keyCode === 13) {
    // If enter is clicked, do nothing
    // An option has been selected, no need to update names
    return
  }

  if (showAll) {
    filteredStationsNames.value = stations.value
  } else {
    filteredStationsNames.value = stations.value.filter((station) => {
      const fullName = (station.department + " " + station.name).toLowerCase()
      return fullName.includes(formStationName.value.toLowerCase())
    })
  }

  // If a click occurs, make active the firs elemnt
  if (event.type === "click") {
    const firstOption = filteredStationsNames.value[0]
    activeDataOptionId.value = firstOption
  }
  toggleStationsNamesDatalist(true)
}
const onClickStationNameOption = (name) => {
  formStationName.value = name

  // Hide data list
  toggleStationsNamesDatalist(false)

  // Reset active option
  activeDataOptionId.value = null
}

const toggleStationsNamesDatalist = (show) => {
  if (show === undefined) {
    showStationsNamesDatalist.value = !showStationsNamesDatalist.value
  } else {
    showStationsNamesDatalist.value = show
  }
}
const onMouseEnterDataOption = (dataOptionId) => {
  activeDataOptionId.value = dataOptionId
}

/**
 * When arrow down or arrow up is pressed on data list,
 * update the active item.
 *
 * @param arrowType
 */
const onKeyUpArrowDataList = (arrowType) => {
  const index = filteredStationsNames.value.indexOf(activeDataOptionId.value)

  let increment = 0
  if (arrowType === "arrowUp") {
    increment = -1
  } else if (arrowType === "arrowDown") {
    increment = 1
  }

  let nextIndex = index + increment
  if (nextIndex <= 0) {
    nextIndex = 0
  } else if (nextIndex >= filteredStationsNames.value.length) {
    nextIndex = filteredStationsNames.value.length - 1
  }
  const nextOption = filteredStationsNames.value[nextIndex]

  activeDataOptionId.value = nextOption
}

/**
 * When Enter is pressed on data list,
 * select the active option as station name.
 */
const onKeyEnterDataList = () => {
  console.log("onKeyEnterDataList", activeDataOptionId.value.name)
  onClickStationNameOption(activeDataOptionId.value.name)
}
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="">
      <div class="text-center">
        <button type="button" @click="onClickExampleButton" class="rounded duration-500 px-8">
          {{ $t("message.showMeExample") }}
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
          <option value="" disabled>▼ {{ $t("message.selectADataset") }}</option>
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
        <a :href="formDataset?.url" target="_blank" class="underline text-sm">
          {{ $t("message.datasetSource") }}
        </a>
      </p>

      <div v-show="formDataset" class="my-6">
        <p>{{ $t("message.parameters") }}</p>
        <div class="flex gap-x-2 items-baseline">
          <button type="button" @click="onClickAllButton" class="rounded duration-500">
            {{ $t("message.all") }}
          </button>
          <button type="button" @click="onClickNoneButton" class="rounded duration-500">
            {{ $t("message.none") }}
          </button>
          <a :href="formDataset?.url" target="_blank" class="underline text-sm">
            {{ $t("message.parametersDefinition") }}</a
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
            <label for="stationsNames" class="mr-2">{{ $t("message.station") }}</label>
            <input
              type="text"
              v-model="formStationName"
              name="stationsNames"
              id="stationsNames"
              list="stationsNamesList"
              autocomplete="off"
              class="rounded grow"
              placeholder="▼ Select a station"
              @click="updateFilteredStationsNames($event, true)"
              @focus="updateFilteredStationsNames($event, true)"
              @keyup="updateFilteredStationsNames($event, false)"
              @keyup.down="onKeyUpArrowDataList('arrowDown')"
              @keyup.up="onKeyUpArrowDataList('arrowUp')"
              @keypress.enter.prevent="onKeyEnterDataList()"
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
              :class="{
                active: item == activeDataOptionId,
                inactive: activeDataOptionId && item != activeDataOptionId
              }"
              v-for="item in filteredStationsNames"
              :key="item.id"
              @click="onClickStationNameOption(item.name)"
              @mouseenter="onMouseEnterDataOption(item)"
            >
              {{ item.department }} - {{ item.name }}
            </div>
          </div>
        </fieldset>

        <div class="flex gap-x-6">
          <fieldset>
            <label for="" class="mr-2"> {{ $t("message.from") }}</label>

            <input type="date" v-model="formStartDate" class="rounded" />
          </fieldset>

          <fieldset>
            <label for="" class="mr-2"> {{ $t("message.to") }}</label>
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
        {{ $t("message.fetchData") }}
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
.datalist .datalist-option:hover,
.datalist .datalist-option.active {
  background-color: #006076;
  color: white;
  cursor: pointer;
}
.datalist .datalist-option.inactive {
  color: #006076;
  background-color: white;
  cursor: note;
}
</style>
