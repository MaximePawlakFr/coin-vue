import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useDailyDataStore = defineStore("dailyData", () => {
  const stationsNames = ref([]);
  const stationsIds = ref([]);

  function setStationsNames(names) {
    console.log("setStationsNames", names);
    stationsNames.value = names;
  }

  return { stationsNames, setStationsNames };
});
