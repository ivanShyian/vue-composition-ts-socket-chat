<template>
  <div class="chats pt-14 md:pt-20 flex justify-between h-screen">
    <div
      id="card-container"
      class="chats-card overflow-y-auto direction pb-20 md:pb-2"
    >
      <chats-card
        v-for="(card, i) in 5"
        :key="i"
        :card="card"
      ></chats-card>
    </div>
    <div class="container mx-auto border-l border-white border-opacity-20 h-full pb-2">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue'
import { useStore } from 'vuex'

import ChatsCard from '@/components/chats/ChatsCard.vue'
import { UserInterface } from '@/modules/chats/ChatsModule'

export default defineComponent({
  setup() {
    const store = useStore()
    const URL = 'http://localhost:3000'
    const user: Ref<UserInterface | Record<string, never>> = ref({})
    // const userChats = computed(() => store.getters['auth/userInfo'])

    onMounted((): void => {
      // user.value = computed(() => store.getters['auth/userInfo'])
      connectToChat()
    })

    const connectToChat = async(): Promise<void> => {
      const auth = store.getters['auth/isAuth']

      if (auth && user.value?.nickname) {
        await store.dispatch('socket/authToSocket', 'vanjkes') // user.value.nickname
        await store.dispatch('socket/setAndSubscribeSocket', URL)
      }
    }
    return {}
  },
  components: {
    ChatsCard
  }
})
</script>
<style lang="scss">
</style>
