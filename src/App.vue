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
import icons from "./i18n/icons"
const POSTHOG_KEY = ENV.VITE_POSTHOG_KEY
import BrevoForm from "./components/BrevoForm.vue"
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
const showModal = ref(false)

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

const toggleShowModal = (show = false) => {
  if (typeof show === "boolean") {
    showModal.value = show
  } else {
    showModal.value = !showModal.value
  }
}

const onClickSignUpButton = () => {
  toggleShowModal(true)
}
</script>

<template>
  <nav class="fixed w-full">
    <div class="flex justify-between items-baseline p-4">
      <div class="basis-1/3"><span class="sm:mx-4 sm:px-8">🦆</span></div>
      <div class="basis-1/3 text-center">Meteo CoinCoin</div>
      <div class="basis-1/3 text-right">
        <div class="locale-changer inline cursor-pointer">
          <select v-model="$i18n.locale">
            <option
              v-for="locale in $i18n.availableLocales"
              :key="`locale-${locale}`"
              :value="locale"
            >
              {{ icons[locale] }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="sm:mx-4 sm:px-8 text-sm sm:text-base rounded duration-500"
          @click="onClickSignUpButton"
        >
          {{ $t("message.signup") }}
        </button>
      </div>
    </div>
  </nav>
  <header class="">
    <h1 class="text-2xl sm:text-6xl text-center">
      Meteo
      <span class="reverse" title="Coin">🦆</span>
      CoinCoin <span title="Coin">🦆</span>
    </h1>
    <h2 class="my-8 text-lg font-thin text-center">
      <span class="my-4 block" title="Coin Coin Coin Coin"
        >"<em>{{ $t("message.slogan") }}</em
        >"</span
      >
    </h2>

    <h2 class="my-16 text-lg font-thin text-center" v-html="$t('message.description')"></h2>
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

  <div class="modal" v-show="showModal">
    <BrevoForm></BrevoForm>

    <button type="button" class="modal-btn-close" @click="toggleShowModal(false)">&#x2715;</button>
  </div>
</template>

<style computed>
.reverse {
  transform: scaleX(-1);
  width: fit-content;
  display: inline-block;
}

.locale-changer select {
  background-color: var(--color-blue-duck);
}
</style>
