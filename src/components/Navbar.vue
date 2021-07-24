<template>
  <div class="py-3 md:py-5 bg-gray-500 dark:bg-gray-800 shadow-md flex justify-between px-4 fixed top-0 left-0 right-0 z-50">
    <span class="text-xl md:text-2xl text-white font-bold font-mono gradient-animation cursor-pointer">isCHAT?</span>
    <div
      id="powerOffButton"
      class="flex items-center cursor-auto justify-center opacity-60 hover:opacity-100 transition-all duration-300"
      @click.prevent="logout"
    >
      <span
        class="pr-2 pt-0.5 uppercase text-xs font-bold tracking-wider cursor-pointer"
        :class="appear ? 'appeared' : 'disappeared'"
      >Logout</span>
      <i class="fas fa-power-off cursor-pointer text-lg"></i>
    </div>
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
      powerButton.addEventListener('mouseenter', (event: any) => toggleAppearValue(event))
      powerButton.addEventListener('mouseleave', (event: any) => toggleAppearValue(event))
    })

    function toggleAppearValue(event: any) {
      appear.value = !appear.value
    }

    onUnmounted(() => {
      const powerButton = document.querySelector('#powerOffButton') as HTMLElement
      powerButton.removeEventListener('mouseenter', toggleAppearValue)
      powerButton.removeEventListener('mouseleave', toggleAppearValue)
    })

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
.gradient-animation {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes gradient {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

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
