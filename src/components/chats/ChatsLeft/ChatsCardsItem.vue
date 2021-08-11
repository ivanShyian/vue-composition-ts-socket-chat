<template>
  <div
      class="shadow-sm border-b border-opacity-30 py-2.5 pl-3 w-auto flex flex-none
      border-gray-800 dark:border-gray-500 bg-gray-100 dark:bg-transparent cursor-pointer
      dark:hover:bg-blue-50 dark:hover:bg-opacity-10 transition-all duration-300 pr-3 md:pr-0"
  >
    <ChatsCardAvatar
      :user-name="avatarName"
    />
    <div class="w-full md:w-3/4 flex flex-col">
      <div class="mb-1 flex">
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
      required: true
    },
    myUser: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const cardItem = computed(() => props.card)
    const myUser = computed(() => props.myUser)
    const nicknameCard = computed(() => cardItem.value?.nickname)
    const myNickname = computed(() => myUser.value?.nickname)

    const userName = computed(() => {
      if (!nicknameCard.value) return 'Loading...'
      if (nicknameCard.value === myNickname.value) return 'Me'
      return (nicknameCard.value || Object.keys(cardItem.value).map(i => cardItem.value[i].nickname)[0])
    })

    const avatarName = computed(() => {
      return nicknameCard.value || ''
    })

    const lastMessage = computed(() => {
      return cardItem.value.lastMessage
    })

    const lastMessageContent = computed(() => lastMessage.value?.message || '')
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
