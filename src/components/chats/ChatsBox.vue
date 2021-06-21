<template>
  <div class="hidden md:flex flex-auto border border-opacity-30 border-gray-800 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-transparent overflow-hidden h-full">
    <div class="flex md:flex-col md:justify-between flex-auto h-full">
      <div class="border-b border-gray-700 px-4 py-3 bg-gray-800 flex justify-between">
        <span>Ivan Shyian</span>
        <span class="text-gray-500 text-sm">was online 1 hour ago</span>
      </div>
      <div
        id="message-container"
        class="h-full overflow-y-auto bg-gray-800 px-2 py-3 flex flex-col">
        <div
          class="p-2 text-white dark:text-black flex justify-end first:mt-auto"
          v-for="(m, i) in messages"
          :key="i"
        >
          <p class="bg-gray-700 dark:bg-gray-200 border py-1 px-4 rounded-lg">
            <span class="font-medium text-md mr-4">{{ m.content && m.content.message }}</span>
            <span class="font-light text-xs">{{ m.content && m.content.time }}</span>
          </p>
        </div>
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
          >Send</button>
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
import { computed, defineComponent, ref, Ref, watch } from 'vue'
import { useStore } from 'vuex'
import { NewMessageObjectInterface } from '@/modules/chats/ChatsInterfaces'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const store = useStore()
    const route = useRoute()
    const messages: Ref<NewMessageObjectInterface[]> = ref([])
    const messageText: Ref<string> = ref('')
    const selectedUserSocketID = computed(() => route.params && route.params.userID)

    watch(selectedUserSocketID, (
      newValue, oldValue) => store.commit('chats/setSelectedUserSocketID', newValue), {
      immediate: true
    })

    // const getMessages = computed(() => store.getters[''])
    const chats = computed(() => store.getters['socket/chatUsers'])

    const sendMessage = (): void => {
      if (!messageText.value.length) {
        return
      }

      // TODO Temporary. Need to parse time depends of local
      const newMessage: NewMessageObjectInterface = {
        content: {
          uid: selectedUserSocketID.value,
          time: new Date().getTime(),
          message: messageText.value
        },
        to: selectedUserSocketID.value
      }

      messages.value.push({ ...newMessage, fromSelf: true })
      store.dispatch('socket/sendMessageSocket', newMessage)
      messageText.value = ''
    }
    return {
      messages,
      messageText,
      sendMessage
    }
  }
})
</script>

<style scoped>

</style>
