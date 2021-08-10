<template>
  <div
    class="py-1 md:py-4 bg-gray-500 dark:bg-gray-800 shadow-md flex justify-between items-center px-4 fixed top-0 left-0 right-0 z-50"
  >
<!--    <div class="hidden toggle-bar relative border opacity-50 hover:opacity-80 h-6 w-14 rounded-2xl text-sm flex justify-between items-center px-1">-->
<!--      <i class="far fa-sun relative z-10"></i>-->
<!--      <i class="far fa-moon relative z-10"></i>-->
<!--    </div>-->
    <div
      class="relative"
      @mouseleave="handleInputDisplay(false)"
    >
      <i
        @mouseenter="handleInputDisplay(true)"
        class="fas fa-search text-lg ml-2 cursor-pointer relative z-10"
      ></i>
      <label
        for="searchInput"
        class="absolute top-0 left-0"
      >
        <input
          id="searchInput"
          ref="searchInput"
          type="search"
          name="search"
          autocomplete="off"
          class="rounded-md bg-gray-600 focus:outline-none py-0.5 input-transition"
          :class="showInput ? 'pl-8 pr-2 w-72' : 'w-0'"
          :value="searchValue"
          @focus="focusedInput = true"
          @input="searchChats($event)"
          @blur="handleInputDisplay(false)"
        >
      </label>
      <div
        v-if="focusedInput && searchedResults.length"
        class="absolute w-72 bg-gray-600 px-2 py-1 rounded-md left-0 top-full mt-0.5 shadow-xl"
      >
        <p
          v-for="(result, i) in searchedResults"
          :key="i"
          @click="createChat(result)"
          class="pb-1.5 pl-1 py-1.5 border-b border-white border-opacity-10 text-lg searched-result"
        >{{result}}</p>
      </div>
    </div>
    <span
      v-if="$route.meta.auth !== undefined"
      class="-ml-2 text-xl md:text-2xl text-white font-bold font-mono gradient-animation cursor-pointer"
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
    <teleport
      v-if="focusedInput"
      to="body">
      <div class="h-full w-full bg-black bg-opacity-30 absolute top-0 bottom-0 left-0 right-0"></div>
    </teleport>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const appear = ref(false)
    const showInput = ref(false)
    const searchValue = ref('')
    const searchInput = ref(null) // is template $ref
    const focusedInput = ref(false)
    const searchedResults = computed(() => store.getters['chats/searchedResultsList'])

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

    function searchValueHandler(e: Event) {
      if (!searchInput.value) {
        return
      }
      if (searchInput.value && !(searchInput.value! as HTMLElement).classList.contains('w-0')) {
        const target = e.target as HTMLInputElement
        searchValue.value = target.value
      }
    }

    function handleInputDisplay(value: boolean) {
      if (value) {
        showInput.value = value
        return
      }
      if (!value && !searchValue.value.length) {
        showInput.value = value
        searchValue.value = ''
        if (searchInput.value) {
          (searchInput.value! as HTMLElement).blur()
          focusedInput.value = false
        }
      }
    }

    async function searchChats(e: Event) {
      searchValueHandler(e)
      const value = (e.target as HTMLInputElement).value
      if (value) {
        await store.dispatch('chats/searchChats', value)
      }
    }

    async function createChat(person: {[key: string]: any}) {
      await store.dispatch('chats/createChat', person)
      return router.push(`/chats/${person.nickname}`)
    }

    function logout() {
      store.dispatch('auth/logoutAndGoToLoginPage')
    }

    return {
      logout,
      handleInputDisplay,
      searchChats,
      createChat,
      searchedResults,
      focusedInput,
      searchInput,
      searchValue,
      showInput,
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
