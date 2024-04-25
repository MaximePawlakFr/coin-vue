<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import * as Plotly from "plotly.js-dist";
import { runQuery } from './duckdb/plotly.js'
import { DuckDbFactory } from './duckdb/duckdb';
import {useDailyDataStore} from './stores/dailyData'
import sqlClient from './duckdb/sqlClient';
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
let uniqueStationsNames;
let conn = null
DuckDbFactory.getInstance().then((db) => {
  return db.connect();
}).then((res) => {
  conn = res;
  // Either materialize the query result
  const query = sqlClient.getColumnsQuery()
  return conn.query(query);
}).then((result) => {
  console.log(result)
  console.log(result.toArray())
  const columns = result.schema.fields.map(x => x.name)
  console.log(columns)
  dailyDataStore.setColumns(columns)
  
  const query = sqlClient.getStationsNamesAndIdsQuery()
  return conn.query(query);
}).then((result) => {
  console.log(result)

  result.toArray().map((row) => {
    const r = row.toJSON();
    const { NOM_USUEL, NUM_POSTE } = r
    stationsNames.push(NOM_USUEL)
    stationsIds.push(NUM_POSTE)
  })
  uniqueStationsNames = [... new Set(stationsNames)]
  dailyDataStore.setStationsNames(uniqueStationsNames)

  console.log(uniqueStationsNames)
  console.log(stationsIds)
  conn.close()
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" @submit="submit" />
      <div ref="graph" style="width: 80vw;height:400px;">
      </div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
