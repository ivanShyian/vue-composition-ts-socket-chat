<template>
  <div class="shadow-sm border-b border-opacity-30 py-2 pl-3 w-auto flex flex-none mb-1.5 mx-4 border-gray-800 dark:border-gray-500 bg-gray-100 dark:bg-transparent cursor-pointer dark:hover:bg-blue-50 dark:hover:bg-opacity-10 transition-all duration-300">
    <div class="w-1/4 p-1 mr-3 md:w-1/6">
      <img class="border border-opacity-30 border-gray-800 dark:border-gray-500 rounded-full" src="@/assets/logo.png">
    </div>
    <div class="w-3/4 flex flex-col">
      <div class="mb-1 flex justify-between">
        <span>{{ userName }}</span>
        <span>00:25</span>
      </div>
      <p>Message some message..</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  props: {
    card: {
      type: Object,
      required: false
    }
  },
  setup(props) {
    return {
      userName: computed(() => {
        const card = props.card!
        if (card.userSelf) return 'Me'
        return card.username || Object.keys(card).map(i => card[i].username)[0]
      })
    }
  }
})
</script>

<style scoped>

</style>
