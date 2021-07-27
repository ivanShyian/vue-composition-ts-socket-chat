<template>
  <div class="chats pt-14 md:pt-20 flex justify-between h-screen">
    <div
      id="card-container"
      class="chats-card border border-opacity-30
        border-gray-800 dark:border-gray-500 overflow-y-auto
        direction pb-20 md:pb-2 md:w-72 xl:w-80 w-full box-shadow rounded-lg ml-0 md:ml-2 mb-2 flex-shrink-0"
    >
      <template v-if="hasChats">
        <chats-card
          v-for="(chat, chatName, key) in chats"
          :key="key"
          :card="chat"
          :name="chatName"
          @click.prevent="choiceChat(chat)"
        />
      </template>
      <template v-else>
        <app-pseudo-card
          v-for="p in 2"
          :key="p"
        />
      </template>
    </div>
    <div class="container mx-auto w-full md:w-5/6 border-white border-opacity-20 h-full pb-2">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed, onUnmounted
} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import ChatsCard from '@/components/chats/ChatsCard.vue'
import AppPseudoCard from '@/components/ui/AppPseudoCard.vue'

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
    onUnmounted(() => {
      localStorage.setItem('ho', 'hey')
    })
    return {
      chats,
      hasChats,
      choiceChat
    }
  },
  components: {
    AppPseudoCard,
    ChatsCard
  }
})
</script>
<style lang="scss">
</style>
