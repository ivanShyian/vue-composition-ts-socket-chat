<template>
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
</template>

<script lang="ts">
import {defineComponent, ref, Ref} from 'vue'
import {NewMessageObjectInterface} from '@/models/chats/ChatsInterfaces'
import {useStore} from 'vuex'
export default defineComponent({
  props: {
    chat: {
      type: Object,
      required: true
    },
    self: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()

    const messageText: Ref<string> = ref('')

    const sendMessage = ():void => {
      const {chat, self} = props

      if (!messageText.value.length) {
        return
      }
      if (!chat) {
        return
      }

      const newMessage: NewMessageObjectInterface = {
        content: {
          nickname: self.username,
          databaseID: self.userDatabaseID,
          time: new Date().getTime(),
          message: messageText.value
        },
        to: chat.userID,
        toDatabaseId: chat.userDatabaseID,
        fromSelf: true
      }
      store.dispatch('chats/sendMessageAndEmitSocket', newMessage)
      messageText.value = ''
    }
    return {
      messageText,
      sendMessage
    }
  }
})
</script>

<style scoped>

</style>
