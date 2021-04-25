<template>
  <div class="chats container mx-auto md:pl-10 pt-14 md:pt-20 flex justify-between h-screen">
    <div
      id="card-container"
      class="chats-card overflow-y-auto direction pr-2 md:pr-4 md:mr-4 pb-20 md:pb-2"
    >
      <chats-card
        v-for="(card, i) in 5"
        :key="i"
      ></chats-card>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

import ChatsCard from '@/components/chats/ChatsCard.vue'

export default defineComponent({
  setup() {
    const store = useStore()
    store.dispatch('socket/setAndSubscribeSocket')
    return {
    }
  },
  components: {
    ChatsCard
  }
})
</script>
<style lang="scss">
</style>
