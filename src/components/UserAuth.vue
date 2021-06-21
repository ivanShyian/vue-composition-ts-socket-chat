<script lang="ts">
import { onMounted, defineComponent, h, ComputedRef, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { UserInterface } from '@/modules/chats/ChatsModule'

export default defineComponent({
  setup() {
    const store = useStore()
    const user: ComputedRef<UserInterface | null> = computed(() => store.getters['auth/userData'])

    onMounted(async(): Promise<void> => {
      const sessionID = localStorage.getItem('sessionID') ?? ''
      await getUserData()
      await connectToChat(sessionID)
    })

    const getUserData = async(): Promise<void> => {
      const auth = store.getters['auth/isAuth']

      if (auth && user.value?.nickname) {
        return
      }
      await store.dispatch('auth/getUserData')
    }

    const connectToChat = async(sessionID: string | null): Promise<void> => {
      await store.dispatch('socket/authToSocket', {
        nickname: user.value?.nickname,
        sessionID
      })
      await store.dispatch('socket/setAndSubscribeSocket')
    }

    onUnmounted(() => {
      store.commit('socket/destroySocketConnection')
    })

    return () => h('div', null)
  }
})
</script>
