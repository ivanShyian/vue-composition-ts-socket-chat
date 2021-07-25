<template>
  <div class="container mx-auto h-full flex justify-center items-center">
    <div class="border-2 rounded-lg py-8 px-12 mt-20 modal-shadow">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
})
</script>

<style lang="scss" scoped>
</style>
