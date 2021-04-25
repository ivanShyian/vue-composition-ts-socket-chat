<template>
  <div class="bg-green-300 text-emerald-900 dark:text-blue-100 dark:bg-gray-700 color overflow-y-hidden">
    <component :is="activeLayout + '-layout'"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LoginLayout from './layouts/LoginLayout.vue'
import MainLayout from './layouts/MainLayout.vue'
export default defineComponent({
  setup() {
    const _route = useRoute()

    onMounted(() => {
      setHTMLClass()
    })

    // TODO temporary adding fixed class
    function setHTMLClass():void {
      document.querySelector('html')!.classList.add('dark')
    }

    // TODO temporary returning statement
    const activeLayout = computed((): string => {
      return _route.meta.auth ? 'main' : 'login'
    })

    return {
      activeLayout
    }
  },
  components: {
    LoginLayout,
    MainLayout
  }
})
</script>
