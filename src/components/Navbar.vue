<template>
  <div class="py-3 md:py-5 bg-gray-500 dark:bg-gray-800 shadow-md flex justify-between px-4 fixed top-0 left-0 right-0 z-50">
    <span class="text-xl md:text-2xl text-white font-bold font-mono gradient-animation cursor-pointer">isCHAT?</span>
    <button
      id="powerOffButton"
      class="flex items-center cursor-auto justify-center focus:outline-none"
      @click.prevent="logout"
    >
      <span
        class="pr-2 pt-0.5 uppercase text-xs font-bold tracking-wider cursor-pointer"
        :class="appear ? 'appeared' : 'disappeared'"
      >Logout</span>
      <i
        :class="{'opacity-100': appear}"
        class="fas fa-power-off cursor-pointer text-lg opacity-60 hover:opacity-100 transition-all duration-300"
      ></i>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref} from 'vue'
import {useStore} from 'vuex'
export default defineComponent({
  setup() {
    const store = useStore()
    const appear = ref(false)

    onMounted(() => {
      const powerButton = document.querySelector('#powerOffButton') as HTMLElement
      for (let i = 0; i < powerButton.children.length; i++) {
        const child = powerButton.children[i]
        if (child.tagName === 'I') {
          child.addEventListener('mouseenter', (event: any) => toggleAppearValue(event))
          break
        }
      }
      powerButton.addEventListener('mouseleave', (event: any) => toggleAppearValue(event))
    })

    function toggleAppearValue(event: Event) {
      if (event.type === 'mouseleave' && appear.value) {
        appear.value = false
        return
      }
      if (event.type === 'mouseleave' && !appear.value) {
        return
      }
      appear.value = true
    }

    return {
      logout: () => {
        store.dispatch('auth/logoutAndGoToLoginPage')
      },
      appear
    }
  }
})
</script>
<style lang="scss">
.disappeared {
  transform: translateX(200px);
  opacity: 0;
  transition: transform .7s ease-in-out, opacity .2s ease-out;
}

.appeared {
  transform: translateX(0);
  opacity: 1;
  transition: transform .2s ease-out, opacity 1s ease-in-out;
}
</style>
