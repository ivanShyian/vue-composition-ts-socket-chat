<template>
  <div class="chats pt-12 md:pt-20 mx-2 md:mx-0 flex justify-between h-screen">
    <div
      v-show="requiredToShowCards"
      id="card-container"
      class="chats-card border border-opacity-30
        border-gray-800 dark:border-gray-500 overflow-y-auto
        direction pb-20 md:pb-2 md:w-72 xl:w-80 w-full box-shadow rounded-lg md:ml-2 md:mr-0 mb-2 flex-shrink-0"
    >
      <template v-if="!loading">
        <chats-card
          v-for="(chat, key) in chats"
          :key="key"
          :card="chat"
          :my-user="userData"
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
    <div
      v-show="requiredToShowChat"
      class="mx-0 md:mx-2 w-full md:w-5/6 border-white border-opacity-20 h-full pb-2"
    >
      <router-view/>
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
import AppPseudoCard from '@/components/ui/AppPseudoCard.vue'
import {useChats} from '@/use/chats'
import {useDisplayChatsController} from '@/use/displayChatsController'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const userData = computed(() => store.getters['auth/userData'])
    const {loading, chats, hasChats} = useChats('lastMessage', userData)

    const choiceChat = (chat: any): void => {
      const currentChatNickname = route.params.userID
      const pickedUsername = chat.nickname

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
      userData,
      loading,
      choiceChat,
      ...useDisplayChatsController()
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
