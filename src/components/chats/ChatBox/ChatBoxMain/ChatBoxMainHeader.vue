<template>
  <div class="border-b border-gray-700 px-4 py-2 bg-gray-800 flex justify-between items-center">
    <i
      @click="$router.push('/chats')"
      class="fas fa-grip-lines p-2 cursor-pointer md:hidden"
    ></i>
    <span class="hidden md:block"></span>
    <span
      v-show="showName"
    >{{ name }}</span>
    <i class="fas fa-ellipsis-h text-xl cursor-auto opacity-20"></i>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
export default defineComponent({
  props: {
    userName: {
      type: String,
      required: true,
      default: String
    },
    showName: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    return {
      name: computed(() => props.userName ? props.userName : null)
    }
  }
})
</script>

<style scoped>

</style>
