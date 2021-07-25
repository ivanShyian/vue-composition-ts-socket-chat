<template>
  <div class="w-12 mr-3 flex items-center justify-center avatar-block flex-shrink-0 flex-grow-0">
    <p
      class="border border-opacity-30
      border-gray-800 dark:border-gray-500
      rounded-full w-full h-full flex
      items-center justify-center"
      :class="getUserNameAvatarColor"
    >
      <span
        :class="getUserNameAvatarNameColor"
        class="text-2xl"
      >{{getCurrentAvatarName}}</span>
<!--      <span class="text-2xl">{{getUserNameAvatarNameColor}}</span>-->
    </p>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue'
import {getColorByWord} from '@/utils/colorAlphabet'

export default defineComponent({
  props: {
    userName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const getCurrentAvatarName = computed(() => {
      const {userName} = props
      if (userName) {
        const name = userName.split(' ')
        return name.length > 1 ? `${name[0][0]}${name[1][0]}`.toUpperCase() : userName[0].toUpperCase()
      }
      return ''
    })

    const getUserNameAvatarColor = computed(() => {
      const {userName} = props
      if (userName) {
        return `bg-${getColorByWord(userName)}`
      }
      return 'bg-gray-600'
    })

    const getUserNameAvatarNameColor = computed(() => {
      const value = getUserNameAvatarColor.value.split('-')[2][0]
      return Number(value) > 4 ? '' : 'text-black'
    })

    return {
      getCurrentAvatarName,
      getUserNameAvatarColor,
      getUserNameAvatarNameColor
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
