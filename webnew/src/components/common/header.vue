<template>
  <div id="header">
    <div class="header">
        <div class="headLeft">
          <img src="../../assets/images/logo.png" alt="logo" class="headLeft_logo">
        </div>
        <el-col  :lg="15" :xl="15" class="hidden-md-and-down" >
          <!-- <div class="headerMiddle" v-show="$route.path!='/index'">
            <sidebar @toggle="toggleMain" @refreshMenu='refreshMenu'></sidebar>
          </div> -->
        </el-col>
        <el-col :span="3">
          <div class="headright">
            <el-popover placement="bottom" trigger="hover" class="setting1" popper-class="head-popover">
              <div slot="reference" class="setting">
                <i class="iconfont icon-yonghuming usergeren"></i>{{personal.loginName}}
              </div>
              <p @click="xiugaimima2" class="shezhi">
                <i class="el-icon-lock"></i>
                重置密码</p>
              <p class="shezhi">
                <a :href="uri">
                  <i class="icon iconfont icon-xiazaicaozuoshouce"></i>
                  操作手册
                </a>
              </p>
               <p class="shezhi"  @click="videoRouter">
                <a>
                  <i class="el-icon-video-camera"></i>
                  操作视频
                </a>
              </p>
              <p class="shezhi" @click="feedbackRouter">
                <i class="icon iconfont icon-yijianfankui"></i>
                意见反馈
              </p>
              <p class="shezhi" @click="exit">
                <i class="icon iconfont icon-tuichuicon"></i>
                退出登录
              </p>
            </el-popover>
          </div>
        </el-col>
    </div>
    <div class="propup">

      <el-dialog title="修改密码" v-dialogDrag v-if="dialogVisibleMa" :visible.sync="dialogVisibleMa" width="500px" :close-on-press-escape="false" :show-close='false'	 :close-on-click-modal="false"
        class="proupClass" @close="quxiaoPass" :modal-append-to-body="false">

        <el-form :model="form" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="新密码：" prop="password1">
              <el-input v-model.trim="form.password1" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="password2">
              <el-input v-model.trim="form.password2" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="手机号：" prop="phonenum">
              <el-input v-model.trim="form.phonenum" autocomplete="off"></el-input>
            </el-form-item> -->
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="quxiaoPass" class="proupbtnquxiao">取 消</el-button>
          <el-button type="primary" @click="updataPass('ruleForm')" class="proupbtnqueding" :loading="btnProtect">确 定</el-button>
        </div>
      </el-dialog>

    </div>
    <el-dialog :title="titles" width="700px" :close-on-click-modal="false" v-dialogDrag v-if="versionDialog" :visible.sync="versionDialog"
      class="proupClass userClass" @close='closeBtn' :modal-append-to-body="false">
      <pre style="white-space: pre-wrap;word-wrap: break-word;">{{versionMsg.msg}}</pre>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnqueding" type="primary" @click="changeStatus">我知道了</el-button>
      </div>
    </el-dialog>
  </div>


</template>
<script>
  import {
    Encrypt
  } from '@/utils/cryptojs.js'
  import sidebar from "./sidebar.vue"

  export default {
    components:{sidebar},
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else {
          if (this.form.password2 !== '') {
            this.$refs.ruleForm.validateField('password2');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        personal: {
          user: {
            name: ""
          }
        },
        form: {
          password1:'',
          password2:'',
          phonenum:''
        },
        rules: {
          password1: [
            { validator: validatePass, trigger: 'blur' },
            {pattern:/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,}).{8,}$/,message:'密码必须包含大写字母，小写字母和数字，至少8个字符',trigger: 'blur'}
          ],
          password2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        },

        dialogVisibletuichu: false,
        roleData: {},
        routes: [],
        isCollapse: true,
        title: "综合考核信息管理系统",
        uri: '',
        selectUser: "lianxiren",
        clickRoute: {},
        limit: {
          limit: 9
          // peopleid:[]
        },
        dialogVisibleMa: false,
        btnProtect: false,
        versionDialog: false,
        versionForm: {},
        titles: "",
        versionMsg: {},
        mainShow: false,
        btnProtectUser:false
      }

    },
    methods: {
      //取消修改密码
      quxiaoPass() {
        this.$refs['ruleForm'].resetFields();
        let changeTip = JSON.parse(sessionStorage.getItem('changPasswordTip'))
        if(changeTip){
          this.$router.push({
                path: "/login"
              })
            sessionStorage.clear();
        }else{
          this.form = {}
          this.dialogVisibleMa = false
        }

      },
       //上传超出限制的钩子
      handleExceed(files, fileList) {
        this.message('warning', '当期限制最多上传四个文件包')
      },
      //修改密码
      xiugaimima2() {
        this.dialogVisibleMa = true
        this.getTel()
      },
      updataPass() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let id = JSON.parse(sessionStorage.personal).id
            let pwd = Encrypt(this.form.password1)
            let params = {
              id: id,
              loginPassword: pwd,
              phonenum:this.form.phonenum
            }
            this.btnProtect = true
            this.$confirm('确定修改密码并重新登陆？', '提示', {
              customClass: "userMangerDel",
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              customClass: "whetherh",
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              setTimeout(() => {
                this.btnProtect = false
              }, 400)
              this.$http.postJSON('user/update-password', params).then(res => {
                if (res.code === 200) {
                  this.$router.replace('/login')
                  sessionStorage.clear();
                }
              })
            }).catch(() => {
              setTimeout(() => {
                this.btnProtect = false
              }, 400)
            })
          }else{
            return false;
          }
        })

      },
      //退出事件
      exit() {
        this.$confirm('确认退出系统？', '提示', {
          customClass: "userMangerDel",
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: "whetherh",
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: "/login"
          })
        }).catch(() => {})
      },
      judgeIsModifyPass() {
        let obj = JSON.parse(sessionStorage.getItem('personal'))
        let nowTime = Date.parse(new Date())
        //修改密码周期圆圆
        let expireTime = obj.lastUpdPasswdTime ? (parseInt(obj.lastUpdPasswdTime) + parseInt(obj.modifyCycle * 24 * 60 * 60 * 1000)) :
          null
        if (!expireTime || nowTime > expireTime) {
          sessionStorage.setItem('changPasswordTip', 1)
          this.$confirm('您的密码长期未修改，可能存在隐患，是否进行修改 ？', '提示', {
            customClass: "userMangerDel",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: "whetherh",
            showClose:false,
            closeOnClickModal: false,
            closeOnPressEscape:false,
            type: 'warning'
          }).then(() => {
            this.dialogVisibleMa = true
            // sessionStorage.setItem('changPasswordTip', 1)
          }).catch(() => {
              this.$router.push({
                path: "/login"
              })
            sessionStorage.clear();
          })
        }
      },
      searchVersion() {
        let person = JSON.parse(sessionStorage.personal);
        this.$http.postJSON('versionsAlter/select-VersionsAlter', {
          userId: person.id
        }).then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.versionMsg = res.data;
              this.titles = `${this.versionMsg.number}` + "版本通知";
              this.versionDialog = true;
            }
          }
        })
      },
      closeBtn() {
        this.versionDialog = false;
      },
      changeStatus() {
        let person = JSON.parse(sessionStorage.personal);
        this.$http.postJSON('versionsAlter/update-VersionsAlter', {
          versionsId: person.id
        }).then(res => {
          this.versionDialog = false;
        })
      },
      toggleMain(e) {
        this.isCollapse = e
      },
      refreshMenu(val) {
        this.$emit('refreshMenu', val)
      },
      videoRouter(){
      //  let routes =  this.$router.resolve({path:'Video', name:"操作视频",})
        // window.open(routes.href);
        this.$router.push({path:'/Video'})
      },
      feedbackRouter(){
        this.$router.push({path:'/feedback'})
      },
      getTel(){
        let params = {
          id:JSON.parse(sessionStorage.personal).id
        }
        this.$http.postJSON('user/select-user',params).then(res=>{
          if(res.code==200){
            this.form.phonenum=res.data.phonenum
          }
        })

      } 
    },
    created() {
      //初始化个人信息
      this.personal = JSON.parse(sessionStorage.personal)
    },
    mounted() {
      this.uri = this.$http.baseHost + "shouce/江苏省委组织部综合考核信息管理系统用户操作手册.docx"
      this.judgeIsModifyPass();
      if (sessionStorage.firstLanding) {
        this.searchVersion();
        sessionStorage.removeItem("firstLanding")
      }
    }
  }

</script>

<style lang='scss'>
    #header {
       height: 64px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
      .header {
        font-size: $fSizesmall;
        background: url(../../assets/images/logobg.png) 0 0 no-repeat;
        background-size: 100% 100%;
        /* background-color: #0352b1; */
        display: flex;
        justify-content: space-between;

        .headLeft {
          margin-left: 20px;
          line-height: 64px;
          // width: 200px;

          .headLeft_logo {
            width: 100%;
            vertical-align: middle;
          }
        }

        .headright {
          height: 64px;
          overflow: hidden;
          line-height: 64px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          .usergeren{
            font-size: $fSizebase;
            margin-right: 5px;
          }

          .setting1 {
            padding-left: 10px;
            font-size: $fSizemini
          }

          .setting {
            // width: 100%;
            height: 26px;
            line-height: 26px;
            float: left;
            display: flex;
            cursor: pointer;
            color: #fff;
            text-align: center;
            overflow: inherit !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center;
            /*! autoprefixer: off */
            -webkit-line-clamp: 1;
            -webkit-box-orient: inherit !important;
            /*! autoprefixer: on */

            span {
              display: block;
              margin-left: 10px;
              height: 26px;
              line-height: 26px;
            }
          }

          .sx {
            position: absolute;
            width: 1px;
            height: 21px;
            top: 50px;
            left: 480px;
          }

          .exit {
            height: 25px;
            float: left;
            display: flex;
            cursor: pointer;
            text-align: center;
            display: flex;
            flex-direction: row;
            align-items: center;
            color: #fff;
          }

          .users {
            width: 200px;
            display: flex;
            justify-content: flex-start;
            float: right;
            margin-top: 35px;
            align-items: center;
            color: #FFFFFF;

            .iconfont {
              font-size: $fSizebase;
              margin-right: 12px;
            }
          }

          .back {
            width: 50%;
            display: flex;
            justify-content: flex-start;
            float: right;
            margin-top: 35px;
            align-items: center;
            color: #FFFFFF;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            /* border-right: 1px solid #4499F8; */
          }

          .backcurson {
            cursor: inherit !important;
          }
        }

        .headerMiddle {
          height: 64px;
        }
      }
    }

    .head-popover {
      padding: 10px 0 !important;

      &.el-popover {
        min-width: 121px;
      }

      .shezhi {
        font-size: $fSizelaster;
        color: #333 !important;
        cursor: pointer;
        padding: 0 20px;
        text-align: left;
        outline: none;
        line-height: 32px;
        // margin: 6px 0;

        .iconfont {
          // color: #999 !important;
          font-size: $fSizelaster !important;
          // font-weight: 700;
        }

        &:hover,
        &:active {
          background: #DCE7F7;
        }
      }
    }

</style>
