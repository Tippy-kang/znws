<template>
  <div id="app">
     <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      
    },
    data(){
      return {
        iMessage:false,
        cur_hash:''
      }
    },
    methods: {
      // 检测前端版本更新
      getHash() {
        
        // 在 js 中请求首页地址不会更新页面
        this.$http.get(`${window.location.protocol}//${window.location.host}/`).then(res=>{
          // console.log(res);
          // 返回的是字符串，需要转换为 html 
          let el = document.createElement('html')
          el.innerHTML = res
          
          let spt = el.getElementsByTagName('script')

          // 拿到 hash 
          let new_hash = ""
          for (let i = 0; i < spt; i++) {
            const element = spt[i];
            if(spt[i].src.indexOf('checkhash') !== -1){
              
              new_hash = spt[i].src.split('.')[1]
              break;
            }
          }

          if(!this.cur_hash){
            this.cur_hash = new_hash

            return
          }

          
          // // iMessage 是个全局变量（默认值 false），用来帮助判断什么时候会弹出提示，不然定时器5s就弹一次了
          if (new_hash != this.cur_hash && !this.iMessage) {
            // 版本更新，弹出提示
            this.iMessage = true
           
            const h = this.$createElement
            this.$message.info({
              message: h('span', null, [
                h('span', null, '当前版本已更新，请刷新后使用 '),
                h('a', {
                    on: {
                      click: function () {
                        window.location.reload()
                      }
                    }
                  }, '刷新页面')
              ]),
              
              duration: 0,
              showClose: true
            });
          }
        })
        
        
      }
    },
    mounted () {
      this.$store.state.app.maxTableHeight = window.innerHeight
      this.$store.state.app.maxTableWidth = window.innerWidth
      window.onresize = () => {
        return (() => {
          this.$store.state.app.maxTableHeight = window.innerHeight
          this.$store.state.app.maxTableWidth = window.innerWidth
        })()
      }
      if(sessionStorage.getItem('tagsViews')){
        this.$store.state.app.visitedViews = JSON.parse(sessionStorage.getItem('tagsViews'))
      }

      setInterval(()=>{
        this.getHash()
      },3000000)
    }
  }
</script> 

<style lang="scss">
  
  html {
    height: 100%;
  }

  body {
    height: 100%;
    overflow-y: hidden;
  }

  #app {
    height: 100%;
    width: 100%;
    background: #fff;
    
  }

  .gutter {
    // display: block!important;
    width: 17px!important;
    background-color: #ebf2fb !important;
    display: table-cell!important
  }
  /* body .el-table th.gutter{
    display: table-cell!important;
  }

  body .el-table colgroup.gutter{
    display: table-cell!important;
  } */
  
  @import './assets/css/font.css';
</style>
