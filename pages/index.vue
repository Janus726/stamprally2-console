<template>
  <div id="app" class="scroll-lock">
    <Navbar />
    <body class="mx-1" style="padding-top: 60px">
      <b-container fluid style="margin-top: 15px">
        <b-tabs pills content-class="mt-3">
          <b-tab title="統計" style="height: 88vh; overflow: auto" active>
            <Statistics v-if="loaded" style="margin-bottom: 50px"/>
          </b-tab>
          <b-tab title="応募者リスト" style="height: 88vh; overflow: auto">
            <AppliedList v-if="loaded" style="margin-bottom: 50px" />
          </b-tab>
          <b-tab title="スタンプ設定" style="height: 88vh; overflow: auto">
            <Stamps v-if="loaded" style="margin-bottom: 50px"></Stamps>
          </b-tab>
          <b-tab title="イベント情報" style="height: 88vh; overflow: auto">
            <Events v-if="loaded" style="margin-bottom: 50px"></Events>
          </b-tab>
          <b-tab title="ログ" style="height: 88vh; overflow: auto">
            <LocationLog v-if="loaded" style="margin-bottom: 50px" />
          </b-tab>
        </b-tabs>
      </b-container>
    </body>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'
import Statistics from '~/components/Statistics'
import AppliedList from '@/components/AppliedList'
import Stamps from '@/components/Stamps'
import Events from '@/components/Events'
import LocationLog from '@/components/LocationLog'
// import { firestore } from '@/plugin/firebase'
// import { firestore } from '~/plugin/firebase'

export default {
  components: { Navbar, Statistics, AppliedList, Stamps, Events, LocationLog },
  data () {
    return {
      users: {},
      loaded: false,
      stamps: {}
    }
  },
  created () {
    // console.log(this.$store.state.user)
    // const _this = this
    // await firestore
    //   .collection('users')
    //   .orderBy('joinDate')
    //   .onSnapshot(function (querySnapshot) {
    //     querySnapshot.forEach(function (doc) {
    //       _this.$set(_this.users, doc.id, doc.data())
    //       const createdAt = _this.timeConverter(
    //         doc.data().joinDate.seconds * 1000
    //       )
    //       const createdAt2 = _this.timeConverter(
    //         doc.data().login.seconds * 1000
    //       )
    //       _this.$set(_this.users[doc.id], 'joinedAt', createdAt)
    //       _this.$set(_this.users[doc.id], 'logined', createdAt2)
    //     })
    //   })
    // await this.$store.dispatch('setUsers', this.users)
    setTimeout(this.loadComplete, 1000)
    // console.log(this.$store.state.users)
  },
  methods: {
    timeConverter (time) {
      return new Date(time)
    },
    loadComplete () {
      this.loaded = true
    }
  },
  watch: {
    users (newVal) {
      this.$store.dispatch('setUsers', newVal)
      console.log('update')
    }
  }
}
</script>
<style>
.scroll-lock {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
