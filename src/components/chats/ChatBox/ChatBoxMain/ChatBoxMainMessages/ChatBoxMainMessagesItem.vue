<template>
  <p
    class="bg-gray-700 dark:bg-gray-200 border py-1 px-3 rounded-lg max-w-1/2 d-flex -mx-2 break-words relative"
  >
    <span
      v-if="self.userDatabaseID === message.databaseID"
      class="font-light text-xs absolute bottom-1.5 right-2"
    >{{ getHoursAndMinutes(+message.time) }}</span>
    <span
      class="font-medium text-md mr-7"
    >{{ message.message }}</span>
    <span
      v-if="self.userDatabaseID !== message.databaseID"
      class="font-light text-xs absolute bottom-1.5 right-2"
    >{{ getHoursAndMinutes(+message.time) }}</span>
  </p>
</template>

<script lang="ts">
import {getHoursAndMinutes} from '@/utils/getCorrectTime'
import {defineComponent} from 'vue'

export default defineComponent({
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
  },
  setup() {
    return {
      getHoursAndMinutes
    }
  }
})
</script>

<style scoped>

</style>
