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


  const worker = perspective.worker();

const graph = ref(null)
const viewer = ref(null)
const dailyDataStore  = useDailyDataStore()

const isDrawing = defineModel('isDrawing', false);

function submit(form) {
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

fiches.features.map(station => {
  const {NOM_USUEL, NUM_POSTE} = station.properties
  stationsNames.push(NOM_USUEL)
  stationsIds.push(NUM_POSTE)
})

dailyDataStore.setStationsColumns(stationsColumns)
dailyDataStore.setParametersColumns(parametersColumns)
dailyDataStore.setStationsNames(stationsNames.sort())
dailyDataStore.setStationsIds(stationsIds.sort())

</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="You did it!" @submit="submit" />
      <h3>isDrawing: {{ isDrawing }}</h3>
      <perspective-viewer ref="viewer"> </perspective-viewer>
      <div ref="graph" style="width: 100vw;height:400px;">
      </div>
    </div>
  </header>

</template>

<style scoped>
perspective-viewer {
  width: 50vw;
  height: 200px;
}</style>