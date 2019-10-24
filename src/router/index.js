import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

//引入组件路由
import Player from '@/components/player/Player'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Player',
      name: 'Player',
      component: Player
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
  ]
})
