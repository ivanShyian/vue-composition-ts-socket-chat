<template>
  <div class="mx-0 md:mx-2 w-full md:w-5/6 border-white border-opacity-20 h-full pb-2">
    <router-view/>
  </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  props: {},
  setup() {
    return {}
  }
})
</script>

<style scoped>

</style>
