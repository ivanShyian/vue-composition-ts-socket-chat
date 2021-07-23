<script lang="ts">
import {
  h,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ComputedRef
} from 'vue'
import {useStore} from 'vuex'
import {UserInterface} from '@/modules/chats/ChatsModule'

export default defineComponent({
  setup() {
    const store = useStore()
    const user: ComputedRef<UserInterface | null> = computed(() => store.getters['auth/userData'])

    onMounted(async(): Promise<void> => {
      await fetchUserDataAndConnectToSocket()
    })

    const fetchUserDataAndConnectToSocket = async() => {
      const sessionID = localStorage.getItem('socketSessionID')
      // Load current user
      const data = await getUserData()
      // Load current user messages list
      await connectToChat({...data, sessionID, hasSocketData: !!sessionID})
    }

    const getUserData = async(): Promise<UserInterface | undefined> => {
      const auth = store.getters['auth/isAuth']
      // If user has been logged on (It happens after registration and first visit of site)
      if (auth && user.value?.nickname) {
        return store.getters['auth/userData']
      }
      // Else fetch user
      return await store.dispatch('auth/getUserData')
    }

    const connectToChat = async(data: any): Promise<void> => {
      if (data.hasSocketData) {
        await store.dispatch('socket/authToSocket', {
          nickname: user.value?.nickname,
          sessionID: data.sessionID,
          id: data.id
        })
      } else {
        await store.dispatch('socket/authToSocket', {
          nickname: user.value?.nickname,
          id: data.id
        })
      }
      await store.dispatch('socket/setAndSubscribeSocket')
    }

    onUnmounted(() => {
      store.commit('socket/destroySocketConnection')
    })

    return () => h('div', null)
  }
})
</script>
