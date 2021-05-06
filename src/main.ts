import Vue from 'vue'
// @ts-ignore
import Vuesax from 'vuesax'
import Vuelidate from 'vuelidate'
import Component from 'vue-class-component'

import App from './App.vue'
import { currencyFilter, yearsFilter } from '@/filters'

import 'vuesax/dist/vuesax.css'
import './style.css'

Vue.config.productionTip = false

Vue.filter('currency', currencyFilter)
Vue.filter('years', yearsFilter)

Vue.use(Vuesax)
Vue.use(Vuelidate)

Component.registerHooks(['validations'])

new Vue({
  render: h => h(App),
}).$mount('#app')
