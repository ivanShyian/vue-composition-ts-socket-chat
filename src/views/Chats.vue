<template>
  <div class="chats pt-14 md:pt-20 flex justify-between h-screen">
    <div
      id="card-container"
      class="chats-card border border-opacity-30
        border-gray-800 dark:border-gray-500 overflow-y-auto
        direction pb-20 md:pb-2 w-80 box-shadow rounded-lg ml-2 mb-2"
    >
      <div v-if="hasChats">
        <chats-card
          v-for="(chat, chatName, key) in chats"
          :key="key"
          :card="chat"
          :name="chatName"
          @click.prevent="choiceChat(chat)"
        ></chats-card>
      </div>
      <div v-else
           class="text-center text-lg font-light tracking-wider mt-6 overflow-hidden">
        <span>Loading...</span>
      </div>
    </div>
    <div class="container mx-auto w-5/6 border-white border-opacity-20 h-full pb-2">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed
} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import ChatsCard from '@/components/chats/ChatsCard.vue'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const chats = computed(() => store.getters['chats/allChats'])
    const hasChats = computed(() => Object.keys(chats.value).length)

    const choiceChat = (chat: any): void => {
      const currentChatNickname = route.params.userID
      const pickedUsername = chat.username

      if (currentChatNickname) {
        if (currentChatNickname === pickedUsername) {
          router.push('/chats/')
          return
        }
        router.push(`/chats/${pickedUsername}`)
        return
      }
      router.push(`/chats/${pickedUsername}`)
    }
    return {
      chats,
      hasChats,
      choiceChat
    }
  },
  components: {
    ChatsCard
  }
})
</script>
<style lang="scss">
</style>
