import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import user from './user'
import publish from './publish'
import chat from './chat'




Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error:null
  },
  mutations: {
    setError(state, error){
      state.error = error
    },
    clearError(state){
      state.error =null
    }
  },
  getters:{
    error: s=> s.error
  },
  modules: {
    auth, user, publish, chat
  }
})
