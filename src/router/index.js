import Vue from 'vue'
import Router from 'vue-router'
import MyLayout from '@/components/MyLayout'
import Home from '@/components/main/Home'
import Article from '@/components/main/Article'
import ArticleDetail from '@/components/main/ArticleDetail'
import Contact from '@/components/main/Contact'
import MessageBoard from '@/components/main/MessageBoard'
import Personal from '@/components/personal/Personal'
import User from '@/components/personal/User'
import Logout from '@/components/personal/Logout'
import MyArticle from '@/components/personal/MyArticle'
import MyMessage from '@/components/personal/MyMessage'
import MyView from '@/components/personal/MyView'
import MyStar from '@/components/personal/MyStar'
import MyFollow from '@/components/personal/MyFollow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MyLayout',
      component: MyLayout,
      redirect:'/home',
      children:[
          {
            path:'/personal',
            component:Personal,
            children: [
              {
                path:'/info',
                component:User,
              },
              {
                path:'/myMessage',
                component:MyMessage,
              },
              {
                path:'/myArticle',
                component:MyArticle,
              },
              {
                path:'/myStar',
                component:MyStar,
              },
              {
                path:'/myFollow',
                component:MyFollow,
              },
              {
                path:'/myView',
                component:MyView,
              },
              {
                path:'/logout',
                component:Logout,
              }
            ]
          },
          {
            path: '/home',
            component: Home,
          },
          {
            path: '/article',
            component: Article,
          },
          {
            path: '/article/detail',
            component: ArticleDetail,
          },
          {
            path: '/message',
            component: MessageBoard,
          },
          {
            path: '/contact',
            component: Contact,
          },
      ]
    }
  ]
})
