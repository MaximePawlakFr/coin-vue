<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})

const emit = defineEmits({submit:(form)=>{
  console.log("form", form)
  return true
}})

function buttonClick() {
  console.log("buttonClick")
  emit('submit', {name:1})
}
</script>

<template>
  <div class="greetings">
    
    <input v-model="query" placeholder="Your query"/>
    <button @click="buttonClick">Go </button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
