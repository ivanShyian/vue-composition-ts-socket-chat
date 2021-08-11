<template>
  <div class="chats pt-12 md:pt-20 mx-2 md:mx-0 flex justify-between h-screen">
    <chats-left
      v-show="requiredToShowCards"
      :loading="loading"
      :chats="chats"
    />
    <chats-right
      v-show="requiredToShowChat"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed
} from 'vue'
import {useChats} from '@/use/chats'
import {useDisplayChatsController} from '@/use/displayChatsController'
import ChatsLeft from '@/components/chats/ChatsLeft.vue'
import ChatsRight from '@/components/chats/ChatsRight.vue'
import {useStore} from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const userData = computed(() => store.getters['chats/myUserData'])

    return {
      ...useChats('lastMessage', userData),
      ...useDisplayChatsController()
    }
  },
  components: {
    ChatsRight,
    ChatsLeft
  }
})
</script>
<style lang="scss">
</style>
