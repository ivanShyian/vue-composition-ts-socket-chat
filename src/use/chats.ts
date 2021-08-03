import {Store, useStore} from 'vuex'
import {computed, ComputedRef, Ref, ref, watch} from 'vue'

type UserDataType = ComputedRef<null | {[key: string]: any}>
type WatchDataType = UserDataType | null
type BooleanRef = Ref<boolean>

export function useChats(fetchingType: string, indicator: UserDataType, fetchedChatId?: string): any {
  const store: Store<unknown> = useStore()
  const loading = ref(true)
  const fetched = ref(false)

  const chats = computed(() => store.getters['chats/allChats'])
  const hasChats = computed(() => Object.keys(chats.value).length)

  watch(indicator, async(value: WatchDataType, previousValue: WatchDataType) => {
    await fetchHelper(fetchingType, previousValue, value, fetched, fetchedChatId)
  })

  function fetchHelper(
    type: string,
    previous: WatchDataType,
    current: WatchDataType,
    isFetched: BooleanRef,
    fetchedChat?: string
  ) {
    if (!previous && current && !isFetched.value) {
      fetched.value = true

      switch (type) {
        case 'lastMessage':
          return fetchChatsList()
        case 'messages':
          return fetchedChat && fetchMessagesByChatId(fetchedChat)
      }
    }
  }

  const fetchChatsList = async() => {
    await store.dispatch('chats/fetchChatList')
    loadingSuccessful()
  }

  const fetchMessagesByChatId = async(chatId: string) => {
    await store.dispatch('chats/fetchMessagesByChat', chatId)
    loadingSuccessful()
  }

  const loadingSuccessful = () => {
    loading.value = false
  }

  return {
    loading,
    chats,
    hasChats
  }
}
