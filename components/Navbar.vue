<template>
  <header>
    <b-navbar class="fixed-top shadow-sm" style="background-color: white">
      <b-navbar-brand class="mr-auto">
        コンソール
      </b-navbar-brand>
      <template>
        <div class="d-flex align-items-center">
          <span class="mr-2"> {{ $store.getters.userName }} </span>
          <fa :icon="faUserCircle" class="userIcon" :style="{color: $store.getters.userColor}" />
          <b-button size="sm" class="ml-2" variant="primary" @click="$bvModal.show('logout')">
            ログアウト
          </b-button>
          <b-modal id="logout" size="sm" hide-header hide-footer centered>
            <div class="text-center mt-4 mb-2">
              <h4>ログアウトしますか？</h4>
              <div class="mt-4">
                <b-button size="lg" class="mx-2" variant="primary" @click="logout()">
                  はい
                </b-button>
                <b-button size="lg" class="mx-2" variant="danger" @click="$bvModal.hide('logout')">
                  いいえ
                </b-button>
              </div>
            </div>
          </b-modal>
        </div>
      </template>
    </b-navbar>
  </header>
</template>

<script>
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { firestore } from '~/plugin/firebase'

export default {
  name: 'Navbar',
  data () {
    return {
      userName: 'テストユーザ',
      userColor: '#696969'
    }
  },
  computed: {
    faUserCircle () {
      return faUserCircle
    }
  },
  mounted () {
  },
  methods: {
    logout () {
      this.$store.dispatch('signOut')
        .then(() => {
          this.$store.dispatch('setUserName', 'テストユーザ')
          this.$store.dispatch('setUserColor', '#696969')
          this.$router.push({
            name: 'login'
          })
        })
        .catch((err) => {
          window.alert(err.message)
        })
    },
    async detectUser () {
      if (this.$store.getters.user) {
        const _this = this
        console.log(this.$store.getters.user._delegate.uid)
        await firestore
          .collection('adminUser')
          .doc(this.$store.getters.user._delegate.uid)
          .onSnapshot(function (doc) {
            if (doc.exists) {
              console.log(doc.data().uid)
              _this.$store.dispatch('setUserName', doc.data().name)
              _this.$store.dispatch('setUserColor', doc.data().color)
            }
          })
      }
    }
  }
}
</script>

<style scoped>
.userIcon {
  background-color: white;
  font-size: 42px;
  border-radius: 50px;
}

</style>
