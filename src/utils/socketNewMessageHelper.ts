import store from '@/store/index'

export function newMessageHelper({ user, socketID, content, from, selectedChatId }: {
  user: any
  socketID: string | (() => void)
  content: any
  from: string
  selectedChatId: string | string[]
}): void {
  Object.keys(user).map(async u => {
    if (socketID === from) {
      await store.dispatch('chats/addNewMessage', {
        content, fromSelf: true
      }, { root: true })
      return
    }
    if (user[u].userID === from) {
      await store.dispatch('chats/addNewMessage', {
        content, fromSelf: false
      }, { root: true })
    }
    if (user[u].userID !== selectedChatId) {
      await store.dispatch('chats/setStatusThatUserHasNewMessage', true)
    }
  })
}
