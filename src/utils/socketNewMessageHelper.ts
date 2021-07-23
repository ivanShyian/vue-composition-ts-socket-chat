import store from '@/store/index'

export function newMessageHelper({user, socketId, content, from, selectedChatNickname}: {
  user: any
  socketId: string | (() => void)
  content: any
  from: string
  selectedChatNickname: string | string[]
}): void {
  Object.keys(user).map(async u => {
    if (socketId === from) {
      await store.dispatch('chats/addNewMessage', {
        content, fromSelf: true
      }, {root: true})
      return
    }
    if (user[u].userID === from) {
      await store.dispatch('chats/addNewMessage', {
        content, fromSelf: false
      }, {root: true})
    }
    if (user[u].nickname !== selectedChatNickname) {
      await store.dispatch('chats/setStatusThatUserHasNewMessage', true)
    }
  })
}
