<template>
  <div class="wrapper root-manage commonPadding" id="root-manage">
    <div class="search-bar">
      <ul class="search-fl">
        <li class="search-msg">
          <span class="liText">角色名称：</span>
          <el-input v-model.trim="searchParams.name" size="small" clearable placeholder="请输入"
            @keyup.enter.native="search" class="roleText"></el-input>
        </li>
        <li>
          <el-button type="primary" size="small" @click="search" class="blueBtn"><i class="icon iconfont icon-chaxunicon"></i>查询</el-button>
        </li>
        <li><el-button type="primary" size="small" @click="addOrEditRole('create')" class="blueBtn"><i class="icon iconfont icon-xinzengicon"></i>新增</el-button></li>
        <li><el-button type="primary" size="small" @click="!(multipleSelection.length == 0)&&delRole()" class="deleBtn" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-shanchuicon"></i>删除</el-button></li>
      </ul>
    </div>
    <section v-loading="tableLoading">
      <el-table ref="multipleTable" :data="tableData" border header-row-class-name="table-header-style" :height="$store.state.app.maxTableHeight - 270" stripe
        @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="70" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" min-width="100"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="200"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="small" class="underlineBlue" @click="permissSetting(scope.row)"
              style="color:#0079FE;margin-right:10px">设置权限</el-button>
            <el-button type="primary" size="small" class="underlineBlue" @click="addOrEditRole('edit',scope.row)"
              style="color:#0079FE;margin-right:10px">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <footer>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :page-sizes="[30, 50, 100]" :page-size="searchParams.pageCount"
        :total="total" :current-page="searchParams.pageNum"></el-pagination>
    </footer>

    <!-- 权限设置弹窗-->
    <el-dialog title="权限配置" :visible.sync="permissSettingdialogVisible" width="500px" v-dialogDrag v-if="permissSettingdialogVisible"
      :close-on-click-modal="false" @close="closePremiss" class="proupClass">
      <div class="content" v-loading="treeLoading">
        <el-tree @node-click="getNode" :data="premissTreeData" show-checkbox node-key="id"
          :default-checked-keys="getIdsArr" :props="defaultProps" ref="tree" :default-expanded-keys='expandTreeArr'></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModule" class="proupbtnquxiao">取 消</el-button>
        <el-button type="primary" @click="setPermiss" class="proupbtnqueding" :loading="saveLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增 编辑角色弹窗 -->
    <el-dialog :title="roleForm.title" @close="closeroleDia" :visible.sync="addRoledialogVisible" v-dialogDrag v-if="addRoledialogVisible" :close-on-click-modal="false"
      width="500px" class="proupClass addRoleDialog">
      <el-form ref="roleForm" :model="roleForm" :rules="roleFormRules" label-width="100px"  onsubmit="return false">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="decription">
          <el-input type="textarea" v-model="roleForm.decription"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModule" class="proupbtnquxiao">取 消</el-button>
        <el-button type="primary" @click="addRoleTrue" class="proupbtnqueding" :loading="saveLoading2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    mapState,
    mapMutations,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        selectUser: "zerenren",
        idArr: [], //已选的用户
        getIdsArr: [],
        inputrole: "", //输入的用户
        rolesList: [],
        users: [], //用户列表
        permissSettingdialogVisible: false, //权限设置
        addRoledialogVisible: false, //新增角色
        tableLoading: false,
        roleForm: {
          //角色数据
          title: "新增角色",
          name: "",
          decription: ""
        },
        roleFormRules:{
          name: [
            {required: true,message: "请输入角色名称",trigger: 'blur'},
            { max: 50, message: '最多输入50个字符', trigger: 'blur' }
          ],
          decription: [
            {required: false, max: 100, message: '最多输入100个字符', trigger: 'blur' }
          ],
        },
        searchParams: {
          name: "",
          pageNum: 1,
          pageCount: 30
        },
        total: 0,
        tableData: [],
        multipleSelection: [],
        premissTreeData: [],
        premissAllTreeData: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        quanxianobj: "",
        stateSelect: [{
            name: "启用",
            value: "1"
          },
          {
            name: "停用",
            value: "0"
          },
          {
            name: "全部",
            value: ""
          }
        ],
        expandTreeArr:[],
        saveLoading:false,
        saveLoading2:false,
        treeLoading:false
      };
    },
    mounted() {
      this.search();
      this.getAllpermiss();
    },
    methods: {
      getNode(val) {
        // console.log(val);
      },
      closeroleDia(){
        this.$refs['roleForm'].resetFields()
      },
      closeModule() {
        this.idArr = [];
        // this.roleForm.sex = "";
        this.permissSettingdialogVisible = false;
        this.addRoledialogVisible = false;
      },
      //分页器
      handleSizeChange(val) {
        this.searchParams.pageCount = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.searchParams.pageNum = val;
        this.search();
      },
      // 关闭权限弹窗操作
      closePremiss() {
        this.$refs.tree.setCheckedKeys([]);
      },
      //获取所有权限
      getAllpermiss() {
        this.premissTreeData = [];
        this.$http.postJSON("menu-resource/select-menu").then(res => {
          if (res.code === 200) {
            this.premissTreeData = [res.data];
            this.premissTreeData[0].children.forEach(item => {
              // if(item.label==='系统管理'){
                item.children.forEach(ele => {
                  if(ele.path==='/logManager'){
                    ele.disabled=true
                    if(ele.children.length){
                      ele.children[0].disabled=true
                    }
                  }
                })
              // }
            });
            this.expandTreeArr.push(this.premissTreeData[0].id)
            this.premissAllTreeData = JSON.parse(
              JSON.stringify(this.premissTreeData)
            );
          }
        });
      },
      //权限设置
      permissSetting(val) {
        this.quanxianobj = val;
        this.premissTreeData = this.premissAllTreeData;

        //角色拥有的资源
        let resourceparams = {
          list: [val.id]
        };
        this.treeLoading = true
        this.$http
          .postJSON("menu-resource/select-menu-resource-roles", resourceparams)
          .then(res => {
            if (res.code === 200) {
              let leafArr = res.data.resources.map(el => el.id);
              this.$refs.tree.setCheckedKeys(leafArr);
              setTimeout(()=>{
                this.treeLoading = false
              },300)
            } else {
              this.$refs.tree.setCheckedKeys([]);
              setTimeout(()=>{
                this.treeLoading = false
              },300)
            }
          });
        this.permissSettingdialogVisible = true;

      },
      setPermiss() {
        let selectNode = this.$refs.tree.getCheckedNodes(false, true);
        let params = {
          object: this.quanxianobj.id,
          list: selectNode.map(el => el.id)
        };
        this.update(params);
      },
      // 修改权限
      update(params) {
        this.saveLoading = true
        this.$http.postJSON("menu-resource/insert-permit", params).then(res => {
          if (res.code === 200) {
            this.search();
            this.message('success','修改成功')
            this.permissSettingdialogVisible = false;
          } else {
            this.message('error','修改失败')
          }
          setTimeout(()=>{
            this.saveLoading = false
          },500)
        });
      },

      // 遍历树 -- 修改树的权限
      updataTreeIDFalse(data, id) {
        for (var i in data) {
          if (data[i].id == id) {
            data[i].hidden = false;
            break;
          } else {
            this.updataTreeIDFalse(data[i].children, id);
          }
        }
      },
      updataTreeIDTrue(data, id, val) {
        for (var i in data) {
          if (data[i].id == id) {
            data[i].hidden = true;
            break;
          } else {
            this.updataTreeIDTrue(data[i].children, id);
          }
        }
      },
      //遍历树 -- 获取树的id
      getTreeID(data, arr) {
        function getId(data) {
          for (var i in data) {
            if (data[i].hidden == false && !data[i].children) {
              arr.push(data[i].id);
            } else {
              getId(data[i].children, arr);
            }
          }
        }

        getId(data);
      },
      //遍历树 -- 获取所有树的id
      getTreeAllId(data, arr) {
        function getId(data, arr) {
          for (var i in data) {
            arr.push(data[i].id);
            if (data[i].children) {
              getId(data[i].children, arr);
            }
          }
        }

        getId(data, arr);
        arr.sort((a, b) => {
          return a - b;
        });
      },
      //遍历树获取叶子节点id
      getTreeleafID(data, arr) {
        function getId(data) {
          for (var i in data) {
            if (data[i].leaf == "1") {
              arr.push(data[i].id);
            } else {
              getId(data[i].children, arr);
            }
          }
        }

        getId(data);
      },
      //遍历树获取所有节点id
      getTreeMenuId(data, arr) {
        function getId(data) {
          for (var i in data) {
            if (data[i].leaf == "1" || data[i].leaf == "0") {
              arr.push(data[i].id);
              getId(data[i].children, arr);
            } else {
              // getId(data[i].children, arr)
            }
          }
        }

        getId(data);
      },
      //遍历树获取资源id
      getTreeResourceID(data, arr) {
        function getId(data) {
          for (var i in data) {
            if (data[i].url) {
              arr.push(data[i].id);
            } else {
              getId(data[i].children, arr);
            }
          }
        }

        getId(data);
      },
      //新增角色 编辑角色 弹窗
      addOrEditRole(val, row) {
        // alert(JSON.stringify(row))
        if (val == "create") {
          this.roleForm.title = "新增角色";
          this.roleForm.name = "";
          this.roleForm.decription = "";


        } else if (val == "edit") {
          this.roleForm.title = "编辑角色";
          this.roleForm.name = row.roleName;
          this.roleForm.decription = row.roleDesc;
          this.roleForm.id = row.id;
        }
        this.roleForm.open = val;
        this.addRoledialogVisible = true;
      },
      //新增角色
      addRoleTrue() {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            let params
            if(this.roleForm.open == "create"){
              params = {
                id: this.roleForm.id,
                roleName: this.roleForm.name,
                roleDesc: this.roleForm.decription || "",
                status: "1",
                createrId:JSON.parse(sessionStorage.personal).id
              }
            }else if(this.roleForm.open == "edit"){
              params = {
                id: this.roleForm.id,
                roleName: this.roleForm.name,
                roleDesc: this.roleForm.decription || "",
                status: "1"
              }
            }
            if (this.roleForm.open == "create") {
              // 创建角色
              this.saveLoading2 = true
              this.$http.postJSON("role/insert-role", params).then(res => {
                if (res.code == "200") {
                  this.message('success',res.message)
                  this.addRoledialogVisible = false;
                  // this.roleForm.sex = "";
                  this.search();
                } else {
                  this.message('warning',res.message)
                }
                setTimeout(()=>{
                  this.saveLoading2 = false
                },500)
              });
            } else if (this.roleForm.open == "edit") {
              // 编辑角色
              this.saveLoading2 = true
              this.$http.postJSON("role/update-role", params).then(res => {
                if (res.code == "200") {
                  this.message('success',res.message)
                  this.addRoledialogVisible = false;
                  // this.roleForm.sex = "";
                  this.search();
                } else {
                  this.message('warning',res.message)
                }
                setTimeout(()=>{
                  this.saveLoading2 = false
                },500)
              });
            }
          } else {
            this.focusAccord()
            return false;
          }
        });

      },
      //批量选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //删除删除角色
      delRole() {
        if (this.multipleSelection.length == 0) {
          return this.message('warning','请选择角色')
          
        }
        let list = {
          list: this.multipleSelection.map(el => el.id)
        };
        this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass: "whetherh",
            closeOnClickModal: false,
            type: "warning"
          })
          .then(() => {
            this.$http.postJSON("role/delete-role", list).then(res => {
              if (res.code === 200) {
                this.message('success',res.message)
                this.search();
              } else {
                this.message('warning',res.message)
              }
            });
          })
          .catch(() => {});
      },
      //数组去重
      diff(arr, arr1) {
        var a = [];
        var b = [];
        var r;
        for (var i = 0; i < arr.length; i++) {
          var index = arr1.indexOf(arr[i]);
          if (index != -1) {
            var r = a[i];
            for (var j = index; j < arr1.length; j++) {
              if (arr1[j] == arr[i]) {
                arr1.splice(j, 1);
                j = j - 1;
              }
            }
            for (var k = i + 1; k < arr.length; k++) {
              if (arr[k] == arr[i]) {
                arr.splice(k, 1);
                k = k - 1;
              }
            }
            arr.splice(i, 1);
            i = i - 1;
          }
        }
        return arr.concat(arr1);
      },

      handleClose(tag) {
        this.rolesList.splice(this.rolesList.indexOf(tag), 1);
      },
      cleanTag() {
        this.rolesList = [];
      },
      //查询表格数据--获取角色
      search() {
        this.tableLoading = true;
        this.$http
          .postJSON("role/select-role", {
            roleName: this.searchParams.name,
            pageNum: this.searchParams.pageNum,
            pageCount: this.searchParams.pageCount,
            status:"1",
            userId:JSON.parse(sessionStorage.personal).id
          })
          .then(res => {
            if (res.code === 200) {
              for (let i = 0; i < res.data.list.length; i++) {
                let index = res.data.list[i].updateTime.indexOf(":");
                index = res.data.list[i].updateTime.indexOf(":", index + 1);
                //根据第二个点的位置，截取 字符串。得到结果 result
                let result = res.data.list[i].updateTime.substring(0, index);
                !!result && (res.data.list[i].updateTime = result);
              }
              this.tableData = res.data.list;
              this.tableData.map(item => {
                item.status = !!item.status;
              });
              this.total = res.data.totalCount;
            } else {
              this.tableData = [];
            }
            setTimeout(() => {
              this.tableLoading = false;
            }, 300);

            //防止表格错位
            $('.commonPadding').css("padding","10px 26px")
            setTimeout(()=>{
              $('.commonPadding').css("padding","10px 25px")
            },200)
          });
      },
      kaiguan(data) {
        let params = {
          id: data.id,
          roleName: data.roleName,
          roleDesc: data.roleDesc,
          status: data.status ? "1" : "0"
        };
        this.$http.postJSON("role/update-role", params).then(res => {
          if (res.code == "200") {
            this.message('success',res.message)
            this.addRoledialogVisible = false;
            this.search();
          } else {
            this.message('warning',res.message)
          }
        });
      }
    },
    computed: {},
  };

</script>
<style lang="scss">
  #root-manage {
    // padding:20px 32px 35px 31px;
    .addRoleDialog {
      .el-textarea {
        .el-textarea__inner {
          min-height: 98px !important;
        }
      }
    }
  }

</style>
<style lang="scss" scoped>
.roleText{
  width: 250px;
}
</style>
<style lang="scss">
#root-manage{
  .el-tree-node__content{
    height: 30px !important;
  }
}
</style>


