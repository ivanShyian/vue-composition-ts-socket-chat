<template>
  <div class="py-3 md:py-5 bg-gray-500 dark:bg-gray-800 shadow-md flex justify-between px-4 fixed top-0 left-0 right-0">
    <span class="text-xl md:text-2xl text-white font-bold font-mono">isCHAT?</span>
    <button @click.prevent="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  setup() {
    const store = useStore()
    return {
      logout: () => {
        store.dispatch('auth/logoutAndGoToLoginPage')
      }
    }
  }
})
</script>
