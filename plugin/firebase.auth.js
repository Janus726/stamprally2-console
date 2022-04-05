import { auth, firestore } from '~/plugin/firebase.js'

export default (context) => {
  const { store } = context
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      store.commit('setUser', user)
      if (store.getters.user) {
        console.log(user._delegate.uid)
        await firestore
          .collection('adminUser')
          .doc((user._delegate.uid).toString())
          .onSnapshot(function (doc) {
            if (doc.exists) {
              console.log(doc.data().uid)
              store.dispatch('setUserName', doc.data().name)
              store.dispatch('setUserColor', doc.data().color)
            }
          })
      }
      resolve()
    })
  })
}
