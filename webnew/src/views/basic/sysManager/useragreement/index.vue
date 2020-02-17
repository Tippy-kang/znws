<template>
  <div class="userAgree" id="userAgree">
    <div class="title" >
      <span  class="colorRed">更新用户协议后，用户再登录时将重新确认。</span> 
      <el-button type="primary" class="normalBtn" @click="XieyiClick"><i class="icon iconfont icon-baocunicon"></i>保存</el-button>
    </div>
    <vue-editor useCustomImageHandler  :editorToolbar="customToolbar"
      v-model.trim="agreementContent">
    </vue-editor>
  </div>
</template>
<script>
  import {VueEditor,Quill} from "vue2-editor";
  import { addQuillTitle } from '@/assets/js/quill-title.js';
  var fonts = ['SimSun','LiSu', 'SimHei','Microsoft-YaHei','KaiTi','FangSong','Arial','Times-New-Roman','sans-serif'];
  var Font = Quill.import('formats/font');
  Font.whitelist = fonts; //将字体加入到白名单
  Quill.register(Font, true); 

  export default {
    components: {
      VueEditor
    },
    data () {
      return {
        agreementContent:"",
        agreementContentId:"",
        customToolbar: [ //文本编辑器
          [{font:fonts}],
          ['bold', 'italic', 'underline'],
          ['align',{ align: "center" },{ align: "right" },{ align: "justify" }],
          [{'color':[]}],
          [{'background':[]}],
          [{'size':[]}]
        ],
      }
    },
    mounted () {
      setTimeout(() => {
        addQuillTitle();
      }, 1000);

      this.selectXy()
    },
    methods: {
      selectXy(){
        this.$http.postJSON('xieyi/selectXieyi').then(res=>{
          if(res.code === 200){
            if(res.data){
              this.agreementContent = res.data[0].content
            }
          }else {
            this.message('error',res.message)
          }
        })
      },
      //协议保存
      XieyiClick(){
       this.$http.postJSON('xieyi/insertXieyi',{content: this.agreementContent}).then(res=>{
        if(res.code === 200){
          this.message('success',res.message)
          this.$nextTick(() => {
            this.selectXy()
          })
        }
       })
      },
    }
  }
</script>
<style scoped lang="scss">
  #userAgree{
    padding: 5px 10px;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin: 20px 0 20px;

      .colorRed {
        font-size: 16px;
        font-weight: bolder;
        color: red;
        padding-left: 10px;
        border-left: 4px solid #1960CB;
      }
    }
  }
  
</style>
