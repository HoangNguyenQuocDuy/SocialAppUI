const routers = {
    home: '/',
    mess: '/messages',
    profile: '/profile/{userId}',
    login: '/login',
    register: '/register',
    community: '/community',
    trending: '/trending',
    notifications: '/notifications',
    chat: '/rooms',
    chatRoom: '/rooms/:roomId',
    forgotPassword: '/forgotPassword',
    resetPassword: '/resetPassword',
}

export default routers