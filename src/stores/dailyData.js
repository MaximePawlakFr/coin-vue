import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useDailyDataStore = defineStore("dailyData", () => {
  const parametersColumns = ref([]);
  const stationsColumns = ref([]);
  const stationsNames = ref([]);
  const stationsIds = ref([]);
  const stations = ref([]);

  const isFetchingData = ref(false);

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

  function setIsFetchingData(newValue) {
    setArray(isFetchingData, newValue);
  }

  return {
    stationsNames,
    parametersColumns,
    stationsColumns,
    stationsIds,
    stations,
    isFetchingData,
    setStationsColumns,
    setParametersColumns,
    setStationsNames,
    setStationsIds,
    setStations,
    setIsFetchingData,
  };
});
