<script setup>
import { ref, computed } from "vue"

const props = defineProps(["stations"])

const formStationName = defineModel("formStationName")

const formStartDate = defineModel("formStartDate", {
  default: null
})
const defaultStartDate = new Date()
defaultStartDate.setDate(defaultStartDate.getDate() - 365)
const defaultStartDateStr = defaultStartDate.toISOString().slice(0, 10)

formStartDate.value = defaultStartDateStr

const formEndDate = defineModel("formEndDate", {
  default: null
})
const defaultEndDateStr = new Date().toISOString().slice(0, 10)
formEndDate.value = defaultEndDateStr

const stationsNamesDatalist = ref(null)

// When formStatioName changes, it computes 'filteredStationsNames'
// Fixme : it takes a long time to update with more than 2000 entries
const filteredStationsNames = computed(() => {
  const query = formStationName.value.toLowerCase()

  if (formStationName.value) {
    const filteredStationsNames = props.stations.filter((station) => {
      const fullName = (station.department + " " + station.name).toLowerCase()
      return fullName.includes(query)
    })

    return filteredStationsNames
  } else {
    return props.stations
  }
})

const showStationsNamesDatalist = ref(false)
const activeDataOptionId = ref(null)
// Refs to contain dataOption div (height)
const dataOptionsRefs = ref([])

const onClickStationNameInput = (event) => {
  toggleStationsNamesDatalist(true)
  console.log("filteredStationsNames", filteredStationsNames)
  // If a click occurs, make active the first elemnt
  if (event?.type === "click") {
    const firstOption = filteredStationsNames.value[0]
    activeDataOptionId.value = firstOption
  }
}

const onClickStationNameOption = (name) => {
  formStationName.value = name

  // Hide data list
  toggleStationsNamesDatalist(false)

  // Reset active option
  activeDataOptionId.value = null
}

const toggleStationsNamesDatalist = (show) => {
  if (show === undefined) {
    showStationsNamesDatalist.value = !showStationsNamesDatalist.value
  } else {
    showStationsNamesDatalist.value = show
  }
}
const onMouseEnterDataOption = (dataOptionId) => {
  activeDataOptionId.value = dataOptionId
}

/**
 * When arrow down or arrow up is pressed on data list,
 * update the active item.
 *
 * @param arrowType
 */
const onKeyUpArrowDataList = (arrowType) => {
  const index = filteredStationsNames.value.indexOf(activeDataOptionId.value)

  let increment = 0
  if (arrowType === "arrowUp") {
    increment = -1
  } else if (arrowType === "arrowDown") {
    increment = 1
  }

  let nextIndex = index + increment
  if (nextIndex <= 0) {
    nextIndex = 0
  } else if (nextIndex >= filteredStationsNames.value.length) {
    nextIndex = filteredStationsNames.value.length - 1
  }
  const nextOption = filteredStationsNames.value[nextIndex]
  activeDataOptionId.value = nextOption

  // Scroll the list until the next div option
  const nextDivOption = dataOptionsRefs.value[nextIndex]
  const itemHeight = nextDivOption.clientHeight
  const totalScroll = itemHeight * nextIndex
  // Apply the scroll to the parent:
  stationsNamesDatalist.value.scrollTop = totalScroll
}

/**
 * When Enter is pressed on data list,
 * select the active option as station name.
 */
const onKeyEnterDataList = () => {
  if (activeDataOptionId.value) {
    onClickStationNameOption(activeDataOptionId.value.name)
  }
}
</script>

<template>
  <div class="flex items-baseline">
    <label for="stationsNames" class="mr-2">{{ $t("message.station") }}</label>
    <input
      type="text"
      v-model="formStationName"
      name="stationsNames"
      id="stationsNames"
      list="stationsNamesList"
      autocomplete="off"
      class="rounded grow"
      :placeholder="$t('message.selectAStation')"
      @click="onClickStationNameInput($event)"
      @focus="onClickStationNameInput($event)"
      @keyup.down="onKeyUpArrowDataList('arrowDown')"
      @keyup.up="onKeyUpArrowDataList('arrowUp')"
      @keypress.enter.prevent="onKeyEnterDataList()"
    />
  </div>
  <div
    ref="stationsNamesDatalist"
    class="datalist rounded"
    v-show="showStationsNamesDatalist"
    @mouseleave="toggleStationsNamesDatalist(false)"
  >
    <div
      class="datalist-option"
      :class="{
        active: item == activeDataOptionId,
        inactive: activeDataOptionId && item != activeDataOptionId
      }"
      v-for="item in filteredStationsNames"
      :key="item.id"
      @click="onClickStationNameOption(item.name)"
      @mouseenter="onMouseEnterDataOption(item)"
      ref="dataOptionsRefs"
    >
      {{ item.department }} - {{ item.name }}
    </div>
  </div>
</template>

<style computed>
.datalist {
  background-color: var(--color-base);
  color: var(--color-base-content);
  padding: 4px;
  max-height: 200px;
  overflow-y: scroll;

  margin-top: 0.125rem;

  position: absolute;
  z-index: 1;
}

@media (width <= 640px) {
  .datalist {
    left: 4px;
    width: calc(100% - 8px);
  }
}

.datalist .datalist-option {
  padding: 0px 4px;
}
.datalist .datalist-option:hover,
.datalist .datalist-option.active {
  background-color: var(--color-base-content);
  color: var(--color-base);
  cursor: pointer;
}
.datalist .datalist-option.inactive {
  color: var(--color-base-content);
  background-color: var(--color-base);
  cursor: note;
}
</style>
