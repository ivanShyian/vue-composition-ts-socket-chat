<script lang="ts">
import { onMounted, defineComponent, h, ComputedRef, computed } from 'vue'
import { useStore } from 'vuex'
import { UserInterface } from '@/modules/chats/ChatsModule'
import Firebase from '@/utils/Firebase'

export default defineComponent({
  setup() {
    const firebase = new Firebase()
    firebase.observable()

    const store = useStore()
    const user: ComputedRef<UserInterface | null> = computed(() => store.getters['auth/userData'])

    onMounted(async(): Promise<void> => {
      await getUserData()
      await connectToChat()
    })

    const getUserData = async(): Promise<void> => {
      const auth = store.getters['auth/isAuth']

      if (auth && user.value?.nickname) {
        return
      }
      await store.dispatch('auth/getUserData')
    }

    const connectToChat = async(): Promise<void> => {
      await store.dispatch('socket/authToSocket', user.value?.nickname)
      await store.dispatch('socket/setAndSubscribeSocket')
    }

    return () => h('div', null)
  }
})
</script>
