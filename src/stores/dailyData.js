import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useDailyDataStore = defineStore("dailyData", () => {
  const parametersColumns = ref([]);
  const stationsColumns = ref([]);
  const stationsNames = ref([]);
  const stationsIds = ref([]);

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

  return {
    stationsNames,
    parametersColumns,
    stationsColumns,
    stationsIds,
    setStationsColumns,
    setParametersColumns,
    setStationsNames,
    setStationsIds,
  };
});
