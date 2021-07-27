<template>
  <Navbar/>
  <UserAuth/>
  <router-view/>
</template>

<script>
import Navbar from '@/components/Navbar'
import UserAuth from '@/components/UserAuth'
import {defineComponent} from 'vue'

export default defineComponent({
  components: {
    Navbar,
    UserAuth
  }
})
</script>

<style scoped>

</style>
