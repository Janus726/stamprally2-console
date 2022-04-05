export default ({ store, route, redirect }) => {
  if (!store.getters.isAuthenticated && route.name !== 'login') {
    redirect({ path: '/login' })
  }
  if (store.getters.isAuthenticated && (route.name === 'login')) {
    redirect({ path: '/' })
  }
}
