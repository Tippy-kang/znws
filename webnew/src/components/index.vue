<template>
  <div id="routerIndex">
    <topheader @refreshMenu='refreshMenu'></topheader>
    <div class="main" :style="`height:${$store.state.app.maxTableHeight - 64}px`">
      <el-container accordion="true">
        <el-aside class="elsidebar" :class="[ isCollapse ? 'elsidebar2' : 'elsidebar1' ]"  v-if="$route.path!='/index'">
          <sidebar @toggle="toggleMain" @refreshMenu='refreshMenu'></sidebar>
        </el-aside>
        <el-main class="scroll_bar" :class="[ isCollapse ? 'toggle-main2' : 'toggle-main1' ]">
          <div class="tagsViewAll"  v-if="$route.path!='/index'">
            <TagsView @refreshMenu='refreshMenu'></TagsView>
          </div>
          <div :id="$route.path!='/index'?'routerView':'shouye'" class="container"  :style="$route.path!='/index'?`height:${$store.state.app.maxTableHeight-134}px`:`height:${$store.state.app.maxTableHeight}px`" v-if="mainShow">
            <router-view></router-view>
          </div>

        </el-main>
      </el-container>
    </div>


  </div>
</template>

<script>
  import TagsView from './common/tagsView.vue';
  import topheader from "./common/header.vue"
  import sidebar from "./common/sidebar.vue"
  export default {
    components: {
      sidebar,
      TagsView,
      topheader
    },
    data() {
      return {
        mainShow: false,
        isCollapse: false,
        listcontens: [], //小喇叭
        listTotalCount: 0, //小喇叭条数
        listTotalCountUp: 0, //小喇叭上一条数据
        zhanwu: false,
        clickId: "", //小喇叭每条id
        routerView:'routerView',
        shouye:'shouye'
      }
    },
    mounted() {
      this.mainShow = true

    },
    methods: {
      toggleMain(e) {
        this.isCollapse = e
      },
      refreshMenu(val) {
        this.mainShow = false
        setTimeout(() => {
          this.mainShow = true
        }, 200)
      }

    },
    watch: {
      // $route(path) {
      //   if(path.fullPath !== "/404"){
      //     let menus = JSON.parse(sessionStorage.getItem('menuList'))

      //     let routeStatus = true
      //     menus.forEach(el=>{
      //       if(el.path === path.fullPath){
      //         routeStatus = false
      //       }
      //       //当跳转的页面 /docRetrieval 文件检索时，若有/software 考核智库权限可跳转
      //       if(path.path === "/docRetrieval" ||  path.path === "/Video"){
      //         if(el.path === "/software"){
      //           routeStatus = false
      //         }
      //       }

      //       if(path.path === "/notice" && el.path === "/notice"&& path.path === "/Video"){
      //         routeStatus = false
      //       }
      //     })

      //     // 当跳转的页面是工作台时，跳转
      //     if(path.fullPath === "/index"){
      //       routeStatus = false
      //     }
      //     if(routeStatus){
      //       this.$router.push("/404")
      //     }

      //     // console.log(this.$store.state.app.visitedViews);
      //     // console.log(path.path);

      //     // if(this.$store.state.app.visitedViews.filter(el=>{
      //     //   el.path.indexOf()
      //     // }))
      //     // this.refreshMenu()
      //   }
      //   // else {
      //   //   this.$router.go(-1)
      //   // }
      // }
    },
  }

</script>

<style lang="scss">
  #routerIndex {
    // min-width: 1350px;
    min-height: 100%;
    overflow: auto;
    /* background: url(../assets/images/bg3.png); */
    background: #EBF2FB;
    background-size: cover;

    .proupClass3 .el-dialog__header {
      background: transparent;
      border-bottom: 0;
      padding-top: 40px;
    }

    .proupClass3 .el-dialog__body {
      padding: 0;
    }

    .tagsViewAll {
      width: 100%;
      position: fixed;
      left: 0;
      top: 64px;
      z-index: 5;
      border-bottom: 1px solid #CDD7E1;
    }
    .elsidebar {
      position: relative;
      width: 210px !important;
    }
    .elsidebar2{
      margin-top: -3px;
      width: 65px !important;
    }
    .main {
      margin-top: 64px;
      position: relative;
      overflow: hidden;
      #routerView {
        background: #ffffff;
        min-height: 300px;
        margin:52px 16px 0px 16px;
        overflow: hidden;
        // padding:20px 32px 35px 31px;
        box-shadow: 0px 0px 43px rgba(159, 159, 159, .29);
      }
      #shouye{
        background: #ffffff;
        min-height: 300px;
        overflow: hidden;
        // padding:20px 32px 35px 31px;
        box-shadow: 0px 0px 43px rgba(159, 159, 159, .29);
      }

      .el-container {
        .aside::-webkit-scrollbar {
          display: none;
        }

        height: 100%;
        .aside {
          position: relative;
          left: 0;
          top: 0px;
          height: 100%;
          z-index: 66;
          background: url(../assets/images/zuocelan.png) 0 0 no-repeat;
          // background:#FFF;
          background-size: 100% 100%;
          -ms-scroll-chaining: chained;
          -ms-overflow-style: none;
          -ms-content-zooming: zoom;
          -ms-scroll-rails: none;
          -ms-content-zoom-limit-min: 100%;
          -ms-content-zoom-limit-max: 500%;
          -ms-scroll-snap-type: proximity;
          -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
          -ms-overflow-style: none;
          overflow: auto;
          box-shadow: 0px 0px 43px rgba(159, 159, 159, .29);

          b,
          i {
            /* color: #fff; */
          }

          b {
            font-size: 20px;
          }

          span,
          i:last-of-type {
            font-size: 14px;
          }

          .el-menu--collapse {
            width: 65px;
            height: 100%;
            margin-top: 25px;
          }

          .el-menu-vertical-demo:not(.el-menu--collapse) {
            min-width: 240px;
            min-height: 100%;
            /*padding-bottom: 130px;*/
          }

          .el-menu {
            border-right: none;
          }
        }

        .toggle-main1 {
          -webkit-transition: all .4s;
          -moz-transition: all .4s;
          -ms-transition: all .4s;
          -o-transition: all .4s;
          transition: all .4s;
          .tagsViewAll {
            width: 100%;
            position: fixed;
            left: 0;
            top: 64px;
            z-index: 5;
            border-bottom: 1px solid #CDD7E1;
            padding-left: 210px;
          }
        }
        .scroll_bar{
          overflow: hidden;
        }
        .toggle-main2 {
          -webkit-transition: all .4s;
          -moz-transition: all .4s;
          -ms-transition: all .4s;
          -o-transition: all .4s;
          transition: all .4s;
          .tagsViewAll {
            width: 100%;
            position: fixed;
            left: 0;
            top: 64px;
            z-index: 5;
            border-bottom: 1px solid #CDD7E1;
            padding-left: 58px;
          }
        }

        .hideSidebar {
          margin-left: 65px;
        }
      }

      .el-submenu__title>b {
        color: #fff !important;
        font-size: 18px !important;
        font-weight: 300;
      }
    }

    /* 小喇叭 */
    @keyframes trumpet {
      0% {
        transform: scale(1);
        /*开始为原始大小*/
      }

      25% {
        transform: scale(1.1);
        /*放大1.1倍*/
      }

      50% {
        transform: scale(1);
      }

      75% {
        transform: scale(1.1);
      }
    }

    @-webkit-keyframes trumpet {
      0% {
        transform: scale(1);
        /*开始为原始大小*/
      }

      25% {
        transform: scale(1.1);
        /*放大1.1倍*/
      }

      50% {
        transform: scale(1);
      }

      75% {
        transform: scale(1.1);
      }
    }

    .hornBoxTwinkle {
      animation: trumpet 1000ms infinite;
      -webkit-animation: trumpet 1000ms infinite;
      animation-timing-function: linear;
      /*动画的速度曲线*/
      -webkit-animation-timing-function: linear;
      /*动画的速度曲线*/
    }

    .hornBox {
      display: inline-block;
      position: fixed;
      right: 30px;
      bottom: 30px;
      z-index: 9999;
      cursor: pointer;
      width: 70px;
      height: 66px;

      .hornwraps {
        display: inline-block;
        overflow: inherit !important;
      }

      .hornpropbpx {
        padding-right: 0;
      }

    }

  }

  /* 小喇叭 */
  .hornContent {
    width: 360px;
    max-height: 310px;
    overflow: auto;

    .listcontens {
      line-height: 1.6;
      margin: 6px 0;
      padding-top: 6px;
      border-top: 1px solid #F2F5F9;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center
    }

    .listcontents {
      /* border: 1px solid red; */
      cursor: pointer;
    }

    .listcontens:nth-child(1) {
      border-top: 0px solid #F2F5F9;
    }

    .listicfonts {
      display: inline-block;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background: #46A0F9;
      color: #ffffff;
      border-radius: 50%;
      margin-right: 10px;
    }

    .mingziContent {
      background: #FFE6E6;
      color: #EE3B3B;
      font-size: 12px;
      border-radius: 3px;
      padding: 5px 5px;
      margin-right: 10px;
    }

    .topcontent {
      color: #333333;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 300px;
    }

  }

  .zhanwuxiaoxi {
    text-align: center;
    padding: 10px 0;
    color: #333333;
    font-size: 16px;
  }

  .hornBox {
    .el-badge__content.is-fixed {
      top: 13px;
      right: 22px;
    }

    .el-badge__content {
      background-color: #ff0000;
      border: none;
      font-size: 15px;
    }
  }
  .news-remind {
    bottom: 112px !important;
    box-shadow: 2px 2px 2px #999;
  }

  .news-remind2 {
    bottom: 112px !important;
    box-shadow: 2px 2px 2px #999;
    }
</style>
