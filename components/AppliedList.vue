<template>
  <b-container class="shadow-sm py-4" style="border-radius: 3px">
    <b-row>
      <b-col class="my-3">
        <h3 v-if="userslist === []">
          現在、表示できるものがありません。
        </h3>
        <b-table if="loaded" hover :items="userslist" :fields="fields" style="max-height: 600px" />
      </b-col>
    </b-row>
    <b-row class="my-4">
      <b-col class="text-center">
        <b-button variant="primary" @click="downloadCSV(userslist)">
          CSVダウンロード
        </b-button>
        <b-button variant="primary" @click="downloadCSV2(usersList2)">
          アンケートデータダウンロード
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { firestore } from '~/plugin/firebase'

export default {
  name: 'AppliedList',
  data () {
    return {
      loaded: false,
      users: [],
      userslist: [],
      usersList2: [],
      fields: [
        {
          key: 'name',
          label: '氏名'
        },
        {
          key: 'zip',
          label: '郵便番号',
          sortable: true
        },
        {
          key: 'address',
          label: '住所'
        },
        {
          key: 'phone',
          label: '電話番号'
        },
        {
          key: 'prize',
          label: '景品',
          sortable: true
        },
        {
          key: 'date',
          label: '申込日時',
          sortable: true
        }
      ],
      csvData: ''
    }
  },
  watch: {
    appliedUsers (newData) {
      console.log(newData)
    }
  },
  async created () {
    const _this = this
    // await firestore
    //   .collection('users')
    //   .onSnapshot(function (querySnapshot) {
    //     querySnapshot.forEach(function (doc) {
    //       if (doc.data().age) {
    //         _this.$set(_this.users, doc.id, doc.data())
    //       }
    //       // console.log(_this.users)
    //     })
    //   })
    await firestore
      .collection('appliedUsers')
      .orderBy('applyDate')
      .onSnapshot(function (querySnapshot) {
        _this.userslist = []
        _this.usersList2 = []
        querySnapshot.forEach(function (doc) {
          _this.users.push(doc.id)
          _this.userslist.push({
            name: doc.data().name,
            zip: doc.data().zipcode,
            address: doc.data().address,
            phone: doc.data().phone,
            prize: doc.data().prize,
            date: _this.timeConverter(doc.data().applyDate.seconds * 1000)
          })
          _this.usersList2.push({
            age: doc.data().age,
            comment1: doc.data().comment[0].replace(/\r?\n/g, ''),
            comment2: doc.data().comment[1].replace(/\r?\n/g, ''),
            comment3: doc.data().comment[2].replace(/\r?\n/g, ''),
            comment4: doc.data().comment[3].replace(/\r?\n/g, ''),
            comment5: doc.data().comment[4].replace(/\r?\n/g, ''),
            companion: doc.data().companion,
            course: doc.data().course,
            events: _this.counter(doc.data().events),
            impression: doc.data().impression,
            sex: doc.data().sex
          })
          // _this.stampCheck()
        })
        // console.log(_this.users)
      })
  },
  methods: {
    timeConverter (time) {
      const Time = new Date(time)
      const year = Time.getFullYear()
      const month = 1 + Time.getMonth()
      const day = Time.getDate()
      const hour = Time.getHours()
      const minute = Time.getMinutes()
      let format = 'YYYY/MM/DD hh:mm'
      format = format.replace(/YYYY/g, year)
      format = format.replace(/MM/g, month)
      format = format.replace(/DD/g, day)
      format = format.replace(/hh/g, hour)
      format = format.replace(/mm/g, minute)
      return format
    },
    counter (events) {
      let event = ''
      for (let i = 0; i < events.length; i++) {
        event += events[i] + '， '
      }
      // console.log(event)
      return event
    },
    downloadCSV (users) {
      const filename = '景品応募者リスト.csv'
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
      for (let i = 0; i < users.length; i++) {
        this.csvData += users[i].name + ',' + users[i].zip + ',' + users[i].address +
          ',' + users[i].phone + ',' + users[i].prize.toString() +
          ',' + users[i].date + '\n'
      }
      const blob = new Blob([bom, this.csvData], { type: 'text/csv' })
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        const url = (window.URL || window.webkitURL).createObjectURL(blob)
        const download = document.createElement('a')
        download.href = url
        download.download = filename
        download.click();
        (window.URL || window.webkitURL).revokeObjectURL(url)
      }
      this.csvData = ''
    },
    downloadCSV2 (users) {
      const filename = 'アンケート回答.csv'
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
      this.csvData = '年齢, 性別, コメント（佐賀）, コメント（小城）, コメント（神埼）, コメント（多久）, コメント（吉野ヶ里）, 誰と, コース, 印象に残った場所, あったら参加したいイベント\n'
      for (let i = 0; i < users.length; i++) {
        this.csvData += users[i].age + ',' + users[i].sex + ',' + users[i].comment1 + ',' + users[i].comment2 + ',' + users[i].comment3 +
          ',' + users[i].comment4 + ',' + users[i].comment5 + ',' + users[i].companion + ',' + users[i].course +
          ',' + users[i].impression + ',' + users[i].events + '\n'
      }
      const blob = new Blob([bom, this.csvData], { type: 'text/csv' })
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        const url = (window.URL || window.webkitURL).createObjectURL(blob)
        const download = document.createElement('a')
        download.href = url
        download.download = filename
        download.click();
        (window.URL || window.webkitURL).revokeObjectURL(url)
      }
      this.csvData = ''
    },
    async stampCheck () {
      const _this = this
      const ownedStamps = {}
      for (let i = 0; i < this.users.length; i++) {
        await firestore
          .collection('users')
          .doc(_this.users[i])
          .onSnapshot(function (doc) {
            _this.$set(ownedStamps, doc.id, doc.data().ownedStamps)
          })
      }
      setTimeout(() => {
        const stamps = {}
        const data = Object.entries(ownedStamps)
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i][1].length; j++) {
            if (stamps[data[i][1][j]]) {
              stamps[data[i][1][j]]++
            } else {
              this.$set(stamps, data[i][1][j], 1)
            }
          }
        }
        console.log(stamps)
      }, 5000)
    }
  }
}
</script>

<style scoped>

</style>
