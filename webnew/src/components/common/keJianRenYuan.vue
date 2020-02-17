<template>
  <div id="tabOrganization">
    <!--"module" 组件隐藏显示
        "selected" 默认回显的数据

        @success 成功时的回调
        @close 成功是的回调
     -->
    <el-dialog v-dialogDrag v-if="organizationVisible" :close-on-click-modal="false" title="组织架构"
               class="proupClass proupClassSe" :visible.sync="organizationVisible"
               width="1000px" center>
      <div class="clearfix">
        <el-row :gutter="40">
          <el-col :span="8" style="border-right:1px solid #EEEEEE;">
            <el-tree
                :check-strictly="true"
                :render-after-expand="false"
                check-on-click-node
                :expand-on-click-node="true"
                :data="qiYeData"
                show-checkbox
                node-key="id"
                :props="defaultProps"
                @check="checkFc"
                :default-checked-keys="departIdList"
                :default-expanded-keys='expendArr'
                ref="qiYeTree">
            </el-tree>
          </el-col>
          <el-col :span="8" style="border-right:1px solid #EEEEEE;">
            <div class="title">
              <span class="titlebiaoti titlebiaotiTs" style="display: inline-block;">人员</span>
              <el-button type="text" class="cleanText" style="background: none;" @click="handleCheckAllChange">全选
              </el-button>
              <div class="search-box">
                <el-input type="index" v-model.trim="searchContent" clearable placeholder="请输入"
                          class="search-user"></el-input>
                <el-button class="normalBtn searchUserBtn" @click="fuzzySearch(searchContent)">查询</el-button>
              </div>

            </div>
            <div class="content departContent" v-loading="treeLoading2">
              <el-checkbox-group v-model="checkedUsers">
                <div v-for="(user,index) in userListNew" :key="index">
                  <el-checkbox :label="user.id" @change="userChange(user)">{{user.label}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="title">
              <span class="titlebiaoti">已选 {{selectDepartList.length}}</span>
              <el-button type="text" class="cleanText" style="background: none;" @click="clearRoleList">清空</el-button>
            </div>
            <div class="content departContent">
              <div v-for="role in selectDepartList" class="tagBox" :key="role.id">
                <el-tag :key="role.id" closable @close="handleClose(role)">
                   <elli-tooltip :rows="1" :value="role.label||''"></elli-tooltip>
                </el-tag>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeModule">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addUsersTrue" :loading="isSureClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: ["module", "selected"],
    data() {
      return {
        qiYeData: [],//部门树数据
        userList: [],//用户列表
        checkedUsers: [],//已选用户id
        selectDepartList: [],//已选用户
        yetUsers: [], //已经选的人员

        organizationVisible: false,

        departList: [],
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        },
        isSureClick: false,
        clickData: {},
        searchContent: "",
        departIdList: [],
        activeName: "",
        concatObj: {},
        userListNew: [],
        qiehuanChildren: false,
        treeLoading2: false,
        expendArr:[]
      }
    },
    methods: {
      closeModule() {
        this.selectDepartList = []
        this.departIdList = []
        this.organizationVisible = false
        this.searchContent = ""
      },
      //清空所选人员
      clearRoleList() {
        this.checkedUsers = []
      },
      //全选所有人员
      handleCheckAllChange(val) {
        this.userListNew.forEach(v => {
          if (!this.yetUsers.filter(el => el.id === v.id).length) {
            this.yetUsers.push(v)
          }
        })
        this.checkedUsers = val ? this.userListNew.map(el => el.id) : [];

      },
      //关闭标签
      handleClose(tag) {
        this.checkedUsers.splice(this.checkedUsers.indexOf(tag.id), 1)
      },
      //获得改变的node节点
      getchangeData(data, isSelect) {
        let checked = this.$refs.qiYeTree.getCheckedNodes()
        if (checked.length) {
          let list = checked.map(el => {
            return {
              deptId: el.id
            }
          })
          let list2 = []
          if(this.selectDepartList.filter(el=>
            el.deptId == data.id
          ).length>0&&!isSelect) {
            list2 = [{
              deptId: data.id
            }]
          }
          list = list.concat(list2).map(el=>el.deptId)
          this.treeLoading2 = true


          this.$http.postJSON("member/selectAllCorpMember", list).then(res => {
            setTimeout(() => {
              this.treeLoading2 = false
            }, 200)
            if (res.code === 200) {
              if (res.data) {
                this.userList = res.data
                this.concatObj.qiYeTree = {}
                this.userList.forEach((el) => {
                  this.concatObj.qiYeTree[el.id] = [el.label + '(' + el.dept + ')', el.deptId,el.dutyId]
                })
                let arr = []
                let obj = {}
                
                for (let item in this.concatObj) {
                  for (let iten in this.concatObj[item]) {
                    if (!obj[iten]) {
                      arr.push({
                        id: iten,
                        label: this.concatObj[item][iten][0],
                        deptId: this.concatObj[item][iten][1],
                        dutyId:this.concatObj[item][iten][2]
                      })
                      obj[iten] = true
                    }
                  }
                }
                this.userListNew.forEach(el => {
                  this.checkedUsers.forEach(vl => {
                    if (el.id == vl) {
                      if (!obj[vl]) {
                        arr.push(el)
                        obj[vl] = true
                      }
                    }
                  })
                })
                this.userListNew = arr
                let arsp = []
                this.checkedUsers.forEach((el) => {
                  if (this.userListNew.filter(vl => vl.id == el).length > 0) {
                    arsp.push(el)
                  }
                })
                this.checkedUsers = arsp
                this.departIdList = arr.map(el => el.deptId)
                let depart = checked.map(el => el.id)
                // this.checkedUsers = this.selectDepartList.filter(v => depart.includes(v.deptId)).map(el=>el.id)
                // this.checkedUsers = this.departIdList.filter(v => depart.includes(v.deptId)).map(el=>el.id)
              } else {
                this.userList = []
                this.concatObj.qiYeTree = {}
                this.userList.forEach((el) => {
                  this.concatObj.qiYeTree[el.id] = [el.label + '(' + el.dept + ')', el.deptId,el.dutyId]
                })
                let arr = []
                let obj = {}
                for (let item in this.concatObj) {
                  for (let iten in this.concatObj[item]) {
                    if (!obj[iten]) {
                      arr.push({
                        id: iten,
                        label: this.concatObj[item][iten][0],
                        deptId: this.concatObj[item][iten][1],
                        dutyId:this.concatObj[item][iten][2]
                      })
                      obj[iten] = true
                    }
                  }
                }
                this.userListNew.forEach(el => {
                  this.checkedUsers.forEach(vl => {
                    if (el.id == vl) {
                      if (!obj[vl]) {
                        arr.push(el)
                        obj[vl] = true
                      }
                    }
                  })
                })
                this.userListNew = arr
                let arsp = []
                this.checkedUsers.forEach((el) => {
                  if (this.userListNew.filter(vl => vl.id == el).length > 0) {
                    arsp.push(el)
                  }
                })
                this.checkedUsers = arsp
                this.departIdList = arr.map(el => el.deptId)
              }
            }
          })
        } else {
          this.userList = []
          this.concatObj.qiYeTree = {}
          this.userList.forEach((el) => {
            this.concatObj.qiYeTree[el.id] = [el.label + '(' + el.dept + ')', el.deptId,el.dutyId]
          })
          let arr = []
          let obj = {}
          for (let item in this.concatObj) {
            for (let iten in this.concatObj[item]) {
              if (!obj[iten]) {
                arr.push({
                  id: iten,
                  label: this.concatObj[item][iten][0],
                  deptId: this.concatObj[item][iten][1],
                  dutyId:this.concatObj[item][iten][2]
                })
                obj[iten] = true
              }
            }
          }
          this.userListNew.forEach(el => {
            this.checkedUsers.forEach(vl => {
              if (el.id == vl) {
                if (!obj[vl]) {
                  arr.push(el)
                  obj[vl] = true
                }
              }
            })
          })
          this.userListNew = arr
          let arsp = []
          this.checkedUsers.forEach((el) => {
            if (this.userListNew.filter(vl => vl.id == el).length > 0) {
              arsp.push(el)
            }
          })
          this.checkedUsers = arsp
          this.departIdList = arr.map(el => el.deptId)
          this.selectDepartList = []
        }
      },
      userChange(val) {
        if (!this.yetUsers.filter(el => el.id === val.id).length) {
          this.yetUsers.push(val)
        }
      },
      //确认btn
      addUsersTrue() {
        this.searchContent = ""
        this.isSureClick = true;
        this.$emit('success', this.selectDepartList)
        this.organizationVisible = false
      },
      /**
       * 获取部门树
       */
      getTreeData(val) {
        let params = {
          id:JSON.parse(sessionStorage.personal).id
        }
        this.$http.postJSON("tCorp/selectAll", params).then(res => {
            if (res.code === 200) {
              this.qiYeData = res.data
              this.qiYeData.forEach(el=>{
                this.expendArr.push(el.id)
              })
            } else {
              this.qiYeData = []
              this.expendArr = []
            }
          })
      },
      fuzzySearch(val) {
        if (val.length) {
          let peopleList = []
          this.userListNew.map((el) => {
            // if(el.loginName.indexOf(val)!=-1 || el.departmentName.indexOf(val)!=-1){
            //   peopleList.push(el)
            // }
            if (el.label.indexOf(val) != -1) {
              peopleList.push(el)
            }
          })
          this.userListNew = peopleList
          this.concatObj.qiYeTree = {}

        } else {
          this.getchangeData()
        }
      },
      clickDeal(currentObj, treeStatus) {
        // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
        let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
        // 选中
        if (selected !== -1) {
          // 子节点只要被选中父节点就被选中
          // this.selectedParent(currentObj)
          // 统一处理子节点为相同的勾选状态
          this.uniteChildSame(currentObj, true)

          this.getchangeData(currentObj, true)
        } else {
          // 未选中 处理子节点全部未选中
          if (currentObj.children.length !== 0) {
            this.uniteChildSame(currentObj, false)
            this.getchangeData(currentObj, true)
          } else {
            this.getchangeData(currentObj, true)
          }
        }
      },
      // selectedParent (currentObj) {
      //   // console.log(currentObj)
      //   let currentNode = this.$refs[this.activeName][0].getNode(currentObj)
      //   if (currentNode.parent.key !== undefined) {
      //     this.$refs[this.activeName][0].setChecked(currentNode.parent, true)
      //     this.selectedParent(currentNode.parent)
      //   }
      // },
      // 统一处理子节点为相同的勾选状态
      uniteChildSame(treeList, isSelected) {
        this.$refs.qiYeTree.setChecked(treeList.id, isSelected)
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected)
        }
      },
      checkFc(currentObj, treeStatus) {
        if (this.qiehuanChildren) {
          this.clickDeal(currentObj, treeStatus)
        } else {
          let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
          if (selected !== -1) {
            this.getchangeData(currentObj, true)
          } else {
            this.getchangeData(currentObj, false)
          }
        }
      }
    },
    watch: {
      module(val) {
        if (val) {
          this.organizationVisible = true
          this.isSureClick = false;
          this.concatObj = {}
          if (this.selected) {
            let userArr = []
            JSON.parse(JSON.stringify(this.selected)).forEach(el=>{
              if(el.dept){
                el.label = el.label+'('+el.dept+')'
              }
              userArr.push(el)
            })

            this.yetUsers = userArr
            this.checkedUsers = JSON.parse(JSON.stringify(this.selected)).map(el => el.id)
            this.departIdList = JSON.parse(JSON.stringify(this.selected)).map(el => el.deptId)
            this.userListNew = userArr
            this.$nextTick(() => {
              this.$refs.qiYeTree.setCheckedKeys(this.departIdList);
            })
          } else {
            this.yetUsers = []
            this.checkedUsers = []
            this.concatObj = {}
          }
        }
      },
      organizationVisible(val) {
        if (!val) {
          this.$emit('close')
          this.checkedUsers = []
        }else{
            this.getTreeData()
        }
      },
      checkedUsers(val) {
        this.selectDepartList = val.map(el => {
          return this.yetUsers.filter(v => v.id === el)[0]
        })
      },

    },
    mounted() {
        
    }

  }

</script>
<style scoped lang="scss">
  .title {
    overflow: hidden;

    .titlebiaoti {
      font-size: 16px;
      line-height: 38px;
      color: #999;
    }
    .titlebiaotiTs {
      display: block
    }

    .cleanText {
      color: #1960CB;
      float: right;
      font-size: 16px;
      border-bottom: 1px solid #1960CB;
      padding: 0;
      margin-top: 10px;
    }
  }

  .departContent {
    height: 400px;
    overflow: auto;
    margin-top: 15px;
  }

  .search-box {
    overflow: hidden;
    margin-bottom: 10px;
  }

  .search-user {
    width: 200px;
    display: block;
    float: left;
  }

  .searchUserBtn {
    float: left;
    margin-left: 10px;
  }
</style>
<style lang="scss">
  #tabOrganization {
    .proupClassSe {
      .topSty {
        font-size: 18px;
        padding: 15px 0;

        .el-tag {
          margin-right: 15px;
          margin-bottom: 5px;
          font-size: 13px;
        }

        .organ {
          &:hover {
            cursor: pointer
          }

        }
      }

      .el-row {
        border: 1px solid rgb(238, 238, 238);

        .el-col.el-col-12 {
          margin: 20px 0;

          .inputBox {
            margin-bottom: 20px
          }
        }
      }

      .content {
        .el-tag {
          border: 0;
          background: #ffffff;
          font-size: 14px;
          color: #666;
          width: 100%;
          overflow: hidden;
          height: 26px;

          .el-tag__close {
            float: right;
            top: 8px;
            font-size: 16px;
            background: #CCC;
            color: #fff;
          }
        }
      }

      .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
        background-color: #409EFF;
        border-color: #409EFF;
      }

      /* 弹窗顶部样式 */

      .el-dialog__body {
        overflow: hidden;
        // padding: 25px;
        max-height: 700px;
      }
    }
    .el-tree-node>.el-tree-node__children{
      overflow: inherit;
    }
    .tagBox{
      position: relative;
       .el-tag__close {
        position: absolute;
        right: 2px;
        font-size: 16px;
        background: #CCC;
        color: #fff;
      }
    }
  }

</style>
