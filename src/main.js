import Vue from 'vue'
import firebase from 'firebase/app'
import vuelidate from 'vuelidate'

import App from './App.vue'
import router from './router'
import store from './store'

import AppDate from '@/components/AppDate'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

firebase.initializeApp(firebaseConfig)

Vue.component('AppDate', AppDate)

Vue.config.productionTip = false

Vue.use(vuelidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
