<template>
  <div
      class="shadow-sm border-b border-opacity-30 py-2.5 pl-3 w-auto flex flex-none ml-2 mr-1
      border-gray-800 dark:border-gray-500 bg-gray-100 dark:bg-transparent cursor-pointer
      dark:hover:bg-blue-50 dark:hover:bg-opacity-10 transition-all duration-300">
    <div class="w-1/4 mr-3 md:w-1/6 flex items-center">
      <img
        class="border border-opacity-30 border-gray-800 dark:border-gray-500 rounded-full w-full flex justify-center items-center"
        src="@/assets/logo.png"/>
    </div>
    <div class="w-3/4 flex flex-col">
      <div class="mb-1 flex justify-between">
        <span>{{ userName}}</span>
        <span class="text-sm">{{ lastMessageTime }}</span>
      </div>
      <p class="whitespace-nowrap overflow-hidden overflow-ellipsis text-sm text-blue-200 text-opacity-20"
         v-if="lastMessageContent === ''"
      >There is no messages yet</p>
      <p class="whitespace-nowrap overflow-hidden overflow-ellipsis text-sm"
         v-else
      >{{ lastMessageContent }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import {getHoursAndMinutes} from '@/utils/getCorrectTime'

export default defineComponent({
  props: {
    card: {
      type: Object,
      required: false
    },
    name: {
      type: String
    }
  },
  setup(props) {
    const userName = computed(() => {
      if (!(props.card && props.name)) return
      const {card, name} = props
      if (card.userSelf || name === 'userSelf') {
        return 'Me'
      }
      return card.username || Object.keys(card).map(i => card[i].username)[0]
    })

    const avatar = computed(() => {
      return props.card?.username ? props.card?.username.substring(0, 2) : 'x'
    })

    const lastMessage = computed(() => {
      const {card} = props
      return card?.lastMessage
    })

    const lastMessageContent = computed(() => lastMessage.value?.message)

    const lastMessageTime = computed(() => lastMessage.value?.time ? getHoursAndMinutes(lastMessage.value.time) : '')

    return {
      userName,
      avatar,
      lastMessageTime,
      lastMessageContent
    }
  }
})
</script>

<style scoped>

</style>
