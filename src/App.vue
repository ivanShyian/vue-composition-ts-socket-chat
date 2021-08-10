<template>
  <div class="bg-green-300 text-emerald-900 dark:text-blue-100 bg-blue-100 dark:bg-gray-700 color overflow-y-hidden h-screen">
    <component :is="activeLayout + '-layout'"></component>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import LoginLayout from './layouts/LoginLayout.vue'
import MainLayout from './layouts/MainLayout.vue'

export default defineComponent({
  setup() {
    const route = useRoute()

    onMounted(async() => {
      setHTMLClass()
    })

    // TODO temporary adding fixed class
    function setHTMLClass(): void {
      (document.querySelector('html') as HTMLHtmlElement).classList.add('dark')
    }

    const activeLayout = computed((): string => {
      if (route.meta.auth === undefined) {
        return 'main'
      }
      return route.meta.auth ? 'main' : 'login'
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
