<template>
  <div class="chats container md:pl-10 pt-14 md:pt-20 flex justify-between w-full">
    <div
      id="card-container"
      class="chats-card h-screen overflow-y-auto direction pr-4 mr-4">
      <chats-card
        v-for="(card, i) in 10"
        :key="i"></chats-card>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import io from 'socket.io-client'

import ChatsCard from '@/components/chats/ChatsCard.vue'

export default defineComponent({
  setup() {
    const socket = io('http://localhost:3000')

    socket.on('connect', () => {
      console.log('Connected')
    })

    socket.on('receive', (text) => {
      console.log(text)
    })
  },
  components: {
    ChatsCard
  }
})
</script>
<style lang="scss">
</style>
