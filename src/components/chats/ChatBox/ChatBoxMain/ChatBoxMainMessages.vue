<template>
  <div
    id="message-container"
    class="h-full overflow-y-auto overflow-x-hidden bg-gray-800 px-2 py-3 flex flex-col">
    <template v-if="show">
      <template v-if="chat.messages">
        <chat-box-main-messages-list
          v-for="(message, idx) in chat.messages"
          :key="idx"
          :message="message"
          :self="self"
        />
      </template>
    </template>
    <template v-else>
      <div class="flex justify-center items-center h-full">
        <AppSpinner/>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import ChatBoxMainMessagesList
  from '@/components/chats/ChatBox/ChatBoxMain/ChatBoxMainMessages/ChatBoxMainMessagesList.vue'
export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    chat: {
      type: Object,
      required: true
    },
    self: {
      type: Object,
      required: true
    }
  },
  components: {
    ChatBoxMainMessagesList,
    AppSpinner
  }
})
</script>

<style scoped>

</style>
