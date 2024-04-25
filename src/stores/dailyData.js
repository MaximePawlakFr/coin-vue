import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useDailyDataStore = defineStore("dailyData", () => {
  const columns = ref([]);
  const stationsNames = ref([]);
  const stationsIds = ref([]);

  function setStationsNames(items) {
    console.log("setStationsNames", items);
    stationsNames.value = items;
  }

  function setColumns(items) {
    console.log("setColumns", items);
    columns.value = items;
  }

  return { stationsNames, setStationsNames, columns, setColumns };
});
