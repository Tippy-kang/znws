<template>
  <div id="model-box" class="commonPadding">
    <el-popover class="nav-jump" placement="left-start" width="200" trigger="hover">
      <ul class="nav">
        <li v-for="(items,index) in title" :key="index" @click="jumpToTitle(items.id)">{{items.label}}</li>
      </ul>
      <i class="el-icon-tickets" slot="reference"></i>
    </el-popover>
    <div class="config-form">
      <div class="allmodel"  :style="`height:${$store.state.app.maxTableHeight - 200}px`">
     
      <section id="config88">
        <div class="title">
          <span class="text">用户协议配置</span>
          <el-button type="primary" class="normalBtn" @click="XieyiClick"><i class="icon iconfont icon-baocunicon"></i>保存</el-button>
        </div>
        <div class="colorRed">更新用户协议后，用户再登录时将重新确认。</div>
        <vue-editor useCustomImageHandler  :editorToolbar="customToolbar"
          v-model.trim="agreementContent">
        </vue-editor>

      </section>
    </div>
    </div>



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
      addQuillTitle,
      VueEditor
    },
    //已用到8192
    data() {
      return {
        visible:true,
        settingTargetVisible:false,
        selectVisible:false,
        settingTargetFormRules:{},
        settingTargetForm:{
          showHeader:[],
          formula:"",
          isShuiping:'0'
        },
        settingTargetVisible2:false,
        settingTargetFormRules2:{},
        settingTargetForm2:{
          showHeader:[],
          formula:""
        },
        dctype:"",
        departtype:"",
        tempnddwmzcpblx:[],
        showHeaderList:[],
        showHeaderList2:[],
        beExamedList:[],
        beExamed:"",
        selected:[],
        title: [
          {
            id:'config88',
            label:'用户协议配置'
          },

        ],
        communityData:[],//设区市
        communityTitle:"",
        communityDialog:false,//市区市弹窗
        /**
         * 这个reserved2是前端用的字段，怕字段名改重前端先不动了。
         *
         * */
        communityForm:{
          depart:"",
          reserved2:"",
          typeRemark:"",
          dctype:""
        },
        saveLoading:false,
        saveLoading2:false,
        basic:{
          type:0,
          title:''
        },
        configuration:{
        },
        communityFormRules: {
        },
        type:'',
        niandu:'',
        editFlag:false,
        years:[],
        editTitle:'新增',
        customToolbar: [ //文本编辑器
          [{font:fonts}],
          ['bold', 'italic', 'underline'],
          ['align',{ align: "center" },{ align: "right" },{ align: "justify" }],
          [{'color':[]}],
          [{'background':[]}],
          [{'size':[]}]
        ],
        agreementContent:'',
        agreementContentId:'',
        mainUnitdutyLabel:[{dutyLabel:''}],
        selectOption2:[]
      }
    },
    created() {
    },
    mounted() {
      this.getYear()
      this.selectXy()
      setTimeout(() => {
        addQuillTitle();
      }, 1000);
    },
    methods: {
      selectXy(){
        let params = {
          typeId: "yhxy"
        }
        this.$http.postJSON('dictionary/selectPublicMethod',params).then(res=>{
          if(res.code === 200){
            this.agreementContentId = res.data[0].id
            this.agreementContent = res.data[0].typeDesc
          }
        })
      },
      // getBexamedList(){
      //   this.$http.postJSON('department2/selectBeexamedDepartmentByDictionaryMsg',{"niandu":this.niandu}).then(res=>{
      //     if(res.code === 200){
      //       this.beExamedList = res.data
      //     }else {
      //       this.beExamedList = []
      //     }
      //   })
      // },
      setTypeKey(val) {
        this.communityForm.typeName = this.configuration[11].data.filter(el=>el.typeId == val )[0].typeDesc
      },
      setdepartType(val){
        if(val){
          this.configuration[22].data = this.tempnddwmzcpblx.filter(el=>el.remark === val.typeId)
        }else {
          this.configuration[22].data = this.tempnddwmzcpblx.concat()
        }
        // this.communityForm.typeName = this.configuration[1].data.filter(el=>el.typeId == val )[0].typeDesc
      },
      setdepartType2(val){
        this.mainUnitdutyLabel.forEach((el)=>{
          el.dutyLabel = ''
        })
        if(val){
          this.selectOption2 = this.tempnddwmzcpblx.filter(el=>el.remark === val.typeId)
        }else {
          this.selectOption2 = this.tempnddwmzcpblx.concat()
        }
        // this.communityForm.typeName = this.configuration[1].data.filter(el=>el.typeId == val )[0].typeDesc
      },
      /**
       * 导航菜单
       */
      jumpToTitle(id) {



        $('.allmodel')[0].scrollTo({top:document.getElementById(id).offsetTop-65,behavior:"smooth" });
      },
      getYear(){
        this.$http.postJSON('dictionary/selectPublicMethod',this.configuration[8].search).then(res=>{
          if(res.code === 200){
            this.niandu = res.data[0].niandu
            this.years = res.data
            this.searchData(this.niandu)
            // this.getBexamedList()
          }
        })
      },
      changeCurrentYear(val){
        this.searchData(val)
        this.departtype = ""
        // this.getBexamedList()
      },
      searchData(year){
        for(let i in this.configuration){
          // console.log(this.configuration[i].search.typeId)
          if(!!this.configuration[i].search.typeId){
            if (i==15) {
              this.searchCommunity(i,'')
            } else {
              this.searchCommunity(i,year)
            }
          }
        }
      },
      searchCommunity(type,year){
        this.configuration[type].search.niandu = year||''

        if (type==15 || type==8 || type==21|| type == 24|| type==25|| type==26) {
          this.configuration[type].search.niandu = ''
        }

        // if(type==16){
        //   this.configuration[type].search.beexamedDepId = this.beExamed
        // }else
        if(type == 4){
          this.configuration[type].search.typeId = this.dctype?this.dctype.typeKey:'dcmc_'
        }
        this.$http.postJSON('dictionary/selectPublicMethod',this.configuration[type].search).then(res=>{
          if(res.code === 200){
            if(res.data){
              if(type == 8){
                this.$store.dispatch('changeYear', res.data)
              }

              if((type == 16 || type == 18 ||type==3 || type== 24|| type== 27)&&res.data&&res.data.length>0){
                res.data.forEach(el => {
                  if(el.typeDesc){
                    el.depart = JSON.parse(el.typeDesc).map(el=>el.label).join(',')
                  }else {
                    el.depart = ""
                  }

                  el.tabName = el.remark?el.remark:""

                })
              }

              if(type==22){
                res.data.forEach(el => {
                  el.departType = el.remark? el.typeName:""
                  el.typeName = el.remark? el.typeKey:""
                  el.typeKey = el.remark? el.departType:""
                  // el.typeName = el.remark? el.typeKey:""
                  // el.typeKey = ""
                  el.tableType = el.dcmcType?el.dcmcType:""
                  el.tableNum = el.typeDesc?el.typeDesc:""
                })

                this.tempnddwmzcpblx =  res.data.concat()
              }
              this.configuration[type].data = res.data
              if(type == 8&&year == ''){
                this.years = res.data
              }
            }else {
              this.configuration[type].data = []

              if(type==22){
                this.tempnddwmzcpblx =  []
              }
            }

          }else {
            this.message('error',res.message)
          }
        }).catch()
      },
      addCommunity(type,title){
        this.$nextTick(() => {
          try {
            this.$refs.communityForm.resetFields();
          } catch (e) {
          }
        })
        this.basic.title = title
        this.editTitle = '新增'
        this.basic.type = type
        if (type == 10||type == 12){
          this.basic.name = '设市区'
        }else {
          this.basic.name = title
        }

        if(type==4){
          // this.communityForm.reserved2 = this.dctype||''
          this.communityForm=Object.assign({},{reserved2:this.dctype||''}, this.communityForm)
        }
        if(type==3){
          this.communityForm=Object.assign({}, this.communityForm,{isShuiping:'0'})
          this.communityForm.isShuiping = this.communityForm.isShuiping.toString()
        }

        if(type==22){
          this.communityForm=Object.assign({},{departType:this.departtype||'',tableType:'',tableNum:''}, this.communityForm)
        }

        this.type = type
        this.editFlag = false
        this.communityDialog = true;
      },
      //协议保存
      XieyiClick(){
       let params = {
        id:this.agreementContentId,
        typeDesc: this.agreementContent,
        typeId: "yhxy"
       }
       this.$http.postJSON('dictionary/updatePublicMethod',params).then(res=>{
        if(res.code === 200){
          this.$http.postJSON('user/updateIsAgree').then(res=>{
            if(res.code === 200){
            }
          })
          this.agreementContentId = ''
          this.message('success',res.message)
          this.$nextTick(() => {
            this.selectXy()
          })
        }
       })
      },
      saveCommunity(){
        this.$refs['communityForm'].validate((valid) => {
          if (valid) {
            let url = this.editFlag?'dictionary/updatePublicMethod':'dictionary/insertPublicMethod'
            let param = Object.assign({},this.configuration[this.type].param,this.communityForm)
            if(this.type == 17){
              param.typeKey = this.communityForm.typeRemark
            }else if(this.type==4){
              param.dcmcType = this.communityForm.reserved2.typeName
              param.typeId = this.communityForm.reserved2.typeKey
              param.reserved2 = ""
            }else if(this.type == 16 || this.type == 18){
              param.remark = this.communityForm.tabName
            }else if(this.type == 22){
              param.remark = this.communityForm.departType
              // param.typeKey = this.configuration[1].data.filter(el=>el.typeId === this.communityForm.departType)[0].typeDesc
              param.typeKey  = this.communityForm.typeName
              param.typeName = this.configuration[1].data.filter(el=>el.typeId === this.communityForm.departType)[0].typeDesc
              param.dcmcType  = this.communityForm.tableType
              if (this.configuration[23].data.filter(el=>el.typeName === this.communityForm.tableType).length<1) {
                this.message('warning','请重新选择测评表类型。')
                return
              } else {
                param.typeDesc = this.configuration[23].data.filter(el=>el.typeName === this.communityForm.tableType)[0].typeKey
              }
            }else if(this.type == 23){
              param.typeKey  = this.communityForm.tableNum
            }else if(this.type == 25){
              param.typeKey  = this.communityForm.reserved2
              param.reserved2 = ""
            }else if(this.type == 26){
            param.typeKey  = this.communityForm.tixiRatio.id
            param.remark  = this.communityForm.tixiRatio.typeName
            param.typeName  = this.mainUnitdutyLabel.map((el)=>{return el.dutyLabel}).join(',')
              param.typeDesc  = this.communityForm.fenleiRatio
              param.dcmcType  = this.communityForm.departtype.id
              if(this.mainUnitdutyLabel.filter(el=>el.dutyLabel=='').length>0) {
                this.message('warning','不要留下空的测评对象。')
                return
              }
          } else if (this.type == 10) {
              if (param.typeId.substring(0,4) != 'khyh') {
                this.message('warning','考核用户typeId请以khyh开头。')
                return
              }
            }else if (this.type == 11) {
              if (param.typeId.substring(0,7) != 'b_khyh_') {
                this.message('warning','被考核用户typeId请以b_khyh_开头。')
                return
              }
            }else if (this.type == 12) {
              if (param.typeId.substring(0,3) != 'khz') {
                this.message('warning','考核组typeId请以khz开头。')
                return
              }
            }else if (this.type == 1) {
              if (param.typeId.substring(0,5) != 'jcxx_') {
                this.message('warning','单位信息typeId请以jcxx_开头。')
                return
              }
            }else if (this.type == 19) {
              param.typeKey  = this.communityForm.typeKey2
            }else if (this.type == 27) {

            }

            this.saveLoading = true

            this.$http.postJSON(url,param).then(res=>{
              if(res.code === 200){
                this.closeClick()
                this.searchCommunity(this.type,this.niandu)
                if(!!this.editFlag) {
                  this.message('success','编辑成功')
                }else{
                  this.message('success','新增成功')
                }
              } else {
                this.message('error',res.message)
              }
              setTimeout(()=>{
                this.saveLoading = false
              },500)
            }).catch()
          } else {
            this.focusAccord()
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      editCommunity(type,title,val){
        this.$nextTick(() => {
          try {
            this.$refs.communityForm.resetFields();
          } catch (e) {
          }
        })
        this.editTitle = '编辑'
        this.editFlag = true

        if(type == 16 ||type == 18||type == 3 || type == 24|| type == 27){
          if(val.typeDesc){
            val.depart = JSON.parse(val.typeDesc).map(el=>el.label).join(',')
          }else {
            val.depart = ""
          }

          //暂未完成
          val.tabName = val.remark?val.remark:""

        }

        if(type == 17){
          if(val.typeKey){
            val.typeRemark = val.typeKey
          }else {
            val.typeRemark = ""
          }
        }
        if(type == 22){
          if(val.remark){
            val.departType = val.remark
          }else {
            val.departType = ""
          }
        }
        if(type == 23){
          if(val.typeKey){
            val.tableNum = val.typeKey
          }else {
            val.tableNum = ""
          }
        }
        if(type == 25){
          if(val.typeKey){
            val.reserved2 = val.typeKey
          }else {
            val.reserved2 = ""
          }
        }
        if(type == 19){
          if(val.typeKey){
            val.typeKey2 = val.typeKey
          }else {
            val.typeKey2 = ""
          }
        }
        if(type == 26){
          val.fenleiRatio = val.typeDesc
          val.tixiRatio = this.configuration[25].data.filter(el=>el.id == val.typeKey)[0]
          val.departtype = this.configuration[1].data.filter(el=>el.id == val.dcmcType)[0]
          this.selectOption2 = this.tempnddwmzcpblx.filter(el=>el.remark === val.departtype.typeId)
          this.mainUnitdutyLabel = []
          let arr = val.typeName.split(",")
          arr.forEach(el=>{
            this.mainUnitdutyLabel.push({
              dutyLabel:el
            })
          })
        }
        this.communityForm = Object.assign({},val)
        // console.log(this.communityForm)

        this.basic.title = title
        this.basic.type = type
        if (type == 3) {
          this.communityForm.isShuiping = (this.communityForm.isShuiping&&this.communityForm.isShuiping.toString())||'0'
        }
        if (type == 10||type == 12){
          this.basic.name = '设市区'
        }

        else if(type == 8) {
          this.communityForm.niandu = this.communityForm.niandu.toString()
        }else{
          this.basic.name = title
        }

        if(type==4){
          this.communityForm.reserved2 = this.configuration[17].data.length?this.configuration[17].data.filter(el=>el.typeKey === val.typeId)[0]:''

        }
        this.type = type
        this.communityDialog = true;

      },
      deleteCommunity(type,val){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          customClass: "userMangerDel",
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: "whetherh",
          closeOnClickModal: false,
          type: 'warning',
        }).then(() => {
          let param = {
            id:val.id
          }
          this.$http.postJSON('dictionary/deletePublicMethod',param).then(res=>{
            if(res.code === 200){
              this.searchCommunity(type,this.niandu)
              this.message('success','删除成功')
            } else {
              this.message('error',res.message)
            }
          })}).catch(() => {})
      },
      settingCommunity(type,val){
        if(val.huizongTableHeader){
          this.settingTargetForm.showHeader = JSON.parse(val.huizongTableHeader).map(el=>el.name)
        }else {
          this.settingTargetForm.showHeader = []
        }
        this.settingTargetForm.id = val.id
        this.settingTargetForm.isShuiping = val.isShuiping?'1':'0'
        this.settingTargetForm.type = type
        this.$http.postJSON('kaoheHuizong/selectColByTypeKey',{"typeKey": val.typeKey}).then(res=>{
          if(res.code === 200){

            this.settingTargetVisible = true
            this.showHeaderList = res.data

            this.searchCommunity(type,this.niandu)
          } else {
            this.message('error',res.message)
          }
        })
      },
      settingTargetTrue(){
        let huizongTableHeader = JSON.stringify(this.showHeaderList.filter(el=>this.settingTargetForm.showHeader.indexOf(el.name)!== -1))
        this.saveLoading2 = true
        this.$http.postJSON('dictionary/updatePublicMethod',{"id":this.settingTargetForm.id,"huizongTableHeader": huizongTableHeader,isShuiping:this.settingTargetForm.isShuiping}).then(res=>{
          if(res.code === 200){
            this.searchCommunity(this.settingTargetForm.type,this.niandu)
            this.message('success',res.message)
            this.settingTargetVisible = false
          } else {
            this.message('error',res.message)
          }
          setTimeout(()=>{
            this.saveLoading2 = false
          },500)
        })
      },
      settingCommunity2(){
        this.settingTargetForm2.showHeader = []
        this.$http.postJSON('DanweiZonghe/selectDanweiRatingType').then(res=>{
          if(res.code === 200){

            this.settingTargetVisible2 = true
            this.showHeaderList2 = res.data
            if (this.communityForm.typeDesc) this.settingTargetForm2.showHeader = this.communityForm.typeDesc.split(",")
            // this.searchCommunity(type,this.niandu)
            let arr = []
            this.showHeaderList2.forEach((el)=>{
              this.settingTargetForm2.showHeader.forEach((vl)=>{
                if (el.name == vl) {
                  arr.push(vl)
                }
              })
            })
            this.settingTargetForm2.showHeader = arr
          } else {
            this.message('error',res.message)
          }
        })
      },
      settingTargetTrue2(){
        this.settingTargetVisible2 = false
        this.communityForm.typeDesc = this.settingTargetForm2.showHeader.join(',')
      },
      //所有页面的关闭
      closeClick(){
        this.communityDialog = false;
        this.communityForm = {}
        this.resetForm('communityForm')
      },
      closeSelect(){
        this.selectVisible = false
      },
      getDepart(val){
        if(this.basic.type == "24"){
          this.communityForm.typeDesc = JSON.stringify(val.map(el=>{
          return {
            departmentId:el.departmentId,
            departmentName:el.departmentName,
            id:el.id,
            label:el.loginName,
            loginName:el.loginName
          }
          }))
          this.communityForm.depart = val.map(el=>el.loginName).join(',')

        }else{
          this.communityForm.typeDesc = JSON.stringify(val.map(el=>{
          return {
            id:el.id,
            label:el.label
          }
          }))

          this.communityForm.depart = val.map(el=>el.label).join(',')
        }
      },
      addZhiji(){
        if (this.mainUnitdutyLabel.length>3) {
          this.message('warning','最多四条测评对象。')
        } else {
          this.mainUnitdutyLabel.push(
            {
              dutyLabel:''
            }
          );
        }


      },
      deleteZhiji(item) {
        var index = this.mainUnitdutyLabel.indexOf(item)
        if (index !== -1) {
          this.mainUnitdutyLabel.splice(index, 1)
        }
      },
      changemainUnitdutyLabel(val) {
        this.mainUnitdutyLabel = []
        if (val.typeKey == '不限制') {
          this.mainUnitdutyLabel.push({dutyLabel:''})
        } else {
           for (let i = 0;i<val.typeKey*1||0;i++) {
             this.mainUnitdutyLabel.push({dutyLabel:''})
           }
        }
      },
      test(val){
        // console.log(this.selectOption2,this.mainUnitdutyLabel)
        // this.selectOption2.filter(vl=>JSON.stringify( this.mainUnitdutyLabel).indexOf(vl.value)==-1)
        // console.log(val)
      }
    }
  }
</script>

<style scoped lang="scss">
  #model-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    position: relative;
    // padding:20px 32px 35px 31px;
    .beExamedparent {
      margin-bottom: 20px;
      .beExamedallocation.el-select {
        width: 200px;
      }
    }

    .search-bar{
      background: #fff;
    }

    .right {
      float: right;
    }

    .config-form {
      width: 100%;
      .parent-box{
        background: #fff;
        font-size: 18px;
        font-weight: bold;
        color: #2D2D2D;
        &:nth-last-of-type(1){
          padding-top: 30px;
        }
      }
      section {
        background: #FFFFFF;
        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin: 20px 0 20px;

          .text {
            font-size: 16px;
            font-weight: bolder;
            color: #2D2D2D;
            padding-left: 10px;
            border-left: 4px solid #1960CB;
          }
        }
      }
    }
    .colorRed{
      color: red;
      font-weight:100;
      font-size: 14px;
      padding-bottom: 10px;
    }
  }
</style>

<style lang="scss">
  .formulaPopover.el-popover .el-button {
    margin: 0;
    margin-right:10px ;
  }
  #model-box {
    .ql-editor{
      max-height: 350px;
      color: #000000;
    }
    border-radius: 10px;

    section {
      > .el-form {
        display: flex;
        flex-flow: row wrap;
        align-items: center;

        .el-form-item {
          flex: 0 0 50%;
        }
      }
    }


    .el-form-item__label {
      font-size: 16px;
      color: #333333;
    }

    .el-select {
      width: 100%;
    }

    .el-button--text {
      font-size: 16px;

      &.primary {
        color: #1960CB;
      }

      &.danger {
        color: #f00;
      }

      &.is-disabled, &.is-disabled:focus, &.is-disabled:hover {
        color: #c0c4cc;
        cursor: not-allowed;
        background-image: none;
        span {
          border-bottom: 1px solid #c0c4cc;
        }
      }
    }
    .allmodel{
      overflow-y: auto;
    }
  }

  .nav-jump {
    position: fixed;
    top: 140px;
    right: 40px;
    z-index: 99;
    background: rgba(255, 255, 255, 1);

    i {
      color: #4877E7;
      font-size:30px;
      font-weight: normal;
      cursor: pointer;
    }
  }

  .nav {
    background: #FFFFFF;

    li {
      cursor: pointer;
      margin-bottom: 5px;
      padding: 5px;
      border-radius: 3px;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        cursor: pointer;
        background: #eeeeee;
      }
    }
  }

  .el-tooltip__popper {
    max-width: 400px;
  }
</style>
