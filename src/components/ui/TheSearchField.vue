<template>
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
        placeholder="Search by nickname..."
        class="rounded-md bg-gray-600 focus:outline-none py-0.5 input-transition"
        :class="showInput ? 'pl-8 pr-2 w-64 sm:w-40 md:w-64 xl:w-80' : 'w-0'"
        :value="searchValue"
        @input="searchChatsHandler('search', $event)"
        @focus="focusHandler"
        @blur="handleBlur"
      >
    </label>
  </div>
  <teleport
    v-if="focusedInput"
    to="body">
    <div class="h-full w-full bg-black bg-opacity-30 absolute top-0 bottom-0 left-0 right-0"></div>
  </teleport>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'

export default defineComponent({
  props: {},
  setup() {
    const store = useStore()
    const route = useRoute()
    const showInput = ref(false)
    const searchValue = ref('')
    const searchInput = ref(null) // is template $ref
    const focusedInput = ref(false)
    const searchedResults = computed(() => store.getters['search/searchedResultsList'])
    const myUserData = computed(() => store.getters['auth/userData'])

    watch(searchValue, (value, previousValue) => {
      if (value === '') {
        store.commit('search/setSearchedResults', {})
      }
    })

    function handleInputDisplay(value: boolean) {
      if (value) {
        showInput.value = value
        return
      }
      if (!value && !searchValue.value.length && isSearchedResultsEmpty.value) {
        showInput.value = value
      }
    }

    function focusHandler() {
      focusedInput.value = true
      if (!searchValue.value) {
        searchAll(myUserData.value)
      }
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

    function handleBlur() {
      (searchInput.value! as HTMLElement).blur()
      setTimeout(async() => {
        await store.dispatch('search/changeCurrentSearchedResults', {data: route.params.userID})
        focusedInput.value = false
        showInput.value = false
        searchValue.value = ''
      }, 500)
    }

    function searchChatsHandler(type = 'search', e?: Event) {
      switch (type) {
        case 'search':
          return e && searchChats(e, myUserData.value)
        default:
          return searchAll(myUserData.value)
      }
    }

    async function searchChats(e: Event, me: {[key: string]: any | null}) {
      searchValueHandler(e)
      const value = (e.target as HTMLInputElement).value
      if (value && typeof me === 'object') {
        await store.dispatch('search/searchChats', {value, type: 'search', me})
      }
      if (!value.length) {
        store.commit('search/setChatSearchStatus', false)
      }
    }

    async function searchAll(me: {[key: string]: any} | null) {
      if (typeof me === 'object') {
        await store.dispatch('search/searchChats', {value: '', type: 'all', me})
      }
    }

    const isSearchedResultsEmpty = computed(() => (
      typeof searchedResults.value === 'object' && !Object.keys(searchedResults.value).length
    ))

    return {
      handleInputDisplay,
      showInput,
      searchValue,
      searchInput,
      focusedInput,
      searchedResults,
      searchChatsHandler,
      focusHandler,
      handleBlur
    }
  }
})
</script>

<style scoped>

</style>
