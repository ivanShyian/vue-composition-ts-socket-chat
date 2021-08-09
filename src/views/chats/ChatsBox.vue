<template>
  <chat-box-wrapper>
    <template #main>
      <chat-box-main
        :chat="currentChat"
        :self="self"
        :show-chat="showChat"
      />
    </template>
    <template #sidebar>
      <chat-box-sidebar
        v-show="false"
      />
    </template>
  </chat-box-wrapper>
</template>

<script lang="ts">
import {
  computed,
  defineComponent
} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
import {getHoursAndMinutes} from '@/utils/getCorrectTime'
import {useScrollBottom} from '@/use/scrollBottom'
import {useChats} from '@/use/chats'
import ChatBoxWrapper from '@/components/chats/ChatBox/ChatBoxWrapper.vue'
import ChatBoxMain from '@/components/chats/ChatBox/ChatBoxMain.vue'
import ChatBoxSidebar from '@/components/chats/ChatBox/ChatBoxSidebar.vue'

export default defineComponent({
  components: {
    ChatBoxSidebar,
    ChatBoxMain,
    ChatBoxWrapper
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const self = computed(() => store.getters['chats/myUserData'])
    const currentChat = computed(() => store.getters['chats/currentChat'](route.params.userID))
    const chatIsAvailable = computed(() => currentChat.value && !!Object.keys(currentChat.value).length)

    useScrollBottom(chatIsAvailable)
    useChats('messages', currentChat)

    const showChat = computed(() => {
      return !!(('messages' in currentChat.value) && Array.isArray(currentChat.value.messages))
    })

    return {
      self,
      currentChat,
      chatIsAvailable,
      getHoursAndMinutes,
      showChat
    }
  }
})
</script>

<style scoped>

</style>
