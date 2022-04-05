import { auth } from '~/plugin/firebase.js'

export const strict = false

export const state = () => ({
  user: null,
  users: {},
  userName: 'テストユーザ',
  userColor: '#696969',
  stamps: {}
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setUsers (state, users) {
    state.users = {
      ...state.users,
      users
    }
  },
  setUserName (state, name) {
    state.userName = name
  },
  setUserColor (state, color) {
    state.userColor = color
  },
  setStamps (state, stamp) {
    state.stamps = {
      ...state.stamps,
      stamp
    }
  }
}

export const actions = {
  signInWithEmail ({ commit }, { email, password }) {
    return auth.signInWithEmailAndPassword(email, password)
  },
  signOut () {
    return auth.signOut()
  },
  setUsers ({ commit }, users) {
    commit('setUsers', users)
  },
  setUserName ({ commit }, name) {
    commit('setUserName', name)
  },
  setUserColor ({ commit }, color) {
    commit('setUserColor', color)
  },
  setStamps ({ commit }, stamp) {
    commit('setStamps', stamp)
  }
}

export const getters = {
  user (state) {
    return state.user
  },
  isAuthenticated (state) {
    return !!state.user
  },
  userName (state) {
    return state.userName
  },
  userColor (state) {
    return state.userColor
  },
  stamps (state) {
    return state.stamps.stamp
  }
}
