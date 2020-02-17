<template>
  <div class="wrapper log-manage" id="log-manage">
     <div class="search-bar">
      <ul class="search-fl">
        <li class="search-msg">
          <span class="liText">账号：</span>
          <el-input v-model.trim="conditionForm.items.operatorName" size="small" clearable placeholder="请输入"
                  @keyup.enter.native="getTableItems" class="nameText"></el-input>
        </li>
        <li class="search-msg">
          <span class="liText">开始时间：</span>
          <el-date-picker v-model="pickerStartTime" size="small" type="date" :picker-options="pickerStartTimeOptions"
                        placeholder="请选择" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
        </li>
        <li class="search-msg">
          <span class="liText">结束时间：</span>
          <el-date-picker v-model="pickerEndTime" size="small" type="date" :picker-options="pickerEndTimeOptions"
                        placeholder="请选择" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
        </li>
        <li>
          <el-button type="primary" size="small" @click="getTableItems" class="blueBtn"><i class="icon iconfont icon-chaxunicon"></i>查询</el-button>
        </li>

      </ul>
    </div>
    <section v-loading="tableLoading">
      <el-table :data="tableItemsData" :height="$store.state.app.maxTableHeight - 270" border header-row-class-name="table-header-style">
        <el-table-column prop="operatorName" align="center" width="150" label="账号"></el-table-column>
        <el-table-column prop="createtime" align="center" width="200" label="操作时间"></el-table-column>
        <el-table-column prop="methodName" align="center" show-overflow-tooltip min-width="200" label="操作对象"></el-table-column>
        <el-table-column prop="consumeTime" align="center" width="165" label="响应时间(毫秒)"></el-table-column>
        <el-table-column align="center" width="140" label="详情">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="underlineBlue" @click="showMessageDetail(scope.row.requestMessage, dialogTitle = '请求报文')">
              请求报文
            </el-button>
            <!-- <el-button type="text" size="small" class="underline" style="color:#409EFF" @click="showMessageDetail(scope.row.responseMessage, dialogTitle = '返回报文')">
              返回报文
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </section>
    <footer>
      <el-pagination layout="total, sizes, prev, pager, next, jumper" background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :page-sizes="[30, 50, 100]"
                     :page-size="conditionForm.pages.pageCount"
                     :total="conditionForm.pages.total"
                     :current-page="conditionForm.pages.pageNum">
      </el-pagination>
    </footer>

    <el-dialog :title="dialogTitle" :visible.sync="messageVisible" v-if="messageVisible" v-dialogDrag :close-on-click-modal="false" class="proupClass" width="400px">
      <code>{{message}}</code>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="messageVisible = false" class="proupbtnqueding">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import paginationMixin from '@/mixins/paginations.js'

  export default {
    mixins: [paginationMixin],
    data () {
      return {
        conditionForm: {
          items: {
            operatorName: '',
            begin_time: '',
            end_time: ''
          },
          pages: {
            sortname: 'CREATETIME',
            sortorder: 'desc'
          }
        },
        tableItemsData: [],
        dialogTitle: '',
        message: '',
        messageVisible: false
      }
    },
    mounted () {
      this.getTableItems()
    },
    methods: {
      getTableItems () {
        this.conditionForm.items.begin_time = this.pickerStartTime
        this.conditionForm.items.end_time = this.pickerEndTime
        this.tableLoading = true
        this.$http.postJSON('traceLog/select-logs', this.conditionForm).then(res => {
          if (res.code === 200) {
            this.tableItemsData = res.data.list
            this.conditionForm.pages.pageNum = res.data.pageNum
            this.conditionForm.pages.total = res.data.totalCount
            setTimeout(() => {
              this.tableLoading = false
            }, 300)
          } else {
            this.$message.error('获取数据失败')
          }
        })
      },

      showMessageDetail (value) {
        this.messageVisible = true
        this.message = value
      }
    }
  }
</script>
<style scoped lang="scss">
#log-manage{
  padding:20px 32px 35px 31px;
  .nameText{
    width: 250px;
  }
}
</style>
