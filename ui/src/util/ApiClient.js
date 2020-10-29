import Axios from "axios";
Axios.defaults.baseURL = process.env.BASE_URL;

module.exports = Axios;
