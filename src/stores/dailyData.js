import { ref } from "vue";
import { defineStore } from "pinia";

export const useDailyDataStore = defineStore("dailyData", () => {
  const stations = ref([]);

  const isFetchingData = ref(false);

  function setArray(refArray, newArray) {
    refArray.value = newArray;
  }

  function setStations(newArray) {
    setArray(stations, newArray);
  }

  function setIsFetchingData(newValue) {
    setArray(isFetchingData, newValue);
  }

  return {
    stations,
    isFetchingData,
    setStations,
    setIsFetchingData,
  };
});
