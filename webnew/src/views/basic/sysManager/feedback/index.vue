<template>
    <div id="feedback" class="commonPadding">
        <div class="search-bar">
            <ul class="search-fl">
                <li class="search-msg">
                    <span class="liText">意见标题：</span>
                    <el-input v-model="searchForm.title" placeholder="请输入" type="text" clearable style="width:170px"></el-input>
                </li>
                <li class="search-msg">
                    <span class="liText">是否解决：</span>
                    <el-select v-model="searchForm.status" placeholder="请选择" clearable class="solve-style">
                        <el-option v-for="(item,index) in resolve" :key="index" :label="item.value" :value="item.type">
                        </el-option>
                    </el-select>
                </li>  
                <li>
                    <el-button type='primary' size='medium' class="blueBtn" @click="getTableItems"><i class="icon iconfont icon-chaxunicon"></i>查询</el-button>
                </li>  
                <li>
                    <el-button type='primary' size='medium' class="blueBtn" @click="addTable"><i class="icon iconfont icon-xinzengicon"></i>新增</el-button>
                </li>
            </ul>
        </div>
        <div class="tables">
            <el-table :data="tableData" stripe border v-loading="tableLoading" :height="$store.state.app.maxTableHeight - 265"
                element-loading-text="系统正在获取数据" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.9)">
                <el-table-column prop="title" type="index" label="序号" width="70">
                </el-table-column>
              <el-table-column prop="title" label="意见标题" min-width="100">
                <template slot-scope="scope">
                    <!-- <el-button size="small" type="text" class="underline" style="color:#1660c7" @click="openDetail(scope.row)">
                        <elli-tooltip :rows="3" :value="scope.row.title||''"></elli-tooltip>
                    </el-button> -->
                    <elli-tooltip :rows="3" :value="scope.row.title||''"></elli-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="msg" label="意见详情" min-width="100">
                <template slot-scope="scope">
                    <elli-tooltip :rows="3" :value="scope.row.msg||''"></elli-tooltip>
                </template>
              </el-table-column>
                <el-table-column prop="createName" label="提出人" width="140">
                </el-table-column>
                <el-table-column prop="file" label="意见附件" min-width="100">
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.file" :key="index">
                            <el-button  class="underline" style="color:#1660c7" @click="xiazaiSuccess(item)">
                                <elli-tooltip :rows="1" :value="item.name"></elli-tooltip>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createtime" label="反馈时间" width="170">
                </el-table-column>
                <el-table-column prop="createName" label="处理状态" width="140">
                    <template slot-scope="scope">
                        <div :style="`color:${resolve.filter(ele => ele.type == scope.row.status)[0].color}`">{{resolve.filter(ele => ele.type == scope.row.status)[0].value}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" class="underline" style="color:#1660c7" @click="resolveClick(scope.row,'查看')" :disabled="scope.row.status==0">查看</el-button>
                        <el-button size="small" type="text" v-if="scope.row.status==0&&$_has('resolveClick')" class="underline" style="color:#1660c7" @click="resolveClick(scope.row,'处理')">处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="conditionForm.pages.pageNum"  :current-page.sync = "conditionForm.pages.pageNum"
                :page-sizes="[30, 50,100]" :page-size="conditionForm.pages.pageCount" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="titles" width="600px" :close-on-click-modal="false" v-dialogDrag v-if="feedbackVisible" :visible.sync="feedbackVisible"
            class="proupClass" @close='closeBtn' @closed="btnLoading = false">
            <el-form :model="feedbackForm"  ref="feedbackForm" :rules="rules" label-width="90px">
                <el-form-item label="意见标题：" prop="title">
                    <el-input v-model.trim="feedbackForm.title" placeholder="请输入" :disabled="isDetail" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="意见详情：" prop="msg">
                    <el-input v-model="feedbackForm.msg" type="textarea" :disabled="isDetail" placeholder="请输入" :autosize="{ minRows: 12, maxRows: 16}" show-word-limit maxlength="500"></el-input>
                </el-form-item>
                <el-form-item label="反馈附件：" v-if="titles=='新增意见'">
                    <!-- <el-upload class="upload-demo" :action="uri" :limit="1" :on-change="uploadingFiles" multiple name="file" with-credentials
                        :file-list="feedbackForm.file" :on-success="uploadFiles" :before-remove="removeFile" :on-exceed="handleExceed"
                        ref="upwenjian">
                        <el-button size="mini" type="primary" class="normalBtn">选择文件</el-button>
                    </el-upload> -->
                    <file-upload :limit="4" :action="uri" :isdelete="isfiledelete" ref="upwenjian" :file-list="feedbackForm.file"></file-upload>
                </el-form-item>
                <el-form-item label="附件内容：" v-else>
                    <div v-for="(item,index) in feedbackForm.file" :key="index"><el-button @click="xiazaiSuccess(item)" type="text" class="accessory">{{item.name}}</el-button></div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="titles=='意见详情'">
                <el-button  class="proupbtnqueding" @click="closeBtn">关 闭</el-button>
            </div>
            <div slot="footer" class="dialog-footer" v-else>
                <el-button class="proupbtnquxiao" @click="closeBtn">取 消</el-button>
                <el-button  class="proupbtnqueding" :loading="btnLoading" type="primary" @click="feedbackTrue">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 处理反馈弹框 -->
        <el-dialog :title="solveTitles" width="600px" :close-on-click-modal="false" v-dialogDrag v-if="resolveFeedbackVisible"
      :visible.sync="resolveFeedbackVisible" class="proupClass" @close='resolveCloseBtn'>
      <el-form :model="solveFeedback" ref="solveFeedback" :rules="solveFeedbackRules" label-width="90px">
        <el-form-item label="处理状态：">
            <div :style="`color:${resolve.filter(ele => ele.type == solveFeedback.status)[0].color}`">{{resolve.filter(ele => ele.type == solveFeedback.status)[0].value}}</div>
        </el-form-item>
        <el-form-item label="处理时间：" prop="feedbackTime" v-if="resolveDisabled">
            <el-date-picker  v-model="solveFeedback.feedbackTime" type="datetime" placeholder="请选择" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="处理说明：" prop="feedbackMsg">
          <el-input v-model="solveFeedback.feedbackMsg" type="textarea" placeholder="请输入"
            :autosize="{ minRows: 12, maxRows: 16}" show-word-limit :disabled="resolveDisabled" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="附件材料：">
          <!-- <el-upload class="upload-demo" v-if="!resolveDisabled" :action="uri" multiple :limit="10" :on-change="uploadingFiles" name="file" with-credentials
            :file-list="solveFeedback.feedbackFile" :on-success="uploadFiles" ref="upwenjian" :before-remove="removeFile" :on-exceed="handleExceed">
            <el-button size="mini" type="primary" class="normalBtn">选择文件</el-button>
          </el-upload> -->
          <file-upload v-if="!resolveDisabled" :limit="4" :action="uri"  :isdelete="isfiledelete" ref="upwenjian"   :file-list="solveFeedback.feedbackFile"  ></file-upload>
          <div v-else v-for="(item,index) in solveFeedback.feedbackFile" :key="index"><el-button @click="xiazaiSuccess(item)" type="text" class="accessory">{{item.name}}</el-button></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="resolveDisabled">
        <el-button  class="proupbtnqueding" @click="resolveCloseBtn">关 闭</el-button>
      </div>
      <div slot="footer" v-else class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="resolveCloseBtn">取 消</el-button>
        <el-button class="proupbtnqueding" :loading="btnLoading" type="primary" @click="resolveTrue">确 定</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
import pagination from '@/mixins/paginations.js'
export default {
    mixins: [pagination],
    data(){
        return{
            //查询接口
            searchForm:{
                title:"",
                status:""
            },
            total:0,
            addType:[
                {
                    type:"1",
                    value:'社会问题'
                }
            ],
            resolve:[
                {
                    type:"1",
                    value:'已解决',
                    color:'#1a6bdc'
                },
                {
                    type:"0",
                    value:'未解决',
                    color:'#f50000'
                }
            ],
            tableLoading:false,
            tableData:[],
            titles:'新增意见',
            feedbackVisible:false,
            feedbackForm:{
                title:"",
                msg:"",
                file:[]
            },
            uri:`${this.$http.baseHost}file/upload`,
            isDetail:false,
            rules:{
                msg:[{ required: true, message: '请输入意见详情', trigger: 'blur' }],
                title:[{ required: true, message: '请输入意见标题', trigger: 'blur' }]
            },
            btnLoading:false,
            removeFiles:[],
            solveFeedbackRules:{
                feedbackMsg:[{ required: true, message: '请输入处理说明', trigger: 'blur' }]
            },
            solveFeedback:{
                feedbackMsg:"",
                feedbackFile:[],
                id:'',
                feedbackTime:"",
                status:"0"
            },
            solveTitles:'处理详情',
            resolveFeedbackVisible:false,
            resolveDisabled:false ,
            isfiledelete:false
        }
    },
    mounted(){
        this.getTableItems()
    },
    methods:{
        getTableItems(){
            let params={
                title:this.searchForm.title,
                status:this.searchForm.status,
                createId:this.$_has('resolveClick')?"":JSON.parse(sessionStorage.personal).id,	
                rowNum:this.conditionForm.pages.pageNum,
                pageCount:this.conditionForm.pages.pageCount
                
            }
            this.tableLoading=true
            this.$http.postJSON('feedBack/select', params).then(res=>{
                if(res.code==200){
                    this.tableData=res.data.list
                    this.total = res.data.totalCount
                    this.tableData.forEach(el=>{
                        el.file=el.file?JSON.parse(el.file):[]
                        el.feedbackFile=el.feedbackFile?JSON.parse(el.feedbackFile):[]
                    })
                }else{
                    this.message('error',res.message)
                }
                setTimeout(()=>{
                    this.tableLoading=false
                },500)
            })
        },
        addTable(){
            this.removeFiles=[]
            this.feedbackForm={
                msg:"",
                file:[]
            }
            this.feedbackVisible = true
            this.isfiledelete = false
        },
        closeBtn(){
            this.feedbackForm={
                msg:"",
                file:[]
            }
            this.$refs.feedbackForm.resetFields()
            this.feedbackVisible = false
        },
        feedbackTrue(){
            let filePath = JSON.stringify(this.$refs.upwenjian.uploadFiles.map(item=>{
                if(item.response){
                    return {
                    id: item.response.data.id,
                    name: item.response.data.fileName
                    }
                }else{
                    return {
                    id: item.id,
                    name: item.name
                    }
                }
            }))
            this.feedbackForm.msg = this.feedbackForm.msg?this.feedbackForm.msg.trim():''
            this.$refs.feedbackForm.validate((valid) => {
                if (valid) {
                    let params={
                        msg: this.feedbackForm.msg,
                        file:filePath||"",
                        title:this.feedbackForm.title,
                        createId: JSON.parse(sessionStorage.personal).id,
                        createName: JSON.parse(sessionStorage.personal).loginName
                    }
                    this.btnLoading=true
                    this.isfiledelete = true
                    this.$http.postJSON('feedBack/insert', params).then(res=>{
                        if(res.code==200){
                            if(this.removeFiles.length){
                                this.deleFiles(this.removeFiles)
                            }
                            this.message('success',res.message)
                           this.feedbackVisible = false
                           this.getTableItems()
                        }else{
                            this.message('error',res.message)
                        }
                        setTimeout(()=>{
                            this.btnLoading=false
                        },500)
                    })
                } else {
                    return false;
                }
            })
        },
        uploadingFiles(file, fileList){
            if(file.response){
                this.btnLoading = false
            }else{
                this.btnLoading=true
            }
        },
        removeFile(file, fileList){
            if (file.response) {
                this.removeFiles.push(file.response.data.id)
            }else{
                this.removeFiles.push(file.id)
            }
        },
        openDetail(row){
            this.titles='意见详情'
            this.isDetail=true
            this.feedbackForm=JSON.parse(JSON.stringify(row))
            this.isfiledelete = false
            this.feedbackVisible=true
        },
        xiazaiSuccess(val){
            this.$http.postFileOut("file/downloadFile",{"id":val.id}).then(res=>{
                const content = res;
                const blob = new Blob([content]);
                const fileName = val.name; //下载的文件名称
                if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
                } else { // IE10+下载
                    navigator.msSaveBlob(blob, fileName);
                }
            // }
            })
        },
        //处理反馈意见
        resolveClick(row,val){
            if(val=='查看'){
                this.solveFeedback.feedbackMsg=row.feedbackMsg
                this.solveFeedback.feedbackFile = row.feedbackFile
                this.solveFeedback.feedbackTime=row.feedbackTime
            }else{
                this.solveFeedback.feedbackMsg=''
                this.solveFeedback.feedbackFile = []
                this.solveFeedback.feedbackTime=''
            }
            
            this.removeFiles=[]
            this.solveFeedback.status=row.status
            this.solveFeedback.id=row.id
            this.resolveDisabled=row.status==1?true:false

            this.isfiledelete = false
            this.resolveFeedbackVisible = true
            
        },
        resolveCloseBtn(){
            this.solveFeedback={
                feedbackMsg:"",
                feedbackFile:[],
                feedbackTime:"",
                id:"",
                status:"0"
            }
            this.$refs.solveFeedback.resetFields()
            this.resolveFeedbackVisible = false
        },
        resolveTrue(){
            let filePath = JSON.stringify(this.$refs.upwenjian.uploadFiles.map(item=>{
                if(item.response){
                    return {
                    id: item.response.data.id,
                    name: item.response.data.fileName
                    }
                }else{
                    return {
                    id: item.id,
                    name: item.name
                    }
                }
            }))
            this.solveFeedback.feedbackMsg = this.solveFeedback.feedbackMsg?this.solveFeedback.feedbackMsg.trim():''
            this.$refs.solveFeedback.validate((valid) => {
                if (valid) {
                    let params={
                        id:this.solveFeedback.id,
                        feedbackPeople:JSON.parse(sessionStorage.personal).loginName,
                        feedbackMsg:this.solveFeedback.feedbackMsg,
                        feedbackFile:filePath
                    }
                    this.btnLoading=true

                    this.isfiledelete = true
                    this.$http.postJSON('feedBack/updateDetails', params).then(res=>{
                        if(res.code==200){
                            if(this.removeFiles.length){
                                this.deleFiles(this.removeFiles)
                            }
                            this.message('success',res.message)
                            this.resolveFeedbackVisible=false
                            this.getTableItems()
                        }else{
                            this.message('error',res.message)
                        }
                        setTimeout(()=>{
                            this.btnLoading=false
                        },500)
                    })
                } else {
                    return false;
                }
            })
        },
        handleExceed(files, fileList) {
            this.message('warning',`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件`);
        },

    }
}
</script>
<style lang="scss" scoped>
#feedback{
    .solve-style{
        width: 100px;
    }
}
</style>
<style lang="scss">
#feedback{
    .accessory {
        span{
            border-bottom: 1px solid;
            word-break: break-all;
            white-space: normal;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            color:#1660c7;
        }
    }
}
</style>