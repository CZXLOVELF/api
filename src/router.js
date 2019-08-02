import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Index from '@/components/Index'
import Home from './components/home/home'
import Book from './components/book/book'
import Quality from './components/Quality/Quality'
import IndexBanner from './components/IndexBanner/IndexBanner'
import CollectionBook from './components/CollectionBook/CollectionBook'
import MenuItem from './components/MenuItem/MenuItem'
import Discount from './components/Discount/Discount'
import FreeShip from './components/FreeShip/FreeShip'
import Admin from './components/Admin/Admin'
import AdminManageEvent from './components/AdminManageEvent/AdminManageEvent'


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
                {
                    path: 'indexBanner',
                    name: 'indexBanner',
                    component: IndexBanner,
                },
                {
                    path: 'collectionBook',
                    name: 'collectionBook',
                    component: CollectionBook,
                },
                {
                    path: 'menuItem',
                    name: 'menuItem',
                    component: MenuItem,
                },
                {
                    path: 'discount',
                    name: 'discount',
                    component: Discount,
                },
                {
                    path: 'freeShip',
                    name: 'freeShip',
                    component: FreeShip,
                },
                {
                    path: 'admin',
                    name: 'admin',
                    component: Admin,
                },
                {
                    path: 'adminManageEvent',
                    name: 'adminManageEvent',
                    component: AdminManageEvent,
                },
            ]
        },
    ]
})
