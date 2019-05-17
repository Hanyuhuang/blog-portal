import Vue from 'vue'
import Router from 'vue-router'
import MyLayout from '@/components/MyLayout'
import Home from '@/components/Home'
import Article from '@/components/Article'
import ArticleDetail from '@/components/ArticleDetail'
import Contact from '@/components/Contact'
import MessageBoard from '@/components/MessageBoard'
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
