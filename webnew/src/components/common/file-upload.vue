<template>
  <div class="file">
    <el-upload 
      ref="fileRef"
      :action="action"
      :headers="headers"
      :data="data"
      :multiple="multiple"
      :name="name"
      with-credentials
      :show-file-list="showFileList"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :on-remove="onRemove"
      :on-change="onChange"
      :on-success="onSuccess"
      :on-error="onError"
      :file-list="fileList"
      :auto-upload="autoUpload"
      :disabled="disabled"
      :limit="limit"
      :on-exceed="onExceed"
      :accept="accept" 
      :on-preview="onPreview"
      class="upload-demo">
      <el-button slot="trigger" class="normalBtn "  ref="uploadBtn" size="mini" type="primary"  :disabled="fileDisabled">点击上传</el-button>
    </el-upload>
		<div class="shadeCover" :style="`width:${coverSty.width}px;height:${coverSty.height}px;display:${coverSty.display}`"></div>
    <!-- <el-button size="mini" type="primary" class="btnDisable normalBtn" v-if="fileDisabled" :disabled='fileDisabled'>点击上传</el-button> -->
  </div>
</template>
 
<script>
export default {
  name: 'Upload',
  props: {
    //编辑确认时，必为true 删除之前上传的文件
    isdelete:{ //是否删除编辑中上传的文件
      type:Boolean,
      required: true,
      default:false
    },
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: 'file'
    },
    showFileList: {
      type: Boolean, 
      default: true
    },
    beforeRemove: {
      type: Function
    },
    onError: {
      type: Function
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 0
    },
    onPreview: {
      type: Function
    },
    onDelete: {
      type: Function
    },
	},
	data () {
		return {
      coverSty:{ //遮罩框样式
        width:0,
        height:0,
        display:'none'
      },
			
      fileDisabled:false,
      isMounted: false,
      // fileNum: 0 , //上传的文件个数
      // succFiles: 0 , //上传成功的文件个数
      deleteFiles: [], //删除的编辑中已上传的文件
      responseArr :[],
      loadingStatus:false //确定按钮的状态
		}
	},
	computed: {
		uploadFiles(){
      if(!this.isMounted)
        return [];
      else {
        return this.$refs.fileRef.uploadFiles
      }
    }
  },
  watch: {
    uploadFiles(val){
      if(this.limit){
        if(val.length < this.limit){
          this.fileDisabled = false
        }else{
          this.fileDisabled = true
        }
      }
      
      //判断所有文件传输是否完成的
      this.responseArr = val.map(el=>{
        let resObj = {
          uid:el.uid,
          resStuatus: 0  //0未传输完 
        }
        if(el.id){
          resObj.resStuatus = 1
        }else if(el.raw && el.response){
          resObj.resStuatus = 1
        }
        return resObj
      })
    },
    responseArr:{
      handler(newVal, oldVal) {
        this.loadingStatus = false
        
        newVal.forEach(el=>{
          if(el.resStuatus === 0){
            this.loadingStatus = true
          }
        })
        
      },
      deep: true
    },
    //根据状态 启用 禁用上传按钮
    fileDisabled(val){
      if(val){
        this.coverSty.display = 'block'
      }else {
        this.coverSty.display = 'none'
      }
    }
  },
  methods: {
    beforeUpload(file) {                 
        // var testmsg=file.name.substring(file.name.lastIndexOf('.'))     
        
        // var typeArr = this.accept.split(',')
        // typeArr.indexOf(testmsg)
        
        // const extension = testmsg === 'xls'
        
        const isLt2M = file.size / 1024 / 1024 < window.Glod.uploadSize
        // // if(!extension && !extension2) {
        // //   this.message('warning','上传文件只能是 xls、xlsx格式!');
        // // }
        if(!isLt2M) {
          this.message('warning','系统单文件最大'+window.Glod.uploadSize+'M，超出请线下申报');
        }
        // // return extension && isLt2M
        return isLt2M
    },
		onSuccess(response, file, fileList){
			if (file.response.code == '500') {
        fileList.splice(fileList.indexOf(file), 1)
        this.message('warning', file.response.message)
      }else {
        this.responseArr.forEach(el=>{
          if(el.uid === file.uid){
            el.resStuatus = 1
        }})
      }
		},
		onExceed(files, fileList){
      
			this.message('warning', '当前限制最多上传'+ this.limit +'个文件')
		},
		onChange(file, fileList){
      // if(file.raw && !file.response){
      //   this.fileNum +=1
      // }else if(file.raw && file.response){
      //   this.succFiles +=1
      // }
    },
    onRemove(file, fileList){
      this.fileDisabled = false;
      if(file.response && file.raw){
        let id = file.response.data.id
        this.deleteFile(id)
      }else if(!file.response && !file.raw){
        this.deleteFiles.push(file)
      }else if(!file.response && file.raw){
        // this.fileNum -=1
      }
    },
    //删除文件
    deleteFile(id){
      this.$http.postJSON('file/deleteFile',{id:id}).then(res => {
        if (res.code === 200) {
          // this.message('success', res.message)
        } else {
          this.message('error', res.message)
        }
      })
    }

	},
	mounted () {
    
		this.coverSty.width = this.$refs.uploadBtn.$el.offsetWidth
		this.coverSty.height = this.$refs.uploadBtn.$el.offsetHeight

    //因计算属性中$refs为undefined  需定义一个isMounted变量，并将其引入到计算属性中,确保计算属性正常运行
    this.isMounted = true
		
  },
  beforeDestroy(){
    
    if(this.isdelete){
      this.deleteFiles.forEach(el=>{
        this.deleteFile(el.id)
      })
    }else {
      this.uploadFiles.forEach(file=>{
        if(file.response && file.raw){
          let id = file.response.data.id
          this.deleteFile(id)
        }
      })
    }
    
  }
}
</script>
 
<style lang="scss" scoped>
.file {
	position: relative;
	.shadeCover {
		position: absolute;
		top: 0;
		left: 0;
		// background: #000;
		cursor:not-allowed;
	}
}

</style>