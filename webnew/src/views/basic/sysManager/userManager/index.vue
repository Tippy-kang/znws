<template>
  <div id="userManger" :class="isCollapse?'checkUser1 commonPadding':'checkUser2 commonPadding'" >
    <div @click="toggleSlide" :class="isCollapse?'flexBox1':'flexBox2'">
      <span class="left-icon" v-if="isCollapse">
        <</span> <span class="right-icon" v-else>>
      </span>
    </div>
    <div class="menu-tree" :class="isCollapse?'classOpen':'classClose'">
      <div class="menu-btn">
        <el-button type="primary" size="small" @click="!(departBtnStatus.add)&&departmentModify('create')" class="normalBtn"
          :disabled="departBtnStatus.add">新增</el-button>
        <el-button type="primary" size="small" @click="!(departBtnStatus.delete)&&shanchuDepart()" class="normalBtn"
          :disabled="departBtnStatus.delete">删除</el-button>
        <el-button type="primary" size="small" @click="!(departBtnStatus.edit)&&departmentModify('edit')" class="normalBtn"
          :disabled="departBtnStatus.edit">编辑</el-button>
        <el-button type="primary" size="small" @click="sortClick()" class="normalBtn" >排序</el-button>
      </div>
      <el-scrollbar wrap-class="scrollbarList" :style="`height:${$store.state.app.maxTableHeight - 205}px`">
        <el-tree :expand-on-click-node="false" class="userTree iconUserStyle" :highlight-current="true"
          @node-click="getnode" :data="departTreeData" :props="defaultProps" v-loading="treeLoading"
          element-loading-text="系统正在获取数据" element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.9)" :default-expanded-keys='expandTreeArr' node-key="id">
          <span slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>

    <div class="content-list">
      <div class="search-bar" ref="searchbar">
        <ul class="search-fl">
          <li class="search-msg">
            <span class="liText">企业名称：</span>
            <el-input v-model="corpName" placeholder="请输入" style="width:150px" size="medium" clearable class="nameStyle"></el-input>
          </li>
          <li>
            <el-button size="small" type="primary" @click="getTableItems" class="blueBtn"><i
                class="icon iconfont icon-chaxunicon"></i>查询</el-button>
          </li>

          <li>
            <el-button size="small" type="primary" @click="clicknode.id&&addOrEditUserDia('create')" :disabled="clicknode.id?false:true" class="blueBtn"
              ><i class="icon iconfont icon-xinzengicon"></i>新增</el-button>
          </li>
          <li>
            <el-button size="small" type="primary" @click="!(multipleSelection.length!=1)&&addOrEditUserDia('edit',multipleSelection[0])"
              class="blueBtn" :disabled="multipleSelection.length!=1"><i
                class="icon iconfont icon-bianjiicon"></i>编辑</el-button>
          </li>
          <li>
            <el-button size="small" type="primary" @click="!(multipleSelection.length==0)&&deleUser()" class="deleBtn"
              :disabled="multipleSelection.length==0"><i class="icon iconfont icon-shanchuicon"></i>删除</el-button>
          </li>
          <!-- <li>
            <el-button size="small" type="primary" @click="clicknode.id&&sortUser()" :disabled="clicknode.id?false:true" class="blueBtn"
              ><i class="icon iconfont icon-xinzengicon"></i>排序</el-button>
          </li> -->
          <li>
            <el-checkbox-group v-model="showSonFlag" @change="getTableItems">
              <el-checkbox label="city.id" key="1">显示所有下级</el-checkbox>
            </el-checkbox-group>
          </li>
        </ul>
      </div>

      <el-table ref="multipleTable" :data="userTableData" header-row-class-name="table-header-style"
       :height="tableheight - 230" @selection-change="handleSelectionChange"
        v-loading="scheduleLoading" element-loading-text="系统正在获取数据" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.9)" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="corpName" label="企业名称" min-width="100"></el-table-column>
        <el-table-column prop="loginName" label="用户名" min-width="100"></el-table-column>
        <el-table-column prop="loginAccount" label="登录账号" width="200"></el-table-column>
        <el-table-column prop="departmentName" label="所属部门" min-width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色">
          <template slot-scope="scope">
            <div>
              <elli-tooltip :rows="1" :value="scope.row.roleName?scope.row.roleName.join(','):''"></elli-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phonenum" label="联系电话" width='130'></el-table-column>
        <el-table-column label="启用" width="70">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changeUserStatus(scope.row)" active-color="#409eff"
               inactive-color="#ccc"></el-switch>
          </template>
        </el-table-column>
      </el-table>

      <footer>
        <el-pagination layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :page-sizes="[30, 50, 100]" :page-size="conditionForm.pages.pageCount"
          :total="total" :current-page="conditionForm.pages.pageNum">
        </el-pagination>
      </footer>
    </div>

    <!-- 新增部门弹窗 -->
    <el-dialog :title="changeDepart.title" @close="closeDialog" :close-on-click-modal="false"
      :visible.sync="addOrEditDepartDialogVisible" v-dialogDrag v-if="addOrEditDepartDialogVisible" width="500px" class="proupClass sectionDialog">
      <el-form :model="changeDepart" label-width="100px" :rules="changeDepartFormRules" ref="changeDepartForm">
        <el-form-item label="上级部门：" v-if="changeDepart.higherdepartmentStatus">
          <el-input v-model.trim="changeDepart.department" class="addbumen" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" prop="departName">
          <el-input v-model.trim="changeDepart.departName" class="addbumen"></el-input>
        </el-form-item>
        <el-form-item label="机构编码：" prop="deptCode" v-if="this.$route.query.typeId == 'b_khyh'">
          <el-input v-model.trim="changeDepart.deptCode" class="addbumen"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" class="proupbtnquxiao">取 消</el-button>
        <el-button type="primary" @click="addOreditDepart" :loading="saveLoading" class="proupbtnqueding">确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 新增用户弹窗 -->
    <el-dialog :title="changeuserForm.title" @close="usercloseDialog" width="800px" class="proupClass addUserDialog"
      v-dialogDrag v-if="addOrEditUserDialogVisible" :close-on-click-modal="false" :visible.sync="addOrEditUserDialogVisible">
      <el-form :model="changeuserForm" label-width="100px" :rules="changeuserFormRules" ref="changeuserFormForm">
        <el-col :span="12">
          <el-form-item label="企业名称：" prop="corpName">
            <el-input v-model.trim="changeuserForm.corpName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名：" prop="loginName">
            <el-input v-model.trim="changeuserForm.loginName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门：" prop="departmentName">
            <el-input v-model="changeuserForm.departmentName" @focus="opendepartTree" readonly placeholder="点击选择"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录账号：" prop="loginAccount">
            <el-input v-model.trim="changeuserForm.loginAccount" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码：" :prop="changeuserForm.open == 'create'?'loginPassword':'loginPassword2'">
            <el-input type="password" v-model.trim="changeuserForm.loginPassword" autocomplete='new-password' placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话：" prop="phonenum">
            <el-input v-model.trim="changeuserForm.phonenum" maxlength="11" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户角色：" prop="rids">
            <el-select v-model="changeuserForm.rids" placeholder="请选择" multiple class="multipleRole">
              <el-option v-for="(item,index) in ridOptions" :key="index" :label="item.roleName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：" prop="status">
            <el-switch v-model="changeuserForm.status" active-text="启用" inactive-text="未启用" active-color="#409eff"
              inactive-color="#ccc"></el-switch>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="usercloseDialog" class="proupbtnquxiao">取 消</el-button>
        <el-button type="primary" @click="addOrEditBtnTrue" class="proupbtnqueding" :loading="saveLoading2">确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 部门排序弹窗 -->
    <el-dialog title="排序" width="450px" @close="closeDialog" v-dialogDrag v-if="departsortdialogVisible" :close-on-click-modal="false"
      :visible.sync="departsortdialogVisible" class="proupClass sortDialog">
      <div class="sortBox">
        <el-tree :data="departSortData" node-key="id" draggable :allow-drop="departCollapse"
          @node-drop="departHandleDrop">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="sortDepartTrue" :loading="saveLoading3">确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 用户排序弹窗 -->
    <el-dialog title="排序" width="510px" @close="closeDialog" v-dialogDrag v-if="usersortdialogVisible" :close-on-click-modal="false"
      :visible.sync="usersortdialogVisible" class="proupClass">
      <div class="sortBox">
        <el-tree :data="userSortData" node-key="id" draggable :allow-drop="userCollapse" @node-drop="userHandleDrop">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="userSortTrue" :loading="saveLoading4">确 定</el-button>
      </div>
    </el-dialog>
    <departTree :module="departTreeVisible" @close="closedepartTree" @success="getDepart" :departId='departId' :moduleTree='moduleTree'></departTree>
  </div>
</template>

<script>
  import departTree from '@/components/common/departTree.vue'
  import {
    Encrypt
  } from '@/utils/cryptojs.js'
  import paginationMixin from '@/mixins/paginations.js'
  export default {
    components: {departTree},
    mixins: [paginationMixin],
    data() {
      return {
        /**
         * 部门
         */
        moduleTree:'departmentTree',
        departTreeVisible:false,
        departId:[],
        departTreeData:[],
        clicknode: {}, //点击的部门节点
        departBtnStatus: { //部门按钮状态
          add: true,
          edit: true,
          delete: true
        },
        changeDepartFormRules: {
          departName: [{
            required: true,
            message: "请输入部门名称",
            trigger: 'blur'
          },{ max: 50, message: '最多输入50个字符', trigger: 'blur' }],
          deptCode: [{required: true,message: "请输入机构编码",trigger: 'blur'},
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }]

        },
        changeDepart: { //新增&修改部门Form
          title: '新增部门',
          department: '',
          departName: '',
          type: '',
          subSysInfo: '',
          higherdepartmentStatus: true,
          deptCode: ''
        },
        addOrEditDepartDialogVisible: false, //新增&修改部门弹窗
        defaultProps: {
          children: 'children',
          label: 'label'
        },

        departSortData: [], //部门排序弹窗数据
        departsortdialogVisible: false, //部门排序弹窗

        sortChange: [], //拖拽改变的部门
        sortParams: [], //拖拽改变的部门传职
        /**
         * 用户
         */
        corpName: "",
        addOrEditUserDialogVisible: false, //新增用户弹窗
        usersortdialogVisible: false, //用户排序 --- 暂未用到
        changeuserFormRules: {
          loginName: [{
            required: true,
            message: "请输入姓名",
            trigger: 'blur'
          },{ max: 50, message: '最多输入50个字符', trigger: 'blur' }],
          departmentName: [{
            required: true,
            message: "请选择部门",
            trigger: 'change'
          }],
          loginAccount: [{
            required: true,
            message: "请输入登陆账号",
            trigger: 'blur'
          }],
          loginPassword: [
            {required: true,message: "请输入登陆密码",trigger: 'blur'},
            { min:8,max: 20, message: '请输入8-20位密码', trigger: 'blur' }
            ],
          loginPassword2: [{
            required: false
          }],
          phonenum: [
            { required: false},
            {pattern:/^1\d{10}$/,message: '请输入正确的手机号',trigger: 'blur'}
          ],
          rids: [{
            required: true,
            message: "请选择角色",
            trigger: 'change'
          }],
          status: [{
            required: true
          }],
          corpName:[
            {required: true,message: "请输入企业名称",trigger: 'blur'}
          ]
        },
        changeuserForm: { //新增&修改用户Form
          id:'',
          title: '新增用户',
          loginAccount: '', //登陆账号
          loginPassword: '', //登陆密码
          loginName: '', //登陆名
          departmentId: '', //部门名称
          departmentName: '',
          phonenum: '', //办公电话
          rids: [],
          status: true,
          open: "create",
          corpName:'',
          corpId:''
        },
        userTableData: [], //查询用户表格数据
        ridOptions: [], //用户角色下拉框
        userSortData: [],
        
        
        guanlianBeikaoheDialog: false,
        linkBeikaoheTree: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        linkBeikaoheTreeData: [],
        linkBeikaoheFlag: false,
        mode: "transfer", // transfer addressList       
        toData: [],
        title: ["全部单位", "关联单位"],
        defaultTransfer: false,
        treeLoading: false,
        scheduleLoading: false,
        genNode: {},
        expandTreeArr: [],
        isCollapse: true,
        classOpen: 'classOpen',
        classClose: 'classClose',
        checkUser1: 'checkUser1',
        checkUser2: 'checkUser2',
        flexBox1: 'flexBox1',
        flexBox2: 'flexBox2',
        saveLoading: false,
        saveLoading2: false,
        saveLoading3: false,
        saveLoading4: false,
        saveLoading5: false,
        showSonFlag:true,
        deptCode:'',
        tableheight:0,
        parentIds:[]
      }
    },
    created() {},
    mounted() {
      this.searchSide()
      this.selectRole()
      this.$nextTick(()=>{
        this.tableheight = this.$store.state.app.maxTableHeight - this.$refs.searchbar.clientHeight
      })
      this.expandTreeArr = []
      
    },
    computed: {
      maxTableHeight () {
        return this.$store.state.app.maxTableHeight + this.$store.state.app.maxTableWidth;　　//需要监听的数据
        
      }
    },
    watch: {
     maxTableHeight(newVal){
        this.tableheight = this.$store.state.app.maxTableHeight - this.$refs.searchbar.clientHeight
        
      },
      // 监听路由变化，"刷新"页面
      $route(value) {
        this.searchSide()
        this.selectRole()
        this.expandTreeArr = []
        
      },
      clicknode(newVal) {
        if (newVal.id) {
          this.departBtnStatus.add = false
          this.departBtnStatus.edit = false
          if (newVal.children.length === 0) {
            this.departBtnStatus.delete = false
            this.departBtnStatus.edit = false
          } else {
            this.departBtnStatus.delete = true
            this.departBtnStatus.edit = false
          }

          if (this.parentIds.indexOf(newVal.parent_id) !== -1) {
            this.departBtnStatus.edit = true
          }

        } else {
          this.departBtnStatus.add = true
          this.departBtnStatus.edit = true
          this.departBtnStatus.delete = true
        }
      },
      departTreeData(val) {
        this.clicknode = {}
      }
    },
    methods: {
      // 打开部门选择树
      opendepartTree() {
        this.departTreeVisible = true
      },
      closedepartTree(){
        this.departTreeVisible = false
      },
      //获得选择的部，部门
      getDepart(val) {
        if (val.length) {
          this.changeuserForm.departmentId = val[0].id
          this.changeuserForm.departmentName = val[0].label
          this.departId = val[0].id
        }

      },
      /**
       * 部门树修改
       * @param fn 修改方式，0：新增，1：编辑
       */
      departmentModify(val) {
        this.changeDepart.deptCode = ''
        if (JSON.stringify(this.clicknode) == '{}') {
          return this.message('warning', '请选择部门')
        }
        this.addOrEditDepartDialogVisible = true
        if (val == 'create') {
          this.changeDepart.higherdepartmentStatus = true
          this.changeDepart.title = '新增部门'
          this.changeDepart.department = this.clicknode.label
          this.changeDepart.departName = ''
         
        } else if (val == 'edit') {
          this.changeDepart.title = '编辑部门'
          this.$http.postJSON('department2/select-departmentById', {
            id: this.clicknode.id
          }).then(res => {
            if (res.code === 200) {
              this.changeDepart.department = this.clicknode.partmentName
              this.changeDepart.departName = this.clicknode.label
              this.changeDepart.department ? this.changeDepart.higherdepartmentStatus = true : this.changeDepart
                .higherdepartmentStatus = false
              this.changeDepart.deptCode = res.data.deptCode
              this.deptCode = res.data.deptCode
            } else {
              this.message('error', res.message)
            }
          })
        }
        this.changeDepart.open = val

        this.$nextTick(() => {
          this.$refs['changeDepartForm'].resetFields()
        })

      },
      /**
       * 修改部门确认
       */
      addOreditDepart() {
        this.$refs['changeDepartForm'].validate((valid) => {
          if (valid) {
            if (this.changeDepart.open == 'create') {
              let params = {
                'name': this.changeDepart.departName,
                'parentId': this.clicknode.id, //如果是第一层部门，传空即可
              }

              if (this.$route.query.typeId == "b_khyh") params.deptCode = this.changeDepart.deptCode
              this.saveLoading = true
              this.$http.postJSON('department2/insert-department', params).then(res => {
                if (res.code === 200) {
                  this.expandTreeArr = [this.clicknode.id]
                  this.message('success', res.message)
                  this.clicknode = {}
                  this.addOrEditDepartDialogVisible = false
                  this.searchSide()
                } else {
                  this.message('error', res.message)
                }
                setTimeout(() => {
                  this.saveLoading = false
                }, 500)
              })
            } else if (this.changeDepart.open == 'edit') {
              let params = {
                'id': this.clicknode.id,
                'name': this.changeDepart.departName,
                'parentId': this.clicknode.parent_id
              }

              if (this.$route.query.typeId == "b_khyh"&&this.deptCode!=this.changeDepart.deptCode) params.deptCode = this.changeDepart.deptCode
              this.saveLoading = true
              this.$http.postJSON('department2/update-department', params).then(res => {
                if (res.code === 200) {
                  this.expandTreeArr = [this.clicknode.id]
                  this.message('success', res.message)
                  this.clicknode = {}
                  this.addOrEditDepartDialogVisible = false
                  this.searchSide()
                } else {
                  this.message('error', res.message)
                }
                setTimeout(() => {
                  this.saveLoading = false
                }, 500)
              })
            }
          } else {
            this.focusAccord()
            return false;
          }
        });
      },
      /**
       * 删除部门按钮
       */
      shanchuDepart() {
        if (JSON.stringify(this.clicknode) == '{}') {
          return this.message('warning', '请选择部门')
        }
        this.$confirm('确定删除该部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          // center: true,
          customClass: "whetherh",
          closeOnClickModal: false
        }).then(() => {
          if (this.clicknode.children.length != 0) {
            return this.message('warning', '该部门存在子部门,请先删除子部门')
          }
          this.$http.postJSON('department2/delete-department', {
            id: this.clicknode.id
          }).then(res => {
            if (res.code === 200) {
              this.message('success', res.message)
              this.clicknode = {}
              this.searchSide()
            } else {
              this.message('error', res.message)
            }
          })
        }).catch(() => {

        })
      },
      /**
       * 部门排序弹窗按钮
       */
      sortClick() {
        this.departsortdialogVisible = true
        this.departSortData = JSON.parse(JSON.stringify(this.departTreeData))
      },
      /**
       * 设置部门允许拖拽的节点
       */
      departCollapse(moveNode, inNode, type) {
        if (moveNode.level == 1 && inNode.level == 1) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {}
        }
        if (moveNode.level == 2 && inNode.level == 2) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {}
        }
        if (moveNode.level == 3 && inNode.level == 3) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {}
        }
        if (moveNode.level == 4 && inNode.level == 4) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {}
        }
        if (moveNode.level == 5 && inNode.level == 5) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {}
        }
        if (moveNode.level == 6 && inNode.level == 6) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {}
        }
        if (moveNode.level == 7 && inNode.level == 7) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {}
        }
      },
      /**
       * 部门排序拖拽
       */
      departHandleDrop(draggingNode, dropNode, dropType, ev) {
        let children
        if (dropNode.level === 1) {
          children = dropNode.parent.data
        } else {
          children = dropNode.parent.data.children
        }

        let change = []

        children.forEach((el, i) => {
          change.push({
            id: el.id,
            sort: i
          })
        })
        this.sortChange = [...change, ...this.sortChange]
        this.sortParams = []
        for (var i = 0; i < this.sortChange.length; i++) {
          var flag = true
          for (var j = 0; j < this.sortParams.length; j++) {
            if (this.sortChange[i].id == this.sortParams[j].id) {
              flag = false
            }
          }
          if (flag) {
            this.sortParams.push(this.sortChange[i])
          }
        }
        this.sortChange = JSON.parse(JSON.stringify(this.sortParams))
      },
      /**
       * 部门排序确认
       */
      sortDepartTrue() {
        if (this.sortParams.length == 0) {
          this.departsortdialogVisible = false
        } else {
          this.saveLoading3 = true
          this.$http.postJSON('department2/sort-department', this.sortParams).then(res => {
            if (res.code === 200) {
              this.message('success', res.message);
              this.clicknode = {};
              this.sortParams = [];
              this.departsortdialogVisible = false;
              this.searchSide()
            } else {
              this.message('error', res.message)
            }
            setTimeout(() => {
              this.saveLoading3 = false
            }, 500)
          })
        }
      },
      //默认展开层级
      recursion(data, arr, num, sum) {
        num++
        for (let i = 0; i < data.length; i++) {
          if (data[i].children.length && num <= sum) {
            arr.push(data[i].id)
            this.recursion(data[i].children, arr, num, sum)
          }
        }
      },
      searchSide() {
        let params = {
          "parentId": "10000000"
        }
        this.treeLoading = true
          this.$http.postJSON("department2/selectDepartmentByExample", params).then(res => {
            if (res.code === 200) {
              this.departTreeData = res.data
              if(!this.expandTreeArr.length){
                this.recursion(this.departTreeData,this.expandTreeArr,0,2)
              }

              if (res.data) {
                this.departTreeData.forEach(item => {
                  item.disabled = true
                });
                this.parentIds = this.departTreeData.map(el => el.parent_id)
                this.getTableItems()
              } else {
                this.parentIds = []
              }
            } else {
              this.departTreeData = []
              this.parentIds = this.departTreeData.map(el => el.parent_id)
            }
            setTimeout(() => {
              this.treeLoading = false;
            }, 500)
          })

      },
      /**
       * 点击获取节点
       */
      getnode(val) {
        this.clicknode = val
        this.getTableItems();
      },
      /**
       * 用户
       */
      /**
       * 查询用户
       */
      getTableItems(val) {
        let departmentId = this.clicknode.id?this.clicknode.id:(this.departTreeData[0].children.length?this.departTreeData[0].children[0].id:'')
        this.scheduleLoading = true
        let record = {
          userName: this.corpName || "",
          departmentId: departmentId,
          isShowLower: this.showSonFlag ? '1' : '0',
        }
        record.isShowLower=val?'1':'0'
        let params = {
          record: JSON.stringify(record),
          pageNum: val?1:this.conditionForm.pages.pageNum,
          pageCount: val?10000000:this.conditionForm.pages.pageCount
        }
        this.userSortData=[]
        this.$http.postJSON('user/select-user-dep', params).then(res => {
          setTimeout(() => {
            this.scheduleLoading = false
          }, 300)
          if (res.code === 200) {
            this.userTableData = res.data.list
            this.userTableData.map(item => {
              if (item.status == "0") {
                item.status = false;
              } else if (item.status == "1") {
                item.status = true;
              }
              item.roleName = item.roles.map(val => val.roleName)
            })
            res.data.list.forEach(el=>{
              let obj = {
                id:el.id,
                sort:el.sort,
                label:el.loginName
              }
              this.userSortData.push(obj)
            })
            this.total = res.data.totalCount
          } else {
            this.userTableData = []
            this.total = 0
            this.message('error', res.message)
          }

          //防止表格错位
          $('.content-list').css("padding", "0 0 0 11px")
          setTimeout(() => {
            $('.content-list').css("padding", "0 0 0 10px")
          }, 200)
        })
      },
      /**
       * 选择用户角色下拉框
       */
      selectRole() {
        let params = {
          'roleName': '',
          'pageNum': 1,
          'pageCount': 1000,
          'status': 1
        }
        this.$http.postJSON('role/select-role', params).then(res => {
          if (res.code === 200) {
            this.ridOptions = res.data.list
          } else {
            this.ridOptions = []
            this.message('error', res.message)
          }
        })
      },
      /**
       * 用户状态改变 1启用 0未启用
       */
      changeUserStatus(val) {
        if (val.status) {
          val.status = 1;
        } else {
          val.status = 0;
        }
        let params = {
          id: val.id,
          status: val.status
        };
        this.$http
          .postJSON("user/update-userStatus", params)
          .then(res => {
            if (res.code === 200) {
              this.getTableItems()
              this.message('success','修改成功')
            } else {
              this.message('error','修改失败')
            }
          });
      },
      /**
       * 新增&修改用户弹窗
       */
      addOrEditUserDia(val, row) {
        if (val == 'create') {
          this.changeuserForm = {
            'id':'',
            'title': '新增用户',
            'loginAccount': '', //登陆账号
            'loginPassword': '', //登陆密码
            'loginName': '', //登陆名
            'departmentId': '', //部门id
            'departmentName':'',
            'phonenum': '', //办公电话
            'rids': [],
            "status": true,
            'corpName':'',
            "corpId":''
          }
          this.departId=[]
          this.changeuserForm.departmentId = this.parentIds.indexOf(this.clicknode.parent_id) == -1 ? this.clicknode
            .id : ''
          this.changeuserForm.departmentName = this.parentIds.indexOf(this.clicknode.parent_id) == -1 ? this.clicknode
            .label : ''
          if (!this.changeuserForm.departmentId) {
            this.$nextTick(() => {
              this.$refs['changeuserFormForm'].resetFields()
            })
          }

        } else if (val == 'edit') {
          this.$http.postJSON('user/select-user',{id:row.id}).then(res=>{
            if(res.code==200){
              if(res.data){
                this.changeuserForm = {
                  title: '编辑用户',
                  'id': res.data.id,
                  'loginAccount': res.data.loginAccount, //登陆账号
                  'loginPassword': '', //登陆密码
                  'loginName': res.data.loginName, //登陆名
                  'departmentId': res.data.departmentId, //部门id
                  'departmentName':res.data.departmentName,
                  'phonenum': res.data.phonenum, //办公电话
                  'rids': res.data.roles.map(el => el.id),
                  status: res.data.status===1?true:false,
                  corpName:res.data.corpName,
                  corpId:res.data.corpId
                }
              }
            }
          })
        }
        this.changeuserForm.open = val
        this.addOrEditUserDialogVisible = true
      },
      /**
       * 新增&修改用户方法
       */
      addOrEditBtnTrue() {
        this.$refs['changeuserFormForm'].validate((valid) => {
          if (valid) {
            var pwd = this.changeuserForm.loginPassword ? Encrypt(this.changeuserForm.loginPassword) : ''
            let params = {
              'user': {
                'id':this.changeuserForm.id,
                'loginAccount': this.changeuserForm.loginAccount,
                'loginPassword': pwd,
                'loginName': this.changeuserForm.loginName,
                'departmentId': this.changeuserForm.departmentId,
                'phonenum': this.changeuserForm.phonenum,
                status: this.changeuserForm.status ? '1' : '0',
                corpId:this.changeuserForm.corpId
              },
              'rids': this.changeuserForm.rids,
              'corpName': this.changeuserForm.corpName
            }
              this.saveLoading2 = true
              this.$http.postJSON('user/insert-user', params).then(res => {
                if (res.code === 200) {
                  this.message('success', res.message)
                  this.addOrEditUserDialogVisible = false
                  this.getTableItems();
                } else {
                  this.message('error', res.message)
                }
                setTimeout(() => {
                  this.saveLoading2 = false
                }, 500)
              })
          } else {
            this.focusAccord()
            return false;
          }
        });
      },
      /**
       * 关闭弹窗
       */
      closeDialog() {
        //部门
        this.addOrEditDepartDialogVisible = false
        this.departsortdialogVisible = false
        this.usersortdialogVisible=false
      },
      usercloseDialog() {
        // 用户
        this.addOrEditUserDialogVisible = false
        this.changeuserForm = {
          title: '新增用户',
          loginAccount: '', //登陆账号
          loginPassword: '', //登陆密码
          loginName: '', //登陆名
          departmentId: '', //部门id
          departmentName:'',
          phonenum: '', //办公电话
          rids: [],
          status: true,
          open: "create",
          corpName:'',
          corpId:''
        }
        this.$refs['changeuserFormForm'].resetFields()

      },

      //用户排序
      sortUser() {
        this.usersortdialogVisible = true
        this.getTableItems(1)
      },
      userHandleDrop(draggingNode, dropNode, dropType, ev) {
        let arr = dropNode.parent.data
        let arr1 = []
        arr.forEach((item, index) => {
          let obj = {
            id: item.id,
            sort: index
          }
          arr1.push(obj)
        })
        this.sortChange = [...arr1, ...this.sortChange]
        this.sortParams = []
        for (var i = 0; i < this.sortChange.length; i++) {
          var flag = true
          for (var j = 0; j < this.sortParams.length; j++) {
            if (this.sortChange[i].id == this.sortParams[j].id) {
              flag = false
            }
          }
          if (flag) {
            this.sortParams.push(this.sortChange[i])
          }
        }
        this.sortChange = JSON.parse(JSON.stringify(this.sortParams))
      },
      userSortTrue() {
        if (this.sortParams.length == 0) {
          this.usersortdialogVisible = false
        } else {
          this.saveLoading4 = true
          this.$http.postJSON('user/update-user-sort', this.sortParams).then(res => {
            if (res.code === 200) {
              this.message('success', res.message)
              this.sortParams = []
              this.usersortdialogVisible = false
              this.getTableItems()
            } else {
              this.message('error', res.message)
            }
            setTimeout(() => {
              this.saveLoading4 = false
            }, 500)
          })
        }
      },
      userCollapse(moveNode, inNode, type) {
        if (moveNode.level == 1 && inNode.level == 1) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {}
        }
      },
      // 删除用户
      deleUser() {
        this.$confirm('确定删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: "whetherh",
          closeOnClickModal: false
        }).then(() => {
          this.$http.postJSON('user/delete-user',this.multipleSelection.map(el => el.id)).then(res => {
            if (res.code == 200) {
              this.expandTreeArr = [this.clicknode.parent_id]
              this.message('success', res.message);
              this.getTableItems()
            } else {
              this.message('warning', res.message)
            }
          })
        }).catch(() => {

        })
      },
      //侧边显隐切换
      toggleSlide() {
        this.isCollapse = !this.isCollapse
      }
      
    }
  }

</script>

<style scoped lang="scss">
  .el-select {
    width: 100%;
  }

  .checkUser1 {
    flex: 1;
    display: flex;
    flex-direction: row;
    @import '@/assets/css/menu-tree.scss';

    .content-list {
      flex: 1;
      padding: 0 0 0 20px;
      overflow-x: hidden;

      .userTableTitle {
        margin-bottom: 20px;
      }

      .nameStyle {
        &.el-input {
          width: 300px;
        }
      }
    }
  }

  .checkUser2 {
    width: 100%;
    @import '@/assets/css/menu-tree.scss';
    transition: all .3s ease-in-out;

    .content-list {
      flex: 1;
      padding: 0 0 0 20px;
      overflow-x: hidden;

      .userTableTitle {
        margin-bottom: 20px;
      }

      .nameStyle {
        &.el-input {
          width: 300px;
        }
      }
    }
  }

  .linkBeikaoheLi {
    line-height: 16px;
    padding-top: 10px
  }

</style>

<style lang="scss">
  #userManger {
    position: relative;

    .flexBox1 {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 300px;
      width: 20px;
      height: 63px;
      line-height: 63px;
      border: 1px solid #CDD7E1;
      border-left: none;
      background: #fff;
      text-align: center;
      cursor: pointer;

      .left-icon,
      .right-icon {
        font-size: 18px;
        color: #1a6bdc;
        font-weight: bold
      }
    }

    .flexBox2 {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      width: 20px;
      height: 63px;
      line-height: 63px;
      border: 1px solid #CDD7E1;
      border-left: none;
      background: #fff;
      text-align: center;
      cursor: pointer;

      .left-icon,
      .right-icon {
        font-size: 18px;
        color: #1a6bdc;
        font-weight: bold
      }
    }

    .classOpen {
      display: block;
      position: relative;
      top: -10px;
      left: -25px;
      transition: all .3s ease-in-out;
    }

    .classClose {
      display: none;
      transition: all .3s ease-in-out;
    }

    &.checkUser1 {
      .userTree .is-current>.el-tree-node__content {
        background-color: #e7e7e7 !important;
        color: #333;
      }

      .userTree {
        margin-top: 0;
        background-color: transparent;
      }

      .el-tree-node__content {
        height: 36px;
        line-height: 36px;
      }


      .el-switch.is-checked .el-switch__core {
        background: #4877E7 !important;
        border-color: #4877E7 !important;
      }
    }

    .tag-group {
      font-size: 18px;
    }

    .dialog-head {
      height: 85px;

      .head-left {
        font-size: 20px;
        font-weight: bold;
        float: left;
        color: black;
        margin-top: 17px
      }
    }

    .tag-item {
      background: #9BAAD1 !important;
      border: 1px solid #9BAAD1 !important;
      margin-right: 14px;
      margin-bottom: 10px;
      font-size: 18px;
      color: white;
      display: inline-block;
      border-radius: 5px;
      padding: 8px 20px 8px 20px;
    }
    .reds .el-input__inner{
      border-color: red !important;
      outline: 0;
    }
    .greends .el-input__inner:focus{
      border-color:#E4E7ED !important;
      outline: 0;
    }
    .reds .el-input__inner:focus{
      border-color: red !important;
      outline: 0;
    }
    .multipleRole{
      .el-input__inner{
        min-height:34px;
      }
    }
  }

</style>
