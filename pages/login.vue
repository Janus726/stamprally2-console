<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col>
        <h2 class="my-2" style="padding-top: 100px">
          ログイン
        </h2>
        <b-card style="border: none">
          <b-form
            ref="loginForm"
            v-model="loginValid"
            lazy-validation
          >
            <b-form-input
              v-model="loginEmail"
              placeholder="メールアドレス"
              class="my-3"
              size="lg"
              required
            />
            <b-form-input
              v-model="loginPassword"
              type="password"
              placeholder="パスワード"
              class="my-3"
              size="lg"
              required
            />
            <b-button
              :disabled="!loginValid"
              variant="primary"
              class="my-4"
              size="lg"
              block
              @click="login()"
            >
              ログイン
            </b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

export default {
  data () {
    return {
      loginValid: true,
      loginEmail: '',
      loginPassword: '',
      loginErrorMsg: ''
    }
  },
  methods: {
    login () {
      // auth.signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
      //   .then(() => {
      //     this.loginEmail = ''
      //     this.loginPassword = ''
      //     this.$router.push({
      //       name: 'index'
      //     })
      //   }).catch((err) => {
      //     if (err.code === 'auth/user-disabled') {
      //       this.loginErrorMsg = 'このアカウントはブロックされています。'
      //     } else {
      //       this.loginErrorMsg = 'メースアドレスまたはパスワードに誤りがあります。'
      //     }
      //   })
      this.$store.dispatch('signInWithEmail', {
        email: this.loginEmail,
        password: this.loginPassword
      }).then(() => {
        this.loginEmail = ''
        this.loginPassword = ''
        console.log('success')
        this.$router.push({
          name: 'index'
        })
      }).catch((err) => {
        if (err.code === 'auth/user-disabled') {
          this.loginErrorMsg = 'このアカウントはブロックされています。'
          this.$bvToast.toast(this.loginErrorMsg, {
            variant: 'danger'
          })
        } else {
          this.loginErrorMsg = 'メースアドレスまたはパスワードに誤りがあります。'
          this.$bvToast.toast(this.loginErrorMsg, {
            variant: 'danger'
          })
          console.log(this.loginErrorMsg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
