<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import * as Plotly from "plotly.js-dist";
import { runQuery } from './duckdb/plotly.js'
import {useDailyDataStore} from './stores/dailyData'
import fiches from "./assets/meteofrance-fiches-stations.js";
import {  
   stationsColumns, parametersColumns} from "./assets/meteofrance-columns";

const graph = ref(null)
const dailyDataStore  = useDailyDataStore()


function submit(form) {
  console.log("submit", form)
  const { query } = form;
  return runQuery(query).then(res => {
    console.log({ res })
    const { dates, dataTN, dataTX } = res;
    draw(graph.value, dates, dataTN, dataTX);

  })
}

const draw = (div, dates, dataTN, dataTX) => {
  Plotly.newPlot(
    div,
    [
      {
        name: "TN",
        x: dates,
        y: dataTN,
        mode: "lines",
      },
      {
        name: "TX",
        x: dates,
        y: dataTX,
        mode: "lines",
        line: { color: "red" },
      },
    ],
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
        rangeslider: { range: ["1925-02-17", "1930-02-16"] },
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
      <div ref="graph" style="width: 80vw;height:400px;">
      </div>
    </div>
  </header>

</template>