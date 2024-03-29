"use strict";

import Vue from 'vue';
import axios from "axios";
import qs from 'qs';

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.baseURL = 'http://120.78.157.105:8080'||process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        if (!(config.data instanceof FormData)) {
            let form = new FormData();
            for (let i in config.data) {
                form.append(i, config.data[i]);
            }
            config.data = form;
        }
        // Do something before request is sent
        return config;
    },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
      if(response.data.code===80002||response.data.code===80000){
      alert(response.data.msg);
      window.location.href = '/';
    }
    return response.data;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
