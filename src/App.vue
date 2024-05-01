<script setup>
import { ref } from "vue"
import HelloWorld from "./components/HelloWorld.vue"
import Loader from "./components/Loader.vue"
import * as Plotly from "plotly.js-dist"
import { runQuery } from "./duckdb/plotly.js"
import { useDailyDataStore } from "./stores/dailyData"
import fiches from "./assets/meteofrance-fiches-stations.js"
import { stationsColumns, parametersColumns } from "./assets/meteofrance-columns"
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js"

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
      draw(graph.value, title, dates, data)
    }, 100)
  })
}

const draw = (div, title, dates, data) => {
  console.log({ data })
  const dataKeys = Object.keys(data)
  const plotlyData = dataKeys
    .map((column) => {
      if (column !== "AAAAMMJJ") {
        return {
          name: column,
          x: dates,
          y: data[column],
          mode: "lines"
        }
      }
    })
    .filter((item) => item)
  console.log({ plotlyData })

  Plotly.newPlot(
    div,
    plotlyData,

    {
      title: title,
      xaxis: {
        autorange: true,
        // range: ["1930-02-17", "1935-02-16"],
        rangeselector: {
          buttons: [
            {
              count: 1,
              label: "1m",
              step: "month",
              stepmode: "backward"
            },
            {
              count: 6,
              label: "6m",
              step: "month",
              stepmode: "backward"
            },
            { step: "all" }
          ]
        },
        rangeslider: { range: [dates[0], dates[dates.length - 1]] },
        type: "date"
      },
      showLegend: true,
      scrollZoom: true,
      displaylogo: false
    }
  )
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
