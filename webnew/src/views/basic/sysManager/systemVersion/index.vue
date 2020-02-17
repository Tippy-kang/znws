<template>
  <div id="systemVersion" class="commonPadding">
    <div class="search-bar">
      <ul class="search-fl">
        <li>
          <el-button type="primary" size="medium" @click="addVersion('adds')" class="blueBtn"><i
              class="icon iconfont icon-xinzengicon"></i>新增</el-button>
        </li>
      </ul>
    </div>
    <el-table ref="multipleTable" :data="tableData" border stripe v-loading="scheduleLoading" :height="$store.state.app.maxTableHeight - 270"
      element-loading-text="系统正在获取数据" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.9)">
      <el-table-column type="index" width="70" label="序号" align="center">
      </el-table-column>
      <el-table-column label="版本号" prop="number" width="150">
      </el-table-column>
      <el-table-column label="状态" prop="statusName" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status?'success':'warning'">{{scope.row.status?'已发布':'暂存'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="createTime" width="200">
      </el-table-column>
      <el-table-column label="内容" prop="msg">
        <template slot-scope="scope">
          <elli-tooltip :rows="3" :value="scope.row.msg||''"></elli-tooltip>
          <!-- <div class="rowLine">
            <el-popover placement="right" :trigger="scope.row.msg.split('').length>51? 'hover' : 'manual'" :content="scope.row.msg" popper-class="tipClass"
              :visible-arrow="false">
              <span slot="reference">{{scope.row.msg}}</span>
            </el-popover>
          </div> -->
        </template>
      </el-table-column>
      <el-table-column prop="address5" label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="small" type="text" class="underlineBlue" :disabled="scope.row.status==1"
            @click="!(scope.row.status==1)&&addVersion('edits',scope.row)" style="color:#0841B4;">编辑
          </el-button>
          <el-button size="small" type="text" class="underlineRed" :disabled="scope.row.status==1"
            @click="!(scope.row.status==1)&&versiondelete(scope.row)" style="color:#FA5856;">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改版本 -->
    <el-dialog :title="titles" width="600px" :close-on-click-modal="false" v-dialogDrag v-if="versionDialog" :visible.sync="versionDialog"
      class="proupClass paddTop" @close='closeBtn'>
      <el-form :model="versionForm" :rules="versionFormMsg" ref="versionForm" label-width="100px">
        <el-form-item label="版本号：" prop="number">
          <el-input placeholder="请输入" v-model.trim="versionForm.number" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="版本信息：" prop="msg">
          <el-input type="textarea" autocomplete="off" rows="6" placeholder="请输入" v-model="versionForm.msg" maxlength="1000">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeBtn">取 消</el-button>
        <el-button class="proupzancun" :loading="btnLoading1" @click="versiondetailsTrue(0)">暂 存</el-button>
        <el-button class="proupbtnqueding" :loading="btnLoading2" type="primary" @click="versiondetailsTrue(1)">发 布
        </el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <footer>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :page-sizes="[30, 50, 100]" :page-size="searchForm.pageCount"
        :total="total" :current-page="searchForm.pageNum">
      </el-pagination>
    </footer>
  </div>
</template>
<script>
  import paginationMixin from '@/mixins/paginations.js'
  import {
    setTimeout
  } from 'timers';

  export default {
    mixins: [paginationMixin],
    data() {
      // var checkAge = (rule, value, callback) => {
      //   console.log(rule, value, callback);
        
      //   console.log(value == '' , value ==  null , value ==  undefined);
        
      //  if (!value) {
      //     return callback(new Error('年龄不能为空'));
      //   }
      // };
      return {
        searchForm: {
          pageCount: 30,
          pageNum: 1
        },
        total: 0,
        tableData: [],
        scheduleLoading: false,
        titles: '',
        versionDialog: false,
        versionForm: {
          number: "",
          status: "",
          msg: "",
          creatorId: "",
          id: ""
        },
        versionFormMsg: {
          number: [{
            required: true,
            message: '请填写版本号',
            trigger: 'blur'
          }],
          msg: [{
            required: true,
            validator(rule, value, callback){
              if (!value.trim()) {
                return callback(new Error('请填写版本信息'));
              }else{
                  callback();
              }
            }, 
            trigger: 'blur'
          }]
        },
        btnLoading1: false,
        btnLoading2: false
      }
    },
    mounted() {
      this.getTableItems()
    },
    methods: {
      addVersion(val, row) {
        if (val == 'adds') {
          this.versionForm = {
            number: "",
            status: "",
            msg: "",
            creatorId: "",
            id: ""
          }
          this.titles = "新增版本信息"
        } else if (val == "edits") {
          this.titles = "编辑版本信息";
          this.versionForm.number = row.number;
          this.versionForm.msg = row.msg;
          this.versionForm.id = row.id;
        }
        this.versionDialog = true
      },
      //查询表
      getTableItems() {
        let person = JSON.parse(sessionStorage.personal)
        let params = {
          id: person.id,
          pageNum: this.searchForm.pageNum,
          pageCount: this.searchForm.pageCount
        }
        this.scheduleLoading = true
        this.$http.postJSON('versionsMsg/select-VersionMsg1', params).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.total = res.data.totalCount;
            this.versionDialog = false;
          } else {
            this.message('error', res.message);
          }
          setTimeout(() => {
            this.scheduleLoading = false;
            this.btnLoading = false
          }, 500)

          //防止表格错位
          $('.commonPadding').css("padding","10px 26px")
          setTimeout(()=>{
            $('.commonPadding').css("padding","10px 25px")
          },200)
        })
      },
      //删除
      versiondelete(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: "whetherh",
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.$http.postJSON('versionsMsg/delete-VersionMsg', {
            id: row.id
          }).then(res => {
            if (res.code == 200) {
              this.message('success', res.message);
              this.getTableItems()
            } else {
              this.message('error', res.message);
            }
          })

        }).catch(() => {});
      },
      closeBtn() {
        this.$refs.versionForm.resetFields()
        this.versionDialog = false;
        this.btnLoading1 = false;
        this.btnLoading2 = false;
        this.versionForm = {
          number: "",
          status: "",
          msg: "",
          creatorId: "",
          id: ""
        }
      },
      //新增，编辑版本
      versiondetailsTrue(val) {
        let person = JSON.parse(sessionStorage.personal);
        let url
        if (this.titles == "新增版本信息") {
          url = 'versionsMsg/insert-versionsMsg'
          var paramsMsg = {
            number: this.versionForm.number,
            status: this.versionForm.status,
            msg: this.versionForm.msg.trim(),
            creatorId: person.id
          }
        } else if (this.titles == "编辑版本信息") {
          url = 'versionsMsg/update-VersionMsg'
          var paramsMsg = {
            id: this.versionForm.id,
            number: this.versionForm.number,
            status: this.versionForm.status,
            msg: this.versionForm.msg.trim(),
            creatorId: person.id
          }
        }
        if (val == 0) {
          paramsMsg.status = 0;
          this.btnLoading1 = true
          this.$http.postJSON(url, paramsMsg).then(res => {
            if (res.code == 200) {
              this.versionDialog = false;
              this.getTableItems()
            } else {
              this.message('error', res.message);
            }
            setTimeout(() => {
              this.btnLoading1 = false
            }, 500)
          })
        } else if (val == 1) {
          this.$refs.versionForm.validate((valid) => {
            if (valid) {
              paramsMsg.status = 1;
              this.$confirm('已发布的版本信息不可删除,确认发布?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: "whetherh",
                closeOnClickModal: false,
                type: 'warning'
              }).then(() => {
                this.btnLoading2 = true
                this.$http.postJSON(url, paramsMsg).then(res => {
                  if (res.code == 200) {
                    this.versionDialog = false;
                    this.getTableItems()
                  } else {
                    this.message('error', res.message);
                  }
                  setTimeout(() => {
                    this.btnLoading2 = false
                  }, 500)
                })
              }).catch(() => {});
            } else {
              this.focusAccord()
              return false;
            }
          });
        }
      }
    }
  }

</script>
<style lang="scss" scoped>
  #systemVersion {
    // padding:20px 32px 35px 31px;
  }

</style>
