<template>

  <div class="aside" id="isCollapse">
    <div class="asidebox aside_style" :style="!isCollapse&&{width:'210px'}">
      <el-menu :default-active="$route.fullPath" class="el-menu-demo" mode="vertical" :unique-opened="true" router
        menu-trigger="hover" :text-color="isCollapse?'#000':'#fff'" :collapse="isCollapse">
        <template v-for="item in routes" v-if="item.children.length == 0&&item.path!='/docRetrieval'&&item.path!='/Video'&&item.isShowFeedback">
          <el-menu-item class="el-menu-item1" :index="item.path" :key="item.path" :route="item"
            @click="clickMenu(item.id,item)" v-if="item.path!=='/index'">
            <!-- <b :class="item.icon"></b> -->
            <i class="icon iconfont" :class="setClass(item.icon)"></i>
            <span>{{item.label}}</span>
          </el-menu-item>
        </template>
        <template   v-else-if="item.children.length != 0&&item.path!='/docRetrieval'&&item.path!='/Video'">
          <!--有二级菜单标题-->
          <el-submenu :index="String(item.id)" class="nav-item">
            <!--二级菜单标题-->
            <template slot="title">
              <i class="icon iconfont" :class="setClass(item.icon)"></i>
              <span>{{item.label}}</span>
            </template>
            <template v-for="child in item.children" v-if="child.children.length == 0">
              <!--二级菜单-->
              <el-menu-item class="el-menu-item2" :index="child.path" :key="child.path" @click="clickMenu(child.id,child)">
                <span>{{child.label}}</span>
              </el-menu-item>
            </template>
            <template v-else>
              <!--有三级菜单-->
              <el-submenu class="el-menu-item21" :index="String(child.id)">
                <!--三级菜单标题-->
                <template slot="title">
                  <span>{{child.label}}</span>
                </template>
                <template v-for="last in child.children" v-if="last.children.length == 0">
                  <el-menu-item class="el-menu-item3" :index="last.path" :key="last.path" @click="clickMenu(last.id,last)">
                    {{last.label}}
                  </el-menu-item>
                </template>
                <template v-else>
                  <!-- 有四级菜单 -->
                  <el-submenu class="el-menu-item31" :index="String(last.id)">
                    <template slot="title">
                      <span>{{last.label}}</span>
                    </template>
                    <template v-for="end in last.children" v-if="end.children.length == 0">
                      <el-menu-item class="el-menu-item4" :index="end.path" :key="end.path" @click="clickMenu(end.id,end)">
                        {{end.label}}
                      </el-menu-item>
                    </template>
                    <template v-else>
                      <!-- 有五级菜单 -->
                      <el-submenu class="el-menu-item41" :index="String(end.id)">
                        <template slot="title">
                          <span>{{end.label}}</span>
                        </template>
                        <template v-for="fifth in end.children" v-if="fifth.children.length == 0">
                          <el-menu-item class="el-menu-item5" :index="fifth.path" :key="fifth.path"
                            @click="clickMenu(fifth.id,fifth)">
                            {{fifth.label}}
                          </el-menu-item>
                        </template>
                        <template v-else>
                          <!-- 有六级菜单 -->
                          <el-submenu class="el-menu-item51" :index="String(fifth.id)">
                            <template slot="title">
                              <span>{{fifth.label}}</span>
                            </template>
                            <el-menu-item class="el-menu-item6" v-for="six in fifth.children" :index="six.path"
                              :key="six.path" @click="clickMenu(six.id,six)">
                              {{six.label}}
                            </el-menu-item>
                          </el-submenu>
                        </template>
                      </el-submenu>
                    </template>
                  </el-submenu>
                </template>

              </el-submenu>
            </template>
          </el-submenu>
        </template>
        <div class="close-button">
          <el-tooltip class="item" effect="dark" content="点击打开" placement="right" v-if="isCollapse">
            <i class="el-icon-s-unfold unfold"  @click="toggleSlide"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="点击收起" placement="right" v-else>
            <i class="el-icon-s-fold fold"  @click="toggleSlide"></i>
          </el-tooltip>
        </div>
      </el-menu>
    </div>
  </div>
</template>
<script>
  export default {
    name: "index",
    data() {
      return {
        personal: {
          user: {
            name: ""
          }
        },
        activeItem: "",
        isCollapse: false,
        routes: JSON.parse(sessionStorage.PermissionRouter)
      }

    },
    methods: {
      onMenu() {
        // let roleaside = JSON.parse(sessionStorage.roleaside)
        // this.routes = roleaside
        // console.log(this.routes)
      },
      setClass(val) {
        return val
      },
      toggleSlide(){
        this.isCollapse = !this.isCollapse
        this.$emit('toggle',this.isCollapse)
      },
      clickMenu(val,item) {
        
        this.$emit('refreshMenu', val)
        
      }
    },
    // watch: {
    //   $route :{
    //     handler(newName, oldName) {
    //       this.activeItem = newName.fullPath
    //     },
    //     deep: true
    //   }
    // },
    created() {
      //初始化个人信息
      // this.routes = this.$router.options.routes
      // this.personal = JSON.parse(sessionStorage.personal)
      // this.onMenu()
    },
    mounted() {
      // console.log(this.$route);

      // this.activeItem = this.$route.fullPath
      // for(let i=0;i<this.routes.length;i++) {
      //   if(this.routes[i].path=='/systemManager'){
      //     this.routes[i].children=this.routes[i].children.filter(el=>{
      //       return el.path!='/feedback'
      //     })
      //     if(this.routes[i].children.length==0){
      //       this.routes[i].isShowFeedback=false
      //     }else{
      //       console.log(this.routes[i].children.length)
      //       this.routes[i].isShowFeedback=true
      //     }
      //   }
      // }
      this.routes.forEach(el=>{
        el.isShowFeedback=true
        if(el.path=='/systemManager'){
          el.children=el.children.filter(v=>{
            return v.path!='/feedback'
          })
          if(el.children.length==0){
            el.isShowFeedback=false
          }else{
            el.isShowFeedback=true
          }
        }
      })
    }
  }

</script>
<style lang='scss'>
#isCollapse{
  .asidebox{
    padding-top: 40px;
  }
  .asidebox>ul {
    display: inline-block;
  }
  .icon.iconfont {
    line-height: 19px;
    padding-left: 0 !important;
  }

  &.aside {
    .el-submenu__title{
      span{
        font-family: 'SimHei' !important;
      }
    }
    .nav-item {
      >.el-submenu__title {
        color: #fff !important;
        padding-left: 22px !important;
        font-weight: bold;
        height: 46px;
        line-height: 46px;
        span {
          font-size: $fSizelaster !important;
        }

        .iconfont {
          font-size: $fSizelaster !important;
          color: #fff;
          margin-right: 5px;
          font-weight: normal;
        }

        i {
          color: #fff;
        }

        &:hover {
          background: #0F6BC9 !important;
          color: #fff !important;
          i {
            color: #fff;
          }
        }
        .el-submenu__icon-arrow::before{
          content: "\e6d9";
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
      }

      &.is-opened {
        .el-menu-item,
        .el-menu-item2 .el-submenu__title {
          height: 40px;
          line-height: 40px;
          background: #F4F8FF;
          color: #666 !important;
        }
        .el-menu-item {
          &.is-active {
            color: #fff !important;
            background: #3987e1 !important;
          }
          &:hover{
            background: #3987e1;
            color: #fff !important;
            i {
              color: #fff;
            }
          }
        }
        .el-submenu__title {
          color: #fff !important;
          background: #0F6BC9;

          .iconfont {
            font-size: $fSizelaster !important;
            color: #fff;
            margin-right: 5px;
          }

          i {
            color: #fff;
          }
          .el-submenu__icon-arrow::before{
            content: "\e6d8";
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }

          &:hover {
            color: #fff !important;
            background: #3987e1 !important;
          }
        }
      }

      //二级不带children
      .el-menu-item2 {
        color: #666 !important;
        padding-left: 50px !important;
        background: #fff !important;
        span {
          font-size: $fSizelaster !important;
          font-family: 'SimHei' !important;
        }
        &.is-active,
        &:focus{
          background: #3987e1 !important;
          color: #fff !important;
        }
      }

      //二级带children
      .el-menu-item21 {
        color: #666 !important;
        .el-submenu__icon-arrow {
          left: 12px;
          margin-top: -5px;
          width: 14px;
          height: 14px;
        }

        .el-submenu__title {
          color: #333 !important;
          background: #FFF;
          padding-left: 50px !important;
          font-weight: normal;

          span {
            font-size: $fSizelaster !important;
            font-family: 'SimHei' !important;
          }

          i {
            color: #909399 !important;
          }
          .el-submenu__icon-arrow::before{
              content: "\e6d9";
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
          }

          &:hover {
            background: #3987e1 !important;
            color: #fff !important;

            i {
              color: #fff !important;
            }
          }
        }

        &.is-opened {
          .el-submenu__title {
            i {
              color: #909399 !important;
            }
            .el-submenu__icon-arrow::before{
                content: "\e6d8";
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }

            &:hover {
              background: #3987e1 !important;
              color: #fff !important;

              i {
                color: #fff !important;
              }
            }
          }
        }
        //三级带children
        .el-menu-item31{
          color: #666 !important;
          .el-submenu__icon-arrow {
            left: 26px;
            margin-top: -5px;
            width: 14px;
            height: 14px;
          }
          .el-submenu__title {
            color: #333 !important;
            background: #FFF;
            padding-left: 60px !important;
            font-weight: normal;

            span {
              font-size: $fSizelaster !important;
              font-family: 'SimHei' !important;
            }

            i {
              color: #909399 !important;
            }
            .el-submenu__icon-arrow::before{
                content: "\e6d9";
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }

            &:hover {
              background: #3987e1 !important;
              color: #fff !important;

              i {
                color: #fff !important;
              }
            }
          }

          &.is-opened {
            .el-submenu__title {
              i {
                color: #909399 !important;
              }
              .el-submenu__icon-arrow::before{
                  content: "\e6d8";
                  -webkit-transform: rotate(0deg);
                  transform: rotate(0deg);
              }

              &:hover {
                background: #3987e1 !important;
                color: #fff !important;

                i {
                  color: #fff !important;
                }
              }
            }
            .el-menu-item4{
              &:focus{
                background: #3987e1 !important;
                color: #fff !important;
              }
            }
            .el-menu-item4,
            .el-menu-item41 .el-submenu__title,
            .el-menu-item5,
            .el-menu-item51 .el-submenu__title,
            .el-menu-item6{
              background: #f5f5fb !important;
              &.is-active,
              &:focus{
                color: #fff !important;
                background: #3987e1 !important;
              }
            }
          }
            //四级带children
            .el-menu-item41{
              color: #666 !important;
              .el-submenu__icon-arrow {
                left: 36px;
                margin-top: -5px;
                width: 14px;
                height: 14px;
              }
              .el-submenu__title {
                color: #333 !important;
                background: #FFF;
                padding-left: 70px !important;
                font-weight: normal;

                span {
                  font-size: $fSizelaster !important;
                  font-family: 'SimHei' !important;
                }

                i {
                  color: #909399 !important;
                }
                .el-submenu__icon-arrow::before{
                    content: "\e6d9";
                    -webkit-transform: rotate(0deg);
                    transform: rotate(0deg);
                }

                &:hover {
                  background: #3987e1 !important;
                  color: #fff !important;

                  i {
                    color: #fff !important;
                  }
                }
              }

              &.is-opened {
                .el-submenu__title {
                  i {
                    color: #909399 !important;
                  }
                  .el-submenu__icon-arrow::before{
                      content: "\e6d8";
                      -webkit-transform: rotate(0deg);
                      transform: rotate(0deg);
                  }

                  &:hover {
                    background: #3987e1 !important;
                    color: #fff !important;

                    i {
                      color: #fff !important;
                    }
                  }
                }
                .el-menu-item5{
                  &:focus{
                    background: #3987e1 !important;
                    color: #fff !important;
                  }
                }
              }
              //五级带children
              .el-menu-item51{
                color: #666 !important;
                .el-submenu__icon-arrow {
                  left: 46px;
                  margin-top: -5px;
                  width: 14px;
                  height: 14px;
                }
                .el-submenu__title {
                  color: #333 !important;
                  background: #FFF;
                  padding-left: 80px !important;
                  font-weight: normal;

                  span {
                    font-size: $fSizelaster !important;
                    font-family: 'SimHei' !important;
                  }

                  i {
                    color: #909399 !important;
                  }
                  .el-submenu__icon-arrow::before{
                      content: "\e6d9";
                      -webkit-transform: rotate(0deg);
                      transform: rotate(0deg);
                  }

                  &:hover {
                    background: #3987e1 !important;
                    color: #fff !important;

                    i {
                      color: #fff !important;
                    }
                  }
                }

                &.is-opened {
                  .el-submenu__title {
                    i {
                      color: #909399 !important;
                    }
                    .el-submenu__icon-arrow::before{
                        content: "\e6d8";
                        -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }

                    &:hover {
                      background: #3987e1 !important;
                      color: #fff !important;

                      i {
                        color: #fff !important;
                      }
                    }
                  }
                  .el-menu-item6{
                    &:focus{
                      background: #3987e1 !important;
                      color: #fff !important;
                    }
                  }
                }
              }
              //五级不带children
              .el-menu-item5{
                color: #666 !important;
                font-size: $fSizelaster !important;
                font-family: 'SimHei' !important;
                padding-left: 80px !important;
                background: #fff;
                &:hover {
                  background: #3987e1 !important;
                  color: #fff !important;
                }
              }
            }
            //四级不带children
            .el-menu-item4{
              color: #666 !important;
              font-size: $fSizelaster !important;
              font-family: 'SimHei' !important;
              padding-left: 70px !important;
              background: #fff;
              &:hover {
                background: #3987e1 !important;
                color: #fff !important;
              }
            }
            //六级
            .el-menu-item6 {
              color: #666 !important;
              font-size: $fSizelaster !important;
              font-family: 'SimHei' !important;
              padding-left: 90px !important;
              background: #fff !important;
              &:hover {
                background: #3987e1 !important;
                color: #fff !important;
              }
            }
        }
      }

      //三级不带children
      .el-menu-item3 {
        color: #666 !important;
        font-size: $fSizelaster !important;
        font-family: 'SimHei' !important;
        padding-left: 60px !important;
        background: #fff !important;
        &:hover,
        &:focus {
          background: #3987e1 !important;
          color: #fff !important;
        }
        &.is-active{
          background: #3987e1 !important;
          color: #fff !important;
        }
      }

      .el-menu-item {
        &:hover {
          background: #3987e1 !important;
          color: #fff !important;
        }
      }
    }
    .el-menu-item{
      &.el-menu-item1{
        color: #fff !important;
        font-weight: bold;
        span{
          font-size: $fSizelaster !important;
          font-family: 'SimHei' !important;
        }
        .iconfont {
          font-size: $fSizelaster !important;
          color: #fff;
          margin-right: 5px;
          font-weight: normal;
        }
        &.is-active{
          color: #fff !important;
          background: #0F6BC9;
        }
      }
      &:hover{
        background: #3987e1 !important;
        color: #fff !important;
      }
    }
    .el-menu{
      background: transparent;
      width: 100%;
    }

  }
.close-button{
  background: #15B0E9;
  height: 40px;
  width: 100%;
  position: absolute;
  /*right: 0;*/
  top: -40px;
  /*bottom: 0;*/
  /*margin: auto 0;*/
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding-left: 22px !important;
  /*display: none;*/
}
  /*.close-button i {*/
  /*  */
  /*}*/
.aside:hover .close-button{
    display: inline-block;
  }
  .el-submenu__title span{
    font-size: 14px;
  }
  .el-menu-item{
    font-size: 14px;
  }
  .el-menu--vertical{
    left: 300px;
  }
  .el-menu--popup-right-start{
    width: 240px;
  }
  .unfold{
    font-size: 25px !important;
    line-height: 40px;
  }
  .fold{
    font-size: 25px !important;
    float:right;
    margin-top:7px;
    margin-right:20px;

  }
  .el-menu--collapse{
    .close-button{
      top: -62px;
    }
  }
}
</style>
