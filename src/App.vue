<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import * as Plotly from "plotly.js-dist";
import { runQuery } from './duckdb/plotly.js'
import {useDailyDataStore} from './stores/dailyData'
import fiches from "./assets/meteofrance-fiches-stations.js";
import {  
   stationsColumns, parametersColumns} from "./assets/meteofrance-columns";
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";

import posthog from 'posthog-js'
const ENV = import.meta.env;

const POSTHOG_KEY = ENV.VITE_POSTHOG_KEY 
console.log(ENV) 

// Init only for prod to avoir sending false signals
if(POSTHOG_KEY){
  posthog.init(POSTHOG_KEY, { api_host: 'https://eu.i.posthog.com' })
}


const worker = perspective.worker();

const graph = ref(null)
const viewer = ref(null)
const dailyDataStore  = useDailyDataStore()

const isDrawing = defineModel('isDrawing', false);

function submit(form) {
  posthog.capture('my event', { property: 'value' })
  console.log("submit", form)
  isDrawing.value = true;
  return runQuery(form)
  .then(res => {
    console.log({ res })
    const { dates, data } = res;
    
 const workerData = worker.table(data)
    viewer.value.load(workerData);

    
    draw(graph.value, dates, data);
  isDrawing.value = false;

  })
}

const draw = (div, dates, data) => {
  console.log({data})
  const dataKeys =  Object.keys(data)
  const plotlyData = dataKeys.map(column => {
    if(column !== "AAAAMMJJ"){
      return {
        name: column,
        x:dates,
        y:data[column],
        mode:"lines"
      }
    }
  }).filter(item => item)
  console.log({plotlyData})

  Plotly.newPlot(
    div,plotlyData,
    
    {
      title: "Coin Coin",
      xaxis: {
        autorange: true,
        // range: ["1930-02-17", "1935-02-16"],
        rangeselector: {
          buttons: [
            {
              count: 1,
              label: "1m",
              step: "month",
              stepmode: "backward",
            },
            {
              count: 6,
              label: "6m",
              step: "month",
              stepmode: "backward",
            },
            { step: "all" },
          ],
        },
        rangeslider: { range: [dates[0], dates[dates.length-1]] },
        type: "date",
      },
      showLegend: true,
      scrollZoom: true,
      displaylogo: false,
    },
  );
}
const stationsNames = [];
const stationsIds = []

const stations = fiches.features.map(feature => {
  const {NOM_USUEL, NUM_POSTE, NUM_DEP} = feature.properties
  stationsNames.push(NOM_USUEL)
  stationsIds.push(NUM_POSTE)

  const station = {
    name:NOM_USUEL,
    id:NUM_POSTE,
    department:NUM_DEP>9?""+NUM_DEP:"0"+NUM_DEP
  };
  return station
})
stations.sort((a,b)=>{
  if( a.NUM_DEP >= b.NUM_DEP){
    return 1;
  }else{
    return -1
  }
})
dailyDataStore.setStations(stations);
dailyDataStore.setStationsColumns(stationsColumns)
dailyDataStore.setParametersColumns(parametersColumns)
dailyDataStore.setStationsNames(stationsNames.sort())
dailyDataStore.setStationsIds(stationsIds.sort())

</script>

<template>
  <header>
    <h1 class="text-3xl text-center m-16">Meteo 🦆 Coin-Coin 🦆</h1>
  </header>
  <main>
    <div>
      <HelloWorld msg="You did it!" @submit="submit" />
      <h3>isDrawing: {{ isDrawing }}</h3>
      <perspective-viewer ref="viewer"> </perspective-viewer>
      <div ref="graph" style="width: 100vw;height:400px;">
      </div>
    </div>

  </main>
  <footer class="flex flex-col items-center justify-center">
    <div>
      © All rights Reserverd - Meteo Coin-Coin by Maxime Pawlak 
    </div>
      <div>
        
      <span :title="ENV.VITE_BUILD_DATE" class="text-sm">
        v{{ENV.VITE_APP_VERSION}}
      </span>  
    </div>
    <div>
      <span class="text-xs">
        {{ENV.VITE_BUILD_DATE}}
      </span>
    </div>
  </footer>

</template>

<style scoped>
perspective-viewer {
  width: 100vw;
  height: 200px;
}</style>