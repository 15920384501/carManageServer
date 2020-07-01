export const routes = [
    {
        path : '/register',
        name : 'Register',
        component : () => import('../views/Register')
    },
    {
        path : '/login' ,
        name : 'Login' ,
        component : () => import('../views/Login')
    },
    {
        path: '/platform',
        name: 'Platform',
        component: () => import('../views/Platform'),
        children : [
            {
                path : 'type',
                name : 'Type' ,
                component : () => import('../views/platform/Type')
            },
            {
                path : 'products',
                name : 'Products' ,
                component : () => import('../views/platform/Products')
            },
            {
                //? 表示修饰前面一个参数可有可无，如正则的?
                path : 'pro/:id/:pid?',
                name : 'Pro' ,
                component : () => import('../views/platform/Pro')
            },
            {
                path : 'orderStatistics',
                name : 'OrderStatistics' ,
                component : () => import('../views/platform/OrderStatistics')
            },
            {
                path : 'carStatistics',
                name : 'CarStatistics' ,
                component : () => import('../views/platform/CarStatistics')
            },
            {
                path : 'managementOrder',
                name : 'ManagementOrder' ,
                component : () => import('../views/platform/ManagementOrder')
            },
            {
                path : 'checkOrder',
                name : 'CheckOrder' ,
                component : () => import('../views/platform/CheckOrder')
            },
        ]
    },
    {
        path : '*' ,
        redirect : {name : 'Login'}
    }

]