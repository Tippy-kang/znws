export default {
  install(Vue, options) {
    //权限检查方法
    Vue.prototype.$_has = function(value) {
      let isExist=false;
      let buttonpermsStr=sessionStorage.getItem("Resource");
      if(buttonpermsStr==undefined || buttonpermsStr==null){
        return false;
      }
      // let buttonperms=JSON.parse(buttonpermsStr);
      // for(let i=0;i<buttonperms.length;i++){
        if(buttonpermsStr.indexOf(value)>-1){
          isExist=true;
        }
      // }
      return isExist;
    }
    //提示信息
    Vue.prototype.message = function (val, msg) {
      switch (val) {
        case 'success':
          this.$message.success({
            showClose: true,
            duration: 1500,
            message: msg,
            customClass:'zZindex'
          });
          break;
        case 'warning':
          this.$message.warning({
            showClose: true,
            duration: 1500,
            message: msg,
            customClass:'zZindex'
          });
          break;
        case 'error':
          this.$message.error({
            showClose: true,
            duration: 1500,
            message: msg,
            customClass:'zZindex'
          });
          break;
        case 'info':
          this.$message.info({
            showClose: true,
            duration: 1500,
            message: msg,
            customClass:'zZindex'
          });
          break;
      }
    };
    //时间格式转换
    Vue.prototype.formatDate = function (fmt, val) {
     
      let date = new Date(val)
      if(date == "Invalid Date"){
        let str = val.replace(/-/g,"/")
        str = str.split('.')[0]
        date = new Date(str)
      }
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };
    //查询文件后缀名
    Vue.prototype.searchExt = function(filePath) {
      //获取最后一个.的位置
      var index= filePath.lastIndexOf(".");

      //获取后缀
      var ext = filePath.substr(index+1);
      return ext;
    };
    Vue.prototype.maxTableHeightResize =  function(maxTableHeight,height) {

      height = height || 290
      let searchBarHeight = document.getElementsByClassName('search-bar')[0].clientHeight
      let container = document.getElementById('routerIndex').clientHeight
      // let container = document.getElementsByClassName('main')[0].clientHeight
      maxTableHeight = container - searchBarHeight - height
      // console.log(container);
      // console.log(searchBarHeight);

      // console.log(maxTableHeight);


      return maxTableHeight
    };
    Vue.prototype.deleFiles = function (val){
        val.forEach(el=>{
          let params = {
            id:el.id
          }
          this.$http.postJSON('file/deleteFile',params).then(res => {
            if (res.code === 200) {
              // this.message('success', res.message)
            } else {
              this.message('error', res.message)
            }
          })
      })
    };
    //form表单验证错误自动聚焦
    Vue.prototype.focusAccord = function(){
        setTimeout(()=>{
            $('.el-form-item__error')[0].parentNode.scrollIntoView(true);
        },300);
    };
  }

}
