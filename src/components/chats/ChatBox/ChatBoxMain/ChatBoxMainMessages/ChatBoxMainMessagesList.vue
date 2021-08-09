<template>
  <div
    class="p-2 py-1 text-white dark:text-black flex first:mt-auto"
    :class="self.userDatabaseID === message.databaseID ? 'justify-end' : 'justify-start'"
  >
    <chat-box-main-messages-item
      :message="message"
      :self="self"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import ChatBoxMainMessagesItem from './ChatBoxMainMessagesItem.vue'
export default defineComponent({
  components: {ChatBoxMainMessagesItem},
  props: {
    message: {
      type: Object,
      required: true,
      default: Object
    },
    self: {
      type: Object,
      required: true,
      default: Object
    }
  }
})
</script>

<style scoped>

</style>
