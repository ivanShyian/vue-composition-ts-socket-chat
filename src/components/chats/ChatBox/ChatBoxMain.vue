<template>
  <div class="flex flex-col md:justify-between flex-auto h-full">
    <chat-box-main-header
      :user-name="chat.nickname"
      :show-name="!!Object.keys(chat).length"
    />
    <chat-box-main-messages
      :show="showChat"
      :chat="chat"
      :self="self"
    />
    <chat-box-main-input
      :chat="chat"
      :self="self"
      @scroll="emit('chat:scroll')"
    />
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import ChatBoxMainHeader from './ChatBoxMain/ChatBoxMainHeader.vue'
import ChatBoxMainMessages from './ChatBoxMain/ChatBoxMainMessages.vue'
import ChatBoxMainInput from './ChatBoxMain/ChatBoxMainInput.vue'
export default defineComponent({
  components: {
    ChatBoxMainInput,
    ChatBoxMainMessages,
    ChatBoxMainHeader
  },
  props: {
    chat: {
      type: Object,
      required: true,
      default: Object
    },
    self: {
      type: Object,
      required: true,
      default: Object
    },
    showChat: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['chat:scroll'],
  setup(_, {emit}) {
    return {
      emit
    }
  }
})
</script>
