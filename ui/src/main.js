import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import Swal from "sweetalert2";
import { Dialog, Prompt, Toast } from "./util/sweetAlerts";
import Axios from "axios";
import { apiUrl } from "./util/constants";

Axios.defaults.baseURL = apiUrl;
Vue.config.productionTip = false;
Vue.prototype.Swal = Swal;
Vue.prototype.Dialog = Dialog;
Vue.prototype.Prompt = Prompt;
Vue.prototype.Toast = Toast;
Vue.prototype.axios = Axios;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
