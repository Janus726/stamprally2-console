<template>
  <b-container class="shadow-sm py-1" style="border-radius: 3px">
    <b-row class="d-flex mb-4">
      <b-col class="col-6 my-3">
        <b-button
          id="tooltip2"
          variant="outline-primary"
          class="my-3"
          style="border-width: 3px; height: 60px"
          block
          @click="createStamp()"
        >
          <fa :icon="faPlus" style="font-size: 20px" />
        </b-button>
        <b-tooltip target="tooltip2" triggers="hover">
          新規追加
        </b-tooltip>
        <div style="overflow: scroll; height: 39rem">
          <b-list-group>
            <b-list-group-item
              v-for="stamp in stamps"
              :key="stamp.id"
              button
              class="d-flex"
              @click="openInfo(stamp.id)"
            >
              {{ stamp.name }}
              <fa :icon="faQrcode" class="ml-auto mt-1" style="font-size: 18px" @click="showQr(stamp.id)" />
              <fa :icon="faTrash" class="ml-4 mr-3 mt-1" style="font-size: 18px" @click="openModal(stamp.id)" />
            </b-list-group-item>
          </b-list-group>
        </div>
        <b-modal id="delete" size="sm" hide-header hide-footer centered>
          <div v-if="deleteId" class="text-center mt-4 mb-2">
            <h4>{{ stamps[deleteId].name }}</h4>
            <h4>を削除しますか？</h4>
            <div class="mt-4">
              <b-button class="mx-2" variant="primary" @click="deleteStamp(deleteId)">
                はい
              </b-button>
              <b-button class="mx-2" variant="danger" @click="$bvModal.hide('delete')">
                いいえ
              </b-button>
            </div>
          </div>
        </b-modal>
      </b-col>
      <b-col class="col-6 my-3" style="overflow: scroll; height: 45rem">
        <div v-if="qrCode" class="d-flex justify-content-center text-center" style="width: 100%; height: 400px">
          <div>
            <h4> {{ stamps[qrCode].name }} </h4>
            <qrcode id="qrimg" :value="'https://' + qrCode" :options="{width: 300, height: 300}" tag="img" />
            <div>
              <b-button variant="primary" @click="downloadQr(stamps[qrCode].name + '.png')">
                ダウンロード
                <fa :icon="faDownload" style="font-size: 18px" />
              </b-button>
              <b-button variant="danger" @click="qrCode = null">
                閉じる
              </b-button>
            </div>
          </div>
        </div>
        <GmapMap
          v-else
          ref="gMAp"
          map-type-id="roadmap"
          :center="initialLocation"
          :zoom="zoom"
          :style="styleMap"
          :options="mapOptions"
          style="overflow: hidden; border-radius: 13px; z-index: 1"
          @click="ping($event)"
        >
          <GmapMarker
            v-if="markerPos"
            :position="markerPos"
            :draggable="true"
          />
          <GmapCircle
            v-if="markerPos"
            :center="markerPos"
            :radius="formRadius"
            :visible="true"
            :options="{strokeColor: 'red', strokeOpacity: '0.5', fillColor: 'red', fillOpacity: '0.2'}"
          />
        </GmapMap>
        <div v-if="upload" class="text-center align-items-center">
          <b-spinner type="grow" label="Spinning" style="width: 3rem; height: 3rem;" class="my-3" />
        </div>
        <div v-else>
          <h5 class="mt-4">
            スタンプ情報
          </h5>
          <b-row class="d-flex align-items-center mt-4">
            <b-col class="col-3">
              <label for="latitude">緯度：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="latitude" v-model.number="formLat" type="number" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="longitude">経度：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="longitude" v-model.number="formLng" type="number" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="radius">半径：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-input id="radius" v-model.number="formRadius" type="number" />
            </b-col>
            <h6>m</h6>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="name">スタンプ名：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="name" v-model="formName" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="desc">説明：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-textarea id="desc" v-model="formDesc" rows="3" max-rows="6" style="height: 120px; overflow: auto" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="webURL">ウェブサイトURL：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="webURL" v-model.number="formURL" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="QRorGPS">方式：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-select id="QRorGPS" v-model="formQRorGPS" :options="[{value: 'GPS', text: 'GPSのみ'}, {value: 'QR', text: 'QR + GPS'}]" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="openOrNot">公開：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-checkbox
                id="openOrNot"
                v-model="formOpen"
                switch
                size="lg"
                value="1"
                unchecked-value="0"
              />
            </b-col>
          </b-row>
          <b-row class="text-center mt-5 mb-3">
            <b-col>
              <b-button v-if="edit" variant="primary" size="lg" @click="uploadStamp(edit)">
                変更の確定
              </b-button>
              <b-button v-else variant="secondary" disabled size="lg">
                変更の確定
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { faPlus, faTrash, faQrcode, faDownload } from '@fortawesome/free-solid-svg-icons'
import { gmapApi } from 'vue2-google-maps'
import firebase from 'firebase/compat/app'
import { firestore } from '@/plugin/firebase'

export default {
  name: 'Stamps',
  data () {
    return {
      windowHeight: window.innerHeight,
      stamps: {},
      initialLocation: { lng: 130.27, lat: 33.3 },
      styleMap: {
        width: '100%',
        height: '450px'
      },
      zoom: 10,
      mapOptions: {
        disableDefaultUi: true,
        mapTypeControl: true,
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        clickableIcons: false,
        styles: []
      },
      markerPos: null,
      formName: '',
      formLat: 0,
      formLng: 0,
      formRadius: 0,
      formOpen: false,
      formDesc: '',
      formQRorGPS: 'QR',
      formURL: '',
      edit: null,
      deleteId: null,
      qrCode: null,
      upload: false,
      height1: (window.innerHeight - 160) + 'px',
      height2: (window.height - 220) + 'px'
    }
  },
  computed: {
    faPlus () {
      return faPlus
    },
    faTrash () {
      return faTrash
    },
    faQrcode () {
      return faQrcode
    },
    faDownload () {
      return faDownload
    },
    google: gmapApi
  },
  watch: {
  },
  async created () {
    const _this = this
    await firestore
      .collection('stamps')
      .where('display', '==', 1)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.stamps, doc.id, doc.data())
        })
        _this.$store.dispatch('setStamps', _this.stamps)
      })
    console.log(this.stamps)
    this.loaded = true
  },
  methods: {
    openInfo (id) {
      console.log()
      if (this.stamps[id].area === this.$store.getters.userName || this.$store.getters.userName === 'テストユーザ') {
        this.edit = id
      } else {
        this.edit = null
      }
      this.formLat = this.stamps[id].location._lat
      this.formLng = this.stamps[id].location._long
      this.markerPos = { lat: this.formLat, lng: this.formLng }
      this.initialLocation = { lat: this.formLat, lng: this.formLng }
      this.formName = this.stamps[id].name
      this.formRadius = this.stamps[id].radius
      this.formDesc = this.stamps[id].description
      this.formOpen = String(this.stamps[id].display)
      this.formQRorGPS = this.stamps[id].type
      this.formURL = this.stamps[id].URL
      this.zoom = 17
    },
    ping (event) {
      if (event) {
        this.formLat = event.latLng.lat()
        this.formLng = event.latLng.lng()
        this.markerPos = { lat: this.formLat, lng: this.formLng }
      }
    },
    createId () {
      const length = 20
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let r = ''
      for (let i = 0; i < length; i++) {
        r += c[Math.floor(Math.random() * c.length)]
      }
      return r
    },
    createColor () {
      const h = Math.random() * 360
      const s = 80
      const l = Math.random() * 0.05 + 0.55
      const a = s * Math.min(l, 1 - l) / 100
      const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    },
    createStamp () {
      const newId = this.createId()
      this.edit = newId
      // demo番のみ，demo: trueを追加
      const data = {
        name: '新しいスタンプ',
        area: this.$store.getters.userName,
        location: new firebase.firestore.GeoPoint(33.3, 130.27),
        radius: 0,
        id: newId,
        display: 1,
        color: '#696969',
        description: '',
        URL: '',
        type: 'QR',
        course: ''
      }
      this.$set(this.stamps, newId, data)
      this.openInfo(newId)
    },
    async uploadStamp (id) {
      this.uplaod = true
      this.edit = null
      // demo番のみ，demo: trueを追加
      const data = {
        name: this.formName,
        area: this.$store.getters.userName,
        id,
        location: new firebase.firestore.GeoPoint(Number(this.formLat), Number(this.formLng)),
        display: Number(this.formOpen),
        description: String(this.formDesc),
        radius: this.formRadius,
        type: this.formQRorGPS,
        URL: this.formURL
      }
      await firestore
        .collection('stamps')
        .doc(id)
        .set(data, { merge: true })
      this.$set(this.stamps, id, data)
      this.$bvToast.toast(this.formName + ' を追加しました。', {
        variant: 'info'
      })
      this.upload = false
      console.log(this.stamps)
    },
    openModal (id) {
      if (this.stamps[id].area === this.$store.getters.userName || this.$store.getters.userName === 'テストユーザ') {
        this.deleteId = id
        this.$bvModal.show('delete')
      } else {
        this.$bvToast.toast('権限がありません。', {
          variant: 'danger'
        })
      }
    },
    async deleteStamp (id) {
      this.$bvModal.hide('delete')
      const deleteName = this.stamps[id].name
      await firestore
        .collection('stamps')
        .doc(id)
        .delete()
      this.$delete(this.stamps, id)
      this.deleteId = null
      this.formLat = 0
      this.formLng = 0
      this.markerPos = null
      this.initialLocation = { lng: 130.27, lat: 33.3 }
      this.formName = ''
      this.formRadius = 0
      this.formDesc = ''
      this.formOpen = false
      this.formQRorGPS = 'QR'
      this.formURL = ''
      this.zoom = 17
      this.edit = null
      this.$bvToast.toast(deleteName + ' を削除しました。', {
        variant: 'info'
      })
    },
    showQr (id) {
      this.qrCode = id
      this.openInfo(id)
    },
    downloadQr (name) {
      const img = document.querySelector('img')
      const canvas = document.createElement('canvas')
      canvas.width = img.clientWidth
      canvas.height = img.clientHeight
      const context = canvas.getContext('2d')
      context.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        const url = (window.URL || window.webkitURL).createObjectURL(blob)
        const download = document.createElement('a')
        document.body.appendChild(download)
        download.download = name
        download.href = url
        download.click();
        (window.URL || window.webkitURL).revokeObjectURL(url)
      })
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, .3);
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, .3);
}

</style>
