import {ComputedRef, ref, nextTick, watch} from 'vue'
import {useRoute} from 'vue-router'

export function useScrollBottom(chatIsAvailable: ComputedRef<boolean>): void {
  const route = useRoute()

  const scrollBottom = (): void => {
    const messageContainer = document.querySelector('#message-container') as HTMLHtmlElement
    if (messageContainer) {
      const messageContainerHeight = messageContainer.getBoundingClientRect().height
      messageContainer.scrollTo({top: messageContainerHeight})
    }
  }

  /* Scrolling bottom after every chat changing */
  watch(() => route.path, async(currentRoute, previousRoute) => {
    if (previousRoute && currentRoute !== previousRoute) {}
    if (previousRoute && currentRoute !== previousRoute && chatIsAvailable.value) {
      await nextTick(() => scrollBottom())
    }
  }, {immediate: true})

  /* Scrolling bottom after entering to chat-box from Chats.vue && current chat is available */
  watch(chatIsAvailable, async(value, previousValue) => {
    if (value) {
      await nextTick(() => scrollBottom())
    }
  }, {immediate: true})
}
