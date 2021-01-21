import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import M from 'materialize-css'
import 'croppie/croppie.css'
//Plugins
import Vuelidate from 'vuelidate'
import VueCroppie from 'vue-croppie'
import VueCryptojs from 'vue-cryptojs'
import colorPlugin from '@/utils/color.plugin'

//Components
import ModalFollowers from '@/components/app/ModalFollowers'
import ModalSelectMedia from '@/components/app/ModalSelectMedia'
import ModalMoreMedia from '@/components/app/ModalMoreMedia'
import ModalMoreComment from '@/components/app/ModalMoreComment'
import Settings from '@/components/app/Settings'
import Loader from '@/components/app/Loader'
import EmptyBlock from '@/components/app/EmptyBlock'

//Filters
import textFilter from '@/filters/text.filter'
import dateFilter from '@/filters/date.filter'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

Vue.use(VueCryptojs)
Vue.use(colorPlugin)
Vue.use(M)
Vue.use(Vuelidate)
Vue.use(VueCroppie)
Vue.filter('text', textFilter)
Vue.filter('date', dateFilter)


Vue.component('ModalFollowers', ModalFollowers)
Vue.component('ModalSelectMedia', ModalSelectMedia)
Vue.component('ModalMoreMedia', ModalMoreMedia)
Vue.component('ModalMoreComment', ModalMoreComment)
Vue.component('Settings', Settings)
Vue.component('EmptyBlock', EmptyBlock)

Vue.component('Loader', Loader)


Vue.config.productionTip = false

firebase.initializeApp({
    apiKey: `"${process.env.API_KEY}"`,
    authDomain: "gra-gra.firebaseapp.com",
    projectId: "gra-gra",
    storageBucket: "gra-gra.appspot.com",
    messagingSenderId: "556387377948",
    databaseURL: 'https://gra-gra-default-rtdb.europe-west1.firebasedatabase.app',
    appId: "1:556387377948:web:d54d7f4efdb8ddaf72d0d9",
    measurementId: "G-KHH3MNMHRH"
})


let app

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
})