<script setup>
import { ref } from "vue"
import HelloWorld from "./components/HelloWorld.vue"
import Loader from "./components/Loader.vue"
import { runQuery } from "./duckdb/dataClient.js"
import { useDailyDataStore } from "./stores/dailyData"
import fiches from "./assets/meteofrance-fiches-stations.js"
import { stationsColumns, parametersColumns } from "./assets/meteofrance-columns"
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js"
import { drawPlot } from "./utils/plotly"

import posthog from "posthog-js"
const ENV = import.meta.env

const POSTHOG_KEY = ENV.VITE_POSTHOG_KEY
console.log(ENV)

// Init only for prod to avoir sending false signals
if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, { api_host: "https://eu.i.posthog.com" })
}

const worker = perspective.worker()

const graph = ref(null)
const viewer = ref(null)
const dailyDataStore = useDailyDataStore()

const isFetchingData = defineModel("isFetchingData", false)
const isGraphReady = defineModel("isGraphReady", false)

function submit(form) {
  posthog.capture("my event", { property: "value" })
  console.log("submit", form)
  const { stationName, startDate, endDate } = form
  isFetchingData.value = true
  return runQuery(form).then((res) => {
    console.log({ res })
    const { dates, data } = res

    isGraphReady.value = true
    isFetchingData.value = false

    const workerData = worker.table(data)
    viewer.value.load(workerData)
    setTimeout(() => {
      const title = `${stationName} - ${startDate} -> ${endDate}`
      drawPlot(graph.value, title, dates, data)
    }, 100)
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
    <h1 class="text-3xl text-center">Meteo 🦆 Coin-Coin 🦆</h1>
  </header>
  <main class="flex-1 flex flex-col">
    <div class="container mx-auto">
      <HelloWorld msg="You did it!" @submit="submit" />
    </div>

    <div class="grow flex flex-col justify-center my-4">
      <div v-show="isGraphReady && !isFetchingData" class="flex flex-col">
        <div ref="graph" class="h-75-vh"></div>
        <perspective-viewer ref="viewer" class="h-80"> </perspective-viewer>
      </div>
      <Loader v-show="isFetchingData" class="my-4 w-full h-4 flex items-center justify-center" />
    </div>
  </main>
  <footer class="flex flex-col items-center justify-center text-sm text-gray-800 my-2">
    <div>
      <span :title="ENV.VITE_BUILD_DATE" class="text-sm"> v{{ ENV.VITE_APP_VERSION }} </span>
    </div>
    <div>Copyright © {{ new Date().getFullYear() }} - Meteo Coin-Coin by Maxime Pawlak</div>
  </footer>
</template>

<style>
body {
  background-color: #006076;
  color: #fff;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
#app {
  padding-top: 4rem;
  min-height: 100vh;
}

input,
select {
  color: #006076;
}

button,
input[type="submit"] {
  background-color: #fff;
  color: #006076;
  padding: 4px 8px;
  border: 1px solid #006076;
}

button:hover,
input[type="submit"]:hover {
  background-color: #006076;
  color: #fff;
  border-color: #fff;
}

input {
  padding: 4px 8px;
}

.h-50-vh {
  height: 50vh;
}

.h-75-vh {
  height: 75vh;
}
</style>
