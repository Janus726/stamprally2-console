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
          @click="createEvent()"
        >
          <fa :icon="faPlus" style="font-size: 20px" />
        </b-button>
        <b-tooltip target="tooltip2" triggers="hover">
          新規追加
        </b-tooltip>
        <div style="overflow: scroll; height: 39rem">
          <b-list-group>
            <b-list-group-item
              v-for="event in events"
              :key="event.id"
              button
              class="d-flex"
              @click="openInfo(event.id)"
            >
              {{ event.title }}
              <fa :icon="faTrash" class="ml-auto mr-3 mt-1" style="font-size: 18px" @click="openModal(event.id)" />
            </b-list-group-item>
          </b-list-group>
        </div>
        <b-modal id="delete" size="sm" hide-header hide-footer centered>
          <div v-if="deleteId" class="text-center mt-4 mb-2">
            <h4>{{ events[deleteId].title }}</h4>
            <h4>を削除しますか？</h4>
            <div class="mt-4">
              <b-button class="mx-2" variant="primary" @click="deleteEvent(deleteId)">
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
        <div v-if="upload" class="text-center align-items-center">
          <b-spinner type="grow" label="Spinning" style="width: 3rem; height: 3rem;" class="my-3" />
        </div>
        <div v-else>
          <h5 class="mt-4">
            イベント情報
          </h5>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="title">イベント<br>タイトル：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="title" v-model="formTitle" />
            </b-col>
          </b-row>
          <b-row class="d-flex align-items-center mt-4">
            <b-col class="col-3">
              <label for="date">開催日程：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-datepicker
                id="date"
                v-model="formStart"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                size="sm"
                min="minDate"
                max="maxDate"
                locale="jp"
              />
            </b-col>
            <b-col class="col-1 align-content-center">
              <p>～</p>
            </b-col>
            <b-col class="col-4">
              <b-form-datepicker
                id="date2"
                v-model="formEnd"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                size="sm"
                min="minDate"
                max="maxDate"
                locale="ja"
              />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="text">説明：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-textarea id="text" v-model="formText" rows="3" max-rows="6" style="height: 120px; overflow: auto" />
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
            <b-col>
              <p>・イベントは開催期間を過ぎたものは表示されなくなります．</p>
              <p>・画像は別途送っていただく必要があります．</p>
            </b-col>
          </b-row>
          <b-row class="text-center mt-5 mb-3">
            <b-col>
              <b-button v-if="edit" variant="primary" size="lg" @click="uploadEvent(edit)">
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
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
// import firebase from 'firebase/compat/app'
import { firestore } from '@/plugin/firebase'
// import firebase from 'firebase/compat'

export default {
  name: 'Events',
  data () {
    return {
      loaded: false,
      windowHeight: window.innerHeight,
      events: {},
      edit: null,
      deleteId: null,
      upload: false,
      formTitle: '',
      formText: '',
      formDesc: '',
      formStart: null,
      formEnd: null,
      formURL: '',
      minDate: new Date(2021, 11, 1),
      maxDate: new Date(2022, 1, 31, 23, 59, 59)
    }
  },
  computed: {
    faPlus () {
      return faPlus
    },
    faTrash () {
      return faTrash
    }
  },
  async created () {
    const _this = this
    await firestore
      .collection('information')
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.events, doc.id, doc.data())
          const startDate = _this.timeConverter(doc.data().start.seconds * 1000)
          _this.$set(_this.events[doc.id], 'start', startDate)
          const endDate = _this.timeConverter(doc.data().end.seconds * 1000)
          _this.$set(_this.events[doc.id], 'end', endDate)
        })
      })
    // console.log(this.events)
    this.loaded = true
  },
  methods: {
    timeConverter (time) {
      return new Date(time)
    },
    openInfo (id) {
      this.edit = id
      this.formTitle = this.events[id].title
      this.formText = this.events[id].text
      this.formDesc = this.events[id].desc
      this.formURL = this.events[id].url
      this.formStart = (this.events[id].start).getFullYear() + '-' + ((this.events[id].start).getMonth() + 1) + '-' + (this.events[id].start).getDate()
      this.formEnd = (this.events[id].end).getFullYear() + '-' + ((this.events[id].end).getMonth() + 1) + '-' + (this.events[id].end).getDate()
      // console.log(this.formStart, this.formEnd)
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
    createEvent () {
      const newId = this.createId()
      this.edit = newId
      const data = {
        title: '新規イベント',
        id: newId,
        desc: '',
        url: '',
        text: '',
        image: '',
        thumbnail: '',
        start: new Date(2021, 10, 1),
        end: new Date(2021, 10, 1, 23, 59, 59)
      }
      this.$set(this.events, newId, data)
      this.openInfo(newId)
    },
    async uploadEvent (id) {
      // console.log(this.formStart, this.formEnd)
      this.upload = true
      this.edit = null
      const data = {
        title: this.formTitle,
        id,
        desc: String(this.formDesc),
        url: this.formURL,
        text: this.formText,
        start: new Date(this.formStart + ' 00:00:00'),
        end: new Date(this.formEnd + ' 23:59:59'),
        added: new Date()
      }
      // console.log(data.start, data.end, (data.end).getTime())
      if ((data.end).getTime() - (data.start).getTime() <= 0) {
        this.$bvToast.toast('開催期間が不正です', {
          variant: 'danger'
        })
        this.upload = false
        return
      }
      await firestore
        .collection('information')
        .doc(id)
        .set(data, { merge: true })
      this.$set(this.events, id, data)
      this.$bvToast.toast(this.formTitle + ' を追加しました。', {
        variant: 'info'
      })
      this.upload = false
      // console.log(this.events)
    },
    openModal (id) {
      this.deleteId = id
      this.$bvModal.show('delete')
    },
    async deleteEvent (id) {
      this.$bvModal.hide('delete')
      const deleteName = this.events[id].title
      await firestore
        .collection('information')
        .doc(id)
        .delete()
      this.$delete(this.events, id)
      this.deleteId = null
      this.formTitle = ''
      this.formText = ''
      this.formDesc = ''
      this.formURL = ''
      this.formStart = null
      this.formEnd = null
      this.edit = null
      this.$bvToast.toast(deleteName + ' を削除しました。', {
        variant: 'info'
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
