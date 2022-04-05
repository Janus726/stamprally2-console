<template>
  <b-container style="margin-bottom: 60px">
    <b-row>
      <!--      <b-col class="d-flex">-->
      <!--        <b-button id="tooltip" class="ml-auto" variant="danger" >-->
      <!--          <fa :icon="faSyncAlt" style="font-size: 25px" />-->
      <!--        </b-button>-->
      <!--        <b-tooltip target="tooltip" triggers="hover">-->
      <!--          データの更新-->
      <!--        </b-tooltip>-->
      <!--      </b-col>-->
    </b-row>
    <b-row class="d-flex align-items-end">
      <b-col class="col-md-8 col-xs-12 my-3" align-self="stretch">
        <div class="d-flex">
          <b-card class="shadow-sm col-md-4 col-xs-12 mr-3" style="border: none">
            <div class="d-flex align-items-end">
              <div>
                <h4 class="mr-auto">
                  ユーザー総数
                </h4>
                <h4 style="font-size: 45px">
                  {{ Object.entries(users).length }}
                </h4>
              </div>
            </div>
          </b-card>
          <b-card class="shadow-sm ml-3 col-xs-12 ml-auto" style="border: none">
            <div class="d-flex align-items-end">
              <div>
                <h4 class="mr-auto">
                  アクティブユーザー（過去24時間）
                </h4>
                <h4 v-if="loaded" style="font-size: 45px">
                  {{ activeUserNum }}
                </h4>
              </div>
            </div>
          </b-card>
        </div>
        <b-card class="shadow-sm col-xs-12 mt-4" style="border: none">
          <div>
            <h4 class="mr-4">
              市町別
            </h4>
            <bar-chart v-if="loaded" :chart-data="regionData" :options="barOptions" class="pr-2" style="height: 237px" />
          </div>
        </b-card>
      </b-col>
      <b-col class="col-md-4 my-3 col-xs-12" align-self="stretch">
        <div>
          <b-card class="shadow-sm" style="border: none">
            <div>
              <h4 class="mr-4">
                年代別
              </h4>
              <doughnut-chart v-if="loaded" :chart-data="ageData" :options="doughnutOptions" />
            </div>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <b-row class="d-flex align-items-end">
      <b-col class="col-md-12 col-xs-12 my-3" align-self="stretch">
        <div class="d-flex">
          <b-card class="shadow-sm col-md-12 col-xs-12" style="border: none">
            <div>
              <div class="d-flex align-items-center">
                <h4 class="mr-3">
                  日付別新規ユーザー
                </h4>
                <b-button-group size="sm">
                  <b-button v-if="selectedMonth === 11" variant="primary">
                    11月
                  </b-button>
                  <b-button v-else variant="outline-primary" @click="handler(4, 11)">
                    11月
                  </b-button>
                  <b-button v-if="selectedMonth === 12" variant="primary">
                    12月
                  </b-button>
                  <b-button v-else variant="outline-primary" @click="handler(4, 12)">
                    12月
                  </b-button>
                  <b-button v-if="selectedMonth === 1" variant="primary">
                    1月
                  </b-button>
                  <b-button v-else variant="outline-primary" @click="handler(4, 1)">
                    1月
                  </b-button>
                </b-button-group>
                <!--                <b-button variant="outline-primary" style="border: none" @click="handler(4)">-->
                <!--                  <fa :icon="faSyncAlt" style="font-size: 18px"></fa>-->
                <!--                </b-button>-->
              </div>
              <line-chart v-if="loaded && lineLoaded" :chart-data="dateData" :options="lineOptions" />
            </div>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <b-row class="d-flex align-items-end">
      <b-col class="col-md-12 col-xs-12 my-3" align-self="stretch">
        <div class="d-flex">
          <b-card class="shadow-sm col-md-12 col-xs-12" style="border: none">
            <div>
              <h4>スタンプ別情報</h4>
              <b-row class="d-flex align-items-center">
                <b-col
                  v-for="stamp in stamps"
                  :key="stamp.id"
                  class="col-md-2 col-sm-3 my-1"
                  style="font-size: 12px"
                >
                  <b-button class="shadow-sm p-auto" style="border: none; color: white" :style="{backgroundColor: stamp.color}">
                    {{ stamp.name }}
                  </b-button>
                </b-col>
              </b-row>
            </div>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { firestore } from '@/plugin/firebase'

export default {
  name: 'Statistics',
  data () {
    return {
      loaded: false,
      lineLoaded: false,
      users: {},
      selectedMonth: 11,
      activeUserNum: 0,
      regionDataValues: [],
      ageDataValues: [],
      dateDataValues: [],
      stamps: {},
      doughnutOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        },
        responsive: true
      },
      barOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        },
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            stacked: true,
            categoryPercentage: 1.0,
            barPercentage: 0.3,
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: false
            }
          }]
        }
      },
      lineOptions: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MM/D'
              }
            }
          }],
          yAxes: [{
            ticks: {
              min: 0
            }
          }]
        }
      },
      chartColors: [
        '#036e38',
        '#3f82bb',
        '#8ab72c',
        '#e7930f',
        '#c73728',
        '#696969'
      ],
      ageColors: [
        '#036e38',
        '#8ab72c',
        '#e7930f',
        '#c73728',
        '#7000cc',
        '#3f82bb'
      ],
      dateLabels: [],
      regionLabels: ['佐賀市', '小城市', '神埼市', '吉野ヶ里町', '多久市', 'その他'],
      ageLabels: ['10代', '20代', '30代', '40代', '50代', '60代以上']
    }
  },
  computed: {
    faSyncAlt () {
      return faSyncAlt
    },
    regionData () {
      return {
        datasets: [
          {
            label: this.regionLabels[0],
            data: [this.regionDataValues[0]],
            backgroundColor: this.chartColors[0],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.regionLabels[1],
            data: [this.regionDataValues[1]],
            backgroundColor: this.chartColors[1],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.regionLabels[2],
            data: [this.regionDataValues[2]],
            backgroundColor: this.chartColors[2],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.regionLabels[3],
            data: [this.regionDataValues[3]],
            backgroundColor: this.chartColors[3],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.regionLabels[4],
            data: [this.regionDataValues[4]],
            backgroundColor: this.chartColors[4],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.regionLabels[5],
            data: [this.regionDataValues[5]],
            backgroundColor: this.chartColors[5],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          }
        ],
        labels: []
      }
    },
    ageData () {
      return {
        datasets: [
          {
            data: this.ageDataValues,
            backgroundColor: this.ageColors,
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          }
        ],
        labels: this.ageLabels
      }
    },
    dateData () {
      return {
        datasets: [
          {
            data: this.dateDataValues,
            borderColor: '#00bfe5',
            fill: false,
            label: '人数'
          }
        ],
        labels: this.dateLabels
      }
    }
  },
  async created () {
    const _this = this
    await firestore
      .collection('users')
      .orderBy('joinDate')
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.users, doc.id, doc.data())
          const createdAt = _this.timeConverter(
            doc.data().joinDate.seconds * 1000
          )
          let createdAt2
          if (doc.data().login) {
            createdAt2 = _this.timeConverter(
              doc.data().login.seconds * 1000
            )
            _this.$set(_this.users[doc.id], 'logined', createdAt2)
          }
          _this.$set(_this.users[doc.id], 'joinedAt', createdAt)
        })
        _this.activeUserCount()
        _this.regionDataSetting()
        _this.ageDataSetting()
        _this.dateDataSetting(11)
      })
    await firestore
      .collection('stamps')
      .where('display', '==', 1)
      .orderBy('color')
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.stamps, doc.id, doc.data())
        })
        _this.staticPeople()
      })
    console.log(this.stamps)
    this.loaded = true
    this.lineLoaded = true
  },
  mounted () {
    // this.$store.watch((state, getters) => getters.stamps.stamp,
    //   (newValue) => {
    //     this.stamps = newValue
    //   })
  },
  methods: {
    handler (n, month) {
      if (n === 4) {
        this.lineLoaded = false
      } else { this.loaded = false }
      if (n === 1) {
        this.activeUserCount()
      } else if (n === 2) {
        this.regionDataSetting()
      } else if (n === 3) {
        this.ageDataSetting()
      } else if (n === 4) {
        this.selectedMonth = month
        this.dateDataSetting(month)
      }
      this.$nextTick(() => {
        if (n === 4) {
          this.lineLoaded = true
        } else { this.loaded = true }
      })
    },
    timeConverter (time) {
      return new Date(time)
    },
    activeUserCount () {
      this.activeUserNum = 0
      const users = Object.entries(this.users)
      for (let i = 0; i < users.length; i++) {
        const from = new Date(users[i][1].logined)
        const diff = new Date().getTime() - from.getTime()
        if (diff / (60 * 60 * 1000) <= 24) {
          this.activeUserNum++
        }
      }
    },
    staticPeople () {
      const users = Object.entries(this.users)
      const stamps = Object.entries(this.stamps)
      console.log(stamps.length)
      const gotStamps = {}
      const gotCourse = {}
      for (let i = 0; i < stamps.length; i++) {
        this.$set(gotStamps, stamps[i][1].id, [0, 0, 0, 0, 0, 0])
        this.$set(gotStamps[stamps[i][1].id], 'name', stamps[i][1].name)
        this.$set(gotStamps[stamps[i][1].id], 'region', stamps[i][1].area)
        this.$set(gotCourse, stamps[i][1].course, [0, 0, 0, 0, 0, 0])
      }
      console.log(gotCourse)
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users[i][1].ownedStamps.length; j++) {
          if (users[i][1].age === '10代') {
            gotStamps[users[i][1].ownedStamps[j]][0]++
          } else if (users[i][1].age === '20代') {
            gotStamps[users[i][1].ownedStamps[j]][1]++
          } else if (users[i][1].age === '30代') {
            gotStamps[users[i][1].ownedStamps[j]][2]++
          } else if (users[i][1].age === '40代') {
            gotStamps[users[i][1].ownedStamps[j]][3]++
          } else if (users[i][1].age === '50代') {
            gotStamps[users[i][1].ownedStamps[j]][4]++
          } else if (users[i][1].age === '60代以上') {
            gotStamps[users[i][1].ownedStamps[j]][5]++
          }
        }
        for (let j = 0; j < users[i][1].ownedStamps.length; j++) {
          if (users[i][1].age === '10代') {
            gotCourse[this.stamps[users[i][1].ownedStamps[j]].course][0]++
          } else if (users[i][1].age === '20代') {
            gotCourse[this.stamps[users[i][1].ownedStamps[j]].course][1]++
          } else if (users[i][1].age === '30代') {
            gotCourse[this.stamps[users[i][1].ownedStamps[j]].course][2]++
          } else if (users[i][1].age === '40代') {
            gotCourse[this.stamps[users[i][1].ownedStamps[j]].course][3]++
          } else if (users[i][1].age === '50代') {
            gotCourse[this.stamps[users[i][1].ownedStamps[j]].course][4]++
          } else if (users[i][1].age === '60代以上') {
            gotCourse[this.stamps[users[i][1].ownedStamps[j]].course][5]++
          }
        }
      }
      console.log(gotStamps)
      console.log(gotCourse)
      // const ageData = {
      //   佐賀市: [0, 0, 0, 0, 0, 0],
      //   小城市: [0, 0, 0, 0, 0, 0],
      //   多久市: [0, 0, 0, 0, 0, 0],
      //   神埼市: [0, 0, 0, 0, 0, 0],
      //   吉野ヶ里町: [0, 0, 0, 0, 0, 0],
      //   その他: [0, 0, 0, 0, 0, 0]
      // }
      // console.log(ageData)
      // for (let i = 0; i < users.length; i++) {
      //   if (users[i][1].age === '10代') {
      //     ageData[users[i][1].region][0]++
      //   } else if (users[i][1].age === '20代') {
      //     ageData[users[i][1].region][1]++
      //   } else if (users[i][1].age === '30代') {
      //     ageData[users[i][1].region][2]++
      //   } else if (users[i][1].age === '40代') {
      //     ageData[users[i][1].region][3]++
      //   } else if (users[i][1].age === '50代') {
      //     ageData[users[i][1].region][4]++
      //   } else if (users[i][1].age === '60代以上') {
      //     ageData[users[i][1].region][5]++
      //   }
      // }
      // console.log(ageData)
    },
    regionDataSetting () {
      const region = [0, 0, 0, 0, 0, 0]
      const users = Object.entries(this.users)
      for (let i = 0; i < users.length; i++) {
        if (users[i][1].region === '佐賀市') {
          region[0]++
        } else if (users[i][1].region === '小城市') {
          region[1]++
        } else if (users[i][1].region === '神埼市') {
          region[2]++
        } else if (users[i][1].region === '吉野ヶ里町') {
          region[3]++
        } else if (users[i][1].region === '多久市') {
          region[4]++
        } else {
          region[5]++
        }
      }
      console.log(region)
      this.regionDataValues = region
    },
    ageDataSetting () {
      const age = [0, 0, 0, 0, 0, 0]
      const users = Object.entries(this.users)
      for (let i = 0; i < users.length; i++) {
        if (users[i][1].age === '10代') {
          age[0]++
        } else if (users[i][1].age === '20代') {
          age[1]++
        } else if (users[i][1].age === '30代') {
          age[2]++
        } else if (users[i][1].age === '40代') {
          age[3]++
        } else if (users[i][1].age === '50代') {
          age[4]++
        } else if (users[i][1].age === '60代以上') {
          age[5]++
        }
      }
      this.ageDataValues = age
    },
    dateDataSetting (month) {
      const datedata = []
      this.dateLabels = []
      const users = Object.entries(this.users)
      let start
      let today
      if (month === 11) {
        start = new Date(2021, 10, 1)
        today = new Date(2021, 10, 31)
      } else if (month === 12) {
        start = new Date(2021, 11, 1)
        today = new Date(2021, 11, 32)
      } else if (month === 1) {
        start = new Date(2022, 0, 1)
        today = new Date(2022, 0, 32)
      } else {
        console.log('月が不正です．')
      }
      const diff = Math.floor((today - start) / 86400000)
      console.log(start, today, diff)
      for (let i = 0; i < diff; i++) {
        this.dateLabels.push(start.getFullYear() + '/' + (start.getMonth() + 1) + '/' + (start.getDate() + i))
        datedata.push(0)
      }
      for (let i = 0; i < users.length; i++) {
        const day = (users[i][1].joinedAt).getFullYear() + '/' + ((users[i][1].joinedAt).getMonth() + 1) + '/' + (users[i][1].joinedAt).getDate()
        const index = this.dateLabels.indexOf(day)
        datedata[index]++
      }
      console.log(this.dateLabels, datedata)
      this.dateDataValues = datedata
    }
  }
}
</script>

<style scoped>

</style>
