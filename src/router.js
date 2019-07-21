import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Index from '@/components/Index'
import Home from './components/home/home'
import Book from './components/book/book'
import Quality from './components/Quality/Quality'


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/index',
            name: 'index',
            component: Index,
            redirect:'index/home',
            children:[
                {
                    path: 'book',
                    name: 'book',
                    component: Book,
                },
                {
                    path: 'quality',
                    name: 'quality',
                    component: Quality,
                },
                {
                    path: 'home',
                    name: 'home',
                    component: Home,
                },
            ]
        },
    ]
})
