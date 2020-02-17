<template>
  <div class="home-page" id="home-page" :style="`height:${($store.state.app.maxTableHeight)}px;`">
    <div :class="routes.length>4?'mianShouye2':'mianShouye'">
      <!--<draggable class="box" @update="datadragEnd" :options="{animation:500}">-->
        <!--sortID是原本首页可以拖拽排序的现在暂时不排序了，需要的时候再去那边抄-->
        <!-- <div :span="6" v-if="pictureMsg['icon-tongxunluicon']" class="anniubox" :sortid="pictureMsg['icon-tongxunluicon'].id"
             draggable="true" @click="tiaozhuan(pictureMsg['icon-tongxunluicon'])">
          <div class="scaleClass scaleClass1" :style="(($store.state.app.maxTableHeight - 82)/3.25>$store.state.app.maxTableWidth/7.5)?`height:${$store.state.app.maxTableWidth/5.5}px;width:${$store.state.app.maxTableWidth/8.5}px;`:`height:${($store.state.app.maxTableHeight - 82)/2.3}px;width:${($store.state.app.maxTableHeight - 82)/3.25}px;`">
            <div class="iconTupian">
            </div>
          </div>
        </div>
      <div :span="6" v-if="pictureMsg['icon-yingyongzhongxinicon']" class="anniubox" :sortid="pictureMsg['icon-yingyongzhongxinicon'].id"
           draggable="true" @click="tiaozhuan(pictureMsg['icon-yingyongzhongxinicon'])">
        <div class="scaleClass scaleClass2" :style="(($store.state.app.maxTableHeight - 82)/3.25>$store.state.app.maxTableWidth/7.5)?`height:${$store.state.app.maxTableWidth/5.5}px;width:${$store.state.app.maxTableWidth/8.5}px;`:`height:${($store.state.app.maxTableHeight - 82)/2.3}px;width:${($store.state.app.maxTableHeight - 82)/3.25}px;`">
          <div class="iconTupian">
          </div>
        </div>
      </div>
      <div :span="6" v-if="pictureMsg['icon-jifenguanliicon']" class="anniubox" :sortid="pictureMsg['icon-jifenguanliicon'].id"
           draggable="true" @click="tiaozhuan(pictureMsg['icon-jifenguanliicon'])">
        <div class="scaleClass scaleClass3" :style="(($store.state.app.maxTableHeight - 82)/3.25>$store.state.app.maxTableWidth/7.5)?`height:${$store.state.app.maxTableWidth/5.5}px;width:${$store.state.app.maxTableWidth/8.5}px;`:`height:${($store.state.app.maxTableHeight - 82)/2.3}px;width:${($store.state.app.maxTableHeight - 82)/3.25}px;`">
          <div class="iconTupian">
          </div>
        </div>
      </div>
      <div :span="6" v-if="pictureMsg['icon-xitongguanliicon']" class="anniubox" :sortid="pictureMsg['icon-xitongguanliicon'].id"
           draggable="true" @click="tiaozhuan(pictureMsg['icon-xitongguanliicon'])">
        <div class="scaleClass scaleClass4" :style="(($store.state.app.maxTableHeight - 82)/3.25>$store.state.app.maxTableWidth/7.5)?`height:${$store.state.app.maxTableWidth/5.5}px;width:${$store.state.app.maxTableWidth/8.5}px;`:`height:${($store.state.app.maxTableHeight - 82)/2.3}px;width:${($store.state.app.maxTableHeight - 82)/3.25}px;`">
          <div class="iconTupian">
          </div>
        </div>
      </div> -->
      <!-- </draggable> -->



      <div :span="6" v-for="(item,index) in pictureMsg" v-if="item.mage" :key="index" class="anniubox" :sortid="item.id"
        draggable="true" @click="tiaozhuan(item)">
        <div class="scaleClass" :style="(($store.state.app.maxTableHeight - 82)/3.25>$store.state.app.maxTableWidth/7.5)?`height:${$store.state.app.maxTableWidth/5.8}px;width:${$store.state.app.maxTableWidth/8}px;`:`height:${($store.state.app.maxTableHeight - 82)/2.3}px;width:${($store.state.app.maxTableHeight - 82)/3.25}px;`">
          <img :src="item.mage" alt="图片已损坏">
          <div class="iconTupian">
          </div>
        </div>
      </div>
    </div>
    <!--<img src="@/assets/images/shouye/item/icon-jichuxinxiicon1.png" alt="">-->
    <!-- <div class="beizhuhaoD">苏ICP备17057854号　 版权所有：江苏省港口集团信息科技有限公司  Allright Reserved</div> -->
  </div>
</template>
<script>
  import topheader from "./common/header.vue"

  // import draggable from 'vuedraggable'//暂时不要拖拽

  export default {
    components: {
      topheader,
      // draggable
    },
    data() {
      return {
        jsmap:'',
        departParams: { //年度数组
          "niandu": "",
        },
        SeByBeexamedDep: {},
        SeByBeexamedDepList: [],
        pictureMsg:{},
        routes: JSON.parse(sessionStorage.getItem('PermissionRouter')),
        isShowFeedback:true
      }
    },
    mounted() {
      this.pictureMsg = {}
      for(let i=0;i<this.routes.length;i++) {
        if(this.routes[i].path=='/systemManager'){
          // this.routes[i].children=this.routes[i].children.filter(el=>{
          //   return el.path!='/feedback'
          // })
          if(this.routes[i].children.length==1&&this.routes[i].children[0].path=='/feedback'){
            this.isShowFeedback=false
          }else{
            this.isShowFeedback=true
          }
        }
        this.pictureMsg[this.routes[i].icon] = {
            children:this.routes[i].children,
            id:this.routes[i].id,
            path:this.routes[i].path,
            mage:this.routes[i].mage,
            isShow:1,
            valueNumber:'',
            isShowdot:'',
            flag:true
          }
      }
    },
    methods: {
      datadragEnd(){

      },
      tiaozhuan(item){
        let arr_temp = JSON.parse(sessionStorage.getItem('Resource'))

        if (item.children.length > 0) {
          if (item.children[0].children.length > 0) {
            sessionStorage.setItem('globalTypeId',JSON.stringify(arr_temp.filter(el=>el.parentId == item.children[0].children[0].id&&el.resourceType == 2)))
            this.$router.push(item.children[0].children[0].path)
          } else {
            sessionStorage.setItem('globalTypeId',JSON.stringify(arr_temp.filter(el=>el.parentId == item.children[0].id&&el.resourceType == 2)))
            this.$router.push(item.children[0].path)
          }
        } else {
          sessionStorage.setItem('globalTypeId',JSON.stringify(arr_temp.filter(el=>el.parentId == item.id&&el.resourceType == 2)))
          this.$router.push(item.path)
        }
      }

    },
    watch: {

    },
  }

</script>
<style lang="scss">
  #home-page {
    position: relative;
    width: 100%;
    min-width: 1080px;

    margin-top: -30px;
    box-sizing: border-box;
    // min-height: 900px;

    // overflow: hidden;
    background: url('../assets/images/home-Bg.png') no-repeat center;
    background-size: cover;
    background-color: #F0EFF2;
    display: flex;
    .mianShouye {
      width: 100%;
      // padding-top: 5%;
      padding-bottom: 5%;
      padding-left: 17%;
      padding-right: 17%;
      text-align: center;
      align-self: center;
    }
    .mianShouye2 {
      width: 100%;
      padding-left: 17%;
      padding-right: 17%;
      /*text-align: center;*/
      align-self: center;
    }
    .content {
      position: absolute;
      right: 150px;
      top: 105px;
      width: 30%;
      margin-bottom:30px;
      padding: 19px;

      background: #fff;
      border-radius: 5px;

      overflow: auto;
      .contentHeader {
        margin-bottom: 20px;
      }
    }

    .beizhuhaoD {
      position: absolute;
      bottom: 25px;
      width: 100%;
      text-align: center;
      font-size: 18px;
      color: #ffffff;
    }

    .anniubox {
      display: inline-block;
      width: 24%;
      text-align: center;
      /* padding-left: 3%; */
      padding-bottom: 20px;
      /*float: left;*/
      cursor: pointer;
      position: relative;
    }
    .anniubox img {
      width: 235px;
      /*height: 175px;*/
      background-size: cover;

      color: #fff;
    }

    .anniubox .scaleClass {
      margin: 0 auto;
      transition: all 0.2s;
      img{
        width: 100%;
        height: 100%;
      }
    }

    .anniubox .scaleClass:hover {
      transform: scale(1.1);
    }
    // .anniubox .scaleClass1 {
    //   width: 100%;
    //   height: 340px;
    //   background-image: url("../assets/images/shouye/item/icon-tongxunluicon.png");
    // }
    // .anniubox .scaleClass1:hover {
    //   background-image: url("../assets/images/shouye/item_hover/icon-jichuxinxiicon1.png");
    // }
    // .anniubox .scaleClass2 {
    //   width: 100%;
    //   height: 340px;
    //   background-image: url("../assets/images/shouye/item/icon-yingyongzhongxinicon.png");
    // }
    // .anniubox .scaleClass2:hover {
    //   background-image: url("../assets/images/shouye/item_hover/icon-zhibiaoguanliicon1.png");
    // }
    // .anniubox .scaleClass3 {
    //   width: 100%;
    //   height: 340px;
    //   background-image: url("../assets/images/shouye/item/icon-jifenguanliicon.png");
    // }
    // .anniubox .scaleClass3:hover {
    //   background-image: url("../assets/images/shouye/item_hover/icon-kaoheshishiicon.png");
    // }
    // .anniubox .scaleClass4 {
    //   width: 100%;
    //   height: 340px;
    //   background-image: url("../assets/images/shouye/item/icon-xitongguanliicon.png");
    // }
    // .anniubox .scaleClass4:hover {
    //   background-image: url("../assets/images/shouye/item_hover/icon-kaohejieguoicon.png");
    // }
    // .anniubox .scaleClass5 {
    //   width: 100%;
    //   height: 300px;
    //   background-image: url("../assets/images/shouye/item/icon-shujufenxiicon1.png");
    // }
    // .anniubox .scaleClass5:hover {
    //   background-image: url("../assets/images/shouye/item_hover/icon-shujufenxiicon1.png");
    // }
    // .anniubox .scaleClass6 {
    //   width: 100%;
    //   height: 300px;
    //   background-image: url("../assets/images/shouye/item/icon-tongzhidaibanicon1.png");
    // }
    // .anniubox .scaleClass6:hover {
    //   background-image: url("../assets/images/shouye/item_hover/icon-tongzhidaibanicon1.png");
    // }
    // .anniubox .scaleClass7 {
    //   width: 100%;
    //   height: 300px;
    //   background-image: url("../assets/images/shouye/item/icon-kaohezhikuicon.png");
    // }
    // .anniubox .scaleClass7:hover {
    //   background-image: url("../assets/images/shouye/item_hover/icon-kaohezhikuicon.png");
    // }
    // .anniubox .scaleClass8 {
    //   width: 100%;
    //   height: 300px;
    //   background-image: url("../assets/images/shouye/item/icon-xitongguanliicon.png");
    // }
    // .anniubox .scaleClass8:hover {
    //   background-image: url("../assets/images/shouye/item_hover/icon-xitongguanliicon.png");
    // }
  }

</style>
<style lang="scss">
  //小圆圈
  .anniubox {
    .el-badge__content {
      width: 25px !important;
      height: 25px !important;
      line-height: 25px !important;
      border-radius: 50% !important;
      padding: 0 !important;
      font-size: 16px !important;
    }
  }

</style>
