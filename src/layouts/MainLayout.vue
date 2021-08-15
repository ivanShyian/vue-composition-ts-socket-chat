<template>
  <UserAuth>
    <template #default>
      <Navbar/>
      <router-view/>
    </template>
  </UserAuth>
</template>

<script>
import Navbar from '@/components/Navbar'
import UserAuth from '@/components/UserAuth'
import {defineComponent, onMounted, nextTick} from 'vue'
import detectMob from '@/utils/isMobile'

export default defineComponent({
  components: {
    Navbar,
    UserAuth
  },
  setup() {
    onMounted(async() => {
      await nextTick()
      const isMobile = detectMob()
      if (isMobile) {
        document.documentElement.scrollTo({top: 0})
      }
    })
  }
})
</script>

<style scoped>

</style>
