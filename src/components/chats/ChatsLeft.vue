<template>
  <div
    id="card-container"
    class="chats-card border border-opacity-30 bg-gray-700
        border-gray-800 dark:border-gray-500 overflow-y-auto relative z-30
        direction pb-20 md:pb-2 md:w-72 xl:w-80 box-shadow rounded-lg
        md:ml-2 md:mr-0 mb-2 flex-shrink-0 w-full"
  >
    <template v-if="!loading">
      <chats-cards
        list="chats"
        :chats="chats"
        :showText="!!Object.keys(searchedResults).length"
        @choice="choiceChat"
      />
      <chats-cards
        list="searched"
        :chats="searchedResults"
        @choice="choiceChat"
      />
    </template>
    <template v-else>
      <app-pseudo-card
        v-for="p in 2"
        :key="p"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import ChatsCards from '@/components/chats/ChatsLeft/ChatsCards.vue'
import AppPseudoCard from '@/components/ui/AppPseudoCard.vue'
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'

export default defineComponent({
  components: {ChatsCards, AppPseudoCard},
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    chats: {
      type: Object,
      required: true
    }
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const searchedResults = computed(() => store.getters['search/searchedResultsList'])

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
      choiceChat,
      searchedResults
    }
  }
})
</script>

<style scoped>

</style>
