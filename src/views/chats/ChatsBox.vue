<template>
  <div
    class="flex flex-auto border border-opacity-30 border-gray-800 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-transparent overflow-hidden h-full">
    <div class="flex flex-col md:justify-between flex-auto h-full">
      <div class="border-b border-gray-700 px-4 py-2 bg-gray-800 flex justify-between items-center">
        <i class="fas fa-grip-lines"></i>
        <span>{{ currentChat.username }}</span>
        <i class="fas fa-ellipsis-h text-xl cursor-auto opacity-20"></i>
      </div>
      <div
        id="message-container"
        class="h-full overflow-y-auto overflow-x-hidden bg-gray-800 px-2 py-3 flex flex-col">
        <template v-if="showChat">
          <template v-if="currentChat.messages">
            <div
              v-for="(m, i) in currentChat.messages"
              :key="i"
              class="p-2 py-1 text-white dark:text-black flex first:mt-auto"
              :class="self.userDatabaseID === m.databaseID ? 'justify-end' : 'justify-start'"
            >
              <p
                class="bg-gray-700 dark:bg-gray-200 border py-1 px-4 rounded-lg max-w-2/5 d-flex break-words relative"
              >
              <span
                v-if="self.userDatabaseID === m.databaseID"
                class="font-light text-xs absolute bottom-1.5 right-2"
              >{{ getHoursAndMinutes(+m.time) }}</span>
                <span
                  class="font-medium text-md mr-7"
                >{{ m.message }}</span>
                <span
                  v-if="self.userDatabaseID !== m.databaseID"
                  class="font-light text-xs"
                >{{ getHoursAndMinutes(+m.time) }}</span>
              </p>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="flex justify-center items-center h-full">
            <AppSpinner/>
          </div>
        </template>
      </div>
      <div class="border-t border-gray-700 px-2 py-3 bg-gray-800">
        <div class="flex">
          <input
            @keypress.enter="sendMessage"
            v-model="messageText"
            type="text"
            class="border-b border-l border-gray-500 h-8 w-full pl-5 pr-20 rounded-bl-md bg-transparent focus:shadow-lg  focus:outline-none focus:border-gray-400 focus:text-gray-200"
            placeholder="Start typing message..."
          >
          <button
            @click="sendMessage"
            class="h-8 w-20 text-white rounded-sm bg-gray-600 hover:bg-gray-700 focus:outline-none"
          >Send
          </button>
        </div>
      </div>
    </div>
    <div v-show="false" class="flex flex-col px-2 py-5 bg-gray-800 border-l border-gray-700">
      <div class="flex flex-col items-center border-b border-gray-400 border-opacity-10 pb-3 mb-3">
        <div class="rounded-full overflow-hidden border border-gray-700 w-1/2 h-auto mb-3">
          <img src="../../assets/logo.png" alt="">
        </div>
        <p class="text-lg">Name of user</p>
      </div>
      <div class="mx-auto pt-10 text-gray-700 font-medium">Coming soon...</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  Ref,
  nextTick,
  watch,
  onMounted, onUnmounted
} from 'vue'
import {useStore} from 'vuex'
import {NewMessageObjectInterface} from '@/modules/chats/ChatsInterfaces'
import {useRoute} from 'vue-router'
import {getHoursAndMinutes} from '@/utils/getCorrectTime'
import AppSpinner from '@/components/ui/AppSpinner.vue'

export default defineComponent({
  components: {AppSpinner},
  setup() {
    const store = useStore()
    const route = useRoute()

    const messageText: Ref<string> = ref('')
    const wasFetched: Ref<boolean> = ref(false)

    const self = computed(() => store.getters['chats/myUserData'])
    const currentChat = computed(() => store.getters['chats/currentChat'](route.params.userID))
    const chatIsAvailable = computed(() => currentChat.value && !!Object.keys(currentChat.value).length)

    const scrollBottom = (): void => {
      const messageContainer = document.querySelector('#message-container') as HTMLHtmlElement
      const messageContainerHeight = messageContainer.getBoundingClientRect().height
      messageContainer.scrollTo({top: messageContainerHeight})
    }

    const showChat = computed(() => {
      return !!(('messages' in currentChat.value) && Array.isArray(currentChat.value.messages))
    })

    /* Scrolling bottom after every chat changing and reset fetch status also here */
    watch(() => route.path, (currentRoute, previousRoute) => {
      if (previousRoute && currentRoute !== previousRoute) {
        wasFetched.value = false
      }
      if (previousRoute && currentRoute !== previousRoute && chatIsAvailable.value) {
        nextTick(() => scrollBottom())
      }
    }, {immediate: true})

    /* Scrolling bottom after entering to chat-box from Chats.vue && current chat is available */
    watch(chatIsAvailable, (value, previousValue) => {
      if (value) {
        nextTick(() => scrollBottom())
      }
    }, {immediate: true})

    /* Here we are fetching current chat messages */
    watch(currentChat, (user, previousValue) => {
      if (user) {
        fetchChat(user)
      }
    }, {immediate: true})

    async function fetchChat(user: any): Promise<void> {
      if (!user) {
        return
      }

      if (wasFetched.value) {
        return
      }

      if ('messages' in currentChat.value && Array.isArray(currentChat.value.messages)) {
        return
      }

      const chatId = store.getters['chats/chatIdByUserDatabaseId'](user.userDatabaseID)
      if (chatId) {
        await store.dispatch('chats/fetchMessagesByChat', {chatId, databaseID: user.userDatabaseID})
        wasFetched.value = true
      }
    }

    const sendMessage = (): void => {
      const userSelf = self.value

      if (!messageText.value.length) {
        return
      }
      if (!currentChat.value) {
        return
      }

      const newMessage: NewMessageObjectInterface = {
        content: {
          nickname: userSelf.username,
          databaseID: userSelf.userDatabaseID,
          time: new Date().getTime(),
          message: messageText.value
        },
        to: currentChat.value.userID,
        toDatabaseId: currentChat.value.userDatabaseID,
        fromSelf: true
      }
      store.dispatch('chats/sendMessageAndEmitSocket', newMessage)
      messageText.value = ''
    }
    return {
      self,
      messageText,
      sendMessage,
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
