import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useDailyDataStore = defineStore("dailyData", () => {
  const parametersColumns = ref([]);
  const stationsColumns = ref([]);
  const stationsNames = ref([]);
  const stationsIds = ref([]);
  const stations = ref([]);

  function setArray(refArray, newArray) {
    refArray.value = newArray;
  }

  function setParametersColumns(newArray) {
    setArray(parametersColumns, newArray);
  }

  function setStationsColumns(newArray) {
    setArray(stationsColumns, newArray);
  }

  function setStationsNames(newArray) {
    setArray(stationsNames, newArray);
  }

  function setStationsIds(newArray) {
    setArray(stationsIds, newArray);
  }

  function setStations(newArray) {
    setArray(stations, newArray);
  }

  return {
    stationsNames,
    parametersColumns,
    stationsColumns,
    stationsIds,
    stations,
    setStationsColumns,
    setParametersColumns,
    setStationsNames,
    setStationsIds,
    setStations,
  };
});
