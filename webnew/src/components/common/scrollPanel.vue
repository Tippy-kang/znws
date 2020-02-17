<template>
    <div class="scroll-container" ref="scrollContainer">
      <el-tag type="default" class="leftTag tags"  @click="handleScroll(1)">
        <<
      </el-tag>
      <div style="position: relative;">
        <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
          <span>
            <slot></slot>
          </span>
        </div>
      </div>
      <el-tag type="default" class="rightTag tags" @click="handleScroll(-1)">
        >>
      </el-tag>
    </div>
  </template>
  
  <script>
    const padding = 1;
    export default {
      name: 'scrollPane', 
      data() {
        return {
          left: 0
        }
      },
      computed: {
        tagLen() {
          if(this.$store.state.app.visitedViews.length > 1){
            return this.$store.state.app.visitedViews.length
          }
        },
        tagsWidth(){
          return this.$store.state.app.maxTableWidth
        }
      },
      watch: {
        tagLen(val){
          if(val){
            setTimeout(()=>{
              this.handleScroll(2)
            },500)
          }
        },
        tagsWidth(val){
          this.handleScroll(2)
        }
      },
      methods: {
        handleScroll(e) {
          
          let left = this.left ;
          const $container = this.$refs.scrollContainer;
          const $containerWidth = $container.offsetWidth;
          const $wrapper = this.$refs.scrollWrapper;
          const $wrapperWidth = $wrapper.offsetWidth;

          
          
          let wheelDelta 
          if (e === 1) {
            wheelDelta = 300
            this.left = Math.min(0, left + wheelDelta)
            
          } else if(e === -1){
            wheelDelta = -300
            if ($containerWidth - padding < $wrapperWidth) {
              if (left < -($wrapperWidth - $containerWidth + padding)) {
                this.left = left;
              } else {
                this.left = Math.max(left + wheelDelta, $containerWidth - $wrapperWidth - padding)
              }
            } else {
              this.left = 0;
            }
          }else {
            if($containerWidth - $wrapperWidth - this.left > 1 && this.left < 0){
              this.left = Math.max(this.left, $containerWidth - $wrapperWidth - padding - 10)
              if(this.left > 0){
                  this.left = 0
              }

            }
          }
        },
        moveToTarget($target) {
          const $container = this.$refs.scrollContainer;
          const $containerWidth = $container.offsetWidth;
          const $targetLeft = $target.offsetLeft;
          const $targetWidth = $target.offsetWidth;
          
          if ($targetLeft < -this.left) {
            // tag in the left
            this.left = -$targetLeft + padding + 44
          } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
            
          } else {
            this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding) - 44
          }
          
        }
      },
      mounted () {
        
      }
    }
  
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    
    .scroll-container {
      .tags {
        cursor: pointer;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currentlynot supported by any browser */
        &.leftTag {
          position: absolute;
          left: 0;
          border-left: 1px solid #EEEEEE;
          z-index: 2;
        }
        &.rightTag{
          position: absolute;
          right: 0;
          border-left: 1px solid #EEEEEE;
        }
      }
      white-space: nowrap;
      position: relative;
      // overflow: hidden;
      height: 34px;
      background: #fff;
      .scroll-wrapper {
        padding: 0px 34px;
        position: absolute;
        // left: 0 !important;
      }
    }
</style>
