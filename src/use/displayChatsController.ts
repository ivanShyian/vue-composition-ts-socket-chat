import {computed, ComputedRef, onMounted, onUnmounted, ref} from 'vue'
import {useRoute} from 'vue-router'

export function useDisplayChatsController(): {
widthMdAndAbove: ComputedRef<boolean>
widthLessThenMd: ComputedRef<boolean>
requiredToShowCards: ComputedRef<boolean>
requiredToShowChat: ComputedRef<boolean>
} {
  const route = useRoute()
  const clientWidth = ref(window.innerWidth)

  const widthMdAndAbove = computed(() => clientWidth.value >= 768)
  const widthLessThenMd = computed(() => clientWidth.value < 768)
  const requiredToShowCards = computed(() => widthMdAndAbove.value || (widthLessThenMd.value && !route.params.userID))
  const requiredToShowChat = computed(() => widthMdAndAbove.value || (widthLessThenMd.value && !!route.params.userID))

  const setInnerWidth = () => {
    clientWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', setInnerWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', setInnerWidth)
  })

  return {
    widthMdAndAbove,
    widthLessThenMd,
    requiredToShowCards,
    requiredToShowChat
  }
}
