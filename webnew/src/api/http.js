import request from './request'
import axios from 'axios'

const forbidArr = ['kpi/selectKpiInformationByTypeKey',//指标配置
  'kpi/selectCanBeReportKpi','kpiDep/selectAuditKpiByBeexamedDep','kpi/selectSendBackKpiByIdAndUserId','kpi/selectPassBeexamedDepKpiByMsg',//指标上报
  'kpiDep/selectAuditKpiByAuditDep','kpiDep/selectAuditKpiMsgByUserAndBeexamed','kpi/selectSendBackKpiByZenRenDep','kpi/selectPassZenRenDepKpiByMsg','kpi/selectBackToLowerByKpiTypeAndBeexamedDep'//指标审核
] //防止重复请求的url的数组

function formEncode (data) {
  let url = ''
  for (let i in data) {
    url += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
  }
  return url.slice(0, -1)
}

export default {
  get (url) {
    return request({
      url,
      method: 'get'
    })
  },
  postForm (url, data) {
    return request({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formEncode(data)
    })
  },
  postJSON (url, data) {
    var that = this
    if(forbidArr.indexOf(url)!=-1) {
      try{
        this[url]()
      }catch(e){

      }
    }
    return request({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      cancelToken: new axios.CancelToken(function executor(c) {
        that[url] = c;
      }),
      data: JSON.stringify(data)
    })
  },
  postFileOut (url, data) { //文件导出
    return request({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      responseType:"blob" ,
      data: JSON.stringify(data)
    })
  },
  postFileEnter (url, data) { //文件导入
    return request({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: data
    })
  },
  baseHost:request.defaults.baseURL
}
