/**
 * Created by Administrator on 2017/12/13 0013.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app.js'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
  },
});

export default store

