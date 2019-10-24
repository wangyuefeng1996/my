// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import {playMode} from './assets/js/playmode'

// 引入axios
import axios from 'axios';
//添加两个参数,请求服务器基础路径
axios.defaults.baseURL="http://127.0.0.1:4000/";//一定要配!!!!!!!!!!!!!
//配置保存session信息
axios.defaults.withCredentials=true;
// axios不支持Vue.use方法
Vue.prototype.axios = axios;

//引入vuex第三方模块
import Vuex from "vuex"
//注册
Vue.use(Vuex)
//创建存储对象
var store = new Vuex.Store({
  //共享数据
  state:{
    playing:false,//当前播放状态
    fullScreen:true,//是否全屏
    playList:[],//当前播放列表
    sequenceList:[],//顺序播放列表
    mode:playMode.sequence,//当前播放模式
    currentIndex:0//当前的播放索引
  },
  //修改共享数据
  mutations:{
    //切换播放状态
    setplaying(state){
      state.playing=!state.playing;
    },
    //切换是否全屏
    setfullScreen(state){
      state.fullScreen=!state.fullScreen;
    },
    //先清空再整个表插入播放列表,并使得当前索引指向第一首
    setplayListAll(state,list){
      state.playList=[];
      state.sequenceList=[];
      for(var obj of list){
        state.playList.push(obj);
      }
      for(var i=0;i<list.length;i++){
        state.sequenceList.push(i);
      }
      state.currentIndex=0;
    },
    //从当前位置插入,并将索引指向当前歌曲
    setplayListOne(state,obj){
      state.playList.splice(currentIndex,0,obj);
      state.sequenceList.push(state.sequenceList.length);
      state.currentIndex++;
    },
    //改变播放模式为顺序播放
    setModeSequence(state){
      state.mode=playMode.sequence;
    },
    //改变播放模式为随机播放
    setModeSequence(state){
      state.mode=playMode.random;
    },
    //改变播放模式为单曲播放
    setModeSequence(state){
      state.mode=playMode.loop;
    },
    //改变当前索引
    setcurrentIndex(state,num){
      state.currentIndex=num;
    },
  },
  // 获取共享数据
  getters:{
    getplaying(state){
      return state.playing;
    },
    getfullScreen(state){
      return state.fullScreen;
    },
    getplayList(state){
      return state.playing;
    },
    getsequenceList(state){
      return state.sequenceList;
    },
    getmode(state){
      return state.mode;
    },
    getcurrentIndex(state){
      return state.currentIndex;
    },
  }
})

//vant组件 引入和注册
import { NavBar } from 'vant';
Vue.use(NavBar);
import { ActionSheet } from 'vant';
Vue.use(ActionSheet);
import { Progress } from 'vant';
Vue.use(Progress);


//引入字体图标
import './font/font-player/iconfont.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
