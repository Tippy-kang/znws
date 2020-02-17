<template>
  <div id="menu-manage" :class="isCollapse?'checkUser1 commonPadding':'checkUser2 commonPadding'">
    <div @click="toggleSlide" :class="isCollapse?'flexBox1':'flexBox2'">
      <span class="left-icon" v-if="isCollapse">
        <</span> <span class="right-icon" v-else>>
      </span>
    </div>
    <div class="menu-tree" :class="isCollapse?'classOpen':'classClose'">
      <div class="menu-btn">
        <el-button type="primary" size="small" @click="!(disabledfalse.add)&&addItems(0)" :disabled="disabledfalse.add" class="normalBtn">新增
        </el-button>
        <el-button type="primary" size="small" @click="!(disabledfalse.del)&&deleteItems(0)" :disabled="disabledfalse.del"
                   class="normalBtn">删除
        </el-button>
        <el-button type="primary" size="small" @click="!(disabledfalse.edit)&&editItems(0)" :disabled="disabledfalse.edit"
                   class="normalBtn">编辑
        </el-button>
        <el-button type="primary" size="small" @click="sortClick" class="normalBtn">排序</el-button>
      </div>
      <el-scrollbar wrap-class="scrollbarList"  :style="`height:${$store.state.app.maxTableHeight - 205}px`">
        <el-tree :expand-on-click-node="false" @node-click="triggerNode" class="userTree" :data="departTreeData"
                :props="defaultProps" node-key="id" :default-expanded-keys='expandTreeArr'
                v-loading="treeLoading"
                element-loading-text="系统正在获取数据"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.9)">
          <span slot-scope="{ node }">{{ node.label }}</span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="content-list">
      <div class="search-bar">
        <div class="search-btn">
          <ul class="search-fl">
            <li class="search-msg">
              <div class="project-list">资源列表</div>
            </li>
            <li>
              <el-button type="primary" size="small" :disabled="!zyName" @click="!(!zyName)&&addItems(1)" class="blueBtn"><i class="icon iconfont icon-xinzengicon"></i>新增
              </el-button>
            </li>
          </ul>
        </div>
      </div>
      <el-table ref="multipleTable" :data="userTableData" border header-row-class-name="table-header-style" :height="$store.state.app.maxTableHeight - 270"
                @selection-change="handleSelectionChange">
        <el-table-column prop="resourceKey" show-overflow-tooltip label="资源键值" min-width="100"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="资源名称" min-width="100"></el-table-column>
        <el-table-column prop="path" show-overflow-tooltip label="资源描述" min-width="100"></el-table-column>
        <el-table-column prop="sort" show-overflow-tooltip label="排序" align="center"></el-table-column>
        <el-table-column prop="resourceType" show-overflow-tooltip label="资源类型" min-width="100">
          <template slot-scope="scope">
            {{scope.row.resourceType ==1?'页面资源':scope.row.resourceType ==2?'数据资源':scope.row.resourceType ==3?'视频资源':''}}
            <!--            {{scope.row.reserved1==1?'(主)':''}}-->
          </template>
        </el-table-column>
        <el-table-column width="120" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" class="underlineBlue"
                       @click="editItems(1,scope.row)">编辑
            </el-button>
            <el-button type="danger" size="small" class="underlineRed"
                       @click="deleteItems(1,scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <footer>
        <el-pagination layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" :page-sizes="[30, 50, 100]"
                       :page-size="params.pageCount"
                       :total="total" :current-page="params.pageNum">
        </el-pagination>
      </footer>
    </div>

    <!-- 菜单弹窗 -->
    <el-dialog :title="menuTitle" v-dialogDrag v-if="addMenuDialogVisible" :close-on-click-modal="false" :visible.sync="addMenuDialogVisible"
               width="550px" class="proupClass" @close="closeDialog(1)">
      <el-form :model="form" ref="form" label-width="100px" :rules="formRules">
        <el-form-item label="菜单层级：">
          <el-input v-model="form.grade" size="medium" disabled></el-input>
        </el-form-item>
        <el-form-item label="上级菜单名称：" v-if="form.parentId !== '1' && menuTitle === '新增菜单'">
          <el-input v-model="form.parentName" size="medium" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model.trim="form.name" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径：" v-if="menuTitle === '新增菜单' || form.position === 1" prop="path">
          <el-input v-model.trim="form.path" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标：" v-if="form.grade == '二级菜单'" prop="icon">
          <el-input v-model.trim="form.icon" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="系统首页图片：" v-if="form.grade=='二级菜单'">
            <el-upload class="avatar-uploader" :action="uri" :auto-upload='false' name="file" with-credentials :show-file-list="false"
                       :on-change="uploadFiles" :before-upload="beforeAvatarUpload" accept=".png,.jpg" ref="upwenjiancreate">
              <img v-if="mageUrl" :src="`${mageUrl}`" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="addMenuDialogVisible = false">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="checkForm" :loading="buttonProtect">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 资源弹窗 -->
    <el-dialog :title="resourceTitle" v-dialogDrag v-if="addUserDialogVisible" :close-on-click-modal="false" :visible.sync="addUserDialogVisible"
               width="550px" class="proupClass" @close="closeDialog(2)">
      <el-form :model="form" label-width="100px" ref="form2" :rules="formRules2">
        <el-form-item label="菜单名称：">
          <div style="font-size: 16px">{{zyName}}</div>
        </el-form-item>
        <el-form-item label="资源值：" prop="resourceKey">
          <el-input v-model="form.resourceKey" class="addbumen" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="资源名称：" prop="name">
          <el-input v-model="form.name" class="addbumen" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="资源描述：" prop="path">
          <el-input v-model="form.path" class="addbumen" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="资源排序：" prop="sort">
          <el-input maxlength="10" v-model.number="form.sort" @change="inputSort(form.sort)" class="addbumen" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="资源类型：" prop="resourceType">
          <el-select v-model="form.resourceType" size="medium" @change="xuanzhong" style="width:150px">
            <el-option v-for="(item,index) in leixing" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="checkForm" :loading="buttonProtect">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 排序弹窗 -->
    <el-dialog title="排序" width="500px" v-dialogDrag v-if="sortdialogFormVisible" :close-on-click-modal="false" :visible.sync="sortdialogFormVisible"
               class="editcom proupClass">
      <div class="sortBox">
        <el-tree :data="sortData" node-key="id" draggable="" :allow-drop="collapse" :default-expanded-keys='expandTreeArrProp'
                 @node-drop="handleDrop"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="sortdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="sortgaibianTrue" :loading="buttonProtect">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import paginationMixin from '@/mixins/paginations.js';

  export default {
    mixins: [paginationMixin],
    data() {
      return {
        addMenuDialogVisible: false, //新增部门弹窗
        addUserDialogVisible: false, //新增资源弹窗
        deleteMenuDialogVisible: false, //删除用户弹窗
        sortdialogFormVisible: false, //单位排序隐藏
        disabledfalse: {
          add: true,
          edit: true,
          del: true
        },
        //新增用户表单
        params: {
          //查询数据传值
          bianhao: '1',
          name_cn: '',
          department_id: '',
          pageNum: 1,
          pageCount: 30,
          role_name: ''
        },
        total: 0, //数据总条数
        idBatch: [], //多选用户删除
        departTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        userTableData: [], //查询用户表格数据
        sortData: [], //排序弹窗数据
        clicknode: {}, //点击的节点数据
        sortChuanzhi: [],
        sortCan: [],
        menuTitle: '新增菜单',
        resourceTitle: '新增资源',
        form: {
          id: '',
          parentId: '',
          parentName: '',
          name: '',
          path: '',
          grade: '',
          icon: '',
          resourceMenu: '', // 0菜单、1资源
          resourceKey: '',
          menuId: '',
          position: '',
          resourceType:'1',
          sort:"",
          mageFileUrl:""
        },
        mageUrl:'',
        zyId: '',
        zyName: '',
        lev: null,
        editLimit: 1,
        deleteItemData: {
          list: [],
          type: ''
        },
        menuSelection: [],
        menuSelect: {},
        dialogVisible: false,
        buttonProtect: false,
        formRules: {
          name: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'},
            { max: 50, message: '最多输入50个字符', trigger: 'blur' }

          ],
          path: [
            {required: true, message: '请输入菜单路径', trigger: 'blur'},
            { max: 50, message: '最多输入50个字符', trigger: 'blur' }
          ],
          icon:[
            { required: false,max: 50, message: '最多输入50个字符', trigger: 'blur' }
          ]
        },
        formRules2: {
          resourceKey: [
            {required: true, message: '请输入资源值', trigger: 'blur'},
             { max: 200, message: '最多输入200个字符', trigger: 'blur' }
          ],
          path: [
            {required: true, message: '请输入资源描述', trigger: 'blur'},
             { max: 200, message: '最多输入200个字符', trigger: 'blur' }
          ],
          name: [
            {required: true, message: '请输入资源名称', trigger: 'blur'},
             { max: 50, message: '最多输入50个字符', trigger: 'blur' }
          ],
          sort:[
            {required: true, message: '请输入数字类型的资源排序', trigger: 'blur'},
            //  { min: 1, max: 10, message: '最多输入10个字符', trigger: 'blur' }
          ]
        },
        leixing:[
          {
            label:"页面资源",
            value:"1"
          },
          {
            label:"数据资源",
            value:"2"
          },
          {
            label:"视频资源",
            value:"3"
          }
        ],
        expandTreeArr:[],
        treeLoading:false,
        expandTreeArrProp:[],//弹窗默认展开
        isCollapse: true,
        classOpen: 'classOpen',
        classClose: 'classClose',
        checkUser1: 'checkUser1',
        checkUser2: 'checkUser2',
        flexBox1: 'flexBox1',
        flexBox2: 'flexBox2',
        uri:`${this.$http.baseHost}file/upload`
      }
    },
    mounted() {
      this.getTableItems()
      this.getMenuTreeData()
    },
    methods: {
      /**
       * 获取菜单树
       */
      getMenuTreeData() {
        this.zyId = ''
        this.zyName = ''
        this.lev = ''
        this.clicknode = ''
        this.disabledfalse.add = true;
        this.disabledfalse.del = true;
        this.disabledfalse.edit = true;
        let data1 = []
        let data2 = []
        this.sortData = []
        this.treeLoading=true
        this.$http.get('menu-resource/select-menus-tree').then(res => {
          if (res.code === 200) {
            data1.push(res.data)
            data2.push(res.data)
          } else {
            this.message('error', res.message)
          }
          this.departTreeData = data1
          this.expandTreeArr.push(this.departTreeData[0].id)
          this.sortData = data2
          setTimeout(() => {
            this.treeLoading=false
          },500)
        })
      },

      /**
       * 根绝节点信息，获取右侧表格数据
       */
      triggerNode(val) {
        if (val.label) {
          this.disabledfalse.add = false;
          this.disabledfalse.del = false;
          this.disabledfalse.edit = false;
        }
        if (val.parent_id === "1000000") {
          this.disabledfalse.del = true;
          this.disabledfalse.edit = true;
        }
        // if (val.grade == "四级菜单") {
        //   this.disabledfalse.add = true;
        // }
        this.zyId = val.leaf ? val.id : ''
        this.zyName = val.leaf ? val.label : ''
        this.lev = val.leaf
        this.clicknode = val
        this.getTableItems()
      },

      /**
       * 获取表格数据
       */
      getTableItems() {
        this.$http.postJSON('menu-resource/select-menus-resources-menu-id', {
          object: this.zyId ? this.zyId : 14,
          pageNo: this.params.pageNum,
          pageSize: this.params.pageCount
        }).then(res => {
          if (res.code === 200) {
            this.userTableData = res.data ? res.data.list : []
            this.total = res.data ? res.data.totalCount : 0
          } else {
            this.userTableData = []
            this.message('error', res.message)
          }

          //防止表格错位
            $('.content-list').css("padding","0 0 0 11px")
            setTimeout(()=>{
              $('.content-list').css("padding","0 0 0 10px")
            },200)
        })
      },

      /**
       * 数据增删改
       * @param type 0:菜单、1:资源
       */
      addItems(type) {
        this.menuTitle = '新增菜单'
        this.resourceTitle = '新增资源'
        this.form.resourceMenu = type
        this.form.parentId = this.form.menuId = this.clicknode.id
        if (type) {
          this.form.id = ''
          this.form.name=""
          this.form.resourceKey=""
          this.form.path=""
          this.form.sort=""
          this.form.resourceType="1"
          this.addUserDialogVisible = true
        } else {
          this.form.name = ''
          this.form.path = ''
          this.form.icon = ''
          this.form.mageFileUrl=''
          switch (this.clicknode.grade) {
            case null:
              this.form.grade = '一级菜单'
              break
            case '一级菜单':
              this.form.grade = '二级菜单'
              break
            case '二级菜单':
              this.form.grade = '三级菜单'
              break
            case '三级菜单':
              this.form.grade = '四级菜单'
              break
            case '四级菜单':
              this.form.grade = '五级菜单'
              break
            case '五级菜单':
              this.form.grade = '六级菜单'
              break
            case '六级菜单':
              this.form.grade = '七级菜单'
              break
            case '七级菜单':
              this.form.grade = '八级菜单'
              break
            default:
              break
          }
          this.form.id = ''
          this.form.parentName = this.clicknode.label
          this.form.resourceType = '1'
          this.addMenuDialogVisible = true
        }
      },

      /**
       * 统一编辑
       */
      editItems(type, data) {
        this.menuTitle = '编辑菜单'
        this.resourceTitle = '编辑资源'
        this.form.resourceMenu = type
        this.form.grade = this.clicknode.grade

        if (type) {
          data.sort = (data.sort==0||data.sort)?String(data.sort):''
          if (this.idBatch.length > 0) {
            this.form.parentId = this.form.menuId = this.idBatch[0].menuId
            this.form.id = this.idBatch[0].id
            this.form.resourceKey = this.idBatch[0].resourceKey
            this.form.path = this.idBatch[0].path
            this.form.name = this.idBatch[0].name
          } else {
            this.form = Object.assign({}, this.form, data)
          }
          this.addUserDialogVisible = true
        } else {
          this.form.parentId = this.form.menuId = this.clicknode.parent_id
          this.form.id = this.clicknode.id
          this.form.name = this.clicknode.label
          this.form.icon = this.clicknode.icon
          this.form.path = this.clicknode.path
          this.form.position = this.clicknode.leaf
          this.mageUrl = this.clicknode.mage
          this.form.mageFileUrl=''
          this.addMenuDialogVisible = true
        }
      },

      /**
       * 统一删除
       */
      deleteItems(type, id) {
        this.form.resourceMenu = type
        let list = type ? this.idBatch.map(ele => ele.id) : [this.clicknode.id]
        !list.length && list.push(id)
        if (list.length) {
          this.deleteItemData.list = list
          this.deleteItemData.type = type
          this.$confirm('确定删除菜单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: "whetherh",
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.deleteItem()
          }).catch(() => {

          })
        } else {
          this.message('warning', '未选择删除项')
        }
      },
      deleteItem() {
        let list = this.deleteItemData.list
        let type = this.deleteItemData.type
        this.$http.postJSON('menu-resource/delete-menu-resource', {
          list
        }).then(res => {
          if (res.code === 200) {
            this.expandTreeArr = [Number(this.clicknode.parent_id)]
            if (type) {
              this.getTableItems()
            } else {
              this.clicknode = {}
              this.getMenuTreeData()
              this.zyId = ''
              this.getTableItems()
            }



            this.deleteMenuDialogVisible = false
            this.message('success', res.message)
          } else {
            this.message('error', res.message)
          }
        }).catch(() => {

        })
      },
      /**
       * 提交操作
       */
      sureSubmit() {
        this.form.mageFileUrl = this.mageUrl
        if ((!this.form.resourceMenu && this.menuTitle === '新增菜单') || (this.form.resourceMenu && this.resourceTitle == '新增资源')) {
          this.buttonProtect = true
          this.$http.postJSON('menu-resource/insert-menu-resource', this.form).then(res => {
            setTimeout(() => {
              this.buttonProtect = false
            }, 500)
            if (res.code === 200) {
              this.expandTreeArr = [this.clicknode.id]
              this.message('success', res.message)
              if (this.form.resourceMenu) {
                this.getTableItems()
                this.addUserDialogVisible = false
              } else {
                this.getMenuTreeData()
                this.addMenuDialogVisible = false
              }
            } else {
              this.message('error', res.message)
            }
          })
        } else {
          this.buttonProtect = true
          this.$http.postJSON('menu-resource/update-menu-resource', this.form).then(res => {
            setTimeout(() => {
              this.buttonProtect = false
            }, 500)
            if (res.code === 200) {
              this.expandTreeArr = [this.clicknode.id]
              this.message('success', res.message)
              if (this.form.resourceMenu) {
                this.getTableItems()
                this.addUserDialogVisible = false
              } else {
                this.getMenuTreeData()
                this.addMenuDialogVisible = false
              }
            } else {
              this.message('error', res.message)
            }
          })
        }


      },
      checkForm() {
        if (this.form.resourceMenu) {
          this.$refs['form2'].validate((valid) => {
            if (!valid) {
              this.focusAccord()
              return
            } else {
              this.sureSubmit()
            }
          })
        } else {
          this.$refs['form'].validate((valid) => {
            if (!valid) {
              this.focusAccord()
              return
            } else {
              this.sureSubmit()
            }
          })
        }
      },
      /**
       * 批量选择
       */
      handleSelectionChange(val) {
        if (val.length > 1 || val.length == 0) {
          this.editLimit = 1
        } else {
          this.editLimit = 0
          Object.assign(this.form, val[0])
        }
        this.idBatch = val
      },

      /**
       * 分页操作
       * @param val
       */
      handleSizeChange(val) {
        this.params.pageCount = val
        this.getTableItems()
      },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.getTableItems()
      },

      /**
       * 关闭模态框
       */
      closeDialog(judge) {
        if (judge == 1) {
          this.$refs['form'].resetFields();
        } else if (judge == 2) {
          this.$refs['form2'].resetFields();
        }
        // if (this.menuTitle == '新增菜单'){
        //   // this.resetForm('form')
        //   this.$refs['form'].resetFields();
        // }else if (this.resourceTitle == '新增资源') {
        //   // this.resetForm('form2')
        //   this.$refs['form2'].resetFields();
        // }
        setTimeout(() => {
          this.form = {
            id: '',
            parentId: '',
            parentName: '',
            name: '',
            path: '',
            grade: '',
            icon: '',
            sort:'',
            resourceMenu: '',
            resourceKey: '',
            menuId: '',
            position: '',
            resourceType:'1',
            mageFileUrl:""
          }
          this.menuTitle = '新增菜单'
          this.resourceTitle = '新增资源'
        }, 410)
      },

      //排序拖拽
      handleDrop(draggingNode, dropNode, dropType, ev) {
        let arr = dropNode.parent.data.children
        let arr1 = []
        arr.forEach((item, index) => {
          let obj = {
            id: item.id,
            sort: index
          }
          arr1.push(obj)
        })
        this.sortChuanzhi = [...arr1, ...this.sortChuanzhi]
        this.sortCan = []
        for (var i = 0; i < this.sortChuanzhi.length; i++) {
          var flag = true
          for (var j = 0; j < this.sortCan.length; j++) {
            if (this.sortChuanzhi[i].id == this.sortCan[j].id) {
              flag = false
            }
          }
          if (flag) {
            this.sortCan.push(this.sortChuanzhi[i])
          }
        }
        this.sortChuanzhi = JSON.parse(JSON.stringify(this.sortCan))
      },
      //排序确认
      sortgaibianTrue() {
        if (this.sortCan.length == 0) {
          this.sortdialogFormVisible = false
        } else {
          this.buttonProtect = true
          this.$http.postJSON('menu-resource/sort-menu', this.sortCan).then(res => {
            setTimeout(() => {
              this.buttonProtect = false
            }, 500)
            if (res.code === 200) {
              this.message('success', res.message)
              this.sortCan = []
              this.sortdialogFormVisible = false
              this.getMenuTreeData()
            } else {
              this.message('error', res.message)
            }
          })
        }
      },
      sortClick() {
        let data1 = []
        let data2 = []
        this.sortData = []
        this.$http.get('menu-resource/select-menus-tree').then(res => {
          if (res.code === 200) {
            data1.push(res.data)
            data2.push(res.data)
            this.expandTreeArrProp.push(data1[0].id)
          } else {
            this.message('error', res.message)
          }
          this.departTreeData = data1
          this.sortData = data2
        })
        this.sortdialogFormVisible = true
      },
      collapse(moveNode, inNode, type) {
        if (moveNode.level == 2 && inNode.level == 2) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {
          }
        }
        if (moveNode.level == 3 && inNode.level == 3) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {
          }
        }
        if (moveNode.level == 4 && inNode.level == 4) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {
          }
        }
        if (moveNode.level == 5 && inNode.level == 5) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {
          }
        }
        if (moveNode.level == 6 && inNode.level == 6) {
          if (moveNode.parent.id == inNode.parent.id) {0
            return type == 'prev'
          } else {
          }
        }
        if (moveNode.level == 7 && inNode.level == 7) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {
          }
        }
        if (moveNode.level == 8 && inNode.level == 8) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev'
          } else {
          }
        }
      },
      resetForm(formName) {
        setTimeout(()=>{
          try{
            this.$refs[formName] && this.$refs[formName].resetFields();
          } catch (e) {

          }
          },400)
      },
      xuanzhong () {

      },
      toggleSlide() {
        this.isCollapse = !this.isCollapse
      },
      inputSort(value){
        let reg = /[^0-9]/
        this.form.sort = reg.test(this.form.sort)? '' : this.form.sort
      },
      uploadFiles(file, fileList){
          var reader = new FileReader();
          reader.readAsDataURL(file.raw);
          var that = this
          reader.onload = function(){
              // console.log(reader.result); //获取到base64格式图片
              that.mageUrl = reader.result
          };
      },
      beforeAvatarUpload(file){
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.message('error', '上传图片大小不能超过5MB！');
        }
        return isLt5M
      }
    },
    computed: {},
  }

</script>

<style scoped lang="scss">
  #menu-manage {
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
    .avatar-uploader-icon {
      border: 1px dashed #8c939d;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 100px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    &.checkUser1{
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      // padding:20px 32px 35px 31px;
      @import '@/assets/css/menu-tree.scss';
      .content-list {
        flex: 1;
        padding: 0 0 0 10px;
        overflow-x: hidden;
      }
    }
    &.checkUser2{
      width: 100%;
      @import '@/assets/css/menu-tree.scss';
      transition: all .3s ease-in-out;
      .content-list {
        flex: 1;
        padding: 0 0 0 10px;
        overflow-x: hidden;
      }
    }
  }

</style>

<style lang="scss">
  #menu-manage {
    .el-switch.is-checked .el-switch__core {
      background: #4877E7 !important;
      border-color: #4877E7 !important;
      color: #fff !important;
    }


    .el-tree-node__content {
      height: 36px;
      line-height: 36px;
      color: #333;
      font-size: 14px;
    }

    .userTree .is-current > .el-tree-node__content {
      background-color: #e7e7e7 !important;
      color: #333;
    }

    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .content_scroll .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .userTree {
      margin-top: 0;
      background-color: transparent;
    }

    .el-input--mini .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
    .red-tip {
      color: red;
      padding-bottom: 30px;
      text-align: center;
    }

    .el-pager li.active {
      color: white
    }

    .dialog-text {
      text-align: center;
      font-size: 15px;
    }
  }
</style>
