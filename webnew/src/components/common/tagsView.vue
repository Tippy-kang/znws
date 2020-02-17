<template>
    <div @click="show = false" @contextmenu="closeMenu">
      <ScrollPanel class="tagView" ref='scrollPane'>
        
        <el-tag ref='item' v-for="(item,index) in visitedViews" :to="item.path" :key="item.path"
          :type="isActive(item) ? 'danger' : 'default'" @close="handleClose(item)"
          :closable="item.path == '/index'?false:true" v-if="item.path!='/homePage'">
          <svg style="vertical-align: sub;margin-right: -5px;" v-if="item.path == '/index'?true:false" class="icon"
            aria-hidden="true">
            <use xlink:href="#icon-shouye1"></use>
          </svg>
          <span class="tag_span" @click="skipPage(item)" @contextmenu="openMenu(item,index)">
            {{item.name}}
          </span>
        </el-tag>
        
      </ScrollPanel>
      <RightMenu :startX="rightMenuX + 'px'" :startY="rightMenuY + 'px'" :list="lists" :show="show"
        @clickOperate="clickEvent"></RightMenu>
    </div>
  </template>
  
  <script>
    import RightMenu from './rightMenu.vue'
    import ScrollPanel from './scrollPanel.vue'
  
    export default {
      components: {
        RightMenu,
        ScrollPanel
      },
      data() {
        return {
          rightMenuX: 0,
          rightMenuY: 0,
          show: false,
          lists: [],
          index: '',
        }
      },
      computed: {
        visitedViews() {
          return this.$store.state.app.visitedViews;
        },
        menuStatus() {
          return this.$store.state.app.menuStatus;
        }
      },
      mounted() {
        this.addViewTags();
        

        
      },
      watch: {
        $route() {
          this.addViewTags();
          this.moveToCurrentTag();
        },
        menuStatus(val) {
          this.show = val;
        }
      },
      methods: {
        searchTree(list, route) {
          for (let i = 0; i < list.length; i++) {
            if (route.path === list[i].path) {
              route.name = list[i].label
              if (list.filter(el => el.label === list[i].label).length > 1) {
                route.name = list.filter(el => el.id === Number(list[i].parent_id))[0].label + '-' + list[i].label
                route.pid = list[i].id
              }
  
              return route
            } else {
  
            }
          }
  
        },
        //已到当前tag
        moveToCurrentTag() {
          const items = this.$refs.item;
          this.$nextTick(() => {
            for (const tag of items) {
              if (tag.$attrs.to === this.$route.fullPath) { 
                this.$refs.scrollPane.moveToTarget(tag.$el);
                break;
              }
            }
          })
        },
        addViewTags() {
          let route = this.generateRoute()
  
          if (this.$route.path == "/404") {
            return false;
          }
          if (!route) {
            return false;
          }
  
          let menuList = JSON.parse(sessionStorage.getItem("menuList"))
  
          let tagItem = {
            name: route.name,
            path: route.fullPath,
          }
  
          this.searchTree(menuList, tagItem)
  
          this.$store.dispatch('addVisitedViews', tagItem);
        },
  
        generateRoute() {
          if (this.$route.name) {
            return this.$route;
          }
          return false;
        },
        skipPage(item) {
          if(item.path !== this.$route.fullPath){
            this.$router.push(item.path);
          }
          
          this.$emit('refreshMenu')
        },
        handleClose(view) {
          this.$store.dispatch('delVisitedViews', view).then((views) => {
            if (this.isActive(view)) {
              const latestView = views.slice(-1)[0];
              if (latestView) {
                this.$router.push(latestView.path);
              }
            }
          })
        },
        isActive(route) {
          return route.path === this.$route.fullPath
        },
        openMenu(item, index) {
          this.$store.dispatch('openMenu');
          this.index = index;
          this.item = item;
          if (this.visitedViews.length < 2) {
  
          } else if (this.visitedViews.length > 1 && index === this.visitedViews.length - 1) {
            this.lists = [{
                clickIndex: 'other',
                label: '关闭其他标签页',
              },
              {
                clickIndex: 'left',
                label: '关闭左侧标签页',
              }
            ];
            this.contextMenuParam(event);
          } else if (this.visitedViews.length > 1 && (index === 0 || index === 1)) {
            this.lists = [{
                clickIndex: 'other',
                label: '关闭其他标签页',
              },
              {
                clickIndex: 'right',
                label: '关闭右侧标签页',
              },
            ];
            this.contextMenuParam(event);
          } else {
            this.lists = [{
                clickIndex: 'other',
                label: '关闭其他标签页',
              },
              {
                clickIndex: 'left',
                label: '关闭左侧标签页',
              },
              {
                clickIndex: 'right',
                label: '关闭右侧标签页',
              },
            ];
            this.contextMenuParam(event);
          }

          document.body.onclick = this.closeMenu
        },
        // 关闭标签
        clickEvent(index) {
          switch (index) {
            case 'other':
              this.$store.dispatch('closeALLVisited', this.index);
              this.$router.push(this.item.path);
              break;
            case 'left':
              this.$store.dispatch('closeLeftVisited', this.index);
              break;
            case 'right':
              this.$store.dispatch('closeRightVisited', this.index);
              break;
          }
        },
        //关闭右键菜单
        closeMenu() {
          this.show = false;
        },
        //右键参数
        contextMenuParam(event) {
          let e = event || window.event;
          this.show = false;
          this.rightMenuX = e.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
          this.rightMenuY = e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop - 82;
          event.preventDefault();
          event.stopPropagation();
          this.$nextTick(() => {
            this.show = true;
          })
        }
      }
    }
  

</script>
<style lang="scss">
    .tagView {
      max-height: 54px;
      overflow-x: hidden;
      overflow-y: hidden;
      display: flex;

      .el-tag {
        cursor: pointer;
        height: 34px;
        line-height: 34px;
        border-radius: 0;
        padding: 0 15px;

        .tag_span {
          font-size: 14px;
          display: inline-block;
          padding: 0 8px;
        }
      }

      .el-tag--default {
        background-color: #fff;
        color: #666;
        border: none;
        border-right: 1px solid #EEEEEE;

        .el-tag__close {
          font-size: 14px;
          color: #999;

          &:hover {
            background: #d3d5d6;
            color: #fff;
          }
        }
      }

      .el-tag--danger {
        background-color: #e6ebef;
        color: #333;
        border: none;
        border-right: 1px solid #EEEEEE;

        .el-tag__close {
          font-size: 14px;
          color: #999;

          &:hover {
            background: #d3d5d6;
            color: #fff;
          }
        }
  
        .rightLeft {
          float: right;
        }
      }
    }
</style>
