<script setup>
const props = defineProps(["appVersion", "buildDate"])
</script>
<template>
  <footer class="flex flex-col items-center justify-center text-sm text-gray-800 my-2">
    <div>
      <span :title="props.buildDate" class="text-sm"> v{{ props.appVersion }} </span>
    </div>
    <div>Copyright © {{ new Date().getFullYear() }} - Meteo CoinCoin by Maxime Pawlak</div>
  </footer>
</template>
