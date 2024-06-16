<script setup>
import { useDailyDataStore } from "../stores/dailyData.js"
import { storeToRefs } from "pinia"
import sqlClient from "../duckdb/sqlQueryBuilder.js"
import { computed } from "vue"
import { datasetsGroups } from "../datasets/meteoFrance/index.js"
import vSelect from "vue-select"
import "vue-select/dist/vue-select.css"

const dailyDataStore = useDailyDataStore()
const { stations, isFetchingData } = storeToRefs(dailyDataStore)

const formDataset = defineModel("formDataset", {
  default: null
})

const parametersColumns = [
  { label: "precipitation", value: "RR" },
  { label: "temperatureMin", value: "TN" },
  { label: "temperatureMax", value: "TX" },
  { label: "temperatureAvg", value: "TM" }
]

const formParametersColumns = defineModel("formParametersColumns", {
  default: []
})

const formStationName = defineModel("formStationName", {
  default: ""
})

const formStartDate = defineModel("formStartDate", {
  default: "2023-01-01"
})

const formEndDate = defineModel("formEndDate", {
  default: "2024-01-01"
})

const isFormReadyToSubmit = computed(() => {
  const errors = []
  if (isFetchingData.value) {
    errors.push("isFetchingData")
  }
  if (formParametersColumns.value.length <= 0) {
    errors.push("formParametersColumns")
  }
  if (!formStationName.value) {
    errors.push("formStationName")
  }
  if (!formStartDate.value || !formEndDate.value) {
    errors.push("formStartDate")
  }
  console.log("errors", errors)
  if (errors.length > 0) {
    return false
  }
  return true
})

const onClickAllButton = () => {
  formParametersColumns.value = parametersColumns.map((x) => x.value)
}

const onClickNoneButton = () => {
  formParametersColumns.value = []
}

// const onClickExampleButton = () => {
//   formDataset.value = datasetsGroups[0].datasets[3] //BASE > MENS
//   formParametersColumns.value = ["RR", "TN", "TX", "TM"]
//   formStationName.value = "TOULOUSE-BLAGNAC"
//   formStartDate.value = "2010-01-01"
//   formEndDate.value = "2020-01-01"
// }

const emit = defineEmits({
  submit: () => {
    return true
  }
})

function onSubmit() {
  if (!isFormReadyToSubmit.value) {
    return
  }
  // Concat date, station and parameters columns
  const dateColumn = formDataset.value.columns.date
  const stationColumns = formDataset.value.columns.station

  const columns = [dateColumn, ...stationColumns, ...formParametersColumns.value]

  const parquetUrls = formDataset.value.parquet_urls
  const stationName = formStationName.value

  const startDate = formStartDate.value
  const endDate = formEndDate.value

  const fullQuery = sqlClient.buildQuery(
    columns,
    parquetUrls,
    stationName,
    dateColumn,
    startDate,
    endDate
  )

  dailyDataStore.setIsFetchingData(true)

  emit("submit", {
    dataset: formDataset.value,
    query: fullQuery,
    columns: columns,
    stationName: formStationName.value,
    startDate: formStartDate.value,
    endDate: formEndDate.value
  })
}
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="">
      <!-- <div class="text-center">
        <button type="button" @click="onClickExampleButton" class="rounded duration-500 px-8">
          {{ $t("message.showMeExample") }}
        </button>
      </div> -->

      <div class="flex flex-col gap-y-4">
        <div>
          <h3 class="text-lg font-semibold">{{ $t("message.step1") }}</h3>
          <fieldset class="my-2">
            <v-select
              :placeholder="$t('message.selectAStation')"
              :options="stations"
              :get-option-label="(option) => option.department + ' ' + option.name"
              :reduce="(option) => option.name"
              v-model="formStationName"
            ></v-select>
          </fieldset>
        </div>

        <div>
          <h3 class="text-lg font-semibold">{{ $t("message.step2") }}</h3>
          <div class="my-2">
            <div class="flex gap-x-2 items-baseline">
              <button type="button" @click="onClickAllButton" class="rounded duration-500">
                {{ $t("message.all") }}
              </button>
              <button type="button" @click="onClickNoneButton" class="rounded duration-500">
                {{ $t("message.none") }}
              </button>
              <!-- <a :href="formDataset?.documentationUrl" target="_blank" class="underline text-sm">
            {{ $t("message.parametersDefinition") }}</a
          > -->
            </div>
            <fieldset class="flex flex-col my-2">
              <template v-for="item in parametersColumns" :key="item.label">
                <div class="mx-1">
                  <input
                    type="checkbox"
                    name="formParametersColumns"
                    :id="item.label"
                    :value="item.value"
                    v-model="formParametersColumns"
                    class="rounded"
                  />
                  <label :for="item.label" class="mx-2">{{ $t("parameters." + item.label) }}</label>
                </div>
              </template>
            </fieldset>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold">{{ $t("message.step3") }}</h3>

          <fieldset class="my-2">
            <select
              name="formDataset"
              id="formDataset"
              class="w-full rounded duration-500"
              v-model="formDataset"
              required
            >
              <option value="" disabled>▼ {{ $t("message.selectADataset") }}</option>
              <optgroup v-for="group in datasetsGroups" :label="group.name" :key="group.id">
                <option
                  v-for="item in group.datasets"
                  :value="item"
                  :key="item.id"
                  :disabled="!item.available"
                  :title="!item.available ? $t('message.premiumOnly') : ''"
                >
                  {{ item.name }} {{ item.available ? "" : " &#128274;" }}
                </option>
              </optgroup>
            </select>
          </fieldset>
          <!-- <p v-show="formDataset">
          <a :href="formDataset?.url" target="_blank" class="underline text-sm">
            {{ $t("message.datasetSource") }}
          </a>
        </p> -->
        </div>
        <div>
          <h3 class="text-lg font-semibold">{{ $t("message.step4") }}</h3>

          <div class="my-2 flex gap-x-6 items-baseline">
            <fieldset>
              <label for="" class="mr-2"> {{ $t("message.from") }}</label>

              <input type="date" v-model="formStartDate" class="rounded" />
            </fieldset>

            <fieldset>
              <label for="" class="mr-2"> {{ $t("message.to") }}</label>
              <input type="date" v-model="formEndDate" class="rounded" />
            </fieldset>
          </div>
        </div>
      </div>

      <button
        role="submit"
        class="w-full my-6 py-4 text-xl rounded duration-500 btn-primary"
        :disabled="!isFormReadyToSubmit"
      >
        {{ $t("message.fetchData") }}
      </button>
    </form>
  </div>
</template>

<style computed>
:root {
  --vs-border-color: var(--color-base-content);
  --vs-dropdown-option--active-bg: var(--color-blue-duck);
}
</style>
