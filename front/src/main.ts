import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '@/router';
import autoGlobal from '@/plugins/autoGlobal';

const app = createApp(App)
  .use(autoGlobal)
  .use(router);

app.mount('#app');
