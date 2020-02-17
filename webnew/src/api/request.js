/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
// import QS from 'qs'
import axios from 'axios'
import router from '@/router'
import store from '@/store'
import {Message} from 'element-ui'

import CryptoJs from 'crypto-js'

//import {aesUtil, rsaUtil} from '@/utils/jiamijiemi.js'
// import aesUtil from '@/utils/aesUtil'
// import rsaUtil from '@/utils/rsaUtil'


const ApiHost1 = 'http://10.219.15.60:9091/'
// const ApiHost1 = 'http://10.219.12.37:9091/' 
// const ApiHost1 = 'http://192.168.11.227:58084/' 


// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = ApiHost1
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = window.Glod.serverApi
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    case 401: // 401: 未登录状态，跳转登录页
      Message({
        showClose: true,
        message: other,
        type: 'error'
      })
      toLogin()
      break
    case 403: // 403 token过期,清除token并跳转登录页
      Message({
        showClose: true,
        message: '登录过期，请重新登录',
        type: 'error'
      })
      // localStorage.removeItem('token')
      // store.commit('loginSuccess', null)
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    case 404: // 404请求不存在
      Message({
        showClose: true,
        message: '请求的资源不存在',
        type: 'error'
      })
      break
    case 500:
      Message({
        showClose: true,
        message: '服务器错误',
        type: 'error'
      })
      break
    default:
  }
}

// 创建axios 实例
const service = axios.create({
  baseURL: axios.defaults.baseURL,
  timeout: 60000,
  withCredentials: true
})

// let genKeyPair = rsaUtil.genKeyPair();
// window.jsPublicKey = genKeyPair.publicKey;
// window.jsPrivateKey = genKeyPair.privateKey;
var key="swkh";




function EncryptData(data,id) {

  let eKey=key+id;
  eKey=eKey.replace("-","");
  if(eKey.length>16){
    eKey=eKey.substring(0,16);
  }

  let k = CryptoJs.enc.Latin1.parse(eKey);
  var srcs = CryptoJs.enc.Utf8.parse(data);
  var encrypted = CryptoJs.AES.encrypt(srcs, k, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7
  });
  return encrypted.toString();
}

function DecryptData(data,id) {
  let eKey=key+id;
  eKey=eKey.replace("-","");
  if(eKey.length>16){
    eKey=eKey.substring(0,16);
  }
  let k = CryptoJs.enc.Latin1.parse(eKey);
  var stime = new Date().getTime();
  var decrypt = CryptoJs.AES.decrypt(data, k, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7
  });
  var result = JSON.parse(CryptoJs.enc.Utf8.stringify(decrypt).toString());
  var etime = new Date().getTime();
  return result
}


// request 拦截器
service.interceptors.request.use(
  config => {
    // console.log(config)
    // loading + 1
    // store.dispatch('SetLoading', true)
    // console.log(config);
    // if (sessionStorage.getItem('encryptDebug') == 'true') {
    //   var s = config.url.substring(config.url.lastIndexOf("/"), config.url.length);
    //   // console.log(s);
    //   if (config.method == "post" && s != "login" && s != "login_p") {
    //     let data = config.data;
    //     let aesKey = aesUtil.genKey();
    //     config.data = {
    //       data: aesUtil.encrypt(data, aesKey),//AES加密后的数据
    //       aesKey: rsaUtil.encrypt(aesKey, sessionStorage.getItem('publicKey')),//后端RSA公钥加密后的AES的key
    //       publicKey: window.jsPublicKey//前端公钥
    //     };
    //   }
    // }


    var s = config.url.substring(config.url.lastIndexOf("/"), config.url.length);
    if(config.method=="get" || config.method == "post" ) {
        //   console.log(s)
      if (s != "login" && s != "login_p" && s != "relogin"&&s!="/importPeople"&&s!="/importSatisfy"&&s!="/insertMsgForExcelForSW"&&s!="/upload") {
        if (sessionStorage.getItem('encryptDebug') == 'false') {
          let id = JSON.parse(sessionStorage.getItem("personal")).id
          config.data = EncryptData(config.data, id);
        }
      }
    }

    return config
  },
  error => {
    //  这里处理一些请求出错的情况
    // loading 清 0
    // setTimeout(function () {
    //   store.dispatch('SetLoading', 0)
    // }, 300)
    // console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.headers['content-type'].indexOf('application/vnd.ms-excel') > -1
      && !response.data.hasOwnProperty('responseCode')) {
      return response;
    }
    if (sessionStorage.getItem('encryptDebug') == 'false') {
      if (typeof(response.data) == 'string') {
        let id = JSON.parse(sessionStorage.getItem("personal")).id
        response.data = DecryptData(response.data,id)
      }
    }
    //   if (sessionStorage.getItem('encryptDebug') == 'true') {
    //     console.log(response.data)
    //     if (response.data.data != null) {
    //
    //       if (response.data.data.aesKey != null) {
    //         response.data = aesUtil.decrypt(response.data.data.data, rsaUtil.decrypt(response.data.data.aesKey, window.jsPrivateKey));
    //         const res = response.data
    //         return res
    //       }
    //     }
    // }

    const res = response.data
// loading - 1
// store.dispatch('SetLoading', false)
    return res
  },
  error => {
    const {response} = error
    // loading - 1
    // store.dispatch('SetLoading', false)
    errorHandle(response.status, response.data.message)
    return Promise.reject(response)
  }
)

export default service
