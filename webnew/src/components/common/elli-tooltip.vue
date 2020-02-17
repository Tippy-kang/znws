<template>
  <div :style="{'width':width,'height': height,'position': 'relative'}">
      <pre class="kt-tooltip-input__hidden" style="position: fixed; left: -19800px;visibility: hidden;" :style="{'width':hiddenpreWidth + 'px'}">{{ value }}</pre>
    <div v-if="flag"
      ref="ellirow"
      class="elliText"
      @mouseenter="visibilityChange($event)"
      style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical"
      :style="{'-webkit-line-clamp':rows,'color':color}">
        <pre>{{ value }}</pre>
    </div>
    <el-tooltip :placement="placement" v-else popper-class="elliTip">
        <div slot="content">
          <pre>{{ value }}</pre>
        </div>
        <div @mouseenter="visibilityChange($event)"  class="elliText" style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical" :style="{'-webkit-line-clamp':rows}">
          <pre>{{ value }}</pre>
        </div>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        required: true
      },
      width: {
        type: String,
        default: '100%'
      },
      rows: {
        type: Number,
        default: 1
      },
      color: {
        type: String,
        required: false
      },
      placement: {
        type: String,
        default: 'top'
      },
      threeheight:{
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        flag: true,
        hiddenpreWidth:0 ,
        height: "100%"
      }
    },
    methods: {
      visibilityChange(event) {
        this.flag = true;
        let ev = event.target;

        
        this.hiddenpreWidth = ev.scrollWidth
        
        

        //12-7 隐藏pre的高度 显示pre的高度
        let hiddenpreHeight = $(ev).prev('.kt-tooltip-input__hidden')[0].offsetHeight
        let showpreHeight = ev.offsetHeight

       
        
        let thisWidth = ev.offsetWidth; // 元素的宽度
        let wordWidth = $(ev).prev('.kt-tooltip-input__hidden')[0].scrollWidth; // 文本内容的宽度

        let thisHeight = ev.children[0].offsetHeight; // 元素的宽度
        let wordHeight = $(ev).prev('.kt-tooltip-input__hidden')[0].scrollHeight; // 文本内容的宽度

        if(hiddenpreHeight > showpreHeight){
          this.flag = false
        }
        // if(this.threeheight!=3){
          
        //   // if(this.rows === 3){
        //   //   if(wordWidth / thisWidth > 2.68){
        //   //     this.flag = false;
        //   //   }
        //   // }else if (wordWidth / thisWidth > this.rows) {
        //   //   this.flag = false;
        //   // }
        //   if(hiddenpreHeight > showpreHeight){
        //     this.flag = false
        //   }

        // }else{
        //   if(hiddenpreHeight > showpreHeight){
        //     this.flag = false
        //   }
        //   // if(this.rows === 3){
        //   //   if(thisHeight / wordHeight > 2.78 || thisHeight / wordHeight==1){
        //   //     this.flag = false;
        //   //   }
        //   // }else if (thisHeight / wordHeight > this.rows) {
        //   //   this.flag = false;
        //   // }

        // }
        
      }
    },
    mounted () {
      // console.log("测试缓存23544");
      
      this.$nextTick(()=>{
        this.height =  23 + "px"
        let high 
        
       
        if(this.$refs.ellirow){
          setTimeout(() => {
            if(this.$refs.ellirow){
              if(this.$refs.ellirow.querySelector('pre').offsetHeight > this.rows * 23){
                high = this.rows * 23
              }else {
                high = this.$refs.ellirow.querySelector('pre').offsetHeight
              }

              if(high){
                this.height = high + "px"
              }
            }
          }, 200);
          
        }
        
      })
      
      
    }
    
  }
</script>

<style lang="scss">
// .elliTip{
//   max-width: 70%;
//   line-height: 18px;
// }
// pre{
//   white-space: pre-wrap;           /* css-3 */
//   white-space: -moz-pre-wrap;      /* Mozilla, since 1999 */
//   white-space: -pre-wrap;          /* Opera 4-6 */
//   white-space: -o-pre-wrap;        /* Opera 7 */
//   word-wrap: break-word;           /* Internet Explorer 5.5+ */
// }
.elliTip{
  max-width: 50%;
  line-height: 22px;
  max-height: 65%;
  // color: #000 !important;
  div:nth-child(1){
    // background: rgb(245,245,245);
    max-height: 200px;
    overflow: auto !important;
    // color: #000 !important;
  }
}
.el-tooltip__popper.is-dark{
  // background: rgb(245,245,245) !important;
  box-shadow:0px 0px 18px rgba(0,0,0,0.4);
  padding: 20px !important;
  // color: #000 !important;
}
.el-tooltip__popper .popper__arrow{
  border-width:0px !important;
  box-shadow: 8px 8px 8px 1px rgba(0,0,0,0.9)
}
.el-tooltip__popper .popper__arrow:after{
  // border-top-color: rgb(245,245,245) !important;
}
pre{
  white-space: pre-wrap;           /* css-3 */
  white-space: -moz-pre-wrap;      /* Mozilla, since 1999 */
  white-space: -pre-wrap;          /* Opera 4-6 */
  white-space: -o-pre-wrap;        /* Opera 7 */
  word-wrap: break-word;           /* Internet Explorer 5.5+ */
}

</style>

