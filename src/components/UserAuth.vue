<script lang="ts">
import {
  h,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ComputedRef, VNode
} from 'vue'
import {useStore} from 'vuex'
import {UserInterface} from '@/models/chats/UserInterfaces'

export default defineComponent({
  setup(_, context) {
    const store = useStore()
    const user: ComputedRef<UserInterface | null> = computed(() => store.getters['auth/userData'])

    onMounted(async(): Promise<void> => {
      await fetchUserDataAndConnectToSocket()
    })

    const fetchUserDataAndConnectToSocket = async() => {
      const sessionID = localStorage.getItem('socketSessionID')
      const data = await getUserData()
      await connectToChat({...data, sessionID, hasSocketData: !!sessionID})
    }

    const getUserData = async(): Promise<UserInterface | undefined> => {
      const auth = store.getters['auth/isAuth']
      // If user has been logged on (It happens after registration and first visit of site)
      if (auth && user.value?.nickname) {
        return store.getters['auth/userData']
      }
      // Else fetch user
      await store.dispatch('auth/fetchUserData')
      return store.getters['auth/userData']
    }

    const connectToChat = async(data: any): Promise<void> => {
      if (data.hasSocketData) {
        await store.dispatch('socket/authToSocket', {
          nickname: data.nickname,
          sessionID: data.sessionID,
          id: data.id
        })
      } else {
        await store.dispatch('socket/authToSocket', {
          nickname: data.nickname,
          id: data.id
        })
      }
      await store.dispatch('socket/setAndSubscribeSocket')
    }

    onUnmounted(() => {
      store.commit('socket/destroySocketConnection')
    })

    return (): VNode => h('div', context.slots.default ? context.slots.default() : '')
  }
})
</script>
