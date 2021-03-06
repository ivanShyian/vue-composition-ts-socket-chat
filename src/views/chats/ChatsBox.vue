<template>
  <chat-box-wrapper>
    <template #main>
      <chat-box-main
        :chat="currentChat"
        :self="self"
        :show-chat="showChat"
        @chat:scroll="immediatelyScrollToBottom"
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
    const userChatByNickname = computed(() => store.getters['chats/currentChat'](route.params.userID) || {})
    const userSearchByNickname = computed(() => store.getters['search/userByNickname'](route.params.userID) || {})
    const currentChat = computed(() => {
      if (Object.keys(userChatByNickname.value).length) {
        return userChatByNickname.value
      }
      if (Object.keys(userSearchByNickname.value).length) {
        return userSearchByNickname.value
      }
      return {}
    })

    const chatIsAvailable = computed(() => currentChat.value && !!Object.keys(currentChat.value).length)
    const showChat = computed(() => {
      return 'unfam' in currentChat.value || !!(('messages' in currentChat.value) && Array.isArray(currentChat.value.messages))
    })

    const {immediatelyScrollToBottom} = useScrollBottom(chatIsAvailable, showChat)
    useChats('messages', currentChat)

    return {
      self,
      currentChat,
      chatIsAvailable,
      getHoursAndMinutes,
      immediatelyScrollToBottom,
      showChat
    }
  }
})
</script>

<style scoped>

</style>
