<template>
  <p v-show="showAdditionalSearchText"
    class="border-b border-gray-500 bg-black bg-opacity-10
    text-center text-xs font-bold text-blue-100 text-opacity-30 uppercase py-1"
  >{{text}}</p>
  <chats-cards-item
    v-for="chat in chats"
    :key="chat.userDatabaseID"
    :card="chat"
    :my-user="userData"
    @click.prevent="emit('choice', {...chat, list})"
  />
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import ChatsCardsItem from '@/components/chats/ChatsLeft/ChatsCardsItem.vue'
import {useStore} from 'vuex'

export default defineComponent({
  components: {ChatsCardsItem},
  props: {
    chats: {
      type: Object,
      required: true
    },
    list: {
      type: String,
      required: true
    },
    showText: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['choice'],
  setup(props, {emit}) {
    const store = useStore()
    const userData = computed(() => store.getters['auth/userData'])
    const searching = computed(() => store.getters['search/inProcessOfSearch'])

    const text = computed(() => props?.list === 'chats' ? 'Your chats' : 'Global chats')
    const showAdditionalSearchText = computed(
      () => searching.value && props?.chats && Object.keys(props.chats).length && props?.showText
    )
    return {
      userData,
      searching,
      text,
      showAdditionalSearchText,
      emit
    }
  }
})
</script>
