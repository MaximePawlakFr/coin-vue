<script setup>
import { ref } from "vue"
import DatasetForm from "./components/DatasetForm.vue"
import AppFooter from "./components/AppFooter.vue"
import AppPlot from "./components/AppPlot.vue"
import Loader from "./components/Loader.vue"
import { runQuery } from "./duckdb/dataClient.js"
import { useDailyDataStore } from "./stores/dailyData"
import { storeToRefs } from "pinia"
import fiches from "./datasets/meteoFrance/fiches-stations.js"
import { stationsColumns, parametersColumns } from "./assets/meteofrance-columns"
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js"
import posthog from "posthog-js"
const ENV = import.meta.env

const POSTHOG_KEY = ENV.VITE_POSTHOG_KEY

// Init only for prod to avoir sending false signals
if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, { api_host: "https://eu.i.posthog.com" })
}

const worker = perspective.worker()

const viewer = ref(null)

const data = ref(null)
const dates = ref(null)
const dateColumn = ref(null)
const title = ref(0)

const dailyDataStore = useDailyDataStore()
const { isFetchingData } = storeToRefs(dailyDataStore)

const isGraphReady = ref(false)

function submit(form) {
  const { dataset, columns, stationName, startDate, endDate } = form
  dateColumn.value = dataset.columns.date
  posthog.capture("fetchData", { dataset: dataset.name, columns, stationName, startDate, endDate })
  console.log("submit", form)
  isGraphReady.value = false

  return runQuery(form).then((res) => {
    console.log({ res })

    dates.value = res.dates
    data.value = res.data
    title.value = `${stationName} - ${startDate} -> ${endDate}`

    isGraphReady.value = true
    dailyDataStore.setIsFetchingData(false)

    const workerData = worker.table(res.data)
    viewer.value.load(workerData)
  })
}

const stationsNames = []
const stationsIds = []

const stations = fiches.features.map((feature) => {
  const { NOM_USUEL, NUM_POSTE, NUM_DEP } = feature.properties
  stationsNames.push(NOM_USUEL)
  stationsIds.push(NUM_POSTE)

  const station = {
    name: NOM_USUEL,
    id: NUM_POSTE,
    department: NUM_DEP > 9 ? "" + NUM_DEP : "0" + NUM_DEP
  }
  return station
})
stations.sort((a, b) => {
  if (a.NUM_DEP >= b.NUM_DEP) {
    return 1
  } else {
    return -1
  }
})
dailyDataStore.setStations(stations)
dailyDataStore.setStationsColumns(stationsColumns)
dailyDataStore.setParametersColumns(parametersColumns)
dailyDataStore.setStationsNames(stationsNames.sort())
dailyDataStore.setStationsIds(stationsIds.sort())
</script>

<template>
  <header class="">
    <h1 class="text-3xl text-center">
      Meteo
      <span class="reverse" title="Coin">🦆</span>
      CoinCoin <span title="Coin">🦆</span>
    </h1>
    <h2 class="my-8 text-lg font-thin text-center">
      <span class="my-4 block" title="Coin Coin Coin Coin"
        >"<em>Master the weather like a duck</em>"</span
      >
      <span>
        Explore weather open-data from all providers:<br />
        Meteo-France, WMO and many more.
      </span>
    </h2>
  </header>
  <main class="flex-1 flex flex-col">
    <div class="container mx-auto">
      <DatasetForm @submit="submit" />
    </div>

    <div class="grow flex flex-col justify-center my-4">
      <div v-show="isGraphReady && !isFetchingData" class="flex flex-col">
        <AppPlot :data="data" :dates="dates" :dateColumn="dateColumn" :title="title" />
        <perspective-viewer ref="viewer" class="h-80"> </perspective-viewer>
      </div>
      <Loader v-show="isFetchingData" class="my-4 w-full h-4 flex items-center justify-center" />
    </div>
  </main>
  <AppFooter :app-version="ENV.VITE_APP_VERSION" :build-date="ENV.VITE_BUILD_DATE" />
</template>

<style computed>
.reverse {
  transform: scaleX(-1);
  width: fit-content;
  display: inline-block;
}
</style>
