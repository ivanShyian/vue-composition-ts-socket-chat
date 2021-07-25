<template>
  <div
      class="shadow-sm border-b border-opacity-30 py-2.5 pl-3 w-auto flex flex-none
      border-gray-800 dark:border-gray-500 bg-gray-100 dark:bg-transparent cursor-pointer
      dark:hover:bg-blue-50 dark:hover:bg-opacity-10 transition-all duration-300"
  >
    <ChatsCardAvatar
      :user-name="avatarName"
    />
    <div class="w-3/4 flex flex-col">
      <div class="mb-1 flex justify-between">
        <span class="w-1/2">{{ userName }}</span>
        <span class="text-sm w-1/2 text-right">{{ lastMessageTime }}</span>
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
import ChatsCardAvatar from '@/components/chats/ChatsCardAvatar.vue'

export default defineComponent({
  components: {ChatsCardAvatar},
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

    const avatarName = computed(() => {
      return props.card?.username ? props.card.username : ''
    })

    const lastMessage = computed(() => {
      const {card} = props
      return card?.lastMessage
    })

    const lastMessageContent = computed(() => lastMessage.value?.message)

    const lastMessageTime = computed(() => lastMessage.value?.time ? getHoursAndMinutes(lastMessage.value.time) : '')

    return {
      userName,
      avatarName,
      lastMessageTime,
      lastMessageContent
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
