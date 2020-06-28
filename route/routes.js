const routes = [{
        path: '/',
        name: 'index',
        meta: {
            title: 'Home'
        },
        component: () => import( /* webpackChunkName: "home" */ '../src/components/helloworld.vue')
    },

]


export default routes