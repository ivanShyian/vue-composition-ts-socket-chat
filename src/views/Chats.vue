<template>
  <div class="chats pt-14 md:pt-20 flex justify-between h-screen">
    <div
      id="card-container"
      class="chats-card overflow-y-auto direction pb-20 md:pb-2 w-1/5"
    >
      <div v-if="chats.length">
        <chats-card
          v-for="(chat, i) in chats"
          :key="i"
          :card="chat"
          @click.prevent="choiceChat(chat)"
        ></chats-card>
      </div>
      <div v-else
           class="text-center text-lg font-bold mt-6 overflow-hidden">
        <span>You haven't chats yet...</span>
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
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import ChatsCard from '@/components/chats/ChatsCard.vue'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const chats = computed(() => store.getters['socket/chatUsers'])

    const choiceChat = (chat: any) => {
      if (route.params.userID) {
        return router.replace('/chats/')
      }

      Object.keys(chat).map(e => {
        router.push(`/chats/${chat[e].userID}`)
      })
    }
    return {
      chats,
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
