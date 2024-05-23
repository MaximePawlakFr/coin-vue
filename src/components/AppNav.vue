<script setup>
import icons from "../i18n/icons"

const emit = defineEmits({
  onClickSignUpButton: () => {
    return true
  }
})

const onClickSignUpButton = () => {
  emit("onClickSignUpButton")
}
</script>
<template>
  <nav class="fixed w-full">
    <div class="flex justify-between items-baseline p-4">
      <div class="basis-1/3">
        <span class="sm:mx-4 sm:px-8">
          Meteo
          <span class="reverse" title="Coin">🦆</span>
          CoinCoin <span title="Coin">🦆</span>
        </span>
      </div>
      <div class="basis-1/3 text-center">
        <em> {{ $t("message.slogan") }}</em>
      </div>
      <div class="basis-1/3 text-right">
        <div class="locale-changer inline cursor-pointer">
          <select v-model="$i18n.locale">
            <option
              v-for="locale in $i18n.availableLocales"
              :key="`locale-${locale}`"
              :value="locale"
            >
              {{ icons[locale] }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="btn-primary sm:mx-4 sm:px-8 text-sm sm:text-base rounded duration-500"
          @click="onClickSignUpButton"
        >
          {{ $t("message.signup") }}
        </button>
      </div>
    </div>
  </nav>
</template>
