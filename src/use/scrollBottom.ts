import {ComputedRef, ref, nextTick, watch} from 'vue'
import {useRoute} from 'vue-router'

interface ReturnStatementInterface {
  immediatelyScrollToBottom: () => Promise<void>
}

export function useScrollBottom(chatIsAvailable: ComputedRef<boolean>, showChat: ComputedRef<boolean>): ReturnStatementInterface {
  const route = useRoute()

  const scrollBottom = (): void => {
    const messageContainer = document.querySelector('#message-container') as HTMLHtmlElement
    if (messageContainer) {
      const messageContainerHeight = messageContainer.getBoundingClientRect().height
      messageContainer.scrollTo({top: messageContainerHeight})
    }
  }

  const immediatelyScrollToBottom = async() => {
    await nextTick(() => scrollBottom())
  }

  /* Scrolling bottom after every chat changing */
  watch(() => route.path, async(currentRoute, previousRoute) => {
    if (previousRoute && currentRoute !== previousRoute && chatIsAvailable.value && showChat.value) {
      await immediatelyScrollToBottom()
    }
  }, {immediate: true})

  /* Scrolling bottom after entering to chat-box from Chats.vue && current chat is available */
  watch(showChat, async(value, previousValue) => {
    if (value) {
      await immediatelyScrollToBottom()
    }
  }, {immediate: true})

  return {
    immediatelyScrollToBottom
  }
}
