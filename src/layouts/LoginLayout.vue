<template>
  <div class="w-full h-full">
    <AuthNavbar/>
    <AuthWrapper/>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import AuthNavbar from '@/components/auth/AuthNavbar'
import AuthWrapper from '@/components/auth/AuthWrapper'
export default defineComponent({
  components: {AuthWrapper, AuthNavbar}
})
</script>
