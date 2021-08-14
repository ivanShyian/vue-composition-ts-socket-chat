<template>
  <div
    class="py-1 md:py-4 bg-gray-500 dark:bg-gray-800 shadow-md flex justify-between items-center px-4 fixed top-0 left-0 right-0 z-50"
  >
<!--    <div class="hidden toggle-bar relative border opacity-50 hover:opacity-80 h-6 w-14 rounded-2xl text-sm flex justify-between items-center px-1">-->
<!--      <i class="far fa-sun relative z-10"></i>-->
<!--      <i class="far fa-moon relative z-10"></i>-->
<!--    </div>-->
    <TheSearchField/>
    <span
      v-if="$route.meta.auth !== undefined"
      class="ml-10 md:ml-4 text-xl md:text-2xl text-white font-bold font-mono gradient-animation cursor-pointer"
    >isCHAT?</span>
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
import {defineComponent, onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import TheSearchField from '@/components/ui/TheSearchField.vue'

export default defineComponent({
  components: {TheSearchField},
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

    function logout() {
      store.dispatch('auth/logoutAndGoToLoginPage')
    }

    return {
      logout,
      appear
    }
  }
})
</script>
<style lang="scss">
.searched-result:last-child {
  border-bottom: none;
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

.toggle-bar:before {
  content: '';
  position: absolute;
  top: 1px;
  bottom: 0;
  left: 2px;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background-color: aliceblue;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}

// Transition input
.input-transition {
  transition: all 0.2s ease-in-out;
}

// Transition teleport
.teleport-enter-active,
.teleport-leave-active {
  transition: all .5s ease;
}
.teleport-enter-from,
.teleport-leave-to {
}
</style>
