<template>
  <div id="departTree">
    <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="departTreeVisible" width="500px" class="proupClass">
      <span>
         <el-tree ref="departTrees" check-strictly :data="departTreeData" node-key="id" @check-change="changeClick"
                  :props="defaultProps" show-checkbox check-on-click-node :default-expanded-keys='expandedArr'></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="departTreeVisible = false" class="proupbtnquxiao">取 消</el-button>
        <el-button type="primary" @click="treeBtn" class="proupbtnqueding">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: ["module","departId","moduleTree"],
    data() {
      return {
        title: "选择单位",
        departTreeVisible: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        departTreeData:[],
        expandedArr:[]
      }
    },
    methods: {
      //tree节点选中状态发生变化时的回调
      changeClick(val, isSele, isnode) {
        if (isSele) {
          this.$refs.departTrees.setCheckedKeys([val.id])
        }
      },

      treeBtn(){
        this.$emit('success',this.$refs.departTrees.getCheckedNodes())
        this.departTreeVisible = false
      },
      //弹出属性结构  默认回显
      propDepname() {
          this.$nextTick(() => {
            this.$refs.departTrees.setCheckedKeys([this.departId])
          })
      },
      getDeparment(){
        /**
         * departmentTree  代表组织结构树
         * companyTree 代表个人所看到的企业树
         */
        let url
        let params
        if(this.moduleTree=='departmentTree'){
          url = 'department2/selectDepartmentByExample'
          params = {
            "parentId": "10000000"
          }
        }else if(this.moduleTree=='companyTree'){
          url = 'tCorp/selectAll'
          params = {
            id:JSON.parse(sessionStorage.personal).id
          }
        }
        this.treeLoading = true
          this.$http.postJSON(url, params).then(res => {
            if (res.code === 200) {
              this.departTreeData = res.data
              if (res.data) {
                this.departTreeData.forEach(item => {
                  item.disabled = true
                  this.expandedArr.push(item.id)
                })

              }
            } else {
              this.departTreeData = []
            }
          })
      }
    },
    watch: {
      module(val) {
        if(val){
          this.departTreeVisible = true
          this.getDeparment()
        }
      },
      departTreeVisible(val) {
        if (!val) {
          this.$emit('close')
        } else {
          this.propDepname()
        }
      }
    },
    mounted() {
        this.getDeparment()
    }
  }

</script>
<style scoped lang="scss">
</style>
<style lang="scss">
</style>
