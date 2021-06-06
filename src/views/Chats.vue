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
        ></chats-card>
      </div>
      <div v-else
           class="text-center text-lg font-bold mt-6 overflow-hidden">
        <span>You haven't chats yet...</span>
      </div>
    </div>
    <div class="container mx-auto w-5/6 border-white border-opacity-20 h-full pb-2">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ComputedRef
} from 'vue'
import { useStore } from 'vuex'

import ChatsCard from '@/components/chats/ChatsCard.vue'
import { UserInterface } from '@/modules/chats/ChatsModule'

export default defineComponent({
  setup() {
    const store = useStore()
    const chats = computed(() => store.getters['socket/chatUsers'])
    return {
      chats
    }
  },
  components: {
    ChatsCard
  }
})
</script>
<style lang="scss">
</style>
