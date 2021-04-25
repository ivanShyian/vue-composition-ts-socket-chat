<template>
  <navbar></navbar>
  <router-view/>
</template>

<script>
import Navbar from '@/components/Navbar'
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return {}
  },
  components: {
    Navbar
  }
})
</script>

<style scoped>

</style>
