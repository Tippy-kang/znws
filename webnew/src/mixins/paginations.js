export default {
  data () {
    return {
      conditionForm: {
        items: {
          // 条件
        },
        pages: {
          sortname: 'id', // 排序类别
          sortorder: 'desc', // 正序反序
          pageNum: 1, // 当前页码
          pageCount: 30 // 每页数据数
        }
      },
      total: 0, //数据总条数
      pickerStartTime: '', // 时间区间选择 -- 开始时间
      pickerEndTime: '',   // 时间区间选择 -- 结束时间
      pickerStartTimeOptions: {
        disabledDate (time) {
          return null
        }
      },
      pickerEndTimeOptions: {
        disabledDate (time) {
          return null
        }
      },
      // maxTableHeight: 500,
      tableLoading: false,
      multipleSelection: []
    }
  },
  watch: {
    pickerStartTime (value) {
      // 开始时间影响结束时间的选择范围
      this.pickerEndTimeOptions = {
        disabledDate (time) {
          return value ? time.getTime() < new Date(value) : null
        }
      }
    },
    pickerEndTime (value) {
      // 结束时间影响开始时间的选择范围
      this.pickerStartTimeOptions = {
        disabledDate (time) {
          return value ? time.getTime() > new Date(value) : null
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    handleSizeChange (val) {
      this.conditionForm.pages.pageNum = 1
      this.conditionForm.pages.pageCount = val
      this.getTableItems()
    },
    handleCurrentChange (val) {
      this.conditionForm.pages.pageNum = val
      this.getTableItems()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }

  }
}
