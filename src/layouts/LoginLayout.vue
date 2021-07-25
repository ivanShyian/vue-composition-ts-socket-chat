<template>
  <div class="w-full h-full">
    <AuthNavbar/>
    <AuthWrapper/>
  </div>
</template>
<script>
import AuthNavbar from '@/components/auth/AuthNavbar'
import AuthWrapper from '@/components/auth/AuthWrapper'
export default {
  components: {AuthWrapper, AuthNavbar}
}
</script>
