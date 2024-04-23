<script setup>
import {ref,onMounted} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import * as Plotly from "plotly.js-dist";
import {runQuery} from './duckdb/plotly.js'
const graph = ref(null)


function submit(form){
  console.log("submit",form)
  return runQuery().then(res=>{
    console.log({res})
    const {dates, dataTN, dataTX} = res;
  draw(graph.value,dates, dataTN, dataTX);

  })

}

const draw = (div,dates, dataTN, dataTX)=>{
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

onMounted(()=>{
  console.log("mounted")
console.log("graph",graph)
console.log("graph",graph.innerHtml)
console.log("graph",graph.value)

const dates = ["2024-01-01","2024-01-02"];
const dataTN=[1,2]
const dataTX = [3,4]
  // draw(graph.value,dates, dataTN, dataTX);
});
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
