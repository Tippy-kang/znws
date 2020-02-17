<template>
    <div id="loginContainer">
      <div class="top-text">
        <img src="../assets/images/E.png">
        <p>工作生活新平台</p>
      </div>
    <div id="loginPage">
      <img src="../assets/images/leftBg.png" alt="" class="danghui">
      <div class="login_P">
        <p class="text">管理平台</p>
        <div class="login_wrap">
          <el-form :model="loginForm" status-icon ref="loginForm" :rules="loginRules" class="demo-ruleForm login_input">
            <el-form-item label="" prop="username">
              <el-input class="input-length" v-model.trim="loginForm.username" placeholder="请输入登录名"
                @keyup.enter.native="submitLogin('loginForm')"></el-input>
              <i class="iconfont icon-zhanghaoicon usergeren"></i>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input class="input-length" ref="input" type="password" v-model.trim="loginForm.password" placeholder="请输入登录密码"
                @keyup.enter.native="submitLogin('loginForm')"></el-input>
              <i class="iconfont icon-mimaicon usergeren"></i>
            </el-form-item>
            <el-form-item label="" class="VerificationCode" prop="createCodeS">
              <el-input v-model.trim="loginForm.createCodeS"></el-input>
              <el-button plain @click="createCode" id="createCodeText">验证码</el-button>
            </el-form-item>
            <el-form-item label="" class="VerificationCode" prop="sendCode">
              <el-input  v-model.trim="loginForm.sendCode" @keyup.enter.native="submitLogin('loginForm')"></el-input>
              <el-button plain @click="sendCode('loginForm')" id="send" v-if="!isCountDown">发送验证码</el-button>
              <el-button plain v-else disabled>({{CountDownNumber}}S)后重新发送</el-button>
            </el-form-item>
            <el-button type="text" class="pwd">忘记密码？</el-button>
            <el-form-item class="VerificationCode">
              <el-button type="primary" @click="submitLogin('loginForm')" class="longinBtn" :loading="buttonProtect">登 录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog title="用户协议" width="700px" :show-close="false" :close-on-press-escape="false"
        :close-on-click-modal="false" v-dialogDrag v-if="userDialog" :visible.sync="userDialog" class="proupClass">
        <div class="UserContent" v-html="UserContent">
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="userQuxiao" class="proupbtnquxiao">不同意</el-button>
          <el-button type="primary" @click="userQueding" class="proupbtnqueding">同 意</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="bot-box">
      <p class="bottom-text">苏ICP备17057854号　 版权所有：江苏省港口集团信息科技有限公司  Allright Reserved</p>
    </div>
    </div>
</template>

<script>
  import {
    Encrypt,
    Decrypt
  } from '@/utils/cryptojs.js'

  export default {
    data() {
      //账号密码验证
      var validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入登录名！"));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入登录密码！"));
        } else {
          callback();
        }
      };
      var validatecreateCodeS = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入验证码！"));
        } else if(this.code.toLowerCase() !== value.toLowerCase()) {
          callback(new Error("验证码输入不正确！"));
        } else {
          callback();
        }
      };
      var validatesendCode = (rule, value, callback) => {
        if(this.validaterule){
          callback();
        }else{
          if (!value) {
            callback(new Error("请输入验证码！"));
          } else if(Number(this.num) !== Number(value)) {
            callback(new Error("验证码输入不正确！"));
          } else {
            callback();
          }
        }
      };
      return {
        loginForm: {
          username: "",
          password: ""
        },
        loginRules: {
          username: [{
            validator: validateName,
            trigger: "blur"
          }],
          password: [{
            validator: validatePass,
            trigger: "blur"
          }],
          createCodeS: [{
            validator: validatecreateCodeS,
            trigger: "blur"
          }],
          sendCode: [{
            validator: validatesendCode,
            trigger: "blur"
          }]
        },
        
        buttonProtect: false,
        userDialog: false, //用户协议
        UserContent:'',
        CountDownNumber :60,//倒计时数字
        isCountDown : false,
        code : '',
        num : '' ,//手机验证码
        validaterule:false
      };
    },
    mounted() {},
    methods: {
      submitLogin(formName) {
        this.validaterule = false
        setTimeout(() => {
          this.buttonProtect = false
        }, 1000)
        this.$refs[formName].validate(valid => {
          if (valid) {
            let pwd = Encrypt(this.loginForm.password);
            if (!this.buttonProtect) {
              this.buttonProtect = true
              this.$http
                .postForm("login", {
                  username: this.loginForm.username,
                  password: pwd
                })
                .then(res => {
                  setTimeout(() => {
                    this.buttonProtect = false
                  }, 450)
                  if (res.code === 200) {
                    sessionStorage.setItem('refreshTime',res.data.refreshTime)
                    sessionStorage.setItem('publicKey',res.data.reserved1)
                    sessionStorage.setItem('encryptDebug',res.data.reserved2)
                    let userInfoData = res.data;
                    this.$store.state.app.visitedViews = [{
                      name: "首页",
                      path: "/index",
                    }]

                    this.$store.dispatch('setUserInfo', userInfoData)
                    userInfoData.headImgSvg = userInfoData.sex ?
                      `boy${Math.floor(Math.random() * 4 + 1)}` :
                      "girl";
                    sessionStorage.setItem(
                      "personal",
                      JSON.stringify(userInfoData)
                    );
                    sessionStorage.setItem("firstLanding", true)
                    //用户协议
                    this.userTan(res.data.isAgree)
                    
                    sessionStorage.setItem('globalTypeIdArray', JSON.stringify({}))

                  }
                }).catch(err => {
                  this.loginForm.password = '';
                  });
            }
          } else {
            return false;
          }
        });
      },
      /**
       * 用户协议字段
       */
       selectXy(){
        this.$http.postJSON('xieyi/selectXieyi').then(res=>{
          if(res.code === 200){
            this.userDialog = true
            this.UserContent = res.data[0].content
            
          }
        })
      },
      /**
       * 获取权限路由
       * @param val
       */
      getcebian(val) {
        let list = val.map(el => el.id);
        let getcebian = this.$http
          .postJSON("menu-resource/select-menu-resource-roles", {
            list
          })
          .then(res => {
            if (res.code === 200) {
              let roleaside = res.data.resourceTree.children;
              let resource = res.data.resources;
              sessionStorage.setItem("PermissionRouter", JSON.stringify(roleaside));
              sessionStorage.setItem("Resource", JSON.stringify(resource));
              let menuList = []

              this.searchTree(roleaside, menuList)

              sessionStorage.setItem("menuList", JSON.stringify(menuList));

              let flag = true
              menuList.forEach(item => {//三yuan管理代码
                if (item.path === '/logManager') {
                  this.$nextTick(() => {
                    this.$router.push(item.path);
                  });
                  flag = false
                }
              });
              if (flag) {
                this.$nextTick(() => {
                  this.$router.push("/index");
                });
              }
            } else {
              this.$message.error("获取用户权限失败");
            }
          });
      },
      searchTree(tree, arr) {
        for (let i = 0; i < tree.length; i++) {
          arr.push(tree[i])
          this.searchTree(tree[i].children, arr)
        }
      },
      
      //用户协议弹出
      userTan(val) {
        let isAgree = val
        if (isAgree !== 2) {
          this.selectXy()
        } else {
          this.getcebian(JSON.parse(sessionStorage.getItem('personal')).roles);
        }
      },
      //用户协议取消
      userQuxiao() {
        this.userDialog = false
      },
      //用户协议确定
      userQueding(val) {
        let params = {
          id: JSON.parse(sessionStorage.getItem('personal')).id,
          isAgree: 2
        }
        this.$http.postJSON('user/UserPeopleIsAgree', params).then(res => {
          if (res.code == 200) {
            this.userDialog = false
            this.getcebian(JSON.parse(sessionStorage.getItem('personal')).roles);
          }
        })

      },
      //发送验证码
      sendCode(code){
        this.validaterule = true
        this.$refs[code].validate((valid,i)=> {
          if (valid) {
            this.setTime()
            // this.isCountDown = true
            if(this.isCountDown){
              if(this.CountDownNumber == 0) {
                this.isCountDown = false
              }
              // this.num = Math.floor(Math.random()*10000);
              this.num =  Math.floor(Math.random()*9000)+1000;
              this.$alert(this.num, '验证码', {
                confirmButtonText: '确定',
              });
            }
          }else{
            return false;
          }
        });
      },
     setTime() {
      if (this.CountDownNumber == 0) {
        this.isCountDown = false
          // $('#send').text("发送验证码");
          this.CountDownNumber = 60;//60秒过后button上的文字初始化,计时器初始化;
          return;
      } else {
          this.isCountDown = true
          // $('#send').text("("+this.CountDownNumber+"s)后重新发送") ;
          this.CountDownNumber--;
      }
      setTimeout(() => {this.setTime()}, 1000)//每1000毫秒执行一次
    },
    createCode() { //创建验证码函数
      this.code = "";
      var codeLength = 4;//验证码的长度
      var selectChar = new Array( 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B',
        'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//所有候选组成验证码的字符，当然也可以用中文的
      for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 35);
        this.code += selectChar[charIndex];
      }
      $('#createCodeText').text(this.code)
      $('#createCodeText').css({
        "color": "red",
        "letterSpacing": "5px",
        "padding-left": "5px",
        "fontFamily": "黑体",
      })
    },
    },

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
   #loginPage {
    //  display: flex;
    .UserContent{
      color: #000000;
      p{
        line-height: 1.9;
      }
    }
   }
  #loginContainer{
    height: 100%;
    width: 100%;
  }
  @media screen and (min-width: 1400px) {
    #loginContainer{
    .bottom-text{
      text-align: center;
      font-size:14px;
      font-family:PingFang SC;
      color:rgba(0,0,0,1);
    }
    .bot-box{
      margin-top:-25px;
      // height: 60px;
    }
    .top-text{
        margin-left:3%;
        display: flex;
        align-items: center;
        padding:10px 0;
        height:60px;
        white-space:nowrap;
        img{
          margin-right:25px;
          height: 38px;
          width: 38px;
        }
        p{
          font-size:22px;
          font-family:PingFang SC;
          color:rgba(0,0,0,1);
          font-weight: bold
        }
      }
    #loginPage {
      margin-bottom:40px;
      height: 90%;
      width: 100%;
      background-image: url("../assets/images/loginBg.png");
      background-size: cover;
      min-width: 1000px;
      min-height: 600px;
      display: flex;
      flex-direction: column;
      position: relative;

      .demo-ruleForm {
        .el-input input {
          height: 52px;
        }

        .usergeren {
          top: 9px;
        }
      }

      .longinBtn {
        background: rgba(50,100,199,1);
        span {
          font-size: $fSizebase;
          font-family:PingFang SC;
          color:rgba(255,255,255,1);
        }
      }

      .login_box {
        .el-input__inner {
          padding-left: 60px;
          font-size: 16px;
          height: 52px !important;
          line-height: 52px !important;
        }
      }

      .el-button.longinBtn.el-button--primary {
        height: 54px !important;
        border-radius: 6px;
      }

      .remember-password-checkbox {
        font-size: 14px;
        color: #fff;
        vertical-align: top;
      }

      .login_input {
        width: 100%;

        .el-input {
          .el-input__inner {
            height: 46px; 
          }
        }
        .input-length{
            .el-input__inner {
              width: 350px;
              padding-left: 54px !important;
              color:rgba(153,153,153,1);
            }
        }
        .VerificationCode{
            width: 350px;
            .el-form-item__content{
              display: flex;
              .el-input:nth-child(1){
                flex:6;
                margin-right:10px;
              }
              .el-button{
                flex:3;
                font-size: 14px !important;
                color:#ccc;
                font-family:PingFang SC;
                padding: 12px 5px !important;
              }
            }
          }
      }

      .login_wrap {
        height: 448px;
        width: 100%;
        padding: 60px 45px 50px;
        background: rgba(255, 255, 255, .5);
        border-radius: 5px;
      }
      .login_P{
        position: absolute;
        left: 60%;
        top: 20%;
        .text{
          font-size:32px;
          font-family:PingFang SC;
          padding-bottom: 20px;
          color:rgba(255,255,255,1);
        }
      }
      el-form-item {
        margin-bottom: 28px;
      }

      .ueselogin {
        font-size: 25px;
        color: #0058B9;
        text-align: left;
        padding: 30px 0 15px 0;
      }

      .longinBtn {
        width: 100%;
        margin-top: 15px;
        font-size: 18px;
        // background: url("../assets/images/loginBtn.png") no-repeat;
        // background-size: 100% 100%;
        background: rgba(50,100,199,1);
        border: 0;
        padding: 0
      }
      .pwd{
        font-size:14px;
        font-family:PingFang SC;
        color:rgba(102,102,102,1);
      }
      .usergeren {
        position: absolute;
        /* top: 3px; */
        left: 18px;
        font-size: 19px;
      }
      
      #header {
        width: 100%;
        height: 100%;
      }

      .danghui {
        width: 40%;
        // margin: 14vh auto 8vh;
        align-self: center;
        position: absolute;
        top:15%;
        left:8%;
      }

      .beizhuhaoD,
      .beizhuhaoD1 {
        position: absolute;
        bottom: 25px;
        width: 100%;
        text-align: center;
        font-size: 18px;
        color: white;
      }
      input::placeholder {
        color:#ccc;
        font-size: 14px;
        font-family:PingFang SC;
      }
    }
  }
  }
  @media screen and (max-width: 1400px) {
    #loginContainer{
    .bottom-text{
      // margin-top: 22%;
      text-align: center;
      font-size:14px;
      font-family:PingFang SC;
      color:rgba(0,0,0,1);
    }
    .bot-box{
      margin-top: 10px;
      height:50px;
    }
    .top-text{
        margin-left:4%;
        display: flex;
        align-items: center;
        padding: 10px 0;
        height: 45px;
        white-space:nowrap;
        img{
          margin-right:1%;
          width:30px;
          height:30px;
        }
        p{
          font-size:120%;
          font-family:PingFang SC;
          color:rgba(0,0,0,1);
          font-weight:bold;
        }
      }
    #loginPage {
      // margin-bottom: 60px;
      height: 88%;
      width: 100%;
      background-image: url("../assets/images/loginBg.png");
      background-size: cover;
      min-width: 1000px;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      position: relative;

      .login_box {
        .el-input__inner {
          padding-left: 60px;
          font-size: 14px;
          height: 52px !important;
          line-height: 52px !important;
        }
      }

      .el-button.longinBtn.el-button--primary {
        height: 40px !important;
        border-radius: 6px;
      }

      .remember-password-checkbox {
        font-size: 12px;
        color: #fff;
        vertical-align: top;
      }

      .login_input {
        width: 100%;

        .el-input {
          .el-input__inner {
            height:40px;
          }

        }
        .input-length{
            .el-input__inner {
              width: 330px;
              padding-left: 34px !important;
            }
        }
        .VerificationCode{
          width: 330px;
          .el-form-item__content{
            display: flex;
            .el-input:nth-child(1){
              flex:6;
              margin-right:10px;
            }
            .el-button{
              flex:3;
              font-size: 14px !important;
              color:#ccc;
              font-family:PingFang SC;
              padding: 12px 5px !important;
            }
          }
        }
      }

      .login_wrap {
        width:100%;
        padding: 20px 25px 30px;
        background: rgba(255, 255, 255, .5);
        border-radius: 5px;
      }
      .login_P{
        position: absolute;
        left: 60%;
        top: 10%;
        .text{
          font-size:32px;
          font-family:PingFang SC;
          padding-bottom: 20px;
          color:rgba(255,255,255,1);
        }
      }
      el-form-item {
        margin-bottom: 28px;
      }

      .ueselogin {
        font-size: 23px;
        color: #0058B9;
        text-align: left;
        padding: 30px 0 15px 0;
      }

      .longinBtn {
        width: 100%;
        margin-top: 10px;
        font-size: 14px !important;
        // background: url("../assets/images/loginBtn.png") no-repeat;
        // background-size: 100% 100%;
        background: rgba(50,100,199,1);
        color: #fff !important;
        font-size: $fSizebase;
        font-family:PingFang SC;
        border: 0;
        padding: 0
      }
      .pwd{
        font-size:14px;
        font-family:PingFang SC;
        color:rgba(102,102,102,1);
      }
      .usergeren {
        position: absolute;
        top: 3px;
        left: 11px;
        font-size: 17px;
      }
      .top-text{
        margin-left:3%;
        margin-top:-4%;
        line-height: 40px;
        height: 40px;
        display: flex;
        img{
          margin-right:1%;
          width:40px;
          height:40px;
        }
        p{
          font-size:26px;
          font-family:PingFang SC;
          color:rgba(0,0,0,1);
        }
      }
      #header {
        width: 100%;
        height: 100%;
      }

      .danghui {
        width: 50%;
        align-self: center;
        position: absolute;
        top:0;
        left:2%;
      }

      .beizhuhaoD,
      .beizhuhaoD1 {
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
        font-size: 14px;
        color: white;
      }
      input::placeholder {
        color: #ccc;
        font-size: 14px;
        font-family:PingFang SC;
      }
    }
  }
  }
</style>
