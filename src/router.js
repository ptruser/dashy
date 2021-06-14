import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import { isLoggedIn } from '@/utils/Auth';
import { appConfig, pageInfo, sections } from '@/utils/ConfigAccumalator';

Vue.use(Router);

const isAuthenticated = () => {
  const users = appConfig.auth;
  return (!users || isLoggedIn(users));
};

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: {
        appConfig,
        pageInfo,
        sections,
      },
      meta: {
        title: pageInfo.title || 'Home Page',
        metaTags: [
          {
            name: 'description',
            content: 'A simple static homepage for you\'re server',
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      props: {
        appConfig,
      },
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) router.push({ path: '/' });
        next();
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login' });
  else next();
});

const defaultTitle = 'Dashy';
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || defaultTitle;
  });
});

export default router;