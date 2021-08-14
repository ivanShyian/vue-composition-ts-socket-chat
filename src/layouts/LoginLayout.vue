<template>
  <div class="w-full h-full">
    <AuthNavbar/>
    <AuthWrapper/>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import AuthNavbar from '@/components/auth/AuthNavbar.vue'
import AuthWrapper from '@/components/auth/AuthWrapper.vue'
import {useStore} from 'vuex'
export default defineComponent({
  setup() {
    const store = useStore()
    onMounted(() => store.dispatch('auth/logoutAndGoToLoginPage', false))
  },
  components: {AuthWrapper, AuthNavbar}
})
</script>
