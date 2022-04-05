<template>
  <b-container class="shadow-sm py-1" style="border-radius: 3px">
    <b-tabs content-class="mt-3">
      <b-tab title="位置履歴" active>
        <b-row class="d-flex mb-4">
          <b-col class="col-12 my-3">
            <h5>位置情報が記録された場所を表示します（動作が重くなる場合があります）．</h5>
            <GmapMap
              ref="gMap"
              map-type-id="roadmap"
              :center="initialLocation"
              :zoom="zoom"
              :style="styleMap"
              :options="mapOptions"
              style="overflow: hidden; border-radius: 13px; z-index: 1"
            >
              <gmap-custom-marker
                v-for="stamp in stamps"
                :key="stamp.id"
                :marker="{lat: stamp.location._lat, lng: stamp.location._long}"
                :offset-y="20"
                @click.native="toggleInfoSt(stamp)"
              >
                <div v-if="stampView" class="iconCircle" style="background-color: tomato">
                  <fa :icon="faStamp" class="iconSize-s" style="color: #fff" />
                </div>
              </gmap-custom-marker>
              <gmap-cluster
                :grid-size="50"
                :zoom-on-click="true"
              >
                <GmapMarker
                  v-for="location in dateCheck"
                  :key="location.index"
                  :position="{lat: location.lat, lng: location.lng}"
                />
              </gmap-cluster>
              <GmapInfoWindow
                :position="infoWindowPos"
                :options="{pixelOffset: {width: 0, height: -45}}"
                :opened="infoWinOpen"
                @closeclick="infoWinOpen=false"
              >
                <h5>{{ displayName }}</h5>
              </GmapInfoWindow>
              <div slot="visible" class="d-flex mt-2 py-3 px-2 shadow-sm" style="position:absolute; z-index: 100; background-color: #fff; right: 10px; border-radius: 5px">
                <label for="form1" class="my-auto">スタンプ位置の表示： </label>
                <b-form-checkbox
                  id="form1"
                  v-model="stampView"
                  class="my-auto"
                  size="lg"
                  switch
                />
              </div>
              <div slot="visible" class="mt-2" style="position: absolute; right: 10px; top: 60px">
                <b-form-select id="selectDate" v-model="selectedOption" class="shadow-sm my-2" style="width: 200px; background-color: white; border: none; border-radius: 5px">
                  <b-form-select-option value="null">
                    フィルタリングなし
                  </b-form-select-option>
                  <b-form-select-option value="0">
                    すべて
                  </b-form-select-option>
                  <b-form-select-option value="1">
                    日付ごと
                  </b-form-select-option>
                </b-form-select>
              </div>
              <div v-if="selectedOption==='1'" slot="visible" class="mt2" style="position: absolute; right: 10px; top: 125px">
                <b-form-datepicker
                  id="datepicker"
                  v-model="selectedDate"
                  :min="new Date('2021/11/1')"
                  :max="new Date('2022/1/31')"
                  :date-format-options="{ year: 'numeric', month: 'numeric', day: '2-digit', weekday: 'short' }"
                  locale="ja"
                  calendar-width="100%"
                  class="shadow-sm"
                  style="width: 250px; border: none; border-radius: 5px; z-index: 100"
                />
              </div>
            </GmapMap>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="移動履歴">
        <b-row class="d-flex mb-4">
          <b-col class="col-12 my-3">
            <h5>ユーザごとの移動履歴を表示します．</h5>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import { faStamp } from '@fortawesome/free-solid-svg-icons'
import { firestore } from '~/plugin/firebase'

export default {
  name: 'LocationLog',
  components: { 'gmap-custom-marker': GmapCustomMarker, GmapCluster },
  data () {
    return {
      loaded: false,
      locationLog: {},
      locations: [],
      stamps: {},
      users: {},
      dateList: [],
      stampView: false,
      selectedOption: null,
      selectedDate: null,
      initialLocation: { lng: 130.27, lat: 33.3 },
      styleMap: {
        width: '100%',
        height: '600px'
      },
      zoom: 9,
      mapOptions: {
        disableDefaultUi: true,
        mapTypeControl: true,
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        clickableIcons: false,
        styles: []
      },
      infoWindowPos: { lat: 0, lng: 0 },
      infoWinOpen: false,
      displayName: ''
    }
  },
  computed: {
    faStamp () {
      return faStamp
    },
    dateCheck () {
      return (this.locations).filter((location) => {
        if (this.selectedOption === '1' && this.selectedDate != null) {
          return location.date === this.selectedDate
        } else {
          return location
        }
      })
    }
  },
  async created () {
    const _this = this
    // console.log(this.stamps)
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
      .collection('locationLog')
      // .limit(200)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().location.length > 3) {
            _this.$set(_this.locationLog, doc.id, doc.data())
            // console.log(_this.locationLog)
          }
        })
        const locationlog = Object.entries(_this.locationLog)
        console.log(locationlog.length)
        for (let i = 0; i < locationlog.length; i++) {
          for (let j = 1; j < locationlog[i][1].location.length; j++) {
            const date = _this.timeConverter(locationlog[i][1].date[j].seconds * 1000)
            _this.locations.push({ lat: locationlog[i][1].location[j].lat, lng: locationlog[i][1].location[j].lng, date })
            if (!(_this.dateList.includes(date))) {
              _this.dateList.push(date)
            }
          }
        }
        _this.dateList.sort()
        console.log(_this.locations[5])
        _this.stamps = _this.$store.getters.stamps
        // _this.accessCheck()
      })
    this.loaded = true
  },
  methods: {
    toggleInfoSt (stamp) {
      this.infoWindowPos = { lat: stamp.location._lat, lng: stamp.location._long }
      this.displayName = stamp.name
      this.infoWinOpen = true
    },
    timeConverter (time) {
      const Time = new Date(time)
      const year = Time.getFullYear()
      const month = ('0' + (1 + Time.getMonth())).slice(-2)
      const day = ('0' + Time.getDate()).slice(-2)
      let format = 'YYYY-MM-DD'
      format = format.replace(/YYYY/g, year)
      format = format.replace(/MM/g, month)
      format = format.replace(/DD/g, day)
      return format
    },
    accessCheck () {
      const dateLabels = {}
      const day = new Date(2021, 9, 31)
      const start = new Date(2021, 10, 1)
      const today = new Date(2022, 0, 32)
      const diff = Math.floor((today - start) / 86400000)
      console.log(start, today, diff)
      for (let i = 0; i < diff; i++) {
        day.setDate(day.getDate() + 1)
        this.$set(dateLabels, day.getFullYear() + '-' + ('0' + (1 + day.getMonth())).slice(-2) + '-' + ('0' + day.getDate()).slice(-2), [0, 0, 0, 0, 0, 0])
      }
      for (let i = 0; i < Object.entries(this.locationLog).length; i++) {
        for (let j = 1; j < Object.entries(this.locationLog)[i][1].location.length; j++) {
          const date = this.timeConverter(Object.entries(this.locationLog)[i][1].date[j].seconds * 1000)
          console.log(Object.entries(this.locationLog)[i][1].clientId)
          if (this.users[Object.entries(this.locationLog)[i][1].clientId] && dateLabels[date]) {
            if (this.users[Object.entries(this.locationLog)[i][1].clientId].age === '10代') {
              dateLabels[date][0]++
            } else if (this.users[Object.entries(this.locationLog)[i][1].clientId].age === '20代') {
              dateLabels[date][1]++
            } else if (this.users[Object.entries(this.locationLog)[i][1].clientId].age === '30代') {
              dateLabels[date][2]++
            } else if (this.users[Object.entries(this.locationLog)[i][1].clientId].age === '40代') {
              dateLabels[date][3]++
            } else if (this.users[Object.entries(this.locationLog)[i][1].clientId].age === '50代') {
              dateLabels[date][4]++
            } else if (this.users[Object.entries(this.locationLog)[i][1].clientId].age === '60代以上') {
              dateLabels[date][5]++
            }
          }
        }
      }
      console.log(dateLabels)
    }
  }
}
</script>

<style scoped>
.iconCircle {
  width: 31px;
  height: 31px;
  border-radius: 50px;
  border-color: white;
  text-align: center;
  line-height: 36px;
}
.iconSize-s {
  font-size: 17px;
}
</style>
