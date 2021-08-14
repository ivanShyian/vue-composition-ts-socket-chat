import {Store, useStore} from 'vuex'
import {computed, ComputedRef, Ref, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {OneChatInterface} from '@/models/chats/ChatsInterfaces'
// import {UserInterface} from '@/models/chats/UserInterfaces'

type UserDataType = ComputedRef<null | {[key: string]: any}>
type BooleanRef = Ref<boolean>
type FetchingType = 'messages' | 'lastMessage'
// type WatchDataType = UserDataType | UserInterface | null

interface ChatsTypeReturning {
  chats: ComputedRef<OneChatInterface[]>
  loading: Ref<boolean>
  hasChats: Ref<boolean>
  fetched: Ref<boolean>
}

export function useChats(fetchingType: FetchingType, subscribedRef: UserDataType): ChatsTypeReturning {
  const store: Store<unknown> = useStore()
  const route = useRoute()
  const loading = ref(true)
  const fetched = ref(false)

  const chats = computed(() => store.getters['chats/allChats'])
  const hasChats = computed(() => !!Object.keys(chats.value).length)

  watch(subscribedRef, async(value, previousValue) => {
    if (value && typeof value === 'object' && Object.keys(value).length && previousValue !== value) {
      await fetchHelper(fetchingType, previousValue, value, fetched)
    }
  }, {immediate: true})

  watch(() => route.path, async(currentRoute, previousRoute) => {
    if (previousRoute && currentRoute !== previousRoute) {
      fetched.value = false
    }
  }, {immediate: true})

  function fetchHelper(
    type: FetchingType,
    previous: any,
    current: any,
    isFetched: BooleanRef
  ) {
    if (current && !isFetched.value) {
      switch (type) {
        case 'lastMessage':
          return fetchChatsList()
        case 'messages':
          // subscribedRef is userObject that was passed from chatBox
          return subscribedRef && fetchMessagesByChatId(subscribedRef)
      }
    }
  }

  async function fetchChatsList() {
    if (fetched.value) {
      return
    }
    await store.dispatch('chats/fetchChatList')
    fetched.value = true
    loadingSuccessful()
  }

  async function fetchMessagesByChatId(computedUser: any) {
    const user = computedUser.value

    if (fetched.value) {
      return
    }

    if ((user && 'messages' in user) && Array.isArray(user.messages)) {
      return
    }

    const chatId = store.getters['chats/chatIdByUserDatabaseId'](user.userDatabaseID)
    if (chatId) {
      await store.dispatch('chats/fetchMessagesByChat', {chatId, databaseID: user.userDatabaseID})
    }
    if (chatId === null) {
      const waitedChatId = await new Promise((resolve, reject) => {
        setTimeout(() => resolve(store.getters['chats/chatIdByUserDatabaseId'](user.userDatabaseID)), 1000)
      })
      await store.dispatch('chats/fetchMessagesByChat', {chatId: waitedChatId, databaseID: user.userDatabaseID})
    }
    fetched.value = true
    loadingSuccessful()
  }

  function loadingSuccessful() {
    loading.value = false
  }

  return {
    loading,
    chats,
    hasChats,
    fetched
  }
}
