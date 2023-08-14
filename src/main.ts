import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import Maska from 'maska';
import { createPinia } from 'pinia'
import mitt from 'mitt';

const emitter = mitt();

const app = createApp(App);

app.use(createPinia())
app.use(router);
app.use(PerfectScrollbar);
app.use(VueTablerIcons);
app.use(Maska);
app.use(VueApexCharts);
app.provide('emitter', emitter);
app.use(vuetify).mount('#app');
