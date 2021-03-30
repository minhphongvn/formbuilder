import axios from '../api';
// import VueCookies from 'vue-cookies';

let redirect = url => window.location.href = url;

axios.interceptors.request.use(function (config) {
    const token = `eyJzaWQiOiJFNTBENTlBNEZFM0Y4QTY5IiwiZXhwIjoyMDg3OTU1MDM1fQ.MNZ76QsMqBHoOs4rMG9gw5d5vEgy9Q7N_MqrNZDOXFg`; //VueCookies.get('awt') || '';
    config.headers.Authorization = token;
    return config;
  }, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
   const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      return redirect('https://app.lhu.edu.vn?ur=https://qa.lhu.edu.vn')
    }
    return Promise.reject(error);
});
